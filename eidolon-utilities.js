var Rd = Object.defineProperty;
var Hp = Object.getPrototypeOf;
var qp = Reflect.get;
var Hd = (e) => {
  throw TypeError(e);
};
var jp = (e, t, n) => t in e ? Rd(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var c = (e, t) => Rd(e, "name", { value: t, configurable: !0 });
var se = (e, t, n) => jp(e, typeof t != "symbol" ? t + "" : t, n), Tl = (e, t, n) => t.has(e) || Hd("Cannot " + n);
var g = (e, t, n) => (Tl(e, t, "read from private field"), n ? n.call(e) : t.get(e)), _ = (e, t, n) => t.has(e) ? Hd("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, n), O = (e, t, n, i) => (Tl(e, t, "write to private field"), i ? i.call(e, n) : t.set(e, n), n), I = (e, t, n) => (Tl(e, t, "access private method"), n);
var Ll = (e, t, n, i) => ({
  set _(r) {
    O(e, t, r, n);
  },
  get _() {
    return g(e, t, i);
  }
}), ye = (e, t, n) => qp(Hp(e), n, t);
const k = "eidolon-utilities", Ps = "timeTriggerActive", oc = "timeTriggerHideWindow", sc = "timeTriggerShowPlayerWindow", ac = "timeTriggerAllowRealTime", wh = "timeTriggers", ys = "timeTriggerHistory", lc = "debug", cc = "timeFormat", uc = "manageTime", dc = "secondsPerRound";
const Bp = [-30, -15, -5, 5, 15, 30], pr = 1440 * 60, bs = "playSound", Xo = 6;
function C(e, t) {
  var n, i;
  return (i = (n = game.i18n) == null ? void 0 : n.has) != null && i.call(n, e) ? game.i18n.localize(e) : t;
}
c(C, "localize");
function Xt(e) {
  return typeof e != "string" ? "" : e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
c(Xt, "escapeHtml");
function Zt(e) {
  var t;
  return e == null ? e : (t = foundry == null ? void 0 : foundry.utils) != null && t.duplicate ? foundry.utils.duplicate(e) : JSON.parse(JSON.stringify(e));
}
c(Zt, "duplicateData");
function Up() {
  var e;
  return (e = foundry == null ? void 0 : foundry.utils) != null && e.randomID ? foundry.utils.randomID() : typeof (crypto == null ? void 0 : crypto.randomUUID) == "function" ? crypto.randomUUID() : Math.random().toString(36).slice(2, 10);
}
c(Up, "generateTriggerId");
function Eh(e) {
  if (typeof e != "string") return null;
  const t = e.trim();
  if (!t) return null;
  const n = t.match(/^([0-9]{1,2}):([0-9]{2})(?::([0-9]{2}))?$/);
  if (!n) return null;
  const i = Number(n[1]), r = Number(n[2]), o = n[3] !== void 0 ? Number(n[3]) : 0;
  return !Number.isInteger(i) || !Number.isInteger(r) || !Number.isInteger(o) || i < 0 || i > 23 || r < 0 || r > 59 || o < 0 || o > 59 ? null : i * 3600 + r * 60 + o;
}
c(Eh, "parseTriggerTimeToSeconds");
function Jr() {
  var e, t;
  return ((e = game.scenes) == null ? void 0 : e.current) ?? ((t = game.scenes) == null ? void 0 : t.active) ?? null;
}
c(Jr, "getActiveScene");
function at(e) {
  return (e == null ? void 0 : e.object) ?? (e == null ? void 0 : e.document) ?? null;
}
c(at, "getSceneFromApplication");
function Re(e) {
  return e && typeof e.getFlag == "function" && typeof e.setFlag == "function";
}
c(Re, "hasSceneDocument");
const fc = /* @__PURE__ */ new Set(), hc = /* @__PURE__ */ new Set(), mc = /* @__PURE__ */ new Set(), gc = /* @__PURE__ */ new Set();
let Wi = !1, bo = !1, Rs = Xo, Hs = "12h", qd = !1;
function Il(e) {
  Wi = !!e;
  for (const t of fc)
    try {
      t(Wi);
    } catch (n) {
      console.error(`${k} | Debug change handler failed`, n);
    }
}
c(Il, "notifyDebugChange");
function kl(e) {
  bo = !!e;
  for (const t of hc)
    try {
      t(bo);
    } catch (n) {
      console.error(`${k} | Manage time change handler failed`, n);
    }
}
c(kl, "notifyManageTimeChange");
function Sh(e) {
  return e === "24h" ? "24h" : "12h";
}
c(Sh, "normalizeTimeFormatValue");
function Bu(e) {
  const t = Number(e);
  return !Number.isFinite(t) || t <= 0 ? Xo : t;
}
c(Bu, "normalizeSecondsPerRoundValue");
function Ol(e) {
  const t = Bu(e);
  Rs = t;
  for (const n of mc)
    try {
      n(t);
    } catch (i) {
      console.error(`${k} | Seconds-per-round change handler failed`, i);
    }
}
c(Ol, "notifySecondsPerRoundChange");
function Al(e) {
  const t = Sh(e);
  Hs = t;
  for (const n of gc)
    try {
      n(t);
    } catch (i) {
      console.error(`${k} | Time format change handler failed`, i);
    }
}
c(Al, "notifyTimeFormatChange");
function Vp() {
  var t;
  if (qd) return;
  if (qd = !0, !((t = game == null ? void 0 : game.settings) != null && t.register)) {
    console.warn(
      `${k} | game.settings.register is unavailable. Module settings could not be registered.`
    );
    return;
  }
  const e = typeof game.settings.registerChange == "function";
  game.settings.register(k, lc, {
    name: C("EIDOLON.TimeTrigger.DebugSettingName", "Enable debug logging"),
    hint: C(
      "EIDOLON.TimeTrigger.DebugSettingHint",
      "Write detailed time-trigger diagnostics to the browser console."
    ),
    scope: "world",
    config: !0,
    type: Boolean,
    default: !1,
    onChange: e ? void 0 : Il
  }), e && game.settings.registerChange(k, lc, Il), Wi = Uu(), Il(Wi), game.settings.register(k, uc, {
    name: C("EIDOLON.TimeTrigger.ManageTimeSettingName", "Manage Game Time"),
    hint: C(
      "EIDOLON.TimeTrigger.ManageTimeSettingHint",
      "Allow Eidolon Utilities to advance world time automatically while the game is unpaused. Warning: This may conflict with other time-management modules."
    ),
    scope: "world",
    config: !0,
    type: Boolean,
    default: !1,
    onChange: e ? void 0 : kl
  }), e && game.settings.registerChange(k, uc, kl), bo = Wp(), kl(bo), game.settings.register(k, dc, {
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
    default: Xo,
    range: { min: 1, max: 3600, step: 1 },
    onChange: e ? void 0 : Ol
  }), e && game.settings.registerChange(
    k,
    dc,
    Ol
  ), Rs = Bu(zp()), Ol(Rs), game.settings.register(k, cc, {
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
    onChange: e ? void 0 : Al
  }), e && game.settings.registerChange(k, cc, Al), Hs = Sh(Ch()), Al(Hs);
}
c(Vp, "registerTimeTriggerSettings");
function Uu() {
  var e;
  try {
    if ((e = game == null ? void 0 : game.settings) != null && e.get)
      return !!game.settings.get(k, lc);
  } catch (t) {
    console.error(`${k} | Failed to read debug setting`, t);
  }
  return !1;
}
c(Uu, "getDebugSetting");
function Gp() {
  return Wi = Uu(), Wi;
}
c(Gp, "refreshDebugSettingCache");
function Wp() {
  var e;
  try {
    if ((e = game == null ? void 0 : game.settings) != null && e.get)
      return !!game.settings.get(k, uc);
  } catch (t) {
    console.error(`${k} | Failed to read manage time setting`, t);
  }
  return !1;
}
c(Wp, "getManageTimeSetting");
function Ch() {
  var e;
  try {
    if ((e = game == null ? void 0 : game.settings) != null && e.get)
      return game.settings.get(k, cc) === "24h" ? "24h" : "12h";
  } catch (t) {
    console.error(`${k} | Failed to read time format setting`, t);
  }
  return "12h";
}
c(Ch, "getTimeFormatSetting");
function zp() {
  var e;
  try {
    if ((e = game == null ? void 0 : game.settings) != null && e.get) {
      const t = game.settings.get(k, dc);
      return Bu(t);
    }
  } catch (t) {
    console.error(`${k} | Failed to read seconds-per-round setting`, t);
  }
  return Xo;
}
c(zp, "getSecondsPerRoundSetting");
function Yp(e) {
  if (typeof e != "function")
    return () => {
    };
  fc.add(e);
  try {
    e(Wi);
  } catch (t) {
    console.error(`${k} | Debug change handler failed`, t);
  }
  return () => {
    fc.delete(e);
  };
}
c(Yp, "onDebugSettingChange");
function Th(e) {
  if (typeof e != "function")
    return () => {
    };
  hc.add(e);
  try {
    e(bo);
  } catch (t) {
    console.error(`${k} | Manage time change handler failed`, t);
  }
  return () => {
    hc.delete(e);
  };
}
c(Th, "onManageTimeSettingChange");
function Vu(e) {
  if (typeof e != "function")
    return () => {
    };
  gc.add(e);
  try {
    e(Hs);
  } catch (t) {
    console.error(`${k} | Time format change handler failed`, t);
  }
  return () => {
    gc.delete(e);
  };
}
c(Vu, "onTimeFormatSettingChange");
function Kp(e) {
  if (typeof e != "function")
    return () => {
    };
  mc.add(e);
  try {
    e(Rs);
  } catch (t) {
    console.error(`${k} | Seconds-per-round change handler failed`, t);
  }
  return () => {
    mc.delete(e);
  };
}
c(Kp, "onSecondsPerRoundSettingChange");
let el = !1, pc = !1;
function yc(e) {
  el = !!e;
}
c(yc, "updateDebugState");
function Lh() {
  pc || (pc = !0, yc(Uu()), Yp((e) => {
    yc(e), console.info(`${k} | Debug ${el ? "enabled" : "disabled"}`);
  }));
}
c(Lh, "ensureInitialized");
function Gu() {
  return pc || Lh(), el;
}
c(Gu, "shouldLog");
function Ih(e) {
  if (!e.length)
    return [`${k} |`];
  const [t, ...n] = e;
  return typeof t == "string" ? [`${k} | ${t}`, ...n] : [`${k} |`, t, ...n];
}
c(Ih, "formatArgs");
function Xp() {
  Lh();
}
c(Xp, "initializeDebug");
function Jp() {
  return yc(Gp()), el;
}
c(Jp, "syncDebugState");
function D(...e) {
  Gu() && console.debug(...Ih(e));
}
c(D, "debugLog");
function xr(...e) {
  Gu() && console.group(...Ih(e));
}
c(xr, "debugGroup");
function ii() {
  Gu() && console.groupEnd();
}
c(ii, "debugGroupEnd");
function yr(e) {
  var r;
  const t = (r = e == null ? void 0 : e.getFlag) == null ? void 0 : r.call(e, k, wh);
  if (!t) return [];
  const n = Zt(t), i = Array.isArray(n) ? n : [];
  return D("Loaded time triggers", {
    sceneId: (e == null ? void 0 : e.id) ?? null,
    count: i.length
  }), i;
}
c(yr, "getTimeTriggers");
async function kh(e, t) {
  e != null && e.setFlag && (D("Persisting time triggers", {
    sceneId: e.id,
    count: Array.isArray(t) ? t.length : 0
  }), await e.setFlag(k, wh, t));
}
c(kh, "setTimeTriggers");
function Qp(e) {
  var r;
  const t = (r = e == null ? void 0 : e.getFlag) == null ? void 0 : r.call(e, k, ys);
  if (!t) return {};
  const n = Zt(t);
  if (!n || typeof n != "object") return {};
  const i = {};
  for (const [o, s] of Object.entries(n))
    typeof s == "number" && Number.isFinite(s) && (i[o] = s);
  return D("Loaded time trigger history", {
    sceneId: (e == null ? void 0 : e.id) ?? null,
    keys: Object.keys(i)
  }), i;
}
c(Qp, "getTimeTriggerHistory");
async function Ml(e, t) {
  var l, u, d, f;
  if (!e) return;
  const n = {};
  if (t && typeof t == "object")
    for (const [h, m] of Object.entries(t))
      typeof m == "number" && Number.isFinite(m) && (n[h] = m);
  const i = ((l = e.getFlag) == null ? void 0 : l.call(e, k, ys)) ?? {}, r = {};
  if (i && typeof i == "object")
    for (const [h, m] of Object.entries(i))
      typeof m == "number" && Number.isFinite(m) && (r[h] = m);
  const o = Object.keys(n), s = Object.keys(r);
  if (typeof ((u = foundry == null ? void 0 : foundry.utils) == null ? void 0 : u.deepEqual) == "function" ? foundry.utils.deepEqual(r, n) : JSON.stringify(r) === JSON.stringify(n)) {
    D("Skip history update because state is unchanged", {
      sceneId: (e == null ? void 0 : e.id) ?? null
    });
    return;
  }
  D("Updating time trigger history", {
    sceneId: (e == null ? void 0 : e.id) ?? null,
    keys: o,
    removedKeys: s.filter((h) => !o.includes(h))
  });
  try {
    s.length && typeof e.unsetFlag == "function" && await e.unsetFlag(k, ys), o.length && await e.setFlag(k, ys, n);
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
c(Ml, "updateTimeTriggerHistory");
const qs = /* @__PURE__ */ new Map(), jd = /* @__PURE__ */ new Set();
function Zp(e) {
  if (!(e != null && e.id))
    throw new Error(`${k} | Action definitions require an id.`);
  if (qs.has(e.id))
    throw new Error(`${k} | Duplicate time trigger action id: ${e.id}`);
  qs.set(e.id, {
    ...e
  }), D("Registered time trigger action", { actionId: e.id });
}
c(Zp, "registerAction");
function Jo(e) {
  return qs.get(e) ?? null;
}
c(Jo, "getAction");
function ey(e) {
  const t = Jo(e);
  return t ? typeof t.label == "function" ? t.label() : t.label : e;
}
c(ey, "getActionLabel");
function Bd() {
  return Array.from(qs.values());
}
c(Bd, "listActions");
async function Oh(e, t) {
  var i, r;
  const n = Jo(t == null ? void 0 : t.action);
  if (!n || typeof n.execute != "function") {
    const o = C(
      "EIDOLON.TimeTrigger.UnknownAction",
      "Encountered an unknown time trigger action and skipped it."
    );
    (r = (i = ui.notifications) == null ? void 0 : i.warn) == null || r.call(i, o), console.warn(`${k} | Unknown time trigger action`, t), D("Encountered unknown time trigger action", {
      triggerId: (t == null ? void 0 : t.id) ?? null,
      actionId: (t == null ? void 0 : t.action) ?? null
    });
    return;
  }
  D("Executing action handler", {
    actionId: n.id,
    triggerId: (t == null ? void 0 : t.id) ?? null,
    sceneId: (e == null ? void 0 : e.id) ?? null
  }), await n.execute({ scene: e, trigger: t });
}
c(Oh, "executeTriggerAction");
function ty(e) {
  const t = Jo(e == null ? void 0 : e.action);
  return !t || typeof t.buildSummaryParts != "function" ? [] : t.buildSummaryParts({ trigger: e, escapeHtml: Xt, localize: C }) ?? [];
}
c(ty, "buildActionSummaryParts");
function ny(e) {
  const t = Jo(e == null ? void 0 : e.action);
  return !t || typeof t.buildFormContent != "function" ? "" : t.buildFormContent({ trigger: e, escapeHtml: Xt, localize: C }) ?? "";
}
c(ny, "buildActionFormSection");
function iy(e, t) {
  const n = Jo(e == null ? void 0 : e.action);
  !n || typeof n.prepareFormData != "function" || n.prepareFormData({ trigger: e, formData: t });
}
c(iy, "applyActionFormData");
function ry(e, t, n) {
  var o, s;
  const i = `${(e == null ? void 0 : e.id) ?? "unknown"}:${(t == null ? void 0 : t.id) ?? (t == null ? void 0 : t.action) ?? "unknown"}:${n}`;
  if (jd.has(i)) return;
  jd.add(i);
  const r = C(
    "EIDOLON.TimeTrigger.MissingDataWarning",
    "A scene time trigger is missing required data and was skipped."
  );
  (s = (o = ui.notifications) == null ? void 0 : o.warn) == null || s.call(o, r), console.warn(`${k} | Missing trigger data (${n})`, { scene: e == null ? void 0 : e.id, trigger: t });
}
c(ry, "warnMissingTriggerData");
async function oy({ scene: e, trigger: t }) {
  var o, s, a, l, u;
  const n = (a = (s = (o = t == null ? void 0 : t.data) == null ? void 0 : o.path) == null ? void 0 : s.trim) == null ? void 0 : a.call(s);
  if (!n) {
    ry(e, t, "missing-audio-path");
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
c(oy, "executePlaySoundAction");
Zp({
  id: bs,
  label: /* @__PURE__ */ c(() => C("EIDOLON.TimeTrigger.ActionPlaySound", "Play Sound"), "label"),
  execute: oy,
  buildSummaryParts: /* @__PURE__ */ c(({ trigger: e, escapeHtml: t, localize: n }) => {
    var r;
    return (r = e == null ? void 0 : e.data) != null && r.path ? [`${t(n("EIDOLON.TimeTrigger.TriggerSound", "Sound File"))}: ${t(e.data.path)}`] : [];
  }, "buildSummaryParts"),
  buildFormContent: /* @__PURE__ */ c(({ trigger: e, escapeHtml: t, localize: n }) => {
    var a;
    const i = t(n("EIDOLON.TimeTrigger.TriggerSound", "Sound File")), r = t(
      n("EIDOLON.TimeTrigger.TriggerChooseFile", "Select File")
    ), o = t(
      n(
        "EIDOLON.TimeTrigger.TriggerSoundNotes",
        "Select or upload the audio file that should play when this trigger fires."
      )
    ), s = t(((a = e == null ? void 0 : e.data) == null ? void 0 : a.path) ?? "");
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
  prepareFormData: /* @__PURE__ */ c(({ trigger: e, formData: t }) => {
    var n, i;
    e.data.path = ((i = (n = t.playSoundPath) == null ? void 0 : n.trim) == null ? void 0 : i.call(n)) ?? "";
  }, "prepareFormData")
});
var lh;
const { ApplicationV2: pt, HandlebarsApplicationMixin: yt } = ((lh = foundry.applications) == null ? void 0 : lh.api) ?? {};
if (!pt || !yt)
  throw new Error(
    `${k} | ApplicationV2 API unavailable. Update Foundry VTT to v13 or newer.`
  );
const ai = "AM", zi = "PM";
function ri() {
  return Ch();
}
c(ri, "getConfiguredTimeFormat");
function tl(e) {
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
c(tl, "parseCanonicalTimeString");
function un({ hours: e, minutes: t, seconds: n }) {
  if (!Number.isInteger(e) || !Number.isInteger(t) || e < 0 || e > 23 || t < 0 || t > 59) return null;
  const i = String(e).padStart(2, "0"), r = String(t).padStart(2, "0");
  if (Number.isInteger(n)) {
    if (n < 0 || n > 59) return null;
    const o = String(n).padStart(2, "0");
    return `${i}:${r}:${o}`;
  }
  return `${i}:${r}`;
}
c(un, "formatCanonicalTime");
function sy(e, { format: t } = {}) {
  if (!e || typeof e != "object") return null;
  const n = Number(e.hour), i = Number(e.minute), r = e.second !== void 0 && e.second !== null, o = r ? Number(e.second) : null, s = r && Number.isFinite(o) ? Math.floor(Math.max(0, Math.min(59, o))) : null;
  if (!Number.isFinite(n) || !Number.isFinite(i)) return null;
  const a = t ?? ri();
  return js(
    {
      hours: n,
      minutes: i,
      seconds: s
    },
    a
  );
}
c(sy, "formatTimeComponentsForDisplay");
function ay(e, { format: t } = {}) {
  const n = tl(e);
  if (!n) return "";
  const i = t ?? ri();
  return js(n, i);
}
c(ay, "formatTriggerTimeForDisplay");
function js(e, t = "12h") {
  if (!e) return "";
  const { hours: n, minutes: i, seconds: r = null } = e;
  if (!Number.isInteger(n) || !Number.isInteger(i)) return "";
  const o = Number.isInteger(r);
  if (t === "24h") {
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
c(js, "formatTimeParts");
function Ud(e, t = ri()) {
  const n = tl(e);
  if (t === "24h")
    return {
      format: t,
      canonical: n ? un(n) ?? "" : "",
      hour: n ? String(n.hours).padStart(2, "0") : "",
      minute: n ? String(n.minutes).padStart(2, "0") : ""
    };
  if (!n)
    return {
      format: t,
      canonical: "",
      hour: "",
      minute: "",
      period: ai
    };
  const i = n.hours >= 12 ? zi : ai, r = n.hours % 12 === 0 ? 12 : n.hours % 12;
  return {
    format: t,
    canonical: un(n) ?? "",
    hour: String(r),
    minute: String(n.minutes).padStart(2, "0"),
    period: i
  };
}
c(Ud, "getTimeFormValues");
function ly({ hour: e, minute: t, period: n, time: i }, r = ri()) {
  if (r === "24h") {
    const m = typeof e == "string" ? e.trim() : "", p = typeof t == "string" ? t.trim() : "", y = typeof i == "string" ? i.trim() : "";
    if (!m && !p && y) {
      const w = tl(y);
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
  const o = typeof e == "string" ? e.trim() : "", s = typeof t == "string" ? t.trim() : "", a = typeof n == "string" ? n.trim().toUpperCase() : "";
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
c(ly, "normalizeFormTimeInput");
function cy() {
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
c(cy, "getPeriodOptions");
var Mi, xi, ae, Ah, Ea, Sa, Mh, vc, wc, Ca, Ta, xh, _h, Nh, Ec, Sc, Cc, La, Ia, Tc, ka, $h, Fh;
const ki = class ki extends yt(pt) {
  constructor(n = {}) {
    var s;
    const { scene: i, showControls: r, ...o } = n ?? {};
    super(o);
    _(this, ae);
    _(this, Mi, null);
    _(this, xi, null);
    _(this, Ea, /* @__PURE__ */ c((n) => {
      var r, o;
      n.preventDefault();
      const i = Number((o = (r = n.currentTarget) == null ? void 0 : r.dataset) == null ? void 0 : o.delta);
      Number.isFinite(i) && (D("Time delta button clicked", { delta: i }), this._advanceTime(i));
    }, "#onDeltaClick"));
    _(this, Sa, /* @__PURE__ */ c((n) => {
      var i, r;
      n.preventDefault(), !(!this.showControls || !((i = game.user) != null && i.isGM)) && (D("Time value double clicked", { sceneId: ((r = this.scene) == null ? void 0 : r.id) ?? null }), I(this, ae, Mh).call(this));
    }, "#onTimeDoubleClick"));
    _(this, Ca, /* @__PURE__ */ c((n) => {
      if (this.isEditingTime && !this._commitTimeInProgress)
        if (n.key === "Enter") {
          n.preventDefault();
          const i = n.currentTarget, r = typeof (i == null ? void 0 : i.value) == "string" ? i.value : "";
          I(this, ae, wc).call(this, r);
        } else n.key === "Escape" && (n.preventDefault(), I(this, ae, vc).call(this));
    }, "#onTimeInputKeydown"));
    _(this, Ta, /* @__PURE__ */ c((n) => {
      if (!this.isEditingTime || this._commitTimeInProgress || this._suppressBlurCommit) return;
      const i = n.currentTarget, r = typeof (i == null ? void 0 : i.value) == "string" ? i.value : "";
      I(this, ae, wc).call(this, r);
    }, "#onTimeInputBlur"));
    _(this, La, /* @__PURE__ */ c((n) => {
      const i = !!n;
      if (this.manageTimeEnabled === i) return;
      this.manageTimeEnabled = i, (this.rendered ?? this.isRendered ?? !1) && this.render({ force: !0 });
    }, "#handleManageTimeChange"));
    _(this, Ia, /* @__PURE__ */ c(async (n) => {
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
        await i.setFlag(k, ac, r), this.sceneAllowsRealTime = r;
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
    _(this, ka, /* @__PURE__ */ c(() => {
      (this.rendered ?? this.isRendered ?? !1) && (this.isEditingTime && (this.editValue = I(this, ae, Ec).call(this)), this.render({ force: !0 }));
    }, "#handleTimeFormatChange"));
    this.scene = i ?? null, this.showControls = typeof r == "boolean" ? r : !!((s = game.user) != null && s.isGM), this.isEditingTime = !1, this.editValue = "", this._commitTimeInProgress = !1, this._suppressBlurCommit = !1, this.manageTimeEnabled = !1, this.sceneAllowsRealTime = I(this, ae, Tc).call(this), O(this, Mi, Vu(g(this, ka))), O(this, xi, Th(g(this, La)));
  }
  async _prepareContext() {
    var v, b;
    const n = ((v = game.time) == null ? void 0 : v.components) ?? {}, r = ((n == null ? void 0 : n.second) !== void 0 && (n == null ? void 0 : n.second) !== null ? sy(n) : null) ?? I(this, ae, Ah).call(this), o = ri(), s = o === "24h", a = s ? C("EIDOLON.TimeTrigger.EditTimePlaceholder24", "HH:MM") : C("EIDOLON.TimeTrigger.EditTimePlaceholder12", "HH:MM AM/PM"), l = this.showControls ? C(
      "EIDOLON.TimeTrigger.EditTimeHint",
      "Double-click to set a specific time."
    ) : "", u = this.showControls ? C(
      "EIDOLON.TimeTrigger.EditTimeLabel",
      "New time (HH:MM or HH:MM AM/PM)"
    ) : "", d = Bp.map((w) => ({
      minutes: w,
      label: w > 0 ? `+${w}` : `${w}`
    })), f = !!this.manageTimeEnabled, h = I(this, ae, Tc).call(this);
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
    return I(this, ae, $h).call(this), I(this, ae, Fh).call(this), i;
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
          u.addEventListener("click", g(this, Ea));
        });
        const s = r.querySelector('.time-trigger-window__time-value[data-editable="true"]');
        s && s.addEventListener("dblclick", g(this, Sa), { once: !1 });
        const a = r.querySelector(".time-trigger-window__time-input");
        a && (a.addEventListener("keydown", g(this, Ca)), a.addEventListener("blur", g(this, Ta)), typeof a.focus == "function" && (a.focus(), typeof a.select == "function" && a.select()));
        const l = r.querySelector('[data-action="toggle-real-time"]');
        l && l.addEventListener("click", g(this, Ia));
      }
      this._suppressBlurCommit = !1;
    }
  }
};
Mi = new WeakMap(), xi = new WeakMap(), ae = new WeakSet(), Ah = /* @__PURE__ */ c(function() {
  var l;
  const n = (l = game.time) == null ? void 0 : l.worldTime;
  if (typeof n != "number" || !Number.isFinite(n)) return "";
  const i = 1440 * 60, r = (Math.floor(n) % i + i) % i, o = Math.floor(r / 3600), s = Math.floor(r % 3600 / 60), a = r % 60;
  return js({ hours: o, minutes: s, seconds: a }, ri());
}, "#formatFallbackTime"), Ea = new WeakMap(), Sa = new WeakMap(), Mh = /* @__PURE__ */ c(function() {
  var n;
  (n = game.user) != null && n.isGM && (this.isEditingTime = !0, this._suppressBlurCommit = !1, this.editValue = I(this, ae, Ec).call(this), this.render({ force: !0 }));
}, "#enterTimeEditMode"), vc = /* @__PURE__ */ c(function() {
  this.isEditingTime = !1, this.editValue = "", this._suppressBlurCommit = !1, this.render({ force: !0 });
}, "#cancelTimeEdit"), wc = /* @__PURE__ */ c(async function(n) {
  var o, s, a;
  if (!((o = game.user) != null && o.isGM) || !this.isEditingTime || this._commitTimeInProgress) return;
  this._commitTimeInProgress = !0;
  const i = typeof n == "string" ? n.trim() : "";
  if (!i) {
    I(this, ae, vc).call(this), this._commitTimeInProgress = !1;
    return;
  }
  const r = I(this, ae, Nh).call(this, i);
  if (r.error) {
    (a = (s = ui.notifications) == null ? void 0 : s.error) == null || a.call(s, r.error), this._suppressBlurCommit = !0, this.editValue = i, this.render({ force: !0 }), this._commitTimeInProgress = !1;
    return;
  }
  try {
    await I(this, ae, _h).call(this, r.seconds, r.includeSeconds) ? (this.isEditingTime = !1, this.editValue = "", this.render({ force: !0 })) : (this.editValue = i, this.render({ force: !0 }));
  } finally {
    this._commitTimeInProgress = !1;
  }
}, "#commitTimeInput"), Ca = new WeakMap(), Ta = new WeakMap(), xh = /* @__PURE__ */ c(function() {
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
}, "#getCurrentCanonicalTime"), _h = /* @__PURE__ */ c(async function(n, i) {
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
  if (!Number.isInteger(n) || n < 0 || n >= pr)
    return (E = (y = ui.notifications) == null ? void 0 : y.error) == null || E.call(
      y,
      C(
        "EIDOLON.TimeTrigger.EditTimeInvalidRange",
        "Enter a time within the current day."
      )
    ), !1;
  const a = Math.floor(r / pr) * pr + n - r;
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
    const L = js(
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
}, "#applyTargetSeconds"), Nh = /* @__PURE__ */ c(function(n) {
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
  const { amLower: s, pmLower: a, periodPattern: l } = I(this, ae, Sc).call(this), u = r.match(
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
  const d = Eh(r);
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
}, "#parseInputTime"), Ec = /* @__PURE__ */ c(function() {
  const n = I(this, ae, xh).call(this);
  if (!n) return "";
  if (ri() === "24h")
    return n;
  const r = tl(n);
  if (!r) return n;
  const o = Number(r.hours), s = Number(r.minutes), a = r.seconds !== null && r.seconds !== void 0 ? Number(r.seconds) : void 0;
  if (!Number.isFinite(o) || !Number.isFinite(s)) return n;
  const l = Number.isFinite(a), u = o % 12 === 0 ? 12 : o % 12, d = String(s).padStart(2, "0"), f = l ? `:${String(a).padStart(2, "0")}` : "", { amLabel: h, pmLabel: m } = I(this, ae, Sc).call(this), p = o >= 12 ? m : h;
  return `${u}:${d}${f} ${p}`.trim();
}, "#getInitialEditValue"), Sc = /* @__PURE__ */ c(function() {
  var u, d;
  const n = C("EIDOLON.TimeTrigger.TimePeriodAM", "AM"), i = C("EIDOLON.TimeTrigger.TimePeriodPM", "PM"), r = ((u = n.toLocaleLowerCase) == null ? void 0 : u.call(n)) ?? n.toLowerCase(), o = ((d = i.toLocaleLowerCase) == null ? void 0 : d.call(i)) ?? i.toLowerCase(), s = I(this, ae, Cc).call(this, n), a = I(this, ae, Cc).call(this, i), l = `${s}|${a}|AM|PM`;
  return {
    amLabel: n,
    pmLabel: i,
    amLower: r,
    pmLower: o,
    periodPattern: l
  };
}, "#getPeriodMatchData"), Cc = /* @__PURE__ */ c(function(n) {
  return typeof n != "string" ? "" : n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}, "#escapeForRegex"), La = new WeakMap(), Ia = new WeakMap(), Tc = /* @__PURE__ */ c(function() {
  const n = this.scene;
  if (!n || typeof n.getFlag != "function") return !1;
  try {
    return !!n.getFlag(k, ac);
  } catch (i) {
    D("TimeTriggerWindow | Failed to read scene real-time flag", {
      sceneId: (n == null ? void 0 : n.id) ?? null,
      message: (i == null ? void 0 : i.message) ?? String(i)
    });
  }
  return !1;
}, "#readSceneRealTimeFlag"), ka = new WeakMap(), $h = /* @__PURE__ */ c(function() {
  if (typeof g(this, Mi) == "function")
    try {
      g(this, Mi).call(this);
    } catch (n) {
      console.error(`${k} | Failed to dispose time format subscription`, n);
    }
  O(this, Mi, null);
}, "#disposeTimeFormatSubscription"), Fh = /* @__PURE__ */ c(function() {
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
let bc = ki;
function Zi(e, t = {}) {
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
c(Zi, "createApplicationFactory");
const Vd = /* @__PURE__ */ new Set();
var xe, ct, _i, Rr, Dh, Ph;
const Md = class Md {
  constructor({ windowFactory: t } = {}) {
    _(this, Rr);
    _(this, xe, null);
    _(this, ct, null);
    _(this, _i);
    const n = Zi(bc);
    typeof t == "function" ? t.__eidolonFactorySignature === "options" ? O(this, _i, (r, o = {}) => t({ scene: r, ...o ?? {} })) : O(this, _i, t) : O(this, _i, /* @__PURE__ */ c((r, o = {}) => n({ scene: r, ...o ?? {} }), "fallbackFactory"));
  }
  onReady() {
    var n;
    const t = typeof ((n = game.time) == null ? void 0 : n.worldTime) == "number" && Number.isFinite(game.time.worldTime) ? game.time.worldTime : null;
    D("TimeTriggerManager#onReady", { worldTime: t }), t !== null && O(this, ct, t);
  }
  onCanvasReady(t) {
    const n = (t == null ? void 0 : t.scene) ?? Jr();
    D("TimeTriggerManager#onCanvasReady", { sceneId: (n == null ? void 0 : n.id) ?? null }), this.refreshTimeTriggerWindow(n), this.handleTimeTriggerEvaluation(n);
  }
  onUpdateScene(t) {
    const n = Jr();
    D("TimeTriggerManager#onUpdateScene", {
      sceneId: (t == null ? void 0 : t.id) ?? null,
      activeSceneId: (n == null ? void 0 : n.id) ?? null
    }), !(!n || t.id !== n.id) && (this.refreshTimeTriggerWindow(t), this.handleTimeTriggerEvaluation(t));
  }
  onUpdateWorldTime(t, n) {
    D("TimeTriggerManager#onUpdateWorldTime", {
      worldTime: t,
      diff: n,
      hasWindow: !!g(this, xe)
    }), g(this, xe) && g(this, xe).render();
    const i = Jr(), r = I(this, Rr, Dh).call(this, t, n);
    this.handleTimeTriggerEvaluation(i, t, r);
  }
  refreshTimeTriggerWindow(t) {
    var l, u, d;
    if (!t) return;
    const n = !!((l = game.user) != null && l.isGM), i = !!t.getFlag(k, Ps), r = !!t.getFlag(k, oc), o = !!t.getFlag(k, sc);
    if (D("TimeTriggerManager#refreshTimeTriggerWindow", {
      sceneId: t.id,
      isGM: n,
      isActive: i,
      hideWindow: r,
      showPlayerWindow: o
    }), !(i && !r && (n || o))) {
      g(this, xe) && (D("Closing time trigger window", { reason: "not-visible" }), g(this, xe).close({ force: !0 }), O(this, xe, null));
      return;
    }
    const a = !!n;
    if (g(this, xe) && ((u = g(this, xe).scene) == null ? void 0 : u.id) === t.id) {
      D("Refreshing existing time trigger window", { sceneId: t.id }), g(this, xe).showControls = a, g(this, xe).render();
      return;
    }
    g(this, xe) && (D("Closing existing window before creating new instance", {
      previousSceneId: ((d = g(this, xe).scene) == null ? void 0 : d.id) ?? null
    }), g(this, xe).close({ force: !0 })), O(this, xe, g(this, _i).call(this, t, { showControls: a })), D("Rendering new time trigger window", { sceneId: t.id }), g(this, xe).render({ force: !0 });
  }
  async handleTimeTriggerEvaluation(t, n, i) {
    var l;
    const r = t ?? Jr();
    if (!r) {
      D("handleTimeTriggerEvaluation skipped", {
        reason: "no-active-scene",
        providedSceneId: (t == null ? void 0 : t.id) ?? null,
        currentWorldTime: n
      }), typeof n == "number" && Number.isFinite(n) && O(this, ct, n);
      return;
    }
    const o = typeof n == "number" && Number.isFinite(n) ? n : typeof ((l = game.time) == null ? void 0 : l.worldTime) == "number" ? game.time.worldTime : null;
    if (o === null) return;
    const s = typeof i == "number" && Number.isFinite(i) ? i : null, a = s !== null ? s : typeof g(this, ct) == "number" && Number.isFinite(g(this, ct)) ? g(this, ct) : o;
    xr("handleTimeTriggerEvaluation", {
      sceneId: r.id,
      previousWorldTime: a,
      currentWorldTime: o,
      overrideProvided: s !== null
    });
    try {
      await I(this, Rr, Ph).call(this, r, a, o);
    } catch (u) {
      console.error(`${k} | Unexpected error while evaluating time triggers`, u), D("handleTimeTriggerEvaluation error", { message: (u == null ? void 0 : u.message) ?? String(u) });
    } finally {
      O(this, ct, o), ii();
    }
  }
};
xe = new WeakMap(), ct = new WeakMap(), _i = new WeakMap(), Rr = new WeakSet(), Dh = /* @__PURE__ */ c(function(t, n) {
  return typeof g(this, ct) == "number" && Number.isFinite(g(this, ct)) ? (D("Resolved previous world time from cache", {
    previousWorldTime: g(this, ct)
  }), g(this, ct)) : typeof t == "number" && Number.isFinite(t) && typeof n == "number" && Number.isFinite(n) ? (D("Resolved previous world time using diff", {
    worldTime: t,
    diff: n,
    resolved: t - n
  }), t - n) : typeof t == "number" && Number.isFinite(t) ? t : null;
}, "#resolvePreviousWorldTime"), Ph = /* @__PURE__ */ c(async function(t, n, i) {
  var p, y, E;
  if (!((p = game.user) != null && p.isGM)) {
    D("Skipping trigger evaluation because user is not a GM");
    return;
  }
  if (!(t != null && t.id)) {
    D("Skipping trigger evaluation because the scene is missing an id");
    return;
  }
  if (!!!t.getFlag(k, Ps)) {
    D("Skipping trigger evaluation because scene is inactive", { sceneId: t.id });
    return;
  }
  if (typeof i != "number" || !Number.isFinite(i)) return;
  (typeof n != "number" || !Number.isFinite(n)) && (n = i);
  const o = yr(t);
  if (!o.length) {
    D("No time triggers configured for scene", { sceneId: t.id });
    return;
  }
  const s = Qp(t), a = /* @__PURE__ */ new Set();
  for (const v of o)
    v != null && v.id && a.add(v.id);
  let l = !1;
  for (const v of Object.keys(s))
    a.has(v) || (delete s[v], l = !0);
  if (xr("Evaluating scene time triggers", {
    sceneId: t.id,
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
      sceneId: t.id
    }), await Ml(t, s)), ii();
    return;
  }
  const u = n, d = i, f = [], h = Math.floor(u / pr), m = Math.floor(d / pr);
  for (const v of o) {
    if (!(v != null && v.id)) continue;
    const b = Eh(v.time);
    if (b === null) {
      uy(t, v), D("Skipping trigger with invalid time", {
        triggerId: v.id,
        time: v.time
      });
      continue;
    }
    for (let w = h; w <= m; w++) {
      const S = w * pr + b;
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
    l && await Ml(t, s), D("No triggers scheduled to fire within evaluation window", {
      sceneId: t.id
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
      }), await Oh(t, v.trigger);
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
  l && (D("Persisting trigger history updates", { sceneId: t.id }), await Ml(t, s)), ii();
}, "#evaluateSceneTimeTriggers"), c(Md, "TimeTriggerManager");
let Lc = Md;
function uy(e, t) {
  var r, o;
  const n = `${(e == null ? void 0 : e.id) ?? "unknown"}:${(t == null ? void 0 : t.id) ?? (t == null ? void 0 : t.time) ?? "unknown"}`;
  if (Vd.has(n)) return;
  Vd.add(n);
  const i = C(
    "EIDOLON.TimeTrigger.InvalidTimeWarning",
    "A scene time trigger has an invalid time value and was skipped."
  );
  (o = (r = ui.notifications) == null ? void 0 : r.warn) == null || o.call(r, i), console.warn(`${k} | Invalid time for trigger`, { scene: e == null ? void 0 : e.id, trigger: t });
}
c(uy, "warnInvalidTriggerTime");
var Ht, Ao, qt, jn, Ni, on, Cr, Oa, Aa, Mo, xo, $i, sn, K, kc, rr, vs, Oc, ws, Ac, nn, Rh, Mc, Hh, xc, qh, Ma, xa, _a, Na, $a, Fa, _c, jh, Es, Da, Pa;
const xd = class xd {
  constructor() {
    _(this, K);
    _(this, Ht, !1);
    _(this, Ao, Xo);
    _(this, qt, /* @__PURE__ */ new Map());
    _(this, jn, null);
    _(this, Ni, null);
    _(this, on, 0);
    _(this, Cr, null);
    _(this, Oa, null);
    _(this, Aa, null);
    _(this, Mo, !1);
    _(this, xo, !1);
    _(this, $i, !1);
    _(this, sn, !1);
    _(this, Ma, /* @__PURE__ */ c((t, n = {}) => {
      D("GameTimeAutomation | Pause state changed", {
        paused: t,
        userId: (n == null ? void 0 : n.userId) ?? null,
        broadcast: (n == null ? void 0 : n.broadcast) ?? null
      }), I(this, K, nn).call(this, { pausedOverride: t });
    }, "#handlePause"));
    _(this, xa, /* @__PURE__ */ c((t) => {
      t != null && t.id && (g(this, qt).set(t.id, Math.max(t.round ?? 0, 1)), D("GameTimeAutomation | Combat started", { combatId: t.id, round: t.round ?? 0 }), I(this, K, nn).call(this));
    }, "#handleCombatStart"));
    _(this, _a, /* @__PURE__ */ c((t, n) => {
      if (!(t != null && t.id)) return;
      const i = typeof n == "number" && Number.isFinite(n) ? n : typeof t.round == "number" && Number.isFinite(t.round) ? t.round : 0, r = i > 0 ? i : 1, o = g(this, qt).get(t.id), s = o ? Math.max(o, 1) : 1, a = r > 1 ? Math.max(r - s, 0) : 0;
      if (D("GameTimeAutomation | Combat round change detected", {
        combatId: t.id,
        effectiveRound: r,
        completedRounds: a,
        enabled: g(this, Ht),
        paused: (game == null ? void 0 : game.paused) ?? null
      }), a > 0 && g(this, Ht) && g(this, sn) && !(game != null && game.paused) && I(this, K, rr).call(this) && I(this, K, vs).call(this, t)) {
        const l = a * g(this, Ao);
        l > 0 && (D("GameTimeAutomation | Advancing time for completed combat rounds", {
          combatId: t.id,
          completedRounds: a,
          delta: l
        }), I(this, K, xc).call(this, l));
      }
      g(this, qt).set(t.id, Math.max(r, 1));
    }, "#handleCombatRound"));
    _(this, Na, /* @__PURE__ */ c((t) => {
      t != null && t.id && (g(this, qt).delete(t.id), D("GameTimeAutomation | Combat ended", { combatId: t.id }), I(this, K, nn).call(this));
    }, "#handleCombatEnd"));
    _(this, $a, /* @__PURE__ */ c((t) => {
      t != null && t.id && (g(this, qt).delete(t.id), D("GameTimeAutomation | Combat deleted", { combatId: t.id }), I(this, K, nn).call(this));
    }, "#handleCombatDelete"));
    _(this, Fa, /* @__PURE__ */ c((t, n) => {
      if (t != null && t.id) {
        if (typeof (n == null ? void 0 : n.round) == "number" && Number.isFinite(n.round)) {
          const i = Math.max(n.round, 1);
          g(this, qt).set(t.id, i), D("GameTimeAutomation | Combat round manually updated", {
            combatId: t.id,
            round: i
          });
        }
        (Object.prototype.hasOwnProperty.call(n ?? {}, "active") || (n == null ? void 0 : n.round) !== void 0) && I(this, K, nn).call(this);
      }
    }, "#handleCombatUpdate"));
    _(this, Da, /* @__PURE__ */ c((t) => {
      I(this, K, Es).call(this, t == null ? void 0 : t.scene), I(this, K, nn).call(this);
    }, "#handleCanvasReady"));
    _(this, Pa, /* @__PURE__ */ c((t) => {
      if (!Re(t)) return;
      const n = I(this, K, _c).call(this);
      if (!n || n.id !== t.id) return;
      I(this, K, Es).call(this, t) && I(this, K, nn).call(this);
    }, "#handleSceneUpdate"));
  }
  registerHooks() {
    g(this, Mo) || (O(this, Mo, !0), Hooks.on("pauseGame", g(this, Ma)), Hooks.on("combatStart", g(this, xa)), Hooks.on("combatRound", g(this, _a)), Hooks.on("combatEnd", g(this, Na)), Hooks.on("deleteCombat", g(this, $a)), Hooks.on("updateCombat", g(this, Fa)), Hooks.on("canvasReady", g(this, Da)), Hooks.on("updateScene", g(this, Pa)));
  }
  initialize() {
    g(this, xo) || (O(this, xo, !0), O(this, Oa, Th((t) => {
      const n = !!t, i = n !== g(this, Ht);
      O(this, Ht, n), D("GameTimeAutomation | Manage time toggled", { enabled: n }), i && n && I(this, K, Ac).call(this), I(this, K, nn).call(this);
    })), O(this, Aa, Kp((t) => {
      O(this, Ao, t), D("GameTimeAutomation | Seconds per round updated", { value: t });
    })), I(this, K, Ac).call(this), I(this, K, Es).call(this), I(this, K, nn).call(this));
  }
};
Ht = new WeakMap(), Ao = new WeakMap(), qt = new WeakMap(), jn = new WeakMap(), Ni = new WeakMap(), on = new WeakMap(), Cr = new WeakMap(), Oa = new WeakMap(), Aa = new WeakMap(), Mo = new WeakMap(), xo = new WeakMap(), $i = new WeakMap(), sn = new WeakMap(), K = new WeakSet(), kc = /* @__PURE__ */ c(function() {
  var t;
  try {
    if (typeof ((t = globalThis.performance) == null ? void 0 : t.now) == "function")
      return globalThis.performance.now();
  } catch (n) {
    D("GameTimeAutomation | Failed to read high-resolution timestamp", {
      message: (n == null ? void 0 : n.message) ?? String(n)
    });
  }
  return Date.now();
}, "#currentTimestamp"), rr = /* @__PURE__ */ c(function() {
  var t;
  return !!((t = game == null ? void 0 : game.user) != null && t.isGM && game.user.active !== !1);
}, "#canControlTime"), vs = /* @__PURE__ */ c(function(t) {
  var i, r;
  if (!t) return !1;
  if (t.active === !0) return !0;
  if (t.active === !1) return !1;
  const n = (i = game == null ? void 0 : game.combats) == null ? void 0 : i.active;
  return (n == null ? void 0 : n.id) === t.id ? !0 : ((r = game == null ? void 0 : game.combat) == null ? void 0 : r.id) === t.id ? game.combat.active ?? !0 : !1;
}, "#isCombatDocumentActive"), Oc = /* @__PURE__ */ c(function(t) {
  return t ? typeof t.started == "boolean" ? t.started : (t.round ?? 0) > 0 : !1;
}, "#hasCombatStarted"), ws = /* @__PURE__ */ c(function() {
  var i;
  const t = Array.isArray((i = game == null ? void 0 : game.combats) == null ? void 0 : i.contents) ? game.combats.contents : [];
  for (const r of t)
    if (I(this, K, vs).call(this, r) && I(this, K, Oc).call(this, r))
      return !0;
  const n = game == null ? void 0 : game.combat;
  return !!(n && I(this, K, vs).call(this, n) && I(this, K, Oc).call(this, n));
}, "#isCombatRunning"), Ac = /* @__PURE__ */ c(function() {
  var n;
  g(this, qt).clear();
  const t = Array.isArray((n = game == null ? void 0 : game.combats) == null ? void 0 : n.contents) ? game.combats.contents : [];
  for (const i of t)
    i != null && i.id && g(this, qt).set(i.id, Math.max(i.round ?? 0, 1));
}, "#hydrateRoundTracking"), nn = /* @__PURE__ */ c(function({ pausedOverride: t } = {}) {
  const n = typeof t == "boolean" ? t : !!(game != null && game.paused), i = g(this, Ht), r = g(this, sn), o = i && r, s = {
    manageTimeEnabled: i,
    sceneAllowsRealTime: r,
    effectiveEnabled: o,
    paused: n,
    canControl: I(this, K, rr).call(this),
    combatRunning: I(this, K, ws).call(this),
    overrideApplied: typeof t == "boolean"
  };
  if (D("GameTimeAutomation | Sync running state", s), !o || !I(this, K, rr).call(this)) {
    I(this, K, Mc).call(this);
    return;
  }
  I(this, K, Rh).call(this);
}, "#syncRunningState"), Rh = /* @__PURE__ */ c(function() {
  g(this, jn) === null && (O(this, Ni, I(this, K, kc).call(this)), O(this, jn, globalThis.setInterval(() => I(this, K, Hh).call(this), 1e3)), D("GameTimeAutomation | Started real-time ticker"));
}, "#startRealTimeTicker"), Mc = /* @__PURE__ */ c(function() {
  g(this, jn) !== null && (globalThis.clearInterval(g(this, jn)), O(this, jn, null), D("GameTimeAutomation | Stopped real-time ticker")), O(this, Ni, null), O(this, on, 0), O(this, $i, !1);
}, "#stopRealTimeTicker"), Hh = /* @__PURE__ */ c(function() {
  if (!g(this, Ht) || !g(this, sn) || !I(this, K, rr).call(this)) {
    I(this, K, Mc).call(this);
    return;
  }
  const t = I(this, K, kc).call(this);
  if (typeof t != "number" || !Number.isFinite(t)) return;
  const n = g(this, Ni) ?? t, i = (t - n) / 1e3;
  if (O(this, Ni, t), !Number.isFinite(i) || i <= 0) return;
  const r = !!(game != null && game.paused), o = I(this, K, ws).call(this);
  if (r || o) {
    g(this, $i) || D("GameTimeAutomation | Tick skipped", { paused: r, combatRunning: o }), O(this, $i, !0), O(this, on, 0);
    return;
  }
  O(this, $i, !1), D("GameTimeAutomation | Real-time tick", { deltaSeconds: i }), I(this, K, xc).call(this, i);
}, "#tickRealTime"), xc = /* @__PURE__ */ c(function(t) {
  if (!g(this, Ht) || !g(this, sn)) return;
  const n = Number(t);
  !Number.isFinite(n) || n <= 0 || (O(this, on, g(this, on) + n), !g(this, Cr) && O(this, Cr, I(this, K, qh).call(this)));
}, "#queueAdvance"), qh = /* @__PURE__ */ c(async function() {
  var t, n;
  for (; g(this, on) > 0; ) {
    if (!g(this, Ht) || !g(this, sn) || game != null && game.paused || !I(this, K, rr).call(this) || I(this, K, ws).call(this)) {
      O(this, on, 0);
      break;
    }
    const i = g(this, on);
    O(this, on, 0);
    try {
      if (typeof ((t = game == null ? void 0 : game.time) == null ? void 0 : t.advance) == "function")
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
  O(this, Cr, null);
}, "#flushAdvanceQueue"), Ma = new WeakMap(), xa = new WeakMap(), _a = new WeakMap(), Na = new WeakMap(), $a = new WeakMap(), Fa = new WeakMap(), _c = /* @__PURE__ */ c(function() {
  const t = Jr();
  return Re(t) ? t : null;
}, "#getActiveSceneDocument"), jh = /* @__PURE__ */ c(function(t) {
  if (!Re(t)) return !1;
  try {
    return !!t.getFlag(k, ac);
  } catch (n) {
    return D("GameTimeAutomation | Failed to read scene real-time flag", {
      sceneId: (t == null ? void 0 : t.id) ?? null,
      message: (n == null ? void 0 : n.message) ?? String(n)
    }), !1;
  }
}, "#isSceneRealTimeAllowed"), Es = /* @__PURE__ */ c(function(t) {
  const n = Re(t) ? t : I(this, K, _c).call(this), i = I(this, K, jh).call(this, n), r = g(this, sn);
  return O(this, sn, i), r !== i ? (D("GameTimeAutomation | Scene real-time allowance changed", {
    sceneId: (n == null ? void 0 : n.id) ?? null,
    allows: i
  }), !0) : !1;
}, "#refreshSceneAutomationState"), Da = new WeakMap(), Pa = new WeakMap(), c(xd, "GameTimeAutomation");
let Ic = xd;
var ch, Bn, Je, Fi, Ln, Ra, Ae, Bh, Uh, Vh, Gh, Ha, $c, qa, Wh, ja, zh, Yh;
const bn = class bn extends yt(pt) {
  constructor(n = {}) {
    const { scene: i, trigger: r, triggerIndex: o, onSave: s, ...a } = n ?? {};
    super(a);
    _(this, Ae);
    _(this, Bn, null);
    _(this, Je, null);
    _(this, Fi, null);
    _(this, Ln, null);
    _(this, Ra, /* @__PURE__ */ c(() => {
      (this.rendered ?? this.isRendered ?? !1) && (O(this, Ln, I(this, Ae, Bh).call(this)), this.render({ force: !0 }));
    }, "#handleTimeFormatChange"));
    _(this, Ha, /* @__PURE__ */ c((n) => {
      var o, s;
      const i = n.currentTarget, r = i == null ? void 0 : i.closest("form");
      r && (D("Trigger action selection changed", {
        sceneId: ((o = this.scene) == null ? void 0 : o.id) ?? null,
        triggerId: ((s = this.trigger) == null ? void 0 : s.id) ?? null,
        actionId: (i == null ? void 0 : i.value) ?? null
      }), I(this, Ae, $c).call(this, i.value, r));
    }, "#onActionSelectChange"));
    _(this, qa, /* @__PURE__ */ c((n) => {
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
    _(this, ja, /* @__PURE__ */ c(async (n) => {
      var r, o;
      n.preventDefault();
      const i = n.currentTarget;
      i instanceof HTMLFormElement && (D("Trigger form submitted", {
        sceneId: ((r = this.scene) == null ? void 0 : r.id) ?? null,
        triggerId: ((o = this.trigger) == null ? void 0 : o.id) ?? null
      }), await I(this, Ae, zh).call(this, i));
    }, "#onSubmit"));
    this.scene = i ?? null, this.trigger = r ?? null, this.triggerIndex = Number.isInteger(o) ? Number(o) : null, this.onSave = typeof s == "function" ? s : null, O(this, Fi, Vu(g(this, Ra)));
  }
  async _prepareContext() {
    var n, i;
    xr("TriggerFormApplication#_prepareContext", {
      sceneId: ((n = this.scene) == null ? void 0 : n.id) ?? null,
      triggerId: ((i = this.trigger) == null ? void 0 : i.id) ?? null,
      triggerIndex: this.triggerIndex
    });
    try {
      const r = this.trigger ?? { action: bs, data: {} }, o = r.action ?? bs, s = Ud(r.time), a = s.format ?? "12h", l = a === "12h" ? cy() : [], u = s.period ?? (l.length > 0 ? l[0].value : null), d = a === "12h" ? l.map((m) => ({
        ...m,
        selected: m.value === u
      })) : [], f = Bd().map((m) => ({
        id: m.id,
        label: typeof m.label == "function" ? m.label() : m.label,
        selected: m.id === o
      })), h = Bd().map((m) => {
        const p = m.id === r.action ? r : { ...r, action: m.id }, y = ny(p);
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
    I(this, Ae, Wh).call(this, s), I(this, Ae, Uh).call(this, s), s.addEventListener("submit", g(this, ja));
    const a = s.querySelector("[data-action-select]");
    a && (a.addEventListener("change", g(this, Ha)), I(this, Ae, $c).call(this, a.value, s)), s.querySelectorAll("[data-action-file-picker]").forEach((f) => {
      f.addEventListener("click", g(this, qa));
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
Bn = new WeakMap(), Je = new WeakMap(), Fi = new WeakMap(), Ln = new WeakMap(), Ra = new WeakMap(), Ae = new WeakSet(), Bh = /* @__PURE__ */ c(function() {
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
}, "#captureFormState"), Uh = /* @__PURE__ */ c(function(n) {
  if (!g(this, Ln)) return;
  if (!(n instanceof HTMLFormElement)) {
    O(this, Ln, null);
    return;
  }
  const { fields: i = [], time: r = null } = g(this, Ln) ?? {};
  O(this, Ln, null), I(this, Ae, Vh).call(this, n, i), I(this, Ae, Gh).call(this, n, r);
}, "#restorePendingFormState"), Vh = /* @__PURE__ */ c(function(n, i) {
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
}, "#restoreFieldValues"), Gh = /* @__PURE__ */ c(function(n, i) {
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
    const T = Ud(d, o);
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
}, "#restoreTimeInputs"), Ha = new WeakMap(), $c = /* @__PURE__ */ c(function(n, i) {
  i && i.querySelectorAll("[data-action-config]").forEach((r) => {
    const o = r.dataset.actionConfig === n;
    r.style.display = o ? "" : "none";
  });
}, "#updateActionSections"), qa = new WeakMap(), Wh = /* @__PURE__ */ c(function(n) {
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
    const { canonical: y, error: E } = ly(
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
}, "#setupTimeInput"), ja = new WeakMap(), zh = /* @__PURE__ */ c(async function(n) {
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
  }), await I(this, Ae, Yh).call(this, r), await this.close();
}, "#handleSubmit"), Yh = /* @__PURE__ */ c(async function(n) {
  var o, s, a, l, u, d;
  const i = {
    id: ((o = this.trigger) == null ? void 0 : o.id) ?? Up(),
    time: n.time ?? "",
    action: n.action ?? bs,
    allowReplayOnRewind: !!n.allowReplayOnRewind,
    data: {}
  };
  D("Persisting trigger from form", {
    sceneId: ((s = this.scene) == null ? void 0 : s.id) ?? null,
    triggerId: i.id,
    existingIndex: this.triggerIndex
  }), iy(i, n);
  const r = yr(this.scene);
  this.triggerIndex !== null && r[this.triggerIndex] ? r[this.triggerIndex] = i : r.push(i);
  try {
    await kh(this.scene, r), D("Trigger list saved", {
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
      /* @__PURE__ */ new Set([...((ch = ye(bn, bn, "DEFAULT_OPTIONS")) == null ? void 0 : ch.classes) ?? [], "standard-form", "themed"])
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
let Nc = bn;
function He(e) {
  return e instanceof HTMLElement ? e : (e == null ? void 0 : e[0]) instanceof HTMLElement ? e[0] : null;
}
c(He, "asHTMLElement");
function Ss(e) {
  return typeof (e == null ? void 0 : e.changeTab) == "function";
}
c(Ss, "isAppV2");
function Wu(e, t, n, i = {}) {
  if (Ss(e)) {
    e.changeTab(t, n, i);
    return;
  }
  if (typeof (e == null ? void 0 : e.activateTab) == "function") {
    const r = { ...i };
    n != null && Array.isArray(e._tabs) && e._tabs.some((s) => s._group === n) && (r.group = n), r.triggerCallback == null && (r.triggerCallback = !0);
    try {
      e.activateTab(t, r);
    } catch {
      dy(e, t);
    }
  }
}
c(Wu, "setActiveTab");
function dy(e, t) {
  var s;
  const n = ((s = e.element) == null ? void 0 : s[0]) ?? e.element;
  if (!(n instanceof HTMLElement)) return;
  const i = n.querySelector("nav.sheet-tabs") ?? n.querySelector("nav.tabs");
  i && i.querySelectorAll("[data-tab]").forEach((a) => a.classList.remove("active")), n.querySelectorAll(".tab[data-tab]").forEach((a) => {
    a.classList.remove("active"), a.setAttribute("hidden", "true");
  });
  const r = i == null ? void 0 : i.querySelector(`[data-tab="${t}"]`), o = n.querySelector(`.tab[data-tab="${t}"]`);
  r == null || r.classList.add("active"), o && (o.classList.add("active"), o.removeAttribute("hidden"));
}
c(dy, "_manualTabActivation");
function nr(e) {
  var t, n;
  return typeof e != "string" ? "" : typeof ((t = foundry == null ? void 0 : foundry.utils) == null ? void 0 : t.escapeHTML) == "function" ? foundry.utils.escapeHTML(e) : typeof ((n = Handlebars == null ? void 0 : Handlebars.Utils) == null ? void 0 : n.escapeExpression) == "function" ? Handlebars.Utils.escapeExpression(e) : e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;");
}
c(nr, "escapeHTML");
function Bs(e, t) {
  if (!e || !t) return 0;
  const n = e.split(" / "), i = t.split(" / ");
  let r = 0;
  for (let o = 0; o < Math.min(n.length, i.length) && n[o] === i[o]; o++)
    r++;
  return r;
}
c(Bs, "sharedPathDepth");
function fy(e) {
  var n, i;
  if (!(e instanceof HTMLFormElement)) return {};
  const t = ((i = (n = foundry == null ? void 0 : foundry.applications) == null ? void 0 : n.ux) == null ? void 0 : i.FormDataExtended) ?? globalThis.FormDataExtended ?? (typeof FormDataExtended < "u" ? FormDataExtended : null);
  if (!t) return {};
  try {
    const r = new t(e), o = typeof r.object == "object" ? r.object : {};
    return foundry.utils.expandObject(o);
  } catch {
    return {};
  }
}
c(fy, "readFormData");
const Gd = Symbol.for("eidolon.sceneConfig.v13PatchedTabs");
function zu(e = {}) {
  const {
    tabId: t,
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
  } = e ?? {};
  if (!t)
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
  }, E = Symbol(`EIDOLON_SCENE_CONFIG_TAB_CLEANUP_${t}`), v = typeof i == "function" ? i : () => null, b = typeof r == "function" ? r : () => !0, w = typeof n == "function" ? n : () => typeof n == "string" ? n : t;
  function S() {
    var j, q, B, z, Z;
    const x = ((q = (j = foundry == null ? void 0 : foundry.applications) == null ? void 0 : j.sheets) == null ? void 0 : q.SceneConfig) ?? ((B = CONFIG == null ? void 0 : CONFIG.Scene) == null ? void 0 : B.sheetClass);
    if (!x || !Ss({ changeTab: (z = x.prototype) == null ? void 0 : z.changeTab })) return;
    const R = x[Gd] ?? /* @__PURE__ */ new Set();
    if (R.has(t)) return;
    R.add(t), x[Gd] = R;
    const P = (Z = x.TABS) == null ? void 0 : Z.sheet;
    if (P && Array.isArray(P.tabs) && !P.tabs.some((U) => U.id === t)) {
      const U = w({ app: null, scene: null }) ?? t;
      P.tabs.push({
        id: t,
        icon: h,
        label: U
      });
    }
    x.PARTS && !x.PARTS[t] && (x.PARTS[t] = {
      template: `modules/${f}/templates/scene-config-tab-mount.hbs`,
      scrollable: [`.tab[data-tab="${t}"]`]
    }), m("Patched v13 SceneConfig TABS/PARTS", { tabId: t });
  }
  c(S, "patchV13SceneConfig");
  function T(x, R) {
    var j, q;
    const P = v(x);
    if (!b(x, P)) {
      m("Skipped render", {
        tabId: t,
        reason: "inapplicable",
        constructor: ((j = x == null ? void 0 : x.constructor) == null ? void 0 : j.name) ?? null
      });
      return;
    }
    p("render", {
      tabId: t,
      sceneId: (P == null ? void 0 : P.id) ?? null,
      constructor: ((q = x == null ? void 0 : x.constructor) == null ? void 0 : q.name) ?? null
    });
    try {
      const B = He(R) ?? He(x.element);
      if (!B) {
        m("Missing root element", { tabId: t });
        return;
      }
      Ss(x) ? M(x, B, P) : A(x, B, P);
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
    var $e, oe, Me, Xe, wt, Ve, Et, V, ns, ee, Nt, Ge, Br, is, Ur, pi, Vr, yi;
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
    ].find((ge) => ge instanceof HTMLElement), Z = ((Xe = q == null ? void 0 : q.dataset) == null ? void 0 : Xe.group) ?? ((Et = (Ve = (wt = q == null ? void 0 : q.querySelector) == null ? void 0 : wt.call(q, "a[data-group]")) == null ? void 0 : Ve.dataset) == null ? void 0 : Et.group) ?? ((ee = (ns = (V = q == null ? void 0 : q.querySelector) == null ? void 0 : V.call(q, "[data-group]")) == null ? void 0 : ns.dataset) == null ? void 0 : ee.group) ?? ((Br = (Ge = (Nt = z == null ? void 0 : z.querySelector) == null ? void 0 : Nt.call(z, ".tab[data-group]")) == null ? void 0 : Ge.dataset) == null ? void 0 : Br.group) ?? ((Ur = (is = x._tabs) == null ? void 0 : is[0]) == null ? void 0 : Ur._group) ?? null;
    if (!q || !z) {
      m("Missing navigation elements", {
        tabId: t,
        hasNav: !!q,
        hasBody: !!z
      });
      return;
    }
    let U = q.querySelector(`[data-tab="${t}"]`);
    if (!U) {
      U = document.createElement("a"), U.dataset.action = "tab", Z && (U.dataset.group = Z), U.dataset.tab = t;
      const ge = q.querySelector("a[data-tab]");
      (pi = ge == null ? void 0 : ge.classList) != null && pi.contains("item") && U.classList.add("item"), q.appendChild(U), typeof a == "function" && a({ app: x, button: U, nav: q, scene: P }), m("Created tab button", { tabId: t, group: Z });
    }
    L(U, w({ app: x, scene: P }) ?? t, Ss(x));
    let G = z.querySelector(`.tab[data-tab="${t}"]`), me = !1;
    if (!G) {
      me = !0, G = document.createElement("div"), G.classList.add("tab"), G.dataset.tab = t, Z && (G.dataset.group = Z);
      const ge = Kh(z);
      z.insertBefore(G, ge ?? null), typeof l == "function" && l({ app: x, tab: G, body: z, scene: P }), m("Created tab container", { tabId: t, group: Z });
    }
    x._eidolonActiveTab === t || ((Vr = U.classList) == null ? void 0 : Vr.contains("active")) || G.classList.contains("active") ? (q.querySelectorAll("[data-tab].active").forEach((ge) => {
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
      x._eidolonActiveTab = t, Wu(x, t, Z), requestAnimationFrame(ce);
    }), U.dataset.eidolonEnsureSceneTabVisibility = "true");
    const qe = `data-eidolon-nav-watched-${t}`;
    q.hasAttribute(qe) || (q.addEventListener("click", (ge) => {
      const H = ge.target.closest("[data-tab]");
      H && H.dataset.tab !== t && delete x._eidolonActiveTab;
    }), q.setAttribute(qe, "true")), xl(x, E, m);
    const gn = o({
      app: x,
      scene: P,
      tab: G,
      tabButton: U,
      ensureTabVisible: ce,
      scheduleEnsureTabVisible: Se
    });
    typeof gn == "function" && Wd(x, E, gn), typeof u == "function" && u({
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
    const j = R.querySelector(`.tab[data-tab="${t}"]`), q = R.querySelector(`nav [data-tab="${t}"]`);
    if (!j || !q) {
      m("v2 mount not found, falling back to v1 injection", { tabId: t }), A(x, R, P);
      return;
    }
    L(q, w({ app: x, scene: P }) ?? t, !0);
    const B = /* @__PURE__ */ c(() => {
      var U;
      !((U = q.classList) != null && U.contains("active")) && !j.classList.contains("active") || (j.classList.add("active"), j.removeAttribute("hidden"), j.removeAttribute("aria-hidden"), j.style.display === "none" && (j.style.display = ""));
    }, "ensureTabVisible"), z = /* @__PURE__ */ c(() => {
      B(), requestAnimationFrame(B);
    }, "scheduleEnsureTabVisible");
    xl(x, E, m);
    const Z = o({
      app: x,
      scene: P,
      tab: j,
      tabButton: q,
      ensureTabVisible: B,
      scheduleEnsureTabVisible: z
    });
    typeof Z == "function" && Wd(x, E, Z), typeof u == "function" && u({
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
    xl(x, E, m);
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
c(zu, "createSceneConfigTabFactory");
function Wd(e, t, n) {
  if (!e || typeof n != "function") return;
  const i = e == null ? void 0 : e[t];
  Array.isArray(i) || (e[t] = []), e[t].push(n);
}
c(Wd, "registerCleanup");
function xl(e, t, n) {
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
c(xl, "invokeCleanup");
function Kh(e) {
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
c(Kh, "findFooterElement");
const hy = Zi(Nc), my = `modules/${k}/templates/time-trigger-scene-tab.html`, gy = zu({
  tabId: "time-triggers",
  tabLabel: /* @__PURE__ */ c(() => C("EIDOLON.TimeTrigger.Tab", "Time Triggers"), "tabLabel"),
  getScene: at,
  isApplicable: vy,
  renderContent: /* @__PURE__ */ c(({ app: e, scene: t, tab: n }) => yy(e, n, t), "renderContent"),
  logger: {
    log: D,
    group: xr,
    groupEnd: ii
  }
});
function py() {
  return D("Registering SceneConfig render hook"), gy.register();
}
c(py, "registerSceneConfigHook");
function yy(e, t, n) {
  if (!(t instanceof HTMLElement)) return;
  const i = Re(n) ? n : at(e);
  Us(e, t, i);
  const r = Vu(() => {
    Us(e, t, i);
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
c(yy, "renderTimeTriggerTab");
async function Us(e, t, n) {
  var r, o;
  const i = n ?? at(e);
  xr("renderTimeTriggersTabContent", { sceneId: (i == null ? void 0 : i.id) ?? null });
  try {
    if (!Re(i)) {
      const j = C(
        "EIDOLON.TimeTrigger.Unavailable",
        "Time triggers are unavailable for this configuration sheet."
      );
      t.innerHTML = `<p class="notes">${j}</p>`, D("Scene lacks document for time triggers", { sceneId: (i == null ? void 0 : i.id) ?? null });
      return;
    }
    const s = `flags.${k}.${Ps}`, a = `flags.${k}.${oc}`, l = `flags.${k}.${sc}`, u = !!i.getFlag(k, Ps), d = !!i.getFlag(k, oc), f = !!i.getFlag(k, sc), h = yr(i);
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
      const Z = (j.time ? ay(j.time) : "") || j.time || "" || $, U = ey(j.action), G = [
        `${F} ${Z}`,
        `${N} ${U}`,
        ...ty(j)
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
      console.error(`${k} | renderTemplate is unavailable; cannot render scene tab.`), t.innerHTML = `<p class="notes">${S}</p>`;
      return;
    }
    let P = "";
    try {
      P = await R(my, {
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
      console.error(`${k} | Failed to render time trigger scene tab template`, j), t.innerHTML = `<p class="notes">${S}</p>`;
      return;
    }
    t.innerHTML = P, by(e, t, i);
  } finally {
    ii();
  }
}
c(Us, "renderTimeTriggersTabContent");
function by(e, t, n) {
  const i = n ?? at(e);
  if (!Re(i)) return;
  const r = t.querySelector('[data-action="add-trigger"]');
  r && r.addEventListener("click", () => {
    D("Add trigger button clicked", { sceneId: i.id }), zd(e, { scene: i });
  }), t.querySelectorAll('[data-action="edit-trigger"]').forEach((o) => {
    o.addEventListener("click", () => {
      const s = Number(o.dataset.index);
      if (!Number.isInteger(s)) return;
      const l = yr(i)[s];
      l && (D("Edit trigger button clicked", { sceneId: i.id, triggerId: l.id, index: s }), zd(e, { trigger: l, triggerIndex: s, scene: i }));
    });
  }), t.querySelectorAll('[data-action="delete-trigger"]').forEach((o) => {
    o.addEventListener("click", async () => {
      var u, d;
      const s = Number(o.dataset.index);
      if (!Number.isInteger(s)) return;
      const a = yr(i), l = a[s];
      if (l) {
        a.splice(s, 1);
        try {
          D("Deleting trigger", {
            sceneId: i.id,
            index: s,
            triggerId: (l == null ? void 0 : l.id) ?? null
          }), await kh(i, a), await Us(e, t, i);
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
  }), t.querySelectorAll('[data-action="fire-trigger"]').forEach((o) => {
    o.addEventListener("click", async () => {
      var u, d, f, h, m, p, y;
      const s = Number(o.dataset.index);
      if (!Number.isInteger(s)) return;
      const l = yr(i)[s];
      if (l) {
        if (!((u = game.user) != null && u.isGM)) {
          (f = (d = ui.notifications) == null ? void 0 : d.warn) == null || f.call(
            d,
            C("EIDOLON.TimeTrigger.GMOnly", "Only the GM can adjust time.")
          );
          return;
        }
        try {
          D("Manually firing trigger", { sceneId: i.id, triggerId: l.id, index: s }), await Oh(i, l), (m = (h = ui.notifications) == null ? void 0 : h.info) == null || m.call(
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
c(by, "bindTimeTriggerTabEvents");
function zd(e, t = {}) {
  var s;
  const n = t.scene ?? null, i = n && Re(n) ? n : at(e);
  if (!Re(i)) {
    console.warn(`${k} | Unable to open trigger form because no scene document is available.`);
    return;
  }
  D("Opening trigger form", {
    sceneId: i.id,
    triggerId: ((s = t.trigger) == null ? void 0 : s.id) ?? null,
    index: Number.isInteger(t.triggerIndex) ? Number(t.triggerIndex) : null
  }), hy({
    scene: i,
    trigger: t.trigger ?? null,
    triggerIndex: t.triggerIndex ?? null,
    onSave: /* @__PURE__ */ c(() => {
      var l, u;
      const a = (u = (l = e.element) == null ? void 0 : l[0]) == null ? void 0 : u.querySelector('.tab[data-tab="time-triggers"]');
      a && Us(e, a, i);
    }, "onSave")
  }).render({ force: !0 });
}
c(zd, "openTriggerForm");
function vy(e, t) {
  var o, s, a, l, u;
  if (!e) return !1;
  const n = ((s = (o = foundry == null ? void 0 : foundry.applications) == null ? void 0 : o.sheets) == null ? void 0 : s.SceneConfig) ?? (globalThis == null ? void 0 : globalThis.SceneConfig);
  if (n && e instanceof n) return !0;
  const i = (a = e == null ? void 0 : e.constructor) == null ? void 0 : a.name;
  if (typeof i == "string" && i.includes("SceneConfig")) return !0;
  if (t) {
    const d = globalThis == null ? void 0 : globalThis.Scene;
    if (d && t instanceof d || (t == null ? void 0 : t.documentName) === "Scene" || (t == null ? void 0 : t.documentName) === "scenes" || (t == null ? void 0 : t.collection) === "scenes") return !0;
  }
  const r = ((l = e == null ? void 0 : e.options) == null ? void 0 : l.baseApplication) ?? ((u = e == null ? void 0 : e.options) == null ? void 0 : u.id);
  return !!(typeof r == "string" && r.includes("SceneConfig"));
}
c(vy, "isRecognizedSceneConfig");
const ss = new Lc(), Yd = new Ic();
function wy() {
  D("Registering time trigger hooks"), Hooks.once("init", () => {
    Vp(), Xp(), D("Time trigger settings registered during init");
  }), py(), D("Scene config hook registered"), Yd.registerHooks(), D("Time automation hooks registered"), Hooks.once("ready", () => {
    Jp(), D("Ready hook fired"), ss.onReady(), Yd.initialize();
  }), Hooks.on("canvasReady", (e) => {
    var t;
    D("canvasReady hook received", { scene: ((t = e == null ? void 0 : e.scene) == null ? void 0 : t.id) ?? null }), ss.onCanvasReady(e);
  }), Hooks.on("updateScene", (e) => {
    D("updateScene hook received", { scene: (e == null ? void 0 : e.id) ?? null }), ss.onUpdateScene(e);
  }), Hooks.on("updateWorldTime", (e, t) => {
    D("updateWorldTime hook received", { worldTime: e, diff: t }), ss.onUpdateWorldTime(e, t);
  });
}
c(wy, "registerTimeTriggerHooks");
wy();
const Oe = k, Xh = "criteria", Vs = "state", Ey = "criteriaVersion", Sy = 1, Jh = "enableCriteriaSurfaces";
let Kd = !1;
function Cy() {
  var e;
  if (!Kd) {
    if (Kd = !0, !((e = game == null ? void 0 : game.settings) != null && e.register)) {
      console.warn(`${Oe} | game.settings.register unavailable; scene criteria setting skipped.`);
      return;
    }
    game.settings.register(Oe, Jh, {
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
        Ty();
      }, "onChange")
    });
  }
}
c(Cy, "registerSceneCriteriaSettings");
function nl() {
  var e;
  try {
    if ((e = game == null ? void 0 : game.settings) != null && e.get)
      return !!game.settings.get(Oe, Jh);
  } catch (t) {
    console.error(`${Oe} | Failed to read criteria surfaces setting`, t);
  }
  return !0;
}
c(nl, "getCriteriaSurfacesEnabled");
function Ty() {
  var o, s, a, l, u;
  const e = C("EIDOLON.SceneCriteria.ReloadPromptTitle", "Reload Required"), t = `<p>${C(
    "EIDOLON.SceneCriteria.ReloadPromptBody",
    "Changes to criteria editor surfaces require a reload. Reload now?"
  )}</p>`, n = typeof ((o = foundry == null ? void 0 : foundry.utils) == null ? void 0 : o.debouncedReload) == "function", i = /* @__PURE__ */ c(() => {
    n ? foundry.utils.debouncedReload() : window.location.reload();
  }, "reload"), r = (a = (s = foundry == null ? void 0 : foundry.applications) == null ? void 0 : s.api) == null ? void 0 : a.DialogV2;
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
    C(
      "EIDOLON.SceneCriteria.ReloadNotice",
      "Please reload the world to apply criteria editor surface changes."
    )
  );
}
c(Ty, "promptReloadForCriteriaSurfaces");
const Gs = "Standard";
function bt(e) {
  var n;
  const t = (n = e == null ? void 0 : e.getFlag) == null ? void 0 : n.call(e, Oe, Xh);
  return t ? Qh(t) : [];
}
c(bt, "getSceneCriteria");
async function il(e, t, n = {}) {
  var o;
  if (!(e != null && e.update)) return;
  const i = Qh(t), r = rl(
    Zt(((o = e == null ? void 0 : e.getFlag) == null ? void 0 : o.call(e, Oe, Vs)) ?? {}),
    i
  );
  await e.update({
    [`flags.${Oe}.${Xh}`]: i,
    [`flags.${Oe}.${Ey}`]: Sy,
    [`flags.${Oe}.${Vs}`]: r
  }, n);
}
c(il, "setSceneCriteria");
function Qo(e, t = null) {
  var r;
  const n = Array.isArray(t) ? t : bt(e), i = Zt(((r = e == null ? void 0 : e.getFlag) == null ? void 0 : r.call(e, Oe, Vs)) ?? {});
  return rl(i, n);
}
c(Qo, "getSceneCriteriaState");
async function Ly(e, t, n = null) {
  if (!(e != null && e.setFlag)) return;
  const i = Array.isArray(n) ? n : bt(e), r = rl(t, i);
  await e.setFlag(Oe, Vs, r);
}
c(Ly, "setSceneCriteriaState");
function Yu(e = "") {
  const t = typeof e == "string" ? e.trim() : "", n = Zh(Dc(t || "criterion"), /* @__PURE__ */ new Set());
  return {
    id: em(),
    key: n,
    label: t,
    values: [Gs],
    default: Gs,
    order: 0
  };
}
c(Yu, "createSceneCriterion");
function Qh(e) {
  const t = Array.isArray(e) ? Zt(e) : [], n = [], i = /* @__PURE__ */ new Set();
  return t.forEach((r, o) => {
    const s = Fc(r, o, i);
    s && (n.push(s), i.add(s.key));
  }), n;
}
c(Qh, "sanitizeCriteria$1");
function Fc(e, t = 0, n = /* @__PURE__ */ new Set()) {
  if (!e || typeof e != "object") return null;
  const i = typeof e.id == "string" && e.id.trim() ? e.id.trim() : em(), o = (typeof e.label == "string" ? e.label : typeof e.name == "string" ? e.name : "").trim(), s = typeof e.key == "string" && e.key.trim() ? Dc(e.key) : Dc(o || `criterion-${Number(t) + 1}`), a = Zh(s, n), l = ky(e.values);
  let u = typeof e.default == "string" ? e.default.trim() : "";
  u || (u = l[0] ?? Gs), l.includes(u) || l.unshift(u);
  const d = Number.isFinite(e.order) ? Number(e.order) : Number(t);
  return {
    id: i,
    key: a,
    label: o,
    values: l,
    default: u,
    order: d
  };
}
c(Fc, "sanitizeCriterion");
function rl(e, t = []) {
  const n = e && typeof e == "object" ? Zt(e) : {}, i = {};
  for (const r of t) {
    const o = n == null ? void 0 : n[r.key], s = typeof o == "string" ? o.trim() : "";
    s && r.values.includes(s) ? i[r.key] = s : i[r.key] = r.default;
  }
  return i;
}
c(rl, "sanitizeSceneCriteriaState");
function Iy(e) {
  return bt(e).map((n) => ({
    id: n.key,
    key: n.key,
    name: n.label,
    values: [...n.values]
  }));
}
c(Iy, "getSceneCriteriaCategories");
function ky(e) {
  const t = Array.isArray(e) ? e : [], n = [];
  for (const i of t) {
    if (typeof i != "string") continue;
    const r = i.trim();
    !r || n.includes(r) || n.push(r);
  }
  return n.length || n.push(Gs), n;
}
c(ky, "sanitizeCriterionValues");
function Dc(e) {
  return String(e ?? "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "criterion";
}
c(Dc, "slugifyCriterionKey");
function Zh(e, t) {
  if (!t.has(e)) return e;
  let n = 2;
  for (; t.has(`${e}-${n}`); )
    n += 1;
  return `${e}-${n}`;
}
c(Zh, "ensureUniqueCriterionKey");
function em() {
  var e;
  return (e = foundry == null ? void 0 : foundry.utils) != null && e.randomID ? foundry.utils.randomID() : typeof (crypto == null ? void 0 : crypto.randomUUID) == "function" ? crypto.randomUUID() : Math.random().toString(36).slice(2, 11);
}
c(em, "generateCriterionId");
function tm(e) {
  var t, n;
  console.error(`${Oe} | Failed to persist scene criteria`, e), (n = (t = ui.notifications) == null ? void 0 : t.error) == null || n.call(
    t,
    C(
      "EIDOLON.SceneCriteria.PersistError",
      "Failed to persist the scene criteria."
    )
  );
}
c(tm, "notifyPersistError");
var uh, Ce, In, Ye, nm, Ba, Ua, Va, Ga, Cs, Wa, _o, No, Qr, im;
const vn = class vn extends yt(pt) {
  constructor(n = {}) {
    const { scene: i, criterion: r, isNew: o, onSave: s, ...a } = n ?? {};
    super(a);
    _(this, Ye);
    _(this, Ce, null);
    _(this, In, !1);
    _(this, Ba, /* @__PURE__ */ c(async (n) => {
      n.preventDefault();
      const i = n.currentTarget;
      if (!(i instanceof HTMLFormElement)) return;
      const r = new FormData(i), o = String(r.get("criterionLabel") ?? "").trim(), s = String(r.get("criterionKey") ?? "").trim(), a = Array.from(i.querySelectorAll('[name="criterionValues"]')).map((f) => f instanceof HTMLInputElement ? f.value.trim() : "").filter((f, h, m) => f && m.indexOf(f) === h), u = String(r.get("criterionDefault") ?? "").trim() || a[0] || "Standard", d = Fc(
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
      d && (O(this, Ce, d), await I(this, Ye, im).call(this), this.close());
    }, "#onSubmit"));
    _(this, Ua, /* @__PURE__ */ c((n) => {
      var s;
      if (g(this, In)) return;
      const i = n.currentTarget, r = (i == null ? void 0 : i.form) ?? ((s = this.element) == null ? void 0 : s.querySelector("form"));
      if (!(r instanceof HTMLFormElement)) return;
      const o = r.querySelector('input[name="criterionKey"]');
      o instanceof HTMLInputElement && (o.value = zr(i.value));
    }, "#onLabelInput"));
    _(this, Va, /* @__PURE__ */ c((n) => {
      var l;
      const i = n.currentTarget, r = (i == null ? void 0 : i.form) ?? ((l = this.element) == null ? void 0 : l.querySelector("form"));
      if (!(r instanceof HTMLFormElement) || !(i instanceof HTMLInputElement)) return;
      const o = r.querySelector('input[name="criterionLabel"]'), s = zr(o instanceof HTMLInputElement ? o.value : ""), a = zr(i.value);
      O(this, In, a !== s), i.value = a, I(this, Ye, Cs).call(this, r);
    }, "#onKeyInput"));
    _(this, Ga, /* @__PURE__ */ c((n) => {
      var s, a;
      n.preventDefault();
      const i = ((s = n.currentTarget) == null ? void 0 : s.form) ?? ((a = this.element) == null ? void 0 : a.querySelector("form"));
      if (!(i instanceof HTMLFormElement)) return;
      const r = i.querySelector('input[name="criterionLabel"]'), o = i.querySelector('input[name="criterionKey"]');
      o instanceof HTMLInputElement && (o.value = zr(r instanceof HTMLInputElement ? r.value : ""), O(this, In, !1), I(this, Ye, Cs).call(this, i));
    }, "#onResetAutoKey"));
    _(this, Wa, /* @__PURE__ */ c((n) => {
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
    `, r.appendChild(o), (f = o.querySelector('[data-action="remove-value"]')) == null || f.addEventListener("click", g(this, _o)), (h = o.querySelector('input[name="criterionValues"]')) == null || h.addEventListener("input", g(this, No)), I(this, Ye, Qr).call(this, i), (m = o.querySelector('input[name="criterionValues"]')) == null || m.focus();
    }, "#onAddValue"));
    _(this, _o, /* @__PURE__ */ c((n) => {
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
        I(this, Ye, Qr).call(this, i);
      }
    }, "#onRemoveValue"));
    _(this, No, /* @__PURE__ */ c((n) => {
      var r, o;
      const i = ((r = n.currentTarget) == null ? void 0 : r.form) ?? ((o = this.element) == null ? void 0 : o.querySelector("form"));
      i instanceof HTMLFormElement && I(this, Ye, Qr).call(this, i);
    }, "#onValuesChanged"));
    this.scene = i ?? null, this.criterion = r ?? null, this.onSave = typeof s == "function" ? s : null, this.isNew = !!o, O(this, Ce, I(this, Ye, nm).call(this)), O(this, In, g(this, Ce).key !== zr(g(this, Ce).label));
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
    r && (r.addEventListener("submit", g(this, Ba)), (s = r.querySelector('[data-action="add-value"]')) == null || s.addEventListener("click", g(this, Wa)), (a = r.querySelector('input[name="criterionLabel"]')) == null || a.addEventListener("input", g(this, Ua)), (l = r.querySelector('input[name="criterionKey"]')) == null || l.addEventListener("input", g(this, Va)), (u = r.querySelector('[data-action="reset-auto-key"]')) == null || u.addEventListener("click", g(this, Ga)), r.querySelectorAll('[data-action="remove-value"]').forEach((f) => {
      f.addEventListener("click", g(this, _o));
    }), r.querySelectorAll('input[name="criterionValues"]').forEach((f) => {
      f.addEventListener("input", g(this, No));
    }), (d = r.querySelector('[data-action="cancel"]')) == null || d.addEventListener("click", (f) => {
      f.preventDefault(), this.close();
    }), I(this, Ye, Cs).call(this, r), I(this, Ye, Qr).call(this, r));
  }
};
Ce = new WeakMap(), In = new WeakMap(), Ye = new WeakSet(), nm = /* @__PURE__ */ c(function() {
  const n = Fc(this.criterion, 0, /* @__PURE__ */ new Set()) ?? Yu(C("EIDOLON.SceneCriteria.DefaultCategoryName", "New Criterion"));
  return {
    id: n.id,
    key: n.key,
    label: n.label ?? "",
    values: Array.isArray(n.values) ? [...n.values] : [],
    default: n.default
  };
}, "#initializeState"), Ba = new WeakMap(), Ua = new WeakMap(), Va = new WeakMap(), Ga = new WeakMap(), Cs = /* @__PURE__ */ c(function(n) {
  const i = n.querySelector('[data-action="reset-auto-key"]');
  i instanceof HTMLButtonElement && (i.disabled = !g(this, In));
}, "#syncAutoKeyButton"), Wa = new WeakMap(), _o = new WeakMap(), No = new WeakMap(), Qr = /* @__PURE__ */ c(function(n) {
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
}, "#syncDefaultOptions"), im = /* @__PURE__ */ c(async function() {
  if (!this.scene) return;
  const n = bt(this.scene).sort((r, o) => r.order - o.order), i = n.findIndex((r) => r.id === g(this, Ce).id);
  i < 0 ? (g(this, Ce).order = n.length, n.push(g(this, Ce))) : (g(this, Ce).order = n[i].order, n.splice(i, 1, g(this, Ce)));
  try {
    await il(this.scene, n), this.onSave && await this.onSave(g(this, Ce));
  } catch (r) {
    tm(r);
  }
}, "#persist"), c(vn, "CategoryEditorApplication"), se(vn, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  ye(vn, vn, "DEFAULT_OPTIONS"),
  {
    id: `${Oe}-criterion-editor`,
    classes: Array.from(
      /* @__PURE__ */ new Set([...((uh = ye(vn, vn, "DEFAULT_OPTIONS")) == null ? void 0 : uh.classes) ?? [], "standard-form", "themed"])
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
let Pc = vn;
function zr(e) {
  return String(e ?? "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "criterion";
}
c(zr, "slugifyKey");
const Oy = `modules/${Oe}/templates/scene-criteria-tab.html`, Rc = {
  log: /* @__PURE__ */ c((...e) => {
    var t;
    return (t = console.debug) == null ? void 0 : t.call(console, `${Oe} | Criteria`, ...e);
  }, "log"),
  group: /* @__PURE__ */ c((...e) => {
    var t;
    return (t = console.groupCollapsed) == null ? void 0 : t.call(console, `${Oe} | Criteria`, ...e);
  }, "group"),
  groupEnd: /* @__PURE__ */ c(() => {
    var e;
    return (e = console.groupEnd) == null ? void 0 : e.call(console);
  }, "groupEnd")
}, Ay = Zi(Pc), My = zu({
  tabId: "criteria",
  tabLabel: /* @__PURE__ */ c(() => C("EIDOLON.SceneCriteria.TabLabel", "Criteria"), "tabLabel"),
  getScene: at,
  isApplicable: /* @__PURE__ */ c(() => nl(), "isApplicable"),
  renderContent: /* @__PURE__ */ c(({ app: e, tab: t, scene: n }) => _y(e, t, n), "renderContent"),
  logger: Rc
});
function xy() {
  return My.register();
}
c(xy, "registerSceneCriteriaConfigHook");
function _y(e, t, n) {
  if (!(t instanceof HTMLElement)) return;
  const i = Re(n) ? n : at(e);
  or(e, t, i);
}
c(_y, "renderCriteriaTab");
async function or(e, t, n) {
  var r, o;
  const i = n ?? at(e);
  Rc.group("renderCriteriaTabContent", { sceneId: (i == null ? void 0 : i.id) ?? null });
  try {
    if (!Re(i)) {
      const d = C(
        "EIDOLON.SceneCriteria.Unavailable",
        "Scene criteria are unavailable for this configuration sheet."
      );
      t.innerHTML = `<p class="notes">${d}</p>`;
      return;
    }
    const s = bt(i).sort((d, f) => d.order - f.order), a = Qo(i, s), l = ((o = (r = foundry == null ? void 0 : foundry.applications) == null ? void 0 : r.handlebars) == null ? void 0 : o.renderTemplate) ?? (typeof renderTemplate == "function" ? renderTemplate : globalThis == null ? void 0 : globalThis.renderTemplate);
    if (typeof l != "function") {
      t.innerHTML = `<p class="notes">${C("EIDOLON.SceneCriteria.CategoryListEmpty", "No criteria configured for this scene.")}</p>`;
      return;
    }
    const u = await l(Oy, {
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
          valueCountLabel: $y(d.values.length),
          canMoveUp: f > 0,
          canMoveDown: f < s.length - 1
        };
      }),
      hasCriteria: s.length > 0
    });
    t.innerHTML = u, Ny(e, t, i);
  } catch (s) {
    console.error(`${Oe} | Failed to render criteria tab`, s), t.innerHTML = `<p class="notes">${C("EIDOLON.SceneCriteria.CategoryListEmpty", "No criteria configured for this scene.")}</p>`;
  } finally {
    Rc.groupEnd();
  }
}
c(or, "renderCriteriaTabContent");
function Ny(e, t, n) {
  const i = n ?? at(e);
  if (!Re(i)) return;
  const r = t.querySelector('[data-criteria-action="add"]');
  r && r.addEventListener("click", () => {
    Xd(e, {
      scene: i,
      criterion: Yu(
        C("EIDOLON.SceneCriteria.DefaultCategoryName", "New Criterion")
      ),
      isNew: !0,
      onSave: /* @__PURE__ */ c(() => or(e, t, i), "onSave")
    });
  }), t.querySelectorAll('[data-criteria-action="edit"]').forEach((o) => {
    const s = o.dataset.criterionId;
    s && o.addEventListener("click", () => {
      const a = bt(i).find((l) => l.id === s);
      a && Xd(e, {
        scene: i,
        criterion: a,
        onSave: /* @__PURE__ */ c(() => or(e, t, i), "onSave")
      });
    });
  }), t.querySelectorAll('[data-criteria-action="remove"]').forEach((o) => {
    const s = o.dataset.criterionId;
    s && o.addEventListener("click", async () => {
      await _l(i, (l) => {
        const u = l.findIndex((d) => d.id === s);
        return u < 0 ? !1 : (l.splice(u, 1), Nl(l), !0);
      }) && await or(e, t, i);
    });
  }), t.querySelectorAll('[data-criteria-action="move-up"]').forEach((o) => {
    const s = o.dataset.criterionId;
    s && o.addEventListener("click", async () => {
      await _l(i, (l) => {
        const u = l.findIndex((f) => f.id === s);
        if (u <= 0) return !1;
        const [d] = l.splice(u, 1);
        return l.splice(u - 1, 0, d), Nl(l), !0;
      }) && await or(e, t, i);
    });
  }), t.querySelectorAll('[data-criteria-action="move-down"]').forEach((o) => {
    const s = o.dataset.criterionId;
    s && o.addEventListener("click", async () => {
      await _l(i, (l) => {
        const u = l.findIndex((f) => f.id === s);
        if (u < 0 || u >= l.length - 1) return !1;
        const [d] = l.splice(u, 1);
        return l.splice(u + 1, 0, d), Nl(l), !0;
      }) && await or(e, t, i);
    });
  });
}
c(Ny, "bindCriteriaTabEvents");
async function _l(e, t) {
  const n = bt(e).sort((r, o) => r.order - o.order);
  if (t(n) === !1) return !1;
  try {
    return await il(e, n, { render: !1 }), !0;
  } catch (r) {
    return tm(r), !1;
  }
}
c(_l, "mutateCriteria");
function Xd(e, t = {}) {
  const n = t.scene ?? null, i = n && Re(n) ? n : at(e);
  if (!Re(i))
    return;
  Ay({
    scene: i,
    criterion: t.criterion ?? null,
    isNew: !!t.isNew,
    onSave: typeof t.onSave == "function" ? t.onSave : null
  }).render({ force: !0 });
}
c(Xd, "openCriterionEditor");
function Nl(e) {
  e.forEach((t, n) => {
    t.order = n;
  });
}
c(Nl, "reindexCriteriaOrder");
function $y(e) {
  var t, n;
  if ((n = (t = game.i18n) == null ? void 0 : t.has) != null && n.call(t, "EIDOLON.SceneCriteria.ValueCountLabel"))
    try {
      return game.i18n.format("EIDOLON.SceneCriteria.ValueCountLabel", { count: e });
    } catch (i) {
      console.error(`${Oe} | Failed to format value count label`, i);
    }
  return e === 0 ? "No values configured" : e === 1 ? "1 value" : `${e} values`;
}
c($y, "formatValueCount");
let Jd = !1;
function Fy() {
  Hooks.once("init", () => {
    Cy();
  }), Hooks.once("ready", () => {
    nl() && (Jd || (xy(), Jd = !0));
  });
}
c(Fy, "registerSceneCriteriaHooks");
Fy();
const ie = k, rm = "criteriaEngineVersion", Ui = "fileIndex", Vi = "tileCriteria", Ku = {
  LEGACY: 1,
  CRITERIA: 2
}, om = Ku.CRITERIA;
function sm(e) {
  var t;
  return ((t = e == null ? void 0 : e.getFlag) == null ? void 0 : t.call(e, ie, rm)) ?? Ku.LEGACY;
}
c(sm, "getSceneEngineVersion");
function Dy(e, t, n, i, r) {
  if (!(e != null && e.length) || !(n != null && n.length)) return -1;
  const o = {};
  for (const a of n)
    o[a] = t[a];
  const s = Qd(e, o, n);
  if (s >= 0) return s;
  if (i != null && i.length && r) {
    const a = { ...o };
    for (const l of i) {
      if (!(l in a)) continue;
      a[l] = r[l] ?? "Standard";
      const u = Qd(e, a, n);
      if (u >= 0) return u;
    }
  }
  return -1;
}
c(Dy, "findBestMatch");
function Qd(e, t, n) {
  return e.findIndex((i) => {
    for (const r of n)
      if (i[r] !== t[r]) return !1;
    return !0;
  });
}
c(Qd, "findExactMatch");
function Py(e, t) {
  if (!(e != null && e.length)) return -1;
  let n = -1, i = -1;
  for (let r = 0; r < e.length; r += 1) {
    const o = e[r] ?? {}, s = Object.keys(o);
    if (s.length === 0) {
      i < 0 && (n = r, i = 0);
      continue;
    }
    let a = !0;
    for (const l of s)
      if (o[l] !== t[l]) {
        a = !1;
        break;
      }
    a && s.length > i && (n = r, i = s.length);
  }
  return n;
}
c(Py, "findFileIndex");
function Ts(e) {
  return e && typeof e == "object" && !Array.isArray(e);
}
c(Ts, "isPlainObject$2");
function Zd(e) {
  return e == null ? e : typeof structuredClone == "function" ? structuredClone(e) : JSON.parse(JSON.stringify(e));
}
c(Zd, "deepClone");
function Ry(e, t) {
  if (!t) return;
  const n = t.split(".").filter(Boolean);
  if (!n.length) return;
  let i = e;
  for (let r = 0; r < n.length - 1; r += 1) {
    if (!Ts(i == null ? void 0 : i[n[r]])) return;
    i = i[n[r]];
  }
  delete i[n.at(-1)];
}
c(Ry, "deletePath");
function am(e, t) {
  const n = Zd(e ?? {});
  if (!Ts(t)) return n;
  for (const [i, r] of Object.entries(t)) {
    if (i.startsWith("-=") && r === !0) {
      Ry(n, i.slice(2));
      continue;
    }
    Ts(r) && Ts(n[i]) ? n[i] = am(n[i], r) : n[i] = Zd(r);
  }
  return n;
}
c(am, "fallbackMerge");
function Hy(e, t) {
  var n, i;
  return (n = foundry == null ? void 0 : foundry.utils) != null && n.mergeObject && ((i = foundry == null ? void 0 : foundry.utils) != null && i.deepClone) ? foundry.utils.mergeObject(e, foundry.utils.deepClone(t), {
    inplace: !1
  }) : am(e, t);
}
c(Hy, "defaultMerge");
function qy(e, t) {
  if (!e) return !0;
  for (const n of Object.keys(e))
    if (e[n] !== t[n]) return !1;
  return !0;
}
c(qy, "criteriaMatch");
function lm(e, t, n, i) {
  const r = i ?? Hy;
  let o = r({}, e ?? {});
  if (!(t != null && t.length)) return o;
  const s = [];
  for (let a = 0; a < t.length; a += 1) {
    const l = t[a];
    if (qy(l == null ? void 0 : l.criteria, n)) {
      const u = l != null && l.criteria ? Object.keys(l.criteria).length : 0;
      s.push({ specificity: u, index: a, delta: l == null ? void 0 : l.delta });
    }
  }
  s.sort((a, l) => a.specificity - l.specificity || a.index - l.index);
  for (const a of s)
    a.delta && (o = r(o, a.delta));
  return o;
}
c(lm, "resolveRules");
function ol(e = null) {
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
c(ol, "canManageCriteria");
function jy(e = null) {
  if (!ol(e))
    throw new Error(`${ie} | You do not have permission to manage scene criteria.`);
}
c(jy, "requireCriteriaAccess");
const ef = 200;
function cm(e) {
  return e ? Number.isInteger(e.size) ? e.size : Array.isArray(e) || typeof e.length == "number" ? e.length : Array.from(e).length : 0;
}
c(cm, "getCollectionSize");
function zt() {
  return typeof (performance == null ? void 0 : performance.now) == "function" ? performance.now() : Date.now();
}
c(zt, "nowMs");
function um(e) {
  if (!Array.isArray(e)) return [];
  const t = /* @__PURE__ */ new Set();
  for (const n of e) {
    if (typeof n != "string") continue;
    const i = n.trim();
    i && t.add(i);
  }
  return Array.from(t);
}
c(um, "uniqueStringKeys");
function By(e, t = ef) {
  if (!Array.isArray(e) || e.length === 0) return [];
  const n = Number.isInteger(t) && t > 0 ? t : ef, i = [];
  for (let r = 0; r < e.length; r += n)
    i.push(e.slice(r, r + n));
  return i;
}
c(By, "chunkArray");
function ur(e) {
  return !!e && typeof e == "object" && !Array.isArray(e);
}
c(ur, "isPlainObject$1");
function Hc(e, t) {
  if (Object.is(e, t)) return !0;
  if (Array.isArray(e) || Array.isArray(t)) {
    if (!Array.isArray(e) || !Array.isArray(t) || e.length !== t.length) return !1;
    for (let n = 0; n < e.length; n += 1)
      if (!Hc(e[n], t[n])) return !1;
    return !0;
  }
  if (ur(e) || ur(t)) {
    if (!ur(e) || !ur(t)) return !1;
    const n = Object.keys(t);
    for (const i of n)
      if (!Hc(e[i], t[i])) return !1;
    return !0;
  }
  return !1;
}
c(Hc, "areValuesEqual");
function br(e) {
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
c(br, "normalizeFilePath");
function dm(e) {
  return typeof (e == null ? void 0 : e.name) == "string" ? e.name : typeof (e == null ? void 0 : e.src) == "string" ? e.src : "";
}
c(dm, "getFilePath");
function Xu(e) {
  if (!Array.isArray(e)) return [];
  const t = /* @__PURE__ */ new Map();
  return e.map((n, i) => {
    const r = br(dm(n)), o = r || `__index:${i}`, s = t.get(o) ?? 0;
    t.set(o, s + 1);
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
c(Xu, "buildTileFileEntries");
function ci(e, t) {
  if (!Number.isInteger(t) || t < 0) return null;
  const i = Xu(e).find((r) => r.index === t);
  return i ? { ...i.target } : { indexHint: t };
}
c(ci, "createTileTargetFromIndex");
function sl(e) {
  if (!e || typeof e != "object") return null;
  const t = br(e.path), n = Number(e.indexHint ?? e.fileIndex), i = Number(e.occurrence), r = {};
  return t && (r.path = t, r.occurrence = Number.isInteger(i) && i >= 0 ? i : 0), Number.isInteger(n) && n >= 0 && (r.indexHint = n), !r.path && !Number.isInteger(r.indexHint) ? null : r;
}
c(sl, "normalizeTileTarget");
function vo(e, t) {
  const n = sl(e);
  if (!n) return -1;
  const i = Xu(t);
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
c(vo, "resolveTileTargetIndex");
function di(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return {};
  const t = {};
  for (const [n, i] of Object.entries(e))
    typeof n != "string" || !n || typeof i != "string" || !i.trim() || (t[n] = i.trim());
  return t;
}
c(di, "sanitizeCriteria");
function Uy(e) {
  return Object.entries(di(e)).sort(([n], [i]) => n.localeCompare(i)).map(([n, i]) => `${n}=${i}`).join("");
}
c(Uy, "serializeCriteria");
function Vy(e) {
  return Object.keys(di(e)).length;
}
c(Vy, "getCriteriaSpecificity");
function Gy(e, t) {
  const n = di(e), i = di(t);
  for (const [r, o] of Object.entries(n))
    if (r in i && i[r] !== o)
      return !1;
  return !0;
}
c(Gy, "areCriteriaCompatible");
function Wy(e, t) {
  const n = vo(e, t);
  if (Number.isInteger(n) && n >= 0)
    return `index:${n}`;
  const i = sl(e);
  if (!i) return "";
  if (i.path) {
    const r = Number.isInteger(i.occurrence) ? i.occurrence : 0;
    return `path:${i.path}#${r}`;
  }
  return Number.isInteger(i.indexHint) ? `hint:${i.indexHint}` : "";
}
c(Wy, "getTargetIdentity");
function fm(e, t = {}) {
  var a;
  const n = Array.isArray(t.files) ? t.files : [], i = Yi(e, { files: n });
  if (!((a = i == null ? void 0 : i.variants) != null && a.length))
    return {
      errors: [],
      warnings: []
    };
  const r = i.variants.map((l, u) => ({
    index: u,
    criteria: di(l.criteria),
    specificity: Vy(l.criteria),
    criteriaSignature: Uy(l.criteria),
    targetIdentity: Wy(l.target, n)
  })), o = [], s = [];
  for (let l = 0; l < r.length; l += 1) {
    const u = r[l];
    for (let d = l + 1; d < r.length; d += 1) {
      const f = r[d];
      if (u.specificity !== f.specificity || !Gy(u.criteria, f.criteria)) continue;
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
c(fm, "detectTileCriteriaConflicts");
function zy(e, t) {
  if (!e || typeof e != "object") return null;
  let n = sl(e.target);
  if (!n) {
    const i = Number(e.fileIndex);
    Number.isInteger(i) && i >= 0 && (n = ci(t, i));
  }
  return n ? {
    criteria: di(e.criteria),
    target: n
  } : null;
}
c(zy, "normalizeTileVariant");
function hm(e, t = {}) {
  if (!Array.isArray(e) || e.length === 0) return null;
  const n = Array.isArray(t.files) ? t.files : null, i = e.map((l, u) => ({
    criteria: di(l),
    target: ci(n, u)
  })).filter((l) => l.target);
  if (!i.length) return null;
  const r = i.find((l) => Object.keys(l.criteria).length === 0), o = (r == null ? void 0 : r.target) ?? i[0].target;
  let s = null;
  const a = Number(t.defaultFileIndex);
  return Number.isInteger(a) && a >= 0 && (s = ci(n, a)), s || (s = o), {
    strategy: "select-one",
    variants: i,
    defaultTarget: s
  };
}
c(hm, "buildTileCriteriaFromFileIndex");
function Yi(e, t = {}) {
  const n = Array.isArray(t.files) ? t.files : null;
  if (Array.isArray(e))
    return hm(e, { files: n });
  if (!e || typeof e != "object") return null;
  const i = Array.isArray(e.variants) ? e.variants.map((o) => zy(o, n)).filter(Boolean) : [];
  if (!i.length) return null;
  let r = sl(e.defaultTarget);
  if (!r) {
    const o = Number(e.defaultFileIndex);
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
let Ws = /* @__PURE__ */ new WeakMap();
function Yy(e, t) {
  const n = Yi(e, { files: t });
  if (!n) return null;
  const i = n.variants.map((o) => {
    const s = di(o.criteria), a = vo(o.target, t);
    return !Number.isInteger(a) || a < 0 ? null : {
      criteria: s,
      keys: Object.keys(s),
      targetIndex: a
    };
  }).filter(Boolean), r = vo(n.defaultTarget, t);
  return !i.length && (!Number.isInteger(r) || r < 0) ? null : {
    variants: i,
    defaultIndex: r
  };
}
c(Yy, "compileTileMatcher");
function Ky(e, t, n) {
  const i = Ws.get(e);
  if (i && i.tileCriteria === t && i.files === n)
    return i.compiled;
  const r = Yy(t, n);
  return Ws.set(e, {
    tileCriteria: t,
    files: n,
    compiled: r
  }), r;
}
c(Ky, "getCompiledTileMatcher");
function Xy(e, t) {
  if (!e) return -1;
  let n = -1, i = -1;
  for (const r of e.variants) {
    const o = r.keys;
    let s = !0;
    for (const a of o)
      if (r.criteria[a] !== (t == null ? void 0 : t[a])) {
        s = !1;
        break;
      }
    s && o.length > i && (i = o.length, n = r.targetIndex);
  }
  return n >= 0 ? n : e.defaultIndex;
}
c(Xy, "selectTileFileIndexFromCompiled");
function tf(e = null) {
  e ? Ws.delete(e) : Ws = /* @__PURE__ */ new WeakMap();
}
c(tf, "invalidateTileMatcherCache");
function Jy({ extractKeys: e, label: t = "doc" }) {
  let n = /* @__PURE__ */ new WeakMap();
  function i(a, l) {
    const u = /* @__PURE__ */ new Map(), d = /* @__PURE__ */ new Set();
    for (const f of l) {
      const h = e(f);
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
    const d = um(u), f = r(a, l);
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
c(Jy, "createDependencyIndexManager");
async function mm(e, t, n, i) {
  const r = By(n, i);
  for (const o of r)
    await e.updateEmbeddedDocuments(t, o), r.length > 1 && await Promise.resolve();
  return r.length;
}
c(mm, "updateDocumentsInChunks");
const qc = /* @__PURE__ */ c((...e) => console.log(`${ie} | criteria tiles:`, ...e), "log$1"), gm = Jy({
  label: "tile",
  extractKeys(e) {
    var r;
    const t = e.getFlag(ie, Vi) ?? e.getFlag(ie, Ui);
    if (!t) return null;
    const n = Yi(t, { files: null });
    if (!((r = n == null ? void 0 : n.variants) != null && r.length)) return [];
    const i = [];
    for (const o of n.variants)
      for (const s of Object.keys(o.criteria ?? {}))
        s && i.push(s);
    return i;
  }
});
function Qy(e = null, t = null) {
  gm.invalidate(e ?? void 0), t ? tf(t) : e || tf(null);
}
c(Qy, "invalidateTileCriteriaCaches");
async function pm(e, t, n = {}) {
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
  if (t = t ?? ((l = game.scenes) == null ? void 0 : l.viewed), !t)
    return r.durationMs = zt() - i, r;
  const o = t.getEmbeddedCollection("Tile") ?? [];
  r.total = cm(o);
  const s = gm.getAffectedDocs(t, o, n.changedKeys);
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
    const w = Ky(E, v, b), S = Xy(w, e);
    if (!Number.isInteger(S) || S < 0 || S >= b.length) {
      console.warn(`${ie} | Tile ${E.id} has no valid file match for state`, e), r.skipped.noMatch += 1;
      continue;
    }
    const T = S, A = Number(E.getFlag("monks-active-tiles", "fileindex")) !== T, M = b.some((P, j) => !!(P != null && P.selected) != (j === S)), F = br(((u = E.texture) == null ? void 0 : u.src) ?? ((f = (d = E._source) == null ? void 0 : d.texture) == null ? void 0 : f.src) ?? ""), N = dm(b[S]), $ = br(N), x = !!$ && $ !== F;
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
    }))), A && (R["flags.monks-active-tiles.fileindex"] = T), x && (R.texture = { src: N }), a.push(R), qc(`Tile ${E.id} -> ${N}`);
  }
  if (a.length > 0) {
    const E = /* @__PURE__ */ new Map(), v = [];
    for (const b of a)
      if ((h = b.texture) != null && h.src) {
        v.push(b.texture.src);
        const w = t.tiles.get(b._id), S = ((m = w == null ? void 0 : w.texture) == null ? void 0 : m.src) ?? ((y = (p = w == null ? void 0 : w._source) == null ? void 0 : p.texture) == null ? void 0 : y.src);
        S && E.set(br(S), S);
      }
    if (v.length > 1) {
      const b = await eb(v);
      b > 0 && qc(`Pre-loaded ${b}/${v.length} texture(s)`);
    }
    r.chunks = await mm(t, "Tile", a, n.chunkSize), r.updated = a.length, E.size > 0 && nb(t, E);
  }
  return r.durationMs = zt() - i, r;
}
c(pm, "updateTiles");
const Zy = 2;
async function eb(e) {
  var s;
  const t = [...e];
  let n = 0;
  const i = (s = canvas == null ? void 0 : canvas.app) == null ? void 0 : s.renderer;
  async function r() {
    var a;
    for (; t.length > 0; ) {
      const l = t.shift();
      try {
        const u = await loadTexture(l);
        i && ((a = u == null ? void 0 : u.baseTexture) != null && a.valid) && i.texture.bind(u.baseTexture), n++, await new Promise((d) => requestAnimationFrame(d));
      } catch {
      }
    }
  }
  c(r, "worker");
  const o = Math.min(Zy, t.length);
  return await Promise.all(Array.from({ length: o }, r)), n;
}
c(eb, "preloadTexturesThrottled");
const tb = 3e3;
function nb(e, t) {
  const n = e.id;
  setTimeout(async () => {
    var a, l, u, d;
    const i = (a = game.scenes) == null ? void 0 : a.get(n);
    if (!i) return;
    const r = /* @__PURE__ */ new Set(), o = i.getEmbeddedCollection("Tile") ?? [];
    for (const f of o) {
      const h = ((l = f.texture) == null ? void 0 : l.src) ?? ((d = (u = f._source) == null ? void 0 : u.texture) == null ? void 0 : d.src);
      h && r.add(br(h));
    }
    let s = 0;
    for (const [f, h] of t)
      if (!r.has(f))
        try {
          await PIXI.Assets.unload(h), s++;
        } catch {
        }
    s > 0 && qc(`Released ${s} unused texture(s) from GPU/CPU memory`);
  }, tb);
}
c(nb, "scheduleTextureCleanup");
const oo = k, so = "lightCriteria", Ju = Object.freeze({
  base: null,
  mappings: [],
  current: null
});
function $l(e) {
  return e && typeof e == "object" && !Array.isArray(e);
}
c($l, "isPlainObject");
function ym(e, t) {
  if (!$l(t)) return {};
  const n = {};
  for (const [i, r] of Object.entries(t)) {
    const o = e == null ? void 0 : e[i];
    if ($l(r) && $l(o)) {
      const s = ym(o, r);
      Object.keys(s).length > 0 && (n[i] = s);
    } else r !== o && (n[i] = Zt(r));
  }
  return n;
}
c(ym, "computeDelta");
function bm(e) {
  var n;
  const t = ((n = e == null ? void 0 : e.getFlag) == null ? void 0 : n.call(e, oo, so)) ?? Ju;
  return wo(t);
}
c(bm, "getLightCriteriaState");
async function vm(e, t) {
  const n = wo(t);
  if (!(e != null && e.setFlag))
    return n;
  const i = n.base !== null, r = n.mappings.length > 0, o = n.current !== null;
  return !i && !r && !o ? (typeof e.unsetFlag == "function" ? await e.unsetFlag(oo, so) : await e.setFlag(oo, so, null), Ju) : (await e.setFlag(oo, so, n), n);
}
c(vm, "setLightCriteriaState");
async function Zo(e, t) {
  if (typeof t != "function")
    throw new TypeError("updateLightCriteriaState requires an updater function.");
  const n = Zt(bm(e)), i = await t(n);
  return vm(e, i);
}
c(Zo, "updateLightCriteriaState");
async function nf(e, t) {
  const n = Ki(t);
  if (!n)
    throw new Error("Invalid light configuration payload.");
  return Zo(e, (i) => ({
    ...i,
    base: n
  }));
}
c(nf, "storeBaseLighting");
async function rf(e, t, n, { label: i } = {}) {
  const r = es(t);
  if (!r)
    throw new Error("Cannot create a mapping without at least one category selection.");
  const o = Ki(n);
  if (!o)
    throw new Error("Invalid light configuration payload.");
  return Zo(e, (s) => {
    const a = qr(r), l = Array.isArray(s == null ? void 0 : s.mappings) ? [...s.mappings] : [], u = l.findIndex((m) => (m == null ? void 0 : m.key) === a), d = u >= 0 ? l[u] : null, f = typeof (d == null ? void 0 : d.id) == "string" && d.id.trim() ? d.id.trim() : Em(), h = al({
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
c(rf, "upsertLightCriteriaMapping");
async function ib(e, t, n, i, { replaceExisting: r = !1 } = {}) {
  const o = typeof t == "string" ? t.trim() : "";
  if (!o)
    throw new Error("A mapping id is required to retarget criteria.");
  const s = es(n);
  if (!s)
    throw new Error("Cannot retarget mapping without at least one category selection.");
  const a = Ki(i);
  if (!a)
    throw new Error("Invalid light configuration payload.");
  return Zo(e, (l) => {
    const u = Array.isArray(l == null ? void 0 : l.mappings) ? [...l.mappings] : [], d = u.findIndex((v) => (v == null ? void 0 : v.id) === o);
    if (d < 0)
      throw new Error("The selected mapping no longer exists.");
    const f = qr(s), h = u.findIndex(
      (v, b) => b !== d && (v == null ? void 0 : v.key) === f
    );
    if (h >= 0 && !r)
      throw new Error("A mapping already exists for the selected criteria.");
    const m = u[d], p = al({
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
c(ib, "retargetLightCriteriaMapping");
async function rb(e, t) {
  const n = typeof t == "string" ? t.trim() : "";
  if (!n)
    throw new Error("A mapping id is required to remove a mapping.");
  return Zo(e, (i) => {
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
c(rb, "removeLightCriteriaMapping");
async function ao(e, t) {
  const n = wm(t);
  return Zo(e, (i) => ({
    ...i,
    current: n
  }));
}
c(ao, "storeCurrentCriteriaSelection");
function ob(e) {
  const t = wo(e), n = t.base ?? {}, i = [];
  for (const r of t.mappings) {
    const o = es(r == null ? void 0 : r.categories);
    if (!o) continue;
    const s = ym(n, (r == null ? void 0 : r.config) ?? {});
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
c(ob, "convertLightCriteriaStateToPresets");
function sb(e, t = []) {
  const n = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Set();
  for (const l of t)
    typeof (l == null ? void 0 : l.key) == "string" && l.key.trim() && i.add(l.key.trim()), typeof (l == null ? void 0 : l.id) == "string" && l.id.trim() && typeof (l == null ? void 0 : l.key) == "string" && n.set(l.id.trim(), l.key.trim());
  const r = wo(e), o = /* @__PURE__ */ c((l) => {
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
    return u ? al({
      ...l,
      categories: u,
      key: qr(u)
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
  return wo({
    ...r,
    mappings: s,
    current: a
  });
}
c(sb, "migrateLightCriteriaCategoriesToKeys");
function wo(e) {
  var l;
  const t = Zt(e);
  if (!t || typeof t != "object")
    return Zt(Ju);
  const n = Ki(t.base), i = Array.isArray(t.mappings) ? t.mappings : [], r = /* @__PURE__ */ new Map();
  for (const u of i) {
    const d = al(u);
    d && r.set(d.key, d);
  }
  const o = Array.from(r.values()), s = new Map(o.map((u) => [u.id, u]));
  let a = wm(t.current);
  if (a) {
    const u = a.categories && Object.keys(a.categories).length > 0;
    if (a.mappingId && !s.has(a.mappingId)) {
      const d = u ? ((l = o.find((f) => f.key === qr(a.categories))) == null ? void 0 : l.id) ?? null : null;
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
c(wo, "sanitizeLightCriteriaState");
function Ki(e) {
  const t = Zt(e);
  if (!t || typeof t != "object") return null;
  const n = /* @__PURE__ */ new Set(["config", "hidden", "vision"]);
  for (const i of Object.keys(t))
    n.has(i) || delete t[i];
  return t;
}
c(Ki, "sanitizeLightConfigPayload");
function al(e) {
  if (!e || typeof e != "object") return null;
  const t = es(e.categories);
  if (!t) return null;
  const n = Ki(e.config);
  if (!n) return null;
  const i = typeof e.id == "string" && e.id.trim() ? e.id.trim() : Em(), r = qr(t), o = {
    id: i,
    key: r,
    categories: t,
    config: n,
    updatedAt: Number.isFinite(e.updatedAt) ? Number(e.updatedAt) : Date.now()
  };
  return typeof e.label == "string" && e.label.trim() && (o.label = e.label.trim()), o;
}
c(al, "sanitizeCriteriaMappingEntry");
function wm(e) {
  if (!e || typeof e != "object") return null;
  const t = typeof e.mappingId == "string" && e.mappingId.trim() ? e.mappingId.trim() : null, n = es(e.categories);
  return !t && !n ? null : {
    mappingId: t,
    categories: n,
    updatedAt: Number.isFinite(e.updatedAt) ? Number(e.updatedAt) : Date.now()
  };
}
c(wm, "sanitizeCurrentSelection");
function es(e) {
  const t = {};
  if (Array.isArray(e))
    for (const n of e) {
      const i = of((n == null ? void 0 : n.id) ?? (n == null ? void 0 : n.categoryId) ?? (n == null ? void 0 : n.category)), r = sf((n == null ? void 0 : n.value) ?? (n == null ? void 0 : n.selection) ?? (n == null ? void 0 : n.label));
      !i || !r || (t[i] = r);
    }
  else if (e && typeof e == "object")
    for (const [n, i] of Object.entries(e)) {
      const r = of(n), o = sf(i);
      !r || !o || (t[r] = o);
    }
  return Object.keys(t).length > 0 ? t : null;
}
c(es, "sanitizeCriteriaCategories");
function qr(e) {
  if (!e || typeof e != "object") return "";
  const t = Object.entries(e).filter(([, n]) => typeof n == "string" && n).map(([n, i]) => `${n}:${i}`);
  return t.sort((n, i) => n < i ? -1 : n > i ? 1 : 0), t.join("|");
}
c(qr, "computeCriteriaMappingKey");
function Em() {
  var e;
  return (e = foundry == null ? void 0 : foundry.utils) != null && e.randomID ? foundry.utils.randomID() : typeof (crypto == null ? void 0 : crypto.randomUUID) == "function" ? crypto.randomUUID() : Math.random().toString(36).slice(2, 10);
}
c(Em, "generateLightMappingId");
function of(e) {
  if (typeof e != "string") return null;
  const t = e.trim();
  return t || null;
}
c(of, "normalizeCategoryId");
function sf(e) {
  if (typeof e != "string") return null;
  const t = e.trim();
  return t || null;
}
c(sf, "normalizeCategoryValue");
const Eo = [];
function Sm(e) {
  typeof e == "function" && (Eo.includes(e) || Eo.push(e));
}
c(Sm, "registerHiddenLightProvider");
function ab(e) {
  const t = Eo.indexOf(e);
  t >= 0 && Eo.splice(t, 1);
}
c(ab, "unregisterHiddenLightProvider");
function lb() {
  const e = /* @__PURE__ */ new Set();
  for (const t of Eo)
    try {
      const n = t();
      if (Array.isArray(n))
        for (const i of n)
          i && e.add(i);
    } catch (n) {
      console.warn("eidolon-utilities | Hidden light provider error:", n);
    }
  return e;
}
c(lb, "getHiddenLightIds");
const Qu = /* @__PURE__ */ new Map(), So = [];
function Zr(e) {
  e != null && e.tag && Qu.set(e.tag, { ...e });
}
c(Zr, "registerTileConvention");
function cb(e) {
  Qu.delete(e);
}
c(cb, "unregisterTileConvention");
function Cm() {
  return Qu;
}
c(Cm, "getTileConventions");
function ub(e) {
  typeof e == "function" && (So.includes(e) || So.push(e));
}
c(ub, "registerIndexingHook");
function db(e) {
  const t = So.indexOf(e);
  t >= 0 && So.splice(t, 1);
}
c(db, "unregisterIndexingHook");
function fb() {
  return So;
}
c(fb, "getIndexingHooks");
const zs = ["AmbientLight", "Wall", "AmbientSound"];
let Ys = /* @__PURE__ */ new WeakMap(), Ks = /* @__PURE__ */ new WeakMap();
function hb(e) {
  const t = /* @__PURE__ */ new Set();
  for (const n of (e == null ? void 0 : e.rules) ?? [])
    for (const i of Object.keys((n == null ? void 0 : n.criteria) ?? {}))
      i && t.add(i);
  return Array.from(t);
}
c(hb, "getPresetDependencyKeys");
function mb(e, t) {
  const n = /* @__PURE__ */ new Map();
  for (const i of zs) {
    const r = t.get(i) ?? [], o = /* @__PURE__ */ new Set(), s = /* @__PURE__ */ new Map();
    for (const a of r) {
      const l = Lm(a, i);
      if (l != null && l.base) {
        o.add(a.id);
        for (const u of hb(l))
          s.has(u) || s.set(u, /* @__PURE__ */ new Set()), s.get(u).add(a.id);
      }
    }
    n.set(i, {
      allDocIds: o,
      keyToDocIds: s
    });
  }
  return {
    collectionsByType: t,
    byType: n
  };
}
c(mb, "buildPlaceableDependencyIndex");
function gb(e, t) {
  const n = Ks.get(e);
  if (n && zs.every((r) => n.collectionsByType.get(r) === t.get(r)))
    return n;
  const i = mb(e, t);
  return Ks.set(e, i), i;
}
c(gb, "getPlaceableDependencyIndex");
function pb(e, t, n) {
  if (!t || !e) return [];
  const i = um(n);
  if (!i.length)
    return typeof e.get == "function" ? Array.from(t.allDocIds).map((o) => e.get(o)).filter(Boolean) : Array.from(e).filter((o) => t.allDocIds.has(o.id));
  const r = /* @__PURE__ */ new Set();
  for (const o of i) {
    const s = t.keyToDocIds.get(o);
    if (s)
      for (const a of s) r.add(a);
  }
  return r.size ? typeof e.get == "function" ? Array.from(r).map((o) => e.get(o)).filter(Boolean) : Array.from(e).filter((o) => r.has(o.id)) : [];
}
c(pb, "getDocsForChangedKeys");
function Tm(e, t) {
  const n = { _id: t._id };
  for (const [r, o] of Object.entries(t)) {
    if (r === "_id") continue;
    const s = e == null ? void 0 : e[r];
    if (ur(o) && ur(s)) {
      const a = Tm(s, { _id: t._id, ...o });
      if (!a) continue;
      const l = Object.keys(a).filter((u) => u !== "_id");
      if (l.length > 0) {
        n[r] = {};
        for (const u of l)
          n[r][u] = a[u];
      }
      continue;
    }
    Hc(s, o) || (n[r] = o);
  }
  return Object.keys(n).filter((r) => r !== "_id").length > 0 ? n : null;
}
c(Tm, "buildChangedPayload");
function Lm(e, t) {
  var a;
  const n = ((a = e == null ? void 0 : e.flags) == null ? void 0 : a[ie]) ?? {}, i = (n == null ? void 0 : n.presets) ?? null, r = t === "AmbientLight" ? (n == null ? void 0 : n.lightCriteria) ?? null : null, o = Ys.get(e);
  if (o && o.type === t && o.rawPresets === i && o.rawLightCriteria === r)
    return o.presets;
  let s = null;
  if (n != null && n.presets) {
    const l = n.presets.base ?? null, u = Array.isArray(n.presets.rules) ? n.presets.rules : [];
    (l && Object.keys(l).length > 0 || u.length > 0) && (s = {
      base: l ?? {},
      rules: u
    });
  }
  if (!s && t === "AmbientLight" && (n != null && n.lightCriteria)) {
    const l = ob(n.lightCriteria);
    (l.base && Object.keys(l.base).length > 0 || l.rules.length > 0) && (s = {
      base: l.base,
      rules: l.rules
    });
  }
  return Ys.set(e, {
    type: t,
    rawPresets: i,
    rawLightCriteria: r,
    presets: s
  }), s;
}
c(Lm, "getPresetsForDocument");
function yb(e = null, t = null) {
  e ? Ks.delete(e) : Ks = /* @__PURE__ */ new WeakMap(), t ? Ys.delete(t) : e || (Ys = /* @__PURE__ */ new WeakMap());
}
c(yb, "invalidatePlaceableCriteriaCaches");
async function Im(e, t, n = {}) {
  var u, d;
  const i = zt(), r = {
    total: 0,
    scanned: 0,
    updated: 0,
    chunks: 0,
    byType: {},
    durationMs: 0
  };
  if (t = t ?? ((u = game.scenes) == null ? void 0 : u.viewed), !t)
    return r.durationMs = zt() - i, r;
  const o = lb(), s = new Map(
    zs.map((f) => [f, t.getEmbeddedCollection(f) ?? []])
  ), a = gb(t, s), l = [];
  for (const f of zs) {
    const h = s.get(f) ?? [], m = {
      total: cm(h),
      scanned: 0,
      updated: 0,
      chunks: 0
    }, p = a.byType.get(f) ?? null, y = pb(h, p, n.changedKeys);
    if (m.scanned = y.length, r.total += m.total, r.scanned += m.scanned, r.byType[f] = m, !y.length) continue;
    const E = [];
    for (const v of y) {
      const b = Lm(v, f);
      if (!(b != null && b.base)) continue;
      const w = lm(b.base, b.rules ?? [], e);
      w._id = v._id, f === "AmbientLight" && o.has(v._id) && (w.hidden = !0);
      const S = (v == null ? void 0 : v._source) ?? ((d = v == null ? void 0 : v.toObject) == null ? void 0 : d.call(v)) ?? {}, T = Tm(S, w);
      T && E.push(T);
    }
    E.length > 0 && l.push({ type: f, updates: E, typeMetrics: m });
  }
  return l.length > 0 && await Promise.all(l.map(async ({ type: f, updates: h, typeMetrics: m }) => {
    m.chunks = await mm(t, f, h, n.chunkSize), m.updated = h.length, r.updated += h.length, r.chunks += m.chunks, console.log(`${ie} | Updated ${h.length} ${f}(s)`);
  })), r.durationMs = zt() - i, r;
}
c(Im, "updatePlaceables");
const as = /* @__PURE__ */ new Map();
function bb(e) {
  var t;
  return e = e ?? ((t = game.scenes) == null ? void 0 : t.viewed), e ? Qo(e) : null;
}
c(bb, "getState");
async function vb(e, t, n = 0) {
  var m;
  const i = zt();
  if (t = t ?? ((m = game.scenes) == null ? void 0 : m.viewed), !t) return null;
  jy(t);
  const r = bt(t);
  if (!r.length)
    return console.warn(`${ie} | applyState skipped: scene has no criteria.`), null;
  const o = Qo(t, r), s = rl({ ...o, ...e ?? {} }, r), a = r.filter((p) => (o == null ? void 0 : o[p.key]) !== (s == null ? void 0 : s[p.key])).map((p) => p.key), l = a.length > 0;
  l && await Ly(t, s, r);
  const u = l ? s : o, [d, f] = await Promise.all([
    pm(u, t, { changedKeys: a }),
    Im(u, t, { changedKeys: a })
  ]), h = zt() - i;
  return D("Criteria apply telemetry", {
    sceneId: t.id,
    changedKeys: a,
    didChange: l,
    queuedMs: n,
    durationMs: h,
    tiles: d,
    placeables: f
  }), Hooks.callAll("eidolon-utilities.criteriaStateApplied", t, u), u;
}
c(vb, "applyStateInternal");
async function Zu(e, t) {
  var l;
  if (t = t ?? ((l = game.scenes) == null ? void 0 : l.viewed), !t) return null;
  const n = t.id ?? "__viewed__", i = zt(), r = as.get(n) ?? Promise.resolve();
  let o = null;
  const s = r.catch(() => null).then(async () => {
    const u = zt() - i;
    return vb(e, t, u);
  });
  o = s;
  const a = s.finally(() => {
    as.get(n) === a && as.delete(n);
  });
  return as.set(n, a), o;
}
c(Zu, "applyState$1");
function wb(e) {
  var t;
  return e = e ?? ((t = game.scenes) == null ? void 0 : t.viewed), e ? sm(e) : null;
}
c(wb, "getVersion");
async function km(e, t) {
  var n;
  t = t ?? ((n = game.scenes) == null ? void 0 : n.viewed), t != null && t.setFlag && await t.setFlag(ie, rm, Number(e));
}
c(km, "setVersion");
async function Eb(e) {
  return km(om, e);
}
c(Eb, "markCurrentVersion");
const Oi = "Standard", Sb = {
  nolights: "No Lights"
}, Cb = /* @__PURE__ */ c((...e) => console.log(`${ie} | criteria indexer:`, ...e), "log");
function Tb() {
  Zr({
    tag: "Map",
    positionMap: { 0: "mood", 1: "variant", 2: "effect" },
    positionMap4: { 0: "mood", 1: "stage", 2: "variant", 3: "effect" },
    required: !0,
    maxCount: 1
  }), Zr({ tag: "Floor", positionMap: "inherit" }), Zr({ tag: "Roof", positionMap: "inherit" }), Zr({
    tag: "Weather",
    positionMap: { 1: "effect" }
  });
}
c(Tb, "registerDefaultConventions");
function Xs(e) {
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
c(Xs, "parseFileTags");
function Lb(e, t, n = Oi, i = null) {
  return e != null && e.length ? e.map((r) => {
    var a;
    const o = Xs(r == null ? void 0 : r.name);
    if (!o) return {};
    const s = {};
    for (const [l, u] of Object.entries(t)) {
      const d = o[Number(l)];
      if (d == null) continue;
      const f = (a = i == null ? void 0 : i[l]) == null ? void 0 : a[d], h = f ?? u;
      (d !== n || f) && (s[h] = d);
    }
    return s;
  }) : [];
}
c(Lb, "buildFileIndex");
function Ib(e, t) {
  return e.map((n, i) => {
    const r = [...t[n] ?? /* @__PURE__ */ new Set()].sort(), s = r.includes(Oi) ? Oi : r[0] ?? Oi, a = Yu(n);
    return a.key = n, a.label = Sb[n] ?? n.charAt(0).toUpperCase() + n.slice(1), a.values = r.length ? r : [Oi], a.default = a.values.includes(s) ? s : a.values[0], a.order = i, a;
  });
}
c(Ib, "buildCriteriaDefinitions");
async function af(e, t, n, { dryRun: i = !1, valueOverrides: r = null } = {}) {
  var l;
  const o = e.getFlag("monks-active-tiles", "files");
  if (!(o != null && o.length)) return null;
  const s = Lb(o, t, Oi, r), a = hm(s, { files: o });
  for (const u of o) {
    const d = Xs(u == null ? void 0 : u.name);
    if (d)
      for (const [f, h] of Object.entries(t)) {
        const m = d[Number(f)];
        if (m == null) continue;
        const y = ((l = r == null ? void 0 : r[f]) == null ? void 0 : l[m]) ?? h;
        n[y] && n[y].add(m);
      }
  }
  return i || (await e.setFlag(ie, Vi, a), typeof e.unsetFlag == "function" && await e.unsetFlag(ie, Ui)), { files: o.length };
}
c(af, "indexTile");
function lf(e, t, n) {
  return e.positionMap === "inherit" ? n : t >= 4 && e.positionMap4 ? e.positionMap4 : e.positionMap;
}
c(lf, "resolvePositionMap");
function kb(e, t) {
  return t >= 4 && e.positionMap4 ? e.positionMap4 : e.positionMap;
}
c(kb, "resolvePrimaryPositionMap");
function Ob(e) {
  if (!Array.isArray(e)) return Cm();
  const t = /* @__PURE__ */ new Map();
  for (const n of e)
    n != null && n.tag && t.set(n.tag, { ...n });
  return t;
}
c(Ob, "resolveConventions");
async function Ab(e, t = {}) {
  var w, S, T, L, A, M, F;
  e != null && typeof e == "object" && !e.id && !e.tiles && (t = { ...e, ...t }, e = null);
  const {
    dryRun: n = !1,
    force: i = !1
  } = t;
  if (e = e ?? ((w = game.scenes) == null ? void 0 : w.viewed), !e) throw new Error("No scene provided to indexScene.");
  if (!globalThis.Tagger) throw new Error("Tagger is required to index scene criteria.");
  if (!i && sm(e) >= om)
    throw new Error(
      `Scene "${e.name}" is already criteria-indexed. Use force: true to re-index.`
    );
  const r = !!t.conventions, o = Ob(t.conventions), s = { sceneId: e.id };
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
    const P = Xs((S = R[0]) == null ? void 0 : S.name);
    if (!(P != null && P.length))
      throw new Error(`Cannot parse bracket tags from: ${((T = R[0]) == null ? void 0 : T.name) ?? "<unknown>"}`);
    if (P.length < 3)
      throw new Error(`Expected 3+ bracket tags, found ${P.length}.`);
    u = P.length, !r && u === 3 && ((L = a.positionMap) == null ? void 0 : L[2]) === "effect" && R.some((q) => {
      const B = Xs(q == null ? void 0 : q.name);
      return (B == null ? void 0 : B[2]) === "No Lights";
    }) && (a = {
      ...a,
      positionMap: { ...a.positionMap, 2: "nolights" }
    }, o.set(N, a));
    break;
  }
  if (!a)
    throw new Error("No required tile convention registered. Register conventions before indexing.");
  const d = kb(a, u), f = [], h = Object.keys(d).map(Number).sort((N, $) => N - $);
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
    const $ = lf(N, u, d);
    for (const x of Object.values($))
      m[x] || (m[x] = /* @__PURE__ */ new Set(), f.includes(x) || f.push(x));
  }
  const p = {}, y = fb();
  for (const [N, $] of o) {
    const x = Tagger.getByTag(N, s) ?? [], R = lf($, u, d), P = N.toLowerCase(), j = [];
    for (const q of x) {
      const B = await af(q, R, m, { dryRun: n, valueOverrides: $.valueOverrides });
      B && j.push(B);
    }
    p[P] = $.maxCount === 1 ? j[0] ?? null : j;
  }
  if (y.length > 0) {
    const N = e.getEmbeddedCollection("Tile") ?? [], $ = new Set(o.keys());
    for (const x of N) {
      if ((((M = (A = globalThis.Tagger) == null ? void 0 : A.getTags) == null ? void 0 : M.call(A, x)) ?? []).some((q) => $.has(q))) continue;
      const j = x.getFlag("monks-active-tiles", "files");
      if (j != null && j.length)
        for (const q of y)
          try {
            const B = q(e, x, j);
            if (B != null && B.positionMap) {
              await af(x, B.positionMap, m, { dryRun: n });
              break;
            }
          } catch (B) {
            console.warn(`${ie} | Indexing hook error:`, B);
          }
    }
  }
  const E = Ib(f, m);
  n || (await il(e, E), await Eb(e));
  const v = a.tag.toLowerCase();
  Cb(
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
c(Ab, "indexScene");
var dh, Qe, Ot, At, Di, ut, an, Un, za, he, Om, Am, Mm, Bc, xm, Uc, _m, eo, Vc;
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
    _(this, za, 120);
    this.setScene(n.scene ?? ((i = game.scenes) == null ? void 0 : i.viewed) ?? null);
  }
  setScene(n) {
    var i;
    O(this, Qe, n ?? ((i = game.scenes) == null ? void 0 : i.viewed) ?? null), I(this, he, Om).call(this);
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
      stateSummary: I(this, he, Vc).call(this)
    };
  }
  _onRender(n, i) {
    super._onRender(n, i), I(this, he, Am).call(this), I(this, he, Mm).call(this);
  }
  async _onClose(n) {
    return g(this, ut) !== null && (clearTimeout(g(this, ut)), O(this, ut, null)), g(this, Un) !== null && (Hooks.off("eidolon-utilities.criteriaStateApplied", g(this, Un)), O(this, Un, null)), super._onClose(n);
  }
};
Qe = new WeakMap(), Ot = new WeakMap(), At = new WeakMap(), Di = new WeakMap(), ut = new WeakMap(), an = new WeakMap(), Un = new WeakMap(), za = new WeakMap(), he = new WeakSet(), Om = /* @__PURE__ */ c(function() {
  if (!g(this, Qe)) {
    O(this, Ot, []), O(this, At, {});
    return;
  }
  O(this, Ot, bt(g(this, Qe)).sort((n, i) => n.order - i.order)), O(this, At, Qo(g(this, Qe), g(this, Ot)));
}, "#hydrateFromScene"), Am = /* @__PURE__ */ c(function() {
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
      }), I(this, he, xm).call(this, { [l]: a.value }));
    });
  }), (i = n.querySelector("[data-action='reset-defaults']")) == null || i.addEventListener("click", () => {
    I(this, he, _m).call(this);
  }), (r = n.querySelector("[data-action='close-switcher']")) == null || r.addEventListener("click", () => {
    this.close();
  }));
}, "#bindEvents"), Mm = /* @__PURE__ */ c(function() {
  g(this, Un) === null && O(this, Un, Hooks.on("eidolon-utilities.criteriaStateApplied", (n, i) => {
    !g(this, Qe) || (n == null ? void 0 : n.id) !== g(this, Qe).id || g(this, Di) || (O(this, At, { ...i ?? {} }), this.render({ force: !0 }));
  }));
}, "#ensureSyncHook"), Bc = /* @__PURE__ */ c(async function(n) {
  var i, r;
  if (g(this, Qe)) {
    I(this, he, eo).call(this, "applying"), O(this, Di, !0);
    try {
      const o = await Zu(n, g(this, Qe));
      o && O(this, At, o), I(this, he, eo).call(this, "ready"), this.render({ force: !0 });
    } catch (o) {
      console.error(`${ie} | Failed to apply criteria state`, o), (r = (i = ui.notifications) == null ? void 0 : i.error) == null || r.call(
        i,
        C(
          "EIDOLON.CriteriaSwitcher.ApplyError",
          "Failed to apply the selected criteria state."
        )
      ), I(this, he, eo).call(this, "error", (o == null ? void 0 : o.message) ?? "Unknown error");
    } finally {
      O(this, Di, !1), g(this, an) && I(this, he, Uc).call(this);
    }
  }
}, "#applyPartialState"), xm = /* @__PURE__ */ c(function(n) {
  O(this, an, {
    ...g(this, an) ?? {},
    ...n ?? {}
  }), g(this, ut) !== null && clearTimeout(g(this, ut)), I(this, he, eo).call(this, "applying"), O(this, ut, setTimeout(() => {
    O(this, ut, null), I(this, he, Uc).call(this);
  }, g(this, za)));
}, "#queuePartialState"), Uc = /* @__PURE__ */ c(async function() {
  if (g(this, Di) || !g(this, an)) return;
  const n = g(this, an);
  O(this, an, null), await I(this, he, Bc).call(this, n);
}, "#flushPendingState"), _m = /* @__PURE__ */ c(async function() {
  if (!g(this, Ot).length) return;
  const n = g(this, Ot).reduce((i, r) => (i[r.key] = r.default, i), {});
  O(this, At, n), g(this, ut) !== null && (clearTimeout(g(this, ut)), O(this, ut, null)), O(this, an, null), await I(this, he, Bc).call(this, n);
}, "#resetToDefaults"), eo = /* @__PURE__ */ c(function(n, i = "") {
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
        o.textContent = `${C("EIDOLON.CriteriaSwitcher.Ready", "Ready")}: ${I(this, he, Vc).call(this)}`;
        break;
    }
}, "#setStatus"), Vc = /* @__PURE__ */ c(function() {
  return g(this, Ot).length ? `[${g(this, Ot).map((n) => {
    var i;
    return ((i = g(this, At)) == null ? void 0 : i[n.key]) ?? n.default;
  }).join(" | ")}]` : "-";
}, "#formatStateSummary"), c(Dt, "CriteriaSwitcherApplication"), se(Dt, "APP_ID", `${ie}-criteria-switcher`), se(Dt, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  ye(Dt, Dt, "DEFAULT_OPTIONS"),
  {
    id: Dt.APP_ID,
    classes: Array.from(
      /* @__PURE__ */ new Set([...((dh = ye(Dt, Dt, "DEFAULT_OPTIONS")) == null ? void 0 : dh.classes) ?? [], "eidolon-criteria-switcher-window", "themed"])
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
let jc = Dt;
const Mb = Zi(jc);
let Gi = null;
function xb(e) {
  var t;
  return e ?? ((t = game.scenes) == null ? void 0 : t.viewed) ?? null;
}
c(xb, "resolveScene$1");
function _b(e) {
  var t;
  return !!(e != null && e.rendered && ((t = e == null ? void 0 : e.element) != null && t.isConnected));
}
c(_b, "isRendered");
function ll() {
  return _b(Gi) ? Gi : (Gi = null, null);
}
c(ll, "getCriteriaSwitcher");
function Nm(e) {
  var i, r, o, s, a;
  const t = xb(e);
  if (!t)
    return (r = (i = ui.notifications) == null ? void 0 : i.warn) == null || r.call(i, "No active scene to open the criteria switcher."), null;
  if (!ol(t))
    return (s = (o = ui.notifications) == null ? void 0 : o.warn) == null || s.call(o, "You do not have permission to manage scene criteria."), null;
  const n = ll();
  return n ? (n.setScene(t), n.render({ force: !0 }), (a = n.bringToFront) == null || a.call(n), n) : (Gi = Mb({ scene: t }), Gi.render({ force: !0 }), Gi);
}
c(Nm, "openCriteriaSwitcher");
function $m() {
  const e = ll();
  e && (e.close(), Gi = null);
}
c($m, "closeCriteriaSwitcher");
function ed(e) {
  return ll() ? ($m(), null) : Nm(e);
}
c(ed, "toggleCriteriaSwitcher");
const Nb = {
  SCHEMA_VERSION: Ku,
  applyState: Zu,
  getState: bb,
  getVersion: wb,
  setVersion: km,
  getCriteria(e) {
    var t;
    return bt(e ?? ((t = game.scenes) == null ? void 0 : t.viewed));
  },
  setCriteria(e, t) {
    var n;
    return il(t ?? ((n = game.scenes) == null ? void 0 : n.viewed), e);
  },
  updateTiles: pm,
  updatePlaceables: Im,
  indexScene: Ab,
  openCriteriaSwitcher: Nm,
  closeCriteriaSwitcher: $m,
  toggleCriteriaSwitcher: ed,
  findBestMatch: Dy,
  findFileIndex: Py,
  resolveRules: lm,
  // Convention registration API
  registerTileConvention: Zr,
  unregisterTileConvention: cb,
  getTileConventions: Cm,
  // Hidden light provider API
  registerHiddenLightProvider: Sm,
  unregisterHiddenLightProvider: ab,
  // Indexing hook API
  registerIndexingHook: ub,
  unregisterIndexingHook: db
};
function Gc(e, t = null) {
  let n = 0, i = e;
  for (; i instanceof HTMLElement && i !== t; )
    n += 1, i = i.parentElement;
  return n;
}
c(Gc, "elementDepth");
function $b(e) {
  return Array.isArray(e == null ? void 0 : e._tabs) ? new Set(e._tabs.map((t) => t == null ? void 0 : t._group).filter((t) => typeof t == "string" && t)) : /* @__PURE__ */ new Set();
}
c($b, "getAppTabGroups");
function Fm(e) {
  var t, n;
  return e instanceof HTMLElement ? e.dataset.group ?? ((n = (t = e.querySelector("[data-group]")) == null ? void 0 : t.dataset) == null ? void 0 : n.group) ?? null : null;
}
c(Fm, "getElementTabGroup");
function Fb(e, t) {
  if (!(e instanceof HTMLElement)) return 0;
  const n = Array.from(e.querySelectorAll(".tab[data-tab]"));
  return t ? n.filter((i) => i instanceof HTMLElement && i.dataset.group === t).length : n.length;
}
c(Fb, "countPanelsForGroup");
function Db(e, t = null) {
  if (!(e instanceof HTMLElement)) return [];
  const n = /* @__PURE__ */ new Map();
  for (const i of e.querySelectorAll(".tab[data-tab]")) {
    if (!(i instanceof HTMLElement) || t && i.dataset.group !== t) continue;
    const r = i.parentElement;
    r instanceof HTMLElement && n.set(r, (n.get(r) ?? 0) + 1);
  }
  return Array.from(n.entries()).map(([i, r]) => ({ element: i, tabCount: r }));
}
c(Db, "collectParentTabContainers");
function Pb(e, t = null) {
  var s;
  if (!(e instanceof HTMLElement)) return null;
  const n = [
    "nav.sheet-tabs[data-group]",
    "nav.tabs[data-group]",
    "nav.sheet-tabs",
    "nav.tabs"
  ], i = [];
  for (const a of n)
    for (const l of e.querySelectorAll(a))
      !(l instanceof HTMLElement) || i.includes(l) || i.push(l);
  if (!i.length) return null;
  const r = $b(t), o = i.map((a) => {
    const l = Fm(a), u = Fb(e, l), d = Gc(a, e), f = l && r.has(l) ? 100 : 0;
    return {
      nav: a,
      group: l,
      panelCount: u,
      depth: d,
      score: f + u * 10 - d
    };
  });
  return o.sort((a, l) => l.score - a.score || a.depth - l.depth), ((s = o[0]) == null ? void 0 : s.nav) ?? null;
}
c(Pb, "findTabNav");
function Rb(e, t) {
  var s, a, l;
  if (!(e instanceof HTMLElement)) return null;
  const n = Fm(t), i = [];
  if ((t == null ? void 0 : t.parentElement) instanceof HTMLElement) {
    const u = t.parentElement;
    i.push(u.querySelector(":scope > .sheet-body")), i.push(u.querySelector(":scope > .window-content"));
  }
  const r = Db(e, n).sort((u, d) => d.tabCount - u.tabCount || Gc(u.element, e) - Gc(d.element, e)).map((u) => u.element);
  return [
    (a = (s = t == null ? void 0 : t.parentElement) == null ? void 0 : s.querySelector) == null ? void 0 : a.call(s, ":scope > .sheet-body"),
    ...i,
    ...r,
    e.querySelector(".sheet-body"),
    (l = e.querySelector(".tab[data-tab]")) == null ? void 0 : l.parentElement,
    t == null ? void 0 : t.parentElement
  ].find((u) => u instanceof HTMLElement) ?? null;
}
c(Rb, "findTabBody");
function Hb(e, t) {
  var n, i, r, o, s, a, l;
  return ((n = e == null ? void 0 : e.dataset) == null ? void 0 : n.group) ?? ((o = (r = (i = e == null ? void 0 : e.querySelector) == null ? void 0 : i.call(e, "[data-group]")) == null ? void 0 : r.dataset) == null ? void 0 : o.group) ?? ((l = (a = (s = t == null ? void 0 : t.querySelector) == null ? void 0 : s.call(t, ".tab[data-group]")) == null ? void 0 : a.dataset) == null ? void 0 : l.group) ?? null;
}
c(Hb, "getTabGroup");
function qb(e, t, n) {
  if (!(e instanceof HTMLElement)) return;
  e.textContent = "";
  const i = document.createElement("i");
  i.className = n, i.setAttribute("inert", ""), e.append(i, " ");
  const r = document.createElement("span");
  r.textContent = t, e.append(r);
}
c(qb, "setTabButtonContent");
function jb(e, t, n) {
  const i = e.querySelector("[data-tab]"), r = (i == null ? void 0 : i.tagName) || "A", o = document.createElement(r);
  return i instanceof HTMLElement && (o.className = i.className), o.classList.remove("active"), r === "BUTTON" && (o.type = "button"), o.dataset.action = "tab", o.dataset.tab = n, t && (o.dataset.group = t), o.setAttribute("aria-selected", "false"), o.setAttribute("aria-pressed", "false"), o;
}
c(jb, "createTabButton");
function Bb(e, t, n) {
  const i = document.createElement("div");
  i.classList.add("tab"), i.dataset.tab = n, t && (i.dataset.group = t), i.dataset.applicationPart = n, i.setAttribute("hidden", "true");
  const r = Kh(e);
  return e.insertBefore(i, r ?? null), i;
}
c(Bb, "createTabPanel");
function Fl(e, t, n, i, r) {
  var a;
  if (!(i instanceof HTMLElement) || !(r instanceof HTMLElement)) return;
  const o = (a = e == null ? void 0 : e.tabGroups) == null ? void 0 : a[t];
  if (typeof o == "string" ? o === n : i.classList.contains("active") || r.classList.contains("active")) {
    i.classList.add("active"), i.setAttribute("aria-selected", "true"), i.setAttribute("aria-pressed", "true"), r.classList.add("active"), r.removeAttribute("hidden"), r.removeAttribute("aria-hidden");
    return;
  }
  i.classList.remove("active"), i.setAttribute("aria-selected", "false"), i.setAttribute("aria-pressed", "false"), r.classList.remove("active"), r.setAttribute("hidden", "true");
}
c(Fl, "syncTabVisibility");
function td(e, t, n, i, r) {
  const o = Pb(t, e), s = Rb(t, o);
  if (!(o instanceof HTMLElement) || !(s instanceof HTMLElement)) return null;
  const a = Hb(o, s);
  let l = o.querySelector(`[data-tab="${n}"]`);
  l instanceof HTMLElement || (l = jb(o, a, n), o.appendChild(l)), qb(l, i, r);
  let u = s.querySelector(`.tab[data-tab="${n}"]`);
  u instanceof HTMLElement || (u = Bb(s, a, n));
  const d = `data-eidolon-bound-${n}`;
  return l.hasAttribute(d) || (l.addEventListener("click", () => {
    Wu(e, n, a), requestAnimationFrame(() => {
      Fl(e, a, n, l, u);
    });
  }), l.setAttribute(d, "true")), Fl(e, a, n, l, u), requestAnimationFrame(() => {
    Fl(e, a, n, l, u);
  }), Ub(e, o), u;
}
c(td, "ensureTileConfigTab");
function Ub(e, t) {
  !(e != null && e.setPosition) || !(t instanceof HTMLElement) || requestAnimationFrame(() => {
    var o;
    if (t.scrollWidth <= t.clientWidth) return;
    const n = t.scrollWidth - t.clientWidth, i = e.element instanceof HTMLElement ? e.element : (o = e.element) == null ? void 0 : o[0];
    if (!i) return;
    const r = i.offsetWidth || 480;
    e.setPosition({ width: r + n + 16 });
  });
}
c(Ub, "fitNavWidth");
function Dm(e) {
  var t;
  return ((t = e == null ? void 0 : e.getFlag) == null ? void 0 : t.call(e, "monks-active-tiles", "files")) ?? [];
}
c(Dm, "getTileFiles$1");
function Vb(e = []) {
  return {
    strategy: "select-one",
    defaultTarget: ci(e, 0) ?? { indexHint: 0 },
    variants: [
      {
        criteria: {},
        target: ci(e, 0) ?? { indexHint: 0 }
      }
    ]
  };
}
c(Vb, "createDefaultTileCriteria");
function Gb(e, t = {}) {
  var s, a;
  const { allowLegacy: n = !0 } = t, i = Dm(e), r = (s = e == null ? void 0 : e.getFlag) == null ? void 0 : s.call(e, ie, Vi);
  if (r) return Yi(r, { files: i });
  if (!n) return null;
  const o = (a = e == null ? void 0 : e.getFlag) == null ? void 0 : a.call(e, ie, Ui);
  return o ? Yi(o, { files: i }) : null;
}
c(Gb, "getTileCriteria");
async function cf(e, t, n = {}) {
  if (!(e != null && e.setFlag)) return null;
  const {
    strictValidation: i = !0
  } = n, r = Dm(e), o = Yi(t, { files: r });
  if (!o)
    return typeof e.unsetFlag == "function" ? (await e.unsetFlag(ie, Vi), await e.unsetFlag(ie, Ui)) : (await e.setFlag(ie, Vi, null), await e.setFlag(ie, Ui, null)), null;
  if (i) {
    const s = fm(o, { files: r });
    if (s.errors.length > 0)
      throw new Error(
        `Tile criteria contains ${s.errors.length} conflicting rule pair(s). Resolve clashes before saving.`
      );
  }
  return await e.setFlag(ie, Vi, o), typeof e.unsetFlag == "function" && await e.unsetFlag(ie, Ui), o;
}
c(cf, "setTileCriteria");
const Wc = "__eidolon_any__", Js = "eidolon-tile-criteria", Wb = "fa-solid fa-sliders", zb = "monks-active-tiles", Pm = Symbol.for("eidolon.tileCriteriaUiState"), cl = ["all", "unmapped", "mapped", "conflicts"];
function Yb(e) {
  const t = e == null ? void 0 : e[Pm];
  return !t || typeof t != "object" ? {
    filterQuery: "",
    filterMode: "all",
    selectedFileIndex: null
  } : {
    filterQuery: typeof t.filterQuery == "string" ? t.filterQuery : "",
    filterMode: cl.includes(t.filterMode) ? t.filterMode : "all",
    selectedFileIndex: Number.isInteger(t.selectedFileIndex) ? t.selectedFileIndex : null
  };
}
c(Yb, "readUiState");
function Kb(e, t) {
  if (!e || !t) return;
  typeof t.filterQuery == "string" && (e.filterQuery = t.filterQuery), cl.includes(t.filterMode) && (e.filterMode = t.filterMode), Number.isInteger(t.selectedFileIndex) && e.fileEntries.some((i) => i.index === t.selectedFileIndex) && (e.selectedFileIndex = t.selectedFileIndex);
}
c(Kb, "applyUiState");
function Xb(e) {
  const t = e == null ? void 0 : e.app, n = e == null ? void 0 : e.state;
  !t || !n || (t[Pm] = {
    filterQuery: typeof n.filterQuery == "string" ? n.filterQuery : "",
    filterMode: cl.includes(n.filterMode) ? n.filterMode : "all",
    selectedFileIndex: Number.isInteger(n.selectedFileIndex) ? n.selectedFileIndex : null
  });
}
c(Xb, "persistUiState");
function Jb(e) {
  const t = (e == null ? void 0 : e.object) ?? (e == null ? void 0 : e.document) ?? null;
  return !(t != null && t.isEmbedded) || t.documentName !== "Tile" ? null : t;
}
c(Jb, "getTileDocument");
function Qb(e) {
  var t;
  return ((t = e == null ? void 0 : e.getFlag) == null ? void 0 : t.call(e, "monks-active-tiles", "files")) ?? [];
}
c(Qb, "getTileFiles");
function Zb(e, t) {
  var a;
  const n = (e == null ? void 0 : e.parent) ?? ((a = game.scenes) == null ? void 0 : a.viewed) ?? null, r = bt(n).sort((l, u) => l.order - u.order).map((l) => ({
    key: l.key,
    label: l.label || l.key,
    values: [...l.values ?? []]
  })), o = new Set(r.map((l) => l.key)), s = /* @__PURE__ */ new Map();
  for (const l of (t == null ? void 0 : t.variants) ?? [])
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
c(Zb, "getCriteriaDefinitions");
function ev(e) {
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
    let s = t;
    for (const a of r)
      s.folders.has(a) || s.folders.set(a, {
        folders: /* @__PURE__ */ new Map(),
        files: []
      }), s = s.folders.get(a);
    s.files.push({ entry: n, name: o || n.label });
  }
  return t;
}
c(ev, "buildTree");
function tv(e, t) {
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
c(tv, "collapseFolderBranch");
function nv(e, t) {
  const n = e.rulesByFile.get(t) ?? [], i = [];
  for (const r of n) {
    const o = Object.entries(r.criteria ?? {}).filter(([, a]) => typeof a == "string" && a.trim());
    if (!o.length) {
      i.push("*");
      continue;
    }
    const s = o.map(([a, l]) => `${e.criteriaLabels.get(a) ?? a}: ${l}`).join(" · ");
    i.push(s);
  }
  return i;
}
c(nv, "getRuleSummariesForFile");
function zc(e) {
  var m, p;
  const t = Qb(e), n = Xu(t), i = Gb(e, { allowLegacy: !0 }) ?? Vb(t), r = Zb(e, i), o = new Map(r.map((y) => [y.key, y.label])), s = new Map(
    n.map((y) => [
      y.index,
      y.path || y.label
    ])
  ), a = vo(i.defaultTarget, t), l = ((m = n[0]) == null ? void 0 : m.index) ?? 0, u = a >= 0 ? a : l, d = new Map(n.map((y) => [y.index, []]));
  let f = 1;
  for (const y of i.variants ?? []) {
    const E = vo(y.target, t);
    E < 0 || (d.has(E) || d.set(E, []), d.get(E).push({
      id: f,
      criteria: { ...y.criteria ?? {} }
    }), f += 1);
  }
  const h = n.some((y) => y.index === u) ? u : ((p = n[0]) == null ? void 0 : p.index) ?? null;
  return {
    files: t,
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
c(zc, "buildEditorState");
function Yc(e, t) {
  return e.rulesByFile.has(t) || e.rulesByFile.set(t, []), e.rulesByFile.get(t);
}
c(Yc, "getRulesForFile");
function iv(e) {
  return Object.fromEntries(
    Object.entries(e ?? {}).filter(([t, n]) => typeof t == "string" && t && typeof n == "string" && n.trim()).map(([t, n]) => [t, n.trim()])
  );
}
c(iv, "sanitizeRuleCriteria");
function Rm(e) {
  const t = ci(e.files, e.defaultIndex);
  if (!t) return null;
  const n = [], i = [];
  for (const [o, s] of e.rulesByFile.entries()) {
    const a = ci(e.files, o);
    if (a)
      for (const [l, u] of s.entries()) {
        const d = iv(u.criteria);
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
    target: { ...t }
  }), i.push({
    fileIndex: e.defaultIndex,
    ruleId: null,
    rulePosition: null,
    criteria: {},
    isFallback: !0
  })), {
    normalized: Yi(
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
c(Rm, "buildTileCriteriaDraft");
function rv(e) {
  var t;
  return ((t = Rm(e)) == null ? void 0 : t.normalized) ?? null;
}
c(rv, "exportTileCriteria");
function uf(e) {
  const t = Rm(e);
  if (!(t != null && t.normalized))
    return {
      errors: [],
      warnings: [],
      errorFileIndexes: [],
      warningFileIndexes: []
    };
  const n = fm(t.normalized, { files: e.files }), i = /* @__PURE__ */ c((a) => {
    const l = t.sources[a.leftIndex] ?? null, u = t.sources[a.rightIndex] ?? null;
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
c(uf, "analyzeRuleConflicts");
function ls(e, t = "neutral") {
  const n = document.createElement("span");
  return n.classList.add("eidolon-tile-criteria__badge"), n.dataset.kind = t, n.textContent = e, n;
}
c(ls, "createBadge");
function ov(e, t = {}) {
  const n = typeof e == "string" ? e : "", {
    maxLength: i = 42,
    headLength: r = 20,
    tailLength: o = 16
  } = t;
  if (!n || n.length <= i) return n;
  const s = n.slice(0, r).trimEnd(), a = n.slice(-o).trimStart();
  return `${s}...${a}`;
}
c(ov, "middleEllipsis");
function sv(e) {
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
      error: (r == null ? void 0 : r.message) ?? C("EIDOLON.TileCriteria.InvalidRegex", "Invalid regex."),
      matches: /* @__PURE__ */ c(() => !0, "matches")
    };
  }
}
c(sv, "createRegexFilter");
function av(e, t) {
  const n = document.createElement("select");
  n.dataset.criteriaKey = e.key;
  const i = document.createElement("option");
  i.value = Wc, i.textContent = "*", n.appendChild(i);
  const r = new Set(e.values ?? []);
  t && !r.has(t) && r.add(t);
  for (const o of r) {
    const s = document.createElement("option");
    s.value = o, s.textContent = o, n.appendChild(s);
  }
  return n.value = t ?? Wc, n;
}
c(av, "createCriterionSelect");
function lv(e, t, n, i) {
  var a;
  const r = document.createElement("div");
  r.classList.add("eidolon-tile-criteria__rule-editor");
  const o = document.createElement("div");
  o.classList.add("eidolon-tile-criteria__rule-grid");
  for (const l of t.criteriaDefinitions) {
    const u = document.createElement("label");
    u.classList.add("eidolon-tile-criteria__rule-field");
    const d = document.createElement("span");
    d.classList.add("eidolon-tile-criteria__criterion-label"), d.textContent = l.label, u.appendChild(d);
    const f = av(l, (a = e.criteria) == null ? void 0 : a[l.key]);
    f.addEventListener("change", () => {
      f.value === Wc ? delete e.criteria[l.key] : e.criteria[l.key] = f.value, i();
    }), u.appendChild(f), o.appendChild(u);
  }
  r.appendChild(o);
  const s = document.createElement("button");
  return s.type = "button", s.classList.add("control", "ui-control", "eidolon-tile-criteria__rule-remove"), s.textContent = C("EIDOLON.TileCriteria.RemoveRule", "Remove"), s.addEventListener("click", () => {
    const u = Yc(t, n).filter((d) => d.id !== e.id);
    t.rulesByFile.set(n, u), i();
  }), r.appendChild(s), r;
}
c(lv, "renderRuleEditor");
const Ls = /* @__PURE__ */ new WeakMap();
function Hm(e) {
  return (e == null ? void 0 : e.app) ?? (e == null ? void 0 : e.tile) ?? null;
}
c(Hm, "getDialogOwner");
function cv(e) {
  for (const t of e) {
    const n = He(t);
    if (n) return n;
    const i = He(t == null ? void 0 : t.element);
    if (i) return i;
  }
  return null;
}
c(cv, "findDialogRoot$1");
function uv(e, t, n) {
  const i = e.state, r = i.fileEntries.find((y) => y.index === t);
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
    i.defaultIndex = r.index, ot(e), n();
  })), u.appendChild(d);
  const f = document.createElement("button");
  f.type = "button", f.classList.add("control", "ui-control", "eidolon-tile-criteria__editor-action", "secondary"), f.textContent = C("EIDOLON.TileCriteria.ClearFileRules", "Clear File Rules"), f.addEventListener("click", () => {
    i.rulesByFile.set(r.index, []), ot(e), n();
  }), u.appendChild(f), o.appendChild(u);
  const h = document.createElement("div");
  h.classList.add("eidolon-tile-criteria__rule-editors");
  const m = Yc(i, r.index);
  if (m.length)
    for (const y of m)
      h.appendChild(
        lv(y, i, r.index, () => {
          ot(e), n();
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
    Yc(i, r.index).push({
      id: i.nextRuleId,
      criteria: {}
    }), i.nextRuleId += 1, ot(e), n();
  }), o.appendChild(p), o;
}
c(uv, "buildRuleEditorContent");
function dv(e, t) {
  var f, h, m;
  const n = Hm(e);
  if (!n) return;
  const i = Ls.get(n);
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
  Ls.set(n, r);
  const o = /* @__PURE__ */ c(() => {
    Ls.delete(n);
  }, "closeDialog"), s = /* @__PURE__ */ c(() => {
    r.host instanceof HTMLElement && r.host.replaceChildren(
      uv(r.controller, r.fileIndex, s)
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
        const y = cv(p), E = (v = y == null ? void 0 : y.querySelector) == null ? void 0 : v.call(y, ".eidolon-tile-criteria-editor-host");
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
c(dv, "openRuleEditorDialog");
function df(e) {
  var i;
  const t = Hm(e);
  if (!t) return;
  const n = Ls.get(t);
  (i = n == null ? void 0 : n.refresh) == null || i.call(n);
}
c(df, "refreshOpenRuleEditor");
function Kc(e, t) {
  return (e.rulesByFile.get(t) ?? []).length > 0;
}
c(Kc, "hasRulesForFile");
function qm(e, t) {
  var n, i;
  return ((n = e == null ? void 0 : e.errorFileIndexes) == null ? void 0 : n.includes(t)) || ((i = e == null ? void 0 : e.warningFileIndexes) == null ? void 0 : i.includes(t));
}
c(qm, "hasConflictForFile");
function fv(e, t, n) {
  switch (e.filterMode) {
    case "unmapped":
      return !Kc(e, t.index);
    case "mapped":
      return Kc(e, t.index);
    case "conflicts":
      return qm(n, t.index);
    case "all":
    default:
      return !0;
  }
}
c(fv, "matchesFilterMode");
function hv(e, t) {
  let n = 0, i = 0, r = 0;
  for (const o of e.fileEntries)
    Kc(e, o.index) ? n += 1 : i += 1, qm(t, o.index) && (r += 1);
  return {
    all: e.fileEntries.length,
    mapped: n,
    unmapped: i,
    conflicts: r
  };
}
c(hv, "getFilterModeCounts");
function mv(e) {
  switch (e) {
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
c(mv, "getFilterModeLabel");
function jm(e, t, n, i, r) {
  var u, d;
  const o = [...e.folders.keys()].sort((f, h) => f.localeCompare(h));
  for (const f of o) {
    const h = tv(f, e.folders.get(f)), m = document.createElement("li");
    m.classList.add("eidolon-tile-criteria__tree-branch");
    const p = document.createElement("div");
    p.classList.add("document", "folder", "update", "eidolon-tile-criteria__folder-row");
    const y = document.createElement("i");
    y.classList.add("fa-solid", "fa-folder-open"), p.appendChild(y);
    const E = document.createElement("span");
    E.classList.add("eidolon-tile-criteria__tree-folder-label"), E.textContent = h.label, E.title = h.label, p.appendChild(E), m.appendChild(p);
    const v = document.createElement("ul");
    v.classList.add("eidolon-tile-criteria__tree"), v.dataset.folder = h.label, jm(h.node, t, n, i, v), v.childElementCount > 0 && m.appendChild(v), r.appendChild(m);
  }
  const s = [...e.files].sort((f, h) => f.name.localeCompare(h.name));
  if (!s.length) return;
  const a = document.createElement("li"), l = document.createElement("ul");
  l.classList.add("document-list", "eidolon-tile-criteria__document-list");
  for (const f of s) {
    const h = f.entry, m = h.index === t.selectedFileIndex, p = h.index === t.defaultIndex, y = nv(t, h.index), E = document.createElement("li");
    E.classList.add("document", "update", "eidolon-tile-criteria__tree-file");
    const v = document.createElement("button");
    v.type = "button", v.classList.add("eidolon-tile-criteria__file-row");
    const b = (u = i == null ? void 0 : i.errorFileIndexes) == null ? void 0 : u.includes(h.index), w = (d = i == null ? void 0 : i.warningFileIndexes) == null ? void 0 : d.includes(h.index);
    b ? v.classList.add("has-conflict") : w && v.classList.add("has-warning");
    const S = t.relativePaths.get(h.index) || h.path || f.name, T = [S];
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
      t.selectedFileIndex = h.index, ot(n), dv(n, h.index);
    });
    const L = document.createElement("span");
    L.classList.add("eidolon-tile-criteria__indicator"), L.dataset.kind = p ? "default" : y.length ? "mapped" : "unmapped", v.appendChild(L);
    const A = document.createElement("span");
    A.classList.add("eidolon-tile-criteria__file-content");
    const M = document.createElement("span");
    M.classList.add("eidolon-tile-criteria__file-heading");
    const F = document.createElement("span");
    F.classList.add("eidolon-tile-criteria__file-title"), F.textContent = ov(f.name || h.label), F.title = S, M.appendChild(F);
    const N = ls(`#${h.index + 1}`, "meta");
    N.classList.add("eidolon-tile-criteria__index-badge"), M.appendChild(N), A.appendChild(M);
    const $ = document.createElement("span");
    $.classList.add("eidolon-tile-criteria__badges"), p && $.appendChild(ls(C("EIDOLON.TileCriteria.DefaultBadge", "Default"), "default"));
    const x = y.slice(0, 2);
    for (const R of x)
      $.appendChild(ls(R, "rule"));
    if (y.length > x.length && $.appendChild(ls(`+${y.length - x.length}`, "meta")), A.appendChild($), v.appendChild(A), b || w) {
      const R = document.createElement("span");
      R.classList.add("eidolon-tile-criteria__row-warning"), R.dataset.mode = b ? "error" : "warning", R.innerHTML = '<i class="fa-solid fa-triangle-exclamation" inert=""></i>', v.appendChild(R);
    }
    E.appendChild(v), l.appendChild(E);
  }
  a.appendChild(l), r.appendChild(a);
}
c(jm, "renderTreeNode");
function gv(e, t, n, i = {}) {
  const r = document.createElement("section");
  r.classList.add("eidolon-tile-criteria__tree-panel");
  const o = sv(e.filterQuery), s = hv(e, n);
  e.filterMode !== "all" && s[e.filterMode] === 0 && (e.filterMode = "all");
  const a = document.createElement("div");
  a.classList.add("eidolon-tile-criteria__toolbar");
  const l = document.createElement("div");
  l.classList.add("eidolon-tile-criteria__mode-bar");
  for (const b of cl) {
    const w = document.createElement("button");
    w.type = "button", w.classList.add("control", "ui-control", "eidolon-tile-criteria__mode-button"), w.dataset.mode = b, w.textContent = mv(b);
    const S = b === "all" || s[b] > 0;
    w.disabled = !S, S || (w.dataset.tooltip = C(
      "EIDOLON.TileCriteria.FilterModeUnavailable",
      "No entries currently match this filter."
    ), w.title = w.dataset.tooltip), e.filterMode === b ? (w.classList.add("is-active"), w.setAttribute("aria-pressed", "true")) : w.setAttribute("aria-pressed", "false"), w.addEventListener("click", () => {
      e.filterMode !== b && (e.filterMode = b, ot(t));
    }), l.appendChild(w);
  }
  a.appendChild(l);
  const u = document.createElement("div");
  u.classList.add("eidolon-tile-criteria__filter-row");
  const d = document.createElement("input");
  d.type = "text", d.classList.add("eidolon-tile-criteria__filter-input"), d.placeholder = C("EIDOLON.TileCriteria.FilterPlaceholder", "Regex filter (path)"), d.value = e.filterQuery, d.autocomplete = "off", d.addEventListener("keydown", (b) => {
    b.stopPropagation(), b.key === "Enter" && b.preventDefault();
  }), d.addEventListener("keyup", (b) => {
    b.stopPropagation();
  }), d.addEventListener("change", (b) => {
    b.stopPropagation();
  }), d.addEventListener("input", (b) => {
    b.stopPropagation();
    const w = d.selectionStart ?? d.value.length, S = d.selectionEnd ?? w;
    e.filterQuery = d.value, ot(t), requestAnimationFrame(() => {
      const T = t.section.querySelector(".eidolon-tile-criteria__filter-input");
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
  const v = e.fileEntries.filter((b) => {
    const w = e.relativePaths.get(b.index) || b.path || b.label;
    return fv(e, b, n) && o.matches(w);
  });
  if (e.fileEntries.length)
    if (v.length) {
      const b = document.createElement("ul");
      b.classList.add("eidolon-tile-criteria__tree"), jm(ev(v), e, t, n, b), E.appendChild(b);
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
c(gv, "renderTreePanel");
function ot(e) {
  const { section: t, state: n } = e, i = uf(n);
  Xb(e), t.replaceChildren();
  const r = /* @__PURE__ */ c(async () => {
    try {
      const s = uf(n);
      if (s.errors.length) {
        n.status = {
          mode: "error",
          message: C(
            "EIDOLON.TileCriteria.ConflictSaveBlocked",
            `Resolve ${s.errors.length} conflict(s) before saving tile criteria rules.`
          )
        }, ot(e);
        return;
      }
      const a = rv(n);
      if (!a) {
        n.status = {
          mode: "error",
          message: C("EIDOLON.TileCriteria.Invalid", "Invalid rules. Select valid target variants.")
        }, ot(e);
        return;
      }
      await cf(e.tile, a);
      const l = n.filterQuery, u = n.filterMode, d = n.selectedFileIndex;
      e.state = zc(e.tile), e.state.filterQuery = l, e.state.filterMode = u, Number.isInteger(d) && (e.state.selectedFileIndex = d), e.state.status = {
        mode: "ready",
        message: C("EIDOLON.TileCriteria.Saved", "Tile criteria rules saved.")
      }, ot(e), df(e);
    } catch (s) {
      console.error(`${ie} | Failed to save tile criteria`, s), n.status = {
        mode: "error",
        message: (s == null ? void 0 : s.message) ?? "Failed to save tile criteria rules."
      }, ot(e);
    }
  }, "handleSave"), o = /* @__PURE__ */ c(async () => {
    try {
      await cf(e.tile, null);
      const s = n.filterQuery, a = n.filterMode, l = n.selectedFileIndex;
      e.state = zc(e.tile), e.state.filterQuery = s, e.state.filterMode = a, Number.isInteger(l) && (e.state.selectedFileIndex = l), e.state.status = {
        mode: "ready",
        message: C("EIDOLON.TileCriteria.Cleared", "Tile criteria rules cleared.")
      }, ot(e), df(e);
    } catch (s) {
      console.error(`${ie} | Failed to clear tile criteria`, s), n.status = {
        mode: "error",
        message: (s == null ? void 0 : s.message) ?? "Failed to clear tile criteria rules."
      }, ot(e);
    }
  }, "handleClear");
  if (t.appendChild(gv(n, e, i, {
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
    ), s.appendChild(l), t.appendChild(s);
  }
  if (n.status.mode === "error" || n.status.mode === "warning") {
    const s = document.createElement("p");
    s.classList.add("eidolon-tile-criteria__status", "notes"), s.dataset.mode = n.status.mode, s.textContent = n.status.message, t.appendChild(s);
  }
}
c(ot, "renderController");
function pv(e, t = null) {
  const n = document.createElement("section");
  n.classList.add("eidolon-tile-criteria");
  const i = zc(e);
  Kb(i, Yb(t));
  const r = {
    app: t,
    tile: e,
    section: n,
    state: i
  };
  return ot(r), r;
}
c(pv, "createController");
function yv(e, t) {
  return td(
    e,
    t,
    Js,
    C("EIDOLON.TileCriteria.TabLabel", "Criteria"),
    Wb
  );
}
c(yv, "ensureTileCriteriaTab");
function bv(e, t) {
  var i;
  return [
    He(e == null ? void 0 : e.element),
    ((i = e == null ? void 0 : e.element) == null ? void 0 : i[0]) instanceof HTMLElement ? e.element[0] : null,
    (e == null ? void 0 : e.form) instanceof HTMLFormElement ? e.form : null,
    He(t)
  ].find((r) => r instanceof HTMLElement) ?? null;
}
c(bv, "resolveTileConfigRoot");
function vv() {
  var e;
  return ((e = game.modules.get(zb)) == null ? void 0 : e.active) === !0;
}
c(vv, "isMattActive");
function wv(e) {
  e.querySelectorAll(".eidolon-tile-criteria").forEach((t) => t.remove()), e.querySelectorAll(`[data-tab='${Js}']`).forEach((t) => t.remove());
}
c(wv, "removeInjectedTileCriteria");
function Ev() {
  Hooks.on("renderTileConfig", (e, t) => {
    var s, a, l;
    const n = bv(e, t);
    if (!n) return;
    const i = Jb(e);
    if (!i || (wv(n), !vv()))
      return;
    if (!nl()) {
      (s = n.querySelector(`.item[data-tab='${Js}']`)) == null || s.remove(), (a = n.querySelector(`.tab[data-tab='${Js}']`)) == null || a.remove();
      return;
    }
    const r = pv(i, e), o = yv(e, n);
    if (o instanceof HTMLElement) {
      o.replaceChildren(r.section), (l = e.setPosition) == null || l.call(e, { height: "auto" });
      return;
    }
    console.warn("eidolon-utilities | TileCriteria skipped unsafe fallback mount", {
      tileId: i.id ?? null
    });
  });
}
c(Ev, "registerTileCriteriaConfigControls");
const Sv = ["Checkbox", "Tile", "Settings", "Toggleable Lights"], Cv = [
  "Checkbox",
  "Tile",
  "Settings",
  "Toggleable Lights",
  "Checked",
  "Unchecked",
  "Individual"
];
function Tv() {
  if (!globalThis.Tagger) return [];
  const e = Tagger.getByTag(Sv) ?? [], t = [];
  for (const n of e) {
    if (n.getFlag("monks-active-tiles", "variables.state") !== "unchecked") continue;
    const i = (Tagger.getTags(n) ?? []).filter((s) => !Cv.includes(s)), r = (Tagger.getByTag("Disable Automation") ?? []).concat(Tagger.getByTag("Settings") ?? []), o = Tagger.getByTag(i, { ignore: r }) ?? [];
    for (const s of o)
      s != null && s._id && t.push(s._id);
  }
  return t;
}
c(Tv, "buildLightControlsMap");
function Lv() {
  Sm(Tv);
}
c(Lv, "registerCheckboxLightProvider");
function Iv(e) {
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
c(Iv, "toList");
function kv(e, t) {
  const n = e == null ? void 0 : e.tools;
  return Array.isArray(n) ? n.some((i) => (i == null ? void 0 : i.name) === t) : n instanceof Map ? n.has(t) : n && typeof n == "object" ? t in n ? !0 : Object.values(n).some((i) => (i == null ? void 0 : i.name) === t) : !1;
}
c(kv, "hasTool");
function Ov(e, t) {
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
c(Ov, "addTool");
function Av() {
  Hooks.on("getSceneControlButtons", (e) => {
    var i;
    const t = Iv(e);
    if (!t.length) return;
    const n = t.find((r) => (r == null ? void 0 : r.name) === "tiles") ?? t.find((r) => (r == null ? void 0 : r.name) === "tokens" || (r == null ? void 0 : r.name) === "token") ?? t[0];
    n && (kv(n, "eidolonCriteriaSwitcher") || Ov(n, {
      name: "eidolonCriteriaSwitcher",
      title: "Criteria Switcher",
      icon: "fa-solid fa-sliders",
      button: !0,
      toggle: !1,
      visible: ol(((i = game.scenes) == null ? void 0 : i.viewed) ?? null),
      onClick: /* @__PURE__ */ c(() => ed(), "onClick")
    }));
  });
}
c(Av, "registerSceneControlButton");
function cs(e, t) {
  if (!e || typeof e != "object") return !1;
  const n = String(t).split(".");
  let i = e;
  for (const r of n) {
    if (!i || typeof i != "object" || !Object.prototype.hasOwnProperty.call(i, r)) return !1;
    i = i[r];
  }
  return !0;
}
c(cs, "hasOwnPath");
function Mv() {
  const e = /* @__PURE__ */ c((i, r = null) => {
    i && Qy(i, r);
  }, "invalidateTileScene"), t = /* @__PURE__ */ c((i, r = null) => {
    i && yb(i, r);
  }, "invalidatePlaceableScene");
  Hooks.on("createTile", (i) => {
    e((i == null ? void 0 : i.parent) ?? null, i ?? null);
  }), Hooks.on("deleteTile", (i) => {
    e((i == null ? void 0 : i.parent) ?? null, i ?? null);
  }), Hooks.on("updateTile", (i, r) => {
    (cs(r, `flags.${ie}.tileCriteria`) || cs(r, `flags.${ie}.fileIndex`)) && e((i == null ? void 0 : i.parent) ?? null, i ?? null);
  });
  const n = /* @__PURE__ */ c((i) => {
    Hooks.on(`create${i}`, (r) => {
      t((r == null ? void 0 : r.parent) ?? null, r ?? null);
    }), Hooks.on(`delete${i}`, (r) => {
      t((r == null ? void 0 : r.parent) ?? null, r ?? null);
    }), Hooks.on(`update${i}`, (r, o) => {
      const s = cs(o, `flags.${ie}.presets`), a = i === "AmbientLight" && cs(o, `flags.${ie}.lightCriteria`);
      !s && !a || t((r == null ? void 0 : r.parent) ?? null, r ?? null);
    });
  }, "registerPlaceableHooks");
  n("AmbientLight"), n("Wall"), n("AmbientSound"), Hooks.on("canvasReady", (i) => {
    const r = (i == null ? void 0 : i.scene) ?? null;
    r && (e(r), t(r));
  });
}
c(Mv, "registerCriteriaCacheInvalidationHooks");
function xv() {
  Tb(), Lv(), Av(), Ev(), Mv(), Hooks.once("init", () => {
    var e, t;
    (t = (e = game.keybindings) == null ? void 0 : e.register) == null || t.call(e, ie, "toggleCriteriaSwitcher", {
      name: "Toggle Criteria Switcher",
      hint: "Open or close the criteria switcher window for live scene state updates.",
      editable: [{ key: "KeyM", modifiers: ["Alt"] }],
      onDown: /* @__PURE__ */ c(() => {
        var n, i, r;
        return ol(((n = game.scenes) == null ? void 0 : n.viewed) ?? null) ? (ed(), !0) : ((r = (i = ui.notifications) == null ? void 0 : i.warn) == null || r.call(i, "You do not have permission to manage scene criteria."), !0);
      }, "onDown"),
      restricted: !0,
      precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL
    });
  }), Hooks.on("canvasReady", (e) => {
    var n;
    const t = ll();
    t && (t.setScene((e == null ? void 0 : e.scene) ?? ((n = game.scenes) == null ? void 0 : n.viewed) ?? null), t.render({ force: !0 }));
  }), Hooks.once("ready", () => {
    var t, n;
    const e = (n = (t = game.modules) == null ? void 0 : t.get) == null ? void 0 : n.call(t, ie);
    e && (e.api || (e.api = {}), e.api.criteria = Nb, console.log(`${ie} | Criteria engine API registered`));
  });
}
c(xv, "registerCriteriaEngineHooks");
xv();
const Is = /* @__PURE__ */ new WeakMap(), us = /* @__PURE__ */ new WeakMap(), Le = "__eidolon_default__";
function _v() {
  Hooks.on("renderAmbientLightConfig", Nv), D("LightCriteria | AmbientLightConfig controls registered");
}
c(_v, "registerAmbientLightCriteriaControls");
function Nv(e, t) {
  var n;
  xr("LightCriteria | renderAmbientLightConfig", {
    appId: (e == null ? void 0 : e.id) ?? null,
    constructor: ((n = e == null ? void 0 : e.constructor) == null ? void 0 : n.name) ?? null,
    isRendered: (e == null ? void 0 : e.rendered) ?? !1
  });
  try {
    const i = He(t);
    if (!i) return;
    if (!nl()) {
      i.querySelectorAll(".eidolon-light-criteria, .eidolon-light-criteria-main-switcher").forEach((r) => r.remove());
      return;
    }
    $v(e, i);
  } catch (i) {
    console.error("eidolon-utilities | Failed to enhance AmbientLightConfig UI", i);
  } finally {
    ii();
  }
}
c(Nv, "handleAmbientLightConfigRender");
function $v(e, t) {
  var Ur, pi, Vr, yi, ge;
  const n = (e == null ? void 0 : e.form) instanceof HTMLFormElement ? e.form : t instanceof HTMLFormElement ? t : (Ur = t == null ? void 0 : t.closest) == null ? void 0 : Ur.call(t, "form");
  if (!(n instanceof HTMLFormElement)) return;
  const i = n.querySelector(".window-content");
  if (!(i instanceof HTMLElement)) return;
  const r = Vm(e);
  if (!r) return;
  const o = nw(r);
  D("LightCriteria | Resolved ambient light", {
    sheetId: (r == null ? void 0 : r.id) ?? null,
    persistedId: (o == null ? void 0 : o.id) ?? null,
    sameRef: r === o
  });
  const s = (o == null ? void 0 : o.parent) ?? r.parent ?? null, a = s ? Iy(s) : [], l = a.filter(
    (H) => Array.isArray(H == null ? void 0 : H.values) && H.values.length > 0
  ), u = Wv(a), d = a.map((H) => typeof (H == null ? void 0 : H.id) == "string" ? H.id : null).filter((H) => !!H), f = o ?? r, h = s ? bt(s) : [];
  let m = bm(f);
  const p = sb(m, h);
  JSON.stringify(p) !== JSON.stringify(m) && (m = p, vm(f, p).catch((H) => {
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
  const F = `${(e == null ? void 0 : e.id) ?? (r == null ? void 0 : r.id) ?? "eidolon-light"}-mapping-select`;
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
    te.classList.add("eidolon-light-criteria__filter-name"), te.textContent = (Vr = (pi = H.name) == null ? void 0 : pi.trim) != null && Vr.call(pi) ? H.name.trim() : C("EIDOLON.LightCriteria.UnnamedCategory", "Unnamed Category"), Y.appendChild(te);
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
  const qe = document.createElement("button");
  qe.type = "button", qe.dataset.action = "remove-selected-mapping", qe.classList.add("eidolon-light-criteria__menu-item", "danger"), qe.textContent = C(
    "EIDOLON.LightCriteria.RemoveSelected",
    "Delete selected mapping"
  ), Ke.appendChild(qe), z.appendChild(G);
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
  const Ve = document.createElement("button");
  Ve.type = "button", Ve.dataset.action = "save-mapping", Ve.classList.add("eidolon-light-criteria__button", "primary"), Ve.textContent = C(
    "EIDOLON.LightCriteria.SaveMapping",
    "Save Mapping"
  ), wt.appendChild(Ve);
  const Et = document.createElement("button");
  Et.type = "button", Et.dataset.action = "cancel-create", Et.classList.add("eidolon-light-criteria__button", "secondary"), Et.textContent = C(
    "EIDOLON.LightCriteria.Cancel",
    "Cancel"
  ), wt.appendChild(Et), oe.appendChild(wt), E.appendChild(oe), i.prepend(gn), E.hidden = !0, Pv(e, {
    fieldset: E,
    homeContainer: i
  }), requestAnimationFrame(() => {
    var H;
    (H = e.setPosition) == null || H.call(e, { height: "auto" });
  });
  let V = m;
  wi({ switcher: A, emptyState: $e, state: V }), vi(L, V), Yr(T, {
    state: V,
    hasCategories: l.length > 0
  }), D("LightCriteria | Controls injected", {
    sceneId: (s == null ? void 0 : s.id) ?? null,
    lightId: (r == null ? void 0 : r.id) ?? null,
    hasBase: !!(V != null && V.base),
    mappingCount: Array.isArray(V == null ? void 0 : V.mappings) ? V.mappings.length : 0,
    categories: l.length
  });
  const ns = Qv(V), ee = {
    restoreConfig: null,
    app: e,
    selectedMapping: ns,
    editorMode: "create",
    editingMappingId: null,
    mappingFilters: {}
  };
  Is.set(E, ee);
  const Nt = /* @__PURE__ */ c(() => {
    G.open = !1;
  }, "closeActionsMenu");
  me.addEventListener("click", (H) => {
    G.classList.contains("is-disabled") && (H.preventDefault(), Nt());
  });
  const Ge = /* @__PURE__ */ c((H = ee.selectedMapping) => {
    const Y = zv(j), te = Array.isArray(V == null ? void 0 : V.mappings) ? V.mappings : [], ne = Kv(te, Y, u), re = Object.keys(Y).length;
    ee.mappingFilters = Y, B.disabled = re === 0, Xv(R, {
      totalCount: te.length,
      visibleCount: ne.length,
      hasFilters: re > 0,
      activeFilterCount: re
    }), N.classList.toggle("has-active-filters", re > 0), Jv(Z, V, u, H, {
      mappings: ne,
      categoryOrder: d
    }), ee.selectedMapping = Z.value ?? "", Dl({
      mappingSelect: Z,
      applyMappingButton: U,
      updateMappingButton: ce,
      editCriteriaButton: Se,
      removeMappingButton: qe,
      actionsMenu: G,
      state: V
    }), G.classList.contains("is-disabled") && Nt();
  }, "refreshMappingSelector");
  j.querySelectorAll("select[data-filter-category-id]").forEach((H) => {
    H.addEventListener("change", () => {
      const Y = ee.selectedMapping;
      Ge(Y), ee.selectedMapping !== Y && Pl(
        o ?? r,
        V,
        ee.selectedMapping
      ).then((te) => {
        te && (V = te);
      });
    });
  }), B.addEventListener("click", () => {
    Yv(j);
    const H = ee.selectedMapping;
    Ge(H), N.open = !1, ee.selectedMapping !== H && Pl(
      o ?? r,
      V,
      ee.selectedMapping
    ).then((Y) => {
      Y && (V = Y);
    });
  }), Z.addEventListener("change", () => {
    ee.selectedMapping = Z.value ?? "", Dl({
      mappingSelect: Z,
      applyMappingButton: U,
      updateMappingButton: ce,
      editCriteriaButton: Se,
      removeMappingButton: qe,
      actionsMenu: G,
      state: V
    }), Pl(
      o ?? r,
      V,
      ee.selectedMapping
    ).then((H) => {
      H && (V = H);
    });
  });
  const Br = /* @__PURE__ */ c(async () => {
    var ne, re, pe, be, St, _n, Ct, Nn, Te, $n, Fn, tn, bi, Gr;
    const H = Z.value ?? "";
    if (!H) {
      (re = (ne = ui.notifications) == null ? void 0 : ne.warn) == null || re.call(
        ne,
        C(
          "EIDOLON.LightCriteria.SelectMappingWarning",
          "Choose a criteria mapping before applying."
        )
      ), Ge(ee.selectedMapping);
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
      ds(E, oe, T), Os(e, n, V.base), await hf(o ?? r, V.base), V = await ao(o ?? r, {
        mappingId: Le,
        categories: null,
        updatedAt: Date.now()
      }), ee.selectedMapping = Le, Ge(ee.selectedMapping), vi(L, V), wi({ switcher: A, emptyState: $e, state: V }), Yr(T, {
        state: V,
        hasCategories: l.length > 0
      }), mf(n, {
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
      ), ee.selectedMapping = "", Ge(ee.selectedMapping);
      return;
    }
    ds(E, oe, T), Os(e, n, Y.config), await hf(o ?? r, Y.config), V = await ao(o ?? r, {
      mappingId: Y.id,
      categories: Y.categories,
      updatedAt: Date.now()
    }), ee.selectedMapping = Y.id, Ge(ee.selectedMapping), vi(L, V), wi({ switcher: A, emptyState: $e, state: V }), Yr(T, {
      state: V,
      hasCategories: l.length > 0
    }), mf(n, {
      mappingId: Y.id,
      color: ((tn = (Fn = Y.config) == null ? void 0 : Fn.config) == null ? void 0 : tn.color) ?? null
    });
    const te = vr(Y, u, d);
    (Gr = (bi = ui.notifications) == null ? void 0 : bi.info) == null || Gr.call(
      bi,
      C(
        "EIDOLON.LightCriteria.MappingApplied",
        "Applied mapping: {label}"
      ).replace("{label}", te)
    ), Nt();
  }, "applySelectedMapping");
  U.addEventListener("click", () => {
    Br();
  }), Z.addEventListener("keydown", (H) => {
    H.key === "Enter" && (H.preventDefault(), Br());
  });
  const is = /* @__PURE__ */ c(async () => {
    var Y, te, ne, re, pe, be, St, _n, Ct, Nn, Te, $n, Fn, tn, bi, Gr, er, rs, Dd, os, Pd;
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
      const lt = ks(e, o);
      if (H === Le)
        V = await nf(o ?? r, lt), D("LightCriteria | Base lighting updated", {
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
        const tr = lo(V, H);
        if (!tr) {
          (_n = (St = ui.notifications) == null ? void 0 : St.warn) == null || _n.call(
            St,
            C(
              "EIDOLON.LightCriteria.MappingUnavailable",
              "The selected criteria mapping is no longer available."
            )
          ), ee.selectedMapping = "", Ge(ee.selectedMapping);
          return;
        }
        V = await rf(
          o ?? r,
          tr.categories,
          lt,
          { label: tr.label ?? null }
        ), D("LightCriteria | Mapping updated", {
          mappingId: H,
          hasColor: !!((Ct = lt == null ? void 0 : lt.config) != null && Ct.color),
          stored: Array.isArray(V == null ? void 0 : V.mappings) ? ((Nn = V.mappings.find((Cl) => (Cl == null ? void 0 : Cl.id) === H)) == null ? void 0 : Nn.config) ?? null : null,
          persisted: ($n = (Te = o ?? r) == null ? void 0 : Te.getFlag) == null ? void 0 : $n.call(Te, oo, so)
        });
        const Wr = lo(V, H), Rp = vr(Wr || tr, u, d);
        D("LightCriteria | Mapping updated", {
          mappingId: H,
          categories: tr.categories,
          updatedColor: ((Fn = lt == null ? void 0 : lt.config) == null ? void 0 : Fn.color) ?? null,
          storedColor: ((bi = (tn = Wr == null ? void 0 : Wr.config) == null ? void 0 : tn.config) == null ? void 0 : bi.color) ?? ((er = (Gr = tr.config) == null ? void 0 : Gr.config) == null ? void 0 : er.color) ?? null
        }), (Dd = (rs = ui.notifications) == null ? void 0 : rs.info) == null || Dd.call(
          rs,
          C(
            "EIDOLON.LightCriteria.MappingUpdated",
            "Saved changes to mapping: {label}"
          ).replace("{label}", Rp)
        ), ee.selectedMapping = H;
      }
      vi(L, V), wi({ switcher: A, emptyState: $e, state: V }), Yr(T, {
        state: V,
        hasCategories: l.length > 0
      }), Ge(ee.selectedMapping), Nt();
    } catch (lt) {
      console.error("eidolon-utilities | Failed to update light criteria mapping", lt), (Pd = (os = ui.notifications) == null ? void 0 : os.error) == null || Pd.call(
        os,
        C(
          "EIDOLON.LightCriteria.MappingUpdateError",
          "Failed to save the mapping. Check the console for details."
        )
      );
    } finally {
      ce.disabled = !1, Dl({
        mappingSelect: Z,
        applyMappingButton: U,
        updateMappingButton: ce,
        editCriteriaButton: Se,
        removeMappingButton: qe,
        actionsMenu: G,
        state: V
      });
    }
  }, "updateSelectedMapping");
  ce.addEventListener("click", () => {
    is();
  }), Ge(ee.selectedMapping), S.addEventListener("click", async () => {
    var H, Y, te, ne, re, pe;
    S.disabled = !0;
    try {
      const be = ks(e, o);
      V = await nf(o ?? r, be), D("LightCriteria | Base lighting stored", {
        lightId: ((H = o ?? r) == null ? void 0 : H.id) ?? null,
        configColor: ((Y = be == null ? void 0 : be.config) == null ? void 0 : Y.color) ?? null
      }), (ne = (te = ui.notifications) == null ? void 0 : te.info) == null || ne.call(
        te,
        C(
          "EIDOLON.LightCriteria.BaseStored",
          "Saved the current configuration as the base lighting state."
        )
      ), vi(L, V), wi({ switcher: A, emptyState: $e, state: V }), Yr(T, {
        state: V,
        hasCategories: l.length > 0
      }), ee.selectedMapping = Le, Ge(ee.selectedMapping);
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
    const H = Is.get(E);
    ff({
      app: e,
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
    const Y = lo(V, H);
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
    Nt(), Bm(e, { fieldset: E, homeContainer: i }), ff({
      app: e,
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
  }), Ve.addEventListener("click", async () => {
    var Y, te, ne, re, pe, be, St, _n, Ct, Nn;
    const H = tw(Xe);
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
    Ve.disabled = !0;
    try {
      const Te = ks(e, o);
      if (ee.editorMode === "retarget" && ee.editingMappingId) {
        const Fn = Xc(V, H);
        let tn = !1;
        if (Fn && Fn !== ee.editingMappingId && (tn = await Fv(), !tn)) {
          Ve.disabled = !1;
          return;
        }
        V = await ib(
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
        V = await rf(
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
      const $n = Xc(V, H);
      $n && (ee.selectedMapping = $n), Ge(ee.selectedMapping), ds(E, oe, T), Nt();
    } catch (Te) {
      console.error("eidolon-utilities | Failed to persist light criteria mapping", Te), (Nn = (Ct = ui.notifications) == null ? void 0 : Ct.error) == null || Nn.call(
        Ct,
        C(
          "EIDOLON.LightCriteria.MappingError",
          "Failed to save the mapping. Check the console for details."
        )
      );
    } finally {
      Ve.disabled = !1;
    }
  }), Et.addEventListener("click", () => {
    const H = Is.get(E);
    H != null && H.restoreConfig && Os(e, n, H.restoreConfig), ds(E, oe, T);
  }), qe.addEventListener("click", async () => {
    var te, ne;
    const H = ee.selectedMapping;
    !H || H === Le || !await Dv() || (V = await rb(o ?? r, H), ee.selectedMapping = "", vi(L, V), wi({ switcher: A, emptyState: $e, state: V }), Ge(ee.selectedMapping), Nt(), (ne = (te = ui.notifications) == null ? void 0 : te.info) == null || ne.call(
      te,
      C("EIDOLON.LightCriteria.MappingRemoved", "Removed selected mapping.")
    ));
  });
}
c($v, "enhanceAmbientLightConfig");
function ff({
  app: e,
  fieldset: t,
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
  a && (a.restoreConfig = ks(e, s), a.editorMode = l, a.editingMappingId = l === "retarget" ? (u == null ? void 0 : u.id) ?? null : null), d && Os(e, o, d), l === "retarget" && (u != null && u.categories) ? ew(r, u.categories) : Zv(r);
  const f = i.querySelector("p.notes");
  f instanceof HTMLElement && (f.textContent = l === "retarget" ? C(
    "EIDOLON.LightCriteria.EditCriteriaDescription",
    "Adjust criteria values for the selected mapping."
  ) : C(
    "EIDOLON.LightCriteria.CreateDescription",
    "Assign scene criteria values to map the current configuration."
  ));
  const h = i.querySelector('button[data-action="save-mapping"]');
  h instanceof HTMLButtonElement && (h.textContent = l === "retarget" ? C("EIDOLON.LightCriteria.SaveCriteriaChanges", "Save Criteria Changes") : C("EIDOLON.LightCriteria.SaveMapping", "Save Mapping")), i.hidden = !1, n.setAttribute("aria-expanded", "true"), nd(t, i), requestAnimationFrame(() => {
    var m;
    (m = e.setPosition) == null || m.call(e, { height: "auto" });
  });
}
c(ff, "openMappingEditor");
async function Fv() {
  var n, i;
  const e = (i = (n = foundry == null ? void 0 : foundry.applications) == null ? void 0 : n.api) == null ? void 0 : i.DialogV2;
  if (typeof (e == null ? void 0 : e.confirm) == "function")
    return e.confirm({
      window: { title: C("EIDOLON.LightCriteria.ConflictTitle", "Replace Existing Mapping?") },
      content: `<p>${C(
        "EIDOLON.LightCriteria.ConflictBody",
        "A mapping already exists for this criteria combination. Replace it with the edited mapping?"
      )}</p>`,
      rejectClose: !1
    });
  const t = globalThis.Dialog;
  return typeof (t == null ? void 0 : t.confirm) != "function" ? !1 : t.confirm({
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
c(Fv, "confirmCriteriaConflict");
async function Dv() {
  var n, i;
  const e = (i = (n = foundry == null ? void 0 : foundry.applications) == null ? void 0 : n.api) == null ? void 0 : i.DialogV2;
  if (typeof (e == null ? void 0 : e.confirm) == "function")
    return e.confirm({
      window: { title: C("EIDOLON.LightCriteria.RemoveTitle", "Remove Mapping?") },
      content: `<p>${C(
        "EIDOLON.LightCriteria.RemoveBody",
        "Remove the currently selected mapping? This cannot be undone."
      )}</p>`,
      rejectClose: !1
    });
  const t = globalThis.Dialog;
  return typeof (t == null ? void 0 : t.confirm) != "function" ? !1 : t.confirm({
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
c(Dv, "confirmRemoveMapping");
function Pv(e, { fieldset: t, homeContainer: n }) {
  const i = qv(e, n);
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
    s.preventDefault(), Bm(e, { fieldset: t, homeContainer: n });
  };
}
c(Pv, "ensureManagerHeaderButton");
function Bm(e, { fieldset: t, homeContainer: n }) {
  var h, m, p;
  const i = us.get(e);
  if (i != null && i.rendered) {
    (h = i.bringToTop) == null || h.call(i);
    return;
  }
  const r = /* @__PURE__ */ c((...y) => {
    var b;
    const E = Rv(y), v = (b = E == null ? void 0 : E.querySelector) == null ? void 0 : b.call(E, ".eidolon-light-criteria-manager-host");
    v instanceof HTMLElement && (Hv(t), t.hidden = !1, v.appendChild(t));
  }, "onRender"), o = /* @__PURE__ */ c(() => {
    t.remove(), t.hidden = !0, us.delete(e), requestAnimationFrame(() => {
      var y;
      (y = e.setPosition) == null || y.call(e, { height: "auto" });
    });
  }, "onClose"), s = C("EIDOLON.LightCriteria.ManagerTitle", "Scene Criteria Lighting"), a = '<div class="eidolon-light-criteria-manager-host"></div>', l = C("EIDOLON.LightCriteria.Close", "Close"), u = (p = (m = foundry == null ? void 0 : foundry.applications) == null ? void 0 : m.api) == null ? void 0 : p.DialogV2;
  if (typeof (u == null ? void 0 : u.wait) == "function")
    try {
      let y = !1;
      const E = /* @__PURE__ */ c(() => {
        y || (y = !0, o());
      }, "closeOnce");
      us.set(e, {
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
  us.set(e, f), f.render(!0);
}
c(Bm, "openManagerDialog");
function Rv(e) {
  for (const t of e) {
    const n = He(t);
    if (n) return n;
    const i = He(t == null ? void 0 : t.element);
    if (i) return i;
  }
  return null;
}
c(Rv, "findDialogRoot");
function Hv(e) {
  if (!(e instanceof HTMLElement) || e.dataset.managerLayout === "true") return;
  e.dataset.managerLayout = "true", e.classList.add("is-manager");
  const t = e.querySelector("legend"), n = e.querySelector("p.notes:not(.eidolon-light-criteria__status)"), i = e.querySelector(".eidolon-light-criteria__controls"), r = e.querySelector(".eidolon-light-criteria__status"), o = e.querySelector(".eidolon-light-criteria__creation"), s = Array.from(e.querySelectorAll(".eidolon-light-criteria__warning")), a = document.createElement("div");
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
  f.classList.add("eidolon-light-criteria-manager__header"), f.textContent = C("EIDOLON.LightCriteria.ManagerAuthoring", "Create or Update Mapping"), u.appendChild(f), o && u.appendChild(o), e.innerHTML = "", t && e.appendChild(t), n && e.appendChild(n), e.appendChild(a), nd(e, o);
}
c(Hv, "applyManagerLayout");
function qv(e, t) {
  var i;
  const n = He(e == null ? void 0 : e.element);
  return n || (((i = t == null ? void 0 : t.closest) == null ? void 0 : i.call(t, ".application")) ?? null);
}
c(qv, "resolveApplicationRoot");
function ds(e, t, n) {
  const i = Is.get(e);
  i && (i.restoreConfig = null, i.editorMode = "create", i.editingMappingId = null), t.hidden = !0, n.setAttribute("aria-expanded", "false");
  const r = t.querySelector("p.notes");
  r instanceof HTMLElement && (r.textContent = C(
    "EIDOLON.LightCriteria.CreateDescription",
    "Assign scene criteria values to map the current configuration."
  ));
  const o = t.querySelector('button[data-action="save-mapping"]');
  o instanceof HTMLButtonElement && (o.textContent = C("EIDOLON.LightCriteria.SaveMapping", "Save Mapping")), nd(e, t), requestAnimationFrame(() => {
    var s, a;
    (a = (s = i == null ? void 0 : i.app) == null ? void 0 : s.setPosition) == null || a.call(s, { height: "auto" });
  });
}
c(ds, "hideCreationSection");
function vi(e, t) {
  if (!e) return;
  const n = !!(t != null && t.base), i = Array.isArray(t == null ? void 0 : t.mappings) ? t.mappings.length : 0, r = [];
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
  ), e.textContent = r.join(" ");
}
c(vi, "updateStatusLine");
function Yr(e, { state: t, hasCategories: n }) {
  if (!e) return;
  const i = !!(t != null && t.base), r = i && n;
  e.disabled = !r, e.title = r ? "" : i ? C(
    "EIDOLON.LightCriteria.CreateDisabledNoCategories",
    "Add scene criteria with values before creating mappings."
  ) : C(
    "EIDOLON.LightCriteria.CreateDisabledNoBase",
    "Save a base lighting state before creating criteria mappings."
  );
}
c(Yr, "updateCreateButtonState");
function ks(e, t) {
  var l, u, d;
  const n = t ?? Vm(e);
  if (!n)
    throw new Error("Ambient light document unavailable.");
  const i = Ki(((l = n.toObject) == null ? void 0 : l.call(n)) ?? {});
  if (!i)
    throw new Error("Unable to duplicate ambient light data.");
  const r = (e == null ? void 0 : e.form) instanceof HTMLFormElement ? e.form : (e == null ? void 0 : e.element) instanceof HTMLFormElement ? e.element : null, o = r ? fy(r) : {}, s = foundry.utils.mergeObject(i, o, {
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
  }), r.querySelectorAll("input[name], select[name], textarea[name]").forEach((f) => {
    const h = f.parentElement;
    if ((h == null ? void 0 : h.tagName) === "COLOR-PICKER" || (h == null ? void 0 : h.tagName) === "RANGE-PICKER") return;
    const m = f.getAttribute("name");
    if (m)
      if (f instanceof HTMLInputElement)
        if (f.type === "checkbox")
          foundry.utils.setProperty(s, m, f.checked);
        else if (f.type === "number" || f.type === "range") {
          const p = Number(f.value);
          Number.isFinite(p) && foundry.utils.setProperty(s, m, p);
        } else
          foundry.utils.setProperty(s, m, f.value);
      else (f instanceof HTMLSelectElement || f instanceof HTMLTextAreaElement) && foundry.utils.setProperty(s, m, f.value);
  }));
  const a = Ki(s);
  return D("LightCriteria | Captured form config", {
    lightId: (n == null ? void 0 : n.id) ?? null,
    hasColor: !!((u = a == null ? void 0 : a.config) != null && u.color),
    color: ((d = a == null ? void 0 : a.config) == null ? void 0 : d.color) ?? null
  }), a;
}
c(ks, "captureAmbientLightFormConfig");
async function hf(e, t) {
  if (!(e != null && e.update) || !t || typeof t != "object") return;
  const n = {};
  "hidden" in t && e.hidden !== t.hidden && (n.hidden = t.hidden), Object.keys(n).length > 0 && (D("LightCriteria | Applying formless properties directly", n), await e.update(n));
}
c(hf, "applyFormlessProperties");
function Os(e, t, n) {
  if (!n || typeof n != "object") return;
  const i = foundry.utils.flattenObject(n, { safe: !0 });
  for (const [r, o] of Object.entries(i)) {
    const s = t.querySelectorAll(`[name="${r}"]`);
    if (s.length) {
      D("LightCriteria | Applying field", {
        path: r,
        value: o,
        elementCount: s.length
      });
      for (const a of s)
        a instanceof HTMLElement && a.tagName === "COLOR-PICKER" ? Bv(a, o) : a instanceof HTMLElement && a.tagName === "RANGE-PICKER" ? Uv(a, o) : a instanceof HTMLInputElement ? jv(a, o) : a instanceof HTMLSelectElement ? Vv(a, o) : a instanceof HTMLTextAreaElement && Gv(a, o);
    }
  }
  requestAnimationFrame(() => {
    var r;
    return (r = e._previewChanges) == null ? void 0 : r.call(e);
  });
}
c(Os, "applyConfigToForm");
function jv(e, t, n) {
  const i = e.type;
  if (i === "checkbox") {
    const s = !!t;
    e.checked !== s && (e.checked = s, Jt(e));
    return;
  }
  if (i === "radio") {
    const s = t == null ? "" : String(t), a = e.value === s;
    e.checked !== a && (e.checked = a, a && Jt(e));
    return;
  }
  const r = t == null ? "" : String(t);
  let o = !1;
  e.value !== r && (e.value = r, o = !0), o && Jt(e);
}
c(jv, "applyValueToInput");
function Bv(e, t, n) {
  var a, l, u, d, f, h;
  const i = t == null ? "" : String(t);
  let r = !1;
  e.value !== i && (e.value = i, e.setAttribute("value", i), (a = e.ui) != null && a.setValue && e.ui.setValue(i), r = !0);
  const o = ((l = e.ui) == null ? void 0 : l.input) ?? ((u = e.querySelector) == null ? void 0 : u.call(e, 'input[type="color"]'));
  o instanceof HTMLInputElement && o.value !== i && (o.value = i, Jt(o));
  const s = ((d = e.ui) == null ? void 0 : d.text) ?? ((f = e.querySelector) == null ? void 0 : f.call(e, 'input[type="text"]'));
  s instanceof HTMLInputElement && s.value !== i && (s.value = i, Jt(s)), (h = e.ui) != null && h.commit ? e.ui.commit() : (e.dispatchEvent(new Event("input", { bubbles: !0, cancelable: !0 })), e.dispatchEvent(new Event("change", { bubbles: !0, cancelable: !0 }))), D("LightCriteria | Color picker applied", {
    value: i,
    pickerValue: e.value ?? null,
    swatchValue: (o == null ? void 0 : o.value) ?? null,
    textValue: (s == null ? void 0 : s.value) ?? null
  }), r && Jt(e);
}
c(Bv, "applyValueToColorPicker");
function Uv(e, t, n) {
  var u, d;
  const i = t == null ? "" : String(t), r = Number(i), o = Number.isFinite(r) ? r : i;
  let s = !1;
  e.value !== void 0 && e.value !== o && (e.value = o, s = !0), e.getAttribute("value") !== i && (e.setAttribute("value", i), s = !0);
  const a = (u = e.querySelector) == null ? void 0 : u.call(e, 'input[type="range"]');
  a instanceof HTMLInputElement && a.value !== i && (a.value = i, Jt(a));
  const l = (d = e.querySelector) == null ? void 0 : d.call(e, 'input[type="number"]');
  if (l instanceof HTMLInputElement && l.value !== i && (l.value = i, Jt(l)), typeof e.commit == "function")
    try {
      e.commit();
    } catch (f) {
      console.error("eidolon-utilities | range-picker commit failed", f);
    }
  D("LightCriteria | Range picker applied", {
    value: i,
    resolvedValue: o,
    rangeValue: (a == null ? void 0 : a.value) ?? null,
    numberValue: (l == null ? void 0 : l.value) ?? null
  }), s && Jt(e);
}
c(Uv, "applyValueToRangePicker");
function Vv(e, t, n) {
  const i = t == null ? "" : String(t);
  e.value !== i && (e.value = i, Jt(e));
}
c(Vv, "applyValueToSelect");
function Gv(e, t, n) {
  const i = t == null ? "" : String(t);
  e.value !== i && (e.value = i, Jt(e));
}
c(Gv, "applyValueToTextarea");
function Jt(e) {
  e.dispatchEvent(new Event("input", { bubbles: !0, cancelable: !0 })), e.dispatchEvent(new Event("change", { bubbles: !0, cancelable: !0 }));
}
c(Jt, "triggerInputChange");
function Dl({
  mappingSelect: e,
  applyMappingButton: t,
  updateMappingButton: n,
  editCriteriaButton: i,
  removeMappingButton: r,
  actionsMenu: o,
  state: s
}) {
  const a = (e == null ? void 0 : e.value) ?? "", l = !!(s != null && s.base), u = a && a !== Le ? !!lo(s, a) : !1;
  if (t instanceof HTMLButtonElement && (a ? a === Le ? t.disabled = !l : t.disabled = !u : t.disabled = !0), n instanceof HTMLButtonElement && (a ? a === Le ? n.disabled = !1 : n.disabled = !u : n.disabled = !0), i instanceof HTMLButtonElement && (i.disabled = !a || a === Le || !u), r instanceof HTMLButtonElement && (r.disabled = !a || a === Le || !u), o instanceof HTMLElement) {
    const d = n instanceof HTMLButtonElement && !n.disabled || i instanceof HTMLButtonElement && !i.disabled || r instanceof HTMLButtonElement && !r.disabled;
    o.classList.toggle("is-disabled", !d), !d && "open" in o && (o.open = !1);
  }
}
c(Dl, "syncMappingSwitcherState");
function Wv(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e) {
    if (!n) continue;
    const i = typeof n.id == "string" ? n.id : null;
    if (!i) continue;
    const r = typeof n.name == "string" && n.name.trim() ? n.name.trim() : C("EIDOLON.LightCriteria.UnnamedCategory", "Unnamed Category");
    t.has(i) || t.set(i, r);
  }
  return t;
}
c(Wv, "buildCategoryNameLookup");
function zv(e) {
  const t = {};
  return e instanceof HTMLElement && e.querySelectorAll("select[data-filter-category-id]").forEach((n) => {
    var o, s;
    const i = n.dataset.filterCategoryId, r = (s = (o = n.value) == null ? void 0 : o.trim) == null ? void 0 : s.call(o);
    !i || !r || (t[i] = r);
  }), t;
}
c(zv, "readMappingFilterSelections");
function Yv(e) {
  e instanceof HTMLElement && e.querySelectorAll("select[data-filter-category-id]").forEach((t) => {
    t.value = "";
  });
}
c(Yv, "resetMappingFilterSelections");
function Kv(e, t, n) {
  const i = Array.isArray(e) ? e : [], r = Object.entries(t ?? {}).filter(([, o]) => !!o);
  return r.length ? i.filter((o) => {
    if (!o || typeof o != "object") return !1;
    if (n && Um(o, n)) return !0;
    const s = o.categories ?? {};
    for (const [a, l] of r)
      if ((s == null ? void 0 : s[a]) !== l) return !1;
    return !0;
  }) : i.slice();
}
c(Kv, "filterMappingsByCriteria");
function Um(e, t) {
  const n = e == null ? void 0 : e.categories;
  if (!n || typeof n != "object") return !1;
  for (const i of Object.keys(n))
    if (!t.has(i)) return !0;
  return !1;
}
c(Um, "isStaleMappingForScene");
function Xv(e, { totalCount: t = 0, visibleCount: n = 0, hasFilters: i = !1, activeFilterCount: r = 0 } = {}) {
  if (!(e instanceof HTMLElement)) return;
  if (!i) {
    e.textContent = C(
      "EIDOLON.LightCriteria.FilterSummaryAll",
      "All ({count})"
    ).replace("{count}", String(t));
    return;
  }
  const o = C(
    "EIDOLON.LightCriteria.FilterSummaryActive",
    "{active} filters · {visible}/{total}"
  ).replace("{active}", String(r)).replace("{visible}", String(n)).replace("{total}", String(t));
  e.textContent = o;
}
c(Xv, "updateMappingFilterMeta");
function Jv(e, t, n, i, r = {}) {
  if (!(e instanceof HTMLSelectElement)) return;
  const o = typeof i == "string" ? i : "", s = !!(t != null && t.base), a = Array.isArray(r == null ? void 0 : r.categoryOrder) ? r.categoryOrder : [], l = Array.isArray(r == null ? void 0 : r.mappings) ? r.mappings.slice() : Array.isArray(t == null ? void 0 : t.mappings) ? t.mappings.slice() : [], u = e.value;
  e.innerHTML = "";
  const d = document.createElement("option");
  d.value = "", d.textContent = C(
    "EIDOLON.LightCriteria.SelectPlaceholder",
    "Select a mapping"
  ), d.disabled = s, e.appendChild(d);
  const f = document.createElement("option");
  f.value = Le, f.textContent = C(
    "EIDOLON.LightCriteria.BaseOption",
    "Base Lighting"
  ), f.disabled = !s, e.appendChild(f), l.slice().sort((y, E) => {
    var w;
    const v = vr(y, n, a), b = vr(E, n, a);
    return v.localeCompare(b, ((w = game.i18n) == null ? void 0 : w.lang) ?? void 0, {
      sensitivity: "base"
    });
  }).forEach((y) => {
    if (!(y != null && y.id)) return;
    const E = document.createElement("option");
    E.value = y.id;
    const v = vr(y, n, a);
    Um(y, n) ? (E.textContent = `⚠ ${v}`, E.style.fontStyle = "italic", E.dataset.stale = "true") : E.textContent = v, e.appendChild(E);
  });
  const h = new Set(
    Array.from(e.options).filter((y) => !y.disabled).map((y) => y.value)
  ), m = s && u === "" ? "" : u, p = o || (h.has(m) ? m : "");
  p && h.has(p) ? e.value = p : s ? e.value = Le : e.value = "";
}
c(Jv, "populateMappingSelector");
function vr(e, t, n = []) {
  if (!e || typeof e != "object")
    return C("EIDOLON.LightCriteria.UnnamedMapping", "Unnamed Mapping");
  if (typeof e.label == "string" && e.label.trim())
    return e.label.trim();
  const i = e.categories ?? {}, r = [], o = /* @__PURE__ */ new Set();
  for (const a of n)
    !a || o.has(a) || (r.push(a), o.add(a));
  for (const a of Object.keys(i).sort((l, u) => l.localeCompare(u)))
    o.has(a) || (r.push(a), o.add(a));
  const s = r.map((a) => {
    const l = i == null ? void 0 : i[a];
    if (typeof l != "string" || !l.trim()) return null;
    const u = l.trim();
    return `${t.get(a) ?? C("EIDOLON.LightCriteria.UnnamedCategory", "Unnamed Category")}=${u}`;
  }).filter(Boolean);
  return s.length === 0 ? C("EIDOLON.LightCriteria.UnnamedMapping", "Unnamed Mapping") : s.join(" | ");
}
c(vr, "formatMappingOptionLabel");
function Xc(e, t) {
  if (!e || typeof e != "object" || !Array.isArray(e.mappings)) return null;
  const n = qr(t);
  if (!n) return null;
  const i = e.mappings.find((r) => (r == null ? void 0 : r.key) === n);
  return (i == null ? void 0 : i.id) ?? null;
}
c(Xc, "findMappingIdByCategories");
function lo(e, t) {
  return !t || !e || typeof e != "object" || !Array.isArray(e.mappings) ? null : e.mappings.find((n) => (n == null ? void 0 : n.id) === t) ?? null;
}
c(lo, "getMappingById");
function Qv(e) {
  if (!e || typeof e != "object") return "";
  const t = e.current;
  if (t != null && t.mappingId) {
    if (t.mappingId === Le)
      return e != null && e.base ? Le : "";
    if (Array.isArray(e.mappings) && e.mappings.some((n) => n.id === t.mappingId))
      return t.mappingId;
  }
  if (t != null && t.categories) {
    const n = Xc(e, t.categories);
    if (n) return n;
  }
  return "";
}
c(Qv, "resolveInitialMappingSelection");
function mf(e, t = {}) {
  var s, a, l, u;
  if (!(e instanceof HTMLFormElement)) return;
  const n = e.querySelector('color-picker[name="config.color"]'), i = (n == null ? void 0 : n.value) ?? null, r = ((s = n == null ? void 0 : n.ui) == null ? void 0 : s.text) ?? ((a = n == null ? void 0 : n.querySelector) == null ? void 0 : a.call(n, 'input[type="text"]')), o = ((l = n == null ? void 0 : n.ui) == null ? void 0 : l.input) ?? ((u = n == null ? void 0 : n.querySelector) == null ? void 0 : u.call(n, 'input[type="color"]'));
  D("LightCriteria | Color state after apply", {
    ...t,
    textValue: (r == null ? void 0 : r.value) ?? null,
    pickerValue: i,
    swatchValue: (o == null ? void 0 : o.value) ?? null
  });
}
c(mf, "logAppliedColorState");
function Zv(e) {
  e.querySelectorAll("select[data-category-id]").forEach((t) => {
    t.value = "";
  });
}
c(Zv, "resetCategorySelections");
function ew(e, t) {
  const n = t && typeof t == "object" ? t : {};
  e.querySelectorAll("select[data-category-id]").forEach((i) => {
    const r = i.dataset.categoryId;
    if (!r) return;
    const o = n[r];
    i.value = typeof o == "string" ? o : "";
  });
}
c(ew, "setCategorySelections");
function tw(e) {
  const t = {};
  return e.querySelectorAll("select[data-category-id]").forEach((n) => {
    var o, s;
    const i = n.dataset.categoryId, r = (s = (o = n.value) == null ? void 0 : o.trim) == null ? void 0 : s.call(o);
    !i || !r || (t[i] = r);
  }), Object.keys(t).length > 0 ? t : null;
}
c(tw, "readCategorySelections");
async function Pl(e, t, n) {
  if (!e) return null;
  try {
    if (!n)
      return await ao(e, {});
    if (n === Le)
      return await ao(e, {
        mappingId: Le,
        categories: null,
        updatedAt: Date.now()
      });
    const i = lo(t, n);
    return i ? await ao(e, {
      mappingId: i.id,
      categories: i.categories,
      updatedAt: Date.now()
    }) : null;
  } catch (i) {
    return console.warn("eidolon-utilities | Failed to persist mapping selection", i), null;
  }
}
c(Pl, "persistCurrentSelection");
function nd(e, t) {
  if (!(e instanceof HTMLElement)) return;
  const n = e.querySelector(".eidolon-light-criteria-manager__section.is-bottom");
  n instanceof HTMLElement && (n.hidden = !!(t != null && t.hidden));
}
c(nd, "updateManagerSectionVisibility");
function wi({ switcher: e, emptyState: t, state: n }) {
  const i = !!(n != null && n.base);
  e instanceof HTMLElement && (e.hidden = !i), t instanceof HTMLElement && (t.hidden = i);
}
c(wi, "updateActiveMappingVisibility");
function Vm(e) {
  const t = (e == null ? void 0 : e.object) ?? (e == null ? void 0 : e.document) ?? null;
  return !(t != null && t.isEmbedded) || t.documentName !== "AmbientLight" ? null : t;
}
c(Vm, "getAmbientLightDocument");
function nw(e) {
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
c(nw, "getPersistedAmbientLightDocument");
function iw() {
  _v();
}
c(iw, "registerLightCriteriaHooks");
iw();
const Jc = /* @__PURE__ */ new Map();
let Qc = !1;
function id(e, t) {
  Jc.has(e) && console.warn(`[${k}] Socket handler for type "${e}" already registered, overwriting.`), Jc.set(e, t);
}
c(id, "registerSocketHandler");
function As(e, t) {
  if (!Qc) {
    console.error(`[${k}] Socket not initialized. Call initializeSocket() first.`);
    return;
  }
  game.socket.emit(`module.${k}`, { type: e, payload: t });
}
c(As, "emitSocket");
function rw() {
  Qc || (game.socket.on(`module.${k}`, (e) => {
    const { type: t, payload: n } = e ?? {}, i = Jc.get(t);
    i ? i(n) : console.warn(`[${k}] No socket handler for type "${t}"`);
  }), Qc = !0, console.log(`[${k}] Socket initialized on channel module.${k}`));
}
c(rw, "initializeSocket");
const Gm = "tween", Wm = "tween-sequence", Zc = "tween-sequence-cancel", De = Object.freeze({
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
}), Qs = /* @__PURE__ */ new Map();
function en({ type: e, execute: t, validate: n }) {
  Qs.has(e) && console.warn(`[tween-registry] Type "${e}" already registered, overwriting.`), Qs.set(e, { type: e, execute: t, validate: n ?? (() => {
  }) });
}
c(en, "registerTweenType");
function jr(e) {
  return Qs.get(e);
}
c(jr, "getTweenType");
function ow(e, t = {}) {
  const n = jr(e);
  if (!n)
    throw new Error(`Unknown tween type: "${e}".`);
  return n.validate(t ?? {}), n;
}
c(ow, "validateTweenEntry");
function eu() {
  return [...Qs.keys()];
}
c(eu, "listTweenTypes");
const wr = {
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
  easeInBounce: /* @__PURE__ */ c((e) => 1 - wr.easeOutBounce(1 - e), "easeInBounce"),
  easeInOutBounce: /* @__PURE__ */ c((e) => e < 0.5 ? (1 - wr.easeOutBounce(1 - 2 * e)) / 2 : (1 + wr.easeOutBounce(2 * e - 1)) / 2, "easeInOutBounce"),
  easeInElastic: /* @__PURE__ */ c((e) => e === 0 || e === 1 ? e : -Math.pow(2, 10 * (e - 1)) * Math.sin((e - 1.1) * 5 * Math.PI), "easeInElastic"),
  easeOutElastic: /* @__PURE__ */ c((e) => e === 0 || e === 1 ? e : Math.pow(2, -10 * e) * Math.sin((e - 0.1) * 5 * Math.PI) + 1, "easeOutElastic")
};
function vt(e) {
  if (e && wr[e])
    return wr[e];
  const t = foundry.canvas.animation.CanvasAnimation;
  return {
    linear: t.easeLinear,
    easeInOutCosine: t.easeInOutCosine
  }[e] ?? t.easeInOutCosine;
}
c(vt, "resolveEasing");
function rd() {
  return ["linear", "easeInOutCosine", ...Object.keys(wr)];
}
c(rd, "listEasingNames");
function Zs(e) {
  return e <= 0.04045 ? e / 12.92 : ((e + 0.055) / 1.055) ** 2.4;
}
c(Zs, "srgbToLinear");
function Er(e) {
  return e <= 31308e-7 ? 12.92 * e : 1.055 * e ** (1 / 2.4) - 0.055;
}
c(Er, "linearToSrgb");
function gf(e, t, n) {
  const i = 0.4122214708 * e + 0.5363325363 * t + 0.0514459929 * n, r = 0.2119034982 * e + 0.6806995451 * t + 0.1073969566 * n, o = 0.0883024619 * e + 0.2817188376 * t + 0.6299787005 * n, s = Math.cbrt(i), a = Math.cbrt(r), l = Math.cbrt(o);
  return [
    0.2104542553 * s + 0.793617785 * a - 0.0040720468 * l,
    1.9779984951 * s - 2.428592205 * a + 0.4505937099 * l,
    0.0259040371 * s + 0.7827717662 * a - 0.808675766 * l
  ];
}
c(gf, "linearRgbToOklab");
function sw(e, t, n) {
  const i = (e + 0.3963377774 * t + 0.2158037573 * n) ** 3, r = (e - 0.1055613458 * t - 0.0638541728 * n) ** 3, o = (e - 0.0894841775 * t - 1.291485548 * n) ** 3;
  return [
    4.0767416621 * i - 3.3077115913 * r + 0.2309699292 * o,
    -1.2684380046 * i + 2.6097574011 * r - 0.3413193965 * o,
    -0.0041960863 * i - 0.7034186147 * r + 1.707614701 * o
  ];
}
c(sw, "oklabToLinearRgb");
function ea(e) {
  return [e.r, e.g, e.b];
}
c(ea, "colorToRgb");
function zm(e, t, n) {
  const i = /* @__PURE__ */ c((o) => Math.max(0, Math.min(1, o)), "clamp"), r = /* @__PURE__ */ c((o) => Math.round(i(o) * 255).toString(16).padStart(2, "0"), "toHex");
  return `#${r(e)}${r(t)}${r(n)}`;
}
c(zm, "rgbToHex");
function aw(e, t, n) {
  if (n <= 0) return e.toHTML();
  if (n >= 1) return t.toHTML();
  const i = foundry.utils.Color, [r, o, s] = e.hsl, [a, l, u] = t.hsl, d = (a - r + 0.5) % 1 - 0.5, f = (r + d * n + 1) % 1, h = o + (l - o) * n, m = s + (u - s) * n;
  return i.fromHSL([f, h, m]).toHTML();
}
c(aw, "interpolateHsl");
function lw(e, t, n) {
  if (n <= 0) return e.toHTML();
  if (n >= 1) return t.toHTML();
  const [i, r, o] = ea(e).map(Zs), [s, a, l] = ea(t).map(Zs), u = Er(i + (s - i) * n), d = Er(r + (a - r) * n), f = Er(o + (l - o) * n);
  return zm(u, d, f);
}
c(lw, "interpolateRgb");
function cw(e, t, n) {
  if (n <= 0) return e.toHTML();
  if (n >= 1) return t.toHTML();
  const [i, r, o] = ea(e).map(Zs), [s, a, l] = ea(t).map(Zs), [u, d, f] = gf(i, r, o), [h, m, p] = gf(s, a, l), y = 0.02, E = Math.sqrt(d * d + f * f), v = Math.sqrt(m * m + p * p);
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
  const [T, L, A] = sw(b, w, S);
  return zm(Er(T), Er(L), Er(A));
}
c(cw, "interpolateOklch");
const tu = {
  hsl: aw,
  rgb: lw,
  oklch: cw
};
function od(e = "hsl") {
  return tu[e] ?? tu.hsl;
}
c(od, "getInterpolator");
function _r() {
  return Object.keys(tu);
}
c(_r, "listInterpolationModes");
function uw(e) {
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
  if (e.mode && !_r().includes(e.mode))
    throw new Error(
      `light-color tween: unknown mode "${e.mode}". Available: ${_r().join(", ")}`
    );
}
c(uw, "validate$7");
async function dw(e, t = {}) {
  const { CanvasAnimation: n } = foundry.canvas.animation, { Color: i } = foundry.utils, { uuid: r, toColor: o, toAlpha: s, mode: a = "oklch" } = e, l = Array.isArray(r) ? r : [r];
  if (l.length === 0)
    return console.warn("light-color tween: empty uuid array, nothing to animate."), !0;
  const {
    durationMS: u = 2e3,
    easing: d = "easeInOutCosine",
    commit: f = !0,
    startEpochMS: h = null,
    signal: m = null
  } = t, p = vt(d), y = o != null, E = s != null, v = y ? od(a) : null, b = y ? i.fromString(o) : null;
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
c(dw, "execute$7");
function fw() {
  en({ type: "light-color", execute: dw, validate: uw });
}
c(fw, "registerLightColorTween");
const Pn = /* @__PURE__ */ new WeakMap();
function hw(e) {
  if ((Array.isArray(e.uuid) ? e.uuid : [e.uuid]).some((n) => !n || typeof n != "string"))
    throw new Error("light-state tween: 'uuid' is required (string or array of AmbientLight document UUIDs).");
  if (typeof e.enabled != "boolean")
    throw new Error("light-state tween: 'enabled' (boolean) is required.");
}
c(hw, "validate$6");
async function mw(e, t = {}) {
  const { CanvasAnimation: n } = foundry.canvas.animation, { uuid: i, enabled: r } = e, o = Array.isArray(i) ? i : [i];
  if (o.length === 0)
    return console.warn("light-state tween: empty uuid array, nothing to animate."), !0;
  const {
    durationMS: s = 2e3,
    easing: a = "easeInOutCosine",
    commit: l = !0,
    startEpochMS: u = null,
    signal: d = null
  } = t, f = vt(a);
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
c(mw, "execute$6");
function gw() {
  en({ type: "light-state", execute: mw, validate: hw });
}
c(gw, "registerLightStateTween");
function ul(e) {
  if ((Array.isArray(e.uuid) ? e.uuid : [e.uuid]).some((n) => !n || typeof n != "string"))
    throw new Error("tile-prop tween: 'uuid' is required (string or array of Tile document UUIDs).");
  if (!e.attribute || typeof e.attribute != "string")
    throw new Error("tile-prop tween: 'attribute' (string) is required — dot-path to a numeric property (e.g. 'alpha', 'rotation').");
  if (typeof e.value != "number")
    throw new Error("tile-prop tween: 'value' (number) is required — the target value to animate to.");
}
c(ul, "validate$5");
async function dl(e, t = {}) {
  const { CanvasAnimation: n } = foundry.canvas.animation, { uuid: i, attribute: r, value: o } = e, s = Array.isArray(i) ? i : [i];
  if (s.length === 0)
    return console.warn("tile-prop tween: empty uuid array, nothing to animate."), !0;
  const {
    durationMS: a = 2e3,
    easing: l = "easeInOutCosine",
    commit: u = !0,
    startEpochMS: d = null,
    signal: f = null
  } = t, h = vt(l);
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
c(dl, "execute$5");
function pw() {
  en({ type: "tile-prop", execute: dl, validate: ul });
}
c(pw, "registerTilePropTween");
function yw(e) {
  if (!e.attribute || typeof e.attribute != "string")
    throw new Error("particles-prop tween: 'attribute' (string) is required — property name on canvas.particleeffects (e.g. 'alpha').");
  if (typeof e.value != "number")
    throw new Error("particles-prop tween: 'value' (number) is required — the target value to animate to.");
}
c(yw, "validate$4");
async function bw(e, t = {}) {
  const { CanvasAnimation: n } = foundry.canvas.animation, { attribute: i, value: r } = e, {
    durationMS: o = 2e3,
    easing: s = "easeInOutCosine",
    startEpochMS: a = null,
    signal: l = null
  } = t, u = canvas.particleeffects;
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
c(bw, "execute$4");
function vw() {
  en({ type: "particles-prop", execute: bw, validate: yw });
}
c(vw, "registerParticlesPropTween");
var Vn, $o, Fo, Do, Po, Ro, Tr;
const _d = class _d {
  /**
   * @param {AbortController} controller
   */
  constructor(t) {
    _(this, Vn);
    _(this, $o);
    _(this, Fo);
    _(this, Do);
    _(this, Po);
    _(this, Ro, !1);
    _(this, Tr, null);
    O(this, Vn, t), O(this, Do, new Promise((n) => {
      O(this, $o, n);
    })), O(this, Po, new Promise((n) => {
      O(this, Fo, n);
    }));
  }
  /** @returns {Promise<boolean>} Resolves true (completed) or false (cancelled/failed). */
  get finished() {
    return g(this, Do);
  }
  /** @returns {Promise<{status: string, [k: string]: unknown}>} */
  get result() {
    return g(this, Po);
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
    return g(this, Tr) ? g(this, Tr).status : this.cancelled ? "cancelled" : "running";
  }
  /** Abort the timeline, triggering onCancel callbacks. */
  cancel(t = "cancelled") {
    g(this, Vn).signal.aborted || g(this, Vn).abort(t);
  }
  /**
   * Called internally by the execution engine when the timeline finishes.
   * @param {boolean} completed - true if all steps ran, false if cancelled
   */
  _resolve(t) {
    if (g(this, Ro)) return;
    O(this, Ro, !0);
    const n = typeof t == "boolean" ? { status: t ? "completed" : "cancelled" } : t ?? { status: "cancelled" };
    O(this, Tr, n), g(this, $o).call(this, n.status === "completed"), g(this, Fo).call(this, n);
  }
};
Vn = new WeakMap(), $o = new WeakMap(), Fo = new WeakMap(), Do = new WeakMap(), Po = new WeakMap(), Ro = new WeakMap(), Tr = new WeakMap(), c(_d, "TimelineHandle");
let nu = _d;
var Pi, Lr, Ri;
const Nd = class Nd {
  constructor() {
    /** @type {Map<string, Set<Function>>} */
    _(this, Pi, /* @__PURE__ */ new Map());
    /** @type {Set<string>} Signals that have been emitted (sticky) */
    _(this, Lr, /* @__PURE__ */ new Set());
    _(this, Ri, !1);
  }
  /**
   * Subscribe to a named signal.
   * @param {string} signal
   * @param {Function} listener
   * @returns {() => void} Unsubscribe function
   */
  on(t, n) {
    if (g(this, Ri)) return () => {
    };
    let i = g(this, Pi).get(t);
    return i || (i = /* @__PURE__ */ new Set(), g(this, Pi).set(t, i)), i.add(n), () => i.delete(n);
  }
  /**
   * Fire a named signal synchronously. All registered listeners are invoked.
   * The signal is recorded so that future waitFor() calls resolve immediately.
   * @param {string} signal
   */
  emit(t) {
    if (g(this, Ri)) return;
    g(this, Lr).add(t);
    const n = g(this, Pi).get(t);
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
    return g(this, Ri) ? Promise.reject(new Error("EventBus destroyed")) : g(this, Lr).has(t) ? Promise.resolve() : new Promise((i, r) => {
      if (n != null && n.aborted)
        return r(n.reason ?? "aborted");
      const o = this.on(t, () => {
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
    O(this, Ri, !0), g(this, Pi).clear(), g(this, Lr).clear();
  }
};
Pi = new WeakMap(), Lr = new WeakMap(), Ri = new WeakMap(), c(Nd, "EventBus");
let iu = Nd;
const Ym = /* @__PURE__ */ new Map();
function fl(e, t) {
  Ym.set(e, t);
}
c(fl, "registerAwaitProvider");
function ru(e, t) {
  const n = Ym.get(e.event);
  return n ? n(e, t) : Promise.reject(new Error(`Unknown await event type: "${e.event}"`));
}
c(ru, "createAwaitPromise");
fl("signal", (e, t) => e.name ? t.eventBus.waitFor(e.name, t.signal) : Promise.reject(new Error('await signal: "name" is required')));
fl("click", (e, t) => new Promise((n, i) => {
  if (t.signal.aborted) return i(t.signal.reason ?? "aborted");
  const r = /* @__PURE__ */ c(() => {
    s(), n();
  }, "onClick"), o = /* @__PURE__ */ c(() => {
    s(), i(t.signal.reason ?? "aborted");
  }, "onAbort"), s = /* @__PURE__ */ c(() => {
    document.removeEventListener("click", r), t.signal.removeEventListener("abort", o);
  }, "cleanup");
  document.addEventListener("click", r, { once: !0 }), t.signal.addEventListener("abort", o, { once: !0 });
}));
fl("keypress", (e, t) => new Promise((n, i) => {
  if (t.signal.aborted) return i(t.signal.reason ?? "aborted");
  const r = /* @__PURE__ */ c((a) => {
    e.key && a.key !== e.key || (s(), n());
  }, "onKey"), o = /* @__PURE__ */ c(() => {
    s(), i(t.signal.reason ?? "aborted");
  }, "onAbort"), s = /* @__PURE__ */ c(() => {
    document.removeEventListener("keydown", r), t.signal.removeEventListener("abort", o);
  }, "cleanup");
  document.addEventListener("keydown", r), t.signal.addEventListener("abort", o, { once: !0 });
}));
const dr = /* @__PURE__ */ new Map();
function ww(e, t) {
  const n = dr.get(e);
  n && !n.cancelled && n.cancel("replaced-by-name"), dr.set(e, t), t.finished.then(() => {
    dr.get(e) === t && dr.delete(e);
  });
}
c(ww, "registerTimeline");
function Km(e) {
  const t = dr.get(e);
  return t && !t.cancelled ? (t.cancel("cancelled-by-name"), !0) : !1;
}
c(Km, "cancelTimeline");
function Ew(e) {
  return dr.get(e);
}
c(Ew, "getTimeline");
function pf(e, t) {
  return e <= 0 ? Promise.resolve() : new Promise((n, i) => {
    if (t.aborted) return i(t.reason);
    const r = setTimeout(n, e);
    t.addEventListener("abort", () => {
      clearTimeout(r), i(t.reason);
    }, { once: !0 });
  });
}
c(pf, "cancellableDelay");
var Ze, Gn, Ho, qo;
const $d = class $d {
  constructor(t) {
    /** @type {TweenTimeline} */
    _(this, Ze);
    /** @type {Array<{ type: string, params: object, opts?: object, detach: boolean }>} */
    _(this, Gn, []);
    /** @type {Function|null} */
    _(this, Ho, null);
    /** @type {Function|null} */
    _(this, qo, null);
    O(this, Ze, t);
  }
  /**
   * Add a tween entry to this step.
   * @param {string} type  Registered tween type name
   * @param {object} params  Type-specific parameters
   * @param {object} [opts]  Options (durationMS, easing, etc.)
   * @returns {StepBuilder} this
   */
  add(t, n, i) {
    return g(this, Gn).push({ type: t, params: n, opts: i ?? {}, detach: !1 }), this;
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
  before(t) {
    return O(this, Ho, t), this;
  }
  /**
   * Callback invoked after this step's awaited tweens complete.
   * @param {Function} fn
   * @returns {StepBuilder} this
   */
  after(t) {
    return O(this, qo, t), this;
  }
  // ── Delegation to parent TweenTimeline for fluent chaining ──
  /** Start a new step (finalizes this one). */
  step() {
    return g(this, Ze).step();
  }
  /** Insert a delay between steps. */
  delay(t) {
    return g(this, Ze).delay(t);
  }
  /** Insert an await segment. */
  await(t) {
    return g(this, Ze).await(t);
  }
  /** Insert an emit segment. */
  emit(t) {
    return g(this, Ze).emit(t);
  }
  /** Insert a parallel segment. */
  parallel(t, n) {
    return g(this, Ze).parallel(t, n);
  }
  /** Register onComplete callback. */
  onComplete(t) {
    return g(this, Ze).onComplete(t);
  }
  /** Register onCancel callback. */
  onCancel(t) {
    return g(this, Ze).onCancel(t);
  }
  /** Register onError callback. */
  onError(t) {
    return g(this, Ze).onError(t);
  }
  /** Execute the timeline. */
  run(t) {
    return g(this, Ze).run(t);
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
      before: g(this, Ho),
      after: g(this, qo)
    };
  }
};
Ze = new WeakMap(), Gn = new WeakMap(), Ho = new WeakMap(), qo = new WeakMap(), c($d, "StepBuilder");
let ou = $d;
var et, je, jt, Wn, jo, Bo, Uo, Vo, mi, su, Q, yn, au, Xm, lu, Jm, Qm, Ms, Tt, rn;
const wn = class wn {
  constructor() {
    _(this, Q);
    /** @type {string|null} */
    _(this, et, null);
    /** @type {string} */
    _(this, je, De.ABORT);
    /** @type {Array<object>} */
    _(this, jt, []);
    /** @type {StepBuilder|null} */
    _(this, Wn, null);
    /** @type {Function|null} */
    _(this, jo, null);
    /** @type {Function|null} */
    _(this, Bo, null);
    /** @type {Function|null} */
    _(this, Uo, null);
    /** @type {Function|null} */
    _(this, Vo, null);
  }
  /**
   * Register this timeline in the named registry. Starting a new
   * timeline with the same name cancels the previous one.
   * @param {string} name
   * @returns {TweenTimeline} this
   */
  name(t) {
    return O(this, et, t), this;
  }
  /**
   * Set the error policy for step execution.
   * @param {"abort"|"continue"} policy
   * @returns {TweenTimeline} this
   */
  errorPolicy(t) {
    if (t !== De.ABORT && t !== De.CONTINUE)
      throw new Error(`Invalid error policy: "${t}". Use "abort" or "continue".`);
    return O(this, je, t), this;
  }
  /**
   * Start a new step. Finalizes the previous step if one is open.
   * @returns {StepBuilder}
   */
  step() {
    return I(this, Q, yn).call(this), O(this, Wn, new ou(this)), g(this, Wn);
  }
  /**
   * Insert a delay (in ms) between the previous step and the next.
   * @param {number} ms
   * @returns {TweenTimeline} this
   */
  delay(t) {
    return I(this, Q, yn).call(this), g(this, jt).push({ kind: "delay", ms: t }), this;
  }
  /**
   * Pause execution until an event occurs.
   * @param {object} config  e.g. { event: "click" }, { event: "signal", name: "fog-done" }
   * @returns {TweenTimeline} this
   */
  await(t) {
    return I(this, Q, yn).call(this), g(this, jt).push({ kind: "await", config: t }), this;
  }
  /**
   * Fire a named signal (instant, non-blocking).
   * @param {string} signal  Signal name
   * @returns {TweenTimeline} this
   */
  emit(t) {
    return I(this, Q, yn).call(this), g(this, jt).push({ kind: "emit", signal: t }), this;
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
    I(this, Q, yn).call(this);
    const i = n.join ?? "all", r = n.overflow ?? "detach";
    if (i !== "all" && i !== "any" && (typeof i != "number" || i < 1 || i > t.length))
      throw new Error(`parallel: join must be "all", "any", or 1..${t.length}, got ${JSON.stringify(i)}`);
    if (r !== "detach" && r !== "cancel")
      throw new Error(`parallel: overflow must be "detach" or "cancel", got ${JSON.stringify(r)}`);
    const o = t.map((s) => {
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
  beforeAll(t) {
    return O(this, jo, t), this;
  }
  /**
   * Callback invoked on successful completion.
   * @param {Function} fn
   * @returns {TweenTimeline} this
   */
  onComplete(t) {
    return O(this, Bo, t), this;
  }
  /**
   * Callback invoked on cancellation (mutually exclusive with onComplete).
   * @param {Function} fn
   * @returns {TweenTimeline} this
   */
  onCancel(t) {
    return O(this, Uo, t), this;
  }
  /**
   * Callback invoked on runtime failure (mutually exclusive with onComplete/onCancel).
   * @param {(outcome: object) => void} fn
   * @returns {TweenTimeline} this
   */
  onError(t) {
    return O(this, Vo, t), this;
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
    I(this, Q, yn).call(this);
    const n = new AbortController();
    t.signal && (t.signal.aborted ? n.abort(t.signal.reason ?? "parent-aborted") : t.signal.addEventListener("abort", () => {
      n.signal.aborted || n.abort(t.signal.reason ?? "parent-aborted");
    }, { once: !0 }));
    const i = new nu(n);
    g(this, et) && ww(g(this, et), i);
    const r = t.broadcast ?? game.user.isGM, o = t.commit ?? game.user.isGM, s = t.startEpochMS ?? Date.now();
    r && g(this, et) && As(Wm, {
      name: g(this, et),
      data: this.toJSON(),
      startEpochMS: s
    });
    const a = new iu(), l = {
      signal: i.signal,
      commit: o,
      startEpochMS: s,
      eventBus: a,
      errors: [],
      detachedPromises: []
    };
    return I(this, Q, Xm).call(this, i, l).then((u) => {
      var d, f, h;
      a.destroy(), i._resolve(u), u.status === Dn.COMPLETED ? (d = g(this, Bo)) == null || d.call(this) : u.status === Dn.CANCELLED ? ((f = g(this, Uo)) == null || f.call(this), r && g(this, et) && As(Zc, {
        name: g(this, et),
        reason: u.reason
      })) : ((h = g(this, Vo)) == null || h.call(this, u), r && g(this, et) && As(Zc, {
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
    const n = { timeline: I(i = wn, mi, su).call(i, g(this, jt)) };
    return g(this, et) && (n.name = g(this, et)), g(this, je) !== De.ABORT && (n.errorPolicy = g(this, je)), n;
  }
};
et = new WeakMap(), je = new WeakMap(), jt = new WeakMap(), Wn = new WeakMap(), jo = new WeakMap(), Bo = new WeakMap(), Uo = new WeakMap(), Vo = new WeakMap(), mi = new WeakSet(), su = /* @__PURE__ */ c(function(t) {
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
            return I(o = wn, mi, su).call(o, r);
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
}, "#finalizeCurrentStep"), au = /* @__PURE__ */ c(function(t) {
  t.length !== 0 && Promise.allSettled(t).catch(() => {
  });
}, "#drainDetached"), Xm = /* @__PURE__ */ c(async function(t, n) {
  var i, r;
  try {
    if (n.signal.aborted) return I(this, Q, Tt).call(this, n.signal.reason);
    const o = await I(this, Q, Ms).call(this, g(this, jo), $t.BEFORE_ALL, null);
    if (o) {
      if (g(this, je) === De.ABORT) return o;
      n.errors.push(o);
    }
    const s = await I(this, Q, lu).call(this, g(this, jt), n);
    if (s)
      return I(i = wn, mi, au).call(i, n.detachedPromises), s;
    if (!n.signal.aborted) {
      const a = await Promise.allSettled(n.detachedPromises);
      for (const l of a)
        if (l.status === "rejected") {
          const u = I(this, Q, rn).call(this, l.reason, $t.ENTRY);
          if (g(this, je) === De.ABORT) return u;
          n.errors.push(u);
        }
    }
    return n.signal.aborted ? I(this, Q, Tt).call(this, n.signal.reason) : {
      status: Dn.COMPLETED,
      ...n.errors.length > 0 ? { errors: n.errors } : {}
    };
  } catch (o) {
    return I(r = wn, mi, au).call(r, n.detachedPromises), n.signal.aborted ? I(this, Q, Tt).call(this, n.signal.reason) : (console.error("TweenTimeline execution error:", o), I(this, Q, rn).call(this, o, $t.RUNTIME));
  }
}, "#execute"), lu = /* @__PURE__ */ c(async function(t, n) {
  let i = -1, r = 0;
  for (const o of t) {
    if (n.signal.aborted) return I(this, Q, Tt).call(this, n.signal.reason);
    if (o.kind === "delay") {
      try {
        await pf(o.ms, n.signal);
      } catch {
        return I(this, Q, Tt).call(this, n.signal.reason);
      }
      r += o.ms;
      continue;
    }
    if (o.kind === "await") {
      try {
        let p = ru(o.config, {
          signal: n.signal,
          eventBus: n.eventBus
        });
        const y = o.config.timeout;
        typeof y == "number" && y > 0 && (p = Promise.race([
          p,
          pf(y, n.signal)
        ])), await p;
      } catch (p) {
        if (n.signal.aborted) return I(this, Q, Tt).call(this, n.signal.reason);
        const y = I(this, Q, rn).call(this, p, $t.AWAIT);
        if (g(this, je) === De.ABORT) return y;
        n.errors.push(y);
      }
      continue;
    }
    if (o.kind === "emit") {
      try {
        n.eventBus.emit(o.signal);
      } catch (p) {
        const y = I(this, Q, rn).call(this, p, $t.EMIT);
        if (g(this, je) === De.ABORT) return y;
        n.errors.push(y);
      }
      continue;
    }
    if (o.kind === "parallel") {
      const p = await I(this, Q, Jm).call(this, o, n, r);
      if (p) return p;
      continue;
    }
    i += 1;
    const { entries: s, before: a, after: l } = o.data, u = await I(this, Q, Ms).call(this, a, $t.BEFORE_STEP, i);
    if (u) {
      if (g(this, je) === De.ABORT) return u;
      n.errors.push(u);
      continue;
    }
    if (n.signal.aborted) return I(this, Q, Tt).call(this, n.signal.reason);
    const d = [];
    let f = 0;
    for (const p of s) {
      const y = jr(p.type);
      if (!y) {
        const w = I(this, Q, rn).call(this, new Error(`TweenTimeline: unknown tween type "${p.type}"`), $t.ENTRY, i, p.type);
        if (g(this, je) === De.ABORT) return w;
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
    const h = await I(this, Q, Qm).call(this, d, n.signal);
    if (h === null) return I(this, Q, Tt).call(this, n.signal.reason);
    for (const p of h)
      if (!p.ok) {
        if (g(this, je) === De.ABORT) return p.failure;
        n.errors.push(p.failure), console.warn("TweenTimeline: entry failed:", p.failure.error);
      }
    const m = await I(this, Q, Ms).call(this, l, $t.AFTER_STEP, i);
    if (m) {
      if (g(this, je) === De.ABORT) return m;
      n.errors.push(m);
    }
    if (n.signal.aborted) return I(this, Q, Tt).call(this, n.signal.reason);
    r += f;
  }
  return null;
}, "#executeSegments"), Jm = /* @__PURE__ */ c(async function(t, n, i = 0) {
  const { branches: r, join: o, overflow: s } = t, a = r.length, l = o === "all" ? a : o === "any" ? 1 : o, u = r.map(() => {
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
        g(this, je) === De.ABORT ? p(S) : (n.errors.push(S), n.errors.push(...w), p(null));
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
      return I(this, Q, lu).call(this, b, S).then((T) => {
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
Qm = /* @__PURE__ */ c(function(t, n) {
  return t.length === 0 ? Promise.resolve([]) : n.aborted ? Promise.resolve(null) : new Promise((i, r) => {
    const o = /* @__PURE__ */ c(() => i(null), "onAbort");
    n.addEventListener("abort", o, { once: !0 }), Promise.all(t).then((s) => {
      n.removeEventListener("abort", o), i(s);
    }).catch((s) => {
      n.removeEventListener("abort", o), r(s);
    });
  });
}, "#waitForStep"), Ms = /* @__PURE__ */ c(async function(t, n, i) {
  if (!t) return null;
  try {
    return await t(), null;
  } catch (r) {
    const o = I(this, Q, rn).call(this, r, n, i ?? void 0);
    return g(this, je) === De.CONTINUE && console.warn(`TweenTimeline: hook failure in ${n}:`, r), o;
  }
}, "#runHook"), /** @param {unknown} reason */
Tt = /* @__PURE__ */ c(function(t) {
  let n;
  return typeof t == "string" ? n = t : t instanceof Error && (n = t.message), {
    status: Dn.CANCELLED,
    ...n ? { reason: n } : {}
  };
}, "#cancelledOutcome"), /**
 * @param {unknown} err
 * @param {string} phase
 * @param {number} [stepIndex]
 * @param {string} [entryType]
 */
rn = /* @__PURE__ */ c(function(t, n, i, r) {
  const o = t instanceof Error ? t : new Error(String(t));
  return {
    status: Dn.FAILED,
    error: o,
    phase: n,
    ...typeof i == "number" ? { stepIndex: i } : {},
    ...r ? { entryType: r } : {}
  };
}, "#failedOutcome"), _(wn, mi), c(wn, "TweenTimeline");
let ta = wn;
function sd(e) {
  if (!e || typeof e != "object")
    throw new Error("Sequence JSON: data must be an object.");
  if (!Array.isArray(e.timeline))
    throw new Error("Sequence JSON: 'timeline' must be an array.");
  if (e.name != null && typeof e.name != "string")
    throw new Error("Sequence JSON: 'name' must be a string.");
  if (e.errorPolicy != null && e.errorPolicy !== De.ABORT && e.errorPolicy !== De.CONTINUE)
    throw new Error(`Sequence JSON: 'errorPolicy' must be "abort" or "continue".`);
  Zm(e.timeline, "timeline", 0);
}
c(sd, "validateSequenceJSON");
function Zm(e, t, n = 0) {
  for (let i = 0; i < e.length; i++) {
    const r = e[i], o = `${t}[${i}]`;
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
        Zm(d, `${o}.parallel.branches[${u}]`, n + 1);
      }
      continue;
    }
    throw new Error(`Sequence JSON: ${o} is not a recognized segment (step array, delay, await, emit, or parallel).`);
  }
}
c(Zm, "validateSegmentsJSON");
function eg(e) {
  sd(e), tg(e.timeline, "timeline");
}
c(eg, "validateSequenceSemantics");
function tg(e, t) {
  for (let n = 0; n < e.length; n++) {
    const i = e[n], r = `${t}[${n}]`;
    if (Array.isArray(i))
      for (let o = 0; o < i.length; o++) {
        const s = i[o];
        try {
          ow(s.type, s.params ?? {});
        } catch (a) {
          throw new Error(`Sequence JSON: ${r}[${o}] failed semantic validation: ${a.message}`);
        }
      }
    else if (i.parallel)
      for (let o = 0; o < i.parallel.branches.length; o++)
        tg(i.parallel.branches[o], `${r}.parallel.branches[${o}]`);
  }
}
c(tg, "validateSegmentsSemantics");
function ad(e, t = {}) {
  sd(e), t.validateSemantics && eg(e);
  const n = new ta();
  return e.name && n.name(e.name), e.errorPolicy && n.errorPolicy(e.errorPolicy), ng(e.timeline, n), n;
}
c(ad, "compileSequence");
function ng(e, t) {
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
      const i = n.parallel, r = i.branches.map((o) => (s) => ng(o, s));
      t.parallel(r, {
        join: i.join ?? "all",
        overflow: i.overflow ?? "detach"
      });
    }
  }
}
c(ng, "compileSegments");
function Sw(e) {
  sd(e), eg(e);
}
c(Sw, "validate$3");
async function Cw(e, t = {}) {
  return ad(e, { validateSemantics: !0 }).run({
    broadcast: !1,
    commit: t.commit,
    startEpochMS: t.startEpochMS,
    signal: t.signal
  }).finished;
}
c(Cw, "execute$3");
function Tw() {
  en({ type: "sequence", execute: Cw, validate: Sw });
}
c(Tw, "registerSequenceTween");
function Lw(e) {
  if (e.x == null && e.y == null && e.scale == null)
    throw new Error("camera-pan tween: at least one of 'x', 'y', or 'scale' is required.");
  if (e.x != null && typeof e.x != "number")
    throw new Error("camera-pan tween: 'x' must be a number.");
  if (e.y != null && typeof e.y != "number")
    throw new Error("camera-pan tween: 'y' must be a number.");
  if (e.scale != null && (typeof e.scale != "number" || e.scale <= 0))
    throw new Error("camera-pan tween: 'scale' must be a positive number.");
}
c(Lw, "validate$2");
async function Iw(e, t = {}) {
  const {
    durationMS: n = 2e3,
    startEpochMS: i = null,
    signal: r = null
  } = t;
  if (r != null && r.aborted) return !1;
  const o = typeof i == "number" ? Math.max(0, Math.min(n, Date.now() - i)) : 0, s = Math.max(0, n - o), a = { duration: s };
  if (e.x != null && (a.x = e.x), e.y != null && (a.y = e.y), e.scale != null && (a.scale = e.scale), s <= 0)
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
c(Iw, "execute$2");
function kw() {
  en({ type: "camera-pan", execute: Iw, validate: Lw });
}
c(kw, "registerCameraPanTween");
function Ow(e) {
  if ((Array.isArray(e.uuid) ? e.uuid : [e.uuid]).some((i) => !i || typeof i != "string"))
    throw new Error("tile-tint tween: 'uuid' is required (string or array of Tile document UUIDs).");
  if (e.toColor == null || typeof e.toColor != "string")
    throw new Error("tile-tint tween: 'toColor' (CSS color string) is required.");
  if (!foundry.utils.Color.fromString(e.toColor).valid)
    throw new Error(`tile-tint tween: invalid target color "${e.toColor}".`);
  if (e.mode && !_r().includes(e.mode))
    throw new Error(
      `tile-tint tween: unknown mode "${e.mode}". Available: ${_r().join(", ")}`
    );
}
c(Ow, "validate$1");
async function Aw(e, t = {}) {
  const { CanvasAnimation: n } = foundry.canvas.animation, { Color: i } = foundry.utils, { uuid: r, toColor: o, mode: s = "oklch" } = e, a = Array.isArray(r) ? r : [r];
  if (a.length === 0)
    return console.warn("tile-tint tween: empty uuid array, nothing to animate."), !0;
  const {
    durationMS: l = 2e3,
    easing: u = "easeInOutCosine",
    commit: d = !0,
    startEpochMS: f = null,
    signal: h = null
  } = t, m = vt(u), p = od(s), y = i.fromString(o);
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
c(Aw, "execute$1");
function Mw() {
  en({ type: "tile-tint", execute: Aw, validate: Ow });
}
c(Mw, "registerTileTintTween");
function xw(e) {
  if ((Array.isArray(e.uuid) ? e.uuid : [e.uuid]).some((n) => !n || typeof n != "string"))
    throw new Error("tile-scale tween: 'uuid' is required (string or array of Tile document UUIDs).");
  if (typeof e.toScale != "number" || e.toScale <= 0)
    throw new Error("tile-scale tween: 'toScale' must be a positive number.");
  for (const n of ["baseWidth", "baseHeight", "centerX", "centerY"])
    if (typeof e[n] != "number")
      throw new Error(`tile-scale tween: '${n}' (number) is required.`);
}
c(xw, "validate");
async function _w(e, t = {}) {
  const { CanvasAnimation: n } = foundry.canvas.animation, { uuid: i, toScale: r, baseWidth: o, baseHeight: s, centerX: a, centerY: l } = e, u = Array.isArray(i) ? i : [i];
  if (u.length === 0) return !0;
  const {
    durationMS: d = 2e3,
    easing: f = "easeInOutCosine",
    commit: h = !0,
    startEpochMS: m = null,
    signal: p = null
  } = t, y = vt(f), E = o * r, v = s * r, b = a - E / 2, w = l - v / 2;
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
c(_w, "execute");
function Nw() {
  en({ type: "tile-scale", execute: _w, validate: xw });
}
c(Nw, "registerTileScaleTween");
async function $w(e, t, n = {}) {
  if (!game.user.isGM)
    return ui.notifications.warn("Only the GM can dispatch tweens."), !1;
  const i = jr(e);
  if (!i)
    throw new Error(`Unknown tween type: "${e}". Registered types: ${eu().join(", ")}`);
  i.validate(t);
  const { durationMS: r = 2e3, easing: o = "easeInOutCosine", commit: s = !0 } = n, a = Date.now();
  return As(Gm, {
    type: e,
    params: t,
    durationMS: r,
    easing: o,
    startEpochMS: a,
    commit: !1
  }), i.execute(t, { durationMS: r, easing: o, commit: s, startEpochMS: a });
}
c($w, "dispatchTween");
function Fw(e) {
  const { type: t, params: n, durationMS: i, easing: r, startEpochMS: o, commit: s } = e ?? {}, a = jr(t);
  if (!a) {
    console.warn(`[${k}] Received unknown tween type over socket: "${t}"`);
    return;
  }
  a.execute(n, {
    durationMS: i,
    easing: r,
    commit: s ?? !1,
    startEpochMS: o
  });
}
c(Fw, "handleTweenSocketMessage");
fw();
gw();
pw();
vw();
Tw();
kw();
Mw();
Nw();
en({ type: "token-prop", execute: dl, validate: ul });
en({ type: "drawing-prop", execute: dl, validate: ul });
en({ type: "sound-prop", execute: dl, validate: ul });
id(Gm, Fw);
id(Wm, Dw);
id(Zc, Pw);
function Dw(e) {
  const { data: t, startEpochMS: n } = e ?? {};
  if (!t) {
    console.warn(`[${k}] Received empty tween-sequence socket message.`);
    return;
  }
  try {
    ad(t, { validateSemantics: !0 }).run({ commit: !1, startEpochMS: n, broadcast: !1 });
  } catch (i) {
    console.error(`[${k}] Failed to run received tween sequence:`, i);
  }
}
c(Dw, "handleSequenceSocketMessage");
function Pw(e) {
  const { name: t } = e ?? {};
  t && Km(t);
}
c(Pw, "handleSequenceCancelMessage");
function Rw() {
  Hooks.once("ready", () => {
    rw();
    const e = game.modules.get(k);
    e.api || (e.api = {}), e.api.tween = {
      dispatch: $w,
      types: eu,
      Timeline: ta,
      ErrorPolicy: De,
      compileSequence: ad,
      cancelTimeline: Km,
      getTimeline: Ew
    }, console.log(`[${k}] Tween API registered. Types: ${eu().join(", ")}`);
  });
}
c(Rw, "registerTweenHooks");
Rw();
const Hw = ["tag", "tag-all", "id", "tags-any", "tags-all"], qw = /* @__PURE__ */ new Set(["tags-any", "tags-all"]);
function ld(e) {
  if (!e || typeof e != "string")
    return { type: "unknown", value: e ?? "" };
  if (e.startsWith("$"))
    return { type: "special", value: e };
  for (const t of Hw)
    if (e.startsWith(`${t}:`)) {
      const n = e.slice(t.length + 1), i = qw.has(t) ? n.split(",").map((r) => r.trim()) : n;
      return { type: t, value: i };
    }
  return e.includes(".") ? { type: "uuid", value: e } : { type: "unknown", value: e };
}
c(ld, "parseSelector");
function jw(e) {
  if (!e) return "";
  const { type: t, value: n } = e;
  if (t === "special" || t === "uuid" || t === "unknown")
    return Array.isArray(n) ? n.join(",") : n ?? "";
  const i = Array.isArray(n) ? n.join(",") : n ?? "";
  return `${t}:${i}`;
}
c(jw, "buildSelector");
function ig(e, t = "first") {
  return e != null && e.length ? e.length === 1 ? t === "first-all" || t === "all" ? `tag-all:${e[0]}` : `tag:${e[0]}` : t === "any" ? `tags-any:${e.join(",")}` : t === "all" ? `tags-all:${e.join(",")}` : t === "first-all" ? `tags-all:${e.join(",")}` : `tags-any:${e.join(",")}` : "";
}
c(ig, "buildTagSelector");
function hl(e) {
  if (!e) return null;
  if (e.documentName || e._source !== void 0) {
    const t = e.object;
    return t ? { placeable: t, doc: e } : null;
  }
  return e.document ? { placeable: e, doc: e.document } : null;
}
c(hl, "normalizePlaceable");
function rg() {
  var e;
  return window.Tagger ?? ((e = game.modules.get("tagger")) == null ? void 0 : e.api) ?? null;
}
c(rg, "getTaggerAPI");
function ml(e, t) {
  if (!e) return null;
  const n = t ?? canvas.scene;
  if (!n) return null;
  const i = ld(e);
  switch (i.type) {
    case "special":
      return Bw(i.value);
    case "tag":
      return yf(i.value, n);
    case "tag-all":
      return yf(i.value, n);
    case "id":
      return Uw(i.value, n);
    case "tags-any":
      return bf(i.value, n, !0);
    case "tags-all":
      return bf(i.value, n, !1);
    case "uuid":
      return Vw(i.value);
    default:
      return null;
  }
}
c(ml, "resolveSelector");
function Bw(e) {
  var t;
  if (e === "$particles") {
    if (!((t = game.modules.get("fxmaster")) != null && t.active))
      return console.warn(`[${k}] Picker: FXMaster not active, cannot resolve "$particles".`), null;
    const n = canvas.particleeffects;
    return n ? { kind: "particles", documents: [], placeables: [], target: n } : null;
  }
  return null;
}
c(Bw, "resolveSpecial");
function yf(e, t, n) {
  const i = rg();
  if (!i)
    return console.warn(`[${k}] Picker: Tagger not available, cannot resolve tag "${e}".`), null;
  const r = i.getByTag(e, { sceneId: t.id });
  if (!(r != null && r.length)) return null;
  const o = [];
  for (const s of r) {
    const a = hl(s);
    a && o.push(a);
  }
  return o.length === 0 ? null : {
    kind: o.length === 1 ? "placeable" : "multi-placeable",
    documents: o.map((s) => s.doc),
    placeables: o
  };
}
c(yf, "resolveTag");
function Uw(e, t) {
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
      const o = hl(r);
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
c(Uw, "resolveById");
function bf(e, t, n) {
  const i = rg();
  if (!i)
    return console.warn(`[${k}] Picker: Tagger not available, cannot resolve multi-tag.`), null;
  const r = i.getByTag(e, {
    sceneId: t.id,
    matchAny: n
  });
  if (!(r != null && r.length)) return null;
  const o = [];
  for (const s of r) {
    const a = hl(s);
    a && o.push(a);
  }
  return o.length === 0 ? null : {
    kind: o.length === 1 ? "placeable" : "multi-placeable",
    documents: o.map((s) => s.doc),
    placeables: o
  };
}
c(bf, "resolveMultiTag");
function Vw(e) {
  const t = fromUuidSync(e);
  if (!t) return null;
  const n = hl(t);
  return n ? {
    kind: "placeable",
    documents: [n.doc],
    placeables: [n]
  } : null;
}
c(Vw, "resolveUUID");
function Gw(e) {
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
c(Gw, "adaptResolved");
function na(e) {
  var r;
  const t = /* @__PURE__ */ new Set();
  if (e.segments) {
    if (e.setup) for (const o of Object.keys(e.setup)) t.add(o);
    if (e.landing) for (const o of Object.keys(e.landing)) t.add(o);
    for (const o of Object.values(e.segments)) {
      if (o.setup) for (const s of Object.keys(o.setup)) t.add(s);
      if (o.landing) for (const s of Object.keys(o.landing)) t.add(s);
      o.timeline && uu(o.timeline, t), (r = o.gate) != null && r.target && t.add(o.gate.target);
    }
  } else {
    if (e.setup) for (const o of Object.keys(e.setup)) t.add(o);
    if (e.landing) for (const o of Object.keys(e.landing)) t.add(o);
    e.timeline && uu(e.timeline, t);
  }
  const n = /* @__PURE__ */ new Map(), i = [];
  for (const o of t) {
    const s = ml(o), a = Gw(s);
    a ? n.set(o, a) : i.push(o);
  }
  return i.length && console.warn(`[${k}] Cinematic: ${i.length} unresolved target(s): ${i.join(", ")}`), { targets: n, unresolved: i };
}
c(na, "resolveAllTargets");
function Ww(e, t) {
  if (!e) return {};
  const n = {};
  for (const [i, r] of Object.entries(e)) {
    const o = t.get(i);
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
c(Ww, "captureSnapshot");
function zw(e) {
  const t = {};
  function n(i) {
    if (i)
      for (const [r, o] of Object.entries(i))
        t[r] || (t[r] = {}), Object.assign(t[r], o);
  }
  if (c(n, "mergeMap"), e.segments) {
    n(e.setup), n(e.landing);
    for (const i of Object.values(e.segments))
      n(i.setup), n(i.landing), i.timeline && cu(i.timeline, t, n);
  } else
    n(e.setup), n(e.landing), e.timeline && cu(e.timeline, t, n);
  return t;
}
c(zw, "gatherAllStateMaps");
function cu(e, t, n) {
  var i;
  for (const r of e)
    if (!(r.delay != null || r.await != null || r.emit != null) && !(r.transitionTo != null || r.sound != null || r.stopSound != null)) {
      if ((i = r.parallel) != null && i.branches) {
        for (const o of r.parallel.branches)
          cu(o, t, n);
        continue;
      }
      if (n(r.before), n(r.after), r.tweens)
        for (const o of r.tweens)
          o.target && o.attribute && (t[o.target] || (t[o.target] = {}), t[o.target][o.attribute] = "__snapshot__");
    }
}
c(cu, "gatherFromEntries");
function uu(e, t) {
  for (const n of e)
    if (n.delay == null && n.await == null && n.emit == null && n.transitionTo == null && n.sound == null && n.stopSound == null) {
      if (n.parallel) {
        const i = n.parallel;
        if (i.branches)
          for (const r of i.branches)
            uu(r, t);
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
c(uu, "collectSelectorsFromEntries");
const vf = {
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
}, Yw = /* @__PURE__ */ new Set([
  "alpha",
  "visible",
  "x",
  "y",
  "scale",
  "rotation"
]);
function Rl(e, t, n) {
  const i = {};
  for (const [r, o] of Object.entries(e))
    t.has(r) ? i[r] = o : console.warn(`[${k}] Cinematic: blocked property "${r}" on ${n}.`);
  return i;
}
c(Rl, "filterOverrides");
function Pe(e, t) {
  var i, r;
  if (!e) return;
  const n = [];
  for (const [o, s] of Object.entries(e)) {
    const a = t.get(o);
    if (a)
      if (a.kind === "particles") {
        if (a.target.destroyed) continue;
        const l = Rl(s, Yw, "$particles");
        for (const [u, d] of Object.entries(l))
          a.target[u] = d;
      } else if (a.kind === "multi-placeable")
        for (const { placeable: l, doc: u } of a.placeables) {
          if (!(u != null && u.parent) || !(l != null && l.scene)) continue;
          const d = u.documentName, f = vf[d];
          if (!f) {
            console.warn(`[${k}] Cinematic: no allowlist for document type "${d}" on "${o}", skipping.`);
            continue;
          }
          const h = Rl(s, f, `${d} "${o}"`);
          u.updateSource(h), n.push(l);
        }
      else {
        if (!((i = a.doc) != null && i.parent) || !((r = a.placeable) != null && r.scene)) continue;
        const l = a.doc.documentName, u = vf[l];
        if (!u) {
          console.warn(`[${k}] Cinematic: no allowlist for document type "${l}" on "${o}", skipping.`);
          continue;
        }
        const d = Rl(s, u, `${l} "${o}"`);
        a.doc.updateSource(d), n.push(a.placeable);
      }
  }
  for (const o of n)
    o.refresh();
}
c(Pe, "applyState");
function fr(e, t) {
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
c(fr, "refreshPerceptionIfNeeded");
const Kw = {
  "tile-prop": /* @__PURE__ */ new Set(["uuid", "attribute", "value"]),
  "light-color": /* @__PURE__ */ new Set(["uuid", "toColor", "toAlpha", "mode"]),
  "light-state": /* @__PURE__ */ new Set(["uuid", "enabled"]),
  "particles-prop": /* @__PURE__ */ new Set(["attribute", "value"]),
  "camera-pan": /* @__PURE__ */ new Set(["x", "y", "scale"]),
  "token-prop": /* @__PURE__ */ new Set(["uuid", "attribute", "value"]),
  "drawing-prop": /* @__PURE__ */ new Set(["uuid", "attribute", "value"]),
  "sound-prop": /* @__PURE__ */ new Set(["uuid", "attribute", "value"])
}, Xw = /* @__PURE__ */ new Set(["easing"]), Jw = /* @__PURE__ */ new Set(["type", "target"]);
function og(e, t) {
  const { type: n, target: i, ...r } = e;
  if (!n)
    return console.warn(`[${k}] Cinematic: tween entry missing 'type', skipping.`), null;
  const o = {}, s = {}, a = Kw[n];
  if (i === "$particles")
    o.target = "$particles";
  else if (i) {
    const l = t.get(i);
    if (!l) return null;
    l.kind === "multi-placeable" ? o.uuid = l.placeables.map((u) => u.doc.uuid) : o.uuid = l.doc.uuid;
  }
  for (const [l, u] of Object.entries(r))
    Jw.has(l) || (Xw.has(l) ? s[l] = u : (a != null && a.has(l), o[l] = u));
  return { type: n, params: o, opts: s };
}
c(og, "compileTween");
const Co = /* @__PURE__ */ new Map();
let Qw = 0;
async function Zw(e) {
  var u, d, f, h, m;
  const { id: t, src: n, volume: i = 0.8, loop: r = !1, fadeIn: o } = e;
  if (!n) {
    console.warn(`[${k}] Cinematic sound: missing 'src', skipping.`);
    return;
  }
  const s = t || `__auto_${++Qw}`, a = {
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
  o && o > 0 && l.fade && l.fade(i, { duration: o, from: 0 }), Co.set(s, { sound: l, config: e }), console.log(`[${k}] Cinematic sound: playing "${n}" as "${s}" (loop=${r}, vol=${i})`);
}
c(Zw, "playLocalSound");
function Hl(e) {
  var i, r;
  const t = Co.get(e);
  if (!t) {
    console.warn(`[${k}] Cinematic sound: no active sound with id "${e}".`);
    return;
  }
  const n = t.config.fadeOut;
  try {
    n && n > 0 && t.sound.fade ? t.sound.fade(0, { duration: n }).then(() => {
      var o, s;
      return (s = (o = t.sound).stop) == null ? void 0 : s.call(o);
    }) : (r = (i = t.sound).stop) == null || r.call(i);
  } catch (o) {
    console.warn(`[${k}] Cinematic sound: error stopping "${e}":`, o);
  }
  Co.delete(e);
}
c(Hl, "stopCinematicSound");
function wf() {
  var e, t;
  for (const [n, i] of Co)
    try {
      (t = (e = i.sound).stop) == null || t.call(e);
    } catch (r) {
      console.warn(`[${k}] Cinematic sound: error stopping "${n}" during cleanup:`, r);
    }
  Co.clear();
}
c(wf, "stopAllCinematicSounds");
function eE(e, t, n, i = {}) {
  const { skipToStep: r, onStepComplete: o, timelineName: s } = i, a = new n().name(s ?? `cinematic-${canvas.scene.id}`);
  return a.beforeAll(() => {
    var l;
    try {
      Pe(e.setup, t), canvas.perception.update({ refreshLighting: !0, refreshVision: !0 });
    } catch (u) {
      throw console.error(`[${k}] Cinematic: error in beforeAll (setup state) on scene ${(l = canvas.scene) == null ? void 0 : l.id}:`, u), u;
    }
  }), ag(e.timeline, a, t, { skipToStep: r, onStepComplete: o }), { tl: a };
}
c(eE, "buildTimeline");
function sg(e, t) {
  var n;
  if (e)
    for (const i of e)
      for (const r of i) {
        if (r.before)
          try {
            Pe(r.before, t), fr(r.before, t);
          } catch (o) {
            console.warn(`[${k}] Cinematic: error in skipped parallel before:`, o);
          }
        if (r.after)
          try {
            Pe(r.after, t), fr(r.after, t);
          } catch (o) {
            console.warn(`[${k}] Cinematic: error in skipped parallel after:`, o);
          }
        (n = r.parallel) != null && n.branches && sg(r.parallel.branches, t);
      }
}
c(sg, "applyParallelStatesForSkip");
function ag(e, t, n, i = {}) {
  const { skipToStep: r, onStepComplete: o } = i;
  let s = -1;
  for (const a of e) {
    if (a.sound != null) {
      if (r != null && s < r) continue;
      const f = a.sound, { duration: h, loop: m, fireAndForget: p } = f, y = t.step();
      if (y.before(() => {
        Zw(f);
      }), h && h > 0)
        if (p) {
          if (m && f.id) {
            const E = f.id, v = h;
            y.before(() => {
              setTimeout(() => Hl(E), v);
            });
          }
        } else
          t.delay(h), m && t.step().before(() => {
            Hl(f.id);
          });
      continue;
    }
    if (a.stopSound != null) {
      if (r != null && s < r) continue;
      const f = a.stopSound;
      t.step().before(() => {
        Hl(f);
      });
      continue;
    }
    if (a.delay != null) {
      if (r != null && s < r) continue;
      t.delay(a.delay);
      continue;
    }
    if (a.await != null) {
      if (r != null && s < r) continue;
      t.await(a.await);
      continue;
    }
    if (a.emit != null) {
      if (r != null && s < r) continue;
      t.emit(a.emit);
      continue;
    }
    if (a.parallel) {
      if (r != null && s < r) {
        sg(a.parallel.branches, n);
        continue;
      }
      const f = a.parallel, h = f.branches.map((m) => (p) => ag(m, p, n));
      t.parallel(h, {
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
          Pe(a.before, n), fr(a.before, n);
        } catch (f) {
          console.warn(`[${k}] Cinematic: error applying skipped step.before:`, f);
        }
      if (a.after)
        try {
          Pe(a.after, n), fr(a.after, n);
        } catch (f) {
          console.warn(`[${k}] Cinematic: error applying skipped step.after:`, f);
        }
      continue;
    }
    const l = s, u = t.step();
    a.before && u.before(() => {
      var f;
      try {
        Pe(a.before, n), fr(a.before, n);
      } catch (h) {
        throw console.error(`[${k}] Cinematic: error in step.before callback on scene ${(f = canvas.scene) == null ? void 0 : f.id}:`, h), h;
      }
    });
    const d = a.duration ?? 500;
    for (const f of a.tweens) {
      const h = og(f, n);
      h && u.add(h.type, h.params, { ...h.opts, durationMS: d });
    }
    u.after(() => {
      var f;
      try {
        a.after && (Pe(a.after, n), fr(a.after, n)), o == null || o(l);
      } catch (h) {
        throw console.error(`[${k}] Cinematic: error in step.after callback on scene ${(f = canvas.scene) == null ? void 0 : f.id}:`, h), h;
      }
    });
  }
}
c(ag, "compileCinematicEntries");
function hr(e, t, n) {
  if (e != null) {
    if (typeof e != "object" || Array.isArray(e)) {
      n.push({ path: t, level: "error", message: `Expected object, got ${Array.isArray(e) ? "array" : typeof e}` });
      return;
    }
    for (const [i, r] of Object.entries(e))
      (typeof r != "object" || r === null || Array.isArray(r)) && n.push({ path: `${t}["${i}"]`, level: "error", message: `Expected property overrides object, got ${Array.isArray(r) ? "array" : typeof r}` });
  }
}
c(hr, "validateStateMap");
function du(e, t, n, i) {
  var r;
  for (let o = 0; o < e.length; o++) {
    const s = e[o], a = `${t}[${o}]`;
    if (!(s.delay != null || s.await != null || s.emit != null) && !(s.transitionTo != null || s.sound != null || s.stopSound != null)) {
      if ((r = s.parallel) != null && r.branches) {
        for (let l = 0; l < s.parallel.branches.length; l++)
          du(s.parallel.branches[l], `${a}.parallel.branches[${l}]`, n, i);
        continue;
      }
      if (hr(s.before, `${a}.before`, i), hr(s.after, `${a}.after`, i), s.tweens)
        for (let l = 0; l < s.tweens.length; l++) {
          const u = s.tweens[l], d = `${a}.tweens[${l}]`;
          if (!u.type) {
            i.push({ path: d, level: "error", message: "Missing 'type' field" });
            continue;
          }
          const f = jr(u.type);
          if (!f) {
            i.push({ path: d, level: "error", message: `Unknown tween type: "${u.type}"` });
            continue;
          }
          if (n)
            try {
              const h = og(u, n);
              h ? f.validate(h.params) : u.target && i.push({ path: d, level: "warn", message: `Target "${u.target}" could not be resolved for compilation` });
            } catch (h) {
              i.push({ path: d, level: "error", message: h.message });
            }
          n && u.target && !n.has(u.target) && i.push({ path: `${d}.target`, level: "warn", message: `Target "${u.target}" is not resolved` });
        }
    }
  }
}
c(du, "validateEntries");
function tE(e, t = null) {
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
    for (const [s, a] of Object.entries(e.segments)) {
      const l = `segments.${s}`;
      hr(a.setup, `${l}.setup`, n), hr(a.landing, `${l}.landing`, n), a.timeline && Array.isArray(a.timeline) && du(a.timeline, `${l}.timeline`, t, n), a.next && typeof a.next == "string" && !e.segments[a.next] && n.push({ path: `${l}.next`, level: "error", message: `Next segment "${a.next}" not found` });
    }
  } else
    hr(e.setup, "setup", n), hr(e.landing, "landing", n), e.timeline && Array.isArray(e.timeline) && du(e.timeline, "timeline", t, n);
  return n;
}
c(tE, "validateCinematicDeep");
const ql = 5, Ef = /* @__PURE__ */ new Set(["click", "tile-click", "keypress"]);
var de, Ee, tt, Be, _t, to, fu, lg, J, We, xs, Fe, Ft;
const ue = class ue {
  constructor(t = null, { loadedHash: n = null, cinematicName: i = "default", segmentName: r = null } = {}) {
    _(this, J);
    _(this, de);
    _(this, Ee);
    _(this, tt);
    _(this, Be);
    var s;
    O(this, de, t ?? ue.empty()), O(this, Ee, i), O(this, Be, n);
    const o = (s = g(this, de).cinematics) == null ? void 0 : s[g(this, Ee)];
    O(this, tt, r ?? (o == null ? void 0 : o.entry) ?? "main");
  }
  static empty() {
    return {
      version: ql,
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
  static migrateV3toV4(t) {
    var E;
    const { trigger: n, tracking: i, synchronized: r, setup: o, landing: s, timeline: a = [] } = t;
    if (!a.some(
      (v) => {
        var b;
        return v.await != null && Ef.has(((b = v.await) == null ? void 0 : b.event) ?? "click");
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
        if (v.await != null && Ef.has(((E = v.await) == null ? void 0 : E.event) ?? "click")) {
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
  static migrateV4toV5(t) {
    var i, r;
    if (!t.segments) return t;
    const n = foundry.utils.deepClone(t);
    for (const o of Object.values(n.segments))
      (i = o.timeline) != null && i.length && (o.timeline = I(r = ue, _t, fu).call(r, o.timeline));
    return n;
  }
  static fromScene(t, n = "default") {
    var s;
    const i = t == null ? void 0 : t.getFlag(k, "cinematic");
    let r = i ? foundry.utils.deepClone(i) : null;
    const o = i ? I(s = ue, _t, lg).call(s, i) : null;
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
      r.version = ql;
    }
    return new ue(r, { loadedHash: o, cinematicName: n });
  }
  /**
   * Check if the scene's cinematic flag has been modified since this state was loaded.
   * @param {object} scene  The Foundry scene document
   * @returns {boolean} true if scene data differs from what was loaded
   */
  isStale(t) {
    if (!g(this, Be)) return !1;
    const n = t == null ? void 0 : t.getFlag(k, "cinematic");
    return n ? !foundry.utils.objectsEqual(n, g(this, Be)) : !1;
  }
  // ── Read ──────────────────────────────────────────────────────────────
  get data() {
    return g(this, de);
  }
  get trigger() {
    return g(this, J, We).trigger;
  }
  get tracking() {
    return g(this, J, We).tracking;
  }
  get synchronized() {
    return g(this, J, We).synchronized ?? !1;
  }
  get activeCinematicName() {
    return g(this, Ee);
  }
  // ── Segment accessors ────────────────────────────────────────────────
  get segments() {
    return g(this, J, We).segments;
  }
  get entry() {
    return g(this, J, We).entry;
  }
  get activeSegmentName() {
    return g(this, tt);
  }
  get activeSegment() {
    var t;
    return ((t = g(this, J, We).segments) == null ? void 0 : t[g(this, tt)]) ?? null;
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
    return Object.keys(g(this, de).cinematics);
  }
  switchCinematic(t) {
    if (!g(this, de).cinematics[t]) return this;
    const n = g(this, de).cinematics[t];
    return new ue(foundry.utils.deepClone(g(this, de)), {
      loadedHash: g(this, Be),
      cinematicName: t,
      segmentName: n.entry ?? "main"
    });
  }
  addCinematic(t) {
    if (!t || g(this, de).cinematics[t]) return this;
    const n = foundry.utils.deepClone(g(this, de));
    return n.cinematics[t] = ue.emptyCinematic(), new ue(n, {
      loadedHash: g(this, Be),
      cinematicName: t,
      segmentName: "main"
    });
  }
  removeCinematic(t) {
    if (Object.keys(g(this, de).cinematics).length <= 1) return this;
    if (!g(this, de).cinematics[t]) return this;
    const i = foundry.utils.deepClone(g(this, de));
    delete i.cinematics[t];
    const r = g(this, Ee) === t ? Object.keys(i.cinematics)[0] : g(this, Ee), o = i.cinematics[r];
    return new ue(i, {
      loadedHash: g(this, Be),
      cinematicName: r,
      segmentName: (o == null ? void 0 : o.entry) ?? "main"
    });
  }
  renameCinematic(t, n) {
    if (!t || !n || t === n) return this;
    if (!g(this, de).cinematics[t]) return this;
    if (g(this, de).cinematics[n]) return this;
    const i = foundry.utils.deepClone(g(this, de)), r = {};
    for (const [s, a] of Object.entries(i.cinematics))
      r[s === t ? n : s] = a;
    i.cinematics = r;
    const o = g(this, Ee) === t ? n : g(this, Ee);
    return new ue(i, {
      loadedHash: g(this, Be),
      cinematicName: o,
      segmentName: g(this, tt)
    });
  }
  // ── Cinematic-level mutations ─────────────────────────────────────────
  setTrigger(t) {
    return I(this, J, xs).call(this, { trigger: t });
  }
  setTracking(t) {
    return I(this, J, xs).call(this, { tracking: t });
  }
  setSynchronized(t) {
    return I(this, J, xs).call(this, { synchronized: t });
  }
  // ── Segment-level mutations (setup/landing now live on segments) ──────
  setSetup(t) {
    return I(this, J, Fe).call(this, { setup: t });
  }
  setLanding(t) {
    return I(this, J, Fe).call(this, { landing: t });
  }
  // ── Segment management methods ────────────────────────────────────────
  switchSegment(t) {
    var n;
    return (n = g(this, J, We).segments) != null && n[t] ? new ue(foundry.utils.deepClone(g(this, de)), {
      loadedHash: g(this, Be),
      cinematicName: g(this, Ee),
      segmentName: t
    }) : this;
  }
  addSegment(t, n = null) {
    var o;
    if (!t || (o = g(this, J, We).segments) != null && o[t]) return this;
    const i = foundry.utils.deepClone(g(this, de)), r = i.cinematics[g(this, Ee)];
    if (r.segments[t] = ue.emptySegment(), n && r.segments[n]) {
      const s = r.segments[n].next;
      r.segments[n].next = t, s && (r.segments[t].next = s);
    }
    return new ue(i, {
      loadedHash: g(this, Be),
      cinematicName: g(this, Ee),
      segmentName: t
    });
  }
  removeSegment(t) {
    var a, l;
    if (Object.keys(g(this, J, We).segments ?? {}).length <= 1) return this;
    if (!((a = g(this, J, We).segments) != null && a[t])) return this;
    const i = foundry.utils.deepClone(g(this, de)), r = i.cinematics[g(this, Ee)], o = r.segments[t].next;
    for (const [, u] of Object.entries(r.segments))
      (u.next === t || typeof u.next == "object" && ((l = u.next) == null ? void 0 : l.segment) === t) && (u.next = o ?? void 0, u.next || delete u.next);
    delete r.segments[t], r.entry === t && (r.entry = Object.keys(r.segments)[0]);
    const s = g(this, tt) === t ? r.entry : g(this, tt);
    return new ue(i, {
      loadedHash: g(this, Be),
      cinematicName: g(this, Ee),
      segmentName: s
    });
  }
  renameSegment(t, n) {
    var a, l, u;
    if (!t || !n || t === n) return this;
    if (!((a = g(this, J, We).segments) != null && a[t])) return this;
    if ((l = g(this, J, We).segments) != null && l[n]) return this;
    const i = foundry.utils.deepClone(g(this, de)), r = i.cinematics[g(this, Ee)], o = {};
    for (const [d, f] of Object.entries(r.segments))
      o[d === t ? n : d] = f;
    r.segments = o;
    for (const [, d] of Object.entries(r.segments))
      d.next === t ? d.next = n : typeof d.next == "object" && ((u = d.next) == null ? void 0 : u.segment) === t && (d.next.segment = n);
    r.entry === t && (r.entry = n);
    const s = g(this, tt) === t ? n : g(this, tt);
    return new ue(i, {
      loadedHash: g(this, Be),
      cinematicName: g(this, Ee),
      segmentName: s
    });
  }
  setSegmentGate(t) {
    return I(this, J, Fe).call(this, { gate: t ?? void 0 });
  }
  setSegmentNext(t) {
    return I(this, J, Fe).call(this, { next: t ?? void 0 });
  }
  setSegmentSetup(t) {
    return I(this, J, Fe).call(this, { setup: t });
  }
  setSegmentLanding(t) {
    return I(this, J, Fe).call(this, { landing: t });
  }
  listSegmentNames() {
    return Object.keys(g(this, J, We).segments ?? {});
  }
  // ── Timeline entry mutations (scoped to active segment) ──────────────
  addStep(t = -1) {
    const n = [...this.activeSegment.timeline], i = { duration: 1e3, tweens: [] };
    return t < 0 || t >= n.length ? n.push(i) : n.splice(t, 0, i), I(this, J, Fe).call(this, { timeline: n });
  }
  addDelay(t = -1, n = 1e3) {
    const i = [...this.activeSegment.timeline], r = { delay: n };
    return t < 0 || t >= i.length ? i.push(r) : i.splice(t, 0, r), I(this, J, Fe).call(this, { timeline: i });
  }
  addAwait(t = -1, n = null) {
    return console.warn(`[${k}] CinematicState.addAwait() is deprecated in v4. Use segment gates instead.`), this;
  }
  addEmit(t = -1, n = "") {
    const i = [...this.activeSegment.timeline], r = { emit: n };
    return t < 0 || t >= i.length ? i.push(r) : i.splice(t, 0, r), I(this, J, Fe).call(this, { timeline: i });
  }
  addParallel(t = -1) {
    const n = [...this.activeSegment.timeline], i = { parallel: { branches: [[], []], join: "all", overflow: "detach" } };
    return t < 0 || t >= n.length ? n.push(i) : n.splice(t, 0, i), I(this, J, Fe).call(this, { timeline: n });
  }
  addTransitionTo(t = -1, n = null) {
    return console.warn(`[${k}] CinematicState.addTransitionTo() is deprecated in v4. Use segment next edges instead.`), this;
  }
  addSound(t = -1, n = null) {
    const i = [...this.activeSegment.timeline], r = { sound: n ?? { src: "", volume: 0.8, loop: !1, duration: 0, fireAndForget: !1 } };
    return t < 0 || t >= i.length ? i.push(r) : i.splice(t, 0, r), I(this, J, Fe).call(this, { timeline: i });
  }
  addStopSound(t = -1, n = "") {
    const i = [...this.activeSegment.timeline], r = { stopSound: n };
    return t < 0 || t >= i.length ? i.push(r) : i.splice(t, 0, r), I(this, J, Fe).call(this, { timeline: i });
  }
  moveEntry(t, n) {
    if (t === n) return this;
    const i = [...this.activeSegment.timeline];
    if (t < 0 || t >= i.length) return this;
    if (n < 0 || n >= i.length) return this;
    const [r] = i.splice(t, 1);
    return i.splice(n, 0, r), I(this, J, Fe).call(this, { timeline: i });
  }
  removeEntry(t) {
    const n = [...this.activeSegment.timeline];
    return t < 0 || t >= n.length ? this : (n.splice(t, 1), I(this, J, Fe).call(this, { timeline: n }));
  }
  updateEntry(t, n) {
    const i = this.activeSegment.timeline.map((r, o) => o !== t ? r : { ...foundry.utils.deepClone(r), ...n });
    return I(this, J, Fe).call(this, { timeline: i });
  }
  // ── Tween mutations ──────────────────────────────────────────────────
  addTween(t, n = null) {
    const i = { type: "tile-prop", target: "", attribute: "alpha", value: 1 };
    return I(this, J, Ft).call(this, t, (r) => {
      const o = [...r.tweens ?? [], n ?? i];
      return { ...r, tweens: o };
    });
  }
  updateTween(t, n, i) {
    return I(this, J, Ft).call(this, t, (r) => {
      const o = (r.tweens ?? []).map((s, a) => a !== n ? s : { ...s, ...i });
      return { ...r, tweens: o };
    });
  }
  removeTween(t, n) {
    return I(this, J, Ft).call(this, t, (i) => {
      const r = (i.tweens ?? []).filter((o, s) => s !== n);
      return { ...i, tweens: r };
    });
  }
  updateStepDuration(t, n) {
    return I(this, J, Ft).call(this, t, (i) => ({ ...i, duration: Math.max(0, n) }));
  }
  // ── Parallel branch mutations ────────────────────────────────────────
  addBranch(t) {
    return I(this, J, Ft).call(this, t, (n) => {
      if (!n.parallel) return n;
      const i = [...n.parallel.branches, []];
      return { ...n, parallel: { ...n.parallel, branches: i } };
    });
  }
  removeBranch(t, n) {
    return I(this, J, Ft).call(this, t, (i) => {
      if (!i.parallel) return i;
      const r = i.parallel.branches.filter((o, s) => s !== n);
      return r.length < 1 ? i : { ...i, parallel: { ...i.parallel, branches: r } };
    });
  }
  addBranchEntry(t, n, i = null) {
    const r = { duration: 1e3, tweens: [] };
    return I(this, J, Ft).call(this, t, (o) => {
      if (!o.parallel) return o;
      const s = o.parallel.branches.map((a, l) => l !== n ? a : [...a, i ?? r]);
      return { ...o, parallel: { ...o.parallel, branches: s } };
    });
  }
  removeBranchEntry(t, n, i) {
    return I(this, J, Ft).call(this, t, (r) => {
      if (!r.parallel) return r;
      const o = r.parallel.branches.map((s, a) => a !== n ? s : s.filter((l, u) => u !== i));
      return { ...r, parallel: { ...r.parallel, branches: o } };
    });
  }
  updateBranchEntry(t, n, i, r) {
    return I(this, J, Ft).call(this, t, (o) => {
      if (!o.parallel) return o;
      const s = o.parallel.branches.map((a, l) => l !== n ? a : a.map((u, d) => d !== i ? u : { ...foundry.utils.deepClone(u), ...r }));
      return { ...o, parallel: { ...o.parallel, branches: s } };
    });
  }
  moveBranchEntry(t, n, i, r) {
    return i === r ? this : I(this, J, Ft).call(this, t, (o) => {
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
  async save(t) {
    const n = { ...foundry.utils.deepClone(g(this, de)), version: ql };
    await t.setFlag(k, "cinematic", n);
  }
  /** Returns the active cinematic's data (for validation/export). */
  toJSON() {
    return foundry.utils.deepClone(g(this, J, We));
  }
  /** Returns the entire v4 flag structure. */
  toFullJSON() {
    return foundry.utils.deepClone(g(this, de));
  }
};
de = new WeakMap(), Ee = new WeakMap(), tt = new WeakMap(), Be = new WeakMap(), _t = new WeakSet(), to = /* @__PURE__ */ c(function(t) {
  const { duration: n, detach: i, ...r } = t;
  return r;
}, "#stripTween"), fu = /* @__PURE__ */ c(function(t) {
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
          return I(d = ue, _t, fu).call(d, u);
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
        tweens: u.map(I(ue, _t, to))
      });
    } else if (s.length === 0) {
      const l = Math.max(500, ...a.map((f) => f.duration ?? 0)), { tweens: u, ...d } = o;
      n.push({
        ...d,
        duration: l,
        tweens: a.map(I(ue, _t, to))
      });
    } else {
      const l = Math.max(500, ...s.map((h) => h.duration ?? 0)), u = Math.max(500, ...a.map((h) => h.duration ?? 0)), { tweens: d, ...f } = o;
      n.push({
        parallel: {
          branches: [
            [{ ...f, duration: l, tweens: s.map(I(ue, _t, to)) }],
            [{ duration: u, tweens: a.map(I(ue, _t, to)) }]
          ],
          join: "all",
          overflow: "detach"
        }
      });
    }
  }
  return n;
}, "#migrateTimelineV5"), lg = /* @__PURE__ */ c(function(t) {
  return foundry.utils.deepClone(t);
}, "#computeHash"), J = new WeakSet(), We = /* @__PURE__ */ c(function() {
  return g(this, de).cinematics[g(this, Ee)];
}, "#active"), // ── Internal ─────────────────────────────────────────────────────────
/** Clone the full state with a patch to the active cinematic (cinematic-level props). */
xs = /* @__PURE__ */ c(function(t) {
  const n = foundry.utils.deepClone(g(this, de));
  return Object.assign(n.cinematics[g(this, Ee)], t), new ue(n, {
    loadedHash: g(this, Be),
    cinematicName: g(this, Ee),
    segmentName: g(this, tt)
  });
}, "#cloneActive"), /** Clone the full state with a patch to the active segment within the active cinematic. */
Fe = /* @__PURE__ */ c(function(t) {
  const n = foundry.utils.deepClone(g(this, de)), i = n.cinematics[g(this, Ee)].segments[g(this, tt)];
  if (!i) return this;
  Object.assign(i, t);
  for (const [r, o] of Object.entries(i))
    o === void 0 && delete i[r];
  return new ue(n, {
    loadedHash: g(this, Be),
    cinematicName: g(this, Ee),
    segmentName: g(this, tt)
  });
}, "#cloneActiveSegment"), /** Mutate a single timeline entry within the active segment. */
Ft = /* @__PURE__ */ c(function(t, n) {
  const i = this.activeSegment;
  if (!i || t < 0 || t >= i.timeline.length) return this;
  const r = i.timeline.map((o, s) => s !== t ? o : n(foundry.utils.deepClone(o)));
  return I(this, J, Fe).call(this, { timeline: r });
}, "#mutateEntry"), _(ue, _t), c(ue, "CinematicState");
let hn = ue;
const Sf = [
  { value: "tile-prop", label: "Tile Prop" },
  { value: "light-color", label: "Light Color" },
  { value: "light-state", label: "Light State" },
  { value: "particles-prop", label: "Particles Prop" },
  { value: "camera-pan", label: "Camera Pan" },
  { value: "token-prop", label: "Token Prop" },
  { value: "drawing-prop", label: "Drawing Prop" },
  { value: "sound-prop", label: "Sound Prop" }
], cg = {
  "tile-prop": { form: "prop", attribute: "alpha", value: 1, placeholder: "alpha, rotation, x, y, width, height" },
  "token-prop": { form: "prop", attribute: "alpha", value: 1, placeholder: "alpha, rotation, x, y" },
  "drawing-prop": { form: "prop", attribute: "alpha", value: 1, placeholder: "alpha, rotation, x, y" },
  "sound-prop": { form: "prop", attribute: "volume", value: 0.5, placeholder: "volume, radius" },
  "particles-prop": { form: "particles", attribute: "alpha", value: 1, placeholder: "alpha, rate, speed, size" },
  "camera-pan": { form: "camera", x: 0, y: 0, scale: 1 },
  "light-color": { form: "lightColor", toColor: "#ffffff", toAlpha: "", mode: "oklch" },
  "light-state": { form: "lightState", enabled: !0 }
}, nE = [
  { value: "canvasReady", label: "Canvas Ready" },
  { value: "manual", label: "Manual Only" }
];
function Cf(e) {
  return e && (e.split("/").pop() || "").replace(/\.[^.]+$/, "").replace(/[^a-zA-Z0-9_-]/g, "-") || "";
}
c(Cf, "soundIdFromPath");
function Tf(e) {
  return e ? new Promise((t) => {
    const n = new Audio(e);
    n.addEventListener("loadedmetadata", () => {
      t(Math.round(n.duration * 1e3));
    }), n.addEventListener("error", () => t(0));
  }) : Promise.resolve(0);
}
c(Tf, "loadAudioDurationMs");
const oi = 40, co = 24, To = 50, Lf = 50, Ci = 60, Ai = 10, jl = 16, ug = 40, dg = 20, iE = 90, If = 70, kf = 8;
function gl(e) {
  return { stepDuration: Math.max(500, e.duration ?? 500), detachOverflow: 0 };
}
c(gl, "computeStepDurations");
function rE(e) {
  var i;
  const t = ((i = e.parallel) == null ? void 0 : i.branches) ?? [];
  let n = 0;
  for (const r of t) {
    let o = 0;
    for (const s of r)
      s.delay != null ? o += s.delay : s.await != null || s.emit != null || (s.sound != null ? o += s.sound.fireAndForget ? 0 : s.sound.duration ?? 0 : s.stopSound != null || (o += gl(s).stepDuration));
    n = Math.max(n, o);
  }
  return Math.max(500, n);
}
c(rE, "computeParallelDuration");
function cd(e) {
  return e.reduce((t, n) => n.delay != null ? t + n.delay : n.await != null || n.emit != null || n.transitionTo != null ? t : n.sound != null ? t + (n.sound.fireAndForget ? 0 : n.sound.duration ?? 0) : n.stopSound != null ? t : n.parallel != null ? t + rE(n) : t + gl(n).stepDuration, 0);
}
c(cd, "computeTotalDuration");
function oE(e, t) {
  if (e <= 0) return 0.1;
  const n = t / e;
  return Math.max(0.03, Math.min(0.5, n));
}
c(oE, "computeScale");
function fg(e) {
  const t = e.tweens ?? [];
  if (t.length === 0) return "Empty";
  const n = t[0], i = (n.target ?? "").replace(/^tag:/, "#"), r = n.attribute ?? "";
  return n.type === "camera-pan" ? "Pan" : r === "alpha" ? `Fade ${i}` : r === "x" || r === "y" ? `Move ${i}` : n.type === "light-color" ? `Light ${i}` : n.type === "sound-prop" ? `Sound ${i}` : i ? `${i}` : "Step";
}
c(fg, "deriveStepLabel");
function sE(e, t, n, i, r) {
  var u, d;
  const o = [], s = [], a = [];
  let l = t;
  for (let f = 0; f < e.length; f++) {
    const h = e[f], m = `${i}.${f}`, p = r === m;
    if (h.delay != null) {
      const y = Math.max(dg, h.delay * n);
      o.push({ type: "delay", leftPx: l, widthPx: y, label: `${h.delay}ms`, entryPath: m, selected: p }), l += y;
    } else if (h.await != null) {
      const y = ((u = h.await) == null ? void 0 : u.event) ?? "click", E = y === "tile-click" ? "fa-hand-pointer" : y === "signal" ? "fa-bolt" : "fa-pause";
      o.push({ type: "await", leftPx: l, widthPx: jl, label: y, entryPath: m, selected: p, isGate: !0, gateIcon: E }), ((d = h.await) == null ? void 0 : d.event) === "signal" && a.push({ signal: h.await.signal, centerPx: l + jl / 2 }), l += jl;
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
      const { stepDuration: y } = gl(h), E = Math.max(ug, y * n), v = fg(h);
      o.push({ type: "step", leftPx: l, widthPx: E, label: v, entryPath: m, selected: p }), l += E;
    }
  }
  return { blocks: o, width: l - t, emits: s, awaits: a };
}
c(sE, "computeBranchLane");
function Of(e) {
  return co + e * oi;
}
c(Of, "laneIndexToY");
function aE(e, t) {
  const n = [];
  for (const i of e.emits)
    for (const r of e.awaits) {
      if (i.signal !== r.signal) continue;
      const o = i.centerPx, s = Of(i.laneIndex) + oi / 2, a = r.centerPx, l = Of(r.laneIndex) + oi / 2, u = l - s, d = (o + a) / 2, f = s + Math.sign(u || 1) * Math.min(40, Math.abs(u) * 0.5 + 20), h = l - Math.sign(u || 1) * Math.min(40, Math.abs(u) * 0.5 + 20);
      n.push({
        pathD: `M ${o} ${s} C ${d} ${f}, ${d} ${h}, ${a} ${l}`,
        signal: i.signal
      });
    }
  return n;
}
c(aE, "computeSignalArcs");
function lE(e, t) {
  const n = [];
  if (e <= 0) return n;
  const i = t * 1e3;
  let r;
  i >= 200 ? r = 500 : i >= 80 ? r = 1e3 : i >= 40 ? r = 2e3 : r = 5e3;
  for (let o = 0; o <= e + r; o += r) {
    const s = o >= 1e3 ? `${(o / 1e3).toFixed(o % 1e3 === 0 ? 0 : 1)}s` : `${o}ms`;
    n.push({ px: To + o * t, label: s });
  }
  return n;
}
c(lE, "computeTimeMarkers");
function cE(e) {
  const t = [];
  for (let n = 0; n < e.length - 1; n++) {
    const i = e[n], r = e[n + 1], o = i.leftPx + i.widthPx + (r.leftPx - (i.leftPx + i.widthPx)) / 2, s = co + oi / 2;
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
    t.push({ leftPx: o, topPx: s, insertIndex: a, lane: "main", isEnd: l });
  }
  return t;
}
c(cE, "computeInsertionPoints");
function uE(e, { selectedPath: t, windowWidth: n }) {
  const i = cd(e), r = n - 70 - 100, o = oE(i, r), s = [], a = [], l = { emits: [], awaits: [] }, u = [];
  s.push({
    type: "setup",
    leftPx: 0,
    widthPx: To,
    label: "Setup",
    entryPath: "setup",
    selected: t === "setup"
  });
  let d = To;
  for (let b = 0; b < e.length; b++) {
    const w = e[b], S = `timeline.${b}`, T = t === S;
    if (w.delay != null) {
      const L = Math.max(dg, w.delay * o);
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
        const x = `timeline.${b}.parallel.branches.${$}`, { blocks: R, width: P, emits: j, awaits: q } = sE(L[$], A, o, x, t);
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
      const { stepDuration: L } = gl(w), A = Math.max(ug, L * o), M = fg(w);
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
    widthPx: Lf,
    label: "Landing",
    entryPath: "landing",
    selected: t === "landing"
  }), d += Lf;
  const f = a.flatMap((b) => b.lanes), h = f.length;
  for (const b of u)
    f.push({ label: b.label, blocks: b.blocks });
  const m = aE(l, f.length), p = [];
  for (let b = 0; b < u.length; b++) {
    const w = h + b;
    for (const S of u[b].blocks) {
      const T = S.leftPx, L = co + oi, A = co + (1 + w) * oi + oi / 2;
      p.push({ x: T, y1: L, y2: A });
    }
  }
  const y = lE(i, o), E = cE(s), v = co + (1 + f.length) * oi;
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
c(uE, "computeLanes");
function dE(e) {
  if (e <= 0) return "0s";
  if (e < 1e3) return `${e}ms`;
  const t = e / 1e3;
  return t % 1 === 0 ? `${t}s` : `${t.toFixed(1)}s`;
}
c(dE, "formatDuration");
function fE(e, t) {
  var m, p, y, E;
  const n = e.segments ?? {}, i = e.entry ?? "main", r = Object.keys(n);
  if (r.length === 0)
    return { nodes: [], edges: [], totalWidthPx: 0 };
  const o = /* @__PURE__ */ new Set(), s = [];
  let a = i;
  for (; a && typeof a == "string" && n[a] && !o.has(a); )
    o.add(a), s.push(a), a = n[a].next;
  for (const v of r)
    o.has(v) || s.push(v);
  const l = [];
  let u = kf;
  for (const v of s) {
    const b = n[v], w = cd(b.timeline ?? []), S = dE(w), T = v === i, L = v === t, A = !o.has(v), M = iE;
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
    }), u += M + If;
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
  const h = u - If + kf;
  return { nodes: l, edges: d, totalWidthPx: h };
}
c(fE, "computeSegmentGraph");
function fi(e) {
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
c(fi, "parseEntryPath");
function ia(e, t) {
  var i, r, o, s;
  const n = fi(e);
  return n ? n.type === "setup" ? t.setup : n.type === "landing" ? t.landing : n.type === "timeline" ? t.timeline[n.index] : n.type === "branch" ? (s = (o = (r = (i = t.timeline[n.index]) == null ? void 0 : i.parallel) == null ? void 0 : r.branches) == null ? void 0 : o[n.branchIndex]) == null ? void 0 : s[n.branchEntryIndex] : null : null;
}
c(ia, "getEntryAtPath");
function Af(e) {
  const t = fi(e);
  return !t || t.type !== "timeline" ? null : t.index;
}
c(Af, "getTimelineIndexFromPath");
function hE(e) {
  var o, s;
  const t = /* @__PURE__ */ new Set(), i = (o = e.data.cinematics) == null ? void 0 : o[e.activeCinematicName];
  if (!i) return 0;
  function r(a) {
    var l;
    for (const u of a ?? []) {
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
    for (const a of Object.values(i.segments)) {
      if (a.setup) for (const l of Object.keys(a.setup)) t.add(l);
      if (a.landing) for (const l of Object.keys(a.landing)) t.add(l);
      (s = a.gate) != null && s.target && t.add(a.gate.target), r(a.timeline);
    }
  else {
    if (i.setup) for (const a of Object.keys(i.setup)) t.add(a);
    if (i.landing) for (const a of Object.keys(i.landing)) t.add(a);
    r(i.timeline);
  }
  return t.size;
}
c(hE, "countUniqueTargets");
function mE(e, t) {
  var i, r, o;
  const n = fi(e);
  if (!n) return 0;
  if (n.type === "timeline") {
    let s = 0;
    for (let a = 0; a <= n.index; a++) {
      const l = t.timeline[a];
      l && l.delay == null && l.emit == null && l.parallel == null && l.sound == null && l.stopSound == null && s++;
    }
    return s;
  }
  if (n.type === "branch") {
    const s = ((o = (r = (i = t.timeline[n.index]) == null ? void 0 : i.parallel) == null ? void 0 : r.branches) == null ? void 0 : o[n.branchIndex]) ?? [];
    let a = 0;
    for (let l = 0; l <= n.branchEntryIndex; l++) {
      const u = s[l];
      u && u.delay == null && u.emit == null && u.sound == null && u.stopSound == null && a++;
    }
    return a;
  }
  return 0;
}
c(mE, "stepNumberForPath");
function gE(e) {
  return {
    isSetup: !0,
    targetCount: Object.keys(e.setup ?? {}).length
  };
}
c(gE, "buildSetupDetail");
function pE(e) {
  return {
    isLanding: !0,
    targetCount: Object.keys(e.landing ?? {}).length
  };
}
c(pE, "buildLandingDetail");
function yE(e) {
  return { type: "delay", isDelay: !0, delay: e.delay };
}
c(yE, "buildDelayDetail");
function bE(e) {
  return { type: "emit", isEmit: !0, signal: e.emit };
}
c(bE, "buildEmitDetail");
function vE(e) {
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
c(vE, "buildSoundDetail");
function wE(e) {
  return {
    type: "stopSound",
    isStopSound: !0,
    stopSoundId: e.stopSound
  };
}
c(wE, "buildStopSoundDetail");
function EE(e, t) {
  var s;
  const n = e.parallel, i = n.join ?? "all", r = n.overflow ?? "detach", o = (n.branches ?? []).map((a, l) => ({
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
c(EE, "buildParallelDetail");
function SE(e, t, n, i) {
  const r = rd(), o = (e.tweens ?? []).map((l, u) => {
    const d = `${t}.tweens.${u}`, f = n.has(d), h = l.type ?? "tile-prop", m = Sf.find((v) => v.value === h), p = cg[h], y = (p == null ? void 0 : p.form) ?? "prop", E = l.mode ?? "oklch";
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
      typeOptions: Sf.map((v) => ({
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
  }), s = Object.keys(e.before ?? {}), a = Object.keys(e.after ?? {});
  return {
    type: "step",
    isStep: !0,
    isDelay: !1,
    stepNumber: mE(t, i),
    stepDuration: e.duration ?? 1e3,
    tweens: o,
    beforeSummary: s.length ? `${s.length} target${s.length !== 1 ? "s" : ""}` : "(none)",
    afterSummary: a.length ? `${a.length} target${a.length !== 1 ? "s" : ""}` : "(none)"
  };
}
c(SE, "buildStepDetail");
function CE(e, { state: t, expandedTweens: n }) {
  const i = fi(e);
  if (!i) return null;
  if (i.type === "setup") return gE(t);
  if (i.type === "landing") return pE(t);
  const r = ia(e, t);
  return r ? r.delay != null ? yE(r) : r.emit != null ? bE(r) : r.sound != null ? vE(r) : r.stopSound != null ? wE(r) : r.parallel != null && i.type === "timeline" ? EE(r) : SE(r, e, n, t) : null;
}
c(CE, "buildDetail");
function TE({ state: e, mutate: t }) {
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
              t(() => new hn(l));
            else if (l.segments !== void 0) {
              const u = { version: 4, cinematics: { [e.activeCinematicName]: l } };
              t(() => new hn(u, { cinematicName: e.activeCinematicName }));
            } else if (l.timeline !== void 0) {
              const u = { version: 3, cinematics: { [e.activeCinematicName]: l } };
              t(() => new hn(u, { cinematicName: e.activeCinematicName }));
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
c(TE, "showImportDialog");
function ra(e, { state: t, mutate: n }) {
  const i = e === "setup" ? t.setup : t.landing, r = JSON.stringify(i ?? {}, null, 2);
  new Dialog({
    title: `Edit ${e.charAt(0).toUpperCase() + e.slice(1)}`,
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
            n(e === "setup" ? (d) => d.setSetup(u) : (d) => d.setLanding(u));
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
c(ra, "showEditJsonDialog");
function Mf(e, { selectedPath: t, state: n, mutate: i }) {
  const r = ia(t, n);
  if (!r || r.delay != null) return;
  const o = r[e] ?? {}, s = JSON.stringify(o, null, 2);
  new Dialog({
    title: `Edit Step ${e.charAt(0).toUpperCase() + e.slice(1)}`,
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
            const f = JSON.parse(l), h = fi(t);
            (h == null ? void 0 : h.type) === "timeline" ? i((m) => m.updateEntry(h.index, { [e]: f })) : (h == null ? void 0 : h.type) === "branch" && i((m) => m.updateBranchEntry(h.index, h.branchIndex, h.branchEntryIndex, { [e]: f }));
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
c(Mf, "showEditStepStateDialog");
function LE({ selectedPath: e, state: t, mutate: n }) {
  const i = fi(e);
  if (!i || i.type !== "timeline") return;
  const r = t.timeline[i.index];
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
c(LE, "showEditParallelJsonDialog");
var fh, zn, li, _s, hg;
const Pt = class Pt extends yt(pt) {
  constructor(n = {}) {
    super(n);
    _(this, li);
    _(this, zn, null);
    O(this, zn, n.scene ?? canvas.scene ?? null);
  }
  async _prepareContext() {
    var r, o, s;
    const n = g(this, li, _s), i = ((o = n == null ? void 0 : n.getSeenStatus) == null ? void 0 : o.call(n, (r = g(this, zn)) == null ? void 0 : r.id)) ?? [];
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
    super._onRender(n, i), I(this, li, hg).call(this);
  }
};
zn = new WeakMap(), li = new WeakSet(), _s = /* @__PURE__ */ c(function() {
  var n, i;
  return (i = (n = game.modules.get(k)) == null ? void 0 : n.api) == null ? void 0 : i.cinematic;
}, "#api"), hg = /* @__PURE__ */ c(function() {
  var i, r;
  const n = this.element;
  n instanceof HTMLElement && (n.querySelectorAll("[data-action='reset-user']").forEach((o) => {
    o.addEventListener("click", async () => {
      var l;
      const s = o.dataset.userId;
      if (!s) return;
      const a = g(this, li, _s);
      a != null && a.resetForUser && (await a.resetForUser((l = g(this, zn)) == null ? void 0 : l.id, s), this.render({ force: !0 }));
    });
  }), (i = n.querySelector("[data-action='reset-all']")) == null || i.addEventListener("click", async () => {
    var s;
    const o = g(this, li, _s);
    o != null && o.resetForAll && (await o.resetForAll((s = g(this, zn)) == null ? void 0 : s.id), this.render({ force: !0 }));
  }), (r = n.querySelector("[data-action='refresh']")) == null || r.addEventListener("click", () => {
    this.render({ force: !0 });
  }));
}, "#bindEvents"), c(Pt, "CinematicTrackingApplication"), se(Pt, "APP_ID", `${k}-cinematic-tracking`), se(Pt, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  ye(Pt, Pt, "DEFAULT_OPTIONS"),
  {
    id: Pt.APP_ID,
    classes: Array.from(
      /* @__PURE__ */ new Set([...((fh = ye(Pt, Pt, "DEFAULT_OPTIONS")) == null ? void 0 : fh.classes) ?? [], "eidolon-cinematic-tracking-window", "themed"])
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
let hu = Pt;
function IE(e, t) {
  var n, i, r, o, s, a, l, u, d;
  (n = e.querySelector("[data-action='save']")) == null || n.addEventListener("click", () => t.save()), (i = e.querySelector("[data-action='play-preview']")) == null || i.addEventListener("click", () => t.play()), (r = e.querySelector("[data-action='reset-tracking']")) == null || r.addEventListener("click", () => t.resetTracking()), (o = e.querySelector("[data-action='export-json']")) == null || o.addEventListener("click", () => t.exportJSON()), (s = e.querySelector("[data-action='undo']")) == null || s.addEventListener("click", () => t.undo()), (a = e.querySelector("[data-action='redo']")) == null || a.addEventListener("click", () => t.redo()), (l = e.querySelector("[data-action='validate']")) == null || l.addEventListener("click", () => t.validate()), (u = e.querySelector("[data-action='import-json']")) == null || u.addEventListener("click", () => t.importJSON()), (d = e.querySelector("[data-action='open-tracking']")) == null || d.addEventListener("click", () => {
    new hu({ scene: t.scene }).render(!0);
  });
}
c(IE, "bindToolbarEvents");
function kE(e, t) {
  var n, i, r, o;
  (n = e.querySelector("[data-action='change-cinematic']")) == null || n.addEventListener("change", (s) => {
    t.flushTweenChanges(), t.switchCinematic(s.target.value);
  }), (i = e.querySelector("[data-action='add-cinematic']")) == null || i.addEventListener("click", () => {
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
            if (t.state.listCinematicNames().includes(a)) {
              (p = (m = ui.notifications) == null ? void 0 : m.warn) == null || p.call(m, "Name already exists.");
              return;
            }
            t.mutate((y) => y.addCinematic(a));
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
    const a = t.state.activeCinematicName;
    new Dialog({
      title: "Remove Cinematic",
      content: `<p>Remove cinematic "${a}"? This cannot be undone after saving.</p>`,
      buttons: {
        ok: {
          label: "Remove",
          callback: /* @__PURE__ */ c(() => {
            t.setSelectedPath(null), t.mutate((d) => d.removeCinematic(a));
          }, "callback")
        },
        cancel: { label: "Cancel" }
      },
      default: "cancel"
    }).render(!0);
  }), (o = e.querySelector("[data-action='rename-cinematic']")) == null || o.addEventListener("click", () => {
    const s = t.state.activeCinematicName;
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
              if (t.state.listCinematicNames().includes(l)) {
                (y = (p = ui.notifications) == null ? void 0 : p.warn) == null || y.call(p, "Name already exists.");
                return;
              }
              t.mutate((E) => E.renameCinematic(s, l));
            }
          }, "callback")
        },
        cancel: { label: "Cancel" }
      },
      default: "ok"
    }).render(!0);
  });
}
c(kE, "bindCinematicSelectorEvents");
function OE(e, t) {
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
      const s = i.dataset.entryPath;
      if (n && n !== s) {
        const a = Af(n), l = Af(s);
        a != null && l != null && (t.selectedPath === n && t.setSelectedPath(s), t.mutate((u) => u.moveEntry(a, l)));
      }
      n = null;
    }), i.addEventListener("dragend", () => {
      i.classList.remove("dragging"), n = null;
    }));
  }), e.querySelectorAll("[data-action='show-insert-menu']").forEach((i) => {
    i.addEventListener("click", (r) => {
      r.stopPropagation();
      const o = Number(i.dataset.insertIndex), s = i.dataset.lane;
      t.showInsertMenu(i, o, s);
    });
  }), e.querySelectorAll("[data-action='insert-entry']").forEach((i) => {
    i.addEventListener("click", () => {
      if (!t.insertMenuState) return;
      const r = i.dataset.insertType, { insertIndex: o } = t.insertMenuState;
      switch (r) {
        case "step":
          t.mutate((s) => s.addStep(o));
          break;
        case "delay":
          t.mutate((s) => s.addDelay(o));
          break;
        case "emit":
          t.mutate((s) => s.addEmit(o));
          break;
        case "parallel":
          t.mutate((s) => s.addParallel(o));
          break;
        case "sound":
          t.mutate((s) => s.addSound(o));
          break;
        case "stopSound":
          t.mutate((s) => s.addStopSound(o));
          break;
      }
      t.hideInsertMenu();
    });
  }), document.addEventListener("click", (i) => {
    t.insertMenuState && !i.target.closest(".cinematic-editor__insert-menu") && !i.target.closest("[data-action='show-insert-menu']") && t.hideInsertMenu();
  });
}
c(OE, "bindSwimlaneEvents");
function AE(e, t) {
  var n, i, r, o, s, a, l, u, d, f, h;
  (n = e.querySelector("[data-action='delete-entry']")) == null || n.addEventListener("click", () => {
    const m = t.parseEntryPath(t.selectedPath);
    m && (m.type === "timeline" ? (t.mutate((p) => p.removeEntry(m.index)), t.setSelectedPath(null)) : m.type === "branch" && (t.mutate((p) => p.removeBranchEntry(m.index, m.branchIndex, m.branchEntryIndex)), t.setSelectedPath(null)));
  }), (i = e.querySelector("[data-action='step-duration']")) == null || i.addEventListener("input", (m) => {
    const p = t.parseEntryPath(t.selectedPath);
    if (!p) return;
    const y = Number(m.target.value) || 0;
    p.type === "timeline" ? t.mutate((E) => E.updateStepDuration(p.index, y)) : p.type === "branch" && t.mutate((E) => E.updateBranchEntry(p.index, p.branchIndex, p.branchEntryIndex, { duration: Math.max(0, y) }));
  }), (r = e.querySelector("[data-action='add-tween']")) == null || r.addEventListener("click", () => {
    const m = t.parseEntryPath(t.selectedPath);
    if (m) {
      if (m.type === "timeline")
        t.mutate((p) => p.addTween(m.index));
      else if (m.type === "branch") {
        const p = t.getEntryAtPath(t.selectedPath);
        if (!p) return;
        const y = { type: "tile-prop", target: "", attribute: "alpha", value: 1 }, E = [...p.tweens ?? [], y];
        t.mutate((v) => v.updateBranchEntry(m.index, m.branchIndex, m.branchEntryIndex, { tweens: E }));
      }
    }
  }), (o = e.querySelector("[data-action='change-delay']")) == null || o.addEventListener("change", (m) => {
    const p = t.parseEntryPath(t.selectedPath);
    if (!p) return;
    const y = Number(m.target.value) || 0;
    p.type === "timeline" ? t.mutate((E) => E.updateEntry(p.index, { delay: y })) : p.type === "branch" && t.mutate((E) => E.updateBranchEntry(p.index, p.branchIndex, p.branchEntryIndex, { delay: y }));
  }), (s = e.querySelector("[data-action='edit-setup']")) == null || s.addEventListener("click", () => {
    ra("setup", { state: t.state, mutate: t.mutate });
  }), (a = e.querySelector("[data-action='edit-landing']")) == null || a.addEventListener("click", () => {
    ra("landing", { state: t.state, mutate: t.mutate });
  }), (l = e.querySelector("[data-action='edit-before']")) == null || l.addEventListener("click", () => {
    Mf("before", { selectedPath: t.selectedPath, state: t.state, mutate: t.mutate });
  }), (u = e.querySelector("[data-action='edit-after']")) == null || u.addEventListener("click", () => {
    Mf("after", { selectedPath: t.selectedPath, state: t.state, mutate: t.mutate });
  }), (d = e.querySelector("[data-action='change-trigger']")) == null || d.addEventListener("change", (m) => {
    t.mutate((p) => p.setTrigger(m.target.value));
  }), (f = e.querySelector("[data-action='change-tracking']")) == null || f.addEventListener("change", (m) => {
    t.mutate((p) => p.setTracking(m.target.checked));
  }), (h = e.querySelector("[data-action='change-synchronized']")) == null || h.addEventListener("change", (m) => {
    t.mutate((p) => p.setSynchronized(m.target.checked));
  });
}
c(AE, "bindDetailPanelEvents");
const Nr = /* @__PURE__ */ new WeakMap(), oa = /* @__PURE__ */ new Set(), sa = /* @__PURE__ */ new Set(), xf = {
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
function aa(e, t = {}) {
  var p, y, E;
  if (!e) return !1;
  $r(e);
  const n = t.mode ?? (t.color != null ? "custom" : "hover"), i = xf[n] ?? xf.hover, r = t.color ?? i.borderColor, o = t.alpha ?? i.borderAlpha, s = t.color ?? i.spriteTint, a = i.spriteAlpha, l = t.pulse ?? i.pulse, u = { border: null, sprite: null, pulseData: null, mode: n }, d = ((p = e.document) == null ? void 0 : p.width) ?? e.w ?? 100, f = ((y = e.document) == null ? void 0 : y.height) ?? e.h ?? 100, h = new PIXI.Graphics();
  h.lineStyle(i.borderWidth, r, o), h.drawRect(0, 0, d, f), e.addChild(h), u.border = h;
  const m = ME(e, s, a);
  if (m && (canvas.controls.debug.addChild(m), sa.add(m), u.sprite = m), l && ((E = canvas.app) != null && E.ticker)) {
    const v = {
      elapsed: 0,
      fn: /* @__PURE__ */ c((b) => {
        v.elapsed += b;
        const w = (Math.sin(v.elapsed * 0.05) + 1) / 2;
        u.border && (u.border.alpha = o * (0.4 + 0.6 * w)), u.sprite && (u.sprite.alpha = a * (0.5 + 0.5 * w));
      }, "fn")
    };
    canvas.app.ticker.add(v.fn), u.pulseData = v, oa.add(v);
  }
  return Nr.set(e, u), !0;
}
c(aa, "addHighlight");
function $r(e) {
  var n, i;
  if (!e) return;
  const t = Nr.get(e);
  t && (t.pulseData && ((i = (n = canvas.app) == null ? void 0 : n.ticker) == null || i.remove(t.pulseData.fn), oa.delete(t.pulseData)), t.border && (t.border.parent && t.border.parent.removeChild(t.border), t.border.destroy({ children: !0 })), t.sprite && (t.sprite.parent && t.sprite.parent.removeChild(t.sprite), t.sprite.destroy({ children: !0 }), sa.delete(t.sprite)), Nr.delete(e));
}
c($r, "removeHighlight");
function mg(e) {
  return Nr.has(e);
}
c(mg, "hasHighlight");
function Ns() {
  var t, n, i, r, o, s, a;
  for (const l of oa)
    (n = (t = canvas.app) == null ? void 0 : t.ticker) == null || n.remove(l.fn);
  oa.clear();
  for (const l of sa)
    l.parent && l.parent.removeChild(l), l.destroy({ children: !0 });
  sa.clear();
  const e = [
    (i = canvas.tiles) == null ? void 0 : i.placeables,
    (r = canvas.tokens) == null ? void 0 : r.placeables,
    (o = canvas.lighting) == null ? void 0 : o.placeables,
    (s = canvas.drawings) == null ? void 0 : s.placeables,
    (a = canvas.sounds) == null ? void 0 : a.placeables
  ];
  for (const l of e)
    if (l)
      for (const u of l) {
        const d = Nr.get(u);
        d && (d.border && (d.border.parent && d.border.parent.removeChild(d.border), d.border.destroy({ children: !0 })), Nr.delete(u));
      }
}
c(Ns, "clearAllHighlights");
function ME(e, t, n) {
  var o;
  const i = e.mesh;
  if (!((o = i == null ? void 0 : i.texture) != null && o.baseTexture)) return null;
  const r = PIXI.Sprite.from(i.texture);
  return r.isSprite = !0, r.anchor.set(i.anchor.x, i.anchor.y), r.width = i.width, r.height = i.height, r.scale = i.scale, r.position = e.center, r.angle = i.angle, r.alpha = n, r.tint = t, r.name = "eidolonPickerHighlight", r;
}
c(ME, "createTintSprite");
let Ti = null;
function gg(e) {
  var p, y, E;
  Ti && Ti.cancel();
  const { placeableType: t = "Tile", onPick: n, onCancel: i } = e;
  let r = null;
  const o = `control${t}`, s = `hover${t}`, a = /* @__PURE__ */ c((v, b) => {
    var S;
    if (!b) return;
    const w = v.document ?? v;
    (S = v.release) == null || S.call(v), n(w);
  }, "onControl"), l = /* @__PURE__ */ c((v, b) => {
    b ? (r = v, aa(v, { mode: "pick" })) : r === v && ($r(v), r = null);
  }, "onHoverIn"), u = /* @__PURE__ */ c((v) => {
    v.key === "Escape" && (v.preventDefault(), v.stopPropagation(), m());
  }, "onKeydown"), d = /* @__PURE__ */ c((v) => {
    v.preventDefault(), m();
  }, "onContextMenu"), f = Hooks.on(o, a), h = Hooks.on(s, l);
  document.addEventListener("keydown", u, { capture: !0 }), (p = canvas.stage) == null || p.addEventListener("rightclick", d), (E = (y = ui.notifications) == null ? void 0 : y.info) == null || E.call(y, `Pick mode active — click a ${t.toLowerCase()} on the canvas, or press ESC to cancel.`, { permanent: !1 });
  function m() {
    var v;
    Ti && (Ti = null, Hooks.off(o, f), Hooks.off(s, h), document.removeEventListener("keydown", u, { capture: !0 }), (v = canvas.stage) == null || v.removeEventListener("rightclick", d), r && ($r(r), r = null), i == null || i());
  }
  return c(m, "cancel"), Ti = { cancel: m }, { cancel: m };
}
c(gg, "enterPickMode");
function no() {
  Ti && Ti.cancel();
}
c(no, "cancelPickMode");
const xE = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  cancelPickMode: no,
  enterPickMode: gg
}, Symbol.toStringTag, { value: "Module" }));
var hh, Ue, nt, Go, Yn, Wo, zo, dt, Kn, ve, pg, mu, yg, bg, vg, gu, pu, wg, Eg;
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
    _(this, Ue, []);
    /** @type {boolean} Whether pick mode is active. */
    _(this, nt, !1);
    /** @type {string} Placeable type (Tile, Token, etc.). */
    _(this, Go, "Tile");
    /** @type {string} Current tag match mode. */
    _(this, Yn, "any");
    /** @type {((selectors: string[]) => void) | null} */
    _(this, Wo, null);
    /** @type {(() => void) | null} */
    _(this, zo, null);
    /** @type {Promise resolve function for the open() API. */
    _(this, dt, null);
    /** @type {PlaceableObject | null} Currently hovered tile in the browser. */
    _(this, Kn, null);
    O(this, Ue, [...n.selections ?? []]), O(this, Go, n.placeableType ?? "Tile"), O(this, Wo, n.onApply ?? null), O(this, zo, n.onCancel ?? null);
  }
  // ── Context ───────────────────────────────────────────────────────────
  async _prepareContext() {
    var r;
    const n = I(this, ve, gu).call(this), i = (((r = canvas.tiles) == null ? void 0 : r.placeables) ?? []).map((o, s) => {
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
      selections: g(this, Ue),
      selectionCount: g(this, Ue).length,
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
    super._onRender(n, i), I(this, ve, pg).call(this), I(this, ve, pu).call(this);
  }
  async _onClose(n) {
    return g(this, nt) && (no(), O(this, nt, !1)), Ns(), g(this, dt) && (g(this, dt).call(this, null), O(this, dt, null)), super._onClose(n);
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
Ue = new WeakMap(), nt = new WeakMap(), Go = new WeakMap(), Yn = new WeakMap(), Wo = new WeakMap(), zo = new WeakMap(), dt = new WeakMap(), Kn = new WeakMap(), ve = new WeakSet(), pg = /* @__PURE__ */ c(function() {
  var o, s, a, l;
  const n = this.element;
  if (!(n instanceof HTMLElement)) return;
  const i = n.querySelector("[data-role='tag-input']"), r = n.querySelector("[data-role='tag-mode']");
  r == null || r.addEventListener("change", (u) => {
    O(this, Yn, u.target.value);
  }), i == null || i.addEventListener("input", () => {
    I(this, ve, yg).call(this, n);
  }), i == null || i.addEventListener("keydown", (u) => {
    u.key === "Enter" && (u.preventDefault(), I(this, ve, mu).call(this, n));
  }), (o = n.querySelector("[data-action='add-tag-selector']")) == null || o.addEventListener("click", () => {
    I(this, ve, mu).call(this, n);
  }), (s = n.querySelector("[data-action='toggle-pick-mode']")) == null || s.addEventListener("click", () => {
    g(this, nt) ? (no(), O(this, nt, !1)) : (O(this, nt, !0), gg({
      placeableType: g(this, Go),
      onPick: /* @__PURE__ */ c((u) => {
        I(this, ve, bg).call(this, u.id);
      }, "onPick"),
      onCancel: /* @__PURE__ */ c(() => {
        O(this, nt, !1), this.render({ force: !0 });
      }, "onCancel")
    })), this.render({ force: !0 });
  }), n.querySelectorAll("[data-action='toggle-tile']").forEach((u) => {
    u.addEventListener("click", () => {
      const d = u.dataset.docId;
      d && I(this, ve, vg).call(this, d);
    }), u.addEventListener("mouseenter", () => {
      var h, m;
      const d = u.dataset.docId;
      if (!d) return;
      const f = (m = (h = canvas.tiles) == null ? void 0 : h.placeables) == null ? void 0 : m.find((p) => p.document.id === d);
      f && (O(this, Kn, f), aa(f, { mode: "hover" }));
    }), u.addEventListener("mouseleave", () => {
      g(this, Kn) && ($r(g(this, Kn)), O(this, Kn, null), I(this, ve, pu).call(this));
    });
  }), n.querySelectorAll("[data-action='remove-selection']").forEach((u) => {
    u.addEventListener("click", () => {
      const d = Number(u.dataset.selectionIndex);
      Number.isNaN(d) || (g(this, Ue).splice(d, 1), this.render({ force: !0 }));
    });
  }), (a = n.querySelector("[data-action='apply']")) == null || a.addEventListener("click", () => {
    I(this, ve, wg).call(this);
  }), (l = n.querySelector("[data-action='cancel']")) == null || l.addEventListener("click", () => {
    I(this, ve, Eg).call(this);
  });
}, "#bindEvents"), // ── Tag helpers ───────────────────────────────────────────────────────
mu = /* @__PURE__ */ c(function(n) {
  var a;
  const i = n.querySelector("[data-role='tag-input']"), r = (a = i == null ? void 0 : i.value) == null ? void 0 : a.trim();
  if (!r) return;
  const o = r.split(",").map((l) => l.trim()).filter(Boolean);
  if (o.length === 0) return;
  const s = ig(o, g(this, Yn));
  s && !g(this, Ue).includes(s) && g(this, Ue).push(s), i && (i.value = ""), this.render({ force: !0 });
}, "#addTagSelector"), yg = /* @__PURE__ */ c(function(n) {
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
bg = /* @__PURE__ */ c(function(n) {
  const i = `id:${n}`;
  g(this, Ue).includes(i) || (g(this, Ue).push(i), this.render({ force: !0 }));
}, "#addIdSelector"), vg = /* @__PURE__ */ c(function(n) {
  const i = `id:${n}`, r = g(this, Ue).indexOf(i);
  r >= 0 ? g(this, Ue).splice(r, 1) : g(this, Ue).push(i), this.render({ force: !0 });
}, "#toggleIdSelector"), /**
 * Get the set of document IDs that are currently selected across all selector types.
 * Resolves tag/tags-any/tags-all selectors to find matching document IDs.
 * @returns {Set<string>}
 */
gu = /* @__PURE__ */ c(function() {
  const n = /* @__PURE__ */ new Set();
  for (const i of g(this, Ue)) {
    const r = ld(i);
    if (r.type === "id") {
      n.add(r.value);
      continue;
    }
    const o = ml(i);
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
pu = /* @__PURE__ */ c(function() {
  var r, o;
  const n = I(this, ve, gu).call(this), i = ((r = canvas.tiles) == null ? void 0 : r.placeables) ?? [];
  for (const s of i) {
    const a = (o = s.document) == null ? void 0 : o.id;
    if (!a) continue;
    const l = n.has(a), u = s === g(this, Kn), d = mg(s);
    l && !u && !d ? aa(s, { mode: "selected" }) : !l && d && !u && $r(s);
  }
}, "#refreshSelectionHighlights"), // ── Apply / Cancel ──────────────────────────────────────────────────
wg = /* @__PURE__ */ c(function() {
  var i;
  g(this, nt) && (no(), O(this, nt, !1)), Ns();
  const n = [...g(this, Ue)];
  (i = g(this, Wo)) == null || i.call(this, n), g(this, dt) && (g(this, dt).call(this, n), O(this, dt, null)), this.close({ force: !0 });
}, "#doApply"), Eg = /* @__PURE__ */ c(function() {
  var n;
  g(this, nt) && (no(), O(this, nt, !1)), Ns(), (n = g(this, zo)) == null || n.call(this), g(this, dt) && (g(this, dt).call(this, null), O(this, dt, null)), this.close({ force: !0 });
}, "#doCancel"), c(Lt, "PlaceablePickerApplication"), se(Lt, "APP_ID", `${k}-placeable-picker`), se(Lt, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  ye(Lt, Lt, "DEFAULT_OPTIONS"),
  {
    id: Lt.APP_ID,
    classes: Array.from(
      /* @__PURE__ */ new Set([...((hh = ye(Lt, Lt, "DEFAULT_OPTIONS")) == null ? void 0 : hh.classes) ?? [], "eidolon-placeable-picker-window", "themed"])
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
let la = Lt;
function _E(e, t) {
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
      const o = t.getEntryAtPath(t.selectedPath), s = ((d = (u = o == null ? void 0 : o.tweens) == null ? void 0 : u[i]) == null ? void 0 : d.target) ?? "", a = s ? [s] : [], l = await la.open({ selections: a });
      if (l && l.length > 0) {
        if (r.type === "timeline")
          t.mutate((f) => f.updateTween(r.index, i, { target: l[0] }));
        else if (r.type === "branch") {
          const f = (o.tweens ?? []).map((h, m) => m === i ? { ...h, target: l[0] } : h);
          t.mutate((h) => h.updateBranchEntry(r.index, r.branchIndex, r.branchEntryIndex, { tweens: f }));
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
          const s = (o.tweens ?? []).filter((a, l) => l !== i);
          t.mutate((a) => a.updateBranchEntry(r.index, r.branchIndex, r.branchEntryIndex, { tweens: s }));
        }
      }
    });
  }), e.querySelectorAll(".cinematic-editor__tween-card-body").forEach((n) => {
    const i = Number(n.dataset.tweenIndex);
    n.querySelectorAll("[data-field]").forEach((r) => {
      const o = r.dataset.field, s = r.tagName === "SELECT" || r.type === "checkbox" ? "change" : "input";
      r.addEventListener(s, () => {
        let a;
        if (r.type === "checkbox" ? a = r.checked : o === "x" || o === "y" || o === "scale" || o === "toAlpha" ? a = r.value.trim() === "" ? "" : Number(r.value) || 0 : o === "value" && !Number.isNaN(Number(r.value)) && r.value.trim() !== "" ? a = Number(r.value) : a = r.value, o === "type") {
          const l = cg[a], u = { type: a };
          if (l) {
            const d = l.form ?? "prop";
            d === "prop" || d === "particles" ? Object.assign(u, { attribute: l.attribute, value: l.value }) : d === "camera" ? Object.assign(u, { x: l.x, y: l.y, scale: l.scale }) : d === "lightColor" ? Object.assign(u, { toColor: l.toColor, toAlpha: l.toAlpha, mode: l.mode }) : d === "lightState" && Object.assign(u, { enabled: l.enabled });
          }
          t.queueTweenChange(i, u), t.flushTweenChangesImmediate(), t.render();
        } else
          t.queueTweenChange(i, { [o]: a });
      });
    });
  });
}
c(_E, "bindTweenFieldEvents");
function NE(e, t) {
  var i, r, o, s, a, l, u, d, f, h;
  function n(m, p, y) {
    m.type === "timeline" ? t.mutate((E) => E.updateEntry(m.index, { sound: y })) : m.type === "branch" && t.mutate((E) => E.updateBranchEntry(m.index, m.branchIndex, m.branchEntryIndex, { sound: y }));
  }
  c(n, "applySoundPatch"), (i = e.querySelector("[data-action='change-sound-src']")) == null || i.addEventListener("change", async (m) => {
    const p = t.parseEntryPath(t.selectedPath);
    if (!p) return;
    const y = t.getEntryAtPath(t.selectedPath);
    if (!(y != null && y.sound)) return;
    const E = m.target.value, v = { ...y.sound, src: E };
    v.id || (v.id = Cf(E));
    const b = await Tf(E);
    b > 0 && (v.duration = b), n(p, y, v);
  }), (r = e.querySelector("[data-action='pick-sound-src']")) == null || r.addEventListener("click", () => {
    const m = t.parseEntryPath(t.selectedPath);
    if (!m) return;
    const p = t.getEntryAtPath(t.selectedPath);
    if (!(p != null && p.sound)) return;
    new FilePicker({
      type: "audio",
      current: p.sound.src || "",
      callback: /* @__PURE__ */ c(async (E) => {
        const v = { ...p.sound, src: E };
        v.id || (v.id = Cf(E));
        const b = await Tf(E);
        b > 0 && (v.duration = b), n(m, p, v);
      }, "callback")
    }).render(!0);
  }), (o = e.querySelector("[data-action='change-sound-id']")) == null || o.addEventListener("change", (m) => {
    const p = t.parseEntryPath(t.selectedPath);
    if (!p) return;
    const y = t.getEntryAtPath(t.selectedPath);
    y != null && y.sound && n(p, y, { ...y.sound, id: m.target.value || void 0 });
  }), (s = e.querySelector("[data-action='change-sound-volume']")) == null || s.addEventListener("input", (m) => {
    const p = t.parseEntryPath(t.selectedPath);
    if (!p) return;
    const y = t.getEntryAtPath(t.selectedPath);
    y != null && y.sound && n(p, y, { ...y.sound, volume: Number(m.target.value) || 0.8 });
  }), (a = e.querySelector("[data-action='change-sound-loop']")) == null || a.addEventListener("change", (m) => {
    const p = t.parseEntryPath(t.selectedPath);
    if (!p) return;
    const y = t.getEntryAtPath(t.selectedPath);
    y != null && y.sound && n(p, y, { ...y.sound, loop: m.target.checked });
  }), (l = e.querySelector("[data-action='change-sound-fadein']")) == null || l.addEventListener("change", (m) => {
    const p = t.parseEntryPath(t.selectedPath);
    if (!p) return;
    const y = t.getEntryAtPath(t.selectedPath);
    y != null && y.sound && n(p, y, { ...y.sound, fadeIn: Number(m.target.value) || void 0 });
  }), (u = e.querySelector("[data-action='change-sound-fadeout']")) == null || u.addEventListener("change", (m) => {
    const p = t.parseEntryPath(t.selectedPath);
    if (!p) return;
    const y = t.getEntryAtPath(t.selectedPath);
    y != null && y.sound && n(p, y, { ...y.sound, fadeOut: Number(m.target.value) || void 0 });
  }), (d = e.querySelector("[data-action='change-sound-duration']")) == null || d.addEventListener("change", (m) => {
    const p = t.parseEntryPath(t.selectedPath);
    if (!p) return;
    const y = t.getEntryAtPath(t.selectedPath);
    y != null && y.sound && n(p, y, { ...y.sound, duration: Number(m.target.value) || 0 });
  }), (f = e.querySelector("[data-action='change-sound-fireandforget']")) == null || f.addEventListener("change", (m) => {
    const p = t.parseEntryPath(t.selectedPath);
    if (!p) return;
    const y = t.getEntryAtPath(t.selectedPath);
    y != null && y.sound && n(p, y, { ...y.sound, fireAndForget: m.target.checked });
  }), (h = e.querySelector("[data-action='change-stopsound-id']")) == null || h.addEventListener("change", (m) => {
    const p = t.parseEntryPath(t.selectedPath);
    p && (p.type === "timeline" ? t.mutate((y) => y.updateEntry(p.index, { stopSound: m.target.value })) : p.type === "branch" && t.mutate((y) => y.updateBranchEntry(p.index, p.branchIndex, p.branchEntryIndex, { stopSound: m.target.value })));
  });
}
c(NE, "bindSoundFieldEvents");
function $E(e, t) {
  var n, i, r, o, s;
  (n = e.querySelector("[data-action='change-emit-signal']")) == null || n.addEventListener("change", (a) => {
    const l = t.parseEntryPath(t.selectedPath);
    l && l.type === "timeline" && t.mutate((u) => u.updateEntry(l.index, { emit: a.target.value }));
  }), (i = e.querySelector("[data-action='change-parallel-join']")) == null || i.addEventListener("change", (a) => {
    const l = t.parseEntryPath(t.selectedPath);
    if (!l || l.type !== "timeline") return;
    const u = t.state.timeline[l.index];
    u != null && u.parallel && t.mutate((d) => d.updateEntry(l.index, { parallel: { ...u.parallel, join: a.target.value } }));
  }), (r = e.querySelector("[data-action='change-parallel-overflow']")) == null || r.addEventListener("change", (a) => {
    const l = t.parseEntryPath(t.selectedPath);
    if (!l || l.type !== "timeline") return;
    const u = t.state.timeline[l.index];
    u != null && u.parallel && t.mutate((d) => d.updateEntry(l.index, { parallel: { ...u.parallel, overflow: a.target.value } }));
  }), (o = e.querySelector("[data-action='edit-parallel-json']")) == null || o.addEventListener("click", () => {
    LE({ selectedPath: t.selectedPath, state: t.state, mutate: t.mutate });
  }), (s = e.querySelector("[data-action='add-branch']")) == null || s.addEventListener("click", () => {
    const a = t.parseEntryPath(t.selectedPath);
    !a || a.type !== "timeline" || t.mutate((l) => l.addBranch(a.index));
  }), e.querySelectorAll("[data-action='remove-branch']").forEach((a) => {
    a.addEventListener("click", () => {
      const l = Number(a.dataset.branchIndex), u = t.parseEntryPath(t.selectedPath);
      !u || u.type !== "timeline" || Number.isNaN(l) || t.mutate((d) => d.removeBranch(u.index, l));
    });
  }), e.querySelectorAll("[data-action='add-branch-step']").forEach((a) => {
    a.addEventListener("click", () => {
      const l = Number(a.dataset.branchIndex), u = t.parseEntryPath(t.selectedPath);
      !u || u.type !== "timeline" || Number.isNaN(l) || t.mutate((d) => d.addBranchEntry(u.index, l, { tweens: [] }));
    });
  }), e.querySelectorAll("[data-action='add-branch-delay']").forEach((a) => {
    a.addEventListener("click", () => {
      const l = Number(a.dataset.branchIndex), u = t.parseEntryPath(t.selectedPath);
      !u || u.type !== "timeline" || Number.isNaN(l) || t.mutate((d) => d.addBranchEntry(u.index, l, { delay: 1e3 }));
    });
  }), e.querySelectorAll("[data-action='add-branch-sound']").forEach((a) => {
    a.addEventListener("click", () => {
      const l = Number(a.dataset.branchIndex), u = t.parseEntryPath(t.selectedPath);
      !u || u.type !== "timeline" || Number.isNaN(l) || t.mutate((d) => d.addBranchEntry(u.index, l, { sound: { src: "", volume: 0.8, loop: !1, duration: 0, fireAndForget: !1 } }));
    });
  }), e.querySelectorAll("[data-action='add-branch-stopSound']").forEach((a) => {
    a.addEventListener("click", () => {
      const l = Number(a.dataset.branchIndex), u = t.parseEntryPath(t.selectedPath);
      !u || u.type !== "timeline" || Number.isNaN(l) || t.mutate((d) => d.addBranchEntry(u.index, l, { stopSound: "" }));
    });
  }), e.querySelectorAll("[data-action='remove-branch-entry']").forEach((a) => {
    a.addEventListener("click", () => {
      const l = Number(a.dataset.branchIndex), u = Number(a.dataset.branchEntryIndex), d = t.parseEntryPath(t.selectedPath);
      !d || d.type !== "timeline" || Number.isNaN(l) || Number.isNaN(u) || t.mutate((f) => f.removeBranchEntry(d.index, l, u));
    });
  });
}
c($E, "bindSpecialEntryEvents");
function FE(e, t) {
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
      o && o !== r && t.renameSegment(r, o);
    });
  });
}
c(FE, "bindSegmentGraphEvents");
function DE(e, t) {
  var n, i, r, o, s, a, l;
  (n = e.querySelector("[data-action='change-gate-event']")) == null || n.addEventListener("change", (u) => {
    var f;
    const d = u.target.value;
    if (!d)
      t.setSegmentGate(null);
    else {
      const h = ((f = t.state.activeSegment) == null ? void 0 : f.gate) ?? {};
      t.setSegmentGate({ ...h, event: d });
    }
  }), (i = e.querySelector("[data-action='change-gate-target']")) == null || i.addEventListener("change", (u) => {
    var f;
    const d = (f = t.state.activeSegment) == null ? void 0 : f.gate;
    d && t.setSegmentGate({ ...d, target: u.target.value || void 0 });
  }), (r = e.querySelector("[data-action='pick-gate-target']")) == null || r.addEventListener("click", async () => {
    var f;
    const u = (f = t.state.activeSegment) == null ? void 0 : f.gate;
    if (!u) return;
    const { enterPickMode: d } = await Promise.resolve().then(() => xE);
    d({
      placeableType: "Tile",
      onPick: /* @__PURE__ */ c((h) => {
        var y, E;
        const m = (E = (y = h.flags) == null ? void 0 : y.tagger) == null ? void 0 : E.tags, p = m != null && m.length ? `tag:${m[0]}` : `id:${h.id}`;
        t.setSegmentGate({ ...u, target: p });
      }, "onPick")
    });
  });
  for (const [u, d] of [["change-gate-anim-idle", "idle"], ["change-gate-anim-hover", "hover"], ["change-gate-anim-dim", "dim"]])
    (o = e.querySelector(`[data-action='${u}']`)) == null || o.addEventListener("change", (f) => {
      var v;
      const h = (v = t.state.activeSegment) == null ? void 0 : v.gate;
      if (!h) return;
      const m = f.target.value.trim(), p = m ? m.split(",").map((b) => b.trim()).filter(Boolean) : void 0, y = { ...h.animation ?? {} };
      p != null && p.length ? y[d] = p.length === 1 ? p[0] : p : delete y[d];
      const E = { ...h, animation: Object.keys(y).length ? y : void 0 };
      E.animation || delete E.animation, t.setSegmentGate(E);
    });
  (s = e.querySelector("[data-action='change-segment-next']")) == null || s.addEventListener("change", (u) => {
    const d = u.target.value;
    t.setSegmentNext(d || null);
  }), (a = e.querySelector("[data-action='edit-segment-setup']")) == null || a.addEventListener("click", () => {
    ra("setup", { state: t.state, mutate: t.mutate });
  }), (l = e.querySelector("[data-action='edit-segment-landing']")) == null || l.addEventListener("click", () => {
    ra("landing", { state: t.state, mutate: t.mutate });
  });
}
c(DE, "bindSegmentDetailEvents");
var mh, it, X, ft, Xn, Bt, ht, rt, Ya, ze, mt, Ka, kn, Ir, Mt, Hi, Jn, qi, W, Sg, Cg, Tg, Lg, Hn, bu, vu, wu, Eu, Ig, qn, Su, kg, Og, Ag, Mg, xg, Cu, io;
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
    _(this, Ya, 120);
    _(this, ze, []);
    _(this, mt, -1);
    _(this, Ka, 50);
    _(this, kn, null);
    _(this, Ir, null);
    _(this, Mt, null);
    _(this, Hi, null);
    _(this, Jn, null);
    _(this, qi, null);
    O(this, it, n.scene ?? canvas.scene ?? null), O(this, X, hn.fromScene(g(this, it)));
  }
  // ── Context ───────────────────────────────────────────────────────────
  async _prepareContext() {
    var m, p;
    const n = fE(g(this, X), g(this, X).activeSegmentName), i = uE(g(this, X).timeline, {
      selectedPath: g(this, ft),
      windowWidth: ((m = this.position) == null ? void 0 : m.width) ?? 1100
    }), r = g(this, ft) != null ? CE(g(this, ft), { state: g(this, X), expandedTweens: g(this, Xn) }) : null, o = g(this, X).listCinematicNames(), s = g(this, X).activeCinematicName, l = g(this, X).listSegmentNames().length > 1, u = g(this, X).activeSegment, d = (u == null ? void 0 : u.gate) ?? null, f = (u == null ? void 0 : u.next) ?? null, h = typeof f == "string" ? f : (f == null ? void 0 : f.segment) ?? null;
    return {
      // Toolbar
      sceneName: ((p = g(this, it)) == null ? void 0 : p.name) ?? "No scene",
      dirty: g(this, Bt),
      canUndo: g(this, W, bu),
      canRedo: g(this, W, vu),
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
      triggerOptions: nE.map((y) => ({
        ...y,
        selected: y.value === g(this, X).trigger
      })),
      entryCount: g(this, X).timeline.length,
      totalDuration: i.totalDurationMs,
      targetCount: hE(g(this, X)),
      setupCount: Object.keys(g(this, X).setup ?? {}).length,
      landingCount: Object.keys(g(this, X).landing ?? {}).length
    };
  }
  // ── Render & Events ───────────────────────────────────────────────────
  _onRender(n, i) {
    var r, o, s;
    if (super._onRender(n, i), I(this, W, Sg).call(this), !g(this, Hi)) {
      const a = (o = (r = game.modules.get(k)) == null ? void 0 : r.api) == null ? void 0 : o.cinematic;
      a != null && a.onPlaybackProgress ? (O(this, Hi, a.onPlaybackProgress((l) => I(this, W, xg).call(this, l))), console.log("[cinematic-editor] Subscribed to playback progress events")) : console.warn("[cinematic-editor] onPlaybackProgress not available on API", a);
    }
    if (g(this, qi) && ((s = this.element) == null || s.querySelectorAll(".cinematic-editor__segment-node").forEach((a) => {
      a.classList.toggle("cinematic-editor__segment-node--playing", a.dataset.segmentName === g(this, qi));
    }), g(this, Mt) && g(this, Mt).segmentName === g(this, X).activeSegmentName)) {
      const a = performance.now() - g(this, Mt).startTime;
      g(this, Mt).durationMs - a > 0 && I(this, W, Cu).call(this, g(this, Mt).durationMs, g(this, Mt).startTime);
    }
    g(this, kn) || (O(this, kn, (a) => {
      !a.ctrlKey && !a.metaKey || (a.key === "z" && !a.shiftKey ? (a.preventDefault(), I(this, W, wu).call(this)) : (a.key === "z" && a.shiftKey || a.key === "y") && (a.preventDefault(), I(this, W, Eu).call(this)));
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
      i === "save" && await I(this, W, Su).call(this);
    }
    return super.close(n);
  }
  async _onClose(n) {
    var i;
    return g(this, ht) !== null && (clearTimeout(g(this, ht)), O(this, ht, null)), g(this, kn) && (document.removeEventListener("keydown", g(this, kn)), O(this, kn, null)), (i = g(this, Hi)) == null || i.call(this), O(this, Hi, null), I(this, W, io).call(this), super._onClose(n);
  }
};
it = new WeakMap(), X = new WeakMap(), ft = new WeakMap(), Xn = new WeakMap(), Bt = new WeakMap(), ht = new WeakMap(), rt = new WeakMap(), Ya = new WeakMap(), ze = new WeakMap(), mt = new WeakMap(), Ka = new WeakMap(), kn = new WeakMap(), Ir = new WeakMap(), Mt = new WeakMap(), Hi = new WeakMap(), Jn = new WeakMap(), qi = new WeakMap(), W = new WeakSet(), // ── Event binding ─────────────────────────────────────────────────────
Sg = /* @__PURE__ */ c(function() {
  const n = this.element;
  if (!(n instanceof HTMLElement)) return;
  const i = I(this, W, Cg).call(this);
  IE(n, i), kE(n, i), FE(n, i), OE(n, i), AE(n, i), _E(n, i), NE(n, i), $E(n, i), DE(n, i);
}, "#bindEvents"), Cg = /* @__PURE__ */ c(function() {
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
      return g(n, Ir);
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
    queueTweenChange: /* @__PURE__ */ c((i, r) => I(this, W, Ig).call(this, i, r), "queueTweenChange"),
    flushTweenChanges: /* @__PURE__ */ c(() => {
      g(this, rt) && I(this, W, qn).call(this);
    }, "flushTweenChanges"),
    flushTweenChangesImmediate: /* @__PURE__ */ c(() => {
      g(this, ht) !== null && clearTimeout(g(this, ht)), O(this, ht, null), I(this, W, qn).call(this);
    }, "flushTweenChangesImmediate"),
    // Path utilities
    parseEntryPath: fi,
    getEntryAtPath: /* @__PURE__ */ c((i) => ia(i, g(this, X)), "getEntryAtPath"),
    // Insert menu
    showInsertMenu: /* @__PURE__ */ c((i, r, o) => I(this, W, Tg).call(this, i, r, o), "showInsertMenu"),
    hideInsertMenu: /* @__PURE__ */ c(() => I(this, W, Lg).call(this), "hideInsertMenu"),
    // Toolbar actions
    save: /* @__PURE__ */ c(() => I(this, W, Su).call(this), "save"),
    play: /* @__PURE__ */ c(() => I(this, W, kg).call(this), "play"),
    resetTracking: /* @__PURE__ */ c(() => I(this, W, Og).call(this), "resetTracking"),
    exportJSON: /* @__PURE__ */ c(() => I(this, W, Ag).call(this), "exportJSON"),
    validate: /* @__PURE__ */ c(() => I(this, W, Mg).call(this), "validate"),
    importJSON: /* @__PURE__ */ c(() => TE({ state: g(this, X), mutate: /* @__PURE__ */ c((i) => I(this, W, Hn).call(this, i), "mutate") }), "importJSON"),
    undo: /* @__PURE__ */ c(() => I(this, W, wu).call(this), "undo"),
    redo: /* @__PURE__ */ c(() => I(this, W, Eu).call(this), "redo")
  };
}, "#createEventContext"), // ── Insert menu ───────────────────────────────────────────────────────
Tg = /* @__PURE__ */ c(function(n, i, r) {
  var l;
  const o = (l = this.element) == null ? void 0 : l.querySelector(".cinematic-editor__insert-menu");
  if (!o) return;
  const s = n.getBoundingClientRect();
  document.body.appendChild(o), o.style.display = "", o.style.position = "fixed", o.style.left = `${s.left}px`;
  const a = o.offsetHeight || 200;
  s.bottom + 4 + a > window.innerHeight ? o.style.top = `${s.top - a - 4}px` : o.style.top = `${s.bottom + 4}px`, O(this, Ir, { insertIndex: i, lane: r });
}, "#showInsertMenu"), Lg = /* @__PURE__ */ c(function() {
  var i, r;
  const n = document.body.querySelector(".cinematic-editor__insert-menu") ?? ((i = this.element) == null ? void 0 : i.querySelector(".cinematic-editor__insert-menu"));
  if (n) {
    n.style.display = "none";
    const o = (r = this.element) == null ? void 0 : r.querySelector(".cinematic-editor");
    o && n.parentNode !== o && o.appendChild(n);
  }
  O(this, Ir, null);
}, "#hideInsertMenu"), // ── State mutation ────────────────────────────────────────────────────
Hn = /* @__PURE__ */ c(function(n) {
  O(this, ze, g(this, ze).slice(0, g(this, mt) + 1)), g(this, ze).push(g(this, X)), g(this, ze).length > g(this, Ka) && g(this, ze).shift(), O(this, mt, g(this, ze).length - 1), O(this, X, n(g(this, X))), O(this, Bt, !0), this.render({ force: !0 });
}, "#mutate"), bu = /* @__PURE__ */ c(function() {
  return g(this, mt) >= 0;
}, "#canUndo"), vu = /* @__PURE__ */ c(function() {
  return g(this, mt) < g(this, ze).length - 1;
}, "#canRedo"), wu = /* @__PURE__ */ c(function() {
  g(this, W, bu) && (g(this, mt) === g(this, ze).length - 1 && g(this, ze).push(g(this, X)), O(this, X, g(this, ze)[g(this, mt)]), Ll(this, mt)._--, O(this, Bt, !0), this.render({ force: !0 }));
}, "#undo"), Eu = /* @__PURE__ */ c(function() {
  g(this, W, vu) && (Ll(this, mt)._++, O(this, X, g(this, ze)[g(this, mt) + 1]), O(this, Bt, !0), this.render({ force: !0 }));
}, "#redo"), Ig = /* @__PURE__ */ c(function(n, i) {
  var r;
  g(this, ft) != null && (O(this, rt, {
    ...g(this, rt) ?? {},
    entryPath: g(this, ft),
    tweenIndex: n,
    patch: { ...((r = g(this, rt)) == null ? void 0 : r.patch) ?? {}, ...i }
  }), g(this, ht) !== null && clearTimeout(g(this, ht)), O(this, ht, setTimeout(() => {
    O(this, ht, null), I(this, W, qn).call(this);
  }, g(this, Ya))));
}, "#queueTweenChange"), qn = /* @__PURE__ */ c(function() {
  if (!g(this, rt)) return;
  const { entryPath: n, tweenIndex: i, patch: r } = g(this, rt);
  O(this, rt, null);
  const o = fi(n);
  if (o) {
    if (o.type === "timeline")
      O(this, X, g(this, X).updateTween(o.index, i, r));
    else if (o.type === "branch") {
      const s = ia(n, g(this, X));
      if (s) {
        const a = (s.tweens ?? []).map((l, u) => u === i ? { ...l, ...r } : l);
        O(this, X, g(this, X).updateBranchEntry(o.index, o.branchIndex, o.branchEntryIndex, { tweens: a }));
      }
    }
    O(this, Bt, !0);
  }
}, "#flushTweenChanges"), Su = /* @__PURE__ */ c(async function() {
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
        O(this, X, hn.fromScene(g(this, it), g(this, X).activeCinematicName)), O(this, Bt, !1), O(this, ze, []), O(this, mt, -1), this.render({ force: !0 }), (i = (n = ui.notifications) == null ? void 0 : n.info) == null || i.call(n, "Cinematic reloaded from scene.");
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
}, "#onSave"), kg = /* @__PURE__ */ c(async function() {
  var i, r, o, s, a;
  const n = (r = (i = game.modules.get(k)) == null ? void 0 : i.api) == null ? void 0 : r.cinematic;
  if (!(n != null && n.play)) {
    (s = (o = ui.notifications) == null ? void 0 : o.warn) == null || s.call(o, "Cinematic API not available.");
    return;
  }
  await n.play((a = g(this, it)) == null ? void 0 : a.id, g(this, X).activeCinematicName);
}, "#onPlay"), Og = /* @__PURE__ */ c(async function() {
  var i, r, o, s, a;
  const n = (r = (i = game.modules.get(k)) == null ? void 0 : i.api) == null ? void 0 : r.cinematic;
  n != null && n.reset && (await n.reset((o = g(this, it)) == null ? void 0 : o.id, g(this, X).activeCinematicName), (a = (s = ui.notifications) == null ? void 0 : s.info) == null || a.call(s, "Cinematic tracking reset."));
}, "#onResetTracking"), Ag = /* @__PURE__ */ c(async function() {
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
}, "#onExportJSON"), Mg = /* @__PURE__ */ c(function() {
  var l, u;
  const n = g(this, X).toJSON(), { targets: i, unresolved: r } = na(n), o = tE(n, i), s = [
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
xg = /* @__PURE__ */ c(function(n) {
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
      O(this, Mt, { segmentName: n.segmentName, startTime: performance.now(), durationMs: n.durationMs }), n.segmentName === g(this, X).activeSegmentName && I(this, W, Cu).call(this, n.durationMs);
      break;
    case "timeline-end":
      I(this, W, io).call(this), O(this, Mt, null);
      break;
    case "playback-end":
      I(this, W, io).call(this), O(this, Mt, null), O(this, qi, null), (l = this.element) == null || l.querySelectorAll(".cinematic-editor__segment-node--playing, .cinematic-editor__segment-node--gate-waiting").forEach((u) => {
        u.classList.remove("cinematic-editor__segment-node--playing", "cinematic-editor__segment-node--gate-waiting");
      });
      break;
  }
}, "#onPlaybackEvent"), Cu = /* @__PURE__ */ c(function(n, i = null) {
  var u, d;
  I(this, W, io).call(this);
  const r = (u = this.element) == null ? void 0 : u.querySelector(".cinematic-editor__playback-cursor"), o = (d = this.element) == null ? void 0 : d.querySelector(".cinematic-editor__swimlane");
  if (console.log(`[cinematic-editor] startCursor: duration=${n}, cursor=${!!r}, swimlane=${!!o}, width=${o == null ? void 0 : o.scrollWidth}`), !r || !o || n <= 0) return;
  r.style.display = "block";
  const s = i ?? performance.now(), a = o.scrollWidth, l = /* @__PURE__ */ c(() => {
    const f = performance.now() - s, h = Math.min(f / n, 1), m = To + h * (a - To);
    r.style.left = `${m}px`, h < 1 && O(this, Jn, requestAnimationFrame(l));
  }, "tick");
  O(this, Jn, requestAnimationFrame(l));
}, "#startCursorAnimation"), io = /* @__PURE__ */ c(function() {
  var i;
  g(this, Jn) && (cancelAnimationFrame(g(this, Jn)), O(this, Jn, null));
  const n = (i = this.element) == null ? void 0 : i.querySelector(".cinematic-editor__playback-cursor");
  n && (n.style.display = "none");
}, "#stopCursorAnimation"), c(Rt, "CinematicEditorApplication"), se(Rt, "APP_ID", `${k}-cinematic-editor`), se(Rt, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  ye(Rt, Rt, "DEFAULT_OPTIONS"),
  {
    id: Rt.APP_ID,
    classes: Array.from(
      /* @__PURE__ */ new Set([...((mh = ye(Rt, Rt, "DEFAULT_OPTIONS")) == null ? void 0 : mh.classes) ?? [], "eidolon-cinematic-editor-window", "themed"])
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
let yu = Rt;
const _g = /* @__PURE__ */ new Map();
function we(e, t) {
  _g.set(e, t);
}
c(we, "registerBehaviour");
function $s(e) {
  return _g.get(e);
}
c($s, "getBehaviour");
function fe(e) {
  var t;
  return ((t = e.document) == null ? void 0 : t.documentName) === "Drawing" ? e.shape ?? null : e.mesh ? e.mesh : e.destroyed || !e.transform ? null : e;
}
c(fe, "getAnimationTarget");
function PE(e, t, n) {
  let i, r, o;
  if (t === 0)
    i = r = o = n;
  else {
    const s = /* @__PURE__ */ c((u, d, f) => (f < 0 && (f += 1), f > 1 && (f -= 1), f < 0.16666666666666666 ? u + (d - u) * 6 * f : f < 0.5 ? d : f < 0.6666666666666666 ? u + (d - u) * (0.6666666666666666 - f) * 6 : u), "hue2rgb"), a = n < 0.5 ? n * (1 + t) : n + t - n * t, l = 2 * n - a;
    i = s(l, a, e + 1 / 3), r = s(l, a, e), o = s(l, a, e - 1 / 3);
  }
  return Math.round(i * 255) << 16 | Math.round(r * 255) << 8 | Math.round(o * 255);
}
c(PE, "hslToInt");
we("float", (e, t = {}) => {
  const n = fe(e);
  if (!n) return { update() {
  }, detach() {
  } };
  const i = t.speed ?? 0.04, r = t.amplitude ?? 3, o = n.position.y;
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
we("pulse", (e, t = {}) => {
  const n = fe(e);
  if (!n) return { update() {
  }, detach() {
  } };
  const i = t.minAlpha ?? 0.6, r = t.maxAlpha ?? 1, o = t.speed ?? 0.05, s = n.alpha;
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
we("scale", (e, t = {}, n) => {
  var b, w, S, T, L, A;
  const i = fe(e);
  if (!i) return { update() {
  }, detach() {
  } };
  const r = t.factor ?? 1.12, o = t.durationFrames ?? 15, s = vt(t.easing ?? "easeOutCubic"), a = i.scale.x, l = i.scale.y, u = a * r, d = l * r, h = !(!!e.mesh || ((b = i.pivot) == null ? void 0 : b.x) || ((w = i.pivot) == null ? void 0 : w.y)), m = h ? (((T = (S = e.document) == null ? void 0 : S.shape) == null ? void 0 : T.width) ?? 0) / 2 : 0, p = h ? (((A = (L = e.document) == null ? void 0 : L.shape) == null ? void 0 : A.height) ?? 0) / 2 : 0, y = (n == null ? void 0 : n.x) ?? i.position.x, E = (n == null ? void 0 : n.y) ?? i.position.y;
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
we("glow", (e, t = {}) => {
  var y, E;
  const n = fe(e);
  if (!((y = n == null ? void 0 : n.texture) != null && y.baseTexture)) return { update() {
  }, detach() {
  } };
  const i = e.document, r = t.color ?? 4513279, o = t.alpha ?? 0.5, s = t.blur ?? 8, a = t.pulseSpeed ?? 0.03, l = Math.abs(i.width), u = Math.abs(i.height), d = PIXI.Sprite.from(n.texture);
  d.anchor.set(0.5, 0.5), d.scale.set(n.scale.x, n.scale.y), d.position.set(l / 2, u / 2), d.angle = i.rotation ?? 0, d.alpha = o, d.tint = r;
  const f = PIXI.BlurFilter ?? ((E = PIXI.filters) == null ? void 0 : E.BlurFilter), h = new f(s);
  d.filters = [h], e.addChildAt(d, 0);
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
we("wobble", (e, t = {}) => {
  const n = fe(e);
  if (!n) return { update() {
  }, detach() {
  } };
  const i = t.speed ?? 0.15, r = t.angle ?? 2.5, o = n.angle;
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
we("colorCycle", (e, t = {}) => {
  const n = fe(e);
  if (!n) return { update() {
  }, detach() {
  } };
  const i = t.speed ?? 5e-3, r = t.saturation ?? 0.6, o = t.lightness ?? 0.6, s = n.tint;
  let a = 0;
  return {
    update(l) {
      a = (a + l * i) % 1, n.tint = PE(a, r, o);
    },
    detach() {
      n.tint = s;
    }
  };
});
we("spin", (e, t = {}) => {
  const n = fe(e);
  if (!n) return { update() {
  }, detach() {
  } };
  const i = t.speed ?? 0.5, r = n.angle;
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
we("bounce", (e, t = {}) => {
  const n = fe(e);
  if (!n) return { update() {
  }, detach() {
  } };
  const i = t.speed ?? 0.02, r = t.amplitude ?? 6, o = vt("easeOutBounce"), s = n.position.y;
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
we("borderTrace", (e, t = {}) => {
  const n = fe(e);
  if (!n) return { update() {
  }, detach() {
  } };
  const i = e.document, r = Math.abs(i.width), o = Math.abs(i.height), s = 2 * (r + o), a = t.speed ?? 1.5, l = t.length ?? 60, u = t.color ?? 4513279, d = t.alpha ?? 0.8, f = t.lineWidth ?? 2, h = new PIXI.Graphics();
  h.alpha = d, h.pivot.set(r / 2, o / 2), h.position.set(r / 2, o / 2), e.addChildAt(h, 0);
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
we("shimmer", (e, t = {}) => {
  const n = fe(e);
  if (!n) return { update() {
  }, detach() {
  } };
  const i = e.document, r = Math.abs(i.width), o = Math.abs(i.height), s = t.speed ?? 1, a = t.bandWidth ?? 40, l = t.alpha ?? 0.15, u = t.pause ?? 120, d = r + o + a, f = d + u * s, h = new PIXI.Container();
  h.pivot.set(r / 2, o / 2), h.position.set(r / 2, o / 2);
  const m = new PIXI.Graphics();
  m.alpha = l;
  const p = new PIXI.Graphics();
  p.beginFill(16777215), p.drawRect(0, 0, r, o), p.endFill(), h.addChild(p), m.mask = p, h.addChild(m), e.addChild(h);
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
we("breathe", (e, t = {}) => {
  const n = fe(e);
  if (!n) return { update() {
  }, detach() {
  } };
  const i = t.factor ?? 1.03, r = t.speed ?? 0.02, o = n.scale.x, s = n.scale.y;
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
we("tiltFollow", (e, t = {}) => {
  const n = fe(e);
  if (!n) return { update() {
  }, detach() {
  } };
  const i = t.maxAngle ?? 3, r = t.smoothing ?? 0.15, o = e.document, s = n.angle;
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
we("slideReveal", (e, t = {}, n) => {
  const i = fe(e);
  if (!i) return { update() {
  }, detach() {
  } };
  if (n) return { update() {
  }, detach() {
  } };
  const r = t.offsetX ?? 0, o = t.offsetY ?? 20, s = t.durationFrames ?? 20, a = vt(t.easing ?? "easeOutCubic"), l = t.delay ?? 0, u = i.position.x, d = i.position.y, f = i.alpha;
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
we("embers", (e, t = {}) => {
  const n = fe(e);
  if (!n) return { update() {
  }, detach() {
  } };
  const i = e.document, r = Math.abs(i.width), o = Math.abs(i.height), s = t.count ?? 12, a = t.speed ?? 0.5, l = t.color ?? 16737792, u = t.alpha ?? 0.6, d = t.size ?? 2, f = new PIXI.Container();
  f.pivot.set(r / 2, o / 2), f.position.set(r / 2, o / 2);
  const h = new PIXI.Graphics();
  f.addChild(h), e.addChild(f);
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
we("runeGlow", (e, t = {}) => {
  const n = fe(e);
  if (!n) return { update() {
  }, detach() {
  } };
  const i = e.document, r = Math.abs(i.width), o = Math.abs(i.height), s = 2 * (r + o), a = t.dots ?? 3, l = t.speed ?? 1.2, u = t.color ?? 4513279, d = t.color2 ?? 8930559, f = t.radius ?? 3, h = t.alpha ?? 0.7, m = new PIXI.Graphics();
  m.pivot.set(r / 2, o / 2), m.position.set(r / 2, o / 2), e.addChildAt(m, 0);
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
we("ripple", (e, t = {}) => {
  const n = fe(e);
  if (!n) return { update() {
  }, detach() {
  } };
  const i = e.document, r = Math.abs(i.width), o = Math.abs(i.height), s = t.maxRadius ?? Math.sqrt(r * r + o * o) / 2, a = t.rings ?? 3, l = t.interval ?? 30, u = t.speed ?? 1.5, d = t.color ?? 4513279, f = t.alpha ?? 0.4, h = t.lineWidth ?? 1.5, m = new PIXI.Container();
  m.pivot.set(r / 2, o / 2), m.position.set(r / 2, o / 2);
  const p = new PIXI.Graphics();
  m.addChild(p), e.addChild(m);
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
we("frostEdge", (e, t = {}) => {
  const n = fe(e);
  if (!n) return { update() {
  }, detach() {
  } };
  const i = e.document, r = Math.abs(i.width), o = Math.abs(i.height), s = t.segments ?? 20, a = t.maxLength ?? 15, l = t.color ?? 11197951, u = t.alpha ?? 0.5, d = t.growSpeed ?? 0.02, f = new PIXI.Container();
  f.pivot.set(r / 2, o / 2), f.position.set(r / 2, o / 2);
  const h = new PIXI.Graphics(), m = new PIXI.Graphics();
  m.beginFill(16777215), m.drawRect(0, 0, r, o), m.endFill(), f.addChild(m), h.mask = m, f.addChild(h), e.addChild(f);
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
we("shadowLift", (e, t = {}) => {
  var m, p, y;
  const n = fe(e);
  if (!n) return { update() {
  }, detach() {
  } };
  const i = PIXI.DropShadowFilter ?? ((m = PIXI.filters) == null ? void 0 : m.DropShadowFilter) ?? ((y = (p = globalThis.PIXI) == null ? void 0 : p.filters) == null ? void 0 : y.DropShadowFilter);
  if (!i)
    return console.warn("shadowLift: DropShadowFilter not available in this PIXI build"), { update() {
    }, detach() {
    } };
  const r = t.offsetY ?? 6, o = t.blur ?? 6, s = t.alpha ?? 0.35, a = t.color ?? 0, l = t.durationFrames ?? 12, u = vt(t.easing ?? "easeOutCubic"), d = new i();
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
we("tween-prop", (e, t = {}) => {
  const n = fe(e);
  if (!n) return { update() {
  }, detach() {
  } };
  const i = t.attribute ?? "alpha", r = t.from ?? 0.85, o = t.to ?? 1, s = t.period ?? 1500, a = vt(t.easing ?? "easeInOutCosine"), u = { alpha: "alpha", rotation: "angle" }[i] ?? i, d = n[u];
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
we("tween-tint", (e, t = {}) => {
  const n = fe(e);
  if (!n) return { update() {
  }, detach() {
  } };
  const i = t.fromColor ?? "#ffffff", r = t.toColor ?? "#ffcc88", o = t.mode ?? "oklch", s = t.period ?? 3e3, a = vt(t.easing ?? "easeInOutCosine"), l = od(o), u = foundry.utils.Color, d = u.from(i), f = u.from(r), h = n.tint;
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
we("tween-scale", (e, t = {}) => {
  const n = fe(e);
  if (!n) return { update() {
  }, detach() {
  } };
  const i = t.fromScale ?? 0.95, r = t.toScale ?? 1.05, o = t.period ?? 2e3, s = vt(t.easing ?? "easeInOutCosine"), a = n.scale.x, l = n.scale.y;
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
const Kr = {
  always: [],
  idle: ["float", "glow"],
  hover: ["scale"],
  dim: ["none"]
};
function RE(e) {
  if (!e) return { ...Kr };
  const t = /* @__PURE__ */ c((n, i) => n === void 0 ? i : typeof n == "string" ? [n] : typeof n == "object" && !Array.isArray(n) && n.name ? [n] : Array.isArray(n) ? n : i, "normalize");
  return {
    always: t(e.always, Kr.always),
    idle: t(e.idle, Kr.idle),
    hover: t(e.hover, Kr.hover),
    dim: t(e.dim, Kr.dim)
  };
}
c(RE, "normalizeConfig");
var ke, Ut, gt, Vt, Qn, Zn, xt, Gt, On, Ie, Ng, Fs, $g, Fg, Dg, Pg, Rg, Hg;
const yo = class yo {
  /**
   * @param {PlaceableObject} placeable
   * @param {object|undefined} animationConfig  Raw animation config from the await entry
   */
  constructor(t, n) {
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
    O(this, ke, t), O(this, Ut, RE(n));
  }
  /** Current animation state name. */
  get state() {
    return g(this, gt);
  }
  /**
   * Start animating in the given state.
   * @param {string} [state="idle"]
   */
  start(t = "idle") {
    O(this, gt, t), O(this, Zn, (n) => {
      if (g(this, ke).destroyed || !g(this, ke).transform) {
        this.detach();
        return;
      }
      if (!g(this, xt)) {
        if (I(this, Ie, Ng).call(this), !g(this, xt)) return;
        I(this, Ie, Rg).call(this), I(this, Ie, Dg).call(this, g(this, gt));
        return;
      }
      g(this, Gt) && I(this, Ie, Fs).call(this);
      for (const i of g(this, Qn)) i.update(n);
      for (const i of g(this, Vt)) i.update(n);
      I(this, Ie, Fg).call(this, n);
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
  setState(t) {
    var f;
    if (t === g(this, gt)) return;
    if (!g(this, xt)) {
      O(this, gt, t);
      return;
    }
    const n = ((f = g(this, ke).document) == null ? void 0 : f.id) ?? "?", i = fe(g(this, ke)), r = g(this, Ut)[g(this, gt)] ?? g(this, Ut).idle ?? ["none"], o = g(this, Ut)[t] ?? g(this, Ut).idle ?? ["none"], s = r.map((h) => typeof h == "string" ? h : h == null ? void 0 : h.name), a = o.map((h) => typeof h == "string" ? h : h == null ? void 0 : h.name);
    if (console.log(`%c[TileAnimator ${n}] setState: ${g(this, gt)} → ${t}`, "color: #44DDFF; font-weight: bold"), console.log(`  old behaviours: [${s.join(", ")}]  →  new: [${a.join(", ")}]`), i && console.log(`  mesh BEFORE detach: pos=(${i.position.x.toFixed(2)}, ${i.position.y.toFixed(2)}) scale=(${i.scale.x.toFixed(4)}, ${i.scale.y.toFixed(4)}) alpha=${i.alpha.toFixed(4)} angle=${i.angle.toFixed(2)}`), g(this, xt)) {
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
    console.log(`  reused: [${[...d].join(", ")}]  detaching: [${[...l.keys()].filter((h) => !d.has(h)).join(", ")}]`), I(this, Ie, $g).call(this);
    for (const [h, m] of l)
      d.has(h) || (m.detach(), i && console.log(`  mesh AFTER detach("${h}"): scale=(${i.scale.x.toFixed(4)}, ${i.scale.y.toFixed(4)}) alpha=${i.alpha.toFixed(4)}`));
    I(this, Ie, Fs).call(this), i && console.log(`  mesh AFTER canonical restore: scale=(${i.scale.x.toFixed(4)}, ${i.scale.y.toFixed(4)}) alpha=${i.alpha.toFixed(4)}`);
    for (const h of o) {
      const m = typeof h == "string" ? h : h.name;
      if (l.has(m) && d.has(m))
        u.push(l.get(m)), d.delete(m), console.log(`  → reuse "${m}"`);
      else {
        const p = typeof h == "string" ? void 0 : h, y = $s(m);
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
    O(this, gt, t), O(this, Vt, u);
  }
  /**
   * Full cleanup — detach all behaviours, restore canonical, and remove ticker.
   */
  detach() {
    var n, i;
    g(this, ke).destroyed || !g(this, ke).transform ? (O(this, Vt, []), O(this, Qn, [])) : (I(this, Ie, Pg).call(this), I(this, Ie, Hg).call(this), I(this, Ie, Fs).call(this)), O(this, Gt, null), O(this, gt, null), g(this, Zn) && ((i = (n = canvas.app) == null ? void 0 : n.ticker) == null || i.remove(g(this, Zn)), O(this, Zn, null));
  }
};
ke = new WeakMap(), Ut = new WeakMap(), gt = new WeakMap(), Vt = new WeakMap(), Qn = new WeakMap(), Zn = new WeakMap(), xt = new WeakMap(), Gt = new WeakMap(), On = new WeakMap(), Ie = new WeakSet(), // ── Private ──────────────────────────────────────────────────────────
Ng = /* @__PURE__ */ c(function() {
  const t = fe(g(this, ke));
  t && O(this, xt, {
    x: t.position.x,
    y: t.position.y,
    scaleX: t.scale.x,
    scaleY: t.scale.y,
    angle: t.angle,
    alpha: t.alpha,
    tint: t.tint
  });
}, "#captureCanonical"), Fs = /* @__PURE__ */ c(function() {
  const t = fe(g(this, ke));
  if (!t || !g(this, xt)) return;
  const n = g(this, xt);
  t.position.x = n.x, t.position.y = n.y, t.scale.x = n.scaleX, t.scale.y = n.scaleY, t.angle = n.angle, t.alpha = n.alpha, t.tint = n.tint;
}, "#restoreCanonical"), /**
 * Snapshot the current (animated) mesh values so the transition blend
 * can lerp FROM here toward the new state's computed values.
 */
$g = /* @__PURE__ */ c(function() {
  const t = fe(g(this, ke));
  t && (O(this, Gt, {
    x: t.position.x,
    y: t.position.y,
    scaleX: t.scale.x,
    scaleY: t.scale.y,
    angle: t.angle,
    alpha: t.alpha
  }), O(this, On, 0));
}, "#captureBlendStart"), /**
 * After behaviours compute the new state's mesh values, blend from the
 * pre-transition snapshot toward those values over BLEND_FRAMES using
 * easeOutCubic. This hides the canonical-restore snap entirely.
 */
Fg = /* @__PURE__ */ c(function(t) {
  var s, a;
  if (!g(this, Gt)) return;
  O(this, On, g(this, On) + t);
  const n = Math.min(g(this, On) / yo.BLEND_FRAMES, 1);
  if (n >= 1) {
    const l = ((s = g(this, ke).document) == null ? void 0 : s.id) ?? "?";
    console.log(`%c[TileAnimator ${l}] blend complete`, "color: #88FF88"), O(this, Gt, null);
    return;
  }
  const i = 1 - (1 - n) ** 3, r = fe(g(this, ke));
  if (!r) return;
  const o = g(this, Gt);
  if (g(this, On) <= t * 3) {
    const l = ((a = g(this, ke).document) == null ? void 0 : a.id) ?? "?", u = Math.round(g(this, On) / t);
    console.log(`  [blend ${l} f${u}] t=${n.toFixed(3)} eased=${i.toFixed(3)} | behaviour→scale=(${r.scale.x.toFixed(4)},${r.scale.y.toFixed(4)}) alpha=${r.alpha.toFixed(4)} | blendFrom→scale=(${o.scaleX.toFixed(4)},${o.scaleY.toFixed(4)}) alpha=${o.alpha.toFixed(4)}`);
  }
  r.position.x = o.x + (r.position.x - o.x) * i, r.position.y = o.y + (r.position.y - o.y) * i, r.scale.x = o.scaleX + (r.scale.x - o.scaleX) * i, r.scale.y = o.scaleY + (r.scale.y - o.scaleY) * i, r.angle = o.angle + (r.angle - o.angle) * i, r.alpha = o.alpha + (r.alpha - o.alpha) * i, g(this, On) <= t * 3 && console.log(`  [blend result] scale=(${r.scale.x.toFixed(4)},${r.scale.y.toFixed(4)}) alpha=${r.alpha.toFixed(4)} pos=(${r.position.x.toFixed(2)},${r.position.y.toFixed(2)})`);
}, "#applyBlend"), Dg = /* @__PURE__ */ c(function(t) {
  O(this, gt, t);
  const n = g(this, Ut)[t] ?? g(this, Ut).idle ?? ["none"];
  for (const i of n) {
    const r = typeof i == "string" ? i : i.name, o = typeof i == "string" ? void 0 : i, s = $s(r);
    if (!s) {
      console.warn(`TileAnimator: unknown behaviour "${r}"`);
      continue;
    }
    g(this, Vt).push(s(g(this, ke), o));
  }
}, "#attachBehaviours"), Pg = /* @__PURE__ */ c(function() {
  for (const t of g(this, Vt)) t.detach();
  O(this, Vt, []);
}, "#detachBehaviours"), Rg = /* @__PURE__ */ c(function() {
  const t = g(this, Ut).always ?? [];
  for (const n of t) {
    const i = typeof n == "string" ? n : n.name, r = typeof n == "string" ? void 0 : n, o = $s(i);
    if (!o) {
      console.warn(`TileAnimator: unknown always behaviour "${i}"`);
      continue;
    }
    g(this, Qn).push(o(g(this, ke), r));
  }
}, "#attachAlwaysBehaviours"), Hg = /* @__PURE__ */ c(function() {
  for (const t of g(this, Qn)) t.detach();
  O(this, Qn, []);
}, "#detachAlwaysBehaviours"), c(yo, "TileAnimator"), /** Frames over which state transitions are blended (easeOutCubic). */
se(yo, "BLEND_FRAMES", 8);
let Xi = yo;
const HE = "cinematic", Bl = 5, Tu = /* @__PURE__ */ new Set();
function pn(e) {
  for (const t of Tu)
    try {
      t(e);
    } catch (n) {
      console.error("[cinematic] playback listener error:", n);
    }
}
c(pn, "emitPlaybackEvent");
function qE(e) {
  return Tu.add(e), () => Tu.delete(e);
}
c(qE, "onPlaybackProgress");
let _e = null, Tn = null, uo = null, fo = null, ir = 0, Li = null;
function ud(e, t = "default") {
  return `cinematic-progress-${e}-${t}`;
}
c(ud, "progressFlagKey");
function jE(e, t, n, i) {
  game.user.setFlag(k, ud(e, t), {
    currentSegment: n,
    completedSegments: [...i],
    timestamp: Date.now()
  }).catch(() => {
  });
}
c(jE, "saveSegmentProgress");
function Lu(e, t = "default") {
  game.user.unsetFlag(k, ud(e, t)).catch(() => {
  });
}
c(Lu, "clearProgress");
function qg(e, t = "default", n = 3e5) {
  const i = game.user.getFlag(k, ud(e, t));
  return !i || typeof i.timestamp != "number" || Date.now() - i.timestamp > n ? null : i.currentSegment ? i : null;
}
c(qg, "getSavedProgress");
function Ji(e, t = "default") {
  return `cinematic-seen-${e}-${t}`;
}
c(Ji, "seenFlagKey");
function _f(e, t = "default") {
  return !!game.user.getFlag(k, Ji(e, t));
}
c(_f, "hasSeenCinematic");
function BE(e, t) {
  var n;
  if (e == null) return null;
  if (typeof e != "object" || Array.isArray(e))
    return console.warn(`[${k}] Cinematic: invalid data for ${t} (expected object). Ignoring.`), null;
  if (e.trigger !== void 0 && typeof e.trigger != "string")
    return console.warn(`[${k}] Cinematic: invalid 'trigger' on ${t} (expected string). Ignoring.`), null;
  if (e.tracking !== void 0 && typeof e.tracking != "boolean")
    return console.warn(`[${k}] Cinematic: invalid 'tracking' on ${t} (expected boolean). Ignoring.`), null;
  if (e.synchronized !== void 0 && typeof e.synchronized != "boolean")
    return console.warn(`[${k}] Cinematic: invalid 'synchronized' on ${t} (expected boolean). Ignoring.`), null;
  if (e.segments) {
    if (typeof e.segments != "object" || Array.isArray(e.segments))
      return console.warn(`[${k}] Cinematic: invalid 'segments' on ${t} (expected object). Ignoring.`), null;
    for (const [i, r] of Object.entries(e.segments)) {
      if (!r || typeof r != "object" || Array.isArray(r)) {
        console.warn(`[${k}] Cinematic: invalid segment "${i}" on ${t}. Removing.`), delete e.segments[i];
        continue;
      }
      if (r.timeline !== void 0 && !Array.isArray(r.timeline)) {
        console.warn(`[${k}] Cinematic: invalid timeline on segment "${i}" of ${t}. Removing.`), delete e.segments[i];
        continue;
      }
      (n = r.timeline) != null && n.length && (r.timeline = r.timeline.filter((o, s) => !o || typeof o != "object" || Array.isArray(o) ? (console.warn(`[${k}] Cinematic: segment "${i}" timeline[${s}] on ${t} is not a valid object, removing.`), !1) : !0));
    }
    if (Object.keys(e.segments).length === 0)
      return console.warn(`[${k}] Cinematic: no valid segments on ${t}. Ignoring.`), null;
  }
  return e.timeline !== void 0 && !Array.isArray(e.timeline) ? (console.warn(`[${k}] Cinematic: invalid 'timeline' on ${t} (expected array). Ignoring.`), null) : e;
}
c(BE, "validateSingleCinematic");
function pl(e) {
  const t = e ? game.scenes.get(e) : canvas.scene;
  let n = (t == null ? void 0 : t.getFlag(k, HE)) ?? null;
  if (n == null) return null;
  if (typeof n != "object" || Array.isArray(n))
    return console.warn(`[${k}] Cinematic: invalid flag data on scene ${t == null ? void 0 : t.id} (expected object). Ignoring.`), null;
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
    n.version = Bl;
  }
  if (n.version > Bl)
    return console.warn(`[${k}] Cinematic: scene ${t == null ? void 0 : t.id} has version ${n.version}, runtime supports up to ${Bl}. Skipping.`), null;
  if (!n.cinematics || typeof n.cinematics != "object")
    return console.warn(`[${k}] Cinematic: no 'cinematics' map on scene ${t == null ? void 0 : t.id}. Ignoring.`), null;
  for (const [i, r] of Object.entries(n.cinematics)) {
    const o = BE(r, `scene ${t == null ? void 0 : t.id} cinematic "${i}"`);
    o ? n.cinematics[i] = o : delete n.cinematics[i];
  }
  return Object.keys(n.cinematics).length === 0 ? null : n;
}
c(pl, "getCinematicData");
function ca(e, t = "default") {
  var i;
  const n = pl(e);
  return ((i = n == null ? void 0 : n.cinematics) == null ? void 0 : i[t]) ?? null;
}
c(ca, "getNamedCinematic");
function UE(e) {
  const t = pl(e);
  return t ? Object.keys(t.cinematics) : [];
}
c(UE, "listCinematicNames");
function VE() {
  return game.ready ? Promise.resolve() : new Promise((e) => Hooks.once("ready", e));
}
c(VE, "waitForReady");
async function GE(e = 1e4) {
  var n, i;
  const t = (i = (n = game.modules.get(k)) == null ? void 0 : n.api) == null ? void 0 : i.tween;
  return t != null && t.Timeline ? t.Timeline : new Promise((r) => {
    const o = Date.now(), s = setTimeout(() => {
      var l, u;
      (u = (l = ui.notifications) == null ? void 0 : l.info) == null || u.call(l, `[${k}] Cinematic: waiting for tween engine...`);
    }, 2e3), a = setInterval(() => {
      var u, d, f, h;
      const l = (d = (u = game.modules.get(k)) == null ? void 0 : u.api) == null ? void 0 : d.tween;
      l != null && l.Timeline ? (clearInterval(a), clearTimeout(s), r(l.Timeline)) : Date.now() - o > e && (clearInterval(a), clearTimeout(s), console.warn(`[${k}] Cinematic: tween API not available after ${e}ms.`), (h = (f = ui.notifications) == null ? void 0 : f.warn) == null || h.call(f, `[${k}] Cinematic: tween engine unavailable — cinematic cannot play.`), r(null));
    }, 200);
  });
}
c(GE, "waitForTweenAPI");
async function Iu(e = 5e3) {
  var t;
  return window.Tagger ?? ((t = game.modules.get("tagger")) == null ? void 0 : t.api) ? !0 : new Promise((n) => {
    const i = Date.now(), r = setInterval(() => {
      var o;
      window.Tagger ?? ((o = game.modules.get("tagger")) == null ? void 0 : o.api) ? (clearInterval(r), n(!0)) : Date.now() - i > e && (clearInterval(r), console.warn(`[${k}] Cinematic: Tagger API not available after ${e}ms.`), n(!1));
    }, 200);
  });
}
c(Iu, "waitForTagger");
async function WE(e, t, n) {
  if (!e || !e.event) return;
  const i = { ...e };
  console.log(`[${k}] Cinematic: waiting for gate: ${e.event}`);
  let r = null;
  if (e.event === "tile-click" && e.target && e.animation) {
    const o = t.get(e.target);
    (o == null ? void 0 : o.kind) === "placeable" && o.placeable && (r = new Xi(o.placeable, e.animation), r.start());
  }
  try {
    if (e.timeout && e.timeout > 0) {
      const o = new Promise((a) => setTimeout(a, e.timeout)), s = ru(i, { signal: n.signal, eventBus: null });
      await Promise.race([s, o]);
    } else
      await ru(i, { signal: n.signal, eventBus: null });
  } finally {
    r && r.detach();
  }
}
c(WE, "processGate");
function jg(e) {
  if (!e.segments) return [];
  const t = [], n = /* @__PURE__ */ new Set();
  let i = e.entry;
  for (; i && typeof i == "string" && e.segments[i] && !n.has(i); )
    n.add(i), t.push(i), i = e.segments[i].next;
  return t;
}
c(jg, "getSegmentOrder");
function ua(e, t) {
  if (e.setup)
    try {
      Pe(e.setup, t);
    } catch (i) {
      console.warn(`[${k}] Cinematic: error applying cinematic-level setup:`, i);
    }
  const n = jg(e);
  for (const i of n) {
    const r = e.segments[i];
    if (r.setup)
      try {
        Pe(r.setup, t);
      } catch (o) {
        console.warn(`[${k}] Cinematic: error applying setup for segment "${i}":`, o);
      }
    if (r.landing)
      try {
        Pe(r.landing, t);
      } catch (o) {
        console.warn(`[${k}] Cinematic: error applying landing for segment "${i}":`, o);
      }
  }
  if (e.landing)
    try {
      Pe(e.landing, t);
    } catch (i) {
      console.warn(`[${k}] Cinematic: error applying cinematic-level landing:`, i);
    }
  canvas.perception.update({ refreshLighting: !0, refreshVision: !0 });
}
c(ua, "applyAllSegmentLandingStates");
async function ho(e, t = "default", n = null) {
  var b, w, S, T, L, A, M, F;
  const i = e ?? ((b = canvas.scene) == null ? void 0 : b.id);
  if (!i) return;
  const r = `${i}:${t}`;
  if (n || (n = /* @__PURE__ */ new Set()), n.has(r)) {
    console.warn(`[${k}] Cinematic: circular transition detected at "${r}". Stopping chain.`), (S = (w = ui.notifications) == null ? void 0 : w.warn) == null || S.call(w, "Cinematic: circular transition detected, stopping.");
    return;
  }
  n.add(r), (_e == null ? void 0 : _e.status) === "running" && _e.cancel("replaced"), _e = null, Tn && (Tn.abort("replaced"), Tn = null);
  const o = ca(i, t);
  if (!o) {
    console.warn(`[${k}] Cinematic: no cinematic "${t}" on scene ${i}.`);
    return;
  }
  const s = await GE();
  if (!s || ((T = canvas.scene) == null ? void 0 : T.id) !== i || (await Iu(), ((L = canvas.scene) == null ? void 0 : L.id) !== i)) return;
  const { targets: a, unresolved: l } = na(o);
  if (console.log(`[${k}] Cinematic "${t}": resolved ${a.size} targets`), l.length && console.warn(`[${k}] Cinematic "${t}": skipping ${l.length} unresolved: ${l.join(", ")}`), a.size === 0) {
    console.warn(`[${k}] Cinematic "${t}": no targets could be resolved on scene ${i}.`);
    return;
  }
  const u = zw(o);
  uo = Ww(u, a), fo = a;
  const d = qg(i, t), f = new AbortController();
  Tn = f;
  const h = o.synchronized === !0 && game.user.isGM, m = jg(o);
  if (m.length === 0) {
    console.warn(`[${k}] Cinematic "${t}": no segments to execute.`);
    return;
  }
  let p = 0;
  const y = /* @__PURE__ */ new Set();
  if (d) {
    const N = d.completedSegments ?? [];
    for (const x of N) y.add(x);
    const $ = m.indexOf(d.currentSegment);
    $ >= 0 && (p = $, console.log(`[${k}] Cinematic "${t}": resuming from segment "${d.currentSegment}" (${N.length} completed)`));
  }
  if (o.setup)
    try {
      Pe(o.setup, a), canvas.perception.update({ refreshLighting: !0, refreshVision: !0 });
    } catch (N) {
      console.error(`[${k}] Cinematic "${t}": error applying cinematic-level setup:`, N);
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
      if (console.log(`[${k}] Cinematic "${t}": entering segment "${$}"`), pn({ type: "segment-start", segmentName: $ }), jE(i, t, $, [...y]), x.gate) {
        pn({ type: "gate-wait", segmentName: $, gate: x.gate });
        try {
          await WE(x.gate, a, f);
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
          console.error(`[${k}] Cinematic "${t}": error applying setup for segment "${$}":`, P);
        }
      if ((F = x.timeline) != null && F.length) {
        const P = cd(x.timeline);
        pn({ type: "timeline-start", segmentName: $, durationMs: P });
        const { tl: j } = eE(
          { setup: {}, timeline: x.timeline },
          a,
          s,
          {
            timelineName: `cinematic-${i}-${t}-${$}`,
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
          console.error(`[${k}] Cinematic "${t}": error applying landing for segment "${$}":`, P);
        }
      pn({ type: "segment-complete", segmentName: $ }), y.add($);
      const R = x.next;
      if (R && typeof R == "object" && R.scene) {
        const P = R.scene, j = R.segment ?? o.entry;
        console.log(`[${k}] Cinematic "${t}": cross-scene transition to scene ${P}, segment "${j}"`), _e = null, Tn = null, Lu(i, t), wf(), o.tracking !== !1 && await game.user.setFlag(k, Ji(i, t), !0), Li = { sceneId: P, cinematicName: t, visitedChain: n };
        const q = game.scenes.get(P);
        q ? q.view() : (console.warn(`[${k}] Cinematic: cross-scene transition target scene "${P}" not found.`), Li = null);
        return;
      }
    }
  } catch (N) {
    v = !0, console.error(`[${k}] Cinematic "${t}" error on scene ${i}:`, N);
  }
  if (_e = null, Tn = null, Lu(i, t), wf(), uo = null, fo = null, pn({ type: "playback-end", cancelled: !!E }), E) {
    console.log(`[${k}] Cinematic "${t}" cancelled on scene ${i}.`), ua(o, a);
    return;
  }
  if (v) {
    ua(o, a);
    return;
  }
  o.tracking !== !1 && await game.user.setFlag(k, Ji(i, t), !0), console.log(`[${k}] Cinematic "${t}" complete on scene ${i}.`);
}
c(ho, "playCinematic");
async function zE(e, t = "default") {
  var i;
  const n = e ?? ((i = canvas.scene) == null ? void 0 : i.id);
  n && (await game.user.unsetFlag(k, Ji(n, t)), console.log(`[${k}] Cinematic: cleared seen flag for "${t}" on scene ${n}.`));
}
c(zE, "resetCinematic");
async function YE(e, t, n = "default") {
  var o;
  if (!game.user.isGM) return;
  const i = e ?? ((o = canvas.scene) == null ? void 0 : o.id);
  if (!i || !t) return;
  const r = game.users.get(t);
  r && (await r.unsetFlag(k, Ji(i, n)), console.log(`[${k}] Cinematic: cleared seen flag for user ${r.name} on "${n}" scene ${i}.`));
}
c(YE, "resetCinematicForUser");
async function KE(e, t = "default") {
  var o;
  if (!game.user.isGM) return;
  const n = e ?? ((o = canvas.scene) == null ? void 0 : o.id);
  if (!n) return;
  const i = Ji(n, t), r = game.users.map((s) => s.getFlag(k, i) ? s.unsetFlag(k, i) : Promise.resolve());
  await Promise.all(r), console.log(`[${k}] Cinematic: cleared seen flag for all users on "${t}" scene ${n}.`);
}
c(KE, "resetCinematicForAll");
function XE(e, t = "default") {
  var r;
  const n = e ?? ((r = canvas.scene) == null ? void 0 : r.id);
  if (!n) return [];
  const i = Ji(n, t);
  return game.users.map((o) => ({
    userId: o.id,
    name: o.name,
    color: o.color ?? "#888888",
    isGM: o.isGM,
    seen: !!o.getFlag(k, i)
  }));
}
c(XE, "getSeenStatus");
function JE(e, t) {
  var i;
  const n = e ?? ((i = canvas.scene) == null ? void 0 : i.id);
  return t ? ca(n, t) != null : pl(n) != null;
}
c(JE, "hasCinematic");
function QE() {
  if (!uo || !fo) {
    console.warn(`[${k}] Cinematic: no snapshot available for revert.`);
    return;
  }
  (_e == null ? void 0 : _e.status) === "running" && _e.cancel("reverted"), _e = null, Tn && (Tn.abort("reverted"), Tn = null);
  try {
    Pe(uo, fo), canvas.perception.update({ refreshLighting: !0, refreshVision: !0 }), console.log(`[${k}] Cinematic: reverted to pre-cinematic state.`);
  } catch (e) {
    console.error(`[${k}] Cinematic: error during revert:`, e);
  }
  uo = null, fo = null;
}
c(QE, "revertCinematic");
async function ZE() {
  const e = ++ir;
  if (console.log(`[${k}] Cinematic: canvasReady fired, gen=${e}, game.ready=${game.ready}`), await VE(), e !== ir) return;
  console.log(`[${k}] Cinematic: game is ready`);
  const t = canvas.scene;
  if (!t) {
    console.log(`[${k}] Cinematic: no canvas.scene, exiting`);
    return;
  }
  if (Li && Li.sceneId === t.id) {
    const o = Li;
    Li = null, console.log(`[${k}] Cinematic: picking up pending transition to "${o.cinematicName}" on scene ${t.id}`);
    try {
      await ho(t.id, o.cinematicName, o.visitedChain);
    } catch (s) {
      console.error(`[${k}] Cinematic: error during pending transition playback on scene ${t.id}:`, s);
    }
    return;
  }
  Li = null;
  const n = pl(t.id);
  if (!n) {
    console.log(`[${k}] Cinematic: no cinematic flag on scene ${t.id}, exiting`);
    return;
  }
  console.log(`[${k}] Cinematic: found ${Object.keys(n.cinematics).length} cinematic(s) on scene ${t.id}`);
  const i = [];
  for (const [o, s] of Object.entries(n.cinematics))
    (!s.trigger || s.trigger === "canvasReady") && i.push({ name: o, data: s });
  if (i.length === 0) {
    console.log(`[${k}] Cinematic: no canvasReady cinematics on scene ${t.id}, exiting`);
    return;
  }
  for (const { name: o } of i) {
    const s = qg(t.id, o);
    if (e !== ir) return;
    if (s) {
      console.log(`[${k}] Cinematic "${o}": found saved progress at segment "${s.currentSegment}", resuming...`);
      try {
        await ho(t.id, o);
      } catch (a) {
        console.error(`[${k}] Cinematic "${o}": error during resumed playback on scene ${t.id}:`, a);
      }
      return;
    }
  }
  let r = null;
  for (const { name: o, data: s } of i)
    if (!(s.tracking !== !1 && _f(t.id, o))) {
      r = { name: o, data: s };
      break;
    }
  if (!r) {
    if (console.log(`[${k}] Cinematic: all canvasReady cinematics already seen on scene ${t.id}`), eS(t.id, i), (_e == null ? void 0 : _e.status) === "running" && _e.cancel("already-seen"), _e = null, await Iu(), e !== ir) return;
    for (const { name: o, data: s } of i)
      try {
        const { targets: a } = na(s);
        ua(s, a);
      } catch (a) {
        console.error(`[${k}] Cinematic "${o}": error applying landing states (already seen) on scene ${t.id}:`, a);
      }
    canvas.perception.update({ refreshLighting: !0, refreshVision: !0 });
    return;
  }
  if (e === ir && (console.log(`[${k}] Cinematic: playing first unseen cinematic "${r.name}"...`), await Iu(), e === ir)) {
    for (const { name: o, data: s } of i) {
      if (o === r.name) continue;
      if (s.tracking !== !1 && _f(t.id, o))
        try {
          const { targets: l } = na(s);
          ua(s, l);
        } catch (l) {
          console.error(`[${k}] Cinematic "${o}": error applying landing states (already seen) on scene ${t.id}:`, l);
        }
    }
    try {
      await ho(t.id, r.name);
    } catch (o) {
      console.error(`[${k}] Cinematic "${r.name}": error during playback on scene ${t.id}:`, o);
    }
  }
}
c(ZE, "onCanvasReady$3");
function eS(e, t) {
  for (const { name: n } of t)
    Lu(e, n);
}
c(eS, "clearAllCanvasReadyProgress");
function tS(e = 3e5) {
  var i;
  const t = (i = game.user.flags) == null ? void 0 : i[k];
  if (!t) return;
  const n = Date.now();
  for (const r of Object.keys(t)) {
    if (!r.startsWith("cinematic-progress-")) continue;
    const o = t[r];
    if (!o || typeof o.timestamp != "number") {
      game.user.unsetFlag(k, r).catch(() => {
      });
      continue;
    }
    n - o.timestamp > e && (console.log(`[${k}] Cinematic: cleaning up stale progress flag "${r}" (age: ${n - o.timestamp}ms)`), game.user.unsetFlag(k, r).catch(() => {
    }));
  }
}
c(tS, "cleanupStaleProgressFlags");
function nS() {
  Hooks.on("getSceneControlButtons", (e) => {
    if (!game.user.isGM) return;
    const t = Array.isArray(e) ? e : e instanceof Map ? Array.from(e.values()) : Object.values(e);
    if (!t.length) return;
    const n = t.find((s) => (s == null ? void 0 : s.name) === "tiles") ?? t.find((s) => (s == null ? void 0 : s.name) === "tokens" || (s == null ? void 0 : s.name) === "token") ?? t[0];
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
        new yu({ scene: canvas.scene }).render(!0);
      }, "onClick")
    };
    Array.isArray(i) ? i.push(o) : i instanceof Map ? i.set(r, o) : i && typeof i == "object" ? i[r] = o : n.tools = [o];
  });
}
c(nS, "registerEditorButton");
function iS() {
  Hooks.on("canvasReady", ZE), nS(), Hooks.once("ready", () => {
    tS();
    const e = game.modules.get(k);
    e.api || (e.api = {}), e.api.cinematic = {
      play: ho,
      reset: zE,
      resetForUser: YE,
      resetForAll: KE,
      getSeenStatus: XE,
      has: JE,
      get: ca,
      list: UE,
      revert: QE,
      onPlaybackProgress: qE,
      TileAnimator: Xi,
      registerBehaviour: we,
      getBehaviour: $s,
      trigger: /* @__PURE__ */ c(async (t, n, i = "default") => {
        var s;
        const r = n ?? ((s = canvas.scene) == null ? void 0 : s.id);
        if (!r) return;
        const o = ca(r, i);
        o && (o.trigger && o.trigger !== t || await ho(r, i));
      }, "trigger")
    }, console.log(`[${k}] Cinematic API registered (v5).`);
  });
}
c(iS, "registerCinematicHooks");
function ku(e, t) {
  const n = Math.abs(e.width), i = Math.abs(e.height), r = n / 2, o = i / 2;
  let s = t.x - (e.x + r), a = t.y - (e.y + o);
  if (e.rotation !== 0) {
    const l = Math.toRadians(e.rotation), u = Math.cos(l), d = Math.sin(l), f = u * s + d * a, h = u * a - d * s;
    s = f, a = h;
  }
  return s += r, a += o, s >= 0 && s <= n && a >= 0 && a <= i;
}
c(ku, "pointWithinTile");
fl("tile-click", (e, t) => e.target ? new Promise((n, i) => {
  var m;
  if (t.signal.aborted) return i(t.signal.reason ?? "aborted");
  const r = ml(e.target);
  if (!((m = r == null ? void 0 : r.placeables) != null && m.length))
    return i(new Error(`await tile-click: no placeables found for "${e.target}"`));
  const o = r.placeables, s = [];
  for (const { placeable: p } of o) {
    const y = new Xi(p, e.animation);
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
      ku(b.document, E) ? (v = !0, w.state !== "hover" && w.setState("hover")) : w.state === "hover" && w.setState("idle");
    v ? l === null && (l = document.body.style.cursor, document.body.style.cursor = "pointer") : l !== null && (document.body.style.cursor = l, l = null);
  }, "onPointerMove");
  a == null || a.addEventListener("pointermove", u);
  const d = /* @__PURE__ */ c((p) => {
    if (p.button !== 0) return;
    const y = canvas.activeLayer;
    if (!y) return;
    const E = y.toLocal(p);
    isNaN(E.x) || isNaN(E.y) || !o.filter(({ doc: b }) => ku(b, E)).sort((b, w) => (w.doc.sort ?? 0) - (b.doc.sort ?? 0))[0] || (p.stopPropagation(), p.preventDefault(), h(), n());
  }, "onPointerDown");
  a == null || a.addEventListener("pointerdown", d, { capture: !0 });
  const f = /* @__PURE__ */ c(() => {
    h(), i(t.signal.reason ?? "aborted");
  }, "onAbort");
  t.signal.addEventListener("abort", f, { once: !0 });
  function h() {
    a == null || a.removeEventListener("pointerdown", d, { capture: !0 }), a == null || a.removeEventListener("pointermove", u), t.signal.removeEventListener("abort", f);
    for (const { animator: p } of s)
      p.detach();
    l !== null ? (document.body.style.cursor = l, l = null) : document.body.style.cursor = "";
  }
  c(h, "cleanup");
}) : Promise.reject(new Error('await tile-click: "target" is required')));
iS();
function rS() {
  Hooks.once("ready", () => {
    const e = game.modules.get(k);
    e.api || (e.api = {}), e.api.picker = {
      /** Open the picker window. Returns Promise<string[] | null>. */
      open: /* @__PURE__ */ c((t) => la.open(t), "open"),
      /** Resolve a selector string to documents. */
      resolveSelector: ml,
      /** Parse a selector string into { type, value }. */
      parseSelector: ld,
      /** Build a selector string from { type, value }. */
      buildSelector: jw,
      /** Build a tag selector from tags array + mode. */
      buildTagSelector: ig,
      /** Canvas highlight utilities. */
      highlight: {
        add: aa,
        remove: $r,
        has: mg,
        clearAll: Ns
      }
    }, console.log(`[${k}] Placeable Picker API registered.`);
  });
}
c(rS, "registerPlaceablePickerHooks");
rS();
const Xr = "canvas-popup", oS = 100;
function sS(e) {
  const t = canvas.stage.worldTransform, n = document.getElementById("board"), i = n == null ? void 0 : n.getBoundingClientRect(), r = (i == null ? void 0 : i.left) ?? 0, o = (i == null ? void 0 : i.top) ?? 0;
  return {
    x: t.a * e.x + t.c * e.y + t.tx + r,
    y: t.b * e.x + t.d * e.y + t.ty + o
  };
}
c(sS, "canvasToScreen");
function aS() {
  var e, t;
  return ((t = (e = canvas.stage) == null ? void 0 : e.scale) == null ? void 0 : t.x) ?? 1;
}
c(aS, "getZoom");
function Ul(e, t) {
  var n;
  return t === "grid" ? e * (((n = canvas.grid) == null ? void 0 : n.size) ?? 100) : e;
}
c(Ul, "resolveUnit");
function lS(e, t) {
  let n = !1;
  function i(r) {
    n && r.button === 0 && (e.contains(r.target) || t());
  }
  return c(i, "handler"), requestAnimationFrame(() => {
    n = !0;
  }), document.addEventListener("pointerdown", i, !0), () => {
    document.removeEventListener("pointerdown", i, !0);
  };
}
c(lS, "attachClickOutside");
function cS(e, t) {
  let n = !1;
  function i(r) {
    n && r.button === 2 && (e.contains(r.target) || t());
  }
  return c(i, "handler"), requestAnimationFrame(() => {
    n = !0;
  }), document.addEventListener("pointerdown", i, !0), () => {
    document.removeEventListener("pointerdown", i, !0);
  };
}
c(cS, "attachRightClickOutside");
function uS(e, t) {
  function n(i) {
    i.key === "Escape" && (i.preventDefault(), i.stopPropagation(), t());
  }
  return c(n, "handler"), document.addEventListener("keydown", n, !0), () => {
    document.removeEventListener("keydown", n, !0);
  };
}
c(uS, "attachEscape");
const Vl = /* @__PURE__ */ new Set(), fs = 8, Nf = 0.5, Fd = class Fd {
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
  constructor(t = {}) {
    var n, i, r, o, s;
    this._anchor = this._resolveAnchor(t.anchor), this._offset = { x: ((n = t.offset) == null ? void 0 : n.x) ?? 0, y: ((i = t.offset) == null ? void 0 : i.y) ?? 0 }, this._anchorX = t.anchorX ?? "left", this._anchorY = t.anchorY ?? "top", this._sizeUnit = t.sizeUnit ?? "grid", this._dismiss = {
      clickOutside: ((r = t.dismiss) == null ? void 0 : r.clickOutside) ?? !0,
      rightClickOutside: ((o = t.dismiss) == null ? void 0 : o.rightClickOutside) ?? !1,
      escape: ((s = t.dismiss) == null ? void 0 : s.escape) ?? !0
    }, this._cssClass = t.cssClass ?? "", this._animate = t.animate ?? !0, this._width = t.width ?? null, this._clampToViewport = t.clampToViewport ?? !0, this._initialContent = t.content ?? null, this.element = null, this.isOpen = !1, this._cleanups = [], this._listeners = /* @__PURE__ */ new Map(), this._hookId = null, this._tickerFn = null, this._lastScreenPos = { x: -99999, y: -99999 };
  }
  // ── Public API ────────────────────────────────────────────────────────
  /**
   * Append popup to the DOM and start tracking.
   * @returns {this}
   */
  mount() {
    var o;
    if (this.isOpen) return this;
    const t = document.createElement("div");
    t.className = Xr, this._cssClass && t.classList.add(...this._cssClass.split(/\s+/)), t.style.position = "fixed", t.style.zIndex = oS;
    const n = document.createElement("div");
    n.className = `${Xr}__content`, t.appendChild(n), this.element = t, this._contentWrap = n;
    const i = this._resolveWidth();
    i != null && (n.style.width = `${i}px`, n.style.minWidth = "0", n.style.boxSizing = "border-box"), this._initialContent && this.setContent(this._initialContent), document.body.appendChild(t), this.reposition(), this._animate ? requestAnimationFrame(() => {
      this.element && this.element.classList.add(`${Xr}--visible`);
    }) : t.classList.add(`${Xr}--visible`), this._hookId = Hooks.on("canvasPan", () => this.reposition()), this._anchor.placeable && ((o = canvas.app) != null && o.ticker) && (this._tickerFn = () => this.reposition(), canvas.app.ticker.add(this._tickerFn));
    const r = /* @__PURE__ */ c((s) => {
      this._emit("dismiss", s), this.destroy();
    }, "dismissFn");
    return this._dismiss.clickOutside && this._cleanups.push(lS(t, () => r("clickOutside"))), this._dismiss.rightClickOutside && this._cleanups.push(cS(t, () => r("rightClickOutside"))), this._dismiss.escape && this._cleanups.push(uS(t, () => r("escape"))), this.isOpen = !0, Vl.add(this), this._emit("open"), this;
  }
  /**
   * Remove from DOM and clean up everything. Idempotent.
   */
  destroy() {
    var n;
    if (!this.isOpen) return;
    this.isOpen = !1, Vl.delete(this);
    for (const i of this._cleanups) i();
    this._cleanups.length = 0, this._hookId != null && (Hooks.off("canvasPan", this._hookId), this._hookId = null), this._tickerFn && ((n = canvas.app) != null && n.ticker) && (canvas.app.ticker.remove(this._tickerFn), this._tickerFn = null);
    const t = this.element;
    if (t) {
      if (this._animate) {
        t.classList.remove(`${Xr}--visible`);
        const i = /* @__PURE__ */ c(() => {
          t.removeEventListener("transitionend", i), t.remove();
        }, "onEnd");
        t.addEventListener("transitionend", i), setTimeout(() => t.remove(), 200);
      } else
        t.remove();
      this.element = null, this._contentWrap = null, this._emit("close");
    }
  }
  /**
   * Replace inner content.
   * @param {HTMLElement | string} content
   */
  setContent(t) {
    if (!this._contentWrap) {
      this._initialContent = t;
      return;
    }
    this._contentWrap.innerHTML = "", typeof t == "string" ? this._contentWrap.innerHTML = t : t instanceof HTMLElement && this._contentWrap.appendChild(t);
  }
  /**
   * Change the anchor point.
   * @param {{ x: number, y: number } | { placeable: PlaceableObject } | { document: object }} newAnchor
   */
  setAnchor(t) {
    var r, o;
    const n = !!this._anchor.placeable;
    this._anchor = this._resolveAnchor(t);
    const i = !!this._anchor.placeable;
    n && !i && this._tickerFn && ((r = canvas.app) != null && r.ticker) ? (canvas.app.ticker.remove(this._tickerFn), this._tickerFn = null) : !n && i && this.isOpen && ((o = canvas.app) != null && o.ticker) && !this._tickerFn && (this._tickerFn = () => this.reposition(), canvas.app.ticker.add(this._tickerFn)), this._lastScreenPos = { x: -99999, y: -99999 }, this.reposition();
  }
  /**
   * Force recalculate position. Auto-called on canvasPan and ticker.
   */
  reposition() {
    if (!this.element) return;
    const t = this._getAnchorCanvasPoint();
    if (!t) return;
    const n = aS(), i = this._sizeUnit !== "screen", r = Ul(this._offset.x, this._sizeUnit), o = Ul(this._offset.y, this._sizeUnit), s = {
      x: t.x + r,
      y: t.y + o
    }, a = sS(s);
    if (Math.abs(a.x - this._lastScreenPos.x) < Nf && Math.abs(a.y - this._lastScreenPos.y) < Nf)
      return;
    this._lastScreenPos = { x: a.x, y: a.y };
    const l = this.element, u = i ? n : 1;
    i ? (l.style.transformOrigin = `${this._anchorX} ${this._anchorY}`, l.style.transform = `scale(${u})`) : (l.style.transform = "", l.style.transformOrigin = "");
    let d = 0, f = 0;
    const h = l.getBoundingClientRect();
    this._anchorX === "center" ? d = -h.width / 2 : this._anchorX === "right" && (d = -h.width), this._anchorY === "center" ? f = -h.height / 2 : this._anchorY === "bottom" && (f = -h.height);
    let m = a.x + d, p = a.y + f;
    if (this._clampToViewport) {
      const y = window.innerWidth - h.width - fs, E = window.innerHeight - h.height - fs;
      m = Math.max(fs, Math.min(m, y)), p = Math.max(fs, Math.min(p, E));
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
  on(t, n) {
    return this._listeners.has(t) || this._listeners.set(t, /* @__PURE__ */ new Set()), this._listeners.get(t).add(n), this;
  }
  /**
   * Unregister a lifecycle callback.
   * @param {"open" | "close" | "dismiss" | "reposition"} event
   * @param {Function} fn
   * @returns {this}
   */
  off(t, n) {
    var i;
    return (i = this._listeners.get(t)) == null || i.delete(n), this;
  }
  // ── Static ────────────────────────────────────────────────────────────
  /**
   * Destroy all mounted popup instances.
   */
  static destroyAll() {
    for (const t of [...Vl])
      t.destroy();
  }
  // ── Internal ──────────────────────────────────────────────────────────
  /**
   * Normalize anchor input to a consistent internal shape.
   * @param {object} anchor
   * @returns {{ x?: number, y?: number, placeable?: PlaceableObject }}
   */
  _resolveAnchor(t) {
    if (!t) throw new Error("CanvasPopup: anchor is required");
    if (t.placeable) return { placeable: t.placeable };
    if (t.document) {
      const n = t.document.object;
      if (n) return { placeable: n };
      throw new Error("CanvasPopup: anchor.document has no rendered object on the canvas");
    }
    if (t.x != null && t.y != null) return { x: t.x, y: t.y };
    throw new Error("CanvasPopup: anchor must be { x, y }, { placeable }, or { document }");
  }
  /**
   * Resolve the width option to canvas pixels.
   * @returns {number | null}
   */
  _resolveWidth() {
    return this._width == null ? null : this._width === "anchor" ? this._getAnchorSize().width : Ul(this._width, this._sizeUnit);
  }
  /**
   * Get the anchor placeable's canvas-pixel size.
   * Works across tiles, drawings, tokens, etc.
   * @returns {{ width: number, height: number }}
   */
  _getAnchorSize() {
    var i, r, o;
    const t = this._anchor.placeable;
    if (!t) return { width: 0, height: 0 };
    const n = t.document;
    return ((i = n == null ? void 0 : n.shape) == null ? void 0 : i.width) != null ? { width: n.shape.width, height: n.shape.height } : (n == null ? void 0 : n.width) != null ? { width: n.width, height: n.height } : (n == null ? void 0 : n.width) != null ? { width: n.width * (((r = canvas.grid) == null ? void 0 : r.size) ?? 100), height: n.height * (((o = canvas.grid) == null ? void 0 : o.size) ?? 100) } : { width: 0, height: 0 };
  }
  /**
   * Get the current canvas-space anchor point.
   * @returns {{ x: number, y: number } | null}
   */
  _getAnchorCanvasPoint() {
    if (this._anchor.placeable) {
      const t = this._anchor.placeable, n = t.document;
      return n ? { x: n.x ?? t.x ?? 0, y: n.y ?? t.y ?? 0 } : { x: t.x ?? 0, y: t.y ?? 0 };
    }
    return { x: this._anchor.x, y: this._anchor.y };
  }
  /**
   * Emit a lifecycle event.
   * @param {string} event
   * @param  {...any} args
   */
  _emit(t, ...n) {
    const i = this._listeners.get(t);
    if (i)
      for (const r of i)
        try {
          r(this, ...n);
        } catch (o) {
          console.error(`[CanvasPopup] Error in '${t}' listener:`, o);
        }
  }
};
c(Fd, "CanvasPopup");
let da = Fd;
const Ei = "canvas-popup-options";
function dS({ sections: e = [] } = {}) {
  const t = /* @__PURE__ */ new Map(), n = document.createElement("div");
  n.className = Ei;
  for (const a of e) {
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
    const u = t.get(a);
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
    t.has(a) || t.set(a, /* @__PURE__ */ new Set()), t.get(a).add(l);
  }
  c(r, "on");
  function o(a, l) {
    var u;
    (u = t.get(a)) == null || u.delete(l);
  }
  c(o, "off");
  function s() {
    t.clear(), n.remove();
  }
  return c(s, "destroy"), { element: n, on: r, off: o, destroy: s };
}
c(dS, "createOptionList");
function fS() {
  Hooks.once("ready", () => {
    const e = game.modules.get(k);
    e.api || (e.api = {}), e.api.canvasPopup = {
      CanvasPopup: da,
      content: { createOptionList: dS }
    }, console.log(`[${k}] Canvas Popup API registered.`);
  }), Hooks.on("canvasTearDown", () => da.destroyAll());
}
c(fS, "registerCanvasPopupHooks");
fS();
function hS(e, t) {
  const n = e.shape;
  if (!n) return !1;
  const i = e.x ?? 0, r = e.y ?? 0, o = n.width ?? 0, s = n.height ?? 0, a = e.rotation ?? 0, l = i + o / 2, u = r + s / 2;
  let d = t.x - l, f = t.y - u;
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
      return !Array.isArray(h) || h.length < 6 ? !1 : mS(d, f, h);
    }
    case "f":
      return d >= 0 && d <= o && f >= 0 && f <= s;
    default:
      return !1;
  }
}
c(hS, "pointWithinDrawing");
function mS(e, t, n) {
  let i = !1;
  const r = n.length;
  for (let o = 0, s = r - 2; o < r; s = o, o += 2) {
    const a = n[o], l = n[o + 1], u = n[s], d = n[s + 1];
    l > t != d > t && e < (u - a) * (t - l) / (d - l) + a && (i = !i);
  }
  return i;
}
c(mS, "pointInPolygon");
const mo = "eidolon-utilities", gS = "tile-interactions", pS = "tile-animations", yS = "idle-animation";
function bS(e) {
  const t = e.type ?? "tile-prop";
  return t === "tile-tint" ? { name: "tween-tint", fromColor: e.fromColor, toColor: e.toColor, mode: e.mode, period: e.period, easing: e.easing } : t === "tile-scale" ? { name: "tween-scale", fromScale: e.fromScale, toScale: e.toScale, period: e.period, easing: e.easing } : { name: "tween-prop", attribute: e.attribute, from: e.from, to: e.to, period: e.period, easing: e.easing };
}
c(bS, "migrateIdleTweenToAlways");
function dd(e) {
  var u, d, f;
  const t = (u = e == null ? void 0 : e.getFlag) == null ? void 0 : u.call(e, mo, pS);
  if (t) return t;
  const n = (d = e == null ? void 0 : e.getFlag) == null ? void 0 : d.call(e, mo, yS), i = (f = e == null ? void 0 : e.getFlag) == null ? void 0 : f.call(e, mo, gS);
  let r = [], o = [], s = [], a = [];
  if (n) {
    let h;
    Array.isArray(n) ? h = n : typeof n == "object" && "0" in n ? h = Object.values(n) : typeof n == "object" && (n.type || n.attribute) ? h = [n] : h = [], r = h.filter((m) => m && typeof m == "object").map(bS);
  }
  return i && (i.hover && (Array.isArray(i.hover) ? s = i.hover : typeof i.hover == "object" && (o = Array.isArray(i.hover.idle) ? i.hover.idle : [], s = Array.isArray(i.hover.enter) ? i.hover.enter : [])), Array.isArray(i.click) && i.click.length && (a = i.click)), r.length > 0 || o.length > 0 || s.length > 0 || a.length > 0 ? { always: r, idle: o, hover: s, click: a } : null;
}
c(dd, "readUnifiedConfig");
const xn = /* @__PURE__ */ new Map(), hi = /* @__PURE__ */ new Map(), $f = /* @__PURE__ */ new WeakMap(), go = /* @__PURE__ */ new Set();
let Yt = null, st = null, Wt = null, dn = null, fn = null;
function Bg(e) {
  const t = canvas.activeLayer;
  if (!t) return null;
  const n = t.toLocal(e);
  return !n || Number.isNaN(n.x) || Number.isNaN(n.y) ? null : n;
}
c(Bg, "canvasToLocal");
function Ug(e) {
  let t = null, n = -1 / 0;
  for (const [i, r] of xn) {
    if (!(r.placeableType === "drawing" ? hS(r.doc, e) : ku(r.doc, e))) continue;
    const s = (r.doc.sort ?? 0) + (r.placeableType === "drawing" ? 1e9 : 0);
    s > n && (t = r, n = s);
  }
  return t;
}
c(Ug, "hitTest");
function vS(e) {
  var t, n;
  return {
    always: e.always ?? [],
    idle: (t = e.idle) != null && t.length ? e.idle : ["none"],
    hover: (n = e.hover) != null && n.length ? e.hover : ["none"]
  };
}
c(vS, "buildAnimatorConfig");
function fd(e, t, n) {
  ts(e);
  const i = vS(n), r = new Xi(t, i);
  r.start("idle"), hi.set(e, r);
}
c(fd, "startHoverAnimator");
function ts(e) {
  const t = hi.get(e);
  t && (t.detach(), hi.delete(e));
}
c(ts, "stopHoverAnimator");
function Gl(e, t, n, i) {
  return t.type === "tile-tint" ? { uuid: e, toColor: n ? t.toColor : t.fromColor, mode: t.mode } : t.type === "tile-scale" ? {
    uuid: e,
    toScale: n ? t.toScale : t.fromScale,
    ...i
  } : { uuid: e, attribute: t.attribute, value: n ? t.to : t.from };
}
c(Gl, "buildClickParams");
function wS(e) {
  const t = e._source.width, n = e._source.height, i = e._source.x, r = e._source.y;
  return {
    baseWidth: t,
    baseHeight: n,
    centerX: i + t / 2,
    centerY: r + n / 2
  };
}
c(wS, "captureRefGeometry");
async function ES(e, t) {
  const n = e.uuid, i = t.type ?? "tile-prop", r = jr(i);
  if (!r) {
    console.warn(`[${mo}] tile-interactions: unknown tween type "${i}"`);
    return;
  }
  const o = t.period ?? 300, s = t.easing ?? "easeOutCubic", a = t.mode ?? "bounce", l = i === "tile-scale" ? wS(e) : null;
  if (a === "toggle") {
    const d = !($f.get(e) ?? !1);
    await r.execute(
      Gl(n, t, d, l),
      { durationMS: o, easing: s, commit: !0 }
    ), $f.set(e, d);
  } else {
    const u = o / 2;
    await r.execute(
      Gl(n, t, !0, l),
      { durationMS: u, easing: s, commit: !1 }
    ), await r.execute(
      Gl(n, t, !1, l),
      { durationMS: u, easing: s, commit: !1 }
    );
  }
}
c(ES, "playClickAnimation");
async function SS(e) {
  var n, i, r, o, s;
  const t = e.doc.id;
  if (!go.has(t)) {
    go.add(t);
    try {
      if (ts(t), (n = e.clickConfig) != null && n.length) {
        const a = e.clickConfig.map((l) => ES(e.doc, l));
        await Promise.all(a);
      }
      if (e.macroUuid) {
        const a = await fromUuid(e.macroUuid);
        a ? a.execute({ placeable: e.placeable }) : console.warn(`[${mo}] tile-interactions: macro not found: ${e.macroUuid}`);
      }
    } finally {
      go.delete(t), e.animConfig && (((i = e.animConfig.always) == null ? void 0 : i.length) > 0 || ((r = e.animConfig.idle) == null ? void 0 : r.length) > 0 || ((o = e.animConfig.hover) == null ? void 0 : o.length) > 0) && (fd(t, e.placeable, e.animConfig), Yt === t && ((s = hi.get(t)) == null || s.setState("hover")));
    }
  }
}
c(SS, "handleClick");
function Vg(e) {
  var l, u, d;
  const t = Bg(e);
  if (!t) return;
  const n = Ug(t), i = (n == null ? void 0 : n.doc.id) ?? null;
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
c(Vg, "onPointerMove");
function Gg(e) {
  var i, r;
  if (e.button !== 0 || !((i = canvas.tokens) != null && i.active)) return;
  const t = Bg(e);
  if (!t) return;
  const n = Ug(t);
  n && (!((r = n.clickConfig) != null && r.length) && !n.macroUuid || SS(n));
}
c(Gg, "onPointerDown");
function Wg() {
  if (Yt) {
    const e = hi.get(Yt);
    e && e.setState("idle"), Yt = null;
  }
  if (st !== null) {
    const e = document.getElementById("board");
    e && (e.style.cursor = st), st = null;
  }
}
c(Wg, "onPointerLeave");
function Ff(e, t, n) {
  var a, l, u;
  const i = dd(e);
  if (!i) return;
  const r = ((a = i.always) == null ? void 0 : a.length) > 0 || ((l = i.idle) == null ? void 0 : l.length) > 0 || ((u = i.hover) == null ? void 0 : u.length) > 0, o = Array.isArray(i.click) && i.click.length ? i.click : null, s = i.macro || null;
  !r && !o && !s || (xn.set(e.id, { doc: e, placeable: t, animConfig: i, clickConfig: o, macroUuid: s, placeableType: n }), r && fd(e.id, t, i));
}
c(Ff, "registerPlaceable");
function yl() {
  var i, r;
  for (const o of hi.keys())
    ts(o);
  if (xn.clear(), go.clear(), Yt = null, st !== null) {
    const o = document.getElementById("board");
    o && (o.style.cursor = st), st = null;
  }
  const e = document.getElementById("board");
  Wt && (e == null || e.removeEventListener("pointermove", Wt), Wt = null), dn && (e == null || e.removeEventListener("pointerdown", dn), dn = null), fn && (e == null || e.removeEventListener("pointerleave", fn), fn = null);
  const t = (i = canvas.tiles) == null ? void 0 : i.placeables;
  if (Array.isArray(t))
    for (const o of t)
      Ff(o.document, o, "tile");
  const n = (r = canvas.drawings) == null ? void 0 : r.placeables;
  if (Array.isArray(n))
    for (const o of n)
      Ff(o.document, o, "drawing");
  xn.size !== 0 && (Wt = Vg, dn = Gg, fn = Wg, e == null || e.addEventListener("pointermove", Wt), e == null || e.addEventListener("pointerdown", dn), e == null || e.addEventListener("pointerleave", fn));
}
c(yl, "rebuild");
function CS() {
  yl();
}
c(CS, "refreshInteractions");
function zg(e) {
  Kg(e, "tile");
}
c(zg, "updateTile");
function TS(e) {
  hd(e);
}
c(TS, "removeTile");
function Yg(e) {
  Kg(e, "drawing");
}
c(Yg, "updateDrawing");
function LS(e) {
  hd(e);
}
c(LS, "removeDrawing");
function Kg(e, t) {
  var l, u, d;
  const n = e.id, i = dd(e), r = i && (((l = i.always) == null ? void 0 : l.length) > 0 || ((u = i.idle) == null ? void 0 : u.length) > 0 || ((d = i.hover) == null ? void 0 : d.length) > 0), o = i && Array.isArray(i.click) && i.click.length ? i.click : null, s = (i == null ? void 0 : i.macro) || null;
  if (!r && !o && !s) {
    hd(e);
    return;
  }
  ts(n);
  const a = e.object;
  if (!a) {
    xn.delete(n);
    return;
  }
  xn.set(n, { doc: e, placeable: a, animConfig: i, clickConfig: o, macroUuid: s, placeableType: t }), r && fd(n, a, i), IS();
}
c(Kg, "updatePlaceable");
function hd(e) {
  const t = e.id;
  if (ts(t), xn.delete(t), go.delete(t), Yt === t && (Yt = null, st !== null)) {
    const n = document.getElementById("board");
    n && (n.style.cursor = st), st = null;
  }
  if (xn.size === 0) {
    const n = document.getElementById("board");
    Wt && (n == null || n.removeEventListener("pointermove", Wt), Wt = null), dn && (n == null || n.removeEventListener("pointerdown", dn), dn = null), fn && (n == null || n.removeEventListener("pointerleave", fn), fn = null);
  }
}
c(hd, "removePlaceable");
function IS() {
  if (xn.size === 0 || Wt) return;
  const e = document.getElementById("board");
  e && (Wt = Vg, dn = Gg, fn = Wg, e.addEventListener("pointermove", Wt), e.addEventListener("pointerdown", dn), e.addEventListener("pointerleave", fn));
}
c(IS, "ensureListeners");
function sr(e, t, n) {
  const i = document.createElement("div");
  i.classList.add("form-group");
  const r = document.createElement("label");
  r.textContent = e;
  const o = document.createElement("select");
  o.classList.add(t);
  for (const s of n) {
    const a = document.createElement("option");
    a.value = s.value, a.textContent = s.label, s.selected && (a.selected = !0), o.appendChild(a);
  }
  return i.append(r, o), i;
}
c(sr, "buildSelectGroup");
function ar(e, t, n, i = {}) {
  const r = document.createElement("div");
  r.classList.add("form-group");
  const o = document.createElement("label");
  o.textContent = e;
  const s = document.createElement("input");
  s.type = "number", s.classList.add(t), s.value = String(n);
  for (const [a, l] of Object.entries(i)) s.setAttribute(a, l);
  return r.append(o, s), r;
}
c(ar, "buildNumberGroup");
function Ou(e, t, n) {
  const i = document.createElement("div");
  i.classList.add("form-group");
  const r = document.createElement("label");
  r.textContent = e;
  const o = document.createElement("div");
  o.classList.add("idle-anim__color-wrapper");
  const s = document.createElement("input");
  s.type = "color", s.classList.add(t), s.value = n;
  const a = document.createElement("input");
  return a.type = "text", a.classList.add(`${t}-text`), a.value = n, a.maxLength = 7, s.addEventListener("input", () => {
    a.value = s.value;
  }), a.addEventListener("change", () => {
    /^#[0-9a-f]{6}$/i.test(a.value) && (s.value = a.value);
  }), o.append(s, a), i.append(r, o), i;
}
c(Ou, "buildColorGroup");
let le = null;
function Wl() {
  for (const e of document.querySelectorAll(".idle-anim__slot--insert-before, .idle-anim__slot--insert-after"))
    e.classList.remove("idle-anim__slot--insert-before", "idle-anim__slot--insert-after");
}
c(Wl, "clearInsertIndicators");
function Df(e) {
  for (const t of document.querySelectorAll(".idle-anim__slots"))
    t.classList.toggle("idle-anim__slots--drag-active", e);
}
c(Df, "setDragActive");
function fa(e, t) {
  e.dispatchEvent(new CustomEvent("slot-reorder", { detail: { card: t } }));
}
c(fa, "notifyReorder");
function Xg(e, { dropGroup: t, handleSelector: n = ".idle-anim__slot-header" }) {
  e.setAttribute("draggable", "true");
  let i = !1;
  e.addEventListener("pointerdown", (r) => {
    i = !!r.target.closest(n);
  }), e.addEventListener("dragstart", (r) => {
    if (!i) {
      r.preventDefault();
      return;
    }
    le = { card: e, sourceContainer: e.parentElement, group: t, insertMode: null, insertTarget: null }, e.classList.add("is-dragging"), Df(!0), r.dataTransfer.effectAllowed = "move", r.dataTransfer.setData("text/plain", "");
  }), e.addEventListener("dragover", (r) => {
    if (!le || le.group !== t || le.card === e) return;
    r.preventDefault(), r.dataTransfer.dropEffect = "move";
    const o = e.getBoundingClientRect(), s = o.top + o.height / 2, a = r.clientY < s ? "before" : "after";
    (le.insertTarget !== e || le.insertMode !== a) && (Wl(), e.classList.add(a === "before" ? "idle-anim__slot--insert-before" : "idle-anim__slot--insert-after"), le.insertTarget = e, le.insertMode = a);
  }), e.addEventListener("dragleave", () => {
    e.classList.remove("idle-anim__slot--insert-before", "idle-anim__slot--insert-after"), (le == null ? void 0 : le.insertTarget) === e && (le.insertTarget = null, le.insertMode = null);
  }), e.addEventListener("drop", (r) => {
    if (r.preventDefault(), r.stopPropagation(), Wl(), !le || le.group !== t || le.card === e) return;
    const o = le.card, s = le.sourceContainer, a = e.parentElement;
    le.insertMode === "after" ? a.insertBefore(o, e.nextSibling) : a.insertBefore(o, e), fa(a, o), s !== a && fa(s, o), le = null;
  }), e.addEventListener("dragend", () => {
    e.classList.remove("is-dragging"), Wl(), Df(!1);
    for (const r of document.querySelectorAll(".idle-anim__slots--drag-over"))
      r.classList.remove("idle-anim__slots--drag-over");
    le = null;
  });
}
c(Xg, "makeDraggable");
function Jg(e, { dropGroup: t, onDrop: n }) {
  e.addEventListener("dragover", (i) => {
    !le || le.group !== t || (i.preventDefault(), i.dataTransfer.dropEffect = "move");
  }), e.addEventListener("dragenter", (i) => {
    !le || le.group !== t || (i.preventDefault(), e.classList.add("idle-anim__slots--drag-over"));
  }), e.addEventListener("dragleave", (i) => {
    i.relatedTarget && e.contains(i.relatedTarget) || e.classList.remove("idle-anim__slots--drag-over");
  }), e.addEventListener("drop", (i) => {
    if (i.preventDefault(), e.classList.remove("idle-anim__slots--drag-over"), !le || le.group !== t) return;
    const r = le.card, o = le.sourceContainer;
    e.appendChild(r), fa(e, r), o !== e && fa(o, r), le = null;
  }), e.addEventListener("slot-reorder", (i) => {
    n == null || n(i.detail.card, e);
  });
}
c(Jg, "makeDropContainer");
const hs = "eidolon-utilities", Pf = "tile-animations", kS = "tile-interactions", OS = "idle-animation", AS = "eidolon-idle-animation", MS = "fa-solid fa-wave-pulse", Qg = [
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
], xS = [
  { value: "tween-prop", label: "Numeric" },
  { value: "tween-tint", label: "Tint" },
  { value: "tween-scale", label: "Scale" }
], Zg = {
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
}, mr = {
  fromColor: "#ffffff",
  toColor: "#ffaa00",
  period: 500,
  mode: "bounce"
}, Ds = {
  type: "tile-scale",
  fromScale: 1,
  toScale: 1.2,
  period: 300,
  easing: "easeOutCubic",
  mode: "bounce"
}, ep = [
  { value: "alpha", label: "Alpha (Opacity)" },
  { value: "rotation", label: "Rotation" },
  { value: "texture.rotation", label: "Texture Rotation" }
];
let Rn = null;
function _S(e) {
  var t;
  return (e == null ? void 0 : e.document) ?? ((t = e == null ? void 0 : e.object) == null ? void 0 : t.document) ?? (e == null ? void 0 : e.object) ?? null;
}
c(_S, "getPlaceableDocument");
function NS(e, t) {
  const n = document.createElement("div");
  n.classList.add("form-group");
  const i = document.createElement("label");
  i.textContent = "Type", n.appendChild(i);
  const r = document.createElement("select");
  r.classList.add(t);
  const o = document.createElement("optgroup");
  o.label = "Effects";
  for (const a of Qg) {
    const l = document.createElement("option");
    l.value = a.value, l.textContent = a.label, a.value === e && (l.selected = !0), o.appendChild(l);
  }
  r.appendChild(o);
  const s = document.createElement("optgroup");
  s.label = "Tweens";
  for (const a of xS) {
    const l = document.createElement("option");
    l.value = a.value, l.textContent = a.label, a.value === e && (l.selected = !0), s.appendChild(l);
  }
  return r.appendChild(s), n.appendChild(r), n;
}
c(NS, "buildEffectTypeSelect");
function Rf(e) {
  if (!e) return "";
  const t = e.name ?? "float";
  if (t === "tween-prop")
    return `Tween ${e.attribute ?? "alpha"} ${e.from ?? "?"}→${e.to ?? "?"} (${e.period ?? "?"}ms)`;
  if (t === "tween-tint")
    return `Tween Tint ${e.fromColor ?? "?"}→${e.toColor ?? "?"} (${e.period ?? "?"}ms)`;
  if (t === "tween-scale") {
    const i = e.fromScale != null ? `${Math.round(e.fromScale * 100)}%` : "?", r = e.toScale != null ? `${Math.round(e.toScale * 100)}%` : "?";
    return `Tween Scale ${i}→${r} (${e.period ?? "?"}ms)`;
  }
  const n = Qg.find((i) => i.value === t);
  return (n == null ? void 0 : n.label) ?? t;
}
c(Rf, "summarizeEffectConfig");
function Hf(e, t, n, i) {
  const r = e.name ?? "float", o = rd(), s = _r(), a = document.createElement("div");
  a.classList.add("idle-anim__slot", "is-collapsed", n), a.dataset.index = String(t);
  const l = document.createElement("div");
  l.classList.add("idle-anim__slot-header");
  const u = document.createElement("i");
  u.classList.add("fa-solid", "fa-chevron-right", "idle-anim__slot-chevron");
  const d = document.createElement("span");
  d.classList.add("idle-anim__slot-title"), d.textContent = `${i} ${t + 1}`;
  const f = document.createElement("span");
  f.classList.add("idle-anim__slot-summary"), f.textContent = Rf(e);
  const h = document.createElement("button");
  h.type = "button", h.classList.add("idle-anim__slot-remove"), h.innerHTML = '<i class="fa-solid fa-xmark"></i>', h.title = "Remove effect", l.append(u, d, f, h), a.appendChild(l);
  const m = document.createElement("div");
  m.classList.add("idle-anim__slot-body");
  const p = NS(r, "ti-effect__type");
  m.appendChild(p);
  const y = document.createElement("div");
  y.classList.add("idle-anim__type-fields"), m.appendChild(y);
  function E(b, w) {
    y.innerHTML = "";
    const S = Zg[b];
    if (S)
      for (const T of S) {
        const L = w[T.key] ?? T.default;
        if (T.type === "color")
          y.appendChild(Ou(T.label, `ti-effect__${T.key}`, L));
        else if (T.type === "select") {
          let A;
          T.options === "interpolation" ? A = s.map((M) => ({ value: M, label: M, selected: M === L })) : Array.isArray(T.options) ? A = T.options.map((M) => ({ value: M.value, label: M.label, selected: M.value === L })) : A = o.map((M) => ({ value: M, label: M, selected: M === L })), y.appendChild(sr(T.label, `ti-effect__${T.key}`, A));
        } else
          y.appendChild(ar(T.label, `ti-effect__${T.key}`, L, T.attrs ?? {}));
      }
  }
  c(E, "renderParams"), E(r, e), a.appendChild(m);
  const v = a.querySelector(".ti-effect__type");
  return v == null || v.addEventListener("change", () => {
    E(v.value, {});
  }), l.addEventListener("click", (b) => {
    if (!b.target.closest(".idle-anim__slot-remove") && (a.classList.toggle("is-collapsed"), a.classList.contains("is-collapsed"))) {
      const w = tp(a);
      w && (f.textContent = Rf(w));
    }
  }), h.addEventListener("click", (b) => {
    b.stopPropagation();
    const w = a.parentElement;
    a.remove(), w && bl(w, n, i);
  }), Xg(a, { dropGroup: "effect" }), a;
}
c(Hf, "buildEffectSlot");
function tp(e) {
  var r;
  const t = ((r = e.querySelector(".ti-effect__type")) == null ? void 0 : r.value) ?? "float", n = Zg[t], i = { name: t };
  if (n)
    for (const o of n) {
      const s = e.querySelector(`.ti-effect__${o.key}`);
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
c(tp, "readEffectSlot");
function qf(e) {
  if (!e) return "";
  const t = e.type ?? "tile-prop", n = e.mode ?? "bounce", i = n.charAt(0).toUpperCase() + n.slice(1);
  if (t === "tile-tint")
    return `${i} Tint ${e.fromColor ?? "?"} → ${e.toColor ?? "?"} (${e.period ?? "?"}ms)`;
  if (t === "tile-scale") {
    const s = e.fromScale != null ? `${Math.round(e.fromScale * 100)}%` : "?", a = e.toScale != null ? `${Math.round(e.toScale * 100)}%` : "?";
    return `${i} Scale ${s} → ${a} (${e.period ?? "?"}ms)`;
  }
  const r = ep.find((s) => s.value === e.attribute), o = (r == null ? void 0 : r.label) ?? e.attribute ?? "?";
  return `${i} ${o} ${e.from ?? "?"} → ${e.to ?? "?"} (${e.period ?? "?"}ms)`;
}
c(qf, "summarizeClickConfig");
function jf(e, t) {
  const n = e.type ?? "tile-prop", i = e.mode ?? "bounce", r = rd(), o = document.createElement("div");
  o.classList.add("idle-anim__slot", "is-collapsed", "ti-click-slot"), o.dataset.index = String(t);
  const s = document.createElement("div");
  s.classList.add("idle-anim__slot-header");
  const a = document.createElement("i");
  a.classList.add("fa-solid", "fa-chevron-right", "idle-anim__slot-chevron");
  const l = document.createElement("span");
  l.classList.add("idle-anim__slot-title"), l.textContent = `Animation ${t + 1}`;
  const u = document.createElement("span");
  u.classList.add("idle-anim__slot-summary"), u.textContent = qf(e);
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
      const S = _r(), T = w.fromColor ?? mr.fromColor, L = w.toColor ?? mr.toColor, A = w.mode ?? "oklch", M = document.createElement("div");
      M.classList.add("idle-anim__range-row"), M.appendChild(Ou("From", "ti-click__from-color", T)), M.appendChild(Ou("To", "ti-click__to-color", L)), m.appendChild(M), m.appendChild(sr(
        "Interpolation",
        "ti-click__color-mode",
        S.map((F) => ({ value: F, label: F, selected: F === A }))
      ));
    } else if (b === "tile-scale") {
      const S = w.fromScale ?? Ds.fromScale, T = w.toScale ?? Ds.toScale, L = document.createElement("div");
      L.classList.add("idle-anim__range-row"), L.appendChild(ar("From", "ti-click__from-scale", S, { step: "0.01", min: "0.01" })), L.appendChild(ar("To", "ti-click__to-scale", T, { step: "0.01", min: "0.01" })), m.appendChild(L);
      const A = document.createElement("p");
      A.classList.add("idle-anim__hint"), A.textContent = "1.0 = original size. Scales from center.", m.appendChild(A);
    } else {
      const S = w.attribute ?? lr.attribute, T = w.from ?? lr.from, L = w.to ?? lr.to;
      m.appendChild(sr(
        "Attribute",
        "ti-click__attribute",
        ep.map((M) => ({ value: M.value, label: M.label, selected: M.value === S }))
      ));
      const A = document.createElement("div");
      A.classList.add("idle-anim__range-row"), A.appendChild(ar("From", "ti-click__from", T, { step: "0.01" })), A.appendChild(ar("To", "ti-click__to", L, { step: "0.01" })), m.appendChild(A);
    }
  }
  c(p, "renderTypeFields"), p(n, e);
  const y = e.period ?? (n === "tile-tint" ? mr.period : lr.period), E = e.easing ?? "easeOutCubic";
  f.appendChild(ar("Period (ms)", "ti-click__period", y, { min: "50", step: "50" })), f.appendChild(sr(
    "Easing",
    "ti-click__easing",
    r.map((b) => ({ value: b, label: b, selected: b === E }))
  )), o.appendChild(f);
  const v = o.querySelector(".ti-click__type");
  return v == null || v.addEventListener("change", () => {
    const b = v.value;
    p(b, b === "tile-tint" ? mr : b === "tile-scale" ? Ds : lr);
  }), s.addEventListener("click", (b) => {
    if (!b.target.closest(".idle-anim__slot-remove") && (o.classList.toggle("is-collapsed"), o.classList.contains("is-collapsed"))) {
      const w = np(o);
      w && (u.textContent = qf(w));
    }
  }), d.addEventListener("click", (b) => {
    b.stopPropagation();
    const w = o.parentElement;
    o.remove(), w && bl(w, "ti-click-slot", "Animation");
  }), Xg(o, { dropGroup: "click" }), o;
}
c(jf, "buildClickSlot");
function np(e) {
  var u, d, f, h, m, p, y, E, v, b, w, S, T, L;
  const t = ((u = e.querySelector(".ti-click__type")) == null ? void 0 : u.value) ?? "tile-prop", n = ((d = e.querySelector(".ti-click__mode")) == null ? void 0 : d.value) ?? "bounce", i = Number.parseInt((f = e.querySelector(".ti-click__period")) == null ? void 0 : f.value, 10), r = ((h = e.querySelector(".ti-click__easing")) == null ? void 0 : h.value) ?? "easeOutCubic";
  if (!i || i <= 0) return null;
  const o = { mode: n, period: i, easing: r };
  if (t === "tile-tint") {
    const A = ((m = e.querySelector(".ti-click__from-color")) == null ? void 0 : m.value) ?? ((p = e.querySelector(".ti-click__from-color-text")) == null ? void 0 : p.value) ?? mr.fromColor, M = ((y = e.querySelector(".ti-click__to-color")) == null ? void 0 : y.value) ?? ((E = e.querySelector(".ti-click__to-color-text")) == null ? void 0 : E.value) ?? mr.toColor, F = ((v = e.querySelector(".ti-click__color-mode")) == null ? void 0 : v.value) ?? "oklch";
    return { type: "tile-tint", fromColor: A, toColor: M, mode: F, ...o };
  }
  if (t === "tile-scale") {
    const A = Number.parseFloat((b = e.querySelector(".ti-click__from-scale")) == null ? void 0 : b.value), M = Number.parseFloat((w = e.querySelector(".ti-click__to-scale")) == null ? void 0 : w.value);
    return Number.isNaN(A) || Number.isNaN(M) || A <= 0 || M <= 0 ? null : { type: "tile-scale", fromScale: A, toScale: M, ...o };
  }
  const s = ((S = e.querySelector(".ti-click__attribute")) == null ? void 0 : S.value) ?? lr.attribute, a = Number.parseFloat((T = e.querySelector(".ti-click__from")) == null ? void 0 : T.value), l = Number.parseFloat((L = e.querySelector(".ti-click__to")) == null ? void 0 : L.value);
  return Number.isNaN(a) || Number.isNaN(l) ? null : { type: "tile-prop", attribute: s, from: a, to: l, ...o };
}
c(np, "readClickSlot");
function bl(e, t, n) {
  e.querySelectorAll(`.${t}`).forEach((r, o) => {
    r.dataset.index = String(o);
    const s = r.querySelector(".idle-anim__slot-title");
    s && (s.textContent = `${n} ${o + 1}`);
  });
}
c(bl, "renumberSlots");
function zl(e, { heading: t, hint: n, configs: i, slotClass: r, titlePrefix: o, dropGroup: s, defaultEffect: a }) {
  const l = document.createElement("div");
  l.classList.add("ti-section-heading");
  const u = document.createElement("h3");
  u.textContent = t, l.appendChild(u);
  const d = document.createElement("div");
  d.classList.add("idle-anim__slots", `${r}s`);
  const f = document.createElement("button");
  f.type = "button", f.classList.add("ti-section-heading__add"), f.innerHTML = '<i class="fa-solid fa-plus"></i>', f.title = `Add ${t.toLowerCase()} effect`, f.addEventListener("click", () => {
    const p = d.querySelectorAll(`.${r}`).length, y = Hf(a, p, r, o);
    y.classList.remove("is-collapsed"), d.appendChild(y);
  }), l.appendChild(f), e.appendChild(l);
  const h = document.createElement("p");
  h.classList.add("idle-anim__hint"), h.textContent = n, e.appendChild(h);
  for (let p = 0; p < i.length; p++)
    d.appendChild(Hf(i[p], p, r, o));
  e.appendChild(d);
  const m = ["ti-always-slot", "ti-idle-slot", "ti-hover-slot"];
  return Jg(d, {
    dropGroup: s,
    onDrop(p) {
      if (p.parentElement === d)
        for (const y of m)
          y !== r && p.classList.contains(y) && p.classList.replace(y, r);
      bl(d, r, o);
    }
  }), d;
}
c(zl, "buildEffectCategory");
function $S(e) {
  const t = dd(e) ?? { always: [], idle: [], hover: [], click: [] }, n = document.createElement("section");
  n.classList.add("eidolon-tile-interactions"), zl(n, {
    heading: "Always",
    hint: "Runs continuously, ignores pointer state.",
    configs: t.always ?? [],
    slotClass: "ti-always-slot",
    titlePrefix: "Effect",
    dropGroup: "effect",
    defaultEffect: { name: "embers" }
  }), zl(n, {
    heading: "Idle",
    hint: "Plays by default. Stops when pointer enters the tile.",
    configs: t.idle ?? [],
    slotClass: "ti-idle-slot",
    titlePrefix: "Effect",
    dropGroup: "effect",
    defaultEffect: { name: "float" }
  }), zl(n, {
    heading: "Hover",
    hint: "Plays while pointer is over the tile.",
    configs: t.hover ?? [],
    slotClass: "ti-hover-slot",
    titlePrefix: "Effect",
    dropGroup: "effect",
    defaultEffect: { name: "scale" }
  });
  const i = document.createElement("div");
  i.classList.add("ti-section-heading");
  const r = document.createElement("h3");
  r.textContent = "Click", i.appendChild(r);
  const o = t.click ?? [], s = document.createElement("div");
  s.classList.add("idle-anim__slots", "ti-click-slots");
  const a = document.createElement("button");
  a.type = "button", a.classList.add("ti-section-heading__add"), a.innerHTML = '<i class="fa-solid fa-plus"></i>', a.title = "Add click animation", a.addEventListener("click", () => {
    const T = s.querySelectorAll(".ti-click-slot").length, L = jf(Ds, T);
    L.classList.remove("is-collapsed"), s.appendChild(L);
  }), i.appendChild(a), n.appendChild(i);
  const l = document.createElement("p");
  l.classList.add("idle-anim__hint"), l.textContent = "One-shot animation on click.", n.appendChild(l);
  for (let T = 0; T < o.length; T++)
    s.appendChild(jf(o[T], T));
  n.appendChild(s), Jg(s, {
    dropGroup: "click",
    onDrop() {
      bl(s, "ti-click-slot", "Animation");
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
  m.type = "checkbox", m.classList.add("ti-cursor-check"), m.checked = t.cursor ?? !1, f.append(h, m), n.appendChild(f);
  const p = document.createElement("p");
  p.classList.add("idle-anim__hint"), p.textContent = "Execute a macro when clicked. Drag a macro here or paste its UUID.", n.appendChild(p);
  const y = document.createElement("div");
  y.classList.add("form-group", "ti-macro");
  const E = document.createElement("label");
  E.textContent = "Macro", y.appendChild(E);
  const v = document.createElement("input");
  v.type = "text", v.classList.add("ti-macro__uuid"), v.placeholder = "Drag a macro here or paste UUID", v.value = t.macro ?? "", y.appendChild(v);
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
c($S, "buildSectionContent");
function Yl(e, t) {
  const n = [];
  for (const i of e.querySelectorAll(`.${t}`)) {
    const r = tp(i);
    r && n.push(r);
  }
  return n;
}
c(Yl, "readAllEffectSlots");
function FS(e) {
  const t = [];
  for (const n of e.querySelectorAll(".ti-click-slot")) {
    const i = np(n);
    i && t.push(i);
  }
  return t;
}
c(FS, "readAllClickConfigs");
function Bf(e) {
  var r, o, s;
  const t = ((o = (r = e.querySelector(".ti-macro__uuid")) == null ? void 0 : r.value) == null ? void 0 : o.trim()) || null, n = ((s = e.querySelector(".ti-cursor-check")) == null ? void 0 : s.checked) ?? !1, i = {
    always: Yl(e, "ti-always-slot"),
    idle: Yl(e, "ti-idle-slot"),
    hover: Yl(e, "ti-hover-slot"),
    click: FS(e)
  };
  return t && (i.macro = t), n && (i.cursor = !0), i;
}
c(Bf, "readFormConfig");
function ip(e, t) {
  var l;
  const n = He(t);
  if (!n) return;
  const i = _S(e);
  if (!i) return;
  const r = td(e, n, AS, "Animations", MS);
  if (!r || r.querySelector(".eidolon-tile-interactions")) return;
  const o = r.closest("form");
  o && (o.noValidate = !0);
  const s = $S(i);
  r.appendChild(s), (l = e.setPosition) == null || l.call(e, { height: "auto" });
  const a = r.querySelector(".idle-anim__preview");
  a == null || a.addEventListener("click", () => {
    const u = i.object;
    if (!u) return;
    if (Rn) {
      Rn.detach(), Rn = null, a.classList.remove("is-active"), a.innerHTML = '<i class="fa-solid fa-play"></i> Preview';
      return;
    }
    const d = Bf(s);
    (d.always.length > 0 || d.idle.length > 0 || d.hover.length > 0) && (Rn = new Xi(u, d), Rn.start("idle"), a.classList.add("is-active"), a.innerHTML = '<i class="fa-solid fa-stop"></i> Stop');
  }), o && o.addEventListener("submit", () => {
    Rn && (Rn.detach(), Rn = null);
    const u = Bf(s), d = u.always.length > 0 || u.idle.length > 0 || u.hover.length > 0 || u.click.length > 0 || !!u.macro || !!u.cursor, f = {
      [`flags.${hs}.-=${Pf}`]: null,
      [`flags.${hs}.-=${kS}`]: null,
      [`flags.${hs}.-=${OS}`]: null
    };
    i.update(f).then(() => {
      if (d)
        return i.update({ [`flags.${hs}.${Pf}`]: u });
    });
  });
}
c(ip, "renderAnimationSection");
const ha = /* @__PURE__ */ new Map();
function rp(e) {
  const t = ha.get(e);
  t && (t.controller.abort(), ha.delete(e), t.restore());
}
c(rp, "stopLoopByKey");
function op(e) {
  const t = `${e}::`;
  for (const n of [...ha.keys()])
    n.startsWith(t) && rp(n);
}
c(op, "stopLoopsForTile");
function sp() {
  for (const e of [...ha.keys()])
    rp(e);
}
c(sp, "stopAllLoops");
const ma = "eidolon-utilities", ap = ["tile-animations", "tile-interactions", "idle-animation"];
function DS() {
  sp(), yl();
}
c(DS, "onCanvasTearDown");
function PS() {
  sp(), yl();
}
c(PS, "onCanvasReady$2");
function RS(e, t) {
  var r;
  const n = (r = t == null ? void 0 : t.flags) == null ? void 0 : r[ma];
  !n || !ap.some((o) => o in n || `-=${o}` in n) || (op(e.id), zg(e));
}
c(RS, "onUpdateTile");
function HS(e) {
  zg(e);
}
c(HS, "onCreateTile");
function qS(e) {
  op(e.id), TS(e);
}
c(qS, "onDeleteTile");
function jS(e, t) {
  ip(e, t);
}
c(jS, "onRenderTileConfig");
function BS(e, t) {
  var r;
  const n = (r = t == null ? void 0 : t.flags) == null ? void 0 : r[ma];
  !n || !ap.some((o) => o in n || `-=${o}` in n) || Yg(e);
}
c(BS, "onUpdateDrawing");
function US(e) {
  Yg(e);
}
c(US, "onCreateDrawing");
function VS(e) {
  LS(e);
}
c(VS, "onDeleteDrawing");
function GS(e, t) {
  ip(e, t);
}
c(GS, "onRenderDrawingConfig");
function WS() {
  Hooks.on("canvasTearDown", DS), Hooks.on("canvasReady", PS), Hooks.on("createTile", HS), Hooks.on("updateTile", RS), Hooks.on("deleteTile", qS), Hooks.on("renderTileConfig", jS), Hooks.on("createDrawing", US), Hooks.on("updateDrawing", BS), Hooks.on("deleteDrawing", VS), Hooks.on("renderDrawingConfig", GS), Hooks.once("ready", () => {
    const e = game.modules.get(ma);
    e && (e.api || (e.api = {}), e.api.tileInteractions = {
      rebuild: yl,
      refresh: CS
    }, console.log(`[${ma}] Tile Interactions API registered.`));
  });
}
c(WS, "registerTileInteractionHooks");
WS();
const ga = /* @__PURE__ */ new Map();
function md(e, t) {
  ga.has(e) && console.warn(`[eidolon-utilities] Door-link behavior "${e}" is already registered. Overwriting.`), ga.set(e, t);
}
c(md, "registerBehavior");
function lp(e) {
  return ga.get(e);
}
c(lp, "getBehavior");
function vl() {
  return ga;
}
c(vl, "getAllBehaviors");
const zS = {
  label: "Reflect",
  icon: "fa-solid fa-arrows-left-right",
  description: "Wall fully disappears when door opens.",
  highlightColor: 16739115,
  apply() {
    return { light: 0, move: 0, sight: 0, sound: 0 };
  },
  revert(e, t) {
    return { ...t };
  }
}, YS = {
  label: "Pass-thru",
  icon: "fa-solid fa-person-walking-dashed-line-arrow-right",
  description: "Wall allows movement when door opens, keeps other restrictions.",
  highlightColor: 14263361,
  apply(e, t) {
    return { light: t.light, move: 0, sight: t.sight, sound: t.sound };
  },
  revert(e, t) {
    return { ...t };
  }
}, Lo = "eidolon-utilities", Au = "door-links", cp = "door-link-default";
function Mn(e) {
  var t, n;
  return ((n = (t = e == null ? void 0 : e.flags) == null ? void 0 : t[Lo]) == null ? void 0 : n[Au]) ?? {};
}
c(Mn, "getDoorLinks");
function Io(e, t) {
  const n = { [`flags.${Lo}.${Au}`]: t }, i = Mn(e);
  for (const r of Object.keys(i))
    r in t || (n[`flags.${Lo}.${Au}.-=${r}`] = null);
  return e.update(n, { render: !1 });
}
c(Io, "setDoorLinks");
function KS(e, t) {
  const n = Mn(e);
  let i = !1;
  const r = {};
  for (const [o, s] of Object.entries(n)) {
    const a = s.filter((l) => l !== t);
    a.length !== s.length && (i = !0), a.length > 0 && (r[o] = a);
  }
  return i ? Io(e, r) : null;
}
c(KS, "removeWallFromAllLinks");
function gd(e) {
  var t, n;
  return ((n = (t = e == null ? void 0 : e.flags) == null ? void 0 : t[Lo]) == null ? void 0 : n[cp]) ?? null;
}
c(gd, "getDefaultState");
function up(e) {
  const t = {
    light: e.light ?? 20,
    move: e.move ?? 20,
    sight: e.sight ?? 20,
    sound: e.sound ?? 20
  };
  return e.update({ [`flags.${Lo}.${cp}`]: t }, { render: !1 });
}
c(up, "captureDefaultState");
function Uf(e) {
  return gd(e) ? Promise.resolve() : up(e);
}
c(Uf, "ensureDefaultState");
async function dp(e, t) {
  const n = e.parent;
  if (!n) return;
  const i = Mn(e), r = Object.keys(i);
  if (r.length === 0) return;
  const o = t === 1, s = [];
  let a = null;
  for (const l of r) {
    const u = lp(l);
    if (!u) {
      console.warn(`[eidolon-utilities] Unknown door-link behavior: "${l}"`);
      continue;
    }
    const d = i[l];
    if (d != null && d.length)
      for (const f of d) {
        const h = n.walls.get(f);
        if (!h) continue;
        const m = gd(h);
        if (m)
          if (o) {
            const p = u.apply(h, m);
            s.push({ _id: f, ...p });
          } else {
            a || (a = XS(n, e.id));
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
c(dp, "onDoorStateChange");
function XS(e, t) {
  const n = /* @__PURE__ */ new Map();
  for (const i of e.walls) {
    if (i.id === t || i.door === 0 || i.ds !== 1) continue;
    const r = Mn(i);
    for (const o of Object.values(r))
      for (const s of o)
        n.has(s) || n.set(s, []), n.get(s).push(i);
  }
  return n;
}
c(XS, "buildReverseIndex");
const ko = /* @__PURE__ */ new WeakMap(), pa = /* @__PURE__ */ new Set();
function pd(e, t = {}) {
  var v;
  if (!(e != null && e.document)) return !1;
  Mu(e);
  const n = t.color ?? 16739115, i = t.alpha ?? 0.85, r = t.width ?? 3, o = t.pulse ?? !0, [s, a, l, u] = e.document.c, d = s - e.x, f = a - e.y, h = l - e.x, m = u - e.y, p = new PIXI.Graphics(), y = [
    { w: r + 24, a: i * 0.08 },
    { w: r + 18, a: i * 0.14 },
    { w: r + 12, a: i * 0.25 },
    { w: r + 6, a: i * 0.4 }
  ];
  for (const b of y)
    p.lineStyle(b.w, n, b.a), p.moveTo(d, f), p.lineTo(h, m);
  p.lineStyle(r, n, i), p.moveTo(d, f), p.lineTo(h, m), p.name = "eidolonDoorLinkHighlight", e.addChild(p);
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
    canvas.app.ticker.add(b.fn), E.pulseData = b, pa.add(b);
  }
  return ko.set(e, E), !0;
}
c(pd, "highlightWall");
function Mu(e) {
  var n, i;
  if (!e) return;
  const t = ko.get(e);
  t && (t.pulseData && ((i = (n = canvas.app) == null ? void 0 : n.ticker) == null || i.remove(t.pulseData.fn), pa.delete(t.pulseData)), t.gfx && (t.gfx.parent && t.gfx.parent.removeChild(t.gfx), t.gfx.destroy({ children: !0 })), ko.delete(e));
}
c(Mu, "removeWallHighlight");
function fp() {
  var t, n, i;
  for (const r of pa)
    (n = (t = canvas.app) == null ? void 0 : t.ticker) == null || n.remove(r.fn);
  pa.clear();
  const e = (i = canvas.walls) == null ? void 0 : i.placeables;
  if (e)
    for (const r of e) {
      const o = ko.get(r);
      o && (o.gfx && (o.gfx.parent && o.gfx.parent.removeChild(o.gfx), o.gfx.destroy({ children: !0 })), ko.delete(r));
    }
}
c(fp, "clearWallHighlights");
let Ii = null;
function JS(e) {
  var y, E, v, b, w;
  Ii && Ii.cancel();
  const { onPick: t, onUnpick: n, onCancel: i, excludeIds: r, getExcludeIds: o, sourceDoorId: s } = e;
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
    (N = S.release) == null || N.call(S), t(L);
  }, "onControl"), u = /* @__PURE__ */ c((S, T) => {
    T ? (a = S, pd(S, { color: 65416, alpha: 0.7, width: 4, pulse: !1 })) : a === S && (Mu(S), a = null);
  }, "onHover"), d = /* @__PURE__ */ c((S) => {
    S.key === "Escape" && (S.preventDefault(), S.stopPropagation(), p());
  }, "onKeydown"), f = /* @__PURE__ */ c((S) => {
    S.preventDefault(), p();
  }, "onContextMenu"), h = Hooks.on("controlWall", l), m = Hooks.on("hoverWall", u);
  document.addEventListener("keydown", d, { capture: !0 }), (b = canvas.stage) == null || b.addEventListener("rightclick", f), (w = ui.notifications) == null || w.info("Pick mode active — click a wall segment on the canvas, or press ESC to cancel.", { permanent: !1 });
  function p() {
    var S;
    Ii && (Ii = null, Hooks.off("controlWall", h), Hooks.off("hoverWall", m), document.removeEventListener("keydown", d, { capture: !0 }), (S = canvas.stage) == null || S.removeEventListener("rightclick", f), a && (Mu(a), a = null), i == null || i());
  }
  return c(p, "cancel"), Ii = { cancel: p }, { cancel: p };
}
c(JS, "enterWallPickMode");
function QS() {
  Ii && Ii.cancel();
}
c(QS, "cancelWallPickMode");
const ms = "eidolon-door-links", ZS = "Links", eC = "fa-solid fa-link", Qt = "eidolon-door-links";
function tC(e) {
  const [t, n, i, r] = e.c ?? [0, 0, 0, 0];
  return `(${t},${n}) → (${i},${r})`;
}
c(tC, "formatWallCoords");
function nC(e) {
  return e.length > 8 ? e.slice(0, 8) + "…" : e;
}
c(nC, "shortId");
function Vf(e) {
  const t = /* @__PURE__ */ new Set();
  for (const n of Object.values(e))
    for (const i of n) t.add(i);
  return t;
}
c(Vf, "allLinkedIds");
function iC(e) {
  const t = e.sight ?? 20, n = e.move ?? 20;
  if (t === 0) return { label: "Invisible Wall", cssClass: "dl-pill--invisible" };
  if (t === 10) return { label: "Terrain Wall", cssClass: "dl-pill--terrain" };
  if ([30, 40].includes(t)) return { label: "Window", cssClass: "dl-pill--window" };
  if (n === 0 && e.door === 0) return { label: "Ethereal Wall", cssClass: "dl-pill--ethereal" };
  if (e.door === 1) {
    const i = e.ds ?? 0;
    return i === 2 ? { label: "Locked Door", cssClass: "dl-pill--door-locked" } : i === 1 ? { label: "Open Door", cssClass: "dl-pill--door-open" } : { label: "Door", cssClass: "dl-pill--door" };
  }
  if (e.door === 2) {
    const i = e.ds ?? 0;
    return i === 2 ? { label: "Locked Secret Door", cssClass: "dl-pill--door-locked" } : i === 1 ? { label: "Open Secret Door", cssClass: "dl-pill--secret-open" } : { label: "Secret Door", cssClass: "dl-pill--secret" };
  }
  return { label: "Basic Wall", cssClass: "dl-pill--wall" };
}
c(iC, "classifyWall");
function Kl(e, t, n, i) {
  const r = document.createElement("div");
  r.classList.add("dl-wall-entry"), r.dataset.wallId = e.id, r.style.cursor = "pointer", r.title = "Click to select on canvas", r.addEventListener("click", () => {
    var p, y;
    const m = e.object;
    m && ((p = canvas.walls) == null || p.activate(), m.controlled ? m.release() : m.control({ releaseOthers: !((y = globalThis.keyboard) != null && y.isModifierActive(KeyboardManager.MODIFIER_KEYS.SHIFT)) }));
  });
  const { label: o, cssClass: s } = iC(e);
  r.classList.add(s), r.title = o;
  const a = document.createElement("div");
  a.classList.add("dl-wall-entry__info");
  const l = document.createElement("span");
  l.classList.add("dl-wall-entry__coords"), l.textContent = `#${nC(e.id)}  ${tC(e)}`, a.appendChild(l);
  const u = gd(e);
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
    const p = e.object;
    p && pd(p, { color: ((y = vl().get(t)) == null ? void 0 : y.highlightColor) ?? 16739115 });
  });
  const h = document.createElement("button");
  return h.type = "button", h.classList.add("dl-wall-entry__btn", "dl-wall-entry__btn--remove"), h.innerHTML = '<i class="fa-solid fa-xmark"></i>', h.title = "Remove link", h.addEventListener("click", (m) => {
    m.stopPropagation(), r.remove(), i(e.id, t);
  }), d.append(f, h), r.append(a, d), r;
}
c(Kl, "buildWallEntry");
function rC(e, t, n, i, r, o) {
  const s = document.createElement("div");
  s.classList.add("dl-behavior-section"), s.dataset.behavior = e;
  const a = document.createElement("div");
  a.classList.add("dl-behavior-section__header");
  const l = document.createElement("i");
  l.className = t.icon;
  const u = document.createElement("span");
  u.classList.add("dl-behavior-section__title"), u.textContent = t.label;
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
  y.classList.add("dl-behavior-section__desc"), y.textContent = t.description, s.appendChild(y);
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
    S && E.appendChild(Kl(S, e, i, b));
  }
  return s.appendChild(E), h.addEventListener("click", (w) => {
    w.stopPropagation(), JS({
      sourceDoorId: i.id,
      getExcludeIds: /* @__PURE__ */ c(() => Vf(ya(s.closest(`.${Qt}`))), "getExcludeIds"),
      onPick: /* @__PURE__ */ c(async (S) => {
        await Uf(S), E.appendChild(Kl(S, e, i, b)), v(), o();
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
    const T = ya(s.closest(`.${Qt}`)), L = Vf(T);
    let A = 0;
    for (const x of S) {
      const R = x.document;
      !R || R.id === i.id || L.has(R.id) || (await Uf(R), E.appendChild(Kl(R, e, i, b)), L.add(R.id), A++);
    }
    A > 0 ? (v(), o(), (N = ui.notifications) == null || N.info(`Added ${A} wall(s) to ${t.label}.`)) : ($ = ui.notifications) == null || $.warn("No eligible walls in selection (doors and already-linked walls are excluded).");
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
c(rC, "buildBehaviorSection");
function ya(e) {
  if (!e) return {};
  const t = {};
  for (const n of e.querySelectorAll(".dl-behavior-section")) {
    const i = n.dataset.behavior, r = [];
    for (const o of n.querySelectorAll(".dl-wall-entry"))
      o.dataset.wallId && r.push(o.dataset.wallId);
    r.length > 0 && (t[i] = r);
  }
  return t;
}
c(ya, "readLinksFromDOM");
function Fr(e, t, n) {
  var h;
  const i = document.createElement("div");
  i.classList.add(Qt);
  const r = Mn(e);
  let o = !1;
  const s = {};
  for (const [m, p] of Object.entries(r)) {
    const y = p.filter((E) => t.walls.has(E));
    y.length !== p.length && (o = !0), y.length > 0 && (s[m] = y);
  }
  o && Io(e, s);
  const a = vl(), l = /* @__PURE__ */ c(() => {
    const m = ya(i);
    Io(e, m);
  }, "onLinksChanged");
  for (const [m, p] of a) {
    const y = s[m] ?? [];
    i.appendChild(rC(m, p, y, e, t, l));
  }
  const u = document.createElement("button");
  u.type = "button", u.classList.add("dl-btn", "dl-btn--recapture"), u.innerHTML = '<i class="fa-solid fa-camera-rotate"></i> Re-capture defaults', u.title = "Snapshot current wall properties as the closed-door default for all linked walls", u.addEventListener("click", async (m) => {
    var E;
    m.stopPropagation();
    const p = ya(i);
    let y = 0;
    for (const v of Object.values(p))
      for (const b of v) {
        const w = t.walls.get(b);
        w && (await up(w), y++);
      }
    (E = ui.notifications) == null || E.info(`Re-captured defaults for ${y} linked wall(s).`), n();
  }), i.appendChild(u), cC(s, t);
  const d = /* @__PURE__ */ c((m, p) => {
    var v;
    const y = ((v = m.document) == null ? void 0 : v.id) ?? m.id, E = i.querySelector(`.dl-wall-entry[data-wall-id="${y}"]`);
    E && E.classList.toggle("dl-wall-entry--selected", p);
  }, "syncSelection"), f = Hooks.on("controlWall", d);
  i._dlSelectionHookId = f;
  for (const m of i.querySelectorAll(".dl-wall-entry")) {
    const p = t.walls.get(m.dataset.wallId);
    (h = p == null ? void 0 : p.object) != null && h.controlled && m.classList.add("dl-wall-entry--selected");
  }
  return i;
}
c(Fr, "buildDoorLinksContent");
function oC(e) {
  return e.querySelector(".standard-form [data-application-part='body']") ?? e.querySelector(".standard-form.scrollable") ?? null;
}
c(oC, "findV2Body");
function sC(e, t, n, i) {
  const r = oC(t);
  if (!r) return !1;
  if (r.querySelector(`.${Qt}`)) return !0;
  const o = document.createElement("fieldset");
  o.classList.add("dl-fieldset");
  const s = document.createElement("legend");
  s.textContent = "Door Links", o.appendChild(s);
  const a = /* @__PURE__ */ c(() => {
    var l;
    (l = o.querySelector(`.${Qt}`)) == null || l.remove(), o.appendChild(Fr(n, i, a));
  }, "refresh");
  return o.appendChild(Fr(n, i, a)), r.appendChild(o), !0;
}
c(sC, "injectAsFieldset");
function aC(e, t, n, i) {
  var a;
  const r = td(e, t, ms, ZS, eC);
  if (!r) return !1;
  if (e._eidolonActiveTab === ms && Wu(e, ms), r.querySelector(`.${Qt}`)) return !0;
  const o = r.closest("form");
  o && (o.noValidate = !0);
  const s = /* @__PURE__ */ c(() => {
    var l;
    e._eidolonActiveTab = ms, (l = r.querySelector(`.${Qt}`)) == null || l.remove(), r.appendChild(Fr(n, i, s));
  }, "refresh");
  return r.appendChild(Fr(n, i, s)), (a = e.setPosition) == null || a.call(e, { height: "auto" }), !0;
}
c(aC, "injectAsTab");
function lC(e, t, n, i) {
  var u;
  const r = t.querySelector("form");
  if (!r) return !1;
  if (r.querySelector(`.${Qt}`)) return !0;
  const o = document.createElement("fieldset");
  o.classList.add("dl-fieldset");
  const s = document.createElement("legend");
  s.textContent = "Door Links", o.appendChild(s);
  const a = /* @__PURE__ */ c(() => {
    var d;
    (d = o.querySelector(`.${Qt}`)) == null || d.remove(), o.appendChild(Fr(n, i, a));
  }, "refresh");
  o.appendChild(Fr(n, i, a));
  const l = r.querySelector(":scope > footer") ?? r.querySelector(".form-footer");
  return r.insertBefore(o, l ?? null), r.noValidate = !0, (u = e.setPosition) == null || u.call(e, { height: "auto" }), !0;
}
c(lC, "injectAsFormSection");
function Xl(e, t) {
  var l;
  const n = He(t);
  if (!n) return;
  const i = e.document ?? ((l = e.object) == null ? void 0 : l.document) ?? e.object;
  if (!i || i.door === 0) return;
  const r = i.parent;
  if (!r || !(sC(e, n, i, r) || aC(e, n, i, r) || lC(e, n, i, r))) return;
  const s = `close${e.constructor.name}`, a = Hooks.on(s, (u) => {
    if (u === e) {
      fp(), QS();
      const d = n.querySelector(`.${Qt}`);
      (d == null ? void 0 : d._dlSelectionHookId) != null && Hooks.off("controlWall", d._dlSelectionHookId), Hooks.off(s, a);
    }
  });
}
c(Xl, "renderDoorLinksTab");
function cC(e, t) {
  var i;
  const n = vl();
  for (const [r, o] of Object.entries(e)) {
    const s = ((i = n.get(r)) == null ? void 0 : i.highlightColor) ?? 16739115;
    for (const a of o) {
      const l = t.walls.get(a), u = l == null ? void 0 : l.object;
      u && pd(u, { color: s });
    }
  }
}
c(cC, "highlightLinkedWalls");
const Gf = "eidolon-utilities";
function uC(e, t) {
  t.ds !== void 0 && e.door !== 0 && dp(e, t.ds);
}
c(uC, "onUpdateWall");
function dC(e) {
  const t = e.parent;
  if (!t) return;
  const n = e.id;
  for (const i of t.walls)
    i.door !== 0 && KS(i, n);
}
c(dC, "onDeleteWall");
function fC(e, t) {
  var o;
  const n = t instanceof HTMLElement ? t : t == null ? void 0 : t[0];
  if (!n) return;
  if (!((o = game.modules.get("monks-active-tiles")) != null && o.active)) {
    Xl(e, t);
    return;
  }
  if (n.querySelector("nav.sheet-tabs, nav.tabs")) {
    Xl(e, t);
    return;
  }
  const i = new MutationObserver(() => {
    n.querySelector("nav.sheet-tabs, nav.tabs") && (i.disconnect(), Xl(e, t));
  });
  i.observe(n, { childList: !0, subtree: !0 });
  const r = `close${e.constructor.name}`;
  Hooks.once(r, (s) => {
    s === e && i.disconnect();
  });
}
c(fC, "onRenderWallConfig$1");
async function hC(e) {
  const t = e.walls.filter((u) => {
    if (u.door === 0) return !1;
    const d = Mn(u);
    return Object.values(d).some((f) => f.length > 0);
  });
  if (t.length === 0) return;
  const n = new Set(e.walls.map((u) => u.id)), i = /* @__PURE__ */ new Set();
  for (const u of t)
    for (const d of Object.values(Mn(u)))
      for (const f of d)
        n.has(f) || i.add(f);
  if (i.size === 0) return;
  const r = [...i][0];
  let o = null;
  for (const u of game.scenes)
    if (u.id !== e.id && u.walls.get(r)) {
      o = u;
      break;
    }
  if (!o) return;
  const s = /* @__PURE__ */ c((u) => u.join(","), "coordKey"), a = /* @__PURE__ */ new Map();
  for (const u of e.walls)
    a.set(s(u.c), u.id);
  const l = /* @__PURE__ */ new Map();
  for (const u of i) {
    const d = o.walls.get(u);
    if (!d) continue;
    const f = a.get(s(d.c));
    f && l.set(u, f);
  }
  for (const u of t) {
    const d = Mn(u), f = {};
    let h = !1;
    for (const [m, p] of Object.entries(d))
      f[m] = p.map((y) => {
        const E = l.get(y);
        return E ? (h = !0, E) : y;
      });
    h && await Io(u, f);
  }
}
c(hC, "onCreateScene");
function mC() {
  fp();
}
c(mC, "onCanvasReady$1");
function gC() {
  Hooks.on("updateWall", uC), Hooks.on("deleteWall", dC), Hooks.on("renderWallConfig", fC), Hooks.on("createScene", hC), Hooks.on("canvasReady", mC), Hooks.once("ready", () => {
    const e = game.modules.get(Gf);
    e.api || (e.api = {}), e.api.doorLinks = {
      registerBehavior: md,
      getBehavior: lp,
      getAllBehaviors: vl,
      getDoorLinks: Mn,
      setDoorLinks: Io,
      triggerDoor: dp
    }, console.log(`[${Gf}] Door Links API registered.`);
  });
}
c(gC, "registerDoorLinksHooks");
const ba = "eidolon-utilities", va = "tokenOccluder", Wf = {
  enabled: !1,
  gateByLinkedDoors: !0
};
function yd(e) {
  var n, i, r;
  const t = (r = (i = (n = e == null ? void 0 : e.flags) == null ? void 0 : n["map-ui-presets"]) == null ? void 0 : i.links) == null ? void 0 : r.doors;
  return Array.isArray(t) ? t.filter((o) => typeof o == "string" && o.length > 0) : typeof t == "string" && t.length > 0 ? [t] : [];
}
c(yd, "getLinkedDoorIds");
function hp(e) {
  var i, r, o;
  const t = yd(e), n = ((i = e == null ? void 0 : e.getFlag) == null ? void 0 : i.call(e, ba, va)) ?? ((o = (r = e == null ? void 0 : e.flags) == null ? void 0 : r[ba]) == null ? void 0 : o[va]) ?? {};
  return {
    enabled: n.enabled ?? Wf.enabled,
    gateByLinkedDoors: n.gateByLinkedDoors ?? (t.length > 0 ? !0 : Wf.gateByLinkedDoors)
  };
}
c(hp, "getTokenOccluderConfig");
function pC(e, t = e == null ? void 0 : e.parent) {
  const n = hp(e);
  if (!n.enabled) return !1;
  const i = yd(e);
  if (!n.gateByLinkedDoors || i.length === 0) return !0;
  if (!(t != null && t.walls)) return !1;
  for (const r of i) {
    const o = t.walls.get(r);
    if (o && o.door !== 0 && o.ds !== 1)
      return !0;
  }
  return !1;
}
c(pC, "isTokenOccluderActive");
function yC(e) {
  var t, n, i, r;
  return !e || typeof e != "object" ? !1 : !!(e.c !== void 0 || e.dir !== void 0 || e.ds !== void 0 || (n = (t = foundry == null ? void 0 : foundry.utils) == null ? void 0 : t.hasProperty) != null && n.call(t, e, `flags.${ba}.${va}`) || (r = (i = foundry == null ? void 0 : foundry.utils) == null ? void 0 : i.hasProperty) != null && r.call(i, e, "flags.map-ui-presets.links.doors"));
}
c(yC, "touchesTokenOccluderState");
const bC = "eidolon-utilities", Jl = Symbol("eidolonTokenOccluderRefreshVisibilityPatch");
let cr = null, Sr = !1, bd = 0;
function vC() {
  cr = null;
}
c(vC, "invalidateTokenOccluderCache");
function vd() {
  var e, t;
  vC(), (t = (e = canvas == null ? void 0 : canvas.perception) == null ? void 0 : e.update) == null || t.call(e, { refreshVisibility: !0 });
}
c(vd, "refreshTokenOccluders");
function wC(e) {
  return Sr = !!e, console.info(`[eidolon-utilities] Token occluder debug ${Sr ? "enabled" : "disabled"}.`), Sr;
}
c(wC, "setTokenOccluderDebug");
function EC() {
  return {
    debugEnabled: Sr,
    visibilityCheckCount: bd,
    activeWallIds: Sd().map((e) => e.document.id),
    visionSourceIds: Ed().map((e) => {
      var t;
      return (t = e.object) == null ? void 0 : t.id;
    }).filter(Boolean)
  };
}
c(EC, "getTokenOccluderDebugState");
function xu() {
  var i;
  const e = SC();
  if (!e) return !1;
  if (e[Jl]) return !0;
  const t = /* @__PURE__ */ c(function(o, ...s) {
    o(...s), zf(this);
  }, "tokenOccluderRefreshVisibility");
  if ((i = game.modules.get("lib-wrapper")) != null && i.active && globalThis.libWrapper)
    return libWrapper.register(bC, "Token.prototype._refreshVisibility", t, "WRAPPER"), e[Jl] = { mode: "libWrapper" }, !0;
  const n = e._refreshVisibility;
  return e._refreshVisibility = /* @__PURE__ */ c(function(...o) {
    n.apply(this, o), zf(this);
  }, "patchedTokenOccluderRefreshVisibility"), e[Jl] = { mode: "direct", original: n }, !0;
}
c(xu, "patchTokenVisibilityGetter");
function mp(e) {
  return (e == null ? void 0 : e.isVisible) ?? null;
}
c(mp, "getOriginalTokenVisibility");
function SC() {
  var t, n;
  let e = (n = (t = CONFIG == null ? void 0 : CONFIG.Token) == null ? void 0 : t.objectClass) == null ? void 0 : n.prototype;
  for (; e; ) {
    if (typeof e._refreshVisibility == "function") return e;
    e = Object.getPrototypeOf(e);
  }
  return null;
}
c(SC, "findRefreshVisibilityOwner");
function zf(e) {
  var r;
  bd += 1;
  const t = (e == null ? void 0 : e.visible) ?? !1;
  if (!t) {
    Sr && Yf(e, !1, {
      occluded: !1,
      reason: "core-hidden",
      visionSourceCount: 0,
      wallCount: 0,
      viewers: []
    });
    return;
  }
  const n = wd(e);
  if (Sr && Yf(e, t, n), !n.occluded) return;
  const i = e.visible;
  e.visible = !1, e.mesh && (e.mesh.visible = !1), e.visible !== i && MouseInteractionManager.emulateMoveEvent(), ((r = e.layer) == null ? void 0 : r.occlusionMode) === CONST.TOKEN_OCCLUSION_MODES.VISIBLE && canvas.perception.update({ refreshOcclusion: !0 });
}
c(zf, "applyTokenOccluderVisibility");
function wd(e) {
  var a, l, u;
  if (!(canvas != null && canvas.ready))
    return { occluded: !1, reason: "canvas-not-ready", visionSourceCount: 0, wallCount: 0, viewers: [] };
  const t = Ed();
  if (t.length === 0)
    return { occluded: !1, reason: "no-vision-sources", visionSourceCount: 0, wallCount: 0, viewers: [] };
  if (new Set(t.map((d) => {
    var f;
    return (f = d.object) == null ? void 0 : f.id;
  }).filter(Boolean)).has(e.id))
    return { occluded: !1, reason: "token-is-vision-source", visionSourceCount: t.length, wallCount: 0, viewers: [] };
  const i = Sd();
  if (i.length === 0)
    return { occluded: !1, reason: "no-active-occluder-walls", visionSourceCount: t.length, wallCount: 0, viewers: [] };
  const r = Cd(e), o = CC(e), s = [];
  for (const d of t) {
    if (((a = d.object) == null ? void 0 : a.id) === e.id)
      return { occluded: !1, reason: "token-is-vision-source", visionSourceCount: t.length, wallCount: i.length, viewers: s };
    const f = { x: d.x, y: d.y }, h = {
      viewerTokenId: ((l = d.object) == null ? void 0 : l.id) ?? null,
      viewerTokenName: ((u = d.object) == null ? void 0 : u.name) ?? null,
      sourcePoint: f,
      blocked: !0,
      visibleSampleIndex: null,
      visibleSamplePoint: null,
      sampleChecks: []
    };
    for (const [m, p] of o.entries()) {
      const y = {
        sampleIndex: m,
        targetPoint: p,
        blocked: !1,
        blockingWallId: null,
        wallChecks: []
      };
      for (const E of i) {
        const v = gp(E, f, p);
        if (y.wallChecks.push(v), v.blocks) {
          y.blocked = !0, y.blockingWallId = v.wallId;
          break;
        }
      }
      if (h.sampleChecks.push(y), !y.blocked) {
        h.blocked = !1, h.visibleSampleIndex = m, h.visibleSamplePoint = p;
        break;
      }
    }
    if (s.push(h), !h.blocked)
      return {
        occluded: !1,
        reason: "visible-to-at-least-one-viewer",
        visionSourceCount: t.length,
        wallCount: i.length,
        target: r,
        targetPoints: o,
        viewers: s
      };
  }
  return {
    occluded: !0,
    reason: "blocked-for-all-viewers",
    visionSourceCount: t.length,
    wallCount: i.length,
    target: r,
    targetPoints: o,
    viewers: s
  };
}
c(wd, "evaluateTokenOcclusion");
function Ed() {
  var t;
  const e = (t = canvas == null ? void 0 : canvas.effects) == null ? void 0 : t.visionSources;
  return e != null && e.size ? Array.from(e.values()).filter((n) => (n == null ? void 0 : n.active) && (n == null ? void 0 : n.object)) : [];
}
c(Ed, "getVisionSources");
function Sd() {
  var n, i;
  const e = ((n = canvas == null ? void 0 : canvas.scene) == null ? void 0 : n.id) ?? null;
  if ((cr == null ? void 0 : cr.sceneId) === e) return cr.walls;
  const t = (((i = canvas == null ? void 0 : canvas.walls) == null ? void 0 : i.placeables) ?? []).filter((r) => pC(r.document));
  return cr = { sceneId: e, walls: t }, t;
}
c(Sd, "getActiveOccluderWalls");
function Cd(e) {
  return e != null && e.center ? e.center : {
    x: e.x + e.w / 2,
    y: e.y + e.h / 2
  };
}
c(Cd, "getTokenCenter");
function CC(e) {
  const t = Cd(e), n = Number((e == null ? void 0 : e.w) ?? 0), i = Number((e == null ? void 0 : e.h) ?? 0);
  if (!(n > 0) || !(i > 0)) return [t];
  const r = Math.max(Math.min(n * 0.25, n / 2), 1), o = Math.max(Math.min(i * 0.25, i / 2), 1), s = e.x + r, a = e.x + n - r, l = e.y + o, u = e.y + i - o;
  return LC([
    t,
    { x: s, y: l },
    { x: a, y: l },
    { x: s, y: u },
    { x: a, y: u }
  ]);
}
c(CC, "getTokenTestPoints");
function gp(e, t, n) {
  var u, d, f, h;
  const i = ((u = e == null ? void 0 : e.document) == null ? void 0 : u.c) ?? (e == null ? void 0 : e.coords) ?? (e == null ? void 0 : e.c), r = ((d = e == null ? void 0 : e.document) == null ? void 0 : d.id) ?? (e == null ? void 0 : e.id) ?? null, o = (e == null ? void 0 : e.edge) ?? ((h = (f = e == null ? void 0 : e.document) == null ? void 0 : f.object) == null ? void 0 : h.edge) ?? null;
  if (!Array.isArray(i) || i.length !== 4)
    return { wallId: r, blocks: !1, reason: "invalid-coords", intersectionRatio: null, directionalAllows: null, coords: null };
  const s = TC(o, t, n, i);
  if (!s)
    return { wallId: r, blocks: !1, reason: "no-segment-intersection", intersectionRatio: null, directionalAllows: null, coords: i };
  const a = s.t1 ?? null, l = { angle: Math.atan2(n.y - t.y, n.x - t.x) };
  if (typeof (e == null ? void 0 : e.canRayIntersect) == "function") {
    const m = e.canRayIntersect(l);
    return {
      wallId: r,
      blocks: m,
      reason: m ? "intersects-and-direction-allows" : "intersects-but-direction-blocks",
      intersectionRatio: a,
      directionalAllows: m,
      coords: i,
      rayAngle: l.angle
    };
  }
  return {
    wallId: r,
    blocks: !0,
    reason: "intersects-no-direction-check",
    intersectionRatio: a,
    directionalAllows: null,
    coords: i,
    rayAngle: l.angle
  };
}
c(gp, "inspectWallIntersection");
function TC(e, t, n, i) {
  var s, a, l, u, d, f;
  const r = (a = (s = foundry == null ? void 0 : foundry.canvas) == null ? void 0 : s.edges) == null ? void 0 : a.Edge, o = (u = (l = foundry == null ? void 0 : foundry.canvas) == null ? void 0 : l.edges) == null ? void 0 : u.PolygonVertex;
  if (e && r && (o != null && o.fromPoint)) {
    const h = new r(
      o.fromPoint(t),
      o.fromPoint(n),
      { type: "sight" }
    );
    return e.getIntersection(h) ?? null;
  }
  return ((f = (d = foundry == null ? void 0 : foundry.utils) == null ? void 0 : d.lineLineIntersection) == null ? void 0 : f.call(
    d,
    { x: i[0], y: i[1] },
    { x: i[2], y: i[3] },
    t,
    n,
    { t1: !0 }
  )) ?? null;
}
c(TC, "getWallIntersection");
function LC(e) {
  const t = /* @__PURE__ */ new Set(), n = [];
  for (const i of e) {
    const r = `${Math.round(i.x * 1e3)}:${Math.round(i.y * 1e3)}`;
    t.has(r) || (t.add(r), n.push(i));
  }
  return n;
}
c(LC, "dedupePoints");
function Yf(e, t, n) {
  var r;
  const i = ((r = e == null ? void 0 : e.document) == null ? void 0 : r.id) ?? (e == null ? void 0 : e.id) ?? "unknown-token";
  console.groupCollapsed(
    `[eidolon-utilities] token-occluder visibility ${e.name ?? i}`
  ), console.log({
    check: bd,
    tokenId: i,
    coreVisible: t,
    finalVisible: !n.occluded,
    occlusion: n
  }), console.groupEnd();
}
c(Yf, "logVisibilityCheck");
function IC({ log: e = !0 } = {}) {
  var r, o;
  const t = ((r = canvas == null ? void 0 : canvas.tokens) == null ? void 0 : r.controlled) ?? [], n = ((o = canvas == null ? void 0 : canvas.walls) == null ? void 0 : o.controlled) ?? [], i = {
    selectedTokenIds: t.map((s) => s.document.id),
    selectedWallIds: n.map((s) => s.document.id),
    activeOccluderWallIds: Sd().map((s) => s.document.id),
    visionSourceIds: Ed().map((s) => {
      var a;
      return (a = s.object) == null ? void 0 : a.id;
    }).filter(Boolean),
    tokens: t.map((s) => ({
      tokenId: s.document.id,
      name: s.name,
      center: Cd(s),
      coreVisible: mp(s),
      isVisible: s.isVisible,
      occlusion: wd(s)
    }))
  };
  return e && (console.group("[eidolon-utilities] token-occluder debugSelectedTokenOccluders"), console.dir(i), console.groupEnd()), i;
}
c(IC, "debugSelectedTokenOccluders");
const Kf = "eidolon-token-occluder";
function kC(e, t) {
  var f, h;
  const n = He(t);
  if (!n || n.querySelector(`.${Kf}`)) return;
  const i = e.document ?? ((f = e.object) == null ? void 0 : f.document) ?? e.object;
  if (!i) return;
  const r = hp(i), o = yd(i), s = `flags.${ba}.${va}`, a = document.createElement("fieldset");
  a.className = Kf, a.innerHTML = `
		<legend>Token Occluder</legend>
		<div class="form-group">
			<label>Hide Tokens Only</label>
			<input type="checkbox" name="${s}.enabled" ${r.enabled ? "checked" : ""}>
		</div>
		<p class="hint">Treat this wall like a normal vision blocker for token rendering only. LOS, fog, and lighting remain unchanged.</p>
		<div class="form-group eidolon-token-occluder-gating" ${r.enabled ? "" : 'style="opacity: 0.5"'}>
			<label>Follow Linked Doors</label>
			<input type="checkbox" name="${s}.gateByLinkedDoors" ${r.gateByLinkedDoors ? "checked" : ""} ${o.length === 0 ? "disabled" : ""}>
		</div>
		<p class="hint">${o.length > 0 ? `Active only while at least one linked door is closed or locked. Linked doors: ${o.join(", ")}.` : "No linked door metadata found on this wall. When enabled, occlusion is always active."}</p>
	`;
  const l = OC(n);
  if (!l) return;
  l.appendChild(a);
  const u = a.querySelector(`input[name="${s}.enabled"]`), d = a.querySelector(".eidolon-token-occluder-gating");
  u == null || u.addEventListener("change", () => {
    d && (d.style.opacity = u.checked ? "" : "0.5");
  }), (h = e.setPosition) == null || h.call(e, { height: "auto" });
}
c(kC, "renderTokenOccluderWallConfig");
function OC(e) {
  const t = e.querySelector(".standard-form [data-application-part='body']") ?? e.querySelector(".standard-form.scrollable");
  if (t) return t;
  const n = e.querySelector("form");
  if (!n) return null;
  const i = n.querySelector(":scope > footer") ?? n.querySelector(".form-footer");
  if ((i == null ? void 0 : i.parentElement) === n) {
    const r = document.createElement("div");
    return n.insertBefore(r, i), r;
  }
  return n;
}
c(OC, "findMountPoint");
const AC = "eidolon-utilities";
let Xf = !1;
function MC() {
  xu(), vd();
}
c(MC, "onCanvasReady");
function Ql(e, t = null) {
  var n, i;
  canvas != null && canvas.ready && ((n = e == null ? void 0 : e.parent) == null ? void 0 : n.id) === ((i = canvas.scene) == null ? void 0 : i.id) && (t && !yC(t) || vd());
}
c(Ql, "onWallMutation");
function xC(e, t) {
  kC(e, t);
}
c(xC, "onRenderWallConfig");
function Jf() {
  const e = game.modules.get(AC);
  e && (e.api || (e.api = {}), e.api.tokenOccluders = {
    refresh: vd,
    setDebug: wC,
    getDebugState: EC,
    debugSelection: IC,
    evaluateToken: /* @__PURE__ */ c((t) => wd(Qf(t)), "evaluateToken"),
    inspectWallIntersection: /* @__PURE__ */ c((t, n, i) => gp(_C(t), n, i), "inspectWallIntersection"),
    getOriginalVisibility: /* @__PURE__ */ c((t) => mp(Qf(t)), "getOriginalVisibility")
  });
}
c(Jf, "registerApi");
function pp() {
  Xf || (Xf = !0, Hooks.on("canvasReady", MC), Hooks.on("renderWallConfig", xC), Hooks.on("createWall", (e) => Ql(e)), Hooks.on("deleteWall", (e) => Ql(e)), Hooks.on("updateWall", Ql), Hooks.once("ready", () => {
    xu(), Jf();
  }), game.ready && (xu(), Jf()));
}
c(pp, "registerTokenOccluderHooks");
function Qf(e) {
  var t, n, i, r;
  return e ? e.document ? e : ((n = (t = canvas == null ? void 0 : canvas.tokens) == null ? void 0 : t.get) == null ? void 0 : n.call(t, e)) ?? ((r = (i = canvas == null ? void 0 : canvas.tokens) == null ? void 0 : i.placeables) == null ? void 0 : r.find((o) => {
    var s;
    return ((s = o.document) == null ? void 0 : s.id) === e;
  })) ?? null : null;
}
c(Qf, "resolveToken");
function _C(e) {
  var t, n, i, r;
  return e ? e.document ? e : ((n = (t = canvas == null ? void 0 : canvas.walls) == null ? void 0 : t.get) == null ? void 0 : n.call(t, e)) ?? ((r = (i = canvas == null ? void 0 : canvas.walls) == null ? void 0 : i.placeables) == null ? void 0 : r.find((o) => {
    var s;
    return ((s = o.document) == null ? void 0 : s.id) === e;
  })) ?? null : null;
}
c(_C, "resolveWall");
pp();
md("reflect", zS);
md("passthru", YS);
gC();
pp();
const wl = "eidolon-utilities", yp = "sceneLinks";
function mn(e) {
  var t, n;
  return ((n = (t = e == null ? void 0 : e.flags) == null ? void 0 : t[wl]) == null ? void 0 : n[yp]) ?? [];
}
c(mn, "getSceneLinks");
function El(e, t, n = {}) {
  return e.update({ [`flags.${wl}.${yp}`]: t }, n);
}
c(El, "setSceneLinks");
function wa(e, { label: t, target: n }, i = {}) {
  const r = mn(e);
  return r.some((o) => o.target === n) ? Promise.resolve() : El(e, [...r, { label: t, target: n }], i);
}
c(wa, "addSceneLink");
function Oo(e, t, n = {}) {
  const i = mn(e), r = i.filter((o) => o.target !== t);
  return r.length === i.length ? Promise.resolve() : El(e, r, n);
}
c(Oo, "removeSceneLink");
function NC(e, t) {
  const n = t.toLowerCase();
  return mn(e).find((i) => i.label.toLowerCase() === n) ?? null;
}
c(NC, "findLinkByLabel");
function $C(e, t, n, i = {}) {
  const o = mn(e).map((s) => s.target === t ? { ...s, label: n } : s);
  return El(e, o, i);
}
c($C, "updateLinkLabel");
const bp = "syncLinkedCriteria";
function Td(e) {
  var t, n;
  return ((n = (t = e == null ? void 0 : e.flags) == null ? void 0 : t[wl]) == null ? void 0 : n[bp]) === !0;
}
c(Td, "getSyncLinkedCriteria");
function vp(e, t, n = {}) {
  return e.update({ [`flags.${wl}.${bp}`]: !!t }, n);
}
c(vp, "setSyncLinkedCriteria");
function Dr(e) {
  if (!e || typeof e != "string") return null;
  const t = e.startsWith("Scene.") ? e.slice(6) : e;
  return game.scenes.get(t) ?? null;
}
c(Dr, "resolveScene");
async function wp(e) {
  const t = Dr(e);
  if (!t) {
    ui.notifications.warn(`Scene not found: ${e}`);
    return;
  }
  return t.view();
}
c(wp, "navigateToLink");
let Qi = !1;
function FC() {
  return Qi;
}
c(FC, "isSyncing");
async function DC(e, t, n, i) {
  Qi = !0;
  try {
    await wa(e, { label: n, target: t.id }), await wa(t, { label: i, target: e.id });
  } finally {
    Qi = !1;
  }
}
c(DC, "addBidirectionalLink");
async function PC(e, t) {
  Qi = !0;
  try {
    await Oo(e, t.id), await Oo(t, e.id);
  } finally {
    Qi = !1;
  }
}
c(PC, "removeBidirectionalLink");
async function RC(e) {
  Qi = !0;
  try {
    for (const t of game.scenes)
      mn(t).some((i) => i.target === e) && await Oo(t, e);
  } finally {
    Qi = !1;
  }
}
c(RC, "cleanupDanglingLinks");
let Zl = !1;
async function HC(e, t) {
  if (Zl || !Td(e)) return;
  const n = mn(e);
  if (!n.length) return;
  Zl = !0;
  const i = [];
  try {
    for (const r of n) {
      const o = game.scenes.get(r.target);
      if (!o) continue;
      const s = bt(o);
      if (!s.length) continue;
      const a = {}, l = Qo(o, s);
      for (const [u, d] of Object.entries(t)) {
        const f = s.find((h) => h.key === u);
        f && (f.values.includes(d) ? l[u] !== d && (a[u] = d) : i.push({
          scene: o.name,
          label: r.label,
          key: f.label || u,
          value: d
        }));
      }
      Object.keys(a).length > 0 && await Zu(a, o);
    }
  } finally {
    Zl = !1;
  }
  if (i.length > 0) {
    const r = i.map((s) => `${s.label}: "${s.value}" not available for ${s.key}`), o = [...new Set(r)];
    ui.notifications.warn(`Criteria sync skipped:
${o.join(`
`)}`, { permanent: !1 });
  }
}
c(HC, "onCriteriaStateApplied");
const Zf = "eidolon-utilities";
var gh, ln, kr, Yo, ji, Xa, Or, Ne, Ep, Sp, ro, Cp, Ja, Tp, Nu;
const En = class En extends yt(pt) {
  constructor(n = {}) {
    const { scene: i, onComplete: r, ...o } = n ?? {};
    super(o);
    _(this, Ne);
    _(this, ln, null);
    _(this, kr, null);
    _(this, Yo, "browse");
    _(this, ji, null);
    _(this, Xa, null);
    _(this, Or, null);
    // ── Submit ────────────────────────────────────────────────────────────
    _(this, Ja, /* @__PURE__ */ c(async (n) => {
      var d;
      n.preventDefault();
      const i = n.currentTarget;
      if (!(i instanceof HTMLFormElement)) return;
      const r = new FormData(i), o = String(r.get("target") ?? "").trim(), s = String(r.get("label") ?? "").trim(), a = ((d = i.querySelector('input[name="reverse"]')) == null ? void 0 : d.checked) ?? !1, l = String(r.get("reverseLabel") ?? "").trim();
      if (!o || !s) {
        ui.notifications.warn("Target and label are required.");
        return;
      }
      const u = Dr(o);
      if (!u) {
        ui.notifications.warn(`Scene not found: ${o}`);
        return;
      }
      a && l ? await DC(g(this, ln), u, s, l) : await wa(g(this, ln), { label: s, target: u.id }), g(this, kr) && g(this, kr).call(this), this.close();
    }, "#onSubmit"));
    O(this, ln, i ?? null), O(this, kr, typeof r == "function" ? r : null);
  }
  async _prepareContext() {
    const n = g(this, ln), i = I(this, Ne, Tp).call(this);
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
        h.preventDefault(), I(this, Ne, Ep).call(this, f.dataset.pickerMode);
      });
    });
    const o = r.querySelector('input[name="target"]');
    I(this, Ne, Cp).call(this, r, o);
    const s = r.querySelector('input[name="targetUuid"]');
    s && s.addEventListener("input", () => {
      if (g(this, Yo) !== "uuid") return;
      const f = s.value.trim();
      o.value = f.startsWith("Scene.") ? f.slice(6) : f;
    });
    const a = r.querySelector('input[name="reverse"]'), l = r.querySelector("[data-reverse-label-group]");
    a && l && a.addEventListener("change", () => {
      l.style.display = a.checked ? "" : "none";
    });
    const u = r.querySelector("form");
    u && u.addEventListener("submit", g(this, Ja)), (d = r.querySelector('[data-action="cancel"]')) == null || d.addEventListener("click", (f) => {
      f.preventDefault(), this.close();
    });
  }
  _onClose(n) {
    var i;
    I(this, Ne, ro).call(this), (i = super._onClose) == null || i.call(this, n);
  }
};
ln = new WeakMap(), kr = new WeakMap(), Yo = new WeakMap(), ji = new WeakMap(), Xa = new WeakMap(), Or = new WeakMap(), Ne = new WeakSet(), // ── Mode switching ───────────────────────────────────────────────────
Ep = /* @__PURE__ */ c(function(n) {
  O(this, Yo, n);
  const i = this.element;
  if (!i) return;
  i.querySelectorAll("[data-picker-mode]").forEach((o) => o.classList.toggle("active", o.dataset.pickerMode === n)), i.querySelectorAll("[data-panel]").forEach((o) => o.style.display = o.dataset.panel === n ? "" : "none");
  const r = i.querySelector('input[name="target"]');
  if (n === "browse")
    r && g(this, Or) && (r.value = g(this, Or)), I(this, Ne, ro).call(this);
  else if (n === "uuid") {
    const o = i.querySelector('input[name="targetUuid"]');
    if (o && r) {
      const s = o.value.trim();
      r.value = s.startsWith("Scene.") ? s.slice(6) : s;
    }
    I(this, Ne, ro).call(this);
  } else n === "sidebar" && I(this, Ne, Sp).call(this);
}, "#switchMode"), // ── Sidebar picker ───────────────────────────────────────────────────
Sp = /* @__PURE__ */ c(function() {
  var d;
  I(this, Ne, ro).call(this);
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
    p && (f.preventDefault(), f.stopPropagation(), O(this, Xa, m), s && (s.value = m), a && (a.style.display = "none"), l && (l.textContent = p.name, l.style.display = ""));
  }, "clickHandler");
  i.addEventListener("click", u, !0), O(this, ji, () => i.removeEventListener("click", u, !0));
}, "#activateSidebarPicker"), ro = /* @__PURE__ */ c(function() {
  g(this, ji) && (g(this, ji).call(this), O(this, ji, null));
}, "#cleanupSidebar"), // ── Scene picker (searchable browse) ─────────────────────────────────
Cp = /* @__PURE__ */ c(function(n, i) {
  const r = n.querySelector(".eidutil-scene-picker");
  if (!r) return;
  const o = r.querySelector(".eidutil-scene-search"), s = r.querySelector(".eidutil-scene-clear"), a = n.querySelector(".eidutil-scene-dropdown-data");
  if (!o || !a) return;
  const l = document.createElement("div");
  l.classList.add("eidutil-scene-dropdown"), l.style.display = "none", l.innerHTML = a.innerHTML, document.body.appendChild(l), [...l.querySelectorAll(".eidutil-scene-option")];
  const u = [...l.querySelectorAll(".eidutil-scene-group-label")];
  let d = "";
  const f = I(this, Ne, Nu).call(this, g(this, ln)), h = /* @__PURE__ */ c(() => {
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
      const M = Bs(f, L.folderPath), F = Bs(f, A.folderPath);
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
    O(this, Or, w), i && (i.value = w), d = S, o.value = S, s && (s.style.display = w ? "" : "none"), l.style.display = "none";
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
}, "#activateScenePicker"), Ja = new WeakMap(), // ── Helpers ───────────────────────────────────────────────────────────
/** Build folder-grouped scene list, excluding the current scene. */
Tp = /* @__PURE__ */ c(function() {
  var r;
  const n = /* @__PURE__ */ new Map(), i = (r = g(this, ln)) == null ? void 0 : r.id;
  for (const o of game.scenes) {
    if (o.id === i) continue;
    const s = I(this, Ne, Nu).call(this, o) || "— No Folder —";
    n.has(s) || n.set(s, []), n.get(s).push({ id: o.id, name: o.name });
  }
  return [...n.keys()].sort((o, s) => o.localeCompare(s)).map((o) => ({
    path: o,
    scenes: n.get(o).sort((s, a) => s.name.localeCompare(a.name))
  }));
}, "#buildSceneGroups"), Nu = /* @__PURE__ */ c(function(n) {
  const i = [];
  let r = n.folder;
  for (; r; )
    i.unshift(r.name), r = r.folder;
  return i.join(" / ");
}, "#getFolderPath"), c(En, "AddLinkApplication"), se(En, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  ye(En, En, "DEFAULT_OPTIONS"),
  {
    id: `${Zf}-add-scene-link`,
    classes: Array.from(/* @__PURE__ */ new Set([...((gh = ye(En, En, "DEFAULT_OPTIONS")) == null ? void 0 : gh.classes) ?? [], "standard-form", "themed"])),
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
    template: `modules/${Zf}/templates/scene-links-add.html`
  }
});
let _u = En;
const eh = "eidolon-utilities";
var ph, Ko, ei, Ar, Qa;
const Sn = class Sn extends yt(pt) {
  constructor(n = {}) {
    const { scene: i, link: r, onComplete: o, ...s } = n ?? {};
    super(s);
    _(this, Ko, null);
    _(this, ei, null);
    _(this, Ar, null);
    _(this, Qa, /* @__PURE__ */ c(async (n) => {
      var o;
      n.preventDefault();
      const i = n.currentTarget;
      if (!(i instanceof HTMLFormElement)) return;
      const r = (o = new FormData(i).get("label")) == null ? void 0 : o.toString().trim();
      r && (await $C(g(this, Ko), g(this, ei).target, r), g(this, Ar) && g(this, Ar).call(this), this.close());
    }, "#onSubmit"));
    O(this, Ko, i ?? null), O(this, ei, r ?? null), O(this, Ar, typeof o == "function" ? o : null);
  }
  async _prepareContext() {
    var i, r, o;
    const n = Dr((i = g(this, ei)) == null ? void 0 : i.target);
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
    o && o.addEventListener("submit", g(this, Qa)), (s = r.querySelector('[data-action="cancel"]')) == null || s.addEventListener("click", (a) => {
      a.preventDefault(), this.close();
    });
  }
};
Ko = new WeakMap(), ei = new WeakMap(), Ar = new WeakMap(), Qa = new WeakMap(), c(Sn, "EditLinkApplication"), se(Sn, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  ye(Sn, Sn, "DEFAULT_OPTIONS"),
  {
    id: `${eh}-edit-scene-link`,
    classes: Array.from(/* @__PURE__ */ new Set([...((ph = ye(Sn, Sn, "DEFAULT_OPTIONS")) == null ? void 0 : ph.classes) ?? [], "standard-form", "themed"])),
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
    template: `modules/${eh}/templates/scene-links-edit.html`
  }
});
let $u = Sn;
const th = "eidolon-utilities";
var yh, Bi, ti, Mr, Za;
const Cn = class Cn extends yt(pt) {
  constructor(n = {}) {
    const { scene: i, target: r, onComplete: o, ...s } = n ?? {};
    super(s);
    _(this, Bi, null);
    _(this, ti, null);
    _(this, Mr, null);
    _(this, Za, /* @__PURE__ */ c(async (n) => {
      var s;
      n.preventDefault();
      const i = n.currentTarget;
      if (!(i instanceof HTMLFormElement)) return;
      const r = ((s = i.querySelector('input[name="removeReverse"]')) == null ? void 0 : s.checked) ?? !1, o = Dr(g(this, ti));
      r && o ? await PC(g(this, Bi), o) : await Oo(g(this, Bi), g(this, ti)), g(this, Mr) && g(this, Mr).call(this), this.close();
    }, "#onSubmit"));
    O(this, Bi, i ?? null), O(this, ti, r ?? null), O(this, Mr, typeof o == "function" ? o : null);
  }
  async _prepareContext() {
    const n = Dr(g(this, ti)), i = n ? mn(n).some((r) => {
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
    o && o.addEventListener("submit", g(this, Za)), (s = r.querySelector('[data-action="cancel"]')) == null || s.addEventListener("click", (a) => {
      a.preventDefault(), this.close();
    });
  }
};
Bi = new WeakMap(), ti = new WeakMap(), Mr = new WeakMap(), Za = new WeakMap(), c(Cn, "RemoveLinkApplication"), se(Cn, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  ye(Cn, Cn, "DEFAULT_OPTIONS"),
  {
    id: `${th}-remove-scene-link`,
    classes: Array.from(/* @__PURE__ */ new Set([...((yh = ye(Cn, Cn, "DEFAULT_OPTIONS")) == null ? void 0 : yh.classes) ?? [], "standard-form", "themed"])),
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
    template: `modules/${th}/templates/scene-links-remove.html`
  }
});
let Fu = Cn;
const Du = "eidolon-utilities", qC = `modules/${Du}/templates/scene-links-tab.html`, jC = {
  log: /* @__PURE__ */ c((...e) => {
    var t;
    return (t = console.debug) == null ? void 0 : t.call(console, `${Du} | SceneLinks`, ...e);
  }, "log"),
  group: /* @__PURE__ */ c((...e) => {
    var t;
    return (t = console.groupCollapsed) == null ? void 0 : t.call(console, `${Du} | SceneLinks`, ...e);
  }, "group"),
  groupEnd: /* @__PURE__ */ c(() => {
    var e;
    return (e = console.groupEnd) == null ? void 0 : e.call(console);
  }, "groupEnd")
}, BC = Zi(_u), UC = Zi($u), VC = Zi(Fu), GC = zu({
  tabId: "scene-links",
  tabLabel: /* @__PURE__ */ c(() => C("EIDOLON.SceneLinks.TabLabel", "Scene Links"), "tabLabel"),
  tabIcon: "fa-solid fa-link",
  getScene: at,
  isApplicable: /* @__PURE__ */ c(() => !0, "isApplicable"),
  renderContent: /* @__PURE__ */ c(({ app: e, tab: t, scene: n }) => zC(e, t, n), "renderContent"),
  logger: jC
});
function WC() {
  return GC.register();
}
c(WC, "registerSceneLinksConfigTab");
function zC(e, t, n) {
  if (!(t instanceof HTMLElement)) return;
  const i = Re(n) ? n : at(e);
  Sl(e, t, i);
}
c(zC, "renderLinksTab");
async function Sl(e, t, n) {
  var l, u, d;
  const i = n ?? at(e);
  if (!Re(i)) {
    t.innerHTML = `<p class="notes">${C("EIDOLON.SceneLinks.NoLinks", "No linked scenes.")}</p>`;
    return;
  }
  const o = mn(i).map((f) => {
    const h = Dr(f.target);
    return {
      label: f.label,
      target: f.target,
      sceneName: (h == null ? void 0 : h.name) ?? `[Missing: ${f.target}]`,
      isMissing: !h
    };
  }), s = ((u = (l = foundry == null ? void 0 : foundry.applications) == null ? void 0 : l.handlebars) == null ? void 0 : u.renderTemplate) ?? (typeof renderTemplate == "function" ? renderTemplate : globalThis == null ? void 0 : globalThis.renderTemplate);
  if (typeof s != "function") {
    t.innerHTML = `<p class="notes">${C("EIDOLON.SceneLinks.NoLinks", "No linked scenes.")}</p>`;
    return;
  }
  const a = await s(qC, {
    description: C("EIDOLON.SceneLinks.Description", "Link this scene to related scenes for quick navigation."),
    links: o,
    hasLinks: o.length > 0,
    syncCriteria: Td(i),
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
  t.innerHTML = a, YC(e, t, i), (d = e.setPosition) == null || d.call(e, { height: "auto" });
}
c(Sl, "renderLinksTabContent");
function YC(e, t, n) {
  const i = n ?? at(e);
  if (!Re(i)) return;
  t.querySelectorAll('[data-action="navigate"]').forEach((s) => {
    s.addEventListener("click", (a) => {
      a.preventDefault();
      const l = s.dataset.target;
      l && wp(l);
    });
  }), t.querySelectorAll('[data-action="edit"]').forEach((s) => {
    s.addEventListener("click", async (a) => {
      a.preventDefault();
      const l = s.dataset.target;
      if (!l) return;
      const u = mn(i).find((d) => d.target === l);
      u && await JC(e, t, i, u);
    });
  }), t.querySelectorAll('[data-action="remove"]').forEach((s) => {
    s.addEventListener("click", async (a) => {
      a.preventDefault();
      const l = s.dataset.target;
      l && await XC(e, t, i, l);
    });
  });
  const r = t.querySelector('[data-action="add"]');
  r && r.addEventListener("click", async (s) => {
    s.preventDefault(), await KC(e, t, i);
  });
  const o = t.querySelector('[data-action="toggle-sync-criteria"]');
  o && o.addEventListener("change", () => {
    e._eidolonActiveTab = "scene-links", vp(i, o.checked);
  });
}
c(YC, "bindTabEvents");
function KC(e, t, n) {
  e._eidolonActiveTab = "scene-links", BC({
    scene: n,
    onComplete: /* @__PURE__ */ c(() => {
      e._eidolonActiveTab = "scene-links", Sl(e, t, n);
    }, "onComplete")
  }).render({ force: !0 });
}
c(KC, "openAddDialog");
function XC(e, t, n, i) {
  e._eidolonActiveTab = "scene-links", VC({
    scene: n,
    target: i,
    onComplete: /* @__PURE__ */ c(() => {
      e._eidolonActiveTab = "scene-links", Sl(e, t, n);
    }, "onComplete")
  }).render({ force: !0 });
}
c(XC, "openRemoveDialog");
function JC(e, t, n, i) {
  e._eidolonActiveTab = "scene-links", UC({
    scene: n,
    link: i,
    onComplete: /* @__PURE__ */ c(() => {
      e._eidolonActiveTab = "scene-links", Sl(e, t, n);
    }, "onComplete")
  }).render({ force: !0 });
}
c(JC, "openEditDialog");
const nh = "eidolon-utilities";
function QC(e) {
  FC() || RC(e.id);
}
c(QC, "onDeleteScene");
function ZC() {
  WC(), Hooks.on("deleteScene", QC), Hooks.on("eidolon-utilities.criteriaStateApplied", HC), Hooks.once("ready", () => {
    const e = game.modules.get(nh);
    e.api || (e.api = {}), e.api.sceneLinks = {
      getSceneLinks: mn,
      setSceneLinks: El,
      addSceneLink: wa,
      removeSceneLink: Oo,
      findLinkByLabel: NC,
      navigateToLink: wp,
      getSyncLinkedCriteria: Td,
      setSyncLinkedCriteria: vp
    }, console.log(`[${nh}] Scene Links API registered.`);
  });
}
c(ZC, "registerSceneLinksHooks");
ZC();
const Si = "application/x-foundry-region-shape", Ld = /* @__PURE__ */ new Map();
function Pu() {
  for (const e of document.querySelectorAll(
    ".rs-shape--insert-before, .rs-shape--insert-after"
  ))
    e.classList.remove("rs-shape--insert-before", "rs-shape--insert-after");
}
c(Pu, "clearAllIndicators");
function Lp(e) {
  var t;
  for (const n of Ld.values())
    (t = n.container) == null || t.classList.toggle("rs-drag-active", e);
}
c(Lp, "setAllDragActive");
function eT() {
  Pu(), Lp(!1);
  for (const e of document.querySelectorAll(
    ".is-dragging, .rs-drop-over"
  ))
    e.classList.remove("is-dragging", "rs-drop-over");
}
c(eT, "globalCleanup");
async function ih(e, t, n) {
  const i = e.dataTransfer.getData(Si);
  if (!i) return;
  let r;
  try {
    r = JSON.parse(i);
  } catch {
    return;
  }
  const { shape: o, sourceRegionUuid: s, sourceIndex: a } = r;
  if (!o || s == null) return;
  const l = e.ctrlKey || e.metaKey, u = s === t.uuid;
  if (u && !l) {
    const f = n === -1 ? t.shapes.length : n;
    if (f === a || f === a + 1)
      return;
  }
  const d = foundry.utils.deepClone(o);
  if (u) {
    const f = foundry.utils.deepClone(t.shapes);
    f.splice(a, 1);
    const h = n === -1 ? f.length : n, m = a < h ? h - 1 : h;
    f.splice(m, 0, d), await t.update({ shapes: f });
  } else {
    const f = foundry.utils.deepClone(t.shapes), h = n === -1 ? f.length : n;
    if (f.splice(h, 0, d), await t.update({ shapes: f }), l) {
      const m = await fromUuid(s);
      if (m) {
        const p = foundry.utils.deepClone(m.shapes);
        p.splice(a, 1), await m.update({ shapes: p });
      }
    }
  }
}
c(ih, "handleShapeDrop");
function tT(e, t) {
  const n = He(t);
  if (!n) return;
  const i = e.document;
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
      d.dataTransfer.setData(Si, h), d.dataTransfer.effectAllowed = "copyMove", a.classList.add("is-dragging"), Lp(!0);
    }), a.addEventListener("dragover", (d) => {
      if (!d.dataTransfer.types.includes(Si)) return;
      d.preventDefault(), d.dataTransfer.dropEffect = d.ctrlKey || d.metaKey ? "move" : "copy";
      const f = a.getBoundingClientRect(), h = f.top + f.height / 2, m = d.clientY < h ? "before" : "after";
      Pu(), a.classList.add(
        m === "before" ? "rs-shape--insert-before" : "rs-shape--insert-after"
      );
    }), a.addEventListener("dragleave", () => {
      a.classList.remove(
        "rs-shape--insert-before",
        "rs-shape--insert-after"
      );
    }), a.addEventListener("drop", (d) => {
      if (d.preventDefault(), d.stopPropagation(), Pu(), !d.dataTransfer.types.includes(Si)) return;
      const h = (() => {
        const m = a.getBoundingClientRect(), p = m.top + m.height / 2;
        return d.clientY < p ? "before" : "after";
      })() === "before" ? l : l + 1;
      ih(d, i, h);
    }), a.addEventListener("dragend", () => {
      eT();
    });
  }
  o.classList.add("rs-drop-container"), o.addEventListener("dragover", (a) => {
    a.dataTransfer.types.includes(Si) && (a.preventDefault(), a.dataTransfer.dropEffect = a.ctrlKey || a.metaKey ? "move" : "copy");
  }), o.addEventListener("dragenter", (a) => {
    a.dataTransfer.types.includes(Si) && (a.preventDefault(), o.classList.add("rs-drop-over"));
  }), o.addEventListener("dragleave", (a) => {
    a.relatedTarget && o.contains(a.relatedTarget) || o.classList.remove("rs-drop-over");
  }), o.addEventListener("drop", (a) => {
    a.preventDefault(), o.classList.remove("rs-drop-over"), a.dataTransfer.types.includes(Si) && ih(a, i, -1);
  }), Ld.set(i.uuid, { app: e, container: o });
}
c(tT, "injectShapeDragHandles");
function nT(e) {
  const t = e.document;
  t && Ld.delete(t.uuid);
}
c(nT, "cleanupShapeDrag");
const iT = 100, Ip = 32;
function rT(e, t, n) {
  const i = [];
  for (let r = 0; r < e.length; r += 2)
    i.push(new n.IntPoint(Math.round(e[r] * t), Math.round(e[r + 1] * t)));
  return n.Clipper.Orientation(i) || i.reverse(), i;
}
c(rT, "polygonToPath");
function oT(e, t, n) {
  const { x: i, y: r, width: o, height: s, rotation: a } = e;
  let l = i * t, u = r * t, d = (i + o) * t, f = (r + s) * t;
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
c(oT, "rectangleToPath");
function sT(e, t, n, i) {
  const { x: r, y: o, radius: s } = e, a = r * t, l = o * t, u = s * t, d = [];
  for (let f = 0; f < i; f++) {
    const h = 2 * Math.PI * f / i;
    d.push(new n.IntPoint(Math.round(a + Math.cos(h) * u), Math.round(l + Math.sin(h) * u)));
  }
  return d;
}
c(sT, "circleToPath");
function aT(e, t, n, i) {
  const { x: r, y: o, radiusX: s, radiusY: a, rotation: l } = e, u = r * t, d = o * t, f = s * t, h = a * t, m = (l || 0) * Math.PI / 180, p = Math.cos(m), y = Math.sin(m), E = [];
  for (let v = 0; v < i; v++) {
    const b = 2 * Math.PI * v / i, w = Math.cos(b) * f, S = Math.sin(b) * h;
    E.push(new n.IntPoint(Math.round(u + p * w - y * S), Math.round(d + y * w + p * S)));
  }
  return E;
}
c(aT, "ellipseToPath");
function Ru(e, t, n, i = {}) {
  const r = i.vertexCount ?? Ip;
  switch (e.type) {
    case "polygon":
      return rT(e.points, t, n);
    case "rectangle":
      return oT(e, t, n);
    case "circle":
      return sT(e, t, n, r);
    case "ellipse":
      return aT(e, t, n, r);
    default:
      throw new Error(`Unknown shape type: ${e.type}`);
  }
}
c(Ru, "shapeToClipperPath");
function kp(e, t, n) {
  const i = [];
  for (const r of e)
    i.push(r.X / t, r.Y / t);
  return { type: "polygon", points: i, hole: n };
}
c(kp, "clipperPathToPolygonShape");
function rh(e) {
  const t = [], n = [], i = e.Childs();
  for (let r = i.length - 1; r >= 0; r--)
    n.push(i[r]);
  for (; n.length > 0; ) {
    const r = n.pop();
    t.push({ path: r.Contour(), hole: r.IsHole() });
    const o = r.Childs();
    for (let s = o.length - 1; s >= 0; s--)
      n.push(o[s]);
  }
  return t;
}
c(rh, "walkPolyTree");
function Op(e, t, n = {}) {
  const i = n.scalingFactor ?? iT, r = n.vertexCount ?? Ip, o = [], s = [];
  for (const h of e)
    h.hole ? s.push(h) : o.push(h);
  if (o.length <= 1 && s.length === 0 || o.length === 0) return null;
  const a = [];
  for (const h of o)
    a.push(Ru(h, i, t, { vertexCount: r }));
  const l = new t.Clipper();
  l.AddPaths(a, t.PolyType.ptSubject, !0);
  const u = new t.PolyTree();
  l.Execute(t.ClipType.ctUnion, u, t.PolyFillType.pftNonZero, t.PolyFillType.pftNonZero);
  let d = u;
  if (s.length > 0) {
    const h = [];
    for (const { path: b, hole: w } of rh(u))
      w || h.push(b);
    const m = [];
    for (const b of s) {
      const w = Ru(b, i, t, { vertexCount: r });
      t.Clipper.Orientation(w) || w.reverse(), m.push(w);
    }
    const p = new t.Clipper();
    p.AddPaths(m, t.PolyType.ptSubject, !0);
    const y = new t.Paths();
    p.Execute(t.ClipType.ctUnion, y, t.PolyFillType.pftNonZero, t.PolyFillType.pftNonZero);
    const E = [];
    for (const b of y)
      t.Clipper.Orientation(b) && b.reverse(), E.push(b);
    const v = new t.Clipper();
    v.AddPaths(h, t.PolyType.ptSubject, !0), v.AddPaths(E, t.PolyType.ptClip, !0), d = new t.PolyTree(), v.Execute(t.ClipType.ctDifference, d, t.PolyFillType.pftNonZero, t.PolyFillType.pftNonZero);
  }
  const f = [];
  for (const { path: h, hole: m } of rh(d))
    f.push(kp(h, i, m));
  return f;
}
c(Op, "mergeShapes");
function lT(e, t) {
  const n = He(t);
  if (!n) return;
  const i = e.document;
  if (!i) return;
  const r = n.querySelector("header.region-element.region-shape .region-element-controls");
  if (!r || r.querySelector('[data-action="shapeMergeOverlapping"]')) return;
  const o = document.createElement("a");
  o.className = "control", o.dataset.action = "shapeMergeOverlapping", o.dataset.tooltip = "Merge shapes & apply holes", o.setAttribute("aria-label", "Merge shapes and apply holes"), o.innerHTML = '<i class="fa-solid fa-object-union fa-fw"></i>';
  const s = i.shapes.filter((l) => !l.hole).length, a = i.shapes.filter((l) => l.hole).length;
  s < 2 && (s === 0 || a === 0) && (o.classList.add("disabled"), o.dataset.tooltip = "Need 2+ shapes to merge, or shapes with holes to subtract"), o.addEventListener("click", async (l) => {
    if (l.preventDefault(), o.classList.contains("disabled")) return;
    const u = i.shapes.map((f) => foundry.utils.deepClone(f)), d = Op(u, ClipperLib);
    if (!d) {
      ui.notifications.info("Nothing to merge — need 2+ shapes, or shapes with holes.");
      return;
    }
    await i.update({ shapes: d }), ui.notifications.info(`Merged ${u.length} shapes into ${d.length}.`);
  }), r.prepend(o);
}
c(lT, "injectMergeButton");
var bh, Hr, Ap, Mp;
const It = class It extends yt(pt) {
  constructor() {
    super(...arguments);
    _(this, Hr);
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
    super._onRender(n, i), I(this, Hr, Ap).call(this);
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
Hr = new WeakSet(), Ap = /* @__PURE__ */ c(function() {
  var i, r;
  const n = this.element;
  n instanceof HTMLElement && ((i = n.querySelector("[data-action='apply']")) == null || i.addEventListener("click", () => I(this, Hr, Mp).call(this)), (r = n.querySelector("[data-action='cancel']")) == null || r.addEventListener("click", () => this.close()));
}, "#bindEvents"), Mp = /* @__PURE__ */ c(async function() {
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
      /* @__PURE__ */ new Set([...((bh = ye(It, It, "DEFAULT_OPTIONS")) == null ? void 0 : bh.classes) ?? [], "eidolon-global-visibility-window", "themed"])
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
let Hu = It;
const xp = 100, _p = 32;
function cT(e) {
  let t = 1 / 0, n = 1 / 0, i = -1 / 0, r = -1 / 0, o = !1;
  for (const s of e)
    if (!s.hole)
      switch (s.type) {
        case "polygon":
          for (let a = 0; a < s.points.length; a += 2) {
            const l = s.points[a], u = s.points[a + 1];
            l < t && (t = l), u < n && (n = u), l > i && (i = l), u > r && (r = u), o = !0;
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
              v < t && (t = v), b < n && (n = b), v > i && (i = v), b > r && (r = b), o = !0;
            }
          } else
            for (const [l, u] of a)
              l < t && (t = l), u < n && (n = u), l > i && (i = l), u > r && (r = u), o = !0;
          break;
        }
        case "circle": {
          const a = s.radius;
          s.x - a < t && (t = s.x - a), s.y - a < n && (n = s.y - a), s.x + a > i && (i = s.x + a), s.y + a > r && (r = s.y + a), o = !0;
          break;
        }
        case "ellipse": {
          const a = s.radiusX, l = s.radiusY;
          s.x - a < t && (t = s.x - a), s.y - l < n && (n = s.y - l), s.x + a > i && (i = s.x + a), s.y + l > r && (r = s.y + l), o = !0;
          break;
        }
      }
  return o ? { minX: t, minY: n, maxX: i, maxY: r } : null;
}
c(cT, "regionBBox");
function uT(e, t) {
  return e.maxX > t.minX && e.minX < t.maxX && e.maxY > t.minY && e.minY < t.maxY;
}
c(uT, "bboxOverlaps");
function Np(e, t, n, i) {
  const r = [];
  for (const o of e)
    o.hole || r.push(Ru(o, t, n, { vertexCount: i }));
  return r;
}
c(Np, "nonHolePaths");
function oh(e, t) {
  if (e.length === 0) return [];
  if (e.length === 1) return [e[0]];
  const n = new t.Clipper();
  n.AddPaths(e, t.PolyType.ptSubject, !0);
  const i = new t.Paths();
  return n.Execute(t.ClipType.ctUnion, i, t.PolyFillType.pftNonZero, t.PolyFillType.pftNonZero), i;
}
c(oh, "unionPaths");
function dT(e, t, n, i) {
  const r = new n.Clipper();
  r.AddPaths(e, n.PolyType.ptSubject, !0), r.AddPaths(t, n.PolyType.ptClip, !0);
  const o = new n.Paths();
  r.Execute(n.ClipType.ctIntersection, o, n.PolyFillType.pftNonZero, n.PolyFillType.pftNonZero);
  const s = 4 * i * i;
  return o.some((a) => Math.abs(n.Clipper.Area(a)) > s);
}
c(dT, "pathsIntersect");
function fT(e, t, n = {}) {
  const i = n.scalingFactor ?? xp, r = n.vertexCount ?? _p, o = [];
  for (const a of e) {
    const l = a.shapes ?? [], u = cT(l);
    if (!u) continue;
    const d = Np(l, i, t, r);
    d.length !== 0 && o.push({ region: a, bbox: u, paths: d });
  }
  const s = /* @__PURE__ */ new Set();
  for (let a = 0; a < o.length; a++)
    for (let l = a + 1; l < o.length; l++)
      uT(o[a].bbox, o[l].bbox) && dT(o[a].paths, o[l].paths, t, i) && (s.add(o[a].region), s.add(o[l].region));
  return [...s];
}
c(fT, "findOverlappingRegions");
function hT(e, t, n = {}) {
  const i = n.scalingFactor ?? xp, r = n.vertexCount ?? _p;
  let o = [];
  const s = [];
  for (let a = 0; a < e.length; a++) {
    const l = e[a], u = l.shapes ?? [], d = Np(u, i, t, r);
    if (a === 0) {
      o = oh(d, t);
      continue;
    }
    if (d.length === 0) continue;
    const f = new t.Clipper();
    f.AddPaths(d, t.PolyType.ptSubject, !0), f.AddPaths(o, t.PolyType.ptClip, !0);
    const h = new t.PolyTree();
    f.Execute(t.ClipType.ctDifference, h, t.PolyFillType.pftNonZero, t.PolyFillType.pftNonZero);
    const m = [], p = [], y = h.Childs();
    for (let v = y.length - 1; v >= 0; v--) p.push(y[v]);
    for (; p.length > 0; ) {
      const v = p.pop();
      m.push(kp(v.Contour(), i, v.IsHole()));
      const b = v.Childs();
      for (let w = b.length - 1; w >= 0; w--) p.push(b[w]);
    }
    for (const v of u)
      v.hole && m.push(foundry.utils.deepClone(v));
    s.push({ region: l, newShapes: m });
    const E = [...o, ...d];
    o = oh(E, t);
  }
  return s;
}
c(hT, "resolveOverlaps");
var vh, An, ni, cn, gi, $p, Fp, Dp;
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
    super._onRender(n, i), I(this, gi, $p).call(this);
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
    const i = fT(n, ClipperLib);
    if (i.length === 0) {
      ui.notifications.info("No overlapping regions found on this scene.");
      return;
    }
    new kt({ regions: i }).render(!0);
  }
};
An = new WeakMap(), ni = new WeakMap(), cn = new WeakMap(), gi = new WeakSet(), $p = /* @__PURE__ */ c(function() {
  var r, o;
  const n = this.element;
  if (!(n instanceof HTMLElement)) return;
  const i = n.querySelector("[data-role='region-list']");
  i && I(this, gi, Fp).call(this, i);
  for (const s of n.querySelectorAll("[data-action='toggle-exclude']"))
    s.addEventListener("click", (a) => {
      a.stopPropagation();
      const l = Number(s.dataset.index), u = g(this, An)[l];
      u && (g(this, ni).has(u.id) ? g(this, ni).delete(u.id) : g(this, ni).add(u.id), this.render({ force: !0 }));
    });
  (r = n.querySelector("[data-action='resolve']")) == null || r.addEventListener("click", () => I(this, gi, Dp).call(this)), (o = n.querySelector("[data-action='cancel']")) == null || o.addEventListener("click", () => this.close());
}, "#bindEvents"), // ── Drag reorder ─────────────────────────────────────────────────────
Fp = /* @__PURE__ */ c(function(n) {
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
}, "#bindDragReorder"), Dp = /* @__PURE__ */ c(async function() {
  const n = g(this, An).filter((s) => !g(this, ni).has(s.id)), i = hT(n, ClipperLib);
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
      /* @__PURE__ */ new Set([...((vh = ye(kt, kt, "DEFAULT_OPTIONS")) == null ? void 0 : vh.classes) ?? [], "eidolon-overlap-resolver-window", "themed"])
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
let qu = kt;
function mT(e, t) {
  var u;
  const n = He(t);
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
      const v = (E.shapes ?? []).map((w) => foundry.utils.deepClone(w)), b = Op(v, ClipperLib);
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
    d.preventDefault(), d.stopPropagation(), Hu.open();
  }), o(a);
  const l = document.createElement("button");
  l.type = "button", l.className = "header-control fa-solid fa-scissors", l.dataset.action = "openOverlapResolver", l.dataset.tooltip = "Overlap Resolver", l.setAttribute("aria-label", "Open overlap resolver"), l.addEventListener("click", (d) => {
    d.preventDefault(), d.stopPropagation(), qu.open();
  }), o(l);
}
c(mT, "injectRegionLegendButtons");
function gT() {
  Hooks.on("renderRegionConfig", (e, t) => {
    tT(e, t), lT(e, t);
  }), Hooks.on("closeRegionConfig", (e) => {
    nT(e);
  }), Hooks.on("renderRegionLegend", (e, t) => {
    mT(e, t);
  });
}
c(gT, "registerRegionShapeHooks");
gT();
const si = k, Id = "softVisionAttenuation", kd = "softVisionBrightness", Od = "softVisionContrast", Ad = "softVisionSaturation", po = "softFade", gr = Object.freeze({
  attenuation: 0.9,
  brightness: -0.1,
  contrast: -0.2,
  saturation: -0.1
});
function gs(e) {
  try {
    const t = Number(game.settings.get(si, e));
    return Number.isFinite(t) ? t : gr[sh(e)];
  } catch {
    return gr[sh(e)] ?? 0;
  }
}
c(gs, "getNumberSetting");
function sh(e) {
  return {
    [Id]: "attenuation",
    [kd]: "brightness",
    [Od]: "contrast",
    [Ad]: "saturation"
  }[e];
}
c(sh, "settingToDefaultKey");
function pT(e) {
  game.settings.register(si, Id, {
    name: "Soft Fade: Attenuation",
    hint: "How strongly the vision darkens toward the perimeter (0 = uniform, 1 = full falloff).",
    scope: "client",
    config: !0,
    type: Number,
    default: gr.attenuation,
    range: { min: 0, max: 1, step: 0.05 },
    onChange: e
  }), game.settings.register(si, kd, {
    name: "Soft Fade: Brightness",
    hint: "Negative values darken the outer ring of vision.",
    scope: "client",
    config: !0,
    type: Number,
    default: gr.brightness,
    range: { min: -1, max: 1, step: 0.05 },
    onChange: e
  }), game.settings.register(si, Od, {
    name: "Soft Fade: Contrast",
    hint: "Negative values soften the scene near the vision edge.",
    scope: "client",
    config: !0,
    type: Number,
    default: gr.contrast,
    range: { min: -1, max: 1, step: 0.05 },
    onChange: e
  }), game.settings.register(si, Ad, {
    name: "Soft Fade: Saturation",
    hint: "Negative values desaturate toward the vision edge.",
    scope: "client",
    config: !0,
    type: Number,
    default: gr.saturation,
    range: { min: -1, max: 1, step: 0.05 },
    onChange: e
  });
}
c(pT, "registerSettings");
function yT() {
  var e, t, n;
  return ((t = (e = foundry == null ? void 0 : foundry.canvas) == null ? void 0 : e.perception) == null ? void 0 : t.VisionMode) ?? ((n = CONFIG.Canvas.visionModes.basic) == null ? void 0 : n.constructor);
}
c(yT, "getVisionModeClass");
function bT() {
  var e, t, n, i;
  return ((t = (e = foundry == null ? void 0 : foundry.canvas) == null ? void 0 : e.rendering) == null ? void 0 : t.ColorAdjustmentsSamplerShader) ?? ((i = (n = CONFIG.Canvas.visionModes.darkvision) == null ? void 0 : n.canvas) == null ? void 0 : i.shader);
}
c(bT, "getColorAdjustmentsShader");
function vT() {
  const e = yT(), t = bT();
  return !e || !t ? null : new e({
    id: po,
    label: "Soft Fade",
    tokenConfig: !0,
    canvas: {
      shader: t,
      uniforms: { contrast: 0, saturation: 0, brightness: 0 }
    },
    vision: {
      defaults: {
        attenuation: gs(Id),
        brightness: gs(kd),
        contrast: gs(Od),
        saturation: gs(Ad)
      }
    }
  });
}
c(vT, "buildSoftVisionMode");
function ec() {
  var t;
  const e = vT();
  return e ? (CONFIG.Canvas.visionModes[po] = e, canvas != null && canvas.ready && ((t = canvas.perception) == null || t.update({ refreshVision: !0, refreshLighting: !0 })), !0) : (console.warn(`[${si}] Soft Vision: required classes not available yet, deferring.`), !1);
}
c(ec, "refreshVisionMode");
function wT() {
  Hooks.once("init", () => {
    pT(ec);
  }), Hooks.once("setup", () => {
    ec();
  }), Hooks.once("ready", () => {
    CONFIG.Canvas.visionModes[po] || ec();
    const e = game.modules.get(si);
    e.api || (e.api = {}), e.api.softVision = {
      VISION_MODE_ID: po,
      /** Apply the Soft Fade vision mode to all currently controlled tokens. */
      async applyToControlled() {
        const t = canvas.tokens.controlled;
        if (!t.length) {
          ui.notifications.warn("Select at least one token.");
          return;
        }
        for (const n of t)
          await n.document.updateVisionMode(po, !0);
      }
    }, console.log(`[${si}] Soft Vision API registered.`);
  });
}
c(wT, "registerSoftVisionHooks");
wT();
const Pr = k, ju = "softLightFade", Kt = Object.freeze({
  enabled: !1,
  threshold: 0.3,
  saturation: -0.8,
  brightness: -0.15
}), ET = `
  uniform bool softFadeEnabled;
  uniform float softFadeThreshold;
  uniform float softFadeSaturation;
  uniform float softFadeBrightness;`, ST = `
    // Soft Light Fade — per-light radial desaturation/darkening
    if ( softFadeEnabled ) {
      float sfFade = smoothstep(softFadeThreshold, 1.0, dist);
      if ( sfFade > 0.0 ) {
        vec3 sfGrey = vec3(perceivedBrightness(finalColor));
        finalColor = mix(finalColor, sfGrey, sfFade * (-softFadeSaturation));
        finalColor *= 1.0 + (sfFade * softFadeBrightness);
      }
    }
`, tc = "uniform float saturation;", CT = "if ( attenuation != 0.0 ) depth *= smoothstep(";
function TT() {
  const e = /* @__PURE__ */ new Set();
  for (const t of Object.values(CONFIG.Canvas.lightAnimations))
    t.illuminationShader && e.add(t.illuminationShader);
  if (e.size > 0) {
    const t = e.values().next().value;
    let n = Object.getPrototypeOf(t);
    for (; n && n !== Function.prototype; ) {
      if (n.hasOwnProperty("SHADER_HEADER") && typeof n.fragmentShader == "string") {
        e.add(n);
        break;
      }
      n = Object.getPrototypeOf(n);
    }
  }
  return e;
}
c(TT, "collectIlluminationShaders");
function LT(e) {
  const t = e.fragmentShader;
  if (typeof t != "string" || t.includes("softFadeEnabled")) return !1;
  const n = t.indexOf(tc);
  if (n === -1)
    return console.warn("[eidolon-utilities] Soft Light: could not find uniform anchor in", e.name), !1;
  const i = t.slice(0, n + tc.length) + ET + t.slice(n + tc.length), r = i.indexOf(CT);
  if (r === -1)
    return console.warn("[eidolon-utilities] Soft Light: could not find FALLOFF anchor in", e.name), !1;
  const o = i.slice(0, r) + ST + i.slice(r);
  return e.fragmentShader = o, e.defaultUniforms.hasOwnProperty("softFadeEnabled") || (e.defaultUniforms = {
    ...e.defaultUniforms,
    softFadeEnabled: Kt.enabled,
    softFadeThreshold: Kt.threshold,
    softFadeSaturation: Kt.saturation,
    softFadeBrightness: Kt.brightness
  }), !0;
}
c(LT, "patchShaderClass");
function IT() {
  const e = TT();
  let t = 0;
  for (const n of e)
    LT(n) && t++;
  return t;
}
c(IT, "patchIlluminationShaders");
function kT() {
  var n, i;
  const e = (i = (n = foundry == null ? void 0 : foundry.canvas) == null ? void 0 : n.sources) == null ? void 0 : i.PointLightSource;
  if (!e) return null;
  let t = e.prototype;
  for (; t; ) {
    if (t.hasOwnProperty("_updateCommonUniforms")) return t;
    t = Object.getPrototypeOf(t);
  }
  return null;
}
c(kT, "getBaseLightSourceProto");
function OT() {
  const e = kT();
  if (!e)
    return console.warn(`[${Pr}] Soft Light: could not find _updateCommonUniforms on BaseLightSource`), !1;
  const t = e._updateCommonUniforms;
  return e._updateCommonUniforms = /* @__PURE__ */ c(function(i) {
    var a, l;
    t.call(this, i);
    const r = i == null ? void 0 : i.uniforms;
    if (!r || !("softFadeEnabled" in r)) return;
    const o = (a = this.object) == null ? void 0 : a.document;
    if (!o) {
      r.softFadeEnabled = !1;
      return;
    }
    const s = (l = o.getFlag) == null ? void 0 : l.call(o, Pr, ju);
    if (!(s != null && s.enabled)) {
      r.softFadeEnabled = !1;
      return;
    }
    r.softFadeEnabled = !0, r.softFadeThreshold = s.threshold ?? Kt.threshold, r.softFadeSaturation = s.saturation ?? Kt.saturation, r.softFadeBrightness = s.brightness ?? Kt.brightness;
  }, "patchedUpdateCommonUniforms"), !0;
}
c(OT, "patchUniformUpdater");
function AT() {
  Hooks.on("renderAmbientLightConfig", MT);
}
c(AT, "registerLightConfigUI");
function MT(e, t) {
  var v, b, w, S;
  const n = He(t);
  if (!n || n.querySelector(".eidolon-soft-light-fade")) return;
  const i = n.querySelector('.tab[data-tab="animation"]');
  if (!i) return;
  const r = e.document ?? ((v = e.object) == null ? void 0 : v.document) ?? e.object;
  if (!r) return;
  const o = ((b = r.getFlag) == null ? void 0 : b.call(r, Pr, ju)) ?? {}, s = o.enabled ?? Kt.enabled, a = o.threshold ?? Kt.threshold, l = o.saturation ?? Kt.saturation, u = o.brightness ?? Kt.brightness, d = `flags.${Pr}.${ju}`, f = document.createElement("fieldset");
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
  (S = e.setPosition) == null || S.call(e, { height: "auto" });
}
c(MT, "handleRender");
function xT() {
  Hooks.once("init", () => {
    const e = IT();
    console.log(`[${Pr}] Soft Light: patched ${e} illumination shaders`);
  }), Hooks.once("setup", () => {
    OT() && console.log(`[${Pr}] Soft Light: uniform updater installed`);
  }), AT();
}
c(xT, "registerSoftLightHooks");
xT();
const Pp = "eidolon-utilities", _T = "directionalTeleport", nc = `${Pp}.${_T}`, ah = `[${Pp}] Directional Teleport:`, ps = ["left", "right", "up", "down"], ic = { left: "Left", right: "Right", up: "Up", down: "Down" }, rc = { left: "fa-arrow-left", right: "fa-arrow-right", up: "fa-arrow-up", down: "fa-arrow-down" }, NT = { left: "fa-arrow-right", right: "fa-arrow-left", up: "fa-arrow-down", down: "fa-arrow-up" };
Hooks.once("init", () => {
  const { RegionBehaviorType: e } = foundry.data.regionBehaviors, { BooleanField: t, DocumentUUIDField: n, StringField: i } = foundry.data.fields, p = class p extends i {
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
      const w = b.value || "", S = w ? w.split(",").filter((N) => ps.includes(N)) : [], T = S.map(
        (N) => `<span class="eidutil-pill" data-value="${N}"><i class="fa-solid ${rc[N]}"></i> <span>${ic[N]}</span><a class="eidutil-pill-remove"><i class="fa-solid fa-xmark"></i></a></span>`
      ).join(""), L = S.length > 0 ? ' style="display:none"' : "", A = S.length >= ps.length ? ' style="display:none"' : "", M = ps.map(
        (N) => `<a class="eidutil-pill-option" data-value="${N}"` + (S.includes(N) ? ' style="display:none"' : "") + `><i class="fa-solid ${rc[N]}"></i> ${ic[N]}</a>`
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
    return (v == null ? void 0 : v.value) === "enter" ? NT : rc;
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
      L && (L.style.display = P >= ps.length ? "none" : "");
    }, "updateAddButton"), x = /* @__PURE__ */ c(() => {
      const P = new Set(w.value ? w.value.split(",") : []);
      for (const j of M.querySelectorAll(".eidutil-pill-option"))
        j.style.display = P.has(j.dataset.value) ? "none" : "";
    }, "updateDropdownOptions"), R = /* @__PURE__ */ c((P) => {
      const j = s(b), q = document.createElement("span");
      q.classList.add("eidutil-pill"), q.dataset.value = P, q.innerHTML = `<i class="fa-solid ${j[P]}"></i> <span>${ic[P]}</span><a class="eidutil-pill-remove"><i class="fa-solid fa-xmark"></i></a>`, S.appendChild(q);
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
      const ce = /* @__PURE__ */ new Map(), Se = /* @__PURE__ */ new Map(), qe = /* @__PURE__ */ new Map();
      for (const oe of Ke) {
        const Me = oe.sceneName + (oe.folderPath ? ` (${oe.folderPath})` : "");
        ce.has(Me) || (ce.set(Me, []), Se.set(Me, oe.sceneId), qe.set(Me, oe.folderPath)), ce.get(Me).push(oe);
      }
      const gn = [...ce.keys()].sort((oe, Me) => {
        const Xe = Se.get(oe) === b, wt = Se.get(Me) === b;
        if (Xe !== wt) return Xe ? -1 : 1;
        const Ve = Bs(w, qe.get(oe)), Et = Bs(w, qe.get(Me));
        return Ve !== Et ? Et - Ve : oe.localeCompare(Me);
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
  const E = class E extends e {
    static defineSchema() {
      return {
        destination: new r({
          required: !1,
          initial: "",
          nullable: !1
        }),
        choice: new t(),
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
        console.error(`${ah} ${this.destination} does not exist`);
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
    [nc]: m
  }), CONFIG.RegionBehavior.typeLabels[nc] = "EIDUTIL.directionalTeleport.typeLabel", CONFIG.RegionBehavior.typeIcons[nc] = "fa-solid fa-compass", console.log(`${ah} Behavior registered.`);
});
Hooks.on("init", () => {
  const e = game.modules.get("betterroofs");
  e != null && e.active && libWrapper.register(
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
