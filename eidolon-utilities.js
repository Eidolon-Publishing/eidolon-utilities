var Ac = Object.defineProperty;
var gm = Object.getPrototypeOf;
var pm = Reflect.get;
var kc = (e) => {
  throw TypeError(e);
};
var ym = (e, t, n) => t in e ? Ac(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var c = (e, t) => Ac(e, "name", { value: t, configurable: !0 });
var pe = (e, t, n) => ym(e, typeof t != "symbol" ? t + "" : t, n), Xo = (e, t, n) => t.has(e) || kc("Cannot " + n);
var f = (e, t, n) => (Xo(e, t, "read from private field"), n ? n.call(e) : t.get(e)), A = (e, t, n) => t.has(e) ? kc("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, n), L = (e, t, n, i) => (Xo(e, t, "write to private field"), i ? i.call(e, n) : t.set(e, n), n), C = (e, t, n) => (Xo(e, t, "access private method"), n);
var Qo = (e, t, n, i) => ({
  set _(r) {
    L(e, t, r, n);
  },
  get _() {
    return f(e, t, i);
  }
}), $e = (e, t, n) => pm(gm(e), n, t);
const T = "eidolon-utilities", ka = "timeTriggerActive", Es = "timeTriggerHideWindow", Ss = "timeTriggerShowPlayerWindow", Cs = "timeTriggerAllowRealTime", qu = "timeTriggers", da = "timeTriggerHistory", Ts = "debug", Ls = "timeFormat", Is = "manageTime", Os = "secondsPerRound";
const bm = [-30, -15, -5, 5, 15, 30], Mi = 1440 * 60, fa = "playSound", Vr = 6;
function E(e, t) {
  var n, i;
  return (i = (n = game.i18n) == null ? void 0 : n.has) != null && i.call(n, e) ? game.i18n.localize(e) : t;
}
c(E, "localize");
function Ot(e) {
  return typeof e != "string" ? "" : e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
c(Ot, "escapeHtml");
function qt(e) {
  var t;
  return e == null ? e : (t = foundry == null ? void 0 : foundry.utils) != null && t.duplicate ? foundry.utils.duplicate(e) : JSON.parse(JSON.stringify(e));
}
c(qt, "duplicateData");
function vm() {
  var e;
  return (e = foundry == null ? void 0 : foundry.utils) != null && e.randomID ? foundry.utils.randomID() : typeof (crypto == null ? void 0 : crypto.randomUUID) == "function" ? crypto.randomUUID() : Math.random().toString(36).slice(2, 10);
}
c(vm, "generateTriggerId");
function ju(e) {
  if (typeof e != "string") return null;
  const t = e.trim();
  if (!t) return null;
  const n = t.match(/^([0-9]{1,2}):([0-9]{2})(?::([0-9]{2}))?$/);
  if (!n) return null;
  const i = Number(n[1]), r = Number(n[2]), a = n[3] !== void 0 ? Number(n[3]) : 0;
  return !Number.isInteger(i) || !Number.isInteger(r) || !Number.isInteger(a) || i < 0 || i > 23 || r < 0 || r > 59 || a < 0 || a > 59 ? null : i * 3600 + r * 60 + a;
}
c(ju, "parseTriggerTimeToSeconds");
function nr() {
  var e, t;
  return ((e = game.scenes) == null ? void 0 : e.current) ?? ((t = game.scenes) == null ? void 0 : t.active) ?? null;
}
c(nr, "getActiveScene");
function jt(e) {
  return (e == null ? void 0 : e.object) ?? (e == null ? void 0 : e.document) ?? null;
}
c(jt, "getSceneFromApplication");
function Ue(e) {
  return e && typeof e.getFlag == "function" && typeof e.setFlag == "function";
}
c(Ue, "hasSceneDocument");
const As = /* @__PURE__ */ new Set(), ks = /* @__PURE__ */ new Set(), Ms = /* @__PURE__ */ new Set(), Ns = /* @__PURE__ */ new Set();
let di = !1, yr = !1, Ma = Vr, Na = "12h", Mc = !1;
function Zo(e) {
  di = !!e;
  for (const t of As)
    try {
      t(di);
    } catch (n) {
      console.error(`${T} | Debug change handler failed`, n);
    }
}
c(Zo, "notifyDebugChange");
function es(e) {
  yr = !!e;
  for (const t of ks)
    try {
      t(yr);
    } catch (n) {
      console.error(`${T} | Manage time change handler failed`, n);
    }
}
c(es, "notifyManageTimeChange");
function Bu(e) {
  return e === "24h" ? "24h" : "12h";
}
c(Bu, "normalizeTimeFormatValue");
function Kl(e) {
  const t = Number(e);
  return !Number.isFinite(t) || t <= 0 ? Vr : t;
}
c(Kl, "normalizeSecondsPerRoundValue");
function ts(e) {
  const t = Kl(e);
  Ma = t;
  for (const n of Ms)
    try {
      n(t);
    } catch (i) {
      console.error(`${T} | Seconds-per-round change handler failed`, i);
    }
}
c(ts, "notifySecondsPerRoundChange");
function ns(e) {
  const t = Bu(e);
  Na = t;
  for (const n of Ns)
    try {
      n(t);
    } catch (i) {
      console.error(`${T} | Time format change handler failed`, i);
    }
}
c(ns, "notifyTimeFormatChange");
function wm() {
  var t;
  if (Mc) return;
  if (Mc = !0, !((t = game == null ? void 0 : game.settings) != null && t.register)) {
    console.warn(
      `${T} | game.settings.register is unavailable. Module settings could not be registered.`
    );
    return;
  }
  const e = typeof game.settings.registerChange == "function";
  game.settings.register(T, Ts, {
    name: E("EIDOLON.TimeTrigger.DebugSettingName", "Enable debug logging"),
    hint: E(
      "EIDOLON.TimeTrigger.DebugSettingHint",
      "Write detailed time-trigger diagnostics to the browser console."
    ),
    scope: "world",
    config: !0,
    type: Boolean,
    default: !1,
    onChange: e ? void 0 : Zo
  }), e && game.settings.registerChange(T, Ts, Zo), di = Jl(), Zo(di), game.settings.register(T, Is, {
    name: E("EIDOLON.TimeTrigger.ManageTimeSettingName", "Manage Game Time"),
    hint: E(
      "EIDOLON.TimeTrigger.ManageTimeSettingHint",
      "Allow Eidolon Utilities to advance world time automatically while the game is unpaused. Warning: This may conflict with other time-management modules."
    ),
    scope: "world",
    config: !0,
    type: Boolean,
    default: !1,
    onChange: e ? void 0 : es
  }), e && game.settings.registerChange(T, Is, es), yr = Sm(), es(yr), game.settings.register(T, Os, {
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
    default: Vr,
    range: { min: 1, max: 3600, step: 1 },
    onChange: e ? void 0 : ts
  }), e && game.settings.registerChange(
    T,
    Os,
    ts
  ), Ma = Kl(Cm()), ts(Ma), game.settings.register(T, Ls, {
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
    onChange: e ? void 0 : ns
  }), e && game.settings.registerChange(T, Ls, ns), Na = Bu(Uu()), ns(Na);
}
c(wm, "registerTimeTriggerSettings");
function Jl() {
  var e;
  try {
    if ((e = game == null ? void 0 : game.settings) != null && e.get)
      return !!game.settings.get(T, Ts);
  } catch (t) {
    console.error(`${T} | Failed to read debug setting`, t);
  }
  return !1;
}
c(Jl, "getDebugSetting");
function Em() {
  return di = Jl(), di;
}
c(Em, "refreshDebugSettingCache");
function Sm() {
  var e;
  try {
    if ((e = game == null ? void 0 : game.settings) != null && e.get)
      return !!game.settings.get(T, Is);
  } catch (t) {
    console.error(`${T} | Failed to read manage time setting`, t);
  }
  return !1;
}
c(Sm, "getManageTimeSetting");
function Uu() {
  var e;
  try {
    if ((e = game == null ? void 0 : game.settings) != null && e.get)
      return game.settings.get(T, Ls) === "24h" ? "24h" : "12h";
  } catch (t) {
    console.error(`${T} | Failed to read time format setting`, t);
  }
  return "12h";
}
c(Uu, "getTimeFormatSetting");
function Cm() {
  var e;
  try {
    if ((e = game == null ? void 0 : game.settings) != null && e.get) {
      const t = game.settings.get(T, Os);
      return Kl(t);
    }
  } catch (t) {
    console.error(`${T} | Failed to read seconds-per-round setting`, t);
  }
  return Vr;
}
c(Cm, "getSecondsPerRoundSetting");
function Tm(e) {
  if (typeof e != "function")
    return () => {
    };
  As.add(e);
  try {
    e(di);
  } catch (t) {
    console.error(`${T} | Debug change handler failed`, t);
  }
  return () => {
    As.delete(e);
  };
}
c(Tm, "onDebugSettingChange");
function Vu(e) {
  if (typeof e != "function")
    return () => {
    };
  ks.add(e);
  try {
    e(yr);
  } catch (t) {
    console.error(`${T} | Manage time change handler failed`, t);
  }
  return () => {
    ks.delete(e);
  };
}
c(Vu, "onManageTimeSettingChange");
function Yl(e) {
  if (typeof e != "function")
    return () => {
    };
  Ns.add(e);
  try {
    e(Na);
  } catch (t) {
    console.error(`${T} | Time format change handler failed`, t);
  }
  return () => {
    Ns.delete(e);
  };
}
c(Yl, "onTimeFormatSettingChange");
function Lm(e) {
  if (typeof e != "function")
    return () => {
    };
  Ms.add(e);
  try {
    e(Ma);
  } catch (t) {
    console.error(`${T} | Seconds-per-round change handler failed`, t);
  }
  return () => {
    Ms.delete(e);
  };
}
c(Lm, "onSecondsPerRoundSettingChange");
let _o = !1, _s = !1;
function $s(e) {
  _o = !!e;
}
c($s, "updateDebugState");
function zu() {
  _s || (_s = !0, $s(Jl()), Tm((e) => {
    $s(e), console.info(`${T} | Debug ${_o ? "enabled" : "disabled"}`);
  }));
}
c(zu, "ensureInitialized");
function Xl() {
  return _s || zu(), _o;
}
c(Xl, "shouldLog");
function Gu(e) {
  if (!e.length)
    return [`${T} |`];
  const [t, ...n] = e;
  return typeof t == "string" ? [`${T} | ${t}`, ...n] : [`${T} |`, t, ...n];
}
c(Gu, "formatArgs");
function Im() {
  zu();
}
c(Im, "initializeDebug");
function Om() {
  return $s(Em()), _o;
}
c(Om, "syncDebugState");
function N(...e) {
  Xl() && console.debug(...Gu(e));
}
c(N, "debugLog");
function Bi(...e) {
  Xl() && console.group(...Gu(e));
}
c(Bi, "debugGroup");
function Cn() {
  Xl() && console.groupEnd();
}
c(Cn, "debugGroupEnd");
function Ni(e) {
  var r;
  const t = (r = e == null ? void 0 : e.getFlag) == null ? void 0 : r.call(e, T, qu);
  if (!t) return [];
  const n = qt(t), i = Array.isArray(n) ? n : [];
  return N("Loaded time triggers", {
    sceneId: (e == null ? void 0 : e.id) ?? null,
    count: i.length
  }), i;
}
c(Ni, "getTimeTriggers");
async function Wu(e, t) {
  e != null && e.setFlag && (N("Persisting time triggers", {
    sceneId: e.id,
    count: Array.isArray(t) ? t.length : 0
  }), await e.setFlag(T, qu, t));
}
c(Wu, "setTimeTriggers");
function Am(e) {
  var r;
  const t = (r = e == null ? void 0 : e.getFlag) == null ? void 0 : r.call(e, T, da);
  if (!t) return {};
  const n = qt(t);
  if (!n || typeof n != "object") return {};
  const i = {};
  for (const [a, o] of Object.entries(n))
    typeof o == "number" && Number.isFinite(o) && (i[a] = o);
  return N("Loaded time trigger history", {
    sceneId: (e == null ? void 0 : e.id) ?? null,
    keys: Object.keys(i)
  }), i;
}
c(Am, "getTimeTriggerHistory");
async function is(e, t) {
  var l, u, d, m;
  if (!e) return;
  const n = {};
  if (t && typeof t == "object")
    for (const [h, y] of Object.entries(t))
      typeof y == "number" && Number.isFinite(y) && (n[h] = y);
  const i = ((l = e.getFlag) == null ? void 0 : l.call(e, T, da)) ?? {}, r = {};
  if (i && typeof i == "object")
    for (const [h, y] of Object.entries(i))
      typeof y == "number" && Number.isFinite(y) && (r[h] = y);
  const a = Object.keys(n), o = Object.keys(r);
  if (typeof ((u = foundry == null ? void 0 : foundry.utils) == null ? void 0 : u.deepEqual) == "function" ? foundry.utils.deepEqual(r, n) : JSON.stringify(r) === JSON.stringify(n)) {
    N("Skip history update because state is unchanged", {
      sceneId: (e == null ? void 0 : e.id) ?? null
    });
    return;
  }
  N("Updating time trigger history", {
    sceneId: (e == null ? void 0 : e.id) ?? null,
    keys: a,
    removedKeys: o.filter((h) => !a.includes(h))
  });
  try {
    o.length && typeof e.unsetFlag == "function" && await e.unsetFlag(T, da), a.length && await e.setFlag(T, da, n);
  } catch (h) {
    console.error(`${T} | Failed to persist time trigger history`, h), (m = (d = ui.notifications) == null ? void 0 : d.error) == null || m.call(
      d,
      E(
        "EIDOLON.TimeTrigger.HistoryPersistError",
        "Failed to persist the scene's time trigger history."
      )
    );
  }
}
c(is, "updateTimeTriggerHistory");
const _a = /* @__PURE__ */ new Map(), Nc = /* @__PURE__ */ new Set();
function km(e) {
  if (!(e != null && e.id))
    throw new Error(`${T} | Action definitions require an id.`);
  if (_a.has(e.id))
    throw new Error(`${T} | Duplicate time trigger action id: ${e.id}`);
  _a.set(e.id, {
    ...e
  }), N("Registered time trigger action", { actionId: e.id });
}
c(km, "registerAction");
function zr(e) {
  return _a.get(e) ?? null;
}
c(zr, "getAction");
function Mm(e) {
  const t = zr(e);
  return t ? typeof t.label == "function" ? t.label() : t.label : e;
}
c(Mm, "getActionLabel");
function _c() {
  return Array.from(_a.values());
}
c(_c, "listActions");
async function Ku(e, t) {
  var i, r;
  const n = zr(t == null ? void 0 : t.action);
  if (!n || typeof n.execute != "function") {
    const a = E(
      "EIDOLON.TimeTrigger.UnknownAction",
      "Encountered an unknown time trigger action and skipped it."
    );
    (r = (i = ui.notifications) == null ? void 0 : i.warn) == null || r.call(i, a), console.warn(`${T} | Unknown time trigger action`, t), N("Encountered unknown time trigger action", {
      triggerId: (t == null ? void 0 : t.id) ?? null,
      actionId: (t == null ? void 0 : t.action) ?? null
    });
    return;
  }
  N("Executing action handler", {
    actionId: n.id,
    triggerId: (t == null ? void 0 : t.id) ?? null,
    sceneId: (e == null ? void 0 : e.id) ?? null
  }), await n.execute({ scene: e, trigger: t });
}
c(Ku, "executeTriggerAction");
function Nm(e) {
  const t = zr(e == null ? void 0 : e.action);
  return !t || typeof t.buildSummaryParts != "function" ? [] : t.buildSummaryParts({ trigger: e, escapeHtml: Ot, localize: E }) ?? [];
}
c(Nm, "buildActionSummaryParts");
function _m(e) {
  const t = zr(e == null ? void 0 : e.action);
  return !t || typeof t.buildFormContent != "function" ? "" : t.buildFormContent({ trigger: e, escapeHtml: Ot, localize: E }) ?? "";
}
c(_m, "buildActionFormSection");
function $m(e, t) {
  const n = zr(e == null ? void 0 : e.action);
  !n || typeof n.prepareFormData != "function" || n.prepareFormData({ trigger: e, formData: t });
}
c($m, "applyActionFormData");
function Dm(e, t, n) {
  var a, o;
  const i = `${(e == null ? void 0 : e.id) ?? "unknown"}:${(t == null ? void 0 : t.id) ?? (t == null ? void 0 : t.action) ?? "unknown"}:${n}`;
  if (Nc.has(i)) return;
  Nc.add(i);
  const r = E(
    "EIDOLON.TimeTrigger.MissingDataWarning",
    "A scene time trigger is missing required data and was skipped."
  );
  (o = (a = ui.notifications) == null ? void 0 : a.warn) == null || o.call(a, r), console.warn(`${T} | Missing trigger data (${n})`, { scene: e == null ? void 0 : e.id, trigger: t });
}
c(Dm, "warnMissingTriggerData");
async function Fm({ scene: e, trigger: t }) {
  var a, o, s, l, u;
  const n = (s = (o = (a = t == null ? void 0 : t.data) == null ? void 0 : a.path) == null ? void 0 : o.trim) == null ? void 0 : s.call(o);
  if (!n) {
    Dm(e, t, "missing-audio-path");
    return;
  }
  const i = {
    src: n,
    autoplay: !0,
    loop: !1
  }, r = (() => {
    var d, m, h, y, p;
    return typeof ((m = (d = foundry == null ? void 0 : foundry.audio) == null ? void 0 : d.AudioHelper) == null ? void 0 : m.play) == "function" ? foundry.audio.AudioHelper.play(i, !0) : typeof ((y = (h = game == null ? void 0 : game.audio) == null ? void 0 : h.constructor) == null ? void 0 : y.play) == "function" ? game.audio.constructor.play(i, !0) : typeof ((p = game == null ? void 0 : game.audio) == null ? void 0 : p.play) == "function" ? game.audio.play(i, !0) : null;
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
c(Fm, "executePlaySoundAction");
km({
  id: fa,
  label: /* @__PURE__ */ c(() => E("EIDOLON.TimeTrigger.ActionPlaySound", "Play Sound"), "label"),
  execute: Fm,
  buildSummaryParts: /* @__PURE__ */ c(({ trigger: e, escapeHtml: t, localize: n }) => {
    var r;
    return (r = e == null ? void 0 : e.data) != null && r.path ? [`${t(n("EIDOLON.TimeTrigger.TriggerSound", "Sound File"))}: ${t(e.data.path)}`] : [];
  }, "buildSummaryParts"),
  buildFormContent: /* @__PURE__ */ c(({ trigger: e, escapeHtml: t, localize: n }) => {
    var s;
    const i = t(n("EIDOLON.TimeTrigger.TriggerSound", "Sound File")), r = t(
      n("EIDOLON.TimeTrigger.TriggerChooseFile", "Select File")
    ), a = t(
      n(
        "EIDOLON.TimeTrigger.TriggerSoundNotes",
        "Select or upload the audio file that should play when this trigger fires."
      )
    ), o = t(((s = e == null ? void 0 : e.data) == null ? void 0 : s.path) ?? "");
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
  prepareFormData: /* @__PURE__ */ c(({ trigger: e, formData: t }) => {
    var n, i;
    e.data.path = ((i = (n = t.playSoundPath) == null ? void 0 : n.trim) == null ? void 0 : i.call(n)) ?? "";
  }, "prepareFormData")
});
var $u;
const { ApplicationV2: Dn, HandlebarsApplicationMixin: Fn } = (($u = foundry.applications) == null ? void 0 : $u.api) ?? {};
if (!Dn || !Fn)
  throw new Error(
    `${T} | ApplicationV2 API unavailable. Update Foundry VTT to v13 or newer.`
  );
const On = "AM", fi = "PM";
function Tn() {
  return Uu();
}
c(Tn, "getConfiguredTimeFormat");
function $o(e) {
  if (typeof e != "string") return null;
  const t = e.trim();
  if (!t) return null;
  const n = t.match(/^([0-9]{1,2}):([0-9]{2})(?::([0-9]{2}))?$/);
  if (!n) return null;
  const i = Number(n[1]), r = Number(n[2]), a = n[3] !== void 0 ? Number(n[3]) : null;
  return !Number.isInteger(i) || !Number.isInteger(r) || i < 0 || i > 23 || r < 0 || r > 59 || a !== null && (!Number.isInteger(a) || a < 0 || a > 59) ? null : {
    hours: i,
    minutes: r,
    seconds: a
  };
}
c($o, "parseCanonicalTimeString");
function Pt({ hours: e, minutes: t, seconds: n }) {
  if (!Number.isInteger(e) || !Number.isInteger(t) || e < 0 || e > 23 || t < 0 || t > 59) return null;
  const i = String(e).padStart(2, "0"), r = String(t).padStart(2, "0");
  if (Number.isInteger(n)) {
    if (n < 0 || n > 59) return null;
    const a = String(n).padStart(2, "0");
    return `${i}:${r}:${a}`;
  }
  return `${i}:${r}`;
}
c(Pt, "formatCanonicalTime");
function xm(e, { format: t } = {}) {
  if (!e || typeof e != "object") return null;
  const n = Number(e.hour), i = Number(e.minute), r = e.second !== void 0 && e.second !== null, a = r ? Number(e.second) : null, o = r && Number.isFinite(a) ? Math.floor(Math.max(0, Math.min(59, a))) : null;
  if (!Number.isFinite(n) || !Number.isFinite(i)) return null;
  const s = t ?? Tn();
  return $a(
    {
      hours: n,
      minutes: i,
      seconds: o
    },
    s
  );
}
c(xm, "formatTimeComponentsForDisplay");
function Pm(e, { format: t } = {}) {
  const n = $o(e);
  if (!n) return "";
  const i = t ?? Tn();
  return $a(n, i);
}
c(Pm, "formatTriggerTimeForDisplay");
function $a(e, t = "12h") {
  if (!e) return "";
  const { hours: n, minutes: i, seconds: r = null } = e;
  if (!Number.isInteger(n) || !Number.isInteger(i)) return "";
  const a = Number.isInteger(r);
  if (t === "24h") {
    const h = `${String(n).padStart(2, "0")}:${String(i).padStart(2, "0")}`;
    return a ? `${h}:${String(r).padStart(2, "0")}` : h;
  }
  const o = n >= 12 ? fi : On, s = n % 12 === 0 ? 12 : n % 12, l = String(s), u = String(i).padStart(2, "0"), d = `${l}:${u}`, m = o === On ? E("EIDOLON.TimeTrigger.TimePeriodAM", On) : E("EIDOLON.TimeTrigger.TimePeriodPM", fi);
  if (a) {
    const h = String(r).padStart(2, "0");
    return `${d}:${h} ${m}`;
  }
  return `${d} ${m}`;
}
c($a, "formatTimeParts");
function $c(e, t = Tn()) {
  const n = $o(e);
  if (t === "24h")
    return {
      format: t,
      canonical: n ? Pt(n) ?? "" : "",
      hour: n ? String(n.hours).padStart(2, "0") : "",
      minute: n ? String(n.minutes).padStart(2, "0") : ""
    };
  if (!n)
    return {
      format: t,
      canonical: "",
      hour: "",
      minute: "",
      period: On
    };
  const i = n.hours >= 12 ? fi : On, r = n.hours % 12 === 0 ? 12 : n.hours % 12;
  return {
    format: t,
    canonical: Pt(n) ?? "",
    hour: String(r),
    minute: String(n.minutes).padStart(2, "0"),
    period: i
  };
}
c($c, "getTimeFormValues");
function Rm({ hour: e, minute: t, period: n, time: i }, r = Tn()) {
  if (r === "24h") {
    const y = typeof e == "string" ? e.trim() : "", p = typeof t == "string" ? t.trim() : "", g = typeof i == "string" ? i.trim() : "";
    if (!y && !p && g) {
      const S = $o(g);
      return S ? { canonical: Pt(S) ?? "", error: null } : {
        canonical: "",
        error: E(
          "EIDOLON.TimeTrigger.TimeFormatInvalid24",
          "Enter a valid time in HH:MM format."
        )
      };
    }
    if (!y || !p)
      return {
        canonical: "",
        error: E("EIDOLON.TimeTrigger.TimeFormatMissing", "Enter a complete time.")
      };
    const v = Number(y), b = Number(p);
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
    } : { canonical: Pt({
      hours: v,
      minutes: b
    }) ?? "", error: null };
  }
  const a = typeof e == "string" ? e.trim() : "", o = typeof t == "string" ? t.trim() : "", s = typeof n == "string" ? n.trim().toUpperCase() : "";
  if (!a || !o || !s)
    return { canonical: "", error: E("EIDOLON.TimeTrigger.TimeFormatMissing", "Enter a complete time.") };
  if (s !== On && s !== fi)
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
  const d = l % 12, h = {
    hours: s === fi ? d + 12 : d,
    minutes: u
  };
  return {
    canonical: Pt(h) ?? "",
    error: null
  };
}
c(Rm, "normalizeFormTimeInput");
function Hm() {
  return [
    {
      value: On,
      label: E("EIDOLON.TimeTrigger.TimePeriodAM", On)
    },
    {
      value: fi,
      label: E("EIDOLON.TimeTrigger.TimePeriodPM", fi)
    }
  ];
}
c(Hm, "getPeriodOptions");
var Kn, Jn, re, Ju, no, io, Yu, Fs, xs, ro, ao, Xu, Qu, Zu, Ps, Rs, Hs, oo, so, qs, lo, ed, td;
const Gn = class Gn extends Fn(Dn) {
  constructor(n = {}) {
    var o;
    const { scene: i, showControls: r, ...a } = n ?? {};
    super(a);
    A(this, re);
    A(this, Kn, null);
    A(this, Jn, null);
    A(this, no, /* @__PURE__ */ c((n) => {
      var r, a;
      n.preventDefault();
      const i = Number((a = (r = n.currentTarget) == null ? void 0 : r.dataset) == null ? void 0 : a.delta);
      Number.isFinite(i) && (N("Time delta button clicked", { delta: i }), this._advanceTime(i));
    }, "#onDeltaClick"));
    A(this, io, /* @__PURE__ */ c((n) => {
      var i, r;
      n.preventDefault(), !(!this.showControls || !((i = game.user) != null && i.isGM)) && (N("Time value double clicked", { sceneId: ((r = this.scene) == null ? void 0 : r.id) ?? null }), C(this, re, Yu).call(this));
    }, "#onTimeDoubleClick"));
    A(this, ro, /* @__PURE__ */ c((n) => {
      if (this.isEditingTime && !this._commitTimeInProgress)
        if (n.key === "Enter") {
          n.preventDefault();
          const i = n.currentTarget, r = typeof (i == null ? void 0 : i.value) == "string" ? i.value : "";
          C(this, re, xs).call(this, r);
        } else n.key === "Escape" && (n.preventDefault(), C(this, re, Fs).call(this));
    }, "#onTimeInputKeydown"));
    A(this, ao, /* @__PURE__ */ c((n) => {
      if (!this.isEditingTime || this._commitTimeInProgress || this._suppressBlurCommit) return;
      const i = n.currentTarget, r = typeof (i == null ? void 0 : i.value) == "string" ? i.value : "";
      C(this, re, xs).call(this, r);
    }, "#onTimeInputBlur"));
    A(this, oo, /* @__PURE__ */ c((n) => {
      const i = !!n;
      if (this.manageTimeEnabled === i) return;
      this.manageTimeEnabled = i, (this.rendered ?? this.isRendered ?? !1) && this.render({ force: !0 });
    }, "#handleManageTimeChange"));
    A(this, so, /* @__PURE__ */ c(async (n) => {
      var a, o, s, l, u, d, m, h, y;
      if (n.preventDefault(), !this.showControls || !((a = game.user) != null && a.isGM)) return;
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
        await i.setFlag(T, Cs, r), this.sceneAllowsRealTime = r;
        const p = r ? E(
          "EIDOLON.TimeTrigger.SceneRealTimeEnabled",
          "Automatic real-time flow enabled for this scene."
        ) : E(
          "EIDOLON.TimeTrigger.SceneRealTimeDisabled",
          "Automatic real-time flow disabled for this scene."
        );
        (m = (d = ui.notifications) == null ? void 0 : d.info) == null || m.call(d, p);
      } catch (p) {
        console.error(`${T} | Failed to toggle scene real-time flow`, p), (y = (h = ui.notifications) == null ? void 0 : h.error) == null || y.call(
          h,
          E(
            "EIDOLON.TimeTrigger.SceneRealTimeToggleError",
            "Failed to update the scene's real-time flow setting."
          )
        );
      } finally {
        this.render({ force: !0 });
      }
    }, "#onRealTimeToggleClick"));
    A(this, lo, /* @__PURE__ */ c(() => {
      (this.rendered ?? this.isRendered ?? !1) && (this.isEditingTime && (this.editValue = C(this, re, Ps).call(this)), this.render({ force: !0 }));
    }, "#handleTimeFormatChange"));
    this.scene = i ?? null, this.showControls = typeof r == "boolean" ? r : !!((o = game.user) != null && o.isGM), this.isEditingTime = !1, this.editValue = "", this._commitTimeInProgress = !1, this._suppressBlurCommit = !1, this.manageTimeEnabled = !1, this.sceneAllowsRealTime = C(this, re, qs).call(this), L(this, Kn, Yl(f(this, lo))), L(this, Jn, Vu(f(this, oo)));
  }
  async _prepareContext() {
    var b, w;
    const n = ((b = game.time) == null ? void 0 : b.components) ?? {}, r = ((n == null ? void 0 : n.second) !== void 0 && (n == null ? void 0 : n.second) !== null ? xm(n) : null) ?? C(this, re, Ju).call(this), a = Tn(), o = a === "24h", s = o ? E("EIDOLON.TimeTrigger.EditTimePlaceholder24", "HH:MM") : E("EIDOLON.TimeTrigger.EditTimePlaceholder12", "HH:MM AM/PM"), l = this.showControls ? E(
      "EIDOLON.TimeTrigger.EditTimeHint",
      "Double-click to set a specific time."
    ) : "", u = this.showControls ? E(
      "EIDOLON.TimeTrigger.EditTimeLabel",
      "New time (HH:MM or HH:MM AM/PM)"
    ) : "", d = bm.map((S) => ({
      minutes: S,
      label: S > 0 ? `+${S}` : `${S}`
    })), m = !!this.manageTimeEnabled, h = C(this, re, qs).call(this);
    this.sceneAllowsRealTime = h;
    const y = E(
      "EIDOLON.TimeTrigger.SceneRealTimeEnable",
      "Enable automatic real-time flow for this scene."
    ), p = E(
      "EIDOLON.TimeTrigger.SceneRealTimeDisable",
      "Disable automatic real-time flow for this scene."
    ), g = E(
      "EIDOLON.TimeTrigger.SceneRealTimeManageDisabled",
      "Enable Manage Time in module settings to allow automatic real-time flow."
    );
    return {
      formattedTime: r,
      deltas: d,
      manageTimeEnabled: m,
      sceneAllowsRealTime: h,
      realTimeButtonLabel: m ? h ? p : y : g,
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
      return (this.rendered ?? this.isRendered ?? !1) || (N("TimeTriggerWindow close request rerendering", {
        sceneId: ((r = this.scene) == null ? void 0 : r.id) ?? null
      }), this.render({ force: !0 })), this;
    N("Closing time trigger window", { sceneId: ((a = this.scene) == null ? void 0 : a.id) ?? null, force: !0 });
    const i = await super.close(n);
    return C(this, re, ed).call(this), C(this, re, td).call(this), i;
  }
  async _advanceTime(n) {
    var r, a, o, s, l, u, d;
    const i = n * 60;
    if (N("Advancing world time", { sceneId: ((r = this.scene) == null ? void 0 : r.id) ?? null, minutes: n, seconds: i }), !((a = game.user) != null && a.isGM)) {
      (s = (o = ui.notifications) == null ? void 0 : o.warn) == null || s.call(o, E("EIDOLON.TimeTrigger.GMOnly", "Only the GM can adjust time."));
      return;
    }
    try {
      await game.time.advance(i);
    } catch (m) {
      console.error(`${T} | Failed to advance time`, m), (u = (l = ui.notifications) == null ? void 0 : l.error) == null || u.call(
        l,
        E("EIDOLON.TimeTrigger.Error", "Failed to update the world time.")
      ), N("Failed to advance time from window", {
        sceneId: ((d = this.scene) == null ? void 0 : d.id) ?? null,
        minutes: n,
        message: (m == null ? void 0 : m.message) ?? String(m)
      });
    }
  }
  _onRender(n, i) {
    var a;
    super._onRender(n, i);
    const r = this.element;
    if (r) {
      if (this.showControls) {
        N("Binding time trigger interactions", {
          sceneId: ((a = this.scene) == null ? void 0 : a.id) ?? null,
          buttonCount: r.querySelectorAll("[data-delta]").length
        }), r.querySelectorAll("[data-delta]").forEach((u) => {
          u.addEventListener("click", f(this, no));
        });
        const o = r.querySelector('.time-trigger-window__time-value[data-editable="true"]');
        o && o.addEventListener("dblclick", f(this, io), { once: !1 });
        const s = r.querySelector(".time-trigger-window__time-input");
        s && (s.addEventListener("keydown", f(this, ro)), s.addEventListener("blur", f(this, ao)), typeof s.focus == "function" && (s.focus(), typeof s.select == "function" && s.select()));
        const l = r.querySelector('[data-action="toggle-real-time"]');
        l && l.addEventListener("click", f(this, so));
      }
      this._suppressBlurCommit = !1;
    }
  }
};
Kn = new WeakMap(), Jn = new WeakMap(), re = new WeakSet(), Ju = /* @__PURE__ */ c(function() {
  var l;
  const n = (l = game.time) == null ? void 0 : l.worldTime;
  if (typeof n != "number" || !Number.isFinite(n)) return "";
  const i = 1440 * 60, r = (Math.floor(n) % i + i) % i, a = Math.floor(r / 3600), o = Math.floor(r % 3600 / 60), s = r % 60;
  return $a({ hours: a, minutes: o, seconds: s }, Tn());
}, "#formatFallbackTime"), no = new WeakMap(), io = new WeakMap(), Yu = /* @__PURE__ */ c(function() {
  var n;
  (n = game.user) != null && n.isGM && (this.isEditingTime = !0, this._suppressBlurCommit = !1, this.editValue = C(this, re, Ps).call(this), this.render({ force: !0 }));
}, "#enterTimeEditMode"), Fs = /* @__PURE__ */ c(function() {
  this.isEditingTime = !1, this.editValue = "", this._suppressBlurCommit = !1, this.render({ force: !0 });
}, "#cancelTimeEdit"), xs = /* @__PURE__ */ c(async function(n) {
  var a, o, s;
  if (!((a = game.user) != null && a.isGM) || !this.isEditingTime || this._commitTimeInProgress) return;
  this._commitTimeInProgress = !0;
  const i = typeof n == "string" ? n.trim() : "";
  if (!i) {
    C(this, re, Fs).call(this), this._commitTimeInProgress = !1;
    return;
  }
  const r = C(this, re, Zu).call(this, i);
  if (r.error) {
    (s = (o = ui.notifications) == null ? void 0 : o.error) == null || s.call(o, r.error), this._suppressBlurCommit = !0, this.editValue = i, this.render({ force: !0 }), this._commitTimeInProgress = !1;
    return;
  }
  try {
    await C(this, re, Qu).call(this, r.seconds, r.includeSeconds) ? (this.isEditingTime = !1, this.editValue = "", this.render({ force: !0 })) : (this.editValue = i, this.render({ force: !0 }));
  } finally {
    this._commitTimeInProgress = !1;
  }
}, "#commitTimeInput"), ro = new WeakMap(), ao = new WeakMap(), Xu = /* @__PURE__ */ c(function() {
  var u, d;
  const n = (u = game.time) == null ? void 0 : u.worldTime;
  if (typeof n != "number" || !Number.isFinite(n))
    return "";
  const i = ((d = game.time) == null ? void 0 : d.components) ?? {}, r = Number(i.hour), a = Number(i.minute), o = i.second !== void 0 ? Number(i.second) : null, s = Number.isInteger(o);
  return (Number.isFinite(r) && Number.isFinite(a) ? Pt({
    hours: Math.max(0, Math.min(23, Number(r))),
    minutes: Math.max(0, Math.min(59, Number(a))),
    seconds: s && Number.isFinite(o) ? Math.max(0, Math.min(59, Number(o))) : void 0
  }) ?? "" : "") ?? "";
}, "#getCurrentCanonicalTime"), Qu = /* @__PURE__ */ c(async function(n, i) {
  var h, y, p, g, v, b, w, S, I, O;
  const r = (h = game.time) == null ? void 0 : h.worldTime;
  if (typeof r != "number" || !Number.isFinite(r))
    return (p = (y = ui.notifications) == null ? void 0 : y.error) == null || p.call(
      y,
      E(
        "EIDOLON.TimeTrigger.EditTimeUnavailable",
        "The world time is unavailable, so it can't be updated."
      )
    ), !1;
  if (!Number.isInteger(n) || n < 0 || n >= Mi)
    return (v = (g = ui.notifications) == null ? void 0 : g.error) == null || v.call(
      g,
      E(
        "EIDOLON.TimeTrigger.EditTimeInvalidRange",
        "Enter a time within the current day."
      )
    ), !1;
  const s = Math.floor(r / Mi) * Mi + n - r;
  if (!Number.isFinite(s) || s === 0)
    return !0;
  const l = Math.floor(n / 3600), u = Math.floor(n % 3600 / 60), d = n % 60, m = Pt({
    hours: l,
    minutes: u,
    seconds: i ? d : void 0
  });
  try {
    N("Updating world time directly", {
      sceneId: ((b = this.scene) == null ? void 0 : b.id) ?? null,
      targetCanonical: m ?? null,
      diff: s
    }), await game.time.advance(s);
    const k = $a(
      {
        hours: l,
        minutes: u,
        seconds: i ? d : null
      },
      Tn()
    );
    (S = (w = ui.notifications) == null ? void 0 : w.info) == null || S.call(
      w,
      E(
        "EIDOLON.TimeTrigger.EditTimeSuccess",
        "World time updated."
      ) + (k ? ` ${k}` : "")
    );
  } catch (k) {
    return console.error(`${T} | Failed to set world time`, k), (O = (I = ui.notifications) == null ? void 0 : I.error) == null || O.call(
      I,
      E(
        "EIDOLON.TimeTrigger.EditTimeError",
        "Failed to update the world time."
      )
    ), !1;
  }
  return !0;
}, "#applyTargetSeconds"), Zu = /* @__PURE__ */ c(function(n) {
  var m;
  const i = E(
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
    const h = Number(a[1]), y = Number(a[2]), p = a[3] !== void 0 ? Number(a[3]) : void 0;
    if (Number.isInteger(h) && h >= 0 && h <= 23 && Number.isInteger(y) && y >= 0 && y <= 59 && (p === void 0 || Number.isInteger(p) && p >= 0 && p <= 59)) {
      const g = h * 3600 + y * 60 + (p ?? 0);
      return {
        canonical: Pt({ hours: h, minutes: y, seconds: p }),
        seconds: g,
        includeSeconds: p !== void 0,
        error: null
      };
    }
    return { error: i };
  }
  const { amLower: o, pmLower: s, periodPattern: l } = C(this, re, Rs).call(this), u = r.match(
    new RegExp(
      `^([0-9]{1,2}):([0-9]{2})(?::([0-9]{2}))?\\s*(${l})$`,
      "i"
    )
  );
  if (u) {
    let h = Number(u[1]);
    const y = Number(u[2]), p = u[3] !== void 0 ? Number(u[3]) : void 0, g = u[4] ?? "", v = typeof g == "string" ? ((m = g.toLocaleLowerCase) == null ? void 0 : m.call(g)) ?? g.toLowerCase() : "";
    if (Number.isInteger(h) && h >= 1 && h <= 12 && Number.isInteger(y) && y >= 0 && y <= 59 && (p === void 0 || Number.isInteger(p) && p >= 0 && p <= 59) && (v === o || v === s || v === "am" || v === "pm")) {
      h = h % 12, (v === s || v === "pm") && (h += 12);
      const w = h * 3600 + y * 60 + (p ?? 0);
      return {
        canonical: Pt({ hours: h, minutes: y, seconds: p }),
        seconds: w,
        includeSeconds: p !== void 0,
        error: null
      };
    }
    return { error: i };
  }
  const d = ju(r);
  if (d !== null) {
    const h = Math.floor(d / 3600), y = Math.floor(d % 3600 / 60), p = d % 60, g = p !== 0;
    return {
      canonical: Pt({
        hours: h,
        minutes: y,
        seconds: g ? p : void 0
      }),
      seconds: d,
      includeSeconds: g,
      error: null
    };
  }
  return { error: i };
}, "#parseInputTime"), Ps = /* @__PURE__ */ c(function() {
  const n = C(this, re, Xu).call(this);
  if (!n) return "";
  if (Tn() === "24h")
    return n;
  const r = $o(n);
  if (!r) return n;
  const a = Number(r.hours), o = Number(r.minutes), s = r.seconds !== null && r.seconds !== void 0 ? Number(r.seconds) : void 0;
  if (!Number.isFinite(a) || !Number.isFinite(o)) return n;
  const l = Number.isFinite(s), u = a % 12 === 0 ? 12 : a % 12, d = String(o).padStart(2, "0"), m = l ? `:${String(s).padStart(2, "0")}` : "", { amLabel: h, pmLabel: y } = C(this, re, Rs).call(this), p = a >= 12 ? y : h;
  return `${u}:${d}${m} ${p}`.trim();
}, "#getInitialEditValue"), Rs = /* @__PURE__ */ c(function() {
  var u, d;
  const n = E("EIDOLON.TimeTrigger.TimePeriodAM", "AM"), i = E("EIDOLON.TimeTrigger.TimePeriodPM", "PM"), r = ((u = n.toLocaleLowerCase) == null ? void 0 : u.call(n)) ?? n.toLowerCase(), a = ((d = i.toLocaleLowerCase) == null ? void 0 : d.call(i)) ?? i.toLowerCase(), o = C(this, re, Hs).call(this, n), s = C(this, re, Hs).call(this, i), l = `${o}|${s}|AM|PM`;
  return {
    amLabel: n,
    pmLabel: i,
    amLower: r,
    pmLower: a,
    periodPattern: l
  };
}, "#getPeriodMatchData"), Hs = /* @__PURE__ */ c(function(n) {
  return typeof n != "string" ? "" : n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}, "#escapeForRegex"), oo = new WeakMap(), so = new WeakMap(), qs = /* @__PURE__ */ c(function() {
  const n = this.scene;
  if (!n || typeof n.getFlag != "function") return !1;
  try {
    return !!n.getFlag(T, Cs);
  } catch (i) {
    N("TimeTriggerWindow | Failed to read scene real-time flag", {
      sceneId: (n == null ? void 0 : n.id) ?? null,
      message: (i == null ? void 0 : i.message) ?? String(i)
    });
  }
  return !1;
}, "#readSceneRealTimeFlag"), lo = new WeakMap(), ed = /* @__PURE__ */ c(function() {
  if (typeof f(this, Kn) == "function")
    try {
      f(this, Kn).call(this);
    } catch (n) {
      console.error(`${T} | Failed to dispose time format subscription`, n);
    }
  L(this, Kn, null);
}, "#disposeTimeFormatSubscription"), td = /* @__PURE__ */ c(function() {
  if (typeof f(this, Jn) == "function")
    try {
      f(this, Jn).call(this);
    } catch (n) {
      console.error(`${T} | Failed to dispose manage time subscription`, n);
    }
  L(this, Jn, null);
}, "#disposeManageTimeSubscription"), c(Gn, "TimeTriggerWindow"), pe(Gn, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  $e(Gn, Gn, "DEFAULT_OPTIONS"),
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
)), pe(Gn, "PARTS", {
  content: {
    template: `modules/${T}/templates/time-trigger.html`
  }
});
let Ds = Gn;
function Do(e, t = {}) {
  if (typeof e != "function")
    throw new TypeError("createApplicationFactory requires a constructor function.");
  const n = /* @__PURE__ */ c(function(r = {}) {
    const a = foundry.utils.mergeObject(
      t ?? {},
      r ?? {},
      { inplace: !1 }
    );
    return new e(a);
  }, "applicationFactory");
  return n.__eidolonFactorySignature = "options", n.__eidolonFactoryTarget = e, n;
}
c(Do, "createApplicationFactory");
const Dc = /* @__PURE__ */ new Set();
var be, We, Yn, Ki, nd, id;
const vc = class vc {
  constructor({ windowFactory: t } = {}) {
    A(this, Ki);
    A(this, be, null);
    A(this, We, null);
    A(this, Yn);
    const n = Do(Ds);
    typeof t == "function" ? t.__eidolonFactorySignature === "options" ? L(this, Yn, (r, a = {}) => t({ scene: r, ...a ?? {} })) : L(this, Yn, t) : L(this, Yn, /* @__PURE__ */ c((r, a = {}) => n({ scene: r, ...a ?? {} }), "fallbackFactory"));
  }
  onReady() {
    var n;
    const t = typeof ((n = game.time) == null ? void 0 : n.worldTime) == "number" && Number.isFinite(game.time.worldTime) ? game.time.worldTime : null;
    N("TimeTriggerManager#onReady", { worldTime: t }), t !== null && L(this, We, t);
  }
  onCanvasReady(t) {
    const n = (t == null ? void 0 : t.scene) ?? nr();
    N("TimeTriggerManager#onCanvasReady", { sceneId: (n == null ? void 0 : n.id) ?? null }), this.refreshTimeTriggerWindow(n), this.handleTimeTriggerEvaluation(n);
  }
  onUpdateScene(t) {
    const n = nr();
    N("TimeTriggerManager#onUpdateScene", {
      sceneId: (t == null ? void 0 : t.id) ?? null,
      activeSceneId: (n == null ? void 0 : n.id) ?? null
    }), !(!n || t.id !== n.id) && (this.refreshTimeTriggerWindow(t), this.handleTimeTriggerEvaluation(t));
  }
  onUpdateWorldTime(t, n) {
    N("TimeTriggerManager#onUpdateWorldTime", {
      worldTime: t,
      diff: n,
      hasWindow: !!f(this, be)
    }), f(this, be) && f(this, be).render();
    const i = nr(), r = C(this, Ki, nd).call(this, t, n);
    this.handleTimeTriggerEvaluation(i, t, r);
  }
  refreshTimeTriggerWindow(t) {
    var l, u, d;
    if (!t) return;
    const n = !!((l = game.user) != null && l.isGM), i = !!t.getFlag(T, ka), r = !!t.getFlag(T, Es), a = !!t.getFlag(T, Ss);
    if (N("TimeTriggerManager#refreshTimeTriggerWindow", {
      sceneId: t.id,
      isGM: n,
      isActive: i,
      hideWindow: r,
      showPlayerWindow: a
    }), !(i && !r && (n || a))) {
      f(this, be) && (N("Closing time trigger window", { reason: "not-visible" }), f(this, be).close({ force: !0 }), L(this, be, null));
      return;
    }
    const s = !!n;
    if (f(this, be) && ((u = f(this, be).scene) == null ? void 0 : u.id) === t.id) {
      N("Refreshing existing time trigger window", { sceneId: t.id }), f(this, be).showControls = s, f(this, be).render();
      return;
    }
    f(this, be) && (N("Closing existing window before creating new instance", {
      previousSceneId: ((d = f(this, be).scene) == null ? void 0 : d.id) ?? null
    }), f(this, be).close({ force: !0 })), L(this, be, f(this, Yn).call(this, t, { showControls: s })), N("Rendering new time trigger window", { sceneId: t.id }), f(this, be).render({ force: !0 });
  }
  async handleTimeTriggerEvaluation(t, n, i) {
    var l;
    const r = t ?? nr();
    if (!r) {
      N("handleTimeTriggerEvaluation skipped", {
        reason: "no-active-scene",
        providedSceneId: (t == null ? void 0 : t.id) ?? null,
        currentWorldTime: n
      }), typeof n == "number" && Number.isFinite(n) && L(this, We, n);
      return;
    }
    const a = typeof n == "number" && Number.isFinite(n) ? n : typeof ((l = game.time) == null ? void 0 : l.worldTime) == "number" ? game.time.worldTime : null;
    if (a === null) return;
    const o = typeof i == "number" && Number.isFinite(i) ? i : null, s = o !== null ? o : typeof f(this, We) == "number" && Number.isFinite(f(this, We)) ? f(this, We) : a;
    Bi("handleTimeTriggerEvaluation", {
      sceneId: r.id,
      previousWorldTime: s,
      currentWorldTime: a,
      overrideProvided: o !== null
    });
    try {
      await C(this, Ki, id).call(this, r, s, a);
    } catch (u) {
      console.error(`${T} | Unexpected error while evaluating time triggers`, u), N("handleTimeTriggerEvaluation error", { message: (u == null ? void 0 : u.message) ?? String(u) });
    } finally {
      L(this, We, a), Cn();
    }
  }
};
be = new WeakMap(), We = new WeakMap(), Yn = new WeakMap(), Ki = new WeakSet(), nd = /* @__PURE__ */ c(function(t, n) {
  return typeof f(this, We) == "number" && Number.isFinite(f(this, We)) ? (N("Resolved previous world time from cache", {
    previousWorldTime: f(this, We)
  }), f(this, We)) : typeof t == "number" && Number.isFinite(t) && typeof n == "number" && Number.isFinite(n) ? (N("Resolved previous world time using diff", {
    worldTime: t,
    diff: n,
    resolved: t - n
  }), t - n) : typeof t == "number" && Number.isFinite(t) ? t : null;
}, "#resolvePreviousWorldTime"), id = /* @__PURE__ */ c(async function(t, n, i) {
  var p, g, v;
  if (!((p = game.user) != null && p.isGM)) {
    N("Skipping trigger evaluation because user is not a GM");
    return;
  }
  if (!(t != null && t.id)) {
    N("Skipping trigger evaluation because the scene is missing an id");
    return;
  }
  if (!!!t.getFlag(T, ka)) {
    N("Skipping trigger evaluation because scene is inactive", { sceneId: t.id });
    return;
  }
  if (typeof i != "number" || !Number.isFinite(i)) return;
  (typeof n != "number" || !Number.isFinite(n)) && (n = i);
  const a = Ni(t);
  if (!a.length) {
    N("No time triggers configured for scene", { sceneId: t.id });
    return;
  }
  const o = Am(t), s = /* @__PURE__ */ new Set();
  for (const b of a)
    b != null && b.id && s.add(b.id);
  let l = !1;
  for (const b of Object.keys(o))
    s.has(b) || (delete o[b], l = !0);
  if (Bi("Evaluating scene time triggers", {
    sceneId: t.id,
    previousWorldTime: n,
    currentWorldTime: i,
    triggerCount: a.length
  }), i <= n) {
    N("Detected world time rewind", {
      previousWorldTime: n,
      currentWorldTime: i
    });
    for (const b of a) {
      if (!(b != null && b.id) || !b.allowReplayOnRewind) continue;
      const w = o[b.id];
      typeof w == "number" ? i < w ? (N("Clearing trigger history due to rewind", {
        triggerId: b.id,
        lastFired: w,
        currentWorldTime: i
      }), delete o[b.id], l = !0) : N("Preserving trigger history after rewind", {
        triggerId: b.id,
        lastFired: w,
        currentWorldTime: i
      }) : N("No history stored for rewind-enabled trigger", {
        triggerId: b.id
      });
    }
    l && (N("Persisting history cleanup after rewind", {
      sceneId: t.id
    }), await is(t, o)), Cn();
    return;
  }
  const u = n, d = i, m = [], h = Math.floor(u / Mi), y = Math.floor(d / Mi);
  for (const b of a) {
    if (!(b != null && b.id)) continue;
    const w = ju(b.time);
    if (w === null) {
      qm(t, b), N("Skipping trigger with invalid time", {
        triggerId: b.id,
        time: b.time
      });
      continue;
    }
    for (let S = h; S <= y; S++) {
      const I = S * Mi + w;
      if (I < u || I > d) continue;
      const k = o[b.id];
      if (typeof k == "number" && k >= I) {
        N("Skipping trigger because it already fired within window", {
          triggerId: b.id,
          lastFired: k,
          absoluteTime: I
        });
        continue;
      }
      m.push({ trigger: b, absoluteTime: I });
    }
  }
  if (!m.length) {
    l && await is(t, o), N("No triggers scheduled to fire within evaluation window", {
      sceneId: t.id
    }), Cn();
    return;
  }
  m.sort((b, w) => b.absoluteTime - w.absoluteTime), N("Queued triggers for execution", {
    entries: m.map((b) => ({
      triggerId: b.trigger.id,
      absoluteTime: b.absoluteTime
    }))
  });
  for (const b of m)
    try {
      N("Executing time trigger action", {
        triggerId: b.trigger.id,
        absoluteTime: b.absoluteTime
      }), await Ku(t, b.trigger);
    } catch (w) {
      console.error(`${T} | Failed to execute time trigger action`, w), (v = (g = ui.notifications) == null ? void 0 : g.error) == null || v.call(
        g,
        E(
          "EIDOLON.TimeTrigger.TriggerActionError",
          "Failed to execute a scene time trigger action. Check the console for details."
        )
      ), N("Trigger execution failed", {
        triggerId: b.trigger.id,
        message: (w == null ? void 0 : w.message) ?? String(w)
      });
    } finally {
      o[b.trigger.id] = b.absoluteTime, l = !0, N("Recorded trigger execution", {
        triggerId: b.trigger.id,
        absoluteTime: b.absoluteTime
      });
    }
  l && (N("Persisting trigger history updates", { sceneId: t.id }), await is(t, o)), Cn();
}, "#evaluateSceneTimeTriggers"), c(vc, "TimeTriggerManager");
let js = vc;
function qm(e, t) {
  var r, a;
  const n = `${(e == null ? void 0 : e.id) ?? "unknown"}:${(t == null ? void 0 : t.id) ?? (t == null ? void 0 : t.time) ?? "unknown"}`;
  if (Dc.has(n)) return;
  Dc.add(n);
  const i = E(
    "EIDOLON.TimeTrigger.InvalidTimeWarning",
    "A scene time trigger has an invalid time value and was skipped."
  );
  (a = (r = ui.notifications) == null ? void 0 : r.warn) == null || a.call(r, i), console.warn(`${T} | Invalid time for trigger`, { scene: e == null ? void 0 : e.id, trigger: t });
}
c(qm, "warnInvalidTriggerTime");
var vt, Tr, wt, dn, Xn, Dt, xi, co, uo, Lr, Ir, Qn, Ft, V, Us, Si, ma, Vs, ha, zs, _t, rd, Gs, ad, Ws, od, fo, mo, ho, go, po, yo, Ks, sd, ga, bo, vo;
const wc = class wc {
  constructor() {
    A(this, V);
    A(this, vt, !1);
    A(this, Tr, Vr);
    A(this, wt, /* @__PURE__ */ new Map());
    A(this, dn, null);
    A(this, Xn, null);
    A(this, Dt, 0);
    A(this, xi, null);
    A(this, co, null);
    A(this, uo, null);
    A(this, Lr, !1);
    A(this, Ir, !1);
    A(this, Qn, !1);
    A(this, Ft, !1);
    A(this, fo, /* @__PURE__ */ c((t, n = {}) => {
      N("GameTimeAutomation | Pause state changed", {
        paused: t,
        userId: (n == null ? void 0 : n.userId) ?? null,
        broadcast: (n == null ? void 0 : n.broadcast) ?? null
      }), C(this, V, _t).call(this, { pausedOverride: t });
    }, "#handlePause"));
    A(this, mo, /* @__PURE__ */ c((t) => {
      t != null && t.id && (f(this, wt).set(t.id, Math.max(t.round ?? 0, 1)), N("GameTimeAutomation | Combat started", { combatId: t.id, round: t.round ?? 0 }), C(this, V, _t).call(this));
    }, "#handleCombatStart"));
    A(this, ho, /* @__PURE__ */ c((t, n) => {
      if (!(t != null && t.id)) return;
      const i = typeof n == "number" && Number.isFinite(n) ? n : typeof t.round == "number" && Number.isFinite(t.round) ? t.round : 0, r = i > 0 ? i : 1, a = f(this, wt).get(t.id), o = a ? Math.max(a, 1) : 1, s = r > 1 ? Math.max(r - o, 0) : 0;
      if (N("GameTimeAutomation | Combat round change detected", {
        combatId: t.id,
        effectiveRound: r,
        completedRounds: s,
        enabled: f(this, vt),
        paused: (game == null ? void 0 : game.paused) ?? null
      }), s > 0 && f(this, vt) && f(this, Ft) && !(game != null && game.paused) && C(this, V, Si).call(this) && C(this, V, ma).call(this, t)) {
        const l = s * f(this, Tr);
        l > 0 && (N("GameTimeAutomation | Advancing time for completed combat rounds", {
          combatId: t.id,
          completedRounds: s,
          delta: l
        }), C(this, V, Ws).call(this, l));
      }
      f(this, wt).set(t.id, Math.max(r, 1));
    }, "#handleCombatRound"));
    A(this, go, /* @__PURE__ */ c((t) => {
      t != null && t.id && (f(this, wt).delete(t.id), N("GameTimeAutomation | Combat ended", { combatId: t.id }), C(this, V, _t).call(this));
    }, "#handleCombatEnd"));
    A(this, po, /* @__PURE__ */ c((t) => {
      t != null && t.id && (f(this, wt).delete(t.id), N("GameTimeAutomation | Combat deleted", { combatId: t.id }), C(this, V, _t).call(this));
    }, "#handleCombatDelete"));
    A(this, yo, /* @__PURE__ */ c((t, n) => {
      if (t != null && t.id) {
        if (typeof (n == null ? void 0 : n.round) == "number" && Number.isFinite(n.round)) {
          const i = Math.max(n.round, 1);
          f(this, wt).set(t.id, i), N("GameTimeAutomation | Combat round manually updated", {
            combatId: t.id,
            round: i
          });
        }
        (Object.prototype.hasOwnProperty.call(n ?? {}, "active") || (n == null ? void 0 : n.round) !== void 0) && C(this, V, _t).call(this);
      }
    }, "#handleCombatUpdate"));
    A(this, bo, /* @__PURE__ */ c((t) => {
      C(this, V, ga).call(this, t == null ? void 0 : t.scene), C(this, V, _t).call(this);
    }, "#handleCanvasReady"));
    A(this, vo, /* @__PURE__ */ c((t) => {
      if (!Ue(t)) return;
      const n = C(this, V, Ks).call(this);
      if (!n || n.id !== t.id) return;
      C(this, V, ga).call(this, t) && C(this, V, _t).call(this);
    }, "#handleSceneUpdate"));
  }
  registerHooks() {
    f(this, Lr) || (L(this, Lr, !0), Hooks.on("pauseGame", f(this, fo)), Hooks.on("combatStart", f(this, mo)), Hooks.on("combatRound", f(this, ho)), Hooks.on("combatEnd", f(this, go)), Hooks.on("deleteCombat", f(this, po)), Hooks.on("updateCombat", f(this, yo)), Hooks.on("canvasReady", f(this, bo)), Hooks.on("updateScene", f(this, vo)));
  }
  initialize() {
    f(this, Ir) || (L(this, Ir, !0), L(this, co, Vu((t) => {
      const n = !!t, i = n !== f(this, vt);
      L(this, vt, n), N("GameTimeAutomation | Manage time toggled", { enabled: n }), i && n && C(this, V, zs).call(this), C(this, V, _t).call(this);
    })), L(this, uo, Lm((t) => {
      L(this, Tr, t), N("GameTimeAutomation | Seconds per round updated", { value: t });
    })), C(this, V, zs).call(this), C(this, V, ga).call(this), C(this, V, _t).call(this));
  }
};
vt = new WeakMap(), Tr = new WeakMap(), wt = new WeakMap(), dn = new WeakMap(), Xn = new WeakMap(), Dt = new WeakMap(), xi = new WeakMap(), co = new WeakMap(), uo = new WeakMap(), Lr = new WeakMap(), Ir = new WeakMap(), Qn = new WeakMap(), Ft = new WeakMap(), V = new WeakSet(), Us = /* @__PURE__ */ c(function() {
  var t;
  try {
    if (typeof ((t = globalThis.performance) == null ? void 0 : t.now) == "function")
      return globalThis.performance.now();
  } catch (n) {
    N("GameTimeAutomation | Failed to read high-resolution timestamp", {
      message: (n == null ? void 0 : n.message) ?? String(n)
    });
  }
  return Date.now();
}, "#currentTimestamp"), Si = /* @__PURE__ */ c(function() {
  var t;
  return !!((t = game == null ? void 0 : game.user) != null && t.isGM && game.user.active !== !1);
}, "#canControlTime"), ma = /* @__PURE__ */ c(function(t) {
  var i, r;
  if (!t) return !1;
  if (t.active === !0) return !0;
  if (t.active === !1) return !1;
  const n = (i = game == null ? void 0 : game.combats) == null ? void 0 : i.active;
  return (n == null ? void 0 : n.id) === t.id ? !0 : ((r = game == null ? void 0 : game.combat) == null ? void 0 : r.id) === t.id ? game.combat.active ?? !0 : !1;
}, "#isCombatDocumentActive"), Vs = /* @__PURE__ */ c(function(t) {
  return t ? typeof t.started == "boolean" ? t.started : (t.round ?? 0) > 0 : !1;
}, "#hasCombatStarted"), ha = /* @__PURE__ */ c(function() {
  var i;
  const t = Array.isArray((i = game == null ? void 0 : game.combats) == null ? void 0 : i.contents) ? game.combats.contents : [];
  for (const r of t)
    if (C(this, V, ma).call(this, r) && C(this, V, Vs).call(this, r))
      return !0;
  const n = game == null ? void 0 : game.combat;
  return !!(n && C(this, V, ma).call(this, n) && C(this, V, Vs).call(this, n));
}, "#isCombatRunning"), zs = /* @__PURE__ */ c(function() {
  var n;
  f(this, wt).clear();
  const t = Array.isArray((n = game == null ? void 0 : game.combats) == null ? void 0 : n.contents) ? game.combats.contents : [];
  for (const i of t)
    i != null && i.id && f(this, wt).set(i.id, Math.max(i.round ?? 0, 1));
}, "#hydrateRoundTracking"), _t = /* @__PURE__ */ c(function({ pausedOverride: t } = {}) {
  const n = typeof t == "boolean" ? t : !!(game != null && game.paused), i = f(this, vt), r = f(this, Ft), a = i && r, o = {
    manageTimeEnabled: i,
    sceneAllowsRealTime: r,
    effectiveEnabled: a,
    paused: n,
    canControl: C(this, V, Si).call(this),
    combatRunning: C(this, V, ha).call(this),
    overrideApplied: typeof t == "boolean"
  };
  if (N("GameTimeAutomation | Sync running state", o), !a || !C(this, V, Si).call(this)) {
    C(this, V, Gs).call(this);
    return;
  }
  C(this, V, rd).call(this);
}, "#syncRunningState"), rd = /* @__PURE__ */ c(function() {
  f(this, dn) === null && (L(this, Xn, C(this, V, Us).call(this)), L(this, dn, globalThis.setInterval(() => C(this, V, ad).call(this), 1e3)), N("GameTimeAutomation | Started real-time ticker"));
}, "#startRealTimeTicker"), Gs = /* @__PURE__ */ c(function() {
  f(this, dn) !== null && (globalThis.clearInterval(f(this, dn)), L(this, dn, null), N("GameTimeAutomation | Stopped real-time ticker")), L(this, Xn, null), L(this, Dt, 0), L(this, Qn, !1);
}, "#stopRealTimeTicker"), ad = /* @__PURE__ */ c(function() {
  if (!f(this, vt) || !f(this, Ft) || !C(this, V, Si).call(this)) {
    C(this, V, Gs).call(this);
    return;
  }
  const t = C(this, V, Us).call(this);
  if (typeof t != "number" || !Number.isFinite(t)) return;
  const n = f(this, Xn) ?? t, i = (t - n) / 1e3;
  if (L(this, Xn, t), !Number.isFinite(i) || i <= 0) return;
  const r = !!(game != null && game.paused), a = C(this, V, ha).call(this);
  if (r || a) {
    f(this, Qn) || N("GameTimeAutomation | Tick skipped", { paused: r, combatRunning: a }), L(this, Qn, !0), L(this, Dt, 0);
    return;
  }
  L(this, Qn, !1), N("GameTimeAutomation | Real-time tick", { deltaSeconds: i }), C(this, V, Ws).call(this, i);
}, "#tickRealTime"), Ws = /* @__PURE__ */ c(function(t) {
  if (!f(this, vt) || !f(this, Ft)) return;
  const n = Number(t);
  !Number.isFinite(n) || n <= 0 || (L(this, Dt, f(this, Dt) + n), !f(this, xi) && L(this, xi, C(this, V, od).call(this)));
}, "#queueAdvance"), od = /* @__PURE__ */ c(async function() {
  var t, n;
  for (; f(this, Dt) > 0; ) {
    if (!f(this, vt) || !f(this, Ft) || game != null && game.paused || !C(this, V, Si).call(this) || C(this, V, ha).call(this)) {
      L(this, Dt, 0);
      break;
    }
    const i = f(this, Dt);
    L(this, Dt, 0);
    try {
      if (typeof ((t = game == null ? void 0 : game.time) == null ? void 0 : t.advance) == "function")
        N("GameTimeAutomation | Advancing world time", { delta: i }), await game.time.advance(i), N("GameTimeAutomation | World time advanced", {
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
  L(this, xi, null);
}, "#flushAdvanceQueue"), fo = new WeakMap(), mo = new WeakMap(), ho = new WeakMap(), go = new WeakMap(), po = new WeakMap(), yo = new WeakMap(), Ks = /* @__PURE__ */ c(function() {
  const t = nr();
  return Ue(t) ? t : null;
}, "#getActiveSceneDocument"), sd = /* @__PURE__ */ c(function(t) {
  if (!Ue(t)) return !1;
  try {
    return !!t.getFlag(T, Cs);
  } catch (n) {
    return N("GameTimeAutomation | Failed to read scene real-time flag", {
      sceneId: (t == null ? void 0 : t.id) ?? null,
      message: (n == null ? void 0 : n.message) ?? String(n)
    }), !1;
  }
}, "#isSceneRealTimeAllowed"), ga = /* @__PURE__ */ c(function(t) {
  const n = Ue(t) ? t : C(this, V, Ks).call(this), i = C(this, V, sd).call(this, n), r = f(this, Ft);
  return L(this, Ft, i), r !== i ? (N("GameTimeAutomation | Scene real-time allowance changed", {
    sceneId: (n == null ? void 0 : n.id) ?? null,
    allows: i
  }), !0) : !1;
}, "#refreshSceneAutomationState"), bo = new WeakMap(), vo = new WeakMap(), c(wc, "GameTimeAutomation");
let Bs = wc;
var Du, fn, De, Zn, Qt, wo, ye, ld, cd, ud, dd, Eo, Ys, So, fd, Co, md, hd;
const Kt = class Kt extends Fn(Dn) {
  constructor(n = {}) {
    const { scene: i, trigger: r, triggerIndex: a, onSave: o, ...s } = n ?? {};
    super(s);
    A(this, ye);
    A(this, fn, null);
    A(this, De, null);
    A(this, Zn, null);
    A(this, Qt, null);
    A(this, wo, /* @__PURE__ */ c(() => {
      (this.rendered ?? this.isRendered ?? !1) && (L(this, Qt, C(this, ye, ld).call(this)), this.render({ force: !0 }));
    }, "#handleTimeFormatChange"));
    A(this, Eo, /* @__PURE__ */ c((n) => {
      var a, o;
      const i = n.currentTarget, r = i == null ? void 0 : i.closest("form");
      r && (N("Trigger action selection changed", {
        sceneId: ((a = this.scene) == null ? void 0 : a.id) ?? null,
        triggerId: ((o = this.trigger) == null ? void 0 : o.id) ?? null,
        actionId: (i == null ? void 0 : i.value) ?? null
      }), C(this, ye, Ys).call(this, i.value, r));
    }, "#onActionSelectChange"));
    A(this, So, /* @__PURE__ */ c((n) => {
      var u, d, m, h;
      n.preventDefault();
      const i = n.currentTarget, r = i == null ? void 0 : i.closest("form");
      if (!r) return;
      const a = (u = i.dataset) == null ? void 0 : u.target;
      if (!a) return;
      const o = typeof (CSS == null ? void 0 : CSS.escape) == "function" ? CSS.escape : (y) => y, s = r.querySelector(`[name="${o(a)}"]`);
      if (!s) return;
      N("Opening file picker for trigger", {
        sceneId: ((d = this.scene) == null ? void 0 : d.id) ?? null,
        triggerId: ((m = this.trigger) == null ? void 0 : m.id) ?? null,
        target: a
      }), new FilePicker({
        type: ((h = i.dataset) == null ? void 0 : h.type) || "audio",
        current: s.value,
        callback: /* @__PURE__ */ c((y) => {
          var p, g;
          s.value = y, s.dispatchEvent(new Event("change")), N("Trigger form file selected", {
            sceneId: ((p = this.scene) == null ? void 0 : p.id) ?? null,
            triggerId: ((g = this.trigger) == null ? void 0 : g.id) ?? null,
            target: a,
            path: y
          });
        }, "callback")
      }).render({ force: !0 });
    }, "#onFilePicker"));
    A(this, Co, /* @__PURE__ */ c(async (n) => {
      var r, a;
      n.preventDefault();
      const i = n.currentTarget;
      i instanceof HTMLFormElement && (N("Trigger form submitted", {
        sceneId: ((r = this.scene) == null ? void 0 : r.id) ?? null,
        triggerId: ((a = this.trigger) == null ? void 0 : a.id) ?? null
      }), await C(this, ye, md).call(this, i));
    }, "#onSubmit"));
    this.scene = i ?? null, this.trigger = r ?? null, this.triggerIndex = Number.isInteger(a) ? Number(a) : null, this.onSave = typeof o == "function" ? o : null, L(this, Zn, Yl(f(this, wo)));
  }
  async _prepareContext() {
    var n, i;
    Bi("TriggerFormApplication#_prepareContext", {
      sceneId: ((n = this.scene) == null ? void 0 : n.id) ?? null,
      triggerId: ((i = this.trigger) == null ? void 0 : i.id) ?? null,
      triggerIndex: this.triggerIndex
    });
    try {
      const r = this.trigger ?? { action: fa, data: {} }, a = r.action ?? fa, o = $c(r.time), s = o.format ?? "12h", l = s === "12h" ? Hm() : [], u = o.period ?? (l.length > 0 ? l[0].value : null), d = s === "12h" ? l.map((y) => ({
        ...y,
        selected: y.value === u
      })) : [], m = _c().map((y) => ({
        id: y.id,
        label: typeof y.label == "function" ? y.label() : y.label,
        selected: y.id === a
      })), h = _c().map((y) => {
        const p = y.id === r.action ? r : { ...r, action: y.id }, g = _m(p);
        return g ? {
          id: y.id,
          visible: y.id === a,
          content: g
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
        actionSections: h,
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
      Cn();
    }
  }
  _onRender(n, i) {
    var l, u, d;
    super._onRender(n, i);
    const r = this.element;
    if (!r) return;
    N("Trigger form rendered", {
      sceneId: ((l = this.scene) == null ? void 0 : l.id) ?? null,
      triggerId: ((u = this.trigger) == null ? void 0 : u.id) ?? null
    });
    const a = Array.from(((d = document == null ? void 0 : document.body) == null ? void 0 : d.classList) ?? []).find(
      (m) => m.startsWith("theme-")
    );
    a && r.classList.add(a);
    const o = r.querySelector("form");
    if (!o) return;
    C(this, ye, fd).call(this, o), C(this, ye, cd).call(this, o), o.addEventListener("submit", f(this, Co));
    const s = o.querySelector("[data-action-select]");
    s && (s.addEventListener("change", f(this, Eo)), C(this, ye, Ys).call(this, s.value, o)), o.querySelectorAll("[data-action-file-picker]").forEach((m) => {
      m.addEventListener("click", f(this, So));
    });
  }
  async close(n = {}) {
    var i;
    if ((i = f(this, fn)) == null || i.call(this), L(this, fn, null), L(this, De, null), L(this, Qt, null), typeof f(this, Zn) == "function")
      try {
        f(this, Zn).call(this);
      } catch (r) {
        console.error(`${T} | Failed to dispose trigger form time format subscription`, r);
      }
    return L(this, Zn, null), super.close(n);
  }
};
fn = new WeakMap(), De = new WeakMap(), Zn = new WeakMap(), Qt = new WeakMap(), wo = new WeakMap(), ye = new WeakSet(), ld = /* @__PURE__ */ c(function() {
  var s, l, u, d, m, h, y;
  const n = (l = (s = this.element) == null ? void 0 : s.querySelector) == null ? void 0 : l.call(s, "form");
  if (!(n instanceof HTMLFormElement)) return null;
  const i = Array.from(n.elements ?? []), r = [];
  for (const p of i)
    if ((p instanceof HTMLInputElement || p instanceof HTMLSelectElement || p instanceof HTMLTextAreaElement) && p.name && !(((u = p.dataset) == null ? void 0 : u.timeHidden) !== void 0 || ((d = p.dataset) == null ? void 0 : d.timeHour) !== void 0 || ((m = p.dataset) == null ? void 0 : m.timeMinute) !== void 0 || ((h = p.dataset) == null ? void 0 : h.timePeriod) !== void 0)) {
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
          values: Array.from(p.selectedOptions ?? []).map((g) => g.value)
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
    const p = a.querySelector("[data-time-hidden]"), g = a.querySelector("[data-time-hour]"), v = a.querySelector("[data-time-minute]"), b = a.querySelector("[data-time-period]");
    o = {
      format: ((y = a.dataset) == null ? void 0 : y.timeFormat) ?? null,
      canonical: p instanceof HTMLInputElement ? p.value : "",
      hour: g instanceof HTMLInputElement ? g.value : "",
      minute: v instanceof HTMLInputElement ? v.value : "",
      period: b instanceof HTMLSelectElement ? b.value : ""
    };
  }
  return {
    fields: r,
    time: o
  };
}, "#captureFormState"), cd = /* @__PURE__ */ c(function(n) {
  if (!f(this, Qt)) return;
  if (!(n instanceof HTMLFormElement)) {
    L(this, Qt, null);
    return;
  }
  const { fields: i = [], time: r = null } = f(this, Qt) ?? {};
  L(this, Qt, null), C(this, ye, ud).call(this, n, i), C(this, ye, dd).call(this, n, r);
}, "#restorePendingFormState"), ud = /* @__PURE__ */ c(function(n, i) {
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
}, "#restoreFieldValues"), dd = /* @__PURE__ */ c(function(n, i) {
  var w, S, I;
  const r = n.querySelector("[data-time-format]");
  if (!(r instanceof HTMLElement)) {
    typeof f(this, De) == "function" && f(this, De).call(this);
    return;
  }
  const a = ((w = r.dataset) == null ? void 0 : w.timeFormat) === "24h" ? "24h" : "12h", o = r.querySelector("[data-time-hour]"), s = r.querySelector("[data-time-minute]"), l = r.querySelector("[data-time-period]"), u = r.querySelector("[data-time-hidden]");
  if (!i) {
    if (o instanceof HTMLInputElement && (o.value = ""), s instanceof HTMLInputElement && (s.value = ""), l instanceof HTMLSelectElement) {
      const O = ((I = (S = l.options) == null ? void 0 : S[0]) == null ? void 0 : I.value) ?? "";
      l.value = O;
    }
    u instanceof HTMLInputElement && (u.value = ""), typeof f(this, De) == "function" && f(this, De).call(this);
    return;
  }
  const d = typeof i.canonical == "string" ? i.canonical : "", m = typeof i.period == "string" ? i.period : "", h = typeof i.hour == "string" ? i.hour : "", y = typeof i.minute == "string" ? i.minute : "";
  let p = "", g = "", v = m, b = d;
  if (d) {
    const O = $c(d, a);
    p = O.hour ?? "", g = O.minute ?? "", b = O.canonical ?? d, a === "12h" ? v = O.period ?? m : v = "";
  } else
    p = h, g = y, a !== "12h" && (v = "");
  if (o instanceof HTMLInputElement && (o.value = p ?? ""), s instanceof HTMLInputElement && (s.value = g ?? ""), l instanceof HTMLSelectElement)
    if (a === "12h") {
      const O = Array.from(l.options ?? []);
      O.find((M) => M.value === v) ? l.value = v : O.length > 0 ? l.value = O[0].value : l.value = "";
    } else
      l.value = "";
  u instanceof HTMLInputElement && (u.value = b ?? ""), typeof f(this, De) == "function" && f(this, De).call(this);
}, "#restoreTimeInputs"), Eo = new WeakMap(), Ys = /* @__PURE__ */ c(function(n, i) {
  i && i.querySelectorAll("[data-action-config]").forEach((r) => {
    const a = r.dataset.actionConfig === n;
    r.style.display = a ? "" : "none";
  });
}, "#updateActionSections"), So = new WeakMap(), fd = /* @__PURE__ */ c(function(n) {
  var m, h, y, p;
  if ((m = f(this, fn)) == null || m.call(this), L(this, fn, null), L(this, De, null), !(n instanceof HTMLFormElement)) return;
  const i = n.querySelector("[data-time-format]"), r = ((h = i == null ? void 0 : i.dataset) == null ? void 0 : h.timeFormat) ?? null;
  if (r !== "12h" && r !== "24h")
    return;
  const a = i.querySelector("[data-time-hidden]"), o = i.querySelector("[data-time-hour]"), s = i.querySelector("[data-time-minute]"), l = r === "12h" ? i.querySelector("[data-time-period]") : null;
  if (!a || !o || !s || r === "12h" && !l) {
    N("Trigger form time inputs missing elements", {
      format: r,
      hasHidden: !!a,
      hasHour: !!o,
      hasMinute: !!s,
      hasPeriod: !!l
    });
    return;
  }
  const u = [o, s, ...l ? [l] : []], d = /* @__PURE__ */ c(() => {
    const { canonical: g, error: v } = Rm(
      {
        hour: o.value,
        minute: s.value,
        period: (l == null ? void 0 : l.value) ?? null,
        time: a.value
      },
      r
    );
    a.value = g ?? "";
    const b = v ?? "";
    a.setCustomValidity(b), u.forEach((w) => {
      w.setCustomValidity(b);
    });
  }, "update");
  u.forEach((g) => {
    g.addEventListener("input", d), g.addEventListener("change", d);
  }), d(), L(this, fn, () => {
    u.forEach((g) => {
      g.removeEventListener("input", d), g.removeEventListener("change", d);
    });
  }), L(this, De, d), N("Trigger form configured for time input", {
    format: r,
    sceneId: ((y = this.scene) == null ? void 0 : y.id) ?? null,
    triggerId: ((p = this.trigger) == null ? void 0 : p.id) ?? null
  });
}, "#setupTimeInput"), Co = new WeakMap(), md = /* @__PURE__ */ c(async function(n) {
  var a, o, s, l, u;
  if (typeof f(this, De) == "function" && f(this, De).call(this), typeof n.checkValidity == "function" && !n.checkValidity()) {
    typeof n.reportValidity == "function" && n.reportValidity(), N("Trigger form submission blocked by validity check", {
      sceneId: ((a = this.scene) == null ? void 0 : a.id) ?? null,
      triggerId: ((o = this.trigger) == null ? void 0 : o.id) ?? null
    });
    return;
  }
  const i = new FormData(n), r = Object.fromEntries(i.entries());
  delete r.timeHour, delete r.timeMinute, delete r.timePeriod, r.allowReplayOnRewind = ((s = n.querySelector('input[name="allowReplayOnRewind"]')) == null ? void 0 : s.checked) ?? !1, N("Processing trigger form submission", {
    sceneId: ((l = this.scene) == null ? void 0 : l.id) ?? null,
    triggerId: ((u = this.trigger) == null ? void 0 : u.id) ?? null,
    allowReplayOnRewind: r.allowReplayOnRewind
  }), await C(this, ye, hd).call(this, r), await this.close();
}, "#handleSubmit"), hd = /* @__PURE__ */ c(async function(n) {
  var a, o, s, l, u, d;
  const i = {
    id: ((a = this.trigger) == null ? void 0 : a.id) ?? vm(),
    time: n.time ?? "",
    action: n.action ?? fa,
    allowReplayOnRewind: !!n.allowReplayOnRewind,
    data: {}
  };
  N("Persisting trigger from form", {
    sceneId: ((o = this.scene) == null ? void 0 : o.id) ?? null,
    triggerId: i.id,
    existingIndex: this.triggerIndex
  }), $m(i, n);
  const r = Ni(this.scene);
  this.triggerIndex !== null && r[this.triggerIndex] ? r[this.triggerIndex] = i : r.push(i);
  try {
    await Wu(this.scene, r), N("Trigger list saved", {
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
      console.error(`${T} | Trigger onSave callback failed`, m), N("Trigger onSave callback failed", {
        sceneId: ((d = this.scene) == null ? void 0 : d.id) ?? null,
        message: (m == null ? void 0 : m.message) ?? String(m)
      });
    }
}, "#persistTrigger"), c(Kt, "TriggerFormApplication"), pe(Kt, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  $e(Kt, Kt, "DEFAULT_OPTIONS"),
  {
    id: `${T}-trigger-form`,
    classes: Array.from(
      /* @__PURE__ */ new Set([...((Du = $e(Kt, Kt, "DEFAULT_OPTIONS")) == null ? void 0 : Du.classes) ?? [], "standard-form", "themed"])
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
)), pe(Kt, "PARTS", {
  content: {
    template: `modules/${T}/templates/time-trigger-form.html`
  }
});
let Js = Kt;
function kt(e) {
  return e instanceof HTMLElement ? e : (e == null ? void 0 : e[0]) instanceof HTMLElement ? e[0] : null;
}
c(kt, "asHTMLElement");
function pa(e) {
  return typeof (e == null ? void 0 : e.changeTab) == "function";
}
c(pa, "isAppV2");
function gd(e, t, n, i = {}) {
  if (pa(e)) {
    e.changeTab(t, n, i);
    return;
  }
  if (typeof (e == null ? void 0 : e.activateTab) == "function") {
    const r = { ...i };
    n != null && (r.group = n), r.triggerCallback == null && (r.triggerCallback = !0), e.activateTab(t, r);
  }
}
c(gd, "setActiveTab");
function jm(e) {
  var n, i;
  if (!(e instanceof HTMLFormElement)) return {};
  const t = ((i = (n = foundry == null ? void 0 : foundry.applications) == null ? void 0 : n.ux) == null ? void 0 : i.FormDataExtended) ?? globalThis.FormDataExtended ?? null;
  if (!t) return {};
  try {
    const r = new t(e), a = typeof r.object == "object" ? r.object : {};
    return foundry.utils.expandObject(a);
  } catch {
    return {};
  }
}
c(jm, "readFormData");
const Fc = Symbol.for("eidolon.sceneConfig.v13PatchedTabs");
function pd(e = {}) {
  const {
    tabId: t,
    tabLabel: n,
    getScene: i,
    isApplicable: r,
    renderContent: a,
    debugNamespace: o = "SceneConfigTab",
    onButtonCreate: s,
    onTabCreate: l,
    onAfterRender: u,
    logger: d = {},
    moduleId: m = "eidolon-utilities",
    tabIcon: h = "fa-solid fa-puzzle-piece"
  } = e ?? {};
  if (!t)
    throw new Error("createSceneConfigTabFactory requires a tabId.");
  if (typeof a != "function")
    throw new TypeError("createSceneConfigTabFactory requires a renderContent callback.");
  const y = typeof d.log == "function" ? d.log.bind(d) : (..._) => {
    var H;
    return (H = console.debug) == null ? void 0 : H.call(console, `${o}`, ..._);
  }, p = typeof d.group == "function" ? d.group.bind(d) : (..._) => {
    var H;
    return (H = console.groupCollapsed) == null ? void 0 : H.call(console, `${o}`, ..._);
  }, g = typeof d.groupEnd == "function" ? d.groupEnd.bind(d) : () => {
    var _;
    return (_ = console.groupEnd) == null ? void 0 : _.call(console);
  }, v = Symbol(`EIDOLON_SCENE_CONFIG_TAB_CLEANUP_${t}`), b = typeof i == "function" ? i : () => null, w = typeof r == "function" ? r : () => !0, S = typeof n == "function" ? n : () => typeof n == "string" ? n : t;
  function I() {
    var W, q, U, J, ae;
    const _ = ((q = (W = foundry == null ? void 0 : foundry.applications) == null ? void 0 : W.sheets) == null ? void 0 : q.SceneConfig) ?? ((U = CONFIG == null ? void 0 : CONFIG.Scene) == null ? void 0 : U.sheetClass);
    if (!_ || !pa({ changeTab: (J = _.prototype) == null ? void 0 : J.changeTab })) return;
    const H = _[Fc] ?? /* @__PURE__ */ new Set();
    if (H.has(t)) return;
    H.add(t), _[Fc] = H;
    const B = (ae = _.TABS) == null ? void 0 : ae.sheet;
    if (B && Array.isArray(B.tabs) && !B.tabs.some((Q) => Q.id === t)) {
      const Q = S({ app: null, scene: null }) ?? t;
      B.tabs.push({
        id: t,
        icon: h,
        label: Q
      });
    }
    _.PARTS && !_.PARTS[t] && (_.PARTS[t] = {
      template: `modules/${m}/templates/scene-config-tab-mount.hbs`,
      scrollable: [`.tab[data-tab="${t}"]`]
    }), y("Patched v13 SceneConfig TABS/PARTS", { tabId: t });
  }
  c(I, "patchV13SceneConfig");
  function O(_, H) {
    var W, q;
    const B = b(_);
    if (!w(_, B)) {
      y("Skipped render", {
        tabId: t,
        reason: "inapplicable",
        constructor: ((W = _ == null ? void 0 : _.constructor) == null ? void 0 : W.name) ?? null
      });
      return;
    }
    p("render", {
      tabId: t,
      sceneId: (B == null ? void 0 : B.id) ?? null,
      constructor: ((q = _ == null ? void 0 : _.constructor) == null ? void 0 : q.name) ?? null
    });
    try {
      const U = kt(H) ?? kt(_.element);
      if (!U) {
        y("Missing root element", { tabId: t });
        return;
      }
      pa(_) ? x(_, U, B) : M(_, U, B);
    } finally {
      g();
    }
  }
  c(O, "handleRender");
  function k(_, H, B) {
    var U;
    if (!h) {
      _.textContent = H;
      return;
    }
    const W = (U = _.querySelector("i")) == null ? void 0 : U.cloneNode(!0);
    _.textContent = "";
    const q = W ?? document.createElement("i");
    if (W || (q.className = h, B && (q.inert = !0)), _.append(q, " "), B) {
      const J = document.createElement("span");
      J.textContent = H, _.append(J);
    } else
      _.append(document.createTextNode(H));
  }
  c(k, "setButtonContent");
  function M(_, H, B) {
    var et, Ut, ze, Ce, bi, Vt, Pn, tt, zt, P, Yr, X, mt, Oe, Yi, Xr;
    const q = [
      "nav.sheet-tabs[data-group]",
      "nav.tabs[data-group]",
      "nav.sheet-tabs",
      "nav.tabs"
    ].map((Ae) => H.querySelector(Ae)).find((Ae) => Ae instanceof HTMLElement), J = [
      (et = H.querySelector(".tab[data-tab]")) == null ? void 0 : et.parentElement,
      H.querySelector(".sheet-body"),
      (ze = (Ut = q == null ? void 0 : q.parentElement) == null ? void 0 : Ut.querySelector) == null ? void 0 : ze.call(Ut, ":scope > .sheet-body"),
      q == null ? void 0 : q.parentElement
    ].find((Ae) => Ae instanceof HTMLElement), ae = ((Ce = q == null ? void 0 : q.dataset) == null ? void 0 : Ce.group) ?? ((Pn = (Vt = (bi = q == null ? void 0 : q.querySelector) == null ? void 0 : bi.call(q, "a[data-group]")) == null ? void 0 : Vt.dataset) == null ? void 0 : Pn.group) ?? ((P = (zt = (tt = q == null ? void 0 : q.querySelector) == null ? void 0 : tt.call(q, "[data-group]")) == null ? void 0 : zt.dataset) == null ? void 0 : P.group) ?? ((mt = (X = (Yr = J == null ? void 0 : J.querySelector) == null ? void 0 : Yr.call(J, ".tab[data-group]")) == null ? void 0 : X.dataset) == null ? void 0 : mt.group) ?? "main";
    if (!q || !J) {
      y("Missing navigation elements", {
        tabId: t,
        hasNav: !!q,
        hasBody: !!J
      });
      return;
    }
    let Q = q.querySelector(`[data-tab="${t}"]`);
    if (!Q) {
      Q = document.createElement("a"), Q.dataset.action = "tab", Q.dataset.group = ae, Q.dataset.tab = t;
      const Ae = q.querySelector("a[data-tab]");
      (Oe = Ae == null ? void 0 : Ae.classList) != null && Oe.contains("item") && Q.classList.add("item"), q.appendChild(Q), typeof s == "function" && s({ app: _, button: Q, nav: q, scene: B }), y("Created tab button", { tabId: t, group: ae });
    }
    k(Q, S({ app: _, scene: B }) ?? t, pa(_));
    let te = J.querySelector(`.tab[data-tab="${t}"]`);
    if (!te) {
      te = document.createElement("div"), te.classList.add("tab"), te.dataset.tab = t, te.dataset.group = ae;
      const Ae = yd(J);
      J.insertBefore(te, Ae ?? null), typeof l == "function" && l({ app: _, tab: te, body: J, scene: B }), y("Created tab container", { tabId: t, group: ae });
    }
    ((Yi = Q.classList) == null ? void 0 : Yi.contains("active")) || te.classList.contains("active") ? (Q.classList.add("active"), te.classList.add("active"), te.removeAttribute("hidden")) : (Q.classList.remove("active"), te.classList.remove("active"), te.setAttribute("hidden", "true"));
    const ft = /* @__PURE__ */ c(() => {
      var Rn, Xi;
      ((Rn = Q.classList) != null && Rn.contains("active") || te.classList.contains("active")) && ((Xi = Q.classList) == null || Xi.add("active"), te.classList.add("active"), te.removeAttribute("hidden"), te.removeAttribute("aria-hidden"), te.style.display === "none" && (te.style.display = ""));
    }, "ensureTabVisible"), _e = /* @__PURE__ */ c(() => {
      ft(), requestAnimationFrame(ft);
    }, "scheduleEnsureTabVisible");
    Q.dataset.eidolonEnsureSceneTabVisibility || (Q.addEventListener("click", () => {
      gd(_, t, ae), requestAnimationFrame(ft);
    }), Q.dataset.eidolonEnsureSceneTabVisibility = "true"), rs(_, v, y);
    const Ze = a({
      app: _,
      scene: B,
      tab: te,
      tabButton: Q,
      ensureTabVisible: ft,
      scheduleEnsureTabVisible: _e
    });
    typeof Ze == "function" && xc(_, v, Ze), typeof u == "function" && u({
      app: _,
      scene: B,
      tab: te,
      tabButton: Q,
      ensureTabVisible: ft,
      scheduleEnsureTabVisible: _e
    }), (Xr = _.setPosition) == null || Xr.call(_, { height: "auto" });
  }
  c(M, "handleRenderV1");
  function x(_, H, B) {
    const W = H.querySelector(`.tab[data-tab="${t}"]`), q = H.querySelector(`nav [data-tab="${t}"]`);
    if (!W || !q) {
      y("v2 mount not found, falling back to v1 injection", { tabId: t }), M(_, H, B);
      return;
    }
    k(q, S({ app: _, scene: B }) ?? t, !0);
    const U = /* @__PURE__ */ c(() => {
      var Q;
      !((Q = q.classList) != null && Q.contains("active")) && !W.classList.contains("active") || (W.classList.add("active"), W.removeAttribute("hidden"), W.removeAttribute("aria-hidden"), W.style.display === "none" && (W.style.display = ""));
    }, "ensureTabVisible"), J = /* @__PURE__ */ c(() => {
      U(), requestAnimationFrame(U);
    }, "scheduleEnsureTabVisible");
    rs(_, v, y);
    const ae = a({
      app: _,
      scene: B,
      tab: W,
      tabButton: q,
      ensureTabVisible: U,
      scheduleEnsureTabVisible: J
    });
    typeof ae == "function" && xc(_, v, ae), typeof u == "function" && u({
      app: _,
      scene: B,
      tab: W,
      tabButton: q,
      ensureTabVisible: U,
      scheduleEnsureTabVisible: J
    });
  }
  c(x, "handleRenderV2");
  function R(_) {
    rs(_, v, y);
  }
  c(R, "handleClose");
  function F() {
    return Hooks.once("init", () => {
      I();
    }), Hooks.on("renderSceneConfig", O), Hooks.on("closeSceneConfig", R), () => D();
  }
  c(F, "register");
  function D() {
    Hooks.off("renderSceneConfig", O), Hooks.off("closeSceneConfig", R);
  }
  return c(D, "unregister"), { register: F, unregister: D };
}
c(pd, "createSceneConfigTabFactory");
function xc(e, t, n) {
  if (!e || typeof n != "function") return;
  const i = e == null ? void 0 : e[t];
  Array.isArray(i) || (e[t] = []), e[t].push(n);
}
c(xc, "registerCleanup");
function rs(e, t, n) {
  if (!e) return;
  const i = e == null ? void 0 : e[t];
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
c(rs, "invokeCleanup");
function yd(e) {
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
c(yd, "findFooterElement");
const Bm = Do(Js), Um = `modules/${T}/templates/time-trigger-scene-tab.html`, Vm = pd({
  tabId: "time-triggers",
  tabLabel: /* @__PURE__ */ c(() => E("EIDOLON.TimeTrigger.Tab", "Time Triggers"), "tabLabel"),
  getScene: jt,
  isApplicable: Km,
  renderContent: /* @__PURE__ */ c(({ app: e, scene: t, tab: n }) => Gm(e, n, t), "renderContent"),
  logger: {
    log: N,
    group: Bi,
    groupEnd: Cn
  }
});
function zm() {
  return N("Registering SceneConfig render hook"), Vm.register();
}
c(zm, "registerSceneConfigHook");
function Gm(e, t, n) {
  if (!(t instanceof HTMLElement)) return;
  const i = Ue(n) ? n : jt(e);
  Da(e, t, i);
  const r = Yl(() => {
    Da(e, t, i);
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
c(Gm, "renderTimeTriggerTab");
async function Da(e, t, n) {
  var r, a;
  const i = n ?? jt(e);
  Bi("renderTimeTriggersTabContent", { sceneId: (i == null ? void 0 : i.id) ?? null });
  try {
    if (!Ue(i)) {
      const W = E(
        "EIDOLON.TimeTrigger.Unavailable",
        "Time triggers are unavailable for this configuration sheet."
      );
      t.innerHTML = `<p class="notes">${W}</p>`, N("Scene lacks document for time triggers", { sceneId: (i == null ? void 0 : i.id) ?? null });
      return;
    }
    const o = `flags.${T}.${ka}`, s = `flags.${T}.${Es}`, l = `flags.${T}.${Ss}`, u = !!i.getFlag(T, ka), d = !!i.getFlag(T, Es), m = !!i.getFlag(T, Ss), h = Ni(i);
    N("Rendering time trigger list", {
      sceneId: i.id,
      isActive: u,
      shouldHideWindow: d,
      shouldShowPlayerWindow: m,
      triggerCount: h.length
    });
    const y = E("EIDOLON.TimeTrigger.Activate", "Activate Time Trigger"), p = E(
      "EIDOLON.TimeTrigger.Description",
      "Enable scene time triggers so scheduled actions can run automatically."
    ), g = E(
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
    ), S = E(
      "EIDOLON.TimeTrigger.TriggerListLabel",
      "Scene Time Triggers"
    ), I = E(
      "EIDOLON.TimeTrigger.TriggerListEmpty",
      "No time triggers configured for this scene."
    ), O = E("EIDOLON.TimeTrigger.AddTrigger", "Add Trigger"), k = E("EIDOLON.TimeTrigger.EditTrigger", "Edit"), M = E("EIDOLON.TimeTrigger.DeleteTrigger", "Remove"), x = E("EIDOLON.TimeTrigger.TriggerNow", "Trigger Now"), R = E("EIDOLON.TimeTrigger.AtLabel", "At"), F = E("EIDOLON.TimeTrigger.DoLabel", "Do"), D = E("EIDOLON.TimeTrigger.MissingTime", "(No time set)"), _ = h.map((W, q) => {
      const ae = (W.time ? Pm(W.time) : "") || W.time || "" || D, Q = Mm(W.action), te = [
        `${R} ${ae}`,
        `${F} ${Q}`,
        ...Nm(W)
      ];
      return {
        index: q,
        summaryParts: te,
        tooltips: {
          triggerNow: x,
          edit: k,
          delete: M
        }
      };
    }), H = ((a = (r = foundry == null ? void 0 : foundry.applications) == null ? void 0 : r.handlebars) == null ? void 0 : a.renderTemplate) ?? (typeof renderTemplate == "function" ? renderTemplate : globalThis == null ? void 0 : globalThis.renderTemplate);
    if (typeof H != "function") {
      console.error(`${T} | renderTemplate is unavailable; cannot render scene tab.`), t.innerHTML = `<p class="notes">${I}</p>`;
      return;
    }
    let B = "";
    try {
      B = await H(Um, {
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
          activate: y,
          hideWindow: g,
          showPlayerWindow: b,
          triggerList: S,
          empty: I,
          add: O
        },
        hints: {
          activate: p,
          hideWindow: v,
          showPlayerWindow: w
        },
        triggers: _,
        hasTriggers: _.length > 0
      });
    } catch (W) {
      console.error(`${T} | Failed to render time trigger scene tab template`, W), t.innerHTML = `<p class="notes">${I}</p>`;
      return;
    }
    t.innerHTML = B, Wm(e, t, i);
  } finally {
    Cn();
  }
}
c(Da, "renderTimeTriggersTabContent");
function Wm(e, t, n) {
  const i = n ?? jt(e);
  if (!Ue(i)) return;
  const r = t.querySelector('[data-action="add-trigger"]');
  r && r.addEventListener("click", () => {
    N("Add trigger button clicked", { sceneId: i.id }), Pc(e, { scene: i });
  }), t.querySelectorAll('[data-action="edit-trigger"]').forEach((a) => {
    a.addEventListener("click", () => {
      const o = Number(a.dataset.index);
      if (!Number.isInteger(o)) return;
      const l = Ni(i)[o];
      l && (N("Edit trigger button clicked", { sceneId: i.id, triggerId: l.id, index: o }), Pc(e, { trigger: l, triggerIndex: o, scene: i }));
    });
  }), t.querySelectorAll('[data-action="delete-trigger"]').forEach((a) => {
    a.addEventListener("click", async () => {
      var u, d;
      const o = Number(a.dataset.index);
      if (!Number.isInteger(o)) return;
      const s = Ni(i), l = s[o];
      if (l) {
        s.splice(o, 1);
        try {
          N("Deleting trigger", {
            sceneId: i.id,
            index: o,
            triggerId: (l == null ? void 0 : l.id) ?? null
          }), await Wu(i, s), await Da(e, t, i);
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
  }), t.querySelectorAll('[data-action="fire-trigger"]').forEach((a) => {
    a.addEventListener("click", async () => {
      var u, d, m, h, y, p, g;
      const o = Number(a.dataset.index);
      if (!Number.isInteger(o)) return;
      const l = Ni(i)[o];
      if (l) {
        if (!((u = game.user) != null && u.isGM)) {
          (m = (d = ui.notifications) == null ? void 0 : d.warn) == null || m.call(
            d,
            E("EIDOLON.TimeTrigger.GMOnly", "Only the GM can adjust time.")
          );
          return;
        }
        try {
          N("Manually firing trigger", { sceneId: i.id, triggerId: l.id, index: o }), await Ku(i, l), (y = (h = ui.notifications) == null ? void 0 : h.info) == null || y.call(
            h,
            E(
              "EIDOLON.TimeTrigger.TriggerNowSuccess",
              "Triggered the selected time trigger."
            )
          );
        } catch (v) {
          console.error(`${T} | Failed to execute time trigger manually`, v), (g = (p = ui.notifications) == null ? void 0 : p.error) == null || g.call(
            p,
            E(
              "EIDOLON.TimeTrigger.TriggerNowError",
              "Failed to execute the selected time trigger."
            )
          ), N("Manual trigger execution failed", {
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
c(Wm, "bindTimeTriggerTabEvents");
function Pc(e, t = {}) {
  var o;
  const n = t.scene ?? null, i = n && Ue(n) ? n : jt(e);
  if (!Ue(i)) {
    console.warn(`${T} | Unable to open trigger form because no scene document is available.`);
    return;
  }
  N("Opening trigger form", {
    sceneId: i.id,
    triggerId: ((o = t.trigger) == null ? void 0 : o.id) ?? null,
    index: Number.isInteger(t.triggerIndex) ? Number(t.triggerIndex) : null
  }), Bm({
    scene: i,
    trigger: t.trigger ?? null,
    triggerIndex: t.triggerIndex ?? null,
    onSave: /* @__PURE__ */ c(() => {
      var l, u;
      const s = (u = (l = e.element) == null ? void 0 : l[0]) == null ? void 0 : u.querySelector('.tab[data-tab="time-triggers"]');
      s && Da(e, s, i);
    }, "onSave")
  }).render({ force: !0 });
}
c(Pc, "openTriggerForm");
function Km(e, t) {
  var a, o, s, l, u;
  if (!e) return !1;
  const n = ((o = (a = foundry == null ? void 0 : foundry.applications) == null ? void 0 : a.sheets) == null ? void 0 : o.SceneConfig) ?? (globalThis == null ? void 0 : globalThis.SceneConfig);
  if (n && e instanceof n) return !0;
  const i = (s = e == null ? void 0 : e.constructor) == null ? void 0 : s.name;
  if (typeof i == "string" && i.includes("SceneConfig")) return !0;
  if (t) {
    const d = globalThis == null ? void 0 : globalThis.Scene;
    if (d && t instanceof d || (t == null ? void 0 : t.documentName) === "Scene" || (t == null ? void 0 : t.documentName) === "scenes" || (t == null ? void 0 : t.collection) === "scenes") return !0;
  }
  const r = ((l = e == null ? void 0 : e.options) == null ? void 0 : l.baseApplication) ?? ((u = e == null ? void 0 : e.options) == null ? void 0 : u.id);
  return !!(typeof r == "string" && r.includes("SceneConfig"));
}
c(Km, "isRecognizedSceneConfig");
const ta = new js(), Rc = new Bs();
function Jm() {
  N("Registering time trigger hooks"), Hooks.once("init", () => {
    wm(), Im(), N("Time trigger settings registered during init");
  }), zm(), N("Scene config hook registered"), Rc.registerHooks(), N("Time automation hooks registered"), Hooks.once("ready", () => {
    Om(), N("Ready hook fired"), ta.onReady(), Rc.initialize();
  }), Hooks.on("canvasReady", (e) => {
    var t;
    N("canvasReady hook received", { scene: ((t = e == null ? void 0 : e.scene) == null ? void 0 : t.id) ?? null }), ta.onCanvasReady(e);
  }), Hooks.on("updateScene", (e) => {
    N("updateScene hook received", { scene: (e == null ? void 0 : e.id) ?? null }), ta.onUpdateScene(e);
  }), Hooks.on("updateWorldTime", (e, t) => {
    N("updateWorldTime hook received", { worldTime: e, diff: t }), ta.onUpdateWorldTime(e, t);
  });
}
c(Jm, "registerTimeTriggerHooks");
Jm();
const we = T, bd = "criteria", Ql = "state", Ym = "criteriaVersion", Xm = 1, vd = "enableCriteriaSurfaces";
let Hc = !1;
function Qm() {
  var e;
  if (!Hc) {
    if (Hc = !0, !((e = game == null ? void 0 : game.settings) != null && e.register)) {
      console.warn(`${we} | game.settings.register unavailable; scene criteria setting skipped.`);
      return;
    }
    game.settings.register(we, vd, {
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
        Zm();
      }, "onChange")
    });
  }
}
c(Qm, "registerSceneCriteriaSettings");
function Fo() {
  var e;
  try {
    if ((e = game == null ? void 0 : game.settings) != null && e.get)
      return !!game.settings.get(we, vd);
  } catch (t) {
    console.error(`${we} | Failed to read criteria surfaces setting`, t);
  }
  return !0;
}
c(Fo, "getCriteriaSurfacesEnabled");
function Zm() {
  var a, o, s, l, u;
  const e = E("EIDOLON.SceneCriteria.ReloadPromptTitle", "Reload Required"), t = `<p>${E(
    "EIDOLON.SceneCriteria.ReloadPromptBody",
    "Changes to criteria editor surfaces require a reload. Reload now?"
  )}</p>`, n = typeof ((a = foundry == null ? void 0 : foundry.utils) == null ? void 0 : a.debouncedReload) == "function", i = /* @__PURE__ */ c(() => {
    n ? foundry.utils.debouncedReload() : window.location.reload();
  }, "reload"), r = (s = (o = foundry == null ? void 0 : foundry.applications) == null ? void 0 : o.api) == null ? void 0 : s.DialogV2;
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
c(Zm, "promptReloadForCriteriaSurfaces");
const Fa = "Standard";
function ut(e) {
  var n;
  const t = (n = e == null ? void 0 : e.getFlag) == null ? void 0 : n.call(e, we, bd);
  return t ? wd(t) : [];
}
c(ut, "getSceneCriteria");
async function xo(e, t) {
  if (!(e != null && e.setFlag)) return;
  const n = wd(t);
  await e.setFlag(we, bd, n), await e.setFlag(we, Ym, Xm);
  const i = Gr(e, n);
  await e.setFlag(we, Ql, i);
}
c(xo, "setSceneCriteria");
function Gr(e, t = null) {
  var r;
  const n = Array.isArray(t) ? t : ut(e), i = qt(((r = e == null ? void 0 : e.getFlag) == null ? void 0 : r.call(e, we, Ql)) ?? {});
  return ec(i, n);
}
c(Gr, "getSceneCriteriaState");
async function eh(e, t, n = null) {
  if (!(e != null && e.setFlag)) return;
  const i = Array.isArray(n) ? n : ut(e), r = ec(t, i);
  await e.setFlag(we, Ql, r);
}
c(eh, "setSceneCriteriaState");
function Zl(e = "") {
  const t = typeof e == "string" ? e.trim() : "", n = Ed(Qs(t || "criterion"), /* @__PURE__ */ new Set());
  return {
    id: Sd(),
    key: n,
    label: t,
    values: [Fa],
    default: Fa,
    order: 0
  };
}
c(Zl, "createSceneCriterion");
function wd(e) {
  const t = Array.isArray(e) ? qt(e) : [], n = [], i = /* @__PURE__ */ new Set();
  return t.forEach((r, a) => {
    const o = Xs(r, a, i);
    o && (n.push(o), i.add(o.key));
  }), n;
}
c(wd, "sanitizeCriteria$1");
function Xs(e, t = 0, n = /* @__PURE__ */ new Set()) {
  if (!e || typeof e != "object") return null;
  const i = typeof e.id == "string" && e.id.trim() ? e.id.trim() : Sd(), a = (typeof e.label == "string" ? e.label : typeof e.name == "string" ? e.name : "").trim(), o = typeof e.key == "string" && e.key.trim() ? Qs(e.key) : Qs(a || `criterion-${Number(t) + 1}`), s = Ed(o, n), l = nh(e.values);
  let u = typeof e.default == "string" ? e.default.trim() : "";
  u || (u = l[0] ?? Fa), l.includes(u) || l.unshift(u);
  const d = Number.isFinite(e.order) ? Number(e.order) : Number(t);
  return {
    id: i,
    key: s,
    label: a,
    values: l,
    default: u,
    order: d
  };
}
c(Xs, "sanitizeCriterion");
function ec(e, t = []) {
  const n = e && typeof e == "object" ? qt(e) : {}, i = {};
  for (const r of t) {
    const a = n == null ? void 0 : n[r.key], o = typeof a == "string" ? a.trim() : "";
    o && r.values.includes(o) ? i[r.key] = o : i[r.key] = r.default;
  }
  return i;
}
c(ec, "sanitizeSceneCriteriaState");
function th(e) {
  return ut(e).map((n) => ({
    id: n.key,
    key: n.key,
    name: n.label,
    values: [...n.values]
  }));
}
c(th, "getSceneCriteriaCategories");
function nh(e) {
  const t = Array.isArray(e) ? e : [], n = [];
  for (const i of t) {
    if (typeof i != "string") continue;
    const r = i.trim();
    !r || n.includes(r) || n.push(r);
  }
  return n.length || n.push(Fa), n;
}
c(nh, "sanitizeCriterionValues");
function Qs(e) {
  return String(e ?? "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "criterion";
}
c(Qs, "slugifyCriterionKey");
function Ed(e, t) {
  if (!t.has(e)) return e;
  let n = 2;
  for (; t.has(`${e}-${n}`); )
    n += 1;
  return `${e}-${n}`;
}
c(Ed, "ensureUniqueCriterionKey");
function Sd() {
  var e;
  return (e = foundry == null ? void 0 : foundry.utils) != null && e.randomID ? foundry.utils.randomID() : typeof (crypto == null ? void 0 : crypto.randomUUID) == "function" ? crypto.randomUUID() : Math.random().toString(36).slice(2, 11);
}
c(Sd, "generateCriterionId");
function Cd(e) {
  var t, n;
  console.error(`${we} | Failed to persist scene criteria`, e), (n = (t = ui.notifications) == null ? void 0 : t.error) == null || n.call(
    t,
    E(
      "EIDOLON.SceneCriteria.PersistError",
      "Failed to persist the scene criteria."
    )
  );
}
c(Cd, "notifyPersistError");
var Fu, me, Zt, Ne, Td, To, Lo, Io, Oo, ya, Ao, Or, Ar, ir, Ld;
const Jt = class Jt extends Fn(Dn) {
  constructor(n = {}) {
    const { scene: i, criterion: r, isNew: a, onSave: o, ...s } = n ?? {};
    super(s);
    A(this, Ne);
    A(this, me, null);
    A(this, Zt, !1);
    A(this, To, /* @__PURE__ */ c(async (n) => {
      n.preventDefault();
      const i = n.currentTarget;
      if (!(i instanceof HTMLFormElement)) return;
      const r = new FormData(i), a = String(r.get("criterionLabel") ?? "").trim(), o = String(r.get("criterionKey") ?? "").trim(), s = Array.from(i.querySelectorAll('[name="criterionValues"]')).map((m) => m instanceof HTMLInputElement ? m.value.trim() : "").filter((m, h, y) => m && y.indexOf(m) === h), u = String(r.get("criterionDefault") ?? "").trim() || s[0] || "Standard", d = Xs(
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
      d && (L(this, me, d), await C(this, Ne, Ld).call(this), this.close());
    }, "#onSubmit"));
    A(this, Lo, /* @__PURE__ */ c((n) => {
      var o;
      if (f(this, Zt)) return;
      const i = n.currentTarget, r = (i == null ? void 0 : i.form) ?? ((o = this.element) == null ? void 0 : o.querySelector("form"));
      if (!(r instanceof HTMLFormElement)) return;
      const a = r.querySelector('input[name="criterionKey"]');
      a instanceof HTMLInputElement && (a.value = er(i.value));
    }, "#onLabelInput"));
    A(this, Io, /* @__PURE__ */ c((n) => {
      var l;
      const i = n.currentTarget, r = (i == null ? void 0 : i.form) ?? ((l = this.element) == null ? void 0 : l.querySelector("form"));
      if (!(r instanceof HTMLFormElement) || !(i instanceof HTMLInputElement)) return;
      const a = r.querySelector('input[name="criterionLabel"]'), o = er(a instanceof HTMLInputElement ? a.value : ""), s = er(i.value);
      L(this, Zt, s !== o), i.value = s, C(this, Ne, ya).call(this, r);
    }, "#onKeyInput"));
    A(this, Oo, /* @__PURE__ */ c((n) => {
      var o, s;
      n.preventDefault();
      const i = ((o = n.currentTarget) == null ? void 0 : o.form) ?? ((s = this.element) == null ? void 0 : s.querySelector("form"));
      if (!(i instanceof HTMLFormElement)) return;
      const r = i.querySelector('input[name="criterionLabel"]'), a = i.querySelector('input[name="criterionKey"]');
      a instanceof HTMLInputElement && (a.value = er(r instanceof HTMLInputElement ? r.value : ""), L(this, Zt, !1), C(this, Ne, ya).call(this, i));
    }, "#onResetAutoKey"));
    A(this, Ao, /* @__PURE__ */ c((n) => {
      var l, u, d, m, h, y;
      n.preventDefault();
      const i = ((l = n.currentTarget) == null ? void 0 : l.form) ?? ((u = this.element) == null ? void 0 : u.querySelector("form"));
      if (!(i instanceof HTMLFormElement)) return;
      const r = i.querySelector(".scene-criterion-editor__values");
      if (!(r instanceof HTMLElement)) return;
      (d = r.querySelector(".scene-criterion-editor__empty")) == null || d.remove();
      const a = document.createElement("div");
      a.classList.add("scene-criterion-editor__value");
      const o = Ot(E("EIDOLON.SceneCriteria.ValuePlaceholder", "Allowed value")), s = Ot(E("EIDOLON.SceneCriteria.RemoveValue", "Remove Value"));
      a.innerHTML = `
      <input type="text" name="criterionValues" value="" placeholder="${o}" class="form-control">
      <button type="button" class="icon" data-action="remove-value" aria-label="${s}" title="${s}">
        <i class="fa-solid fa-trash"></i>
      </button>
    `, r.appendChild(a), (m = a.querySelector('[data-action="remove-value"]')) == null || m.addEventListener("click", f(this, Or)), (h = a.querySelector('input[name="criterionValues"]')) == null || h.addEventListener("input", f(this, Ar)), C(this, Ne, ir).call(this, i), (y = a.querySelector('input[name="criterionValues"]')) == null || y.focus();
    }, "#onAddValue"));
    A(this, Or, /* @__PURE__ */ c((n) => {
      var a, o, s, l;
      n.preventDefault(), (o = (a = n.currentTarget) == null ? void 0 : a.closest(".scene-criterion-editor__value")) == null || o.remove();
      const i = ((s = n.currentTarget) == null ? void 0 : s.form) ?? ((l = this.element) == null ? void 0 : l.querySelector("form"));
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
        C(this, Ne, ir).call(this, i);
      }
    }, "#onRemoveValue"));
    A(this, Ar, /* @__PURE__ */ c((n) => {
      var r, a;
      const i = ((r = n.currentTarget) == null ? void 0 : r.form) ?? ((a = this.element) == null ? void 0 : a.querySelector("form"));
      i instanceof HTMLFormElement && C(this, Ne, ir).call(this, i);
    }, "#onValuesChanged"));
    this.scene = i ?? null, this.criterion = r ?? null, this.onSave = typeof o == "function" ? o : null, this.isNew = !!a, L(this, me, C(this, Ne, Td).call(this)), L(this, Zt, f(this, me).key !== er(f(this, me).label));
  }
  async _prepareContext() {
    var i, r, a, o;
    const n = Array.isArray((i = f(this, me)) == null ? void 0 : i.values) ? f(this, me).values : [];
    return {
      isNew: this.isNew,
      key: ((r = f(this, me)) == null ? void 0 : r.key) ?? "",
      label: ((a = f(this, me)) == null ? void 0 : a.label) ?? "",
      defaultValue: ((o = f(this, me)) == null ? void 0 : o.default) ?? "",
      values: n.map((s, l) => {
        var u;
        return {
          index: l,
          value: s,
          selected: s === ((u = f(this, me)) == null ? void 0 : u.default)
        };
      }),
      hasValues: n.length > 0,
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
      keyIsCustom: f(this, Zt)
    };
  }
  _onRender(n, i) {
    var a, o, s, l, u, d;
    super._onRender(n, i);
    const r = (a = this.element) == null ? void 0 : a.querySelector("form");
    r && (r.addEventListener("submit", f(this, To)), (o = r.querySelector('[data-action="add-value"]')) == null || o.addEventListener("click", f(this, Ao)), (s = r.querySelector('input[name="criterionLabel"]')) == null || s.addEventListener("input", f(this, Lo)), (l = r.querySelector('input[name="criterionKey"]')) == null || l.addEventListener("input", f(this, Io)), (u = r.querySelector('[data-action="reset-auto-key"]')) == null || u.addEventListener("click", f(this, Oo)), r.querySelectorAll('[data-action="remove-value"]').forEach((m) => {
      m.addEventListener("click", f(this, Or));
    }), r.querySelectorAll('input[name="criterionValues"]').forEach((m) => {
      m.addEventListener("input", f(this, Ar));
    }), (d = r.querySelector('[data-action="cancel"]')) == null || d.addEventListener("click", (m) => {
      m.preventDefault(), this.close();
    }), C(this, Ne, ya).call(this, r), C(this, Ne, ir).call(this, r));
  }
};
me = new WeakMap(), Zt = new WeakMap(), Ne = new WeakSet(), Td = /* @__PURE__ */ c(function() {
  const n = Xs(this.criterion, 0, /* @__PURE__ */ new Set()) ?? Zl(E("EIDOLON.SceneCriteria.DefaultCategoryName", "New Criterion"));
  return {
    id: n.id,
    key: n.key,
    label: n.label ?? "",
    values: Array.isArray(n.values) ? [...n.values] : [],
    default: n.default
  };
}, "#initializeState"), To = new WeakMap(), Lo = new WeakMap(), Io = new WeakMap(), Oo = new WeakMap(), ya = /* @__PURE__ */ c(function(n) {
  const i = n.querySelector('[data-action="reset-auto-key"]');
  i instanceof HTMLButtonElement && (i.disabled = !f(this, Zt));
}, "#syncAutoKeyButton"), Ao = new WeakMap(), Or = new WeakMap(), Ar = new WeakMap(), ir = /* @__PURE__ */ c(function(n) {
  var l, u;
  const i = n.querySelector('select[name="criterionDefault"]');
  if (!(i instanceof HTMLSelectElement)) return;
  const r = ((u = (l = i.value) == null ? void 0 : l.trim) == null ? void 0 : u.call(l)) ?? "", a = Array.from(n.querySelectorAll('input[name="criterionValues"]')).map((d) => d instanceof HTMLInputElement ? d.value.trim() : "").filter((d, m, h) => d && h.indexOf(d) === m), o = i.dataset.emptyLabel || E("EIDOLON.SceneCriteria.ValueListEmpty", "No values have been added to this criterion.");
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
}, "#syncDefaultOptions"), Ld = /* @__PURE__ */ c(async function() {
  if (!this.scene) return;
  const n = ut(this.scene).sort((r, a) => r.order - a.order), i = n.findIndex((r) => r.id === f(this, me).id);
  i < 0 ? (f(this, me).order = n.length, n.push(f(this, me))) : (f(this, me).order = n[i].order, n.splice(i, 1, f(this, me)));
  try {
    await xo(this.scene, n), this.onSave && await this.onSave(f(this, me));
  } catch (r) {
    Cd(r);
  }
}, "#persist"), c(Jt, "CategoryEditorApplication"), pe(Jt, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  $e(Jt, Jt, "DEFAULT_OPTIONS"),
  {
    id: `${we}-criterion-editor`,
    classes: Array.from(
      /* @__PURE__ */ new Set([...((Fu = $e(Jt, Jt, "DEFAULT_OPTIONS")) == null ? void 0 : Fu.classes) ?? [], "standard-form", "themed"])
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
)), pe(Jt, "PARTS", {
  content: {
    template: `modules/${we}/templates/scene-criteria-editor.html`
  }
});
let Zs = Jt;
function er(e) {
  return String(e ?? "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "criterion";
}
c(er, "slugifyKey");
const ih = `modules/${we}/templates/scene-criteria-tab.html`, el = {
  log: /* @__PURE__ */ c((...e) => {
    var t;
    return (t = console.debug) == null ? void 0 : t.call(console, `${we} | Criteria`, ...e);
  }, "log"),
  group: /* @__PURE__ */ c((...e) => {
    var t;
    return (t = console.groupCollapsed) == null ? void 0 : t.call(console, `${we} | Criteria`, ...e);
  }, "group"),
  groupEnd: /* @__PURE__ */ c(() => {
    var e;
    return (e = console.groupEnd) == null ? void 0 : e.call(console);
  }, "groupEnd")
}, rh = Do(Zs), ah = pd({
  tabId: "criteria",
  tabLabel: /* @__PURE__ */ c(() => E("EIDOLON.SceneCriteria.TabLabel", "Criteria"), "tabLabel"),
  getScene: jt,
  isApplicable: /* @__PURE__ */ c(() => Fo(), "isApplicable"),
  renderContent: /* @__PURE__ */ c(({ app: e, tab: t, scene: n }) => sh(e, t, n), "renderContent"),
  logger: el
});
function oh() {
  return ah.register();
}
c(oh, "registerSceneCriteriaConfigHook");
function sh(e, t, n) {
  if (!(t instanceof HTMLElement)) return;
  const i = Ue(n) ? n : jt(e);
  Ci(e, t, i);
}
c(sh, "renderCriteriaTab");
async function Ci(e, t, n) {
  var r, a;
  const i = n ?? jt(e);
  el.group("renderCriteriaTabContent", { sceneId: (i == null ? void 0 : i.id) ?? null });
  try {
    if (!Ue(i)) {
      const d = E(
        "EIDOLON.SceneCriteria.Unavailable",
        "Scene criteria are unavailable for this configuration sheet."
      );
      t.innerHTML = `<p class="notes">${d}</p>`;
      return;
    }
    const o = ut(i).sort((d, m) => d.order - m.order), s = Gr(i, o), l = ((a = (r = foundry == null ? void 0 : foundry.applications) == null ? void 0 : r.handlebars) == null ? void 0 : a.renderTemplate) ?? (typeof renderTemplate == "function" ? renderTemplate : globalThis == null ? void 0 : globalThis.renderTemplate);
    if (typeof l != "function") {
      t.innerHTML = `<p class="notes">${E("EIDOLON.SceneCriteria.CategoryListEmpty", "No criteria configured for this scene.")}</p>`;
      return;
    }
    const u = await l(ih, {
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
        var h, y;
        return {
          id: d.id,
          label: d.label,
          displayName: ((y = (h = d.label) == null ? void 0 : h.trim) == null ? void 0 : y.call(h)) || E("EIDOLON.SceneCriteria.UnnamedCategory", "Unnamed Criterion"),
          hasValues: d.values.length > 0,
          values: d.values.map((p) => ({
            value: p,
            isCurrent: (s[d.key] ?? d.default) === p
          })),
          valueCountLabel: ch(d.values.length),
          canMoveUp: m > 0,
          canMoveDown: m < o.length - 1
        };
      }),
      hasCriteria: o.length > 0
    });
    t.innerHTML = u, lh(e, t, i);
  } catch (o) {
    console.error(`${we} | Failed to render criteria tab`, o), t.innerHTML = `<p class="notes">${E("EIDOLON.SceneCriteria.CategoryListEmpty", "No criteria configured for this scene.")}</p>`;
  } finally {
    el.groupEnd();
  }
}
c(Ci, "renderCriteriaTabContent");
function lh(e, t, n) {
  const i = n ?? jt(e);
  if (!Ue(i)) return;
  const r = t.querySelector('[data-criteria-action="add"]');
  r && r.addEventListener("click", () => {
    qc(e, {
      scene: i,
      criterion: Zl(
        E("EIDOLON.SceneCriteria.DefaultCategoryName", "New Criterion")
      ),
      isNew: !0,
      onSave: /* @__PURE__ */ c(() => Ci(e, t, i), "onSave")
    });
  }), t.querySelectorAll('[data-criteria-action="edit"]').forEach((a) => {
    const o = a.dataset.criterionId;
    o && a.addEventListener("click", () => {
      const s = ut(i).find((l) => l.id === o);
      s && qc(e, {
        scene: i,
        criterion: s,
        onSave: /* @__PURE__ */ c(() => Ci(e, t, i), "onSave")
      });
    });
  }), t.querySelectorAll('[data-criteria-action="remove"]').forEach((a) => {
    const o = a.dataset.criterionId;
    o && a.addEventListener("click", async () => {
      await as(i, (l) => {
        const u = l.findIndex((d) => d.id === o);
        return u < 0 ? !1 : (l.splice(u, 1), os(l), !0);
      }) && await Ci(e, t, i);
    });
  }), t.querySelectorAll('[data-criteria-action="move-up"]').forEach((a) => {
    const o = a.dataset.criterionId;
    o && a.addEventListener("click", async () => {
      await as(i, (l) => {
        const u = l.findIndex((m) => m.id === o);
        if (u <= 0) return !1;
        const [d] = l.splice(u, 1);
        return l.splice(u - 1, 0, d), os(l), !0;
      }) && await Ci(e, t, i);
    });
  }), t.querySelectorAll('[data-criteria-action="move-down"]').forEach((a) => {
    const o = a.dataset.criterionId;
    o && a.addEventListener("click", async () => {
      await as(i, (l) => {
        const u = l.findIndex((m) => m.id === o);
        if (u < 0 || u >= l.length - 1) return !1;
        const [d] = l.splice(u, 1);
        return l.splice(u + 1, 0, d), os(l), !0;
      }) && await Ci(e, t, i);
    });
  });
}
c(lh, "bindCriteriaTabEvents");
async function as(e, t) {
  const n = ut(e).sort((r, a) => r.order - a.order);
  if (t(n) === !1) return !1;
  try {
    return await xo(e, n), !0;
  } catch (r) {
    return Cd(r), !1;
  }
}
c(as, "mutateCriteria");
function qc(e, t = {}) {
  const n = t.scene ?? null, i = n && Ue(n) ? n : jt(e);
  if (!Ue(i))
    return;
  rh({
    scene: i,
    criterion: t.criterion ?? null,
    isNew: !!t.isNew,
    onSave: typeof t.onSave == "function" ? t.onSave : null
  }).render({ force: !0 });
}
c(qc, "openCriterionEditor");
function os(e) {
  e.forEach((t, n) => {
    t.order = n;
  });
}
c(os, "reindexCriteriaOrder");
function ch(e) {
  var t, n;
  if ((n = (t = game.i18n) == null ? void 0 : t.has) != null && n.call(t, "EIDOLON.SceneCriteria.ValueCountLabel"))
    try {
      return game.i18n.format("EIDOLON.SceneCriteria.ValueCountLabel", { count: e });
    } catch (i) {
      console.error(`${we} | Failed to format value count label`, i);
    }
  return e === 0 ? "No values configured" : e === 1 ? "1 value" : `${e} values`;
}
c(ch, "formatValueCount");
let jc = !1;
function uh() {
  Hooks.once("init", () => {
    Qm();
  }), Hooks.once("ready", () => {
    Fo() && (jc || (oh(), jc = !0));
  });
}
c(uh, "registerSceneCriteriaHooks");
uh();
const ie = T, Id = "criteriaEngineVersion", oi = "fileIndex", si = "tileCriteria", tc = {
  LEGACY: 1,
  CRITERIA: 2
}, Od = tc.CRITERIA;
function Ad(e) {
  var t;
  return ((t = e == null ? void 0 : e.getFlag) == null ? void 0 : t.call(e, ie, Id)) ?? tc.LEGACY;
}
c(Ad, "getSceneEngineVersion");
function dh(e, t, n, i, r) {
  if (!(e != null && e.length) || !(n != null && n.length)) return -1;
  const a = {};
  for (const s of n)
    a[s] = t[s];
  const o = Bc(e, a, n);
  if (o >= 0) return o;
  if (i != null && i.length && r) {
    const s = { ...a };
    for (const l of i) {
      if (!(l in s)) continue;
      s[l] = r[l] ?? "Standard";
      const u = Bc(e, s, n);
      if (u >= 0) return u;
    }
  }
  return -1;
}
c(dh, "findBestMatch");
function Bc(e, t, n) {
  return e.findIndex((i) => {
    for (const r of n)
      if (i[r] !== t[r]) return !1;
    return !0;
  });
}
c(Bc, "findExactMatch");
function fh(e, t) {
  if (!(e != null && e.length)) return -1;
  let n = -1, i = -1;
  for (let r = 0; r < e.length; r += 1) {
    const a = e[r] ?? {}, o = Object.keys(a);
    if (o.length === 0) {
      i < 0 && (n = r, i = 0);
      continue;
    }
    let s = !0;
    for (const l of o)
      if (a[l] !== t[l]) {
        s = !1;
        break;
      }
    s && o.length > i && (n = r, i = o.length);
  }
  return n;
}
c(fh, "findFileIndex");
function ba(e) {
  return e && typeof e == "object" && !Array.isArray(e);
}
c(ba, "isPlainObject$2");
function Uc(e) {
  return e == null ? e : typeof structuredClone == "function" ? structuredClone(e) : JSON.parse(JSON.stringify(e));
}
c(Uc, "deepClone");
function mh(e, t) {
  if (!t) return;
  const n = t.split(".").filter(Boolean);
  if (!n.length) return;
  let i = e;
  for (let r = 0; r < n.length - 1; r += 1) {
    if (!ba(i == null ? void 0 : i[n[r]])) return;
    i = i[n[r]];
  }
  delete i[n.at(-1)];
}
c(mh, "deletePath");
function kd(e, t) {
  const n = Uc(e ?? {});
  if (!ba(t)) return n;
  for (const [i, r] of Object.entries(t)) {
    if (i.startsWith("-=") && r === !0) {
      mh(n, i.slice(2));
      continue;
    }
    ba(r) && ba(n[i]) ? n[i] = kd(n[i], r) : n[i] = Uc(r);
  }
  return n;
}
c(kd, "fallbackMerge");
function hh(e, t) {
  var n, i;
  return (n = foundry == null ? void 0 : foundry.utils) != null && n.mergeObject && ((i = foundry == null ? void 0 : foundry.utils) != null && i.deepClone) ? foundry.utils.mergeObject(e, foundry.utils.deepClone(t), {
    inplace: !1
  }) : kd(e, t);
}
c(hh, "defaultMerge");
function gh(e, t) {
  if (!e) return !0;
  for (const n of Object.keys(e))
    if (e[n] !== t[n]) return !1;
  return !0;
}
c(gh, "criteriaMatch");
function Md(e, t, n, i) {
  const r = i ?? hh;
  let a = r({}, e ?? {});
  if (!(t != null && t.length)) return a;
  const o = [];
  for (let s = 0; s < t.length; s += 1) {
    const l = t[s];
    if (gh(l == null ? void 0 : l.criteria, n)) {
      const u = l != null && l.criteria ? Object.keys(l.criteria).length : 0;
      o.push({ specificity: u, index: s, delta: l == null ? void 0 : l.delta });
    }
  }
  o.sort((s, l) => s.specificity - l.specificity || s.index - l.index);
  for (const s of o)
    s.delta && (a = r(a, s.delta));
  return a;
}
c(Md, "resolveRules");
function Po(e = null) {
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
c(Po, "canManageCriteria");
function ph(e = null) {
  if (!Po(e))
    throw new Error(`${ie} | You do not have permission to manage scene criteria.`);
}
c(ph, "requireCriteriaAccess");
const yh = /* @__PURE__ */ c((...e) => console.log(`${ie} | criteria tiles:`, ...e), "log$1");
let xa = /* @__PURE__ */ new WeakMap(), Pa = /* @__PURE__ */ new WeakMap();
const Vc = 200;
function bh(e) {
  return e ? Number.isInteger(e.size) ? e.size : Array.isArray(e) || typeof e.length == "number" ? e.length : Array.from(e).length : 0;
}
c(bh, "getCollectionSize$1");
function na() {
  return typeof (performance == null ? void 0 : performance.now) == "function" ? performance.now() : Date.now();
}
c(na, "nowMs$2");
function vh(e) {
  if (!Array.isArray(e)) return [];
  const t = /* @__PURE__ */ new Set();
  for (const n of e) {
    if (typeof n != "string") continue;
    const i = n.trim();
    i && t.add(i);
  }
  return Array.from(t);
}
c(vh, "uniqueStringKeys$1");
function wh(e, t = Vc) {
  if (!Array.isArray(e) || e.length === 0) return [];
  const n = Number.isInteger(t) && t > 0 ? t : Vc, i = [];
  for (let r = 0; r < e.length; r += n)
    i.push(e.slice(r, r + n));
  return i;
}
c(wh, "chunkArray$1");
async function Eh(e, t, n) {
  const i = wh(t, n);
  for (const r of i)
    await e.updateEmbeddedDocuments("Tile", r), i.length > 1 && await Promise.resolve();
  return i.length;
}
c(Eh, "updateTilesInChunks");
function Sh(e) {
  var i;
  const t = mi(e, { files: null });
  if (!((i = t == null ? void 0 : t.variants) != null && i.length)) return [];
  const n = /* @__PURE__ */ new Set();
  for (const r of t.variants)
    for (const a of Object.keys(r.criteria ?? {}))
      a && n.add(a);
  return Array.from(n);
}
c(Sh, "getTileCriteriaDependencyKeys");
function Ch(e, t) {
  const n = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Set();
  for (const r of t) {
    const a = r.getFlag(ie, si) ?? r.getFlag(ie, oi);
    if (a) {
      i.add(r.id);
      for (const o of Sh(a))
        n.has(o) || n.set(o, /* @__PURE__ */ new Set()), n.get(o).add(r.id);
    }
  }
  return {
    collection: t,
    keyToTileIds: n,
    allTileIds: i
  };
}
c(Ch, "buildTileDependencyIndex");
function Th(e, t) {
  const n = Pa.get(e);
  if ((n == null ? void 0 : n.collection) === t) return n;
  const i = Ch(e, t);
  return Pa.set(e, i), i;
}
c(Th, "getTileDependencyIndex");
function Lh(e, t, n) {
  const i = vh(n);
  if (!i.length)
    return Array.from(t ?? []);
  const r = Th(e, t), a = /* @__PURE__ */ new Set();
  for (const o of i) {
    const s = r.keyToTileIds.get(o);
    if (s)
      for (const l of s)
        a.add(l);
  }
  return a.size ? typeof (t == null ? void 0 : t.get) == "function" ? Array.from(a).map((o) => t.get(o)).filter(Boolean) : Array.from(t ?? []).filter((o) => a.has(o.id)) : [];
}
c(Lh, "getTilesForChangedKeys");
function Nd(e) {
  return typeof (e == null ? void 0 : e.name) == "string" ? e.name : typeof (e == null ? void 0 : e.src) == "string" ? e.src : "";
}
c(Nd, "getFilePath");
function Ra(e) {
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
c(Ra, "normalizeFilePath");
function nc(e) {
  if (!Array.isArray(e)) return [];
  const t = /* @__PURE__ */ new Map();
  return e.map((n, i) => {
    const r = Ra(Nd(n)), a = r || `__index:${i}`, o = t.get(a) ?? 0;
    t.set(a, o + 1);
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
c(nc, "buildTileFileEntries");
function kn(e, t) {
  if (!Number.isInteger(t) || t < 0) return null;
  const i = nc(e).find((r) => r.index === t);
  return i ? { ...i.target } : { indexHint: t };
}
c(kn, "createTileTargetFromIndex");
function Ro(e) {
  if (!e || typeof e != "object") return null;
  const t = Ra(e.path), n = Number(e.indexHint ?? e.fileIndex), i = Number(e.occurrence), r = {};
  return t && (r.path = t, r.occurrence = Number.isInteger(i) && i >= 0 ? i : 0), Number.isInteger(n) && n >= 0 && (r.indexHint = n), !r.path && !Number.isInteger(r.indexHint) ? null : r;
}
c(Ro, "normalizeTileTarget");
function br(e, t) {
  const n = Ro(e);
  if (!n) return -1;
  const i = nc(t);
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
c(br, "resolveTileTargetIndex");
function Mn(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return {};
  const t = {};
  for (const [n, i] of Object.entries(e))
    typeof n != "string" || !n || typeof i != "string" || !i.trim() || (t[n] = i.trim());
  return t;
}
c(Mn, "sanitizeCriteria");
function Ih(e) {
  return Object.entries(Mn(e)).sort(([n], [i]) => n.localeCompare(i)).map(([n, i]) => `${n}=${i}`).join("");
}
c(Ih, "serializeCriteria");
function Oh(e) {
  return Object.keys(Mn(e)).length;
}
c(Oh, "getCriteriaSpecificity");
function Ah(e, t) {
  const n = Mn(e), i = Mn(t);
  for (const [r, a] of Object.entries(n))
    if (r in i && i[r] !== a)
      return !1;
  return !0;
}
c(Ah, "areCriteriaCompatible");
function kh(e, t) {
  const n = br(e, t);
  if (Number.isInteger(n) && n >= 0)
    return `index:${n}`;
  const i = Ro(e);
  if (!i) return "";
  if (i.path) {
    const r = Number.isInteger(i.occurrence) ? i.occurrence : 0;
    return `path:${i.path}#${r}`;
  }
  return Number.isInteger(i.indexHint) ? `hint:${i.indexHint}` : "";
}
c(kh, "getTargetIdentity");
function _d(e, t = {}) {
  var s;
  const n = Array.isArray(t.files) ? t.files : [], i = mi(e, { files: n });
  if (!((s = i == null ? void 0 : i.variants) != null && s.length))
    return {
      errors: [],
      warnings: []
    };
  const r = i.variants.map((l, u) => ({
    index: u,
    criteria: Mn(l.criteria),
    specificity: Oh(l.criteria),
    criteriaSignature: Ih(l.criteria),
    targetIdentity: kh(l.target, n)
  })), a = [], o = [];
  for (let l = 0; l < r.length; l += 1) {
    const u = r[l];
    for (let d = l + 1; d < r.length; d += 1) {
      const m = r[d];
      if (u.specificity !== m.specificity || !Ah(u.criteria, m.criteria)) continue;
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
c(_d, "detectTileCriteriaConflicts");
function Mh(e, t) {
  if (!e || typeof e != "object") return null;
  let n = Ro(e.target);
  if (!n) {
    const i = Number(e.fileIndex);
    Number.isInteger(i) && i >= 0 && (n = kn(t, i));
  }
  return n ? {
    criteria: Mn(e.criteria),
    target: n
  } : null;
}
c(Mh, "normalizeTileVariant");
function $d(e, t = {}) {
  if (!Array.isArray(e) || e.length === 0) return null;
  const n = Array.isArray(t.files) ? t.files : null, i = e.map((l, u) => ({
    criteria: Mn(l),
    target: kn(n, u)
  })).filter((l) => l.target);
  if (!i.length) return null;
  const r = i.find((l) => Object.keys(l.criteria).length === 0), a = (r == null ? void 0 : r.target) ?? i[0].target;
  let o = null;
  const s = Number(t.defaultFileIndex);
  return Number.isInteger(s) && s >= 0 && (o = kn(n, s)), o || (o = a), {
    strategy: "select-one",
    variants: i,
    defaultTarget: o
  };
}
c($d, "buildTileCriteriaFromFileIndex");
function mi(e, t = {}) {
  const n = Array.isArray(t.files) ? t.files : null;
  if (Array.isArray(e))
    return $d(e, { files: n });
  if (!e || typeof e != "object") return null;
  const i = Array.isArray(e.variants) ? e.variants.map((a) => Mh(a, n)).filter(Boolean) : [];
  if (!i.length) return null;
  let r = Ro(e.defaultTarget);
  if (!r) {
    const a = Number(e.defaultFileIndex);
    Number.isInteger(a) && a >= 0 && (r = kn(n, a));
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
c(mi, "normalizeTileCriteria");
function Nh(e, t) {
  if (!e) return -1;
  let n = -1, i = -1;
  for (const r of e.variants) {
    const a = r.keys;
    let o = !0;
    for (const s of a)
      if (r.criteria[s] !== (t == null ? void 0 : t[s])) {
        o = !1;
        break;
      }
    o && a.length > i && (i = a.length, n = r.targetIndex);
  }
  return n >= 0 ? n : e.defaultIndex;
}
c(Nh, "selectTileFileIndexFromCompiled");
function _h(e, t) {
  const n = mi(e, { files: t });
  if (!n) return null;
  const i = n.variants.map((a) => {
    const o = Mn(a.criteria), s = br(a.target, t);
    return !Number.isInteger(s) || s < 0 ? null : {
      criteria: o,
      keys: Object.keys(o),
      targetIndex: s
    };
  }).filter(Boolean), r = br(n.defaultTarget, t);
  return !i.length && (!Number.isInteger(r) || r < 0) ? null : {
    variants: i,
    defaultIndex: r
  };
}
c(_h, "compileTileMatcher");
function $h(e, t, n) {
  const i = xa.get(e);
  if (i && i.tileCriteria === t && i.files === n)
    return i.compiled;
  const r = _h(t, n);
  return xa.set(e, {
    tileCriteria: t,
    files: n,
    compiled: r
  }), r;
}
c($h, "getCompiledTileMatcher");
function Dh(e = null, t = null) {
  e ? Pa.delete(e) : Pa = /* @__PURE__ */ new WeakMap(), t ? xa.delete(t) : e || (xa = /* @__PURE__ */ new WeakMap());
}
c(Dh, "invalidateTileCriteriaCaches");
async function Dd(e, t, n = {}) {
  var l, u, d, m;
  const i = na(), r = {
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
  if (t = t ?? ((l = game.scenes) == null ? void 0 : l.viewed), !t)
    return r.durationMs = na() - i, r;
  const a = t.getEmbeddedCollection("Tile") ?? [];
  r.total = bh(a);
  const o = Lh(t, a, n.changedKeys);
  if (r.scanned = o.length, !o.length)
    return r.skipped.unaffected = r.total, r.durationMs = na() - i, r;
  const s = [];
  for (const h of o) {
    const y = h.getFlag(ie, si) ?? h.getFlag(ie, oi);
    if (!y) {
      r.skipped.noCriteria += 1;
      continue;
    }
    const p = h.getFlag("monks-active-tiles", "files");
    if (!(p != null && p.length)) {
      r.skipped.noFiles += 1;
      continue;
    }
    const g = $h(h, y, p), v = Nh(g, e);
    if (!Number.isInteger(v) || v < 0 || v >= p.length) {
      console.warn(`${ie} | Tile ${h.id} has no valid file match for state`, e), r.skipped.noMatch += 1;
      continue;
    }
    const b = v + 1, S = Number(h.getFlag("monks-active-tiles", "fileindex")) !== b, I = p.some((F, D) => !!(F != null && F.selected) != (D === v)), O = Ra(((u = h.texture) == null ? void 0 : u.src) ?? ((m = (d = h._source) == null ? void 0 : d.texture) == null ? void 0 : m.src) ?? ""), k = Nd(p[v]), M = Ra(k), x = !!M && M !== O;
    if (!I && !S && !x) {
      r.skipped.unchanged += 1;
      continue;
    }
    const R = {
      _id: h._id
    };
    I && (R["flags.monks-active-tiles.files"] = p.map((F, D) => ({
      ...F,
      selected: D === v
    }))), S && (R["flags.monks-active-tiles.fileindex"] = b), x && (R.texture = { src: k }), s.push(R), yh(`Tile ${h.id} -> ${k}`);
  }
  return s.length > 0 && (r.chunks = await Eh(t, s, n.chunkSize), r.updated = s.length), r.durationMs = na() - i, r;
}
c(Dd, "updateTiles");
function Fh() {
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
    const a = (Tagger.getTags(r) ?? []).filter((l) => !t.includes(l)), o = (Tagger.getByTag("Disable Automation") ?? []).concat(Tagger.getByTag("Settings") ?? []), s = Tagger.getByTag(a, { ignore: o }) ?? [];
    for (const l of s)
      l != null && l._id && i.push(l._id);
  }
  return i;
}
c(Fh, "buildLightControlsMap");
const li = T, _i = "lightCriteria", ic = Object.freeze({
  base: null,
  mappings: [],
  current: null
});
function ss(e) {
  return e && typeof e == "object" && !Array.isArray(e);
}
c(ss, "isPlainObject$1");
function Fd(e, t) {
  if (!ss(t)) return {};
  const n = {};
  for (const [i, r] of Object.entries(t)) {
    const a = e == null ? void 0 : e[i];
    if (ss(r) && ss(a)) {
      const o = Fd(a, r);
      Object.keys(o).length > 0 && (n[i] = o);
    } else r !== a && (n[i] = qt(r));
  }
  return n;
}
c(Fd, "computeDelta");
function xd(e) {
  var n;
  const t = ((n = e == null ? void 0 : e.getFlag) == null ? void 0 : n.call(e, li, _i)) ?? ic;
  return vr(t);
}
c(xd, "getLightCriteriaState");
async function Pd(e, t) {
  const n = vr(t);
  if (!(e != null && e.setFlag))
    return n;
  const i = n.base !== null, r = n.mappings.length > 0, a = n.current !== null;
  return !i && !r && !a ? (typeof e.unsetFlag == "function" ? await e.unsetFlag(li, _i) : await e.setFlag(li, _i, null), ic) : (await e.setFlag(li, _i, n), n);
}
c(Pd, "setLightCriteriaState");
async function Wr(e, t) {
  if (typeof t != "function")
    throw new TypeError("updateLightCriteriaState requires an updater function.");
  const n = qt(xd(e)), i = await t(n);
  return Pd(e, i);
}
c(Wr, "updateLightCriteriaState");
async function zc(e, t) {
  const n = hi(t);
  if (!n)
    throw new Error("Invalid light configuration payload.");
  return Wr(e, (i) => ({
    ...i,
    base: n
  }));
}
c(zc, "storeBaseLighting");
async function Gc(e, t, n, { label: i } = {}) {
  const r = Kr(t);
  if (!r)
    throw new Error("Cannot create a mapping without at least one category selection.");
  const a = hi(n);
  if (!a)
    throw new Error("Invalid light configuration payload.");
  return Wr(e, (o) => {
    const s = Ji(r), l = Array.isArray(o == null ? void 0 : o.mappings) ? [...o.mappings] : [], u = l.findIndex((y) => (y == null ? void 0 : y.key) === s), d = u >= 0 ? l[u] : null, m = typeof (d == null ? void 0 : d.id) == "string" && d.id.trim() ? d.id.trim() : Hd(), h = Ho({
      id: m,
      categories: r,
      config: a,
      label: typeof i == "string" ? i : (d == null ? void 0 : d.label) ?? null,
      updatedAt: Date.now()
    });
    if (!h)
      throw new Error("Failed to sanitize criteria mapping entry.");
    return u >= 0 ? l[u] = h : l.push(h), {
      ...o,
      mappings: l
    };
  });
}
c(Gc, "upsertLightCriteriaMapping");
async function xh(e, t, n, i, { replaceExisting: r = !1 } = {}) {
  const a = typeof t == "string" ? t.trim() : "";
  if (!a)
    throw new Error("A mapping id is required to retarget criteria.");
  const o = Kr(n);
  if (!o)
    throw new Error("Cannot retarget mapping without at least one category selection.");
  const s = hi(i);
  if (!s)
    throw new Error("Invalid light configuration payload.");
  return Wr(e, (l) => {
    const u = Array.isArray(l == null ? void 0 : l.mappings) ? [...l.mappings] : [], d = u.findIndex((b) => (b == null ? void 0 : b.id) === a);
    if (d < 0)
      throw new Error("The selected mapping no longer exists.");
    const m = Ji(o), h = u.findIndex(
      (b, w) => w !== d && (b == null ? void 0 : b.key) === m
    );
    if (h >= 0 && !r)
      throw new Error("A mapping already exists for the selected criteria.");
    const y = u[d], p = Ho({
      ...y,
      id: a,
      categories: o,
      config: s,
      updatedAt: Date.now()
    });
    if (!p)
      throw new Error("Failed to sanitize updated mapping.");
    u[d] = p;
    let g = null;
    if (h >= 0) {
      const [b] = u.splice(h, 1);
      g = (b == null ? void 0 : b.id) ?? null;
    }
    let v = (l == null ? void 0 : l.current) ?? null;
    return v && typeof v == "object" && (v.mappingId === a ? v = {
      ...v,
      mappingId: a,
      categories: o,
      updatedAt: Date.now()
    } : g && v.mappingId === g && (v = {
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
c(xh, "retargetLightCriteriaMapping");
async function Ph(e, t) {
  const n = typeof t == "string" ? t.trim() : "";
  if (!n)
    throw new Error("A mapping id is required to remove a mapping.");
  return Wr(e, (i) => {
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
c(Ph, "removeLightCriteriaMapping");
async function cr(e, t) {
  const n = Rd(t);
  return Wr(e, (i) => ({
    ...i,
    current: n
  }));
}
c(cr, "storeCurrentCriteriaSelection");
function Rh(e) {
  const t = vr(e), n = t.base ?? {}, i = [];
  for (const r of t.mappings) {
    const a = Kr(r == null ? void 0 : r.categories);
    if (!a) continue;
    const o = Fd(n, (r == null ? void 0 : r.config) ?? {});
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
c(Rh, "convertLightCriteriaStateToPresets");
function Hh(e, t = []) {
  const n = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Set();
  for (const l of t)
    typeof (l == null ? void 0 : l.key) == "string" && l.key.trim() && i.add(l.key.trim()), typeof (l == null ? void 0 : l.id) == "string" && l.id.trim() && typeof (l == null ? void 0 : l.key) == "string" && n.set(l.id.trim(), l.key.trim());
  const r = vr(e), a = /* @__PURE__ */ c((l) => {
    const u = {};
    for (const [d, m] of Object.entries(l ?? {})) {
      const h = String(d ?? "").trim(), y = typeof m == "string" ? m.trim() : "";
      if (!h || !y) continue;
      if (i.has(h)) {
        u[h] = y;
        continue;
      }
      const p = n.get(h);
      p && (u[p] = y);
    }
    return Object.keys(u).length ? u : null;
  }, "remapCategories"), o = r.mappings.map((l) => {
    const u = a(l.categories);
    return u ? Ho({
      ...l,
      categories: u,
      key: Ji(u)
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
  return vr({
    ...r,
    mappings: o,
    current: s
  });
}
c(Hh, "migrateLightCriteriaCategoriesToKeys");
function vr(e) {
  var l;
  const t = qt(e);
  if (!t || typeof t != "object")
    return qt(ic);
  const n = hi(t.base), i = Array.isArray(t.mappings) ? t.mappings : [], r = /* @__PURE__ */ new Map();
  for (const u of i) {
    const d = Ho(u);
    d && r.set(d.key, d);
  }
  const a = Array.from(r.values()), o = new Map(a.map((u) => [u.id, u]));
  let s = Rd(t.current);
  if (s) {
    const u = s.categories && Object.keys(s.categories).length > 0;
    if (s.mappingId && !o.has(s.mappingId)) {
      const d = u ? ((l = a.find((m) => m.key === Ji(s.categories))) == null ? void 0 : l.id) ?? null : null;
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
c(vr, "sanitizeLightCriteriaState");
function hi(e) {
  const t = qt(e);
  if (!t || typeof t != "object") return null;
  "_id" in t && delete t._id, "id" in t && delete t.id;
  const n = t.flags;
  if (n && typeof n == "object") {
    const i = n[li];
    i && typeof i == "object" && (delete i[_i], Object.keys(i).length === 0 && delete n[li]), Object.keys(n).length === 0 && delete t.flags;
  }
  return t;
}
c(hi, "sanitizeLightConfigPayload");
function Ho(e) {
  if (!e || typeof e != "object") return null;
  const t = Kr(e.categories);
  if (!t) return null;
  const n = hi(e.config);
  if (!n) return null;
  const i = typeof e.id == "string" && e.id.trim() ? e.id.trim() : Hd(), r = Ji(t), a = {
    id: i,
    key: r,
    categories: t,
    config: n,
    updatedAt: Number.isFinite(e.updatedAt) ? Number(e.updatedAt) : Date.now()
  };
  return typeof e.label == "string" && e.label.trim() && (a.label = e.label.trim()), a;
}
c(Ho, "sanitizeCriteriaMappingEntry");
function Rd(e) {
  if (!e || typeof e != "object") return null;
  const t = typeof e.mappingId == "string" && e.mappingId.trim() ? e.mappingId.trim() : null, n = Kr(e.categories);
  return !t && !n ? null : {
    mappingId: t,
    categories: n,
    updatedAt: Number.isFinite(e.updatedAt) ? Number(e.updatedAt) : Date.now()
  };
}
c(Rd, "sanitizeCurrentSelection");
function Kr(e) {
  const t = {};
  if (Array.isArray(e))
    for (const n of e) {
      const i = Wc((n == null ? void 0 : n.id) ?? (n == null ? void 0 : n.categoryId) ?? (n == null ? void 0 : n.category)), r = Kc((n == null ? void 0 : n.value) ?? (n == null ? void 0 : n.selection) ?? (n == null ? void 0 : n.label));
      !i || !r || (t[i] = r);
    }
  else if (e && typeof e == "object")
    for (const [n, i] of Object.entries(e)) {
      const r = Wc(n), a = Kc(i);
      !r || !a || (t[r] = a);
    }
  return Object.keys(t).length > 0 ? t : null;
}
c(Kr, "sanitizeCriteriaCategories");
function Ji(e) {
  if (!e || typeof e != "object") return "";
  const t = Object.entries(e).filter(([, n]) => typeof n == "string" && n).map(([n, i]) => `${n}:${i}`);
  return t.sort((n, i) => n < i ? -1 : n > i ? 1 : 0), t.join("|");
}
c(Ji, "computeCriteriaMappingKey");
function Hd() {
  var e;
  return (e = foundry == null ? void 0 : foundry.utils) != null && e.randomID ? foundry.utils.randomID() : typeof (crypto == null ? void 0 : crypto.randomUUID) == "function" ? crypto.randomUUID() : Math.random().toString(36).slice(2, 10);
}
c(Hd, "generateLightMappingId");
function Wc(e) {
  if (typeof e != "string") return null;
  const t = e.trim();
  return t || null;
}
c(Wc, "normalizeCategoryId");
function Kc(e) {
  if (typeof e != "string") return null;
  const t = e.trim();
  return t || null;
}
c(Kc, "normalizeCategoryValue");
const Ha = ["AmbientLight", "Wall", "AmbientSound"];
let qa = /* @__PURE__ */ new WeakMap(), ja = /* @__PURE__ */ new WeakMap();
const Jc = 200;
function qh(e) {
  return e ? Number.isInteger(e.size) ? e.size : Array.isArray(e) || typeof e.length == "number" ? e.length : Array.from(e).length : 0;
}
c(qh, "getCollectionSize");
function ls() {
  return typeof (performance == null ? void 0 : performance.now) == "function" ? performance.now() : Date.now();
}
c(ls, "nowMs$1");
function jh(e) {
  if (!Array.isArray(e)) return [];
  const t = /* @__PURE__ */ new Set();
  for (const n of e) {
    if (typeof n != "string") continue;
    const i = n.trim();
    i && t.add(i);
  }
  return Array.from(t);
}
c(jh, "uniqueStringKeys");
function Bh(e, t = Jc) {
  if (!Array.isArray(e) || e.length === 0) return [];
  const n = Number.isInteger(t) && t > 0 ? t : Jc, i = [];
  for (let r = 0; r < e.length; r += n)
    i.push(e.slice(r, r + n));
  return i;
}
c(Bh, "chunkArray");
async function Uh(e, t, n, i) {
  const r = Bh(n, i);
  for (const a of r)
    await e.updateEmbeddedDocuments(t, a), r.length > 1 && await Promise.resolve();
  return r.length;
}
c(Uh, "updatePlaceablesInChunks");
function Vh(e) {
  const t = /* @__PURE__ */ new Set();
  for (const n of (e == null ? void 0 : e.rules) ?? [])
    for (const i of Object.keys((n == null ? void 0 : n.criteria) ?? {}))
      i && t.add(i);
  return Array.from(t);
}
c(Vh, "getPresetDependencyKeys");
function zh(e, t) {
  const n = /* @__PURE__ */ new Map();
  for (const i of Ha) {
    const r = t.get(i) ?? [], a = /* @__PURE__ */ new Set(), o = /* @__PURE__ */ new Map();
    for (const s of r) {
      const l = jd(s, i);
      if (l != null && l.base) {
        a.add(s.id);
        for (const u of Vh(l))
          o.has(u) || o.set(u, /* @__PURE__ */ new Set()), o.get(u).add(s.id);
      }
    }
    n.set(i, {
      allDocIds: a,
      keyToDocIds: o
    });
  }
  return {
    collectionsByType: t,
    byType: n
  };
}
c(zh, "buildPlaceableDependencyIndex");
function Gh(e, t) {
  const n = ja.get(e);
  if (n && Ha.every((r) => n.collectionsByType.get(r) === t.get(r)))
    return n;
  const i = zh(e, t);
  return ja.set(e, i), i;
}
c(Gh, "getPlaceableDependencyIndex");
function Wh(e, t, n) {
  if (!t || !e) return [];
  const i = jh(n);
  if (!i.length)
    return typeof e.get == "function" ? Array.from(t.allDocIds).map((a) => e.get(a)).filter(Boolean) : Array.from(e).filter((a) => t.allDocIds.has(a.id));
  const r = /* @__PURE__ */ new Set();
  for (const a of i) {
    const o = t.keyToDocIds.get(a);
    if (o)
      for (const s of o) r.add(s);
  }
  return r.size ? typeof e.get == "function" ? Array.from(r).map((a) => e.get(a)).filter(Boolean) : Array.from(e).filter((a) => r.has(a.id)) : [];
}
c(Wh, "getDocsForChangedKeys");
function Li(e) {
  return !!e && typeof e == "object" && !Array.isArray(e);
}
c(Li, "isPlainObject");
function tl(e, t) {
  if (Object.is(e, t)) return !0;
  if (Array.isArray(e) || Array.isArray(t)) {
    if (!Array.isArray(e) || !Array.isArray(t) || e.length !== t.length) return !1;
    for (let n = 0; n < e.length; n += 1)
      if (!tl(e[n], t[n])) return !1;
    return !0;
  }
  if (Li(e) || Li(t)) {
    if (!Li(e) || !Li(t)) return !1;
    const n = Object.keys(t);
    for (const i of n)
      if (!tl(e[i], t[i])) return !1;
    return !0;
  }
  return !1;
}
c(tl, "areValuesEqual");
function qd(e, t) {
  const n = { _id: t._id };
  for (const [r, a] of Object.entries(t)) {
    if (r === "_id") continue;
    const o = e == null ? void 0 : e[r];
    if (Li(a) && Li(o)) {
      const s = qd(o, { _id: t._id, ...a });
      if (!s) continue;
      const l = Object.keys(s).filter((u) => u !== "_id");
      if (l.length > 0) {
        n[r] = {};
        for (const u of l)
          n[r][u] = s[u];
      }
      continue;
    }
    tl(o, a) || (n[r] = a);
  }
  return Object.keys(n).filter((r) => r !== "_id").length > 0 ? n : null;
}
c(qd, "buildChangedPayload");
function jd(e, t) {
  var s;
  const n = ((s = e == null ? void 0 : e.flags) == null ? void 0 : s[ie]) ?? {}, i = (n == null ? void 0 : n.presets) ?? null, r = t === "AmbientLight" ? (n == null ? void 0 : n.lightCriteria) ?? null : null, a = qa.get(e);
  if (a && a.type === t && a.rawPresets === i && a.rawLightCriteria === r)
    return a.presets;
  let o = null;
  if (n != null && n.presets) {
    const l = n.presets.base ?? null, u = Array.isArray(n.presets.rules) ? n.presets.rules : [];
    (l && Object.keys(l).length > 0 || u.length > 0) && (o = {
      base: l ?? {},
      rules: u
    });
  }
  if (!o && t === "AmbientLight" && (n != null && n.lightCriteria)) {
    const l = Rh(n.lightCriteria);
    (l.base && Object.keys(l.base).length > 0 || l.rules.length > 0) && (o = {
      base: l.base,
      rules: l.rules
    });
  }
  return qa.set(e, {
    type: t,
    rawPresets: i,
    rawLightCriteria: r,
    presets: o
  }), o;
}
c(jd, "getPresetsForDocument");
function Kh(e = null, t = null) {
  e ? ja.delete(e) : ja = /* @__PURE__ */ new WeakMap(), t ? qa.delete(t) : e || (qa = /* @__PURE__ */ new WeakMap());
}
c(Kh, "invalidatePlaceableCriteriaCaches");
async function Bd(e, t, n = {}) {
  var l, u;
  const i = ls(), r = {
    total: 0,
    scanned: 0,
    updated: 0,
    chunks: 0,
    byType: {},
    durationMs: 0
  };
  if (t = t ?? ((l = game.scenes) == null ? void 0 : l.viewed), !t)
    return r.durationMs = ls() - i, r;
  const a = new Set(Fh()), o = new Map(
    Ha.map((d) => [d, t.getEmbeddedCollection(d) ?? []])
  ), s = Gh(t, o);
  for (const d of Ha) {
    const m = o.get(d) ?? [], h = {
      total: qh(m),
      scanned: 0,
      updated: 0,
      chunks: 0
    }, y = s.byType.get(d) ?? null, p = Wh(m, y, n.changedKeys);
    if (h.scanned = p.length, r.total += h.total, r.scanned += h.scanned, r.byType[d] = h, !p.length) continue;
    const g = [];
    for (const v of p) {
      const b = jd(v, d);
      if (!(b != null && b.base)) continue;
      const w = Md(b.base, b.rules ?? [], e);
      w._id = v._id, d === "AmbientLight" && a.has(v._id) && (w.hidden = !0);
      const S = (v == null ? void 0 : v._source) ?? ((u = v == null ? void 0 : v.toObject) == null ? void 0 : u.call(v)) ?? {}, I = qd(S, w);
      I && g.push(I);
    }
    g.length > 0 && (h.chunks = await Uh(t, d, g, n.chunkSize), h.updated = g.length, r.updated += g.length, r.chunks += h.chunks, console.log(`${ie} | Updated ${g.length} ${d}(s)`));
  }
  return r.durationMs = ls() - i, r;
}
c(Bd, "updatePlaceables");
function Ba() {
  return typeof (performance == null ? void 0 : performance.now) == "function" ? performance.now() : Date.now();
}
c(Ba, "nowMs");
const ia = /* @__PURE__ */ new Map();
function Jh(e) {
  var t;
  return e = e ?? ((t = game.scenes) == null ? void 0 : t.viewed), e ? Gr(e) : null;
}
c(Jh, "getState");
async function Yh(e, t, n = 0) {
  var y;
  const i = Ba();
  if (t = t ?? ((y = game.scenes) == null ? void 0 : y.viewed), !t) return null;
  ph(t);
  const r = ut(t);
  if (!r.length)
    return console.warn(`${ie} | applyState skipped: scene has no criteria.`), null;
  const a = Gr(t, r), o = ec({ ...a, ...e ?? {} }, r), s = r.filter((p) => (a == null ? void 0 : a[p.key]) !== (o == null ? void 0 : o[p.key])).map((p) => p.key), l = s.length > 0;
  l && await eh(t, o, r);
  const u = l ? o : a, [d, m] = await Promise.all([
    Dd(u, t, { changedKeys: s }),
    Bd(u, t, { changedKeys: s })
  ]), h = Ba() - i;
  return N("Criteria apply telemetry", {
    sceneId: t.id,
    changedKeys: s,
    didChange: l,
    queuedMs: n,
    durationMs: h,
    tiles: d,
    placeables: m
  }), Hooks.callAll("eidolon-utilities.criteriaStateApplied", t, u), u;
}
c(Yh, "applyStateInternal");
async function Ud(e, t) {
  var l;
  if (t = t ?? ((l = game.scenes) == null ? void 0 : l.viewed), !t) return null;
  const n = t.id ?? "__viewed__", i = Ba(), r = ia.get(n) ?? Promise.resolve();
  let a = null;
  const o = r.catch(() => null).then(async () => {
    const u = Ba() - i;
    return Yh(e, t, u);
  });
  a = o;
  const s = o.finally(() => {
    ia.get(n) === s && ia.delete(n);
  });
  return ia.set(n, s), a;
}
c(Ud, "applyState$1");
function Xh(e) {
  var t;
  return e = e ?? ((t = game.scenes) == null ? void 0 : t.viewed), e ? Ad(e) : null;
}
c(Xh, "getVersion");
async function Vd(e, t) {
  var n;
  t = t ?? ((n = game.scenes) == null ? void 0 : n.viewed), t != null && t.setFlag && await t.setFlag(ie, Id, Number(e));
}
c(Vd, "setVersion");
async function Qh(e) {
  return Vd(Od, e);
}
c(Qh, "markCurrentVersion");
const rr = "Standard", Zh = /* @__PURE__ */ c((...e) => console.log(`${ie} | criteria indexer:`, ...e), "log");
function rc(e) {
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
c(rc, "parseFileTags");
function eg(e, t, n = rr) {
  return e != null && e.length ? e.map((i) => {
    const r = rc(i == null ? void 0 : i.name);
    if (!r) return {};
    const a = {};
    for (const [o, s] of Object.entries(t)) {
      const l = r[Number(o)];
      l != null && l !== n && (a[s] = l);
    }
    return a;
  }) : [];
}
c(eg, "buildFileIndex");
function tg(e, t) {
  return e.map((n, i) => {
    const r = [...t[n] ?? /* @__PURE__ */ new Set()].sort(), o = r.includes(rr) ? rr : r[0] ?? rr, s = Zl(n);
    return s.key = n, s.label = n.charAt(0).toUpperCase() + n.slice(1), s.values = r.length ? r : [rr], s.default = s.values.includes(o) ? o : s.values[0], s.order = i, s;
  });
}
c(tg, "buildCriteriaDefinitions");
async function ra(e, t, n, { dryRun: i = !1 } = {}) {
  const r = e.getFlag("monks-active-tiles", "files");
  if (!(r != null && r.length)) return null;
  const a = eg(r, t), o = $d(a, { files: r });
  for (const s of r) {
    const l = rc(s == null ? void 0 : s.name);
    if (l)
      for (const [u, d] of Object.entries(t)) {
        const m = l[Number(u)];
        m != null && n[d] && n[d].add(m);
      }
  }
  return i || (await e.setFlag(ie, si, o), typeof e.unsetFlag == "function" && await e.unsetFlag(ie, oi)), { files: r.length };
}
c(ra, "indexTile");
async function ng(e, t = {}) {
  var w, S, I, O;
  const {
    dryRun: n = !1,
    force: i = !1
  } = t;
  if (e = e ?? ((w = game.scenes) == null ? void 0 : w.viewed), !e) throw new Error("No scene provided to indexScene.");
  if (!globalThis.Tagger) throw new Error("Tagger is required to index scene criteria.");
  if (!i && Ad(e) >= Od)
    throw new Error(
      `Scene "${e.name}" is already criteria-indexed. Use force: true to re-index.`
    );
  const r = { sceneId: e.id }, a = Tagger.getByTag("Map", r) ?? [];
  if (!a.length) throw new Error("No Map tile found.");
  if (a.length > 1) throw new Error(`Expected 1 Map tile, found ${a.length}.`);
  const o = a[0], s = o.getFlag("monks-active-tiles", "files");
  if (!(s != null && s.length)) throw new Error("Map tile has no MATT files.");
  const l = rc((S = s[0]) == null ? void 0 : S.name);
  if (!(l != null && l.length))
    throw new Error(`Cannot parse bracket tags from: ${((I = s[0]) == null ? void 0 : I.name) ?? "<unknown>"}`);
  if (l.length < 3)
    throw new Error(`Expected 3+ bracket tags, found ${l.length}.`);
  const u = Tagger.getByTag("Floor", r) ?? [], d = Tagger.getByTag("Roof", r) ?? [], m = Tagger.getByTag("Weather", r) ?? [];
  let h;
  const y = [];
  l.length >= 4 ? (h = { 0: "mood", 1: "stage", 2: "variant", 3: "effect" }, y.push("mood", "stage", "variant", "effect")) : (h = { 0: "mood", 1: "variant", 2: "effect" }, y.push("mood", "variant", "effect"));
  const p = { 1: "effect" }, g = {};
  for (const k of y)
    g[k] = /* @__PURE__ */ new Set();
  const v = {
    map: null,
    floor: [],
    roof: [],
    weather: []
  };
  v.map = await ra(o, h, g, { dryRun: n });
  for (const k of u) {
    const M = await ra(k, h, g, { dryRun: n });
    M && v.floor.push(M);
  }
  for (const k of d) {
    const M = await ra(k, h, g, { dryRun: n });
    M && v.roof.push(M);
  }
  for (const k of m) {
    const M = await ra(k, p, g, { dryRun: n });
    M && v.weather.push(M);
  }
  const b = tg(y, g);
  return n || (await xo(e, b), await Qh(e)), Zh(
    n ? "Dry run complete" : "Indexing complete",
    `- ${b.length} criteria,`,
    `${((O = v.map) == null ? void 0 : O.files) ?? 0} map files`
  ), {
    criteria: b,
    state: b.reduce((k, M) => (k[M.key] = M.default, k), {}),
    tiles: v,
    overlayMode: m.length > 0
  };
}
c(ng, "indexScene");
var xu, Fe, ot, st, ei, Ke, xt, mn, ko, le, zd, Gd, Wd, il, Kd, rl, Jd, ar, al;
const pt = class pt extends Fn(Dn) {
  constructor(n = {}) {
    var i;
    super(n);
    A(this, le);
    A(this, Fe, null);
    A(this, ot, []);
    A(this, st, {});
    A(this, ei, !1);
    A(this, Ke, null);
    A(this, xt, null);
    A(this, mn, null);
    A(this, ko, 120);
    this.setScene(n.scene ?? ((i = game.scenes) == null ? void 0 : i.viewed) ?? null);
  }
  setScene(n) {
    var i;
    L(this, Fe, n ?? ((i = game.scenes) == null ? void 0 : i.viewed) ?? null), C(this, le, zd).call(this);
  }
  get scene() {
    return f(this, Fe);
  }
  async _prepareContext() {
    var r;
    const n = !!f(this, Fe), i = n && f(this, ot).length > 0;
    return {
      hasScene: n,
      hasCriteria: i,
      sceneName: ((r = f(this, Fe)) == null ? void 0 : r.name) ?? E("EIDOLON.CriteriaSwitcher.NoScene", "No active scene"),
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
      stateSummary: C(this, le, al).call(this)
    };
  }
  _onRender(n, i) {
    super._onRender(n, i), C(this, le, Gd).call(this), C(this, le, Wd).call(this);
  }
  async _onClose(n) {
    return f(this, Ke) !== null && (clearTimeout(f(this, Ke)), L(this, Ke, null)), f(this, mn) !== null && (Hooks.off("eidolon-utilities.criteriaStateApplied", f(this, mn)), L(this, mn, null)), super._onClose(n);
  }
};
Fe = new WeakMap(), ot = new WeakMap(), st = new WeakMap(), ei = new WeakMap(), Ke = new WeakMap(), xt = new WeakMap(), mn = new WeakMap(), ko = new WeakMap(), le = new WeakSet(), zd = /* @__PURE__ */ c(function() {
  if (!f(this, Fe)) {
    L(this, ot, []), L(this, st, {});
    return;
  }
  L(this, ot, ut(f(this, Fe)).sort((n, i) => n.order - i.order)), L(this, st, Gr(f(this, Fe), f(this, ot)));
}, "#hydrateFromScene"), Gd = /* @__PURE__ */ c(function() {
  var i, r;
  const n = this.element;
  n instanceof HTMLElement && (n.querySelectorAll("[data-criteria-key]").forEach((a) => {
    a.addEventListener("change", (o) => {
      const s = o.currentTarget;
      if (!(s instanceof HTMLSelectElement)) return;
      const l = s.dataset.criteriaKey;
      l && (L(this, st, {
        ...f(this, st),
        [l]: s.value
      }), C(this, le, Kd).call(this, { [l]: s.value }));
    });
  }), (i = n.querySelector("[data-action='reset-defaults']")) == null || i.addEventListener("click", () => {
    C(this, le, Jd).call(this);
  }), (r = n.querySelector("[data-action='close-switcher']")) == null || r.addEventListener("click", () => {
    this.close();
  }));
}, "#bindEvents"), Wd = /* @__PURE__ */ c(function() {
  f(this, mn) === null && L(this, mn, Hooks.on("eidolon-utilities.criteriaStateApplied", (n, i) => {
    !f(this, Fe) || (n == null ? void 0 : n.id) !== f(this, Fe).id || f(this, ei) || (L(this, st, { ...i ?? {} }), this.render({ force: !0 }));
  }));
}, "#ensureSyncHook"), il = /* @__PURE__ */ c(async function(n) {
  var i, r;
  if (f(this, Fe)) {
    C(this, le, ar).call(this, "applying"), L(this, ei, !0);
    try {
      const a = await Ud(n, f(this, Fe));
      a && L(this, st, a), C(this, le, ar).call(this, "ready"), this.render({ force: !0 });
    } catch (a) {
      console.error(`${ie} | Failed to apply criteria state`, a), (r = (i = ui.notifications) == null ? void 0 : i.error) == null || r.call(
        i,
        E(
          "EIDOLON.CriteriaSwitcher.ApplyError",
          "Failed to apply the selected criteria state."
        )
      ), C(this, le, ar).call(this, "error", (a == null ? void 0 : a.message) ?? "Unknown error");
    } finally {
      L(this, ei, !1), f(this, xt) && C(this, le, rl).call(this);
    }
  }
}, "#applyPartialState"), Kd = /* @__PURE__ */ c(function(n) {
  L(this, xt, {
    ...f(this, xt) ?? {},
    ...n ?? {}
  }), f(this, Ke) !== null && clearTimeout(f(this, Ke)), C(this, le, ar).call(this, "applying"), L(this, Ke, setTimeout(() => {
    L(this, Ke, null), C(this, le, rl).call(this);
  }, f(this, ko)));
}, "#queuePartialState"), rl = /* @__PURE__ */ c(async function() {
  if (f(this, ei) || !f(this, xt)) return;
  const n = f(this, xt);
  L(this, xt, null), await C(this, le, il).call(this, n);
}, "#flushPendingState"), Jd = /* @__PURE__ */ c(async function() {
  if (!f(this, ot).length) return;
  const n = f(this, ot).reduce((i, r) => (i[r.key] = r.default, i), {});
  L(this, st, n), f(this, Ke) !== null && (clearTimeout(f(this, Ke)), L(this, Ke, null)), L(this, xt, null), await C(this, le, il).call(this, n);
}, "#resetToDefaults"), ar = /* @__PURE__ */ c(function(n, i = "") {
  const r = this.element;
  if (!(r instanceof HTMLElement)) return;
  const a = r.querySelector("[data-role='status']");
  if (a instanceof HTMLElement)
    switch (a.dataset.mode = n, n) {
      case "applying":
        a.textContent = E("EIDOLON.CriteriaSwitcher.Applying", "Applying changes...");
        break;
      case "error":
        a.textContent = `${E("EIDOLON.CriteriaSwitcher.Error", "Error")}: ${i}`;
        break;
      case "ready":
      default:
        a.textContent = `${E("EIDOLON.CriteriaSwitcher.Ready", "Ready")}: ${C(this, le, al).call(this)}`;
        break;
    }
}, "#setStatus"), al = /* @__PURE__ */ c(function() {
  return f(this, ot).length ? `[${f(this, ot).map((n) => {
    var i;
    return ((i = f(this, st)) == null ? void 0 : i[n.key]) ?? n.default;
  }).join(" | ")}]` : "-";
}, "#formatStateSummary"), c(pt, "CriteriaSwitcherApplication"), pe(pt, "APP_ID", `${ie}-criteria-switcher`), pe(pt, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  $e(pt, pt, "DEFAULT_OPTIONS"),
  {
    id: pt.APP_ID,
    classes: Array.from(
      /* @__PURE__ */ new Set([...((xu = $e(pt, pt, "DEFAULT_OPTIONS")) == null ? void 0 : xu.classes) ?? [], "eidolon-criteria-switcher-window", "themed"])
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
)), pe(pt, "PARTS", {
  content: {
    template: `modules/${ie}/templates/criteria-switcher.html`
  }
});
let nl = pt;
const ig = Do(nl);
let ci = null;
function rg(e) {
  var t;
  return e ?? ((t = game.scenes) == null ? void 0 : t.viewed) ?? null;
}
c(rg, "resolveScene");
function ag(e) {
  var t;
  return !!(e != null && e.rendered && ((t = e == null ? void 0 : e.element) != null && t.isConnected));
}
c(ag, "isRendered");
function qo() {
  return ag(ci) ? ci : (ci = null, null);
}
c(qo, "getCriteriaSwitcher");
function Yd(e) {
  var i, r, a, o, s;
  const t = rg(e);
  if (!t)
    return (r = (i = ui.notifications) == null ? void 0 : i.warn) == null || r.call(i, "No active scene to open the criteria switcher."), null;
  if (!Po(t))
    return (o = (a = ui.notifications) == null ? void 0 : a.warn) == null || o.call(a, "You do not have permission to manage scene criteria."), null;
  const n = qo();
  return n ? (n.setScene(t), n.render({ force: !0 }), (s = n.bringToFront) == null || s.call(n), n) : (ci = ig({ scene: t }), ci.render({ force: !0 }), ci);
}
c(Yd, "openCriteriaSwitcher");
function Xd() {
  const e = qo();
  e && (e.close(), ci = null);
}
c(Xd, "closeCriteriaSwitcher");
function ac(e) {
  return qo() ? (Xd(), null) : Yd(e);
}
c(ac, "toggleCriteriaSwitcher");
const og = {
  SCHEMA_VERSION: tc,
  applyState: Ud,
  getState: Jh,
  getVersion: Xh,
  setVersion: Vd,
  getCriteria(e) {
    var t;
    return ut(e ?? ((t = game.scenes) == null ? void 0 : t.viewed));
  },
  setCriteria(e, t) {
    var n;
    return xo(t ?? ((n = game.scenes) == null ? void 0 : n.viewed), e);
  },
  updateTiles: Dd,
  updatePlaceables: Bd,
  indexScene: ng,
  openCriteriaSwitcher: Yd,
  closeCriteriaSwitcher: Xd,
  toggleCriteriaSwitcher: ac,
  findBestMatch: dh,
  findFileIndex: fh,
  resolveRules: Md
};
function sg(e) {
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
c(sg, "findTabNav");
function lg(e, t) {
  var i, r, a;
  return e instanceof HTMLElement ? [
    (i = e.querySelector(".tab[data-tab]")) == null ? void 0 : i.parentElement,
    e.querySelector(".sheet-body"),
    (a = (r = t == null ? void 0 : t.parentElement) == null ? void 0 : r.querySelector) == null ? void 0 : a.call(r, ":scope > .sheet-body"),
    t == null ? void 0 : t.parentElement
  ].find((o) => o instanceof HTMLElement) ?? null : null;
}
c(lg, "findTabBody");
function cg(e, t) {
  var n, i, r, a, o, s, l;
  return ((n = e == null ? void 0 : e.dataset) == null ? void 0 : n.group) ?? ((a = (r = (i = e == null ? void 0 : e.querySelector) == null ? void 0 : i.call(e, "[data-group]")) == null ? void 0 : r.dataset) == null ? void 0 : a.group) ?? ((l = (s = (o = t == null ? void 0 : t.querySelector) == null ? void 0 : o.call(t, ".tab[data-group]")) == null ? void 0 : s.dataset) == null ? void 0 : l.group) ?? "main";
}
c(cg, "getTabGroup");
function ug(e, t, n) {
  if (!(e instanceof HTMLElement)) return;
  e.textContent = "";
  const i = document.createElement("i");
  i.className = n, i.setAttribute("inert", ""), e.append(i, " ");
  const r = document.createElement("span");
  r.textContent = t, e.append(r);
}
c(ug, "setTabButtonContent");
function dg(e, t, n) {
  const i = e.querySelector("[data-tab]"), r = (i == null ? void 0 : i.tagName) || "A", a = document.createElement(r);
  return i instanceof HTMLElement && (a.className = i.className), a.classList.remove("active"), r === "BUTTON" && (a.type = "button"), a.dataset.action = "tab", a.dataset.tab = n, a.dataset.group = t, a.setAttribute("aria-selected", "false"), a.setAttribute("aria-pressed", "false"), a;
}
c(dg, "createTabButton");
function fg(e, t, n) {
  const i = document.createElement("div");
  i.classList.add("tab"), i.dataset.tab = n, i.dataset.group = t, i.dataset.applicationPart = n, i.setAttribute("hidden", "true");
  const r = yd(e);
  return e.insertBefore(i, r ?? null), i;
}
c(fg, "createTabPanel");
function cs(e, t, n, i, r) {
  var s;
  if (!(i instanceof HTMLElement) || !(r instanceof HTMLElement)) return;
  const a = (s = e == null ? void 0 : e.tabGroups) == null ? void 0 : s[t];
  if (typeof a == "string" ? a === n : i.classList.contains("active") || r.classList.contains("active")) {
    i.classList.add("active"), i.setAttribute("aria-selected", "true"), i.setAttribute("aria-pressed", "true"), r.classList.add("active"), r.removeAttribute("hidden"), r.removeAttribute("aria-hidden");
    return;
  }
  i.classList.remove("active"), i.setAttribute("aria-selected", "false"), i.setAttribute("aria-pressed", "false"), r.classList.remove("active"), r.setAttribute("hidden", "true");
}
c(cs, "syncTabVisibility");
function oc(e, t, n, i, r) {
  const a = sg(t), o = lg(t, a);
  if (!(a instanceof HTMLElement) || !(o instanceof HTMLElement)) return null;
  const s = cg(a, o);
  let l = a.querySelector(`[data-tab="${n}"]`);
  l instanceof HTMLElement || (l = dg(a, s, n), a.appendChild(l)), ug(l, i, r);
  let u = o.querySelector(`.tab[data-tab="${n}"]`);
  u instanceof HTMLElement || (u = fg(o, s, n));
  const d = `data-eidolon-bound-${n}`;
  return l.hasAttribute(d) || (l.addEventListener("click", () => {
    gd(e, n, s), requestAnimationFrame(() => {
      cs(e, s, n, l, u);
    });
  }), l.setAttribute(d, "true")), cs(e, s, n, l, u), requestAnimationFrame(() => {
    cs(e, s, n, l, u);
  }), mg(e, a), u;
}
c(oc, "ensureTileConfigTab");
function mg(e, t) {
  !(e != null && e.setPosition) || !(t instanceof HTMLElement) || requestAnimationFrame(() => {
    var a;
    if (t.scrollWidth <= t.clientWidth) return;
    const n = t.scrollWidth - t.clientWidth, i = e.element instanceof HTMLElement ? e.element : (a = e.element) == null ? void 0 : a[0];
    if (!i) return;
    const r = i.offsetWidth || 480;
    e.setPosition({ width: r + n + 16 });
  });
}
c(mg, "fitNavWidth");
function Qd(e) {
  var t;
  return ((t = e == null ? void 0 : e.getFlag) == null ? void 0 : t.call(e, "monks-active-tiles", "files")) ?? [];
}
c(Qd, "getTileFiles$1");
function hg(e = []) {
  return {
    strategy: "select-one",
    defaultTarget: kn(e, 0) ?? { indexHint: 0 },
    variants: [
      {
        criteria: {},
        target: kn(e, 0) ?? { indexHint: 0 }
      }
    ]
  };
}
c(hg, "createDefaultTileCriteria");
function gg(e, t = {}) {
  var o, s;
  const { allowLegacy: n = !0 } = t, i = Qd(e), r = (o = e == null ? void 0 : e.getFlag) == null ? void 0 : o.call(e, ie, si);
  if (r) return mi(r, { files: i });
  if (!n) return null;
  const a = (s = e == null ? void 0 : e.getFlag) == null ? void 0 : s.call(e, ie, oi);
  return a ? mi(a, { files: i }) : null;
}
c(gg, "getTileCriteria");
async function Yc(e, t, n = {}) {
  if (!(e != null && e.setFlag)) return null;
  const {
    strictValidation: i = !0
  } = n, r = Qd(e), a = mi(t, { files: r });
  if (!a)
    return typeof e.unsetFlag == "function" ? (await e.unsetFlag(ie, si), await e.unsetFlag(ie, oi)) : (await e.setFlag(ie, si, null), await e.setFlag(ie, oi, null)), null;
  if (i) {
    const o = _d(a, { files: r });
    if (o.errors.length > 0)
      throw new Error(
        `Tile criteria contains ${o.errors.length} conflicting rule pair(s). Resolve clashes before saving.`
      );
  }
  return await e.setFlag(ie, si, a), typeof e.unsetFlag == "function" && await e.unsetFlag(ie, oi), a;
}
c(Yc, "setTileCriteria");
const ol = "__eidolon_any__", sl = "eidolon-tile-criteria", pg = "fa-solid fa-sliders", Zd = Symbol.for("eidolon.tileCriteriaUiState"), jo = ["all", "unmapped", "mapped", "conflicts"];
function yg(e) {
  const t = e == null ? void 0 : e[Zd];
  return !t || typeof t != "object" ? {
    filterQuery: "",
    filterMode: "all",
    selectedFileIndex: null
  } : {
    filterQuery: typeof t.filterQuery == "string" ? t.filterQuery : "",
    filterMode: jo.includes(t.filterMode) ? t.filterMode : "all",
    selectedFileIndex: Number.isInteger(t.selectedFileIndex) ? t.selectedFileIndex : null
  };
}
c(yg, "readUiState");
function bg(e, t) {
  if (!e || !t) return;
  typeof t.filterQuery == "string" && (e.filterQuery = t.filterQuery), jo.includes(t.filterMode) && (e.filterMode = t.filterMode), Number.isInteger(t.selectedFileIndex) && e.fileEntries.some((i) => i.index === t.selectedFileIndex) && (e.selectedFileIndex = t.selectedFileIndex);
}
c(bg, "applyUiState");
function vg(e) {
  const t = e == null ? void 0 : e.app, n = e == null ? void 0 : e.state;
  !t || !n || (t[Zd] = {
    filterQuery: typeof n.filterQuery == "string" ? n.filterQuery : "",
    filterMode: jo.includes(n.filterMode) ? n.filterMode : "all",
    selectedFileIndex: Number.isInteger(n.selectedFileIndex) ? n.selectedFileIndex : null
  });
}
c(vg, "persistUiState");
function wg(e) {
  const t = (e == null ? void 0 : e.object) ?? (e == null ? void 0 : e.document) ?? null;
  return !(t != null && t.isEmbedded) || t.documentName !== "Tile" ? null : t;
}
c(wg, "getTileDocument$2");
function Eg(e) {
  var t;
  return ((t = e == null ? void 0 : e.getFlag) == null ? void 0 : t.call(e, "monks-active-tiles", "files")) ?? [];
}
c(Eg, "getTileFiles");
function Sg(e, t) {
  var s;
  const n = (e == null ? void 0 : e.parent) ?? ((s = game.scenes) == null ? void 0 : s.viewed) ?? null, r = ut(n).sort((l, u) => l.order - u.order).map((l) => ({
    key: l.key,
    label: l.label || l.key,
    values: [...l.values ?? []]
  })), a = new Set(r.map((l) => l.key)), o = /* @__PURE__ */ new Map();
  for (const l of (t == null ? void 0 : t.variants) ?? [])
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
c(Sg, "getCriteriaDefinitions");
function Cg(e) {
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
    const a = r.pop();
    let o = t;
    for (const s of r)
      o.folders.has(s) || o.folders.set(s, {
        folders: /* @__PURE__ */ new Map(),
        files: []
      }), o = o.folders.get(s);
    o.files.push({ entry: n, name: a || n.label });
  }
  return t;
}
c(Cg, "buildTree");
function Tg(e, t) {
  const n = [e];
  let i = t;
  for (; i.files.length === 0 && i.folders.size === 1; ) {
    const [r, a] = i.folders.entries().next().value;
    n.push(r), i = a;
  }
  return {
    label: n.join("/"),
    node: i
  };
}
c(Tg, "collapseFolderBranch");
function Lg(e, t) {
  const n = e.rulesByFile.get(t) ?? [], i = [];
  for (const r of n) {
    const a = Object.entries(r.criteria ?? {}).filter(([, s]) => typeof s == "string" && s.trim());
    if (!a.length) {
      i.push("*");
      continue;
    }
    const o = a.map(([s, l]) => `${e.criteriaLabels.get(s) ?? s}: ${l}`).join(" · ");
    i.push(o);
  }
  return i;
}
c(Lg, "getRuleSummariesForFile");
function ll(e) {
  var y, p;
  const t = Eg(e), n = nc(t), i = gg(e, { allowLegacy: !0 }) ?? hg(t), r = Sg(e, i), a = new Map(r.map((g) => [g.key, g.label])), o = new Map(
    n.map((g) => [
      g.index,
      g.path || g.label
    ])
  ), s = br(i.defaultTarget, t), l = ((y = n[0]) == null ? void 0 : y.index) ?? 0, u = s >= 0 ? s : l, d = new Map(n.map((g) => [g.index, []]));
  let m = 1;
  for (const g of i.variants ?? []) {
    const v = br(g.target, t);
    v < 0 || (d.has(v) || d.set(v, []), d.get(v).push({
      id: m,
      criteria: { ...g.criteria ?? {} }
    }), m += 1);
  }
  const h = n.some((g) => g.index === u) ? u : ((p = n[0]) == null ? void 0 : p.index) ?? null;
  return {
    files: t,
    fileEntries: n,
    criteriaDefinitions: r,
    criteriaLabels: a,
    relativePaths: o,
    defaultIndex: u,
    selectedFileIndex: h,
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
c(ll, "buildEditorState");
function cl(e, t) {
  return e.rulesByFile.has(t) || e.rulesByFile.set(t, []), e.rulesByFile.get(t);
}
c(cl, "getRulesForFile");
function Ig(e) {
  return Object.fromEntries(
    Object.entries(e ?? {}).filter(([t, n]) => typeof t == "string" && t && typeof n == "string" && n.trim()).map(([t, n]) => [t, n.trim()])
  );
}
c(Ig, "sanitizeRuleCriteria");
function ef(e) {
  const t = kn(e.files, e.defaultIndex);
  if (!t) return null;
  const n = [], i = [];
  for (const [a, o] of e.rulesByFile.entries()) {
    const s = kn(e.files, a);
    if (s)
      for (const [l, u] of o.entries()) {
        const d = Ig(u.criteria);
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
    target: { ...t }
  }), i.push({
    fileIndex: e.defaultIndex,
    ruleId: null,
    rulePosition: null,
    criteria: {},
    isFallback: !0
  })), {
    normalized: mi(
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
c(ef, "buildTileCriteriaDraft");
function Og(e) {
  var t;
  return ((t = ef(e)) == null ? void 0 : t.normalized) ?? null;
}
c(Og, "exportTileCriteria");
function Xc(e) {
  const t = ef(e);
  if (!(t != null && t.normalized))
    return {
      errors: [],
      warnings: [],
      errorFileIndexes: [],
      warningFileIndexes: []
    };
  const n = _d(t.normalized, { files: e.files }), i = /* @__PURE__ */ c((s) => {
    const l = t.sources[s.leftIndex] ?? null, u = t.sources[s.rightIndex] ?? null;
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
c(Xc, "analyzeRuleConflicts");
function aa(e, t = "neutral") {
  const n = document.createElement("span");
  return n.classList.add("eidolon-tile-criteria__badge"), n.dataset.kind = t, n.textContent = e, n;
}
c(aa, "createBadge");
function Ag(e, t = {}) {
  const n = typeof e == "string" ? e : "", {
    maxLength: i = 42,
    headLength: r = 20,
    tailLength: a = 16
  } = t;
  if (!n || n.length <= i) return n;
  const o = n.slice(0, r).trimEnd(), s = n.slice(-a).trimStart();
  return `${o}...${s}`;
}
c(Ag, "middleEllipsis");
function kg(e) {
  const t = typeof e == "string" ? e.trim() : "";
  if (!t)
    return {
      error: "",
      matches: /* @__PURE__ */ c(() => !0, "matches")
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
      matches: /* @__PURE__ */ c((a) => r.test(String(a ?? "")), "matches")
    };
  } catch (r) {
    return {
      error: (r == null ? void 0 : r.message) ?? E("EIDOLON.TileCriteria.InvalidRegex", "Invalid regex."),
      matches: /* @__PURE__ */ c(() => !0, "matches")
    };
  }
}
c(kg, "createRegexFilter");
function Mg(e, t) {
  const n = document.createElement("select");
  n.dataset.criteriaKey = e.key;
  const i = document.createElement("option");
  i.value = ol, i.textContent = "*", n.appendChild(i);
  const r = new Set(e.values ?? []);
  t && !r.has(t) && r.add(t);
  for (const a of r) {
    const o = document.createElement("option");
    o.value = a, o.textContent = a, n.appendChild(o);
  }
  return n.value = t ?? ol, n;
}
c(Mg, "createCriterionSelect");
function Ng(e, t, n, i) {
  var s;
  const r = document.createElement("div");
  r.classList.add("eidolon-tile-criteria__rule-editor");
  const a = document.createElement("div");
  a.classList.add("eidolon-tile-criteria__rule-grid");
  for (const l of t.criteriaDefinitions) {
    const u = document.createElement("label");
    u.classList.add("eidolon-tile-criteria__rule-field");
    const d = document.createElement("span");
    d.classList.add("eidolon-tile-criteria__criterion-label"), d.textContent = l.label, u.appendChild(d);
    const m = Mg(l, (s = e.criteria) == null ? void 0 : s[l.key]);
    m.addEventListener("change", () => {
      m.value === ol ? delete e.criteria[l.key] : e.criteria[l.key] = m.value, i();
    }), u.appendChild(m), a.appendChild(u);
  }
  r.appendChild(a);
  const o = document.createElement("button");
  return o.type = "button", o.classList.add("control", "ui-control", "eidolon-tile-criteria__rule-remove"), o.textContent = E("EIDOLON.TileCriteria.RemoveRule", "Remove"), o.addEventListener("click", () => {
    const u = cl(t, n).filter((d) => d.id !== e.id);
    t.rulesByFile.set(n, u), i();
  }), r.appendChild(o), r;
}
c(Ng, "renderRuleEditor");
const va = /* @__PURE__ */ new WeakMap();
function tf(e) {
  return (e == null ? void 0 : e.app) ?? (e == null ? void 0 : e.tile) ?? null;
}
c(tf, "getDialogOwner");
function _g(e) {
  for (const t of e) {
    const n = kt(t);
    if (n) return n;
    const i = kt(t == null ? void 0 : t.element);
    if (i) return i;
  }
  return null;
}
c(_g, "findDialogRoot$1");
function $g(e, t, n) {
  const i = e.state, r = i.fileEntries.find((g) => g.index === t);
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
    i.defaultIndex = r.index, Be(e), n();
  })), u.appendChild(d);
  const m = document.createElement("button");
  m.type = "button", m.classList.add("control", "ui-control", "eidolon-tile-criteria__editor-action", "secondary"), m.textContent = E("EIDOLON.TileCriteria.ClearFileRules", "Clear File Rules"), m.addEventListener("click", () => {
    i.rulesByFile.set(r.index, []), Be(e), n();
  }), u.appendChild(m), a.appendChild(u);
  const h = document.createElement("div");
  h.classList.add("eidolon-tile-criteria__rule-editors");
  const y = cl(i, r.index);
  if (y.length)
    for (const g of y)
      h.appendChild(
        Ng(g, i, r.index, () => {
          Be(e), n();
        })
      );
  else {
    const g = document.createElement("p");
    g.classList.add("notes"), g.textContent = E(
      "EIDOLON.TileCriteria.NoRulesForFile",
      "No rules map to this file yet. Add one to define when this variant should be active."
    ), h.appendChild(g);
  }
  a.appendChild(h);
  const p = document.createElement("button");
  return p.type = "button", p.classList.add("control", "ui-control", "eidolon-tile-criteria__editor-action"), p.textContent = E("EIDOLON.TileCriteria.AddRule", "Add Rule"), p.disabled = !i.criteriaDefinitions.length, p.addEventListener("click", () => {
    cl(i, r.index).push({
      id: i.nextRuleId,
      criteria: {}
    }), i.nextRuleId += 1, Be(e), n();
  }), a.appendChild(p), a;
}
c($g, "buildRuleEditorContent");
function Dg(e, t) {
  var m, h, y;
  const n = tf(e);
  if (!n) return;
  const i = va.get(n);
  if (i) {
    i.controller = e, i.fileIndex = t, (m = i.refresh) == null || m.call(i);
    return;
  }
  const r = {
    controller: e,
    fileIndex: t,
    host: null,
    refresh: null
  };
  va.set(n, r);
  const a = /* @__PURE__ */ c(() => {
    va.delete(n);
  }, "closeDialog"), o = /* @__PURE__ */ c(() => {
    r.host instanceof HTMLElement && r.host.replaceChildren(
      $g(r.controller, r.fileIndex, o)
    );
  }, "refreshDialog");
  r.refresh = o;
  const s = E("EIDOLON.TileCriteria.EditorTitle", "Edit Tile Criteria Rules"), l = '<div class="eidolon-tile-criteria-editor-host"></div>', u = E("EIDOLON.TileCriteria.CloseEditor", "Close"), d = (y = (h = foundry == null ? void 0 : foundry.applications) == null ? void 0 : h.api) == null ? void 0 : y.DialogV2;
  if (typeof (d == null ? void 0 : d.wait) == "function") {
    d.wait({
      window: { title: s },
      content: l,
      buttons: [{ action: "close", label: u, default: !0 }],
      render: /* @__PURE__ */ c((...p) => {
        var b;
        const g = _g(p), v = (b = g == null ? void 0 : g.querySelector) == null ? void 0 : b.call(g, ".eidolon-tile-criteria-editor-host");
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
c(Dg, "openRuleEditorDialog");
function Qc(e) {
  var i;
  const t = tf(e);
  if (!t) return;
  const n = va.get(t);
  (i = n == null ? void 0 : n.refresh) == null || i.call(n);
}
c(Qc, "refreshOpenRuleEditor");
function ul(e, t) {
  return (e.rulesByFile.get(t) ?? []).length > 0;
}
c(ul, "hasRulesForFile");
function nf(e, t) {
  var n, i;
  return ((n = e == null ? void 0 : e.errorFileIndexes) == null ? void 0 : n.includes(t)) || ((i = e == null ? void 0 : e.warningFileIndexes) == null ? void 0 : i.includes(t));
}
c(nf, "hasConflictForFile");
function Fg(e, t, n) {
  switch (e.filterMode) {
    case "unmapped":
      return !ul(e, t.index);
    case "mapped":
      return ul(e, t.index);
    case "conflicts":
      return nf(n, t.index);
    case "all":
    default:
      return !0;
  }
}
c(Fg, "matchesFilterMode");
function xg(e, t) {
  let n = 0, i = 0, r = 0;
  for (const a of e.fileEntries)
    ul(e, a.index) ? n += 1 : i += 1, nf(t, a.index) && (r += 1);
  return {
    all: e.fileEntries.length,
    mapped: n,
    unmapped: i,
    conflicts: r
  };
}
c(xg, "getFilterModeCounts");
function Pg(e) {
  switch (e) {
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
c(Pg, "getFilterModeLabel");
function rf(e, t, n, i, r) {
  var u, d;
  const a = [...e.folders.keys()].sort((m, h) => m.localeCompare(h));
  for (const m of a) {
    const h = Tg(m, e.folders.get(m)), y = document.createElement("li");
    y.classList.add("eidolon-tile-criteria__tree-branch");
    const p = document.createElement("div");
    p.classList.add("document", "folder", "update", "eidolon-tile-criteria__folder-row");
    const g = document.createElement("i");
    g.classList.add("fa-solid", "fa-folder-open"), p.appendChild(g);
    const v = document.createElement("span");
    v.classList.add("eidolon-tile-criteria__tree-folder-label"), v.textContent = h.label, v.title = h.label, p.appendChild(v), y.appendChild(p);
    const b = document.createElement("ul");
    b.classList.add("eidolon-tile-criteria__tree"), b.dataset.folder = h.label, rf(h.node, t, n, i, b), b.childElementCount > 0 && y.appendChild(b), r.appendChild(y);
  }
  const o = [...e.files].sort((m, h) => m.name.localeCompare(h.name));
  if (!o.length) return;
  const s = document.createElement("li"), l = document.createElement("ul");
  l.classList.add("document-list", "eidolon-tile-criteria__document-list");
  for (const m of o) {
    const h = m.entry, y = h.index === t.selectedFileIndex, p = h.index === t.defaultIndex, g = Lg(t, h.index), v = document.createElement("li");
    v.classList.add("document", "update", "eidolon-tile-criteria__tree-file");
    const b = document.createElement("button");
    b.type = "button", b.classList.add("eidolon-tile-criteria__file-row");
    const w = (u = i == null ? void 0 : i.errorFileIndexes) == null ? void 0 : u.includes(h.index), S = (d = i == null ? void 0 : i.warningFileIndexes) == null ? void 0 : d.includes(h.index);
    w ? b.classList.add("has-conflict") : S && b.classList.add("has-warning");
    const I = t.relativePaths.get(h.index) || h.path || m.name, O = [I];
    w ? O.push(
      E(
        "EIDOLON.TileCriteria.ConflictFileHint",
        "This file participates in one or more conflicting rules."
      )
    ) : S && O.push(
      E(
        "EIDOLON.TileCriteria.WarningFileHint",
        "This file has potentially redundant rules."
      )
    ), g.length || O.push(
      E(
        "EIDOLON.TileCriteria.UnmappedHint",
        "No criteria rules map to this file."
      )
    ), b.title = O.join(`
`), y && b.classList.add("is-selected"), b.addEventListener("click", () => {
      t.selectedFileIndex = h.index, Be(n), Dg(n, h.index);
    });
    const k = document.createElement("span");
    k.classList.add("eidolon-tile-criteria__indicator"), k.dataset.kind = p ? "default" : g.length ? "mapped" : "unmapped", b.appendChild(k);
    const M = document.createElement("span");
    M.classList.add("eidolon-tile-criteria__file-content");
    const x = document.createElement("span");
    x.classList.add("eidolon-tile-criteria__file-heading");
    const R = document.createElement("span");
    R.classList.add("eidolon-tile-criteria__file-title"), R.textContent = Ag(m.name || h.label), R.title = I, x.appendChild(R);
    const F = aa(`#${h.index + 1}`, "meta");
    F.classList.add("eidolon-tile-criteria__index-badge"), x.appendChild(F), M.appendChild(x);
    const D = document.createElement("span");
    D.classList.add("eidolon-tile-criteria__badges"), p && D.appendChild(aa(E("EIDOLON.TileCriteria.DefaultBadge", "Default"), "default"));
    const _ = g.slice(0, 2);
    for (const H of _)
      D.appendChild(aa(H, "rule"));
    if (g.length > _.length && D.appendChild(aa(`+${g.length - _.length}`, "meta")), M.appendChild(D), b.appendChild(M), w || S) {
      const H = document.createElement("span");
      H.classList.add("eidolon-tile-criteria__row-warning"), H.dataset.mode = w ? "error" : "warning", H.innerHTML = '<i class="fa-solid fa-triangle-exclamation" inert=""></i>', b.appendChild(H);
    }
    v.appendChild(b), l.appendChild(v);
  }
  s.appendChild(l), r.appendChild(s);
}
c(rf, "renderTreeNode");
function Rg(e, t, n, i = {}) {
  const r = document.createElement("section");
  r.classList.add("eidolon-tile-criteria__tree-panel");
  const a = kg(e.filterQuery), o = xg(e, n);
  e.filterMode !== "all" && o[e.filterMode] === 0 && (e.filterMode = "all");
  const s = document.createElement("div");
  s.classList.add("eidolon-tile-criteria__toolbar");
  const l = document.createElement("div");
  l.classList.add("eidolon-tile-criteria__mode-bar");
  for (const w of jo) {
    const S = document.createElement("button");
    S.type = "button", S.classList.add("control", "ui-control", "eidolon-tile-criteria__mode-button"), S.dataset.mode = w, S.textContent = Pg(w);
    const I = w === "all" || o[w] > 0;
    S.disabled = !I, I || (S.dataset.tooltip = E(
      "EIDOLON.TileCriteria.FilterModeUnavailable",
      "No entries currently match this filter."
    ), S.title = S.dataset.tooltip), e.filterMode === w ? (S.classList.add("is-active"), S.setAttribute("aria-pressed", "true")) : S.setAttribute("aria-pressed", "false"), S.addEventListener("click", () => {
      e.filterMode !== w && (e.filterMode = w, Be(t));
    }), l.appendChild(S);
  }
  s.appendChild(l);
  const u = document.createElement("div");
  u.classList.add("eidolon-tile-criteria__filter-row");
  const d = document.createElement("input");
  d.type = "text", d.classList.add("eidolon-tile-criteria__filter-input"), d.placeholder = E("EIDOLON.TileCriteria.FilterPlaceholder", "Regex filter (path)"), d.value = e.filterQuery, d.autocomplete = "off", d.addEventListener("keydown", (w) => {
    w.stopPropagation(), w.key === "Enter" && w.preventDefault();
  }), d.addEventListener("keyup", (w) => {
    w.stopPropagation();
  }), d.addEventListener("change", (w) => {
    w.stopPropagation();
  }), d.addEventListener("input", (w) => {
    w.stopPropagation();
    const S = d.selectionStart ?? d.value.length, I = d.selectionEnd ?? S;
    e.filterQuery = d.value, Be(t), requestAnimationFrame(() => {
      const O = t.section.querySelector(".eidolon-tile-criteria__filter-input");
      if (O instanceof HTMLInputElement) {
        O.focus();
        try {
          O.setSelectionRange(S, I);
        } catch {
        }
      }
    });
  }), u.appendChild(d);
  const m = document.createElement("div");
  m.classList.add("eidolon-tile-criteria__toolbar-actions");
  const h = document.createElement("button");
  h.type = "button";
  const y = E("EIDOLON.TileCriteria.Save", "Save Rules");
  h.classList.add("control", "ui-control", "eidolon-tile-criteria__toolbar-action", "icon-only"), h.dataset.tooltip = y, h.setAttribute("aria-label", y), h.title = y, h.innerHTML = '<i class="fa-solid fa-floppy-disk" inert=""></i>', h.disabled = n.errors.length > 0, h.addEventListener("click", () => {
    var w;
    (w = i.onSave) == null || w.call(i);
  }), m.appendChild(h);
  const p = document.createElement("button");
  p.type = "button";
  const g = E("EIDOLON.TileCriteria.Clear", "Clear Rules");
  if (p.classList.add("control", "ui-control", "secondary", "eidolon-tile-criteria__toolbar-action", "icon-only"), p.dataset.tooltip = g, p.setAttribute("aria-label", g), p.title = g, p.innerHTML = '<i class="fa-solid fa-trash" inert=""></i>', p.addEventListener("click", () => {
    var w;
    (w = i.onClear) == null || w.call(i);
  }), m.appendChild(p), u.appendChild(m), s.appendChild(u), r.appendChild(s), a.error) {
    const w = document.createElement("p");
    w.classList.add("notes", "eidolon-tile-criteria__filter-error"), w.textContent = `${E("EIDOLON.TileCriteria.InvalidRegex", "Invalid regex")}: ${a.error}`, r.appendChild(w);
  }
  const v = document.createElement("div");
  v.classList.add("eidolon-tile-criteria__library-tree");
  const b = e.fileEntries.filter((w) => {
    const S = e.relativePaths.get(w.index) || w.path || w.label;
    return Fg(e, w, n) && a.matches(S);
  });
  if (e.fileEntries.length)
    if (b.length) {
      const w = document.createElement("ul");
      w.classList.add("eidolon-tile-criteria__tree"), rf(Cg(b), e, t, n, w), v.appendChild(w);
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
c(Rg, "renderTreePanel");
function Be(e) {
  const { section: t, state: n } = e, i = Xc(n);
  vg(e), t.replaceChildren();
  const r = /* @__PURE__ */ c(async () => {
    try {
      const o = Xc(n);
      if (o.errors.length) {
        n.status = {
          mode: "error",
          message: E(
            "EIDOLON.TileCriteria.ConflictSaveBlocked",
            `Resolve ${o.errors.length} conflict(s) before saving tile criteria rules.`
          )
        }, Be(e);
        return;
      }
      const s = Og(n);
      if (!s) {
        n.status = {
          mode: "error",
          message: E("EIDOLON.TileCriteria.Invalid", "Invalid rules. Select valid target variants.")
        }, Be(e);
        return;
      }
      await Yc(e.tile, s);
      const l = n.filterQuery, u = n.filterMode, d = n.selectedFileIndex;
      e.state = ll(e.tile), e.state.filterQuery = l, e.state.filterMode = u, Number.isInteger(d) && (e.state.selectedFileIndex = d), e.state.status = {
        mode: "ready",
        message: E("EIDOLON.TileCriteria.Saved", "Tile criteria rules saved.")
      }, Be(e), Qc(e);
    } catch (o) {
      console.error(`${ie} | Failed to save tile criteria`, o), n.status = {
        mode: "error",
        message: (o == null ? void 0 : o.message) ?? "Failed to save tile criteria rules."
      }, Be(e);
    }
  }, "handleSave"), a = /* @__PURE__ */ c(async () => {
    try {
      await Yc(e.tile, null);
      const o = n.filterQuery, s = n.filterMode, l = n.selectedFileIndex;
      e.state = ll(e.tile), e.state.filterQuery = o, e.state.filterMode = s, Number.isInteger(l) && (e.state.selectedFileIndex = l), e.state.status = {
        mode: "ready",
        message: E("EIDOLON.TileCriteria.Cleared", "Tile criteria rules cleared.")
      }, Be(e), Qc(e);
    } catch (o) {
      console.error(`${ie} | Failed to clear tile criteria`, o), n.status = {
        mode: "error",
        message: (o == null ? void 0 : o.message) ?? "Failed to clear tile criteria rules."
      }, Be(e);
    }
  }, "handleClear");
  if (t.appendChild(Rg(n, e, i, {
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
    ), o.appendChild(l), t.appendChild(o);
  }
  if (n.status.mode === "error" || n.status.mode === "warning") {
    const o = document.createElement("p");
    o.classList.add("eidolon-tile-criteria__status", "notes"), o.dataset.mode = n.status.mode, o.textContent = n.status.message, t.appendChild(o);
  }
}
c(Be, "renderController");
function Hg(e, t = null) {
  const n = document.createElement("section");
  n.classList.add("eidolon-tile-criteria");
  const i = ll(e);
  bg(i, yg(t));
  const r = {
    app: t,
    tile: e,
    section: n,
    state: i
  };
  return Be(r), r;
}
c(Hg, "createController");
function qg(e, t) {
  return oc(
    e,
    t,
    sl,
    E("EIDOLON.TileCriteria.TabLabel", "Criteria"),
    pg
  );
}
c(qg, "ensureTileCriteriaTab");
function jg() {
  Hooks.on("renderTileConfig", (e, t) => {
    var l, u, d, m;
    const n = kt(t);
    if (!n) return;
    const i = wg(e);
    if (!i) return;
    if ((l = n.querySelector(".eidolon-tile-criteria")) == null || l.remove(), !Fo()) {
      (u = n.querySelector(`.item[data-tab='${sl}']`)) == null || u.remove(), (d = n.querySelector(`.tab[data-tab='${sl}']`)) == null || d.remove();
      return;
    }
    const r = Hg(i, e), a = qg(e, n);
    if (a instanceof HTMLElement) {
      a.replaceChildren(r.section), (m = e.setPosition) == null || m.call(e, { height: "auto" });
      return;
    }
    const o = (e == null ? void 0 : e.form) instanceof HTMLFormElement ? e.form : n instanceof HTMLFormElement ? n : n.querySelector("form");
    if (!(o instanceof HTMLFormElement)) return;
    const s = o.querySelector("button[type='submit']");
    s != null && s.parentElement ? s.parentElement.insertAdjacentElement("beforebegin", r.section) : o.appendChild(r.section);
  });
}
c(jg, "registerTileCriteriaConfigControls");
function Bg(e) {
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
c(Bg, "toList");
function Ug(e, t) {
  const n = e == null ? void 0 : e.tools;
  return Array.isArray(n) ? n.some((i) => (i == null ? void 0 : i.name) === t) : n instanceof Map ? n.has(t) : n && typeof n == "object" ? t in n ? !0 : Object.values(n).some((i) => (i == null ? void 0 : i.name) === t) : !1;
}
c(Ug, "hasTool");
function Vg(e, t) {
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
c(Vg, "addTool");
function zg() {
  Hooks.on("getSceneControlButtons", (e) => {
    var i;
    const t = Bg(e);
    if (!t.length) return;
    const n = t.find((r) => (r == null ? void 0 : r.name) === "tiles") ?? t.find((r) => (r == null ? void 0 : r.name) === "tokens" || (r == null ? void 0 : r.name) === "token") ?? t[0];
    n && (Ug(n, "eidolonCriteriaSwitcher") || Vg(n, {
      name: "eidolonCriteriaSwitcher",
      title: "Criteria Switcher",
      icon: "fa-solid fa-sliders",
      button: !0,
      toggle: !1,
      visible: Po(((i = game.scenes) == null ? void 0 : i.viewed) ?? null),
      onClick: /* @__PURE__ */ c(() => ac(), "onClick")
    }));
  });
}
c(zg, "registerSceneControlButton");
function oa(e, t) {
  if (!e || typeof e != "object") return !1;
  const n = String(t).split(".");
  let i = e;
  for (const r of n) {
    if (!i || typeof i != "object" || !Object.prototype.hasOwnProperty.call(i, r)) return !1;
    i = i[r];
  }
  return !0;
}
c(oa, "hasOwnPath");
function Gg() {
  const e = /* @__PURE__ */ c((i, r = null) => {
    i && Dh(i, r);
  }, "invalidateTileScene"), t = /* @__PURE__ */ c((i, r = null) => {
    i && Kh(i, r);
  }, "invalidatePlaceableScene");
  Hooks.on("createTile", (i) => {
    e((i == null ? void 0 : i.parent) ?? null, i ?? null);
  }), Hooks.on("deleteTile", (i) => {
    e((i == null ? void 0 : i.parent) ?? null, i ?? null);
  }), Hooks.on("updateTile", (i, r) => {
    (oa(r, `flags.${ie}.tileCriteria`) || oa(r, `flags.${ie}.fileIndex`)) && e((i == null ? void 0 : i.parent) ?? null, i ?? null);
  });
  const n = /* @__PURE__ */ c((i) => {
    Hooks.on(`create${i}`, (r) => {
      t((r == null ? void 0 : r.parent) ?? null, r ?? null);
    }), Hooks.on(`delete${i}`, (r) => {
      t((r == null ? void 0 : r.parent) ?? null, r ?? null);
    }), Hooks.on(`update${i}`, (r, a) => {
      const o = oa(a, `flags.${ie}.presets`), s = i === "AmbientLight" && oa(a, `flags.${ie}.lightCriteria`);
      !o && !s || t((r == null ? void 0 : r.parent) ?? null, r ?? null);
    });
  }, "registerPlaceableHooks");
  n("AmbientLight"), n("Wall"), n("AmbientSound"), Hooks.on("canvasReady", (i) => {
    const r = (i == null ? void 0 : i.scene) ?? null;
    r && (e(r), t(r));
  });
}
c(Gg, "registerCriteriaCacheInvalidationHooks");
function Wg() {
  zg(), jg(), Gg(), Hooks.once("init", () => {
    var e, t;
    (t = (e = game.keybindings) == null ? void 0 : e.register) == null || t.call(e, ie, "toggleCriteriaSwitcher", {
      name: "Toggle Criteria Switcher",
      hint: "Open or close the criteria switcher window for live scene state updates.",
      editable: [{ key: "KeyM", modifiers: ["Alt"] }],
      onDown: /* @__PURE__ */ c(() => {
        var n, i, r;
        return Po(((n = game.scenes) == null ? void 0 : n.viewed) ?? null) ? (ac(), !0) : ((r = (i = ui.notifications) == null ? void 0 : i.warn) == null || r.call(i, "You do not have permission to manage scene criteria."), !0);
      }, "onDown"),
      restricted: !0,
      precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL
    });
  }), Hooks.on("canvasReady", (e) => {
    var n;
    const t = qo();
    t && (t.setScene((e == null ? void 0 : e.scene) ?? ((n = game.scenes) == null ? void 0 : n.viewed) ?? null), t.render({ force: !0 }));
  }), Hooks.once("ready", () => {
    var t, n;
    const e = (n = (t = game.modules) == null ? void 0 : t.get) == null ? void 0 : n.call(t, ie);
    e && (e.api || (e.api = {}), e.api.criteria = og, console.log(`${ie} | Criteria engine API registered`));
  });
}
c(Wg, "registerCriteriaEngineHooks");
Wg();
const wa = /* @__PURE__ */ new WeakMap(), sa = /* @__PURE__ */ new WeakMap(), ge = "__eidolon_default__";
function Kg() {
  Hooks.on("renderAmbientLightConfig", Jg), N("LightCriteria | AmbientLightConfig controls registered");
}
c(Kg, "registerAmbientLightCriteriaControls");
function Jg(e, t) {
  var n;
  Bi("LightCriteria | renderAmbientLightConfig", {
    appId: (e == null ? void 0 : e.id) ?? null,
    constructor: ((n = e == null ? void 0 : e.constructor) == null ? void 0 : n.name) ?? null,
    isRendered: (e == null ? void 0 : e.rendered) ?? !1
  });
  try {
    const i = kt(t);
    if (!i) return;
    if (!Fo()) {
      i.querySelectorAll(".eidolon-light-criteria, .eidolon-light-criteria-main-switcher").forEach((r) => r.remove());
      return;
    }
    Yg(e, i);
  } catch (i) {
    console.error("eidolon-utilities | Failed to enhance AmbientLightConfig UI", i);
  } finally {
    Cn();
  }
}
c(Jg, "handleAmbientLightConfigRender");
function Yg(e, t) {
  var Ae, Rn, Xi, Qr, Lc;
  const n = (e == null ? void 0 : e.form) instanceof HTMLFormElement ? e.form : t instanceof HTMLFormElement ? t : (Ae = t == null ? void 0 : t.closest) == null ? void 0 : Ae.call(t, "form");
  if (!(n instanceof HTMLFormElement)) return;
  const i = n.querySelector(".window-content");
  if (!(i instanceof HTMLElement)) return;
  const r = of(e);
  if (!r) return;
  const a = bp(r);
  N("LightCriteria | Resolved ambient light", {
    sheetId: (r == null ? void 0 : r.id) ?? null,
    persistedId: (a == null ? void 0 : a.id) ?? null,
    sameRef: r === a
  });
  const o = (a == null ? void 0 : a.parent) ?? r.parent ?? null, s = o ? th(o) : [], l = s.filter(
    ($) => Array.isArray($ == null ? void 0 : $.values) && $.values.length > 0
  ), u = lp(s), d = s.map(($) => typeof ($ == null ? void 0 : $.id) == "string" ? $.id : null).filter(($) => !!$), m = a ?? r, h = o ? ut(o) : [];
  let y = xd(m);
  const p = Hh(y, h);
  JSON.stringify(p) !== JSON.stringify(y) && (y = p, Pd(m, p).catch(($) => {
    console.warn("eidolon-utilities | Failed to persist migrated light criteria keys", $);
  })), N("LightCriteria | Loaded mapping state", {
    hasBase: !!(y != null && y.base),
    mappingCount: Array.isArray(y == null ? void 0 : y.mappings) ? y.mappings.length : 0,
    mappings: Array.isArray(y == null ? void 0 : y.mappings) ? y.mappings.map(($) => {
      var z, Z;
      return {
        id: $.id,
        key: $.key,
        hasColor: !!((Z = (z = $.config) == null ? void 0 : z.config) != null && Z.color)
      };
    }) : []
  });
  const g = i.querySelector(".eidolon-light-criteria");
  g && g.remove(), i.querySelectorAll(".eidolon-light-criteria-main-switcher").forEach(($) => $.remove());
  const v = document.createElement("fieldset");
  v.classList.add("eidolon-light-criteria");
  const b = document.createElement("legend");
  b.textContent = E("EIDOLON.LightCriteria.Legend", "Scene Criteria Lighting"), v.appendChild(b);
  const w = document.createElement("p");
  w.classList.add("notes"), w.textContent = E(
    "EIDOLON.LightCriteria.Description",
    "Capture a base lighting state, then map criteria values to lighting configurations."
  ), v.appendChild(w);
  const S = document.createElement("div");
  S.classList.add("eidolon-light-criteria__controls");
  const I = document.createElement("button");
  I.type = "button", I.dataset.action = "make-default", I.classList.add("eidolon-light-criteria__button"), I.textContent = E(
    "EIDOLON.LightCriteria.SetBase",
    "Set Base"
  ), S.appendChild(I);
  const O = document.createElement("button");
  O.type = "button", O.dataset.action = "create-mapping", O.classList.add("eidolon-light-criteria__button"), O.textContent = E(
    "EIDOLON.LightCriteria.CreateMapping",
    "Add Criteria Mapping"
  ), O.setAttribute("aria-expanded", "false"), S.appendChild(O), v.appendChild(S);
  const k = document.createElement("p");
  k.classList.add("notes", "eidolon-light-criteria__status"), v.appendChild(k);
  const M = document.createElement("div");
  M.classList.add("eidolon-light-criteria__switcher");
  const x = document.createElement("label");
  x.classList.add("eidolon-light-criteria__switcher-label");
  const R = `${(e == null ? void 0 : e.id) ?? (r == null ? void 0 : r.id) ?? "eidolon-light"}-mapping-select`;
  x.htmlFor = R, x.textContent = E("EIDOLON.LightCriteria.SelectLabel", "Criteria Mapping"), M.appendChild(x);
  const F = document.createElement("details");
  F.classList.add("eidolon-light-criteria__filter-details");
  const D = document.createElement("summary");
  D.classList.add("eidolon-light-criteria__filter-summary");
  const _ = document.createElement("span");
  _.classList.add("eidolon-light-criteria__filter-summary-label"), _.textContent = E(
    "EIDOLON.LightCriteria.FilterHeading",
    "Filter mappings"
  ), D.appendChild(_);
  const H = document.createElement("span");
  H.classList.add("eidolon-light-criteria__filter-meta"), D.appendChild(H), F.appendChild(D);
  const B = document.createElement("div");
  B.classList.add("eidolon-light-criteria__filter-panel");
  const W = document.createElement("div");
  W.classList.add("eidolon-light-criteria__filter-grid");
  for (const $ of l) {
    const z = document.createElement("label");
    z.classList.add("eidolon-light-criteria__filter");
    const Z = document.createElement("span");
    Z.classList.add("eidolon-light-criteria__filter-name"), Z.textContent = (Xi = (Rn = $.name) == null ? void 0 : Rn.trim) != null && Xi.call(Rn) ? $.name.trim() : E("EIDOLON.LightCriteria.UnnamedCategory", "Unnamed Category"), z.appendChild(Z);
    const ee = document.createElement("select");
    ee.dataset.filterCategoryId = $.id, ee.classList.add("eidolon-light-criteria__filter-select");
    const ne = document.createElement("option");
    ne.value = "", ne.textContent = E("EIDOLON.LightCriteria.FilterAny", "Any"), ee.appendChild(ne);
    for (const ce of $.values) {
      const ue = document.createElement("option");
      ue.value = ce, ue.textContent = ce, ee.appendChild(ue);
    }
    z.appendChild(ee), W.appendChild(z);
  }
  B.appendChild(W);
  const q = document.createElement("div");
  q.classList.add("eidolon-light-criteria__filter-actions");
  const U = document.createElement("button");
  U.type = "button", U.dataset.action = "clear-mapping-filters", U.classList.add("eidolon-light-criteria__button", "secondary", "compact"), U.textContent = E("EIDOLON.LightCriteria.ClearFilters", "Clear Filters"), q.appendChild(U), B.appendChild(q), F.appendChild(B), F.hidden = l.length === 0, M.appendChild(F);
  const J = document.createElement("div");
  J.classList.add("eidolon-light-criteria__switcher-controls"), M.appendChild(J);
  const ae = document.createElement("select");
  ae.id = R, ae.classList.add("eidolon-light-criteria__select"), ae.dataset.action = "select-mapping", J.appendChild(ae);
  const Q = document.createElement("button");
  Q.type = "button", Q.dataset.action = "apply-selected-mapping", Q.classList.add("eidolon-light-criteria__button", "secondary"), Q.textContent = E("EIDOLON.LightCriteria.ApplyButton", "Apply"), J.appendChild(Q);
  const te = document.createElement("details");
  te.classList.add("eidolon-light-criteria__menu"), te.dataset.action = "mapping-actions-menu";
  const Bt = document.createElement("summary");
  Bt.classList.add("eidolon-light-criteria__menu-toggle"), Bt.innerHTML = '<i class="fa-solid fa-ellipsis-vertical" inert=""></i>', Bt.setAttribute(
    "aria-label",
    E("EIDOLON.LightCriteria.MoreActions", "More actions")
  ), Bt.dataset.tooltip = E("EIDOLON.LightCriteria.MoreActions", "More actions"), te.appendChild(Bt);
  const ft = document.createElement("div");
  ft.classList.add("eidolon-light-criteria__menu-list"), te.appendChild(ft);
  const _e = document.createElement("button");
  _e.type = "button", _e.dataset.action = "update-selected-mapping", _e.classList.add("eidolon-light-criteria__menu-item"), _e.textContent = E(
    "EIDOLON.LightCriteria.UpdateSelected",
    "Save current config to selected"
  ), ft.appendChild(_e);
  const Ze = document.createElement("button");
  Ze.type = "button", Ze.dataset.action = "edit-selected-mapping-criteria", Ze.classList.add("eidolon-light-criteria__menu-item"), Ze.textContent = E(
    "EIDOLON.LightCriteria.EditSelectedCriteria",
    "Edit selected mapping criteria"
  ), ft.appendChild(Ze);
  const et = document.createElement("button");
  et.type = "button", et.dataset.action = "remove-selected-mapping", et.classList.add("eidolon-light-criteria__menu-item", "danger"), et.textContent = E(
    "EIDOLON.LightCriteria.RemoveSelected",
    "Delete selected mapping"
  ), ft.appendChild(et), J.appendChild(te);
  const Ut = document.createElement("div");
  Ut.classList.add("eidolon-light-criteria-main-switcher"), Ut.appendChild(M);
  const ze = document.createElement("p");
  if (ze.classList.add("notes", "eidolon-light-criteria-main-switcher__empty"), ze.textContent = E(
    "EIDOLON.LightCriteria.ActiveRequiresBase",
    "Set Base Lighting to enable mapping selection and actions."
  ), Ut.appendChild(ze), s.length === 0) {
    const $ = document.createElement("p");
    $.classList.add("notification", "warning", "eidolon-light-criteria__warning"), $.textContent = E(
      "EIDOLON.LightCriteria.NoCategoriesWarning",
      "This scene has no criteria configured. Add criteria under Scene -> Criteria to enable criteria-driven lighting."
    ), v.appendChild($);
  } else if (l.length === 0) {
    const $ = document.createElement("p");
    $.classList.add("notification", "warning", "eidolon-light-criteria__warning"), $.textContent = E(
      "EIDOLON.LightCriteria.NoValuesWarning",
      "Criteria exist, but none define selectable values. Add values in Scene -> Criteria."
    ), v.appendChild($);
  }
  const Ce = document.createElement("div");
  Ce.classList.add("eidolon-light-criteria__creation"), Ce.dataset.section = "creation", Ce.hidden = !0;
  const bi = document.createElement("p");
  bi.classList.add("notes"), bi.textContent = E(
    "EIDOLON.LightCriteria.CreateDescription",
    "Assign scene criteria values to map the current configuration."
  ), Ce.appendChild(bi);
  const Vt = document.createElement("div");
  Vt.classList.add("eidolon-light-criteria__category-list"), Ce.appendChild(Vt);
  for (const $ of l) {
    const z = document.createElement("label");
    z.classList.add("eidolon-light-criteria__category");
    const Z = document.createElement("span");
    Z.classList.add("eidolon-light-criteria__category-name"), Z.textContent = (Lc = (Qr = $.name) == null ? void 0 : Qr.trim) != null && Lc.call(Qr) ? $.name.trim() : E("EIDOLON.LightCriteria.UnnamedCategory", "Unnamed Category"), z.appendChild(Z);
    const ee = document.createElement("select");
    ee.dataset.categoryId = $.id, ee.classList.add("eidolon-light-criteria__category-select");
    const ne = document.createElement("option");
    ne.value = "", ne.textContent = E(
      "EIDOLON.LightCriteria.IgnoreCategory",
      "Ignore"
    ), ee.appendChild(ne);
    for (const ce of $.values) {
      const ue = document.createElement("option");
      ue.value = ce, ue.textContent = ce, ee.appendChild(ue);
    }
    z.appendChild(ee), Vt.appendChild(z);
  }
  const Pn = document.createElement("div");
  Pn.classList.add("eidolon-light-criteria__creation-actions");
  const tt = document.createElement("button");
  tt.type = "button", tt.dataset.action = "save-mapping", tt.classList.add("eidolon-light-criteria__button", "primary"), tt.textContent = E(
    "EIDOLON.LightCriteria.SaveMapping",
    "Save Mapping"
  ), Pn.appendChild(tt);
  const zt = document.createElement("button");
  zt.type = "button", zt.dataset.action = "cancel-create", zt.classList.add("eidolon-light-criteria__button", "secondary"), zt.textContent = E(
    "EIDOLON.LightCriteria.Cancel",
    "Cancel"
  ), Pn.appendChild(zt), Ce.appendChild(Pn), v.appendChild(Ce), i.prepend(Ut), i.appendChild(v), v.hidden = !0, Zg(e, {
    fieldset: v,
    homeContainer: i
  }), requestAnimationFrame(() => {
    var $;
    ($ = e.setPosition) == null || $.call(e, { height: "auto" });
  });
  let P = y;
  jn({ switcher: M, emptyState: ze, state: P }), qn(k, P), tr(O, {
    state: P,
    hasCategories: l.length > 0
  }), N("LightCriteria | Controls injected", {
    sceneId: (o == null ? void 0 : o.id) ?? null,
    lightId: (r == null ? void 0 : r.id) ?? null,
    hasBase: !!(P != null && P.base),
    mappingCount: Array.isArray(P == null ? void 0 : P.mappings) ? P.mappings.length : 0,
    categories: l.length
  });
  const Yr = hp(P), X = {
    restoreConfig: null,
    app: e,
    selectedMapping: Yr,
    editorMode: "create",
    editingMappingId: null,
    mappingFilters: {}
  };
  wa.set(v, X);
  const mt = /* @__PURE__ */ c(() => {
    te.open = !1;
  }, "closeActionsMenu");
  Bt.addEventListener("click", ($) => {
    te.classList.contains("is-disabled") && ($.preventDefault(), mt());
  });
  const Oe = /* @__PURE__ */ c(($ = X.selectedMapping) => {
    const z = cp(W), Z = Array.isArray(P == null ? void 0 : P.mappings) ? P.mappings : [], ee = dp(Z, z), ne = Object.keys(z).length;
    X.mappingFilters = z, U.disabled = ne === 0, fp(H, {
      totalCount: Z.length,
      visibleCount: ee.length,
      hasFilters: ne > 0,
      activeFilterCount: ne
    }), F.classList.toggle("has-active-filters", ne > 0), mp(ae, P, u, $, {
      mappings: ee,
      categoryOrder: d
    }), X.selectedMapping = ae.value ?? "", us({
      mappingSelect: ae,
      applyMappingButton: Q,
      updateMappingButton: _e,
      editCriteriaButton: Ze,
      removeMappingButton: et,
      actionsMenu: te,
      state: P
    }), te.classList.contains("is-disabled") && mt();
  }, "refreshMappingSelector");
  W.querySelectorAll("select[data-filter-category-id]").forEach(($) => {
    $.addEventListener("change", () => {
      const z = X.selectedMapping;
      Oe(z), X.selectedMapping !== z && ds(
        a ?? r,
        P,
        X.selectedMapping
      ).then((Z) => {
        Z && (P = Z);
      });
    });
  }), U.addEventListener("click", () => {
    up(W);
    const $ = X.selectedMapping;
    Oe($), F.open = !1, X.selectedMapping !== $ && ds(
      a ?? r,
      P,
      X.selectedMapping
    ).then((z) => {
      z && (P = z);
    });
  }), ae.addEventListener("change", () => {
    X.selectedMapping = ae.value ?? "", us({
      mappingSelect: ae,
      applyMappingButton: Q,
      updateMappingButton: _e,
      editCriteriaButton: Ze,
      removeMappingButton: et,
      actionsMenu: te,
      state: P
    }), ds(
      a ?? r,
      P,
      X.selectedMapping
    ).then(($) => {
      $ && (P = $);
    });
  });
  const Yi = /* @__PURE__ */ c(async () => {
    var ee, ne, ce, ue, nt, nn, it, rn, he, an, on, Nt, Hn, Qi;
    const $ = ae.value ?? "";
    if (!$) {
      (ne = (ee = ui.notifications) == null ? void 0 : ee.warn) == null || ne.call(
        ee,
        E(
          "EIDOLON.LightCriteria.SelectMappingWarning",
          "Choose a criteria mapping before applying."
        )
      ), Oe(X.selectedMapping);
      return;
    }
    if ($ === ge) {
      if (!(P != null && P.base)) {
        (ue = (ce = ui.notifications) == null ? void 0 : ce.warn) == null || ue.call(
          ce,
          E(
            "EIDOLON.LightCriteria.BaseUnavailable",
            "Set a base lighting state before applying it."
          )
        );
        return;
      }
      la(v, Ce, O), Sa(e, n, P.base), P = await cr(a ?? r, {
        mappingId: ge,
        categories: null,
        updatedAt: Date.now()
      }), X.selectedMapping = ge, Oe(X.selectedMapping), qn(k, P), jn({ switcher: M, emptyState: ze, state: P }), tr(O, {
        state: P,
        hasCategories: l.length > 0
      }), eu(n, {
        mappingId: ge,
        color: ((nn = (nt = P.base) == null ? void 0 : nt.config) == null ? void 0 : nn.color) ?? null
      }), (rn = (it = ui.notifications) == null ? void 0 : it.info) == null || rn.call(
        it,
        E(
          "EIDOLON.LightCriteria.BaseApplied",
          "Applied the base lighting state to the form."
        )
      ), mt();
      return;
    }
    const z = Array.isArray(P == null ? void 0 : P.mappings) && P.mappings.length ? P.mappings.find((vi) => (vi == null ? void 0 : vi.id) === $) : null;
    if (!z) {
      (an = (he = ui.notifications) == null ? void 0 : he.warn) == null || an.call(
        he,
        E(
          "EIDOLON.LightCriteria.MappingUnavailable",
          "The selected criteria mapping is no longer available."
        )
      ), X.selectedMapping = "", Oe(X.selectedMapping);
      return;
    }
    la(v, Ce, O), Sa(e, n, z.config), P = await cr(a ?? r, {
      mappingId: z.id,
      categories: z.categories,
      updatedAt: Date.now()
    }), X.selectedMapping = z.id, Oe(X.selectedMapping), qn(k, P), jn({ switcher: M, emptyState: ze, state: P }), tr(O, {
      state: P,
      hasCategories: l.length > 0
    }), eu(n, {
      mappingId: z.id,
      color: ((Nt = (on = z.config) == null ? void 0 : on.config) == null ? void 0 : Nt.color) ?? null
    });
    const Z = $i(z, u, d);
    (Qi = (Hn = ui.notifications) == null ? void 0 : Hn.info) == null || Qi.call(
      Hn,
      E(
        "EIDOLON.LightCriteria.MappingApplied",
        "Applied mapping: {label}"
      ).replace("{label}", Z)
    ), mt();
  }, "applySelectedMapping");
  Q.addEventListener("click", () => {
    Yi();
  }), ae.addEventListener("keydown", ($) => {
    $.key === "Enter" && ($.preventDefault(), Yi());
  });
  const Xr = /* @__PURE__ */ c(async () => {
    var z, Z, ee, ne, ce, ue, nt, nn, it, rn, he, an, on, Nt, Hn, Qi, vi, Zr, Ic, ea, Oc;
    const $ = X.selectedMapping;
    if (!$) {
      (Z = (z = ui.notifications) == null ? void 0 : z.warn) == null || Z.call(
        z,
        E(
          "EIDOLON.LightCriteria.SelectMappingWarning",
          "Choose a criteria mapping before applying."
        )
      );
      return;
    }
    _e.disabled = !0;
    try {
      const Ge = Ea(e, a);
      if ($ === ge)
        P = await zc(a ?? r, Ge), N("LightCriteria | Base lighting updated", {
          lightId: ((ee = a ?? r) == null ? void 0 : ee.id) ?? null,
          configColor: ((ne = Ge == null ? void 0 : Ge.config) == null ? void 0 : ne.color) ?? null
        }), (ue = (ce = ui.notifications) == null ? void 0 : ce.info) == null || ue.call(
          ce,
          E(
            "EIDOLON.LightCriteria.BaseUpdated",
            "Updated the base lighting state with the current configuration."
          )
        ), X.selectedMapping = ge;
      else {
        const wi = ur(P, $);
        if (!wi) {
          (nn = (nt = ui.notifications) == null ? void 0 : nt.warn) == null || nn.call(
            nt,
            E(
              "EIDOLON.LightCriteria.MappingUnavailable",
              "The selected criteria mapping is no longer available."
            )
          ), X.selectedMapping = "", Oe(X.selectedMapping);
          return;
        }
        P = await Gc(
          a ?? r,
          wi.categories,
          Ge,
          { label: wi.label ?? null }
        ), N("LightCriteria | Mapping updated", {
          mappingId: $,
          hasColor: !!((it = Ge == null ? void 0 : Ge.config) != null && it.color),
          stored: Array.isArray(P == null ? void 0 : P.mappings) ? ((rn = P.mappings.find((Yo) => (Yo == null ? void 0 : Yo.id) === $)) == null ? void 0 : rn.config) ?? null : null,
          persisted: (an = (he = a ?? r) == null ? void 0 : he.getFlag) == null ? void 0 : an.call(he, li, _i)
        });
        const Zi = ur(P, $), hm = $i(Zi || wi, u, d);
        N("LightCriteria | Mapping updated", {
          mappingId: $,
          categories: wi.categories,
          updatedColor: ((on = Ge == null ? void 0 : Ge.config) == null ? void 0 : on.color) ?? null,
          storedColor: ((Hn = (Nt = Zi == null ? void 0 : Zi.config) == null ? void 0 : Nt.config) == null ? void 0 : Hn.color) ?? ((vi = (Qi = wi.config) == null ? void 0 : Qi.config) == null ? void 0 : vi.color) ?? null
        }), (Ic = (Zr = ui.notifications) == null ? void 0 : Zr.info) == null || Ic.call(
          Zr,
          E(
            "EIDOLON.LightCriteria.MappingUpdated",
            "Saved changes to mapping: {label}"
          ).replace("{label}", hm)
        ), X.selectedMapping = $;
      }
      qn(k, P), jn({ switcher: M, emptyState: ze, state: P }), tr(O, {
        state: P,
        hasCategories: l.length > 0
      }), Oe(X.selectedMapping), mt();
    } catch (Ge) {
      console.error("eidolon-utilities | Failed to update light criteria mapping", Ge), (Oc = (ea = ui.notifications) == null ? void 0 : ea.error) == null || Oc.call(
        ea,
        E(
          "EIDOLON.LightCriteria.MappingUpdateError",
          "Failed to save the mapping. Check the console for details."
        )
      );
    } finally {
      _e.disabled = !1, us({
        mappingSelect: ae,
        applyMappingButton: Q,
        updateMappingButton: _e,
        editCriteriaButton: Ze,
        removeMappingButton: et,
        actionsMenu: te,
        state: P
      });
    }
  }, "updateSelectedMapping");
  _e.addEventListener("click", () => {
    Xr();
  }), Oe(X.selectedMapping), I.addEventListener("click", async () => {
    var $, z, Z, ee, ne, ce;
    I.disabled = !0;
    try {
      const ue = Ea(e, a);
      P = await zc(a ?? r, ue), N("LightCriteria | Base lighting stored", {
        lightId: (($ = a ?? r) == null ? void 0 : $.id) ?? null,
        configColor: ((z = ue == null ? void 0 : ue.config) == null ? void 0 : z.color) ?? null
      }), (ee = (Z = ui.notifications) == null ? void 0 : Z.info) == null || ee.call(
        Z,
        E(
          "EIDOLON.LightCriteria.BaseStored",
          "Saved the current configuration as the base lighting state."
        )
      ), qn(k, P), jn({ switcher: M, emptyState: ze, state: P }), tr(O, {
        state: P,
        hasCategories: l.length > 0
      }), X.selectedMapping = ge, Oe(X.selectedMapping);
    } catch (ue) {
      console.error("eidolon-utilities | Failed to store base light criteria state", ue), (ce = (ne = ui.notifications) == null ? void 0 : ne.error) == null || ce.call(
        ne,
        E(
          "EIDOLON.LightCriteria.BaseError",
          "Failed to save the base lighting state. Check the console for details."
        )
      );
    } finally {
      I.disabled = !1;
    }
  }), O.addEventListener("click", () => {
    var z, Z, ee, ne;
    if (!(P != null && P.base)) {
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
    const $ = wa.get(v);
    Zc({
      app: e,
      fieldset: v,
      createButton: O,
      creationSection: Ce,
      categoryList: Vt,
      form: n,
      persistedLight: a,
      stateEntry: $,
      mode: "create",
      mapping: null,
      preloadConfig: P.base
    });
  }), Ze.addEventListener("click", () => {
    var Z, ee, ne, ce;
    const $ = X.selectedMapping;
    if (!$ || $ === ge) {
      (ee = (Z = ui.notifications) == null ? void 0 : Z.warn) == null || ee.call(
        Z,
        E(
          "EIDOLON.LightCriteria.SelectMappingForCriteriaEdit",
          "Select a mapping before editing criteria."
        )
      );
      return;
    }
    const z = ur(P, $);
    if (!z) {
      (ce = (ne = ui.notifications) == null ? void 0 : ne.warn) == null || ce.call(
        ne,
        E(
          "EIDOLON.LightCriteria.MappingUnavailable",
          "The selected criteria mapping is no longer available."
        )
      );
      return;
    }
    mt(), af(e, { fieldset: v, homeContainer: i }), Zc({
      app: e,
      fieldset: v,
      createButton: O,
      creationSection: Ce,
      categoryList: Vt,
      form: n,
      persistedLight: a,
      stateEntry: X,
      mode: "retarget",
      mapping: z,
      preloadConfig: z.config
    });
  }), tt.addEventListener("click", async () => {
    var z, Z, ee, ne, ce, ue, nt, nn, it, rn;
    const $ = yp(Vt);
    if (!$) {
      (Z = (z = ui.notifications) == null ? void 0 : z.warn) == null || Z.call(
        z,
        E(
          "EIDOLON.LightCriteria.SelectionRequired",
          "Select at least one criteria value to identify the mapping."
        )
      );
      return;
    }
    tt.disabled = !0;
    try {
      const he = Ea(e, a);
      if (X.editorMode === "retarget" && X.editingMappingId) {
        const on = dl(P, $);
        let Nt = !1;
        if (on && on !== X.editingMappingId && (Nt = await Xg(), !Nt)) {
          tt.disabled = !1;
          return;
        }
        P = await xh(
          a ?? r,
          X.editingMappingId,
          $,
          he,
          { replaceExisting: Nt }
        ), N("LightCriteria | Mapping criteria retargeted", {
          mappingId: X.editingMappingId,
          categories: $,
          replaced: Nt,
          configColor: ((ee = he == null ? void 0 : he.config) == null ? void 0 : ee.color) ?? null
        }), (ce = (ne = ui.notifications) == null ? void 0 : ne.info) == null || ce.call(
          ne,
          E(
            "EIDOLON.LightCriteria.MappingCriteriaUpdated",
            "Updated mapping criteria for the selected mapping."
          )
        );
      } else
        P = await Gc(
          a ?? r,
          $,
          he,
          {}
        ), N("LightCriteria | Mapping saved from editor", {
          categories: $,
          configColor: ((ue = he == null ? void 0 : he.config) == null ? void 0 : ue.color) ?? null
        }), (nn = (nt = ui.notifications) == null ? void 0 : nt.info) == null || nn.call(
          nt,
          E(
            "EIDOLON.LightCriteria.MappingSaved",
            "Updated lighting mapping for the selected scene criteria."
          )
        );
      qn(k, P), jn({ switcher: M, emptyState: ze, state: P });
      const an = dl(P, $);
      an && (X.selectedMapping = an), Oe(X.selectedMapping), la(v, Ce, O), mt();
    } catch (he) {
      console.error("eidolon-utilities | Failed to persist light criteria mapping", he), (rn = (it = ui.notifications) == null ? void 0 : it.error) == null || rn.call(
        it,
        E(
          "EIDOLON.LightCriteria.MappingError",
          "Failed to save the mapping. Check the console for details."
        )
      );
    } finally {
      tt.disabled = !1;
    }
  }), zt.addEventListener("click", () => {
    const $ = wa.get(v);
    $ != null && $.restoreConfig && Sa(e, n, $.restoreConfig), la(v, Ce, O);
  }), et.addEventListener("click", async () => {
    var Z, ee;
    const $ = X.selectedMapping;
    !$ || $ === ge || !await Qg() || (P = await Ph(a ?? r, $), X.selectedMapping = "", qn(k, P), jn({ switcher: M, emptyState: ze, state: P }), Oe(X.selectedMapping), mt(), (ee = (Z = ui.notifications) == null ? void 0 : Z.info) == null || ee.call(
      Z,
      E("EIDOLON.LightCriteria.MappingRemoved", "Removed selected mapping.")
    ));
  });
}
c(Yg, "enhanceAmbientLightConfig");
function Zc({
  app: e,
  fieldset: t,
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
  s && (s.restoreConfig = Ea(e, o), s.editorMode = l, s.editingMappingId = l === "retarget" ? (u == null ? void 0 : u.id) ?? null : null), d && Sa(e, a, d), l === "retarget" && (u != null && u.categories) ? pp(r, u.categories) : gp(r);
  const m = i.querySelector("p.notes");
  m instanceof HTMLElement && (m.textContent = l === "retarget" ? E(
    "EIDOLON.LightCriteria.EditCriteriaDescription",
    "Adjust criteria values for the selected mapping."
  ) : E(
    "EIDOLON.LightCriteria.CreateDescription",
    "Assign scene criteria values to map the current configuration."
  ));
  const h = i.querySelector('button[data-action="save-mapping"]');
  h instanceof HTMLButtonElement && (h.textContent = l === "retarget" ? E("EIDOLON.LightCriteria.SaveCriteriaChanges", "Save Criteria Changes") : E("EIDOLON.LightCriteria.SaveMapping", "Save Mapping")), i.hidden = !1, n.setAttribute("aria-expanded", "true"), sc(t, i), requestAnimationFrame(() => {
    var y;
    (y = e.setPosition) == null || y.call(e, { height: "auto" });
  });
}
c(Zc, "openMappingEditor");
async function Xg() {
  var n, i;
  const e = (i = (n = foundry == null ? void 0 : foundry.applications) == null ? void 0 : n.api) == null ? void 0 : i.DialogV2;
  if (typeof (e == null ? void 0 : e.confirm) == "function")
    return e.confirm({
      window: { title: E("EIDOLON.LightCriteria.ConflictTitle", "Replace Existing Mapping?") },
      content: `<p>${E(
        "EIDOLON.LightCriteria.ConflictBody",
        "A mapping already exists for this criteria combination. Replace it with the edited mapping?"
      )}</p>`,
      rejectClose: !1
    });
  const t = globalThis.Dialog;
  return typeof (t == null ? void 0 : t.confirm) != "function" ? !1 : t.confirm({
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
c(Xg, "confirmCriteriaConflict");
async function Qg() {
  var n, i;
  const e = (i = (n = foundry == null ? void 0 : foundry.applications) == null ? void 0 : n.api) == null ? void 0 : i.DialogV2;
  if (typeof (e == null ? void 0 : e.confirm) == "function")
    return e.confirm({
      window: { title: E("EIDOLON.LightCriteria.RemoveTitle", "Remove Mapping?") },
      content: `<p>${E(
        "EIDOLON.LightCriteria.RemoveBody",
        "Remove the currently selected mapping? This cannot be undone."
      )}</p>`,
      rejectClose: !1
    });
  const t = globalThis.Dialog;
  return typeof (t == null ? void 0 : t.confirm) != "function" ? !1 : t.confirm({
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
c(Qg, "confirmRemoveMapping");
function Zg(e, { fieldset: t, homeContainer: n }) {
  const i = np(e, n);
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
    o.preventDefault(), af(e, { fieldset: t, homeContainer: n });
  };
}
c(Zg, "ensureManagerHeaderButton");
function af(e, { fieldset: t, homeContainer: n }) {
  var h, y, p;
  const i = sa.get(e);
  if (i != null && i.rendered) {
    (h = i.bringToTop) == null || h.call(i);
    return;
  }
  const r = /* @__PURE__ */ c((...g) => {
    var w;
    const v = ep(g), b = (w = v == null ? void 0 : v.querySelector) == null ? void 0 : w.call(v, ".eidolon-light-criteria-manager-host");
    b instanceof HTMLElement && (tp(t), t.hidden = !1, b.appendChild(t));
  }, "onRender"), a = /* @__PURE__ */ c(() => {
    n instanceof HTMLElement && n.appendChild(t), t.hidden = !0, sa.delete(e), requestAnimationFrame(() => {
      var g;
      (g = e.setPosition) == null || g.call(e, { height: "auto" });
    });
  }, "onClose"), o = E("EIDOLON.LightCriteria.ManagerTitle", "Scene Criteria Lighting"), s = '<div class="eidolon-light-criteria-manager-host"></div>', l = E("EIDOLON.LightCriteria.Close", "Close"), u = (p = (y = foundry == null ? void 0 : foundry.applications) == null ? void 0 : y.api) == null ? void 0 : p.DialogV2;
  if (typeof (u == null ? void 0 : u.wait) == "function")
    try {
      let g = !1;
      const v = /* @__PURE__ */ c(() => {
        g || (g = !0, a());
      }, "closeOnce");
      sa.set(e, {
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
    } catch (g) {
      console.warn("eidolon-utilities | DialogV2 manager failed, falling back to Dialog", g), a();
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
      render: /* @__PURE__ */ c((...g) => r(...g), "render"),
      close: a
    },
    {
      width: 640,
      resizable: !0
    }
  );
  sa.set(e, m), m.render(!0);
}
c(af, "openManagerDialog");
function ep(e) {
  for (const t of e) {
    const n = kt(t);
    if (n) return n;
    const i = kt(t == null ? void 0 : t.element);
    if (i) return i;
  }
  return null;
}
c(ep, "findDialogRoot");
function tp(e) {
  if (!(e instanceof HTMLElement) || e.dataset.managerLayout === "true") return;
  e.dataset.managerLayout = "true", e.classList.add("is-manager");
  const t = e.querySelector("legend"), n = e.querySelector("p.notes:not(.eidolon-light-criteria__status)"), i = e.querySelector(".eidolon-light-criteria__controls"), r = e.querySelector(".eidolon-light-criteria__status"), a = e.querySelector(".eidolon-light-criteria__creation"), o = Array.from(e.querySelectorAll(".eidolon-light-criteria__warning")), s = document.createElement("div");
  s.classList.add("eidolon-light-criteria-manager");
  const l = document.createElement("section");
  l.classList.add("eidolon-light-criteria-manager__section", "is-top"), s.appendChild(l);
  const u = document.createElement("section");
  u.classList.add("eidolon-light-criteria-manager__section", "is-bottom"), s.appendChild(u);
  const d = document.createElement("div");
  if (d.classList.add("eidolon-light-criteria-manager__header"), d.textContent = E("EIDOLON.LightCriteria.ManagerHeader", "Base State"), l.appendChild(d), r && l.appendChild(r), i && l.appendChild(i), o.length) {
    const h = document.createElement("div");
    h.classList.add("eidolon-light-criteria-manager__warnings");
    for (const y of o) h.appendChild(y);
    l.appendChild(h);
  }
  const m = document.createElement("div");
  m.classList.add("eidolon-light-criteria-manager__header"), m.textContent = E("EIDOLON.LightCriteria.ManagerAuthoring", "Create or Update Mapping"), u.appendChild(m), a && u.appendChild(a), e.innerHTML = "", t && e.appendChild(t), n && e.appendChild(n), e.appendChild(s), sc(e, a);
}
c(tp, "applyManagerLayout");
function np(e, t) {
  var i;
  const n = kt(e == null ? void 0 : e.element);
  return n || (((i = t == null ? void 0 : t.closest) == null ? void 0 : i.call(t, ".application")) ?? null);
}
c(np, "resolveApplicationRoot");
function la(e, t, n) {
  const i = wa.get(e);
  i && (i.restoreConfig = null, i.editorMode = "create", i.editingMappingId = null), t.hidden = !0, n.setAttribute("aria-expanded", "false");
  const r = t.querySelector("p.notes");
  r instanceof HTMLElement && (r.textContent = E(
    "EIDOLON.LightCriteria.CreateDescription",
    "Assign scene criteria values to map the current configuration."
  ));
  const a = t.querySelector('button[data-action="save-mapping"]');
  a instanceof HTMLButtonElement && (a.textContent = E("EIDOLON.LightCriteria.SaveMapping", "Save Mapping")), sc(e, t), requestAnimationFrame(() => {
    var o, s;
    (s = (o = i == null ? void 0 : i.app) == null ? void 0 : o.setPosition) == null || s.call(o, { height: "auto" });
  });
}
c(la, "hideCreationSection");
function qn(e, t) {
  if (!e) return;
  const n = !!(t != null && t.base), i = Array.isArray(t == null ? void 0 : t.mappings) ? t.mappings.length : 0, r = [];
  r.push(
    n ? E(
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
  ), e.textContent = r.join(" ");
}
c(qn, "updateStatusLine");
function tr(e, { state: t, hasCategories: n }) {
  if (!e) return;
  const i = !!(t != null && t.base), r = i && n;
  e.disabled = !r, e.title = r ? "" : i ? E(
    "EIDOLON.LightCriteria.CreateDisabledNoCategories",
    "Add scene criteria with values before creating mappings."
  ) : E(
    "EIDOLON.LightCriteria.CreateDisabledNoBase",
    "Save a base lighting state before creating criteria mappings."
  );
}
c(tr, "updateCreateButtonState");
function Ea(e, t) {
  var l, u, d;
  const n = t ?? of(e);
  if (!n)
    throw new Error("Ambient light document unavailable.");
  const i = hi(((l = n.toObject) == null ? void 0 : l.call(n)) ?? {});
  if (!i)
    throw new Error("Unable to duplicate ambient light data.");
  const r = (e == null ? void 0 : e.form) instanceof HTMLFormElement ? e.form : null, a = r ? jm(r) : {}, o = foundry.utils.mergeObject(i, a, {
    inplace: !1,
    performDeletions: !0
  });
  r && (r.querySelectorAll("color-picker[name]").forEach((m) => {
    var b, w;
    const h = m.getAttribute("name");
    if (!h) return;
    const y = typeof m.value == "string" ? m.value : "", p = ((b = m.ui) == null ? void 0 : b.input) ?? ((w = m.querySelector) == null ? void 0 : w.call(m, 'input[type="color"]')), g = (p == null ? void 0 : p.value) ?? "", v = y || g;
    typeof v != "string" || !v || (foundry.utils.setProperty(o, h, v), N("LightCriteria | Captured color-picker value", {
      path: h,
      pickerValue: y,
      swatchValue: g,
      chosenValue: v
    }));
  }), r.querySelectorAll("range-picker[name]").forEach((m) => {
    var O, k;
    const h = m.getAttribute("name");
    if (!h) return;
    const y = m.value !== void 0 && m.value !== null ? String(m.value) : "", p = (O = m.querySelector) == null ? void 0 : O.call(m, 'input[type="range"]'), g = (k = m.querySelector) == null ? void 0 : k.call(m, 'input[type="number"]'), v = p instanceof HTMLInputElement ? p.value : "", b = g instanceof HTMLInputElement ? g.value : "", w = y || b || v;
    if (typeof w != "string" || !w.length) return;
    const S = Number(w), I = Number.isFinite(S) ? S : w;
    foundry.utils.setProperty(o, h, I), N("LightCriteria | Captured range-picker value", {
      path: h,
      elementValue: y,
      numberValue: b,
      rangeValue: v,
      chosenValue: I
    });
  }));
  const s = hi(o);
  return N("LightCriteria | Captured form config", {
    lightId: (n == null ? void 0 : n.id) ?? null,
    hasColor: !!((u = s == null ? void 0 : s.config) != null && u.color),
    color: ((d = s == null ? void 0 : s.config) == null ? void 0 : d.color) ?? null
  }), s;
}
c(Ea, "captureAmbientLightFormConfig");
function Sa(e, t, n) {
  if (!n || typeof n != "object") return;
  const i = foundry.utils.flattenObject(n, { safe: !0 });
  for (const [r, a] of Object.entries(i)) {
    const o = t.querySelectorAll(`[name="${r}"]`);
    if (o.length) {
      N("LightCriteria | Applying field", {
        path: r,
        value: a,
        elementCount: o.length
      });
      for (const s of o)
        s instanceof HTMLElement && s.tagName === "COLOR-PICKER" ? rp(s, a) : s instanceof HTMLElement && s.tagName === "RANGE-PICKER" ? ap(s, a) : s instanceof HTMLInputElement ? ip(s, a) : s instanceof HTMLSelectElement ? op(s, a) : s instanceof HTMLTextAreaElement && sp(s, a);
    }
  }
  requestAnimationFrame(() => {
    var r;
    return (r = e._previewChanges) == null ? void 0 : r.call(e);
  });
}
c(Sa, "applyConfigToForm");
function ip(e, t, n) {
  const i = e.type;
  if (i === "checkbox") {
    const o = !!t;
    e.checked !== o && (e.checked = o, At(e));
    return;
  }
  if (i === "radio") {
    const o = t == null ? "" : String(t), s = e.value === o;
    e.checked !== s && (e.checked = s, s && At(e));
    return;
  }
  const r = t == null ? "" : String(t);
  let a = !1;
  e.value !== r && (e.value = r, a = !0), a && At(e);
}
c(ip, "applyValueToInput");
function rp(e, t, n) {
  var s, l, u, d, m, h;
  const i = t == null ? "" : String(t);
  let r = !1;
  e.value !== i && (e.value = i, e.setAttribute("value", i), (s = e.ui) != null && s.setValue && e.ui.setValue(i), r = !0);
  const a = ((l = e.ui) == null ? void 0 : l.input) ?? ((u = e.querySelector) == null ? void 0 : u.call(e, 'input[type="color"]'));
  a instanceof HTMLInputElement && a.value !== i && (a.value = i, At(a));
  const o = ((d = e.ui) == null ? void 0 : d.text) ?? ((m = e.querySelector) == null ? void 0 : m.call(e, 'input[type="text"]'));
  o instanceof HTMLInputElement && o.value !== i && (o.value = i, At(o)), (h = e.ui) != null && h.commit ? e.ui.commit() : (e.dispatchEvent(new Event("input", { bubbles: !0, cancelable: !0 })), e.dispatchEvent(new Event("change", { bubbles: !0, cancelable: !0 }))), N("LightCriteria | Color picker applied", {
    value: i,
    pickerValue: e.value ?? null,
    swatchValue: (a == null ? void 0 : a.value) ?? null,
    textValue: (o == null ? void 0 : o.value) ?? null
  }), r && At(e);
}
c(rp, "applyValueToColorPicker");
function ap(e, t, n) {
  var u, d;
  const i = t == null ? "" : String(t), r = Number(i), a = Number.isFinite(r) ? r : i;
  let o = !1;
  e.value !== void 0 && e.value !== a && (e.value = a, o = !0), e.getAttribute("value") !== i && (e.setAttribute("value", i), o = !0);
  const s = (u = e.querySelector) == null ? void 0 : u.call(e, 'input[type="range"]');
  s instanceof HTMLInputElement && s.value !== i && (s.value = i, At(s));
  const l = (d = e.querySelector) == null ? void 0 : d.call(e, 'input[type="number"]');
  if (l instanceof HTMLInputElement && l.value !== i && (l.value = i, At(l)), typeof e.commit == "function")
    try {
      e.commit();
    } catch (m) {
      console.error("eidolon-utilities | range-picker commit failed", m);
    }
  N("LightCriteria | Range picker applied", {
    value: i,
    resolvedValue: a,
    rangeValue: (s == null ? void 0 : s.value) ?? null,
    numberValue: (l == null ? void 0 : l.value) ?? null
  }), o && At(e);
}
c(ap, "applyValueToRangePicker");
function op(e, t, n) {
  const i = t == null ? "" : String(t);
  e.value !== i && (e.value = i, At(e));
}
c(op, "applyValueToSelect");
function sp(e, t, n) {
  const i = t == null ? "" : String(t);
  e.value !== i && (e.value = i, At(e));
}
c(sp, "applyValueToTextarea");
function At(e) {
  e.dispatchEvent(new Event("input", { bubbles: !0, cancelable: !0 })), e.dispatchEvent(new Event("change", { bubbles: !0, cancelable: !0 }));
}
c(At, "triggerInputChange");
function us({
  mappingSelect: e,
  applyMappingButton: t,
  updateMappingButton: n,
  editCriteriaButton: i,
  removeMappingButton: r,
  actionsMenu: a,
  state: o
}) {
  const s = (e == null ? void 0 : e.value) ?? "", l = !!(o != null && o.base), u = s && s !== ge ? !!ur(o, s) : !1;
  if (t instanceof HTMLButtonElement && (s ? s === ge ? t.disabled = !l : t.disabled = !u : t.disabled = !0), n instanceof HTMLButtonElement && (s ? s === ge ? n.disabled = !1 : n.disabled = !u : n.disabled = !0), i instanceof HTMLButtonElement && (i.disabled = !s || s === ge || !u), r instanceof HTMLButtonElement && (r.disabled = !s || s === ge || !u), a instanceof HTMLElement) {
    const d = n instanceof HTMLButtonElement && !n.disabled || i instanceof HTMLButtonElement && !i.disabled || r instanceof HTMLButtonElement && !r.disabled;
    a.classList.toggle("is-disabled", !d), !d && "open" in a && (a.open = !1);
  }
}
c(us, "syncMappingSwitcherState");
function lp(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e) {
    if (!n) continue;
    const i = typeof n.id == "string" ? n.id : null;
    if (!i) continue;
    const r = typeof n.name == "string" && n.name.trim() ? n.name.trim() : E("EIDOLON.LightCriteria.UnnamedCategory", "Unnamed Category");
    t.has(i) || t.set(i, r);
  }
  return t;
}
c(lp, "buildCategoryNameLookup");
function cp(e) {
  const t = {};
  return e instanceof HTMLElement && e.querySelectorAll("select[data-filter-category-id]").forEach((n) => {
    var a, o;
    const i = n.dataset.filterCategoryId, r = (o = (a = n.value) == null ? void 0 : a.trim) == null ? void 0 : o.call(a);
    !i || !r || (t[i] = r);
  }), t;
}
c(cp, "readMappingFilterSelections");
function up(e) {
  e instanceof HTMLElement && e.querySelectorAll("select[data-filter-category-id]").forEach((t) => {
    t.value = "";
  });
}
c(up, "resetMappingFilterSelections");
function dp(e, t) {
  const n = Array.isArray(e) ? e : [], i = Object.entries(t ?? {}).filter(([, r]) => !!r);
  return i.length ? n.filter((r) => {
    if (!r || typeof r != "object") return !1;
    const a = r.categories ?? {};
    for (const [o, s] of i)
      if ((a == null ? void 0 : a[o]) !== s) return !1;
    return !0;
  }) : n.slice();
}
c(dp, "filterMappingsByCriteria");
function fp(e, { totalCount: t = 0, visibleCount: n = 0, hasFilters: i = !1, activeFilterCount: r = 0 } = {}) {
  if (!(e instanceof HTMLElement)) return;
  if (!i) {
    e.textContent = E(
      "EIDOLON.LightCriteria.FilterSummaryAll",
      "All ({count})"
    ).replace("{count}", String(t));
    return;
  }
  const a = E(
    "EIDOLON.LightCriteria.FilterSummaryActive",
    "{active} filters · {visible}/{total}"
  ).replace("{active}", String(r)).replace("{visible}", String(n)).replace("{total}", String(t));
  e.textContent = a;
}
c(fp, "updateMappingFilterMeta");
function mp(e, t, n, i, r = {}) {
  if (!(e instanceof HTMLSelectElement)) return;
  const a = typeof i == "string" ? i : "", o = !!(t != null && t.base), s = Array.isArray(r == null ? void 0 : r.categoryOrder) ? r.categoryOrder : [], l = Array.isArray(r == null ? void 0 : r.mappings) ? r.mappings.slice() : Array.isArray(t == null ? void 0 : t.mappings) ? t.mappings.slice() : [], u = e.value;
  e.innerHTML = "";
  const d = document.createElement("option");
  d.value = "", d.textContent = E(
    "EIDOLON.LightCriteria.SelectPlaceholder",
    "Select a mapping"
  ), d.disabled = o, e.appendChild(d);
  const m = document.createElement("option");
  m.value = ge, m.textContent = E(
    "EIDOLON.LightCriteria.BaseOption",
    "Base Lighting"
  ), m.disabled = !o, e.appendChild(m), l.slice().sort((g, v) => {
    var S;
    const b = $i(g, n, s), w = $i(v, n, s);
    return b.localeCompare(w, ((S = game.i18n) == null ? void 0 : S.lang) ?? void 0, {
      sensitivity: "base"
    });
  }).forEach((g) => {
    if (!(g != null && g.id)) return;
    const v = document.createElement("option");
    v.value = g.id, v.textContent = $i(g, n, s), e.appendChild(v);
  });
  const h = new Set(
    Array.from(e.options).filter((g) => !g.disabled).map((g) => g.value)
  ), y = o && u === "" ? "" : u, p = a || (h.has(y) ? y : "");
  p && h.has(p) ? e.value = p : o ? e.value = ge : e.value = "";
}
c(mp, "populateMappingSelector");
function $i(e, t, n = []) {
  if (!e || typeof e != "object")
    return E("EIDOLON.LightCriteria.UnnamedMapping", "Unnamed Mapping");
  if (typeof e.label == "string" && e.label.trim())
    return e.label.trim();
  const i = e.categories ?? {}, r = [], a = /* @__PURE__ */ new Set();
  for (const s of n)
    !s || a.has(s) || (r.push(s), a.add(s));
  for (const s of Object.keys(i).sort((l, u) => l.localeCompare(u)))
    a.has(s) || (r.push(s), a.add(s));
  const o = r.map((s) => {
    const l = i == null ? void 0 : i[s];
    if (typeof l != "string" || !l.trim()) return null;
    const u = l.trim();
    return `${t.get(s) ?? E("EIDOLON.LightCriteria.UnnamedCategory", "Unnamed Category")}=${u}`;
  }).filter(Boolean);
  return o.length === 0 ? E("EIDOLON.LightCriteria.UnnamedMapping", "Unnamed Mapping") : o.join(" | ");
}
c($i, "formatMappingOptionLabel");
function dl(e, t) {
  if (!e || typeof e != "object" || !Array.isArray(e.mappings)) return null;
  const n = Ji(t);
  if (!n) return null;
  const i = e.mappings.find((r) => (r == null ? void 0 : r.key) === n);
  return (i == null ? void 0 : i.id) ?? null;
}
c(dl, "findMappingIdByCategories");
function ur(e, t) {
  return !t || !e || typeof e != "object" || !Array.isArray(e.mappings) ? null : e.mappings.find((n) => (n == null ? void 0 : n.id) === t) ?? null;
}
c(ur, "getMappingById");
function hp(e) {
  if (!e || typeof e != "object") return "";
  const t = e.current;
  if (t != null && t.mappingId) {
    if (t.mappingId === ge)
      return e != null && e.base ? ge : "";
    if (Array.isArray(e.mappings) && e.mappings.some((n) => n.id === t.mappingId))
      return t.mappingId;
  }
  if (t != null && t.categories) {
    const n = dl(e, t.categories);
    if (n) return n;
  }
  return "";
}
c(hp, "resolveInitialMappingSelection");
function eu(e, t = {}) {
  var o, s, l, u;
  if (!(e instanceof HTMLFormElement)) return;
  const n = e.querySelector('color-picker[name="config.color"]'), i = (n == null ? void 0 : n.value) ?? null, r = ((o = n == null ? void 0 : n.ui) == null ? void 0 : o.text) ?? ((s = n == null ? void 0 : n.querySelector) == null ? void 0 : s.call(n, 'input[type="text"]')), a = ((l = n == null ? void 0 : n.ui) == null ? void 0 : l.input) ?? ((u = n == null ? void 0 : n.querySelector) == null ? void 0 : u.call(n, 'input[type="color"]'));
  N("LightCriteria | Color state after apply", {
    ...t,
    textValue: (r == null ? void 0 : r.value) ?? null,
    pickerValue: i,
    swatchValue: (a == null ? void 0 : a.value) ?? null
  });
}
c(eu, "logAppliedColorState");
function gp(e) {
  e.querySelectorAll("select[data-category-id]").forEach((t) => {
    t.value = "";
  });
}
c(gp, "resetCategorySelections");
function pp(e, t) {
  const n = t && typeof t == "object" ? t : {};
  e.querySelectorAll("select[data-category-id]").forEach((i) => {
    const r = i.dataset.categoryId;
    if (!r) return;
    const a = n[r];
    i.value = typeof a == "string" ? a : "";
  });
}
c(pp, "setCategorySelections");
function yp(e) {
  const t = {};
  return e.querySelectorAll("select[data-category-id]").forEach((n) => {
    var a, o;
    const i = n.dataset.categoryId, r = (o = (a = n.value) == null ? void 0 : a.trim) == null ? void 0 : o.call(a);
    !i || !r || (t[i] = r);
  }), Object.keys(t).length > 0 ? t : null;
}
c(yp, "readCategorySelections");
async function ds(e, t, n) {
  if (!e) return null;
  try {
    if (!n)
      return await cr(e, {});
    if (n === ge)
      return await cr(e, {
        mappingId: ge,
        categories: null,
        updatedAt: Date.now()
      });
    const i = ur(t, n);
    return i ? await cr(e, {
      mappingId: i.id,
      categories: i.categories,
      updatedAt: Date.now()
    }) : null;
  } catch (i) {
    return console.warn("eidolon-utilities | Failed to persist mapping selection", i), null;
  }
}
c(ds, "persistCurrentSelection");
function sc(e, t) {
  if (!(e instanceof HTMLElement)) return;
  const n = e.querySelector(".eidolon-light-criteria-manager__section.is-bottom");
  n instanceof HTMLElement && (n.hidden = !!(t != null && t.hidden));
}
c(sc, "updateManagerSectionVisibility");
function jn({ switcher: e, emptyState: t, state: n }) {
  const i = !!(n != null && n.base);
  e instanceof HTMLElement && (e.hidden = !i), t instanceof HTMLElement && (t.hidden = i);
}
c(jn, "updateActiveMappingVisibility");
function of(e) {
  const t = (e == null ? void 0 : e.object) ?? (e == null ? void 0 : e.document) ?? null;
  return !(t != null && t.isEmbedded) || t.documentName !== "AmbientLight" ? null : t;
}
c(of, "getAmbientLightDocument");
function bp(e) {
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
c(bp, "getPersistedAmbientLightDocument");
function vp() {
  Kg();
}
c(vp, "registerLightCriteriaHooks");
vp();
const fl = /* @__PURE__ */ new Map();
let ml = !1;
function lc(e, t) {
  fl.has(e) && console.warn(`[${T}] Socket handler for type "${e}" already registered, overwriting.`), fl.set(e, t);
}
c(lc, "registerSocketHandler");
function Ca(e, t) {
  if (!ml) {
    console.error(`[${T}] Socket not initialized. Call initializeSocket() first.`);
    return;
  }
  game.socket.emit(`module.${T}`, { type: e, payload: t });
}
c(Ca, "emitSocket");
function wp() {
  ml || (game.socket.on(`module.${T}`, (e) => {
    const { type: t, payload: n } = e ?? {}, i = fl.get(t);
    i ? i(n) : console.warn(`[${T}] No socket handler for type "${t}"`);
  }), ml = !0, console.log(`[${T}] Socket initialized on channel module.${T}`));
}
c(wp, "initializeSocket");
const sf = "tween", lf = "tween-sequence", hl = "tween-sequence-cancel", Se = Object.freeze({
  ABORT: "abort",
  CONTINUE: "continue"
}), sn = Object.freeze({
  COMPLETED: "completed",
  CANCELLED: "cancelled",
  FAILED: "failed"
}), ht = Object.freeze({
  BEFORE_ALL: "beforeAll",
  BEFORE_STEP: "before",
  ENTRY: "entry",
  AFTER_STEP: "after",
  RUNTIME: "runtime",
  VALIDATION: "validation",
  AWAIT: "await",
  EMIT: "emit",
  PARALLEL: "parallel"
}), Ua = /* @__PURE__ */ new Map();
function Mt({ type: e, execute: t, validate: n }) {
  Ua.has(e) && console.warn(`[tween-registry] Type "${e}" already registered, overwriting.`), Ua.set(e, { type: e, execute: t, validate: n ?? (() => {
  }) });
}
c(Mt, "registerTweenType");
function yi(e) {
  return Ua.get(e);
}
c(yi, "getTweenType");
function Ep(e, t = {}) {
  const n = yi(e);
  if (!n)
    throw new Error(`Unknown tween type: "${e}".`);
  return n.validate(t ?? {}), n;
}
c(Ep, "validateTweenEntry");
function gl() {
  return [...Ua.keys()];
}
c(gl, "listTweenTypes");
const Di = {
  easeInQuad: /* @__PURE__ */ c((e) => e * e, "easeInQuad"),
  easeOutQuad: /* @__PURE__ */ c((e) => e * (2 - e), "easeOutQuad"),
  easeInOutQuad: /* @__PURE__ */ c((e) => e < 0.5 ? 2 * e * e : -1 + (4 - 2 * e) * e, "easeInOutQuad"),
  easeInCubic: /* @__PURE__ */ c((e) => e * e * e, "easeInCubic"),
  easeOutCubic: /* @__PURE__ */ c((e) => {
    const t = e - 1;
    return t * t * t + 1;
  }, "easeOutCubic"),
  easeInOutCubic: /* @__PURE__ */ c((e) => e < 0.5 ? 4 * e * e * e : (e - 1) * (2 * e - 2) * (2 * e - 2) + 1, "easeInOutCubic"),
  easeOutBounce: /* @__PURE__ */ c((e) => {
    if (e < 1 / 2.75) return 7.5625 * e * e;
    if (e < 2 / 2.75) {
      const n = e - 0.5454545454545454;
      return 7.5625 * n * n + 0.75;
    }
    if (e < 2.5 / 2.75) {
      const n = e - 0.8181818181818182;
      return 7.5625 * n * n + 0.9375;
    }
    const t = e - 2.625 / 2.75;
    return 7.5625 * t * t + 0.984375;
  }, "easeOutBounce"),
  easeInBounce: /* @__PURE__ */ c((e) => 1 - Di.easeOutBounce(1 - e), "easeInBounce"),
  easeInOutBounce: /* @__PURE__ */ c((e) => e < 0.5 ? (1 - Di.easeOutBounce(1 - 2 * e)) / 2 : (1 + Di.easeOutBounce(2 * e - 1)) / 2, "easeInOutBounce"),
  easeInElastic: /* @__PURE__ */ c((e) => e === 0 || e === 1 ? e : -Math.pow(2, 10 * (e - 1)) * Math.sin((e - 1.1) * 5 * Math.PI), "easeInElastic"),
  easeOutElastic: /* @__PURE__ */ c((e) => e === 0 || e === 1 ? e : Math.pow(2, -10 * e) * Math.sin((e - 0.1) * 5 * Math.PI) + 1, "easeOutElastic")
};
function xn(e) {
  if (e && Di[e])
    return Di[e];
  const t = foundry.canvas.animation.CanvasAnimation;
  return {
    linear: t.easeLinear,
    easeInOutCosine: t.easeInOutCosine
  }[e] ?? t.easeInOutCosine;
}
c(xn, "resolveEasing");
function Bo() {
  return ["linear", "easeInOutCosine", ...Object.keys(Di)];
}
c(Bo, "listEasingNames");
function Va(e) {
  return e <= 0.04045 ? e / 12.92 : ((e + 0.055) / 1.055) ** 2.4;
}
c(Va, "srgbToLinear");
function Fi(e) {
  return e <= 31308e-7 ? 12.92 * e : 1.055 * e ** (1 / 2.4) - 0.055;
}
c(Fi, "linearToSrgb");
function tu(e, t, n) {
  const i = 0.4122214708 * e + 0.5363325363 * t + 0.0514459929 * n, r = 0.2119034982 * e + 0.6806995451 * t + 0.1073969566 * n, a = 0.0883024619 * e + 0.2817188376 * t + 0.6299787005 * n, o = Math.cbrt(i), s = Math.cbrt(r), l = Math.cbrt(a);
  return [
    0.2104542553 * o + 0.793617785 * s - 0.0040720468 * l,
    1.9779984951 * o - 2.428592205 * s + 0.4505937099 * l,
    0.0259040371 * o + 0.7827717662 * s - 0.808675766 * l
  ];
}
c(tu, "linearRgbToOklab");
function Sp(e, t, n) {
  const i = (e + 0.3963377774 * t + 0.2158037573 * n) ** 3, r = (e - 0.1055613458 * t - 0.0638541728 * n) ** 3, a = (e - 0.0894841775 * t - 1.291485548 * n) ** 3;
  return [
    4.0767416621 * i - 3.3077115913 * r + 0.2309699292 * a,
    -1.2684380046 * i + 2.6097574011 * r - 0.3413193965 * a,
    -0.0041960863 * i - 0.7034186147 * r + 1.707614701 * a
  ];
}
c(Sp, "oklabToLinearRgb");
function za(e) {
  return [e.r, e.g, e.b];
}
c(za, "colorToRgb");
function cf(e, t, n) {
  const i = /* @__PURE__ */ c((a) => Math.max(0, Math.min(1, a)), "clamp"), r = /* @__PURE__ */ c((a) => Math.round(i(a) * 255).toString(16).padStart(2, "0"), "toHex");
  return `#${r(e)}${r(t)}${r(n)}`;
}
c(cf, "rgbToHex");
function Cp(e, t, n) {
  if (n <= 0) return e.toHTML();
  if (n >= 1) return t.toHTML();
  const i = foundry.utils.Color, [r, a, o] = e.hsl, [s, l, u] = t.hsl, d = (s - r + 0.5) % 1 - 0.5, m = (r + d * n + 1) % 1, h = a + (l - a) * n, y = o + (u - o) * n;
  return i.fromHSL([m, h, y]).toHTML();
}
c(Cp, "interpolateHsl");
function Tp(e, t, n) {
  if (n <= 0) return e.toHTML();
  if (n >= 1) return t.toHTML();
  const [i, r, a] = za(e).map(Va), [o, s, l] = za(t).map(Va), u = Fi(i + (o - i) * n), d = Fi(r + (s - r) * n), m = Fi(a + (l - a) * n);
  return cf(u, d, m);
}
c(Tp, "interpolateRgb");
function Lp(e, t, n) {
  if (n <= 0) return e.toHTML();
  if (n >= 1) return t.toHTML();
  const [i, r, a] = za(e).map(Va), [o, s, l] = za(t).map(Va), [u, d, m] = tu(i, r, a), [h, y, p] = tu(o, s, l), g = 0.02, v = Math.sqrt(d * d + m * m), b = Math.sqrt(y * y + p * p);
  let w, S, I;
  if (v < g || b < g)
    w = u + (h - u) * n, S = d + (y - d) * n, I = m + (p - m) * n;
  else {
    const x = Math.atan2(m, d);
    let F = Math.atan2(p, y) - x;
    F > Math.PI && (F -= 2 * Math.PI), F < -Math.PI && (F += 2 * Math.PI), w = u + (h - u) * n;
    const D = v + (b - v) * n, _ = x + F * n;
    S = D * Math.cos(_), I = D * Math.sin(_);
  }
  const [O, k, M] = Sp(w, S, I);
  return cf(Fi(O), Fi(k), Fi(M));
}
c(Lp, "interpolateOklch");
const pl = {
  hsl: Cp,
  rgb: Tp,
  oklch: Lp
};
function uf(e = "hsl") {
  return pl[e] ?? pl.hsl;
}
c(uf, "getInterpolator");
function Ui() {
  return Object.keys(pl);
}
c(Ui, "listInterpolationModes");
function Ip(e) {
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
  if (e.mode && !Ui().includes(e.mode))
    throw new Error(
      `light-color tween: unknown mode "${e.mode}". Available: ${Ui().join(", ")}`
    );
}
c(Ip, "validate$7");
async function Op(e, t = {}) {
  const { CanvasAnimation: n } = foundry.canvas.animation, { Color: i } = foundry.utils, { uuid: r, toColor: a, toAlpha: o, mode: s = "oklch" } = e, l = Array.isArray(r) ? r : [r];
  if (l.length === 0)
    return console.warn("light-color tween: empty uuid array, nothing to animate."), !0;
  const {
    durationMS: u = 2e3,
    easing: d = "easeInOutCosine",
    commit: m = !0,
    startEpochMS: h = null,
    signal: y = null
  } = t, p = xn(d), g = a != null, v = o != null, b = g ? uf(s) : null, w = g ? i.fromString(a) : null;
  if (g && !w.valid) throw new Error(`light-color tween: invalid target color "${a}".`);
  async function S(O) {
    var W, q;
    if (y != null && y.aborted) return !1;
    const k = await fromUuid(O);
    if (!k) return !1;
    const M = k.object;
    if (!M) return !1;
    let x;
    if (g) {
      const U = (W = k.config) == null ? void 0 : W.color;
      U != null && U.valid || console.warn(`light-color tween: source color invalid on ${O}, using white.`), x = U != null && U.valid ? U : i.fromString("#ffffff");
    }
    const R = v ? ((q = k._source.config) == null ? void 0 : q.alpha) ?? 0.5 : null, F = { t: 0 }, D = `ambient-hue-tween:${O}`;
    n.terminateAnimation(D), y && y.addEventListener("abort", () => {
      n.terminateAnimation(D);
    }, { once: !0 });
    const _ = typeof h == "number" ? Math.max(0, Math.min(u, Date.now() - h)) : 0, H = /* @__PURE__ */ c((U) => {
      const J = {};
      g && (J.color = b(x, w, U)), v && (J.alpha = R + (o - R) * U), k.updateSource({ config: J }), M.initializeLightSource();
    }, "applyFrame");
    _ > 0 && (F.t = _ / u, H(F.t));
    const B = await n.animate(
      [{ parent: F, attribute: "t", to: 1 }],
      {
        name: D,
        duration: u,
        easing: p,
        time: _,
        ontick: /* @__PURE__ */ c(() => H(F.t), "ontick")
      }
    );
    if (B !== !1) {
      if (y != null && y.aborted) return !1;
      const U = {};
      g && (U.color = w.toHTML()), v && (U.alpha = o), k.updateSource({ config: U }), M.initializeLightSource();
    }
    if (m && B !== !1 && k.canUserModify(game.user, "update")) {
      if (y != null && y.aborted) return !1;
      const U = {}, J = {};
      g && (U.color = x.toHTML(), J["config.color"] = w.toHTML()), v && (U.alpha = R, J["config.alpha"] = o), k.updateSource({ config: U }), await k.update(J);
    }
    return B !== !1;
  }
  return c(S, "animateOne"), (await Promise.all(l.map(S))).every(Boolean);
}
c(Op, "execute$7");
function Ap() {
  Mt({ type: "light-color", execute: Op, validate: Ip });
}
c(Ap, "registerLightColorTween");
const ln = /* @__PURE__ */ new WeakMap();
function kp(e) {
  if ((Array.isArray(e.uuid) ? e.uuid : [e.uuid]).some((n) => !n || typeof n != "string"))
    throw new Error("light-state tween: 'uuid' is required (string or array of AmbientLight document UUIDs).");
  if (typeof e.enabled != "boolean")
    throw new Error("light-state tween: 'enabled' (boolean) is required.");
}
c(kp, "validate$6");
async function Mp(e, t = {}) {
  const { CanvasAnimation: n } = foundry.canvas.animation, { uuid: i, enabled: r } = e, a = Array.isArray(i) ? i : [i];
  if (a.length === 0)
    return console.warn("light-state tween: empty uuid array, nothing to animate."), !0;
  const {
    durationMS: o = 2e3,
    easing: s = "easeInOutCosine",
    commit: l = !0,
    startEpochMS: u = null,
    signal: d = null
  } = t, m = xn(s);
  async function h(p) {
    var k, M, x, R;
    if (d != null && d.aborted) return !1;
    const g = await fromUuid(p);
    if (!g) return !1;
    const v = g.object;
    if (!v) return !1;
    const b = `ambient-state-tween:${p}`;
    n.terminateAnimation(b), d && d.addEventListener("abort", () => {
      n.terminateAnimation(b);
    }, { once: !0 });
    const w = ln.get(g) ?? {
      hidden: g._source.hidden,
      alpha: ((k = g._source.config) == null ? void 0 : k.alpha) ?? 0.5
    };
    if (ln.set(g, w), N(`light-state START ${r ? "ON" : "OFF"} | snap: ${JSON.stringify(w)} | _source.hidden=${g._source.hidden}, _source.config.alpha=${(M = g._source.config) == null ? void 0 : M.alpha}`), r && !w.hidden || !r && w.hidden)
      return ln.delete(g), !0;
    const S = w.alpha, I = typeof u == "number" ? Math.max(0, Math.min(o, Date.now() - u)) : 0, O = /* @__PURE__ */ c((F) => {
      g.updateSource({ config: { alpha: F } }), v.initializeLightSource();
    }, "applyAlpha");
    if (r) {
      g.updateSource({ hidden: !1, config: { alpha: 0 } }), v.initializeLightSource(), canvas.perception.update({ refreshLighting: !0, refreshVision: !0 });
      const F = { t: 0 };
      I > 0 && (F.t = I / o, O(S * F.t));
      const D = await n.animate(
        [{ parent: F, attribute: "t", to: 1 }],
        {
          name: b,
          duration: o,
          easing: m,
          time: I,
          ontick: /* @__PURE__ */ c(() => O(S * F.t), "ontick")
        }
      );
      return D !== !1 && !(d != null && d.aborted) && l && g.canUserModify(game.user, "update") ? (g.updateSource({ hidden: !0, config: { alpha: S } }), await g.update({ hidden: !1 }), N(`light-state FADE-IN committed. _source.hidden=${g._source.hidden}, _source.config.alpha=${(x = g._source.config) == null ? void 0 : x.alpha}`), ln.delete(g)) : D === !1 || ln.delete(g), D !== !1;
    } else {
      g.updateSource({ hidden: !1, config: { alpha: w.alpha } }), v.initializeLightSource();
      const F = { t: 0 };
      I > 0 && (F.t = I / o, O(S * (1 - F.t)));
      const D = await n.animate(
        [{ parent: F, attribute: "t", to: 1 }],
        {
          name: b,
          duration: o,
          easing: m,
          time: I,
          ontick: /* @__PURE__ */ c(() => O(S * (1 - F.t)), "ontick")
        }
      );
      return D !== !1 && !(d != null && d.aborted) && l && g.canUserModify(game.user, "update") ? (await g.update({ hidden: !0 }), g.updateSource({ config: { alpha: S } }), v.initializeLightSource(), N(`light-state FADE-OUT committed+restored. _source.hidden=${g._source.hidden}, _source.config.alpha=${(R = g._source.config) == null ? void 0 : R.alpha}`), ln.delete(g)) : D === !1 || (g.updateSource({ hidden: !0, config: { alpha: S } }), v.initializeLightSource(), ln.delete(g)), D !== !1;
    }
  }
  return c(h, "animateOne"), (await Promise.all(a.map(h))).every(Boolean);
}
c(Mp, "execute$6");
function Np() {
  Mt({ type: "light-state", execute: Mp, validate: kp });
}
c(Np, "registerLightStateTween");
function Uo(e) {
  if ((Array.isArray(e.uuid) ? e.uuid : [e.uuid]).some((n) => !n || typeof n != "string"))
    throw new Error("tile-prop tween: 'uuid' is required (string or array of Tile document UUIDs).");
  if (!e.attribute || typeof e.attribute != "string")
    throw new Error("tile-prop tween: 'attribute' (string) is required — dot-path to a numeric property (e.g. 'alpha', 'rotation').");
  if (typeof e.value != "number")
    throw new Error("tile-prop tween: 'value' (number) is required — the target value to animate to.");
}
c(Uo, "validate$5");
async function Vo(e, t = {}) {
  const { CanvasAnimation: n } = foundry.canvas.animation, { uuid: i, attribute: r, value: a } = e, o = Array.isArray(i) ? i : [i];
  if (o.length === 0)
    return console.warn("tile-prop tween: empty uuid array, nothing to animate."), !0;
  const {
    durationMS: s = 2e3,
    easing: l = "easeInOutCosine",
    commit: u = !0,
    startEpochMS: d = null,
    signal: m = null
  } = t, h = xn(l);
  async function y(g) {
    if (m != null && m.aborted) return !1;
    const v = await fromUuid(g);
    if (!v) return !1;
    const b = v.object;
    if (!b) return !1;
    const w = foundry.utils.getProperty(v._source, r);
    if (typeof w != "number")
      return console.warn(`tile-prop tween: source value at '${r}' on ${g} is not a number (got ${typeof w}). Skipping.`), !1;
    const S = `tile-prop-tween:${r}:${g}`;
    n.terminateAnimation(S), m && m.addEventListener("abort", () => {
      n.terminateAnimation(S);
    }, { once: !0 });
    const I = typeof d == "number" ? Math.max(0, Math.min(s, Date.now() - d)) : 0, O = /* @__PURE__ */ c((x) => {
      const R = w + (a - w) * x;
      v.updateSource(foundry.utils.expandObject({ [r]: R })), b.refresh();
    }, "applyFrame"), k = { t: 0 };
    I > 0 && (k.t = I / s, O(k.t));
    const M = await n.animate(
      [{ parent: k, attribute: "t", to: 1 }],
      {
        name: S,
        duration: s,
        easing: h,
        time: I,
        ontick: /* @__PURE__ */ c(() => O(k.t), "ontick")
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
  return c(y, "animateOne"), (await Promise.all(o.map(y))).every(Boolean);
}
c(Vo, "execute$5");
function _p() {
  Mt({ type: "tile-prop", execute: Vo, validate: Uo });
}
c(_p, "registerTilePropTween");
function $p(e) {
  if (!e.attribute || typeof e.attribute != "string")
    throw new Error("particles-prop tween: 'attribute' (string) is required — property name on canvas.particleeffects (e.g. 'alpha').");
  if (typeof e.value != "number")
    throw new Error("particles-prop tween: 'value' (number) is required — the target value to animate to.");
}
c($p, "validate$4");
async function Dp(e, t = {}) {
  const { CanvasAnimation: n } = foundry.canvas.animation, { attribute: i, value: r } = e, {
    durationMS: a = 2e3,
    easing: o = "easeInOutCosine",
    startEpochMS: s = null,
    signal: l = null
  } = t, u = canvas.particleeffects;
  if (!u)
    return console.warn("particles-prop tween: canvas.particleeffects not available."), !1;
  const d = u[i];
  if (typeof d != "number")
    return console.warn(`particles-prop tween: current value of '${i}' is not a number (got ${typeof d}). Skipping.`), !1;
  const m = xn(o), h = `particles-prop-tween:${i}`;
  n.terminateAnimation(h), l && l.addEventListener("abort", () => {
    n.terminateAnimation(h);
  }, { once: !0 });
  const y = typeof s == "number" ? Math.max(0, Math.min(a, Date.now() - s)) : 0, p = /* @__PURE__ */ c((b) => {
    u[i] = d + (r - d) * b;
  }, "applyFrame"), g = { t: 0 };
  y > 0 && (g.t = y / a, p(g.t));
  const v = await n.animate(
    [{ parent: g, attribute: "t", to: 1 }],
    {
      name: h,
      duration: a,
      easing: m,
      time: y,
      ontick: /* @__PURE__ */ c(() => p(g.t), "ontick")
    }
  );
  if (v !== !1) {
    if (l != null && l.aborted) return !1;
    u[i] = r;
  }
  return v !== !1;
}
c(Dp, "execute$4");
function Fp() {
  Mt({ type: "particles-prop", execute: Dp, validate: $p });
}
c(Fp, "registerParticlesPropTween");
var hn, kr, Mr, Nr, _r, $r, Pi;
const Ec = class Ec {
  /**
   * @param {AbortController} controller
   */
  constructor(t) {
    A(this, hn);
    A(this, kr);
    A(this, Mr);
    A(this, Nr);
    A(this, _r);
    A(this, $r, !1);
    A(this, Pi, null);
    L(this, hn, t), L(this, Nr, new Promise((n) => {
      L(this, kr, n);
    })), L(this, _r, new Promise((n) => {
      L(this, Mr, n);
    }));
  }
  /** @returns {Promise<boolean>} Resolves true (completed) or false (cancelled/failed). */
  get finished() {
    return f(this, Nr);
  }
  /** @returns {Promise<{status: string, [k: string]: unknown}>} */
  get result() {
    return f(this, _r);
  }
  /** @returns {boolean} */
  get cancelled() {
    return f(this, hn).signal.aborted;
  }
  /** @returns {AbortSignal} */
  get signal() {
    return f(this, hn).signal;
  }
  /** @returns {string} */
  get status() {
    return f(this, Pi) ? f(this, Pi).status : this.cancelled ? "cancelled" : "running";
  }
  /** Abort the timeline, triggering onCancel callbacks. */
  cancel(t = "cancelled") {
    f(this, hn).signal.aborted || f(this, hn).abort(t);
  }
  /**
   * Called internally by the execution engine when the timeline finishes.
   * @param {boolean} completed - true if all steps ran, false if cancelled
   */
  _resolve(t) {
    if (f(this, $r)) return;
    L(this, $r, !0);
    const n = typeof t == "boolean" ? { status: t ? "completed" : "cancelled" } : t ?? { status: "cancelled" };
    L(this, Pi, n), f(this, kr).call(this, n.status === "completed"), f(this, Mr).call(this, n);
  }
};
hn = new WeakMap(), kr = new WeakMap(), Mr = new WeakMap(), Nr = new WeakMap(), _r = new WeakMap(), $r = new WeakMap(), Pi = new WeakMap(), c(Ec, "TimelineHandle");
let yl = Ec;
var ti, Ri, ni;
const Sc = class Sc {
  constructor() {
    /** @type {Map<string, Set<Function>>} */
    A(this, ti, /* @__PURE__ */ new Map());
    /** @type {Set<string>} Signals that have been emitted (sticky) */
    A(this, Ri, /* @__PURE__ */ new Set());
    A(this, ni, !1);
  }
  /**
   * Subscribe to a named signal.
   * @param {string} signal
   * @param {Function} listener
   * @returns {() => void} Unsubscribe function
   */
  on(t, n) {
    if (f(this, ni)) return () => {
    };
    let i = f(this, ti).get(t);
    return i || (i = /* @__PURE__ */ new Set(), f(this, ti).set(t, i)), i.add(n), () => i.delete(n);
  }
  /**
   * Fire a named signal synchronously. All registered listeners are invoked.
   * The signal is recorded so that future waitFor() calls resolve immediately.
   * @param {string} signal
   */
  emit(t) {
    if (f(this, ni)) return;
    f(this, Ri).add(t);
    const n = f(this, ti).get(t);
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
  waitFor(t, n) {
    return f(this, ni) ? Promise.reject(new Error("EventBus destroyed")) : f(this, Ri).has(t) ? Promise.resolve() : new Promise((i, r) => {
      if (n != null && n.aborted)
        return r(n.reason ?? "aborted");
      const a = this.on(t, () => {
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
    L(this, ni, !0), f(this, ti).clear(), f(this, Ri).clear();
  }
};
ti = new WeakMap(), Ri = new WeakMap(), ni = new WeakMap(), c(Sc, "EventBus");
let bl = Sc;
const df = /* @__PURE__ */ new Map();
function zo(e, t) {
  df.set(e, t);
}
c(zo, "registerAwaitProvider");
function vl(e, t) {
  const n = df.get(e.event);
  return n ? n(e, t) : Promise.reject(new Error(`Unknown await event type: "${e.event}"`));
}
c(vl, "createAwaitPromise");
zo("signal", (e, t) => e.name ? t.eventBus.waitFor(e.name, t.signal) : Promise.reject(new Error('await signal: "name" is required')));
zo("click", (e, t) => new Promise((n, i) => {
  if (t.signal.aborted) return i(t.signal.reason ?? "aborted");
  const r = /* @__PURE__ */ c(() => {
    o(), n();
  }, "onClick"), a = /* @__PURE__ */ c(() => {
    o(), i(t.signal.reason ?? "aborted");
  }, "onAbort"), o = /* @__PURE__ */ c(() => {
    document.removeEventListener("click", r), t.signal.removeEventListener("abort", a);
  }, "cleanup");
  document.addEventListener("click", r, { once: !0 }), t.signal.addEventListener("abort", a, { once: !0 });
}));
zo("keypress", (e, t) => new Promise((n, i) => {
  if (t.signal.aborted) return i(t.signal.reason ?? "aborted");
  const r = /* @__PURE__ */ c((s) => {
    e.key && s.key !== e.key || (o(), n());
  }, "onKey"), a = /* @__PURE__ */ c(() => {
    o(), i(t.signal.reason ?? "aborted");
  }, "onAbort"), o = /* @__PURE__ */ c(() => {
    document.removeEventListener("keydown", r), t.signal.removeEventListener("abort", a);
  }, "cleanup");
  document.addEventListener("keydown", r), t.signal.addEventListener("abort", a, { once: !0 });
}));
const Ii = /* @__PURE__ */ new Map();
function xp(e, t) {
  const n = Ii.get(e);
  n && !n.cancelled && n.cancel("replaced-by-name"), Ii.set(e, t), t.finished.then(() => {
    Ii.get(e) === t && Ii.delete(e);
  });
}
c(xp, "registerTimeline");
function ff(e) {
  const t = Ii.get(e);
  return t && !t.cancelled ? (t.cancel("cancelled-by-name"), !0) : !1;
}
c(ff, "cancelTimeline");
function Pp(e) {
  return Ii.get(e);
}
c(Pp, "getTimeline");
function nu(e, t) {
  return e <= 0 ? Promise.resolve() : new Promise((n, i) => {
    if (t.aborted) return i(t.reason);
    const r = setTimeout(n, e);
    t.addEventListener("abort", () => {
      clearTimeout(r), i(t.reason);
    }, { once: !0 });
  });
}
c(nu, "cancellableDelay");
var xe, gn, Dr, Fr;
const Cc = class Cc {
  constructor(t) {
    /** @type {TweenTimeline} */
    A(this, xe);
    /** @type {Array<{ type: string, params: object, opts?: object, detach: boolean }>} */
    A(this, gn, []);
    /** @type {Function|null} */
    A(this, Dr, null);
    /** @type {Function|null} */
    A(this, Fr, null);
    L(this, xe, t);
  }
  /**
   * Add a tween entry to this step.
   * @param {string} type  Registered tween type name
   * @param {object} params  Type-specific parameters
   * @param {object} [opts]  Options (durationMS, easing, etc.)
   * @returns {StepBuilder} this
   */
  add(t, n, i) {
    return f(this, gn).push({ type: t, params: n, opts: i ?? {}, detach: !1 }), this;
  }
  /**
   * Mark the last entry as fire-and-forget (does not block step progression).
   * @returns {StepBuilder} this
   */
  detach() {
    if (f(this, gn).length === 0)
      throw new Error("StepBuilder.detach(): no entry to detach.");
    return f(this, gn)[f(this, gn).length - 1].detach = !0, this;
  }
  /**
   * Callback invoked before this step's tweens start.
   * @param {Function} fn
   * @returns {StepBuilder} this
   */
  before(t) {
    return L(this, Dr, t), this;
  }
  /**
   * Callback invoked after this step's awaited tweens complete.
   * @param {Function} fn
   * @returns {StepBuilder} this
   */
  after(t) {
    return L(this, Fr, t), this;
  }
  // ── Delegation to parent TweenTimeline for fluent chaining ──
  /** Start a new step (finalizes this one). */
  step() {
    return f(this, xe).step();
  }
  /** Insert a delay between steps. */
  delay(t) {
    return f(this, xe).delay(t);
  }
  /** Insert an await segment. */
  await(t) {
    return f(this, xe).await(t);
  }
  /** Insert an emit segment. */
  emit(t) {
    return f(this, xe).emit(t);
  }
  /** Insert a parallel segment. */
  parallel(t, n) {
    return f(this, xe).parallel(t, n);
  }
  /** Register onComplete callback. */
  onComplete(t) {
    return f(this, xe).onComplete(t);
  }
  /** Register onCancel callback. */
  onCancel(t) {
    return f(this, xe).onCancel(t);
  }
  /** Register onError callback. */
  onError(t) {
    return f(this, xe).onError(t);
  }
  /** Execute the timeline. */
  run(t) {
    return f(this, xe).run(t);
  }
  /** Serialize the timeline. */
  toJSON() {
    return f(this, xe).toJSON();
  }
  // ── Internal access ──
  /** @returns {{ entries: Array, before: Function|null, after: Function|null }} */
  _finalize() {
    return {
      entries: f(this, gn),
      before: f(this, Dr),
      after: f(this, Fr)
    };
  }
};
xe = new WeakMap(), gn = new WeakMap(), Dr = new WeakMap(), Fr = new WeakMap(), c(Cc, "StepBuilder");
let wl = Cc;
var Pe, Te, Et, pn, xr, Pr, Rr, Hr, _n, El, Y, Wt, Sl, mf, Cl, hf, gf, Ta, rt, $t;
const Yt = class Yt {
  constructor() {
    A(this, Y);
    /** @type {string|null} */
    A(this, Pe, null);
    /** @type {string} */
    A(this, Te, Se.ABORT);
    /** @type {Array<object>} */
    A(this, Et, []);
    /** @type {StepBuilder|null} */
    A(this, pn, null);
    /** @type {Function|null} */
    A(this, xr, null);
    /** @type {Function|null} */
    A(this, Pr, null);
    /** @type {Function|null} */
    A(this, Rr, null);
    /** @type {Function|null} */
    A(this, Hr, null);
  }
  /**
   * Register this timeline in the named registry. Starting a new
   * timeline with the same name cancels the previous one.
   * @param {string} name
   * @returns {TweenTimeline} this
   */
  name(t) {
    return L(this, Pe, t), this;
  }
  /**
   * Set the error policy for step execution.
   * @param {"abort"|"continue"} policy
   * @returns {TweenTimeline} this
   */
  errorPolicy(t) {
    if (t !== Se.ABORT && t !== Se.CONTINUE)
      throw new Error(`Invalid error policy: "${t}". Use "abort" or "continue".`);
    return L(this, Te, t), this;
  }
  /**
   * Start a new step. Finalizes the previous step if one is open.
   * @returns {StepBuilder}
   */
  step() {
    return C(this, Y, Wt).call(this), L(this, pn, new wl(this)), f(this, pn);
  }
  /**
   * Insert a delay (in ms) between the previous step and the next.
   * @param {number} ms
   * @returns {TweenTimeline} this
   */
  delay(t) {
    return C(this, Y, Wt).call(this), f(this, Et).push({ kind: "delay", ms: t }), this;
  }
  /**
   * Pause execution until an event occurs.
   * @param {object} config  e.g. { event: "click" }, { event: "signal", name: "fog-done" }
   * @returns {TweenTimeline} this
   */
  await(t) {
    return C(this, Y, Wt).call(this), f(this, Et).push({ kind: "await", config: t }), this;
  }
  /**
   * Fire a named signal (instant, non-blocking).
   * @param {string} signal  Signal name
   * @returns {TweenTimeline} this
   */
  emit(t) {
    return C(this, Y, Wt).call(this), f(this, Et).push({ kind: "emit", signal: t }), this;
  }
  /**
   * Fork N branches with a join strategy.
   * @param {Array<(tl: TweenTimeline) => void>} branchFns  Callbacks that build each branch
   * @param {object} [opts]
   * @param {"all"|"any"|number} [opts.join="all"]  Join strategy
   * @param {"detach"|"cancel"} [opts.overflow="detach"]  What to do with un-joined branches
   * @returns {TweenTimeline} this
   */
  parallel(t, n = {}) {
    C(this, Y, Wt).call(this);
    const i = n.join ?? "all", r = n.overflow ?? "detach";
    if (i !== "all" && i !== "any" && (typeof i != "number" || i < 1 || i > t.length))
      throw new Error(`parallel: join must be "all", "any", or 1..${t.length}, got ${JSON.stringify(i)}`);
    if (r !== "detach" && r !== "cancel")
      throw new Error(`parallel: overflow must be "detach" or "cancel", got ${JSON.stringify(r)}`);
    const a = t.map((o) => {
      var l;
      const s = new Yt();
      return o(s), C(l = s, Y, Wt).call(l), f(s, Et);
    });
    return f(this, Et).push({ kind: "parallel", branches: a, join: i, overflow: r }), this;
  }
  /**
   * Callback invoked before the first step runs.
   * @param {Function} fn
   * @returns {TweenTimeline} this
   */
  beforeAll(t) {
    return L(this, xr, t), this;
  }
  /**
   * Callback invoked on successful completion.
   * @param {Function} fn
   * @returns {TweenTimeline} this
   */
  onComplete(t) {
    return L(this, Pr, t), this;
  }
  /**
   * Callback invoked on cancellation (mutually exclusive with onComplete).
   * @param {Function} fn
   * @returns {TweenTimeline} this
   */
  onCancel(t) {
    return L(this, Rr, t), this;
  }
  /**
   * Callback invoked on runtime failure (mutually exclusive with onComplete/onCancel).
   * @param {(outcome: object) => void} fn
   * @returns {TweenTimeline} this
   */
  onError(t) {
    return L(this, Hr, t), this;
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
    C(this, Y, Wt).call(this);
    const n = new AbortController();
    t.signal && (t.signal.aborted ? n.abort(t.signal.reason ?? "parent-aborted") : t.signal.addEventListener("abort", () => {
      n.signal.aborted || n.abort(t.signal.reason ?? "parent-aborted");
    }, { once: !0 }));
    const i = new yl(n);
    f(this, Pe) && xp(f(this, Pe), i);
    const r = t.broadcast ?? game.user.isGM, a = t.commit ?? game.user.isGM, o = t.startEpochMS ?? Date.now();
    r && f(this, Pe) && Ca(lf, {
      name: f(this, Pe),
      data: this.toJSON(),
      startEpochMS: o
    });
    const s = new bl(), l = {
      signal: i.signal,
      commit: a,
      startEpochMS: o,
      eventBus: s,
      errors: [],
      detachedPromises: []
    };
    return C(this, Y, mf).call(this, i, l).then((u) => {
      var d, m, h;
      s.destroy(), i._resolve(u), u.status === sn.COMPLETED ? (d = f(this, Pr)) == null || d.call(this) : u.status === sn.CANCELLED ? ((m = f(this, Rr)) == null || m.call(this), r && f(this, Pe) && Ca(hl, {
        name: f(this, Pe),
        reason: u.reason
      })) : ((h = f(this, Hr)) == null || h.call(this, u), r && f(this, Pe) && Ca(hl, {
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
    C(this, Y, Wt).call(this);
    const n = { timeline: C(i = Yt, _n, El).call(i, f(this, Et)) };
    return f(this, Pe) && (n.name = f(this, Pe)), f(this, Te) !== Se.ABORT && (n.errorPolicy = f(this, Te)), n;
  }
};
Pe = new WeakMap(), Te = new WeakMap(), Et = new WeakMap(), pn = new WeakMap(), xr = new WeakMap(), Pr = new WeakMap(), Rr = new WeakMap(), Hr = new WeakMap(), _n = new WeakSet(), El = /* @__PURE__ */ c(function(t) {
  const n = [];
  for (const i of t)
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
            return C(a = Yt, _n, El).call(a, r);
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
}, "#serializeSegments"), Y = new WeakSet(), // ── Private ─────────────────────────────────────────────────────────
Wt = /* @__PURE__ */ c(function() {
  f(this, pn) && (f(this, Et).push({ kind: "step", data: f(this, pn)._finalize() }), L(this, pn, null));
}, "#finalizeCurrentStep"), Sl = /* @__PURE__ */ c(function(t) {
  t.length !== 0 && Promise.allSettled(t).catch(() => {
  });
}, "#drainDetached"), mf = /* @__PURE__ */ c(async function(t, n) {
  var i, r;
  try {
    if (n.signal.aborted) return C(this, Y, rt).call(this, n.signal.reason);
    const a = await C(this, Y, Ta).call(this, f(this, xr), ht.BEFORE_ALL, null);
    if (a) {
      if (f(this, Te) === Se.ABORT) return a;
      n.errors.push(a);
    }
    const o = await C(this, Y, Cl).call(this, f(this, Et), n);
    if (o)
      return C(i = Yt, _n, Sl).call(i, n.detachedPromises), o;
    if (!n.signal.aborted) {
      const s = await Promise.allSettled(n.detachedPromises);
      for (const l of s)
        if (l.status === "rejected") {
          const u = C(this, Y, $t).call(this, l.reason, ht.ENTRY);
          if (f(this, Te) === Se.ABORT) return u;
          n.errors.push(u);
        }
    }
    return n.signal.aborted ? C(this, Y, rt).call(this, n.signal.reason) : {
      status: sn.COMPLETED,
      ...n.errors.length > 0 ? { errors: n.errors } : {}
    };
  } catch (a) {
    return C(r = Yt, _n, Sl).call(r, n.detachedPromises), n.signal.aborted ? C(this, Y, rt).call(this, n.signal.reason) : (console.error("TweenTimeline execution error:", a), C(this, Y, $t).call(this, a, ht.RUNTIME));
  }
}, "#execute"), Cl = /* @__PURE__ */ c(async function(t, n) {
  let i = -1, r = 0;
  for (const a of t) {
    if (n.signal.aborted) return C(this, Y, rt).call(this, n.signal.reason);
    if (a.kind === "delay") {
      try {
        await nu(a.ms, n.signal);
      } catch {
        return C(this, Y, rt).call(this, n.signal.reason);
      }
      r += a.ms;
      continue;
    }
    if (a.kind === "await") {
      try {
        let p = vl(a.config, {
          signal: n.signal,
          eventBus: n.eventBus
        });
        const g = a.config.timeout;
        typeof g == "number" && g > 0 && (p = Promise.race([
          p,
          nu(g, n.signal)
        ])), await p;
      } catch (p) {
        if (n.signal.aborted) return C(this, Y, rt).call(this, n.signal.reason);
        const g = C(this, Y, $t).call(this, p, ht.AWAIT);
        if (f(this, Te) === Se.ABORT) return g;
        n.errors.push(g);
      }
      continue;
    }
    if (a.kind === "emit") {
      try {
        n.eventBus.emit(a.signal);
      } catch (p) {
        const g = C(this, Y, $t).call(this, p, ht.EMIT);
        if (f(this, Te) === Se.ABORT) return g;
        n.errors.push(g);
      }
      continue;
    }
    if (a.kind === "parallel") {
      const p = await C(this, Y, hf).call(this, a, n, r);
      if (p) return p;
      continue;
    }
    i += 1;
    const { entries: o, before: s, after: l } = a.data, u = await C(this, Y, Ta).call(this, s, ht.BEFORE_STEP, i);
    if (u) {
      if (f(this, Te) === Se.ABORT) return u;
      n.errors.push(u);
      continue;
    }
    if (n.signal.aborted) return C(this, Y, rt).call(this, n.signal.reason);
    const d = [];
    let m = 0;
    for (const p of o) {
      const g = yi(p.type);
      if (!g) {
        const S = C(this, Y, $t).call(this, new Error(`TweenTimeline: unknown tween type "${p.type}"`), ht.ENTRY, i, p.type);
        if (f(this, Te) === Se.ABORT) return S;
        n.errors.push(S), console.warn(S.error.message);
        continue;
      }
      const v = {
        ...p.opts,
        commit: n.commit,
        startEpochMS: n.startEpochMS + r,
        signal: n.signal
      }, b = v.durationMS ?? 2e3, w = Promise.resolve().then(() => g.execute(p.params, v)).then((S) => S === !1 ? {
        ok: !1,
        failure: C(this, Y, $t).call(this, new Error("Tween entry returned false."), ht.ENTRY, i, p.type)
      } : { ok: !0 }).catch((S) => ({
        ok: !1,
        failure: C(this, Y, $t).call(this, S, ht.ENTRY, i, p.type)
      }));
      p.detach ? n.detachedPromises.push(w) : (d.push(w), m = Math.max(m, b));
    }
    const h = await C(this, Y, gf).call(this, d, n.signal);
    if (h === null) return C(this, Y, rt).call(this, n.signal.reason);
    for (const p of h)
      if (!p.ok) {
        if (f(this, Te) === Se.ABORT) return p.failure;
        n.errors.push(p.failure), console.warn("TweenTimeline: entry failed:", p.failure.error);
      }
    const y = await C(this, Y, Ta).call(this, l, ht.AFTER_STEP, i);
    if (y) {
      if (f(this, Te) === Se.ABORT) return y;
      n.errors.push(y);
    }
    if (n.signal.aborted) return C(this, Y, rt).call(this, n.signal.reason);
    r += m;
  }
  return null;
}, "#executeSegments"), hf = /* @__PURE__ */ c(async function(t, n, i = 0) {
  const { branches: r, join: a, overflow: o } = t, s = r.length, l = a === "all" ? s : a === "any" ? 1 : a, u = r.map(() => {
    const p = new AbortController();
    return n.signal.aborted ? p.abort(n.signal.reason ?? "parent-aborted") : n.signal.addEventListener("abort", () => {
      p.signal.aborted || p.abort(n.signal.reason ?? "parent-aborted");
    }, { once: !0 }), p;
  });
  let d = 0, m = 0;
  const h = new Array(s).fill(null);
  let y;
  return new Promise((p) => {
    let g = !1;
    const v = /* @__PURE__ */ c(() => {
      if (g) return;
      if (d >= l) {
        g = !0, b(), p(null);
        return;
      }
      const w = s - d - m;
      if (d + w < l) {
        g = !0, b();
        const S = h.filter((O) => O && O.status === sn.FAILED).map((O) => O), I = C(this, Y, $t).call(this, new Error(`parallel: join target ${l} impossible (${d} completed, ${m} failed)`), ht.PARALLEL);
        f(this, Te) === Se.ABORT ? p(I) : (n.errors.push(I), n.errors.push(...S), p(null));
      }
    }, "checkJoin"), b = /* @__PURE__ */ c(() => {
      if (o === "cancel")
        for (let w = 0; w < s; w++)
          !h[w] && !u[w].signal.aborted && u[w].abort("overflow-cancel");
      for (let w = 0; w < s; w++)
        h[w] || n.detachedPromises.push(y[w]);
    }, "applyOverflow");
    if (y = r.map((w, S) => {
      const I = {
        signal: u[S].signal,
        commit: n.commit,
        startEpochMS: n.startEpochMS + i,
        eventBus: n.eventBus,
        // shared
        errors: n.errors,
        // shared
        detachedPromises: n.detachedPromises
        // shared
      };
      return C(this, Y, Cl).call(this, w, I).then((O) => {
        if (O)
          if (O.status === sn.CANCELLED) {
            if (u[S].signal.aborted) {
              h[S] = O;
              return;
            }
            h[S] = O, m++;
          } else
            h[S] = O, m++;
        else
          h[S] = { status: sn.COMPLETED }, d++;
        v();
      });
    }), n.signal.aborted) {
      g = !0, p(C(this, Y, rt).call(this, n.signal.reason));
      return;
    }
    n.signal.addEventListener("abort", () => {
      g || (g = !0, p(C(this, Y, rt).call(this, n.signal.reason)));
    }, { once: !0 });
  });
}, "#executeParallel"), /**
 * @param {Array<Promise<{ok: boolean, failure?: object}>>} stepPromises
 * @param {AbortSignal} signal
 * @returns {Promise<Array<{ok: boolean, failure?: object}>|null>}
 */
gf = /* @__PURE__ */ c(function(t, n) {
  return t.length === 0 ? Promise.resolve([]) : n.aborted ? Promise.resolve(null) : new Promise((i, r) => {
    const a = /* @__PURE__ */ c(() => i(null), "onAbort");
    n.addEventListener("abort", a, { once: !0 }), Promise.all(t).then((o) => {
      n.removeEventListener("abort", a), i(o);
    }).catch((o) => {
      n.removeEventListener("abort", a), r(o);
    });
  });
}, "#waitForStep"), Ta = /* @__PURE__ */ c(async function(t, n, i) {
  if (!t) return null;
  try {
    return await t(), null;
  } catch (r) {
    const a = C(this, Y, $t).call(this, r, n, i ?? void 0);
    return f(this, Te) === Se.CONTINUE && console.warn(`TweenTimeline: hook failure in ${n}:`, r), a;
  }
}, "#runHook"), /** @param {unknown} reason */
rt = /* @__PURE__ */ c(function(t) {
  let n;
  return typeof t == "string" ? n = t : t instanceof Error && (n = t.message), {
    status: sn.CANCELLED,
    ...n ? { reason: n } : {}
  };
}, "#cancelledOutcome"), /**
 * @param {unknown} err
 * @param {string} phase
 * @param {number} [stepIndex]
 * @param {string} [entryType]
 */
$t = /* @__PURE__ */ c(function(t, n, i, r) {
  const a = t instanceof Error ? t : new Error(String(t));
  return {
    status: sn.FAILED,
    error: a,
    phase: n,
    ...typeof i == "number" ? { stepIndex: i } : {},
    ...r ? { entryType: r } : {}
  };
}, "#failedOutcome"), A(Yt, _n), c(Yt, "TweenTimeline");
let Ga = Yt;
function cc(e) {
  if (!e || typeof e != "object")
    throw new Error("Sequence JSON: data must be an object.");
  if (!Array.isArray(e.timeline))
    throw new Error("Sequence JSON: 'timeline' must be an array.");
  if (e.name != null && typeof e.name != "string")
    throw new Error("Sequence JSON: 'name' must be a string.");
  if (e.errorPolicy != null && e.errorPolicy !== Se.ABORT && e.errorPolicy !== Se.CONTINUE)
    throw new Error(`Sequence JSON: 'errorPolicy' must be "abort" or "continue".`);
  pf(e.timeline, "timeline", 0);
}
c(cc, "validateSequenceJSON");
function pf(e, t, n = 0) {
  for (let i = 0; i < e.length; i++) {
    const r = e[i], a = `${t}[${i}]`;
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
        pf(d, `${a}.parallel.branches[${u}]`, n + 1);
      }
      continue;
    }
    throw new Error(`Sequence JSON: ${a} is not a recognized segment (step array, delay, await, emit, or parallel).`);
  }
}
c(pf, "validateSegmentsJSON");
function yf(e) {
  cc(e), bf(e.timeline, "timeline");
}
c(yf, "validateSequenceSemantics");
function bf(e, t) {
  for (let n = 0; n < e.length; n++) {
    const i = e[n], r = `${t}[${n}]`;
    if (Array.isArray(i))
      for (let a = 0; a < i.length; a++) {
        const o = i[a];
        try {
          Ep(o.type, o.params ?? {});
        } catch (s) {
          throw new Error(`Sequence JSON: ${r}[${a}] failed semantic validation: ${s.message}`);
        }
      }
    else if (i.parallel)
      for (let a = 0; a < i.parallel.branches.length; a++)
        bf(i.parallel.branches[a], `${r}.parallel.branches[${a}]`);
  }
}
c(bf, "validateSegmentsSemantics");
function uc(e, t = {}) {
  cc(e), t.validateSemantics && yf(e);
  const n = new Ga();
  return e.name && n.name(e.name), e.errorPolicy && n.errorPolicy(e.errorPolicy), vf(e.timeline, n), n;
}
c(uc, "compileSequence");
function vf(e, t) {
  for (const n of e) {
    if (Array.isArray(n)) {
      const i = t.step();
      for (const r of n)
        i.add(r.type, r.params ?? {}, r.opts), r.detach && i.detach();
      continue;
    }
    if (n.delay !== void 0) {
      t.delay(n.delay);
      continue;
    }
    if (n.await !== void 0) {
      t.await(n.await);
      continue;
    }
    if (n.emit !== void 0) {
      t.emit(n.emit);
      continue;
    }
    if (n.parallel !== void 0) {
      const i = n.parallel, r = i.branches.map((a) => (o) => vf(a, o));
      t.parallel(r, {
        join: i.join ?? "all",
        overflow: i.overflow ?? "detach"
      });
    }
  }
}
c(vf, "compileSegments");
function Rp(e) {
  cc(e), yf(e);
}
c(Rp, "validate$3");
async function Hp(e, t = {}) {
  return uc(e, { validateSemantics: !0 }).run({
    broadcast: !1,
    commit: t.commit,
    startEpochMS: t.startEpochMS,
    signal: t.signal
  }).finished;
}
c(Hp, "execute$3");
function qp() {
  Mt({ type: "sequence", execute: Hp, validate: Rp });
}
c(qp, "registerSequenceTween");
function jp(e) {
  if (e.x == null && e.y == null && e.scale == null)
    throw new Error("camera-pan tween: at least one of 'x', 'y', or 'scale' is required.");
  if (e.x != null && typeof e.x != "number")
    throw new Error("camera-pan tween: 'x' must be a number.");
  if (e.y != null && typeof e.y != "number")
    throw new Error("camera-pan tween: 'y' must be a number.");
  if (e.scale != null && (typeof e.scale != "number" || e.scale <= 0))
    throw new Error("camera-pan tween: 'scale' must be a positive number.");
}
c(jp, "validate$2");
async function Bp(e, t = {}) {
  const {
    durationMS: n = 2e3,
    startEpochMS: i = null,
    signal: r = null
  } = t;
  if (r != null && r.aborted) return !1;
  const a = typeof i == "number" ? Math.max(0, Math.min(n, Date.now() - i)) : 0, o = Math.max(0, n - a), s = { duration: o };
  if (e.x != null && (s.x = e.x), e.y != null && (s.y = e.y), e.scale != null && (s.scale = e.scale), o <= 0)
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
c(Bp, "execute$2");
function Up() {
  Mt({ type: "camera-pan", execute: Bp, validate: jp });
}
c(Up, "registerCameraPanTween");
function Vp(e) {
  if ((Array.isArray(e.uuid) ? e.uuid : [e.uuid]).some((i) => !i || typeof i != "string"))
    throw new Error("tile-tint tween: 'uuid' is required (string or array of Tile document UUIDs).");
  if (e.toColor == null || typeof e.toColor != "string")
    throw new Error("tile-tint tween: 'toColor' (CSS color string) is required.");
  if (!foundry.utils.Color.fromString(e.toColor).valid)
    throw new Error(`tile-tint tween: invalid target color "${e.toColor}".`);
  if (e.mode && !Ui().includes(e.mode))
    throw new Error(
      `tile-tint tween: unknown mode "${e.mode}". Available: ${Ui().join(", ")}`
    );
}
c(Vp, "validate$1");
async function zp(e, t = {}) {
  const { CanvasAnimation: n } = foundry.canvas.animation, { Color: i } = foundry.utils, { uuid: r, toColor: a, mode: o = "oklch" } = e, s = Array.isArray(r) ? r : [r];
  if (s.length === 0)
    return console.warn("tile-tint tween: empty uuid array, nothing to animate."), !0;
  const {
    durationMS: l = 2e3,
    easing: u = "easeInOutCosine",
    commit: d = !0,
    startEpochMS: m = null,
    signal: h = null
  } = t, y = xn(u), p = uf(o), g = i.fromString(a);
  if (!g.valid) throw new Error(`tile-tint tween: invalid target color "${a}".`);
  async function v(w) {
    var H, B;
    if (h != null && h.aborted) return !1;
    const S = await fromUuid(w);
    if (!S) return !1;
    const I = S.object;
    if (!I) return !1;
    const O = ((B = (H = S._source) == null ? void 0 : H.texture) == null ? void 0 : B.tint) ?? "#ffffff", k = i.fromString(O);
    k.valid || console.warn(`tile-tint tween: source tint invalid on ${w}, using white.`);
    const M = k.valid ? k : i.fromString("#ffffff"), x = { t: 0 }, R = `tile-tint-tween:${w}`;
    n.terminateAnimation(R), h && h.addEventListener("abort", () => {
      n.terminateAnimation(R);
    }, { once: !0 });
    const F = typeof m == "number" ? Math.max(0, Math.min(l, Date.now() - m)) : 0, D = /* @__PURE__ */ c((W) => {
      const q = p(M, g, W);
      S.updateSource({ texture: { tint: q } }), I.refresh();
    }, "applyFrame");
    F > 0 && (x.t = F / l, D(x.t));
    const _ = await n.animate(
      [{ parent: x, attribute: "t", to: 1 }],
      {
        name: R,
        duration: l,
        easing: y,
        time: F,
        ontick: /* @__PURE__ */ c(() => D(x.t), "ontick")
      }
    );
    if (_ !== !1) {
      if (h != null && h.aborted) return !1;
      S.updateSource({ texture: { tint: g.toHTML() } }), I.refresh();
    }
    if (d && _ !== !1 && S.canUserModify(game.user, "update")) {
      if (h != null && h.aborted) return !1;
      S.updateSource({ texture: { tint: M.toHTML() } }), await S.update({ "texture.tint": g.toHTML() });
    }
    return _ !== !1;
  }
  return c(v, "animateOne"), (await Promise.all(s.map(v))).every(Boolean);
}
c(zp, "execute$1");
function Gp() {
  Mt({ type: "tile-tint", execute: zp, validate: Vp });
}
c(Gp, "registerTileTintTween");
function Wp(e) {
  if ((Array.isArray(e.uuid) ? e.uuid : [e.uuid]).some((n) => !n || typeof n != "string"))
    throw new Error("tile-scale tween: 'uuid' is required (string or array of Tile document UUIDs).");
  if (typeof e.toScale != "number" || e.toScale <= 0)
    throw new Error("tile-scale tween: 'toScale' must be a positive number.");
  for (const n of ["baseWidth", "baseHeight", "centerX", "centerY"])
    if (typeof e[n] != "number")
      throw new Error(`tile-scale tween: '${n}' (number) is required.`);
}
c(Wp, "validate");
async function Kp(e, t = {}) {
  const { CanvasAnimation: n } = foundry.canvas.animation, { uuid: i, toScale: r, baseWidth: a, baseHeight: o, centerX: s, centerY: l } = e, u = Array.isArray(i) ? i : [i];
  if (u.length === 0) return !0;
  const {
    durationMS: d = 2e3,
    easing: m = "easeInOutCosine",
    commit: h = !0,
    startEpochMS: y = null,
    signal: p = null
  } = t, g = xn(m), v = a * r, b = o * r, w = s - v / 2, S = l - b / 2;
  async function I(k) {
    if (p != null && p.aborted) return !1;
    const M = await fromUuid(k);
    if (!M) return !1;
    const x = M.object;
    if (!x) return !1;
    const R = M._source.width, F = M._source.height, D = M._source.x, _ = M._source.y, H = `tile-scale-tween:${k}`;
    n.terminateAnimation(H), p && p.addEventListener("abort", () => {
      n.terminateAnimation(H);
    }, { once: !0 });
    const B = typeof y == "number" ? Math.max(0, Math.min(d, Date.now() - y)) : 0, W = /* @__PURE__ */ c((J) => {
      const ae = R + (v - R) * J, Q = F + (b - F) * J, te = D + (w - D) * J, Bt = _ + (S - _) * J;
      M.updateSource({ width: ae, height: Q, x: te, y: Bt }), x.refresh();
    }, "applyFrame"), q = { t: 0 };
    B > 0 && (q.t = B / d, W(q.t));
    const U = await n.animate(
      [{ parent: q, attribute: "t", to: 1 }],
      {
        name: H,
        duration: d,
        easing: g,
        time: B,
        ontick: /* @__PURE__ */ c(() => W(q.t), "ontick")
      }
    );
    if (U !== !1) {
      if (p != null && p.aborted) return !1;
      M.updateSource({ width: v, height: b, x: w, y: S }), x.refresh();
    }
    if (h && U !== !1 && M.canUserModify(game.user, "update")) {
      if (p != null && p.aborted) return !1;
      M.updateSource({ width: R, height: F, x: D, y: _ }), await M.update({ width: v, height: b, x: w, y: S });
    }
    return U !== !1;
  }
  return c(I, "animateOne"), (await Promise.all(u.map(I))).every(Boolean);
}
c(Kp, "execute");
function Jp() {
  Mt({ type: "tile-scale", execute: Kp, validate: Wp });
}
c(Jp, "registerTileScaleTween");
async function Yp(e, t, n = {}) {
  if (!game.user.isGM)
    return ui.notifications.warn("Only the GM can dispatch tweens."), !1;
  const i = yi(e);
  if (!i)
    throw new Error(`Unknown tween type: "${e}". Registered types: ${gl().join(", ")}`);
  i.validate(t);
  const { durationMS: r = 2e3, easing: a = "easeInOutCosine", commit: o = !0 } = n, s = Date.now();
  return Ca(sf, {
    type: e,
    params: t,
    durationMS: r,
    easing: a,
    startEpochMS: s,
    commit: !1
  }), i.execute(t, { durationMS: r, easing: a, commit: o, startEpochMS: s });
}
c(Yp, "dispatchTween");
function Xp(e) {
  const { type: t, params: n, durationMS: i, easing: r, startEpochMS: a, commit: o } = e ?? {}, s = yi(t);
  if (!s) {
    console.warn(`[${T}] Received unknown tween type over socket: "${t}"`);
    return;
  }
  s.execute(n, {
    durationMS: i,
    easing: r,
    commit: o ?? !1,
    startEpochMS: a
  });
}
c(Xp, "handleTweenSocketMessage");
Ap();
Np();
_p();
Fp();
qp();
Up();
Gp();
Jp();
Mt({ type: "token-prop", execute: Vo, validate: Uo });
Mt({ type: "drawing-prop", execute: Vo, validate: Uo });
Mt({ type: "sound-prop", execute: Vo, validate: Uo });
lc(sf, Xp);
lc(lf, Qp);
lc(hl, Zp);
function Qp(e) {
  const { data: t, startEpochMS: n } = e ?? {};
  if (!t) {
    console.warn(`[${T}] Received empty tween-sequence socket message.`);
    return;
  }
  try {
    uc(t, { validateSemantics: !0 }).run({ commit: !1, startEpochMS: n, broadcast: !1 });
  } catch (i) {
    console.error(`[${T}] Failed to run received tween sequence:`, i);
  }
}
c(Qp, "handleSequenceSocketMessage");
function Zp(e) {
  const { name: t } = e ?? {};
  t && ff(t);
}
c(Zp, "handleSequenceCancelMessage");
function ey() {
  Hooks.once("ready", () => {
    wp();
    const e = game.modules.get(T);
    e.api || (e.api = {}), e.api.tween = {
      dispatch: Yp,
      types: gl,
      Timeline: Ga,
      ErrorPolicy: Se,
      compileSequence: uc,
      cancelTimeline: ff,
      getTimeline: Pp
    }, console.log(`[${T}] Tween API registered. Types: ${gl().join(", ")}`);
  });
}
c(ey, "registerTweenHooks");
ey();
const ty = ["tag", "tag-all", "id", "tags-any", "tags-all"], ny = /* @__PURE__ */ new Set(["tags-any", "tags-all"]);
function dc(e) {
  if (!e || typeof e != "string")
    return { type: "unknown", value: e ?? "" };
  if (e.startsWith("$"))
    return { type: "special", value: e };
  for (const t of ty)
    if (e.startsWith(`${t}:`)) {
      const n = e.slice(t.length + 1), i = ny.has(t) ? n.split(",").map((r) => r.trim()) : n;
      return { type: t, value: i };
    }
  return e.includes(".") ? { type: "uuid", value: e } : { type: "unknown", value: e };
}
c(dc, "parseSelector");
function iy(e) {
  if (!e) return "";
  const { type: t, value: n } = e;
  if (t === "special" || t === "uuid" || t === "unknown")
    return Array.isArray(n) ? n.join(",") : n ?? "";
  const i = Array.isArray(n) ? n.join(",") : n ?? "";
  return `${t}:${i}`;
}
c(iy, "buildSelector");
function wf(e, t = "first") {
  return e != null && e.length ? e.length === 1 ? t === "first-all" || t === "all" ? `tag-all:${e[0]}` : `tag:${e[0]}` : t === "any" ? `tags-any:${e.join(",")}` : t === "all" ? `tags-all:${e.join(",")}` : t === "first-all" ? `tags-all:${e.join(",")}` : `tags-any:${e.join(",")}` : "";
}
c(wf, "buildTagSelector");
function Go(e) {
  if (!e) return null;
  if (e.documentName || e._source !== void 0) {
    const t = e.object;
    return t ? { placeable: t, doc: e } : null;
  }
  return e.document ? { placeable: e, doc: e.document } : null;
}
c(Go, "normalizePlaceable");
function Ef() {
  var e;
  return window.Tagger ?? ((e = game.modules.get("tagger")) == null ? void 0 : e.api) ?? null;
}
c(Ef, "getTaggerAPI");
function Wo(e, t) {
  if (!e) return null;
  const n = t ?? canvas.scene;
  if (!n) return null;
  const i = dc(e);
  switch (i.type) {
    case "special":
      return ry(i.value);
    case "tag":
      return iu(i.value, n, !1);
    case "tag-all":
      return iu(i.value, n, !0);
    case "id":
      return ay(i.value, n);
    case "tags-any":
      return ru(i.value, n, !0);
    case "tags-all":
      return ru(i.value, n, !1);
    case "uuid":
      return oy(i.value);
    default:
      return null;
  }
}
c(Wo, "resolveSelector");
function ry(e) {
  var t;
  if (e === "$particles") {
    if (!((t = game.modules.get("fxmaster")) != null && t.active))
      return console.warn(`[${T}] Picker: FXMaster not active, cannot resolve "$particles".`), null;
    const n = canvas.particleeffects;
    return n ? { kind: "particles", documents: [], placeables: [], target: n } : null;
  }
  return null;
}
c(ry, "resolveSpecial");
function iu(e, t, n) {
  const i = Ef();
  if (!i)
    return console.warn(`[${T}] Picker: Tagger not available, cannot resolve tag "${e}".`), null;
  const r = i.getByTag(e, { sceneId: t.id });
  if (!(r != null && r.length)) return null;
  const a = n ? r : [r[0]], o = [];
  for (const s of a) {
    const l = Go(s);
    l && o.push(l);
  }
  return o.length === 0 ? null : {
    kind: n ? "multi-placeable" : "placeable",
    documents: o.map((s) => s.doc),
    placeables: o
  };
}
c(iu, "resolveTag");
function ay(e, t) {
  const n = [
    t.tiles,
    t.lights,
    t.tokens,
    t.drawings,
    t.sounds
  ];
  for (const i of n) {
    const r = i == null ? void 0 : i.get(e);
    if (r) {
      const a = Go(r);
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
c(ay, "resolveById");
function ru(e, t, n) {
  const i = Ef();
  if (!i)
    return console.warn(`[${T}] Picker: Tagger not available, cannot resolve multi-tag.`), null;
  const r = i.getByTag(e, {
    sceneId: t.id,
    matchAny: n
  });
  if (!(r != null && r.length)) return null;
  const a = [];
  for (const o of r) {
    const s = Go(o);
    s && a.push(s);
  }
  return a.length === 0 ? null : {
    kind: a.length === 1 ? "placeable" : "multi-placeable",
    documents: a.map((o) => o.doc),
    placeables: a
  };
}
c(ru, "resolveMultiTag");
function oy(e) {
  const t = fromUuidSync(e);
  if (!t) return null;
  const n = Go(t);
  return n ? {
    kind: "placeable",
    documents: [n.doc],
    placeables: [n]
  } : null;
}
c(oy, "resolveUUID");
function sy(e) {
  var t;
  if (!e) return null;
  if (e.kind === "particles")
    return { kind: "particles", target: e.target };
  if (e.kind === "multi-placeable")
    return { kind: "multi-placeable", placeables: e.placeables };
  if ((t = e.placeables) != null && t.length) {
    const n = e.placeables[0];
    return { kind: "placeable", placeable: n.placeable, doc: n.doc };
  }
  return null;
}
c(sy, "adaptResolved");
function Wa(e) {
  var r;
  const t = /* @__PURE__ */ new Set();
  if (e.segments)
    for (const a of Object.values(e.segments)) {
      if (a.setup) for (const o of Object.keys(a.setup)) t.add(o);
      if (a.landing) for (const o of Object.keys(a.landing)) t.add(o);
      a.timeline && Ll(a.timeline, t), (r = a.gate) != null && r.target && t.add(a.gate.target);
    }
  else {
    if (e.setup) for (const a of Object.keys(e.setup)) t.add(a);
    if (e.landing) for (const a of Object.keys(e.landing)) t.add(a);
    e.timeline && Ll(e.timeline, t);
  }
  const n = /* @__PURE__ */ new Map(), i = [];
  for (const a of t) {
    const o = Wo(a), s = sy(o);
    s ? n.set(a, s) : i.push(a);
  }
  return i.length && console.warn(`[${T}] Cinematic: ${i.length} unresolved target(s): ${i.join(", ")}`), { targets: n, unresolved: i };
}
c(Wa, "resolveAllTargets");
function ly(e, t) {
  if (!e) return {};
  const n = {};
  for (const [i, r] of Object.entries(e)) {
    const a = t.get(i);
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
c(ly, "captureSnapshot");
function cy(e) {
  const t = {};
  function n(i) {
    if (i)
      for (const [r, a] of Object.entries(i))
        t[r] || (t[r] = {}), Object.assign(t[r], a);
  }
  if (c(n, "mergeMap"), e.segments)
    for (const i of Object.values(e.segments))
      n(i.setup), n(i.landing), i.timeline && Tl(i.timeline, t, n);
  else
    n(e.setup), n(e.landing), e.timeline && Tl(e.timeline, t, n);
  return t;
}
c(cy, "gatherAllStateMaps");
function Tl(e, t, n) {
  var i;
  for (const r of e)
    if (!(r.delay != null || r.await != null || r.emit != null) && !(r.transitionTo != null || r.sound != null || r.stopSound != null)) {
      if ((i = r.parallel) != null && i.branches) {
        for (const a of r.parallel.branches)
          Tl(a, t, n);
        continue;
      }
      if (n(r.before), n(r.after), r.tweens)
        for (const a of r.tweens)
          a.target && a.attribute && (t[a.target] || (t[a.target] = {}), t[a.target][a.attribute] = "__snapshot__");
    }
}
c(Tl, "gatherFromEntries");
function Ll(e, t) {
  for (const n of e)
    if (n.delay == null && n.await == null && n.emit == null && n.transitionTo == null && n.sound == null && n.stopSound == null) {
      if (n.parallel) {
        const i = n.parallel;
        if (i.branches)
          for (const r of i.branches)
            Ll(r, t);
        continue;
      }
      if (n.before)
        for (const i of Object.keys(n.before)) t.add(i);
      if (n.after)
        for (const i of Object.keys(n.after)) t.add(i);
      if (n.tweens)
        for (const i of n.tweens)
          i.target && t.add(i.target);
    }
}
c(Ll, "collectSelectorsFromEntries");
const au = {
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
}, uy = /* @__PURE__ */ new Set([
  "alpha",
  "visible",
  "x",
  "y",
  "scale",
  "rotation"
]);
function fs(e, t, n) {
  const i = {};
  for (const [r, a] of Object.entries(e))
    t.has(r) ? i[r] = a : console.warn(`[${T}] Cinematic: blocked property "${r}" on ${n}.`);
  return i;
}
c(fs, "filterOverrides");
function Ve(e, t) {
  var i, r;
  if (!e) return;
  const n = [];
  for (const [a, o] of Object.entries(e)) {
    const s = t.get(a);
    if (s)
      if (s.kind === "particles") {
        if (s.target.destroyed) continue;
        const l = fs(o, uy, "$particles");
        for (const [u, d] of Object.entries(l))
          s.target[u] = d;
      } else if (s.kind === "multi-placeable")
        for (const { placeable: l, doc: u } of s.placeables) {
          if (!(u != null && u.parent) || !(l != null && l.scene)) continue;
          const d = u.documentName, m = au[d];
          if (!m) {
            console.warn(`[${T}] Cinematic: no allowlist for document type "${d}" on "${a}", skipping.`);
            continue;
          }
          const h = fs(o, m, `${d} "${a}"`);
          u.updateSource(h), n.push(l);
        }
      else {
        if (!((i = s.doc) != null && i.parent) || !((r = s.placeable) != null && r.scene)) continue;
        const l = s.doc.documentName, u = au[l];
        if (!u) {
          console.warn(`[${T}] Cinematic: no allowlist for document type "${l}" on "${a}", skipping.`);
          continue;
        }
        const d = fs(o, u, `${l} "${a}"`);
        s.doc.updateSource(d), n.push(s.placeable);
      }
  }
  for (const a of n)
    a.refresh();
}
c(Ve, "applyState");
function Oi(e, t) {
  var n;
  if (e)
    for (const i of Object.keys(e)) {
      const r = t.get(i);
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
c(Oi, "refreshPerceptionIfNeeded");
const dy = {
  "tile-prop": /* @__PURE__ */ new Set(["uuid", "attribute", "value"]),
  "light-color": /* @__PURE__ */ new Set(["uuid", "toColor", "toAlpha", "mode"]),
  "light-state": /* @__PURE__ */ new Set(["uuid", "enabled"]),
  "particles-prop": /* @__PURE__ */ new Set(["attribute", "value"]),
  "camera-pan": /* @__PURE__ */ new Set(["x", "y", "scale"]),
  "token-prop": /* @__PURE__ */ new Set(["uuid", "attribute", "value"]),
  "drawing-prop": /* @__PURE__ */ new Set(["uuid", "attribute", "value"]),
  "sound-prop": /* @__PURE__ */ new Set(["uuid", "attribute", "value"])
}, fy = /* @__PURE__ */ new Set(["easing"]), my = /* @__PURE__ */ new Set(["type", "target"]);
function Sf(e, t) {
  const { type: n, target: i, ...r } = e;
  if (!n)
    return console.warn(`[${T}] Cinematic: tween entry missing 'type', skipping.`), null;
  const a = {}, o = {}, s = dy[n];
  if (i === "$particles")
    a.target = "$particles";
  else if (i) {
    const l = t.get(i);
    if (!l) return null;
    l.kind === "multi-placeable" ? a.uuid = l.placeables.map((u) => u.doc.uuid) : a.uuid = l.doc.uuid;
  }
  for (const [l, u] of Object.entries(r))
    my.has(l) || (fy.has(l) ? o[l] = u : (s != null && s.has(l), a[l] = u));
  return { type: n, params: a, opts: o };
}
c(Sf, "compileTween");
const wr = /* @__PURE__ */ new Map();
let hy = 0;
async function gy(e) {
  var u, d, m, h, y;
  const { id: t, src: n, volume: i = 0.8, loop: r = !1, fadeIn: a } = e;
  if (!n) {
    console.warn(`[${T}] Cinematic sound: missing 'src', skipping.`);
    return;
  }
  const o = t || `__auto_${++hy}`, s = {
    src: n,
    autoplay: !0,
    loop: r,
    volume: i
  };
  let l = null;
  try {
    typeof ((d = (u = foundry == null ? void 0 : foundry.audio) == null ? void 0 : u.AudioHelper) == null ? void 0 : d.play) == "function" ? l = await foundry.audio.AudioHelper.play(s, !1) : typeof ((h = (m = game == null ? void 0 : game.audio) == null ? void 0 : m.constructor) == null ? void 0 : h.play) == "function" ? l = await game.audio.constructor.play(s, !1) : typeof ((y = game == null ? void 0 : game.audio) == null ? void 0 : y.play) == "function" && (l = await game.audio.play(s, !1));
  } catch (p) {
    console.error(`[${T}] Cinematic sound: failed to play "${n}":`, p);
    return;
  }
  if (!l) {
    console.warn(`[${T}] Cinematic sound: audio helper unavailable for "${n}".`);
    return;
  }
  a && a > 0 && l.fade && l.fade(i, { duration: a, from: 0 }), wr.set(o, { sound: l, config: e }), console.log(`[${T}] Cinematic sound: playing "${n}" as "${o}" (loop=${r}, vol=${i})`);
}
c(gy, "playLocalSound");
function ms(e) {
  var i, r;
  const t = wr.get(e);
  if (!t) {
    console.warn(`[${T}] Cinematic sound: no active sound with id "${e}".`);
    return;
  }
  const n = t.config.fadeOut;
  try {
    n && n > 0 && t.sound.fade ? t.sound.fade(0, { duration: n }).then(() => {
      var a, o;
      return (o = (a = t.sound).stop) == null ? void 0 : o.call(a);
    }) : (r = (i = t.sound).stop) == null || r.call(i);
  } catch (a) {
    console.warn(`[${T}] Cinematic sound: error stopping "${e}":`, a);
  }
  wr.delete(e);
}
c(ms, "stopCinematicSound");
function ou() {
  var e, t;
  for (const [n, i] of wr)
    try {
      (t = (e = i.sound).stop) == null || t.call(e);
    } catch (r) {
      console.warn(`[${T}] Cinematic sound: error stopping "${n}" during cleanup:`, r);
    }
  wr.clear();
}
c(ou, "stopAllCinematicSounds");
function py(e, t, n, i = {}) {
  const { skipToStep: r, onStepComplete: a, timelineName: o } = i, s = new n().name(o ?? `cinematic-${canvas.scene.id}`);
  return s.beforeAll(() => {
    var l;
    try {
      Ve(e.setup, t), canvas.perception.update({ refreshLighting: !0, refreshVision: !0 });
    } catch (u) {
      throw console.error(`[${T}] Cinematic: error in beforeAll (setup state) on scene ${(l = canvas.scene) == null ? void 0 : l.id}:`, u), u;
    }
  }), Tf(e.timeline, s, t, { skipToStep: r, onStepComplete: a }), { tl: s };
}
c(py, "buildTimeline");
function Cf(e, t) {
  var n;
  if (e)
    for (const i of e)
      for (const r of i) {
        if (r.before)
          try {
            Ve(r.before, t), Oi(r.before, t);
          } catch (a) {
            console.warn(`[${T}] Cinematic: error in skipped parallel before:`, a);
          }
        if (r.after)
          try {
            Ve(r.after, t), Oi(r.after, t);
          } catch (a) {
            console.warn(`[${T}] Cinematic: error in skipped parallel after:`, a);
          }
        (n = r.parallel) != null && n.branches && Cf(r.parallel.branches, t);
      }
}
c(Cf, "applyParallelStatesForSkip");
function Tf(e, t, n, i = {}) {
  const { skipToStep: r, onStepComplete: a } = i;
  let o = -1;
  for (const s of e) {
    if (s.sound != null) {
      if (r != null && o < r) continue;
      const m = s.sound, { duration: h, loop: y, fireAndForget: p } = m, g = t.step();
      if (g.before(() => {
        gy(m);
      }), h && h > 0)
        if (p) {
          if (y && m.id) {
            const v = m.id, b = h;
            g.before(() => {
              setTimeout(() => ms(v), b);
            });
          }
        } else
          t.delay(h), y && t.step().before(() => {
            ms(m.id);
          });
      continue;
    }
    if (s.stopSound != null) {
      if (r != null && o < r) continue;
      const m = s.stopSound;
      t.step().before(() => {
        ms(m);
      });
      continue;
    }
    if (s.delay != null) {
      if (r != null && o < r) continue;
      t.delay(s.delay);
      continue;
    }
    if (s.await != null) {
      if (r != null && o < r) continue;
      t.await(s.await);
      continue;
    }
    if (s.emit != null) {
      if (r != null && o < r) continue;
      t.emit(s.emit);
      continue;
    }
    if (s.parallel) {
      if (r != null && o < r) {
        Cf(s.parallel.branches, n);
        continue;
      }
      const m = s.parallel, h = m.branches.map((y) => (p) => Tf(y, p, n));
      t.parallel(h, {
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
          Ve(s.before, n), Oi(s.before, n);
        } catch (m) {
          console.warn(`[${T}] Cinematic: error applying skipped step.before:`, m);
        }
      if (s.after)
        try {
          Ve(s.after, n), Oi(s.after, n);
        } catch (m) {
          console.warn(`[${T}] Cinematic: error applying skipped step.after:`, m);
        }
      continue;
    }
    const l = o, u = t.step();
    s.before && u.before(() => {
      var m;
      try {
        Ve(s.before, n), Oi(s.before, n);
      } catch (h) {
        throw console.error(`[${T}] Cinematic: error in step.before callback on scene ${(m = canvas.scene) == null ? void 0 : m.id}:`, h), h;
      }
    });
    const d = s.duration ?? 500;
    for (const m of s.tweens) {
      const h = Sf(m, n);
      h && u.add(h.type, h.params, { ...h.opts, durationMS: d });
    }
    u.after(() => {
      var m;
      try {
        s.after && (Ve(s.after, n), Oi(s.after, n)), a == null || a(l);
      } catch (h) {
        throw console.error(`[${T}] Cinematic: error in step.after callback on scene ${(m = canvas.scene) == null ? void 0 : m.id}:`, h), h;
      }
    });
  }
}
c(Tf, "compileCinematicEntries");
function Ai(e, t, n) {
  if (e != null) {
    if (typeof e != "object" || Array.isArray(e)) {
      n.push({ path: t, level: "error", message: `Expected object, got ${Array.isArray(e) ? "array" : typeof e}` });
      return;
    }
    for (const [i, r] of Object.entries(e))
      (typeof r != "object" || r === null || Array.isArray(r)) && n.push({ path: `${t}["${i}"]`, level: "error", message: `Expected property overrides object, got ${Array.isArray(r) ? "array" : typeof r}` });
  }
}
c(Ai, "validateStateMap");
function Il(e, t, n, i) {
  var r;
  for (let a = 0; a < e.length; a++) {
    const o = e[a], s = `${t}[${a}]`;
    if (!(o.delay != null || o.await != null || o.emit != null) && !(o.transitionTo != null || o.sound != null || o.stopSound != null)) {
      if ((r = o.parallel) != null && r.branches) {
        for (let l = 0; l < o.parallel.branches.length; l++)
          Il(o.parallel.branches[l], `${s}.parallel.branches[${l}]`, n, i);
        continue;
      }
      if (Ai(o.before, `${s}.before`, i), Ai(o.after, `${s}.after`, i), o.tweens)
        for (let l = 0; l < o.tweens.length; l++) {
          const u = o.tweens[l], d = `${s}.tweens[${l}]`;
          if (!u.type) {
            i.push({ path: d, level: "error", message: "Missing 'type' field" });
            continue;
          }
          const m = yi(u.type);
          if (!m) {
            i.push({ path: d, level: "error", message: `Unknown tween type: "${u.type}"` });
            continue;
          }
          if (n)
            try {
              const h = Sf(u, n);
              h ? m.validate(h.params) : u.target && i.push({ path: d, level: "warn", message: `Target "${u.target}" could not be resolved for compilation` });
            } catch (h) {
              i.push({ path: d, level: "error", message: h.message });
            }
          n && u.target && !n.has(u.target) && i.push({ path: `${d}.target`, level: "warn", message: `Target "${u.target}" is not resolved` });
        }
    }
  }
}
c(Il, "validateEntries");
function yy(e, t = null) {
  var i;
  const n = [];
  if (!e || typeof e != "object")
    return n.push({ path: "", level: "error", message: "Cinematic data is not an object" }), n;
  if (e.segments) {
    e.entry ? e.segments[e.entry] || n.push({ path: "entry", level: "error", message: `Entry segment "${e.entry}" not found in segments` }) : n.push({ path: "entry", level: "error", message: "Missing 'entry' field" });
    const r = /* @__PURE__ */ new Set();
    let a = e.entry;
    for (; a && typeof a == "string"; ) {
      if (r.has(a)) {
        n.push({ path: `segments.${a}.next`, level: "error", message: `Cycle detected in segment graph at "${a}"` });
        break;
      }
      r.add(a), a = (i = e.segments[a]) == null ? void 0 : i.next;
    }
    for (const [o, s] of Object.entries(e.segments)) {
      const l = `segments.${o}`;
      Ai(s.setup, `${l}.setup`, n), Ai(s.landing, `${l}.landing`, n), s.timeline && Array.isArray(s.timeline) && Il(s.timeline, `${l}.timeline`, t, n), s.next && typeof s.next == "string" && !e.segments[s.next] && n.push({ path: `${l}.next`, level: "error", message: `Next segment "${s.next}" not found` });
    }
  } else
    Ai(e.setup, "setup", n), Ai(e.landing, "landing", n), e.timeline && Array.isArray(e.timeline) && Il(e.timeline, "timeline", t, n);
  return n;
}
c(yy, "validateCinematicDeep");
const hs = 5, su = /* @__PURE__ */ new Set(["click", "tile-click", "keypress"]);
var se, fe, Re, Le, ct, or, Ol, Lf, K, ke, La, Ee, gt;
const oe = class oe {
  constructor(t = null, { loadedHash: n = null, cinematicName: i = "default", segmentName: r = null } = {}) {
    A(this, K);
    A(this, se);
    A(this, fe);
    A(this, Re);
    A(this, Le);
    var o;
    L(this, se, t ?? oe.empty()), L(this, fe, i), L(this, Le, n);
    const a = (o = f(this, se).cinematics) == null ? void 0 : o[f(this, fe)];
    L(this, Re, r ?? (a == null ? void 0 : a.entry) ?? "main");
  }
  static empty() {
    return {
      version: hs,
      cinematics: {
        default: oe.emptyCinematic()
      }
    };
  }
  static emptyCinematic() {
    return {
      trigger: "canvasReady",
      tracking: !0,
      entry: "main",
      segments: {
        main: oe.emptySegment()
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
  static migrateV3toV4(t) {
    var v;
    const { trigger: n, tracking: i, synchronized: r, setup: a, landing: o, timeline: s = [] } = t;
    if (!s.some(
      (b) => {
        var w;
        return b.await != null && su.has(((w = b.await) == null ? void 0 : w.event) ?? "click");
      }
    )) {
      const b = s.filter((I) => I.transitionTo == null), w = s.find((I) => I.transitionTo != null), S = { timeline: b };
      if (a && Object.keys(a).length && (S.setup = a), o && Object.keys(o).length && (S.landing = o), w) {
        const I = w.transitionTo;
        I.scene && I.cinematic ? S.next = { segment: I.cinematic, scene: I.scene } : I.cinematic;
      }
      return {
        trigger: n,
        tracking: i,
        ...r ? { synchronized: r } : {},
        entry: "main",
        segments: { main: S }
      };
    }
    const u = {};
    let d = [], m = 1, h = null;
    const y = [];
    function p() {
      const b = `segment-${m++}`, w = { timeline: [...d] };
      return h && (w.gate = h), u[b] = w, y.push(b), d = [], h = null, b;
    }
    c(p, "flushSegment");
    for (const b of s)
      if (b.transitionTo == null) {
        if (b.await != null && su.has(((v = b.await) == null ? void 0 : v.event) ?? "click")) {
          p(), h = { ...b.await }, delete h.event, h = { event: b.await.event ?? "click", ...h };
          continue;
        }
        d.push(b);
      }
    (d.length > 0 || h) && p();
    for (let b = 0; b < y.length - 1; b++)
      u[y[b]].next = y[b + 1];
    y.length > 0 && (a && Object.keys(a).length && (u[y[0]].setup = a), o && Object.keys(o).length && (u[y[y.length - 1]].landing = o));
    const g = s.find((b) => b.transitionTo != null);
    if (g && y.length > 0) {
      const b = g.transitionTo, w = u[y[y.length - 1]];
      b.scene && b.cinematic && (w.next = { segment: b.cinematic, scene: b.scene });
    }
    return {
      trigger: n,
      tracking: i,
      ...r ? { synchronized: r } : {},
      entry: y[0] ?? "main",
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
  static migrateV4toV5(t) {
    var i, r;
    if (!t.segments) return t;
    const n = foundry.utils.deepClone(t);
    for (const a of Object.values(n.segments))
      (i = a.timeline) != null && i.length && (a.timeline = C(r = oe, ct, Ol).call(r, a.timeline));
    return n;
  }
  static fromScene(t, n = "default") {
    var o;
    const i = t == null ? void 0 : t.getFlag(T, "cinematic");
    let r = i ? foundry.utils.deepClone(i) : null;
    const a = i ? C(o = oe, ct, Lf).call(o, i) : null;
    if (r && (r.version ?? 1) < 3) {
      const { version: s, ...l } = r;
      r = { version: 3, cinematics: { default: l } };
    }
    if (r && r.version === 3) {
      for (const [s, l] of Object.entries(r.cinematics ?? {}))
        r.cinematics[s] = oe.migrateV3toV4(l);
      r.version = 4;
    }
    if (r && r.version === 4) {
      for (const [s, l] of Object.entries(r.cinematics ?? {}))
        r.cinematics[s] = oe.migrateV4toV5(l);
      r.version = hs;
    }
    return new oe(r, { loadedHash: a, cinematicName: n });
  }
  /**
   * Check if the scene's cinematic flag has been modified since this state was loaded.
   * @param {object} scene  The Foundry scene document
   * @returns {boolean} true if scene data differs from what was loaded
   */
  isStale(t) {
    if (!f(this, Le)) return !1;
    const n = t == null ? void 0 : t.getFlag(T, "cinematic");
    return n ? !foundry.utils.objectsEqual(n, f(this, Le)) : !1;
  }
  // ── Read ──────────────────────────────────────────────────────────────
  get data() {
    return f(this, se);
  }
  get trigger() {
    return f(this, K, ke).trigger;
  }
  get tracking() {
    return f(this, K, ke).tracking;
  }
  get synchronized() {
    return f(this, K, ke).synchronized ?? !1;
  }
  get activeCinematicName() {
    return f(this, fe);
  }
  // ── Segment accessors ────────────────────────────────────────────────
  get segments() {
    return f(this, K, ke).segments;
  }
  get entry() {
    return f(this, K, ke).entry;
  }
  get activeSegmentName() {
    return f(this, Re);
  }
  get activeSegment() {
    var t;
    return ((t = f(this, K, ke).segments) == null ? void 0 : t[f(this, Re)]) ?? null;
  }
  // ── Compatibility bridge: route through active segment ───────────────
  get timeline() {
    var t;
    return ((t = this.activeSegment) == null ? void 0 : t.timeline) ?? [];
  }
  get setup() {
    var t;
    return ((t = this.activeSegment) == null ? void 0 : t.setup) ?? {};
  }
  get landing() {
    var t;
    return ((t = this.activeSegment) == null ? void 0 : t.landing) ?? {};
  }
  get isEmpty() {
    var t, n;
    return !((n = (t = this.activeSegment) == null ? void 0 : t.timeline) != null && n.length);
  }
  // ── Multi-cinematic management ────────────────────────────────────────
  listCinematicNames() {
    return Object.keys(f(this, se).cinematics);
  }
  switchCinematic(t) {
    if (!f(this, se).cinematics[t]) return this;
    const n = f(this, se).cinematics[t];
    return new oe(foundry.utils.deepClone(f(this, se)), {
      loadedHash: f(this, Le),
      cinematicName: t,
      segmentName: n.entry ?? "main"
    });
  }
  addCinematic(t) {
    if (!t || f(this, se).cinematics[t]) return this;
    const n = foundry.utils.deepClone(f(this, se));
    return n.cinematics[t] = oe.emptyCinematic(), new oe(n, {
      loadedHash: f(this, Le),
      cinematicName: t,
      segmentName: "main"
    });
  }
  removeCinematic(t) {
    if (Object.keys(f(this, se).cinematics).length <= 1) return this;
    if (!f(this, se).cinematics[t]) return this;
    const i = foundry.utils.deepClone(f(this, se));
    delete i.cinematics[t];
    const r = f(this, fe) === t ? Object.keys(i.cinematics)[0] : f(this, fe), a = i.cinematics[r];
    return new oe(i, {
      loadedHash: f(this, Le),
      cinematicName: r,
      segmentName: (a == null ? void 0 : a.entry) ?? "main"
    });
  }
  renameCinematic(t, n) {
    if (!t || !n || t === n) return this;
    if (!f(this, se).cinematics[t]) return this;
    if (f(this, se).cinematics[n]) return this;
    const i = foundry.utils.deepClone(f(this, se)), r = {};
    for (const [o, s] of Object.entries(i.cinematics))
      r[o === t ? n : o] = s;
    i.cinematics = r;
    const a = f(this, fe) === t ? n : f(this, fe);
    return new oe(i, {
      loadedHash: f(this, Le),
      cinematicName: a,
      segmentName: f(this, Re)
    });
  }
  // ── Cinematic-level mutations ─────────────────────────────────────────
  setTrigger(t) {
    return C(this, K, La).call(this, { trigger: t });
  }
  setTracking(t) {
    return C(this, K, La).call(this, { tracking: t });
  }
  setSynchronized(t) {
    return C(this, K, La).call(this, { synchronized: t });
  }
  // ── Segment-level mutations (setup/landing now live on segments) ──────
  setSetup(t) {
    return C(this, K, Ee).call(this, { setup: t });
  }
  setLanding(t) {
    return C(this, K, Ee).call(this, { landing: t });
  }
  // ── Segment management methods ────────────────────────────────────────
  switchSegment(t) {
    var n;
    return (n = f(this, K, ke).segments) != null && n[t] ? new oe(foundry.utils.deepClone(f(this, se)), {
      loadedHash: f(this, Le),
      cinematicName: f(this, fe),
      segmentName: t
    }) : this;
  }
  addSegment(t, n = null) {
    var a;
    if (!t || (a = f(this, K, ke).segments) != null && a[t]) return this;
    const i = foundry.utils.deepClone(f(this, se)), r = i.cinematics[f(this, fe)];
    if (r.segments[t] = oe.emptySegment(), n && r.segments[n]) {
      const o = r.segments[n].next;
      r.segments[n].next = t, o && (r.segments[t].next = o);
    }
    return new oe(i, {
      loadedHash: f(this, Le),
      cinematicName: f(this, fe),
      segmentName: t
    });
  }
  removeSegment(t) {
    var s, l;
    if (Object.keys(f(this, K, ke).segments ?? {}).length <= 1) return this;
    if (!((s = f(this, K, ke).segments) != null && s[t])) return this;
    const i = foundry.utils.deepClone(f(this, se)), r = i.cinematics[f(this, fe)], a = r.segments[t].next;
    for (const [, u] of Object.entries(r.segments))
      (u.next === t || typeof u.next == "object" && ((l = u.next) == null ? void 0 : l.segment) === t) && (u.next = a ?? void 0, u.next || delete u.next);
    delete r.segments[t], r.entry === t && (r.entry = Object.keys(r.segments)[0]);
    const o = f(this, Re) === t ? r.entry : f(this, Re);
    return new oe(i, {
      loadedHash: f(this, Le),
      cinematicName: f(this, fe),
      segmentName: o
    });
  }
  renameSegment(t, n) {
    var s, l, u;
    if (!t || !n || t === n) return this;
    if (!((s = f(this, K, ke).segments) != null && s[t])) return this;
    if ((l = f(this, K, ke).segments) != null && l[n]) return this;
    const i = foundry.utils.deepClone(f(this, se)), r = i.cinematics[f(this, fe)], a = {};
    for (const [d, m] of Object.entries(r.segments))
      a[d === t ? n : d] = m;
    r.segments = a;
    for (const [, d] of Object.entries(r.segments))
      d.next === t ? d.next = n : typeof d.next == "object" && ((u = d.next) == null ? void 0 : u.segment) === t && (d.next.segment = n);
    r.entry === t && (r.entry = n);
    const o = f(this, Re) === t ? n : f(this, Re);
    return new oe(i, {
      loadedHash: f(this, Le),
      cinematicName: f(this, fe),
      segmentName: o
    });
  }
  setSegmentGate(t) {
    return C(this, K, Ee).call(this, { gate: t ?? void 0 });
  }
  setSegmentNext(t) {
    return C(this, K, Ee).call(this, { next: t ?? void 0 });
  }
  setSegmentSetup(t) {
    return C(this, K, Ee).call(this, { setup: t });
  }
  setSegmentLanding(t) {
    return C(this, K, Ee).call(this, { landing: t });
  }
  listSegmentNames() {
    return Object.keys(f(this, K, ke).segments ?? {});
  }
  // ── Timeline entry mutations (scoped to active segment) ──────────────
  addStep(t = -1) {
    const n = [...this.activeSegment.timeline], i = { duration: 1e3, tweens: [] };
    return t < 0 || t >= n.length ? n.push(i) : n.splice(t, 0, i), C(this, K, Ee).call(this, { timeline: n });
  }
  addDelay(t = -1, n = 1e3) {
    const i = [...this.activeSegment.timeline], r = { delay: n };
    return t < 0 || t >= i.length ? i.push(r) : i.splice(t, 0, r), C(this, K, Ee).call(this, { timeline: i });
  }
  addAwait(t = -1, n = null) {
    return console.warn(`[${T}] CinematicState.addAwait() is deprecated in v4. Use segment gates instead.`), this;
  }
  addEmit(t = -1, n = "") {
    const i = [...this.activeSegment.timeline], r = { emit: n };
    return t < 0 || t >= i.length ? i.push(r) : i.splice(t, 0, r), C(this, K, Ee).call(this, { timeline: i });
  }
  addParallel(t = -1) {
    const n = [...this.activeSegment.timeline], i = { parallel: { branches: [[], []], join: "all", overflow: "detach" } };
    return t < 0 || t >= n.length ? n.push(i) : n.splice(t, 0, i), C(this, K, Ee).call(this, { timeline: n });
  }
  addTransitionTo(t = -1, n = null) {
    return console.warn(`[${T}] CinematicState.addTransitionTo() is deprecated in v4. Use segment next edges instead.`), this;
  }
  addSound(t = -1, n = null) {
    const i = [...this.activeSegment.timeline], r = { sound: n ?? { src: "", volume: 0.8, loop: !1, duration: 0, fireAndForget: !1 } };
    return t < 0 || t >= i.length ? i.push(r) : i.splice(t, 0, r), C(this, K, Ee).call(this, { timeline: i });
  }
  addStopSound(t = -1, n = "") {
    const i = [...this.activeSegment.timeline], r = { stopSound: n };
    return t < 0 || t >= i.length ? i.push(r) : i.splice(t, 0, r), C(this, K, Ee).call(this, { timeline: i });
  }
  moveEntry(t, n) {
    if (t === n) return this;
    const i = [...this.activeSegment.timeline];
    if (t < 0 || t >= i.length) return this;
    if (n < 0 || n >= i.length) return this;
    const [r] = i.splice(t, 1);
    return i.splice(n, 0, r), C(this, K, Ee).call(this, { timeline: i });
  }
  removeEntry(t) {
    const n = [...this.activeSegment.timeline];
    return t < 0 || t >= n.length ? this : (n.splice(t, 1), C(this, K, Ee).call(this, { timeline: n }));
  }
  updateEntry(t, n) {
    const i = this.activeSegment.timeline.map((r, a) => a !== t ? r : { ...foundry.utils.deepClone(r), ...n });
    return C(this, K, Ee).call(this, { timeline: i });
  }
  // ── Tween mutations ──────────────────────────────────────────────────
  addTween(t, n = null) {
    const i = { type: "tile-prop", target: "", attribute: "alpha", value: 1 };
    return C(this, K, gt).call(this, t, (r) => {
      const a = [...r.tweens ?? [], n ?? i];
      return { ...r, tweens: a };
    });
  }
  updateTween(t, n, i) {
    return C(this, K, gt).call(this, t, (r) => {
      const a = (r.tweens ?? []).map((o, s) => s !== n ? o : { ...o, ...i });
      return { ...r, tweens: a };
    });
  }
  removeTween(t, n) {
    return C(this, K, gt).call(this, t, (i) => {
      const r = (i.tweens ?? []).filter((a, o) => o !== n);
      return { ...i, tweens: r };
    });
  }
  updateStepDuration(t, n) {
    return C(this, K, gt).call(this, t, (i) => ({ ...i, duration: Math.max(0, n) }));
  }
  // ── Parallel branch mutations ────────────────────────────────────────
  addBranch(t) {
    return C(this, K, gt).call(this, t, (n) => {
      if (!n.parallel) return n;
      const i = [...n.parallel.branches, []];
      return { ...n, parallel: { ...n.parallel, branches: i } };
    });
  }
  removeBranch(t, n) {
    return C(this, K, gt).call(this, t, (i) => {
      if (!i.parallel) return i;
      const r = i.parallel.branches.filter((a, o) => o !== n);
      return r.length < 1 ? i : { ...i, parallel: { ...i.parallel, branches: r } };
    });
  }
  addBranchEntry(t, n, i = null) {
    const r = { duration: 1e3, tweens: [] };
    return C(this, K, gt).call(this, t, (a) => {
      if (!a.parallel) return a;
      const o = a.parallel.branches.map((s, l) => l !== n ? s : [...s, i ?? r]);
      return { ...a, parallel: { ...a.parallel, branches: o } };
    });
  }
  removeBranchEntry(t, n, i) {
    return C(this, K, gt).call(this, t, (r) => {
      if (!r.parallel) return r;
      const a = r.parallel.branches.map((o, s) => s !== n ? o : o.filter((l, u) => u !== i));
      return { ...r, parallel: { ...r.parallel, branches: a } };
    });
  }
  updateBranchEntry(t, n, i, r) {
    return C(this, K, gt).call(this, t, (a) => {
      if (!a.parallel) return a;
      const o = a.parallel.branches.map((s, l) => l !== n ? s : s.map((u, d) => d !== i ? u : { ...foundry.utils.deepClone(u), ...r }));
      return { ...a, parallel: { ...a.parallel, branches: o } };
    });
  }
  moveBranchEntry(t, n, i, r) {
    return i === r ? this : C(this, K, gt).call(this, t, (a) => {
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
  async save(t) {
    const n = { ...foundry.utils.deepClone(f(this, se)), version: hs };
    await t.setFlag(T, "cinematic", n);
  }
  /** Returns the active cinematic's data (for validation/export). */
  toJSON() {
    return foundry.utils.deepClone(f(this, K, ke));
  }
  /** Returns the entire v4 flag structure. */
  toFullJSON() {
    return foundry.utils.deepClone(f(this, se));
  }
};
se = new WeakMap(), fe = new WeakMap(), Re = new WeakMap(), Le = new WeakMap(), ct = new WeakSet(), or = /* @__PURE__ */ c(function(t) {
  const { duration: n, detach: i, ...r } = t;
  return r;
}, "#stripTween"), Ol = /* @__PURE__ */ c(function(t) {
  var i, r;
  const n = [];
  for (const a of t) {
    if (a.delay != null || a.await != null || a.emit != null || a.transitionTo != null || a.sound != null || a.stopSound != null) {
      n.push(a);
      continue;
    }
    if ((i = a.parallel) != null && i.branches) {
      const l = a.parallel.branches.map(
        (u) => {
          var d;
          return C(d = oe, ct, Ol).call(d, u);
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
      const l = Math.max(500, ...a.tweens.map((m) => m.duration ?? 0)), { tweens: u, ...d } = a;
      n.push({
        ...d,
        duration: l,
        tweens: u.map(C(oe, ct, or))
      });
    } else if (o.length === 0) {
      const l = Math.max(500, ...s.map((m) => m.duration ?? 0)), { tweens: u, ...d } = a;
      n.push({
        ...d,
        duration: l,
        tweens: s.map(C(oe, ct, or))
      });
    } else {
      const l = Math.max(500, ...o.map((h) => h.duration ?? 0)), u = Math.max(500, ...s.map((h) => h.duration ?? 0)), { tweens: d, ...m } = a;
      n.push({
        parallel: {
          branches: [
            [{ ...m, duration: l, tweens: o.map(C(oe, ct, or)) }],
            [{ duration: u, tweens: s.map(C(oe, ct, or)) }]
          ],
          join: "all",
          overflow: "detach"
        }
      });
    }
  }
  return n;
}, "#migrateTimelineV5"), Lf = /* @__PURE__ */ c(function(t) {
  return foundry.utils.deepClone(t);
}, "#computeHash"), K = new WeakSet(), ke = /* @__PURE__ */ c(function() {
  return f(this, se).cinematics[f(this, fe)];
}, "#active"), // ── Internal ─────────────────────────────────────────────────────────
/** Clone the full state with a patch to the active cinematic (cinematic-level props). */
La = /* @__PURE__ */ c(function(t) {
  const n = foundry.utils.deepClone(f(this, se));
  return Object.assign(n.cinematics[f(this, fe)], t), new oe(n, {
    loadedHash: f(this, Le),
    cinematicName: f(this, fe),
    segmentName: f(this, Re)
  });
}, "#cloneActive"), /** Clone the full state with a patch to the active segment within the active cinematic. */
Ee = /* @__PURE__ */ c(function(t) {
  const n = foundry.utils.deepClone(f(this, se)), i = n.cinematics[f(this, fe)].segments[f(this, Re)];
  if (!i) return this;
  Object.assign(i, t);
  for (const [r, a] of Object.entries(i))
    a === void 0 && delete i[r];
  return new oe(n, {
    loadedHash: f(this, Le),
    cinematicName: f(this, fe),
    segmentName: f(this, Re)
  });
}, "#cloneActiveSegment"), /** Mutate a single timeline entry within the active segment. */
gt = /* @__PURE__ */ c(function(t, n) {
  const i = this.activeSegment;
  if (!i || t < 0 || t >= i.timeline.length) return this;
  const r = i.timeline.map((a, o) => o !== t ? a : n(foundry.utils.deepClone(a)));
  return C(this, K, Ee).call(this, { timeline: r });
}, "#mutateEntry"), A(oe, ct), c(oe, "CinematicState");
let Ht = oe;
const lu = [
  { value: "tile-prop", label: "Tile Prop" },
  { value: "light-color", label: "Light Color" },
  { value: "light-state", label: "Light State" },
  { value: "particles-prop", label: "Particles Prop" },
  { value: "camera-pan", label: "Camera Pan" },
  { value: "token-prop", label: "Token Prop" },
  { value: "drawing-prop", label: "Drawing Prop" },
  { value: "sound-prop", label: "Sound Prop" }
], If = {
  "tile-prop": { form: "prop", attribute: "alpha", value: 1, placeholder: "alpha, rotation, x, y, width, height" },
  "token-prop": { form: "prop", attribute: "alpha", value: 1, placeholder: "alpha, rotation, x, y" },
  "drawing-prop": { form: "prop", attribute: "alpha", value: 1, placeholder: "alpha, rotation, x, y" },
  "sound-prop": { form: "prop", attribute: "volume", value: 0.5, placeholder: "volume, radius" },
  "particles-prop": { form: "particles", attribute: "alpha", value: 1, placeholder: "alpha, rate, speed, size" },
  "camera-pan": { form: "camera", x: 0, y: 0, scale: 1 },
  "light-color": { form: "lightColor", toColor: "#ffffff", toAlpha: "", mode: "oklch" },
  "light-state": { form: "lightState", enabled: !0 }
}, by = [
  { value: "canvasReady", label: "Canvas Ready" },
  { value: "manual", label: "Manual Only" }
];
function cu(e) {
  return e && (e.split("/").pop() || "").replace(/\.[^.]+$/, "").replace(/[^a-zA-Z0-9_-]/g, "-") || "";
}
c(cu, "soundIdFromPath");
function uu(e) {
  return e ? new Promise((t) => {
    const n = new Audio(e);
    n.addEventListener("loadedmetadata", () => {
      t(Math.round(n.duration * 1e3));
    }), n.addEventListener("error", () => t(0));
  }) : Promise.resolve(0);
}
c(uu, "loadAudioDurationMs");
const Ln = 40, dr = 24, Er = 50, du = 50, Bn = 60, Wn = 10, gs = 16, Of = 40, Af = 20, vy = 90, fu = 70, mu = 8;
function Ko(e) {
  return { stepDuration: Math.max(500, e.duration ?? 500), detachOverflow: 0 };
}
c(Ko, "computeStepDurations");
function wy(e) {
  var i;
  const t = ((i = e.parallel) == null ? void 0 : i.branches) ?? [];
  let n = 0;
  for (const r of t) {
    let a = 0;
    for (const o of r)
      o.delay != null ? a += o.delay : o.await != null || o.emit != null || (o.sound != null ? a += o.sound.fireAndForget ? 0 : o.sound.duration ?? 0 : o.stopSound != null || (a += Ko(o).stepDuration));
    n = Math.max(n, a);
  }
  return Math.max(500, n);
}
c(wy, "computeParallelDuration");
function fc(e) {
  return e.reduce((t, n) => n.delay != null ? t + n.delay : n.await != null || n.emit != null || n.transitionTo != null ? t : n.sound != null ? t + (n.sound.fireAndForget ? 0 : n.sound.duration ?? 0) : n.stopSound != null ? t : n.parallel != null ? t + wy(n) : t + Ko(n).stepDuration, 0);
}
c(fc, "computeTotalDuration");
function Ey(e, t) {
  if (e <= 0) return 0.1;
  const n = t / e;
  return Math.max(0.03, Math.min(0.5, n));
}
c(Ey, "computeScale");
function kf(e) {
  const t = e.tweens ?? [];
  if (t.length === 0) return "Empty";
  const n = t[0], i = (n.target ?? "").replace(/^tag:/, "#"), r = n.attribute ?? "";
  return n.type === "camera-pan" ? "Pan" : r === "alpha" ? `Fade ${i}` : r === "x" || r === "y" ? `Move ${i}` : n.type === "light-color" ? `Light ${i}` : n.type === "sound-prop" ? `Sound ${i}` : i ? `${i}` : "Step";
}
c(kf, "deriveStepLabel");
function Sy(e, t, n, i, r) {
  var u, d;
  const a = [], o = [], s = [];
  let l = t;
  for (let m = 0; m < e.length; m++) {
    const h = e[m], y = `${i}.${m}`, p = r === y;
    if (h.delay != null) {
      const g = Math.max(Af, h.delay * n);
      a.push({ type: "delay", leftPx: l, widthPx: g, label: `${h.delay}ms`, entryPath: y, selected: p }), l += g;
    } else if (h.await != null) {
      const g = ((u = h.await) == null ? void 0 : u.event) ?? "click", v = g === "tile-click" ? "fa-hand-pointer" : g === "signal" ? "fa-bolt" : "fa-pause";
      a.push({ type: "await", leftPx: l, widthPx: gs, label: g, entryPath: y, selected: p, isGate: !0, gateIcon: v }), ((d = h.await) == null ? void 0 : d.event) === "signal" && s.push({ signal: h.await.signal, centerPx: l + gs / 2 }), l += gs;
    } else if (h.emit != null)
      a.push({ type: "emit", leftPx: l, widthPx: Wn, label: "emit", entryPath: y, selected: p, isMarker: !0 }), o.push({ signal: h.emit, centerPx: l + Wn / 2 });
    else if (h.sound != null) {
      const g = (h.sound.src || "").split("/").pop() || "Sound", v = h.sound.duration ?? 0;
      if (h.sound.fireAndForget ?? !1)
        a.push({ type: "sound", leftPx: l, widthPx: Wn, label: g, entryPath: y, selected: p, isMarker: !0 });
      else {
        const w = v > 0 ? Math.max(Bn, v * n) : Bn, S = (h.sound.loop ?? !1) && v <= 0;
        a.push({ type: "sound", leftPx: l, widthPx: w, label: g, entryPath: y, selected: p, hasTrailingArrow: S }), l += w;
      }
    } else if (h.stopSound != null)
      a.push({ type: "stopSound", leftPx: l, widthPx: Wn, label: "Stop", entryPath: y, selected: p, isMarker: !0 });
    else {
      const { stepDuration: g } = Ko(h), v = Math.max(Of, g * n), b = kf(h);
      a.push({ type: "step", leftPx: l, widthPx: v, label: b, entryPath: y, selected: p }), l += v;
    }
  }
  return { blocks: a, width: l - t, emits: o, awaits: s };
}
c(Sy, "computeBranchLane");
function hu(e) {
  return dr + e * Ln;
}
c(hu, "laneIndexToY");
function Cy(e, t) {
  const n = [];
  for (const i of e.emits)
    for (const r of e.awaits) {
      if (i.signal !== r.signal) continue;
      const a = i.centerPx, o = hu(i.laneIndex) + Ln / 2, s = r.centerPx, l = hu(r.laneIndex) + Ln / 2, u = l - o, d = (a + s) / 2, m = o + Math.sign(u || 1) * Math.min(40, Math.abs(u) * 0.5 + 20), h = l - Math.sign(u || 1) * Math.min(40, Math.abs(u) * 0.5 + 20);
      n.push({
        pathD: `M ${a} ${o} C ${d} ${m}, ${d} ${h}, ${s} ${l}`,
        signal: i.signal
      });
    }
  return n;
}
c(Cy, "computeSignalArcs");
function Ty(e, t) {
  const n = [];
  if (e <= 0) return n;
  const i = t * 1e3;
  let r;
  i >= 200 ? r = 500 : i >= 80 ? r = 1e3 : i >= 40 ? r = 2e3 : r = 5e3;
  for (let a = 0; a <= e + r; a += r) {
    const o = a >= 1e3 ? `${(a / 1e3).toFixed(a % 1e3 === 0 ? 0 : 1)}s` : `${a}ms`;
    n.push({ px: Er + a * t, label: o });
  }
  return n;
}
c(Ty, "computeTimeMarkers");
function Ly(e) {
  const t = [];
  for (let n = 0; n < e.length - 1; n++) {
    const i = e[n], r = e[n + 1], a = i.leftPx + i.widthPx + (r.leftPx - (i.leftPx + i.widthPx)) / 2, o = dr + Ln / 2;
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
    t.push({ leftPx: a, topPx: o, insertIndex: s, lane: "main", isEnd: l });
  }
  return t;
}
c(Ly, "computeInsertionPoints");
function Iy(e, { selectedPath: t, windowWidth: n }) {
  const i = fc(e), r = n - 70 - 100, a = Ey(i, r), o = [], s = [], l = { emits: [], awaits: [] }, u = [];
  o.push({
    type: "setup",
    leftPx: 0,
    widthPx: Er,
    label: "Setup",
    entryPath: "setup",
    selected: t === "setup"
  });
  let d = Er;
  for (let w = 0; w < e.length; w++) {
    const S = e[w], I = `timeline.${w}`, O = t === I;
    if (S.delay != null) {
      const k = Math.max(Af, S.delay * a);
      o.push({
        type: "delay",
        leftPx: d,
        widthPx: k,
        label: `${S.delay}ms`,
        entryPath: I,
        selected: O
      }), d += k;
    } else if (S.emit != null)
      o.push({
        type: "emit",
        leftPx: d,
        widthPx: Wn,
        label: "Emit",
        entryPath: I,
        selected: O,
        isMarker: !0
      }), l.emits.push({
        signal: S.emit,
        centerPx: d + Wn / 2,
        laneIndex: 0
      });
    else if (S.sound != null) {
      const k = (S.sound.src || "").split("/").pop() || "Sound", M = S.sound.duration ?? 0;
      if (S.sound.fireAndForget ?? !1) {
        const R = M > 0 ? Math.max(Bn, M * a) : Bn, F = (S.sound.loop ?? !1) && M <= 0, D = {
          type: "sound",
          leftPx: d,
          widthPx: R,
          label: k,
          entryPath: I,
          selected: O,
          hasTrailingArrow: F
        };
        let _ = !1;
        for (const H of u)
          if (H.rightEdgePx <= d) {
            H.blocks.push(D), H.rightEdgePx = d + R, _ = !0;
            break;
          }
        _ || u.push({
          label: "♫ F&F",
          blocks: [D],
          rightEdgePx: d + R
        });
      } else {
        const R = M > 0 ? Math.max(Bn, M * a) : Bn, F = (S.sound.loop ?? !1) && M <= 0;
        o.push({
          type: "sound",
          leftPx: d,
          widthPx: R,
          label: k,
          entryPath: I,
          selected: O,
          hasTrailingArrow: F
        }), d += R;
      }
    } else if (S.stopSound != null)
      o.push({
        type: "stopSound",
        leftPx: d,
        widthPx: Wn,
        label: "Stop",
        entryPath: I,
        selected: O,
        isMarker: !0
      });
    else if (S.parallel != null) {
      const k = S.parallel.branches ?? [], M = d, x = [];
      let R = 0;
      for (let D = 0; D < k.length; D++) {
        const _ = `timeline.${w}.parallel.branches.${D}`, { blocks: H, width: B, emits: W, awaits: q } = Sy(k[D], M, a, _, t);
        x.push({ label: `Br ${D + 1}`, blocks: H }), R = Math.max(R, B);
        const U = s.length * 10 + D + 1;
        for (const J of W) l.emits.push({ ...J, laneIndex: U });
        for (const J of q) l.awaits.push({ ...J, laneIndex: U });
      }
      const F = Math.max(Bn, R);
      o.push({
        type: "parallel",
        leftPx: M,
        widthPx: F,
        label: `${k.length} br`,
        entryPath: I,
        selected: O
      }), s.push({ parallelEntryIndex: w, startPx: M, lanes: x }), d += F;
    } else {
      const { stepDuration: k } = Ko(S), M = Math.max(Of, k * a), x = kf(S);
      o.push({
        type: "step",
        leftPx: d,
        widthPx: M,
        label: x,
        entryPath: I,
        selected: O
      }), d += M;
    }
  }
  o.push({
    type: "landing",
    leftPx: d,
    widthPx: du,
    label: "Landing",
    entryPath: "landing",
    selected: t === "landing"
  }), d += du;
  const m = s.flatMap((w) => w.lanes), h = m.length;
  for (const w of u)
    m.push({ label: w.label, blocks: w.blocks });
  const y = Cy(l, m.length), p = [];
  for (let w = 0; w < u.length; w++) {
    const S = h + w;
    for (const I of u[w].blocks) {
      const O = I.leftPx, k = dr + Ln, M = dr + (1 + S) * Ln + Ln / 2;
      p.push({ x: O, y1: k, y2: M });
    }
  }
  const g = Ty(i, a), v = Ly(o), b = dr + (1 + m.length) * Ln;
  return {
    mainBlocks: o,
    subLanes: m,
    signalArcs: y,
    fafConnectors: p,
    timeMarkers: g,
    insertionPoints: v,
    totalWidthPx: Math.max(d, 200),
    swimlaneHeightPx: b,
    totalDurationMs: i
  };
}
c(Iy, "computeLanes");
function Oy(e) {
  if (e <= 0) return "0s";
  if (e < 1e3) return `${e}ms`;
  const t = e / 1e3;
  return t % 1 === 0 ? `${t}s` : `${t.toFixed(1)}s`;
}
c(Oy, "formatDuration");
function Ay(e, t) {
  var y, p, g, v;
  const n = e.segments ?? {}, i = e.entry ?? "main", r = Object.keys(n);
  if (r.length === 0)
    return { nodes: [], edges: [], totalWidthPx: 0 };
  const a = /* @__PURE__ */ new Set(), o = [];
  let s = i;
  for (; s && typeof s == "string" && n[s] && !a.has(s); )
    a.add(s), o.push(s), s = n[s].next;
  for (const b of r)
    a.has(b) || o.push(b);
  const l = [];
  let u = mu;
  for (const b of o) {
    const w = n[b], S = fc(w.timeline ?? []), I = Oy(S), O = b === i, k = b === t, M = !a.has(b), x = vy;
    l.push({
      name: b,
      durationMs: S,
      durationLabel: I,
      isEntry: O,
      isActive: k,
      isOrphan: M,
      leftPx: u,
      widthPx: x,
      hasGate: !!w.gate,
      gateEvent: ((y = w.gate) == null ? void 0 : y.event) ?? null
    }), u += x + fu;
  }
  const d = [], m = new Map(l.map((b) => [b.name, b]));
  for (const b of o) {
    const w = n[b];
    if (!w.next) continue;
    const S = typeof w.next == "string" ? w.next : (p = w.next) == null ? void 0 : p.segment;
    if (!S) continue;
    const I = m.get(b), O = m.get(S);
    if (!I || !O) continue;
    const k = n[S], M = ((g = k == null ? void 0 : k.gate) == null ? void 0 : g.event) ?? null, x = typeof w.next == "object" && ((v = w.next) == null ? void 0 : v.scene);
    d.push({
      fromName: b,
      toName: S,
      gateLabel: M,
      isCrossScene: x,
      fromRightPx: I.leftPx + I.widthPx,
      toLeftPx: O.leftPx
    });
  }
  const h = u - fu + mu;
  return { nodes: l, edges: d, totalWidthPx: h };
}
c(Ay, "computeSegmentGraph");
function Nn(e) {
  if (!e) return null;
  if (e === "setup") return { type: "setup" };
  if (e === "landing") return { type: "landing" };
  const t = e.split(".");
  if (t[0] === "timeline") {
    const n = Number(t[1]);
    if (t.length === 2) return { type: "timeline", index: n };
    if (t[2] === "parallel" && t[3] === "branches" && t.length >= 6)
      return {
        type: "branch",
        index: n,
        branchIndex: Number(t[4]),
        branchEntryIndex: Number(t[5])
      };
  }
  return null;
}
c(Nn, "parseEntryPath");
function Ka(e, t) {
  var i, r, a, o;
  const n = Nn(e);
  return n ? n.type === "setup" ? t.setup : n.type === "landing" ? t.landing : n.type === "timeline" ? t.timeline[n.index] : n.type === "branch" ? (o = (a = (r = (i = t.timeline[n.index]) == null ? void 0 : i.parallel) == null ? void 0 : r.branches) == null ? void 0 : a[n.branchIndex]) == null ? void 0 : o[n.branchEntryIndex] : null : null;
}
c(Ka, "getEntryAtPath");
function gu(e) {
  const t = Nn(e);
  return !t || t.type !== "timeline" ? null : t.index;
}
c(gu, "getTimelineIndexFromPath");
function ky(e) {
  var a, o;
  const t = /* @__PURE__ */ new Set(), i = (a = e.data.cinematics) == null ? void 0 : a[e.activeCinematicName];
  if (!i) return 0;
  function r(s) {
    var l;
    for (const u of s ?? []) {
      if (u.tweens)
        for (const d of u.tweens)
          d.target && t.add(d.target);
      if (u.before) for (const d of Object.keys(u.before)) t.add(d);
      if (u.after) for (const d of Object.keys(u.after)) t.add(d);
      if ((l = u.parallel) != null && l.branches)
        for (const d of u.parallel.branches) r(d);
    }
  }
  if (c(r, "collectFromTimeline"), i.segments)
    for (const s of Object.values(i.segments)) {
      if (s.setup) for (const l of Object.keys(s.setup)) t.add(l);
      if (s.landing) for (const l of Object.keys(s.landing)) t.add(l);
      (o = s.gate) != null && o.target && t.add(s.gate.target), r(s.timeline);
    }
  else {
    if (i.setup) for (const s of Object.keys(i.setup)) t.add(s);
    if (i.landing) for (const s of Object.keys(i.landing)) t.add(s);
    r(i.timeline);
  }
  return t.size;
}
c(ky, "countUniqueTargets");
function My(e, t) {
  var i, r, a;
  const n = Nn(e);
  if (!n) return 0;
  if (n.type === "timeline") {
    let o = 0;
    for (let s = 0; s <= n.index; s++) {
      const l = t.timeline[s];
      l && l.delay == null && l.emit == null && l.parallel == null && l.sound == null && l.stopSound == null && o++;
    }
    return o;
  }
  if (n.type === "branch") {
    const o = ((a = (r = (i = t.timeline[n.index]) == null ? void 0 : i.parallel) == null ? void 0 : r.branches) == null ? void 0 : a[n.branchIndex]) ?? [];
    let s = 0;
    for (let l = 0; l <= n.branchEntryIndex; l++) {
      const u = o[l];
      u && u.delay == null && u.emit == null && u.sound == null && u.stopSound == null && s++;
    }
    return s;
  }
  return 0;
}
c(My, "stepNumberForPath");
function Ny(e) {
  return {
    isSetup: !0,
    targetCount: Object.keys(e.setup ?? {}).length
  };
}
c(Ny, "buildSetupDetail");
function _y(e) {
  return {
    isLanding: !0,
    targetCount: Object.keys(e.landing ?? {}).length
  };
}
c(_y, "buildLandingDetail");
function $y(e) {
  return { type: "delay", isDelay: !0, delay: e.delay };
}
c($y, "buildDelayDetail");
function Dy(e) {
  return { type: "emit", isEmit: !0, signal: e.emit };
}
c(Dy, "buildEmitDetail");
function Fy(e) {
  const t = (e.sound.src || "").split("/").pop() || "";
  return {
    type: "sound",
    isSound: !0,
    soundSrc: e.sound.src ?? "",
    soundFilename: t,
    soundId: e.sound.id ?? "",
    soundVolume: e.sound.volume ?? 0.8,
    soundLoop: e.sound.loop ?? !1,
    soundFadeIn: e.sound.fadeIn ?? "",
    soundFadeOut: e.sound.fadeOut ?? "",
    soundDuration: e.sound.duration ?? 0,
    soundFireAndForget: e.sound.fireAndForget ?? !1,
    soundModeForever: (e.sound.loop ?? !1) && !((e.sound.duration ?? 0) > 0)
  };
}
c(Fy, "buildSoundDetail");
function xy(e) {
  return {
    type: "stopSound",
    isStopSound: !0,
    stopSoundId: e.stopSound
  };
}
c(xy, "buildStopSoundDetail");
function Py(e, t) {
  var o;
  const n = e.parallel, i = n.join ?? "all", r = n.overflow ?? "detach", a = (n.branches ?? []).map((s, l) => ({
    branchIndex: l,
    label: `Branch ${l + 1}`,
    entries: (s ?? []).map((u, d) => {
      var S, I;
      const m = u.delay != null, h = u.await != null, y = u.emit != null, p = u.sound != null, g = u.stopSound != null, v = !m && !h && !y && !p && !g;
      let b, w;
      return m ? (b = `${u.delay}ms`, w = "delay") : h ? (b = "Await", w = ((S = u.await) == null ? void 0 : S.event) ?? "click") : y ? (b = "Emit", w = u.emit || "(unnamed)") : p ? (b = "Sound", w = (u.sound.src || "").split("/").pop() || "(none)") : g ? (b = "Stop Sound", w = u.stopSound || "(no id)") : (b = "Step", w = `${((I = u.tweens) == null ? void 0 : I.length) ?? 0} tweens`), { branchEntryIndex: d, isDelay: m, isAwait: h, isEmit: y, isSound: p, isStopSound: g, isStep: v, label: b, sub: w };
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
c(Py, "buildParallelDetail");
function Ry(e, t, n, i) {
  const r = Bo(), a = (e.tweens ?? []).map((l, u) => {
    const d = `${t}.tweens.${u}`, m = n.has(d), h = l.type ?? "tile-prop", y = lu.find((b) => b.value === h), p = If[h], g = (p == null ? void 0 : p.form) ?? "prop", v = l.mode ?? "oklch";
    return {
      tweenIndex: u,
      isExpanded: m,
      type: h,
      typeLabel: (y == null ? void 0 : y.label) ?? l.type ?? "Tile Prop",
      target: l.target ?? "",
      attribute: l.attribute ?? "",
      attributePlaceholder: (p == null ? void 0 : p.placeholder) ?? "",
      value: l.value ?? "",
      easing: l.easing ?? "",
      // Form group flags
      formGroup: g,
      formIsProp: g === "prop",
      formIsParticles: g === "particles",
      formIsCamera: g === "camera",
      formIsLightColor: g === "lightColor",
      formIsLightState: g === "lightState",
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
      typeOptions: lu.map((b) => ({
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
  }), o = Object.keys(e.before ?? {}), s = Object.keys(e.after ?? {});
  return {
    type: "step",
    isStep: !0,
    isDelay: !1,
    stepNumber: My(t, i),
    stepDuration: e.duration ?? 1e3,
    tweens: a,
    beforeSummary: o.length ? `${o.length} target${o.length !== 1 ? "s" : ""}` : "(none)",
    afterSummary: s.length ? `${s.length} target${s.length !== 1 ? "s" : ""}` : "(none)"
  };
}
c(Ry, "buildStepDetail");
function Hy(e, { state: t, expandedTweens: n }) {
  const i = Nn(e);
  if (!i) return null;
  if (i.type === "setup") return Ny(t);
  if (i.type === "landing") return _y(t);
  const r = Ka(e, t);
  return r ? r.delay != null ? $y(r) : r.emit != null ? Dy(r) : r.sound != null ? Fy(r) : r.stopSound != null ? xy(r) : r.parallel != null && i.type === "timeline" ? Py(r) : Ry(r, e, n, t) : null;
}
c(Hy, "buildDetail");
function qy({ state: e, mutate: t }) {
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
              t(() => new Ht(l));
            else if (l.segments !== void 0) {
              const u = { version: 4, cinematics: { [e.activeCinematicName]: l } };
              t(() => new Ht(u, { cinematicName: e.activeCinematicName }));
            } else if (l.timeline !== void 0) {
              const u = { version: 3, cinematics: { [e.activeCinematicName]: l } };
              t(() => new Ht(u, { cinematicName: e.activeCinematicName }));
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
c(qy, "showImportDialog");
function Ja(e, { state: t, mutate: n }) {
  const i = e === "setup" ? t.setup : t.landing, r = JSON.stringify(i ?? {}, null, 2);
  new Dialog({
    title: `Edit ${e.charAt(0).toUpperCase() + e.slice(1)}`,
    content: `
			<p style="font-size:0.82rem;margin-bottom:0.4rem">JSON map of target selector → property overrides:</p>
			<textarea id="cinematic-json-edit" style="width:100%;height:200px;font-family:monospace;font-size:0.8rem">${Ot(r)}</textarea>
		`,
    buttons: {
      save: {
        label: "Apply",
        callback: /* @__PURE__ */ c((a) => {
          var s, l;
          const o = a.find("#cinematic-json-edit").val();
          try {
            const u = JSON.parse(o);
            n(e === "setup" ? (d) => d.setSetup(u) : (d) => d.setLanding(u));
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
c(Ja, "showEditJsonDialog");
function pu(e, { selectedPath: t, state: n, mutate: i }) {
  const r = Ka(t, n);
  if (!r || r.delay != null) return;
  const a = r[e] ?? {}, o = JSON.stringify(a, null, 2);
  new Dialog({
    title: `Edit Step ${e.charAt(0).toUpperCase() + e.slice(1)}`,
    content: `
			<p style="font-size:0.82rem;margin-bottom:0.4rem">JSON map of target selector → property overrides:</p>
			<textarea id="cinematic-json-edit" style="width:100%;height:200px;font-family:monospace;font-size:0.8rem">${Ot(o)}</textarea>
		`,
    buttons: {
      save: {
        label: "Apply",
        callback: /* @__PURE__ */ c((s) => {
          var u, d;
          const l = s.find("#cinematic-json-edit").val();
          try {
            const m = JSON.parse(l), h = Nn(t);
            (h == null ? void 0 : h.type) === "timeline" ? i((y) => y.updateEntry(h.index, { [e]: m })) : (h == null ? void 0 : h.type) === "branch" && i((y) => y.updateBranchEntry(h.index, h.branchIndex, h.branchEntryIndex, { [e]: m }));
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
c(pu, "showEditStepStateDialog");
function jy({ selectedPath: e, state: t, mutate: n }) {
  const i = Nn(e);
  if (!i || i.type !== "timeline") return;
  const r = t.timeline[i.index];
  if (!(r != null && r.parallel)) return;
  const a = JSON.stringify(r.parallel.branches ?? [], null, 2);
  new Dialog({
    title: "Edit Parallel Branches",
    content: `
			<p style="font-size:0.82rem;margin-bottom:0.4rem">JSON array of branch timelines:</p>
			<textarea id="cinematic-json-edit" style="width:100%;height:250px;font-family:monospace;font-size:0.8rem">${Ot(a)}</textarea>
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
            n((m) => m.updateEntry(i.index, {
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
c(jy, "showEditParallelJsonDialog");
var Pu, yn, An, Ia, Mf;
const yt = class yt extends Fn(Dn) {
  constructor(n = {}) {
    super(n);
    A(this, An);
    A(this, yn, null);
    L(this, yn, n.scene ?? canvas.scene ?? null);
  }
  async _prepareContext() {
    var r, a, o;
    const n = f(this, An, Ia), i = ((a = n == null ? void 0 : n.getSeenStatus) == null ? void 0 : a.call(n, (r = f(this, yn)) == null ? void 0 : r.id)) ?? [];
    return {
      sceneName: ((o = f(this, yn)) == null ? void 0 : o.name) ?? "No scene",
      users: i.map((s) => ({
        ...s,
        statusLabel: s.seen ? "Seen" : "Not seen",
        statusClass: s.seen ? "cinematic-tracking__status--seen" : "cinematic-tracking__status--unseen"
      })),
      hasAnyTracked: i.some((s) => s.seen)
    };
  }
  _onRender(n, i) {
    super._onRender(n, i), C(this, An, Mf).call(this);
  }
};
yn = new WeakMap(), An = new WeakSet(), Ia = /* @__PURE__ */ c(function() {
  var n, i;
  return (i = (n = game.modules.get(T)) == null ? void 0 : n.api) == null ? void 0 : i.cinematic;
}, "#api"), Mf = /* @__PURE__ */ c(function() {
  var i, r;
  const n = this.element;
  n instanceof HTMLElement && (n.querySelectorAll("[data-action='reset-user']").forEach((a) => {
    a.addEventListener("click", async () => {
      var l;
      const o = a.dataset.userId;
      if (!o) return;
      const s = f(this, An, Ia);
      s != null && s.resetForUser && (await s.resetForUser((l = f(this, yn)) == null ? void 0 : l.id, o), this.render({ force: !0 }));
    });
  }), (i = n.querySelector("[data-action='reset-all']")) == null || i.addEventListener("click", async () => {
    var o;
    const a = f(this, An, Ia);
    a != null && a.resetForAll && (await a.resetForAll((o = f(this, yn)) == null ? void 0 : o.id), this.render({ force: !0 }));
  }), (r = n.querySelector("[data-action='refresh']")) == null || r.addEventListener("click", () => {
    this.render({ force: !0 });
  }));
}, "#bindEvents"), c(yt, "CinematicTrackingApplication"), pe(yt, "APP_ID", `${T}-cinematic-tracking`), pe(yt, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  $e(yt, yt, "DEFAULT_OPTIONS"),
  {
    id: yt.APP_ID,
    classes: Array.from(
      /* @__PURE__ */ new Set([...((Pu = $e(yt, yt, "DEFAULT_OPTIONS")) == null ? void 0 : Pu.classes) ?? [], "eidolon-cinematic-tracking-window", "themed"])
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
)), pe(yt, "PARTS", {
  content: {
    template: `modules/${T}/templates/cinematic-tracking.html`
  }
});
let Al = yt;
function By(e, t) {
  var n, i, r, a, o, s, l, u, d;
  (n = e.querySelector("[data-action='save']")) == null || n.addEventListener("click", () => t.save()), (i = e.querySelector("[data-action='play-preview']")) == null || i.addEventListener("click", () => t.play()), (r = e.querySelector("[data-action='reset-tracking']")) == null || r.addEventListener("click", () => t.resetTracking()), (a = e.querySelector("[data-action='export-json']")) == null || a.addEventListener("click", () => t.exportJSON()), (o = e.querySelector("[data-action='undo']")) == null || o.addEventListener("click", () => t.undo()), (s = e.querySelector("[data-action='redo']")) == null || s.addEventListener("click", () => t.redo()), (l = e.querySelector("[data-action='validate']")) == null || l.addEventListener("click", () => t.validate()), (u = e.querySelector("[data-action='import-json']")) == null || u.addEventListener("click", () => t.importJSON()), (d = e.querySelector("[data-action='open-tracking']")) == null || d.addEventListener("click", () => {
    new Al({ scene: t.scene }).render(!0);
  });
}
c(By, "bindToolbarEvents");
function Uy(e, t) {
  var n, i, r, a;
  (n = e.querySelector("[data-action='change-cinematic']")) == null || n.addEventListener("change", (o) => {
    t.flushTweenChanges(), t.switchCinematic(o.target.value);
  }), (i = e.querySelector("[data-action='add-cinematic']")) == null || i.addEventListener("click", () => {
    new Dialog({
      title: "New Cinematic",
      content: '<label style="display:flex;align-items:center;gap:0.5rem"><span>Name:</span><input id="cinematic-new-name" type="text" style="flex:1" placeholder="intro" /></label>',
      buttons: {
        ok: {
          label: "Create",
          callback: /* @__PURE__ */ c((o) => {
            var l, u, d, m, h, y, p;
            const s = (l = o.find("#cinematic-new-name").val()) == null ? void 0 : l.trim();
            if (!s) {
              (d = (u = ui.notifications) == null ? void 0 : u.warn) == null || d.call(u, "Name cannot be empty.");
              return;
            }
            if (/[.\s]/.test(s)) {
              (h = (m = ui.notifications) == null ? void 0 : m.warn) == null || h.call(m, "Name cannot contain dots or spaces.");
              return;
            }
            if (t.state.listCinematicNames().includes(s)) {
              (p = (y = ui.notifications) == null ? void 0 : y.warn) == null || p.call(y, "Name already exists.");
              return;
            }
            t.mutate((g) => g.addCinematic(s));
          }, "callback")
        },
        cancel: { label: "Cancel" }
      },
      default: "ok"
    }).render(!0);
  }), (r = e.querySelector("[data-action='remove-cinematic']")) == null || r.addEventListener("click", () => {
    var l, u;
    if (t.state.listCinematicNames().length <= 1) {
      (u = (l = ui.notifications) == null ? void 0 : l.warn) == null || u.call(l, "Cannot remove the last cinematic.");
      return;
    }
    const s = t.state.activeCinematicName;
    new Dialog({
      title: "Remove Cinematic",
      content: `<p>Remove cinematic "${s}"? This cannot be undone after saving.</p>`,
      buttons: {
        ok: {
          label: "Remove",
          callback: /* @__PURE__ */ c(() => {
            t.setSelectedPath(null), t.mutate((d) => d.removeCinematic(s));
          }, "callback")
        },
        cancel: { label: "Cancel" }
      },
      default: "cancel"
    }).render(!0);
  }), (a = e.querySelector("[data-action='rename-cinematic']")) == null || a.addEventListener("click", () => {
    const o = t.state.activeCinematicName;
    new Dialog({
      title: "Rename Cinematic",
      content: `<label style="display:flex;align-items:center;gap:0.5rem"><span>Name:</span><input id="cinematic-rename" type="text" style="flex:1" value="${Ot(o)}" /></label>`,
      buttons: {
        ok: {
          label: "Rename",
          callback: /* @__PURE__ */ c((s) => {
            var u, d, m, h, y, p, g;
            const l = (u = s.find("#cinematic-rename").val()) == null ? void 0 : u.trim();
            if (!l) {
              (m = (d = ui.notifications) == null ? void 0 : d.warn) == null || m.call(d, "Name cannot be empty.");
              return;
            }
            if (/[.\s]/.test(l)) {
              (y = (h = ui.notifications) == null ? void 0 : h.warn) == null || y.call(h, "Name cannot contain dots or spaces.");
              return;
            }
            if (l !== o) {
              if (t.state.listCinematicNames().includes(l)) {
                (g = (p = ui.notifications) == null ? void 0 : p.warn) == null || g.call(p, "Name already exists.");
                return;
              }
              t.mutate((v) => v.renameCinematic(o, l));
            }
          }, "callback")
        },
        cancel: { label: "Cancel" }
      },
      default: "ok"
    }).render(!0);
  });
}
c(Uy, "bindCinematicSelectorEvents");
function Vy(e, t) {
  e.querySelectorAll("[data-action='select-block']").forEach((i) => {
    i.addEventListener("click", (r) => {
      if (r.target.closest("button")) return;
      const a = i.dataset.entryPath;
      t.setSelectedPath(t.selectedPath === a ? null : a);
    });
  });
  let n = null;
  e.querySelectorAll(".cinematic-editor__lane--main [data-action='select-block']").forEach((i) => {
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
        const s = gu(n), l = gu(o);
        s != null && l != null && (t.selectedPath === n && t.setSelectedPath(o), t.mutate((u) => u.moveEntry(s, l)));
      }
      n = null;
    }), i.addEventListener("dragend", () => {
      i.classList.remove("dragging"), n = null;
    }));
  }), e.querySelectorAll("[data-action='show-insert-menu']").forEach((i) => {
    i.addEventListener("click", (r) => {
      r.stopPropagation();
      const a = Number(i.dataset.insertIndex), o = i.dataset.lane;
      t.showInsertMenu(i, a, o);
    });
  }), e.querySelectorAll("[data-action='insert-entry']").forEach((i) => {
    i.addEventListener("click", () => {
      if (!t.insertMenuState) return;
      const r = i.dataset.insertType, { insertIndex: a } = t.insertMenuState;
      switch (r) {
        case "step":
          t.mutate((o) => o.addStep(a));
          break;
        case "delay":
          t.mutate((o) => o.addDelay(a));
          break;
        case "emit":
          t.mutate((o) => o.addEmit(a));
          break;
        case "parallel":
          t.mutate((o) => o.addParallel(a));
          break;
        case "sound":
          t.mutate((o) => o.addSound(a));
          break;
        case "stopSound":
          t.mutate((o) => o.addStopSound(a));
          break;
      }
      t.hideInsertMenu();
    });
  }), document.addEventListener("click", (i) => {
    t.insertMenuState && !i.target.closest(".cinematic-editor__insert-menu") && !i.target.closest("[data-action='show-insert-menu']") && t.hideInsertMenu();
  });
}
c(Vy, "bindSwimlaneEvents");
function zy(e, t) {
  var n, i, r, a, o, s, l, u, d, m, h;
  (n = e.querySelector("[data-action='delete-entry']")) == null || n.addEventListener("click", () => {
    const y = t.parseEntryPath(t.selectedPath);
    y && (y.type === "timeline" ? (t.mutate((p) => p.removeEntry(y.index)), t.setSelectedPath(null)) : y.type === "branch" && (t.mutate((p) => p.removeBranchEntry(y.index, y.branchIndex, y.branchEntryIndex)), t.setSelectedPath(null)));
  }), (i = e.querySelector("[data-action='step-duration']")) == null || i.addEventListener("input", (y) => {
    const p = t.parseEntryPath(t.selectedPath);
    if (!p) return;
    const g = Number(y.target.value) || 0;
    p.type === "timeline" ? t.mutate((v) => v.updateStepDuration(p.index, g)) : p.type === "branch" && t.mutate((v) => v.updateBranchEntry(p.index, p.branchIndex, p.branchEntryIndex, { duration: Math.max(0, g) }));
  }), (r = e.querySelector("[data-action='add-tween']")) == null || r.addEventListener("click", () => {
    const y = t.parseEntryPath(t.selectedPath);
    if (y) {
      if (y.type === "timeline")
        t.mutate((p) => p.addTween(y.index));
      else if (y.type === "branch") {
        const p = t.getEntryAtPath(t.selectedPath);
        if (!p) return;
        const g = { type: "tile-prop", target: "", attribute: "alpha", value: 1 }, v = [...p.tweens ?? [], g];
        t.mutate((b) => b.updateBranchEntry(y.index, y.branchIndex, y.branchEntryIndex, { tweens: v }));
      }
    }
  }), (a = e.querySelector("[data-action='change-delay']")) == null || a.addEventListener("change", (y) => {
    const p = t.parseEntryPath(t.selectedPath);
    if (!p) return;
    const g = Number(y.target.value) || 0;
    p.type === "timeline" ? t.mutate((v) => v.updateEntry(p.index, { delay: g })) : p.type === "branch" && t.mutate((v) => v.updateBranchEntry(p.index, p.branchIndex, p.branchEntryIndex, { delay: g }));
  }), (o = e.querySelector("[data-action='edit-setup']")) == null || o.addEventListener("click", () => {
    Ja("setup", { state: t.state, mutate: t.mutate });
  }), (s = e.querySelector("[data-action='edit-landing']")) == null || s.addEventListener("click", () => {
    Ja("landing", { state: t.state, mutate: t.mutate });
  }), (l = e.querySelector("[data-action='edit-before']")) == null || l.addEventListener("click", () => {
    pu("before", { selectedPath: t.selectedPath, state: t.state, mutate: t.mutate });
  }), (u = e.querySelector("[data-action='edit-after']")) == null || u.addEventListener("click", () => {
    pu("after", { selectedPath: t.selectedPath, state: t.state, mutate: t.mutate });
  }), (d = e.querySelector("[data-action='change-trigger']")) == null || d.addEventListener("change", (y) => {
    t.mutate((p) => p.setTrigger(y.target.value));
  }), (m = e.querySelector("[data-action='change-tracking']")) == null || m.addEventListener("change", (y) => {
    t.mutate((p) => p.setTracking(y.target.checked));
  }), (h = e.querySelector("[data-action='change-synchronized']")) == null || h.addEventListener("change", (y) => {
    t.mutate((p) => p.setSynchronized(y.target.checked));
  });
}
c(zy, "bindDetailPanelEvents");
const Vi = /* @__PURE__ */ new WeakMap(), Ya = /* @__PURE__ */ new Set(), Xa = /* @__PURE__ */ new Set(), yu = {
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
function Qa(e, t = {}) {
  var p, g, v;
  if (!e) return !1;
  zi(e);
  const n = t.mode ?? (t.color != null ? "custom" : "hover"), i = yu[n] ?? yu.hover, r = t.color ?? i.borderColor, a = t.alpha ?? i.borderAlpha, o = t.color ?? i.spriteTint, s = i.spriteAlpha, l = t.pulse ?? i.pulse, u = { border: null, sprite: null, pulseData: null, mode: n }, d = ((p = e.document) == null ? void 0 : p.width) ?? e.w ?? 100, m = ((g = e.document) == null ? void 0 : g.height) ?? e.h ?? 100, h = new PIXI.Graphics();
  h.lineStyle(i.borderWidth, r, a), h.drawRect(0, 0, d, m), e.addChild(h), u.border = h;
  const y = Gy(e, o, s);
  if (y && (canvas.controls.debug.addChild(y), Xa.add(y), u.sprite = y), l && ((v = canvas.app) != null && v.ticker)) {
    const b = {
      elapsed: 0,
      fn: /* @__PURE__ */ c((w) => {
        b.elapsed += w;
        const S = (Math.sin(b.elapsed * 0.05) + 1) / 2;
        u.border && (u.border.alpha = a * (0.4 + 0.6 * S)), u.sprite && (u.sprite.alpha = s * (0.5 + 0.5 * S));
      }, "fn")
    };
    canvas.app.ticker.add(b.fn), u.pulseData = b, Ya.add(b);
  }
  return Vi.set(e, u), !0;
}
c(Qa, "addHighlight");
function zi(e) {
  var n, i;
  if (!e) return;
  const t = Vi.get(e);
  t && (t.pulseData && ((i = (n = canvas.app) == null ? void 0 : n.ticker) == null || i.remove(t.pulseData.fn), Ya.delete(t.pulseData)), t.border && (t.border.parent && t.border.parent.removeChild(t.border), t.border.destroy({ children: !0 })), t.sprite && (t.sprite.parent && t.sprite.parent.removeChild(t.sprite), t.sprite.destroy({ children: !0 }), Xa.delete(t.sprite)), Vi.delete(e));
}
c(zi, "removeHighlight");
function Nf(e) {
  return Vi.has(e);
}
c(Nf, "hasHighlight");
function Oa() {
  var t, n, i, r, a, o, s;
  for (const l of Ya)
    (n = (t = canvas.app) == null ? void 0 : t.ticker) == null || n.remove(l.fn);
  Ya.clear();
  for (const l of Xa)
    l.parent && l.parent.removeChild(l), l.destroy({ children: !0 });
  Xa.clear();
  const e = [
    (i = canvas.tiles) == null ? void 0 : i.placeables,
    (r = canvas.tokens) == null ? void 0 : r.placeables,
    (a = canvas.lighting) == null ? void 0 : a.placeables,
    (o = canvas.drawings) == null ? void 0 : o.placeables,
    (s = canvas.sounds) == null ? void 0 : s.placeables
  ];
  for (const l of e)
    if (l)
      for (const u of l) {
        const d = Vi.get(u);
        d && (d.border && (d.border.parent && d.border.parent.removeChild(d.border), d.border.destroy({ children: !0 })), Vi.delete(u));
      }
}
c(Oa, "clearAllHighlights");
function Gy(e, t, n) {
  var a;
  const i = e.mesh;
  if (!((a = i == null ? void 0 : i.texture) != null && a.baseTexture)) return null;
  const r = PIXI.Sprite.from(i.texture);
  return r.isSprite = !0, r.anchor.set(i.anchor.x, i.anchor.y), r.width = i.width, r.height = i.height, r.scale = i.scale, r.position = e.center, r.angle = i.angle, r.alpha = n, r.tint = t, r.name = "eidolonPickerHighlight", r;
}
c(Gy, "createTintSprite");
let Un = null;
function _f(e) {
  var p, g, v;
  Un && Un.cancel();
  const { placeableType: t = "Tile", onPick: n, onCancel: i } = e;
  let r = null;
  const a = `control${t}`, o = `hover${t}`, s = /* @__PURE__ */ c((b, w) => {
    var I;
    if (!w) return;
    const S = b.document ?? b;
    (I = b.release) == null || I.call(b), n(S);
  }, "onControl"), l = /* @__PURE__ */ c((b, w) => {
    w ? (r = b, Qa(b, { mode: "pick" })) : r === b && (zi(b), r = null);
  }, "onHoverIn"), u = /* @__PURE__ */ c((b) => {
    b.key === "Escape" && (b.preventDefault(), b.stopPropagation(), y());
  }, "onKeydown"), d = /* @__PURE__ */ c((b) => {
    b.preventDefault(), y();
  }, "onContextMenu"), m = Hooks.on(a, s), h = Hooks.on(o, l);
  document.addEventListener("keydown", u, { capture: !0 }), (p = canvas.stage) == null || p.addEventListener("rightclick", d), (v = (g = ui.notifications) == null ? void 0 : g.info) == null || v.call(g, `Pick mode active — click a ${t.toLowerCase()} on the canvas, or press ESC to cancel.`, { permanent: !1 });
  function y() {
    var b;
    Un && (Un = null, Hooks.off(a, m), Hooks.off(o, h), document.removeEventListener("keydown", u, { capture: !0 }), (b = canvas.stage) == null || b.removeEventListener("rightclick", d), r && (zi(r), r = null), i == null || i());
  }
  return c(y, "cancel"), Un = { cancel: y }, { cancel: y };
}
c(_f, "enterPickMode");
function sr() {
  Un && Un.cancel();
}
c(sr, "cancelPickMode");
const Wy = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  cancelPickMode: sr,
  enterPickMode: _f
}, Symbol.toStringTag, { value: "Module" }));
var Ru, Ie, He, qr, bn, jr, Br, Je, vn, de, $f, kl, Df, Ff, xf, Ml, Nl, Pf, Rf;
const at = class at extends Fn(Dn) {
  /**
   * @param {object} options
   * @param {string[]} [options.selections]  Initial selections
   * @param {string} [options.placeableType]  "Tile", "Token", etc.
   * @param {(selectors: string[]) => void} [options.onApply]
   * @param {() => void} [options.onCancel]
   */
  constructor(n = {}) {
    super(n);
    A(this, de);
    /** @type {string[]} Current selections (selector strings). */
    A(this, Ie, []);
    /** @type {boolean} Whether pick mode is active. */
    A(this, He, !1);
    /** @type {string} Placeable type (Tile, Token, etc.). */
    A(this, qr, "Tile");
    /** @type {string} Current tag match mode. */
    A(this, bn, "any");
    /** @type {((selectors: string[]) => void) | null} */
    A(this, jr, null);
    /** @type {(() => void) | null} */
    A(this, Br, null);
    /** @type {Promise resolve function for the open() API. */
    A(this, Je, null);
    /** @type {PlaceableObject | null} Currently hovered tile in the browser. */
    A(this, vn, null);
    L(this, Ie, [...n.selections ?? []]), L(this, qr, n.placeableType ?? "Tile"), L(this, jr, n.onApply ?? null), L(this, Br, n.onCancel ?? null);
  }
  // ── Context ───────────────────────────────────────────────────────────
  async _prepareContext() {
    var r;
    const n = C(this, de, Ml).call(this), i = (((r = canvas.tiles) == null ? void 0 : r.placeables) ?? []).map((a, o) => {
      var d, m;
      const s = a.document, l = s.id, u = (d = s.texture) != null && d.src ? s.texture.src.split("/").pop().replace(/\.[^.]+$/, "") : `Tile ${o + 1}`;
      return {
        id: l,
        name: u.length > 20 ? u.slice(0, 18) + "..." : u,
        thumbnailSrc: ((m = s.texture) == null ? void 0 : m.src) ?? null,
        selected: n.has(l)
      };
    });
    return {
      selections: f(this, Ie),
      selectionCount: f(this, Ie).length,
      pickModeActive: f(this, He),
      tagModeIsAny: f(this, bn) === "any",
      tagModeIsAll: f(this, bn) === "all",
      tagPreviewCount: 0,
      tiles: i,
      tileCount: i.length
    };
  }
  // ── Render & Events ───────────────────────────────────────────────────
  _onRender(n, i) {
    super._onRender(n, i), C(this, de, $f).call(this), C(this, de, Nl).call(this);
  }
  async _onClose(n) {
    return f(this, He) && (sr(), L(this, He, !1)), Oa(), f(this, Je) && (f(this, Je).call(this, null), L(this, Je, null)), super._onClose(n);
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
      const r = new at({
        ...n,
        onApply: /* @__PURE__ */ c((a) => i(a), "onApply"),
        onCancel: /* @__PURE__ */ c(() => i(null), "onCancel")
      });
      L(r, Je, i), r.render(!0);
    });
  }
};
Ie = new WeakMap(), He = new WeakMap(), qr = new WeakMap(), bn = new WeakMap(), jr = new WeakMap(), Br = new WeakMap(), Je = new WeakMap(), vn = new WeakMap(), de = new WeakSet(), $f = /* @__PURE__ */ c(function() {
  var a, o, s, l;
  const n = this.element;
  if (!(n instanceof HTMLElement)) return;
  const i = n.querySelector("[data-role='tag-input']"), r = n.querySelector("[data-role='tag-mode']");
  r == null || r.addEventListener("change", (u) => {
    L(this, bn, u.target.value);
  }), i == null || i.addEventListener("input", () => {
    C(this, de, Df).call(this, n);
  }), i == null || i.addEventListener("keydown", (u) => {
    u.key === "Enter" && (u.preventDefault(), C(this, de, kl).call(this, n));
  }), (a = n.querySelector("[data-action='add-tag-selector']")) == null || a.addEventListener("click", () => {
    C(this, de, kl).call(this, n);
  }), (o = n.querySelector("[data-action='toggle-pick-mode']")) == null || o.addEventListener("click", () => {
    f(this, He) ? (sr(), L(this, He, !1)) : (L(this, He, !0), _f({
      placeableType: f(this, qr),
      onPick: /* @__PURE__ */ c((u) => {
        C(this, de, Ff).call(this, u.id);
      }, "onPick"),
      onCancel: /* @__PURE__ */ c(() => {
        L(this, He, !1), this.render({ force: !0 });
      }, "onCancel")
    })), this.render({ force: !0 });
  }), n.querySelectorAll("[data-action='toggle-tile']").forEach((u) => {
    u.addEventListener("click", () => {
      const d = u.dataset.docId;
      d && C(this, de, xf).call(this, d);
    }), u.addEventListener("mouseenter", () => {
      var h, y;
      const d = u.dataset.docId;
      if (!d) return;
      const m = (y = (h = canvas.tiles) == null ? void 0 : h.placeables) == null ? void 0 : y.find((p) => p.document.id === d);
      m && (L(this, vn, m), Qa(m, { mode: "hover" }));
    }), u.addEventListener("mouseleave", () => {
      f(this, vn) && (zi(f(this, vn)), L(this, vn, null), C(this, de, Nl).call(this));
    });
  }), n.querySelectorAll("[data-action='remove-selection']").forEach((u) => {
    u.addEventListener("click", () => {
      const d = Number(u.dataset.selectionIndex);
      Number.isNaN(d) || (f(this, Ie).splice(d, 1), this.render({ force: !0 }));
    });
  }), (s = n.querySelector("[data-action='apply']")) == null || s.addEventListener("click", () => {
    C(this, de, Pf).call(this);
  }), (l = n.querySelector("[data-action='cancel']")) == null || l.addEventListener("click", () => {
    C(this, de, Rf).call(this);
  });
}, "#bindEvents"), // ── Tag helpers ───────────────────────────────────────────────────────
kl = /* @__PURE__ */ c(function(n) {
  var s;
  const i = n.querySelector("[data-role='tag-input']"), r = (s = i == null ? void 0 : i.value) == null ? void 0 : s.trim();
  if (!r) return;
  const a = r.split(",").map((l) => l.trim()).filter(Boolean);
  if (a.length === 0) return;
  const o = wf(a, f(this, bn));
  o && !f(this, Ie).includes(o) && f(this, Ie).push(o), i && (i.value = ""), this.render({ force: !0 });
}, "#addTagSelector"), Df = /* @__PURE__ */ c(function(n) {
  var m, h;
  const i = n.querySelector("[data-role='tag-input']"), r = n.querySelector("[data-role='tag-preview']");
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
  const s = window.Tagger ?? ((m = game.modules.get("tagger")) == null ? void 0 : m.api);
  if (!s) {
    r.textContent = "Tagger not available";
    return;
  }
  const l = f(this, bn) === "any", u = s.getByTag(o, {
    sceneId: (h = canvas.scene) == null ? void 0 : h.id,
    matchAny: l
  }), d = (u == null ? void 0 : u.length) ?? 0;
  r.textContent = `${d} matching placeable(s)`;
}, "#updateTagPreview"), // ── ID selector helpers ──────────────────────────────────────────────
Ff = /* @__PURE__ */ c(function(n) {
  const i = `id:${n}`;
  f(this, Ie).includes(i) || (f(this, Ie).push(i), this.render({ force: !0 }));
}, "#addIdSelector"), xf = /* @__PURE__ */ c(function(n) {
  const i = `id:${n}`, r = f(this, Ie).indexOf(i);
  r >= 0 ? f(this, Ie).splice(r, 1) : f(this, Ie).push(i), this.render({ force: !0 });
}, "#toggleIdSelector"), /**
 * Get the set of document IDs that are currently selected across all selector types.
 * Resolves tag/tags-any/tags-all selectors to find matching document IDs.
 * @returns {Set<string>}
 */
Ml = /* @__PURE__ */ c(function() {
  const n = /* @__PURE__ */ new Set();
  for (const i of f(this, Ie)) {
    const r = dc(i);
    if (r.type === "id") {
      n.add(r.value);
      continue;
    }
    const a = Wo(i);
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
Nl = /* @__PURE__ */ c(function() {
  var r, a;
  const n = C(this, de, Ml).call(this), i = ((r = canvas.tiles) == null ? void 0 : r.placeables) ?? [];
  for (const o of i) {
    const s = (a = o.document) == null ? void 0 : a.id;
    if (!s) continue;
    const l = n.has(s), u = o === f(this, vn), d = Nf(o);
    l && !u && !d ? Qa(o, { mode: "selected" }) : !l && d && !u && zi(o);
  }
}, "#refreshSelectionHighlights"), // ── Apply / Cancel ──────────────────────────────────────────────────
Pf = /* @__PURE__ */ c(function() {
  var i;
  f(this, He) && (sr(), L(this, He, !1)), Oa();
  const n = [...f(this, Ie)];
  (i = f(this, jr)) == null || i.call(this, n), f(this, Je) && (f(this, Je).call(this, n), L(this, Je, null)), this.close({ force: !0 });
}, "#doApply"), Rf = /* @__PURE__ */ c(function() {
  var n;
  f(this, He) && (sr(), L(this, He, !1)), Oa(), (n = f(this, Br)) == null || n.call(this), f(this, Je) && (f(this, Je).call(this, null), L(this, Je, null)), this.close({ force: !0 });
}, "#doCancel"), c(at, "PlaceablePickerApplication"), pe(at, "APP_ID", `${T}-placeable-picker`), pe(at, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  $e(at, at, "DEFAULT_OPTIONS"),
  {
    id: at.APP_ID,
    classes: Array.from(
      /* @__PURE__ */ new Set([...((Ru = $e(at, at, "DEFAULT_OPTIONS")) == null ? void 0 : Ru.classes) ?? [], "eidolon-placeable-picker-window", "themed"])
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
let Za = at;
function Ky(e, t) {
  e.querySelectorAll("[data-action='toggle-tween-card']").forEach((n) => {
    n.addEventListener("click", (i) => {
      if (i.target.closest("[data-action='delete-tween']")) return;
      const r = Number(n.dataset.tweenIndex), a = `${t.selectedPath}.tweens.${r}`;
      t.expandedTweens.has(a) ? t.expandedTweens.delete(a) : t.expandedTweens.add(a), t.render();
    });
  }), e.querySelectorAll("[data-action='pick-target']").forEach((n) => {
    n.addEventListener("click", async () => {
      var u, d;
      const i = Number(n.dataset.tweenIndex), r = t.parseEntryPath(t.selectedPath);
      if (!r || Number.isNaN(i)) return;
      const a = t.getEntryAtPath(t.selectedPath), o = ((d = (u = a == null ? void 0 : a.tweens) == null ? void 0 : u[i]) == null ? void 0 : d.target) ?? "", s = o ? [o] : [], l = await Za.open({ selections: s });
      if (l && l.length > 0) {
        if (r.type === "timeline")
          t.mutate((m) => m.updateTween(r.index, i, { target: l[0] }));
        else if (r.type === "branch") {
          const m = (a.tweens ?? []).map((h, y) => y === i ? { ...h, target: l[0] } : h);
          t.mutate((h) => h.updateBranchEntry(r.index, r.branchIndex, r.branchEntryIndex, { tweens: m }));
        }
      }
    });
  }), e.querySelectorAll("[data-action='delete-tween']").forEach((n) => {
    n.addEventListener("click", () => {
      const i = Number(n.dataset.tweenIndex), r = t.parseEntryPath(t.selectedPath);
      if (!(!r || Number.isNaN(i))) {
        if (r.type === "timeline")
          t.mutate((a) => a.removeTween(r.index, i));
        else if (r.type === "branch") {
          const a = t.getEntryAtPath(t.selectedPath);
          if (!a) return;
          const o = (a.tweens ?? []).filter((s, l) => l !== i);
          t.mutate((s) => s.updateBranchEntry(r.index, r.branchIndex, r.branchEntryIndex, { tweens: o }));
        }
      }
    });
  }), e.querySelectorAll(".cinematic-editor__tween-card-body").forEach((n) => {
    const i = Number(n.dataset.tweenIndex);
    n.querySelectorAll("[data-field]").forEach((r) => {
      const a = r.dataset.field, o = r.tagName === "SELECT" || r.type === "checkbox" ? "change" : "input";
      r.addEventListener(o, () => {
        let s;
        if (r.type === "checkbox" ? s = r.checked : a === "x" || a === "y" || a === "scale" || a === "toAlpha" ? s = r.value.trim() === "" ? "" : Number(r.value) || 0 : a === "value" && !Number.isNaN(Number(r.value)) && r.value.trim() !== "" ? s = Number(r.value) : s = r.value, a === "type") {
          const l = If[s], u = { type: s };
          if (l) {
            const d = l.form ?? "prop";
            d === "prop" || d === "particles" ? Object.assign(u, { attribute: l.attribute, value: l.value }) : d === "camera" ? Object.assign(u, { x: l.x, y: l.y, scale: l.scale }) : d === "lightColor" ? Object.assign(u, { toColor: l.toColor, toAlpha: l.toAlpha, mode: l.mode }) : d === "lightState" && Object.assign(u, { enabled: l.enabled });
          }
          t.queueTweenChange(i, u), t.flushTweenChangesImmediate(), t.render();
        } else
          t.queueTweenChange(i, { [a]: s });
      });
    });
  });
}
c(Ky, "bindTweenFieldEvents");
function Jy(e, t) {
  var i, r, a, o, s, l, u, d, m, h;
  function n(y, p, g) {
    y.type === "timeline" ? t.mutate((v) => v.updateEntry(y.index, { sound: g })) : y.type === "branch" && t.mutate((v) => v.updateBranchEntry(y.index, y.branchIndex, y.branchEntryIndex, { sound: g }));
  }
  c(n, "applySoundPatch"), (i = e.querySelector("[data-action='change-sound-src']")) == null || i.addEventListener("change", async (y) => {
    const p = t.parseEntryPath(t.selectedPath);
    if (!p) return;
    const g = t.getEntryAtPath(t.selectedPath);
    if (!(g != null && g.sound)) return;
    const v = y.target.value, b = { ...g.sound, src: v };
    b.id || (b.id = cu(v));
    const w = await uu(v);
    w > 0 && (b.duration = w), n(p, g, b);
  }), (r = e.querySelector("[data-action='pick-sound-src']")) == null || r.addEventListener("click", () => {
    const y = t.parseEntryPath(t.selectedPath);
    if (!y) return;
    const p = t.getEntryAtPath(t.selectedPath);
    if (!(p != null && p.sound)) return;
    new FilePicker({
      type: "audio",
      current: p.sound.src || "",
      callback: /* @__PURE__ */ c(async (v) => {
        const b = { ...p.sound, src: v };
        b.id || (b.id = cu(v));
        const w = await uu(v);
        w > 0 && (b.duration = w), n(y, p, b);
      }, "callback")
    }).render(!0);
  }), (a = e.querySelector("[data-action='change-sound-id']")) == null || a.addEventListener("change", (y) => {
    const p = t.parseEntryPath(t.selectedPath);
    if (!p) return;
    const g = t.getEntryAtPath(t.selectedPath);
    g != null && g.sound && n(p, g, { ...g.sound, id: y.target.value || void 0 });
  }), (o = e.querySelector("[data-action='change-sound-volume']")) == null || o.addEventListener("input", (y) => {
    const p = t.parseEntryPath(t.selectedPath);
    if (!p) return;
    const g = t.getEntryAtPath(t.selectedPath);
    g != null && g.sound && n(p, g, { ...g.sound, volume: Number(y.target.value) || 0.8 });
  }), (s = e.querySelector("[data-action='change-sound-loop']")) == null || s.addEventListener("change", (y) => {
    const p = t.parseEntryPath(t.selectedPath);
    if (!p) return;
    const g = t.getEntryAtPath(t.selectedPath);
    g != null && g.sound && n(p, g, { ...g.sound, loop: y.target.checked });
  }), (l = e.querySelector("[data-action='change-sound-fadein']")) == null || l.addEventListener("change", (y) => {
    const p = t.parseEntryPath(t.selectedPath);
    if (!p) return;
    const g = t.getEntryAtPath(t.selectedPath);
    g != null && g.sound && n(p, g, { ...g.sound, fadeIn: Number(y.target.value) || void 0 });
  }), (u = e.querySelector("[data-action='change-sound-fadeout']")) == null || u.addEventListener("change", (y) => {
    const p = t.parseEntryPath(t.selectedPath);
    if (!p) return;
    const g = t.getEntryAtPath(t.selectedPath);
    g != null && g.sound && n(p, g, { ...g.sound, fadeOut: Number(y.target.value) || void 0 });
  }), (d = e.querySelector("[data-action='change-sound-duration']")) == null || d.addEventListener("change", (y) => {
    const p = t.parseEntryPath(t.selectedPath);
    if (!p) return;
    const g = t.getEntryAtPath(t.selectedPath);
    g != null && g.sound && n(p, g, { ...g.sound, duration: Number(y.target.value) || 0 });
  }), (m = e.querySelector("[data-action='change-sound-fireandforget']")) == null || m.addEventListener("change", (y) => {
    const p = t.parseEntryPath(t.selectedPath);
    if (!p) return;
    const g = t.getEntryAtPath(t.selectedPath);
    g != null && g.sound && n(p, g, { ...g.sound, fireAndForget: y.target.checked });
  }), (h = e.querySelector("[data-action='change-stopsound-id']")) == null || h.addEventListener("change", (y) => {
    const p = t.parseEntryPath(t.selectedPath);
    p && (p.type === "timeline" ? t.mutate((g) => g.updateEntry(p.index, { stopSound: y.target.value })) : p.type === "branch" && t.mutate((g) => g.updateBranchEntry(p.index, p.branchIndex, p.branchEntryIndex, { stopSound: y.target.value })));
  });
}
c(Jy, "bindSoundFieldEvents");
function Yy(e, t) {
  var n, i, r, a, o;
  (n = e.querySelector("[data-action='change-emit-signal']")) == null || n.addEventListener("change", (s) => {
    const l = t.parseEntryPath(t.selectedPath);
    l && l.type === "timeline" && t.mutate((u) => u.updateEntry(l.index, { emit: s.target.value }));
  }), (i = e.querySelector("[data-action='change-parallel-join']")) == null || i.addEventListener("change", (s) => {
    const l = t.parseEntryPath(t.selectedPath);
    if (!l || l.type !== "timeline") return;
    const u = t.state.timeline[l.index];
    u != null && u.parallel && t.mutate((d) => d.updateEntry(l.index, { parallel: { ...u.parallel, join: s.target.value } }));
  }), (r = e.querySelector("[data-action='change-parallel-overflow']")) == null || r.addEventListener("change", (s) => {
    const l = t.parseEntryPath(t.selectedPath);
    if (!l || l.type !== "timeline") return;
    const u = t.state.timeline[l.index];
    u != null && u.parallel && t.mutate((d) => d.updateEntry(l.index, { parallel: { ...u.parallel, overflow: s.target.value } }));
  }), (a = e.querySelector("[data-action='edit-parallel-json']")) == null || a.addEventListener("click", () => {
    jy({ selectedPath: t.selectedPath, state: t.state, mutate: t.mutate });
  }), (o = e.querySelector("[data-action='add-branch']")) == null || o.addEventListener("click", () => {
    const s = t.parseEntryPath(t.selectedPath);
    !s || s.type !== "timeline" || t.mutate((l) => l.addBranch(s.index));
  }), e.querySelectorAll("[data-action='remove-branch']").forEach((s) => {
    s.addEventListener("click", () => {
      const l = Number(s.dataset.branchIndex), u = t.parseEntryPath(t.selectedPath);
      !u || u.type !== "timeline" || Number.isNaN(l) || t.mutate((d) => d.removeBranch(u.index, l));
    });
  }), e.querySelectorAll("[data-action='add-branch-step']").forEach((s) => {
    s.addEventListener("click", () => {
      const l = Number(s.dataset.branchIndex), u = t.parseEntryPath(t.selectedPath);
      !u || u.type !== "timeline" || Number.isNaN(l) || t.mutate((d) => d.addBranchEntry(u.index, l, { tweens: [] }));
    });
  }), e.querySelectorAll("[data-action='add-branch-delay']").forEach((s) => {
    s.addEventListener("click", () => {
      const l = Number(s.dataset.branchIndex), u = t.parseEntryPath(t.selectedPath);
      !u || u.type !== "timeline" || Number.isNaN(l) || t.mutate((d) => d.addBranchEntry(u.index, l, { delay: 1e3 }));
    });
  }), e.querySelectorAll("[data-action='add-branch-sound']").forEach((s) => {
    s.addEventListener("click", () => {
      const l = Number(s.dataset.branchIndex), u = t.parseEntryPath(t.selectedPath);
      !u || u.type !== "timeline" || Number.isNaN(l) || t.mutate((d) => d.addBranchEntry(u.index, l, { sound: { src: "", volume: 0.8, loop: !1, duration: 0, fireAndForget: !1 } }));
    });
  }), e.querySelectorAll("[data-action='add-branch-stopSound']").forEach((s) => {
    s.addEventListener("click", () => {
      const l = Number(s.dataset.branchIndex), u = t.parseEntryPath(t.selectedPath);
      !u || u.type !== "timeline" || Number.isNaN(l) || t.mutate((d) => d.addBranchEntry(u.index, l, { stopSound: "" }));
    });
  }), e.querySelectorAll("[data-action='remove-branch-entry']").forEach((s) => {
    s.addEventListener("click", () => {
      const l = Number(s.dataset.branchIndex), u = Number(s.dataset.branchEntryIndex), d = t.parseEntryPath(t.selectedPath);
      !d || d.type !== "timeline" || Number.isNaN(l) || Number.isNaN(u) || t.mutate((m) => m.removeBranchEntry(d.index, l, u));
    });
  });
}
c(Yy, "bindSpecialEntryEvents");
function Xy(e, t) {
  var n;
  e.querySelectorAll("[data-action='select-segment']").forEach((i) => {
    i.addEventListener("click", () => {
      const r = i.dataset.segmentName;
      r && t.selectSegment(r);
    });
  }), (n = e.querySelector("[data-action='add-segment']")) == null || n.addEventListener("click", async () => {
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
    i && t.addSegment(i);
  }), e.querySelectorAll("[data-action='remove-segment']").forEach((i) => {
    i.addEventListener("click", () => {
      const r = i.dataset.segmentName;
      r && t.removeSegment(r);
    });
  }), e.querySelectorAll("[data-action='rename-segment']").forEach((i) => {
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
      a && a !== r && t.renameSegment(r, a);
    });
  });
}
c(Xy, "bindSegmentGraphEvents");
function Qy(e, t) {
  var n, i, r, a, o, s, l;
  (n = e.querySelector("[data-action='change-gate-event']")) == null || n.addEventListener("change", (u) => {
    var m;
    const d = u.target.value;
    if (!d)
      t.setSegmentGate(null);
    else {
      const h = ((m = t.state.activeSegment) == null ? void 0 : m.gate) ?? {};
      t.setSegmentGate({ ...h, event: d });
    }
  }), (i = e.querySelector("[data-action='change-gate-target']")) == null || i.addEventListener("change", (u) => {
    var m;
    const d = (m = t.state.activeSegment) == null ? void 0 : m.gate;
    d && t.setSegmentGate({ ...d, target: u.target.value || void 0 });
  }), (r = e.querySelector("[data-action='pick-gate-target']")) == null || r.addEventListener("click", async () => {
    var m;
    const u = (m = t.state.activeSegment) == null ? void 0 : m.gate;
    if (!u) return;
    const { enterPickMode: d } = await Promise.resolve().then(() => Wy);
    d({
      placeableType: "Tile",
      onPick: /* @__PURE__ */ c((h) => {
        var g, v;
        const y = (v = (g = h.flags) == null ? void 0 : g.tagger) == null ? void 0 : v.tags, p = y != null && y.length ? `tag:${y[0]}` : `id:${h.id}`;
        t.setSegmentGate({ ...u, target: p });
      }, "onPick")
    });
  });
  for (const [u, d] of [["change-gate-anim-idle", "idle"], ["change-gate-anim-hover", "hover"], ["change-gate-anim-dim", "dim"]])
    (a = e.querySelector(`[data-action='${u}']`)) == null || a.addEventListener("change", (m) => {
      var b;
      const h = (b = t.state.activeSegment) == null ? void 0 : b.gate;
      if (!h) return;
      const y = m.target.value.trim(), p = y ? y.split(",").map((w) => w.trim()).filter(Boolean) : void 0, g = { ...h.animation ?? {} };
      p != null && p.length ? g[d] = p.length === 1 ? p[0] : p : delete g[d];
      const v = { ...h, animation: Object.keys(g).length ? g : void 0 };
      v.animation || delete v.animation, t.setSegmentGate(v);
    });
  (o = e.querySelector("[data-action='change-segment-next']")) == null || o.addEventListener("change", (u) => {
    const d = u.target.value;
    t.setSegmentNext(d || null);
  }), (s = e.querySelector("[data-action='edit-segment-setup']")) == null || s.addEventListener("click", () => {
    Ja("setup", { state: t.state, mutate: t.mutate });
  }), (l = e.querySelector("[data-action='edit-segment-landing']")) == null || l.addEventListener("click", () => {
    Ja("landing", { state: t.state, mutate: t.mutate });
  });
}
c(Qy, "bindSegmentDetailEvents");
var Hu, qe, G, Ye, wn, St, Xe, je, Mo, Me, Qe, No, en, Hi, lt, ii, En, ri, j, Hf, qf, jf, Bf, cn, $l, Dl, Fl, xl, Uf, un, Pl, Vf, zf, Gf, Wf, Kf, Rl, lr;
const bt = class bt extends Fn(Dn) {
  constructor(n = {}) {
    super(n);
    A(this, j);
    A(this, qe, null);
    A(this, G, null);
    A(this, Ye, null);
    A(this, wn, /* @__PURE__ */ new Set());
    A(this, St, !1);
    A(this, Xe, null);
    A(this, je, null);
    A(this, Mo, 120);
    A(this, Me, []);
    A(this, Qe, -1);
    A(this, No, 50);
    A(this, en, null);
    A(this, Hi, null);
    A(this, lt, null);
    A(this, ii, null);
    A(this, En, null);
    A(this, ri, null);
    L(this, qe, n.scene ?? canvas.scene ?? null), L(this, G, Ht.fromScene(f(this, qe)));
  }
  // ── Context ───────────────────────────────────────────────────────────
  async _prepareContext() {
    var y, p;
    const n = Ay(f(this, G), f(this, G).activeSegmentName), i = Iy(f(this, G).timeline, {
      selectedPath: f(this, Ye),
      windowWidth: ((y = this.position) == null ? void 0 : y.width) ?? 1100
    }), r = f(this, Ye) != null ? Hy(f(this, Ye), { state: f(this, G), expandedTweens: f(this, wn) }) : null, a = f(this, G).listCinematicNames(), o = f(this, G).activeCinematicName, l = f(this, G).listSegmentNames().length > 1, u = f(this, G).activeSegment, d = (u == null ? void 0 : u.gate) ?? null, m = (u == null ? void 0 : u.next) ?? null, h = typeof m == "string" ? m : (m == null ? void 0 : m.segment) ?? null;
    return {
      // Toolbar
      sceneName: ((p = f(this, qe)) == null ? void 0 : p.name) ?? "No scene",
      dirty: f(this, St),
      canUndo: f(this, j, $l),
      canRedo: f(this, j, Dl),
      // Cinematic selector
      cinematicNames: a,
      activeCinematicName: o,
      cinematicOptions: a.map((g) => ({
        value: g,
        label: g,
        selected: g === o
      })),
      hasMultipleCinematics: a.length > 1,
      // Segment graph
      segmentGraph: n,
      activeSegmentName: f(this, G).activeSegmentName,
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
      trigger: f(this, G).trigger,
      tracking: f(this, G).tracking,
      synchronized: f(this, G).synchronized,
      triggerOptions: by.map((g) => ({
        ...g,
        selected: g.value === f(this, G).trigger
      })),
      entryCount: f(this, G).timeline.length,
      totalDuration: i.totalDurationMs,
      targetCount: ky(f(this, G)),
      setupCount: Object.keys(f(this, G).setup ?? {}).length,
      landingCount: Object.keys(f(this, G).landing ?? {}).length
    };
  }
  // ── Render & Events ───────────────────────────────────────────────────
  _onRender(n, i) {
    var r, a, o;
    if (super._onRender(n, i), C(this, j, Hf).call(this), !f(this, ii)) {
      const s = (a = (r = game.modules.get(T)) == null ? void 0 : r.api) == null ? void 0 : a.cinematic;
      s != null && s.onPlaybackProgress ? (L(this, ii, s.onPlaybackProgress((l) => C(this, j, Kf).call(this, l))), console.log("[cinematic-editor] Subscribed to playback progress events")) : console.warn("[cinematic-editor] onPlaybackProgress not available on API", s);
    }
    if (f(this, ri) && ((o = this.element) == null || o.querySelectorAll(".cinematic-editor__segment-node").forEach((s) => {
      s.classList.toggle("cinematic-editor__segment-node--playing", s.dataset.segmentName === f(this, ri));
    }), f(this, lt) && f(this, lt).segmentName === f(this, G).activeSegmentName)) {
      const s = performance.now() - f(this, lt).startTime;
      f(this, lt).durationMs - s > 0 && C(this, j, Rl).call(this, f(this, lt).durationMs, f(this, lt).startTime);
    }
    f(this, en) || (L(this, en, (s) => {
      !s.ctrlKey && !s.metaKey || (s.key === "z" && !s.shiftKey ? (s.preventDefault(), C(this, j, Fl).call(this)) : (s.key === "z" && s.shiftKey || s.key === "y") && (s.preventDefault(), C(this, j, xl).call(this)));
    }), document.addEventListener("keydown", f(this, en)));
  }
  async close(n = {}) {
    if (f(this, je) && C(this, j, un).call(this), f(this, St) && !n.force) {
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
      i === "save" && await C(this, j, Pl).call(this);
    }
    return super.close(n);
  }
  async _onClose(n) {
    var i;
    return f(this, Xe) !== null && (clearTimeout(f(this, Xe)), L(this, Xe, null)), f(this, en) && (document.removeEventListener("keydown", f(this, en)), L(this, en, null)), (i = f(this, ii)) == null || i.call(this), L(this, ii, null), C(this, j, lr).call(this), super._onClose(n);
  }
};
qe = new WeakMap(), G = new WeakMap(), Ye = new WeakMap(), wn = new WeakMap(), St = new WeakMap(), Xe = new WeakMap(), je = new WeakMap(), Mo = new WeakMap(), Me = new WeakMap(), Qe = new WeakMap(), No = new WeakMap(), en = new WeakMap(), Hi = new WeakMap(), lt = new WeakMap(), ii = new WeakMap(), En = new WeakMap(), ri = new WeakMap(), j = new WeakSet(), // ── Event binding ─────────────────────────────────────────────────────
Hf = /* @__PURE__ */ c(function() {
  const n = this.element;
  if (!(n instanceof HTMLElement)) return;
  const i = C(this, j, qf).call(this);
  By(n, i), Uy(n, i), Xy(n, i), Vy(n, i), zy(n, i), Ky(n, i), Jy(n, i), Yy(n, i), Qy(n, i);
}, "#bindEvents"), qf = /* @__PURE__ */ c(function() {
  const n = this;
  return {
    // State access (read-only getters — closures over `self` for private field access)
    get state() {
      return f(n, G);
    },
    get selectedPath() {
      return f(n, Ye);
    },
    get scene() {
      return f(n, qe);
    },
    get expandedTweens() {
      return f(n, wn);
    },
    get insertMenuState() {
      return f(n, Hi);
    },
    // Mutations
    mutate: /* @__PURE__ */ c((i) => C(this, j, cn).call(this, i), "mutate"),
    setSelectedPath: /* @__PURE__ */ c((i) => {
      L(this, Ye, i), this.render({ force: !0 });
    }, "setSelectedPath"),
    render: /* @__PURE__ */ c(() => this.render({ force: !0 }), "render"),
    // Cinematic switching (needs full state swap + clear)
    switchCinematic: /* @__PURE__ */ c((i) => {
      f(this, je) && C(this, j, un).call(this), L(this, G, f(this, G).switchCinematic(i)), L(this, Ye, null), f(this, wn).clear(), this.render({ force: !0 });
    }, "switchCinematic"),
    // Segment management
    selectSegment: /* @__PURE__ */ c((i) => {
      f(this, je) && C(this, j, un).call(this), L(this, G, f(this, G).switchSegment(i)), L(this, Ye, null), f(this, wn).clear(), this.render({ force: !0 });
    }, "selectSegment"),
    addSegment: /* @__PURE__ */ c((i) => {
      C(this, j, cn).call(this, (r) => r.addSegment(i, r.activeSegmentName));
    }, "addSegment"),
    removeSegment: /* @__PURE__ */ c((i) => {
      C(this, j, cn).call(this, (r) => r.removeSegment(i));
    }, "removeSegment"),
    renameSegment: /* @__PURE__ */ c((i, r) => {
      C(this, j, cn).call(this, (a) => a.renameSegment(i, r));
    }, "renameSegment"),
    setSegmentGate: /* @__PURE__ */ c((i) => {
      C(this, j, cn).call(this, (r) => r.setSegmentGate(i));
    }, "setSegmentGate"),
    setSegmentNext: /* @__PURE__ */ c((i) => {
      C(this, j, cn).call(this, (r) => r.setSegmentNext(i));
    }, "setSegmentNext"),
    // Tween debouncing
    queueTweenChange: /* @__PURE__ */ c((i, r) => C(this, j, Uf).call(this, i, r), "queueTweenChange"),
    flushTweenChanges: /* @__PURE__ */ c(() => {
      f(this, je) && C(this, j, un).call(this);
    }, "flushTweenChanges"),
    flushTweenChangesImmediate: /* @__PURE__ */ c(() => {
      f(this, Xe) !== null && clearTimeout(f(this, Xe)), L(this, Xe, null), C(this, j, un).call(this);
    }, "flushTweenChangesImmediate"),
    // Path utilities
    parseEntryPath: Nn,
    getEntryAtPath: /* @__PURE__ */ c((i) => Ka(i, f(this, G)), "getEntryAtPath"),
    // Insert menu
    showInsertMenu: /* @__PURE__ */ c((i, r, a) => C(this, j, jf).call(this, i, r, a), "showInsertMenu"),
    hideInsertMenu: /* @__PURE__ */ c(() => C(this, j, Bf).call(this), "hideInsertMenu"),
    // Toolbar actions
    save: /* @__PURE__ */ c(() => C(this, j, Pl).call(this), "save"),
    play: /* @__PURE__ */ c(() => C(this, j, Vf).call(this), "play"),
    resetTracking: /* @__PURE__ */ c(() => C(this, j, zf).call(this), "resetTracking"),
    exportJSON: /* @__PURE__ */ c(() => C(this, j, Gf).call(this), "exportJSON"),
    validate: /* @__PURE__ */ c(() => C(this, j, Wf).call(this), "validate"),
    importJSON: /* @__PURE__ */ c(() => qy({ state: f(this, G), mutate: /* @__PURE__ */ c((i) => C(this, j, cn).call(this, i), "mutate") }), "importJSON"),
    undo: /* @__PURE__ */ c(() => C(this, j, Fl).call(this), "undo"),
    redo: /* @__PURE__ */ c(() => C(this, j, xl).call(this), "redo")
  };
}, "#createEventContext"), // ── Insert menu ───────────────────────────────────────────────────────
jf = /* @__PURE__ */ c(function(n, i, r) {
  var l;
  const a = (l = this.element) == null ? void 0 : l.querySelector(".cinematic-editor__insert-menu");
  if (!a) return;
  const o = n.getBoundingClientRect();
  document.body.appendChild(a), a.style.display = "", a.style.position = "fixed", a.style.left = `${o.left}px`;
  const s = a.offsetHeight || 200;
  o.bottom + 4 + s > window.innerHeight ? a.style.top = `${o.top - s - 4}px` : a.style.top = `${o.bottom + 4}px`, L(this, Hi, { insertIndex: i, lane: r });
}, "#showInsertMenu"), Bf = /* @__PURE__ */ c(function() {
  var i, r;
  const n = document.body.querySelector(".cinematic-editor__insert-menu") ?? ((i = this.element) == null ? void 0 : i.querySelector(".cinematic-editor__insert-menu"));
  if (n) {
    n.style.display = "none";
    const a = (r = this.element) == null ? void 0 : r.querySelector(".cinematic-editor");
    a && n.parentNode !== a && a.appendChild(n);
  }
  L(this, Hi, null);
}, "#hideInsertMenu"), // ── State mutation ────────────────────────────────────────────────────
cn = /* @__PURE__ */ c(function(n) {
  L(this, Me, f(this, Me).slice(0, f(this, Qe) + 1)), f(this, Me).push(f(this, G)), f(this, Me).length > f(this, No) && f(this, Me).shift(), L(this, Qe, f(this, Me).length - 1), L(this, G, n(f(this, G))), L(this, St, !0), this.render({ force: !0 });
}, "#mutate"), $l = /* @__PURE__ */ c(function() {
  return f(this, Qe) >= 0;
}, "#canUndo"), Dl = /* @__PURE__ */ c(function() {
  return f(this, Qe) < f(this, Me).length - 1;
}, "#canRedo"), Fl = /* @__PURE__ */ c(function() {
  f(this, j, $l) && (f(this, Qe) === f(this, Me).length - 1 && f(this, Me).push(f(this, G)), L(this, G, f(this, Me)[f(this, Qe)]), Qo(this, Qe)._--, L(this, St, !0), this.render({ force: !0 }));
}, "#undo"), xl = /* @__PURE__ */ c(function() {
  f(this, j, Dl) && (Qo(this, Qe)._++, L(this, G, f(this, Me)[f(this, Qe) + 1]), L(this, St, !0), this.render({ force: !0 }));
}, "#redo"), Uf = /* @__PURE__ */ c(function(n, i) {
  var r;
  f(this, Ye) != null && (L(this, je, {
    ...f(this, je) ?? {},
    entryPath: f(this, Ye),
    tweenIndex: n,
    patch: { ...((r = f(this, je)) == null ? void 0 : r.patch) ?? {}, ...i }
  }), f(this, Xe) !== null && clearTimeout(f(this, Xe)), L(this, Xe, setTimeout(() => {
    L(this, Xe, null), C(this, j, un).call(this);
  }, f(this, Mo))));
}, "#queueTweenChange"), un = /* @__PURE__ */ c(function() {
  if (!f(this, je)) return;
  const { entryPath: n, tweenIndex: i, patch: r } = f(this, je);
  L(this, je, null);
  const a = Nn(n);
  if (a) {
    if (a.type === "timeline")
      L(this, G, f(this, G).updateTween(a.index, i, r));
    else if (a.type === "branch") {
      const o = Ka(n, f(this, G));
      if (o) {
        const s = (o.tweens ?? []).map((l, u) => u === i ? { ...l, ...r } : l);
        L(this, G, f(this, G).updateBranchEntry(a.index, a.branchIndex, a.branchEntryIndex, { tweens: s }));
      }
    }
    L(this, St, !0);
  }
}, "#flushTweenChanges"), Pl = /* @__PURE__ */ c(async function() {
  var n, i, r, a, o, s;
  if (f(this, qe)) {
    if (f(this, je) && C(this, j, un).call(this), f(this, G).isStale(f(this, qe))) {
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
        L(this, G, Ht.fromScene(f(this, qe), f(this, G).activeCinematicName)), L(this, St, !1), L(this, Me, []), L(this, Qe, -1), this.render({ force: !0 }), (i = (n = ui.notifications) == null ? void 0 : n.info) == null || i.call(n, "Cinematic reloaded from scene.");
        return;
      }
      if (!l) return;
    }
    try {
      await f(this, G).save(f(this, qe)), L(this, G, Ht.fromScene(f(this, qe), f(this, G).activeCinematicName)), L(this, St, !1), (a = (r = ui.notifications) == null ? void 0 : r.info) == null || a.call(r, "Cinematic saved."), this.render({ force: !0 });
    } catch (l) {
      console.error(`${T} | Cinematic save failed`, l), (s = (o = ui.notifications) == null ? void 0 : o.error) == null || s.call(o, "Failed to save cinematic data.");
    }
  }
}, "#onSave"), Vf = /* @__PURE__ */ c(async function() {
  var i, r, a, o, s;
  const n = (r = (i = game.modules.get(T)) == null ? void 0 : i.api) == null ? void 0 : r.cinematic;
  if (!(n != null && n.play)) {
    (o = (a = ui.notifications) == null ? void 0 : a.warn) == null || o.call(a, "Cinematic API not available.");
    return;
  }
  await n.play((s = f(this, qe)) == null ? void 0 : s.id, f(this, G).activeCinematicName);
}, "#onPlay"), zf = /* @__PURE__ */ c(async function() {
  var i, r, a, o, s;
  const n = (r = (i = game.modules.get(T)) == null ? void 0 : i.api) == null ? void 0 : r.cinematic;
  n != null && n.reset && (await n.reset((a = f(this, qe)) == null ? void 0 : a.id, f(this, G).activeCinematicName), (s = (o = ui.notifications) == null ? void 0 : o.info) == null || s.call(o, "Cinematic tracking reset."));
}, "#onResetTracking"), Gf = /* @__PURE__ */ c(async function() {
  var i, r;
  const n = JSON.stringify(f(this, G).toJSON(), null, 2);
  try {
    await navigator.clipboard.writeText(n), (r = (i = ui.notifications) == null ? void 0 : i.info) == null || r.call(i, "Cinematic JSON copied to clipboard.");
  } catch {
    new Dialog({
      title: "Cinematic JSON",
      content: `<textarea style="width:100%;height:300px;font-family:monospace;font-size:0.8rem">${Ot(n)}</textarea>`,
      buttons: { ok: { label: "Close" } }
    }).render(!0);
  }
}, "#onExportJSON"), Wf = /* @__PURE__ */ c(function() {
  var l, u;
  const n = f(this, G).toJSON(), { targets: i, unresolved: r } = Wa(n), a = yy(n, i), o = [
    ...r.map((d) => ({ path: "targets", level: "warn", message: `Unresolved target: "${d}"` })),
    ...a
  ];
  if (o.length === 0) {
    (u = (l = ui.notifications) == null ? void 0 : l.info) == null || u.call(l, "Cinematic validation passed — no issues found.");
    return;
  }
  const s = o.map((d) => {
    const m = d.level === "error" ? "fa-circle-xmark" : "fa-triangle-exclamation", h = d.level === "error" ? "#e74c3c" : "#f39c12";
    return `<li style="margin:0.3rem 0"><i class="fa-solid ${m}" style="color:${h};margin-right:0.3rem"></i><strong>${Ot(d.path)}</strong>: ${Ot(d.message)}</li>`;
  });
  new Dialog({
    title: "Cinematic Validation",
    content: `<p>${o.length} issue(s) found:</p><ul style="list-style:none;padding:0;max-height:300px;overflow:auto">${s.join("")}</ul>`,
    buttons: { ok: { label: "Close" } }
  }).render(!0);
}, "#onValidate"), // ── Playback progress ────────────────────────────────────────────────
Kf = /* @__PURE__ */ c(function(n) {
  var i, r, a, o, s, l;
  switch (console.log(`[cinematic-editor] playback event: ${n.type}`, n), n.type) {
    case "segment-start":
      L(this, ri, n.segmentName), n.segmentName !== f(this, G).activeSegmentName ? (L(this, G, f(this, G).switchSegment(n.segmentName)), L(this, Ye, null), f(this, wn).clear(), this.render({ force: !0 })) : (i = this.element) == null || i.querySelectorAll(".cinematic-editor__segment-node").forEach((u) => {
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
      L(this, lt, { segmentName: n.segmentName, startTime: performance.now(), durationMs: n.durationMs }), n.segmentName === f(this, G).activeSegmentName && C(this, j, Rl).call(this, n.durationMs);
      break;
    case "timeline-end":
      C(this, j, lr).call(this), L(this, lt, null);
      break;
    case "playback-end":
      C(this, j, lr).call(this), L(this, lt, null), L(this, ri, null), (l = this.element) == null || l.querySelectorAll(".cinematic-editor__segment-node--playing, .cinematic-editor__segment-node--gate-waiting").forEach((u) => {
        u.classList.remove("cinematic-editor__segment-node--playing", "cinematic-editor__segment-node--gate-waiting");
      });
      break;
  }
}, "#onPlaybackEvent"), Rl = /* @__PURE__ */ c(function(n, i = null) {
  var u, d;
  C(this, j, lr).call(this);
  const r = (u = this.element) == null ? void 0 : u.querySelector(".cinematic-editor__playback-cursor"), a = (d = this.element) == null ? void 0 : d.querySelector(".cinematic-editor__swimlane");
  if (console.log(`[cinematic-editor] startCursor: duration=${n}, cursor=${!!r}, swimlane=${!!a}, width=${a == null ? void 0 : a.scrollWidth}`), !r || !a || n <= 0) return;
  r.style.display = "block";
  const o = i ?? performance.now(), s = a.scrollWidth, l = /* @__PURE__ */ c(() => {
    const m = performance.now() - o, h = Math.min(m / n, 1), y = Er + h * (s - Er);
    r.style.left = `${y}px`, h < 1 && L(this, En, requestAnimationFrame(l));
  }, "tick");
  L(this, En, requestAnimationFrame(l));
}, "#startCursorAnimation"), lr = /* @__PURE__ */ c(function() {
  var i;
  f(this, En) && (cancelAnimationFrame(f(this, En)), L(this, En, null));
  const n = (i = this.element) == null ? void 0 : i.querySelector(".cinematic-editor__playback-cursor");
  n && (n.style.display = "none");
}, "#stopCursorAnimation"), c(bt, "CinematicEditorApplication"), pe(bt, "APP_ID", `${T}-cinematic-editor`), pe(bt, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  $e(bt, bt, "DEFAULT_OPTIONS"),
  {
    id: bt.APP_ID,
    classes: Array.from(
      /* @__PURE__ */ new Set([...((Hu = $e(bt, bt, "DEFAULT_OPTIONS")) == null ? void 0 : Hu.classes) ?? [], "eidolon-cinematic-editor-window", "themed"])
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
)), pe(bt, "PARTS", {
  content: {
    template: `modules/${T}/templates/cinematic-editor.html`
  }
});
let _l = bt;
const Jf = /* @__PURE__ */ new Map();
function dt(e, t) {
  Jf.set(e, t);
}
c(dt, "registerBehaviour");
function Yf(e) {
  return Jf.get(e);
}
c(Yf, "getBehaviour");
function Zy(e, t, n) {
  let i, r, a;
  if (t === 0)
    i = r = a = n;
  else {
    const o = /* @__PURE__ */ c((u, d, m) => (m < 0 && (m += 1), m > 1 && (m -= 1), m < 0.16666666666666666 ? u + (d - u) * 6 * m : m < 0.5 ? d : m < 0.6666666666666666 ? u + (d - u) * (0.6666666666666666 - m) * 6 : u), "hue2rgb"), s = n < 0.5 ? n * (1 + t) : n + t - n * t, l = 2 * n - s;
    i = o(l, s, e + 1 / 3), r = o(l, s, e), a = o(l, s, e - 1 / 3);
  }
  return Math.round(i * 255) << 16 | Math.round(r * 255) << 8 | Math.round(a * 255);
}
c(Zy, "hslToInt");
dt("float", (e, t = {}) => {
  const n = e.mesh;
  if (!n) return { update() {
  }, detach() {
  } };
  const i = t.speed ?? 0.04, r = t.amplitude ?? 3, a = n.position.y;
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
dt("pulse", (e, t = {}) => {
  const n = e.mesh;
  if (!n) return { update() {
  }, detach() {
  } };
  const i = t.minAlpha ?? 0.6, r = t.maxAlpha ?? 1, a = t.speed ?? 0.05, o = n.alpha;
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
dt("scale", (e, t = {}) => {
  const n = e.mesh;
  if (!n) return { update() {
  }, detach() {
  } };
  const i = t.factor ?? 1.12, r = t.durationFrames ?? 15, a = xn(t.easing ?? "easeOutCubic"), o = n.scale.x, s = n.scale.y, l = o * i, u = s * i;
  let d = 0;
  return {
    update(m) {
      if (d < r) {
        d += m;
        const h = Math.min(d / r, 1), y = a(h);
        n.scale.x = o + (l - o) * y, n.scale.y = s + (u - s) * y;
      }
    },
    detach() {
      n.scale.x = o, n.scale.y = s;
    }
  };
});
dt("glow", (e, t = {}) => {
  var p, g;
  const n = e.mesh;
  if (!((p = n == null ? void 0 : n.texture) != null && p.baseTexture)) return { update() {
  }, detach() {
  } };
  const i = e.document, r = t.color ?? 4513279, a = t.alpha ?? 0.5, o = t.blur ?? 8, s = t.pulseSpeed ?? 0.03, l = Math.abs(i.width), u = Math.abs(i.height), d = PIXI.Sprite.from(n.texture);
  d.anchor.set(0.5, 0.5), d.width = l, d.height = u, d.position.set(l / 2, u / 2), d.angle = i.rotation ?? 0, d.alpha = a, d.tint = r;
  const m = PIXI.BlurFilter ?? ((g = PIXI.filters) == null ? void 0 : g.BlurFilter), h = new m(o);
  d.filters = [h], e.addChildAt(d, 0);
  let y = 0;
  return {
    update(v) {
      y += v;
      const b = (Math.sin(y * s) + 1) / 2;
      d.visible = n.visible !== !1, d.alpha = a * (0.5 + 0.5 * b) * (n.alpha ?? 1);
    },
    detach() {
      d.parent && d.parent.removeChild(d), d.destroy({ children: !0 });
    }
  };
});
dt("wobble", (e, t = {}) => {
  const n = e.mesh;
  if (!n) return { update() {
  }, detach() {
  } };
  const i = t.speed ?? 0.15, r = t.angle ?? 2.5, a = n.angle;
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
dt("colorCycle", (e, t = {}) => {
  const n = e.mesh;
  if (!n) return { update() {
  }, detach() {
  } };
  const i = t.speed ?? 5e-3, r = t.saturation ?? 0.6, a = t.lightness ?? 0.6, o = n.tint;
  let s = 0;
  return {
    update(l) {
      s = (s + l * i) % 1, n.tint = Zy(s, r, a);
    },
    detach() {
      n.tint = o;
    }
  };
});
dt("spin", (e, t = {}) => {
  const n = e.mesh;
  if (!n) return { update() {
  }, detach() {
  } };
  const i = t.speed ?? 0.5, r = n.angle;
  return {
    update(a) {
      n.angle += a * i;
    },
    detach() {
      n.angle = r;
    }
  };
});
dt("bounce", (e, t = {}) => {
  const n = e.mesh;
  if (!n) return { update() {
  }, detach() {
  } };
  const i = t.speed ?? 0.02, r = t.amplitude ?? 6, a = xn("easeOutBounce"), o = n.position.y;
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
dt("borderTrace", (e, t = {}) => {
  const n = e.mesh;
  if (!n) return { update() {
  }, detach() {
  } };
  const i = e.document, r = Math.abs(i.width), a = Math.abs(i.height), o = 2 * (r + a), s = t.speed ?? 1.5, l = t.length ?? 60, u = t.color ?? 4513279, d = t.alpha ?? 0.8, m = t.lineWidth ?? 2, h = new PIXI.Graphics();
  h.alpha = d, e.addChildAt(h, 0);
  let y = 0;
  function p(g) {
    return g = (g % o + o) % o, g < r ? { x: g, y: 0 } : (g -= r, g < a ? { x: r, y: g } : (g -= a, g < r ? { x: r - g, y: a } : (g -= r, { x: 0, y: a - g })));
  }
  return c(p, "perimeterPoint"), {
    update(g) {
      y = (y + g * s) % o, h.visible = n.visible !== !1, h.alpha = d * (n.alpha ?? 1), h.clear(), h.lineStyle(m, u, 1);
      const v = 16, b = l / v, w = p(y);
      h.moveTo(w.x, w.y);
      for (let S = 1; S <= v; S++) {
        const I = p(y + S * b);
        h.lineTo(I.x, I.y);
      }
    },
    detach() {
      h.parent && h.parent.removeChild(h), h.destroy({ children: !0 });
    }
  };
});
dt("shimmer", (e, t = {}) => {
  const n = e.mesh;
  if (!n) return { update() {
  }, detach() {
  } };
  const i = e.document, r = Math.abs(i.width), a = Math.abs(i.height), o = t.speed ?? 1, s = t.bandWidth ?? 40, l = t.alpha ?? 0.15, u = t.pause ?? 120, d = r + a + s, m = d + u * o, h = new PIXI.Graphics();
  h.alpha = l;
  const y = new PIXI.Graphics();
  y.beginFill(16777215), y.drawRect(0, 0, r, a), y.endFill(), e.addChild(y), h.mask = y, e.addChild(h);
  let p = 0;
  return {
    update(g) {
      if (p = (p + g * o) % m, h.visible = n.visible !== !1, h.alpha = l * (n.alpha ?? 1), h.clear(), p < d) {
        const v = p - s;
        h.beginFill(16777215, 1), h.moveTo(v, 0), h.lineTo(v + s, 0), h.lineTo(v + s - a, a), h.lineTo(v - a, a), h.closePath(), h.endFill();
      }
    },
    detach() {
      h.mask = null, y.parent && y.parent.removeChild(y), y.destroy({ children: !0 }), h.parent && h.parent.removeChild(h), h.destroy({ children: !0 });
    }
  };
});
dt("none", () => ({ update() {
}, detach() {
} }));
const ca = {
  idle: ["float", "glow"],
  hover: ["scale"],
  dim: ["none"]
};
function eb(e) {
  if (!e) return { ...ca };
  const t = /* @__PURE__ */ c((n, i) => n === void 0 ? i : typeof n == "string" ? [n] : typeof n == "object" && !Array.isArray(n) && n.name ? [n] : Array.isArray(n) ? n : i, "normalize");
  return {
    idle: t(e.idle, ca.idle),
    hover: t(e.hover, ca.hover),
    dim: t(e.dim, ca.dim)
  };
}
c(eb, "normalizeConfig");
var Ur, qi, ji, ai, Sn, $n, Hl, ql;
const Tc = class Tc {
  /**
   * @param {PlaceableObject} placeable
   * @param {object|undefined} animationConfig  Raw animation config from the await entry
   */
  constructor(t, n) {
    A(this, $n);
    A(this, Ur);
    A(this, qi);
    A(this, ji, null);
    A(this, ai, []);
    A(this, Sn, null);
    L(this, Ur, t), L(this, qi, eb(n));
  }
  /** Current animation state name. */
  get state() {
    return f(this, ji);
  }
  /**
   * Start animating in the given state.
   * @param {string} [state="idle"]
   */
  start(t = "idle") {
    C(this, $n, Hl).call(this, t), L(this, Sn, (n) => {
      for (const i of f(this, ai)) i.update(n);
    }), canvas.app.ticker.add(f(this, Sn));
  }
  /**
   * Transition to a new state. Detaches current behaviours, attaches new ones.
   * No-op if already in the requested state.
   * @param {string} state
   */
  setState(t) {
    t !== f(this, ji) && (C(this, $n, ql).call(this), C(this, $n, Hl).call(this, t));
  }
  /**
   * Full cleanup — detach all behaviours and remove ticker.
   */
  detach() {
    var t, n;
    C(this, $n, ql).call(this), f(this, Sn) && ((n = (t = canvas.app) == null ? void 0 : t.ticker) == null || n.remove(f(this, Sn)), L(this, Sn, null));
  }
};
Ur = new WeakMap(), qi = new WeakMap(), ji = new WeakMap(), ai = new WeakMap(), Sn = new WeakMap(), $n = new WeakSet(), // ── Private ──────────────────────────────────────────────────────────
Hl = /* @__PURE__ */ c(function(t) {
  L(this, ji, t);
  const n = f(this, qi)[t] ?? f(this, qi).idle ?? ["none"];
  for (const i of n) {
    const r = typeof i == "string" ? i : i.name, a = typeof i == "string" ? void 0 : i, o = Yf(r);
    if (!o) {
      console.warn(`TileAnimator: unknown behaviour "${r}"`);
      continue;
    }
    f(this, ai).push(o(f(this, Ur), a));
  }
}, "#attachBehaviours"), ql = /* @__PURE__ */ c(function() {
  for (const t of f(this, ai)) t.detach();
  L(this, ai, []);
}, "#detachBehaviours"), c(Tc, "TileAnimator");
let Gi = Tc;
const tb = "cinematic", ps = 5, jl = /* @__PURE__ */ new Set();
function Gt(e) {
  for (const t of jl)
    try {
      t(e);
    } catch (n) {
      console.error("[cinematic] playback listener error:", n);
    }
}
c(Gt, "emitPlaybackEvent");
function nb(e) {
  return jl.add(e), () => jl.delete(e);
}
c(nb, "onPlaybackProgress");
let ve = null, Xt = null, fr = null, mr = null, Ei = 0, Vn = null;
function mc(e, t = "default") {
  return `cinematic-progress-${e}-${t}`;
}
c(mc, "progressFlagKey");
function ib(e, t, n, i) {
  game.user.setFlag(T, mc(e, t), {
    currentSegment: n,
    completedSegments: [...i],
    timestamp: Date.now()
  }).catch(() => {
  });
}
c(ib, "saveSegmentProgress");
function Bl(e, t = "default") {
  game.user.unsetFlag(T, mc(e, t)).catch(() => {
  });
}
c(Bl, "clearProgress");
function Xf(e, t = "default", n = 3e5) {
  const i = game.user.getFlag(T, mc(e, t));
  return !i || typeof i.timestamp != "number" || Date.now() - i.timestamp > n ? null : i.currentSegment ? i : null;
}
c(Xf, "getSavedProgress");
function gi(e, t = "default") {
  return `cinematic-seen-${e}-${t}`;
}
c(gi, "seenFlagKey");
function bu(e, t = "default") {
  return !!game.user.getFlag(T, gi(e, t));
}
c(bu, "hasSeenCinematic");
function rb(e, t) {
  var n;
  if (e == null) return null;
  if (typeof e != "object" || Array.isArray(e))
    return console.warn(`[${T}] Cinematic: invalid data for ${t} (expected object). Ignoring.`), null;
  if (e.trigger !== void 0 && typeof e.trigger != "string")
    return console.warn(`[${T}] Cinematic: invalid 'trigger' on ${t} (expected string). Ignoring.`), null;
  if (e.tracking !== void 0 && typeof e.tracking != "boolean")
    return console.warn(`[${T}] Cinematic: invalid 'tracking' on ${t} (expected boolean). Ignoring.`), null;
  if (e.synchronized !== void 0 && typeof e.synchronized != "boolean")
    return console.warn(`[${T}] Cinematic: invalid 'synchronized' on ${t} (expected boolean). Ignoring.`), null;
  if (e.segments) {
    if (typeof e.segments != "object" || Array.isArray(e.segments))
      return console.warn(`[${T}] Cinematic: invalid 'segments' on ${t} (expected object). Ignoring.`), null;
    for (const [i, r] of Object.entries(e.segments)) {
      if (!r || typeof r != "object" || Array.isArray(r)) {
        console.warn(`[${T}] Cinematic: invalid segment "${i}" on ${t}. Removing.`), delete e.segments[i];
        continue;
      }
      if (r.timeline !== void 0 && !Array.isArray(r.timeline)) {
        console.warn(`[${T}] Cinematic: invalid timeline on segment "${i}" of ${t}. Removing.`), delete e.segments[i];
        continue;
      }
      (n = r.timeline) != null && n.length && (r.timeline = r.timeline.filter((a, o) => !a || typeof a != "object" || Array.isArray(a) ? (console.warn(`[${T}] Cinematic: segment "${i}" timeline[${o}] on ${t} is not a valid object, removing.`), !1) : !0));
    }
    if (Object.keys(e.segments).length === 0)
      return console.warn(`[${T}] Cinematic: no valid segments on ${t}. Ignoring.`), null;
  }
  return e.timeline !== void 0 && !Array.isArray(e.timeline) ? (console.warn(`[${T}] Cinematic: invalid 'timeline' on ${t} (expected array). Ignoring.`), null) : e;
}
c(rb, "validateSingleCinematic");
function Jo(e) {
  const t = e ? game.scenes.get(e) : canvas.scene;
  let n = (t == null ? void 0 : t.getFlag(T, tb)) ?? null;
  if (n == null) return null;
  if (typeof n != "object" || Array.isArray(n))
    return console.warn(`[${T}] Cinematic: invalid flag data on scene ${t == null ? void 0 : t.id} (expected object). Ignoring.`), null;
  if ((n.version ?? 1) < 3) {
    const { version: i, ...r } = n;
    n = { version: 3, cinematics: { default: r } };
  }
  if (n.version === 3) {
    for (const [i, r] of Object.entries(n.cinematics ?? {}))
      n.cinematics[i] = Ht.migrateV3toV4(r);
    n.version = 4;
  }
  if (n.version === 4) {
    for (const [i, r] of Object.entries(n.cinematics ?? {}))
      n.cinematics[i] = Ht.migrateV4toV5(r);
    n.version = ps;
  }
  if (n.version > ps)
    return console.warn(`[${T}] Cinematic: scene ${t == null ? void 0 : t.id} has version ${n.version}, runtime supports up to ${ps}. Skipping.`), null;
  if (!n.cinematics || typeof n.cinematics != "object")
    return console.warn(`[${T}] Cinematic: no 'cinematics' map on scene ${t == null ? void 0 : t.id}. Ignoring.`), null;
  for (const [i, r] of Object.entries(n.cinematics)) {
    const a = rb(r, `scene ${t == null ? void 0 : t.id} cinematic "${i}"`);
    a ? n.cinematics[i] = a : delete n.cinematics[i];
  }
  return Object.keys(n.cinematics).length === 0 ? null : n;
}
c(Jo, "getCinematicData");
function eo(e, t = "default") {
  var i;
  const n = Jo(e);
  return ((i = n == null ? void 0 : n.cinematics) == null ? void 0 : i[t]) ?? null;
}
c(eo, "getNamedCinematic");
function ab(e) {
  const t = Jo(e);
  return t ? Object.keys(t.cinematics) : [];
}
c(ab, "listCinematicNames");
function ob() {
  return game.ready ? Promise.resolve() : new Promise((e) => Hooks.once("ready", e));
}
c(ob, "waitForReady");
async function sb(e = 1e4) {
  var n, i;
  const t = (i = (n = game.modules.get(T)) == null ? void 0 : n.api) == null ? void 0 : i.tween;
  return t != null && t.Timeline ? t.Timeline : new Promise((r) => {
    const a = Date.now(), o = setTimeout(() => {
      var l, u;
      (u = (l = ui.notifications) == null ? void 0 : l.info) == null || u.call(l, `[${T}] Cinematic: waiting for tween engine...`);
    }, 2e3), s = setInterval(() => {
      var u, d, m, h;
      const l = (d = (u = game.modules.get(T)) == null ? void 0 : u.api) == null ? void 0 : d.tween;
      l != null && l.Timeline ? (clearInterval(s), clearTimeout(o), r(l.Timeline)) : Date.now() - a > e && (clearInterval(s), clearTimeout(o), console.warn(`[${T}] Cinematic: tween API not available after ${e}ms.`), (h = (m = ui.notifications) == null ? void 0 : m.warn) == null || h.call(m, `[${T}] Cinematic: tween engine unavailable — cinematic cannot play.`), r(null));
    }, 200);
  });
}
c(sb, "waitForTweenAPI");
async function Ul(e = 5e3) {
  var t;
  return window.Tagger ?? ((t = game.modules.get("tagger")) == null ? void 0 : t.api) ? !0 : new Promise((n) => {
    const i = Date.now(), r = setInterval(() => {
      var a;
      window.Tagger ?? ((a = game.modules.get("tagger")) == null ? void 0 : a.api) ? (clearInterval(r), n(!0)) : Date.now() - i > e && (clearInterval(r), console.warn(`[${T}] Cinematic: Tagger API not available after ${e}ms.`), n(!1));
    }, 200);
  });
}
c(Ul, "waitForTagger");
async function lb(e, t, n) {
  if (!e || !e.event) return;
  const i = { ...e };
  console.log(`[${T}] Cinematic: waiting for gate: ${e.event}`);
  let r = null;
  if (e.event === "tile-click" && e.target && e.animation) {
    const a = t.get(e.target);
    (a == null ? void 0 : a.kind) === "placeable" && a.placeable && (r = new Gi(a.placeable, e.animation), r.start());
  }
  try {
    if (e.timeout && e.timeout > 0) {
      const a = new Promise((s) => setTimeout(s, e.timeout)), o = vl(i, { signal: n.signal, eventBus: null });
      await Promise.race([o, a]);
    } else
      await vl(i, { signal: n.signal, eventBus: null });
  } finally {
    r && r.detach();
  }
}
c(lb, "processGate");
function Qf(e) {
  if (!e.segments) return [];
  const t = [], n = /* @__PURE__ */ new Set();
  let i = e.entry;
  for (; i && typeof i == "string" && e.segments[i] && !n.has(i); )
    n.add(i), t.push(i), i = e.segments[i].next;
  return t;
}
c(Qf, "getSegmentOrder");
function to(e, t) {
  const n = Qf(e);
  for (const i of n) {
    const r = e.segments[i];
    if (r.setup)
      try {
        Ve(r.setup, t);
      } catch (a) {
        console.warn(`[${T}] Cinematic: error applying setup for segment "${i}":`, a);
      }
    if (r.landing)
      try {
        Ve(r.landing, t);
      } catch (a) {
        console.warn(`[${T}] Cinematic: error applying landing for segment "${i}":`, a);
      }
  }
  canvas.perception.update({ refreshLighting: !0, refreshVision: !0 });
}
c(to, "applyAllSegmentLandingStates");
async function hr(e, t = "default", n = null) {
  var w, S, I, O, k, M, x, R;
  const i = e ?? ((w = canvas.scene) == null ? void 0 : w.id);
  if (!i) return;
  const r = `${i}:${t}`;
  if (n || (n = /* @__PURE__ */ new Set()), n.has(r)) {
    console.warn(`[${T}] Cinematic: circular transition detected at "${r}". Stopping chain.`), (I = (S = ui.notifications) == null ? void 0 : S.warn) == null || I.call(S, "Cinematic: circular transition detected, stopping.");
    return;
  }
  n.add(r), (ve == null ? void 0 : ve.status) === "running" && ve.cancel("replaced"), ve = null, Xt && (Xt.abort("replaced"), Xt = null);
  const a = eo(i, t);
  if (!a) {
    console.warn(`[${T}] Cinematic: no cinematic "${t}" on scene ${i}.`);
    return;
  }
  const o = await sb();
  if (!o || ((O = canvas.scene) == null ? void 0 : O.id) !== i || (await Ul(), ((k = canvas.scene) == null ? void 0 : k.id) !== i)) return;
  const { targets: s, unresolved: l } = Wa(a);
  if (console.log(`[${T}] Cinematic "${t}": resolved ${s.size} targets`), l.length && console.warn(`[${T}] Cinematic "${t}": skipping ${l.length} unresolved: ${l.join(", ")}`), s.size === 0) {
    console.warn(`[${T}] Cinematic "${t}": no targets could be resolved on scene ${i}.`);
    return;
  }
  const u = cy(a);
  fr = ly(u, s), mr = s;
  const d = Xf(i, t), m = new AbortController();
  Xt = m;
  const h = a.synchronized === !0 && game.user.isGM, y = Qf(a);
  if (y.length === 0) {
    console.warn(`[${T}] Cinematic "${t}": no segments to execute.`);
    return;
  }
  let p = 0;
  const g = /* @__PURE__ */ new Set();
  if (d) {
    const F = d.completedSegments ?? [];
    for (const _ of F) g.add(_);
    const D = y.indexOf(d.currentSegment);
    D >= 0 && (p = D, console.log(`[${T}] Cinematic "${t}": resuming from segment "${d.currentSegment}" (${F.length} completed)`));
  }
  for (let F = 0; F < p; F++) {
    const D = y[F], _ = a.segments[D];
    if (_.setup)
      try {
        Ve(_.setup, s);
      } catch (H) {
        console.warn(`[${T}] Cinematic: error applying setup for completed segment "${D}":`, H);
      }
    if (_.landing)
      try {
        Ve(_.landing, s);
      } catch (H) {
        console.warn(`[${T}] Cinematic: error applying landing for completed segment "${D}":`, H);
      }
  }
  let v = !1, b = !1;
  Gt({ type: "playback-start", sceneName: ((M = canvas.scene) == null ? void 0 : M.name) ?? i });
  try {
    for (let F = p; F < y.length; F++) {
      if (m.signal.aborted) {
        v = !0;
        break;
      }
      if (((x = canvas.scene) == null ? void 0 : x.id) !== i) {
        v = !0;
        break;
      }
      const D = y[F], _ = a.segments[D];
      if (console.log(`[${T}] Cinematic "${t}": entering segment "${D}"`), Gt({ type: "segment-start", segmentName: D }), ib(i, t, D, [...g]), _.gate) {
        Gt({ type: "gate-wait", segmentName: D, gate: _.gate });
        try {
          await lb(_.gate, s, m);
        } catch (B) {
          if (m.signal.aborted) {
            v = !0;
            break;
          }
          throw B;
        }
        Gt({ type: "gate-resolved", segmentName: D });
      }
      if (m.signal.aborted) {
        v = !0;
        break;
      }
      if (_.setup)
        try {
          Ve(_.setup, s), canvas.perception.update({ refreshLighting: !0, refreshVision: !0 });
        } catch (B) {
          console.error(`[${T}] Cinematic "${t}": error applying setup for segment "${D}":`, B);
        }
      if ((R = _.timeline) != null && R.length) {
        const B = fc(_.timeline);
        Gt({ type: "timeline-start", segmentName: D, durationMs: B });
        const { tl: W } = py(
          { setup: {}, timeline: _.timeline },
          s,
          o,
          {
            timelineName: `cinematic-${i}-${t}-${D}`,
            onStepComplete: /* @__PURE__ */ c((U) => {
              Gt({ type: "step-complete", segmentName: D, stepIndex: U });
            }, "onStepComplete")
          }
        );
        ve = W.run({
          broadcast: h,
          commit: h
        });
        try {
          await new Promise((U, J) => {
            W.onComplete(() => U()), W.onCancel(() => J(new Error("cancelled"))), W.onError((Q) => J(new Error(`timeline error: ${Q}`)));
            const ae = /* @__PURE__ */ c(() => J(new Error("cancelled")), "onAbort");
            m.signal.addEventListener("abort", ae, { once: !0 });
          });
        } catch (U) {
          if (U.message === "cancelled" || m.signal.aborted) {
            v = !0;
            break;
          }
          throw U;
        }
        Gt({ type: "timeline-end", segmentName: D });
      }
      if (m.signal.aborted) {
        v = !0;
        break;
      }
      if (_.landing)
        try {
          Ve(_.landing, s), canvas.perception.update({ refreshLighting: !0, refreshVision: !0 });
        } catch (B) {
          console.error(`[${T}] Cinematic "${t}": error applying landing for segment "${D}":`, B);
        }
      Gt({ type: "segment-complete", segmentName: D }), g.add(D);
      const H = _.next;
      if (H && typeof H == "object" && H.scene) {
        const B = H.scene, W = H.segment ?? a.entry;
        console.log(`[${T}] Cinematic "${t}": cross-scene transition to scene ${B}, segment "${W}"`), ve = null, Xt = null, Bl(i, t), ou(), a.tracking !== !1 && await game.user.setFlag(T, gi(i, t), !0), Vn = { sceneId: B, cinematicName: t, visitedChain: n };
        const q = game.scenes.get(B);
        q ? q.view() : (console.warn(`[${T}] Cinematic: cross-scene transition target scene "${B}" not found.`), Vn = null);
        return;
      }
    }
  } catch (F) {
    b = !0, console.error(`[${T}] Cinematic "${t}" error on scene ${i}:`, F);
  }
  if (ve = null, Xt = null, Bl(i, t), ou(), fr = null, mr = null, Gt({ type: "playback-end", cancelled: !!v }), v) {
    console.log(`[${T}] Cinematic "${t}" cancelled on scene ${i}.`), to(a, s);
    return;
  }
  if (b) {
    to(a, s);
    return;
  }
  a.tracking !== !1 && await game.user.setFlag(T, gi(i, t), !0), console.log(`[${T}] Cinematic "${t}" complete on scene ${i}.`);
}
c(hr, "playCinematic");
async function cb(e, t = "default") {
  var i;
  const n = e ?? ((i = canvas.scene) == null ? void 0 : i.id);
  n && (await game.user.unsetFlag(T, gi(n, t)), console.log(`[${T}] Cinematic: cleared seen flag for "${t}" on scene ${n}.`));
}
c(cb, "resetCinematic");
async function ub(e, t, n = "default") {
  var a;
  if (!game.user.isGM) return;
  const i = e ?? ((a = canvas.scene) == null ? void 0 : a.id);
  if (!i || !t) return;
  const r = game.users.get(t);
  r && (await r.unsetFlag(T, gi(i, n)), console.log(`[${T}] Cinematic: cleared seen flag for user ${r.name} on "${n}" scene ${i}.`));
}
c(ub, "resetCinematicForUser");
async function db(e, t = "default") {
  var a;
  if (!game.user.isGM) return;
  const n = e ?? ((a = canvas.scene) == null ? void 0 : a.id);
  if (!n) return;
  const i = gi(n, t), r = game.users.map((o) => o.getFlag(T, i) ? o.unsetFlag(T, i) : Promise.resolve());
  await Promise.all(r), console.log(`[${T}] Cinematic: cleared seen flag for all users on "${t}" scene ${n}.`);
}
c(db, "resetCinematicForAll");
function fb(e, t = "default") {
  var r;
  const n = e ?? ((r = canvas.scene) == null ? void 0 : r.id);
  if (!n) return [];
  const i = gi(n, t);
  return game.users.map((a) => ({
    userId: a.id,
    name: a.name,
    color: a.color ?? "#888888",
    isGM: a.isGM,
    seen: !!a.getFlag(T, i)
  }));
}
c(fb, "getSeenStatus");
function mb(e, t) {
  var i;
  const n = e ?? ((i = canvas.scene) == null ? void 0 : i.id);
  return t ? eo(n, t) != null : Jo(n) != null;
}
c(mb, "hasCinematic");
function hb() {
  if (!fr || !mr) {
    console.warn(`[${T}] Cinematic: no snapshot available for revert.`);
    return;
  }
  (ve == null ? void 0 : ve.status) === "running" && ve.cancel("reverted"), ve = null, Xt && (Xt.abort("reverted"), Xt = null);
  try {
    Ve(fr, mr), canvas.perception.update({ refreshLighting: !0, refreshVision: !0 }), console.log(`[${T}] Cinematic: reverted to pre-cinematic state.`);
  } catch (e) {
    console.error(`[${T}] Cinematic: error during revert:`, e);
  }
  fr = null, mr = null;
}
c(hb, "revertCinematic");
async function gb() {
  const e = ++Ei;
  if (console.log(`[${T}] Cinematic: canvasReady fired, gen=${e}, game.ready=${game.ready}`), await ob(), e !== Ei) return;
  console.log(`[${T}] Cinematic: game is ready`);
  const t = canvas.scene;
  if (!t) {
    console.log(`[${T}] Cinematic: no canvas.scene, exiting`);
    return;
  }
  if (Vn && Vn.sceneId === t.id) {
    const a = Vn;
    Vn = null, console.log(`[${T}] Cinematic: picking up pending transition to "${a.cinematicName}" on scene ${t.id}`);
    try {
      await hr(t.id, a.cinematicName, a.visitedChain);
    } catch (o) {
      console.error(`[${T}] Cinematic: error during pending transition playback on scene ${t.id}:`, o);
    }
    return;
  }
  Vn = null;
  const n = Jo(t.id);
  if (!n) {
    console.log(`[${T}] Cinematic: no cinematic flag on scene ${t.id}, exiting`);
    return;
  }
  console.log(`[${T}] Cinematic: found ${Object.keys(n.cinematics).length} cinematic(s) on scene ${t.id}`);
  const i = [];
  for (const [a, o] of Object.entries(n.cinematics))
    (!o.trigger || o.trigger === "canvasReady") && i.push({ name: a, data: o });
  if (i.length === 0) {
    console.log(`[${T}] Cinematic: no canvasReady cinematics on scene ${t.id}, exiting`);
    return;
  }
  for (const { name: a } of i) {
    const o = Xf(t.id, a);
    if (e !== Ei) return;
    if (o) {
      console.log(`[${T}] Cinematic "${a}": found saved progress at segment "${o.currentSegment}", resuming...`);
      try {
        await hr(t.id, a);
      } catch (s) {
        console.error(`[${T}] Cinematic "${a}": error during resumed playback on scene ${t.id}:`, s);
      }
      return;
    }
  }
  let r = null;
  for (const { name: a, data: o } of i)
    if (!(o.tracking !== !1 && bu(t.id, a))) {
      r = { name: a, data: o };
      break;
    }
  if (!r) {
    if (console.log(`[${T}] Cinematic: all canvasReady cinematics already seen on scene ${t.id}`), pb(t.id, i), (ve == null ? void 0 : ve.status) === "running" && ve.cancel("already-seen"), ve = null, await Ul(), e !== Ei) return;
    for (const { name: a, data: o } of i)
      try {
        const { targets: s } = Wa(o);
        to(o, s);
      } catch (s) {
        console.error(`[${T}] Cinematic "${a}": error applying landing states (already seen) on scene ${t.id}:`, s);
      }
    canvas.perception.update({ refreshLighting: !0, refreshVision: !0 });
    return;
  }
  if (e === Ei && (console.log(`[${T}] Cinematic: playing first unseen cinematic "${r.name}"...`), await Ul(), e === Ei)) {
    for (const { name: a, data: o } of i) {
      if (a === r.name) continue;
      if (o.tracking !== !1 && bu(t.id, a))
        try {
          const { targets: l } = Wa(o);
          to(o, l);
        } catch (l) {
          console.error(`[${T}] Cinematic "${a}": error applying landing states (already seen) on scene ${t.id}:`, l);
        }
    }
    try {
      await hr(t.id, r.name);
    } catch (a) {
      console.error(`[${T}] Cinematic "${r.name}": error during playback on scene ${t.id}:`, a);
    }
  }
}
c(gb, "onCanvasReady$2");
function pb(e, t) {
  for (const { name: n } of t)
    Bl(e, n);
}
c(pb, "clearAllCanvasReadyProgress");
function yb(e = 3e5) {
  var i;
  const t = (i = game.user.flags) == null ? void 0 : i[T];
  if (!t) return;
  const n = Date.now();
  for (const r of Object.keys(t)) {
    if (!r.startsWith("cinematic-progress-")) continue;
    const a = t[r];
    if (!a || typeof a.timestamp != "number") {
      game.user.unsetFlag(T, r).catch(() => {
      });
      continue;
    }
    n - a.timestamp > e && (console.log(`[${T}] Cinematic: cleaning up stale progress flag "${r}" (age: ${n - a.timestamp}ms)`), game.user.unsetFlag(T, r).catch(() => {
    }));
  }
}
c(yb, "cleanupStaleProgressFlags");
function bb() {
  Hooks.on("getSceneControlButtons", (e) => {
    if (!game.user.isGM) return;
    const t = Array.isArray(e) ? e : e instanceof Map ? Array.from(e.values()) : Object.values(e);
    if (!t.length) return;
    const n = t.find((o) => (o == null ? void 0 : o.name) === "tiles") ?? t.find((o) => (o == null ? void 0 : o.name) === "tokens" || (o == null ? void 0 : o.name) === "token") ?? t[0];
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
        new _l({ scene: canvas.scene }).render(!0);
      }, "onClick")
    };
    Array.isArray(i) ? i.push(a) : i instanceof Map ? i.set(r, a) : i && typeof i == "object" ? i[r] = a : n.tools = [a];
  });
}
c(bb, "registerEditorButton");
function vb() {
  Hooks.on("canvasReady", gb), bb(), Hooks.once("ready", () => {
    yb();
    const e = game.modules.get(T);
    e.api || (e.api = {}), e.api.cinematic = {
      play: hr,
      reset: cb,
      resetForUser: ub,
      resetForAll: db,
      getSeenStatus: fb,
      has: mb,
      get: eo,
      list: ab,
      revert: hb,
      onPlaybackProgress: nb,
      TileAnimator: Gi,
      registerBehaviour: dt,
      getBehaviour: Yf,
      trigger: /* @__PURE__ */ c(async (t, n, i = "default") => {
        var o;
        const r = n ?? ((o = canvas.scene) == null ? void 0 : o.id);
        if (!r) return;
        const a = eo(r, i);
        a && (a.trigger && a.trigger !== t || await hr(r, i));
      }, "trigger")
    }, console.log(`[${T}] Cinematic API registered (v5).`);
  });
}
c(vb, "registerCinematicHooks");
function Vl(e, t) {
  const n = Math.abs(e.width), i = Math.abs(e.height), r = n / 2, a = i / 2;
  let o = t.x - (e.x + r), s = t.y - (e.y + a);
  if (e.rotation !== 0) {
    const l = Math.toRadians(e.rotation), u = Math.cos(l), d = Math.sin(l), m = u * o + d * s, h = u * s - d * o;
    o = m, s = h;
  }
  return o += r, s += a, o >= 0 && o <= n && s >= 0 && s <= i;
}
c(Vl, "pointWithinTile");
zo("tile-click", (e, t) => e.target ? new Promise((n, i) => {
  var y;
  if (t.signal.aborted) return i(t.signal.reason ?? "aborted");
  const r = Wo(e.target);
  if (!((y = r == null ? void 0 : r.placeables) != null && y.length))
    return i(new Error(`await tile-click: no placeables found for "${e.target}"`));
  const a = r.placeables, o = [];
  for (const { placeable: p } of a) {
    const g = new Gi(p, e.animation);
    g.start("idle"), o.push({ placeable: p, animator: g });
  }
  const s = document.getElementById("board");
  let l = null;
  const u = /* @__PURE__ */ c((p) => {
    const g = canvas.activeLayer;
    if (!g) return;
    const v = g.toLocal(p);
    if (!v || isNaN(v.x) || isNaN(v.y)) return;
    let b = !1;
    for (const { placeable: w, animator: S } of o)
      Vl(w.document, v) ? (b = !0, S.state !== "hover" && S.setState("hover")) : S.state === "hover" && S.setState("idle");
    b ? l === null && (l = document.body.style.cursor, document.body.style.cursor = "pointer") : l !== null && (document.body.style.cursor = l, l = null);
  }, "onPointerMove");
  s == null || s.addEventListener("pointermove", u);
  const d = /* @__PURE__ */ c((p) => {
    if (p.button !== 0) return;
    const g = canvas.activeLayer;
    if (!g) return;
    const v = g.toLocal(p);
    isNaN(v.x) || isNaN(v.y) || !a.filter(({ doc: w }) => Vl(w, v)).sort((w, S) => (S.doc.sort ?? 0) - (w.doc.sort ?? 0))[0] || (p.stopPropagation(), p.preventDefault(), h(), n());
  }, "onPointerDown");
  s == null || s.addEventListener("pointerdown", d, { capture: !0 });
  const m = /* @__PURE__ */ c(() => {
    h(), i(t.signal.reason ?? "aborted");
  }, "onAbort");
  t.signal.addEventListener("abort", m, { once: !0 });
  function h() {
    s == null || s.removeEventListener("pointerdown", d, { capture: !0 }), s == null || s.removeEventListener("pointermove", u), t.signal.removeEventListener("abort", m);
    for (const { animator: p } of o)
      p.detach();
    l !== null ? (document.body.style.cursor = l, l = null) : document.body.style.cursor = "";
  }
  c(h, "cleanup");
}) : Promise.reject(new Error('await tile-click: "target" is required')));
vb();
function wb() {
  Hooks.once("ready", () => {
    const e = game.modules.get(T);
    e.api || (e.api = {}), e.api.picker = {
      /** Open the picker window. Returns Promise<string[] | null>. */
      open: /* @__PURE__ */ c((t) => Za.open(t), "open"),
      /** Resolve a selector string to documents. */
      resolveSelector: Wo,
      /** Parse a selector string into { type, value }. */
      parseSelector: dc,
      /** Build a selector string from { type, value }. */
      buildSelector: iy,
      /** Build a tag selector from tags array + mode. */
      buildTagSelector: wf,
      /** Canvas highlight utilities. */
      highlight: {
        add: Qa,
        remove: zi,
        has: Nf,
        clearAll: Oa
      }
    }, console.log(`[${T}] Placeable Picker API registered.`);
  });
}
c(wb, "registerPlaceablePickerHooks");
wb();
const zl = "eidolon-utilities", Eb = "idle-animation", Wi = /* @__PURE__ */ new Map();
function Sb(e) {
  return typeof e.attribute == "string" && typeof e.from == "number" && typeof e.to == "number" && typeof e.period == "number" && e.period > 0;
}
c(Sb, "isValidTilePropConfig");
function Cb(e) {
  return typeof e.fromColor == "string" && typeof e.toColor == "string" && typeof e.period == "number" && e.period > 0;
}
c(Cb, "isValidTileTintConfig");
function Tb(e) {
  return typeof e.fromScale == "number" && typeof e.toScale == "number" && e.fromScale > 0 && e.toScale > 0 && typeof e.period == "number" && e.period > 0;
}
c(Tb, "isValidTileScaleConfig");
function vu(e) {
  if (!e || typeof e != "object") return !1;
  const t = e.type ?? "tile-prop";
  return t === "tile-tint" ? Cb(e) : t === "tile-scale" ? Tb(e) : Sb(e);
}
c(vu, "isValidConfig");
function hc(e) {
  var i;
  const t = (i = e == null ? void 0 : e.getFlag) == null ? void 0 : i.call(e, zl, Eb);
  if (!t) return [];
  let n;
  if (Array.isArray(t))
    n = t;
  else if (typeof t == "object" && "0" in t)
    n = Object.values(t);
  else return typeof t == "object" && vu(t) ? [t] : [];
  return n.filter(vu);
}
c(hc, "getIdleAnimationConfigs");
function Lb(e, t) {
  const n = t.type ?? "tile-prop";
  return n === "tile-tint" ? `${e}::tint` : n === "tile-scale" ? `${e}::scale` : `${e}::${t.attribute}`;
}
c(Lb, "loopKey");
function wu(e, t, n, i) {
  return t.type === "tile-tint" ? { uuid: e, toColor: n ? t.toColor : t.fromColor, mode: t.mode } : t.type === "tile-scale" ? {
    uuid: e,
    toScale: n ? t.toScale : t.fromScale,
    ...i
  } : { uuid: e, attribute: t.attribute, value: n ? t.to : t.from };
}
c(wu, "buildExecuteParams");
function Ib(e, t) {
  var y, p;
  const n = e == null ? void 0 : e.document;
  if (!n) return;
  const i = n.id, r = Lb(i, t);
  gc(r);
  const a = t.type ?? "tile-prop", o = yi(a);
  if (!o) {
    console.warn(`[${zl}] idle-animation: unknown tween type "${a}"`);
    return;
  }
  const s = new AbortController();
  let l, u = null;
  if (a === "tile-tint") {
    const g = ((p = (y = n._source) == null ? void 0 : y.texture) == null ? void 0 : p.tint) ?? "#ffffff";
    l = /* @__PURE__ */ c(() => {
      var b, w, S;
      const v = (w = (b = canvas.scene) == null ? void 0 : b.tiles) == null ? void 0 : w.get(i);
      v && (v.updateSource({ texture: { tint: g } }), (S = v.object) == null || S.refresh());
    }, "restore"), n.updateSource({ texture: { tint: t.fromColor } }), e.refresh();
  } else if (a === "tile-scale") {
    const g = n._source.width, v = n._source.height, b = n._source.x, w = n._source.y;
    u = {
      baseWidth: g,
      baseHeight: v,
      centerX: b + g / 2,
      centerY: w + v / 2
    }, l = /* @__PURE__ */ c(() => {
      var x, R, F;
      const M = (R = (x = canvas.scene) == null ? void 0 : x.tiles) == null ? void 0 : R.get(i);
      M && (M.updateSource({ width: g, height: v, x: b, y: w }), (F = M.object) == null || F.refresh());
    }, "restore");
    const S = g * t.fromScale, I = v * t.fromScale, O = u.centerX - S / 2, k = u.centerY - I / 2;
    n.updateSource({ width: S, height: I, x: O, y: k }), e.refresh();
  } else {
    const g = foundry.utils.getProperty(n._source, t.attribute);
    if (typeof g != "number") {
      console.warn(`[${zl}] idle-animation: attribute "${t.attribute}" is not a number on tile ${i}`);
      return;
    }
    l = /* @__PURE__ */ c(() => {
      var b, w, S;
      const v = (w = (b = canvas.scene) == null ? void 0 : b.tiles) == null ? void 0 : w.get(i);
      v && (v.updateSource(foundry.utils.expandObject({ [t.attribute]: g })), (S = v.object) == null || S.refresh());
    }, "restore"), n.updateSource(foundry.utils.expandObject({ [t.attribute]: t.from })), e.refresh();
  }
  Wi.set(r, { controller: s, restore: l });
  const d = n.uuid, m = t.period / 2, h = t.easing ?? "easeInOutCosine";
  (async () => {
    const { signal: g } = s;
    for (; !g.aborted && !(await o.execute(
      wu(d, t, !0, u),
      { durationMS: m, easing: h, commit: !1, signal: g }
    ) === !1 || g.aborted || await o.execute(
      wu(d, t, !1, u),
      { durationMS: m, easing: h, commit: !1, signal: g }
    ) === !1 || g.aborted); )
      ;
  })();
}
c(Ib, "startLoop");
function gc(e) {
  const t = Wi.get(e);
  t && (t.controller.abort(), Wi.delete(e), t.restore());
}
c(gc, "stopLoopByKey");
function Sr(e) {
  const t = `${e}::`;
  for (const n of [...Wi.keys()])
    n.startsWith(t) && gc(n);
}
c(Sr, "stopLoopsForTile");
function pc(e, t) {
  if (e != null && e.document) {
    Sr(e.document.id);
    for (const n of t)
      Ib(e, n);
  }
}
c(pc, "startAllLoops");
function Ob() {
  for (const e of [...Wi.keys()])
    gc(e);
}
c(Ob, "stopAllLoops");
function Eu(e) {
  const t = `${e}::`;
  for (const n of Wi.keys())
    if (n.startsWith(t)) return !0;
  return !1;
}
c(Eu, "isLooping");
function Ct(e, t, n) {
  const i = document.createElement("div");
  i.classList.add("form-group");
  const r = document.createElement("label");
  r.textContent = e;
  const a = document.createElement("select");
  a.classList.add(t);
  for (const o of n) {
    const s = document.createElement("option");
    s.value = o.value, s.textContent = o.label, o.selected && (s.selected = !0), a.appendChild(s);
  }
  return i.append(r, a), i;
}
c(Ct, "buildSelectGroup");
function Tt(e, t, n, i = {}) {
  const r = document.createElement("div");
  r.classList.add("form-group");
  const a = document.createElement("label");
  a.textContent = e;
  const o = document.createElement("input");
  o.type = "number", o.classList.add(t), o.value = String(n);
  for (const [s, l] of Object.entries(i)) o.setAttribute(s, l);
  return r.append(a, o), r;
}
c(Tt, "buildNumberGroup");
function Cr(e, t, n) {
  const i = document.createElement("div");
  i.classList.add("form-group");
  const r = document.createElement("label");
  r.textContent = e;
  const a = document.createElement("div");
  a.classList.add("idle-anim__color-wrapper");
  const o = document.createElement("input");
  o.type = "color", o.classList.add(t), o.value = n;
  const s = document.createElement("input");
  return s.type = "text", s.classList.add(`${t}-text`), s.value = n, s.maxLength = 7, o.addEventListener("input", () => {
    s.value = o.value;
  }), s.addEventListener("change", () => {
    /^#[0-9a-f]{6}$/i.test(s.value) && (o.value = s.value);
  }), a.append(o, s), i.append(r, a), i;
}
c(Cr, "buildColorGroup");
const ys = "eidolon-utilities", bs = "idle-animation", Ab = "eidolon-idle-animation", kb = "fa-solid fa-wave-pulse", yc = [
  { value: "alpha", label: "Alpha (Opacity)", from: 0.85, to: 1, step: "0.01" },
  { value: "rotation", label: "Rotation", from: -5, to: 5, step: "1" },
  { value: "texture.rotation", label: "Texture Rotation", from: -5, to: 5, step: "1" }
], gr = {
  type: "tile-prop",
  attribute: "alpha",
  from: 0.85,
  to: 1,
  period: 1500,
  easing: "easeInOutCosine"
}, zn = {
  fromColor: "#ffffff",
  toColor: "#ffcc88",
  mode: "oklch",
  period: 3e3
}, vs = {
  fromScale: 0.95,
  toScale: 1.05
};
function Su(e, t) {
  const n = yc.find((r) => r.value === e);
  if (n && n.from !== null) return { from: n.from, to: n.to, step: n.step };
  const i = foundry.utils.getProperty((t == null ? void 0 : t._source) ?? {}, e);
  return typeof i == "number" && i > 0 ? { from: Math.round(i * 0.95), to: Math.round(i * 1.05), step: "1" } : { from: 0, to: 100, step: "1" };
}
c(Su, "getAttributeDefaults");
function Mb(e) {
  var t;
  return (e == null ? void 0 : e.document) ?? ((t = e == null ? void 0 : e.object) == null ? void 0 : t.document) ?? (e == null ? void 0 : e.object) ?? null;
}
c(Mb, "getTileDocument$1");
function Cu(e) {
  if (!e) return "";
  const t = e.type ?? "tile-prop";
  if (t === "tile-tint")
    return `Tint ${e.fromColor ?? "?"} → ${e.toColor ?? "?"} (${e.period ?? "?"}ms)`;
  if (t === "tile-scale") {
    const r = e.fromScale != null ? `${Math.round(e.fromScale * 100)}%` : "?", a = e.toScale != null ? `${Math.round(e.toScale * 100)}%` : "?";
    return `Scale ${r} → ${a} (${e.period ?? "?"}ms)`;
  }
  const n = yc.find((r) => r.value === e.attribute);
  return `${(n == null ? void 0 : n.label) ?? e.attribute ?? "?"} ${e.from ?? "?"} → ${e.to ?? "?"} (${e.period ?? "?"}ms)`;
}
c(Cu, "summarizeConfig");
function Tu(e, t, n) {
  const i = t.type ?? "tile-prop", r = Bo(), a = document.createElement("div");
  a.classList.add("idle-anim__slot", "is-collapsed"), a.dataset.index = String(n);
  const o = document.createElement("div");
  o.classList.add("idle-anim__slot-header");
  const s = document.createElement("i");
  s.classList.add("fa-solid", "fa-chevron-right", "idle-anim__slot-chevron");
  const l = document.createElement("span");
  l.classList.add("idle-anim__slot-title"), l.textContent = `Animation ${n + 1}`;
  const u = document.createElement("span");
  u.classList.add("idle-anim__slot-summary"), u.textContent = Cu(t);
  const d = document.createElement("button");
  d.type = "button", d.classList.add("idle-anim__slot-remove"), d.innerHTML = '<i class="fa-solid fa-xmark"></i>', d.title = "Remove animation", o.append(s, l, u, d), a.appendChild(o);
  const m = document.createElement("div");
  m.classList.add("idle-anim__slot-body");
  const h = Ct("Type", "idle-anim__type", [
    { value: "tile-prop", label: "Numeric", selected: i === "tile-prop" || i !== "tile-tint" && i !== "tile-scale" },
    { value: "tile-tint", label: "Tint", selected: i === "tile-tint" },
    { value: "tile-scale", label: "Scale", selected: i === "tile-scale" }
  ]);
  m.appendChild(h);
  const y = document.createElement("div");
  y.classList.add("idle-anim__type-fields"), m.appendChild(y);
  function p(w, S) {
    if (y.innerHTML = "", w === "tile-tint") {
      const I = Ui(), O = S.fromColor ?? zn.fromColor, k = S.toColor ?? zn.toColor, M = S.mode ?? zn.mode, x = document.createElement("div");
      x.classList.add("idle-anim__range-row"), x.appendChild(Cr("From", "idle-anim__from-color", O)), x.appendChild(Cr("To", "idle-anim__to-color", k)), y.appendChild(x), y.appendChild(Ct(
        "Mode",
        "idle-anim__mode",
        I.map((R) => ({ value: R, label: R, selected: R === M }))
      ));
    } else if (w === "tile-scale") {
      const I = S.fromScale ?? vs.fromScale, O = S.toScale ?? vs.toScale, k = document.createElement("div");
      k.classList.add("idle-anim__range-row"), k.appendChild(Tt("From", "idle-anim__from-scale", I, { step: "0.01", min: "0.01" })), k.appendChild(Tt("To", "idle-anim__to-scale", O, { step: "0.01", min: "0.01" })), y.appendChild(k);
      const M = document.createElement("p");
      M.classList.add("idle-anim__hint"), M.textContent = "1.0 = original size. Scales from center.", y.appendChild(M);
    } else {
      const I = S.attribute ?? gr.attribute, O = Su(I, e), k = S.from ?? O.from, M = S.to ?? O.to, x = O.step;
      y.appendChild(Ct(
        "Attribute",
        "idle-anim__attribute",
        yc.map((D) => ({ value: D.value, label: D.label, selected: D.value === I }))
      ));
      const R = document.createElement("div");
      R.classList.add("idle-anim__range-row"), R.appendChild(Tt("From", "idle-anim__from", k, { step: x })), R.appendChild(Tt("To", "idle-anim__to", M, { step: x })), y.appendChild(R);
      const F = y.querySelector(".idle-anim__attribute");
      F == null || F.addEventListener("change", () => {
        const D = Su(F.value, e), _ = y.querySelector(".idle-anim__from"), H = y.querySelector(".idle-anim__to");
        _ && (_.value = String(D.from), _.step = D.step), H && (H.value = String(D.to), H.step = D.step);
      });
    }
  }
  c(p, "renderTypeFields"), p(i, t);
  const g = t.period ?? (i === "tile-tint" ? zn.period : gr.period), v = t.easing ?? "easeInOutCosine";
  m.appendChild(Tt("Period (ms)", "idle-anim__period", g, { min: "100", step: "100" })), m.appendChild(Ct(
    "Easing",
    "idle-anim__easing",
    r.map((w) => ({ value: w, label: w, selected: w === v }))
  )), a.appendChild(m);
  const b = a.querySelector(".idle-anim__type");
  return b == null || b.addEventListener("change", () => {
    const w = b.value;
    p(w, w === "tile-tint" ? zn : w === "tile-scale" ? vs : gr);
  }), o.addEventListener("click", (w) => {
    if (!w.target.closest(".idle-anim__slot-remove") && (a.classList.toggle("is-collapsed"), a.classList.contains("is-collapsed"))) {
      const S = Zf(a);
      S && (u.textContent = Cu(S));
    }
  }), d.addEventListener("click", (w) => {
    w.stopPropagation();
    const S = a.parentElement;
    a.remove(), S && Nb(S);
  }), a;
}
c(Tu, "buildSlot");
function Nb(e) {
  e.querySelectorAll(".idle-anim__slot").forEach((n, i) => {
    n.dataset.index = String(i);
    const r = n.querySelector(".idle-anim__slot-title");
    r && (r.textContent = `Animation ${i + 1}`);
  });
}
c(Nb, "renumberSlots$1");
function _b(e) {
  const t = hc(e), n = document.createElement("section");
  n.classList.add("eidolon-idle-animation");
  const i = document.createElement("div");
  i.classList.add("idle-anim__slots");
  for (let l = 0; l < t.length; l++)
    i.appendChild(Tu(e, t[l], l));
  n.appendChild(i);
  const r = document.createElement("button");
  r.type = "button", r.classList.add("idle-anim__add"), r.innerHTML = '<i class="fa-solid fa-plus"></i> Add Animation', r.addEventListener("click", () => {
    const l = i.querySelectorAll(".idle-anim__slot").length, u = Tu(e, gr, l);
    u.classList.remove("is-collapsed"), i.appendChild(u);
  }), n.appendChild(r);
  const a = document.createElement("div");
  a.classList.add("idle-anim__actions");
  const o = document.createElement("button");
  o.type = "button", o.classList.add("idle-anim__preview"), o.innerHTML = '<i class="fa-solid fa-play"></i> Preview All';
  const s = document.createElement("button");
  return s.type = "button", s.classList.add("idle-anim__save"), s.innerHTML = '<i class="fa-solid fa-save"></i> Save', a.append(o, s), n.appendChild(a), n;
}
c(_b, "buildTabContent");
function Zf(e) {
  var l, u, d, m, h, y, p, g, v, b, w, S;
  const t = e.querySelector(".idle-anim__type"), n = (t == null ? void 0 : t.value) ?? "tile-prop", i = Number.parseInt((l = e.querySelector(".idle-anim__period")) == null ? void 0 : l.value, 10), r = ((u = e.querySelector(".idle-anim__easing")) == null ? void 0 : u.value) ?? "easeInOutCosine";
  if (!i || i <= 0) return null;
  if (n === "tile-tint") {
    const I = ((d = e.querySelector(".idle-anim__from-color")) == null ? void 0 : d.value) ?? ((m = e.querySelector(".idle-anim__from-color-text")) == null ? void 0 : m.value) ?? zn.fromColor, O = ((h = e.querySelector(".idle-anim__to-color")) == null ? void 0 : h.value) ?? ((y = e.querySelector(".idle-anim__to-color-text")) == null ? void 0 : y.value) ?? zn.toColor, k = ((p = e.querySelector(".idle-anim__mode")) == null ? void 0 : p.value) ?? "oklch";
    return { type: "tile-tint", fromColor: I, toColor: O, mode: k, period: i, easing: r };
  }
  if (n === "tile-scale") {
    const I = Number.parseFloat((g = e.querySelector(".idle-anim__from-scale")) == null ? void 0 : g.value), O = Number.parseFloat((v = e.querySelector(".idle-anim__to-scale")) == null ? void 0 : v.value);
    return Number.isNaN(I) || Number.isNaN(O) || I <= 0 || O <= 0 ? null : { type: "tile-scale", fromScale: I, toScale: O, period: i, easing: r };
  }
  const a = ((b = e.querySelector(".idle-anim__attribute")) == null ? void 0 : b.value) ?? gr.attribute, o = Number.parseFloat((w = e.querySelector(".idle-anim__from")) == null ? void 0 : w.value), s = Number.parseFloat((S = e.querySelector(".idle-anim__to")) == null ? void 0 : S.value);
  return Number.isNaN(o) || Number.isNaN(s) ? null : { type: "tile-prop", attribute: a, from: o, to: s, period: i, easing: r };
}
c(Zf, "readSlotConfig");
function Lu(e) {
  const t = e.querySelectorAll(".idle-anim__slot"), n = [];
  for (const i of t) {
    const r = Zf(i);
    r && n.push(r);
  }
  return n;
}
c(Lu, "readAllFormValues");
function $b(e, t) {
  var s;
  const n = kt(t);
  if (!n) return;
  const i = Mb(e);
  if (!i) return;
  const r = oc(e, n, Ab, "Animations", kb);
  if (!r || r.querySelector(".eidolon-idle-animation")) return;
  r.appendChild(_b(i)), (s = e.setPosition) == null || s.call(e, { height: "auto" });
  const a = r.querySelector(".idle-anim__preview");
  a == null || a.addEventListener("click", () => {
    const l = i.object;
    if (!l) return;
    if (Eu(i.id)) {
      Sr(i.id), a.classList.remove("is-active"), a.innerHTML = '<i class="fa-solid fa-play"></i> Preview All';
      return;
    }
    const u = Lu(r);
    u.length !== 0 && (pc(l, u), a.classList.add("is-active"), a.innerHTML = '<i class="fa-solid fa-stop"></i> Stop');
  });
  const o = r.querySelector(".idle-anim__save");
  o == null || o.addEventListener("click", async () => {
    var u;
    Eu(i.id) && (Sr(i.id), a && (a.classList.remove("is-active"), a.innerHTML = '<i class="fa-solid fa-play"></i> Preview All'));
    const l = Lu(r);
    l.length > 0 ? (await i.update({ [`flags.${ys}.-=${bs}`]: null }), await i.update({ [`flags.${ys}.${bs}`]: l })) : await i.update({ [`flags.${ys}.-=${bs}`]: null }), (u = ui.notifications) == null || u.info("Idle animations saved.");
  });
}
c($b, "renderAnimationTab");
const Db = "eidolon-utilities", Iu = "idle-animation";
function Fb() {
  var t;
  Ob();
  const e = (t = canvas.tiles) == null ? void 0 : t.placeables;
  if (Array.isArray(e))
    for (const n of e) {
      const i = hc(n.document);
      i.length > 0 && pc(n, i);
    }
}
c(Fb, "onCanvasReady$1");
function xb(e, t) {
  var r;
  const n = (r = t == null ? void 0 : t.flags) == null ? void 0 : r[Db];
  if (!n || !(Iu in n || `-=${Iu}` in n)) return;
  const i = hc(e);
  i.length > 0 && e.object ? pc(e.object, i) : Sr(e.id);
}
c(xb, "onUpdateTile$1");
function Pb(e) {
  Sr(e.id);
}
c(Pb, "onDeleteTile$1");
function Rb(e, t) {
  $b(e, t);
}
c(Rb, "onRenderTileConfig$1");
function Hb() {
  Hooks.on("canvasReady", Fb), Hooks.on("updateTile", xb), Hooks.on("deleteTile", Pb), Hooks.on("renderTileConfig", Rb);
}
c(Hb, "registerIdleAnimationHooks");
Hb();
const em = "eidolon-utilities", qb = "tile-interactions", tn = /* @__PURE__ */ new Map(), pi = /* @__PURE__ */ new Map(), Ou = /* @__PURE__ */ new WeakMap(), pr = /* @__PURE__ */ new Set();
let In = null, Lt = null, It = null, Rt = null;
function tm(e) {
  if (!e) return null;
  if (!Array.isArray(e) && typeof e == "object") {
    const t = Array.isArray(e.idle) && e.idle.length ? e.idle : null, n = Array.isArray(e.enter) && e.enter.length ? e.enter : null;
    return !t && !n ? null : { idle: t, enter: n };
  }
  return Array.isArray(e) && e.length ? { idle: null, enter: e } : null;
}
c(tm, "parseHoverConfig");
function nm(e) {
  var t;
  return ((t = e == null ? void 0 : e.getFlag) == null ? void 0 : t.call(e, em, qb)) ?? null;
}
c(nm, "getInteractionFlag");
function im(e) {
  const t = canvas.activeLayer;
  if (!t) return null;
  const n = t.toLocal(e);
  return !n || Number.isNaN(n.x) || Number.isNaN(n.y) ? null : n;
}
c(im, "canvasToLocal");
function rm(e) {
  let t = null, n = -1 / 0;
  for (const [i, r] of tn)
    if (Vl(r.doc, e)) {
      const a = r.doc.sort ?? 0;
      a > n && (t = r, n = a);
    }
  return t;
}
c(rm, "hitTest");
function jb(e) {
  return {
    idle: e.idle ?? ["none"],
    hover: e.enter ?? ["none"]
  };
}
c(jb, "buildAnimatorConfig");
function bc(e, t, n) {
  Jr(e);
  const i = jb(n), r = new Gi(t, i);
  r.start("idle"), pi.set(e, r);
}
c(bc, "startHoverAnimator");
function Jr(e) {
  const t = pi.get(e);
  t && (t.detach(), pi.delete(e));
}
c(Jr, "stopHoverAnimator");
function ws(e, t, n, i) {
  return t.type === "tile-tint" ? { uuid: e, toColor: n ? t.toColor : t.fromColor, mode: t.mode } : t.type === "tile-scale" ? {
    uuid: e,
    toScale: n ? t.toScale : t.fromScale,
    ...i
  } : { uuid: e, attribute: t.attribute, value: n ? t.to : t.from };
}
c(ws, "buildClickParams");
function Bb(e) {
  const t = e._source.width, n = e._source.height, i = e._source.x, r = e._source.y;
  return {
    baseWidth: t,
    baseHeight: n,
    centerX: i + t / 2,
    centerY: r + n / 2
  };
}
c(Bb, "captureRefGeometry");
async function Ub(e, t) {
  const n = e.uuid, i = t.type ?? "tile-prop", r = yi(i);
  if (!r) {
    console.warn(`[${em}] tile-interactions: unknown tween type "${i}"`);
    return;
  }
  const a = t.period ?? 300, o = t.easing ?? "easeOutCubic", s = t.mode ?? "bounce", l = i === "tile-scale" ? Bb(e) : null;
  if (s === "toggle") {
    const d = !(Ou.get(e) ?? !1);
    await r.execute(
      ws(n, t, d, l),
      { durationMS: a, easing: o, commit: !0 }
    ), Ou.set(e, d);
  } else {
    const u = a / 2;
    await r.execute(
      ws(n, t, !0, l),
      { durationMS: u, easing: o, commit: !1 }
    ), await r.execute(
      ws(n, t, !1, l),
      { durationMS: u, easing: o, commit: !1 }
    );
  }
}
c(Ub, "playClickAnimation");
async function Vb(e) {
  var n;
  const t = e.doc.id;
  if (!pr.has(t)) {
    pr.add(t);
    try {
      Jr(t);
      const i = e.clickConfig.map((r) => Ub(e.doc, r));
      await Promise.all(i);
    } finally {
      pr.delete(t), e.hoverConfig && (bc(t, e.placeable, e.hoverConfig), In === t && ((n = pi.get(t)) == null || n.setState("hover")));
    }
  }
}
c(Vb, "handleClick");
function am(e) {
  var r;
  const t = im(e);
  if (!t) return;
  const n = rm(t), i = (n == null ? void 0 : n.doc.id) ?? null;
  if (i !== In) {
    if (In) {
      const a = pi.get(In);
      a && a.setState("idle");
    }
    if (i) {
      const a = pi.get(i);
      a && a.setState("hover");
    }
    In = i, i && (n.hoverConfig || (r = n.clickConfig) != null && r.length) ? (Lt === null && (Lt = document.body.style.cursor), document.body.style.cursor = "pointer") : Lt !== null && (document.body.style.cursor = Lt, Lt = null);
  }
}
c(am, "onPointerMove");
function om(e) {
  var i;
  if (e.button !== 0) return;
  const t = im(e);
  if (!t) return;
  const n = rm(t);
  !n || !((i = n.clickConfig) != null && i.length) || Vb(n);
}
c(om, "onPointerDown");
function zb() {
  var n;
  for (const i of pi.keys())
    Jr(i);
  tn.clear(), pr.clear(), In = null, Lt !== null && (document.body.style.cursor = Lt, Lt = null);
  const e = document.getElementById("board");
  It && (e == null || e.removeEventListener("pointermove", It), It = null), Rt && (e == null || e.removeEventListener("pointerdown", Rt), Rt = null);
  const t = (n = canvas.tiles) == null ? void 0 : n.placeables;
  if (Array.isArray(t)) {
    for (const i of t) {
      const r = i.document, a = nm(r);
      if (!a) continue;
      const o = tm(a.hover), s = Array.isArray(a.click) && a.click.length ? a.click : null;
      !o && !s || (tn.set(r.id, { doc: r, placeable: i, hoverConfig: o, clickConfig: s }), o && bc(r.id, i, o));
    }
    tn.size !== 0 && (It = am, Rt = om, e == null || e.addEventListener("pointermove", It), e == null || e.addEventListener("pointerdown", Rt));
  }
}
c(zb, "rebuild");
function Gb(e) {
  const t = e.id, n = nm(e), i = n ? tm(n.hover) : null, r = n && Array.isArray(n.click) && n.click.length ? n.click : null;
  if (!i && !r) {
    sm(e);
    return;
  }
  Jr(t);
  const a = e.object;
  if (!a) {
    tn.delete(t);
    return;
  }
  tn.set(t, { doc: e, placeable: a, hoverConfig: i, clickConfig: r }), i && bc(t, a, i), Wb();
}
c(Gb, "updateTile");
function sm(e) {
  const t = e.id;
  if (Jr(t), tn.delete(t), pr.delete(t), In === t && (In = null, Lt !== null && (document.body.style.cursor = Lt, Lt = null)), tn.size === 0) {
    const n = document.getElementById("board");
    It && (n == null || n.removeEventListener("pointermove", It), It = null), Rt && (n == null || n.removeEventListener("pointerdown", Rt), Rt = null);
  }
}
c(sm, "removeTile");
function Wb() {
  if (tn.size === 0 || It) return;
  const e = document.getElementById("board");
  e && (It = am, Rt = om, e.addEventListener("pointermove", It), e.addEventListener("pointerdown", Rt));
}
c(Wb, "ensureListeners");
const Gl = "eidolon-utilities", Wl = "tile-interactions", Kb = "eidolon-idle-animation", Jb = "fa-solid fa-wave-pulse", lm = [
  { value: "float", label: "Float" },
  { value: "pulse", label: "Pulse" },
  { value: "scale", label: "Scale" },
  { value: "glow", label: "Glow" },
  { value: "wobble", label: "Wobble" },
  { value: "colorCycle", label: "Color Cycle" },
  { value: "spin", label: "Spin" },
  { value: "bounce", label: "Bounce" },
  { value: "borderTrace", label: "Border Trace" },
  { value: "shimmer", label: "Shimmer" }
], cm = {
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
  ]
}, Ti = {
  attribute: "alpha",
  from: 1,
  to: 0.5,
  period: 300,
  mode: "bounce"
}, ki = {
  fromColor: "#ffffff",
  toColor: "#ffaa00",
  period: 500,
  mode: "bounce"
}, Aa = {
  type: "tile-scale",
  fromScale: 1,
  toScale: 1.2,
  period: 300,
  easing: "easeOutCubic",
  mode: "bounce"
}, um = [
  { value: "alpha", label: "Alpha (Opacity)" },
  { value: "rotation", label: "Rotation" },
  { value: "texture.rotation", label: "Texture Rotation" }
];
function Yb(e) {
  var t;
  return (e == null ? void 0 : e.document) ?? ((t = e == null ? void 0 : e.object) == null ? void 0 : t.document) ?? (e == null ? void 0 : e.object) ?? null;
}
c(Yb, "getTileDocument");
function Xb(e) {
  var r;
  const t = (r = e == null ? void 0 : e.getFlag) == null ? void 0 : r.call(e, Gl, Wl);
  if (!t) return { hoverIdle: [], hoverEnter: [], click: [] };
  let n = [], i = [];
  return t.hover && (Array.isArray(t.hover) ? i = t.hover : typeof t.hover == "object" && (n = Array.isArray(t.hover.idle) ? t.hover.idle : [], i = Array.isArray(t.hover.enter) ? t.hover.enter : [])), {
    hoverIdle: n,
    hoverEnter: i,
    click: Array.isArray(t.click) ? t.click : []
  };
}
c(Xb, "getInteractionConfigs");
function Au(e) {
  if (!e) return "";
  const t = e.name ?? "float", n = lm.find((i) => i.value === t);
  return (n == null ? void 0 : n.label) ?? t;
}
c(Au, "summarizeHoverConfig");
function ua(e, t, n, i) {
  const r = e.name ?? "float", a = Bo(), o = document.createElement("div");
  o.classList.add("idle-anim__slot", "is-collapsed", n), o.dataset.index = String(t);
  const s = document.createElement("div");
  s.classList.add("idle-anim__slot-header");
  const l = document.createElement("i");
  l.classList.add("fa-solid", "fa-chevron-right", "idle-anim__slot-chevron");
  const u = document.createElement("span");
  u.classList.add("idle-anim__slot-title"), u.textContent = `${i} ${t + 1}`;
  const d = document.createElement("span");
  d.classList.add("idle-anim__slot-summary"), d.textContent = Au(e);
  const m = document.createElement("button");
  m.type = "button", m.classList.add("idle-anim__slot-remove"), m.innerHTML = '<i class="fa-solid fa-xmark"></i>', m.title = "Remove effect", s.append(l, u, d, m), o.appendChild(s);
  const h = document.createElement("div");
  h.classList.add("idle-anim__slot-body");
  const y = Ct(
    "Behaviour",
    "ti-hover__behaviour",
    lm.map((b) => ({ value: b.value, label: b.label, selected: b.value === r }))
  );
  h.appendChild(y);
  const p = document.createElement("div");
  p.classList.add("idle-anim__type-fields"), h.appendChild(p);
  function g(b, w) {
    p.innerHTML = "";
    const S = cm[b];
    if (S)
      for (const I of S) {
        const O = w[I.key] ?? I.default;
        I.type === "color" ? p.appendChild(Cr(I.label, `ti-hover__${I.key}`, O)) : I.type === "select" && I.key === "easing" ? p.appendChild(Ct(
          I.label,
          `ti-hover__${I.key}`,
          a.map((k) => ({ value: k, label: k, selected: k === O }))
        )) : p.appendChild(Tt(I.label, `ti-hover__${I.key}`, O, I.attrs ?? {}));
      }
  }
  c(g, "renderParams"), g(r, e), o.appendChild(h);
  const v = o.querySelector(".ti-hover__behaviour");
  return v == null || v.addEventListener("change", () => {
    g(v.value, {});
  }), s.addEventListener("click", (b) => {
    if (!b.target.closest(".idle-anim__slot-remove") && (o.classList.toggle("is-collapsed"), o.classList.contains("is-collapsed"))) {
      const w = dm(o);
      w && (d.textContent = Au(w));
    }
  }), m.addEventListener("click", (b) => {
    b.stopPropagation();
    const w = o.parentElement;
    o.remove(), w && mm(w, n, i);
  }), o;
}
c(ua, "buildHoverSlot");
function dm(e) {
  var r;
  const t = ((r = e.querySelector(".ti-hover__behaviour")) == null ? void 0 : r.value) ?? "float", n = cm[t], i = { name: t };
  if (n)
    for (const a of n) {
      const o = e.querySelector(`.ti-hover__${a.key}`);
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
c(dm, "readHoverSlot");
function ku(e) {
  if (!e) return "";
  const t = e.type ?? "tile-prop", n = e.mode ?? "bounce", i = n.charAt(0).toUpperCase() + n.slice(1);
  if (t === "tile-tint")
    return `${i} Tint ${e.fromColor ?? "?"} → ${e.toColor ?? "?"} (${e.period ?? "?"}ms)`;
  if (t === "tile-scale") {
    const o = e.fromScale != null ? `${Math.round(e.fromScale * 100)}%` : "?", s = e.toScale != null ? `${Math.round(e.toScale * 100)}%` : "?";
    return `${i} Scale ${o} → ${s} (${e.period ?? "?"}ms)`;
  }
  const r = um.find((o) => o.value === e.attribute), a = (r == null ? void 0 : r.label) ?? e.attribute ?? "?";
  return `${i} ${a} ${e.from ?? "?"} → ${e.to ?? "?"} (${e.period ?? "?"}ms)`;
}
c(ku, "summarizeClickConfig");
function Mu(e, t) {
  const n = e.type ?? "tile-prop", i = e.mode ?? "bounce", r = Bo(), a = document.createElement("div");
  a.classList.add("idle-anim__slot", "is-collapsed", "ti-click-slot"), a.dataset.index = String(t);
  const o = document.createElement("div");
  o.classList.add("idle-anim__slot-header");
  const s = document.createElement("i");
  s.classList.add("fa-solid", "fa-chevron-right", "idle-anim__slot-chevron");
  const l = document.createElement("span");
  l.classList.add("idle-anim__slot-title"), l.textContent = `Animation ${t + 1}`;
  const u = document.createElement("span");
  u.classList.add("idle-anim__slot-summary"), u.textContent = ku(e);
  const d = document.createElement("button");
  d.type = "button", d.classList.add("idle-anim__slot-remove"), d.innerHTML = '<i class="fa-solid fa-xmark"></i>', d.title = "Remove animation", o.append(s, l, u, d), a.appendChild(o);
  const m = document.createElement("div");
  m.classList.add("idle-anim__slot-body");
  const h = document.createElement("div");
  h.classList.add("idle-anim__range-row"), h.appendChild(Ct("Mode", "ti-click__mode", [
    { value: "bounce", label: "Bounce", selected: i === "bounce" },
    { value: "toggle", label: "Toggle", selected: i === "toggle" }
  ])), h.appendChild(Ct("Type", "ti-click__type", [
    { value: "tile-prop", label: "Numeric", selected: n === "tile-prop" },
    { value: "tile-tint", label: "Tint", selected: n === "tile-tint" },
    { value: "tile-scale", label: "Scale", selected: n === "tile-scale" }
  ])), m.appendChild(h);
  const y = document.createElement("div");
  y.classList.add("idle-anim__type-fields"), m.appendChild(y);
  function p(w, S) {
    if (y.innerHTML = "", w === "tile-tint") {
      const I = Ui(), O = S.fromColor ?? ki.fromColor, k = S.toColor ?? ki.toColor, M = S.mode ?? "oklch", x = document.createElement("div");
      x.classList.add("idle-anim__range-row"), x.appendChild(Cr("From", "ti-click__from-color", O)), x.appendChild(Cr("To", "ti-click__to-color", k)), y.appendChild(x), y.appendChild(Ct(
        "Interpolation",
        "ti-click__color-mode",
        I.map((R) => ({ value: R, label: R, selected: R === M }))
      ));
    } else if (w === "tile-scale") {
      const I = S.fromScale ?? Aa.fromScale, O = S.toScale ?? Aa.toScale, k = document.createElement("div");
      k.classList.add("idle-anim__range-row"), k.appendChild(Tt("From", "ti-click__from-scale", I, { step: "0.01", min: "0.01" })), k.appendChild(Tt("To", "ti-click__to-scale", O, { step: "0.01", min: "0.01" })), y.appendChild(k);
      const M = document.createElement("p");
      M.classList.add("idle-anim__hint"), M.textContent = "1.0 = original size. Scales from center.", y.appendChild(M);
    } else {
      const I = S.attribute ?? Ti.attribute, O = S.from ?? Ti.from, k = S.to ?? Ti.to;
      y.appendChild(Ct(
        "Attribute",
        "ti-click__attribute",
        um.map((x) => ({ value: x.value, label: x.label, selected: x.value === I }))
      ));
      const M = document.createElement("div");
      M.classList.add("idle-anim__range-row"), M.appendChild(Tt("From", "ti-click__from", O, { step: "0.01" })), M.appendChild(Tt("To", "ti-click__to", k, { step: "0.01" })), y.appendChild(M);
    }
  }
  c(p, "renderTypeFields"), p(n, e);
  const g = e.period ?? (n === "tile-tint" ? ki.period : Ti.period), v = e.easing ?? "easeOutCubic";
  m.appendChild(Tt("Period (ms)", "ti-click__period", g, { min: "50", step: "50" })), m.appendChild(Ct(
    "Easing",
    "ti-click__easing",
    r.map((w) => ({ value: w, label: w, selected: w === v }))
  )), a.appendChild(m);
  const b = a.querySelector(".ti-click__type");
  return b == null || b.addEventListener("change", () => {
    const w = b.value;
    p(w, w === "tile-tint" ? ki : w === "tile-scale" ? Aa : Ti);
  }), o.addEventListener("click", (w) => {
    if (!w.target.closest(".idle-anim__slot-remove") && (a.classList.toggle("is-collapsed"), a.classList.contains("is-collapsed"))) {
      const S = fm(a);
      S && (u.textContent = ku(S));
    }
  }), d.addEventListener("click", (w) => {
    w.stopPropagation();
    const S = a.parentElement;
    a.remove(), S && mm(S, "ti-click-slot", "Animation");
  }), a;
}
c(Mu, "buildClickSlot");
function fm(e) {
  var u, d, m, h, y, p, g, v, b, w, S, I, O, k;
  const t = ((u = e.querySelector(".ti-click__type")) == null ? void 0 : u.value) ?? "tile-prop", n = ((d = e.querySelector(".ti-click__mode")) == null ? void 0 : d.value) ?? "bounce", i = Number.parseInt((m = e.querySelector(".ti-click__period")) == null ? void 0 : m.value, 10), r = ((h = e.querySelector(".ti-click__easing")) == null ? void 0 : h.value) ?? "easeOutCubic";
  if (!i || i <= 0) return null;
  const a = { mode: n, period: i, easing: r };
  if (t === "tile-tint") {
    const M = ((y = e.querySelector(".ti-click__from-color")) == null ? void 0 : y.value) ?? ((p = e.querySelector(".ti-click__from-color-text")) == null ? void 0 : p.value) ?? ki.fromColor, x = ((g = e.querySelector(".ti-click__to-color")) == null ? void 0 : g.value) ?? ((v = e.querySelector(".ti-click__to-color-text")) == null ? void 0 : v.value) ?? ki.toColor, R = ((b = e.querySelector(".ti-click__color-mode")) == null ? void 0 : b.value) ?? "oklch";
    return { type: "tile-tint", fromColor: M, toColor: x, mode: R, ...a };
  }
  if (t === "tile-scale") {
    const M = Number.parseFloat((w = e.querySelector(".ti-click__from-scale")) == null ? void 0 : w.value), x = Number.parseFloat((S = e.querySelector(".ti-click__to-scale")) == null ? void 0 : S.value);
    return Number.isNaN(M) || Number.isNaN(x) || M <= 0 || x <= 0 ? null : { type: "tile-scale", fromScale: M, toScale: x, ...a };
  }
  const o = ((I = e.querySelector(".ti-click__attribute")) == null ? void 0 : I.value) ?? Ti.attribute, s = Number.parseFloat((O = e.querySelector(".ti-click__from")) == null ? void 0 : O.value), l = Number.parseFloat((k = e.querySelector(".ti-click__to")) == null ? void 0 : k.value);
  return Number.isNaN(s) || Number.isNaN(l) ? null : { type: "tile-prop", attribute: o, from: s, to: l, ...a };
}
c(fm, "readClickSlot");
function mm(e, t, n) {
  e.querySelectorAll(`.${t}`).forEach((r, a) => {
    r.dataset.index = String(a);
    const o = r.querySelector(".idle-anim__slot-title");
    o && (o.textContent = `${n} ${a + 1}`);
  });
}
c(mm, "renumberSlots");
function Qb(e) {
  const { hoverIdle: t, hoverEnter: n, click: i } = Xb(e), r = document.createElement("section");
  r.classList.add("eidolon-tile-interactions");
  const a = document.createElement("h3");
  a.classList.add("ti-section-heading"), a.textContent = "Hover — Idle", r.appendChild(a);
  const o = document.createElement("p");
  o.classList.add("idle-anim__hint"), o.textContent = "Plays continuously. Stops when pointer enters the tile.", r.appendChild(o);
  const s = document.createElement("div");
  s.classList.add("idle-anim__slots", "ti-hover-idle-slots");
  for (let w = 0; w < t.length; w++)
    s.appendChild(ua(t[w], w, "ti-hover-idle-slot", "Effect"));
  r.appendChild(s);
  const l = document.createElement("button");
  l.type = "button", l.classList.add("idle-anim__add"), l.innerHTML = '<i class="fa-solid fa-plus"></i> Add Idle Effect', l.addEventListener("click", () => {
    const w = s.querySelectorAll(".ti-hover-idle-slot").length, S = ua({ name: "float" }, w, "ti-hover-idle-slot", "Effect");
    S.classList.remove("is-collapsed"), s.appendChild(S);
  }), r.appendChild(l);
  const u = document.createElement("h3");
  u.classList.add("ti-section-heading"), u.textContent = "Hover — On Enter", r.appendChild(u);
  const d = document.createElement("p");
  d.classList.add("idle-anim__hint"), d.textContent = "Plays while pointer is over the tile. Stops when pointer leaves.", r.appendChild(d);
  const m = document.createElement("div");
  m.classList.add("idle-anim__slots", "ti-hover-enter-slots");
  for (let w = 0; w < n.length; w++)
    m.appendChild(ua(n[w], w, "ti-hover-enter-slot", "Effect"));
  r.appendChild(m);
  const h = document.createElement("button");
  h.type = "button", h.classList.add("idle-anim__add"), h.innerHTML = '<i class="fa-solid fa-plus"></i> Add Hover Effect', h.addEventListener("click", () => {
    const w = m.querySelectorAll(".ti-hover-enter-slot").length, S = ua({ name: "scale" }, w, "ti-hover-enter-slot", "Effect");
    S.classList.remove("is-collapsed"), m.appendChild(S);
  }), r.appendChild(h);
  const y = document.createElement("h3");
  y.classList.add("ti-section-heading"), y.textContent = "Click Animations", r.appendChild(y);
  const p = document.createElement("div");
  p.classList.add("idle-anim__slots", "ti-click-slots");
  for (let w = 0; w < i.length; w++)
    p.appendChild(Mu(i[w], w));
  r.appendChild(p);
  const g = document.createElement("button");
  g.type = "button", g.classList.add("idle-anim__add"), g.innerHTML = '<i class="fa-solid fa-plus"></i> Add Animation', g.addEventListener("click", () => {
    const w = p.querySelectorAll(".ti-click-slot").length, S = Mu(Aa, w);
    S.classList.remove("is-collapsed"), p.appendChild(S);
  }), r.appendChild(g);
  const v = document.createElement("div");
  v.classList.add("idle-anim__actions");
  const b = document.createElement("button");
  return b.type = "button", b.classList.add("idle-anim__save"), b.innerHTML = '<i class="fa-solid fa-save"></i> Save Interactions', v.appendChild(b), r.appendChild(v), r;
}
c(Qb, "buildSectionContent");
function Nu(e, t) {
  const n = [];
  for (const i of e.querySelectorAll(`.${t}`)) {
    const r = dm(i);
    r && n.push(r);
  }
  return n;
}
c(Nu, "readAllHoverSlots");
function Zb(e) {
  const t = [];
  for (const n of e.querySelectorAll(".ti-click-slot")) {
    const i = fm(n);
    i && t.push(i);
  }
  return t;
}
c(Zb, "readAllClickConfigs");
function ev(e, t) {
  var l;
  const n = kt(t);
  if (!n) return;
  const i = Yb(e);
  if (!i) return;
  const r = oc(e, n, Kb, "Animations", Jb);
  if (!r || r.querySelector(".eidolon-tile-interactions")) return;
  const a = document.createElement("hr");
  a.classList.add("ti-divider"), r.appendChild(a);
  const o = Qb(i);
  r.appendChild(o), (l = e.setPosition) == null || l.call(e, { height: "auto" });
  const s = o.querySelector(".idle-anim__save");
  s == null || s.addEventListener("click", async () => {
    var p;
    const u = Nu(o, "ti-hover-idle-slot"), d = Nu(o, "ti-hover-enter-slot"), m = Zb(o), h = u.length > 0 || d.length > 0, y = h || m.length > 0;
    if (await i.update({ [`flags.${Gl}.-=${Wl}`]: null }), y) {
      const g = {};
      h && (g.hover = {}, u.length > 0 && (g.hover.idle = u), d.length > 0 && (g.hover.enter = d)), m.length > 0 && (g.click = m), await i.update({ [`flags.${Gl}.${Wl}`]: g });
    }
    (p = ui.notifications) == null || p.info("Tile interactions saved.");
  });
}
c(ev, "renderInteractionSection");
const tv = "eidolon-utilities", _u = "tile-interactions";
function nv() {
  zb();
}
c(nv, "onCanvasReady");
function iv(e, t) {
  var i;
  const n = (i = t == null ? void 0 : t.flags) == null ? void 0 : i[tv];
  !n || !(_u in n || `-=${_u}` in n) || Gb(e);
}
c(iv, "onUpdateTile");
function rv(e) {
  sm(e);
}
c(rv, "onDeleteTile");
function av(e, t) {
  ev(e, t);
}
c(av, "onRenderTileConfig");
function ov() {
  Hooks.on("canvasReady", nv), Hooks.on("updateTile", iv), Hooks.on("deleteTile", rv), Hooks.on("renderTileConfig", av);
}
c(ov, "registerTileInteractionHooks");
ov();
//# sourceMappingURL=eidolon-utilities.js.map
