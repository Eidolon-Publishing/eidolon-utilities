var Qo = Object.defineProperty;
var al = Object.getPrototypeOf;
var sl = Reflect.get;
var Xo = (e) => {
  throw TypeError(e);
};
var ll = (e, t, n) => t in e ? Qo(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var s = (e, t) => Qo(e, "name", { value: t, configurable: !0 });
var Pe = (e, t, n) => ll(e, typeof t != "symbol" ? t + "" : t, n), yr = (e, t, n) => t.has(e) || Xo("Cannot " + n);
var h = (e, t, n) => (yr(e, t, "read from private field"), n ? n.call(e) : t.get(e)), M = (e, t, n) => t.has(e) ? Xo("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, n), v = (e, t, n, i) => (yr(e, t, "write to private field"), i ? i.call(e, n) : t.set(e, n), n), L = (e, t, n) => (yr(e, t, "access private method"), n);
var nt = (e, t, n) => sl(al(e), n, t);
const S = "eidolon-utilities", hi = "timeTriggerActive", Ar = "timeTriggerHideWindow", Nr = "timeTriggerShowPlayerWindow", Dr = "timeTriggerAllowRealTime", Da = "timeTriggers", ei = "timeTriggerHistory", Fr = "debug", _r = "timeFormat", xr = "manageTime", Rr = "secondsPerRound";
const cl = [-30, -15, -5, 5, 15, 30], Gt = 1440 * 60, ti = "playSound", kn = 6;
function f(e, t) {
  var n, i;
  return (i = (n = game.i18n) == null ? void 0 : n.has) != null && i.call(n, e) ? game.i18n.localize(e) : t;
}
s(f, "localize");
function pi(e) {
  return typeof e != "string" ? "" : e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
s(pi, "escapeHtml");
function Ge(e) {
  var t;
  return e == null ? e : (t = foundry == null ? void 0 : foundry.utils) != null && t.duplicate ? foundry.utils.duplicate(e) : JSON.parse(JSON.stringify(e));
}
s(Ge, "duplicateData");
function ul() {
  var e;
  return (e = foundry == null ? void 0 : foundry.utils) != null && e.randomID ? foundry.utils.randomID() : typeof (crypto == null ? void 0 : crypto.randomUUID) == "function" ? crypto.randomUUID() : Math.random().toString(36).slice(2, 10);
}
s(ul, "generateTriggerId");
function Fa(e) {
  if (typeof e != "string") return null;
  const t = e.trim();
  if (!t) return null;
  const n = t.match(/^([0-9]{1,2}):([0-9]{2})(?::([0-9]{2}))?$/);
  if (!n) return null;
  const i = Number(n[1]), r = Number(n[2]), o = n[3] !== void 0 ? Number(n[3]) : 0;
  return !Number.isInteger(i) || !Number.isInteger(r) || !Number.isInteger(o) || i < 0 || i > 23 || r < 0 || r > 59 || o < 0 || o > 59 ? null : i * 3600 + r * 60 + o;
}
s(Fa, "parseTriggerTimeToSeconds");
function un() {
  var e, t;
  return ((e = game.scenes) == null ? void 0 : e.current) ?? ((t = game.scenes) == null ? void 0 : t.active) ?? null;
}
s(un, "getActiveScene");
function We(e) {
  return (e == null ? void 0 : e.object) ?? (e == null ? void 0 : e.document) ?? null;
}
s(We, "getSceneFromApplication");
function Ce(e) {
  return e && typeof e.getFlag == "function" && typeof e.setFlag == "function";
}
s(Ce, "hasSceneDocument");
const kr = /* @__PURE__ */ new Set(), Hr = /* @__PURE__ */ new Set(), $r = /* @__PURE__ */ new Set(), Pr = /* @__PURE__ */ new Set();
let kt = !1, yn = !1, yi = kn, bi = "12h", Zo = !1;
function br(e) {
  kt = !!e;
  for (const t of kr)
    try {
      t(kt);
    } catch (n) {
      console.error(`${S} | Debug change handler failed`, n);
    }
}
s(br, "notifyDebugChange");
function Tr(e) {
  yn = !!e;
  for (const t of Hr)
    try {
      t(yn);
    } catch (n) {
      console.error(`${S} | Manage time change handler failed`, n);
    }
}
s(Tr, "notifyManageTimeChange");
function _a(e) {
  return e === "24h" ? "24h" : "12h";
}
s(_a, "normalizeTimeFormatValue");
function vo(e) {
  const t = Number(e);
  return !Number.isFinite(t) || t <= 0 ? kn : t;
}
s(vo, "normalizeSecondsPerRoundValue");
function Er(e) {
  const t = vo(e);
  yi = t;
  for (const n of $r)
    try {
      n(t);
    } catch (i) {
      console.error(`${S} | Seconds-per-round change handler failed`, i);
    }
}
s(Er, "notifySecondsPerRoundChange");
function Cr(e) {
  const t = _a(e);
  bi = t;
  for (const n of Pr)
    try {
      n(t);
    } catch (i) {
      console.error(`${S} | Time format change handler failed`, i);
    }
}
s(Cr, "notifyTimeFormatChange");
function dl() {
  var t;
  if (Zo) return;
  if (Zo = !0, !((t = game == null ? void 0 : game.settings) != null && t.register)) {
    console.warn(
      `${S} | game.settings.register is unavailable. Module settings could not be registered.`
    );
    return;
  }
  const e = typeof game.settings.registerChange == "function";
  game.settings.register(S, Fr, {
    name: f("EIDOLON.TimeTrigger.DebugSettingName", "Enable debug logging"),
    hint: f(
      "EIDOLON.TimeTrigger.DebugSettingHint",
      "Write detailed time-trigger diagnostics to the browser console."
    ),
    scope: "world",
    config: !0,
    type: Boolean,
    default: !1,
    onChange: e ? void 0 : br
  }), e && game.settings.registerChange(S, Fr, br), kt = Mo(), br(kt), game.settings.register(S, xr, {
    name: f("EIDOLON.TimeTrigger.ManageTimeSettingName", "Manage Game Time"),
    hint: f(
      "EIDOLON.TimeTrigger.ManageTimeSettingHint",
      "Allow Eidolon Utilities to advance world time automatically while the game is unpaused. Warning: This may conflict with other time-management modules."
    ),
    scope: "world",
    config: !0,
    type: Boolean,
    default: !1,
    onChange: e ? void 0 : Tr
  }), e && game.settings.registerChange(S, xr, Tr), yn = gl(), Tr(yn), game.settings.register(S, Rr, {
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
    default: kn,
    range: { min: 1, max: 3600, step: 1 },
    onChange: e ? void 0 : Er
  }), e && game.settings.registerChange(
    S,
    Rr,
    Er
  ), yi = vo(ml()), Er(yi), game.settings.register(S, _r, {
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
    onChange: e ? void 0 : Cr
  }), e && game.settings.registerChange(S, _r, Cr), bi = _a(xa()), Cr(bi);
}
s(dl, "registerTimeTriggerSettings");
function Mo() {
  var e;
  try {
    if ((e = game == null ? void 0 : game.settings) != null && e.get)
      return !!game.settings.get(S, Fr);
  } catch (t) {
    console.error(`${S} | Failed to read debug setting`, t);
  }
  return !1;
}
s(Mo, "getDebugSetting");
function fl() {
  return kt = Mo(), kt;
}
s(fl, "refreshDebugSettingCache");
function gl() {
  var e;
  try {
    if ((e = game == null ? void 0 : game.settings) != null && e.get)
      return !!game.settings.get(S, xr);
  } catch (t) {
    console.error(`${S} | Failed to read manage time setting`, t);
  }
  return !1;
}
s(gl, "getManageTimeSetting");
function xa() {
  var e;
  try {
    if ((e = game == null ? void 0 : game.settings) != null && e.get)
      return game.settings.get(S, _r) === "24h" ? "24h" : "12h";
  } catch (t) {
    console.error(`${S} | Failed to read time format setting`, t);
  }
  return "12h";
}
s(xa, "getTimeFormatSetting");
function ml() {
  var e;
  try {
    if ((e = game == null ? void 0 : game.settings) != null && e.get) {
      const t = game.settings.get(S, Rr);
      return vo(t);
    }
  } catch (t) {
    console.error(`${S} | Failed to read seconds-per-round setting`, t);
  }
  return kn;
}
s(ml, "getSecondsPerRoundSetting");
function hl(e) {
  if (typeof e != "function")
    return () => {
    };
  kr.add(e);
  try {
    e(kt);
  } catch (t) {
    console.error(`${S} | Debug change handler failed`, t);
  }
  return () => {
    kr.delete(e);
  };
}
s(hl, "onDebugSettingChange");
function Ra(e) {
  if (typeof e != "function")
    return () => {
    };
  Hr.add(e);
  try {
    e(yn);
  } catch (t) {
    console.error(`${S} | Manage time change handler failed`, t);
  }
  return () => {
    Hr.delete(e);
  };
}
s(Ra, "onManageTimeSettingChange");
function Ao(e) {
  if (typeof e != "function")
    return () => {
    };
  Pr.add(e);
  try {
    e(bi);
  } catch (t) {
    console.error(`${S} | Time format change handler failed`, t);
  }
  return () => {
    Pr.delete(e);
  };
}
s(Ao, "onTimeFormatSettingChange");
function pl(e) {
  if (typeof e != "function")
    return () => {
    };
  $r.add(e);
  try {
    e(yi);
  } catch (t) {
    console.error(`${S} | Seconds-per-round change handler failed`, t);
  }
  return () => {
    $r.delete(e);
  };
}
s(pl, "onSecondsPerRoundSettingChange");
let ar = !1, Br = !1;
function qr(e) {
  ar = !!e;
}
s(qr, "updateDebugState");
function ka() {
  Br || (Br = !0, qr(Mo()), hl((e) => {
    qr(e), console.info(`${S} | Debug ${ar ? "enabled" : "disabled"}`);
  }));
}
s(ka, "ensureInitialized");
function No() {
  return Br || ka(), ar;
}
s(No, "shouldLog");
function Ha(e) {
  if (!e.length)
    return [`${S} |`];
  const [t, ...n] = e;
  return typeof t == "string" ? [`${S} | ${t}`, ...n] : [`${S} |`, t, ...n];
}
s(Ha, "formatArgs");
function yl() {
  ka();
}
s(yl, "initializeDebug");
function bl() {
  return qr(fl()), ar;
}
s(bl, "syncDebugState");
function w(...e) {
  No() && console.debug(...Ha(e));
}
s(w, "debugLog");
function Zt(...e) {
  No() && console.group(...Ha(e));
}
s(Zt, "debugGroup");
function dt() {
  No() && console.groupEnd();
}
s(dt, "debugGroupEnd");
function Wt(e) {
  var r;
  const t = (r = e == null ? void 0 : e.getFlag) == null ? void 0 : r.call(e, S, Da);
  if (!t) return [];
  const n = Ge(t), i = Array.isArray(n) ? n : [];
  return w("Loaded time triggers", {
    sceneId: (e == null ? void 0 : e.id) ?? null,
    count: i.length
  }), i;
}
s(Wt, "getTimeTriggers");
async function $a(e, t) {
  e != null && e.setFlag && (w("Persisting time triggers", {
    sceneId: e.id,
    count: Array.isArray(t) ? t.length : 0
  }), await e.setFlag(S, Da, t));
}
s($a, "setTimeTriggers");
function Tl(e) {
  var r;
  const t = (r = e == null ? void 0 : e.getFlag) == null ? void 0 : r.call(e, S, ei);
  if (!t) return {};
  const n = Ge(t);
  if (!n || typeof n != "object") return {};
  const i = {};
  for (const [o, a] of Object.entries(n))
    typeof a == "number" && Number.isFinite(a) && (i[o] = a);
  return w("Loaded time trigger history", {
    sceneId: (e == null ? void 0 : e.id) ?? null,
    keys: Object.keys(i)
  }), i;
}
s(Tl, "getTimeTriggerHistory");
async function Lr(e, t) {
  var c, u, d, g;
  if (!e) return;
  const n = {};
  if (t && typeof t == "object")
    for (const [m, y] of Object.entries(t))
      typeof y == "number" && Number.isFinite(y) && (n[m] = y);
  const i = ((c = e.getFlag) == null ? void 0 : c.call(e, S, ei)) ?? {}, r = {};
  if (i && typeof i == "object")
    for (const [m, y] of Object.entries(i))
      typeof y == "number" && Number.isFinite(y) && (r[m] = y);
  const o = Object.keys(n), a = Object.keys(r);
  if (typeof ((u = foundry == null ? void 0 : foundry.utils) == null ? void 0 : u.deepEqual) == "function" ? foundry.utils.deepEqual(r, n) : JSON.stringify(r) === JSON.stringify(n)) {
    w("Skip history update because state is unchanged", {
      sceneId: (e == null ? void 0 : e.id) ?? null
    });
    return;
  }
  w("Updating time trigger history", {
    sceneId: (e == null ? void 0 : e.id) ?? null,
    keys: o,
    removedKeys: a.filter((m) => !o.includes(m))
  });
  try {
    a.length && typeof e.unsetFlag == "function" && await e.unsetFlag(S, ei), o.length && await e.setFlag(S, ei, n);
  } catch (m) {
    console.error(`${S} | Failed to persist time trigger history`, m), (g = (d = ui.notifications) == null ? void 0 : d.error) == null || g.call(
      d,
      f(
        "EIDOLON.TimeTrigger.HistoryPersistError",
        "Failed to persist the scene's time trigger history."
      )
    );
  }
}
s(Lr, "updateTimeTriggerHistory");
const Ti = /* @__PURE__ */ new Map(), ea = /* @__PURE__ */ new Set();
function El(e) {
  if (!(e != null && e.id))
    throw new Error(`${S} | Action definitions require an id.`);
  if (Ti.has(e.id))
    throw new Error(`${S} | Duplicate time trigger action id: ${e.id}`);
  Ti.set(e.id, {
    ...e
  }), w("Registered time trigger action", { actionId: e.id });
}
s(El, "registerAction");
function Hn(e) {
  return Ti.get(e) ?? null;
}
s(Hn, "getAction");
function Cl(e) {
  const t = Hn(e);
  return t ? typeof t.label == "function" ? t.label() : t.label : e;
}
s(Cl, "getActionLabel");
function ta() {
  return Array.from(Ti.values());
}
s(ta, "listActions");
async function Pa(e, t) {
  var i, r;
  const n = Hn(t == null ? void 0 : t.action);
  if (!n || typeof n.execute != "function") {
    const o = f(
      "EIDOLON.TimeTrigger.UnknownAction",
      "Encountered an unknown time trigger action and skipped it."
    );
    (r = (i = ui.notifications) == null ? void 0 : i.warn) == null || r.call(i, o), console.warn(`${S} | Unknown time trigger action`, t), w("Encountered unknown time trigger action", {
      triggerId: (t == null ? void 0 : t.id) ?? null,
      actionId: (t == null ? void 0 : t.action) ?? null
    });
    return;
  }
  w("Executing action handler", {
    actionId: n.id,
    triggerId: (t == null ? void 0 : t.id) ?? null,
    sceneId: (e == null ? void 0 : e.id) ?? null
  }), await n.execute({ scene: e, trigger: t });
}
s(Pa, "executeTriggerAction");
function Ll(e) {
  const t = Hn(e == null ? void 0 : e.action);
  return !t || typeof t.buildSummaryParts != "function" ? [] : t.buildSummaryParts({ trigger: e, escapeHtml: pi, localize: f }) ?? [];
}
s(Ll, "buildActionSummaryParts");
function wl(e) {
  const t = Hn(e == null ? void 0 : e.action);
  return !t || typeof t.buildFormContent != "function" ? "" : t.buildFormContent({ trigger: e, escapeHtml: pi, localize: f }) ?? "";
}
s(wl, "buildActionFormSection");
function Il(e, t) {
  const n = Hn(e == null ? void 0 : e.action);
  !n || typeof n.prepareFormData != "function" || n.prepareFormData({ trigger: e, formData: t });
}
s(Il, "applyActionFormData");
function Sl(e, t, n) {
  var o, a;
  const i = `${(e == null ? void 0 : e.id) ?? "unknown"}:${(t == null ? void 0 : t.id) ?? (t == null ? void 0 : t.action) ?? "unknown"}:${n}`;
  if (ea.has(i)) return;
  ea.add(i);
  const r = f(
    "EIDOLON.TimeTrigger.MissingDataWarning",
    "A scene time trigger is missing required data and was skipped."
  );
  (a = (o = ui.notifications) == null ? void 0 : o.warn) == null || a.call(o, r), console.warn(`${S} | Missing trigger data (${n})`, { scene: e == null ? void 0 : e.id, trigger: t });
}
s(Sl, "warnMissingTriggerData");
async function Ol({ scene: e, trigger: t }) {
  var o, a, l, c, u;
  const n = (l = (a = (o = t == null ? void 0 : t.data) == null ? void 0 : o.path) == null ? void 0 : a.trim) == null ? void 0 : l.call(a);
  if (!n) {
    Sl(e, t, "missing-audio-path");
    return;
  }
  const i = {
    src: n,
    autoplay: !0,
    loop: !1
  }, r = (() => {
    var d, g, m, y, b;
    return typeof ((g = (d = foundry == null ? void 0 : foundry.audio) == null ? void 0 : d.AudioHelper) == null ? void 0 : g.play) == "function" ? foundry.audio.AudioHelper.play(i, !0) : typeof ((y = (m = game == null ? void 0 : game.audio) == null ? void 0 : m.constructor) == null ? void 0 : y.play) == "function" ? game.audio.constructor.play(i, !0) : typeof ((b = game == null ? void 0 : game.audio) == null ? void 0 : b.play) == "function" ? game.audio.play(i, !0) : null;
  })();
  if (!r) {
    console.error(`${S} | Foundry audio helper is unavailable`), (u = (c = ui.notifications) == null ? void 0 : c.error) == null || u.call(
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
s(Ol, "executePlaySoundAction");
El({
  id: ti,
  label: /* @__PURE__ */ s(() => f("EIDOLON.TimeTrigger.ActionPlaySound", "Play Sound"), "label"),
  execute: Ol,
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
var va;
const { ApplicationV2: $n, HandlebarsApplicationMixin: Pn } = ((va = foundry.applications) == null ? void 0 : va.api) ?? {};
if (!$n || !Pn)
  throw new Error(
    `${S} | ApplicationV2 API unavailable. Update Foundry VTT to v13 or newer.`
  );
const gt = "AM", Ht = "PM";
function ft() {
  return xa();
}
s(ft, "getConfiguredTimeFormat");
function sr(e) {
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
s(sr, "parseCanonicalTimeString");
function ze({ hours: e, minutes: t, seconds: n }) {
  if (!Number.isInteger(e) || !Number.isInteger(t) || e < 0 || e > 23 || t < 0 || t > 59) return null;
  const i = String(e).padStart(2, "0"), r = String(t).padStart(2, "0");
  if (Number.isInteger(n)) {
    if (n < 0 || n > 59) return null;
    const o = String(n).padStart(2, "0");
    return `${i}:${r}:${o}`;
  }
  return `${i}:${r}`;
}
s(ze, "formatCanonicalTime");
function vl(e, { format: t } = {}) {
  if (!e || typeof e != "object") return null;
  const n = Number(e.hour), i = Number(e.minute), r = e.second !== void 0 && e.second !== null, o = r ? Number(e.second) : null, a = r && Number.isFinite(o) ? Math.floor(Math.max(0, Math.min(59, o))) : null;
  if (!Number.isFinite(n) || !Number.isFinite(i)) return null;
  const l = t ?? ft();
  return Ei(
    {
      hours: n,
      minutes: i,
      seconds: a
    },
    l
  );
}
s(vl, "formatTimeComponentsForDisplay");
function Ml(e, { format: t } = {}) {
  const n = sr(e);
  if (!n) return "";
  const i = t ?? ft();
  return Ei(n, i);
}
s(Ml, "formatTriggerTimeForDisplay");
function Ei(e, t = "12h") {
  if (!e) return "";
  const { hours: n, minutes: i, seconds: r = null } = e;
  if (!Number.isInteger(n) || !Number.isInteger(i)) return "";
  const o = Number.isInteger(r);
  if (t === "24h") {
    const m = `${String(n).padStart(2, "0")}:${String(i).padStart(2, "0")}`;
    return o ? `${m}:${String(r).padStart(2, "0")}` : m;
  }
  const a = n >= 12 ? Ht : gt, l = n % 12 === 0 ? 12 : n % 12, c = String(l), u = String(i).padStart(2, "0"), d = `${c}:${u}`, g = a === gt ? f("EIDOLON.TimeTrigger.TimePeriodAM", gt) : f("EIDOLON.TimeTrigger.TimePeriodPM", Ht);
  if (o) {
    const m = String(r).padStart(2, "0");
    return `${d}:${m} ${g}`;
  }
  return `${d} ${g}`;
}
s(Ei, "formatTimeParts");
function na(e, t = ft()) {
  const n = sr(e);
  if (t === "24h")
    return {
      format: t,
      canonical: n ? ze(n) ?? "" : "",
      hour: n ? String(n.hours).padStart(2, "0") : "",
      minute: n ? String(n.minutes).padStart(2, "0") : ""
    };
  if (!n)
    return {
      format: t,
      canonical: "",
      hour: "",
      minute: "",
      period: gt
    };
  const i = n.hours >= 12 ? Ht : gt, r = n.hours % 12 === 0 ? 12 : n.hours % 12;
  return {
    format: t,
    canonical: ze(n) ?? "",
    hour: String(r),
    minute: String(n.minutes).padStart(2, "0"),
    period: i
  };
}
s(na, "getTimeFormValues");
function Al({ hour: e, minute: t, period: n, time: i }, r = ft()) {
  if (r === "24h") {
    const y = typeof e == "string" ? e.trim() : "", b = typeof t == "string" ? t.trim() : "", p = typeof i == "string" ? i.trim() : "";
    if (!y && !b && p) {
      const I = sr(p);
      return I ? { canonical: ze(I) ?? "", error: null } : {
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
    const E = Number(y), T = Number(b);
    return !Number.isInteger(E) || E < 0 || E > 23 ? {
      canonical: "",
      error: f(
        "EIDOLON.TimeTrigger.TimeFormatInvalid24",
        "Enter a valid time in HH:MM format."
      )
    } : !Number.isInteger(T) || T < 0 || T > 59 ? {
      canonical: "",
      error: f(
        "EIDOLON.TimeTrigger.TimeFormatInvalid24",
        "Enter a valid time in HH:MM format."
      )
    } : { canonical: ze({
      hours: E,
      minutes: T
    }) ?? "", error: null };
  }
  const o = typeof e == "string" ? e.trim() : "", a = typeof t == "string" ? t.trim() : "", l = typeof n == "string" ? n.trim().toUpperCase() : "";
  if (!o || !a || !l)
    return { canonical: "", error: f("EIDOLON.TimeTrigger.TimeFormatMissing", "Enter a complete time.") };
  if (l !== gt && l !== Ht)
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
    hours: l === Ht ? d + 12 : d,
    minutes: u
  };
  return {
    canonical: ze(m) ?? "",
    error: null
  };
}
s(Al, "normalizeFormTimeInput");
function Nl() {
  return [
    {
      value: gt,
      label: f("EIDOLON.TimeTrigger.TimePeriodAM", gt)
    },
    {
      value: Ht,
      label: f("EIDOLON.TimeTrigger.TimePeriodPM", Ht)
    }
  ];
}
s(Nl, "getPeriodOptions");
var wt, It, J, Ba, _i, xi, qa, Vr, jr, Ri, ki, Ua, Va, ja, zr, Gr, Wr, Hi, $i, Kr, Pi, za, Ga;
const Lt = class Lt extends Pn($n) {
  constructor(n = {}) {
    var a;
    const { scene: i, showControls: r, ...o } = n ?? {};
    super(o);
    M(this, J);
    M(this, wt, null);
    M(this, It, null);
    M(this, _i, /* @__PURE__ */ s((n) => {
      var r, o;
      n.preventDefault();
      const i = Number((o = (r = n.currentTarget) == null ? void 0 : r.dataset) == null ? void 0 : o.delta);
      Number.isFinite(i) && (w("Time delta button clicked", { delta: i }), this._advanceTime(i));
    }, "#onDeltaClick"));
    M(this, xi, /* @__PURE__ */ s((n) => {
      var i, r;
      n.preventDefault(), !(!this.showControls || !((i = game.user) != null && i.isGM)) && (w("Time value double clicked", { sceneId: ((r = this.scene) == null ? void 0 : r.id) ?? null }), L(this, J, qa).call(this));
    }, "#onTimeDoubleClick"));
    M(this, Ri, /* @__PURE__ */ s((n) => {
      if (this.isEditingTime && !this._commitTimeInProgress)
        if (n.key === "Enter") {
          n.preventDefault();
          const i = n.currentTarget, r = typeof (i == null ? void 0 : i.value) == "string" ? i.value : "";
          L(this, J, jr).call(this, r);
        } else n.key === "Escape" && (n.preventDefault(), L(this, J, Vr).call(this));
    }, "#onTimeInputKeydown"));
    M(this, ki, /* @__PURE__ */ s((n) => {
      if (!this.isEditingTime || this._commitTimeInProgress || this._suppressBlurCommit) return;
      const i = n.currentTarget, r = typeof (i == null ? void 0 : i.value) == "string" ? i.value : "";
      L(this, J, jr).call(this, r);
    }, "#onTimeInputBlur"));
    M(this, Hi, /* @__PURE__ */ s((n) => {
      const i = !!n;
      if (this.manageTimeEnabled === i) return;
      this.manageTimeEnabled = i, (this.rendered ?? this.isRendered ?? !1) && this.render({ force: !0 });
    }, "#handleManageTimeChange"));
    M(this, $i, /* @__PURE__ */ s(async (n) => {
      var o, a, l, c, u, d, g, m, y;
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
        await i.setFlag(S, Dr, r), this.sceneAllowsRealTime = r;
        const b = r ? f(
          "EIDOLON.TimeTrigger.SceneRealTimeEnabled",
          "Automatic real-time flow enabled for this scene."
        ) : f(
          "EIDOLON.TimeTrigger.SceneRealTimeDisabled",
          "Automatic real-time flow disabled for this scene."
        );
        (g = (d = ui.notifications) == null ? void 0 : d.info) == null || g.call(d, b);
      } catch (b) {
        console.error(`${S} | Failed to toggle scene real-time flow`, b), (y = (m = ui.notifications) == null ? void 0 : m.error) == null || y.call(
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
    M(this, Pi, /* @__PURE__ */ s(() => {
      (this.rendered ?? this.isRendered ?? !1) && (this.isEditingTime && (this.editValue = L(this, J, zr).call(this)), this.render({ force: !0 }));
    }, "#handleTimeFormatChange"));
    this.scene = i ?? null, this.showControls = typeof r == "boolean" ? r : !!((a = game.user) != null && a.isGM), this.isEditingTime = !1, this.editValue = "", this._commitTimeInProgress = !1, this._suppressBlurCommit = !1, this.manageTimeEnabled = !1, this.sceneAllowsRealTime = L(this, J, Kr).call(this), v(this, wt, Ao(h(this, Pi))), v(this, It, Ra(h(this, Hi)));
  }
  async _prepareContext() {
    var T, C;
    const n = ((T = game.time) == null ? void 0 : T.components) ?? {}, r = ((n == null ? void 0 : n.second) !== void 0 && (n == null ? void 0 : n.second) !== null ? vl(n) : null) ?? L(this, J, Ba).call(this), o = ft(), a = o === "24h", l = a ? f("EIDOLON.TimeTrigger.EditTimePlaceholder24", "HH:MM") : f("EIDOLON.TimeTrigger.EditTimePlaceholder12", "HH:MM AM/PM"), c = this.showControls ? f(
      "EIDOLON.TimeTrigger.EditTimeHint",
      "Double-click to set a specific time."
    ) : "", u = this.showControls ? f(
      "EIDOLON.TimeTrigger.EditTimeLabel",
      "New time (HH:MM or HH:MM AM/PM)"
    ) : "", d = cl.map((I) => ({
      minutes: I,
      label: I > 0 ? `+${I}` : `${I}`
    })), g = !!this.manageTimeEnabled, m = L(this, J, Kr).call(this);
    this.sceneAllowsRealTime = m;
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
      sceneAllowsRealTime: m,
      realTimeButtonLabel: g ? m ? b : y : p,
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
      return (this.rendered ?? this.isRendered ?? !1) || (w("TimeTriggerWindow close request rerendering", {
        sceneId: ((r = this.scene) == null ? void 0 : r.id) ?? null
      }), this.render({ force: !0 })), this;
    w("Closing time trigger window", { sceneId: ((o = this.scene) == null ? void 0 : o.id) ?? null, force: !0 });
    const i = await super.close(n);
    return L(this, J, za).call(this), L(this, J, Ga).call(this), i;
  }
  async _advanceTime(n) {
    var r, o, a, l, c, u, d;
    const i = n * 60;
    if (w("Advancing world time", { sceneId: ((r = this.scene) == null ? void 0 : r.id) ?? null, minutes: n, seconds: i }), !((o = game.user) != null && o.isGM)) {
      (l = (a = ui.notifications) == null ? void 0 : a.warn) == null || l.call(a, f("EIDOLON.TimeTrigger.GMOnly", "Only the GM can adjust time."));
      return;
    }
    try {
      await game.time.advance(i);
    } catch (g) {
      console.error(`${S} | Failed to advance time`, g), (u = (c = ui.notifications) == null ? void 0 : c.error) == null || u.call(
        c,
        f("EIDOLON.TimeTrigger.Error", "Failed to update the world time.")
      ), w("Failed to advance time from window", {
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
        w("Binding time trigger interactions", {
          sceneId: ((o = this.scene) == null ? void 0 : o.id) ?? null,
          buttonCount: r.querySelectorAll("[data-delta]").length
        }), r.querySelectorAll("[data-delta]").forEach((u) => {
          u.addEventListener("click", h(this, _i));
        });
        const a = r.querySelector('.time-trigger-window__time-value[data-editable="true"]');
        a && a.addEventListener("dblclick", h(this, xi), { once: !1 });
        const l = r.querySelector(".time-trigger-window__time-input");
        l && (l.addEventListener("keydown", h(this, Ri)), l.addEventListener("blur", h(this, ki)), typeof l.focus == "function" && (l.focus(), typeof l.select == "function" && l.select()));
        const c = r.querySelector('[data-action="toggle-real-time"]');
        c && c.addEventListener("click", h(this, $i));
      }
      this._suppressBlurCommit = !1;
    }
  }
};
wt = new WeakMap(), It = new WeakMap(), J = new WeakSet(), Ba = /* @__PURE__ */ s(function() {
  var c;
  const n = (c = game.time) == null ? void 0 : c.worldTime;
  if (typeof n != "number" || !Number.isFinite(n)) return "";
  const i = 1440 * 60, r = (Math.floor(n) % i + i) % i, o = Math.floor(r / 3600), a = Math.floor(r % 3600 / 60), l = r % 60;
  return Ei({ hours: o, minutes: a, seconds: l }, ft());
}, "#formatFallbackTime"), _i = new WeakMap(), xi = new WeakMap(), qa = /* @__PURE__ */ s(function() {
  var n;
  (n = game.user) != null && n.isGM && (this.isEditingTime = !0, this._suppressBlurCommit = !1, this.editValue = L(this, J, zr).call(this), this.render({ force: !0 }));
}, "#enterTimeEditMode"), Vr = /* @__PURE__ */ s(function() {
  this.isEditingTime = !1, this.editValue = "", this._suppressBlurCommit = !1, this.render({ force: !0 });
}, "#cancelTimeEdit"), jr = /* @__PURE__ */ s(async function(n) {
  var o, a, l;
  if (!((o = game.user) != null && o.isGM) || !this.isEditingTime || this._commitTimeInProgress) return;
  this._commitTimeInProgress = !0;
  const i = typeof n == "string" ? n.trim() : "";
  if (!i) {
    L(this, J, Vr).call(this), this._commitTimeInProgress = !1;
    return;
  }
  const r = L(this, J, ja).call(this, i);
  if (r.error) {
    (l = (a = ui.notifications) == null ? void 0 : a.error) == null || l.call(a, r.error), this._suppressBlurCommit = !0, this.editValue = i, this.render({ force: !0 }), this._commitTimeInProgress = !1;
    return;
  }
  try {
    await L(this, J, Va).call(this, r.seconds, r.includeSeconds) ? (this.isEditingTime = !1, this.editValue = "", this.render({ force: !0 })) : (this.editValue = i, this.render({ force: !0 }));
  } finally {
    this._commitTimeInProgress = !1;
  }
}, "#commitTimeInput"), Ri = new WeakMap(), ki = new WeakMap(), Ua = /* @__PURE__ */ s(function() {
  var u, d;
  const n = (u = game.time) == null ? void 0 : u.worldTime;
  if (typeof n != "number" || !Number.isFinite(n))
    return "";
  const i = ((d = game.time) == null ? void 0 : d.components) ?? {}, r = Number(i.hour), o = Number(i.minute), a = i.second !== void 0 ? Number(i.second) : null, l = Number.isInteger(a);
  return (Number.isFinite(r) && Number.isFinite(o) ? ze({
    hours: Math.max(0, Math.min(23, Number(r))),
    minutes: Math.max(0, Math.min(59, Number(o))),
    seconds: l && Number.isFinite(a) ? Math.max(0, Math.min(59, Number(a))) : void 0
  }) ?? "" : "") ?? "";
}, "#getCurrentCanonicalTime"), Va = /* @__PURE__ */ s(async function(n, i) {
  var m, y, b, p, E, T, C, I, D, x;
  const r = (m = game.time) == null ? void 0 : m.worldTime;
  if (typeof r != "number" || !Number.isFinite(r))
    return (b = (y = ui.notifications) == null ? void 0 : y.error) == null || b.call(
      y,
      f(
        "EIDOLON.TimeTrigger.EditTimeUnavailable",
        "The world time is unavailable, so it can't be updated."
      )
    ), !1;
  if (!Number.isInteger(n) || n < 0 || n >= Gt)
    return (E = (p = ui.notifications) == null ? void 0 : p.error) == null || E.call(
      p,
      f(
        "EIDOLON.TimeTrigger.EditTimeInvalidRange",
        "Enter a time within the current day."
      )
    ), !1;
  const l = Math.floor(r / Gt) * Gt + n - r;
  if (!Number.isFinite(l) || l === 0)
    return !0;
  const c = Math.floor(n / 3600), u = Math.floor(n % 3600 / 60), d = n % 60, g = ze({
    hours: c,
    minutes: u,
    seconds: i ? d : void 0
  });
  try {
    w("Updating world time directly", {
      sceneId: ((T = this.scene) == null ? void 0 : T.id) ?? null,
      targetCanonical: g ?? null,
      diff: l
    }), await game.time.advance(l);
    const _ = Ei(
      {
        hours: c,
        minutes: u,
        seconds: i ? d : null
      },
      ft()
    );
    (I = (C = ui.notifications) == null ? void 0 : C.info) == null || I.call(
      C,
      f(
        "EIDOLON.TimeTrigger.EditTimeSuccess",
        "World time updated."
      ) + (_ ? ` ${_}` : "")
    );
  } catch (_) {
    return console.error(`${S} | Failed to set world time`, _), (x = (D = ui.notifications) == null ? void 0 : D.error) == null || x.call(
      D,
      f(
        "EIDOLON.TimeTrigger.EditTimeError",
        "Failed to update the world time."
      )
    ), !1;
  }
  return !0;
}, "#applyTargetSeconds"), ja = /* @__PURE__ */ s(function(n) {
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
    const m = Number(o[1]), y = Number(o[2]), b = o[3] !== void 0 ? Number(o[3]) : void 0;
    if (Number.isInteger(m) && m >= 0 && m <= 23 && Number.isInteger(y) && y >= 0 && y <= 59 && (b === void 0 || Number.isInteger(b) && b >= 0 && b <= 59)) {
      const p = m * 3600 + y * 60 + (b ?? 0);
      return {
        canonical: ze({ hours: m, minutes: y, seconds: b }),
        seconds: p,
        includeSeconds: b !== void 0,
        error: null
      };
    }
    return { error: i };
  }
  const { amLower: a, pmLower: l, periodPattern: c } = L(this, J, Gr).call(this), u = r.match(
    new RegExp(
      `^([0-9]{1,2}):([0-9]{2})(?::([0-9]{2}))?\\s*(${c})$`,
      "i"
    )
  );
  if (u) {
    let m = Number(u[1]);
    const y = Number(u[2]), b = u[3] !== void 0 ? Number(u[3]) : void 0, p = u[4] ?? "", E = typeof p == "string" ? ((g = p.toLocaleLowerCase) == null ? void 0 : g.call(p)) ?? p.toLowerCase() : "";
    if (Number.isInteger(m) && m >= 1 && m <= 12 && Number.isInteger(y) && y >= 0 && y <= 59 && (b === void 0 || Number.isInteger(b) && b >= 0 && b <= 59) && (E === a || E === l || E === "am" || E === "pm")) {
      m = m % 12, (E === l || E === "pm") && (m += 12);
      const C = m * 3600 + y * 60 + (b ?? 0);
      return {
        canonical: ze({ hours: m, minutes: y, seconds: b }),
        seconds: C,
        includeSeconds: b !== void 0,
        error: null
      };
    }
    return { error: i };
  }
  const d = Fa(r);
  if (d !== null) {
    const m = Math.floor(d / 3600), y = Math.floor(d % 3600 / 60), b = d % 60, p = b !== 0;
    return {
      canonical: ze({
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
}, "#parseInputTime"), zr = /* @__PURE__ */ s(function() {
  const n = L(this, J, Ua).call(this);
  if (!n) return "";
  if (ft() === "24h")
    return n;
  const r = sr(n);
  if (!r) return n;
  const o = Number(r.hours), a = Number(r.minutes), l = r.seconds !== null && r.seconds !== void 0 ? Number(r.seconds) : void 0;
  if (!Number.isFinite(o) || !Number.isFinite(a)) return n;
  const c = Number.isFinite(l), u = o % 12 === 0 ? 12 : o % 12, d = String(a).padStart(2, "0"), g = c ? `:${String(l).padStart(2, "0")}` : "", { amLabel: m, pmLabel: y } = L(this, J, Gr).call(this), b = o >= 12 ? y : m;
  return `${u}:${d}${g} ${b}`.trim();
}, "#getInitialEditValue"), Gr = /* @__PURE__ */ s(function() {
  var u, d;
  const n = f("EIDOLON.TimeTrigger.TimePeriodAM", "AM"), i = f("EIDOLON.TimeTrigger.TimePeriodPM", "PM"), r = ((u = n.toLocaleLowerCase) == null ? void 0 : u.call(n)) ?? n.toLowerCase(), o = ((d = i.toLocaleLowerCase) == null ? void 0 : d.call(i)) ?? i.toLowerCase(), a = L(this, J, Wr).call(this, n), l = L(this, J, Wr).call(this, i), c = `${a}|${l}|AM|PM`;
  return {
    amLabel: n,
    pmLabel: i,
    amLower: r,
    pmLower: o,
    periodPattern: c
  };
}, "#getPeriodMatchData"), Wr = /* @__PURE__ */ s(function(n) {
  return typeof n != "string" ? "" : n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}, "#escapeForRegex"), Hi = new WeakMap(), $i = new WeakMap(), Kr = /* @__PURE__ */ s(function() {
  const n = this.scene;
  if (!n || typeof n.getFlag != "function") return !1;
  try {
    return !!n.getFlag(S, Dr);
  } catch (i) {
    w("TimeTriggerWindow | Failed to read scene real-time flag", {
      sceneId: (n == null ? void 0 : n.id) ?? null,
      message: (i == null ? void 0 : i.message) ?? String(i)
    });
  }
  return !1;
}, "#readSceneRealTimeFlag"), Pi = new WeakMap(), za = /* @__PURE__ */ s(function() {
  if (typeof h(this, wt) == "function")
    try {
      h(this, wt).call(this);
    } catch (n) {
      console.error(`${S} | Failed to dispose time format subscription`, n);
    }
  v(this, wt, null);
}, "#disposeTimeFormatSubscription"), Ga = /* @__PURE__ */ s(function() {
  if (typeof h(this, It) == "function")
    try {
      h(this, It).call(this);
    } catch (n) {
      console.error(`${S} | Failed to dispose manage time subscription`, n);
    }
  v(this, It, null);
}, "#disposeManageTimeSubscription"), s(Lt, "TimeTriggerWindow"), Pe(Lt, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  nt(Lt, Lt, "DEFAULT_OPTIONS"),
  {
    id: `${S}-time-trigger`,
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
)), Pe(Lt, "PARTS", {
  content: {
    template: `modules/${S}/templates/time-trigger.html`
  }
});
let Ur = Lt;
function lr(e, t = {}) {
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
s(lr, "createApplicationFactory");
const ia = /* @__PURE__ */ new Set();
var ue, we, St, en, Wa, Ka;
const jo = class jo {
  constructor({ windowFactory: t } = {}) {
    M(this, en);
    M(this, ue, null);
    M(this, we, null);
    M(this, St);
    const n = lr(Ur);
    typeof t == "function" ? t.__eidolonFactorySignature === "options" ? v(this, St, (r, o = {}) => t({ scene: r, ...o ?? {} })) : v(this, St, t) : v(this, St, /* @__PURE__ */ s((r, o = {}) => n({ scene: r, ...o ?? {} }), "fallbackFactory"));
  }
  onReady() {
    var n;
    const t = typeof ((n = game.time) == null ? void 0 : n.worldTime) == "number" && Number.isFinite(game.time.worldTime) ? game.time.worldTime : null;
    w("TimeTriggerManager#onReady", { worldTime: t }), t !== null && v(this, we, t);
  }
  onCanvasReady(t) {
    const n = (t == null ? void 0 : t.scene) ?? un();
    w("TimeTriggerManager#onCanvasReady", { sceneId: (n == null ? void 0 : n.id) ?? null }), this.refreshTimeTriggerWindow(n), this.handleTimeTriggerEvaluation(n);
  }
  onUpdateScene(t) {
    const n = un();
    w("TimeTriggerManager#onUpdateScene", {
      sceneId: (t == null ? void 0 : t.id) ?? null,
      activeSceneId: (n == null ? void 0 : n.id) ?? null
    }), !(!n || t.id !== n.id) && (this.refreshTimeTriggerWindow(t), this.handleTimeTriggerEvaluation(t));
  }
  onUpdateWorldTime(t, n) {
    w("TimeTriggerManager#onUpdateWorldTime", {
      worldTime: t,
      diff: n,
      hasWindow: !!h(this, ue)
    }), h(this, ue) && h(this, ue).render();
    const i = un(), r = L(this, en, Wa).call(this, t, n);
    this.handleTimeTriggerEvaluation(i, t, r);
  }
  refreshTimeTriggerWindow(t) {
    var c, u, d;
    if (!t) return;
    const n = !!((c = game.user) != null && c.isGM), i = !!t.getFlag(S, hi), r = !!t.getFlag(S, Ar), o = !!t.getFlag(S, Nr);
    if (w("TimeTriggerManager#refreshTimeTriggerWindow", {
      sceneId: t.id,
      isGM: n,
      isActive: i,
      hideWindow: r,
      showPlayerWindow: o
    }), !(i && !r && (n || o))) {
      h(this, ue) && (w("Closing time trigger window", { reason: "not-visible" }), h(this, ue).close({ force: !0 }), v(this, ue, null));
      return;
    }
    const l = !!n;
    if (h(this, ue) && ((u = h(this, ue).scene) == null ? void 0 : u.id) === t.id) {
      w("Refreshing existing time trigger window", { sceneId: t.id }), h(this, ue).showControls = l, h(this, ue).render();
      return;
    }
    h(this, ue) && (w("Closing existing window before creating new instance", {
      previousSceneId: ((d = h(this, ue).scene) == null ? void 0 : d.id) ?? null
    }), h(this, ue).close({ force: !0 })), v(this, ue, h(this, St).call(this, t, { showControls: l })), w("Rendering new time trigger window", { sceneId: t.id }), h(this, ue).render({ force: !0 });
  }
  async handleTimeTriggerEvaluation(t, n, i) {
    var c;
    const r = t ?? un();
    if (!r) {
      w("handleTimeTriggerEvaluation skipped", {
        reason: "no-active-scene",
        providedSceneId: (t == null ? void 0 : t.id) ?? null,
        currentWorldTime: n
      }), typeof n == "number" && Number.isFinite(n) && v(this, we, n);
      return;
    }
    const o = typeof n == "number" && Number.isFinite(n) ? n : typeof ((c = game.time) == null ? void 0 : c.worldTime) == "number" ? game.time.worldTime : null;
    if (o === null) return;
    const a = typeof i == "number" && Number.isFinite(i) ? i : null, l = a !== null ? a : typeof h(this, we) == "number" && Number.isFinite(h(this, we)) ? h(this, we) : o;
    Zt("handleTimeTriggerEvaluation", {
      sceneId: r.id,
      previousWorldTime: l,
      currentWorldTime: o,
      overrideProvided: a !== null
    });
    try {
      await L(this, en, Ka).call(this, r, l, o);
    } catch (u) {
      console.error(`${S} | Unexpected error while evaluating time triggers`, u), w("handleTimeTriggerEvaluation error", { message: (u == null ? void 0 : u.message) ?? String(u) });
    } finally {
      v(this, we, o), dt();
    }
  }
};
ue = new WeakMap(), we = new WeakMap(), St = new WeakMap(), en = new WeakSet(), Wa = /* @__PURE__ */ s(function(t, n) {
  return typeof h(this, we) == "number" && Number.isFinite(h(this, we)) ? (w("Resolved previous world time from cache", {
    previousWorldTime: h(this, we)
  }), h(this, we)) : typeof t == "number" && Number.isFinite(t) && typeof n == "number" && Number.isFinite(n) ? (w("Resolved previous world time using diff", {
    worldTime: t,
    diff: n,
    resolved: t - n
  }), t - n) : typeof t == "number" && Number.isFinite(t) ? t : null;
}, "#resolvePreviousWorldTime"), Ka = /* @__PURE__ */ s(async function(t, n, i) {
  var b, p, E;
  if (!((b = game.user) != null && b.isGM)) {
    w("Skipping trigger evaluation because user is not a GM");
    return;
  }
  if (!(t != null && t.id)) {
    w("Skipping trigger evaluation because the scene is missing an id");
    return;
  }
  if (!!!t.getFlag(S, hi)) {
    w("Skipping trigger evaluation because scene is inactive", { sceneId: t.id });
    return;
  }
  if (typeof i != "number" || !Number.isFinite(i)) return;
  (typeof n != "number" || !Number.isFinite(n)) && (n = i);
  const o = Wt(t);
  if (!o.length) {
    w("No time triggers configured for scene", { sceneId: t.id });
    return;
  }
  const a = Tl(t), l = /* @__PURE__ */ new Set();
  for (const T of o)
    T != null && T.id && l.add(T.id);
  let c = !1;
  for (const T of Object.keys(a))
    l.has(T) || (delete a[T], c = !0);
  if (Zt("Evaluating scene time triggers", {
    sceneId: t.id,
    previousWorldTime: n,
    currentWorldTime: i,
    triggerCount: o.length
  }), i <= n) {
    w("Detected world time rewind", {
      previousWorldTime: n,
      currentWorldTime: i
    });
    for (const T of o) {
      if (!(T != null && T.id) || !T.allowReplayOnRewind) continue;
      const C = a[T.id];
      typeof C == "number" ? i < C ? (w("Clearing trigger history due to rewind", {
        triggerId: T.id,
        lastFired: C,
        currentWorldTime: i
      }), delete a[T.id], c = !0) : w("Preserving trigger history after rewind", {
        triggerId: T.id,
        lastFired: C,
        currentWorldTime: i
      }) : w("No history stored for rewind-enabled trigger", {
        triggerId: T.id
      });
    }
    c && (w("Persisting history cleanup after rewind", {
      sceneId: t.id
    }), await Lr(t, a)), dt();
    return;
  }
  const u = n, d = i, g = [], m = Math.floor(u / Gt), y = Math.floor(d / Gt);
  for (const T of o) {
    if (!(T != null && T.id)) continue;
    const C = Fa(T.time);
    if (C === null) {
      Dl(t, T), w("Skipping trigger with invalid time", {
        triggerId: T.id,
        time: T.time
      });
      continue;
    }
    for (let I = m; I <= y; I++) {
      const D = I * Gt + C;
      if (D < u || D > d) continue;
      const _ = a[T.id];
      if (typeof _ == "number" && _ >= D) {
        w("Skipping trigger because it already fired within window", {
          triggerId: T.id,
          lastFired: _,
          absoluteTime: D
        });
        continue;
      }
      g.push({ trigger: T, absoluteTime: D });
    }
  }
  if (!g.length) {
    c && await Lr(t, a), w("No triggers scheduled to fire within evaluation window", {
      sceneId: t.id
    }), dt();
    return;
  }
  g.sort((T, C) => T.absoluteTime - C.absoluteTime), w("Queued triggers for execution", {
    entries: g.map((T) => ({
      triggerId: T.trigger.id,
      absoluteTime: T.absoluteTime
    }))
  });
  for (const T of g)
    try {
      w("Executing time trigger action", {
        triggerId: T.trigger.id,
        absoluteTime: T.absoluteTime
      }), await Pa(t, T.trigger);
    } catch (C) {
      console.error(`${S} | Failed to execute time trigger action`, C), (E = (p = ui.notifications) == null ? void 0 : p.error) == null || E.call(
        p,
        f(
          "EIDOLON.TimeTrigger.TriggerActionError",
          "Failed to execute a scene time trigger action. Check the console for details."
        )
      ), w("Trigger execution failed", {
        triggerId: T.trigger.id,
        message: (C == null ? void 0 : C.message) ?? String(C)
      });
    } finally {
      a[T.trigger.id] = T.absoluteTime, c = !0, w("Recorded trigger execution", {
        triggerId: T.trigger.id,
        absoluteTime: T.absoluteTime
      });
    }
  c && (w("Persisting trigger history updates", { sceneId: t.id }), await Lr(t, a)), dt();
}, "#evaluateSceneTimeTriggers"), s(jo, "TimeTriggerManager");
let Jr = jo;
function Dl(e, t) {
  var r, o;
  const n = `${(e == null ? void 0 : e.id) ?? "unknown"}:${(t == null ? void 0 : t.id) ?? (t == null ? void 0 : t.time) ?? "unknown"}`;
  if (ia.has(n)) return;
  ia.add(n);
  const i = f(
    "EIDOLON.TimeTrigger.InvalidTimeWarning",
    "A scene time trigger has an invalid time value and was skipped."
  );
  (o = (r = ui.notifications) == null ? void 0 : r.warn) == null || o.call(r, i), console.warn(`${S} | Invalid time for trigger`, { scene: e == null ? void 0 : e.id, trigger: t });
}
s(Dl, "warnInvalidTriggerTime");
var _e, En, xe, ot, Ot, Ue, Qt, Bi, qi, Cn, Ln, vt, Ve, k, Qr, Ut, ni, Xr, ii, Zr, qe, Ja, eo, Ya, to, Qa, Ui, Vi, ji, zi, Gi, Wi, no, Xa, ri, Ki, Ji;
const zo = class zo {
  constructor() {
    M(this, k);
    M(this, _e, !1);
    M(this, En, kn);
    M(this, xe, /* @__PURE__ */ new Map());
    M(this, ot, null);
    M(this, Ot, null);
    M(this, Ue, 0);
    M(this, Qt, null);
    M(this, Bi, null);
    M(this, qi, null);
    M(this, Cn, !1);
    M(this, Ln, !1);
    M(this, vt, !1);
    M(this, Ve, !1);
    M(this, Ui, /* @__PURE__ */ s((t, n = {}) => {
      w("GameTimeAutomation | Pause state changed", {
        paused: t,
        userId: (n == null ? void 0 : n.userId) ?? null,
        broadcast: (n == null ? void 0 : n.broadcast) ?? null
      }), L(this, k, qe).call(this, { pausedOverride: t });
    }, "#handlePause"));
    M(this, Vi, /* @__PURE__ */ s((t) => {
      t != null && t.id && (h(this, xe).set(t.id, Math.max(t.round ?? 0, 1)), w("GameTimeAutomation | Combat started", { combatId: t.id, round: t.round ?? 0 }), L(this, k, qe).call(this));
    }, "#handleCombatStart"));
    M(this, ji, /* @__PURE__ */ s((t, n) => {
      if (!(t != null && t.id)) return;
      const i = typeof n == "number" && Number.isFinite(n) ? n : typeof t.round == "number" && Number.isFinite(t.round) ? t.round : 0, r = i > 0 ? i : 1, o = h(this, xe).get(t.id), a = o ? Math.max(o, 1) : 1, l = r > 1 ? Math.max(r - a, 0) : 0;
      if (w("GameTimeAutomation | Combat round change detected", {
        combatId: t.id,
        effectiveRound: r,
        completedRounds: l,
        enabled: h(this, _e),
        paused: (game == null ? void 0 : game.paused) ?? null
      }), l > 0 && h(this, _e) && h(this, Ve) && !(game != null && game.paused) && L(this, k, Ut).call(this) && L(this, k, ni).call(this, t)) {
        const c = l * h(this, En);
        c > 0 && (w("GameTimeAutomation | Advancing time for completed combat rounds", {
          combatId: t.id,
          completedRounds: l,
          delta: c
        }), L(this, k, to).call(this, c));
      }
      h(this, xe).set(t.id, Math.max(r, 1));
    }, "#handleCombatRound"));
    M(this, zi, /* @__PURE__ */ s((t) => {
      t != null && t.id && (h(this, xe).delete(t.id), w("GameTimeAutomation | Combat ended", { combatId: t.id }), L(this, k, qe).call(this));
    }, "#handleCombatEnd"));
    M(this, Gi, /* @__PURE__ */ s((t) => {
      t != null && t.id && (h(this, xe).delete(t.id), w("GameTimeAutomation | Combat deleted", { combatId: t.id }), L(this, k, qe).call(this));
    }, "#handleCombatDelete"));
    M(this, Wi, /* @__PURE__ */ s((t, n) => {
      if (t != null && t.id) {
        if (typeof (n == null ? void 0 : n.round) == "number" && Number.isFinite(n.round)) {
          const i = Math.max(n.round, 1);
          h(this, xe).set(t.id, i), w("GameTimeAutomation | Combat round manually updated", {
            combatId: t.id,
            round: i
          });
        }
        (Object.prototype.hasOwnProperty.call(n ?? {}, "active") || (n == null ? void 0 : n.round) !== void 0) && L(this, k, qe).call(this);
      }
    }, "#handleCombatUpdate"));
    M(this, Ki, /* @__PURE__ */ s((t) => {
      L(this, k, ri).call(this, t == null ? void 0 : t.scene), L(this, k, qe).call(this);
    }, "#handleCanvasReady"));
    M(this, Ji, /* @__PURE__ */ s((t) => {
      if (!Ce(t)) return;
      const n = L(this, k, no).call(this);
      if (!n || n.id !== t.id) return;
      L(this, k, ri).call(this, t) && L(this, k, qe).call(this);
    }, "#handleSceneUpdate"));
  }
  registerHooks() {
    h(this, Cn) || (v(this, Cn, !0), Hooks.on("pauseGame", h(this, Ui)), Hooks.on("combatStart", h(this, Vi)), Hooks.on("combatRound", h(this, ji)), Hooks.on("combatEnd", h(this, zi)), Hooks.on("deleteCombat", h(this, Gi)), Hooks.on("updateCombat", h(this, Wi)), Hooks.on("canvasReady", h(this, Ki)), Hooks.on("updateScene", h(this, Ji)));
  }
  initialize() {
    h(this, Ln) || (v(this, Ln, !0), v(this, Bi, Ra((t) => {
      const n = !!t, i = n !== h(this, _e);
      v(this, _e, n), w("GameTimeAutomation | Manage time toggled", { enabled: n }), i && n && L(this, k, Zr).call(this), L(this, k, qe).call(this);
    })), v(this, qi, pl((t) => {
      v(this, En, t), w("GameTimeAutomation | Seconds per round updated", { value: t });
    })), L(this, k, Zr).call(this), L(this, k, ri).call(this), L(this, k, qe).call(this));
  }
};
_e = new WeakMap(), En = new WeakMap(), xe = new WeakMap(), ot = new WeakMap(), Ot = new WeakMap(), Ue = new WeakMap(), Qt = new WeakMap(), Bi = new WeakMap(), qi = new WeakMap(), Cn = new WeakMap(), Ln = new WeakMap(), vt = new WeakMap(), Ve = new WeakMap(), k = new WeakSet(), Qr = /* @__PURE__ */ s(function() {
  var t;
  try {
    if (typeof ((t = globalThis.performance) == null ? void 0 : t.now) == "function")
      return globalThis.performance.now();
  } catch (n) {
    w("GameTimeAutomation | Failed to read high-resolution timestamp", {
      message: (n == null ? void 0 : n.message) ?? String(n)
    });
  }
  return Date.now();
}, "#currentTimestamp"), Ut = /* @__PURE__ */ s(function() {
  var t;
  return !!((t = game == null ? void 0 : game.user) != null && t.isGM && game.user.active !== !1);
}, "#canControlTime"), ni = /* @__PURE__ */ s(function(t) {
  var i, r;
  if (!t) return !1;
  if (t.active === !0) return !0;
  if (t.active === !1) return !1;
  const n = (i = game == null ? void 0 : game.combats) == null ? void 0 : i.active;
  return (n == null ? void 0 : n.id) === t.id ? !0 : ((r = game == null ? void 0 : game.combat) == null ? void 0 : r.id) === t.id ? game.combat.active ?? !0 : !1;
}, "#isCombatDocumentActive"), Xr = /* @__PURE__ */ s(function(t) {
  return t ? typeof t.started == "boolean" ? t.started : (t.round ?? 0) > 0 : !1;
}, "#hasCombatStarted"), ii = /* @__PURE__ */ s(function() {
  var i;
  const t = Array.isArray((i = game == null ? void 0 : game.combats) == null ? void 0 : i.contents) ? game.combats.contents : [];
  for (const r of t)
    if (L(this, k, ni).call(this, r) && L(this, k, Xr).call(this, r))
      return !0;
  const n = game == null ? void 0 : game.combat;
  return !!(n && L(this, k, ni).call(this, n) && L(this, k, Xr).call(this, n));
}, "#isCombatRunning"), Zr = /* @__PURE__ */ s(function() {
  var n;
  h(this, xe).clear();
  const t = Array.isArray((n = game == null ? void 0 : game.combats) == null ? void 0 : n.contents) ? game.combats.contents : [];
  for (const i of t)
    i != null && i.id && h(this, xe).set(i.id, Math.max(i.round ?? 0, 1));
}, "#hydrateRoundTracking"), qe = /* @__PURE__ */ s(function({ pausedOverride: t } = {}) {
  const n = typeof t == "boolean" ? t : !!(game != null && game.paused), i = h(this, _e), r = h(this, Ve), o = i && r, a = {
    manageTimeEnabled: i,
    sceneAllowsRealTime: r,
    effectiveEnabled: o,
    paused: n,
    canControl: L(this, k, Ut).call(this),
    combatRunning: L(this, k, ii).call(this),
    overrideApplied: typeof t == "boolean"
  };
  if (w("GameTimeAutomation | Sync running state", a), !o || !L(this, k, Ut).call(this)) {
    L(this, k, eo).call(this);
    return;
  }
  L(this, k, Ja).call(this);
}, "#syncRunningState"), Ja = /* @__PURE__ */ s(function() {
  h(this, ot) === null && (v(this, Ot, L(this, k, Qr).call(this)), v(this, ot, globalThis.setInterval(() => L(this, k, Ya).call(this), 1e3)), w("GameTimeAutomation | Started real-time ticker"));
}, "#startRealTimeTicker"), eo = /* @__PURE__ */ s(function() {
  h(this, ot) !== null && (globalThis.clearInterval(h(this, ot)), v(this, ot, null), w("GameTimeAutomation | Stopped real-time ticker")), v(this, Ot, null), v(this, Ue, 0), v(this, vt, !1);
}, "#stopRealTimeTicker"), Ya = /* @__PURE__ */ s(function() {
  if (!h(this, _e) || !h(this, Ve) || !L(this, k, Ut).call(this)) {
    L(this, k, eo).call(this);
    return;
  }
  const t = L(this, k, Qr).call(this);
  if (typeof t != "number" || !Number.isFinite(t)) return;
  const n = h(this, Ot) ?? t, i = (t - n) / 1e3;
  if (v(this, Ot, t), !Number.isFinite(i) || i <= 0) return;
  const r = !!(game != null && game.paused), o = L(this, k, ii).call(this);
  if (r || o) {
    h(this, vt) || w("GameTimeAutomation | Tick skipped", { paused: r, combatRunning: o }), v(this, vt, !0), v(this, Ue, 0);
    return;
  }
  v(this, vt, !1), w("GameTimeAutomation | Real-time tick", { deltaSeconds: i }), L(this, k, to).call(this, i);
}, "#tickRealTime"), to = /* @__PURE__ */ s(function(t) {
  if (!h(this, _e) || !h(this, Ve)) return;
  const n = Number(t);
  !Number.isFinite(n) || n <= 0 || (v(this, Ue, h(this, Ue) + n), !h(this, Qt) && v(this, Qt, L(this, k, Qa).call(this)));
}, "#queueAdvance"), Qa = /* @__PURE__ */ s(async function() {
  var t, n;
  for (; h(this, Ue) > 0; ) {
    if (!h(this, _e) || !h(this, Ve) || game != null && game.paused || !L(this, k, Ut).call(this) || L(this, k, ii).call(this)) {
      v(this, Ue, 0);
      break;
    }
    const i = h(this, Ue);
    v(this, Ue, 0);
    try {
      if (typeof ((t = game == null ? void 0 : game.time) == null ? void 0 : t.advance) == "function")
        w("GameTimeAutomation | Advancing world time", { delta: i }), await game.time.advance(i), w("GameTimeAutomation | World time advanced", {
          worldTime: ((n = game.time) == null ? void 0 : n.worldTime) ?? null
        });
      else {
        console.warn(`${S} | game.time.advance is unavailable; cannot manage world time.`);
        break;
      }
    } catch (r) {
      console.error(`${S} | Failed to advance world time`, r);
      break;
    }
  }
  v(this, Qt, null);
}, "#flushAdvanceQueue"), Ui = new WeakMap(), Vi = new WeakMap(), ji = new WeakMap(), zi = new WeakMap(), Gi = new WeakMap(), Wi = new WeakMap(), no = /* @__PURE__ */ s(function() {
  const t = un();
  return Ce(t) ? t : null;
}, "#getActiveSceneDocument"), Xa = /* @__PURE__ */ s(function(t) {
  if (!Ce(t)) return !1;
  try {
    return !!t.getFlag(S, Dr);
  } catch (n) {
    return w("GameTimeAutomation | Failed to read scene real-time flag", {
      sceneId: (t == null ? void 0 : t.id) ?? null,
      message: (n == null ? void 0 : n.message) ?? String(n)
    }), !1;
  }
}, "#isSceneRealTimeAllowed"), ri = /* @__PURE__ */ s(function(t) {
  const n = Ce(t) ? t : L(this, k, no).call(this), i = L(this, k, Xa).call(this, n), r = h(this, Ve);
  return v(this, Ve, i), r !== i ? (w("GameTimeAutomation | Scene real-time allowance changed", {
    sceneId: (n == null ? void 0 : n.id) ?? null,
    allows: i
  }), !0) : !1;
}, "#refreshSceneAutomationState"), Ki = new WeakMap(), Ji = new WeakMap(), s(zo, "GameTimeAutomation");
let Yr = zo;
var Ma, at, ye, Mt, Xe, Yi, ce, Za, es, ts, ns, Qi, ro, Xi, is, Zi, rs, os;
const Ye = class Ye extends Pn($n) {
  constructor(n = {}) {
    const { scene: i, trigger: r, triggerIndex: o, onSave: a, ...l } = n ?? {};
    super(l);
    M(this, ce);
    M(this, at, null);
    M(this, ye, null);
    M(this, Mt, null);
    M(this, Xe, null);
    M(this, Yi, /* @__PURE__ */ s(() => {
      (this.rendered ?? this.isRendered ?? !1) && (v(this, Xe, L(this, ce, Za).call(this)), this.render({ force: !0 }));
    }, "#handleTimeFormatChange"));
    M(this, Qi, /* @__PURE__ */ s((n) => {
      var o, a;
      const i = n.currentTarget, r = i == null ? void 0 : i.closest("form");
      r && (w("Trigger action selection changed", {
        sceneId: ((o = this.scene) == null ? void 0 : o.id) ?? null,
        triggerId: ((a = this.trigger) == null ? void 0 : a.id) ?? null,
        actionId: (i == null ? void 0 : i.value) ?? null
      }), L(this, ce, ro).call(this, i.value, r));
    }, "#onActionSelectChange"));
    M(this, Xi, /* @__PURE__ */ s((n) => {
      var u, d, g, m;
      n.preventDefault();
      const i = n.currentTarget, r = i == null ? void 0 : i.closest("form");
      if (!r) return;
      const o = (u = i.dataset) == null ? void 0 : u.target;
      if (!o) return;
      const a = typeof (CSS == null ? void 0 : CSS.escape) == "function" ? CSS.escape : (y) => y, l = r.querySelector(`[name="${a(o)}"]`);
      if (!l) return;
      w("Opening file picker for trigger", {
        sceneId: ((d = this.scene) == null ? void 0 : d.id) ?? null,
        triggerId: ((g = this.trigger) == null ? void 0 : g.id) ?? null,
        target: o
      }), new FilePicker({
        type: ((m = i.dataset) == null ? void 0 : m.type) || "audio",
        current: l.value,
        callback: /* @__PURE__ */ s((y) => {
          var b, p;
          l.value = y, l.dispatchEvent(new Event("change")), w("Trigger form file selected", {
            sceneId: ((b = this.scene) == null ? void 0 : b.id) ?? null,
            triggerId: ((p = this.trigger) == null ? void 0 : p.id) ?? null,
            target: o,
            path: y
          });
        }, "callback")
      }).render({ force: !0 });
    }, "#onFilePicker"));
    M(this, Zi, /* @__PURE__ */ s(async (n) => {
      var r, o;
      n.preventDefault();
      const i = n.currentTarget;
      i instanceof HTMLFormElement && (w("Trigger form submitted", {
        sceneId: ((r = this.scene) == null ? void 0 : r.id) ?? null,
        triggerId: ((o = this.trigger) == null ? void 0 : o.id) ?? null
      }), await L(this, ce, rs).call(this, i));
    }, "#onSubmit"));
    this.scene = i ?? null, this.trigger = r ?? null, this.triggerIndex = Number.isInteger(o) ? Number(o) : null, this.onSave = typeof a == "function" ? a : null, v(this, Mt, Ao(h(this, Yi)));
  }
  async _prepareContext() {
    var n, i;
    Zt("TriggerFormApplication#_prepareContext", {
      sceneId: ((n = this.scene) == null ? void 0 : n.id) ?? null,
      triggerId: ((i = this.trigger) == null ? void 0 : i.id) ?? null,
      triggerIndex: this.triggerIndex
    });
    try {
      const r = this.trigger ?? { action: ti, data: {} }, o = r.action ?? ti, a = na(r.time), l = a.format ?? "12h", c = l === "12h" ? Nl() : [], u = a.period ?? (c.length > 0 ? c[0].value : null), d = l === "12h" ? c.map((y) => ({
        ...y,
        selected: y.value === u
      })) : [], g = ta().map((y) => ({
        id: y.id,
        label: typeof y.label == "function" ? y.label() : y.label,
        selected: y.id === o
      })), m = ta().map((y) => {
        const b = y.id === r.action ? r : { ...r, action: y.id }, p = wl(b);
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
      dt();
    }
  }
  _onRender(n, i) {
    var c, u, d;
    super._onRender(n, i);
    const r = this.element;
    if (!r) return;
    w("Trigger form rendered", {
      sceneId: ((c = this.scene) == null ? void 0 : c.id) ?? null,
      triggerId: ((u = this.trigger) == null ? void 0 : u.id) ?? null
    });
    const o = Array.from(((d = document == null ? void 0 : document.body) == null ? void 0 : d.classList) ?? []).find(
      (g) => g.startsWith("theme-")
    );
    o && r.classList.add(o);
    const a = r.querySelector("form");
    if (!a) return;
    L(this, ce, is).call(this, a), L(this, ce, es).call(this, a), a.addEventListener("submit", h(this, Zi));
    const l = a.querySelector("[data-action-select]");
    l && (l.addEventListener("change", h(this, Qi)), L(this, ce, ro).call(this, l.value, a)), a.querySelectorAll("[data-action-file-picker]").forEach((g) => {
      g.addEventListener("click", h(this, Xi));
    });
  }
  async close(n = {}) {
    var i;
    if ((i = h(this, at)) == null || i.call(this), v(this, at, null), v(this, ye, null), v(this, Xe, null), typeof h(this, Mt) == "function")
      try {
        h(this, Mt).call(this);
      } catch (r) {
        console.error(`${S} | Failed to dispose trigger form time format subscription`, r);
      }
    return v(this, Mt, null), super.close(n);
  }
};
at = new WeakMap(), ye = new WeakMap(), Mt = new WeakMap(), Xe = new WeakMap(), Yi = new WeakMap(), ce = new WeakSet(), Za = /* @__PURE__ */ s(function() {
  var l, c, u, d, g, m, y;
  const n = (c = (l = this.element) == null ? void 0 : l.querySelector) == null ? void 0 : c.call(l, "form");
  if (!(n instanceof HTMLFormElement)) return null;
  const i = Array.from(n.elements ?? []), r = [];
  for (const b of i)
    if ((b instanceof HTMLInputElement || b instanceof HTMLSelectElement || b instanceof HTMLTextAreaElement) && b.name && !(((u = b.dataset) == null ? void 0 : u.timeHidden) !== void 0 || ((d = b.dataset) == null ? void 0 : d.timeHour) !== void 0 || ((g = b.dataset) == null ? void 0 : g.timeMinute) !== void 0 || ((m = b.dataset) == null ? void 0 : m.timePeriod) !== void 0)) {
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
    const b = o.querySelector("[data-time-hidden]"), p = o.querySelector("[data-time-hour]"), E = o.querySelector("[data-time-minute]"), T = o.querySelector("[data-time-period]");
    a = {
      format: ((y = o.dataset) == null ? void 0 : y.timeFormat) ?? null,
      canonical: b instanceof HTMLInputElement ? b.value : "",
      hour: p instanceof HTMLInputElement ? p.value : "",
      minute: E instanceof HTMLInputElement ? E.value : "",
      period: T instanceof HTMLSelectElement ? T.value : ""
    };
  }
  return {
    fields: r,
    time: a
  };
}, "#captureFormState"), es = /* @__PURE__ */ s(function(n) {
  if (!h(this, Xe)) return;
  if (!(n instanceof HTMLFormElement)) {
    v(this, Xe, null);
    return;
  }
  const { fields: i = [], time: r = null } = h(this, Xe) ?? {};
  v(this, Xe, null), L(this, ce, ts).call(this, n, i), L(this, ce, ns).call(this, n, r);
}, "#restorePendingFormState"), ts = /* @__PURE__ */ s(function(n, i) {
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
}, "#restoreFieldValues"), ns = /* @__PURE__ */ s(function(n, i) {
  var C, I, D;
  const r = n.querySelector("[data-time-format]");
  if (!(r instanceof HTMLElement)) {
    typeof h(this, ye) == "function" && h(this, ye).call(this);
    return;
  }
  const o = ((C = r.dataset) == null ? void 0 : C.timeFormat) === "24h" ? "24h" : "12h", a = r.querySelector("[data-time-hour]"), l = r.querySelector("[data-time-minute]"), c = r.querySelector("[data-time-period]"), u = r.querySelector("[data-time-hidden]");
  if (!i) {
    if (a instanceof HTMLInputElement && (a.value = ""), l instanceof HTMLInputElement && (l.value = ""), c instanceof HTMLSelectElement) {
      const x = ((D = (I = c.options) == null ? void 0 : I[0]) == null ? void 0 : D.value) ?? "";
      c.value = x;
    }
    u instanceof HTMLInputElement && (u.value = ""), typeof h(this, ye) == "function" && h(this, ye).call(this);
    return;
  }
  const d = typeof i.canonical == "string" ? i.canonical : "", g = typeof i.period == "string" ? i.period : "", m = typeof i.hour == "string" ? i.hour : "", y = typeof i.minute == "string" ? i.minute : "";
  let b = "", p = "", E = g, T = d;
  if (d) {
    const x = na(d, o);
    b = x.hour ?? "", p = x.minute ?? "", T = x.canonical ?? d, o === "12h" ? E = x.period ?? g : E = "";
  } else
    b = m, p = y, o !== "12h" && (E = "");
  if (a instanceof HTMLInputElement && (a.value = b ?? ""), l instanceof HTMLInputElement && (l.value = p ?? ""), c instanceof HTMLSelectElement)
    if (o === "12h") {
      const x = Array.from(c.options ?? []);
      x.find((q) => q.value === E) ? c.value = E : x.length > 0 ? c.value = x[0].value : c.value = "";
    } else
      c.value = "";
  u instanceof HTMLInputElement && (u.value = T ?? ""), typeof h(this, ye) == "function" && h(this, ye).call(this);
}, "#restoreTimeInputs"), Qi = new WeakMap(), ro = /* @__PURE__ */ s(function(n, i) {
  i && i.querySelectorAll("[data-action-config]").forEach((r) => {
    const o = r.dataset.actionConfig === n;
    r.style.display = o ? "" : "none";
  });
}, "#updateActionSections"), Xi = new WeakMap(), is = /* @__PURE__ */ s(function(n) {
  var g, m, y, b;
  if ((g = h(this, at)) == null || g.call(this), v(this, at, null), v(this, ye, null), !(n instanceof HTMLFormElement)) return;
  const i = n.querySelector("[data-time-format]"), r = ((m = i == null ? void 0 : i.dataset) == null ? void 0 : m.timeFormat) ?? null;
  if (r !== "12h" && r !== "24h")
    return;
  const o = i.querySelector("[data-time-hidden]"), a = i.querySelector("[data-time-hour]"), l = i.querySelector("[data-time-minute]"), c = r === "12h" ? i.querySelector("[data-time-period]") : null;
  if (!o || !a || !l || r === "12h" && !c) {
    w("Trigger form time inputs missing elements", {
      format: r,
      hasHidden: !!o,
      hasHour: !!a,
      hasMinute: !!l,
      hasPeriod: !!c
    });
    return;
  }
  const u = [a, l, ...c ? [c] : []], d = /* @__PURE__ */ s(() => {
    const { canonical: p, error: E } = Al(
      {
        hour: a.value,
        minute: l.value,
        period: (c == null ? void 0 : c.value) ?? null,
        time: o.value
      },
      r
    );
    o.value = p ?? "";
    const T = E ?? "";
    o.setCustomValidity(T), u.forEach((C) => {
      C.setCustomValidity(T);
    });
  }, "update");
  u.forEach((p) => {
    p.addEventListener("input", d), p.addEventListener("change", d);
  }), d(), v(this, at, () => {
    u.forEach((p) => {
      p.removeEventListener("input", d), p.removeEventListener("change", d);
    });
  }), v(this, ye, d), w("Trigger form configured for time input", {
    format: r,
    sceneId: ((y = this.scene) == null ? void 0 : y.id) ?? null,
    triggerId: ((b = this.trigger) == null ? void 0 : b.id) ?? null
  });
}, "#setupTimeInput"), Zi = new WeakMap(), rs = /* @__PURE__ */ s(async function(n) {
  var o, a, l, c, u;
  if (typeof h(this, ye) == "function" && h(this, ye).call(this), typeof n.checkValidity == "function" && !n.checkValidity()) {
    typeof n.reportValidity == "function" && n.reportValidity(), w("Trigger form submission blocked by validity check", {
      sceneId: ((o = this.scene) == null ? void 0 : o.id) ?? null,
      triggerId: ((a = this.trigger) == null ? void 0 : a.id) ?? null
    });
    return;
  }
  const i = new FormData(n), r = Object.fromEntries(i.entries());
  delete r.timeHour, delete r.timeMinute, delete r.timePeriod, r.allowReplayOnRewind = ((l = n.querySelector('input[name="allowReplayOnRewind"]')) == null ? void 0 : l.checked) ?? !1, w("Processing trigger form submission", {
    sceneId: ((c = this.scene) == null ? void 0 : c.id) ?? null,
    triggerId: ((u = this.trigger) == null ? void 0 : u.id) ?? null,
    allowReplayOnRewind: r.allowReplayOnRewind
  }), await L(this, ce, os).call(this, r), await this.close();
}, "#handleSubmit"), os = /* @__PURE__ */ s(async function(n) {
  var o, a, l, c, u, d;
  const i = {
    id: ((o = this.trigger) == null ? void 0 : o.id) ?? ul(),
    time: n.time ?? "",
    action: n.action ?? ti,
    allowReplayOnRewind: !!n.allowReplayOnRewind,
    data: {}
  };
  w("Persisting trigger from form", {
    sceneId: ((a = this.scene) == null ? void 0 : a.id) ?? null,
    triggerId: i.id,
    existingIndex: this.triggerIndex
  }), Il(i, n);
  const r = Wt(this.scene);
  this.triggerIndex !== null && r[this.triggerIndex] ? r[this.triggerIndex] = i : r.push(i);
  try {
    await $a(this.scene, r), w("Trigger list saved", {
      sceneId: ((l = this.scene) == null ? void 0 : l.id) ?? null,
      triggerCount: r.length
    });
  } catch (g) {
    throw console.error(`${S} | Failed to save time trigger`, g), (u = (c = ui.notifications) == null ? void 0 : c.error) == null || u.call(
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
      console.error(`${S} | Trigger onSave callback failed`, g), w("Trigger onSave callback failed", {
        sceneId: ((d = this.scene) == null ? void 0 : d.id) ?? null,
        message: (g == null ? void 0 : g.message) ?? String(g)
      });
    }
}, "#persistTrigger"), s(Ye, "TriggerFormApplication"), Pe(Ye, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  nt(Ye, Ye, "DEFAULT_OPTIONS"),
  {
    id: `${S}-trigger-form`,
    classes: Array.from(
      /* @__PURE__ */ new Set([...((Ma = nt(Ye, Ye, "DEFAULT_OPTIONS")) == null ? void 0 : Ma.classes) ?? [], "standard-form", "themed"])
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
)), Pe(Ye, "PARTS", {
  content: {
    template: `modules/${S}/templates/time-trigger-form.html`
  }
});
let io = Ye;
function et(e) {
  return e instanceof HTMLElement ? e : (e == null ? void 0 : e[0]) instanceof HTMLElement ? e[0] : null;
}
s(et, "asHTMLElement");
function oi(e) {
  return typeof (e == null ? void 0 : e.changeTab) == "function";
}
s(oi, "isAppV2");
function as(e, t, n, i = {}) {
  if (oi(e)) {
    e.changeTab(t, n, i);
    return;
  }
  if (typeof (e == null ? void 0 : e.activateTab) == "function") {
    const r = { ...i };
    n != null && (r.group = n), r.triggerCallback == null && (r.triggerCallback = !0), e.activateTab(t, r);
  }
}
s(as, "setActiveTab");
function Fl(e) {
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
s(Fl, "readFormData");
const ra = Symbol.for("eidolon.sceneConfig.v13PatchedTabs");
function ss(e = {}) {
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
    tabIcon: m = "fa-solid fa-puzzle-piece"
  } = e ?? {};
  if (!t)
    throw new Error("createSceneConfigTabFactory requires a tabId.");
  if (typeof o != "function")
    throw new TypeError("createSceneConfigTabFactory requires a renderContent callback.");
  const y = typeof d.log == "function" ? d.log.bind(d) : (...O) => {
    var R;
    return (R = console.debug) == null ? void 0 : R.call(console, `${a}`, ...O);
  }, b = typeof d.group == "function" ? d.group.bind(d) : (...O) => {
    var R;
    return (R = console.groupCollapsed) == null ? void 0 : R.call(console, `${a}`, ...O);
  }, p = typeof d.groupEnd == "function" ? d.groupEnd.bind(d) : () => {
    var O;
    return (O = console.groupEnd) == null ? void 0 : O.call(console);
  }, E = Symbol(`EIDOLON_SCENE_CONFIG_TAB_CLEANUP_${t}`), T = typeof i == "function" ? i : () => null, C = typeof r == "function" ? r : () => !0, I = typeof n == "function" ? n : () => typeof n == "string" ? n : t;
  function D() {
    var $, P, B, U, fe;
    const O = ((P = ($ = foundry == null ? void 0 : foundry.applications) == null ? void 0 : $.sheets) == null ? void 0 : P.SceneConfig) ?? ((B = CONFIG == null ? void 0 : CONFIG.Scene) == null ? void 0 : B.sheetClass);
    if (!O || !oi({ changeTab: (U = O.prototype) == null ? void 0 : U.changeTab })) return;
    const R = O[ra] ?? /* @__PURE__ */ new Set();
    if (R.has(t)) return;
    R.add(t), O[ra] = R;
    const H = (fe = O.TABS) == null ? void 0 : fe.sheet;
    if (H && Array.isArray(H.tabs) && !H.tabs.some((W) => W.id === t)) {
      const W = I({ app: null, scene: null }) ?? t;
      H.tabs.push({
        id: t,
        icon: m,
        label: W
      });
    }
    O.PARTS && !O.PARTS[t] && (O.PARTS[t] = {
      template: `modules/${g}/templates/scene-config-tab-mount.hbs`,
      scrollable: [`.tab[data-tab="${t}"]`]
    }), y("Patched v13 SceneConfig TABS/PARTS", { tabId: t });
  }
  s(D, "patchV13SceneConfig");
  function x(O, R) {
    var $, P;
    const H = T(O);
    if (!C(O, H)) {
      y("Skipped render", {
        tabId: t,
        reason: "inapplicable",
        constructor: (($ = O == null ? void 0 : O.constructor) == null ? void 0 : $.name) ?? null
      });
      return;
    }
    b("render", {
      tabId: t,
      sceneId: (H == null ? void 0 : H.id) ?? null,
      constructor: ((P = O == null ? void 0 : O.constructor) == null ? void 0 : P.name) ?? null
    });
    try {
      const B = et(R) ?? et(O.element);
      if (!B) {
        y("Missing root element", { tabId: t });
        return;
      }
      oi(O) ? Q(O, B, H) : q(O, B, H);
    } finally {
      p();
    }
  }
  s(x, "handleRender");
  function _(O, R, H) {
    var B;
    if (!m) {
      O.textContent = R;
      return;
    }
    const $ = (B = O.querySelector("i")) == null ? void 0 : B.cloneNode(!0);
    O.textContent = "";
    const P = $ ?? document.createElement("i");
    if ($ || (P.className = m, H && (P.inert = !0)), O.append(P, " "), H) {
      const U = document.createElement("span");
      U.textContent = R, O.append(U);
    } else
      O.append(document.createTextNode(R));
  }
  s(_, "setButtonContent");
  function q(O, R, H) {
    var j, pt, jn, nn, yt, rn, N, V, K, Y, Z, ie, oe, ge, Ne, me;
    const P = [
      "nav.sheet-tabs[data-group]",
      "nav.tabs[data-group]",
      "nav.sheet-tabs",
      "nav.tabs"
    ].map((ae) => R.querySelector(ae)).find((ae) => ae instanceof HTMLElement), U = [
      (j = R.querySelector(".tab[data-tab]")) == null ? void 0 : j.parentElement,
      R.querySelector(".sheet-body"),
      (jn = (pt = P == null ? void 0 : P.parentElement) == null ? void 0 : pt.querySelector) == null ? void 0 : jn.call(pt, ":scope > .sheet-body"),
      P == null ? void 0 : P.parentElement
    ].find((ae) => ae instanceof HTMLElement), fe = ((nn = P == null ? void 0 : P.dataset) == null ? void 0 : nn.group) ?? ((N = (rn = (yt = P == null ? void 0 : P.querySelector) == null ? void 0 : yt.call(P, "a[data-group]")) == null ? void 0 : rn.dataset) == null ? void 0 : N.group) ?? ((Y = (K = (V = P == null ? void 0 : P.querySelector) == null ? void 0 : V.call(P, "[data-group]")) == null ? void 0 : K.dataset) == null ? void 0 : Y.group) ?? ((oe = (ie = (Z = U == null ? void 0 : U.querySelector) == null ? void 0 : Z.call(U, ".tab[data-group]")) == null ? void 0 : ie.dataset) == null ? void 0 : oe.group) ?? "main";
    if (!P || !U) {
      y("Missing navigation elements", {
        tabId: t,
        hasNav: !!P,
        hasBody: !!U
      });
      return;
    }
    let W = P.querySelector(`[data-tab="${t}"]`);
    if (!W) {
      W = document.createElement("a"), W.dataset.action = "tab", W.dataset.group = fe, W.dataset.tab = t;
      const ae = P.querySelector("a[data-tab]");
      (ge = ae == null ? void 0 : ae.classList) != null && ge.contains("item") && W.classList.add("item"), P.appendChild(W), typeof l == "function" && l({ app: O, button: W, nav: P, scene: H }), y("Created tab button", { tabId: t, group: fe });
    }
    _(W, I({ app: O, scene: H }) ?? t, oi(O));
    let te = U.querySelector(`.tab[data-tab="${t}"]`);
    if (!te) {
      te = document.createElement("div"), te.classList.add("tab"), te.dataset.tab = t, te.dataset.group = fe;
      const ae = _l(U);
      U.insertBefore(te, ae ?? null), typeof c == "function" && c({ app: O, tab: te, body: U, scene: H }), y("Created tab container", { tabId: t, group: fe });
    }
    ((Ne = W.classList) == null ? void 0 : Ne.contains("active")) || te.classList.contains("active") ? (W.classList.add("active"), te.classList.add("active"), te.removeAttribute("hidden")) : (W.classList.remove("active"), te.classList.remove("active"), te.setAttribute("hidden", "true"));
    const Oe = /* @__PURE__ */ s(() => {
      var re, De;
      ((re = W.classList) != null && re.contains("active") || te.classList.contains("active")) && ((De = W.classList) == null || De.add("active"), te.classList.add("active"), te.removeAttribute("hidden"), te.removeAttribute("aria-hidden"), te.style.display === "none" && (te.style.display = ""));
    }, "ensureTabVisible"), A = /* @__PURE__ */ s(() => {
      Oe(), requestAnimationFrame(Oe);
    }, "scheduleEnsureTabVisible");
    W.dataset.eidolonEnsureSceneTabVisibility || (W.addEventListener("click", () => {
      as(O, t, fe), requestAnimationFrame(Oe);
    }), W.dataset.eidolonEnsureSceneTabVisibility = "true"), wr(O, E, y);
    const Vn = o({
      app: O,
      scene: H,
      tab: te,
      tabButton: W,
      ensureTabVisible: Oe,
      scheduleEnsureTabVisible: A
    });
    typeof Vn == "function" && oa(O, E, Vn), typeof u == "function" && u({
      app: O,
      scene: H,
      tab: te,
      tabButton: W,
      ensureTabVisible: Oe,
      scheduleEnsureTabVisible: A
    }), (me = O.setPosition) == null || me.call(O, { height: "auto" });
  }
  s(q, "handleRenderV1");
  function Q(O, R, H) {
    const $ = R.querySelector(`.tab[data-tab="${t}"]`), P = R.querySelector(`nav [data-tab="${t}"]`);
    if (!$ || !P) {
      y("v2 mount not found, falling back to v1 injection", { tabId: t }), q(O, R, H);
      return;
    }
    _(P, I({ app: O, scene: H }) ?? t, !0);
    const B = /* @__PURE__ */ s(() => {
      var W;
      !((W = P.classList) != null && W.contains("active")) && !$.classList.contains("active") || ($.classList.add("active"), $.removeAttribute("hidden"), $.removeAttribute("aria-hidden"), $.style.display === "none" && ($.style.display = ""));
    }, "ensureTabVisible"), U = /* @__PURE__ */ s(() => {
      B(), requestAnimationFrame(B);
    }, "scheduleEnsureTabVisible");
    wr(O, E, y);
    const fe = o({
      app: O,
      scene: H,
      tab: $,
      tabButton: P,
      ensureTabVisible: B,
      scheduleEnsureTabVisible: U
    });
    typeof fe == "function" && oa(O, E, fe), typeof u == "function" && u({
      app: O,
      scene: H,
      tab: $,
      tabButton: P,
      ensureTabVisible: B,
      scheduleEnsureTabVisible: U
    });
  }
  s(Q, "handleRenderV2");
  function ee(O) {
    wr(O, E, y);
  }
  s(ee, "handleClose");
  function F() {
    return Hooks.once("init", () => {
      D();
    }), Hooks.on("renderSceneConfig", x), Hooks.on("closeSceneConfig", ee), () => z();
  }
  s(F, "register");
  function z() {
    Hooks.off("renderSceneConfig", x), Hooks.off("closeSceneConfig", ee);
  }
  return s(z, "unregister"), { register: F, unregister: z };
}
s(ss, "createSceneConfigTabFactory");
function oa(e, t, n) {
  if (!e || typeof n != "function") return;
  const i = e == null ? void 0 : e[t];
  Array.isArray(i) || (e[t] = []), e[t].push(n);
}
s(oa, "registerCleanup");
function wr(e, t, n) {
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
s(wr, "invokeCleanup");
function _l(e) {
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
s(_l, "findFooterElement$1");
const xl = lr(io), Rl = `modules/${S}/templates/time-trigger-scene-tab.html`, kl = ss({
  tabId: "time-triggers",
  tabLabel: /* @__PURE__ */ s(() => f("EIDOLON.TimeTrigger.Tab", "Time Triggers"), "tabLabel"),
  getScene: We,
  isApplicable: Bl,
  renderContent: /* @__PURE__ */ s(({ app: e, scene: t, tab: n }) => $l(e, n, t), "renderContent"),
  logger: {
    log: w,
    group: Zt,
    groupEnd: dt
  }
});
function Hl() {
  return w("Registering SceneConfig render hook"), kl.register();
}
s(Hl, "registerSceneConfigHook");
function $l(e, t, n) {
  if (!(t instanceof HTMLElement)) return;
  const i = Ce(n) ? n : We(e);
  Ci(e, t, i);
  const r = Ao(() => {
    Ci(e, t, i);
  });
  return () => {
    if (typeof r == "function")
      try {
        r();
      } catch (o) {
        console.error(
          `${S} | Failed to dispose scene config time format subscription`,
          o
        );
      }
  };
}
s($l, "renderTimeTriggerTab");
async function Ci(e, t, n) {
  var r, o;
  const i = n ?? We(e);
  Zt("renderTimeTriggersTabContent", { sceneId: (i == null ? void 0 : i.id) ?? null });
  try {
    if (!Ce(i)) {
      const $ = f(
        "EIDOLON.TimeTrigger.Unavailable",
        "Time triggers are unavailable for this configuration sheet."
      );
      t.innerHTML = `<p class="notes">${$}</p>`, w("Scene lacks document for time triggers", { sceneId: (i == null ? void 0 : i.id) ?? null });
      return;
    }
    const a = `flags.${S}.${hi}`, l = `flags.${S}.${Ar}`, c = `flags.${S}.${Nr}`, u = !!i.getFlag(S, hi), d = !!i.getFlag(S, Ar), g = !!i.getFlag(S, Nr), m = Wt(i);
    w("Rendering time trigger list", {
      sceneId: i.id,
      isActive: u,
      shouldHideWindow: d,
      shouldShowPlayerWindow: g,
      triggerCount: m.length
    });
    const y = f("EIDOLON.TimeTrigger.Activate", "Activate Time Trigger"), b = f(
      "EIDOLON.TimeTrigger.Description",
      "Enable scene time triggers so scheduled actions can run automatically."
    ), p = f(
      "EIDOLON.TimeTrigger.HideWindowLabel",
      "Hide Floating Time Window"
    ), E = f(
      "EIDOLON.TimeTrigger.HideWindowDescription",
      "Keep the floating time control window hidden while leaving time triggers active."
    ), T = f(
      "EIDOLON.TimeTrigger.ShowPlayerWindowLabel",
      "Share Floating Time Window with Players"
    ), C = f(
      "EIDOLON.TimeTrigger.ShowPlayerWindowDescription",
      "Let non-GM players see the floating time window (without time controls)."
    ), I = f(
      "EIDOLON.TimeTrigger.TriggerListLabel",
      "Scene Time Triggers"
    ), D = f(
      "EIDOLON.TimeTrigger.TriggerListEmpty",
      "No time triggers configured for this scene."
    ), x = f("EIDOLON.TimeTrigger.AddTrigger", "Add Trigger"), _ = f("EIDOLON.TimeTrigger.EditTrigger", "Edit"), q = f("EIDOLON.TimeTrigger.DeleteTrigger", "Remove"), Q = f("EIDOLON.TimeTrigger.TriggerNow", "Trigger Now"), ee = f("EIDOLON.TimeTrigger.AtLabel", "At"), F = f("EIDOLON.TimeTrigger.DoLabel", "Do"), z = f("EIDOLON.TimeTrigger.MissingTime", "(No time set)"), O = m.map(($, P) => {
      const fe = ($.time ? Ml($.time) : "") || $.time || "" || z, W = Cl($.action), te = [
        `${ee} ${fe}`,
        `${F} ${W}`,
        ...Ll($)
      ];
      return {
        index: P,
        summaryParts: te,
        tooltips: {
          triggerNow: Q,
          edit: _,
          delete: q
        }
      };
    }), R = ((o = (r = foundry == null ? void 0 : foundry.applications) == null ? void 0 : r.handlebars) == null ? void 0 : o.renderTemplate) ?? (typeof renderTemplate == "function" ? renderTemplate : globalThis == null ? void 0 : globalThis.renderTemplate);
    if (typeof R != "function") {
      console.error(`${S} | renderTemplate is unavailable; cannot render scene tab.`), t.innerHTML = `<p class="notes">${D}</p>`;
      return;
    }
    let H = "";
    try {
      H = await R(Rl, {
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
          showPlayerWindow: T,
          triggerList: I,
          empty: D,
          add: x
        },
        hints: {
          activate: b,
          hideWindow: E,
          showPlayerWindow: C
        },
        triggers: O,
        hasTriggers: O.length > 0
      });
    } catch ($) {
      console.error(`${S} | Failed to render time trigger scene tab template`, $), t.innerHTML = `<p class="notes">${D}</p>`;
      return;
    }
    t.innerHTML = H, Pl(e, t, i);
  } finally {
    dt();
  }
}
s(Ci, "renderTimeTriggersTabContent");
function Pl(e, t, n) {
  const i = n ?? We(e);
  if (!Ce(i)) return;
  const r = t.querySelector('[data-action="add-trigger"]');
  r && r.addEventListener("click", () => {
    w("Add trigger button clicked", { sceneId: i.id }), aa(e, { scene: i });
  }), t.querySelectorAll('[data-action="edit-trigger"]').forEach((o) => {
    o.addEventListener("click", () => {
      const a = Number(o.dataset.index);
      if (!Number.isInteger(a)) return;
      const c = Wt(i)[a];
      c && (w("Edit trigger button clicked", { sceneId: i.id, triggerId: c.id, index: a }), aa(e, { trigger: c, triggerIndex: a, scene: i }));
    });
  }), t.querySelectorAll('[data-action="delete-trigger"]').forEach((o) => {
    o.addEventListener("click", async () => {
      var u, d;
      const a = Number(o.dataset.index);
      if (!Number.isInteger(a)) return;
      const l = Wt(i), c = l[a];
      if (c) {
        l.splice(a, 1);
        try {
          w("Deleting trigger", {
            sceneId: i.id,
            index: a,
            triggerId: (c == null ? void 0 : c.id) ?? null
          }), await $a(i, l), await Ci(e, t, i);
        } catch (g) {
          console.error(`${S} | Failed to delete time trigger`, g), (d = (u = ui.notifications) == null ? void 0 : u.error) == null || d.call(
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
      var u, d, g, m, y, b, p;
      const a = Number(o.dataset.index);
      if (!Number.isInteger(a)) return;
      const c = Wt(i)[a];
      if (c) {
        if (!((u = game.user) != null && u.isGM)) {
          (g = (d = ui.notifications) == null ? void 0 : d.warn) == null || g.call(
            d,
            f("EIDOLON.TimeTrigger.GMOnly", "Only the GM can adjust time.")
          );
          return;
        }
        try {
          w("Manually firing trigger", { sceneId: i.id, triggerId: c.id, index: a }), await Pa(i, c), (y = (m = ui.notifications) == null ? void 0 : m.info) == null || y.call(
            m,
            f(
              "EIDOLON.TimeTrigger.TriggerNowSuccess",
              "Triggered the selected time trigger."
            )
          );
        } catch (E) {
          console.error(`${S} | Failed to execute time trigger manually`, E), (p = (b = ui.notifications) == null ? void 0 : b.error) == null || p.call(
            b,
            f(
              "EIDOLON.TimeTrigger.TriggerNowError",
              "Failed to execute the selected time trigger."
            )
          ), w("Manual trigger execution failed", {
            sceneId: i.id,
            triggerId: c.id,
            index: a,
            message: (E == null ? void 0 : E.message) ?? String(E)
          });
        }
      }
    });
  });
}
s(Pl, "bindTimeTriggerTabEvents");
function aa(e, t = {}) {
  var a;
  const n = t.scene ?? null, i = n && Ce(n) ? n : We(e);
  if (!Ce(i)) {
    console.warn(`${S} | Unable to open trigger form because no scene document is available.`);
    return;
  }
  w("Opening trigger form", {
    sceneId: i.id,
    triggerId: ((a = t.trigger) == null ? void 0 : a.id) ?? null,
    index: Number.isInteger(t.triggerIndex) ? Number(t.triggerIndex) : null
  }), xl({
    scene: i,
    trigger: t.trigger ?? null,
    triggerIndex: t.triggerIndex ?? null,
    onSave: /* @__PURE__ */ s(() => {
      var c, u;
      const l = (u = (c = e.element) == null ? void 0 : c[0]) == null ? void 0 : u.querySelector('.tab[data-tab="time-triggers"]');
      l && Ci(e, l, i);
    }, "onSave")
  }).render({ force: !0 });
}
s(aa, "openTriggerForm");
function Bl(e, t) {
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
s(Bl, "isRecognizedSceneConfig");
const Wn = new Jr(), sa = new Yr();
function ql() {
  w("Registering time trigger hooks"), Hooks.once("init", () => {
    dl(), yl(), w("Time trigger settings registered during init");
  }), Hl(), w("Scene config hook registered"), sa.registerHooks(), w("Time automation hooks registered"), Hooks.once("ready", () => {
    bl(), w("Ready hook fired"), Wn.onReady(), sa.initialize();
  }), Hooks.on("canvasReady", (e) => {
    var t;
    w("canvasReady hook received", { scene: ((t = e == null ? void 0 : e.scene) == null ? void 0 : t.id) ?? null }), Wn.onCanvasReady(e);
  }), Hooks.on("updateScene", (e) => {
    w("updateScene hook received", { scene: (e == null ? void 0 : e.id) ?? null }), Wn.onUpdateScene(e);
  }), Hooks.on("updateWorldTime", (e, t) => {
    w("updateWorldTime hook received", { worldTime: e, diff: t }), Wn.onUpdateWorldTime(e, t);
  });
}
s(ql, "registerTimeTriggerHooks");
ql();
const de = S, ls = "criteria", Do = "state", Ul = "criteriaVersion", Vl = 1, cs = "showSceneCriteriaTab";
let la = !1;
function jl() {
  var e;
  if (!la) {
    if (la = !0, !((e = game == null ? void 0 : game.settings) != null && e.register)) {
      console.warn(`${de} | game.settings.register unavailable; scene criteria setting skipped.`);
      return;
    }
    game.settings.register(de, cs, {
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
        zl();
      }, "onChange")
    });
  }
}
s(jl, "registerSceneCriteriaSettings");
function us() {
  var e;
  try {
    if ((e = game == null ? void 0 : game.settings) != null && e.get)
      return !!game.settings.get(de, cs);
  } catch (t) {
    console.error(`${de} | Failed to read Scene Criteria tab setting`, t);
  }
  return !1;
}
s(us, "getShowSceneCriteriaTabSetting");
function zl() {
  var o, a, l, c, u;
  const e = f("EIDOLON.SceneCriteria.ReloadPromptTitle", "Reload Required"), t = `<p>${f(
    "EIDOLON.SceneCriteria.ReloadPromptBody",
    "Changes to the Scene Criteria tab visibility require a reload. Reload now?"
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
      "Please reload the world to apply Scene Criteria tab visibility changes."
    )
  );
}
s(zl, "promptReloadForSceneCriteriaTab");
const Li = "Standard";
function Ae(e) {
  var n;
  const t = (n = e == null ? void 0 : e.getFlag) == null ? void 0 : n.call(e, de, ls);
  return t ? ds(t) : [];
}
s(Ae, "getSceneCriteria");
async function cr(e, t) {
  if (!(e != null && e.setFlag)) return;
  const n = ds(t);
  await e.setFlag(de, ls, n), await e.setFlag(de, Ul, Vl);
  const i = Bn(e, n);
  await e.setFlag(de, Do, i);
}
s(cr, "setSceneCriteria");
function Bn(e, t = null) {
  var r;
  const n = Array.isArray(t) ? t : Ae(e), i = Ge(((r = e == null ? void 0 : e.getFlag) == null ? void 0 : r.call(e, de, Do)) ?? {});
  return _o(i, n);
}
s(Bn, "getSceneCriteriaState");
async function Gl(e, t, n = null) {
  if (!(e != null && e.setFlag)) return;
  const i = Array.isArray(n) ? n : Ae(e), r = _o(t, i);
  await e.setFlag(de, Do, r);
}
s(Gl, "setSceneCriteriaState");
function Fo(e = "") {
  const t = typeof e == "string" ? e.trim() : "", n = fs(ao(t || "criterion"), /* @__PURE__ */ new Set());
  return {
    id: gs(),
    key: n,
    label: t,
    values: [Li],
    default: Li,
    order: 0
  };
}
s(Fo, "createSceneCriterion");
function ds(e) {
  const t = Array.isArray(e) ? Ge(e) : [], n = [], i = /* @__PURE__ */ new Set();
  return t.forEach((r, o) => {
    const a = oo(r, o, i);
    a && (n.push(a), i.add(a.key));
  }), n;
}
s(ds, "sanitizeCriteria$1");
function oo(e, t = 0, n = /* @__PURE__ */ new Set()) {
  if (!e || typeof e != "object") return null;
  const i = typeof e.id == "string" && e.id.trim() ? e.id.trim() : gs(), o = (typeof e.label == "string" ? e.label : typeof e.name == "string" ? e.name : "").trim(), a = typeof e.key == "string" && e.key.trim() ? ao(e.key) : ao(o || `criterion-${Number(t) + 1}`), l = fs(a, n), c = Kl(e.values);
  let u = typeof e.default == "string" ? e.default.trim() : "";
  u || (u = c[0] ?? Li), c.includes(u) || c.unshift(u);
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
s(oo, "sanitizeCriterion");
function _o(e, t = []) {
  const n = e && typeof e == "object" ? Ge(e) : {}, i = {};
  for (const r of t) {
    const o = n == null ? void 0 : n[r.key], a = typeof o == "string" ? o.trim() : "";
    a && r.values.includes(a) ? i[r.key] = a : i[r.key] = r.default;
  }
  return i;
}
s(_o, "sanitizeSceneCriteriaState");
function Wl(e) {
  return Ae(e).map((n) => ({
    id: n.key,
    key: n.key,
    name: n.label,
    values: [...n.values]
  }));
}
s(Wl, "getSceneCriteriaCategories");
function Kl(e) {
  const t = Array.isArray(e) ? e : [], n = [];
  for (const i of t) {
    if (typeof i != "string") continue;
    const r = i.trim();
    !r || n.includes(r) || n.push(r);
  }
  return n.length || n.push(Li), n;
}
s(Kl, "sanitizeCriterionValues");
function ao(e) {
  return String(e ?? "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "criterion";
}
s(ao, "slugifyCriterionKey");
function fs(e, t) {
  if (!t.has(e)) return e;
  let n = 2;
  for (; t.has(`${e}-${n}`); )
    n += 1;
  return `${e}-${n}`;
}
s(fs, "ensureUniqueCriterionKey");
function gs() {
  var e;
  return (e = foundry == null ? void 0 : foundry.utils) != null && e.randomID ? foundry.utils.randomID() : typeof (crypto == null ? void 0 : crypto.randomUUID) == "function" ? crypto.randomUUID() : Math.random().toString(36).slice(2, 11);
}
s(gs, "generateCriterionId");
function ms(e) {
  var t, n;
  console.error(`${de} | Failed to persist scene criteria`, e), (n = (t = ui.notifications) == null ? void 0 : t.error) == null || n.call(
    t,
    f(
      "EIDOLON.SceneCriteria.PersistError",
      "Failed to persist the scene criteria."
    )
  );
}
s(ms, "notifyPersistError");
var Aa, se, Ze, he, hs, er, tr, nr, ir, ai, rr, wn, In, dn, ps;
const Qe = class Qe extends Pn($n) {
  constructor(n = {}) {
    const { scene: i, criterion: r, isNew: o, onSave: a, ...l } = n ?? {};
    super(l);
    M(this, he);
    M(this, se, null);
    M(this, Ze, !1);
    M(this, er, /* @__PURE__ */ s(async (n) => {
      n.preventDefault();
      const i = n.currentTarget;
      if (!(i instanceof HTMLFormElement)) return;
      const r = new FormData(i), o = String(r.get("criterionLabel") ?? "").trim(), a = String(r.get("criterionKey") ?? "").trim(), l = Array.from(i.querySelectorAll('[name="criterionValues"]')).map((g) => g instanceof HTMLInputElement ? g.value.trim() : "").filter((g, m, y) => g && y.indexOf(g) === m), u = String(r.get("criterionDefault") ?? "").trim() || l[0] || "Standard", d = oo(
        {
          id: h(this, se).id,
          key: a,
          label: o,
          values: l,
          default: u,
          order: Number(h(this, se).order ?? 0)
        },
        0,
        /* @__PURE__ */ new Set()
      );
      d && (v(this, se, d), await L(this, he, ps).call(this), this.close());
    }, "#onSubmit"));
    M(this, tr, /* @__PURE__ */ s((n) => {
      var a;
      if (h(this, Ze)) return;
      const i = n.currentTarget, r = (i == null ? void 0 : i.form) ?? ((a = this.element) == null ? void 0 : a.querySelector("form"));
      if (!(r instanceof HTMLFormElement)) return;
      const o = r.querySelector('input[name="criterionKey"]');
      o instanceof HTMLInputElement && (o.value = sn(i.value));
    }, "#onLabelInput"));
    M(this, nr, /* @__PURE__ */ s((n) => {
      var c;
      const i = n.currentTarget, r = (i == null ? void 0 : i.form) ?? ((c = this.element) == null ? void 0 : c.querySelector("form"));
      if (!(r instanceof HTMLFormElement) || !(i instanceof HTMLInputElement)) return;
      const o = r.querySelector('input[name="criterionLabel"]'), a = sn(o instanceof HTMLInputElement ? o.value : ""), l = sn(i.value);
      v(this, Ze, l !== a), i.value = l, L(this, he, ai).call(this, r);
    }, "#onKeyInput"));
    M(this, ir, /* @__PURE__ */ s((n) => {
      var a, l;
      n.preventDefault();
      const i = ((a = n.currentTarget) == null ? void 0 : a.form) ?? ((l = this.element) == null ? void 0 : l.querySelector("form"));
      if (!(i instanceof HTMLFormElement)) return;
      const r = i.querySelector('input[name="criterionLabel"]'), o = i.querySelector('input[name="criterionKey"]');
      o instanceof HTMLInputElement && (o.value = sn(r instanceof HTMLInputElement ? r.value : ""), v(this, Ze, !1), L(this, he, ai).call(this, i));
    }, "#onResetAutoKey"));
    M(this, rr, /* @__PURE__ */ s((n) => {
      var c, u, d, g, m, y;
      n.preventDefault();
      const i = ((c = n.currentTarget) == null ? void 0 : c.form) ?? ((u = this.element) == null ? void 0 : u.querySelector("form"));
      if (!(i instanceof HTMLFormElement)) return;
      const r = i.querySelector(".scene-criterion-editor__values");
      if (!(r instanceof HTMLElement)) return;
      (d = r.querySelector(".scene-criterion-editor__empty")) == null || d.remove();
      const o = document.createElement("div");
      o.classList.add("scene-criterion-editor__value");
      const a = pi(f("EIDOLON.SceneCriteria.ValuePlaceholder", "Allowed value")), l = pi(f("EIDOLON.SceneCriteria.RemoveValue", "Remove Value"));
      o.innerHTML = `
      <input type="text" name="criterionValues" value="" placeholder="${a}" class="form-control">
      <button type="button" class="icon" data-action="remove-value" aria-label="${l}" title="${l}">
        <i class="fa-solid fa-trash"></i>
      </button>
    `, r.appendChild(o), (g = o.querySelector('[data-action="remove-value"]')) == null || g.addEventListener("click", h(this, wn)), (m = o.querySelector('input[name="criterionValues"]')) == null || m.addEventListener("input", h(this, In)), L(this, he, dn).call(this, i), (y = o.querySelector('input[name="criterionValues"]')) == null || y.focus();
    }, "#onAddValue"));
    M(this, wn, /* @__PURE__ */ s((n) => {
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
        L(this, he, dn).call(this, i);
      }
    }, "#onRemoveValue"));
    M(this, In, /* @__PURE__ */ s((n) => {
      var r, o;
      const i = ((r = n.currentTarget) == null ? void 0 : r.form) ?? ((o = this.element) == null ? void 0 : o.querySelector("form"));
      i instanceof HTMLFormElement && L(this, he, dn).call(this, i);
    }, "#onValuesChanged"));
    this.scene = i ?? null, this.criterion = r ?? null, this.onSave = typeof a == "function" ? a : null, this.isNew = !!o, v(this, se, L(this, he, hs).call(this)), v(this, Ze, h(this, se).key !== sn(h(this, se).label));
  }
  async _prepareContext() {
    var i, r, o, a;
    const n = Array.isArray((i = h(this, se)) == null ? void 0 : i.values) ? h(this, se).values : [];
    return {
      isNew: this.isNew,
      key: ((r = h(this, se)) == null ? void 0 : r.key) ?? "",
      label: ((o = h(this, se)) == null ? void 0 : o.label) ?? "",
      defaultValue: ((a = h(this, se)) == null ? void 0 : a.default) ?? "",
      values: n.map((l, c) => {
        var u;
        return {
          index: c,
          value: l,
          selected: l === ((u = h(this, se)) == null ? void 0 : u.default)
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
      keyIsCustom: h(this, Ze)
    };
  }
  _onRender(n, i) {
    var o, a, l, c, u, d;
    super._onRender(n, i);
    const r = (o = this.element) == null ? void 0 : o.querySelector("form");
    r && (r.addEventListener("submit", h(this, er)), (a = r.querySelector('[data-action="add-value"]')) == null || a.addEventListener("click", h(this, rr)), (l = r.querySelector('input[name="criterionLabel"]')) == null || l.addEventListener("input", h(this, tr)), (c = r.querySelector('input[name="criterionKey"]')) == null || c.addEventListener("input", h(this, nr)), (u = r.querySelector('[data-action="reset-auto-key"]')) == null || u.addEventListener("click", h(this, ir)), r.querySelectorAll('[data-action="remove-value"]').forEach((g) => {
      g.addEventListener("click", h(this, wn));
    }), r.querySelectorAll('input[name="criterionValues"]').forEach((g) => {
      g.addEventListener("input", h(this, In));
    }), (d = r.querySelector('[data-action="cancel"]')) == null || d.addEventListener("click", (g) => {
      g.preventDefault(), this.close();
    }), L(this, he, ai).call(this, r), L(this, he, dn).call(this, r));
  }
};
se = new WeakMap(), Ze = new WeakMap(), he = new WeakSet(), hs = /* @__PURE__ */ s(function() {
  const n = oo(this.criterion, 0, /* @__PURE__ */ new Set()) ?? Fo(f("EIDOLON.SceneCriteria.DefaultCategoryName", "New Criterion"));
  return {
    id: n.id,
    key: n.key,
    label: n.label ?? "",
    values: Array.isArray(n.values) ? [...n.values] : [],
    default: n.default
  };
}, "#initializeState"), er = new WeakMap(), tr = new WeakMap(), nr = new WeakMap(), ir = new WeakMap(), ai = /* @__PURE__ */ s(function(n) {
  const i = n.querySelector('[data-action="reset-auto-key"]');
  i instanceof HTMLButtonElement && (i.disabled = !h(this, Ze));
}, "#syncAutoKeyButton"), rr = new WeakMap(), wn = new WeakMap(), In = new WeakMap(), dn = /* @__PURE__ */ s(function(n) {
  var c, u;
  const i = n.querySelector('select[name="criterionDefault"]');
  if (!(i instanceof HTMLSelectElement)) return;
  const r = ((u = (c = i.value) == null ? void 0 : c.trim) == null ? void 0 : u.call(c)) ?? "", o = Array.from(n.querySelectorAll('input[name="criterionValues"]')).map((d) => d instanceof HTMLInputElement ? d.value.trim() : "").filter((d, g, m) => d && m.indexOf(d) === g), a = i.dataset.emptyLabel || f("EIDOLON.SceneCriteria.ValueListEmpty", "No values have been added to this criterion.");
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
}, "#syncDefaultOptions"), ps = /* @__PURE__ */ s(async function() {
  if (!this.scene) return;
  const n = Ae(this.scene).sort((r, o) => r.order - o.order), i = n.findIndex((r) => r.id === h(this, se).id);
  i < 0 ? (h(this, se).order = n.length, n.push(h(this, se))) : (h(this, se).order = n[i].order, n.splice(i, 1, h(this, se)));
  try {
    await cr(this.scene, n), this.onSave && await this.onSave(h(this, se));
  } catch (r) {
    ms(r);
  }
}, "#persist"), s(Qe, "CategoryEditorApplication"), Pe(Qe, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  nt(Qe, Qe, "DEFAULT_OPTIONS"),
  {
    id: `${de}-criterion-editor`,
    classes: Array.from(
      /* @__PURE__ */ new Set([...((Aa = nt(Qe, Qe, "DEFAULT_OPTIONS")) == null ? void 0 : Aa.classes) ?? [], "standard-form", "themed"])
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
)), Pe(Qe, "PARTS", {
  content: {
    template: `modules/${de}/templates/scene-criteria-editor.html`
  }
});
let so = Qe;
function sn(e) {
  return String(e ?? "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "criterion";
}
s(sn, "slugifyKey");
const Jl = `modules/${de}/templates/scene-criteria-tab.html`, lo = {
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
}, Yl = lr(so), Ql = ss({
  tabId: "criteria",
  tabLabel: /* @__PURE__ */ s(() => f("EIDOLON.SceneCriteria.TabLabel", "Criteria"), "tabLabel"),
  getScene: We,
  isApplicable: /* @__PURE__ */ s(() => us(), "isApplicable"),
  renderContent: /* @__PURE__ */ s(({ app: e, tab: t, scene: n }) => Zl(e, t, n), "renderContent"),
  logger: lo
});
function Xl() {
  return Ql.register();
}
s(Xl, "registerSceneCriteriaConfigHook");
function Zl(e, t, n) {
  if (!(t instanceof HTMLElement)) return;
  const i = Ce(n) ? n : We(e);
  Vt(e, t, i);
}
s(Zl, "renderCriteriaTab");
async function Vt(e, t, n) {
  var r, o;
  const i = n ?? We(e);
  lo.group("renderCriteriaTabContent", { sceneId: (i == null ? void 0 : i.id) ?? null });
  try {
    if (!Ce(i)) {
      const d = f(
        "EIDOLON.SceneCriteria.Unavailable",
        "Scene criteria are unavailable for this configuration sheet."
      );
      t.innerHTML = `<p class="notes">${d}</p>`;
      return;
    }
    const a = Ae(i).sort((d, g) => d.order - g.order), l = Bn(i, a), c = ((o = (r = foundry == null ? void 0 : foundry.applications) == null ? void 0 : r.handlebars) == null ? void 0 : o.renderTemplate) ?? (typeof renderTemplate == "function" ? renderTemplate : globalThis == null ? void 0 : globalThis.renderTemplate);
    if (typeof c != "function") {
      t.innerHTML = `<p class="notes">${f("EIDOLON.SceneCriteria.CategoryListEmpty", "No criteria configured for this scene.")}</p>`;
      return;
    }
    const u = await c(Jl, {
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
          values: d.values.map((b) => ({
            value: b,
            isCurrent: (l[d.key] ?? d.default) === b
          })),
          valueCountLabel: tc(d.values.length),
          canMoveUp: g > 0,
          canMoveDown: g < a.length - 1
        };
      }),
      hasCriteria: a.length > 0
    });
    t.innerHTML = u, ec(e, t, i);
  } catch (a) {
    console.error(`${de} | Failed to render criteria tab`, a), t.innerHTML = `<p class="notes">${f("EIDOLON.SceneCriteria.CategoryListEmpty", "No criteria configured for this scene.")}</p>`;
  } finally {
    lo.groupEnd();
  }
}
s(Vt, "renderCriteriaTabContent");
function ec(e, t, n) {
  const i = n ?? We(e);
  if (!Ce(i)) return;
  const r = t.querySelector('[data-criteria-action="add"]');
  r && r.addEventListener("click", () => {
    ca(e, {
      scene: i,
      criterion: Fo(
        f("EIDOLON.SceneCriteria.DefaultCategoryName", "New Criterion")
      ),
      isNew: !0,
      onSave: /* @__PURE__ */ s(() => Vt(e, t, i), "onSave")
    });
  }), t.querySelectorAll('[data-criteria-action="edit"]').forEach((o) => {
    const a = o.dataset.criterionId;
    a && o.addEventListener("click", () => {
      const l = Ae(i).find((c) => c.id === a);
      l && ca(e, {
        scene: i,
        criterion: l,
        onSave: /* @__PURE__ */ s(() => Vt(e, t, i), "onSave")
      });
    });
  }), t.querySelectorAll('[data-criteria-action="remove"]').forEach((o) => {
    const a = o.dataset.criterionId;
    a && o.addEventListener("click", async () => {
      await Ir(i, (c) => {
        const u = c.findIndex((d) => d.id === a);
        return u < 0 ? !1 : (c.splice(u, 1), Sr(c), !0);
      }) && await Vt(e, t, i);
    });
  }), t.querySelectorAll('[data-criteria-action="move-up"]').forEach((o) => {
    const a = o.dataset.criterionId;
    a && o.addEventListener("click", async () => {
      await Ir(i, (c) => {
        const u = c.findIndex((g) => g.id === a);
        if (u <= 0) return !1;
        const [d] = c.splice(u, 1);
        return c.splice(u - 1, 0, d), Sr(c), !0;
      }) && await Vt(e, t, i);
    });
  }), t.querySelectorAll('[data-criteria-action="move-down"]').forEach((o) => {
    const a = o.dataset.criterionId;
    a && o.addEventListener("click", async () => {
      await Ir(i, (c) => {
        const u = c.findIndex((g) => g.id === a);
        if (u < 0 || u >= c.length - 1) return !1;
        const [d] = c.splice(u, 1);
        return c.splice(u + 1, 0, d), Sr(c), !0;
      }) && await Vt(e, t, i);
    });
  });
}
s(ec, "bindCriteriaTabEvents");
async function Ir(e, t) {
  const n = Ae(e).sort((r, o) => r.order - o.order);
  if (t(n) === !1) return !1;
  try {
    return await cr(e, n), !0;
  } catch (r) {
    return ms(r), !1;
  }
}
s(Ir, "mutateCriteria");
function ca(e, t = {}) {
  const n = t.scene ?? null, i = n && Ce(n) ? n : We(e);
  if (!Ce(i))
    return;
  Yl({
    scene: i,
    criterion: t.criterion ?? null,
    isNew: !!t.isNew,
    onSave: typeof t.onSave == "function" ? t.onSave : null
  }).render({ force: !0 });
}
s(ca, "openCriterionEditor");
function Sr(e) {
  e.forEach((t, n) => {
    t.order = n;
  });
}
s(Sr, "reindexCriteriaOrder");
function tc(e) {
  var t, n;
  if ((n = (t = game.i18n) == null ? void 0 : t.has) != null && n.call(t, "EIDOLON.SceneCriteria.ValueCountLabel"))
    try {
      return game.i18n.format("EIDOLON.SceneCriteria.ValueCountLabel", { count: e });
    } catch (i) {
      console.error(`${de} | Failed to format value count label`, i);
    }
  return e === 0 ? "No values configured" : e === 1 ? "1 value" : `${e} values`;
}
s(tc, "formatValueCount");
let ua = !1;
function nc() {
  Hooks.once("init", () => {
    jl();
  }), Hooks.once("ready", () => {
    us() && (ua || (Xl(), ua = !0));
  });
}
s(nc, "registerSceneCriteriaHooks");
nc();
const G = S, ys = "criteriaEngineVersion", Dt = "fileIndex", Ft = "tileCriteria", xo = {
  LEGACY: 1,
  CRITERIA: 2
}, bs = xo.CRITERIA;
function Ts(e) {
  var t;
  return ((t = e == null ? void 0 : e.getFlag) == null ? void 0 : t.call(e, G, ys)) ?? xo.LEGACY;
}
s(Ts, "getSceneEngineVersion");
function ic(e, t, n, i, r) {
  if (!(e != null && e.length) || !(n != null && n.length)) return -1;
  const o = {};
  for (const l of n)
    o[l] = t[l];
  const a = da(e, o, n);
  if (a >= 0) return a;
  if (i != null && i.length && r) {
    const l = { ...o };
    for (const c of i) {
      if (!(c in l)) continue;
      l[c] = r[c] ?? "Standard";
      const u = da(e, l, n);
      if (u >= 0) return u;
    }
  }
  return -1;
}
s(ic, "findBestMatch");
function da(e, t, n) {
  return e.findIndex((i) => {
    for (const r of n)
      if (i[r] !== t[r]) return !1;
    return !0;
  });
}
s(da, "findExactMatch");
function rc(e, t) {
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
s(rc, "findFileIndex");
function si(e) {
  return e && typeof e == "object" && !Array.isArray(e);
}
s(si, "isPlainObject$2");
function fa(e) {
  return e == null ? e : typeof structuredClone == "function" ? structuredClone(e) : JSON.parse(JSON.stringify(e));
}
s(fa, "deepClone");
function oc(e, t) {
  if (!t) return;
  const n = t.split(".").filter(Boolean);
  if (!n.length) return;
  let i = e;
  for (let r = 0; r < n.length - 1; r += 1) {
    if (!si(i == null ? void 0 : i[n[r]])) return;
    i = i[n[r]];
  }
  delete i[n.at(-1)];
}
s(oc, "deletePath");
function Es(e, t) {
  const n = fa(e ?? {});
  if (!si(t)) return n;
  for (const [i, r] of Object.entries(t)) {
    if (i.startsWith("-=") && r === !0) {
      oc(n, i.slice(2));
      continue;
    }
    si(r) && si(n[i]) ? n[i] = Es(n[i], r) : n[i] = fa(r);
  }
  return n;
}
s(Es, "fallbackMerge");
function ac(e, t) {
  var n, i;
  return (n = foundry == null ? void 0 : foundry.utils) != null && n.mergeObject && ((i = foundry == null ? void 0 : foundry.utils) != null && i.deepClone) ? foundry.utils.mergeObject(e, foundry.utils.deepClone(t), {
    inplace: !1
  }) : Es(e, t);
}
s(ac, "defaultMerge");
function sc(e, t) {
  if (!e) return !0;
  for (const n of Object.keys(e))
    if (e[n] !== t[n]) return !1;
  return !0;
}
s(sc, "criteriaMatch");
function Cs(e, t, n, i) {
  const r = i ?? ac;
  let o = r({}, e ?? {});
  if (!(t != null && t.length)) return o;
  const a = [];
  for (let l = 0; l < t.length; l += 1) {
    const c = t[l];
    if (sc(c == null ? void 0 : c.criteria, n)) {
      const u = c != null && c.criteria ? Object.keys(c.criteria).length : 0;
      a.push({ specificity: u, index: l, delta: c == null ? void 0 : c.delta });
    }
  }
  a.sort((l, c) => l.specificity - c.specificity || l.index - c.index);
  for (const l of a)
    l.delta && (o = r(o, l.delta));
  return o;
}
s(Cs, "resolveRules");
function ur(e = null) {
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
s(ur, "canManageCriteria");
function lc(e = null) {
  if (!ur(e))
    throw new Error(`${G} | You do not have permission to manage scene criteria.`);
}
s(lc, "requireCriteriaAccess");
const cc = /* @__PURE__ */ s((...e) => console.log(`${G} | criteria tiles:`, ...e), "log$1");
let wi = /* @__PURE__ */ new WeakMap(), Ii = /* @__PURE__ */ new WeakMap();
const ga = 200;
function uc(e) {
  return e ? Number.isInteger(e.size) ? e.size : Array.isArray(e) || typeof e.length == "number" ? e.length : Array.from(e).length : 0;
}
s(uc, "getCollectionSize$1");
function Kn() {
  return typeof (performance == null ? void 0 : performance.now) == "function" ? performance.now() : Date.now();
}
s(Kn, "nowMs$2");
function dc(e) {
  if (!Array.isArray(e)) return [];
  const t = /* @__PURE__ */ new Set();
  for (const n of e) {
    if (typeof n != "string") continue;
    const i = n.trim();
    i && t.add(i);
  }
  return Array.from(t);
}
s(dc, "uniqueStringKeys$1");
function fc(e, t = ga) {
  if (!Array.isArray(e) || e.length === 0) return [];
  const n = Number.isInteger(t) && t > 0 ? t : ga, i = [];
  for (let r = 0; r < e.length; r += n)
    i.push(e.slice(r, r + n));
  return i;
}
s(fc, "chunkArray$1");
async function gc(e, t, n) {
  const i = fc(t, n);
  for (const r of i)
    await e.updateEmbeddedDocuments("Tile", r), i.length > 1 && await Promise.resolve();
  return i.length;
}
s(gc, "updateTilesInChunks");
function mc(e) {
  var i;
  const t = $t(e, { files: null });
  if (!((i = t == null ? void 0 : t.variants) != null && i.length)) return [];
  const n = /* @__PURE__ */ new Set();
  for (const r of t.variants)
    for (const o of Object.keys(r.criteria ?? {}))
      o && n.add(o);
  return Array.from(n);
}
s(mc, "getTileCriteriaDependencyKeys");
function hc(e, t) {
  const n = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Set();
  for (const r of t) {
    const o = r.getFlag(G, Ft) ?? r.getFlag(G, Dt);
    if (o) {
      i.add(r.id);
      for (const a of mc(o))
        n.has(a) || n.set(a, /* @__PURE__ */ new Set()), n.get(a).add(r.id);
    }
  }
  return {
    collection: t,
    keyToTileIds: n,
    allTileIds: i
  };
}
s(hc, "buildTileDependencyIndex");
function pc(e, t) {
  const n = Ii.get(e);
  if ((n == null ? void 0 : n.collection) === t) return n;
  const i = hc(e, t);
  return Ii.set(e, i), i;
}
s(pc, "getTileDependencyIndex");
function yc(e, t, n) {
  const i = dc(n);
  if (!i.length)
    return Array.from(t ?? []);
  const r = pc(e, t), o = /* @__PURE__ */ new Set();
  for (const a of i) {
    const l = r.keyToTileIds.get(a);
    if (l)
      for (const c of l)
        o.add(c);
  }
  return o.size ? typeof (t == null ? void 0 : t.get) == "function" ? Array.from(o).map((a) => t.get(a)).filter(Boolean) : Array.from(t ?? []).filter((a) => o.has(a.id)) : [];
}
s(yc, "getTilesForChangedKeys");
function Ls(e) {
  return typeof (e == null ? void 0 : e.name) == "string" ? e.name : typeof (e == null ? void 0 : e.src) == "string" ? e.src : "";
}
s(Ls, "getFilePath");
function Si(e) {
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
s(Si, "normalizeFilePath");
function Ro(e) {
  if (!Array.isArray(e)) return [];
  const t = /* @__PURE__ */ new Map();
  return e.map((n, i) => {
    const r = Si(Ls(n)), o = r || `__index:${i}`, a = t.get(o) ?? 0;
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
s(Ro, "buildTileFileEntries");
function mt(e, t) {
  if (!Number.isInteger(t) || t < 0) return null;
  const i = Ro(e).find((r) => r.index === t);
  return i ? { ...i.target } : { indexHint: t };
}
s(mt, "createTileTargetFromIndex");
function dr(e) {
  if (!e || typeof e != "object") return null;
  const t = Si(e.path), n = Number(e.indexHint ?? e.fileIndex), i = Number(e.occurrence), r = {};
  return t && (r.path = t, r.occurrence = Number.isInteger(i) && i >= 0 ? i : 0), Number.isInteger(n) && n >= 0 && (r.indexHint = n), !r.path && !Number.isInteger(r.indexHint) ? null : r;
}
s(dr, "normalizeTileTarget");
function bn(e, t) {
  const n = dr(e);
  if (!n) return -1;
  const i = Ro(t);
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
s(bn, "resolveTileTargetIndex");
function ht(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return {};
  const t = {};
  for (const [n, i] of Object.entries(e))
    typeof n != "string" || !n || typeof i != "string" || !i.trim() || (t[n] = i.trim());
  return t;
}
s(ht, "sanitizeCriteria");
function bc(e) {
  return Object.entries(ht(e)).sort(([n], [i]) => n.localeCompare(i)).map(([n, i]) => `${n}=${i}`).join("");
}
s(bc, "serializeCriteria");
function Tc(e) {
  return Object.keys(ht(e)).length;
}
s(Tc, "getCriteriaSpecificity");
function Ec(e, t) {
  const n = ht(e), i = ht(t);
  for (const [r, o] of Object.entries(n))
    if (r in i && i[r] !== o)
      return !1;
  return !0;
}
s(Ec, "areCriteriaCompatible");
function Cc(e, t) {
  const n = bn(e, t);
  if (Number.isInteger(n) && n >= 0)
    return `index:${n}`;
  const i = dr(e);
  if (!i) return "";
  if (i.path) {
    const r = Number.isInteger(i.occurrence) ? i.occurrence : 0;
    return `path:${i.path}#${r}`;
  }
  return Number.isInteger(i.indexHint) ? `hint:${i.indexHint}` : "";
}
s(Cc, "getTargetIdentity");
function ws(e, t = {}) {
  var l;
  const n = Array.isArray(t.files) ? t.files : [], i = $t(e, { files: n });
  if (!((l = i == null ? void 0 : i.variants) != null && l.length))
    return {
      errors: [],
      warnings: []
    };
  const r = i.variants.map((c, u) => ({
    index: u,
    criteria: ht(c.criteria),
    specificity: Tc(c.criteria),
    criteriaSignature: bc(c.criteria),
    targetIdentity: Cc(c.target, n)
  })), o = [], a = [];
  for (let c = 0; c < r.length; c += 1) {
    const u = r[c];
    for (let d = c + 1; d < r.length; d += 1) {
      const g = r[d];
      if (u.specificity !== g.specificity || !Ec(u.criteria, g.criteria)) continue;
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
s(ws, "detectTileCriteriaConflicts");
function Lc(e, t) {
  if (!e || typeof e != "object") return null;
  let n = dr(e.target);
  if (!n) {
    const i = Number(e.fileIndex);
    Number.isInteger(i) && i >= 0 && (n = mt(t, i));
  }
  return n ? {
    criteria: ht(e.criteria),
    target: n
  } : null;
}
s(Lc, "normalizeTileVariant");
function Is(e, t = {}) {
  if (!Array.isArray(e) || e.length === 0) return null;
  const n = Array.isArray(t.files) ? t.files : null, i = e.map((c, u) => ({
    criteria: ht(c),
    target: mt(n, u)
  })).filter((c) => c.target);
  if (!i.length) return null;
  const r = i.find((c) => Object.keys(c.criteria).length === 0), o = (r == null ? void 0 : r.target) ?? i[0].target;
  let a = null;
  const l = Number(t.defaultFileIndex);
  return Number.isInteger(l) && l >= 0 && (a = mt(n, l)), a || (a = o), {
    strategy: "select-one",
    variants: i,
    defaultTarget: a
  };
}
s(Is, "buildTileCriteriaFromFileIndex");
function $t(e, t = {}) {
  const n = Array.isArray(t.files) ? t.files : null;
  if (Array.isArray(e))
    return Is(e, { files: n });
  if (!e || typeof e != "object") return null;
  const i = Array.isArray(e.variants) ? e.variants.map((o) => Lc(o, n)).filter(Boolean) : [];
  if (!i.length) return null;
  let r = dr(e.defaultTarget);
  if (!r) {
    const o = Number(e.defaultFileIndex);
    Number.isInteger(o) && o >= 0 && (r = mt(n, o));
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
s($t, "normalizeTileCriteria");
function wc(e, t) {
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
s(wc, "selectTileFileIndexFromCompiled");
function Ic(e, t) {
  const n = $t(e, { files: t });
  if (!n) return null;
  const i = n.variants.map((o) => {
    const a = ht(o.criteria), l = bn(o.target, t);
    return !Number.isInteger(l) || l < 0 ? null : {
      criteria: a,
      keys: Object.keys(a),
      targetIndex: l
    };
  }).filter(Boolean), r = bn(n.defaultTarget, t);
  return !i.length && (!Number.isInteger(r) || r < 0) ? null : {
    variants: i,
    defaultIndex: r
  };
}
s(Ic, "compileTileMatcher");
function Sc(e, t, n) {
  const i = wi.get(e);
  if (i && i.tileCriteria === t && i.files === n)
    return i.compiled;
  const r = Ic(t, n);
  return wi.set(e, {
    tileCriteria: t,
    files: n,
    compiled: r
  }), r;
}
s(Sc, "getCompiledTileMatcher");
function Oc(e = null, t = null) {
  e ? Ii.delete(e) : Ii = /* @__PURE__ */ new WeakMap(), t ? wi.delete(t) : e || (wi = /* @__PURE__ */ new WeakMap());
}
s(Oc, "invalidateTileCriteriaCaches");
async function Ss(e, t, n = {}) {
  var c, u, d, g;
  const i = Kn(), r = {
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
    return r.durationMs = Kn() - i, r;
  const o = t.getEmbeddedCollection("Tile") ?? [];
  r.total = uc(o);
  const a = yc(t, o, n.changedKeys);
  if (r.scanned = a.length, !a.length)
    return r.skipped.unaffected = r.total, r.durationMs = Kn() - i, r;
  const l = [];
  for (const m of a) {
    const y = m.getFlag(G, Ft) ?? m.getFlag(G, Dt);
    if (!y) {
      r.skipped.noCriteria += 1;
      continue;
    }
    const b = m.getFlag("monks-active-tiles", "files");
    if (!(b != null && b.length)) {
      r.skipped.noFiles += 1;
      continue;
    }
    const p = Sc(m, y, b), E = wc(p, e);
    if (!Number.isInteger(E) || E < 0 || E >= b.length) {
      console.warn(`${G} | Tile ${m.id} has no valid file match for state`, e), r.skipped.noMatch += 1;
      continue;
    }
    const T = E + 1, I = Number(m.getFlag("monks-active-tiles", "fileindex")) !== T, D = b.some((F, z) => !!(F != null && F.selected) != (z === E)), x = Si(((u = m.texture) == null ? void 0 : u.src) ?? ((g = (d = m._source) == null ? void 0 : d.texture) == null ? void 0 : g.src) ?? ""), _ = Ls(b[E]), q = Si(_), Q = !!q && q !== x;
    if (!D && !I && !Q) {
      r.skipped.unchanged += 1;
      continue;
    }
    const ee = {
      _id: m._id
    };
    D && (ee["flags.monks-active-tiles.files"] = b.map((F, z) => ({
      ...F,
      selected: z === E
    }))), I && (ee["flags.monks-active-tiles.fileindex"] = T), Q && (ee.texture = { src: _ }), l.push(ee), cc(`Tile ${m.id} -> ${_}`);
  }
  return l.length > 0 && (r.chunks = await gc(t, l, n.chunkSize), r.updated = l.length), r.durationMs = Kn() - i, r;
}
s(Ss, "updateTiles");
function vc() {
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
s(vc, "buildLightControlsMap");
const _t = S, Kt = "lightCriteria", ko = Object.freeze({
  base: null,
  mappings: [],
  current: null
});
function Or(e) {
  return e && typeof e == "object" && !Array.isArray(e);
}
s(Or, "isPlainObject$1");
function Os(e, t) {
  if (!Or(t)) return {};
  const n = {};
  for (const [i, r] of Object.entries(t)) {
    const o = e == null ? void 0 : e[i];
    if (Or(r) && Or(o)) {
      const a = Os(o, r);
      Object.keys(a).length > 0 && (n[i] = a);
    } else r !== o && (n[i] = Ge(r));
  }
  return n;
}
s(Os, "computeDelta");
function vs(e) {
  var n;
  const t = ((n = e == null ? void 0 : e.getFlag) == null ? void 0 : n.call(e, _t, Kt)) ?? ko;
  return Tn(t);
}
s(vs, "getLightCriteriaState");
async function Ms(e, t) {
  const n = Tn(t);
  if (!(e != null && e.setFlag))
    return n;
  const i = n.base !== null, r = n.mappings.length > 0, o = n.current !== null;
  return !i && !r && !o ? (typeof e.unsetFlag == "function" ? await e.unsetFlag(_t, Kt) : await e.setFlag(_t, Kt, null), ko) : (await e.setFlag(_t, Kt, n), n);
}
s(Ms, "setLightCriteriaState");
async function qn(e, t) {
  if (typeof t != "function")
    throw new TypeError("updateLightCriteriaState requires an updater function.");
  const n = Ge(vs(e)), i = await t(n);
  return Ms(e, i);
}
s(qn, "updateLightCriteriaState");
async function ma(e, t) {
  const n = Pt(t);
  if (!n)
    throw new Error("Invalid light configuration payload.");
  return qn(e, (i) => ({
    ...i,
    base: n
  }));
}
s(ma, "storeBaseLighting");
async function ha(e, t, n, { label: i } = {}) {
  const r = Un(t);
  if (!r)
    throw new Error("Cannot create a mapping without at least one category selection.");
  const o = Pt(n);
  if (!o)
    throw new Error("Invalid light configuration payload.");
  return qn(e, (a) => {
    const l = tn(r), c = Array.isArray(a == null ? void 0 : a.mappings) ? [...a.mappings] : [], u = c.findIndex((y) => (y == null ? void 0 : y.key) === l), d = u >= 0 ? c[u] : null, g = typeof (d == null ? void 0 : d.id) == "string" && d.id.trim() ? d.id.trim() : Ns(), m = fr({
      id: g,
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
s(ha, "upsertLightCriteriaMapping");
async function Mc(e, t, n, i, { replaceExisting: r = !1 } = {}) {
  const o = typeof t == "string" ? t.trim() : "";
  if (!o)
    throw new Error("A mapping id is required to retarget criteria.");
  const a = Un(n);
  if (!a)
    throw new Error("Cannot retarget mapping without at least one category selection.");
  const l = Pt(i);
  if (!l)
    throw new Error("Invalid light configuration payload.");
  return qn(e, (c) => {
    const u = Array.isArray(c == null ? void 0 : c.mappings) ? [...c.mappings] : [], d = u.findIndex((T) => (T == null ? void 0 : T.id) === o);
    if (d < 0)
      throw new Error("The selected mapping no longer exists.");
    const g = tn(a), m = u.findIndex(
      (T, C) => C !== d && (T == null ? void 0 : T.key) === g
    );
    if (m >= 0 && !r)
      throw new Error("A mapping already exists for the selected criteria.");
    const y = u[d], b = fr({
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
      const [T] = u.splice(m, 1);
      p = (T == null ? void 0 : T.id) ?? null;
    }
    let E = (c == null ? void 0 : c.current) ?? null;
    return E && typeof E == "object" && (E.mappingId === o ? E = {
      ...E,
      mappingId: o,
      categories: a,
      updatedAt: Date.now()
    } : p && E.mappingId === p && (E = {
      ...E,
      mappingId: o,
      categories: a,
      updatedAt: Date.now()
    })), {
      ...c,
      mappings: u,
      current: E
    };
  });
}
s(Mc, "retargetLightCriteriaMapping");
async function Ac(e, t) {
  const n = typeof t == "string" ? t.trim() : "";
  if (!n)
    throw new Error("A mapping id is required to remove a mapping.");
  return qn(e, (i) => {
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
s(Ac, "removeLightCriteriaMapping");
async function hn(e, t) {
  const n = As(t);
  return qn(e, (i) => ({
    ...i,
    current: n
  }));
}
s(hn, "storeCurrentCriteriaSelection");
function Nc(e) {
  const t = Tn(e), n = t.base ?? {}, i = [];
  for (const r of t.mappings) {
    const o = Un(r == null ? void 0 : r.categories);
    if (!o) continue;
    const a = Os(n, (r == null ? void 0 : r.config) ?? {});
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
s(Nc, "convertLightCriteriaStateToPresets");
function Dc(e, t = []) {
  const n = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Set();
  for (const c of t)
    typeof (c == null ? void 0 : c.key) == "string" && c.key.trim() && i.add(c.key.trim()), typeof (c == null ? void 0 : c.id) == "string" && c.id.trim() && typeof (c == null ? void 0 : c.key) == "string" && n.set(c.id.trim(), c.key.trim());
  const r = Tn(e), o = /* @__PURE__ */ s((c) => {
    const u = {};
    for (const [d, g] of Object.entries(c ?? {})) {
      const m = String(d ?? "").trim(), y = typeof g == "string" ? g.trim() : "";
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
    return u ? fr({
      ...c,
      categories: u,
      key: tn(u)
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
  return Tn({
    ...r,
    mappings: a,
    current: l
  });
}
s(Dc, "migrateLightCriteriaCategoriesToKeys");
function Tn(e) {
  var c;
  const t = Ge(e);
  if (!t || typeof t != "object")
    return Ge(ko);
  const n = Pt(t.base), i = Array.isArray(t.mappings) ? t.mappings : [], r = /* @__PURE__ */ new Map();
  for (const u of i) {
    const d = fr(u);
    d && r.set(d.key, d);
  }
  const o = Array.from(r.values()), a = new Map(o.map((u) => [u.id, u]));
  let l = As(t.current);
  if (l) {
    const u = l.categories && Object.keys(l.categories).length > 0;
    if (l.mappingId && !a.has(l.mappingId)) {
      const d = u ? ((c = o.find((g) => g.key === tn(l.categories))) == null ? void 0 : c.id) ?? null : null;
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
s(Tn, "sanitizeLightCriteriaState");
function Pt(e) {
  const t = Ge(e);
  if (!t || typeof t != "object") return null;
  "_id" in t && delete t._id, "id" in t && delete t.id;
  const n = t.flags;
  if (n && typeof n == "object") {
    const i = n[_t];
    i && typeof i == "object" && (delete i[Kt], Object.keys(i).length === 0 && delete n[_t]), Object.keys(n).length === 0 && delete t.flags;
  }
  return t;
}
s(Pt, "sanitizeLightConfigPayload");
function fr(e) {
  if (!e || typeof e != "object") return null;
  const t = Un(e.categories);
  if (!t) return null;
  const n = Pt(e.config);
  if (!n) return null;
  const i = typeof e.id == "string" && e.id.trim() ? e.id.trim() : Ns(), r = tn(t), o = {
    id: i,
    key: r,
    categories: t,
    config: n,
    updatedAt: Number.isFinite(e.updatedAt) ? Number(e.updatedAt) : Date.now()
  };
  return typeof e.label == "string" && e.label.trim() && (o.label = e.label.trim()), o;
}
s(fr, "sanitizeCriteriaMappingEntry");
function As(e) {
  if (!e || typeof e != "object") return null;
  const t = typeof e.mappingId == "string" && e.mappingId.trim() ? e.mappingId.trim() : null, n = Un(e.categories);
  return !t && !n ? null : {
    mappingId: t,
    categories: n,
    updatedAt: Number.isFinite(e.updatedAt) ? Number(e.updatedAt) : Date.now()
  };
}
s(As, "sanitizeCurrentSelection");
function Un(e) {
  const t = {};
  if (Array.isArray(e))
    for (const n of e) {
      const i = pa((n == null ? void 0 : n.id) ?? (n == null ? void 0 : n.categoryId) ?? (n == null ? void 0 : n.category)), r = ya((n == null ? void 0 : n.value) ?? (n == null ? void 0 : n.selection) ?? (n == null ? void 0 : n.label));
      !i || !r || (t[i] = r);
    }
  else if (e && typeof e == "object")
    for (const [n, i] of Object.entries(e)) {
      const r = pa(n), o = ya(i);
      !r || !o || (t[r] = o);
    }
  return Object.keys(t).length > 0 ? t : null;
}
s(Un, "sanitizeCriteriaCategories");
function tn(e) {
  if (!e || typeof e != "object") return "";
  const t = Object.entries(e).filter(([, n]) => typeof n == "string" && n).map(([n, i]) => `${n}:${i}`);
  return t.sort((n, i) => n < i ? -1 : n > i ? 1 : 0), t.join("|");
}
s(tn, "computeCriteriaMappingKey");
function Ns() {
  var e;
  return (e = foundry == null ? void 0 : foundry.utils) != null && e.randomID ? foundry.utils.randomID() : typeof (crypto == null ? void 0 : crypto.randomUUID) == "function" ? crypto.randomUUID() : Math.random().toString(36).slice(2, 10);
}
s(Ns, "generateLightMappingId");
function pa(e) {
  if (typeof e != "string") return null;
  const t = e.trim();
  return t || null;
}
s(pa, "normalizeCategoryId");
function ya(e) {
  if (typeof e != "string") return null;
  const t = e.trim();
  return t || null;
}
s(ya, "normalizeCategoryValue");
const Oi = ["AmbientLight", "Wall", "AmbientSound"];
let vi = /* @__PURE__ */ new WeakMap(), Mi = /* @__PURE__ */ new WeakMap();
const ba = 200;
function Fc(e) {
  return e ? Number.isInteger(e.size) ? e.size : Array.isArray(e) || typeof e.length == "number" ? e.length : Array.from(e).length : 0;
}
s(Fc, "getCollectionSize");
function vr() {
  return typeof (performance == null ? void 0 : performance.now) == "function" ? performance.now() : Date.now();
}
s(vr, "nowMs$1");
function _c(e) {
  if (!Array.isArray(e)) return [];
  const t = /* @__PURE__ */ new Set();
  for (const n of e) {
    if (typeof n != "string") continue;
    const i = n.trim();
    i && t.add(i);
  }
  return Array.from(t);
}
s(_c, "uniqueStringKeys");
function xc(e, t = ba) {
  if (!Array.isArray(e) || e.length === 0) return [];
  const n = Number.isInteger(t) && t > 0 ? t : ba, i = [];
  for (let r = 0; r < e.length; r += n)
    i.push(e.slice(r, r + n));
  return i;
}
s(xc, "chunkArray");
async function Rc(e, t, n, i) {
  const r = xc(n, i);
  for (const o of r)
    await e.updateEmbeddedDocuments(t, o), r.length > 1 && await Promise.resolve();
  return r.length;
}
s(Rc, "updatePlaceablesInChunks");
function kc(e) {
  const t = /* @__PURE__ */ new Set();
  for (const n of (e == null ? void 0 : e.rules) ?? [])
    for (const i of Object.keys((n == null ? void 0 : n.criteria) ?? {}))
      i && t.add(i);
  return Array.from(t);
}
s(kc, "getPresetDependencyKeys");
function Hc(e, t) {
  const n = /* @__PURE__ */ new Map();
  for (const i of Oi) {
    const r = t.get(i) ?? [], o = /* @__PURE__ */ new Set(), a = /* @__PURE__ */ new Map();
    for (const l of r) {
      const c = Fs(l, i);
      if (c != null && c.base) {
        o.add(l.id);
        for (const u of kc(c))
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
s(Hc, "buildPlaceableDependencyIndex");
function $c(e, t) {
  const n = Mi.get(e);
  if (n && Oi.every((r) => n.collectionsByType.get(r) === t.get(r)))
    return n;
  const i = Hc(e, t);
  return Mi.set(e, i), i;
}
s($c, "getPlaceableDependencyIndex");
function Pc(e, t, n) {
  if (!t || !e) return [];
  const i = _c(n);
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
s(Pc, "getDocsForChangedKeys");
function jt(e) {
  return !!e && typeof e == "object" && !Array.isArray(e);
}
s(jt, "isPlainObject");
function co(e, t) {
  if (Object.is(e, t)) return !0;
  if (Array.isArray(e) || Array.isArray(t)) {
    if (!Array.isArray(e) || !Array.isArray(t) || e.length !== t.length) return !1;
    for (let n = 0; n < e.length; n += 1)
      if (!co(e[n], t[n])) return !1;
    return !0;
  }
  if (jt(e) || jt(t)) {
    if (!jt(e) || !jt(t)) return !1;
    const n = Object.keys(t);
    for (const i of n)
      if (!co(e[i], t[i])) return !1;
    return !0;
  }
  return !1;
}
s(co, "areValuesEqual");
function Ds(e, t) {
  const n = { _id: t._id };
  for (const [r, o] of Object.entries(t)) {
    if (r === "_id") continue;
    const a = e == null ? void 0 : e[r];
    if (jt(o) && jt(a)) {
      const l = Ds(a, { _id: t._id, ...o });
      if (!l) continue;
      const c = Object.keys(l).filter((u) => u !== "_id");
      if (c.length > 0) {
        n[r] = {};
        for (const u of c)
          n[r][u] = l[u];
      }
      continue;
    }
    co(a, o) || (n[r] = o);
  }
  return Object.keys(n).filter((r) => r !== "_id").length > 0 ? n : null;
}
s(Ds, "buildChangedPayload");
function Fs(e, t) {
  var l;
  const n = ((l = e == null ? void 0 : e.flags) == null ? void 0 : l[G]) ?? {}, i = (n == null ? void 0 : n.presets) ?? null, r = t === "AmbientLight" ? (n == null ? void 0 : n.lightCriteria) ?? null : null, o = vi.get(e);
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
    const c = Nc(n.lightCriteria);
    (c.base && Object.keys(c.base).length > 0 || c.rules.length > 0) && (a = {
      base: c.base,
      rules: c.rules
    });
  }
  return vi.set(e, {
    type: t,
    rawPresets: i,
    rawLightCriteria: r,
    presets: a
  }), a;
}
s(Fs, "getPresetsForDocument");
function Bc(e = null, t = null) {
  e ? Mi.delete(e) : Mi = /* @__PURE__ */ new WeakMap(), t ? vi.delete(t) : e || (vi = /* @__PURE__ */ new WeakMap());
}
s(Bc, "invalidatePlaceableCriteriaCaches");
async function _s(e, t, n = {}) {
  var c, u;
  const i = vr(), r = {
    total: 0,
    scanned: 0,
    updated: 0,
    chunks: 0,
    byType: {},
    durationMs: 0
  };
  if (t = t ?? ((c = game.scenes) == null ? void 0 : c.viewed), !t)
    return r.durationMs = vr() - i, r;
  const o = new Set(vc()), a = new Map(
    Oi.map((d) => [d, t.getEmbeddedCollection(d) ?? []])
  ), l = $c(t, a);
  for (const d of Oi) {
    const g = a.get(d) ?? [], m = {
      total: Fc(g),
      scanned: 0,
      updated: 0,
      chunks: 0
    }, y = l.byType.get(d) ?? null, b = Pc(g, y, n.changedKeys);
    if (m.scanned = b.length, r.total += m.total, r.scanned += m.scanned, r.byType[d] = m, !b.length) continue;
    const p = [];
    for (const E of b) {
      const T = Fs(E, d);
      if (!(T != null && T.base)) continue;
      const C = Cs(T.base, T.rules ?? [], e);
      C._id = E._id, d === "AmbientLight" && o.has(E._id) && (C.hidden = !0);
      const I = (E == null ? void 0 : E._source) ?? ((u = E == null ? void 0 : E.toObject) == null ? void 0 : u.call(E)) ?? {}, D = Ds(I, C);
      D && p.push(D);
    }
    p.length > 0 && (m.chunks = await Rc(t, d, p, n.chunkSize), m.updated = p.length, r.updated += p.length, r.chunks += m.chunks, console.log(`${G} | Updated ${p.length} ${d}(s)`));
  }
  return r.durationMs = vr() - i, r;
}
s(_s, "updatePlaceables");
function Ta() {
  return typeof (performance == null ? void 0 : performance.now) == "function" ? performance.now() : Date.now();
}
s(Ta, "nowMs");
function qc(e) {
  var t;
  return e = e ?? ((t = game.scenes) == null ? void 0 : t.viewed), e ? Bn(e) : null;
}
s(qc, "getState");
async function xs(e, t) {
  var m;
  const n = Ta();
  if (t = t ?? ((m = game.scenes) == null ? void 0 : m.viewed), !t) return null;
  lc(t);
  const i = Ae(t);
  if (!i.length)
    return console.warn(`${G} | applyState skipped: scene has no criteria.`), null;
  const r = Bn(t, i), o = _o({ ...r, ...e ?? {} }, i), a = i.filter((y) => (r == null ? void 0 : r[y.key]) !== (o == null ? void 0 : o[y.key])).map((y) => y.key), l = a.length > 0;
  l && await Gl(t, o, i);
  const c = l ? o : r, [u, d] = await Promise.all([
    Ss(c, t, { changedKeys: a }),
    _s(c, t, { changedKeys: a })
  ]), g = Ta() - n;
  return w("Criteria apply telemetry", {
    sceneId: t.id,
    changedKeys: a,
    didChange: l,
    durationMs: g,
    tiles: u,
    placeables: d
  }), Hooks.callAll("eidolon-utilities.criteriaStateApplied", t, c), c;
}
s(xs, "applyState");
function Uc(e) {
  var t;
  return e = e ?? ((t = game.scenes) == null ? void 0 : t.viewed), e ? Ts(e) : null;
}
s(Uc, "getVersion");
async function Rs(e, t) {
  var n;
  t = t ?? ((n = game.scenes) == null ? void 0 : n.viewed), t != null && t.setFlag && await t.setFlag(G, ys, Number(e));
}
s(Rs, "setVersion");
async function Vc(e) {
  return Rs(bs, e);
}
s(Vc, "markCurrentVersion");
const fn = "Standard", jc = /* @__PURE__ */ s((...e) => console.log(`${G} | criteria indexer:`, ...e), "log");
function Ho(e) {
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
s(Ho, "parseFileTags");
function zc(e, t, n = fn) {
  return e != null && e.length ? e.map((i) => {
    const r = Ho(i == null ? void 0 : i.name);
    if (!r) return {};
    const o = {};
    for (const [a, l] of Object.entries(t)) {
      const c = r[Number(a)];
      c != null && c !== n && (o[l] = c);
    }
    return o;
  }) : [];
}
s(zc, "buildFileIndex");
function Gc(e, t) {
  return e.map((n, i) => {
    const r = [...t[n] ?? /* @__PURE__ */ new Set()].sort(), a = r.includes(fn) ? fn : r[0] ?? fn, l = Fo(n);
    return l.key = n, l.label = n.charAt(0).toUpperCase() + n.slice(1), l.values = r.length ? r : [fn], l.default = l.values.includes(a) ? a : l.values[0], l.order = i, l;
  });
}
s(Gc, "buildCriteriaDefinitions");
async function Jn(e, t, n, { dryRun: i = !1 } = {}) {
  const r = e.getFlag("monks-active-tiles", "files");
  if (!(r != null && r.length)) return null;
  const o = zc(r, t), a = Is(o, { files: r });
  for (const l of r) {
    const c = Ho(l == null ? void 0 : l.name);
    if (c)
      for (const [u, d] of Object.entries(t)) {
        const g = c[Number(u)];
        g != null && n[d] && n[d].add(g);
      }
  }
  return i || (await e.setFlag(G, Ft, a), typeof e.unsetFlag == "function" && await e.unsetFlag(G, Dt)), { files: r.length };
}
s(Jn, "indexTile");
async function Wc(e, t = {}) {
  var C, I, D, x;
  const {
    dryRun: n = !1,
    force: i = !1
  } = t;
  if (e = e ?? ((C = game.scenes) == null ? void 0 : C.viewed), !e) throw new Error("No scene provided to indexScene.");
  if (!globalThis.Tagger) throw new Error("Tagger is required to index scene criteria.");
  if (!i && Ts(e) >= bs)
    throw new Error(
      `Scene "${e.name}" is already criteria-indexed. Use force: true to re-index.`
    );
  const r = { sceneId: e.id }, o = Tagger.getByTag("Map", r) ?? [];
  if (!o.length) throw new Error("No Map tile found.");
  if (o.length > 1) throw new Error(`Expected 1 Map tile, found ${o.length}.`);
  const a = o[0], l = a.getFlag("monks-active-tiles", "files");
  if (!(l != null && l.length)) throw new Error("Map tile has no MATT files.");
  const c = Ho((I = l[0]) == null ? void 0 : I.name);
  if (!(c != null && c.length))
    throw new Error(`Cannot parse bracket tags from: ${((D = l[0]) == null ? void 0 : D.name) ?? "<unknown>"}`);
  if (c.length < 3)
    throw new Error(`Expected 3+ bracket tags, found ${c.length}.`);
  const u = Tagger.getByTag("Floor", r) ?? [], d = Tagger.getByTag("Roof", r) ?? [], g = Tagger.getByTag("Weather", r) ?? [];
  let m;
  const y = [];
  c.length >= 4 ? (m = { 0: "mood", 1: "stage", 2: "variant", 3: "effect" }, y.push("mood", "stage", "variant", "effect")) : (m = { 0: "mood", 1: "variant", 2: "effect" }, y.push("mood", "variant", "effect"));
  const b = { 1: "effect" }, p = {};
  for (const _ of y)
    p[_] = /* @__PURE__ */ new Set();
  const E = {
    map: null,
    floor: [],
    roof: [],
    weather: []
  };
  E.map = await Jn(a, m, p, { dryRun: n });
  for (const _ of u) {
    const q = await Jn(_, m, p, { dryRun: n });
    q && E.floor.push(q);
  }
  for (const _ of d) {
    const q = await Jn(_, m, p, { dryRun: n });
    q && E.roof.push(q);
  }
  for (const _ of g) {
    const q = await Jn(_, b, p, { dryRun: n });
    q && E.weather.push(q);
  }
  const T = Gc(y, p);
  return n || (await cr(e, T), await Vc(e)), jc(
    n ? "Dry run complete" : "Indexing complete",
    `- ${T.length} criteria,`,
    `${((x = E.map) == null ? void 0 : x.files) ?? 0} map files`
  ), {
    criteria: T,
    state: T.reduce((_, q) => (_[q.key] = q.default, _), {}),
    tiles: E,
    overlayMode: g.length > 0
  };
}
s(Wc, "indexScene");
var Na, be, ve, Me, At, Ie, je, st, or, ne, ks, Hs, $s, fo, Ps, go, Bs, gn, mo;
const Fe = class Fe extends Pn($n) {
  constructor(n = {}) {
    var i;
    super(n);
    M(this, ne);
    M(this, be, null);
    M(this, ve, []);
    M(this, Me, {});
    M(this, At, !1);
    M(this, Ie, null);
    M(this, je, null);
    M(this, st, null);
    M(this, or, 120);
    this.setScene(n.scene ?? ((i = game.scenes) == null ? void 0 : i.viewed) ?? null);
  }
  setScene(n) {
    var i;
    v(this, be, n ?? ((i = game.scenes) == null ? void 0 : i.viewed) ?? null), L(this, ne, ks).call(this);
  }
  get scene() {
    return h(this, be);
  }
  async _prepareContext() {
    var r;
    const n = !!h(this, be), i = n && h(this, ve).length > 0;
    return {
      hasScene: n,
      hasCriteria: i,
      sceneName: ((r = h(this, be)) == null ? void 0 : r.name) ?? f("EIDOLON.CriteriaSwitcher.NoScene", "No active scene"),
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
      criteria: h(this, ve).map((o) => ({
        key: o.key,
        label: o.label || o.key,
        values: o.values.map((a) => {
          var l;
          return {
            value: a,
            selected: ((l = h(this, Me)) == null ? void 0 : l[o.key]) === a
          };
        }),
        defaultValue: o.default
      })),
      stateSummary: L(this, ne, mo).call(this)
    };
  }
  _onRender(n, i) {
    super._onRender(n, i), L(this, ne, Hs).call(this), L(this, ne, $s).call(this);
  }
  async _onClose(n) {
    return h(this, Ie) !== null && (clearTimeout(h(this, Ie)), v(this, Ie, null)), h(this, st) !== null && (Hooks.off("eidolon-utilities.criteriaStateApplied", h(this, st)), v(this, st, null)), super._onClose(n);
  }
};
be = new WeakMap(), ve = new WeakMap(), Me = new WeakMap(), At = new WeakMap(), Ie = new WeakMap(), je = new WeakMap(), st = new WeakMap(), or = new WeakMap(), ne = new WeakSet(), ks = /* @__PURE__ */ s(function() {
  if (!h(this, be)) {
    v(this, ve, []), v(this, Me, {});
    return;
  }
  v(this, ve, Ae(h(this, be)).sort((n, i) => n.order - i.order)), v(this, Me, Bn(h(this, be), h(this, ve)));
}, "#hydrateFromScene"), Hs = /* @__PURE__ */ s(function() {
  var i, r;
  const n = this.element;
  n instanceof HTMLElement && (n.querySelectorAll("[data-criteria-key]").forEach((o) => {
    o.addEventListener("change", (a) => {
      const l = a.currentTarget;
      if (!(l instanceof HTMLSelectElement)) return;
      const c = l.dataset.criteriaKey;
      c && (v(this, Me, {
        ...h(this, Me),
        [c]: l.value
      }), L(this, ne, Ps).call(this, { [c]: l.value }));
    });
  }), (i = n.querySelector("[data-action='reset-defaults']")) == null || i.addEventListener("click", () => {
    L(this, ne, Bs).call(this);
  }), (r = n.querySelector("[data-action='close-switcher']")) == null || r.addEventListener("click", () => {
    this.close();
  }));
}, "#bindEvents"), $s = /* @__PURE__ */ s(function() {
  h(this, st) === null && v(this, st, Hooks.on("eidolon-utilities.criteriaStateApplied", (n, i) => {
    !h(this, be) || (n == null ? void 0 : n.id) !== h(this, be).id || h(this, At) || (v(this, Me, { ...i ?? {} }), this.render({ force: !0 }));
  }));
}, "#ensureSyncHook"), fo = /* @__PURE__ */ s(async function(n) {
  var i, r;
  if (h(this, be)) {
    L(this, ne, gn).call(this, "applying"), v(this, At, !0);
    try {
      const o = await xs(n, h(this, be));
      o && v(this, Me, o), L(this, ne, gn).call(this, "ready"), this.render({ force: !0 });
    } catch (o) {
      console.error(`${G} | Failed to apply criteria state`, o), (r = (i = ui.notifications) == null ? void 0 : i.error) == null || r.call(
        i,
        f(
          "EIDOLON.CriteriaSwitcher.ApplyError",
          "Failed to apply the selected criteria state."
        )
      ), L(this, ne, gn).call(this, "error", (o == null ? void 0 : o.message) ?? "Unknown error");
    } finally {
      v(this, At, !1), h(this, je) && L(this, ne, go).call(this);
    }
  }
}, "#applyPartialState"), Ps = /* @__PURE__ */ s(function(n) {
  v(this, je, {
    ...h(this, je) ?? {},
    ...n ?? {}
  }), h(this, Ie) !== null && clearTimeout(h(this, Ie)), L(this, ne, gn).call(this, "applying"), v(this, Ie, setTimeout(() => {
    v(this, Ie, null), L(this, ne, go).call(this);
  }, h(this, or)));
}, "#queuePartialState"), go = /* @__PURE__ */ s(async function() {
  if (h(this, At) || !h(this, je)) return;
  const n = h(this, je);
  v(this, je, null), await L(this, ne, fo).call(this, n);
}, "#flushPendingState"), Bs = /* @__PURE__ */ s(async function() {
  if (!h(this, ve).length) return;
  const n = h(this, ve).reduce((i, r) => (i[r.key] = r.default, i), {});
  v(this, Me, n), h(this, Ie) !== null && (clearTimeout(h(this, Ie)), v(this, Ie, null)), v(this, je, null), await L(this, ne, fo).call(this, n);
}, "#resetToDefaults"), gn = /* @__PURE__ */ s(function(n, i = "") {
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
        o.textContent = `${f("EIDOLON.CriteriaSwitcher.Ready", "Ready")}: ${L(this, ne, mo).call(this)}`;
        break;
    }
}, "#setStatus"), mo = /* @__PURE__ */ s(function() {
  return h(this, ve).length ? `[${h(this, ve).map((n) => {
    var i;
    return ((i = h(this, Me)) == null ? void 0 : i[n.key]) ?? n.default;
  }).join(" | ")}]` : "-";
}, "#formatStateSummary"), s(Fe, "CriteriaSwitcherApplication"), Pe(Fe, "APP_ID", `${G}-criteria-switcher`), Pe(Fe, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  nt(Fe, Fe, "DEFAULT_OPTIONS"),
  {
    id: Fe.APP_ID,
    classes: Array.from(
      /* @__PURE__ */ new Set([...((Na = nt(Fe, Fe, "DEFAULT_OPTIONS")) == null ? void 0 : Na.classes) ?? [], "eidolon-criteria-switcher-window", "themed"])
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
)), Pe(Fe, "PARTS", {
  content: {
    template: `modules/${G}/templates/criteria-switcher.html`
  }
});
let uo = Fe;
const Kc = lr(uo);
let xt = null;
function Jc(e) {
  var t;
  return e ?? ((t = game.scenes) == null ? void 0 : t.viewed) ?? null;
}
s(Jc, "resolveScene");
function Yc(e) {
  var t;
  return !!(e != null && e.rendered && ((t = e == null ? void 0 : e.element) != null && t.isConnected));
}
s(Yc, "isRendered");
function gr() {
  return Yc(xt) ? xt : (xt = null, null);
}
s(gr, "getCriteriaSwitcher");
function qs(e) {
  var i, r, o, a, l;
  const t = Jc(e);
  if (!t)
    return (r = (i = ui.notifications) == null ? void 0 : i.warn) == null || r.call(i, "No active scene to open the criteria switcher."), null;
  if (!ur(t))
    return (a = (o = ui.notifications) == null ? void 0 : o.warn) == null || a.call(o, "You do not have permission to manage scene criteria."), null;
  const n = gr();
  return n ? (n.setScene(t), n.render({ force: !0 }), (l = n.bringToFront) == null || l.call(n), n) : (xt = Kc({ scene: t }), xt.render({ force: !0 }), xt);
}
s(qs, "openCriteriaSwitcher");
function Us() {
  const e = gr();
  e && (e.close(), xt = null);
}
s(Us, "closeCriteriaSwitcher");
function $o(e) {
  return gr() ? (Us(), null) : qs(e);
}
s($o, "toggleCriteriaSwitcher");
const Qc = {
  SCHEMA_VERSION: xo,
  applyState: xs,
  getState: qc,
  getVersion: Uc,
  setVersion: Rs,
  getCriteria(e) {
    var t;
    return Ae(e ?? ((t = game.scenes) == null ? void 0 : t.viewed));
  },
  setCriteria(e, t) {
    var n;
    return cr(t ?? ((n = game.scenes) == null ? void 0 : n.viewed), e);
  },
  updateTiles: Ss,
  updatePlaceables: _s,
  indexScene: Wc,
  openCriteriaSwitcher: qs,
  closeCriteriaSwitcher: Us,
  toggleCriteriaSwitcher: $o,
  findBestMatch: ic,
  findFileIndex: rc,
  resolveRules: Cs
};
function Vs(e) {
  var t;
  return ((t = e == null ? void 0 : e.getFlag) == null ? void 0 : t.call(e, "monks-active-tiles", "files")) ?? [];
}
s(Vs, "getTileFiles$1");
function Xc(e = []) {
  return {
    strategy: "select-one",
    defaultTarget: mt(e, 0) ?? { indexHint: 0 },
    variants: [
      {
        criteria: {},
        target: mt(e, 0) ?? { indexHint: 0 }
      }
    ]
  };
}
s(Xc, "createDefaultTileCriteria");
function Zc(e, t = {}) {
  var a, l;
  const { allowLegacy: n = !0 } = t, i = Vs(e), r = (a = e == null ? void 0 : e.getFlag) == null ? void 0 : a.call(e, G, Ft);
  if (r) return $t(r, { files: i });
  if (!n) return null;
  const o = (l = e == null ? void 0 : e.getFlag) == null ? void 0 : l.call(e, G, Dt);
  return o ? $t(o, { files: i }) : null;
}
s(Zc, "getTileCriteria");
async function Ea(e, t, n = {}) {
  if (!(e != null && e.setFlag)) return null;
  const {
    strictValidation: i = !0
  } = n, r = Vs(e), o = $t(t, { files: r });
  if (!o)
    return typeof e.unsetFlag == "function" ? (await e.unsetFlag(G, Ft), await e.unsetFlag(G, Dt)) : (await e.setFlag(G, Ft, null), await e.setFlag(G, Dt, null)), null;
  if (i) {
    const a = ws(o, { files: r });
    if (a.errors.length > 0)
      throw new Error(
        `Tile criteria contains ${a.errors.length} conflicting rule pair(s). Resolve clashes before saving.`
      );
  }
  return await e.setFlag(G, Ft, o), typeof e.unsetFlag == "function" && await e.unsetFlag(G, Dt), o;
}
s(Ea, "setTileCriteria");
const ho = "__eidolon_any__", Rt = "eidolon-tile-criteria", eu = "fa-solid fa-sliders", js = Symbol.for("eidolon.tileCriteriaUiState"), mr = ["all", "unmapped", "mapped", "conflicts"];
function tu(e) {
  const t = e == null ? void 0 : e[js];
  return !t || typeof t != "object" ? {
    filterQuery: "",
    filterMode: "all",
    selectedFileIndex: null
  } : {
    filterQuery: typeof t.filterQuery == "string" ? t.filterQuery : "",
    filterMode: mr.includes(t.filterMode) ? t.filterMode : "all",
    selectedFileIndex: Number.isInteger(t.selectedFileIndex) ? t.selectedFileIndex : null
  };
}
s(tu, "readUiState");
function nu(e, t) {
  if (!e || !t) return;
  typeof t.filterQuery == "string" && (e.filterQuery = t.filterQuery), mr.includes(t.filterMode) && (e.filterMode = t.filterMode), Number.isInteger(t.selectedFileIndex) && e.fileEntries.some((i) => i.index === t.selectedFileIndex) && (e.selectedFileIndex = t.selectedFileIndex);
}
s(nu, "applyUiState");
function iu(e) {
  const t = e == null ? void 0 : e.app, n = e == null ? void 0 : e.state;
  !t || !n || (t[js] = {
    filterQuery: typeof n.filterQuery == "string" ? n.filterQuery : "",
    filterMode: mr.includes(n.filterMode) ? n.filterMode : "all",
    selectedFileIndex: Number.isInteger(n.selectedFileIndex) ? n.selectedFileIndex : null
  });
}
s(iu, "persistUiState");
function ru(e) {
  const t = (e == null ? void 0 : e.object) ?? (e == null ? void 0 : e.document) ?? null;
  return !(t != null && t.isEmbedded) || t.documentName !== "Tile" ? null : t;
}
s(ru, "getTileDocument");
function ou(e) {
  var t;
  return ((t = e == null ? void 0 : e.getFlag) == null ? void 0 : t.call(e, "monks-active-tiles", "files")) ?? [];
}
s(ou, "getTileFiles");
function au(e, t) {
  var l;
  const n = (e == null ? void 0 : e.parent) ?? ((l = game.scenes) == null ? void 0 : l.viewed) ?? null, r = Ae(n).sort((c, u) => c.order - u.order).map((c) => ({
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
s(au, "getCriteriaDefinitions");
function su(e) {
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
s(su, "buildTree");
function lu(e, t) {
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
s(lu, "collapseFolderBranch");
function cu(e, t) {
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
s(cu, "getRuleSummariesForFile");
function po(e) {
  var y, b;
  const t = ou(e), n = Ro(t), i = Zc(e, { allowLegacy: !0 }) ?? Xc(t), r = au(e, i), o = new Map(r.map((p) => [p.key, p.label])), a = new Map(
    n.map((p) => [
      p.index,
      p.path || p.label
    ])
  ), l = bn(i.defaultTarget, t), c = ((y = n[0]) == null ? void 0 : y.index) ?? 0, u = l >= 0 ? l : c, d = new Map(n.map((p) => [p.index, []]));
  let g = 1;
  for (const p of i.variants ?? []) {
    const E = bn(p.target, t);
    E < 0 || (d.has(E) || d.set(E, []), d.get(E).push({
      id: g,
      criteria: { ...p.criteria ?? {} }
    }), g += 1);
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
    nextRuleId: g,
    rulesByFile: d,
    status: {
      mode: "ready",
      message: f("EIDOLON.TileCriteria.Ready", "Ready")
    }
  };
}
s(po, "buildEditorState");
function yo(e, t) {
  return e.rulesByFile.has(t) || e.rulesByFile.set(t, []), e.rulesByFile.get(t);
}
s(yo, "getRulesForFile");
function uu(e) {
  return Object.fromEntries(
    Object.entries(e ?? {}).filter(([t, n]) => typeof t == "string" && t && typeof n == "string" && n.trim()).map(([t, n]) => [t, n.trim()])
  );
}
s(uu, "sanitizeRuleCriteria");
function zs(e) {
  const t = mt(e.files, e.defaultIndex);
  if (!t) return null;
  const n = [], i = [];
  for (const [o, a] of e.rulesByFile.entries()) {
    const l = mt(e.files, o);
    if (l)
      for (const [c, u] of a.entries()) {
        const d = uu(u.criteria);
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
    normalized: $t(
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
s(zs, "buildTileCriteriaDraft");
function du(e) {
  var t;
  return ((t = zs(e)) == null ? void 0 : t.normalized) ?? null;
}
s(du, "exportTileCriteria");
function Ca(e) {
  const t = zs(e);
  if (!(t != null && t.normalized))
    return {
      errors: [],
      warnings: [],
      errorFileIndexes: [],
      warningFileIndexes: []
    };
  const n = ws(t.normalized, { files: e.files }), i = /* @__PURE__ */ s((l) => {
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
s(Ca, "analyzeRuleConflicts");
function Yn(e, t = "neutral") {
  const n = document.createElement("span");
  return n.classList.add("eidolon-tile-criteria__badge"), n.dataset.kind = t, n.textContent = e, n;
}
s(Yn, "createBadge");
function fu(e, t = {}) {
  const n = typeof e == "string" ? e : "", {
    maxLength: i = 42,
    headLength: r = 20,
    tailLength: o = 16
  } = t;
  if (!n || n.length <= i) return n;
  const a = n.slice(0, r).trimEnd(), l = n.slice(-o).trimStart();
  return `${a}...${l}`;
}
s(fu, "middleEllipsis");
function gu(e) {
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
s(gu, "createRegexFilter");
function mu(e, t) {
  const n = document.createElement("select");
  n.dataset.criteriaKey = e.key;
  const i = document.createElement("option");
  i.value = ho, i.textContent = "*", n.appendChild(i);
  const r = new Set(e.values ?? []);
  t && !r.has(t) && r.add(t);
  for (const o of r) {
    const a = document.createElement("option");
    a.value = o, a.textContent = o, n.appendChild(a);
  }
  return n.value = t ?? ho, n;
}
s(mu, "createCriterionSelect");
function hu(e, t, n, i) {
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
    const g = mu(c, (l = e.criteria) == null ? void 0 : l[c.key]);
    g.addEventListener("change", () => {
      g.value === ho ? delete e.criteria[c.key] : e.criteria[c.key] = g.value, i();
    }), u.appendChild(g), o.appendChild(u);
  }
  r.appendChild(o);
  const a = document.createElement("button");
  return a.type = "button", a.classList.add("control", "ui-control", "eidolon-tile-criteria__rule-remove"), a.textContent = f("EIDOLON.TileCriteria.RemoveRule", "Remove"), a.addEventListener("click", () => {
    const u = yo(t, n).filter((d) => d.id !== e.id);
    t.rulesByFile.set(n, u), i();
  }), r.appendChild(a), r;
}
s(hu, "renderRuleEditor");
const li = /* @__PURE__ */ new WeakMap();
function Gs(e) {
  return (e == null ? void 0 : e.app) ?? (e == null ? void 0 : e.tile) ?? null;
}
s(Gs, "getDialogOwner");
function pu(e) {
  for (const t of e) {
    const n = et(t);
    if (n) return n;
    const i = et(t == null ? void 0 : t.element);
    if (i) return i;
  }
  return null;
}
s(pu, "findDialogRoot$1");
function yu(e, t, n) {
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
    i.defaultIndex = r.index, Ee(e), n();
  })), u.appendChild(d);
  const g = document.createElement("button");
  g.type = "button", g.classList.add("control", "ui-control", "eidolon-tile-criteria__editor-action", "secondary"), g.textContent = f("EIDOLON.TileCriteria.ClearFileRules", "Clear File Rules"), g.addEventListener("click", () => {
    i.rulesByFile.set(r.index, []), Ee(e), n();
  }), u.appendChild(g), o.appendChild(u);
  const m = document.createElement("div");
  m.classList.add("eidolon-tile-criteria__rule-editors");
  const y = yo(i, r.index);
  if (y.length)
    for (const p of y)
      m.appendChild(
        hu(p, i, r.index, () => {
          Ee(e), n();
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
  const b = document.createElement("button");
  return b.type = "button", b.classList.add("control", "ui-control", "eidolon-tile-criteria__editor-action"), b.textContent = f("EIDOLON.TileCriteria.AddRule", "Add Rule"), b.disabled = !i.criteriaDefinitions.length, b.addEventListener("click", () => {
    yo(i, r.index).push({
      id: i.nextRuleId,
      criteria: {}
    }), i.nextRuleId += 1, Ee(e), n();
  }), o.appendChild(b), o;
}
s(yu, "buildRuleEditorContent");
function bu(e, t) {
  var g, m, y;
  const n = Gs(e);
  if (!n) return;
  const i = li.get(n);
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
  li.set(n, r);
  const o = /* @__PURE__ */ s(() => {
    li.delete(n);
  }, "closeDialog"), a = /* @__PURE__ */ s(() => {
    r.host instanceof HTMLElement && r.host.replaceChildren(
      yu(r.controller, r.fileIndex, a)
    );
  }, "refreshDialog");
  r.refresh = a;
  const l = f("EIDOLON.TileCriteria.EditorTitle", "Edit Tile Criteria Rules"), c = '<div class="eidolon-tile-criteria-editor-host"></div>', u = f("EIDOLON.TileCriteria.CloseEditor", "Close"), d = (y = (m = foundry == null ? void 0 : foundry.applications) == null ? void 0 : m.api) == null ? void 0 : y.DialogV2;
  if (typeof (d == null ? void 0 : d.wait) == "function") {
    d.wait({
      window: { title: l },
      content: c,
      buttons: [{ action: "close", label: u, default: !0 }],
      render: /* @__PURE__ */ s((...b) => {
        var T;
        const p = pu(b), E = (T = p == null ? void 0 : p.querySelector) == null ? void 0 : T.call(p, ".eidolon-tile-criteria-editor-host");
        E instanceof HTMLElement && (r.host = E, a());
      }, "render"),
      close: o,
      rejectClose: !1
    }).catch((b) => {
      console.warn(`${G} | Rule editor dialog failed`, b), o();
    });
    return;
  }
  o();
}
s(bu, "openRuleEditorDialog");
function La(e) {
  var i;
  const t = Gs(e);
  if (!t) return;
  const n = li.get(t);
  (i = n == null ? void 0 : n.refresh) == null || i.call(n);
}
s(La, "refreshOpenRuleEditor");
function bo(e, t) {
  return (e.rulesByFile.get(t) ?? []).length > 0;
}
s(bo, "hasRulesForFile");
function Ws(e, t) {
  var n, i;
  return ((n = e == null ? void 0 : e.errorFileIndexes) == null ? void 0 : n.includes(t)) || ((i = e == null ? void 0 : e.warningFileIndexes) == null ? void 0 : i.includes(t));
}
s(Ws, "hasConflictForFile");
function Tu(e, t, n) {
  switch (e.filterMode) {
    case "unmapped":
      return !bo(e, t.index);
    case "mapped":
      return bo(e, t.index);
    case "conflicts":
      return Ws(n, t.index);
    case "all":
    default:
      return !0;
  }
}
s(Tu, "matchesFilterMode");
function Eu(e, t) {
  let n = 0, i = 0, r = 0;
  for (const o of e.fileEntries)
    bo(e, o.index) ? n += 1 : i += 1, Ws(t, o.index) && (r += 1);
  return {
    all: e.fileEntries.length,
    mapped: n,
    unmapped: i,
    conflicts: r
  };
}
s(Eu, "getFilterModeCounts");
function Cu(e) {
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
s(Cu, "getFilterModeLabel");
function Ks(e, t, n, i, r) {
  var u, d;
  const o = [...e.folders.keys()].sort((g, m) => g.localeCompare(m));
  for (const g of o) {
    const m = lu(g, e.folders.get(g)), y = document.createElement("li");
    y.classList.add("eidolon-tile-criteria__tree-branch");
    const b = document.createElement("div");
    b.classList.add("document", "folder", "update", "eidolon-tile-criteria__folder-row");
    const p = document.createElement("i");
    p.classList.add("fa-solid", "fa-folder-open"), b.appendChild(p);
    const E = document.createElement("span");
    E.classList.add("eidolon-tile-criteria__tree-folder-label"), E.textContent = m.label, E.title = m.label, b.appendChild(E), y.appendChild(b);
    const T = document.createElement("ul");
    T.classList.add("eidolon-tile-criteria__tree"), T.dataset.folder = m.label, Ks(m.node, t, n, i, T), T.childElementCount > 0 && y.appendChild(T), r.appendChild(y);
  }
  const a = [...e.files].sort((g, m) => g.name.localeCompare(m.name));
  if (!a.length) return;
  const l = document.createElement("li"), c = document.createElement("ul");
  c.classList.add("document-list", "eidolon-tile-criteria__document-list");
  for (const g of a) {
    const m = g.entry, y = m.index === t.selectedFileIndex, b = m.index === t.defaultIndex, p = cu(t, m.index), E = document.createElement("li");
    E.classList.add("document", "update", "eidolon-tile-criteria__tree-file");
    const T = document.createElement("button");
    T.type = "button", T.classList.add("eidolon-tile-criteria__file-row");
    const C = (u = i == null ? void 0 : i.errorFileIndexes) == null ? void 0 : u.includes(m.index), I = (d = i == null ? void 0 : i.warningFileIndexes) == null ? void 0 : d.includes(m.index);
    C ? T.classList.add("has-conflict") : I && T.classList.add("has-warning");
    const D = t.relativePaths.get(m.index) || m.path || g.name, x = [D];
    C ? x.push(
      f(
        "EIDOLON.TileCriteria.ConflictFileHint",
        "This file participates in one or more conflicting rules."
      )
    ) : I && x.push(
      f(
        "EIDOLON.TileCriteria.WarningFileHint",
        "This file has potentially redundant rules."
      )
    ), p.length || x.push(
      f(
        "EIDOLON.TileCriteria.UnmappedHint",
        "No criteria rules map to this file."
      )
    ), T.title = x.join(`
`), y && T.classList.add("is-selected"), T.addEventListener("click", () => {
      t.selectedFileIndex = m.index, Ee(n), bu(n, m.index);
    });
    const _ = document.createElement("span");
    _.classList.add("eidolon-tile-criteria__indicator"), _.dataset.kind = b ? "default" : p.length ? "mapped" : "unmapped", T.appendChild(_);
    const q = document.createElement("span");
    q.classList.add("eidolon-tile-criteria__file-content");
    const Q = document.createElement("span");
    Q.classList.add("eidolon-tile-criteria__file-heading");
    const ee = document.createElement("span");
    ee.classList.add("eidolon-tile-criteria__file-title"), ee.textContent = fu(g.name || m.label), ee.title = D, Q.appendChild(ee);
    const F = Yn(`#${m.index + 1}`, "meta");
    F.classList.add("eidolon-tile-criteria__index-badge"), Q.appendChild(F), q.appendChild(Q);
    const z = document.createElement("span");
    z.classList.add("eidolon-tile-criteria__badges"), b && z.appendChild(Yn(f("EIDOLON.TileCriteria.DefaultBadge", "Default"), "default"));
    const O = p.slice(0, 2);
    for (const R of O)
      z.appendChild(Yn(R, "rule"));
    if (p.length > O.length && z.appendChild(Yn(`+${p.length - O.length}`, "meta")), q.appendChild(z), T.appendChild(q), C || I) {
      const R = document.createElement("span");
      R.classList.add("eidolon-tile-criteria__row-warning"), R.dataset.mode = C ? "error" : "warning", R.innerHTML = '<i class="fa-solid fa-triangle-exclamation" inert=""></i>', T.appendChild(R);
    }
    E.appendChild(T), c.appendChild(E);
  }
  l.appendChild(c), r.appendChild(l);
}
s(Ks, "renderTreeNode");
function Lu(e, t, n, i = {}) {
  const r = document.createElement("section");
  r.classList.add("eidolon-tile-criteria__tree-panel");
  const o = gu(e.filterQuery), a = Eu(e, n);
  e.filterMode !== "all" && a[e.filterMode] === 0 && (e.filterMode = "all");
  const l = document.createElement("div");
  l.classList.add("eidolon-tile-criteria__toolbar");
  const c = document.createElement("div");
  c.classList.add("eidolon-tile-criteria__mode-bar");
  for (const C of mr) {
    const I = document.createElement("button");
    I.type = "button", I.classList.add("control", "ui-control", "eidolon-tile-criteria__mode-button"), I.dataset.mode = C, I.textContent = Cu(C);
    const D = C === "all" || a[C] > 0;
    I.disabled = !D, D || (I.dataset.tooltip = f(
      "EIDOLON.TileCriteria.FilterModeUnavailable",
      "No entries currently match this filter."
    ), I.title = I.dataset.tooltip), e.filterMode === C ? (I.classList.add("is-active"), I.setAttribute("aria-pressed", "true")) : I.setAttribute("aria-pressed", "false"), I.addEventListener("click", () => {
      e.filterMode !== C && (e.filterMode = C, Ee(t));
    }), c.appendChild(I);
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
    const I = d.selectionStart ?? d.value.length, D = d.selectionEnd ?? I;
    e.filterQuery = d.value, Ee(t), requestAnimationFrame(() => {
      const x = t.section.querySelector(".eidolon-tile-criteria__filter-input");
      if (x instanceof HTMLInputElement) {
        x.focus();
        try {
          x.setSelectionRange(I, D);
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
  m.classList.add("control", "ui-control", "eidolon-tile-criteria__toolbar-action", "icon-only"), m.dataset.tooltip = y, m.setAttribute("aria-label", y), m.title = y, m.innerHTML = '<i class="fa-solid fa-floppy-disk" inert=""></i>', m.disabled = n.errors.length > 0, m.addEventListener("click", () => {
    var C;
    (C = i.onSave) == null || C.call(i);
  }), g.appendChild(m);
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
  const E = document.createElement("div");
  E.classList.add("eidolon-tile-criteria__library-tree");
  const T = e.fileEntries.filter((C) => {
    const I = e.relativePaths.get(C.index) || C.path || C.label;
    return Tu(e, C, n) && o.matches(I);
  });
  if (e.fileEntries.length)
    if (T.length) {
      const C = document.createElement("ul");
      C.classList.add("eidolon-tile-criteria__tree"), Ks(su(T), e, t, n, C), E.appendChild(C);
    } else {
      const C = document.createElement("p");
      C.classList.add("notes"), C.textContent = f("EIDOLON.TileCriteria.NoMatches", "No variants match this filter."), E.appendChild(C);
    }
  else {
    const C = document.createElement("p");
    C.classList.add("notes"), C.textContent = f("EIDOLON.TileCriteria.NoVariants", "No MATT variants found"), E.appendChild(C);
  }
  return r.appendChild(E), r;
}
s(Lu, "renderTreePanel");
function Ee(e) {
  const { section: t, state: n } = e, i = Ca(n);
  iu(e), t.replaceChildren();
  const r = /* @__PURE__ */ s(async () => {
    try {
      const a = Ca(n);
      if (a.errors.length) {
        n.status = {
          mode: "error",
          message: f(
            "EIDOLON.TileCriteria.ConflictSaveBlocked",
            `Resolve ${a.errors.length} conflict(s) before saving tile criteria rules.`
          )
        }, Ee(e);
        return;
      }
      const l = du(n);
      if (!l) {
        n.status = {
          mode: "error",
          message: f("EIDOLON.TileCriteria.Invalid", "Invalid rules. Select valid target variants.")
        }, Ee(e);
        return;
      }
      await Ea(e.tile, l);
      const c = n.filterQuery, u = n.filterMode, d = n.selectedFileIndex;
      e.state = po(e.tile), e.state.filterQuery = c, e.state.filterMode = u, Number.isInteger(d) && (e.state.selectedFileIndex = d), e.state.status = {
        mode: "ready",
        message: f("EIDOLON.TileCriteria.Saved", "Tile criteria rules saved.")
      }, Ee(e), La(e);
    } catch (a) {
      console.error(`${G} | Failed to save tile criteria`, a), n.status = {
        mode: "error",
        message: (a == null ? void 0 : a.message) ?? "Failed to save tile criteria rules."
      }, Ee(e);
    }
  }, "handleSave"), o = /* @__PURE__ */ s(async () => {
    try {
      await Ea(e.tile, null);
      const a = n.filterQuery, l = n.filterMode, c = n.selectedFileIndex;
      e.state = po(e.tile), e.state.filterQuery = a, e.state.filterMode = l, Number.isInteger(c) && (e.state.selectedFileIndex = c), e.state.status = {
        mode: "ready",
        message: f("EIDOLON.TileCriteria.Cleared", "Tile criteria rules cleared.")
      }, Ee(e), La(e);
    } catch (a) {
      console.error(`${G} | Failed to clear tile criteria`, a), n.status = {
        mode: "error",
        message: (a == null ? void 0 : a.message) ?? "Failed to clear tile criteria rules."
      }, Ee(e);
    }
  }, "handleClear");
  if (t.appendChild(Lu(n, e, i, {
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
s(Ee, "renderController");
function wu(e, t = null) {
  const n = document.createElement("section");
  n.classList.add("eidolon-tile-criteria");
  const i = po(e);
  nu(i, tu(t));
  const r = {
    app: t,
    tile: e,
    section: n,
    state: i
  };
  return Ee(r), r;
}
s(wu, "createController");
function Iu(e) {
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
s(Iu, "findFooterElement");
function Su(e) {
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
s(Su, "findTabNav");
function Ou(e, t) {
  var i, r, o;
  return e instanceof HTMLElement ? [
    (i = e.querySelector(".tab[data-tab]")) == null ? void 0 : i.parentElement,
    e.querySelector(".sheet-body"),
    (o = (r = t == null ? void 0 : t.parentElement) == null ? void 0 : r.querySelector) == null ? void 0 : o.call(r, ":scope > .sheet-body"),
    t == null ? void 0 : t.parentElement
  ].find((a) => a instanceof HTMLElement) ?? null : null;
}
s(Ou, "findTabBody");
function vu(e, t) {
  var n, i, r, o, a, l, c;
  return ((n = e == null ? void 0 : e.dataset) == null ? void 0 : n.group) ?? ((o = (r = (i = e == null ? void 0 : e.querySelector) == null ? void 0 : i.call(e, "[data-group]")) == null ? void 0 : r.dataset) == null ? void 0 : o.group) ?? ((c = (l = (a = t == null ? void 0 : t.querySelector) == null ? void 0 : a.call(t, ".tab[data-group]")) == null ? void 0 : l.dataset) == null ? void 0 : c.group) ?? "main";
}
s(vu, "getTabGroup");
function Mu(e, t) {
  if (!(e instanceof HTMLElement)) return;
  e.textContent = "";
  const n = document.createElement("i");
  n.className = eu, n.setAttribute("inert", ""), e.append(n, " ");
  const i = document.createElement("span");
  i.textContent = t, e.append(i);
}
s(Mu, "setTabButtonContent");
function Au(e, t) {
  const n = e.querySelector("[data-tab]"), i = (n == null ? void 0 : n.tagName) || "A", r = document.createElement(i);
  return n instanceof HTMLElement && (r.className = n.className), r.classList.remove("active"), i === "BUTTON" && (r.type = "button"), r.dataset.action = "tab", r.dataset.tab = Rt, r.dataset.group = t, r.setAttribute("aria-selected", "false"), r.setAttribute("aria-pressed", "false"), r;
}
s(Au, "createTabButton");
function Nu(e, t) {
  const n = document.createElement("div");
  n.classList.add("tab"), n.dataset.tab = Rt, n.dataset.group = t, n.dataset.applicationPart = Rt, n.setAttribute("hidden", "true");
  const i = Iu(e);
  return e.insertBefore(n, i ?? null), n;
}
s(Nu, "createTabPanel");
function Mr(e, t, n, i) {
  var a;
  if (!(n instanceof HTMLElement) || !(i instanceof HTMLElement)) return;
  const r = (a = e == null ? void 0 : e.tabGroups) == null ? void 0 : a[t];
  if (typeof r == "string" ? r === Rt : n.classList.contains("active") || i.classList.contains("active")) {
    n.classList.add("active"), n.setAttribute("aria-selected", "true"), n.setAttribute("aria-pressed", "true"), i.classList.add("active"), i.removeAttribute("hidden"), i.removeAttribute("aria-hidden");
    return;
  }
  n.classList.remove("active"), n.setAttribute("aria-selected", "false"), n.setAttribute("aria-pressed", "false"), i.classList.remove("active"), i.setAttribute("hidden", "true");
}
s(Mr, "syncTabVisibility");
function Du(e, t) {
  const n = Su(t), i = Ou(t, n);
  if (!(n instanceof HTMLElement) || !(i instanceof HTMLElement)) return null;
  const r = vu(n, i);
  let o = n.querySelector(`[data-tab="${Rt}"]`);
  o instanceof HTMLElement || (o = Au(n, r), n.appendChild(o)), Mu(o, f("EIDOLON.TileCriteria.TabLabel", "Criteria"));
  let a = i.querySelector(`.tab[data-tab="${Rt}"]`);
  return a instanceof HTMLElement || (a = Nu(i, r)), o.dataset.eidolonTileCriteriaBound || (o.addEventListener("click", () => {
    as(e, Rt, r), requestAnimationFrame(() => {
      Mr(e, r, o, a);
    });
  }), o.dataset.eidolonTileCriteriaBound = "true"), Mr(e, r, o, a), requestAnimationFrame(() => {
    Mr(e, r, o, a);
  }), a;
}
s(Du, "ensureTileCriteriaTab");
function Fu() {
  Hooks.on("renderTileConfig", (e, t) => {
    var c, u;
    const n = et(t);
    if (!n) return;
    const i = ru(e);
    if (!i) return;
    (c = n.querySelector(".eidolon-tile-criteria")) == null || c.remove();
    const r = wu(i, e), o = Du(e, n);
    if (o instanceof HTMLElement) {
      o.replaceChildren(r.section), (u = e.setPosition) == null || u.call(e, { height: "auto" });
      return;
    }
    const a = (e == null ? void 0 : e.form) instanceof HTMLFormElement ? e.form : n instanceof HTMLFormElement ? n : n.querySelector("form");
    if (!(a instanceof HTMLFormElement)) return;
    const l = a.querySelector("button[type='submit']");
    l != null && l.parentElement ? l.parentElement.insertAdjacentElement("beforebegin", r.section) : a.appendChild(r.section);
  });
}
s(Fu, "registerTileCriteriaConfigControls");
function _u(e) {
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
s(_u, "toList");
function xu(e, t) {
  const n = e == null ? void 0 : e.tools;
  return Array.isArray(n) ? n.some((i) => (i == null ? void 0 : i.name) === t) : n instanceof Map ? n.has(t) : n && typeof n == "object" ? t in n ? !0 : Object.values(n).some((i) => (i == null ? void 0 : i.name) === t) : !1;
}
s(xu, "hasTool");
function Ru(e, t) {
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
s(Ru, "addTool");
function ku() {
  Hooks.on("getSceneControlButtons", (e) => {
    var i;
    const t = _u(e);
    if (!t.length) return;
    const n = t.find((r) => (r == null ? void 0 : r.name) === "tiles") ?? t.find((r) => (r == null ? void 0 : r.name) === "tokens" || (r == null ? void 0 : r.name) === "token") ?? t[0];
    n && (xu(n, "eidolonCriteriaSwitcher") || Ru(n, {
      name: "eidolonCriteriaSwitcher",
      title: "Criteria Switcher",
      icon: "fa-solid fa-sliders",
      button: !0,
      toggle: !1,
      visible: ur(((i = game.scenes) == null ? void 0 : i.viewed) ?? null),
      onClick: /* @__PURE__ */ s(() => {
        $o();
      }, "onClick")
    }));
  });
}
s(ku, "registerSceneControlButton");
function Qn(e, t) {
  if (!e || typeof e != "object") return !1;
  const n = String(t).split(".");
  let i = e;
  for (const r of n) {
    if (!i || typeof i != "object" || !Object.prototype.hasOwnProperty.call(i, r)) return !1;
    i = i[r];
  }
  return !0;
}
s(Qn, "hasOwnPath");
function Hu() {
  const e = /* @__PURE__ */ s((i, r = null) => {
    i && Oc(i, r);
  }, "invalidateTileScene"), t = /* @__PURE__ */ s((i, r = null) => {
    i && Bc(i, r);
  }, "invalidatePlaceableScene");
  Hooks.on("createTile", (i) => {
    e((i == null ? void 0 : i.parent) ?? null, i ?? null);
  }), Hooks.on("deleteTile", (i) => {
    e((i == null ? void 0 : i.parent) ?? null, i ?? null);
  }), Hooks.on("updateTile", (i, r) => {
    (Qn(r, `flags.${G}.tileCriteria`) || Qn(r, `flags.${G}.fileIndex`)) && e((i == null ? void 0 : i.parent) ?? null, i ?? null);
  });
  const n = /* @__PURE__ */ s((i) => {
    Hooks.on(`create${i}`, (r) => {
      t((r == null ? void 0 : r.parent) ?? null, r ?? null);
    }), Hooks.on(`delete${i}`, (r) => {
      t((r == null ? void 0 : r.parent) ?? null, r ?? null);
    }), Hooks.on(`update${i}`, (r, o) => {
      const a = Qn(o, `flags.${G}.presets`), l = i === "AmbientLight" && Qn(o, `flags.${G}.lightCriteria`);
      !a && !l || t((r == null ? void 0 : r.parent) ?? null, r ?? null);
    });
  }, "registerPlaceableHooks");
  n("AmbientLight"), n("Wall"), n("AmbientSound"), Hooks.on("canvasReady", (i) => {
    const r = (i == null ? void 0 : i.scene) ?? null;
    r && (e(r), t(r));
  });
}
s(Hu, "registerCriteriaCacheInvalidationHooks");
function $u() {
  ku(), Fu(), Hu(), Hooks.once("init", () => {
    var e, t;
    (t = (e = game.keybindings) == null ? void 0 : e.register) == null || t.call(e, G, "toggleCriteriaSwitcher", {
      name: "Toggle Criteria Switcher",
      hint: "Open or close the criteria switcher window for live scene state updates.",
      editable: [{ key: "KeyM", modifiers: ["Alt"] }],
      onDown: /* @__PURE__ */ s(() => {
        var n, i, r;
        return ur(((n = game.scenes) == null ? void 0 : n.viewed) ?? null) ? ($o(), !0) : ((r = (i = ui.notifications) == null ? void 0 : i.warn) == null || r.call(i, "You do not have permission to manage scene criteria."), !0);
      }, "onDown"),
      restricted: !0,
      precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL
    });
  }), Hooks.on("canvasReady", (e) => {
    var n;
    const t = gr();
    t && (t.setScene((e == null ? void 0 : e.scene) ?? ((n = game.scenes) == null ? void 0 : n.viewed) ?? null), t.render({ force: !0 }));
  }), Hooks.once("ready", () => {
    var t, n;
    const e = (n = (t = game.modules) == null ? void 0 : t.get) == null ? void 0 : n.call(t, G);
    e && (e.api || (e.api = {}), e.api.criteria = Qc, console.log(`${G} | Criteria engine API registered`));
  });
}
s($u, "registerCriteriaEngineHooks");
$u();
const ci = /* @__PURE__ */ new WeakMap(), Xn = /* @__PURE__ */ new WeakMap(), le = "__eidolon_default__";
function Pu() {
  Hooks.on("renderAmbientLightConfig", Bu), w("LightCriteria | AmbientLightConfig controls registered");
}
s(Pu, "registerAmbientLightCriteriaControls");
function Bu(e, t) {
  var n;
  Zt("LightCriteria | renderAmbientLightConfig", {
    appId: (e == null ? void 0 : e.id) ?? null,
    constructor: ((n = e == null ? void 0 : e.constructor) == null ? void 0 : n.name) ?? null,
    isRendered: (e == null ? void 0 : e.rendered) ?? !1
  });
  try {
    const i = et(t);
    if (!i) return;
    qu(e, i);
  } catch (i) {
    console.error("eidolon-utilities | Failed to enhance AmbientLightConfig UI", i);
  } finally {
    dt();
  }
}
s(Bu, "handleAmbientLightConfigRender");
function qu(e, t) {
  var nn, yt, rn;
  const n = (e == null ? void 0 : e.form) instanceof HTMLFormElement ? e.form : t instanceof HTMLFormElement ? t : (nn = t == null ? void 0 : t.closest) == null ? void 0 : nn.call(t, "form");
  if (!(n instanceof HTMLFormElement)) return;
  const i = n.querySelector(".window-content");
  if (!(i instanceof HTMLElement)) return;
  const r = Ys(e);
  if (!r) return;
  const o = od(r);
  w("LightCriteria | Resolved ambient light", {
    sheetId: (r == null ? void 0 : r.id) ?? null,
    persistedId: (o == null ? void 0 : o.id) ?? null,
    sameRef: r === o
  });
  const a = (o == null ? void 0 : o.parent) ?? r.parent ?? null, l = a ? Wl(a) : [], c = l.filter(
    (N) => Array.isArray(N == null ? void 0 : N.values) && N.values.length > 0
  ), u = Zu(l), d = o ?? r, g = a ? Ae(a) : [];
  let m = vs(d);
  const y = Dc(m, g);
  JSON.stringify(y) !== JSON.stringify(m) && (m = y, Ms(d, y).catch((N) => {
    console.warn("eidolon-utilities | Failed to persist migrated light criteria keys", N);
  })), w("LightCriteria | Loaded mapping state", {
    hasBase: !!(m != null && m.base),
    mappingCount: Array.isArray(m == null ? void 0 : m.mappings) ? m.mappings.length : 0,
    mappings: Array.isArray(m == null ? void 0 : m.mappings) ? m.mappings.map((N) => {
      var V, K;
      return {
        id: N.id,
        key: N.key,
        hasColor: !!((K = (V = N.config) == null ? void 0 : V.config) != null && K.color)
      };
    }) : []
  });
  const b = i.querySelector(".eidolon-light-criteria");
  b && b.remove(), i.querySelectorAll(".eidolon-light-criteria-main-switcher").forEach((N) => N.remove());
  const p = document.createElement("fieldset");
  p.classList.add("eidolon-light-criteria");
  const E = document.createElement("legend");
  E.textContent = f("EIDOLON.LightCriteria.Legend", "Scene Criteria Lighting"), p.appendChild(E);
  const T = document.createElement("p");
  T.classList.add("notes"), T.textContent = f(
    "EIDOLON.LightCriteria.Description",
    "Capture a base lighting state, then map criteria values to lighting configurations."
  ), p.appendChild(T);
  const C = document.createElement("div");
  C.classList.add("eidolon-light-criteria__controls");
  const I = document.createElement("button");
  I.type = "button", I.dataset.action = "make-default", I.classList.add("eidolon-light-criteria__button"), I.textContent = f(
    "EIDOLON.LightCriteria.SetBase",
    "Set Base"
  ), C.appendChild(I);
  const D = document.createElement("button");
  D.type = "button", D.dataset.action = "create-mapping", D.classList.add("eidolon-light-criteria__button"), D.textContent = f(
    "EIDOLON.LightCriteria.CreateMapping",
    "Add Criteria Mapping"
  ), D.setAttribute("aria-expanded", "false"), C.appendChild(D), p.appendChild(C);
  const x = document.createElement("p");
  x.classList.add("notes", "eidolon-light-criteria__status"), p.appendChild(x);
  const _ = document.createElement("div");
  _.classList.add("eidolon-light-criteria__switcher");
  const q = document.createElement("label");
  q.classList.add("eidolon-light-criteria__switcher-label");
  const Q = `${(e == null ? void 0 : e.id) ?? (r == null ? void 0 : r.id) ?? "eidolon-light"}-mapping-select`;
  q.htmlFor = Q, q.textContent = f("EIDOLON.LightCriteria.SelectLabel", "Criteria Mapping"), _.appendChild(q);
  const ee = document.createElement("div");
  ee.classList.add("eidolon-light-criteria__switcher-controls"), _.appendChild(ee);
  const F = document.createElement("select");
  F.id = Q, F.classList.add("eidolon-light-criteria__select"), F.dataset.action = "select-mapping", ee.appendChild(F);
  const z = document.createElement("div");
  z.classList.add("eidolon-light-criteria__action-stack"), ee.appendChild(z);
  const O = document.createElement("button");
  O.type = "button", O.dataset.action = "apply-selected-mapping", O.classList.add("eidolon-light-criteria__button", "secondary", "icon-only"), O.dataset.tooltip = f("EIDOLON.LightCriteria.ApplyButton", "Apply"), O.setAttribute("aria-label", f("EIDOLON.LightCriteria.ApplyButton", "Apply")), O.innerHTML = '<i class="fa-solid fa-play" inert=""></i>', z.appendChild(O);
  const R = document.createElement("button");
  R.type = "button", R.dataset.action = "update-selected-mapping", R.classList.add("eidolon-light-criteria__button", "secondary", "icon-only"), R.dataset.tooltip = f("EIDOLON.LightCriteria.UpdateButton", "Save Changes"), R.setAttribute(
    "aria-label",
    f("EIDOLON.LightCriteria.UpdateButton", "Save Changes")
  ), R.innerHTML = '<i class="fa-solid fa-floppy-disk" inert=""></i>', z.appendChild(R);
  const H = document.createElement("button");
  H.type = "button", H.dataset.action = "edit-selected-mapping-criteria", H.classList.add("eidolon-light-criteria__button", "secondary", "icon-only"), H.dataset.tooltip = f("EIDOLON.LightCriteria.EditCriteriaButton", "Edit Criteria"), H.setAttribute(
    "aria-label",
    f("EIDOLON.LightCriteria.EditCriteriaButton", "Edit Criteria")
  ), H.innerHTML = '<i class="fa-solid fa-sliders" inert=""></i>', z.appendChild(H);
  const $ = document.createElement("button");
  $.type = "button", $.dataset.action = "remove-selected-mapping", $.classList.add("eidolon-light-criteria__button", "secondary", "icon-only", "danger"), $.dataset.tooltip = f("EIDOLON.LightCriteria.RemoveMapping", "Remove Mapping"), $.setAttribute(
    "aria-label",
    f("EIDOLON.LightCriteria.RemoveMapping", "Remove Mapping")
  ), $.innerHTML = '<i class="fa-solid fa-trash" inert=""></i>', z.appendChild($);
  const P = document.createElement("div");
  P.classList.add("eidolon-light-criteria-main-switcher"), P.appendChild(_);
  const B = document.createElement("p");
  if (B.classList.add("notes", "eidolon-light-criteria-main-switcher__empty"), B.textContent = f(
    "EIDOLON.LightCriteria.ActiveRequiresBase",
    "Set Base Lighting to enable mapping selection and actions."
  ), P.appendChild(B), l.length === 0) {
    const N = document.createElement("p");
    N.classList.add("notification", "warning", "eidolon-light-criteria__warning"), N.textContent = f(
      "EIDOLON.LightCriteria.NoCategoriesWarning",
      "This scene has no criteria configured. Add criteria under Scene -> Criteria to enable criteria-driven lighting."
    ), p.appendChild(N);
  } else if (c.length === 0) {
    const N = document.createElement("p");
    N.classList.add("notification", "warning", "eidolon-light-criteria__warning"), N.textContent = f(
      "EIDOLON.LightCriteria.NoValuesWarning",
      "Criteria exist, but none define selectable values. Add values in Scene -> Criteria."
    ), p.appendChild(N);
  }
  const U = document.createElement("div");
  U.classList.add("eidolon-light-criteria__creation"), U.dataset.section = "creation", U.hidden = !0;
  const fe = document.createElement("p");
  fe.classList.add("notes"), fe.textContent = f(
    "EIDOLON.LightCriteria.CreateDescription",
    "Assign scene criteria values to map the current configuration."
  ), U.appendChild(fe);
  const W = document.createElement("div");
  W.classList.add("eidolon-light-criteria__category-list"), U.appendChild(W);
  for (const N of c) {
    const V = document.createElement("label");
    V.classList.add("eidolon-light-criteria__category");
    const K = document.createElement("span");
    K.classList.add("eidolon-light-criteria__category-name"), K.textContent = (rn = (yt = N.name) == null ? void 0 : yt.trim) != null && rn.call(yt) ? N.name.trim() : f("EIDOLON.LightCriteria.UnnamedCategory", "Unnamed Category"), V.appendChild(K);
    const Y = document.createElement("select");
    Y.dataset.categoryId = N.id, Y.classList.add("eidolon-light-criteria__category-select");
    const Z = document.createElement("option");
    Z.value = "", Z.textContent = f(
      "EIDOLON.LightCriteria.IgnoreCategory",
      "Ignore"
    ), Y.appendChild(Z);
    for (const ie of N.values) {
      const oe = document.createElement("option");
      oe.value = ie, oe.textContent = ie, Y.appendChild(oe);
    }
    V.appendChild(Y), W.appendChild(V);
  }
  const te = document.createElement("div");
  te.classList.add("eidolon-light-criteria__creation-actions");
  const He = document.createElement("button");
  He.type = "button", He.dataset.action = "save-mapping", He.classList.add("eidolon-light-criteria__button", "primary"), He.textContent = f(
    "EIDOLON.LightCriteria.SaveMapping",
    "Save Mapping"
  ), te.appendChild(He);
  const Oe = document.createElement("button");
  Oe.type = "button", Oe.dataset.action = "cancel-create", Oe.classList.add("eidolon-light-criteria__button", "secondary"), Oe.textContent = f(
    "EIDOLON.LightCriteria.Cancel",
    "Cancel"
  ), te.appendChild(Oe), U.appendChild(te), p.appendChild(U), i.prepend(P), i.appendChild(p), p.hidden = !0, ju(e, {
    fieldset: p,
    homeContainer: i
  }), requestAnimationFrame(() => {
    var N;
    (N = e.setPosition) == null || N.call(e, { height: "auto" });
  });
  let A = m;
  Et({ switcher: _, emptyState: B, state: A }), Tt(x, A), ln(D, {
    state: A,
    hasCategories: c.length > 0
  }), w("LightCriteria | Controls injected", {
    sceneId: (a == null ? void 0 : a.id) ?? null,
    lightId: (r == null ? void 0 : r.id) ?? null,
    hasBase: !!(A != null && A.base),
    mappingCount: Array.isArray(A == null ? void 0 : A.mappings) ? A.mappings.length : 0,
    categories: c.length
  });
  const Vn = ed(A), j = {
    restoreConfig: null,
    app: e,
    selectedMapping: Vn,
    editorMode: "create",
    editingMappingId: null
  };
  ci.set(p, j), F.addEventListener("change", () => {
    j.selectedMapping = F.value ?? "", Be({
      mappingSelect: F,
      applyMappingButton: O,
      updateMappingButton: R,
      editCriteriaButton: H,
      removeMappingButton: $,
      state: A
    }), rd(
      o ?? r,
      A,
      j.selectedMapping
    ).then((N) => {
      N && (A = N);
    });
  });
  const pt = /* @__PURE__ */ s(async () => {
    var Y, Z, ie, oe, ge, Ne, me, ae, re, De, tt, $e, bt, on;
    const N = F.value ?? "";
    if (!N) {
      (Z = (Y = ui.notifications) == null ? void 0 : Y.warn) == null || Z.call(
        Y,
        f(
          "EIDOLON.LightCriteria.SelectMappingWarning",
          "Choose a criteria mapping before applying."
        )
      ), Be({
        mappingSelect: F,
        applyMappingButton: O,
        updateMappingButton: R,
        editCriteriaButton: H,
        removeMappingButton: $,
        state: A
      });
      return;
    }
    if (N === le) {
      if (!(A != null && A.base)) {
        (oe = (ie = ui.notifications) == null ? void 0 : ie.warn) == null || oe.call(
          ie,
          f(
            "EIDOLON.LightCriteria.BaseUnavailable",
            "Set a base lighting state before applying it."
          )
        );
        return;
      }
      Zn(p, U, D), fi(e, n, A.base), A = await hn(o ?? r, {
        mappingId: le,
        categories: null,
        updatedAt: Date.now()
      }), j.selectedMapping = le, Ke(F, A, u, j.selectedMapping), j.selectedMapping = F.value ?? le, Tt(x, A), Et({ switcher: _, emptyState: B, state: A }), ln(D, {
        state: A,
        hasCategories: c.length > 0
      }), Ia(n, {
        mappingId: le,
        color: ((Ne = (ge = A.base) == null ? void 0 : ge.config) == null ? void 0 : Ne.color) ?? null
      }), (ae = (me = ui.notifications) == null ? void 0 : me.info) == null || ae.call(
        me,
        f(
          "EIDOLON.LightCriteria.BaseApplied",
          "Applied the base lighting state to the form."
        )
      ), Be({
        mappingSelect: F,
        applyMappingButton: O,
        updateMappingButton: R,
        editCriteriaButton: H,
        removeMappingButton: $,
        state: A
      });
      return;
    }
    const V = Array.isArray(A == null ? void 0 : A.mappings) && A.mappings.length ? A.mappings.find((Bt) => (Bt == null ? void 0 : Bt.id) === N) : null;
    if (!V) {
      (De = (re = ui.notifications) == null ? void 0 : re.warn) == null || De.call(
        re,
        f(
          "EIDOLON.LightCriteria.MappingUnavailable",
          "The selected criteria mapping is no longer available."
        )
      ), Ke(F, A, u, ""), j.selectedMapping = F.value ?? "", Be({
        mappingSelect: F,
        applyMappingButton: O,
        updateMappingButton: R,
        editCriteriaButton: H,
        removeMappingButton: $,
        state: A
      });
      return;
    }
    Zn(p, U, D), fi(e, n, V.config), A = await hn(o ?? r, {
      mappingId: V.id,
      categories: V.categories,
      updatedAt: Date.now()
    }), j.selectedMapping = V.id, Ke(F, A, u, j.selectedMapping), j.selectedMapping = F.value ?? V.id, Tt(x, A), Et({ switcher: _, emptyState: B, state: A }), ln(D, {
      state: A,
      hasCategories: c.length > 0
    }), Ia(n, {
      mappingId: V.id,
      color: (($e = (tt = V.config) == null ? void 0 : tt.config) == null ? void 0 : $e.color) ?? null
    });
    const K = Jt(V, u);
    (on = (bt = ui.notifications) == null ? void 0 : bt.info) == null || on.call(
      bt,
      f(
        "EIDOLON.LightCriteria.MappingApplied",
        "Applied mapping: {label}"
      ).replace("{label}", K)
    ), Be({
      mappingSelect: F,
      applyMappingButton: O,
      updateMappingButton: R,
      editCriteriaButton: H,
      removeMappingButton: $,
      state: A
    });
  }, "applySelectedMapping");
  O.addEventListener("click", () => {
    pt();
  }), F.addEventListener("keydown", (N) => {
    N.key === "Enter" && (N.preventDefault(), pt());
  });
  const jn = /* @__PURE__ */ s(async () => {
    var V, K, Y, Z, ie, oe, ge, Ne, me, ae, re, De, tt, $e, bt, on, Bt, zn, Jo, Gn, Yo;
    const N = j.selectedMapping;
    if (!N) {
      (K = (V = ui.notifications) == null ? void 0 : V.warn) == null || K.call(
        V,
        f(
          "EIDOLON.LightCriteria.SelectMappingWarning",
          "Choose a criteria mapping before applying."
        )
      );
      return;
    }
    R.disabled = !0;
    try {
      const Le = di(e, o);
      if (N === le)
        A = await ma(o ?? r, Le), w("LightCriteria | Base lighting updated", {
          lightId: ((Y = o ?? r) == null ? void 0 : Y.id) ?? null,
          configColor: ((Z = Le == null ? void 0 : Le.config) == null ? void 0 : Z.color) ?? null
        }), (oe = (ie = ui.notifications) == null ? void 0 : ie.info) == null || oe.call(
          ie,
          f(
            "EIDOLON.LightCriteria.BaseUpdated",
            "Updated the base lighting state with the current configuration."
          )
        ), j.selectedMapping = le;
      else {
        const qt = pn(A, N);
        if (!qt) {
          (Ne = (ge = ui.notifications) == null ? void 0 : ge.warn) == null || Ne.call(
            ge,
            f(
              "EIDOLON.LightCriteria.MappingUnavailable",
              "The selected criteria mapping is no longer available."
            )
          ), Ke(F, A, u, ""), j.selectedMapping = F.value ?? "";
          return;
        }
        A = await ha(
          o ?? r,
          qt.categories,
          Le,
          { label: qt.label ?? null }
        ), w("LightCriteria | Mapping updated", {
          mappingId: N,
          hasColor: !!((me = Le == null ? void 0 : Le.config) != null && me.color),
          stored: Array.isArray(A == null ? void 0 : A.mappings) ? ((ae = A.mappings.find((pr) => (pr == null ? void 0 : pr.id) === N)) == null ? void 0 : ae.config) ?? null : null,
          persisted: (De = (re = o ?? r) == null ? void 0 : re.getFlag) == null ? void 0 : De.call(re, _t, Kt)
        });
        const an = pn(A, N), ol = Jt(an || qt, u);
        w("LightCriteria | Mapping updated", {
          mappingId: N,
          categories: qt.categories,
          updatedColor: ((tt = Le == null ? void 0 : Le.config) == null ? void 0 : tt.color) ?? null,
          storedColor: ((bt = ($e = an == null ? void 0 : an.config) == null ? void 0 : $e.config) == null ? void 0 : bt.color) ?? ((Bt = (on = qt.config) == null ? void 0 : on.config) == null ? void 0 : Bt.color) ?? null
        }), (Jo = (zn = ui.notifications) == null ? void 0 : zn.info) == null || Jo.call(
          zn,
          f(
            "EIDOLON.LightCriteria.MappingUpdated",
            "Saved changes to mapping: {label}"
          ).replace("{label}", ol)
        ), j.selectedMapping = N;
      }
      Tt(x, A), Et({ switcher: _, emptyState: B, state: A }), ln(D, {
        state: A,
        hasCategories: c.length > 0
      }), Ke(F, A, u, j.selectedMapping), j.selectedMapping = F.value ?? "";
    } catch (Le) {
      console.error("eidolon-utilities | Failed to update light criteria mapping", Le), (Yo = (Gn = ui.notifications) == null ? void 0 : Gn.error) == null || Yo.call(
        Gn,
        f(
          "EIDOLON.LightCriteria.MappingUpdateError",
          "Failed to save the mapping. Check the console for details."
        )
      );
    } finally {
      R.disabled = !1, Be({
        mappingSelect: F,
        applyMappingButton: O,
        updateMappingButton: R,
        editCriteriaButton: H,
        removeMappingButton: $,
        state: A
      });
    }
  }, "updateSelectedMapping");
  R.addEventListener("click", () => {
    jn();
  }), Ke(F, A, u, j.selectedMapping), j.selectedMapping = F.value ?? j.selectedMapping ?? "", Be({
    mappingSelect: F,
    applyMappingButton: O,
    updateMappingButton: R,
    editCriteriaButton: H,
    removeMappingButton: $,
    state: A
  }), I.addEventListener("click", async () => {
    var N, V, K, Y, Z, ie;
    I.disabled = !0;
    try {
      const oe = di(e, o);
      A = await ma(o ?? r, oe), w("LightCriteria | Base lighting stored", {
        lightId: ((N = o ?? r) == null ? void 0 : N.id) ?? null,
        configColor: ((V = oe == null ? void 0 : oe.config) == null ? void 0 : V.color) ?? null
      }), (Y = (K = ui.notifications) == null ? void 0 : K.info) == null || Y.call(
        K,
        f(
          "EIDOLON.LightCriteria.BaseStored",
          "Saved the current configuration as the base lighting state."
        )
      ), Tt(x, A), Et({ switcher: _, emptyState: B, state: A }), ln(D, {
        state: A,
        hasCategories: c.length > 0
      }), j.selectedMapping = le, Ke(F, A, u, j.selectedMapping), j.selectedMapping = F.value ?? "", Be({
        mappingSelect: F,
        applyMappingButton: O,
        updateMappingButton: R,
        editCriteriaButton: H,
        removeMappingButton: $,
        state: A
      });
    } catch (oe) {
      console.error("eidolon-utilities | Failed to store base light criteria state", oe), (ie = (Z = ui.notifications) == null ? void 0 : Z.error) == null || ie.call(
        Z,
        f(
          "EIDOLON.LightCriteria.BaseError",
          "Failed to save the base lighting state. Check the console for details."
        )
      );
    } finally {
      I.disabled = !1;
    }
  }), D.addEventListener("click", () => {
    var V, K, Y, Z;
    if (!(A != null && A.base)) {
      (K = (V = ui.notifications) == null ? void 0 : V.warn) == null || K.call(
        V,
        f(
          "EIDOLON.LightCriteria.RequiresBase",
          "Set a base lighting state before adding criteria mappings."
        )
      );
      return;
    }
    if (c.length === 0) {
      (Z = (Y = ui.notifications) == null ? void 0 : Y.warn) == null || Z.call(
        Y,
        f(
          "EIDOLON.LightCriteria.NoCategoriesAvailable",
          "Add scene criteria with values in the Scene configuration before creating mappings."
        )
      );
      return;
    }
    const N = ci.get(p);
    wa({
      app: e,
      fieldset: p,
      createButton: D,
      creationSection: U,
      categoryList: W,
      form: n,
      persistedLight: o,
      stateEntry: N,
      mode: "create",
      mapping: null,
      preloadConfig: A.base
    });
  }), H.addEventListener("click", () => {
    var K, Y, Z, ie;
    const N = j.selectedMapping;
    if (!N || N === le) {
      (Y = (K = ui.notifications) == null ? void 0 : K.warn) == null || Y.call(
        K,
        f(
          "EIDOLON.LightCriteria.SelectMappingForCriteriaEdit",
          "Select a mapping before editing criteria."
        )
      );
      return;
    }
    const V = pn(A, N);
    if (!V) {
      (ie = (Z = ui.notifications) == null ? void 0 : Z.warn) == null || ie.call(
        Z,
        f(
          "EIDOLON.LightCriteria.MappingUnavailable",
          "The selected criteria mapping is no longer available."
        )
      );
      return;
    }
    Js(e, { fieldset: p, homeContainer: i }), wa({
      app: e,
      fieldset: p,
      createButton: D,
      creationSection: U,
      categoryList: W,
      form: n,
      persistedLight: o,
      stateEntry: j,
      mode: "retarget",
      mapping: V,
      preloadConfig: V.config
    });
  }), He.addEventListener("click", async () => {
    var V, K, Y, Z, ie, oe, ge, Ne, me, ae;
    const N = id(W);
    if (!N) {
      (K = (V = ui.notifications) == null ? void 0 : V.warn) == null || K.call(
        V,
        f(
          "EIDOLON.LightCriteria.SelectionRequired",
          "Select at least one criteria value to identify the mapping."
        )
      );
      return;
    }
    He.disabled = !0;
    try {
      const re = di(e, o);
      if (j.editorMode === "retarget" && j.editingMappingId) {
        const tt = To(A, N);
        let $e = !1;
        if (tt && tt !== j.editingMappingId && ($e = await Uu(), !$e)) {
          He.disabled = !1;
          return;
        }
        A = await Mc(
          o ?? r,
          j.editingMappingId,
          N,
          re,
          { replaceExisting: $e }
        ), w("LightCriteria | Mapping criteria retargeted", {
          mappingId: j.editingMappingId,
          categories: N,
          replaced: $e,
          configColor: ((Y = re == null ? void 0 : re.config) == null ? void 0 : Y.color) ?? null
        }), (ie = (Z = ui.notifications) == null ? void 0 : Z.info) == null || ie.call(
          Z,
          f(
            "EIDOLON.LightCriteria.MappingCriteriaUpdated",
            "Updated mapping criteria for the selected mapping."
          )
        );
      } else
        A = await ha(
          o ?? r,
          N,
          re,
          {}
        ), w("LightCriteria | Mapping saved from editor", {
          categories: N,
          configColor: ((oe = re == null ? void 0 : re.config) == null ? void 0 : oe.color) ?? null
        }), (Ne = (ge = ui.notifications) == null ? void 0 : ge.info) == null || Ne.call(
          ge,
          f(
            "EIDOLON.LightCriteria.MappingSaved",
            "Updated lighting mapping for the selected scene criteria."
          )
        );
      Tt(x, A), Et({ switcher: _, emptyState: B, state: A });
      const De = To(A, N);
      De && (j.selectedMapping = De), Ke(F, A, u, j.selectedMapping), j.selectedMapping = F.value ?? "", Be({
        mappingSelect: F,
        applyMappingButton: O,
        updateMappingButton: R,
        editCriteriaButton: H,
        removeMappingButton: $,
        state: A
      }), Zn(p, U, D);
    } catch (re) {
      console.error("eidolon-utilities | Failed to persist light criteria mapping", re), (ae = (me = ui.notifications) == null ? void 0 : me.error) == null || ae.call(
        me,
        f(
          "EIDOLON.LightCriteria.MappingError",
          "Failed to save the mapping. Check the console for details."
        )
      );
    } finally {
      He.disabled = !1;
    }
  }), Oe.addEventListener("click", () => {
    const N = ci.get(p);
    N != null && N.restoreConfig && fi(e, n, N.restoreConfig), Zn(p, U, D);
  }), $.addEventListener("click", async () => {
    var K, Y;
    const N = j.selectedMapping;
    !N || N === le || !await Vu() || (A = await Ac(o ?? r, N), j.selectedMapping = "", Tt(x, A), Et({ switcher: _, emptyState: B, state: A }), Ke(F, A, u, ""), Be({
      mappingSelect: F,
      applyMappingButton: O,
      updateMappingButton: R,
      editCriteriaButton: H,
      removeMappingButton: $,
      state: A
    }), (Y = (K = ui.notifications) == null ? void 0 : K.info) == null || Y.call(
      K,
      f("EIDOLON.LightCriteria.MappingRemoved", "Removed selected mapping.")
    ));
  });
}
s(qu, "enhanceAmbientLightConfig");
function wa({
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
  l && (l.restoreConfig = di(e, a), l.editorMode = c, l.editingMappingId = c === "retarget" ? (u == null ? void 0 : u.id) ?? null : null), d && fi(e, o, d), c === "retarget" && (u != null && u.categories) ? nd(r, u.categories) : td(r);
  const g = i.querySelector("p.notes");
  g instanceof HTMLElement && (g.textContent = c === "retarget" ? f(
    "EIDOLON.LightCriteria.EditCriteriaDescription",
    "Adjust criteria values for the selected mapping."
  ) : f(
    "EIDOLON.LightCriteria.CreateDescription",
    "Assign scene criteria values to map the current configuration."
  ));
  const m = i.querySelector('button[data-action="save-mapping"]');
  m instanceof HTMLButtonElement && (m.textContent = c === "retarget" ? f("EIDOLON.LightCriteria.SaveCriteriaChanges", "Save Criteria Changes") : f("EIDOLON.LightCriteria.SaveMapping", "Save Mapping")), i.hidden = !1, n.setAttribute("aria-expanded", "true"), Po(t, i), requestAnimationFrame(() => {
    var y;
    (y = e.setPosition) == null || y.call(e, { height: "auto" });
  });
}
s(wa, "openMappingEditor");
async function Uu() {
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
s(Uu, "confirmCriteriaConflict");
async function Vu() {
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
s(Vu, "confirmRemoveMapping");
function ju(e, { fieldset: t, homeContainer: n }) {
  const i = Wu(e, n);
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
    a.preventDefault(), Js(e, { fieldset: t, homeContainer: n });
  };
}
s(ju, "ensureManagerHeaderButton");
function Js(e, { fieldset: t, homeContainer: n }) {
  var m, y, b;
  const i = Xn.get(e);
  if (i != null && i.rendered) {
    (m = i.bringToTop) == null || m.call(i);
    return;
  }
  const r = /* @__PURE__ */ s((...p) => {
    var C;
    const E = zu(p), T = (C = E == null ? void 0 : E.querySelector) == null ? void 0 : C.call(E, ".eidolon-light-criteria-manager-host");
    T instanceof HTMLElement && (Gu(t), t.hidden = !1, T.appendChild(t));
  }, "onRender"), o = /* @__PURE__ */ s(() => {
    n instanceof HTMLElement && n.appendChild(t), t.hidden = !0, Xn.delete(e), requestAnimationFrame(() => {
      var p;
      (p = e.setPosition) == null || p.call(e, { height: "auto" });
    });
  }, "onClose"), a = f("EIDOLON.LightCriteria.ManagerTitle", "Scene Criteria Lighting"), l = '<div class="eidolon-light-criteria-manager-host"></div>', c = f("EIDOLON.LightCriteria.Close", "Close"), u = (b = (y = foundry == null ? void 0 : foundry.applications) == null ? void 0 : y.api) == null ? void 0 : b.DialogV2;
  if (typeof (u == null ? void 0 : u.wait) == "function")
    try {
      let p = !1;
      const E = /* @__PURE__ */ s(() => {
        p || (p = !0, o());
      }, "closeOnce");
      Xn.set(e, {
        rendered: !0,
        bringToTop: /* @__PURE__ */ s(() => {
        }, "bringToTop")
      }), u.wait({
        window: { title: a },
        content: l,
        buttons: [{ action: "close", label: c, default: !0 }],
        render: /* @__PURE__ */ s((...T) => r(...T), "render"),
        close: E,
        rejectClose: !1
      }).catch((T) => {
        console.warn("eidolon-utilities | DialogV2 manager failed, falling back to Dialog", T), E();
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
  Xn.set(e, g), g.render(!0);
}
s(Js, "openManagerDialog");
function zu(e) {
  for (const t of e) {
    const n = et(t);
    if (n) return n;
    const i = et(t == null ? void 0 : t.element);
    if (i) return i;
  }
  return null;
}
s(zu, "findDialogRoot");
function Gu(e) {
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
    const m = document.createElement("div");
    m.classList.add("eidolon-light-criteria-manager__warnings");
    for (const y of a) m.appendChild(y);
    c.appendChild(m);
  }
  const g = document.createElement("div");
  g.classList.add("eidolon-light-criteria-manager__header"), g.textContent = f("EIDOLON.LightCriteria.ManagerAuthoring", "Create or Update Mapping"), u.appendChild(g), o && u.appendChild(o), e.innerHTML = "", t && e.appendChild(t), n && e.appendChild(n), e.appendChild(l), Po(e, o);
}
s(Gu, "applyManagerLayout");
function Wu(e, t) {
  var i;
  const n = et(e == null ? void 0 : e.element);
  return n || (((i = t == null ? void 0 : t.closest) == null ? void 0 : i.call(t, ".application")) ?? null);
}
s(Wu, "resolveApplicationRoot");
function Zn(e, t, n) {
  const i = ci.get(e);
  i && (i.restoreConfig = null, i.editorMode = "create", i.editingMappingId = null), t.hidden = !0, n.setAttribute("aria-expanded", "false");
  const r = t.querySelector("p.notes");
  r instanceof HTMLElement && (r.textContent = f(
    "EIDOLON.LightCriteria.CreateDescription",
    "Assign scene criteria values to map the current configuration."
  ));
  const o = t.querySelector('button[data-action="save-mapping"]');
  o instanceof HTMLButtonElement && (o.textContent = f("EIDOLON.LightCriteria.SaveMapping", "Save Mapping")), Po(e, t), requestAnimationFrame(() => {
    var a, l;
    (l = (a = i == null ? void 0 : i.app) == null ? void 0 : a.setPosition) == null || l.call(a, { height: "auto" });
  });
}
s(Zn, "hideCreationSection");
function Tt(e, t) {
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
s(Tt, "updateStatusLine");
function ln(e, { state: t, hasCategories: n }) {
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
s(ln, "updateCreateButtonState");
function di(e, t) {
  var c, u, d;
  const n = t ?? Ys(e);
  if (!n)
    throw new Error("Ambient light document unavailable.");
  const i = Pt(((c = n.toObject) == null ? void 0 : c.call(n)) ?? {});
  if (!i)
    throw new Error("Unable to duplicate ambient light data.");
  const r = (e == null ? void 0 : e.form) instanceof HTMLFormElement ? e.form : null, o = r ? Fl(r) : {}, a = foundry.utils.mergeObject(i, o, {
    inplace: !1,
    performDeletions: !0
  });
  r && (r.querySelectorAll("color-picker[name]").forEach((g) => {
    var T, C;
    const m = g.getAttribute("name");
    if (!m) return;
    const y = typeof g.value == "string" ? g.value : "", b = ((T = g.ui) == null ? void 0 : T.input) ?? ((C = g.querySelector) == null ? void 0 : C.call(g, 'input[type="color"]')), p = (b == null ? void 0 : b.value) ?? "", E = y || p;
    typeof E != "string" || !E || (foundry.utils.setProperty(a, m, E), w("LightCriteria | Captured color-picker value", {
      path: m,
      pickerValue: y,
      swatchValue: p,
      chosenValue: E
    }));
  }), r.querySelectorAll("range-picker[name]").forEach((g) => {
    var x, _;
    const m = g.getAttribute("name");
    if (!m) return;
    const y = g.value !== void 0 && g.value !== null ? String(g.value) : "", b = (x = g.querySelector) == null ? void 0 : x.call(g, 'input[type="range"]'), p = (_ = g.querySelector) == null ? void 0 : _.call(g, 'input[type="number"]'), E = b instanceof HTMLInputElement ? b.value : "", T = p instanceof HTMLInputElement ? p.value : "", C = y || T || E;
    if (typeof C != "string" || !C.length) return;
    const I = Number(C), D = Number.isFinite(I) ? I : C;
    foundry.utils.setProperty(a, m, D), w("LightCriteria | Captured range-picker value", {
      path: m,
      elementValue: y,
      numberValue: T,
      rangeValue: E,
      chosenValue: D
    });
  }));
  const l = Pt(a);
  return w("LightCriteria | Captured form config", {
    lightId: (n == null ? void 0 : n.id) ?? null,
    hasColor: !!((u = l == null ? void 0 : l.config) != null && u.color),
    color: ((d = l == null ? void 0 : l.config) == null ? void 0 : d.color) ?? null
  }), l;
}
s(di, "captureAmbientLightFormConfig");
function fi(e, t, n) {
  if (!n || typeof n != "object") return;
  const i = foundry.utils.flattenObject(n, { safe: !0 });
  for (const [r, o] of Object.entries(i)) {
    const a = t.querySelectorAll(`[name="${r}"]`);
    if (a.length) {
      w("LightCriteria | Applying field", {
        path: r,
        value: o,
        elementCount: a.length
      });
      for (const l of a)
        l instanceof HTMLElement && l.tagName === "COLOR-PICKER" ? Ju(l, o) : l instanceof HTMLElement && l.tagName === "RANGE-PICKER" ? Yu(l, o) : l instanceof HTMLInputElement ? Ku(l, o) : l instanceof HTMLSelectElement ? Qu(l, o) : l instanceof HTMLTextAreaElement && Xu(l, o);
    }
  }
  requestAnimationFrame(() => {
    var r;
    return (r = e._previewChanges) == null ? void 0 : r.call(e);
  });
}
s(fi, "applyConfigToForm");
function Ku(e, t, n) {
  const i = e.type;
  if (i === "checkbox") {
    const a = !!t;
    e.checked !== a && (e.checked = a, ke(e));
    return;
  }
  if (i === "radio") {
    const a = t == null ? "" : String(t), l = e.value === a;
    e.checked !== l && (e.checked = l, l && ke(e));
    return;
  }
  const r = t == null ? "" : String(t);
  let o = !1;
  e.value !== r && (e.value = r, o = !0), o && ke(e);
}
s(Ku, "applyValueToInput");
function Ju(e, t, n) {
  var l, c, u, d, g, m;
  const i = t == null ? "" : String(t);
  let r = !1;
  e.value !== i && (e.value = i, e.setAttribute("value", i), (l = e.ui) != null && l.setValue && e.ui.setValue(i), r = !0);
  const o = ((c = e.ui) == null ? void 0 : c.input) ?? ((u = e.querySelector) == null ? void 0 : u.call(e, 'input[type="color"]'));
  o instanceof HTMLInputElement && o.value !== i && (o.value = i, ke(o));
  const a = ((d = e.ui) == null ? void 0 : d.text) ?? ((g = e.querySelector) == null ? void 0 : g.call(e, 'input[type="text"]'));
  a instanceof HTMLInputElement && a.value !== i && (a.value = i, ke(a)), (m = e.ui) != null && m.commit ? e.ui.commit() : (e.dispatchEvent(new Event("input", { bubbles: !0, cancelable: !0 })), e.dispatchEvent(new Event("change", { bubbles: !0, cancelable: !0 }))), w("LightCriteria | Color picker applied", {
    value: i,
    pickerValue: e.value ?? null,
    swatchValue: (o == null ? void 0 : o.value) ?? null,
    textValue: (a == null ? void 0 : a.value) ?? null
  }), r && ke(e);
}
s(Ju, "applyValueToColorPicker");
function Yu(e, t, n) {
  var u, d;
  const i = t == null ? "" : String(t), r = Number(i), o = Number.isFinite(r) ? r : i;
  let a = !1;
  e.value !== void 0 && e.value !== o && (e.value = o, a = !0), e.getAttribute("value") !== i && (e.setAttribute("value", i), a = !0);
  const l = (u = e.querySelector) == null ? void 0 : u.call(e, 'input[type="range"]');
  l instanceof HTMLInputElement && l.value !== i && (l.value = i, ke(l));
  const c = (d = e.querySelector) == null ? void 0 : d.call(e, 'input[type="number"]');
  if (c instanceof HTMLInputElement && c.value !== i && (c.value = i, ke(c)), typeof e.commit == "function")
    try {
      e.commit();
    } catch (g) {
      console.error("eidolon-utilities | range-picker commit failed", g);
    }
  w("LightCriteria | Range picker applied", {
    value: i,
    resolvedValue: o,
    rangeValue: (l == null ? void 0 : l.value) ?? null,
    numberValue: (c == null ? void 0 : c.value) ?? null
  }), a && ke(e);
}
s(Yu, "applyValueToRangePicker");
function Qu(e, t, n) {
  const i = t == null ? "" : String(t);
  e.value !== i && (e.value = i, ke(e));
}
s(Qu, "applyValueToSelect");
function Xu(e, t, n) {
  const i = t == null ? "" : String(t);
  e.value !== i && (e.value = i, ke(e));
}
s(Xu, "applyValueToTextarea");
function ke(e) {
  e.dispatchEvent(new Event("input", { bubbles: !0, cancelable: !0 })), e.dispatchEvent(new Event("change", { bubbles: !0, cancelable: !0 }));
}
s(ke, "triggerInputChange");
function Be({
  mappingSelect: e,
  applyMappingButton: t,
  updateMappingButton: n,
  editCriteriaButton: i,
  removeMappingButton: r,
  state: o
}) {
  const a = (e == null ? void 0 : e.value) ?? "", l = !!(o != null && o.base), c = a && a !== le ? !!pn(o, a) : !1;
  t instanceof HTMLButtonElement && (a ? a === le ? t.disabled = !l : t.disabled = !c : t.disabled = !0), n instanceof HTMLButtonElement && (a ? a === le ? n.disabled = !1 : n.disabled = !c : n.disabled = !0), i instanceof HTMLButtonElement && (i.disabled = !a || a === le || !c), r instanceof HTMLButtonElement && (r.disabled = !a || a === le || !c);
}
s(Be, "syncMappingSwitcherState");
function Zu(e) {
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
s(Zu, "buildCategoryNameLookup");
function Ke(e, t, n, i) {
  if (!(e instanceof HTMLSelectElement)) return;
  const r = typeof i == "string" ? i : "", o = !!(t != null && t.base), a = Array.isArray(t == null ? void 0 : t.mappings) ? [...t.mappings] : [], l = e.value;
  e.innerHTML = "";
  const c = document.createElement("option");
  c.value = "", c.textContent = f(
    "EIDOLON.LightCriteria.SelectPlaceholder",
    "Select a mapping"
  ), c.disabled = o, e.appendChild(c);
  const u = document.createElement("option");
  u.value = le, u.textContent = f(
    "EIDOLON.LightCriteria.BaseOption",
    "Base Lighting"
  ), u.disabled = !o, e.appendChild(u), a.slice().sort((y, b) => {
    var T;
    const p = Jt(y, n), E = Jt(b, n);
    return p.localeCompare(E, ((T = game.i18n) == null ? void 0 : T.lang) ?? void 0, {
      sensitivity: "base"
    });
  }).forEach((y) => {
    if (!(y != null && y.id)) return;
    const b = document.createElement("option");
    b.value = y.id, b.textContent = Jt(y, n), e.appendChild(b);
  });
  const d = new Set(
    Array.from(e.options).filter((y) => !y.disabled).map((y) => y.value)
  ), g = o && l === "" ? "" : l, m = r || (d.has(g) ? g : "");
  m && d.has(m) ? e.value = m : o ? e.value = le : e.value = "";
}
s(Ke, "populateMappingSelector");
function Jt(e, t) {
  if (!e || typeof e != "object")
    return f("EIDOLON.LightCriteria.UnnamedMapping", "Unnamed Mapping");
  if (typeof e.label == "string" && e.label.trim())
    return e.label.trim();
  const n = e.categories ?? {}, i = Object.entries(n).filter(([, r]) => typeof r == "string" && r.trim()).map(([r, o]) => {
    const a = o.trim();
    return `${t.get(r) ?? f("EIDOLON.LightCriteria.UnnamedCategory", "Unnamed Category")}: ${a}`;
  });
  return i.length === 0 ? f("EIDOLON.LightCriteria.UnnamedMapping", "Unnamed Mapping") : i.join(" • ");
}
s(Jt, "formatMappingOptionLabel");
function To(e, t) {
  if (!e || typeof e != "object" || !Array.isArray(e.mappings)) return null;
  const n = tn(t);
  if (!n) return null;
  const i = e.mappings.find((r) => (r == null ? void 0 : r.key) === n);
  return (i == null ? void 0 : i.id) ?? null;
}
s(To, "findMappingIdByCategories");
function pn(e, t) {
  return !t || !e || typeof e != "object" || !Array.isArray(e.mappings) ? null : e.mappings.find((n) => (n == null ? void 0 : n.id) === t) ?? null;
}
s(pn, "getMappingById");
function ed(e) {
  if (!e || typeof e != "object") return "";
  const t = e.current;
  if (t != null && t.mappingId) {
    if (t.mappingId === le)
      return e != null && e.base ? le : "";
    if (Array.isArray(e.mappings) && e.mappings.some((n) => n.id === t.mappingId))
      return t.mappingId;
  }
  if (t != null && t.categories) {
    const n = To(e, t.categories);
    if (n) return n;
  }
  return "";
}
s(ed, "resolveInitialMappingSelection");
function Ia(e, t = {}) {
  var a, l, c, u;
  if (!(e instanceof HTMLFormElement)) return;
  const n = e.querySelector('color-picker[name="config.color"]'), i = (n == null ? void 0 : n.value) ?? null, r = ((a = n == null ? void 0 : n.ui) == null ? void 0 : a.text) ?? ((l = n == null ? void 0 : n.querySelector) == null ? void 0 : l.call(n, 'input[type="text"]')), o = ((c = n == null ? void 0 : n.ui) == null ? void 0 : c.input) ?? ((u = n == null ? void 0 : n.querySelector) == null ? void 0 : u.call(n, 'input[type="color"]'));
  w("LightCriteria | Color state after apply", {
    ...t,
    textValue: (r == null ? void 0 : r.value) ?? null,
    pickerValue: i,
    swatchValue: (o == null ? void 0 : o.value) ?? null
  });
}
s(Ia, "logAppliedColorState");
function td(e) {
  e.querySelectorAll("select[data-category-id]").forEach((t) => {
    t.value = "";
  });
}
s(td, "resetCategorySelections");
function nd(e, t) {
  const n = t && typeof t == "object" ? t : {};
  e.querySelectorAll("select[data-category-id]").forEach((i) => {
    const r = i.dataset.categoryId;
    if (!r) return;
    const o = n[r];
    i.value = typeof o == "string" ? o : "";
  });
}
s(nd, "setCategorySelections");
function id(e) {
  const t = {};
  return e.querySelectorAll("select[data-category-id]").forEach((n) => {
    var o, a;
    const i = n.dataset.categoryId, r = (a = (o = n.value) == null ? void 0 : o.trim) == null ? void 0 : a.call(o);
    !i || !r || (t[i] = r);
  }), Object.keys(t).length > 0 ? t : null;
}
s(id, "readCategorySelections");
async function rd(e, t, n) {
  if (!e) return null;
  try {
    if (!n)
      return await hn(e, {});
    if (n === le)
      return await hn(e, {
        mappingId: le,
        categories: null,
        updatedAt: Date.now()
      });
    const i = pn(t, n);
    return i ? await hn(e, {
      mappingId: i.id,
      categories: i.categories,
      updatedAt: Date.now()
    }) : null;
  } catch (i) {
    return console.warn("eidolon-utilities | Failed to persist mapping selection", i), null;
  }
}
s(rd, "persistCurrentSelection");
function Po(e, t) {
  if (!(e instanceof HTMLElement)) return;
  const n = e.querySelector(".eidolon-light-criteria-manager__section.is-bottom");
  n instanceof HTMLElement && (n.hidden = !!(t != null && t.hidden));
}
s(Po, "updateManagerSectionVisibility");
function Et({ switcher: e, emptyState: t, state: n }) {
  const i = !!(n != null && n.base);
  e instanceof HTMLElement && (e.hidden = !i), t instanceof HTMLElement && (t.hidden = i);
}
s(Et, "updateActiveMappingVisibility");
function Ys(e) {
  const t = (e == null ? void 0 : e.object) ?? (e == null ? void 0 : e.document) ?? null;
  return !(t != null && t.isEmbedded) || t.documentName !== "AmbientLight" ? null : t;
}
s(Ys, "getAmbientLightDocument");
function od(e) {
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
s(od, "getPersistedAmbientLightDocument");
function ad() {
  Pu();
}
s(ad, "registerLightCriteriaHooks");
ad();
const Eo = /* @__PURE__ */ new Map();
let Co = !1;
function Bo(e, t) {
  Eo.has(e) && console.warn(`[${S}] Socket handler for type "${e}" already registered, overwriting.`), Eo.set(e, t);
}
s(Bo, "registerSocketHandler");
function gi(e, t) {
  if (!Co) {
    console.error(`[${S}] Socket not initialized. Call initializeSocket() first.`);
    return;
  }
  game.socket.emit(`module.${S}`, { type: e, payload: t });
}
s(gi, "emitSocket");
function sd() {
  Co || (game.socket.on(`module.${S}`, (e) => {
    const { type: t, payload: n } = e ?? {}, i = Eo.get(t);
    i ? i(n) : console.warn(`[${S}] No socket handler for type "${t}"`);
  }), Co = !0, console.log(`[${S}] Socket initialized on channel module.${S}`));
}
s(sd, "initializeSocket");
const Qs = "tween", Xs = "tween-sequence", Lo = "tween-sequence-cancel", pe = Object.freeze({
  ABORT: "abort",
  CONTINUE: "continue"
}), cn = Object.freeze({
  COMPLETED: "completed",
  CANCELLED: "cancelled",
  FAILED: "failed"
}), it = Object.freeze({
  BEFORE_ALL: "beforeAll",
  BEFORE_STEP: "before",
  ENTRY: "entry",
  AFTER_STEP: "after",
  RUNTIME: "runtime",
  VALIDATION: "validation"
}), Ai = /* @__PURE__ */ new Map();
function qo({ type: e, execute: t, validate: n }) {
  Ai.has(e) && console.warn(`[tween-registry] Type "${e}" already registered, overwriting.`), Ai.set(e, { type: e, execute: t, validate: n ?? (() => {
  }) });
}
s(qo, "registerTweenType");
function hr(e) {
  return Ai.get(e);
}
s(hr, "getTweenType");
function ld(e, t = {}) {
  const n = hr(e);
  if (!n)
    throw new Error(`Unknown tween type: "${e}".`);
  return n.validate(t ?? {}), n;
}
s(ld, "validateTweenEntry");
function wo() {
  return [...Ai.keys()];
}
s(wo, "listTweenTypes");
function Zs(e) {
  const t = foundry.canvas.animation.CanvasAnimation;
  return {
    linear: t.easeLinear,
    easeInOutCosine: t.easeInOutCosine
  }[e] ?? t.easeInOutCosine;
}
s(Zs, "resolveEasing");
function Ni(e) {
  return e <= 0.04045 ? e / 12.92 : ((e + 0.055) / 1.055) ** 2.4;
}
s(Ni, "srgbToLinear");
function Yt(e) {
  return e <= 31308e-7 ? 12.92 * e : 1.055 * e ** (1 / 2.4) - 0.055;
}
s(Yt, "linearToSrgb");
function Sa(e, t, n) {
  const i = 0.4122214708 * e + 0.5363325363 * t + 0.0514459929 * n, r = 0.2119034982 * e + 0.6806995451 * t + 0.1073969566 * n, o = 0.0883024619 * e + 0.2817188376 * t + 0.6299787005 * n, a = Math.cbrt(i), l = Math.cbrt(r), c = Math.cbrt(o);
  return [
    0.2104542553 * a + 0.793617785 * l - 0.0040720468 * c,
    1.9779984951 * a - 2.428592205 * l + 0.4505937099 * c,
    0.0259040371 * a + 0.7827717662 * l - 0.808675766 * c
  ];
}
s(Sa, "linearRgbToOklab");
function cd(e, t, n) {
  const i = (e + 0.3963377774 * t + 0.2158037573 * n) ** 3, r = (e - 0.1055613458 * t - 0.0638541728 * n) ** 3, o = (e - 0.0894841775 * t - 1.291485548 * n) ** 3;
  return [
    4.0767416621 * i - 3.3077115913 * r + 0.2309699292 * o,
    -1.2684380046 * i + 2.6097574011 * r - 0.3413193965 * o,
    -0.0041960863 * i - 0.7034186147 * r + 1.707614701 * o
  ];
}
s(cd, "oklabToLinearRgb");
function Di(e) {
  return [e.r, e.g, e.b];
}
s(Di, "colorToRgb");
function el(e, t, n) {
  const i = /* @__PURE__ */ s((o) => Math.max(0, Math.min(1, o)), "clamp"), r = /* @__PURE__ */ s((o) => Math.round(i(o) * 255).toString(16).padStart(2, "0"), "toHex");
  return `#${r(e)}${r(t)}${r(n)}`;
}
s(el, "rgbToHex");
function ud(e, t, n) {
  if (n <= 0) return e.toHTML();
  if (n >= 1) return t.toHTML();
  const i = foundry.utils.Color, [r, o, a] = e.hsl, [l, c, u] = t.hsl, d = (l - r + 0.5) % 1 - 0.5, g = (r + d * n + 1) % 1, m = o + (c - o) * n, y = a + (u - a) * n;
  return i.fromHSL([g, m, y]).toHTML();
}
s(ud, "interpolateHsl");
function dd(e, t, n) {
  if (n <= 0) return e.toHTML();
  if (n >= 1) return t.toHTML();
  const [i, r, o] = Di(e).map(Ni), [a, l, c] = Di(t).map(Ni), u = Yt(i + (a - i) * n), d = Yt(r + (l - r) * n), g = Yt(o + (c - o) * n);
  return el(u, d, g);
}
s(dd, "interpolateRgb");
function fd(e, t, n) {
  if (n <= 0) return e.toHTML();
  if (n >= 1) return t.toHTML();
  const [i, r, o] = Di(e).map(Ni), [a, l, c] = Di(t).map(Ni), [u, d, g] = Sa(i, r, o), [m, y, b] = Sa(a, l, c), p = 0.02, E = Math.sqrt(d * d + g * g), T = Math.sqrt(y * y + b * b);
  let C, I, D;
  if (E < p || T < p)
    C = u + (m - u) * n, I = d + (y - d) * n, D = g + (b - g) * n;
  else {
    const Q = Math.atan2(g, d);
    let F = Math.atan2(b, y) - Q;
    F > Math.PI && (F -= 2 * Math.PI), F < -Math.PI && (F += 2 * Math.PI), C = u + (m - u) * n;
    const z = E + (T - E) * n, O = Q + F * n;
    I = z * Math.cos(O), D = z * Math.sin(O);
  }
  const [x, _, q] = cd(C, I, D);
  return el(Yt(x), Yt(_), Yt(q));
}
s(fd, "interpolateOklch");
const Io = {
  hsl: ud,
  rgb: dd,
  oklch: fd
};
function gd(e = "hsl") {
  return Io[e] ?? Io.hsl;
}
s(gd, "getInterpolator");
function Oa() {
  return Object.keys(Io);
}
s(Oa, "listInterpolationModes");
function md(e) {
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
  if (e.mode && !Oa().includes(e.mode))
    throw new Error(
      `light-color tween: unknown mode "${e.mode}". Available: ${Oa().join(", ")}`
    );
}
s(md, "validate$2");
async function hd(e, t = {}) {
  const { CanvasAnimation: n } = foundry.canvas.animation, { Color: i } = foundry.utils, { uuid: r, toColor: o, toAlpha: a, mode: l = "oklch" } = e, c = Array.isArray(r) ? r : [r];
  if (c.length === 0)
    return console.warn("light-color tween: empty uuid array, nothing to animate."), !0;
  const {
    durationMS: u = 2e3,
    easing: d = "easeInOutCosine",
    commit: g = !0,
    startEpochMS: m = null,
    signal: y = null
  } = t, b = Zs(d), p = o != null, E = a != null, T = p ? gd(l) : null, C = p ? i.fromString(o) : null;
  if (p && !C.valid) throw new Error(`light-color tween: invalid target color "${o}".`);
  async function I(x) {
    var $, P;
    if (y != null && y.aborted) return !1;
    const _ = await fromUuid(x);
    if (!_) return !1;
    const q = _.object;
    if (!q) return !1;
    let Q;
    if (p) {
      const B = ($ = _.config) == null ? void 0 : $.color;
      B != null && B.valid || console.warn(`light-color tween: source color invalid on ${x}, using white.`), Q = B != null && B.valid ? B : i.fromString("#ffffff");
    }
    const ee = E ? ((P = _._source.config) == null ? void 0 : P.alpha) ?? 0.5 : null, F = { t: 0 }, z = `ambient-hue-tween:${x}`;
    n.terminateAnimation(z), y && y.addEventListener("abort", () => {
      n.terminateAnimation(z);
    }, { once: !0 });
    const O = typeof m == "number" ? Math.max(0, Math.min(u, Date.now() - m)) : 0, R = /* @__PURE__ */ s((B) => {
      const U = {};
      p && (U.color = T(Q, C, B)), E && (U.alpha = ee + (a - ee) * B), _.updateSource({ config: U }), q.initializeLightSource();
    }, "applyFrame");
    O > 0 && (F.t = O / u, R(F.t));
    const H = await n.animate(
      [{ parent: F, attribute: "t", to: 1 }],
      {
        name: z,
        duration: u,
        easing: b,
        time: O,
        ontick: /* @__PURE__ */ s(() => R(F.t), "ontick")
      }
    );
    if (H !== !1) {
      if (y != null && y.aborted) return !1;
      const B = {};
      p && (B.color = C.toHTML()), E && (B.alpha = a), _.updateSource({ config: B }), q.initializeLightSource();
    }
    if (g && H !== !1 && _.canUserModify(game.user, "update")) {
      if (y != null && y.aborted) return !1;
      const B = {}, U = {};
      p && (B.color = Q.toHTML(), U["config.color"] = C.toHTML()), E && (B.alpha = ee, U["config.alpha"] = a), _.updateSource({ config: B }), await _.update(U);
    }
    return H !== !1;
  }
  return s(I, "animateOne"), (await Promise.all(c.map(I))).every(Boolean);
}
s(hd, "execute$2");
function pd() {
  qo({ type: "light-color", execute: hd, validate: md });
}
s(pd, "registerLightColorTween");
const rt = /* @__PURE__ */ new WeakMap();
function yd(e) {
  if ((Array.isArray(e.uuid) ? e.uuid : [e.uuid]).some((n) => !n || typeof n != "string"))
    throw new Error("light-state tween: 'uuid' is required (string or array of AmbientLight document UUIDs).");
  if (typeof e.enabled != "boolean")
    throw new Error("light-state tween: 'enabled' (boolean) is required.");
}
s(yd, "validate$1");
async function bd(e, t = {}) {
  const { CanvasAnimation: n } = foundry.canvas.animation, { uuid: i, enabled: r } = e, o = Array.isArray(i) ? i : [i];
  if (o.length === 0)
    return console.warn("light-state tween: empty uuid array, nothing to animate."), !0;
  const {
    durationMS: a = 2e3,
    easing: l = "easeInOutCosine",
    commit: c = !0,
    startEpochMS: u = null,
    signal: d = null
  } = t, g = Zs(l);
  async function m(b) {
    var _, q, Q, ee;
    if (d != null && d.aborted) return !1;
    const p = await fromUuid(b);
    if (!p) return !1;
    const E = p.object;
    if (!E) return !1;
    const T = `ambient-state-tween:${b}`;
    n.terminateAnimation(T), d && d.addEventListener("abort", () => {
      n.terminateAnimation(T);
    }, { once: !0 });
    const C = rt.get(p) ?? {
      hidden: p._source.hidden,
      alpha: ((_ = p._source.config) == null ? void 0 : _.alpha) ?? 0.5
    };
    if (rt.set(p, C), w(`light-state START ${r ? "ON" : "OFF"} | snap: ${JSON.stringify(C)} | _source.hidden=${p._source.hidden}, _source.config.alpha=${(q = p._source.config) == null ? void 0 : q.alpha}`), r && !C.hidden || !r && C.hidden)
      return rt.delete(p), !0;
    const I = C.alpha, D = typeof u == "number" ? Math.max(0, Math.min(a, Date.now() - u)) : 0, x = /* @__PURE__ */ s((F) => {
      p.updateSource({ config: { alpha: F } }), E.initializeLightSource();
    }, "applyAlpha");
    if (r) {
      p.updateSource({ hidden: !1, config: { alpha: 0 } }), E.initializeLightSource(), canvas.perception.update({ refreshLighting: !0, refreshVision: !0 });
      const F = { t: 0 };
      D > 0 && (F.t = D / a, x(I * F.t));
      const z = await n.animate(
        [{ parent: F, attribute: "t", to: 1 }],
        {
          name: T,
          duration: a,
          easing: g,
          time: D,
          ontick: /* @__PURE__ */ s(() => x(I * F.t), "ontick")
        }
      );
      return z !== !1 && !(d != null && d.aborted) && c && p.canUserModify(game.user, "update") ? (p.updateSource({ hidden: !0, config: { alpha: I } }), await p.update({ hidden: !1 }), w(`light-state FADE-IN committed. _source.hidden=${p._source.hidden}, _source.config.alpha=${(Q = p._source.config) == null ? void 0 : Q.alpha}`), rt.delete(p)) : z === !1 || rt.delete(p), z !== !1;
    } else {
      p.updateSource({ hidden: !1, config: { alpha: C.alpha } }), E.initializeLightSource();
      const F = { t: 0 };
      D > 0 && (F.t = D / a, x(I * (1 - F.t)));
      const z = await n.animate(
        [{ parent: F, attribute: "t", to: 1 }],
        {
          name: T,
          duration: a,
          easing: g,
          time: D,
          ontick: /* @__PURE__ */ s(() => x(I * (1 - F.t)), "ontick")
        }
      );
      return z !== !1 && !(d != null && d.aborted) && c && p.canUserModify(game.user, "update") ? (await p.update({ hidden: !0 }), p.updateSource({ config: { alpha: I } }), E.initializeLightSource(), w(`light-state FADE-OUT committed+restored. _source.hidden=${p._source.hidden}, _source.config.alpha=${(ee = p._source.config) == null ? void 0 : ee.alpha}`), rt.delete(p)) : z === !1 || (p.updateSource({ hidden: !0, config: { alpha: I } }), E.initializeLightSource(), rt.delete(p)), z !== !1;
    }
  }
  return s(m, "animateOne"), (await Promise.all(o.map(m))).every(Boolean);
}
s(bd, "execute$1");
function Td() {
  qo({ type: "light-state", execute: bd, validate: yd });
}
s(Td, "registerLightStateTween");
var lt, Sn, On, vn, Mn, An, Xt;
const Go = class Go {
  /**
   * @param {AbortController} controller
   */
  constructor(t) {
    M(this, lt);
    M(this, Sn);
    M(this, On);
    M(this, vn);
    M(this, Mn);
    M(this, An, !1);
    M(this, Xt, null);
    v(this, lt, t), v(this, vn, new Promise((n) => {
      v(this, Sn, n);
    })), v(this, Mn, new Promise((n) => {
      v(this, On, n);
    }));
  }
  /** @returns {Promise<boolean>} Resolves true (completed) or false (cancelled/failed). */
  get finished() {
    return h(this, vn);
  }
  /** @returns {Promise<{status: string, [k: string]: unknown}>} */
  get result() {
    return h(this, Mn);
  }
  /** @returns {boolean} */
  get cancelled() {
    return h(this, lt).signal.aborted;
  }
  /** @returns {AbortSignal} */
  get signal() {
    return h(this, lt).signal;
  }
  /** @returns {string} */
  get status() {
    return h(this, Xt) ? h(this, Xt).status : this.cancelled ? "cancelled" : "running";
  }
  /** Abort the timeline, triggering onCancel callbacks. */
  cancel(t = "cancelled") {
    h(this, lt).signal.aborted || h(this, lt).abort(t);
  }
  /**
   * Called internally by the execution engine when the timeline finishes.
   * @param {boolean} completed - true if all steps ran, false if cancelled
   */
  _resolve(t) {
    if (h(this, An)) return;
    v(this, An, !0);
    const n = typeof t == "boolean" ? { status: t ? "completed" : "cancelled" } : t ?? { status: "cancelled" };
    v(this, Xt, n), h(this, Sn).call(this, n.status === "completed"), h(this, On).call(this, n);
  }
};
lt = new WeakMap(), Sn = new WeakMap(), On = new WeakMap(), vn = new WeakMap(), Mn = new WeakMap(), An = new WeakMap(), Xt = new WeakMap(), s(Go, "TimelineHandle");
let So = Go;
const zt = /* @__PURE__ */ new Map();
function Ed(e, t) {
  const n = zt.get(e);
  n && !n.cancelled && n.cancel("replaced-by-name"), zt.set(e, t), t.finished.then(() => {
    zt.get(e) === t && zt.delete(e);
  });
}
s(Ed, "registerTimeline");
function tl(e) {
  const t = zt.get(e);
  return t && !t.cancelled ? (t.cancel("cancelled-by-name"), !0) : !1;
}
s(tl, "cancelTimeline");
function Cd(e) {
  return zt.get(e);
}
s(Cd, "getTimeline");
function Ld(e, t) {
  return e <= 0 ? Promise.resolve() : new Promise((n, i) => {
    if (t.aborted) return i(t.reason);
    const r = setTimeout(n, e);
    t.addEventListener("abort", () => {
      clearTimeout(r), i(t.reason);
    }, { once: !0 });
  });
}
s(Ld, "cancellableDelay");
var Re, ct, Nn, Dn;
const Wo = class Wo {
  constructor(t) {
    /** @type {TweenTimeline} */
    M(this, Re);
    /** @type {Array<{ type: string, params: object, opts?: object, detach: boolean }>} */
    M(this, ct, []);
    /** @type {Function|null} */
    M(this, Nn, null);
    /** @type {Function|null} */
    M(this, Dn, null);
    v(this, Re, t);
  }
  /**
   * Add a tween entry to this step.
   * @param {string} type  Registered tween type name
   * @param {object} params  Type-specific parameters
   * @param {object} [opts]  Options (durationMS, easing, etc.)
   * @returns {StepBuilder} this
   */
  add(t, n, i) {
    return h(this, ct).push({ type: t, params: n, opts: i ?? {}, detach: !1 }), this;
  }
  /**
   * Mark the last entry as fire-and-forget (does not block step progression).
   * @returns {StepBuilder} this
   */
  detach() {
    if (h(this, ct).length === 0)
      throw new Error("StepBuilder.detach(): no entry to detach.");
    return h(this, ct)[h(this, ct).length - 1].detach = !0, this;
  }
  /**
   * Callback invoked before this step's tweens start.
   * @param {Function} fn
   * @returns {StepBuilder} this
   */
  before(t) {
    return v(this, Nn, t), this;
  }
  /**
   * Callback invoked after this step's awaited tweens complete.
   * @param {Function} fn
   * @returns {StepBuilder} this
   */
  after(t) {
    return v(this, Dn, t), this;
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
      entries: h(this, ct),
      before: h(this, Nn),
      after: h(this, Dn)
    };
  }
};
Re = new WeakMap(), ct = new WeakMap(), Nn = new WeakMap(), Dn = new WeakMap(), s(Wo, "StepBuilder");
let Oo = Wo;
var Te, Se, Nt, ut, Fn, _n, xn, Rn, X, mn, nl, il, mi, Je, Ct;
const Ko = class Ko {
  constructor() {
    M(this, X);
    /** @type {string|null} */
    M(this, Te, null);
    /** @type {string} */
    M(this, Se, pe.ABORT);
    /** @type {Array<{ kind: "step", data: object } | { kind: "delay", ms: number }>} */
    M(this, Nt, []);
    /** @type {StepBuilder|null} */
    M(this, ut, null);
    /** @type {Function|null} */
    M(this, Fn, null);
    /** @type {Function|null} */
    M(this, _n, null);
    /** @type {Function|null} */
    M(this, xn, null);
    /** @type {Function|null} */
    M(this, Rn, null);
  }
  /**
   * Register this timeline in the named registry. Starting a new
   * timeline with the same name cancels the previous one.
   * @param {string} name
   * @returns {TweenTimeline} this
   */
  name(t) {
    return v(this, Te, t), this;
  }
  /**
   * Set the error policy for step execution.
   * @param {"abort"|"continue"} policy
   * @returns {TweenTimeline} this
   */
  errorPolicy(t) {
    if (t !== pe.ABORT && t !== pe.CONTINUE)
      throw new Error(`Invalid error policy: "${t}". Use "abort" or "continue".`);
    return v(this, Se, t), this;
  }
  /**
   * Start a new step. Finalizes the previous step if one is open.
   * @returns {StepBuilder}
   */
  step() {
    return L(this, X, mn).call(this), v(this, ut, new Oo(this)), h(this, ut);
  }
  /**
   * Insert a delay (in ms) between the previous step and the next.
   * @param {number} ms
   * @returns {TweenTimeline} this
   */
  delay(t) {
    return L(this, X, mn).call(this), h(this, Nt).push({ kind: "delay", ms: t }), this;
  }
  /**
   * Callback invoked before the first step runs.
   * @param {Function} fn
   * @returns {TweenTimeline} this
   */
  beforeAll(t) {
    return v(this, Fn, t), this;
  }
  /**
   * Callback invoked on successful completion.
   * @param {Function} fn
   * @returns {TweenTimeline} this
   */
  onComplete(t) {
    return v(this, _n, t), this;
  }
  /**
   * Callback invoked on cancellation (mutually exclusive with onComplete).
   * @param {Function} fn
   * @returns {TweenTimeline} this
   */
  onCancel(t) {
    return v(this, xn, t), this;
  }
  /**
   * Callback invoked on runtime failure (mutually exclusive with onComplete/onCancel).
   * @param {(outcome: object) => void} fn
   * @returns {TweenTimeline} this
   */
  onError(t) {
    return v(this, Rn, t), this;
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
    L(this, X, mn).call(this);
    const n = new AbortController();
    t.signal && (t.signal.aborted ? n.abort(t.signal.reason ?? "parent-aborted") : t.signal.addEventListener("abort", () => {
      n.signal.aborted || n.abort(t.signal.reason ?? "parent-aborted");
    }, { once: !0 }));
    const i = new So(n);
    h(this, Te) && Ed(h(this, Te), i);
    const r = t.broadcast ?? game.user.isGM, o = t.commit ?? game.user.isGM, a = t.startEpochMS ?? Date.now();
    return r && h(this, Te) && gi(Xs, {
      name: h(this, Te),
      data: this.toJSON(),
      startEpochMS: a
    }), L(this, X, nl).call(this, i, { commit: o, startEpochMS: a }).then((l) => {
      var c, u, d;
      i._resolve(l), l.status === cn.COMPLETED ? (c = h(this, _n)) == null || c.call(this) : l.status === cn.CANCELLED ? ((u = h(this, xn)) == null || u.call(this), r && h(this, Te) && gi(Lo, {
        name: h(this, Te),
        reason: l.reason
      })) : ((d = h(this, Rn)) == null || d.call(this, l), r && h(this, Te) && gi(Lo, {
        name: h(this, Te),
        reason: "failed"
      }));
    }), i;
  }
  /**
   * Serialize the timeline to a JSON-safe object (steps/delays only, no hooks).
   * @returns {object}
   */
  toJSON() {
    L(this, X, mn).call(this);
    const t = [];
    for (const i of h(this, Nt))
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
    return h(this, Te) && (n.name = h(this, Te)), h(this, Se) !== pe.ABORT && (n.errorPolicy = h(this, Se)), n;
  }
};
Te = new WeakMap(), Se = new WeakMap(), Nt = new WeakMap(), ut = new WeakMap(), Fn = new WeakMap(), _n = new WeakMap(), xn = new WeakMap(), Rn = new WeakMap(), X = new WeakSet(), // ── Private ─────────────────────────────────────────────────────────
mn = /* @__PURE__ */ s(function() {
  h(this, ut) && (h(this, Nt).push({ kind: "step", data: h(this, ut)._finalize() }), v(this, ut, null));
}, "#finalizeCurrentStep"), nl = /* @__PURE__ */ s(async function(t, { commit: n, startEpochMS: i }) {
  const r = t.signal, o = [];
  let a = -1;
  try {
    if (r.aborted) return L(this, X, Je).call(this, r.reason);
    const l = await L(this, X, mi).call(this, h(this, Fn), it.BEFORE_ALL, null);
    if (l) {
      if (h(this, Se) === pe.ABORT) return l;
      o.push(l);
    }
    let c = 0;
    const u = [];
    for (const d of h(this, Nt)) {
      if (r.aborted) return L(this, X, Je).call(this, r.reason);
      if (d.kind === "delay") {
        try {
          await Ld(d.ms, r);
        } catch {
          return L(this, X, Je).call(this, r.reason);
        }
        c += d.ms;
        continue;
      }
      a += 1;
      const { entries: g, before: m, after: y } = d.data, b = await L(this, X, mi).call(this, m, it.BEFORE_STEP, a);
      if (b) {
        if (h(this, Se) === pe.ABORT) return b;
        o.push(b);
        continue;
      }
      if (r.aborted) return L(this, X, Je).call(this, r.reason);
      const p = [];
      let E = 0;
      for (const I of g) {
        const D = hr(I.type);
        if (!D) {
          const Q = L(this, X, Ct).call(this, new Error(`TweenTimeline: unknown tween type "${I.type}"`), it.ENTRY, a, I.type);
          if (h(this, Se) === pe.ABORT) return Q;
          o.push(Q), console.warn(Q.error.message);
          continue;
        }
        const x = {
          ...I.opts,
          commit: n,
          startEpochMS: i + c,
          signal: r
        }, _ = x.durationMS ?? 2e3, q = Promise.resolve().then(() => D.execute(I.params, x)).then((Q) => Q === !1 ? {
          ok: !1,
          failure: L(this, X, Ct).call(this, new Error("Tween entry returned false."), it.ENTRY, a, I.type)
        } : { ok: !0 }).catch((Q) => ({
          ok: !1,
          failure: L(this, X, Ct).call(this, Q, it.ENTRY, a, I.type)
        }));
        I.detach ? u.push(q) : (p.push(q), E = Math.max(E, _));
      }
      const T = await L(this, X, il).call(this, p, r);
      if (T === null) return L(this, X, Je).call(this, r.reason);
      for (const I of T)
        if (!I.ok) {
          if (h(this, Se) === pe.ABORT) return I.failure;
          o.push(I.failure), console.warn("TweenTimeline: entry failed:", I.failure.error);
        }
      const C = await L(this, X, mi).call(this, y, it.AFTER_STEP, a);
      if (C) {
        if (h(this, Se) === pe.ABORT) return C;
        o.push(C);
      }
      if (r.aborted) return L(this, X, Je).call(this, r.reason);
      c += E;
    }
    if (!r.aborted) {
      const d = await Promise.allSettled(u);
      for (const g of d)
        if (g.status === "rejected") {
          const m = L(this, X, Ct).call(this, g.reason, it.ENTRY, a);
          if (h(this, Se) === pe.ABORT) return m;
          o.push(m);
        }
    }
    return r.aborted ? L(this, X, Je).call(this, r.reason) : {
      status: cn.COMPLETED,
      ...o.length > 0 ? { errors: o } : {}
    };
  } catch (l) {
    return r.aborted ? L(this, X, Je).call(this, r.reason) : (console.error("TweenTimeline execution error:", l), L(this, X, Ct).call(this, l, it.RUNTIME, a));
  }
}, "#execute"), /**
 * @param {Array<Promise<{ok: boolean, failure?: object}>>} stepPromises
 * @param {AbortSignal} signal
 * @returns {Promise<Array<{ok: boolean, failure?: object}>|null>}
 */
il = /* @__PURE__ */ s(function(t, n) {
  return t.length === 0 ? Promise.resolve([]) : n.aborted ? Promise.resolve(null) : new Promise((i, r) => {
    const o = /* @__PURE__ */ s(() => i(null), "onAbort");
    n.addEventListener("abort", o, { once: !0 }), Promise.all(t).then((a) => {
      n.removeEventListener("abort", o), i(a);
    }).catch((a) => {
      n.removeEventListener("abort", o), r(a);
    });
  });
}, "#waitForStep"), mi = /* @__PURE__ */ s(async function(t, n, i) {
  if (!t) return null;
  try {
    return await t(), null;
  } catch (r) {
    const o = L(this, X, Ct).call(this, r, n, i ?? void 0);
    return h(this, Se) === pe.CONTINUE && console.warn(`TweenTimeline: hook failure in ${n}:`, r), o;
  }
}, "#runHook"), /** @param {unknown} reason */
Je = /* @__PURE__ */ s(function(t) {
  let n;
  return typeof t == "string" ? n = t : t instanceof Error && (n = t.message), {
    status: cn.CANCELLED,
    ...n ? { reason: n } : {}
  };
}, "#cancelledOutcome"), /**
 * @param {unknown} err
 * @param {string} phase
 * @param {number} [stepIndex]
 * @param {string} [entryType]
 */
Ct = /* @__PURE__ */ s(function(t, n, i, r) {
  const o = t instanceof Error ? t : new Error(String(t));
  return {
    status: cn.FAILED,
    error: o,
    phase: n,
    ...typeof i == "number" ? { stepIndex: i } : {},
    ...r ? { entryType: r } : {}
  };
}, "#failedOutcome"), s(Ko, "TweenTimeline");
let Fi = Ko;
function Uo(e) {
  if (!e || typeof e != "object")
    throw new Error("Sequence JSON: data must be an object.");
  if (!Array.isArray(e.timeline))
    throw new Error("Sequence JSON: 'timeline' must be an array.");
  if (e.name != null && typeof e.name != "string")
    throw new Error("Sequence JSON: 'name' must be a string.");
  if (e.errorPolicy != null && e.errorPolicy !== pe.ABORT && e.errorPolicy !== pe.CONTINUE)
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
s(Uo, "validateSequenceJSON");
function rl(e) {
  Uo(e);
  for (let t = 0; t < e.timeline.length; t++) {
    const n = e.timeline[t];
    if (Array.isArray(n))
      for (let i = 0; i < n.length; i++) {
        const r = n[i];
        try {
          ld(r.type, r.params ?? {});
        } catch (o) {
          throw new Error(`Sequence JSON: timeline[${t}][${i}] failed semantic validation: ${o.message}`);
        }
      }
  }
}
s(rl, "validateSequenceSemantics");
function Vo(e, t = {}) {
  Uo(e), t.validateSemantics && rl(e);
  const n = new Fi();
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
s(Vo, "compileSequence");
function wd(e) {
  Uo(e), rl(e);
}
s(wd, "validate");
async function Id(e, t = {}) {
  return Vo(e, { validateSemantics: !0 }).run({
    broadcast: !1,
    commit: t.commit,
    startEpochMS: t.startEpochMS,
    signal: t.signal
  }).finished;
}
s(Id, "execute");
function Sd() {
  qo({ type: "sequence", execute: Id, validate: wd });
}
s(Sd, "registerSequenceTween");
async function Od(e, t, n = {}) {
  if (!game.user.isGM)
    return ui.notifications.warn("Only the GM can dispatch tweens."), !1;
  const i = hr(e);
  if (!i)
    throw new Error(`Unknown tween type: "${e}". Registered types: ${wo().join(", ")}`);
  i.validate(t);
  const { durationMS: r = 2e3, easing: o = "easeInOutCosine", commit: a = !0 } = n, l = Date.now();
  return gi(Qs, {
    type: e,
    params: t,
    durationMS: r,
    easing: o,
    startEpochMS: l,
    commit: !1
  }), i.execute(t, { durationMS: r, easing: o, commit: a, startEpochMS: l });
}
s(Od, "dispatchTween");
function vd(e) {
  const { type: t, params: n, durationMS: i, easing: r, startEpochMS: o, commit: a } = e ?? {}, l = hr(t);
  if (!l) {
    console.warn(`[${S}] Received unknown tween type over socket: "${t}"`);
    return;
  }
  l.execute(n, {
    durationMS: i,
    easing: r,
    commit: a ?? !1,
    startEpochMS: o
  });
}
s(vd, "handleTweenSocketMessage");
pd();
Td();
Sd();
Bo(Qs, vd);
Bo(Xs, Md);
Bo(Lo, Ad);
function Md(e) {
  const { data: t, startEpochMS: n } = e ?? {};
  if (!t) {
    console.warn(`[${S}] Received empty tween-sequence socket message.`);
    return;
  }
  try {
    Vo(t, { validateSemantics: !0 }).run({ commit: !1, startEpochMS: n, broadcast: !1 });
  } catch (i) {
    console.error(`[${S}] Failed to run received tween sequence:`, i);
  }
}
s(Md, "handleSequenceSocketMessage");
function Ad(e) {
  const { name: t } = e ?? {};
  t && tl(t);
}
s(Ad, "handleSequenceCancelMessage");
function Nd() {
  Hooks.once("ready", () => {
    sd();
    const e = game.modules.get(S);
    e.api || (e.api = {}), e.api.tween = {
      dispatch: Od,
      types: wo,
      Timeline: Fi,
      ErrorPolicy: pe,
      compileSequence: Vo,
      cancelTimeline: tl,
      getTimeline: Cd
    }, console.log(`[${S}] Tween API registered. Types: ${wo().join(", ")}`);
  });
}
s(Nd, "registerTweenHooks");
Nd();
//# sourceMappingURL=eidolon-utilities.js.map
