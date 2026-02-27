var Pl = Object.defineProperty;
var Qd = Object.getPrototypeOf;
var Xd = Reflect.get;
var Rl = (t) => {
  throw TypeError(t);
};
var Zd = (t, n, e) => n in t ? Pl(t, n, { enumerable: !0, configurable: !0, writable: !0, value: e }) : t[n] = e;
var c = (t, n) => Pl(t, "name", { value: n, configurable: !0 });
var Me = (t, n, e) => Zd(t, typeof n != "symbol" ? n + "" : n, e), Eo = (t, n, e) => n.has(t) || Rl("Cannot " + e);
var d = (t, n, e) => (Eo(t, n, "read from private field"), e ? e.call(t) : n.get(t)), x = (t, n, e) => n.has(t) ? Rl("Cannot add the same private member more than once") : n instanceof WeakSet ? n.add(t) : n.set(t, e), A = (t, n, e, i) => (Eo(t, n, "write to private field"), i ? i.call(t, e) : n.set(t, e), e), h = (t, n, e) => (Eo(t, n, "access private method"), e);
var To = (t, n, e, i) => ({
  set _(r) {
    A(t, n, r, e);
  },
  get _() {
    return d(t, n, i);
  }
}), ze = (t, n, e) => Xd(Qd(t), e, n);
const L = "eidolon-utilities", ta = "timeTriggerActive", jo = "timeTriggerHideWindow", Uo = "timeTriggerShowPlayerWindow", Vo = "timeTriggerAllowRealTime", $c = "timeTriggers", Pr = "timeTriggerHistory", zo = "debug", Go = "timeFormat", Wo = "manageTime", Jo = "secondsPerRound";
const ef = [-30, -15, -5, 5, 15, 30], pi = 1440 * 60, Rr = "playSound", br = 6;
function v(t, n) {
  var e, i;
  return (i = (e = game.i18n) == null ? void 0 : e.has) != null && i.call(e, t) ? game.i18n.localize(t) : n;
}
c(v, "localize");
function At(t) {
  return typeof t != "string" ? "" : t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
c(At, "escapeHtml");
function qt(t) {
  var n;
  return t == null ? t : (n = foundry == null ? void 0 : foundry.utils) != null && n.duplicate ? foundry.utils.duplicate(t) : JSON.parse(JSON.stringify(t));
}
c(qt, "duplicateData");
function tf() {
  var t;
  return (t = foundry == null ? void 0 : foundry.utils) != null && t.randomID ? foundry.utils.randomID() : typeof (crypto == null ? void 0 : crypto.randomUUID) == "function" ? crypto.randomUUID() : Math.random().toString(36).slice(2, 10);
}
c(tf, "generateTriggerId");
function Fc(t) {
  if (typeof t != "string") return null;
  const n = t.trim();
  if (!n) return null;
  const e = n.match(/^([0-9]{1,2}):([0-9]{2})(?::([0-9]{2}))?$/);
  if (!e) return null;
  const i = Number(e[1]), r = Number(e[2]), a = e[3] !== void 0 ? Number(e[3]) : 0;
  return !Number.isInteger(i) || !Number.isInteger(r) || !Number.isInteger(a) || i < 0 || i > 23 || r < 0 || r > 59 || a < 0 || a > 59 ? null : i * 3600 + r * 60 + a;
}
c(Fc, "parseTriggerTimeToSeconds");
function qi() {
  var t, n;
  return ((t = game.scenes) == null ? void 0 : t.current) ?? ((n = game.scenes) == null ? void 0 : n.active) ?? null;
}
c(qi, "getActiveScene");
function Bt(t) {
  return (t == null ? void 0 : t.object) ?? (t == null ? void 0 : t.document) ?? null;
}
c(Bt, "getSceneFromApplication");
function et(t) {
  return t && typeof t.getFlag == "function" && typeof t.setFlag == "function";
}
c(et, "hasSceneDocument");
const Ko = /* @__PURE__ */ new Set(), Yo = /* @__PURE__ */ new Set(), Qo = /* @__PURE__ */ new Set(), Xo = /* @__PURE__ */ new Set();
let ti = !1, Ji = !1, na = br, ia = "12h", Hl = !1;
function Co(t) {
  ti = !!t;
  for (const n of Ko)
    try {
      n(ti);
    } catch (e) {
      console.error(`${L} | Debug change handler failed`, e);
    }
}
c(Co, "notifyDebugChange");
function So(t) {
  Ji = !!t;
  for (const n of Yo)
    try {
      n(Ji);
    } catch (e) {
      console.error(`${L} | Manage time change handler failed`, e);
    }
}
c(So, "notifyManageTimeChange");
function Dc(t) {
  return t === "24h" ? "24h" : "12h";
}
c(Dc, "normalizeTimeFormatValue");
function ul(t) {
  const n = Number(t);
  return !Number.isFinite(n) || n <= 0 ? br : n;
}
c(ul, "normalizeSecondsPerRoundValue");
function Lo(t) {
  const n = ul(t);
  na = n;
  for (const e of Qo)
    try {
      e(n);
    } catch (i) {
      console.error(`${L} | Seconds-per-round change handler failed`, i);
    }
}
c(Lo, "notifySecondsPerRoundChange");
function Io(t) {
  const n = Dc(t);
  ia = n;
  for (const e of Xo)
    try {
      e(n);
    } catch (i) {
      console.error(`${L} | Time format change handler failed`, i);
    }
}
c(Io, "notifyTimeFormatChange");
function nf() {
  var n;
  if (Hl) return;
  if (Hl = !0, !((n = game == null ? void 0 : game.settings) != null && n.register)) {
    console.warn(
      `${L} | game.settings.register is unavailable. Module settings could not be registered.`
    );
    return;
  }
  const t = typeof game.settings.registerChange == "function";
  game.settings.register(L, zo, {
    name: v("EIDOLON.TimeTrigger.DebugSettingName", "Enable debug logging"),
    hint: v(
      "EIDOLON.TimeTrigger.DebugSettingHint",
      "Write detailed time-trigger diagnostics to the browser console."
    ),
    scope: "world",
    config: !0,
    type: Boolean,
    default: !1,
    onChange: t ? void 0 : Co
  }), t && game.settings.registerChange(L, zo, Co), ti = dl(), Co(ti), game.settings.register(L, Wo, {
    name: v("EIDOLON.TimeTrigger.ManageTimeSettingName", "Manage Game Time"),
    hint: v(
      "EIDOLON.TimeTrigger.ManageTimeSettingHint",
      "Allow Eidolon Utilities to advance world time automatically while the game is unpaused. Warning: This may conflict with other time-management modules."
    ),
    scope: "world",
    config: !0,
    type: Boolean,
    default: !1,
    onChange: t ? void 0 : So
  }), t && game.settings.registerChange(L, Wo, So), Ji = af(), So(Ji), game.settings.register(L, Jo, {
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
    default: br,
    range: { min: 1, max: 3600, step: 1 },
    onChange: t ? void 0 : Lo
  }), t && game.settings.registerChange(
    L,
    Jo,
    Lo
  ), na = ul(of()), Lo(na), game.settings.register(L, Go, {
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
    onChange: t ? void 0 : Io
  }), t && game.settings.registerChange(L, Go, Io), ia = Dc(_c()), Io(ia);
}
c(nf, "registerTimeTriggerSettings");
function dl() {
  var t;
  try {
    if ((t = game == null ? void 0 : game.settings) != null && t.get)
      return !!game.settings.get(L, zo);
  } catch (n) {
    console.error(`${L} | Failed to read debug setting`, n);
  }
  return !1;
}
c(dl, "getDebugSetting");
function rf() {
  return ti = dl(), ti;
}
c(rf, "refreshDebugSettingCache");
function af() {
  var t;
  try {
    if ((t = game == null ? void 0 : game.settings) != null && t.get)
      return !!game.settings.get(L, Wo);
  } catch (n) {
    console.error(`${L} | Failed to read manage time setting`, n);
  }
  return !1;
}
c(af, "getManageTimeSetting");
function _c() {
  var t;
  try {
    if ((t = game == null ? void 0 : game.settings) != null && t.get)
      return game.settings.get(L, Go) === "24h" ? "24h" : "12h";
  } catch (n) {
    console.error(`${L} | Failed to read time format setting`, n);
  }
  return "12h";
}
c(_c, "getTimeFormatSetting");
function of() {
  var t;
  try {
    if ((t = game == null ? void 0 : game.settings) != null && t.get) {
      const n = game.settings.get(L, Jo);
      return ul(n);
    }
  } catch (n) {
    console.error(`${L} | Failed to read seconds-per-round setting`, n);
  }
  return br;
}
c(of, "getSecondsPerRoundSetting");
function sf(t) {
  if (typeof t != "function")
    return () => {
    };
  Ko.add(t);
  try {
    t(ti);
  } catch (n) {
    console.error(`${L} | Debug change handler failed`, n);
  }
  return () => {
    Ko.delete(t);
  };
}
c(sf, "onDebugSettingChange");
function Pc(t) {
  if (typeof t != "function")
    return () => {
    };
  Yo.add(t);
  try {
    t(Ji);
  } catch (n) {
    console.error(`${L} | Manage time change handler failed`, n);
  }
  return () => {
    Yo.delete(t);
  };
}
c(Pc, "onManageTimeSettingChange");
function fl(t) {
  if (typeof t != "function")
    return () => {
    };
  Xo.add(t);
  try {
    t(ia);
  } catch (n) {
    console.error(`${L} | Time format change handler failed`, n);
  }
  return () => {
    Xo.delete(t);
  };
}
c(fl, "onTimeFormatSettingChange");
function lf(t) {
  if (typeof t != "function")
    return () => {
    };
  Qo.add(t);
  try {
    t(na);
  } catch (n) {
    console.error(`${L} | Seconds-per-round change handler failed`, n);
  }
  return () => {
    Qo.delete(t);
  };
}
c(lf, "onSecondsPerRoundSettingChange");
let io = !1, Zo = !1;
function es(t) {
  io = !!t;
}
c(es, "updateDebugState");
function Rc() {
  Zo || (Zo = !0, es(dl()), sf((t) => {
    es(t), console.info(`${L} | Debug ${io ? "enabled" : "disabled"}`);
  }));
}
c(Rc, "ensureInitialized");
function hl() {
  return Zo || Rc(), io;
}
c(hl, "shouldLog");
function Hc(t) {
  if (!t.length)
    return [`${L} |`];
  const [n, ...e] = t;
  return typeof n == "string" ? [`${L} | ${n}`, ...e] : [`${L} |`, n, ...e];
}
c(Hc, "formatArgs");
function cf() {
  Rc();
}
c(cf, "initializeDebug");
function uf() {
  return es(rf()), io;
}
c(uf, "syncDebugState");
function D(...t) {
  hl() && console.debug(...Hc(t));
}
c(D, "debugLog");
function Ai(...t) {
  hl() && console.group(...Hc(t));
}
c(Ai, "debugGroup");
function vn() {
  hl() && console.groupEnd();
}
c(vn, "debugGroupEnd");
function yi(t) {
  var r;
  const n = (r = t == null ? void 0 : t.getFlag) == null ? void 0 : r.call(t, L, $c);
  if (!n) return [];
  const e = qt(n), i = Array.isArray(e) ? e : [];
  return D("Loaded time triggers", {
    sceneId: (t == null ? void 0 : t.id) ?? null,
    count: i.length
  }), i;
}
c(yi, "getTimeTriggers");
async function qc(t, n) {
  t != null && t.setFlag && (D("Persisting time triggers", {
    sceneId: t.id,
    count: Array.isArray(n) ? n.length : 0
  }), await t.setFlag(L, $c, n));
}
c(qc, "setTimeTriggers");
function df(t) {
  var r;
  const n = (r = t == null ? void 0 : t.getFlag) == null ? void 0 : r.call(t, L, Pr);
  if (!n) return {};
  const e = qt(n);
  if (!e || typeof e != "object") return {};
  const i = {};
  for (const [a, o] of Object.entries(e))
    typeof o == "number" && Number.isFinite(o) && (i[a] = o);
  return D("Loaded time trigger history", {
    sceneId: (t == null ? void 0 : t.id) ?? null,
    keys: Object.keys(i)
  }), i;
}
c(df, "getTimeTriggerHistory");
async function Oo(t, n) {
  var l, u, f, g;
  if (!t) return;
  const e = {};
  if (n && typeof n == "object")
    for (const [m, y] of Object.entries(n))
      typeof y == "number" && Number.isFinite(y) && (e[m] = y);
  const i = ((l = t.getFlag) == null ? void 0 : l.call(t, L, Pr)) ?? {}, r = {};
  if (i && typeof i == "object")
    for (const [m, y] of Object.entries(i))
      typeof y == "number" && Number.isFinite(y) && (r[m] = y);
  const a = Object.keys(e), o = Object.keys(r);
  if (typeof ((u = foundry == null ? void 0 : foundry.utils) == null ? void 0 : u.deepEqual) == "function" ? foundry.utils.deepEqual(r, e) : JSON.stringify(r) === JSON.stringify(e)) {
    D("Skip history update because state is unchanged", {
      sceneId: (t == null ? void 0 : t.id) ?? null
    });
    return;
  }
  D("Updating time trigger history", {
    sceneId: (t == null ? void 0 : t.id) ?? null,
    keys: a,
    removedKeys: o.filter((m) => !a.includes(m))
  });
  try {
    o.length && typeof t.unsetFlag == "function" && await t.unsetFlag(L, Pr), a.length && await t.setFlag(L, Pr, e);
  } catch (m) {
    console.error(`${L} | Failed to persist time trigger history`, m), (g = (f = ui.notifications) == null ? void 0 : f.error) == null || g.call(
      f,
      v(
        "EIDOLON.TimeTrigger.HistoryPersistError",
        "Failed to persist the scene's time trigger history."
      )
    );
  }
}
c(Oo, "updateTimeTriggerHistory");
const ra = /* @__PURE__ */ new Map(), ql = /* @__PURE__ */ new Set();
function ff(t) {
  if (!(t != null && t.id))
    throw new Error(`${L} | Action definitions require an id.`);
  if (ra.has(t.id))
    throw new Error(`${L} | Duplicate time trigger action id: ${t.id}`);
  ra.set(t.id, {
    ...t
  }), D("Registered time trigger action", { actionId: t.id });
}
c(ff, "registerAction");
function wr(t) {
  return ra.get(t) ?? null;
}
c(wr, "getAction");
function hf(t) {
  const n = wr(t);
  return n ? typeof n.label == "function" ? n.label() : n.label : t;
}
c(hf, "getActionLabel");
function Bl() {
  return Array.from(ra.values());
}
c(Bl, "listActions");
async function Bc(t, n) {
  var i, r;
  const e = wr(n == null ? void 0 : n.action);
  if (!e || typeof e.execute != "function") {
    const a = v(
      "EIDOLON.TimeTrigger.UnknownAction",
      "Encountered an unknown time trigger action and skipped it."
    );
    (r = (i = ui.notifications) == null ? void 0 : i.warn) == null || r.call(i, a), console.warn(`${L} | Unknown time trigger action`, n), D("Encountered unknown time trigger action", {
      triggerId: (n == null ? void 0 : n.id) ?? null,
      actionId: (n == null ? void 0 : n.action) ?? null
    });
    return;
  }
  D("Executing action handler", {
    actionId: e.id,
    triggerId: (n == null ? void 0 : n.id) ?? null,
    sceneId: (t == null ? void 0 : t.id) ?? null
  }), await e.execute({ scene: t, trigger: n });
}
c(Bc, "executeTriggerAction");
function gf(t) {
  const n = wr(t == null ? void 0 : t.action);
  return !n || typeof n.buildSummaryParts != "function" ? [] : n.buildSummaryParts({ trigger: t, escapeHtml: At, localize: v }) ?? [];
}
c(gf, "buildActionSummaryParts");
function mf(t) {
  const n = wr(t == null ? void 0 : t.action);
  return !n || typeof n.buildFormContent != "function" ? "" : n.buildFormContent({ trigger: t, escapeHtml: At, localize: v }) ?? "";
}
c(mf, "buildActionFormSection");
function pf(t, n) {
  const e = wr(t == null ? void 0 : t.action);
  !e || typeof e.prepareFormData != "function" || e.prepareFormData({ trigger: t, formData: n });
}
c(pf, "applyActionFormData");
function yf(t, n, e) {
  var a, o;
  const i = `${(t == null ? void 0 : t.id) ?? "unknown"}:${(n == null ? void 0 : n.id) ?? (n == null ? void 0 : n.action) ?? "unknown"}:${e}`;
  if (ql.has(i)) return;
  ql.add(i);
  const r = v(
    "EIDOLON.TimeTrigger.MissingDataWarning",
    "A scene time trigger is missing required data and was skipped."
  );
  (o = (a = ui.notifications) == null ? void 0 : a.warn) == null || o.call(a, r), console.warn(`${L} | Missing trigger data (${e})`, { scene: t == null ? void 0 : t.id, trigger: n });
}
c(yf, "warnMissingTriggerData");
async function bf({ scene: t, trigger: n }) {
  var a, o, s, l, u;
  const e = (s = (o = (a = n == null ? void 0 : n.data) == null ? void 0 : a.path) == null ? void 0 : o.trim) == null ? void 0 : s.call(o);
  if (!e) {
    yf(t, n, "missing-audio-path");
    return;
  }
  const i = {
    src: e,
    autoplay: !0,
    loop: !1
  }, r = (() => {
    var f, g, m, y, b;
    return typeof ((g = (f = foundry == null ? void 0 : foundry.audio) == null ? void 0 : f.AudioHelper) == null ? void 0 : g.play) == "function" ? foundry.audio.AudioHelper.play(i, !0) : typeof ((y = (m = game == null ? void 0 : game.audio) == null ? void 0 : m.constructor) == null ? void 0 : y.play) == "function" ? game.audio.constructor.play(i, !0) : typeof ((b = game == null ? void 0 : game.audio) == null ? void 0 : b.play) == "function" ? game.audio.play(i, !0) : null;
  })();
  if (!r) {
    console.error(`${L} | Foundry audio helper is unavailable`), (u = (l = ui.notifications) == null ? void 0 : l.error) == null || u.call(
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
c(bf, "executePlaySoundAction");
ff({
  id: Rr,
  label: /* @__PURE__ */ c(() => v("EIDOLON.TimeTrigger.ActionPlaySound", "Play Sound"), "label"),
  execute: bf,
  buildSummaryParts: /* @__PURE__ */ c(({ trigger: t, escapeHtml: n, localize: e }) => {
    var r;
    return (r = t == null ? void 0 : t.data) != null && r.path ? [`${n(e("EIDOLON.TimeTrigger.TriggerSound", "Sound File"))}: ${n(t.data.path)}`] : [];
  }, "buildSummaryParts"),
  buildFormContent: /* @__PURE__ */ c(({ trigger: t, escapeHtml: n, localize: e }) => {
    var s;
    const i = n(e("EIDOLON.TimeTrigger.TriggerSound", "Sound File")), r = n(
      e("EIDOLON.TimeTrigger.TriggerChooseFile", "Select File")
    ), a = n(
      e(
        "EIDOLON.TimeTrigger.TriggerSoundNotes",
        "Select or upload the audio file that should play when this trigger fires."
      )
    ), o = n(((s = t == null ? void 0 : t.data) == null ? void 0 : s.path) ?? "");
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
  prepareFormData: /* @__PURE__ */ c(({ trigger: t, formData: n }) => {
    var e, i;
    t.data.path = ((i = (e = n.playSoundPath) == null ? void 0 : e.trim) == null ? void 0 : i.call(e)) ?? "";
  }, "prepareFormData")
});
var Ic;
const { ApplicationV2: An, HandlebarsApplicationMixin: Mn } = ((Ic = foundry.applications) == null ? void 0 : Ic.api) ?? {};
if (!An || !Mn)
  throw new Error(
    `${L} | ApplicationV2 API unavailable. Update Foundry VTT to v13 or newer.`
  );
const Tn = "AM", ni = "PM";
function En() {
  return _c();
}
c(En, "getConfiguredTimeFormat");
function ro(t) {
  if (typeof t != "string") return null;
  const n = t.trim();
  if (!n) return null;
  const e = n.match(/^([0-9]{1,2}):([0-9]{2})(?::([0-9]{2}))?$/);
  if (!e) return null;
  const i = Number(e[1]), r = Number(e[2]), a = e[3] !== void 0 ? Number(e[3]) : null;
  return !Number.isInteger(i) || !Number.isInteger(r) || i < 0 || i > 23 || r < 0 || r > 59 || a !== null && (!Number.isInteger(a) || a < 0 || a > 59) ? null : {
    hours: i,
    minutes: r,
    seconds: a
  };
}
c(ro, "parseCanonicalTimeString");
function Ht({ hours: t, minutes: n, seconds: e }) {
  if (!Number.isInteger(t) || !Number.isInteger(n) || t < 0 || t > 23 || n < 0 || n > 59) return null;
  const i = String(t).padStart(2, "0"), r = String(n).padStart(2, "0");
  if (Number.isInteger(e)) {
    if (e < 0 || e > 59) return null;
    const a = String(e).padStart(2, "0");
    return `${i}:${r}:${a}`;
  }
  return `${i}:${r}`;
}
c(Ht, "formatCanonicalTime");
function wf(t, { format: n } = {}) {
  if (!t || typeof t != "object") return null;
  const e = Number(t.hour), i = Number(t.minute), r = t.second !== void 0 && t.second !== null, a = r ? Number(t.second) : null, o = r && Number.isFinite(a) ? Math.floor(Math.max(0, Math.min(59, a))) : null;
  if (!Number.isFinite(e) || !Number.isFinite(i)) return null;
  const s = n ?? En();
  return aa(
    {
      hours: e,
      minutes: i,
      seconds: o
    },
    s
  );
}
c(wf, "formatTimeComponentsForDisplay");
function vf(t, { format: n } = {}) {
  const e = ro(t);
  if (!e) return "";
  const i = n ?? En();
  return aa(e, i);
}
c(vf, "formatTriggerTimeForDisplay");
function aa(t, n = "12h") {
  if (!t) return "";
  const { hours: e, minutes: i, seconds: r = null } = t;
  if (!Number.isInteger(e) || !Number.isInteger(i)) return "";
  const a = Number.isInteger(r);
  if (n === "24h") {
    const m = `${String(e).padStart(2, "0")}:${String(i).padStart(2, "0")}`;
    return a ? `${m}:${String(r).padStart(2, "0")}` : m;
  }
  const o = e >= 12 ? ni : Tn, s = e % 12 === 0 ? 12 : e % 12, l = String(s), u = String(i).padStart(2, "0"), f = `${l}:${u}`, g = o === Tn ? v("EIDOLON.TimeTrigger.TimePeriodAM", Tn) : v("EIDOLON.TimeTrigger.TimePeriodPM", ni);
  if (a) {
    const m = String(r).padStart(2, "0");
    return `${f}:${m} ${g}`;
  }
  return `${f} ${g}`;
}
c(aa, "formatTimeParts");
function jl(t, n = En()) {
  const e = ro(t);
  if (n === "24h")
    return {
      format: n,
      canonical: e ? Ht(e) ?? "" : "",
      hour: e ? String(e.hours).padStart(2, "0") : "",
      minute: e ? String(e.minutes).padStart(2, "0") : ""
    };
  if (!e)
    return {
      format: n,
      canonical: "",
      hour: "",
      minute: "",
      period: Tn
    };
  const i = e.hours >= 12 ? ni : Tn, r = e.hours % 12 === 0 ? 12 : e.hours % 12;
  return {
    format: n,
    canonical: Ht(e) ?? "",
    hour: String(r),
    minute: String(e.minutes).padStart(2, "0"),
    period: i
  };
}
c(jl, "getTimeFormValues");
function Ef({ hour: t, minute: n, period: e, time: i }, r = En()) {
  if (r === "24h") {
    const y = typeof t == "string" ? t.trim() : "", b = typeof n == "string" ? n.trim() : "", p = typeof i == "string" ? i.trim() : "";
    if (!y && !b && p) {
      const M = ro(p);
      return M ? { canonical: Ht(M) ?? "", error: null } : {
        canonical: "",
        error: v(
          "EIDOLON.TimeTrigger.TimeFormatInvalid24",
          "Enter a valid time in HH:MM format."
        )
      };
    }
    if (!y || !b)
      return {
        canonical: "",
        error: v("EIDOLON.TimeTrigger.TimeFormatMissing", "Enter a complete time.")
      };
    const E = Number(y), T = Number(b);
    return !Number.isInteger(E) || E < 0 || E > 23 ? {
      canonical: "",
      error: v(
        "EIDOLON.TimeTrigger.TimeFormatInvalid24",
        "Enter a valid time in HH:MM format."
      )
    } : !Number.isInteger(T) || T < 0 || T > 59 ? {
      canonical: "",
      error: v(
        "EIDOLON.TimeTrigger.TimeFormatInvalid24",
        "Enter a valid time in HH:MM format."
      )
    } : { canonical: Ht({
      hours: E,
      minutes: T
    }) ?? "", error: null };
  }
  const a = typeof t == "string" ? t.trim() : "", o = typeof n == "string" ? n.trim() : "", s = typeof e == "string" ? e.trim().toUpperCase() : "";
  if (!a || !o || !s)
    return { canonical: "", error: v("EIDOLON.TimeTrigger.TimeFormatMissing", "Enter a complete time.") };
  if (s !== Tn && s !== ni)
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
  const f = l % 12, m = {
    hours: s === ni ? f + 12 : f,
    minutes: u
  };
  return {
    canonical: Ht(m) ?? "",
    error: null
  };
}
c(Ef, "normalizeFormTimeInput");
function Tf() {
  return [
    {
      value: Tn,
      label: v("EIDOLON.TimeTrigger.TimePeriodAM", Tn)
    },
    {
      value: ni,
      label: v("EIDOLON.TimeTrigger.TimePeriodPM", ni)
    }
  ];
}
c(Tf, "getPeriodOptions");
var Bn, jn, fe, jc, Oa, Aa, Uc, ns, is, Ma, Na, Vc, zc, Gc, rs, as, os, ka, xa, ss, $a, Wc, Jc;
const Rn = class Rn extends Mn(An) {
  constructor(e = {}) {
    var o;
    const { scene: i, showControls: r, ...a } = e ?? {};
    super(a);
    x(this, fe);
    x(this, Bn, null);
    x(this, jn, null);
    x(this, Oa, /* @__PURE__ */ c((e) => {
      var r, a;
      e.preventDefault();
      const i = Number((a = (r = e.currentTarget) == null ? void 0 : r.dataset) == null ? void 0 : a.delta);
      Number.isFinite(i) && (D("Time delta button clicked", { delta: i }), this._advanceTime(i));
    }, "#onDeltaClick"));
    x(this, Aa, /* @__PURE__ */ c((e) => {
      var i, r;
      e.preventDefault(), !(!this.showControls || !((i = game.user) != null && i.isGM)) && (D("Time value double clicked", { sceneId: ((r = this.scene) == null ? void 0 : r.id) ?? null }), h(this, fe, Uc).call(this));
    }, "#onTimeDoubleClick"));
    x(this, Ma, /* @__PURE__ */ c((e) => {
      if (this.isEditingTime && !this._commitTimeInProgress)
        if (e.key === "Enter") {
          e.preventDefault();
          const i = e.currentTarget, r = typeof (i == null ? void 0 : i.value) == "string" ? i.value : "";
          h(this, fe, is).call(this, r);
        } else e.key === "Escape" && (e.preventDefault(), h(this, fe, ns).call(this));
    }, "#onTimeInputKeydown"));
    x(this, Na, /* @__PURE__ */ c((e) => {
      if (!this.isEditingTime || this._commitTimeInProgress || this._suppressBlurCommit) return;
      const i = e.currentTarget, r = typeof (i == null ? void 0 : i.value) == "string" ? i.value : "";
      h(this, fe, is).call(this, r);
    }, "#onTimeInputBlur"));
    x(this, ka, /* @__PURE__ */ c((e) => {
      const i = !!e;
      if (this.manageTimeEnabled === i) return;
      this.manageTimeEnabled = i, (this.rendered ?? this.isRendered ?? !1) && this.render({ force: !0 });
    }, "#handleManageTimeChange"));
    x(this, xa, /* @__PURE__ */ c(async (e) => {
      var a, o, s, l, u, f, g, m, y;
      if (e.preventDefault(), !this.showControls || !((a = game.user) != null && a.isGM)) return;
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
        await i.setFlag(L, Vo, r), this.sceneAllowsRealTime = r;
        const b = r ? v(
          "EIDOLON.TimeTrigger.SceneRealTimeEnabled",
          "Automatic real-time flow enabled for this scene."
        ) : v(
          "EIDOLON.TimeTrigger.SceneRealTimeDisabled",
          "Automatic real-time flow disabled for this scene."
        );
        (g = (f = ui.notifications) == null ? void 0 : f.info) == null || g.call(f, b);
      } catch (b) {
        console.error(`${L} | Failed to toggle scene real-time flow`, b), (y = (m = ui.notifications) == null ? void 0 : m.error) == null || y.call(
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
    x(this, $a, /* @__PURE__ */ c(() => {
      (this.rendered ?? this.isRendered ?? !1) && (this.isEditingTime && (this.editValue = h(this, fe, rs).call(this)), this.render({ force: !0 }));
    }, "#handleTimeFormatChange"));
    this.scene = i ?? null, this.showControls = typeof r == "boolean" ? r : !!((o = game.user) != null && o.isGM), this.isEditingTime = !1, this.editValue = "", this._commitTimeInProgress = !1, this._suppressBlurCommit = !1, this.manageTimeEnabled = !1, this.sceneAllowsRealTime = h(this, fe, ss).call(this), A(this, Bn, fl(d(this, $a))), A(this, jn, Pc(d(this, ka)));
  }
  async _prepareContext() {
    var T, I;
    const e = ((T = game.time) == null ? void 0 : T.components) ?? {}, r = ((e == null ? void 0 : e.second) !== void 0 && (e == null ? void 0 : e.second) !== null ? wf(e) : null) ?? h(this, fe, jc).call(this), a = En(), o = a === "24h", s = o ? v("EIDOLON.TimeTrigger.EditTimePlaceholder24", "HH:MM") : v("EIDOLON.TimeTrigger.EditTimePlaceholder12", "HH:MM AM/PM"), l = this.showControls ? v(
      "EIDOLON.TimeTrigger.EditTimeHint",
      "Double-click to set a specific time."
    ) : "", u = this.showControls ? v(
      "EIDOLON.TimeTrigger.EditTimeLabel",
      "New time (HH:MM or HH:MM AM/PM)"
    ) : "", f = ef.map((M) => ({
      minutes: M,
      label: M > 0 ? `+${M}` : `${M}`
    })), g = !!this.manageTimeEnabled, m = h(this, fe, ss).call(this);
    this.sceneAllowsRealTime = m;
    const y = v(
      "EIDOLON.TimeTrigger.SceneRealTimeEnable",
      "Enable automatic real-time flow for this scene."
    ), b = v(
      "EIDOLON.TimeTrigger.SceneRealTimeDisable",
      "Disable automatic real-time flow for this scene."
    ), p = v(
      "EIDOLON.TimeTrigger.SceneRealTimeManageDisabled",
      "Enable Manage Time in module settings to allow automatic real-time flow."
    );
    return {
      formattedTime: r,
      deltas: f,
      manageTimeEnabled: g,
      sceneAllowsRealTime: m,
      realTimeButtonLabel: g ? m ? b : y : p,
      isGM: ((I = game.user) == null ? void 0 : I.isGM) ?? !1,
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
  async close(e = {}) {
    var r, a;
    if (!e.force)
      return (this.rendered ?? this.isRendered ?? !1) || (D("TimeTriggerWindow close request rerendering", {
        sceneId: ((r = this.scene) == null ? void 0 : r.id) ?? null
      }), this.render({ force: !0 })), this;
    D("Closing time trigger window", { sceneId: ((a = this.scene) == null ? void 0 : a.id) ?? null, force: !0 });
    const i = await super.close(e);
    return h(this, fe, Wc).call(this), h(this, fe, Jc).call(this), i;
  }
  async _advanceTime(e) {
    var r, a, o, s, l, u, f;
    const i = e * 60;
    if (D("Advancing world time", { sceneId: ((r = this.scene) == null ? void 0 : r.id) ?? null, minutes: e, seconds: i }), !((a = game.user) != null && a.isGM)) {
      (s = (o = ui.notifications) == null ? void 0 : o.warn) == null || s.call(o, v("EIDOLON.TimeTrigger.GMOnly", "Only the GM can adjust time."));
      return;
    }
    try {
      await game.time.advance(i);
    } catch (g) {
      console.error(`${L} | Failed to advance time`, g), (u = (l = ui.notifications) == null ? void 0 : l.error) == null || u.call(
        l,
        v("EIDOLON.TimeTrigger.Error", "Failed to update the world time.")
      ), D("Failed to advance time from window", {
        sceneId: ((f = this.scene) == null ? void 0 : f.id) ?? null,
        minutes: e,
        message: (g == null ? void 0 : g.message) ?? String(g)
      });
    }
  }
  _onRender(e, i) {
    var a;
    super._onRender(e, i);
    const r = this.element;
    if (r) {
      if (this.showControls) {
        D("Binding time trigger interactions", {
          sceneId: ((a = this.scene) == null ? void 0 : a.id) ?? null,
          buttonCount: r.querySelectorAll("[data-delta]").length
        }), r.querySelectorAll("[data-delta]").forEach((u) => {
          u.addEventListener("click", d(this, Oa));
        });
        const o = r.querySelector('.time-trigger-window__time-value[data-editable="true"]');
        o && o.addEventListener("dblclick", d(this, Aa), { once: !1 });
        const s = r.querySelector(".time-trigger-window__time-input");
        s && (s.addEventListener("keydown", d(this, Ma)), s.addEventListener("blur", d(this, Na)), typeof s.focus == "function" && (s.focus(), typeof s.select == "function" && s.select()));
        const l = r.querySelector('[data-action="toggle-real-time"]');
        l && l.addEventListener("click", d(this, xa));
      }
      this._suppressBlurCommit = !1;
    }
  }
};
Bn = new WeakMap(), jn = new WeakMap(), fe = new WeakSet(), jc = /* @__PURE__ */ c(function() {
  var l;
  const e = (l = game.time) == null ? void 0 : l.worldTime;
  if (typeof e != "number" || !Number.isFinite(e)) return "";
  const i = 1440 * 60, r = (Math.floor(e) % i + i) % i, a = Math.floor(r / 3600), o = Math.floor(r % 3600 / 60), s = r % 60;
  return aa({ hours: a, minutes: o, seconds: s }, En());
}, "#formatFallbackTime"), Oa = new WeakMap(), Aa = new WeakMap(), Uc = /* @__PURE__ */ c(function() {
  var e;
  (e = game.user) != null && e.isGM && (this.isEditingTime = !0, this._suppressBlurCommit = !1, this.editValue = h(this, fe, rs).call(this), this.render({ force: !0 }));
}, "#enterTimeEditMode"), ns = /* @__PURE__ */ c(function() {
  this.isEditingTime = !1, this.editValue = "", this._suppressBlurCommit = !1, this.render({ force: !0 });
}, "#cancelTimeEdit"), is = /* @__PURE__ */ c(async function(e) {
  var a, o, s;
  if (!((a = game.user) != null && a.isGM) || !this.isEditingTime || this._commitTimeInProgress) return;
  this._commitTimeInProgress = !0;
  const i = typeof e == "string" ? e.trim() : "";
  if (!i) {
    h(this, fe, ns).call(this), this._commitTimeInProgress = !1;
    return;
  }
  const r = h(this, fe, Gc).call(this, i);
  if (r.error) {
    (s = (o = ui.notifications) == null ? void 0 : o.error) == null || s.call(o, r.error), this._suppressBlurCommit = !0, this.editValue = i, this.render({ force: !0 }), this._commitTimeInProgress = !1;
    return;
  }
  try {
    await h(this, fe, zc).call(this, r.seconds, r.includeSeconds) ? (this.isEditingTime = !1, this.editValue = "", this.render({ force: !0 })) : (this.editValue = i, this.render({ force: !0 }));
  } finally {
    this._commitTimeInProgress = !1;
  }
}, "#commitTimeInput"), Ma = new WeakMap(), Na = new WeakMap(), Vc = /* @__PURE__ */ c(function() {
  var u, f;
  const e = (u = game.time) == null ? void 0 : u.worldTime;
  if (typeof e != "number" || !Number.isFinite(e))
    return "";
  const i = ((f = game.time) == null ? void 0 : f.components) ?? {}, r = Number(i.hour), a = Number(i.minute), o = i.second !== void 0 ? Number(i.second) : null, s = Number.isInteger(o);
  return (Number.isFinite(r) && Number.isFinite(a) ? Ht({
    hours: Math.max(0, Math.min(23, Number(r))),
    minutes: Math.max(0, Math.min(59, Number(a))),
    seconds: s && Number.isFinite(o) ? Math.max(0, Math.min(59, Number(o))) : void 0
  }) ?? "" : "") ?? "";
}, "#getCurrentCanonicalTime"), zc = /* @__PURE__ */ c(async function(e, i) {
  var m, y, b, p, E, T, I, M, $, k;
  const r = (m = game.time) == null ? void 0 : m.worldTime;
  if (typeof r != "number" || !Number.isFinite(r))
    return (b = (y = ui.notifications) == null ? void 0 : y.error) == null || b.call(
      y,
      v(
        "EIDOLON.TimeTrigger.EditTimeUnavailable",
        "The world time is unavailable, so it can't be updated."
      )
    ), !1;
  if (!Number.isInteger(e) || e < 0 || e >= pi)
    return (E = (p = ui.notifications) == null ? void 0 : p.error) == null || E.call(
      p,
      v(
        "EIDOLON.TimeTrigger.EditTimeInvalidRange",
        "Enter a time within the current day."
      )
    ), !1;
  const s = Math.floor(r / pi) * pi + e - r;
  if (!Number.isFinite(s) || s === 0)
    return !0;
  const l = Math.floor(e / 3600), u = Math.floor(e % 3600 / 60), f = e % 60, g = Ht({
    hours: l,
    minutes: u,
    seconds: i ? f : void 0
  });
  try {
    D("Updating world time directly", {
      sceneId: ((T = this.scene) == null ? void 0 : T.id) ?? null,
      targetCanonical: g ?? null,
      diff: s
    }), await game.time.advance(s);
    const _ = aa(
      {
        hours: l,
        minutes: u,
        seconds: i ? f : null
      },
      En()
    );
    (M = (I = ui.notifications) == null ? void 0 : I.info) == null || M.call(
      I,
      v(
        "EIDOLON.TimeTrigger.EditTimeSuccess",
        "World time updated."
      ) + (_ ? ` ${_}` : "")
    );
  } catch (_) {
    return console.error(`${L} | Failed to set world time`, _), (k = ($ = ui.notifications) == null ? void 0 : $.error) == null || k.call(
      $,
      v(
        "EIDOLON.TimeTrigger.EditTimeError",
        "Failed to update the world time."
      )
    ), !1;
  }
  return !0;
}, "#applyTargetSeconds"), Gc = /* @__PURE__ */ c(function(e) {
  var g;
  const i = v(
    "EIDOLON.TimeTrigger.EditTimeInvalid",
    "Enter a valid time like 14:30 or 2:30 PM."
  );
  if (typeof e != "string")
    return { error: i };
  const r = e.trim();
  if (!r)
    return { error: i };
  const a = r.match(/^([0-9]{1,2}):([0-9]{2})(?::([0-9]{2}))?$/);
  if (a) {
    const m = Number(a[1]), y = Number(a[2]), b = a[3] !== void 0 ? Number(a[3]) : void 0;
    if (Number.isInteger(m) && m >= 0 && m <= 23 && Number.isInteger(y) && y >= 0 && y <= 59 && (b === void 0 || Number.isInteger(b) && b >= 0 && b <= 59)) {
      const p = m * 3600 + y * 60 + (b ?? 0);
      return {
        canonical: Ht({ hours: m, minutes: y, seconds: b }),
        seconds: p,
        includeSeconds: b !== void 0,
        error: null
      };
    }
    return { error: i };
  }
  const { amLower: o, pmLower: s, periodPattern: l } = h(this, fe, as).call(this), u = r.match(
    new RegExp(
      `^([0-9]{1,2}):([0-9]{2})(?::([0-9]{2}))?\\s*(${l})$`,
      "i"
    )
  );
  if (u) {
    let m = Number(u[1]);
    const y = Number(u[2]), b = u[3] !== void 0 ? Number(u[3]) : void 0, p = u[4] ?? "", E = typeof p == "string" ? ((g = p.toLocaleLowerCase) == null ? void 0 : g.call(p)) ?? p.toLowerCase() : "";
    if (Number.isInteger(m) && m >= 1 && m <= 12 && Number.isInteger(y) && y >= 0 && y <= 59 && (b === void 0 || Number.isInteger(b) && b >= 0 && b <= 59) && (E === o || E === s || E === "am" || E === "pm")) {
      m = m % 12, (E === s || E === "pm") && (m += 12);
      const I = m * 3600 + y * 60 + (b ?? 0);
      return {
        canonical: Ht({ hours: m, minutes: y, seconds: b }),
        seconds: I,
        includeSeconds: b !== void 0,
        error: null
      };
    }
    return { error: i };
  }
  const f = Fc(r);
  if (f !== null) {
    const m = Math.floor(f / 3600), y = Math.floor(f % 3600 / 60), b = f % 60, p = b !== 0;
    return {
      canonical: Ht({
        hours: m,
        minutes: y,
        seconds: p ? b : void 0
      }),
      seconds: f,
      includeSeconds: p,
      error: null
    };
  }
  return { error: i };
}, "#parseInputTime"), rs = /* @__PURE__ */ c(function() {
  const e = h(this, fe, Vc).call(this);
  if (!e) return "";
  if (En() === "24h")
    return e;
  const r = ro(e);
  if (!r) return e;
  const a = Number(r.hours), o = Number(r.minutes), s = r.seconds !== null && r.seconds !== void 0 ? Number(r.seconds) : void 0;
  if (!Number.isFinite(a) || !Number.isFinite(o)) return e;
  const l = Number.isFinite(s), u = a % 12 === 0 ? 12 : a % 12, f = String(o).padStart(2, "0"), g = l ? `:${String(s).padStart(2, "0")}` : "", { amLabel: m, pmLabel: y } = h(this, fe, as).call(this), b = a >= 12 ? y : m;
  return `${u}:${f}${g} ${b}`.trim();
}, "#getInitialEditValue"), as = /* @__PURE__ */ c(function() {
  var u, f;
  const e = v("EIDOLON.TimeTrigger.TimePeriodAM", "AM"), i = v("EIDOLON.TimeTrigger.TimePeriodPM", "PM"), r = ((u = e.toLocaleLowerCase) == null ? void 0 : u.call(e)) ?? e.toLowerCase(), a = ((f = i.toLocaleLowerCase) == null ? void 0 : f.call(i)) ?? i.toLowerCase(), o = h(this, fe, os).call(this, e), s = h(this, fe, os).call(this, i), l = `${o}|${s}|AM|PM`;
  return {
    amLabel: e,
    pmLabel: i,
    amLower: r,
    pmLower: a,
    periodPattern: l
  };
}, "#getPeriodMatchData"), os = /* @__PURE__ */ c(function(e) {
  return typeof e != "string" ? "" : e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}, "#escapeForRegex"), ka = new WeakMap(), xa = new WeakMap(), ss = /* @__PURE__ */ c(function() {
  const e = this.scene;
  if (!e || typeof e.getFlag != "function") return !1;
  try {
    return !!e.getFlag(L, Vo);
  } catch (i) {
    D("TimeTriggerWindow | Failed to read scene real-time flag", {
      sceneId: (e == null ? void 0 : e.id) ?? null,
      message: (i == null ? void 0 : i.message) ?? String(i)
    });
  }
  return !1;
}, "#readSceneRealTimeFlag"), $a = new WeakMap(), Wc = /* @__PURE__ */ c(function() {
  if (typeof d(this, Bn) == "function")
    try {
      d(this, Bn).call(this);
    } catch (e) {
      console.error(`${L} | Failed to dispose time format subscription`, e);
    }
  A(this, Bn, null);
}, "#disposeTimeFormatSubscription"), Jc = /* @__PURE__ */ c(function() {
  if (typeof d(this, jn) == "function")
    try {
      d(this, jn).call(this);
    } catch (e) {
      console.error(`${L} | Failed to dispose manage time subscription`, e);
    }
  A(this, jn, null);
}, "#disposeManageTimeSubscription"), c(Rn, "TimeTriggerWindow"), Me(Rn, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  ze(Rn, Rn, "DEFAULT_OPTIONS"),
  {
    id: `${L}-time-trigger`,
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
)), Me(Rn, "PARTS", {
  content: {
    template: `modules/${L}/templates/time-trigger.html`
  }
});
let ts = Rn;
function ao(t, n = {}) {
  if (typeof t != "function")
    throw new TypeError("createApplicationFactory requires a constructor function.");
  const e = /* @__PURE__ */ c(function(r = {}) {
    const a = foundry.utils.mergeObject(
      n ?? {},
      r ?? {},
      { inplace: !1 }
    );
    return new t(a);
  }, "applicationFactory");
  return e.__eidolonFactorySignature = "options", e.__eidolonFactoryTarget = t, e;
}
c(ao, "createApplicationFactory");
const Ul = /* @__PURE__ */ new Set();
var xe, nt, Un, ki, Kc, Yc;
const Al = class Al {
  constructor({ windowFactory: n } = {}) {
    x(this, ki);
    x(this, xe, null);
    x(this, nt, null);
    x(this, Un);
    const e = ao(ts);
    typeof n == "function" ? n.__eidolonFactorySignature === "options" ? A(this, Un, (r, a = {}) => n({ scene: r, ...a ?? {} })) : A(this, Un, n) : A(this, Un, /* @__PURE__ */ c((r, a = {}) => e({ scene: r, ...a ?? {} }), "fallbackFactory"));
  }
  onReady() {
    var e;
    const n = typeof ((e = game.time) == null ? void 0 : e.worldTime) == "number" && Number.isFinite(game.time.worldTime) ? game.time.worldTime : null;
    D("TimeTriggerManager#onReady", { worldTime: n }), n !== null && A(this, nt, n);
  }
  onCanvasReady(n) {
    const e = (n == null ? void 0 : n.scene) ?? qi();
    D("TimeTriggerManager#onCanvasReady", { sceneId: (e == null ? void 0 : e.id) ?? null }), this.refreshTimeTriggerWindow(e), this.handleTimeTriggerEvaluation(e);
  }
  onUpdateScene(n) {
    const e = qi();
    D("TimeTriggerManager#onUpdateScene", {
      sceneId: (n == null ? void 0 : n.id) ?? null,
      activeSceneId: (e == null ? void 0 : e.id) ?? null
    }), !(!e || n.id !== e.id) && (this.refreshTimeTriggerWindow(n), this.handleTimeTriggerEvaluation(n));
  }
  onUpdateWorldTime(n, e) {
    D("TimeTriggerManager#onUpdateWorldTime", {
      worldTime: n,
      diff: e,
      hasWindow: !!d(this, xe)
    }), d(this, xe) && d(this, xe).render();
    const i = qi(), r = h(this, ki, Kc).call(this, n, e);
    this.handleTimeTriggerEvaluation(i, n, r);
  }
  refreshTimeTriggerWindow(n) {
    var l, u, f;
    if (!n) return;
    const e = !!((l = game.user) != null && l.isGM), i = !!n.getFlag(L, ta), r = !!n.getFlag(L, jo), a = !!n.getFlag(L, Uo);
    if (D("TimeTriggerManager#refreshTimeTriggerWindow", {
      sceneId: n.id,
      isGM: e,
      isActive: i,
      hideWindow: r,
      showPlayerWindow: a
    }), !(i && !r && (e || a))) {
      d(this, xe) && (D("Closing time trigger window", { reason: "not-visible" }), d(this, xe).close({ force: !0 }), A(this, xe, null));
      return;
    }
    const s = !!e;
    if (d(this, xe) && ((u = d(this, xe).scene) == null ? void 0 : u.id) === n.id) {
      D("Refreshing existing time trigger window", { sceneId: n.id }), d(this, xe).showControls = s, d(this, xe).render();
      return;
    }
    d(this, xe) && (D("Closing existing window before creating new instance", {
      previousSceneId: ((f = d(this, xe).scene) == null ? void 0 : f.id) ?? null
    }), d(this, xe).close({ force: !0 })), A(this, xe, d(this, Un).call(this, n, { showControls: s })), D("Rendering new time trigger window", { sceneId: n.id }), d(this, xe).render({ force: !0 });
  }
  async handleTimeTriggerEvaluation(n, e, i) {
    var l;
    const r = n ?? qi();
    if (!r) {
      D("handleTimeTriggerEvaluation skipped", {
        reason: "no-active-scene",
        providedSceneId: (n == null ? void 0 : n.id) ?? null,
        currentWorldTime: e
      }), typeof e == "number" && Number.isFinite(e) && A(this, nt, e);
      return;
    }
    const a = typeof e == "number" && Number.isFinite(e) ? e : typeof ((l = game.time) == null ? void 0 : l.worldTime) == "number" ? game.time.worldTime : null;
    if (a === null) return;
    const o = typeof i == "number" && Number.isFinite(i) ? i : null, s = o !== null ? o : typeof d(this, nt) == "number" && Number.isFinite(d(this, nt)) ? d(this, nt) : a;
    Ai("handleTimeTriggerEvaluation", {
      sceneId: r.id,
      previousWorldTime: s,
      currentWorldTime: a,
      overrideProvided: o !== null
    });
    try {
      await h(this, ki, Yc).call(this, r, s, a);
    } catch (u) {
      console.error(`${L} | Unexpected error while evaluating time triggers`, u), D("handleTimeTriggerEvaluation error", { message: (u == null ? void 0 : u.message) ?? String(u) });
    } finally {
      A(this, nt, a), vn();
    }
  }
};
xe = new WeakMap(), nt = new WeakMap(), Un = new WeakMap(), ki = new WeakSet(), Kc = /* @__PURE__ */ c(function(n, e) {
  return typeof d(this, nt) == "number" && Number.isFinite(d(this, nt)) ? (D("Resolved previous world time from cache", {
    previousWorldTime: d(this, nt)
  }), d(this, nt)) : typeof n == "number" && Number.isFinite(n) && typeof e == "number" && Number.isFinite(e) ? (D("Resolved previous world time using diff", {
    worldTime: n,
    diff: e,
    resolved: n - e
  }), n - e) : typeof n == "number" && Number.isFinite(n) ? n : null;
}, "#resolvePreviousWorldTime"), Yc = /* @__PURE__ */ c(async function(n, e, i) {
  var b, p, E;
  if (!((b = game.user) != null && b.isGM)) {
    D("Skipping trigger evaluation because user is not a GM");
    return;
  }
  if (!(n != null && n.id)) {
    D("Skipping trigger evaluation because the scene is missing an id");
    return;
  }
  if (!!!n.getFlag(L, ta)) {
    D("Skipping trigger evaluation because scene is inactive", { sceneId: n.id });
    return;
  }
  if (typeof i != "number" || !Number.isFinite(i)) return;
  (typeof e != "number" || !Number.isFinite(e)) && (e = i);
  const a = yi(n);
  if (!a.length) {
    D("No time triggers configured for scene", { sceneId: n.id });
    return;
  }
  const o = df(n), s = /* @__PURE__ */ new Set();
  for (const T of a)
    T != null && T.id && s.add(T.id);
  let l = !1;
  for (const T of Object.keys(o))
    s.has(T) || (delete o[T], l = !0);
  if (Ai("Evaluating scene time triggers", {
    sceneId: n.id,
    previousWorldTime: e,
    currentWorldTime: i,
    triggerCount: a.length
  }), i <= e) {
    D("Detected world time rewind", {
      previousWorldTime: e,
      currentWorldTime: i
    });
    for (const T of a) {
      if (!(T != null && T.id) || !T.allowReplayOnRewind) continue;
      const I = o[T.id];
      typeof I == "number" ? i < I ? (D("Clearing trigger history due to rewind", {
        triggerId: T.id,
        lastFired: I,
        currentWorldTime: i
      }), delete o[T.id], l = !0) : D("Preserving trigger history after rewind", {
        triggerId: T.id,
        lastFired: I,
        currentWorldTime: i
      }) : D("No history stored for rewind-enabled trigger", {
        triggerId: T.id
      });
    }
    l && (D("Persisting history cleanup after rewind", {
      sceneId: n.id
    }), await Oo(n, o)), vn();
    return;
  }
  const u = e, f = i, g = [], m = Math.floor(u / pi), y = Math.floor(f / pi);
  for (const T of a) {
    if (!(T != null && T.id)) continue;
    const I = Fc(T.time);
    if (I === null) {
      Cf(n, T), D("Skipping trigger with invalid time", {
        triggerId: T.id,
        time: T.time
      });
      continue;
    }
    for (let M = m; M <= y; M++) {
      const $ = M * pi + I;
      if ($ < u || $ > f) continue;
      const _ = o[T.id];
      if (typeof _ == "number" && _ >= $) {
        D("Skipping trigger because it already fired within window", {
          triggerId: T.id,
          lastFired: _,
          absoluteTime: $
        });
        continue;
      }
      g.push({ trigger: T, absoluteTime: $ });
    }
  }
  if (!g.length) {
    l && await Oo(n, o), D("No triggers scheduled to fire within evaluation window", {
      sceneId: n.id
    }), vn();
    return;
  }
  g.sort((T, I) => T.absoluteTime - I.absoluteTime), D("Queued triggers for execution", {
    entries: g.map((T) => ({
      triggerId: T.trigger.id,
      absoluteTime: T.absoluteTime
    }))
  });
  for (const T of g)
    try {
      D("Executing time trigger action", {
        triggerId: T.trigger.id,
        absoluteTime: T.absoluteTime
      }), await Bc(n, T.trigger);
    } catch (I) {
      console.error(`${L} | Failed to execute time trigger action`, I), (E = (p = ui.notifications) == null ? void 0 : p.error) == null || E.call(
        p,
        v(
          "EIDOLON.TimeTrigger.TriggerActionError",
          "Failed to execute a scene time trigger action. Check the console for details."
        )
      ), D("Trigger execution failed", {
        triggerId: T.trigger.id,
        message: (I == null ? void 0 : I.message) ?? String(I)
      });
    } finally {
      o[T.trigger.id] = T.absoluteTime, l = !0, D("Recorded trigger execution", {
        triggerId: T.trigger.id,
        absoluteTime: T.absoluteTime
      });
    }
  l && (D("Persisting trigger history updates", { sceneId: n.id }), await Oo(n, o)), vn();
}, "#evaluateSceneTimeTriggers"), c(Al, "TimeTriggerManager");
let ls = Al;
function Cf(t, n) {
  var r, a;
  const e = `${(t == null ? void 0 : t.id) ?? "unknown"}:${(n == null ? void 0 : n.id) ?? (n == null ? void 0 : n.time) ?? "unknown"}`;
  if (Ul.has(e)) return;
  Ul.add(e);
  const i = v(
    "EIDOLON.TimeTrigger.InvalidTimeWarning",
    "A scene time trigger has an invalid time value and was skipped."
  );
  (a = (r = ui.notifications) == null ? void 0 : r.warn) == null || a.call(r, i), console.warn(`${L} | Invalid time for trigger`, { scene: t == null ? void 0 : t.id, trigger: n });
}
c(Cf, "warnInvalidTriggerTime");
var Ct, Xi, St, ln, Vn, _t, Ci, Fa, Da, Zi, er, zn, Pt, W, us, ci, Hr, ds, qr, fs, $t, Qc, hs, Xc, gs, Zc, _a, Pa, Ra, Ha, qa, Ba, ms, eu, Br, ja, Ua;
const Ml = class Ml {
  constructor() {
    x(this, W);
    x(this, Ct, !1);
    x(this, Xi, br);
    x(this, St, /* @__PURE__ */ new Map());
    x(this, ln, null);
    x(this, Vn, null);
    x(this, _t, 0);
    x(this, Ci, null);
    x(this, Fa, null);
    x(this, Da, null);
    x(this, Zi, !1);
    x(this, er, !1);
    x(this, zn, !1);
    x(this, Pt, !1);
    x(this, _a, /* @__PURE__ */ c((n, e = {}) => {
      D("GameTimeAutomation | Pause state changed", {
        paused: n,
        userId: (e == null ? void 0 : e.userId) ?? null,
        broadcast: (e == null ? void 0 : e.broadcast) ?? null
      }), h(this, W, $t).call(this, { pausedOverride: n });
    }, "#handlePause"));
    x(this, Pa, /* @__PURE__ */ c((n) => {
      n != null && n.id && (d(this, St).set(n.id, Math.max(n.round ?? 0, 1)), D("GameTimeAutomation | Combat started", { combatId: n.id, round: n.round ?? 0 }), h(this, W, $t).call(this));
    }, "#handleCombatStart"));
    x(this, Ra, /* @__PURE__ */ c((n, e) => {
      if (!(n != null && n.id)) return;
      const i = typeof e == "number" && Number.isFinite(e) ? e : typeof n.round == "number" && Number.isFinite(n.round) ? n.round : 0, r = i > 0 ? i : 1, a = d(this, St).get(n.id), o = a ? Math.max(a, 1) : 1, s = r > 1 ? Math.max(r - o, 0) : 0;
      if (D("GameTimeAutomation | Combat round change detected", {
        combatId: n.id,
        effectiveRound: r,
        completedRounds: s,
        enabled: d(this, Ct),
        paused: (game == null ? void 0 : game.paused) ?? null
      }), s > 0 && d(this, Ct) && d(this, Pt) && !(game != null && game.paused) && h(this, W, ci).call(this) && h(this, W, Hr).call(this, n)) {
        const l = s * d(this, Xi);
        l > 0 && (D("GameTimeAutomation | Advancing time for completed combat rounds", {
          combatId: n.id,
          completedRounds: s,
          delta: l
        }), h(this, W, gs).call(this, l));
      }
      d(this, St).set(n.id, Math.max(r, 1));
    }, "#handleCombatRound"));
    x(this, Ha, /* @__PURE__ */ c((n) => {
      n != null && n.id && (d(this, St).delete(n.id), D("GameTimeAutomation | Combat ended", { combatId: n.id }), h(this, W, $t).call(this));
    }, "#handleCombatEnd"));
    x(this, qa, /* @__PURE__ */ c((n) => {
      n != null && n.id && (d(this, St).delete(n.id), D("GameTimeAutomation | Combat deleted", { combatId: n.id }), h(this, W, $t).call(this));
    }, "#handleCombatDelete"));
    x(this, Ba, /* @__PURE__ */ c((n, e) => {
      if (n != null && n.id) {
        if (typeof (e == null ? void 0 : e.round) == "number" && Number.isFinite(e.round)) {
          const i = Math.max(e.round, 1);
          d(this, St).set(n.id, i), D("GameTimeAutomation | Combat round manually updated", {
            combatId: n.id,
            round: i
          });
        }
        (Object.prototype.hasOwnProperty.call(e ?? {}, "active") || (e == null ? void 0 : e.round) !== void 0) && h(this, W, $t).call(this);
      }
    }, "#handleCombatUpdate"));
    x(this, ja, /* @__PURE__ */ c((n) => {
      h(this, W, Br).call(this, n == null ? void 0 : n.scene), h(this, W, $t).call(this);
    }, "#handleCanvasReady"));
    x(this, Ua, /* @__PURE__ */ c((n) => {
      if (!et(n)) return;
      const e = h(this, W, ms).call(this);
      if (!e || e.id !== n.id) return;
      h(this, W, Br).call(this, n) && h(this, W, $t).call(this);
    }, "#handleSceneUpdate"));
  }
  registerHooks() {
    d(this, Zi) || (A(this, Zi, !0), Hooks.on("pauseGame", d(this, _a)), Hooks.on("combatStart", d(this, Pa)), Hooks.on("combatRound", d(this, Ra)), Hooks.on("combatEnd", d(this, Ha)), Hooks.on("deleteCombat", d(this, qa)), Hooks.on("updateCombat", d(this, Ba)), Hooks.on("canvasReady", d(this, ja)), Hooks.on("updateScene", d(this, Ua)));
  }
  initialize() {
    d(this, er) || (A(this, er, !0), A(this, Fa, Pc((n) => {
      const e = !!n, i = e !== d(this, Ct);
      A(this, Ct, e), D("GameTimeAutomation | Manage time toggled", { enabled: e }), i && e && h(this, W, fs).call(this), h(this, W, $t).call(this);
    })), A(this, Da, lf((n) => {
      A(this, Xi, n), D("GameTimeAutomation | Seconds per round updated", { value: n });
    })), h(this, W, fs).call(this), h(this, W, Br).call(this), h(this, W, $t).call(this));
  }
};
Ct = new WeakMap(), Xi = new WeakMap(), St = new WeakMap(), ln = new WeakMap(), Vn = new WeakMap(), _t = new WeakMap(), Ci = new WeakMap(), Fa = new WeakMap(), Da = new WeakMap(), Zi = new WeakMap(), er = new WeakMap(), zn = new WeakMap(), Pt = new WeakMap(), W = new WeakSet(), us = /* @__PURE__ */ c(function() {
  var n;
  try {
    if (typeof ((n = globalThis.performance) == null ? void 0 : n.now) == "function")
      return globalThis.performance.now();
  } catch (e) {
    D("GameTimeAutomation | Failed to read high-resolution timestamp", {
      message: (e == null ? void 0 : e.message) ?? String(e)
    });
  }
  return Date.now();
}, "#currentTimestamp"), ci = /* @__PURE__ */ c(function() {
  var n;
  return !!((n = game == null ? void 0 : game.user) != null && n.isGM && game.user.active !== !1);
}, "#canControlTime"), Hr = /* @__PURE__ */ c(function(n) {
  var i, r;
  if (!n) return !1;
  if (n.active === !0) return !0;
  if (n.active === !1) return !1;
  const e = (i = game == null ? void 0 : game.combats) == null ? void 0 : i.active;
  return (e == null ? void 0 : e.id) === n.id ? !0 : ((r = game == null ? void 0 : game.combat) == null ? void 0 : r.id) === n.id ? game.combat.active ?? !0 : !1;
}, "#isCombatDocumentActive"), ds = /* @__PURE__ */ c(function(n) {
  return n ? typeof n.started == "boolean" ? n.started : (n.round ?? 0) > 0 : !1;
}, "#hasCombatStarted"), qr = /* @__PURE__ */ c(function() {
  var i;
  const n = Array.isArray((i = game == null ? void 0 : game.combats) == null ? void 0 : i.contents) ? game.combats.contents : [];
  for (const r of n)
    if (h(this, W, Hr).call(this, r) && h(this, W, ds).call(this, r))
      return !0;
  const e = game == null ? void 0 : game.combat;
  return !!(e && h(this, W, Hr).call(this, e) && h(this, W, ds).call(this, e));
}, "#isCombatRunning"), fs = /* @__PURE__ */ c(function() {
  var e;
  d(this, St).clear();
  const n = Array.isArray((e = game == null ? void 0 : game.combats) == null ? void 0 : e.contents) ? game.combats.contents : [];
  for (const i of n)
    i != null && i.id && d(this, St).set(i.id, Math.max(i.round ?? 0, 1));
}, "#hydrateRoundTracking"), $t = /* @__PURE__ */ c(function({ pausedOverride: n } = {}) {
  const e = typeof n == "boolean" ? n : !!(game != null && game.paused), i = d(this, Ct), r = d(this, Pt), a = i && r, o = {
    manageTimeEnabled: i,
    sceneAllowsRealTime: r,
    effectiveEnabled: a,
    paused: e,
    canControl: h(this, W, ci).call(this),
    combatRunning: h(this, W, qr).call(this),
    overrideApplied: typeof n == "boolean"
  };
  if (D("GameTimeAutomation | Sync running state", o), !a || !h(this, W, ci).call(this)) {
    h(this, W, hs).call(this);
    return;
  }
  h(this, W, Qc).call(this);
}, "#syncRunningState"), Qc = /* @__PURE__ */ c(function() {
  d(this, ln) === null && (A(this, Vn, h(this, W, us).call(this)), A(this, ln, globalThis.setInterval(() => h(this, W, Xc).call(this), 1e3)), D("GameTimeAutomation | Started real-time ticker"));
}, "#startRealTimeTicker"), hs = /* @__PURE__ */ c(function() {
  d(this, ln) !== null && (globalThis.clearInterval(d(this, ln)), A(this, ln, null), D("GameTimeAutomation | Stopped real-time ticker")), A(this, Vn, null), A(this, _t, 0), A(this, zn, !1);
}, "#stopRealTimeTicker"), Xc = /* @__PURE__ */ c(function() {
  if (!d(this, Ct) || !d(this, Pt) || !h(this, W, ci).call(this)) {
    h(this, W, hs).call(this);
    return;
  }
  const n = h(this, W, us).call(this);
  if (typeof n != "number" || !Number.isFinite(n)) return;
  const e = d(this, Vn) ?? n, i = (n - e) / 1e3;
  if (A(this, Vn, n), !Number.isFinite(i) || i <= 0) return;
  const r = !!(game != null && game.paused), a = h(this, W, qr).call(this);
  if (r || a) {
    d(this, zn) || D("GameTimeAutomation | Tick skipped", { paused: r, combatRunning: a }), A(this, zn, !0), A(this, _t, 0);
    return;
  }
  A(this, zn, !1), D("GameTimeAutomation | Real-time tick", { deltaSeconds: i }), h(this, W, gs).call(this, i);
}, "#tickRealTime"), gs = /* @__PURE__ */ c(function(n) {
  if (!d(this, Ct) || !d(this, Pt)) return;
  const e = Number(n);
  !Number.isFinite(e) || e <= 0 || (A(this, _t, d(this, _t) + e), !d(this, Ci) && A(this, Ci, h(this, W, Zc).call(this)));
}, "#queueAdvance"), Zc = /* @__PURE__ */ c(async function() {
  var n, e;
  for (; d(this, _t) > 0; ) {
    if (!d(this, Ct) || !d(this, Pt) || game != null && game.paused || !h(this, W, ci).call(this) || h(this, W, qr).call(this)) {
      A(this, _t, 0);
      break;
    }
    const i = d(this, _t);
    A(this, _t, 0);
    try {
      if (typeof ((n = game == null ? void 0 : game.time) == null ? void 0 : n.advance) == "function")
        D("GameTimeAutomation | Advancing world time", { delta: i }), await game.time.advance(i), D("GameTimeAutomation | World time advanced", {
          worldTime: ((e = game.time) == null ? void 0 : e.worldTime) ?? null
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
  A(this, Ci, null);
}, "#flushAdvanceQueue"), _a = new WeakMap(), Pa = new WeakMap(), Ra = new WeakMap(), Ha = new WeakMap(), qa = new WeakMap(), Ba = new WeakMap(), ms = /* @__PURE__ */ c(function() {
  const n = qi();
  return et(n) ? n : null;
}, "#getActiveSceneDocument"), eu = /* @__PURE__ */ c(function(n) {
  if (!et(n)) return !1;
  try {
    return !!n.getFlag(L, Vo);
  } catch (e) {
    return D("GameTimeAutomation | Failed to read scene real-time flag", {
      sceneId: (n == null ? void 0 : n.id) ?? null,
      message: (e == null ? void 0 : e.message) ?? String(e)
    }), !1;
  }
}, "#isSceneRealTimeAllowed"), Br = /* @__PURE__ */ c(function(n) {
  const e = et(n) ? n : h(this, W, ms).call(this), i = h(this, W, eu).call(this, e), r = d(this, Pt);
  return A(this, Pt, i), r !== i ? (D("GameTimeAutomation | Scene real-time allowance changed", {
    sceneId: (e == null ? void 0 : e.id) ?? null,
    allows: i
  }), !0) : !1;
}, "#refreshSceneAutomationState"), ja = new WeakMap(), Ua = new WeakMap(), c(Ml, "GameTimeAutomation");
let cs = Ml;
var Oc, cn, We, Gn, Jt, Va, Ne, tu, nu, iu, ru, za, ys, Ga, au, Wa, ou, su;
const zt = class zt extends Mn(An) {
  constructor(e = {}) {
    const { scene: i, trigger: r, triggerIndex: a, onSave: o, ...s } = e ?? {};
    super(s);
    x(this, Ne);
    x(this, cn, null);
    x(this, We, null);
    x(this, Gn, null);
    x(this, Jt, null);
    x(this, Va, /* @__PURE__ */ c(() => {
      (this.rendered ?? this.isRendered ?? !1) && (A(this, Jt, h(this, Ne, tu).call(this)), this.render({ force: !0 }));
    }, "#handleTimeFormatChange"));
    x(this, za, /* @__PURE__ */ c((e) => {
      var a, o;
      const i = e.currentTarget, r = i == null ? void 0 : i.closest("form");
      r && (D("Trigger action selection changed", {
        sceneId: ((a = this.scene) == null ? void 0 : a.id) ?? null,
        triggerId: ((o = this.trigger) == null ? void 0 : o.id) ?? null,
        actionId: (i == null ? void 0 : i.value) ?? null
      }), h(this, Ne, ys).call(this, i.value, r));
    }, "#onActionSelectChange"));
    x(this, Ga, /* @__PURE__ */ c((e) => {
      var u, f, g, m;
      e.preventDefault();
      const i = e.currentTarget, r = i == null ? void 0 : i.closest("form");
      if (!r) return;
      const a = (u = i.dataset) == null ? void 0 : u.target;
      if (!a) return;
      const o = typeof (CSS == null ? void 0 : CSS.escape) == "function" ? CSS.escape : (y) => y, s = r.querySelector(`[name="${o(a)}"]`);
      if (!s) return;
      D("Opening file picker for trigger", {
        sceneId: ((f = this.scene) == null ? void 0 : f.id) ?? null,
        triggerId: ((g = this.trigger) == null ? void 0 : g.id) ?? null,
        target: a
      }), new FilePicker({
        type: ((m = i.dataset) == null ? void 0 : m.type) || "audio",
        current: s.value,
        callback: /* @__PURE__ */ c((y) => {
          var b, p;
          s.value = y, s.dispatchEvent(new Event("change")), D("Trigger form file selected", {
            sceneId: ((b = this.scene) == null ? void 0 : b.id) ?? null,
            triggerId: ((p = this.trigger) == null ? void 0 : p.id) ?? null,
            target: a,
            path: y
          });
        }, "callback")
      }).render({ force: !0 });
    }, "#onFilePicker"));
    x(this, Wa, /* @__PURE__ */ c(async (e) => {
      var r, a;
      e.preventDefault();
      const i = e.currentTarget;
      i instanceof HTMLFormElement && (D("Trigger form submitted", {
        sceneId: ((r = this.scene) == null ? void 0 : r.id) ?? null,
        triggerId: ((a = this.trigger) == null ? void 0 : a.id) ?? null
      }), await h(this, Ne, ou).call(this, i));
    }, "#onSubmit"));
    this.scene = i ?? null, this.trigger = r ?? null, this.triggerIndex = Number.isInteger(a) ? Number(a) : null, this.onSave = typeof o == "function" ? o : null, A(this, Gn, fl(d(this, Va)));
  }
  async _prepareContext() {
    var e, i;
    Ai("TriggerFormApplication#_prepareContext", {
      sceneId: ((e = this.scene) == null ? void 0 : e.id) ?? null,
      triggerId: ((i = this.trigger) == null ? void 0 : i.id) ?? null,
      triggerIndex: this.triggerIndex
    });
    try {
      const r = this.trigger ?? { action: Rr, data: {} }, a = r.action ?? Rr, o = jl(r.time), s = o.format ?? "12h", l = s === "12h" ? Tf() : [], u = o.period ?? (l.length > 0 ? l[0].value : null), f = s === "12h" ? l.map((y) => ({
        ...y,
        selected: y.value === u
      })) : [], g = Bl().map((y) => ({
        id: y.id,
        label: typeof y.label == "function" ? y.label() : y.label,
        selected: y.id === a
      })), m = Bl().map((y) => {
        const b = y.id === r.action ? r : { ...r, action: y.id }, p = mf(b);
        return p ? {
          id: y.id,
          visible: y.id === a,
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
        timePeriodOptions: f,
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
      vn();
    }
  }
  _onRender(e, i) {
    var l, u, f;
    super._onRender(e, i);
    const r = this.element;
    if (!r) return;
    D("Trigger form rendered", {
      sceneId: ((l = this.scene) == null ? void 0 : l.id) ?? null,
      triggerId: ((u = this.trigger) == null ? void 0 : u.id) ?? null
    });
    const a = Array.from(((f = document == null ? void 0 : document.body) == null ? void 0 : f.classList) ?? []).find(
      (g) => g.startsWith("theme-")
    );
    a && r.classList.add(a);
    const o = r.querySelector("form");
    if (!o) return;
    h(this, Ne, au).call(this, o), h(this, Ne, nu).call(this, o), o.addEventListener("submit", d(this, Wa));
    const s = o.querySelector("[data-action-select]");
    s && (s.addEventListener("change", d(this, za)), h(this, Ne, ys).call(this, s.value, o)), o.querySelectorAll("[data-action-file-picker]").forEach((g) => {
      g.addEventListener("click", d(this, Ga));
    });
  }
  async close(e = {}) {
    var i;
    if ((i = d(this, cn)) == null || i.call(this), A(this, cn, null), A(this, We, null), A(this, Jt, null), typeof d(this, Gn) == "function")
      try {
        d(this, Gn).call(this);
      } catch (r) {
        console.error(`${L} | Failed to dispose trigger form time format subscription`, r);
      }
    return A(this, Gn, null), super.close(e);
  }
};
cn = new WeakMap(), We = new WeakMap(), Gn = new WeakMap(), Jt = new WeakMap(), Va = new WeakMap(), Ne = new WeakSet(), tu = /* @__PURE__ */ c(function() {
  var s, l, u, f, g, m, y;
  const e = (l = (s = this.element) == null ? void 0 : s.querySelector) == null ? void 0 : l.call(s, "form");
  if (!(e instanceof HTMLFormElement)) return null;
  const i = Array.from(e.elements ?? []), r = [];
  for (const b of i)
    if ((b instanceof HTMLInputElement || b instanceof HTMLSelectElement || b instanceof HTMLTextAreaElement) && b.name && !(((u = b.dataset) == null ? void 0 : u.timeHidden) !== void 0 || ((f = b.dataset) == null ? void 0 : f.timeHour) !== void 0 || ((g = b.dataset) == null ? void 0 : g.timeMinute) !== void 0 || ((m = b.dataset) == null ? void 0 : m.timePeriod) !== void 0)) {
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
  const a = e.querySelector("[data-time-format]");
  let o = null;
  if (a instanceof HTMLElement) {
    const b = a.querySelector("[data-time-hidden]"), p = a.querySelector("[data-time-hour]"), E = a.querySelector("[data-time-minute]"), T = a.querySelector("[data-time-period]");
    o = {
      format: ((y = a.dataset) == null ? void 0 : y.timeFormat) ?? null,
      canonical: b instanceof HTMLInputElement ? b.value : "",
      hour: p instanceof HTMLInputElement ? p.value : "",
      minute: E instanceof HTMLInputElement ? E.value : "",
      period: T instanceof HTMLSelectElement ? T.value : ""
    };
  }
  return {
    fields: r,
    time: o
  };
}, "#captureFormState"), nu = /* @__PURE__ */ c(function(e) {
  if (!d(this, Jt)) return;
  if (!(e instanceof HTMLFormElement)) {
    A(this, Jt, null);
    return;
  }
  const { fields: i = [], time: r = null } = d(this, Jt) ?? {};
  A(this, Jt, null), h(this, Ne, iu).call(this, e, i), h(this, Ne, ru).call(this, e, r);
}, "#restorePendingFormState"), iu = /* @__PURE__ */ c(function(e, i) {
  if (!Array.isArray(i) || i.length === 0) return;
  const r = typeof (CSS == null ? void 0 : CSS.escape) == "function" ? CSS.escape : (a) => a;
  for (const a of i) {
    if (!a || typeof a.name != "string") continue;
    const o = r(a.name);
    if (a.kind === "checkbox" || a.kind === "radio") {
      const l = `input[type="${a.kind}"][name="${o}"]`, u = e.querySelectorAll(l);
      u.forEach((f) => {
        f instanceof HTMLInputElement && (u.length === 1 || f.value === a.value) && (f.checked = !!a.checked);
      });
      continue;
    }
    if (a.kind === "select-multiple") {
      const l = e.querySelector(`select[name="${o}"]`);
      if (!(l instanceof HTMLSelectElement)) continue;
      const u = new Set(Array.isArray(a.values) ? a.values : []);
      Array.from(l.options ?? []).forEach((f) => {
        f.selected = u.has(f.value);
      });
      continue;
    }
    const s = e.querySelector(`[name="${o}"]`);
    (s instanceof HTMLInputElement || s instanceof HTMLSelectElement || s instanceof HTMLTextAreaElement) && (s.value = a.value ?? "");
  }
}, "#restoreFieldValues"), ru = /* @__PURE__ */ c(function(e, i) {
  var I, M, $;
  const r = e.querySelector("[data-time-format]");
  if (!(r instanceof HTMLElement)) {
    typeof d(this, We) == "function" && d(this, We).call(this);
    return;
  }
  const a = ((I = r.dataset) == null ? void 0 : I.timeFormat) === "24h" ? "24h" : "12h", o = r.querySelector("[data-time-hour]"), s = r.querySelector("[data-time-minute]"), l = r.querySelector("[data-time-period]"), u = r.querySelector("[data-time-hidden]");
  if (!i) {
    if (o instanceof HTMLInputElement && (o.value = ""), s instanceof HTMLInputElement && (s.value = ""), l instanceof HTMLSelectElement) {
      const k = (($ = (M = l.options) == null ? void 0 : M[0]) == null ? void 0 : $.value) ?? "";
      l.value = k;
    }
    u instanceof HTMLInputElement && (u.value = ""), typeof d(this, We) == "function" && d(this, We).call(this);
    return;
  }
  const f = typeof i.canonical == "string" ? i.canonical : "", g = typeof i.period == "string" ? i.period : "", m = typeof i.hour == "string" ? i.hour : "", y = typeof i.minute == "string" ? i.minute : "";
  let b = "", p = "", E = g, T = f;
  if (f) {
    const k = jl(f, a);
    b = k.hour ?? "", p = k.minute ?? "", T = k.canonical ?? f, a === "12h" ? E = k.period ?? g : E = "";
  } else
    b = m, p = y, a !== "12h" && (E = "");
  if (o instanceof HTMLInputElement && (o.value = b ?? ""), s instanceof HTMLInputElement && (s.value = p ?? ""), l instanceof HTMLSelectElement)
    if (a === "12h") {
      const k = Array.from(l.options ?? []);
      k.find((H) => H.value === E) ? l.value = E : k.length > 0 ? l.value = k[0].value : l.value = "";
    } else
      l.value = "";
  u instanceof HTMLInputElement && (u.value = T ?? ""), typeof d(this, We) == "function" && d(this, We).call(this);
}, "#restoreTimeInputs"), za = new WeakMap(), ys = /* @__PURE__ */ c(function(e, i) {
  i && i.querySelectorAll("[data-action-config]").forEach((r) => {
    const a = r.dataset.actionConfig === e;
    r.style.display = a ? "" : "none";
  });
}, "#updateActionSections"), Ga = new WeakMap(), au = /* @__PURE__ */ c(function(e) {
  var g, m, y, b;
  if ((g = d(this, cn)) == null || g.call(this), A(this, cn, null), A(this, We, null), !(e instanceof HTMLFormElement)) return;
  const i = e.querySelector("[data-time-format]"), r = ((m = i == null ? void 0 : i.dataset) == null ? void 0 : m.timeFormat) ?? null;
  if (r !== "12h" && r !== "24h")
    return;
  const a = i.querySelector("[data-time-hidden]"), o = i.querySelector("[data-time-hour]"), s = i.querySelector("[data-time-minute]"), l = r === "12h" ? i.querySelector("[data-time-period]") : null;
  if (!a || !o || !s || r === "12h" && !l) {
    D("Trigger form time inputs missing elements", {
      format: r,
      hasHidden: !!a,
      hasHour: !!o,
      hasMinute: !!s,
      hasPeriod: !!l
    });
    return;
  }
  const u = [o, s, ...l ? [l] : []], f = /* @__PURE__ */ c(() => {
    const { canonical: p, error: E } = Ef(
      {
        hour: o.value,
        minute: s.value,
        period: (l == null ? void 0 : l.value) ?? null,
        time: a.value
      },
      r
    );
    a.value = p ?? "";
    const T = E ?? "";
    a.setCustomValidity(T), u.forEach((I) => {
      I.setCustomValidity(T);
    });
  }, "update");
  u.forEach((p) => {
    p.addEventListener("input", f), p.addEventListener("change", f);
  }), f(), A(this, cn, () => {
    u.forEach((p) => {
      p.removeEventListener("input", f), p.removeEventListener("change", f);
    });
  }), A(this, We, f), D("Trigger form configured for time input", {
    format: r,
    sceneId: ((y = this.scene) == null ? void 0 : y.id) ?? null,
    triggerId: ((b = this.trigger) == null ? void 0 : b.id) ?? null
  });
}, "#setupTimeInput"), Wa = new WeakMap(), ou = /* @__PURE__ */ c(async function(e) {
  var a, o, s, l, u;
  if (typeof d(this, We) == "function" && d(this, We).call(this), typeof e.checkValidity == "function" && !e.checkValidity()) {
    typeof e.reportValidity == "function" && e.reportValidity(), D("Trigger form submission blocked by validity check", {
      sceneId: ((a = this.scene) == null ? void 0 : a.id) ?? null,
      triggerId: ((o = this.trigger) == null ? void 0 : o.id) ?? null
    });
    return;
  }
  const i = new FormData(e), r = Object.fromEntries(i.entries());
  delete r.timeHour, delete r.timeMinute, delete r.timePeriod, r.allowReplayOnRewind = ((s = e.querySelector('input[name="allowReplayOnRewind"]')) == null ? void 0 : s.checked) ?? !1, D("Processing trigger form submission", {
    sceneId: ((l = this.scene) == null ? void 0 : l.id) ?? null,
    triggerId: ((u = this.trigger) == null ? void 0 : u.id) ?? null,
    allowReplayOnRewind: r.allowReplayOnRewind
  }), await h(this, Ne, su).call(this, r), await this.close();
}, "#handleSubmit"), su = /* @__PURE__ */ c(async function(e) {
  var a, o, s, l, u, f;
  const i = {
    id: ((a = this.trigger) == null ? void 0 : a.id) ?? tf(),
    time: e.time ?? "",
    action: e.action ?? Rr,
    allowReplayOnRewind: !!e.allowReplayOnRewind,
    data: {}
  };
  D("Persisting trigger from form", {
    sceneId: ((o = this.scene) == null ? void 0 : o.id) ?? null,
    triggerId: i.id,
    existingIndex: this.triggerIndex
  }), pf(i, e);
  const r = yi(this.scene);
  this.triggerIndex !== null && r[this.triggerIndex] ? r[this.triggerIndex] = i : r.push(i);
  try {
    await qc(this.scene, r), D("Trigger list saved", {
      sceneId: ((s = this.scene) == null ? void 0 : s.id) ?? null,
      triggerCount: r.length
    });
  } catch (g) {
    throw console.error(`${L} | Failed to save time trigger`, g), (u = (l = ui.notifications) == null ? void 0 : l.error) == null || u.call(
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
      console.error(`${L} | Trigger onSave callback failed`, g), D("Trigger onSave callback failed", {
        sceneId: ((f = this.scene) == null ? void 0 : f.id) ?? null,
        message: (g == null ? void 0 : g.message) ?? String(g)
      });
    }
}, "#persistTrigger"), c(zt, "TriggerFormApplication"), Me(zt, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  ze(zt, zt, "DEFAULT_OPTIONS"),
  {
    id: `${L}-trigger-form`,
    classes: Array.from(
      /* @__PURE__ */ new Set([...((Oc = ze(zt, zt, "DEFAULT_OPTIONS")) == null ? void 0 : Oc.classes) ?? [], "standard-form", "themed"])
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
)), Me(zt, "PARTS", {
  content: {
    template: `modules/${L}/templates/time-trigger-form.html`
  }
});
let ps = zt;
function Xt(t) {
  return t instanceof HTMLElement ? t : (t == null ? void 0 : t[0]) instanceof HTMLElement ? t[0] : null;
}
c(Xt, "asHTMLElement");
function jr(t) {
  return typeof (t == null ? void 0 : t.changeTab) == "function";
}
c(jr, "isAppV2");
function lu(t, n, e, i = {}) {
  if (jr(t)) {
    t.changeTab(n, e, i);
    return;
  }
  if (typeof (t == null ? void 0 : t.activateTab) == "function") {
    const r = { ...i };
    e != null && (r.group = e), r.triggerCallback == null && (r.triggerCallback = !0), t.activateTab(n, r);
  }
}
c(lu, "setActiveTab");
function Sf(t) {
  var e, i;
  if (!(t instanceof HTMLFormElement)) return {};
  const n = ((i = (e = foundry == null ? void 0 : foundry.applications) == null ? void 0 : e.ux) == null ? void 0 : i.FormDataExtended) ?? globalThis.FormDataExtended ?? null;
  if (!n) return {};
  try {
    const r = new n(t), a = typeof r.object == "object" ? r.object : {};
    return foundry.utils.expandObject(a);
  } catch {
    return {};
  }
}
c(Sf, "readFormData");
const Vl = Symbol.for("eidolon.sceneConfig.v13PatchedTabs");
function cu(t = {}) {
  const {
    tabId: n,
    tabLabel: e,
    getScene: i,
    isApplicable: r,
    renderContent: a,
    debugNamespace: o = "SceneConfigTab",
    onButtonCreate: s,
    onTabCreate: l,
    onAfterRender: u,
    logger: f = {},
    moduleId: g = "eidolon-utilities",
    tabIcon: m = "fa-solid fa-puzzle-piece"
  } = t ?? {};
  if (!n)
    throw new Error("createSceneConfigTabFactory requires a tabId.");
  if (typeof a != "function")
    throw new TypeError("createSceneConfigTabFactory requires a renderContent callback.");
  const y = typeof f.log == "function" ? f.log.bind(f) : (...R) => {
    var K;
    return (K = console.debug) == null ? void 0 : K.call(console, `${o}`, ...R);
  }, b = typeof f.group == "function" ? f.group.bind(f) : (...R) => {
    var K;
    return (K = console.groupCollapsed) == null ? void 0 : K.call(console, `${o}`, ...R);
  }, p = typeof f.groupEnd == "function" ? f.groupEnd.bind(f) : () => {
    var R;
    return (R = console.groupEnd) == null ? void 0 : R.call(console);
  }, E = Symbol(`EIDOLON_SCENE_CONFIG_TAB_CLEANUP_${n}`), T = typeof i == "function" ? i : () => null, I = typeof r == "function" ? r : () => !0, M = typeof e == "function" ? e : () => typeof e == "string" ? e : n;
  function $() {
    var Z, z, X, le, he;
    const R = ((z = (Z = foundry == null ? void 0 : foundry.applications) == null ? void 0 : Z.sheets) == null ? void 0 : z.SceneConfig) ?? ((X = CONFIG == null ? void 0 : CONFIG.Scene) == null ? void 0 : X.sheetClass);
    if (!R || !jr({ changeTab: (le = R.prototype) == null ? void 0 : le.changeTab })) return;
    const K = R[Vl] ?? /* @__PURE__ */ new Set();
    if (K.has(n)) return;
    K.add(n), R[Vl] = K;
    const Q = (he = R.TABS) == null ? void 0 : he.sheet;
    if (Q && Array.isArray(Q.tabs) && !Q.tabs.some((ae) => ae.id === n)) {
      const ae = M({ app: null, scene: null }) ?? n;
      Q.tabs.push({
        id: n,
        icon: m,
        label: ae
      });
    }
    R.PARTS && !R.PARTS[n] && (R.PARTS[n] = {
      template: `modules/${g}/templates/scene-config-tab-mount.hbs`,
      scrollable: [`.tab[data-tab="${n}"]`]
    }), y("Patched v13 SceneConfig TABS/PARTS", { tabId: n });
  }
  c($, "patchV13SceneConfig");
  function k(R, K) {
    var Z, z;
    const Q = T(R);
    if (!I(R, Q)) {
      y("Skipped render", {
        tabId: n,
        reason: "inapplicable",
        constructor: ((Z = R == null ? void 0 : R.constructor) == null ? void 0 : Z.name) ?? null
      });
      return;
    }
    b("render", {
      tabId: n,
      sceneId: (Q == null ? void 0 : Q.id) ?? null,
      constructor: ((z = R == null ? void 0 : R.constructor) == null ? void 0 : z.name) ?? null
    });
    try {
      const X = Xt(K) ?? Xt(R.element);
      if (!X) {
        y("Missing root element", { tabId: n });
        return;
      }
      jr(R) ? G(R, X, Q) : H(R, X, Q);
    } finally {
      p();
    }
  }
  c(k, "handleRender");
  function _(R, K, Q) {
    var X;
    if (!m) {
      R.textContent = K;
      return;
    }
    const Z = (X = R.querySelector("i")) == null ? void 0 : X.cloneNode(!0);
    R.textContent = "";
    const z = Z ?? document.createElement("i");
    if (Z || (z.className = m, Q && (z.inert = !0)), R.append(z, " "), Q) {
      const le = document.createElement("span");
      le.textContent = K, R.append(le);
    } else
      R.append(document.createTextNode(K));
  }
  c(_, "setButtonContent");
  function H(R, K, Q) {
    var qe, lt, _e, Ae, jt, ct, kt, O, S, w, N, F, te, j, ge, pe;
    const z = [
      "nav.sheet-tabs[data-group]",
      "nav.tabs[data-group]",
      "nav.sheet-tabs",
      "nav.tabs"
    ].map((me) => K.querySelector(me)).find((me) => me instanceof HTMLElement), le = [
      (qe = K.querySelector(".tab[data-tab]")) == null ? void 0 : qe.parentElement,
      K.querySelector(".sheet-body"),
      (_e = (lt = z == null ? void 0 : z.parentElement) == null ? void 0 : lt.querySelector) == null ? void 0 : _e.call(lt, ":scope > .sheet-body"),
      z == null ? void 0 : z.parentElement
    ].find((me) => me instanceof HTMLElement), he = ((Ae = z == null ? void 0 : z.dataset) == null ? void 0 : Ae.group) ?? ((kt = (ct = (jt = z == null ? void 0 : z.querySelector) == null ? void 0 : jt.call(z, "a[data-group]")) == null ? void 0 : ct.dataset) == null ? void 0 : kt.group) ?? ((w = (S = (O = z == null ? void 0 : z.querySelector) == null ? void 0 : O.call(z, "[data-group]")) == null ? void 0 : S.dataset) == null ? void 0 : w.group) ?? ((te = (F = (N = le == null ? void 0 : le.querySelector) == null ? void 0 : N.call(le, ".tab[data-group]")) == null ? void 0 : F.dataset) == null ? void 0 : te.group) ?? "main";
    if (!z || !le) {
      y("Missing navigation elements", {
        tabId: n,
        hasNav: !!z,
        hasBody: !!le
      });
      return;
    }
    let ae = z.querySelector(`[data-tab="${n}"]`);
    if (!ae) {
      ae = document.createElement("a"), ae.dataset.action = "tab", ae.dataset.group = he, ae.dataset.tab = n;
      const me = z.querySelector("a[data-tab]");
      (j = me == null ? void 0 : me.classList) != null && j.contains("item") && ae.classList.add("item"), z.appendChild(ae), typeof s == "function" && s({ app: R, button: ae, nav: z, scene: Q }), y("Created tab button", { tabId: n, group: he });
    }
    _(ae, M({ app: R, scene: Q }) ?? n, jr(R));
    let ce = le.querySelector(`.tab[data-tab="${n}"]`);
    if (!ce) {
      ce = document.createElement("div"), ce.classList.add("tab"), ce.dataset.tab = n, ce.dataset.group = he;
      const me = Lf(le);
      le.insertBefore(ce, me ?? null), typeof l == "function" && l({ app: R, tab: ce, body: le, scene: Q }), y("Created tab container", { tabId: n, group: he });
    }
    ((ge = ae.classList) == null ? void 0 : ge.contains("active")) || ce.classList.contains("active") ? (ae.classList.add("active"), ce.classList.add("active"), ce.removeAttribute("hidden")) : (ae.classList.remove("active"), ce.classList.remove("active"), ce.setAttribute("hidden", "true"));
    const Ue = /* @__PURE__ */ c(() => {
      var Ve, Nn;
      ((Ve = ae.classList) != null && Ve.contains("active") || ce.classList.contains("active")) && ((Nn = ae.classList) == null || Nn.add("active"), ce.classList.add("active"), ce.removeAttribute("hidden"), ce.removeAttribute("aria-hidden"), ce.style.display === "none" && (ce.style.display = ""));
    }, "ensureTabVisible"), Fe = /* @__PURE__ */ c(() => {
      Ue(), requestAnimationFrame(Ue);
    }, "scheduleEnsureTabVisible");
    ae.dataset.eidolonEnsureSceneTabVisibility || (ae.addEventListener("click", () => {
      lu(R, n, he), requestAnimationFrame(Ue);
    }), ae.dataset.eidolonEnsureSceneTabVisibility = "true"), Ao(R, E, y);
    const He = a({
      app: R,
      scene: Q,
      tab: ce,
      tabButton: ae,
      ensureTabVisible: Ue,
      scheduleEnsureTabVisible: Fe
    });
    typeof He == "function" && zl(R, E, He), typeof u == "function" && u({
      app: R,
      scene: Q,
      tab: ce,
      tabButton: ae,
      ensureTabVisible: Ue,
      scheduleEnsureTabVisible: Fe
    }), (pe = R.setPosition) == null || pe.call(R, { height: "auto" });
  }
  c(H, "handleRenderV1");
  function G(R, K, Q) {
    const Z = K.querySelector(`.tab[data-tab="${n}"]`), z = K.querySelector(`nav [data-tab="${n}"]`);
    if (!Z || !z) {
      y("v2 mount not found, falling back to v1 injection", { tabId: n }), H(R, K, Q);
      return;
    }
    _(z, M({ app: R, scene: Q }) ?? n, !0);
    const X = /* @__PURE__ */ c(() => {
      var ae;
      !((ae = z.classList) != null && ae.contains("active")) && !Z.classList.contains("active") || (Z.classList.add("active"), Z.removeAttribute("hidden"), Z.removeAttribute("aria-hidden"), Z.style.display === "none" && (Z.style.display = ""));
    }, "ensureTabVisible"), le = /* @__PURE__ */ c(() => {
      X(), requestAnimationFrame(X);
    }, "scheduleEnsureTabVisible");
    Ao(R, E, y);
    const he = a({
      app: R,
      scene: Q,
      tab: Z,
      tabButton: z,
      ensureTabVisible: X,
      scheduleEnsureTabVisible: le
    });
    typeof he == "function" && zl(R, E, he), typeof u == "function" && u({
      app: R,
      scene: Q,
      tab: Z,
      tabButton: z,
      ensureTabVisible: X,
      scheduleEnsureTabVisible: le
    });
  }
  c(G, "handleRenderV2");
  function ie(R) {
    Ao(R, E, y);
  }
  c(ie, "handleClose");
  function U() {
    return Hooks.once("init", () => {
      $();
    }), Hooks.on("renderSceneConfig", k), Hooks.on("closeSceneConfig", ie), () => ee();
  }
  c(U, "register");
  function ee() {
    Hooks.off("renderSceneConfig", k), Hooks.off("closeSceneConfig", ie);
  }
  return c(ee, "unregister"), { register: U, unregister: ee };
}
c(cu, "createSceneConfigTabFactory");
function zl(t, n, e) {
  if (!t || typeof e != "function") return;
  const i = t == null ? void 0 : t[n];
  Array.isArray(i) || (t[n] = []), t[n].push(e);
}
c(zl, "registerCleanup");
function Ao(t, n, e) {
  if (!t) return;
  const i = t == null ? void 0 : t[n];
  if (Array.isArray(i))
    for (; i.length > 0; ) {
      const r = i.pop();
      if (typeof r == "function")
        try {
          r();
        } catch (a) {
          e("Cleanup failed", { message: (a == null ? void 0 : a.message) ?? String(a) });
        }
    }
}
c(Ao, "invokeCleanup");
function Lf(t) {
  if (!(t instanceof HTMLElement)) return null;
  const n = [
    ":scope > footer.sheet-footer",
    ":scope > footer.form-footer",
    ":scope > .sheet-footer",
    ":scope > .form-footer",
    ":scope > footer"
  ];
  for (const e of n) {
    const i = t.querySelector(e);
    if (i instanceof HTMLElement) return i;
  }
  return null;
}
c(Lf, "findFooterElement$1");
const If = ao(ps), Of = `modules/${L}/templates/time-trigger-scene-tab.html`, Af = cu({
  tabId: "time-triggers",
  tabLabel: /* @__PURE__ */ c(() => v("EIDOLON.TimeTrigger.Tab", "Time Triggers"), "tabLabel"),
  getScene: Bt,
  isApplicable: xf,
  renderContent: /* @__PURE__ */ c(({ app: t, scene: n, tab: e }) => Nf(t, e, n), "renderContent"),
  logger: {
    log: D,
    group: Ai,
    groupEnd: vn
  }
});
function Mf() {
  return D("Registering SceneConfig render hook"), Af.register();
}
c(Mf, "registerSceneConfigHook");
function Nf(t, n, e) {
  if (!(n instanceof HTMLElement)) return;
  const i = et(e) ? e : Bt(t);
  oa(t, n, i);
  const r = fl(() => {
    oa(t, n, i);
  });
  return () => {
    if (typeof r == "function")
      try {
        r();
      } catch (a) {
        console.error(
          `${L} | Failed to dispose scene config time format subscription`,
          a
        );
      }
  };
}
c(Nf, "renderTimeTriggerTab");
async function oa(t, n, e) {
  var r, a;
  const i = e ?? Bt(t);
  Ai("renderTimeTriggersTabContent", { sceneId: (i == null ? void 0 : i.id) ?? null });
  try {
    if (!et(i)) {
      const Z = v(
        "EIDOLON.TimeTrigger.Unavailable",
        "Time triggers are unavailable for this configuration sheet."
      );
      n.innerHTML = `<p class="notes">${Z}</p>`, D("Scene lacks document for time triggers", { sceneId: (i == null ? void 0 : i.id) ?? null });
      return;
    }
    const o = `flags.${L}.${ta}`, s = `flags.${L}.${jo}`, l = `flags.${L}.${Uo}`, u = !!i.getFlag(L, ta), f = !!i.getFlag(L, jo), g = !!i.getFlag(L, Uo), m = yi(i);
    D("Rendering time trigger list", {
      sceneId: i.id,
      isActive: u,
      shouldHideWindow: f,
      shouldShowPlayerWindow: g,
      triggerCount: m.length
    });
    const y = v("EIDOLON.TimeTrigger.Activate", "Activate Time Trigger"), b = v(
      "EIDOLON.TimeTrigger.Description",
      "Enable scene time triggers so scheduled actions can run automatically."
    ), p = v(
      "EIDOLON.TimeTrigger.HideWindowLabel",
      "Hide Floating Time Window"
    ), E = v(
      "EIDOLON.TimeTrigger.HideWindowDescription",
      "Keep the floating time control window hidden while leaving time triggers active."
    ), T = v(
      "EIDOLON.TimeTrigger.ShowPlayerWindowLabel",
      "Share Floating Time Window with Players"
    ), I = v(
      "EIDOLON.TimeTrigger.ShowPlayerWindowDescription",
      "Let non-GM players see the floating time window (without time controls)."
    ), M = v(
      "EIDOLON.TimeTrigger.TriggerListLabel",
      "Scene Time Triggers"
    ), $ = v(
      "EIDOLON.TimeTrigger.TriggerListEmpty",
      "No time triggers configured for this scene."
    ), k = v("EIDOLON.TimeTrigger.AddTrigger", "Add Trigger"), _ = v("EIDOLON.TimeTrigger.EditTrigger", "Edit"), H = v("EIDOLON.TimeTrigger.DeleteTrigger", "Remove"), G = v("EIDOLON.TimeTrigger.TriggerNow", "Trigger Now"), ie = v("EIDOLON.TimeTrigger.AtLabel", "At"), U = v("EIDOLON.TimeTrigger.DoLabel", "Do"), ee = v("EIDOLON.TimeTrigger.MissingTime", "(No time set)"), R = m.map((Z, z) => {
      const he = (Z.time ? vf(Z.time) : "") || Z.time || "" || ee, ae = hf(Z.action), ce = [
        `${ie} ${he}`,
        `${U} ${ae}`,
        ...gf(Z)
      ];
      return {
        index: z,
        summaryParts: ce,
        tooltips: {
          triggerNow: G,
          edit: _,
          delete: H
        }
      };
    }), K = ((a = (r = foundry == null ? void 0 : foundry.applications) == null ? void 0 : r.handlebars) == null ? void 0 : a.renderTemplate) ?? (typeof renderTemplate == "function" ? renderTemplate : globalThis == null ? void 0 : globalThis.renderTemplate);
    if (typeof K != "function") {
      console.error(`${L} | renderTemplate is unavailable; cannot render scene tab.`), n.innerHTML = `<p class="notes">${$}</p>`;
      return;
    }
    let Q = "";
    try {
      Q = await K(Of, {
        flags: {
          active: o,
          hideWindow: s,
          showPlayerWindow: l
        },
        states: {
          isActive: u,
          hideWindow: f,
          showPlayerWindow: g
        },
        labels: {
          activate: y,
          hideWindow: p,
          showPlayerWindow: T,
          triggerList: M,
          empty: $,
          add: k
        },
        hints: {
          activate: b,
          hideWindow: E,
          showPlayerWindow: I
        },
        triggers: R,
        hasTriggers: R.length > 0
      });
    } catch (Z) {
      console.error(`${L} | Failed to render time trigger scene tab template`, Z), n.innerHTML = `<p class="notes">${$}</p>`;
      return;
    }
    n.innerHTML = Q, kf(t, n, i);
  } finally {
    vn();
  }
}
c(oa, "renderTimeTriggersTabContent");
function kf(t, n, e) {
  const i = e ?? Bt(t);
  if (!et(i)) return;
  const r = n.querySelector('[data-action="add-trigger"]');
  r && r.addEventListener("click", () => {
    D("Add trigger button clicked", { sceneId: i.id }), Gl(t, { scene: i });
  }), n.querySelectorAll('[data-action="edit-trigger"]').forEach((a) => {
    a.addEventListener("click", () => {
      const o = Number(a.dataset.index);
      if (!Number.isInteger(o)) return;
      const l = yi(i)[o];
      l && (D("Edit trigger button clicked", { sceneId: i.id, triggerId: l.id, index: o }), Gl(t, { trigger: l, triggerIndex: o, scene: i }));
    });
  }), n.querySelectorAll('[data-action="delete-trigger"]').forEach((a) => {
    a.addEventListener("click", async () => {
      var u, f;
      const o = Number(a.dataset.index);
      if (!Number.isInteger(o)) return;
      const s = yi(i), l = s[o];
      if (l) {
        s.splice(o, 1);
        try {
          D("Deleting trigger", {
            sceneId: i.id,
            index: o,
            triggerId: (l == null ? void 0 : l.id) ?? null
          }), await qc(i, s), await oa(t, n, i);
        } catch (g) {
          console.error(`${L} | Failed to delete time trigger`, g), (f = (u = ui.notifications) == null ? void 0 : u.error) == null || f.call(
            u,
            v(
              "EIDOLON.TimeTrigger.TriggerDeleteError",
              "Failed to remove the selected time trigger."
            )
          );
        }
      }
    });
  }), n.querySelectorAll('[data-action="fire-trigger"]').forEach((a) => {
    a.addEventListener("click", async () => {
      var u, f, g, m, y, b, p;
      const o = Number(a.dataset.index);
      if (!Number.isInteger(o)) return;
      const l = yi(i)[o];
      if (l) {
        if (!((u = game.user) != null && u.isGM)) {
          (g = (f = ui.notifications) == null ? void 0 : f.warn) == null || g.call(
            f,
            v("EIDOLON.TimeTrigger.GMOnly", "Only the GM can adjust time.")
          );
          return;
        }
        try {
          D("Manually firing trigger", { sceneId: i.id, triggerId: l.id, index: o }), await Bc(i, l), (y = (m = ui.notifications) == null ? void 0 : m.info) == null || y.call(
            m,
            v(
              "EIDOLON.TimeTrigger.TriggerNowSuccess",
              "Triggered the selected time trigger."
            )
          );
        } catch (E) {
          console.error(`${L} | Failed to execute time trigger manually`, E), (p = (b = ui.notifications) == null ? void 0 : b.error) == null || p.call(
            b,
            v(
              "EIDOLON.TimeTrigger.TriggerNowError",
              "Failed to execute the selected time trigger."
            )
          ), D("Manual trigger execution failed", {
            sceneId: i.id,
            triggerId: l.id,
            index: o,
            message: (E == null ? void 0 : E.message) ?? String(E)
          });
        }
      }
    });
  });
}
c(kf, "bindTimeTriggerTabEvents");
function Gl(t, n = {}) {
  var o;
  const e = n.scene ?? null, i = e && et(e) ? e : Bt(t);
  if (!et(i)) {
    console.warn(`${L} | Unable to open trigger form because no scene document is available.`);
    return;
  }
  D("Opening trigger form", {
    sceneId: i.id,
    triggerId: ((o = n.trigger) == null ? void 0 : o.id) ?? null,
    index: Number.isInteger(n.triggerIndex) ? Number(n.triggerIndex) : null
  }), If({
    scene: i,
    trigger: n.trigger ?? null,
    triggerIndex: n.triggerIndex ?? null,
    onSave: /* @__PURE__ */ c(() => {
      var l, u;
      const s = (u = (l = t.element) == null ? void 0 : l[0]) == null ? void 0 : u.querySelector('.tab[data-tab="time-triggers"]');
      s && oa(t, s, i);
    }, "onSave")
  }).render({ force: !0 });
}
c(Gl, "openTriggerForm");
function xf(t, n) {
  var a, o, s, l, u;
  if (!t) return !1;
  const e = ((o = (a = foundry == null ? void 0 : foundry.applications) == null ? void 0 : a.sheets) == null ? void 0 : o.SceneConfig) ?? (globalThis == null ? void 0 : globalThis.SceneConfig);
  if (e && t instanceof e) return !0;
  const i = (s = t == null ? void 0 : t.constructor) == null ? void 0 : s.name;
  if (typeof i == "string" && i.includes("SceneConfig")) return !0;
  if (n) {
    const f = globalThis == null ? void 0 : globalThis.Scene;
    if (f && n instanceof f || (n == null ? void 0 : n.documentName) === "Scene" || (n == null ? void 0 : n.documentName) === "scenes" || (n == null ? void 0 : n.collection) === "scenes") return !0;
  }
  const r = ((l = t == null ? void 0 : t.options) == null ? void 0 : l.baseApplication) ?? ((u = t == null ? void 0 : t.options) == null ? void 0 : u.id);
  return !!(typeof r == "string" && r.includes("SceneConfig"));
}
c(xf, "isRecognizedSceneConfig");
const Ar = new ls(), Wl = new cs();
function $f() {
  D("Registering time trigger hooks"), Hooks.once("init", () => {
    nf(), cf(), D("Time trigger settings registered during init");
  }), Mf(), D("Scene config hook registered"), Wl.registerHooks(), D("Time automation hooks registered"), Hooks.once("ready", () => {
    uf(), D("Ready hook fired"), Ar.onReady(), Wl.initialize();
  }), Hooks.on("canvasReady", (t) => {
    var n;
    D("canvasReady hook received", { scene: ((n = t == null ? void 0 : t.scene) == null ? void 0 : n.id) ?? null }), Ar.onCanvasReady(t);
  }), Hooks.on("updateScene", (t) => {
    D("updateScene hook received", { scene: (t == null ? void 0 : t.id) ?? null }), Ar.onUpdateScene(t);
  }), Hooks.on("updateWorldTime", (t, n) => {
    D("updateWorldTime hook received", { worldTime: t, diff: n }), Ar.onUpdateWorldTime(t, n);
  });
}
c($f, "registerTimeTriggerHooks");
$f();
const $e = L, uu = "criteria", gl = "state", Ff = "criteriaVersion", Df = 1, du = "enableCriteriaSurfaces";
let Jl = !1;
function _f() {
  var t;
  if (!Jl) {
    if (Jl = !0, !((t = game == null ? void 0 : game.settings) != null && t.register)) {
      console.warn(`${$e} | game.settings.register unavailable; scene criteria setting skipped.`);
      return;
    }
    game.settings.register($e, du, {
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
        Pf();
      }, "onChange")
    });
  }
}
c(_f, "registerSceneCriteriaSettings");
function oo() {
  var t;
  try {
    if ((t = game == null ? void 0 : game.settings) != null && t.get)
      return !!game.settings.get($e, du);
  } catch (n) {
    console.error(`${$e} | Failed to read criteria surfaces setting`, n);
  }
  return !0;
}
c(oo, "getCriteriaSurfacesEnabled");
function Pf() {
  var a, o, s, l, u;
  const t = v("EIDOLON.SceneCriteria.ReloadPromptTitle", "Reload Required"), n = `<p>${v(
    "EIDOLON.SceneCriteria.ReloadPromptBody",
    "Changes to criteria editor surfaces require a reload. Reload now?"
  )}</p>`, e = typeof ((a = foundry == null ? void 0 : foundry.utils) == null ? void 0 : a.debouncedReload) == "function", i = /* @__PURE__ */ c(() => {
    e ? foundry.utils.debouncedReload() : window.location.reload();
  }, "reload"), r = (s = (o = foundry == null ? void 0 : foundry.applications) == null ? void 0 : o.api) == null ? void 0 : s.DialogV2;
  if (typeof (r == null ? void 0 : r.confirm) == "function") {
    r.confirm({
      window: { title: t },
      content: n
    }).then((f) => {
      f && i();
    });
    return;
  }
  if (typeof (Dialog == null ? void 0 : Dialog.confirm) == "function") {
    Dialog.confirm({
      title: t,
      content: n,
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
c(Pf, "promptReloadForCriteriaSurfaces");
const sa = "Standard";
function bt(t) {
  var e;
  const n = (e = t == null ? void 0 : t.getFlag) == null ? void 0 : e.call(t, $e, uu);
  return n ? fu(n) : [];
}
c(bt, "getSceneCriteria");
async function so(t, n) {
  if (!(t != null && t.setFlag)) return;
  const e = fu(n);
  await t.setFlag($e, uu, e), await t.setFlag($e, Ff, Df);
  const i = vr(t, e);
  await t.setFlag($e, gl, i);
}
c(so, "setSceneCriteria");
function vr(t, n = null) {
  var r;
  const e = Array.isArray(n) ? n : bt(t), i = qt(((r = t == null ? void 0 : t.getFlag) == null ? void 0 : r.call(t, $e, gl)) ?? {});
  return pl(i, e);
}
c(vr, "getSceneCriteriaState");
async function Rf(t, n, e = null) {
  if (!(t != null && t.setFlag)) return;
  const i = Array.isArray(e) ? e : bt(t), r = pl(n, i);
  await t.setFlag($e, gl, r);
}
c(Rf, "setSceneCriteriaState");
function ml(t = "") {
  const n = typeof t == "string" ? t.trim() : "", e = hu(ws(n || "criterion"), /* @__PURE__ */ new Set());
  return {
    id: gu(),
    key: e,
    label: n,
    values: [sa],
    default: sa,
    order: 0
  };
}
c(ml, "createSceneCriterion");
function fu(t) {
  const n = Array.isArray(t) ? qt(t) : [], e = [], i = /* @__PURE__ */ new Set();
  return n.forEach((r, a) => {
    const o = bs(r, a, i);
    o && (e.push(o), i.add(o.key));
  }), e;
}
c(fu, "sanitizeCriteria$1");
function bs(t, n = 0, e = /* @__PURE__ */ new Set()) {
  if (!t || typeof t != "object") return null;
  const i = typeof t.id == "string" && t.id.trim() ? t.id.trim() : gu(), a = (typeof t.label == "string" ? t.label : typeof t.name == "string" ? t.name : "").trim(), o = typeof t.key == "string" && t.key.trim() ? ws(t.key) : ws(a || `criterion-${Number(n) + 1}`), s = hu(o, e), l = qf(t.values);
  let u = typeof t.default == "string" ? t.default.trim() : "";
  u || (u = l[0] ?? sa), l.includes(u) || l.unshift(u);
  const f = Number.isFinite(t.order) ? Number(t.order) : Number(n);
  return {
    id: i,
    key: s,
    label: a,
    values: l,
    default: u,
    order: f
  };
}
c(bs, "sanitizeCriterion");
function pl(t, n = []) {
  const e = t && typeof t == "object" ? qt(t) : {}, i = {};
  for (const r of n) {
    const a = e == null ? void 0 : e[r.key], o = typeof a == "string" ? a.trim() : "";
    o && r.values.includes(o) ? i[r.key] = o : i[r.key] = r.default;
  }
  return i;
}
c(pl, "sanitizeSceneCriteriaState");
function Hf(t) {
  return bt(t).map((e) => ({
    id: e.key,
    key: e.key,
    name: e.label,
    values: [...e.values]
  }));
}
c(Hf, "getSceneCriteriaCategories");
function qf(t) {
  const n = Array.isArray(t) ? t : [], e = [];
  for (const i of n) {
    if (typeof i != "string") continue;
    const r = i.trim();
    !r || e.includes(r) || e.push(r);
  }
  return e.length || e.push(sa), e;
}
c(qf, "sanitizeCriterionValues");
function ws(t) {
  return String(t ?? "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "criterion";
}
c(ws, "slugifyCriterionKey");
function hu(t, n) {
  if (!n.has(t)) return t;
  let e = 2;
  for (; n.has(`${t}-${e}`); )
    e += 1;
  return `${t}-${e}`;
}
c(hu, "ensureUniqueCriterionKey");
function gu() {
  var t;
  return (t = foundry == null ? void 0 : foundry.utils) != null && t.randomID ? foundry.utils.randomID() : typeof (crypto == null ? void 0 : crypto.randomUUID) == "function" ? crypto.randomUUID() : Math.random().toString(36).slice(2, 11);
}
c(gu, "generateCriterionId");
function mu(t) {
  var n, e;
  console.error(`${$e} | Failed to persist scene criteria`, t), (e = (n = ui.notifications) == null ? void 0 : n.error) == null || e.call(
    n,
    v(
      "EIDOLON.SceneCriteria.PersistError",
      "Failed to persist the scene criteria."
    )
  );
}
c(mu, "notifyPersistError");
var Ac, Ce, Kt, je, pu, Ja, Ka, Ya, Qa, Ur, Xa, tr, nr, Bi, yu;
const Gt = class Gt extends Mn(An) {
  constructor(e = {}) {
    const { scene: i, criterion: r, isNew: a, onSave: o, ...s } = e ?? {};
    super(s);
    x(this, je);
    x(this, Ce, null);
    x(this, Kt, !1);
    x(this, Ja, /* @__PURE__ */ c(async (e) => {
      e.preventDefault();
      const i = e.currentTarget;
      if (!(i instanceof HTMLFormElement)) return;
      const r = new FormData(i), a = String(r.get("criterionLabel") ?? "").trim(), o = String(r.get("criterionKey") ?? "").trim(), s = Array.from(i.querySelectorAll('[name="criterionValues"]')).map((g) => g instanceof HTMLInputElement ? g.value.trim() : "").filter((g, m, y) => g && y.indexOf(g) === m), u = String(r.get("criterionDefault") ?? "").trim() || s[0] || "Standard", f = bs(
        {
          id: d(this, Ce).id,
          key: o,
          label: a,
          values: s,
          default: u,
          order: Number(d(this, Ce).order ?? 0)
        },
        0,
        /* @__PURE__ */ new Set()
      );
      f && (A(this, Ce, f), await h(this, je, yu).call(this), this.close());
    }, "#onSubmit"));
    x(this, Ka, /* @__PURE__ */ c((e) => {
      var o;
      if (d(this, Kt)) return;
      const i = e.currentTarget, r = (i == null ? void 0 : i.form) ?? ((o = this.element) == null ? void 0 : o.querySelector("form"));
      if (!(r instanceof HTMLFormElement)) return;
      const a = r.querySelector('input[name="criterionKey"]');
      a instanceof HTMLInputElement && (a.value = Pi(i.value));
    }, "#onLabelInput"));
    x(this, Ya, /* @__PURE__ */ c((e) => {
      var l;
      const i = e.currentTarget, r = (i == null ? void 0 : i.form) ?? ((l = this.element) == null ? void 0 : l.querySelector("form"));
      if (!(r instanceof HTMLFormElement) || !(i instanceof HTMLInputElement)) return;
      const a = r.querySelector('input[name="criterionLabel"]'), o = Pi(a instanceof HTMLInputElement ? a.value : ""), s = Pi(i.value);
      A(this, Kt, s !== o), i.value = s, h(this, je, Ur).call(this, r);
    }, "#onKeyInput"));
    x(this, Qa, /* @__PURE__ */ c((e) => {
      var o, s;
      e.preventDefault();
      const i = ((o = e.currentTarget) == null ? void 0 : o.form) ?? ((s = this.element) == null ? void 0 : s.querySelector("form"));
      if (!(i instanceof HTMLFormElement)) return;
      const r = i.querySelector('input[name="criterionLabel"]'), a = i.querySelector('input[name="criterionKey"]');
      a instanceof HTMLInputElement && (a.value = Pi(r instanceof HTMLInputElement ? r.value : ""), A(this, Kt, !1), h(this, je, Ur).call(this, i));
    }, "#onResetAutoKey"));
    x(this, Xa, /* @__PURE__ */ c((e) => {
      var l, u, f, g, m, y;
      e.preventDefault();
      const i = ((l = e.currentTarget) == null ? void 0 : l.form) ?? ((u = this.element) == null ? void 0 : u.querySelector("form"));
      if (!(i instanceof HTMLFormElement)) return;
      const r = i.querySelector(".scene-criterion-editor__values");
      if (!(r instanceof HTMLElement)) return;
      (f = r.querySelector(".scene-criterion-editor__empty")) == null || f.remove();
      const a = document.createElement("div");
      a.classList.add("scene-criterion-editor__value");
      const o = At(v("EIDOLON.SceneCriteria.ValuePlaceholder", "Allowed value")), s = At(v("EIDOLON.SceneCriteria.RemoveValue", "Remove Value"));
      a.innerHTML = `
      <input type="text" name="criterionValues" value="" placeholder="${o}" class="form-control">
      <button type="button" class="icon" data-action="remove-value" aria-label="${s}" title="${s}">
        <i class="fa-solid fa-trash"></i>
      </button>
    `, r.appendChild(a), (g = a.querySelector('[data-action="remove-value"]')) == null || g.addEventListener("click", d(this, tr)), (m = a.querySelector('input[name="criterionValues"]')) == null || m.addEventListener("input", d(this, nr)), h(this, je, Bi).call(this, i), (y = a.querySelector('input[name="criterionValues"]')) == null || y.focus();
    }, "#onAddValue"));
    x(this, tr, /* @__PURE__ */ c((e) => {
      var a, o, s, l;
      e.preventDefault(), (o = (a = e.currentTarget) == null ? void 0 : a.closest(".scene-criterion-editor__value")) == null || o.remove();
      const i = ((s = e.currentTarget) == null ? void 0 : s.form) ?? ((l = this.element) == null ? void 0 : l.querySelector("form"));
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
        h(this, je, Bi).call(this, i);
      }
    }, "#onRemoveValue"));
    x(this, nr, /* @__PURE__ */ c((e) => {
      var r, a;
      const i = ((r = e.currentTarget) == null ? void 0 : r.form) ?? ((a = this.element) == null ? void 0 : a.querySelector("form"));
      i instanceof HTMLFormElement && h(this, je, Bi).call(this, i);
    }, "#onValuesChanged"));
    this.scene = i ?? null, this.criterion = r ?? null, this.onSave = typeof o == "function" ? o : null, this.isNew = !!a, A(this, Ce, h(this, je, pu).call(this)), A(this, Kt, d(this, Ce).key !== Pi(d(this, Ce).label));
  }
  async _prepareContext() {
    var i, r, a, o;
    const e = Array.isArray((i = d(this, Ce)) == null ? void 0 : i.values) ? d(this, Ce).values : [];
    return {
      isNew: this.isNew,
      key: ((r = d(this, Ce)) == null ? void 0 : r.key) ?? "",
      label: ((a = d(this, Ce)) == null ? void 0 : a.label) ?? "",
      defaultValue: ((o = d(this, Ce)) == null ? void 0 : o.default) ?? "",
      values: e.map((s, l) => {
        var u;
        return {
          index: l,
          value: s,
          selected: s === ((u = d(this, Ce)) == null ? void 0 : u.default)
        };
      }),
      hasValues: e.length > 0,
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
      keyIsCustom: d(this, Kt)
    };
  }
  _onRender(e, i) {
    var a, o, s, l, u, f;
    super._onRender(e, i);
    const r = (a = this.element) == null ? void 0 : a.querySelector("form");
    r && (r.addEventListener("submit", d(this, Ja)), (o = r.querySelector('[data-action="add-value"]')) == null || o.addEventListener("click", d(this, Xa)), (s = r.querySelector('input[name="criterionLabel"]')) == null || s.addEventListener("input", d(this, Ka)), (l = r.querySelector('input[name="criterionKey"]')) == null || l.addEventListener("input", d(this, Ya)), (u = r.querySelector('[data-action="reset-auto-key"]')) == null || u.addEventListener("click", d(this, Qa)), r.querySelectorAll('[data-action="remove-value"]').forEach((g) => {
      g.addEventListener("click", d(this, tr));
    }), r.querySelectorAll('input[name="criterionValues"]').forEach((g) => {
      g.addEventListener("input", d(this, nr));
    }), (f = r.querySelector('[data-action="cancel"]')) == null || f.addEventListener("click", (g) => {
      g.preventDefault(), this.close();
    }), h(this, je, Ur).call(this, r), h(this, je, Bi).call(this, r));
  }
};
Ce = new WeakMap(), Kt = new WeakMap(), je = new WeakSet(), pu = /* @__PURE__ */ c(function() {
  const e = bs(this.criterion, 0, /* @__PURE__ */ new Set()) ?? ml(v("EIDOLON.SceneCriteria.DefaultCategoryName", "New Criterion"));
  return {
    id: e.id,
    key: e.key,
    label: e.label ?? "",
    values: Array.isArray(e.values) ? [...e.values] : [],
    default: e.default
  };
}, "#initializeState"), Ja = new WeakMap(), Ka = new WeakMap(), Ya = new WeakMap(), Qa = new WeakMap(), Ur = /* @__PURE__ */ c(function(e) {
  const i = e.querySelector('[data-action="reset-auto-key"]');
  i instanceof HTMLButtonElement && (i.disabled = !d(this, Kt));
}, "#syncAutoKeyButton"), Xa = new WeakMap(), tr = new WeakMap(), nr = new WeakMap(), Bi = /* @__PURE__ */ c(function(e) {
  var l, u;
  const i = e.querySelector('select[name="criterionDefault"]');
  if (!(i instanceof HTMLSelectElement)) return;
  const r = ((u = (l = i.value) == null ? void 0 : l.trim) == null ? void 0 : u.call(l)) ?? "", a = Array.from(e.querySelectorAll('input[name="criterionValues"]')).map((f) => f instanceof HTMLInputElement ? f.value.trim() : "").filter((f, g, m) => f && m.indexOf(f) === g), o = i.dataset.emptyLabel || v("EIDOLON.SceneCriteria.ValueListEmpty", "No values have been added to this criterion.");
  if (i.innerHTML = "", !a.length) {
    const f = document.createElement("option");
    f.value = "", f.textContent = o, f.selected = !0, i.appendChild(f);
    return;
  }
  const s = a.includes(r) ? r : a[0];
  for (const f of a) {
    const g = document.createElement("option");
    g.value = f, g.textContent = f, g.selected = f === s, i.appendChild(g);
  }
}, "#syncDefaultOptions"), yu = /* @__PURE__ */ c(async function() {
  if (!this.scene) return;
  const e = bt(this.scene).sort((r, a) => r.order - a.order), i = e.findIndex((r) => r.id === d(this, Ce).id);
  i < 0 ? (d(this, Ce).order = e.length, e.push(d(this, Ce))) : (d(this, Ce).order = e[i].order, e.splice(i, 1, d(this, Ce)));
  try {
    await so(this.scene, e), this.onSave && await this.onSave(d(this, Ce));
  } catch (r) {
    mu(r);
  }
}, "#persist"), c(Gt, "CategoryEditorApplication"), Me(Gt, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  ze(Gt, Gt, "DEFAULT_OPTIONS"),
  {
    id: `${$e}-criterion-editor`,
    classes: Array.from(
      /* @__PURE__ */ new Set([...((Ac = ze(Gt, Gt, "DEFAULT_OPTIONS")) == null ? void 0 : Ac.classes) ?? [], "standard-form", "themed"])
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
)), Me(Gt, "PARTS", {
  content: {
    template: `modules/${$e}/templates/scene-criteria-editor.html`
  }
});
let vs = Gt;
function Pi(t) {
  return String(t ?? "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "criterion";
}
c(Pi, "slugifyKey");
const Bf = `modules/${$e}/templates/scene-criteria-tab.html`, Es = {
  log: /* @__PURE__ */ c((...t) => {
    var n;
    return (n = console.debug) == null ? void 0 : n.call(console, `${$e} | Criteria`, ...t);
  }, "log"),
  group: /* @__PURE__ */ c((...t) => {
    var n;
    return (n = console.groupCollapsed) == null ? void 0 : n.call(console, `${$e} | Criteria`, ...t);
  }, "group"),
  groupEnd: /* @__PURE__ */ c(() => {
    var t;
    return (t = console.groupEnd) == null ? void 0 : t.call(console);
  }, "groupEnd")
}, jf = ao(vs), Uf = cu({
  tabId: "criteria",
  tabLabel: /* @__PURE__ */ c(() => v("EIDOLON.SceneCriteria.TabLabel", "Criteria"), "tabLabel"),
  getScene: Bt,
  isApplicable: /* @__PURE__ */ c(() => oo(), "isApplicable"),
  renderContent: /* @__PURE__ */ c(({ app: t, tab: n, scene: e }) => zf(t, n, e), "renderContent"),
  logger: Es
});
function Vf() {
  return Uf.register();
}
c(Vf, "registerSceneCriteriaConfigHook");
function zf(t, n, e) {
  if (!(n instanceof HTMLElement)) return;
  const i = et(e) ? e : Bt(t);
  di(t, n, i);
}
c(zf, "renderCriteriaTab");
async function di(t, n, e) {
  var r, a;
  const i = e ?? Bt(t);
  Es.group("renderCriteriaTabContent", { sceneId: (i == null ? void 0 : i.id) ?? null });
  try {
    if (!et(i)) {
      const f = v(
        "EIDOLON.SceneCriteria.Unavailable",
        "Scene criteria are unavailable for this configuration sheet."
      );
      n.innerHTML = `<p class="notes">${f}</p>`;
      return;
    }
    const o = bt(i).sort((f, g) => f.order - g.order), s = vr(i, o), l = ((a = (r = foundry == null ? void 0 : foundry.applications) == null ? void 0 : r.handlebars) == null ? void 0 : a.renderTemplate) ?? (typeof renderTemplate == "function" ? renderTemplate : globalThis == null ? void 0 : globalThis.renderTemplate);
    if (typeof l != "function") {
      n.innerHTML = `<p class="notes">${v("EIDOLON.SceneCriteria.CategoryListEmpty", "No criteria configured for this scene.")}</p>`;
      return;
    }
    const u = await l(Bf, {
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
        valueCount: o.reduce((f, g) => f + g.values.length, 0)
      },
      criteria: o.map((f, g) => {
        var m, y;
        return {
          id: f.id,
          label: f.label,
          displayName: ((y = (m = f.label) == null ? void 0 : m.trim) == null ? void 0 : y.call(m)) || v("EIDOLON.SceneCriteria.UnnamedCategory", "Unnamed Criterion"),
          hasValues: f.values.length > 0,
          values: f.values.map((b) => ({
            value: b,
            isCurrent: (s[f.key] ?? f.default) === b
          })),
          valueCountLabel: Wf(f.values.length),
          canMoveUp: g > 0,
          canMoveDown: g < o.length - 1
        };
      }),
      hasCriteria: o.length > 0
    });
    n.innerHTML = u, Gf(t, n, i);
  } catch (o) {
    console.error(`${$e} | Failed to render criteria tab`, o), n.innerHTML = `<p class="notes">${v("EIDOLON.SceneCriteria.CategoryListEmpty", "No criteria configured for this scene.")}</p>`;
  } finally {
    Es.groupEnd();
  }
}
c(di, "renderCriteriaTabContent");
function Gf(t, n, e) {
  const i = e ?? Bt(t);
  if (!et(i)) return;
  const r = n.querySelector('[data-criteria-action="add"]');
  r && r.addEventListener("click", () => {
    Kl(t, {
      scene: i,
      criterion: ml(
        v("EIDOLON.SceneCriteria.DefaultCategoryName", "New Criterion")
      ),
      isNew: !0,
      onSave: /* @__PURE__ */ c(() => di(t, n, i), "onSave")
    });
  }), n.querySelectorAll('[data-criteria-action="edit"]').forEach((a) => {
    const o = a.dataset.criterionId;
    o && a.addEventListener("click", () => {
      const s = bt(i).find((l) => l.id === o);
      s && Kl(t, {
        scene: i,
        criterion: s,
        onSave: /* @__PURE__ */ c(() => di(t, n, i), "onSave")
      });
    });
  }), n.querySelectorAll('[data-criteria-action="remove"]').forEach((a) => {
    const o = a.dataset.criterionId;
    o && a.addEventListener("click", async () => {
      await Mo(i, (l) => {
        const u = l.findIndex((f) => f.id === o);
        return u < 0 ? !1 : (l.splice(u, 1), No(l), !0);
      }) && await di(t, n, i);
    });
  }), n.querySelectorAll('[data-criteria-action="move-up"]').forEach((a) => {
    const o = a.dataset.criterionId;
    o && a.addEventListener("click", async () => {
      await Mo(i, (l) => {
        const u = l.findIndex((g) => g.id === o);
        if (u <= 0) return !1;
        const [f] = l.splice(u, 1);
        return l.splice(u - 1, 0, f), No(l), !0;
      }) && await di(t, n, i);
    });
  }), n.querySelectorAll('[data-criteria-action="move-down"]').forEach((a) => {
    const o = a.dataset.criterionId;
    o && a.addEventListener("click", async () => {
      await Mo(i, (l) => {
        const u = l.findIndex((g) => g.id === o);
        if (u < 0 || u >= l.length - 1) return !1;
        const [f] = l.splice(u, 1);
        return l.splice(u + 1, 0, f), No(l), !0;
      }) && await di(t, n, i);
    });
  });
}
c(Gf, "bindCriteriaTabEvents");
async function Mo(t, n) {
  const e = bt(t).sort((r, a) => r.order - a.order);
  if (n(e) === !1) return !1;
  try {
    return await so(t, e), !0;
  } catch (r) {
    return mu(r), !1;
  }
}
c(Mo, "mutateCriteria");
function Kl(t, n = {}) {
  const e = n.scene ?? null, i = e && et(e) ? e : Bt(t);
  if (!et(i))
    return;
  jf({
    scene: i,
    criterion: n.criterion ?? null,
    isNew: !!n.isNew,
    onSave: typeof n.onSave == "function" ? n.onSave : null
  }).render({ force: !0 });
}
c(Kl, "openCriterionEditor");
function No(t) {
  t.forEach((n, e) => {
    n.order = e;
  });
}
c(No, "reindexCriteriaOrder");
function Wf(t) {
  var n, e;
  if ((e = (n = game.i18n) == null ? void 0 : n.has) != null && e.call(n, "EIDOLON.SceneCriteria.ValueCountLabel"))
    try {
      return game.i18n.format("EIDOLON.SceneCriteria.ValueCountLabel", { count: t });
    } catch (i) {
      console.error(`${$e} | Failed to format value count label`, i);
    }
  return t === 0 ? "No values configured" : t === 1 ? "1 value" : `${t} values`;
}
c(Wf, "formatValueCount");
let Yl = !1;
function Jf() {
  Hooks.once("init", () => {
    _f();
  }), Hooks.once("ready", () => {
    oo() && (Yl || (Vf(), Yl = !0));
  });
}
c(Jf, "registerSceneCriteriaHooks");
Jf();
const de = L, bu = "criteriaEngineVersion", Qn = "fileIndex", Xn = "tileCriteria", yl = {
  LEGACY: 1,
  CRITERIA: 2
}, wu = yl.CRITERIA;
function vu(t) {
  var n;
  return ((n = t == null ? void 0 : t.getFlag) == null ? void 0 : n.call(t, de, bu)) ?? yl.LEGACY;
}
c(vu, "getSceneEngineVersion");
function Kf(t, n, e, i, r) {
  if (!(t != null && t.length) || !(e != null && e.length)) return -1;
  const a = {};
  for (const s of e)
    a[s] = n[s];
  const o = Ql(t, a, e);
  if (o >= 0) return o;
  if (i != null && i.length && r) {
    const s = { ...a };
    for (const l of i) {
      if (!(l in s)) continue;
      s[l] = r[l] ?? "Standard";
      const u = Ql(t, s, e);
      if (u >= 0) return u;
    }
  }
  return -1;
}
c(Kf, "findBestMatch");
function Ql(t, n, e) {
  return t.findIndex((i) => {
    for (const r of e)
      if (i[r] !== n[r]) return !1;
    return !0;
  });
}
c(Ql, "findExactMatch");
function Yf(t, n) {
  if (!(t != null && t.length)) return -1;
  let e = -1, i = -1;
  for (let r = 0; r < t.length; r += 1) {
    const a = t[r] ?? {}, o = Object.keys(a);
    if (o.length === 0) {
      i < 0 && (e = r, i = 0);
      continue;
    }
    let s = !0;
    for (const l of o)
      if (a[l] !== n[l]) {
        s = !1;
        break;
      }
    s && o.length > i && (e = r, i = o.length);
  }
  return e;
}
c(Yf, "findFileIndex");
function Vr(t) {
  return t && typeof t == "object" && !Array.isArray(t);
}
c(Vr, "isPlainObject$2");
function Xl(t) {
  return t == null ? t : typeof structuredClone == "function" ? structuredClone(t) : JSON.parse(JSON.stringify(t));
}
c(Xl, "deepClone");
function Qf(t, n) {
  if (!n) return;
  const e = n.split(".").filter(Boolean);
  if (!e.length) return;
  let i = t;
  for (let r = 0; r < e.length - 1; r += 1) {
    if (!Vr(i == null ? void 0 : i[e[r]])) return;
    i = i[e[r]];
  }
  delete i[e.at(-1)];
}
c(Qf, "deletePath");
function Eu(t, n) {
  const e = Xl(t ?? {});
  if (!Vr(n)) return e;
  for (const [i, r] of Object.entries(n)) {
    if (i.startsWith("-=") && r === !0) {
      Qf(e, i.slice(2));
      continue;
    }
    Vr(r) && Vr(e[i]) ? e[i] = Eu(e[i], r) : e[i] = Xl(r);
  }
  return e;
}
c(Eu, "fallbackMerge");
function Xf(t, n) {
  var e, i;
  return (e = foundry == null ? void 0 : foundry.utils) != null && e.mergeObject && ((i = foundry == null ? void 0 : foundry.utils) != null && i.deepClone) ? foundry.utils.mergeObject(t, foundry.utils.deepClone(n), {
    inplace: !1
  }) : Eu(t, n);
}
c(Xf, "defaultMerge");
function Zf(t, n) {
  if (!t) return !0;
  for (const e of Object.keys(t))
    if (t[e] !== n[e]) return !1;
  return !0;
}
c(Zf, "criteriaMatch");
function Tu(t, n, e, i) {
  const r = i ?? Xf;
  let a = r({}, t ?? {});
  if (!(n != null && n.length)) return a;
  const o = [];
  for (let s = 0; s < n.length; s += 1) {
    const l = n[s];
    if (Zf(l == null ? void 0 : l.criteria, e)) {
      const u = l != null && l.criteria ? Object.keys(l.criteria).length : 0;
      o.push({ specificity: u, index: s, delta: l == null ? void 0 : l.delta });
    }
  }
  o.sort((s, l) => s.specificity - l.specificity || s.index - l.index);
  for (const s of o)
    s.delta && (a = r(a, s.delta));
  return a;
}
c(Tu, "resolveRules");
function lo(t = null) {
  var i;
  const n = (game == null ? void 0 : game.user) ?? null;
  if (!n) return !1;
  if (n.isGM) return !0;
  const e = t ?? ((i = game == null ? void 0 : game.scenes) == null ? void 0 : i.viewed) ?? null;
  if (!e) return !1;
  if (typeof e.canUserModify == "function")
    try {
      return !!e.canUserModify(n, "update");
    } catch {
    }
  if (typeof e.testUserPermission == "function")
    try {
      return !!e.testUserPermission(n, "OWNER");
    } catch {
    }
  return !!e.isOwner;
}
c(lo, "canManageCriteria");
function eh(t = null) {
  if (!lo(t))
    throw new Error(`${de} | You do not have permission to manage scene criteria.`);
}
c(eh, "requireCriteriaAccess");
const th = /* @__PURE__ */ c((...t) => console.log(`${de} | criteria tiles:`, ...t), "log$1");
let la = /* @__PURE__ */ new WeakMap(), ca = /* @__PURE__ */ new WeakMap();
const Zl = 200;
function nh(t) {
  return t ? Number.isInteger(t.size) ? t.size : Array.isArray(t) || typeof t.length == "number" ? t.length : Array.from(t).length : 0;
}
c(nh, "getCollectionSize$1");
function Mr() {
  return typeof (performance == null ? void 0 : performance.now) == "function" ? performance.now() : Date.now();
}
c(Mr, "nowMs$2");
function ih(t) {
  if (!Array.isArray(t)) return [];
  const n = /* @__PURE__ */ new Set();
  for (const e of t) {
    if (typeof e != "string") continue;
    const i = e.trim();
    i && n.add(i);
  }
  return Array.from(n);
}
c(ih, "uniqueStringKeys$1");
function rh(t, n = Zl) {
  if (!Array.isArray(t) || t.length === 0) return [];
  const e = Number.isInteger(n) && n > 0 ? n : Zl, i = [];
  for (let r = 0; r < t.length; r += e)
    i.push(t.slice(r, r + e));
  return i;
}
c(rh, "chunkArray$1");
async function ah(t, n, e) {
  const i = rh(n, e);
  for (const r of i)
    await t.updateEmbeddedDocuments("Tile", r), i.length > 1 && await Promise.resolve();
  return i.length;
}
c(ah, "updateTilesInChunks");
function oh(t) {
  var i;
  const n = ii(t, { files: null });
  if (!((i = n == null ? void 0 : n.variants) != null && i.length)) return [];
  const e = /* @__PURE__ */ new Set();
  for (const r of n.variants)
    for (const a of Object.keys(r.criteria ?? {}))
      a && e.add(a);
  return Array.from(e);
}
c(oh, "getTileCriteriaDependencyKeys");
function sh(t, n) {
  const e = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Set();
  for (const r of n) {
    const a = r.getFlag(de, Xn) ?? r.getFlag(de, Qn);
    if (a) {
      i.add(r.id);
      for (const o of oh(a))
        e.has(o) || e.set(o, /* @__PURE__ */ new Set()), e.get(o).add(r.id);
    }
  }
  return {
    collection: n,
    keyToTileIds: e,
    allTileIds: i
  };
}
c(sh, "buildTileDependencyIndex");
function lh(t, n) {
  const e = ca.get(t);
  if ((e == null ? void 0 : e.collection) === n) return e;
  const i = sh(t, n);
  return ca.set(t, i), i;
}
c(lh, "getTileDependencyIndex");
function ch(t, n, e) {
  const i = ih(e);
  if (!i.length)
    return Array.from(n ?? []);
  const r = lh(t, n), a = /* @__PURE__ */ new Set();
  for (const o of i) {
    const s = r.keyToTileIds.get(o);
    if (s)
      for (const l of s)
        a.add(l);
  }
  return a.size ? typeof (n == null ? void 0 : n.get) == "function" ? Array.from(a).map((o) => n.get(o)).filter(Boolean) : Array.from(n ?? []).filter((o) => a.has(o.id)) : [];
}
c(ch, "getTilesForChangedKeys");
function Cu(t) {
  return typeof (t == null ? void 0 : t.name) == "string" ? t.name : typeof (t == null ? void 0 : t.src) == "string" ? t.src : "";
}
c(Cu, "getFilePath");
function ua(t) {
  if (typeof t != "string") return "";
  const n = t.trim();
  if (!n) return "";
  const e = n.replace(/\\/g, "/");
  try {
    return decodeURIComponent(e);
  } catch {
    return e;
  }
}
c(ua, "normalizeFilePath");
function bl(t) {
  if (!Array.isArray(t)) return [];
  const n = /* @__PURE__ */ new Map();
  return t.map((e, i) => {
    const r = ua(Cu(e)), a = r || `__index:${i}`, o = n.get(a) ?? 0;
    n.set(a, o + 1);
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
c(bl, "buildTileFileEntries");
function Sn(t, n) {
  if (!Number.isInteger(n) || n < 0) return null;
  const i = bl(t).find((r) => r.index === n);
  return i ? { ...i.target } : { indexHint: n };
}
c(Sn, "createTileTargetFromIndex");
function co(t) {
  if (!t || typeof t != "object") return null;
  const n = ua(t.path), e = Number(t.indexHint ?? t.fileIndex), i = Number(t.occurrence), r = {};
  return n && (r.path = n, r.occurrence = Number.isInteger(i) && i >= 0 ? i : 0), Number.isInteger(e) && e >= 0 && (r.indexHint = e), !r.path && !Number.isInteger(r.indexHint) ? null : r;
}
c(co, "normalizeTileTarget");
function Ki(t, n) {
  const e = co(t);
  if (!e) return -1;
  const i = bl(n);
  if (!i.length) return -1;
  if (e.path) {
    const r = i.filter((a) => a.path === e.path);
    if (r.length > 0) {
      const a = Number.isInteger(e.occurrence) ? e.occurrence : 0;
      if (r[a]) return r[a].index;
      if (Number.isInteger(e.indexHint)) {
        const o = r.find((s) => s.index === e.indexHint);
        if (o) return o.index;
      }
      return r[0].index;
    }
  }
  return Number.isInteger(e.indexHint) && e.indexHint < i.length ? e.indexHint : -1;
}
c(Ki, "resolveTileTargetIndex");
function Ln(t) {
  if (!t || typeof t != "object" || Array.isArray(t)) return {};
  const n = {};
  for (const [e, i] of Object.entries(t))
    typeof e != "string" || !e || typeof i != "string" || !i.trim() || (n[e] = i.trim());
  return n;
}
c(Ln, "sanitizeCriteria");
function uh(t) {
  return Object.entries(Ln(t)).sort(([e], [i]) => e.localeCompare(i)).map(([e, i]) => `${e}=${i}`).join("");
}
c(uh, "serializeCriteria");
function dh(t) {
  return Object.keys(Ln(t)).length;
}
c(dh, "getCriteriaSpecificity");
function fh(t, n) {
  const e = Ln(t), i = Ln(n);
  for (const [r, a] of Object.entries(e))
    if (r in i && i[r] !== a)
      return !1;
  return !0;
}
c(fh, "areCriteriaCompatible");
function hh(t, n) {
  const e = Ki(t, n);
  if (Number.isInteger(e) && e >= 0)
    return `index:${e}`;
  const i = co(t);
  if (!i) return "";
  if (i.path) {
    const r = Number.isInteger(i.occurrence) ? i.occurrence : 0;
    return `path:${i.path}#${r}`;
  }
  return Number.isInteger(i.indexHint) ? `hint:${i.indexHint}` : "";
}
c(hh, "getTargetIdentity");
function Su(t, n = {}) {
  var s;
  const e = Array.isArray(n.files) ? n.files : [], i = ii(t, { files: e });
  if (!((s = i == null ? void 0 : i.variants) != null && s.length))
    return {
      errors: [],
      warnings: []
    };
  const r = i.variants.map((l, u) => ({
    index: u,
    criteria: Ln(l.criteria),
    specificity: dh(l.criteria),
    criteriaSignature: uh(l.criteria),
    targetIdentity: hh(l.target, e)
  })), a = [], o = [];
  for (let l = 0; l < r.length; l += 1) {
    const u = r[l];
    for (let f = l + 1; f < r.length; f += 1) {
      const g = r[f];
      if (u.specificity !== g.specificity || !fh(u.criteria, g.criteria)) continue;
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
c(Su, "detectTileCriteriaConflicts");
function gh(t, n) {
  if (!t || typeof t != "object") return null;
  let e = co(t.target);
  if (!e) {
    const i = Number(t.fileIndex);
    Number.isInteger(i) && i >= 0 && (e = Sn(n, i));
  }
  return e ? {
    criteria: Ln(t.criteria),
    target: e
  } : null;
}
c(gh, "normalizeTileVariant");
function Lu(t, n = {}) {
  if (!Array.isArray(t) || t.length === 0) return null;
  const e = Array.isArray(n.files) ? n.files : null, i = t.map((l, u) => ({
    criteria: Ln(l),
    target: Sn(e, u)
  })).filter((l) => l.target);
  if (!i.length) return null;
  const r = i.find((l) => Object.keys(l.criteria).length === 0), a = (r == null ? void 0 : r.target) ?? i[0].target;
  let o = null;
  const s = Number(n.defaultFileIndex);
  return Number.isInteger(s) && s >= 0 && (o = Sn(e, s)), o || (o = a), {
    strategy: "select-one",
    variants: i,
    defaultTarget: o
  };
}
c(Lu, "buildTileCriteriaFromFileIndex");
function ii(t, n = {}) {
  const e = Array.isArray(n.files) ? n.files : null;
  if (Array.isArray(t))
    return Lu(t, { files: e });
  if (!t || typeof t != "object") return null;
  const i = Array.isArray(t.variants) ? t.variants.map((a) => gh(a, e)).filter(Boolean) : [];
  if (!i.length) return null;
  let r = co(t.defaultTarget);
  if (!r) {
    const a = Number(t.defaultFileIndex);
    Number.isInteger(a) && a >= 0 && (r = Sn(e, a));
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
c(ii, "normalizeTileCriteria");
function mh(t, n) {
  if (!t) return -1;
  let e = -1, i = -1;
  for (const r of t.variants) {
    const a = r.keys;
    let o = !0;
    for (const s of a)
      if (r.criteria[s] !== (n == null ? void 0 : n[s])) {
        o = !1;
        break;
      }
    o && a.length > i && (i = a.length, e = r.targetIndex);
  }
  return e >= 0 ? e : t.defaultIndex;
}
c(mh, "selectTileFileIndexFromCompiled");
function ph(t, n) {
  const e = ii(t, { files: n });
  if (!e) return null;
  const i = e.variants.map((a) => {
    const o = Ln(a.criteria), s = Ki(a.target, n);
    return !Number.isInteger(s) || s < 0 ? null : {
      criteria: o,
      keys: Object.keys(o),
      targetIndex: s
    };
  }).filter(Boolean), r = Ki(e.defaultTarget, n);
  return !i.length && (!Number.isInteger(r) || r < 0) ? null : {
    variants: i,
    defaultIndex: r
  };
}
c(ph, "compileTileMatcher");
function yh(t, n, e) {
  const i = la.get(t);
  if (i && i.tileCriteria === n && i.files === e)
    return i.compiled;
  const r = ph(n, e);
  return la.set(t, {
    tileCriteria: n,
    files: e,
    compiled: r
  }), r;
}
c(yh, "getCompiledTileMatcher");
function bh(t = null, n = null) {
  t ? ca.delete(t) : ca = /* @__PURE__ */ new WeakMap(), n ? la.delete(n) : t || (la = /* @__PURE__ */ new WeakMap());
}
c(bh, "invalidateTileCriteriaCaches");
async function Iu(t, n, e = {}) {
  var l, u, f, g;
  const i = Mr(), r = {
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
  if (n = n ?? ((l = game.scenes) == null ? void 0 : l.viewed), !n)
    return r.durationMs = Mr() - i, r;
  const a = n.getEmbeddedCollection("Tile") ?? [];
  r.total = nh(a);
  const o = ch(n, a, e.changedKeys);
  if (r.scanned = o.length, !o.length)
    return r.skipped.unaffected = r.total, r.durationMs = Mr() - i, r;
  const s = [];
  for (const m of o) {
    const y = m.getFlag(de, Xn) ?? m.getFlag(de, Qn);
    if (!y) {
      r.skipped.noCriteria += 1;
      continue;
    }
    const b = m.getFlag("monks-active-tiles", "files");
    if (!(b != null && b.length)) {
      r.skipped.noFiles += 1;
      continue;
    }
    const p = yh(m, y, b), E = mh(p, t);
    if (!Number.isInteger(E) || E < 0 || E >= b.length) {
      console.warn(`${de} | Tile ${m.id} has no valid file match for state`, t), r.skipped.noMatch += 1;
      continue;
    }
    const T = E + 1, M = Number(m.getFlag("monks-active-tiles", "fileindex")) !== T, $ = b.some((U, ee) => !!(U != null && U.selected) != (ee === E)), k = ua(((u = m.texture) == null ? void 0 : u.src) ?? ((g = (f = m._source) == null ? void 0 : f.texture) == null ? void 0 : g.src) ?? ""), _ = Cu(b[E]), H = ua(_), G = !!H && H !== k;
    if (!$ && !M && !G) {
      r.skipped.unchanged += 1;
      continue;
    }
    const ie = {
      _id: m._id
    };
    $ && (ie["flags.monks-active-tiles.files"] = b.map((U, ee) => ({
      ...U,
      selected: ee === E
    }))), M && (ie["flags.monks-active-tiles.fileindex"] = T), G && (ie.texture = { src: _ }), s.push(ie), th(`Tile ${m.id} -> ${_}`);
  }
  return s.length > 0 && (r.chunks = await ah(n, s, e.chunkSize), r.updated = s.length), r.durationMs = Mr() - i, r;
}
c(Iu, "updateTiles");
function wh() {
  if (!globalThis.Tagger) return [];
  const t = ["Checkbox", "Tile", "Settings", "Toggleable Lights"], n = [
    "Checkbox",
    "Tile",
    "Settings",
    "Toggleable Lights",
    "Checked",
    "Unchecked",
    "Individual"
  ], e = Tagger.getByTag(t) ?? [], i = [];
  for (const r of e) {
    if (r.getFlag("monks-active-tiles", "variables.state") !== "unchecked") continue;
    const a = (Tagger.getTags(r) ?? []).filter((l) => !n.includes(l)), o = (Tagger.getByTag("Disable Automation") ?? []).concat(Tagger.getByTag("Settings") ?? []), s = Tagger.getByTag(a, { ignore: o }) ?? [];
    for (const l of s)
      l != null && l._id && i.push(l._id);
  }
  return i;
}
c(wh, "buildLightControlsMap");
const Zn = L, bi = "lightCriteria", wl = Object.freeze({
  base: null,
  mappings: [],
  current: null
});
function ko(t) {
  return t && typeof t == "object" && !Array.isArray(t);
}
c(ko, "isPlainObject$1");
function Ou(t, n) {
  if (!ko(n)) return {};
  const e = {};
  for (const [i, r] of Object.entries(n)) {
    const a = t == null ? void 0 : t[i];
    if (ko(r) && ko(a)) {
      const o = Ou(a, r);
      Object.keys(o).length > 0 && (e[i] = o);
    } else r !== a && (e[i] = qt(r));
  }
  return e;
}
c(Ou, "computeDelta");
function Au(t) {
  var e;
  const n = ((e = t == null ? void 0 : t.getFlag) == null ? void 0 : e.call(t, Zn, bi)) ?? wl;
  return Yi(n);
}
c(Au, "getLightCriteriaState");
async function Mu(t, n) {
  const e = Yi(n);
  if (!(t != null && t.setFlag))
    return e;
  const i = e.base !== null, r = e.mappings.length > 0, a = e.current !== null;
  return !i && !r && !a ? (typeof t.unsetFlag == "function" ? await t.unsetFlag(Zn, bi) : await t.setFlag(Zn, bi, null), wl) : (await t.setFlag(Zn, bi, e), e);
}
c(Mu, "setLightCriteriaState");
async function Er(t, n) {
  if (typeof n != "function")
    throw new TypeError("updateLightCriteriaState requires an updater function.");
  const e = qt(Au(t)), i = await n(e);
  return Mu(t, i);
}
c(Er, "updateLightCriteriaState");
async function ec(t, n) {
  const e = ri(n);
  if (!e)
    throw new Error("Invalid light configuration payload.");
  return Er(t, (i) => ({
    ...i,
    base: e
  }));
}
c(ec, "storeBaseLighting");
async function tc(t, n, e, { label: i } = {}) {
  const r = Tr(n);
  if (!r)
    throw new Error("Cannot create a mapping without at least one category selection.");
  const a = ri(e);
  if (!a)
    throw new Error("Invalid light configuration payload.");
  return Er(t, (o) => {
    const s = xi(r), l = Array.isArray(o == null ? void 0 : o.mappings) ? [...o.mappings] : [], u = l.findIndex((y) => (y == null ? void 0 : y.key) === s), f = u >= 0 ? l[u] : null, g = typeof (f == null ? void 0 : f.id) == "string" && f.id.trim() ? f.id.trim() : ku(), m = uo({
      id: g,
      categories: r,
      config: a,
      label: typeof i == "string" ? i : (f == null ? void 0 : f.label) ?? null,
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
c(tc, "upsertLightCriteriaMapping");
async function vh(t, n, e, i, { replaceExisting: r = !1 } = {}) {
  const a = typeof n == "string" ? n.trim() : "";
  if (!a)
    throw new Error("A mapping id is required to retarget criteria.");
  const o = Tr(e);
  if (!o)
    throw new Error("Cannot retarget mapping without at least one category selection.");
  const s = ri(i);
  if (!s)
    throw new Error("Invalid light configuration payload.");
  return Er(t, (l) => {
    const u = Array.isArray(l == null ? void 0 : l.mappings) ? [...l.mappings] : [], f = u.findIndex((T) => (T == null ? void 0 : T.id) === a);
    if (f < 0)
      throw new Error("The selected mapping no longer exists.");
    const g = xi(o), m = u.findIndex(
      (T, I) => I !== f && (T == null ? void 0 : T.key) === g
    );
    if (m >= 0 && !r)
      throw new Error("A mapping already exists for the selected criteria.");
    const y = u[f], b = uo({
      ...y,
      id: a,
      categories: o,
      config: s,
      updatedAt: Date.now()
    });
    if (!b)
      throw new Error("Failed to sanitize updated mapping.");
    u[f] = b;
    let p = null;
    if (m >= 0) {
      const [T] = u.splice(m, 1);
      p = (T == null ? void 0 : T.id) ?? null;
    }
    let E = (l == null ? void 0 : l.current) ?? null;
    return E && typeof E == "object" && (E.mappingId === a ? E = {
      ...E,
      mappingId: a,
      categories: o,
      updatedAt: Date.now()
    } : p && E.mappingId === p && (E = {
      ...E,
      mappingId: a,
      categories: o,
      updatedAt: Date.now()
    })), {
      ...l,
      mappings: u,
      current: E
    };
  });
}
c(vh, "retargetLightCriteriaMapping");
async function Eh(t, n) {
  const e = typeof n == "string" ? n.trim() : "";
  if (!e)
    throw new Error("A mapping id is required to remove a mapping.");
  return Er(t, (i) => {
    const r = Array.isArray(i == null ? void 0 : i.mappings) ? [...i.mappings] : [], a = r.findIndex((s) => (s == null ? void 0 : s.id) === e);
    if (a < 0) return i;
    r.splice(a, 1);
    let o = (i == null ? void 0 : i.current) ?? null;
    return (o == null ? void 0 : o.mappingId) === e && (o = null), {
      ...i,
      mappings: r,
      current: o
    };
  });
}
c(Eh, "removeLightCriteriaMapping");
async function Gi(t, n) {
  const e = Nu(n);
  return Er(t, (i) => ({
    ...i,
    current: e
  }));
}
c(Gi, "storeCurrentCriteriaSelection");
function Th(t) {
  const n = Yi(t), e = n.base ?? {}, i = [];
  for (const r of n.mappings) {
    const a = Tr(r == null ? void 0 : r.categories);
    if (!a) continue;
    const o = Ou(e, (r == null ? void 0 : r.config) ?? {});
    Object.keys(o).length !== 0 && i.push({
      criteria: a,
      delta: o
    });
  }
  return {
    base: e,
    rules: i
  };
}
c(Th, "convertLightCriteriaStateToPresets");
function Ch(t, n = []) {
  const e = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Set();
  for (const l of n)
    typeof (l == null ? void 0 : l.key) == "string" && l.key.trim() && i.add(l.key.trim()), typeof (l == null ? void 0 : l.id) == "string" && l.id.trim() && typeof (l == null ? void 0 : l.key) == "string" && e.set(l.id.trim(), l.key.trim());
  const r = Yi(t), a = /* @__PURE__ */ c((l) => {
    const u = {};
    for (const [f, g] of Object.entries(l ?? {})) {
      const m = String(f ?? "").trim(), y = typeof g == "string" ? g.trim() : "";
      if (!m || !y) continue;
      if (i.has(m)) {
        u[m] = y;
        continue;
      }
      const b = e.get(m);
      b && (u[b] = y);
    }
    return Object.keys(u).length ? u : null;
  }, "remapCategories"), o = r.mappings.map((l) => {
    const u = a(l.categories);
    return u ? uo({
      ...l,
      categories: u,
      key: xi(u)
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
  return Yi({
    ...r,
    mappings: o,
    current: s
  });
}
c(Ch, "migrateLightCriteriaCategoriesToKeys");
function Yi(t) {
  var l;
  const n = qt(t);
  if (!n || typeof n != "object")
    return qt(wl);
  const e = ri(n.base), i = Array.isArray(n.mappings) ? n.mappings : [], r = /* @__PURE__ */ new Map();
  for (const u of i) {
    const f = uo(u);
    f && r.set(f.key, f);
  }
  const a = Array.from(r.values()), o = new Map(a.map((u) => [u.id, u]));
  let s = Nu(n.current);
  if (s) {
    const u = s.categories && Object.keys(s.categories).length > 0;
    if (s.mappingId && !o.has(s.mappingId)) {
      const f = u ? ((l = a.find((g) => g.key === xi(s.categories))) == null ? void 0 : l.id) ?? null : null;
      f ? s = {
        ...s,
        mappingId: f
      } : u && (s = {
        mappingId: null,
        categories: s.categories,
        updatedAt: s.updatedAt
      });
    }
  }
  return {
    base: e ?? null,
    mappings: a,
    current: s
  };
}
c(Yi, "sanitizeLightCriteriaState");
function ri(t) {
  const n = qt(t);
  if (!n || typeof n != "object") return null;
  "_id" in n && delete n._id, "id" in n && delete n.id;
  const e = n.flags;
  if (e && typeof e == "object") {
    const i = e[Zn];
    i && typeof i == "object" && (delete i[bi], Object.keys(i).length === 0 && delete e[Zn]), Object.keys(e).length === 0 && delete n.flags;
  }
  return n;
}
c(ri, "sanitizeLightConfigPayload");
function uo(t) {
  if (!t || typeof t != "object") return null;
  const n = Tr(t.categories);
  if (!n) return null;
  const e = ri(t.config);
  if (!e) return null;
  const i = typeof t.id == "string" && t.id.trim() ? t.id.trim() : ku(), r = xi(n), a = {
    id: i,
    key: r,
    categories: n,
    config: e,
    updatedAt: Number.isFinite(t.updatedAt) ? Number(t.updatedAt) : Date.now()
  };
  return typeof t.label == "string" && t.label.trim() && (a.label = t.label.trim()), a;
}
c(uo, "sanitizeCriteriaMappingEntry");
function Nu(t) {
  if (!t || typeof t != "object") return null;
  const n = typeof t.mappingId == "string" && t.mappingId.trim() ? t.mappingId.trim() : null, e = Tr(t.categories);
  return !n && !e ? null : {
    mappingId: n,
    categories: e,
    updatedAt: Number.isFinite(t.updatedAt) ? Number(t.updatedAt) : Date.now()
  };
}
c(Nu, "sanitizeCurrentSelection");
function Tr(t) {
  const n = {};
  if (Array.isArray(t))
    for (const e of t) {
      const i = nc((e == null ? void 0 : e.id) ?? (e == null ? void 0 : e.categoryId) ?? (e == null ? void 0 : e.category)), r = ic((e == null ? void 0 : e.value) ?? (e == null ? void 0 : e.selection) ?? (e == null ? void 0 : e.label));
      !i || !r || (n[i] = r);
    }
  else if (t && typeof t == "object")
    for (const [e, i] of Object.entries(t)) {
      const r = nc(e), a = ic(i);
      !r || !a || (n[r] = a);
    }
  return Object.keys(n).length > 0 ? n : null;
}
c(Tr, "sanitizeCriteriaCategories");
function xi(t) {
  if (!t || typeof t != "object") return "";
  const n = Object.entries(t).filter(([, e]) => typeof e == "string" && e).map(([e, i]) => `${e}:${i}`);
  return n.sort((e, i) => e < i ? -1 : e > i ? 1 : 0), n.join("|");
}
c(xi, "computeCriteriaMappingKey");
function ku() {
  var t;
  return (t = foundry == null ? void 0 : foundry.utils) != null && t.randomID ? foundry.utils.randomID() : typeof (crypto == null ? void 0 : crypto.randomUUID) == "function" ? crypto.randomUUID() : Math.random().toString(36).slice(2, 10);
}
c(ku, "generateLightMappingId");
function nc(t) {
  if (typeof t != "string") return null;
  const n = t.trim();
  return n || null;
}
c(nc, "normalizeCategoryId");
function ic(t) {
  if (typeof t != "string") return null;
  const n = t.trim();
  return n || null;
}
c(ic, "normalizeCategoryValue");
const da = ["AmbientLight", "Wall", "AmbientSound"];
let fa = /* @__PURE__ */ new WeakMap(), ha = /* @__PURE__ */ new WeakMap();
const rc = 200;
function Sh(t) {
  return t ? Number.isInteger(t.size) ? t.size : Array.isArray(t) || typeof t.length == "number" ? t.length : Array.from(t).length : 0;
}
c(Sh, "getCollectionSize");
function xo() {
  return typeof (performance == null ? void 0 : performance.now) == "function" ? performance.now() : Date.now();
}
c(xo, "nowMs$1");
function Lh(t) {
  if (!Array.isArray(t)) return [];
  const n = /* @__PURE__ */ new Set();
  for (const e of t) {
    if (typeof e != "string") continue;
    const i = e.trim();
    i && n.add(i);
  }
  return Array.from(n);
}
c(Lh, "uniqueStringKeys");
function Ih(t, n = rc) {
  if (!Array.isArray(t) || t.length === 0) return [];
  const e = Number.isInteger(n) && n > 0 ? n : rc, i = [];
  for (let r = 0; r < t.length; r += e)
    i.push(t.slice(r, r + e));
  return i;
}
c(Ih, "chunkArray");
async function Oh(t, n, e, i) {
  const r = Ih(e, i);
  for (const a of r)
    await t.updateEmbeddedDocuments(n, a), r.length > 1 && await Promise.resolve();
  return r.length;
}
c(Oh, "updatePlaceablesInChunks");
function Ah(t) {
  const n = /* @__PURE__ */ new Set();
  for (const e of (t == null ? void 0 : t.rules) ?? [])
    for (const i of Object.keys((e == null ? void 0 : e.criteria) ?? {}))
      i && n.add(i);
  return Array.from(n);
}
c(Ah, "getPresetDependencyKeys");
function Mh(t, n) {
  const e = /* @__PURE__ */ new Map();
  for (const i of da) {
    const r = n.get(i) ?? [], a = /* @__PURE__ */ new Set(), o = /* @__PURE__ */ new Map();
    for (const s of r) {
      const l = $u(s, i);
      if (l != null && l.base) {
        a.add(s.id);
        for (const u of Ah(l))
          o.has(u) || o.set(u, /* @__PURE__ */ new Set()), o.get(u).add(s.id);
      }
    }
    e.set(i, {
      allDocIds: a,
      keyToDocIds: o
    });
  }
  return {
    collectionsByType: n,
    byType: e
  };
}
c(Mh, "buildPlaceableDependencyIndex");
function Nh(t, n) {
  const e = ha.get(t);
  if (e && da.every((r) => e.collectionsByType.get(r) === n.get(r)))
    return e;
  const i = Mh(t, n);
  return ha.set(t, i), i;
}
c(Nh, "getPlaceableDependencyIndex");
function kh(t, n, e) {
  if (!n || !t) return [];
  const i = Lh(e);
  if (!i.length)
    return typeof t.get == "function" ? Array.from(n.allDocIds).map((a) => t.get(a)).filter(Boolean) : Array.from(t).filter((a) => n.allDocIds.has(a.id));
  const r = /* @__PURE__ */ new Set();
  for (const a of i) {
    const o = n.keyToDocIds.get(a);
    if (o)
      for (const s of o) r.add(s);
  }
  return r.size ? typeof t.get == "function" ? Array.from(r).map((a) => t.get(a)).filter(Boolean) : Array.from(t).filter((a) => r.has(a.id)) : [];
}
c(kh, "getDocsForChangedKeys");
function hi(t) {
  return !!t && typeof t == "object" && !Array.isArray(t);
}
c(hi, "isPlainObject");
function Ts(t, n) {
  if (Object.is(t, n)) return !0;
  if (Array.isArray(t) || Array.isArray(n)) {
    if (!Array.isArray(t) || !Array.isArray(n) || t.length !== n.length) return !1;
    for (let e = 0; e < t.length; e += 1)
      if (!Ts(t[e], n[e])) return !1;
    return !0;
  }
  if (hi(t) || hi(n)) {
    if (!hi(t) || !hi(n)) return !1;
    const e = Object.keys(n);
    for (const i of e)
      if (!Ts(t[i], n[i])) return !1;
    return !0;
  }
  return !1;
}
c(Ts, "areValuesEqual");
function xu(t, n) {
  const e = { _id: n._id };
  for (const [r, a] of Object.entries(n)) {
    if (r === "_id") continue;
    const o = t == null ? void 0 : t[r];
    if (hi(a) && hi(o)) {
      const s = xu(o, { _id: n._id, ...a });
      if (!s) continue;
      const l = Object.keys(s).filter((u) => u !== "_id");
      if (l.length > 0) {
        e[r] = {};
        for (const u of l)
          e[r][u] = s[u];
      }
      continue;
    }
    Ts(o, a) || (e[r] = a);
  }
  return Object.keys(e).filter((r) => r !== "_id").length > 0 ? e : null;
}
c(xu, "buildChangedPayload");
function $u(t, n) {
  var s;
  const e = ((s = t == null ? void 0 : t.flags) == null ? void 0 : s[de]) ?? {}, i = (e == null ? void 0 : e.presets) ?? null, r = n === "AmbientLight" ? (e == null ? void 0 : e.lightCriteria) ?? null : null, a = fa.get(t);
  if (a && a.type === n && a.rawPresets === i && a.rawLightCriteria === r)
    return a.presets;
  let o = null;
  if (e != null && e.presets) {
    const l = e.presets.base ?? null, u = Array.isArray(e.presets.rules) ? e.presets.rules : [];
    (l && Object.keys(l).length > 0 || u.length > 0) && (o = {
      base: l ?? {},
      rules: u
    });
  }
  if (!o && n === "AmbientLight" && (e != null && e.lightCriteria)) {
    const l = Th(e.lightCriteria);
    (l.base && Object.keys(l.base).length > 0 || l.rules.length > 0) && (o = {
      base: l.base,
      rules: l.rules
    });
  }
  return fa.set(t, {
    type: n,
    rawPresets: i,
    rawLightCriteria: r,
    presets: o
  }), o;
}
c($u, "getPresetsForDocument");
function xh(t = null, n = null) {
  t ? ha.delete(t) : ha = /* @__PURE__ */ new WeakMap(), n ? fa.delete(n) : t || (fa = /* @__PURE__ */ new WeakMap());
}
c(xh, "invalidatePlaceableCriteriaCaches");
async function Fu(t, n, e = {}) {
  var l, u;
  const i = xo(), r = {
    total: 0,
    scanned: 0,
    updated: 0,
    chunks: 0,
    byType: {},
    durationMs: 0
  };
  if (n = n ?? ((l = game.scenes) == null ? void 0 : l.viewed), !n)
    return r.durationMs = xo() - i, r;
  const a = new Set(wh()), o = new Map(
    da.map((f) => [f, n.getEmbeddedCollection(f) ?? []])
  ), s = Nh(n, o);
  for (const f of da) {
    const g = o.get(f) ?? [], m = {
      total: Sh(g),
      scanned: 0,
      updated: 0,
      chunks: 0
    }, y = s.byType.get(f) ?? null, b = kh(g, y, e.changedKeys);
    if (m.scanned = b.length, r.total += m.total, r.scanned += m.scanned, r.byType[f] = m, !b.length) continue;
    const p = [];
    for (const E of b) {
      const T = $u(E, f);
      if (!(T != null && T.base)) continue;
      const I = Tu(T.base, T.rules ?? [], t);
      I._id = E._id, f === "AmbientLight" && a.has(E._id) && (I.hidden = !0);
      const M = (E == null ? void 0 : E._source) ?? ((u = E == null ? void 0 : E.toObject) == null ? void 0 : u.call(E)) ?? {}, $ = xu(M, I);
      $ && p.push($);
    }
    p.length > 0 && (m.chunks = await Oh(n, f, p, e.chunkSize), m.updated = p.length, r.updated += p.length, r.chunks += m.chunks, console.log(`${de} | Updated ${p.length} ${f}(s)`));
  }
  return r.durationMs = xo() - i, r;
}
c(Fu, "updatePlaceables");
function ga() {
  return typeof (performance == null ? void 0 : performance.now) == "function" ? performance.now() : Date.now();
}
c(ga, "nowMs");
const Nr = /* @__PURE__ */ new Map();
function $h(t) {
  var n;
  return t = t ?? ((n = game.scenes) == null ? void 0 : n.viewed), t ? vr(t) : null;
}
c($h, "getState");
async function Fh(t, n, e = 0) {
  var y;
  const i = ga();
  if (n = n ?? ((y = game.scenes) == null ? void 0 : y.viewed), !n) return null;
  eh(n);
  const r = bt(n);
  if (!r.length)
    return console.warn(`${de} | applyState skipped: scene has no criteria.`), null;
  const a = vr(n, r), o = pl({ ...a, ...t ?? {} }, r), s = r.filter((b) => (a == null ? void 0 : a[b.key]) !== (o == null ? void 0 : o[b.key])).map((b) => b.key), l = s.length > 0;
  l && await Rf(n, o, r);
  const u = l ? o : a, [f, g] = await Promise.all([
    Iu(u, n, { changedKeys: s }),
    Fu(u, n, { changedKeys: s })
  ]), m = ga() - i;
  return D("Criteria apply telemetry", {
    sceneId: n.id,
    changedKeys: s,
    didChange: l,
    queuedMs: e,
    durationMs: m,
    tiles: f,
    placeables: g
  }), Hooks.callAll("eidolon-utilities.criteriaStateApplied", n, u), u;
}
c(Fh, "applyStateInternal");
async function Du(t, n) {
  var l;
  if (n = n ?? ((l = game.scenes) == null ? void 0 : l.viewed), !n) return null;
  const e = n.id ?? "__viewed__", i = ga(), r = Nr.get(e) ?? Promise.resolve();
  let a = null;
  const o = r.catch(() => null).then(async () => {
    const u = ga() - i;
    return Fh(t, n, u);
  });
  a = o;
  const s = o.finally(() => {
    Nr.get(e) === s && Nr.delete(e);
  });
  return Nr.set(e, s), a;
}
c(Du, "applyState$1");
function Dh(t) {
  var n;
  return t = t ?? ((n = game.scenes) == null ? void 0 : n.viewed), t ? vu(t) : null;
}
c(Dh, "getVersion");
async function _u(t, n) {
  var e;
  n = n ?? ((e = game.scenes) == null ? void 0 : e.viewed), n != null && n.setFlag && await n.setFlag(de, bu, Number(t));
}
c(_u, "setVersion");
async function _h(t) {
  return _u(wu, t);
}
c(_h, "markCurrentVersion");
const ji = "Standard", Ph = /* @__PURE__ */ c((...t) => console.log(`${de} | criteria indexer:`, ...t), "log");
function vl(t) {
  if (typeof t != "string") return null;
  let n = t;
  try {
    n = decodeURIComponent(t);
  } catch {
  }
  const e = n.match(/\[([^\]]+)\]/);
  if (!e) return null;
  const i = e[1].split(",").map((r) => r.trim()).filter(Boolean);
  return i.length ? i : null;
}
c(vl, "parseFileTags");
function Rh(t, n, e = ji) {
  return t != null && t.length ? t.map((i) => {
    const r = vl(i == null ? void 0 : i.name);
    if (!r) return {};
    const a = {};
    for (const [o, s] of Object.entries(n)) {
      const l = r[Number(o)];
      l != null && l !== e && (a[s] = l);
    }
    return a;
  }) : [];
}
c(Rh, "buildFileIndex");
function Hh(t, n) {
  return t.map((e, i) => {
    const r = [...n[e] ?? /* @__PURE__ */ new Set()].sort(), o = r.includes(ji) ? ji : r[0] ?? ji, s = ml(e);
    return s.key = e, s.label = e.charAt(0).toUpperCase() + e.slice(1), s.values = r.length ? r : [ji], s.default = s.values.includes(o) ? o : s.values[0], s.order = i, s;
  });
}
c(Hh, "buildCriteriaDefinitions");
async function kr(t, n, e, { dryRun: i = !1 } = {}) {
  const r = t.getFlag("monks-active-tiles", "files");
  if (!(r != null && r.length)) return null;
  const a = Rh(r, n), o = Lu(a, { files: r });
  for (const s of r) {
    const l = vl(s == null ? void 0 : s.name);
    if (l)
      for (const [u, f] of Object.entries(n)) {
        const g = l[Number(u)];
        g != null && e[f] && e[f].add(g);
      }
  }
  return i || (await t.setFlag(de, Xn, o), typeof t.unsetFlag == "function" && await t.unsetFlag(de, Qn)), { files: r.length };
}
c(kr, "indexTile");
async function qh(t, n = {}) {
  var I, M, $, k;
  const {
    dryRun: e = !1,
    force: i = !1
  } = n;
  if (t = t ?? ((I = game.scenes) == null ? void 0 : I.viewed), !t) throw new Error("No scene provided to indexScene.");
  if (!globalThis.Tagger) throw new Error("Tagger is required to index scene criteria.");
  if (!i && vu(t) >= wu)
    throw new Error(
      `Scene "${t.name}" is already criteria-indexed. Use force: true to re-index.`
    );
  const r = { sceneId: t.id }, a = Tagger.getByTag("Map", r) ?? [];
  if (!a.length) throw new Error("No Map tile found.");
  if (a.length > 1) throw new Error(`Expected 1 Map tile, found ${a.length}.`);
  const o = a[0], s = o.getFlag("monks-active-tiles", "files");
  if (!(s != null && s.length)) throw new Error("Map tile has no MATT files.");
  const l = vl((M = s[0]) == null ? void 0 : M.name);
  if (!(l != null && l.length))
    throw new Error(`Cannot parse bracket tags from: ${(($ = s[0]) == null ? void 0 : $.name) ?? "<unknown>"}`);
  if (l.length < 3)
    throw new Error(`Expected 3+ bracket tags, found ${l.length}.`);
  const u = Tagger.getByTag("Floor", r) ?? [], f = Tagger.getByTag("Roof", r) ?? [], g = Tagger.getByTag("Weather", r) ?? [];
  let m;
  const y = [];
  l.length >= 4 ? (m = { 0: "mood", 1: "stage", 2: "variant", 3: "effect" }, y.push("mood", "stage", "variant", "effect")) : (m = { 0: "mood", 1: "variant", 2: "effect" }, y.push("mood", "variant", "effect"));
  const b = { 1: "effect" }, p = {};
  for (const _ of y)
    p[_] = /* @__PURE__ */ new Set();
  const E = {
    map: null,
    floor: [],
    roof: [],
    weather: []
  };
  E.map = await kr(o, m, p, { dryRun: e });
  for (const _ of u) {
    const H = await kr(_, m, p, { dryRun: e });
    H && E.floor.push(H);
  }
  for (const _ of f) {
    const H = await kr(_, m, p, { dryRun: e });
    H && E.roof.push(H);
  }
  for (const _ of g) {
    const H = await kr(_, b, p, { dryRun: e });
    H && E.weather.push(H);
  }
  const T = Hh(y, p);
  return e || (await so(t, T), await _h(t)), Ph(
    e ? "Dry run complete" : "Indexing complete",
    `- ${T.length} criteria,`,
    `${((k = E.map) == null ? void 0 : k.files) ?? 0} map files`
  ), {
    criteria: T,
    state: T.reduce((_, H) => (_[H.key] = H.default, _), {}),
    tiles: E,
    overlayMode: g.length > 0
  };
}
c(qh, "indexScene");
var Mc, Je, gt, mt, Wn, it, Rt, un, Za, ye, Pu, Ru, Hu, Ss, qu, Ls, Bu, Ui, Is;
const vt = class vt extends Mn(An) {
  constructor(e = {}) {
    var i;
    super(e);
    x(this, ye);
    x(this, Je, null);
    x(this, gt, []);
    x(this, mt, {});
    x(this, Wn, !1);
    x(this, it, null);
    x(this, Rt, null);
    x(this, un, null);
    x(this, Za, 120);
    this.setScene(e.scene ?? ((i = game.scenes) == null ? void 0 : i.viewed) ?? null);
  }
  setScene(e) {
    var i;
    A(this, Je, e ?? ((i = game.scenes) == null ? void 0 : i.viewed) ?? null), h(this, ye, Pu).call(this);
  }
  get scene() {
    return d(this, Je);
  }
  async _prepareContext() {
    var r;
    const e = !!d(this, Je), i = e && d(this, gt).length > 0;
    return {
      hasScene: e,
      hasCriteria: i,
      sceneName: ((r = d(this, Je)) == null ? void 0 : r.name) ?? v("EIDOLON.CriteriaSwitcher.NoScene", "No active scene"),
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
      criteria: d(this, gt).map((a) => ({
        key: a.key,
        label: a.label || a.key,
        values: a.values.map((o) => {
          var s;
          return {
            value: o,
            selected: ((s = d(this, mt)) == null ? void 0 : s[a.key]) === o
          };
        }),
        defaultValue: a.default
      })),
      stateSummary: h(this, ye, Is).call(this)
    };
  }
  _onRender(e, i) {
    super._onRender(e, i), h(this, ye, Ru).call(this), h(this, ye, Hu).call(this);
  }
  async _onClose(e) {
    return d(this, it) !== null && (clearTimeout(d(this, it)), A(this, it, null)), d(this, un) !== null && (Hooks.off("eidolon-utilities.criteriaStateApplied", d(this, un)), A(this, un, null)), super._onClose(e);
  }
};
Je = new WeakMap(), gt = new WeakMap(), mt = new WeakMap(), Wn = new WeakMap(), it = new WeakMap(), Rt = new WeakMap(), un = new WeakMap(), Za = new WeakMap(), ye = new WeakSet(), Pu = /* @__PURE__ */ c(function() {
  if (!d(this, Je)) {
    A(this, gt, []), A(this, mt, {});
    return;
  }
  A(this, gt, bt(d(this, Je)).sort((e, i) => e.order - i.order)), A(this, mt, vr(d(this, Je), d(this, gt)));
}, "#hydrateFromScene"), Ru = /* @__PURE__ */ c(function() {
  var i, r;
  const e = this.element;
  e instanceof HTMLElement && (e.querySelectorAll("[data-criteria-key]").forEach((a) => {
    a.addEventListener("change", (o) => {
      const s = o.currentTarget;
      if (!(s instanceof HTMLSelectElement)) return;
      const l = s.dataset.criteriaKey;
      l && (A(this, mt, {
        ...d(this, mt),
        [l]: s.value
      }), h(this, ye, qu).call(this, { [l]: s.value }));
    });
  }), (i = e.querySelector("[data-action='reset-defaults']")) == null || i.addEventListener("click", () => {
    h(this, ye, Bu).call(this);
  }), (r = e.querySelector("[data-action='close-switcher']")) == null || r.addEventListener("click", () => {
    this.close();
  }));
}, "#bindEvents"), Hu = /* @__PURE__ */ c(function() {
  d(this, un) === null && A(this, un, Hooks.on("eidolon-utilities.criteriaStateApplied", (e, i) => {
    !d(this, Je) || (e == null ? void 0 : e.id) !== d(this, Je).id || d(this, Wn) || (A(this, mt, { ...i ?? {} }), this.render({ force: !0 }));
  }));
}, "#ensureSyncHook"), Ss = /* @__PURE__ */ c(async function(e) {
  var i, r;
  if (d(this, Je)) {
    h(this, ye, Ui).call(this, "applying"), A(this, Wn, !0);
    try {
      const a = await Du(e, d(this, Je));
      a && A(this, mt, a), h(this, ye, Ui).call(this, "ready"), this.render({ force: !0 });
    } catch (a) {
      console.error(`${de} | Failed to apply criteria state`, a), (r = (i = ui.notifications) == null ? void 0 : i.error) == null || r.call(
        i,
        v(
          "EIDOLON.CriteriaSwitcher.ApplyError",
          "Failed to apply the selected criteria state."
        )
      ), h(this, ye, Ui).call(this, "error", (a == null ? void 0 : a.message) ?? "Unknown error");
    } finally {
      A(this, Wn, !1), d(this, Rt) && h(this, ye, Ls).call(this);
    }
  }
}, "#applyPartialState"), qu = /* @__PURE__ */ c(function(e) {
  A(this, Rt, {
    ...d(this, Rt) ?? {},
    ...e ?? {}
  }), d(this, it) !== null && clearTimeout(d(this, it)), h(this, ye, Ui).call(this, "applying"), A(this, it, setTimeout(() => {
    A(this, it, null), h(this, ye, Ls).call(this);
  }, d(this, Za)));
}, "#queuePartialState"), Ls = /* @__PURE__ */ c(async function() {
  if (d(this, Wn) || !d(this, Rt)) return;
  const e = d(this, Rt);
  A(this, Rt, null), await h(this, ye, Ss).call(this, e);
}, "#flushPendingState"), Bu = /* @__PURE__ */ c(async function() {
  if (!d(this, gt).length) return;
  const e = d(this, gt).reduce((i, r) => (i[r.key] = r.default, i), {});
  A(this, mt, e), d(this, it) !== null && (clearTimeout(d(this, it)), A(this, it, null)), A(this, Rt, null), await h(this, ye, Ss).call(this, e);
}, "#resetToDefaults"), Ui = /* @__PURE__ */ c(function(e, i = "") {
  const r = this.element;
  if (!(r instanceof HTMLElement)) return;
  const a = r.querySelector("[data-role='status']");
  if (a instanceof HTMLElement)
    switch (a.dataset.mode = e, e) {
      case "applying":
        a.textContent = v("EIDOLON.CriteriaSwitcher.Applying", "Applying changes...");
        break;
      case "error":
        a.textContent = `${v("EIDOLON.CriteriaSwitcher.Error", "Error")}: ${i}`;
        break;
      case "ready":
      default:
        a.textContent = `${v("EIDOLON.CriteriaSwitcher.Ready", "Ready")}: ${h(this, ye, Is).call(this)}`;
        break;
    }
}, "#setStatus"), Is = /* @__PURE__ */ c(function() {
  return d(this, gt).length ? `[${d(this, gt).map((e) => {
    var i;
    return ((i = d(this, mt)) == null ? void 0 : i[e.key]) ?? e.default;
  }).join(" | ")}]` : "-";
}, "#formatStateSummary"), c(vt, "CriteriaSwitcherApplication"), Me(vt, "APP_ID", `${de}-criteria-switcher`), Me(vt, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  ze(vt, vt, "DEFAULT_OPTIONS"),
  {
    id: vt.APP_ID,
    classes: Array.from(
      /* @__PURE__ */ new Set([...((Mc = ze(vt, vt, "DEFAULT_OPTIONS")) == null ? void 0 : Mc.classes) ?? [], "eidolon-criteria-switcher-window", "themed"])
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
)), Me(vt, "PARTS", {
  content: {
    template: `modules/${de}/templates/criteria-switcher.html`
  }
});
let Cs = vt;
const Bh = ao(Cs);
let ei = null;
function jh(t) {
  var n;
  return t ?? ((n = game.scenes) == null ? void 0 : n.viewed) ?? null;
}
c(jh, "resolveScene");
function Uh(t) {
  var n;
  return !!(t != null && t.rendered && ((n = t == null ? void 0 : t.element) != null && n.isConnected));
}
c(Uh, "isRendered");
function fo() {
  return Uh(ei) ? ei : (ei = null, null);
}
c(fo, "getCriteriaSwitcher");
function ju(t) {
  var i, r, a, o, s;
  const n = jh(t);
  if (!n)
    return (r = (i = ui.notifications) == null ? void 0 : i.warn) == null || r.call(i, "No active scene to open the criteria switcher."), null;
  if (!lo(n))
    return (o = (a = ui.notifications) == null ? void 0 : a.warn) == null || o.call(a, "You do not have permission to manage scene criteria."), null;
  const e = fo();
  return e ? (e.setScene(n), e.render({ force: !0 }), (s = e.bringToFront) == null || s.call(e), e) : (ei = Bh({ scene: n }), ei.render({ force: !0 }), ei);
}
c(ju, "openCriteriaSwitcher");
function Uu() {
  const t = fo();
  t && (t.close(), ei = null);
}
c(Uu, "closeCriteriaSwitcher");
function El(t) {
  return fo() ? (Uu(), null) : ju(t);
}
c(El, "toggleCriteriaSwitcher");
const Vh = {
  SCHEMA_VERSION: yl,
  applyState: Du,
  getState: $h,
  getVersion: Dh,
  setVersion: _u,
  getCriteria(t) {
    var n;
    return bt(t ?? ((n = game.scenes) == null ? void 0 : n.viewed));
  },
  setCriteria(t, n) {
    var e;
    return so(n ?? ((e = game.scenes) == null ? void 0 : e.viewed), t);
  },
  updateTiles: Iu,
  updatePlaceables: Fu,
  indexScene: qh,
  openCriteriaSwitcher: ju,
  closeCriteriaSwitcher: Uu,
  toggleCriteriaSwitcher: El,
  findBestMatch: Kf,
  findFileIndex: Yf,
  resolveRules: Tu
};
function Vu(t) {
  var n;
  return ((n = t == null ? void 0 : t.getFlag) == null ? void 0 : n.call(t, "monks-active-tiles", "files")) ?? [];
}
c(Vu, "getTileFiles$1");
function zh(t = []) {
  return {
    strategy: "select-one",
    defaultTarget: Sn(t, 0) ?? { indexHint: 0 },
    variants: [
      {
        criteria: {},
        target: Sn(t, 0) ?? { indexHint: 0 }
      }
    ]
  };
}
c(zh, "createDefaultTileCriteria");
function Gh(t, n = {}) {
  var o, s;
  const { allowLegacy: e = !0 } = n, i = Vu(t), r = (o = t == null ? void 0 : t.getFlag) == null ? void 0 : o.call(t, de, Xn);
  if (r) return ii(r, { files: i });
  if (!e) return null;
  const a = (s = t == null ? void 0 : t.getFlag) == null ? void 0 : s.call(t, de, Qn);
  return a ? ii(a, { files: i }) : null;
}
c(Gh, "getTileCriteria");
async function ac(t, n, e = {}) {
  if (!(t != null && t.setFlag)) return null;
  const {
    strictValidation: i = !0
  } = e, r = Vu(t), a = ii(n, { files: r });
  if (!a)
    return typeof t.unsetFlag == "function" ? (await t.unsetFlag(de, Xn), await t.unsetFlag(de, Qn)) : (await t.setFlag(de, Xn, null), await t.setFlag(de, Qn, null)), null;
  if (i) {
    const o = Su(a, { files: r });
    if (o.errors.length > 0)
      throw new Error(
        `Tile criteria contains ${o.errors.length} conflicting rule pair(s). Resolve clashes before saving.`
      );
  }
  return await t.setFlag(de, Xn, a), typeof t.unsetFlag == "function" && await t.unsetFlag(de, Qn), a;
}
c(ac, "setTileCriteria");
const Os = "__eidolon_any__", Qt = "eidolon-tile-criteria", Wh = "fa-solid fa-sliders", zu = Symbol.for("eidolon.tileCriteriaUiState"), ho = ["all", "unmapped", "mapped", "conflicts"];
function Jh(t) {
  const n = t == null ? void 0 : t[zu];
  return !n || typeof n != "object" ? {
    filterQuery: "",
    filterMode: "all",
    selectedFileIndex: null
  } : {
    filterQuery: typeof n.filterQuery == "string" ? n.filterQuery : "",
    filterMode: ho.includes(n.filterMode) ? n.filterMode : "all",
    selectedFileIndex: Number.isInteger(n.selectedFileIndex) ? n.selectedFileIndex : null
  };
}
c(Jh, "readUiState");
function Kh(t, n) {
  if (!t || !n) return;
  typeof n.filterQuery == "string" && (t.filterQuery = n.filterQuery), ho.includes(n.filterMode) && (t.filterMode = n.filterMode), Number.isInteger(n.selectedFileIndex) && t.fileEntries.some((i) => i.index === n.selectedFileIndex) && (t.selectedFileIndex = n.selectedFileIndex);
}
c(Kh, "applyUiState");
function Yh(t) {
  const n = t == null ? void 0 : t.app, e = t == null ? void 0 : t.state;
  !n || !e || (n[zu] = {
    filterQuery: typeof e.filterQuery == "string" ? e.filterQuery : "",
    filterMode: ho.includes(e.filterMode) ? e.filterMode : "all",
    selectedFileIndex: Number.isInteger(e.selectedFileIndex) ? e.selectedFileIndex : null
  });
}
c(Yh, "persistUiState");
function Qh(t) {
  const n = (t == null ? void 0 : t.object) ?? (t == null ? void 0 : t.document) ?? null;
  return !(n != null && n.isEmbedded) || n.documentName !== "Tile" ? null : n;
}
c(Qh, "getTileDocument");
function Xh(t) {
  var n;
  return ((n = t == null ? void 0 : t.getFlag) == null ? void 0 : n.call(t, "monks-active-tiles", "files")) ?? [];
}
c(Xh, "getTileFiles");
function Zh(t, n) {
  var s;
  const e = (t == null ? void 0 : t.parent) ?? ((s = game.scenes) == null ? void 0 : s.viewed) ?? null, r = bt(e).sort((l, u) => l.order - u.order).map((l) => ({
    key: l.key,
    label: l.label || l.key,
    values: [...l.values ?? []]
  })), a = new Set(r.map((l) => l.key)), o = /* @__PURE__ */ new Map();
  for (const l of (n == null ? void 0 : n.variants) ?? [])
    for (const [u, f] of Object.entries((l == null ? void 0 : l.criteria) ?? {}))
      a.has(u) || (o.has(u) || o.set(u, /* @__PURE__ */ new Set()), typeof f == "string" && f.trim() && o.get(u).add(f.trim()));
  for (const [l, u] of o.entries())
    r.push({
      key: l,
      label: l,
      values: [...u]
    });
  return r;
}
c(Zh, "getCriteriaDefinitions");
function eg(t) {
  const n = {
    folders: /* @__PURE__ */ new Map(),
    files: []
  };
  for (const e of t) {
    const r = (e.path || e.label).split("/").filter(Boolean);
    if (!r.length) {
      n.files.push({ entry: e, name: e.label });
      continue;
    }
    const a = r.pop();
    let o = n;
    for (const s of r)
      o.folders.has(s) || o.folders.set(s, {
        folders: /* @__PURE__ */ new Map(),
        files: []
      }), o = o.folders.get(s);
    o.files.push({ entry: e, name: a || e.label });
  }
  return n;
}
c(eg, "buildTree");
function tg(t, n) {
  const e = [t];
  let i = n;
  for (; i.files.length === 0 && i.folders.size === 1; ) {
    const [r, a] = i.folders.entries().next().value;
    e.push(r), i = a;
  }
  return {
    label: e.join("/"),
    node: i
  };
}
c(tg, "collapseFolderBranch");
function ng(t, n) {
  const e = t.rulesByFile.get(n) ?? [], i = [];
  for (const r of e) {
    const a = Object.entries(r.criteria ?? {}).filter(([, s]) => typeof s == "string" && s.trim());
    if (!a.length) {
      i.push("*");
      continue;
    }
    const o = a.map(([s, l]) => `${t.criteriaLabels.get(s) ?? s}: ${l}`).join(" · ");
    i.push(o);
  }
  return i;
}
c(ng, "getRuleSummariesForFile");
function As(t) {
  var y, b;
  const n = Xh(t), e = bl(n), i = Gh(t, { allowLegacy: !0 }) ?? zh(n), r = Zh(t, i), a = new Map(r.map((p) => [p.key, p.label])), o = new Map(
    e.map((p) => [
      p.index,
      p.path || p.label
    ])
  ), s = Ki(i.defaultTarget, n), l = ((y = e[0]) == null ? void 0 : y.index) ?? 0, u = s >= 0 ? s : l, f = new Map(e.map((p) => [p.index, []]));
  let g = 1;
  for (const p of i.variants ?? []) {
    const E = Ki(p.target, n);
    E < 0 || (f.has(E) || f.set(E, []), f.get(E).push({
      id: g,
      criteria: { ...p.criteria ?? {} }
    }), g += 1);
  }
  const m = e.some((p) => p.index === u) ? u : ((b = e[0]) == null ? void 0 : b.index) ?? null;
  return {
    files: n,
    fileEntries: e,
    criteriaDefinitions: r,
    criteriaLabels: a,
    relativePaths: o,
    defaultIndex: u,
    selectedFileIndex: m,
    filterQuery: "",
    filterMode: "all",
    nextRuleId: g,
    rulesByFile: f,
    status: {
      mode: "ready",
      message: v("EIDOLON.TileCriteria.Ready", "Ready")
    }
  };
}
c(As, "buildEditorState");
function Ms(t, n) {
  return t.rulesByFile.has(n) || t.rulesByFile.set(n, []), t.rulesByFile.get(n);
}
c(Ms, "getRulesForFile");
function ig(t) {
  return Object.fromEntries(
    Object.entries(t ?? {}).filter(([n, e]) => typeof n == "string" && n && typeof e == "string" && e.trim()).map(([n, e]) => [n, e.trim()])
  );
}
c(ig, "sanitizeRuleCriteria");
function Gu(t) {
  const n = Sn(t.files, t.defaultIndex);
  if (!n) return null;
  const e = [], i = [];
  for (const [a, o] of t.rulesByFile.entries()) {
    const s = Sn(t.files, a);
    if (s)
      for (const [l, u] of o.entries()) {
        const f = ig(u.criteria);
        e.push({
          criteria: f,
          target: { ...s }
        }), i.push({
          fileIndex: a,
          ruleId: u.id,
          rulePosition: l,
          criteria: f
        });
      }
  }
  return e.length || (e.push({
    criteria: {},
    target: { ...n }
  }), i.push({
    fileIndex: t.defaultIndex,
    ruleId: null,
    rulePosition: null,
    criteria: {},
    isFallback: !0
  })), {
    normalized: ii(
      {
        strategy: "select-one",
        defaultTarget: n,
        variants: e
      },
      { files: t.files }
    ),
    sources: i
  };
}
c(Gu, "buildTileCriteriaDraft");
function rg(t) {
  var n;
  return ((n = Gu(t)) == null ? void 0 : n.normalized) ?? null;
}
c(rg, "exportTileCriteria");
function oc(t) {
  const n = Gu(t);
  if (!(n != null && n.normalized))
    return {
      errors: [],
      warnings: [],
      errorFileIndexes: [],
      warningFileIndexes: []
    };
  const e = Su(n.normalized, { files: t.files }), i = /* @__PURE__ */ c((s) => {
    const l = n.sources[s.leftIndex] ?? null, u = n.sources[s.rightIndex] ?? null;
    return {
      ...s,
      leftFileIndex: l == null ? void 0 : l.fileIndex,
      rightFileIndex: u == null ? void 0 : u.fileIndex
    };
  }, "mapConflict"), r = e.errors.map((s) => i(s)), a = e.warnings.map((s) => i(s)), o = /* @__PURE__ */ c((s) => {
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
c(oc, "analyzeRuleConflicts");
function xr(t, n = "neutral") {
  const e = document.createElement("span");
  return e.classList.add("eidolon-tile-criteria__badge"), e.dataset.kind = n, e.textContent = t, e;
}
c(xr, "createBadge");
function ag(t, n = {}) {
  const e = typeof t == "string" ? t : "", {
    maxLength: i = 42,
    headLength: r = 20,
    tailLength: a = 16
  } = n;
  if (!e || e.length <= i) return e;
  const o = e.slice(0, r).trimEnd(), s = e.slice(-a).trimStart();
  return `${o}...${s}`;
}
c(ag, "middleEllipsis");
function og(t) {
  const n = typeof t == "string" ? t.trim() : "";
  if (!n)
    return {
      error: "",
      matches: /* @__PURE__ */ c(() => !0, "matches")
    };
  let e = n, i = "i";
  if (n.startsWith("/") && n.length > 1) {
    const r = n.lastIndexOf("/");
    r > 0 && (e = n.slice(1, r), i = n.slice(r + 1) || "i");
  }
  i = i.replace(/g/g, "");
  try {
    const r = new RegExp(e, i);
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
c(og, "createRegexFilter");
function sg(t, n) {
  const e = document.createElement("select");
  e.dataset.criteriaKey = t.key;
  const i = document.createElement("option");
  i.value = Os, i.textContent = "*", e.appendChild(i);
  const r = new Set(t.values ?? []);
  n && !r.has(n) && r.add(n);
  for (const a of r) {
    const o = document.createElement("option");
    o.value = a, o.textContent = a, e.appendChild(o);
  }
  return e.value = n ?? Os, e;
}
c(sg, "createCriterionSelect");
function lg(t, n, e, i) {
  var s;
  const r = document.createElement("div");
  r.classList.add("eidolon-tile-criteria__rule-editor");
  const a = document.createElement("div");
  a.classList.add("eidolon-tile-criteria__rule-grid");
  for (const l of n.criteriaDefinitions) {
    const u = document.createElement("label");
    u.classList.add("eidolon-tile-criteria__rule-field");
    const f = document.createElement("span");
    f.classList.add("eidolon-tile-criteria__criterion-label"), f.textContent = l.label, u.appendChild(f);
    const g = sg(l, (s = t.criteria) == null ? void 0 : s[l.key]);
    g.addEventListener("change", () => {
      g.value === Os ? delete t.criteria[l.key] : t.criteria[l.key] = g.value, i();
    }), u.appendChild(g), a.appendChild(u);
  }
  r.appendChild(a);
  const o = document.createElement("button");
  return o.type = "button", o.classList.add("control", "ui-control", "eidolon-tile-criteria__rule-remove"), o.textContent = v("EIDOLON.TileCriteria.RemoveRule", "Remove"), o.addEventListener("click", () => {
    const u = Ms(n, e).filter((f) => f.id !== t.id);
    n.rulesByFile.set(e, u), i();
  }), r.appendChild(o), r;
}
c(lg, "renderRuleEditor");
const zr = /* @__PURE__ */ new WeakMap();
function Wu(t) {
  return (t == null ? void 0 : t.app) ?? (t == null ? void 0 : t.tile) ?? null;
}
c(Wu, "getDialogOwner");
function cg(t) {
  for (const n of t) {
    const e = Xt(n);
    if (e) return e;
    const i = Xt(n == null ? void 0 : n.element);
    if (i) return i;
  }
  return null;
}
c(cg, "findDialogRoot$1");
function ug(t, n, e) {
  const i = t.state, r = i.fileEntries.find((p) => p.index === n);
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
  const f = document.createElement("button");
  f.type = "button", f.classList.add("control", "ui-control", "eidolon-tile-criteria__editor-action"), i.defaultIndex === r.index ? (f.textContent = v("EIDOLON.TileCriteria.IsDefault", "Default Target"), f.disabled = !0) : (f.textContent = v("EIDOLON.TileCriteria.SetDefault", "Set As Default"), f.addEventListener("click", () => {
    i.defaultIndex = r.index, Ze(t), e();
  })), u.appendChild(f);
  const g = document.createElement("button");
  g.type = "button", g.classList.add("control", "ui-control", "eidolon-tile-criteria__editor-action", "secondary"), g.textContent = v("EIDOLON.TileCriteria.ClearFileRules", "Clear File Rules"), g.addEventListener("click", () => {
    i.rulesByFile.set(r.index, []), Ze(t), e();
  }), u.appendChild(g), a.appendChild(u);
  const m = document.createElement("div");
  m.classList.add("eidolon-tile-criteria__rule-editors");
  const y = Ms(i, r.index);
  if (y.length)
    for (const p of y)
      m.appendChild(
        lg(p, i, r.index, () => {
          Ze(t), e();
        })
      );
  else {
    const p = document.createElement("p");
    p.classList.add("notes"), p.textContent = v(
      "EIDOLON.TileCriteria.NoRulesForFile",
      "No rules map to this file yet. Add one to define when this variant should be active."
    ), m.appendChild(p);
  }
  a.appendChild(m);
  const b = document.createElement("button");
  return b.type = "button", b.classList.add("control", "ui-control", "eidolon-tile-criteria__editor-action"), b.textContent = v("EIDOLON.TileCriteria.AddRule", "Add Rule"), b.disabled = !i.criteriaDefinitions.length, b.addEventListener("click", () => {
    Ms(i, r.index).push({
      id: i.nextRuleId,
      criteria: {}
    }), i.nextRuleId += 1, Ze(t), e();
  }), a.appendChild(b), a;
}
c(ug, "buildRuleEditorContent");
function dg(t, n) {
  var g, m, y;
  const e = Wu(t);
  if (!e) return;
  const i = zr.get(e);
  if (i) {
    i.controller = t, i.fileIndex = n, (g = i.refresh) == null || g.call(i);
    return;
  }
  const r = {
    controller: t,
    fileIndex: n,
    host: null,
    refresh: null
  };
  zr.set(e, r);
  const a = /* @__PURE__ */ c(() => {
    zr.delete(e);
  }, "closeDialog"), o = /* @__PURE__ */ c(() => {
    r.host instanceof HTMLElement && r.host.replaceChildren(
      ug(r.controller, r.fileIndex, o)
    );
  }, "refreshDialog");
  r.refresh = o;
  const s = v("EIDOLON.TileCriteria.EditorTitle", "Edit Tile Criteria Rules"), l = '<div class="eidolon-tile-criteria-editor-host"></div>', u = v("EIDOLON.TileCriteria.CloseEditor", "Close"), f = (y = (m = foundry == null ? void 0 : foundry.applications) == null ? void 0 : m.api) == null ? void 0 : y.DialogV2;
  if (typeof (f == null ? void 0 : f.wait) == "function") {
    f.wait({
      window: { title: s },
      content: l,
      buttons: [{ action: "close", label: u, default: !0 }],
      render: /* @__PURE__ */ c((...b) => {
        var T;
        const p = cg(b), E = (T = p == null ? void 0 : p.querySelector) == null ? void 0 : T.call(p, ".eidolon-tile-criteria-editor-host");
        E instanceof HTMLElement && (r.host = E, o());
      }, "render"),
      close: a,
      rejectClose: !1
    }).catch((b) => {
      console.warn(`${de} | Rule editor dialog failed`, b), a();
    });
    return;
  }
  a();
}
c(dg, "openRuleEditorDialog");
function sc(t) {
  var i;
  const n = Wu(t);
  if (!n) return;
  const e = zr.get(n);
  (i = e == null ? void 0 : e.refresh) == null || i.call(e);
}
c(sc, "refreshOpenRuleEditor");
function Ns(t, n) {
  return (t.rulesByFile.get(n) ?? []).length > 0;
}
c(Ns, "hasRulesForFile");
function Ju(t, n) {
  var e, i;
  return ((e = t == null ? void 0 : t.errorFileIndexes) == null ? void 0 : e.includes(n)) || ((i = t == null ? void 0 : t.warningFileIndexes) == null ? void 0 : i.includes(n));
}
c(Ju, "hasConflictForFile");
function fg(t, n, e) {
  switch (t.filterMode) {
    case "unmapped":
      return !Ns(t, n.index);
    case "mapped":
      return Ns(t, n.index);
    case "conflicts":
      return Ju(e, n.index);
    case "all":
    default:
      return !0;
  }
}
c(fg, "matchesFilterMode");
function hg(t, n) {
  let e = 0, i = 0, r = 0;
  for (const a of t.fileEntries)
    Ns(t, a.index) ? e += 1 : i += 1, Ju(n, a.index) && (r += 1);
  return {
    all: t.fileEntries.length,
    mapped: e,
    unmapped: i,
    conflicts: r
  };
}
c(hg, "getFilterModeCounts");
function gg(t) {
  switch (t) {
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
c(gg, "getFilterModeLabel");
function Ku(t, n, e, i, r) {
  var u, f;
  const a = [...t.folders.keys()].sort((g, m) => g.localeCompare(m));
  for (const g of a) {
    const m = tg(g, t.folders.get(g)), y = document.createElement("li");
    y.classList.add("eidolon-tile-criteria__tree-branch");
    const b = document.createElement("div");
    b.classList.add("document", "folder", "update", "eidolon-tile-criteria__folder-row");
    const p = document.createElement("i");
    p.classList.add("fa-solid", "fa-folder-open"), b.appendChild(p);
    const E = document.createElement("span");
    E.classList.add("eidolon-tile-criteria__tree-folder-label"), E.textContent = m.label, E.title = m.label, b.appendChild(E), y.appendChild(b);
    const T = document.createElement("ul");
    T.classList.add("eidolon-tile-criteria__tree"), T.dataset.folder = m.label, Ku(m.node, n, e, i, T), T.childElementCount > 0 && y.appendChild(T), r.appendChild(y);
  }
  const o = [...t.files].sort((g, m) => g.name.localeCompare(m.name));
  if (!o.length) return;
  const s = document.createElement("li"), l = document.createElement("ul");
  l.classList.add("document-list", "eidolon-tile-criteria__document-list");
  for (const g of o) {
    const m = g.entry, y = m.index === n.selectedFileIndex, b = m.index === n.defaultIndex, p = ng(n, m.index), E = document.createElement("li");
    E.classList.add("document", "update", "eidolon-tile-criteria__tree-file");
    const T = document.createElement("button");
    T.type = "button", T.classList.add("eidolon-tile-criteria__file-row");
    const I = (u = i == null ? void 0 : i.errorFileIndexes) == null ? void 0 : u.includes(m.index), M = (f = i == null ? void 0 : i.warningFileIndexes) == null ? void 0 : f.includes(m.index);
    I ? T.classList.add("has-conflict") : M && T.classList.add("has-warning");
    const $ = n.relativePaths.get(m.index) || m.path || g.name, k = [$];
    I ? k.push(
      v(
        "EIDOLON.TileCriteria.ConflictFileHint",
        "This file participates in one or more conflicting rules."
      )
    ) : M && k.push(
      v(
        "EIDOLON.TileCriteria.WarningFileHint",
        "This file has potentially redundant rules."
      )
    ), p.length || k.push(
      v(
        "EIDOLON.TileCriteria.UnmappedHint",
        "No criteria rules map to this file."
      )
    ), T.title = k.join(`
`), y && T.classList.add("is-selected"), T.addEventListener("click", () => {
      n.selectedFileIndex = m.index, Ze(e), dg(e, m.index);
    });
    const _ = document.createElement("span");
    _.classList.add("eidolon-tile-criteria__indicator"), _.dataset.kind = b ? "default" : p.length ? "mapped" : "unmapped", T.appendChild(_);
    const H = document.createElement("span");
    H.classList.add("eidolon-tile-criteria__file-content");
    const G = document.createElement("span");
    G.classList.add("eidolon-tile-criteria__file-heading");
    const ie = document.createElement("span");
    ie.classList.add("eidolon-tile-criteria__file-title"), ie.textContent = ag(g.name || m.label), ie.title = $, G.appendChild(ie);
    const U = xr(`#${m.index + 1}`, "meta");
    U.classList.add("eidolon-tile-criteria__index-badge"), G.appendChild(U), H.appendChild(G);
    const ee = document.createElement("span");
    ee.classList.add("eidolon-tile-criteria__badges"), b && ee.appendChild(xr(v("EIDOLON.TileCriteria.DefaultBadge", "Default"), "default"));
    const R = p.slice(0, 2);
    for (const K of R)
      ee.appendChild(xr(K, "rule"));
    if (p.length > R.length && ee.appendChild(xr(`+${p.length - R.length}`, "meta")), H.appendChild(ee), T.appendChild(H), I || M) {
      const K = document.createElement("span");
      K.classList.add("eidolon-tile-criteria__row-warning"), K.dataset.mode = I ? "error" : "warning", K.innerHTML = '<i class="fa-solid fa-triangle-exclamation" inert=""></i>', T.appendChild(K);
    }
    E.appendChild(T), l.appendChild(E);
  }
  s.appendChild(l), r.appendChild(s);
}
c(Ku, "renderTreeNode");
function mg(t, n, e, i = {}) {
  const r = document.createElement("section");
  r.classList.add("eidolon-tile-criteria__tree-panel");
  const a = og(t.filterQuery), o = hg(t, e);
  t.filterMode !== "all" && o[t.filterMode] === 0 && (t.filterMode = "all");
  const s = document.createElement("div");
  s.classList.add("eidolon-tile-criteria__toolbar");
  const l = document.createElement("div");
  l.classList.add("eidolon-tile-criteria__mode-bar");
  for (const I of ho) {
    const M = document.createElement("button");
    M.type = "button", M.classList.add("control", "ui-control", "eidolon-tile-criteria__mode-button"), M.dataset.mode = I, M.textContent = gg(I);
    const $ = I === "all" || o[I] > 0;
    M.disabled = !$, $ || (M.dataset.tooltip = v(
      "EIDOLON.TileCriteria.FilterModeUnavailable",
      "No entries currently match this filter."
    ), M.title = M.dataset.tooltip), t.filterMode === I ? (M.classList.add("is-active"), M.setAttribute("aria-pressed", "true")) : M.setAttribute("aria-pressed", "false"), M.addEventListener("click", () => {
      t.filterMode !== I && (t.filterMode = I, Ze(n));
    }), l.appendChild(M);
  }
  s.appendChild(l);
  const u = document.createElement("div");
  u.classList.add("eidolon-tile-criteria__filter-row");
  const f = document.createElement("input");
  f.type = "text", f.classList.add("eidolon-tile-criteria__filter-input"), f.placeholder = v("EIDOLON.TileCriteria.FilterPlaceholder", "Regex filter (path)"), f.value = t.filterQuery, f.autocomplete = "off", f.addEventListener("keydown", (I) => {
    I.stopPropagation(), I.key === "Enter" && I.preventDefault();
  }), f.addEventListener("keyup", (I) => {
    I.stopPropagation();
  }), f.addEventListener("change", (I) => {
    I.stopPropagation();
  }), f.addEventListener("input", (I) => {
    I.stopPropagation();
    const M = f.selectionStart ?? f.value.length, $ = f.selectionEnd ?? M;
    t.filterQuery = f.value, Ze(n), requestAnimationFrame(() => {
      const k = n.section.querySelector(".eidolon-tile-criteria__filter-input");
      if (k instanceof HTMLInputElement) {
        k.focus();
        try {
          k.setSelectionRange(M, $);
        } catch {
        }
      }
    });
  }), u.appendChild(f);
  const g = document.createElement("div");
  g.classList.add("eidolon-tile-criteria__toolbar-actions");
  const m = document.createElement("button");
  m.type = "button";
  const y = v("EIDOLON.TileCriteria.Save", "Save Rules");
  m.classList.add("control", "ui-control", "eidolon-tile-criteria__toolbar-action", "icon-only"), m.dataset.tooltip = y, m.setAttribute("aria-label", y), m.title = y, m.innerHTML = '<i class="fa-solid fa-floppy-disk" inert=""></i>', m.disabled = e.errors.length > 0, m.addEventListener("click", () => {
    var I;
    (I = i.onSave) == null || I.call(i);
  }), g.appendChild(m);
  const b = document.createElement("button");
  b.type = "button";
  const p = v("EIDOLON.TileCriteria.Clear", "Clear Rules");
  if (b.classList.add("control", "ui-control", "secondary", "eidolon-tile-criteria__toolbar-action", "icon-only"), b.dataset.tooltip = p, b.setAttribute("aria-label", p), b.title = p, b.innerHTML = '<i class="fa-solid fa-trash" inert=""></i>', b.addEventListener("click", () => {
    var I;
    (I = i.onClear) == null || I.call(i);
  }), g.appendChild(b), u.appendChild(g), s.appendChild(u), r.appendChild(s), a.error) {
    const I = document.createElement("p");
    I.classList.add("notes", "eidolon-tile-criteria__filter-error"), I.textContent = `${v("EIDOLON.TileCriteria.InvalidRegex", "Invalid regex")}: ${a.error}`, r.appendChild(I);
  }
  const E = document.createElement("div");
  E.classList.add("eidolon-tile-criteria__library-tree");
  const T = t.fileEntries.filter((I) => {
    const M = t.relativePaths.get(I.index) || I.path || I.label;
    return fg(t, I, e) && a.matches(M);
  });
  if (t.fileEntries.length)
    if (T.length) {
      const I = document.createElement("ul");
      I.classList.add("eidolon-tile-criteria__tree"), Ku(eg(T), t, n, e, I), E.appendChild(I);
    } else {
      const I = document.createElement("p");
      I.classList.add("notes"), I.textContent = v("EIDOLON.TileCriteria.NoMatches", "No variants match this filter."), E.appendChild(I);
    }
  else {
    const I = document.createElement("p");
    I.classList.add("notes"), I.textContent = v("EIDOLON.TileCriteria.NoVariants", "No MATT variants found"), E.appendChild(I);
  }
  return r.appendChild(E), r;
}
c(mg, "renderTreePanel");
function Ze(t) {
  const { section: n, state: e } = t, i = oc(e);
  Yh(t), n.replaceChildren();
  const r = /* @__PURE__ */ c(async () => {
    try {
      const o = oc(e);
      if (o.errors.length) {
        e.status = {
          mode: "error",
          message: v(
            "EIDOLON.TileCriteria.ConflictSaveBlocked",
            `Resolve ${o.errors.length} conflict(s) before saving tile criteria rules.`
          )
        }, Ze(t);
        return;
      }
      const s = rg(e);
      if (!s) {
        e.status = {
          mode: "error",
          message: v("EIDOLON.TileCriteria.Invalid", "Invalid rules. Select valid target variants.")
        }, Ze(t);
        return;
      }
      await ac(t.tile, s);
      const l = e.filterQuery, u = e.filterMode, f = e.selectedFileIndex;
      t.state = As(t.tile), t.state.filterQuery = l, t.state.filterMode = u, Number.isInteger(f) && (t.state.selectedFileIndex = f), t.state.status = {
        mode: "ready",
        message: v("EIDOLON.TileCriteria.Saved", "Tile criteria rules saved.")
      }, Ze(t), sc(t);
    } catch (o) {
      console.error(`${de} | Failed to save tile criteria`, o), e.status = {
        mode: "error",
        message: (o == null ? void 0 : o.message) ?? "Failed to save tile criteria rules."
      }, Ze(t);
    }
  }, "handleSave"), a = /* @__PURE__ */ c(async () => {
    try {
      await ac(t.tile, null);
      const o = e.filterQuery, s = e.filterMode, l = e.selectedFileIndex;
      t.state = As(t.tile), t.state.filterQuery = o, t.state.filterMode = s, Number.isInteger(l) && (t.state.selectedFileIndex = l), t.state.status = {
        mode: "ready",
        message: v("EIDOLON.TileCriteria.Cleared", "Tile criteria rules cleared.")
      }, Ze(t), sc(t);
    } catch (o) {
      console.error(`${de} | Failed to clear tile criteria`, o), e.status = {
        mode: "error",
        message: (o == null ? void 0 : o.message) ?? "Failed to clear tile criteria rules."
      }, Ze(t);
    }
  }, "handleClear");
  if (n.appendChild(mg(e, t, i, {
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
    ), o.appendChild(l), n.appendChild(o);
  }
  if (e.status.mode === "error" || e.status.mode === "warning") {
    const o = document.createElement("p");
    o.classList.add("eidolon-tile-criteria__status", "notes"), o.dataset.mode = e.status.mode, o.textContent = e.status.message, n.appendChild(o);
  }
}
c(Ze, "renderController");
function pg(t, n = null) {
  const e = document.createElement("section");
  e.classList.add("eidolon-tile-criteria");
  const i = As(t);
  Kh(i, Jh(n));
  const r = {
    app: n,
    tile: t,
    section: e,
    state: i
  };
  return Ze(r), r;
}
c(pg, "createController");
function yg(t) {
  if (!(t instanceof HTMLElement)) return null;
  const n = [
    ":scope > footer.sheet-footer",
    ":scope > footer.form-footer",
    ":scope > .sheet-footer",
    ":scope > .form-footer",
    ":scope > footer"
  ];
  for (const e of n) {
    const i = t.querySelector(e);
    if (i instanceof HTMLElement) return i;
  }
  return null;
}
c(yg, "findFooterElement");
function bg(t) {
  if (!(t instanceof HTMLElement)) return null;
  const n = [
    "nav.sheet-tabs[data-group]",
    "nav.tabs[data-group]",
    "nav.sheet-tabs",
    "nav.tabs"
  ];
  for (const e of n) {
    const i = t.querySelector(e);
    if (i instanceof HTMLElement) return i;
  }
  return null;
}
c(bg, "findTabNav");
function wg(t, n) {
  var i, r, a;
  return t instanceof HTMLElement ? [
    (i = t.querySelector(".tab[data-tab]")) == null ? void 0 : i.parentElement,
    t.querySelector(".sheet-body"),
    (a = (r = n == null ? void 0 : n.parentElement) == null ? void 0 : r.querySelector) == null ? void 0 : a.call(r, ":scope > .sheet-body"),
    n == null ? void 0 : n.parentElement
  ].find((o) => o instanceof HTMLElement) ?? null : null;
}
c(wg, "findTabBody");
function vg(t, n) {
  var e, i, r, a, o, s, l;
  return ((e = t == null ? void 0 : t.dataset) == null ? void 0 : e.group) ?? ((a = (r = (i = t == null ? void 0 : t.querySelector) == null ? void 0 : i.call(t, "[data-group]")) == null ? void 0 : r.dataset) == null ? void 0 : a.group) ?? ((l = (s = (o = n == null ? void 0 : n.querySelector) == null ? void 0 : o.call(n, ".tab[data-group]")) == null ? void 0 : s.dataset) == null ? void 0 : l.group) ?? "main";
}
c(vg, "getTabGroup");
function Eg(t, n) {
  if (!(t instanceof HTMLElement)) return;
  t.textContent = "";
  const e = document.createElement("i");
  e.className = Wh, e.setAttribute("inert", ""), t.append(e, " ");
  const i = document.createElement("span");
  i.textContent = n, t.append(i);
}
c(Eg, "setTabButtonContent");
function Tg(t, n) {
  const e = t.querySelector("[data-tab]"), i = (e == null ? void 0 : e.tagName) || "A", r = document.createElement(i);
  return e instanceof HTMLElement && (r.className = e.className), r.classList.remove("active"), i === "BUTTON" && (r.type = "button"), r.dataset.action = "tab", r.dataset.tab = Qt, r.dataset.group = n, r.setAttribute("aria-selected", "false"), r.setAttribute("aria-pressed", "false"), r;
}
c(Tg, "createTabButton");
function Cg(t, n) {
  const e = document.createElement("div");
  e.classList.add("tab"), e.dataset.tab = Qt, e.dataset.group = n, e.dataset.applicationPart = Qt, e.setAttribute("hidden", "true");
  const i = yg(t);
  return t.insertBefore(e, i ?? null), e;
}
c(Cg, "createTabPanel");
function $o(t, n, e, i) {
  var o;
  if (!(e instanceof HTMLElement) || !(i instanceof HTMLElement)) return;
  const r = (o = t == null ? void 0 : t.tabGroups) == null ? void 0 : o[n];
  if (typeof r == "string" ? r === Qt : e.classList.contains("active") || i.classList.contains("active")) {
    e.classList.add("active"), e.setAttribute("aria-selected", "true"), e.setAttribute("aria-pressed", "true"), i.classList.add("active"), i.removeAttribute("hidden"), i.removeAttribute("aria-hidden");
    return;
  }
  e.classList.remove("active"), e.setAttribute("aria-selected", "false"), e.setAttribute("aria-pressed", "false"), i.classList.remove("active"), i.setAttribute("hidden", "true");
}
c($o, "syncTabVisibility");
function Sg(t, n) {
  const e = bg(n), i = wg(n, e);
  if (!(e instanceof HTMLElement) || !(i instanceof HTMLElement)) return null;
  const r = vg(e, i);
  let a = e.querySelector(`[data-tab="${Qt}"]`);
  a instanceof HTMLElement || (a = Tg(e, r), e.appendChild(a)), Eg(a, v("EIDOLON.TileCriteria.TabLabel", "Criteria"));
  let o = i.querySelector(`.tab[data-tab="${Qt}"]`);
  return o instanceof HTMLElement || (o = Cg(i, r)), a.dataset.eidolonTileCriteriaBound || (a.addEventListener("click", () => {
    lu(t, Qt, r), requestAnimationFrame(() => {
      $o(t, r, a, o);
    });
  }), a.dataset.eidolonTileCriteriaBound = "true"), $o(t, r, a, o), requestAnimationFrame(() => {
    $o(t, r, a, o);
  }), o;
}
c(Sg, "ensureTileCriteriaTab");
function Lg() {
  Hooks.on("renderTileConfig", (t, n) => {
    var l, u, f, g;
    const e = Xt(n);
    if (!e) return;
    const i = Qh(t);
    if (!i) return;
    if ((l = e.querySelector(".eidolon-tile-criteria")) == null || l.remove(), !oo()) {
      (u = e.querySelector(`.item[data-tab='${Qt}']`)) == null || u.remove(), (f = e.querySelector(`.tab[data-tab='${Qt}']`)) == null || f.remove();
      return;
    }
    const r = pg(i, t), a = Sg(t, e);
    if (a instanceof HTMLElement) {
      a.replaceChildren(r.section), (g = t.setPosition) == null || g.call(t, { height: "auto" });
      return;
    }
    const o = (t == null ? void 0 : t.form) instanceof HTMLFormElement ? t.form : e instanceof HTMLFormElement ? e : e.querySelector("form");
    if (!(o instanceof HTMLFormElement)) return;
    const s = o.querySelector("button[type='submit']");
    s != null && s.parentElement ? s.parentElement.insertAdjacentElement("beforebegin", r.section) : o.appendChild(r.section);
  });
}
c(Lg, "registerTileCriteriaConfigControls");
function Ig(t) {
  if (Array.isArray(t)) return t;
  if (t instanceof Map) return Array.from(t.values());
  if (t && typeof t == "object") {
    if (typeof t.values == "function")
      try {
        const n = Array.from(t.values());
        if (n.length > 0) return n;
      } catch {
      }
    return Object.values(t);
  }
  return [];
}
c(Ig, "toList");
function Og(t, n) {
  const e = t == null ? void 0 : t.tools;
  return Array.isArray(e) ? e.some((i) => (i == null ? void 0 : i.name) === n) : e instanceof Map ? e.has(n) : e && typeof e == "object" ? n in e ? !0 : Object.values(e).some((i) => (i == null ? void 0 : i.name) === n) : !1;
}
c(Og, "hasTool");
function Ag(t, n) {
  if (Array.isArray(t.tools)) {
    t.tools.push(n);
    return;
  }
  if (t.tools instanceof Map) {
    t.tools.set(n.name, n);
    return;
  }
  if (t.tools && typeof t.tools == "object") {
    t.tools[n.name] = n;
    return;
  }
  t.tools = [n];
}
c(Ag, "addTool");
function Mg() {
  Hooks.on("getSceneControlButtons", (t) => {
    var i;
    const n = Ig(t);
    if (!n.length) return;
    const e = n.find((r) => (r == null ? void 0 : r.name) === "tiles") ?? n.find((r) => (r == null ? void 0 : r.name) === "tokens" || (r == null ? void 0 : r.name) === "token") ?? n[0];
    e && (Og(e, "eidolonCriteriaSwitcher") || Ag(e, {
      name: "eidolonCriteriaSwitcher",
      title: "Criteria Switcher",
      icon: "fa-solid fa-sliders",
      button: !0,
      toggle: !1,
      visible: lo(((i = game.scenes) == null ? void 0 : i.viewed) ?? null),
      onClick: /* @__PURE__ */ c(() => El(), "onClick")
    }));
  });
}
c(Mg, "registerSceneControlButton");
function $r(t, n) {
  if (!t || typeof t != "object") return !1;
  const e = String(n).split(".");
  let i = t;
  for (const r of e) {
    if (!i || typeof i != "object" || !Object.prototype.hasOwnProperty.call(i, r)) return !1;
    i = i[r];
  }
  return !0;
}
c($r, "hasOwnPath");
function Ng() {
  const t = /* @__PURE__ */ c((i, r = null) => {
    i && bh(i, r);
  }, "invalidateTileScene"), n = /* @__PURE__ */ c((i, r = null) => {
    i && xh(i, r);
  }, "invalidatePlaceableScene");
  Hooks.on("createTile", (i) => {
    t((i == null ? void 0 : i.parent) ?? null, i ?? null);
  }), Hooks.on("deleteTile", (i) => {
    t((i == null ? void 0 : i.parent) ?? null, i ?? null);
  }), Hooks.on("updateTile", (i, r) => {
    ($r(r, `flags.${de}.tileCriteria`) || $r(r, `flags.${de}.fileIndex`)) && t((i == null ? void 0 : i.parent) ?? null, i ?? null);
  });
  const e = /* @__PURE__ */ c((i) => {
    Hooks.on(`create${i}`, (r) => {
      n((r == null ? void 0 : r.parent) ?? null, r ?? null);
    }), Hooks.on(`delete${i}`, (r) => {
      n((r == null ? void 0 : r.parent) ?? null, r ?? null);
    }), Hooks.on(`update${i}`, (r, a) => {
      const o = $r(a, `flags.${de}.presets`), s = i === "AmbientLight" && $r(a, `flags.${de}.lightCriteria`);
      !o && !s || n((r == null ? void 0 : r.parent) ?? null, r ?? null);
    });
  }, "registerPlaceableHooks");
  e("AmbientLight"), e("Wall"), e("AmbientSound"), Hooks.on("canvasReady", (i) => {
    const r = (i == null ? void 0 : i.scene) ?? null;
    r && (t(r), n(r));
  });
}
c(Ng, "registerCriteriaCacheInvalidationHooks");
function kg() {
  Mg(), Lg(), Ng(), Hooks.once("init", () => {
    var t, n;
    (n = (t = game.keybindings) == null ? void 0 : t.register) == null || n.call(t, de, "toggleCriteriaSwitcher", {
      name: "Toggle Criteria Switcher",
      hint: "Open or close the criteria switcher window for live scene state updates.",
      editable: [{ key: "KeyM", modifiers: ["Alt"] }],
      onDown: /* @__PURE__ */ c(() => {
        var e, i, r;
        return lo(((e = game.scenes) == null ? void 0 : e.viewed) ?? null) ? (El(), !0) : ((r = (i = ui.notifications) == null ? void 0 : i.warn) == null || r.call(i, "You do not have permission to manage scene criteria."), !0);
      }, "onDown"),
      restricted: !0,
      precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL
    });
  }), Hooks.on("canvasReady", (t) => {
    var e;
    const n = fo();
    n && (n.setScene((t == null ? void 0 : t.scene) ?? ((e = game.scenes) == null ? void 0 : e.viewed) ?? null), n.render({ force: !0 }));
  }), Hooks.once("ready", () => {
    var n, e;
    const t = (e = (n = game.modules) == null ? void 0 : n.get) == null ? void 0 : e.call(n, de);
    t && (t.api || (t.api = {}), t.api.criteria = Vh, console.log(`${de} | Criteria engine API registered`));
  });
}
c(kg, "registerCriteriaEngineHooks");
kg();
const Gr = /* @__PURE__ */ new WeakMap(), Fr = /* @__PURE__ */ new WeakMap(), Oe = "__eidolon_default__";
function xg() {
  Hooks.on("renderAmbientLightConfig", $g), D("LightCriteria | AmbientLightConfig controls registered");
}
c(xg, "registerAmbientLightCriteriaControls");
function $g(t, n) {
  var e;
  Ai("LightCriteria | renderAmbientLightConfig", {
    appId: (t == null ? void 0 : t.id) ?? null,
    constructor: ((e = t == null ? void 0 : t.constructor) == null ? void 0 : e.name) ?? null,
    isRendered: (t == null ? void 0 : t.rendered) ?? !1
  });
  try {
    const i = Xt(n);
    if (!i) return;
    if (!oo()) {
      i.querySelectorAll(".eidolon-light-criteria, .eidolon-light-criteria-main-switcher").forEach((r) => r.remove());
      return;
    }
    Fg(t, i);
  } catch (i) {
    console.error("eidolon-utilities | Failed to enhance AmbientLightConfig UI", i);
  } finally {
    vn();
  }
}
c($g, "handleAmbientLightConfigRender");
function Fg(t, n) {
  var me, Ve, Nn, Lr, Fl;
  const e = (t == null ? void 0 : t.form) instanceof HTMLFormElement ? t.form : n instanceof HTMLFormElement ? n : (me = n == null ? void 0 : n.closest) == null ? void 0 : me.call(n, "form");
  if (!(e instanceof HTMLFormElement)) return;
  const i = e.querySelector(".window-content");
  if (!(i instanceof HTMLElement)) return;
  const r = Qu(t);
  if (!r) return;
  const a = nm(r);
  D("LightCriteria | Resolved ambient light", {
    sheetId: (r == null ? void 0 : r.id) ?? null,
    persistedId: (a == null ? void 0 : a.id) ?? null,
    sameRef: r === a
  });
  const o = (a == null ? void 0 : a.parent) ?? r.parent ?? null, s = o ? Hf(o) : [], l = s.filter(
    (P) => Array.isArray(P == null ? void 0 : P.values) && P.values.length > 0
  ), u = Gg(s), f = s.map((P) => typeof (P == null ? void 0 : P.id) == "string" ? P.id : null).filter((P) => !!P), g = a ?? r, m = o ? bt(o) : [];
  let y = Au(g);
  const b = Ch(y, m);
  JSON.stringify(b) !== JSON.stringify(y) && (y = b, Mu(g, b).catch((P) => {
    console.warn("eidolon-utilities | Failed to persist migrated light criteria keys", P);
  })), D("LightCriteria | Loaded mapping state", {
    hasBase: !!(y != null && y.base),
    mappingCount: Array.isArray(y == null ? void 0 : y.mappings) ? y.mappings.length : 0,
    mappings: Array.isArray(y == null ? void 0 : y.mappings) ? y.mappings.map((P) => {
      var J, re;
      return {
        id: P.id,
        key: P.key,
        hasColor: !!((re = (J = P.config) == null ? void 0 : J.config) != null && re.color)
      };
    }) : []
  });
  const p = i.querySelector(".eidolon-light-criteria");
  p && p.remove(), i.querySelectorAll(".eidolon-light-criteria-main-switcher").forEach((P) => P.remove());
  const E = document.createElement("fieldset");
  E.classList.add("eidolon-light-criteria");
  const T = document.createElement("legend");
  T.textContent = v("EIDOLON.LightCriteria.Legend", "Scene Criteria Lighting"), E.appendChild(T);
  const I = document.createElement("p");
  I.classList.add("notes"), I.textContent = v(
    "EIDOLON.LightCriteria.Description",
    "Capture a base lighting state, then map criteria values to lighting configurations."
  ), E.appendChild(I);
  const M = document.createElement("div");
  M.classList.add("eidolon-light-criteria__controls");
  const $ = document.createElement("button");
  $.type = "button", $.dataset.action = "make-default", $.classList.add("eidolon-light-criteria__button"), $.textContent = v(
    "EIDOLON.LightCriteria.SetBase",
    "Set Base"
  ), M.appendChild($);
  const k = document.createElement("button");
  k.type = "button", k.dataset.action = "create-mapping", k.classList.add("eidolon-light-criteria__button"), k.textContent = v(
    "EIDOLON.LightCriteria.CreateMapping",
    "Add Criteria Mapping"
  ), k.setAttribute("aria-expanded", "false"), M.appendChild(k), E.appendChild(M);
  const _ = document.createElement("p");
  _.classList.add("notes", "eidolon-light-criteria__status"), E.appendChild(_);
  const H = document.createElement("div");
  H.classList.add("eidolon-light-criteria__switcher");
  const G = document.createElement("label");
  G.classList.add("eidolon-light-criteria__switcher-label");
  const ie = `${(t == null ? void 0 : t.id) ?? (r == null ? void 0 : r.id) ?? "eidolon-light"}-mapping-select`;
  G.htmlFor = ie, G.textContent = v("EIDOLON.LightCriteria.SelectLabel", "Criteria Mapping"), H.appendChild(G);
  const U = document.createElement("details");
  U.classList.add("eidolon-light-criteria__filter-details");
  const ee = document.createElement("summary");
  ee.classList.add("eidolon-light-criteria__filter-summary");
  const R = document.createElement("span");
  R.classList.add("eidolon-light-criteria__filter-summary-label"), R.textContent = v(
    "EIDOLON.LightCriteria.FilterHeading",
    "Filter mappings"
  ), ee.appendChild(R);
  const K = document.createElement("span");
  K.classList.add("eidolon-light-criteria__filter-meta"), ee.appendChild(K), U.appendChild(ee);
  const Q = document.createElement("div");
  Q.classList.add("eidolon-light-criteria__filter-panel");
  const Z = document.createElement("div");
  Z.classList.add("eidolon-light-criteria__filter-grid");
  for (const P of l) {
    const J = document.createElement("label");
    J.classList.add("eidolon-light-criteria__filter");
    const re = document.createElement("span");
    re.classList.add("eidolon-light-criteria__filter-name"), re.textContent = (Nn = (Ve = P.name) == null ? void 0 : Ve.trim) != null && Nn.call(Ve) ? P.name.trim() : v("EIDOLON.LightCriteria.UnnamedCategory", "Unnamed Category"), J.appendChild(re);
    const se = document.createElement("select");
    se.dataset.filterCategoryId = P.id, se.classList.add("eidolon-light-criteria__filter-select");
    const ue = document.createElement("option");
    ue.value = "", ue.textContent = v("EIDOLON.LightCriteria.FilterAny", "Any"), se.appendChild(ue);
    for (const be of P.values) {
      const we = document.createElement("option");
      we.value = be, we.textContent = be, se.appendChild(we);
    }
    J.appendChild(se), Z.appendChild(J);
  }
  Q.appendChild(Z);
  const z = document.createElement("div");
  z.classList.add("eidolon-light-criteria__filter-actions");
  const X = document.createElement("button");
  X.type = "button", X.dataset.action = "clear-mapping-filters", X.classList.add("eidolon-light-criteria__button", "secondary", "compact"), X.textContent = v("EIDOLON.LightCriteria.ClearFilters", "Clear Filters"), z.appendChild(X), Q.appendChild(z), U.appendChild(Q), U.hidden = l.length === 0, H.appendChild(U);
  const le = document.createElement("div");
  le.classList.add("eidolon-light-criteria__switcher-controls"), H.appendChild(le);
  const he = document.createElement("select");
  he.id = ie, he.classList.add("eidolon-light-criteria__select"), he.dataset.action = "select-mapping", le.appendChild(he);
  const ae = document.createElement("button");
  ae.type = "button", ae.dataset.action = "apply-selected-mapping", ae.classList.add("eidolon-light-criteria__button", "secondary"), ae.textContent = v("EIDOLON.LightCriteria.ApplyButton", "Apply"), le.appendChild(ae);
  const ce = document.createElement("details");
  ce.classList.add("eidolon-light-criteria__menu"), ce.dataset.action = "mapping-actions-menu";
  const Nt = document.createElement("summary");
  Nt.classList.add("eidolon-light-criteria__menu-toggle"), Nt.innerHTML = '<i class="fa-solid fa-ellipsis-vertical" inert=""></i>', Nt.setAttribute(
    "aria-label",
    v("EIDOLON.LightCriteria.MoreActions", "More actions")
  ), Nt.dataset.tooltip = v("EIDOLON.LightCriteria.MoreActions", "More actions"), ce.appendChild(Nt);
  const Ue = document.createElement("div");
  Ue.classList.add("eidolon-light-criteria__menu-list"), ce.appendChild(Ue);
  const Fe = document.createElement("button");
  Fe.type = "button", Fe.dataset.action = "update-selected-mapping", Fe.classList.add("eidolon-light-criteria__menu-item"), Fe.textContent = v(
    "EIDOLON.LightCriteria.UpdateSelected",
    "Save current config to selected"
  ), Ue.appendChild(Fe);
  const He = document.createElement("button");
  He.type = "button", He.dataset.action = "edit-selected-mapping-criteria", He.classList.add("eidolon-light-criteria__menu-item"), He.textContent = v(
    "EIDOLON.LightCriteria.EditSelectedCriteria",
    "Edit selected mapping criteria"
  ), Ue.appendChild(He);
  const qe = document.createElement("button");
  qe.type = "button", qe.dataset.action = "remove-selected-mapping", qe.classList.add("eidolon-light-criteria__menu-item", "danger"), qe.textContent = v(
    "EIDOLON.LightCriteria.RemoveSelected",
    "Delete selected mapping"
  ), Ue.appendChild(qe), le.appendChild(ce);
  const lt = document.createElement("div");
  lt.classList.add("eidolon-light-criteria-main-switcher"), lt.appendChild(H);
  const _e = document.createElement("p");
  if (_e.classList.add("notes", "eidolon-light-criteria-main-switcher__empty"), _e.textContent = v(
    "EIDOLON.LightCriteria.ActiveRequiresBase",
    "Set Base Lighting to enable mapping selection and actions."
  ), lt.appendChild(_e), s.length === 0) {
    const P = document.createElement("p");
    P.classList.add("notification", "warning", "eidolon-light-criteria__warning"), P.textContent = v(
      "EIDOLON.LightCriteria.NoCategoriesWarning",
      "This scene has no criteria configured. Add criteria under Scene -> Criteria to enable criteria-driven lighting."
    ), E.appendChild(P);
  } else if (l.length === 0) {
    const P = document.createElement("p");
    P.classList.add("notification", "warning", "eidolon-light-criteria__warning"), P.textContent = v(
      "EIDOLON.LightCriteria.NoValuesWarning",
      "Criteria exist, but none define selectable values. Add values in Scene -> Criteria."
    ), E.appendChild(P);
  }
  const Ae = document.createElement("div");
  Ae.classList.add("eidolon-light-criteria__creation"), Ae.dataset.section = "creation", Ae.hidden = !0;
  const jt = document.createElement("p");
  jt.classList.add("notes"), jt.textContent = v(
    "EIDOLON.LightCriteria.CreateDescription",
    "Assign scene criteria values to map the current configuration."
  ), Ae.appendChild(jt);
  const ct = document.createElement("div");
  ct.classList.add("eidolon-light-criteria__category-list"), Ae.appendChild(ct);
  for (const P of l) {
    const J = document.createElement("label");
    J.classList.add("eidolon-light-criteria__category");
    const re = document.createElement("span");
    re.classList.add("eidolon-light-criteria__category-name"), re.textContent = (Fl = (Lr = P.name) == null ? void 0 : Lr.trim) != null && Fl.call(Lr) ? P.name.trim() : v("EIDOLON.LightCriteria.UnnamedCategory", "Unnamed Category"), J.appendChild(re);
    const se = document.createElement("select");
    se.dataset.categoryId = P.id, se.classList.add("eidolon-light-criteria__category-select");
    const ue = document.createElement("option");
    ue.value = "", ue.textContent = v(
      "EIDOLON.LightCriteria.IgnoreCategory",
      "Ignore"
    ), se.appendChild(ue);
    for (const be of P.values) {
      const we = document.createElement("option");
      we.value = be, we.textContent = be, se.appendChild(we);
    }
    J.appendChild(se), ct.appendChild(J);
  }
  const kt = document.createElement("div");
  kt.classList.add("eidolon-light-criteria__creation-actions");
  const O = document.createElement("button");
  O.type = "button", O.dataset.action = "save-mapping", O.classList.add("eidolon-light-criteria__button", "primary"), O.textContent = v(
    "EIDOLON.LightCriteria.SaveMapping",
    "Save Mapping"
  ), kt.appendChild(O);
  const S = document.createElement("button");
  S.type = "button", S.dataset.action = "cancel-create", S.classList.add("eidolon-light-criteria__button", "secondary"), S.textContent = v(
    "EIDOLON.LightCriteria.Cancel",
    "Cancel"
  ), kt.appendChild(S), Ae.appendChild(kt), E.appendChild(Ae), i.prepend(lt), i.appendChild(E), E.hidden = !0, Pg(t, {
    fieldset: E,
    homeContainer: i
  }), requestAnimationFrame(() => {
    var P;
    (P = t.setPosition) == null || P.call(t, { height: "auto" });
  });
  let w = y;
  $n({ switcher: H, emptyState: _e, state: w }), xn(_, w), Ri(k, {
    state: w,
    hasCategories: l.length > 0
  }), D("LightCriteria | Controls injected", {
    sceneId: (o == null ? void 0 : o.id) ?? null,
    lightId: (r == null ? void 0 : r.id) ?? null,
    hasBase: !!(w != null && w.base),
    mappingCount: Array.isArray(w == null ? void 0 : w.mappings) ? w.mappings.length : 0,
    categories: l.length
  });
  const N = Xg(w), F = {
    restoreConfig: null,
    app: t,
    selectedMapping: N,
    editorMode: "create",
    editingMappingId: null,
    mappingFilters: {}
  };
  Gr.set(E, F);
  const te = /* @__PURE__ */ c(() => {
    ce.open = !1;
  }, "closeActionsMenu");
  Nt.addEventListener("click", (P) => {
    ce.classList.contains("is-disabled") && (P.preventDefault(), te());
  });
  const j = /* @__PURE__ */ c((P = F.selectedMapping) => {
    const J = Wg(Z), re = Array.isArray(w == null ? void 0 : w.mappings) ? w.mappings : [], se = Kg(re, J), ue = Object.keys(J).length;
    F.mappingFilters = J, X.disabled = ue === 0, Yg(K, {
      totalCount: re.length,
      visibleCount: se.length,
      hasFilters: ue > 0,
      activeFilterCount: ue
    }), U.classList.toggle("has-active-filters", ue > 0), Qg(he, w, u, P, {
      mappings: se,
      categoryOrder: f
    }), F.selectedMapping = he.value ?? "", Fo({
      mappingSelect: he,
      applyMappingButton: ae,
      updateMappingButton: Fe,
      editCriteriaButton: He,
      removeMappingButton: qe,
      actionsMenu: ce,
      state: w
    }), ce.classList.contains("is-disabled") && te();
  }, "refreshMappingSelector");
  Z.querySelectorAll("select[data-filter-category-id]").forEach((P) => {
    P.addEventListener("change", () => {
      const J = F.selectedMapping;
      j(J), F.selectedMapping !== J && Do(
        a ?? r,
        w,
        F.selectedMapping
      ).then((re) => {
        re && (w = re);
      });
    });
  }), X.addEventListener("click", () => {
    Jg(Z);
    const P = F.selectedMapping;
    j(P), U.open = !1, F.selectedMapping !== P && Do(
      a ?? r,
      w,
      F.selectedMapping
    ).then((J) => {
      J && (w = J);
    });
  }), he.addEventListener("change", () => {
    F.selectedMapping = he.value ?? "", Fo({
      mappingSelect: he,
      applyMappingButton: ae,
      updateMappingButton: Fe,
      editCriteriaButton: He,
      removeMappingButton: qe,
      actionsMenu: ce,
      state: w
    }), Do(
      a ?? r,
      w,
      F.selectedMapping
    ).then((P) => {
      P && (w = P);
    });
  });
  const ge = /* @__PURE__ */ c(async () => {
    var se, ue, be, we, ut, en, dt, tn, Se, nn, rn, xt, kn, Di;
    const P = he.value ?? "";
    if (!P) {
      (ue = (se = ui.notifications) == null ? void 0 : se.warn) == null || ue.call(
        se,
        v(
          "EIDOLON.LightCriteria.SelectMappingWarning",
          "Choose a criteria mapping before applying."
        )
      ), j(F.selectedMapping);
      return;
    }
    if (P === Oe) {
      if (!(w != null && w.base)) {
        (we = (be = ui.notifications) == null ? void 0 : be.warn) == null || we.call(
          be,
          v(
            "EIDOLON.LightCriteria.BaseUnavailable",
            "Set a base lighting state before applying it."
          )
        );
        return;
      }
      Dr(E, Ae, k), Jr(t, e, w.base), w = await Gi(a ?? r, {
        mappingId: Oe,
        categories: null,
        updatedAt: Date.now()
      }), F.selectedMapping = Oe, j(F.selectedMapping), xn(_, w), $n({ switcher: H, emptyState: _e, state: w }), Ri(k, {
        state: w,
        hasCategories: l.length > 0
      }), cc(e, {
        mappingId: Oe,
        color: ((en = (ut = w.base) == null ? void 0 : ut.config) == null ? void 0 : en.color) ?? null
      }), (tn = (dt = ui.notifications) == null ? void 0 : dt.info) == null || tn.call(
        dt,
        v(
          "EIDOLON.LightCriteria.BaseApplied",
          "Applied the base lighting state to the form."
        )
      ), te();
      return;
    }
    const J = Array.isArray(w == null ? void 0 : w.mappings) && w.mappings.length ? w.mappings.find((ai) => (ai == null ? void 0 : ai.id) === P) : null;
    if (!J) {
      (nn = (Se = ui.notifications) == null ? void 0 : Se.warn) == null || nn.call(
        Se,
        v(
          "EIDOLON.LightCriteria.MappingUnavailable",
          "The selected criteria mapping is no longer available."
        )
      ), F.selectedMapping = "", j(F.selectedMapping);
      return;
    }
    Dr(E, Ae, k), Jr(t, e, J.config), w = await Gi(a ?? r, {
      mappingId: J.id,
      categories: J.categories,
      updatedAt: Date.now()
    }), F.selectedMapping = J.id, j(F.selectedMapping), xn(_, w), $n({ switcher: H, emptyState: _e, state: w }), Ri(k, {
      state: w,
      hasCategories: l.length > 0
    }), cc(e, {
      mappingId: J.id,
      color: ((xt = (rn = J.config) == null ? void 0 : rn.config) == null ? void 0 : xt.color) ?? null
    });
    const re = wi(J, u, f);
    (Di = (kn = ui.notifications) == null ? void 0 : kn.info) == null || Di.call(
      kn,
      v(
        "EIDOLON.LightCriteria.MappingApplied",
        "Applied mapping: {label}"
      ).replace("{label}", re)
    ), te();
  }, "applySelectedMapping");
  ae.addEventListener("click", () => {
    ge();
  }), he.addEventListener("keydown", (P) => {
    P.key === "Enter" && (P.preventDefault(), ge());
  });
  const pe = /* @__PURE__ */ c(async () => {
    var J, re, se, ue, be, we, ut, en, dt, tn, Se, nn, rn, xt, kn, Di, ai, Ir, Dl, Or, _l;
    const P = F.selectedMapping;
    if (!P) {
      (re = (J = ui.notifications) == null ? void 0 : J.warn) == null || re.call(
        J,
        v(
          "EIDOLON.LightCriteria.SelectMappingWarning",
          "Choose a criteria mapping before applying."
        )
      );
      return;
    }
    Fe.disabled = !0;
    try {
      const tt = Wr(t, a);
      if (P === Oe)
        w = await ec(a ?? r, tt), D("LightCriteria | Base lighting updated", {
          lightId: ((se = a ?? r) == null ? void 0 : se.id) ?? null,
          configColor: ((ue = tt == null ? void 0 : tt.config) == null ? void 0 : ue.color) ?? null
        }), (we = (be = ui.notifications) == null ? void 0 : be.info) == null || we.call(
          be,
          v(
            "EIDOLON.LightCriteria.BaseUpdated",
            "Updated the base lighting state with the current configuration."
          )
        ), F.selectedMapping = Oe;
      else {
        const oi = Wi(w, P);
        if (!oi) {
          (en = (ut = ui.notifications) == null ? void 0 : ut.warn) == null || en.call(
            ut,
            v(
              "EIDOLON.LightCriteria.MappingUnavailable",
              "The selected criteria mapping is no longer available."
            )
          ), F.selectedMapping = "", j(F.selectedMapping);
          return;
        }
        w = await tc(
          a ?? r,
          oi.categories,
          tt,
          { label: oi.label ?? null }
        ), D("LightCriteria | Mapping updated", {
          mappingId: P,
          hasColor: !!((dt = tt == null ? void 0 : tt.config) != null && dt.color),
          stored: Array.isArray(w == null ? void 0 : w.mappings) ? ((tn = w.mappings.find((vo) => (vo == null ? void 0 : vo.id) === P)) == null ? void 0 : tn.config) ?? null : null,
          persisted: (nn = (Se = a ?? r) == null ? void 0 : Se.getFlag) == null ? void 0 : nn.call(Se, Zn, bi)
        });
        const _i = Wi(w, P), Yd = wi(_i || oi, u, f);
        D("LightCriteria | Mapping updated", {
          mappingId: P,
          categories: oi.categories,
          updatedColor: ((rn = tt == null ? void 0 : tt.config) == null ? void 0 : rn.color) ?? null,
          storedColor: ((kn = (xt = _i == null ? void 0 : _i.config) == null ? void 0 : xt.config) == null ? void 0 : kn.color) ?? ((ai = (Di = oi.config) == null ? void 0 : Di.config) == null ? void 0 : ai.color) ?? null
        }), (Dl = (Ir = ui.notifications) == null ? void 0 : Ir.info) == null || Dl.call(
          Ir,
          v(
            "EIDOLON.LightCriteria.MappingUpdated",
            "Saved changes to mapping: {label}"
          ).replace("{label}", Yd)
        ), F.selectedMapping = P;
      }
      xn(_, w), $n({ switcher: H, emptyState: _e, state: w }), Ri(k, {
        state: w,
        hasCategories: l.length > 0
      }), j(F.selectedMapping), te();
    } catch (tt) {
      console.error("eidolon-utilities | Failed to update light criteria mapping", tt), (_l = (Or = ui.notifications) == null ? void 0 : Or.error) == null || _l.call(
        Or,
        v(
          "EIDOLON.LightCriteria.MappingUpdateError",
          "Failed to save the mapping. Check the console for details."
        )
      );
    } finally {
      Fe.disabled = !1, Fo({
        mappingSelect: he,
        applyMappingButton: ae,
        updateMappingButton: Fe,
        editCriteriaButton: He,
        removeMappingButton: qe,
        actionsMenu: ce,
        state: w
      });
    }
  }, "updateSelectedMapping");
  Fe.addEventListener("click", () => {
    pe();
  }), j(F.selectedMapping), $.addEventListener("click", async () => {
    var P, J, re, se, ue, be;
    $.disabled = !0;
    try {
      const we = Wr(t, a);
      w = await ec(a ?? r, we), D("LightCriteria | Base lighting stored", {
        lightId: ((P = a ?? r) == null ? void 0 : P.id) ?? null,
        configColor: ((J = we == null ? void 0 : we.config) == null ? void 0 : J.color) ?? null
      }), (se = (re = ui.notifications) == null ? void 0 : re.info) == null || se.call(
        re,
        v(
          "EIDOLON.LightCriteria.BaseStored",
          "Saved the current configuration as the base lighting state."
        )
      ), xn(_, w), $n({ switcher: H, emptyState: _e, state: w }), Ri(k, {
        state: w,
        hasCategories: l.length > 0
      }), F.selectedMapping = Oe, j(F.selectedMapping);
    } catch (we) {
      console.error("eidolon-utilities | Failed to store base light criteria state", we), (be = (ue = ui.notifications) == null ? void 0 : ue.error) == null || be.call(
        ue,
        v(
          "EIDOLON.LightCriteria.BaseError",
          "Failed to save the base lighting state. Check the console for details."
        )
      );
    } finally {
      $.disabled = !1;
    }
  }), k.addEventListener("click", () => {
    var J, re, se, ue;
    if (!(w != null && w.base)) {
      (re = (J = ui.notifications) == null ? void 0 : J.warn) == null || re.call(
        J,
        v(
          "EIDOLON.LightCriteria.RequiresBase",
          "Set a base lighting state before adding criteria mappings."
        )
      );
      return;
    }
    if (l.length === 0) {
      (ue = (se = ui.notifications) == null ? void 0 : se.warn) == null || ue.call(
        se,
        v(
          "EIDOLON.LightCriteria.NoCategoriesAvailable",
          "Add scene criteria with values in the Scene configuration before creating mappings."
        )
      );
      return;
    }
    const P = Gr.get(E);
    lc({
      app: t,
      fieldset: E,
      createButton: k,
      creationSection: Ae,
      categoryList: ct,
      form: e,
      persistedLight: a,
      stateEntry: P,
      mode: "create",
      mapping: null,
      preloadConfig: w.base
    });
  }), He.addEventListener("click", () => {
    var re, se, ue, be;
    const P = F.selectedMapping;
    if (!P || P === Oe) {
      (se = (re = ui.notifications) == null ? void 0 : re.warn) == null || se.call(
        re,
        v(
          "EIDOLON.LightCriteria.SelectMappingForCriteriaEdit",
          "Select a mapping before editing criteria."
        )
      );
      return;
    }
    const J = Wi(w, P);
    if (!J) {
      (be = (ue = ui.notifications) == null ? void 0 : ue.warn) == null || be.call(
        ue,
        v(
          "EIDOLON.LightCriteria.MappingUnavailable",
          "The selected criteria mapping is no longer available."
        )
      );
      return;
    }
    te(), Yu(t, { fieldset: E, homeContainer: i }), lc({
      app: t,
      fieldset: E,
      createButton: k,
      creationSection: Ae,
      categoryList: ct,
      form: e,
      persistedLight: a,
      stateEntry: F,
      mode: "retarget",
      mapping: J,
      preloadConfig: J.config
    });
  }), O.addEventListener("click", async () => {
    var J, re, se, ue, be, we, ut, en, dt, tn;
    const P = tm(ct);
    if (!P) {
      (re = (J = ui.notifications) == null ? void 0 : J.warn) == null || re.call(
        J,
        v(
          "EIDOLON.LightCriteria.SelectionRequired",
          "Select at least one criteria value to identify the mapping."
        )
      );
      return;
    }
    O.disabled = !0;
    try {
      const Se = Wr(t, a);
      if (F.editorMode === "retarget" && F.editingMappingId) {
        const rn = ks(w, P);
        let xt = !1;
        if (rn && rn !== F.editingMappingId && (xt = await Dg(), !xt)) {
          O.disabled = !1;
          return;
        }
        w = await vh(
          a ?? r,
          F.editingMappingId,
          P,
          Se,
          { replaceExisting: xt }
        ), D("LightCriteria | Mapping criteria retargeted", {
          mappingId: F.editingMappingId,
          categories: P,
          replaced: xt,
          configColor: ((se = Se == null ? void 0 : Se.config) == null ? void 0 : se.color) ?? null
        }), (be = (ue = ui.notifications) == null ? void 0 : ue.info) == null || be.call(
          ue,
          v(
            "EIDOLON.LightCriteria.MappingCriteriaUpdated",
            "Updated mapping criteria for the selected mapping."
          )
        );
      } else
        w = await tc(
          a ?? r,
          P,
          Se,
          {}
        ), D("LightCriteria | Mapping saved from editor", {
          categories: P,
          configColor: ((we = Se == null ? void 0 : Se.config) == null ? void 0 : we.color) ?? null
        }), (en = (ut = ui.notifications) == null ? void 0 : ut.info) == null || en.call(
          ut,
          v(
            "EIDOLON.LightCriteria.MappingSaved",
            "Updated lighting mapping for the selected scene criteria."
          )
        );
      xn(_, w), $n({ switcher: H, emptyState: _e, state: w });
      const nn = ks(w, P);
      nn && (F.selectedMapping = nn), j(F.selectedMapping), Dr(E, Ae, k), te();
    } catch (Se) {
      console.error("eidolon-utilities | Failed to persist light criteria mapping", Se), (tn = (dt = ui.notifications) == null ? void 0 : dt.error) == null || tn.call(
        dt,
        v(
          "EIDOLON.LightCriteria.MappingError",
          "Failed to save the mapping. Check the console for details."
        )
      );
    } finally {
      O.disabled = !1;
    }
  }), S.addEventListener("click", () => {
    const P = Gr.get(E);
    P != null && P.restoreConfig && Jr(t, e, P.restoreConfig), Dr(E, Ae, k);
  }), qe.addEventListener("click", async () => {
    var re, se;
    const P = F.selectedMapping;
    !P || P === Oe || !await _g() || (w = await Eh(a ?? r, P), F.selectedMapping = "", xn(_, w), $n({ switcher: H, emptyState: _e, state: w }), j(F.selectedMapping), te(), (se = (re = ui.notifications) == null ? void 0 : re.info) == null || se.call(
      re,
      v("EIDOLON.LightCriteria.MappingRemoved", "Removed selected mapping.")
    ));
  });
}
c(Fg, "enhanceAmbientLightConfig");
function lc({
  app: t,
  fieldset: n,
  createButton: e,
  creationSection: i,
  categoryList: r,
  form: a,
  persistedLight: o,
  stateEntry: s,
  mode: l,
  mapping: u,
  preloadConfig: f
}) {
  s && (s.restoreConfig = Wr(t, o), s.editorMode = l, s.editingMappingId = l === "retarget" ? (u == null ? void 0 : u.id) ?? null : null), f && Jr(t, a, f), l === "retarget" && (u != null && u.categories) ? em(r, u.categories) : Zg(r);
  const g = i.querySelector("p.notes");
  g instanceof HTMLElement && (g.textContent = l === "retarget" ? v(
    "EIDOLON.LightCriteria.EditCriteriaDescription",
    "Adjust criteria values for the selected mapping."
  ) : v(
    "EIDOLON.LightCriteria.CreateDescription",
    "Assign scene criteria values to map the current configuration."
  ));
  const m = i.querySelector('button[data-action="save-mapping"]');
  m instanceof HTMLButtonElement && (m.textContent = l === "retarget" ? v("EIDOLON.LightCriteria.SaveCriteriaChanges", "Save Criteria Changes") : v("EIDOLON.LightCriteria.SaveMapping", "Save Mapping")), i.hidden = !1, e.setAttribute("aria-expanded", "true"), Tl(n, i), requestAnimationFrame(() => {
    var y;
    (y = t.setPosition) == null || y.call(t, { height: "auto" });
  });
}
c(lc, "openMappingEditor");
async function Dg() {
  var e, i;
  const t = (i = (e = foundry == null ? void 0 : foundry.applications) == null ? void 0 : e.api) == null ? void 0 : i.DialogV2;
  if (typeof (t == null ? void 0 : t.confirm) == "function")
    return t.confirm({
      window: { title: v("EIDOLON.LightCriteria.ConflictTitle", "Replace Existing Mapping?") },
      content: `<p>${v(
        "EIDOLON.LightCriteria.ConflictBody",
        "A mapping already exists for this criteria combination. Replace it with the edited mapping?"
      )}</p>`,
      rejectClose: !1
    });
  const n = globalThis.Dialog;
  return typeof (n == null ? void 0 : n.confirm) != "function" ? !1 : n.confirm({
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
c(Dg, "confirmCriteriaConflict");
async function _g() {
  var e, i;
  const t = (i = (e = foundry == null ? void 0 : foundry.applications) == null ? void 0 : e.api) == null ? void 0 : i.DialogV2;
  if (typeof (t == null ? void 0 : t.confirm) == "function")
    return t.confirm({
      window: { title: v("EIDOLON.LightCriteria.RemoveTitle", "Remove Mapping?") },
      content: `<p>${v(
        "EIDOLON.LightCriteria.RemoveBody",
        "Remove the currently selected mapping? This cannot be undone."
      )}</p>`,
      rejectClose: !1
    });
  const n = globalThis.Dialog;
  return typeof (n == null ? void 0 : n.confirm) != "function" ? !1 : n.confirm({
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
c(_g, "confirmRemoveMapping");
function Pg(t, { fieldset: n, homeContainer: e }) {
  const i = qg(t, e);
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
    o.preventDefault(), Yu(t, { fieldset: n, homeContainer: e });
  };
}
c(Pg, "ensureManagerHeaderButton");
function Yu(t, { fieldset: n, homeContainer: e }) {
  var m, y, b;
  const i = Fr.get(t);
  if (i != null && i.rendered) {
    (m = i.bringToTop) == null || m.call(i);
    return;
  }
  const r = /* @__PURE__ */ c((...p) => {
    var I;
    const E = Rg(p), T = (I = E == null ? void 0 : E.querySelector) == null ? void 0 : I.call(E, ".eidolon-light-criteria-manager-host");
    T instanceof HTMLElement && (Hg(n), n.hidden = !1, T.appendChild(n));
  }, "onRender"), a = /* @__PURE__ */ c(() => {
    e instanceof HTMLElement && e.appendChild(n), n.hidden = !0, Fr.delete(t), requestAnimationFrame(() => {
      var p;
      (p = t.setPosition) == null || p.call(t, { height: "auto" });
    });
  }, "onClose"), o = v("EIDOLON.LightCriteria.ManagerTitle", "Scene Criteria Lighting"), s = '<div class="eidolon-light-criteria-manager-host"></div>', l = v("EIDOLON.LightCriteria.Close", "Close"), u = (b = (y = foundry == null ? void 0 : foundry.applications) == null ? void 0 : y.api) == null ? void 0 : b.DialogV2;
  if (typeof (u == null ? void 0 : u.wait) == "function")
    try {
      let p = !1;
      const E = /* @__PURE__ */ c(() => {
        p || (p = !0, a());
      }, "closeOnce");
      Fr.set(t, {
        rendered: !0,
        bringToTop: /* @__PURE__ */ c(() => {
        }, "bringToTop")
      }), u.wait({
        window: { title: o },
        content: s,
        buttons: [{ action: "close", label: l, default: !0 }],
        render: /* @__PURE__ */ c((...T) => r(...T), "render"),
        close: E,
        rejectClose: !1
      }).catch((T) => {
        console.warn("eidolon-utilities | DialogV2 manager failed, falling back to Dialog", T), E();
      });
      return;
    } catch (p) {
      console.warn("eidolon-utilities | DialogV2 manager failed, falling back to Dialog", p), a();
    }
  const f = globalThis.Dialog;
  if (typeof f != "function") return;
  const g = new f(
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
  Fr.set(t, g), g.render(!0);
}
c(Yu, "openManagerDialog");
function Rg(t) {
  for (const n of t) {
    const e = Xt(n);
    if (e) return e;
    const i = Xt(n == null ? void 0 : n.element);
    if (i) return i;
  }
  return null;
}
c(Rg, "findDialogRoot");
function Hg(t) {
  if (!(t instanceof HTMLElement) || t.dataset.managerLayout === "true") return;
  t.dataset.managerLayout = "true", t.classList.add("is-manager");
  const n = t.querySelector("legend"), e = t.querySelector("p.notes:not(.eidolon-light-criteria__status)"), i = t.querySelector(".eidolon-light-criteria__controls"), r = t.querySelector(".eidolon-light-criteria__status"), a = t.querySelector(".eidolon-light-criteria__creation"), o = Array.from(t.querySelectorAll(".eidolon-light-criteria__warning")), s = document.createElement("div");
  s.classList.add("eidolon-light-criteria-manager");
  const l = document.createElement("section");
  l.classList.add("eidolon-light-criteria-manager__section", "is-top"), s.appendChild(l);
  const u = document.createElement("section");
  u.classList.add("eidolon-light-criteria-manager__section", "is-bottom"), s.appendChild(u);
  const f = document.createElement("div");
  if (f.classList.add("eidolon-light-criteria-manager__header"), f.textContent = v("EIDOLON.LightCriteria.ManagerHeader", "Base State"), l.appendChild(f), r && l.appendChild(r), i && l.appendChild(i), o.length) {
    const m = document.createElement("div");
    m.classList.add("eidolon-light-criteria-manager__warnings");
    for (const y of o) m.appendChild(y);
    l.appendChild(m);
  }
  const g = document.createElement("div");
  g.classList.add("eidolon-light-criteria-manager__header"), g.textContent = v("EIDOLON.LightCriteria.ManagerAuthoring", "Create or Update Mapping"), u.appendChild(g), a && u.appendChild(a), t.innerHTML = "", n && t.appendChild(n), e && t.appendChild(e), t.appendChild(s), Tl(t, a);
}
c(Hg, "applyManagerLayout");
function qg(t, n) {
  var i;
  const e = Xt(t == null ? void 0 : t.element);
  return e || (((i = n == null ? void 0 : n.closest) == null ? void 0 : i.call(n, ".application")) ?? null);
}
c(qg, "resolveApplicationRoot");
function Dr(t, n, e) {
  const i = Gr.get(t);
  i && (i.restoreConfig = null, i.editorMode = "create", i.editingMappingId = null), n.hidden = !0, e.setAttribute("aria-expanded", "false");
  const r = n.querySelector("p.notes");
  r instanceof HTMLElement && (r.textContent = v(
    "EIDOLON.LightCriteria.CreateDescription",
    "Assign scene criteria values to map the current configuration."
  ));
  const a = n.querySelector('button[data-action="save-mapping"]');
  a instanceof HTMLButtonElement && (a.textContent = v("EIDOLON.LightCriteria.SaveMapping", "Save Mapping")), Tl(t, n), requestAnimationFrame(() => {
    var o, s;
    (s = (o = i == null ? void 0 : i.app) == null ? void 0 : o.setPosition) == null || s.call(o, { height: "auto" });
  });
}
c(Dr, "hideCreationSection");
function xn(t, n) {
  if (!t) return;
  const e = !!(n != null && n.base), i = Array.isArray(n == null ? void 0 : n.mappings) ? n.mappings.length : 0, r = [];
  r.push(
    e ? v(
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
  ), t.textContent = r.join(" ");
}
c(xn, "updateStatusLine");
function Ri(t, { state: n, hasCategories: e }) {
  if (!t) return;
  const i = !!(n != null && n.base), r = i && e;
  t.disabled = !r, t.title = r ? "" : i ? v(
    "EIDOLON.LightCriteria.CreateDisabledNoCategories",
    "Add scene criteria with values before creating mappings."
  ) : v(
    "EIDOLON.LightCriteria.CreateDisabledNoBase",
    "Save a base lighting state before creating criteria mappings."
  );
}
c(Ri, "updateCreateButtonState");
function Wr(t, n) {
  var l, u, f;
  const e = n ?? Qu(t);
  if (!e)
    throw new Error("Ambient light document unavailable.");
  const i = ri(((l = e.toObject) == null ? void 0 : l.call(e)) ?? {});
  if (!i)
    throw new Error("Unable to duplicate ambient light data.");
  const r = (t == null ? void 0 : t.form) instanceof HTMLFormElement ? t.form : null, a = r ? Sf(r) : {}, o = foundry.utils.mergeObject(i, a, {
    inplace: !1,
    performDeletions: !0
  });
  r && (r.querySelectorAll("color-picker[name]").forEach((g) => {
    var T, I;
    const m = g.getAttribute("name");
    if (!m) return;
    const y = typeof g.value == "string" ? g.value : "", b = ((T = g.ui) == null ? void 0 : T.input) ?? ((I = g.querySelector) == null ? void 0 : I.call(g, 'input[type="color"]')), p = (b == null ? void 0 : b.value) ?? "", E = y || p;
    typeof E != "string" || !E || (foundry.utils.setProperty(o, m, E), D("LightCriteria | Captured color-picker value", {
      path: m,
      pickerValue: y,
      swatchValue: p,
      chosenValue: E
    }));
  }), r.querySelectorAll("range-picker[name]").forEach((g) => {
    var k, _;
    const m = g.getAttribute("name");
    if (!m) return;
    const y = g.value !== void 0 && g.value !== null ? String(g.value) : "", b = (k = g.querySelector) == null ? void 0 : k.call(g, 'input[type="range"]'), p = (_ = g.querySelector) == null ? void 0 : _.call(g, 'input[type="number"]'), E = b instanceof HTMLInputElement ? b.value : "", T = p instanceof HTMLInputElement ? p.value : "", I = y || T || E;
    if (typeof I != "string" || !I.length) return;
    const M = Number(I), $ = Number.isFinite(M) ? M : I;
    foundry.utils.setProperty(o, m, $), D("LightCriteria | Captured range-picker value", {
      path: m,
      elementValue: y,
      numberValue: T,
      rangeValue: E,
      chosenValue: $
    });
  }));
  const s = ri(o);
  return D("LightCriteria | Captured form config", {
    lightId: (e == null ? void 0 : e.id) ?? null,
    hasColor: !!((u = s == null ? void 0 : s.config) != null && u.color),
    color: ((f = s == null ? void 0 : s.config) == null ? void 0 : f.color) ?? null
  }), s;
}
c(Wr, "captureAmbientLightFormConfig");
function Jr(t, n, e) {
  if (!e || typeof e != "object") return;
  const i = foundry.utils.flattenObject(e, { safe: !0 });
  for (const [r, a] of Object.entries(i)) {
    const o = n.querySelectorAll(`[name="${r}"]`);
    if (o.length) {
      D("LightCriteria | Applying field", {
        path: r,
        value: a,
        elementCount: o.length
      });
      for (const s of o)
        s instanceof HTMLElement && s.tagName === "COLOR-PICKER" ? jg(s, a) : s instanceof HTMLElement && s.tagName === "RANGE-PICKER" ? Ug(s, a) : s instanceof HTMLInputElement ? Bg(s, a) : s instanceof HTMLSelectElement ? Vg(s, a) : s instanceof HTMLTextAreaElement && zg(s, a);
    }
  }
  requestAnimationFrame(() => {
    var r;
    return (r = t._previewChanges) == null ? void 0 : r.call(t);
  });
}
c(Jr, "applyConfigToForm");
function Bg(t, n, e) {
  const i = t.type;
  if (i === "checkbox") {
    const o = !!n;
    t.checked !== o && (t.checked = o, Mt(t));
    return;
  }
  if (i === "radio") {
    const o = n == null ? "" : String(n), s = t.value === o;
    t.checked !== s && (t.checked = s, s && Mt(t));
    return;
  }
  const r = n == null ? "" : String(n);
  let a = !1;
  t.value !== r && (t.value = r, a = !0), a && Mt(t);
}
c(Bg, "applyValueToInput");
function jg(t, n, e) {
  var s, l, u, f, g, m;
  const i = n == null ? "" : String(n);
  let r = !1;
  t.value !== i && (t.value = i, t.setAttribute("value", i), (s = t.ui) != null && s.setValue && t.ui.setValue(i), r = !0);
  const a = ((l = t.ui) == null ? void 0 : l.input) ?? ((u = t.querySelector) == null ? void 0 : u.call(t, 'input[type="color"]'));
  a instanceof HTMLInputElement && a.value !== i && (a.value = i, Mt(a));
  const o = ((f = t.ui) == null ? void 0 : f.text) ?? ((g = t.querySelector) == null ? void 0 : g.call(t, 'input[type="text"]'));
  o instanceof HTMLInputElement && o.value !== i && (o.value = i, Mt(o)), (m = t.ui) != null && m.commit ? t.ui.commit() : (t.dispatchEvent(new Event("input", { bubbles: !0, cancelable: !0 })), t.dispatchEvent(new Event("change", { bubbles: !0, cancelable: !0 }))), D("LightCriteria | Color picker applied", {
    value: i,
    pickerValue: t.value ?? null,
    swatchValue: (a == null ? void 0 : a.value) ?? null,
    textValue: (o == null ? void 0 : o.value) ?? null
  }), r && Mt(t);
}
c(jg, "applyValueToColorPicker");
function Ug(t, n, e) {
  var u, f;
  const i = n == null ? "" : String(n), r = Number(i), a = Number.isFinite(r) ? r : i;
  let o = !1;
  t.value !== void 0 && t.value !== a && (t.value = a, o = !0), t.getAttribute("value") !== i && (t.setAttribute("value", i), o = !0);
  const s = (u = t.querySelector) == null ? void 0 : u.call(t, 'input[type="range"]');
  s instanceof HTMLInputElement && s.value !== i && (s.value = i, Mt(s));
  const l = (f = t.querySelector) == null ? void 0 : f.call(t, 'input[type="number"]');
  if (l instanceof HTMLInputElement && l.value !== i && (l.value = i, Mt(l)), typeof t.commit == "function")
    try {
      t.commit();
    } catch (g) {
      console.error("eidolon-utilities | range-picker commit failed", g);
    }
  D("LightCriteria | Range picker applied", {
    value: i,
    resolvedValue: a,
    rangeValue: (s == null ? void 0 : s.value) ?? null,
    numberValue: (l == null ? void 0 : l.value) ?? null
  }), o && Mt(t);
}
c(Ug, "applyValueToRangePicker");
function Vg(t, n, e) {
  const i = n == null ? "" : String(n);
  t.value !== i && (t.value = i, Mt(t));
}
c(Vg, "applyValueToSelect");
function zg(t, n, e) {
  const i = n == null ? "" : String(n);
  t.value !== i && (t.value = i, Mt(t));
}
c(zg, "applyValueToTextarea");
function Mt(t) {
  t.dispatchEvent(new Event("input", { bubbles: !0, cancelable: !0 })), t.dispatchEvent(new Event("change", { bubbles: !0, cancelable: !0 }));
}
c(Mt, "triggerInputChange");
function Fo({
  mappingSelect: t,
  applyMappingButton: n,
  updateMappingButton: e,
  editCriteriaButton: i,
  removeMappingButton: r,
  actionsMenu: a,
  state: o
}) {
  const s = (t == null ? void 0 : t.value) ?? "", l = !!(o != null && o.base), u = s && s !== Oe ? !!Wi(o, s) : !1;
  if (n instanceof HTMLButtonElement && (s ? s === Oe ? n.disabled = !l : n.disabled = !u : n.disabled = !0), e instanceof HTMLButtonElement && (s ? s === Oe ? e.disabled = !1 : e.disabled = !u : e.disabled = !0), i instanceof HTMLButtonElement && (i.disabled = !s || s === Oe || !u), r instanceof HTMLButtonElement && (r.disabled = !s || s === Oe || !u), a instanceof HTMLElement) {
    const f = e instanceof HTMLButtonElement && !e.disabled || i instanceof HTMLButtonElement && !i.disabled || r instanceof HTMLButtonElement && !r.disabled;
    a.classList.toggle("is-disabled", !f), !f && "open" in a && (a.open = !1);
  }
}
c(Fo, "syncMappingSwitcherState");
function Gg(t) {
  const n = /* @__PURE__ */ new Map();
  for (const e of t) {
    if (!e) continue;
    const i = typeof e.id == "string" ? e.id : null;
    if (!i) continue;
    const r = typeof e.name == "string" && e.name.trim() ? e.name.trim() : v("EIDOLON.LightCriteria.UnnamedCategory", "Unnamed Category");
    n.has(i) || n.set(i, r);
  }
  return n;
}
c(Gg, "buildCategoryNameLookup");
function Wg(t) {
  const n = {};
  return t instanceof HTMLElement && t.querySelectorAll("select[data-filter-category-id]").forEach((e) => {
    var a, o;
    const i = e.dataset.filterCategoryId, r = (o = (a = e.value) == null ? void 0 : a.trim) == null ? void 0 : o.call(a);
    !i || !r || (n[i] = r);
  }), n;
}
c(Wg, "readMappingFilterSelections");
function Jg(t) {
  t instanceof HTMLElement && t.querySelectorAll("select[data-filter-category-id]").forEach((n) => {
    n.value = "";
  });
}
c(Jg, "resetMappingFilterSelections");
function Kg(t, n) {
  const e = Array.isArray(t) ? t : [], i = Object.entries(n ?? {}).filter(([, r]) => !!r);
  return i.length ? e.filter((r) => {
    if (!r || typeof r != "object") return !1;
    const a = r.categories ?? {};
    for (const [o, s] of i)
      if ((a == null ? void 0 : a[o]) !== s) return !1;
    return !0;
  }) : e.slice();
}
c(Kg, "filterMappingsByCriteria");
function Yg(t, { totalCount: n = 0, visibleCount: e = 0, hasFilters: i = !1, activeFilterCount: r = 0 } = {}) {
  if (!(t instanceof HTMLElement)) return;
  if (!i) {
    t.textContent = v(
      "EIDOLON.LightCriteria.FilterSummaryAll",
      "All ({count})"
    ).replace("{count}", String(n));
    return;
  }
  const a = v(
    "EIDOLON.LightCriteria.FilterSummaryActive",
    "{active} filters · {visible}/{total}"
  ).replace("{active}", String(r)).replace("{visible}", String(e)).replace("{total}", String(n));
  t.textContent = a;
}
c(Yg, "updateMappingFilterMeta");
function Qg(t, n, e, i, r = {}) {
  if (!(t instanceof HTMLSelectElement)) return;
  const a = typeof i == "string" ? i : "", o = !!(n != null && n.base), s = Array.isArray(r == null ? void 0 : r.categoryOrder) ? r.categoryOrder : [], l = Array.isArray(r == null ? void 0 : r.mappings) ? r.mappings.slice() : Array.isArray(n == null ? void 0 : n.mappings) ? n.mappings.slice() : [], u = t.value;
  t.innerHTML = "";
  const f = document.createElement("option");
  f.value = "", f.textContent = v(
    "EIDOLON.LightCriteria.SelectPlaceholder",
    "Select a mapping"
  ), f.disabled = o, t.appendChild(f);
  const g = document.createElement("option");
  g.value = Oe, g.textContent = v(
    "EIDOLON.LightCriteria.BaseOption",
    "Base Lighting"
  ), g.disabled = !o, t.appendChild(g), l.slice().sort((p, E) => {
    var M;
    const T = wi(p, e, s), I = wi(E, e, s);
    return T.localeCompare(I, ((M = game.i18n) == null ? void 0 : M.lang) ?? void 0, {
      sensitivity: "base"
    });
  }).forEach((p) => {
    if (!(p != null && p.id)) return;
    const E = document.createElement("option");
    E.value = p.id, E.textContent = wi(p, e, s), t.appendChild(E);
  });
  const m = new Set(
    Array.from(t.options).filter((p) => !p.disabled).map((p) => p.value)
  ), y = o && u === "" ? "" : u, b = a || (m.has(y) ? y : "");
  b && m.has(b) ? t.value = b : o ? t.value = Oe : t.value = "";
}
c(Qg, "populateMappingSelector");
function wi(t, n, e = []) {
  if (!t || typeof t != "object")
    return v("EIDOLON.LightCriteria.UnnamedMapping", "Unnamed Mapping");
  if (typeof t.label == "string" && t.label.trim())
    return t.label.trim();
  const i = t.categories ?? {}, r = [], a = /* @__PURE__ */ new Set();
  for (const s of e)
    !s || a.has(s) || (r.push(s), a.add(s));
  for (const s of Object.keys(i).sort((l, u) => l.localeCompare(u)))
    a.has(s) || (r.push(s), a.add(s));
  const o = r.map((s) => {
    const l = i == null ? void 0 : i[s];
    if (typeof l != "string" || !l.trim()) return null;
    const u = l.trim();
    return `${n.get(s) ?? v("EIDOLON.LightCriteria.UnnamedCategory", "Unnamed Category")}=${u}`;
  }).filter(Boolean);
  return o.length === 0 ? v("EIDOLON.LightCriteria.UnnamedMapping", "Unnamed Mapping") : o.join(" | ");
}
c(wi, "formatMappingOptionLabel");
function ks(t, n) {
  if (!t || typeof t != "object" || !Array.isArray(t.mappings)) return null;
  const e = xi(n);
  if (!e) return null;
  const i = t.mappings.find((r) => (r == null ? void 0 : r.key) === e);
  return (i == null ? void 0 : i.id) ?? null;
}
c(ks, "findMappingIdByCategories");
function Wi(t, n) {
  return !n || !t || typeof t != "object" || !Array.isArray(t.mappings) ? null : t.mappings.find((e) => (e == null ? void 0 : e.id) === n) ?? null;
}
c(Wi, "getMappingById");
function Xg(t) {
  if (!t || typeof t != "object") return "";
  const n = t.current;
  if (n != null && n.mappingId) {
    if (n.mappingId === Oe)
      return t != null && t.base ? Oe : "";
    if (Array.isArray(t.mappings) && t.mappings.some((e) => e.id === n.mappingId))
      return n.mappingId;
  }
  if (n != null && n.categories) {
    const e = ks(t, n.categories);
    if (e) return e;
  }
  return "";
}
c(Xg, "resolveInitialMappingSelection");
function cc(t, n = {}) {
  var o, s, l, u;
  if (!(t instanceof HTMLFormElement)) return;
  const e = t.querySelector('color-picker[name="config.color"]'), i = (e == null ? void 0 : e.value) ?? null, r = ((o = e == null ? void 0 : e.ui) == null ? void 0 : o.text) ?? ((s = e == null ? void 0 : e.querySelector) == null ? void 0 : s.call(e, 'input[type="text"]')), a = ((l = e == null ? void 0 : e.ui) == null ? void 0 : l.input) ?? ((u = e == null ? void 0 : e.querySelector) == null ? void 0 : u.call(e, 'input[type="color"]'));
  D("LightCriteria | Color state after apply", {
    ...n,
    textValue: (r == null ? void 0 : r.value) ?? null,
    pickerValue: i,
    swatchValue: (a == null ? void 0 : a.value) ?? null
  });
}
c(cc, "logAppliedColorState");
function Zg(t) {
  t.querySelectorAll("select[data-category-id]").forEach((n) => {
    n.value = "";
  });
}
c(Zg, "resetCategorySelections");
function em(t, n) {
  const e = n && typeof n == "object" ? n : {};
  t.querySelectorAll("select[data-category-id]").forEach((i) => {
    const r = i.dataset.categoryId;
    if (!r) return;
    const a = e[r];
    i.value = typeof a == "string" ? a : "";
  });
}
c(em, "setCategorySelections");
function tm(t) {
  const n = {};
  return t.querySelectorAll("select[data-category-id]").forEach((e) => {
    var a, o;
    const i = e.dataset.categoryId, r = (o = (a = e.value) == null ? void 0 : a.trim) == null ? void 0 : o.call(a);
    !i || !r || (n[i] = r);
  }), Object.keys(n).length > 0 ? n : null;
}
c(tm, "readCategorySelections");
async function Do(t, n, e) {
  if (!t) return null;
  try {
    if (!e)
      return await Gi(t, {});
    if (e === Oe)
      return await Gi(t, {
        mappingId: Oe,
        categories: null,
        updatedAt: Date.now()
      });
    const i = Wi(n, e);
    return i ? await Gi(t, {
      mappingId: i.id,
      categories: i.categories,
      updatedAt: Date.now()
    }) : null;
  } catch (i) {
    return console.warn("eidolon-utilities | Failed to persist mapping selection", i), null;
  }
}
c(Do, "persistCurrentSelection");
function Tl(t, n) {
  if (!(t instanceof HTMLElement)) return;
  const e = t.querySelector(".eidolon-light-criteria-manager__section.is-bottom");
  e instanceof HTMLElement && (e.hidden = !!(n != null && n.hidden));
}
c(Tl, "updateManagerSectionVisibility");
function $n({ switcher: t, emptyState: n, state: e }) {
  const i = !!(e != null && e.base);
  t instanceof HTMLElement && (t.hidden = !i), n instanceof HTMLElement && (n.hidden = i);
}
c($n, "updateActiveMappingVisibility");
function Qu(t) {
  const n = (t == null ? void 0 : t.object) ?? (t == null ? void 0 : t.document) ?? null;
  return !(n != null && n.isEmbedded) || n.documentName !== "AmbientLight" ? null : n;
}
c(Qu, "getAmbientLightDocument");
function nm(t) {
  if (!(t != null && t.isEmbedded)) return null;
  const n = t.parent ?? null;
  if (!n) return t;
  if (typeof n.getEmbeddedDocument == "function") {
    const i = n.getEmbeddedDocument(t.documentName, t.id);
    if (i) return i;
  }
  const e = n.lights;
  if (e != null && e.get) {
    const i = e.get(t.id);
    if (i) return i;
  }
  return t;
}
c(nm, "getPersistedAmbientLightDocument");
function im() {
  xg();
}
c(im, "registerLightCriteriaHooks");
im();
const xs = /* @__PURE__ */ new Map();
let $s = !1;
function Cl(t, n) {
  xs.has(t) && console.warn(`[${L}] Socket handler for type "${t}" already registered, overwriting.`), xs.set(t, n);
}
c(Cl, "registerSocketHandler");
function Kr(t, n) {
  if (!$s) {
    console.error(`[${L}] Socket not initialized. Call initializeSocket() first.`);
    return;
  }
  game.socket.emit(`module.${L}`, { type: t, payload: n });
}
c(Kr, "emitSocket");
function rm() {
  $s || (game.socket.on(`module.${L}`, (t) => {
    const { type: n, payload: e } = t ?? {}, i = xs.get(n);
    i ? i(e) : console.warn(`[${L}] No socket handler for type "${n}"`);
  }), $s = !0, console.log(`[${L}] Socket initialized on channel module.${L}`));
}
c(rm, "initializeSocket");
const Xu = "tween", Zu = "tween-sequence", Fs = "tween-sequence-cancel", De = Object.freeze({
  ABORT: "abort",
  CONTINUE: "continue"
}), an = Object.freeze({
  COMPLETED: "completed",
  CANCELLED: "cancelled",
  FAILED: "failed"
}), wt = Object.freeze({
  BEFORE_ALL: "beforeAll",
  BEFORE_STEP: "before",
  ENTRY: "entry",
  AFTER_STEP: "after",
  RUNTIME: "runtime",
  VALIDATION: "validation",
  AWAIT: "await",
  EMIT: "emit",
  PARALLEL: "parallel"
}), ma = /* @__PURE__ */ new Map();
function Zt({ type: t, execute: n, validate: e }) {
  ma.has(t) && console.warn(`[tween-registry] Type "${t}" already registered, overwriting.`), ma.set(t, { type: t, execute: n, validate: e ?? (() => {
  }) });
}
c(Zt, "registerTweenType");
function Cr(t) {
  return ma.get(t);
}
c(Cr, "getTweenType");
function am(t, n = {}) {
  const e = Cr(t);
  if (!e)
    throw new Error(`Unknown tween type: "${t}".`);
  return e.validate(n ?? {}), e;
}
c(am, "validateTweenEntry");
function Ds() {
  return [...ma.keys()];
}
c(Ds, "listTweenTypes");
const vi = {
  easeInQuad: /* @__PURE__ */ c((t) => t * t, "easeInQuad"),
  easeOutQuad: /* @__PURE__ */ c((t) => t * (2 - t), "easeOutQuad"),
  easeInOutQuad: /* @__PURE__ */ c((t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t, "easeInOutQuad"),
  easeInCubic: /* @__PURE__ */ c((t) => t * t * t, "easeInCubic"),
  easeOutCubic: /* @__PURE__ */ c((t) => {
    const n = t - 1;
    return n * n * n + 1;
  }, "easeOutCubic"),
  easeInOutCubic: /* @__PURE__ */ c((t) => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1, "easeInOutCubic"),
  easeOutBounce: /* @__PURE__ */ c((t) => {
    if (t < 1 / 2.75) return 7.5625 * t * t;
    if (t < 2 / 2.75) {
      const e = t - 0.5454545454545454;
      return 7.5625 * e * e + 0.75;
    }
    if (t < 2.5 / 2.75) {
      const e = t - 0.8181818181818182;
      return 7.5625 * e * e + 0.9375;
    }
    const n = t - 2.625 / 2.75;
    return 7.5625 * n * n + 0.984375;
  }, "easeOutBounce"),
  easeInBounce: /* @__PURE__ */ c((t) => 1 - vi.easeOutBounce(1 - t), "easeInBounce"),
  easeInOutBounce: /* @__PURE__ */ c((t) => t < 0.5 ? (1 - vi.easeOutBounce(1 - 2 * t)) / 2 : (1 + vi.easeOutBounce(2 * t - 1)) / 2, "easeInOutBounce"),
  easeInElastic: /* @__PURE__ */ c((t) => t === 0 || t === 1 ? t : -Math.pow(2, 10 * (t - 1)) * Math.sin((t - 1.1) * 5 * Math.PI), "easeInElastic"),
  easeOutElastic: /* @__PURE__ */ c((t) => t === 0 || t === 1 ? t : Math.pow(2, -10 * t) * Math.sin((t - 0.1) * 5 * Math.PI) + 1, "easeOutElastic")
};
function Sr(t) {
  if (t && vi[t])
    return vi[t];
  const n = foundry.canvas.animation.CanvasAnimation;
  return {
    linear: n.easeLinear,
    easeInOutCosine: n.easeInOutCosine
  }[t] ?? n.easeInOutCosine;
}
c(Sr, "resolveEasing");
function om() {
  return ["linear", "easeInOutCosine", ...Object.keys(vi)];
}
c(om, "listEasingNames");
function pa(t) {
  return t <= 0.04045 ? t / 12.92 : ((t + 0.055) / 1.055) ** 2.4;
}
c(pa, "srgbToLinear");
function Ei(t) {
  return t <= 31308e-7 ? 12.92 * t : 1.055 * t ** (1 / 2.4) - 0.055;
}
c(Ei, "linearToSrgb");
function uc(t, n, e) {
  const i = 0.4122214708 * t + 0.5363325363 * n + 0.0514459929 * e, r = 0.2119034982 * t + 0.6806995451 * n + 0.1073969566 * e, a = 0.0883024619 * t + 0.2817188376 * n + 0.6299787005 * e, o = Math.cbrt(i), s = Math.cbrt(r), l = Math.cbrt(a);
  return [
    0.2104542553 * o + 0.793617785 * s - 0.0040720468 * l,
    1.9779984951 * o - 2.428592205 * s + 0.4505937099 * l,
    0.0259040371 * o + 0.7827717662 * s - 0.808675766 * l
  ];
}
c(uc, "linearRgbToOklab");
function sm(t, n, e) {
  const i = (t + 0.3963377774 * n + 0.2158037573 * e) ** 3, r = (t - 0.1055613458 * n - 0.0638541728 * e) ** 3, a = (t - 0.0894841775 * n - 1.291485548 * e) ** 3;
  return [
    4.0767416621 * i - 3.3077115913 * r + 0.2309699292 * a,
    -1.2684380046 * i + 2.6097574011 * r - 0.3413193965 * a,
    -0.0041960863 * i - 0.7034186147 * r + 1.707614701 * a
  ];
}
c(sm, "oklabToLinearRgb");
function ya(t) {
  return [t.r, t.g, t.b];
}
c(ya, "colorToRgb");
function ed(t, n, e) {
  const i = /* @__PURE__ */ c((a) => Math.max(0, Math.min(1, a)), "clamp"), r = /* @__PURE__ */ c((a) => Math.round(i(a) * 255).toString(16).padStart(2, "0"), "toHex");
  return `#${r(t)}${r(n)}${r(e)}`;
}
c(ed, "rgbToHex");
function lm(t, n, e) {
  if (e <= 0) return t.toHTML();
  if (e >= 1) return n.toHTML();
  const i = foundry.utils.Color, [r, a, o] = t.hsl, [s, l, u] = n.hsl, f = (s - r + 0.5) % 1 - 0.5, g = (r + f * e + 1) % 1, m = a + (l - a) * e, y = o + (u - o) * e;
  return i.fromHSL([g, m, y]).toHTML();
}
c(lm, "interpolateHsl");
function cm(t, n, e) {
  if (e <= 0) return t.toHTML();
  if (e >= 1) return n.toHTML();
  const [i, r, a] = ya(t).map(pa), [o, s, l] = ya(n).map(pa), u = Ei(i + (o - i) * e), f = Ei(r + (s - r) * e), g = Ei(a + (l - a) * e);
  return ed(u, f, g);
}
c(cm, "interpolateRgb");
function um(t, n, e) {
  if (e <= 0) return t.toHTML();
  if (e >= 1) return n.toHTML();
  const [i, r, a] = ya(t).map(pa), [o, s, l] = ya(n).map(pa), [u, f, g] = uc(i, r, a), [m, y, b] = uc(o, s, l), p = 0.02, E = Math.sqrt(f * f + g * g), T = Math.sqrt(y * y + b * b);
  let I, M, $;
  if (E < p || T < p)
    I = u + (m - u) * e, M = f + (y - f) * e, $ = g + (b - g) * e;
  else {
    const G = Math.atan2(g, f);
    let U = Math.atan2(b, y) - G;
    U > Math.PI && (U -= 2 * Math.PI), U < -Math.PI && (U += 2 * Math.PI), I = u + (m - u) * e;
    const ee = E + (T - E) * e, R = G + U * e;
    M = ee * Math.cos(R), $ = ee * Math.sin(R);
  }
  const [k, _, H] = sm(I, M, $);
  return ed(Ei(k), Ei(_), Ei(H));
}
c(um, "interpolateOklch");
const _s = {
  hsl: lm,
  rgb: cm,
  oklch: um
};
function dm(t = "hsl") {
  return _s[t] ?? _s.hsl;
}
c(dm, "getInterpolator");
function dc() {
  return Object.keys(_s);
}
c(dc, "listInterpolationModes");
function fm(t) {
  if ((Array.isArray(t.uuid) ? t.uuid : [t.uuid]).some((e) => !e || typeof e != "string"))
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
  if (t.mode && !dc().includes(t.mode))
    throw new Error(
      `light-color tween: unknown mode "${t.mode}". Available: ${dc().join(", ")}`
    );
}
c(fm, "validate$5");
async function hm(t, n = {}) {
  const { CanvasAnimation: e } = foundry.canvas.animation, { Color: i } = foundry.utils, { uuid: r, toColor: a, toAlpha: o, mode: s = "oklch" } = t, l = Array.isArray(r) ? r : [r];
  if (l.length === 0)
    return console.warn("light-color tween: empty uuid array, nothing to animate."), !0;
  const {
    durationMS: u = 2e3,
    easing: f = "easeInOutCosine",
    commit: g = !0,
    startEpochMS: m = null,
    signal: y = null
  } = n, b = Sr(f), p = a != null, E = o != null, T = p ? dm(s) : null, I = p ? i.fromString(a) : null;
  if (p && !I.valid) throw new Error(`light-color tween: invalid target color "${a}".`);
  async function M(k) {
    var Z, z;
    if (y != null && y.aborted) return !1;
    const _ = await fromUuid(k);
    if (!_) return !1;
    const H = _.object;
    if (!H) return !1;
    let G;
    if (p) {
      const X = (Z = _.config) == null ? void 0 : Z.color;
      X != null && X.valid || console.warn(`light-color tween: source color invalid on ${k}, using white.`), G = X != null && X.valid ? X : i.fromString("#ffffff");
    }
    const ie = E ? ((z = _._source.config) == null ? void 0 : z.alpha) ?? 0.5 : null, U = { t: 0 }, ee = `ambient-hue-tween:${k}`;
    e.terminateAnimation(ee), y && y.addEventListener("abort", () => {
      e.terminateAnimation(ee);
    }, { once: !0 });
    const R = typeof m == "number" ? Math.max(0, Math.min(u, Date.now() - m)) : 0, K = /* @__PURE__ */ c((X) => {
      const le = {};
      p && (le.color = T(G, I, X)), E && (le.alpha = ie + (o - ie) * X), _.updateSource({ config: le }), H.initializeLightSource();
    }, "applyFrame");
    R > 0 && (U.t = R / u, K(U.t));
    const Q = await e.animate(
      [{ parent: U, attribute: "t", to: 1 }],
      {
        name: ee,
        duration: u,
        easing: b,
        time: R,
        ontick: /* @__PURE__ */ c(() => K(U.t), "ontick")
      }
    );
    if (Q !== !1) {
      if (y != null && y.aborted) return !1;
      const X = {};
      p && (X.color = I.toHTML()), E && (X.alpha = o), _.updateSource({ config: X }), H.initializeLightSource();
    }
    if (g && Q !== !1 && _.canUserModify(game.user, "update")) {
      if (y != null && y.aborted) return !1;
      const X = {}, le = {};
      p && (X.color = G.toHTML(), le["config.color"] = I.toHTML()), E && (X.alpha = ie, le["config.alpha"] = o), _.updateSource({ config: X }), await _.update(le);
    }
    return Q !== !1;
  }
  return c(M, "animateOne"), (await Promise.all(l.map(M))).every(Boolean);
}
c(hm, "execute$5");
function gm() {
  Zt({ type: "light-color", execute: hm, validate: fm });
}
c(gm, "registerLightColorTween");
const on = /* @__PURE__ */ new WeakMap();
function mm(t) {
  if ((Array.isArray(t.uuid) ? t.uuid : [t.uuid]).some((e) => !e || typeof e != "string"))
    throw new Error("light-state tween: 'uuid' is required (string or array of AmbientLight document UUIDs).");
  if (typeof t.enabled != "boolean")
    throw new Error("light-state tween: 'enabled' (boolean) is required.");
}
c(mm, "validate$4");
async function pm(t, n = {}) {
  const { CanvasAnimation: e } = foundry.canvas.animation, { uuid: i, enabled: r } = t, a = Array.isArray(i) ? i : [i];
  if (a.length === 0)
    return console.warn("light-state tween: empty uuid array, nothing to animate."), !0;
  const {
    durationMS: o = 2e3,
    easing: s = "easeInOutCosine",
    commit: l = !0,
    startEpochMS: u = null,
    signal: f = null
  } = n, g = Sr(s);
  async function m(b) {
    var _, H, G, ie;
    if (f != null && f.aborted) return !1;
    const p = await fromUuid(b);
    if (!p) return !1;
    const E = p.object;
    if (!E) return !1;
    const T = `ambient-state-tween:${b}`;
    e.terminateAnimation(T), f && f.addEventListener("abort", () => {
      e.terminateAnimation(T);
    }, { once: !0 });
    const I = on.get(p) ?? {
      hidden: p._source.hidden,
      alpha: ((_ = p._source.config) == null ? void 0 : _.alpha) ?? 0.5
    };
    if (on.set(p, I), D(`light-state START ${r ? "ON" : "OFF"} | snap: ${JSON.stringify(I)} | _source.hidden=${p._source.hidden}, _source.config.alpha=${(H = p._source.config) == null ? void 0 : H.alpha}`), r && !I.hidden || !r && I.hidden)
      return on.delete(p), !0;
    const M = I.alpha, $ = typeof u == "number" ? Math.max(0, Math.min(o, Date.now() - u)) : 0, k = /* @__PURE__ */ c((U) => {
      p.updateSource({ config: { alpha: U } }), E.initializeLightSource();
    }, "applyAlpha");
    if (r) {
      p.updateSource({ hidden: !1, config: { alpha: 0 } }), E.initializeLightSource(), canvas.perception.update({ refreshLighting: !0, refreshVision: !0 });
      const U = { t: 0 };
      $ > 0 && (U.t = $ / o, k(M * U.t));
      const ee = await e.animate(
        [{ parent: U, attribute: "t", to: 1 }],
        {
          name: T,
          duration: o,
          easing: g,
          time: $,
          ontick: /* @__PURE__ */ c(() => k(M * U.t), "ontick")
        }
      );
      return ee !== !1 && !(f != null && f.aborted) && l && p.canUserModify(game.user, "update") ? (p.updateSource({ hidden: !0, config: { alpha: M } }), await p.update({ hidden: !1 }), D(`light-state FADE-IN committed. _source.hidden=${p._source.hidden}, _source.config.alpha=${(G = p._source.config) == null ? void 0 : G.alpha}`), on.delete(p)) : ee === !1 || on.delete(p), ee !== !1;
    } else {
      p.updateSource({ hidden: !1, config: { alpha: I.alpha } }), E.initializeLightSource();
      const U = { t: 0 };
      $ > 0 && (U.t = $ / o, k(M * (1 - U.t)));
      const ee = await e.animate(
        [{ parent: U, attribute: "t", to: 1 }],
        {
          name: T,
          duration: o,
          easing: g,
          time: $,
          ontick: /* @__PURE__ */ c(() => k(M * (1 - U.t)), "ontick")
        }
      );
      return ee !== !1 && !(f != null && f.aborted) && l && p.canUserModify(game.user, "update") ? (await p.update({ hidden: !0 }), p.updateSource({ config: { alpha: M } }), E.initializeLightSource(), D(`light-state FADE-OUT committed+restored. _source.hidden=${p._source.hidden}, _source.config.alpha=${(ie = p._source.config) == null ? void 0 : ie.alpha}`), on.delete(p)) : ee === !1 || (p.updateSource({ hidden: !0, config: { alpha: M } }), E.initializeLightSource(), on.delete(p)), ee !== !1;
    }
  }
  return c(m, "animateOne"), (await Promise.all(a.map(m))).every(Boolean);
}
c(pm, "execute$4");
function ym() {
  Zt({ type: "light-state", execute: pm, validate: mm });
}
c(ym, "registerLightStateTween");
function go(t) {
  if ((Array.isArray(t.uuid) ? t.uuid : [t.uuid]).some((e) => !e || typeof e != "string"))
    throw new Error("tile-prop tween: 'uuid' is required (string or array of Tile document UUIDs).");
  if (!t.attribute || typeof t.attribute != "string")
    throw new Error("tile-prop tween: 'attribute' (string) is required — dot-path to a numeric property (e.g. 'alpha', 'rotation').");
  if (typeof t.value != "number")
    throw new Error("tile-prop tween: 'value' (number) is required — the target value to animate to.");
}
c(go, "validate$3");
async function mo(t, n = {}) {
  const { CanvasAnimation: e } = foundry.canvas.animation, { uuid: i, attribute: r, value: a } = t, o = Array.isArray(i) ? i : [i];
  if (o.length === 0)
    return console.warn("tile-prop tween: empty uuid array, nothing to animate."), !0;
  const {
    durationMS: s = 2e3,
    easing: l = "easeInOutCosine",
    commit: u = !0,
    startEpochMS: f = null,
    signal: g = null
  } = n, m = Sr(l);
  async function y(p) {
    if (g != null && g.aborted) return !1;
    const E = await fromUuid(p);
    if (!E) return !1;
    const T = E.object;
    if (!T) return !1;
    const I = foundry.utils.getProperty(E._source, r);
    if (typeof I != "number")
      return console.warn(`tile-prop tween: source value at '${r}' on ${p} is not a number (got ${typeof I}). Skipping.`), !1;
    const M = `tile-prop-tween:${r}:${p}`;
    e.terminateAnimation(M), g && g.addEventListener("abort", () => {
      e.terminateAnimation(M);
    }, { once: !0 });
    const $ = typeof f == "number" ? Math.max(0, Math.min(s, Date.now() - f)) : 0, k = /* @__PURE__ */ c((G) => {
      const ie = I + (a - I) * G;
      E.updateSource(foundry.utils.expandObject({ [r]: ie })), T.refresh();
    }, "applyFrame"), _ = { t: 0 };
    $ > 0 && (_.t = $ / s, k(_.t));
    const H = await e.animate(
      [{ parent: _, attribute: "t", to: 1 }],
      {
        name: M,
        duration: s,
        easing: m,
        time: $,
        ontick: /* @__PURE__ */ c(() => k(_.t), "ontick")
      }
    );
    if (H !== !1) {
      if (g != null && g.aborted) return !1;
      E.updateSource(foundry.utils.expandObject({ [r]: a })), T.refresh();
    }
    if (u && H !== !1 && E.canUserModify(game.user, "update")) {
      if (g != null && g.aborted) return !1;
      E.updateSource(foundry.utils.expandObject({ [r]: I })), await E.update({ [r]: a });
    }
    return H !== !1;
  }
  return c(y, "animateOne"), (await Promise.all(o.map(y))).every(Boolean);
}
c(mo, "execute$3");
function bm() {
  Zt({ type: "tile-prop", execute: mo, validate: go });
}
c(bm, "registerTilePropTween");
function wm(t) {
  if (!t.attribute || typeof t.attribute != "string")
    throw new Error("particles-prop tween: 'attribute' (string) is required — property name on canvas.particleeffects (e.g. 'alpha').");
  if (typeof t.value != "number")
    throw new Error("particles-prop tween: 'value' (number) is required — the target value to animate to.");
}
c(wm, "validate$2");
async function vm(t, n = {}) {
  const { CanvasAnimation: e } = foundry.canvas.animation, { attribute: i, value: r } = t, {
    durationMS: a = 2e3,
    easing: o = "easeInOutCosine",
    startEpochMS: s = null,
    signal: l = null
  } = n, u = canvas.particleeffects;
  if (!u)
    return console.warn("particles-prop tween: canvas.particleeffects not available."), !1;
  const f = u[i];
  if (typeof f != "number")
    return console.warn(`particles-prop tween: current value of '${i}' is not a number (got ${typeof f}). Skipping.`), !1;
  const g = Sr(o), m = `particles-prop-tween:${i}`;
  e.terminateAnimation(m), l && l.addEventListener("abort", () => {
    e.terminateAnimation(m);
  }, { once: !0 });
  const y = typeof s == "number" ? Math.max(0, Math.min(a, Date.now() - s)) : 0, b = /* @__PURE__ */ c((T) => {
    u[i] = f + (r - f) * T;
  }, "applyFrame"), p = { t: 0 };
  y > 0 && (p.t = y / a, b(p.t));
  const E = await e.animate(
    [{ parent: p, attribute: "t", to: 1 }],
    {
      name: m,
      duration: a,
      easing: g,
      time: y,
      ontick: /* @__PURE__ */ c(() => b(p.t), "ontick")
    }
  );
  if (E !== !1) {
    if (l != null && l.aborted) return !1;
    u[i] = r;
  }
  return E !== !1;
}
c(vm, "execute$2");
function Em() {
  Zt({ type: "particles-prop", execute: vm, validate: wm });
}
c(Em, "registerParticlesPropTween");
var dn, ir, rr, ar, or, sr, Si;
const Nl = class Nl {
  /**
   * @param {AbortController} controller
   */
  constructor(n) {
    x(this, dn);
    x(this, ir);
    x(this, rr);
    x(this, ar);
    x(this, or);
    x(this, sr, !1);
    x(this, Si, null);
    A(this, dn, n), A(this, ar, new Promise((e) => {
      A(this, ir, e);
    })), A(this, or, new Promise((e) => {
      A(this, rr, e);
    }));
  }
  /** @returns {Promise<boolean>} Resolves true (completed) or false (cancelled/failed). */
  get finished() {
    return d(this, ar);
  }
  /** @returns {Promise<{status: string, [k: string]: unknown}>} */
  get result() {
    return d(this, or);
  }
  /** @returns {boolean} */
  get cancelled() {
    return d(this, dn).signal.aborted;
  }
  /** @returns {AbortSignal} */
  get signal() {
    return d(this, dn).signal;
  }
  /** @returns {string} */
  get status() {
    return d(this, Si) ? d(this, Si).status : this.cancelled ? "cancelled" : "running";
  }
  /** Abort the timeline, triggering onCancel callbacks. */
  cancel(n = "cancelled") {
    d(this, dn).signal.aborted || d(this, dn).abort(n);
  }
  /**
   * Called internally by the execution engine when the timeline finishes.
   * @param {boolean} completed - true if all steps ran, false if cancelled
   */
  _resolve(n) {
    if (d(this, sr)) return;
    A(this, sr, !0);
    const e = typeof n == "boolean" ? { status: n ? "completed" : "cancelled" } : n ?? { status: "cancelled" };
    A(this, Si, e), d(this, ir).call(this, e.status === "completed"), d(this, rr).call(this, e);
  }
};
dn = new WeakMap(), ir = new WeakMap(), rr = new WeakMap(), ar = new WeakMap(), or = new WeakMap(), sr = new WeakMap(), Si = new WeakMap(), c(Nl, "TimelineHandle");
let Ps = Nl;
var Jn, Li, Kn;
const kl = class kl {
  constructor() {
    /** @type {Map<string, Set<Function>>} */
    x(this, Jn, /* @__PURE__ */ new Map());
    /** @type {Set<string>} Signals that have been emitted (sticky) */
    x(this, Li, /* @__PURE__ */ new Set());
    x(this, Kn, !1);
  }
  /**
   * Subscribe to a named signal.
   * @param {string} signal
   * @param {Function} listener
   * @returns {() => void} Unsubscribe function
   */
  on(n, e) {
    if (d(this, Kn)) return () => {
    };
    let i = d(this, Jn).get(n);
    return i || (i = /* @__PURE__ */ new Set(), d(this, Jn).set(n, i)), i.add(e), () => i.delete(e);
  }
  /**
   * Fire a named signal synchronously. All registered listeners are invoked.
   * The signal is recorded so that future waitFor() calls resolve immediately.
   * @param {string} signal
   */
  emit(n) {
    if (d(this, Kn)) return;
    d(this, Li).add(n);
    const e = d(this, Jn).get(n);
    if (e)
      for (const i of e)
        i();
  }
  /**
   * Returns a promise that resolves when the signal fires, or rejects
   * if the abort signal fires first.
   * @param {string} signal
   * @param {AbortSignal} [abortSignal]
   * @returns {Promise<void>}
   */
  waitFor(n, e) {
    return d(this, Kn) ? Promise.reject(new Error("EventBus destroyed")) : d(this, Li).has(n) ? Promise.resolve() : new Promise((i, r) => {
      if (e != null && e.aborted)
        return r(e.reason ?? "aborted");
      const a = this.on(n, () => {
        a(), o && (e == null || e.removeEventListener("abort", o)), i();
      });
      let o;
      e && (o = /* @__PURE__ */ c(() => {
        a(), r(e.reason ?? "aborted");
      }, "onAbort"), e.addEventListener("abort", o, { once: !0 }));
    });
  }
  /**
   * Tear down the bus, clearing all listeners.
   */
  destroy() {
    A(this, Kn, !0), d(this, Jn).clear(), d(this, Li).clear();
  }
};
Jn = new WeakMap(), Li = new WeakMap(), Kn = new WeakMap(), c(kl, "EventBus");
let Rs = kl;
const td = /* @__PURE__ */ new Map();
function po(t, n) {
  td.set(t, n);
}
c(po, "registerAwaitProvider");
function Tm(t, n) {
  const e = td.get(t.event);
  return e ? e(t, n) : Promise.reject(new Error(`Unknown await event type: "${t.event}"`));
}
c(Tm, "createAwaitPromise");
po("signal", (t, n) => t.name ? n.eventBus.waitFor(t.name, n.signal) : Promise.reject(new Error('await signal: "name" is required')));
po("click", (t, n) => new Promise((e, i) => {
  if (n.signal.aborted) return i(n.signal.reason ?? "aborted");
  const r = /* @__PURE__ */ c(() => {
    o(), e();
  }, "onClick"), a = /* @__PURE__ */ c(() => {
    o(), i(n.signal.reason ?? "aborted");
  }, "onAbort"), o = /* @__PURE__ */ c(() => {
    document.removeEventListener("click", r), n.signal.removeEventListener("abort", a);
  }, "cleanup");
  document.addEventListener("click", r, { once: !0 }), n.signal.addEventListener("abort", a, { once: !0 });
}));
po("keypress", (t, n) => new Promise((e, i) => {
  if (n.signal.aborted) return i(n.signal.reason ?? "aborted");
  const r = /* @__PURE__ */ c((s) => {
    t.key && s.key !== t.key || (o(), e());
  }, "onKey"), a = /* @__PURE__ */ c(() => {
    o(), i(n.signal.reason ?? "aborted");
  }, "onAbort"), o = /* @__PURE__ */ c(() => {
    document.removeEventListener("keydown", r), n.signal.removeEventListener("abort", a);
  }, "cleanup");
  document.addEventListener("keydown", r), n.signal.addEventListener("abort", a, { once: !0 });
}));
const gi = /* @__PURE__ */ new Map();
function Cm(t, n) {
  const e = gi.get(t);
  e && !e.cancelled && e.cancel("replaced-by-name"), gi.set(t, n), n.finished.then(() => {
    gi.get(t) === n && gi.delete(t);
  });
}
c(Cm, "registerTimeline");
function nd(t) {
  const n = gi.get(t);
  return n && !n.cancelled ? (n.cancel("cancelled-by-name"), !0) : !1;
}
c(nd, "cancelTimeline");
function Sm(t) {
  return gi.get(t);
}
c(Sm, "getTimeline");
function fc(t, n) {
  return t <= 0 ? Promise.resolve() : new Promise((e, i) => {
    if (n.aborted) return i(n.reason);
    const r = setTimeout(e, t);
    n.addEventListener("abort", () => {
      clearTimeout(r), i(n.reason);
    }, { once: !0 });
  });
}
c(fc, "cancellableDelay");
var Ke, fn, lr, cr;
const xl = class xl {
  constructor(n) {
    /** @type {TweenTimeline} */
    x(this, Ke);
    /** @type {Array<{ type: string, params: object, opts?: object, detach: boolean }>} */
    x(this, fn, []);
    /** @type {Function|null} */
    x(this, lr, null);
    /** @type {Function|null} */
    x(this, cr, null);
    A(this, Ke, n);
  }
  /**
   * Add a tween entry to this step.
   * @param {string} type  Registered tween type name
   * @param {object} params  Type-specific parameters
   * @param {object} [opts]  Options (durationMS, easing, etc.)
   * @returns {StepBuilder} this
   */
  add(n, e, i) {
    return d(this, fn).push({ type: n, params: e, opts: i ?? {}, detach: !1 }), this;
  }
  /**
   * Mark the last entry as fire-and-forget (does not block step progression).
   * @returns {StepBuilder} this
   */
  detach() {
    if (d(this, fn).length === 0)
      throw new Error("StepBuilder.detach(): no entry to detach.");
    return d(this, fn)[d(this, fn).length - 1].detach = !0, this;
  }
  /**
   * Callback invoked before this step's tweens start.
   * @param {Function} fn
   * @returns {StepBuilder} this
   */
  before(n) {
    return A(this, lr, n), this;
  }
  /**
   * Callback invoked after this step's awaited tweens complete.
   * @param {Function} fn
   * @returns {StepBuilder} this
   */
  after(n) {
    return A(this, cr, n), this;
  }
  // ── Delegation to parent TweenTimeline for fluent chaining ──
  /** Start a new step (finalizes this one). */
  step() {
    return d(this, Ke).step();
  }
  /** Insert a delay between steps. */
  delay(n) {
    return d(this, Ke).delay(n);
  }
  /** Insert an await segment. */
  await(n) {
    return d(this, Ke).await(n);
  }
  /** Insert an emit segment. */
  emit(n) {
    return d(this, Ke).emit(n);
  }
  /** Insert a parallel segment. */
  parallel(n, e) {
    return d(this, Ke).parallel(n, e);
  }
  /** Register onComplete callback. */
  onComplete(n) {
    return d(this, Ke).onComplete(n);
  }
  /** Register onCancel callback. */
  onCancel(n) {
    return d(this, Ke).onCancel(n);
  }
  /** Register onError callback. */
  onError(n) {
    return d(this, Ke).onError(n);
  }
  /** Execute the timeline. */
  run(n) {
    return d(this, Ke).run(n);
  }
  /** Serialize the timeline. */
  toJSON() {
    return d(this, Ke).toJSON();
  }
  // ── Internal access ──
  /** @returns {{ entries: Array, before: Function|null, after: Function|null }} */
  _finalize() {
    return {
      entries: d(this, fn),
      before: d(this, lr),
      after: d(this, cr)
    };
  }
};
Ke = new WeakMap(), fn = new WeakMap(), lr = new WeakMap(), cr = new WeakMap(), c(xl, "StepBuilder");
let Hs = xl;
var Ye, Pe, Lt, hn, ur, dr, fr, hr, In, qs, ne, Vt, Bs, id, js, rd, ad, Yr, ft, Ft;
const Wt = class Wt {
  constructor() {
    x(this, ne);
    /** @type {string|null} */
    x(this, Ye, null);
    /** @type {string} */
    x(this, Pe, De.ABORT);
    /** @type {Array<object>} */
    x(this, Lt, []);
    /** @type {StepBuilder|null} */
    x(this, hn, null);
    /** @type {Function|null} */
    x(this, ur, null);
    /** @type {Function|null} */
    x(this, dr, null);
    /** @type {Function|null} */
    x(this, fr, null);
    /** @type {Function|null} */
    x(this, hr, null);
  }
  /**
   * Register this timeline in the named registry. Starting a new
   * timeline with the same name cancels the previous one.
   * @param {string} name
   * @returns {TweenTimeline} this
   */
  name(n) {
    return A(this, Ye, n), this;
  }
  /**
   * Set the error policy for step execution.
   * @param {"abort"|"continue"} policy
   * @returns {TweenTimeline} this
   */
  errorPolicy(n) {
    if (n !== De.ABORT && n !== De.CONTINUE)
      throw new Error(`Invalid error policy: "${n}". Use "abort" or "continue".`);
    return A(this, Pe, n), this;
  }
  /**
   * Start a new step. Finalizes the previous step if one is open.
   * @returns {StepBuilder}
   */
  step() {
    return h(this, ne, Vt).call(this), A(this, hn, new Hs(this)), d(this, hn);
  }
  /**
   * Insert a delay (in ms) between the previous step and the next.
   * @param {number} ms
   * @returns {TweenTimeline} this
   */
  delay(n) {
    return h(this, ne, Vt).call(this), d(this, Lt).push({ kind: "delay", ms: n }), this;
  }
  /**
   * Pause execution until an event occurs.
   * @param {object} config  e.g. { event: "click" }, { event: "signal", name: "fog-done" }
   * @returns {TweenTimeline} this
   */
  await(n) {
    return h(this, ne, Vt).call(this), d(this, Lt).push({ kind: "await", config: n }), this;
  }
  /**
   * Fire a named signal (instant, non-blocking).
   * @param {string} signal  Signal name
   * @returns {TweenTimeline} this
   */
  emit(n) {
    return h(this, ne, Vt).call(this), d(this, Lt).push({ kind: "emit", signal: n }), this;
  }
  /**
   * Fork N branches with a join strategy.
   * @param {Array<(tl: TweenTimeline) => void>} branchFns  Callbacks that build each branch
   * @param {object} [opts]
   * @param {"all"|"any"|number} [opts.join="all"]  Join strategy
   * @param {"detach"|"cancel"} [opts.overflow="detach"]  What to do with un-joined branches
   * @returns {TweenTimeline} this
   */
  parallel(n, e = {}) {
    h(this, ne, Vt).call(this);
    const i = e.join ?? "all", r = e.overflow ?? "detach";
    if (i !== "all" && i !== "any" && (typeof i != "number" || i < 1 || i > n.length))
      throw new Error(`parallel: join must be "all", "any", or 1..${n.length}, got ${JSON.stringify(i)}`);
    if (r !== "detach" && r !== "cancel")
      throw new Error(`parallel: overflow must be "detach" or "cancel", got ${JSON.stringify(r)}`);
    const a = n.map((o) => {
      var l;
      const s = new Wt();
      return o(s), h(l = s, ne, Vt).call(l), d(s, Lt);
    });
    return d(this, Lt).push({ kind: "parallel", branches: a, join: i, overflow: r }), this;
  }
  /**
   * Callback invoked before the first step runs.
   * @param {Function} fn
   * @returns {TweenTimeline} this
   */
  beforeAll(n) {
    return A(this, ur, n), this;
  }
  /**
   * Callback invoked on successful completion.
   * @param {Function} fn
   * @returns {TweenTimeline} this
   */
  onComplete(n) {
    return A(this, dr, n), this;
  }
  /**
   * Callback invoked on cancellation (mutually exclusive with onComplete).
   * @param {Function} fn
   * @returns {TweenTimeline} this
   */
  onCancel(n) {
    return A(this, fr, n), this;
  }
  /**
   * Callback invoked on runtime failure (mutually exclusive with onComplete/onCancel).
   * @param {(outcome: object) => void} fn
   * @returns {TweenTimeline} this
   */
  onError(n) {
    return A(this, hr, n), this;
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
  run(n = {}) {
    h(this, ne, Vt).call(this);
    const e = new AbortController();
    n.signal && (n.signal.aborted ? e.abort(n.signal.reason ?? "parent-aborted") : n.signal.addEventListener("abort", () => {
      e.signal.aborted || e.abort(n.signal.reason ?? "parent-aborted");
    }, { once: !0 }));
    const i = new Ps(e);
    d(this, Ye) && Cm(d(this, Ye), i);
    const r = n.broadcast ?? game.user.isGM, a = n.commit ?? game.user.isGM, o = n.startEpochMS ?? Date.now();
    r && d(this, Ye) && Kr(Zu, {
      name: d(this, Ye),
      data: this.toJSON(),
      startEpochMS: o
    });
    const s = new Rs(), l = {
      signal: i.signal,
      commit: a,
      startEpochMS: o,
      eventBus: s,
      errors: [],
      detachedPromises: []
    };
    return h(this, ne, id).call(this, i, l).then((u) => {
      var f, g, m;
      s.destroy(), i._resolve(u), u.status === an.COMPLETED ? (f = d(this, dr)) == null || f.call(this) : u.status === an.CANCELLED ? ((g = d(this, fr)) == null || g.call(this), r && d(this, Ye) && Kr(Fs, {
        name: d(this, Ye),
        reason: u.reason
      })) : ((m = d(this, hr)) == null || m.call(this, u), r && d(this, Ye) && Kr(Fs, {
        name: d(this, Ye),
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
    h(this, ne, Vt).call(this);
    const e = { timeline: h(i = Wt, In, qs).call(i, d(this, Lt)) };
    return d(this, Ye) && (e.name = d(this, Ye)), d(this, Pe) !== De.ABORT && (e.errorPolicy = d(this, Pe)), e;
  }
};
Ye = new WeakMap(), Pe = new WeakMap(), Lt = new WeakMap(), hn = new WeakMap(), ur = new WeakMap(), dr = new WeakMap(), fr = new WeakMap(), hr = new WeakMap(), In = new WeakSet(), qs = /* @__PURE__ */ c(function(n) {
  const e = [];
  for (const i of n)
    if (i.kind === "delay")
      e.push({ delay: i.ms });
    else if (i.kind === "await")
      e.push({ await: i.config });
    else if (i.kind === "emit")
      e.push({ emit: i.signal });
    else if (i.kind === "parallel")
      e.push({
        parallel: {
          branches: i.branches.map((r) => {
            var a;
            return h(a = Wt, In, qs).call(a, r);
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
      e.push(r);
    }
  return e;
}, "#serializeSegments"), ne = new WeakSet(), // ── Private ─────────────────────────────────────────────────────────
Vt = /* @__PURE__ */ c(function() {
  d(this, hn) && (d(this, Lt).push({ kind: "step", data: d(this, hn)._finalize() }), A(this, hn, null));
}, "#finalizeCurrentStep"), Bs = /* @__PURE__ */ c(function(n) {
  n.length !== 0 && Promise.allSettled(n).catch(() => {
  });
}, "#drainDetached"), id = /* @__PURE__ */ c(async function(n, e) {
  var i, r;
  try {
    if (e.signal.aborted) return h(this, ne, ft).call(this, e.signal.reason);
    const a = await h(this, ne, Yr).call(this, d(this, ur), wt.BEFORE_ALL, null);
    if (a) {
      if (d(this, Pe) === De.ABORT) return a;
      e.errors.push(a);
    }
    const o = await h(this, ne, js).call(this, d(this, Lt), e);
    if (o)
      return h(i = Wt, In, Bs).call(i, e.detachedPromises), o;
    if (!e.signal.aborted) {
      const s = await Promise.allSettled(e.detachedPromises);
      for (const l of s)
        if (l.status === "rejected") {
          const u = h(this, ne, Ft).call(this, l.reason, wt.ENTRY);
          if (d(this, Pe) === De.ABORT) return u;
          e.errors.push(u);
        }
    }
    return e.signal.aborted ? h(this, ne, ft).call(this, e.signal.reason) : {
      status: an.COMPLETED,
      ...e.errors.length > 0 ? { errors: e.errors } : {}
    };
  } catch (a) {
    return h(r = Wt, In, Bs).call(r, e.detachedPromises), e.signal.aborted ? h(this, ne, ft).call(this, e.signal.reason) : (console.error("TweenTimeline execution error:", a), h(this, ne, Ft).call(this, a, wt.RUNTIME));
  }
}, "#execute"), js = /* @__PURE__ */ c(async function(n, e) {
  let i = -1, r = 0;
  for (const a of n) {
    if (e.signal.aborted) return h(this, ne, ft).call(this, e.signal.reason);
    if (a.kind === "delay") {
      try {
        await fc(a.ms, e.signal);
      } catch {
        return h(this, ne, ft).call(this, e.signal.reason);
      }
      r += a.ms;
      continue;
    }
    if (a.kind === "await") {
      try {
        let b = Tm(a.config, {
          signal: e.signal,
          eventBus: e.eventBus
        });
        const p = a.config.timeout;
        typeof p == "number" && p > 0 && (b = Promise.race([
          b,
          fc(p, e.signal)
        ])), await b;
      } catch (b) {
        if (e.signal.aborted) return h(this, ne, ft).call(this, e.signal.reason);
        const p = h(this, ne, Ft).call(this, b, wt.AWAIT);
        if (d(this, Pe) === De.ABORT) return p;
        e.errors.push(p);
      }
      continue;
    }
    if (a.kind === "emit") {
      try {
        e.eventBus.emit(a.signal);
      } catch (b) {
        const p = h(this, ne, Ft).call(this, b, wt.EMIT);
        if (d(this, Pe) === De.ABORT) return p;
        e.errors.push(p);
      }
      continue;
    }
    if (a.kind === "parallel") {
      const b = await h(this, ne, rd).call(this, a, e);
      if (b) return b;
      continue;
    }
    i += 1;
    const { entries: o, before: s, after: l } = a.data, u = await h(this, ne, Yr).call(this, s, wt.BEFORE_STEP, i);
    if (u) {
      if (d(this, Pe) === De.ABORT) return u;
      e.errors.push(u);
      continue;
    }
    if (e.signal.aborted) return h(this, ne, ft).call(this, e.signal.reason);
    const f = [];
    let g = 0;
    for (const b of o) {
      const p = Cr(b.type);
      if (!p) {
        const M = h(this, ne, Ft).call(this, new Error(`TweenTimeline: unknown tween type "${b.type}"`), wt.ENTRY, i, b.type);
        if (d(this, Pe) === De.ABORT) return M;
        e.errors.push(M), console.warn(M.error.message);
        continue;
      }
      const E = {
        ...b.opts,
        commit: e.commit,
        startEpochMS: e.startEpochMS + r,
        signal: e.signal
      }, T = E.durationMS ?? 2e3, I = Promise.resolve().then(() => p.execute(b.params, E)).then((M) => M === !1 ? {
        ok: !1,
        failure: h(this, ne, Ft).call(this, new Error("Tween entry returned false."), wt.ENTRY, i, b.type)
      } : { ok: !0 }).catch((M) => ({
        ok: !1,
        failure: h(this, ne, Ft).call(this, M, wt.ENTRY, i, b.type)
      }));
      b.detach ? e.detachedPromises.push(I) : (f.push(I), g = Math.max(g, T));
    }
    const m = await h(this, ne, ad).call(this, f, e.signal);
    if (m === null) return h(this, ne, ft).call(this, e.signal.reason);
    for (const b of m)
      if (!b.ok) {
        if (d(this, Pe) === De.ABORT) return b.failure;
        e.errors.push(b.failure), console.warn("TweenTimeline: entry failed:", b.failure.error);
      }
    const y = await h(this, ne, Yr).call(this, l, wt.AFTER_STEP, i);
    if (y) {
      if (d(this, Pe) === De.ABORT) return y;
      e.errors.push(y);
    }
    if (e.signal.aborted) return h(this, ne, ft).call(this, e.signal.reason);
    r += g;
  }
  return null;
}, "#executeSegments"), rd = /* @__PURE__ */ c(async function(n, e) {
  const { branches: i, join: r, overflow: a } = n, o = i.length, s = r === "all" ? o : r === "any" ? 1 : r, l = i.map(() => {
    const y = new AbortController();
    return e.signal.aborted ? y.abort(e.signal.reason ?? "parent-aborted") : e.signal.addEventListener("abort", () => {
      y.signal.aborted || y.abort(e.signal.reason ?? "parent-aborted");
    }, { once: !0 }), y;
  });
  let u = 0, f = 0;
  const g = new Array(o).fill(null);
  let m;
  return new Promise((y) => {
    let b = !1;
    const p = /* @__PURE__ */ c(() => {
      if (b) return;
      if (u >= s) {
        b = !0, E(), y(null);
        return;
      }
      const T = o - u - f;
      if (u + T < s) {
        b = !0, E();
        const I = g.filter(($) => $ && $.status === an.FAILED).map(($) => $), M = h(this, ne, Ft).call(this, new Error(`parallel: join target ${s} impossible (${u} completed, ${f} failed)`), wt.PARALLEL);
        d(this, Pe) === De.ABORT ? y(M) : (e.errors.push(M), e.errors.push(...I), y(null));
      }
    }, "checkJoin"), E = /* @__PURE__ */ c(() => {
      if (a === "cancel")
        for (let T = 0; T < o; T++)
          !g[T] && !l[T].signal.aborted && l[T].abort("overflow-cancel");
      for (let T = 0; T < o; T++)
        g[T] || e.detachedPromises.push(m[T]);
    }, "applyOverflow");
    if (m = i.map((T, I) => {
      const M = {
        signal: l[I].signal,
        commit: e.commit,
        startEpochMS: e.startEpochMS,
        eventBus: e.eventBus,
        // shared
        errors: e.errors,
        // shared
        detachedPromises: e.detachedPromises
        // shared
      };
      return h(this, ne, js).call(this, T, M).then(($) => {
        if ($)
          if ($.status === an.CANCELLED) {
            if (l[I].signal.aborted) {
              g[I] = $;
              return;
            }
            g[I] = $, f++;
          } else
            g[I] = $, f++;
        else
          g[I] = { status: an.COMPLETED }, u++;
        p();
      });
    }), e.signal.aborted) {
      b = !0, y(h(this, ne, ft).call(this, e.signal.reason));
      return;
    }
    e.signal.addEventListener("abort", () => {
      b || (b = !0, y(h(this, ne, ft).call(this, e.signal.reason)));
    }, { once: !0 });
  });
}, "#executeParallel"), /**
 * @param {Array<Promise<{ok: boolean, failure?: object}>>} stepPromises
 * @param {AbortSignal} signal
 * @returns {Promise<Array<{ok: boolean, failure?: object}>|null>}
 */
ad = /* @__PURE__ */ c(function(n, e) {
  return n.length === 0 ? Promise.resolve([]) : e.aborted ? Promise.resolve(null) : new Promise((i, r) => {
    const a = /* @__PURE__ */ c(() => i(null), "onAbort");
    e.addEventListener("abort", a, { once: !0 }), Promise.all(n).then((o) => {
      e.removeEventListener("abort", a), i(o);
    }).catch((o) => {
      e.removeEventListener("abort", a), r(o);
    });
  });
}, "#waitForStep"), Yr = /* @__PURE__ */ c(async function(n, e, i) {
  if (!n) return null;
  try {
    return await n(), null;
  } catch (r) {
    const a = h(this, ne, Ft).call(this, r, e, i ?? void 0);
    return d(this, Pe) === De.CONTINUE && console.warn(`TweenTimeline: hook failure in ${e}:`, r), a;
  }
}, "#runHook"), /** @param {unknown} reason */
ft = /* @__PURE__ */ c(function(n) {
  let e;
  return typeof n == "string" ? e = n : n instanceof Error && (e = n.message), {
    status: an.CANCELLED,
    ...e ? { reason: e } : {}
  };
}, "#cancelledOutcome"), /**
 * @param {unknown} err
 * @param {string} phase
 * @param {number} [stepIndex]
 * @param {string} [entryType]
 */
Ft = /* @__PURE__ */ c(function(n, e, i, r) {
  const a = n instanceof Error ? n : new Error(String(n));
  return {
    status: an.FAILED,
    error: a,
    phase: e,
    ...typeof i == "number" ? { stepIndex: i } : {},
    ...r ? { entryType: r } : {}
  };
}, "#failedOutcome"), x(Wt, In), c(Wt, "TweenTimeline");
let ba = Wt;
function Sl(t) {
  if (!t || typeof t != "object")
    throw new Error("Sequence JSON: data must be an object.");
  if (!Array.isArray(t.timeline))
    throw new Error("Sequence JSON: 'timeline' must be an array.");
  if (t.name != null && typeof t.name != "string")
    throw new Error("Sequence JSON: 'name' must be a string.");
  if (t.errorPolicy != null && t.errorPolicy !== De.ABORT && t.errorPolicy !== De.CONTINUE)
    throw new Error(`Sequence JSON: 'errorPolicy' must be "abort" or "continue".`);
  od(t.timeline, "timeline", 0);
}
c(Sl, "validateSequenceJSON");
function od(t, n, e = 0) {
  for (let i = 0; i < t.length; i++) {
    const r = t[i], a = `${n}[${i}]`;
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
      if (e >= 8)
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
        const f = o.branches[u];
        if (!Array.isArray(f))
          throw new Error(`Sequence JSON: ${a}.parallel.branches[${u}] must be an array.`);
        od(f, `${a}.parallel.branches[${u}]`, e + 1);
      }
      continue;
    }
    throw new Error(`Sequence JSON: ${a} is not a recognized segment (step array, delay, await, emit, or parallel).`);
  }
}
c(od, "validateSegmentsJSON");
function sd(t) {
  Sl(t), ld(t.timeline, "timeline");
}
c(sd, "validateSequenceSemantics");
function ld(t, n) {
  for (let e = 0; e < t.length; e++) {
    const i = t[e], r = `${n}[${e}]`;
    if (Array.isArray(i))
      for (let a = 0; a < i.length; a++) {
        const o = i[a];
        try {
          am(o.type, o.params ?? {});
        } catch (s) {
          throw new Error(`Sequence JSON: ${r}[${a}] failed semantic validation: ${s.message}`);
        }
      }
    else if (i.parallel)
      for (let a = 0; a < i.parallel.branches.length; a++)
        ld(i.parallel.branches[a], `${r}.parallel.branches[${a}]`);
  }
}
c(ld, "validateSegmentsSemantics");
function Ll(t, n = {}) {
  Sl(t), n.validateSemantics && sd(t);
  const e = new ba();
  return t.name && e.name(t.name), t.errorPolicy && e.errorPolicy(t.errorPolicy), cd(t.timeline, e), e;
}
c(Ll, "compileSequence");
function cd(t, n) {
  for (const e of t) {
    if (Array.isArray(e)) {
      const i = n.step();
      for (const r of e)
        i.add(r.type, r.params ?? {}, r.opts), r.detach && i.detach();
      continue;
    }
    if (e.delay !== void 0) {
      n.delay(e.delay);
      continue;
    }
    if (e.await !== void 0) {
      n.await(e.await);
      continue;
    }
    if (e.emit !== void 0) {
      n.emit(e.emit);
      continue;
    }
    if (e.parallel !== void 0) {
      const i = e.parallel, r = i.branches.map((a) => (o) => cd(a, o));
      n.parallel(r, {
        join: i.join ?? "all",
        overflow: i.overflow ?? "detach"
      });
    }
  }
}
c(cd, "compileSegments");
function Lm(t) {
  Sl(t), sd(t);
}
c(Lm, "validate$1");
async function Im(t, n = {}) {
  return Ll(t, { validateSemantics: !0 }).run({
    broadcast: !1,
    commit: n.commit,
    startEpochMS: n.startEpochMS,
    signal: n.signal
  }).finished;
}
c(Im, "execute$1");
function Om() {
  Zt({ type: "sequence", execute: Im, validate: Lm });
}
c(Om, "registerSequenceTween");
function Am(t) {
  if (t.x == null && t.y == null && t.scale == null)
    throw new Error("camera-pan tween: at least one of 'x', 'y', or 'scale' is required.");
  if (t.x != null && typeof t.x != "number")
    throw new Error("camera-pan tween: 'x' must be a number.");
  if (t.y != null && typeof t.y != "number")
    throw new Error("camera-pan tween: 'y' must be a number.");
  if (t.scale != null && (typeof t.scale != "number" || t.scale <= 0))
    throw new Error("camera-pan tween: 'scale' must be a positive number.");
}
c(Am, "validate");
async function Mm(t, n = {}) {
  const {
    durationMS: e = 2e3,
    startEpochMS: i = null,
    signal: r = null
  } = n;
  if (r != null && r.aborted) return !1;
  const a = typeof i == "number" ? Math.max(0, Math.min(e, Date.now() - i)) : 0, o = Math.max(0, e - a), s = { duration: o };
  if (t.x != null && (s.x = t.x), t.y != null && (s.y = t.y), t.scale != null && (s.scale = t.scale), o <= 0)
    return await canvas.animatePan({ ...s, duration: 0 }), !0;
  const l = canvas.animatePan(s);
  return r ? new Promise((u) => {
    const f = /* @__PURE__ */ c(() => {
      u(!1);
    }, "onAbort");
    r.addEventListener("abort", f, { once: !0 }), l.then(() => {
      r.removeEventListener("abort", f), u(!r.aborted);
    }).catch(() => {
      r.removeEventListener("abort", f), u(!1);
    });
  }) : (await l, !0);
}
c(Mm, "execute");
function Nm() {
  Zt({ type: "camera-pan", execute: Mm, validate: Am });
}
c(Nm, "registerCameraPanTween");
async function km(t, n, e = {}) {
  if (!game.user.isGM)
    return ui.notifications.warn("Only the GM can dispatch tweens."), !1;
  const i = Cr(t);
  if (!i)
    throw new Error(`Unknown tween type: "${t}". Registered types: ${Ds().join(", ")}`);
  i.validate(n);
  const { durationMS: r = 2e3, easing: a = "easeInOutCosine", commit: o = !0 } = e, s = Date.now();
  return Kr(Xu, {
    type: t,
    params: n,
    durationMS: r,
    easing: a,
    startEpochMS: s,
    commit: !1
  }), i.execute(n, { durationMS: r, easing: a, commit: o, startEpochMS: s });
}
c(km, "dispatchTween");
function xm(t) {
  const { type: n, params: e, durationMS: i, easing: r, startEpochMS: a, commit: o } = t ?? {}, s = Cr(n);
  if (!s) {
    console.warn(`[${L}] Received unknown tween type over socket: "${n}"`);
    return;
  }
  s.execute(e, {
    durationMS: i,
    easing: r,
    commit: o ?? !1,
    startEpochMS: a
  });
}
c(xm, "handleTweenSocketMessage");
gm();
ym();
bm();
Em();
Om();
Nm();
Zt({ type: "token-prop", execute: mo, validate: go });
Zt({ type: "drawing-prop", execute: mo, validate: go });
Zt({ type: "sound-prop", execute: mo, validate: go });
Cl(Xu, xm);
Cl(Zu, $m);
Cl(Fs, Fm);
function $m(t) {
  const { data: n, startEpochMS: e } = t ?? {};
  if (!n) {
    console.warn(`[${L}] Received empty tween-sequence socket message.`);
    return;
  }
  try {
    Ll(n, { validateSemantics: !0 }).run({ commit: !1, startEpochMS: e, broadcast: !1 });
  } catch (i) {
    console.error(`[${L}] Failed to run received tween sequence:`, i);
  }
}
c($m, "handleSequenceSocketMessage");
function Fm(t) {
  const { name: n } = t ?? {};
  n && nd(n);
}
c(Fm, "handleSequenceCancelMessage");
function Dm() {
  Hooks.once("ready", () => {
    rm();
    const t = game.modules.get(L);
    t.api || (t.api = {}), t.api.tween = {
      dispatch: km,
      types: Ds,
      Timeline: ba,
      ErrorPolicy: De,
      compileSequence: Ll,
      cancelTimeline: nd,
      getTimeline: Sm
    }, console.log(`[${L}] Tween API registered. Types: ${Ds().join(", ")}`);
  });
}
c(Dm, "registerTweenHooks");
Dm();
const _m = ["tag", "tag-all", "id", "tags-any", "tags-all"], Pm = /* @__PURE__ */ new Set(["tags-any", "tags-all"]);
function Il(t) {
  if (!t || typeof t != "string")
    return { type: "unknown", value: t ?? "" };
  if (t.startsWith("$"))
    return { type: "special", value: t };
  for (const n of _m)
    if (t.startsWith(`${n}:`)) {
      const e = t.slice(n.length + 1), i = Pm.has(n) ? e.split(",").map((r) => r.trim()) : e;
      return { type: n, value: i };
    }
  return t.includes(".") ? { type: "uuid", value: t } : { type: "unknown", value: t };
}
c(Il, "parseSelector");
function Rm(t) {
  if (!t) return "";
  const { type: n, value: e } = t;
  if (n === "special" || n === "uuid" || n === "unknown")
    return Array.isArray(e) ? e.join(",") : e ?? "";
  const i = Array.isArray(e) ? e.join(",") : e ?? "";
  return `${n}:${i}`;
}
c(Rm, "buildSelector");
function ud(t, n = "first") {
  return t != null && t.length ? t.length === 1 ? n === "first-all" || n === "all" ? `tag-all:${t[0]}` : `tag:${t[0]}` : n === "any" ? `tags-any:${t.join(",")}` : n === "all" ? `tags-all:${t.join(",")}` : n === "first-all" ? `tags-all:${t.join(",")}` : `tags-any:${t.join(",")}` : "";
}
c(ud, "buildTagSelector");
function yo(t) {
  if (!t) return null;
  if (t.documentName || t._source !== void 0) {
    const n = t.object;
    return n ? { placeable: n, doc: t } : null;
  }
  return t.document ? { placeable: t, doc: t.document } : null;
}
c(yo, "normalizePlaceable");
function dd() {
  var t;
  return window.Tagger ?? ((t = game.modules.get("tagger")) == null ? void 0 : t.api) ?? null;
}
c(dd, "getTaggerAPI");
function bo(t, n) {
  if (!t) return null;
  const e = n ?? canvas.scene;
  if (!e) return null;
  const i = Il(t);
  switch (i.type) {
    case "special":
      return Hm(i.value);
    case "tag":
      return hc(i.value, e, !1);
    case "tag-all":
      return hc(i.value, e, !0);
    case "id":
      return qm(i.value, e);
    case "tags-any":
      return gc(i.value, e, !0);
    case "tags-all":
      return gc(i.value, e, !1);
    case "uuid":
      return Bm(i.value);
    default:
      return null;
  }
}
c(bo, "resolveSelector");
function Hm(t) {
  var n;
  if (t === "$particles") {
    if (!((n = game.modules.get("fxmaster")) != null && n.active))
      return console.warn(`[${L}] Picker: FXMaster not active, cannot resolve "$particles".`), null;
    const e = canvas.particleeffects;
    return e ? { kind: "particles", documents: [], placeables: [], target: e } : null;
  }
  return null;
}
c(Hm, "resolveSpecial");
function hc(t, n, e) {
  const i = dd();
  if (!i)
    return console.warn(`[${L}] Picker: Tagger not available, cannot resolve tag "${t}".`), null;
  const r = i.getByTag(t, { sceneId: n.id });
  if (!(r != null && r.length)) return null;
  const a = e ? r : [r[0]], o = [];
  for (const s of a) {
    const l = yo(s);
    l && o.push(l);
  }
  return o.length === 0 ? null : {
    kind: e ? "multi-placeable" : "placeable",
    documents: o.map((s) => s.doc),
    placeables: o
  };
}
c(hc, "resolveTag");
function qm(t, n) {
  const e = [
    n.tiles,
    n.lights,
    n.tokens,
    n.drawings,
    n.sounds
  ];
  for (const i of e) {
    const r = i == null ? void 0 : i.get(t);
    if (r) {
      const a = yo(r);
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
c(qm, "resolveById");
function gc(t, n, e) {
  const i = dd();
  if (!i)
    return console.warn(`[${L}] Picker: Tagger not available, cannot resolve multi-tag.`), null;
  const r = i.getByTag(t, {
    sceneId: n.id,
    matchAny: e
  });
  if (!(r != null && r.length)) return null;
  const a = [];
  for (const o of r) {
    const s = yo(o);
    s && a.push(s);
  }
  return a.length === 0 ? null : {
    kind: a.length === 1 ? "placeable" : "multi-placeable",
    documents: a.map((o) => o.doc),
    placeables: a
  };
}
c(gc, "resolveMultiTag");
function Bm(t) {
  const n = fromUuidSync(t);
  if (!n) return null;
  const e = yo(n);
  return e ? {
    kind: "placeable",
    documents: [e.doc],
    placeables: [e]
  } : null;
}
c(Bm, "resolveUUID");
function jm(t) {
  var n;
  if (!t) return null;
  if (t.kind === "particles")
    return { kind: "particles", target: t.target };
  if (t.kind === "multi-placeable")
    return { kind: "multi-placeable", placeables: t.placeables };
  if ((n = t.placeables) != null && n.length) {
    const e = t.placeables[0];
    return { kind: "placeable", placeable: e.placeable, doc: e.doc };
  }
  return null;
}
c(jm, "adaptResolved");
function wa(t) {
  const n = /* @__PURE__ */ new Set();
  if (t.setup)
    for (const r of Object.keys(t.setup)) n.add(r);
  if (t.landing)
    for (const r of Object.keys(t.landing)) n.add(r);
  t.timeline && hd(t.timeline, n);
  const e = /* @__PURE__ */ new Map(), i = [];
  for (const r of n) {
    const a = bo(r), o = jm(a);
    o ? e.set(r, o) : i.push(r);
  }
  return i.length && console.warn(`[${L}] Cinematic: ${i.length} unresolved target(s): ${i.join(", ")}`), { targets: e, unresolved: i };
}
c(wa, "resolveAllTargets");
function Um(t, n) {
  if (!t) return {};
  const e = {};
  for (const [i, r] of Object.entries(t)) {
    const a = n.get(i);
    if (a)
      if (a.kind === "particles") {
        if (a.target.destroyed) continue;
        const o = {};
        for (const s of Object.keys(r))
          o[s] = a.target[s];
        e[i] = o;
      } else if (a.kind === "multi-placeable") {
        const o = a.placeables[0];
        if (!(o != null && o.doc)) continue;
        const s = {};
        for (const l of Object.keys(r))
          s[l] = foundry.utils.getProperty(o.doc._source, l);
        e[i] = s;
      } else {
        if (!a.doc) continue;
        const o = {};
        for (const s of Object.keys(r))
          o[s] = foundry.utils.getProperty(a.doc._source, s);
        e[i] = o;
      }
  }
  return e;
}
c(Um, "captureSnapshot");
function Vm(t) {
  const n = {};
  function e(i) {
    if (i)
      for (const [r, a] of Object.entries(i))
        n[r] || (n[r] = {}), Object.assign(n[r], a);
  }
  return c(e, "mergeMap"), e(t.setup), e(t.landing), t.timeline && fd(t.timeline, n, e), n;
}
c(Vm, "gatherAllStateMaps");
function fd(t, n, e) {
  var i;
  for (const r of t)
    if (!(r.delay != null || r.await != null || r.emit != null) && !(r.transitionTo != null || r.sound != null || r.stopSound != null)) {
      if ((i = r.parallel) != null && i.branches) {
        for (const a of r.parallel.branches)
          fd(a, n, e);
        continue;
      }
      if (e(r.before), e(r.after), r.tweens)
        for (const a of r.tweens)
          a.target && a.attribute && (n[a.target] || (n[a.target] = {}), n[a.target][a.attribute] = "__snapshot__");
    }
}
c(fd, "gatherFromEntries");
function hd(t, n) {
  for (const e of t)
    if (e.delay == null && e.await == null && e.emit == null && e.transitionTo == null && e.sound == null && e.stopSound == null) {
      if (e.parallel) {
        const i = e.parallel;
        if (i.branches)
          for (const r of i.branches)
            hd(r, n);
        continue;
      }
      if (e.before)
        for (const i of Object.keys(e.before)) n.add(i);
      if (e.after)
        for (const i of Object.keys(e.after)) n.add(i);
      if (e.tweens)
        for (const i of e.tweens)
          i.target && n.add(i.target);
    }
}
c(hd, "collectSelectorsFromEntries");
const mc = {
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
}, zm = /* @__PURE__ */ new Set([
  "alpha",
  "visible",
  "x",
  "y",
  "scale",
  "rotation"
]);
function _o(t, n, e) {
  const i = {};
  for (const [r, a] of Object.entries(t))
    n.has(r) ? i[r] = a : console.warn(`[${L}] Cinematic: blocked property "${r}" on ${e}.`);
  return i;
}
c(_o, "filterOverrides");
function st(t, n) {
  var i, r;
  if (!t) return;
  const e = [];
  for (const [a, o] of Object.entries(t)) {
    const s = n.get(a);
    if (s)
      if (s.kind === "particles") {
        if (s.target.destroyed) continue;
        const l = _o(o, zm, "$particles");
        for (const [u, f] of Object.entries(l))
          s.target[u] = f;
      } else if (s.kind === "multi-placeable")
        for (const { placeable: l, doc: u } of s.placeables) {
          if (!(u != null && u.parent) || !(l != null && l.scene)) continue;
          const f = u.documentName, g = mc[f];
          if (!g) {
            console.warn(`[${L}] Cinematic: no allowlist for document type "${f}" on "${a}", skipping.`);
            continue;
          }
          const m = _o(o, g, `${f} "${a}"`);
          u.updateSource(m), e.push(l);
        }
      else {
        if (!((i = s.doc) != null && i.parent) || !((r = s.placeable) != null && r.scene)) continue;
        const l = s.doc.documentName, u = mc[l];
        if (!u) {
          console.warn(`[${L}] Cinematic: no allowlist for document type "${l}" on "${a}", skipping.`);
          continue;
        }
        const f = _o(o, u, `${l} "${a}"`);
        s.doc.updateSource(f), e.push(s.placeable);
      }
  }
  for (const a of e)
    a.refresh();
}
c(st, "applyState");
function mi(t, n) {
  var e;
  if (t)
    for (const i of Object.keys(t)) {
      const r = n.get(i);
      if ((r == null ? void 0 : r.kind) === "placeable" && ((e = r.doc) == null ? void 0 : e.documentName) === "AmbientLight") {
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
c(mi, "refreshPerceptionIfNeeded");
const Gm = {
  "tile-prop": /* @__PURE__ */ new Set(["uuid", "attribute", "value"]),
  "light-color": /* @__PURE__ */ new Set(["uuid", "toColor", "toAlpha", "mode"]),
  "light-state": /* @__PURE__ */ new Set(["uuid", "enabled"]),
  "particles-prop": /* @__PURE__ */ new Set(["attribute", "value"]),
  "camera-pan": /* @__PURE__ */ new Set(["x", "y", "scale"]),
  "token-prop": /* @__PURE__ */ new Set(["uuid", "attribute", "value"]),
  "drawing-prop": /* @__PURE__ */ new Set(["uuid", "attribute", "value"]),
  "sound-prop": /* @__PURE__ */ new Set(["uuid", "attribute", "value"])
}, Wm = /* @__PURE__ */ new Set(["duration", "easing", "detach"]), Jm = /* @__PURE__ */ new Set(["type", "target"]);
function gd(t, n) {
  const { type: e, target: i, detach: r = !1, ...a } = t;
  if (!e)
    return console.warn(`[${L}] Cinematic: tween entry missing 'type', skipping.`), null;
  const o = {}, s = {}, l = Gm[e];
  if (i === "$particles")
    o.target = "$particles";
  else if (i) {
    const u = n.get(i);
    if (!u) return null;
    u.kind === "multi-placeable" ? o.uuid = u.placeables.map((f) => f.doc.uuid) : o.uuid = u.doc.uuid;
  }
  for (const [u, f] of Object.entries(a))
    Jm.has(u) || (u === "duration" ? s.durationMS = f : Wm.has(u) ? s[u] = f : (l != null && l.has(u), o[u] = f));
  return { type: e, params: o, opts: s, detach: r };
}
c(gd, "compileTween");
const Qi = /* @__PURE__ */ new Map();
let Km = 0;
async function Ym(t) {
  var u, f, g, m, y;
  const { id: n, src: e, volume: i = 0.8, loop: r = !1, fadeIn: a } = t;
  if (!e) {
    console.warn(`[${L}] Cinematic sound: missing 'src', skipping.`);
    return;
  }
  const o = n || `__auto_${++Km}`, s = {
    src: e,
    autoplay: !0,
    loop: r,
    volume: i
  };
  let l = null;
  try {
    typeof ((f = (u = foundry == null ? void 0 : foundry.audio) == null ? void 0 : u.AudioHelper) == null ? void 0 : f.play) == "function" ? l = await foundry.audio.AudioHelper.play(s, !1) : typeof ((m = (g = game == null ? void 0 : game.audio) == null ? void 0 : g.constructor) == null ? void 0 : m.play) == "function" ? l = await game.audio.constructor.play(s, !1) : typeof ((y = game == null ? void 0 : game.audio) == null ? void 0 : y.play) == "function" && (l = await game.audio.play(s, !1));
  } catch (b) {
    console.error(`[${L}] Cinematic sound: failed to play "${e}":`, b);
    return;
  }
  if (!l) {
    console.warn(`[${L}] Cinematic sound: audio helper unavailable for "${e}".`);
    return;
  }
  a && a > 0 && l.fade && l.fade(i, { duration: a, from: 0 }), Qi.set(o, { sound: l, config: t }), console.log(`[${L}] Cinematic sound: playing "${e}" as "${o}" (loop=${r}, vol=${i})`);
}
c(Ym, "playLocalSound");
function Po(t) {
  var i, r;
  const n = Qi.get(t);
  if (!n) {
    console.warn(`[${L}] Cinematic sound: no active sound with id "${t}".`);
    return;
  }
  const e = n.config.fadeOut;
  try {
    e && e > 0 && n.sound.fade ? n.sound.fade(0, { duration: e }).then(() => {
      var a, o;
      return (o = (a = n.sound).stop) == null ? void 0 : o.call(a);
    }) : (r = (i = n.sound).stop) == null || r.call(i);
  } catch (a) {
    console.warn(`[${L}] Cinematic sound: error stopping "${t}":`, a);
  }
  Qi.delete(t);
}
c(Po, "stopCinematicSound");
function Ro() {
  var t, n;
  for (const [e, i] of Qi)
    try {
      (n = (t = i.sound).stop) == null || n.call(t);
    } catch (r) {
      console.warn(`[${L}] Cinematic sound: error stopping "${e}" during cleanup:`, r);
    }
  Qi.clear();
}
c(Ro, "stopAllCinematicSounds");
function Qm(t, n, e, i = {}) {
  const { skipToStep: r, onStepComplete: a, timelineName: o } = i, s = new e().name(o ?? `cinematic-${canvas.scene.id}`);
  s.beforeAll(() => {
    var u;
    try {
      st(t.setup, n), canvas.perception.update({ refreshLighting: !0, refreshVision: !0 });
    } catch (f) {
      throw console.error(`[${L}] Cinematic: error in beforeAll (setup state) on scene ${(u = canvas.scene) == null ? void 0 : u.id}:`, f), f;
    }
  });
  const l = { transitionTo: null };
  return pd(t.timeline, s, n, { skipToStep: r, onStepComplete: a, meta: l }), { tl: s, transitionTo: l.transitionTo };
}
c(Qm, "buildTimeline");
function md(t, n) {
  var e;
  if (t)
    for (const i of t)
      for (const r of i) {
        if (r.before)
          try {
            st(r.before, n), mi(r.before, n);
          } catch (a) {
            console.warn(`[${L}] Cinematic: error in skipped parallel before:`, a);
          }
        if (r.after)
          try {
            st(r.after, n), mi(r.after, n);
          } catch (a) {
            console.warn(`[${L}] Cinematic: error in skipped parallel after:`, a);
          }
        (e = r.parallel) != null && e.branches && md(r.parallel.branches, n);
      }
}
c(md, "applyParallelStatesForSkip");
function pd(t, n, e, i = {}) {
  const { skipToStep: r, onStepComplete: a, meta: o } = i;
  let s = -1;
  for (const l of t) {
    if (l.transitionTo != null) {
      if (r != null && s < r) continue;
      o && (o.transitionTo = l.transitionTo), n.step();
      break;
    }
    if (l.sound != null) {
      if (r != null && s < r) continue;
      const g = l.sound, { duration: m, loop: y, fireAndForget: b } = g, p = n.step();
      if (p.before(() => {
        Ym(g);
      }), m && m > 0)
        if (b) {
          if (y && g.id) {
            const E = g.id, T = m;
            p.before(() => {
              setTimeout(() => Po(E), T);
            });
          }
        } else
          n.delay(m), y && n.step().before(() => {
            Po(g.id);
          });
      continue;
    }
    if (l.stopSound != null) {
      if (r != null && s < r) continue;
      const g = l.stopSound;
      n.step().before(() => {
        Po(g);
      });
      continue;
    }
    if (l.delay != null) {
      if (r != null && s < r) continue;
      n.delay(l.delay);
      continue;
    }
    if (l.await != null) {
      if (r != null && s < r) continue;
      n.await(l.await);
      continue;
    }
    if (l.emit != null) {
      if (r != null && s < r) continue;
      n.emit(l.emit);
      continue;
    }
    if (l.parallel) {
      if (r != null && s < r) {
        md(l.parallel.branches, e);
        continue;
      }
      const g = l.parallel, m = g.branches.map((y) => (b) => pd(y, b, e));
      n.parallel(m, {
        join: g.join ?? "all",
        overflow: g.overflow ?? "detach"
      });
      continue;
    }
    if (!l.tweens || !Array.isArray(l.tweens)) {
      console.warn(`[${L}] Cinematic: timeline entry has no tweens array, skipping.`);
      continue;
    }
    if (s++, r != null && s < r) {
      if (l.before)
        try {
          st(l.before, e), mi(l.before, e);
        } catch (g) {
          console.warn(`[${L}] Cinematic: error applying skipped step.before:`, g);
        }
      if (l.after)
        try {
          st(l.after, e), mi(l.after, e);
        } catch (g) {
          console.warn(`[${L}] Cinematic: error applying skipped step.after:`, g);
        }
      continue;
    }
    const u = s, f = n.step();
    l.before && f.before(() => {
      var g;
      try {
        st(l.before, e), mi(l.before, e);
      } catch (m) {
        throw console.error(`[${L}] Cinematic: error in step.before callback on scene ${(g = canvas.scene) == null ? void 0 : g.id}:`, m), m;
      }
    });
    for (const g of l.tweens) {
      const m = gd(g, e);
      m && (f.add(m.type, m.params, m.opts), m.detach && f.detach());
    }
    f.after(() => {
      var g;
      try {
        l.after && (st(l.after, e), mi(l.after, e)), a == null || a(u);
      } catch (m) {
        throw console.error(`[${L}] Cinematic: error in step.after callback on scene ${(g = canvas.scene) == null ? void 0 : g.id}:`, m), m;
      }
    });
  }
}
c(pd, "compileCinematicEntries");
function va(t, n, e) {
  if (t != null) {
    if (typeof t != "object" || Array.isArray(t)) {
      e.push({ path: n, level: "error", message: `Expected object, got ${Array.isArray(t) ? "array" : typeof t}` });
      return;
    }
    for (const [i, r] of Object.entries(t))
      (typeof r != "object" || r === null || Array.isArray(r)) && e.push({ path: `${n}["${i}"]`, level: "error", message: `Expected property overrides object, got ${Array.isArray(r) ? "array" : typeof r}` });
  }
}
c(va, "validateStateMap");
function yd(t, n, e, i) {
  var r;
  for (let a = 0; a < t.length; a++) {
    const o = t[a], s = `${n}[${a}]`;
    if (!(o.delay != null || o.await != null || o.emit != null) && !(o.transitionTo != null || o.sound != null || o.stopSound != null)) {
      if ((r = o.parallel) != null && r.branches) {
        for (let l = 0; l < o.parallel.branches.length; l++)
          yd(o.parallel.branches[l], `${s}.parallel.branches[${l}]`, e, i);
        continue;
      }
      if (va(o.before, `${s}.before`, i), va(o.after, `${s}.after`, i), o.tweens)
        for (let l = 0; l < o.tweens.length; l++) {
          const u = o.tweens[l], f = `${s}.tweens[${l}]`;
          if (!u.type) {
            i.push({ path: f, level: "error", message: "Missing 'type' field" });
            continue;
          }
          const g = Cr(u.type);
          if (!g) {
            i.push({ path: f, level: "error", message: `Unknown tween type: "${u.type}"` });
            continue;
          }
          if (e)
            try {
              const m = gd(u, e);
              m ? g.validate(m.params) : u.target && i.push({ path: f, level: "warn", message: `Target "${u.target}" could not be resolved for compilation` });
            } catch (m) {
              i.push({ path: f, level: "error", message: m.message });
            }
          e && u.target && !e.has(u.target) && i.push({ path: `${f}.target`, level: "warn", message: `Target "${u.target}" is not resolved` });
        }
    }
  }
}
c(yd, "validateEntries");
function Xm(t, n = null) {
  const e = [];
  return !t || typeof t != "object" ? (e.push({ path: "", level: "error", message: "Cinematic data is not an object" }), e) : (va(t.setup, "setup", e), va(t.landing, "landing", e), t.timeline && Array.isArray(t.timeline) && yd(t.timeline, "timeline", n, e), e);
}
c(Xm, "validateCinematicDeep");
const Ho = 3;
var Le, pt, It, eo, bd, Y, Te, ke, Dt;
const Ge = class Ge {
  constructor(n = null, { loadedHash: e = null, cinematicName: i = "default" } = {}) {
    x(this, Y);
    x(this, Le);
    x(this, pt);
    x(this, It);
    A(this, Le, n ?? Ge.empty()), A(this, pt, i), A(this, It, e);
  }
  static empty() {
    return {
      version: Ho,
      cinematics: {
        default: Ge.emptyCinematic()
      }
    };
  }
  static emptyCinematic() {
    return { trigger: "canvasReady", tracking: !0, setup: {}, landing: {}, timeline: [] };
  }
  static fromScene(n, e = "default") {
    var o;
    const i = n == null ? void 0 : n.getFlag(L, "cinematic");
    let r = i ? foundry.utils.deepClone(i) : null;
    const a = i ? h(o = Ge, eo, bd).call(o, i) : null;
    if (r && (r.version ?? 1) < 3) {
      const { version: s, ...l } = r;
      r = { version: Ho, cinematics: { default: l } };
    }
    return new Ge(r, { loadedHash: a, cinematicName: e });
  }
  /**
   * Check if the scene's cinematic flag has been modified since this state was loaded.
   * @param {object} scene  The Foundry scene document
   * @returns {boolean} true if scene data differs from what was loaded
   */
  isStale(n) {
    if (!d(this, It)) return !1;
    const e = n == null ? void 0 : n.getFlag(L, "cinematic");
    return e ? !foundry.utils.objectsEqual(e, d(this, It)) : !1;
  }
  // ── Read ──────────────────────────────────────────────────────────────
  get data() {
    return d(this, Le);
  }
  get timeline() {
    return d(this, Y, Te).timeline;
  }
  get trigger() {
    return d(this, Y, Te).trigger;
  }
  get tracking() {
    return d(this, Y, Te).tracking;
  }
  get setup() {
    return d(this, Y, Te).setup;
  }
  get landing() {
    return d(this, Y, Te).landing;
  }
  get isEmpty() {
    var n;
    return !((n = d(this, Y, Te).timeline) != null && n.length);
  }
  get synchronized() {
    return d(this, Y, Te).synchronized ?? !1;
  }
  get activeCinematicName() {
    return d(this, pt);
  }
  // ── Multi-cinematic management ────────────────────────────────────────
  listCinematicNames() {
    return Object.keys(d(this, Le).cinematics);
  }
  switchCinematic(n) {
    return d(this, Le).cinematics[n] ? new Ge(foundry.utils.deepClone(d(this, Le)), {
      loadedHash: d(this, It),
      cinematicName: n
    }) : this;
  }
  addCinematic(n) {
    if (!n || d(this, Le).cinematics[n]) return this;
    const e = foundry.utils.deepClone(d(this, Le));
    return e.cinematics[n] = Ge.emptyCinematic(), new Ge(e, {
      loadedHash: d(this, It),
      cinematicName: n
    });
  }
  removeCinematic(n) {
    if (Object.keys(d(this, Le).cinematics).length <= 1) return this;
    if (!d(this, Le).cinematics[n]) return this;
    const i = foundry.utils.deepClone(d(this, Le));
    delete i.cinematics[n];
    const r = d(this, pt) === n ? Object.keys(i.cinematics)[0] : d(this, pt);
    return new Ge(i, {
      loadedHash: d(this, It),
      cinematicName: r
    });
  }
  renameCinematic(n, e) {
    if (!n || !e || n === e) return this;
    if (!d(this, Le).cinematics[n]) return this;
    if (d(this, Le).cinematics[e]) return this;
    const i = foundry.utils.deepClone(d(this, Le)), r = {};
    for (const [o, s] of Object.entries(i.cinematics))
      r[o === n ? e : o] = s;
    i.cinematics = r;
    const a = d(this, pt) === n ? e : d(this, pt);
    return new Ge(i, {
      loadedHash: d(this, It),
      cinematicName: a
    });
  }
  // ── Top-level mutations (scoped to active cinematic) ──────────────────
  setTrigger(n) {
    return h(this, Y, ke).call(this, { trigger: n });
  }
  setTracking(n) {
    return h(this, Y, ke).call(this, { tracking: n });
  }
  setSynchronized(n) {
    return h(this, Y, ke).call(this, { synchronized: n });
  }
  setSetup(n) {
    return h(this, Y, ke).call(this, { setup: n });
  }
  setLanding(n) {
    return h(this, Y, ke).call(this, { landing: n });
  }
  // ── Timeline entry mutations ──────────────────────────────────────────
  addStep(n = -1) {
    const e = [...d(this, Y, Te).timeline], i = { tweens: [] };
    return n < 0 || n >= e.length ? e.push(i) : e.splice(n, 0, i), h(this, Y, ke).call(this, { timeline: e });
  }
  addDelay(n = -1, e = 1e3) {
    const i = [...d(this, Y, Te).timeline], r = { delay: e };
    return n < 0 || n >= i.length ? i.push(r) : i.splice(n, 0, r), h(this, Y, ke).call(this, { timeline: i });
  }
  addAwait(n = -1, e = null) {
    const i = [...d(this, Y, Te).timeline], r = { await: e ?? { event: "click" } };
    return n < 0 || n >= i.length ? i.push(r) : i.splice(n, 0, r), h(this, Y, ke).call(this, { timeline: i });
  }
  addEmit(n = -1, e = "") {
    const i = [...d(this, Y, Te).timeline], r = { emit: e };
    return n < 0 || n >= i.length ? i.push(r) : i.splice(n, 0, r), h(this, Y, ke).call(this, { timeline: i });
  }
  addParallel(n = -1) {
    const e = [...d(this, Y, Te).timeline], i = { parallel: { branches: [[], []], join: "all", overflow: "detach" } };
    return n < 0 || n >= e.length ? e.push(i) : e.splice(n, 0, i), h(this, Y, ke).call(this, { timeline: e });
  }
  addTransitionTo(n = -1, e = null) {
    const i = [...d(this, Y, Te).timeline], r = { transitionTo: e ?? { cinematic: "", scene: "" } };
    return n < 0 || n >= i.length ? i.push(r) : i.splice(n, 0, r), h(this, Y, ke).call(this, { timeline: i });
  }
  addSound(n = -1, e = null) {
    const i = [...d(this, Y, Te).timeline], r = { sound: e ?? { src: "", volume: 0.8, loop: !1, duration: 0, fireAndForget: !1 } };
    return n < 0 || n >= i.length ? i.push(r) : i.splice(n, 0, r), h(this, Y, ke).call(this, { timeline: i });
  }
  addStopSound(n = -1, e = "") {
    const i = [...d(this, Y, Te).timeline], r = { stopSound: e };
    return n < 0 || n >= i.length ? i.push(r) : i.splice(n, 0, r), h(this, Y, ke).call(this, { timeline: i });
  }
  moveEntry(n, e) {
    if (n === e) return this;
    const i = [...d(this, Y, Te).timeline];
    if (n < 0 || n >= i.length) return this;
    if (e < 0 || e >= i.length) return this;
    const [r] = i.splice(n, 1);
    return i.splice(e, 0, r), h(this, Y, ke).call(this, { timeline: i });
  }
  removeEntry(n) {
    const e = [...d(this, Y, Te).timeline];
    return n < 0 || n >= e.length ? this : (e.splice(n, 1), h(this, Y, ke).call(this, { timeline: e }));
  }
  updateEntry(n, e) {
    const i = d(this, Y, Te).timeline.map((r, a) => a !== n ? r : { ...foundry.utils.deepClone(r), ...e });
    return h(this, Y, ke).call(this, { timeline: i });
  }
  // ── Tween mutations ──────────────────────────────────────────────────
  addTween(n, e = null) {
    const i = { type: "tile-prop", target: "", attribute: "alpha", value: 1, duration: 1e3 };
    return h(this, Y, Dt).call(this, n, (r) => {
      const a = [...r.tweens ?? [], e ?? i];
      return { ...r, tweens: a };
    });
  }
  updateTween(n, e, i) {
    return h(this, Y, Dt).call(this, n, (r) => {
      const a = (r.tweens ?? []).map((o, s) => s !== e ? o : { ...o, ...i });
      return { ...r, tweens: a };
    });
  }
  removeTween(n, e) {
    return h(this, Y, Dt).call(this, n, (i) => {
      const r = (i.tweens ?? []).filter((a, o) => o !== e);
      return { ...i, tweens: r };
    });
  }
  // ── Parallel branch mutations ────────────────────────────────────────
  addBranch(n) {
    return h(this, Y, Dt).call(this, n, (e) => {
      if (!e.parallel) return e;
      const i = [...e.parallel.branches, []];
      return { ...e, parallel: { ...e.parallel, branches: i } };
    });
  }
  removeBranch(n, e) {
    return h(this, Y, Dt).call(this, n, (i) => {
      if (!i.parallel) return i;
      const r = i.parallel.branches.filter((a, o) => o !== e);
      return r.length < 1 ? i : { ...i, parallel: { ...i.parallel, branches: r } };
    });
  }
  addBranchEntry(n, e, i = null) {
    const r = { tweens: [] };
    return h(this, Y, Dt).call(this, n, (a) => {
      if (!a.parallel) return a;
      const o = a.parallel.branches.map((s, l) => l !== e ? s : [...s, i ?? r]);
      return { ...a, parallel: { ...a.parallel, branches: o } };
    });
  }
  removeBranchEntry(n, e, i) {
    return h(this, Y, Dt).call(this, n, (r) => {
      if (!r.parallel) return r;
      const a = r.parallel.branches.map((o, s) => s !== e ? o : o.filter((l, u) => u !== i));
      return { ...r, parallel: { ...r.parallel, branches: a } };
    });
  }
  updateBranchEntry(n, e, i, r) {
    return h(this, Y, Dt).call(this, n, (a) => {
      if (!a.parallel) return a;
      const o = a.parallel.branches.map((s, l) => l !== e ? s : s.map((u, f) => f !== i ? u : { ...foundry.utils.deepClone(u), ...r }));
      return { ...a, parallel: { ...a.parallel, branches: o } };
    });
  }
  moveBranchEntry(n, e, i, r) {
    return i === r ? this : h(this, Y, Dt).call(this, n, (a) => {
      if (!a.parallel) return a;
      const o = a.parallel.branches.map((s, l) => {
        if (l !== e) return s;
        const u = [...s];
        if (i < 0 || i >= u.length || r < 0 || r >= u.length) return s;
        const [f] = u.splice(i, 1);
        return u.splice(r, 0, f), u;
      });
      return { ...a, parallel: { ...a.parallel, branches: o } };
    });
  }
  // ── Persistence ──────────────────────────────────────────────────────
  async save(n) {
    const e = { ...foundry.utils.deepClone(d(this, Le)), version: Ho };
    await n.setFlag(L, "cinematic", e);
  }
  /** Returns the active cinematic's data (for validation/export). */
  toJSON() {
    return foundry.utils.deepClone(d(this, Y, Te));
  }
  /** Returns the entire v3 flag structure. */
  toFullJSON() {
    return foundry.utils.deepClone(d(this, Le));
  }
};
Le = new WeakMap(), pt = new WeakMap(), It = new WeakMap(), eo = new WeakSet(), bd = /* @__PURE__ */ c(function(n) {
  return foundry.utils.deepClone(n);
}, "#computeHash"), Y = new WeakSet(), Te = /* @__PURE__ */ c(function() {
  return d(this, Le).cinematics[d(this, pt)];
}, "#active"), // ── Internal ─────────────────────────────────────────────────────────
/** Clone the full state with a patch to the active cinematic. */
ke = /* @__PURE__ */ c(function(n) {
  const e = foundry.utils.deepClone(d(this, Le));
  return Object.assign(e.cinematics[d(this, pt)], n), new Ge(e, {
    loadedHash: d(this, It),
    cinematicName: d(this, pt)
  });
}, "#cloneActive"), /** Mutate a single timeline entry within the active cinematic. */
Dt = /* @__PURE__ */ c(function(n, e) {
  if (n < 0 || n >= d(this, Y, Te).timeline.length) return this;
  const i = d(this, Y, Te).timeline.map((r, a) => a !== n ? r : e(foundry.utils.deepClone(r)));
  return h(this, Y, ke).call(this, { timeline: i });
}, "#mutateEntry"), x(Ge, eo), c(Ge, "CinematicState");
let Dn = Ge;
const Mi = /* @__PURE__ */ new WeakMap(), Ea = /* @__PURE__ */ new Set(), Ta = /* @__PURE__ */ new Set(), pc = {
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
function Ca(t, n = {}) {
  var b, p, E;
  if (!t) return !1;
  Ni(t);
  const e = n.mode ?? (n.color != null ? "custom" : "hover"), i = pc[e] ?? pc.hover, r = n.color ?? i.borderColor, a = n.alpha ?? i.borderAlpha, o = n.color ?? i.spriteTint, s = i.spriteAlpha, l = n.pulse ?? i.pulse, u = { border: null, sprite: null, pulseData: null, mode: e }, f = ((b = t.document) == null ? void 0 : b.width) ?? t.w ?? 100, g = ((p = t.document) == null ? void 0 : p.height) ?? t.h ?? 100, m = new PIXI.Graphics();
  m.lineStyle(i.borderWidth, r, a), m.drawRect(0, 0, f, g), t.addChild(m), u.border = m;
  const y = Zm(t, o, s);
  if (y && (canvas.controls.debug.addChild(y), Ta.add(y), u.sprite = y), l && ((E = canvas.app) != null && E.ticker)) {
    const T = {
      elapsed: 0,
      fn: /* @__PURE__ */ c((I) => {
        T.elapsed += I;
        const M = (Math.sin(T.elapsed * 0.05) + 1) / 2;
        u.border && (u.border.alpha = a * (0.4 + 0.6 * M)), u.sprite && (u.sprite.alpha = s * (0.5 + 0.5 * M));
      }, "fn")
    };
    canvas.app.ticker.add(T.fn), u.pulseData = T, Ea.add(T);
  }
  return Mi.set(t, u), !0;
}
c(Ca, "addHighlight");
function Ni(t) {
  var e, i;
  if (!t) return;
  const n = Mi.get(t);
  n && (n.pulseData && ((i = (e = canvas.app) == null ? void 0 : e.ticker) == null || i.remove(n.pulseData.fn), Ea.delete(n.pulseData)), n.border && (n.border.parent && n.border.parent.removeChild(n.border), n.border.destroy({ children: !0 })), n.sprite && (n.sprite.parent && n.sprite.parent.removeChild(n.sprite), n.sprite.destroy({ children: !0 }), Ta.delete(n.sprite)), Mi.delete(t));
}
c(Ni, "removeHighlight");
function wd(t) {
  return Mi.has(t);
}
c(wd, "hasHighlight");
function Qr() {
  var n, e, i, r, a, o, s;
  for (const l of Ea)
    (e = (n = canvas.app) == null ? void 0 : n.ticker) == null || e.remove(l.fn);
  Ea.clear();
  for (const l of Ta)
    l.parent && l.parent.removeChild(l), l.destroy({ children: !0 });
  Ta.clear();
  const t = [
    (i = canvas.tiles) == null ? void 0 : i.placeables,
    (r = canvas.tokens) == null ? void 0 : r.placeables,
    (a = canvas.lighting) == null ? void 0 : a.placeables,
    (o = canvas.drawings) == null ? void 0 : o.placeables,
    (s = canvas.sounds) == null ? void 0 : s.placeables
  ];
  for (const l of t)
    if (l)
      for (const u of l) {
        const f = Mi.get(u);
        f && (f.border && (f.border.parent && f.border.parent.removeChild(f.border), f.border.destroy({ children: !0 })), Mi.delete(u));
      }
}
c(Qr, "clearAllHighlights");
function Zm(t, n, e) {
  var a;
  const i = t.mesh;
  if (!((a = i == null ? void 0 : i.texture) != null && a.baseTexture)) return null;
  const r = PIXI.Sprite.from(i.texture);
  return r.isSprite = !0, r.anchor.set(i.anchor.x, i.anchor.y), r.width = i.width, r.height = i.height, r.scale = i.scale, r.position = t.center, r.angle = i.angle, r.alpha = e, r.tint = n, r.name = "eidolonPickerHighlight", r;
}
c(Zm, "createTintSprite");
let _n = null;
function vd(t) {
  var b, p, E;
  _n && _n.cancel();
  const { placeableType: n = "Tile", onPick: e, onCancel: i } = t;
  let r = null;
  const a = `control${n}`, o = `hover${n}`, s = /* @__PURE__ */ c((T, I) => {
    var $;
    if (!I) return;
    const M = T.document ?? T;
    ($ = T.release) == null || $.call(T), e(M);
  }, "onControl"), l = /* @__PURE__ */ c((T, I) => {
    I ? (r = T, Ca(T, { mode: "pick" })) : r === T && (Ni(T), r = null);
  }, "onHoverIn"), u = /* @__PURE__ */ c((T) => {
    T.key === "Escape" && (T.preventDefault(), T.stopPropagation(), y());
  }, "onKeydown"), f = /* @__PURE__ */ c((T) => {
    T.preventDefault(), y();
  }, "onContextMenu"), g = Hooks.on(a, s), m = Hooks.on(o, l);
  document.addEventListener("keydown", u, { capture: !0 }), (b = canvas.stage) == null || b.addEventListener("rightclick", f), (E = (p = ui.notifications) == null ? void 0 : p.info) == null || E.call(p, `Pick mode active — click a ${n.toLowerCase()} on the canvas, or press ESC to cancel.`, { permanent: !1 });
  function y() {
    var T;
    _n && (_n = null, Hooks.off(a, g), Hooks.off(o, m), document.removeEventListener("keydown", u, { capture: !0 }), (T = canvas.stage) == null || T.removeEventListener("rightclick", f), r && (Ni(r), r = null), i == null || i());
  }
  return c(y, "cancel"), _n = { cancel: y }, { cancel: y };
}
c(vd, "enterPickMode");
function Vi() {
  _n && _n.cancel();
}
c(Vi, "cancelPickMode");
const ep = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  cancelPickMode: Vi,
  enterPickMode: vd
}, Symbol.toStringTag, { value: "Module" }));
var Nc, Re, Qe, gr, gn, mr, pr, rt, mn, Ee, Ed, Us, Td, Cd, Sd, Vs, zs, Ld, Id;
const ht = class ht extends Mn(An) {
  /**
   * @param {object} options
   * @param {string[]} [options.selections]  Initial selections
   * @param {string} [options.placeableType]  "Tile", "Token", etc.
   * @param {(selectors: string[]) => void} [options.onApply]
   * @param {() => void} [options.onCancel]
   */
  constructor(e = {}) {
    super(e);
    x(this, Ee);
    /** @type {string[]} Current selections (selector strings). */
    x(this, Re, []);
    /** @type {boolean} Whether pick mode is active. */
    x(this, Qe, !1);
    /** @type {string} Placeable type (Tile, Token, etc.). */
    x(this, gr, "Tile");
    /** @type {string} Current tag match mode. */
    x(this, gn, "any");
    /** @type {((selectors: string[]) => void) | null} */
    x(this, mr, null);
    /** @type {(() => void) | null} */
    x(this, pr, null);
    /** @type {Promise resolve function for the open() API. */
    x(this, rt, null);
    /** @type {PlaceableObject | null} Currently hovered tile in the browser. */
    x(this, mn, null);
    A(this, Re, [...e.selections ?? []]), A(this, gr, e.placeableType ?? "Tile"), A(this, mr, e.onApply ?? null), A(this, pr, e.onCancel ?? null);
  }
  // ── Context ───────────────────────────────────────────────────────────
  async _prepareContext() {
    var r;
    const e = h(this, Ee, Vs).call(this), i = (((r = canvas.tiles) == null ? void 0 : r.placeables) ?? []).map((a, o) => {
      var f, g;
      const s = a.document, l = s.id, u = (f = s.texture) != null && f.src ? s.texture.src.split("/").pop().replace(/\.[^.]+$/, "") : `Tile ${o + 1}`;
      return {
        id: l,
        name: u.length > 20 ? u.slice(0, 18) + "..." : u,
        thumbnailSrc: ((g = s.texture) == null ? void 0 : g.src) ?? null,
        selected: e.has(l)
      };
    });
    return {
      selections: d(this, Re),
      selectionCount: d(this, Re).length,
      pickModeActive: d(this, Qe),
      tagModeIsAny: d(this, gn) === "any",
      tagModeIsAll: d(this, gn) === "all",
      tagPreviewCount: 0,
      tiles: i,
      tileCount: i.length
    };
  }
  // ── Render & Events ───────────────────────────────────────────────────
  _onRender(e, i) {
    super._onRender(e, i), h(this, Ee, Ed).call(this), h(this, Ee, zs).call(this);
  }
  async _onClose(e) {
    return d(this, Qe) && (Vi(), A(this, Qe, !1)), Qr(), d(this, rt) && (d(this, rt).call(this, null), A(this, rt, null)), super._onClose(e);
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
  static open(e = {}) {
    return new Promise((i) => {
      const r = new ht({
        ...e,
        onApply: /* @__PURE__ */ c((a) => i(a), "onApply"),
        onCancel: /* @__PURE__ */ c(() => i(null), "onCancel")
      });
      A(r, rt, i), r.render(!0);
    });
  }
};
Re = new WeakMap(), Qe = new WeakMap(), gr = new WeakMap(), gn = new WeakMap(), mr = new WeakMap(), pr = new WeakMap(), rt = new WeakMap(), mn = new WeakMap(), Ee = new WeakSet(), Ed = /* @__PURE__ */ c(function() {
  var a, o, s, l;
  const e = this.element;
  if (!(e instanceof HTMLElement)) return;
  const i = e.querySelector("[data-role='tag-input']"), r = e.querySelector("[data-role='tag-mode']");
  r == null || r.addEventListener("change", (u) => {
    A(this, gn, u.target.value);
  }), i == null || i.addEventListener("input", () => {
    h(this, Ee, Td).call(this, e);
  }), i == null || i.addEventListener("keydown", (u) => {
    u.key === "Enter" && (u.preventDefault(), h(this, Ee, Us).call(this, e));
  }), (a = e.querySelector("[data-action='add-tag-selector']")) == null || a.addEventListener("click", () => {
    h(this, Ee, Us).call(this, e);
  }), (o = e.querySelector("[data-action='toggle-pick-mode']")) == null || o.addEventListener("click", () => {
    d(this, Qe) ? (Vi(), A(this, Qe, !1)) : (A(this, Qe, !0), vd({
      placeableType: d(this, gr),
      onPick: /* @__PURE__ */ c((u) => {
        h(this, Ee, Cd).call(this, u.id);
      }, "onPick"),
      onCancel: /* @__PURE__ */ c(() => {
        A(this, Qe, !1), this.render({ force: !0 });
      }, "onCancel")
    })), this.render({ force: !0 });
  }), e.querySelectorAll("[data-action='toggle-tile']").forEach((u) => {
    u.addEventListener("click", () => {
      const f = u.dataset.docId;
      f && h(this, Ee, Sd).call(this, f);
    }), u.addEventListener("mouseenter", () => {
      var m, y;
      const f = u.dataset.docId;
      if (!f) return;
      const g = (y = (m = canvas.tiles) == null ? void 0 : m.placeables) == null ? void 0 : y.find((b) => b.document.id === f);
      g && (A(this, mn, g), Ca(g, { mode: "hover" }));
    }), u.addEventListener("mouseleave", () => {
      d(this, mn) && (Ni(d(this, mn)), A(this, mn, null), h(this, Ee, zs).call(this));
    });
  }), e.querySelectorAll("[data-action='remove-selection']").forEach((u) => {
    u.addEventListener("click", () => {
      const f = Number(u.dataset.selectionIndex);
      Number.isNaN(f) || (d(this, Re).splice(f, 1), this.render({ force: !0 }));
    });
  }), (s = e.querySelector("[data-action='apply']")) == null || s.addEventListener("click", () => {
    h(this, Ee, Ld).call(this);
  }), (l = e.querySelector("[data-action='cancel']")) == null || l.addEventListener("click", () => {
    h(this, Ee, Id).call(this);
  });
}, "#bindEvents"), // ── Tag helpers ───────────────────────────────────────────────────────
Us = /* @__PURE__ */ c(function(e) {
  var s;
  const i = e.querySelector("[data-role='tag-input']"), r = (s = i == null ? void 0 : i.value) == null ? void 0 : s.trim();
  if (!r) return;
  const a = r.split(",").map((l) => l.trim()).filter(Boolean);
  if (a.length === 0) return;
  const o = ud(a, d(this, gn));
  o && !d(this, Re).includes(o) && d(this, Re).push(o), i && (i.value = ""), this.render({ force: !0 });
}, "#addTagSelector"), Td = /* @__PURE__ */ c(function(e) {
  var g, m;
  const i = e.querySelector("[data-role='tag-input']"), r = e.querySelector("[data-role='tag-preview']");
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
  const l = d(this, gn) === "any", u = s.getByTag(o, {
    sceneId: (m = canvas.scene) == null ? void 0 : m.id,
    matchAny: l
  }), f = (u == null ? void 0 : u.length) ?? 0;
  r.textContent = `${f} matching placeable(s)`;
}, "#updateTagPreview"), // ── ID selector helpers ──────────────────────────────────────────────
Cd = /* @__PURE__ */ c(function(e) {
  const i = `id:${e}`;
  d(this, Re).includes(i) || (d(this, Re).push(i), this.render({ force: !0 }));
}, "#addIdSelector"), Sd = /* @__PURE__ */ c(function(e) {
  const i = `id:${e}`, r = d(this, Re).indexOf(i);
  r >= 0 ? d(this, Re).splice(r, 1) : d(this, Re).push(i), this.render({ force: !0 });
}, "#toggleIdSelector"), /**
 * Get the set of document IDs that are currently selected across all selector types.
 * Resolves tag/tags-any/tags-all selectors to find matching document IDs.
 * @returns {Set<string>}
 */
Vs = /* @__PURE__ */ c(function() {
  const e = /* @__PURE__ */ new Set();
  for (const i of d(this, Re)) {
    const r = Il(i);
    if (r.type === "id") {
      e.add(r.value);
      continue;
    }
    const a = bo(i);
    if (a != null && a.placeables)
      for (const { doc: o } of a.placeables)
        o != null && o.id && e.add(o.id);
  }
  return e;
}, "#getSelectedIds"), // ── Canvas selection highlights ──────────────────────────────────────
/**
 * Maintain "selected" highlights on canvas tiles that are in the selection list.
 * Clears stale highlights and adds missing ones (skipping the hovered tile).
 */
zs = /* @__PURE__ */ c(function() {
  var r, a;
  const e = h(this, Ee, Vs).call(this), i = ((r = canvas.tiles) == null ? void 0 : r.placeables) ?? [];
  for (const o of i) {
    const s = (a = o.document) == null ? void 0 : a.id;
    if (!s) continue;
    const l = e.has(s), u = o === d(this, mn), f = wd(o);
    l && !u && !f ? Ca(o, { mode: "selected" }) : !l && f && !u && Ni(o);
  }
}, "#refreshSelectionHighlights"), // ── Apply / Cancel ──────────────────────────────────────────────────
Ld = /* @__PURE__ */ c(function() {
  var i;
  d(this, Qe) && (Vi(), A(this, Qe, !1)), Qr();
  const e = [...d(this, Re)];
  (i = d(this, mr)) == null || i.call(this, e), d(this, rt) && (d(this, rt).call(this, e), A(this, rt, null)), this.close({ force: !0 });
}, "#doApply"), Id = /* @__PURE__ */ c(function() {
  var e;
  d(this, Qe) && (Vi(), A(this, Qe, !1)), Qr(), (e = d(this, pr)) == null || e.call(this), d(this, rt) && (d(this, rt).call(this, null), A(this, rt, null)), this.close({ force: !0 });
}, "#doCancel"), c(ht, "PlaceablePickerApplication"), Me(ht, "APP_ID", `${L}-placeable-picker`), Me(ht, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  ze(ht, ht, "DEFAULT_OPTIONS"),
  {
    id: ht.APP_ID,
    classes: Array.from(
      /* @__PURE__ */ new Set([...((Nc = ze(ht, ht, "DEFAULT_OPTIONS")) == null ? void 0 : Nc.classes) ?? [], "eidolon-placeable-picker-window", "themed"])
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
)), Me(ht, "PARTS", {
  content: {
    template: `modules/${L}/templates/placeable-picker.html`
  }
});
let Sa = ht;
var kc, pn, Cn, Xr, Od;
const Et = class Et extends Mn(An) {
  constructor(e = {}) {
    super(e);
    x(this, Cn);
    x(this, pn, null);
    A(this, pn, e.scene ?? canvas.scene ?? null);
  }
  async _prepareContext() {
    var r, a, o;
    const e = d(this, Cn, Xr), i = ((a = e == null ? void 0 : e.getSeenStatus) == null ? void 0 : a.call(e, (r = d(this, pn)) == null ? void 0 : r.id)) ?? [];
    return {
      sceneName: ((o = d(this, pn)) == null ? void 0 : o.name) ?? "No scene",
      users: i.map((s) => ({
        ...s,
        statusLabel: s.seen ? "Seen" : "Not seen",
        statusClass: s.seen ? "cinematic-tracking__status--seen" : "cinematic-tracking__status--unseen"
      })),
      hasAnyTracked: i.some((s) => s.seen)
    };
  }
  _onRender(e, i) {
    super._onRender(e, i), h(this, Cn, Od).call(this);
  }
};
pn = new WeakMap(), Cn = new WeakSet(), Xr = /* @__PURE__ */ c(function() {
  var e, i;
  return (i = (e = game.modules.get(L)) == null ? void 0 : e.api) == null ? void 0 : i.cinematic;
}, "#api"), Od = /* @__PURE__ */ c(function() {
  var i, r;
  const e = this.element;
  e instanceof HTMLElement && (e.querySelectorAll("[data-action='reset-user']").forEach((a) => {
    a.addEventListener("click", async () => {
      var l;
      const o = a.dataset.userId;
      if (!o) return;
      const s = d(this, Cn, Xr);
      s != null && s.resetForUser && (await s.resetForUser((l = d(this, pn)) == null ? void 0 : l.id, o), this.render({ force: !0 }));
    });
  }), (i = e.querySelector("[data-action='reset-all']")) == null || i.addEventListener("click", async () => {
    var o;
    const a = d(this, Cn, Xr);
    a != null && a.resetForAll && (await a.resetForAll((o = d(this, pn)) == null ? void 0 : o.id), this.render({ force: !0 }));
  }), (r = e.querySelector("[data-action='refresh']")) == null || r.addEventListener("click", () => {
    this.render({ force: !0 });
  }));
}, "#bindEvents"), c(Et, "CinematicTrackingApplication"), Me(Et, "APP_ID", `${L}-cinematic-tracking`), Me(Et, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  ze(Et, Et, "DEFAULT_OPTIONS"),
  {
    id: Et.APP_ID,
    classes: Array.from(
      /* @__PURE__ */ new Set([...((kc = ze(Et, Et, "DEFAULT_OPTIONS")) == null ? void 0 : kc.classes) ?? [], "eidolon-cinematic-tracking-window", "themed"])
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
)), Me(Et, "PARTS", {
  content: {
    template: `modules/${L}/templates/cinematic-tracking.html`
  }
});
let Gs = Et;
const yc = [
  { value: "tile-prop", label: "Tile Prop" },
  { value: "light-color", label: "Light Color" },
  { value: "light-state", label: "Light State" },
  { value: "particles-prop", label: "Particles Prop" },
  { value: "camera-pan", label: "Camera Pan" },
  { value: "token-prop", label: "Token Prop" },
  { value: "drawing-prop", label: "Drawing Prop" },
  { value: "sound-prop", label: "Sound Prop" }
], bc = {
  "tile-prop": { form: "prop", attribute: "alpha", value: 1, placeholder: "alpha, rotation, x, y, width, height" },
  "token-prop": { form: "prop", attribute: "alpha", value: 1, placeholder: "alpha, rotation, x, y" },
  "drawing-prop": { form: "prop", attribute: "alpha", value: 1, placeholder: "alpha, rotation, x, y" },
  "sound-prop": { form: "prop", attribute: "volume", value: 0.5, placeholder: "volume, radius" },
  "particles-prop": { form: "particles", attribute: "alpha", value: 1, placeholder: "alpha, rate, speed, size" },
  "camera-pan": { form: "camera", x: 0, y: 0, scale: 1 },
  "light-color": { form: "lightColor", toColor: "#ffffff", toAlpha: "", mode: "oklch" },
  "light-state": { form: "lightState", enabled: !0 }
}, tp = [
  { value: "canvasReady", label: "Canvas Ready" },
  { value: "manual", label: "Manual Only" }
];
function wc(t) {
  return t && (t.split("/").pop() || "").replace(/\.[^.]+$/, "").replace(/[^a-zA-Z0-9_-]/g, "-") || "";
}
c(wc, "soundIdFromPath");
function vc(t) {
  return t ? new Promise((n) => {
    const e = new Audio(t);
    e.addEventListener("loadedmetadata", () => {
      n(Math.round(e.duration * 1e3));
    }), e.addEventListener("error", () => n(0));
  }) : Promise.resolve(0);
}
c(vc, "loadAudioDurationMs");
const sn = 40, Hi = 24, qo = 50, Ec = 50, Ut = 60, Fn = 10, si = 16, Tc = 40, Cc = 20;
var xc, Xe, V, q, yn, Ot, at, yt, to, Be, ot, no, Yt, bn, C, Ad, Md, Js, Nd, kd, Ks, xd, zi, $d, Ys, Fd, Qs, Dd, _d, oe, ve, Xs, B, Zs, el, tl, nl, il, fi, rl, Pd, Rd, Hd, qd, Bd, al, ol, jd, Ud, Vd, zd, Gd;
const Tt = class Tt extends Mn(An) {
  constructor(e = {}) {
    super(e);
    x(this, C);
    x(this, Xe, null);
    x(this, V, null);
    x(this, q, null);
    x(this, yn, /* @__PURE__ */ new Set());
    x(this, Ot, !1);
    x(this, at, null);
    x(this, yt, null);
    x(this, to, 120);
    x(this, Be, []);
    x(this, ot, -1);
    x(this, no, 50);
    x(this, Yt, null);
    x(this, bn, null);
    A(this, Xe, e.scene ?? canvas.scene ?? null), A(this, V, Dn.fromScene(d(this, Xe)));
  }
  // ── Context ───────────────────────────────────────────────────────────
  async _prepareContext() {
    var o;
    const e = h(this, C, Nd).call(this), i = d(this, q) != null ? h(this, C, Ud).call(this, d(this, q)) : null, r = d(this, V).listCinematicNames(), a = d(this, V).activeCinematicName;
    return {
      // Toolbar
      sceneName: ((o = d(this, Xe)) == null ? void 0 : o.name) ?? "No scene",
      dirty: d(this, Ot),
      canUndo: d(this, C, Zs),
      canRedo: d(this, C, el),
      // Cinematic selector
      cinematicNames: r,
      activeCinematicName: a,
      cinematicOptions: r.map((s) => ({
        value: s,
        label: s,
        selected: s === a
      })),
      hasMultipleCinematics: r.length > 1,
      // Swimlane
      timeMarkers: e.timeMarkers,
      mainBlocks: e.mainBlocks,
      subLanes: e.subLanes,
      signalArcs: e.signalArcs,
      fafConnectors: e.fafConnectors,
      totalWidthPx: e.totalWidthPx,
      swimlaneHeightPx: e.swimlaneHeightPx,
      insertionPoints: e.insertionPoints,
      // Detail
      detail: i,
      // Footer
      trigger: d(this, V).trigger,
      tracking: d(this, V).tracking,
      synchronized: d(this, V).synchronized,
      triggerOptions: tp.map((s) => ({
        ...s,
        selected: s.value === d(this, V).trigger
      })),
      entryCount: d(this, V).timeline.length,
      totalDuration: e.totalDurationMs,
      targetCount: h(this, C, Gd).call(this),
      setupCount: Object.keys(d(this, V).setup ?? {}).length,
      landingCount: Object.keys(d(this, V).landing ?? {}).length
    };
  }
  // ── Render & Events ───────────────────────────────────────────────────
  _onRender(e, i) {
    super._onRender(e, i), h(this, C, Ad).call(this), d(this, Yt) || (A(this, Yt, (r) => {
      !r.ctrlKey && !r.metaKey || (r.key === "z" && !r.shiftKey ? (r.preventDefault(), h(this, C, tl).call(this)) : (r.key === "z" && r.shiftKey || r.key === "y") && (r.preventDefault(), h(this, C, nl).call(this)));
    }), document.addEventListener("keydown", d(this, Yt)));
  }
  async close(e = {}) {
    if (d(this, yt) && h(this, C, fi).call(this), d(this, Ot) && !e.force) {
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
      i === "save" && await h(this, C, rl).call(this);
    }
    return super.close(e);
  }
  async _onClose(e) {
    return d(this, at) !== null && (clearTimeout(d(this, at)), A(this, at, null)), d(this, Yt) && (document.removeEventListener("keydown", d(this, Yt)), A(this, Yt, null)), super._onClose(e);
  }
};
Xe = new WeakMap(), V = new WeakMap(), q = new WeakMap(), yn = new WeakMap(), Ot = new WeakMap(), at = new WeakMap(), yt = new WeakMap(), to = new WeakMap(), Be = new WeakMap(), ot = new WeakMap(), no = new WeakMap(), Yt = new WeakMap(), bn = new WeakMap(), C = new WeakSet(), // ── Event binding ─────────────────────────────────────────────────────
Ad = /* @__PURE__ */ c(function() {
  var r, a, o, s, l, u, f, g, m, y, b, p, E, T, I, M, $, k, _, H, G, ie, U, ee, R, K, Q, Z, z, X, le, he, ae, ce, Nt, Ue, Fe, He, qe, lt, _e, Ae, jt, ct, kt;
  const e = this.element;
  if (!(e instanceof HTMLElement)) return;
  e.querySelectorAll("[data-action='select-block']").forEach((O) => {
    O.addEventListener("click", (S) => {
      if (S.target.closest("button")) return;
      const w = O.dataset.entryPath;
      A(this, q, d(this, q) === w ? null : w), this.render({ force: !0 });
    });
  });
  let i = null;
  e.querySelectorAll(".cinematic-editor__lane--main [data-action='select-block']").forEach((O) => {
    const S = O.dataset.entryPath;
    S === "setup" || S === "landing" || (O.addEventListener("dragstart", (w) => {
      i = S, O.classList.add("dragging"), w.dataTransfer.effectAllowed = "move";
    }), O.addEventListener("dragover", (w) => {
      w.preventDefault(), w.dataTransfer.dropEffect = "move";
    }), O.addEventListener("dragenter", (w) => {
      w.preventDefault(), O.classList.add("cinematic-editor__block--drag-over");
    }), O.addEventListener("dragleave", () => {
      O.classList.remove("cinematic-editor__block--drag-over");
    }), O.addEventListener("drop", (w) => {
      w.preventDefault(), O.classList.remove("cinematic-editor__block--drag-over");
      const N = O.dataset.entryPath;
      if (i && i !== N) {
        const F = h(this, C, Xs).call(this, i), te = h(this, C, Xs).call(this, N);
        F != null && te != null && (d(this, q) === i && A(this, q, N), h(this, C, B).call(this, (j) => j.moveEntry(F, te)));
      }
      i = null;
    }), O.addEventListener("dragend", () => {
      O.classList.remove("dragging"), i = null;
    }));
  }), (r = e.querySelector("[data-action='save']")) == null || r.addEventListener("click", () => h(this, C, rl).call(this)), (a = e.querySelector("[data-action='play-preview']")) == null || a.addEventListener("click", () => h(this, C, Pd).call(this)), (o = e.querySelector("[data-action='reset-tracking']")) == null || o.addEventListener("click", () => h(this, C, Rd).call(this)), (s = e.querySelector("[data-action='export-json']")) == null || s.addEventListener("click", () => h(this, C, Hd).call(this)), (l = e.querySelector("[data-action='undo']")) == null || l.addEventListener("click", () => h(this, C, tl).call(this)), (u = e.querySelector("[data-action='redo']")) == null || u.addEventListener("click", () => h(this, C, nl).call(this)), (f = e.querySelector("[data-action='validate']")) == null || f.addEventListener("click", () => h(this, C, qd).call(this)), (g = e.querySelector("[data-action='import-json']")) == null || g.addEventListener("click", () => h(this, C, Bd).call(this)), (m = e.querySelector("[data-action='open-tracking']")) == null || m.addEventListener("click", () => {
    new Gs({ scene: d(this, Xe) }).render(!0);
  }), (y = e.querySelector("[data-action='change-cinematic']")) == null || y.addEventListener("change", (O) => {
    d(this, yt) && h(this, C, fi).call(this), A(this, V, d(this, V).switchCinematic(O.target.value)), A(this, q, null), d(this, yn).clear(), this.render({ force: !0 });
  }), (b = e.querySelector("[data-action='add-cinematic']")) == null || b.addEventListener("click", () => {
    new Dialog({
      title: "New Cinematic",
      content: '<label style="display:flex;align-items:center;gap:0.5rem"><span>Name:</span><input id="cinematic-new-name" type="text" style="flex:1" placeholder="intro" /></label>',
      buttons: {
        ok: {
          label: "Create",
          callback: /* @__PURE__ */ c((O) => {
            var w, N, F, te, j, ge, pe;
            const S = (w = O.find("#cinematic-new-name").val()) == null ? void 0 : w.trim();
            if (!S) {
              (F = (N = ui.notifications) == null ? void 0 : N.warn) == null || F.call(N, "Name cannot be empty.");
              return;
            }
            if (/[.\s]/.test(S)) {
              (j = (te = ui.notifications) == null ? void 0 : te.warn) == null || j.call(te, "Name cannot contain dots or spaces.");
              return;
            }
            if (d(this, V).listCinematicNames().includes(S)) {
              (pe = (ge = ui.notifications) == null ? void 0 : ge.warn) == null || pe.call(ge, "Name already exists.");
              return;
            }
            h(this, C, B).call(this, (me) => me.addCinematic(S));
          }, "callback")
        },
        cancel: { label: "Cancel" }
      },
      default: "ok"
    }).render(!0);
  }), (p = e.querySelector("[data-action='remove-cinematic']")) == null || p.addEventListener("click", () => {
    var w, N;
    if (d(this, V).listCinematicNames().length <= 1) {
      (N = (w = ui.notifications) == null ? void 0 : w.warn) == null || N.call(w, "Cannot remove the last cinematic.");
      return;
    }
    const S = d(this, V).activeCinematicName;
    new Dialog({
      title: "Remove Cinematic",
      content: `<p>Remove cinematic "${S}"? This cannot be undone after saving.</p>`,
      buttons: {
        ok: {
          label: "Remove",
          callback: /* @__PURE__ */ c(() => {
            A(this, q, null), h(this, C, B).call(this, (F) => F.removeCinematic(S));
          }, "callback")
        },
        cancel: { label: "Cancel" }
      },
      default: "cancel"
    }).render(!0);
  }), (E = e.querySelector("[data-action='rename-cinematic']")) == null || E.addEventListener("click", () => {
    const O = d(this, V).activeCinematicName;
    new Dialog({
      title: "Rename Cinematic",
      content: `<label style="display:flex;align-items:center;gap:0.5rem"><span>Name:</span><input id="cinematic-rename" type="text" style="flex:1" value="${At(O)}" /></label>`,
      buttons: {
        ok: {
          label: "Rename",
          callback: /* @__PURE__ */ c((S) => {
            var N, F, te, j, ge, pe, me;
            const w = (N = S.find("#cinematic-rename").val()) == null ? void 0 : N.trim();
            if (!w) {
              (te = (F = ui.notifications) == null ? void 0 : F.warn) == null || te.call(F, "Name cannot be empty.");
              return;
            }
            if (/[.\s]/.test(w)) {
              (ge = (j = ui.notifications) == null ? void 0 : j.warn) == null || ge.call(j, "Name cannot contain dots or spaces.");
              return;
            }
            if (w !== O) {
              if (d(this, V).listCinematicNames().includes(w)) {
                (me = (pe = ui.notifications) == null ? void 0 : pe.warn) == null || me.call(pe, "Name already exists.");
                return;
              }
              h(this, C, B).call(this, (Ve) => Ve.renameCinematic(O, w));
            }
          }, "callback")
        },
        cancel: { label: "Cancel" }
      },
      default: "ok"
    }).render(!0);
  }), (T = e.querySelector("[data-action='change-trigger']")) == null || T.addEventListener("change", (O) => {
    h(this, C, B).call(this, (S) => S.setTrigger(O.target.value));
  }), (I = e.querySelector("[data-action='change-tracking']")) == null || I.addEventListener("change", (O) => {
    h(this, C, B).call(this, (S) => S.setTracking(O.target.checked));
  }), (M = e.querySelector("[data-action='change-synchronized']")) == null || M.addEventListener("change", (O) => {
    h(this, C, B).call(this, (S) => S.setSynchronized(O.target.checked));
  }), ($ = e.querySelector("[data-action='delete-entry']")) == null || $.addEventListener("click", () => {
    const O = h(this, C, oe).call(this, d(this, q));
    O && (O.type === "timeline" ? (h(this, C, B).call(this, (S) => S.removeEntry(O.index)), A(this, q, null)) : O.type === "branch" && (h(this, C, B).call(this, (S) => S.removeBranchEntry(O.index, O.branchIndex, O.branchEntryIndex)), A(this, q, null)));
  }), (k = e.querySelector("[data-action='add-tween']")) == null || k.addEventListener("click", () => {
    const O = h(this, C, oe).call(this, d(this, q));
    if (O) {
      if (O.type === "timeline")
        h(this, C, B).call(this, (S) => S.addTween(O.index));
      else if (O.type === "branch") {
        const S = h(this, C, ve).call(this, d(this, q));
        if (!S) return;
        const w = { type: "tile-prop", target: "", attribute: "alpha", value: 1, duration: 1e3 }, N = [...S.tweens ?? [], w];
        h(this, C, B).call(this, (F) => F.updateBranchEntry(O.index, O.branchIndex, O.branchEntryIndex, { tweens: N }));
      }
    }
  }), (_ = e.querySelector("[data-action='change-delay']")) == null || _.addEventListener("change", (O) => {
    const S = h(this, C, oe).call(this, d(this, q));
    if (!S) return;
    const w = Number(O.target.value) || 0;
    S.type === "timeline" ? h(this, C, B).call(this, (N) => N.updateEntry(S.index, { delay: w })) : S.type === "branch" && h(this, C, B).call(this, (N) => N.updateBranchEntry(S.index, S.branchIndex, S.branchEntryIndex, { delay: w }));
  }), e.querySelectorAll("[data-action='toggle-tween-card']").forEach((O) => {
    O.addEventListener("click", (S) => {
      if (S.target.closest("[data-action='delete-tween']")) return;
      const w = Number(O.dataset.tweenIndex), N = `${d(this, q)}.tweens.${w}`;
      d(this, yn).has(N) ? d(this, yn).delete(N) : d(this, yn).add(N), this.render({ force: !0 });
    });
  }), e.querySelectorAll("[data-action='pick-target']").forEach((O) => {
    O.addEventListener("click", async () => {
      var ge, pe;
      const S = Number(O.dataset.tweenIndex), w = h(this, C, oe).call(this, d(this, q));
      if (!w || Number.isNaN(S)) return;
      const N = h(this, C, ve).call(this, d(this, q)), F = ((pe = (ge = N == null ? void 0 : N.tweens) == null ? void 0 : ge[S]) == null ? void 0 : pe.target) ?? "", te = F ? [F] : [], j = await Sa.open({ selections: te });
      if (j && j.length > 0) {
        if (w.type === "timeline")
          h(this, C, B).call(this, (me) => me.updateTween(w.index, S, { target: j[0] }));
        else if (w.type === "branch") {
          const me = (N.tweens ?? []).map((Ve, Nn) => Nn === S ? { ...Ve, target: j[0] } : Ve);
          h(this, C, B).call(this, (Ve) => Ve.updateBranchEntry(w.index, w.branchIndex, w.branchEntryIndex, { tweens: me }));
        }
      }
    });
  }), e.querySelectorAll("[data-action='delete-tween']").forEach((O) => {
    O.addEventListener("click", () => {
      const S = Number(O.dataset.tweenIndex), w = h(this, C, oe).call(this, d(this, q));
      if (!(!w || Number.isNaN(S))) {
        if (w.type === "timeline")
          h(this, C, B).call(this, (N) => N.removeTween(w.index, S));
        else if (w.type === "branch") {
          const N = h(this, C, ve).call(this, d(this, q));
          if (!N) return;
          const F = (N.tweens ?? []).filter((te, j) => j !== S);
          h(this, C, B).call(this, (te) => te.updateBranchEntry(w.index, w.branchIndex, w.branchEntryIndex, { tweens: F }));
        }
      }
    });
  }), e.querySelectorAll(".cinematic-editor__tween-card-body").forEach((O) => {
    const S = Number(O.dataset.tweenIndex);
    O.querySelectorAll("[data-field]").forEach((w) => {
      const N = w.dataset.field, F = w.tagName === "SELECT" || w.type === "checkbox" ? "change" : "input";
      w.addEventListener(F, () => {
        let te;
        if (w.type === "checkbox" ? te = w.checked : N === "duration" || N === "x" || N === "y" || N === "scale" || N === "toAlpha" ? te = w.value.trim() === "" ? "" : Number(w.value) || 0 : N === "value" && !Number.isNaN(Number(w.value)) && w.value.trim() !== "" ? te = Number(w.value) : te = w.value, N === "type") {
          const j = bc[te], ge = { type: te };
          if (j) {
            const pe = j.form ?? "prop";
            pe === "prop" || pe === "particles" ? Object.assign(ge, { attribute: j.attribute, value: j.value }) : pe === "camera" ? Object.assign(ge, { x: j.x, y: j.y, scale: j.scale }) : pe === "lightColor" ? Object.assign(ge, { toColor: j.toColor, toAlpha: j.toAlpha, mode: j.mode }) : pe === "lightState" && Object.assign(ge, { enabled: j.enabled });
          }
          h(this, C, il).call(this, S, ge), d(this, at) !== null && clearTimeout(d(this, at)), A(this, at, null), h(this, C, fi).call(this), this.render({ force: !0 });
        } else
          h(this, C, il).call(this, S, { [N]: te });
      });
    });
  }), (H = e.querySelector("[data-action='edit-setup']")) == null || H.addEventListener("click", () => h(this, C, al).call(this, "setup")), (G = e.querySelector("[data-action='edit-landing']")) == null || G.addEventListener("click", () => h(this, C, al).call(this, "landing")), (ie = e.querySelector("[data-action='edit-before']")) == null || ie.addEventListener("click", () => h(this, C, ol).call(this, "before")), (U = e.querySelector("[data-action='edit-after']")) == null || U.addEventListener("click", () => h(this, C, ol).call(this, "after")), (ee = e.querySelector("[data-action='change-await-event']")) == null || ee.addEventListener("change", (O) => {
    const S = h(this, C, oe).call(this, d(this, q));
    if (!S) return;
    const w = h(this, C, ve).call(this, d(this, q));
    w != null && w.await && S.type === "timeline" && h(this, C, B).call(this, (N) => N.updateEntry(S.index, { await: { ...w.await, event: O.target.value } }));
  }), (R = e.querySelector("[data-action='change-await-signal']")) == null || R.addEventListener("change", (O) => {
    const S = h(this, C, oe).call(this, d(this, q));
    if (!S) return;
    const w = h(this, C, ve).call(this, d(this, q));
    w != null && w.await && S.type === "timeline" && h(this, C, B).call(this, (N) => N.updateEntry(S.index, { await: { ...w.await, signal: O.target.value } }));
  }), (K = e.querySelector("[data-action='change-await-target']")) == null || K.addEventListener("change", (O) => {
    const S = h(this, C, oe).call(this, d(this, q));
    if (!S) return;
    const w = h(this, C, ve).call(this, d(this, q));
    w != null && w.await && S.type === "timeline" && h(this, C, B).call(this, (N) => N.updateEntry(S.index, { await: { ...w.await, target: O.target.value } }));
  }), (Q = e.querySelector("[data-action='pick-await-target']")) == null || Q.addEventListener("click", async () => {
    const O = h(this, C, oe).call(this, d(this, q));
    if (!O) return;
    const S = h(this, C, ve).call(this, d(this, q));
    if (!(S != null && S.await)) return;
    const { enterPickMode: w } = await Promise.resolve().then(() => ep);
    w({
      placeableType: "Tile",
      onPick: /* @__PURE__ */ c((N) => {
        var j, ge;
        const F = (ge = (j = N.flags) == null ? void 0 : j.tagger) == null ? void 0 : ge.tags, te = F != null && F.length ? `tag:${F[0]}` : `id:${N.id}`;
        O.type === "timeline" && h(this, C, B).call(this, (pe) => pe.updateEntry(O.index, { await: { ...S.await, target: te } }));
      }, "onPick")
    });
  });
  for (const [O, S] of [["change-anim-idle", "idle"], ["change-anim-hover", "hover"], ["change-anim-dim", "dim"]])
    (Z = e.querySelector(`[data-action='${O}']`)) == null || Z.addEventListener("change", (w) => {
      const N = h(this, C, oe).call(this, d(this, q));
      if (!N) return;
      const F = h(this, C, ve).call(this, d(this, q));
      if (!(F != null && F.await)) return;
      const te = w.target.value.trim(), j = te ? te.split(",").map((me) => me.trim()).filter(Boolean) : void 0, ge = { ...F.await.animation ?? {} };
      j != null && j.length ? ge[S] = j.length === 1 ? j[0] : j : delete ge[S];
      const pe = { ...F.await, animation: Object.keys(ge).length ? ge : void 0 };
      pe.animation || delete pe.animation, N.type === "timeline" && h(this, C, B).call(this, (me) => me.updateEntry(N.index, { await: pe }));
    });
  (z = e.querySelector("[data-action='change-emit-signal']")) == null || z.addEventListener("change", (O) => {
    const S = h(this, C, oe).call(this, d(this, q));
    S && S.type === "timeline" && h(this, C, B).call(this, (w) => w.updateEntry(S.index, { emit: O.target.value }));
  }), (X = e.querySelector("[data-action='change-transition-cinematic']")) == null || X.addEventListener("change", (O) => {
    const S = h(this, C, oe).call(this, d(this, q));
    if (!S) return;
    const w = h(this, C, ve).call(this, d(this, q));
    w != null && w.transitionTo && S.type === "timeline" && h(this, C, B).call(this, (N) => N.updateEntry(S.index, { transitionTo: { ...w.transitionTo, cinematic: O.target.value } }));
  }), (le = e.querySelector("[data-action='change-transition-scene']")) == null || le.addEventListener("change", (O) => {
    const S = h(this, C, oe).call(this, d(this, q));
    if (!S) return;
    const w = h(this, C, ve).call(this, d(this, q));
    w != null && w.transitionTo && S.type === "timeline" && h(this, C, B).call(this, (N) => N.updateEntry(S.index, { transitionTo: { ...w.transitionTo, scene: O.target.value } }));
  }), (he = e.querySelector("[data-action='change-sound-src']")) == null || he.addEventListener("change", async (O) => {
    const S = h(this, C, oe).call(this, d(this, q));
    if (!S) return;
    const w = h(this, C, ve).call(this, d(this, q));
    if (!(w != null && w.sound)) return;
    const N = O.target.value, F = { ...w.sound, src: N };
    F.id || (F.id = wc(N));
    const te = await vc(N);
    te > 0 && (F.duration = te), S.type === "timeline" ? h(this, C, B).call(this, (j) => j.updateEntry(S.index, { sound: F })) : S.type === "branch" && h(this, C, B).call(this, (j) => j.updateBranchEntry(S.index, S.branchIndex, S.branchEntryIndex, { sound: F }));
  }), (ae = e.querySelector("[data-action='pick-sound-src']")) == null || ae.addEventListener("click", () => {
    const O = h(this, C, oe).call(this, d(this, q));
    if (!O) return;
    const S = h(this, C, ve).call(this, d(this, q));
    if (!(S != null && S.sound)) return;
    new FilePicker({
      type: "audio",
      current: S.sound.src || "",
      callback: /* @__PURE__ */ c(async (N) => {
        const F = { ...S.sound, src: N };
        F.id || (F.id = wc(N));
        const te = await vc(N);
        te > 0 && (F.duration = te), O.type === "timeline" ? h(this, C, B).call(this, (j) => j.updateEntry(O.index, { sound: F })) : O.type === "branch" && h(this, C, B).call(this, (j) => j.updateBranchEntry(O.index, O.branchIndex, O.branchEntryIndex, { sound: F }));
      }, "callback")
    }).render(!0);
  }), (ce = e.querySelector("[data-action='change-sound-id']")) == null || ce.addEventListener("change", (O) => {
    const S = h(this, C, oe).call(this, d(this, q));
    if (!S) return;
    const w = h(this, C, ve).call(this, d(this, q));
    if (!(w != null && w.sound)) return;
    const N = { ...w.sound, id: O.target.value || void 0 };
    S.type === "timeline" ? h(this, C, B).call(this, (F) => F.updateEntry(S.index, { sound: N })) : S.type === "branch" && h(this, C, B).call(this, (F) => F.updateBranchEntry(S.index, S.branchIndex, S.branchEntryIndex, { sound: N }));
  }), (Nt = e.querySelector("[data-action='change-sound-volume']")) == null || Nt.addEventListener("input", (O) => {
    const S = h(this, C, oe).call(this, d(this, q));
    if (!S) return;
    const w = h(this, C, ve).call(this, d(this, q));
    if (!(w != null && w.sound)) return;
    const N = { ...w.sound, volume: Number(O.target.value) || 0.8 };
    S.type === "timeline" ? h(this, C, B).call(this, (F) => F.updateEntry(S.index, { sound: N })) : S.type === "branch" && h(this, C, B).call(this, (F) => F.updateBranchEntry(S.index, S.branchIndex, S.branchEntryIndex, { sound: N }));
  }), (Ue = e.querySelector("[data-action='change-sound-loop']")) == null || Ue.addEventListener("change", (O) => {
    const S = h(this, C, oe).call(this, d(this, q));
    if (!S) return;
    const w = h(this, C, ve).call(this, d(this, q));
    if (!(w != null && w.sound)) return;
    const N = { ...w.sound, loop: O.target.checked };
    S.type === "timeline" ? h(this, C, B).call(this, (F) => F.updateEntry(S.index, { sound: N })) : S.type === "branch" && h(this, C, B).call(this, (F) => F.updateBranchEntry(S.index, S.branchIndex, S.branchEntryIndex, { sound: N }));
  }), (Fe = e.querySelector("[data-action='change-sound-fadein']")) == null || Fe.addEventListener("change", (O) => {
    const S = h(this, C, oe).call(this, d(this, q));
    if (!S) return;
    const w = h(this, C, ve).call(this, d(this, q));
    if (!(w != null && w.sound)) return;
    const N = { ...w.sound, fadeIn: Number(O.target.value) || void 0 };
    S.type === "timeline" ? h(this, C, B).call(this, (F) => F.updateEntry(S.index, { sound: N })) : S.type === "branch" && h(this, C, B).call(this, (F) => F.updateBranchEntry(S.index, S.branchIndex, S.branchEntryIndex, { sound: N }));
  }), (He = e.querySelector("[data-action='change-sound-fadeout']")) == null || He.addEventListener("change", (O) => {
    const S = h(this, C, oe).call(this, d(this, q));
    if (!S) return;
    const w = h(this, C, ve).call(this, d(this, q));
    if (!(w != null && w.sound)) return;
    const N = { ...w.sound, fadeOut: Number(O.target.value) || void 0 };
    S.type === "timeline" ? h(this, C, B).call(this, (F) => F.updateEntry(S.index, { sound: N })) : S.type === "branch" && h(this, C, B).call(this, (F) => F.updateBranchEntry(S.index, S.branchIndex, S.branchEntryIndex, { sound: N }));
  }), (qe = e.querySelector("[data-action='change-sound-duration']")) == null || qe.addEventListener("change", (O) => {
    const S = h(this, C, oe).call(this, d(this, q));
    if (!S) return;
    const w = h(this, C, ve).call(this, d(this, q));
    if (!(w != null && w.sound)) return;
    const N = { ...w.sound, duration: Number(O.target.value) || 0 };
    S.type === "timeline" ? h(this, C, B).call(this, (F) => F.updateEntry(S.index, { sound: N })) : S.type === "branch" && h(this, C, B).call(this, (F) => F.updateBranchEntry(S.index, S.branchIndex, S.branchEntryIndex, { sound: N }));
  }), (lt = e.querySelector("[data-action='change-sound-fireandforget']")) == null || lt.addEventListener("change", (O) => {
    const S = h(this, C, oe).call(this, d(this, q));
    if (!S) return;
    const w = h(this, C, ve).call(this, d(this, q));
    if (!(w != null && w.sound)) return;
    const N = { ...w.sound, fireAndForget: O.target.checked };
    S.type === "timeline" ? h(this, C, B).call(this, (F) => F.updateEntry(S.index, { sound: N })) : S.type === "branch" && h(this, C, B).call(this, (F) => F.updateBranchEntry(S.index, S.branchIndex, S.branchEntryIndex, { sound: N }));
  }), (_e = e.querySelector("[data-action='change-stopsound-id']")) == null || _e.addEventListener("change", (O) => {
    const S = h(this, C, oe).call(this, d(this, q));
    S && (S.type === "timeline" ? h(this, C, B).call(this, (w) => w.updateEntry(S.index, { stopSound: O.target.value })) : S.type === "branch" && h(this, C, B).call(this, (w) => w.updateBranchEntry(S.index, S.branchIndex, S.branchEntryIndex, { stopSound: O.target.value })));
  }), (Ae = e.querySelector("[data-action='change-parallel-join']")) == null || Ae.addEventListener("change", (O) => {
    const S = h(this, C, oe).call(this, d(this, q));
    if (!S || S.type !== "timeline") return;
    const w = d(this, V).timeline[S.index];
    w != null && w.parallel && h(this, C, B).call(this, (N) => N.updateEntry(S.index, { parallel: { ...w.parallel, join: O.target.value } }));
  }), (jt = e.querySelector("[data-action='change-parallel-overflow']")) == null || jt.addEventListener("change", (O) => {
    const S = h(this, C, oe).call(this, d(this, q));
    if (!S || S.type !== "timeline") return;
    const w = d(this, V).timeline[S.index];
    w != null && w.parallel && h(this, C, B).call(this, (N) => N.updateEntry(S.index, { parallel: { ...w.parallel, overflow: O.target.value } }));
  }), (ct = e.querySelector("[data-action='edit-parallel-json']")) == null || ct.addEventListener("click", () => h(this, C, jd).call(this)), (kt = e.querySelector("[data-action='add-branch']")) == null || kt.addEventListener("click", () => {
    const O = h(this, C, oe).call(this, d(this, q));
    !O || O.type !== "timeline" || h(this, C, B).call(this, (S) => S.addBranch(O.index));
  }), e.querySelectorAll("[data-action='remove-branch']").forEach((O) => {
    O.addEventListener("click", () => {
      const S = Number(O.dataset.branchIndex), w = h(this, C, oe).call(this, d(this, q));
      !w || w.type !== "timeline" || Number.isNaN(S) || h(this, C, B).call(this, (N) => N.removeBranch(w.index, S));
    });
  }), e.querySelectorAll("[data-action='add-branch-step']").forEach((O) => {
    O.addEventListener("click", () => {
      const S = Number(O.dataset.branchIndex), w = h(this, C, oe).call(this, d(this, q));
      !w || w.type !== "timeline" || Number.isNaN(S) || h(this, C, B).call(this, (N) => N.addBranchEntry(w.index, S, { tweens: [] }));
    });
  }), e.querySelectorAll("[data-action='add-branch-delay']").forEach((O) => {
    O.addEventListener("click", () => {
      const S = Number(O.dataset.branchIndex), w = h(this, C, oe).call(this, d(this, q));
      !w || w.type !== "timeline" || Number.isNaN(S) || h(this, C, B).call(this, (N) => N.addBranchEntry(w.index, S, { delay: 1e3 }));
    });
  }), e.querySelectorAll("[data-action='add-branch-sound']").forEach((O) => {
    O.addEventListener("click", () => {
      const S = Number(O.dataset.branchIndex), w = h(this, C, oe).call(this, d(this, q));
      !w || w.type !== "timeline" || Number.isNaN(S) || h(this, C, B).call(this, (N) => N.addBranchEntry(w.index, S, { sound: { src: "", volume: 0.8, loop: !1, duration: 0, fireAndForget: !1 } }));
    });
  }), e.querySelectorAll("[data-action='add-branch-stopSound']").forEach((O) => {
    O.addEventListener("click", () => {
      const S = Number(O.dataset.branchIndex), w = h(this, C, oe).call(this, d(this, q));
      !w || w.type !== "timeline" || Number.isNaN(S) || h(this, C, B).call(this, (N) => N.addBranchEntry(w.index, S, { stopSound: "" }));
    });
  }), e.querySelectorAll("[data-action='remove-branch-entry']").forEach((O) => {
    O.addEventListener("click", () => {
      const S = Number(O.dataset.branchIndex), w = Number(O.dataset.branchEntryIndex), N = h(this, C, oe).call(this, d(this, q));
      !N || N.type !== "timeline" || Number.isNaN(S) || Number.isNaN(w) || h(this, C, B).call(this, (F) => F.removeBranchEntry(N.index, S, w));
    });
  }), e.querySelectorAll("[data-action='show-insert-menu']").forEach((O) => {
    O.addEventListener("click", (S) => {
      S.stopPropagation();
      const w = Number(O.dataset.insertIndex), N = O.dataset.lane;
      h(this, C, Md).call(this, O, w, N);
    });
  }), e.querySelectorAll("[data-action='insert-entry']").forEach((O) => {
    O.addEventListener("click", () => {
      if (!d(this, bn)) return;
      const S = O.dataset.insertType, { insertIndex: w } = d(this, bn);
      switch (S) {
        case "step":
          h(this, C, B).call(this, (N) => N.addStep(w));
          break;
        case "delay":
          h(this, C, B).call(this, (N) => N.addDelay(w));
          break;
        case "await":
          h(this, C, B).call(this, (N) => N.addAwait(w));
          break;
        case "emit":
          h(this, C, B).call(this, (N) => N.addEmit(w));
          break;
        case "parallel":
          h(this, C, B).call(this, (N) => N.addParallel(w));
          break;
        case "transitionTo":
          h(this, C, B).call(this, (N) => N.addTransitionTo(w));
          break;
        case "sound":
          h(this, C, B).call(this, (N) => N.addSound(w));
          break;
        case "stopSound":
          h(this, C, B).call(this, (N) => N.addStopSound(w));
          break;
      }
      h(this, C, Js).call(this);
    });
  }), document.addEventListener("click", (O) => {
    d(this, bn) && !O.target.closest(".cinematic-editor__insert-menu") && !O.target.closest("[data-action='show-insert-menu']") && h(this, C, Js).call(this);
  });
}, "#bindEvents"), // ── Insert menu ───────────────────────────────────────────────────────
Md = /* @__PURE__ */ c(function(e, i, r) {
  var l;
  const a = (l = this.element) == null ? void 0 : l.querySelector(".cinematic-editor__insert-menu");
  if (!a) return;
  const o = e.getBoundingClientRect();
  document.body.appendChild(a), a.style.display = "", a.style.position = "fixed", a.style.left = `${o.left}px`;
  const s = a.offsetHeight || 200;
  o.bottom + 4 + s > window.innerHeight ? a.style.top = `${o.top - s - 4}px` : a.style.top = `${o.bottom + 4}px`, A(this, bn, { insertIndex: i, lane: r });
}, "#showInsertMenu"), Js = /* @__PURE__ */ c(function() {
  var i, r;
  const e = document.body.querySelector(".cinematic-editor__insert-menu") ?? ((i = this.element) == null ? void 0 : i.querySelector(".cinematic-editor__insert-menu"));
  if (e) {
    e.style.display = "none";
    const a = (r = this.element) == null ? void 0 : r.querySelector(".cinematic-editor");
    a && e.parentNode !== a && a.appendChild(e);
  }
  A(this, bn, null);
}, "#hideInsertMenu"), // ── Lane computation ──────────────────────────────────────────────────
Nd = /* @__PURE__ */ c(function() {
  const e = d(this, V).timeline, i = h(this, C, kd).call(this), r = [], a = [], o = { emits: [], awaits: [] }, s = [];
  r.push({
    type: "setup",
    leftPx: 0,
    widthPx: qo,
    label: "Setup",
    entryPath: "setup",
    selected: d(this, q) === "setup"
  });
  let l = qo;
  for (let T = 0; T < e.length; T++) {
    const I = e[T], M = `timeline.${T}`, $ = d(this, q) === M;
    if (I.delay != null) {
      const k = Math.max(Cc, I.delay * i);
      r.push({
        type: "delay",
        leftPx: l,
        widthPx: k,
        label: `${I.delay}ms`,
        entryPath: M,
        selected: $
      }), l += k;
    } else if (I.await != null) {
      const k = I.await.event ?? "click", _ = k === "tile-click" ? "fa-hand-pointer" : k === "signal" ? "fa-bolt" : "fa-pause";
      r.push({
        type: "await",
        leftPx: l,
        widthPx: si,
        label: k,
        entryPath: M,
        selected: $,
        isGate: !0,
        gateIcon: _
      }), I.await.event === "signal" && o.awaits.push({
        signal: I.await.signal,
        centerPx: l + si / 2,
        laneIndex: 0
      }), l += si;
    } else if (I.emit != null)
      r.push({
        type: "emit",
        leftPx: l,
        widthPx: Fn,
        label: "Emit",
        entryPath: M,
        selected: $,
        isMarker: !0
      }), o.emits.push({
        signal: I.emit,
        centerPx: l + Fn / 2,
        laneIndex: 0
      });
    else if (I.transitionTo != null) {
      const k = I.transitionTo.cinematic || "?";
      r.push({
        type: "transitionTo",
        leftPx: l,
        widthPx: Ut,
        label: `→ ${k}`,
        entryPath: M,
        selected: $
      }), l += Ut;
    } else if (I.sound != null) {
      const k = (I.sound.src || "").split("/").pop() || "Sound", _ = I.sound.duration ?? 0;
      if (I.sound.fireAndForget ?? !1) {
        const G = _ > 0 ? Math.max(Ut, _ * i) : Ut, ie = (I.sound.loop ?? !1) && _ <= 0, U = {
          type: "sound",
          leftPx: l,
          widthPx: G,
          label: k,
          entryPath: M,
          selected: $,
          hasTrailingArrow: ie
        };
        let ee = !1;
        for (const R of s)
          if (R.rightEdgePx <= l) {
            R.blocks.push(U), R.rightEdgePx = l + G, ee = !0;
            break;
          }
        ee || s.push({
          label: "♫ F&F",
          blocks: [U],
          rightEdgePx: l + G
        });
      } else {
        const G = _ > 0 ? Math.max(Ut, _ * i) : Ut, ie = (I.sound.loop ?? !1) && _ <= 0;
        r.push({
          type: "sound",
          leftPx: l,
          widthPx: G,
          label: k,
          entryPath: M,
          selected: $,
          hasTrailingArrow: ie
        }), l += G;
      }
    } else if (I.stopSound != null)
      r.push({
        type: "stopSound",
        leftPx: l,
        widthPx: Fn,
        label: "Stop",
        entryPath: M,
        selected: $,
        isMarker: !0
      });
    else if (I.parallel != null) {
      const k = I.parallel.branches ?? [], _ = l, H = [];
      let G = 0;
      for (let U = 0; U < k.length; U++) {
        const ee = `timeline.${T}.parallel.branches.${U}`, { blocks: R, width: K, emits: Q, awaits: Z } = h(this, C, $d).call(this, k[U], _, i, ee);
        H.push({ label: `Br ${U + 1}`, blocks: R }), G = Math.max(G, K);
        const z = a.length * 10 + U + 1;
        for (const X of Q) o.emits.push({ ...X, laneIndex: z });
        for (const X of Z) o.awaits.push({ ...X, laneIndex: z });
      }
      const ie = Math.max(Ut, G);
      r.push({
        type: "parallel",
        leftPx: _,
        widthPx: ie,
        label: `${k.length} br`,
        entryPath: M,
        selected: $
      }), a.push({ parallelEntryIndex: T, startPx: _, lanes: H }), l += ie;
    } else {
      const { stepDuration: k, detachOverflow: _ } = h(this, C, zi).call(this, I), H = Math.max(Tc, k * i), G = _ > 0 ? Math.max(4, _ * i) : 0, ie = h(this, C, Ys).call(this, I);
      r.push({
        type: "step",
        leftPx: l,
        widthPx: H,
        detachTailPx: G,
        label: ie,
        entryPath: M,
        selected: $
      }), l += H;
    }
  }
  r.push({
    type: "landing",
    leftPx: l,
    widthPx: Ec,
    label: "Landing",
    entryPath: "landing",
    selected: d(this, q) === "landing"
  }), l += Ec;
  const u = a.flatMap((T) => T.lanes), f = u.length;
  for (const T of s)
    u.push({ label: T.label, blocks: T.blocks });
  const g = h(this, C, Fd).call(this, o, u.length), m = [];
  for (let T = 0; T < s.length; T++) {
    const I = f + T;
    for (const M of s[T].blocks) {
      const $ = M.leftPx, k = Hi + sn, _ = Hi + (1 + I) * sn + sn / 2;
      m.push({ x: $, y1: k, y2: _ });
    }
  }
  const y = h(this, C, Ks).call(this), b = h(this, C, Dd).call(this, y, i), p = h(this, C, _d).call(this, r), E = Hi + (1 + u.length) * sn;
  return {
    mainBlocks: r,
    subLanes: u,
    signalArcs: g,
    fafConnectors: m,
    timeMarkers: b,
    insertionPoints: p,
    totalWidthPx: Math.max(l, 200),
    swimlaneHeightPx: E,
    totalDurationMs: y
  };
}, "#computeLanes"), kd = /* @__PURE__ */ c(function() {
  var a;
  const e = (((a = this.position) == null ? void 0 : a.width) ?? 1100) - 70 - 100, i = h(this, C, Ks).call(this);
  if (i <= 0) return 0.1;
  const r = e / i;
  return Math.max(0.03, Math.min(0.5, r));
}, "#computeScale"), Ks = /* @__PURE__ */ c(function() {
  return d(this, V).timeline.reduce((e, i) => i.delay != null ? e + i.delay : i.await != null || i.emit != null || i.transitionTo != null ? e : i.sound != null ? e + (i.sound.fireAndForget ? 0 : i.sound.duration ?? 0) : i.stopSound != null ? e : i.parallel != null ? e + h(this, C, xd).call(this, i) : e + h(this, C, zi).call(this, i).stepDuration, 0);
}, "#computeTotalDuration"), xd = /* @__PURE__ */ c(function(e) {
  var a;
  const i = ((a = e.parallel) == null ? void 0 : a.branches) ?? [];
  let r = 0;
  for (const o of i) {
    let s = 0;
    for (const l of o)
      l.delay != null ? s += l.delay : l.await != null || l.emit != null || (l.sound != null ? s += l.sound.fireAndForget ? 0 : l.sound.duration ?? 0 : l.stopSound != null || (s += h(this, C, zi).call(this, l).stepDuration));
    r = Math.max(r, s);
  }
  return Math.max(500, r);
}, "#computeParallelDuration"), zi = /* @__PURE__ */ c(function(e) {
  const i = e.tweens ?? [];
  if (i.length === 0) return { stepDuration: 500, detachOverflow: 0 };
  let r = 0, a = 0;
  for (const l of i) {
    const u = l.duration ?? 0;
    l.detach ? a = Math.max(a, u) : r = Math.max(r, u);
  }
  const o = Math.max(500, r), s = Math.max(0, a - o);
  return { stepDuration: o, detachOverflow: s };
}, "#computeStepDurations"), $d = /* @__PURE__ */ c(function(e, i, r, a) {
  var f, g;
  const o = [], s = [], l = [];
  let u = i;
  for (let m = 0; m < e.length; m++) {
    const y = e[m], b = `${a}.${m}`, p = d(this, q) === b;
    if (y.delay != null) {
      const E = Math.max(Cc, y.delay * r);
      o.push({ type: "delay", leftPx: u, widthPx: E, label: `${y.delay}ms`, entryPath: b, selected: p }), u += E;
    } else if (y.await != null) {
      const E = ((f = y.await) == null ? void 0 : f.event) ?? "click", T = E === "tile-click" ? "fa-hand-pointer" : E === "signal" ? "fa-bolt" : "fa-pause";
      o.push({ type: "await", leftPx: u, widthPx: si, label: E, entryPath: b, selected: p, isGate: !0, gateIcon: T }), ((g = y.await) == null ? void 0 : g.event) === "signal" && l.push({ signal: y.await.signal, centerPx: u + si / 2 }), u += si;
    } else if (y.emit != null)
      o.push({ type: "emit", leftPx: u, widthPx: Fn, label: "emit", entryPath: b, selected: p, isMarker: !0 }), s.push({ signal: y.emit, centerPx: u + Fn / 2 });
    else if (y.sound != null) {
      const E = (y.sound.src || "").split("/").pop() || "Sound", T = y.sound.duration ?? 0;
      if (y.sound.fireAndForget ?? !1)
        o.push({ type: "sound", leftPx: u, widthPx: Fn, label: E, entryPath: b, selected: p, isMarker: !0 });
      else {
        const M = T > 0 ? Math.max(Ut, T * r) : Ut, $ = (y.sound.loop ?? !1) && T <= 0;
        o.push({ type: "sound", leftPx: u, widthPx: M, label: E, entryPath: b, selected: p, hasTrailingArrow: $ }), u += M;
      }
    } else if (y.stopSound != null)
      o.push({ type: "stopSound", leftPx: u, widthPx: Fn, label: "Stop", entryPath: b, selected: p, isMarker: !0 });
    else {
      const { stepDuration: E } = h(this, C, zi).call(this, y), T = Math.max(Tc, E * r), I = h(this, C, Ys).call(this, y);
      o.push({ type: "step", leftPx: u, widthPx: T, label: I, entryPath: b, selected: p }), u += T;
    }
  }
  return { blocks: o, width: u - i, emits: s, awaits: l };
}, "#computeBranchLane"), Ys = /* @__PURE__ */ c(function(e) {
  const i = e.tweens ?? [];
  if (i.length === 0) return "Empty";
  const r = i[0], a = (r.target ?? "").replace(/^tag:/, "#"), o = r.attribute ?? "";
  return r.type === "camera-pan" ? "Pan" : o === "alpha" ? `Fade ${a}` : o === "x" || o === "y" ? `Move ${a}` : r.type === "light-color" ? `Light ${a}` : r.type === "sound-prop" ? `Sound ${a}` : a ? `${a}` : "Step";
}, "#deriveStepLabel"), Fd = /* @__PURE__ */ c(function(e, i) {
  const r = [];
  for (const a of e.emits)
    for (const o of e.awaits) {
      if (a.signal !== o.signal) continue;
      const s = a.centerPx, l = h(this, C, Qs).call(this, a.laneIndex) + sn / 2, u = o.centerPx, f = h(this, C, Qs).call(this, o.laneIndex) + sn / 2, g = f - l, m = (s + u) / 2, y = l + Math.sign(g || 1) * Math.min(40, Math.abs(g) * 0.5 + 20), b = f - Math.sign(g || 1) * Math.min(40, Math.abs(g) * 0.5 + 20);
      r.push({
        pathD: `M ${s} ${l} C ${m} ${y}, ${m} ${b}, ${u} ${f}`,
        signal: a.signal
      });
    }
  return r;
}, "#computeSignalArcs"), Qs = /* @__PURE__ */ c(function(e) {
  return Hi + e * sn;
}, "#laneIndexToY"), Dd = /* @__PURE__ */ c(function(e, i) {
  const r = [];
  if (e <= 0) return r;
  const a = i * 1e3;
  let o;
  a >= 200 ? o = 500 : a >= 80 ? o = 1e3 : a >= 40 ? o = 2e3 : o = 5e3;
  for (let s = 0; s <= e + o; s += o) {
    const l = s >= 1e3 ? `${(s / 1e3).toFixed(s % 1e3 === 0 ? 0 : 1)}s` : `${s}ms`;
    r.push({ px: qo + s * i, label: l });
  }
  return r;
}, "#computeTimeMarkers"), _d = /* @__PURE__ */ c(function(e) {
  const i = [];
  for (let r = 0; r < e.length - 1; r++) {
    const a = e[r], o = e[r + 1], s = a.leftPx + a.widthPx + (o.leftPx - (a.leftPx + a.widthPx)) / 2, l = Hi + sn / 2;
    let u;
    if (a.entryPath === "setup")
      u = 0;
    else {
      if (a.entryPath === "landing")
        continue;
      if (a.entryPath.startsWith("timeline.")) {
        const g = a.entryPath.split(".");
        u = Number(g[1]) + 1;
      } else
        continue;
    }
    const f = o.entryPath === "landing";
    i.push({ leftPx: s, topPx: l, insertIndex: u, lane: "main", isEnd: f });
  }
  return i;
}, "#computeInsertionPoints"), // ── Path-based addressing ─────────────────────────────────────────────
oe = /* @__PURE__ */ c(function(e) {
  if (!e) return null;
  if (e === "setup") return { type: "setup" };
  if (e === "landing") return { type: "landing" };
  const i = e.split(".");
  if (i[0] === "timeline") {
    const r = Number(i[1]);
    if (i.length === 2) return { type: "timeline", index: r };
    if (i[2] === "parallel" && i[3] === "branches" && i.length >= 6)
      return {
        type: "branch",
        index: r,
        branchIndex: Number(i[4]),
        branchEntryIndex: Number(i[5])
      };
  }
  return null;
}, "#parseEntryPath"), ve = /* @__PURE__ */ c(function(e) {
  var r, a, o, s;
  const i = h(this, C, oe).call(this, e);
  return i ? i.type === "setup" ? d(this, V).setup : i.type === "landing" ? d(this, V).landing : i.type === "timeline" ? d(this, V).timeline[i.index] : i.type === "branch" ? (s = (o = (a = (r = d(this, V).timeline[i.index]) == null ? void 0 : r.parallel) == null ? void 0 : a.branches) == null ? void 0 : o[i.branchIndex]) == null ? void 0 : s[i.branchEntryIndex] : null : null;
}, "#getEntryAtPath"), Xs = /* @__PURE__ */ c(function(e) {
  const i = h(this, C, oe).call(this, e);
  return !i || i.type !== "timeline" ? null : i.index;
}, "#getTimelineIndexFromPath"), // ── State mutation ────────────────────────────────────────────────────
B = /* @__PURE__ */ c(function(e) {
  A(this, Be, d(this, Be).slice(0, d(this, ot) + 1)), d(this, Be).push(d(this, V)), d(this, Be).length > d(this, no) && d(this, Be).shift(), A(this, ot, d(this, Be).length - 1), A(this, V, e(d(this, V))), A(this, Ot, !0), this.render({ force: !0 });
}, "#mutate"), Zs = /* @__PURE__ */ c(function() {
  return d(this, ot) >= 0;
}, "#canUndo"), el = /* @__PURE__ */ c(function() {
  return d(this, ot) < d(this, Be).length - 1;
}, "#canRedo"), tl = /* @__PURE__ */ c(function() {
  d(this, C, Zs) && (d(this, ot) === d(this, Be).length - 1 && d(this, Be).push(d(this, V)), A(this, V, d(this, Be)[d(this, ot)]), To(this, ot)._--, A(this, Ot, !0), this.render({ force: !0 }));
}, "#undo"), nl = /* @__PURE__ */ c(function() {
  d(this, C, el) && (To(this, ot)._++, A(this, V, d(this, Be)[d(this, ot) + 1]), A(this, Ot, !0), this.render({ force: !0 }));
}, "#redo"), il = /* @__PURE__ */ c(function(e, i) {
  var r;
  d(this, q) != null && (A(this, yt, {
    ...d(this, yt) ?? {},
    entryPath: d(this, q),
    tweenIndex: e,
    patch: { ...((r = d(this, yt)) == null ? void 0 : r.patch) ?? {}, ...i }
  }), d(this, at) !== null && clearTimeout(d(this, at)), A(this, at, setTimeout(() => {
    A(this, at, null), h(this, C, fi).call(this);
  }, d(this, to))));
}, "#queueTweenChange"), fi = /* @__PURE__ */ c(function() {
  if (!d(this, yt)) return;
  const { entryPath: e, tweenIndex: i, patch: r } = d(this, yt);
  A(this, yt, null);
  const a = h(this, C, oe).call(this, e);
  if (a) {
    if (a.type === "timeline")
      A(this, V, d(this, V).updateTween(a.index, i, r));
    else if (a.type === "branch") {
      const o = h(this, C, ve).call(this, e);
      if (o) {
        const s = (o.tweens ?? []).map((l, u) => u === i ? { ...l, ...r } : l);
        A(this, V, d(this, V).updateBranchEntry(a.index, a.branchIndex, a.branchEntryIndex, { tweens: s }));
      }
    }
    A(this, Ot, !0);
  }
}, "#flushTweenChanges"), rl = /* @__PURE__ */ c(async function() {
  var e, i, r, a, o, s;
  if (d(this, Xe)) {
    if (d(this, yt) && h(this, C, fi).call(this), d(this, V).isStale(d(this, Xe))) {
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
        A(this, V, Dn.fromScene(d(this, Xe), d(this, V).activeCinematicName)), A(this, Ot, !1), A(this, Be, []), A(this, ot, -1), this.render({ force: !0 }), (i = (e = ui.notifications) == null ? void 0 : e.info) == null || i.call(e, "Cinematic reloaded from scene.");
        return;
      }
      if (!l) return;
    }
    try {
      await d(this, V).save(d(this, Xe)), A(this, V, Dn.fromScene(d(this, Xe), d(this, V).activeCinematicName)), A(this, Ot, !1), (a = (r = ui.notifications) == null ? void 0 : r.info) == null || a.call(r, "Cinematic saved."), this.render({ force: !0 });
    } catch (l) {
      console.error(`${L} | Cinematic save failed`, l), (s = (o = ui.notifications) == null ? void 0 : o.error) == null || s.call(o, "Failed to save cinematic data.");
    }
  }
}, "#onSave"), Pd = /* @__PURE__ */ c(async function() {
  var i, r, a, o, s;
  const e = (r = (i = game.modules.get(L)) == null ? void 0 : i.api) == null ? void 0 : r.cinematic;
  if (!(e != null && e.play)) {
    (o = (a = ui.notifications) == null ? void 0 : a.warn) == null || o.call(a, "Cinematic API not available.");
    return;
  }
  await e.play((s = d(this, Xe)) == null ? void 0 : s.id, d(this, V).activeCinematicName);
}, "#onPlay"), Rd = /* @__PURE__ */ c(async function() {
  var i, r, a, o, s;
  const e = (r = (i = game.modules.get(L)) == null ? void 0 : i.api) == null ? void 0 : r.cinematic;
  e != null && e.reset && (await e.reset((a = d(this, Xe)) == null ? void 0 : a.id, d(this, V).activeCinematicName), (s = (o = ui.notifications) == null ? void 0 : o.info) == null || s.call(o, "Cinematic tracking reset."));
}, "#onResetTracking"), Hd = /* @__PURE__ */ c(async function() {
  var i, r;
  const e = JSON.stringify(d(this, V).toJSON(), null, 2);
  try {
    await navigator.clipboard.writeText(e), (r = (i = ui.notifications) == null ? void 0 : i.info) == null || r.call(i, "Cinematic JSON copied to clipboard.");
  } catch {
    new Dialog({
      title: "Cinematic JSON",
      content: `<textarea style="width:100%;height:300px;font-family:monospace;font-size:0.8rem">${At(e)}</textarea>`,
      buttons: { ok: { label: "Close" } }
    }).render(!0);
  }
}, "#onExportJSON"), qd = /* @__PURE__ */ c(function() {
  var l, u;
  const e = d(this, V).toJSON(), { targets: i, unresolved: r } = wa(e), a = Xm(e, i), o = [
    ...r.map((f) => ({ path: "targets", level: "warn", message: `Unresolved target: "${f}"` })),
    ...a
  ];
  if (o.length === 0) {
    (u = (l = ui.notifications) == null ? void 0 : l.info) == null || u.call(l, "Cinematic validation passed — no issues found.");
    return;
  }
  const s = o.map((f) => {
    const g = f.level === "error" ? "fa-circle-xmark" : "fa-triangle-exclamation", m = f.level === "error" ? "#e74c3c" : "#f39c12";
    return `<li style="margin:0.3rem 0"><i class="fa-solid ${g}" style="color:${m};margin-right:0.3rem"></i><strong>${At(f.path)}</strong>: ${At(f.message)}</li>`;
  });
  new Dialog({
    title: "Cinematic Validation",
    content: `<p>${o.length} issue(s) found:</p><ul style="list-style:none;padding:0;max-height:300px;overflow:auto">${s.join("")}</ul>`,
    buttons: { ok: { label: "Close" } }
  }).render(!0);
}, "#onValidate"), Bd = /* @__PURE__ */ c(function() {
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
        callback: /* @__PURE__ */ c((e) => {
          var r, a, o, s;
          const i = e.find("#cinematic-import-json").val();
          try {
            const l = JSON.parse(i);
            if (typeof l != "object" || l === null || Array.isArray(l))
              throw new Error("Expected a JSON object");
            if (l.cinematics)
              h(this, C, B).call(this, () => new Dn(l));
            else if (l.timeline !== void 0) {
              const u = { version: 3, cinematics: { [d(this, V).activeCinematicName]: l } };
              h(this, C, B).call(this, () => new Dn(u, { cinematicName: d(this, V).activeCinematicName }));
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
}, "#onImportJSON"), al = /* @__PURE__ */ c(async function(e) {
  const i = e === "setup" ? d(this, V).setup : d(this, V).landing, r = JSON.stringify(i ?? {}, null, 2);
  new Dialog({
    title: `Edit ${e.charAt(0).toUpperCase() + e.slice(1)}`,
    content: `
				<p style="font-size:0.82rem;margin-bottom:0.4rem">JSON map of target selector → property overrides:</p>
				<textarea id="cinematic-json-edit" style="width:100%;height:200px;font-family:monospace;font-size:0.8rem">${At(r)}</textarea>
			`,
    buttons: {
      save: {
        label: "Apply",
        callback: /* @__PURE__ */ c((a) => {
          var s, l;
          const o = a.find("#cinematic-json-edit").val();
          try {
            const u = JSON.parse(o);
            e === "setup" ? h(this, C, B).call(this, (f) => f.setSetup(u)) : h(this, C, B).call(this, (f) => f.setLanding(u));
          } catch (u) {
            (l = (s = ui.notifications) == null ? void 0 : s.error) == null || l.call(s, `Invalid JSON: ${u.message}`);
          }
        }, "callback")
      },
      cancel: { label: "Cancel" }
    },
    default: "save"
  }).render(!0);
}, "#onEditJSON"), ol = /* @__PURE__ */ c(async function(e) {
  const i = h(this, C, ve).call(this, d(this, q));
  if (!i || i.delay != null) return;
  const r = i[e] ?? {}, a = JSON.stringify(r, null, 2);
  new Dialog({
    title: `Edit Step ${e.charAt(0).toUpperCase() + e.slice(1)}`,
    content: `
				<p style="font-size:0.82rem;margin-bottom:0.4rem">JSON map of target selector → property overrides:</p>
				<textarea id="cinematic-json-edit" style="width:100%;height:200px;font-family:monospace;font-size:0.8rem">${At(a)}</textarea>
			`,
    buttons: {
      save: {
        label: "Apply",
        callback: /* @__PURE__ */ c((o) => {
          var l, u;
          const s = o.find("#cinematic-json-edit").val();
          try {
            const f = JSON.parse(s), g = h(this, C, oe).call(this, d(this, q));
            (g == null ? void 0 : g.type) === "timeline" ? h(this, C, B).call(this, (m) => m.updateEntry(g.index, { [e]: f })) : (g == null ? void 0 : g.type) === "branch" && h(this, C, B).call(this, (m) => m.updateBranchEntry(g.index, g.branchIndex, g.branchEntryIndex, { [e]: f }));
          } catch (f) {
            (u = (l = ui.notifications) == null ? void 0 : l.error) == null || u.call(l, `Invalid JSON: ${f.message}`);
          }
        }, "callback")
      },
      cancel: { label: "Cancel" }
    },
    default: "save"
  }).render(!0);
}, "#onEditStepState"), jd = /* @__PURE__ */ c(async function() {
  const e = h(this, C, oe).call(this, d(this, q));
  if (!e || e.type !== "timeline") return;
  const i = d(this, V).timeline[e.index];
  if (!(i != null && i.parallel)) return;
  const r = JSON.stringify(i.parallel.branches ?? [], null, 2);
  new Dialog({
    title: "Edit Parallel Branches",
    content: `
				<p style="font-size:0.82rem;margin-bottom:0.4rem">JSON array of branch timelines:</p>
				<textarea id="cinematic-json-edit" style="width:100%;height:250px;font-family:monospace;font-size:0.8rem">${At(r)}</textarea>
			`,
    buttons: {
      save: {
        label: "Apply",
        callback: /* @__PURE__ */ c((a) => {
          var s, l;
          const o = a.find("#cinematic-json-edit").val();
          try {
            const u = JSON.parse(o);
            if (!Array.isArray(u)) throw new Error("Expected an array of branches");
            h(this, C, B).call(this, (f) => f.updateEntry(e.index, {
              parallel: { ...i.parallel, branches: u }
            }));
          } catch (u) {
            (l = (s = ui.notifications) == null ? void 0 : s.error) == null || l.call(s, `Invalid JSON: ${u.message}`);
          }
        }, "callback")
      },
      cancel: { label: "Cancel" }
    },
    default: "save"
  }).render(!0);
}, "#onEditParallelJSON"), // ── Detail panel builder ──────────────────────────────────────────────
Ud = /* @__PURE__ */ c(function(e) {
  var f, g, m, y, b;
  const i = h(this, C, oe).call(this, e);
  if (!i) return null;
  if (i.type === "setup")
    return {
      isSetup: !0,
      targetCount: Object.keys(d(this, V).setup ?? {}).length
    };
  if (i.type === "landing")
    return {
      isLanding: !0,
      targetCount: Object.keys(d(this, V).landing ?? {}).length
    };
  const r = h(this, C, ve).call(this, e);
  if (!r) return null;
  if (r.delay != null)
    return { type: "delay", isDelay: !0, delay: r.delay };
  if (r.await != null) {
    const p = ((f = r.await) == null ? void 0 : f.event) ?? "click", E = (g = r.await) == null ? void 0 : g.animation, T = /* @__PURE__ */ c((I) => Array.isArray(I) ? I.join(", ") : I ?? "", "toStr");
    return {
      type: "await",
      isAwait: !0,
      event: p,
      signal: ((m = r.await) == null ? void 0 : m.signal) ?? "",
      target: ((y = r.await) == null ? void 0 : y.target) ?? "",
      eventIsClick: p === "click",
      eventIsKeypress: p === "keypress",
      eventIsSignal: p === "signal",
      eventIsTileClick: p === "tile-click",
      animIdle: T(E == null ? void 0 : E.idle),
      animHover: T(E == null ? void 0 : E.hover),
      animDim: T(E == null ? void 0 : E.dim)
    };
  }
  if (r.emit != null)
    return { type: "emit", isEmit: !0, signal: r.emit };
  if (r.transitionTo != null) {
    const p = d(this, V).listCinematicNames();
    return {
      type: "transitionTo",
      isTransitionTo: !0,
      transitionCinematic: r.transitionTo.cinematic ?? "",
      transitionScene: r.transitionTo.scene ?? "",
      cinematicOptions: p.map((E) => ({
        value: E,
        label: E,
        selected: E === r.transitionTo.cinematic
      }))
    };
  }
  if (r.sound != null) {
    const p = (r.sound.src || "").split("/").pop() || "";
    return {
      type: "sound",
      isSound: !0,
      soundSrc: r.sound.src ?? "",
      soundFilename: p,
      soundId: r.sound.id ?? "",
      soundVolume: r.sound.volume ?? 0.8,
      soundLoop: r.sound.loop ?? !1,
      soundFadeIn: r.sound.fadeIn ?? "",
      soundFadeOut: r.sound.fadeOut ?? "",
      soundDuration: r.sound.duration ?? 0,
      soundFireAndForget: r.sound.fireAndForget ?? !1,
      soundModeForever: (r.sound.loop ?? !1) && !((r.sound.duration ?? 0) > 0)
    };
  }
  if (r.stopSound != null)
    return {
      type: "stopSound",
      isStopSound: !0,
      stopSoundId: r.stopSound
    };
  if (r.parallel != null && i.type === "timeline") {
    const p = r.parallel, E = p.join ?? "all", T = p.overflow ?? "detach", I = (p.branches ?? []).map((M, $) => ({
      branchIndex: $,
      label: `Branch ${$ + 1}`,
      entries: (M ?? []).map((k, _) => {
        var Z, z;
        const H = k.delay != null, G = k.await != null, ie = k.emit != null, U = k.sound != null, ee = k.stopSound != null, R = !H && !G && !ie && !U && !ee;
        let K, Q;
        return H ? (K = `${k.delay}ms`, Q = "delay") : G ? (K = "Await", Q = ((Z = k.await) == null ? void 0 : Z.event) ?? "click") : ie ? (K = "Emit", Q = k.emit || "(unnamed)") : U ? (K = "Sound", Q = (k.sound.src || "").split("/").pop() || "(none)") : ee ? (K = "Stop Sound", Q = k.stopSound || "(no id)") : (K = "Step", Q = `${((z = k.tweens) == null ? void 0 : z.length) ?? 0} tweens`), { branchEntryIndex: _, isDelay: H, isAwait: G, isEmit: ie, isSound: U, isStopSound: ee, isStep: R, label: K, sub: Q };
      })
    }));
    return {
      type: "parallel",
      isParallel: !0,
      branchCount: ((b = p.branches) == null ? void 0 : b.length) ?? 0,
      join: E,
      overflow: T,
      joinIsAll: E === "all",
      joinIsAny: E === "any",
      overflowIsDetach: T === "detach",
      overflowIsCancel: T === "cancel",
      branches: I
    };
  }
  const a = om(), o = (r.tweens ?? []).map((p, E) => {
    const T = `${e}.tweens.${E}`, I = d(this, yn).has(T), M = p.type ?? "tile-prop", $ = yc.find((G) => G.value === M), k = bc[M], _ = (k == null ? void 0 : k.form) ?? "prop", H = p.mode ?? "oklch";
    return {
      tweenIndex: E,
      isExpanded: I,
      type: M,
      typeLabel: ($ == null ? void 0 : $.label) ?? p.type ?? "Tile Prop",
      target: p.target ?? "",
      attribute: p.attribute ?? "",
      attributePlaceholder: (k == null ? void 0 : k.placeholder) ?? "",
      value: p.value ?? "",
      duration: p.duration ?? 0,
      easing: p.easing ?? "",
      detach: p.detach ?? !1,
      // Form group flags
      formGroup: _,
      formIsProp: _ === "prop",
      formIsParticles: _ === "particles",
      formIsCamera: _ === "camera",
      formIsLightColor: _ === "lightColor",
      formIsLightState: _ === "lightState",
      // Camera fields
      camX: p.x ?? "",
      camY: p.y ?? "",
      camScale: p.scale ?? "",
      // Light-color fields
      toColor: p.toColor ?? "#ffffff",
      toAlpha: p.toAlpha ?? "",
      colorMode: H,
      colorModeIsOklch: H === "oklch",
      colorModeIsHsl: H === "hsl",
      colorModeIsRgb: H === "rgb",
      // Light-state fields
      enabled: p.enabled ?? !0,
      typeOptions: yc.map((G) => ({
        ...G,
        selected: G.value === (p.type ?? "tile-prop")
      })),
      easingOptions: [
        { value: "", label: "(default)", selected: !p.easing },
        ...a.map((G) => ({
          value: G,
          label: G,
          selected: p.easing === G
        }))
      ]
    };
  }), s = h(this, C, Vd).call(this, r), l = Object.keys(r.before ?? {}), u = Object.keys(r.after ?? {});
  return {
    type: "step",
    isStep: !0,
    isDelay: !1,
    stepNumber: h(this, C, zd).call(this, e),
    maxDuration: s,
    tweens: o,
    beforeSummary: l.length ? `${l.length} target${l.length !== 1 ? "s" : ""}` : "(none)",
    afterSummary: u.length ? `${u.length} target${u.length !== 1 ? "s" : ""}` : "(none)"
  };
}, "#buildDetail"), // ── Helpers ────────────────────────────────────────────────────────────
Vd = /* @__PURE__ */ c(function(e) {
  var i;
  return (i = e.tweens) != null && i.length ? Math.max(500, ...e.tweens.map((r) => r.duration ?? 0)) : 500;
}, "#maxTweenDuration"), zd = /* @__PURE__ */ c(function(e) {
  var r, a, o;
  const i = h(this, C, oe).call(this, e);
  if (!i) return 0;
  if (i.type === "timeline") {
    let s = 0;
    for (let l = 0; l <= i.index; l++) {
      const u = d(this, V).timeline[l];
      u && u.delay == null && u.await == null && u.emit == null && u.parallel == null && u.transitionTo == null && u.sound == null && u.stopSound == null && s++;
    }
    return s;
  }
  if (i.type === "branch") {
    const s = ((o = (a = (r = d(this, V).timeline[i.index]) == null ? void 0 : r.parallel) == null ? void 0 : a.branches) == null ? void 0 : o[i.branchIndex]) ?? [];
    let l = 0;
    for (let u = 0; u <= i.branchEntryIndex; u++) {
      const f = s[u];
      f && f.delay == null && f.await == null && f.emit == null && f.sound == null && f.stopSound == null && l++;
    }
    return l;
  }
  return 0;
}, "#stepNumberForPath"), Gd = /* @__PURE__ */ c(function() {
  var a, o;
  const e = /* @__PURE__ */ new Set(), r = (a = d(this, V).data.cinematics) == null ? void 0 : a[d(this, V).activeCinematicName];
  if (!r) return 0;
  if (r.setup) for (const s of Object.keys(r.setup)) e.add(s);
  if (r.landing) for (const s of Object.keys(r.landing)) e.add(s);
  for (const s of r.timeline ?? []) {
    if (s.tweens)
      for (const l of s.tweens)
        l.target && e.add(l.target);
    if (s.before) for (const l of Object.keys(s.before)) e.add(l);
    if (s.after) for (const l of Object.keys(s.after)) e.add(l);
    if ((o = s.parallel) != null && o.branches) {
      for (const l of s.parallel.branches)
        for (const u of l)
          if (u.tweens)
            for (const f of u.tweens)
              f.target && e.add(f.target);
    }
  }
  return e.size;
}, "#countUniqueTargets"), c(Tt, "CinematicEditorApplication"), Me(Tt, "APP_ID", `${L}-cinematic-editor`), Me(Tt, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  ze(Tt, Tt, "DEFAULT_OPTIONS"),
  {
    id: Tt.APP_ID,
    classes: Array.from(
      /* @__PURE__ */ new Set([...((xc = ze(Tt, Tt, "DEFAULT_OPTIONS")) == null ? void 0 : xc.classes) ?? [], "eidolon-cinematic-editor-window", "themed"])
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
)), Me(Tt, "PARTS", {
  content: {
    template: `modules/${L}/templates/cinematic-editor.html`
  }
});
let Ws = Tt;
const Wd = /* @__PURE__ */ new Map();
function $i(t, n) {
  Wd.set(t, n);
}
c($i, "registerBehaviour");
function Jd(t) {
  return Wd.get(t);
}
c(Jd, "getBehaviour");
$i("float", (t, n = {}) => {
  const e = t.mesh;
  if (!e) return { update() {
  }, detach() {
  } };
  const i = n.speed ?? 0.04, r = n.amplitude ?? 3, a = e.position.y;
  let o = 0;
  return {
    update(s) {
      o += s, e.position.y = a + Math.sin(o * i) * r;
    },
    detach() {
      e.position.y = a;
    }
  };
});
$i("pulse", (t, n = {}) => {
  const e = t.mesh;
  if (!e) return { update() {
  }, detach() {
  } };
  const i = n.minAlpha ?? 0.6, r = n.maxAlpha ?? 1, a = n.speed ?? 0.05, o = e.alpha;
  let s = 0;
  return {
    update(l) {
      s += l;
      const u = (Math.sin(s * a) + 1) / 2;
      e.alpha = i + (r - i) * u;
    },
    detach() {
      e.alpha = o;
    }
  };
});
$i("scale", (t, n = {}) => {
  const e = t.mesh;
  if (!e) return { update() {
  }, detach() {
  } };
  const i = n.factor ?? 1.12, r = n.durationFrames ?? 15, a = Sr(n.easing ?? "easeOutCubic"), o = e.scale.x, s = e.scale.y, l = o * i, u = s * i;
  let f = 0;
  return {
    update(g) {
      if (f < r) {
        f += g;
        const m = Math.min(f / r, 1), y = a(m);
        e.scale.x = o + (l - o) * y, e.scale.y = s + (u - s) * y;
      }
    },
    detach() {
      e.scale.x = o, e.scale.y = s;
    }
  };
});
$i("glow", (t, n = {}) => {
  var m, y;
  const e = t.mesh;
  if (!((m = e == null ? void 0 : e.texture) != null && m.baseTexture)) return { update() {
  }, detach() {
  } };
  const i = n.color ?? 4513279, r = n.alpha ?? 0.5, a = n.blur ?? 8, o = n.pulseSpeed ?? 0.03, s = PIXI.Sprite.from(e.texture);
  s.anchor.set(e.anchor.x, e.anchor.y), s.width = e.width, s.height = e.height, s.position.copyFrom(e.position), s.angle = e.angle, s.alpha = r, s.tint = i;
  const l = PIXI.BlurFilter ?? ((y = PIXI.filters) == null ? void 0 : y.BlurFilter), u = new l(a);
  s.filters = [u];
  const f = t.children.indexOf(e);
  f > 0 ? t.addChildAt(s, f) : t.addChildAt(s, 0);
  let g = 0;
  return {
    update(b) {
      g += b;
      const p = (Math.sin(g * o) + 1) / 2;
      s.alpha = r * (0.5 + 0.5 * p);
    },
    detach() {
      s.parent && s.parent.removeChild(s), s.destroy({ children: !0 });
    }
  };
});
$i("none", () => ({ update() {
}, detach() {
} }));
const _r = {
  idle: ["float", "glow"],
  hover: ["scale"],
  dim: ["none"]
};
function np(t) {
  if (!t) return { ..._r };
  const n = /* @__PURE__ */ c((e, i) => e === void 0 ? i : typeof e == "string" ? [e] : Array.isArray(e) ? e : i, "normalize");
  return {
    idle: n(t.idle, _r.idle),
    hover: n(t.hover, _r.hover),
    dim: n(t.dim, _r.dim)
  };
}
c(np, "normalizeConfig");
var yr, Ii, Oi, Yn, wn, On, sl, ll;
const $l = class $l {
  /**
   * @param {PlaceableObject} placeable
   * @param {object|undefined} animationConfig  Raw animation config from the await entry
   */
  constructor(n, e) {
    x(this, On);
    x(this, yr);
    x(this, Ii);
    x(this, Oi, null);
    x(this, Yn, []);
    x(this, wn, null);
    A(this, yr, n), A(this, Ii, np(e));
  }
  /** Current animation state name. */
  get state() {
    return d(this, Oi);
  }
  /**
   * Start animating in the given state.
   * @param {string} [state="idle"]
   */
  start(n = "idle") {
    h(this, On, sl).call(this, n), A(this, wn, (e) => {
      for (const i of d(this, Yn)) i.update(e);
    }), canvas.app.ticker.add(d(this, wn));
  }
  /**
   * Transition to a new state. Detaches current behaviours, attaches new ones.
   * No-op if already in the requested state.
   * @param {string} state
   */
  setState(n) {
    n !== d(this, Oi) && (h(this, On, ll).call(this), h(this, On, sl).call(this, n));
  }
  /**
   * Full cleanup — detach all behaviours and remove ticker.
   */
  detach() {
    var n, e;
    h(this, On, ll).call(this), d(this, wn) && ((e = (n = canvas.app) == null ? void 0 : n.ticker) == null || e.remove(d(this, wn)), A(this, wn, null));
  }
};
yr = new WeakMap(), Ii = new WeakMap(), Oi = new WeakMap(), Yn = new WeakMap(), wn = new WeakMap(), On = new WeakSet(), // ── Private ──────────────────────────────────────────────────────────
sl = /* @__PURE__ */ c(function(n) {
  A(this, Oi, n);
  const e = d(this, Ii)[n] ?? d(this, Ii).idle ?? ["none"];
  for (const i of e) {
    const r = Jd(i);
    if (!r) {
      console.warn(`TileAnimator: unknown behaviour "${i}"`);
      continue;
    }
    d(this, Yn).push(r(d(this, yr)));
  }
}, "#attachBehaviours"), ll = /* @__PURE__ */ c(function() {
  for (const n of d(this, Yn)) n.detach();
  A(this, Yn, []);
}, "#detachBehaviours"), c($l, "TileAnimator");
let La = $l;
const ip = "cinematic", Bo = 3;
let Ie = null, Hn = null, qn = null, li = 0, Pn = null;
function Ol(t, n = "default") {
  return `cinematic-progress-${t}-${n}`;
}
c(Ol, "progressFlagKey");
let Zr = 0;
function rp(t, n, e) {
  Zr++, !(Zr < 3) && (Zr = 0, game.user.setFlag(L, Ol(t, n), {
    step: e,
    timestamp: Date.now()
  }).catch(() => {
  }));
}
c(rp, "saveProgress");
function ea(t, n = "default") {
  Zr = 0, game.user.unsetFlag(L, Ol(t, n)).catch(() => {
  });
}
c(ea, "clearProgress");
function Kd(t, n = "default", e = 3e5) {
  const i = game.user.getFlag(L, Ol(t, n));
  return !i || typeof i.step != "number" || typeof i.timestamp != "number" || Date.now() - i.timestamp > e ? null : i;
}
c(Kd, "getSavedProgress");
function Fi(t, n = "default") {
  return `cinematic-seen-${t}-${n}`;
}
c(Fi, "seenFlagKey");
function Sc(t, n = "default") {
  return !!game.user.getFlag(L, Fi(t, n));
}
c(Sc, "hasSeenCinematic");
function ap(t, n) {
  var e;
  return t == null ? null : typeof t != "object" || Array.isArray(t) ? (console.warn(`[${L}] Cinematic: invalid data for ${n} (expected object). Ignoring.`), null) : t.trigger !== void 0 && typeof t.trigger != "string" ? (console.warn(`[${L}] Cinematic: invalid 'trigger' on ${n} (expected string). Ignoring.`), null) : t.tracking !== void 0 && typeof t.tracking != "boolean" ? (console.warn(`[${L}] Cinematic: invalid 'tracking' on ${n} (expected boolean). Ignoring.`), null) : t.synchronized !== void 0 && typeof t.synchronized != "boolean" ? (console.warn(`[${L}] Cinematic: invalid 'synchronized' on ${n} (expected boolean). Ignoring.`), null) : t.setup !== void 0 && (typeof t.setup != "object" || t.setup === null || Array.isArray(t.setup)) ? (console.warn(`[${L}] Cinematic: invalid 'setup' on ${n} (expected object). Ignoring.`), null) : t.landing !== void 0 && (typeof t.landing != "object" || t.landing === null || Array.isArray(t.landing)) ? (console.warn(`[${L}] Cinematic: invalid 'landing' on ${n} (expected object). Ignoring.`), null) : t.timeline !== void 0 && !Array.isArray(t.timeline) ? (console.warn(`[${L}] Cinematic: invalid 'timeline' on ${n} (expected array). Ignoring.`), null) : ((e = t.timeline) != null && e.length && (t.timeline = t.timeline.filter((i, r) => !i || typeof i != "object" || Array.isArray(i) ? (console.warn(`[${L}] Cinematic: timeline[${r}] on ${n} is not a valid object, removing.`), !1) : !0)), t);
}
c(ap, "validateSingleCinematic");
function wo(t) {
  const n = t ? game.scenes.get(t) : canvas.scene;
  let e = (n == null ? void 0 : n.getFlag(L, ip)) ?? null;
  if (e == null) return null;
  if (typeof e != "object" || Array.isArray(e))
    return console.warn(`[${L}] Cinematic: invalid flag data on scene ${n == null ? void 0 : n.id} (expected object). Ignoring.`), null;
  if ((e.version ?? 1) < 3) {
    const { version: i, ...r } = e;
    e = { version: Bo, cinematics: { default: r } };
  }
  if (e.version > Bo)
    return console.warn(`[${L}] Cinematic: scene ${n == null ? void 0 : n.id} has version ${e.version}, runtime supports up to ${Bo}. Skipping.`), null;
  if (!e.cinematics || typeof e.cinematics != "object")
    return console.warn(`[${L}] Cinematic: no 'cinematics' map on scene ${n == null ? void 0 : n.id}. Ignoring.`), null;
  for (const [i, r] of Object.entries(e.cinematics)) {
    const a = ap(r, `scene ${n == null ? void 0 : n.id} cinematic "${i}"`);
    a ? e.cinematics[i] = a : delete e.cinematics[i];
  }
  return Object.keys(e.cinematics).length === 0 ? null : e;
}
c(wo, "getCinematicData");
function Ia(t, n = "default") {
  var i;
  const e = wo(t);
  return ((i = e == null ? void 0 : e.cinematics) == null ? void 0 : i[n]) ?? null;
}
c(Ia, "getNamedCinematic");
function op(t) {
  const n = wo(t);
  return n ? Object.keys(n.cinematics) : [];
}
c(op, "listCinematicNames");
function sp() {
  return game.ready ? Promise.resolve() : new Promise((t) => Hooks.once("ready", t));
}
c(sp, "waitForReady");
async function lp(t = 1e4) {
  var e, i;
  const n = (i = (e = game.modules.get(L)) == null ? void 0 : e.api) == null ? void 0 : i.tween;
  return n != null && n.Timeline ? n.Timeline : new Promise((r) => {
    const a = Date.now(), o = setTimeout(() => {
      var l, u;
      (u = (l = ui.notifications) == null ? void 0 : l.info) == null || u.call(l, `[${L}] Cinematic: waiting for tween engine...`);
    }, 2e3), s = setInterval(() => {
      var u, f, g, m;
      const l = (f = (u = game.modules.get(L)) == null ? void 0 : u.api) == null ? void 0 : f.tween;
      l != null && l.Timeline ? (clearInterval(s), clearTimeout(o), r(l.Timeline)) : Date.now() - a > t && (clearInterval(s), clearTimeout(o), console.warn(`[${L}] Cinematic: tween API not available after ${t}ms.`), (m = (g = ui.notifications) == null ? void 0 : g.warn) == null || m.call(g, `[${L}] Cinematic: tween engine unavailable — cinematic cannot play.`), r(null));
    }, 200);
  });
}
c(lp, "waitForTweenAPI");
async function cl(t = 5e3) {
  var n;
  return window.Tagger ?? ((n = game.modules.get("tagger")) == null ? void 0 : n.api) ? !0 : new Promise((e) => {
    const i = Date.now(), r = setInterval(() => {
      var a;
      window.Tagger ?? ((a = game.modules.get("tagger")) == null ? void 0 : a.api) ? (clearInterval(r), e(!0)) : Date.now() - i > t && (clearInterval(r), console.warn(`[${L}] Cinematic: Tagger API not available after ${t}ms.`), e(!1));
    }, 200);
  });
}
c(cl, "waitForTagger");
async function Ti(t, n = "default", e = null) {
  var p, E, T, I, M;
  const i = t ?? ((p = canvas.scene) == null ? void 0 : p.id);
  if (!i) return;
  const r = `${i}:${n}`;
  if (e || (e = /* @__PURE__ */ new Set()), e.has(r)) {
    console.warn(`[${L}] Cinematic: circular transition detected at "${r}". Stopping chain.`), (T = (E = ui.notifications) == null ? void 0 : E.warn) == null || T.call(E, "Cinematic: circular transition detected, stopping.");
    return;
  }
  e.add(r), (Ie == null ? void 0 : Ie.status) === "running" && Ie.cancel("replaced"), Ie = null;
  const a = Ia(i, n);
  if (!a) {
    console.warn(`[${L}] Cinematic: no cinematic "${n}" on scene ${i}.`);
    return;
  }
  const o = await lp();
  if (!o || ((I = canvas.scene) == null ? void 0 : I.id) !== i || (await cl(), ((M = canvas.scene) == null ? void 0 : M.id) !== i)) return;
  const { targets: s, unresolved: l } = wa(a);
  if (console.log(`[${L}] Cinematic "${n}": resolved ${s.size} targets:`, [...s.entries()].map(([$, k]) => {
    var _, H;
    return `${$} → ${((_ = k == null ? void 0 : k.document) == null ? void 0 : _.uuid) ?? ((H = k == null ? void 0 : k.constructor) == null ? void 0 : H.name) ?? "?"}`;
  })), l.length && console.warn(`[${L}] Cinematic "${n}": skipping ${l.length} unresolved: ${l.join(", ")}`), s.size === 0) {
    console.warn(`[${L}] Cinematic "${n}": no targets could be resolved on scene ${i}.`);
    return;
  }
  const u = Vm(a);
  Hn = Um(u, s), qn = s;
  const f = Kd(i, n), g = f ? f.step : void 0;
  g != null && console.log(`[${L}] Cinematic "${n}": resuming from step ${g} (saved ${Date.now() - f.timestamp}ms ago)`);
  const { tl: m, transitionTo: y } = Qm(a, s, o, {
    skipToStep: g,
    onStepComplete: /* @__PURE__ */ c(($) => rp(i, n, $), "onStepComplete"),
    timelineName: `cinematic-${i}-${n}`
  });
  console.log(`[${L}] Cinematic "${n}": timeline built, JSON:`, JSON.stringify(m.toJSON())), m.onComplete(async () => {
    if (Ie = null, Hn = null, qn = null, ea(i, n), Ro(), a.landing)
      try {
        st(a.landing, s), canvas.perception.update({ refreshLighting: !0, refreshVision: !0 });
      } catch ($) {
        console.error(`[${L}] Cinematic "${n}": error applying landing state on complete for scene ${i}:`, $);
      }
    if (a.tracking !== !1 && await game.user.setFlag(L, Fi(i, n), !0), console.log(`[${L}] Cinematic "${n}" complete on scene ${i}.`), y) {
      const $ = y.cinematic, k = y.scene;
      if (!$)
        console.warn(`[${L}] Cinematic "${n}": transitionTo has no cinematic name, ignoring.`);
      else if (!k || k === i)
        console.log(`[${L}] Cinematic "${n}": transitioning to "${$}" on same scene.`), Ti(i, $, e);
      else {
        console.log(`[${L}] Cinematic "${n}": transitioning to "${$}" on scene ${k}.`), Pn = { sceneId: k, cinematicName: $, visitedChain: e };
        const _ = game.scenes.get(k);
        _ ? _.view() : (console.warn(`[${L}] Cinematic: cross-scene transition target scene "${k}" not found.`), Pn = null);
      }
    }
  }), m.onCancel(() => {
    if (Ie = null, Hn = null, qn = null, ea(i, n), Ro(), console.log(`[${L}] Cinematic "${n}" cancelled on scene ${i}.`), a.landing)
      try {
        st(a.landing, s), canvas.perception.update({ refreshLighting: !0, refreshVision: !0 });
      } catch ($) {
        console.error(`[${L}] Cinematic "${n}": error applying landing state after cancel on scene ${i}:`, $);
      }
  }), m.onError(($) => {
    if (Ie = null, Hn = null, qn = null, ea(i, n), Ro(), console.error(`[${L}] Cinematic "${n}" error on scene ${i}:`, $), a.landing)
      try {
        st(a.landing, s), canvas.perception.update({ refreshLighting: !0, refreshVision: !0 });
      } catch (k) {
        console.error(`[${L}] Cinematic "${n}": error applying landing state after error on scene ${i}:`, k);
      }
  });
  const b = a.synchronized === !0 && game.user.isGM;
  Ie = m.run({
    broadcast: b,
    commit: b
  }), console.log(`[${L}] Cinematic "${n}": timeline started, handle status: ${Ie.status}`);
}
c(Ti, "playCinematic");
async function cp(t, n = "default") {
  var i;
  const e = t ?? ((i = canvas.scene) == null ? void 0 : i.id);
  e && (await game.user.unsetFlag(L, Fi(e, n)), console.log(`[${L}] Cinematic: cleared seen flag for "${n}" on scene ${e}.`));
}
c(cp, "resetCinematic");
async function up(t, n, e = "default") {
  var a;
  if (!game.user.isGM) return;
  const i = t ?? ((a = canvas.scene) == null ? void 0 : a.id);
  if (!i || !n) return;
  const r = game.users.get(n);
  r && (await r.unsetFlag(L, Fi(i, e)), console.log(`[${L}] Cinematic: cleared seen flag for user ${r.name} on "${e}" scene ${i}.`));
}
c(up, "resetCinematicForUser");
async function dp(t, n = "default") {
  var a;
  if (!game.user.isGM) return;
  const e = t ?? ((a = canvas.scene) == null ? void 0 : a.id);
  if (!e) return;
  const i = Fi(e, n), r = game.users.map((o) => o.getFlag(L, i) ? o.unsetFlag(L, i) : Promise.resolve());
  await Promise.all(r), console.log(`[${L}] Cinematic: cleared seen flag for all users on "${n}" scene ${e}.`);
}
c(dp, "resetCinematicForAll");
function fp(t, n = "default") {
  var r;
  const e = t ?? ((r = canvas.scene) == null ? void 0 : r.id);
  if (!e) return [];
  const i = Fi(e, n);
  return game.users.map((a) => ({
    userId: a.id,
    name: a.name,
    color: a.color ?? "#888888",
    isGM: a.isGM,
    seen: !!a.getFlag(L, i)
  }));
}
c(fp, "getSeenStatus");
function hp(t, n) {
  var i;
  const e = t ?? ((i = canvas.scene) == null ? void 0 : i.id);
  return n ? Ia(e, n) != null : wo(e) != null;
}
c(hp, "hasCinematic");
function gp() {
  if (!Hn || !qn) {
    console.warn(`[${L}] Cinematic: no snapshot available for revert.`);
    return;
  }
  (Ie == null ? void 0 : Ie.status) === "running" && Ie.cancel("reverted"), Ie = null;
  try {
    st(Hn, qn), canvas.perception.update({ refreshLighting: !0, refreshVision: !0 }), console.log(`[${L}] Cinematic: reverted to pre-cinematic state.`);
  } catch (t) {
    console.error(`[${L}] Cinematic: error during revert:`, t);
  }
  Hn = null, qn = null;
}
c(gp, "revertCinematic");
async function mp() {
  const t = ++li;
  if (console.log(`[${L}] Cinematic: canvasReady fired, gen=${t}, game.ready=${game.ready}`), await sp(), t !== li) return;
  console.log(`[${L}] Cinematic: game is ready`);
  const n = canvas.scene;
  if (!n) {
    console.log(`[${L}] Cinematic: no canvas.scene, exiting`);
    return;
  }
  if (Pn && Pn.sceneId === n.id) {
    const a = Pn;
    Pn = null, console.log(`[${L}] Cinematic: picking up pending transition to "${a.cinematicName}" on scene ${n.id}`);
    try {
      await Ti(n.id, a.cinematicName, a.visitedChain);
    } catch (o) {
      console.error(`[${L}] Cinematic: error during pending transition playback on scene ${n.id}:`, o);
    }
    return;
  }
  Pn = null;
  const e = wo(n.id);
  if (!e) {
    console.log(`[${L}] Cinematic: no cinematic flag on scene ${n.id}, exiting`);
    return;
  }
  console.log(`[${L}] Cinematic: found ${Object.keys(e.cinematics).length} cinematic(s) on scene ${n.id}`);
  const i = [];
  for (const [a, o] of Object.entries(e.cinematics))
    (!o.trigger || o.trigger === "canvasReady") && i.push({ name: a, data: o });
  if (i.length === 0) {
    console.log(`[${L}] Cinematic: no canvasReady cinematics on scene ${n.id}, exiting`);
    return;
  }
  for (const { name: a } of i) {
    const o = Kd(n.id, a);
    if (t !== li) return;
    if (o) {
      console.log(`[${L}] Cinematic "${a}": found saved progress at step ${o.step}, resuming...`);
      try {
        await Ti(n.id, a);
      } catch (s) {
        console.error(`[${L}] Cinematic "${a}": error during resumed playback on scene ${n.id}:`, s);
      }
      return;
    }
  }
  let r = null;
  for (const { name: a, data: o } of i)
    if (!(o.tracking !== !1 && Sc(n.id, a))) {
      r = { name: a, data: o };
      break;
    }
  if (!r) {
    if (console.log(`[${L}] Cinematic: all canvasReady cinematics already seen on scene ${n.id}`), pp(n.id, i), (Ie == null ? void 0 : Ie.status) === "running" && Ie.cancel("already-seen"), Ie = null, await cl(), t !== li) return;
    for (const { name: a, data: o } of i)
      if (o.landing)
        try {
          const { targets: s } = wa(o);
          st(o.landing, s);
        } catch (s) {
          console.error(`[${L}] Cinematic "${a}": error applying landing state (already seen) on scene ${n.id}:`, s);
        }
    canvas.perception.update({ refreshLighting: !0, refreshVision: !0 });
    return;
  }
  if (t === li && (console.log(`[${L}] Cinematic: playing first unseen cinematic "${r.name}"...`), await cl(), t === li)) {
    for (const { name: a, data: o } of i) {
      if (a === r.name) continue;
      if (o.tracking !== !1 && Sc(n.id, a) && o.landing)
        try {
          const { targets: l } = wa(o);
          st(o.landing, l);
        } catch (l) {
          console.error(`[${L}] Cinematic "${a}": error applying landing state (already seen) on scene ${n.id}:`, l);
        }
    }
    try {
      await Ti(n.id, r.name);
    } catch (a) {
      console.error(`[${L}] Cinematic "${r.name}": error during playback on scene ${n.id}:`, a);
    }
  }
}
c(mp, "onCanvasReady");
function pp(t, n) {
  for (const { name: e } of n)
    ea(t, e);
}
c(pp, "clearAllCanvasReadyProgress");
function yp(t = 3e5) {
  var i;
  const n = (i = game.user.flags) == null ? void 0 : i[L];
  if (!n) return;
  const e = Date.now();
  for (const r of Object.keys(n)) {
    if (!r.startsWith("cinematic-progress-")) continue;
    const a = n[r];
    if (!a || typeof a.timestamp != "number") {
      game.user.unsetFlag(L, r).catch(() => {
      });
      continue;
    }
    e - a.timestamp > t && (console.log(`[${L}] Cinematic: cleaning up stale progress flag "${r}" (age: ${e - a.timestamp}ms)`), game.user.unsetFlag(L, r).catch(() => {
    }));
  }
}
c(yp, "cleanupStaleProgressFlags");
function bp() {
  Hooks.on("getSceneControlButtons", (t) => {
    if (!game.user.isGM) return;
    const n = Array.isArray(t) ? t : t instanceof Map ? Array.from(t.values()) : Object.values(t);
    if (!n.length) return;
    const e = n.find((o) => (o == null ? void 0 : o.name) === "tiles") ?? n.find((o) => (o == null ? void 0 : o.name) === "tokens" || (o == null ? void 0 : o.name) === "token") ?? n[0];
    if (!e) return;
    const i = e.tools, r = "eidolonCinematicEditor";
    if (Array.isArray(i) && i.some((o) => (o == null ? void 0 : o.name) === r) || i instanceof Map && i.has(r)) return;
    const a = {
      name: r,
      title: "Cinematic Editor",
      icon: "fa-solid fa-film",
      button: !0,
      toggle: !1,
      visible: !0,
      onClick: /* @__PURE__ */ c(() => {
        new Ws({ scene: canvas.scene }).render(!0);
      }, "onClick")
    };
    Array.isArray(i) ? i.push(a) : i instanceof Map ? i.set(r, a) : i && typeof i == "object" ? i[r] = a : e.tools = [a];
  });
}
c(bp, "registerEditorButton");
function wp() {
  Hooks.on("canvasReady", mp), bp(), Hooks.once("ready", () => {
    yp();
    const t = game.modules.get(L);
    t.api || (t.api = {}), t.api.cinematic = {
      play: Ti,
      reset: cp,
      resetForUser: up,
      resetForAll: dp,
      getSeenStatus: fp,
      has: hp,
      get: Ia,
      list: op,
      revert: gp,
      TileAnimator: La,
      registerBehaviour: $i,
      getBehaviour: Jd,
      trigger: /* @__PURE__ */ c(async (n, e, i = "default") => {
        var o;
        const r = e ?? ((o = canvas.scene) == null ? void 0 : o.id);
        if (!r) return;
        const a = Ia(r, i);
        a && (a.trigger && a.trigger !== n || await Ti(r, i));
      }, "trigger")
    }, console.log(`[${L}] Cinematic API registered (v3).`);
  });
}
c(wp, "registerCinematicHooks");
function Lc(t, n) {
  const e = Math.abs(t.width), i = Math.abs(t.height), r = e / 2, a = i / 2;
  let o = n.x - (t.x + r), s = n.y - (t.y + a);
  if (t.rotation !== 0) {
    const l = Math.toRadians(t.rotation), u = Math.cos(l), f = Math.sin(l), g = u * o + f * s, m = u * s - f * o;
    o = g, s = m;
  }
  return o += r, s += a, o >= 0 && o <= e && s >= 0 && s <= i;
}
c(Lc, "pointWithinTile");
po("tile-click", (t, n) => t.target ? new Promise((e, i) => {
  var y;
  if (n.signal.aborted) return i(n.signal.reason ?? "aborted");
  const r = bo(t.target);
  if (!((y = r == null ? void 0 : r.placeables) != null && y.length))
    return i(new Error(`await tile-click: no placeables found for "${t.target}"`));
  const a = r.placeables, o = [];
  for (const { placeable: b } of a) {
    const p = new La(b, t.animation);
    p.start("idle"), o.push({ placeable: b, animator: p });
  }
  const s = document.getElementById("board");
  let l = null;
  const u = /* @__PURE__ */ c((b) => {
    const p = canvas.activeLayer;
    if (!p) return;
    const E = p.toLocal(b);
    if (!E || isNaN(E.x) || isNaN(E.y)) return;
    let T = !1;
    for (const { placeable: I, animator: M } of o)
      Lc(I.document, E) ? (T = !0, M.state !== "hover" && M.setState("hover")) : M.state === "hover" && M.setState("idle");
    T ? l === null && (l = document.body.style.cursor, document.body.style.cursor = "pointer") : l !== null && (document.body.style.cursor = l, l = null);
  }, "onPointerMove");
  s == null || s.addEventListener("pointermove", u);
  const f = /* @__PURE__ */ c((b) => {
    if (b.button !== 0) return;
    const p = canvas.activeLayer;
    if (!p) return;
    const E = p.toLocal(b);
    isNaN(E.x) || isNaN(E.y) || !a.filter(({ doc: I }) => Lc(I, E)).sort((I, M) => (M.doc.sort ?? 0) - (I.doc.sort ?? 0))[0] || (b.stopPropagation(), b.preventDefault(), m(), e());
  }, "onPointerDown");
  s == null || s.addEventListener("pointerdown", f, { capture: !0 });
  const g = /* @__PURE__ */ c(() => {
    m(), i(n.signal.reason ?? "aborted");
  }, "onAbort");
  n.signal.addEventListener("abort", g, { once: !0 });
  function m() {
    s == null || s.removeEventListener("pointerdown", f, { capture: !0 }), s == null || s.removeEventListener("pointermove", u), n.signal.removeEventListener("abort", g);
    for (const { animator: b } of o)
      b.detach();
    l !== null ? (document.body.style.cursor = l, l = null) : document.body.style.cursor = "";
  }
  c(m, "cleanup");
}) : Promise.reject(new Error('await tile-click: "target" is required')));
wp();
function vp() {
  Hooks.once("ready", () => {
    const t = game.modules.get(L);
    t.api || (t.api = {}), t.api.picker = {
      /** Open the picker window. Returns Promise<string[] | null>. */
      open: /* @__PURE__ */ c((n) => Sa.open(n), "open"),
      /** Resolve a selector string to documents. */
      resolveSelector: bo,
      /** Parse a selector string into { type, value }. */
      parseSelector: Il,
      /** Build a selector string from { type, value }. */
      buildSelector: Rm,
      /** Build a tag selector from tags array + mode. */
      buildTagSelector: ud,
      /** Canvas highlight utilities. */
      highlight: {
        add: Ca,
        remove: Ni,
        has: wd,
        clearAll: Qr
      }
    }, console.log(`[${L}] Placeable Picker API registered.`);
  });
}
c(vp, "registerPlaceablePickerHooks");
vp();
//# sourceMappingURL=eidolon-utilities.js.map
