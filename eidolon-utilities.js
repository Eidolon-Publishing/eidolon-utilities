var Ta = Object.defineProperty;
var Al = Object.getPrototypeOf;
var Nl = Reflect.get;
var Ea = (e) => {
  throw TypeError(e);
};
var _l = (e, t, n) => t in e ? Ta(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var s = (e, t) => Ta(e, "name", { value: t, configurable: !0 });
var Ve = (e, t, n) => _l(e, typeof t != "symbol" ? t + "" : t, n), xr = (e, t, n) => t.has(e) || Ea("Cannot " + n);
var h = (e, t, n) => (xr(e, t, "read from private field"), n ? n.call(e) : t.get(e)), M = (e, t, n) => t.has(e) ? Ea("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, n), O = (e, t, n, i) => (xr(e, t, "write to private field"), i ? i.call(e, n) : t.set(e, n), n), w = (e, t, n) => (xr(e, t, "access private method"), n);
var ft = (e, t, n) => Nl(Al(e), n, t);
const L = "eidolon-utilities", Ni = "timeTriggerActive", Jr = "timeTriggerHideWindow", Yr = "timeTriggerShowPlayerWindow", Qr = "timeTriggerAllowRealTime", es = "timeTriggers", hi = "timeTriggerHistory", Xr = "debug", Zr = "timeFormat", eo = "manageTime", to = "secondsPerRound";
const Fl = [-30, -15, -5, 5, 15, 30], rn = 1440 * 60, pi = "playSound", Wn = 6;
function g(e, t) {
  var n, i;
  return (i = (n = game.i18n) == null ? void 0 : n.has) != null && i.call(n, e) ? game.i18n.localize(e) : t;
}
s(g, "localize");
function _i(e) {
  return typeof e != "string" ? "" : e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
s(_i, "escapeHtml");
function Ye(e) {
  var t;
  return e == null ? e : (t = foundry == null ? void 0 : foundry.utils) != null && t.duplicate ? foundry.utils.duplicate(e) : JSON.parse(JSON.stringify(e));
}
s(Ye, "duplicateData");
function Dl() {
  var e;
  return (e = foundry == null ? void 0 : foundry.utils) != null && e.randomID ? foundry.utils.randomID() : typeof (crypto == null ? void 0 : crypto.randomUUID) == "function" ? crypto.randomUUID() : Math.random().toString(36).slice(2, 10);
}
s(Dl, "generateTriggerId");
function ts(e) {
  if (typeof e != "string") return null;
  const t = e.trim();
  if (!t) return null;
  const n = t.match(/^([0-9]{1,2}):([0-9]{2})(?::([0-9]{2}))?$/);
  if (!n) return null;
  const i = Number(n[1]), r = Number(n[2]), o = n[3] !== void 0 ? Number(n[3]) : 0;
  return !Number.isInteger(i) || !Number.isInteger(r) || !Number.isInteger(o) || i < 0 || i > 23 || r < 0 || r > 59 || o < 0 || o > 59 ? null : i * 3600 + r * 60 + o;
}
s(ts, "parseTriggerTimeToSeconds");
function Cn() {
  var e, t;
  return ((e = game.scenes) == null ? void 0 : e.current) ?? ((t = game.scenes) == null ? void 0 : t.active) ?? null;
}
s(Cn, "getActiveScene");
function Qe(e) {
  return (e == null ? void 0 : e.object) ?? (e == null ? void 0 : e.document) ?? null;
}
s(Qe, "getSceneFromApplication");
function Le(e) {
  return e && typeof e.getFlag == "function" && typeof e.setFlag == "function";
}
s(Le, "hasSceneDocument");
const no = /* @__PURE__ */ new Set(), io = /* @__PURE__ */ new Set(), ro = /* @__PURE__ */ new Set(), oo = /* @__PURE__ */ new Set();
let Gt = !1, Mn = !1, Fi = Wn, Di = "12h", Ca = !1;
function Rr(e) {
  Gt = !!e;
  for (const t of no)
    try {
      t(Gt);
    } catch (n) {
      console.error(`${L} | Debug change handler failed`, n);
    }
}
s(Rr, "notifyDebugChange");
function $r(e) {
  Mn = !!e;
  for (const t of io)
    try {
      t(Mn);
    } catch (n) {
      console.error(`${L} | Manage time change handler failed`, n);
    }
}
s($r, "notifyManageTimeChange");
function ns(e) {
  return e === "24h" ? "24h" : "12h";
}
s(ns, "normalizeTimeFormatValue");
function Wo(e) {
  const t = Number(e);
  return !Number.isFinite(t) || t <= 0 ? Wn : t;
}
s(Wo, "normalizeSecondsPerRoundValue");
function Hr(e) {
  const t = Wo(e);
  Fi = t;
  for (const n of ro)
    try {
      n(t);
    } catch (i) {
      console.error(`${L} | Seconds-per-round change handler failed`, i);
    }
}
s(Hr, "notifySecondsPerRoundChange");
function Pr(e) {
  const t = ns(e);
  Di = t;
  for (const n of oo)
    try {
      n(t);
    } catch (i) {
      console.error(`${L} | Time format change handler failed`, i);
    }
}
s(Pr, "notifyTimeFormatChange");
function kl() {
  var t;
  if (Ca) return;
  if (Ca = !0, !((t = game == null ? void 0 : game.settings) != null && t.register)) {
    console.warn(
      `${L} | game.settings.register is unavailable. Module settings could not be registered.`
    );
    return;
  }
  const e = typeof game.settings.registerChange == "function";
  game.settings.register(L, Xr, {
    name: g("EIDOLON.TimeTrigger.DebugSettingName", "Enable debug logging"),
    hint: g(
      "EIDOLON.TimeTrigger.DebugSettingHint",
      "Write detailed time-trigger diagnostics to the browser console."
    ),
    scope: "world",
    config: !0,
    type: Boolean,
    default: !1,
    onChange: e ? void 0 : Rr
  }), e && game.settings.registerChange(L, Xr, Rr), Gt = Ko(), Rr(Gt), game.settings.register(L, eo, {
    name: g("EIDOLON.TimeTrigger.ManageTimeSettingName", "Manage Game Time"),
    hint: g(
      "EIDOLON.TimeTrigger.ManageTimeSettingHint",
      "Allow Eidolon Utilities to advance world time automatically while the game is unpaused. Warning: This may conflict with other time-management modules."
    ),
    scope: "world",
    config: !0,
    type: Boolean,
    default: !1,
    onChange: e ? void 0 : $r
  }), e && game.settings.registerChange(L, eo, $r), Mn = Rl(), $r(Mn), game.settings.register(L, to, {
    name: g(
      "EIDOLON.TimeTrigger.SecondsPerRoundSettingName",
      "Seconds Per Combat Round"
    ),
    hint: g(
      "EIDOLON.TimeTrigger.SecondsPerRoundSettingHint",
      "Amount of world seconds to add whenever a combat round ends while time management is active."
    ),
    scope: "world",
    config: !0,
    type: Number,
    default: Wn,
    range: { min: 1, max: 3600, step: 1 },
    onChange: e ? void 0 : Hr
  }), e && game.settings.registerChange(
    L,
    to,
    Hr
  ), Fi = Wo($l()), Hr(Fi), game.settings.register(L, Zr, {
    name: g("EIDOLON.TimeTrigger.TimeFormatSettingName", "Trigger Time Format"),
    hint: g(
      "EIDOLON.TimeTrigger.TimeFormatSettingHint",
      "Control whether trigger times use a 12-hour or 24-hour clock."
    ),
    scope: "world",
    config: !0,
    type: String,
    choices: {
      "12h": g(
        "EIDOLON.TimeTrigger.TimeFormatSettingChoice12Hour",
        "12-hour (e.g. 2:30 PM)"
      ),
      "24h": g(
        "EIDOLON.TimeTrigger.TimeFormatSettingChoice24Hour",
        "24-hour (e.g. 14:30)"
      )
    },
    default: "12h",
    onChange: e ? void 0 : Pr
  }), e && game.settings.registerChange(L, Zr, Pr), Di = ns(is()), Pr(Di);
}
s(kl, "registerTimeTriggerSettings");
function Ko() {
  var e;
  try {
    if ((e = game == null ? void 0 : game.settings) != null && e.get)
      return !!game.settings.get(L, Xr);
  } catch (t) {
    console.error(`${L} | Failed to read debug setting`, t);
  }
  return !1;
}
s(Ko, "getDebugSetting");
function xl() {
  return Gt = Ko(), Gt;
}
s(xl, "refreshDebugSettingCache");
function Rl() {
  var e;
  try {
    if ((e = game == null ? void 0 : game.settings) != null && e.get)
      return !!game.settings.get(L, eo);
  } catch (t) {
    console.error(`${L} | Failed to read manage time setting`, t);
  }
  return !1;
}
s(Rl, "getManageTimeSetting");
function is() {
  var e;
  try {
    if ((e = game == null ? void 0 : game.settings) != null && e.get)
      return game.settings.get(L, Zr) === "24h" ? "24h" : "12h";
  } catch (t) {
    console.error(`${L} | Failed to read time format setting`, t);
  }
  return "12h";
}
s(is, "getTimeFormatSetting");
function $l() {
  var e;
  try {
    if ((e = game == null ? void 0 : game.settings) != null && e.get) {
      const t = game.settings.get(L, to);
      return Wo(t);
    }
  } catch (t) {
    console.error(`${L} | Failed to read seconds-per-round setting`, t);
  }
  return Wn;
}
s($l, "getSecondsPerRoundSetting");
function Hl(e) {
  if (typeof e != "function")
    return () => {
    };
  no.add(e);
  try {
    e(Gt);
  } catch (t) {
    console.error(`${L} | Debug change handler failed`, t);
  }
  return () => {
    no.delete(e);
  };
}
s(Hl, "onDebugSettingChange");
function rs(e) {
  if (typeof e != "function")
    return () => {
    };
  io.add(e);
  try {
    e(Mn);
  } catch (t) {
    console.error(`${L} | Manage time change handler failed`, t);
  }
  return () => {
    io.delete(e);
  };
}
s(rs, "onManageTimeSettingChange");
function Jo(e) {
  if (typeof e != "function")
    return () => {
    };
  oo.add(e);
  try {
    e(Di);
  } catch (t) {
    console.error(`${L} | Time format change handler failed`, t);
  }
  return () => {
    oo.delete(e);
  };
}
s(Jo, "onTimeFormatSettingChange");
function Pl(e) {
  if (typeof e != "function")
    return () => {
    };
  ro.add(e);
  try {
    e(Fi);
  } catch (t) {
    console.error(`${L} | Seconds-per-round change handler failed`, t);
  }
  return () => {
    ro.delete(e);
  };
}
s(Pl, "onSecondsPerRoundSettingChange");
let Lr = !1, ao = !1;
function so(e) {
  Lr = !!e;
}
s(so, "updateDebugState");
function os() {
  ao || (ao = !0, so(Ko()), Hl((e) => {
    so(e), console.info(`${L} | Debug ${Lr ? "enabled" : "disabled"}`);
  }));
}
s(os, "ensureInitialized");
function Yo() {
  return ao || os(), Lr;
}
s(Yo, "shouldLog");
function as(e) {
  if (!e.length)
    return [`${L} |`];
  const [t, ...n] = e;
  return typeof t == "string" ? [`${L} | ${t}`, ...n] : [`${L} |`, t, ...n];
}
s(as, "formatArgs");
function Bl() {
  os();
}
s(Bl, "initializeDebug");
function ql() {
  return so(xl()), Lr;
}
s(ql, "syncDebugState");
function S(...e) {
  Yo() && console.debug(...as(e));
}
s(S, "debugLog");
function dn(...e) {
  Yo() && console.group(...as(e));
}
s(dn, "debugGroup");
function Ct() {
  Yo() && console.groupEnd();
}
s(Ct, "debugGroupEnd");
function on(e) {
  var r;
  const t = (r = e == null ? void 0 : e.getFlag) == null ? void 0 : r.call(e, L, es);
  if (!t) return [];
  const n = Ye(t), i = Array.isArray(n) ? n : [];
  return S("Loaded time triggers", {
    sceneId: (e == null ? void 0 : e.id) ?? null,
    count: i.length
  }), i;
}
s(on, "getTimeTriggers");
async function ss(e, t) {
  e != null && e.setFlag && (S("Persisting time triggers", {
    sceneId: e.id,
    count: Array.isArray(t) ? t.length : 0
  }), await e.setFlag(L, es, t));
}
s(ss, "setTimeTriggers");
function Ul(e) {
  var r;
  const t = (r = e == null ? void 0 : e.getFlag) == null ? void 0 : r.call(e, L, hi);
  if (!t) return {};
  const n = Ye(t);
  if (!n || typeof n != "object") return {};
  const i = {};
  for (const [o, a] of Object.entries(n))
    typeof a == "number" && Number.isFinite(a) && (i[o] = a);
  return S("Loaded time trigger history", {
    sceneId: (e == null ? void 0 : e.id) ?? null,
    keys: Object.keys(i)
  }), i;
}
s(Ul, "getTimeTriggerHistory");
async function Br(e, t) {
  var c, u, d, f;
  if (!e) return;
  const n = {};
  if (t && typeof t == "object")
    for (const [m, y] of Object.entries(t))
      typeof y == "number" && Number.isFinite(y) && (n[m] = y);
  const i = ((c = e.getFlag) == null ? void 0 : c.call(e, L, hi)) ?? {}, r = {};
  if (i && typeof i == "object")
    for (const [m, y] of Object.entries(i))
      typeof y == "number" && Number.isFinite(y) && (r[m] = y);
  const o = Object.keys(n), a = Object.keys(r);
  if (typeof ((u = foundry == null ? void 0 : foundry.utils) == null ? void 0 : u.deepEqual) == "function" ? foundry.utils.deepEqual(r, n) : JSON.stringify(r) === JSON.stringify(n)) {
    S("Skip history update because state is unchanged", {
      sceneId: (e == null ? void 0 : e.id) ?? null
    });
    return;
  }
  S("Updating time trigger history", {
    sceneId: (e == null ? void 0 : e.id) ?? null,
    keys: o,
    removedKeys: a.filter((m) => !o.includes(m))
  });
  try {
    a.length && typeof e.unsetFlag == "function" && await e.unsetFlag(L, hi), o.length && await e.setFlag(L, hi, n);
  } catch (m) {
    console.error(`${L} | Failed to persist time trigger history`, m), (f = (d = ui.notifications) == null ? void 0 : d.error) == null || f.call(
      d,
      g(
        "EIDOLON.TimeTrigger.HistoryPersistError",
        "Failed to persist the scene's time trigger history."
      )
    );
  }
}
s(Br, "updateTimeTriggerHistory");
const ki = /* @__PURE__ */ new Map(), La = /* @__PURE__ */ new Set();
function jl(e) {
  if (!(e != null && e.id))
    throw new Error(`${L} | Action definitions require an id.`);
  if (ki.has(e.id))
    throw new Error(`${L} | Duplicate time trigger action id: ${e.id}`);
  ki.set(e.id, {
    ...e
  }), S("Registered time trigger action", { actionId: e.id });
}
s(jl, "registerAction");
function Kn(e) {
  return ki.get(e) ?? null;
}
s(Kn, "getAction");
function Vl(e) {
  const t = Kn(e);
  return t ? typeof t.label == "function" ? t.label() : t.label : e;
}
s(Vl, "getActionLabel");
function wa() {
  return Array.from(ki.values());
}
s(wa, "listActions");
async function ls(e, t) {
  var i, r;
  const n = Kn(t == null ? void 0 : t.action);
  if (!n || typeof n.execute != "function") {
    const o = g(
      "EIDOLON.TimeTrigger.UnknownAction",
      "Encountered an unknown time trigger action and skipped it."
    );
    (r = (i = ui.notifications) == null ? void 0 : i.warn) == null || r.call(i, o), console.warn(`${L} | Unknown time trigger action`, t), S("Encountered unknown time trigger action", {
      triggerId: (t == null ? void 0 : t.id) ?? null,
      actionId: (t == null ? void 0 : t.action) ?? null
    });
    return;
  }
  S("Executing action handler", {
    actionId: n.id,
    triggerId: (t == null ? void 0 : t.id) ?? null,
    sceneId: (e == null ? void 0 : e.id) ?? null
  }), await n.execute({ scene: e, trigger: t });
}
s(ls, "executeTriggerAction");
function zl(e) {
  const t = Kn(e == null ? void 0 : e.action);
  return !t || typeof t.buildSummaryParts != "function" ? [] : t.buildSummaryParts({ trigger: e, escapeHtml: _i, localize: g }) ?? [];
}
s(zl, "buildActionSummaryParts");
function Gl(e) {
  const t = Kn(e == null ? void 0 : e.action);
  return !t || typeof t.buildFormContent != "function" ? "" : t.buildFormContent({ trigger: e, escapeHtml: _i, localize: g }) ?? "";
}
s(Gl, "buildActionFormSection");
function Wl(e, t) {
  const n = Kn(e == null ? void 0 : e.action);
  !n || typeof n.prepareFormData != "function" || n.prepareFormData({ trigger: e, formData: t });
}
s(Wl, "applyActionFormData");
function Kl(e, t, n) {
  var o, a;
  const i = `${(e == null ? void 0 : e.id) ?? "unknown"}:${(t == null ? void 0 : t.id) ?? (t == null ? void 0 : t.action) ?? "unknown"}:${n}`;
  if (La.has(i)) return;
  La.add(i);
  const r = g(
    "EIDOLON.TimeTrigger.MissingDataWarning",
    "A scene time trigger is missing required data and was skipped."
  );
  (a = (o = ui.notifications) == null ? void 0 : o.warn) == null || a.call(o, r), console.warn(`${L} | Missing trigger data (${n})`, { scene: e == null ? void 0 : e.id, trigger: t });
}
s(Kl, "warnMissingTriggerData");
async function Jl({ scene: e, trigger: t }) {
  var o, a, l, c, u;
  const n = (l = (a = (o = t == null ? void 0 : t.data) == null ? void 0 : o.path) == null ? void 0 : a.trim) == null ? void 0 : l.call(a);
  if (!n) {
    Kl(e, t, "missing-audio-path");
    return;
  }
  const i = {
    src: n,
    autoplay: !0,
    loop: !1
  }, r = (() => {
    var d, f, m, y, b;
    return typeof ((f = (d = foundry == null ? void 0 : foundry.audio) == null ? void 0 : d.AudioHelper) == null ? void 0 : f.play) == "function" ? foundry.audio.AudioHelper.play(i, !0) : typeof ((y = (m = game == null ? void 0 : game.audio) == null ? void 0 : m.constructor) == null ? void 0 : y.play) == "function" ? game.audio.constructor.play(i, !0) : typeof ((b = game == null ? void 0 : game.audio) == null ? void 0 : b.play) == "function" ? game.audio.play(i, !0) : null;
  })();
  if (!r) {
    console.error(`${L} | Foundry audio helper is unavailable`), (u = (c = ui.notifications) == null ? void 0 : c.error) == null || u.call(
      c,
      g(
        "EIDOLON.TimeTrigger.AudioHelperUnavailable",
        "Unable to play audio for a time trigger because the Foundry audio helper is unavailable."
      )
    );
    return;
  }
  await r;
}
s(Jl, "executePlaySoundAction");
jl({
  id: pi,
  label: /* @__PURE__ */ s(() => g("EIDOLON.TimeTrigger.ActionPlaySound", "Play Sound"), "label"),
  execute: Jl,
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
var Ya;
const { ApplicationV2: Jn, HandlebarsApplicationMixin: Yn } = ((Ya = foundry.applications) == null ? void 0 : Ya.api) ?? {};
if (!Jn || !Yn)
  throw new Error(
    `${L} | ApplicationV2 API unavailable. Update Foundry VTT to v13 or newer.`
  );
const wt = "AM", Wt = "PM";
function Lt() {
  return is();
}
s(Lt, "getConfiguredTimeFormat");
function wr(e) {
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
s(wr, "parseCanonicalTimeString");
function Je({ hours: e, minutes: t, seconds: n }) {
  if (!Number.isInteger(e) || !Number.isInteger(t) || e < 0 || e > 23 || t < 0 || t > 59) return null;
  const i = String(e).padStart(2, "0"), r = String(t).padStart(2, "0");
  if (Number.isInteger(n)) {
    if (n < 0 || n > 59) return null;
    const o = String(n).padStart(2, "0");
    return `${i}:${r}:${o}`;
  }
  return `${i}:${r}`;
}
s(Je, "formatCanonicalTime");
function Yl(e, { format: t } = {}) {
  if (!e || typeof e != "object") return null;
  const n = Number(e.hour), i = Number(e.minute), r = e.second !== void 0 && e.second !== null, o = r ? Number(e.second) : null, a = r && Number.isFinite(o) ? Math.floor(Math.max(0, Math.min(59, o))) : null;
  if (!Number.isFinite(n) || !Number.isFinite(i)) return null;
  const l = t ?? Lt();
  return xi(
    {
      hours: n,
      minutes: i,
      seconds: a
    },
    l
  );
}
s(Yl, "formatTimeComponentsForDisplay");
function Ql(e, { format: t } = {}) {
  const n = wr(e);
  if (!n) return "";
  const i = t ?? Lt();
  return xi(n, i);
}
s(Ql, "formatTriggerTimeForDisplay");
function xi(e, t = "12h") {
  if (!e) return "";
  const { hours: n, minutes: i, seconds: r = null } = e;
  if (!Number.isInteger(n) || !Number.isInteger(i)) return "";
  const o = Number.isInteger(r);
  if (t === "24h") {
    const m = `${String(n).padStart(2, "0")}:${String(i).padStart(2, "0")}`;
    return o ? `${m}:${String(r).padStart(2, "0")}` : m;
  }
  const a = n >= 12 ? Wt : wt, l = n % 12 === 0 ? 12 : n % 12, c = String(l), u = String(i).padStart(2, "0"), d = `${c}:${u}`, f = a === wt ? g("EIDOLON.TimeTrigger.TimePeriodAM", wt) : g("EIDOLON.TimeTrigger.TimePeriodPM", Wt);
  if (o) {
    const m = String(r).padStart(2, "0");
    return `${d}:${m} ${f}`;
  }
  return `${d} ${f}`;
}
s(xi, "formatTimeParts");
function Sa(e, t = Lt()) {
  const n = wr(e);
  if (t === "24h")
    return {
      format: t,
      canonical: n ? Je(n) ?? "" : "",
      hour: n ? String(n.hours).padStart(2, "0") : "",
      minute: n ? String(n.minutes).padStart(2, "0") : ""
    };
  if (!n)
    return {
      format: t,
      canonical: "",
      hour: "",
      minute: "",
      period: wt
    };
  const i = n.hours >= 12 ? Wt : wt, r = n.hours % 12 === 0 ? 12 : n.hours % 12;
  return {
    format: t,
    canonical: Je(n) ?? "",
    hour: String(r),
    minute: String(n.minutes).padStart(2, "0"),
    period: i
  };
}
s(Sa, "getTimeFormValues");
function Xl({ hour: e, minute: t, period: n, time: i }, r = Lt()) {
  if (r === "24h") {
    const y = typeof e == "string" ? e.trim() : "", b = typeof t == "string" ? t.trim() : "", p = typeof i == "string" ? i.trim() : "";
    if (!y && !b && p) {
      const I = wr(p);
      return I ? { canonical: Je(I) ?? "", error: null } : {
        canonical: "",
        error: g(
          "EIDOLON.TimeTrigger.TimeFormatInvalid24",
          "Enter a valid time in HH:MM format."
        )
      };
    }
    if (!y || !b)
      return {
        canonical: "",
        error: g("EIDOLON.TimeTrigger.TimeFormatMissing", "Enter a complete time.")
      };
    const T = Number(y), E = Number(b);
    return !Number.isInteger(T) || T < 0 || T > 23 ? {
      canonical: "",
      error: g(
        "EIDOLON.TimeTrigger.TimeFormatInvalid24",
        "Enter a valid time in HH:MM format."
      )
    } : !Number.isInteger(E) || E < 0 || E > 59 ? {
      canonical: "",
      error: g(
        "EIDOLON.TimeTrigger.TimeFormatInvalid24",
        "Enter a valid time in HH:MM format."
      )
    } : { canonical: Je({
      hours: T,
      minutes: E
    }) ?? "", error: null };
  }
  const o = typeof e == "string" ? e.trim() : "", a = typeof t == "string" ? t.trim() : "", l = typeof n == "string" ? n.trim().toUpperCase() : "";
  if (!o || !a || !l)
    return { canonical: "", error: g("EIDOLON.TimeTrigger.TimeFormatMissing", "Enter a complete time.") };
  if (l !== wt && l !== Wt)
    return { canonical: "", error: g("EIDOLON.TimeTrigger.TimeFormatInvalidPeriod", "Select AM or PM.") };
  const c = Number(o), u = Number(a);
  if (!Number.isInteger(c) || c < 1 || c > 12)
    return {
      canonical: "",
      error: g("EIDOLON.TimeTrigger.TimeFormatInvalidHour", "Hours must be between 1 and 12.")
    };
  if (!Number.isInteger(u) || u < 0 || u > 59)
    return {
      canonical: "",
      error: g("EIDOLON.TimeTrigger.TimeFormatInvalidMinute", "Minutes must be between 00 and 59.")
    };
  const d = c % 12, m = {
    hours: l === Wt ? d + 12 : d,
    minutes: u
  };
  return {
    canonical: Je(m) ?? "",
    error: null
  };
}
s(Xl, "normalizeFormTimeInput");
function Zl() {
  return [
    {
      value: wt,
      label: g("EIDOLON.TimeTrigger.TimePeriodAM", wt)
    },
    {
      value: Wt,
      label: g("EIDOLON.TimeTrigger.TimePeriodPM", Wt)
    }
  ];
}
s(Zl, "getPeriodOptions");
var kt, xt, Z, cs, Ji, Yi, us, co, uo, Qi, Xi, ds, fs, gs, fo, go, mo, Zi, er, ho, tr, ms, hs;
const Dt = class Dt extends Yn(Jn) {
  constructor(n = {}) {
    var a;
    const { scene: i, showControls: r, ...o } = n ?? {};
    super(o);
    M(this, Z);
    M(this, kt, null);
    M(this, xt, null);
    M(this, Ji, /* @__PURE__ */ s((n) => {
      var r, o;
      n.preventDefault();
      const i = Number((o = (r = n.currentTarget) == null ? void 0 : r.dataset) == null ? void 0 : o.delta);
      Number.isFinite(i) && (S("Time delta button clicked", { delta: i }), this._advanceTime(i));
    }, "#onDeltaClick"));
    M(this, Yi, /* @__PURE__ */ s((n) => {
      var i, r;
      n.preventDefault(), !(!this.showControls || !((i = game.user) != null && i.isGM)) && (S("Time value double clicked", { sceneId: ((r = this.scene) == null ? void 0 : r.id) ?? null }), w(this, Z, us).call(this));
    }, "#onTimeDoubleClick"));
    M(this, Qi, /* @__PURE__ */ s((n) => {
      if (this.isEditingTime && !this._commitTimeInProgress)
        if (n.key === "Enter") {
          n.preventDefault();
          const i = n.currentTarget, r = typeof (i == null ? void 0 : i.value) == "string" ? i.value : "";
          w(this, Z, uo).call(this, r);
        } else n.key === "Escape" && (n.preventDefault(), w(this, Z, co).call(this));
    }, "#onTimeInputKeydown"));
    M(this, Xi, /* @__PURE__ */ s((n) => {
      if (!this.isEditingTime || this._commitTimeInProgress || this._suppressBlurCommit) return;
      const i = n.currentTarget, r = typeof (i == null ? void 0 : i.value) == "string" ? i.value : "";
      w(this, Z, uo).call(this, r);
    }, "#onTimeInputBlur"));
    M(this, Zi, /* @__PURE__ */ s((n) => {
      const i = !!n;
      if (this.manageTimeEnabled === i) return;
      this.manageTimeEnabled = i, (this.rendered ?? this.isRendered ?? !1) && this.render({ force: !0 });
    }, "#handleManageTimeChange"));
    M(this, er, /* @__PURE__ */ s(async (n) => {
      var o, a, l, c, u, d, f, m, y;
      if (n.preventDefault(), !this.showControls || !((o = game.user) != null && o.isGM)) return;
      if (!this.manageTimeEnabled) {
        (l = (a = ui.notifications) == null ? void 0 : a.error) == null || l.call(
          a,
          g(
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
          g(
            "EIDOLON.TimeTrigger.SceneUnavailable",
            "The active scene is unavailable. Try again after reloading the world."
          )
        );
        return;
      }
      const r = !this.sceneAllowsRealTime;
      try {
        await i.setFlag(L, Qr, r), this.sceneAllowsRealTime = r;
        const b = r ? g(
          "EIDOLON.TimeTrigger.SceneRealTimeEnabled",
          "Automatic real-time flow enabled for this scene."
        ) : g(
          "EIDOLON.TimeTrigger.SceneRealTimeDisabled",
          "Automatic real-time flow disabled for this scene."
        );
        (f = (d = ui.notifications) == null ? void 0 : d.info) == null || f.call(d, b);
      } catch (b) {
        console.error(`${L} | Failed to toggle scene real-time flow`, b), (y = (m = ui.notifications) == null ? void 0 : m.error) == null || y.call(
          m,
          g(
            "EIDOLON.TimeTrigger.SceneRealTimeToggleError",
            "Failed to update the scene's real-time flow setting."
          )
        );
      } finally {
        this.render({ force: !0 });
      }
    }, "#onRealTimeToggleClick"));
    M(this, tr, /* @__PURE__ */ s(() => {
      (this.rendered ?? this.isRendered ?? !1) && (this.isEditingTime && (this.editValue = w(this, Z, fo).call(this)), this.render({ force: !0 }));
    }, "#handleTimeFormatChange"));
    this.scene = i ?? null, this.showControls = typeof r == "boolean" ? r : !!((a = game.user) != null && a.isGM), this.isEditingTime = !1, this.editValue = "", this._commitTimeInProgress = !1, this._suppressBlurCommit = !1, this.manageTimeEnabled = !1, this.sceneAllowsRealTime = w(this, Z, ho).call(this), O(this, kt, Jo(h(this, tr))), O(this, xt, rs(h(this, Zi)));
  }
  async _prepareContext() {
    var E, C;
    const n = ((E = game.time) == null ? void 0 : E.components) ?? {}, r = ((n == null ? void 0 : n.second) !== void 0 && (n == null ? void 0 : n.second) !== null ? Yl(n) : null) ?? w(this, Z, cs).call(this), o = Lt(), a = o === "24h", l = a ? g("EIDOLON.TimeTrigger.EditTimePlaceholder24", "HH:MM") : g("EIDOLON.TimeTrigger.EditTimePlaceholder12", "HH:MM AM/PM"), c = this.showControls ? g(
      "EIDOLON.TimeTrigger.EditTimeHint",
      "Double-click to set a specific time."
    ) : "", u = this.showControls ? g(
      "EIDOLON.TimeTrigger.EditTimeLabel",
      "New time (HH:MM or HH:MM AM/PM)"
    ) : "", d = Fl.map((I) => ({
      minutes: I,
      label: I > 0 ? `+${I}` : `${I}`
    })), f = !!this.manageTimeEnabled, m = w(this, Z, ho).call(this);
    this.sceneAllowsRealTime = m;
    const y = g(
      "EIDOLON.TimeTrigger.SceneRealTimeEnable",
      "Enable automatic real-time flow for this scene."
    ), b = g(
      "EIDOLON.TimeTrigger.SceneRealTimeDisable",
      "Disable automatic real-time flow for this scene."
    ), p = g(
      "EIDOLON.TimeTrigger.SceneRealTimeManageDisabled",
      "Enable Manage Time in module settings to allow automatic real-time flow."
    );
    return {
      formattedTime: r,
      deltas: d,
      manageTimeEnabled: f,
      sceneAllowsRealTime: m,
      realTimeButtonLabel: f ? m ? b : y : p,
      isGM: ((C = game.user) == null ? void 0 : C.isGM) ?? !1,
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
      return (this.rendered ?? this.isRendered ?? !1) || (S("TimeTriggerWindow close request rerendering", {
        sceneId: ((r = this.scene) == null ? void 0 : r.id) ?? null
      }), this.render({ force: !0 })), this;
    S("Closing time trigger window", { sceneId: ((o = this.scene) == null ? void 0 : o.id) ?? null, force: !0 });
    const i = await super.close(n);
    return w(this, Z, ms).call(this), w(this, Z, hs).call(this), i;
  }
  async _advanceTime(n) {
    var r, o, a, l, c, u, d;
    const i = n * 60;
    if (S("Advancing world time", { sceneId: ((r = this.scene) == null ? void 0 : r.id) ?? null, minutes: n, seconds: i }), !((o = game.user) != null && o.isGM)) {
      (l = (a = ui.notifications) == null ? void 0 : a.warn) == null || l.call(a, g("EIDOLON.TimeTrigger.GMOnly", "Only the GM can adjust time."));
      return;
    }
    try {
      await game.time.advance(i);
    } catch (f) {
      console.error(`${L} | Failed to advance time`, f), (u = (c = ui.notifications) == null ? void 0 : c.error) == null || u.call(
        c,
        g("EIDOLON.TimeTrigger.Error", "Failed to update the world time.")
      ), S("Failed to advance time from window", {
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
        S("Binding time trigger interactions", {
          sceneId: ((o = this.scene) == null ? void 0 : o.id) ?? null,
          buttonCount: r.querySelectorAll("[data-delta]").length
        }), r.querySelectorAll("[data-delta]").forEach((u) => {
          u.addEventListener("click", h(this, Ji));
        });
        const a = r.querySelector('.time-trigger-window__time-value[data-editable="true"]');
        a && a.addEventListener("dblclick", h(this, Yi), { once: !1 });
        const l = r.querySelector(".time-trigger-window__time-input");
        l && (l.addEventListener("keydown", h(this, Qi)), l.addEventListener("blur", h(this, Xi)), typeof l.focus == "function" && (l.focus(), typeof l.select == "function" && l.select()));
        const c = r.querySelector('[data-action="toggle-real-time"]');
        c && c.addEventListener("click", h(this, er));
      }
      this._suppressBlurCommit = !1;
    }
  }
};
kt = new WeakMap(), xt = new WeakMap(), Z = new WeakSet(), cs = /* @__PURE__ */ s(function() {
  var c;
  const n = (c = game.time) == null ? void 0 : c.worldTime;
  if (typeof n != "number" || !Number.isFinite(n)) return "";
  const i = 1440 * 60, r = (Math.floor(n) % i + i) % i, o = Math.floor(r / 3600), a = Math.floor(r % 3600 / 60), l = r % 60;
  return xi({ hours: o, minutes: a, seconds: l }, Lt());
}, "#formatFallbackTime"), Ji = new WeakMap(), Yi = new WeakMap(), us = /* @__PURE__ */ s(function() {
  var n;
  (n = game.user) != null && n.isGM && (this.isEditingTime = !0, this._suppressBlurCommit = !1, this.editValue = w(this, Z, fo).call(this), this.render({ force: !0 }));
}, "#enterTimeEditMode"), co = /* @__PURE__ */ s(function() {
  this.isEditingTime = !1, this.editValue = "", this._suppressBlurCommit = !1, this.render({ force: !0 });
}, "#cancelTimeEdit"), uo = /* @__PURE__ */ s(async function(n) {
  var o, a, l;
  if (!((o = game.user) != null && o.isGM) || !this.isEditingTime || this._commitTimeInProgress) return;
  this._commitTimeInProgress = !0;
  const i = typeof n == "string" ? n.trim() : "";
  if (!i) {
    w(this, Z, co).call(this), this._commitTimeInProgress = !1;
    return;
  }
  const r = w(this, Z, gs).call(this, i);
  if (r.error) {
    (l = (a = ui.notifications) == null ? void 0 : a.error) == null || l.call(a, r.error), this._suppressBlurCommit = !0, this.editValue = i, this.render({ force: !0 }), this._commitTimeInProgress = !1;
    return;
  }
  try {
    await w(this, Z, fs).call(this, r.seconds, r.includeSeconds) ? (this.isEditingTime = !1, this.editValue = "", this.render({ force: !0 })) : (this.editValue = i, this.render({ force: !0 }));
  } finally {
    this._commitTimeInProgress = !1;
  }
}, "#commitTimeInput"), Qi = new WeakMap(), Xi = new WeakMap(), ds = /* @__PURE__ */ s(function() {
  var u, d;
  const n = (u = game.time) == null ? void 0 : u.worldTime;
  if (typeof n != "number" || !Number.isFinite(n))
    return "";
  const i = ((d = game.time) == null ? void 0 : d.components) ?? {}, r = Number(i.hour), o = Number(i.minute), a = i.second !== void 0 ? Number(i.second) : null, l = Number.isInteger(a);
  return (Number.isFinite(r) && Number.isFinite(o) ? Je({
    hours: Math.max(0, Math.min(23, Number(r))),
    minutes: Math.max(0, Math.min(59, Number(o))),
    seconds: l && Number.isFinite(a) ? Math.max(0, Math.min(59, Number(a))) : void 0
  }) ?? "" : "") ?? "";
}, "#getCurrentCanonicalTime"), fs = /* @__PURE__ */ s(async function(n, i) {
  var m, y, b, p, T, E, C, I, D, _;
  const r = (m = game.time) == null ? void 0 : m.worldTime;
  if (typeof r != "number" || !Number.isFinite(r))
    return (b = (y = ui.notifications) == null ? void 0 : y.error) == null || b.call(
      y,
      g(
        "EIDOLON.TimeTrigger.EditTimeUnavailable",
        "The world time is unavailable, so it can't be updated."
      )
    ), !1;
  if (!Number.isInteger(n) || n < 0 || n >= rn)
    return (T = (p = ui.notifications) == null ? void 0 : p.error) == null || T.call(
      p,
      g(
        "EIDOLON.TimeTrigger.EditTimeInvalidRange",
        "Enter a time within the current day."
      )
    ), !1;
  const l = Math.floor(r / rn) * rn + n - r;
  if (!Number.isFinite(l) || l === 0)
    return !0;
  const c = Math.floor(n / 3600), u = Math.floor(n % 3600 / 60), d = n % 60, f = Je({
    hours: c,
    minutes: u,
    seconds: i ? d : void 0
  });
  try {
    S("Updating world time directly", {
      sceneId: ((E = this.scene) == null ? void 0 : E.id) ?? null,
      targetCanonical: f ?? null,
      diff: l
    }), await game.time.advance(l);
    const F = xi(
      {
        hours: c,
        minutes: u,
        seconds: i ? d : null
      },
      Lt()
    );
    (I = (C = ui.notifications) == null ? void 0 : C.info) == null || I.call(
      C,
      g(
        "EIDOLON.TimeTrigger.EditTimeSuccess",
        "World time updated."
      ) + (F ? ` ${F}` : "")
    );
  } catch (F) {
    return console.error(`${L} | Failed to set world time`, F), (_ = (D = ui.notifications) == null ? void 0 : D.error) == null || _.call(
      D,
      g(
        "EIDOLON.TimeTrigger.EditTimeError",
        "Failed to update the world time."
      )
    ), !1;
  }
  return !0;
}, "#applyTargetSeconds"), gs = /* @__PURE__ */ s(function(n) {
  var f;
  const i = g(
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
    const m = Number(o[1]), y = Number(o[2]), b = o[3] !== void 0 ? Number(o[3]) : void 0;
    if (Number.isInteger(m) && m >= 0 && m <= 23 && Number.isInteger(y) && y >= 0 && y <= 59 && (b === void 0 || Number.isInteger(b) && b >= 0 && b <= 59)) {
      const p = m * 3600 + y * 60 + (b ?? 0);
      return {
        canonical: Je({ hours: m, minutes: y, seconds: b }),
        seconds: p,
        includeSeconds: b !== void 0,
        error: null
      };
    }
    return { error: i };
  }
  const { amLower: a, pmLower: l, periodPattern: c } = w(this, Z, go).call(this), u = r.match(
    new RegExp(
      `^([0-9]{1,2}):([0-9]{2})(?::([0-9]{2}))?\\s*(${c})$`,
      "i"
    )
  );
  if (u) {
    let m = Number(u[1]);
    const y = Number(u[2]), b = u[3] !== void 0 ? Number(u[3]) : void 0, p = u[4] ?? "", T = typeof p == "string" ? ((f = p.toLocaleLowerCase) == null ? void 0 : f.call(p)) ?? p.toLowerCase() : "";
    if (Number.isInteger(m) && m >= 1 && m <= 12 && Number.isInteger(y) && y >= 0 && y <= 59 && (b === void 0 || Number.isInteger(b) && b >= 0 && b <= 59) && (T === a || T === l || T === "am" || T === "pm")) {
      m = m % 12, (T === l || T === "pm") && (m += 12);
      const C = m * 3600 + y * 60 + (b ?? 0);
      return {
        canonical: Je({ hours: m, minutes: y, seconds: b }),
        seconds: C,
        includeSeconds: b !== void 0,
        error: null
      };
    }
    return { error: i };
  }
  const d = ts(r);
  if (d !== null) {
    const m = Math.floor(d / 3600), y = Math.floor(d % 3600 / 60), b = d % 60, p = b !== 0;
    return {
      canonical: Je({
        hours: m,
        minutes: y,
        seconds: p ? b : void 0
      }),
      seconds: d,
      includeSeconds: p,
      error: null
    };
  }
  return { error: i };
}, "#parseInputTime"), fo = /* @__PURE__ */ s(function() {
  const n = w(this, Z, ds).call(this);
  if (!n) return "";
  if (Lt() === "24h")
    return n;
  const r = wr(n);
  if (!r) return n;
  const o = Number(r.hours), a = Number(r.minutes), l = r.seconds !== null && r.seconds !== void 0 ? Number(r.seconds) : void 0;
  if (!Number.isFinite(o) || !Number.isFinite(a)) return n;
  const c = Number.isFinite(l), u = o % 12 === 0 ? 12 : o % 12, d = String(a).padStart(2, "0"), f = c ? `:${String(l).padStart(2, "0")}` : "", { amLabel: m, pmLabel: y } = w(this, Z, go).call(this), b = o >= 12 ? y : m;
  return `${u}:${d}${f} ${b}`.trim();
}, "#getInitialEditValue"), go = /* @__PURE__ */ s(function() {
  var u, d;
  const n = g("EIDOLON.TimeTrigger.TimePeriodAM", "AM"), i = g("EIDOLON.TimeTrigger.TimePeriodPM", "PM"), r = ((u = n.toLocaleLowerCase) == null ? void 0 : u.call(n)) ?? n.toLowerCase(), o = ((d = i.toLocaleLowerCase) == null ? void 0 : d.call(i)) ?? i.toLowerCase(), a = w(this, Z, mo).call(this, n), l = w(this, Z, mo).call(this, i), c = `${a}|${l}|AM|PM`;
  return {
    amLabel: n,
    pmLabel: i,
    amLower: r,
    pmLower: o,
    periodPattern: c
  };
}, "#getPeriodMatchData"), mo = /* @__PURE__ */ s(function(n) {
  return typeof n != "string" ? "" : n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}, "#escapeForRegex"), Zi = new WeakMap(), er = new WeakMap(), ho = /* @__PURE__ */ s(function() {
  const n = this.scene;
  if (!n || typeof n.getFlag != "function") return !1;
  try {
    return !!n.getFlag(L, Qr);
  } catch (i) {
    S("TimeTriggerWindow | Failed to read scene real-time flag", {
      sceneId: (n == null ? void 0 : n.id) ?? null,
      message: (i == null ? void 0 : i.message) ?? String(i)
    });
  }
  return !1;
}, "#readSceneRealTimeFlag"), tr = new WeakMap(), ms = /* @__PURE__ */ s(function() {
  if (typeof h(this, kt) == "function")
    try {
      h(this, kt).call(this);
    } catch (n) {
      console.error(`${L} | Failed to dispose time format subscription`, n);
    }
  O(this, kt, null);
}, "#disposeTimeFormatSubscription"), hs = /* @__PURE__ */ s(function() {
  if (typeof h(this, xt) == "function")
    try {
      h(this, xt).call(this);
    } catch (n) {
      console.error(`${L} | Failed to dispose manage time subscription`, n);
    }
  O(this, xt, null);
}, "#disposeManageTimeSubscription"), s(Dt, "TimeTriggerWindow"), Ve(Dt, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  ft(Dt, Dt, "DEFAULT_OPTIONS"),
  {
    id: `${L}-time-trigger`,
    window: {
      title: g("EIDOLON.TimeTrigger.Title", "Time Trigger"),
      resizable: !1
    },
    position: {
      width: "auto",
      height: "auto"
    }
  },
  { inplace: !1 }
)), Ve(Dt, "PARTS", {
  content: {
    template: `modules/${L}/templates/time-trigger.html`
  }
});
let lo = Dt;
function Sr(e, t = {}) {
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
s(Sr, "createApplicationFactory");
const Ia = /* @__PURE__ */ new Set();
var ue, Ie, Rt, fn, ps, ys;
const da = class da {
  constructor({ windowFactory: t } = {}) {
    M(this, fn);
    M(this, ue, null);
    M(this, Ie, null);
    M(this, Rt);
    const n = Sr(lo);
    typeof t == "function" ? t.__eidolonFactorySignature === "options" ? O(this, Rt, (r, o = {}) => t({ scene: r, ...o ?? {} })) : O(this, Rt, t) : O(this, Rt, /* @__PURE__ */ s((r, o = {}) => n({ scene: r, ...o ?? {} }), "fallbackFactory"));
  }
  onReady() {
    var n;
    const t = typeof ((n = game.time) == null ? void 0 : n.worldTime) == "number" && Number.isFinite(game.time.worldTime) ? game.time.worldTime : null;
    S("TimeTriggerManager#onReady", { worldTime: t }), t !== null && O(this, Ie, t);
  }
  onCanvasReady(t) {
    const n = (t == null ? void 0 : t.scene) ?? Cn();
    S("TimeTriggerManager#onCanvasReady", { sceneId: (n == null ? void 0 : n.id) ?? null }), this.refreshTimeTriggerWindow(n), this.handleTimeTriggerEvaluation(n);
  }
  onUpdateScene(t) {
    const n = Cn();
    S("TimeTriggerManager#onUpdateScene", {
      sceneId: (t == null ? void 0 : t.id) ?? null,
      activeSceneId: (n == null ? void 0 : n.id) ?? null
    }), !(!n || t.id !== n.id) && (this.refreshTimeTriggerWindow(t), this.handleTimeTriggerEvaluation(t));
  }
  onUpdateWorldTime(t, n) {
    S("TimeTriggerManager#onUpdateWorldTime", {
      worldTime: t,
      diff: n,
      hasWindow: !!h(this, ue)
    }), h(this, ue) && h(this, ue).render();
    const i = Cn(), r = w(this, fn, ps).call(this, t, n);
    this.handleTimeTriggerEvaluation(i, t, r);
  }
  refreshTimeTriggerWindow(t) {
    var c, u, d;
    if (!t) return;
    const n = !!((c = game.user) != null && c.isGM), i = !!t.getFlag(L, Ni), r = !!t.getFlag(L, Jr), o = !!t.getFlag(L, Yr);
    if (S("TimeTriggerManager#refreshTimeTriggerWindow", {
      sceneId: t.id,
      isGM: n,
      isActive: i,
      hideWindow: r,
      showPlayerWindow: o
    }), !(i && !r && (n || o))) {
      h(this, ue) && (S("Closing time trigger window", { reason: "not-visible" }), h(this, ue).close({ force: !0 }), O(this, ue, null));
      return;
    }
    const l = !!n;
    if (h(this, ue) && ((u = h(this, ue).scene) == null ? void 0 : u.id) === t.id) {
      S("Refreshing existing time trigger window", { sceneId: t.id }), h(this, ue).showControls = l, h(this, ue).render();
      return;
    }
    h(this, ue) && (S("Closing existing window before creating new instance", {
      previousSceneId: ((d = h(this, ue).scene) == null ? void 0 : d.id) ?? null
    }), h(this, ue).close({ force: !0 })), O(this, ue, h(this, Rt).call(this, t, { showControls: l })), S("Rendering new time trigger window", { sceneId: t.id }), h(this, ue).render({ force: !0 });
  }
  async handleTimeTriggerEvaluation(t, n, i) {
    var c;
    const r = t ?? Cn();
    if (!r) {
      S("handleTimeTriggerEvaluation skipped", {
        reason: "no-active-scene",
        providedSceneId: (t == null ? void 0 : t.id) ?? null,
        currentWorldTime: n
      }), typeof n == "number" && Number.isFinite(n) && O(this, Ie, n);
      return;
    }
    const o = typeof n == "number" && Number.isFinite(n) ? n : typeof ((c = game.time) == null ? void 0 : c.worldTime) == "number" ? game.time.worldTime : null;
    if (o === null) return;
    const a = typeof i == "number" && Number.isFinite(i) ? i : null, l = a !== null ? a : typeof h(this, Ie) == "number" && Number.isFinite(h(this, Ie)) ? h(this, Ie) : o;
    dn("handleTimeTriggerEvaluation", {
      sceneId: r.id,
      previousWorldTime: l,
      currentWorldTime: o,
      overrideProvided: a !== null
    });
    try {
      await w(this, fn, ys).call(this, r, l, o);
    } catch (u) {
      console.error(`${L} | Unexpected error while evaluating time triggers`, u), S("handleTimeTriggerEvaluation error", { message: (u == null ? void 0 : u.message) ?? String(u) });
    } finally {
      O(this, Ie, o), Ct();
    }
  }
};
ue = new WeakMap(), Ie = new WeakMap(), Rt = new WeakMap(), fn = new WeakSet(), ps = /* @__PURE__ */ s(function(t, n) {
  return typeof h(this, Ie) == "number" && Number.isFinite(h(this, Ie)) ? (S("Resolved previous world time from cache", {
    previousWorldTime: h(this, Ie)
  }), h(this, Ie)) : typeof t == "number" && Number.isFinite(t) && typeof n == "number" && Number.isFinite(n) ? (S("Resolved previous world time using diff", {
    worldTime: t,
    diff: n,
    resolved: t - n
  }), t - n) : typeof t == "number" && Number.isFinite(t) ? t : null;
}, "#resolvePreviousWorldTime"), ys = /* @__PURE__ */ s(async function(t, n, i) {
  var b, p, T;
  if (!((b = game.user) != null && b.isGM)) {
    S("Skipping trigger evaluation because user is not a GM");
    return;
  }
  if (!(t != null && t.id)) {
    S("Skipping trigger evaluation because the scene is missing an id");
    return;
  }
  if (!!!t.getFlag(L, Ni)) {
    S("Skipping trigger evaluation because scene is inactive", { sceneId: t.id });
    return;
  }
  if (typeof i != "number" || !Number.isFinite(i)) return;
  (typeof n != "number" || !Number.isFinite(n)) && (n = i);
  const o = on(t);
  if (!o.length) {
    S("No time triggers configured for scene", { sceneId: t.id });
    return;
  }
  const a = Ul(t), l = /* @__PURE__ */ new Set();
  for (const E of o)
    E != null && E.id && l.add(E.id);
  let c = !1;
  for (const E of Object.keys(a))
    l.has(E) || (delete a[E], c = !0);
  if (dn("Evaluating scene time triggers", {
    sceneId: t.id,
    previousWorldTime: n,
    currentWorldTime: i,
    triggerCount: o.length
  }), i <= n) {
    S("Detected world time rewind", {
      previousWorldTime: n,
      currentWorldTime: i
    });
    for (const E of o) {
      if (!(E != null && E.id) || !E.allowReplayOnRewind) continue;
      const C = a[E.id];
      typeof C == "number" ? i < C ? (S("Clearing trigger history due to rewind", {
        triggerId: E.id,
        lastFired: C,
        currentWorldTime: i
      }), delete a[E.id], c = !0) : S("Preserving trigger history after rewind", {
        triggerId: E.id,
        lastFired: C,
        currentWorldTime: i
      }) : S("No history stored for rewind-enabled trigger", {
        triggerId: E.id
      });
    }
    c && (S("Persisting history cleanup after rewind", {
      sceneId: t.id
    }), await Br(t, a)), Ct();
    return;
  }
  const u = n, d = i, f = [], m = Math.floor(u / rn), y = Math.floor(d / rn);
  for (const E of o) {
    if (!(E != null && E.id)) continue;
    const C = ts(E.time);
    if (C === null) {
      ec(t, E), S("Skipping trigger with invalid time", {
        triggerId: E.id,
        time: E.time
      });
      continue;
    }
    for (let I = m; I <= y; I++) {
      const D = I * rn + C;
      if (D < u || D > d) continue;
      const F = a[E.id];
      if (typeof F == "number" && F >= D) {
        S("Skipping trigger because it already fired within window", {
          triggerId: E.id,
          lastFired: F,
          absoluteTime: D
        });
        continue;
      }
      f.push({ trigger: E, absoluteTime: D });
    }
  }
  if (!f.length) {
    c && await Br(t, a), S("No triggers scheduled to fire within evaluation window", {
      sceneId: t.id
    }), Ct();
    return;
  }
  f.sort((E, C) => E.absoluteTime - C.absoluteTime), S("Queued triggers for execution", {
    entries: f.map((E) => ({
      triggerId: E.trigger.id,
      absoluteTime: E.absoluteTime
    }))
  });
  for (const E of f)
    try {
      S("Executing time trigger action", {
        triggerId: E.trigger.id,
        absoluteTime: E.absoluteTime
      }), await ls(t, E.trigger);
    } catch (C) {
      console.error(`${L} | Failed to execute time trigger action`, C), (T = (p = ui.notifications) == null ? void 0 : p.error) == null || T.call(
        p,
        g(
          "EIDOLON.TimeTrigger.TriggerActionError",
          "Failed to execute a scene time trigger action. Check the console for details."
        )
      ), S("Trigger execution failed", {
        triggerId: E.trigger.id,
        message: (C == null ? void 0 : C.message) ?? String(C)
      });
    } finally {
      a[E.trigger.id] = E.absoluteTime, c = !0, S("Recorded trigger execution", {
        triggerId: E.trigger.id,
        absoluteTime: E.absoluteTime
      });
    }
  c && (S("Persisting trigger history updates", { sceneId: t.id }), await Br(t, a)), Ct();
}, "#evaluateSceneTimeTriggers"), s(da, "TimeTriggerManager");
let po = da;
function ec(e, t) {
  var r, o;
  const n = `${(e == null ? void 0 : e.id) ?? "unknown"}:${(t == null ? void 0 : t.id) ?? (t == null ? void 0 : t.time) ?? "unknown"}`;
  if (Ia.has(n)) return;
  Ia.add(n);
  const i = g(
    "EIDOLON.TimeTrigger.InvalidTimeWarning",
    "A scene time trigger has an invalid time value and was skipped."
  );
  (o = (r = ui.notifications) == null ? void 0 : r.warn) == null || o.call(r, i), console.warn(`${L} | Invalid time for trigger`, { scene: e == null ? void 0 : e.id, trigger: t });
}
s(ec, "warnInvalidTriggerTime");
var Pe, _n, Be, ht, $t, Ge, cn, nr, ir, Fn, Dn, Ht, We, k, bo, Zt, yi, To, bi, Eo, ze, bs, Co, Ts, Lo, Es, rr, or, ar, sr, lr, cr, wo, Cs, Ti, ur, dr;
const fa = class fa {
  constructor() {
    M(this, k);
    M(this, Pe, !1);
    M(this, _n, Wn);
    M(this, Be, /* @__PURE__ */ new Map());
    M(this, ht, null);
    M(this, $t, null);
    M(this, Ge, 0);
    M(this, cn, null);
    M(this, nr, null);
    M(this, ir, null);
    M(this, Fn, !1);
    M(this, Dn, !1);
    M(this, Ht, !1);
    M(this, We, !1);
    M(this, rr, /* @__PURE__ */ s((t, n = {}) => {
      S("GameTimeAutomation | Pause state changed", {
        paused: t,
        userId: (n == null ? void 0 : n.userId) ?? null,
        broadcast: (n == null ? void 0 : n.broadcast) ?? null
      }), w(this, k, ze).call(this, { pausedOverride: t });
    }, "#handlePause"));
    M(this, or, /* @__PURE__ */ s((t) => {
      t != null && t.id && (h(this, Be).set(t.id, Math.max(t.round ?? 0, 1)), S("GameTimeAutomation | Combat started", { combatId: t.id, round: t.round ?? 0 }), w(this, k, ze).call(this));
    }, "#handleCombatStart"));
    M(this, ar, /* @__PURE__ */ s((t, n) => {
      if (!(t != null && t.id)) return;
      const i = typeof n == "number" && Number.isFinite(n) ? n : typeof t.round == "number" && Number.isFinite(t.round) ? t.round : 0, r = i > 0 ? i : 1, o = h(this, Be).get(t.id), a = o ? Math.max(o, 1) : 1, l = r > 1 ? Math.max(r - a, 0) : 0;
      if (S("GameTimeAutomation | Combat round change detected", {
        combatId: t.id,
        effectiveRound: r,
        completedRounds: l,
        enabled: h(this, Pe),
        paused: (game == null ? void 0 : game.paused) ?? null
      }), l > 0 && h(this, Pe) && h(this, We) && !(game != null && game.paused) && w(this, k, Zt).call(this) && w(this, k, yi).call(this, t)) {
        const c = l * h(this, _n);
        c > 0 && (S("GameTimeAutomation | Advancing time for completed combat rounds", {
          combatId: t.id,
          completedRounds: l,
          delta: c
        }), w(this, k, Lo).call(this, c));
      }
      h(this, Be).set(t.id, Math.max(r, 1));
    }, "#handleCombatRound"));
    M(this, sr, /* @__PURE__ */ s((t) => {
      t != null && t.id && (h(this, Be).delete(t.id), S("GameTimeAutomation | Combat ended", { combatId: t.id }), w(this, k, ze).call(this));
    }, "#handleCombatEnd"));
    M(this, lr, /* @__PURE__ */ s((t) => {
      t != null && t.id && (h(this, Be).delete(t.id), S("GameTimeAutomation | Combat deleted", { combatId: t.id }), w(this, k, ze).call(this));
    }, "#handleCombatDelete"));
    M(this, cr, /* @__PURE__ */ s((t, n) => {
      if (t != null && t.id) {
        if (typeof (n == null ? void 0 : n.round) == "number" && Number.isFinite(n.round)) {
          const i = Math.max(n.round, 1);
          h(this, Be).set(t.id, i), S("GameTimeAutomation | Combat round manually updated", {
            combatId: t.id,
            round: i
          });
        }
        (Object.prototype.hasOwnProperty.call(n ?? {}, "active") || (n == null ? void 0 : n.round) !== void 0) && w(this, k, ze).call(this);
      }
    }, "#handleCombatUpdate"));
    M(this, ur, /* @__PURE__ */ s((t) => {
      w(this, k, Ti).call(this, t == null ? void 0 : t.scene), w(this, k, ze).call(this);
    }, "#handleCanvasReady"));
    M(this, dr, /* @__PURE__ */ s((t) => {
      if (!Le(t)) return;
      const n = w(this, k, wo).call(this);
      if (!n || n.id !== t.id) return;
      w(this, k, Ti).call(this, t) && w(this, k, ze).call(this);
    }, "#handleSceneUpdate"));
  }
  registerHooks() {
    h(this, Fn) || (O(this, Fn, !0), Hooks.on("pauseGame", h(this, rr)), Hooks.on("combatStart", h(this, or)), Hooks.on("combatRound", h(this, ar)), Hooks.on("combatEnd", h(this, sr)), Hooks.on("deleteCombat", h(this, lr)), Hooks.on("updateCombat", h(this, cr)), Hooks.on("canvasReady", h(this, ur)), Hooks.on("updateScene", h(this, dr)));
  }
  initialize() {
    h(this, Dn) || (O(this, Dn, !0), O(this, nr, rs((t) => {
      const n = !!t, i = n !== h(this, Pe);
      O(this, Pe, n), S("GameTimeAutomation | Manage time toggled", { enabled: n }), i && n && w(this, k, Eo).call(this), w(this, k, ze).call(this);
    })), O(this, ir, Pl((t) => {
      O(this, _n, t), S("GameTimeAutomation | Seconds per round updated", { value: t });
    })), w(this, k, Eo).call(this), w(this, k, Ti).call(this), w(this, k, ze).call(this));
  }
};
Pe = new WeakMap(), _n = new WeakMap(), Be = new WeakMap(), ht = new WeakMap(), $t = new WeakMap(), Ge = new WeakMap(), cn = new WeakMap(), nr = new WeakMap(), ir = new WeakMap(), Fn = new WeakMap(), Dn = new WeakMap(), Ht = new WeakMap(), We = new WeakMap(), k = new WeakSet(), bo = /* @__PURE__ */ s(function() {
  var t;
  try {
    if (typeof ((t = globalThis.performance) == null ? void 0 : t.now) == "function")
      return globalThis.performance.now();
  } catch (n) {
    S("GameTimeAutomation | Failed to read high-resolution timestamp", {
      message: (n == null ? void 0 : n.message) ?? String(n)
    });
  }
  return Date.now();
}, "#currentTimestamp"), Zt = /* @__PURE__ */ s(function() {
  var t;
  return !!((t = game == null ? void 0 : game.user) != null && t.isGM && game.user.active !== !1);
}, "#canControlTime"), yi = /* @__PURE__ */ s(function(t) {
  var i, r;
  if (!t) return !1;
  if (t.active === !0) return !0;
  if (t.active === !1) return !1;
  const n = (i = game == null ? void 0 : game.combats) == null ? void 0 : i.active;
  return (n == null ? void 0 : n.id) === t.id ? !0 : ((r = game == null ? void 0 : game.combat) == null ? void 0 : r.id) === t.id ? game.combat.active ?? !0 : !1;
}, "#isCombatDocumentActive"), To = /* @__PURE__ */ s(function(t) {
  return t ? typeof t.started == "boolean" ? t.started : (t.round ?? 0) > 0 : !1;
}, "#hasCombatStarted"), bi = /* @__PURE__ */ s(function() {
  var i;
  const t = Array.isArray((i = game == null ? void 0 : game.combats) == null ? void 0 : i.contents) ? game.combats.contents : [];
  for (const r of t)
    if (w(this, k, yi).call(this, r) && w(this, k, To).call(this, r))
      return !0;
  const n = game == null ? void 0 : game.combat;
  return !!(n && w(this, k, yi).call(this, n) && w(this, k, To).call(this, n));
}, "#isCombatRunning"), Eo = /* @__PURE__ */ s(function() {
  var n;
  h(this, Be).clear();
  const t = Array.isArray((n = game == null ? void 0 : game.combats) == null ? void 0 : n.contents) ? game.combats.contents : [];
  for (const i of t)
    i != null && i.id && h(this, Be).set(i.id, Math.max(i.round ?? 0, 1));
}, "#hydrateRoundTracking"), ze = /* @__PURE__ */ s(function({ pausedOverride: t } = {}) {
  const n = typeof t == "boolean" ? t : !!(game != null && game.paused), i = h(this, Pe), r = h(this, We), o = i && r, a = {
    manageTimeEnabled: i,
    sceneAllowsRealTime: r,
    effectiveEnabled: o,
    paused: n,
    canControl: w(this, k, Zt).call(this),
    combatRunning: w(this, k, bi).call(this),
    overrideApplied: typeof t == "boolean"
  };
  if (S("GameTimeAutomation | Sync running state", a), !o || !w(this, k, Zt).call(this)) {
    w(this, k, Co).call(this);
    return;
  }
  w(this, k, bs).call(this);
}, "#syncRunningState"), bs = /* @__PURE__ */ s(function() {
  h(this, ht) === null && (O(this, $t, w(this, k, bo).call(this)), O(this, ht, globalThis.setInterval(() => w(this, k, Ts).call(this), 1e3)), S("GameTimeAutomation | Started real-time ticker"));
}, "#startRealTimeTicker"), Co = /* @__PURE__ */ s(function() {
  h(this, ht) !== null && (globalThis.clearInterval(h(this, ht)), O(this, ht, null), S("GameTimeAutomation | Stopped real-time ticker")), O(this, $t, null), O(this, Ge, 0), O(this, Ht, !1);
}, "#stopRealTimeTicker"), Ts = /* @__PURE__ */ s(function() {
  if (!h(this, Pe) || !h(this, We) || !w(this, k, Zt).call(this)) {
    w(this, k, Co).call(this);
    return;
  }
  const t = w(this, k, bo).call(this);
  if (typeof t != "number" || !Number.isFinite(t)) return;
  const n = h(this, $t) ?? t, i = (t - n) / 1e3;
  if (O(this, $t, t), !Number.isFinite(i) || i <= 0) return;
  const r = !!(game != null && game.paused), o = w(this, k, bi).call(this);
  if (r || o) {
    h(this, Ht) || S("GameTimeAutomation | Tick skipped", { paused: r, combatRunning: o }), O(this, Ht, !0), O(this, Ge, 0);
    return;
  }
  O(this, Ht, !1), S("GameTimeAutomation | Real-time tick", { deltaSeconds: i }), w(this, k, Lo).call(this, i);
}, "#tickRealTime"), Lo = /* @__PURE__ */ s(function(t) {
  if (!h(this, Pe) || !h(this, We)) return;
  const n = Number(t);
  !Number.isFinite(n) || n <= 0 || (O(this, Ge, h(this, Ge) + n), !h(this, cn) && O(this, cn, w(this, k, Es).call(this)));
}, "#queueAdvance"), Es = /* @__PURE__ */ s(async function() {
  var t, n;
  for (; h(this, Ge) > 0; ) {
    if (!h(this, Pe) || !h(this, We) || game != null && game.paused || !w(this, k, Zt).call(this) || w(this, k, bi).call(this)) {
      O(this, Ge, 0);
      break;
    }
    const i = h(this, Ge);
    O(this, Ge, 0);
    try {
      if (typeof ((t = game == null ? void 0 : game.time) == null ? void 0 : t.advance) == "function")
        S("GameTimeAutomation | Advancing world time", { delta: i }), await game.time.advance(i), S("GameTimeAutomation | World time advanced", {
          worldTime: ((n = game.time) == null ? void 0 : n.worldTime) ?? null
        });
      else {
        console.warn(`${L} | game.time.advance is unavailable; cannot manage world time.`);
        break;
      }
    } catch (r) {
      console.error(`${L} | Failed to advance world time`, r);
      break;
    }
  }
  O(this, cn, null);
}, "#flushAdvanceQueue"), rr = new WeakMap(), or = new WeakMap(), ar = new WeakMap(), sr = new WeakMap(), lr = new WeakMap(), cr = new WeakMap(), wo = /* @__PURE__ */ s(function() {
  const t = Cn();
  return Le(t) ? t : null;
}, "#getActiveSceneDocument"), Cs = /* @__PURE__ */ s(function(t) {
  if (!Le(t)) return !1;
  try {
    return !!t.getFlag(L, Qr);
  } catch (n) {
    return S("GameTimeAutomation | Failed to read scene real-time flag", {
      sceneId: (t == null ? void 0 : t.id) ?? null,
      message: (n == null ? void 0 : n.message) ?? String(n)
    }), !1;
  }
}, "#isSceneRealTimeAllowed"), Ti = /* @__PURE__ */ s(function(t) {
  const n = Le(t) ? t : w(this, k, wo).call(this), i = w(this, k, Cs).call(this, n), r = h(this, We);
  return O(this, We, i), r !== i ? (S("GameTimeAutomation | Scene real-time allowance changed", {
    sceneId: (n == null ? void 0 : n.id) ?? null,
    allows: i
  }), !0) : !1;
}, "#refreshSceneAutomationState"), ur = new WeakMap(), dr = new WeakMap(), s(fa, "GameTimeAutomation");
let yo = fa;
var Qa, pt, be, Pt, rt, fr, ce, Ls, ws, Ss, Is, gr, Io, mr, vs, hr, Os, Ms;
const nt = class nt extends Yn(Jn) {
  constructor(n = {}) {
    const { scene: i, trigger: r, triggerIndex: o, onSave: a, ...l } = n ?? {};
    super(l);
    M(this, ce);
    M(this, pt, null);
    M(this, be, null);
    M(this, Pt, null);
    M(this, rt, null);
    M(this, fr, /* @__PURE__ */ s(() => {
      (this.rendered ?? this.isRendered ?? !1) && (O(this, rt, w(this, ce, Ls).call(this)), this.render({ force: !0 }));
    }, "#handleTimeFormatChange"));
    M(this, gr, /* @__PURE__ */ s((n) => {
      var o, a;
      const i = n.currentTarget, r = i == null ? void 0 : i.closest("form");
      r && (S("Trigger action selection changed", {
        sceneId: ((o = this.scene) == null ? void 0 : o.id) ?? null,
        triggerId: ((a = this.trigger) == null ? void 0 : a.id) ?? null,
        actionId: (i == null ? void 0 : i.value) ?? null
      }), w(this, ce, Io).call(this, i.value, r));
    }, "#onActionSelectChange"));
    M(this, mr, /* @__PURE__ */ s((n) => {
      var u, d, f, m;
      n.preventDefault();
      const i = n.currentTarget, r = i == null ? void 0 : i.closest("form");
      if (!r) return;
      const o = (u = i.dataset) == null ? void 0 : u.target;
      if (!o) return;
      const a = typeof (CSS == null ? void 0 : CSS.escape) == "function" ? CSS.escape : (y) => y, l = r.querySelector(`[name="${a(o)}"]`);
      if (!l) return;
      S("Opening file picker for trigger", {
        sceneId: ((d = this.scene) == null ? void 0 : d.id) ?? null,
        triggerId: ((f = this.trigger) == null ? void 0 : f.id) ?? null,
        target: o
      }), new FilePicker({
        type: ((m = i.dataset) == null ? void 0 : m.type) || "audio",
        current: l.value,
        callback: /* @__PURE__ */ s((y) => {
          var b, p;
          l.value = y, l.dispatchEvent(new Event("change")), S("Trigger form file selected", {
            sceneId: ((b = this.scene) == null ? void 0 : b.id) ?? null,
            triggerId: ((p = this.trigger) == null ? void 0 : p.id) ?? null,
            target: o,
            path: y
          });
        }, "callback")
      }).render({ force: !0 });
    }, "#onFilePicker"));
    M(this, hr, /* @__PURE__ */ s(async (n) => {
      var r, o;
      n.preventDefault();
      const i = n.currentTarget;
      i instanceof HTMLFormElement && (S("Trigger form submitted", {
        sceneId: ((r = this.scene) == null ? void 0 : r.id) ?? null,
        triggerId: ((o = this.trigger) == null ? void 0 : o.id) ?? null
      }), await w(this, ce, Os).call(this, i));
    }, "#onSubmit"));
    this.scene = i ?? null, this.trigger = r ?? null, this.triggerIndex = Number.isInteger(o) ? Number(o) : null, this.onSave = typeof a == "function" ? a : null, O(this, Pt, Jo(h(this, fr)));
  }
  async _prepareContext() {
    var n, i;
    dn("TriggerFormApplication#_prepareContext", {
      sceneId: ((n = this.scene) == null ? void 0 : n.id) ?? null,
      triggerId: ((i = this.trigger) == null ? void 0 : i.id) ?? null,
      triggerIndex: this.triggerIndex
    });
    try {
      const r = this.trigger ?? { action: pi, data: {} }, o = r.action ?? pi, a = Sa(r.time), l = a.format ?? "12h", c = l === "12h" ? Zl() : [], u = a.period ?? (c.length > 0 ? c[0].value : null), d = l === "12h" ? c.map((y) => ({
        ...y,
        selected: y.value === u
      })) : [], f = wa().map((y) => ({
        id: y.id,
        label: typeof y.label == "function" ? y.label() : y.label,
        selected: y.id === o
      })), m = wa().map((y) => {
        const b = y.id === r.action ? r : { ...r, action: y.id }, p = Gl(b);
        return p ? {
          id: y.id,
          visible: y.id === o,
          content: p
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
        actions: f,
        actionSections: m,
        allowReplayOnRewind: !!r.allowReplayOnRewind,
        labels: {
          time: g("EIDOLON.TimeTrigger.TriggerTime", "Trigger Time"),
          hour: g("EIDOLON.TimeTrigger.TriggerTimeHour", "Hour"),
          minute: g("EIDOLON.TimeTrigger.TriggerTimeMinute", "Minute"),
          period: g("EIDOLON.TimeTrigger.TriggerTimePeriod", "AM / PM"),
          action: g("EIDOLON.TimeTrigger.TriggerAction", "Action"),
          allowReplayOnRewind: g(
            "EIDOLON.TimeTrigger.AllowReplayOnRewind",
            "Allow replay after rewinding time"
          ),
          allowReplayOnRewindHint: g(
            "EIDOLON.TimeTrigger.AllowReplayOnRewindHint",
            "When enabled, this trigger can fire again if world time moves backward."
          ),
          save: g("EIDOLON.TimeTrigger.TriggerSave", "Save Trigger")
        }
      };
    } finally {
      Ct();
    }
  }
  _onRender(n, i) {
    var c, u, d;
    super._onRender(n, i);
    const r = this.element;
    if (!r) return;
    S("Trigger form rendered", {
      sceneId: ((c = this.scene) == null ? void 0 : c.id) ?? null,
      triggerId: ((u = this.trigger) == null ? void 0 : u.id) ?? null
    });
    const o = Array.from(((d = document == null ? void 0 : document.body) == null ? void 0 : d.classList) ?? []).find(
      (f) => f.startsWith("theme-")
    );
    o && r.classList.add(o);
    const a = r.querySelector("form");
    if (!a) return;
    w(this, ce, vs).call(this, a), w(this, ce, ws).call(this, a), a.addEventListener("submit", h(this, hr));
    const l = a.querySelector("[data-action-select]");
    l && (l.addEventListener("change", h(this, gr)), w(this, ce, Io).call(this, l.value, a)), a.querySelectorAll("[data-action-file-picker]").forEach((f) => {
      f.addEventListener("click", h(this, mr));
    });
  }
  async close(n = {}) {
    var i;
    if ((i = h(this, pt)) == null || i.call(this), O(this, pt, null), O(this, be, null), O(this, rt, null), typeof h(this, Pt) == "function")
      try {
        h(this, Pt).call(this);
      } catch (r) {
        console.error(`${L} | Failed to dispose trigger form time format subscription`, r);
      }
    return O(this, Pt, null), super.close(n);
  }
};
pt = new WeakMap(), be = new WeakMap(), Pt = new WeakMap(), rt = new WeakMap(), fr = new WeakMap(), ce = new WeakSet(), Ls = /* @__PURE__ */ s(function() {
  var l, c, u, d, f, m, y;
  const n = (c = (l = this.element) == null ? void 0 : l.querySelector) == null ? void 0 : c.call(l, "form");
  if (!(n instanceof HTMLFormElement)) return null;
  const i = Array.from(n.elements ?? []), r = [];
  for (const b of i)
    if ((b instanceof HTMLInputElement || b instanceof HTMLSelectElement || b instanceof HTMLTextAreaElement) && b.name && !(((u = b.dataset) == null ? void 0 : u.timeHidden) !== void 0 || ((d = b.dataset) == null ? void 0 : d.timeHour) !== void 0 || ((f = b.dataset) == null ? void 0 : f.timeMinute) !== void 0 || ((m = b.dataset) == null ? void 0 : m.timePeriod) !== void 0)) {
      if (b instanceof HTMLInputElement) {
        if (b.type === "checkbox" || b.type === "radio") {
          r.push({
            kind: b.type,
            name: b.name,
            value: b.value,
            checked: b.checked
          });
          continue;
        }
        r.push({
          kind: "value",
          name: b.name,
          value: b.value
        });
        continue;
      }
      if (b instanceof HTMLSelectElement) {
        b.multiple ? r.push({
          kind: "select-multiple",
          name: b.name,
          values: Array.from(b.selectedOptions ?? []).map((p) => p.value)
        }) : r.push({
          kind: "value",
          name: b.name,
          value: b.value
        });
        continue;
      }
      r.push({
        kind: "value",
        name: b.name,
        value: b.value
      });
    }
  const o = n.querySelector("[data-time-format]");
  let a = null;
  if (o instanceof HTMLElement) {
    const b = o.querySelector("[data-time-hidden]"), p = o.querySelector("[data-time-hour]"), T = o.querySelector("[data-time-minute]"), E = o.querySelector("[data-time-period]");
    a = {
      format: ((y = o.dataset) == null ? void 0 : y.timeFormat) ?? null,
      canonical: b instanceof HTMLInputElement ? b.value : "",
      hour: p instanceof HTMLInputElement ? p.value : "",
      minute: T instanceof HTMLInputElement ? T.value : "",
      period: E instanceof HTMLSelectElement ? E.value : ""
    };
  }
  return {
    fields: r,
    time: a
  };
}, "#captureFormState"), ws = /* @__PURE__ */ s(function(n) {
  if (!h(this, rt)) return;
  if (!(n instanceof HTMLFormElement)) {
    O(this, rt, null);
    return;
  }
  const { fields: i = [], time: r = null } = h(this, rt) ?? {};
  O(this, rt, null), w(this, ce, Ss).call(this, n, i), w(this, ce, Is).call(this, n, r);
}, "#restorePendingFormState"), Ss = /* @__PURE__ */ s(function(n, i) {
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
}, "#restoreFieldValues"), Is = /* @__PURE__ */ s(function(n, i) {
  var C, I, D;
  const r = n.querySelector("[data-time-format]");
  if (!(r instanceof HTMLElement)) {
    typeof h(this, be) == "function" && h(this, be).call(this);
    return;
  }
  const o = ((C = r.dataset) == null ? void 0 : C.timeFormat) === "24h" ? "24h" : "12h", a = r.querySelector("[data-time-hour]"), l = r.querySelector("[data-time-minute]"), c = r.querySelector("[data-time-period]"), u = r.querySelector("[data-time-hidden]");
  if (!i) {
    if (a instanceof HTMLInputElement && (a.value = ""), l instanceof HTMLInputElement && (l.value = ""), c instanceof HTMLSelectElement) {
      const _ = ((D = (I = c.options) == null ? void 0 : I[0]) == null ? void 0 : D.value) ?? "";
      c.value = _;
    }
    u instanceof HTMLInputElement && (u.value = ""), typeof h(this, be) == "function" && h(this, be).call(this);
    return;
  }
  const d = typeof i.canonical == "string" ? i.canonical : "", f = typeof i.period == "string" ? i.period : "", m = typeof i.hour == "string" ? i.hour : "", y = typeof i.minute == "string" ? i.minute : "";
  let b = "", p = "", T = f, E = d;
  if (d) {
    const _ = Sa(d, o);
    b = _.hour ?? "", p = _.minute ?? "", E = _.canonical ?? d, o === "12h" ? T = _.period ?? f : T = "";
  } else
    b = m, p = y, o !== "12h" && (T = "");
  if (a instanceof HTMLInputElement && (a.value = b ?? ""), l instanceof HTMLInputElement && (l.value = p ?? ""), c instanceof HTMLSelectElement)
    if (o === "12h") {
      const _ = Array.from(c.options ?? []);
      _.find((x) => x.value === T) ? c.value = T : _.length > 0 ? c.value = _[0].value : c.value = "";
    } else
      c.value = "";
  u instanceof HTMLInputElement && (u.value = E ?? ""), typeof h(this, be) == "function" && h(this, be).call(this);
}, "#restoreTimeInputs"), gr = new WeakMap(), Io = /* @__PURE__ */ s(function(n, i) {
  i && i.querySelectorAll("[data-action-config]").forEach((r) => {
    const o = r.dataset.actionConfig === n;
    r.style.display = o ? "" : "none";
  });
}, "#updateActionSections"), mr = new WeakMap(), vs = /* @__PURE__ */ s(function(n) {
  var f, m, y, b;
  if ((f = h(this, pt)) == null || f.call(this), O(this, pt, null), O(this, be, null), !(n instanceof HTMLFormElement)) return;
  const i = n.querySelector("[data-time-format]"), r = ((m = i == null ? void 0 : i.dataset) == null ? void 0 : m.timeFormat) ?? null;
  if (r !== "12h" && r !== "24h")
    return;
  const o = i.querySelector("[data-time-hidden]"), a = i.querySelector("[data-time-hour]"), l = i.querySelector("[data-time-minute]"), c = r === "12h" ? i.querySelector("[data-time-period]") : null;
  if (!o || !a || !l || r === "12h" && !c) {
    S("Trigger form time inputs missing elements", {
      format: r,
      hasHidden: !!o,
      hasHour: !!a,
      hasMinute: !!l,
      hasPeriod: !!c
    });
    return;
  }
  const u = [a, l, ...c ? [c] : []], d = /* @__PURE__ */ s(() => {
    const { canonical: p, error: T } = Xl(
      {
        hour: a.value,
        minute: l.value,
        period: (c == null ? void 0 : c.value) ?? null,
        time: o.value
      },
      r
    );
    o.value = p ?? "";
    const E = T ?? "";
    o.setCustomValidity(E), u.forEach((C) => {
      C.setCustomValidity(E);
    });
  }, "update");
  u.forEach((p) => {
    p.addEventListener("input", d), p.addEventListener("change", d);
  }), d(), O(this, pt, () => {
    u.forEach((p) => {
      p.removeEventListener("input", d), p.removeEventListener("change", d);
    });
  }), O(this, be, d), S("Trigger form configured for time input", {
    format: r,
    sceneId: ((y = this.scene) == null ? void 0 : y.id) ?? null,
    triggerId: ((b = this.trigger) == null ? void 0 : b.id) ?? null
  });
}, "#setupTimeInput"), hr = new WeakMap(), Os = /* @__PURE__ */ s(async function(n) {
  var o, a, l, c, u;
  if (typeof h(this, be) == "function" && h(this, be).call(this), typeof n.checkValidity == "function" && !n.checkValidity()) {
    typeof n.reportValidity == "function" && n.reportValidity(), S("Trigger form submission blocked by validity check", {
      sceneId: ((o = this.scene) == null ? void 0 : o.id) ?? null,
      triggerId: ((a = this.trigger) == null ? void 0 : a.id) ?? null
    });
    return;
  }
  const i = new FormData(n), r = Object.fromEntries(i.entries());
  delete r.timeHour, delete r.timeMinute, delete r.timePeriod, r.allowReplayOnRewind = ((l = n.querySelector('input[name="allowReplayOnRewind"]')) == null ? void 0 : l.checked) ?? !1, S("Processing trigger form submission", {
    sceneId: ((c = this.scene) == null ? void 0 : c.id) ?? null,
    triggerId: ((u = this.trigger) == null ? void 0 : u.id) ?? null,
    allowReplayOnRewind: r.allowReplayOnRewind
  }), await w(this, ce, Ms).call(this, r), await this.close();
}, "#handleSubmit"), Ms = /* @__PURE__ */ s(async function(n) {
  var o, a, l, c, u, d;
  const i = {
    id: ((o = this.trigger) == null ? void 0 : o.id) ?? Dl(),
    time: n.time ?? "",
    action: n.action ?? pi,
    allowReplayOnRewind: !!n.allowReplayOnRewind,
    data: {}
  };
  S("Persisting trigger from form", {
    sceneId: ((a = this.scene) == null ? void 0 : a.id) ?? null,
    triggerId: i.id,
    existingIndex: this.triggerIndex
  }), Wl(i, n);
  const r = on(this.scene);
  this.triggerIndex !== null && r[this.triggerIndex] ? r[this.triggerIndex] = i : r.push(i);
  try {
    await ss(this.scene, r), S("Trigger list saved", {
      sceneId: ((l = this.scene) == null ? void 0 : l.id) ?? null,
      triggerCount: r.length
    });
  } catch (f) {
    throw console.error(`${L} | Failed to save time trigger`, f), (u = (c = ui.notifications) == null ? void 0 : c.error) == null || u.call(
      c,
      g(
        "EIDOLON.TimeTrigger.TriggerSaveError",
        "Failed to save the scene's time triggers."
      )
    ), f;
  }
  if (this.onSave)
    try {
      this.onSave(r);
    } catch (f) {
      console.error(`${L} | Trigger onSave callback failed`, f), S("Trigger onSave callback failed", {
        sceneId: ((d = this.scene) == null ? void 0 : d.id) ?? null,
        message: (f == null ? void 0 : f.message) ?? String(f)
      });
    }
}, "#persistTrigger"), s(nt, "TriggerFormApplication"), Ve(nt, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  ft(nt, nt, "DEFAULT_OPTIONS"),
  {
    id: `${L}-trigger-form`,
    classes: Array.from(
      /* @__PURE__ */ new Set([...((Qa = ft(nt, nt, "DEFAULT_OPTIONS")) == null ? void 0 : Qa.classes) ?? [], "standard-form", "themed"])
    ),
    window: {
      title: g("EIDOLON.TimeTrigger.TriggerFormTitle", "Configure Time Trigger"),
      resizable: !1
    },
    position: {
      width: 400,
      height: "auto"
    }
  },
  { inplace: !1 }
)), Ve(nt, "PARTS", {
  content: {
    template: `modules/${L}/templates/time-trigger-form.html`
  }
});
let So = nt;
function st(e) {
  return e instanceof HTMLElement ? e : (e == null ? void 0 : e[0]) instanceof HTMLElement ? e[0] : null;
}
s(st, "asHTMLElement");
function Ei(e) {
  return typeof (e == null ? void 0 : e.changeTab) == "function";
}
s(Ei, "isAppV2");
function As(e, t, n, i = {}) {
  if (Ei(e)) {
    e.changeTab(t, n, i);
    return;
  }
  if (typeof (e == null ? void 0 : e.activateTab) == "function") {
    const r = { ...i };
    n != null && (r.group = n), r.triggerCallback == null && (r.triggerCallback = !0), e.activateTab(t, r);
  }
}
s(As, "setActiveTab");
function tc(e) {
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
s(tc, "readFormData");
const va = Symbol.for("eidolon.sceneConfig.v13PatchedTabs");
function Ns(e = {}) {
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
    moduleId: f = "eidolon-utilities",
    tabIcon: m = "fa-solid fa-puzzle-piece"
  } = e ?? {};
  if (!t)
    throw new Error("createSceneConfigTabFactory requires a tabId.");
  if (typeof o != "function")
    throw new TypeError("createSceneConfigTabFactory requires a renderContent callback.");
  const y = typeof d.log == "function" ? d.log.bind(d) : (...A) => {
    var U;
    return (U = console.debug) == null ? void 0 : U.call(console, `${a}`, ...A);
  }, b = typeof d.group == "function" ? d.group.bind(d) : (...A) => {
    var U;
    return (U = console.groupCollapsed) == null ? void 0 : U.call(console, `${a}`, ...A);
  }, p = typeof d.groupEnd == "function" ? d.groupEnd.bind(d) : () => {
    var A;
    return (A = console.groupEnd) == null ? void 0 : A.call(console);
  }, T = Symbol(`EIDOLON_SCENE_CONFIG_TAB_CLEANUP_${t}`), E = typeof i == "function" ? i : () => null, C = typeof r == "function" ? r : () => !0, I = typeof n == "function" ? n : () => typeof n == "string" ? n : t;
  function D() {
    var j, $, P, Y, ne;
    const A = (($ = (j = foundry == null ? void 0 : foundry.applications) == null ? void 0 : j.sheets) == null ? void 0 : $.SceneConfig) ?? ((P = CONFIG == null ? void 0 : CONFIG.Scene) == null ? void 0 : P.sheetClass);
    if (!A || !Ei({ changeTab: (Y = A.prototype) == null ? void 0 : Y.changeTab })) return;
    const U = A[va] ?? /* @__PURE__ */ new Set();
    if (U.has(t)) return;
    U.add(t), A[va] = U;
    const G = (ne = A.TABS) == null ? void 0 : ne.sheet;
    if (G && Array.isArray(G.tabs) && !G.tabs.some((z) => z.id === t)) {
      const z = I({ app: null, scene: null }) ?? t;
      G.tabs.push({
        id: t,
        icon: m,
        label: z
      });
    }
    A.PARTS && !A.PARTS[t] && (A.PARTS[t] = {
      template: `modules/${f}/templates/scene-config-tab-mount.hbs`,
      scrollable: [`.tab[data-tab="${t}"]`]
    }), y("Patched v13 SceneConfig TABS/PARTS", { tabId: t });
  }
  s(D, "patchV13SceneConfig");
  function _(A, U) {
    var j, $;
    const G = E(A);
    if (!C(A, G)) {
      y("Skipped render", {
        tabId: t,
        reason: "inapplicable",
        constructor: ((j = A == null ? void 0 : A.constructor) == null ? void 0 : j.name) ?? null
      });
      return;
    }
    b("render", {
      tabId: t,
      sceneId: (G == null ? void 0 : G.id) ?? null,
      constructor: (($ = A == null ? void 0 : A.constructor) == null ? void 0 : $.name) ?? null
    });
    try {
      const P = st(U) ?? st(A.element);
      if (!P) {
        y("Missing root element", { tabId: t });
        return;
      }
      Ei(A) ? W(A, P, G) : x(A, P, G);
    } finally {
      p();
    }
  }
  s(_, "handleRender");
  function F(A, U, G) {
    var P;
    if (!m) {
      A.textContent = U;
      return;
    }
    const j = (P = A.querySelector("i")) == null ? void 0 : P.cloneNode(!0);
    A.textContent = "";
    const $ = j ?? document.createElement("i");
    if (j || ($.className = m, G && ($.inert = !0)), A.append($, " "), G) {
      const Y = document.createElement("span");
      Y.textContent = U, A.append(Y);
    } else
      A.append(document.createTextNode(U));
  }
  s(F, "setButtonContent");
  function x(A, U, G) {
    var Ae, Xe, we, fe, Yt, Ze, Ot, Ne, et, N, ti, B, $e, ge, mn, ni;
    const $ = [
      "nav.sheet-tabs[data-group]",
      "nav.tabs[data-group]",
      "nav.sheet-tabs",
      "nav.tabs"
    ].map((me) => U.querySelector(me)).find((me) => me instanceof HTMLElement), Y = [
      (Ae = U.querySelector(".tab[data-tab]")) == null ? void 0 : Ae.parentElement,
      U.querySelector(".sheet-body"),
      (we = (Xe = $ == null ? void 0 : $.parentElement) == null ? void 0 : Xe.querySelector) == null ? void 0 : we.call(Xe, ":scope > .sheet-body"),
      $ == null ? void 0 : $.parentElement
    ].find((me) => me instanceof HTMLElement), ne = ((fe = $ == null ? void 0 : $.dataset) == null ? void 0 : fe.group) ?? ((Ot = (Ze = (Yt = $ == null ? void 0 : $.querySelector) == null ? void 0 : Yt.call($, "a[data-group]")) == null ? void 0 : Ze.dataset) == null ? void 0 : Ot.group) ?? ((N = (et = (Ne = $ == null ? void 0 : $.querySelector) == null ? void 0 : Ne.call($, "[data-group]")) == null ? void 0 : et.dataset) == null ? void 0 : N.group) ?? (($e = (B = (ti = Y == null ? void 0 : Y.querySelector) == null ? void 0 : ti.call(Y, ".tab[data-group]")) == null ? void 0 : B.dataset) == null ? void 0 : $e.group) ?? "main";
    if (!$ || !Y) {
      y("Missing navigation elements", {
        tabId: t,
        hasNav: !!$,
        hasBody: !!Y
      });
      return;
    }
    let z = $.querySelector(`[data-tab="${t}"]`);
    if (!z) {
      z = document.createElement("a"), z.dataset.action = "tab", z.dataset.group = ne, z.dataset.tab = t;
      const me = $.querySelector("a[data-tab]");
      (ge = me == null ? void 0 : me.classList) != null && ge.contains("item") && z.classList.add("item"), $.appendChild(z), typeof l == "function" && l({ app: A, button: z, nav: $, scene: G }), y("Created tab button", { tabId: t, group: ne });
    }
    F(z, I({ app: A, scene: G }) ?? t, Ei(A));
    let X = Y.querySelector(`.tab[data-tab="${t}"]`);
    if (!X) {
      X = document.createElement("div"), X.classList.add("tab"), X.dataset.tab = t, X.dataset.group = ne;
      const me = nc(Y);
      Y.insertBefore(X, me ?? null), typeof c == "function" && c({ app: A, tab: X, body: Y, scene: G }), y("Created tab container", { tabId: t, group: ne });
    }
    ((mn = z.classList) == null ? void 0 : mn.contains("active")) || X.classList.contains("active") ? (z.classList.add("active"), X.classList.add("active"), X.removeAttribute("hidden")) : (z.classList.remove("active"), X.classList.remove("active"), X.setAttribute("hidden", "true"));
    const Re = /* @__PURE__ */ s(() => {
      var Mt, hn;
      ((Mt = z.classList) != null && Mt.contains("active") || X.classList.contains("active")) && ((hn = z.classList) == null || hn.add("active"), X.classList.add("active"), X.removeAttribute("hidden"), X.removeAttribute("aria-hidden"), X.style.display === "none" && (X.style.display = ""));
    }, "ensureTabVisible"), pe = /* @__PURE__ */ s(() => {
      Re(), requestAnimationFrame(Re);
    }, "scheduleEnsureTabVisible");
    z.dataset.eidolonEnsureSceneTabVisibility || (z.addEventListener("click", () => {
      As(A, t, ne), requestAnimationFrame(Re);
    }), z.dataset.eidolonEnsureSceneTabVisibility = "true"), qr(A, T, y);
    const Me = o({
      app: A,
      scene: G,
      tab: X,
      tabButton: z,
      ensureTabVisible: Re,
      scheduleEnsureTabVisible: pe
    });
    typeof Me == "function" && Oa(A, T, Me), typeof u == "function" && u({
      app: A,
      scene: G,
      tab: X,
      tabButton: z,
      ensureTabVisible: Re,
      scheduleEnsureTabVisible: pe
    }), (ni = A.setPosition) == null || ni.call(A, { height: "auto" });
  }
  s(x, "handleRenderV1");
  function W(A, U, G) {
    const j = U.querySelector(`.tab[data-tab="${t}"]`), $ = U.querySelector(`nav [data-tab="${t}"]`);
    if (!j || !$) {
      y("v2 mount not found, falling back to v1 injection", { tabId: t }), x(A, U, G);
      return;
    }
    F($, I({ app: A, scene: G }) ?? t, !0);
    const P = /* @__PURE__ */ s(() => {
      var z;
      !((z = $.classList) != null && z.contains("active")) && !j.classList.contains("active") || (j.classList.add("active"), j.removeAttribute("hidden"), j.removeAttribute("aria-hidden"), j.style.display === "none" && (j.style.display = ""));
    }, "ensureTabVisible"), Y = /* @__PURE__ */ s(() => {
      P(), requestAnimationFrame(P);
    }, "scheduleEnsureTabVisible");
    qr(A, T, y);
    const ne = o({
      app: A,
      scene: G,
      tab: j,
      tabButton: $,
      ensureTabVisible: P,
      scheduleEnsureTabVisible: Y
    });
    typeof ne == "function" && Oa(A, T, ne), typeof u == "function" && u({
      app: A,
      scene: G,
      tab: j,
      tabButton: $,
      ensureTabVisible: P,
      scheduleEnsureTabVisible: Y
    });
  }
  s(W, "handleRenderV2");
  function te(A) {
    qr(A, T, y);
  }
  s(te, "handleClose");
  function H() {
    return Hooks.once("init", () => {
      D();
    }), Hooks.on("renderSceneConfig", _), Hooks.on("closeSceneConfig", te), () => Q();
  }
  s(H, "register");
  function Q() {
    Hooks.off("renderSceneConfig", _), Hooks.off("closeSceneConfig", te);
  }
  return s(Q, "unregister"), { register: H, unregister: Q };
}
s(Ns, "createSceneConfigTabFactory");
function Oa(e, t, n) {
  if (!e || typeof n != "function") return;
  const i = e == null ? void 0 : e[t];
  Array.isArray(i) || (e[t] = []), e[t].push(n);
}
s(Oa, "registerCleanup");
function qr(e, t, n) {
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
s(qr, "invokeCleanup");
function nc(e) {
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
s(nc, "findFooterElement$1");
const ic = Sr(So), rc = `modules/${L}/templates/time-trigger-scene-tab.html`, oc = Ns({
  tabId: "time-triggers",
  tabLabel: /* @__PURE__ */ s(() => g("EIDOLON.TimeTrigger.Tab", "Time Triggers"), "tabLabel"),
  getScene: Qe,
  isApplicable: cc,
  renderContent: /* @__PURE__ */ s(({ app: e, scene: t, tab: n }) => sc(e, n, t), "renderContent"),
  logger: {
    log: S,
    group: dn,
    groupEnd: Ct
  }
});
function ac() {
  return S("Registering SceneConfig render hook"), oc.register();
}
s(ac, "registerSceneConfigHook");
function sc(e, t, n) {
  if (!(t instanceof HTMLElement)) return;
  const i = Le(n) ? n : Qe(e);
  Ri(e, t, i);
  const r = Jo(() => {
    Ri(e, t, i);
  });
  return () => {
    if (typeof r == "function")
      try {
        r();
      } catch (o) {
        console.error(
          `${L} | Failed to dispose scene config time format subscription`,
          o
        );
      }
  };
}
s(sc, "renderTimeTriggerTab");
async function Ri(e, t, n) {
  var r, o;
  const i = n ?? Qe(e);
  dn("renderTimeTriggersTabContent", { sceneId: (i == null ? void 0 : i.id) ?? null });
  try {
    if (!Le(i)) {
      const j = g(
        "EIDOLON.TimeTrigger.Unavailable",
        "Time triggers are unavailable for this configuration sheet."
      );
      t.innerHTML = `<p class="notes">${j}</p>`, S("Scene lacks document for time triggers", { sceneId: (i == null ? void 0 : i.id) ?? null });
      return;
    }
    const a = `flags.${L}.${Ni}`, l = `flags.${L}.${Jr}`, c = `flags.${L}.${Yr}`, u = !!i.getFlag(L, Ni), d = !!i.getFlag(L, Jr), f = !!i.getFlag(L, Yr), m = on(i);
    S("Rendering time trigger list", {
      sceneId: i.id,
      isActive: u,
      shouldHideWindow: d,
      shouldShowPlayerWindow: f,
      triggerCount: m.length
    });
    const y = g("EIDOLON.TimeTrigger.Activate", "Activate Time Trigger"), b = g(
      "EIDOLON.TimeTrigger.Description",
      "Enable scene time triggers so scheduled actions can run automatically."
    ), p = g(
      "EIDOLON.TimeTrigger.HideWindowLabel",
      "Hide Floating Time Window"
    ), T = g(
      "EIDOLON.TimeTrigger.HideWindowDescription",
      "Keep the floating time control window hidden while leaving time triggers active."
    ), E = g(
      "EIDOLON.TimeTrigger.ShowPlayerWindowLabel",
      "Share Floating Time Window with Players"
    ), C = g(
      "EIDOLON.TimeTrigger.ShowPlayerWindowDescription",
      "Let non-GM players see the floating time window (without time controls)."
    ), I = g(
      "EIDOLON.TimeTrigger.TriggerListLabel",
      "Scene Time Triggers"
    ), D = g(
      "EIDOLON.TimeTrigger.TriggerListEmpty",
      "No time triggers configured for this scene."
    ), _ = g("EIDOLON.TimeTrigger.AddTrigger", "Add Trigger"), F = g("EIDOLON.TimeTrigger.EditTrigger", "Edit"), x = g("EIDOLON.TimeTrigger.DeleteTrigger", "Remove"), W = g("EIDOLON.TimeTrigger.TriggerNow", "Trigger Now"), te = g("EIDOLON.TimeTrigger.AtLabel", "At"), H = g("EIDOLON.TimeTrigger.DoLabel", "Do"), Q = g("EIDOLON.TimeTrigger.MissingTime", "(No time set)"), A = m.map((j, $) => {
      const ne = (j.time ? Ql(j.time) : "") || j.time || "" || Q, z = Vl(j.action), X = [
        `${te} ${ne}`,
        `${H} ${z}`,
        ...zl(j)
      ];
      return {
        index: $,
        summaryParts: X,
        tooltips: {
          triggerNow: W,
          edit: F,
          delete: x
        }
      };
    }), U = ((o = (r = foundry == null ? void 0 : foundry.applications) == null ? void 0 : r.handlebars) == null ? void 0 : o.renderTemplate) ?? (typeof renderTemplate == "function" ? renderTemplate : globalThis == null ? void 0 : globalThis.renderTemplate);
    if (typeof U != "function") {
      console.error(`${L} | renderTemplate is unavailable; cannot render scene tab.`), t.innerHTML = `<p class="notes">${D}</p>`;
      return;
    }
    let G = "";
    try {
      G = await U(rc, {
        flags: {
          active: a,
          hideWindow: l,
          showPlayerWindow: c
        },
        states: {
          isActive: u,
          hideWindow: d,
          showPlayerWindow: f
        },
        labels: {
          activate: y,
          hideWindow: p,
          showPlayerWindow: E,
          triggerList: I,
          empty: D,
          add: _
        },
        hints: {
          activate: b,
          hideWindow: T,
          showPlayerWindow: C
        },
        triggers: A,
        hasTriggers: A.length > 0
      });
    } catch (j) {
      console.error(`${L} | Failed to render time trigger scene tab template`, j), t.innerHTML = `<p class="notes">${D}</p>`;
      return;
    }
    t.innerHTML = G, lc(e, t, i);
  } finally {
    Ct();
  }
}
s(Ri, "renderTimeTriggersTabContent");
function lc(e, t, n) {
  const i = n ?? Qe(e);
  if (!Le(i)) return;
  const r = t.querySelector('[data-action="add-trigger"]');
  r && r.addEventListener("click", () => {
    S("Add trigger button clicked", { sceneId: i.id }), Ma(e, { scene: i });
  }), t.querySelectorAll('[data-action="edit-trigger"]').forEach((o) => {
    o.addEventListener("click", () => {
      const a = Number(o.dataset.index);
      if (!Number.isInteger(a)) return;
      const c = on(i)[a];
      c && (S("Edit trigger button clicked", { sceneId: i.id, triggerId: c.id, index: a }), Ma(e, { trigger: c, triggerIndex: a, scene: i }));
    });
  }), t.querySelectorAll('[data-action="delete-trigger"]').forEach((o) => {
    o.addEventListener("click", async () => {
      var u, d;
      const a = Number(o.dataset.index);
      if (!Number.isInteger(a)) return;
      const l = on(i), c = l[a];
      if (c) {
        l.splice(a, 1);
        try {
          S("Deleting trigger", {
            sceneId: i.id,
            index: a,
            triggerId: (c == null ? void 0 : c.id) ?? null
          }), await ss(i, l), await Ri(e, t, i);
        } catch (f) {
          console.error(`${L} | Failed to delete time trigger`, f), (d = (u = ui.notifications) == null ? void 0 : u.error) == null || d.call(
            u,
            g(
              "EIDOLON.TimeTrigger.TriggerDeleteError",
              "Failed to remove the selected time trigger."
            )
          );
        }
      }
    });
  }), t.querySelectorAll('[data-action="fire-trigger"]').forEach((o) => {
    o.addEventListener("click", async () => {
      var u, d, f, m, y, b, p;
      const a = Number(o.dataset.index);
      if (!Number.isInteger(a)) return;
      const c = on(i)[a];
      if (c) {
        if (!((u = game.user) != null && u.isGM)) {
          (f = (d = ui.notifications) == null ? void 0 : d.warn) == null || f.call(
            d,
            g("EIDOLON.TimeTrigger.GMOnly", "Only the GM can adjust time.")
          );
          return;
        }
        try {
          S("Manually firing trigger", { sceneId: i.id, triggerId: c.id, index: a }), await ls(i, c), (y = (m = ui.notifications) == null ? void 0 : m.info) == null || y.call(
            m,
            g(
              "EIDOLON.TimeTrigger.TriggerNowSuccess",
              "Triggered the selected time trigger."
            )
          );
        } catch (T) {
          console.error(`${L} | Failed to execute time trigger manually`, T), (p = (b = ui.notifications) == null ? void 0 : b.error) == null || p.call(
            b,
            g(
              "EIDOLON.TimeTrigger.TriggerNowError",
              "Failed to execute the selected time trigger."
            )
          ), S("Manual trigger execution failed", {
            sceneId: i.id,
            triggerId: c.id,
            index: a,
            message: (T == null ? void 0 : T.message) ?? String(T)
          });
        }
      }
    });
  });
}
s(lc, "bindTimeTriggerTabEvents");
function Ma(e, t = {}) {
  var a;
  const n = t.scene ?? null, i = n && Le(n) ? n : Qe(e);
  if (!Le(i)) {
    console.warn(`${L} | Unable to open trigger form because no scene document is available.`);
    return;
  }
  S("Opening trigger form", {
    sceneId: i.id,
    triggerId: ((a = t.trigger) == null ? void 0 : a.id) ?? null,
    index: Number.isInteger(t.triggerIndex) ? Number(t.triggerIndex) : null
  }), ic({
    scene: i,
    trigger: t.trigger ?? null,
    triggerIndex: t.triggerIndex ?? null,
    onSave: /* @__PURE__ */ s(() => {
      var c, u;
      const l = (u = (c = e.element) == null ? void 0 : c[0]) == null ? void 0 : u.querySelector('.tab[data-tab="time-triggers"]');
      l && Ri(e, l, i);
    }, "onSave")
  }).render({ force: !0 });
}
s(Ma, "openTriggerForm");
function cc(e, t) {
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
s(cc, "isRecognizedSceneConfig");
const ai = new po(), Aa = new yo();
function uc() {
  S("Registering time trigger hooks"), Hooks.once("init", () => {
    kl(), Bl(), S("Time trigger settings registered during init");
  }), ac(), S("Scene config hook registered"), Aa.registerHooks(), S("Time automation hooks registered"), Hooks.once("ready", () => {
    ql(), S("Ready hook fired"), ai.onReady(), Aa.initialize();
  }), Hooks.on("canvasReady", (e) => {
    var t;
    S("canvasReady hook received", { scene: ((t = e == null ? void 0 : e.scene) == null ? void 0 : t.id) ?? null }), ai.onCanvasReady(e);
  }), Hooks.on("updateScene", (e) => {
    S("updateScene hook received", { scene: (e == null ? void 0 : e.id) ?? null }), ai.onUpdateScene(e);
  }), Hooks.on("updateWorldTime", (e, t) => {
    S("updateWorldTime hook received", { worldTime: e, diff: t }), ai.onUpdateWorldTime(e, t);
  });
}
s(uc, "registerTimeTriggerHooks");
uc();
const de = L, _s = "criteria", Qo = "state", dc = "criteriaVersion", fc = 1, Fs = "enableCriteriaSurfaces";
let Na = !1;
function gc() {
  var e;
  if (!Na) {
    if (Na = !0, !((e = game == null ? void 0 : game.settings) != null && e.register)) {
      console.warn(`${de} | game.settings.register unavailable; scene criteria setting skipped.`);
      return;
    }
    game.settings.register(de, Fs, {
      name: g("EIDOLON.SceneCriteria.EnableSurfacesSettingName", "Enable Criteria Editor Surfaces"),
      hint: g(
        "EIDOLON.SceneCriteria.EnableSurfacesSettingHint",
        "Show criteria authoring surfaces (Scene > Criteria tab and tile/light editor controls). The Criteria Switcher remains available."
      ),
      scope: "world",
      config: !0,
      type: Boolean,
      default: !0,
      onChange: /* @__PURE__ */ s(() => {
        mc();
      }, "onChange")
    });
  }
}
s(gc, "registerSceneCriteriaSettings");
function Ir() {
  var e;
  try {
    if ((e = game == null ? void 0 : game.settings) != null && e.get)
      return !!game.settings.get(de, Fs);
  } catch (t) {
    console.error(`${de} | Failed to read criteria surfaces setting`, t);
  }
  return !0;
}
s(Ir, "getCriteriaSurfacesEnabled");
function mc() {
  var o, a, l, c, u;
  const e = g("EIDOLON.SceneCriteria.ReloadPromptTitle", "Reload Required"), t = `<p>${g(
    "EIDOLON.SceneCriteria.ReloadPromptBody",
    "Changes to criteria editor surfaces require a reload. Reload now?"
  )}</p>`, n = typeof ((o = foundry == null ? void 0 : foundry.utils) == null ? void 0 : o.debouncedReload) == "function", i = /* @__PURE__ */ s(() => {
    n ? foundry.utils.debouncedReload() : window.location.reload();
  }, "reload"), r = (l = (a = foundry == null ? void 0 : foundry.applications) == null ? void 0 : a.api) == null ? void 0 : l.DialogV2;
  if (typeof (r == null ? void 0 : r.confirm) == "function") {
    r.confirm({
      window: { title: e },
      content: t
    }).then((d) => {
      d && i();
    });
    return;
  }
  if (typeof (Dialog == null ? void 0 : Dialog.confirm) == "function") {
    Dialog.confirm({
      title: e,
      content: t,
      yes: /* @__PURE__ */ s(() => i(), "yes"),
      no: /* @__PURE__ */ s(() => {
      }, "no")
    });
    return;
  }
  (u = (c = ui.notifications) == null ? void 0 : c.info) == null || u.call(
    c,
    g(
      "EIDOLON.SceneCriteria.ReloadNotice",
      "Please reload the world to apply criteria editor surface changes."
    )
  );
}
s(mc, "promptReloadForCriteriaSurfaces");
const $i = "Standard";
function xe(e) {
  var n;
  const t = (n = e == null ? void 0 : e.getFlag) == null ? void 0 : n.call(e, de, _s);
  return t ? Ds(t) : [];
}
s(xe, "getSceneCriteria");
async function vr(e, t) {
  if (!(e != null && e.setFlag)) return;
  const n = Ds(t);
  await e.setFlag(de, _s, n), await e.setFlag(de, dc, fc);
  const i = Qn(e, n);
  await e.setFlag(de, Qo, i);
}
s(vr, "setSceneCriteria");
function Qn(e, t = null) {
  var r;
  const n = Array.isArray(t) ? t : xe(e), i = Ye(((r = e == null ? void 0 : e.getFlag) == null ? void 0 : r.call(e, de, Qo)) ?? {});
  return Zo(i, n);
}
s(Qn, "getSceneCriteriaState");
async function hc(e, t, n = null) {
  if (!(e != null && e.setFlag)) return;
  const i = Array.isArray(n) ? n : xe(e), r = Zo(t, i);
  await e.setFlag(de, Qo, r);
}
s(hc, "setSceneCriteriaState");
function Xo(e = "") {
  const t = typeof e == "string" ? e.trim() : "", n = ks(Oo(t || "criterion"), /* @__PURE__ */ new Set());
  return {
    id: xs(),
    key: n,
    label: t,
    values: [$i],
    default: $i,
    order: 0
  };
}
s(Xo, "createSceneCriterion");
function Ds(e) {
  const t = Array.isArray(e) ? Ye(e) : [], n = [], i = /* @__PURE__ */ new Set();
  return t.forEach((r, o) => {
    const a = vo(r, o, i);
    a && (n.push(a), i.add(a.key));
  }), n;
}
s(Ds, "sanitizeCriteria$1");
function vo(e, t = 0, n = /* @__PURE__ */ new Set()) {
  if (!e || typeof e != "object") return null;
  const i = typeof e.id == "string" && e.id.trim() ? e.id.trim() : xs(), o = (typeof e.label == "string" ? e.label : typeof e.name == "string" ? e.name : "").trim(), a = typeof e.key == "string" && e.key.trim() ? Oo(e.key) : Oo(o || `criterion-${Number(t) + 1}`), l = ks(a, n), c = yc(e.values);
  let u = typeof e.default == "string" ? e.default.trim() : "";
  u || (u = c[0] ?? $i), c.includes(u) || c.unshift(u);
  const d = Number.isFinite(e.order) ? Number(e.order) : Number(t);
  return {
    id: i,
    key: l,
    label: o,
    values: c,
    default: u,
    order: d
  };
}
s(vo, "sanitizeCriterion");
function Zo(e, t = []) {
  const n = e && typeof e == "object" ? Ye(e) : {}, i = {};
  for (const r of t) {
    const o = n == null ? void 0 : n[r.key], a = typeof o == "string" ? o.trim() : "";
    a && r.values.includes(a) ? i[r.key] = a : i[r.key] = r.default;
  }
  return i;
}
s(Zo, "sanitizeSceneCriteriaState");
function pc(e) {
  return xe(e).map((n) => ({
    id: n.key,
    key: n.key,
    name: n.label,
    values: [...n.values]
  }));
}
s(pc, "getSceneCriteriaCategories");
function yc(e) {
  const t = Array.isArray(e) ? e : [], n = [];
  for (const i of t) {
    if (typeof i != "string") continue;
    const r = i.trim();
    !r || n.includes(r) || n.push(r);
  }
  return n.length || n.push($i), n;
}
s(yc, "sanitizeCriterionValues");
function Oo(e) {
  return String(e ?? "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "criterion";
}
s(Oo, "slugifyCriterionKey");
function ks(e, t) {
  if (!t.has(e)) return e;
  let n = 2;
  for (; t.has(`${e}-${n}`); )
    n += 1;
  return `${e}-${n}`;
}
s(ks, "ensureUniqueCriterionKey");
function xs() {
  var e;
  return (e = foundry == null ? void 0 : foundry.utils) != null && e.randomID ? foundry.utils.randomID() : typeof (crypto == null ? void 0 : crypto.randomUUID) == "function" ? crypto.randomUUID() : Math.random().toString(36).slice(2, 11);
}
s(xs, "generateCriterionId");
function Rs(e) {
  var t, n;
  console.error(`${de} | Failed to persist scene criteria`, e), (n = (t = ui.notifications) == null ? void 0 : t.error) == null || n.call(
    t,
    g(
      "EIDOLON.SceneCriteria.PersistError",
      "Failed to persist the scene criteria."
    )
  );
}
s(Rs, "notifyPersistError");
var Xa, ae, ot, he, $s, pr, yr, br, Tr, Ci, Er, kn, xn, Ln, Hs;
const it = class it extends Yn(Jn) {
  constructor(n = {}) {
    const { scene: i, criterion: r, isNew: o, onSave: a, ...l } = n ?? {};
    super(l);
    M(this, he);
    M(this, ae, null);
    M(this, ot, !1);
    M(this, pr, /* @__PURE__ */ s(async (n) => {
      n.preventDefault();
      const i = n.currentTarget;
      if (!(i instanceof HTMLFormElement)) return;
      const r = new FormData(i), o = String(r.get("criterionLabel") ?? "").trim(), a = String(r.get("criterionKey") ?? "").trim(), l = Array.from(i.querySelectorAll('[name="criterionValues"]')).map((f) => f instanceof HTMLInputElement ? f.value.trim() : "").filter((f, m, y) => f && y.indexOf(f) === m), u = String(r.get("criterionDefault") ?? "").trim() || l[0] || "Standard", d = vo(
        {
          id: h(this, ae).id,
          key: a,
          label: o,
          values: l,
          default: u,
          order: Number(h(this, ae).order ?? 0)
        },
        0,
        /* @__PURE__ */ new Set()
      );
      d && (O(this, ae, d), await w(this, he, Hs).call(this), this.close());
    }, "#onSubmit"));
    M(this, yr, /* @__PURE__ */ s((n) => {
      var a;
      if (h(this, ot)) return;
      const i = n.currentTarget, r = (i == null ? void 0 : i.form) ?? ((a = this.element) == null ? void 0 : a.querySelector("form"));
      if (!(r instanceof HTMLFormElement)) return;
      const o = r.querySelector('input[name="criterionKey"]');
      o instanceof HTMLInputElement && (o.value = bn(i.value));
    }, "#onLabelInput"));
    M(this, br, /* @__PURE__ */ s((n) => {
      var c;
      const i = n.currentTarget, r = (i == null ? void 0 : i.form) ?? ((c = this.element) == null ? void 0 : c.querySelector("form"));
      if (!(r instanceof HTMLFormElement) || !(i instanceof HTMLInputElement)) return;
      const o = r.querySelector('input[name="criterionLabel"]'), a = bn(o instanceof HTMLInputElement ? o.value : ""), l = bn(i.value);
      O(this, ot, l !== a), i.value = l, w(this, he, Ci).call(this, r);
    }, "#onKeyInput"));
    M(this, Tr, /* @__PURE__ */ s((n) => {
      var a, l;
      n.preventDefault();
      const i = ((a = n.currentTarget) == null ? void 0 : a.form) ?? ((l = this.element) == null ? void 0 : l.querySelector("form"));
      if (!(i instanceof HTMLFormElement)) return;
      const r = i.querySelector('input[name="criterionLabel"]'), o = i.querySelector('input[name="criterionKey"]');
      o instanceof HTMLInputElement && (o.value = bn(r instanceof HTMLInputElement ? r.value : ""), O(this, ot, !1), w(this, he, Ci).call(this, i));
    }, "#onResetAutoKey"));
    M(this, Er, /* @__PURE__ */ s((n) => {
      var c, u, d, f, m, y;
      n.preventDefault();
      const i = ((c = n.currentTarget) == null ? void 0 : c.form) ?? ((u = this.element) == null ? void 0 : u.querySelector("form"));
      if (!(i instanceof HTMLFormElement)) return;
      const r = i.querySelector(".scene-criterion-editor__values");
      if (!(r instanceof HTMLElement)) return;
      (d = r.querySelector(".scene-criterion-editor__empty")) == null || d.remove();
      const o = document.createElement("div");
      o.classList.add("scene-criterion-editor__value");
      const a = _i(g("EIDOLON.SceneCriteria.ValuePlaceholder", "Allowed value")), l = _i(g("EIDOLON.SceneCriteria.RemoveValue", "Remove Value"));
      o.innerHTML = `
      <input type="text" name="criterionValues" value="" placeholder="${a}" class="form-control">
      <button type="button" class="icon" data-action="remove-value" aria-label="${l}" title="${l}">
        <i class="fa-solid fa-trash"></i>
      </button>
    `, r.appendChild(o), (f = o.querySelector('[data-action="remove-value"]')) == null || f.addEventListener("click", h(this, kn)), (m = o.querySelector('input[name="criterionValues"]')) == null || m.addEventListener("input", h(this, xn)), w(this, he, Ln).call(this, i), (y = o.querySelector('input[name="criterionValues"]')) == null || y.focus();
    }, "#onAddValue"));
    M(this, kn, /* @__PURE__ */ s((n) => {
      var o, a, l, c;
      n.preventDefault(), (a = (o = n.currentTarget) == null ? void 0 : o.closest(".scene-criterion-editor__value")) == null || a.remove();
      const i = ((l = n.currentTarget) == null ? void 0 : l.form) ?? ((c = this.element) == null ? void 0 : c.querySelector("form"));
      if (!(i instanceof HTMLFormElement)) return;
      const r = i.querySelector(".scene-criterion-editor__values");
      if (r instanceof HTMLElement) {
        if (!r.querySelector(".scene-criterion-editor__value")) {
          const u = document.createElement("p");
          u.classList.add("notes", "scene-criterion-editor__empty"), u.textContent = g(
            "EIDOLON.SceneCriteria.ValueListEmpty",
            "No values have been added to this criterion."
          ), r.appendChild(u);
        }
        w(this, he, Ln).call(this, i);
      }
    }, "#onRemoveValue"));
    M(this, xn, /* @__PURE__ */ s((n) => {
      var r, o;
      const i = ((r = n.currentTarget) == null ? void 0 : r.form) ?? ((o = this.element) == null ? void 0 : o.querySelector("form"));
      i instanceof HTMLFormElement && w(this, he, Ln).call(this, i);
    }, "#onValuesChanged"));
    this.scene = i ?? null, this.criterion = r ?? null, this.onSave = typeof a == "function" ? a : null, this.isNew = !!o, O(this, ae, w(this, he, $s).call(this)), O(this, ot, h(this, ae).key !== bn(h(this, ae).label));
  }
  async _prepareContext() {
    var i, r, o, a;
    const n = Array.isArray((i = h(this, ae)) == null ? void 0 : i.values) ? h(this, ae).values : [];
    return {
      isNew: this.isNew,
      key: ((r = h(this, ae)) == null ? void 0 : r.key) ?? "",
      label: ((o = h(this, ae)) == null ? void 0 : o.label) ?? "",
      defaultValue: ((a = h(this, ae)) == null ? void 0 : a.default) ?? "",
      values: n.map((l, c) => {
        var u;
        return {
          index: c,
          value: l,
          selected: l === ((u = h(this, ae)) == null ? void 0 : u.default)
        };
      }),
      hasValues: n.length > 0,
      labels: {
        label: g("EIDOLON.SceneCriteria.CategoryNameLabel", "Criterion Label"),
        key: g("EIDOLON.SceneCriteria.CriteriaKey", "Key"),
        values: g("EIDOLON.SceneCriteria.ValuesLabel", "Allowed Values"),
        default: g("EIDOLON.SceneCriteria.DefaultValue", "Default Value"),
        empty: g(
          "EIDOLON.SceneCriteria.ValueListEmpty",
          "No values have been added to this criterion."
        ),
        addValue: g("EIDOLON.SceneCriteria.AddValue", "Add Value"),
        removeValue: g("EIDOLON.SceneCriteria.RemoveValue", "Remove Value"),
        valuePlaceholder: g("EIDOLON.SceneCriteria.ValuePlaceholder", "Allowed value"),
        resetAutoKey: g("EIDOLON.SceneCriteria.ResetAutoKey", "Reset to Auto"),
        save: this.isNew ? g("EIDOLON.SceneCriteria.CreateCategory", "Add Criterion") : g("EIDOLON.SceneCriteria.SaveCategory", "Save Criterion"),
        cancel: g("EIDOLON.SceneCriteria.CancelEdit", "Cancel")
      },
      keyIsCustom: h(this, ot)
    };
  }
  _onRender(n, i) {
    var o, a, l, c, u, d;
    super._onRender(n, i);
    const r = (o = this.element) == null ? void 0 : o.querySelector("form");
    r && (r.addEventListener("submit", h(this, pr)), (a = r.querySelector('[data-action="add-value"]')) == null || a.addEventListener("click", h(this, Er)), (l = r.querySelector('input[name="criterionLabel"]')) == null || l.addEventListener("input", h(this, yr)), (c = r.querySelector('input[name="criterionKey"]')) == null || c.addEventListener("input", h(this, br)), (u = r.querySelector('[data-action="reset-auto-key"]')) == null || u.addEventListener("click", h(this, Tr)), r.querySelectorAll('[data-action="remove-value"]').forEach((f) => {
      f.addEventListener("click", h(this, kn));
    }), r.querySelectorAll('input[name="criterionValues"]').forEach((f) => {
      f.addEventListener("input", h(this, xn));
    }), (d = r.querySelector('[data-action="cancel"]')) == null || d.addEventListener("click", (f) => {
      f.preventDefault(), this.close();
    }), w(this, he, Ci).call(this, r), w(this, he, Ln).call(this, r));
  }
};
ae = new WeakMap(), ot = new WeakMap(), he = new WeakSet(), $s = /* @__PURE__ */ s(function() {
  const n = vo(this.criterion, 0, /* @__PURE__ */ new Set()) ?? Xo(g("EIDOLON.SceneCriteria.DefaultCategoryName", "New Criterion"));
  return {
    id: n.id,
    key: n.key,
    label: n.label ?? "",
    values: Array.isArray(n.values) ? [...n.values] : [],
    default: n.default
  };
}, "#initializeState"), pr = new WeakMap(), yr = new WeakMap(), br = new WeakMap(), Tr = new WeakMap(), Ci = /* @__PURE__ */ s(function(n) {
  const i = n.querySelector('[data-action="reset-auto-key"]');
  i instanceof HTMLButtonElement && (i.disabled = !h(this, ot));
}, "#syncAutoKeyButton"), Er = new WeakMap(), kn = new WeakMap(), xn = new WeakMap(), Ln = /* @__PURE__ */ s(function(n) {
  var c, u;
  const i = n.querySelector('select[name="criterionDefault"]');
  if (!(i instanceof HTMLSelectElement)) return;
  const r = ((u = (c = i.value) == null ? void 0 : c.trim) == null ? void 0 : u.call(c)) ?? "", o = Array.from(n.querySelectorAll('input[name="criterionValues"]')).map((d) => d instanceof HTMLInputElement ? d.value.trim() : "").filter((d, f, m) => d && m.indexOf(d) === f), a = i.dataset.emptyLabel || g("EIDOLON.SceneCriteria.ValueListEmpty", "No values have been added to this criterion.");
  if (i.innerHTML = "", !o.length) {
    const d = document.createElement("option");
    d.value = "", d.textContent = a, d.selected = !0, i.appendChild(d);
    return;
  }
  const l = o.includes(r) ? r : o[0];
  for (const d of o) {
    const f = document.createElement("option");
    f.value = d, f.textContent = d, f.selected = d === l, i.appendChild(f);
  }
}, "#syncDefaultOptions"), Hs = /* @__PURE__ */ s(async function() {
  if (!this.scene) return;
  const n = xe(this.scene).sort((r, o) => r.order - o.order), i = n.findIndex((r) => r.id === h(this, ae).id);
  i < 0 ? (h(this, ae).order = n.length, n.push(h(this, ae))) : (h(this, ae).order = n[i].order, n.splice(i, 1, h(this, ae)));
  try {
    await vr(this.scene, n), this.onSave && await this.onSave(h(this, ae));
  } catch (r) {
    Rs(r);
  }
}, "#persist"), s(it, "CategoryEditorApplication"), Ve(it, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  ft(it, it, "DEFAULT_OPTIONS"),
  {
    id: `${de}-criterion-editor`,
    classes: Array.from(
      /* @__PURE__ */ new Set([...((Xa = ft(it, it, "DEFAULT_OPTIONS")) == null ? void 0 : Xa.classes) ?? [], "standard-form", "themed"])
    ),
    window: {
      title: g("EIDOLON.SceneCriteria.EditCategory", "Edit Criterion"),
      resizable: !1
    },
    position: {
      width: 460,
      height: "auto"
    }
  },
  { inplace: !1 }
)), Ve(it, "PARTS", {
  content: {
    template: `modules/${de}/templates/scene-criteria-editor.html`
  }
});
let Mo = it;
function bn(e) {
  return String(e ?? "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "criterion";
}
s(bn, "slugifyKey");
const bc = `modules/${de}/templates/scene-criteria-tab.html`, Ao = {
  log: /* @__PURE__ */ s((...e) => {
    var t;
    return (t = console.debug) == null ? void 0 : t.call(console, `${de} | Criteria`, ...e);
  }, "log"),
  group: /* @__PURE__ */ s((...e) => {
    var t;
    return (t = console.groupCollapsed) == null ? void 0 : t.call(console, `${de} | Criteria`, ...e);
  }, "group"),
  groupEnd: /* @__PURE__ */ s(() => {
    var e;
    return (e = console.groupEnd) == null ? void 0 : e.call(console);
  }, "groupEnd")
}, Tc = Sr(Mo), Ec = Ns({
  tabId: "criteria",
  tabLabel: /* @__PURE__ */ s(() => g("EIDOLON.SceneCriteria.TabLabel", "Criteria"), "tabLabel"),
  getScene: Qe,
  isApplicable: /* @__PURE__ */ s(() => Ir(), "isApplicable"),
  renderContent: /* @__PURE__ */ s(({ app: e, tab: t, scene: n }) => Lc(e, t, n), "renderContent"),
  logger: Ao
});
function Cc() {
  return Ec.register();
}
s(Cc, "registerSceneCriteriaConfigHook");
function Lc(e, t, n) {
  if (!(t instanceof HTMLElement)) return;
  const i = Le(n) ? n : Qe(e);
  en(e, t, i);
}
s(Lc, "renderCriteriaTab");
async function en(e, t, n) {
  var r, o;
  const i = n ?? Qe(e);
  Ao.group("renderCriteriaTabContent", { sceneId: (i == null ? void 0 : i.id) ?? null });
  try {
    if (!Le(i)) {
      const d = g(
        "EIDOLON.SceneCriteria.Unavailable",
        "Scene criteria are unavailable for this configuration sheet."
      );
      t.innerHTML = `<p class="notes">${d}</p>`;
      return;
    }
    const a = xe(i).sort((d, f) => d.order - f.order), l = Qn(i, a), c = ((o = (r = foundry == null ? void 0 : foundry.applications) == null ? void 0 : r.handlebars) == null ? void 0 : o.renderTemplate) ?? (typeof renderTemplate == "function" ? renderTemplate : globalThis == null ? void 0 : globalThis.renderTemplate);
    if (typeof c != "function") {
      t.innerHTML = `<p class="notes">${g("EIDOLON.SceneCriteria.CategoryListEmpty", "No criteria configured for this scene.")}</p>`;
      return;
    }
    const u = await c(bc, {
      description: g(
        "EIDOLON.SceneCriteria.Description",
        "Define scene criteria dimensions and allowed values used by matching rules."
      ),
      labels: {
        list: g("EIDOLON.SceneCriteria.CategoryListLabel", "Scene Criteria"),
        empty: g(
          "EIDOLON.SceneCriteria.CategoryListEmpty",
          "No criteria configured for this scene."
        ),
        add: g("EIDOLON.SceneCriteria.AddCategory", "Add Criterion"),
        edit: g("EIDOLON.SceneCriteria.EditCategory", "Edit Criterion"),
        remove: g("EIDOLON.SceneCriteria.RemoveCategory", "Remove Criterion"),
        moveUp: g("EIDOLON.SceneCriteria.MoveUp", "Move Up"),
        moveDown: g("EIDOLON.SceneCriteria.MoveDown", "Move Down"),
        values: g("EIDOLON.SceneCriteria.ValuesLabel", "Allowed Values"),
        unnamed: g("EIDOLON.SceneCriteria.UnnamedCategory", "Unnamed Criterion")
      },
      summary: {
        criteriaCount: a.length,
        valueCount: a.reduce((d, f) => d + f.values.length, 0)
      },
      criteria: a.map((d, f) => {
        var m, y;
        return {
          id: d.id,
          label: d.label,
          displayName: ((y = (m = d.label) == null ? void 0 : m.trim) == null ? void 0 : y.call(m)) || g("EIDOLON.SceneCriteria.UnnamedCategory", "Unnamed Criterion"),
          hasValues: d.values.length > 0,
          values: d.values.map((b) => ({
            value: b,
            isCurrent: (l[d.key] ?? d.default) === b
          })),
          valueCountLabel: Sc(d.values.length),
          canMoveUp: f > 0,
          canMoveDown: f < a.length - 1
        };
      }),
      hasCriteria: a.length > 0
    });
    t.innerHTML = u, wc(e, t, i);
  } catch (a) {
    console.error(`${de} | Failed to render criteria tab`, a), t.innerHTML = `<p class="notes">${g("EIDOLON.SceneCriteria.CategoryListEmpty", "No criteria configured for this scene.")}</p>`;
  } finally {
    Ao.groupEnd();
  }
}
s(en, "renderCriteriaTabContent");
function wc(e, t, n) {
  const i = n ?? Qe(e);
  if (!Le(i)) return;
  const r = t.querySelector('[data-criteria-action="add"]');
  r && r.addEventListener("click", () => {
    _a(e, {
      scene: i,
      criterion: Xo(
        g("EIDOLON.SceneCriteria.DefaultCategoryName", "New Criterion")
      ),
      isNew: !0,
      onSave: /* @__PURE__ */ s(() => en(e, t, i), "onSave")
    });
  }), t.querySelectorAll('[data-criteria-action="edit"]').forEach((o) => {
    const a = o.dataset.criterionId;
    a && o.addEventListener("click", () => {
      const l = xe(i).find((c) => c.id === a);
      l && _a(e, {
        scene: i,
        criterion: l,
        onSave: /* @__PURE__ */ s(() => en(e, t, i), "onSave")
      });
    });
  }), t.querySelectorAll('[data-criteria-action="remove"]').forEach((o) => {
    const a = o.dataset.criterionId;
    a && o.addEventListener("click", async () => {
      await Ur(i, (c) => {
        const u = c.findIndex((d) => d.id === a);
        return u < 0 ? !1 : (c.splice(u, 1), jr(c), !0);
      }) && await en(e, t, i);
    });
  }), t.querySelectorAll('[data-criteria-action="move-up"]').forEach((o) => {
    const a = o.dataset.criterionId;
    a && o.addEventListener("click", async () => {
      await Ur(i, (c) => {
        const u = c.findIndex((f) => f.id === a);
        if (u <= 0) return !1;
        const [d] = c.splice(u, 1);
        return c.splice(u - 1, 0, d), jr(c), !0;
      }) && await en(e, t, i);
    });
  }), t.querySelectorAll('[data-criteria-action="move-down"]').forEach((o) => {
    const a = o.dataset.criterionId;
    a && o.addEventListener("click", async () => {
      await Ur(i, (c) => {
        const u = c.findIndex((f) => f.id === a);
        if (u < 0 || u >= c.length - 1) return !1;
        const [d] = c.splice(u, 1);
        return c.splice(u + 1, 0, d), jr(c), !0;
      }) && await en(e, t, i);
    });
  });
}
s(wc, "bindCriteriaTabEvents");
async function Ur(e, t) {
  const n = xe(e).sort((r, o) => r.order - o.order);
  if (t(n) === !1) return !1;
  try {
    return await vr(e, n), !0;
  } catch (r) {
    return Rs(r), !1;
  }
}
s(Ur, "mutateCriteria");
function _a(e, t = {}) {
  const n = t.scene ?? null, i = n && Le(n) ? n : Qe(e);
  if (!Le(i))
    return;
  Tc({
    scene: i,
    criterion: t.criterion ?? null,
    isNew: !!t.isNew,
    onSave: typeof t.onSave == "function" ? t.onSave : null
  }).render({ force: !0 });
}
s(_a, "openCriterionEditor");
function jr(e) {
  e.forEach((t, n) => {
    t.order = n;
  });
}
s(jr, "reindexCriteriaOrder");
function Sc(e) {
  var t, n;
  if ((n = (t = game.i18n) == null ? void 0 : t.has) != null && n.call(t, "EIDOLON.SceneCriteria.ValueCountLabel"))
    try {
      return game.i18n.format("EIDOLON.SceneCriteria.ValueCountLabel", { count: e });
    } catch (i) {
      console.error(`${de} | Failed to format value count label`, i);
    }
  return e === 0 ? "No values configured" : e === 1 ? "1 value" : `${e} values`;
}
s(Sc, "formatValueCount");
let Fa = !1;
function Ic() {
  Hooks.once("init", () => {
    gc();
  }), Hooks.once("ready", () => {
    Ir() && (Fa || (Cc(), Fa = !0));
  });
}
s(Ic, "registerSceneCriteriaHooks");
Ic();
const J = L, Ps = "criteriaEngineVersion", Ut = "fileIndex", jt = "tileCriteria", ea = {
  LEGACY: 1,
  CRITERIA: 2
}, Bs = ea.CRITERIA;
function qs(e) {
  var t;
  return ((t = e == null ? void 0 : e.getFlag) == null ? void 0 : t.call(e, J, Ps)) ?? ea.LEGACY;
}
s(qs, "getSceneEngineVersion");
function vc(e, t, n, i, r) {
  if (!(e != null && e.length) || !(n != null && n.length)) return -1;
  const o = {};
  for (const l of n)
    o[l] = t[l];
  const a = Da(e, o, n);
  if (a >= 0) return a;
  if (i != null && i.length && r) {
    const l = { ...o };
    for (const c of i) {
      if (!(c in l)) continue;
      l[c] = r[c] ?? "Standard";
      const u = Da(e, l, n);
      if (u >= 0) return u;
    }
  }
  return -1;
}
s(vc, "findBestMatch");
function Da(e, t, n) {
  return e.findIndex((i) => {
    for (const r of n)
      if (i[r] !== t[r]) return !1;
    return !0;
  });
}
s(Da, "findExactMatch");
function Oc(e, t) {
  if (!(e != null && e.length)) return -1;
  let n = -1, i = -1;
  for (let r = 0; r < e.length; r += 1) {
    const o = e[r] ?? {}, a = Object.keys(o);
    if (a.length === 0) {
      i < 0 && (n = r, i = 0);
      continue;
    }
    let l = !0;
    for (const c of a)
      if (o[c] !== t[c]) {
        l = !1;
        break;
      }
    l && a.length > i && (n = r, i = a.length);
  }
  return n;
}
s(Oc, "findFileIndex");
function Li(e) {
  return e && typeof e == "object" && !Array.isArray(e);
}
s(Li, "isPlainObject$2");
function ka(e) {
  return e == null ? e : typeof structuredClone == "function" ? structuredClone(e) : JSON.parse(JSON.stringify(e));
}
s(ka, "deepClone");
function Mc(e, t) {
  if (!t) return;
  const n = t.split(".").filter(Boolean);
  if (!n.length) return;
  let i = e;
  for (let r = 0; r < n.length - 1; r += 1) {
    if (!Li(i == null ? void 0 : i[n[r]])) return;
    i = i[n[r]];
  }
  delete i[n.at(-1)];
}
s(Mc, "deletePath");
function Us(e, t) {
  const n = ka(e ?? {});
  if (!Li(t)) return n;
  for (const [i, r] of Object.entries(t)) {
    if (i.startsWith("-=") && r === !0) {
      Mc(n, i.slice(2));
      continue;
    }
    Li(r) && Li(n[i]) ? n[i] = Us(n[i], r) : n[i] = ka(r);
  }
  return n;
}
s(Us, "fallbackMerge");
function Ac(e, t) {
  var n, i;
  return (n = foundry == null ? void 0 : foundry.utils) != null && n.mergeObject && ((i = foundry == null ? void 0 : foundry.utils) != null && i.deepClone) ? foundry.utils.mergeObject(e, foundry.utils.deepClone(t), {
    inplace: !1
  }) : Us(e, t);
}
s(Ac, "defaultMerge");
function Nc(e, t) {
  if (!e) return !0;
  for (const n of Object.keys(e))
    if (e[n] !== t[n]) return !1;
  return !0;
}
s(Nc, "criteriaMatch");
function js(e, t, n, i) {
  const r = i ?? Ac;
  let o = r({}, e ?? {});
  if (!(t != null && t.length)) return o;
  const a = [];
  for (let l = 0; l < t.length; l += 1) {
    const c = t[l];
    if (Nc(c == null ? void 0 : c.criteria, n)) {
      const u = c != null && c.criteria ? Object.keys(c.criteria).length : 0;
      a.push({ specificity: u, index: l, delta: c == null ? void 0 : c.delta });
    }
  }
  a.sort((l, c) => l.specificity - c.specificity || l.index - c.index);
  for (const l of a)
    l.delta && (o = r(o, l.delta));
  return o;
}
s(js, "resolveRules");
function Or(e = null) {
  var i;
  const t = (game == null ? void 0 : game.user) ?? null;
  if (!t) return !1;
  if (t.isGM) return !0;
  const n = e ?? ((i = game == null ? void 0 : game.scenes) == null ? void 0 : i.viewed) ?? null;
  if (!n) return !1;
  if (typeof n.canUserModify == "function")
    try {
      return !!n.canUserModify(t, "update");
    } catch {
    }
  if (typeof n.testUserPermission == "function")
    try {
      return !!n.testUserPermission(t, "OWNER");
    } catch {
    }
  return !!n.isOwner;
}
s(Or, "canManageCriteria");
function _c(e = null) {
  if (!Or(e))
    throw new Error(`${J} | You do not have permission to manage scene criteria.`);
}
s(_c, "requireCriteriaAccess");
const Fc = /* @__PURE__ */ s((...e) => console.log(`${J} | criteria tiles:`, ...e), "log$1");
let Hi = /* @__PURE__ */ new WeakMap(), Pi = /* @__PURE__ */ new WeakMap();
const xa = 200;
function Dc(e) {
  return e ? Number.isInteger(e.size) ? e.size : Array.isArray(e) || typeof e.length == "number" ? e.length : Array.from(e).length : 0;
}
s(Dc, "getCollectionSize$1");
function si() {
  return typeof (performance == null ? void 0 : performance.now) == "function" ? performance.now() : Date.now();
}
s(si, "nowMs$2");
function kc(e) {
  if (!Array.isArray(e)) return [];
  const t = /* @__PURE__ */ new Set();
  for (const n of e) {
    if (typeof n != "string") continue;
    const i = n.trim();
    i && t.add(i);
  }
  return Array.from(t);
}
s(kc, "uniqueStringKeys$1");
function xc(e, t = xa) {
  if (!Array.isArray(e) || e.length === 0) return [];
  const n = Number.isInteger(t) && t > 0 ? t : xa, i = [];
  for (let r = 0; r < e.length; r += n)
    i.push(e.slice(r, r + n));
  return i;
}
s(xc, "chunkArray$1");
async function Rc(e, t, n) {
  const i = xc(t, n);
  for (const r of i)
    await e.updateEmbeddedDocuments("Tile", r), i.length > 1 && await Promise.resolve();
  return i.length;
}
s(Rc, "updateTilesInChunks");
function $c(e) {
  var i;
  const t = Kt(e, { files: null });
  if (!((i = t == null ? void 0 : t.variants) != null && i.length)) return [];
  const n = /* @__PURE__ */ new Set();
  for (const r of t.variants)
    for (const o of Object.keys(r.criteria ?? {}))
      o && n.add(o);
  return Array.from(n);
}
s($c, "getTileCriteriaDependencyKeys");
function Hc(e, t) {
  const n = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Set();
  for (const r of t) {
    const o = r.getFlag(J, jt) ?? r.getFlag(J, Ut);
    if (o) {
      i.add(r.id);
      for (const a of $c(o))
        n.has(a) || n.set(a, /* @__PURE__ */ new Set()), n.get(a).add(r.id);
    }
  }
  return {
    collection: t,
    keyToTileIds: n,
    allTileIds: i
  };
}
s(Hc, "buildTileDependencyIndex");
function Pc(e, t) {
  const n = Pi.get(e);
  if ((n == null ? void 0 : n.collection) === t) return n;
  const i = Hc(e, t);
  return Pi.set(e, i), i;
}
s(Pc, "getTileDependencyIndex");
function Bc(e, t, n) {
  const i = kc(n);
  if (!i.length)
    return Array.from(t ?? []);
  const r = Pc(e, t), o = /* @__PURE__ */ new Set();
  for (const a of i) {
    const l = r.keyToTileIds.get(a);
    if (l)
      for (const c of l)
        o.add(c);
  }
  return o.size ? typeof (t == null ? void 0 : t.get) == "function" ? Array.from(o).map((a) => t.get(a)).filter(Boolean) : Array.from(t ?? []).filter((a) => o.has(a.id)) : [];
}
s(Bc, "getTilesForChangedKeys");
function Vs(e) {
  return typeof (e == null ? void 0 : e.name) == "string" ? e.name : typeof (e == null ? void 0 : e.src) == "string" ? e.src : "";
}
s(Vs, "getFilePath");
function Bi(e) {
  if (typeof e != "string") return "";
  const t = e.trim();
  if (!t) return "";
  const n = t.replace(/\\/g, "/");
  try {
    return decodeURIComponent(n);
  } catch {
    return n;
  }
}
s(Bi, "normalizeFilePath");
function ta(e) {
  if (!Array.isArray(e)) return [];
  const t = /* @__PURE__ */ new Map();
  return e.map((n, i) => {
    const r = Bi(Vs(n)), o = r || `__index:${i}`, a = t.get(o) ?? 0;
    t.set(o, a + 1);
    const l = {
      indexHint: i
    };
    return r && (l.path = r, l.occurrence = a), {
      index: i,
      path: r,
      occurrence: a,
      target: l,
      label: r.split("/").pop() || `File ${i + 1}`
    };
  });
}
s(ta, "buildTileFileEntries");
function St(e, t) {
  if (!Number.isInteger(t) || t < 0) return null;
  const i = ta(e).find((r) => r.index === t);
  return i ? { ...i.target } : { indexHint: t };
}
s(St, "createTileTargetFromIndex");
function Mr(e) {
  if (!e || typeof e != "object") return null;
  const t = Bi(e.path), n = Number(e.indexHint ?? e.fileIndex), i = Number(e.occurrence), r = {};
  return t && (r.path = t, r.occurrence = Number.isInteger(i) && i >= 0 ? i : 0), Number.isInteger(n) && n >= 0 && (r.indexHint = n), !r.path && !Number.isInteger(r.indexHint) ? null : r;
}
s(Mr, "normalizeTileTarget");
function An(e, t) {
  const n = Mr(e);
  if (!n) return -1;
  const i = ta(t);
  if (!i.length) return -1;
  if (n.path) {
    const r = i.filter((o) => o.path === n.path);
    if (r.length > 0) {
      const o = Number.isInteger(n.occurrence) ? n.occurrence : 0;
      if (r[o]) return r[o].index;
      if (Number.isInteger(n.indexHint)) {
        const a = r.find((l) => l.index === n.indexHint);
        if (a) return a.index;
      }
      return r[0].index;
    }
  }
  return Number.isInteger(n.indexHint) && n.indexHint < i.length ? n.indexHint : -1;
}
s(An, "resolveTileTargetIndex");
function It(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return {};
  const t = {};
  for (const [n, i] of Object.entries(e))
    typeof n != "string" || !n || typeof i != "string" || !i.trim() || (t[n] = i.trim());
  return t;
}
s(It, "sanitizeCriteria");
function qc(e) {
  return Object.entries(It(e)).sort(([n], [i]) => n.localeCompare(i)).map(([n, i]) => `${n}=${i}`).join("");
}
s(qc, "serializeCriteria");
function Uc(e) {
  return Object.keys(It(e)).length;
}
s(Uc, "getCriteriaSpecificity");
function jc(e, t) {
  const n = It(e), i = It(t);
  for (const [r, o] of Object.entries(n))
    if (r in i && i[r] !== o)
      return !1;
  return !0;
}
s(jc, "areCriteriaCompatible");
function Vc(e, t) {
  const n = An(e, t);
  if (Number.isInteger(n) && n >= 0)
    return `index:${n}`;
  const i = Mr(e);
  if (!i) return "";
  if (i.path) {
    const r = Number.isInteger(i.occurrence) ? i.occurrence : 0;
    return `path:${i.path}#${r}`;
  }
  return Number.isInteger(i.indexHint) ? `hint:${i.indexHint}` : "";
}
s(Vc, "getTargetIdentity");
function zs(e, t = {}) {
  var l;
  const n = Array.isArray(t.files) ? t.files : [], i = Kt(e, { files: n });
  if (!((l = i == null ? void 0 : i.variants) != null && l.length))
    return {
      errors: [],
      warnings: []
    };
  const r = i.variants.map((c, u) => ({
    index: u,
    criteria: It(c.criteria),
    specificity: Uc(c.criteria),
    criteriaSignature: qc(c.criteria),
    targetIdentity: Vc(c.target, n)
  })), o = [], a = [];
  for (let c = 0; c < r.length; c += 1) {
    const u = r[c];
    for (let d = c + 1; d < r.length; d += 1) {
      const f = r[d];
      if (u.specificity !== f.specificity || !jc(u.criteria, f.criteria)) continue;
      if (!(!!u.targetIdentity && u.targetIdentity === f.targetIdentity)) {
        o.push({
          leftIndex: u.index,
          rightIndex: f.index,
          type: u.criteriaSignature === f.criteriaSignature ? "equivalent" : "overlap",
          specificity: u.specificity
        });
        continue;
      }
      u.criteriaSignature === f.criteriaSignature && a.push({
        leftIndex: u.index,
        rightIndex: f.index,
        type: "duplicate"
      });
    }
  }
  return {
    errors: o,
    warnings: a
  };
}
s(zs, "detectTileCriteriaConflicts");
function zc(e, t) {
  if (!e || typeof e != "object") return null;
  let n = Mr(e.target);
  if (!n) {
    const i = Number(e.fileIndex);
    Number.isInteger(i) && i >= 0 && (n = St(t, i));
  }
  return n ? {
    criteria: It(e.criteria),
    target: n
  } : null;
}
s(zc, "normalizeTileVariant");
function Gs(e, t = {}) {
  if (!Array.isArray(e) || e.length === 0) return null;
  const n = Array.isArray(t.files) ? t.files : null, i = e.map((c, u) => ({
    criteria: It(c),
    target: St(n, u)
  })).filter((c) => c.target);
  if (!i.length) return null;
  const r = i.find((c) => Object.keys(c.criteria).length === 0), o = (r == null ? void 0 : r.target) ?? i[0].target;
  let a = null;
  const l = Number(t.defaultFileIndex);
  return Number.isInteger(l) && l >= 0 && (a = St(n, l)), a || (a = o), {
    strategy: "select-one",
    variants: i,
    defaultTarget: a
  };
}
s(Gs, "buildTileCriteriaFromFileIndex");
function Kt(e, t = {}) {
  const n = Array.isArray(t.files) ? t.files : null;
  if (Array.isArray(e))
    return Gs(e, { files: n });
  if (!e || typeof e != "object") return null;
  const i = Array.isArray(e.variants) ? e.variants.map((o) => zc(o, n)).filter(Boolean) : [];
  if (!i.length) return null;
  let r = Mr(e.defaultTarget);
  if (!r) {
    const o = Number(e.defaultFileIndex);
    Number.isInteger(o) && o >= 0 && (r = St(n, o));
  }
  if (!r) {
    const o = i.find((a) => Object.keys(a.criteria).length === 0);
    r = (o == null ? void 0 : o.target) ?? i[0].target;
  }
  return {
    strategy: "select-one",
    variants: i,
    defaultTarget: r
  };
}
s(Kt, "normalizeTileCriteria");
function Gc(e, t) {
  if (!e) return -1;
  let n = -1, i = -1;
  for (const r of e.variants) {
    const o = r.keys;
    let a = !0;
    for (const l of o)
      if (r.criteria[l] !== (t == null ? void 0 : t[l])) {
        a = !1;
        break;
      }
    a && o.length > i && (i = o.length, n = r.targetIndex);
  }
  return n >= 0 ? n : e.defaultIndex;
}
s(Gc, "selectTileFileIndexFromCompiled");
function Wc(e, t) {
  const n = Kt(e, { files: t });
  if (!n) return null;
  const i = n.variants.map((o) => {
    const a = It(o.criteria), l = An(o.target, t);
    return !Number.isInteger(l) || l < 0 ? null : {
      criteria: a,
      keys: Object.keys(a),
      targetIndex: l
    };
  }).filter(Boolean), r = An(n.defaultTarget, t);
  return !i.length && (!Number.isInteger(r) || r < 0) ? null : {
    variants: i,
    defaultIndex: r
  };
}
s(Wc, "compileTileMatcher");
function Kc(e, t, n) {
  const i = Hi.get(e);
  if (i && i.tileCriteria === t && i.files === n)
    return i.compiled;
  const r = Wc(t, n);
  return Hi.set(e, {
    tileCriteria: t,
    files: n,
    compiled: r
  }), r;
}
s(Kc, "getCompiledTileMatcher");
function Jc(e = null, t = null) {
  e ? Pi.delete(e) : Pi = /* @__PURE__ */ new WeakMap(), t ? Hi.delete(t) : e || (Hi = /* @__PURE__ */ new WeakMap());
}
s(Jc, "invalidateTileCriteriaCaches");
async function Ws(e, t, n = {}) {
  var c, u, d, f;
  const i = si(), r = {
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
  if (t = t ?? ((c = game.scenes) == null ? void 0 : c.viewed), !t)
    return r.durationMs = si() - i, r;
  const o = t.getEmbeddedCollection("Tile") ?? [];
  r.total = Dc(o);
  const a = Bc(t, o, n.changedKeys);
  if (r.scanned = a.length, !a.length)
    return r.skipped.unaffected = r.total, r.durationMs = si() - i, r;
  const l = [];
  for (const m of a) {
    const y = m.getFlag(J, jt) ?? m.getFlag(J, Ut);
    if (!y) {
      r.skipped.noCriteria += 1;
      continue;
    }
    const b = m.getFlag("monks-active-tiles", "files");
    if (!(b != null && b.length)) {
      r.skipped.noFiles += 1;
      continue;
    }
    const p = Kc(m, y, b), T = Gc(p, e);
    if (!Number.isInteger(T) || T < 0 || T >= b.length) {
      console.warn(`${J} | Tile ${m.id} has no valid file match for state`, e), r.skipped.noMatch += 1;
      continue;
    }
    const E = T + 1, I = Number(m.getFlag("monks-active-tiles", "fileindex")) !== E, D = b.some((H, Q) => !!(H != null && H.selected) != (Q === T)), _ = Bi(((u = m.texture) == null ? void 0 : u.src) ?? ((f = (d = m._source) == null ? void 0 : d.texture) == null ? void 0 : f.src) ?? ""), F = Vs(b[T]), x = Bi(F), W = !!x && x !== _;
    if (!D && !I && !W) {
      r.skipped.unchanged += 1;
      continue;
    }
    const te = {
      _id: m._id
    };
    D && (te["flags.monks-active-tiles.files"] = b.map((H, Q) => ({
      ...H,
      selected: Q === T
    }))), I && (te["flags.monks-active-tiles.fileindex"] = E), W && (te.texture = { src: F }), l.push(te), Fc(`Tile ${m.id} -> ${F}`);
  }
  return l.length > 0 && (r.chunks = await Rc(t, l, n.chunkSize), r.updated = l.length), r.durationMs = si() - i, r;
}
s(Ws, "updateTiles");
function Yc() {
  if (!globalThis.Tagger) return [];
  const e = ["Checkbox", "Tile", "Settings", "Toggleable Lights"], t = [
    "Checkbox",
    "Tile",
    "Settings",
    "Toggleable Lights",
    "Checked",
    "Unchecked",
    "Individual"
  ], n = Tagger.getByTag(e) ?? [], i = [];
  for (const r of n) {
    if (r.getFlag("monks-active-tiles", "variables.state") !== "unchecked") continue;
    const o = (Tagger.getTags(r) ?? []).filter((c) => !t.includes(c)), a = (Tagger.getByTag("Disable Automation") ?? []).concat(Tagger.getByTag("Settings") ?? []), l = Tagger.getByTag(o, { ignore: a }) ?? [];
    for (const c of l)
      c != null && c._id && i.push(c._id);
  }
  return i;
}
s(Yc, "buildLightControlsMap");
const Vt = L, an = "lightCriteria", na = Object.freeze({
  base: null,
  mappings: [],
  current: null
});
function Vr(e) {
  return e && typeof e == "object" && !Array.isArray(e);
}
s(Vr, "isPlainObject$1");
function Ks(e, t) {
  if (!Vr(t)) return {};
  const n = {};
  for (const [i, r] of Object.entries(t)) {
    const o = e == null ? void 0 : e[i];
    if (Vr(r) && Vr(o)) {
      const a = Ks(o, r);
      Object.keys(a).length > 0 && (n[i] = a);
    } else r !== o && (n[i] = Ye(r));
  }
  return n;
}
s(Ks, "computeDelta");
function Js(e) {
  var n;
  const t = ((n = e == null ? void 0 : e.getFlag) == null ? void 0 : n.call(e, Vt, an)) ?? na;
  return Nn(t);
}
s(Js, "getLightCriteriaState");
async function Ys(e, t) {
  const n = Nn(t);
  if (!(e != null && e.setFlag))
    return n;
  const i = n.base !== null, r = n.mappings.length > 0, o = n.current !== null;
  return !i && !r && !o ? (typeof e.unsetFlag == "function" ? await e.unsetFlag(Vt, an) : await e.setFlag(Vt, an, null), na) : (await e.setFlag(Vt, an, n), n);
}
s(Ys, "setLightCriteriaState");
async function Xn(e, t) {
  if (typeof t != "function")
    throw new TypeError("updateLightCriteriaState requires an updater function.");
  const n = Ye(Js(e)), i = await t(n);
  return Ys(e, i);
}
s(Xn, "updateLightCriteriaState");
async function Ra(e, t) {
  const n = Jt(t);
  if (!n)
    throw new Error("Invalid light configuration payload.");
  return Xn(e, (i) => ({
    ...i,
    base: n
  }));
}
s(Ra, "storeBaseLighting");
async function $a(e, t, n, { label: i } = {}) {
  const r = Zn(t);
  if (!r)
    throw new Error("Cannot create a mapping without at least one category selection.");
  const o = Jt(n);
  if (!o)
    throw new Error("Invalid light configuration payload.");
  return Xn(e, (a) => {
    const l = gn(r), c = Array.isArray(a == null ? void 0 : a.mappings) ? [...a.mappings] : [], u = c.findIndex((y) => (y == null ? void 0 : y.key) === l), d = u >= 0 ? c[u] : null, f = typeof (d == null ? void 0 : d.id) == "string" && d.id.trim() ? d.id.trim() : Xs(), m = Ar({
      id: f,
      categories: r,
      config: o,
      label: typeof i == "string" ? i : (d == null ? void 0 : d.label) ?? null,
      updatedAt: Date.now()
    });
    if (!m)
      throw new Error("Failed to sanitize criteria mapping entry.");
    return u >= 0 ? c[u] = m : c.push(m), {
      ...a,
      mappings: c
    };
  });
}
s($a, "upsertLightCriteriaMapping");
async function Qc(e, t, n, i, { replaceExisting: r = !1 } = {}) {
  const o = typeof t == "string" ? t.trim() : "";
  if (!o)
    throw new Error("A mapping id is required to retarget criteria.");
  const a = Zn(n);
  if (!a)
    throw new Error("Cannot retarget mapping without at least one category selection.");
  const l = Jt(i);
  if (!l)
    throw new Error("Invalid light configuration payload.");
  return Xn(e, (c) => {
    const u = Array.isArray(c == null ? void 0 : c.mappings) ? [...c.mappings] : [], d = u.findIndex((E) => (E == null ? void 0 : E.id) === o);
    if (d < 0)
      throw new Error("The selected mapping no longer exists.");
    const f = gn(a), m = u.findIndex(
      (E, C) => C !== d && (E == null ? void 0 : E.key) === f
    );
    if (m >= 0 && !r)
      throw new Error("A mapping already exists for the selected criteria.");
    const y = u[d], b = Ar({
      ...y,
      id: o,
      categories: a,
      config: l,
      updatedAt: Date.now()
    });
    if (!b)
      throw new Error("Failed to sanitize updated mapping.");
    u[d] = b;
    let p = null;
    if (m >= 0) {
      const [E] = u.splice(m, 1);
      p = (E == null ? void 0 : E.id) ?? null;
    }
    let T = (c == null ? void 0 : c.current) ?? null;
    return T && typeof T == "object" && (T.mappingId === o ? T = {
      ...T,
      mappingId: o,
      categories: a,
      updatedAt: Date.now()
    } : p && T.mappingId === p && (T = {
      ...T,
      mappingId: o,
      categories: a,
      updatedAt: Date.now()
    })), {
      ...c,
      mappings: u,
      current: T
    };
  });
}
s(Qc, "retargetLightCriteriaMapping");
async function Xc(e, t) {
  const n = typeof t == "string" ? t.trim() : "";
  if (!n)
    throw new Error("A mapping id is required to remove a mapping.");
  return Xn(e, (i) => {
    const r = Array.isArray(i == null ? void 0 : i.mappings) ? [...i.mappings] : [], o = r.findIndex((l) => (l == null ? void 0 : l.id) === n);
    if (o < 0) return i;
    r.splice(o, 1);
    let a = (i == null ? void 0 : i.current) ?? null;
    return (a == null ? void 0 : a.mappingId) === n && (a = null), {
      ...i,
      mappings: r,
      current: a
    };
  });
}
s(Xc, "removeLightCriteriaMapping");
async function vn(e, t) {
  const n = Qs(t);
  return Xn(e, (i) => ({
    ...i,
    current: n
  }));
}
s(vn, "storeCurrentCriteriaSelection");
function Zc(e) {
  const t = Nn(e), n = t.base ?? {}, i = [];
  for (const r of t.mappings) {
    const o = Zn(r == null ? void 0 : r.categories);
    if (!o) continue;
    const a = Ks(n, (r == null ? void 0 : r.config) ?? {});
    Object.keys(a).length !== 0 && i.push({
      criteria: o,
      delta: a
    });
  }
  return {
    base: n,
    rules: i
  };
}
s(Zc, "convertLightCriteriaStateToPresets");
function eu(e, t = []) {
  const n = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Set();
  for (const c of t)
    typeof (c == null ? void 0 : c.key) == "string" && c.key.trim() && i.add(c.key.trim()), typeof (c == null ? void 0 : c.id) == "string" && c.id.trim() && typeof (c == null ? void 0 : c.key) == "string" && n.set(c.id.trim(), c.key.trim());
  const r = Nn(e), o = /* @__PURE__ */ s((c) => {
    const u = {};
    for (const [d, f] of Object.entries(c ?? {})) {
      const m = String(d ?? "").trim(), y = typeof f == "string" ? f.trim() : "";
      if (!m || !y) continue;
      if (i.has(m)) {
        u[m] = y;
        continue;
      }
      const b = n.get(m);
      b && (u[b] = y);
    }
    return Object.keys(u).length ? u : null;
  }, "remapCategories"), a = r.mappings.map((c) => {
    const u = o(c.categories);
    return u ? Ar({
      ...c,
      categories: u,
      key: gn(u)
    }) : null;
  }).filter(Boolean);
  let l = r.current;
  if (l != null && l.categories) {
    const c = o(l.categories);
    l = c ? {
      ...l,
      categories: c
    } : null;
  }
  return Nn({
    ...r,
    mappings: a,
    current: l
  });
}
s(eu, "migrateLightCriteriaCategoriesToKeys");
function Nn(e) {
  var c;
  const t = Ye(e);
  if (!t || typeof t != "object")
    return Ye(na);
  const n = Jt(t.base), i = Array.isArray(t.mappings) ? t.mappings : [], r = /* @__PURE__ */ new Map();
  for (const u of i) {
    const d = Ar(u);
    d && r.set(d.key, d);
  }
  const o = Array.from(r.values()), a = new Map(o.map((u) => [u.id, u]));
  let l = Qs(t.current);
  if (l) {
    const u = l.categories && Object.keys(l.categories).length > 0;
    if (l.mappingId && !a.has(l.mappingId)) {
      const d = u ? ((c = o.find((f) => f.key === gn(l.categories))) == null ? void 0 : c.id) ?? null : null;
      d ? l = {
        ...l,
        mappingId: d
      } : u && (l = {
        mappingId: null,
        categories: l.categories,
        updatedAt: l.updatedAt
      });
    }
  }
  return {
    base: n ?? null,
    mappings: o,
    current: l
  };
}
s(Nn, "sanitizeLightCriteriaState");
function Jt(e) {
  const t = Ye(e);
  if (!t || typeof t != "object") return null;
  "_id" in t && delete t._id, "id" in t && delete t.id;
  const n = t.flags;
  if (n && typeof n == "object") {
    const i = n[Vt];
    i && typeof i == "object" && (delete i[an], Object.keys(i).length === 0 && delete n[Vt]), Object.keys(n).length === 0 && delete t.flags;
  }
  return t;
}
s(Jt, "sanitizeLightConfigPayload");
function Ar(e) {
  if (!e || typeof e != "object") return null;
  const t = Zn(e.categories);
  if (!t) return null;
  const n = Jt(e.config);
  if (!n) return null;
  const i = typeof e.id == "string" && e.id.trim() ? e.id.trim() : Xs(), r = gn(t), o = {
    id: i,
    key: r,
    categories: t,
    config: n,
    updatedAt: Number.isFinite(e.updatedAt) ? Number(e.updatedAt) : Date.now()
  };
  return typeof e.label == "string" && e.label.trim() && (o.label = e.label.trim()), o;
}
s(Ar, "sanitizeCriteriaMappingEntry");
function Qs(e) {
  if (!e || typeof e != "object") return null;
  const t = typeof e.mappingId == "string" && e.mappingId.trim() ? e.mappingId.trim() : null, n = Zn(e.categories);
  return !t && !n ? null : {
    mappingId: t,
    categories: n,
    updatedAt: Number.isFinite(e.updatedAt) ? Number(e.updatedAt) : Date.now()
  };
}
s(Qs, "sanitizeCurrentSelection");
function Zn(e) {
  const t = {};
  if (Array.isArray(e))
    for (const n of e) {
      const i = Ha((n == null ? void 0 : n.id) ?? (n == null ? void 0 : n.categoryId) ?? (n == null ? void 0 : n.category)), r = Pa((n == null ? void 0 : n.value) ?? (n == null ? void 0 : n.selection) ?? (n == null ? void 0 : n.label));
      !i || !r || (t[i] = r);
    }
  else if (e && typeof e == "object")
    for (const [n, i] of Object.entries(e)) {
      const r = Ha(n), o = Pa(i);
      !r || !o || (t[r] = o);
    }
  return Object.keys(t).length > 0 ? t : null;
}
s(Zn, "sanitizeCriteriaCategories");
function gn(e) {
  if (!e || typeof e != "object") return "";
  const t = Object.entries(e).filter(([, n]) => typeof n == "string" && n).map(([n, i]) => `${n}:${i}`);
  return t.sort((n, i) => n < i ? -1 : n > i ? 1 : 0), t.join("|");
}
s(gn, "computeCriteriaMappingKey");
function Xs() {
  var e;
  return (e = foundry == null ? void 0 : foundry.utils) != null && e.randomID ? foundry.utils.randomID() : typeof (crypto == null ? void 0 : crypto.randomUUID) == "function" ? crypto.randomUUID() : Math.random().toString(36).slice(2, 10);
}
s(Xs, "generateLightMappingId");
function Ha(e) {
  if (typeof e != "string") return null;
  const t = e.trim();
  return t || null;
}
s(Ha, "normalizeCategoryId");
function Pa(e) {
  if (typeof e != "string") return null;
  const t = e.trim();
  return t || null;
}
s(Pa, "normalizeCategoryValue");
const qi = ["AmbientLight", "Wall", "AmbientSound"];
let Ui = /* @__PURE__ */ new WeakMap(), ji = /* @__PURE__ */ new WeakMap();
const Ba = 200;
function tu(e) {
  return e ? Number.isInteger(e.size) ? e.size : Array.isArray(e) || typeof e.length == "number" ? e.length : Array.from(e).length : 0;
}
s(tu, "getCollectionSize");
function zr() {
  return typeof (performance == null ? void 0 : performance.now) == "function" ? performance.now() : Date.now();
}
s(zr, "nowMs$1");
function nu(e) {
  if (!Array.isArray(e)) return [];
  const t = /* @__PURE__ */ new Set();
  for (const n of e) {
    if (typeof n != "string") continue;
    const i = n.trim();
    i && t.add(i);
  }
  return Array.from(t);
}
s(nu, "uniqueStringKeys");
function iu(e, t = Ba) {
  if (!Array.isArray(e) || e.length === 0) return [];
  const n = Number.isInteger(t) && t > 0 ? t : Ba, i = [];
  for (let r = 0; r < e.length; r += n)
    i.push(e.slice(r, r + n));
  return i;
}
s(iu, "chunkArray");
async function ru(e, t, n, i) {
  const r = iu(n, i);
  for (const o of r)
    await e.updateEmbeddedDocuments(t, o), r.length > 1 && await Promise.resolve();
  return r.length;
}
s(ru, "updatePlaceablesInChunks");
function ou(e) {
  const t = /* @__PURE__ */ new Set();
  for (const n of (e == null ? void 0 : e.rules) ?? [])
    for (const i of Object.keys((n == null ? void 0 : n.criteria) ?? {}))
      i && t.add(i);
  return Array.from(t);
}
s(ou, "getPresetDependencyKeys");
function au(e, t) {
  const n = /* @__PURE__ */ new Map();
  for (const i of qi) {
    const r = t.get(i) ?? [], o = /* @__PURE__ */ new Set(), a = /* @__PURE__ */ new Map();
    for (const l of r) {
      const c = el(l, i);
      if (c != null && c.base) {
        o.add(l.id);
        for (const u of ou(c))
          a.has(u) || a.set(u, /* @__PURE__ */ new Set()), a.get(u).add(l.id);
      }
    }
    n.set(i, {
      allDocIds: o,
      keyToDocIds: a
    });
  }
  return {
    collectionsByType: t,
    byType: n
  };
}
s(au, "buildPlaceableDependencyIndex");
function su(e, t) {
  const n = ji.get(e);
  if (n && qi.every((r) => n.collectionsByType.get(r) === t.get(r)))
    return n;
  const i = au(e, t);
  return ji.set(e, i), i;
}
s(su, "getPlaceableDependencyIndex");
function lu(e, t, n) {
  if (!t || !e) return [];
  const i = nu(n);
  if (!i.length)
    return typeof e.get == "function" ? Array.from(t.allDocIds).map((o) => e.get(o)).filter(Boolean) : Array.from(e).filter((o) => t.allDocIds.has(o.id));
  const r = /* @__PURE__ */ new Set();
  for (const o of i) {
    const a = t.keyToDocIds.get(o);
    if (a)
      for (const l of a) r.add(l);
  }
  return r.size ? typeof e.get == "function" ? Array.from(r).map((o) => e.get(o)).filter(Boolean) : Array.from(e).filter((o) => r.has(o.id)) : [];
}
s(lu, "getDocsForChangedKeys");
function tn(e) {
  return !!e && typeof e == "object" && !Array.isArray(e);
}
s(tn, "isPlainObject");
function No(e, t) {
  if (Object.is(e, t)) return !0;
  if (Array.isArray(e) || Array.isArray(t)) {
    if (!Array.isArray(e) || !Array.isArray(t) || e.length !== t.length) return !1;
    for (let n = 0; n < e.length; n += 1)
      if (!No(e[n], t[n])) return !1;
    return !0;
  }
  if (tn(e) || tn(t)) {
    if (!tn(e) || !tn(t)) return !1;
    const n = Object.keys(t);
    for (const i of n)
      if (!No(e[i], t[i])) return !1;
    return !0;
  }
  return !1;
}
s(No, "areValuesEqual");
function Zs(e, t) {
  const n = { _id: t._id };
  for (const [r, o] of Object.entries(t)) {
    if (r === "_id") continue;
    const a = e == null ? void 0 : e[r];
    if (tn(o) && tn(a)) {
      const l = Zs(a, { _id: t._id, ...o });
      if (!l) continue;
      const c = Object.keys(l).filter((u) => u !== "_id");
      if (c.length > 0) {
        n[r] = {};
        for (const u of c)
          n[r][u] = l[u];
      }
      continue;
    }
    No(a, o) || (n[r] = o);
  }
  return Object.keys(n).filter((r) => r !== "_id").length > 0 ? n : null;
}
s(Zs, "buildChangedPayload");
function el(e, t) {
  var l;
  const n = ((l = e == null ? void 0 : e.flags) == null ? void 0 : l[J]) ?? {}, i = (n == null ? void 0 : n.presets) ?? null, r = t === "AmbientLight" ? (n == null ? void 0 : n.lightCriteria) ?? null : null, o = Ui.get(e);
  if (o && o.type === t && o.rawPresets === i && o.rawLightCriteria === r)
    return o.presets;
  let a = null;
  if (n != null && n.presets) {
    const c = n.presets.base ?? null, u = Array.isArray(n.presets.rules) ? n.presets.rules : [];
    (c && Object.keys(c).length > 0 || u.length > 0) && (a = {
      base: c ?? {},
      rules: u
    });
  }
  if (!a && t === "AmbientLight" && (n != null && n.lightCriteria)) {
    const c = Zc(n.lightCriteria);
    (c.base && Object.keys(c.base).length > 0 || c.rules.length > 0) && (a = {
      base: c.base,
      rules: c.rules
    });
  }
  return Ui.set(e, {
    type: t,
    rawPresets: i,
    rawLightCriteria: r,
    presets: a
  }), a;
}
s(el, "getPresetsForDocument");
function cu(e = null, t = null) {
  e ? ji.delete(e) : ji = /* @__PURE__ */ new WeakMap(), t ? Ui.delete(t) : e || (Ui = /* @__PURE__ */ new WeakMap());
}
s(cu, "invalidatePlaceableCriteriaCaches");
async function tl(e, t, n = {}) {
  var c, u;
  const i = zr(), r = {
    total: 0,
    scanned: 0,
    updated: 0,
    chunks: 0,
    byType: {},
    durationMs: 0
  };
  if (t = t ?? ((c = game.scenes) == null ? void 0 : c.viewed), !t)
    return r.durationMs = zr() - i, r;
  const o = new Set(Yc()), a = new Map(
    qi.map((d) => [d, t.getEmbeddedCollection(d) ?? []])
  ), l = su(t, a);
  for (const d of qi) {
    const f = a.get(d) ?? [], m = {
      total: tu(f),
      scanned: 0,
      updated: 0,
      chunks: 0
    }, y = l.byType.get(d) ?? null, b = lu(f, y, n.changedKeys);
    if (m.scanned = b.length, r.total += m.total, r.scanned += m.scanned, r.byType[d] = m, !b.length) continue;
    const p = [];
    for (const T of b) {
      const E = el(T, d);
      if (!(E != null && E.base)) continue;
      const C = js(E.base, E.rules ?? [], e);
      C._id = T._id, d === "AmbientLight" && o.has(T._id) && (C.hidden = !0);
      const I = (T == null ? void 0 : T._source) ?? ((u = T == null ? void 0 : T.toObject) == null ? void 0 : u.call(T)) ?? {}, D = Zs(I, C);
      D && p.push(D);
    }
    p.length > 0 && (m.chunks = await ru(t, d, p, n.chunkSize), m.updated = p.length, r.updated += p.length, r.chunks += m.chunks, console.log(`${J} | Updated ${p.length} ${d}(s)`));
  }
  return r.durationMs = zr() - i, r;
}
s(tl, "updatePlaceables");
function Vi() {
  return typeof (performance == null ? void 0 : performance.now) == "function" ? performance.now() : Date.now();
}
s(Vi, "nowMs");
const li = /* @__PURE__ */ new Map();
function uu(e) {
  var t;
  return e = e ?? ((t = game.scenes) == null ? void 0 : t.viewed), e ? Qn(e) : null;
}
s(uu, "getState");
async function du(e, t, n = 0) {
  var y;
  const i = Vi();
  if (t = t ?? ((y = game.scenes) == null ? void 0 : y.viewed), !t) return null;
  _c(t);
  const r = xe(t);
  if (!r.length)
    return console.warn(`${J} | applyState skipped: scene has no criteria.`), null;
  const o = Qn(t, r), a = Zo({ ...o, ...e ?? {} }, r), l = r.filter((b) => (o == null ? void 0 : o[b.key]) !== (a == null ? void 0 : a[b.key])).map((b) => b.key), c = l.length > 0;
  c && await hc(t, a, r);
  const u = c ? a : o, [d, f] = await Promise.all([
    Ws(u, t, { changedKeys: l }),
    tl(u, t, { changedKeys: l })
  ]), m = Vi() - i;
  return S("Criteria apply telemetry", {
    sceneId: t.id,
    changedKeys: l,
    didChange: c,
    queuedMs: n,
    durationMs: m,
    tiles: d,
    placeables: f
  }), Hooks.callAll("eidolon-utilities.criteriaStateApplied", t, u), u;
}
s(du, "applyStateInternal");
async function nl(e, t) {
  var c;
  if (t = t ?? ((c = game.scenes) == null ? void 0 : c.viewed), !t) return null;
  const n = t.id ?? "__viewed__", i = Vi(), r = li.get(n) ?? Promise.resolve();
  let o = null;
  const a = r.catch(() => null).then(async () => {
    const u = Vi() - i;
    return du(e, t, u);
  });
  o = a;
  const l = a.finally(() => {
    li.get(n) === l && li.delete(n);
  });
  return li.set(n, l), o;
}
s(nl, "applyState$1");
function fu(e) {
  var t;
  return e = e ?? ((t = game.scenes) == null ? void 0 : t.viewed), e ? qs(e) : null;
}
s(fu, "getVersion");
async function il(e, t) {
  var n;
  t = t ?? ((n = game.scenes) == null ? void 0 : n.viewed), t != null && t.setFlag && await t.setFlag(J, Ps, Number(e));
}
s(il, "setVersion");
async function gu(e) {
  return il(Bs, e);
}
s(gu, "markCurrentVersion");
const wn = "Standard", mu = /* @__PURE__ */ s((...e) => console.log(`${J} | criteria indexer:`, ...e), "log");
function ia(e) {
  if (typeof e != "string") return null;
  let t = e;
  try {
    t = decodeURIComponent(e);
  } catch {
  }
  const n = t.match(/\[([^\]]+)\]/);
  if (!n) return null;
  const i = n[1].split(",").map((r) => r.trim()).filter(Boolean);
  return i.length ? i : null;
}
s(ia, "parseFileTags");
function hu(e, t, n = wn) {
  return e != null && e.length ? e.map((i) => {
    const r = ia(i == null ? void 0 : i.name);
    if (!r) return {};
    const o = {};
    for (const [a, l] of Object.entries(t)) {
      const c = r[Number(a)];
      c != null && c !== n && (o[l] = c);
    }
    return o;
  }) : [];
}
s(hu, "buildFileIndex");
function pu(e, t) {
  return e.map((n, i) => {
    const r = [...t[n] ?? /* @__PURE__ */ new Set()].sort(), a = r.includes(wn) ? wn : r[0] ?? wn, l = Xo(n);
    return l.key = n, l.label = n.charAt(0).toUpperCase() + n.slice(1), l.values = r.length ? r : [wn], l.default = l.values.includes(a) ? a : l.values[0], l.order = i, l;
  });
}
s(pu, "buildCriteriaDefinitions");
async function ci(e, t, n, { dryRun: i = !1 } = {}) {
  const r = e.getFlag("monks-active-tiles", "files");
  if (!(r != null && r.length)) return null;
  const o = hu(r, t), a = Gs(o, { files: r });
  for (const l of r) {
    const c = ia(l == null ? void 0 : l.name);
    if (c)
      for (const [u, d] of Object.entries(t)) {
        const f = c[Number(u)];
        f != null && n[d] && n[d].add(f);
      }
  }
  return i || (await e.setFlag(J, jt, a), typeof e.unsetFlag == "function" && await e.unsetFlag(J, Ut)), { files: r.length };
}
s(ci, "indexTile");
async function yu(e, t = {}) {
  var C, I, D, _;
  const {
    dryRun: n = !1,
    force: i = !1
  } = t;
  if (e = e ?? ((C = game.scenes) == null ? void 0 : C.viewed), !e) throw new Error("No scene provided to indexScene.");
  if (!globalThis.Tagger) throw new Error("Tagger is required to index scene criteria.");
  if (!i && qs(e) >= Bs)
    throw new Error(
      `Scene "${e.name}" is already criteria-indexed. Use force: true to re-index.`
    );
  const r = { sceneId: e.id }, o = Tagger.getByTag("Map", r) ?? [];
  if (!o.length) throw new Error("No Map tile found.");
  if (o.length > 1) throw new Error(`Expected 1 Map tile, found ${o.length}.`);
  const a = o[0], l = a.getFlag("monks-active-tiles", "files");
  if (!(l != null && l.length)) throw new Error("Map tile has no MATT files.");
  const c = ia((I = l[0]) == null ? void 0 : I.name);
  if (!(c != null && c.length))
    throw new Error(`Cannot parse bracket tags from: ${((D = l[0]) == null ? void 0 : D.name) ?? "<unknown>"}`);
  if (c.length < 3)
    throw new Error(`Expected 3+ bracket tags, found ${c.length}.`);
  const u = Tagger.getByTag("Floor", r) ?? [], d = Tagger.getByTag("Roof", r) ?? [], f = Tagger.getByTag("Weather", r) ?? [];
  let m;
  const y = [];
  c.length >= 4 ? (m = { 0: "mood", 1: "stage", 2: "variant", 3: "effect" }, y.push("mood", "stage", "variant", "effect")) : (m = { 0: "mood", 1: "variant", 2: "effect" }, y.push("mood", "variant", "effect"));
  const b = { 1: "effect" }, p = {};
  for (const F of y)
    p[F] = /* @__PURE__ */ new Set();
  const T = {
    map: null,
    floor: [],
    roof: [],
    weather: []
  };
  T.map = await ci(a, m, p, { dryRun: n });
  for (const F of u) {
    const x = await ci(F, m, p, { dryRun: n });
    x && T.floor.push(x);
  }
  for (const F of d) {
    const x = await ci(F, m, p, { dryRun: n });
    x && T.roof.push(x);
  }
  for (const F of f) {
    const x = await ci(F, b, p, { dryRun: n });
    x && T.weather.push(x);
  }
  const E = pu(y, p);
  return n || (await vr(e, E), await gu(e)), mu(
    n ? "Dry run complete" : "Indexing complete",
    `- ${E.length} criteria,`,
    `${((_ = T.map) == null ? void 0 : _.files) ?? 0} map files`
  ), {
    criteria: E,
    state: E.reduce((F, x) => (F[x.key] = x.default, F), {}),
    tiles: T,
    overlayMode: f.length > 0
  };
}
s(yu, "indexScene");
var Za, Te, De, ke, Bt, ve, Ke, yt, Cr, ie, rl, ol, al, Fo, sl, Do, ll, Sn, ko;
const He = class He extends Yn(Jn) {
  constructor(n = {}) {
    var i;
    super(n);
    M(this, ie);
    M(this, Te, null);
    M(this, De, []);
    M(this, ke, {});
    M(this, Bt, !1);
    M(this, ve, null);
    M(this, Ke, null);
    M(this, yt, null);
    M(this, Cr, 120);
    this.setScene(n.scene ?? ((i = game.scenes) == null ? void 0 : i.viewed) ?? null);
  }
  setScene(n) {
    var i;
    O(this, Te, n ?? ((i = game.scenes) == null ? void 0 : i.viewed) ?? null), w(this, ie, rl).call(this);
  }
  get scene() {
    return h(this, Te);
  }
  async _prepareContext() {
    var r;
    const n = !!h(this, Te), i = n && h(this, De).length > 0;
    return {
      hasScene: n,
      hasCriteria: i,
      sceneName: ((r = h(this, Te)) == null ? void 0 : r.name) ?? g("EIDOLON.CriteriaSwitcher.NoScene", "No active scene"),
      labels: {
        subtitle: g(
          "EIDOLON.CriteriaSwitcher.Subtitle",
          "Switch criteria live and immediately apply all mapped updates."
        ),
        empty: g(
          "EIDOLON.CriteriaSwitcher.Empty",
          "No criteria found for this scene. Configure criteria first."
        ),
        reset: g("EIDOLON.CriteriaSwitcher.Reset", "Reset Defaults"),
        close: g("EIDOLON.CriteriaSwitcher.Close", "Close"),
        applying: g("EIDOLON.CriteriaSwitcher.Applying", "Applying changes..."),
        ready: g("EIDOLON.CriteriaSwitcher.Ready", "Ready")
      },
      criteria: h(this, De).map((o) => ({
        key: o.key,
        label: o.label || o.key,
        values: o.values.map((a) => {
          var l;
          return {
            value: a,
            selected: ((l = h(this, ke)) == null ? void 0 : l[o.key]) === a
          };
        }),
        defaultValue: o.default
      })),
      stateSummary: w(this, ie, ko).call(this)
    };
  }
  _onRender(n, i) {
    super._onRender(n, i), w(this, ie, ol).call(this), w(this, ie, al).call(this);
  }
  async _onClose(n) {
    return h(this, ve) !== null && (clearTimeout(h(this, ve)), O(this, ve, null)), h(this, yt) !== null && (Hooks.off("eidolon-utilities.criteriaStateApplied", h(this, yt)), O(this, yt, null)), super._onClose(n);
  }
};
Te = new WeakMap(), De = new WeakMap(), ke = new WeakMap(), Bt = new WeakMap(), ve = new WeakMap(), Ke = new WeakMap(), yt = new WeakMap(), Cr = new WeakMap(), ie = new WeakSet(), rl = /* @__PURE__ */ s(function() {
  if (!h(this, Te)) {
    O(this, De, []), O(this, ke, {});
    return;
  }
  O(this, De, xe(h(this, Te)).sort((n, i) => n.order - i.order)), O(this, ke, Qn(h(this, Te), h(this, De)));
}, "#hydrateFromScene"), ol = /* @__PURE__ */ s(function() {
  var i, r;
  const n = this.element;
  n instanceof HTMLElement && (n.querySelectorAll("[data-criteria-key]").forEach((o) => {
    o.addEventListener("change", (a) => {
      const l = a.currentTarget;
      if (!(l instanceof HTMLSelectElement)) return;
      const c = l.dataset.criteriaKey;
      c && (O(this, ke, {
        ...h(this, ke),
        [c]: l.value
      }), w(this, ie, sl).call(this, { [c]: l.value }));
    });
  }), (i = n.querySelector("[data-action='reset-defaults']")) == null || i.addEventListener("click", () => {
    w(this, ie, ll).call(this);
  }), (r = n.querySelector("[data-action='close-switcher']")) == null || r.addEventListener("click", () => {
    this.close();
  }));
}, "#bindEvents"), al = /* @__PURE__ */ s(function() {
  h(this, yt) === null && O(this, yt, Hooks.on("eidolon-utilities.criteriaStateApplied", (n, i) => {
    !h(this, Te) || (n == null ? void 0 : n.id) !== h(this, Te).id || h(this, Bt) || (O(this, ke, { ...i ?? {} }), this.render({ force: !0 }));
  }));
}, "#ensureSyncHook"), Fo = /* @__PURE__ */ s(async function(n) {
  var i, r;
  if (h(this, Te)) {
    w(this, ie, Sn).call(this, "applying"), O(this, Bt, !0);
    try {
      const o = await nl(n, h(this, Te));
      o && O(this, ke, o), w(this, ie, Sn).call(this, "ready"), this.render({ force: !0 });
    } catch (o) {
      console.error(`${J} | Failed to apply criteria state`, o), (r = (i = ui.notifications) == null ? void 0 : i.error) == null || r.call(
        i,
        g(
          "EIDOLON.CriteriaSwitcher.ApplyError",
          "Failed to apply the selected criteria state."
        )
      ), w(this, ie, Sn).call(this, "error", (o == null ? void 0 : o.message) ?? "Unknown error");
    } finally {
      O(this, Bt, !1), h(this, Ke) && w(this, ie, Do).call(this);
    }
  }
}, "#applyPartialState"), sl = /* @__PURE__ */ s(function(n) {
  O(this, Ke, {
    ...h(this, Ke) ?? {},
    ...n ?? {}
  }), h(this, ve) !== null && clearTimeout(h(this, ve)), w(this, ie, Sn).call(this, "applying"), O(this, ve, setTimeout(() => {
    O(this, ve, null), w(this, ie, Do).call(this);
  }, h(this, Cr)));
}, "#queuePartialState"), Do = /* @__PURE__ */ s(async function() {
  if (h(this, Bt) || !h(this, Ke)) return;
  const n = h(this, Ke);
  O(this, Ke, null), await w(this, ie, Fo).call(this, n);
}, "#flushPendingState"), ll = /* @__PURE__ */ s(async function() {
  if (!h(this, De).length) return;
  const n = h(this, De).reduce((i, r) => (i[r.key] = r.default, i), {});
  O(this, ke, n), h(this, ve) !== null && (clearTimeout(h(this, ve)), O(this, ve, null)), O(this, Ke, null), await w(this, ie, Fo).call(this, n);
}, "#resetToDefaults"), Sn = /* @__PURE__ */ s(function(n, i = "") {
  const r = this.element;
  if (!(r instanceof HTMLElement)) return;
  const o = r.querySelector("[data-role='status']");
  if (o instanceof HTMLElement)
    switch (o.dataset.mode = n, n) {
      case "applying":
        o.textContent = g("EIDOLON.CriteriaSwitcher.Applying", "Applying changes...");
        break;
      case "error":
        o.textContent = `${g("EIDOLON.CriteriaSwitcher.Error", "Error")}: ${i}`;
        break;
      case "ready":
      default:
        o.textContent = `${g("EIDOLON.CriteriaSwitcher.Ready", "Ready")}: ${w(this, ie, ko).call(this)}`;
        break;
    }
}, "#setStatus"), ko = /* @__PURE__ */ s(function() {
  return h(this, De).length ? `[${h(this, De).map((n) => {
    var i;
    return ((i = h(this, ke)) == null ? void 0 : i[n.key]) ?? n.default;
  }).join(" | ")}]` : "-";
}, "#formatStateSummary"), s(He, "CriteriaSwitcherApplication"), Ve(He, "APP_ID", `${J}-criteria-switcher`), Ve(He, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  ft(He, He, "DEFAULT_OPTIONS"),
  {
    id: He.APP_ID,
    classes: Array.from(
      /* @__PURE__ */ new Set([...((Za = ft(He, He, "DEFAULT_OPTIONS")) == null ? void 0 : Za.classes) ?? [], "eidolon-criteria-switcher-window", "themed"])
    ),
    tag: "section",
    window: {
      title: g("EIDOLON.CriteriaSwitcher.Title", "Criteria Switcher"),
      icon: "fa-solid fa-sliders",
      resizable: !1
    },
    position: {
      width: 420,
      height: "auto"
    }
  },
  { inplace: !1 }
)), Ve(He, "PARTS", {
  content: {
    template: `modules/${J}/templates/criteria-switcher.html`
  }
});
let _o = He;
const bu = Sr(_o);
let zt = null;
function Tu(e) {
  var t;
  return e ?? ((t = game.scenes) == null ? void 0 : t.viewed) ?? null;
}
s(Tu, "resolveScene");
function Eu(e) {
  var t;
  return !!(e != null && e.rendered && ((t = e == null ? void 0 : e.element) != null && t.isConnected));
}
s(Eu, "isRendered");
function Nr() {
  return Eu(zt) ? zt : (zt = null, null);
}
s(Nr, "getCriteriaSwitcher");
function cl(e) {
  var i, r, o, a, l;
  const t = Tu(e);
  if (!t)
    return (r = (i = ui.notifications) == null ? void 0 : i.warn) == null || r.call(i, "No active scene to open the criteria switcher."), null;
  if (!Or(t))
    return (a = (o = ui.notifications) == null ? void 0 : o.warn) == null || a.call(o, "You do not have permission to manage scene criteria."), null;
  const n = Nr();
  return n ? (n.setScene(t), n.render({ force: !0 }), (l = n.bringToFront) == null || l.call(n), n) : (zt = bu({ scene: t }), zt.render({ force: !0 }), zt);
}
s(cl, "openCriteriaSwitcher");
function ul() {
  const e = Nr();
  e && (e.close(), zt = null);
}
s(ul, "closeCriteriaSwitcher");
function ra(e) {
  return Nr() ? (ul(), null) : cl(e);
}
s(ra, "toggleCriteriaSwitcher");
const Cu = {
  SCHEMA_VERSION: ea,
  applyState: nl,
  getState: uu,
  getVersion: fu,
  setVersion: il,
  getCriteria(e) {
    var t;
    return xe(e ?? ((t = game.scenes) == null ? void 0 : t.viewed));
  },
  setCriteria(e, t) {
    var n;
    return vr(t ?? ((n = game.scenes) == null ? void 0 : n.viewed), e);
  },
  updateTiles: Ws,
  updatePlaceables: tl,
  indexScene: yu,
  openCriteriaSwitcher: cl,
  closeCriteriaSwitcher: ul,
  toggleCriteriaSwitcher: ra,
  findBestMatch: vc,
  findFileIndex: Oc,
  resolveRules: js
};
function dl(e) {
  var t;
  return ((t = e == null ? void 0 : e.getFlag) == null ? void 0 : t.call(e, "monks-active-tiles", "files")) ?? [];
}
s(dl, "getTileFiles$1");
function Lu(e = []) {
  return {
    strategy: "select-one",
    defaultTarget: St(e, 0) ?? { indexHint: 0 },
    variants: [
      {
        criteria: {},
        target: St(e, 0) ?? { indexHint: 0 }
      }
    ]
  };
}
s(Lu, "createDefaultTileCriteria");
function wu(e, t = {}) {
  var a, l;
  const { allowLegacy: n = !0 } = t, i = dl(e), r = (a = e == null ? void 0 : e.getFlag) == null ? void 0 : a.call(e, J, jt);
  if (r) return Kt(r, { files: i });
  if (!n) return null;
  const o = (l = e == null ? void 0 : e.getFlag) == null ? void 0 : l.call(e, J, Ut);
  return o ? Kt(o, { files: i }) : null;
}
s(wu, "getTileCriteria");
async function qa(e, t, n = {}) {
  if (!(e != null && e.setFlag)) return null;
  const {
    strictValidation: i = !0
  } = n, r = dl(e), o = Kt(t, { files: r });
  if (!o)
    return typeof e.unsetFlag == "function" ? (await e.unsetFlag(J, jt), await e.unsetFlag(J, Ut)) : (await e.setFlag(J, jt, null), await e.setFlag(J, Ut, null)), null;
  if (i) {
    const a = zs(o, { files: r });
    if (a.errors.length > 0)
      throw new Error(
        `Tile criteria contains ${a.errors.length} conflicting rule pair(s). Resolve clashes before saving.`
      );
  }
  return await e.setFlag(J, jt, o), typeof e.unsetFlag == "function" && await e.unsetFlag(J, Ut), o;
}
s(qa, "setTileCriteria");
const xo = "__eidolon_any__", at = "eidolon-tile-criteria", Su = "fa-solid fa-sliders", fl = Symbol.for("eidolon.tileCriteriaUiState"), _r = ["all", "unmapped", "mapped", "conflicts"];
function Iu(e) {
  const t = e == null ? void 0 : e[fl];
  return !t || typeof t != "object" ? {
    filterQuery: "",
    filterMode: "all",
    selectedFileIndex: null
  } : {
    filterQuery: typeof t.filterQuery == "string" ? t.filterQuery : "",
    filterMode: _r.includes(t.filterMode) ? t.filterMode : "all",
    selectedFileIndex: Number.isInteger(t.selectedFileIndex) ? t.selectedFileIndex : null
  };
}
s(Iu, "readUiState");
function vu(e, t) {
  if (!e || !t) return;
  typeof t.filterQuery == "string" && (e.filterQuery = t.filterQuery), _r.includes(t.filterMode) && (e.filterMode = t.filterMode), Number.isInteger(t.selectedFileIndex) && e.fileEntries.some((i) => i.index === t.selectedFileIndex) && (e.selectedFileIndex = t.selectedFileIndex);
}
s(vu, "applyUiState");
function Ou(e) {
  const t = e == null ? void 0 : e.app, n = e == null ? void 0 : e.state;
  !t || !n || (t[fl] = {
    filterQuery: typeof n.filterQuery == "string" ? n.filterQuery : "",
    filterMode: _r.includes(n.filterMode) ? n.filterMode : "all",
    selectedFileIndex: Number.isInteger(n.selectedFileIndex) ? n.selectedFileIndex : null
  });
}
s(Ou, "persistUiState");
function Mu(e) {
  const t = (e == null ? void 0 : e.object) ?? (e == null ? void 0 : e.document) ?? null;
  return !(t != null && t.isEmbedded) || t.documentName !== "Tile" ? null : t;
}
s(Mu, "getTileDocument");
function Au(e) {
  var t;
  return ((t = e == null ? void 0 : e.getFlag) == null ? void 0 : t.call(e, "monks-active-tiles", "files")) ?? [];
}
s(Au, "getTileFiles");
function Nu(e, t) {
  var l;
  const n = (e == null ? void 0 : e.parent) ?? ((l = game.scenes) == null ? void 0 : l.viewed) ?? null, r = xe(n).sort((c, u) => c.order - u.order).map((c) => ({
    key: c.key,
    label: c.label || c.key,
    values: [...c.values ?? []]
  })), o = new Set(r.map((c) => c.key)), a = /* @__PURE__ */ new Map();
  for (const c of (t == null ? void 0 : t.variants) ?? [])
    for (const [u, d] of Object.entries((c == null ? void 0 : c.criteria) ?? {}))
      o.has(u) || (a.has(u) || a.set(u, /* @__PURE__ */ new Set()), typeof d == "string" && d.trim() && a.get(u).add(d.trim()));
  for (const [c, u] of a.entries())
    r.push({
      key: c,
      label: c,
      values: [...u]
    });
  return r;
}
s(Nu, "getCriteriaDefinitions");
function _u(e) {
  const t = {
    folders: /* @__PURE__ */ new Map(),
    files: []
  };
  for (const n of e) {
    const r = (n.path || n.label).split("/").filter(Boolean);
    if (!r.length) {
      t.files.push({ entry: n, name: n.label });
      continue;
    }
    const o = r.pop();
    let a = t;
    for (const l of r)
      a.folders.has(l) || a.folders.set(l, {
        folders: /* @__PURE__ */ new Map(),
        files: []
      }), a = a.folders.get(l);
    a.files.push({ entry: n, name: o || n.label });
  }
  return t;
}
s(_u, "buildTree");
function Fu(e, t) {
  const n = [e];
  let i = t;
  for (; i.files.length === 0 && i.folders.size === 1; ) {
    const [r, o] = i.folders.entries().next().value;
    n.push(r), i = o;
  }
  return {
    label: n.join("/"),
    node: i
  };
}
s(Fu, "collapseFolderBranch");
function Du(e, t) {
  const n = e.rulesByFile.get(t) ?? [], i = [];
  for (const r of n) {
    const o = Object.entries(r.criteria ?? {}).filter(([, l]) => typeof l == "string" && l.trim());
    if (!o.length) {
      i.push("*");
      continue;
    }
    const a = o.map(([l, c]) => `${e.criteriaLabels.get(l) ?? l}: ${c}`).join(" · ");
    i.push(a);
  }
  return i;
}
s(Du, "getRuleSummariesForFile");
function Ro(e) {
  var y, b;
  const t = Au(e), n = ta(t), i = wu(e, { allowLegacy: !0 }) ?? Lu(t), r = Nu(e, i), o = new Map(r.map((p) => [p.key, p.label])), a = new Map(
    n.map((p) => [
      p.index,
      p.path || p.label
    ])
  ), l = An(i.defaultTarget, t), c = ((y = n[0]) == null ? void 0 : y.index) ?? 0, u = l >= 0 ? l : c, d = new Map(n.map((p) => [p.index, []]));
  let f = 1;
  for (const p of i.variants ?? []) {
    const T = An(p.target, t);
    T < 0 || (d.has(T) || d.set(T, []), d.get(T).push({
      id: f,
      criteria: { ...p.criteria ?? {} }
    }), f += 1);
  }
  const m = n.some((p) => p.index === u) ? u : ((b = n[0]) == null ? void 0 : b.index) ?? null;
  return {
    files: t,
    fileEntries: n,
    criteriaDefinitions: r,
    criteriaLabels: o,
    relativePaths: a,
    defaultIndex: u,
    selectedFileIndex: m,
    filterQuery: "",
    filterMode: "all",
    nextRuleId: f,
    rulesByFile: d,
    status: {
      mode: "ready",
      message: g("EIDOLON.TileCriteria.Ready", "Ready")
    }
  };
}
s(Ro, "buildEditorState");
function $o(e, t) {
  return e.rulesByFile.has(t) || e.rulesByFile.set(t, []), e.rulesByFile.get(t);
}
s($o, "getRulesForFile");
function ku(e) {
  return Object.fromEntries(
    Object.entries(e ?? {}).filter(([t, n]) => typeof t == "string" && t && typeof n == "string" && n.trim()).map(([t, n]) => [t, n.trim()])
  );
}
s(ku, "sanitizeRuleCriteria");
function gl(e) {
  const t = St(e.files, e.defaultIndex);
  if (!t) return null;
  const n = [], i = [];
  for (const [o, a] of e.rulesByFile.entries()) {
    const l = St(e.files, o);
    if (l)
      for (const [c, u] of a.entries()) {
        const d = ku(u.criteria);
        n.push({
          criteria: d,
          target: { ...l }
        }), i.push({
          fileIndex: o,
          ruleId: u.id,
          rulePosition: c,
          criteria: d
        });
      }
  }
  return n.length || (n.push({
    criteria: {},
    target: { ...t }
  }), i.push({
    fileIndex: e.defaultIndex,
    ruleId: null,
    rulePosition: null,
    criteria: {},
    isFallback: !0
  })), {
    normalized: Kt(
      {
        strategy: "select-one",
        defaultTarget: t,
        variants: n
      },
      { files: e.files }
    ),
    sources: i
  };
}
s(gl, "buildTileCriteriaDraft");
function xu(e) {
  var t;
  return ((t = gl(e)) == null ? void 0 : t.normalized) ?? null;
}
s(xu, "exportTileCriteria");
function Ua(e) {
  const t = gl(e);
  if (!(t != null && t.normalized))
    return {
      errors: [],
      warnings: [],
      errorFileIndexes: [],
      warningFileIndexes: []
    };
  const n = zs(t.normalized, { files: e.files }), i = /* @__PURE__ */ s((l) => {
    const c = t.sources[l.leftIndex] ?? null, u = t.sources[l.rightIndex] ?? null;
    return {
      ...l,
      leftFileIndex: c == null ? void 0 : c.fileIndex,
      rightFileIndex: u == null ? void 0 : u.fileIndex
    };
  }, "mapConflict"), r = n.errors.map((l) => i(l)), o = n.warnings.map((l) => i(l)), a = /* @__PURE__ */ s((l) => {
    const c = /* @__PURE__ */ new Set();
    for (const u of l)
      Number.isInteger(u.leftFileIndex) && c.add(u.leftFileIndex), Number.isInteger(u.rightFileIndex) && c.add(u.rightFileIndex);
    return [...c];
  }, "toFileIndexes");
  return {
    errors: r,
    warnings: o,
    errorFileIndexes: a(r),
    warningFileIndexes: a(o)
  };
}
s(Ua, "analyzeRuleConflicts");
function di(e, t = "neutral") {
  const n = document.createElement("span");
  return n.classList.add("eidolon-tile-criteria__badge"), n.dataset.kind = t, n.textContent = e, n;
}
s(di, "createBadge");
function Ru(e, t = {}) {
  const n = typeof e == "string" ? e : "", {
    maxLength: i = 42,
    headLength: r = 20,
    tailLength: o = 16
  } = t;
  if (!n || n.length <= i) return n;
  const a = n.slice(0, r).trimEnd(), l = n.slice(-o).trimStart();
  return `${a}...${l}`;
}
s(Ru, "middleEllipsis");
function $u(e) {
  const t = typeof e == "string" ? e.trim() : "";
  if (!t)
    return {
      error: "",
      matches: /* @__PURE__ */ s(() => !0, "matches")
    };
  let n = t, i = "i";
  if (t.startsWith("/") && t.length > 1) {
    const r = t.lastIndexOf("/");
    r > 0 && (n = t.slice(1, r), i = t.slice(r + 1) || "i");
  }
  i = i.replace(/g/g, "");
  try {
    const r = new RegExp(n, i);
    return {
      error: "",
      matches: /* @__PURE__ */ s((o) => r.test(String(o ?? "")), "matches")
    };
  } catch (r) {
    return {
      error: (r == null ? void 0 : r.message) ?? g("EIDOLON.TileCriteria.InvalidRegex", "Invalid regex."),
      matches: /* @__PURE__ */ s(() => !0, "matches")
    };
  }
}
s($u, "createRegexFilter");
function Hu(e, t) {
  const n = document.createElement("select");
  n.dataset.criteriaKey = e.key;
  const i = document.createElement("option");
  i.value = xo, i.textContent = "*", n.appendChild(i);
  const r = new Set(e.values ?? []);
  t && !r.has(t) && r.add(t);
  for (const o of r) {
    const a = document.createElement("option");
    a.value = o, a.textContent = o, n.appendChild(a);
  }
  return n.value = t ?? xo, n;
}
s(Hu, "createCriterionSelect");
function Pu(e, t, n, i) {
  var l;
  const r = document.createElement("div");
  r.classList.add("eidolon-tile-criteria__rule-editor");
  const o = document.createElement("div");
  o.classList.add("eidolon-tile-criteria__rule-grid");
  for (const c of t.criteriaDefinitions) {
    const u = document.createElement("label");
    u.classList.add("eidolon-tile-criteria__rule-field");
    const d = document.createElement("span");
    d.classList.add("eidolon-tile-criteria__criterion-label"), d.textContent = c.label, u.appendChild(d);
    const f = Hu(c, (l = e.criteria) == null ? void 0 : l[c.key]);
    f.addEventListener("change", () => {
      f.value === xo ? delete e.criteria[c.key] : e.criteria[c.key] = f.value, i();
    }), u.appendChild(f), o.appendChild(u);
  }
  r.appendChild(o);
  const a = document.createElement("button");
  return a.type = "button", a.classList.add("control", "ui-control", "eidolon-tile-criteria__rule-remove"), a.textContent = g("EIDOLON.TileCriteria.RemoveRule", "Remove"), a.addEventListener("click", () => {
    const u = $o(t, n).filter((d) => d.id !== e.id);
    t.rulesByFile.set(n, u), i();
  }), r.appendChild(a), r;
}
s(Pu, "renderRuleEditor");
const wi = /* @__PURE__ */ new WeakMap();
function ml(e) {
  return (e == null ? void 0 : e.app) ?? (e == null ? void 0 : e.tile) ?? null;
}
s(ml, "getDialogOwner");
function Bu(e) {
  for (const t of e) {
    const n = st(t);
    if (n) return n;
    const i = st(t == null ? void 0 : t.element);
    if (i) return i;
  }
  return null;
}
s(Bu, "findDialogRoot$1");
function qu(e, t, n) {
  const i = e.state, r = i.fileEntries.find((p) => p.index === t);
  if (!r) return document.createElement("div");
  const o = document.createElement("section");
  o.classList.add("eidolon-tile-criteria__dialog-content");
  const a = document.createElement("header");
  a.classList.add("eidolon-tile-criteria__editor-header");
  const l = document.createElement("h4");
  l.textContent = i.relativePaths.get(r.index) || r.label, a.appendChild(l);
  const c = document.createElement("p");
  c.classList.add("notes"), c.textContent = `#${r.index + 1} · ${r.path || g("EIDOLON.TileCriteria.UnknownPath", "Unknown path")}`, a.appendChild(c), o.appendChild(a);
  const u = document.createElement("div");
  u.classList.add("eidolon-tile-criteria__editor-controls");
  const d = document.createElement("button");
  d.type = "button", d.classList.add("control", "ui-control", "eidolon-tile-criteria__editor-action"), i.defaultIndex === r.index ? (d.textContent = g("EIDOLON.TileCriteria.IsDefault", "Default Target"), d.disabled = !0) : (d.textContent = g("EIDOLON.TileCriteria.SetDefault", "Set As Default"), d.addEventListener("click", () => {
    i.defaultIndex = r.index, Ce(e), n();
  })), u.appendChild(d);
  const f = document.createElement("button");
  f.type = "button", f.classList.add("control", "ui-control", "eidolon-tile-criteria__editor-action", "secondary"), f.textContent = g("EIDOLON.TileCriteria.ClearFileRules", "Clear File Rules"), f.addEventListener("click", () => {
    i.rulesByFile.set(r.index, []), Ce(e), n();
  }), u.appendChild(f), o.appendChild(u);
  const m = document.createElement("div");
  m.classList.add("eidolon-tile-criteria__rule-editors");
  const y = $o(i, r.index);
  if (y.length)
    for (const p of y)
      m.appendChild(
        Pu(p, i, r.index, () => {
          Ce(e), n();
        })
      );
  else {
    const p = document.createElement("p");
    p.classList.add("notes"), p.textContent = g(
      "EIDOLON.TileCriteria.NoRulesForFile",
      "No rules map to this file yet. Add one to define when this variant should be active."
    ), m.appendChild(p);
  }
  o.appendChild(m);
  const b = document.createElement("button");
  return b.type = "button", b.classList.add("control", "ui-control", "eidolon-tile-criteria__editor-action"), b.textContent = g("EIDOLON.TileCriteria.AddRule", "Add Rule"), b.disabled = !i.criteriaDefinitions.length, b.addEventListener("click", () => {
    $o(i, r.index).push({
      id: i.nextRuleId,
      criteria: {}
    }), i.nextRuleId += 1, Ce(e), n();
  }), o.appendChild(b), o;
}
s(qu, "buildRuleEditorContent");
function Uu(e, t) {
  var f, m, y;
  const n = ml(e);
  if (!n) return;
  const i = wi.get(n);
  if (i) {
    i.controller = e, i.fileIndex = t, (f = i.refresh) == null || f.call(i);
    return;
  }
  const r = {
    controller: e,
    fileIndex: t,
    host: null,
    refresh: null
  };
  wi.set(n, r);
  const o = /* @__PURE__ */ s(() => {
    wi.delete(n);
  }, "closeDialog"), a = /* @__PURE__ */ s(() => {
    r.host instanceof HTMLElement && r.host.replaceChildren(
      qu(r.controller, r.fileIndex, a)
    );
  }, "refreshDialog");
  r.refresh = a;
  const l = g("EIDOLON.TileCriteria.EditorTitle", "Edit Tile Criteria Rules"), c = '<div class="eidolon-tile-criteria-editor-host"></div>', u = g("EIDOLON.TileCriteria.CloseEditor", "Close"), d = (y = (m = foundry == null ? void 0 : foundry.applications) == null ? void 0 : m.api) == null ? void 0 : y.DialogV2;
  if (typeof (d == null ? void 0 : d.wait) == "function") {
    d.wait({
      window: { title: l },
      content: c,
      buttons: [{ action: "close", label: u, default: !0 }],
      render: /* @__PURE__ */ s((...b) => {
        var E;
        const p = Bu(b), T = (E = p == null ? void 0 : p.querySelector) == null ? void 0 : E.call(p, ".eidolon-tile-criteria-editor-host");
        T instanceof HTMLElement && (r.host = T, a());
      }, "render"),
      close: o,
      rejectClose: !1
    }).catch((b) => {
      console.warn(`${J} | Rule editor dialog failed`, b), o();
    });
    return;
  }
  o();
}
s(Uu, "openRuleEditorDialog");
function ja(e) {
  var i;
  const t = ml(e);
  if (!t) return;
  const n = wi.get(t);
  (i = n == null ? void 0 : n.refresh) == null || i.call(n);
}
s(ja, "refreshOpenRuleEditor");
function Ho(e, t) {
  return (e.rulesByFile.get(t) ?? []).length > 0;
}
s(Ho, "hasRulesForFile");
function hl(e, t) {
  var n, i;
  return ((n = e == null ? void 0 : e.errorFileIndexes) == null ? void 0 : n.includes(t)) || ((i = e == null ? void 0 : e.warningFileIndexes) == null ? void 0 : i.includes(t));
}
s(hl, "hasConflictForFile");
function ju(e, t, n) {
  switch (e.filterMode) {
    case "unmapped":
      return !Ho(e, t.index);
    case "mapped":
      return Ho(e, t.index);
    case "conflicts":
      return hl(n, t.index);
    case "all":
    default:
      return !0;
  }
}
s(ju, "matchesFilterMode");
function Vu(e, t) {
  let n = 0, i = 0, r = 0;
  for (const o of e.fileEntries)
    Ho(e, o.index) ? n += 1 : i += 1, hl(t, o.index) && (r += 1);
  return {
    all: e.fileEntries.length,
    mapped: n,
    unmapped: i,
    conflicts: r
  };
}
s(Vu, "getFilterModeCounts");
function zu(e) {
  switch (e) {
    case "unmapped":
      return g("EIDOLON.TileCriteria.FilterModeUnmapped", "Unmapped");
    case "mapped":
      return g("EIDOLON.TileCriteria.FilterModeMapped", "Mapped");
    case "conflicts":
      return g("EIDOLON.TileCriteria.FilterModeConflicts", "Clashes");
    case "all":
    default:
      return g("EIDOLON.TileCriteria.FilterModeAll", "All");
  }
}
s(zu, "getFilterModeLabel");
function pl(e, t, n, i, r) {
  var u, d;
  const o = [...e.folders.keys()].sort((f, m) => f.localeCompare(m));
  for (const f of o) {
    const m = Fu(f, e.folders.get(f)), y = document.createElement("li");
    y.classList.add("eidolon-tile-criteria__tree-branch");
    const b = document.createElement("div");
    b.classList.add("document", "folder", "update", "eidolon-tile-criteria__folder-row");
    const p = document.createElement("i");
    p.classList.add("fa-solid", "fa-folder-open"), b.appendChild(p);
    const T = document.createElement("span");
    T.classList.add("eidolon-tile-criteria__tree-folder-label"), T.textContent = m.label, T.title = m.label, b.appendChild(T), y.appendChild(b);
    const E = document.createElement("ul");
    E.classList.add("eidolon-tile-criteria__tree"), E.dataset.folder = m.label, pl(m.node, t, n, i, E), E.childElementCount > 0 && y.appendChild(E), r.appendChild(y);
  }
  const a = [...e.files].sort((f, m) => f.name.localeCompare(m.name));
  if (!a.length) return;
  const l = document.createElement("li"), c = document.createElement("ul");
  c.classList.add("document-list", "eidolon-tile-criteria__document-list");
  for (const f of a) {
    const m = f.entry, y = m.index === t.selectedFileIndex, b = m.index === t.defaultIndex, p = Du(t, m.index), T = document.createElement("li");
    T.classList.add("document", "update", "eidolon-tile-criteria__tree-file");
    const E = document.createElement("button");
    E.type = "button", E.classList.add("eidolon-tile-criteria__file-row");
    const C = (u = i == null ? void 0 : i.errorFileIndexes) == null ? void 0 : u.includes(m.index), I = (d = i == null ? void 0 : i.warningFileIndexes) == null ? void 0 : d.includes(m.index);
    C ? E.classList.add("has-conflict") : I && E.classList.add("has-warning");
    const D = t.relativePaths.get(m.index) || m.path || f.name, _ = [D];
    C ? _.push(
      g(
        "EIDOLON.TileCriteria.ConflictFileHint",
        "This file participates in one or more conflicting rules."
      )
    ) : I && _.push(
      g(
        "EIDOLON.TileCriteria.WarningFileHint",
        "This file has potentially redundant rules."
      )
    ), p.length || _.push(
      g(
        "EIDOLON.TileCriteria.UnmappedHint",
        "No criteria rules map to this file."
      )
    ), E.title = _.join(`
`), y && E.classList.add("is-selected"), E.addEventListener("click", () => {
      t.selectedFileIndex = m.index, Ce(n), Uu(n, m.index);
    });
    const F = document.createElement("span");
    F.classList.add("eidolon-tile-criteria__indicator"), F.dataset.kind = b ? "default" : p.length ? "mapped" : "unmapped", E.appendChild(F);
    const x = document.createElement("span");
    x.classList.add("eidolon-tile-criteria__file-content");
    const W = document.createElement("span");
    W.classList.add("eidolon-tile-criteria__file-heading");
    const te = document.createElement("span");
    te.classList.add("eidolon-tile-criteria__file-title"), te.textContent = Ru(f.name || m.label), te.title = D, W.appendChild(te);
    const H = di(`#${m.index + 1}`, "meta");
    H.classList.add("eidolon-tile-criteria__index-badge"), W.appendChild(H), x.appendChild(W);
    const Q = document.createElement("span");
    Q.classList.add("eidolon-tile-criteria__badges"), b && Q.appendChild(di(g("EIDOLON.TileCriteria.DefaultBadge", "Default"), "default"));
    const A = p.slice(0, 2);
    for (const U of A)
      Q.appendChild(di(U, "rule"));
    if (p.length > A.length && Q.appendChild(di(`+${p.length - A.length}`, "meta")), x.appendChild(Q), E.appendChild(x), C || I) {
      const U = document.createElement("span");
      U.classList.add("eidolon-tile-criteria__row-warning"), U.dataset.mode = C ? "error" : "warning", U.innerHTML = '<i class="fa-solid fa-triangle-exclamation" inert=""></i>', E.appendChild(U);
    }
    T.appendChild(E), c.appendChild(T);
  }
  l.appendChild(c), r.appendChild(l);
}
s(pl, "renderTreeNode");
function Gu(e, t, n, i = {}) {
  const r = document.createElement("section");
  r.classList.add("eidolon-tile-criteria__tree-panel");
  const o = $u(e.filterQuery), a = Vu(e, n);
  e.filterMode !== "all" && a[e.filterMode] === 0 && (e.filterMode = "all");
  const l = document.createElement("div");
  l.classList.add("eidolon-tile-criteria__toolbar");
  const c = document.createElement("div");
  c.classList.add("eidolon-tile-criteria__mode-bar");
  for (const C of _r) {
    const I = document.createElement("button");
    I.type = "button", I.classList.add("control", "ui-control", "eidolon-tile-criteria__mode-button"), I.dataset.mode = C, I.textContent = zu(C);
    const D = C === "all" || a[C] > 0;
    I.disabled = !D, D || (I.dataset.tooltip = g(
      "EIDOLON.TileCriteria.FilterModeUnavailable",
      "No entries currently match this filter."
    ), I.title = I.dataset.tooltip), e.filterMode === C ? (I.classList.add("is-active"), I.setAttribute("aria-pressed", "true")) : I.setAttribute("aria-pressed", "false"), I.addEventListener("click", () => {
      e.filterMode !== C && (e.filterMode = C, Ce(t));
    }), c.appendChild(I);
  }
  l.appendChild(c);
  const u = document.createElement("div");
  u.classList.add("eidolon-tile-criteria__filter-row");
  const d = document.createElement("input");
  d.type = "text", d.classList.add("eidolon-tile-criteria__filter-input"), d.placeholder = g("EIDOLON.TileCriteria.FilterPlaceholder", "Regex filter (path)"), d.value = e.filterQuery, d.autocomplete = "off", d.addEventListener("keydown", (C) => {
    C.stopPropagation(), C.key === "Enter" && C.preventDefault();
  }), d.addEventListener("keyup", (C) => {
    C.stopPropagation();
  }), d.addEventListener("change", (C) => {
    C.stopPropagation();
  }), d.addEventListener("input", (C) => {
    C.stopPropagation();
    const I = d.selectionStart ?? d.value.length, D = d.selectionEnd ?? I;
    e.filterQuery = d.value, Ce(t), requestAnimationFrame(() => {
      const _ = t.section.querySelector(".eidolon-tile-criteria__filter-input");
      if (_ instanceof HTMLInputElement) {
        _.focus();
        try {
          _.setSelectionRange(I, D);
        } catch {
        }
      }
    });
  }), u.appendChild(d);
  const f = document.createElement("div");
  f.classList.add("eidolon-tile-criteria__toolbar-actions");
  const m = document.createElement("button");
  m.type = "button";
  const y = g("EIDOLON.TileCriteria.Save", "Save Rules");
  m.classList.add("control", "ui-control", "eidolon-tile-criteria__toolbar-action", "icon-only"), m.dataset.tooltip = y, m.setAttribute("aria-label", y), m.title = y, m.innerHTML = '<i class="fa-solid fa-floppy-disk" inert=""></i>', m.disabled = n.errors.length > 0, m.addEventListener("click", () => {
    var C;
    (C = i.onSave) == null || C.call(i);
  }), f.appendChild(m);
  const b = document.createElement("button");
  b.type = "button";
  const p = g("EIDOLON.TileCriteria.Clear", "Clear Rules");
  if (b.classList.add("control", "ui-control", "secondary", "eidolon-tile-criteria__toolbar-action", "icon-only"), b.dataset.tooltip = p, b.setAttribute("aria-label", p), b.title = p, b.innerHTML = '<i class="fa-solid fa-trash" inert=""></i>', b.addEventListener("click", () => {
    var C;
    (C = i.onClear) == null || C.call(i);
  }), f.appendChild(b), u.appendChild(f), l.appendChild(u), r.appendChild(l), o.error) {
    const C = document.createElement("p");
    C.classList.add("notes", "eidolon-tile-criteria__filter-error"), C.textContent = `${g("EIDOLON.TileCriteria.InvalidRegex", "Invalid regex")}: ${o.error}`, r.appendChild(C);
  }
  const T = document.createElement("div");
  T.classList.add("eidolon-tile-criteria__library-tree");
  const E = e.fileEntries.filter((C) => {
    const I = e.relativePaths.get(C.index) || C.path || C.label;
    return ju(e, C, n) && o.matches(I);
  });
  if (e.fileEntries.length)
    if (E.length) {
      const C = document.createElement("ul");
      C.classList.add("eidolon-tile-criteria__tree"), pl(_u(E), e, t, n, C), T.appendChild(C);
    } else {
      const C = document.createElement("p");
      C.classList.add("notes"), C.textContent = g("EIDOLON.TileCriteria.NoMatches", "No variants match this filter."), T.appendChild(C);
    }
  else {
    const C = document.createElement("p");
    C.classList.add("notes"), C.textContent = g("EIDOLON.TileCriteria.NoVariants", "No MATT variants found"), T.appendChild(C);
  }
  return r.appendChild(T), r;
}
s(Gu, "renderTreePanel");
function Ce(e) {
  const { section: t, state: n } = e, i = Ua(n);
  Ou(e), t.replaceChildren();
  const r = /* @__PURE__ */ s(async () => {
    try {
      const a = Ua(n);
      if (a.errors.length) {
        n.status = {
          mode: "error",
          message: g(
            "EIDOLON.TileCriteria.ConflictSaveBlocked",
            `Resolve ${a.errors.length} conflict(s) before saving tile criteria rules.`
          )
        }, Ce(e);
        return;
      }
      const l = xu(n);
      if (!l) {
        n.status = {
          mode: "error",
          message: g("EIDOLON.TileCriteria.Invalid", "Invalid rules. Select valid target variants.")
        }, Ce(e);
        return;
      }
      await qa(e.tile, l);
      const c = n.filterQuery, u = n.filterMode, d = n.selectedFileIndex;
      e.state = Ro(e.tile), e.state.filterQuery = c, e.state.filterMode = u, Number.isInteger(d) && (e.state.selectedFileIndex = d), e.state.status = {
        mode: "ready",
        message: g("EIDOLON.TileCriteria.Saved", "Tile criteria rules saved.")
      }, Ce(e), ja(e);
    } catch (a) {
      console.error(`${J} | Failed to save tile criteria`, a), n.status = {
        mode: "error",
        message: (a == null ? void 0 : a.message) ?? "Failed to save tile criteria rules."
      }, Ce(e);
    }
  }, "handleSave"), o = /* @__PURE__ */ s(async () => {
    try {
      await qa(e.tile, null);
      const a = n.filterQuery, l = n.filterMode, c = n.selectedFileIndex;
      e.state = Ro(e.tile), e.state.filterQuery = a, e.state.filterMode = l, Number.isInteger(c) && (e.state.selectedFileIndex = c), e.state.status = {
        mode: "ready",
        message: g("EIDOLON.TileCriteria.Cleared", "Tile criteria rules cleared.")
      }, Ce(e), ja(e);
    } catch (a) {
      console.error(`${J} | Failed to clear tile criteria`, a), n.status = {
        mode: "error",
        message: (a == null ? void 0 : a.message) ?? "Failed to clear tile criteria rules."
      }, Ce(e);
    }
  }, "handleClear");
  if (t.appendChild(Gu(n, e, i, {
    onSave: r,
    onClear: o
  })), i.errors.length || i.warnings.length) {
    const a = document.createElement("section");
    a.classList.add("eidolon-tile-criteria__conflicts");
    const l = document.createElement("p");
    l.classList.add("eidolon-tile-criteria__conflict-summary", "notes"), i.errors.length ? (l.dataset.mode = "error", l.textContent = g(
      "EIDOLON.TileCriteria.ConflictSummary",
      `${i.errors.length} conflict(s) must be resolved before saving${i.warnings.length ? ` (${i.warnings.length} warning(s))` : ""}.`
    )) : (l.dataset.mode = "warning", l.textContent = g(
      "EIDOLON.TileCriteria.WarningSummary",
      `${i.warnings.length} potential issue(s) detected.`
    )), a.appendChild(l);
    const c = document.createElement("p");
    c.classList.add("eidolon-tile-criteria__conflict-hint", "notes"), c.textContent = g(
      "EIDOLON.TileCriteria.ConflictHint",
      "Files involved in clashes are marked in red with a warning icon."
    ), a.appendChild(c), t.appendChild(a);
  }
  if (n.status.mode === "error" || n.status.mode === "warning") {
    const a = document.createElement("p");
    a.classList.add("eidolon-tile-criteria__status", "notes"), a.dataset.mode = n.status.mode, a.textContent = n.status.message, t.appendChild(a);
  }
}
s(Ce, "renderController");
function Wu(e, t = null) {
  const n = document.createElement("section");
  n.classList.add("eidolon-tile-criteria");
  const i = Ro(e);
  vu(i, Iu(t));
  const r = {
    app: t,
    tile: e,
    section: n,
    state: i
  };
  return Ce(r), r;
}
s(Wu, "createController");
function Ku(e) {
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
s(Ku, "findFooterElement");
function Ju(e) {
  if (!(e instanceof HTMLElement)) return null;
  const t = [
    "nav.sheet-tabs[data-group]",
    "nav.tabs[data-group]",
    "nav.sheet-tabs",
    "nav.tabs"
  ];
  for (const n of t) {
    const i = e.querySelector(n);
    if (i instanceof HTMLElement) return i;
  }
  return null;
}
s(Ju, "findTabNav");
function Yu(e, t) {
  var i, r, o;
  return e instanceof HTMLElement ? [
    (i = e.querySelector(".tab[data-tab]")) == null ? void 0 : i.parentElement,
    e.querySelector(".sheet-body"),
    (o = (r = t == null ? void 0 : t.parentElement) == null ? void 0 : r.querySelector) == null ? void 0 : o.call(r, ":scope > .sheet-body"),
    t == null ? void 0 : t.parentElement
  ].find((a) => a instanceof HTMLElement) ?? null : null;
}
s(Yu, "findTabBody");
function Qu(e, t) {
  var n, i, r, o, a, l, c;
  return ((n = e == null ? void 0 : e.dataset) == null ? void 0 : n.group) ?? ((o = (r = (i = e == null ? void 0 : e.querySelector) == null ? void 0 : i.call(e, "[data-group]")) == null ? void 0 : r.dataset) == null ? void 0 : o.group) ?? ((c = (l = (a = t == null ? void 0 : t.querySelector) == null ? void 0 : a.call(t, ".tab[data-group]")) == null ? void 0 : l.dataset) == null ? void 0 : c.group) ?? "main";
}
s(Qu, "getTabGroup");
function Xu(e, t) {
  if (!(e instanceof HTMLElement)) return;
  e.textContent = "";
  const n = document.createElement("i");
  n.className = Su, n.setAttribute("inert", ""), e.append(n, " ");
  const i = document.createElement("span");
  i.textContent = t, e.append(i);
}
s(Xu, "setTabButtonContent");
function Zu(e, t) {
  const n = e.querySelector("[data-tab]"), i = (n == null ? void 0 : n.tagName) || "A", r = document.createElement(i);
  return n instanceof HTMLElement && (r.className = n.className), r.classList.remove("active"), i === "BUTTON" && (r.type = "button"), r.dataset.action = "tab", r.dataset.tab = at, r.dataset.group = t, r.setAttribute("aria-selected", "false"), r.setAttribute("aria-pressed", "false"), r;
}
s(Zu, "createTabButton");
function ed(e, t) {
  const n = document.createElement("div");
  n.classList.add("tab"), n.dataset.tab = at, n.dataset.group = t, n.dataset.applicationPart = at, n.setAttribute("hidden", "true");
  const i = Ku(e);
  return e.insertBefore(n, i ?? null), n;
}
s(ed, "createTabPanel");
function Gr(e, t, n, i) {
  var a;
  if (!(n instanceof HTMLElement) || !(i instanceof HTMLElement)) return;
  const r = (a = e == null ? void 0 : e.tabGroups) == null ? void 0 : a[t];
  if (typeof r == "string" ? r === at : n.classList.contains("active") || i.classList.contains("active")) {
    n.classList.add("active"), n.setAttribute("aria-selected", "true"), n.setAttribute("aria-pressed", "true"), i.classList.add("active"), i.removeAttribute("hidden"), i.removeAttribute("aria-hidden");
    return;
  }
  n.classList.remove("active"), n.setAttribute("aria-selected", "false"), n.setAttribute("aria-pressed", "false"), i.classList.remove("active"), i.setAttribute("hidden", "true");
}
s(Gr, "syncTabVisibility");
function td(e, t) {
  const n = Ju(t), i = Yu(t, n);
  if (!(n instanceof HTMLElement) || !(i instanceof HTMLElement)) return null;
  const r = Qu(n, i);
  let o = n.querySelector(`[data-tab="${at}"]`);
  o instanceof HTMLElement || (o = Zu(n, r), n.appendChild(o)), Xu(o, g("EIDOLON.TileCriteria.TabLabel", "Criteria"));
  let a = i.querySelector(`.tab[data-tab="${at}"]`);
  return a instanceof HTMLElement || (a = ed(i, r)), o.dataset.eidolonTileCriteriaBound || (o.addEventListener("click", () => {
    As(e, at, r), requestAnimationFrame(() => {
      Gr(e, r, o, a);
    });
  }), o.dataset.eidolonTileCriteriaBound = "true"), Gr(e, r, o, a), requestAnimationFrame(() => {
    Gr(e, r, o, a);
  }), a;
}
s(td, "ensureTileCriteriaTab");
function nd() {
  Hooks.on("renderTileConfig", (e, t) => {
    var c, u, d, f;
    const n = st(t);
    if (!n) return;
    const i = Mu(e);
    if (!i) return;
    if ((c = n.querySelector(".eidolon-tile-criteria")) == null || c.remove(), !Ir()) {
      (u = n.querySelector(`.item[data-tab='${at}']`)) == null || u.remove(), (d = n.querySelector(`.tab[data-tab='${at}']`)) == null || d.remove();
      return;
    }
    const r = Wu(i, e), o = td(e, n);
    if (o instanceof HTMLElement) {
      o.replaceChildren(r.section), (f = e.setPosition) == null || f.call(e, { height: "auto" });
      return;
    }
    const a = (e == null ? void 0 : e.form) instanceof HTMLFormElement ? e.form : n instanceof HTMLFormElement ? n : n.querySelector("form");
    if (!(a instanceof HTMLFormElement)) return;
    const l = a.querySelector("button[type='submit']");
    l != null && l.parentElement ? l.parentElement.insertAdjacentElement("beforebegin", r.section) : a.appendChild(r.section);
  });
}
s(nd, "registerTileCriteriaConfigControls");
function id(e) {
  if (Array.isArray(e)) return e;
  if (e instanceof Map) return Array.from(e.values());
  if (e && typeof e == "object") {
    if (typeof e.values == "function")
      try {
        const t = Array.from(e.values());
        if (t.length > 0) return t;
      } catch {
      }
    return Object.values(e);
  }
  return [];
}
s(id, "toList");
function rd(e, t) {
  const n = e == null ? void 0 : e.tools;
  return Array.isArray(n) ? n.some((i) => (i == null ? void 0 : i.name) === t) : n instanceof Map ? n.has(t) : n && typeof n == "object" ? t in n ? !0 : Object.values(n).some((i) => (i == null ? void 0 : i.name) === t) : !1;
}
s(rd, "hasTool");
function od(e, t) {
  if (Array.isArray(e.tools)) {
    e.tools.push(t);
    return;
  }
  if (e.tools instanceof Map) {
    e.tools.set(t.name, t);
    return;
  }
  if (e.tools && typeof e.tools == "object") {
    e.tools[t.name] = t;
    return;
  }
  e.tools = [t];
}
s(od, "addTool");
function ad() {
  Hooks.on("getSceneControlButtons", (e) => {
    var i;
    const t = id(e);
    if (!t.length) return;
    const n = t.find((r) => (r == null ? void 0 : r.name) === "tiles") ?? t.find((r) => (r == null ? void 0 : r.name) === "tokens" || (r == null ? void 0 : r.name) === "token") ?? t[0];
    n && (rd(n, "eidolonCriteriaSwitcher") || od(n, {
      name: "eidolonCriteriaSwitcher",
      title: "Criteria Switcher",
      icon: "fa-solid fa-sliders",
      button: !0,
      toggle: !1,
      visible: Or(((i = game.scenes) == null ? void 0 : i.viewed) ?? null),
      onClick: /* @__PURE__ */ s(() => ra(), "onClick")
    }));
  });
}
s(ad, "registerSceneControlButton");
function fi(e, t) {
  if (!e || typeof e != "object") return !1;
  const n = String(t).split(".");
  let i = e;
  for (const r of n) {
    if (!i || typeof i != "object" || !Object.prototype.hasOwnProperty.call(i, r)) return !1;
    i = i[r];
  }
  return !0;
}
s(fi, "hasOwnPath");
function sd() {
  const e = /* @__PURE__ */ s((i, r = null) => {
    i && Jc(i, r);
  }, "invalidateTileScene"), t = /* @__PURE__ */ s((i, r = null) => {
    i && cu(i, r);
  }, "invalidatePlaceableScene");
  Hooks.on("createTile", (i) => {
    e((i == null ? void 0 : i.parent) ?? null, i ?? null);
  }), Hooks.on("deleteTile", (i) => {
    e((i == null ? void 0 : i.parent) ?? null, i ?? null);
  }), Hooks.on("updateTile", (i, r) => {
    (fi(r, `flags.${J}.tileCriteria`) || fi(r, `flags.${J}.fileIndex`)) && e((i == null ? void 0 : i.parent) ?? null, i ?? null);
  });
  const n = /* @__PURE__ */ s((i) => {
    Hooks.on(`create${i}`, (r) => {
      t((r == null ? void 0 : r.parent) ?? null, r ?? null);
    }), Hooks.on(`delete${i}`, (r) => {
      t((r == null ? void 0 : r.parent) ?? null, r ?? null);
    }), Hooks.on(`update${i}`, (r, o) => {
      const a = fi(o, `flags.${J}.presets`), l = i === "AmbientLight" && fi(o, `flags.${J}.lightCriteria`);
      !a && !l || t((r == null ? void 0 : r.parent) ?? null, r ?? null);
    });
  }, "registerPlaceableHooks");
  n("AmbientLight"), n("Wall"), n("AmbientSound"), Hooks.on("canvasReady", (i) => {
    const r = (i == null ? void 0 : i.scene) ?? null;
    r && (e(r), t(r));
  });
}
s(sd, "registerCriteriaCacheInvalidationHooks");
function ld() {
  ad(), nd(), sd(), Hooks.once("init", () => {
    var e, t;
    (t = (e = game.keybindings) == null ? void 0 : e.register) == null || t.call(e, J, "toggleCriteriaSwitcher", {
      name: "Toggle Criteria Switcher",
      hint: "Open or close the criteria switcher window for live scene state updates.",
      editable: [{ key: "KeyM", modifiers: ["Alt"] }],
      onDown: /* @__PURE__ */ s(() => {
        var n, i, r;
        return Or(((n = game.scenes) == null ? void 0 : n.viewed) ?? null) ? (ra(), !0) : ((r = (i = ui.notifications) == null ? void 0 : i.warn) == null || r.call(i, "You do not have permission to manage scene criteria."), !0);
      }, "onDown"),
      restricted: !0,
      precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL
    });
  }), Hooks.on("canvasReady", (e) => {
    var n;
    const t = Nr();
    t && (t.setScene((e == null ? void 0 : e.scene) ?? ((n = game.scenes) == null ? void 0 : n.viewed) ?? null), t.render({ force: !0 }));
  }), Hooks.once("ready", () => {
    var t, n;
    const e = (n = (t = game.modules) == null ? void 0 : t.get) == null ? void 0 : n.call(t, J);
    e && (e.api || (e.api = {}), e.api.criteria = Cu, console.log(`${J} | Criteria engine API registered`));
  });
}
s(ld, "registerCriteriaEngineHooks");
ld();
const Si = /* @__PURE__ */ new WeakMap(), gi = /* @__PURE__ */ new WeakMap(), le = "__eidolon_default__";
function cd() {
  Hooks.on("renderAmbientLightConfig", ud), S("LightCriteria | AmbientLightConfig controls registered");
}
s(cd, "registerAmbientLightCriteriaControls");
function ud(e, t) {
  var n;
  dn("LightCriteria | renderAmbientLightConfig", {
    appId: (e == null ? void 0 : e.id) ?? null,
    constructor: ((n = e == null ? void 0 : e.constructor) == null ? void 0 : n.name) ?? null,
    isRendered: (e == null ? void 0 : e.rendered) ?? !1
  });
  try {
    const i = st(t);
    if (!i) return;
    if (!Ir()) {
      i.querySelectorAll(".eidolon-light-criteria, .eidolon-light-criteria-main-switcher").forEach((r) => r.remove());
      return;
    }
    dd(e, i);
  } catch (i) {
    console.error("eidolon-utilities | Failed to enhance AmbientLightConfig UI", i);
  } finally {
    Ct();
  }
}
s(ud, "handleAmbientLightConfigRender");
function dd(e, t) {
  var me, Mt, hn, ii, pa;
  const n = (e == null ? void 0 : e.form) instanceof HTMLFormElement ? e.form : t instanceof HTMLFormElement ? t : (me = t == null ? void 0 : t.closest) == null ? void 0 : me.call(t, "form");
  if (!(n instanceof HTMLFormElement)) return;
  const i = n.querySelector(".window-content");
  if (!(i instanceof HTMLElement)) return;
  const r = bl(e);
  if (!r) return;
  const o = Dd(r);
  S("LightCriteria | Resolved ambient light", {
    sheetId: (r == null ? void 0 : r.id) ?? null,
    persistedId: (o == null ? void 0 : o.id) ?? null,
    sameRef: r === o
  });
  const a = (o == null ? void 0 : o.parent) ?? r.parent ?? null, l = a ? pc(a) : [], c = l.filter(
    (v) => Array.isArray(v == null ? void 0 : v.values) && v.values.length > 0
  ), u = wd(l), d = l.map((v) => typeof (v == null ? void 0 : v.id) == "string" ? v.id : null).filter((v) => !!v), f = o ?? r, m = a ? xe(a) : [];
  let y = Js(f);
  const b = eu(y, m);
  JSON.stringify(b) !== JSON.stringify(y) && (y = b, Ys(f, b).catch((v) => {
    console.warn("eidolon-utilities | Failed to persist migrated light criteria keys", v);
  })), S("LightCriteria | Loaded mapping state", {
    hasBase: !!(y != null && y.base),
    mappingCount: Array.isArray(y == null ? void 0 : y.mappings) ? y.mappings.length : 0,
    mappings: Array.isArray(y == null ? void 0 : y.mappings) ? y.mappings.map((v) => {
      var R, q;
      return {
        id: v.id,
        key: v.key,
        hasColor: !!((q = (R = v.config) == null ? void 0 : R.config) != null && q.color)
      };
    }) : []
  });
  const p = i.querySelector(".eidolon-light-criteria");
  p && p.remove(), i.querySelectorAll(".eidolon-light-criteria-main-switcher").forEach((v) => v.remove());
  const T = document.createElement("fieldset");
  T.classList.add("eidolon-light-criteria");
  const E = document.createElement("legend");
  E.textContent = g("EIDOLON.LightCriteria.Legend", "Scene Criteria Lighting"), T.appendChild(E);
  const C = document.createElement("p");
  C.classList.add("notes"), C.textContent = g(
    "EIDOLON.LightCriteria.Description",
    "Capture a base lighting state, then map criteria values to lighting configurations."
  ), T.appendChild(C);
  const I = document.createElement("div");
  I.classList.add("eidolon-light-criteria__controls");
  const D = document.createElement("button");
  D.type = "button", D.dataset.action = "make-default", D.classList.add("eidolon-light-criteria__button"), D.textContent = g(
    "EIDOLON.LightCriteria.SetBase",
    "Set Base"
  ), I.appendChild(D);
  const _ = document.createElement("button");
  _.type = "button", _.dataset.action = "create-mapping", _.classList.add("eidolon-light-criteria__button"), _.textContent = g(
    "EIDOLON.LightCriteria.CreateMapping",
    "Add Criteria Mapping"
  ), _.setAttribute("aria-expanded", "false"), I.appendChild(_), T.appendChild(I);
  const F = document.createElement("p");
  F.classList.add("notes", "eidolon-light-criteria__status"), T.appendChild(F);
  const x = document.createElement("div");
  x.classList.add("eidolon-light-criteria__switcher");
  const W = document.createElement("label");
  W.classList.add("eidolon-light-criteria__switcher-label");
  const te = `${(e == null ? void 0 : e.id) ?? (r == null ? void 0 : r.id) ?? "eidolon-light"}-mapping-select`;
  W.htmlFor = te, W.textContent = g("EIDOLON.LightCriteria.SelectLabel", "Criteria Mapping"), x.appendChild(W);
  const H = document.createElement("details");
  H.classList.add("eidolon-light-criteria__filter-details");
  const Q = document.createElement("summary");
  Q.classList.add("eidolon-light-criteria__filter-summary");
  const A = document.createElement("span");
  A.classList.add("eidolon-light-criteria__filter-summary-label"), A.textContent = g(
    "EIDOLON.LightCriteria.FilterHeading",
    "Filter mappings"
  ), Q.appendChild(A);
  const U = document.createElement("span");
  U.classList.add("eidolon-light-criteria__filter-meta"), Q.appendChild(U), H.appendChild(Q);
  const G = document.createElement("div");
  G.classList.add("eidolon-light-criteria__filter-panel");
  const j = document.createElement("div");
  j.classList.add("eidolon-light-criteria__filter-grid");
  for (const v of c) {
    const R = document.createElement("label");
    R.classList.add("eidolon-light-criteria__filter");
    const q = document.createElement("span");
    q.classList.add("eidolon-light-criteria__filter-name"), q.textContent = (hn = (Mt = v.name) == null ? void 0 : Mt.trim) != null && hn.call(Mt) ? v.name.trim() : g("EIDOLON.LightCriteria.UnnamedCategory", "Unnamed Category"), R.appendChild(q);
    const V = document.createElement("select");
    V.dataset.filterCategoryId = v.id, V.classList.add("eidolon-light-criteria__filter-select");
    const K = document.createElement("option");
    K.value = "", K.textContent = g("EIDOLON.LightCriteria.FilterAny", "Any"), V.appendChild(K);
    for (const re of v.values) {
      const oe = document.createElement("option");
      oe.value = re, oe.textContent = re, V.appendChild(oe);
    }
    R.appendChild(V), j.appendChild(R);
  }
  G.appendChild(j);
  const $ = document.createElement("div");
  $.classList.add("eidolon-light-criteria__filter-actions");
  const P = document.createElement("button");
  P.type = "button", P.dataset.action = "clear-mapping-filters", P.classList.add("eidolon-light-criteria__button", "secondary", "compact"), P.textContent = g("EIDOLON.LightCriteria.ClearFilters", "Clear Filters"), $.appendChild(P), G.appendChild($), H.appendChild(G), H.hidden = c.length === 0, x.appendChild(H);
  const Y = document.createElement("div");
  Y.classList.add("eidolon-light-criteria__switcher-controls"), x.appendChild(Y);
  const ne = document.createElement("select");
  ne.id = te, ne.classList.add("eidolon-light-criteria__select"), ne.dataset.action = "select-mapping", Y.appendChild(ne);
  const z = document.createElement("button");
  z.type = "button", z.dataset.action = "apply-selected-mapping", z.classList.add("eidolon-light-criteria__button", "secondary"), z.textContent = g("EIDOLON.LightCriteria.ApplyButton", "Apply"), Y.appendChild(z);
  const X = document.createElement("details");
  X.classList.add("eidolon-light-criteria__menu"), X.dataset.action = "mapping-actions-menu";
  const vt = document.createElement("summary");
  vt.classList.add("eidolon-light-criteria__menu-toggle"), vt.innerHTML = '<i class="fa-solid fa-ellipsis-vertical" inert=""></i>', vt.setAttribute(
    "aria-label",
    g("EIDOLON.LightCriteria.MoreActions", "More actions")
  ), vt.dataset.tooltip = g("EIDOLON.LightCriteria.MoreActions", "More actions"), X.appendChild(vt);
  const Re = document.createElement("div");
  Re.classList.add("eidolon-light-criteria__menu-list"), X.appendChild(Re);
  const pe = document.createElement("button");
  pe.type = "button", pe.dataset.action = "update-selected-mapping", pe.classList.add("eidolon-light-criteria__menu-item"), pe.textContent = g(
    "EIDOLON.LightCriteria.UpdateSelected",
    "Save current config to selected"
  ), Re.appendChild(pe);
  const Me = document.createElement("button");
  Me.type = "button", Me.dataset.action = "edit-selected-mapping-criteria", Me.classList.add("eidolon-light-criteria__menu-item"), Me.textContent = g(
    "EIDOLON.LightCriteria.EditSelectedCriteria",
    "Edit selected mapping criteria"
  ), Re.appendChild(Me);
  const Ae = document.createElement("button");
  Ae.type = "button", Ae.dataset.action = "remove-selected-mapping", Ae.classList.add("eidolon-light-criteria__menu-item", "danger"), Ae.textContent = g(
    "EIDOLON.LightCriteria.RemoveSelected",
    "Delete selected mapping"
  ), Re.appendChild(Ae), Y.appendChild(X);
  const Xe = document.createElement("div");
  Xe.classList.add("eidolon-light-criteria-main-switcher"), Xe.appendChild(x);
  const we = document.createElement("p");
  if (we.classList.add("notes", "eidolon-light-criteria-main-switcher__empty"), we.textContent = g(
    "EIDOLON.LightCriteria.ActiveRequiresBase",
    "Set Base Lighting to enable mapping selection and actions."
  ), Xe.appendChild(we), l.length === 0) {
    const v = document.createElement("p");
    v.classList.add("notification", "warning", "eidolon-light-criteria__warning"), v.textContent = g(
      "EIDOLON.LightCriteria.NoCategoriesWarning",
      "This scene has no criteria configured. Add criteria under Scene -> Criteria to enable criteria-driven lighting."
    ), T.appendChild(v);
  } else if (c.length === 0) {
    const v = document.createElement("p");
    v.classList.add("notification", "warning", "eidolon-light-criteria__warning"), v.textContent = g(
      "EIDOLON.LightCriteria.NoValuesWarning",
      "Criteria exist, but none define selectable values. Add values in Scene -> Criteria."
    ), T.appendChild(v);
  }
  const fe = document.createElement("div");
  fe.classList.add("eidolon-light-criteria__creation"), fe.dataset.section = "creation", fe.hidden = !0;
  const Yt = document.createElement("p");
  Yt.classList.add("notes"), Yt.textContent = g(
    "EIDOLON.LightCriteria.CreateDescription",
    "Assign scene criteria values to map the current configuration."
  ), fe.appendChild(Yt);
  const Ze = document.createElement("div");
  Ze.classList.add("eidolon-light-criteria__category-list"), fe.appendChild(Ze);
  for (const v of c) {
    const R = document.createElement("label");
    R.classList.add("eidolon-light-criteria__category");
    const q = document.createElement("span");
    q.classList.add("eidolon-light-criteria__category-name"), q.textContent = (pa = (ii = v.name) == null ? void 0 : ii.trim) != null && pa.call(ii) ? v.name.trim() : g("EIDOLON.LightCriteria.UnnamedCategory", "Unnamed Category"), R.appendChild(q);
    const V = document.createElement("select");
    V.dataset.categoryId = v.id, V.classList.add("eidolon-light-criteria__category-select");
    const K = document.createElement("option");
    K.value = "", K.textContent = g(
      "EIDOLON.LightCriteria.IgnoreCategory",
      "Ignore"
    ), V.appendChild(K);
    for (const re of v.values) {
      const oe = document.createElement("option");
      oe.value = re, oe.textContent = re, V.appendChild(oe);
    }
    R.appendChild(V), Ze.appendChild(R);
  }
  const Ot = document.createElement("div");
  Ot.classList.add("eidolon-light-criteria__creation-actions");
  const Ne = document.createElement("button");
  Ne.type = "button", Ne.dataset.action = "save-mapping", Ne.classList.add("eidolon-light-criteria__button", "primary"), Ne.textContent = g(
    "EIDOLON.LightCriteria.SaveMapping",
    "Save Mapping"
  ), Ot.appendChild(Ne);
  const et = document.createElement("button");
  et.type = "button", et.dataset.action = "cancel-create", et.classList.add("eidolon-light-criteria__button", "secondary"), et.textContent = g(
    "EIDOLON.LightCriteria.Cancel",
    "Cancel"
  ), Ot.appendChild(et), fe.appendChild(Ot), T.appendChild(fe), i.prepend(Xe), i.appendChild(T), T.hidden = !0, md(e, {
    fieldset: T,
    homeContainer: i
  }), requestAnimationFrame(() => {
    var v;
    (v = e.setPosition) == null || v.call(e, { height: "auto" });
  });
  let N = y;
  _t({ switcher: x, emptyState: we, state: N }), Nt(F, N), Tn(_, {
    state: N,
    hasCategories: c.length > 0
  }), S("LightCriteria | Controls injected", {
    sceneId: (a == null ? void 0 : a.id) ?? null,
    lightId: (r == null ? void 0 : r.id) ?? null,
    hasBase: !!(N != null && N.base),
    mappingCount: Array.isArray(N == null ? void 0 : N.mappings) ? N.mappings.length : 0,
    categories: c.length
  });
  const ti = Ad(N), B = {
    restoreConfig: null,
    app: e,
    selectedMapping: ti,
    editorMode: "create",
    editingMappingId: null,
    mappingFilters: {}
  };
  Si.set(T, B);
  const $e = /* @__PURE__ */ s(() => {
    X.open = !1;
  }, "closeActionsMenu");
  vt.addEventListener("click", (v) => {
    X.classList.contains("is-disabled") && (v.preventDefault(), $e());
  });
  const ge = /* @__PURE__ */ s((v = B.selectedMapping) => {
    const R = Sd(j), q = Array.isArray(N == null ? void 0 : N.mappings) ? N.mappings : [], V = vd(q, R), K = Object.keys(R).length;
    B.mappingFilters = R, P.disabled = K === 0, Od(U, {
      totalCount: q.length,
      visibleCount: V.length,
      hasFilters: K > 0,
      activeFilterCount: K
    }), H.classList.toggle("has-active-filters", K > 0), Md(ne, N, u, v, {
      mappings: V,
      categoryOrder: d
    }), B.selectedMapping = ne.value ?? "", Wr({
      mappingSelect: ne,
      applyMappingButton: z,
      updateMappingButton: pe,
      editCriteriaButton: Me,
      removeMappingButton: Ae,
      actionsMenu: X,
      state: N
    }), X.classList.contains("is-disabled") && $e();
  }, "refreshMappingSelector");
  j.querySelectorAll("select[data-filter-category-id]").forEach((v) => {
    v.addEventListener("change", () => {
      const R = B.selectedMapping;
      ge(R), B.selectedMapping !== R && Kr(
        o ?? r,
        N,
        B.selectedMapping
      ).then((q) => {
        q && (N = q);
      });
    });
  }), P.addEventListener("click", () => {
    Id(j);
    const v = B.selectedMapping;
    ge(v), H.open = !1, B.selectedMapping !== v && Kr(
      o ?? r,
      N,
      B.selectedMapping
    ).then((R) => {
      R && (N = R);
    });
  }), ne.addEventListener("change", () => {
    B.selectedMapping = ne.value ?? "", Wr({
      mappingSelect: ne,
      applyMappingButton: z,
      updateMappingButton: pe,
      editCriteriaButton: Me,
      removeMappingButton: Ae,
      actionsMenu: X,
      state: N
    }), Kr(
      o ?? r,
      N,
      B.selectedMapping
    ).then((v) => {
      v && (N = v);
    });
  });
  const mn = /* @__PURE__ */ s(async () => {
    var V, K, re, oe, _e, lt, Fe, ct, se, ut, dt, je, At, pn;
    const v = ne.value ?? "";
    if (!v) {
      (K = (V = ui.notifications) == null ? void 0 : V.warn) == null || K.call(
        V,
        g(
          "EIDOLON.LightCriteria.SelectMappingWarning",
          "Choose a criteria mapping before applying."
        )
      ), ge(B.selectedMapping);
      return;
    }
    if (v === le) {
      if (!(N != null && N.base)) {
        (oe = (re = ui.notifications) == null ? void 0 : re.warn) == null || oe.call(
          re,
          g(
            "EIDOLON.LightCriteria.BaseUnavailable",
            "Set a base lighting state before applying it."
          )
        );
        return;
      }
      mi(T, fe, _), vi(e, n, N.base), N = await vn(o ?? r, {
        mappingId: le,
        categories: null,
        updatedAt: Date.now()
      }), B.selectedMapping = le, ge(B.selectedMapping), Nt(F, N), _t({ switcher: x, emptyState: we, state: N }), Tn(_, {
        state: N,
        hasCategories: c.length > 0
      }), za(n, {
        mappingId: le,
        color: ((lt = (_e = N.base) == null ? void 0 : _e.config) == null ? void 0 : lt.color) ?? null
      }), (ct = (Fe = ui.notifications) == null ? void 0 : Fe.info) == null || ct.call(
        Fe,
        g(
          "EIDOLON.LightCriteria.BaseApplied",
          "Applied the base lighting state to the form."
        )
      ), $e();
      return;
    }
    const R = Array.isArray(N == null ? void 0 : N.mappings) && N.mappings.length ? N.mappings.find((Qt) => (Qt == null ? void 0 : Qt.id) === v) : null;
    if (!R) {
      (ut = (se = ui.notifications) == null ? void 0 : se.warn) == null || ut.call(
        se,
        g(
          "EIDOLON.LightCriteria.MappingUnavailable",
          "The selected criteria mapping is no longer available."
        )
      ), B.selectedMapping = "", ge(B.selectedMapping);
      return;
    }
    mi(T, fe, _), vi(e, n, R.config), N = await vn(o ?? r, {
      mappingId: R.id,
      categories: R.categories,
      updatedAt: Date.now()
    }), B.selectedMapping = R.id, ge(B.selectedMapping), Nt(F, N), _t({ switcher: x, emptyState: we, state: N }), Tn(_, {
      state: N,
      hasCategories: c.length > 0
    }), za(n, {
      mappingId: R.id,
      color: ((je = (dt = R.config) == null ? void 0 : dt.config) == null ? void 0 : je.color) ?? null
    });
    const q = sn(R, u, d);
    (pn = (At = ui.notifications) == null ? void 0 : At.info) == null || pn.call(
      At,
      g(
        "EIDOLON.LightCriteria.MappingApplied",
        "Applied mapping: {label}"
      ).replace("{label}", q)
    ), $e();
  }, "applySelectedMapping");
  z.addEventListener("click", () => {
    mn();
  }), ne.addEventListener("keydown", (v) => {
    v.key === "Enter" && (v.preventDefault(), mn());
  });
  const ni = /* @__PURE__ */ s(async () => {
    var R, q, V, K, re, oe, _e, lt, Fe, ct, se, ut, dt, je, At, pn, Qt, ri, ya, oi, ba;
    const v = B.selectedMapping;
    if (!v) {
      (q = (R = ui.notifications) == null ? void 0 : R.warn) == null || q.call(
        R,
        g(
          "EIDOLON.LightCriteria.SelectMappingWarning",
          "Choose a criteria mapping before applying."
        )
      );
      return;
    }
    pe.disabled = !0;
    try {
      const Se = Ii(e, o);
      if (v === le)
        N = await Ra(o ?? r, Se), S("LightCriteria | Base lighting updated", {
          lightId: ((V = o ?? r) == null ? void 0 : V.id) ?? null,
          configColor: ((K = Se == null ? void 0 : Se.config) == null ? void 0 : K.color) ?? null
        }), (oe = (re = ui.notifications) == null ? void 0 : re.info) == null || oe.call(
          re,
          g(
            "EIDOLON.LightCriteria.BaseUpdated",
            "Updated the base lighting state with the current configuration."
          )
        ), B.selectedMapping = le;
      else {
        const Xt = On(N, v);
        if (!Xt) {
          (lt = (_e = ui.notifications) == null ? void 0 : _e.warn) == null || lt.call(
            _e,
            g(
              "EIDOLON.LightCriteria.MappingUnavailable",
              "The selected criteria mapping is no longer available."
            )
          ), B.selectedMapping = "", ge(B.selectedMapping);
          return;
        }
        N = await $a(
          o ?? r,
          Xt.categories,
          Se,
          { label: Xt.label ?? null }
        ), S("LightCriteria | Mapping updated", {
          mappingId: v,
          hasColor: !!((Fe = Se == null ? void 0 : Se.config) != null && Fe.color),
          stored: Array.isArray(N == null ? void 0 : N.mappings) ? ((ct = N.mappings.find((kr) => (kr == null ? void 0 : kr.id) === v)) == null ? void 0 : ct.config) ?? null : null,
          persisted: (ut = (se = o ?? r) == null ? void 0 : se.getFlag) == null ? void 0 : ut.call(se, Vt, an)
        });
        const yn = On(N, v), Ml = sn(yn || Xt, u, d);
        S("LightCriteria | Mapping updated", {
          mappingId: v,
          categories: Xt.categories,
          updatedColor: ((dt = Se == null ? void 0 : Se.config) == null ? void 0 : dt.color) ?? null,
          storedColor: ((At = (je = yn == null ? void 0 : yn.config) == null ? void 0 : je.config) == null ? void 0 : At.color) ?? ((Qt = (pn = Xt.config) == null ? void 0 : pn.config) == null ? void 0 : Qt.color) ?? null
        }), (ya = (ri = ui.notifications) == null ? void 0 : ri.info) == null || ya.call(
          ri,
          g(
            "EIDOLON.LightCriteria.MappingUpdated",
            "Saved changes to mapping: {label}"
          ).replace("{label}", Ml)
        ), B.selectedMapping = v;
      }
      Nt(F, N), _t({ switcher: x, emptyState: we, state: N }), Tn(_, {
        state: N,
        hasCategories: c.length > 0
      }), ge(B.selectedMapping), $e();
    } catch (Se) {
      console.error("eidolon-utilities | Failed to update light criteria mapping", Se), (ba = (oi = ui.notifications) == null ? void 0 : oi.error) == null || ba.call(
        oi,
        g(
          "EIDOLON.LightCriteria.MappingUpdateError",
          "Failed to save the mapping. Check the console for details."
        )
      );
    } finally {
      pe.disabled = !1, Wr({
        mappingSelect: ne,
        applyMappingButton: z,
        updateMappingButton: pe,
        editCriteriaButton: Me,
        removeMappingButton: Ae,
        actionsMenu: X,
        state: N
      });
    }
  }, "updateSelectedMapping");
  pe.addEventListener("click", () => {
    ni();
  }), ge(B.selectedMapping), D.addEventListener("click", async () => {
    var v, R, q, V, K, re;
    D.disabled = !0;
    try {
      const oe = Ii(e, o);
      N = await Ra(o ?? r, oe), S("LightCriteria | Base lighting stored", {
        lightId: ((v = o ?? r) == null ? void 0 : v.id) ?? null,
        configColor: ((R = oe == null ? void 0 : oe.config) == null ? void 0 : R.color) ?? null
      }), (V = (q = ui.notifications) == null ? void 0 : q.info) == null || V.call(
        q,
        g(
          "EIDOLON.LightCriteria.BaseStored",
          "Saved the current configuration as the base lighting state."
        )
      ), Nt(F, N), _t({ switcher: x, emptyState: we, state: N }), Tn(_, {
        state: N,
        hasCategories: c.length > 0
      }), B.selectedMapping = le, ge(B.selectedMapping);
    } catch (oe) {
      console.error("eidolon-utilities | Failed to store base light criteria state", oe), (re = (K = ui.notifications) == null ? void 0 : K.error) == null || re.call(
        K,
        g(
          "EIDOLON.LightCriteria.BaseError",
          "Failed to save the base lighting state. Check the console for details."
        )
      );
    } finally {
      D.disabled = !1;
    }
  }), _.addEventListener("click", () => {
    var R, q, V, K;
    if (!(N != null && N.base)) {
      (q = (R = ui.notifications) == null ? void 0 : R.warn) == null || q.call(
        R,
        g(
          "EIDOLON.LightCriteria.RequiresBase",
          "Set a base lighting state before adding criteria mappings."
        )
      );
      return;
    }
    if (c.length === 0) {
      (K = (V = ui.notifications) == null ? void 0 : V.warn) == null || K.call(
        V,
        g(
          "EIDOLON.LightCriteria.NoCategoriesAvailable",
          "Add scene criteria with values in the Scene configuration before creating mappings."
        )
      );
      return;
    }
    const v = Si.get(T);
    Va({
      app: e,
      fieldset: T,
      createButton: _,
      creationSection: fe,
      categoryList: Ze,
      form: n,
      persistedLight: o,
      stateEntry: v,
      mode: "create",
      mapping: null,
      preloadConfig: N.base
    });
  }), Me.addEventListener("click", () => {
    var q, V, K, re;
    const v = B.selectedMapping;
    if (!v || v === le) {
      (V = (q = ui.notifications) == null ? void 0 : q.warn) == null || V.call(
        q,
        g(
          "EIDOLON.LightCriteria.SelectMappingForCriteriaEdit",
          "Select a mapping before editing criteria."
        )
      );
      return;
    }
    const R = On(N, v);
    if (!R) {
      (re = (K = ui.notifications) == null ? void 0 : K.warn) == null || re.call(
        K,
        g(
          "EIDOLON.LightCriteria.MappingUnavailable",
          "The selected criteria mapping is no longer available."
        )
      );
      return;
    }
    $e(), yl(e, { fieldset: T, homeContainer: i }), Va({
      app: e,
      fieldset: T,
      createButton: _,
      creationSection: fe,
      categoryList: Ze,
      form: n,
      persistedLight: o,
      stateEntry: B,
      mode: "retarget",
      mapping: R,
      preloadConfig: R.config
    });
  }), Ne.addEventListener("click", async () => {
    var R, q, V, K, re, oe, _e, lt, Fe, ct;
    const v = Fd(Ze);
    if (!v) {
      (q = (R = ui.notifications) == null ? void 0 : R.warn) == null || q.call(
        R,
        g(
          "EIDOLON.LightCriteria.SelectionRequired",
          "Select at least one criteria value to identify the mapping."
        )
      );
      return;
    }
    Ne.disabled = !0;
    try {
      const se = Ii(e, o);
      if (B.editorMode === "retarget" && B.editingMappingId) {
        const dt = Po(N, v);
        let je = !1;
        if (dt && dt !== B.editingMappingId && (je = await fd(), !je)) {
          Ne.disabled = !1;
          return;
        }
        N = await Qc(
          o ?? r,
          B.editingMappingId,
          v,
          se,
          { replaceExisting: je }
        ), S("LightCriteria | Mapping criteria retargeted", {
          mappingId: B.editingMappingId,
          categories: v,
          replaced: je,
          configColor: ((V = se == null ? void 0 : se.config) == null ? void 0 : V.color) ?? null
        }), (re = (K = ui.notifications) == null ? void 0 : K.info) == null || re.call(
          K,
          g(
            "EIDOLON.LightCriteria.MappingCriteriaUpdated",
            "Updated mapping criteria for the selected mapping."
          )
        );
      } else
        N = await $a(
          o ?? r,
          v,
          se,
          {}
        ), S("LightCriteria | Mapping saved from editor", {
          categories: v,
          configColor: ((oe = se == null ? void 0 : se.config) == null ? void 0 : oe.color) ?? null
        }), (lt = (_e = ui.notifications) == null ? void 0 : _e.info) == null || lt.call(
          _e,
          g(
            "EIDOLON.LightCriteria.MappingSaved",
            "Updated lighting mapping for the selected scene criteria."
          )
        );
      Nt(F, N), _t({ switcher: x, emptyState: we, state: N });
      const ut = Po(N, v);
      ut && (B.selectedMapping = ut), ge(B.selectedMapping), mi(T, fe, _), $e();
    } catch (se) {
      console.error("eidolon-utilities | Failed to persist light criteria mapping", se), (ct = (Fe = ui.notifications) == null ? void 0 : Fe.error) == null || ct.call(
        Fe,
        g(
          "EIDOLON.LightCriteria.MappingError",
          "Failed to save the mapping. Check the console for details."
        )
      );
    } finally {
      Ne.disabled = !1;
    }
  }), et.addEventListener("click", () => {
    const v = Si.get(T);
    v != null && v.restoreConfig && vi(e, n, v.restoreConfig), mi(T, fe, _);
  }), Ae.addEventListener("click", async () => {
    var q, V;
    const v = B.selectedMapping;
    !v || v === le || !await gd() || (N = await Xc(o ?? r, v), B.selectedMapping = "", Nt(F, N), _t({ switcher: x, emptyState: we, state: N }), ge(B.selectedMapping), $e(), (V = (q = ui.notifications) == null ? void 0 : q.info) == null || V.call(
      q,
      g("EIDOLON.LightCriteria.MappingRemoved", "Removed selected mapping.")
    ));
  });
}
s(dd, "enhanceAmbientLightConfig");
function Va({
  app: e,
  fieldset: t,
  createButton: n,
  creationSection: i,
  categoryList: r,
  form: o,
  persistedLight: a,
  stateEntry: l,
  mode: c,
  mapping: u,
  preloadConfig: d
}) {
  l && (l.restoreConfig = Ii(e, a), l.editorMode = c, l.editingMappingId = c === "retarget" ? (u == null ? void 0 : u.id) ?? null : null), d && vi(e, o, d), c === "retarget" && (u != null && u.categories) ? _d(r, u.categories) : Nd(r);
  const f = i.querySelector("p.notes");
  f instanceof HTMLElement && (f.textContent = c === "retarget" ? g(
    "EIDOLON.LightCriteria.EditCriteriaDescription",
    "Adjust criteria values for the selected mapping."
  ) : g(
    "EIDOLON.LightCriteria.CreateDescription",
    "Assign scene criteria values to map the current configuration."
  ));
  const m = i.querySelector('button[data-action="save-mapping"]');
  m instanceof HTMLButtonElement && (m.textContent = c === "retarget" ? g("EIDOLON.LightCriteria.SaveCriteriaChanges", "Save Criteria Changes") : g("EIDOLON.LightCriteria.SaveMapping", "Save Mapping")), i.hidden = !1, n.setAttribute("aria-expanded", "true"), oa(t, i), requestAnimationFrame(() => {
    var y;
    (y = e.setPosition) == null || y.call(e, { height: "auto" });
  });
}
s(Va, "openMappingEditor");
async function fd() {
  var n, i;
  const e = (i = (n = foundry == null ? void 0 : foundry.applications) == null ? void 0 : n.api) == null ? void 0 : i.DialogV2;
  if (typeof (e == null ? void 0 : e.confirm) == "function")
    return e.confirm({
      window: { title: g("EIDOLON.LightCriteria.ConflictTitle", "Replace Existing Mapping?") },
      content: `<p>${g(
        "EIDOLON.LightCriteria.ConflictBody",
        "A mapping already exists for this criteria combination. Replace it with the edited mapping?"
      )}</p>`,
      rejectClose: !1
    });
  const t = globalThis.Dialog;
  return typeof (t == null ? void 0 : t.confirm) != "function" ? !1 : t.confirm({
    title: g("EIDOLON.LightCriteria.ConflictTitle", "Replace Existing Mapping?"),
    content: `<p>${g(
      "EIDOLON.LightCriteria.ConflictBody",
      "A mapping already exists for this criteria combination. Replace it with the edited mapping?"
    )}</p>`,
    yes: /* @__PURE__ */ s(() => !0, "yes"),
    no: /* @__PURE__ */ s(() => !1, "no"),
    defaultYes: !1
  });
}
s(fd, "confirmCriteriaConflict");
async function gd() {
  var n, i;
  const e = (i = (n = foundry == null ? void 0 : foundry.applications) == null ? void 0 : n.api) == null ? void 0 : i.DialogV2;
  if (typeof (e == null ? void 0 : e.confirm) == "function")
    return e.confirm({
      window: { title: g("EIDOLON.LightCriteria.RemoveTitle", "Remove Mapping?") },
      content: `<p>${g(
        "EIDOLON.LightCriteria.RemoveBody",
        "Remove the currently selected mapping? This cannot be undone."
      )}</p>`,
      rejectClose: !1
    });
  const t = globalThis.Dialog;
  return typeof (t == null ? void 0 : t.confirm) != "function" ? !1 : t.confirm({
    title: g("EIDOLON.LightCriteria.RemoveTitle", "Remove Mapping?"),
    content: `<p>${g(
      "EIDOLON.LightCriteria.RemoveBody",
      "Remove the currently selected mapping? This cannot be undone."
    )}</p>`,
    yes: /* @__PURE__ */ s(() => !0, "yes"),
    no: /* @__PURE__ */ s(() => !1, "no"),
    defaultYes: !1
  });
}
s(gd, "confirmRemoveMapping");
function md(e, { fieldset: t, homeContainer: n }) {
  const i = yd(e, n);
  if (!(i instanceof HTMLElement)) return;
  const r = i.querySelector(".window-header");
  if (!(r instanceof HTMLElement)) return;
  let o = r.querySelector('[data-eidolon-action="open-light-criteria-manager"]');
  if (!(o instanceof HTMLButtonElement)) {
    o = document.createElement("button"), o.type = "button", o.classList.add("header-control", "icon"), o.dataset.eidolonAction = "open-light-criteria-manager", o.dataset.tooltip = g("EIDOLON.LightCriteria.OpenManager", "Open Scene Criteria Lighting"), o.setAttribute("aria-label", g("EIDOLON.LightCriteria.OpenManager", "Open Scene Criteria Lighting")), o.innerHTML = '<i class="fa-solid fa-sliders" inert=""></i>';
    const a = r.querySelector(".window-controls") ?? r, l = a.querySelector('[data-action="toggleControls"]');
    if ((l == null ? void 0 : l.parentElement) === a)
      a.insertBefore(o, l);
    else {
      const c = a.querySelector('[data-action="close"]');
      (c == null ? void 0 : c.parentElement) === a ? a.insertBefore(o, c) : a.appendChild(o);
    }
  }
  o.onclick = (a) => {
    a.preventDefault(), yl(e, { fieldset: t, homeContainer: n });
  };
}
s(md, "ensureManagerHeaderButton");
function yl(e, { fieldset: t, homeContainer: n }) {
  var m, y, b;
  const i = gi.get(e);
  if (i != null && i.rendered) {
    (m = i.bringToTop) == null || m.call(i);
    return;
  }
  const r = /* @__PURE__ */ s((...p) => {
    var C;
    const T = hd(p), E = (C = T == null ? void 0 : T.querySelector) == null ? void 0 : C.call(T, ".eidolon-light-criteria-manager-host");
    E instanceof HTMLElement && (pd(t), t.hidden = !1, E.appendChild(t));
  }, "onRender"), o = /* @__PURE__ */ s(() => {
    n instanceof HTMLElement && n.appendChild(t), t.hidden = !0, gi.delete(e), requestAnimationFrame(() => {
      var p;
      (p = e.setPosition) == null || p.call(e, { height: "auto" });
    });
  }, "onClose"), a = g("EIDOLON.LightCriteria.ManagerTitle", "Scene Criteria Lighting"), l = '<div class="eidolon-light-criteria-manager-host"></div>', c = g("EIDOLON.LightCriteria.Close", "Close"), u = (b = (y = foundry == null ? void 0 : foundry.applications) == null ? void 0 : y.api) == null ? void 0 : b.DialogV2;
  if (typeof (u == null ? void 0 : u.wait) == "function")
    try {
      let p = !1;
      const T = /* @__PURE__ */ s(() => {
        p || (p = !0, o());
      }, "closeOnce");
      gi.set(e, {
        rendered: !0,
        bringToTop: /* @__PURE__ */ s(() => {
        }, "bringToTop")
      }), u.wait({
        window: { title: a },
        content: l,
        buttons: [{ action: "close", label: c, default: !0 }],
        render: /* @__PURE__ */ s((...E) => r(...E), "render"),
        close: T,
        rejectClose: !1
      }).catch((E) => {
        console.warn("eidolon-utilities | DialogV2 manager failed, falling back to Dialog", E), T();
      });
      return;
    } catch (p) {
      console.warn("eidolon-utilities | DialogV2 manager failed, falling back to Dialog", p), o();
    }
  const d = globalThis.Dialog;
  if (typeof d != "function") return;
  const f = new d(
    {
      title: a,
      content: l,
      buttons: {
        close: {
          label: c
        }
      },
      render: /* @__PURE__ */ s((...p) => r(...p), "render"),
      close: o
    },
    {
      width: 640,
      resizable: !0
    }
  );
  gi.set(e, f), f.render(!0);
}
s(yl, "openManagerDialog");
function hd(e) {
  for (const t of e) {
    const n = st(t);
    if (n) return n;
    const i = st(t == null ? void 0 : t.element);
    if (i) return i;
  }
  return null;
}
s(hd, "findDialogRoot");
function pd(e) {
  if (!(e instanceof HTMLElement) || e.dataset.managerLayout === "true") return;
  e.dataset.managerLayout = "true", e.classList.add("is-manager");
  const t = e.querySelector("legend"), n = e.querySelector("p.notes:not(.eidolon-light-criteria__status)"), i = e.querySelector(".eidolon-light-criteria__controls"), r = e.querySelector(".eidolon-light-criteria__status"), o = e.querySelector(".eidolon-light-criteria__creation"), a = Array.from(e.querySelectorAll(".eidolon-light-criteria__warning")), l = document.createElement("div");
  l.classList.add("eidolon-light-criteria-manager");
  const c = document.createElement("section");
  c.classList.add("eidolon-light-criteria-manager__section", "is-top"), l.appendChild(c);
  const u = document.createElement("section");
  u.classList.add("eidolon-light-criteria-manager__section", "is-bottom"), l.appendChild(u);
  const d = document.createElement("div");
  if (d.classList.add("eidolon-light-criteria-manager__header"), d.textContent = g("EIDOLON.LightCriteria.ManagerHeader", "Base State"), c.appendChild(d), r && c.appendChild(r), i && c.appendChild(i), a.length) {
    const m = document.createElement("div");
    m.classList.add("eidolon-light-criteria-manager__warnings");
    for (const y of a) m.appendChild(y);
    c.appendChild(m);
  }
  const f = document.createElement("div");
  f.classList.add("eidolon-light-criteria-manager__header"), f.textContent = g("EIDOLON.LightCriteria.ManagerAuthoring", "Create or Update Mapping"), u.appendChild(f), o && u.appendChild(o), e.innerHTML = "", t && e.appendChild(t), n && e.appendChild(n), e.appendChild(l), oa(e, o);
}
s(pd, "applyManagerLayout");
function yd(e, t) {
  var i;
  const n = st(e == null ? void 0 : e.element);
  return n || (((i = t == null ? void 0 : t.closest) == null ? void 0 : i.call(t, ".application")) ?? null);
}
s(yd, "resolveApplicationRoot");
function mi(e, t, n) {
  const i = Si.get(e);
  i && (i.restoreConfig = null, i.editorMode = "create", i.editingMappingId = null), t.hidden = !0, n.setAttribute("aria-expanded", "false");
  const r = t.querySelector("p.notes");
  r instanceof HTMLElement && (r.textContent = g(
    "EIDOLON.LightCriteria.CreateDescription",
    "Assign scene criteria values to map the current configuration."
  ));
  const o = t.querySelector('button[data-action="save-mapping"]');
  o instanceof HTMLButtonElement && (o.textContent = g("EIDOLON.LightCriteria.SaveMapping", "Save Mapping")), oa(e, t), requestAnimationFrame(() => {
    var a, l;
    (l = (a = i == null ? void 0 : i.app) == null ? void 0 : a.setPosition) == null || l.call(a, { height: "auto" });
  });
}
s(mi, "hideCreationSection");
function Nt(e, t) {
  if (!e) return;
  const n = !!(t != null && t.base), i = Array.isArray(t == null ? void 0 : t.mappings) ? t.mappings.length : 0, r = [];
  r.push(
    n ? g(
      "EIDOLON.LightCriteria.StatusBaseSaved",
      "Base lighting saved."
    ) : g(
      "EIDOLON.LightCriteria.StatusBaseMissing",
      "Base lighting not yet saved."
    )
  ), r.push(
    g(
      "EIDOLON.LightCriteria.StatusMappingCount",
      "Mappings: {count}"
    ).replace("{count}", String(i))
  ), e.textContent = r.join(" ");
}
s(Nt, "updateStatusLine");
function Tn(e, { state: t, hasCategories: n }) {
  if (!e) return;
  const i = !!(t != null && t.base), r = i && n;
  e.disabled = !r, e.title = r ? "" : i ? g(
    "EIDOLON.LightCriteria.CreateDisabledNoCategories",
    "Add scene criteria with values before creating mappings."
  ) : g(
    "EIDOLON.LightCriteria.CreateDisabledNoBase",
    "Save a base lighting state before creating criteria mappings."
  );
}
s(Tn, "updateCreateButtonState");
function Ii(e, t) {
  var c, u, d;
  const n = t ?? bl(e);
  if (!n)
    throw new Error("Ambient light document unavailable.");
  const i = Jt(((c = n.toObject) == null ? void 0 : c.call(n)) ?? {});
  if (!i)
    throw new Error("Unable to duplicate ambient light data.");
  const r = (e == null ? void 0 : e.form) instanceof HTMLFormElement ? e.form : null, o = r ? tc(r) : {}, a = foundry.utils.mergeObject(i, o, {
    inplace: !1,
    performDeletions: !0
  });
  r && (r.querySelectorAll("color-picker[name]").forEach((f) => {
    var E, C;
    const m = f.getAttribute("name");
    if (!m) return;
    const y = typeof f.value == "string" ? f.value : "", b = ((E = f.ui) == null ? void 0 : E.input) ?? ((C = f.querySelector) == null ? void 0 : C.call(f, 'input[type="color"]')), p = (b == null ? void 0 : b.value) ?? "", T = y || p;
    typeof T != "string" || !T || (foundry.utils.setProperty(a, m, T), S("LightCriteria | Captured color-picker value", {
      path: m,
      pickerValue: y,
      swatchValue: p,
      chosenValue: T
    }));
  }), r.querySelectorAll("range-picker[name]").forEach((f) => {
    var _, F;
    const m = f.getAttribute("name");
    if (!m) return;
    const y = f.value !== void 0 && f.value !== null ? String(f.value) : "", b = (_ = f.querySelector) == null ? void 0 : _.call(f, 'input[type="range"]'), p = (F = f.querySelector) == null ? void 0 : F.call(f, 'input[type="number"]'), T = b instanceof HTMLInputElement ? b.value : "", E = p instanceof HTMLInputElement ? p.value : "", C = y || E || T;
    if (typeof C != "string" || !C.length) return;
    const I = Number(C), D = Number.isFinite(I) ? I : C;
    foundry.utils.setProperty(a, m, D), S("LightCriteria | Captured range-picker value", {
      path: m,
      elementValue: y,
      numberValue: E,
      rangeValue: T,
      chosenValue: D
    });
  }));
  const l = Jt(a);
  return S("LightCriteria | Captured form config", {
    lightId: (n == null ? void 0 : n.id) ?? null,
    hasColor: !!((u = l == null ? void 0 : l.config) != null && u.color),
    color: ((d = l == null ? void 0 : l.config) == null ? void 0 : d.color) ?? null
  }), l;
}
s(Ii, "captureAmbientLightFormConfig");
function vi(e, t, n) {
  if (!n || typeof n != "object") return;
  const i = foundry.utils.flattenObject(n, { safe: !0 });
  for (const [r, o] of Object.entries(i)) {
    const a = t.querySelectorAll(`[name="${r}"]`);
    if (a.length) {
      S("LightCriteria | Applying field", {
        path: r,
        value: o,
        elementCount: a.length
      });
      for (const l of a)
        l instanceof HTMLElement && l.tagName === "COLOR-PICKER" ? Td(l, o) : l instanceof HTMLElement && l.tagName === "RANGE-PICKER" ? Ed(l, o) : l instanceof HTMLInputElement ? bd(l, o) : l instanceof HTMLSelectElement ? Cd(l, o) : l instanceof HTMLTextAreaElement && Ld(l, o);
    }
  }
  requestAnimationFrame(() => {
    var r;
    return (r = e._previewChanges) == null ? void 0 : r.call(e);
  });
}
s(vi, "applyConfigToForm");
function bd(e, t, n) {
  const i = e.type;
  if (i === "checkbox") {
    const a = !!t;
    e.checked !== a && (e.checked = a, Ue(e));
    return;
  }
  if (i === "radio") {
    const a = t == null ? "" : String(t), l = e.value === a;
    e.checked !== l && (e.checked = l, l && Ue(e));
    return;
  }
  const r = t == null ? "" : String(t);
  let o = !1;
  e.value !== r && (e.value = r, o = !0), o && Ue(e);
}
s(bd, "applyValueToInput");
function Td(e, t, n) {
  var l, c, u, d, f, m;
  const i = t == null ? "" : String(t);
  let r = !1;
  e.value !== i && (e.value = i, e.setAttribute("value", i), (l = e.ui) != null && l.setValue && e.ui.setValue(i), r = !0);
  const o = ((c = e.ui) == null ? void 0 : c.input) ?? ((u = e.querySelector) == null ? void 0 : u.call(e, 'input[type="color"]'));
  o instanceof HTMLInputElement && o.value !== i && (o.value = i, Ue(o));
  const a = ((d = e.ui) == null ? void 0 : d.text) ?? ((f = e.querySelector) == null ? void 0 : f.call(e, 'input[type="text"]'));
  a instanceof HTMLInputElement && a.value !== i && (a.value = i, Ue(a)), (m = e.ui) != null && m.commit ? e.ui.commit() : (e.dispatchEvent(new Event("input", { bubbles: !0, cancelable: !0 })), e.dispatchEvent(new Event("change", { bubbles: !0, cancelable: !0 }))), S("LightCriteria | Color picker applied", {
    value: i,
    pickerValue: e.value ?? null,
    swatchValue: (o == null ? void 0 : o.value) ?? null,
    textValue: (a == null ? void 0 : a.value) ?? null
  }), r && Ue(e);
}
s(Td, "applyValueToColorPicker");
function Ed(e, t, n) {
  var u, d;
  const i = t == null ? "" : String(t), r = Number(i), o = Number.isFinite(r) ? r : i;
  let a = !1;
  e.value !== void 0 && e.value !== o && (e.value = o, a = !0), e.getAttribute("value") !== i && (e.setAttribute("value", i), a = !0);
  const l = (u = e.querySelector) == null ? void 0 : u.call(e, 'input[type="range"]');
  l instanceof HTMLInputElement && l.value !== i && (l.value = i, Ue(l));
  const c = (d = e.querySelector) == null ? void 0 : d.call(e, 'input[type="number"]');
  if (c instanceof HTMLInputElement && c.value !== i && (c.value = i, Ue(c)), typeof e.commit == "function")
    try {
      e.commit();
    } catch (f) {
      console.error("eidolon-utilities | range-picker commit failed", f);
    }
  S("LightCriteria | Range picker applied", {
    value: i,
    resolvedValue: o,
    rangeValue: (l == null ? void 0 : l.value) ?? null,
    numberValue: (c == null ? void 0 : c.value) ?? null
  }), a && Ue(e);
}
s(Ed, "applyValueToRangePicker");
function Cd(e, t, n) {
  const i = t == null ? "" : String(t);
  e.value !== i && (e.value = i, Ue(e));
}
s(Cd, "applyValueToSelect");
function Ld(e, t, n) {
  const i = t == null ? "" : String(t);
  e.value !== i && (e.value = i, Ue(e));
}
s(Ld, "applyValueToTextarea");
function Ue(e) {
  e.dispatchEvent(new Event("input", { bubbles: !0, cancelable: !0 })), e.dispatchEvent(new Event("change", { bubbles: !0, cancelable: !0 }));
}
s(Ue, "triggerInputChange");
function Wr({
  mappingSelect: e,
  applyMappingButton: t,
  updateMappingButton: n,
  editCriteriaButton: i,
  removeMappingButton: r,
  actionsMenu: o,
  state: a
}) {
  const l = (e == null ? void 0 : e.value) ?? "", c = !!(a != null && a.base), u = l && l !== le ? !!On(a, l) : !1;
  if (t instanceof HTMLButtonElement && (l ? l === le ? t.disabled = !c : t.disabled = !u : t.disabled = !0), n instanceof HTMLButtonElement && (l ? l === le ? n.disabled = !1 : n.disabled = !u : n.disabled = !0), i instanceof HTMLButtonElement && (i.disabled = !l || l === le || !u), r instanceof HTMLButtonElement && (r.disabled = !l || l === le || !u), o instanceof HTMLElement) {
    const d = n instanceof HTMLButtonElement && !n.disabled || i instanceof HTMLButtonElement && !i.disabled || r instanceof HTMLButtonElement && !r.disabled;
    o.classList.toggle("is-disabled", !d), !d && "open" in o && (o.open = !1);
  }
}
s(Wr, "syncMappingSwitcherState");
function wd(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e) {
    if (!n) continue;
    const i = typeof n.id == "string" ? n.id : null;
    if (!i) continue;
    const r = typeof n.name == "string" && n.name.trim() ? n.name.trim() : g("EIDOLON.LightCriteria.UnnamedCategory", "Unnamed Category");
    t.has(i) || t.set(i, r);
  }
  return t;
}
s(wd, "buildCategoryNameLookup");
function Sd(e) {
  const t = {};
  return e instanceof HTMLElement && e.querySelectorAll("select[data-filter-category-id]").forEach((n) => {
    var o, a;
    const i = n.dataset.filterCategoryId, r = (a = (o = n.value) == null ? void 0 : o.trim) == null ? void 0 : a.call(o);
    !i || !r || (t[i] = r);
  }), t;
}
s(Sd, "readMappingFilterSelections");
function Id(e) {
  e instanceof HTMLElement && e.querySelectorAll("select[data-filter-category-id]").forEach((t) => {
    t.value = "";
  });
}
s(Id, "resetMappingFilterSelections");
function vd(e, t) {
  const n = Array.isArray(e) ? e : [], i = Object.entries(t ?? {}).filter(([, r]) => !!r);
  return i.length ? n.filter((r) => {
    if (!r || typeof r != "object") return !1;
    const o = r.categories ?? {};
    for (const [a, l] of i)
      if ((o == null ? void 0 : o[a]) !== l) return !1;
    return !0;
  }) : n.slice();
}
s(vd, "filterMappingsByCriteria");
function Od(e, { totalCount: t = 0, visibleCount: n = 0, hasFilters: i = !1, activeFilterCount: r = 0 } = {}) {
  if (!(e instanceof HTMLElement)) return;
  if (!i) {
    e.textContent = g(
      "EIDOLON.LightCriteria.FilterSummaryAll",
      "All ({count})"
    ).replace("{count}", String(t));
    return;
  }
  const o = g(
    "EIDOLON.LightCriteria.FilterSummaryActive",
    "{active} filters · {visible}/{total}"
  ).replace("{active}", String(r)).replace("{visible}", String(n)).replace("{total}", String(t));
  e.textContent = o;
}
s(Od, "updateMappingFilterMeta");
function Md(e, t, n, i, r = {}) {
  if (!(e instanceof HTMLSelectElement)) return;
  const o = typeof i == "string" ? i : "", a = !!(t != null && t.base), l = Array.isArray(r == null ? void 0 : r.categoryOrder) ? r.categoryOrder : [], c = Array.isArray(r == null ? void 0 : r.mappings) ? r.mappings.slice() : Array.isArray(t == null ? void 0 : t.mappings) ? t.mappings.slice() : [], u = e.value;
  e.innerHTML = "";
  const d = document.createElement("option");
  d.value = "", d.textContent = g(
    "EIDOLON.LightCriteria.SelectPlaceholder",
    "Select a mapping"
  ), d.disabled = a, e.appendChild(d);
  const f = document.createElement("option");
  f.value = le, f.textContent = g(
    "EIDOLON.LightCriteria.BaseOption",
    "Base Lighting"
  ), f.disabled = !a, e.appendChild(f), c.slice().sort((p, T) => {
    var I;
    const E = sn(p, n, l), C = sn(T, n, l);
    return E.localeCompare(C, ((I = game.i18n) == null ? void 0 : I.lang) ?? void 0, {
      sensitivity: "base"
    });
  }).forEach((p) => {
    if (!(p != null && p.id)) return;
    const T = document.createElement("option");
    T.value = p.id, T.textContent = sn(p, n, l), e.appendChild(T);
  });
  const m = new Set(
    Array.from(e.options).filter((p) => !p.disabled).map((p) => p.value)
  ), y = a && u === "" ? "" : u, b = o || (m.has(y) ? y : "");
  b && m.has(b) ? e.value = b : a ? e.value = le : e.value = "";
}
s(Md, "populateMappingSelector");
function sn(e, t, n = []) {
  if (!e || typeof e != "object")
    return g("EIDOLON.LightCriteria.UnnamedMapping", "Unnamed Mapping");
  if (typeof e.label == "string" && e.label.trim())
    return e.label.trim();
  const i = e.categories ?? {}, r = [], o = /* @__PURE__ */ new Set();
  for (const l of n)
    !l || o.has(l) || (r.push(l), o.add(l));
  for (const l of Object.keys(i).sort((c, u) => c.localeCompare(u)))
    o.has(l) || (r.push(l), o.add(l));
  const a = r.map((l) => {
    const c = i == null ? void 0 : i[l];
    if (typeof c != "string" || !c.trim()) return null;
    const u = c.trim();
    return `${t.get(l) ?? g("EIDOLON.LightCriteria.UnnamedCategory", "Unnamed Category")}=${u}`;
  }).filter(Boolean);
  return a.length === 0 ? g("EIDOLON.LightCriteria.UnnamedMapping", "Unnamed Mapping") : a.join(" | ");
}
s(sn, "formatMappingOptionLabel");
function Po(e, t) {
  if (!e || typeof e != "object" || !Array.isArray(e.mappings)) return null;
  const n = gn(t);
  if (!n) return null;
  const i = e.mappings.find((r) => (r == null ? void 0 : r.key) === n);
  return (i == null ? void 0 : i.id) ?? null;
}
s(Po, "findMappingIdByCategories");
function On(e, t) {
  return !t || !e || typeof e != "object" || !Array.isArray(e.mappings) ? null : e.mappings.find((n) => (n == null ? void 0 : n.id) === t) ?? null;
}
s(On, "getMappingById");
function Ad(e) {
  if (!e || typeof e != "object") return "";
  const t = e.current;
  if (t != null && t.mappingId) {
    if (t.mappingId === le)
      return e != null && e.base ? le : "";
    if (Array.isArray(e.mappings) && e.mappings.some((n) => n.id === t.mappingId))
      return t.mappingId;
  }
  if (t != null && t.categories) {
    const n = Po(e, t.categories);
    if (n) return n;
  }
  return "";
}
s(Ad, "resolveInitialMappingSelection");
function za(e, t = {}) {
  var a, l, c, u;
  if (!(e instanceof HTMLFormElement)) return;
  const n = e.querySelector('color-picker[name="config.color"]'), i = (n == null ? void 0 : n.value) ?? null, r = ((a = n == null ? void 0 : n.ui) == null ? void 0 : a.text) ?? ((l = n == null ? void 0 : n.querySelector) == null ? void 0 : l.call(n, 'input[type="text"]')), o = ((c = n == null ? void 0 : n.ui) == null ? void 0 : c.input) ?? ((u = n == null ? void 0 : n.querySelector) == null ? void 0 : u.call(n, 'input[type="color"]'));
  S("LightCriteria | Color state after apply", {
    ...t,
    textValue: (r == null ? void 0 : r.value) ?? null,
    pickerValue: i,
    swatchValue: (o == null ? void 0 : o.value) ?? null
  });
}
s(za, "logAppliedColorState");
function Nd(e) {
  e.querySelectorAll("select[data-category-id]").forEach((t) => {
    t.value = "";
  });
}
s(Nd, "resetCategorySelections");
function _d(e, t) {
  const n = t && typeof t == "object" ? t : {};
  e.querySelectorAll("select[data-category-id]").forEach((i) => {
    const r = i.dataset.categoryId;
    if (!r) return;
    const o = n[r];
    i.value = typeof o == "string" ? o : "";
  });
}
s(_d, "setCategorySelections");
function Fd(e) {
  const t = {};
  return e.querySelectorAll("select[data-category-id]").forEach((n) => {
    var o, a;
    const i = n.dataset.categoryId, r = (a = (o = n.value) == null ? void 0 : o.trim) == null ? void 0 : a.call(o);
    !i || !r || (t[i] = r);
  }), Object.keys(t).length > 0 ? t : null;
}
s(Fd, "readCategorySelections");
async function Kr(e, t, n) {
  if (!e) return null;
  try {
    if (!n)
      return await vn(e, {});
    if (n === le)
      return await vn(e, {
        mappingId: le,
        categories: null,
        updatedAt: Date.now()
      });
    const i = On(t, n);
    return i ? await vn(e, {
      mappingId: i.id,
      categories: i.categories,
      updatedAt: Date.now()
    }) : null;
  } catch (i) {
    return console.warn("eidolon-utilities | Failed to persist mapping selection", i), null;
  }
}
s(Kr, "persistCurrentSelection");
function oa(e, t) {
  if (!(e instanceof HTMLElement)) return;
  const n = e.querySelector(".eidolon-light-criteria-manager__section.is-bottom");
  n instanceof HTMLElement && (n.hidden = !!(t != null && t.hidden));
}
s(oa, "updateManagerSectionVisibility");
function _t({ switcher: e, emptyState: t, state: n }) {
  const i = !!(n != null && n.base);
  e instanceof HTMLElement && (e.hidden = !i), t instanceof HTMLElement && (t.hidden = i);
}
s(_t, "updateActiveMappingVisibility");
function bl(e) {
  const t = (e == null ? void 0 : e.object) ?? (e == null ? void 0 : e.document) ?? null;
  return !(t != null && t.isEmbedded) || t.documentName !== "AmbientLight" ? null : t;
}
s(bl, "getAmbientLightDocument");
function Dd(e) {
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
s(Dd, "getPersistedAmbientLightDocument");
function kd() {
  cd();
}
s(kd, "registerLightCriteriaHooks");
kd();
const Bo = /* @__PURE__ */ new Map();
let qo = !1;
function aa(e, t) {
  Bo.has(e) && console.warn(`[${L}] Socket handler for type "${e}" already registered, overwriting.`), Bo.set(e, t);
}
s(aa, "registerSocketHandler");
function Oi(e, t) {
  if (!qo) {
    console.error(`[${L}] Socket not initialized. Call initializeSocket() first.`);
    return;
  }
  game.socket.emit(`module.${L}`, { type: e, payload: t });
}
s(Oi, "emitSocket");
function xd() {
  qo || (game.socket.on(`module.${L}`, (e) => {
    const { type: t, payload: n } = e ?? {}, i = Bo.get(t);
    i ? i(n) : console.warn(`[${L}] No socket handler for type "${t}"`);
  }), qo = !0, console.log(`[${L}] Socket initialized on channel module.${L}`));
}
s(xd, "initializeSocket");
const Tl = "tween", El = "tween-sequence", Uo = "tween-sequence-cancel", ye = Object.freeze({
  ABORT: "abort",
  CONTINUE: "continue"
}), En = Object.freeze({
  COMPLETED: "completed",
  CANCELLED: "cancelled",
  FAILED: "failed"
}), gt = Object.freeze({
  BEFORE_ALL: "beforeAll",
  BEFORE_STEP: "before",
  ENTRY: "entry",
  AFTER_STEP: "after",
  RUNTIME: "runtime",
  VALIDATION: "validation"
}), zi = /* @__PURE__ */ new Map();
function ei({ type: e, execute: t, validate: n }) {
  zi.has(e) && console.warn(`[tween-registry] Type "${e}" already registered, overwriting.`), zi.set(e, { type: e, execute: t, validate: n ?? (() => {
  }) });
}
s(ei, "registerTweenType");
function Fr(e) {
  return zi.get(e);
}
s(Fr, "getTweenType");
function Rd(e, t = {}) {
  const n = Fr(e);
  if (!n)
    throw new Error(`Unknown tween type: "${e}".`);
  return n.validate(t ?? {}), n;
}
s(Rd, "validateTweenEntry");
function jo() {
  return [...zi.keys()];
}
s(jo, "listTweenTypes");
function Dr(e) {
  const t = foundry.canvas.animation.CanvasAnimation;
  return {
    linear: t.easeLinear,
    easeInOutCosine: t.easeInOutCosine
  }[e] ?? t.easeInOutCosine;
}
s(Dr, "resolveEasing");
function Gi(e) {
  return e <= 0.04045 ? e / 12.92 : ((e + 0.055) / 1.055) ** 2.4;
}
s(Gi, "srgbToLinear");
function ln(e) {
  return e <= 31308e-7 ? 12.92 * e : 1.055 * e ** (1 / 2.4) - 0.055;
}
s(ln, "linearToSrgb");
function Ga(e, t, n) {
  const i = 0.4122214708 * e + 0.5363325363 * t + 0.0514459929 * n, r = 0.2119034982 * e + 0.6806995451 * t + 0.1073969566 * n, o = 0.0883024619 * e + 0.2817188376 * t + 0.6299787005 * n, a = Math.cbrt(i), l = Math.cbrt(r), c = Math.cbrt(o);
  return [
    0.2104542553 * a + 0.793617785 * l - 0.0040720468 * c,
    1.9779984951 * a - 2.428592205 * l + 0.4505937099 * c,
    0.0259040371 * a + 0.7827717662 * l - 0.808675766 * c
  ];
}
s(Ga, "linearRgbToOklab");
function $d(e, t, n) {
  const i = (e + 0.3963377774 * t + 0.2158037573 * n) ** 3, r = (e - 0.1055613458 * t - 0.0638541728 * n) ** 3, o = (e - 0.0894841775 * t - 1.291485548 * n) ** 3;
  return [
    4.0767416621 * i - 3.3077115913 * r + 0.2309699292 * o,
    -1.2684380046 * i + 2.6097574011 * r - 0.3413193965 * o,
    -0.0041960863 * i - 0.7034186147 * r + 1.707614701 * o
  ];
}
s($d, "oklabToLinearRgb");
function Wi(e) {
  return [e.r, e.g, e.b];
}
s(Wi, "colorToRgb");
function Cl(e, t, n) {
  const i = /* @__PURE__ */ s((o) => Math.max(0, Math.min(1, o)), "clamp"), r = /* @__PURE__ */ s((o) => Math.round(i(o) * 255).toString(16).padStart(2, "0"), "toHex");
  return `#${r(e)}${r(t)}${r(n)}`;
}
s(Cl, "rgbToHex");
function Hd(e, t, n) {
  if (n <= 0) return e.toHTML();
  if (n >= 1) return t.toHTML();
  const i = foundry.utils.Color, [r, o, a] = e.hsl, [l, c, u] = t.hsl, d = (l - r + 0.5) % 1 - 0.5, f = (r + d * n + 1) % 1, m = o + (c - o) * n, y = a + (u - a) * n;
  return i.fromHSL([f, m, y]).toHTML();
}
s(Hd, "interpolateHsl");
function Pd(e, t, n) {
  if (n <= 0) return e.toHTML();
  if (n >= 1) return t.toHTML();
  const [i, r, o] = Wi(e).map(Gi), [a, l, c] = Wi(t).map(Gi), u = ln(i + (a - i) * n), d = ln(r + (l - r) * n), f = ln(o + (c - o) * n);
  return Cl(u, d, f);
}
s(Pd, "interpolateRgb");
function Bd(e, t, n) {
  if (n <= 0) return e.toHTML();
  if (n >= 1) return t.toHTML();
  const [i, r, o] = Wi(e).map(Gi), [a, l, c] = Wi(t).map(Gi), [u, d, f] = Ga(i, r, o), [m, y, b] = Ga(a, l, c), p = 0.02, T = Math.sqrt(d * d + f * f), E = Math.sqrt(y * y + b * b);
  let C, I, D;
  if (T < p || E < p)
    C = u + (m - u) * n, I = d + (y - d) * n, D = f + (b - f) * n;
  else {
    const W = Math.atan2(f, d);
    let H = Math.atan2(b, y) - W;
    H > Math.PI && (H -= 2 * Math.PI), H < -Math.PI && (H += 2 * Math.PI), C = u + (m - u) * n;
    const Q = T + (E - T) * n, A = W + H * n;
    I = Q * Math.cos(A), D = Q * Math.sin(A);
  }
  const [_, F, x] = $d(C, I, D);
  return Cl(ln(_), ln(F), ln(x));
}
s(Bd, "interpolateOklch");
const Vo = {
  hsl: Hd,
  rgb: Pd,
  oklch: Bd
};
function qd(e = "hsl") {
  return Vo[e] ?? Vo.hsl;
}
s(qd, "getInterpolator");
function Wa() {
  return Object.keys(Vo);
}
s(Wa, "listInterpolationModes");
function Ud(e) {
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
  if (e.mode && !Wa().includes(e.mode))
    throw new Error(
      `light-color tween: unknown mode "${e.mode}". Available: ${Wa().join(", ")}`
    );
}
s(Ud, "validate$4");
async function jd(e, t = {}) {
  const { CanvasAnimation: n } = foundry.canvas.animation, { Color: i } = foundry.utils, { uuid: r, toColor: o, toAlpha: a, mode: l = "oklch" } = e, c = Array.isArray(r) ? r : [r];
  if (c.length === 0)
    return console.warn("light-color tween: empty uuid array, nothing to animate."), !0;
  const {
    durationMS: u = 2e3,
    easing: d = "easeInOutCosine",
    commit: f = !0,
    startEpochMS: m = null,
    signal: y = null
  } = t, b = Dr(d), p = o != null, T = a != null, E = p ? qd(l) : null, C = p ? i.fromString(o) : null;
  if (p && !C.valid) throw new Error(`light-color tween: invalid target color "${o}".`);
  async function I(_) {
    var j, $;
    if (y != null && y.aborted) return !1;
    const F = await fromUuid(_);
    if (!F) return !1;
    const x = F.object;
    if (!x) return !1;
    let W;
    if (p) {
      const P = (j = F.config) == null ? void 0 : j.color;
      P != null && P.valid || console.warn(`light-color tween: source color invalid on ${_}, using white.`), W = P != null && P.valid ? P : i.fromString("#ffffff");
    }
    const te = T ? (($ = F._source.config) == null ? void 0 : $.alpha) ?? 0.5 : null, H = { t: 0 }, Q = `ambient-hue-tween:${_}`;
    n.terminateAnimation(Q), y && y.addEventListener("abort", () => {
      n.terminateAnimation(Q);
    }, { once: !0 });
    const A = typeof m == "number" ? Math.max(0, Math.min(u, Date.now() - m)) : 0, U = /* @__PURE__ */ s((P) => {
      const Y = {};
      p && (Y.color = E(W, C, P)), T && (Y.alpha = te + (a - te) * P), F.updateSource({ config: Y }), x.initializeLightSource();
    }, "applyFrame");
    A > 0 && (H.t = A / u, U(H.t));
    const G = await n.animate(
      [{ parent: H, attribute: "t", to: 1 }],
      {
        name: Q,
        duration: u,
        easing: b,
        time: A,
        ontick: /* @__PURE__ */ s(() => U(H.t), "ontick")
      }
    );
    if (G !== !1) {
      if (y != null && y.aborted) return !1;
      const P = {};
      p && (P.color = C.toHTML()), T && (P.alpha = a), F.updateSource({ config: P }), x.initializeLightSource();
    }
    if (f && G !== !1 && F.canUserModify(game.user, "update")) {
      if (y != null && y.aborted) return !1;
      const P = {}, Y = {};
      p && (P.color = W.toHTML(), Y["config.color"] = C.toHTML()), T && (P.alpha = te, Y["config.alpha"] = a), F.updateSource({ config: P }), await F.update(Y);
    }
    return G !== !1;
  }
  return s(I, "animateOne"), (await Promise.all(c.map(I))).every(Boolean);
}
s(jd, "execute$4");
function Vd() {
  ei({ type: "light-color", execute: jd, validate: Ud });
}
s(Vd, "registerLightColorTween");
const mt = /* @__PURE__ */ new WeakMap();
function zd(e) {
  if ((Array.isArray(e.uuid) ? e.uuid : [e.uuid]).some((n) => !n || typeof n != "string"))
    throw new Error("light-state tween: 'uuid' is required (string or array of AmbientLight document UUIDs).");
  if (typeof e.enabled != "boolean")
    throw new Error("light-state tween: 'enabled' (boolean) is required.");
}
s(zd, "validate$3");
async function Gd(e, t = {}) {
  const { CanvasAnimation: n } = foundry.canvas.animation, { uuid: i, enabled: r } = e, o = Array.isArray(i) ? i : [i];
  if (o.length === 0)
    return console.warn("light-state tween: empty uuid array, nothing to animate."), !0;
  const {
    durationMS: a = 2e3,
    easing: l = "easeInOutCosine",
    commit: c = !0,
    startEpochMS: u = null,
    signal: d = null
  } = t, f = Dr(l);
  async function m(b) {
    var F, x, W, te;
    if (d != null && d.aborted) return !1;
    const p = await fromUuid(b);
    if (!p) return !1;
    const T = p.object;
    if (!T) return !1;
    const E = `ambient-state-tween:${b}`;
    n.terminateAnimation(E), d && d.addEventListener("abort", () => {
      n.terminateAnimation(E);
    }, { once: !0 });
    const C = mt.get(p) ?? {
      hidden: p._source.hidden,
      alpha: ((F = p._source.config) == null ? void 0 : F.alpha) ?? 0.5
    };
    if (mt.set(p, C), S(`light-state START ${r ? "ON" : "OFF"} | snap: ${JSON.stringify(C)} | _source.hidden=${p._source.hidden}, _source.config.alpha=${(x = p._source.config) == null ? void 0 : x.alpha}`), r && !C.hidden || !r && C.hidden)
      return mt.delete(p), !0;
    const I = C.alpha, D = typeof u == "number" ? Math.max(0, Math.min(a, Date.now() - u)) : 0, _ = /* @__PURE__ */ s((H) => {
      p.updateSource({ config: { alpha: H } }), T.initializeLightSource();
    }, "applyAlpha");
    if (r) {
      p.updateSource({ hidden: !1, config: { alpha: 0 } }), T.initializeLightSource(), canvas.perception.update({ refreshLighting: !0, refreshVision: !0 });
      const H = { t: 0 };
      D > 0 && (H.t = D / a, _(I * H.t));
      const Q = await n.animate(
        [{ parent: H, attribute: "t", to: 1 }],
        {
          name: E,
          duration: a,
          easing: f,
          time: D,
          ontick: /* @__PURE__ */ s(() => _(I * H.t), "ontick")
        }
      );
      return Q !== !1 && !(d != null && d.aborted) && c && p.canUserModify(game.user, "update") ? (p.updateSource({ hidden: !0, config: { alpha: I } }), await p.update({ hidden: !1 }), S(`light-state FADE-IN committed. _source.hidden=${p._source.hidden}, _source.config.alpha=${(W = p._source.config) == null ? void 0 : W.alpha}`), mt.delete(p)) : Q === !1 || mt.delete(p), Q !== !1;
    } else {
      p.updateSource({ hidden: !1, config: { alpha: C.alpha } }), T.initializeLightSource();
      const H = { t: 0 };
      D > 0 && (H.t = D / a, _(I * (1 - H.t)));
      const Q = await n.animate(
        [{ parent: H, attribute: "t", to: 1 }],
        {
          name: E,
          duration: a,
          easing: f,
          time: D,
          ontick: /* @__PURE__ */ s(() => _(I * (1 - H.t)), "ontick")
        }
      );
      return Q !== !1 && !(d != null && d.aborted) && c && p.canUserModify(game.user, "update") ? (await p.update({ hidden: !0 }), p.updateSource({ config: { alpha: I } }), T.initializeLightSource(), S(`light-state FADE-OUT committed+restored. _source.hidden=${p._source.hidden}, _source.config.alpha=${(te = p._source.config) == null ? void 0 : te.alpha}`), mt.delete(p)) : Q === !1 || (p.updateSource({ hidden: !0, config: { alpha: I } }), T.initializeLightSource(), mt.delete(p)), Q !== !1;
    }
  }
  return s(m, "animateOne"), (await Promise.all(o.map(m))).every(Boolean);
}
s(Gd, "execute$3");
function Wd() {
  ei({ type: "light-state", execute: Gd, validate: zd });
}
s(Wd, "registerLightStateTween");
function Kd(e) {
  if ((Array.isArray(e.uuid) ? e.uuid : [e.uuid]).some((n) => !n || typeof n != "string"))
    throw new Error("tile-prop tween: 'uuid' is required (string or array of Tile document UUIDs).");
  if (!e.attribute || typeof e.attribute != "string")
    throw new Error("tile-prop tween: 'attribute' (string) is required — dot-path to a numeric property (e.g. 'alpha', 'rotation').");
  if (typeof e.value != "number")
    throw new Error("tile-prop tween: 'value' (number) is required — the target value to animate to.");
}
s(Kd, "validate$2");
async function Jd(e, t = {}) {
  const { CanvasAnimation: n } = foundry.canvas.animation, { uuid: i, attribute: r, value: o } = e, a = Array.isArray(i) ? i : [i];
  if (a.length === 0)
    return console.warn("tile-prop tween: empty uuid array, nothing to animate."), !0;
  const {
    durationMS: l = 2e3,
    easing: c = "easeInOutCosine",
    commit: u = !0,
    startEpochMS: d = null,
    signal: f = null
  } = t, m = Dr(c);
  async function y(p) {
    if (f != null && f.aborted) return !1;
    const T = await fromUuid(p);
    if (!T) return !1;
    const E = T.object;
    if (!E) return !1;
    const C = foundry.utils.getProperty(T._source, r);
    if (typeof C != "number")
      return console.warn(`tile-prop tween: source value at '${r}' on ${p} is not a number (got ${typeof C}). Skipping.`), !1;
    const I = `tile-prop-tween:${r}:${p}`;
    n.terminateAnimation(I), f && f.addEventListener("abort", () => {
      n.terminateAnimation(I);
    }, { once: !0 });
    const D = typeof d == "number" ? Math.max(0, Math.min(l, Date.now() - d)) : 0, _ = /* @__PURE__ */ s((W) => {
      const te = C + (o - C) * W;
      T.updateSource(foundry.utils.expandObject({ [r]: te })), E.refresh();
    }, "applyFrame"), F = { t: 0 };
    D > 0 && (F.t = D / l, _(F.t));
    const x = await n.animate(
      [{ parent: F, attribute: "t", to: 1 }],
      {
        name: I,
        duration: l,
        easing: m,
        time: D,
        ontick: /* @__PURE__ */ s(() => _(F.t), "ontick")
      }
    );
    if (x !== !1) {
      if (f != null && f.aborted) return !1;
      T.updateSource(foundry.utils.expandObject({ [r]: o })), E.refresh();
    }
    if (u && x !== !1 && T.canUserModify(game.user, "update")) {
      if (f != null && f.aborted) return !1;
      T.updateSource(foundry.utils.expandObject({ [r]: C })), await T.update({ [r]: o });
    }
    return x !== !1;
  }
  return s(y, "animateOne"), (await Promise.all(a.map(y))).every(Boolean);
}
s(Jd, "execute$2");
function Yd() {
  ei({ type: "tile-prop", execute: Jd, validate: Kd });
}
s(Yd, "registerTilePropTween");
function Qd(e) {
  if (!e.attribute || typeof e.attribute != "string")
    throw new Error("particles-prop tween: 'attribute' (string) is required — property name on canvas.particleeffects (e.g. 'alpha').");
  if (typeof e.value != "number")
    throw new Error("particles-prop tween: 'value' (number) is required — the target value to animate to.");
}
s(Qd, "validate$1");
async function Xd(e, t = {}) {
  const { CanvasAnimation: n } = foundry.canvas.animation, { attribute: i, value: r } = e, {
    durationMS: o = 2e3,
    easing: a = "easeInOutCosine",
    startEpochMS: l = null,
    signal: c = null
  } = t, u = canvas.particleeffects;
  if (!u)
    return console.warn("particles-prop tween: canvas.particleeffects not available."), !1;
  const d = u[i];
  if (typeof d != "number")
    return console.warn(`particles-prop tween: current value of '${i}' is not a number (got ${typeof d}). Skipping.`), !1;
  const f = Dr(a), m = `particles-prop-tween:${i}`;
  n.terminateAnimation(m), c && c.addEventListener("abort", () => {
    n.terminateAnimation(m);
  }, { once: !0 });
  const y = typeof l == "number" ? Math.max(0, Math.min(o, Date.now() - l)) : 0, b = /* @__PURE__ */ s((E) => {
    u[i] = d + (r - d) * E;
  }, "applyFrame"), p = { t: 0 };
  y > 0 && (p.t = y / o, b(p.t));
  const T = await n.animate(
    [{ parent: p, attribute: "t", to: 1 }],
    {
      name: m,
      duration: o,
      easing: f,
      time: y,
      ontick: /* @__PURE__ */ s(() => b(p.t), "ontick")
    }
  );
  if (T !== !1) {
    if (c != null && c.aborted) return !1;
    u[i] = r;
  }
  return T !== !1;
}
s(Xd, "execute$1");
function Zd() {
  ei({ type: "particles-prop", execute: Xd, validate: Qd });
}
s(Zd, "registerParticlesPropTween");
var bt, Rn, $n, Hn, Pn, Bn, un;
const ga = class ga {
  /**
   * @param {AbortController} controller
   */
  constructor(t) {
    M(this, bt);
    M(this, Rn);
    M(this, $n);
    M(this, Hn);
    M(this, Pn);
    M(this, Bn, !1);
    M(this, un, null);
    O(this, bt, t), O(this, Hn, new Promise((n) => {
      O(this, Rn, n);
    })), O(this, Pn, new Promise((n) => {
      O(this, $n, n);
    }));
  }
  /** @returns {Promise<boolean>} Resolves true (completed) or false (cancelled/failed). */
  get finished() {
    return h(this, Hn);
  }
  /** @returns {Promise<{status: string, [k: string]: unknown}>} */
  get result() {
    return h(this, Pn);
  }
  /** @returns {boolean} */
  get cancelled() {
    return h(this, bt).signal.aborted;
  }
  /** @returns {AbortSignal} */
  get signal() {
    return h(this, bt).signal;
  }
  /** @returns {string} */
  get status() {
    return h(this, un) ? h(this, un).status : this.cancelled ? "cancelled" : "running";
  }
  /** Abort the timeline, triggering onCancel callbacks. */
  cancel(t = "cancelled") {
    h(this, bt).signal.aborted || h(this, bt).abort(t);
  }
  /**
   * Called internally by the execution engine when the timeline finishes.
   * @param {boolean} completed - true if all steps ran, false if cancelled
   */
  _resolve(t) {
    if (h(this, Bn)) return;
    O(this, Bn, !0);
    const n = typeof t == "boolean" ? { status: t ? "completed" : "cancelled" } : t ?? { status: "cancelled" };
    O(this, un, n), h(this, Rn).call(this, n.status === "completed"), h(this, $n).call(this, n);
  }
};
bt = new WeakMap(), Rn = new WeakMap(), $n = new WeakMap(), Hn = new WeakMap(), Pn = new WeakMap(), Bn = new WeakMap(), un = new WeakMap(), s(ga, "TimelineHandle");
let zo = ga;
const nn = /* @__PURE__ */ new Map();
function ef(e, t) {
  const n = nn.get(e);
  n && !n.cancelled && n.cancel("replaced-by-name"), nn.set(e, t), t.finished.then(() => {
    nn.get(e) === t && nn.delete(e);
  });
}
s(ef, "registerTimeline");
function Ll(e) {
  const t = nn.get(e);
  return t && !t.cancelled ? (t.cancel("cancelled-by-name"), !0) : !1;
}
s(Ll, "cancelTimeline");
function tf(e) {
  return nn.get(e);
}
s(tf, "getTimeline");
function nf(e, t) {
  return e <= 0 ? Promise.resolve() : new Promise((n, i) => {
    if (t.aborted) return i(t.reason);
    const r = setTimeout(n, e);
    t.addEventListener("abort", () => {
      clearTimeout(r), i(t.reason);
    }, { once: !0 });
  });
}
s(nf, "cancellableDelay");
var qe, Tt, qn, Un;
const ma = class ma {
  constructor(t) {
    /** @type {TweenTimeline} */
    M(this, qe);
    /** @type {Array<{ type: string, params: object, opts?: object, detach: boolean }>} */
    M(this, Tt, []);
    /** @type {Function|null} */
    M(this, qn, null);
    /** @type {Function|null} */
    M(this, Un, null);
    O(this, qe, t);
  }
  /**
   * Add a tween entry to this step.
   * @param {string} type  Registered tween type name
   * @param {object} params  Type-specific parameters
   * @param {object} [opts]  Options (durationMS, easing, etc.)
   * @returns {StepBuilder} this
   */
  add(t, n, i) {
    return h(this, Tt).push({ type: t, params: n, opts: i ?? {}, detach: !1 }), this;
  }
  /**
   * Mark the last entry as fire-and-forget (does not block step progression).
   * @returns {StepBuilder} this
   */
  detach() {
    if (h(this, Tt).length === 0)
      throw new Error("StepBuilder.detach(): no entry to detach.");
    return h(this, Tt)[h(this, Tt).length - 1].detach = !0, this;
  }
  /**
   * Callback invoked before this step's tweens start.
   * @param {Function} fn
   * @returns {StepBuilder} this
   */
  before(t) {
    return O(this, qn, t), this;
  }
  /**
   * Callback invoked after this step's awaited tweens complete.
   * @param {Function} fn
   * @returns {StepBuilder} this
   */
  after(t) {
    return O(this, Un, t), this;
  }
  // ── Delegation to parent TweenTimeline for fluent chaining ──
  /** Start a new step (finalizes this one). */
  step() {
    return h(this, qe).step();
  }
  /** Insert a delay between steps. */
  delay(t) {
    return h(this, qe).delay(t);
  }
  /** Register onComplete callback. */
  onComplete(t) {
    return h(this, qe).onComplete(t);
  }
  /** Register onCancel callback. */
  onCancel(t) {
    return h(this, qe).onCancel(t);
  }
  /** Register onError callback. */
  onError(t) {
    return h(this, qe).onError(t);
  }
  /** Execute the timeline. */
  run(t) {
    return h(this, qe).run(t);
  }
  /** Serialize the timeline. */
  toJSON() {
    return h(this, qe).toJSON();
  }
  // ── Internal access ──
  /** @returns {{ entries: Array, before: Function|null, after: Function|null }} */
  _finalize() {
    return {
      entries: h(this, Tt),
      before: h(this, qn),
      after: h(this, Un)
    };
  }
};
qe = new WeakMap(), Tt = new WeakMap(), qn = new WeakMap(), Un = new WeakMap(), s(ma, "StepBuilder");
let Go = ma;
var Ee, Oe, qt, Et, jn, Vn, zn, Gn, ee, In, wl, Sl, Mi, tt, Ft;
const ha = class ha {
  constructor() {
    M(this, ee);
    /** @type {string|null} */
    M(this, Ee, null);
    /** @type {string} */
    M(this, Oe, ye.ABORT);
    /** @type {Array<{ kind: "step", data: object } | { kind: "delay", ms: number }>} */
    M(this, qt, []);
    /** @type {StepBuilder|null} */
    M(this, Et, null);
    /** @type {Function|null} */
    M(this, jn, null);
    /** @type {Function|null} */
    M(this, Vn, null);
    /** @type {Function|null} */
    M(this, zn, null);
    /** @type {Function|null} */
    M(this, Gn, null);
  }
  /**
   * Register this timeline in the named registry. Starting a new
   * timeline with the same name cancels the previous one.
   * @param {string} name
   * @returns {TweenTimeline} this
   */
  name(t) {
    return O(this, Ee, t), this;
  }
  /**
   * Set the error policy for step execution.
   * @param {"abort"|"continue"} policy
   * @returns {TweenTimeline} this
   */
  errorPolicy(t) {
    if (t !== ye.ABORT && t !== ye.CONTINUE)
      throw new Error(`Invalid error policy: "${t}". Use "abort" or "continue".`);
    return O(this, Oe, t), this;
  }
  /**
   * Start a new step. Finalizes the previous step if one is open.
   * @returns {StepBuilder}
   */
  step() {
    return w(this, ee, In).call(this), O(this, Et, new Go(this)), h(this, Et);
  }
  /**
   * Insert a delay (in ms) between the previous step and the next.
   * @param {number} ms
   * @returns {TweenTimeline} this
   */
  delay(t) {
    return w(this, ee, In).call(this), h(this, qt).push({ kind: "delay", ms: t }), this;
  }
  /**
   * Callback invoked before the first step runs.
   * @param {Function} fn
   * @returns {TweenTimeline} this
   */
  beforeAll(t) {
    return O(this, jn, t), this;
  }
  /**
   * Callback invoked on successful completion.
   * @param {Function} fn
   * @returns {TweenTimeline} this
   */
  onComplete(t) {
    return O(this, Vn, t), this;
  }
  /**
   * Callback invoked on cancellation (mutually exclusive with onComplete).
   * @param {Function} fn
   * @returns {TweenTimeline} this
   */
  onCancel(t) {
    return O(this, zn, t), this;
  }
  /**
   * Callback invoked on runtime failure (mutually exclusive with onComplete/onCancel).
   * @param {(outcome: object) => void} fn
   * @returns {TweenTimeline} this
   */
  onError(t) {
    return O(this, Gn, t), this;
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
  run(t = {}) {
    w(this, ee, In).call(this);
    const n = new AbortController();
    t.signal && (t.signal.aborted ? n.abort(t.signal.reason ?? "parent-aborted") : t.signal.addEventListener("abort", () => {
      n.signal.aborted || n.abort(t.signal.reason ?? "parent-aborted");
    }, { once: !0 }));
    const i = new zo(n);
    h(this, Ee) && ef(h(this, Ee), i);
    const r = t.broadcast ?? game.user.isGM, o = t.commit ?? game.user.isGM, a = t.startEpochMS ?? Date.now();
    return r && h(this, Ee) && Oi(El, {
      name: h(this, Ee),
      data: this.toJSON(),
      startEpochMS: a
    }), w(this, ee, wl).call(this, i, { commit: o, startEpochMS: a }).then((l) => {
      var c, u, d;
      i._resolve(l), l.status === En.COMPLETED ? (c = h(this, Vn)) == null || c.call(this) : l.status === En.CANCELLED ? ((u = h(this, zn)) == null || u.call(this), r && h(this, Ee) && Oi(Uo, {
        name: h(this, Ee),
        reason: l.reason
      })) : ((d = h(this, Gn)) == null || d.call(this, l), r && h(this, Ee) && Oi(Uo, {
        name: h(this, Ee),
        reason: "failed"
      }));
    }), i;
  }
  /**
   * Serialize the timeline to a JSON-safe object (steps/delays only, no hooks).
   * @returns {object}
   */
  toJSON() {
    w(this, ee, In).call(this);
    const t = [];
    for (const i of h(this, qt))
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
    return h(this, Ee) && (n.name = h(this, Ee)), h(this, Oe) !== ye.ABORT && (n.errorPolicy = h(this, Oe)), n;
  }
};
Ee = new WeakMap(), Oe = new WeakMap(), qt = new WeakMap(), Et = new WeakMap(), jn = new WeakMap(), Vn = new WeakMap(), zn = new WeakMap(), Gn = new WeakMap(), ee = new WeakSet(), // ── Private ─────────────────────────────────────────────────────────
In = /* @__PURE__ */ s(function() {
  h(this, Et) && (h(this, qt).push({ kind: "step", data: h(this, Et)._finalize() }), O(this, Et, null));
}, "#finalizeCurrentStep"), wl = /* @__PURE__ */ s(async function(t, { commit: n, startEpochMS: i }) {
  const r = t.signal, o = [];
  let a = -1;
  try {
    if (r.aborted) return w(this, ee, tt).call(this, r.reason);
    const l = await w(this, ee, Mi).call(this, h(this, jn), gt.BEFORE_ALL, null);
    if (l) {
      if (h(this, Oe) === ye.ABORT) return l;
      o.push(l);
    }
    let c = 0;
    const u = [];
    for (const d of h(this, qt)) {
      if (r.aborted) return w(this, ee, tt).call(this, r.reason);
      if (d.kind === "delay") {
        try {
          await nf(d.ms, r);
        } catch {
          return w(this, ee, tt).call(this, r.reason);
        }
        c += d.ms;
        continue;
      }
      a += 1;
      const { entries: f, before: m, after: y } = d.data, b = await w(this, ee, Mi).call(this, m, gt.BEFORE_STEP, a);
      if (b) {
        if (h(this, Oe) === ye.ABORT) return b;
        o.push(b);
        continue;
      }
      if (r.aborted) return w(this, ee, tt).call(this, r.reason);
      const p = [];
      let T = 0;
      for (const I of f) {
        const D = Fr(I.type);
        if (!D) {
          const W = w(this, ee, Ft).call(this, new Error(`TweenTimeline: unknown tween type "${I.type}"`), gt.ENTRY, a, I.type);
          if (h(this, Oe) === ye.ABORT) return W;
          o.push(W), console.warn(W.error.message);
          continue;
        }
        const _ = {
          ...I.opts,
          commit: n,
          startEpochMS: i + c,
          signal: r
        }, F = _.durationMS ?? 2e3, x = Promise.resolve().then(() => D.execute(I.params, _)).then((W) => W === !1 ? {
          ok: !1,
          failure: w(this, ee, Ft).call(this, new Error("Tween entry returned false."), gt.ENTRY, a, I.type)
        } : { ok: !0 }).catch((W) => ({
          ok: !1,
          failure: w(this, ee, Ft).call(this, W, gt.ENTRY, a, I.type)
        }));
        I.detach ? u.push(x) : (p.push(x), T = Math.max(T, F));
      }
      const E = await w(this, ee, Sl).call(this, p, r);
      if (E === null) return w(this, ee, tt).call(this, r.reason);
      for (const I of E)
        if (!I.ok) {
          if (h(this, Oe) === ye.ABORT) return I.failure;
          o.push(I.failure), console.warn("TweenTimeline: entry failed:", I.failure.error);
        }
      const C = await w(this, ee, Mi).call(this, y, gt.AFTER_STEP, a);
      if (C) {
        if (h(this, Oe) === ye.ABORT) return C;
        o.push(C);
      }
      if (r.aborted) return w(this, ee, tt).call(this, r.reason);
      c += T;
    }
    if (!r.aborted) {
      const d = await Promise.allSettled(u);
      for (const f of d)
        if (f.status === "rejected") {
          const m = w(this, ee, Ft).call(this, f.reason, gt.ENTRY, a);
          if (h(this, Oe) === ye.ABORT) return m;
          o.push(m);
        }
    }
    return r.aborted ? w(this, ee, tt).call(this, r.reason) : {
      status: En.COMPLETED,
      ...o.length > 0 ? { errors: o } : {}
    };
  } catch (l) {
    return r.aborted ? w(this, ee, tt).call(this, r.reason) : (console.error("TweenTimeline execution error:", l), w(this, ee, Ft).call(this, l, gt.RUNTIME, a));
  }
}, "#execute"), /**
 * @param {Array<Promise<{ok: boolean, failure?: object}>>} stepPromises
 * @param {AbortSignal} signal
 * @returns {Promise<Array<{ok: boolean, failure?: object}>|null>}
 */
Sl = /* @__PURE__ */ s(function(t, n) {
  return t.length === 0 ? Promise.resolve([]) : n.aborted ? Promise.resolve(null) : new Promise((i, r) => {
    const o = /* @__PURE__ */ s(() => i(null), "onAbort");
    n.addEventListener("abort", o, { once: !0 }), Promise.all(t).then((a) => {
      n.removeEventListener("abort", o), i(a);
    }).catch((a) => {
      n.removeEventListener("abort", o), r(a);
    });
  });
}, "#waitForStep"), Mi = /* @__PURE__ */ s(async function(t, n, i) {
  if (!t) return null;
  try {
    return await t(), null;
  } catch (r) {
    const o = w(this, ee, Ft).call(this, r, n, i ?? void 0);
    return h(this, Oe) === ye.CONTINUE && console.warn(`TweenTimeline: hook failure in ${n}:`, r), o;
  }
}, "#runHook"), /** @param {unknown} reason */
tt = /* @__PURE__ */ s(function(t) {
  let n;
  return typeof t == "string" ? n = t : t instanceof Error && (n = t.message), {
    status: En.CANCELLED,
    ...n ? { reason: n } : {}
  };
}, "#cancelledOutcome"), /**
 * @param {unknown} err
 * @param {string} phase
 * @param {number} [stepIndex]
 * @param {string} [entryType]
 */
Ft = /* @__PURE__ */ s(function(t, n, i, r) {
  const o = t instanceof Error ? t : new Error(String(t));
  return {
    status: En.FAILED,
    error: o,
    phase: n,
    ...typeof i == "number" ? { stepIndex: i } : {},
    ...r ? { entryType: r } : {}
  };
}, "#failedOutcome"), s(ha, "TweenTimeline");
let Ki = ha;
function sa(e) {
  if (!e || typeof e != "object")
    throw new Error("Sequence JSON: data must be an object.");
  if (!Array.isArray(e.timeline))
    throw new Error("Sequence JSON: 'timeline' must be an array.");
  if (e.name != null && typeof e.name != "string")
    throw new Error("Sequence JSON: 'name' must be a string.");
  if (e.errorPolicy != null && e.errorPolicy !== ye.ABORT && e.errorPolicy !== ye.CONTINUE)
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
s(sa, "validateSequenceJSON");
function Il(e) {
  sa(e);
  for (let t = 0; t < e.timeline.length; t++) {
    const n = e.timeline[t];
    if (Array.isArray(n))
      for (let i = 0; i < n.length; i++) {
        const r = n[i];
        try {
          Rd(r.type, r.params ?? {});
        } catch (o) {
          throw new Error(`Sequence JSON: timeline[${t}][${i}] failed semantic validation: ${o.message}`);
        }
      }
  }
}
s(Il, "validateSequenceSemantics");
function la(e, t = {}) {
  sa(e), t.validateSemantics && Il(e);
  const n = new Ki();
  e.name && n.name(e.name), e.errorPolicy && n.errorPolicy(e.errorPolicy);
  for (const i of e.timeline) {
    if (!Array.isArray(i)) {
      n.delay(i.delay);
      continue;
    }
    const r = n.step();
    for (const o of i)
      r.add(o.type, o.params ?? {}, o.opts), o.detach && r.detach();
  }
  return n;
}
s(la, "compileSequence");
function rf(e) {
  sa(e), Il(e);
}
s(rf, "validate");
async function of(e, t = {}) {
  return la(e, { validateSemantics: !0 }).run({
    broadcast: !1,
    commit: t.commit,
    startEpochMS: t.startEpochMS,
    signal: t.signal
  }).finished;
}
s(of, "execute");
function af() {
  ei({ type: "sequence", execute: of, validate: rf });
}
s(af, "registerSequenceTween");
async function sf(e, t, n = {}) {
  if (!game.user.isGM)
    return ui.notifications.warn("Only the GM can dispatch tweens."), !1;
  const i = Fr(e);
  if (!i)
    throw new Error(`Unknown tween type: "${e}". Registered types: ${jo().join(", ")}`);
  i.validate(t);
  const { durationMS: r = 2e3, easing: o = "easeInOutCosine", commit: a = !0 } = n, l = Date.now();
  return Oi(Tl, {
    type: e,
    params: t,
    durationMS: r,
    easing: o,
    startEpochMS: l,
    commit: !1
  }), i.execute(t, { durationMS: r, easing: o, commit: a, startEpochMS: l });
}
s(sf, "dispatchTween");
function lf(e) {
  const { type: t, params: n, durationMS: i, easing: r, startEpochMS: o, commit: a } = e ?? {}, l = Fr(t);
  if (!l) {
    console.warn(`[${L}] Received unknown tween type over socket: "${t}"`);
    return;
  }
  l.execute(n, {
    durationMS: i,
    easing: r,
    commit: a ?? !1,
    startEpochMS: o
  });
}
s(lf, "handleTweenSocketMessage");
Vd();
Wd();
Yd();
Zd();
af();
aa(Tl, lf);
aa(El, cf);
aa(Uo, uf);
function cf(e) {
  const { data: t, startEpochMS: n } = e ?? {};
  if (!t) {
    console.warn(`[${L}] Received empty tween-sequence socket message.`);
    return;
  }
  try {
    la(t, { validateSemantics: !0 }).run({ commit: !1, startEpochMS: n, broadcast: !1 });
  } catch (i) {
    console.error(`[${L}] Failed to run received tween sequence:`, i);
  }
}
s(cf, "handleSequenceSocketMessage");
function uf(e) {
  const { name: t } = e ?? {};
  t && Ll(t);
}
s(uf, "handleSequenceCancelMessage");
function df() {
  Hooks.once("ready", () => {
    xd();
    const e = game.modules.get(L);
    e.api || (e.api = {}), e.api.tween = {
      dispatch: sf,
      types: jo,
      Timeline: Ki,
      ErrorPolicy: ye,
      compileSequence: la,
      cancelTimeline: Ll,
      getTimeline: tf
    }, console.log(`[${L}] Tween API registered. Types: ${jo().join(", ")}`);
  });
}
s(df, "registerTweenHooks");
df();
function Ka(e) {
  if (!e) return null;
  if (e.documentName || e._source !== void 0) {
    const t = e.object;
    return t ? { placeable: t, doc: e } : null;
  }
  return e.document ? { placeable: e, doc: e.document } : null;
}
s(Ka, "normalizePlaceable");
function ff(e) {
  var i;
  if (e === "$particles") {
    const r = canvas.particleeffects;
    return r ? { kind: "particles", target: r } : null;
  }
  if (e.startsWith("tag:")) {
    const r = e.slice(4), o = window.Tagger ?? ((i = game.modules.get("tagger")) == null ? void 0 : i.api);
    if (!o)
      return console.warn(`[${L}] Cinematic: Tagger module not available, cannot resolve "${e}".`), null;
    const a = o.getByTag(r, { sceneId: canvas.scene.id }), l = (a == null ? void 0 : a[0]) ?? null;
    if (!l) return null;
    const c = Ka(l);
    return c ? { kind: "placeable", ...c } : null;
  }
  const t = fromUuidSync(e);
  if (!t) return null;
  const n = Ka(t);
  return n ? { kind: "placeable", ...n } : null;
}
s(ff, "resolveTarget");
function vl(e) {
  const t = /* @__PURE__ */ new Set();
  if (e.setup)
    for (const i of Object.keys(e.setup)) t.add(i);
  if (e.landing)
    for (const i of Object.keys(e.landing)) t.add(i);
  if (e.timeline) {
    for (const i of e.timeline)
      if (i.delay == null) {
        if (i.before)
          for (const r of Object.keys(i.before)) t.add(r);
        if (i.after)
          for (const r of Object.keys(i.after)) t.add(r);
        if (i.tweens)
          for (const r of i.tweens)
            r.target && t.add(r.target);
      }
  }
  const n = /* @__PURE__ */ new Map();
  for (const i of t) {
    const r = ff(i);
    r ? n.set(i, r) : console.warn(`[${L}] Cinematic: could not resolve target "${i}", skipping.`);
  }
  return n;
}
s(vl, "resolveAllTargets");
function Ai(e, t) {
  if (e)
    for (const [n, i] of Object.entries(e)) {
      const r = t.get(n);
      if (r)
        if (r.kind === "particles")
          for (const [o, a] of Object.entries(i))
            r.target[o] = a;
        else
          r.doc.updateSource(i), r.placeable.refresh();
    }
}
s(Ai, "applyState");
const gf = {
  "tile-prop": /* @__PURE__ */ new Set(["uuid", "attribute", "value"]),
  "light-color": /* @__PURE__ */ new Set(["uuid", "toColor", "toAlpha", "mode"]),
  "light-state": /* @__PURE__ */ new Set(["uuid", "enabled"]),
  "particles-prop": /* @__PURE__ */ new Set(["attribute", "value"])
}, mf = /* @__PURE__ */ new Set(["duration", "easing", "detach"]), hf = /* @__PURE__ */ new Set(["type", "target"]);
function pf(e, t) {
  const { type: n, target: i, detach: r = !1, ...o } = e;
  if (!n)
    return console.warn(`[${L}] Cinematic: tween entry missing 'type', skipping.`), null;
  const a = {}, l = {}, c = gf[n];
  if (i && i !== "$particles") {
    const u = t.get(i);
    if (!u) return null;
    a.uuid = u.doc.uuid;
  }
  for (const [u, d] of Object.entries(o))
    hf.has(u) || (u === "duration" ? l.durationMS = d : mf.has(u) ? l[u] = d : (c != null && c.has(u), a[u] = d));
  return { type: n, params: a, opts: l, detach: r };
}
s(pf, "compileTween");
function yf(e, t, n) {
  const i = new n().name(`cinematic-${canvas.scene.id}`);
  i.beforeAll(() => {
    Ai(e.setup, t), canvas.perception.update({ refreshLighting: !0, refreshVision: !0 });
  });
  for (const r of e.timeline) {
    if (r.delay != null) {
      i.delay(r.delay);
      continue;
    }
    if (!r.tweens || !Array.isArray(r.tweens)) {
      console.warn(`[${L}] Cinematic: timeline entry has no tweens array, skipping.`);
      continue;
    }
    const o = i.step();
    r.before && o.before(() => Ai(r.before, t));
    for (const a of r.tweens) {
      const l = pf(a, t);
      l && (o.add(l.type, l.params, l.opts), l.detach && o.detach());
    }
    r.after && o.after(() => Ai(r.after, t));
  }
  return i;
}
s(yf, "buildTimeline");
const bf = "cinematic", Ja = 1;
function ca(e) {
  const t = e ? game.scenes.get(e) : canvas.scene;
  return (t == null ? void 0 : t.getFlag(L, bf)) ?? null;
}
s(ca, "getCinematicData");
function ua(e) {
  return `cinematic-seen-${e}`;
}
s(ua, "seenFlagKey");
function Tf(e) {
  return !!game.user.getFlag(L, ua(e));
}
s(Tf, "hasSeenCinematic");
function Ef() {
  return game.ready ? Promise.resolve() : new Promise((e) => Hooks.once("ready", e));
}
s(Ef, "waitForReady");
async function Cf(e = 1e4) {
  var n, i;
  const t = (i = (n = game.modules.get(L)) == null ? void 0 : n.api) == null ? void 0 : i.tween;
  return t != null && t.Timeline ? t.Timeline : new Promise((r) => {
    const o = Date.now(), a = setInterval(() => {
      var c, u;
      const l = (u = (c = game.modules.get(L)) == null ? void 0 : c.api) == null ? void 0 : u.tween;
      l != null && l.Timeline ? (clearInterval(a), r(l.Timeline)) : Date.now() - o > e && (clearInterval(a), console.warn(`[${L}] Cinematic: tween API not available after ${e}ms.`), r(null));
    }, 200);
  });
}
s(Cf, "waitForTweenAPI");
async function Ol(e) {
  var l;
  const t = e ?? ((l = canvas.scene) == null ? void 0 : l.id);
  if (!t) return;
  const n = ca(t);
  if (!n) {
    console.warn(`[${L}] Cinematic: no cinematic data on scene ${t}.`);
    return;
  }
  const i = await Cf();
  if (!i) return;
  const r = vl(n);
  if (console.log(`[${L}] Cinematic: resolved ${r.size} targets:`, [...r.entries()].map(([c, u]) => {
    var d, f;
    return `${c} → ${((d = u == null ? void 0 : u.document) == null ? void 0 : d.uuid) ?? ((f = u == null ? void 0 : u.constructor) == null ? void 0 : f.name) ?? "?"}`;
  })), r.size === 0) {
    console.warn(`[${L}] Cinematic: no targets could be resolved on scene ${t}.`);
    return;
  }
  const o = yf(n, r, i);
  console.log(`[${L}] Cinematic: timeline built, JSON:`, JSON.stringify(o.toJSON())), o.onComplete(async () => {
    n.tracking !== !1 && await game.user.setFlag(L, ua(t), !0), console.log(`[${L}] Cinematic complete on scene ${t}.`);
  }), o.onCancel(() => {
    console.log(`[${L}] Cinematic cancelled on scene ${t}.`);
  }), o.onError((c) => {
    console.error(`[${L}] Cinematic error on scene ${t}:`, c);
  });
  const a = o.run({ broadcast: !1, commit: !1 });
  console.log(`[${L}] Cinematic: timeline started, handle status: ${a.status}`);
}
s(Ol, "playCinematic");
async function Lf(e) {
  var n;
  const t = e ?? ((n = canvas.scene) == null ? void 0 : n.id);
  t && (await game.user.unsetFlag(L, ua(t)), console.log(`[${L}] Cinematic: cleared seen flag for scene ${t}.`));
}
s(Lf, "resetCinematic");
function wf(e) {
  var t;
  return ca(e ?? ((t = canvas.scene) == null ? void 0 : t.id)) != null;
}
s(wf, "hasCinematic");
async function Sf() {
  console.log(`[${L}] Cinematic: canvasReady fired, game.ready=${game.ready}`), await Ef(), console.log(`[${L}] Cinematic: game is ready`);
  const e = canvas.scene;
  if (!e) {
    console.log(`[${L}] Cinematic: no canvas.scene, exiting`);
    return;
  }
  const t = ca(e.id);
  if (!t) {
    console.log(`[${L}] Cinematic: no cinematic flag on scene ${e.id}, exiting`);
    return;
  }
  if (console.log(`[${L}] Cinematic: found flag data on scene ${e.id}`), t.version && t.version > Ja) {
    console.warn(`[${L}] Cinematic: scene ${e.id} has version ${t.version}, runtime supports up to ${Ja}. Skipping.`);
    return;
  }
  if (t.trigger && t.trigger !== "canvasReady") {
    console.log(`[${L}] Cinematic: trigger "${t.trigger}" doesn't match, exiting`);
    return;
  }
  const n = t.tracking !== !1 && Tf(e.id);
  if (console.log(`[${L}] Cinematic: tracking=${t.tracking}, seen=${n}`), n) {
    if (t.landing) {
      console.log(`[${L}] Cinematic: applying landing state (already seen)`);
      const i = vl(t);
      Ai(t.landing, i), canvas.perception.update({ refreshLighting: !0, refreshVision: !0 });
    }
    return;
  }
  console.log(`[${L}] Cinematic: playing cinematic...`), await Ol(e.id);
}
s(Sf, "onCanvasReady");
function If() {
  Hooks.on("canvasReady", Sf), Hooks.once("ready", () => {
    const e = game.modules.get(L);
    e.api || (e.api = {}), e.api.cinematic = {
      play: Ol,
      reset: Lf,
      has: wf
    }, console.log(`[${L}] Cinematic API registered.`);
  });
}
s(If, "registerCinematicHooks");
If();
//# sourceMappingURL=eidolon-utilities.js.map
