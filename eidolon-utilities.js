var xo = Object.defineProperty;
var Ps = Object.getPrototypeOf;
var Bs = Reflect.get;
var ko = (e) => {
  throw TypeError(e);
};
var qs = (e, t, i) => t in e ? xo(e, t, { enumerable: !0, configurable: !0, writable: !0, value: i }) : e[t] = i;
var s = (e, t) => xo(e, "name", { value: t, configurable: !0 });
var $e = (e, t, i) => qs(e, typeof t != "symbol" ? t + "" : t, i), or = (e, t, i) => t.has(e) || ko("Cannot " + i);
var h = (e, t, i) => (or(e, t, "read from private field"), i ? i.call(e) : t.get(e)), N = (e, t, i) => t.has(e) ? ko("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), v = (e, t, i, n) => (or(e, t, "write to private field"), n ? n.call(e, i) : t.set(e, i), i), S = (e, t, i) => (or(e, t, "access private method"), i);
var et = (e, t, i) => Bs(Ps(e), i, t);
const I = "eidolon-utilities", cn = "timeTriggerActive", pr = "timeTriggerHideWindow", yr = "timeTriggerShowPlayerWindow", Tr = "timeTriggerAllowRealTime", fa = "timeTriggers", Wi = "timeTriggerHistory", br = "debug", Er = "timeFormat", Cr = "manageTime", Lr = "secondsPerRound";
const Us = [-30, -15, -5, 5, 15, 30], Pt = 1440 * 60, Ki = "playSound", Fi = 6;
function f(e, t) {
  var i, n;
  return (n = (i = game.i18n) == null ? void 0 : i.has) != null && n.call(i, e) ? game.i18n.localize(e) : t;
}
s(f, "localize");
function un(e) {
  return typeof e != "string" ? "" : e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
s(un, "escapeHtml");
function je(e) {
  var t;
  return e == null ? e : (t = foundry == null ? void 0 : foundry.utils) != null && t.duplicate ? foundry.utils.duplicate(e) : JSON.parse(JSON.stringify(e));
}
s(je, "duplicateData");
function Vs() {
  var e;
  return (e = foundry == null ? void 0 : foundry.utils) != null && e.randomID ? foundry.utils.randomID() : typeof (crypto == null ? void 0 : crypto.randomUUID) == "function" ? crypto.randomUUID() : Math.random().toString(36).slice(2, 10);
}
s(Vs, "generateTriggerId");
function ga(e) {
  if (typeof e != "string") return null;
  const t = e.trim();
  if (!t) return null;
  const i = t.match(/^([0-9]{1,2}):([0-9]{2})(?::([0-9]{2}))?$/);
  if (!i) return null;
  const n = Number(i[1]), r = Number(i[2]), o = i[3] !== void 0 ? Number(i[3]) : 0;
  return !Number.isInteger(n) || !Number.isInteger(r) || !Number.isInteger(o) || n < 0 || n > 23 || r < 0 || r > 59 || o < 0 || o > 59 ? null : n * 3600 + r * 60 + o;
}
s(ga, "parseTriggerTimeToSeconds");
function si() {
  var e, t;
  return ((e = game.scenes) == null ? void 0 : e.current) ?? ((t = game.scenes) == null ? void 0 : t.active) ?? null;
}
s(si, "getActiveScene");
function ze(e) {
  return (e == null ? void 0 : e.object) ?? (e == null ? void 0 : e.document) ?? null;
}
s(ze, "getSceneFromApplication");
function Ce(e) {
  return e && typeof e.getFlag == "function" && typeof e.setFlag == "function";
}
s(Ce, "hasSceneDocument");
const Sr = /* @__PURE__ */ new Set(), Ir = /* @__PURE__ */ new Set(), wr = /* @__PURE__ */ new Set(), Or = /* @__PURE__ */ new Set();
let At = !1, mi = !1, dn = Fi, fn = "12h", Ho = !1;
function ar(e) {
  At = !!e;
  for (const t of Sr)
    try {
      t(At);
    } catch (i) {
      console.error(`${I} | Debug change handler failed`, i);
    }
}
s(ar, "notifyDebugChange");
function sr(e) {
  mi = !!e;
  for (const t of Ir)
    try {
      t(mi);
    } catch (i) {
      console.error(`${I} | Manage time change handler failed`, i);
    }
}
s(sr, "notifyManageTimeChange");
function ma(e) {
  return e === "24h" ? "24h" : "12h";
}
s(ma, "normalizeTimeFormatValue");
function fo(e) {
  const t = Number(e);
  return !Number.isFinite(t) || t <= 0 ? Fi : t;
}
s(fo, "normalizeSecondsPerRoundValue");
function lr(e) {
  const t = fo(e);
  dn = t;
  for (const i of wr)
    try {
      i(t);
    } catch (n) {
      console.error(`${I} | Seconds-per-round change handler failed`, n);
    }
}
s(lr, "notifySecondsPerRoundChange");
function cr(e) {
  const t = ma(e);
  fn = t;
  for (const i of Or)
    try {
      i(t);
    } catch (n) {
      console.error(`${I} | Time format change handler failed`, n);
    }
}
s(cr, "notifyTimeFormatChange");
function js() {
  var t;
  if (Ho) return;
  if (Ho = !0, !((t = game == null ? void 0 : game.settings) != null && t.register)) {
    console.warn(
      `${I} | game.settings.register is unavailable. Module settings could not be registered.`
    );
    return;
  }
  const e = typeof game.settings.registerChange == "function";
  game.settings.register(I, br, {
    name: f("EIDOLON.TimeTrigger.DebugSettingName", "Enable debug logging"),
    hint: f(
      "EIDOLON.TimeTrigger.DebugSettingHint",
      "Write detailed time-trigger diagnostics to the browser console."
    ),
    scope: "world",
    config: !0,
    type: Boolean,
    default: !1,
    onChange: e ? void 0 : ar
  }), e && game.settings.registerChange(I, br, ar), At = go(), ar(At), game.settings.register(I, Cr, {
    name: f("EIDOLON.TimeTrigger.ManageTimeSettingName", "Manage Game Time"),
    hint: f(
      "EIDOLON.TimeTrigger.ManageTimeSettingHint",
      "Allow Eidolon Utilities to advance world time automatically while the game is unpaused. Warning: This may conflict with other time-management modules."
    ),
    scope: "world",
    config: !0,
    type: Boolean,
    default: !1,
    onChange: e ? void 0 : sr
  }), e && game.settings.registerChange(I, Cr, sr), mi = Gs(), sr(mi), game.settings.register(I, Lr, {
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
    default: Fi,
    range: { min: 1, max: 3600, step: 1 },
    onChange: e ? void 0 : lr
  }), e && game.settings.registerChange(
    I,
    Lr,
    lr
  ), dn = fo(Ws()), lr(dn), game.settings.register(I, Er, {
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
    onChange: e ? void 0 : cr
  }), e && game.settings.registerChange(I, Er, cr), fn = ma(ha()), cr(fn);
}
s(js, "registerTimeTriggerSettings");
function go() {
  var e;
  try {
    if ((e = game == null ? void 0 : game.settings) != null && e.get)
      return !!game.settings.get(I, br);
  } catch (t) {
    console.error(`${I} | Failed to read debug setting`, t);
  }
  return !1;
}
s(go, "getDebugSetting");
function zs() {
  return At = go(), At;
}
s(zs, "refreshDebugSettingCache");
function Gs() {
  var e;
  try {
    if ((e = game == null ? void 0 : game.settings) != null && e.get)
      return !!game.settings.get(I, Cr);
  } catch (t) {
    console.error(`${I} | Failed to read manage time setting`, t);
  }
  return !1;
}
s(Gs, "getManageTimeSetting");
function ha() {
  var e;
  try {
    if ((e = game == null ? void 0 : game.settings) != null && e.get)
      return game.settings.get(I, Er) === "24h" ? "24h" : "12h";
  } catch (t) {
    console.error(`${I} | Failed to read time format setting`, t);
  }
  return "12h";
}
s(ha, "getTimeFormatSetting");
function Ws() {
  var e;
  try {
    if ((e = game == null ? void 0 : game.settings) != null && e.get) {
      const t = game.settings.get(I, Lr);
      return fo(t);
    }
  } catch (t) {
    console.error(`${I} | Failed to read seconds-per-round setting`, t);
  }
  return Fi;
}
s(Ws, "getSecondsPerRoundSetting");
function Ks(e) {
  if (typeof e != "function")
    return () => {
    };
  Sr.add(e);
  try {
    e(At);
  } catch (t) {
    console.error(`${I} | Debug change handler failed`, t);
  }
  return () => {
    Sr.delete(e);
  };
}
s(Ks, "onDebugSettingChange");
function pa(e) {
  if (typeof e != "function")
    return () => {
    };
  Ir.add(e);
  try {
    e(mi);
  } catch (t) {
    console.error(`${I} | Manage time change handler failed`, t);
  }
  return () => {
    Ir.delete(e);
  };
}
s(pa, "onManageTimeSettingChange");
function mo(e) {
  if (typeof e != "function")
    return () => {
    };
  Or.add(e);
  try {
    e(fn);
  } catch (t) {
    console.error(`${I} | Time format change handler failed`, t);
  }
  return () => {
    Or.delete(e);
  };
}
s(mo, "onTimeFormatSettingChange");
function Js(e) {
  if (typeof e != "function")
    return () => {
    };
  wr.add(e);
  try {
    e(dn);
  } catch (t) {
    console.error(`${I} | Seconds-per-round change handler failed`, t);
  }
  return () => {
    wr.delete(e);
  };
}
s(Js, "onSecondsPerRoundSettingChange");
let Kn = !1, vr = !1;
function Mr(e) {
  Kn = !!e;
}
s(Mr, "updateDebugState");
function ya() {
  vr || (vr = !0, Mr(go()), Ks((e) => {
    Mr(e), console.info(`${I} | Debug ${Kn ? "enabled" : "disabled"}`);
  }));
}
s(ya, "ensureInitialized");
function ho() {
  return vr || ya(), Kn;
}
s(ho, "shouldLog");
function Ta(e) {
  if (!e.length)
    return [`${I} |`];
  const [t, ...i] = e;
  return typeof t == "string" ? [`${I} | ${t}`, ...i] : [`${I} |`, t, ...i];
}
s(Ta, "formatArgs");
function Ys() {
  ya();
}
s(Ys, "initializeDebug");
function Qs() {
  return Mr(zs()), Kn;
}
s(Qs, "syncDebugState");
function L(...e) {
  ho() && console.debug(...Ta(e));
}
s(L, "debugLog");
function Jt(...e) {
  ho() && console.group(...Ta(e));
}
s(Jt, "debugGroup");
function ct() {
  ho() && console.groupEnd();
}
s(ct, "debugGroupEnd");
function Bt(e) {
  var r;
  const t = (r = e == null ? void 0 : e.getFlag) == null ? void 0 : r.call(e, I, fa);
  if (!t) return [];
  const i = je(t), n = Array.isArray(i) ? i : [];
  return L("Loaded time triggers", {
    sceneId: (e == null ? void 0 : e.id) ?? null,
    count: n.length
  }), n;
}
s(Bt, "getTimeTriggers");
async function ba(e, t) {
  e != null && e.setFlag && (L("Persisting time triggers", {
    sceneId: e.id,
    count: Array.isArray(t) ? t.length : 0
  }), await e.setFlag(I, fa, t));
}
s(ba, "setTimeTriggers");
function Xs(e) {
  var r;
  const t = (r = e == null ? void 0 : e.getFlag) == null ? void 0 : r.call(e, I, Wi);
  if (!t) return {};
  const i = je(t);
  if (!i || typeof i != "object") return {};
  const n = {};
  for (const [o, a] of Object.entries(i))
    typeof a == "number" && Number.isFinite(a) && (n[o] = a);
  return L("Loaded time trigger history", {
    sceneId: (e == null ? void 0 : e.id) ?? null,
    keys: Object.keys(n)
  }), n;
}
s(Xs, "getTimeTriggerHistory");
async function ur(e, t) {
  var c, u, d, g;
  if (!e) return;
  const i = {};
  if (t && typeof t == "object")
    for (const [m, y] of Object.entries(t))
      typeof y == "number" && Number.isFinite(y) && (i[m] = y);
  const n = ((c = e.getFlag) == null ? void 0 : c.call(e, I, Wi)) ?? {}, r = {};
  if (n && typeof n == "object")
    for (const [m, y] of Object.entries(n))
      typeof y == "number" && Number.isFinite(y) && (r[m] = y);
  const o = Object.keys(i), a = Object.keys(r);
  if (typeof ((u = foundry == null ? void 0 : foundry.utils) == null ? void 0 : u.deepEqual) == "function" ? foundry.utils.deepEqual(r, i) : JSON.stringify(r) === JSON.stringify(i)) {
    L("Skip history update because state is unchanged", {
      sceneId: (e == null ? void 0 : e.id) ?? null
    });
    return;
  }
  L("Updating time trigger history", {
    sceneId: (e == null ? void 0 : e.id) ?? null,
    keys: o,
    removedKeys: a.filter((m) => !o.includes(m))
  });
  try {
    a.length && typeof e.unsetFlag == "function" && await e.unsetFlag(I, Wi), o.length && await e.setFlag(I, Wi, i);
  } catch (m) {
    console.error(`${I} | Failed to persist time trigger history`, m), (g = (d = ui.notifications) == null ? void 0 : d.error) == null || g.call(
      d,
      f(
        "EIDOLON.TimeTrigger.HistoryPersistError",
        "Failed to persist the scene's time trigger history."
      )
    );
  }
}
s(ur, "updateTimeTriggerHistory");
const gn = /* @__PURE__ */ new Map(), $o = /* @__PURE__ */ new Set();
function Zs(e) {
  if (!(e != null && e.id))
    throw new Error(`${I} | Action definitions require an id.`);
  if (gn.has(e.id))
    throw new Error(`${I} | Duplicate time trigger action id: ${e.id}`);
  gn.set(e.id, {
    ...e
  }), L("Registered time trigger action", { actionId: e.id });
}
s(Zs, "registerAction");
function _i(e) {
  return gn.get(e) ?? null;
}
s(_i, "getAction");
function el(e) {
  const t = _i(e);
  return t ? typeof t.label == "function" ? t.label() : t.label : e;
}
s(el, "getActionLabel");
function Po() {
  return Array.from(gn.values());
}
s(Po, "listActions");
async function Ea(e, t) {
  var n, r;
  const i = _i(t == null ? void 0 : t.action);
  if (!i || typeof i.execute != "function") {
    const o = f(
      "EIDOLON.TimeTrigger.UnknownAction",
      "Encountered an unknown time trigger action and skipped it."
    );
    (r = (n = ui.notifications) == null ? void 0 : n.warn) == null || r.call(n, o), console.warn(`${I} | Unknown time trigger action`, t), L("Encountered unknown time trigger action", {
      triggerId: (t == null ? void 0 : t.id) ?? null,
      actionId: (t == null ? void 0 : t.action) ?? null
    });
    return;
  }
  L("Executing action handler", {
    actionId: i.id,
    triggerId: (t == null ? void 0 : t.id) ?? null,
    sceneId: (e == null ? void 0 : e.id) ?? null
  }), await i.execute({ scene: e, trigger: t });
}
s(Ea, "executeTriggerAction");
function tl(e) {
  const t = _i(e == null ? void 0 : e.action);
  return !t || typeof t.buildSummaryParts != "function" ? [] : t.buildSummaryParts({ trigger: e, escapeHtml: un, localize: f }) ?? [];
}
s(tl, "buildActionSummaryParts");
function il(e) {
  const t = _i(e == null ? void 0 : e.action);
  return !t || typeof t.buildFormContent != "function" ? "" : t.buildFormContent({ trigger: e, escapeHtml: un, localize: f }) ?? "";
}
s(il, "buildActionFormSection");
function nl(e, t) {
  const i = _i(e == null ? void 0 : e.action);
  !i || typeof i.prepareFormData != "function" || i.prepareFormData({ trigger: e, formData: t });
}
s(nl, "applyActionFormData");
function rl(e, t, i) {
  var o, a;
  const n = `${(e == null ? void 0 : e.id) ?? "unknown"}:${(t == null ? void 0 : t.id) ?? (t == null ? void 0 : t.action) ?? "unknown"}:${i}`;
  if ($o.has(n)) return;
  $o.add(n);
  const r = f(
    "EIDOLON.TimeTrigger.MissingDataWarning",
    "A scene time trigger is missing required data and was skipped."
  );
  (a = (o = ui.notifications) == null ? void 0 : o.warn) == null || a.call(o, r), console.warn(`${I} | Missing trigger data (${i})`, { scene: e == null ? void 0 : e.id, trigger: t });
}
s(rl, "warnMissingTriggerData");
async function ol({ scene: e, trigger: t }) {
  var o, a, l, c, u;
  const i = (l = (a = (o = t == null ? void 0 : t.data) == null ? void 0 : o.path) == null ? void 0 : a.trim) == null ? void 0 : l.call(a);
  if (!i) {
    rl(e, t, "missing-audio-path");
    return;
  }
  const n = {
    src: i,
    autoplay: !0,
    loop: !1
  }, r = (() => {
    var d, g, m, y, T;
    return typeof ((g = (d = foundry == null ? void 0 : foundry.audio) == null ? void 0 : d.AudioHelper) == null ? void 0 : g.play) == "function" ? foundry.audio.AudioHelper.play(n, !0) : typeof ((y = (m = game == null ? void 0 : game.audio) == null ? void 0 : m.constructor) == null ? void 0 : y.play) == "function" ? game.audio.constructor.play(n, !0) : typeof ((T = game == null ? void 0 : game.audio) == null ? void 0 : T.play) == "function" ? game.audio.play(n, !0) : null;
  })();
  if (!r) {
    console.error(`${I} | Foundry audio helper is unavailable`), (u = (c = ui.notifications) == null ? void 0 : c.error) == null || u.call(
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
s(ol, "executePlaySoundAction");
Zs({
  id: Ki,
  label: /* @__PURE__ */ s(() => f("EIDOLON.TimeTrigger.ActionPlaySound", "Play Sound"), "label"),
  execute: ol,
  buildSummaryParts: /* @__PURE__ */ s(({ trigger: e, escapeHtml: t, localize: i }) => {
    var r;
    return (r = e == null ? void 0 : e.data) != null && r.path ? [`${t(i("EIDOLON.TimeTrigger.TriggerSound", "Sound File"))}: ${t(e.data.path)}`] : [];
  }, "buildSummaryParts"),
  buildFormContent: /* @__PURE__ */ s(({ trigger: e, escapeHtml: t, localize: i }) => {
    var l;
    const n = t(i("EIDOLON.TimeTrigger.TriggerSound", "Sound File")), r = t(
      i("EIDOLON.TimeTrigger.TriggerChooseFile", "Select File")
    ), o = t(
      i(
        "EIDOLON.TimeTrigger.TriggerSoundNotes",
        "Select or upload the audio file that should play when this trigger fires."
      )
    ), a = t(((l = e == null ? void 0 : e.data) == null ? void 0 : l.path) ?? "");
    return `
      <label>${n}</label>
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
    var i, n;
    e.data.path = ((n = (i = t.playSoundPath) == null ? void 0 : i.trim) == null ? void 0 : n.call(i)) ?? "";
  }, "prepareFormData")
});
var la;
const { ApplicationV2: Ri, HandlebarsApplicationMixin: xi } = ((la = foundry.applications) == null ? void 0 : la.api) ?? {};
if (!Ri || !xi)
  throw new Error(
    `${I} | ApplicationV2 API unavailable. Update Foundry VTT to v13 or newer.`
  );
const dt = "AM", Dt = "PM";
function ut() {
  return ha();
}
s(ut, "getConfiguredTimeFormat");
function Jn(e) {
  if (typeof e != "string") return null;
  const t = e.trim();
  if (!t) return null;
  const i = t.match(/^([0-9]{1,2}):([0-9]{2})(?::([0-9]{2}))?$/);
  if (!i) return null;
  const n = Number(i[1]), r = Number(i[2]), o = i[3] !== void 0 ? Number(i[3]) : null;
  return !Number.isInteger(n) || !Number.isInteger(r) || n < 0 || n > 23 || r < 0 || r > 59 || o !== null && (!Number.isInteger(o) || o < 0 || o > 59) ? null : {
    hours: n,
    minutes: r,
    seconds: o
  };
}
s(Jn, "parseCanonicalTimeString");
function Ve({ hours: e, minutes: t, seconds: i }) {
  if (!Number.isInteger(e) || !Number.isInteger(t) || e < 0 || e > 23 || t < 0 || t > 59) return null;
  const n = String(e).padStart(2, "0"), r = String(t).padStart(2, "0");
  if (Number.isInteger(i)) {
    if (i < 0 || i > 59) return null;
    const o = String(i).padStart(2, "0");
    return `${n}:${r}:${o}`;
  }
  return `${n}:${r}`;
}
s(Ve, "formatCanonicalTime");
function al(e, { format: t } = {}) {
  if (!e || typeof e != "object") return null;
  const i = Number(e.hour), n = Number(e.minute), r = e.second !== void 0 && e.second !== null, o = r ? Number(e.second) : null, a = r && Number.isFinite(o) ? Math.floor(Math.max(0, Math.min(59, o))) : null;
  if (!Number.isFinite(i) || !Number.isFinite(n)) return null;
  const l = t ?? ut();
  return mn(
    {
      hours: i,
      minutes: n,
      seconds: a
    },
    l
  );
}
s(al, "formatTimeComponentsForDisplay");
function sl(e, { format: t } = {}) {
  const i = Jn(e);
  if (!i) return "";
  const n = t ?? ut();
  return mn(i, n);
}
s(sl, "formatTriggerTimeForDisplay");
function mn(e, t = "12h") {
  if (!e) return "";
  const { hours: i, minutes: n, seconds: r = null } = e;
  if (!Number.isInteger(i) || !Number.isInteger(n)) return "";
  const o = Number.isInteger(r);
  if (t === "24h") {
    const m = `${String(i).padStart(2, "0")}:${String(n).padStart(2, "0")}`;
    return o ? `${m}:${String(r).padStart(2, "0")}` : m;
  }
  const a = i >= 12 ? Dt : dt, l = i % 12 === 0 ? 12 : i % 12, c = String(l), u = String(n).padStart(2, "0"), d = `${c}:${u}`, g = a === dt ? f("EIDOLON.TimeTrigger.TimePeriodAM", dt) : f("EIDOLON.TimeTrigger.TimePeriodPM", Dt);
  if (o) {
    const m = String(r).padStart(2, "0");
    return `${d}:${m} ${g}`;
  }
  return `${d} ${g}`;
}
s(mn, "formatTimeParts");
function Bo(e, t = ut()) {
  const i = Jn(e);
  if (t === "24h")
    return {
      format: t,
      canonical: i ? Ve(i) ?? "" : "",
      hour: i ? String(i.hours).padStart(2, "0") : "",
      minute: i ? String(i.minutes).padStart(2, "0") : ""
    };
  if (!i)
    return {
      format: t,
      canonical: "",
      hour: "",
      minute: "",
      period: dt
    };
  const n = i.hours >= 12 ? Dt : dt, r = i.hours % 12 === 0 ? 12 : i.hours % 12;
  return {
    format: t,
    canonical: Ve(i) ?? "",
    hour: String(r),
    minute: String(i.minutes).padStart(2, "0"),
    period: n
  };
}
s(Bo, "getTimeFormValues");
function ll({ hour: e, minute: t, period: i, time: n }, r = ut()) {
  if (r === "24h") {
    const y = typeof e == "string" ? e.trim() : "", T = typeof t == "string" ? t.trim() : "", p = typeof n == "string" ? n.trim() : "";
    if (!y && !T && p) {
      const O = Jn(p);
      return O ? { canonical: Ve(O) ?? "", error: null } : {
        canonical: "",
        error: f(
          "EIDOLON.TimeTrigger.TimeFormatInvalid24",
          "Enter a valid time in HH:MM format."
        )
      };
    }
    if (!y || !T)
      return {
        canonical: "",
        error: f("EIDOLON.TimeTrigger.TimeFormatMissing", "Enter a complete time.")
      };
    const C = Number(y), b = Number(T);
    return !Number.isInteger(C) || C < 0 || C > 23 ? {
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
    } : { canonical: Ve({
      hours: C,
      minutes: b
    }) ?? "", error: null };
  }
  const o = typeof e == "string" ? e.trim() : "", a = typeof t == "string" ? t.trim() : "", l = typeof i == "string" ? i.trim().toUpperCase() : "";
  if (!o || !a || !l)
    return { canonical: "", error: f("EIDOLON.TimeTrigger.TimeFormatMissing", "Enter a complete time.") };
  if (l !== dt && l !== Dt)
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
  const d = c % 12, m = {
    hours: l === Dt ? d + 12 : d,
    minutes: u
  };
  return {
    canonical: Ve(m) ?? "",
    error: null
  };
}
s(ll, "normalizeFormTimeInput");
function cl() {
  return [
    {
      value: dt,
      label: f("EIDOLON.TimeTrigger.TimePeriodAM", dt)
    },
    {
      value: Dt,
      label: f("EIDOLON.TimeTrigger.TimePeriodPM", Dt)
    }
  ];
}
s(cl, "getPeriodOptions");
var Et, Ct, W, Ca, Ln, Sn, La, Ar, Dr, In, wn, Sa, Ia, wa, Fr, _r, Rr, On, vn, xr, Mn, Oa, va;
const bt = class bt extends xi(Ri) {
  constructor(i = {}) {
    var a;
    const { scene: n, showControls: r, ...o } = i ?? {};
    super(o);
    N(this, W);
    N(this, Et, null);
    N(this, Ct, null);
    N(this, Ln, /* @__PURE__ */ s((i) => {
      var r, o;
      i.preventDefault();
      const n = Number((o = (r = i.currentTarget) == null ? void 0 : r.dataset) == null ? void 0 : o.delta);
      Number.isFinite(n) && (L("Time delta button clicked", { delta: n }), this._advanceTime(n));
    }, "#onDeltaClick"));
    N(this, Sn, /* @__PURE__ */ s((i) => {
      var n, r;
      i.preventDefault(), !(!this.showControls || !((n = game.user) != null && n.isGM)) && (L("Time value double clicked", { sceneId: ((r = this.scene) == null ? void 0 : r.id) ?? null }), S(this, W, La).call(this));
    }, "#onTimeDoubleClick"));
    N(this, In, /* @__PURE__ */ s((i) => {
      if (this.isEditingTime && !this._commitTimeInProgress)
        if (i.key === "Enter") {
          i.preventDefault();
          const n = i.currentTarget, r = typeof (n == null ? void 0 : n.value) == "string" ? n.value : "";
          S(this, W, Dr).call(this, r);
        } else i.key === "Escape" && (i.preventDefault(), S(this, W, Ar).call(this));
    }, "#onTimeInputKeydown"));
    N(this, wn, /* @__PURE__ */ s((i) => {
      if (!this.isEditingTime || this._commitTimeInProgress || this._suppressBlurCommit) return;
      const n = i.currentTarget, r = typeof (n == null ? void 0 : n.value) == "string" ? n.value : "";
      S(this, W, Dr).call(this, r);
    }, "#onTimeInputBlur"));
    N(this, On, /* @__PURE__ */ s((i) => {
      const n = !!i;
      if (this.manageTimeEnabled === n) return;
      this.manageTimeEnabled = n, (this.rendered ?? this.isRendered ?? !1) && this.render({ force: !0 });
    }, "#handleManageTimeChange"));
    N(this, vn, /* @__PURE__ */ s(async (i) => {
      var o, a, l, c, u, d, g, m, y;
      if (i.preventDefault(), !this.showControls || !((o = game.user) != null && o.isGM)) return;
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
      const n = this.scene;
      if (!n || typeof n.setFlag != "function") {
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
        await n.setFlag(I, Tr, r), this.sceneAllowsRealTime = r;
        const T = r ? f(
          "EIDOLON.TimeTrigger.SceneRealTimeEnabled",
          "Automatic real-time flow enabled for this scene."
        ) : f(
          "EIDOLON.TimeTrigger.SceneRealTimeDisabled",
          "Automatic real-time flow disabled for this scene."
        );
        (g = (d = ui.notifications) == null ? void 0 : d.info) == null || g.call(d, T);
      } catch (T) {
        console.error(`${I} | Failed to toggle scene real-time flow`, T), (y = (m = ui.notifications) == null ? void 0 : m.error) == null || y.call(
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
    N(this, Mn, /* @__PURE__ */ s(() => {
      (this.rendered ?? this.isRendered ?? !1) && (this.isEditingTime && (this.editValue = S(this, W, Fr).call(this)), this.render({ force: !0 }));
    }, "#handleTimeFormatChange"));
    this.scene = n ?? null, this.showControls = typeof r == "boolean" ? r : !!((a = game.user) != null && a.isGM), this.isEditingTime = !1, this.editValue = "", this._commitTimeInProgress = !1, this._suppressBlurCommit = !1, this.manageTimeEnabled = !1, this.sceneAllowsRealTime = S(this, W, xr).call(this), v(this, Et, mo(h(this, Mn))), v(this, Ct, pa(h(this, On)));
  }
  async _prepareContext() {
    var b, E;
    const i = ((b = game.time) == null ? void 0 : b.components) ?? {}, r = ((i == null ? void 0 : i.second) !== void 0 && (i == null ? void 0 : i.second) !== null ? al(i) : null) ?? S(this, W, Ca).call(this), o = ut(), a = o === "24h", l = a ? f("EIDOLON.TimeTrigger.EditTimePlaceholder24", "HH:MM") : f("EIDOLON.TimeTrigger.EditTimePlaceholder12", "HH:MM AM/PM"), c = this.showControls ? f(
      "EIDOLON.TimeTrigger.EditTimeHint",
      "Double-click to set a specific time."
    ) : "", u = this.showControls ? f(
      "EIDOLON.TimeTrigger.EditTimeLabel",
      "New time (HH:MM or HH:MM AM/PM)"
    ) : "", d = Us.map((O) => ({
      minutes: O,
      label: O > 0 ? `+${O}` : `${O}`
    })), g = !!this.manageTimeEnabled, m = S(this, W, xr).call(this);
    this.sceneAllowsRealTime = m;
    const y = f(
      "EIDOLON.TimeTrigger.SceneRealTimeEnable",
      "Enable automatic real-time flow for this scene."
    ), T = f(
      "EIDOLON.TimeTrigger.SceneRealTimeDisable",
      "Disable automatic real-time flow for this scene."
    ), p = f(
      "EIDOLON.TimeTrigger.SceneRealTimeManageDisabled",
      "Enable Manage Time in module settings to allow automatic real-time flow."
    );
    return {
      formattedTime: r,
      deltas: d,
      manageTimeEnabled: g,
      sceneAllowsRealTime: m,
      realTimeButtonLabel: g ? m ? T : y : p,
      isGM: ((E = game.user) == null ? void 0 : E.isGM) ?? !1,
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
  async close(i = {}) {
    var r, o;
    if (!i.force)
      return (this.rendered ?? this.isRendered ?? !1) || (L("TimeTriggerWindow close request rerendering", {
        sceneId: ((r = this.scene) == null ? void 0 : r.id) ?? null
      }), this.render({ force: !0 })), this;
    L("Closing time trigger window", { sceneId: ((o = this.scene) == null ? void 0 : o.id) ?? null, force: !0 });
    const n = await super.close(i);
    return S(this, W, Oa).call(this), S(this, W, va).call(this), n;
  }
  async _advanceTime(i) {
    var r, o, a, l, c, u, d;
    const n = i * 60;
    if (L("Advancing world time", { sceneId: ((r = this.scene) == null ? void 0 : r.id) ?? null, minutes: i, seconds: n }), !((o = game.user) != null && o.isGM)) {
      (l = (a = ui.notifications) == null ? void 0 : a.warn) == null || l.call(a, f("EIDOLON.TimeTrigger.GMOnly", "Only the GM can adjust time."));
      return;
    }
    try {
      await game.time.advance(n);
    } catch (g) {
      console.error(`${I} | Failed to advance time`, g), (u = (c = ui.notifications) == null ? void 0 : c.error) == null || u.call(
        c,
        f("EIDOLON.TimeTrigger.Error", "Failed to update the world time.")
      ), L("Failed to advance time from window", {
        sceneId: ((d = this.scene) == null ? void 0 : d.id) ?? null,
        minutes: i,
        message: (g == null ? void 0 : g.message) ?? String(g)
      });
    }
  }
  _onRender(i, n) {
    var o;
    super._onRender(i, n);
    const r = this.element;
    if (r) {
      if (this.showControls) {
        L("Binding time trigger interactions", {
          sceneId: ((o = this.scene) == null ? void 0 : o.id) ?? null,
          buttonCount: r.querySelectorAll("[data-delta]").length
        }), r.querySelectorAll("[data-delta]").forEach((u) => {
          u.addEventListener("click", h(this, Ln));
        });
        const a = r.querySelector('.time-trigger-window__time-value[data-editable="true"]');
        a && a.addEventListener("dblclick", h(this, Sn), { once: !1 });
        const l = r.querySelector(".time-trigger-window__time-input");
        l && (l.addEventListener("keydown", h(this, In)), l.addEventListener("blur", h(this, wn)), typeof l.focus == "function" && (l.focus(), typeof l.select == "function" && l.select()));
        const c = r.querySelector('[data-action="toggle-real-time"]');
        c && c.addEventListener("click", h(this, vn));
      }
      this._suppressBlurCommit = !1;
    }
  }
};
Et = new WeakMap(), Ct = new WeakMap(), W = new WeakSet(), Ca = /* @__PURE__ */ s(function() {
  var c;
  const i = (c = game.time) == null ? void 0 : c.worldTime;
  if (typeof i != "number" || !Number.isFinite(i)) return "";
  const n = 1440 * 60, r = (Math.floor(i) % n + n) % n, o = Math.floor(r / 3600), a = Math.floor(r % 3600 / 60), l = r % 60;
  return mn({ hours: o, minutes: a, seconds: l }, ut());
}, "#formatFallbackTime"), Ln = new WeakMap(), Sn = new WeakMap(), La = /* @__PURE__ */ s(function() {
  var i;
  (i = game.user) != null && i.isGM && (this.isEditingTime = !0, this._suppressBlurCommit = !1, this.editValue = S(this, W, Fr).call(this), this.render({ force: !0 }));
}, "#enterTimeEditMode"), Ar = /* @__PURE__ */ s(function() {
  this.isEditingTime = !1, this.editValue = "", this._suppressBlurCommit = !1, this.render({ force: !0 });
}, "#cancelTimeEdit"), Dr = /* @__PURE__ */ s(async function(i) {
  var o, a, l;
  if (!((o = game.user) != null && o.isGM) || !this.isEditingTime || this._commitTimeInProgress) return;
  this._commitTimeInProgress = !0;
  const n = typeof i == "string" ? i.trim() : "";
  if (!n) {
    S(this, W, Ar).call(this), this._commitTimeInProgress = !1;
    return;
  }
  const r = S(this, W, wa).call(this, n);
  if (r.error) {
    (l = (a = ui.notifications) == null ? void 0 : a.error) == null || l.call(a, r.error), this._suppressBlurCommit = !0, this.editValue = n, this.render({ force: !0 }), this._commitTimeInProgress = !1;
    return;
  }
  try {
    await S(this, W, Ia).call(this, r.seconds, r.includeSeconds) ? (this.isEditingTime = !1, this.editValue = "", this.render({ force: !0 })) : (this.editValue = n, this.render({ force: !0 }));
  } finally {
    this._commitTimeInProgress = !1;
  }
}, "#commitTimeInput"), In = new WeakMap(), wn = new WeakMap(), Sa = /* @__PURE__ */ s(function() {
  var u, d;
  const i = (u = game.time) == null ? void 0 : u.worldTime;
  if (typeof i != "number" || !Number.isFinite(i))
    return "";
  const n = ((d = game.time) == null ? void 0 : d.components) ?? {}, r = Number(n.hour), o = Number(n.minute), a = n.second !== void 0 ? Number(n.second) : null, l = Number.isInteger(a);
  return (Number.isFinite(r) && Number.isFinite(o) ? Ve({
    hours: Math.max(0, Math.min(23, Number(r))),
    minutes: Math.max(0, Math.min(59, Number(o))),
    seconds: l && Number.isFinite(a) ? Math.max(0, Math.min(59, Number(a))) : void 0
  }) ?? "" : "") ?? "";
}, "#getCurrentCanonicalTime"), Ia = /* @__PURE__ */ s(async function(i, n) {
  var m, y, T, p, C, b, E, O, D, R;
  const r = (m = game.time) == null ? void 0 : m.worldTime;
  if (typeof r != "number" || !Number.isFinite(r))
    return (T = (y = ui.notifications) == null ? void 0 : y.error) == null || T.call(
      y,
      f(
        "EIDOLON.TimeTrigger.EditTimeUnavailable",
        "The world time is unavailable, so it can't be updated."
      )
    ), !1;
  if (!Number.isInteger(i) || i < 0 || i >= Pt)
    return (C = (p = ui.notifications) == null ? void 0 : p.error) == null || C.call(
      p,
      f(
        "EIDOLON.TimeTrigger.EditTimeInvalidRange",
        "Enter a time within the current day."
      )
    ), !1;
  const l = Math.floor(r / Pt) * Pt + i - r;
  if (!Number.isFinite(l) || l === 0)
    return !0;
  const c = Math.floor(i / 3600), u = Math.floor(i % 3600 / 60), d = i % 60, g = Ve({
    hours: c,
    minutes: u,
    seconds: n ? d : void 0
  });
  try {
    L("Updating world time directly", {
      sceneId: ((b = this.scene) == null ? void 0 : b.id) ?? null,
      targetCanonical: g ?? null,
      diff: l
    }), await game.time.advance(l);
    const _ = mn(
      {
        hours: c,
        minutes: u,
        seconds: n ? d : null
      },
      ut()
    );
    (O = (E = ui.notifications) == null ? void 0 : E.info) == null || O.call(
      E,
      f(
        "EIDOLON.TimeTrigger.EditTimeSuccess",
        "World time updated."
      ) + (_ ? ` ${_}` : "")
    );
  } catch (_) {
    return console.error(`${I} | Failed to set world time`, _), (R = (D = ui.notifications) == null ? void 0 : D.error) == null || R.call(
      D,
      f(
        "EIDOLON.TimeTrigger.EditTimeError",
        "Failed to update the world time."
      )
    ), !1;
  }
  return !0;
}, "#applyTargetSeconds"), wa = /* @__PURE__ */ s(function(i) {
  var g;
  const n = f(
    "EIDOLON.TimeTrigger.EditTimeInvalid",
    "Enter a valid time like 14:30 or 2:30 PM."
  );
  if (typeof i != "string")
    return { error: n };
  const r = i.trim();
  if (!r)
    return { error: n };
  const o = r.match(/^([0-9]{1,2}):([0-9]{2})(?::([0-9]{2}))?$/);
  if (o) {
    const m = Number(o[1]), y = Number(o[2]), T = o[3] !== void 0 ? Number(o[3]) : void 0;
    if (Number.isInteger(m) && m >= 0 && m <= 23 && Number.isInteger(y) && y >= 0 && y <= 59 && (T === void 0 || Number.isInteger(T) && T >= 0 && T <= 59)) {
      const p = m * 3600 + y * 60 + (T ?? 0);
      return {
        canonical: Ve({ hours: m, minutes: y, seconds: T }),
        seconds: p,
        includeSeconds: T !== void 0,
        error: null
      };
    }
    return { error: n };
  }
  const { amLower: a, pmLower: l, periodPattern: c } = S(this, W, _r).call(this), u = r.match(
    new RegExp(
      `^([0-9]{1,2}):([0-9]{2})(?::([0-9]{2}))?\\s*(${c})$`,
      "i"
    )
  );
  if (u) {
    let m = Number(u[1]);
    const y = Number(u[2]), T = u[3] !== void 0 ? Number(u[3]) : void 0, p = u[4] ?? "", C = typeof p == "string" ? ((g = p.toLocaleLowerCase) == null ? void 0 : g.call(p)) ?? p.toLowerCase() : "";
    if (Number.isInteger(m) && m >= 1 && m <= 12 && Number.isInteger(y) && y >= 0 && y <= 59 && (T === void 0 || Number.isInteger(T) && T >= 0 && T <= 59) && (C === a || C === l || C === "am" || C === "pm")) {
      m = m % 12, (C === l || C === "pm") && (m += 12);
      const E = m * 3600 + y * 60 + (T ?? 0);
      return {
        canonical: Ve({ hours: m, minutes: y, seconds: T }),
        seconds: E,
        includeSeconds: T !== void 0,
        error: null
      };
    }
    return { error: n };
  }
  const d = ga(r);
  if (d !== null) {
    const m = Math.floor(d / 3600), y = Math.floor(d % 3600 / 60), T = d % 60, p = T !== 0;
    return {
      canonical: Ve({
        hours: m,
        minutes: y,
        seconds: p ? T : void 0
      }),
      seconds: d,
      includeSeconds: p,
      error: null
    };
  }
  return { error: n };
}, "#parseInputTime"), Fr = /* @__PURE__ */ s(function() {
  const i = S(this, W, Sa).call(this);
  if (!i) return "";
  if (ut() === "24h")
    return i;
  const r = Jn(i);
  if (!r) return i;
  const o = Number(r.hours), a = Number(r.minutes), l = r.seconds !== null && r.seconds !== void 0 ? Number(r.seconds) : void 0;
  if (!Number.isFinite(o) || !Number.isFinite(a)) return i;
  const c = Number.isFinite(l), u = o % 12 === 0 ? 12 : o % 12, d = String(a).padStart(2, "0"), g = c ? `:${String(l).padStart(2, "0")}` : "", { amLabel: m, pmLabel: y } = S(this, W, _r).call(this), T = o >= 12 ? y : m;
  return `${u}:${d}${g} ${T}`.trim();
}, "#getInitialEditValue"), _r = /* @__PURE__ */ s(function() {
  var u, d;
  const i = f("EIDOLON.TimeTrigger.TimePeriodAM", "AM"), n = f("EIDOLON.TimeTrigger.TimePeriodPM", "PM"), r = ((u = i.toLocaleLowerCase) == null ? void 0 : u.call(i)) ?? i.toLowerCase(), o = ((d = n.toLocaleLowerCase) == null ? void 0 : d.call(n)) ?? n.toLowerCase(), a = S(this, W, Rr).call(this, i), l = S(this, W, Rr).call(this, n), c = `${a}|${l}|AM|PM`;
  return {
    amLabel: i,
    pmLabel: n,
    amLower: r,
    pmLower: o,
    periodPattern: c
  };
}, "#getPeriodMatchData"), Rr = /* @__PURE__ */ s(function(i) {
  return typeof i != "string" ? "" : i.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}, "#escapeForRegex"), On = new WeakMap(), vn = new WeakMap(), xr = /* @__PURE__ */ s(function() {
  const i = this.scene;
  if (!i || typeof i.getFlag != "function") return !1;
  try {
    return !!i.getFlag(I, Tr);
  } catch (n) {
    L("TimeTriggerWindow | Failed to read scene real-time flag", {
      sceneId: (i == null ? void 0 : i.id) ?? null,
      message: (n == null ? void 0 : n.message) ?? String(n)
    });
  }
  return !1;
}, "#readSceneRealTimeFlag"), Mn = new WeakMap(), Oa = /* @__PURE__ */ s(function() {
  if (typeof h(this, Et) == "function")
    try {
      h(this, Et).call(this);
    } catch (i) {
      console.error(`${I} | Failed to dispose time format subscription`, i);
    }
  v(this, Et, null);
}, "#disposeTimeFormatSubscription"), va = /* @__PURE__ */ s(function() {
  if (typeof h(this, Ct) == "function")
    try {
      h(this, Ct).call(this);
    } catch (i) {
      console.error(`${I} | Failed to dispose manage time subscription`, i);
    }
  v(this, Ct, null);
}, "#disposeManageTimeSubscription"), s(bt, "TimeTriggerWindow"), $e(bt, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  et(bt, bt, "DEFAULT_OPTIONS"),
  {
    id: `${I}-time-trigger`,
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
)), $e(bt, "PARTS", {
  content: {
    template: `modules/${I}/templates/time-trigger.html`
  }
});
let Nr = bt;
function Yn(e, t = {}) {
  if (typeof e != "function")
    throw new TypeError("createApplicationFactory requires a constructor function.");
  const i = /* @__PURE__ */ s(function(r = {}) {
    const o = foundry.utils.mergeObject(
      t ?? {},
      r ?? {},
      { inplace: !1 }
    );
    return new e(o);
  }, "applicationFactory");
  return i.__eidolonFactorySignature = "options", i.__eidolonFactoryTarget = e, i;
}
s(Yn, "createApplicationFactory");
const qo = /* @__PURE__ */ new Set();
var ue, Se, Lt, Xt, Ma, Na;
const Mo = class Mo {
  constructor({ windowFactory: t } = {}) {
    N(this, Xt);
    N(this, ue, null);
    N(this, Se, null);
    N(this, Lt);
    const i = Yn(Nr);
    typeof t == "function" ? t.__eidolonFactorySignature === "options" ? v(this, Lt, (r, o = {}) => t({ scene: r, ...o ?? {} })) : v(this, Lt, t) : v(this, Lt, /* @__PURE__ */ s((r, o = {}) => i({ scene: r, ...o ?? {} }), "fallbackFactory"));
  }
  onReady() {
    var i;
    const t = typeof ((i = game.time) == null ? void 0 : i.worldTime) == "number" && Number.isFinite(game.time.worldTime) ? game.time.worldTime : null;
    L("TimeTriggerManager#onReady", { worldTime: t }), t !== null && v(this, Se, t);
  }
  onCanvasReady(t) {
    const i = (t == null ? void 0 : t.scene) ?? si();
    L("TimeTriggerManager#onCanvasReady", { sceneId: (i == null ? void 0 : i.id) ?? null }), this.refreshTimeTriggerWindow(i), this.handleTimeTriggerEvaluation(i);
  }
  onUpdateScene(t) {
    const i = si();
    L("TimeTriggerManager#onUpdateScene", {
      sceneId: (t == null ? void 0 : t.id) ?? null,
      activeSceneId: (i == null ? void 0 : i.id) ?? null
    }), !(!i || t.id !== i.id) && (this.refreshTimeTriggerWindow(t), this.handleTimeTriggerEvaluation(t));
  }
  onUpdateWorldTime(t, i) {
    L("TimeTriggerManager#onUpdateWorldTime", {
      worldTime: t,
      diff: i,
      hasWindow: !!h(this, ue)
    }), h(this, ue) && h(this, ue).render();
    const n = si(), r = S(this, Xt, Ma).call(this, t, i);
    this.handleTimeTriggerEvaluation(n, t, r);
  }
  refreshTimeTriggerWindow(t) {
    var c, u, d;
    if (!t) return;
    const i = !!((c = game.user) != null && c.isGM), n = !!t.getFlag(I, cn), r = !!t.getFlag(I, pr), o = !!t.getFlag(I, yr);
    if (L("TimeTriggerManager#refreshTimeTriggerWindow", {
      sceneId: t.id,
      isGM: i,
      isActive: n,
      hideWindow: r,
      showPlayerWindow: o
    }), !(n && !r && (i || o))) {
      h(this, ue) && (L("Closing time trigger window", { reason: "not-visible" }), h(this, ue).close({ force: !0 }), v(this, ue, null));
      return;
    }
    const l = !!i;
    if (h(this, ue) && ((u = h(this, ue).scene) == null ? void 0 : u.id) === t.id) {
      L("Refreshing existing time trigger window", { sceneId: t.id }), h(this, ue).showControls = l, h(this, ue).render();
      return;
    }
    h(this, ue) && (L("Closing existing window before creating new instance", {
      previousSceneId: ((d = h(this, ue).scene) == null ? void 0 : d.id) ?? null
    }), h(this, ue).close({ force: !0 })), v(this, ue, h(this, Lt).call(this, t, { showControls: l })), L("Rendering new time trigger window", { sceneId: t.id }), h(this, ue).render({ force: !0 });
  }
  async handleTimeTriggerEvaluation(t, i, n) {
    var c;
    const r = t ?? si();
    if (!r) {
      L("handleTimeTriggerEvaluation skipped", {
        reason: "no-active-scene",
        providedSceneId: (t == null ? void 0 : t.id) ?? null,
        currentWorldTime: i
      }), typeof i == "number" && Number.isFinite(i) && v(this, Se, i);
      return;
    }
    const o = typeof i == "number" && Number.isFinite(i) ? i : typeof ((c = game.time) == null ? void 0 : c.worldTime) == "number" ? game.time.worldTime : null;
    if (o === null) return;
    const a = typeof n == "number" && Number.isFinite(n) ? n : null, l = a !== null ? a : typeof h(this, Se) == "number" && Number.isFinite(h(this, Se)) ? h(this, Se) : o;
    Jt("handleTimeTriggerEvaluation", {
      sceneId: r.id,
      previousWorldTime: l,
      currentWorldTime: o,
      overrideProvided: a !== null
    });
    try {
      await S(this, Xt, Na).call(this, r, l, o);
    } catch (u) {
      console.error(`${I} | Unexpected error while evaluating time triggers`, u), L("handleTimeTriggerEvaluation error", { message: (u == null ? void 0 : u.message) ?? String(u) });
    } finally {
      v(this, Se, o), ct();
    }
  }
};
ue = new WeakMap(), Se = new WeakMap(), Lt = new WeakMap(), Xt = new WeakSet(), Ma = /* @__PURE__ */ s(function(t, i) {
  return typeof h(this, Se) == "number" && Number.isFinite(h(this, Se)) ? (L("Resolved previous world time from cache", {
    previousWorldTime: h(this, Se)
  }), h(this, Se)) : typeof t == "number" && Number.isFinite(t) && typeof i == "number" && Number.isFinite(i) ? (L("Resolved previous world time using diff", {
    worldTime: t,
    diff: i,
    resolved: t - i
  }), t - i) : typeof t == "number" && Number.isFinite(t) ? t : null;
}, "#resolvePreviousWorldTime"), Na = /* @__PURE__ */ s(async function(t, i, n) {
  var T, p, C;
  if (!((T = game.user) != null && T.isGM)) {
    L("Skipping trigger evaluation because user is not a GM");
    return;
  }
  if (!(t != null && t.id)) {
    L("Skipping trigger evaluation because the scene is missing an id");
    return;
  }
  if (!!!t.getFlag(I, cn)) {
    L("Skipping trigger evaluation because scene is inactive", { sceneId: t.id });
    return;
  }
  if (typeof n != "number" || !Number.isFinite(n)) return;
  (typeof i != "number" || !Number.isFinite(i)) && (i = n);
  const o = Bt(t);
  if (!o.length) {
    L("No time triggers configured for scene", { sceneId: t.id });
    return;
  }
  const a = Xs(t), l = /* @__PURE__ */ new Set();
  for (const b of o)
    b != null && b.id && l.add(b.id);
  let c = !1;
  for (const b of Object.keys(a))
    l.has(b) || (delete a[b], c = !0);
  if (Jt("Evaluating scene time triggers", {
    sceneId: t.id,
    previousWorldTime: i,
    currentWorldTime: n,
    triggerCount: o.length
  }), n <= i) {
    L("Detected world time rewind", {
      previousWorldTime: i,
      currentWorldTime: n
    });
    for (const b of o) {
      if (!(b != null && b.id) || !b.allowReplayOnRewind) continue;
      const E = a[b.id];
      typeof E == "number" ? n < E ? (L("Clearing trigger history due to rewind", {
        triggerId: b.id,
        lastFired: E,
        currentWorldTime: n
      }), delete a[b.id], c = !0) : L("Preserving trigger history after rewind", {
        triggerId: b.id,
        lastFired: E,
        currentWorldTime: n
      }) : L("No history stored for rewind-enabled trigger", {
        triggerId: b.id
      });
    }
    c && (L("Persisting history cleanup after rewind", {
      sceneId: t.id
    }), await ur(t, a)), ct();
    return;
  }
  const u = i, d = n, g = [], m = Math.floor(u / Pt), y = Math.floor(d / Pt);
  for (const b of o) {
    if (!(b != null && b.id)) continue;
    const E = ga(b.time);
    if (E === null) {
      ul(t, b), L("Skipping trigger with invalid time", {
        triggerId: b.id,
        time: b.time
      });
      continue;
    }
    for (let O = m; O <= y; O++) {
      const D = O * Pt + E;
      if (D < u || D > d) continue;
      const _ = a[b.id];
      if (typeof _ == "number" && _ >= D) {
        L("Skipping trigger because it already fired within window", {
          triggerId: b.id,
          lastFired: _,
          absoluteTime: D
        });
        continue;
      }
      g.push({ trigger: b, absoluteTime: D });
    }
  }
  if (!g.length) {
    c && await ur(t, a), L("No triggers scheduled to fire within evaluation window", {
      sceneId: t.id
    }), ct();
    return;
  }
  g.sort((b, E) => b.absoluteTime - E.absoluteTime), L("Queued triggers for execution", {
    entries: g.map((b) => ({
      triggerId: b.trigger.id,
      absoluteTime: b.absoluteTime
    }))
  });
  for (const b of g)
    try {
      L("Executing time trigger action", {
        triggerId: b.trigger.id,
        absoluteTime: b.absoluteTime
      }), await Ea(t, b.trigger);
    } catch (E) {
      console.error(`${I} | Failed to execute time trigger action`, E), (C = (p = ui.notifications) == null ? void 0 : p.error) == null || C.call(
        p,
        f(
          "EIDOLON.TimeTrigger.TriggerActionError",
          "Failed to execute a scene time trigger action. Check the console for details."
        )
      ), L("Trigger execution failed", {
        triggerId: b.trigger.id,
        message: (E == null ? void 0 : E.message) ?? String(E)
      });
    } finally {
      a[b.trigger.id] = b.absoluteTime, c = !0, L("Recorded trigger execution", {
        triggerId: b.trigger.id,
        absoluteTime: b.absoluteTime
      });
    }
  c && (L("Persisting trigger history updates", { sceneId: t.id }), await ur(t, a)), ct();
}, "#evaluateSceneTimeTriggers"), s(Mo, "TimeTriggerManager");
let kr = Mo;
function ul(e, t) {
  var r, o;
  const i = `${(e == null ? void 0 : e.id) ?? "unknown"}:${(t == null ? void 0 : t.id) ?? (t == null ? void 0 : t.time) ?? "unknown"}`;
  if (qo.has(i)) return;
  qo.add(i);
  const n = f(
    "EIDOLON.TimeTrigger.InvalidTimeWarning",
    "A scene time trigger has an invalid time value and was skipped."
  );
  (o = (r = ui.notifications) == null ? void 0 : r.warn) == null || o.call(r, n), console.warn(`${I} | Invalid time for trigger`, { scene: e == null ? void 0 : e.id, trigger: t });
}
s(ul, "warnInvalidTriggerTime");
var Fe, pi, _e, nt, St, qe, Gt, Nn, An, yi, Ti, It, Ue, k, $r, kt, Ji, Pr, Yi, Br, Be, Aa, qr, Da, Ur, Fa, Dn, Fn, _n, Rn, xn, kn, Vr, _a, Qi, Hn, $n;
const No = class No {
  constructor() {
    N(this, k);
    N(this, Fe, !1);
    N(this, pi, Fi);
    N(this, _e, /* @__PURE__ */ new Map());
    N(this, nt, null);
    N(this, St, null);
    N(this, qe, 0);
    N(this, Gt, null);
    N(this, Nn, null);
    N(this, An, null);
    N(this, yi, !1);
    N(this, Ti, !1);
    N(this, It, !1);
    N(this, Ue, !1);
    N(this, Dn, /* @__PURE__ */ s((t, i = {}) => {
      L("GameTimeAutomation | Pause state changed", {
        paused: t,
        userId: (i == null ? void 0 : i.userId) ?? null,
        broadcast: (i == null ? void 0 : i.broadcast) ?? null
      }), S(this, k, Be).call(this, { pausedOverride: t });
    }, "#handlePause"));
    N(this, Fn, /* @__PURE__ */ s((t) => {
      t != null && t.id && (h(this, _e).set(t.id, Math.max(t.round ?? 0, 1)), L("GameTimeAutomation | Combat started", { combatId: t.id, round: t.round ?? 0 }), S(this, k, Be).call(this));
    }, "#handleCombatStart"));
    N(this, _n, /* @__PURE__ */ s((t, i) => {
      if (!(t != null && t.id)) return;
      const n = typeof i == "number" && Number.isFinite(i) ? i : typeof t.round == "number" && Number.isFinite(t.round) ? t.round : 0, r = n > 0 ? n : 1, o = h(this, _e).get(t.id), a = o ? Math.max(o, 1) : 1, l = r > 1 ? Math.max(r - a, 0) : 0;
      if (L("GameTimeAutomation | Combat round change detected", {
        combatId: t.id,
        effectiveRound: r,
        completedRounds: l,
        enabled: h(this, Fe),
        paused: (game == null ? void 0 : game.paused) ?? null
      }), l > 0 && h(this, Fe) && h(this, Ue) && !(game != null && game.paused) && S(this, k, kt).call(this) && S(this, k, Ji).call(this, t)) {
        const c = l * h(this, pi);
        c > 0 && (L("GameTimeAutomation | Advancing time for completed combat rounds", {
          combatId: t.id,
          completedRounds: l,
          delta: c
        }), S(this, k, Ur).call(this, c));
      }
      h(this, _e).set(t.id, Math.max(r, 1));
    }, "#handleCombatRound"));
    N(this, Rn, /* @__PURE__ */ s((t) => {
      t != null && t.id && (h(this, _e).delete(t.id), L("GameTimeAutomation | Combat ended", { combatId: t.id }), S(this, k, Be).call(this));
    }, "#handleCombatEnd"));
    N(this, xn, /* @__PURE__ */ s((t) => {
      t != null && t.id && (h(this, _e).delete(t.id), L("GameTimeAutomation | Combat deleted", { combatId: t.id }), S(this, k, Be).call(this));
    }, "#handleCombatDelete"));
    N(this, kn, /* @__PURE__ */ s((t, i) => {
      if (t != null && t.id) {
        if (typeof (i == null ? void 0 : i.round) == "number" && Number.isFinite(i.round)) {
          const n = Math.max(i.round, 1);
          h(this, _e).set(t.id, n), L("GameTimeAutomation | Combat round manually updated", {
            combatId: t.id,
            round: n
          });
        }
        (Object.prototype.hasOwnProperty.call(i ?? {}, "active") || (i == null ? void 0 : i.round) !== void 0) && S(this, k, Be).call(this);
      }
    }, "#handleCombatUpdate"));
    N(this, Hn, /* @__PURE__ */ s((t) => {
      S(this, k, Qi).call(this, t == null ? void 0 : t.scene), S(this, k, Be).call(this);
    }, "#handleCanvasReady"));
    N(this, $n, /* @__PURE__ */ s((t) => {
      if (!Ce(t)) return;
      const i = S(this, k, Vr).call(this);
      if (!i || i.id !== t.id) return;
      S(this, k, Qi).call(this, t) && S(this, k, Be).call(this);
    }, "#handleSceneUpdate"));
  }
  registerHooks() {
    h(this, yi) || (v(this, yi, !0), Hooks.on("pauseGame", h(this, Dn)), Hooks.on("combatStart", h(this, Fn)), Hooks.on("combatRound", h(this, _n)), Hooks.on("combatEnd", h(this, Rn)), Hooks.on("deleteCombat", h(this, xn)), Hooks.on("updateCombat", h(this, kn)), Hooks.on("canvasReady", h(this, Hn)), Hooks.on("updateScene", h(this, $n)));
  }
  initialize() {
    h(this, Ti) || (v(this, Ti, !0), v(this, Nn, pa((t) => {
      const i = !!t, n = i !== h(this, Fe);
      v(this, Fe, i), L("GameTimeAutomation | Manage time toggled", { enabled: i }), n && i && S(this, k, Br).call(this), S(this, k, Be).call(this);
    })), v(this, An, Js((t) => {
      v(this, pi, t), L("GameTimeAutomation | Seconds per round updated", { value: t });
    })), S(this, k, Br).call(this), S(this, k, Qi).call(this), S(this, k, Be).call(this));
  }
};
Fe = new WeakMap(), pi = new WeakMap(), _e = new WeakMap(), nt = new WeakMap(), St = new WeakMap(), qe = new WeakMap(), Gt = new WeakMap(), Nn = new WeakMap(), An = new WeakMap(), yi = new WeakMap(), Ti = new WeakMap(), It = new WeakMap(), Ue = new WeakMap(), k = new WeakSet(), $r = /* @__PURE__ */ s(function() {
  var t;
  try {
    if (typeof ((t = globalThis.performance) == null ? void 0 : t.now) == "function")
      return globalThis.performance.now();
  } catch (i) {
    L("GameTimeAutomation | Failed to read high-resolution timestamp", {
      message: (i == null ? void 0 : i.message) ?? String(i)
    });
  }
  return Date.now();
}, "#currentTimestamp"), kt = /* @__PURE__ */ s(function() {
  var t;
  return !!((t = game == null ? void 0 : game.user) != null && t.isGM && game.user.active !== !1);
}, "#canControlTime"), Ji = /* @__PURE__ */ s(function(t) {
  var n, r;
  if (!t) return !1;
  if (t.active === !0) return !0;
  if (t.active === !1) return !1;
  const i = (n = game == null ? void 0 : game.combats) == null ? void 0 : n.active;
  return (i == null ? void 0 : i.id) === t.id ? !0 : ((r = game == null ? void 0 : game.combat) == null ? void 0 : r.id) === t.id ? game.combat.active ?? !0 : !1;
}, "#isCombatDocumentActive"), Pr = /* @__PURE__ */ s(function(t) {
  return t ? typeof t.started == "boolean" ? t.started : (t.round ?? 0) > 0 : !1;
}, "#hasCombatStarted"), Yi = /* @__PURE__ */ s(function() {
  var n;
  const t = Array.isArray((n = game == null ? void 0 : game.combats) == null ? void 0 : n.contents) ? game.combats.contents : [];
  for (const r of t)
    if (S(this, k, Ji).call(this, r) && S(this, k, Pr).call(this, r))
      return !0;
  const i = game == null ? void 0 : game.combat;
  return !!(i && S(this, k, Ji).call(this, i) && S(this, k, Pr).call(this, i));
}, "#isCombatRunning"), Br = /* @__PURE__ */ s(function() {
  var i;
  h(this, _e).clear();
  const t = Array.isArray((i = game == null ? void 0 : game.combats) == null ? void 0 : i.contents) ? game.combats.contents : [];
  for (const n of t)
    n != null && n.id && h(this, _e).set(n.id, Math.max(n.round ?? 0, 1));
}, "#hydrateRoundTracking"), Be = /* @__PURE__ */ s(function({ pausedOverride: t } = {}) {
  const i = typeof t == "boolean" ? t : !!(game != null && game.paused), n = h(this, Fe), r = h(this, Ue), o = n && r, a = {
    manageTimeEnabled: n,
    sceneAllowsRealTime: r,
    effectiveEnabled: o,
    paused: i,
    canControl: S(this, k, kt).call(this),
    combatRunning: S(this, k, Yi).call(this),
    overrideApplied: typeof t == "boolean"
  };
  if (L("GameTimeAutomation | Sync running state", a), !o || !S(this, k, kt).call(this)) {
    S(this, k, qr).call(this);
    return;
  }
  S(this, k, Aa).call(this);
}, "#syncRunningState"), Aa = /* @__PURE__ */ s(function() {
  h(this, nt) === null && (v(this, St, S(this, k, $r).call(this)), v(this, nt, globalThis.setInterval(() => S(this, k, Da).call(this), 1e3)), L("GameTimeAutomation | Started real-time ticker"));
}, "#startRealTimeTicker"), qr = /* @__PURE__ */ s(function() {
  h(this, nt) !== null && (globalThis.clearInterval(h(this, nt)), v(this, nt, null), L("GameTimeAutomation | Stopped real-time ticker")), v(this, St, null), v(this, qe, 0), v(this, It, !1);
}, "#stopRealTimeTicker"), Da = /* @__PURE__ */ s(function() {
  if (!h(this, Fe) || !h(this, Ue) || !S(this, k, kt).call(this)) {
    S(this, k, qr).call(this);
    return;
  }
  const t = S(this, k, $r).call(this);
  if (typeof t != "number" || !Number.isFinite(t)) return;
  const i = h(this, St) ?? t, n = (t - i) / 1e3;
  if (v(this, St, t), !Number.isFinite(n) || n <= 0) return;
  const r = !!(game != null && game.paused), o = S(this, k, Yi).call(this);
  if (r || o) {
    h(this, It) || L("GameTimeAutomation | Tick skipped", { paused: r, combatRunning: o }), v(this, It, !0), v(this, qe, 0);
    return;
  }
  v(this, It, !1), L("GameTimeAutomation | Real-time tick", { deltaSeconds: n }), S(this, k, Ur).call(this, n);
}, "#tickRealTime"), Ur = /* @__PURE__ */ s(function(t) {
  if (!h(this, Fe) || !h(this, Ue)) return;
  const i = Number(t);
  !Number.isFinite(i) || i <= 0 || (v(this, qe, h(this, qe) + i), !h(this, Gt) && v(this, Gt, S(this, k, Fa).call(this)));
}, "#queueAdvance"), Fa = /* @__PURE__ */ s(async function() {
  var t, i;
  for (; h(this, qe) > 0; ) {
    if (!h(this, Fe) || !h(this, Ue) || game != null && game.paused || !S(this, k, kt).call(this) || S(this, k, Yi).call(this)) {
      v(this, qe, 0);
      break;
    }
    const n = h(this, qe);
    v(this, qe, 0);
    try {
      if (typeof ((t = game == null ? void 0 : game.time) == null ? void 0 : t.advance) == "function")
        L("GameTimeAutomation | Advancing world time", { delta: n }), await game.time.advance(n), L("GameTimeAutomation | World time advanced", {
          worldTime: ((i = game.time) == null ? void 0 : i.worldTime) ?? null
        });
      else {
        console.warn(`${I} | game.time.advance is unavailable; cannot manage world time.`);
        break;
      }
    } catch (r) {
      console.error(`${I} | Failed to advance world time`, r);
      break;
    }
  }
  v(this, Gt, null);
}, "#flushAdvanceQueue"), Dn = new WeakMap(), Fn = new WeakMap(), _n = new WeakMap(), Rn = new WeakMap(), xn = new WeakMap(), kn = new WeakMap(), Vr = /* @__PURE__ */ s(function() {
  const t = si();
  return Ce(t) ? t : null;
}, "#getActiveSceneDocument"), _a = /* @__PURE__ */ s(function(t) {
  if (!Ce(t)) return !1;
  try {
    return !!t.getFlag(I, Tr);
  } catch (i) {
    return L("GameTimeAutomation | Failed to read scene real-time flag", {
      sceneId: (t == null ? void 0 : t.id) ?? null,
      message: (i == null ? void 0 : i.message) ?? String(i)
    }), !1;
  }
}, "#isSceneRealTimeAllowed"), Qi = /* @__PURE__ */ s(function(t) {
  const i = Ce(t) ? t : S(this, k, Vr).call(this), n = S(this, k, _a).call(this, i), r = h(this, Ue);
  return v(this, Ue, n), r !== n ? (L("GameTimeAutomation | Scene real-time allowance changed", {
    sceneId: (i == null ? void 0 : i.id) ?? null,
    allows: n
  }), !0) : !1;
}, "#refreshSceneAutomationState"), Hn = new WeakMap(), $n = new WeakMap(), s(No, "GameTimeAutomation");
let Hr = No;
var ca, rt, ye, wt, Ye, Pn, ce, Ra, xa, ka, Ha, Bn, zr, qn, $a, Un, Pa, Ba;
const Ke = class Ke extends xi(Ri) {
  constructor(i = {}) {
    const { scene: n, trigger: r, triggerIndex: o, onSave: a, ...l } = i ?? {};
    super(l);
    N(this, ce);
    N(this, rt, null);
    N(this, ye, null);
    N(this, wt, null);
    N(this, Ye, null);
    N(this, Pn, /* @__PURE__ */ s(() => {
      (this.rendered ?? this.isRendered ?? !1) && (v(this, Ye, S(this, ce, Ra).call(this)), this.render({ force: !0 }));
    }, "#handleTimeFormatChange"));
    N(this, Bn, /* @__PURE__ */ s((i) => {
      var o, a;
      const n = i.currentTarget, r = n == null ? void 0 : n.closest("form");
      r && (L("Trigger action selection changed", {
        sceneId: ((o = this.scene) == null ? void 0 : o.id) ?? null,
        triggerId: ((a = this.trigger) == null ? void 0 : a.id) ?? null,
        actionId: (n == null ? void 0 : n.value) ?? null
      }), S(this, ce, zr).call(this, n.value, r));
    }, "#onActionSelectChange"));
    N(this, qn, /* @__PURE__ */ s((i) => {
      var u, d, g, m;
      i.preventDefault();
      const n = i.currentTarget, r = n == null ? void 0 : n.closest("form");
      if (!r) return;
      const o = (u = n.dataset) == null ? void 0 : u.target;
      if (!o) return;
      const a = typeof (CSS == null ? void 0 : CSS.escape) == "function" ? CSS.escape : (y) => y, l = r.querySelector(`[name="${a(o)}"]`);
      if (!l) return;
      L("Opening file picker for trigger", {
        sceneId: ((d = this.scene) == null ? void 0 : d.id) ?? null,
        triggerId: ((g = this.trigger) == null ? void 0 : g.id) ?? null,
        target: o
      }), new FilePicker({
        type: ((m = n.dataset) == null ? void 0 : m.type) || "audio",
        current: l.value,
        callback: /* @__PURE__ */ s((y) => {
          var T, p;
          l.value = y, l.dispatchEvent(new Event("change")), L("Trigger form file selected", {
            sceneId: ((T = this.scene) == null ? void 0 : T.id) ?? null,
            triggerId: ((p = this.trigger) == null ? void 0 : p.id) ?? null,
            target: o,
            path: y
          });
        }, "callback")
      }).render({ force: !0 });
    }, "#onFilePicker"));
    N(this, Un, /* @__PURE__ */ s(async (i) => {
      var r, o;
      i.preventDefault();
      const n = i.currentTarget;
      n instanceof HTMLFormElement && (L("Trigger form submitted", {
        sceneId: ((r = this.scene) == null ? void 0 : r.id) ?? null,
        triggerId: ((o = this.trigger) == null ? void 0 : o.id) ?? null
      }), await S(this, ce, Pa).call(this, n));
    }, "#onSubmit"));
    this.scene = n ?? null, this.trigger = r ?? null, this.triggerIndex = Number.isInteger(o) ? Number(o) : null, this.onSave = typeof a == "function" ? a : null, v(this, wt, mo(h(this, Pn)));
  }
  async _prepareContext() {
    var i, n;
    Jt("TriggerFormApplication#_prepareContext", {
      sceneId: ((i = this.scene) == null ? void 0 : i.id) ?? null,
      triggerId: ((n = this.trigger) == null ? void 0 : n.id) ?? null,
      triggerIndex: this.triggerIndex
    });
    try {
      const r = this.trigger ?? { action: Ki, data: {} }, o = r.action ?? Ki, a = Bo(r.time), l = a.format ?? "12h", c = l === "12h" ? cl() : [], u = a.period ?? (c.length > 0 ? c[0].value : null), d = l === "12h" ? c.map((y) => ({
        ...y,
        selected: y.value === u
      })) : [], g = Po().map((y) => ({
        id: y.id,
        label: typeof y.label == "function" ? y.label() : y.label,
        selected: y.id === o
      })), m = Po().map((y) => {
        const T = y.id === r.action ? r : { ...r, action: y.id }, p = il(T);
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
        actions: g,
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
      ct();
    }
  }
  _onRender(i, n) {
    var c, u, d;
    super._onRender(i, n);
    const r = this.element;
    if (!r) return;
    L("Trigger form rendered", {
      sceneId: ((c = this.scene) == null ? void 0 : c.id) ?? null,
      triggerId: ((u = this.trigger) == null ? void 0 : u.id) ?? null
    });
    const o = Array.from(((d = document == null ? void 0 : document.body) == null ? void 0 : d.classList) ?? []).find(
      (g) => g.startsWith("theme-")
    );
    o && r.classList.add(o);
    const a = r.querySelector("form");
    if (!a) return;
    S(this, ce, $a).call(this, a), S(this, ce, xa).call(this, a), a.addEventListener("submit", h(this, Un));
    const l = a.querySelector("[data-action-select]");
    l && (l.addEventListener("change", h(this, Bn)), S(this, ce, zr).call(this, l.value, a)), a.querySelectorAll("[data-action-file-picker]").forEach((g) => {
      g.addEventListener("click", h(this, qn));
    });
  }
  async close(i = {}) {
    var n;
    if ((n = h(this, rt)) == null || n.call(this), v(this, rt, null), v(this, ye, null), v(this, Ye, null), typeof h(this, wt) == "function")
      try {
        h(this, wt).call(this);
      } catch (r) {
        console.error(`${I} | Failed to dispose trigger form time format subscription`, r);
      }
    return v(this, wt, null), super.close(i);
  }
};
rt = new WeakMap(), ye = new WeakMap(), wt = new WeakMap(), Ye = new WeakMap(), Pn = new WeakMap(), ce = new WeakSet(), Ra = /* @__PURE__ */ s(function() {
  var l, c, u, d, g, m, y;
  const i = (c = (l = this.element) == null ? void 0 : l.querySelector) == null ? void 0 : c.call(l, "form");
  if (!(i instanceof HTMLFormElement)) return null;
  const n = Array.from(i.elements ?? []), r = [];
  for (const T of n)
    if ((T instanceof HTMLInputElement || T instanceof HTMLSelectElement || T instanceof HTMLTextAreaElement) && T.name && !(((u = T.dataset) == null ? void 0 : u.timeHidden) !== void 0 || ((d = T.dataset) == null ? void 0 : d.timeHour) !== void 0 || ((g = T.dataset) == null ? void 0 : g.timeMinute) !== void 0 || ((m = T.dataset) == null ? void 0 : m.timePeriod) !== void 0)) {
      if (T instanceof HTMLInputElement) {
        if (T.type === "checkbox" || T.type === "radio") {
          r.push({
            kind: T.type,
            name: T.name,
            value: T.value,
            checked: T.checked
          });
          continue;
        }
        r.push({
          kind: "value",
          name: T.name,
          value: T.value
        });
        continue;
      }
      if (T instanceof HTMLSelectElement) {
        T.multiple ? r.push({
          kind: "select-multiple",
          name: T.name,
          values: Array.from(T.selectedOptions ?? []).map((p) => p.value)
        }) : r.push({
          kind: "value",
          name: T.name,
          value: T.value
        });
        continue;
      }
      r.push({
        kind: "value",
        name: T.name,
        value: T.value
      });
    }
  const o = i.querySelector("[data-time-format]");
  let a = null;
  if (o instanceof HTMLElement) {
    const T = o.querySelector("[data-time-hidden]"), p = o.querySelector("[data-time-hour]"), C = o.querySelector("[data-time-minute]"), b = o.querySelector("[data-time-period]");
    a = {
      format: ((y = o.dataset) == null ? void 0 : y.timeFormat) ?? null,
      canonical: T instanceof HTMLInputElement ? T.value : "",
      hour: p instanceof HTMLInputElement ? p.value : "",
      minute: C instanceof HTMLInputElement ? C.value : "",
      period: b instanceof HTMLSelectElement ? b.value : ""
    };
  }
  return {
    fields: r,
    time: a
  };
}, "#captureFormState"), xa = /* @__PURE__ */ s(function(i) {
  if (!h(this, Ye)) return;
  if (!(i instanceof HTMLFormElement)) {
    v(this, Ye, null);
    return;
  }
  const { fields: n = [], time: r = null } = h(this, Ye) ?? {};
  v(this, Ye, null), S(this, ce, ka).call(this, i, n), S(this, ce, Ha).call(this, i, r);
}, "#restorePendingFormState"), ka = /* @__PURE__ */ s(function(i, n) {
  if (!Array.isArray(n) || n.length === 0) return;
  const r = typeof (CSS == null ? void 0 : CSS.escape) == "function" ? CSS.escape : (o) => o;
  for (const o of n) {
    if (!o || typeof o.name != "string") continue;
    const a = r(o.name);
    if (o.kind === "checkbox" || o.kind === "radio") {
      const c = `input[type="${o.kind}"][name="${a}"]`, u = i.querySelectorAll(c);
      u.forEach((d) => {
        d instanceof HTMLInputElement && (u.length === 1 || d.value === o.value) && (d.checked = !!o.checked);
      });
      continue;
    }
    if (o.kind === "select-multiple") {
      const c = i.querySelector(`select[name="${a}"]`);
      if (!(c instanceof HTMLSelectElement)) continue;
      const u = new Set(Array.isArray(o.values) ? o.values : []);
      Array.from(c.options ?? []).forEach((d) => {
        d.selected = u.has(d.value);
      });
      continue;
    }
    const l = i.querySelector(`[name="${a}"]`);
    (l instanceof HTMLInputElement || l instanceof HTMLSelectElement || l instanceof HTMLTextAreaElement) && (l.value = o.value ?? "");
  }
}, "#restoreFieldValues"), Ha = /* @__PURE__ */ s(function(i, n) {
  var E, O, D;
  const r = i.querySelector("[data-time-format]");
  if (!(r instanceof HTMLElement)) {
    typeof h(this, ye) == "function" && h(this, ye).call(this);
    return;
  }
  const o = ((E = r.dataset) == null ? void 0 : E.timeFormat) === "24h" ? "24h" : "12h", a = r.querySelector("[data-time-hour]"), l = r.querySelector("[data-time-minute]"), c = r.querySelector("[data-time-period]"), u = r.querySelector("[data-time-hidden]");
  if (!n) {
    if (a instanceof HTMLInputElement && (a.value = ""), l instanceof HTMLInputElement && (l.value = ""), c instanceof HTMLSelectElement) {
      const R = ((D = (O = c.options) == null ? void 0 : O[0]) == null ? void 0 : D.value) ?? "";
      c.value = R;
    }
    u instanceof HTMLInputElement && (u.value = ""), typeof h(this, ye) == "function" && h(this, ye).call(this);
    return;
  }
  const d = typeof n.canonical == "string" ? n.canonical : "", g = typeof n.period == "string" ? n.period : "", m = typeof n.hour == "string" ? n.hour : "", y = typeof n.minute == "string" ? n.minute : "";
  let T = "", p = "", C = g, b = d;
  if (d) {
    const R = Bo(d, o);
    T = R.hour ?? "", p = R.minute ?? "", b = R.canonical ?? d, o === "12h" ? C = R.period ?? g : C = "";
  } else
    T = m, p = y, o !== "12h" && (C = "");
  if (a instanceof HTMLInputElement && (a.value = T ?? ""), l instanceof HTMLInputElement && (l.value = p ?? ""), c instanceof HTMLSelectElement)
    if (o === "12h") {
      const R = Array.from(c.options ?? []);
      R.find((V) => V.value === C) ? c.value = C : R.length > 0 ? c.value = R[0].value : c.value = "";
    } else
      c.value = "";
  u instanceof HTMLInputElement && (u.value = b ?? ""), typeof h(this, ye) == "function" && h(this, ye).call(this);
}, "#restoreTimeInputs"), Bn = new WeakMap(), zr = /* @__PURE__ */ s(function(i, n) {
  n && n.querySelectorAll("[data-action-config]").forEach((r) => {
    const o = r.dataset.actionConfig === i;
    r.style.display = o ? "" : "none";
  });
}, "#updateActionSections"), qn = new WeakMap(), $a = /* @__PURE__ */ s(function(i) {
  var g, m, y, T;
  if ((g = h(this, rt)) == null || g.call(this), v(this, rt, null), v(this, ye, null), !(i instanceof HTMLFormElement)) return;
  const n = i.querySelector("[data-time-format]"), r = ((m = n == null ? void 0 : n.dataset) == null ? void 0 : m.timeFormat) ?? null;
  if (r !== "12h" && r !== "24h")
    return;
  const o = n.querySelector("[data-time-hidden]"), a = n.querySelector("[data-time-hour]"), l = n.querySelector("[data-time-minute]"), c = r === "12h" ? n.querySelector("[data-time-period]") : null;
  if (!o || !a || !l || r === "12h" && !c) {
    L("Trigger form time inputs missing elements", {
      format: r,
      hasHidden: !!o,
      hasHour: !!a,
      hasMinute: !!l,
      hasPeriod: !!c
    });
    return;
  }
  const u = [a, l, ...c ? [c] : []], d = /* @__PURE__ */ s(() => {
    const { canonical: p, error: C } = ll(
      {
        hour: a.value,
        minute: l.value,
        period: (c == null ? void 0 : c.value) ?? null,
        time: o.value
      },
      r
    );
    o.value = p ?? "";
    const b = C ?? "";
    o.setCustomValidity(b), u.forEach((E) => {
      E.setCustomValidity(b);
    });
  }, "update");
  u.forEach((p) => {
    p.addEventListener("input", d), p.addEventListener("change", d);
  }), d(), v(this, rt, () => {
    u.forEach((p) => {
      p.removeEventListener("input", d), p.removeEventListener("change", d);
    });
  }), v(this, ye, d), L("Trigger form configured for time input", {
    format: r,
    sceneId: ((y = this.scene) == null ? void 0 : y.id) ?? null,
    triggerId: ((T = this.trigger) == null ? void 0 : T.id) ?? null
  });
}, "#setupTimeInput"), Un = new WeakMap(), Pa = /* @__PURE__ */ s(async function(i) {
  var o, a, l, c, u;
  if (typeof h(this, ye) == "function" && h(this, ye).call(this), typeof i.checkValidity == "function" && !i.checkValidity()) {
    typeof i.reportValidity == "function" && i.reportValidity(), L("Trigger form submission blocked by validity check", {
      sceneId: ((o = this.scene) == null ? void 0 : o.id) ?? null,
      triggerId: ((a = this.trigger) == null ? void 0 : a.id) ?? null
    });
    return;
  }
  const n = new FormData(i), r = Object.fromEntries(n.entries());
  delete r.timeHour, delete r.timeMinute, delete r.timePeriod, r.allowReplayOnRewind = ((l = i.querySelector('input[name="allowReplayOnRewind"]')) == null ? void 0 : l.checked) ?? !1, L("Processing trigger form submission", {
    sceneId: ((c = this.scene) == null ? void 0 : c.id) ?? null,
    triggerId: ((u = this.trigger) == null ? void 0 : u.id) ?? null,
    allowReplayOnRewind: r.allowReplayOnRewind
  }), await S(this, ce, Ba).call(this, r), await this.close();
}, "#handleSubmit"), Ba = /* @__PURE__ */ s(async function(i) {
  var o, a, l, c, u, d;
  const n = {
    id: ((o = this.trigger) == null ? void 0 : o.id) ?? Vs(),
    time: i.time ?? "",
    action: i.action ?? Ki,
    allowReplayOnRewind: !!i.allowReplayOnRewind,
    data: {}
  };
  L("Persisting trigger from form", {
    sceneId: ((a = this.scene) == null ? void 0 : a.id) ?? null,
    triggerId: n.id,
    existingIndex: this.triggerIndex
  }), nl(n, i);
  const r = Bt(this.scene);
  this.triggerIndex !== null && r[this.triggerIndex] ? r[this.triggerIndex] = n : r.push(n);
  try {
    await ba(this.scene, r), L("Trigger list saved", {
      sceneId: ((l = this.scene) == null ? void 0 : l.id) ?? null,
      triggerCount: r.length
    });
  } catch (g) {
    throw console.error(`${I} | Failed to save time trigger`, g), (u = (c = ui.notifications) == null ? void 0 : c.error) == null || u.call(
      c,
      f(
        "EIDOLON.TimeTrigger.TriggerSaveError",
        "Failed to save the scene's time triggers."
      )
    ), g;
  }
  if (this.onSave)
    try {
      this.onSave(r);
    } catch (g) {
      console.error(`${I} | Trigger onSave callback failed`, g), L("Trigger onSave callback failed", {
        sceneId: ((d = this.scene) == null ? void 0 : d.id) ?? null,
        message: (g == null ? void 0 : g.message) ?? String(g)
      });
    }
}, "#persistTrigger"), s(Ke, "TriggerFormApplication"), $e(Ke, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  et(Ke, Ke, "DEFAULT_OPTIONS"),
  {
    id: `${I}-trigger-form`,
    classes: Array.from(
      /* @__PURE__ */ new Set([...((ca = et(Ke, Ke, "DEFAULT_OPTIONS")) == null ? void 0 : ca.classes) ?? [], "standard-form", "themed"])
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
)), $e(Ke, "PARTS", {
  content: {
    template: `modules/${I}/templates/time-trigger-form.html`
  }
});
let jr = Ke;
function Xe(e) {
  return e instanceof HTMLElement ? e : (e == null ? void 0 : e[0]) instanceof HTMLElement ? e[0] : null;
}
s(Xe, "asHTMLElement");
function Xi(e) {
  return typeof (e == null ? void 0 : e.changeTab) == "function";
}
s(Xi, "isAppV2");
function qa(e, t, i, n = {}) {
  if (Xi(e)) {
    e.changeTab(t, i, n);
    return;
  }
  if (typeof (e == null ? void 0 : e.activateTab) == "function") {
    const r = { ...n };
    i != null && (r.group = i), r.triggerCallback == null && (r.triggerCallback = !0), e.activateTab(t, r);
  }
}
s(qa, "setActiveTab");
function dl(e) {
  var i, n;
  if (!(e instanceof HTMLFormElement)) return {};
  const t = ((n = (i = foundry == null ? void 0 : foundry.applications) == null ? void 0 : i.ux) == null ? void 0 : n.FormDataExtended) ?? globalThis.FormDataExtended ?? null;
  if (!t) return {};
  try {
    const r = new t(e), o = typeof r.object == "object" ? r.object : {};
    return foundry.utils.expandObject(o);
  } catch {
    return {};
  }
}
s(dl, "readFormData");
const Uo = Symbol.for("eidolon.sceneConfig.v13PatchedTabs");
function Ua(e = {}) {
  const {
    tabId: t,
    tabLabel: i,
    getScene: n,
    isApplicable: r,
    renderContent: o,
    debugNamespace: a = "SceneConfigTab",
    onButtonCreate: l,
    onTabCreate: c,
    onAfterRender: u,
    logger: d = {},
    moduleId: g = "eidolon-utilities",
    tabIcon: m = "fa-solid fa-puzzle-piece"
  } = e ?? {};
  if (!t)
    throw new Error("createSceneConfigTabFactory requires a tabId.");
  if (typeof o != "function")
    throw new TypeError("createSceneConfigTabFactory requires a renderContent callback.");
  const y = typeof d.log == "function" ? d.log.bind(d) : (...w) => {
    var x;
    return (x = console.debug) == null ? void 0 : x.call(console, `${a}`, ...w);
  }, T = typeof d.group == "function" ? d.group.bind(d) : (...w) => {
    var x;
    return (x = console.groupCollapsed) == null ? void 0 : x.call(console, `${a}`, ...w);
  }, p = typeof d.groupEnd == "function" ? d.groupEnd.bind(d) : () => {
    var w;
    return (w = console.groupEnd) == null ? void 0 : w.call(console);
  }, C = Symbol(`EIDOLON_SCENE_CONFIG_TAB_CLEANUP_${t}`), b = typeof n == "function" ? n : () => null, E = typeof r == "function" ? r : () => !0, O = typeof i == "function" ? i : () => typeof i == "string" ? i : t;
  function D() {
    var $, P, B, q, fe;
    const w = ((P = ($ = foundry == null ? void 0 : foundry.applications) == null ? void 0 : $.sheets) == null ? void 0 : P.SceneConfig) ?? ((B = CONFIG == null ? void 0 : CONFIG.Scene) == null ? void 0 : B.sheetClass);
    if (!w || !Xi({ changeTab: (q = w.prototype) == null ? void 0 : q.changeTab })) return;
    const x = w[Uo] ?? /* @__PURE__ */ new Set();
    if (x.has(t)) return;
    x.add(t), w[Uo] = x;
    const H = (fe = w.TABS) == null ? void 0 : fe.sheet;
    if (H && Array.isArray(H.tabs) && !H.tabs.some((z) => z.id === t)) {
      const z = O({ app: null, scene: null }) ?? t;
      H.tabs.push({
        id: t,
        icon: m,
        label: z
      });
    }
    w.PARTS && !w.PARTS[t] && (w.PARTS[t] = {
      template: `modules/${g}/templates/scene-config-tab-mount.hbs`,
      scrollable: [`.tab[data-tab="${t}"]`]
    }), y("Patched v13 SceneConfig TABS/PARTS", { tabId: t });
  }
  s(D, "patchV13SceneConfig");
  function R(w, x) {
    var $, P;
    const H = b(w);
    if (!E(w, H)) {
      y("Skipped render", {
        tabId: t,
        reason: "inapplicable",
        constructor: (($ = w == null ? void 0 : w.constructor) == null ? void 0 : $.name) ?? null
      });
      return;
    }
    T("render", {
      tabId: t,
      sceneId: (H == null ? void 0 : H.id) ?? null,
      constructor: ((P = w == null ? void 0 : w.constructor) == null ? void 0 : P.name) ?? null
    });
    try {
      const B = Xe(x) ?? Xe(w.element);
      if (!B) {
        y("Missing root element", { tabId: t });
        return;
      }
      Xi(w) ? Z(w, B, H) : V(w, B, H);
    } finally {
      p();
    }
  }
  s(R, "handleRender");
  function _(w, x, H) {
    var B;
    if (!m) {
      w.textContent = x;
      return;
    }
    const $ = (B = w.querySelector("i")) == null ? void 0 : B.cloneNode(!0);
    w.textContent = "";
    const P = $ ?? document.createElement("i");
    if ($ || (P.className = m, H && (P.inert = !0)), w.append(P, " "), H) {
      const q = document.createElement("span");
      q.textContent = x, w.append(q);
    } else
      w.append(document.createTextNode(x));
  }
  s(_, "setButtonContent");
  function V(w, x, H) {
    var j, gt, Pi, ei, mt, ti, A, U, G, K, Q, te, re, ge, Ne, me;
    const P = [
      "nav.sheet-tabs[data-group]",
      "nav.tabs[data-group]",
      "nav.sheet-tabs",
      "nav.tabs"
    ].map((oe) => x.querySelector(oe)).find((oe) => oe instanceof HTMLElement), q = [
      (j = x.querySelector(".tab[data-tab]")) == null ? void 0 : j.parentElement,
      x.querySelector(".sheet-body"),
      (Pi = (gt = P == null ? void 0 : P.parentElement) == null ? void 0 : gt.querySelector) == null ? void 0 : Pi.call(gt, ":scope > .sheet-body"),
      P == null ? void 0 : P.parentElement
    ].find((oe) => oe instanceof HTMLElement), fe = ((ei = P == null ? void 0 : P.dataset) == null ? void 0 : ei.group) ?? ((A = (ti = (mt = P == null ? void 0 : P.querySelector) == null ? void 0 : mt.call(P, "a[data-group]")) == null ? void 0 : ti.dataset) == null ? void 0 : A.group) ?? ((K = (G = (U = P == null ? void 0 : P.querySelector) == null ? void 0 : U.call(P, "[data-group]")) == null ? void 0 : G.dataset) == null ? void 0 : K.group) ?? ((re = (te = (Q = q == null ? void 0 : q.querySelector) == null ? void 0 : Q.call(q, ".tab[data-group]")) == null ? void 0 : te.dataset) == null ? void 0 : re.group) ?? "main";
    if (!P || !q) {
      y("Missing navigation elements", {
        tabId: t,
        hasNav: !!P,
        hasBody: !!q
      });
      return;
    }
    let z = P.querySelector(`[data-tab="${t}"]`);
    if (!z) {
      z = document.createElement("a"), z.dataset.action = "tab", z.dataset.group = fe, z.dataset.tab = t;
      const oe = P.querySelector("a[data-tab]");
      (ge = oe == null ? void 0 : oe.classList) != null && ge.contains("item") && z.classList.add("item"), P.appendChild(z), typeof l == "function" && l({ app: w, button: z, nav: P, scene: H }), y("Created tab button", { tabId: t, group: fe });
    }
    _(z, O({ app: w, scene: H }) ?? t, Xi(w));
    let ee = q.querySelector(`.tab[data-tab="${t}"]`);
    if (!ee) {
      ee = document.createElement("div"), ee.classList.add("tab"), ee.dataset.tab = t, ee.dataset.group = fe;
      const oe = fl(q);
      q.insertBefore(ee, oe ?? null), typeof c == "function" && c({ app: w, tab: ee, body: q, scene: H }), y("Created tab container", { tabId: t, group: fe });
    }
    ((Ne = z.classList) == null ? void 0 : Ne.contains("active")) || ee.classList.contains("active") ? (z.classList.add("active"), ee.classList.add("active"), ee.removeAttribute("hidden")) : (z.classList.remove("active"), ee.classList.remove("active"), ee.setAttribute("hidden", "true"));
    const we = /* @__PURE__ */ s(() => {
      var ie, Ae;
      ((ie = z.classList) != null && ie.contains("active") || ee.classList.contains("active")) && ((Ae = z.classList) == null || Ae.add("active"), ee.classList.add("active"), ee.removeAttribute("hidden"), ee.removeAttribute("aria-hidden"), ee.style.display === "none" && (ee.style.display = ""));
    }, "ensureTabVisible"), M = /* @__PURE__ */ s(() => {
      we(), requestAnimationFrame(we);
    }, "scheduleEnsureTabVisible");
    z.dataset.eidolonEnsureSceneTabVisibility || (z.addEventListener("click", () => {
      qa(w, t, fe), requestAnimationFrame(we);
    }), z.dataset.eidolonEnsureSceneTabVisibility = "true"), dr(w, C, y);
    const $i = o({
      app: w,
      scene: H,
      tab: ee,
      tabButton: z,
      ensureTabVisible: we,
      scheduleEnsureTabVisible: M
    });
    typeof $i == "function" && Vo(w, C, $i), typeof u == "function" && u({
      app: w,
      scene: H,
      tab: ee,
      tabButton: z,
      ensureTabVisible: we,
      scheduleEnsureTabVisible: M
    }), (me = w.setPosition) == null || me.call(w, { height: "auto" });
  }
  s(V, "handleRenderV1");
  function Z(w, x, H) {
    const $ = x.querySelector(`.tab[data-tab="${t}"]`), P = x.querySelector(`nav [data-tab="${t}"]`);
    if (!$ || !P) {
      y("v2 mount not found, falling back to v1 injection", { tabId: t }), V(w, x, H);
      return;
    }
    _(P, O({ app: w, scene: H }) ?? t, !0);
    const B = /* @__PURE__ */ s(() => {
      var z;
      !((z = P.classList) != null && z.contains("active")) && !$.classList.contains("active") || ($.classList.add("active"), $.removeAttribute("hidden"), $.removeAttribute("aria-hidden"), $.style.display === "none" && ($.style.display = ""));
    }, "ensureTabVisible"), q = /* @__PURE__ */ s(() => {
      B(), requestAnimationFrame(B);
    }, "scheduleEnsureTabVisible");
    dr(w, C, y);
    const fe = o({
      app: w,
      scene: H,
      tab: $,
      tabButton: P,
      ensureTabVisible: B,
      scheduleEnsureTabVisible: q
    });
    typeof fe == "function" && Vo(w, C, fe), typeof u == "function" && u({
      app: w,
      scene: H,
      tab: $,
      tabButton: P,
      ensureTabVisible: B,
      scheduleEnsureTabVisible: q
    });
  }
  s(Z, "handleRenderV2");
  function ne(w) {
    dr(w, C, y);
  }
  s(ne, "handleClose");
  function F() {
    return Hooks.once("init", () => {
      D();
    }), Hooks.on("renderSceneConfig", R), Hooks.on("closeSceneConfig", ne), () => J();
  }
  s(F, "register");
  function J() {
    Hooks.off("renderSceneConfig", R), Hooks.off("closeSceneConfig", ne);
  }
  return s(J, "unregister"), { register: F, unregister: J };
}
s(Ua, "createSceneConfigTabFactory");
function Vo(e, t, i) {
  if (!e || typeof i != "function") return;
  const n = e == null ? void 0 : e[t];
  Array.isArray(n) || (e[t] = []), e[t].push(i);
}
s(Vo, "registerCleanup");
function dr(e, t, i) {
  if (!e) return;
  const n = e == null ? void 0 : e[t];
  if (Array.isArray(n))
    for (; n.length > 0; ) {
      const r = n.pop();
      if (typeof r == "function")
        try {
          r();
        } catch (o) {
          i("Cleanup failed", { message: (o == null ? void 0 : o.message) ?? String(o) });
        }
    }
}
s(dr, "invokeCleanup");
function fl(e) {
  if (!(e instanceof HTMLElement)) return null;
  const t = [
    ":scope > footer.sheet-footer",
    ":scope > footer.form-footer",
    ":scope > .sheet-footer",
    ":scope > .form-footer",
    ":scope > footer"
  ];
  for (const i of t) {
    const n = e.querySelector(i);
    if (n instanceof HTMLElement) return n;
  }
  return null;
}
s(fl, "findFooterElement$1");
const gl = Yn(jr), ml = `modules/${I}/templates/time-trigger-scene-tab.html`, hl = Ua({
  tabId: "time-triggers",
  tabLabel: /* @__PURE__ */ s(() => f("EIDOLON.TimeTrigger.Tab", "Time Triggers"), "tabLabel"),
  getScene: ze,
  isApplicable: bl,
  renderContent: /* @__PURE__ */ s(({ app: e, scene: t, tab: i }) => yl(e, i, t), "renderContent"),
  logger: {
    log: L,
    group: Jt,
    groupEnd: ct
  }
});
function pl() {
  return L("Registering SceneConfig render hook"), hl.register();
}
s(pl, "registerSceneConfigHook");
function yl(e, t, i) {
  if (!(t instanceof HTMLElement)) return;
  const n = Ce(i) ? i : ze(e);
  hn(e, t, n);
  const r = mo(() => {
    hn(e, t, n);
  });
  return () => {
    if (typeof r == "function")
      try {
        r();
      } catch (o) {
        console.error(
          `${I} | Failed to dispose scene config time format subscription`,
          o
        );
      }
  };
}
s(yl, "renderTimeTriggerTab");
async function hn(e, t, i) {
  var r, o;
  const n = i ?? ze(e);
  Jt("renderTimeTriggersTabContent", { sceneId: (n == null ? void 0 : n.id) ?? null });
  try {
    if (!Ce(n)) {
      const $ = f(
        "EIDOLON.TimeTrigger.Unavailable",
        "Time triggers are unavailable for this configuration sheet."
      );
      t.innerHTML = `<p class="notes">${$}</p>`, L("Scene lacks document for time triggers", { sceneId: (n == null ? void 0 : n.id) ?? null });
      return;
    }
    const a = `flags.${I}.${cn}`, l = `flags.${I}.${pr}`, c = `flags.${I}.${yr}`, u = !!n.getFlag(I, cn), d = !!n.getFlag(I, pr), g = !!n.getFlag(I, yr), m = Bt(n);
    L("Rendering time trigger list", {
      sceneId: n.id,
      isActive: u,
      shouldHideWindow: d,
      shouldShowPlayerWindow: g,
      triggerCount: m.length
    });
    const y = f("EIDOLON.TimeTrigger.Activate", "Activate Time Trigger"), T = f(
      "EIDOLON.TimeTrigger.Description",
      "Enable scene time triggers so scheduled actions can run automatically."
    ), p = f(
      "EIDOLON.TimeTrigger.HideWindowLabel",
      "Hide Floating Time Window"
    ), C = f(
      "EIDOLON.TimeTrigger.HideWindowDescription",
      "Keep the floating time control window hidden while leaving time triggers active."
    ), b = f(
      "EIDOLON.TimeTrigger.ShowPlayerWindowLabel",
      "Share Floating Time Window with Players"
    ), E = f(
      "EIDOLON.TimeTrigger.ShowPlayerWindowDescription",
      "Let non-GM players see the floating time window (without time controls)."
    ), O = f(
      "EIDOLON.TimeTrigger.TriggerListLabel",
      "Scene Time Triggers"
    ), D = f(
      "EIDOLON.TimeTrigger.TriggerListEmpty",
      "No time triggers configured for this scene."
    ), R = f("EIDOLON.TimeTrigger.AddTrigger", "Add Trigger"), _ = f("EIDOLON.TimeTrigger.EditTrigger", "Edit"), V = f("EIDOLON.TimeTrigger.DeleteTrigger", "Remove"), Z = f("EIDOLON.TimeTrigger.TriggerNow", "Trigger Now"), ne = f("EIDOLON.TimeTrigger.AtLabel", "At"), F = f("EIDOLON.TimeTrigger.DoLabel", "Do"), J = f("EIDOLON.TimeTrigger.MissingTime", "(No time set)"), w = m.map(($, P) => {
      const fe = ($.time ? sl($.time) : "") || $.time || "" || J, z = el($.action), ee = [
        `${ne} ${fe}`,
        `${F} ${z}`,
        ...tl($)
      ];
      return {
        index: P,
        summaryParts: ee,
        tooltips: {
          triggerNow: Z,
          edit: _,
          delete: V
        }
      };
    }), x = ((o = (r = foundry == null ? void 0 : foundry.applications) == null ? void 0 : r.handlebars) == null ? void 0 : o.renderTemplate) ?? (typeof renderTemplate == "function" ? renderTemplate : globalThis == null ? void 0 : globalThis.renderTemplate);
    if (typeof x != "function") {
      console.error(`${I} | renderTemplate is unavailable; cannot render scene tab.`), t.innerHTML = `<p class="notes">${D}</p>`;
      return;
    }
    let H = "";
    try {
      H = await x(ml, {
        flags: {
          active: a,
          hideWindow: l,
          showPlayerWindow: c
        },
        states: {
          isActive: u,
          hideWindow: d,
          showPlayerWindow: g
        },
        labels: {
          activate: y,
          hideWindow: p,
          showPlayerWindow: b,
          triggerList: O,
          empty: D,
          add: R
        },
        hints: {
          activate: T,
          hideWindow: C,
          showPlayerWindow: E
        },
        triggers: w,
        hasTriggers: w.length > 0
      });
    } catch ($) {
      console.error(`${I} | Failed to render time trigger scene tab template`, $), t.innerHTML = `<p class="notes">${D}</p>`;
      return;
    }
    t.innerHTML = H, Tl(e, t, n);
  } finally {
    ct();
  }
}
s(hn, "renderTimeTriggersTabContent");
function Tl(e, t, i) {
  const n = i ?? ze(e);
  if (!Ce(n)) return;
  const r = t.querySelector('[data-action="add-trigger"]');
  r && r.addEventListener("click", () => {
    L("Add trigger button clicked", { sceneId: n.id }), jo(e, { scene: n });
  }), t.querySelectorAll('[data-action="edit-trigger"]').forEach((o) => {
    o.addEventListener("click", () => {
      const a = Number(o.dataset.index);
      if (!Number.isInteger(a)) return;
      const c = Bt(n)[a];
      c && (L("Edit trigger button clicked", { sceneId: n.id, triggerId: c.id, index: a }), jo(e, { trigger: c, triggerIndex: a, scene: n }));
    });
  }), t.querySelectorAll('[data-action="delete-trigger"]').forEach((o) => {
    o.addEventListener("click", async () => {
      var u, d;
      const a = Number(o.dataset.index);
      if (!Number.isInteger(a)) return;
      const l = Bt(n), c = l[a];
      if (c) {
        l.splice(a, 1);
        try {
          L("Deleting trigger", {
            sceneId: n.id,
            index: a,
            triggerId: (c == null ? void 0 : c.id) ?? null
          }), await ba(n, l), await hn(e, t, n);
        } catch (g) {
          console.error(`${I} | Failed to delete time trigger`, g), (d = (u = ui.notifications) == null ? void 0 : u.error) == null || d.call(
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
      var u, d, g, m, y, T, p;
      const a = Number(o.dataset.index);
      if (!Number.isInteger(a)) return;
      const c = Bt(n)[a];
      if (c) {
        if (!((u = game.user) != null && u.isGM)) {
          (g = (d = ui.notifications) == null ? void 0 : d.warn) == null || g.call(
            d,
            f("EIDOLON.TimeTrigger.GMOnly", "Only the GM can adjust time.")
          );
          return;
        }
        try {
          L("Manually firing trigger", { sceneId: n.id, triggerId: c.id, index: a }), await Ea(n, c), (y = (m = ui.notifications) == null ? void 0 : m.info) == null || y.call(
            m,
            f(
              "EIDOLON.TimeTrigger.TriggerNowSuccess",
              "Triggered the selected time trigger."
            )
          );
        } catch (C) {
          console.error(`${I} | Failed to execute time trigger manually`, C), (p = (T = ui.notifications) == null ? void 0 : T.error) == null || p.call(
            T,
            f(
              "EIDOLON.TimeTrigger.TriggerNowError",
              "Failed to execute the selected time trigger."
            )
          ), L("Manual trigger execution failed", {
            sceneId: n.id,
            triggerId: c.id,
            index: a,
            message: (C == null ? void 0 : C.message) ?? String(C)
          });
        }
      }
    });
  });
}
s(Tl, "bindTimeTriggerTabEvents");
function jo(e, t = {}) {
  var a;
  const i = t.scene ?? null, n = i && Ce(i) ? i : ze(e);
  if (!Ce(n)) {
    console.warn(`${I} | Unable to open trigger form because no scene document is available.`);
    return;
  }
  L("Opening trigger form", {
    sceneId: n.id,
    triggerId: ((a = t.trigger) == null ? void 0 : a.id) ?? null,
    index: Number.isInteger(t.triggerIndex) ? Number(t.triggerIndex) : null
  }), gl({
    scene: n,
    trigger: t.trigger ?? null,
    triggerIndex: t.triggerIndex ?? null,
    onSave: /* @__PURE__ */ s(() => {
      var c, u;
      const l = (u = (c = e.element) == null ? void 0 : c[0]) == null ? void 0 : u.querySelector('.tab[data-tab="time-triggers"]');
      l && hn(e, l, n);
    }, "onSave")
  }).render({ force: !0 });
}
s(jo, "openTriggerForm");
function bl(e, t) {
  var o, a, l, c, u;
  if (!e) return !1;
  const i = ((a = (o = foundry == null ? void 0 : foundry.applications) == null ? void 0 : o.sheets) == null ? void 0 : a.SceneConfig) ?? (globalThis == null ? void 0 : globalThis.SceneConfig);
  if (i && e instanceof i) return !0;
  const n = (l = e == null ? void 0 : e.constructor) == null ? void 0 : l.name;
  if (typeof n == "string" && n.includes("SceneConfig")) return !0;
  if (t) {
    const d = globalThis == null ? void 0 : globalThis.Scene;
    if (d && t instanceof d || (t == null ? void 0 : t.documentName) === "Scene" || (t == null ? void 0 : t.documentName) === "scenes" || (t == null ? void 0 : t.collection) === "scenes") return !0;
  }
  const r = ((c = e == null ? void 0 : e.options) == null ? void 0 : c.baseApplication) ?? ((u = e == null ? void 0 : e.options) == null ? void 0 : u.id);
  return !!(typeof r == "string" && r.includes("SceneConfig"));
}
s(bl, "isRecognizedSceneConfig");
const Ui = new kr(), zo = new Hr();
function El() {
  L("Registering time trigger hooks"), Hooks.once("init", () => {
    js(), Ys(), L("Time trigger settings registered during init");
  }), pl(), L("Scene config hook registered"), zo.registerHooks(), L("Time automation hooks registered"), Hooks.once("ready", () => {
    Qs(), L("Ready hook fired"), Ui.onReady(), zo.initialize();
  }), Hooks.on("canvasReady", (e) => {
    var t;
    L("canvasReady hook received", { scene: ((t = e == null ? void 0 : e.scene) == null ? void 0 : t.id) ?? null }), Ui.onCanvasReady(e);
  }), Hooks.on("updateScene", (e) => {
    L("updateScene hook received", { scene: (e == null ? void 0 : e.id) ?? null }), Ui.onUpdateScene(e);
  }), Hooks.on("updateWorldTime", (e, t) => {
    L("updateWorldTime hook received", { worldTime: e, diff: t }), Ui.onUpdateWorldTime(e, t);
  });
}
s(El, "registerTimeTriggerHooks");
El();
const de = I, Va = "criteria", po = "state", Cl = "criteriaVersion", Ll = 1, ja = "showSceneCriteriaTab";
let Go = !1;
function Sl() {
  var e;
  if (!Go) {
    if (Go = !0, !((e = game == null ? void 0 : game.settings) != null && e.register)) {
      console.warn(`${de} | game.settings.register unavailable; scene criteria setting skipped.`);
      return;
    }
    game.settings.register(de, ja, {
      name: f("EIDOLON.SceneCriteria.ShowTabSettingName", "Show Scene Criteria Tab"),
      hint: f(
        "EIDOLON.SceneCriteria.ShowTabSettingHint",
        "Enable the Scene Config > Criteria tab for scene criteria authoring."
      ),
      scope: "world",
      config: !0,
      type: Boolean,
      default: !1,
      onChange: /* @__PURE__ */ s(() => {
        Il();
      }, "onChange")
    });
  }
}
s(Sl, "registerSceneCriteriaSettings");
function za() {
  var e;
  try {
    if ((e = game == null ? void 0 : game.settings) != null && e.get)
      return !!game.settings.get(de, ja);
  } catch (t) {
    console.error(`${de} | Failed to read Scene Criteria tab setting`, t);
  }
  return !1;
}
s(za, "getShowSceneCriteriaTabSetting");
function Il() {
  var o, a, l, c, u;
  const e = f("EIDOLON.SceneCriteria.ReloadPromptTitle", "Reload Required"), t = `<p>${f(
    "EIDOLON.SceneCriteria.ReloadPromptBody",
    "Changes to the Scene Criteria tab visibility require a reload. Reload now?"
  )}</p>`, i = typeof ((o = foundry == null ? void 0 : foundry.utils) == null ? void 0 : o.debouncedReload) == "function", n = /* @__PURE__ */ s(() => {
    i ? foundry.utils.debouncedReload() : window.location.reload();
  }, "reload"), r = (l = (a = foundry == null ? void 0 : foundry.applications) == null ? void 0 : a.api) == null ? void 0 : l.DialogV2;
  if (typeof (r == null ? void 0 : r.confirm) == "function") {
    r.confirm({
      window: { title: e },
      content: t
    }).then((d) => {
      d && n();
    });
    return;
  }
  if (typeof (Dialog == null ? void 0 : Dialog.confirm) == "function") {
    Dialog.confirm({
      title: e,
      content: t,
      yes: /* @__PURE__ */ s(() => n(), "yes"),
      no: /* @__PURE__ */ s(() => {
      }, "no")
    });
    return;
  }
  (u = (c = ui.notifications) == null ? void 0 : c.info) == null || u.call(
    c,
    f(
      "EIDOLON.SceneCriteria.ReloadNotice",
      "Please reload the world to apply Scene Criteria tab visibility changes."
    )
  );
}
s(Il, "promptReloadForSceneCriteriaTab");
const pn = "Standard";
function Me(e) {
  var i;
  const t = (i = e == null ? void 0 : e.getFlag) == null ? void 0 : i.call(e, de, Va);
  return t ? Ga(t) : [];
}
s(Me, "getSceneCriteria");
async function Qn(e, t) {
  if (!(e != null && e.setFlag)) return;
  const i = Ga(t);
  await e.setFlag(de, Va, i), await e.setFlag(de, Cl, Ll);
  const n = Yt(e, i);
  await e.setFlag(de, po, n);
}
s(Qn, "setSceneCriteria");
function Yt(e, t = null) {
  var r;
  const i = Array.isArray(t) ? t : Me(e), n = je(((r = e == null ? void 0 : e.getFlag) == null ? void 0 : r.call(e, de, po)) ?? {});
  return Wa(n, i);
}
s(Yt, "getSceneCriteriaState");
async function wl(e, t, i = null) {
  if (!(e != null && e.setFlag)) return;
  const n = Array.isArray(i) ? i : Me(e), r = Wa(t, n);
  await e.setFlag(de, po, r);
}
s(wl, "setSceneCriteriaState");
function yo(e = "") {
  const t = typeof e == "string" ? e.trim() : "", i = Ka(Wr(t || "criterion"), /* @__PURE__ */ new Set());
  return {
    id: Ja(),
    key: i,
    label: t,
    values: [pn],
    default: pn,
    order: 0
  };
}
s(yo, "createSceneCriterion");
function Ga(e) {
  const t = Array.isArray(e) ? je(e) : [], i = [], n = /* @__PURE__ */ new Set();
  return t.forEach((r, o) => {
    const a = Gr(r, o, n);
    a && (i.push(a), n.add(a.key));
  }), i;
}
s(Ga, "sanitizeCriteria$1");
function Gr(e, t = 0, i = /* @__PURE__ */ new Set()) {
  if (!e || typeof e != "object") return null;
  const n = typeof e.id == "string" && e.id.trim() ? e.id.trim() : Ja(), o = (typeof e.label == "string" ? e.label : typeof e.name == "string" ? e.name : "").trim(), a = typeof e.key == "string" && e.key.trim() ? Wr(e.key) : Wr(o || `criterion-${Number(t) + 1}`), l = Ka(a, i), c = vl(e.values);
  let u = typeof e.default == "string" ? e.default.trim() : "";
  u || (u = c[0] ?? pn), c.includes(u) || c.unshift(u);
  const d = Number.isFinite(e.order) ? Number(e.order) : Number(t);
  return {
    id: n,
    key: l,
    label: o,
    values: c,
    default: u,
    order: d
  };
}
s(Gr, "sanitizeCriterion");
function Wa(e, t = []) {
  const i = e && typeof e == "object" ? je(e) : {}, n = {};
  for (const r of t) {
    const o = i == null ? void 0 : i[r.key], a = typeof o == "string" ? o.trim() : "";
    a && r.values.includes(a) ? n[r.key] = a : n[r.key] = r.default;
  }
  return n;
}
s(Wa, "sanitizeSceneCriteriaState");
function Ol(e) {
  return Me(e).map((i) => ({
    id: i.key,
    key: i.key,
    name: i.label,
    values: [...i.values]
  }));
}
s(Ol, "getSceneCriteriaCategories");
function vl(e) {
  const t = Array.isArray(e) ? e : [], i = [];
  for (const n of t) {
    if (typeof n != "string") continue;
    const r = n.trim();
    !r || i.includes(r) || i.push(r);
  }
  return i.length || i.push(pn), i;
}
s(vl, "sanitizeCriterionValues");
function Wr(e) {
  return String(e ?? "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "criterion";
}
s(Wr, "slugifyCriterionKey");
function Ka(e, t) {
  if (!t.has(e)) return e;
  let i = 2;
  for (; t.has(`${e}-${i}`); )
    i += 1;
  return `${e}-${i}`;
}
s(Ka, "ensureUniqueCriterionKey");
function Ja() {
  var e;
  return (e = foundry == null ? void 0 : foundry.utils) != null && e.randomID ? foundry.utils.randomID() : typeof (crypto == null ? void 0 : crypto.randomUUID) == "function" ? crypto.randomUUID() : Math.random().toString(36).slice(2, 11);
}
s(Ja, "generateCriterionId");
function Ya(e) {
  var t, i;
  console.error(`${de} | Failed to persist scene criteria`, e), (i = (t = ui.notifications) == null ? void 0 : t.error) == null || i.call(
    t,
    f(
      "EIDOLON.SceneCriteria.PersistError",
      "Failed to persist the scene criteria."
    )
  );
}
s(Ya, "notifyPersistError");
var ua, ae, Qe, he, Qa, Vn, jn, zn, Gn, Zi, Wn, bi, Ei, li, Xa;
const Je = class Je extends xi(Ri) {
  constructor(i = {}) {
    const { scene: n, criterion: r, isNew: o, onSave: a, ...l } = i ?? {};
    super(l);
    N(this, he);
    N(this, ae, null);
    N(this, Qe, !1);
    N(this, Vn, /* @__PURE__ */ s(async (i) => {
      i.preventDefault();
      const n = i.currentTarget;
      if (!(n instanceof HTMLFormElement)) return;
      const r = new FormData(n), o = String(r.get("criterionLabel") ?? "").trim(), a = String(r.get("criterionKey") ?? "").trim(), l = Array.from(n.querySelectorAll('[name="criterionValues"]')).map((g) => g instanceof HTMLInputElement ? g.value.trim() : "").filter((g, m, y) => g && y.indexOf(g) === m), u = String(r.get("criterionDefault") ?? "").trim() || l[0] || "Standard", d = Gr(
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
      d && (v(this, ae, d), await S(this, he, Xa).call(this), this.close());
    }, "#onSubmit"));
    N(this, jn, /* @__PURE__ */ s((i) => {
      var a;
      if (h(this, Qe)) return;
      const n = i.currentTarget, r = (n == null ? void 0 : n.form) ?? ((a = this.element) == null ? void 0 : a.querySelector("form"));
      if (!(r instanceof HTMLFormElement)) return;
      const o = r.querySelector('input[name="criterionKey"]');
      o instanceof HTMLInputElement && (o.value = ri(n.value));
    }, "#onLabelInput"));
    N(this, zn, /* @__PURE__ */ s((i) => {
      var c;
      const n = i.currentTarget, r = (n == null ? void 0 : n.form) ?? ((c = this.element) == null ? void 0 : c.querySelector("form"));
      if (!(r instanceof HTMLFormElement) || !(n instanceof HTMLInputElement)) return;
      const o = r.querySelector('input[name="criterionLabel"]'), a = ri(o instanceof HTMLInputElement ? o.value : ""), l = ri(n.value);
      v(this, Qe, l !== a), n.value = l, S(this, he, Zi).call(this, r);
    }, "#onKeyInput"));
    N(this, Gn, /* @__PURE__ */ s((i) => {
      var a, l;
      i.preventDefault();
      const n = ((a = i.currentTarget) == null ? void 0 : a.form) ?? ((l = this.element) == null ? void 0 : l.querySelector("form"));
      if (!(n instanceof HTMLFormElement)) return;
      const r = n.querySelector('input[name="criterionLabel"]'), o = n.querySelector('input[name="criterionKey"]');
      o instanceof HTMLInputElement && (o.value = ri(r instanceof HTMLInputElement ? r.value : ""), v(this, Qe, !1), S(this, he, Zi).call(this, n));
    }, "#onResetAutoKey"));
    N(this, Wn, /* @__PURE__ */ s((i) => {
      var c, u, d, g, m, y;
      i.preventDefault();
      const n = ((c = i.currentTarget) == null ? void 0 : c.form) ?? ((u = this.element) == null ? void 0 : u.querySelector("form"));
      if (!(n instanceof HTMLFormElement)) return;
      const r = n.querySelector(".scene-criterion-editor__values");
      if (!(r instanceof HTMLElement)) return;
      (d = r.querySelector(".scene-criterion-editor__empty")) == null || d.remove();
      const o = document.createElement("div");
      o.classList.add("scene-criterion-editor__value");
      const a = un(f("EIDOLON.SceneCriteria.ValuePlaceholder", "Allowed value")), l = un(f("EIDOLON.SceneCriteria.RemoveValue", "Remove Value"));
      o.innerHTML = `
      <input type="text" name="criterionValues" value="" placeholder="${a}" class="form-control">
      <button type="button" class="icon" data-action="remove-value" aria-label="${l}" title="${l}">
        <i class="fa-solid fa-trash"></i>
      </button>
    `, r.appendChild(o), (g = o.querySelector('[data-action="remove-value"]')) == null || g.addEventListener("click", h(this, bi)), (m = o.querySelector('input[name="criterionValues"]')) == null || m.addEventListener("input", h(this, Ei)), S(this, he, li).call(this, n), (y = o.querySelector('input[name="criterionValues"]')) == null || y.focus();
    }, "#onAddValue"));
    N(this, bi, /* @__PURE__ */ s((i) => {
      var o, a, l, c;
      i.preventDefault(), (a = (o = i.currentTarget) == null ? void 0 : o.closest(".scene-criterion-editor__value")) == null || a.remove();
      const n = ((l = i.currentTarget) == null ? void 0 : l.form) ?? ((c = this.element) == null ? void 0 : c.querySelector("form"));
      if (!(n instanceof HTMLFormElement)) return;
      const r = n.querySelector(".scene-criterion-editor__values");
      if (r instanceof HTMLElement) {
        if (!r.querySelector(".scene-criterion-editor__value")) {
          const u = document.createElement("p");
          u.classList.add("notes", "scene-criterion-editor__empty"), u.textContent = f(
            "EIDOLON.SceneCriteria.ValueListEmpty",
            "No values have been added to this criterion."
          ), r.appendChild(u);
        }
        S(this, he, li).call(this, n);
      }
    }, "#onRemoveValue"));
    N(this, Ei, /* @__PURE__ */ s((i) => {
      var r, o;
      const n = ((r = i.currentTarget) == null ? void 0 : r.form) ?? ((o = this.element) == null ? void 0 : o.querySelector("form"));
      n instanceof HTMLFormElement && S(this, he, li).call(this, n);
    }, "#onValuesChanged"));
    this.scene = n ?? null, this.criterion = r ?? null, this.onSave = typeof a == "function" ? a : null, this.isNew = !!o, v(this, ae, S(this, he, Qa).call(this)), v(this, Qe, h(this, ae).key !== ri(h(this, ae).label));
  }
  async _prepareContext() {
    var n, r, o, a;
    const i = Array.isArray((n = h(this, ae)) == null ? void 0 : n.values) ? h(this, ae).values : [];
    return {
      isNew: this.isNew,
      key: ((r = h(this, ae)) == null ? void 0 : r.key) ?? "",
      label: ((o = h(this, ae)) == null ? void 0 : o.label) ?? "",
      defaultValue: ((a = h(this, ae)) == null ? void 0 : a.default) ?? "",
      values: i.map((l, c) => {
        var u;
        return {
          index: c,
          value: l,
          selected: l === ((u = h(this, ae)) == null ? void 0 : u.default)
        };
      }),
      hasValues: i.length > 0,
      labels: {
        label: f("EIDOLON.SceneCriteria.CategoryNameLabel", "Criterion Label"),
        key: f("EIDOLON.SceneCriteria.CriteriaKey", "Key"),
        values: f("EIDOLON.SceneCriteria.ValuesLabel", "Allowed Values"),
        default: f("EIDOLON.SceneCriteria.DefaultValue", "Default Value"),
        empty: f(
          "EIDOLON.SceneCriteria.ValueListEmpty",
          "No values have been added to this criterion."
        ),
        addValue: f("EIDOLON.SceneCriteria.AddValue", "Add Value"),
        removeValue: f("EIDOLON.SceneCriteria.RemoveValue", "Remove Value"),
        valuePlaceholder: f("EIDOLON.SceneCriteria.ValuePlaceholder", "Allowed value"),
        resetAutoKey: f("EIDOLON.SceneCriteria.ResetAutoKey", "Reset to Auto"),
        save: this.isNew ? f("EIDOLON.SceneCriteria.CreateCategory", "Add Criterion") : f("EIDOLON.SceneCriteria.SaveCategory", "Save Criterion"),
        cancel: f("EIDOLON.SceneCriteria.CancelEdit", "Cancel")
      },
      keyIsCustom: h(this, Qe)
    };
  }
  _onRender(i, n) {
    var o, a, l, c, u, d;
    super._onRender(i, n);
    const r = (o = this.element) == null ? void 0 : o.querySelector("form");
    r && (r.addEventListener("submit", h(this, Vn)), (a = r.querySelector('[data-action="add-value"]')) == null || a.addEventListener("click", h(this, Wn)), (l = r.querySelector('input[name="criterionLabel"]')) == null || l.addEventListener("input", h(this, jn)), (c = r.querySelector('input[name="criterionKey"]')) == null || c.addEventListener("input", h(this, zn)), (u = r.querySelector('[data-action="reset-auto-key"]')) == null || u.addEventListener("click", h(this, Gn)), r.querySelectorAll('[data-action="remove-value"]').forEach((g) => {
      g.addEventListener("click", h(this, bi));
    }), r.querySelectorAll('input[name="criterionValues"]').forEach((g) => {
      g.addEventListener("input", h(this, Ei));
    }), (d = r.querySelector('[data-action="cancel"]')) == null || d.addEventListener("click", (g) => {
      g.preventDefault(), this.close();
    }), S(this, he, Zi).call(this, r), S(this, he, li).call(this, r));
  }
};
ae = new WeakMap(), Qe = new WeakMap(), he = new WeakSet(), Qa = /* @__PURE__ */ s(function() {
  const i = Gr(this.criterion, 0, /* @__PURE__ */ new Set()) ?? yo(f("EIDOLON.SceneCriteria.DefaultCategoryName", "New Criterion"));
  return {
    id: i.id,
    key: i.key,
    label: i.label ?? "",
    values: Array.isArray(i.values) ? [...i.values] : [],
    default: i.default
  };
}, "#initializeState"), Vn = new WeakMap(), jn = new WeakMap(), zn = new WeakMap(), Gn = new WeakMap(), Zi = /* @__PURE__ */ s(function(i) {
  const n = i.querySelector('[data-action="reset-auto-key"]');
  n instanceof HTMLButtonElement && (n.disabled = !h(this, Qe));
}, "#syncAutoKeyButton"), Wn = new WeakMap(), bi = new WeakMap(), Ei = new WeakMap(), li = /* @__PURE__ */ s(function(i) {
  var c, u;
  const n = i.querySelector('select[name="criterionDefault"]');
  if (!(n instanceof HTMLSelectElement)) return;
  const r = ((u = (c = n.value) == null ? void 0 : c.trim) == null ? void 0 : u.call(c)) ?? "", o = Array.from(i.querySelectorAll('input[name="criterionValues"]')).map((d) => d instanceof HTMLInputElement ? d.value.trim() : "").filter((d, g, m) => d && m.indexOf(d) === g), a = n.dataset.emptyLabel || f("EIDOLON.SceneCriteria.ValueListEmpty", "No values have been added to this criterion.");
  if (n.innerHTML = "", !o.length) {
    const d = document.createElement("option");
    d.value = "", d.textContent = a, d.selected = !0, n.appendChild(d);
    return;
  }
  const l = o.includes(r) ? r : o[0];
  for (const d of o) {
    const g = document.createElement("option");
    g.value = d, g.textContent = d, g.selected = d === l, n.appendChild(g);
  }
}, "#syncDefaultOptions"), Xa = /* @__PURE__ */ s(async function() {
  if (!this.scene) return;
  const i = Me(this.scene).sort((r, o) => r.order - o.order), n = i.findIndex((r) => r.id === h(this, ae).id);
  n < 0 ? (h(this, ae).order = i.length, i.push(h(this, ae))) : (h(this, ae).order = i[n].order, i.splice(n, 1, h(this, ae)));
  try {
    await Qn(this.scene, i), this.onSave && await this.onSave(h(this, ae));
  } catch (r) {
    Ya(r);
  }
}, "#persist"), s(Je, "CategoryEditorApplication"), $e(Je, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  et(Je, Je, "DEFAULT_OPTIONS"),
  {
    id: `${de}-criterion-editor`,
    classes: Array.from(
      /* @__PURE__ */ new Set([...((ua = et(Je, Je, "DEFAULT_OPTIONS")) == null ? void 0 : ua.classes) ?? [], "standard-form", "themed"])
    ),
    window: {
      title: f("EIDOLON.SceneCriteria.EditCategory", "Edit Criterion"),
      resizable: !1
    },
    position: {
      width: 460,
      height: "auto"
    }
  },
  { inplace: !1 }
)), $e(Je, "PARTS", {
  content: {
    template: `modules/${de}/templates/scene-criteria-editor.html`
  }
});
let Kr = Je;
function ri(e) {
  return String(e ?? "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "criterion";
}
s(ri, "slugifyKey");
const Ml = `modules/${de}/templates/scene-criteria-tab.html`, Jr = {
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
}, Nl = Yn(Kr), Al = Ua({
  tabId: "criteria",
  tabLabel: /* @__PURE__ */ s(() => f("EIDOLON.SceneCriteria.TabLabel", "Criteria"), "tabLabel"),
  getScene: ze,
  isApplicable: /* @__PURE__ */ s(() => za(), "isApplicable"),
  renderContent: /* @__PURE__ */ s(({ app: e, tab: t, scene: i }) => Fl(e, t, i), "renderContent"),
  logger: Jr
});
function Dl() {
  return Al.register();
}
s(Dl, "registerSceneCriteriaConfigHook");
function Fl(e, t, i) {
  if (!(t instanceof HTMLElement)) return;
  const n = Ce(i) ? i : ze(e);
  Ht(e, t, n);
}
s(Fl, "renderCriteriaTab");
async function Ht(e, t, i) {
  var r, o;
  const n = i ?? ze(e);
  Jr.group("renderCriteriaTabContent", { sceneId: (n == null ? void 0 : n.id) ?? null });
  try {
    if (!Ce(n)) {
      const d = f(
        "EIDOLON.SceneCriteria.Unavailable",
        "Scene criteria are unavailable for this configuration sheet."
      );
      t.innerHTML = `<p class="notes">${d}</p>`;
      return;
    }
    const a = Me(n).sort((d, g) => d.order - g.order), l = Yt(n, a), c = ((o = (r = foundry == null ? void 0 : foundry.applications) == null ? void 0 : r.handlebars) == null ? void 0 : o.renderTemplate) ?? (typeof renderTemplate == "function" ? renderTemplate : globalThis == null ? void 0 : globalThis.renderTemplate);
    if (typeof c != "function") {
      t.innerHTML = `<p class="notes">${f("EIDOLON.SceneCriteria.CategoryListEmpty", "No criteria configured for this scene.")}</p>`;
      return;
    }
    const u = await c(Ml, {
      description: f(
        "EIDOLON.SceneCriteria.Description",
        "Define scene criteria dimensions and allowed values used by matching rules."
      ),
      labels: {
        list: f("EIDOLON.SceneCriteria.CategoryListLabel", "Scene Criteria"),
        empty: f(
          "EIDOLON.SceneCriteria.CategoryListEmpty",
          "No criteria configured for this scene."
        ),
        add: f("EIDOLON.SceneCriteria.AddCategory", "Add Criterion"),
        edit: f("EIDOLON.SceneCriteria.EditCategory", "Edit Criterion"),
        remove: f("EIDOLON.SceneCriteria.RemoveCategory", "Remove Criterion"),
        moveUp: f("EIDOLON.SceneCriteria.MoveUp", "Move Up"),
        moveDown: f("EIDOLON.SceneCriteria.MoveDown", "Move Down"),
        values: f("EIDOLON.SceneCriteria.ValuesLabel", "Allowed Values"),
        unnamed: f("EIDOLON.SceneCriteria.UnnamedCategory", "Unnamed Criterion")
      },
      summary: {
        criteriaCount: a.length,
        valueCount: a.reduce((d, g) => d + g.values.length, 0)
      },
      criteria: a.map((d, g) => {
        var m, y;
        return {
          id: d.id,
          label: d.label,
          displayName: ((y = (m = d.label) == null ? void 0 : m.trim) == null ? void 0 : y.call(m)) || f("EIDOLON.SceneCriteria.UnnamedCategory", "Unnamed Criterion"),
          hasValues: d.values.length > 0,
          values: d.values.map((T) => ({
            value: T,
            isCurrent: (l[d.key] ?? d.default) === T
          })),
          valueCountLabel: Rl(d.values.length),
          canMoveUp: g > 0,
          canMoveDown: g < a.length - 1
        };
      }),
      hasCriteria: a.length > 0
    });
    t.innerHTML = u, _l(e, t, n);
  } catch (a) {
    console.error(`${de} | Failed to render criteria tab`, a), t.innerHTML = `<p class="notes">${f("EIDOLON.SceneCriteria.CategoryListEmpty", "No criteria configured for this scene.")}</p>`;
  } finally {
    Jr.groupEnd();
  }
}
s(Ht, "renderCriteriaTabContent");
function _l(e, t, i) {
  const n = i ?? ze(e);
  if (!Ce(n)) return;
  const r = t.querySelector('[data-criteria-action="add"]');
  r && r.addEventListener("click", () => {
    Wo(e, {
      scene: n,
      criterion: yo(
        f("EIDOLON.SceneCriteria.DefaultCategoryName", "New Criterion")
      ),
      isNew: !0,
      onSave: /* @__PURE__ */ s(() => Ht(e, t, n), "onSave")
    });
  }), t.querySelectorAll('[data-criteria-action="edit"]').forEach((o) => {
    const a = o.dataset.criterionId;
    a && o.addEventListener("click", () => {
      const l = Me(n).find((c) => c.id === a);
      l && Wo(e, {
        scene: n,
        criterion: l,
        onSave: /* @__PURE__ */ s(() => Ht(e, t, n), "onSave")
      });
    });
  }), t.querySelectorAll('[data-criteria-action="remove"]').forEach((o) => {
    const a = o.dataset.criterionId;
    a && o.addEventListener("click", async () => {
      await fr(n, (c) => {
        const u = c.findIndex((d) => d.id === a);
        return u < 0 ? !1 : (c.splice(u, 1), gr(c), !0);
      }) && await Ht(e, t, n);
    });
  }), t.querySelectorAll('[data-criteria-action="move-up"]').forEach((o) => {
    const a = o.dataset.criterionId;
    a && o.addEventListener("click", async () => {
      await fr(n, (c) => {
        const u = c.findIndex((g) => g.id === a);
        if (u <= 0) return !1;
        const [d] = c.splice(u, 1);
        return c.splice(u - 1, 0, d), gr(c), !0;
      }) && await Ht(e, t, n);
    });
  }), t.querySelectorAll('[data-criteria-action="move-down"]').forEach((o) => {
    const a = o.dataset.criterionId;
    a && o.addEventListener("click", async () => {
      await fr(n, (c) => {
        const u = c.findIndex((g) => g.id === a);
        if (u < 0 || u >= c.length - 1) return !1;
        const [d] = c.splice(u, 1);
        return c.splice(u + 1, 0, d), gr(c), !0;
      }) && await Ht(e, t, n);
    });
  });
}
s(_l, "bindCriteriaTabEvents");
async function fr(e, t) {
  const i = Me(e).sort((r, o) => r.order - o.order);
  if (t(i) === !1) return !1;
  try {
    return await Qn(e, i), !0;
  } catch (r) {
    return Ya(r), !1;
  }
}
s(fr, "mutateCriteria");
function Wo(e, t = {}) {
  const i = t.scene ?? null, n = i && Ce(i) ? i : ze(e);
  if (!Ce(n))
    return;
  Nl({
    scene: n,
    criterion: t.criterion ?? null,
    isNew: !!t.isNew,
    onSave: typeof t.onSave == "function" ? t.onSave : null
  }).render({ force: !0 });
}
s(Wo, "openCriterionEditor");
function gr(e) {
  e.forEach((t, i) => {
    t.order = i;
  });
}
s(gr, "reindexCriteriaOrder");
function Rl(e) {
  var t, i;
  if ((i = (t = game.i18n) == null ? void 0 : t.has) != null && i.call(t, "EIDOLON.SceneCriteria.ValueCountLabel"))
    try {
      return game.i18n.format("EIDOLON.SceneCriteria.ValueCountLabel", { count: e });
    } catch (n) {
      console.error(`${de} | Failed to format value count label`, n);
    }
  return e === 0 ? "No values configured" : e === 1 ? "1 value" : `${e} values`;
}
s(Rl, "formatValueCount");
let Ko = !1;
function xl() {
  Hooks.once("init", () => {
    Sl();
  }), Hooks.once("ready", () => {
    za() && (Ko || (Dl(), Ko = !0));
  });
}
s(xl, "registerSceneCriteriaHooks");
xl();
const X = I, Za = "criteriaEngineVersion", qt = "fileIndex", Ut = "tileCriteria", To = {
  LEGACY: 1,
  CRITERIA: 2
}, es = To.CRITERIA;
function ts(e) {
  var t;
  return ((t = e == null ? void 0 : e.getFlag) == null ? void 0 : t.call(e, X, Za)) ?? To.LEGACY;
}
s(ts, "getSceneEngineVersion");
function kl(e, t, i, n, r) {
  if (!(e != null && e.length) || !(i != null && i.length)) return -1;
  const o = {};
  for (const l of i)
    o[l] = t[l];
  const a = Jo(e, o, i);
  if (a >= 0) return a;
  if (n != null && n.length && r) {
    const l = { ...o };
    for (const c of n) {
      if (!(c in l)) continue;
      l[c] = r[c] ?? "Standard";
      const u = Jo(e, l, i);
      if (u >= 0) return u;
    }
  }
  return -1;
}
s(kl, "findBestMatch");
function Jo(e, t, i) {
  return e.findIndex((n) => {
    for (const r of i)
      if (n[r] !== t[r]) return !1;
    return !0;
  });
}
s(Jo, "findExactMatch");
function Hl(e, t) {
  if (!(e != null && e.length)) return -1;
  let i = -1, n = -1;
  for (let r = 0; r < e.length; r += 1) {
    const o = e[r] ?? {}, a = Object.keys(o);
    if (a.length === 0) {
      n < 0 && (i = r, n = 0);
      continue;
    }
    let l = !0;
    for (const c of a)
      if (o[c] !== t[c]) {
        l = !1;
        break;
      }
    l && a.length > n && (i = r, n = a.length);
  }
  return i;
}
s(Hl, "findFileIndex");
function en(e) {
  return e && typeof e == "object" && !Array.isArray(e);
}
s(en, "isPlainObject$1");
function Yo(e) {
  return e == null ? e : typeof structuredClone == "function" ? structuredClone(e) : JSON.parse(JSON.stringify(e));
}
s(Yo, "deepClone");
function $l(e, t) {
  if (!t) return;
  const i = t.split(".").filter(Boolean);
  if (!i.length) return;
  let n = e;
  for (let r = 0; r < i.length - 1; r += 1) {
    if (!en(n == null ? void 0 : n[i[r]])) return;
    n = n[i[r]];
  }
  delete n[i.at(-1)];
}
s($l, "deletePath");
function is(e, t) {
  const i = Yo(e ?? {});
  if (!en(t)) return i;
  for (const [n, r] of Object.entries(t)) {
    if (n.startsWith("-=") && r === !0) {
      $l(i, n.slice(2));
      continue;
    }
    en(r) && en(i[n]) ? i[n] = is(i[n], r) : i[n] = Yo(r);
  }
  return i;
}
s(is, "fallbackMerge");
function Pl(e, t) {
  var i, n;
  return (i = foundry == null ? void 0 : foundry.utils) != null && i.mergeObject && ((n = foundry == null ? void 0 : foundry.utils) != null && n.deepClone) ? foundry.utils.mergeObject(e, foundry.utils.deepClone(t), {
    inplace: !1
  }) : is(e, t);
}
s(Pl, "defaultMerge");
function Bl(e, t) {
  if (!e) return !0;
  for (const i of Object.keys(e))
    if (e[i] !== t[i]) return !1;
  return !0;
}
s(Bl, "criteriaMatch");
function ns(e, t, i, n) {
  const r = n ?? Pl;
  let o = r({}, e ?? {});
  if (!(t != null && t.length)) return o;
  const a = [];
  for (let l = 0; l < t.length; l += 1) {
    const c = t[l];
    if (Bl(c == null ? void 0 : c.criteria, i)) {
      const u = c != null && c.criteria ? Object.keys(c.criteria).length : 0;
      a.push({ specificity: u, index: l, delta: c == null ? void 0 : c.delta });
    }
  }
  a.sort((l, c) => l.specificity - c.specificity || l.index - c.index);
  for (const l of a)
    l.delta && (o = r(o, l.delta));
  return o;
}
s(ns, "resolveRules");
function Xn(e = null) {
  var n;
  const t = (game == null ? void 0 : game.user) ?? null;
  if (!t) return !1;
  if (t.isGM) return !0;
  const i = e ?? ((n = game == null ? void 0 : game.scenes) == null ? void 0 : n.viewed) ?? null;
  if (!i) return !1;
  if (typeof i.canUserModify == "function")
    try {
      return !!i.canUserModify(t, "update");
    } catch {
    }
  if (typeof i.testUserPermission == "function")
    try {
      return !!i.testUserPermission(t, "OWNER");
    } catch {
    }
  return !!i.isOwner;
}
s(Xn, "canManageCriteria");
function ql(e = null) {
  if (!Xn(e))
    throw new Error(`${X} | You do not have permission to manage scene criteria.`);
}
s(ql, "requireCriteriaAccess");
const Ul = /* @__PURE__ */ s((...e) => console.log(`${X} | criteria tiles:`, ...e), "log$1");
function Vl(e) {
  return typeof (e == null ? void 0 : e.name) == "string" ? e.name : typeof (e == null ? void 0 : e.src) == "string" ? e.src : "";
}
s(Vl, "getFilePath");
function rs(e) {
  if (typeof e != "string") return "";
  const t = e.trim();
  if (!t) return "";
  const i = t.replace(/\\/g, "/");
  try {
    return decodeURIComponent(i);
  } catch {
    return i;
  }
}
s(rs, "normalizeFilePath");
function bo(e) {
  if (!Array.isArray(e)) return [];
  const t = /* @__PURE__ */ new Map();
  return e.map((i, n) => {
    const r = rs(Vl(i)), o = r || `__index:${n}`, a = t.get(o) ?? 0;
    t.set(o, a + 1);
    const l = {
      indexHint: n
    };
    return r && (l.path = r, l.occurrence = a), {
      index: n,
      path: r,
      occurrence: a,
      target: l,
      label: r.split("/").pop() || `File ${n + 1}`
    };
  });
}
s(bo, "buildTileFileEntries");
function ft(e, t) {
  if (!Number.isInteger(t) || t < 0) return null;
  const n = bo(e).find((r) => r.index === t);
  return n ? { ...n.target } : { indexHint: t };
}
s(ft, "createTileTargetFromIndex");
function Zn(e) {
  if (!e || typeof e != "object") return null;
  const t = rs(e.path), i = Number(e.indexHint ?? e.fileIndex), n = Number(e.occurrence), r = {};
  return t && (r.path = t, r.occurrence = Number.isInteger(n) && n >= 0 ? n : 0), Number.isInteger(i) && i >= 0 && (r.indexHint = i), !r.path && !Number.isInteger(r.indexHint) ? null : r;
}
s(Zn, "normalizeTileTarget");
function yn(e, t) {
  const i = Zn(e);
  if (!i) return -1;
  const n = bo(t);
  if (!n.length) return -1;
  if (i.path) {
    const r = n.filter((o) => o.path === i.path);
    if (r.length > 0) {
      const o = Number.isInteger(i.occurrence) ? i.occurrence : 0;
      if (r[o]) return r[o].index;
      if (Number.isInteger(i.indexHint)) {
        const a = r.find((l) => l.index === i.indexHint);
        if (a) return a.index;
      }
      return r[0].index;
    }
  }
  return Number.isInteger(i.indexHint) && i.indexHint < n.length ? i.indexHint : -1;
}
s(yn, "resolveTileTargetIndex");
function Ft(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return {};
  const t = {};
  for (const [i, n] of Object.entries(e))
    typeof i != "string" || !i || typeof n != "string" || !n.trim() || (t[i] = n.trim());
  return t;
}
s(Ft, "sanitizeCriteria");
function jl(e) {
  return Object.entries(Ft(e)).sort(([i], [n]) => i.localeCompare(n)).map(([i, n]) => `${i}=${n}`).join("");
}
s(jl, "serializeCriteria");
function zl(e) {
  return Object.keys(Ft(e)).length;
}
s(zl, "getCriteriaSpecificity");
function Gl(e, t) {
  const i = Ft(e), n = Ft(t);
  for (const [r, o] of Object.entries(i))
    if (r in n && n[r] !== o)
      return !1;
  return !0;
}
s(Gl, "areCriteriaCompatible");
function Wl(e, t) {
  const i = yn(e, t);
  if (Number.isInteger(i) && i >= 0)
    return `index:${i}`;
  const n = Zn(e);
  if (!n) return "";
  if (n.path) {
    const r = Number.isInteger(n.occurrence) ? n.occurrence : 0;
    return `path:${n.path}#${r}`;
  }
  return Number.isInteger(n.indexHint) ? `hint:${n.indexHint}` : "";
}
s(Wl, "getTargetIdentity");
function os(e, t = {}) {
  var l;
  const i = Array.isArray(t.files) ? t.files : [], n = Qt(e, { files: i });
  if (!((l = n == null ? void 0 : n.variants) != null && l.length))
    return {
      errors: [],
      warnings: []
    };
  const r = n.variants.map((c, u) => ({
    index: u,
    criteria: Ft(c.criteria),
    specificity: zl(c.criteria),
    criteriaSignature: jl(c.criteria),
    targetIdentity: Wl(c.target, i)
  })), o = [], a = [];
  for (let c = 0; c < r.length; c += 1) {
    const u = r[c];
    for (let d = c + 1; d < r.length; d += 1) {
      const g = r[d];
      if (u.specificity !== g.specificity || !Gl(u.criteria, g.criteria)) continue;
      if (!(!!u.targetIdentity && u.targetIdentity === g.targetIdentity)) {
        o.push({
          leftIndex: u.index,
          rightIndex: g.index,
          type: u.criteriaSignature === g.criteriaSignature ? "equivalent" : "overlap",
          specificity: u.specificity
        });
        continue;
      }
      u.criteriaSignature === g.criteriaSignature && a.push({
        leftIndex: u.index,
        rightIndex: g.index,
        type: "duplicate"
      });
    }
  }
  return {
    errors: o,
    warnings: a
  };
}
s(os, "detectTileCriteriaConflicts");
function Kl(e, t) {
  if (!e || typeof e != "object") return null;
  let i = Zn(e.target);
  if (!i) {
    const n = Number(e.fileIndex);
    Number.isInteger(n) && n >= 0 && (i = ft(t, n));
  }
  return i ? {
    criteria: Ft(e.criteria),
    target: i
  } : null;
}
s(Kl, "normalizeTileVariant");
function as(e, t = {}) {
  if (!Array.isArray(e) || e.length === 0) return null;
  const i = Array.isArray(t.files) ? t.files : null, n = e.map((c, u) => ({
    criteria: Ft(c),
    target: ft(i, u)
  })).filter((c) => c.target);
  if (!n.length) return null;
  const r = n.find((c) => Object.keys(c.criteria).length === 0), o = (r == null ? void 0 : r.target) ?? n[0].target;
  let a = null;
  const l = Number(t.defaultFileIndex);
  return Number.isInteger(l) && l >= 0 && (a = ft(i, l)), a || (a = o), {
    strategy: "select-one",
    variants: n,
    defaultTarget: a
  };
}
s(as, "buildTileCriteriaFromFileIndex");
function Qt(e, t = {}) {
  const i = Array.isArray(t.files) ? t.files : null;
  if (Array.isArray(e))
    return as(e, { files: i });
  if (!e || typeof e != "object") return null;
  const n = Array.isArray(e.variants) ? e.variants.map((o) => Kl(o, i)).filter(Boolean) : [];
  if (!n.length) return null;
  let r = Zn(e.defaultTarget);
  if (!r) {
    const o = Number(e.defaultFileIndex);
    Number.isInteger(o) && o >= 0 && (r = ft(i, o));
  }
  if (!r) {
    const o = n.find((a) => Object.keys(a.criteria).length === 0);
    r = (o == null ? void 0 : o.target) ?? n[0].target;
  }
  return {
    strategy: "select-one",
    variants: n,
    defaultTarget: r
  };
}
s(Qt, "normalizeTileCriteria");
function Jl(e, t, i) {
  const n = Qt(e, { files: i });
  if (!n) return -1;
  let r = null, o = -1;
  for (const l of n.variants) {
    const c = Object.keys(l.criteria);
    let u = !0;
    for (const d of c)
      if (l.criteria[d] !== (t == null ? void 0 : t[d])) {
        u = !1;
        break;
      }
    u && c.length > o && (o = c.length, r = l);
  }
  const a = (r == null ? void 0 : r.target) ?? n.defaultTarget;
  return yn(a, i);
}
s(Jl, "selectTileFileIndex");
async function ss(e, t) {
  var r;
  if (t = t ?? ((r = game.scenes) == null ? void 0 : r.viewed), !t) return;
  const i = t.getEmbeddedCollection("Tile") ?? [], n = [];
  for (const o of i) {
    const a = o.getFlag(X, Ut) ?? o.getFlag(X, qt);
    if (!a) continue;
    const l = o.getFlag("monks-active-tiles", "files");
    if (!(l != null && l.length)) continue;
    const c = Jl(a, e, l);
    if (!Number.isInteger(c) || c < 0 || c >= l.length) {
      console.warn(`${X} | Tile ${o.id} has no valid file match for state`, e);
      continue;
    }
    await o.setFlag(
      "monks-active-tiles",
      "files",
      l.map((u, d) => ({
        ...u,
        selected: d === c
      }))
    ), await o.setFlag("monks-active-tiles", "fileindex", c + 1), n.push({
      _id: o._id,
      texture: { src: l[c].name }
    }), Ul(`Tile ${o.id} -> ${l[c].name}`);
  }
  n.length > 0 && await t.updateEmbeddedDocuments("Tile", n);
}
s(ss, "updateTiles");
function Yl() {
  if (!globalThis.Tagger) return [];
  const e = ["Checkbox", "Tile", "Settings", "Toggleable Lights"], t = [
    "Checkbox",
    "Tile",
    "Settings",
    "Toggleable Lights",
    "Checked",
    "Unchecked",
    "Individual"
  ], i = Tagger.getByTag(e) ?? [], n = [];
  for (const r of i) {
    if (r.getFlag("monks-active-tiles", "variables.state") !== "unchecked") continue;
    const o = (Tagger.getTags(r) ?? []).filter((c) => !t.includes(c)), a = (Tagger.getByTag("Disable Automation") ?? []).concat(Tagger.getByTag("Settings") ?? []), l = Tagger.getByTag(o, { ignore: a }) ?? [];
    for (const c of l)
      c != null && c._id && n.push(c._id);
  }
  return n;
}
s(Yl, "buildLightControlsMap");
const vt = I, Vt = "lightCriteria", Eo = Object.freeze({
  base: null,
  mappings: [],
  current: null
});
function mr(e) {
  return e && typeof e == "object" && !Array.isArray(e);
}
s(mr, "isPlainObject");
function ls(e, t) {
  if (!mr(t)) return {};
  const i = {};
  for (const [n, r] of Object.entries(t)) {
    const o = e == null ? void 0 : e[n];
    if (mr(r) && mr(o)) {
      const a = ls(o, r);
      Object.keys(a).length > 0 && (i[n] = a);
    } else r !== o && (i[n] = je(r));
  }
  return i;
}
s(ls, "computeDelta");
function cs(e) {
  var i;
  const t = ((i = e == null ? void 0 : e.getFlag) == null ? void 0 : i.call(e, vt, Vt)) ?? Eo;
  return hi(t);
}
s(cs, "getLightCriteriaState");
async function us(e, t) {
  const i = hi(t);
  if (!(e != null && e.setFlag))
    return i;
  const n = i.base !== null, r = i.mappings.length > 0, o = i.current !== null;
  return !n && !r && !o ? (typeof e.unsetFlag == "function" ? await e.unsetFlag(vt, Vt) : await e.setFlag(vt, Vt, null), Eo) : (await e.setFlag(vt, Vt, i), i);
}
s(us, "setLightCriteriaState");
async function ki(e, t) {
  if (typeof t != "function")
    throw new TypeError("updateLightCriteriaState requires an updater function.");
  const i = je(cs(e)), n = await t(i);
  return us(e, n);
}
s(ki, "updateLightCriteriaState");
async function Qo(e, t) {
  const i = _t(t);
  if (!i)
    throw new Error("Invalid light configuration payload.");
  return ki(e, (n) => ({
    ...n,
    base: i
  }));
}
s(Qo, "storeBaseLighting");
async function Xo(e, t, i, { label: n } = {}) {
  const r = Hi(t);
  if (!r)
    throw new Error("Cannot create a mapping without at least one category selection.");
  const o = _t(i);
  if (!o)
    throw new Error("Invalid light configuration payload.");
  return ki(e, (a) => {
    const l = Zt(r), c = Array.isArray(a == null ? void 0 : a.mappings) ? [...a.mappings] : [], u = c.findIndex((y) => (y == null ? void 0 : y.key) === l), d = u >= 0 ? c[u] : null, g = typeof (d == null ? void 0 : d.id) == "string" && d.id.trim() ? d.id.trim() : fs(), m = er({
      id: g,
      categories: r,
      config: o,
      label: typeof n == "string" ? n : (d == null ? void 0 : d.label) ?? null,
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
s(Xo, "upsertLightCriteriaMapping");
async function Ql(e, t, i, n, { replaceExisting: r = !1 } = {}) {
  const o = typeof t == "string" ? t.trim() : "";
  if (!o)
    throw new Error("A mapping id is required to retarget criteria.");
  const a = Hi(i);
  if (!a)
    throw new Error("Cannot retarget mapping without at least one category selection.");
  const l = _t(n);
  if (!l)
    throw new Error("Invalid light configuration payload.");
  return ki(e, (c) => {
    const u = Array.isArray(c == null ? void 0 : c.mappings) ? [...c.mappings] : [], d = u.findIndex((b) => (b == null ? void 0 : b.id) === o);
    if (d < 0)
      throw new Error("The selected mapping no longer exists.");
    const g = Zt(a), m = u.findIndex(
      (b, E) => E !== d && (b == null ? void 0 : b.key) === g
    );
    if (m >= 0 && !r)
      throw new Error("A mapping already exists for the selected criteria.");
    const y = u[d], T = er({
      ...y,
      id: o,
      categories: a,
      config: l,
      updatedAt: Date.now()
    });
    if (!T)
      throw new Error("Failed to sanitize updated mapping.");
    u[d] = T;
    let p = null;
    if (m >= 0) {
      const [b] = u.splice(m, 1);
      p = (b == null ? void 0 : b.id) ?? null;
    }
    let C = (c == null ? void 0 : c.current) ?? null;
    return C && typeof C == "object" && (C.mappingId === o ? C = {
      ...C,
      mappingId: o,
      categories: a,
      updatedAt: Date.now()
    } : p && C.mappingId === p && (C = {
      ...C,
      mappingId: o,
      categories: a,
      updatedAt: Date.now()
    })), {
      ...c,
      mappings: u,
      current: C
    };
  });
}
s(Ql, "retargetLightCriteriaMapping");
async function Xl(e, t) {
  const i = typeof t == "string" ? t.trim() : "";
  if (!i)
    throw new Error("A mapping id is required to remove a mapping.");
  return ki(e, (n) => {
    const r = Array.isArray(n == null ? void 0 : n.mappings) ? [...n.mappings] : [], o = r.findIndex((l) => (l == null ? void 0 : l.id) === i);
    if (o < 0) return n;
    r.splice(o, 1);
    let a = (n == null ? void 0 : n.current) ?? null;
    return (a == null ? void 0 : a.mappingId) === i && (a = null), {
      ...n,
      mappings: r,
      current: a
    };
  });
}
s(Xl, "removeLightCriteriaMapping");
async function fi(e, t) {
  const i = ds(t);
  return ki(e, (n) => ({
    ...n,
    current: i
  }));
}
s(fi, "storeCurrentCriteriaSelection");
function Zl(e) {
  const t = hi(e), i = t.base ?? {}, n = [];
  for (const r of t.mappings) {
    const o = Hi(r == null ? void 0 : r.categories);
    if (!o) continue;
    const a = ls(i, (r == null ? void 0 : r.config) ?? {});
    Object.keys(a).length !== 0 && n.push({
      criteria: o,
      delta: a
    });
  }
  return {
    base: i,
    rules: n
  };
}
s(Zl, "convertLightCriteriaStateToPresets");
function ec(e, t = []) {
  const i = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Set();
  for (const c of t)
    typeof (c == null ? void 0 : c.key) == "string" && c.key.trim() && n.add(c.key.trim()), typeof (c == null ? void 0 : c.id) == "string" && c.id.trim() && typeof (c == null ? void 0 : c.key) == "string" && i.set(c.id.trim(), c.key.trim());
  const r = hi(e), o = /* @__PURE__ */ s((c) => {
    const u = {};
    for (const [d, g] of Object.entries(c ?? {})) {
      const m = String(d ?? "").trim(), y = typeof g == "string" ? g.trim() : "";
      if (!m || !y) continue;
      if (n.has(m)) {
        u[m] = y;
        continue;
      }
      const T = i.get(m);
      T && (u[T] = y);
    }
    return Object.keys(u).length ? u : null;
  }, "remapCategories"), a = r.mappings.map((c) => {
    const u = o(c.categories);
    return u ? er({
      ...c,
      categories: u,
      key: Zt(u)
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
  return hi({
    ...r,
    mappings: a,
    current: l
  });
}
s(ec, "migrateLightCriteriaCategoriesToKeys");
function hi(e) {
  var c;
  const t = je(e);
  if (!t || typeof t != "object")
    return je(Eo);
  const i = _t(t.base), n = Array.isArray(t.mappings) ? t.mappings : [], r = /* @__PURE__ */ new Map();
  for (const u of n) {
    const d = er(u);
    d && r.set(d.key, d);
  }
  const o = Array.from(r.values()), a = new Map(o.map((u) => [u.id, u]));
  let l = ds(t.current);
  if (l) {
    const u = l.categories && Object.keys(l.categories).length > 0;
    if (l.mappingId && !a.has(l.mappingId)) {
      const d = u ? ((c = o.find((g) => g.key === Zt(l.categories))) == null ? void 0 : c.id) ?? null : null;
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
    base: i ?? null,
    mappings: o,
    current: l
  };
}
s(hi, "sanitizeLightCriteriaState");
function _t(e) {
  const t = je(e);
  if (!t || typeof t != "object") return null;
  "_id" in t && delete t._id, "id" in t && delete t.id;
  const i = t.flags;
  if (i && typeof i == "object") {
    const n = i[vt];
    n && typeof n == "object" && (delete n[Vt], Object.keys(n).length === 0 && delete i[vt]), Object.keys(i).length === 0 && delete t.flags;
  }
  return t;
}
s(_t, "sanitizeLightConfigPayload");
function er(e) {
  if (!e || typeof e != "object") return null;
  const t = Hi(e.categories);
  if (!t) return null;
  const i = _t(e.config);
  if (!i) return null;
  const n = typeof e.id == "string" && e.id.trim() ? e.id.trim() : fs(), r = Zt(t), o = {
    id: n,
    key: r,
    categories: t,
    config: i,
    updatedAt: Number.isFinite(e.updatedAt) ? Number(e.updatedAt) : Date.now()
  };
  return typeof e.label == "string" && e.label.trim() && (o.label = e.label.trim()), o;
}
s(er, "sanitizeCriteriaMappingEntry");
function ds(e) {
  if (!e || typeof e != "object") return null;
  const t = typeof e.mappingId == "string" && e.mappingId.trim() ? e.mappingId.trim() : null, i = Hi(e.categories);
  return !t && !i ? null : {
    mappingId: t,
    categories: i,
    updatedAt: Number.isFinite(e.updatedAt) ? Number(e.updatedAt) : Date.now()
  };
}
s(ds, "sanitizeCurrentSelection");
function Hi(e) {
  const t = {};
  if (Array.isArray(e))
    for (const i of e) {
      const n = Zo((i == null ? void 0 : i.id) ?? (i == null ? void 0 : i.categoryId) ?? (i == null ? void 0 : i.category)), r = ea((i == null ? void 0 : i.value) ?? (i == null ? void 0 : i.selection) ?? (i == null ? void 0 : i.label));
      !n || !r || (t[n] = r);
    }
  else if (e && typeof e == "object")
    for (const [i, n] of Object.entries(e)) {
      const r = Zo(i), o = ea(n);
      !r || !o || (t[r] = o);
    }
  return Object.keys(t).length > 0 ? t : null;
}
s(Hi, "sanitizeCriteriaCategories");
function Zt(e) {
  if (!e || typeof e != "object") return "";
  const t = Object.entries(e).filter(([, i]) => typeof i == "string" && i).map(([i, n]) => `${i}:${n}`);
  return t.sort((i, n) => i < n ? -1 : i > n ? 1 : 0), t.join("|");
}
s(Zt, "computeCriteriaMappingKey");
function fs() {
  var e;
  return (e = foundry == null ? void 0 : foundry.utils) != null && e.randomID ? foundry.utils.randomID() : typeof (crypto == null ? void 0 : crypto.randomUUID) == "function" ? crypto.randomUUID() : Math.random().toString(36).slice(2, 10);
}
s(fs, "generateLightMappingId");
function Zo(e) {
  if (typeof e != "string") return null;
  const t = e.trim();
  return t || null;
}
s(Zo, "normalizeCategoryId");
function ea(e) {
  if (typeof e != "string") return null;
  const t = e.trim();
  return t || null;
}
s(ea, "normalizeCategoryValue");
const tc = ["AmbientLight", "Wall", "AmbientSound"];
function ic(e, t) {
  var n;
  const i = ((n = e == null ? void 0 : e.flags) == null ? void 0 : n[X]) ?? {};
  if (i != null && i.presets) {
    const r = i.presets.base ?? null, o = Array.isArray(i.presets.rules) ? i.presets.rules : [];
    if (r && Object.keys(r).length > 0 || o.length > 0)
      return {
        base: r ?? {},
        rules: o
      };
  }
  if (t !== "AmbientLight") return null;
  if (i != null && i.lightCriteria) {
    const r = Zl(i.lightCriteria);
    if (r.base && Object.keys(r.base).length > 0 || r.rules.length > 0) return r;
  }
  return null;
}
s(ic, "getPresetsForDocument");
async function gs(e, t) {
  var n;
  if (t = t ?? ((n = game.scenes) == null ? void 0 : n.viewed), !t) return;
  const i = Yl();
  for (const r of tc) {
    const o = t.getEmbeddedCollection(r), a = [];
    for (const l of o) {
      const c = ic(l, r);
      if (!(c != null && c.base)) continue;
      const u = ns(c.base, c.rules ?? [], e);
      u._id = l._id, r === "AmbientLight" && i.includes(l._id) && (u.hidden = !0), a.push(u);
    }
    a.length > 0 && (await t.updateEmbeddedDocuments(r, a), console.log(`${X} | Updated ${a.length} ${r}(s)`));
  }
}
s(gs, "updatePlaceables");
function nc(e) {
  var t;
  return e = e ?? ((t = game.scenes) == null ? void 0 : t.viewed), e ? Yt(e) : null;
}
s(nc, "getState");
async function ms(e, t) {
  var a;
  if (t = t ?? ((a = game.scenes) == null ? void 0 : a.viewed), !t) return null;
  ql(t);
  const i = Me(t);
  if (!i.length)
    return console.warn(`${X} | applyState skipped: scene has no criteria.`), null;
  const r = { ...Yt(t, i), ...e ?? {} };
  await wl(t, r, i);
  const o = Yt(t, i);
  return await Promise.all([ss(o, t), gs(o, t)]), Hooks.callAll("eidolon-utilities.criteriaStateApplied", t, o), o;
}
s(ms, "applyState");
function rc(e) {
  var t;
  return e = e ?? ((t = game.scenes) == null ? void 0 : t.viewed), e ? ts(e) : null;
}
s(rc, "getVersion");
async function hs(e, t) {
  var i;
  t = t ?? ((i = game.scenes) == null ? void 0 : i.viewed), t != null && t.setFlag && await t.setFlag(X, Za, Number(e));
}
s(hs, "setVersion");
async function oc(e) {
  return hs(es, e);
}
s(oc, "markCurrentVersion");
const ci = "Standard", ac = /* @__PURE__ */ s((...e) => console.log(`${X} | criteria indexer:`, ...e), "log");
function Co(e) {
  if (typeof e != "string") return null;
  let t = e;
  try {
    t = decodeURIComponent(e);
  } catch {
  }
  const i = t.match(/\[([^\]]+)\]/);
  if (!i) return null;
  const n = i[1].split(",").map((r) => r.trim()).filter(Boolean);
  return n.length ? n : null;
}
s(Co, "parseFileTags");
function sc(e, t, i = ci) {
  return e != null && e.length ? e.map((n) => {
    const r = Co(n == null ? void 0 : n.name);
    if (!r) return {};
    const o = {};
    for (const [a, l] of Object.entries(t)) {
      const c = r[Number(a)];
      c != null && c !== i && (o[l] = c);
    }
    return o;
  }) : [];
}
s(sc, "buildFileIndex");
function lc(e, t) {
  return e.map((i, n) => {
    const r = [...t[i] ?? /* @__PURE__ */ new Set()].sort(), a = r.includes(ci) ? ci : r[0] ?? ci, l = yo(i);
    return l.key = i, l.label = i.charAt(0).toUpperCase() + i.slice(1), l.values = r.length ? r : [ci], l.default = l.values.includes(a) ? a : l.values[0], l.order = n, l;
  });
}
s(lc, "buildCriteriaDefinitions");
async function Vi(e, t, i, { dryRun: n = !1 } = {}) {
  const r = e.getFlag("monks-active-tiles", "files");
  if (!(r != null && r.length)) return null;
  const o = sc(r, t), a = as(o, { files: r });
  for (const l of r) {
    const c = Co(l == null ? void 0 : l.name);
    if (c)
      for (const [u, d] of Object.entries(t)) {
        const g = c[Number(u)];
        g != null && i[d] && i[d].add(g);
      }
  }
  return n || (await e.setFlag(X, Ut, a), typeof e.unsetFlag == "function" && await e.unsetFlag(X, qt)), { files: r.length };
}
s(Vi, "indexTile");
async function cc(e, t = {}) {
  var E, O, D, R;
  const {
    dryRun: i = !1,
    force: n = !1
  } = t;
  if (e = e ?? ((E = game.scenes) == null ? void 0 : E.viewed), !e) throw new Error("No scene provided to indexScene.");
  if (!globalThis.Tagger) throw new Error("Tagger is required to index scene criteria.");
  if (!n && ts(e) >= es)
    throw new Error(
      `Scene "${e.name}" is already criteria-indexed. Use force: true to re-index.`
    );
  const r = { sceneId: e.id }, o = Tagger.getByTag("Map", r) ?? [];
  if (!o.length) throw new Error("No Map tile found.");
  if (o.length > 1) throw new Error(`Expected 1 Map tile, found ${o.length}.`);
  const a = o[0], l = a.getFlag("monks-active-tiles", "files");
  if (!(l != null && l.length)) throw new Error("Map tile has no MATT files.");
  const c = Co((O = l[0]) == null ? void 0 : O.name);
  if (!(c != null && c.length))
    throw new Error(`Cannot parse bracket tags from: ${((D = l[0]) == null ? void 0 : D.name) ?? "<unknown>"}`);
  if (c.length < 3)
    throw new Error(`Expected 3+ bracket tags, found ${c.length}.`);
  const u = Tagger.getByTag("Floor", r) ?? [], d = Tagger.getByTag("Roof", r) ?? [], g = Tagger.getByTag("Weather", r) ?? [];
  let m;
  const y = [];
  c.length >= 4 ? (m = { 0: "mood", 1: "stage", 2: "variant", 3: "effect" }, y.push("mood", "stage", "variant", "effect")) : (m = { 0: "mood", 1: "variant", 2: "effect" }, y.push("mood", "variant", "effect"));
  const T = { 1: "effect" }, p = {};
  for (const _ of y)
    p[_] = /* @__PURE__ */ new Set();
  const C = {
    map: null,
    floor: [],
    roof: [],
    weather: []
  };
  C.map = await Vi(a, m, p, { dryRun: i });
  for (const _ of u) {
    const V = await Vi(_, m, p, { dryRun: i });
    V && C.floor.push(V);
  }
  for (const _ of d) {
    const V = await Vi(_, m, p, { dryRun: i });
    V && C.roof.push(V);
  }
  for (const _ of g) {
    const V = await Vi(_, T, p, { dryRun: i });
    V && C.weather.push(V);
  }
  const b = lc(y, p);
  return i || (await Qn(e, b), await oc(e)), ac(
    i ? "Dry run complete" : "Indexing complete",
    `- ${b.length} criteria,`,
    `${((R = C.map) == null ? void 0 : R.files) ?? 0} map files`
  ), {
    criteria: b,
    state: b.reduce((_, V) => (_[V.key] = V.default, _), {}),
    tiles: C,
    overlayMode: g.length > 0
  };
}
s(cc, "indexScene");
var da, Te, Oe, ve, Wt, ot, le, ps, ys, Ts, Qr, bs, tn, Xr;
const De = class De extends xi(Ri) {
  constructor(i = {}) {
    var n;
    super(i);
    N(this, le);
    N(this, Te, null);
    N(this, Oe, []);
    N(this, ve, {});
    N(this, Wt, !1);
    N(this, ot, null);
    this.setScene(i.scene ?? ((n = game.scenes) == null ? void 0 : n.viewed) ?? null);
  }
  setScene(i) {
    var n;
    v(this, Te, i ?? ((n = game.scenes) == null ? void 0 : n.viewed) ?? null), S(this, le, ps).call(this);
  }
  get scene() {
    return h(this, Te);
  }
  async _prepareContext() {
    var r;
    const i = !!h(this, Te), n = i && h(this, Oe).length > 0;
    return {
      hasScene: i,
      hasCriteria: n,
      sceneName: ((r = h(this, Te)) == null ? void 0 : r.name) ?? f("EIDOLON.CriteriaSwitcher.NoScene", "No active scene"),
      labels: {
        subtitle: f(
          "EIDOLON.CriteriaSwitcher.Subtitle",
          "Switch criteria live and immediately apply all mapped updates."
        ),
        empty: f(
          "EIDOLON.CriteriaSwitcher.Empty",
          "No criteria found for this scene. Configure criteria first."
        ),
        reset: f("EIDOLON.CriteriaSwitcher.Reset", "Reset Defaults"),
        close: f("EIDOLON.CriteriaSwitcher.Close", "Close"),
        applying: f("EIDOLON.CriteriaSwitcher.Applying", "Applying changes..."),
        ready: f("EIDOLON.CriteriaSwitcher.Ready", "Ready")
      },
      criteria: h(this, Oe).map((o) => ({
        key: o.key,
        label: o.label || o.key,
        values: o.values.map((a) => {
          var l;
          return {
            value: a,
            selected: ((l = h(this, ve)) == null ? void 0 : l[o.key]) === a
          };
        }),
        defaultValue: o.default
      })),
      stateSummary: S(this, le, Xr).call(this)
    };
  }
  _onRender(i, n) {
    super._onRender(i, n), S(this, le, ys).call(this), S(this, le, Ts).call(this);
  }
  async _onClose(i) {
    return h(this, ot) !== null && (Hooks.off("eidolon-utilities.criteriaStateApplied", h(this, ot)), v(this, ot, null)), super._onClose(i);
  }
};
Te = new WeakMap(), Oe = new WeakMap(), ve = new WeakMap(), Wt = new WeakMap(), ot = new WeakMap(), le = new WeakSet(), ps = /* @__PURE__ */ s(function() {
  if (!h(this, Te)) {
    v(this, Oe, []), v(this, ve, {});
    return;
  }
  v(this, Oe, Me(h(this, Te)).sort((i, n) => i.order - n.order)), v(this, ve, Yt(h(this, Te), h(this, Oe)));
}, "#hydrateFromScene"), ys = /* @__PURE__ */ s(function() {
  var n, r;
  const i = this.element;
  i instanceof HTMLElement && (i.querySelectorAll("[data-criteria-key]").forEach((o) => {
    o.addEventListener("change", (a) => {
      const l = a.currentTarget;
      if (!(l instanceof HTMLSelectElement)) return;
      const c = l.dataset.criteriaKey;
      c && (v(this, ve, {
        ...h(this, ve),
        [c]: l.value
      }), S(this, le, Qr).call(this, { [c]: l.value }));
    });
  }), (n = i.querySelector("[data-action='reset-defaults']")) == null || n.addEventListener("click", () => {
    S(this, le, bs).call(this);
  }), (r = i.querySelector("[data-action='close-switcher']")) == null || r.addEventListener("click", () => {
    this.close();
  }));
}, "#bindEvents"), Ts = /* @__PURE__ */ s(function() {
  h(this, ot) === null && v(this, ot, Hooks.on("eidolon-utilities.criteriaStateApplied", (i, n) => {
    !h(this, Te) || (i == null ? void 0 : i.id) !== h(this, Te).id || h(this, Wt) || (v(this, ve, { ...n ?? {} }), this.render({ force: !0 }));
  }));
}, "#ensureSyncHook"), Qr = /* @__PURE__ */ s(async function(i) {
  var n, r;
  if (h(this, Te)) {
    S(this, le, tn).call(this, "applying"), v(this, Wt, !0);
    try {
      const o = await ms(i, h(this, Te));
      o && v(this, ve, o), S(this, le, tn).call(this, "ready"), this.render({ force: !0 });
    } catch (o) {
      console.error(`${X} | Failed to apply criteria state`, o), (r = (n = ui.notifications) == null ? void 0 : n.error) == null || r.call(
        n,
        f(
          "EIDOLON.CriteriaSwitcher.ApplyError",
          "Failed to apply the selected criteria state."
        )
      ), S(this, le, tn).call(this, "error", (o == null ? void 0 : o.message) ?? "Unknown error");
    } finally {
      v(this, Wt, !1);
    }
  }
}, "#applyPartialState"), bs = /* @__PURE__ */ s(async function() {
  if (!h(this, Oe).length) return;
  const i = h(this, Oe).reduce((n, r) => (n[r.key] = r.default, n), {});
  v(this, ve, i), await S(this, le, Qr).call(this, i);
}, "#resetToDefaults"), tn = /* @__PURE__ */ s(function(i, n = "") {
  const r = this.element;
  if (!(r instanceof HTMLElement)) return;
  const o = r.querySelector("[data-role='status']");
  if (o instanceof HTMLElement)
    switch (o.dataset.mode = i, i) {
      case "applying":
        o.textContent = f("EIDOLON.CriteriaSwitcher.Applying", "Applying changes...");
        break;
      case "error":
        o.textContent = `${f("EIDOLON.CriteriaSwitcher.Error", "Error")}: ${n}`;
        break;
      case "ready":
      default:
        o.textContent = `${f("EIDOLON.CriteriaSwitcher.Ready", "Ready")}: ${S(this, le, Xr).call(this)}`;
        break;
    }
}, "#setStatus"), Xr = /* @__PURE__ */ s(function() {
  return h(this, Oe).length ? `[${h(this, Oe).map((i) => {
    var n;
    return ((n = h(this, ve)) == null ? void 0 : n[i.key]) ?? i.default;
  }).join(" | ")}]` : "-";
}, "#formatStateSummary"), s(De, "CriteriaSwitcherApplication"), $e(De, "APP_ID", `${X}-criteria-switcher`), $e(De, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  et(De, De, "DEFAULT_OPTIONS"),
  {
    id: De.APP_ID,
    classes: Array.from(
      /* @__PURE__ */ new Set([...((da = et(De, De, "DEFAULT_OPTIONS")) == null ? void 0 : da.classes) ?? [], "eidolon-criteria-switcher-window", "themed"])
    ),
    tag: "section",
    window: {
      title: f("EIDOLON.CriteriaSwitcher.Title", "Criteria Switcher"),
      icon: "fa-solid fa-sliders",
      resizable: !1
    },
    position: {
      width: 420,
      height: "auto"
    }
  },
  { inplace: !1 }
)), $e(De, "PARTS", {
  content: {
    template: `modules/${X}/templates/criteria-switcher.html`
  }
});
let Yr = De;
const uc = Yn(Yr);
let Mt = null;
function dc(e) {
  var t;
  return e ?? ((t = game.scenes) == null ? void 0 : t.viewed) ?? null;
}
s(dc, "resolveScene");
function fc(e) {
  var t;
  return !!(e != null && e.rendered && ((t = e == null ? void 0 : e.element) != null && t.isConnected));
}
s(fc, "isRendered");
function tr() {
  return fc(Mt) ? Mt : (Mt = null, null);
}
s(tr, "getCriteriaSwitcher");
function Es(e) {
  var n, r, o, a, l;
  const t = dc(e);
  if (!t)
    return (r = (n = ui.notifications) == null ? void 0 : n.warn) == null || r.call(n, "No active scene to open the criteria switcher."), null;
  if (!Xn(t))
    return (a = (o = ui.notifications) == null ? void 0 : o.warn) == null || a.call(o, "You do not have permission to manage scene criteria."), null;
  const i = tr();
  return i ? (i.setScene(t), i.render({ force: !0 }), (l = i.bringToFront) == null || l.call(i), i) : (Mt = uc({ scene: t }), Mt.render({ force: !0 }), Mt);
}
s(Es, "openCriteriaSwitcher");
function Cs() {
  const e = tr();
  e && (e.close(), Mt = null);
}
s(Cs, "closeCriteriaSwitcher");
function Lo(e) {
  return tr() ? (Cs(), null) : Es(e);
}
s(Lo, "toggleCriteriaSwitcher");
const gc = {
  SCHEMA_VERSION: To,
  applyState: ms,
  getState: nc,
  getVersion: rc,
  setVersion: hs,
  getCriteria(e) {
    var t;
    return Me(e ?? ((t = game.scenes) == null ? void 0 : t.viewed));
  },
  setCriteria(e, t) {
    var i;
    return Qn(t ?? ((i = game.scenes) == null ? void 0 : i.viewed), e);
  },
  updateTiles: ss,
  updatePlaceables: gs,
  indexScene: cc,
  openCriteriaSwitcher: Es,
  closeCriteriaSwitcher: Cs,
  toggleCriteriaSwitcher: Lo,
  findBestMatch: kl,
  findFileIndex: Hl,
  resolveRules: ns
};
function Ls(e) {
  var t;
  return ((t = e == null ? void 0 : e.getFlag) == null ? void 0 : t.call(e, "monks-active-tiles", "files")) ?? [];
}
s(Ls, "getTileFiles$1");
function mc(e = []) {
  return {
    strategy: "select-one",
    defaultTarget: ft(e, 0) ?? { indexHint: 0 },
    variants: [
      {
        criteria: {},
        target: ft(e, 0) ?? { indexHint: 0 }
      }
    ]
  };
}
s(mc, "createDefaultTileCriteria");
function hc(e, t = {}) {
  var a, l;
  const { allowLegacy: i = !0 } = t, n = Ls(e), r = (a = e == null ? void 0 : e.getFlag) == null ? void 0 : a.call(e, X, Ut);
  if (r) return Qt(r, { files: n });
  if (!i) return null;
  const o = (l = e == null ? void 0 : e.getFlag) == null ? void 0 : l.call(e, X, qt);
  return o ? Qt(o, { files: n }) : null;
}
s(hc, "getTileCriteria");
async function ta(e, t, i = {}) {
  if (!(e != null && e.setFlag)) return null;
  const {
    strictValidation: n = !0
  } = i, r = Ls(e), o = Qt(t, { files: r });
  if (!o)
    return typeof e.unsetFlag == "function" ? (await e.unsetFlag(X, Ut), await e.unsetFlag(X, qt)) : (await e.setFlag(X, Ut, null), await e.setFlag(X, qt, null)), null;
  if (n) {
    const a = os(o, { files: r });
    if (a.errors.length > 0)
      throw new Error(
        `Tile criteria contains ${a.errors.length} conflicting rule pair(s). Resolve clashes before saving.`
      );
  }
  return await e.setFlag(X, Ut, o), typeof e.unsetFlag == "function" && await e.unsetFlag(X, qt), o;
}
s(ta, "setTileCriteria");
const Zr = "__eidolon_any__", Nt = "eidolon-tile-criteria", pc = "fa-solid fa-sliders", Ss = Symbol.for("eidolon.tileCriteriaUiState"), ir = ["all", "unmapped", "mapped", "conflicts"];
function yc(e) {
  const t = e == null ? void 0 : e[Ss];
  return !t || typeof t != "object" ? {
    filterQuery: "",
    filterMode: "all",
    selectedFileIndex: null
  } : {
    filterQuery: typeof t.filterQuery == "string" ? t.filterQuery : "",
    filterMode: ir.includes(t.filterMode) ? t.filterMode : "all",
    selectedFileIndex: Number.isInteger(t.selectedFileIndex) ? t.selectedFileIndex : null
  };
}
s(yc, "readUiState");
function Tc(e, t) {
  if (!e || !t) return;
  typeof t.filterQuery == "string" && (e.filterQuery = t.filterQuery), ir.includes(t.filterMode) && (e.filterMode = t.filterMode), Number.isInteger(t.selectedFileIndex) && e.fileEntries.some((n) => n.index === t.selectedFileIndex) && (e.selectedFileIndex = t.selectedFileIndex);
}
s(Tc, "applyUiState");
function bc(e) {
  const t = e == null ? void 0 : e.app, i = e == null ? void 0 : e.state;
  !t || !i || (t[Ss] = {
    filterQuery: typeof i.filterQuery == "string" ? i.filterQuery : "",
    filterMode: ir.includes(i.filterMode) ? i.filterMode : "all",
    selectedFileIndex: Number.isInteger(i.selectedFileIndex) ? i.selectedFileIndex : null
  });
}
s(bc, "persistUiState");
function Ec(e) {
  const t = (e == null ? void 0 : e.object) ?? (e == null ? void 0 : e.document) ?? null;
  return !(t != null && t.isEmbedded) || t.documentName !== "Tile" ? null : t;
}
s(Ec, "getTileDocument");
function Cc(e) {
  var t;
  return ((t = e == null ? void 0 : e.getFlag) == null ? void 0 : t.call(e, "monks-active-tiles", "files")) ?? [];
}
s(Cc, "getTileFiles");
function Lc(e, t) {
  var l;
  const i = (e == null ? void 0 : e.parent) ?? ((l = game.scenes) == null ? void 0 : l.viewed) ?? null, r = Me(i).sort((c, u) => c.order - u.order).map((c) => ({
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
s(Lc, "getCriteriaDefinitions");
function Sc(e) {
  const t = {
    folders: /* @__PURE__ */ new Map(),
    files: []
  };
  for (const i of e) {
    const r = (i.path || i.label).split("/").filter(Boolean);
    if (!r.length) {
      t.files.push({ entry: i, name: i.label });
      continue;
    }
    const o = r.pop();
    let a = t;
    for (const l of r)
      a.folders.has(l) || a.folders.set(l, {
        folders: /* @__PURE__ */ new Map(),
        files: []
      }), a = a.folders.get(l);
    a.files.push({ entry: i, name: o || i.label });
  }
  return t;
}
s(Sc, "buildTree");
function Ic(e, t) {
  const i = [e];
  let n = t;
  for (; n.files.length === 0 && n.folders.size === 1; ) {
    const [r, o] = n.folders.entries().next().value;
    i.push(r), n = o;
  }
  return {
    label: i.join("/"),
    node: n
  };
}
s(Ic, "collapseFolderBranch");
function wc(e, t) {
  const i = e.rulesByFile.get(t) ?? [], n = [];
  for (const r of i) {
    const o = Object.entries(r.criteria ?? {}).filter(([, l]) => typeof l == "string" && l.trim());
    if (!o.length) {
      n.push("*");
      continue;
    }
    const a = o.map(([l, c]) => `${e.criteriaLabels.get(l) ?? l}: ${c}`).join(" · ");
    n.push(a);
  }
  return n;
}
s(wc, "getRuleSummariesForFile");
function eo(e) {
  var y, T;
  const t = Cc(e), i = bo(t), n = hc(e, { allowLegacy: !0 }) ?? mc(t), r = Lc(e, n), o = new Map(r.map((p) => [p.key, p.label])), a = new Map(
    i.map((p) => [
      p.index,
      p.path || p.label
    ])
  ), l = yn(n.defaultTarget, t), c = ((y = i[0]) == null ? void 0 : y.index) ?? 0, u = l >= 0 ? l : c, d = new Map(i.map((p) => [p.index, []]));
  let g = 1;
  for (const p of n.variants ?? []) {
    const C = yn(p.target, t);
    C < 0 || (d.has(C) || d.set(C, []), d.get(C).push({
      id: g,
      criteria: { ...p.criteria ?? {} }
    }), g += 1);
  }
  const m = i.some((p) => p.index === u) ? u : ((T = i[0]) == null ? void 0 : T.index) ?? null;
  return {
    files: t,
    fileEntries: i,
    criteriaDefinitions: r,
    criteriaLabels: o,
    relativePaths: a,
    defaultIndex: u,
    selectedFileIndex: m,
    filterQuery: "",
    filterMode: "all",
    nextRuleId: g,
    rulesByFile: d,
    status: {
      mode: "ready",
      message: f("EIDOLON.TileCriteria.Ready", "Ready")
    }
  };
}
s(eo, "buildEditorState");
function to(e, t) {
  return e.rulesByFile.has(t) || e.rulesByFile.set(t, []), e.rulesByFile.get(t);
}
s(to, "getRulesForFile");
function Oc(e) {
  return Object.fromEntries(
    Object.entries(e ?? {}).filter(([t, i]) => typeof t == "string" && t && typeof i == "string" && i.trim()).map(([t, i]) => [t, i.trim()])
  );
}
s(Oc, "sanitizeRuleCriteria");
function Is(e) {
  const t = ft(e.files, e.defaultIndex);
  if (!t) return null;
  const i = [], n = [];
  for (const [o, a] of e.rulesByFile.entries()) {
    const l = ft(e.files, o);
    if (l)
      for (const [c, u] of a.entries()) {
        const d = Oc(u.criteria);
        i.push({
          criteria: d,
          target: { ...l }
        }), n.push({
          fileIndex: o,
          ruleId: u.id,
          rulePosition: c,
          criteria: d
        });
      }
  }
  return i.length || (i.push({
    criteria: {},
    target: { ...t }
  }), n.push({
    fileIndex: e.defaultIndex,
    ruleId: null,
    rulePosition: null,
    criteria: {},
    isFallback: !0
  })), {
    normalized: Qt(
      {
        strategy: "select-one",
        defaultTarget: t,
        variants: i
      },
      { files: e.files }
    ),
    sources: n
  };
}
s(Is, "buildTileCriteriaDraft");
function vc(e) {
  var t;
  return ((t = Is(e)) == null ? void 0 : t.normalized) ?? null;
}
s(vc, "exportTileCriteria");
function ia(e) {
  const t = Is(e);
  if (!(t != null && t.normalized))
    return {
      errors: [],
      warnings: [],
      errorFileIndexes: [],
      warningFileIndexes: []
    };
  const i = os(t.normalized, { files: e.files }), n = /* @__PURE__ */ s((l) => {
    const c = t.sources[l.leftIndex] ?? null, u = t.sources[l.rightIndex] ?? null;
    return {
      ...l,
      leftFileIndex: c == null ? void 0 : c.fileIndex,
      rightFileIndex: u == null ? void 0 : u.fileIndex
    };
  }, "mapConflict"), r = i.errors.map((l) => n(l)), o = i.warnings.map((l) => n(l)), a = /* @__PURE__ */ s((l) => {
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
s(ia, "analyzeRuleConflicts");
function ji(e, t = "neutral") {
  const i = document.createElement("span");
  return i.classList.add("eidolon-tile-criteria__badge"), i.dataset.kind = t, i.textContent = e, i;
}
s(ji, "createBadge");
function Mc(e, t = {}) {
  const i = typeof e == "string" ? e : "", {
    maxLength: n = 42,
    headLength: r = 20,
    tailLength: o = 16
  } = t;
  if (!i || i.length <= n) return i;
  const a = i.slice(0, r).trimEnd(), l = i.slice(-o).trimStart();
  return `${a}...${l}`;
}
s(Mc, "middleEllipsis");
function Nc(e) {
  const t = typeof e == "string" ? e.trim() : "";
  if (!t)
    return {
      error: "",
      matches: /* @__PURE__ */ s(() => !0, "matches")
    };
  let i = t, n = "i";
  if (t.startsWith("/") && t.length > 1) {
    const r = t.lastIndexOf("/");
    r > 0 && (i = t.slice(1, r), n = t.slice(r + 1) || "i");
  }
  n = n.replace(/g/g, "");
  try {
    const r = new RegExp(i, n);
    return {
      error: "",
      matches: /* @__PURE__ */ s((o) => r.test(String(o ?? "")), "matches")
    };
  } catch (r) {
    return {
      error: (r == null ? void 0 : r.message) ?? f("EIDOLON.TileCriteria.InvalidRegex", "Invalid regex."),
      matches: /* @__PURE__ */ s(() => !0, "matches")
    };
  }
}
s(Nc, "createRegexFilter");
function Ac(e, t) {
  const i = document.createElement("select");
  i.dataset.criteriaKey = e.key;
  const n = document.createElement("option");
  n.value = Zr, n.textContent = "*", i.appendChild(n);
  const r = new Set(e.values ?? []);
  t && !r.has(t) && r.add(t);
  for (const o of r) {
    const a = document.createElement("option");
    a.value = o, a.textContent = o, i.appendChild(a);
  }
  return i.value = t ?? Zr, i;
}
s(Ac, "createCriterionSelect");
function Dc(e, t, i, n) {
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
    const g = Ac(c, (l = e.criteria) == null ? void 0 : l[c.key]);
    g.addEventListener("change", () => {
      g.value === Zr ? delete e.criteria[c.key] : e.criteria[c.key] = g.value, n();
    }), u.appendChild(g), o.appendChild(u);
  }
  r.appendChild(o);
  const a = document.createElement("button");
  return a.type = "button", a.classList.add("control", "ui-control", "eidolon-tile-criteria__rule-remove"), a.textContent = f("EIDOLON.TileCriteria.RemoveRule", "Remove"), a.addEventListener("click", () => {
    const u = to(t, i).filter((d) => d.id !== e.id);
    t.rulesByFile.set(i, u), n();
  }), r.appendChild(a), r;
}
s(Dc, "renderRuleEditor");
const nn = /* @__PURE__ */ new WeakMap();
function ws(e) {
  return (e == null ? void 0 : e.app) ?? (e == null ? void 0 : e.tile) ?? null;
}
s(ws, "getDialogOwner");
function Fc(e) {
  for (const t of e) {
    const i = Xe(t);
    if (i) return i;
    const n = Xe(t == null ? void 0 : t.element);
    if (n) return n;
  }
  return null;
}
s(Fc, "findDialogRoot$1");
function _c(e, t, i) {
  const n = e.state, r = n.fileEntries.find((p) => p.index === t);
  if (!r) return document.createElement("div");
  const o = document.createElement("section");
  o.classList.add("eidolon-tile-criteria__dialog-content");
  const a = document.createElement("header");
  a.classList.add("eidolon-tile-criteria__editor-header");
  const l = document.createElement("h4");
  l.textContent = n.relativePaths.get(r.index) || r.label, a.appendChild(l);
  const c = document.createElement("p");
  c.classList.add("notes"), c.textContent = `#${r.index + 1} · ${r.path || f("EIDOLON.TileCriteria.UnknownPath", "Unknown path")}`, a.appendChild(c), o.appendChild(a);
  const u = document.createElement("div");
  u.classList.add("eidolon-tile-criteria__editor-controls");
  const d = document.createElement("button");
  d.type = "button", d.classList.add("control", "ui-control", "eidolon-tile-criteria__editor-action"), n.defaultIndex === r.index ? (d.textContent = f("EIDOLON.TileCriteria.IsDefault", "Default Target"), d.disabled = !0) : (d.textContent = f("EIDOLON.TileCriteria.SetDefault", "Set As Default"), d.addEventListener("click", () => {
    n.defaultIndex = r.index, Ee(e), i();
  })), u.appendChild(d);
  const g = document.createElement("button");
  g.type = "button", g.classList.add("control", "ui-control", "eidolon-tile-criteria__editor-action", "secondary"), g.textContent = f("EIDOLON.TileCriteria.ClearFileRules", "Clear File Rules"), g.addEventListener("click", () => {
    n.rulesByFile.set(r.index, []), Ee(e), i();
  }), u.appendChild(g), o.appendChild(u);
  const m = document.createElement("div");
  m.classList.add("eidolon-tile-criteria__rule-editors");
  const y = to(n, r.index);
  if (y.length)
    for (const p of y)
      m.appendChild(
        Dc(p, n, r.index, () => {
          Ee(e), i();
        })
      );
  else {
    const p = document.createElement("p");
    p.classList.add("notes"), p.textContent = f(
      "EIDOLON.TileCriteria.NoRulesForFile",
      "No rules map to this file yet. Add one to define when this variant should be active."
    ), m.appendChild(p);
  }
  o.appendChild(m);
  const T = document.createElement("button");
  return T.type = "button", T.classList.add("control", "ui-control", "eidolon-tile-criteria__editor-action"), T.textContent = f("EIDOLON.TileCriteria.AddRule", "Add Rule"), T.disabled = !n.criteriaDefinitions.length, T.addEventListener("click", () => {
    to(n, r.index).push({
      id: n.nextRuleId,
      criteria: {}
    }), n.nextRuleId += 1, Ee(e), i();
  }), o.appendChild(T), o;
}
s(_c, "buildRuleEditorContent");
function Rc(e, t) {
  var g, m, y;
  const i = ws(e);
  if (!i) return;
  const n = nn.get(i);
  if (n) {
    n.controller = e, n.fileIndex = t, (g = n.refresh) == null || g.call(n);
    return;
  }
  const r = {
    controller: e,
    fileIndex: t,
    host: null,
    refresh: null
  };
  nn.set(i, r);
  const o = /* @__PURE__ */ s(() => {
    nn.delete(i);
  }, "closeDialog"), a = /* @__PURE__ */ s(() => {
    r.host instanceof HTMLElement && r.host.replaceChildren(
      _c(r.controller, r.fileIndex, a)
    );
  }, "refreshDialog");
  r.refresh = a;
  const l = f("EIDOLON.TileCriteria.EditorTitle", "Edit Tile Criteria Rules"), c = '<div class="eidolon-tile-criteria-editor-host"></div>', u = f("EIDOLON.TileCriteria.CloseEditor", "Close"), d = (y = (m = foundry == null ? void 0 : foundry.applications) == null ? void 0 : m.api) == null ? void 0 : y.DialogV2;
  if (typeof (d == null ? void 0 : d.wait) == "function") {
    d.wait({
      window: { title: l },
      content: c,
      buttons: [{ action: "close", label: u, default: !0 }],
      render: /* @__PURE__ */ s((...T) => {
        var b;
        const p = Fc(T), C = (b = p == null ? void 0 : p.querySelector) == null ? void 0 : b.call(p, ".eidolon-tile-criteria-editor-host");
        C instanceof HTMLElement && (r.host = C, a());
      }, "render"),
      close: o,
      rejectClose: !1
    }).catch((T) => {
      console.warn(`${X} | Rule editor dialog failed`, T), o();
    });
    return;
  }
  o();
}
s(Rc, "openRuleEditorDialog");
function na(e) {
  var n;
  const t = ws(e);
  if (!t) return;
  const i = nn.get(t);
  (n = i == null ? void 0 : i.refresh) == null || n.call(i);
}
s(na, "refreshOpenRuleEditor");
function io(e, t) {
  return (e.rulesByFile.get(t) ?? []).length > 0;
}
s(io, "hasRulesForFile");
function Os(e, t) {
  var i, n;
  return ((i = e == null ? void 0 : e.errorFileIndexes) == null ? void 0 : i.includes(t)) || ((n = e == null ? void 0 : e.warningFileIndexes) == null ? void 0 : n.includes(t));
}
s(Os, "hasConflictForFile");
function xc(e, t, i) {
  switch (e.filterMode) {
    case "unmapped":
      return !io(e, t.index);
    case "mapped":
      return io(e, t.index);
    case "conflicts":
      return Os(i, t.index);
    case "all":
    default:
      return !0;
  }
}
s(xc, "matchesFilterMode");
function kc(e, t) {
  let i = 0, n = 0, r = 0;
  for (const o of e.fileEntries)
    io(e, o.index) ? i += 1 : n += 1, Os(t, o.index) && (r += 1);
  return {
    all: e.fileEntries.length,
    mapped: i,
    unmapped: n,
    conflicts: r
  };
}
s(kc, "getFilterModeCounts");
function Hc(e) {
  switch (e) {
    case "unmapped":
      return f("EIDOLON.TileCriteria.FilterModeUnmapped", "Unmapped");
    case "mapped":
      return f("EIDOLON.TileCriteria.FilterModeMapped", "Mapped");
    case "conflicts":
      return f("EIDOLON.TileCriteria.FilterModeConflicts", "Clashes");
    case "all":
    default:
      return f("EIDOLON.TileCriteria.FilterModeAll", "All");
  }
}
s(Hc, "getFilterModeLabel");
function vs(e, t, i, n, r) {
  var u, d;
  const o = [...e.folders.keys()].sort((g, m) => g.localeCompare(m));
  for (const g of o) {
    const m = Ic(g, e.folders.get(g)), y = document.createElement("li");
    y.classList.add("eidolon-tile-criteria__tree-branch");
    const T = document.createElement("div");
    T.classList.add("document", "folder", "update", "eidolon-tile-criteria__folder-row");
    const p = document.createElement("i");
    p.classList.add("fa-solid", "fa-folder-open"), T.appendChild(p);
    const C = document.createElement("span");
    C.classList.add("eidolon-tile-criteria__tree-folder-label"), C.textContent = m.label, C.title = m.label, T.appendChild(C), y.appendChild(T);
    const b = document.createElement("ul");
    b.classList.add("eidolon-tile-criteria__tree"), b.dataset.folder = m.label, vs(m.node, t, i, n, b), b.childElementCount > 0 && y.appendChild(b), r.appendChild(y);
  }
  const a = [...e.files].sort((g, m) => g.name.localeCompare(m.name));
  if (!a.length) return;
  const l = document.createElement("li"), c = document.createElement("ul");
  c.classList.add("document-list", "eidolon-tile-criteria__document-list");
  for (const g of a) {
    const m = g.entry, y = m.index === t.selectedFileIndex, T = m.index === t.defaultIndex, p = wc(t, m.index), C = document.createElement("li");
    C.classList.add("document", "update", "eidolon-tile-criteria__tree-file");
    const b = document.createElement("button");
    b.type = "button", b.classList.add("eidolon-tile-criteria__file-row");
    const E = (u = n == null ? void 0 : n.errorFileIndexes) == null ? void 0 : u.includes(m.index), O = (d = n == null ? void 0 : n.warningFileIndexes) == null ? void 0 : d.includes(m.index);
    E ? b.classList.add("has-conflict") : O && b.classList.add("has-warning");
    const D = t.relativePaths.get(m.index) || m.path || g.name, R = [D];
    E ? R.push(
      f(
        "EIDOLON.TileCriteria.ConflictFileHint",
        "This file participates in one or more conflicting rules."
      )
    ) : O && R.push(
      f(
        "EIDOLON.TileCriteria.WarningFileHint",
        "This file has potentially redundant rules."
      )
    ), p.length || R.push(
      f(
        "EIDOLON.TileCriteria.UnmappedHint",
        "No criteria rules map to this file."
      )
    ), b.title = R.join(`
`), y && b.classList.add("is-selected"), b.addEventListener("click", () => {
      t.selectedFileIndex = m.index, Ee(i), Rc(i, m.index);
    });
    const _ = document.createElement("span");
    _.classList.add("eidolon-tile-criteria__indicator"), _.dataset.kind = T ? "default" : p.length ? "mapped" : "unmapped", b.appendChild(_);
    const V = document.createElement("span");
    V.classList.add("eidolon-tile-criteria__file-content");
    const Z = document.createElement("span");
    Z.classList.add("eidolon-tile-criteria__file-heading");
    const ne = document.createElement("span");
    ne.classList.add("eidolon-tile-criteria__file-title"), ne.textContent = Mc(g.name || m.label), ne.title = D, Z.appendChild(ne);
    const F = ji(`#${m.index + 1}`, "meta");
    F.classList.add("eidolon-tile-criteria__index-badge"), Z.appendChild(F), V.appendChild(Z);
    const J = document.createElement("span");
    J.classList.add("eidolon-tile-criteria__badges"), T && J.appendChild(ji(f("EIDOLON.TileCriteria.DefaultBadge", "Default"), "default"));
    const w = p.slice(0, 2);
    for (const x of w)
      J.appendChild(ji(x, "rule"));
    if (p.length > w.length && J.appendChild(ji(`+${p.length - w.length}`, "meta")), V.appendChild(J), b.appendChild(V), E || O) {
      const x = document.createElement("span");
      x.classList.add("eidolon-tile-criteria__row-warning"), x.dataset.mode = E ? "error" : "warning", x.innerHTML = '<i class="fa-solid fa-triangle-exclamation" inert=""></i>', b.appendChild(x);
    }
    C.appendChild(b), c.appendChild(C);
  }
  l.appendChild(c), r.appendChild(l);
}
s(vs, "renderTreeNode");
function $c(e, t, i, n = {}) {
  const r = document.createElement("section");
  r.classList.add("eidolon-tile-criteria__tree-panel");
  const o = Nc(e.filterQuery), a = kc(e, i);
  e.filterMode !== "all" && a[e.filterMode] === 0 && (e.filterMode = "all");
  const l = document.createElement("div");
  l.classList.add("eidolon-tile-criteria__toolbar");
  const c = document.createElement("div");
  c.classList.add("eidolon-tile-criteria__mode-bar");
  for (const E of ir) {
    const O = document.createElement("button");
    O.type = "button", O.classList.add("control", "ui-control", "eidolon-tile-criteria__mode-button"), O.dataset.mode = E, O.textContent = Hc(E);
    const D = E === "all" || a[E] > 0;
    O.disabled = !D, D || (O.dataset.tooltip = f(
      "EIDOLON.TileCriteria.FilterModeUnavailable",
      "No entries currently match this filter."
    ), O.title = O.dataset.tooltip), e.filterMode === E ? (O.classList.add("is-active"), O.setAttribute("aria-pressed", "true")) : O.setAttribute("aria-pressed", "false"), O.addEventListener("click", () => {
      e.filterMode !== E && (e.filterMode = E, Ee(t));
    }), c.appendChild(O);
  }
  l.appendChild(c);
  const u = document.createElement("div");
  u.classList.add("eidolon-tile-criteria__filter-row");
  const d = document.createElement("input");
  d.type = "text", d.classList.add("eidolon-tile-criteria__filter-input"), d.placeholder = f("EIDOLON.TileCriteria.FilterPlaceholder", "Regex filter (path)"), d.value = e.filterQuery, d.autocomplete = "off", d.addEventListener("keydown", (E) => {
    E.stopPropagation(), E.key === "Enter" && E.preventDefault();
  }), d.addEventListener("keyup", (E) => {
    E.stopPropagation();
  }), d.addEventListener("change", (E) => {
    E.stopPropagation();
  }), d.addEventListener("input", (E) => {
    E.stopPropagation();
    const O = d.selectionStart ?? d.value.length, D = d.selectionEnd ?? O;
    e.filterQuery = d.value, Ee(t), requestAnimationFrame(() => {
      const R = t.section.querySelector(".eidolon-tile-criteria__filter-input");
      if (R instanceof HTMLInputElement) {
        R.focus();
        try {
          R.setSelectionRange(O, D);
        } catch {
        }
      }
    });
  }), u.appendChild(d);
  const g = document.createElement("div");
  g.classList.add("eidolon-tile-criteria__toolbar-actions");
  const m = document.createElement("button");
  m.type = "button";
  const y = f("EIDOLON.TileCriteria.Save", "Save Rules");
  m.classList.add("control", "ui-control", "eidolon-tile-criteria__toolbar-action", "icon-only"), m.dataset.tooltip = y, m.setAttribute("aria-label", y), m.title = y, m.innerHTML = '<i class="fa-solid fa-floppy-disk" inert=""></i>', m.disabled = i.errors.length > 0, m.addEventListener("click", () => {
    var E;
    (E = n.onSave) == null || E.call(n);
  }), g.appendChild(m);
  const T = document.createElement("button");
  T.type = "button";
  const p = f("EIDOLON.TileCriteria.Clear", "Clear Rules");
  if (T.classList.add("control", "ui-control", "secondary", "eidolon-tile-criteria__toolbar-action", "icon-only"), T.dataset.tooltip = p, T.setAttribute("aria-label", p), T.title = p, T.innerHTML = '<i class="fa-solid fa-trash" inert=""></i>', T.addEventListener("click", () => {
    var E;
    (E = n.onClear) == null || E.call(n);
  }), g.appendChild(T), u.appendChild(g), l.appendChild(u), r.appendChild(l), o.error) {
    const E = document.createElement("p");
    E.classList.add("notes", "eidolon-tile-criteria__filter-error"), E.textContent = `${f("EIDOLON.TileCriteria.InvalidRegex", "Invalid regex")}: ${o.error}`, r.appendChild(E);
  }
  const C = document.createElement("div");
  C.classList.add("eidolon-tile-criteria__library-tree");
  const b = e.fileEntries.filter((E) => {
    const O = e.relativePaths.get(E.index) || E.path || E.label;
    return xc(e, E, i) && o.matches(O);
  });
  if (e.fileEntries.length)
    if (b.length) {
      const E = document.createElement("ul");
      E.classList.add("eidolon-tile-criteria__tree"), vs(Sc(b), e, t, i, E), C.appendChild(E);
    } else {
      const E = document.createElement("p");
      E.classList.add("notes"), E.textContent = f("EIDOLON.TileCriteria.NoMatches", "No variants match this filter."), C.appendChild(E);
    }
  else {
    const E = document.createElement("p");
    E.classList.add("notes"), E.textContent = f("EIDOLON.TileCriteria.NoVariants", "No MATT variants found"), C.appendChild(E);
  }
  return r.appendChild(C), r;
}
s($c, "renderTreePanel");
function Ee(e) {
  const { section: t, state: i } = e, n = ia(i);
  bc(e), t.replaceChildren();
  const r = /* @__PURE__ */ s(async () => {
    try {
      const a = ia(i);
      if (a.errors.length) {
        i.status = {
          mode: "error",
          message: f(
            "EIDOLON.TileCriteria.ConflictSaveBlocked",
            `Resolve ${a.errors.length} conflict(s) before saving tile criteria rules.`
          )
        }, Ee(e);
        return;
      }
      const l = vc(i);
      if (!l) {
        i.status = {
          mode: "error",
          message: f("EIDOLON.TileCriteria.Invalid", "Invalid rules. Select valid target variants.")
        }, Ee(e);
        return;
      }
      await ta(e.tile, l);
      const c = i.filterQuery, u = i.filterMode, d = i.selectedFileIndex;
      e.state = eo(e.tile), e.state.filterQuery = c, e.state.filterMode = u, Number.isInteger(d) && (e.state.selectedFileIndex = d), e.state.status = {
        mode: "ready",
        message: f("EIDOLON.TileCriteria.Saved", "Tile criteria rules saved.")
      }, Ee(e), na(e);
    } catch (a) {
      console.error(`${X} | Failed to save tile criteria`, a), i.status = {
        mode: "error",
        message: (a == null ? void 0 : a.message) ?? "Failed to save tile criteria rules."
      }, Ee(e);
    }
  }, "handleSave"), o = /* @__PURE__ */ s(async () => {
    try {
      await ta(e.tile, null);
      const a = i.filterQuery, l = i.filterMode, c = i.selectedFileIndex;
      e.state = eo(e.tile), e.state.filterQuery = a, e.state.filterMode = l, Number.isInteger(c) && (e.state.selectedFileIndex = c), e.state.status = {
        mode: "ready",
        message: f("EIDOLON.TileCriteria.Cleared", "Tile criteria rules cleared.")
      }, Ee(e), na(e);
    } catch (a) {
      console.error(`${X} | Failed to clear tile criteria`, a), i.status = {
        mode: "error",
        message: (a == null ? void 0 : a.message) ?? "Failed to clear tile criteria rules."
      }, Ee(e);
    }
  }, "handleClear");
  if (t.appendChild($c(i, e, n, {
    onSave: r,
    onClear: o
  })), n.errors.length || n.warnings.length) {
    const a = document.createElement("section");
    a.classList.add("eidolon-tile-criteria__conflicts");
    const l = document.createElement("p");
    l.classList.add("eidolon-tile-criteria__conflict-summary", "notes"), n.errors.length ? (l.dataset.mode = "error", l.textContent = f(
      "EIDOLON.TileCriteria.ConflictSummary",
      `${n.errors.length} conflict(s) must be resolved before saving${n.warnings.length ? ` (${n.warnings.length} warning(s))` : ""}.`
    )) : (l.dataset.mode = "warning", l.textContent = f(
      "EIDOLON.TileCriteria.WarningSummary",
      `${n.warnings.length} potential issue(s) detected.`
    )), a.appendChild(l);
    const c = document.createElement("p");
    c.classList.add("eidolon-tile-criteria__conflict-hint", "notes"), c.textContent = f(
      "EIDOLON.TileCriteria.ConflictHint",
      "Files involved in clashes are marked in red with a warning icon."
    ), a.appendChild(c), t.appendChild(a);
  }
  if (i.status.mode === "error" || i.status.mode === "warning") {
    const a = document.createElement("p");
    a.classList.add("eidolon-tile-criteria__status", "notes"), a.dataset.mode = i.status.mode, a.textContent = i.status.message, t.appendChild(a);
  }
}
s(Ee, "renderController");
function Pc(e, t = null) {
  const i = document.createElement("section");
  i.classList.add("eidolon-tile-criteria");
  const n = eo(e);
  Tc(n, yc(t));
  const r = {
    app: t,
    tile: e,
    section: i,
    state: n
  };
  return Ee(r), r;
}
s(Pc, "createController");
function Bc(e) {
  if (!(e instanceof HTMLElement)) return null;
  const t = [
    ":scope > footer.sheet-footer",
    ":scope > footer.form-footer",
    ":scope > .sheet-footer",
    ":scope > .form-footer",
    ":scope > footer"
  ];
  for (const i of t) {
    const n = e.querySelector(i);
    if (n instanceof HTMLElement) return n;
  }
  return null;
}
s(Bc, "findFooterElement");
function qc(e) {
  if (!(e instanceof HTMLElement)) return null;
  const t = [
    "nav.sheet-tabs[data-group]",
    "nav.tabs[data-group]",
    "nav.sheet-tabs",
    "nav.tabs"
  ];
  for (const i of t) {
    const n = e.querySelector(i);
    if (n instanceof HTMLElement) return n;
  }
  return null;
}
s(qc, "findTabNav");
function Uc(e, t) {
  var n, r, o;
  return e instanceof HTMLElement ? [
    (n = e.querySelector(".tab[data-tab]")) == null ? void 0 : n.parentElement,
    e.querySelector(".sheet-body"),
    (o = (r = t == null ? void 0 : t.parentElement) == null ? void 0 : r.querySelector) == null ? void 0 : o.call(r, ":scope > .sheet-body"),
    t == null ? void 0 : t.parentElement
  ].find((a) => a instanceof HTMLElement) ?? null : null;
}
s(Uc, "findTabBody");
function Vc(e, t) {
  var i, n, r, o, a, l, c;
  return ((i = e == null ? void 0 : e.dataset) == null ? void 0 : i.group) ?? ((o = (r = (n = e == null ? void 0 : e.querySelector) == null ? void 0 : n.call(e, "[data-group]")) == null ? void 0 : r.dataset) == null ? void 0 : o.group) ?? ((c = (l = (a = t == null ? void 0 : t.querySelector) == null ? void 0 : a.call(t, ".tab[data-group]")) == null ? void 0 : l.dataset) == null ? void 0 : c.group) ?? "main";
}
s(Vc, "getTabGroup");
function jc(e, t) {
  if (!(e instanceof HTMLElement)) return;
  e.textContent = "";
  const i = document.createElement("i");
  i.className = pc, i.setAttribute("inert", ""), e.append(i, " ");
  const n = document.createElement("span");
  n.textContent = t, e.append(n);
}
s(jc, "setTabButtonContent");
function zc(e, t) {
  const i = e.querySelector("[data-tab]"), n = (i == null ? void 0 : i.tagName) || "A", r = document.createElement(n);
  return i instanceof HTMLElement && (r.className = i.className), r.classList.remove("active"), n === "BUTTON" && (r.type = "button"), r.dataset.action = "tab", r.dataset.tab = Nt, r.dataset.group = t, r.setAttribute("aria-selected", "false"), r.setAttribute("aria-pressed", "false"), r;
}
s(zc, "createTabButton");
function Gc(e, t) {
  const i = document.createElement("div");
  i.classList.add("tab"), i.dataset.tab = Nt, i.dataset.group = t, i.dataset.applicationPart = Nt, i.setAttribute("hidden", "true");
  const n = Bc(e);
  return e.insertBefore(i, n ?? null), i;
}
s(Gc, "createTabPanel");
function hr(e, t, i, n) {
  var a;
  if (!(i instanceof HTMLElement) || !(n instanceof HTMLElement)) return;
  const r = (a = e == null ? void 0 : e.tabGroups) == null ? void 0 : a[t];
  if (typeof r == "string" ? r === Nt : i.classList.contains("active") || n.classList.contains("active")) {
    i.classList.add("active"), i.setAttribute("aria-selected", "true"), i.setAttribute("aria-pressed", "true"), n.classList.add("active"), n.removeAttribute("hidden"), n.removeAttribute("aria-hidden");
    return;
  }
  i.classList.remove("active"), i.setAttribute("aria-selected", "false"), i.setAttribute("aria-pressed", "false"), n.classList.remove("active"), n.setAttribute("hidden", "true");
}
s(hr, "syncTabVisibility");
function Wc(e, t) {
  const i = qc(t), n = Uc(t, i);
  if (!(i instanceof HTMLElement) || !(n instanceof HTMLElement)) return null;
  const r = Vc(i, n);
  let o = i.querySelector(`[data-tab="${Nt}"]`);
  o instanceof HTMLElement || (o = zc(i, r), i.appendChild(o)), jc(o, f("EIDOLON.TileCriteria.TabLabel", "Criteria"));
  let a = n.querySelector(`.tab[data-tab="${Nt}"]`);
  return a instanceof HTMLElement || (a = Gc(n, r)), o.dataset.eidolonTileCriteriaBound || (o.addEventListener("click", () => {
    qa(e, Nt, r), requestAnimationFrame(() => {
      hr(e, r, o, a);
    });
  }), o.dataset.eidolonTileCriteriaBound = "true"), hr(e, r, o, a), requestAnimationFrame(() => {
    hr(e, r, o, a);
  }), a;
}
s(Wc, "ensureTileCriteriaTab");
function Kc() {
  Hooks.on("renderTileConfig", (e, t) => {
    var c, u;
    const i = Xe(t);
    if (!i) return;
    const n = Ec(e);
    if (!n) return;
    (c = i.querySelector(".eidolon-tile-criteria")) == null || c.remove();
    const r = Pc(n, e), o = Wc(e, i);
    if (o instanceof HTMLElement) {
      o.replaceChildren(r.section), (u = e.setPosition) == null || u.call(e, { height: "auto" });
      return;
    }
    const a = (e == null ? void 0 : e.form) instanceof HTMLFormElement ? e.form : i instanceof HTMLFormElement ? i : i.querySelector("form");
    if (!(a instanceof HTMLFormElement)) return;
    const l = a.querySelector("button[type='submit']");
    l != null && l.parentElement ? l.parentElement.insertAdjacentElement("beforebegin", r.section) : a.appendChild(r.section);
  });
}
s(Kc, "registerTileCriteriaConfigControls");
function Jc(e) {
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
s(Jc, "toList");
function Yc(e, t) {
  const i = e == null ? void 0 : e.tools;
  return Array.isArray(i) ? i.some((n) => (n == null ? void 0 : n.name) === t) : i instanceof Map ? i.has(t) : i && typeof i == "object" ? t in i ? !0 : Object.values(i).some((n) => (n == null ? void 0 : n.name) === t) : !1;
}
s(Yc, "hasTool");
function Qc(e, t) {
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
s(Qc, "addTool");
function Xc() {
  Hooks.on("getSceneControlButtons", (e) => {
    var n;
    const t = Jc(e);
    if (!t.length) return;
    const i = t.find((r) => (r == null ? void 0 : r.name) === "tiles") ?? t.find((r) => (r == null ? void 0 : r.name) === "tokens" || (r == null ? void 0 : r.name) === "token") ?? t[0];
    i && (Yc(i, "eidolonCriteriaSwitcher") || Qc(i, {
      name: "eidolonCriteriaSwitcher",
      title: "Criteria Switcher",
      icon: "fa-solid fa-sliders",
      button: !0,
      toggle: !1,
      visible: Xn(((n = game.scenes) == null ? void 0 : n.viewed) ?? null),
      onClick: /* @__PURE__ */ s(() => {
        Lo();
      }, "onClick")
    }));
  });
}
s(Xc, "registerSceneControlButton");
function Zc() {
  Xc(), Kc(), Hooks.once("init", () => {
    var e, t;
    (t = (e = game.keybindings) == null ? void 0 : e.register) == null || t.call(e, X, "toggleCriteriaSwitcher", {
      name: "Toggle Criteria Switcher",
      hint: "Open or close the criteria switcher window for live scene state updates.",
      editable: [{ key: "KeyM", modifiers: ["Alt"] }],
      onDown: /* @__PURE__ */ s(() => {
        var i, n, r;
        return Xn(((i = game.scenes) == null ? void 0 : i.viewed) ?? null) ? (Lo(), !0) : ((r = (n = ui.notifications) == null ? void 0 : n.warn) == null || r.call(n, "You do not have permission to manage scene criteria."), !0);
      }, "onDown"),
      restricted: !0,
      precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL
    });
  }), Hooks.on("canvasReady", (e) => {
    var i;
    const t = tr();
    t && (t.setScene((e == null ? void 0 : e.scene) ?? ((i = game.scenes) == null ? void 0 : i.viewed) ?? null), t.render({ force: !0 }));
  }), Hooks.once("ready", () => {
    var t, i;
    const e = (i = (t = game.modules) == null ? void 0 : t.get) == null ? void 0 : i.call(t, X);
    e && (e.api || (e.api = {}), e.api.criteria = gc, console.log(`${X} | Criteria engine API registered`));
  });
}
s(Zc, "registerCriteriaEngineHooks");
Zc();
const rn = /* @__PURE__ */ new WeakMap(), zi = /* @__PURE__ */ new WeakMap(), se = "__eidolon_default__";
function eu() {
  Hooks.on("renderAmbientLightConfig", tu), L("LightCriteria | AmbientLightConfig controls registered");
}
s(eu, "registerAmbientLightCriteriaControls");
function tu(e, t) {
  var i;
  Jt("LightCriteria | renderAmbientLightConfig", {
    appId: (e == null ? void 0 : e.id) ?? null,
    constructor: ((i = e == null ? void 0 : e.constructor) == null ? void 0 : i.name) ?? null,
    isRendered: (e == null ? void 0 : e.rendered) ?? !1
  });
  try {
    const n = Xe(t);
    if (!n) return;
    iu(e, n);
  } catch (n) {
    console.error("eidolon-utilities | Failed to enhance AmbientLightConfig UI", n);
  } finally {
    ct();
  }
}
s(tu, "handleAmbientLightConfigRender");
function iu(e, t) {
  var ei, mt, ti;
  const i = (e == null ? void 0 : e.form) instanceof HTMLFormElement ? e.form : t instanceof HTMLFormElement ? t : (ei = t == null ? void 0 : t.closest) == null ? void 0 : ei.call(t, "form");
  if (!(i instanceof HTMLFormElement)) return;
  const n = i.querySelector(".window-content");
  if (!(n instanceof HTMLElement)) return;
  const r = Ns(e);
  if (!r) return;
  const o = Eu(r);
  L("LightCriteria | Resolved ambient light", {
    sheetId: (r == null ? void 0 : r.id) ?? null,
    persistedId: (o == null ? void 0 : o.id) ?? null,
    sameRef: r === o
  });
  const a = (o == null ? void 0 : o.parent) ?? r.parent ?? null, l = a ? Ol(a) : [], c = l.filter(
    (A) => Array.isArray(A == null ? void 0 : A.values) && A.values.length > 0
  ), u = mu(l), d = o ?? r, g = a ? Me(a) : [];
  let m = cs(d);
  const y = ec(m, g);
  JSON.stringify(y) !== JSON.stringify(m) && (m = y, us(d, y).catch((A) => {
    console.warn("eidolon-utilities | Failed to persist migrated light criteria keys", A);
  })), L("LightCriteria | Loaded mapping state", {
    hasBase: !!(m != null && m.base),
    mappingCount: Array.isArray(m == null ? void 0 : m.mappings) ? m.mappings.length : 0,
    mappings: Array.isArray(m == null ? void 0 : m.mappings) ? m.mappings.map((A) => {
      var U, G;
      return {
        id: A.id,
        key: A.key,
        hasColor: !!((G = (U = A.config) == null ? void 0 : U.config) != null && G.color)
      };
    }) : []
  });
  const T = n.querySelector(".eidolon-light-criteria");
  T && T.remove(), n.querySelectorAll(".eidolon-light-criteria-main-switcher").forEach((A) => A.remove());
  const p = document.createElement("fieldset");
  p.classList.add("eidolon-light-criteria");
  const C = document.createElement("legend");
  C.textContent = f("EIDOLON.LightCriteria.Legend", "Scene Criteria Lighting"), p.appendChild(C);
  const b = document.createElement("p");
  b.classList.add("notes"), b.textContent = f(
    "EIDOLON.LightCriteria.Description",
    "Capture a base lighting state, then map criteria values to lighting configurations."
  ), p.appendChild(b);
  const E = document.createElement("div");
  E.classList.add("eidolon-light-criteria__controls");
  const O = document.createElement("button");
  O.type = "button", O.dataset.action = "make-default", O.classList.add("eidolon-light-criteria__button"), O.textContent = f(
    "EIDOLON.LightCriteria.SetBase",
    "Set Base"
  ), E.appendChild(O);
  const D = document.createElement("button");
  D.type = "button", D.dataset.action = "create-mapping", D.classList.add("eidolon-light-criteria__button"), D.textContent = f(
    "EIDOLON.LightCriteria.CreateMapping",
    "Add Criteria Mapping"
  ), D.setAttribute("aria-expanded", "false"), E.appendChild(D), p.appendChild(E);
  const R = document.createElement("p");
  R.classList.add("notes", "eidolon-light-criteria__status"), p.appendChild(R);
  const _ = document.createElement("div");
  _.classList.add("eidolon-light-criteria__switcher");
  const V = document.createElement("label");
  V.classList.add("eidolon-light-criteria__switcher-label");
  const Z = `${(e == null ? void 0 : e.id) ?? (r == null ? void 0 : r.id) ?? "eidolon-light"}-mapping-select`;
  V.htmlFor = Z, V.textContent = f("EIDOLON.LightCriteria.SelectLabel", "Criteria Mapping"), _.appendChild(V);
  const ne = document.createElement("div");
  ne.classList.add("eidolon-light-criteria__switcher-controls"), _.appendChild(ne);
  const F = document.createElement("select");
  F.id = Z, F.classList.add("eidolon-light-criteria__select"), F.dataset.action = "select-mapping", ne.appendChild(F);
  const J = document.createElement("div");
  J.classList.add("eidolon-light-criteria__action-stack"), ne.appendChild(J);
  const w = document.createElement("button");
  w.type = "button", w.dataset.action = "apply-selected-mapping", w.classList.add("eidolon-light-criteria__button", "secondary", "icon-only"), w.dataset.tooltip = f("EIDOLON.LightCriteria.ApplyButton", "Apply"), w.setAttribute("aria-label", f("EIDOLON.LightCriteria.ApplyButton", "Apply")), w.innerHTML = '<i class="fa-solid fa-play" inert=""></i>', J.appendChild(w);
  const x = document.createElement("button");
  x.type = "button", x.dataset.action = "update-selected-mapping", x.classList.add("eidolon-light-criteria__button", "secondary", "icon-only"), x.dataset.tooltip = f("EIDOLON.LightCriteria.UpdateButton", "Save Changes"), x.setAttribute(
    "aria-label",
    f("EIDOLON.LightCriteria.UpdateButton", "Save Changes")
  ), x.innerHTML = '<i class="fa-solid fa-floppy-disk" inert=""></i>', J.appendChild(x);
  const H = document.createElement("button");
  H.type = "button", H.dataset.action = "edit-selected-mapping-criteria", H.classList.add("eidolon-light-criteria__button", "secondary", "icon-only"), H.dataset.tooltip = f("EIDOLON.LightCriteria.EditCriteriaButton", "Edit Criteria"), H.setAttribute(
    "aria-label",
    f("EIDOLON.LightCriteria.EditCriteriaButton", "Edit Criteria")
  ), H.innerHTML = '<i class="fa-solid fa-sliders" inert=""></i>', J.appendChild(H);
  const $ = document.createElement("button");
  $.type = "button", $.dataset.action = "remove-selected-mapping", $.classList.add("eidolon-light-criteria__button", "secondary", "icon-only", "danger"), $.dataset.tooltip = f("EIDOLON.LightCriteria.RemoveMapping", "Remove Mapping"), $.setAttribute(
    "aria-label",
    f("EIDOLON.LightCriteria.RemoveMapping", "Remove Mapping")
  ), $.innerHTML = '<i class="fa-solid fa-trash" inert=""></i>', J.appendChild($);
  const P = document.createElement("div");
  P.classList.add("eidolon-light-criteria-main-switcher"), P.appendChild(_);
  const B = document.createElement("p");
  if (B.classList.add("notes", "eidolon-light-criteria-main-switcher__empty"), B.textContent = f(
    "EIDOLON.LightCriteria.ActiveRequiresBase",
    "Set Base Lighting to enable mapping selection and actions."
  ), P.appendChild(B), l.length === 0) {
    const A = document.createElement("p");
    A.classList.add("notification", "warning", "eidolon-light-criteria__warning"), A.textContent = f(
      "EIDOLON.LightCriteria.NoCategoriesWarning",
      "This scene has no criteria configured. Add criteria under Scene -> Criteria to enable criteria-driven lighting."
    ), p.appendChild(A);
  } else if (c.length === 0) {
    const A = document.createElement("p");
    A.classList.add("notification", "warning", "eidolon-light-criteria__warning"), A.textContent = f(
      "EIDOLON.LightCriteria.NoValuesWarning",
      "Criteria exist, but none define selectable values. Add values in Scene -> Criteria."
    ), p.appendChild(A);
  }
  const q = document.createElement("div");
  q.classList.add("eidolon-light-criteria__creation"), q.dataset.section = "creation", q.hidden = !0;
  const fe = document.createElement("p");
  fe.classList.add("notes"), fe.textContent = f(
    "EIDOLON.LightCriteria.CreateDescription",
    "Assign scene criteria values to map the current configuration."
  ), q.appendChild(fe);
  const z = document.createElement("div");
  z.classList.add("eidolon-light-criteria__category-list"), q.appendChild(z);
  for (const A of c) {
    const U = document.createElement("label");
    U.classList.add("eidolon-light-criteria__category");
    const G = document.createElement("span");
    G.classList.add("eidolon-light-criteria__category-name"), G.textContent = (ti = (mt = A.name) == null ? void 0 : mt.trim) != null && ti.call(mt) ? A.name.trim() : f("EIDOLON.LightCriteria.UnnamedCategory", "Unnamed Category"), U.appendChild(G);
    const K = document.createElement("select");
    K.dataset.categoryId = A.id, K.classList.add("eidolon-light-criteria__category-select");
    const Q = document.createElement("option");
    Q.value = "", Q.textContent = f(
      "EIDOLON.LightCriteria.IgnoreCategory",
      "Ignore"
    ), K.appendChild(Q);
    for (const te of A.values) {
      const re = document.createElement("option");
      re.value = te, re.textContent = te, K.appendChild(re);
    }
    U.appendChild(K), z.appendChild(U);
  }
  const ee = document.createElement("div");
  ee.classList.add("eidolon-light-criteria__creation-actions");
  const ke = document.createElement("button");
  ke.type = "button", ke.dataset.action = "save-mapping", ke.classList.add("eidolon-light-criteria__button", "primary"), ke.textContent = f(
    "EIDOLON.LightCriteria.SaveMapping",
    "Save Mapping"
  ), ee.appendChild(ke);
  const we = document.createElement("button");
  we.type = "button", we.dataset.action = "cancel-create", we.classList.add("eidolon-light-criteria__button", "secondary"), we.textContent = f(
    "EIDOLON.LightCriteria.Cancel",
    "Cancel"
  ), ee.appendChild(we), q.appendChild(ee), p.appendChild(q), n.prepend(P), n.appendChild(p), p.hidden = !0, ou(e, {
    fieldset: p,
    homeContainer: n
  }), requestAnimationFrame(() => {
    var A;
    (A = e.setPosition) == null || A.call(e, { height: "auto" });
  });
  let M = m;
  yt({ switcher: _, emptyState: B, state: M }), pt(R, M), oi(D, {
    state: M,
    hasCategories: c.length > 0
  }), L("LightCriteria | Controls injected", {
    sceneId: (a == null ? void 0 : a.id) ?? null,
    lightId: (r == null ? void 0 : r.id) ?? null,
    hasBase: !!(M != null && M.base),
    mappingCount: Array.isArray(M == null ? void 0 : M.mappings) ? M.mappings.length : 0,
    categories: c.length
  });
  const $i = hu(M), j = {
    restoreConfig: null,
    app: e,
    selectedMapping: $i,
    editorMode: "create",
    editingMappingId: null
  };
  rn.set(p, j), F.addEventListener("change", () => {
    j.selectedMapping = F.value ?? "", Pe({
      mappingSelect: F,
      applyMappingButton: w,
      updateMappingButton: x,
      editCriteriaButton: H,
      removeMappingButton: $,
      state: M
    }), bu(
      o ?? r,
      M,
      j.selectedMapping
    ).then((A) => {
      A && (M = A);
    });
  });
  const gt = /* @__PURE__ */ s(async () => {
    var K, Q, te, re, ge, Ne, me, oe, ie, Ae, Ze, He, ht, ii;
    const A = F.value ?? "";
    if (!A) {
      (Q = (K = ui.notifications) == null ? void 0 : K.warn) == null || Q.call(
        K,
        f(
          "EIDOLON.LightCriteria.SelectMappingWarning",
          "Choose a criteria mapping before applying."
        )
      ), Pe({
        mappingSelect: F,
        applyMappingButton: w,
        updateMappingButton: x,
        editCriteriaButton: H,
        removeMappingButton: $,
        state: M
      });
      return;
    }
    if (A === se) {
      if (!(M != null && M.base)) {
        (re = (te = ui.notifications) == null ? void 0 : te.warn) == null || re.call(
          te,
          f(
            "EIDOLON.LightCriteria.BaseUnavailable",
            "Set a base lighting state before applying it."
          )
        );
        return;
      }
      Gi(p, q, D), an(e, i, M.base), M = await fi(o ?? r, {
        mappingId: se,
        categories: null,
        updatedAt: Date.now()
      }), j.selectedMapping = se, Ge(F, M, u, j.selectedMapping), j.selectedMapping = F.value ?? se, pt(R, M), yt({ switcher: _, emptyState: B, state: M }), oi(D, {
        state: M,
        hasCategories: c.length > 0
      }), oa(i, {
        mappingId: se,
        color: ((Ne = (ge = M.base) == null ? void 0 : ge.config) == null ? void 0 : Ne.color) ?? null
      }), (oe = (me = ui.notifications) == null ? void 0 : me.info) == null || oe.call(
        me,
        f(
          "EIDOLON.LightCriteria.BaseApplied",
          "Applied the base lighting state to the form."
        )
      ), Pe({
        mappingSelect: F,
        applyMappingButton: w,
        updateMappingButton: x,
        editCriteriaButton: H,
        removeMappingButton: $,
        state: M
      });
      return;
    }
    const U = Array.isArray(M == null ? void 0 : M.mappings) && M.mappings.length ? M.mappings.find((Rt) => (Rt == null ? void 0 : Rt.id) === A) : null;
    if (!U) {
      (Ae = (ie = ui.notifications) == null ? void 0 : ie.warn) == null || Ae.call(
        ie,
        f(
          "EIDOLON.LightCriteria.MappingUnavailable",
          "The selected criteria mapping is no longer available."
        )
      ), Ge(F, M, u, ""), j.selectedMapping = F.value ?? "", Pe({
        mappingSelect: F,
        applyMappingButton: w,
        updateMappingButton: x,
        editCriteriaButton: H,
        removeMappingButton: $,
        state: M
      });
      return;
    }
    Gi(p, q, D), an(e, i, U.config), M = await fi(o ?? r, {
      mappingId: U.id,
      categories: U.categories,
      updatedAt: Date.now()
    }), j.selectedMapping = U.id, Ge(F, M, u, j.selectedMapping), j.selectedMapping = F.value ?? U.id, pt(R, M), yt({ switcher: _, emptyState: B, state: M }), oi(D, {
      state: M,
      hasCategories: c.length > 0
    }), oa(i, {
      mappingId: U.id,
      color: ((He = (Ze = U.config) == null ? void 0 : Ze.config) == null ? void 0 : He.color) ?? null
    });
    const G = jt(U, u);
    (ii = (ht = ui.notifications) == null ? void 0 : ht.info) == null || ii.call(
      ht,
      f(
        "EIDOLON.LightCriteria.MappingApplied",
        "Applied mapping: {label}"
      ).replace("{label}", G)
    ), Pe({
      mappingSelect: F,
      applyMappingButton: w,
      updateMappingButton: x,
      editCriteriaButton: H,
      removeMappingButton: $,
      state: M
    });
  }, "applySelectedMapping");
  w.addEventListener("click", () => {
    gt();
  }), F.addEventListener("keydown", (A) => {
    A.key === "Enter" && (A.preventDefault(), gt());
  });
  const Pi = /* @__PURE__ */ s(async () => {
    var U, G, K, Q, te, re, ge, Ne, me, oe, ie, Ae, Ze, He, ht, ii, Rt, Bi, _o, qi, Ro;
    const A = j.selectedMapping;
    if (!A) {
      (G = (U = ui.notifications) == null ? void 0 : U.warn) == null || G.call(
        U,
        f(
          "EIDOLON.LightCriteria.SelectMappingWarning",
          "Choose a criteria mapping before applying."
        )
      );
      return;
    }
    x.disabled = !0;
    try {
      const Le = on(e, o);
      if (A === se)
        M = await Qo(o ?? r, Le), L("LightCriteria | Base lighting updated", {
          lightId: ((K = o ?? r) == null ? void 0 : K.id) ?? null,
          configColor: ((Q = Le == null ? void 0 : Le.config) == null ? void 0 : Q.color) ?? null
        }), (re = (te = ui.notifications) == null ? void 0 : te.info) == null || re.call(
          te,
          f(
            "EIDOLON.LightCriteria.BaseUpdated",
            "Updated the base lighting state with the current configuration."
          )
        ), j.selectedMapping = se;
      else {
        const xt = gi(M, A);
        if (!xt) {
          (Ne = (ge = ui.notifications) == null ? void 0 : ge.warn) == null || Ne.call(
            ge,
            f(
              "EIDOLON.LightCriteria.MappingUnavailable",
              "The selected criteria mapping is no longer available."
            )
          ), Ge(F, M, u, ""), j.selectedMapping = F.value ?? "";
          return;
        }
        M = await Xo(
          o ?? r,
          xt.categories,
          Le,
          { label: xt.label ?? null }
        ), L("LightCriteria | Mapping updated", {
          mappingId: A,
          hasColor: !!((me = Le == null ? void 0 : Le.config) != null && me.color),
          stored: Array.isArray(M == null ? void 0 : M.mappings) ? ((oe = M.mappings.find((rr) => (rr == null ? void 0 : rr.id) === A)) == null ? void 0 : oe.config) ?? null : null,
          persisted: (Ae = (ie = o ?? r) == null ? void 0 : ie.getFlag) == null ? void 0 : Ae.call(ie, vt, Vt)
        });
        const ni = gi(M, A), $s = jt(ni || xt, u);
        L("LightCriteria | Mapping updated", {
          mappingId: A,
          categories: xt.categories,
          updatedColor: ((Ze = Le == null ? void 0 : Le.config) == null ? void 0 : Ze.color) ?? null,
          storedColor: ((ht = (He = ni == null ? void 0 : ni.config) == null ? void 0 : He.config) == null ? void 0 : ht.color) ?? ((Rt = (ii = xt.config) == null ? void 0 : ii.config) == null ? void 0 : Rt.color) ?? null
        }), (_o = (Bi = ui.notifications) == null ? void 0 : Bi.info) == null || _o.call(
          Bi,
          f(
            "EIDOLON.LightCriteria.MappingUpdated",
            "Saved changes to mapping: {label}"
          ).replace("{label}", $s)
        ), j.selectedMapping = A;
      }
      pt(R, M), yt({ switcher: _, emptyState: B, state: M }), oi(D, {
        state: M,
        hasCategories: c.length > 0
      }), Ge(F, M, u, j.selectedMapping), j.selectedMapping = F.value ?? "";
    } catch (Le) {
      console.error("eidolon-utilities | Failed to update light criteria mapping", Le), (Ro = (qi = ui.notifications) == null ? void 0 : qi.error) == null || Ro.call(
        qi,
        f(
          "EIDOLON.LightCriteria.MappingUpdateError",
          "Failed to save the mapping. Check the console for details."
        )
      );
    } finally {
      x.disabled = !1, Pe({
        mappingSelect: F,
        applyMappingButton: w,
        updateMappingButton: x,
        editCriteriaButton: H,
        removeMappingButton: $,
        state: M
      });
    }
  }, "updateSelectedMapping");
  x.addEventListener("click", () => {
    Pi();
  }), Ge(F, M, u, j.selectedMapping), j.selectedMapping = F.value ?? j.selectedMapping ?? "", Pe({
    mappingSelect: F,
    applyMappingButton: w,
    updateMappingButton: x,
    editCriteriaButton: H,
    removeMappingButton: $,
    state: M
  }), O.addEventListener("click", async () => {
    var A, U, G, K, Q, te;
    O.disabled = !0;
    try {
      const re = on(e, o);
      M = await Qo(o ?? r, re), L("LightCriteria | Base lighting stored", {
        lightId: ((A = o ?? r) == null ? void 0 : A.id) ?? null,
        configColor: ((U = re == null ? void 0 : re.config) == null ? void 0 : U.color) ?? null
      }), (K = (G = ui.notifications) == null ? void 0 : G.info) == null || K.call(
        G,
        f(
          "EIDOLON.LightCriteria.BaseStored",
          "Saved the current configuration as the base lighting state."
        )
      ), pt(R, M), yt({ switcher: _, emptyState: B, state: M }), oi(D, {
        state: M,
        hasCategories: c.length > 0
      }), j.selectedMapping = se, Ge(F, M, u, j.selectedMapping), j.selectedMapping = F.value ?? "", Pe({
        mappingSelect: F,
        applyMappingButton: w,
        updateMappingButton: x,
        editCriteriaButton: H,
        removeMappingButton: $,
        state: M
      });
    } catch (re) {
      console.error("eidolon-utilities | Failed to store base light criteria state", re), (te = (Q = ui.notifications) == null ? void 0 : Q.error) == null || te.call(
        Q,
        f(
          "EIDOLON.LightCriteria.BaseError",
          "Failed to save the base lighting state. Check the console for details."
        )
      );
    } finally {
      O.disabled = !1;
    }
  }), D.addEventListener("click", () => {
    var U, G, K, Q;
    if (!(M != null && M.base)) {
      (G = (U = ui.notifications) == null ? void 0 : U.warn) == null || G.call(
        U,
        f(
          "EIDOLON.LightCriteria.RequiresBase",
          "Set a base lighting state before adding criteria mappings."
        )
      );
      return;
    }
    if (c.length === 0) {
      (Q = (K = ui.notifications) == null ? void 0 : K.warn) == null || Q.call(
        K,
        f(
          "EIDOLON.LightCriteria.NoCategoriesAvailable",
          "Add scene criteria with values in the Scene configuration before creating mappings."
        )
      );
      return;
    }
    const A = rn.get(p);
    ra({
      app: e,
      fieldset: p,
      createButton: D,
      creationSection: q,
      categoryList: z,
      form: i,
      persistedLight: o,
      stateEntry: A,
      mode: "create",
      mapping: null,
      preloadConfig: M.base
    });
  }), H.addEventListener("click", () => {
    var G, K, Q, te;
    const A = j.selectedMapping;
    if (!A || A === se) {
      (K = (G = ui.notifications) == null ? void 0 : G.warn) == null || K.call(
        G,
        f(
          "EIDOLON.LightCriteria.SelectMappingForCriteriaEdit",
          "Select a mapping before editing criteria."
        )
      );
      return;
    }
    const U = gi(M, A);
    if (!U) {
      (te = (Q = ui.notifications) == null ? void 0 : Q.warn) == null || te.call(
        Q,
        f(
          "EIDOLON.LightCriteria.MappingUnavailable",
          "The selected criteria mapping is no longer available."
        )
      );
      return;
    }
    Ms(e, { fieldset: p, homeContainer: n }), ra({
      app: e,
      fieldset: p,
      createButton: D,
      creationSection: q,
      categoryList: z,
      form: i,
      persistedLight: o,
      stateEntry: j,
      mode: "retarget",
      mapping: U,
      preloadConfig: U.config
    });
  }), ke.addEventListener("click", async () => {
    var U, G, K, Q, te, re, ge, Ne, me, oe;
    const A = Tu(z);
    if (!A) {
      (G = (U = ui.notifications) == null ? void 0 : U.warn) == null || G.call(
        U,
        f(
          "EIDOLON.LightCriteria.SelectionRequired",
          "Select at least one criteria value to identify the mapping."
        )
      );
      return;
    }
    ke.disabled = !0;
    try {
      const ie = on(e, o);
      if (j.editorMode === "retarget" && j.editingMappingId) {
        const Ze = no(M, A);
        let He = !1;
        if (Ze && Ze !== j.editingMappingId && (He = await nu(), !He)) {
          ke.disabled = !1;
          return;
        }
        M = await Ql(
          o ?? r,
          j.editingMappingId,
          A,
          ie,
          { replaceExisting: He }
        ), L("LightCriteria | Mapping criteria retargeted", {
          mappingId: j.editingMappingId,
          categories: A,
          replaced: He,
          configColor: ((K = ie == null ? void 0 : ie.config) == null ? void 0 : K.color) ?? null
        }), (te = (Q = ui.notifications) == null ? void 0 : Q.info) == null || te.call(
          Q,
          f(
            "EIDOLON.LightCriteria.MappingCriteriaUpdated",
            "Updated mapping criteria for the selected mapping."
          )
        );
      } else
        M = await Xo(
          o ?? r,
          A,
          ie,
          {}
        ), L("LightCriteria | Mapping saved from editor", {
          categories: A,
          configColor: ((re = ie == null ? void 0 : ie.config) == null ? void 0 : re.color) ?? null
        }), (Ne = (ge = ui.notifications) == null ? void 0 : ge.info) == null || Ne.call(
          ge,
          f(
            "EIDOLON.LightCriteria.MappingSaved",
            "Updated lighting mapping for the selected scene criteria."
          )
        );
      pt(R, M), yt({ switcher: _, emptyState: B, state: M });
      const Ae = no(M, A);
      Ae && (j.selectedMapping = Ae), Ge(F, M, u, j.selectedMapping), j.selectedMapping = F.value ?? "", Pe({
        mappingSelect: F,
        applyMappingButton: w,
        updateMappingButton: x,
        editCriteriaButton: H,
        removeMappingButton: $,
        state: M
      }), Gi(p, q, D);
    } catch (ie) {
      console.error("eidolon-utilities | Failed to persist light criteria mapping", ie), (oe = (me = ui.notifications) == null ? void 0 : me.error) == null || oe.call(
        me,
        f(
          "EIDOLON.LightCriteria.MappingError",
          "Failed to save the mapping. Check the console for details."
        )
      );
    } finally {
      ke.disabled = !1;
    }
  }), we.addEventListener("click", () => {
    const A = rn.get(p);
    A != null && A.restoreConfig && an(e, i, A.restoreConfig), Gi(p, q, D);
  }), $.addEventListener("click", async () => {
    var G, K;
    const A = j.selectedMapping;
    !A || A === se || !await ru() || (M = await Xl(o ?? r, A), j.selectedMapping = "", pt(R, M), yt({ switcher: _, emptyState: B, state: M }), Ge(F, M, u, ""), Pe({
      mappingSelect: F,
      applyMappingButton: w,
      updateMappingButton: x,
      editCriteriaButton: H,
      removeMappingButton: $,
      state: M
    }), (K = (G = ui.notifications) == null ? void 0 : G.info) == null || K.call(
      G,
      f("EIDOLON.LightCriteria.MappingRemoved", "Removed selected mapping.")
    ));
  });
}
s(iu, "enhanceAmbientLightConfig");
function ra({
  app: e,
  fieldset: t,
  createButton: i,
  creationSection: n,
  categoryList: r,
  form: o,
  persistedLight: a,
  stateEntry: l,
  mode: c,
  mapping: u,
  preloadConfig: d
}) {
  l && (l.restoreConfig = on(e, a), l.editorMode = c, l.editingMappingId = c === "retarget" ? (u == null ? void 0 : u.id) ?? null : null), d && an(e, o, d), c === "retarget" && (u != null && u.categories) ? yu(r, u.categories) : pu(r);
  const g = n.querySelector("p.notes");
  g instanceof HTMLElement && (g.textContent = c === "retarget" ? f(
    "EIDOLON.LightCriteria.EditCriteriaDescription",
    "Adjust criteria values for the selected mapping."
  ) : f(
    "EIDOLON.LightCriteria.CreateDescription",
    "Assign scene criteria values to map the current configuration."
  ));
  const m = n.querySelector('button[data-action="save-mapping"]');
  m instanceof HTMLButtonElement && (m.textContent = c === "retarget" ? f("EIDOLON.LightCriteria.SaveCriteriaChanges", "Save Criteria Changes") : f("EIDOLON.LightCriteria.SaveMapping", "Save Mapping")), n.hidden = !1, i.setAttribute("aria-expanded", "true"), So(t, n), requestAnimationFrame(() => {
    var y;
    (y = e.setPosition) == null || y.call(e, { height: "auto" });
  });
}
s(ra, "openMappingEditor");
async function nu() {
  var i, n;
  const e = (n = (i = foundry == null ? void 0 : foundry.applications) == null ? void 0 : i.api) == null ? void 0 : n.DialogV2;
  if (typeof (e == null ? void 0 : e.confirm) == "function")
    return e.confirm({
      window: { title: f("EIDOLON.LightCriteria.ConflictTitle", "Replace Existing Mapping?") },
      content: `<p>${f(
        "EIDOLON.LightCriteria.ConflictBody",
        "A mapping already exists for this criteria combination. Replace it with the edited mapping?"
      )}</p>`,
      rejectClose: !1
    });
  const t = globalThis.Dialog;
  return typeof (t == null ? void 0 : t.confirm) != "function" ? !1 : t.confirm({
    title: f("EIDOLON.LightCriteria.ConflictTitle", "Replace Existing Mapping?"),
    content: `<p>${f(
      "EIDOLON.LightCriteria.ConflictBody",
      "A mapping already exists for this criteria combination. Replace it with the edited mapping?"
    )}</p>`,
    yes: /* @__PURE__ */ s(() => !0, "yes"),
    no: /* @__PURE__ */ s(() => !1, "no"),
    defaultYes: !1
  });
}
s(nu, "confirmCriteriaConflict");
async function ru() {
  var i, n;
  const e = (n = (i = foundry == null ? void 0 : foundry.applications) == null ? void 0 : i.api) == null ? void 0 : n.DialogV2;
  if (typeof (e == null ? void 0 : e.confirm) == "function")
    return e.confirm({
      window: { title: f("EIDOLON.LightCriteria.RemoveTitle", "Remove Mapping?") },
      content: `<p>${f(
        "EIDOLON.LightCriteria.RemoveBody",
        "Remove the currently selected mapping? This cannot be undone."
      )}</p>`,
      rejectClose: !1
    });
  const t = globalThis.Dialog;
  return typeof (t == null ? void 0 : t.confirm) != "function" ? !1 : t.confirm({
    title: f("EIDOLON.LightCriteria.RemoveTitle", "Remove Mapping?"),
    content: `<p>${f(
      "EIDOLON.LightCriteria.RemoveBody",
      "Remove the currently selected mapping? This cannot be undone."
    )}</p>`,
    yes: /* @__PURE__ */ s(() => !0, "yes"),
    no: /* @__PURE__ */ s(() => !1, "no"),
    defaultYes: !1
  });
}
s(ru, "confirmRemoveMapping");
function ou(e, { fieldset: t, homeContainer: i }) {
  const n = lu(e, i);
  if (!(n instanceof HTMLElement)) return;
  const r = n.querySelector(".window-header");
  if (!(r instanceof HTMLElement)) return;
  let o = r.querySelector('[data-eidolon-action="open-light-criteria-manager"]');
  if (!(o instanceof HTMLButtonElement)) {
    o = document.createElement("button"), o.type = "button", o.classList.add("header-control", "icon"), o.dataset.eidolonAction = "open-light-criteria-manager", o.dataset.tooltip = f("EIDOLON.LightCriteria.OpenManager", "Open Scene Criteria Lighting"), o.setAttribute("aria-label", f("EIDOLON.LightCriteria.OpenManager", "Open Scene Criteria Lighting")), o.innerHTML = '<i class="fa-solid fa-sliders" inert=""></i>';
    const a = r.querySelector(".window-controls") ?? r, l = a.querySelector('[data-action="toggleControls"]');
    if ((l == null ? void 0 : l.parentElement) === a)
      a.insertBefore(o, l);
    else {
      const c = a.querySelector('[data-action="close"]');
      (c == null ? void 0 : c.parentElement) === a ? a.insertBefore(o, c) : a.appendChild(o);
    }
  }
  o.onclick = (a) => {
    a.preventDefault(), Ms(e, { fieldset: t, homeContainer: i });
  };
}
s(ou, "ensureManagerHeaderButton");
function Ms(e, { fieldset: t, homeContainer: i }) {
  var m, y, T;
  const n = zi.get(e);
  if (n != null && n.rendered) {
    (m = n.bringToTop) == null || m.call(n);
    return;
  }
  const r = /* @__PURE__ */ s((...p) => {
    var E;
    const C = au(p), b = (E = C == null ? void 0 : C.querySelector) == null ? void 0 : E.call(C, ".eidolon-light-criteria-manager-host");
    b instanceof HTMLElement && (su(t), t.hidden = !1, b.appendChild(t));
  }, "onRender"), o = /* @__PURE__ */ s(() => {
    i instanceof HTMLElement && i.appendChild(t), t.hidden = !0, zi.delete(e), requestAnimationFrame(() => {
      var p;
      (p = e.setPosition) == null || p.call(e, { height: "auto" });
    });
  }, "onClose"), a = f("EIDOLON.LightCriteria.ManagerTitle", "Scene Criteria Lighting"), l = '<div class="eidolon-light-criteria-manager-host"></div>', c = f("EIDOLON.LightCriteria.Close", "Close"), u = (T = (y = foundry == null ? void 0 : foundry.applications) == null ? void 0 : y.api) == null ? void 0 : T.DialogV2;
  if (typeof (u == null ? void 0 : u.wait) == "function")
    try {
      let p = !1;
      const C = /* @__PURE__ */ s(() => {
        p || (p = !0, o());
      }, "closeOnce");
      zi.set(e, {
        rendered: !0,
        bringToTop: /* @__PURE__ */ s(() => {
        }, "bringToTop")
      }), u.wait({
        window: { title: a },
        content: l,
        buttons: [{ action: "close", label: c, default: !0 }],
        render: /* @__PURE__ */ s((...b) => r(...b), "render"),
        close: C,
        rejectClose: !1
      }).catch((b) => {
        console.warn("eidolon-utilities | DialogV2 manager failed, falling back to Dialog", b), C();
      });
      return;
    } catch (p) {
      console.warn("eidolon-utilities | DialogV2 manager failed, falling back to Dialog", p), o();
    }
  const d = globalThis.Dialog;
  if (typeof d != "function") return;
  const g = new d(
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
  zi.set(e, g), g.render(!0);
}
s(Ms, "openManagerDialog");
function au(e) {
  for (const t of e) {
    const i = Xe(t);
    if (i) return i;
    const n = Xe(t == null ? void 0 : t.element);
    if (n) return n;
  }
  return null;
}
s(au, "findDialogRoot");
function su(e) {
  if (!(e instanceof HTMLElement) || e.dataset.managerLayout === "true") return;
  e.dataset.managerLayout = "true", e.classList.add("is-manager");
  const t = e.querySelector("legend"), i = e.querySelector("p.notes:not(.eidolon-light-criteria__status)"), n = e.querySelector(".eidolon-light-criteria__controls"), r = e.querySelector(".eidolon-light-criteria__status"), o = e.querySelector(".eidolon-light-criteria__creation"), a = Array.from(e.querySelectorAll(".eidolon-light-criteria__warning")), l = document.createElement("div");
  l.classList.add("eidolon-light-criteria-manager");
  const c = document.createElement("section");
  c.classList.add("eidolon-light-criteria-manager__section", "is-top"), l.appendChild(c);
  const u = document.createElement("section");
  u.classList.add("eidolon-light-criteria-manager__section", "is-bottom"), l.appendChild(u);
  const d = document.createElement("div");
  if (d.classList.add("eidolon-light-criteria-manager__header"), d.textContent = f("EIDOLON.LightCriteria.ManagerHeader", "Base State"), c.appendChild(d), r && c.appendChild(r), n && c.appendChild(n), a.length) {
    const m = document.createElement("div");
    m.classList.add("eidolon-light-criteria-manager__warnings");
    for (const y of a) m.appendChild(y);
    c.appendChild(m);
  }
  const g = document.createElement("div");
  g.classList.add("eidolon-light-criteria-manager__header"), g.textContent = f("EIDOLON.LightCriteria.ManagerAuthoring", "Create or Update Mapping"), u.appendChild(g), o && u.appendChild(o), e.innerHTML = "", t && e.appendChild(t), i && e.appendChild(i), e.appendChild(l), So(e, o);
}
s(su, "applyManagerLayout");
function lu(e, t) {
  var n;
  const i = Xe(e == null ? void 0 : e.element);
  return i || (((n = t == null ? void 0 : t.closest) == null ? void 0 : n.call(t, ".application")) ?? null);
}
s(lu, "resolveApplicationRoot");
function Gi(e, t, i) {
  const n = rn.get(e);
  n && (n.restoreConfig = null, n.editorMode = "create", n.editingMappingId = null), t.hidden = !0, i.setAttribute("aria-expanded", "false");
  const r = t.querySelector("p.notes");
  r instanceof HTMLElement && (r.textContent = f(
    "EIDOLON.LightCriteria.CreateDescription",
    "Assign scene criteria values to map the current configuration."
  ));
  const o = t.querySelector('button[data-action="save-mapping"]');
  o instanceof HTMLButtonElement && (o.textContent = f("EIDOLON.LightCriteria.SaveMapping", "Save Mapping")), So(e, t), requestAnimationFrame(() => {
    var a, l;
    (l = (a = n == null ? void 0 : n.app) == null ? void 0 : a.setPosition) == null || l.call(a, { height: "auto" });
  });
}
s(Gi, "hideCreationSection");
function pt(e, t) {
  if (!e) return;
  const i = !!(t != null && t.base), n = Array.isArray(t == null ? void 0 : t.mappings) ? t.mappings.length : 0, r = [];
  r.push(
    i ? f(
      "EIDOLON.LightCriteria.StatusBaseSaved",
      "Base lighting saved."
    ) : f(
      "EIDOLON.LightCriteria.StatusBaseMissing",
      "Base lighting not yet saved."
    )
  ), r.push(
    f(
      "EIDOLON.LightCriteria.StatusMappingCount",
      "Mappings: {count}"
    ).replace("{count}", String(n))
  ), e.textContent = r.join(" ");
}
s(pt, "updateStatusLine");
function oi(e, { state: t, hasCategories: i }) {
  if (!e) return;
  const n = !!(t != null && t.base), r = n && i;
  e.disabled = !r, e.title = r ? "" : n ? f(
    "EIDOLON.LightCriteria.CreateDisabledNoCategories",
    "Add scene criteria with values before creating mappings."
  ) : f(
    "EIDOLON.LightCriteria.CreateDisabledNoBase",
    "Save a base lighting state before creating criteria mappings."
  );
}
s(oi, "updateCreateButtonState");
function on(e, t) {
  var c, u, d;
  const i = t ?? Ns(e);
  if (!i)
    throw new Error("Ambient light document unavailable.");
  const n = _t(((c = i.toObject) == null ? void 0 : c.call(i)) ?? {});
  if (!n)
    throw new Error("Unable to duplicate ambient light data.");
  const r = (e == null ? void 0 : e.form) instanceof HTMLFormElement ? e.form : null, o = r ? dl(r) : {}, a = foundry.utils.mergeObject(n, o, {
    inplace: !1,
    performDeletions: !0
  });
  r && (r.querySelectorAll("color-picker[name]").forEach((g) => {
    var b, E;
    const m = g.getAttribute("name");
    if (!m) return;
    const y = typeof g.value == "string" ? g.value : "", T = ((b = g.ui) == null ? void 0 : b.input) ?? ((E = g.querySelector) == null ? void 0 : E.call(g, 'input[type="color"]')), p = (T == null ? void 0 : T.value) ?? "", C = y || p;
    typeof C != "string" || !C || (foundry.utils.setProperty(a, m, C), L("LightCriteria | Captured color-picker value", {
      path: m,
      pickerValue: y,
      swatchValue: p,
      chosenValue: C
    }));
  }), r.querySelectorAll("range-picker[name]").forEach((g) => {
    var R, _;
    const m = g.getAttribute("name");
    if (!m) return;
    const y = g.value !== void 0 && g.value !== null ? String(g.value) : "", T = (R = g.querySelector) == null ? void 0 : R.call(g, 'input[type="range"]'), p = (_ = g.querySelector) == null ? void 0 : _.call(g, 'input[type="number"]'), C = T instanceof HTMLInputElement ? T.value : "", b = p instanceof HTMLInputElement ? p.value : "", E = y || b || C;
    if (typeof E != "string" || !E.length) return;
    const O = Number(E), D = Number.isFinite(O) ? O : E;
    foundry.utils.setProperty(a, m, D), L("LightCriteria | Captured range-picker value", {
      path: m,
      elementValue: y,
      numberValue: b,
      rangeValue: C,
      chosenValue: D
    });
  }));
  const l = _t(a);
  return L("LightCriteria | Captured form config", {
    lightId: (i == null ? void 0 : i.id) ?? null,
    hasColor: !!((u = l == null ? void 0 : l.config) != null && u.color),
    color: ((d = l == null ? void 0 : l.config) == null ? void 0 : d.color) ?? null
  }), l;
}
s(on, "captureAmbientLightFormConfig");
function an(e, t, i) {
  if (!i || typeof i != "object") return;
  const n = foundry.utils.flattenObject(i, { safe: !0 });
  for (const [r, o] of Object.entries(n)) {
    const a = t.querySelectorAll(`[name="${r}"]`);
    if (a.length) {
      L("LightCriteria | Applying field", {
        path: r,
        value: o,
        elementCount: a.length
      });
      for (const l of a)
        l instanceof HTMLElement && l.tagName === "COLOR-PICKER" ? uu(l, o) : l instanceof HTMLElement && l.tagName === "RANGE-PICKER" ? du(l, o) : l instanceof HTMLInputElement ? cu(l, o) : l instanceof HTMLSelectElement ? fu(l, o) : l instanceof HTMLTextAreaElement && gu(l, o);
    }
  }
  requestAnimationFrame(() => {
    var r;
    return (r = e._previewChanges) == null ? void 0 : r.call(e);
  });
}
s(an, "applyConfigToForm");
function cu(e, t, i) {
  const n = e.type;
  if (n === "checkbox") {
    const a = !!t;
    e.checked !== a && (e.checked = a, xe(e));
    return;
  }
  if (n === "radio") {
    const a = t == null ? "" : String(t), l = e.value === a;
    e.checked !== l && (e.checked = l, l && xe(e));
    return;
  }
  const r = t == null ? "" : String(t);
  let o = !1;
  e.value !== r && (e.value = r, o = !0), o && xe(e);
}
s(cu, "applyValueToInput");
function uu(e, t, i) {
  var l, c, u, d, g, m;
  const n = t == null ? "" : String(t);
  let r = !1;
  e.value !== n && (e.value = n, e.setAttribute("value", n), (l = e.ui) != null && l.setValue && e.ui.setValue(n), r = !0);
  const o = ((c = e.ui) == null ? void 0 : c.input) ?? ((u = e.querySelector) == null ? void 0 : u.call(e, 'input[type="color"]'));
  o instanceof HTMLInputElement && o.value !== n && (o.value = n, xe(o));
  const a = ((d = e.ui) == null ? void 0 : d.text) ?? ((g = e.querySelector) == null ? void 0 : g.call(e, 'input[type="text"]'));
  a instanceof HTMLInputElement && a.value !== n && (a.value = n, xe(a)), (m = e.ui) != null && m.commit ? e.ui.commit() : (e.dispatchEvent(new Event("input", { bubbles: !0, cancelable: !0 })), e.dispatchEvent(new Event("change", { bubbles: !0, cancelable: !0 }))), L("LightCriteria | Color picker applied", {
    value: n,
    pickerValue: e.value ?? null,
    swatchValue: (o == null ? void 0 : o.value) ?? null,
    textValue: (a == null ? void 0 : a.value) ?? null
  }), r && xe(e);
}
s(uu, "applyValueToColorPicker");
function du(e, t, i) {
  var u, d;
  const n = t == null ? "" : String(t), r = Number(n), o = Number.isFinite(r) ? r : n;
  let a = !1;
  e.value !== void 0 && e.value !== o && (e.value = o, a = !0), e.getAttribute("value") !== n && (e.setAttribute("value", n), a = !0);
  const l = (u = e.querySelector) == null ? void 0 : u.call(e, 'input[type="range"]');
  l instanceof HTMLInputElement && l.value !== n && (l.value = n, xe(l));
  const c = (d = e.querySelector) == null ? void 0 : d.call(e, 'input[type="number"]');
  if (c instanceof HTMLInputElement && c.value !== n && (c.value = n, xe(c)), typeof e.commit == "function")
    try {
      e.commit();
    } catch (g) {
      console.error("eidolon-utilities | range-picker commit failed", g);
    }
  L("LightCriteria | Range picker applied", {
    value: n,
    resolvedValue: o,
    rangeValue: (l == null ? void 0 : l.value) ?? null,
    numberValue: (c == null ? void 0 : c.value) ?? null
  }), a && xe(e);
}
s(du, "applyValueToRangePicker");
function fu(e, t, i) {
  const n = t == null ? "" : String(t);
  e.value !== n && (e.value = n, xe(e));
}
s(fu, "applyValueToSelect");
function gu(e, t, i) {
  const n = t == null ? "" : String(t);
  e.value !== n && (e.value = n, xe(e));
}
s(gu, "applyValueToTextarea");
function xe(e) {
  e.dispatchEvent(new Event("input", { bubbles: !0, cancelable: !0 })), e.dispatchEvent(new Event("change", { bubbles: !0, cancelable: !0 }));
}
s(xe, "triggerInputChange");
function Pe({
  mappingSelect: e,
  applyMappingButton: t,
  updateMappingButton: i,
  editCriteriaButton: n,
  removeMappingButton: r,
  state: o
}) {
  const a = (e == null ? void 0 : e.value) ?? "", l = !!(o != null && o.base), c = a && a !== se ? !!gi(o, a) : !1;
  t instanceof HTMLButtonElement && (a ? a === se ? t.disabled = !l : t.disabled = !c : t.disabled = !0), i instanceof HTMLButtonElement && (a ? a === se ? i.disabled = !1 : i.disabled = !c : i.disabled = !0), n instanceof HTMLButtonElement && (n.disabled = !a || a === se || !c), r instanceof HTMLButtonElement && (r.disabled = !a || a === se || !c);
}
s(Pe, "syncMappingSwitcherState");
function mu(e) {
  const t = /* @__PURE__ */ new Map();
  for (const i of e) {
    if (!i) continue;
    const n = typeof i.id == "string" ? i.id : null;
    if (!n) continue;
    const r = typeof i.name == "string" && i.name.trim() ? i.name.trim() : f("EIDOLON.LightCriteria.UnnamedCategory", "Unnamed Category");
    t.has(n) || t.set(n, r);
  }
  return t;
}
s(mu, "buildCategoryNameLookup");
function Ge(e, t, i, n) {
  if (!(e instanceof HTMLSelectElement)) return;
  const r = typeof n == "string" ? n : "", o = !!(t != null && t.base), a = Array.isArray(t == null ? void 0 : t.mappings) ? [...t.mappings] : [], l = e.value;
  e.innerHTML = "";
  const c = document.createElement("option");
  c.value = "", c.textContent = f(
    "EIDOLON.LightCriteria.SelectPlaceholder",
    "Select a mapping"
  ), c.disabled = o, e.appendChild(c);
  const u = document.createElement("option");
  u.value = se, u.textContent = f(
    "EIDOLON.LightCriteria.BaseOption",
    "Base Lighting"
  ), u.disabled = !o, e.appendChild(u), a.slice().sort((y, T) => {
    var b;
    const p = jt(y, i), C = jt(T, i);
    return p.localeCompare(C, ((b = game.i18n) == null ? void 0 : b.lang) ?? void 0, {
      sensitivity: "base"
    });
  }).forEach((y) => {
    if (!(y != null && y.id)) return;
    const T = document.createElement("option");
    T.value = y.id, T.textContent = jt(y, i), e.appendChild(T);
  });
  const d = new Set(
    Array.from(e.options).filter((y) => !y.disabled).map((y) => y.value)
  ), g = o && l === "" ? "" : l, m = r || (d.has(g) ? g : "");
  m && d.has(m) ? e.value = m : o ? e.value = se : e.value = "";
}
s(Ge, "populateMappingSelector");
function jt(e, t) {
  if (!e || typeof e != "object")
    return f("EIDOLON.LightCriteria.UnnamedMapping", "Unnamed Mapping");
  if (typeof e.label == "string" && e.label.trim())
    return e.label.trim();
  const i = e.categories ?? {}, n = Object.entries(i).filter(([, r]) => typeof r == "string" && r.trim()).map(([r, o]) => {
    const a = o.trim();
    return `${t.get(r) ?? f("EIDOLON.LightCriteria.UnnamedCategory", "Unnamed Category")}: ${a}`;
  });
  return n.length === 0 ? f("EIDOLON.LightCriteria.UnnamedMapping", "Unnamed Mapping") : n.join(" • ");
}
s(jt, "formatMappingOptionLabel");
function no(e, t) {
  if (!e || typeof e != "object" || !Array.isArray(e.mappings)) return null;
  const i = Zt(t);
  if (!i) return null;
  const n = e.mappings.find((r) => (r == null ? void 0 : r.key) === i);
  return (n == null ? void 0 : n.id) ?? null;
}
s(no, "findMappingIdByCategories");
function gi(e, t) {
  return !t || !e || typeof e != "object" || !Array.isArray(e.mappings) ? null : e.mappings.find((i) => (i == null ? void 0 : i.id) === t) ?? null;
}
s(gi, "getMappingById");
function hu(e) {
  if (!e || typeof e != "object") return "";
  const t = e.current;
  if (t != null && t.mappingId) {
    if (t.mappingId === se)
      return e != null && e.base ? se : "";
    if (Array.isArray(e.mappings) && e.mappings.some((i) => i.id === t.mappingId))
      return t.mappingId;
  }
  if (t != null && t.categories) {
    const i = no(e, t.categories);
    if (i) return i;
  }
  return "";
}
s(hu, "resolveInitialMappingSelection");
function oa(e, t = {}) {
  var a, l, c, u;
  if (!(e instanceof HTMLFormElement)) return;
  const i = e.querySelector('color-picker[name="config.color"]'), n = (i == null ? void 0 : i.value) ?? null, r = ((a = i == null ? void 0 : i.ui) == null ? void 0 : a.text) ?? ((l = i == null ? void 0 : i.querySelector) == null ? void 0 : l.call(i, 'input[type="text"]')), o = ((c = i == null ? void 0 : i.ui) == null ? void 0 : c.input) ?? ((u = i == null ? void 0 : i.querySelector) == null ? void 0 : u.call(i, 'input[type="color"]'));
  L("LightCriteria | Color state after apply", {
    ...t,
    textValue: (r == null ? void 0 : r.value) ?? null,
    pickerValue: n,
    swatchValue: (o == null ? void 0 : o.value) ?? null
  });
}
s(oa, "logAppliedColorState");
function pu(e) {
  e.querySelectorAll("select[data-category-id]").forEach((t) => {
    t.value = "";
  });
}
s(pu, "resetCategorySelections");
function yu(e, t) {
  const i = t && typeof t == "object" ? t : {};
  e.querySelectorAll("select[data-category-id]").forEach((n) => {
    const r = n.dataset.categoryId;
    if (!r) return;
    const o = i[r];
    n.value = typeof o == "string" ? o : "";
  });
}
s(yu, "setCategorySelections");
function Tu(e) {
  const t = {};
  return e.querySelectorAll("select[data-category-id]").forEach((i) => {
    var o, a;
    const n = i.dataset.categoryId, r = (a = (o = i.value) == null ? void 0 : o.trim) == null ? void 0 : a.call(o);
    !n || !r || (t[n] = r);
  }), Object.keys(t).length > 0 ? t : null;
}
s(Tu, "readCategorySelections");
async function bu(e, t, i) {
  if (!e) return null;
  try {
    if (!i)
      return await fi(e, {});
    if (i === se)
      return await fi(e, {
        mappingId: se,
        categories: null,
        updatedAt: Date.now()
      });
    const n = gi(t, i);
    return n ? await fi(e, {
      mappingId: n.id,
      categories: n.categories,
      updatedAt: Date.now()
    }) : null;
  } catch (n) {
    return console.warn("eidolon-utilities | Failed to persist mapping selection", n), null;
  }
}
s(bu, "persistCurrentSelection");
function So(e, t) {
  if (!(e instanceof HTMLElement)) return;
  const i = e.querySelector(".eidolon-light-criteria-manager__section.is-bottom");
  i instanceof HTMLElement && (i.hidden = !!(t != null && t.hidden));
}
s(So, "updateManagerSectionVisibility");
function yt({ switcher: e, emptyState: t, state: i }) {
  const n = !!(i != null && i.base);
  e instanceof HTMLElement && (e.hidden = !n), t instanceof HTMLElement && (t.hidden = n);
}
s(yt, "updateActiveMappingVisibility");
function Ns(e) {
  const t = (e == null ? void 0 : e.object) ?? (e == null ? void 0 : e.document) ?? null;
  return !(t != null && t.isEmbedded) || t.documentName !== "AmbientLight" ? null : t;
}
s(Ns, "getAmbientLightDocument");
function Eu(e) {
  if (!(e != null && e.isEmbedded)) return null;
  const t = e.parent ?? null;
  if (!t) return e;
  if (typeof t.getEmbeddedDocument == "function") {
    const n = t.getEmbeddedDocument(e.documentName, e.id);
    if (n) return n;
  }
  const i = t.lights;
  if (i != null && i.get) {
    const n = i.get(e.id);
    if (n) return n;
  }
  return e;
}
s(Eu, "getPersistedAmbientLightDocument");
function Cu() {
  eu();
}
s(Cu, "registerLightCriteriaHooks");
Cu();
const ro = /* @__PURE__ */ new Map();
let oo = !1;
function Io(e, t) {
  ro.has(e) && console.warn(`[${I}] Socket handler for type "${e}" already registered, overwriting.`), ro.set(e, t);
}
s(Io, "registerSocketHandler");
function sn(e, t) {
  if (!oo) {
    console.error(`[${I}] Socket not initialized. Call initializeSocket() first.`);
    return;
  }
  game.socket.emit(`module.${I}`, { type: e, payload: t });
}
s(sn, "emitSocket");
function Lu() {
  oo || (game.socket.on(`module.${I}`, (e) => {
    const { type: t, payload: i } = e ?? {}, n = ro.get(t);
    n ? n(i) : console.warn(`[${I}] No socket handler for type "${t}"`);
  }), oo = !0, console.log(`[${I}] Socket initialized on channel module.${I}`));
}
s(Lu, "initializeSocket");
const As = "tween", Ds = "tween-sequence", ao = "tween-sequence-cancel", pe = Object.freeze({
  ABORT: "abort",
  CONTINUE: "continue"
}), ai = Object.freeze({
  COMPLETED: "completed",
  CANCELLED: "cancelled",
  FAILED: "failed"
}), tt = Object.freeze({
  BEFORE_ALL: "beforeAll",
  BEFORE_STEP: "before",
  ENTRY: "entry",
  AFTER_STEP: "after",
  RUNTIME: "runtime",
  VALIDATION: "validation"
}), Tn = /* @__PURE__ */ new Map();
function wo({ type: e, execute: t, validate: i }) {
  Tn.has(e) && console.warn(`[tween-registry] Type "${e}" already registered, overwriting.`), Tn.set(e, { type: e, execute: t, validate: i ?? (() => {
  }) });
}
s(wo, "registerTweenType");
function nr(e) {
  return Tn.get(e);
}
s(nr, "getTweenType");
function Su(e, t = {}) {
  const i = nr(e);
  if (!i)
    throw new Error(`Unknown tween type: "${e}".`);
  return i.validate(t ?? {}), i;
}
s(Su, "validateTweenEntry");
function so() {
  return [...Tn.keys()];
}
s(so, "listTweenTypes");
function Fs(e) {
  const t = foundry.canvas.animation.CanvasAnimation;
  return {
    linear: t.easeLinear,
    easeInOutCosine: t.easeInOutCosine
  }[e] ?? t.easeInOutCosine;
}
s(Fs, "resolveEasing");
function bn(e) {
  return e <= 0.04045 ? e / 12.92 : ((e + 0.055) / 1.055) ** 2.4;
}
s(bn, "srgbToLinear");
function zt(e) {
  return e <= 31308e-7 ? 12.92 * e : 1.055 * e ** (1 / 2.4) - 0.055;
}
s(zt, "linearToSrgb");
function aa(e, t, i) {
  const n = 0.4122214708 * e + 0.5363325363 * t + 0.0514459929 * i, r = 0.2119034982 * e + 0.6806995451 * t + 0.1073969566 * i, o = 0.0883024619 * e + 0.2817188376 * t + 0.6299787005 * i, a = Math.cbrt(n), l = Math.cbrt(r), c = Math.cbrt(o);
  return [
    0.2104542553 * a + 0.793617785 * l - 0.0040720468 * c,
    1.9779984951 * a - 2.428592205 * l + 0.4505937099 * c,
    0.0259040371 * a + 0.7827717662 * l - 0.808675766 * c
  ];
}
s(aa, "linearRgbToOklab");
function Iu(e, t, i) {
  const n = (e + 0.3963377774 * t + 0.2158037573 * i) ** 3, r = (e - 0.1055613458 * t - 0.0638541728 * i) ** 3, o = (e - 0.0894841775 * t - 1.291485548 * i) ** 3;
  return [
    4.0767416621 * n - 3.3077115913 * r + 0.2309699292 * o,
    -1.2684380046 * n + 2.6097574011 * r - 0.3413193965 * o,
    -0.0041960863 * n - 0.7034186147 * r + 1.707614701 * o
  ];
}
s(Iu, "oklabToLinearRgb");
function En(e) {
  return [e.r, e.g, e.b];
}
s(En, "colorToRgb");
function _s(e, t, i) {
  const n = /* @__PURE__ */ s((o) => Math.max(0, Math.min(1, o)), "clamp"), r = /* @__PURE__ */ s((o) => Math.round(n(o) * 255).toString(16).padStart(2, "0"), "toHex");
  return `#${r(e)}${r(t)}${r(i)}`;
}
s(_s, "rgbToHex");
function wu(e, t, i) {
  if (i <= 0) return e.toHTML();
  if (i >= 1) return t.toHTML();
  const n = foundry.utils.Color, [r, o, a] = e.hsl, [l, c, u] = t.hsl, d = (l - r + 0.5) % 1 - 0.5, g = (r + d * i + 1) % 1, m = o + (c - o) * i, y = a + (u - a) * i;
  return n.fromHSL([g, m, y]).toHTML();
}
s(wu, "interpolateHsl");
function Ou(e, t, i) {
  if (i <= 0) return e.toHTML();
  if (i >= 1) return t.toHTML();
  const [n, r, o] = En(e).map(bn), [a, l, c] = En(t).map(bn), u = zt(n + (a - n) * i), d = zt(r + (l - r) * i), g = zt(o + (c - o) * i);
  return _s(u, d, g);
}
s(Ou, "interpolateRgb");
function vu(e, t, i) {
  if (i <= 0) return e.toHTML();
  if (i >= 1) return t.toHTML();
  const [n, r, o] = En(e).map(bn), [a, l, c] = En(t).map(bn), [u, d, g] = aa(n, r, o), [m, y, T] = aa(a, l, c), p = 0.02, C = Math.sqrt(d * d + g * g), b = Math.sqrt(y * y + T * T);
  let E, O, D;
  if (C < p || b < p)
    E = u + (m - u) * i, O = d + (y - d) * i, D = g + (T - g) * i;
  else {
    const Z = Math.atan2(g, d);
    let F = Math.atan2(T, y) - Z;
    F > Math.PI && (F -= 2 * Math.PI), F < -Math.PI && (F += 2 * Math.PI), E = u + (m - u) * i;
    const J = C + (b - C) * i, w = Z + F * i;
    O = J * Math.cos(w), D = J * Math.sin(w);
  }
  const [R, _, V] = Iu(E, O, D);
  return _s(zt(R), zt(_), zt(V));
}
s(vu, "interpolateOklch");
const lo = {
  hsl: wu,
  rgb: Ou,
  oklch: vu
};
function Mu(e = "hsl") {
  return lo[e] ?? lo.hsl;
}
s(Mu, "getInterpolator");
function sa() {
  return Object.keys(lo);
}
s(sa, "listInterpolationModes");
function Nu(e) {
  if ((Array.isArray(e.uuid) ? e.uuid : [e.uuid]).some((i) => !i || typeof i != "string"))
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
  if (e.mode && !sa().includes(e.mode))
    throw new Error(
      `light-color tween: unknown mode "${e.mode}". Available: ${sa().join(", ")}`
    );
}
s(Nu, "validate$2");
async function Au(e, t = {}) {
  const { CanvasAnimation: i } = foundry.canvas.animation, { Color: n } = foundry.utils, { uuid: r, toColor: o, toAlpha: a, mode: l = "oklch" } = e, c = Array.isArray(r) ? r : [r];
  if (c.length === 0)
    return console.warn("light-color tween: empty uuid array, nothing to animate."), !0;
  const {
    durationMS: u = 2e3,
    easing: d = "easeInOutCosine",
    commit: g = !0,
    startEpochMS: m = null,
    signal: y = null
  } = t, T = Fs(d), p = o != null, C = a != null, b = p ? Mu(l) : null, E = p ? n.fromString(o) : null;
  if (p && !E.valid) throw new Error(`light-color tween: invalid target color "${o}".`);
  async function O(R) {
    var $, P;
    if (y != null && y.aborted) return !1;
    const _ = await fromUuid(R);
    if (!_) return !1;
    const V = _.object;
    if (!V) return !1;
    let Z;
    if (p) {
      const B = ($ = _.config) == null ? void 0 : $.color;
      B != null && B.valid || console.warn(`light-color tween: source color invalid on ${R}, using white.`), Z = B != null && B.valid ? B : n.fromString("#ffffff");
    }
    const ne = C ? ((P = _._source.config) == null ? void 0 : P.alpha) ?? 0.5 : null, F = { t: 0 }, J = `ambient-hue-tween:${R}`;
    i.terminateAnimation(J), y && y.addEventListener("abort", () => {
      i.terminateAnimation(J);
    }, { once: !0 });
    const w = typeof m == "number" ? Math.max(0, Math.min(u, Date.now() - m)) : 0, x = /* @__PURE__ */ s((B) => {
      const q = {};
      p && (q.color = b(Z, E, B)), C && (q.alpha = ne + (a - ne) * B), _.updateSource({ config: q }), V.initializeLightSource();
    }, "applyFrame");
    w > 0 && (F.t = w / u, x(F.t));
    const H = await i.animate(
      [{ parent: F, attribute: "t", to: 1 }],
      {
        name: J,
        duration: u,
        easing: T,
        time: w,
        ontick: /* @__PURE__ */ s(() => x(F.t), "ontick")
      }
    );
    if (H !== !1) {
      if (y != null && y.aborted) return !1;
      const B = {};
      p && (B.color = E.toHTML()), C && (B.alpha = a), _.updateSource({ config: B }), V.initializeLightSource();
    }
    if (g && H !== !1 && _.canUserModify(game.user, "update")) {
      if (y != null && y.aborted) return !1;
      const B = {}, q = {};
      p && (B.color = Z.toHTML(), q["config.color"] = E.toHTML()), C && (B.alpha = ne, q["config.alpha"] = a), _.updateSource({ config: B }), await _.update(q);
    }
    return H !== !1;
  }
  return s(O, "animateOne"), (await Promise.all(c.map(O))).every(Boolean);
}
s(Au, "execute$2");
function Du() {
  wo({ type: "light-color", execute: Au, validate: Nu });
}
s(Du, "registerLightColorTween");
const it = /* @__PURE__ */ new WeakMap();
function Fu(e) {
  if ((Array.isArray(e.uuid) ? e.uuid : [e.uuid]).some((i) => !i || typeof i != "string"))
    throw new Error("light-state tween: 'uuid' is required (string or array of AmbientLight document UUIDs).");
  if (typeof e.enabled != "boolean")
    throw new Error("light-state tween: 'enabled' (boolean) is required.");
}
s(Fu, "validate$1");
async function _u(e, t = {}) {
  const { CanvasAnimation: i } = foundry.canvas.animation, { uuid: n, enabled: r } = e, o = Array.isArray(n) ? n : [n];
  if (o.length === 0)
    return console.warn("light-state tween: empty uuid array, nothing to animate."), !0;
  const {
    durationMS: a = 2e3,
    easing: l = "easeInOutCosine",
    commit: c = !0,
    startEpochMS: u = null,
    signal: d = null
  } = t, g = Fs(l);
  async function m(T) {
    var _, V, Z, ne;
    if (d != null && d.aborted) return !1;
    const p = await fromUuid(T);
    if (!p) return !1;
    const C = p.object;
    if (!C) return !1;
    const b = `ambient-state-tween:${T}`;
    i.terminateAnimation(b), d && d.addEventListener("abort", () => {
      i.terminateAnimation(b);
    }, { once: !0 });
    const E = it.get(p) ?? {
      hidden: p._source.hidden,
      alpha: ((_ = p._source.config) == null ? void 0 : _.alpha) ?? 0.5
    };
    if (it.set(p, E), L(`light-state START ${r ? "ON" : "OFF"} | snap: ${JSON.stringify(E)} | _source.hidden=${p._source.hidden}, _source.config.alpha=${(V = p._source.config) == null ? void 0 : V.alpha}`), r && !E.hidden || !r && E.hidden)
      return it.delete(p), !0;
    const O = E.alpha, D = typeof u == "number" ? Math.max(0, Math.min(a, Date.now() - u)) : 0, R = /* @__PURE__ */ s((F) => {
      p.updateSource({ config: { alpha: F } }), C.initializeLightSource();
    }, "applyAlpha");
    if (r) {
      p.updateSource({ hidden: !1, config: { alpha: 0 } }), C.initializeLightSource(), canvas.perception.update({ refreshLighting: !0, refreshVision: !0 });
      const F = { t: 0 };
      D > 0 && (F.t = D / a, R(O * F.t));
      const J = await i.animate(
        [{ parent: F, attribute: "t", to: 1 }],
        {
          name: b,
          duration: a,
          easing: g,
          time: D,
          ontick: /* @__PURE__ */ s(() => R(O * F.t), "ontick")
        }
      );
      return J !== !1 && !(d != null && d.aborted) && c && p.canUserModify(game.user, "update") ? (p.updateSource({ hidden: !0, config: { alpha: O } }), await p.update({ hidden: !1 }), L(`light-state FADE-IN committed. _source.hidden=${p._source.hidden}, _source.config.alpha=${(Z = p._source.config) == null ? void 0 : Z.alpha}`), it.delete(p)) : J === !1 || it.delete(p), J !== !1;
    } else {
      p.updateSource({ hidden: !1, config: { alpha: E.alpha } }), C.initializeLightSource();
      const F = { t: 0 };
      D > 0 && (F.t = D / a, R(O * (1 - F.t)));
      const J = await i.animate(
        [{ parent: F, attribute: "t", to: 1 }],
        {
          name: b,
          duration: a,
          easing: g,
          time: D,
          ontick: /* @__PURE__ */ s(() => R(O * (1 - F.t)), "ontick")
        }
      );
      return J !== !1 && !(d != null && d.aborted) && c && p.canUserModify(game.user, "update") ? (await p.update({ hidden: !0 }), p.updateSource({ config: { alpha: O } }), C.initializeLightSource(), L(`light-state FADE-OUT committed+restored. _source.hidden=${p._source.hidden}, _source.config.alpha=${(ne = p._source.config) == null ? void 0 : ne.alpha}`), it.delete(p)) : J === !1 || (p.updateSource({ hidden: !0, config: { alpha: O } }), C.initializeLightSource(), it.delete(p)), J !== !1;
    }
  }
  return s(m, "animateOne"), (await Promise.all(o.map(m))).every(Boolean);
}
s(_u, "execute$1");
function Ru() {
  wo({ type: "light-state", execute: _u, validate: Fu });
}
s(Ru, "registerLightStateTween");
var at, Ci, Li, Si, Ii, wi, Kt;
const Ao = class Ao {
  /**
   * @param {AbortController} controller
   */
  constructor(t) {
    N(this, at);
    N(this, Ci);
    N(this, Li);
    N(this, Si);
    N(this, Ii);
    N(this, wi, !1);
    N(this, Kt, null);
    v(this, at, t), v(this, Si, new Promise((i) => {
      v(this, Ci, i);
    })), v(this, Ii, new Promise((i) => {
      v(this, Li, i);
    }));
  }
  /** @returns {Promise<boolean>} Resolves true (completed) or false (cancelled/failed). */
  get finished() {
    return h(this, Si);
  }
  /** @returns {Promise<{status: string, [k: string]: unknown}>} */
  get result() {
    return h(this, Ii);
  }
  /** @returns {boolean} */
  get cancelled() {
    return h(this, at).signal.aborted;
  }
  /** @returns {AbortSignal} */
  get signal() {
    return h(this, at).signal;
  }
  /** @returns {string} */
  get status() {
    return h(this, Kt) ? h(this, Kt).status : this.cancelled ? "cancelled" : "running";
  }
  /** Abort the timeline, triggering onCancel callbacks. */
  cancel(t = "cancelled") {
    h(this, at).signal.aborted || h(this, at).abort(t);
  }
  /**
   * Called internally by the execution engine when the timeline finishes.
   * @param {boolean} completed - true if all steps ran, false if cancelled
   */
  _resolve(t) {
    if (h(this, wi)) return;
    v(this, wi, !0);
    const i = typeof t == "boolean" ? { status: t ? "completed" : "cancelled" } : t ?? { status: "cancelled" };
    v(this, Kt, i), h(this, Ci).call(this, i.status === "completed"), h(this, Li).call(this, i);
  }
};
at = new WeakMap(), Ci = new WeakMap(), Li = new WeakMap(), Si = new WeakMap(), Ii = new WeakMap(), wi = new WeakMap(), Kt = new WeakMap(), s(Ao, "TimelineHandle");
let co = Ao;
const $t = /* @__PURE__ */ new Map();
function xu(e, t) {
  const i = $t.get(e);
  i && !i.cancelled && i.cancel("replaced-by-name"), $t.set(e, t), t.finished.then(() => {
    $t.get(e) === t && $t.delete(e);
  });
}
s(xu, "registerTimeline");
function Rs(e) {
  const t = $t.get(e);
  return t && !t.cancelled ? (t.cancel("cancelled-by-name"), !0) : !1;
}
s(Rs, "cancelTimeline");
function ku(e) {
  return $t.get(e);
}
s(ku, "getTimeline");
function Hu(e, t) {
  return e <= 0 ? Promise.resolve() : new Promise((i, n) => {
    if (t.aborted) return n(t.reason);
    const r = setTimeout(i, e);
    t.addEventListener("abort", () => {
      clearTimeout(r), n(t.reason);
    }, { once: !0 });
  });
}
s(Hu, "cancellableDelay");
var Re, st, Oi, vi;
const Do = class Do {
  constructor(t) {
    /** @type {TweenTimeline} */
    N(this, Re);
    /** @type {Array<{ type: string, params: object, opts?: object, detach: boolean }>} */
    N(this, st, []);
    /** @type {Function|null} */
    N(this, Oi, null);
    /** @type {Function|null} */
    N(this, vi, null);
    v(this, Re, t);
  }
  /**
   * Add a tween entry to this step.
   * @param {string} type  Registered tween type name
   * @param {object} params  Type-specific parameters
   * @param {object} [opts]  Options (durationMS, easing, etc.)
   * @returns {StepBuilder} this
   */
  add(t, i, n) {
    return h(this, st).push({ type: t, params: i, opts: n ?? {}, detach: !1 }), this;
  }
  /**
   * Mark the last entry as fire-and-forget (does not block step progression).
   * @returns {StepBuilder} this
   */
  detach() {
    if (h(this, st).length === 0)
      throw new Error("StepBuilder.detach(): no entry to detach.");
    return h(this, st)[h(this, st).length - 1].detach = !0, this;
  }
  /**
   * Callback invoked before this step's tweens start.
   * @param {Function} fn
   * @returns {StepBuilder} this
   */
  before(t) {
    return v(this, Oi, t), this;
  }
  /**
   * Callback invoked after this step's awaited tweens complete.
   * @param {Function} fn
   * @returns {StepBuilder} this
   */
  after(t) {
    return v(this, vi, t), this;
  }
  // ── Delegation to parent TweenTimeline for fluent chaining ──
  /** Start a new step (finalizes this one). */
  step() {
    return h(this, Re).step();
  }
  /** Insert a delay between steps. */
  delay(t) {
    return h(this, Re).delay(t);
  }
  /** Register onComplete callback. */
  onComplete(t) {
    return h(this, Re).onComplete(t);
  }
  /** Register onCancel callback. */
  onCancel(t) {
    return h(this, Re).onCancel(t);
  }
  /** Register onError callback. */
  onError(t) {
    return h(this, Re).onError(t);
  }
  /** Execute the timeline. */
  run(t) {
    return h(this, Re).run(t);
  }
  /** Serialize the timeline. */
  toJSON() {
    return h(this, Re).toJSON();
  }
  // ── Internal access ──
  /** @returns {{ entries: Array, before: Function|null, after: Function|null }} */
  _finalize() {
    return {
      entries: h(this, st),
      before: h(this, Oi),
      after: h(this, vi)
    };
  }
};
Re = new WeakMap(), st = new WeakMap(), Oi = new WeakMap(), vi = new WeakMap(), s(Do, "StepBuilder");
let uo = Do;
var be, Ie, Ot, lt, Mi, Ni, Ai, Di, Y, di, xs, ks, ln, We, Tt;
const Fo = class Fo {
  constructor() {
    N(this, Y);
    /** @type {string|null} */
    N(this, be, null);
    /** @type {string} */
    N(this, Ie, pe.ABORT);
    /** @type {Array<{ kind: "step", data: object } | { kind: "delay", ms: number }>} */
    N(this, Ot, []);
    /** @type {StepBuilder|null} */
    N(this, lt, null);
    /** @type {Function|null} */
    N(this, Mi, null);
    /** @type {Function|null} */
    N(this, Ni, null);
    /** @type {Function|null} */
    N(this, Ai, null);
    /** @type {Function|null} */
    N(this, Di, null);
  }
  /**
   * Register this timeline in the named registry. Starting a new
   * timeline with the same name cancels the previous one.
   * @param {string} name
   * @returns {TweenTimeline} this
   */
  name(t) {
    return v(this, be, t), this;
  }
  /**
   * Set the error policy for step execution.
   * @param {"abort"|"continue"} policy
   * @returns {TweenTimeline} this
   */
  errorPolicy(t) {
    if (t !== pe.ABORT && t !== pe.CONTINUE)
      throw new Error(`Invalid error policy: "${t}". Use "abort" or "continue".`);
    return v(this, Ie, t), this;
  }
  /**
   * Start a new step. Finalizes the previous step if one is open.
   * @returns {StepBuilder}
   */
  step() {
    return S(this, Y, di).call(this), v(this, lt, new uo(this)), h(this, lt);
  }
  /**
   * Insert a delay (in ms) between the previous step and the next.
   * @param {number} ms
   * @returns {TweenTimeline} this
   */
  delay(t) {
    return S(this, Y, di).call(this), h(this, Ot).push({ kind: "delay", ms: t }), this;
  }
  /**
   * Callback invoked before the first step runs.
   * @param {Function} fn
   * @returns {TweenTimeline} this
   */
  beforeAll(t) {
    return v(this, Mi, t), this;
  }
  /**
   * Callback invoked on successful completion.
   * @param {Function} fn
   * @returns {TweenTimeline} this
   */
  onComplete(t) {
    return v(this, Ni, t), this;
  }
  /**
   * Callback invoked on cancellation (mutually exclusive with onComplete).
   * @param {Function} fn
   * @returns {TweenTimeline} this
   */
  onCancel(t) {
    return v(this, Ai, t), this;
  }
  /**
   * Callback invoked on runtime failure (mutually exclusive with onComplete/onCancel).
   * @param {(outcome: object) => void} fn
   * @returns {TweenTimeline} this
   */
  onError(t) {
    return v(this, Di, t), this;
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
    S(this, Y, di).call(this);
    const i = new AbortController();
    t.signal && (t.signal.aborted ? i.abort(t.signal.reason ?? "parent-aborted") : t.signal.addEventListener("abort", () => {
      i.signal.aborted || i.abort(t.signal.reason ?? "parent-aborted");
    }, { once: !0 }));
    const n = new co(i);
    h(this, be) && xu(h(this, be), n);
    const r = t.broadcast ?? game.user.isGM, o = t.commit ?? game.user.isGM, a = t.startEpochMS ?? Date.now();
    return r && h(this, be) && sn(Ds, {
      name: h(this, be),
      data: this.toJSON(),
      startEpochMS: a
    }), S(this, Y, xs).call(this, n, { commit: o, startEpochMS: a }).then((l) => {
      var c, u, d;
      n._resolve(l), l.status === ai.COMPLETED ? (c = h(this, Ni)) == null || c.call(this) : l.status === ai.CANCELLED ? ((u = h(this, Ai)) == null || u.call(this), r && h(this, be) && sn(ao, {
        name: h(this, be),
        reason: l.reason
      })) : ((d = h(this, Di)) == null || d.call(this, l), r && h(this, be) && sn(ao, {
        name: h(this, be),
        reason: "failed"
      }));
    }), n;
  }
  /**
   * Serialize the timeline to a JSON-safe object (steps/delays only, no hooks).
   * @returns {object}
   */
  toJSON() {
    S(this, Y, di).call(this);
    const t = [];
    for (const n of h(this, Ot))
      if (n.kind === "delay")
        t.push({ delay: n.ms });
      else {
        const r = n.data.entries.map((o) => {
          const a = { type: o.type, params: o.params };
          return Object.keys(o.opts).length > 0 && (a.opts = o.opts), o.detach && (a.detach = !0), a;
        });
        t.push(r);
      }
    const i = { timeline: t };
    return h(this, be) && (i.name = h(this, be)), h(this, Ie) !== pe.ABORT && (i.errorPolicy = h(this, Ie)), i;
  }
};
be = new WeakMap(), Ie = new WeakMap(), Ot = new WeakMap(), lt = new WeakMap(), Mi = new WeakMap(), Ni = new WeakMap(), Ai = new WeakMap(), Di = new WeakMap(), Y = new WeakSet(), // ── Private ─────────────────────────────────────────────────────────
di = /* @__PURE__ */ s(function() {
  h(this, lt) && (h(this, Ot).push({ kind: "step", data: h(this, lt)._finalize() }), v(this, lt, null));
}, "#finalizeCurrentStep"), xs = /* @__PURE__ */ s(async function(t, { commit: i, startEpochMS: n }) {
  const r = t.signal, o = [];
  let a = -1;
  try {
    if (r.aborted) return S(this, Y, We).call(this, r.reason);
    const l = await S(this, Y, ln).call(this, h(this, Mi), tt.BEFORE_ALL, null);
    if (l) {
      if (h(this, Ie) === pe.ABORT) return l;
      o.push(l);
    }
    let c = 0;
    const u = [];
    for (const d of h(this, Ot)) {
      if (r.aborted) return S(this, Y, We).call(this, r.reason);
      if (d.kind === "delay") {
        try {
          await Hu(d.ms, r);
        } catch {
          return S(this, Y, We).call(this, r.reason);
        }
        c += d.ms;
        continue;
      }
      a += 1;
      const { entries: g, before: m, after: y } = d.data, T = await S(this, Y, ln).call(this, m, tt.BEFORE_STEP, a);
      if (T) {
        if (h(this, Ie) === pe.ABORT) return T;
        o.push(T);
        continue;
      }
      if (r.aborted) return S(this, Y, We).call(this, r.reason);
      const p = [];
      let C = 0;
      for (const O of g) {
        const D = nr(O.type);
        if (!D) {
          const Z = S(this, Y, Tt).call(this, new Error(`TweenTimeline: unknown tween type "${O.type}"`), tt.ENTRY, a, O.type);
          if (h(this, Ie) === pe.ABORT) return Z;
          o.push(Z), console.warn(Z.error.message);
          continue;
        }
        const R = {
          ...O.opts,
          commit: i,
          startEpochMS: n + c,
          signal: r
        }, _ = R.durationMS ?? 2e3, V = Promise.resolve().then(() => D.execute(O.params, R)).then((Z) => Z === !1 ? {
          ok: !1,
          failure: S(this, Y, Tt).call(this, new Error("Tween entry returned false."), tt.ENTRY, a, O.type)
        } : { ok: !0 }).catch((Z) => ({
          ok: !1,
          failure: S(this, Y, Tt).call(this, Z, tt.ENTRY, a, O.type)
        }));
        O.detach ? u.push(V) : (p.push(V), C = Math.max(C, _));
      }
      const b = await S(this, Y, ks).call(this, p, r);
      if (b === null) return S(this, Y, We).call(this, r.reason);
      for (const O of b)
        if (!O.ok) {
          if (h(this, Ie) === pe.ABORT) return O.failure;
          o.push(O.failure), console.warn("TweenTimeline: entry failed:", O.failure.error);
        }
      const E = await S(this, Y, ln).call(this, y, tt.AFTER_STEP, a);
      if (E) {
        if (h(this, Ie) === pe.ABORT) return E;
        o.push(E);
      }
      if (r.aborted) return S(this, Y, We).call(this, r.reason);
      c += C;
    }
    if (!r.aborted) {
      const d = await Promise.allSettled(u);
      for (const g of d)
        if (g.status === "rejected") {
          const m = S(this, Y, Tt).call(this, g.reason, tt.ENTRY, a);
          if (h(this, Ie) === pe.ABORT) return m;
          o.push(m);
        }
    }
    return r.aborted ? S(this, Y, We).call(this, r.reason) : {
      status: ai.COMPLETED,
      ...o.length > 0 ? { errors: o } : {}
    };
  } catch (l) {
    return r.aborted ? S(this, Y, We).call(this, r.reason) : (console.error("TweenTimeline execution error:", l), S(this, Y, Tt).call(this, l, tt.RUNTIME, a));
  }
}, "#execute"), /**
 * @param {Array<Promise<{ok: boolean, failure?: object}>>} stepPromises
 * @param {AbortSignal} signal
 * @returns {Promise<Array<{ok: boolean, failure?: object}>|null>}
 */
ks = /* @__PURE__ */ s(function(t, i) {
  return t.length === 0 ? Promise.resolve([]) : i.aborted ? Promise.resolve(null) : new Promise((n, r) => {
    const o = /* @__PURE__ */ s(() => n(null), "onAbort");
    i.addEventListener("abort", o, { once: !0 }), Promise.all(t).then((a) => {
      i.removeEventListener("abort", o), n(a);
    }).catch((a) => {
      i.removeEventListener("abort", o), r(a);
    });
  });
}, "#waitForStep"), ln = /* @__PURE__ */ s(async function(t, i, n) {
  if (!t) return null;
  try {
    return await t(), null;
  } catch (r) {
    const o = S(this, Y, Tt).call(this, r, i, n ?? void 0);
    return h(this, Ie) === pe.CONTINUE && console.warn(`TweenTimeline: hook failure in ${i}:`, r), o;
  }
}, "#runHook"), /** @param {unknown} reason */
We = /* @__PURE__ */ s(function(t) {
  let i;
  return typeof t == "string" ? i = t : t instanceof Error && (i = t.message), {
    status: ai.CANCELLED,
    ...i ? { reason: i } : {}
  };
}, "#cancelledOutcome"), /**
 * @param {unknown} err
 * @param {string} phase
 * @param {number} [stepIndex]
 * @param {string} [entryType]
 */
Tt = /* @__PURE__ */ s(function(t, i, n, r) {
  const o = t instanceof Error ? t : new Error(String(t));
  return {
    status: ai.FAILED,
    error: o,
    phase: i,
    ...typeof n == "number" ? { stepIndex: n } : {},
    ...r ? { entryType: r } : {}
  };
}, "#failedOutcome"), s(Fo, "TweenTimeline");
let Cn = Fo;
function Oo(e) {
  if (!e || typeof e != "object")
    throw new Error("Sequence JSON: data must be an object.");
  if (!Array.isArray(e.timeline))
    throw new Error("Sequence JSON: 'timeline' must be an array.");
  if (e.name != null && typeof e.name != "string")
    throw new Error("Sequence JSON: 'name' must be a string.");
  if (e.errorPolicy != null && e.errorPolicy !== pe.ABORT && e.errorPolicy !== pe.CONTINUE)
    throw new Error(`Sequence JSON: 'errorPolicy' must be "abort" or "continue".`);
  for (let t = 0; t < e.timeline.length; t++) {
    const i = e.timeline[t];
    if (!Array.isArray(i)) {
      if (typeof i != "object" || typeof i.delay != "number" || i.delay < 0)
        throw new Error(`Sequence JSON: timeline[${t}] must be a step array or { delay: <ms> }.`);
      continue;
    }
    if (i.length === 0)
      throw new Error(`Sequence JSON: timeline[${t}] is an empty step.`);
    for (let n = 0; n < i.length; n++) {
      const r = i[n];
      if (!r || typeof r != "object")
        throw new Error(`Sequence JSON: timeline[${t}][${n}] must be an object.`);
      if (typeof r.type != "string" || !r.type)
        throw new Error(`Sequence JSON: timeline[${t}][${n}].type must be a non-empty string.`);
      if (r.params != null && typeof r.params != "object")
        throw new Error(`Sequence JSON: timeline[${t}][${n}].params must be an object.`);
      if (r.opts != null && typeof r.opts != "object")
        throw new Error(`Sequence JSON: timeline[${t}][${n}].opts must be an object.`);
      if (r.detach != null && typeof r.detach != "boolean")
        throw new Error(`Sequence JSON: timeline[${t}][${n}].detach must be a boolean.`);
    }
  }
}
s(Oo, "validateSequenceJSON");
function Hs(e) {
  Oo(e);
  for (let t = 0; t < e.timeline.length; t++) {
    const i = e.timeline[t];
    if (Array.isArray(i))
      for (let n = 0; n < i.length; n++) {
        const r = i[n];
        try {
          Su(r.type, r.params ?? {});
        } catch (o) {
          throw new Error(`Sequence JSON: timeline[${t}][${n}] failed semantic validation: ${o.message}`);
        }
      }
  }
}
s(Hs, "validateSequenceSemantics");
function vo(e, t = {}) {
  Oo(e), t.validateSemantics && Hs(e);
  const i = new Cn();
  e.name && i.name(e.name), e.errorPolicy && i.errorPolicy(e.errorPolicy);
  for (const n of e.timeline) {
    if (!Array.isArray(n)) {
      i.delay(n.delay);
      continue;
    }
    const r = i.step();
    for (const o of n)
      r.add(o.type, o.params ?? {}, o.opts), o.detach && r.detach();
  }
  return i;
}
s(vo, "compileSequence");
function $u(e) {
  Oo(e), Hs(e);
}
s($u, "validate");
async function Pu(e, t = {}) {
  return vo(e, { validateSemantics: !0 }).run({
    broadcast: !1,
    commit: t.commit,
    startEpochMS: t.startEpochMS,
    signal: t.signal
  }).finished;
}
s(Pu, "execute");
function Bu() {
  wo({ type: "sequence", execute: Pu, validate: $u });
}
s(Bu, "registerSequenceTween");
async function qu(e, t, i = {}) {
  if (!game.user.isGM)
    return ui.notifications.warn("Only the GM can dispatch tweens."), !1;
  const n = nr(e);
  if (!n)
    throw new Error(`Unknown tween type: "${e}". Registered types: ${so().join(", ")}`);
  n.validate(t);
  const { durationMS: r = 2e3, easing: o = "easeInOutCosine", commit: a = !0 } = i, l = Date.now();
  return sn(As, {
    type: e,
    params: t,
    durationMS: r,
    easing: o,
    startEpochMS: l,
    commit: !1
  }), n.execute(t, { durationMS: r, easing: o, commit: a, startEpochMS: l });
}
s(qu, "dispatchTween");
function Uu(e) {
  const { type: t, params: i, durationMS: n, easing: r, startEpochMS: o, commit: a } = e ?? {}, l = nr(t);
  if (!l) {
    console.warn(`[${I}] Received unknown tween type over socket: "${t}"`);
    return;
  }
  l.execute(i, {
    durationMS: n,
    easing: r,
    commit: a ?? !1,
    startEpochMS: o
  });
}
s(Uu, "handleTweenSocketMessage");
Du();
Ru();
Bu();
Io(As, Uu);
Io(Ds, Vu);
Io(ao, ju);
function Vu(e) {
  const { data: t, startEpochMS: i } = e ?? {};
  if (!t) {
    console.warn(`[${I}] Received empty tween-sequence socket message.`);
    return;
  }
  try {
    vo(t, { validateSemantics: !0 }).run({ commit: !1, startEpochMS: i, broadcast: !1 });
  } catch (n) {
    console.error(`[${I}] Failed to run received tween sequence:`, n);
  }
}
s(Vu, "handleSequenceSocketMessage");
function ju(e) {
  const { name: t } = e ?? {};
  t && Rs(t);
}
s(ju, "handleSequenceCancelMessage");
function zu() {
  Hooks.once("ready", () => {
    Lu();
    const e = game.modules.get(I);
    e.api || (e.api = {}), e.api.tween = {
      dispatch: qu,
      types: so,
      Timeline: Cn,
      ErrorPolicy: pe,
      compileSequence: vo,
      cancelTimeline: Rs,
      getTimeline: ku
    }, console.log(`[${I}] Tween API registered. Types: ${so().join(", ")}`);
  });
}
s(zu, "registerTweenHooks");
zu();
//# sourceMappingURL=eidolon-utilities.js.map
