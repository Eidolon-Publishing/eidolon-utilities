var Ac = Object.defineProperty;
var hm = Object.getPrototypeOf;
var pm = Reflect.get;
var kc = (e) => {
  throw TypeError(e);
};
var ym = (e, t, n) => t in e ? Ac(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var c = (e, t) => Ac(e, "name", { value: t, configurable: !0 });
var pe = (e, t, n) => ym(e, typeof t != "symbol" ? t + "" : t, n), Qa = (e, t, n) => t.has(e) || kc("Cannot " + n);
var f = (e, t, n) => (Qa(e, t, "read from private field"), n ? n.call(e) : t.get(e)), A = (e, t, n) => t.has(e) ? kc("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, n), L = (e, t, n, i) => (Qa(e, t, "write to private field"), i ? i.call(e, n) : t.set(e, n), n), C = (e, t, n) => (Qa(e, t, "access private method"), n);
var Xa = (e, t, n, i) => ({
  set _(r) {
    L(e, t, r, n);
  },
  get _() {
    return f(e, t, i);
  }
}), $e = (e, t, n) => pm(hm(e), n, t);
const T = "eidolon-utilities", Mo = "timeTriggerActive", Es = "timeTriggerHideWindow", Ss = "timeTriggerShowPlayerWindow", Cs = "timeTriggerAllowRealTime", qu = "timeTriggers", fo = "timeTriggerHistory", Ts = "debug", Ls = "timeFormat", Is = "manageTime", Os = "secondsPerRound";
const bm = [-30, -15, -5, 5, 15, 30], ki = 1440 * 60, mo = "playSound", Vr = 6;
function E(e, t) {
  var n, i;
  return (i = (n = game.i18n) == null ? void 0 : n.has) != null && i.call(n, e) ? game.i18n.localize(e) : t;
}
c(E, "localize");
function It(e) {
  return typeof e != "string" ? "" : e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
c(It, "escapeHtml");
function Ht(e) {
  var t;
  return e == null ? e : (t = foundry == null ? void 0 : foundry.utils) != null && t.duplicate ? foundry.utils.duplicate(e) : JSON.parse(JSON.stringify(e));
}
c(Ht, "duplicateData");
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
  const i = Number(n[1]), r = Number(n[2]), o = n[3] !== void 0 ? Number(n[3]) : 0;
  return !Number.isInteger(i) || !Number.isInteger(r) || !Number.isInteger(o) || i < 0 || i > 23 || r < 0 || r > 59 || o < 0 || o > 59 ? null : i * 3600 + r * 60 + o;
}
c(ju, "parseTriggerTimeToSeconds");
function nr() {
  var e, t;
  return ((e = game.scenes) == null ? void 0 : e.current) ?? ((t = game.scenes) == null ? void 0 : t.active) ?? null;
}
c(nr, "getActiveScene");
function qt(e) {
  return (e == null ? void 0 : e.object) ?? (e == null ? void 0 : e.document) ?? null;
}
c(qt, "getSceneFromApplication");
function Ue(e) {
  return e && typeof e.getFlag == "function" && typeof e.setFlag == "function";
}
c(Ue, "hasSceneDocument");
const As = /* @__PURE__ */ new Set(), ks = /* @__PURE__ */ new Set(), Ms = /* @__PURE__ */ new Set(), Ns = /* @__PURE__ */ new Set();
let li = !1, yr = !1, No = Vr, _o = "12h", Mc = !1;
function Za(e) {
  li = !!e;
  for (const t of As)
    try {
      t(li);
    } catch (n) {
      console.error(`${T} | Debug change handler failed`, n);
    }
}
c(Za, "notifyDebugChange");
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
  No = t;
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
  _o = t;
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
    onChange: e ? void 0 : Za
  }), e && game.settings.registerChange(T, Ts, Za), li = Jl(), Za(li), game.settings.register(T, Is, {
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
  ), No = Kl(Cm()), ts(No), game.settings.register(T, Ls, {
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
  }), e && game.settings.registerChange(T, Ls, ns), _o = Bu(Uu()), ns(_o);
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
  return li = Jl(), li;
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
    e(li);
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
    e(_o);
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
    e(No);
  } catch (t) {
    console.error(`${T} | Seconds-per-round change handler failed`, t);
  }
  return () => {
    Ms.delete(e);
  };
}
c(Lm, "onSecondsPerRoundSettingChange");
let _a = !1, _s = !1;
function $s(e) {
  _a = !!e;
}
c($s, "updateDebugState");
function zu() {
  _s || (_s = !0, $s(Jl()), Tm((e) => {
    $s(e), console.info(`${T} | Debug ${_a ? "enabled" : "disabled"}`);
  }));
}
c(zu, "ensureInitialized");
function Ql() {
  return _s || zu(), _a;
}
c(Ql, "shouldLog");
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
  return $s(Em()), _a;
}
c(Om, "syncDebugState");
function N(...e) {
  Ql() && console.debug(...Gu(e));
}
c(N, "debugLog");
function ji(...e) {
  Ql() && console.group(...Gu(e));
}
c(ji, "debugGroup");
function Sn() {
  Ql() && console.groupEnd();
}
c(Sn, "debugGroupEnd");
function Mi(e) {
  var r;
  const t = (r = e == null ? void 0 : e.getFlag) == null ? void 0 : r.call(e, T, qu);
  if (!t) return [];
  const n = Ht(t), i = Array.isArray(n) ? n : [];
  return N("Loaded time triggers", {
    sceneId: (e == null ? void 0 : e.id) ?? null,
    count: i.length
  }), i;
}
c(Mi, "getTimeTriggers");
async function Wu(e, t) {
  e != null && e.setFlag && (N("Persisting time triggers", {
    sceneId: e.id,
    count: Array.isArray(t) ? t.length : 0
  }), await e.setFlag(T, qu, t));
}
c(Wu, "setTimeTriggers");
function Am(e) {
  var r;
  const t = (r = e == null ? void 0 : e.getFlag) == null ? void 0 : r.call(e, T, fo);
  if (!t) return {};
  const n = Ht(t);
  if (!n || typeof n != "object") return {};
  const i = {};
  for (const [o, a] of Object.entries(n))
    typeof a == "number" && Number.isFinite(a) && (i[o] = a);
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
    for (const [g, y] of Object.entries(t))
      typeof y == "number" && Number.isFinite(y) && (n[g] = y);
  const i = ((l = e.getFlag) == null ? void 0 : l.call(e, T, fo)) ?? {}, r = {};
  if (i && typeof i == "object")
    for (const [g, y] of Object.entries(i))
      typeof y == "number" && Number.isFinite(y) && (r[g] = y);
  const o = Object.keys(n), a = Object.keys(r);
  if (typeof ((u = foundry == null ? void 0 : foundry.utils) == null ? void 0 : u.deepEqual) == "function" ? foundry.utils.deepEqual(r, n) : JSON.stringify(r) === JSON.stringify(n)) {
    N("Skip history update because state is unchanged", {
      sceneId: (e == null ? void 0 : e.id) ?? null
    });
    return;
  }
  N("Updating time trigger history", {
    sceneId: (e == null ? void 0 : e.id) ?? null,
    keys: o,
    removedKeys: a.filter((g) => !o.includes(g))
  });
  try {
    a.length && typeof e.unsetFlag == "function" && await e.unsetFlag(T, fo), o.length && await e.setFlag(T, fo, n);
  } catch (g) {
    console.error(`${T} | Failed to persist time trigger history`, g), (m = (d = ui.notifications) == null ? void 0 : d.error) == null || m.call(
      d,
      E(
        "EIDOLON.TimeTrigger.HistoryPersistError",
        "Failed to persist the scene's time trigger history."
      )
    );
  }
}
c(is, "updateTimeTriggerHistory");
const $o = /* @__PURE__ */ new Map(), Nc = /* @__PURE__ */ new Set();
function km(e) {
  if (!(e != null && e.id))
    throw new Error(`${T} | Action definitions require an id.`);
  if ($o.has(e.id))
    throw new Error(`${T} | Duplicate time trigger action id: ${e.id}`);
  $o.set(e.id, {
    ...e
  }), N("Registered time trigger action", { actionId: e.id });
}
c(km, "registerAction");
function zr(e) {
  return $o.get(e) ?? null;
}
c(zr, "getAction");
function Mm(e) {
  const t = zr(e);
  return t ? typeof t.label == "function" ? t.label() : t.label : e;
}
c(Mm, "getActionLabel");
function _c() {
  return Array.from($o.values());
}
c(_c, "listActions");
async function Ku(e, t) {
  var i, r;
  const n = zr(t == null ? void 0 : t.action);
  if (!n || typeof n.execute != "function") {
    const o = E(
      "EIDOLON.TimeTrigger.UnknownAction",
      "Encountered an unknown time trigger action and skipped it."
    );
    (r = (i = ui.notifications) == null ? void 0 : i.warn) == null || r.call(i, o), console.warn(`${T} | Unknown time trigger action`, t), N("Encountered unknown time trigger action", {
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
  return !t || typeof t.buildSummaryParts != "function" ? [] : t.buildSummaryParts({ trigger: e, escapeHtml: It, localize: E }) ?? [];
}
c(Nm, "buildActionSummaryParts");
function _m(e) {
  const t = zr(e == null ? void 0 : e.action);
  return !t || typeof t.buildFormContent != "function" ? "" : t.buildFormContent({ trigger: e, escapeHtml: It, localize: E }) ?? "";
}
c(_m, "buildActionFormSection");
function $m(e, t) {
  const n = zr(e == null ? void 0 : e.action);
  !n || typeof n.prepareFormData != "function" || n.prepareFormData({ trigger: e, formData: t });
}
c($m, "applyActionFormData");
function Dm(e, t, n) {
  var o, a;
  const i = `${(e == null ? void 0 : e.id) ?? "unknown"}:${(t == null ? void 0 : t.id) ?? (t == null ? void 0 : t.action) ?? "unknown"}:${n}`;
  if (Nc.has(i)) return;
  Nc.add(i);
  const r = E(
    "EIDOLON.TimeTrigger.MissingDataWarning",
    "A scene time trigger is missing required data and was skipped."
  );
  (a = (o = ui.notifications) == null ? void 0 : o.warn) == null || a.call(o, r), console.warn(`${T} | Missing trigger data (${n})`, { scene: e == null ? void 0 : e.id, trigger: t });
}
c(Dm, "warnMissingTriggerData");
async function Fm({ scene: e, trigger: t }) {
  var o, a, s, l, u;
  const n = (s = (a = (o = t == null ? void 0 : t.data) == null ? void 0 : o.path) == null ? void 0 : a.trim) == null ? void 0 : s.call(a);
  if (!n) {
    Dm(e, t, "missing-audio-path");
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
  id: mo,
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
    ), o = t(
      n(
        "EIDOLON.TimeTrigger.TriggerSoundNotes",
        "Select or upload the audio file that should play when this trigger fires."
      )
    ), a = t(((s = e == null ? void 0 : e.data) == null ? void 0 : s.path) ?? "");
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
  prepareFormData: /* @__PURE__ */ c(({ trigger: e, formData: t }) => {
    var n, i;
    e.data.path = ((i = (n = t.playSoundPath) == null ? void 0 : n.trim) == null ? void 0 : i.call(n)) ?? "";
  }, "prepareFormData")
});
var $u;
const { ApplicationV2: $n, HandlebarsApplicationMixin: Dn } = (($u = foundry.applications) == null ? void 0 : $u.api) ?? {};
if (!$n || !Dn)
  throw new Error(
    `${T} | ApplicationV2 API unavailable. Update Foundry VTT to v13 or newer.`
  );
const In = "AM", ci = "PM";
function Cn() {
  return Uu();
}
c(Cn, "getConfiguredTimeFormat");
function $a(e) {
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
c($a, "parseCanonicalTimeString");
function xt({ hours: e, minutes: t, seconds: n }) {
  if (!Number.isInteger(e) || !Number.isInteger(t) || e < 0 || e > 23 || t < 0 || t > 59) return null;
  const i = String(e).padStart(2, "0"), r = String(t).padStart(2, "0");
  if (Number.isInteger(n)) {
    if (n < 0 || n > 59) return null;
    const o = String(n).padStart(2, "0");
    return `${i}:${r}:${o}`;
  }
  return `${i}:${r}`;
}
c(xt, "formatCanonicalTime");
function xm(e, { format: t } = {}) {
  if (!e || typeof e != "object") return null;
  const n = Number(e.hour), i = Number(e.minute), r = e.second !== void 0 && e.second !== null, o = r ? Number(e.second) : null, a = r && Number.isFinite(o) ? Math.floor(Math.max(0, Math.min(59, o))) : null;
  if (!Number.isFinite(n) || !Number.isFinite(i)) return null;
  const s = t ?? Cn();
  return Do(
    {
      hours: n,
      minutes: i,
      seconds: a
    },
    s
  );
}
c(xm, "formatTimeComponentsForDisplay");
function Pm(e, { format: t } = {}) {
  const n = $a(e);
  if (!n) return "";
  const i = t ?? Cn();
  return Do(n, i);
}
c(Pm, "formatTriggerTimeForDisplay");
function Do(e, t = "12h") {
  if (!e) return "";
  const { hours: n, minutes: i, seconds: r = null } = e;
  if (!Number.isInteger(n) || !Number.isInteger(i)) return "";
  const o = Number.isInteger(r);
  if (t === "24h") {
    const g = `${String(n).padStart(2, "0")}:${String(i).padStart(2, "0")}`;
    return o ? `${g}:${String(r).padStart(2, "0")}` : g;
  }
  const a = n >= 12 ? ci : In, s = n % 12 === 0 ? 12 : n % 12, l = String(s), u = String(i).padStart(2, "0"), d = `${l}:${u}`, m = a === In ? E("EIDOLON.TimeTrigger.TimePeriodAM", In) : E("EIDOLON.TimeTrigger.TimePeriodPM", ci);
  if (o) {
    const g = String(r).padStart(2, "0");
    return `${d}:${g} ${m}`;
  }
  return `${d} ${m}`;
}
c(Do, "formatTimeParts");
function $c(e, t = Cn()) {
  const n = $a(e);
  if (t === "24h")
    return {
      format: t,
      canonical: n ? xt(n) ?? "" : "",
      hour: n ? String(n.hours).padStart(2, "0") : "",
      minute: n ? String(n.minutes).padStart(2, "0") : ""
    };
  if (!n)
    return {
      format: t,
      canonical: "",
      hour: "",
      minute: "",
      period: In
    };
  const i = n.hours >= 12 ? ci : In, r = n.hours % 12 === 0 ? 12 : n.hours % 12;
  return {
    format: t,
    canonical: xt(n) ?? "",
    hour: String(r),
    minute: String(n.minutes).padStart(2, "0"),
    period: i
  };
}
c($c, "getTimeFormValues");
function Rm({ hour: e, minute: t, period: n, time: i }, r = Cn()) {
  if (r === "24h") {
    const y = typeof e == "string" ? e.trim() : "", h = typeof t == "string" ? t.trim() : "", p = typeof i == "string" ? i.trim() : "";
    if (!y && !h && p) {
      const S = $a(p);
      return S ? { canonical: xt(S) ?? "", error: null } : {
        canonical: "",
        error: E(
          "EIDOLON.TimeTrigger.TimeFormatInvalid24",
          "Enter a valid time in HH:MM format."
        )
      };
    }
    if (!y || !h)
      return {
        canonical: "",
        error: E("EIDOLON.TimeTrigger.TimeFormatMissing", "Enter a complete time.")
      };
    const w = Number(y), b = Number(h);
    return !Number.isInteger(w) || w < 0 || w > 23 ? {
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
    } : { canonical: xt({
      hours: w,
      minutes: b
    }) ?? "", error: null };
  }
  const o = typeof e == "string" ? e.trim() : "", a = typeof t == "string" ? t.trim() : "", s = typeof n == "string" ? n.trim().toUpperCase() : "";
  if (!o || !a || !s)
    return { canonical: "", error: E("EIDOLON.TimeTrigger.TimeFormatMissing", "Enter a complete time.") };
  if (s !== In && s !== ci)
    return { canonical: "", error: E("EIDOLON.TimeTrigger.TimeFormatInvalidPeriod", "Select AM or PM.") };
  const l = Number(o), u = Number(a);
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
  const d = l % 12, g = {
    hours: s === ci ? d + 12 : d,
    minutes: u
  };
  return {
    canonical: xt(g) ?? "",
    error: null
  };
}
c(Rm, "normalizeFormTimeInput");
function Hm() {
  return [
    {
      value: In,
      label: E("EIDOLON.TimeTrigger.TimePeriodAM", In)
    },
    {
      value: ci,
      label: E("EIDOLON.TimeTrigger.TimePeriodPM", ci)
    }
  ];
}
c(Hm, "getPeriodOptions");
var Gn, Wn, re, Ju, ia, ra, Yu, Fs, xs, oa, aa, Qu, Xu, Zu, Ps, Rs, Hs, sa, la, qs, ca, ed, td;
const Vn = class Vn extends Dn($n) {
  constructor(n = {}) {
    var a;
    const { scene: i, showControls: r, ...o } = n ?? {};
    super(o);
    A(this, re);
    A(this, Gn, null);
    A(this, Wn, null);
    A(this, ia, /* @__PURE__ */ c((n) => {
      var r, o;
      n.preventDefault();
      const i = Number((o = (r = n.currentTarget) == null ? void 0 : r.dataset) == null ? void 0 : o.delta);
      Number.isFinite(i) && (N("Time delta button clicked", { delta: i }), this._advanceTime(i));
    }, "#onDeltaClick"));
    A(this, ra, /* @__PURE__ */ c((n) => {
      var i, r;
      n.preventDefault(), !(!this.showControls || !((i = game.user) != null && i.isGM)) && (N("Time value double clicked", { sceneId: ((r = this.scene) == null ? void 0 : r.id) ?? null }), C(this, re, Yu).call(this));
    }, "#onTimeDoubleClick"));
    A(this, oa, /* @__PURE__ */ c((n) => {
      if (this.isEditingTime && !this._commitTimeInProgress)
        if (n.key === "Enter") {
          n.preventDefault();
          const i = n.currentTarget, r = typeof (i == null ? void 0 : i.value) == "string" ? i.value : "";
          C(this, re, xs).call(this, r);
        } else n.key === "Escape" && (n.preventDefault(), C(this, re, Fs).call(this));
    }, "#onTimeInputKeydown"));
    A(this, aa, /* @__PURE__ */ c((n) => {
      if (!this.isEditingTime || this._commitTimeInProgress || this._suppressBlurCommit) return;
      const i = n.currentTarget, r = typeof (i == null ? void 0 : i.value) == "string" ? i.value : "";
      C(this, re, xs).call(this, r);
    }, "#onTimeInputBlur"));
    A(this, sa, /* @__PURE__ */ c((n) => {
      const i = !!n;
      if (this.manageTimeEnabled === i) return;
      this.manageTimeEnabled = i, (this.rendered ?? this.isRendered ?? !1) && this.render({ force: !0 });
    }, "#handleManageTimeChange"));
    A(this, la, /* @__PURE__ */ c(async (n) => {
      var o, a, s, l, u, d, m, g, y;
      if (n.preventDefault(), !this.showControls || !((o = game.user) != null && o.isGM)) return;
      if (!this.manageTimeEnabled) {
        (s = (a = ui.notifications) == null ? void 0 : a.error) == null || s.call(
          a,
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
        const h = r ? E(
          "EIDOLON.TimeTrigger.SceneRealTimeEnabled",
          "Automatic real-time flow enabled for this scene."
        ) : E(
          "EIDOLON.TimeTrigger.SceneRealTimeDisabled",
          "Automatic real-time flow disabled for this scene."
        );
        (m = (d = ui.notifications) == null ? void 0 : d.info) == null || m.call(d, h);
      } catch (h) {
        console.error(`${T} | Failed to toggle scene real-time flow`, h), (y = (g = ui.notifications) == null ? void 0 : g.error) == null || y.call(
          g,
          E(
            "EIDOLON.TimeTrigger.SceneRealTimeToggleError",
            "Failed to update the scene's real-time flow setting."
          )
        );
      } finally {
        this.render({ force: !0 });
      }
    }, "#onRealTimeToggleClick"));
    A(this, ca, /* @__PURE__ */ c(() => {
      (this.rendered ?? this.isRendered ?? !1) && (this.isEditingTime && (this.editValue = C(this, re, Ps).call(this)), this.render({ force: !0 }));
    }, "#handleTimeFormatChange"));
    this.scene = i ?? null, this.showControls = typeof r == "boolean" ? r : !!((a = game.user) != null && a.isGM), this.isEditingTime = !1, this.editValue = "", this._commitTimeInProgress = !1, this._suppressBlurCommit = !1, this.manageTimeEnabled = !1, this.sceneAllowsRealTime = C(this, re, qs).call(this), L(this, Gn, Yl(f(this, ca))), L(this, Wn, Vu(f(this, sa)));
  }
  async _prepareContext() {
    var b, v;
    const n = ((b = game.time) == null ? void 0 : b.components) ?? {}, r = ((n == null ? void 0 : n.second) !== void 0 && (n == null ? void 0 : n.second) !== null ? xm(n) : null) ?? C(this, re, Ju).call(this), o = Cn(), a = o === "24h", s = a ? E("EIDOLON.TimeTrigger.EditTimePlaceholder24", "HH:MM") : E("EIDOLON.TimeTrigger.EditTimePlaceholder12", "HH:MM AM/PM"), l = this.showControls ? E(
      "EIDOLON.TimeTrigger.EditTimeHint",
      "Double-click to set a specific time."
    ) : "", u = this.showControls ? E(
      "EIDOLON.TimeTrigger.EditTimeLabel",
      "New time (HH:MM or HH:MM AM/PM)"
    ) : "", d = bm.map((S) => ({
      minutes: S,
      label: S > 0 ? `+${S}` : `${S}`
    })), m = !!this.manageTimeEnabled, g = C(this, re, qs).call(this);
    this.sceneAllowsRealTime = g;
    const y = E(
      "EIDOLON.TimeTrigger.SceneRealTimeEnable",
      "Enable automatic real-time flow for this scene."
    ), h = E(
      "EIDOLON.TimeTrigger.SceneRealTimeDisable",
      "Disable automatic real-time flow for this scene."
    ), p = E(
      "EIDOLON.TimeTrigger.SceneRealTimeManageDisabled",
      "Enable Manage Time in module settings to allow automatic real-time flow."
    );
    return {
      formattedTime: r,
      deltas: d,
      manageTimeEnabled: m,
      sceneAllowsRealTime: g,
      realTimeButtonLabel: m ? g ? h : y : p,
      isGM: ((v = game.user) == null ? void 0 : v.isGM) ?? !1,
      showControls: !!this.showControls,
      editHint: l,
      editLabel: u,
      editPlaceholder: s,
      timeFormat: o,
      is24Hour: a,
      isEditingTime: !!this.isEditingTime,
      editValue: this.isEditingTime ? this.editValue ?? "" : ""
    };
  }
  async close(n = {}) {
    var r, o;
    if (!n.force)
      return (this.rendered ?? this.isRendered ?? !1) || (N("TimeTriggerWindow close request rerendering", {
        sceneId: ((r = this.scene) == null ? void 0 : r.id) ?? null
      }), this.render({ force: !0 })), this;
    N("Closing time trigger window", { sceneId: ((o = this.scene) == null ? void 0 : o.id) ?? null, force: !0 });
    const i = await super.close(n);
    return C(this, re, ed).call(this), C(this, re, td).call(this), i;
  }
  async _advanceTime(n) {
    var r, o, a, s, l, u, d;
    const i = n * 60;
    if (N("Advancing world time", { sceneId: ((r = this.scene) == null ? void 0 : r.id) ?? null, minutes: n, seconds: i }), !((o = game.user) != null && o.isGM)) {
      (s = (a = ui.notifications) == null ? void 0 : a.warn) == null || s.call(a, E("EIDOLON.TimeTrigger.GMOnly", "Only the GM can adjust time."));
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
    var o;
    super._onRender(n, i);
    const r = this.element;
    if (r) {
      if (this.showControls) {
        N("Binding time trigger interactions", {
          sceneId: ((o = this.scene) == null ? void 0 : o.id) ?? null,
          buttonCount: r.querySelectorAll("[data-delta]").length
        }), r.querySelectorAll("[data-delta]").forEach((u) => {
          u.addEventListener("click", f(this, ia));
        });
        const a = r.querySelector('.time-trigger-window__time-value[data-editable="true"]');
        a && a.addEventListener("dblclick", f(this, ra), { once: !1 });
        const s = r.querySelector(".time-trigger-window__time-input");
        s && (s.addEventListener("keydown", f(this, oa)), s.addEventListener("blur", f(this, aa)), typeof s.focus == "function" && (s.focus(), typeof s.select == "function" && s.select()));
        const l = r.querySelector('[data-action="toggle-real-time"]');
        l && l.addEventListener("click", f(this, la));
      }
      this._suppressBlurCommit = !1;
    }
  }
};
Gn = new WeakMap(), Wn = new WeakMap(), re = new WeakSet(), Ju = /* @__PURE__ */ c(function() {
  var l;
  const n = (l = game.time) == null ? void 0 : l.worldTime;
  if (typeof n != "number" || !Number.isFinite(n)) return "";
  const i = 1440 * 60, r = (Math.floor(n) % i + i) % i, o = Math.floor(r / 3600), a = Math.floor(r % 3600 / 60), s = r % 60;
  return Do({ hours: o, minutes: a, seconds: s }, Cn());
}, "#formatFallbackTime"), ia = new WeakMap(), ra = new WeakMap(), Yu = /* @__PURE__ */ c(function() {
  var n;
  (n = game.user) != null && n.isGM && (this.isEditingTime = !0, this._suppressBlurCommit = !1, this.editValue = C(this, re, Ps).call(this), this.render({ force: !0 }));
}, "#enterTimeEditMode"), Fs = /* @__PURE__ */ c(function() {
  this.isEditingTime = !1, this.editValue = "", this._suppressBlurCommit = !1, this.render({ force: !0 });
}, "#cancelTimeEdit"), xs = /* @__PURE__ */ c(async function(n) {
  var o, a, s;
  if (!((o = game.user) != null && o.isGM) || !this.isEditingTime || this._commitTimeInProgress) return;
  this._commitTimeInProgress = !0;
  const i = typeof n == "string" ? n.trim() : "";
  if (!i) {
    C(this, re, Fs).call(this), this._commitTimeInProgress = !1;
    return;
  }
  const r = C(this, re, Zu).call(this, i);
  if (r.error) {
    (s = (a = ui.notifications) == null ? void 0 : a.error) == null || s.call(a, r.error), this._suppressBlurCommit = !0, this.editValue = i, this.render({ force: !0 }), this._commitTimeInProgress = !1;
    return;
  }
  try {
    await C(this, re, Xu).call(this, r.seconds, r.includeSeconds) ? (this.isEditingTime = !1, this.editValue = "", this.render({ force: !0 })) : (this.editValue = i, this.render({ force: !0 }));
  } finally {
    this._commitTimeInProgress = !1;
  }
}, "#commitTimeInput"), oa = new WeakMap(), aa = new WeakMap(), Qu = /* @__PURE__ */ c(function() {
  var u, d;
  const n = (u = game.time) == null ? void 0 : u.worldTime;
  if (typeof n != "number" || !Number.isFinite(n))
    return "";
  const i = ((d = game.time) == null ? void 0 : d.components) ?? {}, r = Number(i.hour), o = Number(i.minute), a = i.second !== void 0 ? Number(i.second) : null, s = Number.isInteger(a);
  return (Number.isFinite(r) && Number.isFinite(o) ? xt({
    hours: Math.max(0, Math.min(23, Number(r))),
    minutes: Math.max(0, Math.min(59, Number(o))),
    seconds: s && Number.isFinite(a) ? Math.max(0, Math.min(59, Number(a))) : void 0
  }) ?? "" : "") ?? "";
}, "#getCurrentCanonicalTime"), Xu = /* @__PURE__ */ c(async function(n, i) {
  var g, y, h, p, w, b, v, S, I, O;
  const r = (g = game.time) == null ? void 0 : g.worldTime;
  if (typeof r != "number" || !Number.isFinite(r))
    return (h = (y = ui.notifications) == null ? void 0 : y.error) == null || h.call(
      y,
      E(
        "EIDOLON.TimeTrigger.EditTimeUnavailable",
        "The world time is unavailable, so it can't be updated."
      )
    ), !1;
  if (!Number.isInteger(n) || n < 0 || n >= ki)
    return (w = (p = ui.notifications) == null ? void 0 : p.error) == null || w.call(
      p,
      E(
        "EIDOLON.TimeTrigger.EditTimeInvalidRange",
        "Enter a time within the current day."
      )
    ), !1;
  const s = Math.floor(r / ki) * ki + n - r;
  if (!Number.isFinite(s) || s === 0)
    return !0;
  const l = Math.floor(n / 3600), u = Math.floor(n % 3600 / 60), d = n % 60, m = xt({
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
    const k = Do(
      {
        hours: l,
        minutes: u,
        seconds: i ? d : null
      },
      Cn()
    );
    (S = (v = ui.notifications) == null ? void 0 : v.info) == null || S.call(
      v,
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
  const o = r.match(/^([0-9]{1,2}):([0-9]{2})(?::([0-9]{2}))?$/);
  if (o) {
    const g = Number(o[1]), y = Number(o[2]), h = o[3] !== void 0 ? Number(o[3]) : void 0;
    if (Number.isInteger(g) && g >= 0 && g <= 23 && Number.isInteger(y) && y >= 0 && y <= 59 && (h === void 0 || Number.isInteger(h) && h >= 0 && h <= 59)) {
      const p = g * 3600 + y * 60 + (h ?? 0);
      return {
        canonical: xt({ hours: g, minutes: y, seconds: h }),
        seconds: p,
        includeSeconds: h !== void 0,
        error: null
      };
    }
    return { error: i };
  }
  const { amLower: a, pmLower: s, periodPattern: l } = C(this, re, Rs).call(this), u = r.match(
    new RegExp(
      `^([0-9]{1,2}):([0-9]{2})(?::([0-9]{2}))?\\s*(${l})$`,
      "i"
    )
  );
  if (u) {
    let g = Number(u[1]);
    const y = Number(u[2]), h = u[3] !== void 0 ? Number(u[3]) : void 0, p = u[4] ?? "", w = typeof p == "string" ? ((m = p.toLocaleLowerCase) == null ? void 0 : m.call(p)) ?? p.toLowerCase() : "";
    if (Number.isInteger(g) && g >= 1 && g <= 12 && Number.isInteger(y) && y >= 0 && y <= 59 && (h === void 0 || Number.isInteger(h) && h >= 0 && h <= 59) && (w === a || w === s || w === "am" || w === "pm")) {
      g = g % 12, (w === s || w === "pm") && (g += 12);
      const v = g * 3600 + y * 60 + (h ?? 0);
      return {
        canonical: xt({ hours: g, minutes: y, seconds: h }),
        seconds: v,
        includeSeconds: h !== void 0,
        error: null
      };
    }
    return { error: i };
  }
  const d = ju(r);
  if (d !== null) {
    const g = Math.floor(d / 3600), y = Math.floor(d % 3600 / 60), h = d % 60, p = h !== 0;
    return {
      canonical: xt({
        hours: g,
        minutes: y,
        seconds: p ? h : void 0
      }),
      seconds: d,
      includeSeconds: p,
      error: null
    };
  }
  return { error: i };
}, "#parseInputTime"), Ps = /* @__PURE__ */ c(function() {
  const n = C(this, re, Qu).call(this);
  if (!n) return "";
  if (Cn() === "24h")
    return n;
  const r = $a(n);
  if (!r) return n;
  const o = Number(r.hours), a = Number(r.minutes), s = r.seconds !== null && r.seconds !== void 0 ? Number(r.seconds) : void 0;
  if (!Number.isFinite(o) || !Number.isFinite(a)) return n;
  const l = Number.isFinite(s), u = o % 12 === 0 ? 12 : o % 12, d = String(a).padStart(2, "0"), m = l ? `:${String(s).padStart(2, "0")}` : "", { amLabel: g, pmLabel: y } = C(this, re, Rs).call(this), h = o >= 12 ? y : g;
  return `${u}:${d}${m} ${h}`.trim();
}, "#getInitialEditValue"), Rs = /* @__PURE__ */ c(function() {
  var u, d;
  const n = E("EIDOLON.TimeTrigger.TimePeriodAM", "AM"), i = E("EIDOLON.TimeTrigger.TimePeriodPM", "PM"), r = ((u = n.toLocaleLowerCase) == null ? void 0 : u.call(n)) ?? n.toLowerCase(), o = ((d = i.toLocaleLowerCase) == null ? void 0 : d.call(i)) ?? i.toLowerCase(), a = C(this, re, Hs).call(this, n), s = C(this, re, Hs).call(this, i), l = `${a}|${s}|AM|PM`;
  return {
    amLabel: n,
    pmLabel: i,
    amLower: r,
    pmLower: o,
    periodPattern: l
  };
}, "#getPeriodMatchData"), Hs = /* @__PURE__ */ c(function(n) {
  return typeof n != "string" ? "" : n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}, "#escapeForRegex"), sa = new WeakMap(), la = new WeakMap(), qs = /* @__PURE__ */ c(function() {
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
}, "#readSceneRealTimeFlag"), ca = new WeakMap(), ed = /* @__PURE__ */ c(function() {
  if (typeof f(this, Gn) == "function")
    try {
      f(this, Gn).call(this);
    } catch (n) {
      console.error(`${T} | Failed to dispose time format subscription`, n);
    }
  L(this, Gn, null);
}, "#disposeTimeFormatSubscription"), td = /* @__PURE__ */ c(function() {
  if (typeof f(this, Wn) == "function")
    try {
      f(this, Wn).call(this);
    } catch (n) {
      console.error(`${T} | Failed to dispose manage time subscription`, n);
    }
  L(this, Wn, null);
}, "#disposeManageTimeSubscription"), c(Vn, "TimeTriggerWindow"), pe(Vn, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  $e(Vn, Vn, "DEFAULT_OPTIONS"),
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
)), pe(Vn, "PARTS", {
  content: {
    template: `modules/${T}/templates/time-trigger.html`
  }
});
let Ds = Vn;
function Da(e, t = {}) {
  if (typeof e != "function")
    throw new TypeError("createApplicationFactory requires a constructor function.");
  const n = /* @__PURE__ */ c(function(r = {}) {
    const o = foundry.utils.mergeObject(
      t ?? {},
      r ?? {},
      { inplace: !1 }
    );
    return new e(o);
  }, "applicationFactory");
  return n.__eidolonFactorySignature = "options", n.__eidolonFactoryTarget = e, n;
}
c(Da, "createApplicationFactory");
const Dc = /* @__PURE__ */ new Set();
var be, We, Kn, Wi, nd, id;
const vc = class vc {
  constructor({ windowFactory: t } = {}) {
    A(this, Wi);
    A(this, be, null);
    A(this, We, null);
    A(this, Kn);
    const n = Da(Ds);
    typeof t == "function" ? t.__eidolonFactorySignature === "options" ? L(this, Kn, (r, o = {}) => t({ scene: r, ...o ?? {} })) : L(this, Kn, t) : L(this, Kn, /* @__PURE__ */ c((r, o = {}) => n({ scene: r, ...o ?? {} }), "fallbackFactory"));
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
    const i = nr(), r = C(this, Wi, nd).call(this, t, n);
    this.handleTimeTriggerEvaluation(i, t, r);
  }
  refreshTimeTriggerWindow(t) {
    var l, u, d;
    if (!t) return;
    const n = !!((l = game.user) != null && l.isGM), i = !!t.getFlag(T, Mo), r = !!t.getFlag(T, Es), o = !!t.getFlag(T, Ss);
    if (N("TimeTriggerManager#refreshTimeTriggerWindow", {
      sceneId: t.id,
      isGM: n,
      isActive: i,
      hideWindow: r,
      showPlayerWindow: o
    }), !(i && !r && (n || o))) {
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
    }), f(this, be).close({ force: !0 })), L(this, be, f(this, Kn).call(this, t, { showControls: s })), N("Rendering new time trigger window", { sceneId: t.id }), f(this, be).render({ force: !0 });
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
    const o = typeof n == "number" && Number.isFinite(n) ? n : typeof ((l = game.time) == null ? void 0 : l.worldTime) == "number" ? game.time.worldTime : null;
    if (o === null) return;
    const a = typeof i == "number" && Number.isFinite(i) ? i : null, s = a !== null ? a : typeof f(this, We) == "number" && Number.isFinite(f(this, We)) ? f(this, We) : o;
    ji("handleTimeTriggerEvaluation", {
      sceneId: r.id,
      previousWorldTime: s,
      currentWorldTime: o,
      overrideProvided: a !== null
    });
    try {
      await C(this, Wi, id).call(this, r, s, o);
    } catch (u) {
      console.error(`${T} | Unexpected error while evaluating time triggers`, u), N("handleTimeTriggerEvaluation error", { message: (u == null ? void 0 : u.message) ?? String(u) });
    } finally {
      L(this, We, o), Sn();
    }
  }
};
be = new WeakMap(), We = new WeakMap(), Kn = new WeakMap(), Wi = new WeakSet(), nd = /* @__PURE__ */ c(function(t, n) {
  return typeof f(this, We) == "number" && Number.isFinite(f(this, We)) ? (N("Resolved previous world time from cache", {
    previousWorldTime: f(this, We)
  }), f(this, We)) : typeof t == "number" && Number.isFinite(t) && typeof n == "number" && Number.isFinite(n) ? (N("Resolved previous world time using diff", {
    worldTime: t,
    diff: n,
    resolved: t - n
  }), t - n) : typeof t == "number" && Number.isFinite(t) ? t : null;
}, "#resolvePreviousWorldTime"), id = /* @__PURE__ */ c(async function(t, n, i) {
  var h, p, w;
  if (!((h = game.user) != null && h.isGM)) {
    N("Skipping trigger evaluation because user is not a GM");
    return;
  }
  if (!(t != null && t.id)) {
    N("Skipping trigger evaluation because the scene is missing an id");
    return;
  }
  if (!!!t.getFlag(T, Mo)) {
    N("Skipping trigger evaluation because scene is inactive", { sceneId: t.id });
    return;
  }
  if (typeof i != "number" || !Number.isFinite(i)) return;
  (typeof n != "number" || !Number.isFinite(n)) && (n = i);
  const o = Mi(t);
  if (!o.length) {
    N("No time triggers configured for scene", { sceneId: t.id });
    return;
  }
  const a = Am(t), s = /* @__PURE__ */ new Set();
  for (const b of o)
    b != null && b.id && s.add(b.id);
  let l = !1;
  for (const b of Object.keys(a))
    s.has(b) || (delete a[b], l = !0);
  if (ji("Evaluating scene time triggers", {
    sceneId: t.id,
    previousWorldTime: n,
    currentWorldTime: i,
    triggerCount: o.length
  }), i <= n) {
    N("Detected world time rewind", {
      previousWorldTime: n,
      currentWorldTime: i
    });
    for (const b of o) {
      if (!(b != null && b.id) || !b.allowReplayOnRewind) continue;
      const v = a[b.id];
      typeof v == "number" ? i < v ? (N("Clearing trigger history due to rewind", {
        triggerId: b.id,
        lastFired: v,
        currentWorldTime: i
      }), delete a[b.id], l = !0) : N("Preserving trigger history after rewind", {
        triggerId: b.id,
        lastFired: v,
        currentWorldTime: i
      }) : N("No history stored for rewind-enabled trigger", {
        triggerId: b.id
      });
    }
    l && (N("Persisting history cleanup after rewind", {
      sceneId: t.id
    }), await is(t, a)), Sn();
    return;
  }
  const u = n, d = i, m = [], g = Math.floor(u / ki), y = Math.floor(d / ki);
  for (const b of o) {
    if (!(b != null && b.id)) continue;
    const v = ju(b.time);
    if (v === null) {
      qm(t, b), N("Skipping trigger with invalid time", {
        triggerId: b.id,
        time: b.time
      });
      continue;
    }
    for (let S = g; S <= y; S++) {
      const I = S * ki + v;
      if (I < u || I > d) continue;
      const k = a[b.id];
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
    l && await is(t, a), N("No triggers scheduled to fire within evaluation window", {
      sceneId: t.id
    }), Sn();
    return;
  }
  m.sort((b, v) => b.absoluteTime - v.absoluteTime), N("Queued triggers for execution", {
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
    } catch (v) {
      console.error(`${T} | Failed to execute time trigger action`, v), (w = (p = ui.notifications) == null ? void 0 : p.error) == null || w.call(
        p,
        E(
          "EIDOLON.TimeTrigger.TriggerActionError",
          "Failed to execute a scene time trigger action. Check the console for details."
        )
      ), N("Trigger execution failed", {
        triggerId: b.trigger.id,
        message: (v == null ? void 0 : v.message) ?? String(v)
      });
    } finally {
      a[b.trigger.id] = b.absoluteTime, l = !0, N("Recorded trigger execution", {
        triggerId: b.trigger.id,
        absoluteTime: b.absoluteTime
      });
    }
  l && (N("Persisting trigger history updates", { sceneId: t.id }), await is(t, a)), Sn();
}, "#evaluateSceneTimeTriggers"), c(vc, "TimeTriggerManager");
let js = vc;
function qm(e, t) {
  var r, o;
  const n = `${(e == null ? void 0 : e.id) ?? "unknown"}:${(t == null ? void 0 : t.id) ?? (t == null ? void 0 : t.time) ?? "unknown"}`;
  if (Dc.has(n)) return;
  Dc.add(n);
  const i = E(
    "EIDOLON.TimeTrigger.InvalidTimeWarning",
    "A scene time trigger has an invalid time value and was skipped."
  );
  (o = (r = ui.notifications) == null ? void 0 : r.warn) == null || o.call(r, i), console.warn(`${T} | Invalid time for trigger`, { scene: e == null ? void 0 : e.id, trigger: t });
}
c(qm, "warnInvalidTriggerTime");
var bt, Tr, vt, un, Jn, $t, Fi, ua, da, Lr, Ir, Yn, Dt, V, Us, Ei, go, Vs, ho, zs, Nt, rd, Gs, od, Ws, ad, fa, ma, ga, ha, pa, ya, Ks, sd, po, ba, va;
const wc = class wc {
  constructor() {
    A(this, V);
    A(this, bt, !1);
    A(this, Tr, Vr);
    A(this, vt, /* @__PURE__ */ new Map());
    A(this, un, null);
    A(this, Jn, null);
    A(this, $t, 0);
    A(this, Fi, null);
    A(this, ua, null);
    A(this, da, null);
    A(this, Lr, !1);
    A(this, Ir, !1);
    A(this, Yn, !1);
    A(this, Dt, !1);
    A(this, fa, /* @__PURE__ */ c((t, n = {}) => {
      N("GameTimeAutomation | Pause state changed", {
        paused: t,
        userId: (n == null ? void 0 : n.userId) ?? null,
        broadcast: (n == null ? void 0 : n.broadcast) ?? null
      }), C(this, V, Nt).call(this, { pausedOverride: t });
    }, "#handlePause"));
    A(this, ma, /* @__PURE__ */ c((t) => {
      t != null && t.id && (f(this, vt).set(t.id, Math.max(t.round ?? 0, 1)), N("GameTimeAutomation | Combat started", { combatId: t.id, round: t.round ?? 0 }), C(this, V, Nt).call(this));
    }, "#handleCombatStart"));
    A(this, ga, /* @__PURE__ */ c((t, n) => {
      if (!(t != null && t.id)) return;
      const i = typeof n == "number" && Number.isFinite(n) ? n : typeof t.round == "number" && Number.isFinite(t.round) ? t.round : 0, r = i > 0 ? i : 1, o = f(this, vt).get(t.id), a = o ? Math.max(o, 1) : 1, s = r > 1 ? Math.max(r - a, 0) : 0;
      if (N("GameTimeAutomation | Combat round change detected", {
        combatId: t.id,
        effectiveRound: r,
        completedRounds: s,
        enabled: f(this, bt),
        paused: (game == null ? void 0 : game.paused) ?? null
      }), s > 0 && f(this, bt) && f(this, Dt) && !(game != null && game.paused) && C(this, V, Ei).call(this) && C(this, V, go).call(this, t)) {
        const l = s * f(this, Tr);
        l > 0 && (N("GameTimeAutomation | Advancing time for completed combat rounds", {
          combatId: t.id,
          completedRounds: s,
          delta: l
        }), C(this, V, Ws).call(this, l));
      }
      f(this, vt).set(t.id, Math.max(r, 1));
    }, "#handleCombatRound"));
    A(this, ha, /* @__PURE__ */ c((t) => {
      t != null && t.id && (f(this, vt).delete(t.id), N("GameTimeAutomation | Combat ended", { combatId: t.id }), C(this, V, Nt).call(this));
    }, "#handleCombatEnd"));
    A(this, pa, /* @__PURE__ */ c((t) => {
      t != null && t.id && (f(this, vt).delete(t.id), N("GameTimeAutomation | Combat deleted", { combatId: t.id }), C(this, V, Nt).call(this));
    }, "#handleCombatDelete"));
    A(this, ya, /* @__PURE__ */ c((t, n) => {
      if (t != null && t.id) {
        if (typeof (n == null ? void 0 : n.round) == "number" && Number.isFinite(n.round)) {
          const i = Math.max(n.round, 1);
          f(this, vt).set(t.id, i), N("GameTimeAutomation | Combat round manually updated", {
            combatId: t.id,
            round: i
          });
        }
        (Object.prototype.hasOwnProperty.call(n ?? {}, "active") || (n == null ? void 0 : n.round) !== void 0) && C(this, V, Nt).call(this);
      }
    }, "#handleCombatUpdate"));
    A(this, ba, /* @__PURE__ */ c((t) => {
      C(this, V, po).call(this, t == null ? void 0 : t.scene), C(this, V, Nt).call(this);
    }, "#handleCanvasReady"));
    A(this, va, /* @__PURE__ */ c((t) => {
      if (!Ue(t)) return;
      const n = C(this, V, Ks).call(this);
      if (!n || n.id !== t.id) return;
      C(this, V, po).call(this, t) && C(this, V, Nt).call(this);
    }, "#handleSceneUpdate"));
  }
  registerHooks() {
    f(this, Lr) || (L(this, Lr, !0), Hooks.on("pauseGame", f(this, fa)), Hooks.on("combatStart", f(this, ma)), Hooks.on("combatRound", f(this, ga)), Hooks.on("combatEnd", f(this, ha)), Hooks.on("deleteCombat", f(this, pa)), Hooks.on("updateCombat", f(this, ya)), Hooks.on("canvasReady", f(this, ba)), Hooks.on("updateScene", f(this, va)));
  }
  initialize() {
    f(this, Ir) || (L(this, Ir, !0), L(this, ua, Vu((t) => {
      const n = !!t, i = n !== f(this, bt);
      L(this, bt, n), N("GameTimeAutomation | Manage time toggled", { enabled: n }), i && n && C(this, V, zs).call(this), C(this, V, Nt).call(this);
    })), L(this, da, Lm((t) => {
      L(this, Tr, t), N("GameTimeAutomation | Seconds per round updated", { value: t });
    })), C(this, V, zs).call(this), C(this, V, po).call(this), C(this, V, Nt).call(this));
  }
};
bt = new WeakMap(), Tr = new WeakMap(), vt = new WeakMap(), un = new WeakMap(), Jn = new WeakMap(), $t = new WeakMap(), Fi = new WeakMap(), ua = new WeakMap(), da = new WeakMap(), Lr = new WeakMap(), Ir = new WeakMap(), Yn = new WeakMap(), Dt = new WeakMap(), V = new WeakSet(), Us = /* @__PURE__ */ c(function() {
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
}, "#currentTimestamp"), Ei = /* @__PURE__ */ c(function() {
  var t;
  return !!((t = game == null ? void 0 : game.user) != null && t.isGM && game.user.active !== !1);
}, "#canControlTime"), go = /* @__PURE__ */ c(function(t) {
  var i, r;
  if (!t) return !1;
  if (t.active === !0) return !0;
  if (t.active === !1) return !1;
  const n = (i = game == null ? void 0 : game.combats) == null ? void 0 : i.active;
  return (n == null ? void 0 : n.id) === t.id ? !0 : ((r = game == null ? void 0 : game.combat) == null ? void 0 : r.id) === t.id ? game.combat.active ?? !0 : !1;
}, "#isCombatDocumentActive"), Vs = /* @__PURE__ */ c(function(t) {
  return t ? typeof t.started == "boolean" ? t.started : (t.round ?? 0) > 0 : !1;
}, "#hasCombatStarted"), ho = /* @__PURE__ */ c(function() {
  var i;
  const t = Array.isArray((i = game == null ? void 0 : game.combats) == null ? void 0 : i.contents) ? game.combats.contents : [];
  for (const r of t)
    if (C(this, V, go).call(this, r) && C(this, V, Vs).call(this, r))
      return !0;
  const n = game == null ? void 0 : game.combat;
  return !!(n && C(this, V, go).call(this, n) && C(this, V, Vs).call(this, n));
}, "#isCombatRunning"), zs = /* @__PURE__ */ c(function() {
  var n;
  f(this, vt).clear();
  const t = Array.isArray((n = game == null ? void 0 : game.combats) == null ? void 0 : n.contents) ? game.combats.contents : [];
  for (const i of t)
    i != null && i.id && f(this, vt).set(i.id, Math.max(i.round ?? 0, 1));
}, "#hydrateRoundTracking"), Nt = /* @__PURE__ */ c(function({ pausedOverride: t } = {}) {
  const n = typeof t == "boolean" ? t : !!(game != null && game.paused), i = f(this, bt), r = f(this, Dt), o = i && r, a = {
    manageTimeEnabled: i,
    sceneAllowsRealTime: r,
    effectiveEnabled: o,
    paused: n,
    canControl: C(this, V, Ei).call(this),
    combatRunning: C(this, V, ho).call(this),
    overrideApplied: typeof t == "boolean"
  };
  if (N("GameTimeAutomation | Sync running state", a), !o || !C(this, V, Ei).call(this)) {
    C(this, V, Gs).call(this);
    return;
  }
  C(this, V, rd).call(this);
}, "#syncRunningState"), rd = /* @__PURE__ */ c(function() {
  f(this, un) === null && (L(this, Jn, C(this, V, Us).call(this)), L(this, un, globalThis.setInterval(() => C(this, V, od).call(this), 1e3)), N("GameTimeAutomation | Started real-time ticker"));
}, "#startRealTimeTicker"), Gs = /* @__PURE__ */ c(function() {
  f(this, un) !== null && (globalThis.clearInterval(f(this, un)), L(this, un, null), N("GameTimeAutomation | Stopped real-time ticker")), L(this, Jn, null), L(this, $t, 0), L(this, Yn, !1);
}, "#stopRealTimeTicker"), od = /* @__PURE__ */ c(function() {
  if (!f(this, bt) || !f(this, Dt) || !C(this, V, Ei).call(this)) {
    C(this, V, Gs).call(this);
    return;
  }
  const t = C(this, V, Us).call(this);
  if (typeof t != "number" || !Number.isFinite(t)) return;
  const n = f(this, Jn) ?? t, i = (t - n) / 1e3;
  if (L(this, Jn, t), !Number.isFinite(i) || i <= 0) return;
  const r = !!(game != null && game.paused), o = C(this, V, ho).call(this);
  if (r || o) {
    f(this, Yn) || N("GameTimeAutomation | Tick skipped", { paused: r, combatRunning: o }), L(this, Yn, !0), L(this, $t, 0);
    return;
  }
  L(this, Yn, !1), N("GameTimeAutomation | Real-time tick", { deltaSeconds: i }), C(this, V, Ws).call(this, i);
}, "#tickRealTime"), Ws = /* @__PURE__ */ c(function(t) {
  if (!f(this, bt) || !f(this, Dt)) return;
  const n = Number(t);
  !Number.isFinite(n) || n <= 0 || (L(this, $t, f(this, $t) + n), !f(this, Fi) && L(this, Fi, C(this, V, ad).call(this)));
}, "#queueAdvance"), ad = /* @__PURE__ */ c(async function() {
  var t, n;
  for (; f(this, $t) > 0; ) {
    if (!f(this, bt) || !f(this, Dt) || game != null && game.paused || !C(this, V, Ei).call(this) || C(this, V, ho).call(this)) {
      L(this, $t, 0);
      break;
    }
    const i = f(this, $t);
    L(this, $t, 0);
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
  L(this, Fi, null);
}, "#flushAdvanceQueue"), fa = new WeakMap(), ma = new WeakMap(), ga = new WeakMap(), ha = new WeakMap(), pa = new WeakMap(), ya = new WeakMap(), Ks = /* @__PURE__ */ c(function() {
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
}, "#isSceneRealTimeAllowed"), po = /* @__PURE__ */ c(function(t) {
  const n = Ue(t) ? t : C(this, V, Ks).call(this), i = C(this, V, sd).call(this, n), r = f(this, Dt);
  return L(this, Dt, i), r !== i ? (N("GameTimeAutomation | Scene real-time allowance changed", {
    sceneId: (n == null ? void 0 : n.id) ?? null,
    allows: i
  }), !0) : !1;
}, "#refreshSceneAutomationState"), ba = new WeakMap(), va = new WeakMap(), c(wc, "GameTimeAutomation");
let Bs = wc;
var Du, dn, De, Qn, Qt, wa, ye, ld, cd, ud, dd, Ea, Ys, Sa, fd, Ca, md, gd;
const Wt = class Wt extends Dn($n) {
  constructor(n = {}) {
    const { scene: i, trigger: r, triggerIndex: o, onSave: a, ...s } = n ?? {};
    super(s);
    A(this, ye);
    A(this, dn, null);
    A(this, De, null);
    A(this, Qn, null);
    A(this, Qt, null);
    A(this, wa, /* @__PURE__ */ c(() => {
      (this.rendered ?? this.isRendered ?? !1) && (L(this, Qt, C(this, ye, ld).call(this)), this.render({ force: !0 }));
    }, "#handleTimeFormatChange"));
    A(this, Ea, /* @__PURE__ */ c((n) => {
      var o, a;
      const i = n.currentTarget, r = i == null ? void 0 : i.closest("form");
      r && (N("Trigger action selection changed", {
        sceneId: ((o = this.scene) == null ? void 0 : o.id) ?? null,
        triggerId: ((a = this.trigger) == null ? void 0 : a.id) ?? null,
        actionId: (i == null ? void 0 : i.value) ?? null
      }), C(this, ye, Ys).call(this, i.value, r));
    }, "#onActionSelectChange"));
    A(this, Sa, /* @__PURE__ */ c((n) => {
      var u, d, m, g;
      n.preventDefault();
      const i = n.currentTarget, r = i == null ? void 0 : i.closest("form");
      if (!r) return;
      const o = (u = i.dataset) == null ? void 0 : u.target;
      if (!o) return;
      const a = typeof (CSS == null ? void 0 : CSS.escape) == "function" ? CSS.escape : (y) => y, s = r.querySelector(`[name="${a(o)}"]`);
      if (!s) return;
      N("Opening file picker for trigger", {
        sceneId: ((d = this.scene) == null ? void 0 : d.id) ?? null,
        triggerId: ((m = this.trigger) == null ? void 0 : m.id) ?? null,
        target: o
      }), new FilePicker({
        type: ((g = i.dataset) == null ? void 0 : g.type) || "audio",
        current: s.value,
        callback: /* @__PURE__ */ c((y) => {
          var h, p;
          s.value = y, s.dispatchEvent(new Event("change")), N("Trigger form file selected", {
            sceneId: ((h = this.scene) == null ? void 0 : h.id) ?? null,
            triggerId: ((p = this.trigger) == null ? void 0 : p.id) ?? null,
            target: o,
            path: y
          });
        }, "callback")
      }).render({ force: !0 });
    }, "#onFilePicker"));
    A(this, Ca, /* @__PURE__ */ c(async (n) => {
      var r, o;
      n.preventDefault();
      const i = n.currentTarget;
      i instanceof HTMLFormElement && (N("Trigger form submitted", {
        sceneId: ((r = this.scene) == null ? void 0 : r.id) ?? null,
        triggerId: ((o = this.trigger) == null ? void 0 : o.id) ?? null
      }), await C(this, ye, md).call(this, i));
    }, "#onSubmit"));
    this.scene = i ?? null, this.trigger = r ?? null, this.triggerIndex = Number.isInteger(o) ? Number(o) : null, this.onSave = typeof a == "function" ? a : null, L(this, Qn, Yl(f(this, wa)));
  }
  async _prepareContext() {
    var n, i;
    ji("TriggerFormApplication#_prepareContext", {
      sceneId: ((n = this.scene) == null ? void 0 : n.id) ?? null,
      triggerId: ((i = this.trigger) == null ? void 0 : i.id) ?? null,
      triggerIndex: this.triggerIndex
    });
    try {
      const r = this.trigger ?? { action: mo, data: {} }, o = r.action ?? mo, a = $c(r.time), s = a.format ?? "12h", l = s === "12h" ? Hm() : [], u = a.period ?? (l.length > 0 ? l[0].value : null), d = s === "12h" ? l.map((y) => ({
        ...y,
        selected: y.value === u
      })) : [], m = _c().map((y) => ({
        id: y.id,
        label: typeof y.label == "function" ? y.label() : y.label,
        selected: y.id === o
      })), g = _c().map((y) => {
        const h = y.id === r.action ? r : { ...r, action: y.id }, p = _m(h);
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
        timeFormat: s,
        is12HourFormat: s === "12h",
        is24HourFormat: s === "24h",
        timePeriodOptions: d,
        actions: m,
        actionSections: g,
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
      Sn();
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
    const o = Array.from(((d = document == null ? void 0 : document.body) == null ? void 0 : d.classList) ?? []).find(
      (m) => m.startsWith("theme-")
    );
    o && r.classList.add(o);
    const a = r.querySelector("form");
    if (!a) return;
    C(this, ye, fd).call(this, a), C(this, ye, cd).call(this, a), a.addEventListener("submit", f(this, Ca));
    const s = a.querySelector("[data-action-select]");
    s && (s.addEventListener("change", f(this, Ea)), C(this, ye, Ys).call(this, s.value, a)), a.querySelectorAll("[data-action-file-picker]").forEach((m) => {
      m.addEventListener("click", f(this, Sa));
    });
  }
  async close(n = {}) {
    var i;
    if ((i = f(this, dn)) == null || i.call(this), L(this, dn, null), L(this, De, null), L(this, Qt, null), typeof f(this, Qn) == "function")
      try {
        f(this, Qn).call(this);
      } catch (r) {
        console.error(`${T} | Failed to dispose trigger form time format subscription`, r);
      }
    return L(this, Qn, null), super.close(n);
  }
};
dn = new WeakMap(), De = new WeakMap(), Qn = new WeakMap(), Qt = new WeakMap(), wa = new WeakMap(), ye = new WeakSet(), ld = /* @__PURE__ */ c(function() {
  var s, l, u, d, m, g, y;
  const n = (l = (s = this.element) == null ? void 0 : s.querySelector) == null ? void 0 : l.call(s, "form");
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
          values: Array.from(h.selectedOptions ?? []).map((p) => p.value)
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
  let a = null;
  if (o instanceof HTMLElement) {
    const h = o.querySelector("[data-time-hidden]"), p = o.querySelector("[data-time-hour]"), w = o.querySelector("[data-time-minute]"), b = o.querySelector("[data-time-period]");
    a = {
      format: ((y = o.dataset) == null ? void 0 : y.timeFormat) ?? null,
      canonical: h instanceof HTMLInputElement ? h.value : "",
      hour: p instanceof HTMLInputElement ? p.value : "",
      minute: w instanceof HTMLInputElement ? w.value : "",
      period: b instanceof HTMLSelectElement ? b.value : ""
    };
  }
  return {
    fields: r,
    time: a
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
  const r = typeof (CSS == null ? void 0 : CSS.escape) == "function" ? CSS.escape : (o) => o;
  for (const o of i) {
    if (!o || typeof o.name != "string") continue;
    const a = r(o.name);
    if (o.kind === "checkbox" || o.kind === "radio") {
      const l = `input[type="${o.kind}"][name="${a}"]`, u = n.querySelectorAll(l);
      u.forEach((d) => {
        d instanceof HTMLInputElement && (u.length === 1 || d.value === o.value) && (d.checked = !!o.checked);
      });
      continue;
    }
    if (o.kind === "select-multiple") {
      const l = n.querySelector(`select[name="${a}"]`);
      if (!(l instanceof HTMLSelectElement)) continue;
      const u = new Set(Array.isArray(o.values) ? o.values : []);
      Array.from(l.options ?? []).forEach((d) => {
        d.selected = u.has(d.value);
      });
      continue;
    }
    const s = n.querySelector(`[name="${a}"]`);
    (s instanceof HTMLInputElement || s instanceof HTMLSelectElement || s instanceof HTMLTextAreaElement) && (s.value = o.value ?? "");
  }
}, "#restoreFieldValues"), dd = /* @__PURE__ */ c(function(n, i) {
  var v, S, I;
  const r = n.querySelector("[data-time-format]");
  if (!(r instanceof HTMLElement)) {
    typeof f(this, De) == "function" && f(this, De).call(this);
    return;
  }
  const o = ((v = r.dataset) == null ? void 0 : v.timeFormat) === "24h" ? "24h" : "12h", a = r.querySelector("[data-time-hour]"), s = r.querySelector("[data-time-minute]"), l = r.querySelector("[data-time-period]"), u = r.querySelector("[data-time-hidden]");
  if (!i) {
    if (a instanceof HTMLInputElement && (a.value = ""), s instanceof HTMLInputElement && (s.value = ""), l instanceof HTMLSelectElement) {
      const O = ((I = (S = l.options) == null ? void 0 : S[0]) == null ? void 0 : I.value) ?? "";
      l.value = O;
    }
    u instanceof HTMLInputElement && (u.value = ""), typeof f(this, De) == "function" && f(this, De).call(this);
    return;
  }
  const d = typeof i.canonical == "string" ? i.canonical : "", m = typeof i.period == "string" ? i.period : "", g = typeof i.hour == "string" ? i.hour : "", y = typeof i.minute == "string" ? i.minute : "";
  let h = "", p = "", w = m, b = d;
  if (d) {
    const O = $c(d, o);
    h = O.hour ?? "", p = O.minute ?? "", b = O.canonical ?? d, o === "12h" ? w = O.period ?? m : w = "";
  } else
    h = g, p = y, o !== "12h" && (w = "");
  if (a instanceof HTMLInputElement && (a.value = h ?? ""), s instanceof HTMLInputElement && (s.value = p ?? ""), l instanceof HTMLSelectElement)
    if (o === "12h") {
      const O = Array.from(l.options ?? []);
      O.find((M) => M.value === w) ? l.value = w : O.length > 0 ? l.value = O[0].value : l.value = "";
    } else
      l.value = "";
  u instanceof HTMLInputElement && (u.value = b ?? ""), typeof f(this, De) == "function" && f(this, De).call(this);
}, "#restoreTimeInputs"), Ea = new WeakMap(), Ys = /* @__PURE__ */ c(function(n, i) {
  i && i.querySelectorAll("[data-action-config]").forEach((r) => {
    const o = r.dataset.actionConfig === n;
    r.style.display = o ? "" : "none";
  });
}, "#updateActionSections"), Sa = new WeakMap(), fd = /* @__PURE__ */ c(function(n) {
  var m, g, y, h;
  if ((m = f(this, dn)) == null || m.call(this), L(this, dn, null), L(this, De, null), !(n instanceof HTMLFormElement)) return;
  const i = n.querySelector("[data-time-format]"), r = ((g = i == null ? void 0 : i.dataset) == null ? void 0 : g.timeFormat) ?? null;
  if (r !== "12h" && r !== "24h")
    return;
  const o = i.querySelector("[data-time-hidden]"), a = i.querySelector("[data-time-hour]"), s = i.querySelector("[data-time-minute]"), l = r === "12h" ? i.querySelector("[data-time-period]") : null;
  if (!o || !a || !s || r === "12h" && !l) {
    N("Trigger form time inputs missing elements", {
      format: r,
      hasHidden: !!o,
      hasHour: !!a,
      hasMinute: !!s,
      hasPeriod: !!l
    });
    return;
  }
  const u = [a, s, ...l ? [l] : []], d = /* @__PURE__ */ c(() => {
    const { canonical: p, error: w } = Rm(
      {
        hour: a.value,
        minute: s.value,
        period: (l == null ? void 0 : l.value) ?? null,
        time: o.value
      },
      r
    );
    o.value = p ?? "";
    const b = w ?? "";
    o.setCustomValidity(b), u.forEach((v) => {
      v.setCustomValidity(b);
    });
  }, "update");
  u.forEach((p) => {
    p.addEventListener("input", d), p.addEventListener("change", d);
  }), d(), L(this, dn, () => {
    u.forEach((p) => {
      p.removeEventListener("input", d), p.removeEventListener("change", d);
    });
  }), L(this, De, d), N("Trigger form configured for time input", {
    format: r,
    sceneId: ((y = this.scene) == null ? void 0 : y.id) ?? null,
    triggerId: ((h = this.trigger) == null ? void 0 : h.id) ?? null
  });
}, "#setupTimeInput"), Ca = new WeakMap(), md = /* @__PURE__ */ c(async function(n) {
  var o, a, s, l, u;
  if (typeof f(this, De) == "function" && f(this, De).call(this), typeof n.checkValidity == "function" && !n.checkValidity()) {
    typeof n.reportValidity == "function" && n.reportValidity(), N("Trigger form submission blocked by validity check", {
      sceneId: ((o = this.scene) == null ? void 0 : o.id) ?? null,
      triggerId: ((a = this.trigger) == null ? void 0 : a.id) ?? null
    });
    return;
  }
  const i = new FormData(n), r = Object.fromEntries(i.entries());
  delete r.timeHour, delete r.timeMinute, delete r.timePeriod, r.allowReplayOnRewind = ((s = n.querySelector('input[name="allowReplayOnRewind"]')) == null ? void 0 : s.checked) ?? !1, N("Processing trigger form submission", {
    sceneId: ((l = this.scene) == null ? void 0 : l.id) ?? null,
    triggerId: ((u = this.trigger) == null ? void 0 : u.id) ?? null,
    allowReplayOnRewind: r.allowReplayOnRewind
  }), await C(this, ye, gd).call(this, r), await this.close();
}, "#handleSubmit"), gd = /* @__PURE__ */ c(async function(n) {
  var o, a, s, l, u, d;
  const i = {
    id: ((o = this.trigger) == null ? void 0 : o.id) ?? vm(),
    time: n.time ?? "",
    action: n.action ?? mo,
    allowReplayOnRewind: !!n.allowReplayOnRewind,
    data: {}
  };
  N("Persisting trigger from form", {
    sceneId: ((a = this.scene) == null ? void 0 : a.id) ?? null,
    triggerId: i.id,
    existingIndex: this.triggerIndex
  }), $m(i, n);
  const r = Mi(this.scene);
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
}, "#persistTrigger"), c(Wt, "TriggerFormApplication"), pe(Wt, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  $e(Wt, Wt, "DEFAULT_OPTIONS"),
  {
    id: `${T}-trigger-form`,
    classes: Array.from(
      /* @__PURE__ */ new Set([...((Du = $e(Wt, Wt, "DEFAULT_OPTIONS")) == null ? void 0 : Du.classes) ?? [], "standard-form", "themed"])
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
)), pe(Wt, "PARTS", {
  content: {
    template: `modules/${T}/templates/time-trigger-form.html`
  }
});
let Js = Wt;
function At(e) {
  return e instanceof HTMLElement ? e : (e == null ? void 0 : e[0]) instanceof HTMLElement ? e[0] : null;
}
c(At, "asHTMLElement");
function yo(e) {
  return typeof (e == null ? void 0 : e.changeTab) == "function";
}
c(yo, "isAppV2");
function hd(e, t, n, i = {}) {
  if (yo(e)) {
    e.changeTab(t, n, i);
    return;
  }
  if (typeof (e == null ? void 0 : e.activateTab) == "function") {
    const r = { ...i };
    n != null && (r.group = n), r.triggerCallback == null && (r.triggerCallback = !0), e.activateTab(t, r);
  }
}
c(hd, "setActiveTab");
function jm(e) {
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
c(jm, "readFormData");
const Fc = Symbol.for("eidolon.sceneConfig.v13PatchedTabs");
function pd(e = {}) {
  const {
    tabId: t,
    tabLabel: n,
    getScene: i,
    isApplicable: r,
    renderContent: o,
    debugNamespace: a = "SceneConfigTab",
    onButtonCreate: s,
    onTabCreate: l,
    onAfterRender: u,
    logger: d = {},
    moduleId: m = "eidolon-utilities",
    tabIcon: g = "fa-solid fa-puzzle-piece"
  } = e ?? {};
  if (!t)
    throw new Error("createSceneConfigTabFactory requires a tabId.");
  if (typeof o != "function")
    throw new TypeError("createSceneConfigTabFactory requires a renderContent callback.");
  const y = typeof d.log == "function" ? d.log.bind(d) : (..._) => {
    var H;
    return (H = console.debug) == null ? void 0 : H.call(console, `${a}`, ..._);
  }, h = typeof d.group == "function" ? d.group.bind(d) : (..._) => {
    var H;
    return (H = console.groupCollapsed) == null ? void 0 : H.call(console, `${a}`, ..._);
  }, p = typeof d.groupEnd == "function" ? d.groupEnd.bind(d) : () => {
    var _;
    return (_ = console.groupEnd) == null ? void 0 : _.call(console);
  }, w = Symbol(`EIDOLON_SCENE_CONFIG_TAB_CLEANUP_${t}`), b = typeof i == "function" ? i : () => null, v = typeof r == "function" ? r : () => !0, S = typeof n == "function" ? n : () => typeof n == "string" ? n : t;
  function I() {
    var W, q, U, J, oe;
    const _ = ((q = (W = foundry == null ? void 0 : foundry.applications) == null ? void 0 : W.sheets) == null ? void 0 : q.SceneConfig) ?? ((U = CONFIG == null ? void 0 : CONFIG.Scene) == null ? void 0 : U.sheetClass);
    if (!_ || !yo({ changeTab: (J = _.prototype) == null ? void 0 : J.changeTab })) return;
    const H = _[Fc] ?? /* @__PURE__ */ new Set();
    if (H.has(t)) return;
    H.add(t), _[Fc] = H;
    const B = (oe = _.TABS) == null ? void 0 : oe.sheet;
    if (B && Array.isArray(B.tabs) && !B.tabs.some((X) => X.id === t)) {
      const X = S({ app: null, scene: null }) ?? t;
      B.tabs.push({
        id: t,
        icon: g,
        label: X
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
    if (!v(_, B)) {
      y("Skipped render", {
        tabId: t,
        reason: "inapplicable",
        constructor: ((W = _ == null ? void 0 : _.constructor) == null ? void 0 : W.name) ?? null
      });
      return;
    }
    h("render", {
      tabId: t,
      sceneId: (B == null ? void 0 : B.id) ?? null,
      constructor: ((q = _ == null ? void 0 : _.constructor) == null ? void 0 : q.name) ?? null
    });
    try {
      const U = At(H) ?? At(_.element);
      if (!U) {
        y("Missing root element", { tabId: t });
        return;
      }
      yo(_) ? x(_, U, B) : M(_, U, B);
    } finally {
      p();
    }
  }
  c(O, "handleRender");
  function k(_, H, B) {
    var U;
    if (!g) {
      _.textContent = H;
      return;
    }
    const W = (U = _.querySelector("i")) == null ? void 0 : U.cloneNode(!0);
    _.textContent = "";
    const q = W ?? document.createElement("i");
    if (W || (q.className = g, B && (q.inert = !0)), _.append(q, " "), B) {
      const J = document.createElement("span");
      J.textContent = H, _.append(J);
    } else
      _.append(document.createTextNode(H));
  }
  c(k, "setButtonContent");
  function M(_, H, B) {
    var et, Bt, ze, Ce, yi, Ut, Fn, tt, Vt, P, Yr, Q, ft, Oe, Yi, Qr;
    const q = [
      "nav.sheet-tabs[data-group]",
      "nav.tabs[data-group]",
      "nav.sheet-tabs",
      "nav.tabs"
    ].map((Ae) => H.querySelector(Ae)).find((Ae) => Ae instanceof HTMLElement), J = [
      (et = H.querySelector(".tab[data-tab]")) == null ? void 0 : et.parentElement,
      H.querySelector(".sheet-body"),
      (ze = (Bt = q == null ? void 0 : q.parentElement) == null ? void 0 : Bt.querySelector) == null ? void 0 : ze.call(Bt, ":scope > .sheet-body"),
      q == null ? void 0 : q.parentElement
    ].find((Ae) => Ae instanceof HTMLElement), oe = ((Ce = q == null ? void 0 : q.dataset) == null ? void 0 : Ce.group) ?? ((Fn = (Ut = (yi = q == null ? void 0 : q.querySelector) == null ? void 0 : yi.call(q, "a[data-group]")) == null ? void 0 : Ut.dataset) == null ? void 0 : Fn.group) ?? ((P = (Vt = (tt = q == null ? void 0 : q.querySelector) == null ? void 0 : tt.call(q, "[data-group]")) == null ? void 0 : Vt.dataset) == null ? void 0 : P.group) ?? ((ft = (Q = (Yr = J == null ? void 0 : J.querySelector) == null ? void 0 : Yr.call(J, ".tab[data-group]")) == null ? void 0 : Q.dataset) == null ? void 0 : ft.group) ?? "main";
    if (!q || !J) {
      y("Missing navigation elements", {
        tabId: t,
        hasNav: !!q,
        hasBody: !!J
      });
      return;
    }
    let X = q.querySelector(`[data-tab="${t}"]`);
    if (!X) {
      X = document.createElement("a"), X.dataset.action = "tab", X.dataset.group = oe, X.dataset.tab = t;
      const Ae = q.querySelector("a[data-tab]");
      (Oe = Ae == null ? void 0 : Ae.classList) != null && Oe.contains("item") && X.classList.add("item"), q.appendChild(X), typeof s == "function" && s({ app: _, button: X, nav: q, scene: B }), y("Created tab button", { tabId: t, group: oe });
    }
    k(X, S({ app: _, scene: B }) ?? t, yo(_));
    let te = J.querySelector(`.tab[data-tab="${t}"]`);
    if (!te) {
      te = document.createElement("div"), te.classList.add("tab"), te.dataset.tab = t, te.dataset.group = oe;
      const Ae = yd(J);
      J.insertBefore(te, Ae ?? null), typeof l == "function" && l({ app: _, tab: te, body: J, scene: B }), y("Created tab container", { tabId: t, group: oe });
    }
    ((Yi = X.classList) == null ? void 0 : Yi.contains("active")) || te.classList.contains("active") ? (X.classList.add("active"), te.classList.add("active"), te.removeAttribute("hidden")) : (X.classList.remove("active"), te.classList.remove("active"), te.setAttribute("hidden", "true"));
    const dt = /* @__PURE__ */ c(() => {
      var xn, Qi;
      ((xn = X.classList) != null && xn.contains("active") || te.classList.contains("active")) && ((Qi = X.classList) == null || Qi.add("active"), te.classList.add("active"), te.removeAttribute("hidden"), te.removeAttribute("aria-hidden"), te.style.display === "none" && (te.style.display = ""));
    }, "ensureTabVisible"), _e = /* @__PURE__ */ c(() => {
      dt(), requestAnimationFrame(dt);
    }, "scheduleEnsureTabVisible");
    X.dataset.eidolonEnsureSceneTabVisibility || (X.addEventListener("click", () => {
      hd(_, t, oe), requestAnimationFrame(dt);
    }), X.dataset.eidolonEnsureSceneTabVisibility = "true"), rs(_, w, y);
    const Ze = o({
      app: _,
      scene: B,
      tab: te,
      tabButton: X,
      ensureTabVisible: dt,
      scheduleEnsureTabVisible: _e
    });
    typeof Ze == "function" && xc(_, w, Ze), typeof u == "function" && u({
      app: _,
      scene: B,
      tab: te,
      tabButton: X,
      ensureTabVisible: dt,
      scheduleEnsureTabVisible: _e
    }), (Qr = _.setPosition) == null || Qr.call(_, { height: "auto" });
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
      var X;
      !((X = q.classList) != null && X.contains("active")) && !W.classList.contains("active") || (W.classList.add("active"), W.removeAttribute("hidden"), W.removeAttribute("aria-hidden"), W.style.display === "none" && (W.style.display = ""));
    }, "ensureTabVisible"), J = /* @__PURE__ */ c(() => {
      U(), requestAnimationFrame(U);
    }, "scheduleEnsureTabVisible");
    rs(_, w, y);
    const oe = o({
      app: _,
      scene: B,
      tab: W,
      tabButton: q,
      ensureTabVisible: U,
      scheduleEnsureTabVisible: J
    });
    typeof oe == "function" && xc(_, w, oe), typeof u == "function" && u({
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
    rs(_, w, y);
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
        } catch (o) {
          n("Cleanup failed", { message: (o == null ? void 0 : o.message) ?? String(o) });
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
const Bm = Da(Js), Um = `modules/${T}/templates/time-trigger-scene-tab.html`, Vm = pd({
  tabId: "time-triggers",
  tabLabel: /* @__PURE__ */ c(() => E("EIDOLON.TimeTrigger.Tab", "Time Triggers"), "tabLabel"),
  getScene: qt,
  isApplicable: Km,
  renderContent: /* @__PURE__ */ c(({ app: e, scene: t, tab: n }) => Gm(e, n, t), "renderContent"),
  logger: {
    log: N,
    group: ji,
    groupEnd: Sn
  }
});
function zm() {
  return N("Registering SceneConfig render hook"), Vm.register();
}
c(zm, "registerSceneConfigHook");
function Gm(e, t, n) {
  if (!(t instanceof HTMLElement)) return;
  const i = Ue(n) ? n : qt(e);
  Fo(e, t, i);
  const r = Yl(() => {
    Fo(e, t, i);
  });
  return () => {
    if (typeof r == "function")
      try {
        r();
      } catch (o) {
        console.error(
          `${T} | Failed to dispose scene config time format subscription`,
          o
        );
      }
  };
}
c(Gm, "renderTimeTriggerTab");
async function Fo(e, t, n) {
  var r, o;
  const i = n ?? qt(e);
  ji("renderTimeTriggersTabContent", { sceneId: (i == null ? void 0 : i.id) ?? null });
  try {
    if (!Ue(i)) {
      const W = E(
        "EIDOLON.TimeTrigger.Unavailable",
        "Time triggers are unavailable for this configuration sheet."
      );
      t.innerHTML = `<p class="notes">${W}</p>`, N("Scene lacks document for time triggers", { sceneId: (i == null ? void 0 : i.id) ?? null });
      return;
    }
    const a = `flags.${T}.${Mo}`, s = `flags.${T}.${Es}`, l = `flags.${T}.${Ss}`, u = !!i.getFlag(T, Mo), d = !!i.getFlag(T, Es), m = !!i.getFlag(T, Ss), g = Mi(i);
    N("Rendering time trigger list", {
      sceneId: i.id,
      isActive: u,
      shouldHideWindow: d,
      shouldShowPlayerWindow: m,
      triggerCount: g.length
    });
    const y = E("EIDOLON.TimeTrigger.Activate", "Activate Time Trigger"), h = E(
      "EIDOLON.TimeTrigger.Description",
      "Enable scene time triggers so scheduled actions can run automatically."
    ), p = E(
      "EIDOLON.TimeTrigger.HideWindowLabel",
      "Hide Floating Time Window"
    ), w = E(
      "EIDOLON.TimeTrigger.HideWindowDescription",
      "Keep the floating time control window hidden while leaving time triggers active."
    ), b = E(
      "EIDOLON.TimeTrigger.ShowPlayerWindowLabel",
      "Share Floating Time Window with Players"
    ), v = E(
      "EIDOLON.TimeTrigger.ShowPlayerWindowDescription",
      "Let non-GM players see the floating time window (without time controls)."
    ), S = E(
      "EIDOLON.TimeTrigger.TriggerListLabel",
      "Scene Time Triggers"
    ), I = E(
      "EIDOLON.TimeTrigger.TriggerListEmpty",
      "No time triggers configured for this scene."
    ), O = E("EIDOLON.TimeTrigger.AddTrigger", "Add Trigger"), k = E("EIDOLON.TimeTrigger.EditTrigger", "Edit"), M = E("EIDOLON.TimeTrigger.DeleteTrigger", "Remove"), x = E("EIDOLON.TimeTrigger.TriggerNow", "Trigger Now"), R = E("EIDOLON.TimeTrigger.AtLabel", "At"), F = E("EIDOLON.TimeTrigger.DoLabel", "Do"), D = E("EIDOLON.TimeTrigger.MissingTime", "(No time set)"), _ = g.map((W, q) => {
      const oe = (W.time ? Pm(W.time) : "") || W.time || "" || D, X = Mm(W.action), te = [
        `${R} ${oe}`,
        `${F} ${X}`,
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
    }), H = ((o = (r = foundry == null ? void 0 : foundry.applications) == null ? void 0 : r.handlebars) == null ? void 0 : o.renderTemplate) ?? (typeof renderTemplate == "function" ? renderTemplate : globalThis == null ? void 0 : globalThis.renderTemplate);
    if (typeof H != "function") {
      console.error(`${T} | renderTemplate is unavailable; cannot render scene tab.`), t.innerHTML = `<p class="notes">${I}</p>`;
      return;
    }
    let B = "";
    try {
      B = await H(Um, {
        flags: {
          active: a,
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
          hideWindow: p,
          showPlayerWindow: b,
          triggerList: S,
          empty: I,
          add: O
        },
        hints: {
          activate: h,
          hideWindow: w,
          showPlayerWindow: v
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
    Sn();
  }
}
c(Fo, "renderTimeTriggersTabContent");
function Wm(e, t, n) {
  const i = n ?? qt(e);
  if (!Ue(i)) return;
  const r = t.querySelector('[data-action="add-trigger"]');
  r && r.addEventListener("click", () => {
    N("Add trigger button clicked", { sceneId: i.id }), Pc(e, { scene: i });
  }), t.querySelectorAll('[data-action="edit-trigger"]').forEach((o) => {
    o.addEventListener("click", () => {
      const a = Number(o.dataset.index);
      if (!Number.isInteger(a)) return;
      const l = Mi(i)[a];
      l && (N("Edit trigger button clicked", { sceneId: i.id, triggerId: l.id, index: a }), Pc(e, { trigger: l, triggerIndex: a, scene: i }));
    });
  }), t.querySelectorAll('[data-action="delete-trigger"]').forEach((o) => {
    o.addEventListener("click", async () => {
      var u, d;
      const a = Number(o.dataset.index);
      if (!Number.isInteger(a)) return;
      const s = Mi(i), l = s[a];
      if (l) {
        s.splice(a, 1);
        try {
          N("Deleting trigger", {
            sceneId: i.id,
            index: a,
            triggerId: (l == null ? void 0 : l.id) ?? null
          }), await Wu(i, s), await Fo(e, t, i);
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
  }), t.querySelectorAll('[data-action="fire-trigger"]').forEach((o) => {
    o.addEventListener("click", async () => {
      var u, d, m, g, y, h, p;
      const a = Number(o.dataset.index);
      if (!Number.isInteger(a)) return;
      const l = Mi(i)[a];
      if (l) {
        if (!((u = game.user) != null && u.isGM)) {
          (m = (d = ui.notifications) == null ? void 0 : d.warn) == null || m.call(
            d,
            E("EIDOLON.TimeTrigger.GMOnly", "Only the GM can adjust time.")
          );
          return;
        }
        try {
          N("Manually firing trigger", { sceneId: i.id, triggerId: l.id, index: a }), await Ku(i, l), (y = (g = ui.notifications) == null ? void 0 : g.info) == null || y.call(
            g,
            E(
              "EIDOLON.TimeTrigger.TriggerNowSuccess",
              "Triggered the selected time trigger."
            )
          );
        } catch (w) {
          console.error(`${T} | Failed to execute time trigger manually`, w), (p = (h = ui.notifications) == null ? void 0 : h.error) == null || p.call(
            h,
            E(
              "EIDOLON.TimeTrigger.TriggerNowError",
              "Failed to execute the selected time trigger."
            )
          ), N("Manual trigger execution failed", {
            sceneId: i.id,
            triggerId: l.id,
            index: a,
            message: (w == null ? void 0 : w.message) ?? String(w)
          });
        }
      }
    });
  });
}
c(Wm, "bindTimeTriggerTabEvents");
function Pc(e, t = {}) {
  var a;
  const n = t.scene ?? null, i = n && Ue(n) ? n : qt(e);
  if (!Ue(i)) {
    console.warn(`${T} | Unable to open trigger form because no scene document is available.`);
    return;
  }
  N("Opening trigger form", {
    sceneId: i.id,
    triggerId: ((a = t.trigger) == null ? void 0 : a.id) ?? null,
    index: Number.isInteger(t.triggerIndex) ? Number(t.triggerIndex) : null
  }), Bm({
    scene: i,
    trigger: t.trigger ?? null,
    triggerIndex: t.triggerIndex ?? null,
    onSave: /* @__PURE__ */ c(() => {
      var l, u;
      const s = (u = (l = e.element) == null ? void 0 : l[0]) == null ? void 0 : u.querySelector('.tab[data-tab="time-triggers"]');
      s && Fo(e, s, i);
    }, "onSave")
  }).render({ force: !0 });
}
c(Pc, "openTriggerForm");
function Km(e, t) {
  var o, a, s, l, u;
  if (!e) return !1;
  const n = ((a = (o = foundry == null ? void 0 : foundry.applications) == null ? void 0 : o.sheets) == null ? void 0 : a.SceneConfig) ?? (globalThis == null ? void 0 : globalThis.SceneConfig);
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
const to = new js(), Rc = new Bs();
function Jm() {
  N("Registering time trigger hooks"), Hooks.once("init", () => {
    wm(), Im(), N("Time trigger settings registered during init");
  }), zm(), N("Scene config hook registered"), Rc.registerHooks(), N("Time automation hooks registered"), Hooks.once("ready", () => {
    Om(), N("Ready hook fired"), to.onReady(), Rc.initialize();
  }), Hooks.on("canvasReady", (e) => {
    var t;
    N("canvasReady hook received", { scene: ((t = e == null ? void 0 : e.scene) == null ? void 0 : t.id) ?? null }), to.onCanvasReady(e);
  }), Hooks.on("updateScene", (e) => {
    N("updateScene hook received", { scene: (e == null ? void 0 : e.id) ?? null }), to.onUpdateScene(e);
  }), Hooks.on("updateWorldTime", (e, t) => {
    N("updateWorldTime hook received", { worldTime: e, diff: t }), to.onUpdateWorldTime(e, t);
  });
}
c(Jm, "registerTimeTriggerHooks");
Jm();
const we = T, bd = "criteria", Xl = "state", Ym = "criteriaVersion", Qm = 1, vd = "enableCriteriaSurfaces";
let Hc = !1;
function Xm() {
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
c(Xm, "registerSceneCriteriaSettings");
function Fa() {
  var e;
  try {
    if ((e = game == null ? void 0 : game.settings) != null && e.get)
      return !!game.settings.get(we, vd);
  } catch (t) {
    console.error(`${we} | Failed to read criteria surfaces setting`, t);
  }
  return !0;
}
c(Fa, "getCriteriaSurfacesEnabled");
function Zm() {
  var o, a, s, l, u;
  const e = E("EIDOLON.SceneCriteria.ReloadPromptTitle", "Reload Required"), t = `<p>${E(
    "EIDOLON.SceneCriteria.ReloadPromptBody",
    "Changes to criteria editor surfaces require a reload. Reload now?"
  )}</p>`, n = typeof ((o = foundry == null ? void 0 : foundry.utils) == null ? void 0 : o.debouncedReload) == "function", i = /* @__PURE__ */ c(() => {
    n ? foundry.utils.debouncedReload() : window.location.reload();
  }, "reload"), r = (s = (a = foundry == null ? void 0 : foundry.applications) == null ? void 0 : a.api) == null ? void 0 : s.DialogV2;
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
const xo = "Standard";
function ut(e) {
  var n;
  const t = (n = e == null ? void 0 : e.getFlag) == null ? void 0 : n.call(e, we, bd);
  return t ? wd(t) : [];
}
c(ut, "getSceneCriteria");
async function xa(e, t) {
  if (!(e != null && e.setFlag)) return;
  const n = wd(t);
  await e.setFlag(we, bd, n), await e.setFlag(we, Ym, Qm);
  const i = Gr(e, n);
  await e.setFlag(we, Xl, i);
}
c(xa, "setSceneCriteria");
function Gr(e, t = null) {
  var r;
  const n = Array.isArray(t) ? t : ut(e), i = Ht(((r = e == null ? void 0 : e.getFlag) == null ? void 0 : r.call(e, we, Xl)) ?? {});
  return ec(i, n);
}
c(Gr, "getSceneCriteriaState");
async function eg(e, t, n = null) {
  if (!(e != null && e.setFlag)) return;
  const i = Array.isArray(n) ? n : ut(e), r = ec(t, i);
  await e.setFlag(we, Xl, r);
}
c(eg, "setSceneCriteriaState");
function Zl(e = "") {
  const t = typeof e == "string" ? e.trim() : "", n = Ed(Xs(t || "criterion"), /* @__PURE__ */ new Set());
  return {
    id: Sd(),
    key: n,
    label: t,
    values: [xo],
    default: xo,
    order: 0
  };
}
c(Zl, "createSceneCriterion");
function wd(e) {
  const t = Array.isArray(e) ? Ht(e) : [], n = [], i = /* @__PURE__ */ new Set();
  return t.forEach((r, o) => {
    const a = Qs(r, o, i);
    a && (n.push(a), i.add(a.key));
  }), n;
}
c(wd, "sanitizeCriteria$1");
function Qs(e, t = 0, n = /* @__PURE__ */ new Set()) {
  if (!e || typeof e != "object") return null;
  const i = typeof e.id == "string" && e.id.trim() ? e.id.trim() : Sd(), o = (typeof e.label == "string" ? e.label : typeof e.name == "string" ? e.name : "").trim(), a = typeof e.key == "string" && e.key.trim() ? Xs(e.key) : Xs(o || `criterion-${Number(t) + 1}`), s = Ed(a, n), l = ng(e.values);
  let u = typeof e.default == "string" ? e.default.trim() : "";
  u || (u = l[0] ?? xo), l.includes(u) || l.unshift(u);
  const d = Number.isFinite(e.order) ? Number(e.order) : Number(t);
  return {
    id: i,
    key: s,
    label: o,
    values: l,
    default: u,
    order: d
  };
}
c(Qs, "sanitizeCriterion");
function ec(e, t = []) {
  const n = e && typeof e == "object" ? Ht(e) : {}, i = {};
  for (const r of t) {
    const o = n == null ? void 0 : n[r.key], a = typeof o == "string" ? o.trim() : "";
    a && r.values.includes(a) ? i[r.key] = a : i[r.key] = r.default;
  }
  return i;
}
c(ec, "sanitizeSceneCriteriaState");
function tg(e) {
  return ut(e).map((n) => ({
    id: n.key,
    key: n.key,
    name: n.label,
    values: [...n.values]
  }));
}
c(tg, "getSceneCriteriaCategories");
function ng(e) {
  const t = Array.isArray(e) ? e : [], n = [];
  for (const i of t) {
    if (typeof i != "string") continue;
    const r = i.trim();
    !r || n.includes(r) || n.push(r);
  }
  return n.length || n.push(xo), n;
}
c(ng, "sanitizeCriterionValues");
function Xs(e) {
  return String(e ?? "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "criterion";
}
c(Xs, "slugifyCriterionKey");
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
var Fu, me, Xt, Ne, Td, Ta, La, Ia, Oa, bo, Aa, Or, Ar, ir, Ld;
const Kt = class Kt extends Dn($n) {
  constructor(n = {}) {
    const { scene: i, criterion: r, isNew: o, onSave: a, ...s } = n ?? {};
    super(s);
    A(this, Ne);
    A(this, me, null);
    A(this, Xt, !1);
    A(this, Ta, /* @__PURE__ */ c(async (n) => {
      n.preventDefault();
      const i = n.currentTarget;
      if (!(i instanceof HTMLFormElement)) return;
      const r = new FormData(i), o = String(r.get("criterionLabel") ?? "").trim(), a = String(r.get("criterionKey") ?? "").trim(), s = Array.from(i.querySelectorAll('[name="criterionValues"]')).map((m) => m instanceof HTMLInputElement ? m.value.trim() : "").filter((m, g, y) => m && y.indexOf(m) === g), u = String(r.get("criterionDefault") ?? "").trim() || s[0] || "Standard", d = Qs(
        {
          id: f(this, me).id,
          key: a,
          label: o,
          values: s,
          default: u,
          order: Number(f(this, me).order ?? 0)
        },
        0,
        /* @__PURE__ */ new Set()
      );
      d && (L(this, me, d), await C(this, Ne, Ld).call(this), this.close());
    }, "#onSubmit"));
    A(this, La, /* @__PURE__ */ c((n) => {
      var a;
      if (f(this, Xt)) return;
      const i = n.currentTarget, r = (i == null ? void 0 : i.form) ?? ((a = this.element) == null ? void 0 : a.querySelector("form"));
      if (!(r instanceof HTMLFormElement)) return;
      const o = r.querySelector('input[name="criterionKey"]');
      o instanceof HTMLInputElement && (o.value = er(i.value));
    }, "#onLabelInput"));
    A(this, Ia, /* @__PURE__ */ c((n) => {
      var l;
      const i = n.currentTarget, r = (i == null ? void 0 : i.form) ?? ((l = this.element) == null ? void 0 : l.querySelector("form"));
      if (!(r instanceof HTMLFormElement) || !(i instanceof HTMLInputElement)) return;
      const o = r.querySelector('input[name="criterionLabel"]'), a = er(o instanceof HTMLInputElement ? o.value : ""), s = er(i.value);
      L(this, Xt, s !== a), i.value = s, C(this, Ne, bo).call(this, r);
    }, "#onKeyInput"));
    A(this, Oa, /* @__PURE__ */ c((n) => {
      var a, s;
      n.preventDefault();
      const i = ((a = n.currentTarget) == null ? void 0 : a.form) ?? ((s = this.element) == null ? void 0 : s.querySelector("form"));
      if (!(i instanceof HTMLFormElement)) return;
      const r = i.querySelector('input[name="criterionLabel"]'), o = i.querySelector('input[name="criterionKey"]');
      o instanceof HTMLInputElement && (o.value = er(r instanceof HTMLInputElement ? r.value : ""), L(this, Xt, !1), C(this, Ne, bo).call(this, i));
    }, "#onResetAutoKey"));
    A(this, Aa, /* @__PURE__ */ c((n) => {
      var l, u, d, m, g, y;
      n.preventDefault();
      const i = ((l = n.currentTarget) == null ? void 0 : l.form) ?? ((u = this.element) == null ? void 0 : u.querySelector("form"));
      if (!(i instanceof HTMLFormElement)) return;
      const r = i.querySelector(".scene-criterion-editor__values");
      if (!(r instanceof HTMLElement)) return;
      (d = r.querySelector(".scene-criterion-editor__empty")) == null || d.remove();
      const o = document.createElement("div");
      o.classList.add("scene-criterion-editor__value");
      const a = It(E("EIDOLON.SceneCriteria.ValuePlaceholder", "Allowed value")), s = It(E("EIDOLON.SceneCriteria.RemoveValue", "Remove Value"));
      o.innerHTML = `
      <input type="text" name="criterionValues" value="" placeholder="${a}" class="form-control">
      <button type="button" class="icon" data-action="remove-value" aria-label="${s}" title="${s}">
        <i class="fa-solid fa-trash"></i>
      </button>
    `, r.appendChild(o), (m = o.querySelector('[data-action="remove-value"]')) == null || m.addEventListener("click", f(this, Or)), (g = o.querySelector('input[name="criterionValues"]')) == null || g.addEventListener("input", f(this, Ar)), C(this, Ne, ir).call(this, i), (y = o.querySelector('input[name="criterionValues"]')) == null || y.focus();
    }, "#onAddValue"));
    A(this, Or, /* @__PURE__ */ c((n) => {
      var o, a, s, l;
      n.preventDefault(), (a = (o = n.currentTarget) == null ? void 0 : o.closest(".scene-criterion-editor__value")) == null || a.remove();
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
      var r, o;
      const i = ((r = n.currentTarget) == null ? void 0 : r.form) ?? ((o = this.element) == null ? void 0 : o.querySelector("form"));
      i instanceof HTMLFormElement && C(this, Ne, ir).call(this, i);
    }, "#onValuesChanged"));
    this.scene = i ?? null, this.criterion = r ?? null, this.onSave = typeof a == "function" ? a : null, this.isNew = !!o, L(this, me, C(this, Ne, Td).call(this)), L(this, Xt, f(this, me).key !== er(f(this, me).label));
  }
  async _prepareContext() {
    var i, r, o, a;
    const n = Array.isArray((i = f(this, me)) == null ? void 0 : i.values) ? f(this, me).values : [];
    return {
      isNew: this.isNew,
      key: ((r = f(this, me)) == null ? void 0 : r.key) ?? "",
      label: ((o = f(this, me)) == null ? void 0 : o.label) ?? "",
      defaultValue: ((a = f(this, me)) == null ? void 0 : a.default) ?? "",
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
      keyIsCustom: f(this, Xt)
    };
  }
  _onRender(n, i) {
    var o, a, s, l, u, d;
    super._onRender(n, i);
    const r = (o = this.element) == null ? void 0 : o.querySelector("form");
    r && (r.addEventListener("submit", f(this, Ta)), (a = r.querySelector('[data-action="add-value"]')) == null || a.addEventListener("click", f(this, Aa)), (s = r.querySelector('input[name="criterionLabel"]')) == null || s.addEventListener("input", f(this, La)), (l = r.querySelector('input[name="criterionKey"]')) == null || l.addEventListener("input", f(this, Ia)), (u = r.querySelector('[data-action="reset-auto-key"]')) == null || u.addEventListener("click", f(this, Oa)), r.querySelectorAll('[data-action="remove-value"]').forEach((m) => {
      m.addEventListener("click", f(this, Or));
    }), r.querySelectorAll('input[name="criterionValues"]').forEach((m) => {
      m.addEventListener("input", f(this, Ar));
    }), (d = r.querySelector('[data-action="cancel"]')) == null || d.addEventListener("click", (m) => {
      m.preventDefault(), this.close();
    }), C(this, Ne, bo).call(this, r), C(this, Ne, ir).call(this, r));
  }
};
me = new WeakMap(), Xt = new WeakMap(), Ne = new WeakSet(), Td = /* @__PURE__ */ c(function() {
  const n = Qs(this.criterion, 0, /* @__PURE__ */ new Set()) ?? Zl(E("EIDOLON.SceneCriteria.DefaultCategoryName", "New Criterion"));
  return {
    id: n.id,
    key: n.key,
    label: n.label ?? "",
    values: Array.isArray(n.values) ? [...n.values] : [],
    default: n.default
  };
}, "#initializeState"), Ta = new WeakMap(), La = new WeakMap(), Ia = new WeakMap(), Oa = new WeakMap(), bo = /* @__PURE__ */ c(function(n) {
  const i = n.querySelector('[data-action="reset-auto-key"]');
  i instanceof HTMLButtonElement && (i.disabled = !f(this, Xt));
}, "#syncAutoKeyButton"), Aa = new WeakMap(), Or = new WeakMap(), Ar = new WeakMap(), ir = /* @__PURE__ */ c(function(n) {
  var l, u;
  const i = n.querySelector('select[name="criterionDefault"]');
  if (!(i instanceof HTMLSelectElement)) return;
  const r = ((u = (l = i.value) == null ? void 0 : l.trim) == null ? void 0 : u.call(l)) ?? "", o = Array.from(n.querySelectorAll('input[name="criterionValues"]')).map((d) => d instanceof HTMLInputElement ? d.value.trim() : "").filter((d, m, g) => d && g.indexOf(d) === m), a = i.dataset.emptyLabel || E("EIDOLON.SceneCriteria.ValueListEmpty", "No values have been added to this criterion.");
  if (i.innerHTML = "", !o.length) {
    const d = document.createElement("option");
    d.value = "", d.textContent = a, d.selected = !0, i.appendChild(d);
    return;
  }
  const s = o.includes(r) ? r : o[0];
  for (const d of o) {
    const m = document.createElement("option");
    m.value = d, m.textContent = d, m.selected = d === s, i.appendChild(m);
  }
}, "#syncDefaultOptions"), Ld = /* @__PURE__ */ c(async function() {
  if (!this.scene) return;
  const n = ut(this.scene).sort((r, o) => r.order - o.order), i = n.findIndex((r) => r.id === f(this, me).id);
  i < 0 ? (f(this, me).order = n.length, n.push(f(this, me))) : (f(this, me).order = n[i].order, n.splice(i, 1, f(this, me)));
  try {
    await xa(this.scene, n), this.onSave && await this.onSave(f(this, me));
  } catch (r) {
    Cd(r);
  }
}, "#persist"), c(Kt, "CategoryEditorApplication"), pe(Kt, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  $e(Kt, Kt, "DEFAULT_OPTIONS"),
  {
    id: `${we}-criterion-editor`,
    classes: Array.from(
      /* @__PURE__ */ new Set([...((Fu = $e(Kt, Kt, "DEFAULT_OPTIONS")) == null ? void 0 : Fu.classes) ?? [], "standard-form", "themed"])
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
)), pe(Kt, "PARTS", {
  content: {
    template: `modules/${we}/templates/scene-criteria-editor.html`
  }
});
let Zs = Kt;
function er(e) {
  return String(e ?? "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "criterion";
}
c(er, "slugifyKey");
const ig = `modules/${we}/templates/scene-criteria-tab.html`, el = {
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
}, rg = Da(Zs), og = pd({
  tabId: "criteria",
  tabLabel: /* @__PURE__ */ c(() => E("EIDOLON.SceneCriteria.TabLabel", "Criteria"), "tabLabel"),
  getScene: qt,
  isApplicable: /* @__PURE__ */ c(() => Fa(), "isApplicable"),
  renderContent: /* @__PURE__ */ c(({ app: e, tab: t, scene: n }) => sg(e, t, n), "renderContent"),
  logger: el
});
function ag() {
  return og.register();
}
c(ag, "registerSceneCriteriaConfigHook");
function sg(e, t, n) {
  if (!(t instanceof HTMLElement)) return;
  const i = Ue(n) ? n : qt(e);
  Si(e, t, i);
}
c(sg, "renderCriteriaTab");
async function Si(e, t, n) {
  var r, o;
  const i = n ?? qt(e);
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
    const a = ut(i).sort((d, m) => d.order - m.order), s = Gr(i, a), l = ((o = (r = foundry == null ? void 0 : foundry.applications) == null ? void 0 : r.handlebars) == null ? void 0 : o.renderTemplate) ?? (typeof renderTemplate == "function" ? renderTemplate : globalThis == null ? void 0 : globalThis.renderTemplate);
    if (typeof l != "function") {
      t.innerHTML = `<p class="notes">${E("EIDOLON.SceneCriteria.CategoryListEmpty", "No criteria configured for this scene.")}</p>`;
      return;
    }
    const u = await l(ig, {
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
        criteriaCount: a.length,
        valueCount: a.reduce((d, m) => d + m.values.length, 0)
      },
      criteria: a.map((d, m) => {
        var g, y;
        return {
          id: d.id,
          label: d.label,
          displayName: ((y = (g = d.label) == null ? void 0 : g.trim) == null ? void 0 : y.call(g)) || E("EIDOLON.SceneCriteria.UnnamedCategory", "Unnamed Criterion"),
          hasValues: d.values.length > 0,
          values: d.values.map((h) => ({
            value: h,
            isCurrent: (s[d.key] ?? d.default) === h
          })),
          valueCountLabel: cg(d.values.length),
          canMoveUp: m > 0,
          canMoveDown: m < a.length - 1
        };
      }),
      hasCriteria: a.length > 0
    });
    t.innerHTML = u, lg(e, t, i);
  } catch (a) {
    console.error(`${we} | Failed to render criteria tab`, a), t.innerHTML = `<p class="notes">${E("EIDOLON.SceneCriteria.CategoryListEmpty", "No criteria configured for this scene.")}</p>`;
  } finally {
    el.groupEnd();
  }
}
c(Si, "renderCriteriaTabContent");
function lg(e, t, n) {
  const i = n ?? qt(e);
  if (!Ue(i)) return;
  const r = t.querySelector('[data-criteria-action="add"]');
  r && r.addEventListener("click", () => {
    qc(e, {
      scene: i,
      criterion: Zl(
        E("EIDOLON.SceneCriteria.DefaultCategoryName", "New Criterion")
      ),
      isNew: !0,
      onSave: /* @__PURE__ */ c(() => Si(e, t, i), "onSave")
    });
  }), t.querySelectorAll('[data-criteria-action="edit"]').forEach((o) => {
    const a = o.dataset.criterionId;
    a && o.addEventListener("click", () => {
      const s = ut(i).find((l) => l.id === a);
      s && qc(e, {
        scene: i,
        criterion: s,
        onSave: /* @__PURE__ */ c(() => Si(e, t, i), "onSave")
      });
    });
  }), t.querySelectorAll('[data-criteria-action="remove"]').forEach((o) => {
    const a = o.dataset.criterionId;
    a && o.addEventListener("click", async () => {
      await os(i, (l) => {
        const u = l.findIndex((d) => d.id === a);
        return u < 0 ? !1 : (l.splice(u, 1), as(l), !0);
      }) && await Si(e, t, i);
    });
  }), t.querySelectorAll('[data-criteria-action="move-up"]').forEach((o) => {
    const a = o.dataset.criterionId;
    a && o.addEventListener("click", async () => {
      await os(i, (l) => {
        const u = l.findIndex((m) => m.id === a);
        if (u <= 0) return !1;
        const [d] = l.splice(u, 1);
        return l.splice(u - 1, 0, d), as(l), !0;
      }) && await Si(e, t, i);
    });
  }), t.querySelectorAll('[data-criteria-action="move-down"]').forEach((o) => {
    const a = o.dataset.criterionId;
    a && o.addEventListener("click", async () => {
      await os(i, (l) => {
        const u = l.findIndex((m) => m.id === a);
        if (u < 0 || u >= l.length - 1) return !1;
        const [d] = l.splice(u, 1);
        return l.splice(u + 1, 0, d), as(l), !0;
      }) && await Si(e, t, i);
    });
  });
}
c(lg, "bindCriteriaTabEvents");
async function os(e, t) {
  const n = ut(e).sort((r, o) => r.order - o.order);
  if (t(n) === !1) return !1;
  try {
    return await xa(e, n), !0;
  } catch (r) {
    return Cd(r), !1;
  }
}
c(os, "mutateCriteria");
function qc(e, t = {}) {
  const n = t.scene ?? null, i = n && Ue(n) ? n : qt(e);
  if (!Ue(i))
    return;
  rg({
    scene: i,
    criterion: t.criterion ?? null,
    isNew: !!t.isNew,
    onSave: typeof t.onSave == "function" ? t.onSave : null
  }).render({ force: !0 });
}
c(qc, "openCriterionEditor");
function as(e) {
  e.forEach((t, n) => {
    t.order = n;
  });
}
c(as, "reindexCriteriaOrder");
function cg(e) {
  var t, n;
  if ((n = (t = game.i18n) == null ? void 0 : t.has) != null && n.call(t, "EIDOLON.SceneCriteria.ValueCountLabel"))
    try {
      return game.i18n.format("EIDOLON.SceneCriteria.ValueCountLabel", { count: e });
    } catch (i) {
      console.error(`${we} | Failed to format value count label`, i);
    }
  return e === 0 ? "No values configured" : e === 1 ? "1 value" : `${e} values`;
}
c(cg, "formatValueCount");
let jc = !1;
function ug() {
  Hooks.once("init", () => {
    Xm();
  }), Hooks.once("ready", () => {
    Fa() && (jc || (ag(), jc = !0));
  });
}
c(ug, "registerSceneCriteriaHooks");
ug();
const ie = T, Id = "criteriaEngineVersion", ri = "fileIndex", oi = "tileCriteria", tc = {
  LEGACY: 1,
  CRITERIA: 2
}, Od = tc.CRITERIA;
function Ad(e) {
  var t;
  return ((t = e == null ? void 0 : e.getFlag) == null ? void 0 : t.call(e, ie, Id)) ?? tc.LEGACY;
}
c(Ad, "getSceneEngineVersion");
function dg(e, t, n, i, r) {
  if (!(e != null && e.length) || !(n != null && n.length)) return -1;
  const o = {};
  for (const s of n)
    o[s] = t[s];
  const a = Bc(e, o, n);
  if (a >= 0) return a;
  if (i != null && i.length && r) {
    const s = { ...o };
    for (const l of i) {
      if (!(l in s)) continue;
      s[l] = r[l] ?? "Standard";
      const u = Bc(e, s, n);
      if (u >= 0) return u;
    }
  }
  return -1;
}
c(dg, "findBestMatch");
function Bc(e, t, n) {
  return e.findIndex((i) => {
    for (const r of n)
      if (i[r] !== t[r]) return !1;
    return !0;
  });
}
c(Bc, "findExactMatch");
function fg(e, t) {
  if (!(e != null && e.length)) return -1;
  let n = -1, i = -1;
  for (let r = 0; r < e.length; r += 1) {
    const o = e[r] ?? {}, a = Object.keys(o);
    if (a.length === 0) {
      i < 0 && (n = r, i = 0);
      continue;
    }
    let s = !0;
    for (const l of a)
      if (o[l] !== t[l]) {
        s = !1;
        break;
      }
    s && a.length > i && (n = r, i = a.length);
  }
  return n;
}
c(fg, "findFileIndex");
function vo(e) {
  return e && typeof e == "object" && !Array.isArray(e);
}
c(vo, "isPlainObject$2");
function Uc(e) {
  return e == null ? e : typeof structuredClone == "function" ? structuredClone(e) : JSON.parse(JSON.stringify(e));
}
c(Uc, "deepClone");
function mg(e, t) {
  if (!t) return;
  const n = t.split(".").filter(Boolean);
  if (!n.length) return;
  let i = e;
  for (let r = 0; r < n.length - 1; r += 1) {
    if (!vo(i == null ? void 0 : i[n[r]])) return;
    i = i[n[r]];
  }
  delete i[n.at(-1)];
}
c(mg, "deletePath");
function kd(e, t) {
  const n = Uc(e ?? {});
  if (!vo(t)) return n;
  for (const [i, r] of Object.entries(t)) {
    if (i.startsWith("-=") && r === !0) {
      mg(n, i.slice(2));
      continue;
    }
    vo(r) && vo(n[i]) ? n[i] = kd(n[i], r) : n[i] = Uc(r);
  }
  return n;
}
c(kd, "fallbackMerge");
function gg(e, t) {
  var n, i;
  return (n = foundry == null ? void 0 : foundry.utils) != null && n.mergeObject && ((i = foundry == null ? void 0 : foundry.utils) != null && i.deepClone) ? foundry.utils.mergeObject(e, foundry.utils.deepClone(t), {
    inplace: !1
  }) : kd(e, t);
}
c(gg, "defaultMerge");
function hg(e, t) {
  if (!e) return !0;
  for (const n of Object.keys(e))
    if (e[n] !== t[n]) return !1;
  return !0;
}
c(hg, "criteriaMatch");
function Md(e, t, n, i) {
  const r = i ?? gg;
  let o = r({}, e ?? {});
  if (!(t != null && t.length)) return o;
  const a = [];
  for (let s = 0; s < t.length; s += 1) {
    const l = t[s];
    if (hg(l == null ? void 0 : l.criteria, n)) {
      const u = l != null && l.criteria ? Object.keys(l.criteria).length : 0;
      a.push({ specificity: u, index: s, delta: l == null ? void 0 : l.delta });
    }
  }
  a.sort((s, l) => s.specificity - l.specificity || s.index - l.index);
  for (const s of a)
    s.delta && (o = r(o, s.delta));
  return o;
}
c(Md, "resolveRules");
function Pa(e = null) {
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
c(Pa, "canManageCriteria");
function pg(e = null) {
  if (!Pa(e))
    throw new Error(`${ie} | You do not have permission to manage scene criteria.`);
}
c(pg, "requireCriteriaAccess");
const yg = /* @__PURE__ */ c((...e) => console.log(`${ie} | criteria tiles:`, ...e), "log$1");
let Po = /* @__PURE__ */ new WeakMap(), Ro = /* @__PURE__ */ new WeakMap();
const Vc = 200;
function bg(e) {
  return e ? Number.isInteger(e.size) ? e.size : Array.isArray(e) || typeof e.length == "number" ? e.length : Array.from(e).length : 0;
}
c(bg, "getCollectionSize$1");
function no() {
  return typeof (performance == null ? void 0 : performance.now) == "function" ? performance.now() : Date.now();
}
c(no, "nowMs$2");
function vg(e) {
  if (!Array.isArray(e)) return [];
  const t = /* @__PURE__ */ new Set();
  for (const n of e) {
    if (typeof n != "string") continue;
    const i = n.trim();
    i && t.add(i);
  }
  return Array.from(t);
}
c(vg, "uniqueStringKeys$1");
function wg(e, t = Vc) {
  if (!Array.isArray(e) || e.length === 0) return [];
  const n = Number.isInteger(t) && t > 0 ? t : Vc, i = [];
  for (let r = 0; r < e.length; r += n)
    i.push(e.slice(r, r + n));
  return i;
}
c(wg, "chunkArray$1");
async function Eg(e, t, n) {
  const i = wg(t, n);
  for (const r of i)
    await e.updateEmbeddedDocuments("Tile", r), i.length > 1 && await Promise.resolve();
  return i.length;
}
c(Eg, "updateTilesInChunks");
function Sg(e) {
  var i;
  const t = di(e, { files: null });
  if (!((i = t == null ? void 0 : t.variants) != null && i.length)) return [];
  const n = /* @__PURE__ */ new Set();
  for (const r of t.variants)
    for (const o of Object.keys(r.criteria ?? {}))
      o && n.add(o);
  return Array.from(n);
}
c(Sg, "getTileCriteriaDependencyKeys");
function Cg(e, t) {
  const n = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Set();
  for (const r of t) {
    const o = r.getFlag(ie, oi) ?? r.getFlag(ie, ri);
    if (o) {
      i.add(r.id);
      for (const a of Sg(o))
        n.has(a) || n.set(a, /* @__PURE__ */ new Set()), n.get(a).add(r.id);
    }
  }
  return {
    collection: t,
    keyToTileIds: n,
    allTileIds: i
  };
}
c(Cg, "buildTileDependencyIndex");
function Tg(e, t) {
  const n = Ro.get(e);
  if ((n == null ? void 0 : n.collection) === t) return n;
  const i = Cg(e, t);
  return Ro.set(e, i), i;
}
c(Tg, "getTileDependencyIndex");
function Lg(e, t, n) {
  const i = vg(n);
  if (!i.length)
    return Array.from(t ?? []);
  const r = Tg(e, t), o = /* @__PURE__ */ new Set();
  for (const a of i) {
    const s = r.keyToTileIds.get(a);
    if (s)
      for (const l of s)
        o.add(l);
  }
  return o.size ? typeof (t == null ? void 0 : t.get) == "function" ? Array.from(o).map((a) => t.get(a)).filter(Boolean) : Array.from(t ?? []).filter((a) => o.has(a.id)) : [];
}
c(Lg, "getTilesForChangedKeys");
function Nd(e) {
  return typeof (e == null ? void 0 : e.name) == "string" ? e.name : typeof (e == null ? void 0 : e.src) == "string" ? e.src : "";
}
c(Nd, "getFilePath");
function Ho(e) {
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
c(Ho, "normalizeFilePath");
function nc(e) {
  if (!Array.isArray(e)) return [];
  const t = /* @__PURE__ */ new Map();
  return e.map((n, i) => {
    const r = Ho(Nd(n)), o = r || `__index:${i}`, a = t.get(o) ?? 0;
    t.set(o, a + 1);
    const s = {
      indexHint: i
    };
    return r && (s.path = r, s.occurrence = a), {
      index: i,
      path: r,
      occurrence: a,
      target: s,
      label: r.split("/").pop() || `File ${i + 1}`
    };
  });
}
c(nc, "buildTileFileEntries");
function An(e, t) {
  if (!Number.isInteger(t) || t < 0) return null;
  const i = nc(e).find((r) => r.index === t);
  return i ? { ...i.target } : { indexHint: t };
}
c(An, "createTileTargetFromIndex");
function Ra(e) {
  if (!e || typeof e != "object") return null;
  const t = Ho(e.path), n = Number(e.indexHint ?? e.fileIndex), i = Number(e.occurrence), r = {};
  return t && (r.path = t, r.occurrence = Number.isInteger(i) && i >= 0 ? i : 0), Number.isInteger(n) && n >= 0 && (r.indexHint = n), !r.path && !Number.isInteger(r.indexHint) ? null : r;
}
c(Ra, "normalizeTileTarget");
function br(e, t) {
  const n = Ra(e);
  if (!n) return -1;
  const i = nc(t);
  if (!i.length) return -1;
  if (n.path) {
    const r = i.filter((o) => o.path === n.path);
    if (r.length > 0) {
      const o = Number.isInteger(n.occurrence) ? n.occurrence : 0;
      if (r[o]) return r[o].index;
      if (Number.isInteger(n.indexHint)) {
        const a = r.find((s) => s.index === n.indexHint);
        if (a) return a.index;
      }
      return r[0].index;
    }
  }
  return Number.isInteger(n.indexHint) && n.indexHint < i.length ? n.indexHint : -1;
}
c(br, "resolveTileTargetIndex");
function kn(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return {};
  const t = {};
  for (const [n, i] of Object.entries(e))
    typeof n != "string" || !n || typeof i != "string" || !i.trim() || (t[n] = i.trim());
  return t;
}
c(kn, "sanitizeCriteria");
function Ig(e) {
  return Object.entries(kn(e)).sort(([n], [i]) => n.localeCompare(i)).map(([n, i]) => `${n}=${i}`).join("");
}
c(Ig, "serializeCriteria");
function Og(e) {
  return Object.keys(kn(e)).length;
}
c(Og, "getCriteriaSpecificity");
function Ag(e, t) {
  const n = kn(e), i = kn(t);
  for (const [r, o] of Object.entries(n))
    if (r in i && i[r] !== o)
      return !1;
  return !0;
}
c(Ag, "areCriteriaCompatible");
function kg(e, t) {
  const n = br(e, t);
  if (Number.isInteger(n) && n >= 0)
    return `index:${n}`;
  const i = Ra(e);
  if (!i) return "";
  if (i.path) {
    const r = Number.isInteger(i.occurrence) ? i.occurrence : 0;
    return `path:${i.path}#${r}`;
  }
  return Number.isInteger(i.indexHint) ? `hint:${i.indexHint}` : "";
}
c(kg, "getTargetIdentity");
function _d(e, t = {}) {
  var s;
  const n = Array.isArray(t.files) ? t.files : [], i = di(e, { files: n });
  if (!((s = i == null ? void 0 : i.variants) != null && s.length))
    return {
      errors: [],
      warnings: []
    };
  const r = i.variants.map((l, u) => ({
    index: u,
    criteria: kn(l.criteria),
    specificity: Og(l.criteria),
    criteriaSignature: Ig(l.criteria),
    targetIdentity: kg(l.target, n)
  })), o = [], a = [];
  for (let l = 0; l < r.length; l += 1) {
    const u = r[l];
    for (let d = l + 1; d < r.length; d += 1) {
      const m = r[d];
      if (u.specificity !== m.specificity || !Ag(u.criteria, m.criteria)) continue;
      if (!(!!u.targetIdentity && u.targetIdentity === m.targetIdentity)) {
        o.push({
          leftIndex: u.index,
          rightIndex: m.index,
          type: u.criteriaSignature === m.criteriaSignature ? "equivalent" : "overlap",
          specificity: u.specificity
        });
        continue;
      }
      u.criteriaSignature === m.criteriaSignature && a.push({
        leftIndex: u.index,
        rightIndex: m.index,
        type: "duplicate"
      });
    }
  }
  return {
    errors: o,
    warnings: a
  };
}
c(_d, "detectTileCriteriaConflicts");
function Mg(e, t) {
  if (!e || typeof e != "object") return null;
  let n = Ra(e.target);
  if (!n) {
    const i = Number(e.fileIndex);
    Number.isInteger(i) && i >= 0 && (n = An(t, i));
  }
  return n ? {
    criteria: kn(e.criteria),
    target: n
  } : null;
}
c(Mg, "normalizeTileVariant");
function $d(e, t = {}) {
  if (!Array.isArray(e) || e.length === 0) return null;
  const n = Array.isArray(t.files) ? t.files : null, i = e.map((l, u) => ({
    criteria: kn(l),
    target: An(n, u)
  })).filter((l) => l.target);
  if (!i.length) return null;
  const r = i.find((l) => Object.keys(l.criteria).length === 0), o = (r == null ? void 0 : r.target) ?? i[0].target;
  let a = null;
  const s = Number(t.defaultFileIndex);
  return Number.isInteger(s) && s >= 0 && (a = An(n, s)), a || (a = o), {
    strategy: "select-one",
    variants: i,
    defaultTarget: a
  };
}
c($d, "buildTileCriteriaFromFileIndex");
function di(e, t = {}) {
  const n = Array.isArray(t.files) ? t.files : null;
  if (Array.isArray(e))
    return $d(e, { files: n });
  if (!e || typeof e != "object") return null;
  const i = Array.isArray(e.variants) ? e.variants.map((o) => Mg(o, n)).filter(Boolean) : [];
  if (!i.length) return null;
  let r = Ra(e.defaultTarget);
  if (!r) {
    const o = Number(e.defaultFileIndex);
    Number.isInteger(o) && o >= 0 && (r = An(n, o));
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
c(di, "normalizeTileCriteria");
function Ng(e, t) {
  if (!e) return -1;
  let n = -1, i = -1;
  for (const r of e.variants) {
    const o = r.keys;
    let a = !0;
    for (const s of o)
      if (r.criteria[s] !== (t == null ? void 0 : t[s])) {
        a = !1;
        break;
      }
    a && o.length > i && (i = o.length, n = r.targetIndex);
  }
  return n >= 0 ? n : e.defaultIndex;
}
c(Ng, "selectTileFileIndexFromCompiled");
function _g(e, t) {
  const n = di(e, { files: t });
  if (!n) return null;
  const i = n.variants.map((o) => {
    const a = kn(o.criteria), s = br(o.target, t);
    return !Number.isInteger(s) || s < 0 ? null : {
      criteria: a,
      keys: Object.keys(a),
      targetIndex: s
    };
  }).filter(Boolean), r = br(n.defaultTarget, t);
  return !i.length && (!Number.isInteger(r) || r < 0) ? null : {
    variants: i,
    defaultIndex: r
  };
}
c(_g, "compileTileMatcher");
function $g(e, t, n) {
  const i = Po.get(e);
  if (i && i.tileCriteria === t && i.files === n)
    return i.compiled;
  const r = _g(t, n);
  return Po.set(e, {
    tileCriteria: t,
    files: n,
    compiled: r
  }), r;
}
c($g, "getCompiledTileMatcher");
function Dg(e = null, t = null) {
  e ? Ro.delete(e) : Ro = /* @__PURE__ */ new WeakMap(), t ? Po.delete(t) : e || (Po = /* @__PURE__ */ new WeakMap());
}
c(Dg, "invalidateTileCriteriaCaches");
async function Dd(e, t, n = {}) {
  var l, u, d, m;
  const i = no(), r = {
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
    return r.durationMs = no() - i, r;
  const o = t.getEmbeddedCollection("Tile") ?? [];
  r.total = bg(o);
  const a = Lg(t, o, n.changedKeys);
  if (r.scanned = a.length, !a.length)
    return r.skipped.unaffected = r.total, r.durationMs = no() - i, r;
  const s = [];
  for (const g of a) {
    const y = g.getFlag(ie, oi) ?? g.getFlag(ie, ri);
    if (!y) {
      r.skipped.noCriteria += 1;
      continue;
    }
    const h = g.getFlag("monks-active-tiles", "files");
    if (!(h != null && h.length)) {
      r.skipped.noFiles += 1;
      continue;
    }
    const p = $g(g, y, h), w = Ng(p, e);
    if (!Number.isInteger(w) || w < 0 || w >= h.length) {
      console.warn(`${ie} | Tile ${g.id} has no valid file match for state`, e), r.skipped.noMatch += 1;
      continue;
    }
    const b = w + 1, S = Number(g.getFlag("monks-active-tiles", "fileindex")) !== b, I = h.some((F, D) => !!(F != null && F.selected) != (D === w)), O = Ho(((u = g.texture) == null ? void 0 : u.src) ?? ((m = (d = g._source) == null ? void 0 : d.texture) == null ? void 0 : m.src) ?? ""), k = Nd(h[w]), M = Ho(k), x = !!M && M !== O;
    if (!I && !S && !x) {
      r.skipped.unchanged += 1;
      continue;
    }
    const R = {
      _id: g._id
    };
    I && (R["flags.monks-active-tiles.files"] = h.map((F, D) => ({
      ...F,
      selected: D === w
    }))), S && (R["flags.monks-active-tiles.fileindex"] = b), x && (R.texture = { src: k }), s.push(R), yg(`Tile ${g.id} -> ${k}`);
  }
  return s.length > 0 && (r.chunks = await Eg(t, s, n.chunkSize), r.updated = s.length), r.durationMs = no() - i, r;
}
c(Dd, "updateTiles");
function Fg() {
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
    const o = (Tagger.getTags(r) ?? []).filter((l) => !t.includes(l)), a = (Tagger.getByTag("Disable Automation") ?? []).concat(Tagger.getByTag("Settings") ?? []), s = Tagger.getByTag(o, { ignore: a }) ?? [];
    for (const l of s)
      l != null && l._id && i.push(l._id);
  }
  return i;
}
c(Fg, "buildLightControlsMap");
const ai = T, Ni = "lightCriteria", ic = Object.freeze({
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
    const o = e == null ? void 0 : e[i];
    if (ss(r) && ss(o)) {
      const a = Fd(o, r);
      Object.keys(a).length > 0 && (n[i] = a);
    } else r !== o && (n[i] = Ht(r));
  }
  return n;
}
c(Fd, "computeDelta");
function xd(e) {
  var n;
  const t = ((n = e == null ? void 0 : e.getFlag) == null ? void 0 : n.call(e, ai, Ni)) ?? ic;
  return vr(t);
}
c(xd, "getLightCriteriaState");
async function Pd(e, t) {
  const n = vr(t);
  if (!(e != null && e.setFlag))
    return n;
  const i = n.base !== null, r = n.mappings.length > 0, o = n.current !== null;
  return !i && !r && !o ? (typeof e.unsetFlag == "function" ? await e.unsetFlag(ai, Ni) : await e.setFlag(ai, Ni, null), ic) : (await e.setFlag(ai, Ni, n), n);
}
c(Pd, "setLightCriteriaState");
async function Wr(e, t) {
  if (typeof t != "function")
    throw new TypeError("updateLightCriteriaState requires an updater function.");
  const n = Ht(xd(e)), i = await t(n);
  return Pd(e, i);
}
c(Wr, "updateLightCriteriaState");
async function zc(e, t) {
  const n = fi(t);
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
  const o = fi(n);
  if (!o)
    throw new Error("Invalid light configuration payload.");
  return Wr(e, (a) => {
    const s = Ki(r), l = Array.isArray(a == null ? void 0 : a.mappings) ? [...a.mappings] : [], u = l.findIndex((y) => (y == null ? void 0 : y.key) === s), d = u >= 0 ? l[u] : null, m = typeof (d == null ? void 0 : d.id) == "string" && d.id.trim() ? d.id.trim() : Hd(), g = Ha({
      id: m,
      categories: r,
      config: o,
      label: typeof i == "string" ? i : (d == null ? void 0 : d.label) ?? null,
      updatedAt: Date.now()
    });
    if (!g)
      throw new Error("Failed to sanitize criteria mapping entry.");
    return u >= 0 ? l[u] = g : l.push(g), {
      ...a,
      mappings: l
    };
  });
}
c(Gc, "upsertLightCriteriaMapping");
async function xg(e, t, n, i, { replaceExisting: r = !1 } = {}) {
  const o = typeof t == "string" ? t.trim() : "";
  if (!o)
    throw new Error("A mapping id is required to retarget criteria.");
  const a = Kr(n);
  if (!a)
    throw new Error("Cannot retarget mapping without at least one category selection.");
  const s = fi(i);
  if (!s)
    throw new Error("Invalid light configuration payload.");
  return Wr(e, (l) => {
    const u = Array.isArray(l == null ? void 0 : l.mappings) ? [...l.mappings] : [], d = u.findIndex((b) => (b == null ? void 0 : b.id) === o);
    if (d < 0)
      throw new Error("The selected mapping no longer exists.");
    const m = Ki(a), g = u.findIndex(
      (b, v) => v !== d && (b == null ? void 0 : b.key) === m
    );
    if (g >= 0 && !r)
      throw new Error("A mapping already exists for the selected criteria.");
    const y = u[d], h = Ha({
      ...y,
      id: o,
      categories: a,
      config: s,
      updatedAt: Date.now()
    });
    if (!h)
      throw new Error("Failed to sanitize updated mapping.");
    u[d] = h;
    let p = null;
    if (g >= 0) {
      const [b] = u.splice(g, 1);
      p = (b == null ? void 0 : b.id) ?? null;
    }
    let w = (l == null ? void 0 : l.current) ?? null;
    return w && typeof w == "object" && (w.mappingId === o ? w = {
      ...w,
      mappingId: o,
      categories: a,
      updatedAt: Date.now()
    } : p && w.mappingId === p && (w = {
      ...w,
      mappingId: o,
      categories: a,
      updatedAt: Date.now()
    })), {
      ...l,
      mappings: u,
      current: w
    };
  });
}
c(xg, "retargetLightCriteriaMapping");
async function Pg(e, t) {
  const n = typeof t == "string" ? t.trim() : "";
  if (!n)
    throw new Error("A mapping id is required to remove a mapping.");
  return Wr(e, (i) => {
    const r = Array.isArray(i == null ? void 0 : i.mappings) ? [...i.mappings] : [], o = r.findIndex((s) => (s == null ? void 0 : s.id) === n);
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
c(Pg, "removeLightCriteriaMapping");
async function cr(e, t) {
  const n = Rd(t);
  return Wr(e, (i) => ({
    ...i,
    current: n
  }));
}
c(cr, "storeCurrentCriteriaSelection");
function Rg(e) {
  const t = vr(e), n = t.base ?? {}, i = [];
  for (const r of t.mappings) {
    const o = Kr(r == null ? void 0 : r.categories);
    if (!o) continue;
    const a = Fd(n, (r == null ? void 0 : r.config) ?? {});
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
c(Rg, "convertLightCriteriaStateToPresets");
function Hg(e, t = []) {
  const n = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Set();
  for (const l of t)
    typeof (l == null ? void 0 : l.key) == "string" && l.key.trim() && i.add(l.key.trim()), typeof (l == null ? void 0 : l.id) == "string" && l.id.trim() && typeof (l == null ? void 0 : l.key) == "string" && n.set(l.id.trim(), l.key.trim());
  const r = vr(e), o = /* @__PURE__ */ c((l) => {
    const u = {};
    for (const [d, m] of Object.entries(l ?? {})) {
      const g = String(d ?? "").trim(), y = typeof m == "string" ? m.trim() : "";
      if (!g || !y) continue;
      if (i.has(g)) {
        u[g] = y;
        continue;
      }
      const h = n.get(g);
      h && (u[h] = y);
    }
    return Object.keys(u).length ? u : null;
  }, "remapCategories"), a = r.mappings.map((l) => {
    const u = o(l.categories);
    return u ? Ha({
      ...l,
      categories: u,
      key: Ki(u)
    }) : null;
  }).filter(Boolean);
  let s = r.current;
  if (s != null && s.categories) {
    const l = o(s.categories);
    s = l ? {
      ...s,
      categories: l
    } : null;
  }
  return vr({
    ...r,
    mappings: a,
    current: s
  });
}
c(Hg, "migrateLightCriteriaCategoriesToKeys");
function vr(e) {
  var l;
  const t = Ht(e);
  if (!t || typeof t != "object")
    return Ht(ic);
  const n = fi(t.base), i = Array.isArray(t.mappings) ? t.mappings : [], r = /* @__PURE__ */ new Map();
  for (const u of i) {
    const d = Ha(u);
    d && r.set(d.key, d);
  }
  const o = Array.from(r.values()), a = new Map(o.map((u) => [u.id, u]));
  let s = Rd(t.current);
  if (s) {
    const u = s.categories && Object.keys(s.categories).length > 0;
    if (s.mappingId && !a.has(s.mappingId)) {
      const d = u ? ((l = o.find((m) => m.key === Ki(s.categories))) == null ? void 0 : l.id) ?? null : null;
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
    mappings: o,
    current: s
  };
}
c(vr, "sanitizeLightCriteriaState");
function fi(e) {
  const t = Ht(e);
  if (!t || typeof t != "object") return null;
  "_id" in t && delete t._id, "id" in t && delete t.id;
  const n = t.flags;
  if (n && typeof n == "object") {
    const i = n[ai];
    i && typeof i == "object" && (delete i[Ni], Object.keys(i).length === 0 && delete n[ai]), Object.keys(n).length === 0 && delete t.flags;
  }
  return t;
}
c(fi, "sanitizeLightConfigPayload");
function Ha(e) {
  if (!e || typeof e != "object") return null;
  const t = Kr(e.categories);
  if (!t) return null;
  const n = fi(e.config);
  if (!n) return null;
  const i = typeof e.id == "string" && e.id.trim() ? e.id.trim() : Hd(), r = Ki(t), o = {
    id: i,
    key: r,
    categories: t,
    config: n,
    updatedAt: Number.isFinite(e.updatedAt) ? Number(e.updatedAt) : Date.now()
  };
  return typeof e.label == "string" && e.label.trim() && (o.label = e.label.trim()), o;
}
c(Ha, "sanitizeCriteriaMappingEntry");
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
      const r = Wc(n), o = Kc(i);
      !r || !o || (t[r] = o);
    }
  return Object.keys(t).length > 0 ? t : null;
}
c(Kr, "sanitizeCriteriaCategories");
function Ki(e) {
  if (!e || typeof e != "object") return "";
  const t = Object.entries(e).filter(([, n]) => typeof n == "string" && n).map(([n, i]) => `${n}:${i}`);
  return t.sort((n, i) => n < i ? -1 : n > i ? 1 : 0), t.join("|");
}
c(Ki, "computeCriteriaMappingKey");
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
const qo = ["AmbientLight", "Wall", "AmbientSound"];
let jo = /* @__PURE__ */ new WeakMap(), Bo = /* @__PURE__ */ new WeakMap();
const Jc = 200;
function qg(e) {
  return e ? Number.isInteger(e.size) ? e.size : Array.isArray(e) || typeof e.length == "number" ? e.length : Array.from(e).length : 0;
}
c(qg, "getCollectionSize");
function ls() {
  return typeof (performance == null ? void 0 : performance.now) == "function" ? performance.now() : Date.now();
}
c(ls, "nowMs$1");
function jg(e) {
  if (!Array.isArray(e)) return [];
  const t = /* @__PURE__ */ new Set();
  for (const n of e) {
    if (typeof n != "string") continue;
    const i = n.trim();
    i && t.add(i);
  }
  return Array.from(t);
}
c(jg, "uniqueStringKeys");
function Bg(e, t = Jc) {
  if (!Array.isArray(e) || e.length === 0) return [];
  const n = Number.isInteger(t) && t > 0 ? t : Jc, i = [];
  for (let r = 0; r < e.length; r += n)
    i.push(e.slice(r, r + n));
  return i;
}
c(Bg, "chunkArray");
async function Ug(e, t, n, i) {
  const r = Bg(n, i);
  for (const o of r)
    await e.updateEmbeddedDocuments(t, o), r.length > 1 && await Promise.resolve();
  return r.length;
}
c(Ug, "updatePlaceablesInChunks");
function Vg(e) {
  const t = /* @__PURE__ */ new Set();
  for (const n of (e == null ? void 0 : e.rules) ?? [])
    for (const i of Object.keys((n == null ? void 0 : n.criteria) ?? {}))
      i && t.add(i);
  return Array.from(t);
}
c(Vg, "getPresetDependencyKeys");
function zg(e, t) {
  const n = /* @__PURE__ */ new Map();
  for (const i of qo) {
    const r = t.get(i) ?? [], o = /* @__PURE__ */ new Set(), a = /* @__PURE__ */ new Map();
    for (const s of r) {
      const l = jd(s, i);
      if (l != null && l.base) {
        o.add(s.id);
        for (const u of Vg(l))
          a.has(u) || a.set(u, /* @__PURE__ */ new Set()), a.get(u).add(s.id);
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
c(zg, "buildPlaceableDependencyIndex");
function Gg(e, t) {
  const n = Bo.get(e);
  if (n && qo.every((r) => n.collectionsByType.get(r) === t.get(r)))
    return n;
  const i = zg(e, t);
  return Bo.set(e, i), i;
}
c(Gg, "getPlaceableDependencyIndex");
function Wg(e, t, n) {
  if (!t || !e) return [];
  const i = jg(n);
  if (!i.length)
    return typeof e.get == "function" ? Array.from(t.allDocIds).map((o) => e.get(o)).filter(Boolean) : Array.from(e).filter((o) => t.allDocIds.has(o.id));
  const r = /* @__PURE__ */ new Set();
  for (const o of i) {
    const a = t.keyToDocIds.get(o);
    if (a)
      for (const s of a) r.add(s);
  }
  return r.size ? typeof e.get == "function" ? Array.from(r).map((o) => e.get(o)).filter(Boolean) : Array.from(e).filter((o) => r.has(o.id)) : [];
}
c(Wg, "getDocsForChangedKeys");
function Ti(e) {
  return !!e && typeof e == "object" && !Array.isArray(e);
}
c(Ti, "isPlainObject");
function tl(e, t) {
  if (Object.is(e, t)) return !0;
  if (Array.isArray(e) || Array.isArray(t)) {
    if (!Array.isArray(e) || !Array.isArray(t) || e.length !== t.length) return !1;
    for (let n = 0; n < e.length; n += 1)
      if (!tl(e[n], t[n])) return !1;
    return !0;
  }
  if (Ti(e) || Ti(t)) {
    if (!Ti(e) || !Ti(t)) return !1;
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
  for (const [r, o] of Object.entries(t)) {
    if (r === "_id") continue;
    const a = e == null ? void 0 : e[r];
    if (Ti(o) && Ti(a)) {
      const s = qd(a, { _id: t._id, ...o });
      if (!s) continue;
      const l = Object.keys(s).filter((u) => u !== "_id");
      if (l.length > 0) {
        n[r] = {};
        for (const u of l)
          n[r][u] = s[u];
      }
      continue;
    }
    tl(a, o) || (n[r] = o);
  }
  return Object.keys(n).filter((r) => r !== "_id").length > 0 ? n : null;
}
c(qd, "buildChangedPayload");
function jd(e, t) {
  var s;
  const n = ((s = e == null ? void 0 : e.flags) == null ? void 0 : s[ie]) ?? {}, i = (n == null ? void 0 : n.presets) ?? null, r = t === "AmbientLight" ? (n == null ? void 0 : n.lightCriteria) ?? null : null, o = jo.get(e);
  if (o && o.type === t && o.rawPresets === i && o.rawLightCriteria === r)
    return o.presets;
  let a = null;
  if (n != null && n.presets) {
    const l = n.presets.base ?? null, u = Array.isArray(n.presets.rules) ? n.presets.rules : [];
    (l && Object.keys(l).length > 0 || u.length > 0) && (a = {
      base: l ?? {},
      rules: u
    });
  }
  if (!a && t === "AmbientLight" && (n != null && n.lightCriteria)) {
    const l = Rg(n.lightCriteria);
    (l.base && Object.keys(l.base).length > 0 || l.rules.length > 0) && (a = {
      base: l.base,
      rules: l.rules
    });
  }
  return jo.set(e, {
    type: t,
    rawPresets: i,
    rawLightCriteria: r,
    presets: a
  }), a;
}
c(jd, "getPresetsForDocument");
function Kg(e = null, t = null) {
  e ? Bo.delete(e) : Bo = /* @__PURE__ */ new WeakMap(), t ? jo.delete(t) : e || (jo = /* @__PURE__ */ new WeakMap());
}
c(Kg, "invalidatePlaceableCriteriaCaches");
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
  const o = new Set(Fg()), a = new Map(
    qo.map((d) => [d, t.getEmbeddedCollection(d) ?? []])
  ), s = Gg(t, a);
  for (const d of qo) {
    const m = a.get(d) ?? [], g = {
      total: qg(m),
      scanned: 0,
      updated: 0,
      chunks: 0
    }, y = s.byType.get(d) ?? null, h = Wg(m, y, n.changedKeys);
    if (g.scanned = h.length, r.total += g.total, r.scanned += g.scanned, r.byType[d] = g, !h.length) continue;
    const p = [];
    for (const w of h) {
      const b = jd(w, d);
      if (!(b != null && b.base)) continue;
      const v = Md(b.base, b.rules ?? [], e);
      v._id = w._id, d === "AmbientLight" && o.has(w._id) && (v.hidden = !0);
      const S = (w == null ? void 0 : w._source) ?? ((u = w == null ? void 0 : w.toObject) == null ? void 0 : u.call(w)) ?? {}, I = qd(S, v);
      I && p.push(I);
    }
    p.length > 0 && (g.chunks = await Ug(t, d, p, n.chunkSize), g.updated = p.length, r.updated += p.length, r.chunks += g.chunks, console.log(`${ie} | Updated ${p.length} ${d}(s)`));
  }
  return r.durationMs = ls() - i, r;
}
c(Bd, "updatePlaceables");
function Uo() {
  return typeof (performance == null ? void 0 : performance.now) == "function" ? performance.now() : Date.now();
}
c(Uo, "nowMs");
const io = /* @__PURE__ */ new Map();
function Jg(e) {
  var t;
  return e = e ?? ((t = game.scenes) == null ? void 0 : t.viewed), e ? Gr(e) : null;
}
c(Jg, "getState");
async function Yg(e, t, n = 0) {
  var y;
  const i = Uo();
  if (t = t ?? ((y = game.scenes) == null ? void 0 : y.viewed), !t) return null;
  pg(t);
  const r = ut(t);
  if (!r.length)
    return console.warn(`${ie} | applyState skipped: scene has no criteria.`), null;
  const o = Gr(t, r), a = ec({ ...o, ...e ?? {} }, r), s = r.filter((h) => (o == null ? void 0 : o[h.key]) !== (a == null ? void 0 : a[h.key])).map((h) => h.key), l = s.length > 0;
  l && await eg(t, a, r);
  const u = l ? a : o, [d, m] = await Promise.all([
    Dd(u, t, { changedKeys: s }),
    Bd(u, t, { changedKeys: s })
  ]), g = Uo() - i;
  return N("Criteria apply telemetry", {
    sceneId: t.id,
    changedKeys: s,
    didChange: l,
    queuedMs: n,
    durationMs: g,
    tiles: d,
    placeables: m
  }), Hooks.callAll("eidolon-utilities.criteriaStateApplied", t, u), u;
}
c(Yg, "applyStateInternal");
async function Ud(e, t) {
  var l;
  if (t = t ?? ((l = game.scenes) == null ? void 0 : l.viewed), !t) return null;
  const n = t.id ?? "__viewed__", i = Uo(), r = io.get(n) ?? Promise.resolve();
  let o = null;
  const a = r.catch(() => null).then(async () => {
    const u = Uo() - i;
    return Yg(e, t, u);
  });
  o = a;
  const s = a.finally(() => {
    io.get(n) === s && io.delete(n);
  });
  return io.set(n, s), o;
}
c(Ud, "applyState$1");
function Qg(e) {
  var t;
  return e = e ?? ((t = game.scenes) == null ? void 0 : t.viewed), e ? Ad(e) : null;
}
c(Qg, "getVersion");
async function Vd(e, t) {
  var n;
  t = t ?? ((n = game.scenes) == null ? void 0 : n.viewed), t != null && t.setFlag && await t.setFlag(ie, Id, Number(e));
}
c(Vd, "setVersion");
async function Xg(e) {
  return Vd(Od, e);
}
c(Xg, "markCurrentVersion");
const rr = "Standard", Zg = /* @__PURE__ */ c((...e) => console.log(`${ie} | criteria indexer:`, ...e), "log");
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
function eh(e, t, n = rr) {
  return e != null && e.length ? e.map((i) => {
    const r = rc(i == null ? void 0 : i.name);
    if (!r) return {};
    const o = {};
    for (const [a, s] of Object.entries(t)) {
      const l = r[Number(a)];
      l != null && l !== n && (o[s] = l);
    }
    return o;
  }) : [];
}
c(eh, "buildFileIndex");
function th(e, t) {
  return e.map((n, i) => {
    const r = [...t[n] ?? /* @__PURE__ */ new Set()].sort(), a = r.includes(rr) ? rr : r[0] ?? rr, s = Zl(n);
    return s.key = n, s.label = n.charAt(0).toUpperCase() + n.slice(1), s.values = r.length ? r : [rr], s.default = s.values.includes(a) ? a : s.values[0], s.order = i, s;
  });
}
c(th, "buildCriteriaDefinitions");
async function ro(e, t, n, { dryRun: i = !1 } = {}) {
  const r = e.getFlag("monks-active-tiles", "files");
  if (!(r != null && r.length)) return null;
  const o = eh(r, t), a = $d(o, { files: r });
  for (const s of r) {
    const l = rc(s == null ? void 0 : s.name);
    if (l)
      for (const [u, d] of Object.entries(t)) {
        const m = l[Number(u)];
        m != null && n[d] && n[d].add(m);
      }
  }
  return i || (await e.setFlag(ie, oi, a), typeof e.unsetFlag == "function" && await e.unsetFlag(ie, ri)), { files: r.length };
}
c(ro, "indexTile");
async function nh(e, t = {}) {
  var v, S, I, O;
  const {
    dryRun: n = !1,
    force: i = !1
  } = t;
  if (e = e ?? ((v = game.scenes) == null ? void 0 : v.viewed), !e) throw new Error("No scene provided to indexScene.");
  if (!globalThis.Tagger) throw new Error("Tagger is required to index scene criteria.");
  if (!i && Ad(e) >= Od)
    throw new Error(
      `Scene "${e.name}" is already criteria-indexed. Use force: true to re-index.`
    );
  const r = { sceneId: e.id }, o = Tagger.getByTag("Map", r) ?? [];
  if (!o.length) throw new Error("No Map tile found.");
  if (o.length > 1) throw new Error(`Expected 1 Map tile, found ${o.length}.`);
  const a = o[0], s = a.getFlag("monks-active-tiles", "files");
  if (!(s != null && s.length)) throw new Error("Map tile has no MATT files.");
  const l = rc((S = s[0]) == null ? void 0 : S.name);
  if (!(l != null && l.length))
    throw new Error(`Cannot parse bracket tags from: ${((I = s[0]) == null ? void 0 : I.name) ?? "<unknown>"}`);
  if (l.length < 3)
    throw new Error(`Expected 3+ bracket tags, found ${l.length}.`);
  const u = Tagger.getByTag("Floor", r) ?? [], d = Tagger.getByTag("Roof", r) ?? [], m = Tagger.getByTag("Weather", r) ?? [];
  let g;
  const y = [];
  l.length >= 4 ? (g = { 0: "mood", 1: "stage", 2: "variant", 3: "effect" }, y.push("mood", "stage", "variant", "effect")) : (g = { 0: "mood", 1: "variant", 2: "effect" }, y.push("mood", "variant", "effect"));
  const h = { 1: "effect" }, p = {};
  for (const k of y)
    p[k] = /* @__PURE__ */ new Set();
  const w = {
    map: null,
    floor: [],
    roof: [],
    weather: []
  };
  w.map = await ro(a, g, p, { dryRun: n });
  for (const k of u) {
    const M = await ro(k, g, p, { dryRun: n });
    M && w.floor.push(M);
  }
  for (const k of d) {
    const M = await ro(k, g, p, { dryRun: n });
    M && w.roof.push(M);
  }
  for (const k of m) {
    const M = await ro(k, h, p, { dryRun: n });
    M && w.weather.push(M);
  }
  const b = th(y, p);
  return n || (await xa(e, b), await Xg(e)), Zg(
    n ? "Dry run complete" : "Indexing complete",
    `- ${b.length} criteria,`,
    `${((O = w.map) == null ? void 0 : O.files) ?? 0} map files`
  ), {
    criteria: b,
    state: b.reduce((k, M) => (k[M.key] = M.default, k), {}),
    tiles: w,
    overlayMode: m.length > 0
  };
}
c(nh, "indexScene");
var xu, Fe, at, st, Xn, Ke, Ft, fn, ka, le, zd, Gd, Wd, il, Kd, rl, Jd, or, ol;
const ht = class ht extends Dn($n) {
  constructor(n = {}) {
    var i;
    super(n);
    A(this, le);
    A(this, Fe, null);
    A(this, at, []);
    A(this, st, {});
    A(this, Xn, !1);
    A(this, Ke, null);
    A(this, Ft, null);
    A(this, fn, null);
    A(this, ka, 120);
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
    const n = !!f(this, Fe), i = n && f(this, at).length > 0;
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
      criteria: f(this, at).map((o) => ({
        key: o.key,
        label: o.label || o.key,
        values: o.values.map((a) => {
          var s;
          return {
            value: a,
            selected: ((s = f(this, st)) == null ? void 0 : s[o.key]) === a
          };
        }),
        defaultValue: o.default
      })),
      stateSummary: C(this, le, ol).call(this)
    };
  }
  _onRender(n, i) {
    super._onRender(n, i), C(this, le, Gd).call(this), C(this, le, Wd).call(this);
  }
  async _onClose(n) {
    return f(this, Ke) !== null && (clearTimeout(f(this, Ke)), L(this, Ke, null)), f(this, fn) !== null && (Hooks.off("eidolon-utilities.criteriaStateApplied", f(this, fn)), L(this, fn, null)), super._onClose(n);
  }
};
Fe = new WeakMap(), at = new WeakMap(), st = new WeakMap(), Xn = new WeakMap(), Ke = new WeakMap(), Ft = new WeakMap(), fn = new WeakMap(), ka = new WeakMap(), le = new WeakSet(), zd = /* @__PURE__ */ c(function() {
  if (!f(this, Fe)) {
    L(this, at, []), L(this, st, {});
    return;
  }
  L(this, at, ut(f(this, Fe)).sort((n, i) => n.order - i.order)), L(this, st, Gr(f(this, Fe), f(this, at)));
}, "#hydrateFromScene"), Gd = /* @__PURE__ */ c(function() {
  var i, r;
  const n = this.element;
  n instanceof HTMLElement && (n.querySelectorAll("[data-criteria-key]").forEach((o) => {
    o.addEventListener("change", (a) => {
      const s = a.currentTarget;
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
  f(this, fn) === null && L(this, fn, Hooks.on("eidolon-utilities.criteriaStateApplied", (n, i) => {
    !f(this, Fe) || (n == null ? void 0 : n.id) !== f(this, Fe).id || f(this, Xn) || (L(this, st, { ...i ?? {} }), this.render({ force: !0 }));
  }));
}, "#ensureSyncHook"), il = /* @__PURE__ */ c(async function(n) {
  var i, r;
  if (f(this, Fe)) {
    C(this, le, or).call(this, "applying"), L(this, Xn, !0);
    try {
      const o = await Ud(n, f(this, Fe));
      o && L(this, st, o), C(this, le, or).call(this, "ready"), this.render({ force: !0 });
    } catch (o) {
      console.error(`${ie} | Failed to apply criteria state`, o), (r = (i = ui.notifications) == null ? void 0 : i.error) == null || r.call(
        i,
        E(
          "EIDOLON.CriteriaSwitcher.ApplyError",
          "Failed to apply the selected criteria state."
        )
      ), C(this, le, or).call(this, "error", (o == null ? void 0 : o.message) ?? "Unknown error");
    } finally {
      L(this, Xn, !1), f(this, Ft) && C(this, le, rl).call(this);
    }
  }
}, "#applyPartialState"), Kd = /* @__PURE__ */ c(function(n) {
  L(this, Ft, {
    ...f(this, Ft) ?? {},
    ...n ?? {}
  }), f(this, Ke) !== null && clearTimeout(f(this, Ke)), C(this, le, or).call(this, "applying"), L(this, Ke, setTimeout(() => {
    L(this, Ke, null), C(this, le, rl).call(this);
  }, f(this, ka)));
}, "#queuePartialState"), rl = /* @__PURE__ */ c(async function() {
  if (f(this, Xn) || !f(this, Ft)) return;
  const n = f(this, Ft);
  L(this, Ft, null), await C(this, le, il).call(this, n);
}, "#flushPendingState"), Jd = /* @__PURE__ */ c(async function() {
  if (!f(this, at).length) return;
  const n = f(this, at).reduce((i, r) => (i[r.key] = r.default, i), {});
  L(this, st, n), f(this, Ke) !== null && (clearTimeout(f(this, Ke)), L(this, Ke, null)), L(this, Ft, null), await C(this, le, il).call(this, n);
}, "#resetToDefaults"), or = /* @__PURE__ */ c(function(n, i = "") {
  const r = this.element;
  if (!(r instanceof HTMLElement)) return;
  const o = r.querySelector("[data-role='status']");
  if (o instanceof HTMLElement)
    switch (o.dataset.mode = n, n) {
      case "applying":
        o.textContent = E("EIDOLON.CriteriaSwitcher.Applying", "Applying changes...");
        break;
      case "error":
        o.textContent = `${E("EIDOLON.CriteriaSwitcher.Error", "Error")}: ${i}`;
        break;
      case "ready":
      default:
        o.textContent = `${E("EIDOLON.CriteriaSwitcher.Ready", "Ready")}: ${C(this, le, ol).call(this)}`;
        break;
    }
}, "#setStatus"), ol = /* @__PURE__ */ c(function() {
  return f(this, at).length ? `[${f(this, at).map((n) => {
    var i;
    return ((i = f(this, st)) == null ? void 0 : i[n.key]) ?? n.default;
  }).join(" | ")}]` : "-";
}, "#formatStateSummary"), c(ht, "CriteriaSwitcherApplication"), pe(ht, "APP_ID", `${ie}-criteria-switcher`), pe(ht, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  $e(ht, ht, "DEFAULT_OPTIONS"),
  {
    id: ht.APP_ID,
    classes: Array.from(
      /* @__PURE__ */ new Set([...((xu = $e(ht, ht, "DEFAULT_OPTIONS")) == null ? void 0 : xu.classes) ?? [], "eidolon-criteria-switcher-window", "themed"])
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
)), pe(ht, "PARTS", {
  content: {
    template: `modules/${ie}/templates/criteria-switcher.html`
  }
});
let nl = ht;
const ih = Da(nl);
let si = null;
function rh(e) {
  var t;
  return e ?? ((t = game.scenes) == null ? void 0 : t.viewed) ?? null;
}
c(rh, "resolveScene");
function oh(e) {
  var t;
  return !!(e != null && e.rendered && ((t = e == null ? void 0 : e.element) != null && t.isConnected));
}
c(oh, "isRendered");
function qa() {
  return oh(si) ? si : (si = null, null);
}
c(qa, "getCriteriaSwitcher");
function Yd(e) {
  var i, r, o, a, s;
  const t = rh(e);
  if (!t)
    return (r = (i = ui.notifications) == null ? void 0 : i.warn) == null || r.call(i, "No active scene to open the criteria switcher."), null;
  if (!Pa(t))
    return (a = (o = ui.notifications) == null ? void 0 : o.warn) == null || a.call(o, "You do not have permission to manage scene criteria."), null;
  const n = qa();
  return n ? (n.setScene(t), n.render({ force: !0 }), (s = n.bringToFront) == null || s.call(n), n) : (si = ih({ scene: t }), si.render({ force: !0 }), si);
}
c(Yd, "openCriteriaSwitcher");
function Qd() {
  const e = qa();
  e && (e.close(), si = null);
}
c(Qd, "closeCriteriaSwitcher");
function oc(e) {
  return qa() ? (Qd(), null) : Yd(e);
}
c(oc, "toggleCriteriaSwitcher");
const ah = {
  SCHEMA_VERSION: tc,
  applyState: Ud,
  getState: Jg,
  getVersion: Qg,
  setVersion: Vd,
  getCriteria(e) {
    var t;
    return ut(e ?? ((t = game.scenes) == null ? void 0 : t.viewed));
  },
  setCriteria(e, t) {
    var n;
    return xa(t ?? ((n = game.scenes) == null ? void 0 : n.viewed), e);
  },
  updateTiles: Dd,
  updatePlaceables: Bd,
  indexScene: nh,
  openCriteriaSwitcher: Yd,
  closeCriteriaSwitcher: Qd,
  toggleCriteriaSwitcher: oc,
  findBestMatch: dg,
  findFileIndex: fg,
  resolveRules: Md
};
function sh(e) {
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
c(sh, "findTabNav");
function lh(e, t) {
  var i, r, o;
  return e instanceof HTMLElement ? [
    (i = e.querySelector(".tab[data-tab]")) == null ? void 0 : i.parentElement,
    e.querySelector(".sheet-body"),
    (o = (r = t == null ? void 0 : t.parentElement) == null ? void 0 : r.querySelector) == null ? void 0 : o.call(r, ":scope > .sheet-body"),
    t == null ? void 0 : t.parentElement
  ].find((a) => a instanceof HTMLElement) ?? null : null;
}
c(lh, "findTabBody");
function ch(e, t) {
  var n, i, r, o, a, s, l;
  return ((n = e == null ? void 0 : e.dataset) == null ? void 0 : n.group) ?? ((o = (r = (i = e == null ? void 0 : e.querySelector) == null ? void 0 : i.call(e, "[data-group]")) == null ? void 0 : r.dataset) == null ? void 0 : o.group) ?? ((l = (s = (a = t == null ? void 0 : t.querySelector) == null ? void 0 : a.call(t, ".tab[data-group]")) == null ? void 0 : s.dataset) == null ? void 0 : l.group) ?? "main";
}
c(ch, "getTabGroup");
function uh(e, t, n) {
  if (!(e instanceof HTMLElement)) return;
  e.textContent = "";
  const i = document.createElement("i");
  i.className = n, i.setAttribute("inert", ""), e.append(i, " ");
  const r = document.createElement("span");
  r.textContent = t, e.append(r);
}
c(uh, "setTabButtonContent");
function dh(e, t, n) {
  const i = e.querySelector("[data-tab]"), r = (i == null ? void 0 : i.tagName) || "A", o = document.createElement(r);
  return i instanceof HTMLElement && (o.className = i.className), o.classList.remove("active"), r === "BUTTON" && (o.type = "button"), o.dataset.action = "tab", o.dataset.tab = n, o.dataset.group = t, o.setAttribute("aria-selected", "false"), o.setAttribute("aria-pressed", "false"), o;
}
c(dh, "createTabButton");
function fh(e, t, n) {
  const i = document.createElement("div");
  i.classList.add("tab"), i.dataset.tab = n, i.dataset.group = t, i.dataset.applicationPart = n, i.setAttribute("hidden", "true");
  const r = yd(e);
  return e.insertBefore(i, r ?? null), i;
}
c(fh, "createTabPanel");
function cs(e, t, n, i, r) {
  var s;
  if (!(i instanceof HTMLElement) || !(r instanceof HTMLElement)) return;
  const o = (s = e == null ? void 0 : e.tabGroups) == null ? void 0 : s[t];
  if (typeof o == "string" ? o === n : i.classList.contains("active") || r.classList.contains("active")) {
    i.classList.add("active"), i.setAttribute("aria-selected", "true"), i.setAttribute("aria-pressed", "true"), r.classList.add("active"), r.removeAttribute("hidden"), r.removeAttribute("aria-hidden");
    return;
  }
  i.classList.remove("active"), i.setAttribute("aria-selected", "false"), i.setAttribute("aria-pressed", "false"), r.classList.remove("active"), r.setAttribute("hidden", "true");
}
c(cs, "syncTabVisibility");
function ac(e, t, n, i, r) {
  const o = sh(t), a = lh(t, o);
  if (!(o instanceof HTMLElement) || !(a instanceof HTMLElement)) return null;
  const s = ch(o, a);
  let l = o.querySelector(`[data-tab="${n}"]`);
  l instanceof HTMLElement || (l = dh(o, s, n), o.appendChild(l)), uh(l, i, r);
  let u = a.querySelector(`.tab[data-tab="${n}"]`);
  u instanceof HTMLElement || (u = fh(a, s, n));
  const d = `data-eidolon-bound-${n}`;
  return l.hasAttribute(d) || (l.addEventListener("click", () => {
    hd(e, n, s), requestAnimationFrame(() => {
      cs(e, s, n, l, u);
    });
  }), l.setAttribute(d, "true")), cs(e, s, n, l, u), requestAnimationFrame(() => {
    cs(e, s, n, l, u);
  }), mh(e, o), u;
}
c(ac, "ensureTileConfigTab");
function mh(e, t) {
  !(e != null && e.setPosition) || !(t instanceof HTMLElement) || requestAnimationFrame(() => {
    var o;
    if (t.scrollWidth <= t.clientWidth) return;
    const n = t.scrollWidth - t.clientWidth, i = e.element instanceof HTMLElement ? e.element : (o = e.element) == null ? void 0 : o[0];
    if (!i) return;
    const r = i.offsetWidth || 480;
    e.setPosition({ width: r + n + 16 });
  });
}
c(mh, "fitNavWidth");
function Xd(e) {
  var t;
  return ((t = e == null ? void 0 : e.getFlag) == null ? void 0 : t.call(e, "monks-active-tiles", "files")) ?? [];
}
c(Xd, "getTileFiles$1");
function gh(e = []) {
  return {
    strategy: "select-one",
    defaultTarget: An(e, 0) ?? { indexHint: 0 },
    variants: [
      {
        criteria: {},
        target: An(e, 0) ?? { indexHint: 0 }
      }
    ]
  };
}
c(gh, "createDefaultTileCriteria");
function hh(e, t = {}) {
  var a, s;
  const { allowLegacy: n = !0 } = t, i = Xd(e), r = (a = e == null ? void 0 : e.getFlag) == null ? void 0 : a.call(e, ie, oi);
  if (r) return di(r, { files: i });
  if (!n) return null;
  const o = (s = e == null ? void 0 : e.getFlag) == null ? void 0 : s.call(e, ie, ri);
  return o ? di(o, { files: i }) : null;
}
c(hh, "getTileCriteria");
async function Yc(e, t, n = {}) {
  if (!(e != null && e.setFlag)) return null;
  const {
    strictValidation: i = !0
  } = n, r = Xd(e), o = di(t, { files: r });
  if (!o)
    return typeof e.unsetFlag == "function" ? (await e.unsetFlag(ie, oi), await e.unsetFlag(ie, ri)) : (await e.setFlag(ie, oi, null), await e.setFlag(ie, ri, null)), null;
  if (i) {
    const a = _d(o, { files: r });
    if (a.errors.length > 0)
      throw new Error(
        `Tile criteria contains ${a.errors.length} conflicting rule pair(s). Resolve clashes before saving.`
      );
  }
  return await e.setFlag(ie, oi, o), typeof e.unsetFlag == "function" && await e.unsetFlag(ie, ri), o;
}
c(Yc, "setTileCriteria");
const al = "__eidolon_any__", sl = "eidolon-tile-criteria", ph = "fa-solid fa-sliders", Zd = Symbol.for("eidolon.tileCriteriaUiState"), ja = ["all", "unmapped", "mapped", "conflicts"];
function yh(e) {
  const t = e == null ? void 0 : e[Zd];
  return !t || typeof t != "object" ? {
    filterQuery: "",
    filterMode: "all",
    selectedFileIndex: null
  } : {
    filterQuery: typeof t.filterQuery == "string" ? t.filterQuery : "",
    filterMode: ja.includes(t.filterMode) ? t.filterMode : "all",
    selectedFileIndex: Number.isInteger(t.selectedFileIndex) ? t.selectedFileIndex : null
  };
}
c(yh, "readUiState");
function bh(e, t) {
  if (!e || !t) return;
  typeof t.filterQuery == "string" && (e.filterQuery = t.filterQuery), ja.includes(t.filterMode) && (e.filterMode = t.filterMode), Number.isInteger(t.selectedFileIndex) && e.fileEntries.some((i) => i.index === t.selectedFileIndex) && (e.selectedFileIndex = t.selectedFileIndex);
}
c(bh, "applyUiState");
function vh(e) {
  const t = e == null ? void 0 : e.app, n = e == null ? void 0 : e.state;
  !t || !n || (t[Zd] = {
    filterQuery: typeof n.filterQuery == "string" ? n.filterQuery : "",
    filterMode: ja.includes(n.filterMode) ? n.filterMode : "all",
    selectedFileIndex: Number.isInteger(n.selectedFileIndex) ? n.selectedFileIndex : null
  });
}
c(vh, "persistUiState");
function wh(e) {
  const t = (e == null ? void 0 : e.object) ?? (e == null ? void 0 : e.document) ?? null;
  return !(t != null && t.isEmbedded) || t.documentName !== "Tile" ? null : t;
}
c(wh, "getTileDocument$2");
function Eh(e) {
  var t;
  return ((t = e == null ? void 0 : e.getFlag) == null ? void 0 : t.call(e, "monks-active-tiles", "files")) ?? [];
}
c(Eh, "getTileFiles");
function Sh(e, t) {
  var s;
  const n = (e == null ? void 0 : e.parent) ?? ((s = game.scenes) == null ? void 0 : s.viewed) ?? null, r = ut(n).sort((l, u) => l.order - u.order).map((l) => ({
    key: l.key,
    label: l.label || l.key,
    values: [...l.values ?? []]
  })), o = new Set(r.map((l) => l.key)), a = /* @__PURE__ */ new Map();
  for (const l of (t == null ? void 0 : t.variants) ?? [])
    for (const [u, d] of Object.entries((l == null ? void 0 : l.criteria) ?? {}))
      o.has(u) || (a.has(u) || a.set(u, /* @__PURE__ */ new Set()), typeof d == "string" && d.trim() && a.get(u).add(d.trim()));
  for (const [l, u] of a.entries())
    r.push({
      key: l,
      label: l,
      values: [...u]
    });
  return r;
}
c(Sh, "getCriteriaDefinitions");
function Ch(e) {
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
    for (const s of r)
      a.folders.has(s) || a.folders.set(s, {
        folders: /* @__PURE__ */ new Map(),
        files: []
      }), a = a.folders.get(s);
    a.files.push({ entry: n, name: o || n.label });
  }
  return t;
}
c(Ch, "buildTree");
function Th(e, t) {
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
c(Th, "collapseFolderBranch");
function Lh(e, t) {
  const n = e.rulesByFile.get(t) ?? [], i = [];
  for (const r of n) {
    const o = Object.entries(r.criteria ?? {}).filter(([, s]) => typeof s == "string" && s.trim());
    if (!o.length) {
      i.push("*");
      continue;
    }
    const a = o.map(([s, l]) => `${e.criteriaLabels.get(s) ?? s}: ${l}`).join(" · ");
    i.push(a);
  }
  return i;
}
c(Lh, "getRuleSummariesForFile");
function ll(e) {
  var y, h;
  const t = Eh(e), n = nc(t), i = hh(e, { allowLegacy: !0 }) ?? gh(t), r = Sh(e, i), o = new Map(r.map((p) => [p.key, p.label])), a = new Map(
    n.map((p) => [
      p.index,
      p.path || p.label
    ])
  ), s = br(i.defaultTarget, t), l = ((y = n[0]) == null ? void 0 : y.index) ?? 0, u = s >= 0 ? s : l, d = new Map(n.map((p) => [p.index, []]));
  let m = 1;
  for (const p of i.variants ?? []) {
    const w = br(p.target, t);
    w < 0 || (d.has(w) || d.set(w, []), d.get(w).push({
      id: m,
      criteria: { ...p.criteria ?? {} }
    }), m += 1);
  }
  const g = n.some((p) => p.index === u) ? u : ((h = n[0]) == null ? void 0 : h.index) ?? null;
  return {
    files: t,
    fileEntries: n,
    criteriaDefinitions: r,
    criteriaLabels: o,
    relativePaths: a,
    defaultIndex: u,
    selectedFileIndex: g,
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
function Ih(e) {
  return Object.fromEntries(
    Object.entries(e ?? {}).filter(([t, n]) => typeof t == "string" && t && typeof n == "string" && n.trim()).map(([t, n]) => [t, n.trim()])
  );
}
c(Ih, "sanitizeRuleCriteria");
function ef(e) {
  const t = An(e.files, e.defaultIndex);
  if (!t) return null;
  const n = [], i = [];
  for (const [o, a] of e.rulesByFile.entries()) {
    const s = An(e.files, o);
    if (s)
      for (const [l, u] of a.entries()) {
        const d = Ih(u.criteria);
        n.push({
          criteria: d,
          target: { ...s }
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
    target: { ...t }
  }), i.push({
    fileIndex: e.defaultIndex,
    ruleId: null,
    rulePosition: null,
    criteria: {},
    isFallback: !0
  })), {
    normalized: di(
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
function Oh(e) {
  var t;
  return ((t = ef(e)) == null ? void 0 : t.normalized) ?? null;
}
c(Oh, "exportTileCriteria");
function Qc(e) {
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
  }, "mapConflict"), r = n.errors.map((s) => i(s)), o = n.warnings.map((s) => i(s)), a = /* @__PURE__ */ c((s) => {
    const l = /* @__PURE__ */ new Set();
    for (const u of s)
      Number.isInteger(u.leftFileIndex) && l.add(u.leftFileIndex), Number.isInteger(u.rightFileIndex) && l.add(u.rightFileIndex);
    return [...l];
  }, "toFileIndexes");
  return {
    errors: r,
    warnings: o,
    errorFileIndexes: a(r),
    warningFileIndexes: a(o)
  };
}
c(Qc, "analyzeRuleConflicts");
function oo(e, t = "neutral") {
  const n = document.createElement("span");
  return n.classList.add("eidolon-tile-criteria__badge"), n.dataset.kind = t, n.textContent = e, n;
}
c(oo, "createBadge");
function Ah(e, t = {}) {
  const n = typeof e == "string" ? e : "", {
    maxLength: i = 42,
    headLength: r = 20,
    tailLength: o = 16
  } = t;
  if (!n || n.length <= i) return n;
  const a = n.slice(0, r).trimEnd(), s = n.slice(-o).trimStart();
  return `${a}...${s}`;
}
c(Ah, "middleEllipsis");
function kh(e) {
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
      matches: /* @__PURE__ */ c((o) => r.test(String(o ?? "")), "matches")
    };
  } catch (r) {
    return {
      error: (r == null ? void 0 : r.message) ?? E("EIDOLON.TileCriteria.InvalidRegex", "Invalid regex."),
      matches: /* @__PURE__ */ c(() => !0, "matches")
    };
  }
}
c(kh, "createRegexFilter");
function Mh(e, t) {
  const n = document.createElement("select");
  n.dataset.criteriaKey = e.key;
  const i = document.createElement("option");
  i.value = al, i.textContent = "*", n.appendChild(i);
  const r = new Set(e.values ?? []);
  t && !r.has(t) && r.add(t);
  for (const o of r) {
    const a = document.createElement("option");
    a.value = o, a.textContent = o, n.appendChild(a);
  }
  return n.value = t ?? al, n;
}
c(Mh, "createCriterionSelect");
function Nh(e, t, n, i) {
  var s;
  const r = document.createElement("div");
  r.classList.add("eidolon-tile-criteria__rule-editor");
  const o = document.createElement("div");
  o.classList.add("eidolon-tile-criteria__rule-grid");
  for (const l of t.criteriaDefinitions) {
    const u = document.createElement("label");
    u.classList.add("eidolon-tile-criteria__rule-field");
    const d = document.createElement("span");
    d.classList.add("eidolon-tile-criteria__criterion-label"), d.textContent = l.label, u.appendChild(d);
    const m = Mh(l, (s = e.criteria) == null ? void 0 : s[l.key]);
    m.addEventListener("change", () => {
      m.value === al ? delete e.criteria[l.key] : e.criteria[l.key] = m.value, i();
    }), u.appendChild(m), o.appendChild(u);
  }
  r.appendChild(o);
  const a = document.createElement("button");
  return a.type = "button", a.classList.add("control", "ui-control", "eidolon-tile-criteria__rule-remove"), a.textContent = E("EIDOLON.TileCriteria.RemoveRule", "Remove"), a.addEventListener("click", () => {
    const u = cl(t, n).filter((d) => d.id !== e.id);
    t.rulesByFile.set(n, u), i();
  }), r.appendChild(a), r;
}
c(Nh, "renderRuleEditor");
const wo = /* @__PURE__ */ new WeakMap();
function tf(e) {
  return (e == null ? void 0 : e.app) ?? (e == null ? void 0 : e.tile) ?? null;
}
c(tf, "getDialogOwner");
function _h(e) {
  for (const t of e) {
    const n = At(t);
    if (n) return n;
    const i = At(t == null ? void 0 : t.element);
    if (i) return i;
  }
  return null;
}
c(_h, "findDialogRoot$1");
function $h(e, t, n) {
  const i = e.state, r = i.fileEntries.find((p) => p.index === t);
  if (!r) return document.createElement("div");
  const o = document.createElement("section");
  o.classList.add("eidolon-tile-criteria__dialog-content");
  const a = document.createElement("header");
  a.classList.add("eidolon-tile-criteria__editor-header");
  const s = document.createElement("h4");
  s.textContent = i.relativePaths.get(r.index) || r.label, a.appendChild(s);
  const l = document.createElement("p");
  l.classList.add("notes"), l.textContent = `#${r.index + 1} · ${r.path || E("EIDOLON.TileCriteria.UnknownPath", "Unknown path")}`, a.appendChild(l), o.appendChild(a);
  const u = document.createElement("div");
  u.classList.add("eidolon-tile-criteria__editor-controls");
  const d = document.createElement("button");
  d.type = "button", d.classList.add("control", "ui-control", "eidolon-tile-criteria__editor-action"), i.defaultIndex === r.index ? (d.textContent = E("EIDOLON.TileCriteria.IsDefault", "Default Target"), d.disabled = !0) : (d.textContent = E("EIDOLON.TileCriteria.SetDefault", "Set As Default"), d.addEventListener("click", () => {
    i.defaultIndex = r.index, Be(e), n();
  })), u.appendChild(d);
  const m = document.createElement("button");
  m.type = "button", m.classList.add("control", "ui-control", "eidolon-tile-criteria__editor-action", "secondary"), m.textContent = E("EIDOLON.TileCriteria.ClearFileRules", "Clear File Rules"), m.addEventListener("click", () => {
    i.rulesByFile.set(r.index, []), Be(e), n();
  }), u.appendChild(m), o.appendChild(u);
  const g = document.createElement("div");
  g.classList.add("eidolon-tile-criteria__rule-editors");
  const y = cl(i, r.index);
  if (y.length)
    for (const p of y)
      g.appendChild(
        Nh(p, i, r.index, () => {
          Be(e), n();
        })
      );
  else {
    const p = document.createElement("p");
    p.classList.add("notes"), p.textContent = E(
      "EIDOLON.TileCriteria.NoRulesForFile",
      "No rules map to this file yet. Add one to define when this variant should be active."
    ), g.appendChild(p);
  }
  o.appendChild(g);
  const h = document.createElement("button");
  return h.type = "button", h.classList.add("control", "ui-control", "eidolon-tile-criteria__editor-action"), h.textContent = E("EIDOLON.TileCriteria.AddRule", "Add Rule"), h.disabled = !i.criteriaDefinitions.length, h.addEventListener("click", () => {
    cl(i, r.index).push({
      id: i.nextRuleId,
      criteria: {}
    }), i.nextRuleId += 1, Be(e), n();
  }), o.appendChild(h), o;
}
c($h, "buildRuleEditorContent");
function Dh(e, t) {
  var m, g, y;
  const n = tf(e);
  if (!n) return;
  const i = wo.get(n);
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
  wo.set(n, r);
  const o = /* @__PURE__ */ c(() => {
    wo.delete(n);
  }, "closeDialog"), a = /* @__PURE__ */ c(() => {
    r.host instanceof HTMLElement && r.host.replaceChildren(
      $h(r.controller, r.fileIndex, a)
    );
  }, "refreshDialog");
  r.refresh = a;
  const s = E("EIDOLON.TileCriteria.EditorTitle", "Edit Tile Criteria Rules"), l = '<div class="eidolon-tile-criteria-editor-host"></div>', u = E("EIDOLON.TileCriteria.CloseEditor", "Close"), d = (y = (g = foundry == null ? void 0 : foundry.applications) == null ? void 0 : g.api) == null ? void 0 : y.DialogV2;
  if (typeof (d == null ? void 0 : d.wait) == "function") {
    d.wait({
      window: { title: s },
      content: l,
      buttons: [{ action: "close", label: u, default: !0 }],
      render: /* @__PURE__ */ c((...h) => {
        var b;
        const p = _h(h), w = (b = p == null ? void 0 : p.querySelector) == null ? void 0 : b.call(p, ".eidolon-tile-criteria-editor-host");
        w instanceof HTMLElement && (r.host = w, a());
      }, "render"),
      close: o,
      rejectClose: !1
    }).catch((h) => {
      console.warn(`${ie} | Rule editor dialog failed`, h), o();
    });
    return;
  }
  o();
}
c(Dh, "openRuleEditorDialog");
function Xc(e) {
  var i;
  const t = tf(e);
  if (!t) return;
  const n = wo.get(t);
  (i = n == null ? void 0 : n.refresh) == null || i.call(n);
}
c(Xc, "refreshOpenRuleEditor");
function ul(e, t) {
  return (e.rulesByFile.get(t) ?? []).length > 0;
}
c(ul, "hasRulesForFile");
function nf(e, t) {
  var n, i;
  return ((n = e == null ? void 0 : e.errorFileIndexes) == null ? void 0 : n.includes(t)) || ((i = e == null ? void 0 : e.warningFileIndexes) == null ? void 0 : i.includes(t));
}
c(nf, "hasConflictForFile");
function Fh(e, t, n) {
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
c(Fh, "matchesFilterMode");
function xh(e, t) {
  let n = 0, i = 0, r = 0;
  for (const o of e.fileEntries)
    ul(e, o.index) ? n += 1 : i += 1, nf(t, o.index) && (r += 1);
  return {
    all: e.fileEntries.length,
    mapped: n,
    unmapped: i,
    conflicts: r
  };
}
c(xh, "getFilterModeCounts");
function Ph(e) {
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
c(Ph, "getFilterModeLabel");
function rf(e, t, n, i, r) {
  var u, d;
  const o = [...e.folders.keys()].sort((m, g) => m.localeCompare(g));
  for (const m of o) {
    const g = Th(m, e.folders.get(m)), y = document.createElement("li");
    y.classList.add("eidolon-tile-criteria__tree-branch");
    const h = document.createElement("div");
    h.classList.add("document", "folder", "update", "eidolon-tile-criteria__folder-row");
    const p = document.createElement("i");
    p.classList.add("fa-solid", "fa-folder-open"), h.appendChild(p);
    const w = document.createElement("span");
    w.classList.add("eidolon-tile-criteria__tree-folder-label"), w.textContent = g.label, w.title = g.label, h.appendChild(w), y.appendChild(h);
    const b = document.createElement("ul");
    b.classList.add("eidolon-tile-criteria__tree"), b.dataset.folder = g.label, rf(g.node, t, n, i, b), b.childElementCount > 0 && y.appendChild(b), r.appendChild(y);
  }
  const a = [...e.files].sort((m, g) => m.name.localeCompare(g.name));
  if (!a.length) return;
  const s = document.createElement("li"), l = document.createElement("ul");
  l.classList.add("document-list", "eidolon-tile-criteria__document-list");
  for (const m of a) {
    const g = m.entry, y = g.index === t.selectedFileIndex, h = g.index === t.defaultIndex, p = Lh(t, g.index), w = document.createElement("li");
    w.classList.add("document", "update", "eidolon-tile-criteria__tree-file");
    const b = document.createElement("button");
    b.type = "button", b.classList.add("eidolon-tile-criteria__file-row");
    const v = (u = i == null ? void 0 : i.errorFileIndexes) == null ? void 0 : u.includes(g.index), S = (d = i == null ? void 0 : i.warningFileIndexes) == null ? void 0 : d.includes(g.index);
    v ? b.classList.add("has-conflict") : S && b.classList.add("has-warning");
    const I = t.relativePaths.get(g.index) || g.path || m.name, O = [I];
    v ? O.push(
      E(
        "EIDOLON.TileCriteria.ConflictFileHint",
        "This file participates in one or more conflicting rules."
      )
    ) : S && O.push(
      E(
        "EIDOLON.TileCriteria.WarningFileHint",
        "This file has potentially redundant rules."
      )
    ), p.length || O.push(
      E(
        "EIDOLON.TileCriteria.UnmappedHint",
        "No criteria rules map to this file."
      )
    ), b.title = O.join(`
`), y && b.classList.add("is-selected"), b.addEventListener("click", () => {
      t.selectedFileIndex = g.index, Be(n), Dh(n, g.index);
    });
    const k = document.createElement("span");
    k.classList.add("eidolon-tile-criteria__indicator"), k.dataset.kind = h ? "default" : p.length ? "mapped" : "unmapped", b.appendChild(k);
    const M = document.createElement("span");
    M.classList.add("eidolon-tile-criteria__file-content");
    const x = document.createElement("span");
    x.classList.add("eidolon-tile-criteria__file-heading");
    const R = document.createElement("span");
    R.classList.add("eidolon-tile-criteria__file-title"), R.textContent = Ah(m.name || g.label), R.title = I, x.appendChild(R);
    const F = oo(`#${g.index + 1}`, "meta");
    F.classList.add("eidolon-tile-criteria__index-badge"), x.appendChild(F), M.appendChild(x);
    const D = document.createElement("span");
    D.classList.add("eidolon-tile-criteria__badges"), h && D.appendChild(oo(E("EIDOLON.TileCriteria.DefaultBadge", "Default"), "default"));
    const _ = p.slice(0, 2);
    for (const H of _)
      D.appendChild(oo(H, "rule"));
    if (p.length > _.length && D.appendChild(oo(`+${p.length - _.length}`, "meta")), M.appendChild(D), b.appendChild(M), v || S) {
      const H = document.createElement("span");
      H.classList.add("eidolon-tile-criteria__row-warning"), H.dataset.mode = v ? "error" : "warning", H.innerHTML = '<i class="fa-solid fa-triangle-exclamation" inert=""></i>', b.appendChild(H);
    }
    w.appendChild(b), l.appendChild(w);
  }
  s.appendChild(l), r.appendChild(s);
}
c(rf, "renderTreeNode");
function Rh(e, t, n, i = {}) {
  const r = document.createElement("section");
  r.classList.add("eidolon-tile-criteria__tree-panel");
  const o = kh(e.filterQuery), a = xh(e, n);
  e.filterMode !== "all" && a[e.filterMode] === 0 && (e.filterMode = "all");
  const s = document.createElement("div");
  s.classList.add("eidolon-tile-criteria__toolbar");
  const l = document.createElement("div");
  l.classList.add("eidolon-tile-criteria__mode-bar");
  for (const v of ja) {
    const S = document.createElement("button");
    S.type = "button", S.classList.add("control", "ui-control", "eidolon-tile-criteria__mode-button"), S.dataset.mode = v, S.textContent = Ph(v);
    const I = v === "all" || a[v] > 0;
    S.disabled = !I, I || (S.dataset.tooltip = E(
      "EIDOLON.TileCriteria.FilterModeUnavailable",
      "No entries currently match this filter."
    ), S.title = S.dataset.tooltip), e.filterMode === v ? (S.classList.add("is-active"), S.setAttribute("aria-pressed", "true")) : S.setAttribute("aria-pressed", "false"), S.addEventListener("click", () => {
      e.filterMode !== v && (e.filterMode = v, Be(t));
    }), l.appendChild(S);
  }
  s.appendChild(l);
  const u = document.createElement("div");
  u.classList.add("eidolon-tile-criteria__filter-row");
  const d = document.createElement("input");
  d.type = "text", d.classList.add("eidolon-tile-criteria__filter-input"), d.placeholder = E("EIDOLON.TileCriteria.FilterPlaceholder", "Regex filter (path)"), d.value = e.filterQuery, d.autocomplete = "off", d.addEventListener("keydown", (v) => {
    v.stopPropagation(), v.key === "Enter" && v.preventDefault();
  }), d.addEventListener("keyup", (v) => {
    v.stopPropagation();
  }), d.addEventListener("change", (v) => {
    v.stopPropagation();
  }), d.addEventListener("input", (v) => {
    v.stopPropagation();
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
  const g = document.createElement("button");
  g.type = "button";
  const y = E("EIDOLON.TileCriteria.Save", "Save Rules");
  g.classList.add("control", "ui-control", "eidolon-tile-criteria__toolbar-action", "icon-only"), g.dataset.tooltip = y, g.setAttribute("aria-label", y), g.title = y, g.innerHTML = '<i class="fa-solid fa-floppy-disk" inert=""></i>', g.disabled = n.errors.length > 0, g.addEventListener("click", () => {
    var v;
    (v = i.onSave) == null || v.call(i);
  }), m.appendChild(g);
  const h = document.createElement("button");
  h.type = "button";
  const p = E("EIDOLON.TileCriteria.Clear", "Clear Rules");
  if (h.classList.add("control", "ui-control", "secondary", "eidolon-tile-criteria__toolbar-action", "icon-only"), h.dataset.tooltip = p, h.setAttribute("aria-label", p), h.title = p, h.innerHTML = '<i class="fa-solid fa-trash" inert=""></i>', h.addEventListener("click", () => {
    var v;
    (v = i.onClear) == null || v.call(i);
  }), m.appendChild(h), u.appendChild(m), s.appendChild(u), r.appendChild(s), o.error) {
    const v = document.createElement("p");
    v.classList.add("notes", "eidolon-tile-criteria__filter-error"), v.textContent = `${E("EIDOLON.TileCriteria.InvalidRegex", "Invalid regex")}: ${o.error}`, r.appendChild(v);
  }
  const w = document.createElement("div");
  w.classList.add("eidolon-tile-criteria__library-tree");
  const b = e.fileEntries.filter((v) => {
    const S = e.relativePaths.get(v.index) || v.path || v.label;
    return Fh(e, v, n) && o.matches(S);
  });
  if (e.fileEntries.length)
    if (b.length) {
      const v = document.createElement("ul");
      v.classList.add("eidolon-tile-criteria__tree"), rf(Ch(b), e, t, n, v), w.appendChild(v);
    } else {
      const v = document.createElement("p");
      v.classList.add("notes"), v.textContent = E("EIDOLON.TileCriteria.NoMatches", "No variants match this filter."), w.appendChild(v);
    }
  else {
    const v = document.createElement("p");
    v.classList.add("notes"), v.textContent = E("EIDOLON.TileCriteria.NoVariants", "No MATT variants found"), w.appendChild(v);
  }
  return r.appendChild(w), r;
}
c(Rh, "renderTreePanel");
function Be(e) {
  const { section: t, state: n } = e, i = Qc(n);
  vh(e), t.replaceChildren();
  const r = /* @__PURE__ */ c(async () => {
    try {
      const a = Qc(n);
      if (a.errors.length) {
        n.status = {
          mode: "error",
          message: E(
            "EIDOLON.TileCriteria.ConflictSaveBlocked",
            `Resolve ${a.errors.length} conflict(s) before saving tile criteria rules.`
          )
        }, Be(e);
        return;
      }
      const s = Oh(n);
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
      }, Be(e), Xc(e);
    } catch (a) {
      console.error(`${ie} | Failed to save tile criteria`, a), n.status = {
        mode: "error",
        message: (a == null ? void 0 : a.message) ?? "Failed to save tile criteria rules."
      }, Be(e);
    }
  }, "handleSave"), o = /* @__PURE__ */ c(async () => {
    try {
      await Yc(e.tile, null);
      const a = n.filterQuery, s = n.filterMode, l = n.selectedFileIndex;
      e.state = ll(e.tile), e.state.filterQuery = a, e.state.filterMode = s, Number.isInteger(l) && (e.state.selectedFileIndex = l), e.state.status = {
        mode: "ready",
        message: E("EIDOLON.TileCriteria.Cleared", "Tile criteria rules cleared.")
      }, Be(e), Xc(e);
    } catch (a) {
      console.error(`${ie} | Failed to clear tile criteria`, a), n.status = {
        mode: "error",
        message: (a == null ? void 0 : a.message) ?? "Failed to clear tile criteria rules."
      }, Be(e);
    }
  }, "handleClear");
  if (t.appendChild(Rh(n, e, i, {
    onSave: r,
    onClear: o
  })), i.errors.length || i.warnings.length) {
    const a = document.createElement("section");
    a.classList.add("eidolon-tile-criteria__conflicts");
    const s = document.createElement("p");
    s.classList.add("eidolon-tile-criteria__conflict-summary", "notes"), i.errors.length ? (s.dataset.mode = "error", s.textContent = E(
      "EIDOLON.TileCriteria.ConflictSummary",
      `${i.errors.length} conflict(s) must be resolved before saving${i.warnings.length ? ` (${i.warnings.length} warning(s))` : ""}.`
    )) : (s.dataset.mode = "warning", s.textContent = E(
      "EIDOLON.TileCriteria.WarningSummary",
      `${i.warnings.length} potential issue(s) detected.`
    )), a.appendChild(s);
    const l = document.createElement("p");
    l.classList.add("eidolon-tile-criteria__conflict-hint", "notes"), l.textContent = E(
      "EIDOLON.TileCriteria.ConflictHint",
      "Files involved in clashes are marked in red with a warning icon."
    ), a.appendChild(l), t.appendChild(a);
  }
  if (n.status.mode === "error" || n.status.mode === "warning") {
    const a = document.createElement("p");
    a.classList.add("eidolon-tile-criteria__status", "notes"), a.dataset.mode = n.status.mode, a.textContent = n.status.message, t.appendChild(a);
  }
}
c(Be, "renderController");
function Hh(e, t = null) {
  const n = document.createElement("section");
  n.classList.add("eidolon-tile-criteria");
  const i = ll(e);
  bh(i, yh(t));
  const r = {
    app: t,
    tile: e,
    section: n,
    state: i
  };
  return Be(r), r;
}
c(Hh, "createController");
function qh(e, t) {
  return ac(
    e,
    t,
    sl,
    E("EIDOLON.TileCriteria.TabLabel", "Criteria"),
    ph
  );
}
c(qh, "ensureTileCriteriaTab");
function jh() {
  Hooks.on("renderTileConfig", (e, t) => {
    var l, u, d, m;
    const n = At(t);
    if (!n) return;
    const i = wh(e);
    if (!i) return;
    if ((l = n.querySelector(".eidolon-tile-criteria")) == null || l.remove(), !Fa()) {
      (u = n.querySelector(`.item[data-tab='${sl}']`)) == null || u.remove(), (d = n.querySelector(`.tab[data-tab='${sl}']`)) == null || d.remove();
      return;
    }
    const r = Hh(i, e), o = qh(e, n);
    if (o instanceof HTMLElement) {
      o.replaceChildren(r.section), (m = e.setPosition) == null || m.call(e, { height: "auto" });
      return;
    }
    const a = (e == null ? void 0 : e.form) instanceof HTMLFormElement ? e.form : n instanceof HTMLFormElement ? n : n.querySelector("form");
    if (!(a instanceof HTMLFormElement)) return;
    const s = a.querySelector("button[type='submit']");
    s != null && s.parentElement ? s.parentElement.insertAdjacentElement("beforebegin", r.section) : a.appendChild(r.section);
  });
}
c(jh, "registerTileCriteriaConfigControls");
function Bh(e) {
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
c(Bh, "toList");
function Uh(e, t) {
  const n = e == null ? void 0 : e.tools;
  return Array.isArray(n) ? n.some((i) => (i == null ? void 0 : i.name) === t) : n instanceof Map ? n.has(t) : n && typeof n == "object" ? t in n ? !0 : Object.values(n).some((i) => (i == null ? void 0 : i.name) === t) : !1;
}
c(Uh, "hasTool");
function Vh(e, t) {
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
c(Vh, "addTool");
function zh() {
  Hooks.on("getSceneControlButtons", (e) => {
    var i;
    const t = Bh(e);
    if (!t.length) return;
    const n = t.find((r) => (r == null ? void 0 : r.name) === "tiles") ?? t.find((r) => (r == null ? void 0 : r.name) === "tokens" || (r == null ? void 0 : r.name) === "token") ?? t[0];
    n && (Uh(n, "eidolonCriteriaSwitcher") || Vh(n, {
      name: "eidolonCriteriaSwitcher",
      title: "Criteria Switcher",
      icon: "fa-solid fa-sliders",
      button: !0,
      toggle: !1,
      visible: Pa(((i = game.scenes) == null ? void 0 : i.viewed) ?? null),
      onClick: /* @__PURE__ */ c(() => oc(), "onClick")
    }));
  });
}
c(zh, "registerSceneControlButton");
function ao(e, t) {
  if (!e || typeof e != "object") return !1;
  const n = String(t).split(".");
  let i = e;
  for (const r of n) {
    if (!i || typeof i != "object" || !Object.prototype.hasOwnProperty.call(i, r)) return !1;
    i = i[r];
  }
  return !0;
}
c(ao, "hasOwnPath");
function Gh() {
  const e = /* @__PURE__ */ c((i, r = null) => {
    i && Dg(i, r);
  }, "invalidateTileScene"), t = /* @__PURE__ */ c((i, r = null) => {
    i && Kg(i, r);
  }, "invalidatePlaceableScene");
  Hooks.on("createTile", (i) => {
    e((i == null ? void 0 : i.parent) ?? null, i ?? null);
  }), Hooks.on("deleteTile", (i) => {
    e((i == null ? void 0 : i.parent) ?? null, i ?? null);
  }), Hooks.on("updateTile", (i, r) => {
    (ao(r, `flags.${ie}.tileCriteria`) || ao(r, `flags.${ie}.fileIndex`)) && e((i == null ? void 0 : i.parent) ?? null, i ?? null);
  });
  const n = /* @__PURE__ */ c((i) => {
    Hooks.on(`create${i}`, (r) => {
      t((r == null ? void 0 : r.parent) ?? null, r ?? null);
    }), Hooks.on(`delete${i}`, (r) => {
      t((r == null ? void 0 : r.parent) ?? null, r ?? null);
    }), Hooks.on(`update${i}`, (r, o) => {
      const a = ao(o, `flags.${ie}.presets`), s = i === "AmbientLight" && ao(o, `flags.${ie}.lightCriteria`);
      !a && !s || t((r == null ? void 0 : r.parent) ?? null, r ?? null);
    });
  }, "registerPlaceableHooks");
  n("AmbientLight"), n("Wall"), n("AmbientSound"), Hooks.on("canvasReady", (i) => {
    const r = (i == null ? void 0 : i.scene) ?? null;
    r && (e(r), t(r));
  });
}
c(Gh, "registerCriteriaCacheInvalidationHooks");
function Wh() {
  zh(), jh(), Gh(), Hooks.once("init", () => {
    var e, t;
    (t = (e = game.keybindings) == null ? void 0 : e.register) == null || t.call(e, ie, "toggleCriteriaSwitcher", {
      name: "Toggle Criteria Switcher",
      hint: "Open or close the criteria switcher window for live scene state updates.",
      editable: [{ key: "KeyM", modifiers: ["Alt"] }],
      onDown: /* @__PURE__ */ c(() => {
        var n, i, r;
        return Pa(((n = game.scenes) == null ? void 0 : n.viewed) ?? null) ? (oc(), !0) : ((r = (i = ui.notifications) == null ? void 0 : i.warn) == null || r.call(i, "You do not have permission to manage scene criteria."), !0);
      }, "onDown"),
      restricted: !0,
      precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL
    });
  }), Hooks.on("canvasReady", (e) => {
    var n;
    const t = qa();
    t && (t.setScene((e == null ? void 0 : e.scene) ?? ((n = game.scenes) == null ? void 0 : n.viewed) ?? null), t.render({ force: !0 }));
  }), Hooks.once("ready", () => {
    var t, n;
    const e = (n = (t = game.modules) == null ? void 0 : t.get) == null ? void 0 : n.call(t, ie);
    e && (e.api || (e.api = {}), e.api.criteria = ah, console.log(`${ie} | Criteria engine API registered`));
  });
}
c(Wh, "registerCriteriaEngineHooks");
Wh();
const Eo = /* @__PURE__ */ new WeakMap(), so = /* @__PURE__ */ new WeakMap(), he = "__eidolon_default__";
function Kh() {
  Hooks.on("renderAmbientLightConfig", Jh), N("LightCriteria | AmbientLightConfig controls registered");
}
c(Kh, "registerAmbientLightCriteriaControls");
function Jh(e, t) {
  var n;
  ji("LightCriteria | renderAmbientLightConfig", {
    appId: (e == null ? void 0 : e.id) ?? null,
    constructor: ((n = e == null ? void 0 : e.constructor) == null ? void 0 : n.name) ?? null,
    isRendered: (e == null ? void 0 : e.rendered) ?? !1
  });
  try {
    const i = At(t);
    if (!i) return;
    if (!Fa()) {
      i.querySelectorAll(".eidolon-light-criteria, .eidolon-light-criteria-main-switcher").forEach((r) => r.remove());
      return;
    }
    Yh(e, i);
  } catch (i) {
    console.error("eidolon-utilities | Failed to enhance AmbientLightConfig UI", i);
  } finally {
    Sn();
  }
}
c(Jh, "handleAmbientLightConfigRender");
function Yh(e, t) {
  var Ae, xn, Qi, Xr, Lc;
  const n = (e == null ? void 0 : e.form) instanceof HTMLFormElement ? e.form : t instanceof HTMLFormElement ? t : (Ae = t == null ? void 0 : t.closest) == null ? void 0 : Ae.call(t, "form");
  if (!(n instanceof HTMLFormElement)) return;
  const i = n.querySelector(".window-content");
  if (!(i instanceof HTMLElement)) return;
  const r = af(e);
  if (!r) return;
  const o = bp(r);
  N("LightCriteria | Resolved ambient light", {
    sheetId: (r == null ? void 0 : r.id) ?? null,
    persistedId: (o == null ? void 0 : o.id) ?? null,
    sameRef: r === o
  });
  const a = (o == null ? void 0 : o.parent) ?? r.parent ?? null, s = a ? tg(a) : [], l = s.filter(
    ($) => Array.isArray($ == null ? void 0 : $.values) && $.values.length > 0
  ), u = lp(s), d = s.map(($) => typeof ($ == null ? void 0 : $.id) == "string" ? $.id : null).filter(($) => !!$), m = o ?? r, g = a ? ut(a) : [];
  let y = xd(m);
  const h = Hg(y, g);
  JSON.stringify(h) !== JSON.stringify(y) && (y = h, Pd(m, h).catch(($) => {
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
  const p = i.querySelector(".eidolon-light-criteria");
  p && p.remove(), i.querySelectorAll(".eidolon-light-criteria-main-switcher").forEach(($) => $.remove());
  const w = document.createElement("fieldset");
  w.classList.add("eidolon-light-criteria");
  const b = document.createElement("legend");
  b.textContent = E("EIDOLON.LightCriteria.Legend", "Scene Criteria Lighting"), w.appendChild(b);
  const v = document.createElement("p");
  v.classList.add("notes"), v.textContent = E(
    "EIDOLON.LightCriteria.Description",
    "Capture a base lighting state, then map criteria values to lighting configurations."
  ), w.appendChild(v);
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
  ), O.setAttribute("aria-expanded", "false"), S.appendChild(O), w.appendChild(S);
  const k = document.createElement("p");
  k.classList.add("notes", "eidolon-light-criteria__status"), w.appendChild(k);
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
    Z.classList.add("eidolon-light-criteria__filter-name"), Z.textContent = (Qi = (xn = $.name) == null ? void 0 : xn.trim) != null && Qi.call(xn) ? $.name.trim() : E("EIDOLON.LightCriteria.UnnamedCategory", "Unnamed Category"), z.appendChild(Z);
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
  const oe = document.createElement("select");
  oe.id = R, oe.classList.add("eidolon-light-criteria__select"), oe.dataset.action = "select-mapping", J.appendChild(oe);
  const X = document.createElement("button");
  X.type = "button", X.dataset.action = "apply-selected-mapping", X.classList.add("eidolon-light-criteria__button", "secondary"), X.textContent = E("EIDOLON.LightCriteria.ApplyButton", "Apply"), J.appendChild(X);
  const te = document.createElement("details");
  te.classList.add("eidolon-light-criteria__menu"), te.dataset.action = "mapping-actions-menu";
  const jt = document.createElement("summary");
  jt.classList.add("eidolon-light-criteria__menu-toggle"), jt.innerHTML = '<i class="fa-solid fa-ellipsis-vertical" inert=""></i>', jt.setAttribute(
    "aria-label",
    E("EIDOLON.LightCriteria.MoreActions", "More actions")
  ), jt.dataset.tooltip = E("EIDOLON.LightCriteria.MoreActions", "More actions"), te.appendChild(jt);
  const dt = document.createElement("div");
  dt.classList.add("eidolon-light-criteria__menu-list"), te.appendChild(dt);
  const _e = document.createElement("button");
  _e.type = "button", _e.dataset.action = "update-selected-mapping", _e.classList.add("eidolon-light-criteria__menu-item"), _e.textContent = E(
    "EIDOLON.LightCriteria.UpdateSelected",
    "Save current config to selected"
  ), dt.appendChild(_e);
  const Ze = document.createElement("button");
  Ze.type = "button", Ze.dataset.action = "edit-selected-mapping-criteria", Ze.classList.add("eidolon-light-criteria__menu-item"), Ze.textContent = E(
    "EIDOLON.LightCriteria.EditSelectedCriteria",
    "Edit selected mapping criteria"
  ), dt.appendChild(Ze);
  const et = document.createElement("button");
  et.type = "button", et.dataset.action = "remove-selected-mapping", et.classList.add("eidolon-light-criteria__menu-item", "danger"), et.textContent = E(
    "EIDOLON.LightCriteria.RemoveSelected",
    "Delete selected mapping"
  ), dt.appendChild(et), J.appendChild(te);
  const Bt = document.createElement("div");
  Bt.classList.add("eidolon-light-criteria-main-switcher"), Bt.appendChild(M);
  const ze = document.createElement("p");
  if (ze.classList.add("notes", "eidolon-light-criteria-main-switcher__empty"), ze.textContent = E(
    "EIDOLON.LightCriteria.ActiveRequiresBase",
    "Set Base Lighting to enable mapping selection and actions."
  ), Bt.appendChild(ze), s.length === 0) {
    const $ = document.createElement("p");
    $.classList.add("notification", "warning", "eidolon-light-criteria__warning"), $.textContent = E(
      "EIDOLON.LightCriteria.NoCategoriesWarning",
      "This scene has no criteria configured. Add criteria under Scene -> Criteria to enable criteria-driven lighting."
    ), w.appendChild($);
  } else if (l.length === 0) {
    const $ = document.createElement("p");
    $.classList.add("notification", "warning", "eidolon-light-criteria__warning"), $.textContent = E(
      "EIDOLON.LightCriteria.NoValuesWarning",
      "Criteria exist, but none define selectable values. Add values in Scene -> Criteria."
    ), w.appendChild($);
  }
  const Ce = document.createElement("div");
  Ce.classList.add("eidolon-light-criteria__creation"), Ce.dataset.section = "creation", Ce.hidden = !0;
  const yi = document.createElement("p");
  yi.classList.add("notes"), yi.textContent = E(
    "EIDOLON.LightCriteria.CreateDescription",
    "Assign scene criteria values to map the current configuration."
  ), Ce.appendChild(yi);
  const Ut = document.createElement("div");
  Ut.classList.add("eidolon-light-criteria__category-list"), Ce.appendChild(Ut);
  for (const $ of l) {
    const z = document.createElement("label");
    z.classList.add("eidolon-light-criteria__category");
    const Z = document.createElement("span");
    Z.classList.add("eidolon-light-criteria__category-name"), Z.textContent = (Lc = (Xr = $.name) == null ? void 0 : Xr.trim) != null && Lc.call(Xr) ? $.name.trim() : E("EIDOLON.LightCriteria.UnnamedCategory", "Unnamed Category"), z.appendChild(Z);
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
    z.appendChild(ee), Ut.appendChild(z);
  }
  const Fn = document.createElement("div");
  Fn.classList.add("eidolon-light-criteria__creation-actions");
  const tt = document.createElement("button");
  tt.type = "button", tt.dataset.action = "save-mapping", tt.classList.add("eidolon-light-criteria__button", "primary"), tt.textContent = E(
    "EIDOLON.LightCriteria.SaveMapping",
    "Save Mapping"
  ), Fn.appendChild(tt);
  const Vt = document.createElement("button");
  Vt.type = "button", Vt.dataset.action = "cancel-create", Vt.classList.add("eidolon-light-criteria__button", "secondary"), Vt.textContent = E(
    "EIDOLON.LightCriteria.Cancel",
    "Cancel"
  ), Fn.appendChild(Vt), Ce.appendChild(Fn), w.appendChild(Ce), i.prepend(Bt), i.appendChild(w), w.hidden = !0, Zh(e, {
    fieldset: w,
    homeContainer: i
  }), requestAnimationFrame(() => {
    var $;
    ($ = e.setPosition) == null || $.call(e, { height: "auto" });
  });
  let P = y;
  Hn({ switcher: M, emptyState: ze, state: P }), Rn(k, P), tr(O, {
    state: P,
    hasCategories: l.length > 0
  }), N("LightCriteria | Controls injected", {
    sceneId: (a == null ? void 0 : a.id) ?? null,
    lightId: (r == null ? void 0 : r.id) ?? null,
    hasBase: !!(P != null && P.base),
    mappingCount: Array.isArray(P == null ? void 0 : P.mappings) ? P.mappings.length : 0,
    categories: l.length
  });
  const Yr = gp(P), Q = {
    restoreConfig: null,
    app: e,
    selectedMapping: Yr,
    editorMode: "create",
    editingMappingId: null,
    mappingFilters: {}
  };
  Eo.set(w, Q);
  const ft = /* @__PURE__ */ c(() => {
    te.open = !1;
  }, "closeActionsMenu");
  jt.addEventListener("click", ($) => {
    te.classList.contains("is-disabled") && ($.preventDefault(), ft());
  });
  const Oe = /* @__PURE__ */ c(($ = Q.selectedMapping) => {
    const z = cp(W), Z = Array.isArray(P == null ? void 0 : P.mappings) ? P.mappings : [], ee = dp(Z, z), ne = Object.keys(z).length;
    Q.mappingFilters = z, U.disabled = ne === 0, fp(H, {
      totalCount: Z.length,
      visibleCount: ee.length,
      hasFilters: ne > 0,
      activeFilterCount: ne
    }), F.classList.toggle("has-active-filters", ne > 0), mp(oe, P, u, $, {
      mappings: ee,
      categoryOrder: d
    }), Q.selectedMapping = oe.value ?? "", us({
      mappingSelect: oe,
      applyMappingButton: X,
      updateMappingButton: _e,
      editCriteriaButton: Ze,
      removeMappingButton: et,
      actionsMenu: te,
      state: P
    }), te.classList.contains("is-disabled") && ft();
  }, "refreshMappingSelector");
  W.querySelectorAll("select[data-filter-category-id]").forEach(($) => {
    $.addEventListener("change", () => {
      const z = Q.selectedMapping;
      Oe(z), Q.selectedMapping !== z && ds(
        o ?? r,
        P,
        Q.selectedMapping
      ).then((Z) => {
        Z && (P = Z);
      });
    });
  }), U.addEventListener("click", () => {
    up(W);
    const $ = Q.selectedMapping;
    Oe($), F.open = !1, Q.selectedMapping !== $ && ds(
      o ?? r,
      P,
      Q.selectedMapping
    ).then((z) => {
      z && (P = z);
    });
  }), oe.addEventListener("change", () => {
    Q.selectedMapping = oe.value ?? "", us({
      mappingSelect: oe,
      applyMappingButton: X,
      updateMappingButton: _e,
      editCriteriaButton: Ze,
      removeMappingButton: et,
      actionsMenu: te,
      state: P
    }), ds(
      o ?? r,
      P,
      Q.selectedMapping
    ).then(($) => {
      $ && (P = $);
    });
  });
  const Yi = /* @__PURE__ */ c(async () => {
    var ee, ne, ce, ue, nt, tn, it, nn, ge, rn, on, Mt, Pn, Xi;
    const $ = oe.value ?? "";
    if (!$) {
      (ne = (ee = ui.notifications) == null ? void 0 : ee.warn) == null || ne.call(
        ee,
        E(
          "EIDOLON.LightCriteria.SelectMappingWarning",
          "Choose a criteria mapping before applying."
        )
      ), Oe(Q.selectedMapping);
      return;
    }
    if ($ === he) {
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
      lo(w, Ce, O), Co(e, n, P.base), P = await cr(o ?? r, {
        mappingId: he,
        categories: null,
        updatedAt: Date.now()
      }), Q.selectedMapping = he, Oe(Q.selectedMapping), Rn(k, P), Hn({ switcher: M, emptyState: ze, state: P }), tr(O, {
        state: P,
        hasCategories: l.length > 0
      }), eu(n, {
        mappingId: he,
        color: ((tn = (nt = P.base) == null ? void 0 : nt.config) == null ? void 0 : tn.color) ?? null
      }), (nn = (it = ui.notifications) == null ? void 0 : it.info) == null || nn.call(
        it,
        E(
          "EIDOLON.LightCriteria.BaseApplied",
          "Applied the base lighting state to the form."
        )
      ), ft();
      return;
    }
    const z = Array.isArray(P == null ? void 0 : P.mappings) && P.mappings.length ? P.mappings.find((bi) => (bi == null ? void 0 : bi.id) === $) : null;
    if (!z) {
      (rn = (ge = ui.notifications) == null ? void 0 : ge.warn) == null || rn.call(
        ge,
        E(
          "EIDOLON.LightCriteria.MappingUnavailable",
          "The selected criteria mapping is no longer available."
        )
      ), Q.selectedMapping = "", Oe(Q.selectedMapping);
      return;
    }
    lo(w, Ce, O), Co(e, n, z.config), P = await cr(o ?? r, {
      mappingId: z.id,
      categories: z.categories,
      updatedAt: Date.now()
    }), Q.selectedMapping = z.id, Oe(Q.selectedMapping), Rn(k, P), Hn({ switcher: M, emptyState: ze, state: P }), tr(O, {
      state: P,
      hasCategories: l.length > 0
    }), eu(n, {
      mappingId: z.id,
      color: ((Mt = (on = z.config) == null ? void 0 : on.config) == null ? void 0 : Mt.color) ?? null
    });
    const Z = _i(z, u, d);
    (Xi = (Pn = ui.notifications) == null ? void 0 : Pn.info) == null || Xi.call(
      Pn,
      E(
        "EIDOLON.LightCriteria.MappingApplied",
        "Applied mapping: {label}"
      ).replace("{label}", Z)
    ), ft();
  }, "applySelectedMapping");
  X.addEventListener("click", () => {
    Yi();
  }), oe.addEventListener("keydown", ($) => {
    $.key === "Enter" && ($.preventDefault(), Yi());
  });
  const Qr = /* @__PURE__ */ c(async () => {
    var z, Z, ee, ne, ce, ue, nt, tn, it, nn, ge, rn, on, Mt, Pn, Xi, bi, Zr, Ic, eo, Oc;
    const $ = Q.selectedMapping;
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
      const Ge = So(e, o);
      if ($ === he)
        P = await zc(o ?? r, Ge), N("LightCriteria | Base lighting updated", {
          lightId: ((ee = o ?? r) == null ? void 0 : ee.id) ?? null,
          configColor: ((ne = Ge == null ? void 0 : Ge.config) == null ? void 0 : ne.color) ?? null
        }), (ue = (ce = ui.notifications) == null ? void 0 : ce.info) == null || ue.call(
          ce,
          E(
            "EIDOLON.LightCriteria.BaseUpdated",
            "Updated the base lighting state with the current configuration."
          )
        ), Q.selectedMapping = he;
      else {
        const vi = ur(P, $);
        if (!vi) {
          (tn = (nt = ui.notifications) == null ? void 0 : nt.warn) == null || tn.call(
            nt,
            E(
              "EIDOLON.LightCriteria.MappingUnavailable",
              "The selected criteria mapping is no longer available."
            )
          ), Q.selectedMapping = "", Oe(Q.selectedMapping);
          return;
        }
        P = await Gc(
          o ?? r,
          vi.categories,
          Ge,
          { label: vi.label ?? null }
        ), N("LightCriteria | Mapping updated", {
          mappingId: $,
          hasColor: !!((it = Ge == null ? void 0 : Ge.config) != null && it.color),
          stored: Array.isArray(P == null ? void 0 : P.mappings) ? ((nn = P.mappings.find((Ya) => (Ya == null ? void 0 : Ya.id) === $)) == null ? void 0 : nn.config) ?? null : null,
          persisted: (rn = (ge = o ?? r) == null ? void 0 : ge.getFlag) == null ? void 0 : rn.call(ge, ai, Ni)
        });
        const Zi = ur(P, $), gm = _i(Zi || vi, u, d);
        N("LightCriteria | Mapping updated", {
          mappingId: $,
          categories: vi.categories,
          updatedColor: ((on = Ge == null ? void 0 : Ge.config) == null ? void 0 : on.color) ?? null,
          storedColor: ((Pn = (Mt = Zi == null ? void 0 : Zi.config) == null ? void 0 : Mt.config) == null ? void 0 : Pn.color) ?? ((bi = (Xi = vi.config) == null ? void 0 : Xi.config) == null ? void 0 : bi.color) ?? null
        }), (Ic = (Zr = ui.notifications) == null ? void 0 : Zr.info) == null || Ic.call(
          Zr,
          E(
            "EIDOLON.LightCriteria.MappingUpdated",
            "Saved changes to mapping: {label}"
          ).replace("{label}", gm)
        ), Q.selectedMapping = $;
      }
      Rn(k, P), Hn({ switcher: M, emptyState: ze, state: P }), tr(O, {
        state: P,
        hasCategories: l.length > 0
      }), Oe(Q.selectedMapping), ft();
    } catch (Ge) {
      console.error("eidolon-utilities | Failed to update light criteria mapping", Ge), (Oc = (eo = ui.notifications) == null ? void 0 : eo.error) == null || Oc.call(
        eo,
        E(
          "EIDOLON.LightCriteria.MappingUpdateError",
          "Failed to save the mapping. Check the console for details."
        )
      );
    } finally {
      _e.disabled = !1, us({
        mappingSelect: oe,
        applyMappingButton: X,
        updateMappingButton: _e,
        editCriteriaButton: Ze,
        removeMappingButton: et,
        actionsMenu: te,
        state: P
      });
    }
  }, "updateSelectedMapping");
  _e.addEventListener("click", () => {
    Qr();
  }), Oe(Q.selectedMapping), I.addEventListener("click", async () => {
    var $, z, Z, ee, ne, ce;
    I.disabled = !0;
    try {
      const ue = So(e, o);
      P = await zc(o ?? r, ue), N("LightCriteria | Base lighting stored", {
        lightId: (($ = o ?? r) == null ? void 0 : $.id) ?? null,
        configColor: ((z = ue == null ? void 0 : ue.config) == null ? void 0 : z.color) ?? null
      }), (ee = (Z = ui.notifications) == null ? void 0 : Z.info) == null || ee.call(
        Z,
        E(
          "EIDOLON.LightCriteria.BaseStored",
          "Saved the current configuration as the base lighting state."
        )
      ), Rn(k, P), Hn({ switcher: M, emptyState: ze, state: P }), tr(O, {
        state: P,
        hasCategories: l.length > 0
      }), Q.selectedMapping = he, Oe(Q.selectedMapping);
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
    const $ = Eo.get(w);
    Zc({
      app: e,
      fieldset: w,
      createButton: O,
      creationSection: Ce,
      categoryList: Ut,
      form: n,
      persistedLight: o,
      stateEntry: $,
      mode: "create",
      mapping: null,
      preloadConfig: P.base
    });
  }), Ze.addEventListener("click", () => {
    var Z, ee, ne, ce;
    const $ = Q.selectedMapping;
    if (!$ || $ === he) {
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
    ft(), of(e, { fieldset: w, homeContainer: i }), Zc({
      app: e,
      fieldset: w,
      createButton: O,
      creationSection: Ce,
      categoryList: Ut,
      form: n,
      persistedLight: o,
      stateEntry: Q,
      mode: "retarget",
      mapping: z,
      preloadConfig: z.config
    });
  }), tt.addEventListener("click", async () => {
    var z, Z, ee, ne, ce, ue, nt, tn, it, nn;
    const $ = yp(Ut);
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
      const ge = So(e, o);
      if (Q.editorMode === "retarget" && Q.editingMappingId) {
        const on = dl(P, $);
        let Mt = !1;
        if (on && on !== Q.editingMappingId && (Mt = await Qh(), !Mt)) {
          tt.disabled = !1;
          return;
        }
        P = await xg(
          o ?? r,
          Q.editingMappingId,
          $,
          ge,
          { replaceExisting: Mt }
        ), N("LightCriteria | Mapping criteria retargeted", {
          mappingId: Q.editingMappingId,
          categories: $,
          replaced: Mt,
          configColor: ((ee = ge == null ? void 0 : ge.config) == null ? void 0 : ee.color) ?? null
        }), (ce = (ne = ui.notifications) == null ? void 0 : ne.info) == null || ce.call(
          ne,
          E(
            "EIDOLON.LightCriteria.MappingCriteriaUpdated",
            "Updated mapping criteria for the selected mapping."
          )
        );
      } else
        P = await Gc(
          o ?? r,
          $,
          ge,
          {}
        ), N("LightCriteria | Mapping saved from editor", {
          categories: $,
          configColor: ((ue = ge == null ? void 0 : ge.config) == null ? void 0 : ue.color) ?? null
        }), (tn = (nt = ui.notifications) == null ? void 0 : nt.info) == null || tn.call(
          nt,
          E(
            "EIDOLON.LightCriteria.MappingSaved",
            "Updated lighting mapping for the selected scene criteria."
          )
        );
      Rn(k, P), Hn({ switcher: M, emptyState: ze, state: P });
      const rn = dl(P, $);
      rn && (Q.selectedMapping = rn), Oe(Q.selectedMapping), lo(w, Ce, O), ft();
    } catch (ge) {
      console.error("eidolon-utilities | Failed to persist light criteria mapping", ge), (nn = (it = ui.notifications) == null ? void 0 : it.error) == null || nn.call(
        it,
        E(
          "EIDOLON.LightCriteria.MappingError",
          "Failed to save the mapping. Check the console for details."
        )
      );
    } finally {
      tt.disabled = !1;
    }
  }), Vt.addEventListener("click", () => {
    const $ = Eo.get(w);
    $ != null && $.restoreConfig && Co(e, n, $.restoreConfig), lo(w, Ce, O);
  }), et.addEventListener("click", async () => {
    var Z, ee;
    const $ = Q.selectedMapping;
    !$ || $ === he || !await Xh() || (P = await Pg(o ?? r, $), Q.selectedMapping = "", Rn(k, P), Hn({ switcher: M, emptyState: ze, state: P }), Oe(Q.selectedMapping), ft(), (ee = (Z = ui.notifications) == null ? void 0 : Z.info) == null || ee.call(
      Z,
      E("EIDOLON.LightCriteria.MappingRemoved", "Removed selected mapping.")
    ));
  });
}
c(Yh, "enhanceAmbientLightConfig");
function Zc({
  app: e,
  fieldset: t,
  createButton: n,
  creationSection: i,
  categoryList: r,
  form: o,
  persistedLight: a,
  stateEntry: s,
  mode: l,
  mapping: u,
  preloadConfig: d
}) {
  s && (s.restoreConfig = So(e, a), s.editorMode = l, s.editingMappingId = l === "retarget" ? (u == null ? void 0 : u.id) ?? null : null), d && Co(e, o, d), l === "retarget" && (u != null && u.categories) ? pp(r, u.categories) : hp(r);
  const m = i.querySelector("p.notes");
  m instanceof HTMLElement && (m.textContent = l === "retarget" ? E(
    "EIDOLON.LightCriteria.EditCriteriaDescription",
    "Adjust criteria values for the selected mapping."
  ) : E(
    "EIDOLON.LightCriteria.CreateDescription",
    "Assign scene criteria values to map the current configuration."
  ));
  const g = i.querySelector('button[data-action="save-mapping"]');
  g instanceof HTMLButtonElement && (g.textContent = l === "retarget" ? E("EIDOLON.LightCriteria.SaveCriteriaChanges", "Save Criteria Changes") : E("EIDOLON.LightCriteria.SaveMapping", "Save Mapping")), i.hidden = !1, n.setAttribute("aria-expanded", "true"), sc(t, i), requestAnimationFrame(() => {
    var y;
    (y = e.setPosition) == null || y.call(e, { height: "auto" });
  });
}
c(Zc, "openMappingEditor");
async function Qh() {
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
c(Qh, "confirmCriteriaConflict");
async function Xh() {
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
c(Xh, "confirmRemoveMapping");
function Zh(e, { fieldset: t, homeContainer: n }) {
  const i = np(e, n);
  if (!(i instanceof HTMLElement)) return;
  const r = i.querySelector(".window-header");
  if (!(r instanceof HTMLElement)) return;
  let o = r.querySelector('[data-eidolon-action="open-light-criteria-manager"]');
  if (!(o instanceof HTMLButtonElement)) {
    o = document.createElement("button"), o.type = "button", o.classList.add("header-control", "icon"), o.dataset.eidolonAction = "open-light-criteria-manager", o.dataset.tooltip = E("EIDOLON.LightCriteria.OpenManager", "Open Scene Criteria Lighting"), o.setAttribute("aria-label", E("EIDOLON.LightCriteria.OpenManager", "Open Scene Criteria Lighting")), o.innerHTML = '<i class="fa-solid fa-sliders" inert=""></i>';
    const a = r.querySelector(".window-controls") ?? r, s = a.querySelector('[data-action="toggleControls"]');
    if ((s == null ? void 0 : s.parentElement) === a)
      a.insertBefore(o, s);
    else {
      const l = a.querySelector('[data-action="close"]');
      (l == null ? void 0 : l.parentElement) === a ? a.insertBefore(o, l) : a.appendChild(o);
    }
  }
  o.onclick = (a) => {
    a.preventDefault(), of(e, { fieldset: t, homeContainer: n });
  };
}
c(Zh, "ensureManagerHeaderButton");
function of(e, { fieldset: t, homeContainer: n }) {
  var g, y, h;
  const i = so.get(e);
  if (i != null && i.rendered) {
    (g = i.bringToTop) == null || g.call(i);
    return;
  }
  const r = /* @__PURE__ */ c((...p) => {
    var v;
    const w = ep(p), b = (v = w == null ? void 0 : w.querySelector) == null ? void 0 : v.call(w, ".eidolon-light-criteria-manager-host");
    b instanceof HTMLElement && (tp(t), t.hidden = !1, b.appendChild(t));
  }, "onRender"), o = /* @__PURE__ */ c(() => {
    n instanceof HTMLElement && n.appendChild(t), t.hidden = !0, so.delete(e), requestAnimationFrame(() => {
      var p;
      (p = e.setPosition) == null || p.call(e, { height: "auto" });
    });
  }, "onClose"), a = E("EIDOLON.LightCriteria.ManagerTitle", "Scene Criteria Lighting"), s = '<div class="eidolon-light-criteria-manager-host"></div>', l = E("EIDOLON.LightCriteria.Close", "Close"), u = (h = (y = foundry == null ? void 0 : foundry.applications) == null ? void 0 : y.api) == null ? void 0 : h.DialogV2;
  if (typeof (u == null ? void 0 : u.wait) == "function")
    try {
      let p = !1;
      const w = /* @__PURE__ */ c(() => {
        p || (p = !0, o());
      }, "closeOnce");
      so.set(e, {
        rendered: !0,
        bringToTop: /* @__PURE__ */ c(() => {
        }, "bringToTop")
      }), u.wait({
        window: { title: a },
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
      console.warn("eidolon-utilities | DialogV2 manager failed, falling back to Dialog", p), o();
    }
  const d = globalThis.Dialog;
  if (typeof d != "function") return;
  const m = new d(
    {
      title: a,
      content: s,
      buttons: {
        close: {
          label: l
        }
      },
      render: /* @__PURE__ */ c((...p) => r(...p), "render"),
      close: o
    },
    {
      width: 640,
      resizable: !0
    }
  );
  so.set(e, m), m.render(!0);
}
c(of, "openManagerDialog");
function ep(e) {
  for (const t of e) {
    const n = At(t);
    if (n) return n;
    const i = At(t == null ? void 0 : t.element);
    if (i) return i;
  }
  return null;
}
c(ep, "findDialogRoot");
function tp(e) {
  if (!(e instanceof HTMLElement) || e.dataset.managerLayout === "true") return;
  e.dataset.managerLayout = "true", e.classList.add("is-manager");
  const t = e.querySelector("legend"), n = e.querySelector("p.notes:not(.eidolon-light-criteria__status)"), i = e.querySelector(".eidolon-light-criteria__controls"), r = e.querySelector(".eidolon-light-criteria__status"), o = e.querySelector(".eidolon-light-criteria__creation"), a = Array.from(e.querySelectorAll(".eidolon-light-criteria__warning")), s = document.createElement("div");
  s.classList.add("eidolon-light-criteria-manager");
  const l = document.createElement("section");
  l.classList.add("eidolon-light-criteria-manager__section", "is-top"), s.appendChild(l);
  const u = document.createElement("section");
  u.classList.add("eidolon-light-criteria-manager__section", "is-bottom"), s.appendChild(u);
  const d = document.createElement("div");
  if (d.classList.add("eidolon-light-criteria-manager__header"), d.textContent = E("EIDOLON.LightCriteria.ManagerHeader", "Base State"), l.appendChild(d), r && l.appendChild(r), i && l.appendChild(i), a.length) {
    const g = document.createElement("div");
    g.classList.add("eidolon-light-criteria-manager__warnings");
    for (const y of a) g.appendChild(y);
    l.appendChild(g);
  }
  const m = document.createElement("div");
  m.classList.add("eidolon-light-criteria-manager__header"), m.textContent = E("EIDOLON.LightCriteria.ManagerAuthoring", "Create or Update Mapping"), u.appendChild(m), o && u.appendChild(o), e.innerHTML = "", t && e.appendChild(t), n && e.appendChild(n), e.appendChild(s), sc(e, o);
}
c(tp, "applyManagerLayout");
function np(e, t) {
  var i;
  const n = At(e == null ? void 0 : e.element);
  return n || (((i = t == null ? void 0 : t.closest) == null ? void 0 : i.call(t, ".application")) ?? null);
}
c(np, "resolveApplicationRoot");
function lo(e, t, n) {
  const i = Eo.get(e);
  i && (i.restoreConfig = null, i.editorMode = "create", i.editingMappingId = null), t.hidden = !0, n.setAttribute("aria-expanded", "false");
  const r = t.querySelector("p.notes");
  r instanceof HTMLElement && (r.textContent = E(
    "EIDOLON.LightCriteria.CreateDescription",
    "Assign scene criteria values to map the current configuration."
  ));
  const o = t.querySelector('button[data-action="save-mapping"]');
  o instanceof HTMLButtonElement && (o.textContent = E("EIDOLON.LightCriteria.SaveMapping", "Save Mapping")), sc(e, t), requestAnimationFrame(() => {
    var a, s;
    (s = (a = i == null ? void 0 : i.app) == null ? void 0 : a.setPosition) == null || s.call(a, { height: "auto" });
  });
}
c(lo, "hideCreationSection");
function Rn(e, t) {
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
c(Rn, "updateStatusLine");
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
function So(e, t) {
  var l, u, d;
  const n = t ?? af(e);
  if (!n)
    throw new Error("Ambient light document unavailable.");
  const i = fi(((l = n.toObject) == null ? void 0 : l.call(n)) ?? {});
  if (!i)
    throw new Error("Unable to duplicate ambient light data.");
  const r = (e == null ? void 0 : e.form) instanceof HTMLFormElement ? e.form : null, o = r ? jm(r) : {}, a = foundry.utils.mergeObject(i, o, {
    inplace: !1,
    performDeletions: !0
  });
  r && (r.querySelectorAll("color-picker[name]").forEach((m) => {
    var b, v;
    const g = m.getAttribute("name");
    if (!g) return;
    const y = typeof m.value == "string" ? m.value : "", h = ((b = m.ui) == null ? void 0 : b.input) ?? ((v = m.querySelector) == null ? void 0 : v.call(m, 'input[type="color"]')), p = (h == null ? void 0 : h.value) ?? "", w = y || p;
    typeof w != "string" || !w || (foundry.utils.setProperty(a, g, w), N("LightCriteria | Captured color-picker value", {
      path: g,
      pickerValue: y,
      swatchValue: p,
      chosenValue: w
    }));
  }), r.querySelectorAll("range-picker[name]").forEach((m) => {
    var O, k;
    const g = m.getAttribute("name");
    if (!g) return;
    const y = m.value !== void 0 && m.value !== null ? String(m.value) : "", h = (O = m.querySelector) == null ? void 0 : O.call(m, 'input[type="range"]'), p = (k = m.querySelector) == null ? void 0 : k.call(m, 'input[type="number"]'), w = h instanceof HTMLInputElement ? h.value : "", b = p instanceof HTMLInputElement ? p.value : "", v = y || b || w;
    if (typeof v != "string" || !v.length) return;
    const S = Number(v), I = Number.isFinite(S) ? S : v;
    foundry.utils.setProperty(a, g, I), N("LightCriteria | Captured range-picker value", {
      path: g,
      elementValue: y,
      numberValue: b,
      rangeValue: w,
      chosenValue: I
    });
  }));
  const s = fi(a);
  return N("LightCriteria | Captured form config", {
    lightId: (n == null ? void 0 : n.id) ?? null,
    hasColor: !!((u = s == null ? void 0 : s.config) != null && u.color),
    color: ((d = s == null ? void 0 : s.config) == null ? void 0 : d.color) ?? null
  }), s;
}
c(So, "captureAmbientLightFormConfig");
function Co(e, t, n) {
  if (!n || typeof n != "object") return;
  const i = foundry.utils.flattenObject(n, { safe: !0 });
  for (const [r, o] of Object.entries(i)) {
    const a = t.querySelectorAll(`[name="${r}"]`);
    if (a.length) {
      N("LightCriteria | Applying field", {
        path: r,
        value: o,
        elementCount: a.length
      });
      for (const s of a)
        s instanceof HTMLElement && s.tagName === "COLOR-PICKER" ? rp(s, o) : s instanceof HTMLElement && s.tagName === "RANGE-PICKER" ? op(s, o) : s instanceof HTMLInputElement ? ip(s, o) : s instanceof HTMLSelectElement ? ap(s, o) : s instanceof HTMLTextAreaElement && sp(s, o);
    }
  }
  requestAnimationFrame(() => {
    var r;
    return (r = e._previewChanges) == null ? void 0 : r.call(e);
  });
}
c(Co, "applyConfigToForm");
function ip(e, t, n) {
  const i = e.type;
  if (i === "checkbox") {
    const a = !!t;
    e.checked !== a && (e.checked = a, Ot(e));
    return;
  }
  if (i === "radio") {
    const a = t == null ? "" : String(t), s = e.value === a;
    e.checked !== s && (e.checked = s, s && Ot(e));
    return;
  }
  const r = t == null ? "" : String(t);
  let o = !1;
  e.value !== r && (e.value = r, o = !0), o && Ot(e);
}
c(ip, "applyValueToInput");
function rp(e, t, n) {
  var s, l, u, d, m, g;
  const i = t == null ? "" : String(t);
  let r = !1;
  e.value !== i && (e.value = i, e.setAttribute("value", i), (s = e.ui) != null && s.setValue && e.ui.setValue(i), r = !0);
  const o = ((l = e.ui) == null ? void 0 : l.input) ?? ((u = e.querySelector) == null ? void 0 : u.call(e, 'input[type="color"]'));
  o instanceof HTMLInputElement && o.value !== i && (o.value = i, Ot(o));
  const a = ((d = e.ui) == null ? void 0 : d.text) ?? ((m = e.querySelector) == null ? void 0 : m.call(e, 'input[type="text"]'));
  a instanceof HTMLInputElement && a.value !== i && (a.value = i, Ot(a)), (g = e.ui) != null && g.commit ? e.ui.commit() : (e.dispatchEvent(new Event("input", { bubbles: !0, cancelable: !0 })), e.dispatchEvent(new Event("change", { bubbles: !0, cancelable: !0 }))), N("LightCriteria | Color picker applied", {
    value: i,
    pickerValue: e.value ?? null,
    swatchValue: (o == null ? void 0 : o.value) ?? null,
    textValue: (a == null ? void 0 : a.value) ?? null
  }), r && Ot(e);
}
c(rp, "applyValueToColorPicker");
function op(e, t, n) {
  var u, d;
  const i = t == null ? "" : String(t), r = Number(i), o = Number.isFinite(r) ? r : i;
  let a = !1;
  e.value !== void 0 && e.value !== o && (e.value = o, a = !0), e.getAttribute("value") !== i && (e.setAttribute("value", i), a = !0);
  const s = (u = e.querySelector) == null ? void 0 : u.call(e, 'input[type="range"]');
  s instanceof HTMLInputElement && s.value !== i && (s.value = i, Ot(s));
  const l = (d = e.querySelector) == null ? void 0 : d.call(e, 'input[type="number"]');
  if (l instanceof HTMLInputElement && l.value !== i && (l.value = i, Ot(l)), typeof e.commit == "function")
    try {
      e.commit();
    } catch (m) {
      console.error("eidolon-utilities | range-picker commit failed", m);
    }
  N("LightCriteria | Range picker applied", {
    value: i,
    resolvedValue: o,
    rangeValue: (s == null ? void 0 : s.value) ?? null,
    numberValue: (l == null ? void 0 : l.value) ?? null
  }), a && Ot(e);
}
c(op, "applyValueToRangePicker");
function ap(e, t, n) {
  const i = t == null ? "" : String(t);
  e.value !== i && (e.value = i, Ot(e));
}
c(ap, "applyValueToSelect");
function sp(e, t, n) {
  const i = t == null ? "" : String(t);
  e.value !== i && (e.value = i, Ot(e));
}
c(sp, "applyValueToTextarea");
function Ot(e) {
  e.dispatchEvent(new Event("input", { bubbles: !0, cancelable: !0 })), e.dispatchEvent(new Event("change", { bubbles: !0, cancelable: !0 }));
}
c(Ot, "triggerInputChange");
function us({
  mappingSelect: e,
  applyMappingButton: t,
  updateMappingButton: n,
  editCriteriaButton: i,
  removeMappingButton: r,
  actionsMenu: o,
  state: a
}) {
  const s = (e == null ? void 0 : e.value) ?? "", l = !!(a != null && a.base), u = s && s !== he ? !!ur(a, s) : !1;
  if (t instanceof HTMLButtonElement && (s ? s === he ? t.disabled = !l : t.disabled = !u : t.disabled = !0), n instanceof HTMLButtonElement && (s ? s === he ? n.disabled = !1 : n.disabled = !u : n.disabled = !0), i instanceof HTMLButtonElement && (i.disabled = !s || s === he || !u), r instanceof HTMLButtonElement && (r.disabled = !s || s === he || !u), o instanceof HTMLElement) {
    const d = n instanceof HTMLButtonElement && !n.disabled || i instanceof HTMLButtonElement && !i.disabled || r instanceof HTMLButtonElement && !r.disabled;
    o.classList.toggle("is-disabled", !d), !d && "open" in o && (o.open = !1);
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
    var o, a;
    const i = n.dataset.filterCategoryId, r = (a = (o = n.value) == null ? void 0 : o.trim) == null ? void 0 : a.call(o);
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
    const o = r.categories ?? {};
    for (const [a, s] of i)
      if ((o == null ? void 0 : o[a]) !== s) return !1;
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
  const o = E(
    "EIDOLON.LightCriteria.FilterSummaryActive",
    "{active} filters · {visible}/{total}"
  ).replace("{active}", String(r)).replace("{visible}", String(n)).replace("{total}", String(t));
  e.textContent = o;
}
c(fp, "updateMappingFilterMeta");
function mp(e, t, n, i, r = {}) {
  if (!(e instanceof HTMLSelectElement)) return;
  const o = typeof i == "string" ? i : "", a = !!(t != null && t.base), s = Array.isArray(r == null ? void 0 : r.categoryOrder) ? r.categoryOrder : [], l = Array.isArray(r == null ? void 0 : r.mappings) ? r.mappings.slice() : Array.isArray(t == null ? void 0 : t.mappings) ? t.mappings.slice() : [], u = e.value;
  e.innerHTML = "";
  const d = document.createElement("option");
  d.value = "", d.textContent = E(
    "EIDOLON.LightCriteria.SelectPlaceholder",
    "Select a mapping"
  ), d.disabled = a, e.appendChild(d);
  const m = document.createElement("option");
  m.value = he, m.textContent = E(
    "EIDOLON.LightCriteria.BaseOption",
    "Base Lighting"
  ), m.disabled = !a, e.appendChild(m), l.slice().sort((p, w) => {
    var S;
    const b = _i(p, n, s), v = _i(w, n, s);
    return b.localeCompare(v, ((S = game.i18n) == null ? void 0 : S.lang) ?? void 0, {
      sensitivity: "base"
    });
  }).forEach((p) => {
    if (!(p != null && p.id)) return;
    const w = document.createElement("option");
    w.value = p.id, w.textContent = _i(p, n, s), e.appendChild(w);
  });
  const g = new Set(
    Array.from(e.options).filter((p) => !p.disabled).map((p) => p.value)
  ), y = a && u === "" ? "" : u, h = o || (g.has(y) ? y : "");
  h && g.has(h) ? e.value = h : a ? e.value = he : e.value = "";
}
c(mp, "populateMappingSelector");
function _i(e, t, n = []) {
  if (!e || typeof e != "object")
    return E("EIDOLON.LightCriteria.UnnamedMapping", "Unnamed Mapping");
  if (typeof e.label == "string" && e.label.trim())
    return e.label.trim();
  const i = e.categories ?? {}, r = [], o = /* @__PURE__ */ new Set();
  for (const s of n)
    !s || o.has(s) || (r.push(s), o.add(s));
  for (const s of Object.keys(i).sort((l, u) => l.localeCompare(u)))
    o.has(s) || (r.push(s), o.add(s));
  const a = r.map((s) => {
    const l = i == null ? void 0 : i[s];
    if (typeof l != "string" || !l.trim()) return null;
    const u = l.trim();
    return `${t.get(s) ?? E("EIDOLON.LightCriteria.UnnamedCategory", "Unnamed Category")}=${u}`;
  }).filter(Boolean);
  return a.length === 0 ? E("EIDOLON.LightCriteria.UnnamedMapping", "Unnamed Mapping") : a.join(" | ");
}
c(_i, "formatMappingOptionLabel");
function dl(e, t) {
  if (!e || typeof e != "object" || !Array.isArray(e.mappings)) return null;
  const n = Ki(t);
  if (!n) return null;
  const i = e.mappings.find((r) => (r == null ? void 0 : r.key) === n);
  return (i == null ? void 0 : i.id) ?? null;
}
c(dl, "findMappingIdByCategories");
function ur(e, t) {
  return !t || !e || typeof e != "object" || !Array.isArray(e.mappings) ? null : e.mappings.find((n) => (n == null ? void 0 : n.id) === t) ?? null;
}
c(ur, "getMappingById");
function gp(e) {
  if (!e || typeof e != "object") return "";
  const t = e.current;
  if (t != null && t.mappingId) {
    if (t.mappingId === he)
      return e != null && e.base ? he : "";
    if (Array.isArray(e.mappings) && e.mappings.some((n) => n.id === t.mappingId))
      return t.mappingId;
  }
  if (t != null && t.categories) {
    const n = dl(e, t.categories);
    if (n) return n;
  }
  return "";
}
c(gp, "resolveInitialMappingSelection");
function eu(e, t = {}) {
  var a, s, l, u;
  if (!(e instanceof HTMLFormElement)) return;
  const n = e.querySelector('color-picker[name="config.color"]'), i = (n == null ? void 0 : n.value) ?? null, r = ((a = n == null ? void 0 : n.ui) == null ? void 0 : a.text) ?? ((s = n == null ? void 0 : n.querySelector) == null ? void 0 : s.call(n, 'input[type="text"]')), o = ((l = n == null ? void 0 : n.ui) == null ? void 0 : l.input) ?? ((u = n == null ? void 0 : n.querySelector) == null ? void 0 : u.call(n, 'input[type="color"]'));
  N("LightCriteria | Color state after apply", {
    ...t,
    textValue: (r == null ? void 0 : r.value) ?? null,
    pickerValue: i,
    swatchValue: (o == null ? void 0 : o.value) ?? null
  });
}
c(eu, "logAppliedColorState");
function hp(e) {
  e.querySelectorAll("select[data-category-id]").forEach((t) => {
    t.value = "";
  });
}
c(hp, "resetCategorySelections");
function pp(e, t) {
  const n = t && typeof t == "object" ? t : {};
  e.querySelectorAll("select[data-category-id]").forEach((i) => {
    const r = i.dataset.categoryId;
    if (!r) return;
    const o = n[r];
    i.value = typeof o == "string" ? o : "";
  });
}
c(pp, "setCategorySelections");
function yp(e) {
  const t = {};
  return e.querySelectorAll("select[data-category-id]").forEach((n) => {
    var o, a;
    const i = n.dataset.categoryId, r = (a = (o = n.value) == null ? void 0 : o.trim) == null ? void 0 : a.call(o);
    !i || !r || (t[i] = r);
  }), Object.keys(t).length > 0 ? t : null;
}
c(yp, "readCategorySelections");
async function ds(e, t, n) {
  if (!e) return null;
  try {
    if (!n)
      return await cr(e, {});
    if (n === he)
      return await cr(e, {
        mappingId: he,
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
function Hn({ switcher: e, emptyState: t, state: n }) {
  const i = !!(n != null && n.base);
  e instanceof HTMLElement && (e.hidden = !i), t instanceof HTMLElement && (t.hidden = i);
}
c(Hn, "updateActiveMappingVisibility");
function af(e) {
  const t = (e == null ? void 0 : e.object) ?? (e == null ? void 0 : e.document) ?? null;
  return !(t != null && t.isEmbedded) || t.documentName !== "AmbientLight" ? null : t;
}
c(af, "getAmbientLightDocument");
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
  Kh();
}
c(vp, "registerLightCriteriaHooks");
vp();
const fl = /* @__PURE__ */ new Map();
let ml = !1;
function lc(e, t) {
  fl.has(e) && console.warn(`[${T}] Socket handler for type "${e}" already registered, overwriting.`), fl.set(e, t);
}
c(lc, "registerSocketHandler");
function To(e, t) {
  if (!ml) {
    console.error(`[${T}] Socket not initialized. Call initializeSocket() first.`);
    return;
  }
  game.socket.emit(`module.${T}`, { type: e, payload: t });
}
c(To, "emitSocket");
function wp() {
  ml || (game.socket.on(`module.${T}`, (e) => {
    const { type: t, payload: n } = e ?? {}, i = fl.get(t);
    i ? i(n) : console.warn(`[${T}] No socket handler for type "${t}"`);
  }), ml = !0, console.log(`[${T}] Socket initialized on channel module.${T}`));
}
c(wp, "initializeSocket");
const sf = "tween", lf = "tween-sequence", gl = "tween-sequence-cancel", Se = Object.freeze({
  ABORT: "abort",
  CONTINUE: "continue"
}), an = Object.freeze({
  COMPLETED: "completed",
  CANCELLED: "cancelled",
  FAILED: "failed"
}), mt = Object.freeze({
  BEFORE_ALL: "beforeAll",
  BEFORE_STEP: "before",
  ENTRY: "entry",
  AFTER_STEP: "after",
  RUNTIME: "runtime",
  VALIDATION: "validation",
  AWAIT: "await",
  EMIT: "emit",
  PARALLEL: "parallel"
}), Vo = /* @__PURE__ */ new Map();
function kt({ type: e, execute: t, validate: n }) {
  Vo.has(e) && console.warn(`[tween-registry] Type "${e}" already registered, overwriting.`), Vo.set(e, { type: e, execute: t, validate: n ?? (() => {
  }) });
}
c(kt, "registerTweenType");
function hi(e) {
  return Vo.get(e);
}
c(hi, "getTweenType");
function Ep(e, t = {}) {
  const n = hi(e);
  if (!n)
    throw new Error(`Unknown tween type: "${e}".`);
  return n.validate(t ?? {}), n;
}
c(Ep, "validateTweenEntry");
function hl() {
  return [...Vo.keys()];
}
c(hl, "listTweenTypes");
const $i = {
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
  easeInBounce: /* @__PURE__ */ c((e) => 1 - $i.easeOutBounce(1 - e), "easeInBounce"),
  easeInOutBounce: /* @__PURE__ */ c((e) => e < 0.5 ? (1 - $i.easeOutBounce(1 - 2 * e)) / 2 : (1 + $i.easeOutBounce(2 * e - 1)) / 2, "easeInOutBounce"),
  easeInElastic: /* @__PURE__ */ c((e) => e === 0 || e === 1 ? e : -Math.pow(2, 10 * (e - 1)) * Math.sin((e - 1.1) * 5 * Math.PI), "easeInElastic"),
  easeOutElastic: /* @__PURE__ */ c((e) => e === 0 || e === 1 ? e : Math.pow(2, -10 * e) * Math.sin((e - 0.1) * 5 * Math.PI) + 1, "easeOutElastic")
};
function pi(e) {
  if (e && $i[e])
    return $i[e];
  const t = foundry.canvas.animation.CanvasAnimation;
  return {
    linear: t.easeLinear,
    easeInOutCosine: t.easeInOutCosine
  }[e] ?? t.easeInOutCosine;
}
c(pi, "resolveEasing");
function Ba() {
  return ["linear", "easeInOutCosine", ...Object.keys($i)];
}
c(Ba, "listEasingNames");
function zo(e) {
  return e <= 0.04045 ? e / 12.92 : ((e + 0.055) / 1.055) ** 2.4;
}
c(zo, "srgbToLinear");
function Di(e) {
  return e <= 31308e-7 ? 12.92 * e : 1.055 * e ** (1 / 2.4) - 0.055;
}
c(Di, "linearToSrgb");
function tu(e, t, n) {
  const i = 0.4122214708 * e + 0.5363325363 * t + 0.0514459929 * n, r = 0.2119034982 * e + 0.6806995451 * t + 0.1073969566 * n, o = 0.0883024619 * e + 0.2817188376 * t + 0.6299787005 * n, a = Math.cbrt(i), s = Math.cbrt(r), l = Math.cbrt(o);
  return [
    0.2104542553 * a + 0.793617785 * s - 0.0040720468 * l,
    1.9779984951 * a - 2.428592205 * s + 0.4505937099 * l,
    0.0259040371 * a + 0.7827717662 * s - 0.808675766 * l
  ];
}
c(tu, "linearRgbToOklab");
function Sp(e, t, n) {
  const i = (e + 0.3963377774 * t + 0.2158037573 * n) ** 3, r = (e - 0.1055613458 * t - 0.0638541728 * n) ** 3, o = (e - 0.0894841775 * t - 1.291485548 * n) ** 3;
  return [
    4.0767416621 * i - 3.3077115913 * r + 0.2309699292 * o,
    -1.2684380046 * i + 2.6097574011 * r - 0.3413193965 * o,
    -0.0041960863 * i - 0.7034186147 * r + 1.707614701 * o
  ];
}
c(Sp, "oklabToLinearRgb");
function Go(e) {
  return [e.r, e.g, e.b];
}
c(Go, "colorToRgb");
function cf(e, t, n) {
  const i = /* @__PURE__ */ c((o) => Math.max(0, Math.min(1, o)), "clamp"), r = /* @__PURE__ */ c((o) => Math.round(i(o) * 255).toString(16).padStart(2, "0"), "toHex");
  return `#${r(e)}${r(t)}${r(n)}`;
}
c(cf, "rgbToHex");
function Cp(e, t, n) {
  if (n <= 0) return e.toHTML();
  if (n >= 1) return t.toHTML();
  const i = foundry.utils.Color, [r, o, a] = e.hsl, [s, l, u] = t.hsl, d = (s - r + 0.5) % 1 - 0.5, m = (r + d * n + 1) % 1, g = o + (l - o) * n, y = a + (u - a) * n;
  return i.fromHSL([m, g, y]).toHTML();
}
c(Cp, "interpolateHsl");
function Tp(e, t, n) {
  if (n <= 0) return e.toHTML();
  if (n >= 1) return t.toHTML();
  const [i, r, o] = Go(e).map(zo), [a, s, l] = Go(t).map(zo), u = Di(i + (a - i) * n), d = Di(r + (s - r) * n), m = Di(o + (l - o) * n);
  return cf(u, d, m);
}
c(Tp, "interpolateRgb");
function Lp(e, t, n) {
  if (n <= 0) return e.toHTML();
  if (n >= 1) return t.toHTML();
  const [i, r, o] = Go(e).map(zo), [a, s, l] = Go(t).map(zo), [u, d, m] = tu(i, r, o), [g, y, h] = tu(a, s, l), p = 0.02, w = Math.sqrt(d * d + m * m), b = Math.sqrt(y * y + h * h);
  let v, S, I;
  if (w < p || b < p)
    v = u + (g - u) * n, S = d + (y - d) * n, I = m + (h - m) * n;
  else {
    const x = Math.atan2(m, d);
    let F = Math.atan2(h, y) - x;
    F > Math.PI && (F -= 2 * Math.PI), F < -Math.PI && (F += 2 * Math.PI), v = u + (g - u) * n;
    const D = w + (b - w) * n, _ = x + F * n;
    S = D * Math.cos(_), I = D * Math.sin(_);
  }
  const [O, k, M] = Sp(v, S, I);
  return cf(Di(O), Di(k), Di(M));
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
function Bi() {
  return Object.keys(pl);
}
c(Bi, "listInterpolationModes");
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
  if (e.mode && !Bi().includes(e.mode))
    throw new Error(
      `light-color tween: unknown mode "${e.mode}". Available: ${Bi().join(", ")}`
    );
}
c(Ip, "validate$7");
async function Op(e, t = {}) {
  const { CanvasAnimation: n } = foundry.canvas.animation, { Color: i } = foundry.utils, { uuid: r, toColor: o, toAlpha: a, mode: s = "oklch" } = e, l = Array.isArray(r) ? r : [r];
  if (l.length === 0)
    return console.warn("light-color tween: empty uuid array, nothing to animate."), !0;
  const {
    durationMS: u = 2e3,
    easing: d = "easeInOutCosine",
    commit: m = !0,
    startEpochMS: g = null,
    signal: y = null
  } = t, h = pi(d), p = o != null, w = a != null, b = p ? uf(s) : null, v = p ? i.fromString(o) : null;
  if (p && !v.valid) throw new Error(`light-color tween: invalid target color "${o}".`);
  async function S(O) {
    var W, q;
    if (y != null && y.aborted) return !1;
    const k = await fromUuid(O);
    if (!k) return !1;
    const M = k.object;
    if (!M) return !1;
    let x;
    if (p) {
      const U = (W = k.config) == null ? void 0 : W.color;
      U != null && U.valid || console.warn(`light-color tween: source color invalid on ${O}, using white.`), x = U != null && U.valid ? U : i.fromString("#ffffff");
    }
    const R = w ? ((q = k._source.config) == null ? void 0 : q.alpha) ?? 0.5 : null, F = { t: 0 }, D = `ambient-hue-tween:${O}`;
    n.terminateAnimation(D), y && y.addEventListener("abort", () => {
      n.terminateAnimation(D);
    }, { once: !0 });
    const _ = typeof g == "number" ? Math.max(0, Math.min(u, Date.now() - g)) : 0, H = /* @__PURE__ */ c((U) => {
      const J = {};
      p && (J.color = b(x, v, U)), w && (J.alpha = R + (a - R) * U), k.updateSource({ config: J }), M.initializeLightSource();
    }, "applyFrame");
    _ > 0 && (F.t = _ / u, H(F.t));
    const B = await n.animate(
      [{ parent: F, attribute: "t", to: 1 }],
      {
        name: D,
        duration: u,
        easing: h,
        time: _,
        ontick: /* @__PURE__ */ c(() => H(F.t), "ontick")
      }
    );
    if (B !== !1) {
      if (y != null && y.aborted) return !1;
      const U = {};
      p && (U.color = v.toHTML()), w && (U.alpha = a), k.updateSource({ config: U }), M.initializeLightSource();
    }
    if (m && B !== !1 && k.canUserModify(game.user, "update")) {
      if (y != null && y.aborted) return !1;
      const U = {}, J = {};
      p && (U.color = x.toHTML(), J["config.color"] = v.toHTML()), w && (U.alpha = R, J["config.alpha"] = a), k.updateSource({ config: U }), await k.update(J);
    }
    return B !== !1;
  }
  return c(S, "animateOne"), (await Promise.all(l.map(S))).every(Boolean);
}
c(Op, "execute$7");
function Ap() {
  kt({ type: "light-color", execute: Op, validate: Ip });
}
c(Ap, "registerLightColorTween");
const sn = /* @__PURE__ */ new WeakMap();
function kp(e) {
  if ((Array.isArray(e.uuid) ? e.uuid : [e.uuid]).some((n) => !n || typeof n != "string"))
    throw new Error("light-state tween: 'uuid' is required (string or array of AmbientLight document UUIDs).");
  if (typeof e.enabled != "boolean")
    throw new Error("light-state tween: 'enabled' (boolean) is required.");
}
c(kp, "validate$6");
async function Mp(e, t = {}) {
  const { CanvasAnimation: n } = foundry.canvas.animation, { uuid: i, enabled: r } = e, o = Array.isArray(i) ? i : [i];
  if (o.length === 0)
    return console.warn("light-state tween: empty uuid array, nothing to animate."), !0;
  const {
    durationMS: a = 2e3,
    easing: s = "easeInOutCosine",
    commit: l = !0,
    startEpochMS: u = null,
    signal: d = null
  } = t, m = pi(s);
  async function g(h) {
    var k, M, x, R;
    if (d != null && d.aborted) return !1;
    const p = await fromUuid(h);
    if (!p) return !1;
    const w = p.object;
    if (!w) return !1;
    const b = `ambient-state-tween:${h}`;
    n.terminateAnimation(b), d && d.addEventListener("abort", () => {
      n.terminateAnimation(b);
    }, { once: !0 });
    const v = sn.get(p) ?? {
      hidden: p._source.hidden,
      alpha: ((k = p._source.config) == null ? void 0 : k.alpha) ?? 0.5
    };
    if (sn.set(p, v), N(`light-state START ${r ? "ON" : "OFF"} | snap: ${JSON.stringify(v)} | _source.hidden=${p._source.hidden}, _source.config.alpha=${(M = p._source.config) == null ? void 0 : M.alpha}`), r && !v.hidden || !r && v.hidden)
      return sn.delete(p), !0;
    const S = v.alpha, I = typeof u == "number" ? Math.max(0, Math.min(a, Date.now() - u)) : 0, O = /* @__PURE__ */ c((F) => {
      p.updateSource({ config: { alpha: F } }), w.initializeLightSource();
    }, "applyAlpha");
    if (r) {
      p.updateSource({ hidden: !1, config: { alpha: 0 } }), w.initializeLightSource(), canvas.perception.update({ refreshLighting: !0, refreshVision: !0 });
      const F = { t: 0 };
      I > 0 && (F.t = I / a, O(S * F.t));
      const D = await n.animate(
        [{ parent: F, attribute: "t", to: 1 }],
        {
          name: b,
          duration: a,
          easing: m,
          time: I,
          ontick: /* @__PURE__ */ c(() => O(S * F.t), "ontick")
        }
      );
      return D !== !1 && !(d != null && d.aborted) && l && p.canUserModify(game.user, "update") ? (p.updateSource({ hidden: !0, config: { alpha: S } }), await p.update({ hidden: !1 }), N(`light-state FADE-IN committed. _source.hidden=${p._source.hidden}, _source.config.alpha=${(x = p._source.config) == null ? void 0 : x.alpha}`), sn.delete(p)) : D === !1 || sn.delete(p), D !== !1;
    } else {
      p.updateSource({ hidden: !1, config: { alpha: v.alpha } }), w.initializeLightSource();
      const F = { t: 0 };
      I > 0 && (F.t = I / a, O(S * (1 - F.t)));
      const D = await n.animate(
        [{ parent: F, attribute: "t", to: 1 }],
        {
          name: b,
          duration: a,
          easing: m,
          time: I,
          ontick: /* @__PURE__ */ c(() => O(S * (1 - F.t)), "ontick")
        }
      );
      return D !== !1 && !(d != null && d.aborted) && l && p.canUserModify(game.user, "update") ? (await p.update({ hidden: !0 }), p.updateSource({ config: { alpha: S } }), w.initializeLightSource(), N(`light-state FADE-OUT committed+restored. _source.hidden=${p._source.hidden}, _source.config.alpha=${(R = p._source.config) == null ? void 0 : R.alpha}`), sn.delete(p)) : D === !1 || (p.updateSource({ hidden: !0, config: { alpha: S } }), w.initializeLightSource(), sn.delete(p)), D !== !1;
    }
  }
  return c(g, "animateOne"), (await Promise.all(o.map(g))).every(Boolean);
}
c(Mp, "execute$6");
function Np() {
  kt({ type: "light-state", execute: Mp, validate: kp });
}
c(Np, "registerLightStateTween");
function Ua(e) {
  if ((Array.isArray(e.uuid) ? e.uuid : [e.uuid]).some((n) => !n || typeof n != "string"))
    throw new Error("tile-prop tween: 'uuid' is required (string or array of Tile document UUIDs).");
  if (!e.attribute || typeof e.attribute != "string")
    throw new Error("tile-prop tween: 'attribute' (string) is required — dot-path to a numeric property (e.g. 'alpha', 'rotation').");
  if (typeof e.value != "number")
    throw new Error("tile-prop tween: 'value' (number) is required — the target value to animate to.");
}
c(Ua, "validate$5");
async function Va(e, t = {}) {
  const { CanvasAnimation: n } = foundry.canvas.animation, { uuid: i, attribute: r, value: o } = e, a = Array.isArray(i) ? i : [i];
  if (a.length === 0)
    return console.warn("tile-prop tween: empty uuid array, nothing to animate."), !0;
  const {
    durationMS: s = 2e3,
    easing: l = "easeInOutCosine",
    commit: u = !0,
    startEpochMS: d = null,
    signal: m = null
  } = t, g = pi(l);
  async function y(p) {
    if (m != null && m.aborted) return !1;
    const w = await fromUuid(p);
    if (!w) return !1;
    const b = w.object;
    if (!b) return !1;
    const v = foundry.utils.getProperty(w._source, r);
    if (typeof v != "number")
      return console.warn(`tile-prop tween: source value at '${r}' on ${p} is not a number (got ${typeof v}). Skipping.`), !1;
    const S = `tile-prop-tween:${r}:${p}`;
    n.terminateAnimation(S), m && m.addEventListener("abort", () => {
      n.terminateAnimation(S);
    }, { once: !0 });
    const I = typeof d == "number" ? Math.max(0, Math.min(s, Date.now() - d)) : 0, O = /* @__PURE__ */ c((x) => {
      const R = v + (o - v) * x;
      w.updateSource(foundry.utils.expandObject({ [r]: R })), b.refresh();
    }, "applyFrame"), k = { t: 0 };
    I > 0 && (k.t = I / s, O(k.t));
    const M = await n.animate(
      [{ parent: k, attribute: "t", to: 1 }],
      {
        name: S,
        duration: s,
        easing: g,
        time: I,
        ontick: /* @__PURE__ */ c(() => O(k.t), "ontick")
      }
    );
    if (M !== !1) {
      if (m != null && m.aborted) return !1;
      w.updateSource(foundry.utils.expandObject({ [r]: o })), b.refresh();
    }
    if (u && M !== !1 && w.canUserModify(game.user, "update")) {
      if (m != null && m.aborted) return !1;
      w.updateSource(foundry.utils.expandObject({ [r]: v })), await w.update({ [r]: o });
    }
    return M !== !1;
  }
  return c(y, "animateOne"), (await Promise.all(a.map(y))).every(Boolean);
}
c(Va, "execute$5");
function _p() {
  kt({ type: "tile-prop", execute: Va, validate: Ua });
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
    durationMS: o = 2e3,
    easing: a = "easeInOutCosine",
    startEpochMS: s = null,
    signal: l = null
  } = t, u = canvas.particleeffects;
  if (!u)
    return console.warn("particles-prop tween: canvas.particleeffects not available."), !1;
  const d = u[i];
  if (typeof d != "number")
    return console.warn(`particles-prop tween: current value of '${i}' is not a number (got ${typeof d}). Skipping.`), !1;
  const m = pi(a), g = `particles-prop-tween:${i}`;
  n.terminateAnimation(g), l && l.addEventListener("abort", () => {
    n.terminateAnimation(g);
  }, { once: !0 });
  const y = typeof s == "number" ? Math.max(0, Math.min(o, Date.now() - s)) : 0, h = /* @__PURE__ */ c((b) => {
    u[i] = d + (r - d) * b;
  }, "applyFrame"), p = { t: 0 };
  y > 0 && (p.t = y / o, h(p.t));
  const w = await n.animate(
    [{ parent: p, attribute: "t", to: 1 }],
    {
      name: g,
      duration: o,
      easing: m,
      time: y,
      ontick: /* @__PURE__ */ c(() => h(p.t), "ontick")
    }
  );
  if (w !== !1) {
    if (l != null && l.aborted) return !1;
    u[i] = r;
  }
  return w !== !1;
}
c(Dp, "execute$4");
function Fp() {
  kt({ type: "particles-prop", execute: Dp, validate: $p });
}
c(Fp, "registerParticlesPropTween");
var mn, kr, Mr, Nr, _r, $r, xi;
const Ec = class Ec {
  /**
   * @param {AbortController} controller
   */
  constructor(t) {
    A(this, mn);
    A(this, kr);
    A(this, Mr);
    A(this, Nr);
    A(this, _r);
    A(this, $r, !1);
    A(this, xi, null);
    L(this, mn, t), L(this, Nr, new Promise((n) => {
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
    return f(this, mn).signal.aborted;
  }
  /** @returns {AbortSignal} */
  get signal() {
    return f(this, mn).signal;
  }
  /** @returns {string} */
  get status() {
    return f(this, xi) ? f(this, xi).status : this.cancelled ? "cancelled" : "running";
  }
  /** Abort the timeline, triggering onCancel callbacks. */
  cancel(t = "cancelled") {
    f(this, mn).signal.aborted || f(this, mn).abort(t);
  }
  /**
   * Called internally by the execution engine when the timeline finishes.
   * @param {boolean} completed - true if all steps ran, false if cancelled
   */
  _resolve(t) {
    if (f(this, $r)) return;
    L(this, $r, !0);
    const n = typeof t == "boolean" ? { status: t ? "completed" : "cancelled" } : t ?? { status: "cancelled" };
    L(this, xi, n), f(this, kr).call(this, n.status === "completed"), f(this, Mr).call(this, n);
  }
};
mn = new WeakMap(), kr = new WeakMap(), Mr = new WeakMap(), Nr = new WeakMap(), _r = new WeakMap(), $r = new WeakMap(), xi = new WeakMap(), c(Ec, "TimelineHandle");
let yl = Ec;
var Zn, Pi, ei;
const Sc = class Sc {
  constructor() {
    /** @type {Map<string, Set<Function>>} */
    A(this, Zn, /* @__PURE__ */ new Map());
    /** @type {Set<string>} Signals that have been emitted (sticky) */
    A(this, Pi, /* @__PURE__ */ new Set());
    A(this, ei, !1);
  }
  /**
   * Subscribe to a named signal.
   * @param {string} signal
   * @param {Function} listener
   * @returns {() => void} Unsubscribe function
   */
  on(t, n) {
    if (f(this, ei)) return () => {
    };
    let i = f(this, Zn).get(t);
    return i || (i = /* @__PURE__ */ new Set(), f(this, Zn).set(t, i)), i.add(n), () => i.delete(n);
  }
  /**
   * Fire a named signal synchronously. All registered listeners are invoked.
   * The signal is recorded so that future waitFor() calls resolve immediately.
   * @param {string} signal
   */
  emit(t) {
    if (f(this, ei)) return;
    f(this, Pi).add(t);
    const n = f(this, Zn).get(t);
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
    return f(this, ei) ? Promise.reject(new Error("EventBus destroyed")) : f(this, Pi).has(t) ? Promise.resolve() : new Promise((i, r) => {
      if (n != null && n.aborted)
        return r(n.reason ?? "aborted");
      const o = this.on(t, () => {
        o(), a && (n == null || n.removeEventListener("abort", a)), i();
      });
      let a;
      n && (a = /* @__PURE__ */ c(() => {
        o(), r(n.reason ?? "aborted");
      }, "onAbort"), n.addEventListener("abort", a, { once: !0 }));
    });
  }
  /**
   * Tear down the bus, clearing all listeners.
   */
  destroy() {
    L(this, ei, !0), f(this, Zn).clear(), f(this, Pi).clear();
  }
};
Zn = new WeakMap(), Pi = new WeakMap(), ei = new WeakMap(), c(Sc, "EventBus");
let bl = Sc;
const df = /* @__PURE__ */ new Map();
function za(e, t) {
  df.set(e, t);
}
c(za, "registerAwaitProvider");
function vl(e, t) {
  const n = df.get(e.event);
  return n ? n(e, t) : Promise.reject(new Error(`Unknown await event type: "${e.event}"`));
}
c(vl, "createAwaitPromise");
za("signal", (e, t) => e.name ? t.eventBus.waitFor(e.name, t.signal) : Promise.reject(new Error('await signal: "name" is required')));
za("click", (e, t) => new Promise((n, i) => {
  if (t.signal.aborted) return i(t.signal.reason ?? "aborted");
  const r = /* @__PURE__ */ c(() => {
    a(), n();
  }, "onClick"), o = /* @__PURE__ */ c(() => {
    a(), i(t.signal.reason ?? "aborted");
  }, "onAbort"), a = /* @__PURE__ */ c(() => {
    document.removeEventListener("click", r), t.signal.removeEventListener("abort", o);
  }, "cleanup");
  document.addEventListener("click", r, { once: !0 }), t.signal.addEventListener("abort", o, { once: !0 });
}));
za("keypress", (e, t) => new Promise((n, i) => {
  if (t.signal.aborted) return i(t.signal.reason ?? "aborted");
  const r = /* @__PURE__ */ c((s) => {
    e.key && s.key !== e.key || (a(), n());
  }, "onKey"), o = /* @__PURE__ */ c(() => {
    a(), i(t.signal.reason ?? "aborted");
  }, "onAbort"), a = /* @__PURE__ */ c(() => {
    document.removeEventListener("keydown", r), t.signal.removeEventListener("abort", o);
  }, "cleanup");
  document.addEventListener("keydown", r), t.signal.addEventListener("abort", o, { once: !0 });
}));
const Li = /* @__PURE__ */ new Map();
function xp(e, t) {
  const n = Li.get(e);
  n && !n.cancelled && n.cancel("replaced-by-name"), Li.set(e, t), t.finished.then(() => {
    Li.get(e) === t && Li.delete(e);
  });
}
c(xp, "registerTimeline");
function ff(e) {
  const t = Li.get(e);
  return t && !t.cancelled ? (t.cancel("cancelled-by-name"), !0) : !1;
}
c(ff, "cancelTimeline");
function Pp(e) {
  return Li.get(e);
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
var Pe, Te, wt, hn, xr, Pr, Rr, Hr, Nn, El, Y, Gt, Sl, mf, Cl, gf, hf, Lo, rt, _t;
const Jt = class Jt {
  constructor() {
    A(this, Y);
    /** @type {string|null} */
    A(this, Pe, null);
    /** @type {string} */
    A(this, Te, Se.ABORT);
    /** @type {Array<object>} */
    A(this, wt, []);
    /** @type {StepBuilder|null} */
    A(this, hn, null);
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
    return C(this, Y, Gt).call(this), L(this, hn, new wl(this)), f(this, hn);
  }
  /**
   * Insert a delay (in ms) between the previous step and the next.
   * @param {number} ms
   * @returns {TweenTimeline} this
   */
  delay(t) {
    return C(this, Y, Gt).call(this), f(this, wt).push({ kind: "delay", ms: t }), this;
  }
  /**
   * Pause execution until an event occurs.
   * @param {object} config  e.g. { event: "click" }, { event: "signal", name: "fog-done" }
   * @returns {TweenTimeline} this
   */
  await(t) {
    return C(this, Y, Gt).call(this), f(this, wt).push({ kind: "await", config: t }), this;
  }
  /**
   * Fire a named signal (instant, non-blocking).
   * @param {string} signal  Signal name
   * @returns {TweenTimeline} this
   */
  emit(t) {
    return C(this, Y, Gt).call(this), f(this, wt).push({ kind: "emit", signal: t }), this;
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
    C(this, Y, Gt).call(this);
    const i = n.join ?? "all", r = n.overflow ?? "detach";
    if (i !== "all" && i !== "any" && (typeof i != "number" || i < 1 || i > t.length))
      throw new Error(`parallel: join must be "all", "any", or 1..${t.length}, got ${JSON.stringify(i)}`);
    if (r !== "detach" && r !== "cancel")
      throw new Error(`parallel: overflow must be "detach" or "cancel", got ${JSON.stringify(r)}`);
    const o = t.map((a) => {
      var l;
      const s = new Jt();
      return a(s), C(l = s, Y, Gt).call(l), f(s, wt);
    });
    return f(this, wt).push({ kind: "parallel", branches: o, join: i, overflow: r }), this;
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
    C(this, Y, Gt).call(this);
    const n = new AbortController();
    t.signal && (t.signal.aborted ? n.abort(t.signal.reason ?? "parent-aborted") : t.signal.addEventListener("abort", () => {
      n.signal.aborted || n.abort(t.signal.reason ?? "parent-aborted");
    }, { once: !0 }));
    const i = new yl(n);
    f(this, Pe) && xp(f(this, Pe), i);
    const r = t.broadcast ?? game.user.isGM, o = t.commit ?? game.user.isGM, a = t.startEpochMS ?? Date.now();
    r && f(this, Pe) && To(lf, {
      name: f(this, Pe),
      data: this.toJSON(),
      startEpochMS: a
    });
    const s = new bl(), l = {
      signal: i.signal,
      commit: o,
      startEpochMS: a,
      eventBus: s,
      errors: [],
      detachedPromises: []
    };
    return C(this, Y, mf).call(this, i, l).then((u) => {
      var d, m, g;
      s.destroy(), i._resolve(u), u.status === an.COMPLETED ? (d = f(this, Pr)) == null || d.call(this) : u.status === an.CANCELLED ? ((m = f(this, Rr)) == null || m.call(this), r && f(this, Pe) && To(gl, {
        name: f(this, Pe),
        reason: u.reason
      })) : ((g = f(this, Hr)) == null || g.call(this, u), r && f(this, Pe) && To(gl, {
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
    C(this, Y, Gt).call(this);
    const n = { timeline: C(i = Jt, Nn, El).call(i, f(this, wt)) };
    return f(this, Pe) && (n.name = f(this, Pe)), f(this, Te) !== Se.ABORT && (n.errorPolicy = f(this, Te)), n;
  }
};
Pe = new WeakMap(), Te = new WeakMap(), wt = new WeakMap(), hn = new WeakMap(), xr = new WeakMap(), Pr = new WeakMap(), Rr = new WeakMap(), Hr = new WeakMap(), Nn = new WeakSet(), El = /* @__PURE__ */ c(function(t) {
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
            var o;
            return C(o = Jt, Nn, El).call(o, r);
          }),
          join: i.join,
          overflow: i.overflow
        }
      });
    else {
      const r = i.data.entries.map((o) => {
        const a = { type: o.type, params: o.params };
        return Object.keys(o.opts).length > 0 && (a.opts = o.opts), o.detach && (a.detach = !0), a;
      });
      n.push(r);
    }
  return n;
}, "#serializeSegments"), Y = new WeakSet(), // ── Private ─────────────────────────────────────────────────────────
Gt = /* @__PURE__ */ c(function() {
  f(this, hn) && (f(this, wt).push({ kind: "step", data: f(this, hn)._finalize() }), L(this, hn, null));
}, "#finalizeCurrentStep"), Sl = /* @__PURE__ */ c(function(t) {
  t.length !== 0 && Promise.allSettled(t).catch(() => {
  });
}, "#drainDetached"), mf = /* @__PURE__ */ c(async function(t, n) {
  var i, r;
  try {
    if (n.signal.aborted) return C(this, Y, rt).call(this, n.signal.reason);
    const o = await C(this, Y, Lo).call(this, f(this, xr), mt.BEFORE_ALL, null);
    if (o) {
      if (f(this, Te) === Se.ABORT) return o;
      n.errors.push(o);
    }
    const a = await C(this, Y, Cl).call(this, f(this, wt), n);
    if (a)
      return C(i = Jt, Nn, Sl).call(i, n.detachedPromises), a;
    if (!n.signal.aborted) {
      const s = await Promise.allSettled(n.detachedPromises);
      for (const l of s)
        if (l.status === "rejected") {
          const u = C(this, Y, _t).call(this, l.reason, mt.ENTRY);
          if (f(this, Te) === Se.ABORT) return u;
          n.errors.push(u);
        }
    }
    return n.signal.aborted ? C(this, Y, rt).call(this, n.signal.reason) : {
      status: an.COMPLETED,
      ...n.errors.length > 0 ? { errors: n.errors } : {}
    };
  } catch (o) {
    return C(r = Jt, Nn, Sl).call(r, n.detachedPromises), n.signal.aborted ? C(this, Y, rt).call(this, n.signal.reason) : (console.error("TweenTimeline execution error:", o), C(this, Y, _t).call(this, o, mt.RUNTIME));
  }
}, "#execute"), Cl = /* @__PURE__ */ c(async function(t, n) {
  let i = -1, r = 0;
  for (const o of t) {
    if (n.signal.aborted) return C(this, Y, rt).call(this, n.signal.reason);
    if (o.kind === "delay") {
      try {
        await nu(o.ms, n.signal);
      } catch {
        return C(this, Y, rt).call(this, n.signal.reason);
      }
      r += o.ms;
      continue;
    }
    if (o.kind === "await") {
      try {
        let h = vl(o.config, {
          signal: n.signal,
          eventBus: n.eventBus
        });
        const p = o.config.timeout;
        typeof p == "number" && p > 0 && (h = Promise.race([
          h,
          nu(p, n.signal)
        ])), await h;
      } catch (h) {
        if (n.signal.aborted) return C(this, Y, rt).call(this, n.signal.reason);
        const p = C(this, Y, _t).call(this, h, mt.AWAIT);
        if (f(this, Te) === Se.ABORT) return p;
        n.errors.push(p);
      }
      continue;
    }
    if (o.kind === "emit") {
      try {
        n.eventBus.emit(o.signal);
      } catch (h) {
        const p = C(this, Y, _t).call(this, h, mt.EMIT);
        if (f(this, Te) === Se.ABORT) return p;
        n.errors.push(p);
      }
      continue;
    }
    if (o.kind === "parallel") {
      const h = await C(this, Y, gf).call(this, o, n, r);
      if (h) return h;
      continue;
    }
    i += 1;
    const { entries: a, before: s, after: l } = o.data, u = await C(this, Y, Lo).call(this, s, mt.BEFORE_STEP, i);
    if (u) {
      if (f(this, Te) === Se.ABORT) return u;
      n.errors.push(u);
      continue;
    }
    if (n.signal.aborted) return C(this, Y, rt).call(this, n.signal.reason);
    const d = [];
    let m = 0;
    for (const h of a) {
      const p = hi(h.type);
      if (!p) {
        const S = C(this, Y, _t).call(this, new Error(`TweenTimeline: unknown tween type "${h.type}"`), mt.ENTRY, i, h.type);
        if (f(this, Te) === Se.ABORT) return S;
        n.errors.push(S), console.warn(S.error.message);
        continue;
      }
      const w = {
        ...h.opts,
        commit: n.commit,
        startEpochMS: n.startEpochMS + r,
        signal: n.signal
      }, b = w.durationMS ?? 2e3, v = Promise.resolve().then(() => p.execute(h.params, w)).then((S) => S === !1 ? {
        ok: !1,
        failure: C(this, Y, _t).call(this, new Error("Tween entry returned false."), mt.ENTRY, i, h.type)
      } : { ok: !0 }).catch((S) => ({
        ok: !1,
        failure: C(this, Y, _t).call(this, S, mt.ENTRY, i, h.type)
      }));
      h.detach ? n.detachedPromises.push(v) : (d.push(v), m = Math.max(m, b));
    }
    const g = await C(this, Y, hf).call(this, d, n.signal);
    if (g === null) return C(this, Y, rt).call(this, n.signal.reason);
    for (const h of g)
      if (!h.ok) {
        if (f(this, Te) === Se.ABORT) return h.failure;
        n.errors.push(h.failure), console.warn("TweenTimeline: entry failed:", h.failure.error);
      }
    const y = await C(this, Y, Lo).call(this, l, mt.AFTER_STEP, i);
    if (y) {
      if (f(this, Te) === Se.ABORT) return y;
      n.errors.push(y);
    }
    if (n.signal.aborted) return C(this, Y, rt).call(this, n.signal.reason);
    r += m;
  }
  return null;
}, "#executeSegments"), gf = /* @__PURE__ */ c(async function(t, n, i = 0) {
  const { branches: r, join: o, overflow: a } = t, s = r.length, l = o === "all" ? s : o === "any" ? 1 : o, u = r.map(() => {
    const h = new AbortController();
    return n.signal.aborted ? h.abort(n.signal.reason ?? "parent-aborted") : n.signal.addEventListener("abort", () => {
      h.signal.aborted || h.abort(n.signal.reason ?? "parent-aborted");
    }, { once: !0 }), h;
  });
  let d = 0, m = 0;
  const g = new Array(s).fill(null);
  let y;
  return new Promise((h) => {
    let p = !1;
    const w = /* @__PURE__ */ c(() => {
      if (p) return;
      if (d >= l) {
        p = !0, b(), h(null);
        return;
      }
      const v = s - d - m;
      if (d + v < l) {
        p = !0, b();
        const S = g.filter((O) => O && O.status === an.FAILED).map((O) => O), I = C(this, Y, _t).call(this, new Error(`parallel: join target ${l} impossible (${d} completed, ${m} failed)`), mt.PARALLEL);
        f(this, Te) === Se.ABORT ? h(I) : (n.errors.push(I), n.errors.push(...S), h(null));
      }
    }, "checkJoin"), b = /* @__PURE__ */ c(() => {
      if (a === "cancel")
        for (let v = 0; v < s; v++)
          !g[v] && !u[v].signal.aborted && u[v].abort("overflow-cancel");
      for (let v = 0; v < s; v++)
        g[v] || n.detachedPromises.push(y[v]);
    }, "applyOverflow");
    if (y = r.map((v, S) => {
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
      return C(this, Y, Cl).call(this, v, I).then((O) => {
        if (O)
          if (O.status === an.CANCELLED) {
            if (u[S].signal.aborted) {
              g[S] = O;
              return;
            }
            g[S] = O, m++;
          } else
            g[S] = O, m++;
        else
          g[S] = { status: an.COMPLETED }, d++;
        w();
      });
    }), n.signal.aborted) {
      p = !0, h(C(this, Y, rt).call(this, n.signal.reason));
      return;
    }
    n.signal.addEventListener("abort", () => {
      p || (p = !0, h(C(this, Y, rt).call(this, n.signal.reason)));
    }, { once: !0 });
  });
}, "#executeParallel"), /**
 * @param {Array<Promise<{ok: boolean, failure?: object}>>} stepPromises
 * @param {AbortSignal} signal
 * @returns {Promise<Array<{ok: boolean, failure?: object}>|null>}
 */
hf = /* @__PURE__ */ c(function(t, n) {
  return t.length === 0 ? Promise.resolve([]) : n.aborted ? Promise.resolve(null) : new Promise((i, r) => {
    const o = /* @__PURE__ */ c(() => i(null), "onAbort");
    n.addEventListener("abort", o, { once: !0 }), Promise.all(t).then((a) => {
      n.removeEventListener("abort", o), i(a);
    }).catch((a) => {
      n.removeEventListener("abort", o), r(a);
    });
  });
}, "#waitForStep"), Lo = /* @__PURE__ */ c(async function(t, n, i) {
  if (!t) return null;
  try {
    return await t(), null;
  } catch (r) {
    const o = C(this, Y, _t).call(this, r, n, i ?? void 0);
    return f(this, Te) === Se.CONTINUE && console.warn(`TweenTimeline: hook failure in ${n}:`, r), o;
  }
}, "#runHook"), /** @param {unknown} reason */
rt = /* @__PURE__ */ c(function(t) {
  let n;
  return typeof t == "string" ? n = t : t instanceof Error && (n = t.message), {
    status: an.CANCELLED,
    ...n ? { reason: n } : {}
  };
}, "#cancelledOutcome"), /**
 * @param {unknown} err
 * @param {string} phase
 * @param {number} [stepIndex]
 * @param {string} [entryType]
 */
_t = /* @__PURE__ */ c(function(t, n, i, r) {
  const o = t instanceof Error ? t : new Error(String(t));
  return {
    status: an.FAILED,
    error: o,
    phase: n,
    ...typeof i == "number" ? { stepIndex: i } : {},
    ...r ? { entryType: r } : {}
  };
}, "#failedOutcome"), A(Jt, Nn), c(Jt, "TweenTimeline");
let Wo = Jt;
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
    const r = e[i], o = `${t}[${i}]`;
    if (Array.isArray(r)) {
      if (r.length === 0)
        throw new Error(`Sequence JSON: ${o} is an empty step.`);
      for (let a = 0; a < r.length; a++) {
        const s = r[a];
        if (!s || typeof s != "object")
          throw new Error(`Sequence JSON: ${o}[${a}] must be an object.`);
        if (typeof s.type != "string" || !s.type)
          throw new Error(`Sequence JSON: ${o}[${a}].type must be a non-empty string.`);
        if (s.params != null && typeof s.params != "object")
          throw new Error(`Sequence JSON: ${o}[${a}].params must be an object.`);
        if (s.opts != null && typeof s.opts != "object")
          throw new Error(`Sequence JSON: ${o}[${a}].opts must be an object.`);
        if (s.detach != null && typeof s.detach != "boolean")
          throw new Error(`Sequence JSON: ${o}[${a}].detach must be a boolean.`);
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
      const a = r.await;
      if (!a || typeof a != "object")
        throw new Error(`Sequence JSON: ${o}.await must be an object.`);
      if (typeof a.event != "string" || !a.event)
        throw new Error(`Sequence JSON: ${o}.await.event must be a non-empty string.`);
      if (a.event === "signal" && (typeof a.name != "string" || !a.name))
        throw new Error(`Sequence JSON: ${o}.await signal requires a non-empty "name".`);
      if (a.event === "keypress" && a.key != null && typeof a.key != "string")
        throw new Error(`Sequence JSON: ${o}.await keypress "key" must be a string.`);
      if (a.timeout != null && (typeof a.timeout != "number" || a.timeout <= 0))
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
      const a = r.parallel;
      if (!a || typeof a != "object")
        throw new Error(`Sequence JSON: ${o}.parallel must be an object.`);
      if (!Array.isArray(a.branches) || a.branches.length === 0)
        throw new Error(`Sequence JSON: ${o}.parallel.branches must be a non-empty array.`);
      const s = a.join ?? "all";
      if (s !== "all" && s !== "any" && (typeof s != "number" || !Number.isInteger(s) || s < 1 || s > a.branches.length))
        throw new Error(`Sequence JSON: ${o}.parallel.join must be "all", "any", or 1..${a.branches.length}.`);
      const l = a.overflow ?? "detach";
      if (l !== "detach" && l !== "cancel")
        throw new Error(`Sequence JSON: ${o}.parallel.overflow must be "detach" or "cancel".`);
      for (let u = 0; u < a.branches.length; u++) {
        const d = a.branches[u];
        if (!Array.isArray(d))
          throw new Error(`Sequence JSON: ${o}.parallel.branches[${u}] must be an array.`);
        pf(d, `${o}.parallel.branches[${u}]`, n + 1);
      }
      continue;
    }
    throw new Error(`Sequence JSON: ${o} is not a recognized segment (step array, delay, await, emit, or parallel).`);
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
      for (let o = 0; o < i.length; o++) {
        const a = i[o];
        try {
          Ep(a.type, a.params ?? {});
        } catch (s) {
          throw new Error(`Sequence JSON: ${r}[${o}] failed semantic validation: ${s.message}`);
        }
      }
    else if (i.parallel)
      for (let o = 0; o < i.parallel.branches.length; o++)
        bf(i.parallel.branches[o], `${r}.parallel.branches[${o}]`);
  }
}
c(bf, "validateSegmentsSemantics");
function uc(e, t = {}) {
  cc(e), t.validateSemantics && yf(e);
  const n = new Wo();
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
      const i = n.parallel, r = i.branches.map((o) => (a) => vf(o, a));
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
  kt({ type: "sequence", execute: Hp, validate: Rp });
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
  const o = typeof i == "number" ? Math.max(0, Math.min(n, Date.now() - i)) : 0, a = Math.max(0, n - o), s = { duration: a };
  if (e.x != null && (s.x = e.x), e.y != null && (s.y = e.y), e.scale != null && (s.scale = e.scale), a <= 0)
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
  kt({ type: "camera-pan", execute: Bp, validate: jp });
}
c(Up, "registerCameraPanTween");
function Vp(e) {
  if ((Array.isArray(e.uuid) ? e.uuid : [e.uuid]).some((i) => !i || typeof i != "string"))
    throw new Error("tile-tint tween: 'uuid' is required (string or array of Tile document UUIDs).");
  if (e.toColor == null || typeof e.toColor != "string")
    throw new Error("tile-tint tween: 'toColor' (CSS color string) is required.");
  if (!foundry.utils.Color.fromString(e.toColor).valid)
    throw new Error(`tile-tint tween: invalid target color "${e.toColor}".`);
  if (e.mode && !Bi().includes(e.mode))
    throw new Error(
      `tile-tint tween: unknown mode "${e.mode}". Available: ${Bi().join(", ")}`
    );
}
c(Vp, "validate$1");
async function zp(e, t = {}) {
  const { CanvasAnimation: n } = foundry.canvas.animation, { Color: i } = foundry.utils, { uuid: r, toColor: o, mode: a = "oklch" } = e, s = Array.isArray(r) ? r : [r];
  if (s.length === 0)
    return console.warn("tile-tint tween: empty uuid array, nothing to animate."), !0;
  const {
    durationMS: l = 2e3,
    easing: u = "easeInOutCosine",
    commit: d = !0,
    startEpochMS: m = null,
    signal: g = null
  } = t, y = pi(u), h = uf(a), p = i.fromString(o);
  if (!p.valid) throw new Error(`tile-tint tween: invalid target color "${o}".`);
  async function w(v) {
    var H, B;
    if (g != null && g.aborted) return !1;
    const S = await fromUuid(v);
    if (!S) return !1;
    const I = S.object;
    if (!I) return !1;
    const O = ((B = (H = S._source) == null ? void 0 : H.texture) == null ? void 0 : B.tint) ?? "#ffffff", k = i.fromString(O);
    k.valid || console.warn(`tile-tint tween: source tint invalid on ${v}, using white.`);
    const M = k.valid ? k : i.fromString("#ffffff"), x = { t: 0 }, R = `tile-tint-tween:${v}`;
    n.terminateAnimation(R), g && g.addEventListener("abort", () => {
      n.terminateAnimation(R);
    }, { once: !0 });
    const F = typeof m == "number" ? Math.max(0, Math.min(l, Date.now() - m)) : 0, D = /* @__PURE__ */ c((W) => {
      const q = h(M, p, W);
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
      if (g != null && g.aborted) return !1;
      S.updateSource({ texture: { tint: p.toHTML() } }), I.refresh();
    }
    if (d && _ !== !1 && S.canUserModify(game.user, "update")) {
      if (g != null && g.aborted) return !1;
      S.updateSource({ texture: { tint: M.toHTML() } }), await S.update({ "texture.tint": p.toHTML() });
    }
    return _ !== !1;
  }
  return c(w, "animateOne"), (await Promise.all(s.map(w))).every(Boolean);
}
c(zp, "execute$1");
function Gp() {
  kt({ type: "tile-tint", execute: zp, validate: Vp });
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
  const { CanvasAnimation: n } = foundry.canvas.animation, { uuid: i, toScale: r, baseWidth: o, baseHeight: a, centerX: s, centerY: l } = e, u = Array.isArray(i) ? i : [i];
  if (u.length === 0) return !0;
  const {
    durationMS: d = 2e3,
    easing: m = "easeInOutCosine",
    commit: g = !0,
    startEpochMS: y = null,
    signal: h = null
  } = t, p = pi(m), w = o * r, b = a * r, v = s - w / 2, S = l - b / 2;
  async function I(k) {
    if (h != null && h.aborted) return !1;
    const M = await fromUuid(k);
    if (!M) return !1;
    const x = M.object;
    if (!x) return !1;
    const R = M._source.width, F = M._source.height, D = M._source.x, _ = M._source.y, H = `tile-scale-tween:${k}`;
    n.terminateAnimation(H), h && h.addEventListener("abort", () => {
      n.terminateAnimation(H);
    }, { once: !0 });
    const B = typeof y == "number" ? Math.max(0, Math.min(d, Date.now() - y)) : 0, W = /* @__PURE__ */ c((J) => {
      const oe = R + (w - R) * J, X = F + (b - F) * J, te = D + (v - D) * J, jt = _ + (S - _) * J;
      M.updateSource({ width: oe, height: X, x: te, y: jt }), x.refresh();
    }, "applyFrame"), q = { t: 0 };
    B > 0 && (q.t = B / d, W(q.t));
    const U = await n.animate(
      [{ parent: q, attribute: "t", to: 1 }],
      {
        name: H,
        duration: d,
        easing: p,
        time: B,
        ontick: /* @__PURE__ */ c(() => W(q.t), "ontick")
      }
    );
    if (U !== !1) {
      if (h != null && h.aborted) return !1;
      M.updateSource({ width: w, height: b, x: v, y: S }), x.refresh();
    }
    if (g && U !== !1 && M.canUserModify(game.user, "update")) {
      if (h != null && h.aborted) return !1;
      M.updateSource({ width: R, height: F, x: D, y: _ }), await M.update({ width: w, height: b, x: v, y: S });
    }
    return U !== !1;
  }
  return c(I, "animateOne"), (await Promise.all(u.map(I))).every(Boolean);
}
c(Kp, "execute");
function Jp() {
  kt({ type: "tile-scale", execute: Kp, validate: Wp });
}
c(Jp, "registerTileScaleTween");
async function Yp(e, t, n = {}) {
  if (!game.user.isGM)
    return ui.notifications.warn("Only the GM can dispatch tweens."), !1;
  const i = hi(e);
  if (!i)
    throw new Error(`Unknown tween type: "${e}". Registered types: ${hl().join(", ")}`);
  i.validate(t);
  const { durationMS: r = 2e3, easing: o = "easeInOutCosine", commit: a = !0 } = n, s = Date.now();
  return To(sf, {
    type: e,
    params: t,
    durationMS: r,
    easing: o,
    startEpochMS: s,
    commit: !1
  }), i.execute(t, { durationMS: r, easing: o, commit: a, startEpochMS: s });
}
c(Yp, "dispatchTween");
function Qp(e) {
  const { type: t, params: n, durationMS: i, easing: r, startEpochMS: o, commit: a } = e ?? {}, s = hi(t);
  if (!s) {
    console.warn(`[${T}] Received unknown tween type over socket: "${t}"`);
    return;
  }
  s.execute(n, {
    durationMS: i,
    easing: r,
    commit: a ?? !1,
    startEpochMS: o
  });
}
c(Qp, "handleTweenSocketMessage");
Ap();
Np();
_p();
Fp();
qp();
Up();
Gp();
Jp();
kt({ type: "token-prop", execute: Va, validate: Ua });
kt({ type: "drawing-prop", execute: Va, validate: Ua });
kt({ type: "sound-prop", execute: Va, validate: Ua });
lc(sf, Qp);
lc(lf, Xp);
lc(gl, Zp);
function Xp(e) {
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
c(Xp, "handleSequenceSocketMessage");
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
      types: hl,
      Timeline: Wo,
      ErrorPolicy: Se,
      compileSequence: uc,
      cancelTimeline: ff,
      getTimeline: Pp
    }, console.log(`[${T}] Tween API registered. Types: ${hl().join(", ")}`);
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
function Ga(e) {
  if (!e) return null;
  if (e.documentName || e._source !== void 0) {
    const t = e.object;
    return t ? { placeable: t, doc: e } : null;
  }
  return e.document ? { placeable: e, doc: e.document } : null;
}
c(Ga, "normalizePlaceable");
function Ef() {
  var e;
  return window.Tagger ?? ((e = game.modules.get("tagger")) == null ? void 0 : e.api) ?? null;
}
c(Ef, "getTaggerAPI");
function Wa(e, t) {
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
      return oy(i.value, n);
    case "tags-any":
      return ru(i.value, n, !0);
    case "tags-all":
      return ru(i.value, n, !1);
    case "uuid":
      return ay(i.value);
    default:
      return null;
  }
}
c(Wa, "resolveSelector");
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
  const o = n ? r : [r[0]], a = [];
  for (const s of o) {
    const l = Ga(s);
    l && a.push(l);
  }
  return a.length === 0 ? null : {
    kind: n ? "multi-placeable" : "placeable",
    documents: a.map((s) => s.doc),
    placeables: a
  };
}
c(iu, "resolveTag");
function oy(e, t) {
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
      const o = Ga(r);
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
c(oy, "resolveById");
function ru(e, t, n) {
  const i = Ef();
  if (!i)
    return console.warn(`[${T}] Picker: Tagger not available, cannot resolve multi-tag.`), null;
  const r = i.getByTag(e, {
    sceneId: t.id,
    matchAny: n
  });
  if (!(r != null && r.length)) return null;
  const o = [];
  for (const a of r) {
    const s = Ga(a);
    s && o.push(s);
  }
  return o.length === 0 ? null : {
    kind: o.length === 1 ? "placeable" : "multi-placeable",
    documents: o.map((a) => a.doc),
    placeables: o
  };
}
c(ru, "resolveMultiTag");
function ay(e) {
  const t = fromUuidSync(e);
  if (!t) return null;
  const n = Ga(t);
  return n ? {
    kind: "placeable",
    documents: [n.doc],
    placeables: [n]
  } : null;
}
c(ay, "resolveUUID");
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
function Ko(e) {
  var r;
  const t = /* @__PURE__ */ new Set();
  if (e.segments)
    for (const o of Object.values(e.segments)) {
      if (o.setup) for (const a of Object.keys(o.setup)) t.add(a);
      if (o.landing) for (const a of Object.keys(o.landing)) t.add(a);
      o.timeline && Ll(o.timeline, t), (r = o.gate) != null && r.target && t.add(o.gate.target);
    }
  else {
    if (e.setup) for (const o of Object.keys(e.setup)) t.add(o);
    if (e.landing) for (const o of Object.keys(e.landing)) t.add(o);
    e.timeline && Ll(e.timeline, t);
  }
  const n = /* @__PURE__ */ new Map(), i = [];
  for (const o of t) {
    const a = Wa(o), s = sy(a);
    s ? n.set(o, s) : i.push(o);
  }
  return i.length && console.warn(`[${T}] Cinematic: ${i.length} unresolved target(s): ${i.join(", ")}`), { targets: n, unresolved: i };
}
c(Ko, "resolveAllTargets");
function ly(e, t) {
  if (!e) return {};
  const n = {};
  for (const [i, r] of Object.entries(e)) {
    const o = t.get(i);
    if (o)
      if (o.kind === "particles") {
        if (o.target.destroyed) continue;
        const a = {};
        for (const s of Object.keys(r))
          a[s] = o.target[s];
        n[i] = a;
      } else if (o.kind === "multi-placeable") {
        const a = o.placeables[0];
        if (!(a != null && a.doc)) continue;
        const s = {};
        for (const l of Object.keys(r))
          s[l] = foundry.utils.getProperty(a.doc._source, l);
        n[i] = s;
      } else {
        if (!o.doc) continue;
        const a = {};
        for (const s of Object.keys(r))
          a[s] = foundry.utils.getProperty(o.doc._source, s);
        n[i] = a;
      }
  }
  return n;
}
c(ly, "captureSnapshot");
function cy(e) {
  const t = {};
  function n(i) {
    if (i)
      for (const [r, o] of Object.entries(i))
        t[r] || (t[r] = {}), Object.assign(t[r], o);
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
        for (const o of r.parallel.branches)
          Tl(o, t, n);
        continue;
      }
      if (n(r.before), n(r.after), r.tweens)
        for (const o of r.tweens)
          o.target && o.attribute && (t[o.target] || (t[o.target] = {}), t[o.target][o.attribute] = "__snapshot__");
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
const ou = {
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
  for (const [r, o] of Object.entries(e))
    t.has(r) ? i[r] = o : console.warn(`[${T}] Cinematic: blocked property "${r}" on ${n}.`);
  return i;
}
c(fs, "filterOverrides");
function Ve(e, t) {
  var i, r;
  if (!e) return;
  const n = [];
  for (const [o, a] of Object.entries(e)) {
    const s = t.get(o);
    if (s)
      if (s.kind === "particles") {
        if (s.target.destroyed) continue;
        const l = fs(a, uy, "$particles");
        for (const [u, d] of Object.entries(l))
          s.target[u] = d;
      } else if (s.kind === "multi-placeable")
        for (const { placeable: l, doc: u } of s.placeables) {
          if (!(u != null && u.parent) || !(l != null && l.scene)) continue;
          const d = u.documentName, m = ou[d];
          if (!m) {
            console.warn(`[${T}] Cinematic: no allowlist for document type "${d}" on "${o}", skipping.`);
            continue;
          }
          const g = fs(a, m, `${d} "${o}"`);
          u.updateSource(g), n.push(l);
        }
      else {
        if (!((i = s.doc) != null && i.parent) || !((r = s.placeable) != null && r.scene)) continue;
        const l = s.doc.documentName, u = ou[l];
        if (!u) {
          console.warn(`[${T}] Cinematic: no allowlist for document type "${l}" on "${o}", skipping.`);
          continue;
        }
        const d = fs(a, u, `${l} "${o}"`);
        s.doc.updateSource(d), n.push(s.placeable);
      }
  }
  for (const o of n)
    o.refresh();
}
c(Ve, "applyState");
function Ii(e, t) {
  var n;
  if (e)
    for (const i of Object.keys(e)) {
      const r = t.get(i);
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
c(Ii, "refreshPerceptionIfNeeded");
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
  const o = {}, a = {}, s = dy[n];
  if (i === "$particles")
    o.target = "$particles";
  else if (i) {
    const l = t.get(i);
    if (!l) return null;
    l.kind === "multi-placeable" ? o.uuid = l.placeables.map((u) => u.doc.uuid) : o.uuid = l.doc.uuid;
  }
  for (const [l, u] of Object.entries(r))
    my.has(l) || (fy.has(l) ? a[l] = u : (s != null && s.has(l), o[l] = u));
  return { type: n, params: o, opts: a };
}
c(Sf, "compileTween");
const wr = /* @__PURE__ */ new Map();
let gy = 0;
async function hy(e) {
  var u, d, m, g, y;
  const { id: t, src: n, volume: i = 0.8, loop: r = !1, fadeIn: o } = e;
  if (!n) {
    console.warn(`[${T}] Cinematic sound: missing 'src', skipping.`);
    return;
  }
  const a = t || `__auto_${++gy}`, s = {
    src: n,
    autoplay: !0,
    loop: r,
    volume: i
  };
  let l = null;
  try {
    typeof ((d = (u = foundry == null ? void 0 : foundry.audio) == null ? void 0 : u.AudioHelper) == null ? void 0 : d.play) == "function" ? l = await foundry.audio.AudioHelper.play(s, !1) : typeof ((g = (m = game == null ? void 0 : game.audio) == null ? void 0 : m.constructor) == null ? void 0 : g.play) == "function" ? l = await game.audio.constructor.play(s, !1) : typeof ((y = game == null ? void 0 : game.audio) == null ? void 0 : y.play) == "function" && (l = await game.audio.play(s, !1));
  } catch (h) {
    console.error(`[${T}] Cinematic sound: failed to play "${n}":`, h);
    return;
  }
  if (!l) {
    console.warn(`[${T}] Cinematic sound: audio helper unavailable for "${n}".`);
    return;
  }
  o && o > 0 && l.fade && l.fade(i, { duration: o, from: 0 }), wr.set(a, { sound: l, config: e }), console.log(`[${T}] Cinematic sound: playing "${n}" as "${a}" (loop=${r}, vol=${i})`);
}
c(hy, "playLocalSound");
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
      var o, a;
      return (a = (o = t.sound).stop) == null ? void 0 : a.call(o);
    }) : (r = (i = t.sound).stop) == null || r.call(i);
  } catch (o) {
    console.warn(`[${T}] Cinematic sound: error stopping "${e}":`, o);
  }
  wr.delete(e);
}
c(ms, "stopCinematicSound");
function au() {
  var e, t;
  for (const [n, i] of wr)
    try {
      (t = (e = i.sound).stop) == null || t.call(e);
    } catch (r) {
      console.warn(`[${T}] Cinematic sound: error stopping "${n}" during cleanup:`, r);
    }
  wr.clear();
}
c(au, "stopAllCinematicSounds");
function py(e, t, n, i = {}) {
  const { skipToStep: r, onStepComplete: o, timelineName: a } = i, s = new n().name(a ?? `cinematic-${canvas.scene.id}`);
  return s.beforeAll(() => {
    var l;
    try {
      Ve(e.setup, t), canvas.perception.update({ refreshLighting: !0, refreshVision: !0 });
    } catch (u) {
      throw console.error(`[${T}] Cinematic: error in beforeAll (setup state) on scene ${(l = canvas.scene) == null ? void 0 : l.id}:`, u), u;
    }
  }), Tf(e.timeline, s, t, { skipToStep: r, onStepComplete: o }), { tl: s };
}
c(py, "buildTimeline");
function Cf(e, t) {
  var n;
  if (e)
    for (const i of e)
      for (const r of i) {
        if (r.before)
          try {
            Ve(r.before, t), Ii(r.before, t);
          } catch (o) {
            console.warn(`[${T}] Cinematic: error in skipped parallel before:`, o);
          }
        if (r.after)
          try {
            Ve(r.after, t), Ii(r.after, t);
          } catch (o) {
            console.warn(`[${T}] Cinematic: error in skipped parallel after:`, o);
          }
        (n = r.parallel) != null && n.branches && Cf(r.parallel.branches, t);
      }
}
c(Cf, "applyParallelStatesForSkip");
function Tf(e, t, n, i = {}) {
  const { skipToStep: r, onStepComplete: o } = i;
  let a = -1;
  for (const s of e) {
    if (s.sound != null) {
      if (r != null && a < r) continue;
      const m = s.sound, { duration: g, loop: y, fireAndForget: h } = m, p = t.step();
      if (p.before(() => {
        hy(m);
      }), g && g > 0)
        if (h) {
          if (y && m.id) {
            const w = m.id, b = g;
            p.before(() => {
              setTimeout(() => ms(w), b);
            });
          }
        } else
          t.delay(g), y && t.step().before(() => {
            ms(m.id);
          });
      continue;
    }
    if (s.stopSound != null) {
      if (r != null && a < r) continue;
      const m = s.stopSound;
      t.step().before(() => {
        ms(m);
      });
      continue;
    }
    if (s.delay != null) {
      if (r != null && a < r) continue;
      t.delay(s.delay);
      continue;
    }
    if (s.await != null) {
      if (r != null && a < r) continue;
      t.await(s.await);
      continue;
    }
    if (s.emit != null) {
      if (r != null && a < r) continue;
      t.emit(s.emit);
      continue;
    }
    if (s.parallel) {
      if (r != null && a < r) {
        Cf(s.parallel.branches, n);
        continue;
      }
      const m = s.parallel, g = m.branches.map((y) => (h) => Tf(y, h, n));
      t.parallel(g, {
        join: m.join ?? "all",
        overflow: m.overflow ?? "detach"
      });
      continue;
    }
    if (!s.tweens || !Array.isArray(s.tweens)) {
      console.warn(`[${T}] Cinematic: timeline entry has no tweens array, skipping.`);
      continue;
    }
    if (a++, r != null && a < r) {
      if (s.before)
        try {
          Ve(s.before, n), Ii(s.before, n);
        } catch (m) {
          console.warn(`[${T}] Cinematic: error applying skipped step.before:`, m);
        }
      if (s.after)
        try {
          Ve(s.after, n), Ii(s.after, n);
        } catch (m) {
          console.warn(`[${T}] Cinematic: error applying skipped step.after:`, m);
        }
      continue;
    }
    const l = a, u = t.step();
    s.before && u.before(() => {
      var m;
      try {
        Ve(s.before, n), Ii(s.before, n);
      } catch (g) {
        throw console.error(`[${T}] Cinematic: error in step.before callback on scene ${(m = canvas.scene) == null ? void 0 : m.id}:`, g), g;
      }
    });
    const d = s.duration ?? 500;
    for (const m of s.tweens) {
      const g = Sf(m, n);
      g && u.add(g.type, g.params, { ...g.opts, durationMS: d });
    }
    u.after(() => {
      var m;
      try {
        s.after && (Ve(s.after, n), Ii(s.after, n)), o == null || o(l);
      } catch (g) {
        throw console.error(`[${T}] Cinematic: error in step.after callback on scene ${(m = canvas.scene) == null ? void 0 : m.id}:`, g), g;
      }
    });
  }
}
c(Tf, "compileCinematicEntries");
function Oi(e, t, n) {
  if (e != null) {
    if (typeof e != "object" || Array.isArray(e)) {
      n.push({ path: t, level: "error", message: `Expected object, got ${Array.isArray(e) ? "array" : typeof e}` });
      return;
    }
    for (const [i, r] of Object.entries(e))
      (typeof r != "object" || r === null || Array.isArray(r)) && n.push({ path: `${t}["${i}"]`, level: "error", message: `Expected property overrides object, got ${Array.isArray(r) ? "array" : typeof r}` });
  }
}
c(Oi, "validateStateMap");
function Il(e, t, n, i) {
  var r;
  for (let o = 0; o < e.length; o++) {
    const a = e[o], s = `${t}[${o}]`;
    if (!(a.delay != null || a.await != null || a.emit != null) && !(a.transitionTo != null || a.sound != null || a.stopSound != null)) {
      if ((r = a.parallel) != null && r.branches) {
        for (let l = 0; l < a.parallel.branches.length; l++)
          Il(a.parallel.branches[l], `${s}.parallel.branches[${l}]`, n, i);
        continue;
      }
      if (Oi(a.before, `${s}.before`, i), Oi(a.after, `${s}.after`, i), a.tweens)
        for (let l = 0; l < a.tweens.length; l++) {
          const u = a.tweens[l], d = `${s}.tweens[${l}]`;
          if (!u.type) {
            i.push({ path: d, level: "error", message: "Missing 'type' field" });
            continue;
          }
          const m = hi(u.type);
          if (!m) {
            i.push({ path: d, level: "error", message: `Unknown tween type: "${u.type}"` });
            continue;
          }
          if (n)
            try {
              const g = Sf(u, n);
              g ? m.validate(g.params) : u.target && i.push({ path: d, level: "warn", message: `Target "${u.target}" could not be resolved for compilation` });
            } catch (g) {
              i.push({ path: d, level: "error", message: g.message });
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
    let o = e.entry;
    for (; o && typeof o == "string"; ) {
      if (r.has(o)) {
        n.push({ path: `segments.${o}.next`, level: "error", message: `Cycle detected in segment graph at "${o}"` });
        break;
      }
      r.add(o), o = (i = e.segments[o]) == null ? void 0 : i.next;
    }
    for (const [a, s] of Object.entries(e.segments)) {
      const l = `segments.${a}`;
      Oi(s.setup, `${l}.setup`, n), Oi(s.landing, `${l}.landing`, n), s.timeline && Array.isArray(s.timeline) && Il(s.timeline, `${l}.timeline`, t, n), s.next && typeof s.next == "string" && !e.segments[s.next] && n.push({ path: `${l}.next`, level: "error", message: `Next segment "${s.next}" not found` });
    }
  } else
    Oi(e.setup, "setup", n), Oi(e.landing, "landing", n), e.timeline && Array.isArray(e.timeline) && Il(e.timeline, "timeline", t, n);
  return n;
}
c(yy, "validateCinematicDeep");
const gs = 5, su = /* @__PURE__ */ new Set(["click", "tile-click", "keypress"]);
var se, fe, Re, Le, ct, ar, Ol, Lf, K, ke, Io, Ee, gt;
const ae = class ae {
  constructor(t = null, { loadedHash: n = null, cinematicName: i = "default", segmentName: r = null } = {}) {
    A(this, K);
    A(this, se);
    A(this, fe);
    A(this, Re);
    A(this, Le);
    var a;
    L(this, se, t ?? ae.empty()), L(this, fe, i), L(this, Le, n);
    const o = (a = f(this, se).cinematics) == null ? void 0 : a[f(this, fe)];
    L(this, Re, r ?? (o == null ? void 0 : o.entry) ?? "main");
  }
  static empty() {
    return {
      version: gs,
      cinematics: {
        default: ae.emptyCinematic()
      }
    };
  }
  static emptyCinematic() {
    return {
      trigger: "canvasReady",
      tracking: !0,
      entry: "main",
      segments: {
        main: ae.emptySegment()
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
    var w;
    const { trigger: n, tracking: i, synchronized: r, setup: o, landing: a, timeline: s = [] } = t;
    if (!s.some(
      (b) => {
        var v;
        return b.await != null && su.has(((v = b.await) == null ? void 0 : v.event) ?? "click");
      }
    )) {
      const b = s.filter((I) => I.transitionTo == null), v = s.find((I) => I.transitionTo != null), S = { timeline: b };
      if (o && Object.keys(o).length && (S.setup = o), a && Object.keys(a).length && (S.landing = a), v) {
        const I = v.transitionTo;
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
    let d = [], m = 1, g = null;
    const y = [];
    function h() {
      const b = `segment-${m++}`, v = { timeline: [...d] };
      return g && (v.gate = g), u[b] = v, y.push(b), d = [], g = null, b;
    }
    c(h, "flushSegment");
    for (const b of s)
      if (b.transitionTo == null) {
        if (b.await != null && su.has(((w = b.await) == null ? void 0 : w.event) ?? "click")) {
          h(), g = { ...b.await }, delete g.event, g = { event: b.await.event ?? "click", ...g };
          continue;
        }
        d.push(b);
      }
    (d.length > 0 || g) && h();
    for (let b = 0; b < y.length - 1; b++)
      u[y[b]].next = y[b + 1];
    y.length > 0 && (o && Object.keys(o).length && (u[y[0]].setup = o), a && Object.keys(a).length && (u[y[y.length - 1]].landing = a));
    const p = s.find((b) => b.transitionTo != null);
    if (p && y.length > 0) {
      const b = p.transitionTo, v = u[y[y.length - 1]];
      b.scene && b.cinematic && (v.next = { segment: b.cinematic, scene: b.scene });
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
    for (const o of Object.values(n.segments))
      (i = o.timeline) != null && i.length && (o.timeline = C(r = ae, ct, Ol).call(r, o.timeline));
    return n;
  }
  static fromScene(t, n = "default") {
    var a;
    const i = t == null ? void 0 : t.getFlag(T, "cinematic");
    let r = i ? foundry.utils.deepClone(i) : null;
    const o = i ? C(a = ae, ct, Lf).call(a, i) : null;
    if (r && (r.version ?? 1) < 3) {
      const { version: s, ...l } = r;
      r = { version: 3, cinematics: { default: l } };
    }
    if (r && r.version === 3) {
      for (const [s, l] of Object.entries(r.cinematics ?? {}))
        r.cinematics[s] = ae.migrateV3toV4(l);
      r.version = 4;
    }
    if (r && r.version === 4) {
      for (const [s, l] of Object.entries(r.cinematics ?? {}))
        r.cinematics[s] = ae.migrateV4toV5(l);
      r.version = gs;
    }
    return new ae(r, { loadedHash: o, cinematicName: n });
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
    return new ae(foundry.utils.deepClone(f(this, se)), {
      loadedHash: f(this, Le),
      cinematicName: t,
      segmentName: n.entry ?? "main"
    });
  }
  addCinematic(t) {
    if (!t || f(this, se).cinematics[t]) return this;
    const n = foundry.utils.deepClone(f(this, se));
    return n.cinematics[t] = ae.emptyCinematic(), new ae(n, {
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
    const r = f(this, fe) === t ? Object.keys(i.cinematics)[0] : f(this, fe), o = i.cinematics[r];
    return new ae(i, {
      loadedHash: f(this, Le),
      cinematicName: r,
      segmentName: (o == null ? void 0 : o.entry) ?? "main"
    });
  }
  renameCinematic(t, n) {
    if (!t || !n || t === n) return this;
    if (!f(this, se).cinematics[t]) return this;
    if (f(this, se).cinematics[n]) return this;
    const i = foundry.utils.deepClone(f(this, se)), r = {};
    for (const [a, s] of Object.entries(i.cinematics))
      r[a === t ? n : a] = s;
    i.cinematics = r;
    const o = f(this, fe) === t ? n : f(this, fe);
    return new ae(i, {
      loadedHash: f(this, Le),
      cinematicName: o,
      segmentName: f(this, Re)
    });
  }
  // ── Cinematic-level mutations ─────────────────────────────────────────
  setTrigger(t) {
    return C(this, K, Io).call(this, { trigger: t });
  }
  setTracking(t) {
    return C(this, K, Io).call(this, { tracking: t });
  }
  setSynchronized(t) {
    return C(this, K, Io).call(this, { synchronized: t });
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
    return (n = f(this, K, ke).segments) != null && n[t] ? new ae(foundry.utils.deepClone(f(this, se)), {
      loadedHash: f(this, Le),
      cinematicName: f(this, fe),
      segmentName: t
    }) : this;
  }
  addSegment(t, n = null) {
    var o;
    if (!t || (o = f(this, K, ke).segments) != null && o[t]) return this;
    const i = foundry.utils.deepClone(f(this, se)), r = i.cinematics[f(this, fe)];
    if (r.segments[t] = ae.emptySegment(), n && r.segments[n]) {
      const a = r.segments[n].next;
      r.segments[n].next = t, a && (r.segments[t].next = a);
    }
    return new ae(i, {
      loadedHash: f(this, Le),
      cinematicName: f(this, fe),
      segmentName: t
    });
  }
  removeSegment(t) {
    var s, l;
    if (Object.keys(f(this, K, ke).segments ?? {}).length <= 1) return this;
    if (!((s = f(this, K, ke).segments) != null && s[t])) return this;
    const i = foundry.utils.deepClone(f(this, se)), r = i.cinematics[f(this, fe)], o = r.segments[t].next;
    for (const [, u] of Object.entries(r.segments))
      (u.next === t || typeof u.next == "object" && ((l = u.next) == null ? void 0 : l.segment) === t) && (u.next = o ?? void 0, u.next || delete u.next);
    delete r.segments[t], r.entry === t && (r.entry = Object.keys(r.segments)[0]);
    const a = f(this, Re) === t ? r.entry : f(this, Re);
    return new ae(i, {
      loadedHash: f(this, Le),
      cinematicName: f(this, fe),
      segmentName: a
    });
  }
  renameSegment(t, n) {
    var s, l, u;
    if (!t || !n || t === n) return this;
    if (!((s = f(this, K, ke).segments) != null && s[t])) return this;
    if ((l = f(this, K, ke).segments) != null && l[n]) return this;
    const i = foundry.utils.deepClone(f(this, se)), r = i.cinematics[f(this, fe)], o = {};
    for (const [d, m] of Object.entries(r.segments))
      o[d === t ? n : d] = m;
    r.segments = o;
    for (const [, d] of Object.entries(r.segments))
      d.next === t ? d.next = n : typeof d.next == "object" && ((u = d.next) == null ? void 0 : u.segment) === t && (d.next.segment = n);
    r.entry === t && (r.entry = n);
    const a = f(this, Re) === t ? n : f(this, Re);
    return new ae(i, {
      loadedHash: f(this, Le),
      cinematicName: f(this, fe),
      segmentName: a
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
    const i = this.activeSegment.timeline.map((r, o) => o !== t ? r : { ...foundry.utils.deepClone(r), ...n });
    return C(this, K, Ee).call(this, { timeline: i });
  }
  // ── Tween mutations ──────────────────────────────────────────────────
  addTween(t, n = null) {
    const i = { type: "tile-prop", target: "", attribute: "alpha", value: 1 };
    return C(this, K, gt).call(this, t, (r) => {
      const o = [...r.tweens ?? [], n ?? i];
      return { ...r, tweens: o };
    });
  }
  updateTween(t, n, i) {
    return C(this, K, gt).call(this, t, (r) => {
      const o = (r.tweens ?? []).map((a, s) => s !== n ? a : { ...a, ...i });
      return { ...r, tweens: o };
    });
  }
  removeTween(t, n) {
    return C(this, K, gt).call(this, t, (i) => {
      const r = (i.tweens ?? []).filter((o, a) => a !== n);
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
      const r = i.parallel.branches.filter((o, a) => a !== n);
      return r.length < 1 ? i : { ...i, parallel: { ...i.parallel, branches: r } };
    });
  }
  addBranchEntry(t, n, i = null) {
    const r = { duration: 1e3, tweens: [] };
    return C(this, K, gt).call(this, t, (o) => {
      if (!o.parallel) return o;
      const a = o.parallel.branches.map((s, l) => l !== n ? s : [...s, i ?? r]);
      return { ...o, parallel: { ...o.parallel, branches: a } };
    });
  }
  removeBranchEntry(t, n, i) {
    return C(this, K, gt).call(this, t, (r) => {
      if (!r.parallel) return r;
      const o = r.parallel.branches.map((a, s) => s !== n ? a : a.filter((l, u) => u !== i));
      return { ...r, parallel: { ...r.parallel, branches: o } };
    });
  }
  updateBranchEntry(t, n, i, r) {
    return C(this, K, gt).call(this, t, (o) => {
      if (!o.parallel) return o;
      const a = o.parallel.branches.map((s, l) => l !== n ? s : s.map((u, d) => d !== i ? u : { ...foundry.utils.deepClone(u), ...r }));
      return { ...o, parallel: { ...o.parallel, branches: a } };
    });
  }
  moveBranchEntry(t, n, i, r) {
    return i === r ? this : C(this, K, gt).call(this, t, (o) => {
      if (!o.parallel) return o;
      const a = o.parallel.branches.map((s, l) => {
        if (l !== n) return s;
        const u = [...s];
        if (i < 0 || i >= u.length || r < 0 || r >= u.length) return s;
        const [d] = u.splice(i, 1);
        return u.splice(r, 0, d), u;
      });
      return { ...o, parallel: { ...o.parallel, branches: a } };
    });
  }
  // ── Persistence ──────────────────────────────────────────────────────
  async save(t) {
    const n = { ...foundry.utils.deepClone(f(this, se)), version: gs };
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
se = new WeakMap(), fe = new WeakMap(), Re = new WeakMap(), Le = new WeakMap(), ct = new WeakSet(), ar = /* @__PURE__ */ c(function(t) {
  const { duration: n, detach: i, ...r } = t;
  return r;
}, "#stripTween"), Ol = /* @__PURE__ */ c(function(t) {
  var i, r;
  const n = [];
  for (const o of t) {
    if (o.delay != null || o.await != null || o.emit != null || o.transitionTo != null || o.sound != null || o.stopSound != null) {
      n.push(o);
      continue;
    }
    if ((i = o.parallel) != null && i.branches) {
      const l = o.parallel.branches.map(
        (u) => {
          var d;
          return C(d = ae, ct, Ol).call(d, u);
        }
      );
      n.push({ ...o, parallel: { ...o.parallel, branches: l } });
      continue;
    }
    if (!((r = o.tweens) != null && r.length)) {
      n.push({ duration: 500, ...o });
      continue;
    }
    const a = [], s = [];
    for (const l of o.tweens)
      l.detach ? s.push(l) : a.push(l);
    if (s.length === 0) {
      const l = Math.max(500, ...o.tweens.map((m) => m.duration ?? 0)), { tweens: u, ...d } = o;
      n.push({
        ...d,
        duration: l,
        tweens: u.map(C(ae, ct, ar))
      });
    } else if (a.length === 0) {
      const l = Math.max(500, ...s.map((m) => m.duration ?? 0)), { tweens: u, ...d } = o;
      n.push({
        ...d,
        duration: l,
        tweens: s.map(C(ae, ct, ar))
      });
    } else {
      const l = Math.max(500, ...a.map((g) => g.duration ?? 0)), u = Math.max(500, ...s.map((g) => g.duration ?? 0)), { tweens: d, ...m } = o;
      n.push({
        parallel: {
          branches: [
            [{ ...m, duration: l, tweens: a.map(C(ae, ct, ar)) }],
            [{ duration: u, tweens: s.map(C(ae, ct, ar)) }]
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
Io = /* @__PURE__ */ c(function(t) {
  const n = foundry.utils.deepClone(f(this, se));
  return Object.assign(n.cinematics[f(this, fe)], t), new ae(n, {
    loadedHash: f(this, Le),
    cinematicName: f(this, fe),
    segmentName: f(this, Re)
  });
}, "#cloneActive"), /** Clone the full state with a patch to the active segment within the active cinematic. */
Ee = /* @__PURE__ */ c(function(t) {
  const n = foundry.utils.deepClone(f(this, se)), i = n.cinematics[f(this, fe)].segments[f(this, Re)];
  if (!i) return this;
  Object.assign(i, t);
  for (const [r, o] of Object.entries(i))
    o === void 0 && delete i[r];
  return new ae(n, {
    loadedHash: f(this, Le),
    cinematicName: f(this, fe),
    segmentName: f(this, Re)
  });
}, "#cloneActiveSegment"), /** Mutate a single timeline entry within the active segment. */
gt = /* @__PURE__ */ c(function(t, n) {
  const i = this.activeSegment;
  if (!i || t < 0 || t >= i.timeline.length) return this;
  const r = i.timeline.map((o, a) => a !== t ? o : n(foundry.utils.deepClone(o)));
  return C(this, K, Ee).call(this, { timeline: r });
}, "#mutateEntry"), A(ae, ct), c(ae, "CinematicState");
let Rt = ae;
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
const Tn = 40, dr = 24, Er = 50, du = 50, qn = 60, zn = 10, hs = 16, Of = 40, Af = 20, vy = 90, fu = 70, mu = 8;
function Ka(e) {
  return { stepDuration: Math.max(500, e.duration ?? 500), detachOverflow: 0 };
}
c(Ka, "computeStepDurations");
function wy(e) {
  var i;
  const t = ((i = e.parallel) == null ? void 0 : i.branches) ?? [];
  let n = 0;
  for (const r of t) {
    let o = 0;
    for (const a of r)
      a.delay != null ? o += a.delay : a.await != null || a.emit != null || (a.sound != null ? o += a.sound.fireAndForget ? 0 : a.sound.duration ?? 0 : a.stopSound != null || (o += Ka(a).stepDuration));
    n = Math.max(n, o);
  }
  return Math.max(500, n);
}
c(wy, "computeParallelDuration");
function fc(e) {
  return e.reduce((t, n) => n.delay != null ? t + n.delay : n.await != null || n.emit != null || n.transitionTo != null ? t : n.sound != null ? t + (n.sound.fireAndForget ? 0 : n.sound.duration ?? 0) : n.stopSound != null ? t : n.parallel != null ? t + wy(n) : t + Ka(n).stepDuration, 0);
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
  const o = [], a = [], s = [];
  let l = t;
  for (let m = 0; m < e.length; m++) {
    const g = e[m], y = `${i}.${m}`, h = r === y;
    if (g.delay != null) {
      const p = Math.max(Af, g.delay * n);
      o.push({ type: "delay", leftPx: l, widthPx: p, label: `${g.delay}ms`, entryPath: y, selected: h }), l += p;
    } else if (g.await != null) {
      const p = ((u = g.await) == null ? void 0 : u.event) ?? "click", w = p === "tile-click" ? "fa-hand-pointer" : p === "signal" ? "fa-bolt" : "fa-pause";
      o.push({ type: "await", leftPx: l, widthPx: hs, label: p, entryPath: y, selected: h, isGate: !0, gateIcon: w }), ((d = g.await) == null ? void 0 : d.event) === "signal" && s.push({ signal: g.await.signal, centerPx: l + hs / 2 }), l += hs;
    } else if (g.emit != null)
      o.push({ type: "emit", leftPx: l, widthPx: zn, label: "emit", entryPath: y, selected: h, isMarker: !0 }), a.push({ signal: g.emit, centerPx: l + zn / 2 });
    else if (g.sound != null) {
      const p = (g.sound.src || "").split("/").pop() || "Sound", w = g.sound.duration ?? 0;
      if (g.sound.fireAndForget ?? !1)
        o.push({ type: "sound", leftPx: l, widthPx: zn, label: p, entryPath: y, selected: h, isMarker: !0 });
      else {
        const v = w > 0 ? Math.max(qn, w * n) : qn, S = (g.sound.loop ?? !1) && w <= 0;
        o.push({ type: "sound", leftPx: l, widthPx: v, label: p, entryPath: y, selected: h, hasTrailingArrow: S }), l += v;
      }
    } else if (g.stopSound != null)
      o.push({ type: "stopSound", leftPx: l, widthPx: zn, label: "Stop", entryPath: y, selected: h, isMarker: !0 });
    else {
      const { stepDuration: p } = Ka(g), w = Math.max(Of, p * n), b = kf(g);
      o.push({ type: "step", leftPx: l, widthPx: w, label: b, entryPath: y, selected: h }), l += w;
    }
  }
  return { blocks: o, width: l - t, emits: a, awaits: s };
}
c(Sy, "computeBranchLane");
function gu(e) {
  return dr + e * Tn;
}
c(gu, "laneIndexToY");
function Cy(e, t) {
  const n = [];
  for (const i of e.emits)
    for (const r of e.awaits) {
      if (i.signal !== r.signal) continue;
      const o = i.centerPx, a = gu(i.laneIndex) + Tn / 2, s = r.centerPx, l = gu(r.laneIndex) + Tn / 2, u = l - a, d = (o + s) / 2, m = a + Math.sign(u || 1) * Math.min(40, Math.abs(u) * 0.5 + 20), g = l - Math.sign(u || 1) * Math.min(40, Math.abs(u) * 0.5 + 20);
      n.push({
        pathD: `M ${o} ${a} C ${d} ${m}, ${d} ${g}, ${s} ${l}`,
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
  for (let o = 0; o <= e + r; o += r) {
    const a = o >= 1e3 ? `${(o / 1e3).toFixed(o % 1e3 === 0 ? 0 : 1)}s` : `${o}ms`;
    n.push({ px: Er + o * t, label: a });
  }
  return n;
}
c(Ty, "computeTimeMarkers");
function Ly(e) {
  const t = [];
  for (let n = 0; n < e.length - 1; n++) {
    const i = e[n], r = e[n + 1], o = i.leftPx + i.widthPx + (r.leftPx - (i.leftPx + i.widthPx)) / 2, a = dr + Tn / 2;
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
    t.push({ leftPx: o, topPx: a, insertIndex: s, lane: "main", isEnd: l });
  }
  return t;
}
c(Ly, "computeInsertionPoints");
function Iy(e, { selectedPath: t, windowWidth: n }) {
  const i = fc(e), r = n - 70 - 100, o = Ey(i, r), a = [], s = [], l = { emits: [], awaits: [] }, u = [];
  a.push({
    type: "setup",
    leftPx: 0,
    widthPx: Er,
    label: "Setup",
    entryPath: "setup",
    selected: t === "setup"
  });
  let d = Er;
  for (let v = 0; v < e.length; v++) {
    const S = e[v], I = `timeline.${v}`, O = t === I;
    if (S.delay != null) {
      const k = Math.max(Af, S.delay * o);
      a.push({
        type: "delay",
        leftPx: d,
        widthPx: k,
        label: `${S.delay}ms`,
        entryPath: I,
        selected: O
      }), d += k;
    } else if (S.emit != null)
      a.push({
        type: "emit",
        leftPx: d,
        widthPx: zn,
        label: "Emit",
        entryPath: I,
        selected: O,
        isMarker: !0
      }), l.emits.push({
        signal: S.emit,
        centerPx: d + zn / 2,
        laneIndex: 0
      });
    else if (S.sound != null) {
      const k = (S.sound.src || "").split("/").pop() || "Sound", M = S.sound.duration ?? 0;
      if (S.sound.fireAndForget ?? !1) {
        const R = M > 0 ? Math.max(qn, M * o) : qn, F = (S.sound.loop ?? !1) && M <= 0, D = {
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
        const R = M > 0 ? Math.max(qn, M * o) : qn, F = (S.sound.loop ?? !1) && M <= 0;
        a.push({
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
      a.push({
        type: "stopSound",
        leftPx: d,
        widthPx: zn,
        label: "Stop",
        entryPath: I,
        selected: O,
        isMarker: !0
      });
    else if (S.parallel != null) {
      const k = S.parallel.branches ?? [], M = d, x = [];
      let R = 0;
      for (let D = 0; D < k.length; D++) {
        const _ = `timeline.${v}.parallel.branches.${D}`, { blocks: H, width: B, emits: W, awaits: q } = Sy(k[D], M, o, _, t);
        x.push({ label: `Br ${D + 1}`, blocks: H }), R = Math.max(R, B);
        const U = s.length * 10 + D + 1;
        for (const J of W) l.emits.push({ ...J, laneIndex: U });
        for (const J of q) l.awaits.push({ ...J, laneIndex: U });
      }
      const F = Math.max(qn, R);
      a.push({
        type: "parallel",
        leftPx: M,
        widthPx: F,
        label: `${k.length} br`,
        entryPath: I,
        selected: O
      }), s.push({ parallelEntryIndex: v, startPx: M, lanes: x }), d += F;
    } else {
      const { stepDuration: k } = Ka(S), M = Math.max(Of, k * o), x = kf(S);
      a.push({
        type: "step",
        leftPx: d,
        widthPx: M,
        label: x,
        entryPath: I,
        selected: O
      }), d += M;
    }
  }
  a.push({
    type: "landing",
    leftPx: d,
    widthPx: du,
    label: "Landing",
    entryPath: "landing",
    selected: t === "landing"
  }), d += du;
  const m = s.flatMap((v) => v.lanes), g = m.length;
  for (const v of u)
    m.push({ label: v.label, blocks: v.blocks });
  const y = Cy(l, m.length), h = [];
  for (let v = 0; v < u.length; v++) {
    const S = g + v;
    for (const I of u[v].blocks) {
      const O = I.leftPx, k = dr + Tn, M = dr + (1 + S) * Tn + Tn / 2;
      h.push({ x: O, y1: k, y2: M });
    }
  }
  const p = Ty(i, o), w = Ly(a), b = dr + (1 + m.length) * Tn;
  return {
    mainBlocks: a,
    subLanes: m,
    signalArcs: y,
    fafConnectors: h,
    timeMarkers: p,
    insertionPoints: w,
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
  var y, h, p, w;
  const n = e.segments ?? {}, i = e.entry ?? "main", r = Object.keys(n);
  if (r.length === 0)
    return { nodes: [], edges: [], totalWidthPx: 0 };
  const o = /* @__PURE__ */ new Set(), a = [];
  let s = i;
  for (; s && typeof s == "string" && n[s] && !o.has(s); )
    o.add(s), a.push(s), s = n[s].next;
  for (const b of r)
    o.has(b) || a.push(b);
  const l = [];
  let u = mu;
  for (const b of a) {
    const v = n[b], S = fc(v.timeline ?? []), I = Oy(S), O = b === i, k = b === t, M = !o.has(b), x = vy;
    l.push({
      name: b,
      durationMs: S,
      durationLabel: I,
      isEntry: O,
      isActive: k,
      isOrphan: M,
      leftPx: u,
      widthPx: x,
      hasGate: !!v.gate,
      gateEvent: ((y = v.gate) == null ? void 0 : y.event) ?? null
    }), u += x + fu;
  }
  const d = [], m = new Map(l.map((b) => [b.name, b]));
  for (const b of a) {
    const v = n[b];
    if (!v.next) continue;
    const S = typeof v.next == "string" ? v.next : (h = v.next) == null ? void 0 : h.segment;
    if (!S) continue;
    const I = m.get(b), O = m.get(S);
    if (!I || !O) continue;
    const k = n[S], M = ((p = k == null ? void 0 : k.gate) == null ? void 0 : p.event) ?? null, x = typeof v.next == "object" && ((w = v.next) == null ? void 0 : w.scene);
    d.push({
      fromName: b,
      toName: S,
      gateLabel: M,
      isCrossScene: x,
      fromRightPx: I.leftPx + I.widthPx,
      toLeftPx: O.leftPx
    });
  }
  const g = u - fu + mu;
  return { nodes: l, edges: d, totalWidthPx: g };
}
c(Ay, "computeSegmentGraph");
function Mn(e) {
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
c(Mn, "parseEntryPath");
function Jo(e, t) {
  var i, r, o, a;
  const n = Mn(e);
  return n ? n.type === "setup" ? t.setup : n.type === "landing" ? t.landing : n.type === "timeline" ? t.timeline[n.index] : n.type === "branch" ? (a = (o = (r = (i = t.timeline[n.index]) == null ? void 0 : i.parallel) == null ? void 0 : r.branches) == null ? void 0 : o[n.branchIndex]) == null ? void 0 : a[n.branchEntryIndex] : null : null;
}
c(Jo, "getEntryAtPath");
function hu(e) {
  const t = Mn(e);
  return !t || t.type !== "timeline" ? null : t.index;
}
c(hu, "getTimelineIndexFromPath");
function ky(e) {
  var o, a;
  const t = /* @__PURE__ */ new Set(), i = (o = e.data.cinematics) == null ? void 0 : o[e.activeCinematicName];
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
      (a = s.gate) != null && a.target && t.add(s.gate.target), r(s.timeline);
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
  var i, r, o;
  const n = Mn(e);
  if (!n) return 0;
  if (n.type === "timeline") {
    let a = 0;
    for (let s = 0; s <= n.index; s++) {
      const l = t.timeline[s];
      l && l.delay == null && l.emit == null && l.parallel == null && l.sound == null && l.stopSound == null && a++;
    }
    return a;
  }
  if (n.type === "branch") {
    const a = ((o = (r = (i = t.timeline[n.index]) == null ? void 0 : i.parallel) == null ? void 0 : r.branches) == null ? void 0 : o[n.branchIndex]) ?? [];
    let s = 0;
    for (let l = 0; l <= n.branchEntryIndex; l++) {
      const u = a[l];
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
  var a;
  const n = e.parallel, i = n.join ?? "all", r = n.overflow ?? "detach", o = (n.branches ?? []).map((s, l) => ({
    branchIndex: l,
    label: `Branch ${l + 1}`,
    entries: (s ?? []).map((u, d) => {
      var S, I;
      const m = u.delay != null, g = u.await != null, y = u.emit != null, h = u.sound != null, p = u.stopSound != null, w = !m && !g && !y && !h && !p;
      let b, v;
      return m ? (b = `${u.delay}ms`, v = "delay") : g ? (b = "Await", v = ((S = u.await) == null ? void 0 : S.event) ?? "click") : y ? (b = "Emit", v = u.emit || "(unnamed)") : h ? (b = "Sound", v = (u.sound.src || "").split("/").pop() || "(none)") : p ? (b = "Stop Sound", v = u.stopSound || "(no id)") : (b = "Step", v = `${((I = u.tweens) == null ? void 0 : I.length) ?? 0} tweens`), { branchEntryIndex: d, isDelay: m, isAwait: g, isEmit: y, isSound: h, isStopSound: p, isStep: w, label: b, sub: v };
    })
  }));
  return {
    type: "parallel",
    isParallel: !0,
    branchCount: ((a = n.branches) == null ? void 0 : a.length) ?? 0,
    join: i,
    overflow: r,
    joinIsAll: i === "all",
    joinIsAny: i === "any",
    overflowIsDetach: r === "detach",
    overflowIsCancel: r === "cancel",
    branches: o
  };
}
c(Py, "buildParallelDetail");
function Ry(e, t, n, i) {
  const r = Ba(), o = (e.tweens ?? []).map((l, u) => {
    const d = `${t}.tweens.${u}`, m = n.has(d), g = l.type ?? "tile-prop", y = lu.find((b) => b.value === g), h = If[g], p = (h == null ? void 0 : h.form) ?? "prop", w = l.mode ?? "oklch";
    return {
      tweenIndex: u,
      isExpanded: m,
      type: g,
      typeLabel: (y == null ? void 0 : y.label) ?? l.type ?? "Tile Prop",
      target: l.target ?? "",
      attribute: l.attribute ?? "",
      attributePlaceholder: (h == null ? void 0 : h.placeholder) ?? "",
      value: l.value ?? "",
      easing: l.easing ?? "",
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
  }), a = Object.keys(e.before ?? {}), s = Object.keys(e.after ?? {});
  return {
    type: "step",
    isStep: !0,
    isDelay: !1,
    stepNumber: My(t, i),
    stepDuration: e.duration ?? 1e3,
    tweens: o,
    beforeSummary: a.length ? `${a.length} target${a.length !== 1 ? "s" : ""}` : "(none)",
    afterSummary: s.length ? `${s.length} target${s.length !== 1 ? "s" : ""}` : "(none)"
  };
}
c(Ry, "buildStepDetail");
function Hy(e, { state: t, expandedTweens: n }) {
  const i = Mn(e);
  if (!i) return null;
  if (i.type === "setup") return Ny(t);
  if (i.type === "landing") return _y(t);
  const r = Jo(e, t);
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
          var r, o, a, s;
          const i = n.find("#cinematic-import-json").val();
          try {
            const l = JSON.parse(i);
            if (typeof l != "object" || l === null || Array.isArray(l))
              throw new Error("Expected a JSON object");
            if (l.cinematics)
              t(() => new Rt(l));
            else if (l.segments !== void 0) {
              const u = { version: 4, cinematics: { [e.activeCinematicName]: l } };
              t(() => new Rt(u, { cinematicName: e.activeCinematicName }));
            } else if (l.timeline !== void 0) {
              const u = { version: 3, cinematics: { [e.activeCinematicName]: l } };
              t(() => new Rt(u, { cinematicName: e.activeCinematicName }));
            } else
              throw new Error("Expected v3/v4 wrapper or single cinematic with 'segments' or 'timeline'");
            (o = (r = ui.notifications) == null ? void 0 : r.info) == null || o.call(r, "Cinematic JSON imported.");
          } catch (l) {
            (s = (a = ui.notifications) == null ? void 0 : a.error) == null || s.call(a, `Import failed: ${l.message}`);
          }
        }, "callback")
      },
      cancel: { label: "Cancel" }
    },
    default: "import"
  }).render(!0);
}
c(qy, "showImportDialog");
function Yo(e, { state: t, mutate: n }) {
  const i = e === "setup" ? t.setup : t.landing, r = JSON.stringify(i ?? {}, null, 2);
  new Dialog({
    title: `Edit ${e.charAt(0).toUpperCase() + e.slice(1)}`,
    content: `
			<p style="font-size:0.82rem;margin-bottom:0.4rem">JSON map of target selector → property overrides:</p>
			<textarea id="cinematic-json-edit" style="width:100%;height:200px;font-family:monospace;font-size:0.8rem">${It(r)}</textarea>
		`,
    buttons: {
      save: {
        label: "Apply",
        callback: /* @__PURE__ */ c((o) => {
          var s, l;
          const a = o.find("#cinematic-json-edit").val();
          try {
            const u = JSON.parse(a);
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
c(Yo, "showEditJsonDialog");
function pu(e, { selectedPath: t, state: n, mutate: i }) {
  const r = Jo(t, n);
  if (!r || r.delay != null) return;
  const o = r[e] ?? {}, a = JSON.stringify(o, null, 2);
  new Dialog({
    title: `Edit Step ${e.charAt(0).toUpperCase() + e.slice(1)}`,
    content: `
			<p style="font-size:0.82rem;margin-bottom:0.4rem">JSON map of target selector → property overrides:</p>
			<textarea id="cinematic-json-edit" style="width:100%;height:200px;font-family:monospace;font-size:0.8rem">${It(a)}</textarea>
		`,
    buttons: {
      save: {
        label: "Apply",
        callback: /* @__PURE__ */ c((s) => {
          var u, d;
          const l = s.find("#cinematic-json-edit").val();
          try {
            const m = JSON.parse(l), g = Mn(t);
            (g == null ? void 0 : g.type) === "timeline" ? i((y) => y.updateEntry(g.index, { [e]: m })) : (g == null ? void 0 : g.type) === "branch" && i((y) => y.updateBranchEntry(g.index, g.branchIndex, g.branchEntryIndex, { [e]: m }));
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
  const i = Mn(e);
  if (!i || i.type !== "timeline") return;
  const r = t.timeline[i.index];
  if (!(r != null && r.parallel)) return;
  const o = JSON.stringify(r.parallel.branches ?? [], null, 2);
  new Dialog({
    title: "Edit Parallel Branches",
    content: `
			<p style="font-size:0.82rem;margin-bottom:0.4rem">JSON array of branch timelines:</p>
			<textarea id="cinematic-json-edit" style="width:100%;height:250px;font-family:monospace;font-size:0.8rem">${It(o)}</textarea>
		`,
    buttons: {
      save: {
        label: "Apply",
        callback: /* @__PURE__ */ c((a) => {
          var l, u;
          const s = a.find("#cinematic-json-edit").val();
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
var Pu, pn, On, Oo, Mf;
const pt = class pt extends Dn($n) {
  constructor(n = {}) {
    super(n);
    A(this, On);
    A(this, pn, null);
    L(this, pn, n.scene ?? canvas.scene ?? null);
  }
  async _prepareContext() {
    var r, o, a;
    const n = f(this, On, Oo), i = ((o = n == null ? void 0 : n.getSeenStatus) == null ? void 0 : o.call(n, (r = f(this, pn)) == null ? void 0 : r.id)) ?? [];
    return {
      sceneName: ((a = f(this, pn)) == null ? void 0 : a.name) ?? "No scene",
      users: i.map((s) => ({
        ...s,
        statusLabel: s.seen ? "Seen" : "Not seen",
        statusClass: s.seen ? "cinematic-tracking__status--seen" : "cinematic-tracking__status--unseen"
      })),
      hasAnyTracked: i.some((s) => s.seen)
    };
  }
  _onRender(n, i) {
    super._onRender(n, i), C(this, On, Mf).call(this);
  }
};
pn = new WeakMap(), On = new WeakSet(), Oo = /* @__PURE__ */ c(function() {
  var n, i;
  return (i = (n = game.modules.get(T)) == null ? void 0 : n.api) == null ? void 0 : i.cinematic;
}, "#api"), Mf = /* @__PURE__ */ c(function() {
  var i, r;
  const n = this.element;
  n instanceof HTMLElement && (n.querySelectorAll("[data-action='reset-user']").forEach((o) => {
    o.addEventListener("click", async () => {
      var l;
      const a = o.dataset.userId;
      if (!a) return;
      const s = f(this, On, Oo);
      s != null && s.resetForUser && (await s.resetForUser((l = f(this, pn)) == null ? void 0 : l.id, a), this.render({ force: !0 }));
    });
  }), (i = n.querySelector("[data-action='reset-all']")) == null || i.addEventListener("click", async () => {
    var a;
    const o = f(this, On, Oo);
    o != null && o.resetForAll && (await o.resetForAll((a = f(this, pn)) == null ? void 0 : a.id), this.render({ force: !0 }));
  }), (r = n.querySelector("[data-action='refresh']")) == null || r.addEventListener("click", () => {
    this.render({ force: !0 });
  }));
}, "#bindEvents"), c(pt, "CinematicTrackingApplication"), pe(pt, "APP_ID", `${T}-cinematic-tracking`), pe(pt, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  $e(pt, pt, "DEFAULT_OPTIONS"),
  {
    id: pt.APP_ID,
    classes: Array.from(
      /* @__PURE__ */ new Set([...((Pu = $e(pt, pt, "DEFAULT_OPTIONS")) == null ? void 0 : Pu.classes) ?? [], "eidolon-cinematic-tracking-window", "themed"])
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
)), pe(pt, "PARTS", {
  content: {
    template: `modules/${T}/templates/cinematic-tracking.html`
  }
});
let Al = pt;
function By(e, t) {
  var n, i, r, o, a, s, l, u, d;
  (n = e.querySelector("[data-action='save']")) == null || n.addEventListener("click", () => t.save()), (i = e.querySelector("[data-action='play-preview']")) == null || i.addEventListener("click", () => t.play()), (r = e.querySelector("[data-action='reset-tracking']")) == null || r.addEventListener("click", () => t.resetTracking()), (o = e.querySelector("[data-action='export-json']")) == null || o.addEventListener("click", () => t.exportJSON()), (a = e.querySelector("[data-action='undo']")) == null || a.addEventListener("click", () => t.undo()), (s = e.querySelector("[data-action='redo']")) == null || s.addEventListener("click", () => t.redo()), (l = e.querySelector("[data-action='validate']")) == null || l.addEventListener("click", () => t.validate()), (u = e.querySelector("[data-action='import-json']")) == null || u.addEventListener("click", () => t.importJSON()), (d = e.querySelector("[data-action='open-tracking']")) == null || d.addEventListener("click", () => {
    new Al({ scene: t.scene }).render(!0);
  });
}
c(By, "bindToolbarEvents");
function Uy(e, t) {
  var n, i, r, o;
  (n = e.querySelector("[data-action='change-cinematic']")) == null || n.addEventListener("change", (a) => {
    t.flushTweenChanges(), t.switchCinematic(a.target.value);
  }), (i = e.querySelector("[data-action='add-cinematic']")) == null || i.addEventListener("click", () => {
    new Dialog({
      title: "New Cinematic",
      content: '<label style="display:flex;align-items:center;gap:0.5rem"><span>Name:</span><input id="cinematic-new-name" type="text" style="flex:1" placeholder="intro" /></label>',
      buttons: {
        ok: {
          label: "Create",
          callback: /* @__PURE__ */ c((a) => {
            var l, u, d, m, g, y, h;
            const s = (l = a.find("#cinematic-new-name").val()) == null ? void 0 : l.trim();
            if (!s) {
              (d = (u = ui.notifications) == null ? void 0 : u.warn) == null || d.call(u, "Name cannot be empty.");
              return;
            }
            if (/[.\s]/.test(s)) {
              (g = (m = ui.notifications) == null ? void 0 : m.warn) == null || g.call(m, "Name cannot contain dots or spaces.");
              return;
            }
            if (t.state.listCinematicNames().includes(s)) {
              (h = (y = ui.notifications) == null ? void 0 : y.warn) == null || h.call(y, "Name already exists.");
              return;
            }
            t.mutate((p) => p.addCinematic(s));
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
  }), (o = e.querySelector("[data-action='rename-cinematic']")) == null || o.addEventListener("click", () => {
    const a = t.state.activeCinematicName;
    new Dialog({
      title: "Rename Cinematic",
      content: `<label style="display:flex;align-items:center;gap:0.5rem"><span>Name:</span><input id="cinematic-rename" type="text" style="flex:1" value="${It(a)}" /></label>`,
      buttons: {
        ok: {
          label: "Rename",
          callback: /* @__PURE__ */ c((s) => {
            var u, d, m, g, y, h, p;
            const l = (u = s.find("#cinematic-rename").val()) == null ? void 0 : u.trim();
            if (!l) {
              (m = (d = ui.notifications) == null ? void 0 : d.warn) == null || m.call(d, "Name cannot be empty.");
              return;
            }
            if (/[.\s]/.test(l)) {
              (y = (g = ui.notifications) == null ? void 0 : g.warn) == null || y.call(g, "Name cannot contain dots or spaces.");
              return;
            }
            if (l !== a) {
              if (t.state.listCinematicNames().includes(l)) {
                (p = (h = ui.notifications) == null ? void 0 : h.warn) == null || p.call(h, "Name already exists.");
                return;
              }
              t.mutate((w) => w.renameCinematic(a, l));
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
      const o = i.dataset.entryPath;
      t.setSelectedPath(t.selectedPath === o ? null : o);
    });
  });
  let n = null;
  e.querySelectorAll(".cinematic-editor__lane--main [data-action='select-block']").forEach((i) => {
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
      const a = i.dataset.entryPath;
      if (n && n !== a) {
        const s = hu(n), l = hu(a);
        s != null && l != null && (t.selectedPath === n && t.setSelectedPath(a), t.mutate((u) => u.moveEntry(s, l)));
      }
      n = null;
    }), i.addEventListener("dragend", () => {
      i.classList.remove("dragging"), n = null;
    }));
  }), e.querySelectorAll("[data-action='show-insert-menu']").forEach((i) => {
    i.addEventListener("click", (r) => {
      r.stopPropagation();
      const o = Number(i.dataset.insertIndex), a = i.dataset.lane;
      t.showInsertMenu(i, o, a);
    });
  }), e.querySelectorAll("[data-action='insert-entry']").forEach((i) => {
    i.addEventListener("click", () => {
      if (!t.insertMenuState) return;
      const r = i.dataset.insertType, { insertIndex: o } = t.insertMenuState;
      switch (r) {
        case "step":
          t.mutate((a) => a.addStep(o));
          break;
        case "delay":
          t.mutate((a) => a.addDelay(o));
          break;
        case "emit":
          t.mutate((a) => a.addEmit(o));
          break;
        case "parallel":
          t.mutate((a) => a.addParallel(o));
          break;
        case "sound":
          t.mutate((a) => a.addSound(o));
          break;
        case "stopSound":
          t.mutate((a) => a.addStopSound(o));
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
  var n, i, r, o, a, s, l, u, d, m, g;
  (n = e.querySelector("[data-action='delete-entry']")) == null || n.addEventListener("click", () => {
    const y = t.parseEntryPath(t.selectedPath);
    y && (y.type === "timeline" ? (t.mutate((h) => h.removeEntry(y.index)), t.setSelectedPath(null)) : y.type === "branch" && (t.mutate((h) => h.removeBranchEntry(y.index, y.branchIndex, y.branchEntryIndex)), t.setSelectedPath(null)));
  }), (i = e.querySelector("[data-action='step-duration']")) == null || i.addEventListener("input", (y) => {
    const h = t.parseEntryPath(t.selectedPath);
    if (!h) return;
    const p = Number(y.target.value) || 0;
    h.type === "timeline" ? t.mutate((w) => w.updateStepDuration(h.index, p)) : h.type === "branch" && t.mutate((w) => w.updateBranchEntry(h.index, h.branchIndex, h.branchEntryIndex, { duration: Math.max(0, p) }));
  }), (r = e.querySelector("[data-action='add-tween']")) == null || r.addEventListener("click", () => {
    const y = t.parseEntryPath(t.selectedPath);
    if (y) {
      if (y.type === "timeline")
        t.mutate((h) => h.addTween(y.index));
      else if (y.type === "branch") {
        const h = t.getEntryAtPath(t.selectedPath);
        if (!h) return;
        const p = { type: "tile-prop", target: "", attribute: "alpha", value: 1 }, w = [...h.tweens ?? [], p];
        t.mutate((b) => b.updateBranchEntry(y.index, y.branchIndex, y.branchEntryIndex, { tweens: w }));
      }
    }
  }), (o = e.querySelector("[data-action='change-delay']")) == null || o.addEventListener("change", (y) => {
    const h = t.parseEntryPath(t.selectedPath);
    if (!h) return;
    const p = Number(y.target.value) || 0;
    h.type === "timeline" ? t.mutate((w) => w.updateEntry(h.index, { delay: p })) : h.type === "branch" && t.mutate((w) => w.updateBranchEntry(h.index, h.branchIndex, h.branchEntryIndex, { delay: p }));
  }), (a = e.querySelector("[data-action='edit-setup']")) == null || a.addEventListener("click", () => {
    Yo("setup", { state: t.state, mutate: t.mutate });
  }), (s = e.querySelector("[data-action='edit-landing']")) == null || s.addEventListener("click", () => {
    Yo("landing", { state: t.state, mutate: t.mutate });
  }), (l = e.querySelector("[data-action='edit-before']")) == null || l.addEventListener("click", () => {
    pu("before", { selectedPath: t.selectedPath, state: t.state, mutate: t.mutate });
  }), (u = e.querySelector("[data-action='edit-after']")) == null || u.addEventListener("click", () => {
    pu("after", { selectedPath: t.selectedPath, state: t.state, mutate: t.mutate });
  }), (d = e.querySelector("[data-action='change-trigger']")) == null || d.addEventListener("change", (y) => {
    t.mutate((h) => h.setTrigger(y.target.value));
  }), (m = e.querySelector("[data-action='change-tracking']")) == null || m.addEventListener("change", (y) => {
    t.mutate((h) => h.setTracking(y.target.checked));
  }), (g = e.querySelector("[data-action='change-synchronized']")) == null || g.addEventListener("change", (y) => {
    t.mutate((h) => h.setSynchronized(y.target.checked));
  });
}
c(zy, "bindDetailPanelEvents");
const Ui = /* @__PURE__ */ new WeakMap(), Qo = /* @__PURE__ */ new Set(), Xo = /* @__PURE__ */ new Set(), yu = {
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
function Zo(e, t = {}) {
  var h, p, w;
  if (!e) return !1;
  Vi(e);
  const n = t.mode ?? (t.color != null ? "custom" : "hover"), i = yu[n] ?? yu.hover, r = t.color ?? i.borderColor, o = t.alpha ?? i.borderAlpha, a = t.color ?? i.spriteTint, s = i.spriteAlpha, l = t.pulse ?? i.pulse, u = { border: null, sprite: null, pulseData: null, mode: n }, d = ((h = e.document) == null ? void 0 : h.width) ?? e.w ?? 100, m = ((p = e.document) == null ? void 0 : p.height) ?? e.h ?? 100, g = new PIXI.Graphics();
  g.lineStyle(i.borderWidth, r, o), g.drawRect(0, 0, d, m), e.addChild(g), u.border = g;
  const y = Gy(e, a, s);
  if (y && (canvas.controls.debug.addChild(y), Xo.add(y), u.sprite = y), l && ((w = canvas.app) != null && w.ticker)) {
    const b = {
      elapsed: 0,
      fn: /* @__PURE__ */ c((v) => {
        b.elapsed += v;
        const S = (Math.sin(b.elapsed * 0.05) + 1) / 2;
        u.border && (u.border.alpha = o * (0.4 + 0.6 * S)), u.sprite && (u.sprite.alpha = s * (0.5 + 0.5 * S));
      }, "fn")
    };
    canvas.app.ticker.add(b.fn), u.pulseData = b, Qo.add(b);
  }
  return Ui.set(e, u), !0;
}
c(Zo, "addHighlight");
function Vi(e) {
  var n, i;
  if (!e) return;
  const t = Ui.get(e);
  t && (t.pulseData && ((i = (n = canvas.app) == null ? void 0 : n.ticker) == null || i.remove(t.pulseData.fn), Qo.delete(t.pulseData)), t.border && (t.border.parent && t.border.parent.removeChild(t.border), t.border.destroy({ children: !0 })), t.sprite && (t.sprite.parent && t.sprite.parent.removeChild(t.sprite), t.sprite.destroy({ children: !0 }), Xo.delete(t.sprite)), Ui.delete(e));
}
c(Vi, "removeHighlight");
function Nf(e) {
  return Ui.has(e);
}
c(Nf, "hasHighlight");
function Ao() {
  var t, n, i, r, o, a, s;
  for (const l of Qo)
    (n = (t = canvas.app) == null ? void 0 : t.ticker) == null || n.remove(l.fn);
  Qo.clear();
  for (const l of Xo)
    l.parent && l.parent.removeChild(l), l.destroy({ children: !0 });
  Xo.clear();
  const e = [
    (i = canvas.tiles) == null ? void 0 : i.placeables,
    (r = canvas.tokens) == null ? void 0 : r.placeables,
    (o = canvas.lighting) == null ? void 0 : o.placeables,
    (a = canvas.drawings) == null ? void 0 : a.placeables,
    (s = canvas.sounds) == null ? void 0 : s.placeables
  ];
  for (const l of e)
    if (l)
      for (const u of l) {
        const d = Ui.get(u);
        d && (d.border && (d.border.parent && d.border.parent.removeChild(d.border), d.border.destroy({ children: !0 })), Ui.delete(u));
      }
}
c(Ao, "clearAllHighlights");
function Gy(e, t, n) {
  var o;
  const i = e.mesh;
  if (!((o = i == null ? void 0 : i.texture) != null && o.baseTexture)) return null;
  const r = PIXI.Sprite.from(i.texture);
  return r.isSprite = !0, r.anchor.set(i.anchor.x, i.anchor.y), r.width = i.width, r.height = i.height, r.scale = i.scale, r.position = e.center, r.angle = i.angle, r.alpha = n, r.tint = t, r.name = "eidolonPickerHighlight", r;
}
c(Gy, "createTintSprite");
let jn = null;
function _f(e) {
  var h, p, w;
  jn && jn.cancel();
  const { placeableType: t = "Tile", onPick: n, onCancel: i } = e;
  let r = null;
  const o = `control${t}`, a = `hover${t}`, s = /* @__PURE__ */ c((b, v) => {
    var I;
    if (!v) return;
    const S = b.document ?? b;
    (I = b.release) == null || I.call(b), n(S);
  }, "onControl"), l = /* @__PURE__ */ c((b, v) => {
    v ? (r = b, Zo(b, { mode: "pick" })) : r === b && (Vi(b), r = null);
  }, "onHoverIn"), u = /* @__PURE__ */ c((b) => {
    b.key === "Escape" && (b.preventDefault(), b.stopPropagation(), y());
  }, "onKeydown"), d = /* @__PURE__ */ c((b) => {
    b.preventDefault(), y();
  }, "onContextMenu"), m = Hooks.on(o, s), g = Hooks.on(a, l);
  document.addEventListener("keydown", u, { capture: !0 }), (h = canvas.stage) == null || h.addEventListener("rightclick", d), (w = (p = ui.notifications) == null ? void 0 : p.info) == null || w.call(p, `Pick mode active — click a ${t.toLowerCase()} on the canvas, or press ESC to cancel.`, { permanent: !1 });
  function y() {
    var b;
    jn && (jn = null, Hooks.off(o, m), Hooks.off(a, g), document.removeEventListener("keydown", u, { capture: !0 }), (b = canvas.stage) == null || b.removeEventListener("rightclick", d), r && (Vi(r), r = null), i == null || i());
  }
  return c(y, "cancel"), jn = { cancel: y }, { cancel: y };
}
c(_f, "enterPickMode");
function sr() {
  jn && jn.cancel();
}
c(sr, "cancelPickMode");
const Wy = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  cancelPickMode: sr,
  enterPickMode: _f
}, Symbol.toStringTag, { value: "Module" }));
var Ru, Ie, He, qr, yn, jr, Br, Je, bn, de, $f, kl, Df, Ff, xf, Ml, Nl, Pf, Rf;
const ot = class ot extends Dn($n) {
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
    A(this, yn, "any");
    /** @type {((selectors: string[]) => void) | null} */
    A(this, jr, null);
    /** @type {(() => void) | null} */
    A(this, Br, null);
    /** @type {Promise resolve function for the open() API. */
    A(this, Je, null);
    /** @type {PlaceableObject | null} Currently hovered tile in the browser. */
    A(this, bn, null);
    L(this, Ie, [...n.selections ?? []]), L(this, qr, n.placeableType ?? "Tile"), L(this, jr, n.onApply ?? null), L(this, Br, n.onCancel ?? null);
  }
  // ── Context ───────────────────────────────────────────────────────────
  async _prepareContext() {
    var r;
    const n = C(this, de, Ml).call(this), i = (((r = canvas.tiles) == null ? void 0 : r.placeables) ?? []).map((o, a) => {
      var d, m;
      const s = o.document, l = s.id, u = (d = s.texture) != null && d.src ? s.texture.src.split("/").pop().replace(/\.[^.]+$/, "") : `Tile ${a + 1}`;
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
      tagModeIsAny: f(this, yn) === "any",
      tagModeIsAll: f(this, yn) === "all",
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
    return f(this, He) && (sr(), L(this, He, !1)), Ao(), f(this, Je) && (f(this, Je).call(this, null), L(this, Je, null)), super._onClose(n);
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
      const r = new ot({
        ...n,
        onApply: /* @__PURE__ */ c((o) => i(o), "onApply"),
        onCancel: /* @__PURE__ */ c(() => i(null), "onCancel")
      });
      L(r, Je, i), r.render(!0);
    });
  }
};
Ie = new WeakMap(), He = new WeakMap(), qr = new WeakMap(), yn = new WeakMap(), jr = new WeakMap(), Br = new WeakMap(), Je = new WeakMap(), bn = new WeakMap(), de = new WeakSet(), $f = /* @__PURE__ */ c(function() {
  var o, a, s, l;
  const n = this.element;
  if (!(n instanceof HTMLElement)) return;
  const i = n.querySelector("[data-role='tag-input']"), r = n.querySelector("[data-role='tag-mode']");
  r == null || r.addEventListener("change", (u) => {
    L(this, yn, u.target.value);
  }), i == null || i.addEventListener("input", () => {
    C(this, de, Df).call(this, n);
  }), i == null || i.addEventListener("keydown", (u) => {
    u.key === "Enter" && (u.preventDefault(), C(this, de, kl).call(this, n));
  }), (o = n.querySelector("[data-action='add-tag-selector']")) == null || o.addEventListener("click", () => {
    C(this, de, kl).call(this, n);
  }), (a = n.querySelector("[data-action='toggle-pick-mode']")) == null || a.addEventListener("click", () => {
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
      var g, y;
      const d = u.dataset.docId;
      if (!d) return;
      const m = (y = (g = canvas.tiles) == null ? void 0 : g.placeables) == null ? void 0 : y.find((h) => h.document.id === d);
      m && (L(this, bn, m), Zo(m, { mode: "hover" }));
    }), u.addEventListener("mouseleave", () => {
      f(this, bn) && (Vi(f(this, bn)), L(this, bn, null), C(this, de, Nl).call(this));
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
  const o = r.split(",").map((l) => l.trim()).filter(Boolean);
  if (o.length === 0) return;
  const a = wf(o, f(this, yn));
  a && !f(this, Ie).includes(a) && f(this, Ie).push(a), i && (i.value = ""), this.render({ force: !0 });
}, "#addTagSelector"), Df = /* @__PURE__ */ c(function(n) {
  var m, g;
  const i = n.querySelector("[data-role='tag-input']"), r = n.querySelector("[data-role='tag-preview']");
  if (!i || !r) return;
  const o = i.value.trim();
  if (!o) {
    r.textContent = "";
    return;
  }
  const a = o.split(",").map((y) => y.trim()).filter(Boolean);
  if (a.length === 0) {
    r.textContent = "";
    return;
  }
  const s = window.Tagger ?? ((m = game.modules.get("tagger")) == null ? void 0 : m.api);
  if (!s) {
    r.textContent = "Tagger not available";
    return;
  }
  const l = f(this, yn) === "any", u = s.getByTag(a, {
    sceneId: (g = canvas.scene) == null ? void 0 : g.id,
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
    const o = Wa(i);
    if (o != null && o.placeables)
      for (const { doc: a } of o.placeables)
        a != null && a.id && n.add(a.id);
  }
  return n;
}, "#getSelectedIds"), // ── Canvas selection highlights ──────────────────────────────────────
/**
 * Maintain "selected" highlights on canvas tiles that are in the selection list.
 * Clears stale highlights and adds missing ones (skipping the hovered tile).
 */
Nl = /* @__PURE__ */ c(function() {
  var r, o;
  const n = C(this, de, Ml).call(this), i = ((r = canvas.tiles) == null ? void 0 : r.placeables) ?? [];
  for (const a of i) {
    const s = (o = a.document) == null ? void 0 : o.id;
    if (!s) continue;
    const l = n.has(s), u = a === f(this, bn), d = Nf(a);
    l && !u && !d ? Zo(a, { mode: "selected" }) : !l && d && !u && Vi(a);
  }
}, "#refreshSelectionHighlights"), // ── Apply / Cancel ──────────────────────────────────────────────────
Pf = /* @__PURE__ */ c(function() {
  var i;
  f(this, He) && (sr(), L(this, He, !1)), Ao();
  const n = [...f(this, Ie)];
  (i = f(this, jr)) == null || i.call(this, n), f(this, Je) && (f(this, Je).call(this, n), L(this, Je, null)), this.close({ force: !0 });
}, "#doApply"), Rf = /* @__PURE__ */ c(function() {
  var n;
  f(this, He) && (sr(), L(this, He, !1)), Ao(), (n = f(this, Br)) == null || n.call(this), f(this, Je) && (f(this, Je).call(this, null), L(this, Je, null)), this.close({ force: !0 });
}, "#doCancel"), c(ot, "PlaceablePickerApplication"), pe(ot, "APP_ID", `${T}-placeable-picker`), pe(ot, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  $e(ot, ot, "DEFAULT_OPTIONS"),
  {
    id: ot.APP_ID,
    classes: Array.from(
      /* @__PURE__ */ new Set([...((Ru = $e(ot, ot, "DEFAULT_OPTIONS")) == null ? void 0 : Ru.classes) ?? [], "eidolon-placeable-picker-window", "themed"])
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
)), pe(ot, "PARTS", {
  content: {
    template: `modules/${T}/templates/placeable-picker.html`
  }
});
let ea = ot;
function Ky(e, t) {
  e.querySelectorAll("[data-action='toggle-tween-card']").forEach((n) => {
    n.addEventListener("click", (i) => {
      if (i.target.closest("[data-action='delete-tween']")) return;
      const r = Number(n.dataset.tweenIndex), o = `${t.selectedPath}.tweens.${r}`;
      t.expandedTweens.has(o) ? t.expandedTweens.delete(o) : t.expandedTweens.add(o), t.render();
    });
  }), e.querySelectorAll("[data-action='pick-target']").forEach((n) => {
    n.addEventListener("click", async () => {
      var u, d;
      const i = Number(n.dataset.tweenIndex), r = t.parseEntryPath(t.selectedPath);
      if (!r || Number.isNaN(i)) return;
      const o = t.getEntryAtPath(t.selectedPath), a = ((d = (u = o == null ? void 0 : o.tweens) == null ? void 0 : u[i]) == null ? void 0 : d.target) ?? "", s = a ? [a] : [], l = await ea.open({ selections: s });
      if (l && l.length > 0) {
        if (r.type === "timeline")
          t.mutate((m) => m.updateTween(r.index, i, { target: l[0] }));
        else if (r.type === "branch") {
          const m = (o.tweens ?? []).map((g, y) => y === i ? { ...g, target: l[0] } : g);
          t.mutate((g) => g.updateBranchEntry(r.index, r.branchIndex, r.branchEntryIndex, { tweens: m }));
        }
      }
    });
  }), e.querySelectorAll("[data-action='delete-tween']").forEach((n) => {
    n.addEventListener("click", () => {
      const i = Number(n.dataset.tweenIndex), r = t.parseEntryPath(t.selectedPath);
      if (!(!r || Number.isNaN(i))) {
        if (r.type === "timeline")
          t.mutate((o) => o.removeTween(r.index, i));
        else if (r.type === "branch") {
          const o = t.getEntryAtPath(t.selectedPath);
          if (!o) return;
          const a = (o.tweens ?? []).filter((s, l) => l !== i);
          t.mutate((s) => s.updateBranchEntry(r.index, r.branchIndex, r.branchEntryIndex, { tweens: a }));
        }
      }
    });
  }), e.querySelectorAll(".cinematic-editor__tween-card-body").forEach((n) => {
    const i = Number(n.dataset.tweenIndex);
    n.querySelectorAll("[data-field]").forEach((r) => {
      const o = r.dataset.field, a = r.tagName === "SELECT" || r.type === "checkbox" ? "change" : "input";
      r.addEventListener(a, () => {
        let s;
        if (r.type === "checkbox" ? s = r.checked : o === "x" || o === "y" || o === "scale" || o === "toAlpha" ? s = r.value.trim() === "" ? "" : Number(r.value) || 0 : o === "value" && !Number.isNaN(Number(r.value)) && r.value.trim() !== "" ? s = Number(r.value) : s = r.value, o === "type") {
          const l = If[s], u = { type: s };
          if (l) {
            const d = l.form ?? "prop";
            d === "prop" || d === "particles" ? Object.assign(u, { attribute: l.attribute, value: l.value }) : d === "camera" ? Object.assign(u, { x: l.x, y: l.y, scale: l.scale }) : d === "lightColor" ? Object.assign(u, { toColor: l.toColor, toAlpha: l.toAlpha, mode: l.mode }) : d === "lightState" && Object.assign(u, { enabled: l.enabled });
          }
          t.queueTweenChange(i, u), t.flushTweenChangesImmediate(), t.render();
        } else
          t.queueTweenChange(i, { [o]: s });
      });
    });
  });
}
c(Ky, "bindTweenFieldEvents");
function Jy(e, t) {
  var i, r, o, a, s, l, u, d, m, g;
  function n(y, h, p) {
    y.type === "timeline" ? t.mutate((w) => w.updateEntry(y.index, { sound: p })) : y.type === "branch" && t.mutate((w) => w.updateBranchEntry(y.index, y.branchIndex, y.branchEntryIndex, { sound: p }));
  }
  c(n, "applySoundPatch"), (i = e.querySelector("[data-action='change-sound-src']")) == null || i.addEventListener("change", async (y) => {
    const h = t.parseEntryPath(t.selectedPath);
    if (!h) return;
    const p = t.getEntryAtPath(t.selectedPath);
    if (!(p != null && p.sound)) return;
    const w = y.target.value, b = { ...p.sound, src: w };
    b.id || (b.id = cu(w));
    const v = await uu(w);
    v > 0 && (b.duration = v), n(h, p, b);
  }), (r = e.querySelector("[data-action='pick-sound-src']")) == null || r.addEventListener("click", () => {
    const y = t.parseEntryPath(t.selectedPath);
    if (!y) return;
    const h = t.getEntryAtPath(t.selectedPath);
    if (!(h != null && h.sound)) return;
    new FilePicker({
      type: "audio",
      current: h.sound.src || "",
      callback: /* @__PURE__ */ c(async (w) => {
        const b = { ...h.sound, src: w };
        b.id || (b.id = cu(w));
        const v = await uu(w);
        v > 0 && (b.duration = v), n(y, h, b);
      }, "callback")
    }).render(!0);
  }), (o = e.querySelector("[data-action='change-sound-id']")) == null || o.addEventListener("change", (y) => {
    const h = t.parseEntryPath(t.selectedPath);
    if (!h) return;
    const p = t.getEntryAtPath(t.selectedPath);
    p != null && p.sound && n(h, p, { ...p.sound, id: y.target.value || void 0 });
  }), (a = e.querySelector("[data-action='change-sound-volume']")) == null || a.addEventListener("input", (y) => {
    const h = t.parseEntryPath(t.selectedPath);
    if (!h) return;
    const p = t.getEntryAtPath(t.selectedPath);
    p != null && p.sound && n(h, p, { ...p.sound, volume: Number(y.target.value) || 0.8 });
  }), (s = e.querySelector("[data-action='change-sound-loop']")) == null || s.addEventListener("change", (y) => {
    const h = t.parseEntryPath(t.selectedPath);
    if (!h) return;
    const p = t.getEntryAtPath(t.selectedPath);
    p != null && p.sound && n(h, p, { ...p.sound, loop: y.target.checked });
  }), (l = e.querySelector("[data-action='change-sound-fadein']")) == null || l.addEventListener("change", (y) => {
    const h = t.parseEntryPath(t.selectedPath);
    if (!h) return;
    const p = t.getEntryAtPath(t.selectedPath);
    p != null && p.sound && n(h, p, { ...p.sound, fadeIn: Number(y.target.value) || void 0 });
  }), (u = e.querySelector("[data-action='change-sound-fadeout']")) == null || u.addEventListener("change", (y) => {
    const h = t.parseEntryPath(t.selectedPath);
    if (!h) return;
    const p = t.getEntryAtPath(t.selectedPath);
    p != null && p.sound && n(h, p, { ...p.sound, fadeOut: Number(y.target.value) || void 0 });
  }), (d = e.querySelector("[data-action='change-sound-duration']")) == null || d.addEventListener("change", (y) => {
    const h = t.parseEntryPath(t.selectedPath);
    if (!h) return;
    const p = t.getEntryAtPath(t.selectedPath);
    p != null && p.sound && n(h, p, { ...p.sound, duration: Number(y.target.value) || 0 });
  }), (m = e.querySelector("[data-action='change-sound-fireandforget']")) == null || m.addEventListener("change", (y) => {
    const h = t.parseEntryPath(t.selectedPath);
    if (!h) return;
    const p = t.getEntryAtPath(t.selectedPath);
    p != null && p.sound && n(h, p, { ...p.sound, fireAndForget: y.target.checked });
  }), (g = e.querySelector("[data-action='change-stopsound-id']")) == null || g.addEventListener("change", (y) => {
    const h = t.parseEntryPath(t.selectedPath);
    h && (h.type === "timeline" ? t.mutate((p) => p.updateEntry(h.index, { stopSound: y.target.value })) : h.type === "branch" && t.mutate((p) => p.updateBranchEntry(h.index, h.branchIndex, h.branchEntryIndex, { stopSound: y.target.value })));
  });
}
c(Jy, "bindSoundFieldEvents");
function Yy(e, t) {
  var n, i, r, o, a;
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
  }), (o = e.querySelector("[data-action='edit-parallel-json']")) == null || o.addEventListener("click", () => {
    jy({ selectedPath: t.selectedPath, state: t.state, mutate: t.mutate });
  }), (a = e.querySelector("[data-action='add-branch']")) == null || a.addEventListener("click", () => {
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
function Qy(e, t) {
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
            callback: /* @__PURE__ */ c((o) => {
              var a;
              return r((a = o.find("#seg-name").val()) == null ? void 0 : a.trim());
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
      const o = await new Promise((a) => {
        new Dialog({
          title: "Rename Segment",
          content: `<label style="font-size:0.82rem">New name:<input type="text" id="seg-name" value="${r}" style="width:100%;margin-top:0.3rem" /></label>`,
          buttons: {
            ok: {
              label: "Rename",
              callback: /* @__PURE__ */ c((s) => {
                var l;
                return a((l = s.find("#seg-name").val()) == null ? void 0 : l.trim());
              }, "callback")
            },
            cancel: { label: "Cancel", callback: /* @__PURE__ */ c(() => a(null), "callback") }
          },
          default: "ok",
          close: /* @__PURE__ */ c(() => a(null), "close")
        }).render(!0);
      });
      o && o !== r && t.renameSegment(r, o);
    });
  });
}
c(Qy, "bindSegmentGraphEvents");
function Xy(e, t) {
  var n, i, r, o, a, s, l;
  (n = e.querySelector("[data-action='change-gate-event']")) == null || n.addEventListener("change", (u) => {
    var m;
    const d = u.target.value;
    if (!d)
      t.setSegmentGate(null);
    else {
      const g = ((m = t.state.activeSegment) == null ? void 0 : m.gate) ?? {};
      t.setSegmentGate({ ...g, event: d });
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
      onPick: /* @__PURE__ */ c((g) => {
        var p, w;
        const y = (w = (p = g.flags) == null ? void 0 : p.tagger) == null ? void 0 : w.tags, h = y != null && y.length ? `tag:${y[0]}` : `id:${g.id}`;
        t.setSegmentGate({ ...u, target: h });
      }, "onPick")
    });
  });
  for (const [u, d] of [["change-gate-anim-idle", "idle"], ["change-gate-anim-hover", "hover"], ["change-gate-anim-dim", "dim"]])
    (o = e.querySelector(`[data-action='${u}']`)) == null || o.addEventListener("change", (m) => {
      var b;
      const g = (b = t.state.activeSegment) == null ? void 0 : b.gate;
      if (!g) return;
      const y = m.target.value.trim(), h = y ? y.split(",").map((v) => v.trim()).filter(Boolean) : void 0, p = { ...g.animation ?? {} };
      h != null && h.length ? p[d] = h.length === 1 ? h[0] : h : delete p[d];
      const w = { ...g, animation: Object.keys(p).length ? p : void 0 };
      w.animation || delete w.animation, t.setSegmentGate(w);
    });
  (a = e.querySelector("[data-action='change-segment-next']")) == null || a.addEventListener("change", (u) => {
    const d = u.target.value;
    t.setSegmentNext(d || null);
  }), (s = e.querySelector("[data-action='edit-segment-setup']")) == null || s.addEventListener("click", () => {
    Yo("setup", { state: t.state, mutate: t.mutate });
  }), (l = e.querySelector("[data-action='edit-segment-landing']")) == null || l.addEventListener("click", () => {
    Yo("landing", { state: t.state, mutate: t.mutate });
  });
}
c(Xy, "bindSegmentDetailEvents");
var Hu, qe, G, Ye, vn, Et, Qe, je, Ma, Me, Xe, Na, Zt, Ri, lt, ti, wn, ni, j, Hf, qf, jf, Bf, ln, $l, Dl, Fl, xl, Uf, cn, Pl, Vf, zf, Gf, Wf, Kf, Rl, lr;
const yt = class yt extends Dn($n) {
  constructor(n = {}) {
    super(n);
    A(this, j);
    A(this, qe, null);
    A(this, G, null);
    A(this, Ye, null);
    A(this, vn, /* @__PURE__ */ new Set());
    A(this, Et, !1);
    A(this, Qe, null);
    A(this, je, null);
    A(this, Ma, 120);
    A(this, Me, []);
    A(this, Xe, -1);
    A(this, Na, 50);
    A(this, Zt, null);
    A(this, Ri, null);
    A(this, lt, null);
    A(this, ti, null);
    A(this, wn, null);
    A(this, ni, null);
    L(this, qe, n.scene ?? canvas.scene ?? null), L(this, G, Rt.fromScene(f(this, qe)));
  }
  // ── Context ───────────────────────────────────────────────────────────
  async _prepareContext() {
    var y, h;
    const n = Ay(f(this, G), f(this, G).activeSegmentName), i = Iy(f(this, G).timeline, {
      selectedPath: f(this, Ye),
      windowWidth: ((y = this.position) == null ? void 0 : y.width) ?? 1100
    }), r = f(this, Ye) != null ? Hy(f(this, Ye), { state: f(this, G), expandedTweens: f(this, vn) }) : null, o = f(this, G).listCinematicNames(), a = f(this, G).activeCinematicName, l = f(this, G).listSegmentNames().length > 1, u = f(this, G).activeSegment, d = (u == null ? void 0 : u.gate) ?? null, m = (u == null ? void 0 : u.next) ?? null, g = typeof m == "string" ? m : (m == null ? void 0 : m.segment) ?? null;
    return {
      // Toolbar
      sceneName: ((h = f(this, qe)) == null ? void 0 : h.name) ?? "No scene",
      dirty: f(this, Et),
      canUndo: f(this, j, $l),
      canRedo: f(this, j, Dl),
      // Cinematic selector
      cinematicNames: o,
      activeCinematicName: a,
      cinematicOptions: o.map((p) => ({
        value: p,
        label: p,
        selected: p === a
      })),
      hasMultipleCinematics: o.length > 1,
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
      activeSegmentNext: g,
      activeSegmentSetupCount: Object.keys((u == null ? void 0 : u.setup) ?? {}).length,
      activeSegmentLandingCount: Object.keys((u == null ? void 0 : u.landing) ?? {}).length,
      // Footer
      trigger: f(this, G).trigger,
      tracking: f(this, G).tracking,
      synchronized: f(this, G).synchronized,
      triggerOptions: by.map((p) => ({
        ...p,
        selected: p.value === f(this, G).trigger
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
    var r, o, a;
    if (super._onRender(n, i), C(this, j, Hf).call(this), !f(this, ti)) {
      const s = (o = (r = game.modules.get(T)) == null ? void 0 : r.api) == null ? void 0 : o.cinematic;
      s != null && s.onPlaybackProgress ? (L(this, ti, s.onPlaybackProgress((l) => C(this, j, Kf).call(this, l))), console.log("[cinematic-editor] Subscribed to playback progress events")) : console.warn("[cinematic-editor] onPlaybackProgress not available on API", s);
    }
    if (f(this, ni) && ((a = this.element) == null || a.querySelectorAll(".cinematic-editor__segment-node").forEach((s) => {
      s.classList.toggle("cinematic-editor__segment-node--playing", s.dataset.segmentName === f(this, ni));
    }), f(this, lt) && f(this, lt).segmentName === f(this, G).activeSegmentName)) {
      const s = performance.now() - f(this, lt).startTime;
      f(this, lt).durationMs - s > 0 && C(this, j, Rl).call(this, f(this, lt).durationMs, f(this, lt).startTime);
    }
    f(this, Zt) || (L(this, Zt, (s) => {
      !s.ctrlKey && !s.metaKey || (s.key === "z" && !s.shiftKey ? (s.preventDefault(), C(this, j, Fl).call(this)) : (s.key === "z" && s.shiftKey || s.key === "y") && (s.preventDefault(), C(this, j, xl).call(this)));
    }), document.addEventListener("keydown", f(this, Zt)));
  }
  async close(n = {}) {
    if (f(this, je) && C(this, j, cn).call(this), f(this, Et) && !n.force) {
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
    return f(this, Qe) !== null && (clearTimeout(f(this, Qe)), L(this, Qe, null)), f(this, Zt) && (document.removeEventListener("keydown", f(this, Zt)), L(this, Zt, null)), (i = f(this, ti)) == null || i.call(this), L(this, ti, null), C(this, j, lr).call(this), super._onClose(n);
  }
};
qe = new WeakMap(), G = new WeakMap(), Ye = new WeakMap(), vn = new WeakMap(), Et = new WeakMap(), Qe = new WeakMap(), je = new WeakMap(), Ma = new WeakMap(), Me = new WeakMap(), Xe = new WeakMap(), Na = new WeakMap(), Zt = new WeakMap(), Ri = new WeakMap(), lt = new WeakMap(), ti = new WeakMap(), wn = new WeakMap(), ni = new WeakMap(), j = new WeakSet(), // ── Event binding ─────────────────────────────────────────────────────
Hf = /* @__PURE__ */ c(function() {
  const n = this.element;
  if (!(n instanceof HTMLElement)) return;
  const i = C(this, j, qf).call(this);
  By(n, i), Uy(n, i), Qy(n, i), Vy(n, i), zy(n, i), Ky(n, i), Jy(n, i), Yy(n, i), Xy(n, i);
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
      return f(n, vn);
    },
    get insertMenuState() {
      return f(n, Ri);
    },
    // Mutations
    mutate: /* @__PURE__ */ c((i) => C(this, j, ln).call(this, i), "mutate"),
    setSelectedPath: /* @__PURE__ */ c((i) => {
      L(this, Ye, i), this.render({ force: !0 });
    }, "setSelectedPath"),
    render: /* @__PURE__ */ c(() => this.render({ force: !0 }), "render"),
    // Cinematic switching (needs full state swap + clear)
    switchCinematic: /* @__PURE__ */ c((i) => {
      f(this, je) && C(this, j, cn).call(this), L(this, G, f(this, G).switchCinematic(i)), L(this, Ye, null), f(this, vn).clear(), this.render({ force: !0 });
    }, "switchCinematic"),
    // Segment management
    selectSegment: /* @__PURE__ */ c((i) => {
      f(this, je) && C(this, j, cn).call(this), L(this, G, f(this, G).switchSegment(i)), L(this, Ye, null), f(this, vn).clear(), this.render({ force: !0 });
    }, "selectSegment"),
    addSegment: /* @__PURE__ */ c((i) => {
      C(this, j, ln).call(this, (r) => r.addSegment(i, r.activeSegmentName));
    }, "addSegment"),
    removeSegment: /* @__PURE__ */ c((i) => {
      C(this, j, ln).call(this, (r) => r.removeSegment(i));
    }, "removeSegment"),
    renameSegment: /* @__PURE__ */ c((i, r) => {
      C(this, j, ln).call(this, (o) => o.renameSegment(i, r));
    }, "renameSegment"),
    setSegmentGate: /* @__PURE__ */ c((i) => {
      C(this, j, ln).call(this, (r) => r.setSegmentGate(i));
    }, "setSegmentGate"),
    setSegmentNext: /* @__PURE__ */ c((i) => {
      C(this, j, ln).call(this, (r) => r.setSegmentNext(i));
    }, "setSegmentNext"),
    // Tween debouncing
    queueTweenChange: /* @__PURE__ */ c((i, r) => C(this, j, Uf).call(this, i, r), "queueTweenChange"),
    flushTweenChanges: /* @__PURE__ */ c(() => {
      f(this, je) && C(this, j, cn).call(this);
    }, "flushTweenChanges"),
    flushTweenChangesImmediate: /* @__PURE__ */ c(() => {
      f(this, Qe) !== null && clearTimeout(f(this, Qe)), L(this, Qe, null), C(this, j, cn).call(this);
    }, "flushTweenChangesImmediate"),
    // Path utilities
    parseEntryPath: Mn,
    getEntryAtPath: /* @__PURE__ */ c((i) => Jo(i, f(this, G)), "getEntryAtPath"),
    // Insert menu
    showInsertMenu: /* @__PURE__ */ c((i, r, o) => C(this, j, jf).call(this, i, r, o), "showInsertMenu"),
    hideInsertMenu: /* @__PURE__ */ c(() => C(this, j, Bf).call(this), "hideInsertMenu"),
    // Toolbar actions
    save: /* @__PURE__ */ c(() => C(this, j, Pl).call(this), "save"),
    play: /* @__PURE__ */ c(() => C(this, j, Vf).call(this), "play"),
    resetTracking: /* @__PURE__ */ c(() => C(this, j, zf).call(this), "resetTracking"),
    exportJSON: /* @__PURE__ */ c(() => C(this, j, Gf).call(this), "exportJSON"),
    validate: /* @__PURE__ */ c(() => C(this, j, Wf).call(this), "validate"),
    importJSON: /* @__PURE__ */ c(() => qy({ state: f(this, G), mutate: /* @__PURE__ */ c((i) => C(this, j, ln).call(this, i), "mutate") }), "importJSON"),
    undo: /* @__PURE__ */ c(() => C(this, j, Fl).call(this), "undo"),
    redo: /* @__PURE__ */ c(() => C(this, j, xl).call(this), "redo")
  };
}, "#createEventContext"), // ── Insert menu ───────────────────────────────────────────────────────
jf = /* @__PURE__ */ c(function(n, i, r) {
  var l;
  const o = (l = this.element) == null ? void 0 : l.querySelector(".cinematic-editor__insert-menu");
  if (!o) return;
  const a = n.getBoundingClientRect();
  document.body.appendChild(o), o.style.display = "", o.style.position = "fixed", o.style.left = `${a.left}px`;
  const s = o.offsetHeight || 200;
  a.bottom + 4 + s > window.innerHeight ? o.style.top = `${a.top - s - 4}px` : o.style.top = `${a.bottom + 4}px`, L(this, Ri, { insertIndex: i, lane: r });
}, "#showInsertMenu"), Bf = /* @__PURE__ */ c(function() {
  var i, r;
  const n = document.body.querySelector(".cinematic-editor__insert-menu") ?? ((i = this.element) == null ? void 0 : i.querySelector(".cinematic-editor__insert-menu"));
  if (n) {
    n.style.display = "none";
    const o = (r = this.element) == null ? void 0 : r.querySelector(".cinematic-editor");
    o && n.parentNode !== o && o.appendChild(n);
  }
  L(this, Ri, null);
}, "#hideInsertMenu"), // ── State mutation ────────────────────────────────────────────────────
ln = /* @__PURE__ */ c(function(n) {
  L(this, Me, f(this, Me).slice(0, f(this, Xe) + 1)), f(this, Me).push(f(this, G)), f(this, Me).length > f(this, Na) && f(this, Me).shift(), L(this, Xe, f(this, Me).length - 1), L(this, G, n(f(this, G))), L(this, Et, !0), this.render({ force: !0 });
}, "#mutate"), $l = /* @__PURE__ */ c(function() {
  return f(this, Xe) >= 0;
}, "#canUndo"), Dl = /* @__PURE__ */ c(function() {
  return f(this, Xe) < f(this, Me).length - 1;
}, "#canRedo"), Fl = /* @__PURE__ */ c(function() {
  f(this, j, $l) && (f(this, Xe) === f(this, Me).length - 1 && f(this, Me).push(f(this, G)), L(this, G, f(this, Me)[f(this, Xe)]), Xa(this, Xe)._--, L(this, Et, !0), this.render({ force: !0 }));
}, "#undo"), xl = /* @__PURE__ */ c(function() {
  f(this, j, Dl) && (Xa(this, Xe)._++, L(this, G, f(this, Me)[f(this, Xe) + 1]), L(this, Et, !0), this.render({ force: !0 }));
}, "#redo"), Uf = /* @__PURE__ */ c(function(n, i) {
  var r;
  f(this, Ye) != null && (L(this, je, {
    ...f(this, je) ?? {},
    entryPath: f(this, Ye),
    tweenIndex: n,
    patch: { ...((r = f(this, je)) == null ? void 0 : r.patch) ?? {}, ...i }
  }), f(this, Qe) !== null && clearTimeout(f(this, Qe)), L(this, Qe, setTimeout(() => {
    L(this, Qe, null), C(this, j, cn).call(this);
  }, f(this, Ma))));
}, "#queueTweenChange"), cn = /* @__PURE__ */ c(function() {
  if (!f(this, je)) return;
  const { entryPath: n, tweenIndex: i, patch: r } = f(this, je);
  L(this, je, null);
  const o = Mn(n);
  if (o) {
    if (o.type === "timeline")
      L(this, G, f(this, G).updateTween(o.index, i, r));
    else if (o.type === "branch") {
      const a = Jo(n, f(this, G));
      if (a) {
        const s = (a.tweens ?? []).map((l, u) => u === i ? { ...l, ...r } : l);
        L(this, G, f(this, G).updateBranchEntry(o.index, o.branchIndex, o.branchEntryIndex, { tweens: s }));
      }
    }
    L(this, Et, !0);
  }
}, "#flushTweenChanges"), Pl = /* @__PURE__ */ c(async function() {
  var n, i, r, o, a, s;
  if (f(this, qe)) {
    if (f(this, je) && C(this, j, cn).call(this), f(this, G).isStale(f(this, qe))) {
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
        L(this, G, Rt.fromScene(f(this, qe), f(this, G).activeCinematicName)), L(this, Et, !1), L(this, Me, []), L(this, Xe, -1), this.render({ force: !0 }), (i = (n = ui.notifications) == null ? void 0 : n.info) == null || i.call(n, "Cinematic reloaded from scene.");
        return;
      }
      if (!l) return;
    }
    try {
      await f(this, G).save(f(this, qe)), L(this, G, Rt.fromScene(f(this, qe), f(this, G).activeCinematicName)), L(this, Et, !1), (o = (r = ui.notifications) == null ? void 0 : r.info) == null || o.call(r, "Cinematic saved."), this.render({ force: !0 });
    } catch (l) {
      console.error(`${T} | Cinematic save failed`, l), (s = (a = ui.notifications) == null ? void 0 : a.error) == null || s.call(a, "Failed to save cinematic data.");
    }
  }
}, "#onSave"), Vf = /* @__PURE__ */ c(async function() {
  var i, r, o, a, s;
  const n = (r = (i = game.modules.get(T)) == null ? void 0 : i.api) == null ? void 0 : r.cinematic;
  if (!(n != null && n.play)) {
    (a = (o = ui.notifications) == null ? void 0 : o.warn) == null || a.call(o, "Cinematic API not available.");
    return;
  }
  await n.play((s = f(this, qe)) == null ? void 0 : s.id, f(this, G).activeCinematicName);
}, "#onPlay"), zf = /* @__PURE__ */ c(async function() {
  var i, r, o, a, s;
  const n = (r = (i = game.modules.get(T)) == null ? void 0 : i.api) == null ? void 0 : r.cinematic;
  n != null && n.reset && (await n.reset((o = f(this, qe)) == null ? void 0 : o.id, f(this, G).activeCinematicName), (s = (a = ui.notifications) == null ? void 0 : a.info) == null || s.call(a, "Cinematic tracking reset."));
}, "#onResetTracking"), Gf = /* @__PURE__ */ c(async function() {
  var i, r;
  const n = JSON.stringify(f(this, G).toJSON(), null, 2);
  try {
    await navigator.clipboard.writeText(n), (r = (i = ui.notifications) == null ? void 0 : i.info) == null || r.call(i, "Cinematic JSON copied to clipboard.");
  } catch {
    new Dialog({
      title: "Cinematic JSON",
      content: `<textarea style="width:100%;height:300px;font-family:monospace;font-size:0.8rem">${It(n)}</textarea>`,
      buttons: { ok: { label: "Close" } }
    }).render(!0);
  }
}, "#onExportJSON"), Wf = /* @__PURE__ */ c(function() {
  var l, u;
  const n = f(this, G).toJSON(), { targets: i, unresolved: r } = Ko(n), o = yy(n, i), a = [
    ...r.map((d) => ({ path: "targets", level: "warn", message: `Unresolved target: "${d}"` })),
    ...o
  ];
  if (a.length === 0) {
    (u = (l = ui.notifications) == null ? void 0 : l.info) == null || u.call(l, "Cinematic validation passed — no issues found.");
    return;
  }
  const s = a.map((d) => {
    const m = d.level === "error" ? "fa-circle-xmark" : "fa-triangle-exclamation", g = d.level === "error" ? "#e74c3c" : "#f39c12";
    return `<li style="margin:0.3rem 0"><i class="fa-solid ${m}" style="color:${g};margin-right:0.3rem"></i><strong>${It(d.path)}</strong>: ${It(d.message)}</li>`;
  });
  new Dialog({
    title: "Cinematic Validation",
    content: `<p>${a.length} issue(s) found:</p><ul style="list-style:none;padding:0;max-height:300px;overflow:auto">${s.join("")}</ul>`,
    buttons: { ok: { label: "Close" } }
  }).render(!0);
}, "#onValidate"), // ── Playback progress ────────────────────────────────────────────────
Kf = /* @__PURE__ */ c(function(n) {
  var i, r, o, a, s, l;
  switch (console.log(`[cinematic-editor] playback event: ${n.type}`, n), n.type) {
    case "segment-start":
      L(this, ni, n.segmentName), n.segmentName !== f(this, G).activeSegmentName ? (L(this, G, f(this, G).switchSegment(n.segmentName)), L(this, Ye, null), f(this, vn).clear(), this.render({ force: !0 })) : (i = this.element) == null || i.querySelectorAll(".cinematic-editor__segment-node").forEach((u) => {
        u.classList.toggle("cinematic-editor__segment-node--playing", u.dataset.segmentName === n.segmentName);
      });
      break;
    case "gate-wait":
      (o = (r = this.element) == null ? void 0 : r.querySelector(`.cinematic-editor__segment-node[data-segment-name="${CSS.escape(n.segmentName)}"]`)) == null || o.classList.add("cinematic-editor__segment-node--gate-waiting");
      break;
    case "gate-resolved":
      (s = (a = this.element) == null ? void 0 : a.querySelector(`.cinematic-editor__segment-node[data-segment-name="${CSS.escape(n.segmentName)}"]`)) == null || s.classList.remove("cinematic-editor__segment-node--gate-waiting");
      break;
    case "timeline-start":
      L(this, lt, { segmentName: n.segmentName, startTime: performance.now(), durationMs: n.durationMs }), n.segmentName === f(this, G).activeSegmentName && C(this, j, Rl).call(this, n.durationMs);
      break;
    case "timeline-end":
      C(this, j, lr).call(this), L(this, lt, null);
      break;
    case "playback-end":
      C(this, j, lr).call(this), L(this, lt, null), L(this, ni, null), (l = this.element) == null || l.querySelectorAll(".cinematic-editor__segment-node--playing, .cinematic-editor__segment-node--gate-waiting").forEach((u) => {
        u.classList.remove("cinematic-editor__segment-node--playing", "cinematic-editor__segment-node--gate-waiting");
      });
      break;
  }
}, "#onPlaybackEvent"), Rl = /* @__PURE__ */ c(function(n, i = null) {
  var u, d;
  C(this, j, lr).call(this);
  const r = (u = this.element) == null ? void 0 : u.querySelector(".cinematic-editor__playback-cursor"), o = (d = this.element) == null ? void 0 : d.querySelector(".cinematic-editor__swimlane");
  if (console.log(`[cinematic-editor] startCursor: duration=${n}, cursor=${!!r}, swimlane=${!!o}, width=${o == null ? void 0 : o.scrollWidth}`), !r || !o || n <= 0) return;
  r.style.display = "block";
  const a = i ?? performance.now(), s = o.scrollWidth, l = /* @__PURE__ */ c(() => {
    const m = performance.now() - a, g = Math.min(m / n, 1), y = Er + g * (s - Er);
    r.style.left = `${y}px`, g < 1 && L(this, wn, requestAnimationFrame(l));
  }, "tick");
  L(this, wn, requestAnimationFrame(l));
}, "#startCursorAnimation"), lr = /* @__PURE__ */ c(function() {
  var i;
  f(this, wn) && (cancelAnimationFrame(f(this, wn)), L(this, wn, null));
  const n = (i = this.element) == null ? void 0 : i.querySelector(".cinematic-editor__playback-cursor");
  n && (n.style.display = "none");
}, "#stopCursorAnimation"), c(yt, "CinematicEditorApplication"), pe(yt, "APP_ID", `${T}-cinematic-editor`), pe(yt, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  $e(yt, yt, "DEFAULT_OPTIONS"),
  {
    id: yt.APP_ID,
    classes: Array.from(
      /* @__PURE__ */ new Set([...((Hu = $e(yt, yt, "DEFAULT_OPTIONS")) == null ? void 0 : Hu.classes) ?? [], "eidolon-cinematic-editor-window", "themed"])
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
)), pe(yt, "PARTS", {
  content: {
    template: `modules/${T}/templates/cinematic-editor.html`
  }
});
let _l = yt;
const Jf = /* @__PURE__ */ new Map();
function Ji(e, t) {
  Jf.set(e, t);
}
c(Ji, "registerBehaviour");
function Yf(e) {
  return Jf.get(e);
}
c(Yf, "getBehaviour");
Ji("float", (e, t = {}) => {
  const n = e.mesh;
  if (!n) return { update() {
  }, detach() {
  } };
  const i = t.speed ?? 0.04, r = t.amplitude ?? 3, o = n.position.y;
  let a = 0;
  return {
    update(s) {
      a += s, n.position.y = o + Math.sin(a * i) * r;
    },
    detach() {
      n.position.y = o;
    }
  };
});
Ji("pulse", (e, t = {}) => {
  const n = e.mesh;
  if (!n) return { update() {
  }, detach() {
  } };
  const i = t.minAlpha ?? 0.6, r = t.maxAlpha ?? 1, o = t.speed ?? 0.05, a = n.alpha;
  let s = Math.PI / 2;
  return {
    update(l) {
      s += l * o;
      const u = (Math.sin(s) + 1) / 2;
      n.alpha = i + (r - i) * u;
    },
    detach() {
      n.alpha = a;
    }
  };
});
Ji("scale", (e, t = {}) => {
  const n = e.mesh;
  if (!n) return { update() {
  }, detach() {
  } };
  const i = t.factor ?? 1.12, r = t.durationFrames ?? 15, o = pi(t.easing ?? "easeOutCubic"), a = n.scale.x, s = n.scale.y, l = a * i, u = s * i;
  let d = 0;
  return {
    update(m) {
      if (d < r) {
        d += m;
        const g = Math.min(d / r, 1), y = o(g);
        n.scale.x = a + (l - a) * y, n.scale.y = s + (u - s) * y;
      }
    },
    detach() {
      n.scale.x = a, n.scale.y = s;
    }
  };
});
Ji("glow", (e, t = {}) => {
  var h, p;
  const n = e.mesh;
  if (!((h = n == null ? void 0 : n.texture) != null && h.baseTexture)) return { update() {
  }, detach() {
  } };
  const i = e.document, r = t.color ?? 4513279, o = t.alpha ?? 0.5, a = t.blur ?? 8, s = t.pulseSpeed ?? 0.03, l = Math.abs(i.width), u = Math.abs(i.height), d = PIXI.Sprite.from(n.texture);
  d.anchor.set(0.5, 0.5), d.width = l, d.height = u, d.position.set(l / 2, u / 2), d.angle = i.rotation ?? 0, d.alpha = o, d.tint = r;
  const m = PIXI.BlurFilter ?? ((p = PIXI.filters) == null ? void 0 : p.BlurFilter), g = new m(a);
  d.filters = [g], e.addChildAt(d, 0);
  let y = 0;
  return {
    update(w) {
      y += w;
      const b = (Math.sin(y * s) + 1) / 2;
      d.alpha = o * (0.5 + 0.5 * b);
    },
    detach() {
      d.parent && d.parent.removeChild(d), d.destroy({ children: !0 });
    }
  };
});
Ji("none", () => ({ update() {
}, detach() {
} }));
const co = {
  idle: ["float", "glow"],
  hover: ["scale"],
  dim: ["none"]
};
function Zy(e) {
  if (!e) return { ...co };
  const t = /* @__PURE__ */ c((n, i) => n === void 0 ? i : typeof n == "string" ? [n] : typeof n == "object" && !Array.isArray(n) && n.name ? [n] : Array.isArray(n) ? n : i, "normalize");
  return {
    idle: t(e.idle, co.idle),
    hover: t(e.hover, co.hover),
    dim: t(e.dim, co.dim)
  };
}
c(Zy, "normalizeConfig");
var Ur, Hi, qi, ii, En, _n, Hl, ql;
const Tc = class Tc {
  /**
   * @param {PlaceableObject} placeable
   * @param {object|undefined} animationConfig  Raw animation config from the await entry
   */
  constructor(t, n) {
    A(this, _n);
    A(this, Ur);
    A(this, Hi);
    A(this, qi, null);
    A(this, ii, []);
    A(this, En, null);
    L(this, Ur, t), L(this, Hi, Zy(n));
  }
  /** Current animation state name. */
  get state() {
    return f(this, qi);
  }
  /**
   * Start animating in the given state.
   * @param {string} [state="idle"]
   */
  start(t = "idle") {
    C(this, _n, Hl).call(this, t), L(this, En, (n) => {
      for (const i of f(this, ii)) i.update(n);
    }), canvas.app.ticker.add(f(this, En));
  }
  /**
   * Transition to a new state. Detaches current behaviours, attaches new ones.
   * No-op if already in the requested state.
   * @param {string} state
   */
  setState(t) {
    t !== f(this, qi) && (C(this, _n, ql).call(this), C(this, _n, Hl).call(this, t));
  }
  /**
   * Full cleanup — detach all behaviours and remove ticker.
   */
  detach() {
    var t, n;
    C(this, _n, ql).call(this), f(this, En) && ((n = (t = canvas.app) == null ? void 0 : t.ticker) == null || n.remove(f(this, En)), L(this, En, null));
  }
};
Ur = new WeakMap(), Hi = new WeakMap(), qi = new WeakMap(), ii = new WeakMap(), En = new WeakMap(), _n = new WeakSet(), // ── Private ──────────────────────────────────────────────────────────
Hl = /* @__PURE__ */ c(function(t) {
  L(this, qi, t);
  const n = f(this, Hi)[t] ?? f(this, Hi).idle ?? ["none"];
  for (const i of n) {
    const r = typeof i == "string" ? i : i.name, o = typeof i == "string" ? void 0 : i, a = Yf(r);
    if (!a) {
      console.warn(`TileAnimator: unknown behaviour "${r}"`);
      continue;
    }
    f(this, ii).push(a(f(this, Ur), o));
  }
}, "#attachBehaviours"), ql = /* @__PURE__ */ c(function() {
  for (const t of f(this, ii)) t.detach();
  L(this, ii, []);
}, "#detachBehaviours"), c(Tc, "TileAnimator");
let zi = Tc;
const eb = "cinematic", ps = 5, jl = /* @__PURE__ */ new Set();
function zt(e) {
  for (const t of jl)
    try {
      t(e);
    } catch (n) {
      console.error("[cinematic] playback listener error:", n);
    }
}
c(zt, "emitPlaybackEvent");
function tb(e) {
  return jl.add(e), () => jl.delete(e);
}
c(tb, "onPlaybackProgress");
let ve = null, Yt = null, fr = null, mr = null, wi = 0, Bn = null;
function mc(e, t = "default") {
  return `cinematic-progress-${e}-${t}`;
}
c(mc, "progressFlagKey");
function nb(e, t, n, i) {
  game.user.setFlag(T, mc(e, t), {
    currentSegment: n,
    completedSegments: [...i],
    timestamp: Date.now()
  }).catch(() => {
  });
}
c(nb, "saveSegmentProgress");
function Bl(e, t = "default") {
  game.user.unsetFlag(T, mc(e, t)).catch(() => {
  });
}
c(Bl, "clearProgress");
function Qf(e, t = "default", n = 3e5) {
  const i = game.user.getFlag(T, mc(e, t));
  return !i || typeof i.timestamp != "number" || Date.now() - i.timestamp > n ? null : i.currentSegment ? i : null;
}
c(Qf, "getSavedProgress");
function mi(e, t = "default") {
  return `cinematic-seen-${e}-${t}`;
}
c(mi, "seenFlagKey");
function bu(e, t = "default") {
  return !!game.user.getFlag(T, mi(e, t));
}
c(bu, "hasSeenCinematic");
function ib(e, t) {
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
      (n = r.timeline) != null && n.length && (r.timeline = r.timeline.filter((o, a) => !o || typeof o != "object" || Array.isArray(o) ? (console.warn(`[${T}] Cinematic: segment "${i}" timeline[${a}] on ${t} is not a valid object, removing.`), !1) : !0));
    }
    if (Object.keys(e.segments).length === 0)
      return console.warn(`[${T}] Cinematic: no valid segments on ${t}. Ignoring.`), null;
  }
  return e.timeline !== void 0 && !Array.isArray(e.timeline) ? (console.warn(`[${T}] Cinematic: invalid 'timeline' on ${t} (expected array). Ignoring.`), null) : e;
}
c(ib, "validateSingleCinematic");
function Ja(e) {
  const t = e ? game.scenes.get(e) : canvas.scene;
  let n = (t == null ? void 0 : t.getFlag(T, eb)) ?? null;
  if (n == null) return null;
  if (typeof n != "object" || Array.isArray(n))
    return console.warn(`[${T}] Cinematic: invalid flag data on scene ${t == null ? void 0 : t.id} (expected object). Ignoring.`), null;
  if ((n.version ?? 1) < 3) {
    const { version: i, ...r } = n;
    n = { version: 3, cinematics: { default: r } };
  }
  if (n.version === 3) {
    for (const [i, r] of Object.entries(n.cinematics ?? {}))
      n.cinematics[i] = Rt.migrateV3toV4(r);
    n.version = 4;
  }
  if (n.version === 4) {
    for (const [i, r] of Object.entries(n.cinematics ?? {}))
      n.cinematics[i] = Rt.migrateV4toV5(r);
    n.version = ps;
  }
  if (n.version > ps)
    return console.warn(`[${T}] Cinematic: scene ${t == null ? void 0 : t.id} has version ${n.version}, runtime supports up to ${ps}. Skipping.`), null;
  if (!n.cinematics || typeof n.cinematics != "object")
    return console.warn(`[${T}] Cinematic: no 'cinematics' map on scene ${t == null ? void 0 : t.id}. Ignoring.`), null;
  for (const [i, r] of Object.entries(n.cinematics)) {
    const o = ib(r, `scene ${t == null ? void 0 : t.id} cinematic "${i}"`);
    o ? n.cinematics[i] = o : delete n.cinematics[i];
  }
  return Object.keys(n.cinematics).length === 0 ? null : n;
}
c(Ja, "getCinematicData");
function ta(e, t = "default") {
  var i;
  const n = Ja(e);
  return ((i = n == null ? void 0 : n.cinematics) == null ? void 0 : i[t]) ?? null;
}
c(ta, "getNamedCinematic");
function rb(e) {
  const t = Ja(e);
  return t ? Object.keys(t.cinematics) : [];
}
c(rb, "listCinematicNames");
function ob() {
  return game.ready ? Promise.resolve() : new Promise((e) => Hooks.once("ready", e));
}
c(ob, "waitForReady");
async function ab(e = 1e4) {
  var n, i;
  const t = (i = (n = game.modules.get(T)) == null ? void 0 : n.api) == null ? void 0 : i.tween;
  return t != null && t.Timeline ? t.Timeline : new Promise((r) => {
    const o = Date.now(), a = setTimeout(() => {
      var l, u;
      (u = (l = ui.notifications) == null ? void 0 : l.info) == null || u.call(l, `[${T}] Cinematic: waiting for tween engine...`);
    }, 2e3), s = setInterval(() => {
      var u, d, m, g;
      const l = (d = (u = game.modules.get(T)) == null ? void 0 : u.api) == null ? void 0 : d.tween;
      l != null && l.Timeline ? (clearInterval(s), clearTimeout(a), r(l.Timeline)) : Date.now() - o > e && (clearInterval(s), clearTimeout(a), console.warn(`[${T}] Cinematic: tween API not available after ${e}ms.`), (g = (m = ui.notifications) == null ? void 0 : m.warn) == null || g.call(m, `[${T}] Cinematic: tween engine unavailable — cinematic cannot play.`), r(null));
    }, 200);
  });
}
c(ab, "waitForTweenAPI");
async function Ul(e = 5e3) {
  var t;
  return window.Tagger ?? ((t = game.modules.get("tagger")) == null ? void 0 : t.api) ? !0 : new Promise((n) => {
    const i = Date.now(), r = setInterval(() => {
      var o;
      window.Tagger ?? ((o = game.modules.get("tagger")) == null ? void 0 : o.api) ? (clearInterval(r), n(!0)) : Date.now() - i > e && (clearInterval(r), console.warn(`[${T}] Cinematic: Tagger API not available after ${e}ms.`), n(!1));
    }, 200);
  });
}
c(Ul, "waitForTagger");
async function sb(e, t, n) {
  if (!e || !e.event) return;
  const i = { ...e };
  console.log(`[${T}] Cinematic: waiting for gate: ${e.event}`);
  let r = null;
  if (e.event === "tile-click" && e.target && e.animation) {
    const o = t.get(e.target);
    (o == null ? void 0 : o.kind) === "placeable" && o.placeable && (r = new zi(o.placeable, e.animation), r.start());
  }
  try {
    if (e.timeout && e.timeout > 0) {
      const o = new Promise((s) => setTimeout(s, e.timeout)), a = vl(i, { signal: n.signal, eventBus: null });
      await Promise.race([a, o]);
    } else
      await vl(i, { signal: n.signal, eventBus: null });
  } finally {
    r && r.detach();
  }
}
c(sb, "processGate");
function Xf(e) {
  if (!e.segments) return [];
  const t = [], n = /* @__PURE__ */ new Set();
  let i = e.entry;
  for (; i && typeof i == "string" && e.segments[i] && !n.has(i); )
    n.add(i), t.push(i), i = e.segments[i].next;
  return t;
}
c(Xf, "getSegmentOrder");
function na(e, t) {
  const n = Xf(e);
  for (const i of n) {
    const r = e.segments[i];
    if (r.setup)
      try {
        Ve(r.setup, t);
      } catch (o) {
        console.warn(`[${T}] Cinematic: error applying setup for segment "${i}":`, o);
      }
    if (r.landing)
      try {
        Ve(r.landing, t);
      } catch (o) {
        console.warn(`[${T}] Cinematic: error applying landing for segment "${i}":`, o);
      }
  }
  canvas.perception.update({ refreshLighting: !0, refreshVision: !0 });
}
c(na, "applyAllSegmentLandingStates");
async function gr(e, t = "default", n = null) {
  var v, S, I, O, k, M, x, R;
  const i = e ?? ((v = canvas.scene) == null ? void 0 : v.id);
  if (!i) return;
  const r = `${i}:${t}`;
  if (n || (n = /* @__PURE__ */ new Set()), n.has(r)) {
    console.warn(`[${T}] Cinematic: circular transition detected at "${r}". Stopping chain.`), (I = (S = ui.notifications) == null ? void 0 : S.warn) == null || I.call(S, "Cinematic: circular transition detected, stopping.");
    return;
  }
  n.add(r), (ve == null ? void 0 : ve.status) === "running" && ve.cancel("replaced"), ve = null, Yt && (Yt.abort("replaced"), Yt = null);
  const o = ta(i, t);
  if (!o) {
    console.warn(`[${T}] Cinematic: no cinematic "${t}" on scene ${i}.`);
    return;
  }
  const a = await ab();
  if (!a || ((O = canvas.scene) == null ? void 0 : O.id) !== i || (await Ul(), ((k = canvas.scene) == null ? void 0 : k.id) !== i)) return;
  const { targets: s, unresolved: l } = Ko(o);
  if (console.log(`[${T}] Cinematic "${t}": resolved ${s.size} targets`), l.length && console.warn(`[${T}] Cinematic "${t}": skipping ${l.length} unresolved: ${l.join(", ")}`), s.size === 0) {
    console.warn(`[${T}] Cinematic "${t}": no targets could be resolved on scene ${i}.`);
    return;
  }
  const u = cy(o);
  fr = ly(u, s), mr = s;
  const d = Qf(i, t), m = new AbortController();
  Yt = m;
  const g = o.synchronized === !0 && game.user.isGM, y = Xf(o);
  if (y.length === 0) {
    console.warn(`[${T}] Cinematic "${t}": no segments to execute.`);
    return;
  }
  let h = 0;
  const p = /* @__PURE__ */ new Set();
  if (d) {
    const F = d.completedSegments ?? [];
    for (const _ of F) p.add(_);
    const D = y.indexOf(d.currentSegment);
    D >= 0 && (h = D, console.log(`[${T}] Cinematic "${t}": resuming from segment "${d.currentSegment}" (${F.length} completed)`));
  }
  for (let F = 0; F < h; F++) {
    const D = y[F], _ = o.segments[D];
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
  let w = !1, b = !1;
  zt({ type: "playback-start", sceneName: ((M = canvas.scene) == null ? void 0 : M.name) ?? i });
  try {
    for (let F = h; F < y.length; F++) {
      if (m.signal.aborted) {
        w = !0;
        break;
      }
      if (((x = canvas.scene) == null ? void 0 : x.id) !== i) {
        w = !0;
        break;
      }
      const D = y[F], _ = o.segments[D];
      if (console.log(`[${T}] Cinematic "${t}": entering segment "${D}"`), zt({ type: "segment-start", segmentName: D }), nb(i, t, D, [...p]), _.gate) {
        zt({ type: "gate-wait", segmentName: D, gate: _.gate });
        try {
          await sb(_.gate, s, m);
        } catch (B) {
          if (m.signal.aborted) {
            w = !0;
            break;
          }
          throw B;
        }
        zt({ type: "gate-resolved", segmentName: D });
      }
      if (m.signal.aborted) {
        w = !0;
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
        zt({ type: "timeline-start", segmentName: D, durationMs: B });
        const { tl: W } = py(
          { setup: {}, timeline: _.timeline },
          s,
          a,
          {
            timelineName: `cinematic-${i}-${t}-${D}`,
            onStepComplete: /* @__PURE__ */ c((U) => {
              zt({ type: "step-complete", segmentName: D, stepIndex: U });
            }, "onStepComplete")
          }
        );
        ve = W.run({
          broadcast: g,
          commit: g
        });
        try {
          await new Promise((U, J) => {
            W.onComplete(() => U()), W.onCancel(() => J(new Error("cancelled"))), W.onError((X) => J(new Error(`timeline error: ${X}`)));
            const oe = /* @__PURE__ */ c(() => J(new Error("cancelled")), "onAbort");
            m.signal.addEventListener("abort", oe, { once: !0 });
          });
        } catch (U) {
          if (U.message === "cancelled" || m.signal.aborted) {
            w = !0;
            break;
          }
          throw U;
        }
        zt({ type: "timeline-end", segmentName: D });
      }
      if (m.signal.aborted) {
        w = !0;
        break;
      }
      if (_.landing)
        try {
          Ve(_.landing, s), canvas.perception.update({ refreshLighting: !0, refreshVision: !0 });
        } catch (B) {
          console.error(`[${T}] Cinematic "${t}": error applying landing for segment "${D}":`, B);
        }
      zt({ type: "segment-complete", segmentName: D }), p.add(D);
      const H = _.next;
      if (H && typeof H == "object" && H.scene) {
        const B = H.scene, W = H.segment ?? o.entry;
        console.log(`[${T}] Cinematic "${t}": cross-scene transition to scene ${B}, segment "${W}"`), ve = null, Yt = null, Bl(i, t), au(), o.tracking !== !1 && await game.user.setFlag(T, mi(i, t), !0), Bn = { sceneId: B, cinematicName: t, visitedChain: n };
        const q = game.scenes.get(B);
        q ? q.view() : (console.warn(`[${T}] Cinematic: cross-scene transition target scene "${B}" not found.`), Bn = null);
        return;
      }
    }
  } catch (F) {
    b = !0, console.error(`[${T}] Cinematic "${t}" error on scene ${i}:`, F);
  }
  if (ve = null, Yt = null, Bl(i, t), au(), fr = null, mr = null, zt({ type: "playback-end", cancelled: !!w }), w) {
    console.log(`[${T}] Cinematic "${t}" cancelled on scene ${i}.`), na(o, s);
    return;
  }
  if (b) {
    na(o, s);
    return;
  }
  o.tracking !== !1 && await game.user.setFlag(T, mi(i, t), !0), console.log(`[${T}] Cinematic "${t}" complete on scene ${i}.`);
}
c(gr, "playCinematic");
async function lb(e, t = "default") {
  var i;
  const n = e ?? ((i = canvas.scene) == null ? void 0 : i.id);
  n && (await game.user.unsetFlag(T, mi(n, t)), console.log(`[${T}] Cinematic: cleared seen flag for "${t}" on scene ${n}.`));
}
c(lb, "resetCinematic");
async function cb(e, t, n = "default") {
  var o;
  if (!game.user.isGM) return;
  const i = e ?? ((o = canvas.scene) == null ? void 0 : o.id);
  if (!i || !t) return;
  const r = game.users.get(t);
  r && (await r.unsetFlag(T, mi(i, n)), console.log(`[${T}] Cinematic: cleared seen flag for user ${r.name} on "${n}" scene ${i}.`));
}
c(cb, "resetCinematicForUser");
async function ub(e, t = "default") {
  var o;
  if (!game.user.isGM) return;
  const n = e ?? ((o = canvas.scene) == null ? void 0 : o.id);
  if (!n) return;
  const i = mi(n, t), r = game.users.map((a) => a.getFlag(T, i) ? a.unsetFlag(T, i) : Promise.resolve());
  await Promise.all(r), console.log(`[${T}] Cinematic: cleared seen flag for all users on "${t}" scene ${n}.`);
}
c(ub, "resetCinematicForAll");
function db(e, t = "default") {
  var r;
  const n = e ?? ((r = canvas.scene) == null ? void 0 : r.id);
  if (!n) return [];
  const i = mi(n, t);
  return game.users.map((o) => ({
    userId: o.id,
    name: o.name,
    color: o.color ?? "#888888",
    isGM: o.isGM,
    seen: !!o.getFlag(T, i)
  }));
}
c(db, "getSeenStatus");
function fb(e, t) {
  var i;
  const n = e ?? ((i = canvas.scene) == null ? void 0 : i.id);
  return t ? ta(n, t) != null : Ja(n) != null;
}
c(fb, "hasCinematic");
function mb() {
  if (!fr || !mr) {
    console.warn(`[${T}] Cinematic: no snapshot available for revert.`);
    return;
  }
  (ve == null ? void 0 : ve.status) === "running" && ve.cancel("reverted"), ve = null, Yt && (Yt.abort("reverted"), Yt = null);
  try {
    Ve(fr, mr), canvas.perception.update({ refreshLighting: !0, refreshVision: !0 }), console.log(`[${T}] Cinematic: reverted to pre-cinematic state.`);
  } catch (e) {
    console.error(`[${T}] Cinematic: error during revert:`, e);
  }
  fr = null, mr = null;
}
c(mb, "revertCinematic");
async function gb() {
  const e = ++wi;
  if (console.log(`[${T}] Cinematic: canvasReady fired, gen=${e}, game.ready=${game.ready}`), await ob(), e !== wi) return;
  console.log(`[${T}] Cinematic: game is ready`);
  const t = canvas.scene;
  if (!t) {
    console.log(`[${T}] Cinematic: no canvas.scene, exiting`);
    return;
  }
  if (Bn && Bn.sceneId === t.id) {
    const o = Bn;
    Bn = null, console.log(`[${T}] Cinematic: picking up pending transition to "${o.cinematicName}" on scene ${t.id}`);
    try {
      await gr(t.id, o.cinematicName, o.visitedChain);
    } catch (a) {
      console.error(`[${T}] Cinematic: error during pending transition playback on scene ${t.id}:`, a);
    }
    return;
  }
  Bn = null;
  const n = Ja(t.id);
  if (!n) {
    console.log(`[${T}] Cinematic: no cinematic flag on scene ${t.id}, exiting`);
    return;
  }
  console.log(`[${T}] Cinematic: found ${Object.keys(n.cinematics).length} cinematic(s) on scene ${t.id}`);
  const i = [];
  for (const [o, a] of Object.entries(n.cinematics))
    (!a.trigger || a.trigger === "canvasReady") && i.push({ name: o, data: a });
  if (i.length === 0) {
    console.log(`[${T}] Cinematic: no canvasReady cinematics on scene ${t.id}, exiting`);
    return;
  }
  for (const { name: o } of i) {
    const a = Qf(t.id, o);
    if (e !== wi) return;
    if (a) {
      console.log(`[${T}] Cinematic "${o}": found saved progress at segment "${a.currentSegment}", resuming...`);
      try {
        await gr(t.id, o);
      } catch (s) {
        console.error(`[${T}] Cinematic "${o}": error during resumed playback on scene ${t.id}:`, s);
      }
      return;
    }
  }
  let r = null;
  for (const { name: o, data: a } of i)
    if (!(a.tracking !== !1 && bu(t.id, o))) {
      r = { name: o, data: a };
      break;
    }
  if (!r) {
    if (console.log(`[${T}] Cinematic: all canvasReady cinematics already seen on scene ${t.id}`), hb(t.id, i), (ve == null ? void 0 : ve.status) === "running" && ve.cancel("already-seen"), ve = null, await Ul(), e !== wi) return;
    for (const { name: o, data: a } of i)
      try {
        const { targets: s } = Ko(a);
        na(a, s);
      } catch (s) {
        console.error(`[${T}] Cinematic "${o}": error applying landing states (already seen) on scene ${t.id}:`, s);
      }
    canvas.perception.update({ refreshLighting: !0, refreshVision: !0 });
    return;
  }
  if (e === wi && (console.log(`[${T}] Cinematic: playing first unseen cinematic "${r.name}"...`), await Ul(), e === wi)) {
    for (const { name: o, data: a } of i) {
      if (o === r.name) continue;
      if (a.tracking !== !1 && bu(t.id, o))
        try {
          const { targets: l } = Ko(a);
          na(a, l);
        } catch (l) {
          console.error(`[${T}] Cinematic "${o}": error applying landing states (already seen) on scene ${t.id}:`, l);
        }
    }
    try {
      await gr(t.id, r.name);
    } catch (o) {
      console.error(`[${T}] Cinematic "${r.name}": error during playback on scene ${t.id}:`, o);
    }
  }
}
c(gb, "onCanvasReady$2");
function hb(e, t) {
  for (const { name: n } of t)
    Bl(e, n);
}
c(hb, "clearAllCanvasReadyProgress");
function pb(e = 3e5) {
  var i;
  const t = (i = game.user.flags) == null ? void 0 : i[T];
  if (!t) return;
  const n = Date.now();
  for (const r of Object.keys(t)) {
    if (!r.startsWith("cinematic-progress-")) continue;
    const o = t[r];
    if (!o || typeof o.timestamp != "number") {
      game.user.unsetFlag(T, r).catch(() => {
      });
      continue;
    }
    n - o.timestamp > e && (console.log(`[${T}] Cinematic: cleaning up stale progress flag "${r}" (age: ${n - o.timestamp}ms)`), game.user.unsetFlag(T, r).catch(() => {
    }));
  }
}
c(pb, "cleanupStaleProgressFlags");
function yb() {
  Hooks.on("getSceneControlButtons", (e) => {
    if (!game.user.isGM) return;
    const t = Array.isArray(e) ? e : e instanceof Map ? Array.from(e.values()) : Object.values(e);
    if (!t.length) return;
    const n = t.find((a) => (a == null ? void 0 : a.name) === "tiles") ?? t.find((a) => (a == null ? void 0 : a.name) === "tokens" || (a == null ? void 0 : a.name) === "token") ?? t[0];
    if (!n) return;
    const i = n.tools, r = "eidolonCinematicEditor";
    if (Array.isArray(i) && i.some((a) => (a == null ? void 0 : a.name) === r) || i instanceof Map && i.has(r)) return;
    const o = {
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
    Array.isArray(i) ? i.push(o) : i instanceof Map ? i.set(r, o) : i && typeof i == "object" ? i[r] = o : n.tools = [o];
  });
}
c(yb, "registerEditorButton");
function bb() {
  Hooks.on("canvasReady", gb), yb(), Hooks.once("ready", () => {
    pb();
    const e = game.modules.get(T);
    e.api || (e.api = {}), e.api.cinematic = {
      play: gr,
      reset: lb,
      resetForUser: cb,
      resetForAll: ub,
      getSeenStatus: db,
      has: fb,
      get: ta,
      list: rb,
      revert: mb,
      onPlaybackProgress: tb,
      TileAnimator: zi,
      registerBehaviour: Ji,
      getBehaviour: Yf,
      trigger: /* @__PURE__ */ c(async (t, n, i = "default") => {
        var a;
        const r = n ?? ((a = canvas.scene) == null ? void 0 : a.id);
        if (!r) return;
        const o = ta(r, i);
        o && (o.trigger && o.trigger !== t || await gr(r, i));
      }, "trigger")
    }, console.log(`[${T}] Cinematic API registered (v5).`);
  });
}
c(bb, "registerCinematicHooks");
function Vl(e, t) {
  const n = Math.abs(e.width), i = Math.abs(e.height), r = n / 2, o = i / 2;
  let a = t.x - (e.x + r), s = t.y - (e.y + o);
  if (e.rotation !== 0) {
    const l = Math.toRadians(e.rotation), u = Math.cos(l), d = Math.sin(l), m = u * a + d * s, g = u * s - d * a;
    a = m, s = g;
  }
  return a += r, s += o, a >= 0 && a <= n && s >= 0 && s <= i;
}
c(Vl, "pointWithinTile");
za("tile-click", (e, t) => e.target ? new Promise((n, i) => {
  var y;
  if (t.signal.aborted) return i(t.signal.reason ?? "aborted");
  const r = Wa(e.target);
  if (!((y = r == null ? void 0 : r.placeables) != null && y.length))
    return i(new Error(`await tile-click: no placeables found for "${e.target}"`));
  const o = r.placeables, a = [];
  for (const { placeable: h } of o) {
    const p = new zi(h, e.animation);
    p.start("idle"), a.push({ placeable: h, animator: p });
  }
  const s = document.getElementById("board");
  let l = null;
  const u = /* @__PURE__ */ c((h) => {
    const p = canvas.activeLayer;
    if (!p) return;
    const w = p.toLocal(h);
    if (!w || isNaN(w.x) || isNaN(w.y)) return;
    let b = !1;
    for (const { placeable: v, animator: S } of a)
      Vl(v.document, w) ? (b = !0, S.state !== "hover" && S.setState("hover")) : S.state === "hover" && S.setState("idle");
    b ? l === null && (l = document.body.style.cursor, document.body.style.cursor = "pointer") : l !== null && (document.body.style.cursor = l, l = null);
  }, "onPointerMove");
  s == null || s.addEventListener("pointermove", u);
  const d = /* @__PURE__ */ c((h) => {
    if (h.button !== 0) return;
    const p = canvas.activeLayer;
    if (!p) return;
    const w = p.toLocal(h);
    isNaN(w.x) || isNaN(w.y) || !o.filter(({ doc: v }) => Vl(v, w)).sort((v, S) => (S.doc.sort ?? 0) - (v.doc.sort ?? 0))[0] || (h.stopPropagation(), h.preventDefault(), g(), n());
  }, "onPointerDown");
  s == null || s.addEventListener("pointerdown", d, { capture: !0 });
  const m = /* @__PURE__ */ c(() => {
    g(), i(t.signal.reason ?? "aborted");
  }, "onAbort");
  t.signal.addEventListener("abort", m, { once: !0 });
  function g() {
    s == null || s.removeEventListener("pointerdown", d, { capture: !0 }), s == null || s.removeEventListener("pointermove", u), t.signal.removeEventListener("abort", m);
    for (const { animator: h } of a)
      h.detach();
    l !== null ? (document.body.style.cursor = l, l = null) : document.body.style.cursor = "";
  }
  c(g, "cleanup");
}) : Promise.reject(new Error('await tile-click: "target" is required')));
bb();
function vb() {
  Hooks.once("ready", () => {
    const e = game.modules.get(T);
    e.api || (e.api = {}), e.api.picker = {
      /** Open the picker window. Returns Promise<string[] | null>. */
      open: /* @__PURE__ */ c((t) => ea.open(t), "open"),
      /** Resolve a selector string to documents. */
      resolveSelector: Wa,
      /** Parse a selector string into { type, value }. */
      parseSelector: dc,
      /** Build a selector string from { type, value }. */
      buildSelector: iy,
      /** Build a tag selector from tags array + mode. */
      buildTagSelector: wf,
      /** Canvas highlight utilities. */
      highlight: {
        add: Zo,
        remove: Vi,
        has: Nf,
        clearAll: Ao
      }
    }, console.log(`[${T}] Placeable Picker API registered.`);
  });
}
c(vb, "registerPlaceablePickerHooks");
vb();
const zl = "eidolon-utilities", wb = "idle-animation", Gi = /* @__PURE__ */ new Map();
function Eb(e) {
  return typeof e.attribute == "string" && typeof e.from == "number" && typeof e.to == "number" && typeof e.period == "number" && e.period > 0;
}
c(Eb, "isValidTilePropConfig");
function Sb(e) {
  return typeof e.fromColor == "string" && typeof e.toColor == "string" && typeof e.period == "number" && e.period > 0;
}
c(Sb, "isValidTileTintConfig");
function Cb(e) {
  return typeof e.fromScale == "number" && typeof e.toScale == "number" && e.fromScale > 0 && e.toScale > 0 && typeof e.period == "number" && e.period > 0;
}
c(Cb, "isValidTileScaleConfig");
function vu(e) {
  if (!e || typeof e != "object") return !1;
  const t = e.type ?? "tile-prop";
  return t === "tile-tint" ? Sb(e) : t === "tile-scale" ? Cb(e) : Eb(e);
}
c(vu, "isValidConfig");
function gc(e) {
  var i;
  const t = (i = e == null ? void 0 : e.getFlag) == null ? void 0 : i.call(e, zl, wb);
  if (!t) return [];
  let n;
  if (Array.isArray(t))
    n = t;
  else if (typeof t == "object" && "0" in t)
    n = Object.values(t);
  else return typeof t == "object" && vu(t) ? [t] : [];
  return n.filter(vu);
}
c(gc, "getIdleAnimationConfigs");
function Tb(e, t) {
  const n = t.type ?? "tile-prop";
  return n === "tile-tint" ? `${e}::tint` : n === "tile-scale" ? `${e}::scale` : `${e}::${t.attribute}`;
}
c(Tb, "loopKey");
function wu(e, t, n, i) {
  return t.type === "tile-tint" ? { uuid: e, toColor: n ? t.toColor : t.fromColor, mode: t.mode } : t.type === "tile-scale" ? {
    uuid: e,
    toScale: n ? t.toScale : t.fromScale,
    ...i
  } : { uuid: e, attribute: t.attribute, value: n ? t.to : t.from };
}
c(wu, "buildExecuteParams");
function Lb(e, t) {
  var y, h;
  const n = e == null ? void 0 : e.document;
  if (!n) return;
  const i = n.id, r = Tb(i, t);
  hc(r);
  const o = t.type ?? "tile-prop", a = hi(o);
  if (!a) {
    console.warn(`[${zl}] idle-animation: unknown tween type "${o}"`);
    return;
  }
  const s = new AbortController();
  let l, u = null;
  if (o === "tile-tint") {
    const p = ((h = (y = n._source) == null ? void 0 : y.texture) == null ? void 0 : h.tint) ?? "#ffffff";
    l = /* @__PURE__ */ c(() => {
      var b, v, S;
      const w = (v = (b = canvas.scene) == null ? void 0 : b.tiles) == null ? void 0 : v.get(i);
      w && (w.updateSource({ texture: { tint: p } }), (S = w.object) == null || S.refresh());
    }, "restore"), n.updateSource({ texture: { tint: t.fromColor } }), e.refresh();
  } else if (o === "tile-scale") {
    const p = n._source.width, w = n._source.height, b = n._source.x, v = n._source.y;
    u = {
      baseWidth: p,
      baseHeight: w,
      centerX: b + p / 2,
      centerY: v + w / 2
    }, l = /* @__PURE__ */ c(() => {
      var x, R, F;
      const M = (R = (x = canvas.scene) == null ? void 0 : x.tiles) == null ? void 0 : R.get(i);
      M && (M.updateSource({ width: p, height: w, x: b, y: v }), (F = M.object) == null || F.refresh());
    }, "restore");
    const S = p * t.fromScale, I = w * t.fromScale, O = u.centerX - S / 2, k = u.centerY - I / 2;
    n.updateSource({ width: S, height: I, x: O, y: k }), e.refresh();
  } else {
    const p = foundry.utils.getProperty(n._source, t.attribute);
    if (typeof p != "number") {
      console.warn(`[${zl}] idle-animation: attribute "${t.attribute}" is not a number on tile ${i}`);
      return;
    }
    l = /* @__PURE__ */ c(() => {
      var b, v, S;
      const w = (v = (b = canvas.scene) == null ? void 0 : b.tiles) == null ? void 0 : v.get(i);
      w && (w.updateSource(foundry.utils.expandObject({ [t.attribute]: p })), (S = w.object) == null || S.refresh());
    }, "restore"), n.updateSource(foundry.utils.expandObject({ [t.attribute]: t.from })), e.refresh();
  }
  Gi.set(r, { controller: s, restore: l });
  const d = n.uuid, m = t.period / 2, g = t.easing ?? "easeInOutCosine";
  (async () => {
    const { signal: p } = s;
    for (; !p.aborted && !(await a.execute(
      wu(d, t, !0, u),
      { durationMS: m, easing: g, commit: !1, signal: p }
    ) === !1 || p.aborted || await a.execute(
      wu(d, t, !1, u),
      { durationMS: m, easing: g, commit: !1, signal: p }
    ) === !1 || p.aborted); )
      ;
  })();
}
c(Lb, "startLoop");
function hc(e) {
  const t = Gi.get(e);
  t && (t.controller.abort(), Gi.delete(e), t.restore());
}
c(hc, "stopLoopByKey");
function Sr(e) {
  const t = `${e}::`;
  for (const n of [...Gi.keys()])
    n.startsWith(t) && hc(n);
}
c(Sr, "stopLoopsForTile");
function pc(e, t) {
  if (e != null && e.document) {
    Sr(e.document.id);
    for (const n of t)
      Lb(e, n);
  }
}
c(pc, "startAllLoops");
function Ib() {
  for (const e of [...Gi.keys()])
    hc(e);
}
c(Ib, "stopAllLoops");
function Eu(e) {
  const t = `${e}::`;
  for (const n of Gi.keys())
    if (n.startsWith(t)) return !0;
  return !1;
}
c(Eu, "isLooping");
function St(e, t, n) {
  const i = document.createElement("div");
  i.classList.add("form-group");
  const r = document.createElement("label");
  r.textContent = e;
  const o = document.createElement("select");
  o.classList.add(t);
  for (const a of n) {
    const s = document.createElement("option");
    s.value = a.value, s.textContent = a.label, a.selected && (s.selected = !0), o.appendChild(s);
  }
  return i.append(r, o), i;
}
c(St, "buildSelectGroup");
function Ct(e, t, n, i = {}) {
  const r = document.createElement("div");
  r.classList.add("form-group");
  const o = document.createElement("label");
  o.textContent = e;
  const a = document.createElement("input");
  a.type = "number", a.classList.add(t), a.value = String(n);
  for (const [s, l] of Object.entries(i)) a.setAttribute(s, l);
  return r.append(o, a), r;
}
c(Ct, "buildNumberGroup");
function Cr(e, t, n) {
  const i = document.createElement("div");
  i.classList.add("form-group");
  const r = document.createElement("label");
  r.textContent = e;
  const o = document.createElement("div");
  o.classList.add("idle-anim__color-wrapper");
  const a = document.createElement("input");
  a.type = "color", a.classList.add(t), a.value = n;
  const s = document.createElement("input");
  return s.type = "text", s.classList.add(`${t}-text`), s.value = n, s.maxLength = 7, a.addEventListener("input", () => {
    s.value = a.value;
  }), s.addEventListener("change", () => {
    /^#[0-9a-f]{6}$/i.test(s.value) && (a.value = s.value);
  }), o.append(a, s), i.append(r, o), i;
}
c(Cr, "buildColorGroup");
const ys = "eidolon-utilities", bs = "idle-animation", Ob = "eidolon-idle-animation", Ab = "fa-solid fa-wave-pulse", yc = [
  { value: "alpha", label: "Alpha (Opacity)", from: 0.85, to: 1, step: "0.01" },
  { value: "rotation", label: "Rotation", from: -5, to: 5, step: "1" },
  { value: "texture.rotation", label: "Texture Rotation", from: -5, to: 5, step: "1" }
], hr = {
  type: "tile-prop",
  attribute: "alpha",
  from: 0.85,
  to: 1,
  period: 1500,
  easing: "easeInOutCosine"
}, Un = {
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
function kb(e) {
  var t;
  return (e == null ? void 0 : e.document) ?? ((t = e == null ? void 0 : e.object) == null ? void 0 : t.document) ?? (e == null ? void 0 : e.object) ?? null;
}
c(kb, "getTileDocument$1");
function Cu(e) {
  if (!e) return "";
  const t = e.type ?? "tile-prop";
  if (t === "tile-tint")
    return `Tint ${e.fromColor ?? "?"} → ${e.toColor ?? "?"} (${e.period ?? "?"}ms)`;
  if (t === "tile-scale") {
    const r = e.fromScale != null ? `${Math.round(e.fromScale * 100)}%` : "?", o = e.toScale != null ? `${Math.round(e.toScale * 100)}%` : "?";
    return `Scale ${r} → ${o} (${e.period ?? "?"}ms)`;
  }
  const n = yc.find((r) => r.value === e.attribute);
  return `${(n == null ? void 0 : n.label) ?? e.attribute ?? "?"} ${e.from ?? "?"} → ${e.to ?? "?"} (${e.period ?? "?"}ms)`;
}
c(Cu, "summarizeConfig");
function Tu(e, t, n) {
  const i = t.type ?? "tile-prop", r = Ba(), o = document.createElement("div");
  o.classList.add("idle-anim__slot", "is-collapsed"), o.dataset.index = String(n);
  const a = document.createElement("div");
  a.classList.add("idle-anim__slot-header");
  const s = document.createElement("i");
  s.classList.add("fa-solid", "fa-chevron-right", "idle-anim__slot-chevron");
  const l = document.createElement("span");
  l.classList.add("idle-anim__slot-title"), l.textContent = `Animation ${n + 1}`;
  const u = document.createElement("span");
  u.classList.add("idle-anim__slot-summary"), u.textContent = Cu(t);
  const d = document.createElement("button");
  d.type = "button", d.classList.add("idle-anim__slot-remove"), d.innerHTML = '<i class="fa-solid fa-xmark"></i>', d.title = "Remove animation", a.append(s, l, u, d), o.appendChild(a);
  const m = document.createElement("div");
  m.classList.add("idle-anim__slot-body");
  const g = St("Type", "idle-anim__type", [
    { value: "tile-prop", label: "Numeric", selected: i === "tile-prop" || i !== "tile-tint" && i !== "tile-scale" },
    { value: "tile-tint", label: "Tint", selected: i === "tile-tint" },
    { value: "tile-scale", label: "Scale", selected: i === "tile-scale" }
  ]);
  m.appendChild(g);
  const y = document.createElement("div");
  y.classList.add("idle-anim__type-fields"), m.appendChild(y);
  function h(v, S) {
    if (y.innerHTML = "", v === "tile-tint") {
      const I = Bi(), O = S.fromColor ?? Un.fromColor, k = S.toColor ?? Un.toColor, M = S.mode ?? Un.mode, x = document.createElement("div");
      x.classList.add("idle-anim__range-row"), x.appendChild(Cr("From", "idle-anim__from-color", O)), x.appendChild(Cr("To", "idle-anim__to-color", k)), y.appendChild(x), y.appendChild(St(
        "Mode",
        "idle-anim__mode",
        I.map((R) => ({ value: R, label: R, selected: R === M }))
      ));
    } else if (v === "tile-scale") {
      const I = S.fromScale ?? vs.fromScale, O = S.toScale ?? vs.toScale, k = document.createElement("div");
      k.classList.add("idle-anim__range-row"), k.appendChild(Ct("From", "idle-anim__from-scale", I, { step: "0.01", min: "0.01" })), k.appendChild(Ct("To", "idle-anim__to-scale", O, { step: "0.01", min: "0.01" })), y.appendChild(k);
      const M = document.createElement("p");
      M.classList.add("idle-anim__hint"), M.textContent = "1.0 = original size. Scales from center.", y.appendChild(M);
    } else {
      const I = S.attribute ?? hr.attribute, O = Su(I, e), k = S.from ?? O.from, M = S.to ?? O.to, x = O.step;
      y.appendChild(St(
        "Attribute",
        "idle-anim__attribute",
        yc.map((D) => ({ value: D.value, label: D.label, selected: D.value === I }))
      ));
      const R = document.createElement("div");
      R.classList.add("idle-anim__range-row"), R.appendChild(Ct("From", "idle-anim__from", k, { step: x })), R.appendChild(Ct("To", "idle-anim__to", M, { step: x })), y.appendChild(R);
      const F = y.querySelector(".idle-anim__attribute");
      F == null || F.addEventListener("change", () => {
        const D = Su(F.value, e), _ = y.querySelector(".idle-anim__from"), H = y.querySelector(".idle-anim__to");
        _ && (_.value = String(D.from), _.step = D.step), H && (H.value = String(D.to), H.step = D.step);
      });
    }
  }
  c(h, "renderTypeFields"), h(i, t);
  const p = t.period ?? (i === "tile-tint" ? Un.period : hr.period), w = t.easing ?? "easeInOutCosine";
  m.appendChild(Ct("Period (ms)", "idle-anim__period", p, { min: "100", step: "100" })), m.appendChild(St(
    "Easing",
    "idle-anim__easing",
    r.map((v) => ({ value: v, label: v, selected: v === w }))
  )), o.appendChild(m);
  const b = o.querySelector(".idle-anim__type");
  return b == null || b.addEventListener("change", () => {
    const v = b.value;
    h(v, v === "tile-tint" ? Un : v === "tile-scale" ? vs : hr);
  }), a.addEventListener("click", (v) => {
    if (!v.target.closest(".idle-anim__slot-remove") && (o.classList.toggle("is-collapsed"), o.classList.contains("is-collapsed"))) {
      const S = Zf(o);
      S && (u.textContent = Cu(S));
    }
  }), d.addEventListener("click", (v) => {
    v.stopPropagation();
    const S = o.parentElement;
    o.remove(), S && Mb(S);
  }), o;
}
c(Tu, "buildSlot");
function Mb(e) {
  e.querySelectorAll(".idle-anim__slot").forEach((n, i) => {
    n.dataset.index = String(i);
    const r = n.querySelector(".idle-anim__slot-title");
    r && (r.textContent = `Animation ${i + 1}`);
  });
}
c(Mb, "renumberSlots$1");
function Nb(e) {
  const t = gc(e), n = document.createElement("section");
  n.classList.add("eidolon-idle-animation");
  const i = document.createElement("div");
  i.classList.add("idle-anim__slots");
  for (let l = 0; l < t.length; l++)
    i.appendChild(Tu(e, t[l], l));
  n.appendChild(i);
  const r = document.createElement("button");
  r.type = "button", r.classList.add("idle-anim__add"), r.innerHTML = '<i class="fa-solid fa-plus"></i> Add Animation', r.addEventListener("click", () => {
    const l = i.querySelectorAll(".idle-anim__slot").length, u = Tu(e, hr, l);
    u.classList.remove("is-collapsed"), i.appendChild(u);
  }), n.appendChild(r);
  const o = document.createElement("div");
  o.classList.add("idle-anim__actions");
  const a = document.createElement("button");
  a.type = "button", a.classList.add("idle-anim__preview"), a.innerHTML = '<i class="fa-solid fa-play"></i> Preview All';
  const s = document.createElement("button");
  return s.type = "button", s.classList.add("idle-anim__save"), s.innerHTML = '<i class="fa-solid fa-save"></i> Save', o.append(a, s), n.appendChild(o), n;
}
c(Nb, "buildTabContent");
function Zf(e) {
  var l, u, d, m, g, y, h, p, w, b, v, S;
  const t = e.querySelector(".idle-anim__type"), n = (t == null ? void 0 : t.value) ?? "tile-prop", i = Number.parseInt((l = e.querySelector(".idle-anim__period")) == null ? void 0 : l.value, 10), r = ((u = e.querySelector(".idle-anim__easing")) == null ? void 0 : u.value) ?? "easeInOutCosine";
  if (!i || i <= 0) return null;
  if (n === "tile-tint") {
    const I = ((d = e.querySelector(".idle-anim__from-color")) == null ? void 0 : d.value) ?? ((m = e.querySelector(".idle-anim__from-color-text")) == null ? void 0 : m.value) ?? Un.fromColor, O = ((g = e.querySelector(".idle-anim__to-color")) == null ? void 0 : g.value) ?? ((y = e.querySelector(".idle-anim__to-color-text")) == null ? void 0 : y.value) ?? Un.toColor, k = ((h = e.querySelector(".idle-anim__mode")) == null ? void 0 : h.value) ?? "oklch";
    return { type: "tile-tint", fromColor: I, toColor: O, mode: k, period: i, easing: r };
  }
  if (n === "tile-scale") {
    const I = Number.parseFloat((p = e.querySelector(".idle-anim__from-scale")) == null ? void 0 : p.value), O = Number.parseFloat((w = e.querySelector(".idle-anim__to-scale")) == null ? void 0 : w.value);
    return Number.isNaN(I) || Number.isNaN(O) || I <= 0 || O <= 0 ? null : { type: "tile-scale", fromScale: I, toScale: O, period: i, easing: r };
  }
  const o = ((b = e.querySelector(".idle-anim__attribute")) == null ? void 0 : b.value) ?? hr.attribute, a = Number.parseFloat((v = e.querySelector(".idle-anim__from")) == null ? void 0 : v.value), s = Number.parseFloat((S = e.querySelector(".idle-anim__to")) == null ? void 0 : S.value);
  return Number.isNaN(a) || Number.isNaN(s) ? null : { type: "tile-prop", attribute: o, from: a, to: s, period: i, easing: r };
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
function _b(e, t) {
  var s;
  const n = At(t);
  if (!n) return;
  const i = kb(e);
  if (!i) return;
  const r = ac(e, n, Ob, "Animations", Ab);
  if (!r || r.querySelector(".eidolon-idle-animation")) return;
  r.appendChild(Nb(i)), (s = e.setPosition) == null || s.call(e, { height: "auto" });
  const o = r.querySelector(".idle-anim__preview");
  o == null || o.addEventListener("click", () => {
    const l = i.object;
    if (!l) return;
    if (Eu(i.id)) {
      Sr(i.id), o.classList.remove("is-active"), o.innerHTML = '<i class="fa-solid fa-play"></i> Preview All';
      return;
    }
    const u = Lu(r);
    u.length !== 0 && (pc(l, u), o.classList.add("is-active"), o.innerHTML = '<i class="fa-solid fa-stop"></i> Stop');
  });
  const a = r.querySelector(".idle-anim__save");
  a == null || a.addEventListener("click", async () => {
    var u;
    Eu(i.id) && (Sr(i.id), o && (o.classList.remove("is-active"), o.innerHTML = '<i class="fa-solid fa-play"></i> Preview All'));
    const l = Lu(r);
    l.length > 0 ? (await i.update({ [`flags.${ys}.-=${bs}`]: null }), await i.update({ [`flags.${ys}.${bs}`]: l })) : await i.update({ [`flags.${ys}.-=${bs}`]: null }), (u = ui.notifications) == null || u.info("Idle animations saved.");
  });
}
c(_b, "renderAnimationTab");
const $b = "eidolon-utilities", Iu = "idle-animation";
function Db() {
  var t;
  Ib();
  const e = (t = canvas.tiles) == null ? void 0 : t.placeables;
  if (Array.isArray(e))
    for (const n of e) {
      const i = gc(n.document);
      i.length > 0 && pc(n, i);
    }
}
c(Db, "onCanvasReady$1");
function Fb(e, t) {
  var r;
  const n = (r = t == null ? void 0 : t.flags) == null ? void 0 : r[$b];
  if (!n || !(Iu in n || `-=${Iu}` in n)) return;
  const i = gc(e);
  i.length > 0 && e.object ? pc(e.object, i) : Sr(e.id);
}
c(Fb, "onUpdateTile$1");
function xb(e) {
  Sr(e.id);
}
c(xb, "onDeleteTile$1");
function Pb(e, t) {
  _b(e, t);
}
c(Pb, "onRenderTileConfig$1");
function Rb() {
  Hooks.on("canvasReady", Db), Hooks.on("updateTile", Fb), Hooks.on("deleteTile", xb), Hooks.on("renderTileConfig", Pb);
}
c(Rb, "registerIdleAnimationHooks");
Rb();
const em = "eidolon-utilities", Hb = "tile-interactions", en = /* @__PURE__ */ new Map(), gi = /* @__PURE__ */ new Map(), Ou = /* @__PURE__ */ new WeakMap(), pr = /* @__PURE__ */ new Set();
let Ln = null, Tt = null, Lt = null, Pt = null;
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
  return ((t = e == null ? void 0 : e.getFlag) == null ? void 0 : t.call(e, em, Hb)) ?? null;
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
  for (const [i, r] of en)
    if (Vl(r.doc, e)) {
      const o = r.doc.sort ?? 0;
      o > n && (t = r, n = o);
    }
  return t;
}
c(rm, "hitTest");
function qb(e) {
  return {
    idle: e.idle ?? ["none"],
    hover: e.enter ?? ["none"]
  };
}
c(qb, "buildAnimatorConfig");
function bc(e, t, n) {
  Jr(e);
  const i = qb(n), r = new zi(t, i);
  r.start("idle"), gi.set(e, r);
}
c(bc, "startHoverAnimator");
function Jr(e) {
  const t = gi.get(e);
  t && (t.detach(), gi.delete(e));
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
function jb(e) {
  const t = e._source.width, n = e._source.height, i = e._source.x, r = e._source.y;
  return {
    baseWidth: t,
    baseHeight: n,
    centerX: i + t / 2,
    centerY: r + n / 2
  };
}
c(jb, "captureRefGeometry");
async function Bb(e, t) {
  const n = e.uuid, i = t.type ?? "tile-prop", r = hi(i);
  if (!r) {
    console.warn(`[${em}] tile-interactions: unknown tween type "${i}"`);
    return;
  }
  const o = t.period ?? 300, a = t.easing ?? "easeOutCubic", s = t.mode ?? "bounce", l = i === "tile-scale" ? jb(e) : null;
  if (s === "toggle") {
    const d = !(Ou.get(e) ?? !1);
    await r.execute(
      ws(n, t, d, l),
      { durationMS: o, easing: a, commit: !0 }
    ), Ou.set(e, d);
  } else {
    const u = o / 2;
    await r.execute(
      ws(n, t, !0, l),
      { durationMS: u, easing: a, commit: !1 }
    ), await r.execute(
      ws(n, t, !1, l),
      { durationMS: u, easing: a, commit: !1 }
    );
  }
}
c(Bb, "playClickAnimation");
async function Ub(e) {
  var n;
  const t = e.doc.id;
  if (!pr.has(t)) {
    pr.add(t);
    try {
      Jr(t);
      const i = e.clickConfig.map((r) => Bb(e.doc, r));
      await Promise.all(i);
    } finally {
      pr.delete(t), e.hoverConfig && (bc(t, e.placeable, e.hoverConfig), Ln === t && ((n = gi.get(t)) == null || n.setState("hover")));
    }
  }
}
c(Ub, "handleClick");
function om(e) {
  var r;
  const t = im(e);
  if (!t) return;
  const n = rm(t), i = (n == null ? void 0 : n.doc.id) ?? null;
  if (i !== Ln) {
    if (Ln) {
      const o = gi.get(Ln);
      o && o.setState("idle");
    }
    if (i) {
      const o = gi.get(i);
      o && o.setState("hover");
    }
    Ln = i, i && (n.hoverConfig || (r = n.clickConfig) != null && r.length) ? (Tt === null && (Tt = document.body.style.cursor), document.body.style.cursor = "pointer") : Tt !== null && (document.body.style.cursor = Tt, Tt = null);
  }
}
c(om, "onPointerMove");
function am(e) {
  var i;
  if (e.button !== 0) return;
  const t = im(e);
  if (!t) return;
  const n = rm(t);
  !n || !((i = n.clickConfig) != null && i.length) || Ub(n);
}
c(am, "onPointerDown");
function Vb() {
  var n;
  for (const i of gi.keys())
    Jr(i);
  en.clear(), pr.clear(), Ln = null, Tt !== null && (document.body.style.cursor = Tt, Tt = null);
  const e = document.getElementById("board");
  Lt && (e == null || e.removeEventListener("pointermove", Lt), Lt = null), Pt && (e == null || e.removeEventListener("pointerdown", Pt), Pt = null);
  const t = (n = canvas.tiles) == null ? void 0 : n.placeables;
  if (Array.isArray(t)) {
    for (const i of t) {
      const r = i.document, o = nm(r);
      if (!o) continue;
      const a = tm(o.hover), s = Array.isArray(o.click) && o.click.length ? o.click : null;
      !a && !s || (en.set(r.id, { doc: r, placeable: i, hoverConfig: a, clickConfig: s }), a && bc(r.id, i, a));
    }
    en.size !== 0 && (Lt = om, Pt = am, e == null || e.addEventListener("pointermove", Lt), e == null || e.addEventListener("pointerdown", Pt));
  }
}
c(Vb, "rebuild");
function zb(e) {
  const t = e.id, n = nm(e), i = n ? tm(n.hover) : null, r = n && Array.isArray(n.click) && n.click.length ? n.click : null;
  if (!i && !r) {
    sm(e);
    return;
  }
  Jr(t);
  const o = e.object;
  if (!o) {
    en.delete(t);
    return;
  }
  en.set(t, { doc: e, placeable: o, hoverConfig: i, clickConfig: r }), i && bc(t, o, i), Gb();
}
c(zb, "updateTile");
function sm(e) {
  const t = e.id;
  if (Jr(t), en.delete(t), pr.delete(t), Ln === t && (Ln = null, Tt !== null && (document.body.style.cursor = Tt, Tt = null)), en.size === 0) {
    const n = document.getElementById("board");
    Lt && (n == null || n.removeEventListener("pointermove", Lt), Lt = null), Pt && (n == null || n.removeEventListener("pointerdown", Pt), Pt = null);
  }
}
c(sm, "removeTile");
function Gb() {
  if (en.size === 0 || Lt) return;
  const e = document.getElementById("board");
  e && (Lt = om, Pt = am, e.addEventListener("pointermove", Lt), e.addEventListener("pointerdown", Pt));
}
c(Gb, "ensureListeners");
const Gl = "eidolon-utilities", Wl = "tile-interactions", Wb = "eidolon-idle-animation", Kb = "fa-solid fa-wave-pulse", lm = [
  { value: "float", label: "Float" },
  { value: "pulse", label: "Pulse" },
  { value: "scale", label: "Scale" },
  { value: "glow", label: "Glow" }
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
  ]
}, Ci = {
  attribute: "alpha",
  from: 1,
  to: 0.5,
  period: 300,
  mode: "bounce"
}, Ai = {
  fromColor: "#ffffff",
  toColor: "#ffaa00",
  period: 500,
  mode: "bounce"
}, ko = {
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
function Jb(e) {
  var t;
  return (e == null ? void 0 : e.document) ?? ((t = e == null ? void 0 : e.object) == null ? void 0 : t.document) ?? (e == null ? void 0 : e.object) ?? null;
}
c(Jb, "getTileDocument");
function Yb(e) {
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
c(Yb, "getInteractionConfigs");
function Au(e) {
  if (!e) return "";
  const t = e.name ?? "float", n = lm.find((i) => i.value === t);
  return (n == null ? void 0 : n.label) ?? t;
}
c(Au, "summarizeHoverConfig");
function uo(e, t, n, i) {
  const r = e.name ?? "float", o = Ba(), a = document.createElement("div");
  a.classList.add("idle-anim__slot", "is-collapsed", n), a.dataset.index = String(t);
  const s = document.createElement("div");
  s.classList.add("idle-anim__slot-header");
  const l = document.createElement("i");
  l.classList.add("fa-solid", "fa-chevron-right", "idle-anim__slot-chevron");
  const u = document.createElement("span");
  u.classList.add("idle-anim__slot-title"), u.textContent = `${i} ${t + 1}`;
  const d = document.createElement("span");
  d.classList.add("idle-anim__slot-summary"), d.textContent = Au(e);
  const m = document.createElement("button");
  m.type = "button", m.classList.add("idle-anim__slot-remove"), m.innerHTML = '<i class="fa-solid fa-xmark"></i>', m.title = "Remove effect", s.append(l, u, d, m), a.appendChild(s);
  const g = document.createElement("div");
  g.classList.add("idle-anim__slot-body");
  const y = St(
    "Behaviour",
    "ti-hover__behaviour",
    lm.map((b) => ({ value: b.value, label: b.label, selected: b.value === r }))
  );
  g.appendChild(y);
  const h = document.createElement("div");
  h.classList.add("idle-anim__type-fields"), g.appendChild(h);
  function p(b, v) {
    h.innerHTML = "";
    const S = cm[b];
    if (S)
      for (const I of S) {
        const O = v[I.key] ?? I.default;
        I.type === "color" ? h.appendChild(Cr(I.label, `ti-hover__${I.key}`, O)) : I.type === "select" && I.key === "easing" ? h.appendChild(St(
          I.label,
          `ti-hover__${I.key}`,
          o.map((k) => ({ value: k, label: k, selected: k === O }))
        )) : h.appendChild(Ct(I.label, `ti-hover__${I.key}`, O, I.attrs ?? {}));
      }
  }
  c(p, "renderParams"), p(r, e), a.appendChild(g);
  const w = a.querySelector(".ti-hover__behaviour");
  return w == null || w.addEventListener("change", () => {
    p(w.value, {});
  }), s.addEventListener("click", (b) => {
    if (!b.target.closest(".idle-anim__slot-remove") && (a.classList.toggle("is-collapsed"), a.classList.contains("is-collapsed"))) {
      const v = dm(a);
      v && (d.textContent = Au(v));
    }
  }), m.addEventListener("click", (b) => {
    b.stopPropagation();
    const v = a.parentElement;
    a.remove(), v && mm(v, n, i);
  }), a;
}
c(uo, "buildHoverSlot");
function dm(e) {
  var r;
  const t = ((r = e.querySelector(".ti-hover__behaviour")) == null ? void 0 : r.value) ?? "float", n = cm[t], i = { name: t };
  if (n)
    for (const o of n) {
      const a = e.querySelector(`.ti-hover__${o.key}`);
      if (a)
        if (o.type === "color")
          i[o.key] = a.value;
        else if (o.type === "select")
          i[o.key] = a.value;
        else {
          const s = Number.parseFloat(a.value);
          Number.isNaN(s) || (i[o.key] = s);
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
    const a = e.fromScale != null ? `${Math.round(e.fromScale * 100)}%` : "?", s = e.toScale != null ? `${Math.round(e.toScale * 100)}%` : "?";
    return `${i} Scale ${a} → ${s} (${e.period ?? "?"}ms)`;
  }
  const r = um.find((a) => a.value === e.attribute), o = (r == null ? void 0 : r.label) ?? e.attribute ?? "?";
  return `${i} ${o} ${e.from ?? "?"} → ${e.to ?? "?"} (${e.period ?? "?"}ms)`;
}
c(ku, "summarizeClickConfig");
function Mu(e, t) {
  const n = e.type ?? "tile-prop", i = e.mode ?? "bounce", r = Ba(), o = document.createElement("div");
  o.classList.add("idle-anim__slot", "is-collapsed", "ti-click-slot"), o.dataset.index = String(t);
  const a = document.createElement("div");
  a.classList.add("idle-anim__slot-header");
  const s = document.createElement("i");
  s.classList.add("fa-solid", "fa-chevron-right", "idle-anim__slot-chevron");
  const l = document.createElement("span");
  l.classList.add("idle-anim__slot-title"), l.textContent = `Animation ${t + 1}`;
  const u = document.createElement("span");
  u.classList.add("idle-anim__slot-summary"), u.textContent = ku(e);
  const d = document.createElement("button");
  d.type = "button", d.classList.add("idle-anim__slot-remove"), d.innerHTML = '<i class="fa-solid fa-xmark"></i>', d.title = "Remove animation", a.append(s, l, u, d), o.appendChild(a);
  const m = document.createElement("div");
  m.classList.add("idle-anim__slot-body");
  const g = document.createElement("div");
  g.classList.add("idle-anim__range-row"), g.appendChild(St("Mode", "ti-click__mode", [
    { value: "bounce", label: "Bounce", selected: i === "bounce" },
    { value: "toggle", label: "Toggle", selected: i === "toggle" }
  ])), g.appendChild(St("Type", "ti-click__type", [
    { value: "tile-prop", label: "Numeric", selected: n === "tile-prop" },
    { value: "tile-tint", label: "Tint", selected: n === "tile-tint" },
    { value: "tile-scale", label: "Scale", selected: n === "tile-scale" }
  ])), m.appendChild(g);
  const y = document.createElement("div");
  y.classList.add("idle-anim__type-fields"), m.appendChild(y);
  function h(v, S) {
    if (y.innerHTML = "", v === "tile-tint") {
      const I = Bi(), O = S.fromColor ?? Ai.fromColor, k = S.toColor ?? Ai.toColor, M = S.mode ?? "oklch", x = document.createElement("div");
      x.classList.add("idle-anim__range-row"), x.appendChild(Cr("From", "ti-click__from-color", O)), x.appendChild(Cr("To", "ti-click__to-color", k)), y.appendChild(x), y.appendChild(St(
        "Interpolation",
        "ti-click__color-mode",
        I.map((R) => ({ value: R, label: R, selected: R === M }))
      ));
    } else if (v === "tile-scale") {
      const I = S.fromScale ?? ko.fromScale, O = S.toScale ?? ko.toScale, k = document.createElement("div");
      k.classList.add("idle-anim__range-row"), k.appendChild(Ct("From", "ti-click__from-scale", I, { step: "0.01", min: "0.01" })), k.appendChild(Ct("To", "ti-click__to-scale", O, { step: "0.01", min: "0.01" })), y.appendChild(k);
      const M = document.createElement("p");
      M.classList.add("idle-anim__hint"), M.textContent = "1.0 = original size. Scales from center.", y.appendChild(M);
    } else {
      const I = S.attribute ?? Ci.attribute, O = S.from ?? Ci.from, k = S.to ?? Ci.to;
      y.appendChild(St(
        "Attribute",
        "ti-click__attribute",
        um.map((x) => ({ value: x.value, label: x.label, selected: x.value === I }))
      ));
      const M = document.createElement("div");
      M.classList.add("idle-anim__range-row"), M.appendChild(Ct("From", "ti-click__from", O, { step: "0.01" })), M.appendChild(Ct("To", "ti-click__to", k, { step: "0.01" })), y.appendChild(M);
    }
  }
  c(h, "renderTypeFields"), h(n, e);
  const p = e.period ?? (n === "tile-tint" ? Ai.period : Ci.period), w = e.easing ?? "easeOutCubic";
  m.appendChild(Ct("Period (ms)", "ti-click__period", p, { min: "50", step: "50" })), m.appendChild(St(
    "Easing",
    "ti-click__easing",
    r.map((v) => ({ value: v, label: v, selected: v === w }))
  )), o.appendChild(m);
  const b = o.querySelector(".ti-click__type");
  return b == null || b.addEventListener("change", () => {
    const v = b.value;
    h(v, v === "tile-tint" ? Ai : v === "tile-scale" ? ko : Ci);
  }), a.addEventListener("click", (v) => {
    if (!v.target.closest(".idle-anim__slot-remove") && (o.classList.toggle("is-collapsed"), o.classList.contains("is-collapsed"))) {
      const S = fm(o);
      S && (u.textContent = ku(S));
    }
  }), d.addEventListener("click", (v) => {
    v.stopPropagation();
    const S = o.parentElement;
    o.remove(), S && mm(S, "ti-click-slot", "Animation");
  }), o;
}
c(Mu, "buildClickSlot");
function fm(e) {
  var u, d, m, g, y, h, p, w, b, v, S, I, O, k;
  const t = ((u = e.querySelector(".ti-click__type")) == null ? void 0 : u.value) ?? "tile-prop", n = ((d = e.querySelector(".ti-click__mode")) == null ? void 0 : d.value) ?? "bounce", i = Number.parseInt((m = e.querySelector(".ti-click__period")) == null ? void 0 : m.value, 10), r = ((g = e.querySelector(".ti-click__easing")) == null ? void 0 : g.value) ?? "easeOutCubic";
  if (!i || i <= 0) return null;
  const o = { mode: n, period: i, easing: r };
  if (t === "tile-tint") {
    const M = ((y = e.querySelector(".ti-click__from-color")) == null ? void 0 : y.value) ?? ((h = e.querySelector(".ti-click__from-color-text")) == null ? void 0 : h.value) ?? Ai.fromColor, x = ((p = e.querySelector(".ti-click__to-color")) == null ? void 0 : p.value) ?? ((w = e.querySelector(".ti-click__to-color-text")) == null ? void 0 : w.value) ?? Ai.toColor, R = ((b = e.querySelector(".ti-click__color-mode")) == null ? void 0 : b.value) ?? "oklch";
    return { type: "tile-tint", fromColor: M, toColor: x, mode: R, ...o };
  }
  if (t === "tile-scale") {
    const M = Number.parseFloat((v = e.querySelector(".ti-click__from-scale")) == null ? void 0 : v.value), x = Number.parseFloat((S = e.querySelector(".ti-click__to-scale")) == null ? void 0 : S.value);
    return Number.isNaN(M) || Number.isNaN(x) || M <= 0 || x <= 0 ? null : { type: "tile-scale", fromScale: M, toScale: x, ...o };
  }
  const a = ((I = e.querySelector(".ti-click__attribute")) == null ? void 0 : I.value) ?? Ci.attribute, s = Number.parseFloat((O = e.querySelector(".ti-click__from")) == null ? void 0 : O.value), l = Number.parseFloat((k = e.querySelector(".ti-click__to")) == null ? void 0 : k.value);
  return Number.isNaN(s) || Number.isNaN(l) ? null : { type: "tile-prop", attribute: a, from: s, to: l, ...o };
}
c(fm, "readClickSlot");
function mm(e, t, n) {
  e.querySelectorAll(`.${t}`).forEach((r, o) => {
    r.dataset.index = String(o);
    const a = r.querySelector(".idle-anim__slot-title");
    a && (a.textContent = `${n} ${o + 1}`);
  });
}
c(mm, "renumberSlots");
function Qb(e) {
  const { hoverIdle: t, hoverEnter: n, click: i } = Yb(e), r = document.createElement("section");
  r.classList.add("eidolon-tile-interactions");
  const o = document.createElement("h3");
  o.classList.add("ti-section-heading"), o.textContent = "Hover — Idle", r.appendChild(o);
  const a = document.createElement("p");
  a.classList.add("idle-anim__hint"), a.textContent = "Plays continuously. Stops when pointer enters the tile.", r.appendChild(a);
  const s = document.createElement("div");
  s.classList.add("idle-anim__slots", "ti-hover-idle-slots");
  for (let v = 0; v < t.length; v++)
    s.appendChild(uo(t[v], v, "ti-hover-idle-slot", "Effect"));
  r.appendChild(s);
  const l = document.createElement("button");
  l.type = "button", l.classList.add("idle-anim__add"), l.innerHTML = '<i class="fa-solid fa-plus"></i> Add Idle Effect', l.addEventListener("click", () => {
    const v = s.querySelectorAll(".ti-hover-idle-slot").length, S = uo({ name: "float" }, v, "ti-hover-idle-slot", "Effect");
    S.classList.remove("is-collapsed"), s.appendChild(S);
  }), r.appendChild(l);
  const u = document.createElement("h3");
  u.classList.add("ti-section-heading"), u.textContent = "Hover — On Enter", r.appendChild(u);
  const d = document.createElement("p");
  d.classList.add("idle-anim__hint"), d.textContent = "Plays while pointer is over the tile. Stops when pointer leaves.", r.appendChild(d);
  const m = document.createElement("div");
  m.classList.add("idle-anim__slots", "ti-hover-enter-slots");
  for (let v = 0; v < n.length; v++)
    m.appendChild(uo(n[v], v, "ti-hover-enter-slot", "Effect"));
  r.appendChild(m);
  const g = document.createElement("button");
  g.type = "button", g.classList.add("idle-anim__add"), g.innerHTML = '<i class="fa-solid fa-plus"></i> Add Hover Effect', g.addEventListener("click", () => {
    const v = m.querySelectorAll(".ti-hover-enter-slot").length, S = uo({ name: "scale" }, v, "ti-hover-enter-slot", "Effect");
    S.classList.remove("is-collapsed"), m.appendChild(S);
  }), r.appendChild(g);
  const y = document.createElement("h3");
  y.classList.add("ti-section-heading"), y.textContent = "Click Animations", r.appendChild(y);
  const h = document.createElement("div");
  h.classList.add("idle-anim__slots", "ti-click-slots");
  for (let v = 0; v < i.length; v++)
    h.appendChild(Mu(i[v], v));
  r.appendChild(h);
  const p = document.createElement("button");
  p.type = "button", p.classList.add("idle-anim__add"), p.innerHTML = '<i class="fa-solid fa-plus"></i> Add Animation', p.addEventListener("click", () => {
    const v = h.querySelectorAll(".ti-click-slot").length, S = Mu(ko, v);
    S.classList.remove("is-collapsed"), h.appendChild(S);
  }), r.appendChild(p);
  const w = document.createElement("div");
  w.classList.add("idle-anim__actions");
  const b = document.createElement("button");
  return b.type = "button", b.classList.add("idle-anim__save"), b.innerHTML = '<i class="fa-solid fa-save"></i> Save Interactions', w.appendChild(b), r.appendChild(w), r;
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
function Xb(e) {
  const t = [];
  for (const n of e.querySelectorAll(".ti-click-slot")) {
    const i = fm(n);
    i && t.push(i);
  }
  return t;
}
c(Xb, "readAllClickConfigs");
function Zb(e, t) {
  var l;
  const n = At(t);
  if (!n) return;
  const i = Jb(e);
  if (!i) return;
  const r = ac(e, n, Wb, "Animations", Kb);
  if (!r || r.querySelector(".eidolon-tile-interactions")) return;
  const o = document.createElement("hr");
  o.classList.add("ti-divider"), r.appendChild(o);
  const a = Qb(i);
  r.appendChild(a), (l = e.setPosition) == null || l.call(e, { height: "auto" });
  const s = a.querySelector(".idle-anim__save");
  s == null || s.addEventListener("click", async () => {
    var h;
    const u = Nu(a, "ti-hover-idle-slot"), d = Nu(a, "ti-hover-enter-slot"), m = Xb(a), g = u.length > 0 || d.length > 0, y = g || m.length > 0;
    if (await i.update({ [`flags.${Gl}.-=${Wl}`]: null }), y) {
      const p = {};
      g && (p.hover = {}, u.length > 0 && (p.hover.idle = u), d.length > 0 && (p.hover.enter = d)), m.length > 0 && (p.click = m), await i.update({ [`flags.${Gl}.${Wl}`]: p });
    }
    (h = ui.notifications) == null || h.info("Tile interactions saved.");
  });
}
c(Zb, "renderInteractionSection");
const ev = "eidolon-utilities", _u = "tile-interactions";
function tv() {
  Vb();
}
c(tv, "onCanvasReady");
function nv(e, t) {
  var i;
  const n = (i = t == null ? void 0 : t.flags) == null ? void 0 : i[ev];
  !n || !(_u in n || `-=${_u}` in n) || zb(e);
}
c(nv, "onUpdateTile");
function iv(e) {
  sm(e);
}
c(iv, "onDeleteTile");
function rv(e, t) {
  Zb(e, t);
}
c(rv, "onRenderTileConfig");
function ov() {
  Hooks.on("canvasReady", tv), Hooks.on("updateTile", nv), Hooks.on("deleteTile", iv), Hooks.on("renderTileConfig", rv);
}
c(ov, "registerTileInteractionHooks");
ov();
//# sourceMappingURL=eidolon-utilities.js.map
