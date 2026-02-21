var ha = Object.defineProperty;
var Ll = Object.getPrototypeOf;
var Il = Reflect.get;
var pa = (e) => {
  throw TypeError(e);
};
var Sl = (e, t, n) => t in e ? ha(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var s = (e, t) => ha(e, "name", { value: t, configurable: !0 });
var je = (e, t, n) => Sl(e, typeof t != "symbol" ? t + "" : t, n), Dr = (e, t, n) => t.has(e) || pa("Cannot " + n);
var m = (e, t, n) => (Dr(e, t, "read from private field"), n ? n.call(e) : t.get(e)), M = (e, t, n) => t.has(e) ? pa("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, n), v = (e, t, n, i) => (Dr(e, t, "write to private field"), i ? i.call(e, n) : t.set(e, n), n), L = (e, t, n) => (Dr(e, t, "access private method"), n);
var ft = (e, t, n) => Il(Ll(e), n, t);
const w = "eidolon-utilities", Mi = "timeTriggerActive", Gr = "timeTriggerHideWindow", Wr = "timeTriggerShowPlayerWindow", Kr = "timeTriggerAllowRealTime", Ka = "timeTriggers", mi = "timeTriggerHistory", Jr = "debug", Yr = "timeFormat", Qr = "manageTime", Xr = "secondsPerRound";
const wl = [-30, -15, -5, 5, 15, 30], rn = 1440 * 60, hi = "playSound", Wn = 6;
function f(e, t) {
  var n, i;
  return (i = (n = game.i18n) == null ? void 0 : n.has) != null && i.call(n, e) ? game.i18n.localize(e) : t;
}
s(f, "localize");
function Ai(e) {
  return typeof e != "string" ? "" : e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
s(Ai, "escapeHtml");
function Ye(e) {
  var t;
  return e == null ? e : (t = foundry == null ? void 0 : foundry.utils) != null && t.duplicate ? foundry.utils.duplicate(e) : JSON.parse(JSON.stringify(e));
}
s(Ye, "duplicateData");
function Ol() {
  var e;
  return (e = foundry == null ? void 0 : foundry.utils) != null && e.randomID ? foundry.utils.randomID() : typeof (crypto == null ? void 0 : crypto.randomUUID) == "function" ? crypto.randomUUID() : Math.random().toString(36).slice(2, 10);
}
s(Ol, "generateTriggerId");
function Ja(e) {
  if (typeof e != "string") return null;
  const t = e.trim();
  if (!t) return null;
  const n = t.match(/^([0-9]{1,2}):([0-9]{2})(?::([0-9]{2}))?$/);
  if (!n) return null;
  const i = Number(n[1]), r = Number(n[2]), o = n[3] !== void 0 ? Number(n[3]) : 0;
  return !Number.isInteger(i) || !Number.isInteger(r) || !Number.isInteger(o) || i < 0 || i > 23 || r < 0 || r > 59 || o < 0 || o > 59 ? null : i * 3600 + r * 60 + o;
}
s(Ja, "parseTriggerTimeToSeconds");
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
const Zr = /* @__PURE__ */ new Set(), eo = /* @__PURE__ */ new Set(), to = /* @__PURE__ */ new Set(), no = /* @__PURE__ */ new Set();
let Gt = !1, Mn = !1, Ni = Wn, _i = "12h", ya = !1;
function Fr(e) {
  Gt = !!e;
  for (const t of Zr)
    try {
      t(Gt);
    } catch (n) {
      console.error(`${w} | Debug change handler failed`, n);
    }
}
s(Fr, "notifyDebugChange");
function xr(e) {
  Mn = !!e;
  for (const t of eo)
    try {
      t(Mn);
    } catch (n) {
      console.error(`${w} | Manage time change handler failed`, n);
    }
}
s(xr, "notifyManageTimeChange");
function Ya(e) {
  return e === "24h" ? "24h" : "12h";
}
s(Ya, "normalizeTimeFormatValue");
function jo(e) {
  const t = Number(e);
  return !Number.isFinite(t) || t <= 0 ? Wn : t;
}
s(jo, "normalizeSecondsPerRoundValue");
function kr(e) {
  const t = jo(e);
  Ni = t;
  for (const n of to)
    try {
      n(t);
    } catch (i) {
      console.error(`${w} | Seconds-per-round change handler failed`, i);
    }
}
s(kr, "notifySecondsPerRoundChange");
function Rr(e) {
  const t = Ya(e);
  _i = t;
  for (const n of no)
    try {
      n(t);
    } catch (i) {
      console.error(`${w} | Time format change handler failed`, i);
    }
}
s(Rr, "notifyTimeFormatChange");
function vl() {
  var t;
  if (ya) return;
  if (ya = !0, !((t = game == null ? void 0 : game.settings) != null && t.register)) {
    console.warn(
      `${w} | game.settings.register is unavailable. Module settings could not be registered.`
    );
    return;
  }
  const e = typeof game.settings.registerChange == "function";
  game.settings.register(w, Jr, {
    name: f("EIDOLON.TimeTrigger.DebugSettingName", "Enable debug logging"),
    hint: f(
      "EIDOLON.TimeTrigger.DebugSettingHint",
      "Write detailed time-trigger diagnostics to the browser console."
    ),
    scope: "world",
    config: !0,
    type: Boolean,
    default: !1,
    onChange: e ? void 0 : Fr
  }), e && game.settings.registerChange(w, Jr, Fr), Gt = zo(), Fr(Gt), game.settings.register(w, Qr, {
    name: f("EIDOLON.TimeTrigger.ManageTimeSettingName", "Manage Game Time"),
    hint: f(
      "EIDOLON.TimeTrigger.ManageTimeSettingHint",
      "Allow Eidolon Utilities to advance world time automatically while the game is unpaused. Warning: This may conflict with other time-management modules."
    ),
    scope: "world",
    config: !0,
    type: Boolean,
    default: !1,
    onChange: e ? void 0 : xr
  }), e && game.settings.registerChange(w, Qr, xr), Mn = Al(), xr(Mn), game.settings.register(w, Xr, {
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
    default: Wn,
    range: { min: 1, max: 3600, step: 1 },
    onChange: e ? void 0 : kr
  }), e && game.settings.registerChange(
    w,
    Xr,
    kr
  ), Ni = jo(Nl()), kr(Ni), game.settings.register(w, Yr, {
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
    onChange: e ? void 0 : Rr
  }), e && game.settings.registerChange(w, Yr, Rr), _i = Ya(Qa()), Rr(_i);
}
s(vl, "registerTimeTriggerSettings");
function zo() {
  var e;
  try {
    if ((e = game == null ? void 0 : game.settings) != null && e.get)
      return !!game.settings.get(w, Jr);
  } catch (t) {
    console.error(`${w} | Failed to read debug setting`, t);
  }
  return !1;
}
s(zo, "getDebugSetting");
function Ml() {
  return Gt = zo(), Gt;
}
s(Ml, "refreshDebugSettingCache");
function Al() {
  var e;
  try {
    if ((e = game == null ? void 0 : game.settings) != null && e.get)
      return !!game.settings.get(w, Qr);
  } catch (t) {
    console.error(`${w} | Failed to read manage time setting`, t);
  }
  return !1;
}
s(Al, "getManageTimeSetting");
function Qa() {
  var e;
  try {
    if ((e = game == null ? void 0 : game.settings) != null && e.get)
      return game.settings.get(w, Yr) === "24h" ? "24h" : "12h";
  } catch (t) {
    console.error(`${w} | Failed to read time format setting`, t);
  }
  return "12h";
}
s(Qa, "getTimeFormatSetting");
function Nl() {
  var e;
  try {
    if ((e = game == null ? void 0 : game.settings) != null && e.get) {
      const t = game.settings.get(w, Xr);
      return jo(t);
    }
  } catch (t) {
    console.error(`${w} | Failed to read seconds-per-round setting`, t);
  }
  return Wn;
}
s(Nl, "getSecondsPerRoundSetting");
function _l(e) {
  if (typeof e != "function")
    return () => {
    };
  Zr.add(e);
  try {
    e(Gt);
  } catch (t) {
    console.error(`${w} | Debug change handler failed`, t);
  }
  return () => {
    Zr.delete(e);
  };
}
s(_l, "onDebugSettingChange");
function Xa(e) {
  if (typeof e != "function")
    return () => {
    };
  eo.add(e);
  try {
    e(Mn);
  } catch (t) {
    console.error(`${w} | Manage time change handler failed`, t);
  }
  return () => {
    eo.delete(e);
  };
}
s(Xa, "onManageTimeSettingChange");
function Go(e) {
  if (typeof e != "function")
    return () => {
    };
  no.add(e);
  try {
    e(_i);
  } catch (t) {
    console.error(`${w} | Time format change handler failed`, t);
  }
  return () => {
    no.delete(e);
  };
}
s(Go, "onTimeFormatSettingChange");
function Dl(e) {
  if (typeof e != "function")
    return () => {
    };
  to.add(e);
  try {
    e(Ni);
  } catch (t) {
    console.error(`${w} | Seconds-per-round change handler failed`, t);
  }
  return () => {
    to.delete(e);
  };
}
s(Dl, "onSecondsPerRoundSettingChange");
let Er = !1, io = !1;
function ro(e) {
  Er = !!e;
}
s(ro, "updateDebugState");
function Za() {
  io || (io = !0, ro(zo()), _l((e) => {
    ro(e), console.info(`${w} | Debug ${Er ? "enabled" : "disabled"}`);
  }));
}
s(Za, "ensureInitialized");
function Wo() {
  return io || Za(), Er;
}
s(Wo, "shouldLog");
function es(e) {
  if (!e.length)
    return [`${w} |`];
  const [t, ...n] = e;
  return typeof t == "string" ? [`${w} | ${t}`, ...n] : [`${w} |`, t, ...n];
}
s(es, "formatArgs");
function Fl() {
  Za();
}
s(Fl, "initializeDebug");
function xl() {
  return ro(Ml()), Er;
}
s(xl, "syncDebugState");
function I(...e) {
  Wo() && console.debug(...es(e));
}
s(I, "debugLog");
function dn(...e) {
  Wo() && console.group(...es(e));
}
s(dn, "debugGroup");
function Ct() {
  Wo() && console.groupEnd();
}
s(Ct, "debugGroupEnd");
function on(e) {
  var r;
  const t = (r = e == null ? void 0 : e.getFlag) == null ? void 0 : r.call(e, w, Ka);
  if (!t) return [];
  const n = Ye(t), i = Array.isArray(n) ? n : [];
  return I("Loaded time triggers", {
    sceneId: (e == null ? void 0 : e.id) ?? null,
    count: i.length
  }), i;
}
s(on, "getTimeTriggers");
async function ts(e, t) {
  e != null && e.setFlag && (I("Persisting time triggers", {
    sceneId: e.id,
    count: Array.isArray(t) ? t.length : 0
  }), await e.setFlag(w, Ka, t));
}
s(ts, "setTimeTriggers");
function kl(e) {
  var r;
  const t = (r = e == null ? void 0 : e.getFlag) == null ? void 0 : r.call(e, w, mi);
  if (!t) return {};
  const n = Ye(t);
  if (!n || typeof n != "object") return {};
  const i = {};
  for (const [o, a] of Object.entries(n))
    typeof a == "number" && Number.isFinite(a) && (i[o] = a);
  return I("Loaded time trigger history", {
    sceneId: (e == null ? void 0 : e.id) ?? null,
    keys: Object.keys(i)
  }), i;
}
s(kl, "getTimeTriggerHistory");
async function Hr(e, t) {
  var c, u, d, g;
  if (!e) return;
  const n = {};
  if (t && typeof t == "object")
    for (const [h, y] of Object.entries(t))
      typeof y == "number" && Number.isFinite(y) && (n[h] = y);
  const i = ((c = e.getFlag) == null ? void 0 : c.call(e, w, mi)) ?? {}, r = {};
  if (i && typeof i == "object")
    for (const [h, y] of Object.entries(i))
      typeof y == "number" && Number.isFinite(y) && (r[h] = y);
  const o = Object.keys(n), a = Object.keys(r);
  if (typeof ((u = foundry == null ? void 0 : foundry.utils) == null ? void 0 : u.deepEqual) == "function" ? foundry.utils.deepEqual(r, n) : JSON.stringify(r) === JSON.stringify(n)) {
    I("Skip history update because state is unchanged", {
      sceneId: (e == null ? void 0 : e.id) ?? null
    });
    return;
  }
  I("Updating time trigger history", {
    sceneId: (e == null ? void 0 : e.id) ?? null,
    keys: o,
    removedKeys: a.filter((h) => !o.includes(h))
  });
  try {
    a.length && typeof e.unsetFlag == "function" && await e.unsetFlag(w, mi), o.length && await e.setFlag(w, mi, n);
  } catch (h) {
    console.error(`${w} | Failed to persist time trigger history`, h), (g = (d = ui.notifications) == null ? void 0 : d.error) == null || g.call(
      d,
      f(
        "EIDOLON.TimeTrigger.HistoryPersistError",
        "Failed to persist the scene's time trigger history."
      )
    );
  }
}
s(Hr, "updateTimeTriggerHistory");
const Di = /* @__PURE__ */ new Map(), ba = /* @__PURE__ */ new Set();
function Rl(e) {
  if (!(e != null && e.id))
    throw new Error(`${w} | Action definitions require an id.`);
  if (Di.has(e.id))
    throw new Error(`${w} | Duplicate time trigger action id: ${e.id}`);
  Di.set(e.id, {
    ...e
  }), I("Registered time trigger action", { actionId: e.id });
}
s(Rl, "registerAction");
function Kn(e) {
  return Di.get(e) ?? null;
}
s(Kn, "getAction");
function Hl(e) {
  const t = Kn(e);
  return t ? typeof t.label == "function" ? t.label() : t.label : e;
}
s(Hl, "getActionLabel");
function Ta() {
  return Array.from(Di.values());
}
s(Ta, "listActions");
async function ns(e, t) {
  var i, r;
  const n = Kn(t == null ? void 0 : t.action);
  if (!n || typeof n.execute != "function") {
    const o = f(
      "EIDOLON.TimeTrigger.UnknownAction",
      "Encountered an unknown time trigger action and skipped it."
    );
    (r = (i = ui.notifications) == null ? void 0 : i.warn) == null || r.call(i, o), console.warn(`${w} | Unknown time trigger action`, t), I("Encountered unknown time trigger action", {
      triggerId: (t == null ? void 0 : t.id) ?? null,
      actionId: (t == null ? void 0 : t.action) ?? null
    });
    return;
  }
  I("Executing action handler", {
    actionId: n.id,
    triggerId: (t == null ? void 0 : t.id) ?? null,
    sceneId: (e == null ? void 0 : e.id) ?? null
  }), await n.execute({ scene: e, trigger: t });
}
s(ns, "executeTriggerAction");
function $l(e) {
  const t = Kn(e == null ? void 0 : e.action);
  return !t || typeof t.buildSummaryParts != "function" ? [] : t.buildSummaryParts({ trigger: e, escapeHtml: Ai, localize: f }) ?? [];
}
s($l, "buildActionSummaryParts");
function Pl(e) {
  const t = Kn(e == null ? void 0 : e.action);
  return !t || typeof t.buildFormContent != "function" ? "" : t.buildFormContent({ trigger: e, escapeHtml: Ai, localize: f }) ?? "";
}
s(Pl, "buildActionFormSection");
function Bl(e, t) {
  const n = Kn(e == null ? void 0 : e.action);
  !n || typeof n.prepareFormData != "function" || n.prepareFormData({ trigger: e, formData: t });
}
s(Bl, "applyActionFormData");
function ql(e, t, n) {
  var o, a;
  const i = `${(e == null ? void 0 : e.id) ?? "unknown"}:${(t == null ? void 0 : t.id) ?? (t == null ? void 0 : t.action) ?? "unknown"}:${n}`;
  if (ba.has(i)) return;
  ba.add(i);
  const r = f(
    "EIDOLON.TimeTrigger.MissingDataWarning",
    "A scene time trigger is missing required data and was skipped."
  );
  (a = (o = ui.notifications) == null ? void 0 : o.warn) == null || a.call(o, r), console.warn(`${w} | Missing trigger data (${n})`, { scene: e == null ? void 0 : e.id, trigger: t });
}
s(ql, "warnMissingTriggerData");
async function Ul({ scene: e, trigger: t }) {
  var o, a, l, c, u;
  const n = (l = (a = (o = t == null ? void 0 : t.data) == null ? void 0 : o.path) == null ? void 0 : a.trim) == null ? void 0 : l.call(a);
  if (!n) {
    ql(e, t, "missing-audio-path");
    return;
  }
  const i = {
    src: n,
    autoplay: !0,
    loop: !1
  }, r = (() => {
    var d, g, h, y, b;
    return typeof ((g = (d = foundry == null ? void 0 : foundry.audio) == null ? void 0 : d.AudioHelper) == null ? void 0 : g.play) == "function" ? foundry.audio.AudioHelper.play(i, !0) : typeof ((y = (h = game == null ? void 0 : game.audio) == null ? void 0 : h.constructor) == null ? void 0 : y.play) == "function" ? game.audio.constructor.play(i, !0) : typeof ((b = game == null ? void 0 : game.audio) == null ? void 0 : b.play) == "function" ? game.audio.play(i, !0) : null;
  })();
  if (!r) {
    console.error(`${w} | Foundry audio helper is unavailable`), (u = (c = ui.notifications) == null ? void 0 : c.error) == null || u.call(
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
s(Ul, "executePlaySoundAction");
Rl({
  id: hi,
  label: /* @__PURE__ */ s(() => f("EIDOLON.TimeTrigger.ActionPlaySound", "Play Sound"), "label"),
  execute: Ul,
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
var ja;
const { ApplicationV2: Jn, HandlebarsApplicationMixin: Yn } = ((ja = foundry.applications) == null ? void 0 : ja.api) ?? {};
if (!Jn || !Yn)
  throw new Error(
    `${w} | ApplicationV2 API unavailable. Update Foundry VTT to v13 or newer.`
  );
const It = "AM", Wt = "PM";
function Lt() {
  return Qa();
}
s(Lt, "getConfiguredTimeFormat");
function Cr(e) {
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
s(Cr, "parseCanonicalTimeString");
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
function Vl(e, { format: t } = {}) {
  if (!e || typeof e != "object") return null;
  const n = Number(e.hour), i = Number(e.minute), r = e.second !== void 0 && e.second !== null, o = r ? Number(e.second) : null, a = r && Number.isFinite(o) ? Math.floor(Math.max(0, Math.min(59, o))) : null;
  if (!Number.isFinite(n) || !Number.isFinite(i)) return null;
  const l = t ?? Lt();
  return Fi(
    {
      hours: n,
      minutes: i,
      seconds: a
    },
    l
  );
}
s(Vl, "formatTimeComponentsForDisplay");
function jl(e, { format: t } = {}) {
  const n = Cr(e);
  if (!n) return "";
  const i = t ?? Lt();
  return Fi(n, i);
}
s(jl, "formatTriggerTimeForDisplay");
function Fi(e, t = "12h") {
  if (!e) return "";
  const { hours: n, minutes: i, seconds: r = null } = e;
  if (!Number.isInteger(n) || !Number.isInteger(i)) return "";
  const o = Number.isInteger(r);
  if (t === "24h") {
    const h = `${String(n).padStart(2, "0")}:${String(i).padStart(2, "0")}`;
    return o ? `${h}:${String(r).padStart(2, "0")}` : h;
  }
  const a = n >= 12 ? Wt : It, l = n % 12 === 0 ? 12 : n % 12, c = String(l), u = String(i).padStart(2, "0"), d = `${c}:${u}`, g = a === It ? f("EIDOLON.TimeTrigger.TimePeriodAM", It) : f("EIDOLON.TimeTrigger.TimePeriodPM", Wt);
  if (o) {
    const h = String(r).padStart(2, "0");
    return `${d}:${h} ${g}`;
  }
  return `${d} ${g}`;
}
s(Fi, "formatTimeParts");
function Ea(e, t = Lt()) {
  const n = Cr(e);
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
      period: It
    };
  const i = n.hours >= 12 ? Wt : It, r = n.hours % 12 === 0 ? 12 : n.hours % 12;
  return {
    format: t,
    canonical: Je(n) ?? "",
    hour: String(r),
    minute: String(n.minutes).padStart(2, "0"),
    period: i
  };
}
s(Ea, "getTimeFormValues");
function zl({ hour: e, minute: t, period: n, time: i }, r = Lt()) {
  if (r === "24h") {
    const y = typeof e == "string" ? e.trim() : "", b = typeof t == "string" ? t.trim() : "", p = typeof i == "string" ? i.trim() : "";
    if (!y && !b && p) {
      const O = Cr(p);
      return O ? { canonical: Je(O) ?? "", error: null } : {
        canonical: "",
        error: f(
          "EIDOLON.TimeTrigger.TimeFormatInvalid24",
          "Enter a valid time in HH:MM format."
        )
      };
    }
    if (!y || !b)
      return {
        canonical: "",
        error: f("EIDOLON.TimeTrigger.TimeFormatMissing", "Enter a complete time.")
      };
    const T = Number(y), E = Number(b);
    return !Number.isInteger(T) || T < 0 || T > 23 ? {
      canonical: "",
      error: f(
        "EIDOLON.TimeTrigger.TimeFormatInvalid24",
        "Enter a valid time in HH:MM format."
      )
    } : !Number.isInteger(E) || E < 0 || E > 59 ? {
      canonical: "",
      error: f(
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
    return { canonical: "", error: f("EIDOLON.TimeTrigger.TimeFormatMissing", "Enter a complete time.") };
  if (l !== It && l !== Wt)
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
    hours: l === Wt ? d + 12 : d,
    minutes: u
  };
  return {
    canonical: Je(h) ?? "",
    error: null
  };
}
s(zl, "normalizeFormTimeInput");
function Gl() {
  return [
    {
      value: It,
      label: f("EIDOLON.TimeTrigger.TimePeriodAM", It)
    },
    {
      value: Wt,
      label: f("EIDOLON.TimeTrigger.TimePeriodPM", Wt)
    }
  ];
}
s(Gl, "getPeriodOptions");
var xt, kt, Z, is, Wi, Ki, rs, ao, so, Ji, Yi, os, as, ss, lo, co, uo, Qi, Xi, fo, Zi, ls, cs;
const Ft = class Ft extends Yn(Jn) {
  constructor(n = {}) {
    var a;
    const { scene: i, showControls: r, ...o } = n ?? {};
    super(o);
    M(this, Z);
    M(this, xt, null);
    M(this, kt, null);
    M(this, Wi, /* @__PURE__ */ s((n) => {
      var r, o;
      n.preventDefault();
      const i = Number((o = (r = n.currentTarget) == null ? void 0 : r.dataset) == null ? void 0 : o.delta);
      Number.isFinite(i) && (I("Time delta button clicked", { delta: i }), this._advanceTime(i));
    }, "#onDeltaClick"));
    M(this, Ki, /* @__PURE__ */ s((n) => {
      var i, r;
      n.preventDefault(), !(!this.showControls || !((i = game.user) != null && i.isGM)) && (I("Time value double clicked", { sceneId: ((r = this.scene) == null ? void 0 : r.id) ?? null }), L(this, Z, rs).call(this));
    }, "#onTimeDoubleClick"));
    M(this, Ji, /* @__PURE__ */ s((n) => {
      if (this.isEditingTime && !this._commitTimeInProgress)
        if (n.key === "Enter") {
          n.preventDefault();
          const i = n.currentTarget, r = typeof (i == null ? void 0 : i.value) == "string" ? i.value : "";
          L(this, Z, so).call(this, r);
        } else n.key === "Escape" && (n.preventDefault(), L(this, Z, ao).call(this));
    }, "#onTimeInputKeydown"));
    M(this, Yi, /* @__PURE__ */ s((n) => {
      if (!this.isEditingTime || this._commitTimeInProgress || this._suppressBlurCommit) return;
      const i = n.currentTarget, r = typeof (i == null ? void 0 : i.value) == "string" ? i.value : "";
      L(this, Z, so).call(this, r);
    }, "#onTimeInputBlur"));
    M(this, Qi, /* @__PURE__ */ s((n) => {
      const i = !!n;
      if (this.manageTimeEnabled === i) return;
      this.manageTimeEnabled = i, (this.rendered ?? this.isRendered ?? !1) && this.render({ force: !0 });
    }, "#handleManageTimeChange"));
    M(this, Xi, /* @__PURE__ */ s(async (n) => {
      var o, a, l, c, u, d, g, h, y;
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
        await i.setFlag(w, Kr, r), this.sceneAllowsRealTime = r;
        const b = r ? f(
          "EIDOLON.TimeTrigger.SceneRealTimeEnabled",
          "Automatic real-time flow enabled for this scene."
        ) : f(
          "EIDOLON.TimeTrigger.SceneRealTimeDisabled",
          "Automatic real-time flow disabled for this scene."
        );
        (g = (d = ui.notifications) == null ? void 0 : d.info) == null || g.call(d, b);
      } catch (b) {
        console.error(`${w} | Failed to toggle scene real-time flow`, b), (y = (h = ui.notifications) == null ? void 0 : h.error) == null || y.call(
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
    M(this, Zi, /* @__PURE__ */ s(() => {
      (this.rendered ?? this.isRendered ?? !1) && (this.isEditingTime && (this.editValue = L(this, Z, lo).call(this)), this.render({ force: !0 }));
    }, "#handleTimeFormatChange"));
    this.scene = i ?? null, this.showControls = typeof r == "boolean" ? r : !!((a = game.user) != null && a.isGM), this.isEditingTime = !1, this.editValue = "", this._commitTimeInProgress = !1, this._suppressBlurCommit = !1, this.manageTimeEnabled = !1, this.sceneAllowsRealTime = L(this, Z, fo).call(this), v(this, xt, Go(m(this, Zi))), v(this, kt, Xa(m(this, Qi)));
  }
  async _prepareContext() {
    var E, C;
    const n = ((E = game.time) == null ? void 0 : E.components) ?? {}, r = ((n == null ? void 0 : n.second) !== void 0 && (n == null ? void 0 : n.second) !== null ? Vl(n) : null) ?? L(this, Z, is).call(this), o = Lt(), a = o === "24h", l = a ? f("EIDOLON.TimeTrigger.EditTimePlaceholder24", "HH:MM") : f("EIDOLON.TimeTrigger.EditTimePlaceholder12", "HH:MM AM/PM"), c = this.showControls ? f(
      "EIDOLON.TimeTrigger.EditTimeHint",
      "Double-click to set a specific time."
    ) : "", u = this.showControls ? f(
      "EIDOLON.TimeTrigger.EditTimeLabel",
      "New time (HH:MM or HH:MM AM/PM)"
    ) : "", d = wl.map((O) => ({
      minutes: O,
      label: O > 0 ? `+${O}` : `${O}`
    })), g = !!this.manageTimeEnabled, h = L(this, Z, fo).call(this);
    this.sceneAllowsRealTime = h;
    const y = f(
      "EIDOLON.TimeTrigger.SceneRealTimeEnable",
      "Enable automatic real-time flow for this scene."
    ), b = f(
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
      sceneAllowsRealTime: h,
      realTimeButtonLabel: g ? h ? b : y : p,
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
      return (this.rendered ?? this.isRendered ?? !1) || (I("TimeTriggerWindow close request rerendering", {
        sceneId: ((r = this.scene) == null ? void 0 : r.id) ?? null
      }), this.render({ force: !0 })), this;
    I("Closing time trigger window", { sceneId: ((o = this.scene) == null ? void 0 : o.id) ?? null, force: !0 });
    const i = await super.close(n);
    return L(this, Z, ls).call(this), L(this, Z, cs).call(this), i;
  }
  async _advanceTime(n) {
    var r, o, a, l, c, u, d;
    const i = n * 60;
    if (I("Advancing world time", { sceneId: ((r = this.scene) == null ? void 0 : r.id) ?? null, minutes: n, seconds: i }), !((o = game.user) != null && o.isGM)) {
      (l = (a = ui.notifications) == null ? void 0 : a.warn) == null || l.call(a, f("EIDOLON.TimeTrigger.GMOnly", "Only the GM can adjust time."));
      return;
    }
    try {
      await game.time.advance(i);
    } catch (g) {
      console.error(`${w} | Failed to advance time`, g), (u = (c = ui.notifications) == null ? void 0 : c.error) == null || u.call(
        c,
        f("EIDOLON.TimeTrigger.Error", "Failed to update the world time.")
      ), I("Failed to advance time from window", {
        sceneId: ((d = this.scene) == null ? void 0 : d.id) ?? null,
        minutes: n,
        message: (g == null ? void 0 : g.message) ?? String(g)
      });
    }
  }
  _onRender(n, i) {
    var o;
    super._onRender(n, i);
    const r = this.element;
    if (r) {
      if (this.showControls) {
        I("Binding time trigger interactions", {
          sceneId: ((o = this.scene) == null ? void 0 : o.id) ?? null,
          buttonCount: r.querySelectorAll("[data-delta]").length
        }), r.querySelectorAll("[data-delta]").forEach((u) => {
          u.addEventListener("click", m(this, Wi));
        });
        const a = r.querySelector('.time-trigger-window__time-value[data-editable="true"]');
        a && a.addEventListener("dblclick", m(this, Ki), { once: !1 });
        const l = r.querySelector(".time-trigger-window__time-input");
        l && (l.addEventListener("keydown", m(this, Ji)), l.addEventListener("blur", m(this, Yi)), typeof l.focus == "function" && (l.focus(), typeof l.select == "function" && l.select()));
        const c = r.querySelector('[data-action="toggle-real-time"]');
        c && c.addEventListener("click", m(this, Xi));
      }
      this._suppressBlurCommit = !1;
    }
  }
};
xt = new WeakMap(), kt = new WeakMap(), Z = new WeakSet(), is = /* @__PURE__ */ s(function() {
  var c;
  const n = (c = game.time) == null ? void 0 : c.worldTime;
  if (typeof n != "number" || !Number.isFinite(n)) return "";
  const i = 1440 * 60, r = (Math.floor(n) % i + i) % i, o = Math.floor(r / 3600), a = Math.floor(r % 3600 / 60), l = r % 60;
  return Fi({ hours: o, minutes: a, seconds: l }, Lt());
}, "#formatFallbackTime"), Wi = new WeakMap(), Ki = new WeakMap(), rs = /* @__PURE__ */ s(function() {
  var n;
  (n = game.user) != null && n.isGM && (this.isEditingTime = !0, this._suppressBlurCommit = !1, this.editValue = L(this, Z, lo).call(this), this.render({ force: !0 }));
}, "#enterTimeEditMode"), ao = /* @__PURE__ */ s(function() {
  this.isEditingTime = !1, this.editValue = "", this._suppressBlurCommit = !1, this.render({ force: !0 });
}, "#cancelTimeEdit"), so = /* @__PURE__ */ s(async function(n) {
  var o, a, l;
  if (!((o = game.user) != null && o.isGM) || !this.isEditingTime || this._commitTimeInProgress) return;
  this._commitTimeInProgress = !0;
  const i = typeof n == "string" ? n.trim() : "";
  if (!i) {
    L(this, Z, ao).call(this), this._commitTimeInProgress = !1;
    return;
  }
  const r = L(this, Z, ss).call(this, i);
  if (r.error) {
    (l = (a = ui.notifications) == null ? void 0 : a.error) == null || l.call(a, r.error), this._suppressBlurCommit = !0, this.editValue = i, this.render({ force: !0 }), this._commitTimeInProgress = !1;
    return;
  }
  try {
    await L(this, Z, as).call(this, r.seconds, r.includeSeconds) ? (this.isEditingTime = !1, this.editValue = "", this.render({ force: !0 })) : (this.editValue = i, this.render({ force: !0 }));
  } finally {
    this._commitTimeInProgress = !1;
  }
}, "#commitTimeInput"), Ji = new WeakMap(), Yi = new WeakMap(), os = /* @__PURE__ */ s(function() {
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
}, "#getCurrentCanonicalTime"), as = /* @__PURE__ */ s(async function(n, i) {
  var h, y, b, p, T, E, C, O, F, _;
  const r = (h = game.time) == null ? void 0 : h.worldTime;
  if (typeof r != "number" || !Number.isFinite(r))
    return (b = (y = ui.notifications) == null ? void 0 : y.error) == null || b.call(
      y,
      f(
        "EIDOLON.TimeTrigger.EditTimeUnavailable",
        "The world time is unavailable, so it can't be updated."
      )
    ), !1;
  if (!Number.isInteger(n) || n < 0 || n >= rn)
    return (T = (p = ui.notifications) == null ? void 0 : p.error) == null || T.call(
      p,
      f(
        "EIDOLON.TimeTrigger.EditTimeInvalidRange",
        "Enter a time within the current day."
      )
    ), !1;
  const l = Math.floor(r / rn) * rn + n - r;
  if (!Number.isFinite(l) || l === 0)
    return !0;
  const c = Math.floor(n / 3600), u = Math.floor(n % 3600 / 60), d = n % 60, g = Je({
    hours: c,
    minutes: u,
    seconds: i ? d : void 0
  });
  try {
    I("Updating world time directly", {
      sceneId: ((E = this.scene) == null ? void 0 : E.id) ?? null,
      targetCanonical: g ?? null,
      diff: l
    }), await game.time.advance(l);
    const D = Fi(
      {
        hours: c,
        minutes: u,
        seconds: i ? d : null
      },
      Lt()
    );
    (O = (C = ui.notifications) == null ? void 0 : C.info) == null || O.call(
      C,
      f(
        "EIDOLON.TimeTrigger.EditTimeSuccess",
        "World time updated."
      ) + (D ? ` ${D}` : "")
    );
  } catch (D) {
    return console.error(`${w} | Failed to set world time`, D), (_ = (F = ui.notifications) == null ? void 0 : F.error) == null || _.call(
      F,
      f(
        "EIDOLON.TimeTrigger.EditTimeError",
        "Failed to update the world time."
      )
    ), !1;
  }
  return !0;
}, "#applyTargetSeconds"), ss = /* @__PURE__ */ s(function(n) {
  var g;
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
    const h = Number(o[1]), y = Number(o[2]), b = o[3] !== void 0 ? Number(o[3]) : void 0;
    if (Number.isInteger(h) && h >= 0 && h <= 23 && Number.isInteger(y) && y >= 0 && y <= 59 && (b === void 0 || Number.isInteger(b) && b >= 0 && b <= 59)) {
      const p = h * 3600 + y * 60 + (b ?? 0);
      return {
        canonical: Je({ hours: h, minutes: y, seconds: b }),
        seconds: p,
        includeSeconds: b !== void 0,
        error: null
      };
    }
    return { error: i };
  }
  const { amLower: a, pmLower: l, periodPattern: c } = L(this, Z, co).call(this), u = r.match(
    new RegExp(
      `^([0-9]{1,2}):([0-9]{2})(?::([0-9]{2}))?\\s*(${c})$`,
      "i"
    )
  );
  if (u) {
    let h = Number(u[1]);
    const y = Number(u[2]), b = u[3] !== void 0 ? Number(u[3]) : void 0, p = u[4] ?? "", T = typeof p == "string" ? ((g = p.toLocaleLowerCase) == null ? void 0 : g.call(p)) ?? p.toLowerCase() : "";
    if (Number.isInteger(h) && h >= 1 && h <= 12 && Number.isInteger(y) && y >= 0 && y <= 59 && (b === void 0 || Number.isInteger(b) && b >= 0 && b <= 59) && (T === a || T === l || T === "am" || T === "pm")) {
      h = h % 12, (T === l || T === "pm") && (h += 12);
      const C = h * 3600 + y * 60 + (b ?? 0);
      return {
        canonical: Je({ hours: h, minutes: y, seconds: b }),
        seconds: C,
        includeSeconds: b !== void 0,
        error: null
      };
    }
    return { error: i };
  }
  const d = Ja(r);
  if (d !== null) {
    const h = Math.floor(d / 3600), y = Math.floor(d % 3600 / 60), b = d % 60, p = b !== 0;
    return {
      canonical: Je({
        hours: h,
        minutes: y,
        seconds: p ? b : void 0
      }),
      seconds: d,
      includeSeconds: p,
      error: null
    };
  }
  return { error: i };
}, "#parseInputTime"), lo = /* @__PURE__ */ s(function() {
  const n = L(this, Z, os).call(this);
  if (!n) return "";
  if (Lt() === "24h")
    return n;
  const r = Cr(n);
  if (!r) return n;
  const o = Number(r.hours), a = Number(r.minutes), l = r.seconds !== null && r.seconds !== void 0 ? Number(r.seconds) : void 0;
  if (!Number.isFinite(o) || !Number.isFinite(a)) return n;
  const c = Number.isFinite(l), u = o % 12 === 0 ? 12 : o % 12, d = String(a).padStart(2, "0"), g = c ? `:${String(l).padStart(2, "0")}` : "", { amLabel: h, pmLabel: y } = L(this, Z, co).call(this), b = o >= 12 ? y : h;
  return `${u}:${d}${g} ${b}`.trim();
}, "#getInitialEditValue"), co = /* @__PURE__ */ s(function() {
  var u, d;
  const n = f("EIDOLON.TimeTrigger.TimePeriodAM", "AM"), i = f("EIDOLON.TimeTrigger.TimePeriodPM", "PM"), r = ((u = n.toLocaleLowerCase) == null ? void 0 : u.call(n)) ?? n.toLowerCase(), o = ((d = i.toLocaleLowerCase) == null ? void 0 : d.call(i)) ?? i.toLowerCase(), a = L(this, Z, uo).call(this, n), l = L(this, Z, uo).call(this, i), c = `${a}|${l}|AM|PM`;
  return {
    amLabel: n,
    pmLabel: i,
    amLower: r,
    pmLower: o,
    periodPattern: c
  };
}, "#getPeriodMatchData"), uo = /* @__PURE__ */ s(function(n) {
  return typeof n != "string" ? "" : n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}, "#escapeForRegex"), Qi = new WeakMap(), Xi = new WeakMap(), fo = /* @__PURE__ */ s(function() {
  const n = this.scene;
  if (!n || typeof n.getFlag != "function") return !1;
  try {
    return !!n.getFlag(w, Kr);
  } catch (i) {
    I("TimeTriggerWindow | Failed to read scene real-time flag", {
      sceneId: (n == null ? void 0 : n.id) ?? null,
      message: (i == null ? void 0 : i.message) ?? String(i)
    });
  }
  return !1;
}, "#readSceneRealTimeFlag"), Zi = new WeakMap(), ls = /* @__PURE__ */ s(function() {
  if (typeof m(this, xt) == "function")
    try {
      m(this, xt).call(this);
    } catch (n) {
      console.error(`${w} | Failed to dispose time format subscription`, n);
    }
  v(this, xt, null);
}, "#disposeTimeFormatSubscription"), cs = /* @__PURE__ */ s(function() {
  if (typeof m(this, kt) == "function")
    try {
      m(this, kt).call(this);
    } catch (n) {
      console.error(`${w} | Failed to dispose manage time subscription`, n);
    }
  v(this, kt, null);
}, "#disposeManageTimeSubscription"), s(Ft, "TimeTriggerWindow"), je(Ft, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  ft(Ft, Ft, "DEFAULT_OPTIONS"),
  {
    id: `${w}-time-trigger`,
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
)), je(Ft, "PARTS", {
  content: {
    template: `modules/${w}/templates/time-trigger.html`
  }
});
let oo = Ft;
function Lr(e, t = {}) {
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
s(Lr, "createApplicationFactory");
const Ca = /* @__PURE__ */ new Set();
var ue, we, Rt, fn, us, ds;
const sa = class sa {
  constructor({ windowFactory: t } = {}) {
    M(this, fn);
    M(this, ue, null);
    M(this, we, null);
    M(this, Rt);
    const n = Lr(oo);
    typeof t == "function" ? t.__eidolonFactorySignature === "options" ? v(this, Rt, (r, o = {}) => t({ scene: r, ...o ?? {} })) : v(this, Rt, t) : v(this, Rt, /* @__PURE__ */ s((r, o = {}) => n({ scene: r, ...o ?? {} }), "fallbackFactory"));
  }
  onReady() {
    var n;
    const t = typeof ((n = game.time) == null ? void 0 : n.worldTime) == "number" && Number.isFinite(game.time.worldTime) ? game.time.worldTime : null;
    I("TimeTriggerManager#onReady", { worldTime: t }), t !== null && v(this, we, t);
  }
  onCanvasReady(t) {
    const n = (t == null ? void 0 : t.scene) ?? Cn();
    I("TimeTriggerManager#onCanvasReady", { sceneId: (n == null ? void 0 : n.id) ?? null }), this.refreshTimeTriggerWindow(n), this.handleTimeTriggerEvaluation(n);
  }
  onUpdateScene(t) {
    const n = Cn();
    I("TimeTriggerManager#onUpdateScene", {
      sceneId: (t == null ? void 0 : t.id) ?? null,
      activeSceneId: (n == null ? void 0 : n.id) ?? null
    }), !(!n || t.id !== n.id) && (this.refreshTimeTriggerWindow(t), this.handleTimeTriggerEvaluation(t));
  }
  onUpdateWorldTime(t, n) {
    I("TimeTriggerManager#onUpdateWorldTime", {
      worldTime: t,
      diff: n,
      hasWindow: !!m(this, ue)
    }), m(this, ue) && m(this, ue).render();
    const i = Cn(), r = L(this, fn, us).call(this, t, n);
    this.handleTimeTriggerEvaluation(i, t, r);
  }
  refreshTimeTriggerWindow(t) {
    var c, u, d;
    if (!t) return;
    const n = !!((c = game.user) != null && c.isGM), i = !!t.getFlag(w, Mi), r = !!t.getFlag(w, Gr), o = !!t.getFlag(w, Wr);
    if (I("TimeTriggerManager#refreshTimeTriggerWindow", {
      sceneId: t.id,
      isGM: n,
      isActive: i,
      hideWindow: r,
      showPlayerWindow: o
    }), !(i && !r && (n || o))) {
      m(this, ue) && (I("Closing time trigger window", { reason: "not-visible" }), m(this, ue).close({ force: !0 }), v(this, ue, null));
      return;
    }
    const l = !!n;
    if (m(this, ue) && ((u = m(this, ue).scene) == null ? void 0 : u.id) === t.id) {
      I("Refreshing existing time trigger window", { sceneId: t.id }), m(this, ue).showControls = l, m(this, ue).render();
      return;
    }
    m(this, ue) && (I("Closing existing window before creating new instance", {
      previousSceneId: ((d = m(this, ue).scene) == null ? void 0 : d.id) ?? null
    }), m(this, ue).close({ force: !0 })), v(this, ue, m(this, Rt).call(this, t, { showControls: l })), I("Rendering new time trigger window", { sceneId: t.id }), m(this, ue).render({ force: !0 });
  }
  async handleTimeTriggerEvaluation(t, n, i) {
    var c;
    const r = t ?? Cn();
    if (!r) {
      I("handleTimeTriggerEvaluation skipped", {
        reason: "no-active-scene",
        providedSceneId: (t == null ? void 0 : t.id) ?? null,
        currentWorldTime: n
      }), typeof n == "number" && Number.isFinite(n) && v(this, we, n);
      return;
    }
    const o = typeof n == "number" && Number.isFinite(n) ? n : typeof ((c = game.time) == null ? void 0 : c.worldTime) == "number" ? game.time.worldTime : null;
    if (o === null) return;
    const a = typeof i == "number" && Number.isFinite(i) ? i : null, l = a !== null ? a : typeof m(this, we) == "number" && Number.isFinite(m(this, we)) ? m(this, we) : o;
    dn("handleTimeTriggerEvaluation", {
      sceneId: r.id,
      previousWorldTime: l,
      currentWorldTime: o,
      overrideProvided: a !== null
    });
    try {
      await L(this, fn, ds).call(this, r, l, o);
    } catch (u) {
      console.error(`${w} | Unexpected error while evaluating time triggers`, u), I("handleTimeTriggerEvaluation error", { message: (u == null ? void 0 : u.message) ?? String(u) });
    } finally {
      v(this, we, o), Ct();
    }
  }
};
ue = new WeakMap(), we = new WeakMap(), Rt = new WeakMap(), fn = new WeakSet(), us = /* @__PURE__ */ s(function(t, n) {
  return typeof m(this, we) == "number" && Number.isFinite(m(this, we)) ? (I("Resolved previous world time from cache", {
    previousWorldTime: m(this, we)
  }), m(this, we)) : typeof t == "number" && Number.isFinite(t) && typeof n == "number" && Number.isFinite(n) ? (I("Resolved previous world time using diff", {
    worldTime: t,
    diff: n,
    resolved: t - n
  }), t - n) : typeof t == "number" && Number.isFinite(t) ? t : null;
}, "#resolvePreviousWorldTime"), ds = /* @__PURE__ */ s(async function(t, n, i) {
  var b, p, T;
  if (!((b = game.user) != null && b.isGM)) {
    I("Skipping trigger evaluation because user is not a GM");
    return;
  }
  if (!(t != null && t.id)) {
    I("Skipping trigger evaluation because the scene is missing an id");
    return;
  }
  if (!!!t.getFlag(w, Mi)) {
    I("Skipping trigger evaluation because scene is inactive", { sceneId: t.id });
    return;
  }
  if (typeof i != "number" || !Number.isFinite(i)) return;
  (typeof n != "number" || !Number.isFinite(n)) && (n = i);
  const o = on(t);
  if (!o.length) {
    I("No time triggers configured for scene", { sceneId: t.id });
    return;
  }
  const a = kl(t), l = /* @__PURE__ */ new Set();
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
    I("Detected world time rewind", {
      previousWorldTime: n,
      currentWorldTime: i
    });
    for (const E of o) {
      if (!(E != null && E.id) || !E.allowReplayOnRewind) continue;
      const C = a[E.id];
      typeof C == "number" ? i < C ? (I("Clearing trigger history due to rewind", {
        triggerId: E.id,
        lastFired: C,
        currentWorldTime: i
      }), delete a[E.id], c = !0) : I("Preserving trigger history after rewind", {
        triggerId: E.id,
        lastFired: C,
        currentWorldTime: i
      }) : I("No history stored for rewind-enabled trigger", {
        triggerId: E.id
      });
    }
    c && (I("Persisting history cleanup after rewind", {
      sceneId: t.id
    }), await Hr(t, a)), Ct();
    return;
  }
  const u = n, d = i, g = [], h = Math.floor(u / rn), y = Math.floor(d / rn);
  for (const E of o) {
    if (!(E != null && E.id)) continue;
    const C = Ja(E.time);
    if (C === null) {
      Wl(t, E), I("Skipping trigger with invalid time", {
        triggerId: E.id,
        time: E.time
      });
      continue;
    }
    for (let O = h; O <= y; O++) {
      const F = O * rn + C;
      if (F < u || F > d) continue;
      const D = a[E.id];
      if (typeof D == "number" && D >= F) {
        I("Skipping trigger because it already fired within window", {
          triggerId: E.id,
          lastFired: D,
          absoluteTime: F
        });
        continue;
      }
      g.push({ trigger: E, absoluteTime: F });
    }
  }
  if (!g.length) {
    c && await Hr(t, a), I("No triggers scheduled to fire within evaluation window", {
      sceneId: t.id
    }), Ct();
    return;
  }
  g.sort((E, C) => E.absoluteTime - C.absoluteTime), I("Queued triggers for execution", {
    entries: g.map((E) => ({
      triggerId: E.trigger.id,
      absoluteTime: E.absoluteTime
    }))
  });
  for (const E of g)
    try {
      I("Executing time trigger action", {
        triggerId: E.trigger.id,
        absoluteTime: E.absoluteTime
      }), await ns(t, E.trigger);
    } catch (C) {
      console.error(`${w} | Failed to execute time trigger action`, C), (T = (p = ui.notifications) == null ? void 0 : p.error) == null || T.call(
        p,
        f(
          "EIDOLON.TimeTrigger.TriggerActionError",
          "Failed to execute a scene time trigger action. Check the console for details."
        )
      ), I("Trigger execution failed", {
        triggerId: E.trigger.id,
        message: (C == null ? void 0 : C.message) ?? String(C)
      });
    } finally {
      a[E.trigger.id] = E.absoluteTime, c = !0, I("Recorded trigger execution", {
        triggerId: E.trigger.id,
        absoluteTime: E.absoluteTime
      });
    }
  c && (I("Persisting trigger history updates", { sceneId: t.id }), await Hr(t, a)), Ct();
}, "#evaluateSceneTimeTriggers"), s(sa, "TimeTriggerManager");
let go = sa;
function Wl(e, t) {
  var r, o;
  const n = `${(e == null ? void 0 : e.id) ?? "unknown"}:${(t == null ? void 0 : t.id) ?? (t == null ? void 0 : t.time) ?? "unknown"}`;
  if (Ca.has(n)) return;
  Ca.add(n);
  const i = f(
    "EIDOLON.TimeTrigger.InvalidTimeWarning",
    "A scene time trigger has an invalid time value and was skipped."
  );
  (o = (r = ui.notifications) == null ? void 0 : r.warn) == null || o.call(r, i), console.warn(`${w} | Invalid time for trigger`, { scene: e == null ? void 0 : e.id, trigger: t });
}
s(Wl, "warnInvalidTriggerTime");
var Pe, _n, Be, ht, Ht, Ge, cn, er, tr, Dn, Fn, $t, We, x, ho, Zt, pi, po, yi, yo, ze, fs, bo, gs, To, ms, nr, ir, rr, or, ar, sr, Eo, hs, bi, lr, cr;
const la = class la {
  constructor() {
    M(this, x);
    M(this, Pe, !1);
    M(this, _n, Wn);
    M(this, Be, /* @__PURE__ */ new Map());
    M(this, ht, null);
    M(this, Ht, null);
    M(this, Ge, 0);
    M(this, cn, null);
    M(this, er, null);
    M(this, tr, null);
    M(this, Dn, !1);
    M(this, Fn, !1);
    M(this, $t, !1);
    M(this, We, !1);
    M(this, nr, /* @__PURE__ */ s((t, n = {}) => {
      I("GameTimeAutomation | Pause state changed", {
        paused: t,
        userId: (n == null ? void 0 : n.userId) ?? null,
        broadcast: (n == null ? void 0 : n.broadcast) ?? null
      }), L(this, x, ze).call(this, { pausedOverride: t });
    }, "#handlePause"));
    M(this, ir, /* @__PURE__ */ s((t) => {
      t != null && t.id && (m(this, Be).set(t.id, Math.max(t.round ?? 0, 1)), I("GameTimeAutomation | Combat started", { combatId: t.id, round: t.round ?? 0 }), L(this, x, ze).call(this));
    }, "#handleCombatStart"));
    M(this, rr, /* @__PURE__ */ s((t, n) => {
      if (!(t != null && t.id)) return;
      const i = typeof n == "number" && Number.isFinite(n) ? n : typeof t.round == "number" && Number.isFinite(t.round) ? t.round : 0, r = i > 0 ? i : 1, o = m(this, Be).get(t.id), a = o ? Math.max(o, 1) : 1, l = r > 1 ? Math.max(r - a, 0) : 0;
      if (I("GameTimeAutomation | Combat round change detected", {
        combatId: t.id,
        effectiveRound: r,
        completedRounds: l,
        enabled: m(this, Pe),
        paused: (game == null ? void 0 : game.paused) ?? null
      }), l > 0 && m(this, Pe) && m(this, We) && !(game != null && game.paused) && L(this, x, Zt).call(this) && L(this, x, pi).call(this, t)) {
        const c = l * m(this, _n);
        c > 0 && (I("GameTimeAutomation | Advancing time for completed combat rounds", {
          combatId: t.id,
          completedRounds: l,
          delta: c
        }), L(this, x, To).call(this, c));
      }
      m(this, Be).set(t.id, Math.max(r, 1));
    }, "#handleCombatRound"));
    M(this, or, /* @__PURE__ */ s((t) => {
      t != null && t.id && (m(this, Be).delete(t.id), I("GameTimeAutomation | Combat ended", { combatId: t.id }), L(this, x, ze).call(this));
    }, "#handleCombatEnd"));
    M(this, ar, /* @__PURE__ */ s((t) => {
      t != null && t.id && (m(this, Be).delete(t.id), I("GameTimeAutomation | Combat deleted", { combatId: t.id }), L(this, x, ze).call(this));
    }, "#handleCombatDelete"));
    M(this, sr, /* @__PURE__ */ s((t, n) => {
      if (t != null && t.id) {
        if (typeof (n == null ? void 0 : n.round) == "number" && Number.isFinite(n.round)) {
          const i = Math.max(n.round, 1);
          m(this, Be).set(t.id, i), I("GameTimeAutomation | Combat round manually updated", {
            combatId: t.id,
            round: i
          });
        }
        (Object.prototype.hasOwnProperty.call(n ?? {}, "active") || (n == null ? void 0 : n.round) !== void 0) && L(this, x, ze).call(this);
      }
    }, "#handleCombatUpdate"));
    M(this, lr, /* @__PURE__ */ s((t) => {
      L(this, x, bi).call(this, t == null ? void 0 : t.scene), L(this, x, ze).call(this);
    }, "#handleCanvasReady"));
    M(this, cr, /* @__PURE__ */ s((t) => {
      if (!Le(t)) return;
      const n = L(this, x, Eo).call(this);
      if (!n || n.id !== t.id) return;
      L(this, x, bi).call(this, t) && L(this, x, ze).call(this);
    }, "#handleSceneUpdate"));
  }
  registerHooks() {
    m(this, Dn) || (v(this, Dn, !0), Hooks.on("pauseGame", m(this, nr)), Hooks.on("combatStart", m(this, ir)), Hooks.on("combatRound", m(this, rr)), Hooks.on("combatEnd", m(this, or)), Hooks.on("deleteCombat", m(this, ar)), Hooks.on("updateCombat", m(this, sr)), Hooks.on("canvasReady", m(this, lr)), Hooks.on("updateScene", m(this, cr)));
  }
  initialize() {
    m(this, Fn) || (v(this, Fn, !0), v(this, er, Xa((t) => {
      const n = !!t, i = n !== m(this, Pe);
      v(this, Pe, n), I("GameTimeAutomation | Manage time toggled", { enabled: n }), i && n && L(this, x, yo).call(this), L(this, x, ze).call(this);
    })), v(this, tr, Dl((t) => {
      v(this, _n, t), I("GameTimeAutomation | Seconds per round updated", { value: t });
    })), L(this, x, yo).call(this), L(this, x, bi).call(this), L(this, x, ze).call(this));
  }
};
Pe = new WeakMap(), _n = new WeakMap(), Be = new WeakMap(), ht = new WeakMap(), Ht = new WeakMap(), Ge = new WeakMap(), cn = new WeakMap(), er = new WeakMap(), tr = new WeakMap(), Dn = new WeakMap(), Fn = new WeakMap(), $t = new WeakMap(), We = new WeakMap(), x = new WeakSet(), ho = /* @__PURE__ */ s(function() {
  var t;
  try {
    if (typeof ((t = globalThis.performance) == null ? void 0 : t.now) == "function")
      return globalThis.performance.now();
  } catch (n) {
    I("GameTimeAutomation | Failed to read high-resolution timestamp", {
      message: (n == null ? void 0 : n.message) ?? String(n)
    });
  }
  return Date.now();
}, "#currentTimestamp"), Zt = /* @__PURE__ */ s(function() {
  var t;
  return !!((t = game == null ? void 0 : game.user) != null && t.isGM && game.user.active !== !1);
}, "#canControlTime"), pi = /* @__PURE__ */ s(function(t) {
  var i, r;
  if (!t) return !1;
  if (t.active === !0) return !0;
  if (t.active === !1) return !1;
  const n = (i = game == null ? void 0 : game.combats) == null ? void 0 : i.active;
  return (n == null ? void 0 : n.id) === t.id ? !0 : ((r = game == null ? void 0 : game.combat) == null ? void 0 : r.id) === t.id ? game.combat.active ?? !0 : !1;
}, "#isCombatDocumentActive"), po = /* @__PURE__ */ s(function(t) {
  return t ? typeof t.started == "boolean" ? t.started : (t.round ?? 0) > 0 : !1;
}, "#hasCombatStarted"), yi = /* @__PURE__ */ s(function() {
  var i;
  const t = Array.isArray((i = game == null ? void 0 : game.combats) == null ? void 0 : i.contents) ? game.combats.contents : [];
  for (const r of t)
    if (L(this, x, pi).call(this, r) && L(this, x, po).call(this, r))
      return !0;
  const n = game == null ? void 0 : game.combat;
  return !!(n && L(this, x, pi).call(this, n) && L(this, x, po).call(this, n));
}, "#isCombatRunning"), yo = /* @__PURE__ */ s(function() {
  var n;
  m(this, Be).clear();
  const t = Array.isArray((n = game == null ? void 0 : game.combats) == null ? void 0 : n.contents) ? game.combats.contents : [];
  for (const i of t)
    i != null && i.id && m(this, Be).set(i.id, Math.max(i.round ?? 0, 1));
}, "#hydrateRoundTracking"), ze = /* @__PURE__ */ s(function({ pausedOverride: t } = {}) {
  const n = typeof t == "boolean" ? t : !!(game != null && game.paused), i = m(this, Pe), r = m(this, We), o = i && r, a = {
    manageTimeEnabled: i,
    sceneAllowsRealTime: r,
    effectiveEnabled: o,
    paused: n,
    canControl: L(this, x, Zt).call(this),
    combatRunning: L(this, x, yi).call(this),
    overrideApplied: typeof t == "boolean"
  };
  if (I("GameTimeAutomation | Sync running state", a), !o || !L(this, x, Zt).call(this)) {
    L(this, x, bo).call(this);
    return;
  }
  L(this, x, fs).call(this);
}, "#syncRunningState"), fs = /* @__PURE__ */ s(function() {
  m(this, ht) === null && (v(this, Ht, L(this, x, ho).call(this)), v(this, ht, globalThis.setInterval(() => L(this, x, gs).call(this), 1e3)), I("GameTimeAutomation | Started real-time ticker"));
}, "#startRealTimeTicker"), bo = /* @__PURE__ */ s(function() {
  m(this, ht) !== null && (globalThis.clearInterval(m(this, ht)), v(this, ht, null), I("GameTimeAutomation | Stopped real-time ticker")), v(this, Ht, null), v(this, Ge, 0), v(this, $t, !1);
}, "#stopRealTimeTicker"), gs = /* @__PURE__ */ s(function() {
  if (!m(this, Pe) || !m(this, We) || !L(this, x, Zt).call(this)) {
    L(this, x, bo).call(this);
    return;
  }
  const t = L(this, x, ho).call(this);
  if (typeof t != "number" || !Number.isFinite(t)) return;
  const n = m(this, Ht) ?? t, i = (t - n) / 1e3;
  if (v(this, Ht, t), !Number.isFinite(i) || i <= 0) return;
  const r = !!(game != null && game.paused), o = L(this, x, yi).call(this);
  if (r || o) {
    m(this, $t) || I("GameTimeAutomation | Tick skipped", { paused: r, combatRunning: o }), v(this, $t, !0), v(this, Ge, 0);
    return;
  }
  v(this, $t, !1), I("GameTimeAutomation | Real-time tick", { deltaSeconds: i }), L(this, x, To).call(this, i);
}, "#tickRealTime"), To = /* @__PURE__ */ s(function(t) {
  if (!m(this, Pe) || !m(this, We)) return;
  const n = Number(t);
  !Number.isFinite(n) || n <= 0 || (v(this, Ge, m(this, Ge) + n), !m(this, cn) && v(this, cn, L(this, x, ms).call(this)));
}, "#queueAdvance"), ms = /* @__PURE__ */ s(async function() {
  var t, n;
  for (; m(this, Ge) > 0; ) {
    if (!m(this, Pe) || !m(this, We) || game != null && game.paused || !L(this, x, Zt).call(this) || L(this, x, yi).call(this)) {
      v(this, Ge, 0);
      break;
    }
    const i = m(this, Ge);
    v(this, Ge, 0);
    try {
      if (typeof ((t = game == null ? void 0 : game.time) == null ? void 0 : t.advance) == "function")
        I("GameTimeAutomation | Advancing world time", { delta: i }), await game.time.advance(i), I("GameTimeAutomation | World time advanced", {
          worldTime: ((n = game.time) == null ? void 0 : n.worldTime) ?? null
        });
      else {
        console.warn(`${w} | game.time.advance is unavailable; cannot manage world time.`);
        break;
      }
    } catch (r) {
      console.error(`${w} | Failed to advance world time`, r);
      break;
    }
  }
  v(this, cn, null);
}, "#flushAdvanceQueue"), nr = new WeakMap(), ir = new WeakMap(), rr = new WeakMap(), or = new WeakMap(), ar = new WeakMap(), sr = new WeakMap(), Eo = /* @__PURE__ */ s(function() {
  const t = Cn();
  return Le(t) ? t : null;
}, "#getActiveSceneDocument"), hs = /* @__PURE__ */ s(function(t) {
  if (!Le(t)) return !1;
  try {
    return !!t.getFlag(w, Kr);
  } catch (n) {
    return I("GameTimeAutomation | Failed to read scene real-time flag", {
      sceneId: (t == null ? void 0 : t.id) ?? null,
      message: (n == null ? void 0 : n.message) ?? String(n)
    }), !1;
  }
}, "#isSceneRealTimeAllowed"), bi = /* @__PURE__ */ s(function(t) {
  const n = Le(t) ? t : L(this, x, Eo).call(this), i = L(this, x, hs).call(this, n), r = m(this, We);
  return v(this, We, i), r !== i ? (I("GameTimeAutomation | Scene real-time allowance changed", {
    sceneId: (n == null ? void 0 : n.id) ?? null,
    allows: i
  }), !0) : !1;
}, "#refreshSceneAutomationState"), lr = new WeakMap(), cr = new WeakMap(), s(la, "GameTimeAutomation");
let mo = la;
var za, pt, be, Pt, rt, ur, ce, ps, ys, bs, Ts, dr, Lo, fr, Es, gr, Cs, Ls;
const nt = class nt extends Yn(Jn) {
  constructor(n = {}) {
    const { scene: i, trigger: r, triggerIndex: o, onSave: a, ...l } = n ?? {};
    super(l);
    M(this, ce);
    M(this, pt, null);
    M(this, be, null);
    M(this, Pt, null);
    M(this, rt, null);
    M(this, ur, /* @__PURE__ */ s(() => {
      (this.rendered ?? this.isRendered ?? !1) && (v(this, rt, L(this, ce, ps).call(this)), this.render({ force: !0 }));
    }, "#handleTimeFormatChange"));
    M(this, dr, /* @__PURE__ */ s((n) => {
      var o, a;
      const i = n.currentTarget, r = i == null ? void 0 : i.closest("form");
      r && (I("Trigger action selection changed", {
        sceneId: ((o = this.scene) == null ? void 0 : o.id) ?? null,
        triggerId: ((a = this.trigger) == null ? void 0 : a.id) ?? null,
        actionId: (i == null ? void 0 : i.value) ?? null
      }), L(this, ce, Lo).call(this, i.value, r));
    }, "#onActionSelectChange"));
    M(this, fr, /* @__PURE__ */ s((n) => {
      var u, d, g, h;
      n.preventDefault();
      const i = n.currentTarget, r = i == null ? void 0 : i.closest("form");
      if (!r) return;
      const o = (u = i.dataset) == null ? void 0 : u.target;
      if (!o) return;
      const a = typeof (CSS == null ? void 0 : CSS.escape) == "function" ? CSS.escape : (y) => y, l = r.querySelector(`[name="${a(o)}"]`);
      if (!l) return;
      I("Opening file picker for trigger", {
        sceneId: ((d = this.scene) == null ? void 0 : d.id) ?? null,
        triggerId: ((g = this.trigger) == null ? void 0 : g.id) ?? null,
        target: o
      }), new FilePicker({
        type: ((h = i.dataset) == null ? void 0 : h.type) || "audio",
        current: l.value,
        callback: /* @__PURE__ */ s((y) => {
          var b, p;
          l.value = y, l.dispatchEvent(new Event("change")), I("Trigger form file selected", {
            sceneId: ((b = this.scene) == null ? void 0 : b.id) ?? null,
            triggerId: ((p = this.trigger) == null ? void 0 : p.id) ?? null,
            target: o,
            path: y
          });
        }, "callback")
      }).render({ force: !0 });
    }, "#onFilePicker"));
    M(this, gr, /* @__PURE__ */ s(async (n) => {
      var r, o;
      n.preventDefault();
      const i = n.currentTarget;
      i instanceof HTMLFormElement && (I("Trigger form submitted", {
        sceneId: ((r = this.scene) == null ? void 0 : r.id) ?? null,
        triggerId: ((o = this.trigger) == null ? void 0 : o.id) ?? null
      }), await L(this, ce, Cs).call(this, i));
    }, "#onSubmit"));
    this.scene = i ?? null, this.trigger = r ?? null, this.triggerIndex = Number.isInteger(o) ? Number(o) : null, this.onSave = typeof a == "function" ? a : null, v(this, Pt, Go(m(this, ur)));
  }
  async _prepareContext() {
    var n, i;
    dn("TriggerFormApplication#_prepareContext", {
      sceneId: ((n = this.scene) == null ? void 0 : n.id) ?? null,
      triggerId: ((i = this.trigger) == null ? void 0 : i.id) ?? null,
      triggerIndex: this.triggerIndex
    });
    try {
      const r = this.trigger ?? { action: hi, data: {} }, o = r.action ?? hi, a = Ea(r.time), l = a.format ?? "12h", c = l === "12h" ? Gl() : [], u = a.period ?? (c.length > 0 ? c[0].value : null), d = l === "12h" ? c.map((y) => ({
        ...y,
        selected: y.value === u
      })) : [], g = Ta().map((y) => ({
        id: y.id,
        label: typeof y.label == "function" ? y.label() : y.label,
        selected: y.id === o
      })), h = Ta().map((y) => {
        const b = y.id === r.action ? r : { ...r, action: y.id }, p = Pl(b);
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
      Ct();
    }
  }
  _onRender(n, i) {
    var c, u, d;
    super._onRender(n, i);
    const r = this.element;
    if (!r) return;
    I("Trigger form rendered", {
      sceneId: ((c = this.scene) == null ? void 0 : c.id) ?? null,
      triggerId: ((u = this.trigger) == null ? void 0 : u.id) ?? null
    });
    const o = Array.from(((d = document == null ? void 0 : document.body) == null ? void 0 : d.classList) ?? []).find(
      (g) => g.startsWith("theme-")
    );
    o && r.classList.add(o);
    const a = r.querySelector("form");
    if (!a) return;
    L(this, ce, Es).call(this, a), L(this, ce, ys).call(this, a), a.addEventListener("submit", m(this, gr));
    const l = a.querySelector("[data-action-select]");
    l && (l.addEventListener("change", m(this, dr)), L(this, ce, Lo).call(this, l.value, a)), a.querySelectorAll("[data-action-file-picker]").forEach((g) => {
      g.addEventListener("click", m(this, fr));
    });
  }
  async close(n = {}) {
    var i;
    if ((i = m(this, pt)) == null || i.call(this), v(this, pt, null), v(this, be, null), v(this, rt, null), typeof m(this, Pt) == "function")
      try {
        m(this, Pt).call(this);
      } catch (r) {
        console.error(`${w} | Failed to dispose trigger form time format subscription`, r);
      }
    return v(this, Pt, null), super.close(n);
  }
};
pt = new WeakMap(), be = new WeakMap(), Pt = new WeakMap(), rt = new WeakMap(), ur = new WeakMap(), ce = new WeakSet(), ps = /* @__PURE__ */ s(function() {
  var l, c, u, d, g, h, y;
  const n = (c = (l = this.element) == null ? void 0 : l.querySelector) == null ? void 0 : c.call(l, "form");
  if (!(n instanceof HTMLFormElement)) return null;
  const i = Array.from(n.elements ?? []), r = [];
  for (const b of i)
    if ((b instanceof HTMLInputElement || b instanceof HTMLSelectElement || b instanceof HTMLTextAreaElement) && b.name && !(((u = b.dataset) == null ? void 0 : u.timeHidden) !== void 0 || ((d = b.dataset) == null ? void 0 : d.timeHour) !== void 0 || ((g = b.dataset) == null ? void 0 : g.timeMinute) !== void 0 || ((h = b.dataset) == null ? void 0 : h.timePeriod) !== void 0)) {
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
}, "#captureFormState"), ys = /* @__PURE__ */ s(function(n) {
  if (!m(this, rt)) return;
  if (!(n instanceof HTMLFormElement)) {
    v(this, rt, null);
    return;
  }
  const { fields: i = [], time: r = null } = m(this, rt) ?? {};
  v(this, rt, null), L(this, ce, bs).call(this, n, i), L(this, ce, Ts).call(this, n, r);
}, "#restorePendingFormState"), bs = /* @__PURE__ */ s(function(n, i) {
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
}, "#restoreFieldValues"), Ts = /* @__PURE__ */ s(function(n, i) {
  var C, O, F;
  const r = n.querySelector("[data-time-format]");
  if (!(r instanceof HTMLElement)) {
    typeof m(this, be) == "function" && m(this, be).call(this);
    return;
  }
  const o = ((C = r.dataset) == null ? void 0 : C.timeFormat) === "24h" ? "24h" : "12h", a = r.querySelector("[data-time-hour]"), l = r.querySelector("[data-time-minute]"), c = r.querySelector("[data-time-period]"), u = r.querySelector("[data-time-hidden]");
  if (!i) {
    if (a instanceof HTMLInputElement && (a.value = ""), l instanceof HTMLInputElement && (l.value = ""), c instanceof HTMLSelectElement) {
      const _ = ((F = (O = c.options) == null ? void 0 : O[0]) == null ? void 0 : F.value) ?? "";
      c.value = _;
    }
    u instanceof HTMLInputElement && (u.value = ""), typeof m(this, be) == "function" && m(this, be).call(this);
    return;
  }
  const d = typeof i.canonical == "string" ? i.canonical : "", g = typeof i.period == "string" ? i.period : "", h = typeof i.hour == "string" ? i.hour : "", y = typeof i.minute == "string" ? i.minute : "";
  let b = "", p = "", T = g, E = d;
  if (d) {
    const _ = Ea(d, o);
    b = _.hour ?? "", p = _.minute ?? "", E = _.canonical ?? d, o === "12h" ? T = _.period ?? g : T = "";
  } else
    b = h, p = y, o !== "12h" && (T = "");
  if (a instanceof HTMLInputElement && (a.value = b ?? ""), l instanceof HTMLInputElement && (l.value = p ?? ""), c instanceof HTMLSelectElement)
    if (o === "12h") {
      const _ = Array.from(c.options ?? []);
      _.find((R) => R.value === T) ? c.value = T : _.length > 0 ? c.value = _[0].value : c.value = "";
    } else
      c.value = "";
  u instanceof HTMLInputElement && (u.value = E ?? ""), typeof m(this, be) == "function" && m(this, be).call(this);
}, "#restoreTimeInputs"), dr = new WeakMap(), Lo = /* @__PURE__ */ s(function(n, i) {
  i && i.querySelectorAll("[data-action-config]").forEach((r) => {
    const o = r.dataset.actionConfig === n;
    r.style.display = o ? "" : "none";
  });
}, "#updateActionSections"), fr = new WeakMap(), Es = /* @__PURE__ */ s(function(n) {
  var g, h, y, b;
  if ((g = m(this, pt)) == null || g.call(this), v(this, pt, null), v(this, be, null), !(n instanceof HTMLFormElement)) return;
  const i = n.querySelector("[data-time-format]"), r = ((h = i == null ? void 0 : i.dataset) == null ? void 0 : h.timeFormat) ?? null;
  if (r !== "12h" && r !== "24h")
    return;
  const o = i.querySelector("[data-time-hidden]"), a = i.querySelector("[data-time-hour]"), l = i.querySelector("[data-time-minute]"), c = r === "12h" ? i.querySelector("[data-time-period]") : null;
  if (!o || !a || !l || r === "12h" && !c) {
    I("Trigger form time inputs missing elements", {
      format: r,
      hasHidden: !!o,
      hasHour: !!a,
      hasMinute: !!l,
      hasPeriod: !!c
    });
    return;
  }
  const u = [a, l, ...c ? [c] : []], d = /* @__PURE__ */ s(() => {
    const { canonical: p, error: T } = zl(
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
  }), d(), v(this, pt, () => {
    u.forEach((p) => {
      p.removeEventListener("input", d), p.removeEventListener("change", d);
    });
  }), v(this, be, d), I("Trigger form configured for time input", {
    format: r,
    sceneId: ((y = this.scene) == null ? void 0 : y.id) ?? null,
    triggerId: ((b = this.trigger) == null ? void 0 : b.id) ?? null
  });
}, "#setupTimeInput"), gr = new WeakMap(), Cs = /* @__PURE__ */ s(async function(n) {
  var o, a, l, c, u;
  if (typeof m(this, be) == "function" && m(this, be).call(this), typeof n.checkValidity == "function" && !n.checkValidity()) {
    typeof n.reportValidity == "function" && n.reportValidity(), I("Trigger form submission blocked by validity check", {
      sceneId: ((o = this.scene) == null ? void 0 : o.id) ?? null,
      triggerId: ((a = this.trigger) == null ? void 0 : a.id) ?? null
    });
    return;
  }
  const i = new FormData(n), r = Object.fromEntries(i.entries());
  delete r.timeHour, delete r.timeMinute, delete r.timePeriod, r.allowReplayOnRewind = ((l = n.querySelector('input[name="allowReplayOnRewind"]')) == null ? void 0 : l.checked) ?? !1, I("Processing trigger form submission", {
    sceneId: ((c = this.scene) == null ? void 0 : c.id) ?? null,
    triggerId: ((u = this.trigger) == null ? void 0 : u.id) ?? null,
    allowReplayOnRewind: r.allowReplayOnRewind
  }), await L(this, ce, Ls).call(this, r), await this.close();
}, "#handleSubmit"), Ls = /* @__PURE__ */ s(async function(n) {
  var o, a, l, c, u, d;
  const i = {
    id: ((o = this.trigger) == null ? void 0 : o.id) ?? Ol(),
    time: n.time ?? "",
    action: n.action ?? hi,
    allowReplayOnRewind: !!n.allowReplayOnRewind,
    data: {}
  };
  I("Persisting trigger from form", {
    sceneId: ((a = this.scene) == null ? void 0 : a.id) ?? null,
    triggerId: i.id,
    existingIndex: this.triggerIndex
  }), Bl(i, n);
  const r = on(this.scene);
  this.triggerIndex !== null && r[this.triggerIndex] ? r[this.triggerIndex] = i : r.push(i);
  try {
    await ts(this.scene, r), I("Trigger list saved", {
      sceneId: ((l = this.scene) == null ? void 0 : l.id) ?? null,
      triggerCount: r.length
    });
  } catch (g) {
    throw console.error(`${w} | Failed to save time trigger`, g), (u = (c = ui.notifications) == null ? void 0 : c.error) == null || u.call(
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
      console.error(`${w} | Trigger onSave callback failed`, g), I("Trigger onSave callback failed", {
        sceneId: ((d = this.scene) == null ? void 0 : d.id) ?? null,
        message: (g == null ? void 0 : g.message) ?? String(g)
      });
    }
}, "#persistTrigger"), s(nt, "TriggerFormApplication"), je(nt, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  ft(nt, nt, "DEFAULT_OPTIONS"),
  {
    id: `${w}-trigger-form`,
    classes: Array.from(
      /* @__PURE__ */ new Set([...((za = ft(nt, nt, "DEFAULT_OPTIONS")) == null ? void 0 : za.classes) ?? [], "standard-form", "themed"])
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
)), je(nt, "PARTS", {
  content: {
    template: `modules/${w}/templates/time-trigger-form.html`
  }
});
let Co = nt;
function st(e) {
  return e instanceof HTMLElement ? e : (e == null ? void 0 : e[0]) instanceof HTMLElement ? e[0] : null;
}
s(st, "asHTMLElement");
function Ti(e) {
  return typeof (e == null ? void 0 : e.changeTab) == "function";
}
s(Ti, "isAppV2");
function Is(e, t, n, i = {}) {
  if (Ti(e)) {
    e.changeTab(t, n, i);
    return;
  }
  if (typeof (e == null ? void 0 : e.activateTab) == "function") {
    const r = { ...i };
    n != null && (r.group = n), r.triggerCallback == null && (r.triggerCallback = !0), e.activateTab(t, r);
  }
}
s(Is, "setActiveTab");
function Kl(e) {
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
s(Kl, "readFormData");
const La = Symbol.for("eidolon.sceneConfig.v13PatchedTabs");
function Ss(e = {}) {
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
    moduleId: g = "eidolon-utilities",
    tabIcon: h = "fa-solid fa-puzzle-piece"
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
  }, T = Symbol(`EIDOLON_SCENE_CONFIG_TAB_CLEANUP_${t}`), E = typeof i == "function" ? i : () => null, C = typeof r == "function" ? r : () => !0, O = typeof n == "function" ? n : () => typeof n == "string" ? n : t;
  function F() {
    var V, H, P, J, te;
    const A = ((H = (V = foundry == null ? void 0 : foundry.applications) == null ? void 0 : V.sheets) == null ? void 0 : H.SceneConfig) ?? ((P = CONFIG == null ? void 0 : CONFIG.Scene) == null ? void 0 : P.sheetClass);
    if (!A || !Ti({ changeTab: (J = A.prototype) == null ? void 0 : J.changeTab })) return;
    const U = A[La] ?? /* @__PURE__ */ new Set();
    if (U.has(t)) return;
    U.add(t), A[La] = U;
    const G = (te = A.TABS) == null ? void 0 : te.sheet;
    if (G && Array.isArray(G.tabs) && !G.tabs.some((z) => z.id === t)) {
      const z = O({ app: null, scene: null }) ?? t;
      G.tabs.push({
        id: t,
        icon: h,
        label: z
      });
    }
    A.PARTS && !A.PARTS[t] && (A.PARTS[t] = {
      template: `modules/${g}/templates/scene-config-tab-mount.hbs`,
      scrollable: [`.tab[data-tab="${t}"]`]
    }), y("Patched v13 SceneConfig TABS/PARTS", { tabId: t });
  }
  s(F, "patchV13SceneConfig");
  function _(A, U) {
    var V, H;
    const G = E(A);
    if (!C(A, G)) {
      y("Skipped render", {
        tabId: t,
        reason: "inapplicable",
        constructor: ((V = A == null ? void 0 : A.constructor) == null ? void 0 : V.name) ?? null
      });
      return;
    }
    b("render", {
      tabId: t,
      sceneId: (G == null ? void 0 : G.id) ?? null,
      constructor: ((H = A == null ? void 0 : A.constructor) == null ? void 0 : H.name) ?? null
    });
    try {
      const P = st(U) ?? st(A.element);
      if (!P) {
        y("Missing root element", { tabId: t });
        return;
      }
      Ti(A) ? Y(A, P, G) : R(A, P, G);
    } finally {
      p();
    }
  }
  s(_, "handleRender");
  function D(A, U, G) {
    var P;
    if (!h) {
      A.textContent = U;
      return;
    }
    const V = (P = A.querySelector("i")) == null ? void 0 : P.cloneNode(!0);
    A.textContent = "";
    const H = V ?? document.createElement("i");
    if (V || (H.className = h, G && (H.inert = !0)), A.append(H, " "), G) {
      const J = document.createElement("span");
      J.textContent = U, A.append(J);
    } else
      A.append(document.createTextNode(U));
  }
  s(D, "setButtonContent");
  function R(A, U, G) {
    var Ae, Xe, Ie, fe, Yt, Ze, vt, Ne, et, N, ei, B, He, ge, mn, ti;
    const H = [
      "nav.sheet-tabs[data-group]",
      "nav.tabs[data-group]",
      "nav.sheet-tabs",
      "nav.tabs"
    ].map((me) => U.querySelector(me)).find((me) => me instanceof HTMLElement), J = [
      (Ae = U.querySelector(".tab[data-tab]")) == null ? void 0 : Ae.parentElement,
      U.querySelector(".sheet-body"),
      (Ie = (Xe = H == null ? void 0 : H.parentElement) == null ? void 0 : Xe.querySelector) == null ? void 0 : Ie.call(Xe, ":scope > .sheet-body"),
      H == null ? void 0 : H.parentElement
    ].find((me) => me instanceof HTMLElement), te = ((fe = H == null ? void 0 : H.dataset) == null ? void 0 : fe.group) ?? ((vt = (Ze = (Yt = H == null ? void 0 : H.querySelector) == null ? void 0 : Yt.call(H, "a[data-group]")) == null ? void 0 : Ze.dataset) == null ? void 0 : vt.group) ?? ((N = (et = (Ne = H == null ? void 0 : H.querySelector) == null ? void 0 : Ne.call(H, "[data-group]")) == null ? void 0 : et.dataset) == null ? void 0 : N.group) ?? ((He = (B = (ei = J == null ? void 0 : J.querySelector) == null ? void 0 : ei.call(J, ".tab[data-group]")) == null ? void 0 : B.dataset) == null ? void 0 : He.group) ?? "main";
    if (!H || !J) {
      y("Missing navigation elements", {
        tabId: t,
        hasNav: !!H,
        hasBody: !!J
      });
      return;
    }
    let z = H.querySelector(`[data-tab="${t}"]`);
    if (!z) {
      z = document.createElement("a"), z.dataset.action = "tab", z.dataset.group = te, z.dataset.tab = t;
      const me = H.querySelector("a[data-tab]");
      (ge = me == null ? void 0 : me.classList) != null && ge.contains("item") && z.classList.add("item"), H.appendChild(z), typeof l == "function" && l({ app: A, button: z, nav: H, scene: G }), y("Created tab button", { tabId: t, group: te });
    }
    D(z, O({ app: A, scene: G }) ?? t, Ti(A));
    let X = J.querySelector(`.tab[data-tab="${t}"]`);
    if (!X) {
      X = document.createElement("div"), X.classList.add("tab"), X.dataset.tab = t, X.dataset.group = te;
      const me = Jl(J);
      J.insertBefore(X, me ?? null), typeof c == "function" && c({ app: A, tab: X, body: J, scene: G }), y("Created tab container", { tabId: t, group: te });
    }
    ((mn = z.classList) == null ? void 0 : mn.contains("active")) || X.classList.contains("active") ? (z.classList.add("active"), X.classList.add("active"), X.removeAttribute("hidden")) : (z.classList.remove("active"), X.classList.remove("active"), X.setAttribute("hidden", "true"));
    const Re = /* @__PURE__ */ s(() => {
      var Mt, hn;
      ((Mt = z.classList) != null && Mt.contains("active") || X.classList.contains("active")) && ((hn = z.classList) == null || hn.add("active"), X.classList.add("active"), X.removeAttribute("hidden"), X.removeAttribute("aria-hidden"), X.style.display === "none" && (X.style.display = ""));
    }, "ensureTabVisible"), pe = /* @__PURE__ */ s(() => {
      Re(), requestAnimationFrame(Re);
    }, "scheduleEnsureTabVisible");
    z.dataset.eidolonEnsureSceneTabVisibility || (z.addEventListener("click", () => {
      Is(A, t, te), requestAnimationFrame(Re);
    }), z.dataset.eidolonEnsureSceneTabVisibility = "true"), $r(A, T, y);
    const Me = o({
      app: A,
      scene: G,
      tab: X,
      tabButton: z,
      ensureTabVisible: Re,
      scheduleEnsureTabVisible: pe
    });
    typeof Me == "function" && Ia(A, T, Me), typeof u == "function" && u({
      app: A,
      scene: G,
      tab: X,
      tabButton: z,
      ensureTabVisible: Re,
      scheduleEnsureTabVisible: pe
    }), (ti = A.setPosition) == null || ti.call(A, { height: "auto" });
  }
  s(R, "handleRenderV1");
  function Y(A, U, G) {
    const V = U.querySelector(`.tab[data-tab="${t}"]`), H = U.querySelector(`nav [data-tab="${t}"]`);
    if (!V || !H) {
      y("v2 mount not found, falling back to v1 injection", { tabId: t }), R(A, U, G);
      return;
    }
    D(H, O({ app: A, scene: G }) ?? t, !0);
    const P = /* @__PURE__ */ s(() => {
      var z;
      !((z = H.classList) != null && z.contains("active")) && !V.classList.contains("active") || (V.classList.add("active"), V.removeAttribute("hidden"), V.removeAttribute("aria-hidden"), V.style.display === "none" && (V.style.display = ""));
    }, "ensureTabVisible"), J = /* @__PURE__ */ s(() => {
      P(), requestAnimationFrame(P);
    }, "scheduleEnsureTabVisible");
    $r(A, T, y);
    const te = o({
      app: A,
      scene: G,
      tab: V,
      tabButton: H,
      ensureTabVisible: P,
      scheduleEnsureTabVisible: J
    });
    typeof te == "function" && Ia(A, T, te), typeof u == "function" && u({
      app: A,
      scene: G,
      tab: V,
      tabButton: H,
      ensureTabVisible: P,
      scheduleEnsureTabVisible: J
    });
  }
  s(Y, "handleRenderV2");
  function ie(A) {
    $r(A, T, y);
  }
  s(ie, "handleClose");
  function $() {
    return Hooks.once("init", () => {
      F();
    }), Hooks.on("renderSceneConfig", _), Hooks.on("closeSceneConfig", ie), () => Q();
  }
  s($, "register");
  function Q() {
    Hooks.off("renderSceneConfig", _), Hooks.off("closeSceneConfig", ie);
  }
  return s(Q, "unregister"), { register: $, unregister: Q };
}
s(Ss, "createSceneConfigTabFactory");
function Ia(e, t, n) {
  if (!e || typeof n != "function") return;
  const i = e == null ? void 0 : e[t];
  Array.isArray(i) || (e[t] = []), e[t].push(n);
}
s(Ia, "registerCleanup");
function $r(e, t, n) {
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
s($r, "invokeCleanup");
function Jl(e) {
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
s(Jl, "findFooterElement$1");
const Yl = Lr(Co), Ql = `modules/${w}/templates/time-trigger-scene-tab.html`, Xl = Ss({
  tabId: "time-triggers",
  tabLabel: /* @__PURE__ */ s(() => f("EIDOLON.TimeTrigger.Tab", "Time Triggers"), "tabLabel"),
  getScene: Qe,
  isApplicable: nc,
  renderContent: /* @__PURE__ */ s(({ app: e, scene: t, tab: n }) => ec(e, n, t), "renderContent"),
  logger: {
    log: I,
    group: dn,
    groupEnd: Ct
  }
});
function Zl() {
  return I("Registering SceneConfig render hook"), Xl.register();
}
s(Zl, "registerSceneConfigHook");
function ec(e, t, n) {
  if (!(t instanceof HTMLElement)) return;
  const i = Le(n) ? n : Qe(e);
  xi(e, t, i);
  const r = Go(() => {
    xi(e, t, i);
  });
  return () => {
    if (typeof r == "function")
      try {
        r();
      } catch (o) {
        console.error(
          `${w} | Failed to dispose scene config time format subscription`,
          o
        );
      }
  };
}
s(ec, "renderTimeTriggerTab");
async function xi(e, t, n) {
  var r, o;
  const i = n ?? Qe(e);
  dn("renderTimeTriggersTabContent", { sceneId: (i == null ? void 0 : i.id) ?? null });
  try {
    if (!Le(i)) {
      const V = f(
        "EIDOLON.TimeTrigger.Unavailable",
        "Time triggers are unavailable for this configuration sheet."
      );
      t.innerHTML = `<p class="notes">${V}</p>`, I("Scene lacks document for time triggers", { sceneId: (i == null ? void 0 : i.id) ?? null });
      return;
    }
    const a = `flags.${w}.${Mi}`, l = `flags.${w}.${Gr}`, c = `flags.${w}.${Wr}`, u = !!i.getFlag(w, Mi), d = !!i.getFlag(w, Gr), g = !!i.getFlag(w, Wr), h = on(i);
    I("Rendering time trigger list", {
      sceneId: i.id,
      isActive: u,
      shouldHideWindow: d,
      shouldShowPlayerWindow: g,
      triggerCount: h.length
    });
    const y = f("EIDOLON.TimeTrigger.Activate", "Activate Time Trigger"), b = f(
      "EIDOLON.TimeTrigger.Description",
      "Enable scene time triggers so scheduled actions can run automatically."
    ), p = f(
      "EIDOLON.TimeTrigger.HideWindowLabel",
      "Hide Floating Time Window"
    ), T = f(
      "EIDOLON.TimeTrigger.HideWindowDescription",
      "Keep the floating time control window hidden while leaving time triggers active."
    ), E = f(
      "EIDOLON.TimeTrigger.ShowPlayerWindowLabel",
      "Share Floating Time Window with Players"
    ), C = f(
      "EIDOLON.TimeTrigger.ShowPlayerWindowDescription",
      "Let non-GM players see the floating time window (without time controls)."
    ), O = f(
      "EIDOLON.TimeTrigger.TriggerListLabel",
      "Scene Time Triggers"
    ), F = f(
      "EIDOLON.TimeTrigger.TriggerListEmpty",
      "No time triggers configured for this scene."
    ), _ = f("EIDOLON.TimeTrigger.AddTrigger", "Add Trigger"), D = f("EIDOLON.TimeTrigger.EditTrigger", "Edit"), R = f("EIDOLON.TimeTrigger.DeleteTrigger", "Remove"), Y = f("EIDOLON.TimeTrigger.TriggerNow", "Trigger Now"), ie = f("EIDOLON.TimeTrigger.AtLabel", "At"), $ = f("EIDOLON.TimeTrigger.DoLabel", "Do"), Q = f("EIDOLON.TimeTrigger.MissingTime", "(No time set)"), A = h.map((V, H) => {
      const te = (V.time ? jl(V.time) : "") || V.time || "" || Q, z = Hl(V.action), X = [
        `${ie} ${te}`,
        `${$} ${z}`,
        ...$l(V)
      ];
      return {
        index: H,
        summaryParts: X,
        tooltips: {
          triggerNow: Y,
          edit: D,
          delete: R
        }
      };
    }), U = ((o = (r = foundry == null ? void 0 : foundry.applications) == null ? void 0 : r.handlebars) == null ? void 0 : o.renderTemplate) ?? (typeof renderTemplate == "function" ? renderTemplate : globalThis == null ? void 0 : globalThis.renderTemplate);
    if (typeof U != "function") {
      console.error(`${w} | renderTemplate is unavailable; cannot render scene tab.`), t.innerHTML = `<p class="notes">${F}</p>`;
      return;
    }
    let G = "";
    try {
      G = await U(Ql, {
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
          showPlayerWindow: E,
          triggerList: O,
          empty: F,
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
    } catch (V) {
      console.error(`${w} | Failed to render time trigger scene tab template`, V), t.innerHTML = `<p class="notes">${F}</p>`;
      return;
    }
    t.innerHTML = G, tc(e, t, i);
  } finally {
    Ct();
  }
}
s(xi, "renderTimeTriggersTabContent");
function tc(e, t, n) {
  const i = n ?? Qe(e);
  if (!Le(i)) return;
  const r = t.querySelector('[data-action="add-trigger"]');
  r && r.addEventListener("click", () => {
    I("Add trigger button clicked", { sceneId: i.id }), Sa(e, { scene: i });
  }), t.querySelectorAll('[data-action="edit-trigger"]').forEach((o) => {
    o.addEventListener("click", () => {
      const a = Number(o.dataset.index);
      if (!Number.isInteger(a)) return;
      const c = on(i)[a];
      c && (I("Edit trigger button clicked", { sceneId: i.id, triggerId: c.id, index: a }), Sa(e, { trigger: c, triggerIndex: a, scene: i }));
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
          I("Deleting trigger", {
            sceneId: i.id,
            index: a,
            triggerId: (c == null ? void 0 : c.id) ?? null
          }), await ts(i, l), await xi(e, t, i);
        } catch (g) {
          console.error(`${w} | Failed to delete time trigger`, g), (d = (u = ui.notifications) == null ? void 0 : u.error) == null || d.call(
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
      var u, d, g, h, y, b, p;
      const a = Number(o.dataset.index);
      if (!Number.isInteger(a)) return;
      const c = on(i)[a];
      if (c) {
        if (!((u = game.user) != null && u.isGM)) {
          (g = (d = ui.notifications) == null ? void 0 : d.warn) == null || g.call(
            d,
            f("EIDOLON.TimeTrigger.GMOnly", "Only the GM can adjust time.")
          );
          return;
        }
        try {
          I("Manually firing trigger", { sceneId: i.id, triggerId: c.id, index: a }), await ns(i, c), (y = (h = ui.notifications) == null ? void 0 : h.info) == null || y.call(
            h,
            f(
              "EIDOLON.TimeTrigger.TriggerNowSuccess",
              "Triggered the selected time trigger."
            )
          );
        } catch (T) {
          console.error(`${w} | Failed to execute time trigger manually`, T), (p = (b = ui.notifications) == null ? void 0 : b.error) == null || p.call(
            b,
            f(
              "EIDOLON.TimeTrigger.TriggerNowError",
              "Failed to execute the selected time trigger."
            )
          ), I("Manual trigger execution failed", {
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
s(tc, "bindTimeTriggerTabEvents");
function Sa(e, t = {}) {
  var a;
  const n = t.scene ?? null, i = n && Le(n) ? n : Qe(e);
  if (!Le(i)) {
    console.warn(`${w} | Unable to open trigger form because no scene document is available.`);
    return;
  }
  I("Opening trigger form", {
    sceneId: i.id,
    triggerId: ((a = t.trigger) == null ? void 0 : a.id) ?? null,
    index: Number.isInteger(t.triggerIndex) ? Number(t.triggerIndex) : null
  }), Yl({
    scene: i,
    trigger: t.trigger ?? null,
    triggerIndex: t.triggerIndex ?? null,
    onSave: /* @__PURE__ */ s(() => {
      var c, u;
      const l = (u = (c = e.element) == null ? void 0 : c[0]) == null ? void 0 : u.querySelector('.tab[data-tab="time-triggers"]');
      l && xi(e, l, i);
    }, "onSave")
  }).render({ force: !0 });
}
s(Sa, "openTriggerForm");
function nc(e, t) {
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
s(nc, "isRecognizedSceneConfig");
const oi = new go(), wa = new mo();
function ic() {
  I("Registering time trigger hooks"), Hooks.once("init", () => {
    vl(), Fl(), I("Time trigger settings registered during init");
  }), Zl(), I("Scene config hook registered"), wa.registerHooks(), I("Time automation hooks registered"), Hooks.once("ready", () => {
    xl(), I("Ready hook fired"), oi.onReady(), wa.initialize();
  }), Hooks.on("canvasReady", (e) => {
    var t;
    I("canvasReady hook received", { scene: ((t = e == null ? void 0 : e.scene) == null ? void 0 : t.id) ?? null }), oi.onCanvasReady(e);
  }), Hooks.on("updateScene", (e) => {
    I("updateScene hook received", { scene: (e == null ? void 0 : e.id) ?? null }), oi.onUpdateScene(e);
  }), Hooks.on("updateWorldTime", (e, t) => {
    I("updateWorldTime hook received", { worldTime: e, diff: t }), oi.onUpdateWorldTime(e, t);
  });
}
s(ic, "registerTimeTriggerHooks");
ic();
const de = w, ws = "criteria", Ko = "state", rc = "criteriaVersion", oc = 1, Os = "enableCriteriaSurfaces";
let Oa = !1;
function ac() {
  var e;
  if (!Oa) {
    if (Oa = !0, !((e = game == null ? void 0 : game.settings) != null && e.register)) {
      console.warn(`${de} | game.settings.register unavailable; scene criteria setting skipped.`);
      return;
    }
    game.settings.register(de, Os, {
      name: f("EIDOLON.SceneCriteria.EnableSurfacesSettingName", "Enable Criteria Editor Surfaces"),
      hint: f(
        "EIDOLON.SceneCriteria.EnableSurfacesSettingHint",
        "Show criteria authoring surfaces (Scene > Criteria tab and tile/light editor controls). The Criteria Switcher remains available."
      ),
      scope: "world",
      config: !0,
      type: Boolean,
      default: !0,
      onChange: /* @__PURE__ */ s(() => {
        sc();
      }, "onChange")
    });
  }
}
s(ac, "registerSceneCriteriaSettings");
function Ir() {
  var e;
  try {
    if ((e = game == null ? void 0 : game.settings) != null && e.get)
      return !!game.settings.get(de, Os);
  } catch (t) {
    console.error(`${de} | Failed to read criteria surfaces setting`, t);
  }
  return !0;
}
s(Ir, "getCriteriaSurfacesEnabled");
function sc() {
  var o, a, l, c, u;
  const e = f("EIDOLON.SceneCriteria.ReloadPromptTitle", "Reload Required"), t = `<p>${f(
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
    f(
      "EIDOLON.SceneCriteria.ReloadNotice",
      "Please reload the world to apply criteria editor surface changes."
    )
  );
}
s(sc, "promptReloadForCriteriaSurfaces");
const ki = "Standard";
function ke(e) {
  var n;
  const t = (n = e == null ? void 0 : e.getFlag) == null ? void 0 : n.call(e, de, ws);
  return t ? vs(t) : [];
}
s(ke, "getSceneCriteria");
async function Sr(e, t) {
  if (!(e != null && e.setFlag)) return;
  const n = vs(t);
  await e.setFlag(de, ws, n), await e.setFlag(de, rc, oc);
  const i = Qn(e, n);
  await e.setFlag(de, Ko, i);
}
s(Sr, "setSceneCriteria");
function Qn(e, t = null) {
  var r;
  const n = Array.isArray(t) ? t : ke(e), i = Ye(((r = e == null ? void 0 : e.getFlag) == null ? void 0 : r.call(e, de, Ko)) ?? {});
  return Yo(i, n);
}
s(Qn, "getSceneCriteriaState");
async function lc(e, t, n = null) {
  if (!(e != null && e.setFlag)) return;
  const i = Array.isArray(n) ? n : ke(e), r = Yo(t, i);
  await e.setFlag(de, Ko, r);
}
s(lc, "setSceneCriteriaState");
function Jo(e = "") {
  const t = typeof e == "string" ? e.trim() : "", n = Ms(So(t || "criterion"), /* @__PURE__ */ new Set());
  return {
    id: As(),
    key: n,
    label: t,
    values: [ki],
    default: ki,
    order: 0
  };
}
s(Jo, "createSceneCriterion");
function vs(e) {
  const t = Array.isArray(e) ? Ye(e) : [], n = [], i = /* @__PURE__ */ new Set();
  return t.forEach((r, o) => {
    const a = Io(r, o, i);
    a && (n.push(a), i.add(a.key));
  }), n;
}
s(vs, "sanitizeCriteria$1");
function Io(e, t = 0, n = /* @__PURE__ */ new Set()) {
  if (!e || typeof e != "object") return null;
  const i = typeof e.id == "string" && e.id.trim() ? e.id.trim() : As(), o = (typeof e.label == "string" ? e.label : typeof e.name == "string" ? e.name : "").trim(), a = typeof e.key == "string" && e.key.trim() ? So(e.key) : So(o || `criterion-${Number(t) + 1}`), l = Ms(a, n), c = uc(e.values);
  let u = typeof e.default == "string" ? e.default.trim() : "";
  u || (u = c[0] ?? ki), c.includes(u) || c.unshift(u);
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
s(Io, "sanitizeCriterion");
function Yo(e, t = []) {
  const n = e && typeof e == "object" ? Ye(e) : {}, i = {};
  for (const r of t) {
    const o = n == null ? void 0 : n[r.key], a = typeof o == "string" ? o.trim() : "";
    a && r.values.includes(a) ? i[r.key] = a : i[r.key] = r.default;
  }
  return i;
}
s(Yo, "sanitizeSceneCriteriaState");
function cc(e) {
  return ke(e).map((n) => ({
    id: n.key,
    key: n.key,
    name: n.label,
    values: [...n.values]
  }));
}
s(cc, "getSceneCriteriaCategories");
function uc(e) {
  const t = Array.isArray(e) ? e : [], n = [];
  for (const i of t) {
    if (typeof i != "string") continue;
    const r = i.trim();
    !r || n.includes(r) || n.push(r);
  }
  return n.length || n.push(ki), n;
}
s(uc, "sanitizeCriterionValues");
function So(e) {
  return String(e ?? "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "criterion";
}
s(So, "slugifyCriterionKey");
function Ms(e, t) {
  if (!t.has(e)) return e;
  let n = 2;
  for (; t.has(`${e}-${n}`); )
    n += 1;
  return `${e}-${n}`;
}
s(Ms, "ensureUniqueCriterionKey");
function As() {
  var e;
  return (e = foundry == null ? void 0 : foundry.utils) != null && e.randomID ? foundry.utils.randomID() : typeof (crypto == null ? void 0 : crypto.randomUUID) == "function" ? crypto.randomUUID() : Math.random().toString(36).slice(2, 11);
}
s(As, "generateCriterionId");
function Ns(e) {
  var t, n;
  console.error(`${de} | Failed to persist scene criteria`, e), (n = (t = ui.notifications) == null ? void 0 : t.error) == null || n.call(
    t,
    f(
      "EIDOLON.SceneCriteria.PersistError",
      "Failed to persist the scene criteria."
    )
  );
}
s(Ns, "notifyPersistError");
var Ga, ae, ot, he, _s, mr, hr, pr, yr, Ei, br, xn, kn, Ln, Ds;
const it = class it extends Yn(Jn) {
  constructor(n = {}) {
    const { scene: i, criterion: r, isNew: o, onSave: a, ...l } = n ?? {};
    super(l);
    M(this, he);
    M(this, ae, null);
    M(this, ot, !1);
    M(this, mr, /* @__PURE__ */ s(async (n) => {
      n.preventDefault();
      const i = n.currentTarget;
      if (!(i instanceof HTMLFormElement)) return;
      const r = new FormData(i), o = String(r.get("criterionLabel") ?? "").trim(), a = String(r.get("criterionKey") ?? "").trim(), l = Array.from(i.querySelectorAll('[name="criterionValues"]')).map((g) => g instanceof HTMLInputElement ? g.value.trim() : "").filter((g, h, y) => g && y.indexOf(g) === h), u = String(r.get("criterionDefault") ?? "").trim() || l[0] || "Standard", d = Io(
        {
          id: m(this, ae).id,
          key: a,
          label: o,
          values: l,
          default: u,
          order: Number(m(this, ae).order ?? 0)
        },
        0,
        /* @__PURE__ */ new Set()
      );
      d && (v(this, ae, d), await L(this, he, Ds).call(this), this.close());
    }, "#onSubmit"));
    M(this, hr, /* @__PURE__ */ s((n) => {
      var a;
      if (m(this, ot)) return;
      const i = n.currentTarget, r = (i == null ? void 0 : i.form) ?? ((a = this.element) == null ? void 0 : a.querySelector("form"));
      if (!(r instanceof HTMLFormElement)) return;
      const o = r.querySelector('input[name="criterionKey"]');
      o instanceof HTMLInputElement && (o.value = bn(i.value));
    }, "#onLabelInput"));
    M(this, pr, /* @__PURE__ */ s((n) => {
      var c;
      const i = n.currentTarget, r = (i == null ? void 0 : i.form) ?? ((c = this.element) == null ? void 0 : c.querySelector("form"));
      if (!(r instanceof HTMLFormElement) || !(i instanceof HTMLInputElement)) return;
      const o = r.querySelector('input[name="criterionLabel"]'), a = bn(o instanceof HTMLInputElement ? o.value : ""), l = bn(i.value);
      v(this, ot, l !== a), i.value = l, L(this, he, Ei).call(this, r);
    }, "#onKeyInput"));
    M(this, yr, /* @__PURE__ */ s((n) => {
      var a, l;
      n.preventDefault();
      const i = ((a = n.currentTarget) == null ? void 0 : a.form) ?? ((l = this.element) == null ? void 0 : l.querySelector("form"));
      if (!(i instanceof HTMLFormElement)) return;
      const r = i.querySelector('input[name="criterionLabel"]'), o = i.querySelector('input[name="criterionKey"]');
      o instanceof HTMLInputElement && (o.value = bn(r instanceof HTMLInputElement ? r.value : ""), v(this, ot, !1), L(this, he, Ei).call(this, i));
    }, "#onResetAutoKey"));
    M(this, br, /* @__PURE__ */ s((n) => {
      var c, u, d, g, h, y;
      n.preventDefault();
      const i = ((c = n.currentTarget) == null ? void 0 : c.form) ?? ((u = this.element) == null ? void 0 : u.querySelector("form"));
      if (!(i instanceof HTMLFormElement)) return;
      const r = i.querySelector(".scene-criterion-editor__values");
      if (!(r instanceof HTMLElement)) return;
      (d = r.querySelector(".scene-criterion-editor__empty")) == null || d.remove();
      const o = document.createElement("div");
      o.classList.add("scene-criterion-editor__value");
      const a = Ai(f("EIDOLON.SceneCriteria.ValuePlaceholder", "Allowed value")), l = Ai(f("EIDOLON.SceneCriteria.RemoveValue", "Remove Value"));
      o.innerHTML = `
      <input type="text" name="criterionValues" value="" placeholder="${a}" class="form-control">
      <button type="button" class="icon" data-action="remove-value" aria-label="${l}" title="${l}">
        <i class="fa-solid fa-trash"></i>
      </button>
    `, r.appendChild(o), (g = o.querySelector('[data-action="remove-value"]')) == null || g.addEventListener("click", m(this, xn)), (h = o.querySelector('input[name="criterionValues"]')) == null || h.addEventListener("input", m(this, kn)), L(this, he, Ln).call(this, i), (y = o.querySelector('input[name="criterionValues"]')) == null || y.focus();
    }, "#onAddValue"));
    M(this, xn, /* @__PURE__ */ s((n) => {
      var o, a, l, c;
      n.preventDefault(), (a = (o = n.currentTarget) == null ? void 0 : o.closest(".scene-criterion-editor__value")) == null || a.remove();
      const i = ((l = n.currentTarget) == null ? void 0 : l.form) ?? ((c = this.element) == null ? void 0 : c.querySelector("form"));
      if (!(i instanceof HTMLFormElement)) return;
      const r = i.querySelector(".scene-criterion-editor__values");
      if (r instanceof HTMLElement) {
        if (!r.querySelector(".scene-criterion-editor__value")) {
          const u = document.createElement("p");
          u.classList.add("notes", "scene-criterion-editor__empty"), u.textContent = f(
            "EIDOLON.SceneCriteria.ValueListEmpty",
            "No values have been added to this criterion."
          ), r.appendChild(u);
        }
        L(this, he, Ln).call(this, i);
      }
    }, "#onRemoveValue"));
    M(this, kn, /* @__PURE__ */ s((n) => {
      var r, o;
      const i = ((r = n.currentTarget) == null ? void 0 : r.form) ?? ((o = this.element) == null ? void 0 : o.querySelector("form"));
      i instanceof HTMLFormElement && L(this, he, Ln).call(this, i);
    }, "#onValuesChanged"));
    this.scene = i ?? null, this.criterion = r ?? null, this.onSave = typeof a == "function" ? a : null, this.isNew = !!o, v(this, ae, L(this, he, _s).call(this)), v(this, ot, m(this, ae).key !== bn(m(this, ae).label));
  }
  async _prepareContext() {
    var i, r, o, a;
    const n = Array.isArray((i = m(this, ae)) == null ? void 0 : i.values) ? m(this, ae).values : [];
    return {
      isNew: this.isNew,
      key: ((r = m(this, ae)) == null ? void 0 : r.key) ?? "",
      label: ((o = m(this, ae)) == null ? void 0 : o.label) ?? "",
      defaultValue: ((a = m(this, ae)) == null ? void 0 : a.default) ?? "",
      values: n.map((l, c) => {
        var u;
        return {
          index: c,
          value: l,
          selected: l === ((u = m(this, ae)) == null ? void 0 : u.default)
        };
      }),
      hasValues: n.length > 0,
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
      keyIsCustom: m(this, ot)
    };
  }
  _onRender(n, i) {
    var o, a, l, c, u, d;
    super._onRender(n, i);
    const r = (o = this.element) == null ? void 0 : o.querySelector("form");
    r && (r.addEventListener("submit", m(this, mr)), (a = r.querySelector('[data-action="add-value"]')) == null || a.addEventListener("click", m(this, br)), (l = r.querySelector('input[name="criterionLabel"]')) == null || l.addEventListener("input", m(this, hr)), (c = r.querySelector('input[name="criterionKey"]')) == null || c.addEventListener("input", m(this, pr)), (u = r.querySelector('[data-action="reset-auto-key"]')) == null || u.addEventListener("click", m(this, yr)), r.querySelectorAll('[data-action="remove-value"]').forEach((g) => {
      g.addEventListener("click", m(this, xn));
    }), r.querySelectorAll('input[name="criterionValues"]').forEach((g) => {
      g.addEventListener("input", m(this, kn));
    }), (d = r.querySelector('[data-action="cancel"]')) == null || d.addEventListener("click", (g) => {
      g.preventDefault(), this.close();
    }), L(this, he, Ei).call(this, r), L(this, he, Ln).call(this, r));
  }
};
ae = new WeakMap(), ot = new WeakMap(), he = new WeakSet(), _s = /* @__PURE__ */ s(function() {
  const n = Io(this.criterion, 0, /* @__PURE__ */ new Set()) ?? Jo(f("EIDOLON.SceneCriteria.DefaultCategoryName", "New Criterion"));
  return {
    id: n.id,
    key: n.key,
    label: n.label ?? "",
    values: Array.isArray(n.values) ? [...n.values] : [],
    default: n.default
  };
}, "#initializeState"), mr = new WeakMap(), hr = new WeakMap(), pr = new WeakMap(), yr = new WeakMap(), Ei = /* @__PURE__ */ s(function(n) {
  const i = n.querySelector('[data-action="reset-auto-key"]');
  i instanceof HTMLButtonElement && (i.disabled = !m(this, ot));
}, "#syncAutoKeyButton"), br = new WeakMap(), xn = new WeakMap(), kn = new WeakMap(), Ln = /* @__PURE__ */ s(function(n) {
  var c, u;
  const i = n.querySelector('select[name="criterionDefault"]');
  if (!(i instanceof HTMLSelectElement)) return;
  const r = ((u = (c = i.value) == null ? void 0 : c.trim) == null ? void 0 : u.call(c)) ?? "", o = Array.from(n.querySelectorAll('input[name="criterionValues"]')).map((d) => d instanceof HTMLInputElement ? d.value.trim() : "").filter((d, g, h) => d && h.indexOf(d) === g), a = i.dataset.emptyLabel || f("EIDOLON.SceneCriteria.ValueListEmpty", "No values have been added to this criterion.");
  if (i.innerHTML = "", !o.length) {
    const d = document.createElement("option");
    d.value = "", d.textContent = a, d.selected = !0, i.appendChild(d);
    return;
  }
  const l = o.includes(r) ? r : o[0];
  for (const d of o) {
    const g = document.createElement("option");
    g.value = d, g.textContent = d, g.selected = d === l, i.appendChild(g);
  }
}, "#syncDefaultOptions"), Ds = /* @__PURE__ */ s(async function() {
  if (!this.scene) return;
  const n = ke(this.scene).sort((r, o) => r.order - o.order), i = n.findIndex((r) => r.id === m(this, ae).id);
  i < 0 ? (m(this, ae).order = n.length, n.push(m(this, ae))) : (m(this, ae).order = n[i].order, n.splice(i, 1, m(this, ae)));
  try {
    await Sr(this.scene, n), this.onSave && await this.onSave(m(this, ae));
  } catch (r) {
    Ns(r);
  }
}, "#persist"), s(it, "CategoryEditorApplication"), je(it, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  ft(it, it, "DEFAULT_OPTIONS"),
  {
    id: `${de}-criterion-editor`,
    classes: Array.from(
      /* @__PURE__ */ new Set([...((Ga = ft(it, it, "DEFAULT_OPTIONS")) == null ? void 0 : Ga.classes) ?? [], "standard-form", "themed"])
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
)), je(it, "PARTS", {
  content: {
    template: `modules/${de}/templates/scene-criteria-editor.html`
  }
});
let wo = it;
function bn(e) {
  return String(e ?? "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "criterion";
}
s(bn, "slugifyKey");
const dc = `modules/${de}/templates/scene-criteria-tab.html`, Oo = {
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
}, fc = Lr(wo), gc = Ss({
  tabId: "criteria",
  tabLabel: /* @__PURE__ */ s(() => f("EIDOLON.SceneCriteria.TabLabel", "Criteria"), "tabLabel"),
  getScene: Qe,
  isApplicable: /* @__PURE__ */ s(() => Ir(), "isApplicable"),
  renderContent: /* @__PURE__ */ s(({ app: e, tab: t, scene: n }) => hc(e, t, n), "renderContent"),
  logger: Oo
});
function mc() {
  return gc.register();
}
s(mc, "registerSceneCriteriaConfigHook");
function hc(e, t, n) {
  if (!(t instanceof HTMLElement)) return;
  const i = Le(n) ? n : Qe(e);
  en(e, t, i);
}
s(hc, "renderCriteriaTab");
async function en(e, t, n) {
  var r, o;
  const i = n ?? Qe(e);
  Oo.group("renderCriteriaTabContent", { sceneId: (i == null ? void 0 : i.id) ?? null });
  try {
    if (!Le(i)) {
      const d = f(
        "EIDOLON.SceneCriteria.Unavailable",
        "Scene criteria are unavailable for this configuration sheet."
      );
      t.innerHTML = `<p class="notes">${d}</p>`;
      return;
    }
    const a = ke(i).sort((d, g) => d.order - g.order), l = Qn(i, a), c = ((o = (r = foundry == null ? void 0 : foundry.applications) == null ? void 0 : r.handlebars) == null ? void 0 : o.renderTemplate) ?? (typeof renderTemplate == "function" ? renderTemplate : globalThis == null ? void 0 : globalThis.renderTemplate);
    if (typeof c != "function") {
      t.innerHTML = `<p class="notes">${f("EIDOLON.SceneCriteria.CategoryListEmpty", "No criteria configured for this scene.")}</p>`;
      return;
    }
    const u = await c(dc, {
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
        var h, y;
        return {
          id: d.id,
          label: d.label,
          displayName: ((y = (h = d.label) == null ? void 0 : h.trim) == null ? void 0 : y.call(h)) || f("EIDOLON.SceneCriteria.UnnamedCategory", "Unnamed Criterion"),
          hasValues: d.values.length > 0,
          values: d.values.map((b) => ({
            value: b,
            isCurrent: (l[d.key] ?? d.default) === b
          })),
          valueCountLabel: yc(d.values.length),
          canMoveUp: g > 0,
          canMoveDown: g < a.length - 1
        };
      }),
      hasCriteria: a.length > 0
    });
    t.innerHTML = u, pc(e, t, i);
  } catch (a) {
    console.error(`${de} | Failed to render criteria tab`, a), t.innerHTML = `<p class="notes">${f("EIDOLON.SceneCriteria.CategoryListEmpty", "No criteria configured for this scene.")}</p>`;
  } finally {
    Oo.groupEnd();
  }
}
s(en, "renderCriteriaTabContent");
function pc(e, t, n) {
  const i = n ?? Qe(e);
  if (!Le(i)) return;
  const r = t.querySelector('[data-criteria-action="add"]');
  r && r.addEventListener("click", () => {
    va(e, {
      scene: i,
      criterion: Jo(
        f("EIDOLON.SceneCriteria.DefaultCategoryName", "New Criterion")
      ),
      isNew: !0,
      onSave: /* @__PURE__ */ s(() => en(e, t, i), "onSave")
    });
  }), t.querySelectorAll('[data-criteria-action="edit"]').forEach((o) => {
    const a = o.dataset.criterionId;
    a && o.addEventListener("click", () => {
      const l = ke(i).find((c) => c.id === a);
      l && va(e, {
        scene: i,
        criterion: l,
        onSave: /* @__PURE__ */ s(() => en(e, t, i), "onSave")
      });
    });
  }), t.querySelectorAll('[data-criteria-action="remove"]').forEach((o) => {
    const a = o.dataset.criterionId;
    a && o.addEventListener("click", async () => {
      await Pr(i, (c) => {
        const u = c.findIndex((d) => d.id === a);
        return u < 0 ? !1 : (c.splice(u, 1), Br(c), !0);
      }) && await en(e, t, i);
    });
  }), t.querySelectorAll('[data-criteria-action="move-up"]').forEach((o) => {
    const a = o.dataset.criterionId;
    a && o.addEventListener("click", async () => {
      await Pr(i, (c) => {
        const u = c.findIndex((g) => g.id === a);
        if (u <= 0) return !1;
        const [d] = c.splice(u, 1);
        return c.splice(u - 1, 0, d), Br(c), !0;
      }) && await en(e, t, i);
    });
  }), t.querySelectorAll('[data-criteria-action="move-down"]').forEach((o) => {
    const a = o.dataset.criterionId;
    a && o.addEventListener("click", async () => {
      await Pr(i, (c) => {
        const u = c.findIndex((g) => g.id === a);
        if (u < 0 || u >= c.length - 1) return !1;
        const [d] = c.splice(u, 1);
        return c.splice(u + 1, 0, d), Br(c), !0;
      }) && await en(e, t, i);
    });
  });
}
s(pc, "bindCriteriaTabEvents");
async function Pr(e, t) {
  const n = ke(e).sort((r, o) => r.order - o.order);
  if (t(n) === !1) return !1;
  try {
    return await Sr(e, n), !0;
  } catch (r) {
    return Ns(r), !1;
  }
}
s(Pr, "mutateCriteria");
function va(e, t = {}) {
  const n = t.scene ?? null, i = n && Le(n) ? n : Qe(e);
  if (!Le(i))
    return;
  fc({
    scene: i,
    criterion: t.criterion ?? null,
    isNew: !!t.isNew,
    onSave: typeof t.onSave == "function" ? t.onSave : null
  }).render({ force: !0 });
}
s(va, "openCriterionEditor");
function Br(e) {
  e.forEach((t, n) => {
    t.order = n;
  });
}
s(Br, "reindexCriteriaOrder");
function yc(e) {
  var t, n;
  if ((n = (t = game.i18n) == null ? void 0 : t.has) != null && n.call(t, "EIDOLON.SceneCriteria.ValueCountLabel"))
    try {
      return game.i18n.format("EIDOLON.SceneCriteria.ValueCountLabel", { count: e });
    } catch (i) {
      console.error(`${de} | Failed to format value count label`, i);
    }
  return e === 0 ? "No values configured" : e === 1 ? "1 value" : `${e} values`;
}
s(yc, "formatValueCount");
let Ma = !1;
function bc() {
  Hooks.once("init", () => {
    ac();
  }), Hooks.once("ready", () => {
    Ir() && (Ma || (mc(), Ma = !0));
  });
}
s(bc, "registerSceneCriteriaHooks");
bc();
const K = w, Fs = "criteriaEngineVersion", Ut = "fileIndex", Vt = "tileCriteria", Qo = {
  LEGACY: 1,
  CRITERIA: 2
}, xs = Qo.CRITERIA;
function ks(e) {
  var t;
  return ((t = e == null ? void 0 : e.getFlag) == null ? void 0 : t.call(e, K, Fs)) ?? Qo.LEGACY;
}
s(ks, "getSceneEngineVersion");
function Tc(e, t, n, i, r) {
  if (!(e != null && e.length) || !(n != null && n.length)) return -1;
  const o = {};
  for (const l of n)
    o[l] = t[l];
  const a = Aa(e, o, n);
  if (a >= 0) return a;
  if (i != null && i.length && r) {
    const l = { ...o };
    for (const c of i) {
      if (!(c in l)) continue;
      l[c] = r[c] ?? "Standard";
      const u = Aa(e, l, n);
      if (u >= 0) return u;
    }
  }
  return -1;
}
s(Tc, "findBestMatch");
function Aa(e, t, n) {
  return e.findIndex((i) => {
    for (const r of n)
      if (i[r] !== t[r]) return !1;
    return !0;
  });
}
s(Aa, "findExactMatch");
function Ec(e, t) {
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
s(Ec, "findFileIndex");
function Ci(e) {
  return e && typeof e == "object" && !Array.isArray(e);
}
s(Ci, "isPlainObject$2");
function Na(e) {
  return e == null ? e : typeof structuredClone == "function" ? structuredClone(e) : JSON.parse(JSON.stringify(e));
}
s(Na, "deepClone");
function Cc(e, t) {
  if (!t) return;
  const n = t.split(".").filter(Boolean);
  if (!n.length) return;
  let i = e;
  for (let r = 0; r < n.length - 1; r += 1) {
    if (!Ci(i == null ? void 0 : i[n[r]])) return;
    i = i[n[r]];
  }
  delete i[n.at(-1)];
}
s(Cc, "deletePath");
function Rs(e, t) {
  const n = Na(e ?? {});
  if (!Ci(t)) return n;
  for (const [i, r] of Object.entries(t)) {
    if (i.startsWith("-=") && r === !0) {
      Cc(n, i.slice(2));
      continue;
    }
    Ci(r) && Ci(n[i]) ? n[i] = Rs(n[i], r) : n[i] = Na(r);
  }
  return n;
}
s(Rs, "fallbackMerge");
function Lc(e, t) {
  var n, i;
  return (n = foundry == null ? void 0 : foundry.utils) != null && n.mergeObject && ((i = foundry == null ? void 0 : foundry.utils) != null && i.deepClone) ? foundry.utils.mergeObject(e, foundry.utils.deepClone(t), {
    inplace: !1
  }) : Rs(e, t);
}
s(Lc, "defaultMerge");
function Ic(e, t) {
  if (!e) return !0;
  for (const n of Object.keys(e))
    if (e[n] !== t[n]) return !1;
  return !0;
}
s(Ic, "criteriaMatch");
function Hs(e, t, n, i) {
  const r = i ?? Lc;
  let o = r({}, e ?? {});
  if (!(t != null && t.length)) return o;
  const a = [];
  for (let l = 0; l < t.length; l += 1) {
    const c = t[l];
    if (Ic(c == null ? void 0 : c.criteria, n)) {
      const u = c != null && c.criteria ? Object.keys(c.criteria).length : 0;
      a.push({ specificity: u, index: l, delta: c == null ? void 0 : c.delta });
    }
  }
  a.sort((l, c) => l.specificity - c.specificity || l.index - c.index);
  for (const l of a)
    l.delta && (o = r(o, l.delta));
  return o;
}
s(Hs, "resolveRules");
function wr(e = null) {
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
s(wr, "canManageCriteria");
function Sc(e = null) {
  if (!wr(e))
    throw new Error(`${K} | You do not have permission to manage scene criteria.`);
}
s(Sc, "requireCriteriaAccess");
const wc = /* @__PURE__ */ s((...e) => console.log(`${K} | criteria tiles:`, ...e), "log$1");
let Ri = /* @__PURE__ */ new WeakMap(), Hi = /* @__PURE__ */ new WeakMap();
const _a = 200;
function Oc(e) {
  return e ? Number.isInteger(e.size) ? e.size : Array.isArray(e) || typeof e.length == "number" ? e.length : Array.from(e).length : 0;
}
s(Oc, "getCollectionSize$1");
function ai() {
  return typeof (performance == null ? void 0 : performance.now) == "function" ? performance.now() : Date.now();
}
s(ai, "nowMs$2");
function vc(e) {
  if (!Array.isArray(e)) return [];
  const t = /* @__PURE__ */ new Set();
  for (const n of e) {
    if (typeof n != "string") continue;
    const i = n.trim();
    i && t.add(i);
  }
  return Array.from(t);
}
s(vc, "uniqueStringKeys$1");
function Mc(e, t = _a) {
  if (!Array.isArray(e) || e.length === 0) return [];
  const n = Number.isInteger(t) && t > 0 ? t : _a, i = [];
  for (let r = 0; r < e.length; r += n)
    i.push(e.slice(r, r + n));
  return i;
}
s(Mc, "chunkArray$1");
async function Ac(e, t, n) {
  const i = Mc(t, n);
  for (const r of i)
    await e.updateEmbeddedDocuments("Tile", r), i.length > 1 && await Promise.resolve();
  return i.length;
}
s(Ac, "updateTilesInChunks");
function Nc(e) {
  var i;
  const t = Kt(e, { files: null });
  if (!((i = t == null ? void 0 : t.variants) != null && i.length)) return [];
  const n = /* @__PURE__ */ new Set();
  for (const r of t.variants)
    for (const o of Object.keys(r.criteria ?? {}))
      o && n.add(o);
  return Array.from(n);
}
s(Nc, "getTileCriteriaDependencyKeys");
function _c(e, t) {
  const n = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Set();
  for (const r of t) {
    const o = r.getFlag(K, Vt) ?? r.getFlag(K, Ut);
    if (o) {
      i.add(r.id);
      for (const a of Nc(o))
        n.has(a) || n.set(a, /* @__PURE__ */ new Set()), n.get(a).add(r.id);
    }
  }
  return {
    collection: t,
    keyToTileIds: n,
    allTileIds: i
  };
}
s(_c, "buildTileDependencyIndex");
function Dc(e, t) {
  const n = Hi.get(e);
  if ((n == null ? void 0 : n.collection) === t) return n;
  const i = _c(e, t);
  return Hi.set(e, i), i;
}
s(Dc, "getTileDependencyIndex");
function Fc(e, t, n) {
  const i = vc(n);
  if (!i.length)
    return Array.from(t ?? []);
  const r = Dc(e, t), o = /* @__PURE__ */ new Set();
  for (const a of i) {
    const l = r.keyToTileIds.get(a);
    if (l)
      for (const c of l)
        o.add(c);
  }
  return o.size ? typeof (t == null ? void 0 : t.get) == "function" ? Array.from(o).map((a) => t.get(a)).filter(Boolean) : Array.from(t ?? []).filter((a) => o.has(a.id)) : [];
}
s(Fc, "getTilesForChangedKeys");
function $s(e) {
  return typeof (e == null ? void 0 : e.name) == "string" ? e.name : typeof (e == null ? void 0 : e.src) == "string" ? e.src : "";
}
s($s, "getFilePath");
function $i(e) {
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
s($i, "normalizeFilePath");
function Xo(e) {
  if (!Array.isArray(e)) return [];
  const t = /* @__PURE__ */ new Map();
  return e.map((n, i) => {
    const r = $i($s(n)), o = r || `__index:${i}`, a = t.get(o) ?? 0;
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
s(Xo, "buildTileFileEntries");
function St(e, t) {
  if (!Number.isInteger(t) || t < 0) return null;
  const i = Xo(e).find((r) => r.index === t);
  return i ? { ...i.target } : { indexHint: t };
}
s(St, "createTileTargetFromIndex");
function Or(e) {
  if (!e || typeof e != "object") return null;
  const t = $i(e.path), n = Number(e.indexHint ?? e.fileIndex), i = Number(e.occurrence), r = {};
  return t && (r.path = t, r.occurrence = Number.isInteger(i) && i >= 0 ? i : 0), Number.isInteger(n) && n >= 0 && (r.indexHint = n), !r.path && !Number.isInteger(r.indexHint) ? null : r;
}
s(Or, "normalizeTileTarget");
function An(e, t) {
  const n = Or(e);
  if (!n) return -1;
  const i = Xo(t);
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
function wt(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return {};
  const t = {};
  for (const [n, i] of Object.entries(e))
    typeof n != "string" || !n || typeof i != "string" || !i.trim() || (t[n] = i.trim());
  return t;
}
s(wt, "sanitizeCriteria");
function xc(e) {
  return Object.entries(wt(e)).sort(([n], [i]) => n.localeCompare(i)).map(([n, i]) => `${n}=${i}`).join("");
}
s(xc, "serializeCriteria");
function kc(e) {
  return Object.keys(wt(e)).length;
}
s(kc, "getCriteriaSpecificity");
function Rc(e, t) {
  const n = wt(e), i = wt(t);
  for (const [r, o] of Object.entries(n))
    if (r in i && i[r] !== o)
      return !1;
  return !0;
}
s(Rc, "areCriteriaCompatible");
function Hc(e, t) {
  const n = An(e, t);
  if (Number.isInteger(n) && n >= 0)
    return `index:${n}`;
  const i = Or(e);
  if (!i) return "";
  if (i.path) {
    const r = Number.isInteger(i.occurrence) ? i.occurrence : 0;
    return `path:${i.path}#${r}`;
  }
  return Number.isInteger(i.indexHint) ? `hint:${i.indexHint}` : "";
}
s(Hc, "getTargetIdentity");
function Ps(e, t = {}) {
  var l;
  const n = Array.isArray(t.files) ? t.files : [], i = Kt(e, { files: n });
  if (!((l = i == null ? void 0 : i.variants) != null && l.length))
    return {
      errors: [],
      warnings: []
    };
  const r = i.variants.map((c, u) => ({
    index: u,
    criteria: wt(c.criteria),
    specificity: kc(c.criteria),
    criteriaSignature: xc(c.criteria),
    targetIdentity: Hc(c.target, n)
  })), o = [], a = [];
  for (let c = 0; c < r.length; c += 1) {
    const u = r[c];
    for (let d = c + 1; d < r.length; d += 1) {
      const g = r[d];
      if (u.specificity !== g.specificity || !Rc(u.criteria, g.criteria)) continue;
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
s(Ps, "detectTileCriteriaConflicts");
function $c(e, t) {
  if (!e || typeof e != "object") return null;
  let n = Or(e.target);
  if (!n) {
    const i = Number(e.fileIndex);
    Number.isInteger(i) && i >= 0 && (n = St(t, i));
  }
  return n ? {
    criteria: wt(e.criteria),
    target: n
  } : null;
}
s($c, "normalizeTileVariant");
function Bs(e, t = {}) {
  if (!Array.isArray(e) || e.length === 0) return null;
  const n = Array.isArray(t.files) ? t.files : null, i = e.map((c, u) => ({
    criteria: wt(c),
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
s(Bs, "buildTileCriteriaFromFileIndex");
function Kt(e, t = {}) {
  const n = Array.isArray(t.files) ? t.files : null;
  if (Array.isArray(e))
    return Bs(e, { files: n });
  if (!e || typeof e != "object") return null;
  const i = Array.isArray(e.variants) ? e.variants.map((o) => $c(o, n)).filter(Boolean) : [];
  if (!i.length) return null;
  let r = Or(e.defaultTarget);
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
function Pc(e, t) {
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
s(Pc, "selectTileFileIndexFromCompiled");
function Bc(e, t) {
  const n = Kt(e, { files: t });
  if (!n) return null;
  const i = n.variants.map((o) => {
    const a = wt(o.criteria), l = An(o.target, t);
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
s(Bc, "compileTileMatcher");
function qc(e, t, n) {
  const i = Ri.get(e);
  if (i && i.tileCriteria === t && i.files === n)
    return i.compiled;
  const r = Bc(t, n);
  return Ri.set(e, {
    tileCriteria: t,
    files: n,
    compiled: r
  }), r;
}
s(qc, "getCompiledTileMatcher");
function Uc(e = null, t = null) {
  e ? Hi.delete(e) : Hi = /* @__PURE__ */ new WeakMap(), t ? Ri.delete(t) : e || (Ri = /* @__PURE__ */ new WeakMap());
}
s(Uc, "invalidateTileCriteriaCaches");
async function qs(e, t, n = {}) {
  var c, u, d, g;
  const i = ai(), r = {
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
    return r.durationMs = ai() - i, r;
  const o = t.getEmbeddedCollection("Tile") ?? [];
  r.total = Oc(o);
  const a = Fc(t, o, n.changedKeys);
  if (r.scanned = a.length, !a.length)
    return r.skipped.unaffected = r.total, r.durationMs = ai() - i, r;
  const l = [];
  for (const h of a) {
    const y = h.getFlag(K, Vt) ?? h.getFlag(K, Ut);
    if (!y) {
      r.skipped.noCriteria += 1;
      continue;
    }
    const b = h.getFlag("monks-active-tiles", "files");
    if (!(b != null && b.length)) {
      r.skipped.noFiles += 1;
      continue;
    }
    const p = qc(h, y, b), T = Pc(p, e);
    if (!Number.isInteger(T) || T < 0 || T >= b.length) {
      console.warn(`${K} | Tile ${h.id} has no valid file match for state`, e), r.skipped.noMatch += 1;
      continue;
    }
    const E = T + 1, O = Number(h.getFlag("monks-active-tiles", "fileindex")) !== E, F = b.some(($, Q) => !!($ != null && $.selected) != (Q === T)), _ = $i(((u = h.texture) == null ? void 0 : u.src) ?? ((g = (d = h._source) == null ? void 0 : d.texture) == null ? void 0 : g.src) ?? ""), D = $s(b[T]), R = $i(D), Y = !!R && R !== _;
    if (!F && !O && !Y) {
      r.skipped.unchanged += 1;
      continue;
    }
    const ie = {
      _id: h._id
    };
    F && (ie["flags.monks-active-tiles.files"] = b.map(($, Q) => ({
      ...$,
      selected: Q === T
    }))), O && (ie["flags.monks-active-tiles.fileindex"] = E), Y && (ie.texture = { src: D }), l.push(ie), wc(`Tile ${h.id} -> ${D}`);
  }
  return l.length > 0 && (r.chunks = await Ac(t, l, n.chunkSize), r.updated = l.length), r.durationMs = ai() - i, r;
}
s(qs, "updateTiles");
function Vc() {
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
s(Vc, "buildLightControlsMap");
const jt = w, an = "lightCriteria", Zo = Object.freeze({
  base: null,
  mappings: [],
  current: null
});
function qr(e) {
  return e && typeof e == "object" && !Array.isArray(e);
}
s(qr, "isPlainObject$1");
function Us(e, t) {
  if (!qr(t)) return {};
  const n = {};
  for (const [i, r] of Object.entries(t)) {
    const o = e == null ? void 0 : e[i];
    if (qr(r) && qr(o)) {
      const a = Us(o, r);
      Object.keys(a).length > 0 && (n[i] = a);
    } else r !== o && (n[i] = Ye(r));
  }
  return n;
}
s(Us, "computeDelta");
function Vs(e) {
  var n;
  const t = ((n = e == null ? void 0 : e.getFlag) == null ? void 0 : n.call(e, jt, an)) ?? Zo;
  return Nn(t);
}
s(Vs, "getLightCriteriaState");
async function js(e, t) {
  const n = Nn(t);
  if (!(e != null && e.setFlag))
    return n;
  const i = n.base !== null, r = n.mappings.length > 0, o = n.current !== null;
  return !i && !r && !o ? (typeof e.unsetFlag == "function" ? await e.unsetFlag(jt, an) : await e.setFlag(jt, an, null), Zo) : (await e.setFlag(jt, an, n), n);
}
s(js, "setLightCriteriaState");
async function Xn(e, t) {
  if (typeof t != "function")
    throw new TypeError("updateLightCriteriaState requires an updater function.");
  const n = Ye(Vs(e)), i = await t(n);
  return js(e, i);
}
s(Xn, "updateLightCriteriaState");
async function Da(e, t) {
  const n = Jt(t);
  if (!n)
    throw new Error("Invalid light configuration payload.");
  return Xn(e, (i) => ({
    ...i,
    base: n
  }));
}
s(Da, "storeBaseLighting");
async function Fa(e, t, n, { label: i } = {}) {
  const r = Zn(t);
  if (!r)
    throw new Error("Cannot create a mapping without at least one category selection.");
  const o = Jt(n);
  if (!o)
    throw new Error("Invalid light configuration payload.");
  return Xn(e, (a) => {
    const l = gn(r), c = Array.isArray(a == null ? void 0 : a.mappings) ? [...a.mappings] : [], u = c.findIndex((y) => (y == null ? void 0 : y.key) === l), d = u >= 0 ? c[u] : null, g = typeof (d == null ? void 0 : d.id) == "string" && d.id.trim() ? d.id.trim() : Gs(), h = vr({
      id: g,
      categories: r,
      config: o,
      label: typeof i == "string" ? i : (d == null ? void 0 : d.label) ?? null,
      updatedAt: Date.now()
    });
    if (!h)
      throw new Error("Failed to sanitize criteria mapping entry.");
    return u >= 0 ? c[u] = h : c.push(h), {
      ...a,
      mappings: c
    };
  });
}
s(Fa, "upsertLightCriteriaMapping");
async function jc(e, t, n, i, { replaceExisting: r = !1 } = {}) {
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
    const g = gn(a), h = u.findIndex(
      (E, C) => C !== d && (E == null ? void 0 : E.key) === g
    );
    if (h >= 0 && !r)
      throw new Error("A mapping already exists for the selected criteria.");
    const y = u[d], b = vr({
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
    if (h >= 0) {
      const [E] = u.splice(h, 1);
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
s(jc, "retargetLightCriteriaMapping");
async function zc(e, t) {
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
s(zc, "removeLightCriteriaMapping");
async function On(e, t) {
  const n = zs(t);
  return Xn(e, (i) => ({
    ...i,
    current: n
  }));
}
s(On, "storeCurrentCriteriaSelection");
function Gc(e) {
  const t = Nn(e), n = t.base ?? {}, i = [];
  for (const r of t.mappings) {
    const o = Zn(r == null ? void 0 : r.categories);
    if (!o) continue;
    const a = Us(n, (r == null ? void 0 : r.config) ?? {});
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
s(Gc, "convertLightCriteriaStateToPresets");
function Wc(e, t = []) {
  const n = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Set();
  for (const c of t)
    typeof (c == null ? void 0 : c.key) == "string" && c.key.trim() && i.add(c.key.trim()), typeof (c == null ? void 0 : c.id) == "string" && c.id.trim() && typeof (c == null ? void 0 : c.key) == "string" && n.set(c.id.trim(), c.key.trim());
  const r = Nn(e), o = /* @__PURE__ */ s((c) => {
    const u = {};
    for (const [d, g] of Object.entries(c ?? {})) {
      const h = String(d ?? "").trim(), y = typeof g == "string" ? g.trim() : "";
      if (!h || !y) continue;
      if (i.has(h)) {
        u[h] = y;
        continue;
      }
      const b = n.get(h);
      b && (u[b] = y);
    }
    return Object.keys(u).length ? u : null;
  }, "remapCategories"), a = r.mappings.map((c) => {
    const u = o(c.categories);
    return u ? vr({
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
s(Wc, "migrateLightCriteriaCategoriesToKeys");
function Nn(e) {
  var c;
  const t = Ye(e);
  if (!t || typeof t != "object")
    return Ye(Zo);
  const n = Jt(t.base), i = Array.isArray(t.mappings) ? t.mappings : [], r = /* @__PURE__ */ new Map();
  for (const u of i) {
    const d = vr(u);
    d && r.set(d.key, d);
  }
  const o = Array.from(r.values()), a = new Map(o.map((u) => [u.id, u]));
  let l = zs(t.current);
  if (l) {
    const u = l.categories && Object.keys(l.categories).length > 0;
    if (l.mappingId && !a.has(l.mappingId)) {
      const d = u ? ((c = o.find((g) => g.key === gn(l.categories))) == null ? void 0 : c.id) ?? null : null;
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
    const i = n[jt];
    i && typeof i == "object" && (delete i[an], Object.keys(i).length === 0 && delete n[jt]), Object.keys(n).length === 0 && delete t.flags;
  }
  return t;
}
s(Jt, "sanitizeLightConfigPayload");
function vr(e) {
  if (!e || typeof e != "object") return null;
  const t = Zn(e.categories);
  if (!t) return null;
  const n = Jt(e.config);
  if (!n) return null;
  const i = typeof e.id == "string" && e.id.trim() ? e.id.trim() : Gs(), r = gn(t), o = {
    id: i,
    key: r,
    categories: t,
    config: n,
    updatedAt: Number.isFinite(e.updatedAt) ? Number(e.updatedAt) : Date.now()
  };
  return typeof e.label == "string" && e.label.trim() && (o.label = e.label.trim()), o;
}
s(vr, "sanitizeCriteriaMappingEntry");
function zs(e) {
  if (!e || typeof e != "object") return null;
  const t = typeof e.mappingId == "string" && e.mappingId.trim() ? e.mappingId.trim() : null, n = Zn(e.categories);
  return !t && !n ? null : {
    mappingId: t,
    categories: n,
    updatedAt: Number.isFinite(e.updatedAt) ? Number(e.updatedAt) : Date.now()
  };
}
s(zs, "sanitizeCurrentSelection");
function Zn(e) {
  const t = {};
  if (Array.isArray(e))
    for (const n of e) {
      const i = xa((n == null ? void 0 : n.id) ?? (n == null ? void 0 : n.categoryId) ?? (n == null ? void 0 : n.category)), r = ka((n == null ? void 0 : n.value) ?? (n == null ? void 0 : n.selection) ?? (n == null ? void 0 : n.label));
      !i || !r || (t[i] = r);
    }
  else if (e && typeof e == "object")
    for (const [n, i] of Object.entries(e)) {
      const r = xa(n), o = ka(i);
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
function Gs() {
  var e;
  return (e = foundry == null ? void 0 : foundry.utils) != null && e.randomID ? foundry.utils.randomID() : typeof (crypto == null ? void 0 : crypto.randomUUID) == "function" ? crypto.randomUUID() : Math.random().toString(36).slice(2, 10);
}
s(Gs, "generateLightMappingId");
function xa(e) {
  if (typeof e != "string") return null;
  const t = e.trim();
  return t || null;
}
s(xa, "normalizeCategoryId");
function ka(e) {
  if (typeof e != "string") return null;
  const t = e.trim();
  return t || null;
}
s(ka, "normalizeCategoryValue");
const Pi = ["AmbientLight", "Wall", "AmbientSound"];
let Bi = /* @__PURE__ */ new WeakMap(), qi = /* @__PURE__ */ new WeakMap();
const Ra = 200;
function Kc(e) {
  return e ? Number.isInteger(e.size) ? e.size : Array.isArray(e) || typeof e.length == "number" ? e.length : Array.from(e).length : 0;
}
s(Kc, "getCollectionSize");
function Ur() {
  return typeof (performance == null ? void 0 : performance.now) == "function" ? performance.now() : Date.now();
}
s(Ur, "nowMs$1");
function Jc(e) {
  if (!Array.isArray(e)) return [];
  const t = /* @__PURE__ */ new Set();
  for (const n of e) {
    if (typeof n != "string") continue;
    const i = n.trim();
    i && t.add(i);
  }
  return Array.from(t);
}
s(Jc, "uniqueStringKeys");
function Yc(e, t = Ra) {
  if (!Array.isArray(e) || e.length === 0) return [];
  const n = Number.isInteger(t) && t > 0 ? t : Ra, i = [];
  for (let r = 0; r < e.length; r += n)
    i.push(e.slice(r, r + n));
  return i;
}
s(Yc, "chunkArray");
async function Qc(e, t, n, i) {
  const r = Yc(n, i);
  for (const o of r)
    await e.updateEmbeddedDocuments(t, o), r.length > 1 && await Promise.resolve();
  return r.length;
}
s(Qc, "updatePlaceablesInChunks");
function Xc(e) {
  const t = /* @__PURE__ */ new Set();
  for (const n of (e == null ? void 0 : e.rules) ?? [])
    for (const i of Object.keys((n == null ? void 0 : n.criteria) ?? {}))
      i && t.add(i);
  return Array.from(t);
}
s(Xc, "getPresetDependencyKeys");
function Zc(e, t) {
  const n = /* @__PURE__ */ new Map();
  for (const i of Pi) {
    const r = t.get(i) ?? [], o = /* @__PURE__ */ new Set(), a = /* @__PURE__ */ new Map();
    for (const l of r) {
      const c = Ks(l, i);
      if (c != null && c.base) {
        o.add(l.id);
        for (const u of Xc(c))
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
s(Zc, "buildPlaceableDependencyIndex");
function eu(e, t) {
  const n = qi.get(e);
  if (n && Pi.every((r) => n.collectionsByType.get(r) === t.get(r)))
    return n;
  const i = Zc(e, t);
  return qi.set(e, i), i;
}
s(eu, "getPlaceableDependencyIndex");
function tu(e, t, n) {
  if (!t || !e) return [];
  const i = Jc(n);
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
s(tu, "getDocsForChangedKeys");
function tn(e) {
  return !!e && typeof e == "object" && !Array.isArray(e);
}
s(tn, "isPlainObject");
function vo(e, t) {
  if (Object.is(e, t)) return !0;
  if (Array.isArray(e) || Array.isArray(t)) {
    if (!Array.isArray(e) || !Array.isArray(t) || e.length !== t.length) return !1;
    for (let n = 0; n < e.length; n += 1)
      if (!vo(e[n], t[n])) return !1;
    return !0;
  }
  if (tn(e) || tn(t)) {
    if (!tn(e) || !tn(t)) return !1;
    const n = Object.keys(t);
    for (const i of n)
      if (!vo(e[i], t[i])) return !1;
    return !0;
  }
  return !1;
}
s(vo, "areValuesEqual");
function Ws(e, t) {
  const n = { _id: t._id };
  for (const [r, o] of Object.entries(t)) {
    if (r === "_id") continue;
    const a = e == null ? void 0 : e[r];
    if (tn(o) && tn(a)) {
      const l = Ws(a, { _id: t._id, ...o });
      if (!l) continue;
      const c = Object.keys(l).filter((u) => u !== "_id");
      if (c.length > 0) {
        n[r] = {};
        for (const u of c)
          n[r][u] = l[u];
      }
      continue;
    }
    vo(a, o) || (n[r] = o);
  }
  return Object.keys(n).filter((r) => r !== "_id").length > 0 ? n : null;
}
s(Ws, "buildChangedPayload");
function Ks(e, t) {
  var l;
  const n = ((l = e == null ? void 0 : e.flags) == null ? void 0 : l[K]) ?? {}, i = (n == null ? void 0 : n.presets) ?? null, r = t === "AmbientLight" ? (n == null ? void 0 : n.lightCriteria) ?? null : null, o = Bi.get(e);
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
    const c = Gc(n.lightCriteria);
    (c.base && Object.keys(c.base).length > 0 || c.rules.length > 0) && (a = {
      base: c.base,
      rules: c.rules
    });
  }
  return Bi.set(e, {
    type: t,
    rawPresets: i,
    rawLightCriteria: r,
    presets: a
  }), a;
}
s(Ks, "getPresetsForDocument");
function nu(e = null, t = null) {
  e ? qi.delete(e) : qi = /* @__PURE__ */ new WeakMap(), t ? Bi.delete(t) : e || (Bi = /* @__PURE__ */ new WeakMap());
}
s(nu, "invalidatePlaceableCriteriaCaches");
async function Js(e, t, n = {}) {
  var c, u;
  const i = Ur(), r = {
    total: 0,
    scanned: 0,
    updated: 0,
    chunks: 0,
    byType: {},
    durationMs: 0
  };
  if (t = t ?? ((c = game.scenes) == null ? void 0 : c.viewed), !t)
    return r.durationMs = Ur() - i, r;
  const o = new Set(Vc()), a = new Map(
    Pi.map((d) => [d, t.getEmbeddedCollection(d) ?? []])
  ), l = eu(t, a);
  for (const d of Pi) {
    const g = a.get(d) ?? [], h = {
      total: Kc(g),
      scanned: 0,
      updated: 0,
      chunks: 0
    }, y = l.byType.get(d) ?? null, b = tu(g, y, n.changedKeys);
    if (h.scanned = b.length, r.total += h.total, r.scanned += h.scanned, r.byType[d] = h, !b.length) continue;
    const p = [];
    for (const T of b) {
      const E = Ks(T, d);
      if (!(E != null && E.base)) continue;
      const C = Hs(E.base, E.rules ?? [], e);
      C._id = T._id, d === "AmbientLight" && o.has(T._id) && (C.hidden = !0);
      const O = (T == null ? void 0 : T._source) ?? ((u = T == null ? void 0 : T.toObject) == null ? void 0 : u.call(T)) ?? {}, F = Ws(O, C);
      F && p.push(F);
    }
    p.length > 0 && (h.chunks = await Qc(t, d, p, n.chunkSize), h.updated = p.length, r.updated += p.length, r.chunks += h.chunks, console.log(`${K} | Updated ${p.length} ${d}(s)`));
  }
  return r.durationMs = Ur() - i, r;
}
s(Js, "updatePlaceables");
function Ui() {
  return typeof (performance == null ? void 0 : performance.now) == "function" ? performance.now() : Date.now();
}
s(Ui, "nowMs");
const si = /* @__PURE__ */ new Map();
function iu(e) {
  var t;
  return e = e ?? ((t = game.scenes) == null ? void 0 : t.viewed), e ? Qn(e) : null;
}
s(iu, "getState");
async function ru(e, t, n = 0) {
  var y;
  const i = Ui();
  if (t = t ?? ((y = game.scenes) == null ? void 0 : y.viewed), !t) return null;
  Sc(t);
  const r = ke(t);
  if (!r.length)
    return console.warn(`${K} | applyState skipped: scene has no criteria.`), null;
  const o = Qn(t, r), a = Yo({ ...o, ...e ?? {} }, r), l = r.filter((b) => (o == null ? void 0 : o[b.key]) !== (a == null ? void 0 : a[b.key])).map((b) => b.key), c = l.length > 0;
  c && await lc(t, a, r);
  const u = c ? a : o, [d, g] = await Promise.all([
    qs(u, t, { changedKeys: l }),
    Js(u, t, { changedKeys: l })
  ]), h = Ui() - i;
  return I("Criteria apply telemetry", {
    sceneId: t.id,
    changedKeys: l,
    didChange: c,
    queuedMs: n,
    durationMs: h,
    tiles: d,
    placeables: g
  }), Hooks.callAll("eidolon-utilities.criteriaStateApplied", t, u), u;
}
s(ru, "applyStateInternal");
async function Ys(e, t) {
  var c;
  if (t = t ?? ((c = game.scenes) == null ? void 0 : c.viewed), !t) return null;
  const n = t.id ?? "__viewed__", i = Ui(), r = si.get(n) ?? Promise.resolve();
  let o = null;
  const a = r.catch(() => null).then(async () => {
    const u = Ui() - i;
    return ru(e, t, u);
  });
  o = a;
  const l = a.finally(() => {
    si.get(n) === l && si.delete(n);
  });
  return si.set(n, l), o;
}
s(Ys, "applyState");
function ou(e) {
  var t;
  return e = e ?? ((t = game.scenes) == null ? void 0 : t.viewed), e ? ks(e) : null;
}
s(ou, "getVersion");
async function Qs(e, t) {
  var n;
  t = t ?? ((n = game.scenes) == null ? void 0 : n.viewed), t != null && t.setFlag && await t.setFlag(K, Fs, Number(e));
}
s(Qs, "setVersion");
async function au(e) {
  return Qs(xs, e);
}
s(au, "markCurrentVersion");
const In = "Standard", su = /* @__PURE__ */ s((...e) => console.log(`${K} | criteria indexer:`, ...e), "log");
function ea(e) {
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
s(ea, "parseFileTags");
function lu(e, t, n = In) {
  return e != null && e.length ? e.map((i) => {
    const r = ea(i == null ? void 0 : i.name);
    if (!r) return {};
    const o = {};
    for (const [a, l] of Object.entries(t)) {
      const c = r[Number(a)];
      c != null && c !== n && (o[l] = c);
    }
    return o;
  }) : [];
}
s(lu, "buildFileIndex");
function cu(e, t) {
  return e.map((n, i) => {
    const r = [...t[n] ?? /* @__PURE__ */ new Set()].sort(), a = r.includes(In) ? In : r[0] ?? In, l = Jo(n);
    return l.key = n, l.label = n.charAt(0).toUpperCase() + n.slice(1), l.values = r.length ? r : [In], l.default = l.values.includes(a) ? a : l.values[0], l.order = i, l;
  });
}
s(cu, "buildCriteriaDefinitions");
async function li(e, t, n, { dryRun: i = !1 } = {}) {
  const r = e.getFlag("monks-active-tiles", "files");
  if (!(r != null && r.length)) return null;
  const o = lu(r, t), a = Bs(o, { files: r });
  for (const l of r) {
    const c = ea(l == null ? void 0 : l.name);
    if (c)
      for (const [u, d] of Object.entries(t)) {
        const g = c[Number(u)];
        g != null && n[d] && n[d].add(g);
      }
  }
  return i || (await e.setFlag(K, Vt, a), typeof e.unsetFlag == "function" && await e.unsetFlag(K, Ut)), { files: r.length };
}
s(li, "indexTile");
async function uu(e, t = {}) {
  var C, O, F, _;
  const {
    dryRun: n = !1,
    force: i = !1
  } = t;
  if (e = e ?? ((C = game.scenes) == null ? void 0 : C.viewed), !e) throw new Error("No scene provided to indexScene.");
  if (!globalThis.Tagger) throw new Error("Tagger is required to index scene criteria.");
  if (!i && ks(e) >= xs)
    throw new Error(
      `Scene "${e.name}" is already criteria-indexed. Use force: true to re-index.`
    );
  const r = { sceneId: e.id }, o = Tagger.getByTag("Map", r) ?? [];
  if (!o.length) throw new Error("No Map tile found.");
  if (o.length > 1) throw new Error(`Expected 1 Map tile, found ${o.length}.`);
  const a = o[0], l = a.getFlag("monks-active-tiles", "files");
  if (!(l != null && l.length)) throw new Error("Map tile has no MATT files.");
  const c = ea((O = l[0]) == null ? void 0 : O.name);
  if (!(c != null && c.length))
    throw new Error(`Cannot parse bracket tags from: ${((F = l[0]) == null ? void 0 : F.name) ?? "<unknown>"}`);
  if (c.length < 3)
    throw new Error(`Expected 3+ bracket tags, found ${c.length}.`);
  const u = Tagger.getByTag("Floor", r) ?? [], d = Tagger.getByTag("Roof", r) ?? [], g = Tagger.getByTag("Weather", r) ?? [];
  let h;
  const y = [];
  c.length >= 4 ? (h = { 0: "mood", 1: "stage", 2: "variant", 3: "effect" }, y.push("mood", "stage", "variant", "effect")) : (h = { 0: "mood", 1: "variant", 2: "effect" }, y.push("mood", "variant", "effect"));
  const b = { 1: "effect" }, p = {};
  for (const D of y)
    p[D] = /* @__PURE__ */ new Set();
  const T = {
    map: null,
    floor: [],
    roof: [],
    weather: []
  };
  T.map = await li(a, h, p, { dryRun: n });
  for (const D of u) {
    const R = await li(D, h, p, { dryRun: n });
    R && T.floor.push(R);
  }
  for (const D of d) {
    const R = await li(D, h, p, { dryRun: n });
    R && T.roof.push(R);
  }
  for (const D of g) {
    const R = await li(D, b, p, { dryRun: n });
    R && T.weather.push(R);
  }
  const E = cu(y, p);
  return n || (await Sr(e, E), await au(e)), su(
    n ? "Dry run complete" : "Indexing complete",
    `- ${E.length} criteria,`,
    `${((_ = T.map) == null ? void 0 : _.files) ?? 0} map files`
  ), {
    criteria: E,
    state: E.reduce((D, R) => (D[R.key] = R.default, D), {}),
    tiles: T,
    overlayMode: g.length > 0
  };
}
s(uu, "indexScene");
var Wa, Te, Fe, xe, Bt, Oe, Ke, yt, Tr, ne, Xs, Zs, el, Ao, tl, No, nl, Sn, _o;
const $e = class $e extends Yn(Jn) {
  constructor(n = {}) {
    var i;
    super(n);
    M(this, ne);
    M(this, Te, null);
    M(this, Fe, []);
    M(this, xe, {});
    M(this, Bt, !1);
    M(this, Oe, null);
    M(this, Ke, null);
    M(this, yt, null);
    M(this, Tr, 120);
    this.setScene(n.scene ?? ((i = game.scenes) == null ? void 0 : i.viewed) ?? null);
  }
  setScene(n) {
    var i;
    v(this, Te, n ?? ((i = game.scenes) == null ? void 0 : i.viewed) ?? null), L(this, ne, Xs).call(this);
  }
  get scene() {
    return m(this, Te);
  }
  async _prepareContext() {
    var r;
    const n = !!m(this, Te), i = n && m(this, Fe).length > 0;
    return {
      hasScene: n,
      hasCriteria: i,
      sceneName: ((r = m(this, Te)) == null ? void 0 : r.name) ?? f("EIDOLON.CriteriaSwitcher.NoScene", "No active scene"),
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
      criteria: m(this, Fe).map((o) => ({
        key: o.key,
        label: o.label || o.key,
        values: o.values.map((a) => {
          var l;
          return {
            value: a,
            selected: ((l = m(this, xe)) == null ? void 0 : l[o.key]) === a
          };
        }),
        defaultValue: o.default
      })),
      stateSummary: L(this, ne, _o).call(this)
    };
  }
  _onRender(n, i) {
    super._onRender(n, i), L(this, ne, Zs).call(this), L(this, ne, el).call(this);
  }
  async _onClose(n) {
    return m(this, Oe) !== null && (clearTimeout(m(this, Oe)), v(this, Oe, null)), m(this, yt) !== null && (Hooks.off("eidolon-utilities.criteriaStateApplied", m(this, yt)), v(this, yt, null)), super._onClose(n);
  }
};
Te = new WeakMap(), Fe = new WeakMap(), xe = new WeakMap(), Bt = new WeakMap(), Oe = new WeakMap(), Ke = new WeakMap(), yt = new WeakMap(), Tr = new WeakMap(), ne = new WeakSet(), Xs = /* @__PURE__ */ s(function() {
  if (!m(this, Te)) {
    v(this, Fe, []), v(this, xe, {});
    return;
  }
  v(this, Fe, ke(m(this, Te)).sort((n, i) => n.order - i.order)), v(this, xe, Qn(m(this, Te), m(this, Fe)));
}, "#hydrateFromScene"), Zs = /* @__PURE__ */ s(function() {
  var i, r;
  const n = this.element;
  n instanceof HTMLElement && (n.querySelectorAll("[data-criteria-key]").forEach((o) => {
    o.addEventListener("change", (a) => {
      const l = a.currentTarget;
      if (!(l instanceof HTMLSelectElement)) return;
      const c = l.dataset.criteriaKey;
      c && (v(this, xe, {
        ...m(this, xe),
        [c]: l.value
      }), L(this, ne, tl).call(this, { [c]: l.value }));
    });
  }), (i = n.querySelector("[data-action='reset-defaults']")) == null || i.addEventListener("click", () => {
    L(this, ne, nl).call(this);
  }), (r = n.querySelector("[data-action='close-switcher']")) == null || r.addEventListener("click", () => {
    this.close();
  }));
}, "#bindEvents"), el = /* @__PURE__ */ s(function() {
  m(this, yt) === null && v(this, yt, Hooks.on("eidolon-utilities.criteriaStateApplied", (n, i) => {
    !m(this, Te) || (n == null ? void 0 : n.id) !== m(this, Te).id || m(this, Bt) || (v(this, xe, { ...i ?? {} }), this.render({ force: !0 }));
  }));
}, "#ensureSyncHook"), Ao = /* @__PURE__ */ s(async function(n) {
  var i, r;
  if (m(this, Te)) {
    L(this, ne, Sn).call(this, "applying"), v(this, Bt, !0);
    try {
      const o = await Ys(n, m(this, Te));
      o && v(this, xe, o), L(this, ne, Sn).call(this, "ready"), this.render({ force: !0 });
    } catch (o) {
      console.error(`${K} | Failed to apply criteria state`, o), (r = (i = ui.notifications) == null ? void 0 : i.error) == null || r.call(
        i,
        f(
          "EIDOLON.CriteriaSwitcher.ApplyError",
          "Failed to apply the selected criteria state."
        )
      ), L(this, ne, Sn).call(this, "error", (o == null ? void 0 : o.message) ?? "Unknown error");
    } finally {
      v(this, Bt, !1), m(this, Ke) && L(this, ne, No).call(this);
    }
  }
}, "#applyPartialState"), tl = /* @__PURE__ */ s(function(n) {
  v(this, Ke, {
    ...m(this, Ke) ?? {},
    ...n ?? {}
  }), m(this, Oe) !== null && clearTimeout(m(this, Oe)), L(this, ne, Sn).call(this, "applying"), v(this, Oe, setTimeout(() => {
    v(this, Oe, null), L(this, ne, No).call(this);
  }, m(this, Tr)));
}, "#queuePartialState"), No = /* @__PURE__ */ s(async function() {
  if (m(this, Bt) || !m(this, Ke)) return;
  const n = m(this, Ke);
  v(this, Ke, null), await L(this, ne, Ao).call(this, n);
}, "#flushPendingState"), nl = /* @__PURE__ */ s(async function() {
  if (!m(this, Fe).length) return;
  const n = m(this, Fe).reduce((i, r) => (i[r.key] = r.default, i), {});
  v(this, xe, n), m(this, Oe) !== null && (clearTimeout(m(this, Oe)), v(this, Oe, null)), v(this, Ke, null), await L(this, ne, Ao).call(this, n);
}, "#resetToDefaults"), Sn = /* @__PURE__ */ s(function(n, i = "") {
  const r = this.element;
  if (!(r instanceof HTMLElement)) return;
  const o = r.querySelector("[data-role='status']");
  if (o instanceof HTMLElement)
    switch (o.dataset.mode = n, n) {
      case "applying":
        o.textContent = f("EIDOLON.CriteriaSwitcher.Applying", "Applying changes...");
        break;
      case "error":
        o.textContent = `${f("EIDOLON.CriteriaSwitcher.Error", "Error")}: ${i}`;
        break;
      case "ready":
      default:
        o.textContent = `${f("EIDOLON.CriteriaSwitcher.Ready", "Ready")}: ${L(this, ne, _o).call(this)}`;
        break;
    }
}, "#setStatus"), _o = /* @__PURE__ */ s(function() {
  return m(this, Fe).length ? `[${m(this, Fe).map((n) => {
    var i;
    return ((i = m(this, xe)) == null ? void 0 : i[n.key]) ?? n.default;
  }).join(" | ")}]` : "-";
}, "#formatStateSummary"), s($e, "CriteriaSwitcherApplication"), je($e, "APP_ID", `${K}-criteria-switcher`), je($e, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  ft($e, $e, "DEFAULT_OPTIONS"),
  {
    id: $e.APP_ID,
    classes: Array.from(
      /* @__PURE__ */ new Set([...((Wa = ft($e, $e, "DEFAULT_OPTIONS")) == null ? void 0 : Wa.classes) ?? [], "eidolon-criteria-switcher-window", "themed"])
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
)), je($e, "PARTS", {
  content: {
    template: `modules/${K}/templates/criteria-switcher.html`
  }
});
let Mo = $e;
const du = Lr(Mo);
let zt = null;
function fu(e) {
  var t;
  return e ?? ((t = game.scenes) == null ? void 0 : t.viewed) ?? null;
}
s(fu, "resolveScene");
function gu(e) {
  var t;
  return !!(e != null && e.rendered && ((t = e == null ? void 0 : e.element) != null && t.isConnected));
}
s(gu, "isRendered");
function Mr() {
  return gu(zt) ? zt : (zt = null, null);
}
s(Mr, "getCriteriaSwitcher");
function il(e) {
  var i, r, o, a, l;
  const t = fu(e);
  if (!t)
    return (r = (i = ui.notifications) == null ? void 0 : i.warn) == null || r.call(i, "No active scene to open the criteria switcher."), null;
  if (!wr(t))
    return (a = (o = ui.notifications) == null ? void 0 : o.warn) == null || a.call(o, "You do not have permission to manage scene criteria."), null;
  const n = Mr();
  return n ? (n.setScene(t), n.render({ force: !0 }), (l = n.bringToFront) == null || l.call(n), n) : (zt = du({ scene: t }), zt.render({ force: !0 }), zt);
}
s(il, "openCriteriaSwitcher");
function rl() {
  const e = Mr();
  e && (e.close(), zt = null);
}
s(rl, "closeCriteriaSwitcher");
function ta(e) {
  return Mr() ? (rl(), null) : il(e);
}
s(ta, "toggleCriteriaSwitcher");
const mu = {
  SCHEMA_VERSION: Qo,
  applyState: Ys,
  getState: iu,
  getVersion: ou,
  setVersion: Qs,
  getCriteria(e) {
    var t;
    return ke(e ?? ((t = game.scenes) == null ? void 0 : t.viewed));
  },
  setCriteria(e, t) {
    var n;
    return Sr(t ?? ((n = game.scenes) == null ? void 0 : n.viewed), e);
  },
  updateTiles: qs,
  updatePlaceables: Js,
  indexScene: uu,
  openCriteriaSwitcher: il,
  closeCriteriaSwitcher: rl,
  toggleCriteriaSwitcher: ta,
  findBestMatch: Tc,
  findFileIndex: Ec,
  resolveRules: Hs
};
function ol(e) {
  var t;
  return ((t = e == null ? void 0 : e.getFlag) == null ? void 0 : t.call(e, "monks-active-tiles", "files")) ?? [];
}
s(ol, "getTileFiles$1");
function hu(e = []) {
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
s(hu, "createDefaultTileCriteria");
function pu(e, t = {}) {
  var a, l;
  const { allowLegacy: n = !0 } = t, i = ol(e), r = (a = e == null ? void 0 : e.getFlag) == null ? void 0 : a.call(e, K, Vt);
  if (r) return Kt(r, { files: i });
  if (!n) return null;
  const o = (l = e == null ? void 0 : e.getFlag) == null ? void 0 : l.call(e, K, Ut);
  return o ? Kt(o, { files: i }) : null;
}
s(pu, "getTileCriteria");
async function Ha(e, t, n = {}) {
  if (!(e != null && e.setFlag)) return null;
  const {
    strictValidation: i = !0
  } = n, r = ol(e), o = Kt(t, { files: r });
  if (!o)
    return typeof e.unsetFlag == "function" ? (await e.unsetFlag(K, Vt), await e.unsetFlag(K, Ut)) : (await e.setFlag(K, Vt, null), await e.setFlag(K, Ut, null)), null;
  if (i) {
    const a = Ps(o, { files: r });
    if (a.errors.length > 0)
      throw new Error(
        `Tile criteria contains ${a.errors.length} conflicting rule pair(s). Resolve clashes before saving.`
      );
  }
  return await e.setFlag(K, Vt, o), typeof e.unsetFlag == "function" && await e.unsetFlag(K, Ut), o;
}
s(Ha, "setTileCriteria");
const Do = "__eidolon_any__", at = "eidolon-tile-criteria", yu = "fa-solid fa-sliders", al = Symbol.for("eidolon.tileCriteriaUiState"), Ar = ["all", "unmapped", "mapped", "conflicts"];
function bu(e) {
  const t = e == null ? void 0 : e[al];
  return !t || typeof t != "object" ? {
    filterQuery: "",
    filterMode: "all",
    selectedFileIndex: null
  } : {
    filterQuery: typeof t.filterQuery == "string" ? t.filterQuery : "",
    filterMode: Ar.includes(t.filterMode) ? t.filterMode : "all",
    selectedFileIndex: Number.isInteger(t.selectedFileIndex) ? t.selectedFileIndex : null
  };
}
s(bu, "readUiState");
function Tu(e, t) {
  if (!e || !t) return;
  typeof t.filterQuery == "string" && (e.filterQuery = t.filterQuery), Ar.includes(t.filterMode) && (e.filterMode = t.filterMode), Number.isInteger(t.selectedFileIndex) && e.fileEntries.some((i) => i.index === t.selectedFileIndex) && (e.selectedFileIndex = t.selectedFileIndex);
}
s(Tu, "applyUiState");
function Eu(e) {
  const t = e == null ? void 0 : e.app, n = e == null ? void 0 : e.state;
  !t || !n || (t[al] = {
    filterQuery: typeof n.filterQuery == "string" ? n.filterQuery : "",
    filterMode: Ar.includes(n.filterMode) ? n.filterMode : "all",
    selectedFileIndex: Number.isInteger(n.selectedFileIndex) ? n.selectedFileIndex : null
  });
}
s(Eu, "persistUiState");
function Cu(e) {
  const t = (e == null ? void 0 : e.object) ?? (e == null ? void 0 : e.document) ?? null;
  return !(t != null && t.isEmbedded) || t.documentName !== "Tile" ? null : t;
}
s(Cu, "getTileDocument");
function Lu(e) {
  var t;
  return ((t = e == null ? void 0 : e.getFlag) == null ? void 0 : t.call(e, "monks-active-tiles", "files")) ?? [];
}
s(Lu, "getTileFiles");
function Iu(e, t) {
  var l;
  const n = (e == null ? void 0 : e.parent) ?? ((l = game.scenes) == null ? void 0 : l.viewed) ?? null, r = ke(n).sort((c, u) => c.order - u.order).map((c) => ({
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
s(Iu, "getCriteriaDefinitions");
function Su(e) {
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
s(Su, "buildTree");
function wu(e, t) {
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
s(wu, "collapseFolderBranch");
function Ou(e, t) {
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
s(Ou, "getRuleSummariesForFile");
function Fo(e) {
  var y, b;
  const t = Lu(e), n = Xo(t), i = pu(e, { allowLegacy: !0 }) ?? hu(t), r = Iu(e, i), o = new Map(r.map((p) => [p.key, p.label])), a = new Map(
    n.map((p) => [
      p.index,
      p.path || p.label
    ])
  ), l = An(i.defaultTarget, t), c = ((y = n[0]) == null ? void 0 : y.index) ?? 0, u = l >= 0 ? l : c, d = new Map(n.map((p) => [p.index, []]));
  let g = 1;
  for (const p of i.variants ?? []) {
    const T = An(p.target, t);
    T < 0 || (d.has(T) || d.set(T, []), d.get(T).push({
      id: g,
      criteria: { ...p.criteria ?? {} }
    }), g += 1);
  }
  const h = n.some((p) => p.index === u) ? u : ((b = n[0]) == null ? void 0 : b.index) ?? null;
  return {
    files: t,
    fileEntries: n,
    criteriaDefinitions: r,
    criteriaLabels: o,
    relativePaths: a,
    defaultIndex: u,
    selectedFileIndex: h,
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
s(Fo, "buildEditorState");
function xo(e, t) {
  return e.rulesByFile.has(t) || e.rulesByFile.set(t, []), e.rulesByFile.get(t);
}
s(xo, "getRulesForFile");
function vu(e) {
  return Object.fromEntries(
    Object.entries(e ?? {}).filter(([t, n]) => typeof t == "string" && t && typeof n == "string" && n.trim()).map(([t, n]) => [t, n.trim()])
  );
}
s(vu, "sanitizeRuleCriteria");
function sl(e) {
  const t = St(e.files, e.defaultIndex);
  if (!t) return null;
  const n = [], i = [];
  for (const [o, a] of e.rulesByFile.entries()) {
    const l = St(e.files, o);
    if (l)
      for (const [c, u] of a.entries()) {
        const d = vu(u.criteria);
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
s(sl, "buildTileCriteriaDraft");
function Mu(e) {
  var t;
  return ((t = sl(e)) == null ? void 0 : t.normalized) ?? null;
}
s(Mu, "exportTileCriteria");
function $a(e) {
  const t = sl(e);
  if (!(t != null && t.normalized))
    return {
      errors: [],
      warnings: [],
      errorFileIndexes: [],
      warningFileIndexes: []
    };
  const n = Ps(t.normalized, { files: e.files }), i = /* @__PURE__ */ s((l) => {
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
s($a, "analyzeRuleConflicts");
function ci(e, t = "neutral") {
  const n = document.createElement("span");
  return n.classList.add("eidolon-tile-criteria__badge"), n.dataset.kind = t, n.textContent = e, n;
}
s(ci, "createBadge");
function Au(e, t = {}) {
  const n = typeof e == "string" ? e : "", {
    maxLength: i = 42,
    headLength: r = 20,
    tailLength: o = 16
  } = t;
  if (!n || n.length <= i) return n;
  const a = n.slice(0, r).trimEnd(), l = n.slice(-o).trimStart();
  return `${a}...${l}`;
}
s(Au, "middleEllipsis");
function Nu(e) {
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
      error: (r == null ? void 0 : r.message) ?? f("EIDOLON.TileCriteria.InvalidRegex", "Invalid regex."),
      matches: /* @__PURE__ */ s(() => !0, "matches")
    };
  }
}
s(Nu, "createRegexFilter");
function _u(e, t) {
  const n = document.createElement("select");
  n.dataset.criteriaKey = e.key;
  const i = document.createElement("option");
  i.value = Do, i.textContent = "*", n.appendChild(i);
  const r = new Set(e.values ?? []);
  t && !r.has(t) && r.add(t);
  for (const o of r) {
    const a = document.createElement("option");
    a.value = o, a.textContent = o, n.appendChild(a);
  }
  return n.value = t ?? Do, n;
}
s(_u, "createCriterionSelect");
function Du(e, t, n, i) {
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
    const g = _u(c, (l = e.criteria) == null ? void 0 : l[c.key]);
    g.addEventListener("change", () => {
      g.value === Do ? delete e.criteria[c.key] : e.criteria[c.key] = g.value, i();
    }), u.appendChild(g), o.appendChild(u);
  }
  r.appendChild(o);
  const a = document.createElement("button");
  return a.type = "button", a.classList.add("control", "ui-control", "eidolon-tile-criteria__rule-remove"), a.textContent = f("EIDOLON.TileCriteria.RemoveRule", "Remove"), a.addEventListener("click", () => {
    const u = xo(t, n).filter((d) => d.id !== e.id);
    t.rulesByFile.set(n, u), i();
  }), r.appendChild(a), r;
}
s(Du, "renderRuleEditor");
const Li = /* @__PURE__ */ new WeakMap();
function ll(e) {
  return (e == null ? void 0 : e.app) ?? (e == null ? void 0 : e.tile) ?? null;
}
s(ll, "getDialogOwner");
function Fu(e) {
  for (const t of e) {
    const n = st(t);
    if (n) return n;
    const i = st(t == null ? void 0 : t.element);
    if (i) return i;
  }
  return null;
}
s(Fu, "findDialogRoot$1");
function xu(e, t, n) {
  const i = e.state, r = i.fileEntries.find((p) => p.index === t);
  if (!r) return document.createElement("div");
  const o = document.createElement("section");
  o.classList.add("eidolon-tile-criteria__dialog-content");
  const a = document.createElement("header");
  a.classList.add("eidolon-tile-criteria__editor-header");
  const l = document.createElement("h4");
  l.textContent = i.relativePaths.get(r.index) || r.label, a.appendChild(l);
  const c = document.createElement("p");
  c.classList.add("notes"), c.textContent = `#${r.index + 1} · ${r.path || f("EIDOLON.TileCriteria.UnknownPath", "Unknown path")}`, a.appendChild(c), o.appendChild(a);
  const u = document.createElement("div");
  u.classList.add("eidolon-tile-criteria__editor-controls");
  const d = document.createElement("button");
  d.type = "button", d.classList.add("control", "ui-control", "eidolon-tile-criteria__editor-action"), i.defaultIndex === r.index ? (d.textContent = f("EIDOLON.TileCriteria.IsDefault", "Default Target"), d.disabled = !0) : (d.textContent = f("EIDOLON.TileCriteria.SetDefault", "Set As Default"), d.addEventListener("click", () => {
    i.defaultIndex = r.index, Ce(e), n();
  })), u.appendChild(d);
  const g = document.createElement("button");
  g.type = "button", g.classList.add("control", "ui-control", "eidolon-tile-criteria__editor-action", "secondary"), g.textContent = f("EIDOLON.TileCriteria.ClearFileRules", "Clear File Rules"), g.addEventListener("click", () => {
    i.rulesByFile.set(r.index, []), Ce(e), n();
  }), u.appendChild(g), o.appendChild(u);
  const h = document.createElement("div");
  h.classList.add("eidolon-tile-criteria__rule-editors");
  const y = xo(i, r.index);
  if (y.length)
    for (const p of y)
      h.appendChild(
        Du(p, i, r.index, () => {
          Ce(e), n();
        })
      );
  else {
    const p = document.createElement("p");
    p.classList.add("notes"), p.textContent = f(
      "EIDOLON.TileCriteria.NoRulesForFile",
      "No rules map to this file yet. Add one to define when this variant should be active."
    ), h.appendChild(p);
  }
  o.appendChild(h);
  const b = document.createElement("button");
  return b.type = "button", b.classList.add("control", "ui-control", "eidolon-tile-criteria__editor-action"), b.textContent = f("EIDOLON.TileCriteria.AddRule", "Add Rule"), b.disabled = !i.criteriaDefinitions.length, b.addEventListener("click", () => {
    xo(i, r.index).push({
      id: i.nextRuleId,
      criteria: {}
    }), i.nextRuleId += 1, Ce(e), n();
  }), o.appendChild(b), o;
}
s(xu, "buildRuleEditorContent");
function ku(e, t) {
  var g, h, y;
  const n = ll(e);
  if (!n) return;
  const i = Li.get(n);
  if (i) {
    i.controller = e, i.fileIndex = t, (g = i.refresh) == null || g.call(i);
    return;
  }
  const r = {
    controller: e,
    fileIndex: t,
    host: null,
    refresh: null
  };
  Li.set(n, r);
  const o = /* @__PURE__ */ s(() => {
    Li.delete(n);
  }, "closeDialog"), a = /* @__PURE__ */ s(() => {
    r.host instanceof HTMLElement && r.host.replaceChildren(
      xu(r.controller, r.fileIndex, a)
    );
  }, "refreshDialog");
  r.refresh = a;
  const l = f("EIDOLON.TileCriteria.EditorTitle", "Edit Tile Criteria Rules"), c = '<div class="eidolon-tile-criteria-editor-host"></div>', u = f("EIDOLON.TileCriteria.CloseEditor", "Close"), d = (y = (h = foundry == null ? void 0 : foundry.applications) == null ? void 0 : h.api) == null ? void 0 : y.DialogV2;
  if (typeof (d == null ? void 0 : d.wait) == "function") {
    d.wait({
      window: { title: l },
      content: c,
      buttons: [{ action: "close", label: u, default: !0 }],
      render: /* @__PURE__ */ s((...b) => {
        var E;
        const p = Fu(b), T = (E = p == null ? void 0 : p.querySelector) == null ? void 0 : E.call(p, ".eidolon-tile-criteria-editor-host");
        T instanceof HTMLElement && (r.host = T, a());
      }, "render"),
      close: o,
      rejectClose: !1
    }).catch((b) => {
      console.warn(`${K} | Rule editor dialog failed`, b), o();
    });
    return;
  }
  o();
}
s(ku, "openRuleEditorDialog");
function Pa(e) {
  var i;
  const t = ll(e);
  if (!t) return;
  const n = Li.get(t);
  (i = n == null ? void 0 : n.refresh) == null || i.call(n);
}
s(Pa, "refreshOpenRuleEditor");
function ko(e, t) {
  return (e.rulesByFile.get(t) ?? []).length > 0;
}
s(ko, "hasRulesForFile");
function cl(e, t) {
  var n, i;
  return ((n = e == null ? void 0 : e.errorFileIndexes) == null ? void 0 : n.includes(t)) || ((i = e == null ? void 0 : e.warningFileIndexes) == null ? void 0 : i.includes(t));
}
s(cl, "hasConflictForFile");
function Ru(e, t, n) {
  switch (e.filterMode) {
    case "unmapped":
      return !ko(e, t.index);
    case "mapped":
      return ko(e, t.index);
    case "conflicts":
      return cl(n, t.index);
    case "all":
    default:
      return !0;
  }
}
s(Ru, "matchesFilterMode");
function Hu(e, t) {
  let n = 0, i = 0, r = 0;
  for (const o of e.fileEntries)
    ko(e, o.index) ? n += 1 : i += 1, cl(t, o.index) && (r += 1);
  return {
    all: e.fileEntries.length,
    mapped: n,
    unmapped: i,
    conflicts: r
  };
}
s(Hu, "getFilterModeCounts");
function $u(e) {
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
s($u, "getFilterModeLabel");
function ul(e, t, n, i, r) {
  var u, d;
  const o = [...e.folders.keys()].sort((g, h) => g.localeCompare(h));
  for (const g of o) {
    const h = wu(g, e.folders.get(g)), y = document.createElement("li");
    y.classList.add("eidolon-tile-criteria__tree-branch");
    const b = document.createElement("div");
    b.classList.add("document", "folder", "update", "eidolon-tile-criteria__folder-row");
    const p = document.createElement("i");
    p.classList.add("fa-solid", "fa-folder-open"), b.appendChild(p);
    const T = document.createElement("span");
    T.classList.add("eidolon-tile-criteria__tree-folder-label"), T.textContent = h.label, T.title = h.label, b.appendChild(T), y.appendChild(b);
    const E = document.createElement("ul");
    E.classList.add("eidolon-tile-criteria__tree"), E.dataset.folder = h.label, ul(h.node, t, n, i, E), E.childElementCount > 0 && y.appendChild(E), r.appendChild(y);
  }
  const a = [...e.files].sort((g, h) => g.name.localeCompare(h.name));
  if (!a.length) return;
  const l = document.createElement("li"), c = document.createElement("ul");
  c.classList.add("document-list", "eidolon-tile-criteria__document-list");
  for (const g of a) {
    const h = g.entry, y = h.index === t.selectedFileIndex, b = h.index === t.defaultIndex, p = Ou(t, h.index), T = document.createElement("li");
    T.classList.add("document", "update", "eidolon-tile-criteria__tree-file");
    const E = document.createElement("button");
    E.type = "button", E.classList.add("eidolon-tile-criteria__file-row");
    const C = (u = i == null ? void 0 : i.errorFileIndexes) == null ? void 0 : u.includes(h.index), O = (d = i == null ? void 0 : i.warningFileIndexes) == null ? void 0 : d.includes(h.index);
    C ? E.classList.add("has-conflict") : O && E.classList.add("has-warning");
    const F = t.relativePaths.get(h.index) || h.path || g.name, _ = [F];
    C ? _.push(
      f(
        "EIDOLON.TileCriteria.ConflictFileHint",
        "This file participates in one or more conflicting rules."
      )
    ) : O && _.push(
      f(
        "EIDOLON.TileCriteria.WarningFileHint",
        "This file has potentially redundant rules."
      )
    ), p.length || _.push(
      f(
        "EIDOLON.TileCriteria.UnmappedHint",
        "No criteria rules map to this file."
      )
    ), E.title = _.join(`
`), y && E.classList.add("is-selected"), E.addEventListener("click", () => {
      t.selectedFileIndex = h.index, Ce(n), ku(n, h.index);
    });
    const D = document.createElement("span");
    D.classList.add("eidolon-tile-criteria__indicator"), D.dataset.kind = b ? "default" : p.length ? "mapped" : "unmapped", E.appendChild(D);
    const R = document.createElement("span");
    R.classList.add("eidolon-tile-criteria__file-content");
    const Y = document.createElement("span");
    Y.classList.add("eidolon-tile-criteria__file-heading");
    const ie = document.createElement("span");
    ie.classList.add("eidolon-tile-criteria__file-title"), ie.textContent = Au(g.name || h.label), ie.title = F, Y.appendChild(ie);
    const $ = ci(`#${h.index + 1}`, "meta");
    $.classList.add("eidolon-tile-criteria__index-badge"), Y.appendChild($), R.appendChild(Y);
    const Q = document.createElement("span");
    Q.classList.add("eidolon-tile-criteria__badges"), b && Q.appendChild(ci(f("EIDOLON.TileCriteria.DefaultBadge", "Default"), "default"));
    const A = p.slice(0, 2);
    for (const U of A)
      Q.appendChild(ci(U, "rule"));
    if (p.length > A.length && Q.appendChild(ci(`+${p.length - A.length}`, "meta")), R.appendChild(Q), E.appendChild(R), C || O) {
      const U = document.createElement("span");
      U.classList.add("eidolon-tile-criteria__row-warning"), U.dataset.mode = C ? "error" : "warning", U.innerHTML = '<i class="fa-solid fa-triangle-exclamation" inert=""></i>', E.appendChild(U);
    }
    T.appendChild(E), c.appendChild(T);
  }
  l.appendChild(c), r.appendChild(l);
}
s(ul, "renderTreeNode");
function Pu(e, t, n, i = {}) {
  const r = document.createElement("section");
  r.classList.add("eidolon-tile-criteria__tree-panel");
  const o = Nu(e.filterQuery), a = Hu(e, n);
  e.filterMode !== "all" && a[e.filterMode] === 0 && (e.filterMode = "all");
  const l = document.createElement("div");
  l.classList.add("eidolon-tile-criteria__toolbar");
  const c = document.createElement("div");
  c.classList.add("eidolon-tile-criteria__mode-bar");
  for (const C of Ar) {
    const O = document.createElement("button");
    O.type = "button", O.classList.add("control", "ui-control", "eidolon-tile-criteria__mode-button"), O.dataset.mode = C, O.textContent = $u(C);
    const F = C === "all" || a[C] > 0;
    O.disabled = !F, F || (O.dataset.tooltip = f(
      "EIDOLON.TileCriteria.FilterModeUnavailable",
      "No entries currently match this filter."
    ), O.title = O.dataset.tooltip), e.filterMode === C ? (O.classList.add("is-active"), O.setAttribute("aria-pressed", "true")) : O.setAttribute("aria-pressed", "false"), O.addEventListener("click", () => {
      e.filterMode !== C && (e.filterMode = C, Ce(t));
    }), c.appendChild(O);
  }
  l.appendChild(c);
  const u = document.createElement("div");
  u.classList.add("eidolon-tile-criteria__filter-row");
  const d = document.createElement("input");
  d.type = "text", d.classList.add("eidolon-tile-criteria__filter-input"), d.placeholder = f("EIDOLON.TileCriteria.FilterPlaceholder", "Regex filter (path)"), d.value = e.filterQuery, d.autocomplete = "off", d.addEventListener("keydown", (C) => {
    C.stopPropagation(), C.key === "Enter" && C.preventDefault();
  }), d.addEventListener("keyup", (C) => {
    C.stopPropagation();
  }), d.addEventListener("change", (C) => {
    C.stopPropagation();
  }), d.addEventListener("input", (C) => {
    C.stopPropagation();
    const O = d.selectionStart ?? d.value.length, F = d.selectionEnd ?? O;
    e.filterQuery = d.value, Ce(t), requestAnimationFrame(() => {
      const _ = t.section.querySelector(".eidolon-tile-criteria__filter-input");
      if (_ instanceof HTMLInputElement) {
        _.focus();
        try {
          _.setSelectionRange(O, F);
        } catch {
        }
      }
    });
  }), u.appendChild(d);
  const g = document.createElement("div");
  g.classList.add("eidolon-tile-criteria__toolbar-actions");
  const h = document.createElement("button");
  h.type = "button";
  const y = f("EIDOLON.TileCriteria.Save", "Save Rules");
  h.classList.add("control", "ui-control", "eidolon-tile-criteria__toolbar-action", "icon-only"), h.dataset.tooltip = y, h.setAttribute("aria-label", y), h.title = y, h.innerHTML = '<i class="fa-solid fa-floppy-disk" inert=""></i>', h.disabled = n.errors.length > 0, h.addEventListener("click", () => {
    var C;
    (C = i.onSave) == null || C.call(i);
  }), g.appendChild(h);
  const b = document.createElement("button");
  b.type = "button";
  const p = f("EIDOLON.TileCriteria.Clear", "Clear Rules");
  if (b.classList.add("control", "ui-control", "secondary", "eidolon-tile-criteria__toolbar-action", "icon-only"), b.dataset.tooltip = p, b.setAttribute("aria-label", p), b.title = p, b.innerHTML = '<i class="fa-solid fa-trash" inert=""></i>', b.addEventListener("click", () => {
    var C;
    (C = i.onClear) == null || C.call(i);
  }), g.appendChild(b), u.appendChild(g), l.appendChild(u), r.appendChild(l), o.error) {
    const C = document.createElement("p");
    C.classList.add("notes", "eidolon-tile-criteria__filter-error"), C.textContent = `${f("EIDOLON.TileCriteria.InvalidRegex", "Invalid regex")}: ${o.error}`, r.appendChild(C);
  }
  const T = document.createElement("div");
  T.classList.add("eidolon-tile-criteria__library-tree");
  const E = e.fileEntries.filter((C) => {
    const O = e.relativePaths.get(C.index) || C.path || C.label;
    return Ru(e, C, n) && o.matches(O);
  });
  if (e.fileEntries.length)
    if (E.length) {
      const C = document.createElement("ul");
      C.classList.add("eidolon-tile-criteria__tree"), ul(Su(E), e, t, n, C), T.appendChild(C);
    } else {
      const C = document.createElement("p");
      C.classList.add("notes"), C.textContent = f("EIDOLON.TileCriteria.NoMatches", "No variants match this filter."), T.appendChild(C);
    }
  else {
    const C = document.createElement("p");
    C.classList.add("notes"), C.textContent = f("EIDOLON.TileCriteria.NoVariants", "No MATT variants found"), T.appendChild(C);
  }
  return r.appendChild(T), r;
}
s(Pu, "renderTreePanel");
function Ce(e) {
  const { section: t, state: n } = e, i = $a(n);
  Eu(e), t.replaceChildren();
  const r = /* @__PURE__ */ s(async () => {
    try {
      const a = $a(n);
      if (a.errors.length) {
        n.status = {
          mode: "error",
          message: f(
            "EIDOLON.TileCriteria.ConflictSaveBlocked",
            `Resolve ${a.errors.length} conflict(s) before saving tile criteria rules.`
          )
        }, Ce(e);
        return;
      }
      const l = Mu(n);
      if (!l) {
        n.status = {
          mode: "error",
          message: f("EIDOLON.TileCriteria.Invalid", "Invalid rules. Select valid target variants.")
        }, Ce(e);
        return;
      }
      await Ha(e.tile, l);
      const c = n.filterQuery, u = n.filterMode, d = n.selectedFileIndex;
      e.state = Fo(e.tile), e.state.filterQuery = c, e.state.filterMode = u, Number.isInteger(d) && (e.state.selectedFileIndex = d), e.state.status = {
        mode: "ready",
        message: f("EIDOLON.TileCriteria.Saved", "Tile criteria rules saved.")
      }, Ce(e), Pa(e);
    } catch (a) {
      console.error(`${K} | Failed to save tile criteria`, a), n.status = {
        mode: "error",
        message: (a == null ? void 0 : a.message) ?? "Failed to save tile criteria rules."
      }, Ce(e);
    }
  }, "handleSave"), o = /* @__PURE__ */ s(async () => {
    try {
      await Ha(e.tile, null);
      const a = n.filterQuery, l = n.filterMode, c = n.selectedFileIndex;
      e.state = Fo(e.tile), e.state.filterQuery = a, e.state.filterMode = l, Number.isInteger(c) && (e.state.selectedFileIndex = c), e.state.status = {
        mode: "ready",
        message: f("EIDOLON.TileCriteria.Cleared", "Tile criteria rules cleared.")
      }, Ce(e), Pa(e);
    } catch (a) {
      console.error(`${K} | Failed to clear tile criteria`, a), n.status = {
        mode: "error",
        message: (a == null ? void 0 : a.message) ?? "Failed to clear tile criteria rules."
      }, Ce(e);
    }
  }, "handleClear");
  if (t.appendChild(Pu(n, e, i, {
    onSave: r,
    onClear: o
  })), i.errors.length || i.warnings.length) {
    const a = document.createElement("section");
    a.classList.add("eidolon-tile-criteria__conflicts");
    const l = document.createElement("p");
    l.classList.add("eidolon-tile-criteria__conflict-summary", "notes"), i.errors.length ? (l.dataset.mode = "error", l.textContent = f(
      "EIDOLON.TileCriteria.ConflictSummary",
      `${i.errors.length} conflict(s) must be resolved before saving${i.warnings.length ? ` (${i.warnings.length} warning(s))` : ""}.`
    )) : (l.dataset.mode = "warning", l.textContent = f(
      "EIDOLON.TileCriteria.WarningSummary",
      `${i.warnings.length} potential issue(s) detected.`
    )), a.appendChild(l);
    const c = document.createElement("p");
    c.classList.add("eidolon-tile-criteria__conflict-hint", "notes"), c.textContent = f(
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
function Bu(e, t = null) {
  const n = document.createElement("section");
  n.classList.add("eidolon-tile-criteria");
  const i = Fo(e);
  Tu(i, bu(t));
  const r = {
    app: t,
    tile: e,
    section: n,
    state: i
  };
  return Ce(r), r;
}
s(Bu, "createController");
function qu(e) {
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
s(qu, "findFooterElement");
function Uu(e) {
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
s(Uu, "findTabNav");
function Vu(e, t) {
  var i, r, o;
  return e instanceof HTMLElement ? [
    (i = e.querySelector(".tab[data-tab]")) == null ? void 0 : i.parentElement,
    e.querySelector(".sheet-body"),
    (o = (r = t == null ? void 0 : t.parentElement) == null ? void 0 : r.querySelector) == null ? void 0 : o.call(r, ":scope > .sheet-body"),
    t == null ? void 0 : t.parentElement
  ].find((a) => a instanceof HTMLElement) ?? null : null;
}
s(Vu, "findTabBody");
function ju(e, t) {
  var n, i, r, o, a, l, c;
  return ((n = e == null ? void 0 : e.dataset) == null ? void 0 : n.group) ?? ((o = (r = (i = e == null ? void 0 : e.querySelector) == null ? void 0 : i.call(e, "[data-group]")) == null ? void 0 : r.dataset) == null ? void 0 : o.group) ?? ((c = (l = (a = t == null ? void 0 : t.querySelector) == null ? void 0 : a.call(t, ".tab[data-group]")) == null ? void 0 : l.dataset) == null ? void 0 : c.group) ?? "main";
}
s(ju, "getTabGroup");
function zu(e, t) {
  if (!(e instanceof HTMLElement)) return;
  e.textContent = "";
  const n = document.createElement("i");
  n.className = yu, n.setAttribute("inert", ""), e.append(n, " ");
  const i = document.createElement("span");
  i.textContent = t, e.append(i);
}
s(zu, "setTabButtonContent");
function Gu(e, t) {
  const n = e.querySelector("[data-tab]"), i = (n == null ? void 0 : n.tagName) || "A", r = document.createElement(i);
  return n instanceof HTMLElement && (r.className = n.className), r.classList.remove("active"), i === "BUTTON" && (r.type = "button"), r.dataset.action = "tab", r.dataset.tab = at, r.dataset.group = t, r.setAttribute("aria-selected", "false"), r.setAttribute("aria-pressed", "false"), r;
}
s(Gu, "createTabButton");
function Wu(e, t) {
  const n = document.createElement("div");
  n.classList.add("tab"), n.dataset.tab = at, n.dataset.group = t, n.dataset.applicationPart = at, n.setAttribute("hidden", "true");
  const i = qu(e);
  return e.insertBefore(n, i ?? null), n;
}
s(Wu, "createTabPanel");
function Vr(e, t, n, i) {
  var a;
  if (!(n instanceof HTMLElement) || !(i instanceof HTMLElement)) return;
  const r = (a = e == null ? void 0 : e.tabGroups) == null ? void 0 : a[t];
  if (typeof r == "string" ? r === at : n.classList.contains("active") || i.classList.contains("active")) {
    n.classList.add("active"), n.setAttribute("aria-selected", "true"), n.setAttribute("aria-pressed", "true"), i.classList.add("active"), i.removeAttribute("hidden"), i.removeAttribute("aria-hidden");
    return;
  }
  n.classList.remove("active"), n.setAttribute("aria-selected", "false"), n.setAttribute("aria-pressed", "false"), i.classList.remove("active"), i.setAttribute("hidden", "true");
}
s(Vr, "syncTabVisibility");
function Ku(e, t) {
  const n = Uu(t), i = Vu(t, n);
  if (!(n instanceof HTMLElement) || !(i instanceof HTMLElement)) return null;
  const r = ju(n, i);
  let o = n.querySelector(`[data-tab="${at}"]`);
  o instanceof HTMLElement || (o = Gu(n, r), n.appendChild(o)), zu(o, f("EIDOLON.TileCriteria.TabLabel", "Criteria"));
  let a = i.querySelector(`.tab[data-tab="${at}"]`);
  return a instanceof HTMLElement || (a = Wu(i, r)), o.dataset.eidolonTileCriteriaBound || (o.addEventListener("click", () => {
    Is(e, at, r), requestAnimationFrame(() => {
      Vr(e, r, o, a);
    });
  }), o.dataset.eidolonTileCriteriaBound = "true"), Vr(e, r, o, a), requestAnimationFrame(() => {
    Vr(e, r, o, a);
  }), a;
}
s(Ku, "ensureTileCriteriaTab");
function Ju() {
  Hooks.on("renderTileConfig", (e, t) => {
    var c, u, d, g;
    const n = st(t);
    if (!n) return;
    const i = Cu(e);
    if (!i) return;
    if ((c = n.querySelector(".eidolon-tile-criteria")) == null || c.remove(), !Ir()) {
      (u = n.querySelector(`.item[data-tab='${at}']`)) == null || u.remove(), (d = n.querySelector(`.tab[data-tab='${at}']`)) == null || d.remove();
      return;
    }
    const r = Bu(i, e), o = Ku(e, n);
    if (o instanceof HTMLElement) {
      o.replaceChildren(r.section), (g = e.setPosition) == null || g.call(e, { height: "auto" });
      return;
    }
    const a = (e == null ? void 0 : e.form) instanceof HTMLFormElement ? e.form : n instanceof HTMLFormElement ? n : n.querySelector("form");
    if (!(a instanceof HTMLFormElement)) return;
    const l = a.querySelector("button[type='submit']");
    l != null && l.parentElement ? l.parentElement.insertAdjacentElement("beforebegin", r.section) : a.appendChild(r.section);
  });
}
s(Ju, "registerTileCriteriaConfigControls");
function Yu(e) {
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
s(Yu, "toList");
function Qu(e, t) {
  const n = e == null ? void 0 : e.tools;
  return Array.isArray(n) ? n.some((i) => (i == null ? void 0 : i.name) === t) : n instanceof Map ? n.has(t) : n && typeof n == "object" ? t in n ? !0 : Object.values(n).some((i) => (i == null ? void 0 : i.name) === t) : !1;
}
s(Qu, "hasTool");
function Xu(e, t) {
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
s(Xu, "addTool");
function Zu() {
  Hooks.on("getSceneControlButtons", (e) => {
    var i;
    const t = Yu(e);
    if (!t.length) return;
    const n = t.find((r) => (r == null ? void 0 : r.name) === "tiles") ?? t.find((r) => (r == null ? void 0 : r.name) === "tokens" || (r == null ? void 0 : r.name) === "token") ?? t[0];
    n && (Qu(n, "eidolonCriteriaSwitcher") || Xu(n, {
      name: "eidolonCriteriaSwitcher",
      title: "Criteria Switcher",
      icon: "fa-solid fa-sliders",
      button: !0,
      toggle: !1,
      visible: wr(((i = game.scenes) == null ? void 0 : i.viewed) ?? null),
      onClick: /* @__PURE__ */ s(() => ta(), "onClick")
    }));
  });
}
s(Zu, "registerSceneControlButton");
function di(e, t) {
  if (!e || typeof e != "object") return !1;
  const n = String(t).split(".");
  let i = e;
  for (const r of n) {
    if (!i || typeof i != "object" || !Object.prototype.hasOwnProperty.call(i, r)) return !1;
    i = i[r];
  }
  return !0;
}
s(di, "hasOwnPath");
function ed() {
  const e = /* @__PURE__ */ s((i, r = null) => {
    i && Uc(i, r);
  }, "invalidateTileScene"), t = /* @__PURE__ */ s((i, r = null) => {
    i && nu(i, r);
  }, "invalidatePlaceableScene");
  Hooks.on("createTile", (i) => {
    e((i == null ? void 0 : i.parent) ?? null, i ?? null);
  }), Hooks.on("deleteTile", (i) => {
    e((i == null ? void 0 : i.parent) ?? null, i ?? null);
  }), Hooks.on("updateTile", (i, r) => {
    (di(r, `flags.${K}.tileCriteria`) || di(r, `flags.${K}.fileIndex`)) && e((i == null ? void 0 : i.parent) ?? null, i ?? null);
  });
  const n = /* @__PURE__ */ s((i) => {
    Hooks.on(`create${i}`, (r) => {
      t((r == null ? void 0 : r.parent) ?? null, r ?? null);
    }), Hooks.on(`delete${i}`, (r) => {
      t((r == null ? void 0 : r.parent) ?? null, r ?? null);
    }), Hooks.on(`update${i}`, (r, o) => {
      const a = di(o, `flags.${K}.presets`), l = i === "AmbientLight" && di(o, `flags.${K}.lightCriteria`);
      !a && !l || t((r == null ? void 0 : r.parent) ?? null, r ?? null);
    });
  }, "registerPlaceableHooks");
  n("AmbientLight"), n("Wall"), n("AmbientSound"), Hooks.on("canvasReady", (i) => {
    const r = (i == null ? void 0 : i.scene) ?? null;
    r && (e(r), t(r));
  });
}
s(ed, "registerCriteriaCacheInvalidationHooks");
function td() {
  Zu(), Ju(), ed(), Hooks.once("init", () => {
    var e, t;
    (t = (e = game.keybindings) == null ? void 0 : e.register) == null || t.call(e, K, "toggleCriteriaSwitcher", {
      name: "Toggle Criteria Switcher",
      hint: "Open or close the criteria switcher window for live scene state updates.",
      editable: [{ key: "KeyM", modifiers: ["Alt"] }],
      onDown: /* @__PURE__ */ s(() => {
        var n, i, r;
        return wr(((n = game.scenes) == null ? void 0 : n.viewed) ?? null) ? (ta(), !0) : ((r = (i = ui.notifications) == null ? void 0 : i.warn) == null || r.call(i, "You do not have permission to manage scene criteria."), !0);
      }, "onDown"),
      restricted: !0,
      precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL
    });
  }), Hooks.on("canvasReady", (e) => {
    var n;
    const t = Mr();
    t && (t.setScene((e == null ? void 0 : e.scene) ?? ((n = game.scenes) == null ? void 0 : n.viewed) ?? null), t.render({ force: !0 }));
  }), Hooks.once("ready", () => {
    var t, n;
    const e = (n = (t = game.modules) == null ? void 0 : t.get) == null ? void 0 : n.call(t, K);
    e && (e.api || (e.api = {}), e.api.criteria = mu, console.log(`${K} | Criteria engine API registered`));
  });
}
s(td, "registerCriteriaEngineHooks");
td();
const Ii = /* @__PURE__ */ new WeakMap(), fi = /* @__PURE__ */ new WeakMap(), le = "__eidolon_default__";
function nd() {
  Hooks.on("renderAmbientLightConfig", id), I("LightCriteria | AmbientLightConfig controls registered");
}
s(nd, "registerAmbientLightCriteriaControls");
function id(e, t) {
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
    rd(e, i);
  } catch (i) {
    console.error("eidolon-utilities | Failed to enhance AmbientLightConfig UI", i);
  } finally {
    Ct();
  }
}
s(id, "handleAmbientLightConfigRender");
function rd(e, t) {
  var me, Mt, hn, ni, fa;
  const n = (e == null ? void 0 : e.form) instanceof HTMLFormElement ? e.form : t instanceof HTMLFormElement ? t : (me = t == null ? void 0 : t.closest) == null ? void 0 : me.call(t, "form");
  if (!(n instanceof HTMLFormElement)) return;
  const i = n.querySelector(".window-content");
  if (!(i instanceof HTMLElement)) return;
  const r = fl(e);
  if (!r) return;
  const o = Od(r);
  I("LightCriteria | Resolved ambient light", {
    sheetId: (r == null ? void 0 : r.id) ?? null,
    persistedId: (o == null ? void 0 : o.id) ?? null,
    sameRef: r === o
  });
  const a = (o == null ? void 0 : o.parent) ?? r.parent ?? null, l = a ? cc(a) : [], c = l.filter(
    (S) => Array.isArray(S == null ? void 0 : S.values) && S.values.length > 0
  ), u = pd(l), d = l.map((S) => typeof (S == null ? void 0 : S.id) == "string" ? S.id : null).filter((S) => !!S), g = o ?? r, h = a ? ke(a) : [];
  let y = Vs(g);
  const b = Wc(y, h);
  JSON.stringify(b) !== JSON.stringify(y) && (y = b, js(g, b).catch((S) => {
    console.warn("eidolon-utilities | Failed to persist migrated light criteria keys", S);
  })), I("LightCriteria | Loaded mapping state", {
    hasBase: !!(y != null && y.base),
    mappingCount: Array.isArray(y == null ? void 0 : y.mappings) ? y.mappings.length : 0,
    mappings: Array.isArray(y == null ? void 0 : y.mappings) ? y.mappings.map((S) => {
      var k, q;
      return {
        id: S.id,
        key: S.key,
        hasColor: !!((q = (k = S.config) == null ? void 0 : k.config) != null && q.color)
      };
    }) : []
  });
  const p = i.querySelector(".eidolon-light-criteria");
  p && p.remove(), i.querySelectorAll(".eidolon-light-criteria-main-switcher").forEach((S) => S.remove());
  const T = document.createElement("fieldset");
  T.classList.add("eidolon-light-criteria");
  const E = document.createElement("legend");
  E.textContent = f("EIDOLON.LightCriteria.Legend", "Scene Criteria Lighting"), T.appendChild(E);
  const C = document.createElement("p");
  C.classList.add("notes"), C.textContent = f(
    "EIDOLON.LightCriteria.Description",
    "Capture a base lighting state, then map criteria values to lighting configurations."
  ), T.appendChild(C);
  const O = document.createElement("div");
  O.classList.add("eidolon-light-criteria__controls");
  const F = document.createElement("button");
  F.type = "button", F.dataset.action = "make-default", F.classList.add("eidolon-light-criteria__button"), F.textContent = f(
    "EIDOLON.LightCriteria.SetBase",
    "Set Base"
  ), O.appendChild(F);
  const _ = document.createElement("button");
  _.type = "button", _.dataset.action = "create-mapping", _.classList.add("eidolon-light-criteria__button"), _.textContent = f(
    "EIDOLON.LightCriteria.CreateMapping",
    "Add Criteria Mapping"
  ), _.setAttribute("aria-expanded", "false"), O.appendChild(_), T.appendChild(O);
  const D = document.createElement("p");
  D.classList.add("notes", "eidolon-light-criteria__status"), T.appendChild(D);
  const R = document.createElement("div");
  R.classList.add("eidolon-light-criteria__switcher");
  const Y = document.createElement("label");
  Y.classList.add("eidolon-light-criteria__switcher-label");
  const ie = `${(e == null ? void 0 : e.id) ?? (r == null ? void 0 : r.id) ?? "eidolon-light"}-mapping-select`;
  Y.htmlFor = ie, Y.textContent = f("EIDOLON.LightCriteria.SelectLabel", "Criteria Mapping"), R.appendChild(Y);
  const $ = document.createElement("details");
  $.classList.add("eidolon-light-criteria__filter-details");
  const Q = document.createElement("summary");
  Q.classList.add("eidolon-light-criteria__filter-summary");
  const A = document.createElement("span");
  A.classList.add("eidolon-light-criteria__filter-summary-label"), A.textContent = f(
    "EIDOLON.LightCriteria.FilterHeading",
    "Filter mappings"
  ), Q.appendChild(A);
  const U = document.createElement("span");
  U.classList.add("eidolon-light-criteria__filter-meta"), Q.appendChild(U), $.appendChild(Q);
  const G = document.createElement("div");
  G.classList.add("eidolon-light-criteria__filter-panel");
  const V = document.createElement("div");
  V.classList.add("eidolon-light-criteria__filter-grid");
  for (const S of c) {
    const k = document.createElement("label");
    k.classList.add("eidolon-light-criteria__filter");
    const q = document.createElement("span");
    q.classList.add("eidolon-light-criteria__filter-name"), q.textContent = (hn = (Mt = S.name) == null ? void 0 : Mt.trim) != null && hn.call(Mt) ? S.name.trim() : f("EIDOLON.LightCriteria.UnnamedCategory", "Unnamed Category"), k.appendChild(q);
    const j = document.createElement("select");
    j.dataset.filterCategoryId = S.id, j.classList.add("eidolon-light-criteria__filter-select");
    const W = document.createElement("option");
    W.value = "", W.textContent = f("EIDOLON.LightCriteria.FilterAny", "Any"), j.appendChild(W);
    for (const re of S.values) {
      const oe = document.createElement("option");
      oe.value = re, oe.textContent = re, j.appendChild(oe);
    }
    k.appendChild(j), V.appendChild(k);
  }
  G.appendChild(V);
  const H = document.createElement("div");
  H.classList.add("eidolon-light-criteria__filter-actions");
  const P = document.createElement("button");
  P.type = "button", P.dataset.action = "clear-mapping-filters", P.classList.add("eidolon-light-criteria__button", "secondary", "compact"), P.textContent = f("EIDOLON.LightCriteria.ClearFilters", "Clear Filters"), H.appendChild(P), G.appendChild(H), $.appendChild(G), $.hidden = c.length === 0, R.appendChild($);
  const J = document.createElement("div");
  J.classList.add("eidolon-light-criteria__switcher-controls"), R.appendChild(J);
  const te = document.createElement("select");
  te.id = ie, te.classList.add("eidolon-light-criteria__select"), te.dataset.action = "select-mapping", J.appendChild(te);
  const z = document.createElement("button");
  z.type = "button", z.dataset.action = "apply-selected-mapping", z.classList.add("eidolon-light-criteria__button", "secondary"), z.textContent = f("EIDOLON.LightCriteria.ApplyButton", "Apply"), J.appendChild(z);
  const X = document.createElement("details");
  X.classList.add("eidolon-light-criteria__menu"), X.dataset.action = "mapping-actions-menu";
  const Ot = document.createElement("summary");
  Ot.classList.add("eidolon-light-criteria__menu-toggle"), Ot.innerHTML = '<i class="fa-solid fa-ellipsis-vertical" inert=""></i>', Ot.setAttribute(
    "aria-label",
    f("EIDOLON.LightCriteria.MoreActions", "More actions")
  ), Ot.dataset.tooltip = f("EIDOLON.LightCriteria.MoreActions", "More actions"), X.appendChild(Ot);
  const Re = document.createElement("div");
  Re.classList.add("eidolon-light-criteria__menu-list"), X.appendChild(Re);
  const pe = document.createElement("button");
  pe.type = "button", pe.dataset.action = "update-selected-mapping", pe.classList.add("eidolon-light-criteria__menu-item"), pe.textContent = f(
    "EIDOLON.LightCriteria.UpdateSelected",
    "Save current config to selected"
  ), Re.appendChild(pe);
  const Me = document.createElement("button");
  Me.type = "button", Me.dataset.action = "edit-selected-mapping-criteria", Me.classList.add("eidolon-light-criteria__menu-item"), Me.textContent = f(
    "EIDOLON.LightCriteria.EditSelectedCriteria",
    "Edit selected mapping criteria"
  ), Re.appendChild(Me);
  const Ae = document.createElement("button");
  Ae.type = "button", Ae.dataset.action = "remove-selected-mapping", Ae.classList.add("eidolon-light-criteria__menu-item", "danger"), Ae.textContent = f(
    "EIDOLON.LightCriteria.RemoveSelected",
    "Delete selected mapping"
  ), Re.appendChild(Ae), J.appendChild(X);
  const Xe = document.createElement("div");
  Xe.classList.add("eidolon-light-criteria-main-switcher"), Xe.appendChild(R);
  const Ie = document.createElement("p");
  if (Ie.classList.add("notes", "eidolon-light-criteria-main-switcher__empty"), Ie.textContent = f(
    "EIDOLON.LightCriteria.ActiveRequiresBase",
    "Set Base Lighting to enable mapping selection and actions."
  ), Xe.appendChild(Ie), l.length === 0) {
    const S = document.createElement("p");
    S.classList.add("notification", "warning", "eidolon-light-criteria__warning"), S.textContent = f(
      "EIDOLON.LightCriteria.NoCategoriesWarning",
      "This scene has no criteria configured. Add criteria under Scene -> Criteria to enable criteria-driven lighting."
    ), T.appendChild(S);
  } else if (c.length === 0) {
    const S = document.createElement("p");
    S.classList.add("notification", "warning", "eidolon-light-criteria__warning"), S.textContent = f(
      "EIDOLON.LightCriteria.NoValuesWarning",
      "Criteria exist, but none define selectable values. Add values in Scene -> Criteria."
    ), T.appendChild(S);
  }
  const fe = document.createElement("div");
  fe.classList.add("eidolon-light-criteria__creation"), fe.dataset.section = "creation", fe.hidden = !0;
  const Yt = document.createElement("p");
  Yt.classList.add("notes"), Yt.textContent = f(
    "EIDOLON.LightCriteria.CreateDescription",
    "Assign scene criteria values to map the current configuration."
  ), fe.appendChild(Yt);
  const Ze = document.createElement("div");
  Ze.classList.add("eidolon-light-criteria__category-list"), fe.appendChild(Ze);
  for (const S of c) {
    const k = document.createElement("label");
    k.classList.add("eidolon-light-criteria__category");
    const q = document.createElement("span");
    q.classList.add("eidolon-light-criteria__category-name"), q.textContent = (fa = (ni = S.name) == null ? void 0 : ni.trim) != null && fa.call(ni) ? S.name.trim() : f("EIDOLON.LightCriteria.UnnamedCategory", "Unnamed Category"), k.appendChild(q);
    const j = document.createElement("select");
    j.dataset.categoryId = S.id, j.classList.add("eidolon-light-criteria__category-select");
    const W = document.createElement("option");
    W.value = "", W.textContent = f(
      "EIDOLON.LightCriteria.IgnoreCategory",
      "Ignore"
    ), j.appendChild(W);
    for (const re of S.values) {
      const oe = document.createElement("option");
      oe.value = re, oe.textContent = re, j.appendChild(oe);
    }
    k.appendChild(j), Ze.appendChild(k);
  }
  const vt = document.createElement("div");
  vt.classList.add("eidolon-light-criteria__creation-actions");
  const Ne = document.createElement("button");
  Ne.type = "button", Ne.dataset.action = "save-mapping", Ne.classList.add("eidolon-light-criteria__button", "primary"), Ne.textContent = f(
    "EIDOLON.LightCriteria.SaveMapping",
    "Save Mapping"
  ), vt.appendChild(Ne);
  const et = document.createElement("button");
  et.type = "button", et.dataset.action = "cancel-create", et.classList.add("eidolon-light-criteria__button", "secondary"), et.textContent = f(
    "EIDOLON.LightCriteria.Cancel",
    "Cancel"
  ), vt.appendChild(et), fe.appendChild(vt), T.appendChild(fe), i.prepend(Xe), i.appendChild(T), T.hidden = !0, sd(e, {
    fieldset: T,
    homeContainer: i
  }), requestAnimationFrame(() => {
    var S;
    (S = e.setPosition) == null || S.call(e, { height: "auto" });
  });
  let N = y;
  _t({ switcher: R, emptyState: Ie, state: N }), Nt(D, N), Tn(_, {
    state: N,
    hasCategories: c.length > 0
  }), I("LightCriteria | Controls injected", {
    sceneId: (a == null ? void 0 : a.id) ?? null,
    lightId: (r == null ? void 0 : r.id) ?? null,
    hasBase: !!(N != null && N.base),
    mappingCount: Array.isArray(N == null ? void 0 : N.mappings) ? N.mappings.length : 0,
    categories: c.length
  });
  const ei = Ld(N), B = {
    restoreConfig: null,
    app: e,
    selectedMapping: ei,
    editorMode: "create",
    editingMappingId: null,
    mappingFilters: {}
  };
  Ii.set(T, B);
  const He = /* @__PURE__ */ s(() => {
    X.open = !1;
  }, "closeActionsMenu");
  Ot.addEventListener("click", (S) => {
    X.classList.contains("is-disabled") && (S.preventDefault(), He());
  });
  const ge = /* @__PURE__ */ s((S = B.selectedMapping) => {
    const k = yd(V), q = Array.isArray(N == null ? void 0 : N.mappings) ? N.mappings : [], j = Td(q, k), W = Object.keys(k).length;
    B.mappingFilters = k, P.disabled = W === 0, Ed(U, {
      totalCount: q.length,
      visibleCount: j.length,
      hasFilters: W > 0,
      activeFilterCount: W
    }), $.classList.toggle("has-active-filters", W > 0), Cd(te, N, u, S, {
      mappings: j,
      categoryOrder: d
    }), B.selectedMapping = te.value ?? "", jr({
      mappingSelect: te,
      applyMappingButton: z,
      updateMappingButton: pe,
      editCriteriaButton: Me,
      removeMappingButton: Ae,
      actionsMenu: X,
      state: N
    }), X.classList.contains("is-disabled") && He();
  }, "refreshMappingSelector");
  V.querySelectorAll("select[data-filter-category-id]").forEach((S) => {
    S.addEventListener("change", () => {
      const k = B.selectedMapping;
      ge(k), B.selectedMapping !== k && zr(
        o ?? r,
        N,
        B.selectedMapping
      ).then((q) => {
        q && (N = q);
      });
    });
  }), P.addEventListener("click", () => {
    bd(V);
    const S = B.selectedMapping;
    ge(S), $.open = !1, B.selectedMapping !== S && zr(
      o ?? r,
      N,
      B.selectedMapping
    ).then((k) => {
      k && (N = k);
    });
  }), te.addEventListener("change", () => {
    B.selectedMapping = te.value ?? "", jr({
      mappingSelect: te,
      applyMappingButton: z,
      updateMappingButton: pe,
      editCriteriaButton: Me,
      removeMappingButton: Ae,
      actionsMenu: X,
      state: N
    }), zr(
      o ?? r,
      N,
      B.selectedMapping
    ).then((S) => {
      S && (N = S);
    });
  });
  const mn = /* @__PURE__ */ s(async () => {
    var j, W, re, oe, _e, lt, De, ct, se, ut, dt, Ve, At, pn;
    const S = te.value ?? "";
    if (!S) {
      (W = (j = ui.notifications) == null ? void 0 : j.warn) == null || W.call(
        j,
        f(
          "EIDOLON.LightCriteria.SelectMappingWarning",
          "Choose a criteria mapping before applying."
        )
      ), ge(B.selectedMapping);
      return;
    }
    if (S === le) {
      if (!(N != null && N.base)) {
        (oe = (re = ui.notifications) == null ? void 0 : re.warn) == null || oe.call(
          re,
          f(
            "EIDOLON.LightCriteria.BaseUnavailable",
            "Set a base lighting state before applying it."
          )
        );
        return;
      }
      gi(T, fe, _), wi(e, n, N.base), N = await On(o ?? r, {
        mappingId: le,
        categories: null,
        updatedAt: Date.now()
      }), B.selectedMapping = le, ge(B.selectedMapping), Nt(D, N), _t({ switcher: R, emptyState: Ie, state: N }), Tn(_, {
        state: N,
        hasCategories: c.length > 0
      }), qa(n, {
        mappingId: le,
        color: ((lt = (_e = N.base) == null ? void 0 : _e.config) == null ? void 0 : lt.color) ?? null
      }), (ct = (De = ui.notifications) == null ? void 0 : De.info) == null || ct.call(
        De,
        f(
          "EIDOLON.LightCriteria.BaseApplied",
          "Applied the base lighting state to the form."
        )
      ), He();
      return;
    }
    const k = Array.isArray(N == null ? void 0 : N.mappings) && N.mappings.length ? N.mappings.find((Qt) => (Qt == null ? void 0 : Qt.id) === S) : null;
    if (!k) {
      (ut = (se = ui.notifications) == null ? void 0 : se.warn) == null || ut.call(
        se,
        f(
          "EIDOLON.LightCriteria.MappingUnavailable",
          "The selected criteria mapping is no longer available."
        )
      ), B.selectedMapping = "", ge(B.selectedMapping);
      return;
    }
    gi(T, fe, _), wi(e, n, k.config), N = await On(o ?? r, {
      mappingId: k.id,
      categories: k.categories,
      updatedAt: Date.now()
    }), B.selectedMapping = k.id, ge(B.selectedMapping), Nt(D, N), _t({ switcher: R, emptyState: Ie, state: N }), Tn(_, {
      state: N,
      hasCategories: c.length > 0
    }), qa(n, {
      mappingId: k.id,
      color: ((Ve = (dt = k.config) == null ? void 0 : dt.config) == null ? void 0 : Ve.color) ?? null
    });
    const q = sn(k, u, d);
    (pn = (At = ui.notifications) == null ? void 0 : At.info) == null || pn.call(
      At,
      f(
        "EIDOLON.LightCriteria.MappingApplied",
        "Applied mapping: {label}"
      ).replace("{label}", q)
    ), He();
  }, "applySelectedMapping");
  z.addEventListener("click", () => {
    mn();
  }), te.addEventListener("keydown", (S) => {
    S.key === "Enter" && (S.preventDefault(), mn());
  });
  const ti = /* @__PURE__ */ s(async () => {
    var k, q, j, W, re, oe, _e, lt, De, ct, se, ut, dt, Ve, At, pn, Qt, ii, ga, ri, ma;
    const S = B.selectedMapping;
    if (!S) {
      (q = (k = ui.notifications) == null ? void 0 : k.warn) == null || q.call(
        k,
        f(
          "EIDOLON.LightCriteria.SelectMappingWarning",
          "Choose a criteria mapping before applying."
        )
      );
      return;
    }
    pe.disabled = !0;
    try {
      const Se = Si(e, o);
      if (S === le)
        N = await Da(o ?? r, Se), I("LightCriteria | Base lighting updated", {
          lightId: ((j = o ?? r) == null ? void 0 : j.id) ?? null,
          configColor: ((W = Se == null ? void 0 : Se.config) == null ? void 0 : W.color) ?? null
        }), (oe = (re = ui.notifications) == null ? void 0 : re.info) == null || oe.call(
          re,
          f(
            "EIDOLON.LightCriteria.BaseUpdated",
            "Updated the base lighting state with the current configuration."
          )
        ), B.selectedMapping = le;
      else {
        const Xt = vn(N, S);
        if (!Xt) {
          (lt = (_e = ui.notifications) == null ? void 0 : _e.warn) == null || lt.call(
            _e,
            f(
              "EIDOLON.LightCriteria.MappingUnavailable",
              "The selected criteria mapping is no longer available."
            )
          ), B.selectedMapping = "", ge(B.selectedMapping);
          return;
        }
        N = await Fa(
          o ?? r,
          Xt.categories,
          Se,
          { label: Xt.label ?? null }
        ), I("LightCriteria | Mapping updated", {
          mappingId: S,
          hasColor: !!((De = Se == null ? void 0 : Se.config) != null && De.color),
          stored: Array.isArray(N == null ? void 0 : N.mappings) ? ((ct = N.mappings.find((_r) => (_r == null ? void 0 : _r.id) === S)) == null ? void 0 : ct.config) ?? null : null,
          persisted: (ut = (se = o ?? r) == null ? void 0 : se.getFlag) == null ? void 0 : ut.call(se, jt, an)
        });
        const yn = vn(N, S), Cl = sn(yn || Xt, u, d);
        I("LightCriteria | Mapping updated", {
          mappingId: S,
          categories: Xt.categories,
          updatedColor: ((dt = Se == null ? void 0 : Se.config) == null ? void 0 : dt.color) ?? null,
          storedColor: ((At = (Ve = yn == null ? void 0 : yn.config) == null ? void 0 : Ve.config) == null ? void 0 : At.color) ?? ((Qt = (pn = Xt.config) == null ? void 0 : pn.config) == null ? void 0 : Qt.color) ?? null
        }), (ga = (ii = ui.notifications) == null ? void 0 : ii.info) == null || ga.call(
          ii,
          f(
            "EIDOLON.LightCriteria.MappingUpdated",
            "Saved changes to mapping: {label}"
          ).replace("{label}", Cl)
        ), B.selectedMapping = S;
      }
      Nt(D, N), _t({ switcher: R, emptyState: Ie, state: N }), Tn(_, {
        state: N,
        hasCategories: c.length > 0
      }), ge(B.selectedMapping), He();
    } catch (Se) {
      console.error("eidolon-utilities | Failed to update light criteria mapping", Se), (ma = (ri = ui.notifications) == null ? void 0 : ri.error) == null || ma.call(
        ri,
        f(
          "EIDOLON.LightCriteria.MappingUpdateError",
          "Failed to save the mapping. Check the console for details."
        )
      );
    } finally {
      pe.disabled = !1, jr({
        mappingSelect: te,
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
    ti();
  }), ge(B.selectedMapping), F.addEventListener("click", async () => {
    var S, k, q, j, W, re;
    F.disabled = !0;
    try {
      const oe = Si(e, o);
      N = await Da(o ?? r, oe), I("LightCriteria | Base lighting stored", {
        lightId: ((S = o ?? r) == null ? void 0 : S.id) ?? null,
        configColor: ((k = oe == null ? void 0 : oe.config) == null ? void 0 : k.color) ?? null
      }), (j = (q = ui.notifications) == null ? void 0 : q.info) == null || j.call(
        q,
        f(
          "EIDOLON.LightCriteria.BaseStored",
          "Saved the current configuration as the base lighting state."
        )
      ), Nt(D, N), _t({ switcher: R, emptyState: Ie, state: N }), Tn(_, {
        state: N,
        hasCategories: c.length > 0
      }), B.selectedMapping = le, ge(B.selectedMapping);
    } catch (oe) {
      console.error("eidolon-utilities | Failed to store base light criteria state", oe), (re = (W = ui.notifications) == null ? void 0 : W.error) == null || re.call(
        W,
        f(
          "EIDOLON.LightCriteria.BaseError",
          "Failed to save the base lighting state. Check the console for details."
        )
      );
    } finally {
      F.disabled = !1;
    }
  }), _.addEventListener("click", () => {
    var k, q, j, W;
    if (!(N != null && N.base)) {
      (q = (k = ui.notifications) == null ? void 0 : k.warn) == null || q.call(
        k,
        f(
          "EIDOLON.LightCriteria.RequiresBase",
          "Set a base lighting state before adding criteria mappings."
        )
      );
      return;
    }
    if (c.length === 0) {
      (W = (j = ui.notifications) == null ? void 0 : j.warn) == null || W.call(
        j,
        f(
          "EIDOLON.LightCriteria.NoCategoriesAvailable",
          "Add scene criteria with values in the Scene configuration before creating mappings."
        )
      );
      return;
    }
    const S = Ii.get(T);
    Ba({
      app: e,
      fieldset: T,
      createButton: _,
      creationSection: fe,
      categoryList: Ze,
      form: n,
      persistedLight: o,
      stateEntry: S,
      mode: "create",
      mapping: null,
      preloadConfig: N.base
    });
  }), Me.addEventListener("click", () => {
    var q, j, W, re;
    const S = B.selectedMapping;
    if (!S || S === le) {
      (j = (q = ui.notifications) == null ? void 0 : q.warn) == null || j.call(
        q,
        f(
          "EIDOLON.LightCriteria.SelectMappingForCriteriaEdit",
          "Select a mapping before editing criteria."
        )
      );
      return;
    }
    const k = vn(N, S);
    if (!k) {
      (re = (W = ui.notifications) == null ? void 0 : W.warn) == null || re.call(
        W,
        f(
          "EIDOLON.LightCriteria.MappingUnavailable",
          "The selected criteria mapping is no longer available."
        )
      );
      return;
    }
    He(), dl(e, { fieldset: T, homeContainer: i }), Ba({
      app: e,
      fieldset: T,
      createButton: _,
      creationSection: fe,
      categoryList: Ze,
      form: n,
      persistedLight: o,
      stateEntry: B,
      mode: "retarget",
      mapping: k,
      preloadConfig: k.config
    });
  }), Ne.addEventListener("click", async () => {
    var k, q, j, W, re, oe, _e, lt, De, ct;
    const S = wd(Ze);
    if (!S) {
      (q = (k = ui.notifications) == null ? void 0 : k.warn) == null || q.call(
        k,
        f(
          "EIDOLON.LightCriteria.SelectionRequired",
          "Select at least one criteria value to identify the mapping."
        )
      );
      return;
    }
    Ne.disabled = !0;
    try {
      const se = Si(e, o);
      if (B.editorMode === "retarget" && B.editingMappingId) {
        const dt = Ro(N, S);
        let Ve = !1;
        if (dt && dt !== B.editingMappingId && (Ve = await od(), !Ve)) {
          Ne.disabled = !1;
          return;
        }
        N = await jc(
          o ?? r,
          B.editingMappingId,
          S,
          se,
          { replaceExisting: Ve }
        ), I("LightCriteria | Mapping criteria retargeted", {
          mappingId: B.editingMappingId,
          categories: S,
          replaced: Ve,
          configColor: ((j = se == null ? void 0 : se.config) == null ? void 0 : j.color) ?? null
        }), (re = (W = ui.notifications) == null ? void 0 : W.info) == null || re.call(
          W,
          f(
            "EIDOLON.LightCriteria.MappingCriteriaUpdated",
            "Updated mapping criteria for the selected mapping."
          )
        );
      } else
        N = await Fa(
          o ?? r,
          S,
          se,
          {}
        ), I("LightCriteria | Mapping saved from editor", {
          categories: S,
          configColor: ((oe = se == null ? void 0 : se.config) == null ? void 0 : oe.color) ?? null
        }), (lt = (_e = ui.notifications) == null ? void 0 : _e.info) == null || lt.call(
          _e,
          f(
            "EIDOLON.LightCriteria.MappingSaved",
            "Updated lighting mapping for the selected scene criteria."
          )
        );
      Nt(D, N), _t({ switcher: R, emptyState: Ie, state: N });
      const ut = Ro(N, S);
      ut && (B.selectedMapping = ut), ge(B.selectedMapping), gi(T, fe, _), He();
    } catch (se) {
      console.error("eidolon-utilities | Failed to persist light criteria mapping", se), (ct = (De = ui.notifications) == null ? void 0 : De.error) == null || ct.call(
        De,
        f(
          "EIDOLON.LightCriteria.MappingError",
          "Failed to save the mapping. Check the console for details."
        )
      );
    } finally {
      Ne.disabled = !1;
    }
  }), et.addEventListener("click", () => {
    const S = Ii.get(T);
    S != null && S.restoreConfig && wi(e, n, S.restoreConfig), gi(T, fe, _);
  }), Ae.addEventListener("click", async () => {
    var q, j;
    const S = B.selectedMapping;
    !S || S === le || !await ad() || (N = await zc(o ?? r, S), B.selectedMapping = "", Nt(D, N), _t({ switcher: R, emptyState: Ie, state: N }), ge(B.selectedMapping), He(), (j = (q = ui.notifications) == null ? void 0 : q.info) == null || j.call(
      q,
      f("EIDOLON.LightCriteria.MappingRemoved", "Removed selected mapping.")
    ));
  });
}
s(rd, "enhanceAmbientLightConfig");
function Ba({
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
  l && (l.restoreConfig = Si(e, a), l.editorMode = c, l.editingMappingId = c === "retarget" ? (u == null ? void 0 : u.id) ?? null : null), d && wi(e, o, d), c === "retarget" && (u != null && u.categories) ? Sd(r, u.categories) : Id(r);
  const g = i.querySelector("p.notes");
  g instanceof HTMLElement && (g.textContent = c === "retarget" ? f(
    "EIDOLON.LightCriteria.EditCriteriaDescription",
    "Adjust criteria values for the selected mapping."
  ) : f(
    "EIDOLON.LightCriteria.CreateDescription",
    "Assign scene criteria values to map the current configuration."
  ));
  const h = i.querySelector('button[data-action="save-mapping"]');
  h instanceof HTMLButtonElement && (h.textContent = c === "retarget" ? f("EIDOLON.LightCriteria.SaveCriteriaChanges", "Save Criteria Changes") : f("EIDOLON.LightCriteria.SaveMapping", "Save Mapping")), i.hidden = !1, n.setAttribute("aria-expanded", "true"), na(t, i), requestAnimationFrame(() => {
    var y;
    (y = e.setPosition) == null || y.call(e, { height: "auto" });
  });
}
s(Ba, "openMappingEditor");
async function od() {
  var n, i;
  const e = (i = (n = foundry == null ? void 0 : foundry.applications) == null ? void 0 : n.api) == null ? void 0 : i.DialogV2;
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
s(od, "confirmCriteriaConflict");
async function ad() {
  var n, i;
  const e = (i = (n = foundry == null ? void 0 : foundry.applications) == null ? void 0 : n.api) == null ? void 0 : i.DialogV2;
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
s(ad, "confirmRemoveMapping");
function sd(e, { fieldset: t, homeContainer: n }) {
  const i = ud(e, n);
  if (!(i instanceof HTMLElement)) return;
  const r = i.querySelector(".window-header");
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
    a.preventDefault(), dl(e, { fieldset: t, homeContainer: n });
  };
}
s(sd, "ensureManagerHeaderButton");
function dl(e, { fieldset: t, homeContainer: n }) {
  var h, y, b;
  const i = fi.get(e);
  if (i != null && i.rendered) {
    (h = i.bringToTop) == null || h.call(i);
    return;
  }
  const r = /* @__PURE__ */ s((...p) => {
    var C;
    const T = ld(p), E = (C = T == null ? void 0 : T.querySelector) == null ? void 0 : C.call(T, ".eidolon-light-criteria-manager-host");
    E instanceof HTMLElement && (cd(t), t.hidden = !1, E.appendChild(t));
  }, "onRender"), o = /* @__PURE__ */ s(() => {
    n instanceof HTMLElement && n.appendChild(t), t.hidden = !0, fi.delete(e), requestAnimationFrame(() => {
      var p;
      (p = e.setPosition) == null || p.call(e, { height: "auto" });
    });
  }, "onClose"), a = f("EIDOLON.LightCriteria.ManagerTitle", "Scene Criteria Lighting"), l = '<div class="eidolon-light-criteria-manager-host"></div>', c = f("EIDOLON.LightCriteria.Close", "Close"), u = (b = (y = foundry == null ? void 0 : foundry.applications) == null ? void 0 : y.api) == null ? void 0 : b.DialogV2;
  if (typeof (u == null ? void 0 : u.wait) == "function")
    try {
      let p = !1;
      const T = /* @__PURE__ */ s(() => {
        p || (p = !0, o());
      }, "closeOnce");
      fi.set(e, {
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
  fi.set(e, g), g.render(!0);
}
s(dl, "openManagerDialog");
function ld(e) {
  for (const t of e) {
    const n = st(t);
    if (n) return n;
    const i = st(t == null ? void 0 : t.element);
    if (i) return i;
  }
  return null;
}
s(ld, "findDialogRoot");
function cd(e) {
  if (!(e instanceof HTMLElement) || e.dataset.managerLayout === "true") return;
  e.dataset.managerLayout = "true", e.classList.add("is-manager");
  const t = e.querySelector("legend"), n = e.querySelector("p.notes:not(.eidolon-light-criteria__status)"), i = e.querySelector(".eidolon-light-criteria__controls"), r = e.querySelector(".eidolon-light-criteria__status"), o = e.querySelector(".eidolon-light-criteria__creation"), a = Array.from(e.querySelectorAll(".eidolon-light-criteria__warning")), l = document.createElement("div");
  l.classList.add("eidolon-light-criteria-manager");
  const c = document.createElement("section");
  c.classList.add("eidolon-light-criteria-manager__section", "is-top"), l.appendChild(c);
  const u = document.createElement("section");
  u.classList.add("eidolon-light-criteria-manager__section", "is-bottom"), l.appendChild(u);
  const d = document.createElement("div");
  if (d.classList.add("eidolon-light-criteria-manager__header"), d.textContent = f("EIDOLON.LightCriteria.ManagerHeader", "Base State"), c.appendChild(d), r && c.appendChild(r), i && c.appendChild(i), a.length) {
    const h = document.createElement("div");
    h.classList.add("eidolon-light-criteria-manager__warnings");
    for (const y of a) h.appendChild(y);
    c.appendChild(h);
  }
  const g = document.createElement("div");
  g.classList.add("eidolon-light-criteria-manager__header"), g.textContent = f("EIDOLON.LightCriteria.ManagerAuthoring", "Create or Update Mapping"), u.appendChild(g), o && u.appendChild(o), e.innerHTML = "", t && e.appendChild(t), n && e.appendChild(n), e.appendChild(l), na(e, o);
}
s(cd, "applyManagerLayout");
function ud(e, t) {
  var i;
  const n = st(e == null ? void 0 : e.element);
  return n || (((i = t == null ? void 0 : t.closest) == null ? void 0 : i.call(t, ".application")) ?? null);
}
s(ud, "resolveApplicationRoot");
function gi(e, t, n) {
  const i = Ii.get(e);
  i && (i.restoreConfig = null, i.editorMode = "create", i.editingMappingId = null), t.hidden = !0, n.setAttribute("aria-expanded", "false");
  const r = t.querySelector("p.notes");
  r instanceof HTMLElement && (r.textContent = f(
    "EIDOLON.LightCriteria.CreateDescription",
    "Assign scene criteria values to map the current configuration."
  ));
  const o = t.querySelector('button[data-action="save-mapping"]');
  o instanceof HTMLButtonElement && (o.textContent = f("EIDOLON.LightCriteria.SaveMapping", "Save Mapping")), na(e, t), requestAnimationFrame(() => {
    var a, l;
    (l = (a = i == null ? void 0 : i.app) == null ? void 0 : a.setPosition) == null || l.call(a, { height: "auto" });
  });
}
s(gi, "hideCreationSection");
function Nt(e, t) {
  if (!e) return;
  const n = !!(t != null && t.base), i = Array.isArray(t == null ? void 0 : t.mappings) ? t.mappings.length : 0, r = [];
  r.push(
    n ? f(
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
    ).replace("{count}", String(i))
  ), e.textContent = r.join(" ");
}
s(Nt, "updateStatusLine");
function Tn(e, { state: t, hasCategories: n }) {
  if (!e) return;
  const i = !!(t != null && t.base), r = i && n;
  e.disabled = !r, e.title = r ? "" : i ? f(
    "EIDOLON.LightCriteria.CreateDisabledNoCategories",
    "Add scene criteria with values before creating mappings."
  ) : f(
    "EIDOLON.LightCriteria.CreateDisabledNoBase",
    "Save a base lighting state before creating criteria mappings."
  );
}
s(Tn, "updateCreateButtonState");
function Si(e, t) {
  var c, u, d;
  const n = t ?? fl(e);
  if (!n)
    throw new Error("Ambient light document unavailable.");
  const i = Jt(((c = n.toObject) == null ? void 0 : c.call(n)) ?? {});
  if (!i)
    throw new Error("Unable to duplicate ambient light data.");
  const r = (e == null ? void 0 : e.form) instanceof HTMLFormElement ? e.form : null, o = r ? Kl(r) : {}, a = foundry.utils.mergeObject(i, o, {
    inplace: !1,
    performDeletions: !0
  });
  r && (r.querySelectorAll("color-picker[name]").forEach((g) => {
    var E, C;
    const h = g.getAttribute("name");
    if (!h) return;
    const y = typeof g.value == "string" ? g.value : "", b = ((E = g.ui) == null ? void 0 : E.input) ?? ((C = g.querySelector) == null ? void 0 : C.call(g, 'input[type="color"]')), p = (b == null ? void 0 : b.value) ?? "", T = y || p;
    typeof T != "string" || !T || (foundry.utils.setProperty(a, h, T), I("LightCriteria | Captured color-picker value", {
      path: h,
      pickerValue: y,
      swatchValue: p,
      chosenValue: T
    }));
  }), r.querySelectorAll("range-picker[name]").forEach((g) => {
    var _, D;
    const h = g.getAttribute("name");
    if (!h) return;
    const y = g.value !== void 0 && g.value !== null ? String(g.value) : "", b = (_ = g.querySelector) == null ? void 0 : _.call(g, 'input[type="range"]'), p = (D = g.querySelector) == null ? void 0 : D.call(g, 'input[type="number"]'), T = b instanceof HTMLInputElement ? b.value : "", E = p instanceof HTMLInputElement ? p.value : "", C = y || E || T;
    if (typeof C != "string" || !C.length) return;
    const O = Number(C), F = Number.isFinite(O) ? O : C;
    foundry.utils.setProperty(a, h, F), I("LightCriteria | Captured range-picker value", {
      path: h,
      elementValue: y,
      numberValue: E,
      rangeValue: T,
      chosenValue: F
    });
  }));
  const l = Jt(a);
  return I("LightCriteria | Captured form config", {
    lightId: (n == null ? void 0 : n.id) ?? null,
    hasColor: !!((u = l == null ? void 0 : l.config) != null && u.color),
    color: ((d = l == null ? void 0 : l.config) == null ? void 0 : d.color) ?? null
  }), l;
}
s(Si, "captureAmbientLightFormConfig");
function wi(e, t, n) {
  if (!n || typeof n != "object") return;
  const i = foundry.utils.flattenObject(n, { safe: !0 });
  for (const [r, o] of Object.entries(i)) {
    const a = t.querySelectorAll(`[name="${r}"]`);
    if (a.length) {
      I("LightCriteria | Applying field", {
        path: r,
        value: o,
        elementCount: a.length
      });
      for (const l of a)
        l instanceof HTMLElement && l.tagName === "COLOR-PICKER" ? fd(l, o) : l instanceof HTMLElement && l.tagName === "RANGE-PICKER" ? gd(l, o) : l instanceof HTMLInputElement ? dd(l, o) : l instanceof HTMLSelectElement ? md(l, o) : l instanceof HTMLTextAreaElement && hd(l, o);
    }
  }
  requestAnimationFrame(() => {
    var r;
    return (r = e._previewChanges) == null ? void 0 : r.call(e);
  });
}
s(wi, "applyConfigToForm");
function dd(e, t, n) {
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
s(dd, "applyValueToInput");
function fd(e, t, n) {
  var l, c, u, d, g, h;
  const i = t == null ? "" : String(t);
  let r = !1;
  e.value !== i && (e.value = i, e.setAttribute("value", i), (l = e.ui) != null && l.setValue && e.ui.setValue(i), r = !0);
  const o = ((c = e.ui) == null ? void 0 : c.input) ?? ((u = e.querySelector) == null ? void 0 : u.call(e, 'input[type="color"]'));
  o instanceof HTMLInputElement && o.value !== i && (o.value = i, Ue(o));
  const a = ((d = e.ui) == null ? void 0 : d.text) ?? ((g = e.querySelector) == null ? void 0 : g.call(e, 'input[type="text"]'));
  a instanceof HTMLInputElement && a.value !== i && (a.value = i, Ue(a)), (h = e.ui) != null && h.commit ? e.ui.commit() : (e.dispatchEvent(new Event("input", { bubbles: !0, cancelable: !0 })), e.dispatchEvent(new Event("change", { bubbles: !0, cancelable: !0 }))), I("LightCriteria | Color picker applied", {
    value: i,
    pickerValue: e.value ?? null,
    swatchValue: (o == null ? void 0 : o.value) ?? null,
    textValue: (a == null ? void 0 : a.value) ?? null
  }), r && Ue(e);
}
s(fd, "applyValueToColorPicker");
function gd(e, t, n) {
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
    } catch (g) {
      console.error("eidolon-utilities | range-picker commit failed", g);
    }
  I("LightCriteria | Range picker applied", {
    value: i,
    resolvedValue: o,
    rangeValue: (l == null ? void 0 : l.value) ?? null,
    numberValue: (c == null ? void 0 : c.value) ?? null
  }), a && Ue(e);
}
s(gd, "applyValueToRangePicker");
function md(e, t, n) {
  const i = t == null ? "" : String(t);
  e.value !== i && (e.value = i, Ue(e));
}
s(md, "applyValueToSelect");
function hd(e, t, n) {
  const i = t == null ? "" : String(t);
  e.value !== i && (e.value = i, Ue(e));
}
s(hd, "applyValueToTextarea");
function Ue(e) {
  e.dispatchEvent(new Event("input", { bubbles: !0, cancelable: !0 })), e.dispatchEvent(new Event("change", { bubbles: !0, cancelable: !0 }));
}
s(Ue, "triggerInputChange");
function jr({
  mappingSelect: e,
  applyMappingButton: t,
  updateMappingButton: n,
  editCriteriaButton: i,
  removeMappingButton: r,
  actionsMenu: o,
  state: a
}) {
  const l = (e == null ? void 0 : e.value) ?? "", c = !!(a != null && a.base), u = l && l !== le ? !!vn(a, l) : !1;
  if (t instanceof HTMLButtonElement && (l ? l === le ? t.disabled = !c : t.disabled = !u : t.disabled = !0), n instanceof HTMLButtonElement && (l ? l === le ? n.disabled = !1 : n.disabled = !u : n.disabled = !0), i instanceof HTMLButtonElement && (i.disabled = !l || l === le || !u), r instanceof HTMLButtonElement && (r.disabled = !l || l === le || !u), o instanceof HTMLElement) {
    const d = n instanceof HTMLButtonElement && !n.disabled || i instanceof HTMLButtonElement && !i.disabled || r instanceof HTMLButtonElement && !r.disabled;
    o.classList.toggle("is-disabled", !d), !d && "open" in o && (o.open = !1);
  }
}
s(jr, "syncMappingSwitcherState");
function pd(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e) {
    if (!n) continue;
    const i = typeof n.id == "string" ? n.id : null;
    if (!i) continue;
    const r = typeof n.name == "string" && n.name.trim() ? n.name.trim() : f("EIDOLON.LightCriteria.UnnamedCategory", "Unnamed Category");
    t.has(i) || t.set(i, r);
  }
  return t;
}
s(pd, "buildCategoryNameLookup");
function yd(e) {
  const t = {};
  return e instanceof HTMLElement && e.querySelectorAll("select[data-filter-category-id]").forEach((n) => {
    var o, a;
    const i = n.dataset.filterCategoryId, r = (a = (o = n.value) == null ? void 0 : o.trim) == null ? void 0 : a.call(o);
    !i || !r || (t[i] = r);
  }), t;
}
s(yd, "readMappingFilterSelections");
function bd(e) {
  e instanceof HTMLElement && e.querySelectorAll("select[data-filter-category-id]").forEach((t) => {
    t.value = "";
  });
}
s(bd, "resetMappingFilterSelections");
function Td(e, t) {
  const n = Array.isArray(e) ? e : [], i = Object.entries(t ?? {}).filter(([, r]) => !!r);
  return i.length ? n.filter((r) => {
    if (!r || typeof r != "object") return !1;
    const o = r.categories ?? {};
    for (const [a, l] of i)
      if ((o == null ? void 0 : o[a]) !== l) return !1;
    return !0;
  }) : n.slice();
}
s(Td, "filterMappingsByCriteria");
function Ed(e, { totalCount: t = 0, visibleCount: n = 0, hasFilters: i = !1, activeFilterCount: r = 0 } = {}) {
  if (!(e instanceof HTMLElement)) return;
  if (!i) {
    e.textContent = f(
      "EIDOLON.LightCriteria.FilterSummaryAll",
      "All ({count})"
    ).replace("{count}", String(t));
    return;
  }
  const o = f(
    "EIDOLON.LightCriteria.FilterSummaryActive",
    "{active} filters · {visible}/{total}"
  ).replace("{active}", String(r)).replace("{visible}", String(n)).replace("{total}", String(t));
  e.textContent = o;
}
s(Ed, "updateMappingFilterMeta");
function Cd(e, t, n, i, r = {}) {
  if (!(e instanceof HTMLSelectElement)) return;
  const o = typeof i == "string" ? i : "", a = !!(t != null && t.base), l = Array.isArray(r == null ? void 0 : r.categoryOrder) ? r.categoryOrder : [], c = Array.isArray(r == null ? void 0 : r.mappings) ? r.mappings.slice() : Array.isArray(t == null ? void 0 : t.mappings) ? t.mappings.slice() : [], u = e.value;
  e.innerHTML = "";
  const d = document.createElement("option");
  d.value = "", d.textContent = f(
    "EIDOLON.LightCriteria.SelectPlaceholder",
    "Select a mapping"
  ), d.disabled = a, e.appendChild(d);
  const g = document.createElement("option");
  g.value = le, g.textContent = f(
    "EIDOLON.LightCriteria.BaseOption",
    "Base Lighting"
  ), g.disabled = !a, e.appendChild(g), c.slice().sort((p, T) => {
    var O;
    const E = sn(p, n, l), C = sn(T, n, l);
    return E.localeCompare(C, ((O = game.i18n) == null ? void 0 : O.lang) ?? void 0, {
      sensitivity: "base"
    });
  }).forEach((p) => {
    if (!(p != null && p.id)) return;
    const T = document.createElement("option");
    T.value = p.id, T.textContent = sn(p, n, l), e.appendChild(T);
  });
  const h = new Set(
    Array.from(e.options).filter((p) => !p.disabled).map((p) => p.value)
  ), y = a && u === "" ? "" : u, b = o || (h.has(y) ? y : "");
  b && h.has(b) ? e.value = b : a ? e.value = le : e.value = "";
}
s(Cd, "populateMappingSelector");
function sn(e, t, n = []) {
  if (!e || typeof e != "object")
    return f("EIDOLON.LightCriteria.UnnamedMapping", "Unnamed Mapping");
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
    return `${t.get(l) ?? f("EIDOLON.LightCriteria.UnnamedCategory", "Unnamed Category")}=${u}`;
  }).filter(Boolean);
  return a.length === 0 ? f("EIDOLON.LightCriteria.UnnamedMapping", "Unnamed Mapping") : a.join(" | ");
}
s(sn, "formatMappingOptionLabel");
function Ro(e, t) {
  if (!e || typeof e != "object" || !Array.isArray(e.mappings)) return null;
  const n = gn(t);
  if (!n) return null;
  const i = e.mappings.find((r) => (r == null ? void 0 : r.key) === n);
  return (i == null ? void 0 : i.id) ?? null;
}
s(Ro, "findMappingIdByCategories");
function vn(e, t) {
  return !t || !e || typeof e != "object" || !Array.isArray(e.mappings) ? null : e.mappings.find((n) => (n == null ? void 0 : n.id) === t) ?? null;
}
s(vn, "getMappingById");
function Ld(e) {
  if (!e || typeof e != "object") return "";
  const t = e.current;
  if (t != null && t.mappingId) {
    if (t.mappingId === le)
      return e != null && e.base ? le : "";
    if (Array.isArray(e.mappings) && e.mappings.some((n) => n.id === t.mappingId))
      return t.mappingId;
  }
  if (t != null && t.categories) {
    const n = Ro(e, t.categories);
    if (n) return n;
  }
  return "";
}
s(Ld, "resolveInitialMappingSelection");
function qa(e, t = {}) {
  var a, l, c, u;
  if (!(e instanceof HTMLFormElement)) return;
  const n = e.querySelector('color-picker[name="config.color"]'), i = (n == null ? void 0 : n.value) ?? null, r = ((a = n == null ? void 0 : n.ui) == null ? void 0 : a.text) ?? ((l = n == null ? void 0 : n.querySelector) == null ? void 0 : l.call(n, 'input[type="text"]')), o = ((c = n == null ? void 0 : n.ui) == null ? void 0 : c.input) ?? ((u = n == null ? void 0 : n.querySelector) == null ? void 0 : u.call(n, 'input[type="color"]'));
  I("LightCriteria | Color state after apply", {
    ...t,
    textValue: (r == null ? void 0 : r.value) ?? null,
    pickerValue: i,
    swatchValue: (o == null ? void 0 : o.value) ?? null
  });
}
s(qa, "logAppliedColorState");
function Id(e) {
  e.querySelectorAll("select[data-category-id]").forEach((t) => {
    t.value = "";
  });
}
s(Id, "resetCategorySelections");
function Sd(e, t) {
  const n = t && typeof t == "object" ? t : {};
  e.querySelectorAll("select[data-category-id]").forEach((i) => {
    const r = i.dataset.categoryId;
    if (!r) return;
    const o = n[r];
    i.value = typeof o == "string" ? o : "";
  });
}
s(Sd, "setCategorySelections");
function wd(e) {
  const t = {};
  return e.querySelectorAll("select[data-category-id]").forEach((n) => {
    var o, a;
    const i = n.dataset.categoryId, r = (a = (o = n.value) == null ? void 0 : o.trim) == null ? void 0 : a.call(o);
    !i || !r || (t[i] = r);
  }), Object.keys(t).length > 0 ? t : null;
}
s(wd, "readCategorySelections");
async function zr(e, t, n) {
  if (!e) return null;
  try {
    if (!n)
      return await On(e, {});
    if (n === le)
      return await On(e, {
        mappingId: le,
        categories: null,
        updatedAt: Date.now()
      });
    const i = vn(t, n);
    return i ? await On(e, {
      mappingId: i.id,
      categories: i.categories,
      updatedAt: Date.now()
    }) : null;
  } catch (i) {
    return console.warn("eidolon-utilities | Failed to persist mapping selection", i), null;
  }
}
s(zr, "persistCurrentSelection");
function na(e, t) {
  if (!(e instanceof HTMLElement)) return;
  const n = e.querySelector(".eidolon-light-criteria-manager__section.is-bottom");
  n instanceof HTMLElement && (n.hidden = !!(t != null && t.hidden));
}
s(na, "updateManagerSectionVisibility");
function _t({ switcher: e, emptyState: t, state: n }) {
  const i = !!(n != null && n.base);
  e instanceof HTMLElement && (e.hidden = !i), t instanceof HTMLElement && (t.hidden = i);
}
s(_t, "updateActiveMappingVisibility");
function fl(e) {
  const t = (e == null ? void 0 : e.object) ?? (e == null ? void 0 : e.document) ?? null;
  return !(t != null && t.isEmbedded) || t.documentName !== "AmbientLight" ? null : t;
}
s(fl, "getAmbientLightDocument");
function Od(e) {
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
s(Od, "getPersistedAmbientLightDocument");
function vd() {
  nd();
}
s(vd, "registerLightCriteriaHooks");
vd();
const Ho = /* @__PURE__ */ new Map();
let $o = !1;
function ia(e, t) {
  Ho.has(e) && console.warn(`[${w}] Socket handler for type "${e}" already registered, overwriting.`), Ho.set(e, t);
}
s(ia, "registerSocketHandler");
function Oi(e, t) {
  if (!$o) {
    console.error(`[${w}] Socket not initialized. Call initializeSocket() first.`);
    return;
  }
  game.socket.emit(`module.${w}`, { type: e, payload: t });
}
s(Oi, "emitSocket");
function Md() {
  $o || (game.socket.on(`module.${w}`, (e) => {
    const { type: t, payload: n } = e ?? {}, i = Ho.get(t);
    i ? i(n) : console.warn(`[${w}] No socket handler for type "${t}"`);
  }), $o = !0, console.log(`[${w}] Socket initialized on channel module.${w}`));
}
s(Md, "initializeSocket");
const gl = "tween", ml = "tween-sequence", Po = "tween-sequence-cancel", ye = Object.freeze({
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
}), Vi = /* @__PURE__ */ new Map();
function ra({ type: e, execute: t, validate: n }) {
  Vi.has(e) && console.warn(`[tween-registry] Type "${e}" already registered, overwriting.`), Vi.set(e, { type: e, execute: t, validate: n ?? (() => {
  }) });
}
s(ra, "registerTweenType");
function Nr(e) {
  return Vi.get(e);
}
s(Nr, "getTweenType");
function Ad(e, t = {}) {
  const n = Nr(e);
  if (!n)
    throw new Error(`Unknown tween type: "${e}".`);
  return n.validate(t ?? {}), n;
}
s(Ad, "validateTweenEntry");
function Bo() {
  return [...Vi.keys()];
}
s(Bo, "listTweenTypes");
function hl(e) {
  const t = foundry.canvas.animation.CanvasAnimation;
  return {
    linear: t.easeLinear,
    easeInOutCosine: t.easeInOutCosine
  }[e] ?? t.easeInOutCosine;
}
s(hl, "resolveEasing");
function ji(e) {
  return e <= 0.04045 ? e / 12.92 : ((e + 0.055) / 1.055) ** 2.4;
}
s(ji, "srgbToLinear");
function ln(e) {
  return e <= 31308e-7 ? 12.92 * e : 1.055 * e ** (1 / 2.4) - 0.055;
}
s(ln, "linearToSrgb");
function Ua(e, t, n) {
  const i = 0.4122214708 * e + 0.5363325363 * t + 0.0514459929 * n, r = 0.2119034982 * e + 0.6806995451 * t + 0.1073969566 * n, o = 0.0883024619 * e + 0.2817188376 * t + 0.6299787005 * n, a = Math.cbrt(i), l = Math.cbrt(r), c = Math.cbrt(o);
  return [
    0.2104542553 * a + 0.793617785 * l - 0.0040720468 * c,
    1.9779984951 * a - 2.428592205 * l + 0.4505937099 * c,
    0.0259040371 * a + 0.7827717662 * l - 0.808675766 * c
  ];
}
s(Ua, "linearRgbToOklab");
function Nd(e, t, n) {
  const i = (e + 0.3963377774 * t + 0.2158037573 * n) ** 3, r = (e - 0.1055613458 * t - 0.0638541728 * n) ** 3, o = (e - 0.0894841775 * t - 1.291485548 * n) ** 3;
  return [
    4.0767416621 * i - 3.3077115913 * r + 0.2309699292 * o,
    -1.2684380046 * i + 2.6097574011 * r - 0.3413193965 * o,
    -0.0041960863 * i - 0.7034186147 * r + 1.707614701 * o
  ];
}
s(Nd, "oklabToLinearRgb");
function zi(e) {
  return [e.r, e.g, e.b];
}
s(zi, "colorToRgb");
function pl(e, t, n) {
  const i = /* @__PURE__ */ s((o) => Math.max(0, Math.min(1, o)), "clamp"), r = /* @__PURE__ */ s((o) => Math.round(i(o) * 255).toString(16).padStart(2, "0"), "toHex");
  return `#${r(e)}${r(t)}${r(n)}`;
}
s(pl, "rgbToHex");
function _d(e, t, n) {
  if (n <= 0) return e.toHTML();
  if (n >= 1) return t.toHTML();
  const i = foundry.utils.Color, [r, o, a] = e.hsl, [l, c, u] = t.hsl, d = (l - r + 0.5) % 1 - 0.5, g = (r + d * n + 1) % 1, h = o + (c - o) * n, y = a + (u - a) * n;
  return i.fromHSL([g, h, y]).toHTML();
}
s(_d, "interpolateHsl");
function Dd(e, t, n) {
  if (n <= 0) return e.toHTML();
  if (n >= 1) return t.toHTML();
  const [i, r, o] = zi(e).map(ji), [a, l, c] = zi(t).map(ji), u = ln(i + (a - i) * n), d = ln(r + (l - r) * n), g = ln(o + (c - o) * n);
  return pl(u, d, g);
}
s(Dd, "interpolateRgb");
function Fd(e, t, n) {
  if (n <= 0) return e.toHTML();
  if (n >= 1) return t.toHTML();
  const [i, r, o] = zi(e).map(ji), [a, l, c] = zi(t).map(ji), [u, d, g] = Ua(i, r, o), [h, y, b] = Ua(a, l, c), p = 0.02, T = Math.sqrt(d * d + g * g), E = Math.sqrt(y * y + b * b);
  let C, O, F;
  if (T < p || E < p)
    C = u + (h - u) * n, O = d + (y - d) * n, F = g + (b - g) * n;
  else {
    const Y = Math.atan2(g, d);
    let $ = Math.atan2(b, y) - Y;
    $ > Math.PI && ($ -= 2 * Math.PI), $ < -Math.PI && ($ += 2 * Math.PI), C = u + (h - u) * n;
    const Q = T + (E - T) * n, A = Y + $ * n;
    O = Q * Math.cos(A), F = Q * Math.sin(A);
  }
  const [_, D, R] = Nd(C, O, F);
  return pl(ln(_), ln(D), ln(R));
}
s(Fd, "interpolateOklch");
const qo = {
  hsl: _d,
  rgb: Dd,
  oklch: Fd
};
function xd(e = "hsl") {
  return qo[e] ?? qo.hsl;
}
s(xd, "getInterpolator");
function Va() {
  return Object.keys(qo);
}
s(Va, "listInterpolationModes");
function kd(e) {
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
  if (e.mode && !Va().includes(e.mode))
    throw new Error(
      `light-color tween: unknown mode "${e.mode}". Available: ${Va().join(", ")}`
    );
}
s(kd, "validate$2");
async function Rd(e, t = {}) {
  const { CanvasAnimation: n } = foundry.canvas.animation, { Color: i } = foundry.utils, { uuid: r, toColor: o, toAlpha: a, mode: l = "oklch" } = e, c = Array.isArray(r) ? r : [r];
  if (c.length === 0)
    return console.warn("light-color tween: empty uuid array, nothing to animate."), !0;
  const {
    durationMS: u = 2e3,
    easing: d = "easeInOutCosine",
    commit: g = !0,
    startEpochMS: h = null,
    signal: y = null
  } = t, b = hl(d), p = o != null, T = a != null, E = p ? xd(l) : null, C = p ? i.fromString(o) : null;
  if (p && !C.valid) throw new Error(`light-color tween: invalid target color "${o}".`);
  async function O(_) {
    var V, H;
    if (y != null && y.aborted) return !1;
    const D = await fromUuid(_);
    if (!D) return !1;
    const R = D.object;
    if (!R) return !1;
    let Y;
    if (p) {
      const P = (V = D.config) == null ? void 0 : V.color;
      P != null && P.valid || console.warn(`light-color tween: source color invalid on ${_}, using white.`), Y = P != null && P.valid ? P : i.fromString("#ffffff");
    }
    const ie = T ? ((H = D._source.config) == null ? void 0 : H.alpha) ?? 0.5 : null, $ = { t: 0 }, Q = `ambient-hue-tween:${_}`;
    n.terminateAnimation(Q), y && y.addEventListener("abort", () => {
      n.terminateAnimation(Q);
    }, { once: !0 });
    const A = typeof h == "number" ? Math.max(0, Math.min(u, Date.now() - h)) : 0, U = /* @__PURE__ */ s((P) => {
      const J = {};
      p && (J.color = E(Y, C, P)), T && (J.alpha = ie + (a - ie) * P), D.updateSource({ config: J }), R.initializeLightSource();
    }, "applyFrame");
    A > 0 && ($.t = A / u, U($.t));
    const G = await n.animate(
      [{ parent: $, attribute: "t", to: 1 }],
      {
        name: Q,
        duration: u,
        easing: b,
        time: A,
        ontick: /* @__PURE__ */ s(() => U($.t), "ontick")
      }
    );
    if (G !== !1) {
      if (y != null && y.aborted) return !1;
      const P = {};
      p && (P.color = C.toHTML()), T && (P.alpha = a), D.updateSource({ config: P }), R.initializeLightSource();
    }
    if (g && G !== !1 && D.canUserModify(game.user, "update")) {
      if (y != null && y.aborted) return !1;
      const P = {}, J = {};
      p && (P.color = Y.toHTML(), J["config.color"] = C.toHTML()), T && (P.alpha = ie, J["config.alpha"] = a), D.updateSource({ config: P }), await D.update(J);
    }
    return G !== !1;
  }
  return s(O, "animateOne"), (await Promise.all(c.map(O))).every(Boolean);
}
s(Rd, "execute$2");
function Hd() {
  ra({ type: "light-color", execute: Rd, validate: kd });
}
s(Hd, "registerLightColorTween");
const mt = /* @__PURE__ */ new WeakMap();
function $d(e) {
  if ((Array.isArray(e.uuid) ? e.uuid : [e.uuid]).some((n) => !n || typeof n != "string"))
    throw new Error("light-state tween: 'uuid' is required (string or array of AmbientLight document UUIDs).");
  if (typeof e.enabled != "boolean")
    throw new Error("light-state tween: 'enabled' (boolean) is required.");
}
s($d, "validate$1");
async function Pd(e, t = {}) {
  const { CanvasAnimation: n } = foundry.canvas.animation, { uuid: i, enabled: r } = e, o = Array.isArray(i) ? i : [i];
  if (o.length === 0)
    return console.warn("light-state tween: empty uuid array, nothing to animate."), !0;
  const {
    durationMS: a = 2e3,
    easing: l = "easeInOutCosine",
    commit: c = !0,
    startEpochMS: u = null,
    signal: d = null
  } = t, g = hl(l);
  async function h(b) {
    var D, R, Y, ie;
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
      alpha: ((D = p._source.config) == null ? void 0 : D.alpha) ?? 0.5
    };
    if (mt.set(p, C), I(`light-state START ${r ? "ON" : "OFF"} | snap: ${JSON.stringify(C)} | _source.hidden=${p._source.hidden}, _source.config.alpha=${(R = p._source.config) == null ? void 0 : R.alpha}`), r && !C.hidden || !r && C.hidden)
      return mt.delete(p), !0;
    const O = C.alpha, F = typeof u == "number" ? Math.max(0, Math.min(a, Date.now() - u)) : 0, _ = /* @__PURE__ */ s(($) => {
      p.updateSource({ config: { alpha: $ } }), T.initializeLightSource();
    }, "applyAlpha");
    if (r) {
      p.updateSource({ hidden: !1, config: { alpha: 0 } }), T.initializeLightSource(), canvas.perception.update({ refreshLighting: !0, refreshVision: !0 });
      const $ = { t: 0 };
      F > 0 && ($.t = F / a, _(O * $.t));
      const Q = await n.animate(
        [{ parent: $, attribute: "t", to: 1 }],
        {
          name: E,
          duration: a,
          easing: g,
          time: F,
          ontick: /* @__PURE__ */ s(() => _(O * $.t), "ontick")
        }
      );
      return Q !== !1 && !(d != null && d.aborted) && c && p.canUserModify(game.user, "update") ? (p.updateSource({ hidden: !0, config: { alpha: O } }), await p.update({ hidden: !1 }), I(`light-state FADE-IN committed. _source.hidden=${p._source.hidden}, _source.config.alpha=${(Y = p._source.config) == null ? void 0 : Y.alpha}`), mt.delete(p)) : Q === !1 || mt.delete(p), Q !== !1;
    } else {
      p.updateSource({ hidden: !1, config: { alpha: C.alpha } }), T.initializeLightSource();
      const $ = { t: 0 };
      F > 0 && ($.t = F / a, _(O * (1 - $.t)));
      const Q = await n.animate(
        [{ parent: $, attribute: "t", to: 1 }],
        {
          name: E,
          duration: a,
          easing: g,
          time: F,
          ontick: /* @__PURE__ */ s(() => _(O * (1 - $.t)), "ontick")
        }
      );
      return Q !== !1 && !(d != null && d.aborted) && c && p.canUserModify(game.user, "update") ? (await p.update({ hidden: !0 }), p.updateSource({ config: { alpha: O } }), T.initializeLightSource(), I(`light-state FADE-OUT committed+restored. _source.hidden=${p._source.hidden}, _source.config.alpha=${(ie = p._source.config) == null ? void 0 : ie.alpha}`), mt.delete(p)) : Q === !1 || (p.updateSource({ hidden: !0, config: { alpha: O } }), T.initializeLightSource(), mt.delete(p)), Q !== !1;
    }
  }
  return s(h, "animateOne"), (await Promise.all(o.map(h))).every(Boolean);
}
s(Pd, "execute$1");
function Bd() {
  ra({ type: "light-state", execute: Pd, validate: $d });
}
s(Bd, "registerLightStateTween");
var bt, Rn, Hn, $n, Pn, Bn, un;
const ca = class ca {
  /**
   * @param {AbortController} controller
   */
  constructor(t) {
    M(this, bt);
    M(this, Rn);
    M(this, Hn);
    M(this, $n);
    M(this, Pn);
    M(this, Bn, !1);
    M(this, un, null);
    v(this, bt, t), v(this, $n, new Promise((n) => {
      v(this, Rn, n);
    })), v(this, Pn, new Promise((n) => {
      v(this, Hn, n);
    }));
  }
  /** @returns {Promise<boolean>} Resolves true (completed) or false (cancelled/failed). */
  get finished() {
    return m(this, $n);
  }
  /** @returns {Promise<{status: string, [k: string]: unknown}>} */
  get result() {
    return m(this, Pn);
  }
  /** @returns {boolean} */
  get cancelled() {
    return m(this, bt).signal.aborted;
  }
  /** @returns {AbortSignal} */
  get signal() {
    return m(this, bt).signal;
  }
  /** @returns {string} */
  get status() {
    return m(this, un) ? m(this, un).status : this.cancelled ? "cancelled" : "running";
  }
  /** Abort the timeline, triggering onCancel callbacks. */
  cancel(t = "cancelled") {
    m(this, bt).signal.aborted || m(this, bt).abort(t);
  }
  /**
   * Called internally by the execution engine when the timeline finishes.
   * @param {boolean} completed - true if all steps ran, false if cancelled
   */
  _resolve(t) {
    if (m(this, Bn)) return;
    v(this, Bn, !0);
    const n = typeof t == "boolean" ? { status: t ? "completed" : "cancelled" } : t ?? { status: "cancelled" };
    v(this, un, n), m(this, Rn).call(this, n.status === "completed"), m(this, Hn).call(this, n);
  }
};
bt = new WeakMap(), Rn = new WeakMap(), Hn = new WeakMap(), $n = new WeakMap(), Pn = new WeakMap(), Bn = new WeakMap(), un = new WeakMap(), s(ca, "TimelineHandle");
let Uo = ca;
const nn = /* @__PURE__ */ new Map();
function qd(e, t) {
  const n = nn.get(e);
  n && !n.cancelled && n.cancel("replaced-by-name"), nn.set(e, t), t.finished.then(() => {
    nn.get(e) === t && nn.delete(e);
  });
}
s(qd, "registerTimeline");
function yl(e) {
  const t = nn.get(e);
  return t && !t.cancelled ? (t.cancel("cancelled-by-name"), !0) : !1;
}
s(yl, "cancelTimeline");
function Ud(e) {
  return nn.get(e);
}
s(Ud, "getTimeline");
function Vd(e, t) {
  return e <= 0 ? Promise.resolve() : new Promise((n, i) => {
    if (t.aborted) return i(t.reason);
    const r = setTimeout(n, e);
    t.addEventListener("abort", () => {
      clearTimeout(r), i(t.reason);
    }, { once: !0 });
  });
}
s(Vd, "cancellableDelay");
var qe, Tt, qn, Un;
const ua = class ua {
  constructor(t) {
    /** @type {TweenTimeline} */
    M(this, qe);
    /** @type {Array<{ type: string, params: object, opts?: object, detach: boolean }>} */
    M(this, Tt, []);
    /** @type {Function|null} */
    M(this, qn, null);
    /** @type {Function|null} */
    M(this, Un, null);
    v(this, qe, t);
  }
  /**
   * Add a tween entry to this step.
   * @param {string} type  Registered tween type name
   * @param {object} params  Type-specific parameters
   * @param {object} [opts]  Options (durationMS, easing, etc.)
   * @returns {StepBuilder} this
   */
  add(t, n, i) {
    return m(this, Tt).push({ type: t, params: n, opts: i ?? {}, detach: !1 }), this;
  }
  /**
   * Mark the last entry as fire-and-forget (does not block step progression).
   * @returns {StepBuilder} this
   */
  detach() {
    if (m(this, Tt).length === 0)
      throw new Error("StepBuilder.detach(): no entry to detach.");
    return m(this, Tt)[m(this, Tt).length - 1].detach = !0, this;
  }
  /**
   * Callback invoked before this step's tweens start.
   * @param {Function} fn
   * @returns {StepBuilder} this
   */
  before(t) {
    return v(this, qn, t), this;
  }
  /**
   * Callback invoked after this step's awaited tweens complete.
   * @param {Function} fn
   * @returns {StepBuilder} this
   */
  after(t) {
    return v(this, Un, t), this;
  }
  // ── Delegation to parent TweenTimeline for fluent chaining ──
  /** Start a new step (finalizes this one). */
  step() {
    return m(this, qe).step();
  }
  /** Insert a delay between steps. */
  delay(t) {
    return m(this, qe).delay(t);
  }
  /** Register onComplete callback. */
  onComplete(t) {
    return m(this, qe).onComplete(t);
  }
  /** Register onCancel callback. */
  onCancel(t) {
    return m(this, qe).onCancel(t);
  }
  /** Register onError callback. */
  onError(t) {
    return m(this, qe).onError(t);
  }
  /** Execute the timeline. */
  run(t) {
    return m(this, qe).run(t);
  }
  /** Serialize the timeline. */
  toJSON() {
    return m(this, qe).toJSON();
  }
  // ── Internal access ──
  /** @returns {{ entries: Array, before: Function|null, after: Function|null }} */
  _finalize() {
    return {
      entries: m(this, Tt),
      before: m(this, qn),
      after: m(this, Un)
    };
  }
};
qe = new WeakMap(), Tt = new WeakMap(), qn = new WeakMap(), Un = new WeakMap(), s(ua, "StepBuilder");
let Vo = ua;
var Ee, ve, qt, Et, Vn, jn, zn, Gn, ee, wn, bl, Tl, vi, tt, Dt;
const da = class da {
  constructor() {
    M(this, ee);
    /** @type {string|null} */
    M(this, Ee, null);
    /** @type {string} */
    M(this, ve, ye.ABORT);
    /** @type {Array<{ kind: "step", data: object } | { kind: "delay", ms: number }>} */
    M(this, qt, []);
    /** @type {StepBuilder|null} */
    M(this, Et, null);
    /** @type {Function|null} */
    M(this, Vn, null);
    /** @type {Function|null} */
    M(this, jn, null);
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
    return v(this, Ee, t), this;
  }
  /**
   * Set the error policy for step execution.
   * @param {"abort"|"continue"} policy
   * @returns {TweenTimeline} this
   */
  errorPolicy(t) {
    if (t !== ye.ABORT && t !== ye.CONTINUE)
      throw new Error(`Invalid error policy: "${t}". Use "abort" or "continue".`);
    return v(this, ve, t), this;
  }
  /**
   * Start a new step. Finalizes the previous step if one is open.
   * @returns {StepBuilder}
   */
  step() {
    return L(this, ee, wn).call(this), v(this, Et, new Vo(this)), m(this, Et);
  }
  /**
   * Insert a delay (in ms) between the previous step and the next.
   * @param {number} ms
   * @returns {TweenTimeline} this
   */
  delay(t) {
    return L(this, ee, wn).call(this), m(this, qt).push({ kind: "delay", ms: t }), this;
  }
  /**
   * Callback invoked before the first step runs.
   * @param {Function} fn
   * @returns {TweenTimeline} this
   */
  beforeAll(t) {
    return v(this, Vn, t), this;
  }
  /**
   * Callback invoked on successful completion.
   * @param {Function} fn
   * @returns {TweenTimeline} this
   */
  onComplete(t) {
    return v(this, jn, t), this;
  }
  /**
   * Callback invoked on cancellation (mutually exclusive with onComplete).
   * @param {Function} fn
   * @returns {TweenTimeline} this
   */
  onCancel(t) {
    return v(this, zn, t), this;
  }
  /**
   * Callback invoked on runtime failure (mutually exclusive with onComplete/onCancel).
   * @param {(outcome: object) => void} fn
   * @returns {TweenTimeline} this
   */
  onError(t) {
    return v(this, Gn, t), this;
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
    L(this, ee, wn).call(this);
    const n = new AbortController();
    t.signal && (t.signal.aborted ? n.abort(t.signal.reason ?? "parent-aborted") : t.signal.addEventListener("abort", () => {
      n.signal.aborted || n.abort(t.signal.reason ?? "parent-aborted");
    }, { once: !0 }));
    const i = new Uo(n);
    m(this, Ee) && qd(m(this, Ee), i);
    const r = t.broadcast ?? game.user.isGM, o = t.commit ?? game.user.isGM, a = t.startEpochMS ?? Date.now();
    return r && m(this, Ee) && Oi(ml, {
      name: m(this, Ee),
      data: this.toJSON(),
      startEpochMS: a
    }), L(this, ee, bl).call(this, i, { commit: o, startEpochMS: a }).then((l) => {
      var c, u, d;
      i._resolve(l), l.status === En.COMPLETED ? (c = m(this, jn)) == null || c.call(this) : l.status === En.CANCELLED ? ((u = m(this, zn)) == null || u.call(this), r && m(this, Ee) && Oi(Po, {
        name: m(this, Ee),
        reason: l.reason
      })) : ((d = m(this, Gn)) == null || d.call(this, l), r && m(this, Ee) && Oi(Po, {
        name: m(this, Ee),
        reason: "failed"
      }));
    }), i;
  }
  /**
   * Serialize the timeline to a JSON-safe object (steps/delays only, no hooks).
   * @returns {object}
   */
  toJSON() {
    L(this, ee, wn).call(this);
    const t = [];
    for (const i of m(this, qt))
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
    return m(this, Ee) && (n.name = m(this, Ee)), m(this, ve) !== ye.ABORT && (n.errorPolicy = m(this, ve)), n;
  }
};
Ee = new WeakMap(), ve = new WeakMap(), qt = new WeakMap(), Et = new WeakMap(), Vn = new WeakMap(), jn = new WeakMap(), zn = new WeakMap(), Gn = new WeakMap(), ee = new WeakSet(), // ── Private ─────────────────────────────────────────────────────────
wn = /* @__PURE__ */ s(function() {
  m(this, Et) && (m(this, qt).push({ kind: "step", data: m(this, Et)._finalize() }), v(this, Et, null));
}, "#finalizeCurrentStep"), bl = /* @__PURE__ */ s(async function(t, { commit: n, startEpochMS: i }) {
  const r = t.signal, o = [];
  let a = -1;
  try {
    if (r.aborted) return L(this, ee, tt).call(this, r.reason);
    const l = await L(this, ee, vi).call(this, m(this, Vn), gt.BEFORE_ALL, null);
    if (l) {
      if (m(this, ve) === ye.ABORT) return l;
      o.push(l);
    }
    let c = 0;
    const u = [];
    for (const d of m(this, qt)) {
      if (r.aborted) return L(this, ee, tt).call(this, r.reason);
      if (d.kind === "delay") {
        try {
          await Vd(d.ms, r);
        } catch {
          return L(this, ee, tt).call(this, r.reason);
        }
        c += d.ms;
        continue;
      }
      a += 1;
      const { entries: g, before: h, after: y } = d.data, b = await L(this, ee, vi).call(this, h, gt.BEFORE_STEP, a);
      if (b) {
        if (m(this, ve) === ye.ABORT) return b;
        o.push(b);
        continue;
      }
      if (r.aborted) return L(this, ee, tt).call(this, r.reason);
      const p = [];
      let T = 0;
      for (const O of g) {
        const F = Nr(O.type);
        if (!F) {
          const Y = L(this, ee, Dt).call(this, new Error(`TweenTimeline: unknown tween type "${O.type}"`), gt.ENTRY, a, O.type);
          if (m(this, ve) === ye.ABORT) return Y;
          o.push(Y), console.warn(Y.error.message);
          continue;
        }
        const _ = {
          ...O.opts,
          commit: n,
          startEpochMS: i + c,
          signal: r
        }, D = _.durationMS ?? 2e3, R = Promise.resolve().then(() => F.execute(O.params, _)).then((Y) => Y === !1 ? {
          ok: !1,
          failure: L(this, ee, Dt).call(this, new Error("Tween entry returned false."), gt.ENTRY, a, O.type)
        } : { ok: !0 }).catch((Y) => ({
          ok: !1,
          failure: L(this, ee, Dt).call(this, Y, gt.ENTRY, a, O.type)
        }));
        O.detach ? u.push(R) : (p.push(R), T = Math.max(T, D));
      }
      const E = await L(this, ee, Tl).call(this, p, r);
      if (E === null) return L(this, ee, tt).call(this, r.reason);
      for (const O of E)
        if (!O.ok) {
          if (m(this, ve) === ye.ABORT) return O.failure;
          o.push(O.failure), console.warn("TweenTimeline: entry failed:", O.failure.error);
        }
      const C = await L(this, ee, vi).call(this, y, gt.AFTER_STEP, a);
      if (C) {
        if (m(this, ve) === ye.ABORT) return C;
        o.push(C);
      }
      if (r.aborted) return L(this, ee, tt).call(this, r.reason);
      c += T;
    }
    if (!r.aborted) {
      const d = await Promise.allSettled(u);
      for (const g of d)
        if (g.status === "rejected") {
          const h = L(this, ee, Dt).call(this, g.reason, gt.ENTRY, a);
          if (m(this, ve) === ye.ABORT) return h;
          o.push(h);
        }
    }
    return r.aborted ? L(this, ee, tt).call(this, r.reason) : {
      status: En.COMPLETED,
      ...o.length > 0 ? { errors: o } : {}
    };
  } catch (l) {
    return r.aborted ? L(this, ee, tt).call(this, r.reason) : (console.error("TweenTimeline execution error:", l), L(this, ee, Dt).call(this, l, gt.RUNTIME, a));
  }
}, "#execute"), /**
 * @param {Array<Promise<{ok: boolean, failure?: object}>>} stepPromises
 * @param {AbortSignal} signal
 * @returns {Promise<Array<{ok: boolean, failure?: object}>|null>}
 */
Tl = /* @__PURE__ */ s(function(t, n) {
  return t.length === 0 ? Promise.resolve([]) : n.aborted ? Promise.resolve(null) : new Promise((i, r) => {
    const o = /* @__PURE__ */ s(() => i(null), "onAbort");
    n.addEventListener("abort", o, { once: !0 }), Promise.all(t).then((a) => {
      n.removeEventListener("abort", o), i(a);
    }).catch((a) => {
      n.removeEventListener("abort", o), r(a);
    });
  });
}, "#waitForStep"), vi = /* @__PURE__ */ s(async function(t, n, i) {
  if (!t) return null;
  try {
    return await t(), null;
  } catch (r) {
    const o = L(this, ee, Dt).call(this, r, n, i ?? void 0);
    return m(this, ve) === ye.CONTINUE && console.warn(`TweenTimeline: hook failure in ${n}:`, r), o;
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
Dt = /* @__PURE__ */ s(function(t, n, i, r) {
  const o = t instanceof Error ? t : new Error(String(t));
  return {
    status: En.FAILED,
    error: o,
    phase: n,
    ...typeof i == "number" ? { stepIndex: i } : {},
    ...r ? { entryType: r } : {}
  };
}, "#failedOutcome"), s(da, "TweenTimeline");
let Gi = da;
function oa(e) {
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
s(oa, "validateSequenceJSON");
function El(e) {
  oa(e);
  for (let t = 0; t < e.timeline.length; t++) {
    const n = e.timeline[t];
    if (Array.isArray(n))
      for (let i = 0; i < n.length; i++) {
        const r = n[i];
        try {
          Ad(r.type, r.params ?? {});
        } catch (o) {
          throw new Error(`Sequence JSON: timeline[${t}][${i}] failed semantic validation: ${o.message}`);
        }
      }
  }
}
s(El, "validateSequenceSemantics");
function aa(e, t = {}) {
  oa(e), t.validateSemantics && El(e);
  const n = new Gi();
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
s(aa, "compileSequence");
function jd(e) {
  oa(e), El(e);
}
s(jd, "validate");
async function zd(e, t = {}) {
  return aa(e, { validateSemantics: !0 }).run({
    broadcast: !1,
    commit: t.commit,
    startEpochMS: t.startEpochMS,
    signal: t.signal
  }).finished;
}
s(zd, "execute");
function Gd() {
  ra({ type: "sequence", execute: zd, validate: jd });
}
s(Gd, "registerSequenceTween");
async function Wd(e, t, n = {}) {
  if (!game.user.isGM)
    return ui.notifications.warn("Only the GM can dispatch tweens."), !1;
  const i = Nr(e);
  if (!i)
    throw new Error(`Unknown tween type: "${e}". Registered types: ${Bo().join(", ")}`);
  i.validate(t);
  const { durationMS: r = 2e3, easing: o = "easeInOutCosine", commit: a = !0 } = n, l = Date.now();
  return Oi(gl, {
    type: e,
    params: t,
    durationMS: r,
    easing: o,
    startEpochMS: l,
    commit: !1
  }), i.execute(t, { durationMS: r, easing: o, commit: a, startEpochMS: l });
}
s(Wd, "dispatchTween");
function Kd(e) {
  const { type: t, params: n, durationMS: i, easing: r, startEpochMS: o, commit: a } = e ?? {}, l = Nr(t);
  if (!l) {
    console.warn(`[${w}] Received unknown tween type over socket: "${t}"`);
    return;
  }
  l.execute(n, {
    durationMS: i,
    easing: r,
    commit: a ?? !1,
    startEpochMS: o
  });
}
s(Kd, "handleTweenSocketMessage");
Hd();
Bd();
Gd();
ia(gl, Kd);
ia(ml, Jd);
ia(Po, Yd);
function Jd(e) {
  const { data: t, startEpochMS: n } = e ?? {};
  if (!t) {
    console.warn(`[${w}] Received empty tween-sequence socket message.`);
    return;
  }
  try {
    aa(t, { validateSemantics: !0 }).run({ commit: !1, startEpochMS: n, broadcast: !1 });
  } catch (i) {
    console.error(`[${w}] Failed to run received tween sequence:`, i);
  }
}
s(Jd, "handleSequenceSocketMessage");
function Yd(e) {
  const { name: t } = e ?? {};
  t && yl(t);
}
s(Yd, "handleSequenceCancelMessage");
function Qd() {
  Hooks.once("ready", () => {
    Md();
    const e = game.modules.get(w);
    e.api || (e.api = {}), e.api.tween = {
      dispatch: Wd,
      types: Bo,
      Timeline: Gi,
      ErrorPolicy: ye,
      compileSequence: aa,
      cancelTimeline: yl,
      getTimeline: Ud
    }, console.log(`[${w}] Tween API registered. Types: ${Bo().join(", ")}`);
  });
}
s(Qd, "registerTweenHooks");
Qd();
//# sourceMappingURL=eidolon-utilities.js.map
