var Ls = Object.defineProperty;
var lu = Object.getPrototypeOf;
var cu = Reflect.get;
var Os = (e) => {
  throw TypeError(e);
};
var uu = (e, n, t) => n in e ? Ls(e, n, { enumerable: !0, configurable: !0, writable: !0, value: t }) : e[n] = t;
var l = (e, n) => Ls(e, "name", { value: n, configurable: !0 });
var Re = (e, n, t) => uu(e, typeof n != "symbol" ? n + "" : n, t), La = (e, n, t) => n.has(e) || Os("Cannot " + t);
var f = (e, n, t) => (La(e, n, "read from private field"), t ? t.call(e) : n.get(e)), O = (e, n, t) => n.has(e) ? Os("Cannot add the same private member more than once") : n instanceof WeakSet ? n.add(e) : n.set(e, t), S = (e, n, t, i) => (La(e, n, "write to private field"), i ? i.call(e, t) : n.set(e, t), t), w = (e, n, t) => (La(e, n, "access private method"), t);
var ti = (e, n, t, i) => ({
  set _(r) {
    S(e, n, r, t);
  },
  get _() {
    return f(e, n, i);
  }
}), ct = (e, n, t) => cu(lu(e), t, n);
const v = "eidolon-utilities", hr = "timeTriggerActive", Ba = "timeTriggerHideWindow", ja = "timeTriggerShowPlayerWindow", Ua = "timeTriggerAllowRealTime", cl = "timeTriggers", Qi = "timeTriggerHistory", Va = "debug", za = "timeFormat", Ga = "manageTime", Ja = "secondsPerRound";
const du = [-30, -15, -5, 5, 15, 30], xn = 1440 * 60, Xi = "playSound", $i = 6;
function p(e, n) {
  var t, i;
  return (i = (t = game.i18n) == null ? void 0 : t.has) != null && i.call(t, e) ? game.i18n.localize(e) : n;
}
l(p, "localize");
function yt(e) {
  return typeof e != "string" ? "" : e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
l(yt, "escapeHtml");
function wt(e) {
  var n;
  return e == null ? e : (n = foundry == null ? void 0 : foundry.utils) != null && n.duplicate ? foundry.utils.duplicate(e) : JSON.parse(JSON.stringify(e));
}
l(wt, "duplicateData");
function fu() {
  var e;
  return (e = foundry == null ? void 0 : foundry.utils) != null && e.randomID ? foundry.utils.randomID() : typeof (crypto == null ? void 0 : crypto.randomUUID) == "function" ? crypto.randomUUID() : Math.random().toString(36).slice(2, 10);
}
l(fu, "generateTriggerId");
function ul(e) {
  if (typeof e != "string") return null;
  const n = e.trim();
  if (!n) return null;
  const t = n.match(/^([0-9]{1,2}):([0-9]{2})(?::([0-9]{2}))?$/);
  if (!t) return null;
  const i = Number(t[1]), r = Number(t[2]), a = t[3] !== void 0 ? Number(t[3]) : 0;
  return !Number.isInteger(i) || !Number.isInteger(r) || !Number.isInteger(a) || i < 0 || i > 23 || r < 0 || r > 59 || a < 0 || a > 59 ? null : i * 3600 + r * 60 + a;
}
l(ul, "parseTriggerTimeToSeconds");
function ai() {
  var e, n;
  return ((e = game.scenes) == null ? void 0 : e.current) ?? ((n = game.scenes) == null ? void 0 : n.active) ?? null;
}
l(ai, "getActiveScene");
function Tt(e) {
  return (e == null ? void 0 : e.object) ?? (e == null ? void 0 : e.document) ?? null;
}
l(Tt, "getSceneFromApplication");
function Fe(e) {
  return e && typeof e.getFlag == "function" && typeof e.setFlag == "function";
}
l(Fe, "hasSceneDocument");
const Wa = /* @__PURE__ */ new Set(), Ka = /* @__PURE__ */ new Set(), Ya = /* @__PURE__ */ new Set(), Qa = /* @__PURE__ */ new Set();
let Cn = !1, fi = !1, pr = $i, yr = "12h", Is = !1;
function Oa(e) {
  Cn = !!e;
  for (const n of Wa)
    try {
      n(Cn);
    } catch (t) {
      console.error(`${v} | Debug change handler failed`, t);
    }
}
l(Oa, "notifyDebugChange");
function Ia(e) {
  fi = !!e;
  for (const n of Ka)
    try {
      n(fi);
    } catch (t) {
      console.error(`${v} | Manage time change handler failed`, t);
    }
}
l(Ia, "notifyManageTimeChange");
function dl(e) {
  return e === "24h" ? "24h" : "12h";
}
l(dl, "normalizeTimeFormatValue");
function Qo(e) {
  const n = Number(e);
  return !Number.isFinite(n) || n <= 0 ? $i : n;
}
l(Qo, "normalizeSecondsPerRoundValue");
function Aa(e) {
  const n = Qo(e);
  pr = n;
  for (const t of Ya)
    try {
      t(n);
    } catch (i) {
      console.error(`${v} | Seconds-per-round change handler failed`, i);
    }
}
l(Aa, "notifySecondsPerRoundChange");
function Na(e) {
  const n = dl(e);
  yr = n;
  for (const t of Qa)
    try {
      t(n);
    } catch (i) {
      console.error(`${v} | Time format change handler failed`, i);
    }
}
l(Na, "notifyTimeFormatChange");
function gu() {
  var n;
  if (Is) return;
  if (Is = !0, !((n = game == null ? void 0 : game.settings) != null && n.register)) {
    console.warn(
      `${v} | game.settings.register is unavailable. Module settings could not be registered.`
    );
    return;
  }
  const e = typeof game.settings.registerChange == "function";
  game.settings.register(v, Va, {
    name: p("EIDOLON.TimeTrigger.DebugSettingName", "Enable debug logging"),
    hint: p(
      "EIDOLON.TimeTrigger.DebugSettingHint",
      "Write detailed time-trigger diagnostics to the browser console."
    ),
    scope: "world",
    config: !0,
    type: Boolean,
    default: !1,
    onChange: e ? void 0 : Oa
  }), e && game.settings.registerChange(v, Va, Oa), Cn = Xo(), Oa(Cn), game.settings.register(v, Ga, {
    name: p("EIDOLON.TimeTrigger.ManageTimeSettingName", "Manage Game Time"),
    hint: p(
      "EIDOLON.TimeTrigger.ManageTimeSettingHint",
      "Allow Eidolon Utilities to advance world time automatically while the game is unpaused. Warning: This may conflict with other time-management modules."
    ),
    scope: "world",
    config: !0,
    type: Boolean,
    default: !1,
    onChange: e ? void 0 : Ia
  }), e && game.settings.registerChange(v, Ga, Ia), fi = hu(), Ia(fi), game.settings.register(v, Ja, {
    name: p(
      "EIDOLON.TimeTrigger.SecondsPerRoundSettingName",
      "Seconds Per Combat Round"
    ),
    hint: p(
      "EIDOLON.TimeTrigger.SecondsPerRoundSettingHint",
      "Amount of world seconds to add whenever a combat round ends while time management is active."
    ),
    scope: "world",
    config: !0,
    type: Number,
    default: $i,
    range: { min: 1, max: 3600, step: 1 },
    onChange: e ? void 0 : Aa
  }), e && game.settings.registerChange(
    v,
    Ja,
    Aa
  ), pr = Qo(pu()), Aa(pr), game.settings.register(v, za, {
    name: p("EIDOLON.TimeTrigger.TimeFormatSettingName", "Trigger Time Format"),
    hint: p(
      "EIDOLON.TimeTrigger.TimeFormatSettingHint",
      "Control whether trigger times use a 12-hour or 24-hour clock."
    ),
    scope: "world",
    config: !0,
    type: String,
    choices: {
      "12h": p(
        "EIDOLON.TimeTrigger.TimeFormatSettingChoice12Hour",
        "12-hour (e.g. 2:30 PM)"
      ),
      "24h": p(
        "EIDOLON.TimeTrigger.TimeFormatSettingChoice24Hour",
        "24-hour (e.g. 14:30)"
      )
    },
    default: "12h",
    onChange: e ? void 0 : Na
  }), e && game.settings.registerChange(v, za, Na), yr = dl(fl()), Na(yr);
}
l(gu, "registerTimeTriggerSettings");
function Xo() {
  var e;
  try {
    if ((e = game == null ? void 0 : game.settings) != null && e.get)
      return !!game.settings.get(v, Va);
  } catch (n) {
    console.error(`${v} | Failed to read debug setting`, n);
  }
  return !1;
}
l(Xo, "getDebugSetting");
function mu() {
  return Cn = Xo(), Cn;
}
l(mu, "refreshDebugSettingCache");
function hu() {
  var e;
  try {
    if ((e = game == null ? void 0 : game.settings) != null && e.get)
      return !!game.settings.get(v, Ga);
  } catch (n) {
    console.error(`${v} | Failed to read manage time setting`, n);
  }
  return !1;
}
l(hu, "getManageTimeSetting");
function fl() {
  var e;
  try {
    if ((e = game == null ? void 0 : game.settings) != null && e.get)
      return game.settings.get(v, za) === "24h" ? "24h" : "12h";
  } catch (n) {
    console.error(`${v} | Failed to read time format setting`, n);
  }
  return "12h";
}
l(fl, "getTimeFormatSetting");
function pu() {
  var e;
  try {
    if ((e = game == null ? void 0 : game.settings) != null && e.get) {
      const n = game.settings.get(v, Ja);
      return Qo(n);
    }
  } catch (n) {
    console.error(`${v} | Failed to read seconds-per-round setting`, n);
  }
  return $i;
}
l(pu, "getSecondsPerRoundSetting");
function yu(e) {
  if (typeof e != "function")
    return () => {
    };
  Wa.add(e);
  try {
    e(Cn);
  } catch (n) {
    console.error(`${v} | Debug change handler failed`, n);
  }
  return () => {
    Wa.delete(e);
  };
}
l(yu, "onDebugSettingChange");
function gl(e) {
  if (typeof e != "function")
    return () => {
    };
  Ka.add(e);
  try {
    e(fi);
  } catch (n) {
    console.error(`${v} | Manage time change handler failed`, n);
  }
  return () => {
    Ka.delete(e);
  };
}
l(gl, "onManageTimeSettingChange");
function Zo(e) {
  if (typeof e != "function")
    return () => {
    };
  Qa.add(e);
  try {
    e(yr);
  } catch (n) {
    console.error(`${v} | Time format change handler failed`, n);
  }
  return () => {
    Qa.delete(e);
  };
}
l(Zo, "onTimeFormatSettingChange");
function bu(e) {
  if (typeof e != "function")
    return () => {
    };
  Ya.add(e);
  try {
    e(pr);
  } catch (n) {
    console.error(`${v} | Seconds-per-round change handler failed`, n);
  }
  return () => {
    Ya.delete(e);
  };
}
l(bu, "onSecondsPerRoundSettingChange");
let da = !1, Xa = !1;
function Za(e) {
  da = !!e;
}
l(Za, "updateDebugState");
function ml() {
  Xa || (Xa = !0, Za(Xo()), yu((e) => {
    Za(e), console.info(`${v} | Debug ${da ? "enabled" : "disabled"}`);
  }));
}
l(ml, "ensureInitialized");
function es() {
  return Xa || ml(), da;
}
l(es, "shouldLog");
function hl(e) {
  if (!e.length)
    return [`${v} |`];
  const [n, ...t] = e;
  return typeof n == "string" ? [`${v} | ${n}`, ...t] : [`${v} |`, n, ...t];
}
l(hl, "formatArgs");
function wu() {
  ml();
}
l(wu, "initializeDebug");
function Tu() {
  return Za(mu()), da;
}
l(Tu, "syncDebugState");
function L(...e) {
  es() && console.debug(...hl(e));
}
l(L, "debugLog");
function Gn(...e) {
  es() && console.group(...hl(e));
}
l(Gn, "debugGroup");
function Wt() {
  es() && console.groupEnd();
}
l(Wt, "debugGroupEnd");
function Rn(e) {
  var r;
  const n = (r = e == null ? void 0 : e.getFlag) == null ? void 0 : r.call(e, v, cl);
  if (!n) return [];
  const t = wt(n), i = Array.isArray(t) ? t : [];
  return L("Loaded time triggers", {
    sceneId: (e == null ? void 0 : e.id) ?? null,
    count: i.length
  }), i;
}
l(Rn, "getTimeTriggers");
async function pl(e, n) {
  e != null && e.setFlag && (L("Persisting time triggers", {
    sceneId: e.id,
    count: Array.isArray(n) ? n.length : 0
  }), await e.setFlag(v, cl, n));
}
l(pl, "setTimeTriggers");
function Eu(e) {
  var r;
  const n = (r = e == null ? void 0 : e.getFlag) == null ? void 0 : r.call(e, v, Qi);
  if (!n) return {};
  const t = wt(n);
  if (!t || typeof t != "object") return {};
  const i = {};
  for (const [a, o] of Object.entries(t))
    typeof o == "number" && Number.isFinite(o) && (i[a] = o);
  return L("Loaded time trigger history", {
    sceneId: (e == null ? void 0 : e.id) ?? null,
    keys: Object.keys(i)
  }), i;
}
l(Eu, "getTimeTriggerHistory");
async function Ma(e, n) {
  var c, u, d, g;
  if (!e) return;
  const t = {};
  if (n && typeof n == "object")
    for (const [m, b] of Object.entries(n))
      typeof b == "number" && Number.isFinite(b) && (t[m] = b);
  const i = ((c = e.getFlag) == null ? void 0 : c.call(e, v, Qi)) ?? {}, r = {};
  if (i && typeof i == "object")
    for (const [m, b] of Object.entries(i))
      typeof b == "number" && Number.isFinite(b) && (r[m] = b);
  const a = Object.keys(t), o = Object.keys(r);
  if (typeof ((u = foundry == null ? void 0 : foundry.utils) == null ? void 0 : u.deepEqual) == "function" ? foundry.utils.deepEqual(r, t) : JSON.stringify(r) === JSON.stringify(t)) {
    L("Skip history update because state is unchanged", {
      sceneId: (e == null ? void 0 : e.id) ?? null
    });
    return;
  }
  L("Updating time trigger history", {
    sceneId: (e == null ? void 0 : e.id) ?? null,
    keys: a,
    removedKeys: o.filter((m) => !a.includes(m))
  });
  try {
    o.length && typeof e.unsetFlag == "function" && await e.unsetFlag(v, Qi), a.length && await e.setFlag(v, Qi, t);
  } catch (m) {
    console.error(`${v} | Failed to persist time trigger history`, m), (g = (d = ui.notifications) == null ? void 0 : d.error) == null || g.call(
      d,
      p(
        "EIDOLON.TimeTrigger.HistoryPersistError",
        "Failed to persist the scene's time trigger history."
      )
    );
  }
}
l(Ma, "updateTimeTriggerHistory");
const br = /* @__PURE__ */ new Map(), As = /* @__PURE__ */ new Set();
function vu(e) {
  if (!(e != null && e.id))
    throw new Error(`${v} | Action definitions require an id.`);
  if (br.has(e.id))
    throw new Error(`${v} | Duplicate time trigger action id: ${e.id}`);
  br.set(e.id, {
    ...e
  }), L("Registered time trigger action", { actionId: e.id });
}
l(vu, "registerAction");
function Di(e) {
  return br.get(e) ?? null;
}
l(Di, "getAction");
function Cu(e) {
  const n = Di(e);
  return n ? typeof n.label == "function" ? n.label() : n.label : e;
}
l(Cu, "getActionLabel");
function Ns() {
  return Array.from(br.values());
}
l(Ns, "listActions");
async function yl(e, n) {
  var i, r;
  const t = Di(n == null ? void 0 : n.action);
  if (!t || typeof t.execute != "function") {
    const a = p(
      "EIDOLON.TimeTrigger.UnknownAction",
      "Encountered an unknown time trigger action and skipped it."
    );
    (r = (i = ui.notifications) == null ? void 0 : i.warn) == null || r.call(i, a), console.warn(`${v} | Unknown time trigger action`, n), L("Encountered unknown time trigger action", {
      triggerId: (n == null ? void 0 : n.id) ?? null,
      actionId: (n == null ? void 0 : n.action) ?? null
    });
    return;
  }
  L("Executing action handler", {
    actionId: t.id,
    triggerId: (n == null ? void 0 : n.id) ?? null,
    sceneId: (e == null ? void 0 : e.id) ?? null
  }), await t.execute({ scene: e, trigger: n });
}
l(yl, "executeTriggerAction");
function Su(e) {
  const n = Di(e == null ? void 0 : e.action);
  return !n || typeof n.buildSummaryParts != "function" ? [] : n.buildSummaryParts({ trigger: e, escapeHtml: yt, localize: p }) ?? [];
}
l(Su, "buildActionSummaryParts");
function Lu(e) {
  const n = Di(e == null ? void 0 : e.action);
  return !n || typeof n.buildFormContent != "function" ? "" : n.buildFormContent({ trigger: e, escapeHtml: yt, localize: p }) ?? "";
}
l(Lu, "buildActionFormSection");
function Ou(e, n) {
  const t = Di(e == null ? void 0 : e.action);
  !t || typeof t.prepareFormData != "function" || t.prepareFormData({ trigger: e, formData: n });
}
l(Ou, "applyActionFormData");
function Iu(e, n, t) {
  var a, o;
  const i = `${(e == null ? void 0 : e.id) ?? "unknown"}:${(n == null ? void 0 : n.id) ?? (n == null ? void 0 : n.action) ?? "unknown"}:${t}`;
  if (As.has(i)) return;
  As.add(i);
  const r = p(
    "EIDOLON.TimeTrigger.MissingDataWarning",
    "A scene time trigger is missing required data and was skipped."
  );
  (o = (a = ui.notifications) == null ? void 0 : a.warn) == null || o.call(a, r), console.warn(`${v} | Missing trigger data (${t})`, { scene: e == null ? void 0 : e.id, trigger: n });
}
l(Iu, "warnMissingTriggerData");
async function Au({ scene: e, trigger: n }) {
  var a, o, s, c, u;
  const t = (s = (o = (a = n == null ? void 0 : n.data) == null ? void 0 : a.path) == null ? void 0 : o.trim) == null ? void 0 : s.call(o);
  if (!t) {
    Iu(e, n, "missing-audio-path");
    return;
  }
  const i = {
    src: t,
    autoplay: !0,
    loop: !1
  }, r = (() => {
    var d, g, m, b, h;
    return typeof ((g = (d = foundry == null ? void 0 : foundry.audio) == null ? void 0 : d.AudioHelper) == null ? void 0 : g.play) == "function" ? foundry.audio.AudioHelper.play(i, !0) : typeof ((b = (m = game == null ? void 0 : game.audio) == null ? void 0 : m.constructor) == null ? void 0 : b.play) == "function" ? game.audio.constructor.play(i, !0) : typeof ((h = game == null ? void 0 : game.audio) == null ? void 0 : h.play) == "function" ? game.audio.play(i, !0) : null;
  })();
  if (!r) {
    console.error(`${v} | Foundry audio helper is unavailable`), (u = (c = ui.notifications) == null ? void 0 : c.error) == null || u.call(
      c,
      p(
        "EIDOLON.TimeTrigger.AudioHelperUnavailable",
        "Unable to play audio for a time trigger because the Foundry audio helper is unavailable."
      )
    );
    return;
  }
  await r;
}
l(Au, "executePlaySoundAction");
vu({
  id: Xi,
  label: /* @__PURE__ */ l(() => p("EIDOLON.TimeTrigger.ActionPlaySound", "Play Sound"), "label"),
  execute: Au,
  buildSummaryParts: /* @__PURE__ */ l(({ trigger: e, escapeHtml: n, localize: t }) => {
    var r;
    return (r = e == null ? void 0 : e.data) != null && r.path ? [`${n(t("EIDOLON.TimeTrigger.TriggerSound", "Sound File"))}: ${n(e.data.path)}`] : [];
  }, "buildSummaryParts"),
  buildFormContent: /* @__PURE__ */ l(({ trigger: e, escapeHtml: n, localize: t }) => {
    var s;
    const i = n(t("EIDOLON.TimeTrigger.TriggerSound", "Sound File")), r = n(
      t("EIDOLON.TimeTrigger.TriggerChooseFile", "Select File")
    ), a = n(
      t(
        "EIDOLON.TimeTrigger.TriggerSoundNotes",
        "Select or upload the audio file that should play when this trigger fires."
      )
    ), o = n(((s = e == null ? void 0 : e.data) == null ? void 0 : s.path) ?? "");
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
  prepareFormData: /* @__PURE__ */ l(({ trigger: e, formData: n }) => {
    var t, i;
    e.data.path = ((i = (t = n.playSoundPath) == null ? void 0 : t.trim) == null ? void 0 : i.call(t)) ?? "";
  }, "prepareFormData")
});
var rl;
const { ApplicationV2: Wn, HandlebarsApplicationMixin: Kn } = ((rl = foundry.applications) == null ? void 0 : rl.api) ?? {};
if (!Wn || !Kn)
  throw new Error(
    `${v} | ApplicationV2 API unavailable. Update Foundry VTT to v13 or newer.`
  );
const Yt = "AM", Sn = "PM";
function Kt() {
  return fl();
}
l(Kt, "getConfiguredTimeFormat");
function fa(e) {
  if (typeof e != "string") return null;
  const n = e.trim();
  if (!n) return null;
  const t = n.match(/^([0-9]{1,2}):([0-9]{2})(?::([0-9]{2}))?$/);
  if (!t) return null;
  const i = Number(t[1]), r = Number(t[2]), a = t[3] !== void 0 ? Number(t[3]) : null;
  return !Number.isInteger(i) || !Number.isInteger(r) || i < 0 || i > 23 || r < 0 || r > 59 || a !== null && (!Number.isInteger(a) || a < 0 || a > 59) ? null : {
    hours: i,
    minutes: r,
    seconds: a
  };
}
l(fa, "parseCanonicalTimeString");
function bt({ hours: e, minutes: n, seconds: t }) {
  if (!Number.isInteger(e) || !Number.isInteger(n) || e < 0 || e > 23 || n < 0 || n > 59) return null;
  const i = String(e).padStart(2, "0"), r = String(n).padStart(2, "0");
  if (Number.isInteger(t)) {
    if (t < 0 || t > 59) return null;
    const a = String(t).padStart(2, "0");
    return `${i}:${r}:${a}`;
  }
  return `${i}:${r}`;
}
l(bt, "formatCanonicalTime");
function Nu(e, { format: n } = {}) {
  if (!e || typeof e != "object") return null;
  const t = Number(e.hour), i = Number(e.minute), r = e.second !== void 0 && e.second !== null, a = r ? Number(e.second) : null, o = r && Number.isFinite(a) ? Math.floor(Math.max(0, Math.min(59, a))) : null;
  if (!Number.isFinite(t) || !Number.isFinite(i)) return null;
  const s = n ?? Kt();
  return wr(
    {
      hours: t,
      minutes: i,
      seconds: o
    },
    s
  );
}
l(Nu, "formatTimeComponentsForDisplay");
function Mu(e, { format: n } = {}) {
  const t = fa(e);
  if (!t) return "";
  const i = n ?? Kt();
  return wr(t, i);
}
l(Mu, "formatTriggerTimeForDisplay");
function wr(e, n = "12h") {
  if (!e) return "";
  const { hours: t, minutes: i, seconds: r = null } = e;
  if (!Number.isInteger(t) || !Number.isInteger(i)) return "";
  const a = Number.isInteger(r);
  if (n === "24h") {
    const m = `${String(t).padStart(2, "0")}:${String(i).padStart(2, "0")}`;
    return a ? `${m}:${String(r).padStart(2, "0")}` : m;
  }
  const o = t >= 12 ? Sn : Yt, s = t % 12 === 0 ? 12 : t % 12, c = String(s), u = String(i).padStart(2, "0"), d = `${c}:${u}`, g = o === Yt ? p("EIDOLON.TimeTrigger.TimePeriodAM", Yt) : p("EIDOLON.TimeTrigger.TimePeriodPM", Sn);
  if (a) {
    const m = String(r).padStart(2, "0");
    return `${d}:${m} ${g}`;
  }
  return `${d} ${g}`;
}
l(wr, "formatTimeParts");
function Ms(e, n = Kt()) {
  const t = fa(e);
  if (n === "24h")
    return {
      format: n,
      canonical: t ? bt(t) ?? "" : "",
      hour: t ? String(t.hours).padStart(2, "0") : "",
      minute: t ? String(t.minutes).padStart(2, "0") : ""
    };
  if (!t)
    return {
      format: n,
      canonical: "",
      hour: "",
      minute: "",
      period: Yt
    };
  const i = t.hours >= 12 ? Sn : Yt, r = t.hours % 12 === 0 ? 12 : t.hours % 12;
  return {
    format: n,
    canonical: bt(t) ?? "",
    hour: String(r),
    minute: String(t.minutes).padStart(2, "0"),
    period: i
  };
}
l(Ms, "getTimeFormValues");
function ku({ hour: e, minute: n, period: t, time: i }, r = Kt()) {
  if (r === "24h") {
    const b = typeof e == "string" ? e.trim() : "", h = typeof n == "string" ? n.trim() : "", y = typeof i == "string" ? i.trim() : "";
    if (!b && !h && y) {
      const A = fa(y);
      return A ? { canonical: bt(A) ?? "", error: null } : {
        canonical: "",
        error: p(
          "EIDOLON.TimeTrigger.TimeFormatInvalid24",
          "Enter a valid time in HH:MM format."
        )
      };
    }
    if (!b || !h)
      return {
        canonical: "",
        error: p("EIDOLON.TimeTrigger.TimeFormatMissing", "Enter a complete time.")
      };
    const T = Number(b), E = Number(h);
    return !Number.isInteger(T) || T < 0 || T > 23 ? {
      canonical: "",
      error: p(
        "EIDOLON.TimeTrigger.TimeFormatInvalid24",
        "Enter a valid time in HH:MM format."
      )
    } : !Number.isInteger(E) || E < 0 || E > 59 ? {
      canonical: "",
      error: p(
        "EIDOLON.TimeTrigger.TimeFormatInvalid24",
        "Enter a valid time in HH:MM format."
      )
    } : { canonical: bt({
      hours: T,
      minutes: E
    }) ?? "", error: null };
  }
  const a = typeof e == "string" ? e.trim() : "", o = typeof n == "string" ? n.trim() : "", s = typeof t == "string" ? t.trim().toUpperCase() : "";
  if (!a || !o || !s)
    return { canonical: "", error: p("EIDOLON.TimeTrigger.TimeFormatMissing", "Enter a complete time.") };
  if (s !== Yt && s !== Sn)
    return { canonical: "", error: p("EIDOLON.TimeTrigger.TimeFormatInvalidPeriod", "Select AM or PM.") };
  const c = Number(a), u = Number(o);
  if (!Number.isInteger(c) || c < 1 || c > 12)
    return {
      canonical: "",
      error: p("EIDOLON.TimeTrigger.TimeFormatInvalidHour", "Hours must be between 1 and 12.")
    };
  if (!Number.isInteger(u) || u < 0 || u > 59)
    return {
      canonical: "",
      error: p("EIDOLON.TimeTrigger.TimeFormatInvalidMinute", "Minutes must be between 00 and 59.")
    };
  const d = c % 12, m = {
    hours: s === Sn ? d + 12 : d,
    minutes: u
  };
  return {
    canonical: bt(m) ?? "",
    error: null
  };
}
l(ku, "normalizeFormTimeInput");
function $u() {
  return [
    {
      value: Yt,
      label: p("EIDOLON.TimeTrigger.TimePeriodAM", Yt)
    },
    {
      value: Sn,
      label: p("EIDOLON.TimeTrigger.TimePeriodPM", Sn)
    }
  ];
}
l($u, "getPeriodOptions");
var cn, un, ae, bl, _r, xr, wl, to, no, Rr, Pr, Tl, El, vl, io, ro, ao, Hr, qr, oo, Br, Cl, Sl;
const on = class on extends Kn(Wn) {
  constructor(t = {}) {
    var o;
    const { scene: i, showControls: r, ...a } = t ?? {};
    super(a);
    O(this, ae);
    O(this, cn, null);
    O(this, un, null);
    O(this, _r, /* @__PURE__ */ l((t) => {
      var r, a;
      t.preventDefault();
      const i = Number((a = (r = t.currentTarget) == null ? void 0 : r.dataset) == null ? void 0 : a.delta);
      Number.isFinite(i) && (L("Time delta button clicked", { delta: i }), this._advanceTime(i));
    }, "#onDeltaClick"));
    O(this, xr, /* @__PURE__ */ l((t) => {
      var i, r;
      t.preventDefault(), !(!this.showControls || !((i = game.user) != null && i.isGM)) && (L("Time value double clicked", { sceneId: ((r = this.scene) == null ? void 0 : r.id) ?? null }), w(this, ae, wl).call(this));
    }, "#onTimeDoubleClick"));
    O(this, Rr, /* @__PURE__ */ l((t) => {
      if (this.isEditingTime && !this._commitTimeInProgress)
        if (t.key === "Enter") {
          t.preventDefault();
          const i = t.currentTarget, r = typeof (i == null ? void 0 : i.value) == "string" ? i.value : "";
          w(this, ae, no).call(this, r);
        } else t.key === "Escape" && (t.preventDefault(), w(this, ae, to).call(this));
    }, "#onTimeInputKeydown"));
    O(this, Pr, /* @__PURE__ */ l((t) => {
      if (!this.isEditingTime || this._commitTimeInProgress || this._suppressBlurCommit) return;
      const i = t.currentTarget, r = typeof (i == null ? void 0 : i.value) == "string" ? i.value : "";
      w(this, ae, no).call(this, r);
    }, "#onTimeInputBlur"));
    O(this, Hr, /* @__PURE__ */ l((t) => {
      const i = !!t;
      if (this.manageTimeEnabled === i) return;
      this.manageTimeEnabled = i, (this.rendered ?? this.isRendered ?? !1) && this.render({ force: !0 });
    }, "#handleManageTimeChange"));
    O(this, qr, /* @__PURE__ */ l(async (t) => {
      var a, o, s, c, u, d, g, m, b;
      if (t.preventDefault(), !this.showControls || !((a = game.user) != null && a.isGM)) return;
      if (!this.manageTimeEnabled) {
        (s = (o = ui.notifications) == null ? void 0 : o.error) == null || s.call(
          o,
          p(
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
          p(
            "EIDOLON.TimeTrigger.SceneUnavailable",
            "The active scene is unavailable. Try again after reloading the world."
          )
        );
        return;
      }
      const r = !this.sceneAllowsRealTime;
      try {
        await i.setFlag(v, Ua, r), this.sceneAllowsRealTime = r;
        const h = r ? p(
          "EIDOLON.TimeTrigger.SceneRealTimeEnabled",
          "Automatic real-time flow enabled for this scene."
        ) : p(
          "EIDOLON.TimeTrigger.SceneRealTimeDisabled",
          "Automatic real-time flow disabled for this scene."
        );
        (g = (d = ui.notifications) == null ? void 0 : d.info) == null || g.call(d, h);
      } catch (h) {
        console.error(`${v} | Failed to toggle scene real-time flow`, h), (b = (m = ui.notifications) == null ? void 0 : m.error) == null || b.call(
          m,
          p(
            "EIDOLON.TimeTrigger.SceneRealTimeToggleError",
            "Failed to update the scene's real-time flow setting."
          )
        );
      } finally {
        this.render({ force: !0 });
      }
    }, "#onRealTimeToggleClick"));
    O(this, Br, /* @__PURE__ */ l(() => {
      (this.rendered ?? this.isRendered ?? !1) && (this.isEditingTime && (this.editValue = w(this, ae, io).call(this)), this.render({ force: !0 }));
    }, "#handleTimeFormatChange"));
    this.scene = i ?? null, this.showControls = typeof r == "boolean" ? r : !!((o = game.user) != null && o.isGM), this.isEditingTime = !1, this.editValue = "", this._commitTimeInProgress = !1, this._suppressBlurCommit = !1, this.manageTimeEnabled = !1, this.sceneAllowsRealTime = w(this, ae, oo).call(this), S(this, cn, Zo(f(this, Br))), S(this, un, gl(f(this, Hr)));
  }
  async _prepareContext() {
    var E, C;
    const t = ((E = game.time) == null ? void 0 : E.components) ?? {}, r = ((t == null ? void 0 : t.second) !== void 0 && (t == null ? void 0 : t.second) !== null ? Nu(t) : null) ?? w(this, ae, bl).call(this), a = Kt(), o = a === "24h", s = o ? p("EIDOLON.TimeTrigger.EditTimePlaceholder24", "HH:MM") : p("EIDOLON.TimeTrigger.EditTimePlaceholder12", "HH:MM AM/PM"), c = this.showControls ? p(
      "EIDOLON.TimeTrigger.EditTimeHint",
      "Double-click to set a specific time."
    ) : "", u = this.showControls ? p(
      "EIDOLON.TimeTrigger.EditTimeLabel",
      "New time (HH:MM or HH:MM AM/PM)"
    ) : "", d = du.map((A) => ({
      minutes: A,
      label: A > 0 ? `+${A}` : `${A}`
    })), g = !!this.manageTimeEnabled, m = w(this, ae, oo).call(this);
    this.sceneAllowsRealTime = m;
    const b = p(
      "EIDOLON.TimeTrigger.SceneRealTimeEnable",
      "Enable automatic real-time flow for this scene."
    ), h = p(
      "EIDOLON.TimeTrigger.SceneRealTimeDisable",
      "Disable automatic real-time flow for this scene."
    ), y = p(
      "EIDOLON.TimeTrigger.SceneRealTimeManageDisabled",
      "Enable Manage Time in module settings to allow automatic real-time flow."
    );
    return {
      formattedTime: r,
      deltas: d,
      manageTimeEnabled: g,
      sceneAllowsRealTime: m,
      realTimeButtonLabel: g ? m ? h : b : y,
      isGM: ((C = game.user) == null ? void 0 : C.isGM) ?? !1,
      showControls: !!this.showControls,
      editHint: c,
      editLabel: u,
      editPlaceholder: s,
      timeFormat: a,
      is24Hour: o,
      isEditingTime: !!this.isEditingTime,
      editValue: this.isEditingTime ? this.editValue ?? "" : ""
    };
  }
  async close(t = {}) {
    var r, a;
    if (!t.force)
      return (this.rendered ?? this.isRendered ?? !1) || (L("TimeTriggerWindow close request rerendering", {
        sceneId: ((r = this.scene) == null ? void 0 : r.id) ?? null
      }), this.render({ force: !0 })), this;
    L("Closing time trigger window", { sceneId: ((a = this.scene) == null ? void 0 : a.id) ?? null, force: !0 });
    const i = await super.close(t);
    return w(this, ae, Cl).call(this), w(this, ae, Sl).call(this), i;
  }
  async _advanceTime(t) {
    var r, a, o, s, c, u, d;
    const i = t * 60;
    if (L("Advancing world time", { sceneId: ((r = this.scene) == null ? void 0 : r.id) ?? null, minutes: t, seconds: i }), !((a = game.user) != null && a.isGM)) {
      (s = (o = ui.notifications) == null ? void 0 : o.warn) == null || s.call(o, p("EIDOLON.TimeTrigger.GMOnly", "Only the GM can adjust time."));
      return;
    }
    try {
      await game.time.advance(i);
    } catch (g) {
      console.error(`${v} | Failed to advance time`, g), (u = (c = ui.notifications) == null ? void 0 : c.error) == null || u.call(
        c,
        p("EIDOLON.TimeTrigger.Error", "Failed to update the world time.")
      ), L("Failed to advance time from window", {
        sceneId: ((d = this.scene) == null ? void 0 : d.id) ?? null,
        minutes: t,
        message: (g == null ? void 0 : g.message) ?? String(g)
      });
    }
  }
  _onRender(t, i) {
    var a;
    super._onRender(t, i);
    const r = this.element;
    if (r) {
      if (this.showControls) {
        L("Binding time trigger interactions", {
          sceneId: ((a = this.scene) == null ? void 0 : a.id) ?? null,
          buttonCount: r.querySelectorAll("[data-delta]").length
        }), r.querySelectorAll("[data-delta]").forEach((u) => {
          u.addEventListener("click", f(this, _r));
        });
        const o = r.querySelector('.time-trigger-window__time-value[data-editable="true"]');
        o && o.addEventListener("dblclick", f(this, xr), { once: !1 });
        const s = r.querySelector(".time-trigger-window__time-input");
        s && (s.addEventListener("keydown", f(this, Rr)), s.addEventListener("blur", f(this, Pr)), typeof s.focus == "function" && (s.focus(), typeof s.select == "function" && s.select()));
        const c = r.querySelector('[data-action="toggle-real-time"]');
        c && c.addEventListener("click", f(this, qr));
      }
      this._suppressBlurCommit = !1;
    }
  }
};
cn = new WeakMap(), un = new WeakMap(), ae = new WeakSet(), bl = /* @__PURE__ */ l(function() {
  var c;
  const t = (c = game.time) == null ? void 0 : c.worldTime;
  if (typeof t != "number" || !Number.isFinite(t)) return "";
  const i = 1440 * 60, r = (Math.floor(t) % i + i) % i, a = Math.floor(r / 3600), o = Math.floor(r % 3600 / 60), s = r % 60;
  return wr({ hours: a, minutes: o, seconds: s }, Kt());
}, "#formatFallbackTime"), _r = new WeakMap(), xr = new WeakMap(), wl = /* @__PURE__ */ l(function() {
  var t;
  (t = game.user) != null && t.isGM && (this.isEditingTime = !0, this._suppressBlurCommit = !1, this.editValue = w(this, ae, io).call(this), this.render({ force: !0 }));
}, "#enterTimeEditMode"), to = /* @__PURE__ */ l(function() {
  this.isEditingTime = !1, this.editValue = "", this._suppressBlurCommit = !1, this.render({ force: !0 });
}, "#cancelTimeEdit"), no = /* @__PURE__ */ l(async function(t) {
  var a, o, s;
  if (!((a = game.user) != null && a.isGM) || !this.isEditingTime || this._commitTimeInProgress) return;
  this._commitTimeInProgress = !0;
  const i = typeof t == "string" ? t.trim() : "";
  if (!i) {
    w(this, ae, to).call(this), this._commitTimeInProgress = !1;
    return;
  }
  const r = w(this, ae, vl).call(this, i);
  if (r.error) {
    (s = (o = ui.notifications) == null ? void 0 : o.error) == null || s.call(o, r.error), this._suppressBlurCommit = !0, this.editValue = i, this.render({ force: !0 }), this._commitTimeInProgress = !1;
    return;
  }
  try {
    await w(this, ae, El).call(this, r.seconds, r.includeSeconds) ? (this.isEditingTime = !1, this.editValue = "", this.render({ force: !0 })) : (this.editValue = i, this.render({ force: !0 }));
  } finally {
    this._commitTimeInProgress = !1;
  }
}, "#commitTimeInput"), Rr = new WeakMap(), Pr = new WeakMap(), Tl = /* @__PURE__ */ l(function() {
  var u, d;
  const t = (u = game.time) == null ? void 0 : u.worldTime;
  if (typeof t != "number" || !Number.isFinite(t))
    return "";
  const i = ((d = game.time) == null ? void 0 : d.components) ?? {}, r = Number(i.hour), a = Number(i.minute), o = i.second !== void 0 ? Number(i.second) : null, s = Number.isInteger(o);
  return (Number.isFinite(r) && Number.isFinite(a) ? bt({
    hours: Math.max(0, Math.min(23, Number(r))),
    minutes: Math.max(0, Math.min(59, Number(a))),
    seconds: s && Number.isFinite(o) ? Math.max(0, Math.min(59, Number(o))) : void 0
  }) ?? "" : "") ?? "";
}, "#getCurrentCanonicalTime"), El = /* @__PURE__ */ l(async function(t, i) {
  var m, b, h, y, T, E, C, A, k, F;
  const r = (m = game.time) == null ? void 0 : m.worldTime;
  if (typeof r != "number" || !Number.isFinite(r))
    return (h = (b = ui.notifications) == null ? void 0 : b.error) == null || h.call(
      b,
      p(
        "EIDOLON.TimeTrigger.EditTimeUnavailable",
        "The world time is unavailable, so it can't be updated."
      )
    ), !1;
  if (!Number.isInteger(t) || t < 0 || t >= xn)
    return (T = (y = ui.notifications) == null ? void 0 : y.error) == null || T.call(
      y,
      p(
        "EIDOLON.TimeTrigger.EditTimeInvalidRange",
        "Enter a time within the current day."
      )
    ), !1;
  const s = Math.floor(r / xn) * xn + t - r;
  if (!Number.isFinite(s) || s === 0)
    return !0;
  const c = Math.floor(t / 3600), u = Math.floor(t % 3600 / 60), d = t % 60, g = bt({
    hours: c,
    minutes: u,
    seconds: i ? d : void 0
  });
  try {
    L("Updating world time directly", {
      sceneId: ((E = this.scene) == null ? void 0 : E.id) ?? null,
      targetCanonical: g ?? null,
      diff: s
    }), await game.time.advance(s);
    const D = wr(
      {
        hours: c,
        minutes: u,
        seconds: i ? d : null
      },
      Kt()
    );
    (A = (C = ui.notifications) == null ? void 0 : C.info) == null || A.call(
      C,
      p(
        "EIDOLON.TimeTrigger.EditTimeSuccess",
        "World time updated."
      ) + (D ? ` ${D}` : "")
    );
  } catch (D) {
    return console.error(`${v} | Failed to set world time`, D), (F = (k = ui.notifications) == null ? void 0 : k.error) == null || F.call(
      k,
      p(
        "EIDOLON.TimeTrigger.EditTimeError",
        "Failed to update the world time."
      )
    ), !1;
  }
  return !0;
}, "#applyTargetSeconds"), vl = /* @__PURE__ */ l(function(t) {
  var g;
  const i = p(
    "EIDOLON.TimeTrigger.EditTimeInvalid",
    "Enter a valid time like 14:30 or 2:30 PM."
  );
  if (typeof t != "string")
    return { error: i };
  const r = t.trim();
  if (!r)
    return { error: i };
  const a = r.match(/^([0-9]{1,2}):([0-9]{2})(?::([0-9]{2}))?$/);
  if (a) {
    const m = Number(a[1]), b = Number(a[2]), h = a[3] !== void 0 ? Number(a[3]) : void 0;
    if (Number.isInteger(m) && m >= 0 && m <= 23 && Number.isInteger(b) && b >= 0 && b <= 59 && (h === void 0 || Number.isInteger(h) && h >= 0 && h <= 59)) {
      const y = m * 3600 + b * 60 + (h ?? 0);
      return {
        canonical: bt({ hours: m, minutes: b, seconds: h }),
        seconds: y,
        includeSeconds: h !== void 0,
        error: null
      };
    }
    return { error: i };
  }
  const { amLower: o, pmLower: s, periodPattern: c } = w(this, ae, ro).call(this), u = r.match(
    new RegExp(
      `^([0-9]{1,2}):([0-9]{2})(?::([0-9]{2}))?\\s*(${c})$`,
      "i"
    )
  );
  if (u) {
    let m = Number(u[1]);
    const b = Number(u[2]), h = u[3] !== void 0 ? Number(u[3]) : void 0, y = u[4] ?? "", T = typeof y == "string" ? ((g = y.toLocaleLowerCase) == null ? void 0 : g.call(y)) ?? y.toLowerCase() : "";
    if (Number.isInteger(m) && m >= 1 && m <= 12 && Number.isInteger(b) && b >= 0 && b <= 59 && (h === void 0 || Number.isInteger(h) && h >= 0 && h <= 59) && (T === o || T === s || T === "am" || T === "pm")) {
      m = m % 12, (T === s || T === "pm") && (m += 12);
      const C = m * 3600 + b * 60 + (h ?? 0);
      return {
        canonical: bt({ hours: m, minutes: b, seconds: h }),
        seconds: C,
        includeSeconds: h !== void 0,
        error: null
      };
    }
    return { error: i };
  }
  const d = ul(r);
  if (d !== null) {
    const m = Math.floor(d / 3600), b = Math.floor(d % 3600 / 60), h = d % 60, y = h !== 0;
    return {
      canonical: bt({
        hours: m,
        minutes: b,
        seconds: y ? h : void 0
      }),
      seconds: d,
      includeSeconds: y,
      error: null
    };
  }
  return { error: i };
}, "#parseInputTime"), io = /* @__PURE__ */ l(function() {
  const t = w(this, ae, Tl).call(this);
  if (!t) return "";
  if (Kt() === "24h")
    return t;
  const r = fa(t);
  if (!r) return t;
  const a = Number(r.hours), o = Number(r.minutes), s = r.seconds !== null && r.seconds !== void 0 ? Number(r.seconds) : void 0;
  if (!Number.isFinite(a) || !Number.isFinite(o)) return t;
  const c = Number.isFinite(s), u = a % 12 === 0 ? 12 : a % 12, d = String(o).padStart(2, "0"), g = c ? `:${String(s).padStart(2, "0")}` : "", { amLabel: m, pmLabel: b } = w(this, ae, ro).call(this), h = a >= 12 ? b : m;
  return `${u}:${d}${g} ${h}`.trim();
}, "#getInitialEditValue"), ro = /* @__PURE__ */ l(function() {
  var u, d;
  const t = p("EIDOLON.TimeTrigger.TimePeriodAM", "AM"), i = p("EIDOLON.TimeTrigger.TimePeriodPM", "PM"), r = ((u = t.toLocaleLowerCase) == null ? void 0 : u.call(t)) ?? t.toLowerCase(), a = ((d = i.toLocaleLowerCase) == null ? void 0 : d.call(i)) ?? i.toLowerCase(), o = w(this, ae, ao).call(this, t), s = w(this, ae, ao).call(this, i), c = `${o}|${s}|AM|PM`;
  return {
    amLabel: t,
    pmLabel: i,
    amLower: r,
    pmLower: a,
    periodPattern: c
  };
}, "#getPeriodMatchData"), ao = /* @__PURE__ */ l(function(t) {
  return typeof t != "string" ? "" : t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}, "#escapeForRegex"), Hr = new WeakMap(), qr = new WeakMap(), oo = /* @__PURE__ */ l(function() {
  const t = this.scene;
  if (!t || typeof t.getFlag != "function") return !1;
  try {
    return !!t.getFlag(v, Ua);
  } catch (i) {
    L("TimeTriggerWindow | Failed to read scene real-time flag", {
      sceneId: (t == null ? void 0 : t.id) ?? null,
      message: (i == null ? void 0 : i.message) ?? String(i)
    });
  }
  return !1;
}, "#readSceneRealTimeFlag"), Br = new WeakMap(), Cl = /* @__PURE__ */ l(function() {
  if (typeof f(this, cn) == "function")
    try {
      f(this, cn).call(this);
    } catch (t) {
      console.error(`${v} | Failed to dispose time format subscription`, t);
    }
  S(this, cn, null);
}, "#disposeTimeFormatSubscription"), Sl = /* @__PURE__ */ l(function() {
  if (typeof f(this, un) == "function")
    try {
      f(this, un).call(this);
    } catch (t) {
      console.error(`${v} | Failed to dispose manage time subscription`, t);
    }
  S(this, un, null);
}, "#disposeManageTimeSubscription"), l(on, "TimeTriggerWindow"), Re(on, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  ct(on, on, "DEFAULT_OPTIONS"),
  {
    id: `${v}-time-trigger`,
    window: {
      title: p("EIDOLON.TimeTrigger.Title", "Time Trigger"),
      resizable: !1
    },
    position: {
      width: "auto",
      height: "auto"
    }
  },
  { inplace: !1 }
)), Re(on, "PARTS", {
  content: {
    template: `modules/${v}/templates/time-trigger.html`
  }
});
let eo = on;
function ga(e, n = {}) {
  if (typeof e != "function")
    throw new TypeError("createApplicationFactory requires a constructor function.");
  const t = /* @__PURE__ */ l(function(r = {}) {
    const a = foundry.utils.mergeObject(
      n ?? {},
      r ?? {},
      { inplace: !1 }
    );
    return new e(a);
  }, "applicationFactory");
  return t.__eidolonFactorySignature = "options", t.__eidolonFactoryTarget = e, t;
}
l(ga, "createApplicationFactory");
const ks = /* @__PURE__ */ new Set();
var be, Pe, dn, Jn, Ll, Ol;
const ys = class ys {
  constructor({ windowFactory: n } = {}) {
    O(this, Jn);
    O(this, be, null);
    O(this, Pe, null);
    O(this, dn);
    const t = ga(eo);
    typeof n == "function" ? n.__eidolonFactorySignature === "options" ? S(this, dn, (r, a = {}) => n({ scene: r, ...a ?? {} })) : S(this, dn, n) : S(this, dn, /* @__PURE__ */ l((r, a = {}) => t({ scene: r, ...a ?? {} }), "fallbackFactory"));
  }
  onReady() {
    var t;
    const n = typeof ((t = game.time) == null ? void 0 : t.worldTime) == "number" && Number.isFinite(game.time.worldTime) ? game.time.worldTime : null;
    L("TimeTriggerManager#onReady", { worldTime: n }), n !== null && S(this, Pe, n);
  }
  onCanvasReady(n) {
    const t = (n == null ? void 0 : n.scene) ?? ai();
    L("TimeTriggerManager#onCanvasReady", { sceneId: (t == null ? void 0 : t.id) ?? null }), this.refreshTimeTriggerWindow(t), this.handleTimeTriggerEvaluation(t);
  }
  onUpdateScene(n) {
    const t = ai();
    L("TimeTriggerManager#onUpdateScene", {
      sceneId: (n == null ? void 0 : n.id) ?? null,
      activeSceneId: (t == null ? void 0 : t.id) ?? null
    }), !(!t || n.id !== t.id) && (this.refreshTimeTriggerWindow(n), this.handleTimeTriggerEvaluation(n));
  }
  onUpdateWorldTime(n, t) {
    L("TimeTriggerManager#onUpdateWorldTime", {
      worldTime: n,
      diff: t,
      hasWindow: !!f(this, be)
    }), f(this, be) && f(this, be).render();
    const i = ai(), r = w(this, Jn, Ll).call(this, n, t);
    this.handleTimeTriggerEvaluation(i, n, r);
  }
  refreshTimeTriggerWindow(n) {
    var c, u, d;
    if (!n) return;
    const t = !!((c = game.user) != null && c.isGM), i = !!n.getFlag(v, hr), r = !!n.getFlag(v, Ba), a = !!n.getFlag(v, ja);
    if (L("TimeTriggerManager#refreshTimeTriggerWindow", {
      sceneId: n.id,
      isGM: t,
      isActive: i,
      hideWindow: r,
      showPlayerWindow: a
    }), !(i && !r && (t || a))) {
      f(this, be) && (L("Closing time trigger window", { reason: "not-visible" }), f(this, be).close({ force: !0 }), S(this, be, null));
      return;
    }
    const s = !!t;
    if (f(this, be) && ((u = f(this, be).scene) == null ? void 0 : u.id) === n.id) {
      L("Refreshing existing time trigger window", { sceneId: n.id }), f(this, be).showControls = s, f(this, be).render();
      return;
    }
    f(this, be) && (L("Closing existing window before creating new instance", {
      previousSceneId: ((d = f(this, be).scene) == null ? void 0 : d.id) ?? null
    }), f(this, be).close({ force: !0 })), S(this, be, f(this, dn).call(this, n, { showControls: s })), L("Rendering new time trigger window", { sceneId: n.id }), f(this, be).render({ force: !0 });
  }
  async handleTimeTriggerEvaluation(n, t, i) {
    var c;
    const r = n ?? ai();
    if (!r) {
      L("handleTimeTriggerEvaluation skipped", {
        reason: "no-active-scene",
        providedSceneId: (n == null ? void 0 : n.id) ?? null,
        currentWorldTime: t
      }), typeof t == "number" && Number.isFinite(t) && S(this, Pe, t);
      return;
    }
    const a = typeof t == "number" && Number.isFinite(t) ? t : typeof ((c = game.time) == null ? void 0 : c.worldTime) == "number" ? game.time.worldTime : null;
    if (a === null) return;
    const o = typeof i == "number" && Number.isFinite(i) ? i : null, s = o !== null ? o : typeof f(this, Pe) == "number" && Number.isFinite(f(this, Pe)) ? f(this, Pe) : a;
    Gn("handleTimeTriggerEvaluation", {
      sceneId: r.id,
      previousWorldTime: s,
      currentWorldTime: a,
      overrideProvided: o !== null
    });
    try {
      await w(this, Jn, Ol).call(this, r, s, a);
    } catch (u) {
      console.error(`${v} | Unexpected error while evaluating time triggers`, u), L("handleTimeTriggerEvaluation error", { message: (u == null ? void 0 : u.message) ?? String(u) });
    } finally {
      S(this, Pe, a), Wt();
    }
  }
};
be = new WeakMap(), Pe = new WeakMap(), dn = new WeakMap(), Jn = new WeakSet(), Ll = /* @__PURE__ */ l(function(n, t) {
  return typeof f(this, Pe) == "number" && Number.isFinite(f(this, Pe)) ? (L("Resolved previous world time from cache", {
    previousWorldTime: f(this, Pe)
  }), f(this, Pe)) : typeof n == "number" && Number.isFinite(n) && typeof t == "number" && Number.isFinite(t) ? (L("Resolved previous world time using diff", {
    worldTime: n,
    diff: t,
    resolved: n - t
  }), n - t) : typeof n == "number" && Number.isFinite(n) ? n : null;
}, "#resolvePreviousWorldTime"), Ol = /* @__PURE__ */ l(async function(n, t, i) {
  var h, y, T;
  if (!((h = game.user) != null && h.isGM)) {
    L("Skipping trigger evaluation because user is not a GM");
    return;
  }
  if (!(n != null && n.id)) {
    L("Skipping trigger evaluation because the scene is missing an id");
    return;
  }
  if (!!!n.getFlag(v, hr)) {
    L("Skipping trigger evaluation because scene is inactive", { sceneId: n.id });
    return;
  }
  if (typeof i != "number" || !Number.isFinite(i)) return;
  (typeof t != "number" || !Number.isFinite(t)) && (t = i);
  const a = Rn(n);
  if (!a.length) {
    L("No time triggers configured for scene", { sceneId: n.id });
    return;
  }
  const o = Eu(n), s = /* @__PURE__ */ new Set();
  for (const E of a)
    E != null && E.id && s.add(E.id);
  let c = !1;
  for (const E of Object.keys(o))
    s.has(E) || (delete o[E], c = !0);
  if (Gn("Evaluating scene time triggers", {
    sceneId: n.id,
    previousWorldTime: t,
    currentWorldTime: i,
    triggerCount: a.length
  }), i <= t) {
    L("Detected world time rewind", {
      previousWorldTime: t,
      currentWorldTime: i
    });
    for (const E of a) {
      if (!(E != null && E.id) || !E.allowReplayOnRewind) continue;
      const C = o[E.id];
      typeof C == "number" ? i < C ? (L("Clearing trigger history due to rewind", {
        triggerId: E.id,
        lastFired: C,
        currentWorldTime: i
      }), delete o[E.id], c = !0) : L("Preserving trigger history after rewind", {
        triggerId: E.id,
        lastFired: C,
        currentWorldTime: i
      }) : L("No history stored for rewind-enabled trigger", {
        triggerId: E.id
      });
    }
    c && (L("Persisting history cleanup after rewind", {
      sceneId: n.id
    }), await Ma(n, o)), Wt();
    return;
  }
  const u = t, d = i, g = [], m = Math.floor(u / xn), b = Math.floor(d / xn);
  for (const E of a) {
    if (!(E != null && E.id)) continue;
    const C = ul(E.time);
    if (C === null) {
      Du(n, E), L("Skipping trigger with invalid time", {
        triggerId: E.id,
        time: E.time
      });
      continue;
    }
    for (let A = m; A <= b; A++) {
      const k = A * xn + C;
      if (k < u || k > d) continue;
      const D = o[E.id];
      if (typeof D == "number" && D >= k) {
        L("Skipping trigger because it already fired within window", {
          triggerId: E.id,
          lastFired: D,
          absoluteTime: k
        });
        continue;
      }
      g.push({ trigger: E, absoluteTime: k });
    }
  }
  if (!g.length) {
    c && await Ma(n, o), L("No triggers scheduled to fire within evaluation window", {
      sceneId: n.id
    }), Wt();
    return;
  }
  g.sort((E, C) => E.absoluteTime - C.absoluteTime), L("Queued triggers for execution", {
    entries: g.map((E) => ({
      triggerId: E.trigger.id,
      absoluteTime: E.absoluteTime
    }))
  });
  for (const E of g)
    try {
      L("Executing time trigger action", {
        triggerId: E.trigger.id,
        absoluteTime: E.absoluteTime
      }), await yl(n, E.trigger);
    } catch (C) {
      console.error(`${v} | Failed to execute time trigger action`, C), (T = (y = ui.notifications) == null ? void 0 : y.error) == null || T.call(
        y,
        p(
          "EIDOLON.TimeTrigger.TriggerActionError",
          "Failed to execute a scene time trigger action. Check the console for details."
        )
      ), L("Trigger execution failed", {
        triggerId: E.trigger.id,
        message: (C == null ? void 0 : C.message) ?? String(C)
      });
    } finally {
      o[E.trigger.id] = E.absoluteTime, c = !0, L("Recorded trigger execution", {
        triggerId: E.trigger.id,
        absoluteTime: E.absoluteTime
      });
    }
  c && (L("Persisting trigger history updates", { sceneId: n.id }), await Ma(n, o)), Wt();
}, "#evaluateSceneTimeTriggers"), l(ys, "TimeTriggerManager");
let so = ys;
function Du(e, n) {
  var r, a;
  const t = `${(e == null ? void 0 : e.id) ?? "unknown"}:${(n == null ? void 0 : n.id) ?? (n == null ? void 0 : n.time) ?? "unknown"}`;
  if (ks.has(t)) return;
  ks.add(t);
  const i = p(
    "EIDOLON.TimeTrigger.InvalidTimeWarning",
    "A scene time trigger has an invalid time value and was skipped."
  );
  (a = (r = ui.notifications) == null ? void 0 : r.warn) == null || a.call(r, i), console.warn(`${v} | Invalid time for trigger`, { scene: e == null ? void 0 : e.id, trigger: n });
}
l(Du, "warnInvalidTriggerTime");
var nt, pi, it, jt, fn, gt, jn, jr, Ur, yi, bi, gn, mt, q, co, Mn, Zi, uo, er, fo, ut, Il, go, Al, mo, Nl, Vr, zr, Gr, Jr, Wr, Kr, ho, Ml, tr, Yr, Qr;
const bs = class bs {
  constructor() {
    O(this, q);
    O(this, nt, !1);
    O(this, pi, $i);
    O(this, it, /* @__PURE__ */ new Map());
    O(this, jt, null);
    O(this, fn, null);
    O(this, gt, 0);
    O(this, jn, null);
    O(this, jr, null);
    O(this, Ur, null);
    O(this, yi, !1);
    O(this, bi, !1);
    O(this, gn, !1);
    O(this, mt, !1);
    O(this, Vr, /* @__PURE__ */ l((n, t = {}) => {
      L("GameTimeAutomation | Pause state changed", {
        paused: n,
        userId: (t == null ? void 0 : t.userId) ?? null,
        broadcast: (t == null ? void 0 : t.broadcast) ?? null
      }), w(this, q, ut).call(this, { pausedOverride: n });
    }, "#handlePause"));
    O(this, zr, /* @__PURE__ */ l((n) => {
      n != null && n.id && (f(this, it).set(n.id, Math.max(n.round ?? 0, 1)), L("GameTimeAutomation | Combat started", { combatId: n.id, round: n.round ?? 0 }), w(this, q, ut).call(this));
    }, "#handleCombatStart"));
    O(this, Gr, /* @__PURE__ */ l((n, t) => {
      if (!(n != null && n.id)) return;
      const i = typeof t == "number" && Number.isFinite(t) ? t : typeof n.round == "number" && Number.isFinite(n.round) ? n.round : 0, r = i > 0 ? i : 1, a = f(this, it).get(n.id), o = a ? Math.max(a, 1) : 1, s = r > 1 ? Math.max(r - o, 0) : 0;
      if (L("GameTimeAutomation | Combat round change detected", {
        combatId: n.id,
        effectiveRound: r,
        completedRounds: s,
        enabled: f(this, nt),
        paused: (game == null ? void 0 : game.paused) ?? null
      }), s > 0 && f(this, nt) && f(this, mt) && !(game != null && game.paused) && w(this, q, Mn).call(this) && w(this, q, Zi).call(this, n)) {
        const c = s * f(this, pi);
        c > 0 && (L("GameTimeAutomation | Advancing time for completed combat rounds", {
          combatId: n.id,
          completedRounds: s,
          delta: c
        }), w(this, q, mo).call(this, c));
      }
      f(this, it).set(n.id, Math.max(r, 1));
    }, "#handleCombatRound"));
    O(this, Jr, /* @__PURE__ */ l((n) => {
      n != null && n.id && (f(this, it).delete(n.id), L("GameTimeAutomation | Combat ended", { combatId: n.id }), w(this, q, ut).call(this));
    }, "#handleCombatEnd"));
    O(this, Wr, /* @__PURE__ */ l((n) => {
      n != null && n.id && (f(this, it).delete(n.id), L("GameTimeAutomation | Combat deleted", { combatId: n.id }), w(this, q, ut).call(this));
    }, "#handleCombatDelete"));
    O(this, Kr, /* @__PURE__ */ l((n, t) => {
      if (n != null && n.id) {
        if (typeof (t == null ? void 0 : t.round) == "number" && Number.isFinite(t.round)) {
          const i = Math.max(t.round, 1);
          f(this, it).set(n.id, i), L("GameTimeAutomation | Combat round manually updated", {
            combatId: n.id,
            round: i
          });
        }
        (Object.prototype.hasOwnProperty.call(t ?? {}, "active") || (t == null ? void 0 : t.round) !== void 0) && w(this, q, ut).call(this);
      }
    }, "#handleCombatUpdate"));
    O(this, Yr, /* @__PURE__ */ l((n) => {
      w(this, q, tr).call(this, n == null ? void 0 : n.scene), w(this, q, ut).call(this);
    }, "#handleCanvasReady"));
    O(this, Qr, /* @__PURE__ */ l((n) => {
      if (!Fe(n)) return;
      const t = w(this, q, ho).call(this);
      if (!t || t.id !== n.id) return;
      w(this, q, tr).call(this, n) && w(this, q, ut).call(this);
    }, "#handleSceneUpdate"));
  }
  registerHooks() {
    f(this, yi) || (S(this, yi, !0), Hooks.on("pauseGame", f(this, Vr)), Hooks.on("combatStart", f(this, zr)), Hooks.on("combatRound", f(this, Gr)), Hooks.on("combatEnd", f(this, Jr)), Hooks.on("deleteCombat", f(this, Wr)), Hooks.on("updateCombat", f(this, Kr)), Hooks.on("canvasReady", f(this, Yr)), Hooks.on("updateScene", f(this, Qr)));
  }
  initialize() {
    f(this, bi) || (S(this, bi, !0), S(this, jr, gl((n) => {
      const t = !!n, i = t !== f(this, nt);
      S(this, nt, t), L("GameTimeAutomation | Manage time toggled", { enabled: t }), i && t && w(this, q, fo).call(this), w(this, q, ut).call(this);
    })), S(this, Ur, bu((n) => {
      S(this, pi, n), L("GameTimeAutomation | Seconds per round updated", { value: n });
    })), w(this, q, fo).call(this), w(this, q, tr).call(this), w(this, q, ut).call(this));
  }
};
nt = new WeakMap(), pi = new WeakMap(), it = new WeakMap(), jt = new WeakMap(), fn = new WeakMap(), gt = new WeakMap(), jn = new WeakMap(), jr = new WeakMap(), Ur = new WeakMap(), yi = new WeakMap(), bi = new WeakMap(), gn = new WeakMap(), mt = new WeakMap(), q = new WeakSet(), co = /* @__PURE__ */ l(function() {
  var n;
  try {
    if (typeof ((n = globalThis.performance) == null ? void 0 : n.now) == "function")
      return globalThis.performance.now();
  } catch (t) {
    L("GameTimeAutomation | Failed to read high-resolution timestamp", {
      message: (t == null ? void 0 : t.message) ?? String(t)
    });
  }
  return Date.now();
}, "#currentTimestamp"), Mn = /* @__PURE__ */ l(function() {
  var n;
  return !!((n = game == null ? void 0 : game.user) != null && n.isGM && game.user.active !== !1);
}, "#canControlTime"), Zi = /* @__PURE__ */ l(function(n) {
  var i, r;
  if (!n) return !1;
  if (n.active === !0) return !0;
  if (n.active === !1) return !1;
  const t = (i = game == null ? void 0 : game.combats) == null ? void 0 : i.active;
  return (t == null ? void 0 : t.id) === n.id ? !0 : ((r = game == null ? void 0 : game.combat) == null ? void 0 : r.id) === n.id ? game.combat.active ?? !0 : !1;
}, "#isCombatDocumentActive"), uo = /* @__PURE__ */ l(function(n) {
  return n ? typeof n.started == "boolean" ? n.started : (n.round ?? 0) > 0 : !1;
}, "#hasCombatStarted"), er = /* @__PURE__ */ l(function() {
  var i;
  const n = Array.isArray((i = game == null ? void 0 : game.combats) == null ? void 0 : i.contents) ? game.combats.contents : [];
  for (const r of n)
    if (w(this, q, Zi).call(this, r) && w(this, q, uo).call(this, r))
      return !0;
  const t = game == null ? void 0 : game.combat;
  return !!(t && w(this, q, Zi).call(this, t) && w(this, q, uo).call(this, t));
}, "#isCombatRunning"), fo = /* @__PURE__ */ l(function() {
  var t;
  f(this, it).clear();
  const n = Array.isArray((t = game == null ? void 0 : game.combats) == null ? void 0 : t.contents) ? game.combats.contents : [];
  for (const i of n)
    i != null && i.id && f(this, it).set(i.id, Math.max(i.round ?? 0, 1));
}, "#hydrateRoundTracking"), ut = /* @__PURE__ */ l(function({ pausedOverride: n } = {}) {
  const t = typeof n == "boolean" ? n : !!(game != null && game.paused), i = f(this, nt), r = f(this, mt), a = i && r, o = {
    manageTimeEnabled: i,
    sceneAllowsRealTime: r,
    effectiveEnabled: a,
    paused: t,
    canControl: w(this, q, Mn).call(this),
    combatRunning: w(this, q, er).call(this),
    overrideApplied: typeof n == "boolean"
  };
  if (L("GameTimeAutomation | Sync running state", o), !a || !w(this, q, Mn).call(this)) {
    w(this, q, go).call(this);
    return;
  }
  w(this, q, Il).call(this);
}, "#syncRunningState"), Il = /* @__PURE__ */ l(function() {
  f(this, jt) === null && (S(this, fn, w(this, q, co).call(this)), S(this, jt, globalThis.setInterval(() => w(this, q, Al).call(this), 1e3)), L("GameTimeAutomation | Started real-time ticker"));
}, "#startRealTimeTicker"), go = /* @__PURE__ */ l(function() {
  f(this, jt) !== null && (globalThis.clearInterval(f(this, jt)), S(this, jt, null), L("GameTimeAutomation | Stopped real-time ticker")), S(this, fn, null), S(this, gt, 0), S(this, gn, !1);
}, "#stopRealTimeTicker"), Al = /* @__PURE__ */ l(function() {
  if (!f(this, nt) || !f(this, mt) || !w(this, q, Mn).call(this)) {
    w(this, q, go).call(this);
    return;
  }
  const n = w(this, q, co).call(this);
  if (typeof n != "number" || !Number.isFinite(n)) return;
  const t = f(this, fn) ?? n, i = (n - t) / 1e3;
  if (S(this, fn, n), !Number.isFinite(i) || i <= 0) return;
  const r = !!(game != null && game.paused), a = w(this, q, er).call(this);
  if (r || a) {
    f(this, gn) || L("GameTimeAutomation | Tick skipped", { paused: r, combatRunning: a }), S(this, gn, !0), S(this, gt, 0);
    return;
  }
  S(this, gn, !1), L("GameTimeAutomation | Real-time tick", { deltaSeconds: i }), w(this, q, mo).call(this, i);
}, "#tickRealTime"), mo = /* @__PURE__ */ l(function(n) {
  if (!f(this, nt) || !f(this, mt)) return;
  const t = Number(n);
  !Number.isFinite(t) || t <= 0 || (S(this, gt, f(this, gt) + t), !f(this, jn) && S(this, jn, w(this, q, Nl).call(this)));
}, "#queueAdvance"), Nl = /* @__PURE__ */ l(async function() {
  var n, t;
  for (; f(this, gt) > 0; ) {
    if (!f(this, nt) || !f(this, mt) || game != null && game.paused || !w(this, q, Mn).call(this) || w(this, q, er).call(this)) {
      S(this, gt, 0);
      break;
    }
    const i = f(this, gt);
    S(this, gt, 0);
    try {
      if (typeof ((n = game == null ? void 0 : game.time) == null ? void 0 : n.advance) == "function")
        L("GameTimeAutomation | Advancing world time", { delta: i }), await game.time.advance(i), L("GameTimeAutomation | World time advanced", {
          worldTime: ((t = game.time) == null ? void 0 : t.worldTime) ?? null
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
  S(this, jn, null);
}, "#flushAdvanceQueue"), Vr = new WeakMap(), zr = new WeakMap(), Gr = new WeakMap(), Jr = new WeakMap(), Wr = new WeakMap(), Kr = new WeakMap(), ho = /* @__PURE__ */ l(function() {
  const n = ai();
  return Fe(n) ? n : null;
}, "#getActiveSceneDocument"), Ml = /* @__PURE__ */ l(function(n) {
  if (!Fe(n)) return !1;
  try {
    return !!n.getFlag(v, Ua);
  } catch (t) {
    return L("GameTimeAutomation | Failed to read scene real-time flag", {
      sceneId: (n == null ? void 0 : n.id) ?? null,
      message: (t == null ? void 0 : t.message) ?? String(t)
    }), !1;
  }
}, "#isSceneRealTimeAllowed"), tr = /* @__PURE__ */ l(function(n) {
  const t = Fe(n) ? n : w(this, q, ho).call(this), i = w(this, q, Ml).call(this, t), r = f(this, mt);
  return S(this, mt, i), r !== i ? (L("GameTimeAutomation | Scene real-time allowance changed", {
    sceneId: (t == null ? void 0 : t.id) ?? null,
    allows: i
  }), !0) : !1;
}, "#refreshSceneAutomationState"), Yr = new WeakMap(), Qr = new WeakMap(), l(bs, "GameTimeAutomation");
let lo = bs;
var al, Ut, Ne, mn, Nt, Xr, ye, kl, $l, Dl, Fl, Zr, yo, ea, _l, ta, xl, Rl;
const Ot = class Ot extends Kn(Wn) {
  constructor(t = {}) {
    const { scene: i, trigger: r, triggerIndex: a, onSave: o, ...s } = t ?? {};
    super(s);
    O(this, ye);
    O(this, Ut, null);
    O(this, Ne, null);
    O(this, mn, null);
    O(this, Nt, null);
    O(this, Xr, /* @__PURE__ */ l(() => {
      (this.rendered ?? this.isRendered ?? !1) && (S(this, Nt, w(this, ye, kl).call(this)), this.render({ force: !0 }));
    }, "#handleTimeFormatChange"));
    O(this, Zr, /* @__PURE__ */ l((t) => {
      var a, o;
      const i = t.currentTarget, r = i == null ? void 0 : i.closest("form");
      r && (L("Trigger action selection changed", {
        sceneId: ((a = this.scene) == null ? void 0 : a.id) ?? null,
        triggerId: ((o = this.trigger) == null ? void 0 : o.id) ?? null,
        actionId: (i == null ? void 0 : i.value) ?? null
      }), w(this, ye, yo).call(this, i.value, r));
    }, "#onActionSelectChange"));
    O(this, ea, /* @__PURE__ */ l((t) => {
      var u, d, g, m;
      t.preventDefault();
      const i = t.currentTarget, r = i == null ? void 0 : i.closest("form");
      if (!r) return;
      const a = (u = i.dataset) == null ? void 0 : u.target;
      if (!a) return;
      const o = typeof (CSS == null ? void 0 : CSS.escape) == "function" ? CSS.escape : (b) => b, s = r.querySelector(`[name="${o(a)}"]`);
      if (!s) return;
      L("Opening file picker for trigger", {
        sceneId: ((d = this.scene) == null ? void 0 : d.id) ?? null,
        triggerId: ((g = this.trigger) == null ? void 0 : g.id) ?? null,
        target: a
      }), new FilePicker({
        type: ((m = i.dataset) == null ? void 0 : m.type) || "audio",
        current: s.value,
        callback: /* @__PURE__ */ l((b) => {
          var h, y;
          s.value = b, s.dispatchEvent(new Event("change")), L("Trigger form file selected", {
            sceneId: ((h = this.scene) == null ? void 0 : h.id) ?? null,
            triggerId: ((y = this.trigger) == null ? void 0 : y.id) ?? null,
            target: a,
            path: b
          });
        }, "callback")
      }).render({ force: !0 });
    }, "#onFilePicker"));
    O(this, ta, /* @__PURE__ */ l(async (t) => {
      var r, a;
      t.preventDefault();
      const i = t.currentTarget;
      i instanceof HTMLFormElement && (L("Trigger form submitted", {
        sceneId: ((r = this.scene) == null ? void 0 : r.id) ?? null,
        triggerId: ((a = this.trigger) == null ? void 0 : a.id) ?? null
      }), await w(this, ye, xl).call(this, i));
    }, "#onSubmit"));
    this.scene = i ?? null, this.trigger = r ?? null, this.triggerIndex = Number.isInteger(a) ? Number(a) : null, this.onSave = typeof o == "function" ? o : null, S(this, mn, Zo(f(this, Xr)));
  }
  async _prepareContext() {
    var t, i;
    Gn("TriggerFormApplication#_prepareContext", {
      sceneId: ((t = this.scene) == null ? void 0 : t.id) ?? null,
      triggerId: ((i = this.trigger) == null ? void 0 : i.id) ?? null,
      triggerIndex: this.triggerIndex
    });
    try {
      const r = this.trigger ?? { action: Xi, data: {} }, a = r.action ?? Xi, o = Ms(r.time), s = o.format ?? "12h", c = s === "12h" ? $u() : [], u = o.period ?? (c.length > 0 ? c[0].value : null), d = s === "12h" ? c.map((b) => ({
        ...b,
        selected: b.value === u
      })) : [], g = Ns().map((b) => ({
        id: b.id,
        label: typeof b.label == "function" ? b.label() : b.label,
        selected: b.id === a
      })), m = Ns().map((b) => {
        const h = b.id === r.action ? r : { ...r, action: b.id }, y = Lu(h);
        return y ? {
          id: b.id,
          visible: b.id === a,
          content: y
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
        actions: g,
        actionSections: m,
        allowReplayOnRewind: !!r.allowReplayOnRewind,
        labels: {
          time: p("EIDOLON.TimeTrigger.TriggerTime", "Trigger Time"),
          hour: p("EIDOLON.TimeTrigger.TriggerTimeHour", "Hour"),
          minute: p("EIDOLON.TimeTrigger.TriggerTimeMinute", "Minute"),
          period: p("EIDOLON.TimeTrigger.TriggerTimePeriod", "AM / PM"),
          action: p("EIDOLON.TimeTrigger.TriggerAction", "Action"),
          allowReplayOnRewind: p(
            "EIDOLON.TimeTrigger.AllowReplayOnRewind",
            "Allow replay after rewinding time"
          ),
          allowReplayOnRewindHint: p(
            "EIDOLON.TimeTrigger.AllowReplayOnRewindHint",
            "When enabled, this trigger can fire again if world time moves backward."
          ),
          save: p("EIDOLON.TimeTrigger.TriggerSave", "Save Trigger")
        }
      };
    } finally {
      Wt();
    }
  }
  _onRender(t, i) {
    var c, u, d;
    super._onRender(t, i);
    const r = this.element;
    if (!r) return;
    L("Trigger form rendered", {
      sceneId: ((c = this.scene) == null ? void 0 : c.id) ?? null,
      triggerId: ((u = this.trigger) == null ? void 0 : u.id) ?? null
    });
    const a = Array.from(((d = document == null ? void 0 : document.body) == null ? void 0 : d.classList) ?? []).find(
      (g) => g.startsWith("theme-")
    );
    a && r.classList.add(a);
    const o = r.querySelector("form");
    if (!o) return;
    w(this, ye, _l).call(this, o), w(this, ye, $l).call(this, o), o.addEventListener("submit", f(this, ta));
    const s = o.querySelector("[data-action-select]");
    s && (s.addEventListener("change", f(this, Zr)), w(this, ye, yo).call(this, s.value, o)), o.querySelectorAll("[data-action-file-picker]").forEach((g) => {
      g.addEventListener("click", f(this, ea));
    });
  }
  async close(t = {}) {
    var i;
    if ((i = f(this, Ut)) == null || i.call(this), S(this, Ut, null), S(this, Ne, null), S(this, Nt, null), typeof f(this, mn) == "function")
      try {
        f(this, mn).call(this);
      } catch (r) {
        console.error(`${v} | Failed to dispose trigger form time format subscription`, r);
      }
    return S(this, mn, null), super.close(t);
  }
};
Ut = new WeakMap(), Ne = new WeakMap(), mn = new WeakMap(), Nt = new WeakMap(), Xr = new WeakMap(), ye = new WeakSet(), kl = /* @__PURE__ */ l(function() {
  var s, c, u, d, g, m, b;
  const t = (c = (s = this.element) == null ? void 0 : s.querySelector) == null ? void 0 : c.call(s, "form");
  if (!(t instanceof HTMLFormElement)) return null;
  const i = Array.from(t.elements ?? []), r = [];
  for (const h of i)
    if ((h instanceof HTMLInputElement || h instanceof HTMLSelectElement || h instanceof HTMLTextAreaElement) && h.name && !(((u = h.dataset) == null ? void 0 : u.timeHidden) !== void 0 || ((d = h.dataset) == null ? void 0 : d.timeHour) !== void 0 || ((g = h.dataset) == null ? void 0 : g.timeMinute) !== void 0 || ((m = h.dataset) == null ? void 0 : m.timePeriod) !== void 0)) {
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
          values: Array.from(h.selectedOptions ?? []).map((y) => y.value)
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
  const a = t.querySelector("[data-time-format]");
  let o = null;
  if (a instanceof HTMLElement) {
    const h = a.querySelector("[data-time-hidden]"), y = a.querySelector("[data-time-hour]"), T = a.querySelector("[data-time-minute]"), E = a.querySelector("[data-time-period]");
    o = {
      format: ((b = a.dataset) == null ? void 0 : b.timeFormat) ?? null,
      canonical: h instanceof HTMLInputElement ? h.value : "",
      hour: y instanceof HTMLInputElement ? y.value : "",
      minute: T instanceof HTMLInputElement ? T.value : "",
      period: E instanceof HTMLSelectElement ? E.value : ""
    };
  }
  return {
    fields: r,
    time: o
  };
}, "#captureFormState"), $l = /* @__PURE__ */ l(function(t) {
  if (!f(this, Nt)) return;
  if (!(t instanceof HTMLFormElement)) {
    S(this, Nt, null);
    return;
  }
  const { fields: i = [], time: r = null } = f(this, Nt) ?? {};
  S(this, Nt, null), w(this, ye, Dl).call(this, t, i), w(this, ye, Fl).call(this, t, r);
}, "#restorePendingFormState"), Dl = /* @__PURE__ */ l(function(t, i) {
  if (!Array.isArray(i) || i.length === 0) return;
  const r = typeof (CSS == null ? void 0 : CSS.escape) == "function" ? CSS.escape : (a) => a;
  for (const a of i) {
    if (!a || typeof a.name != "string") continue;
    const o = r(a.name);
    if (a.kind === "checkbox" || a.kind === "radio") {
      const c = `input[type="${a.kind}"][name="${o}"]`, u = t.querySelectorAll(c);
      u.forEach((d) => {
        d instanceof HTMLInputElement && (u.length === 1 || d.value === a.value) && (d.checked = !!a.checked);
      });
      continue;
    }
    if (a.kind === "select-multiple") {
      const c = t.querySelector(`select[name="${o}"]`);
      if (!(c instanceof HTMLSelectElement)) continue;
      const u = new Set(Array.isArray(a.values) ? a.values : []);
      Array.from(c.options ?? []).forEach((d) => {
        d.selected = u.has(d.value);
      });
      continue;
    }
    const s = t.querySelector(`[name="${o}"]`);
    (s instanceof HTMLInputElement || s instanceof HTMLSelectElement || s instanceof HTMLTextAreaElement) && (s.value = a.value ?? "");
  }
}, "#restoreFieldValues"), Fl = /* @__PURE__ */ l(function(t, i) {
  var C, A, k;
  const r = t.querySelector("[data-time-format]");
  if (!(r instanceof HTMLElement)) {
    typeof f(this, Ne) == "function" && f(this, Ne).call(this);
    return;
  }
  const a = ((C = r.dataset) == null ? void 0 : C.timeFormat) === "24h" ? "24h" : "12h", o = r.querySelector("[data-time-hour]"), s = r.querySelector("[data-time-minute]"), c = r.querySelector("[data-time-period]"), u = r.querySelector("[data-time-hidden]");
  if (!i) {
    if (o instanceof HTMLInputElement && (o.value = ""), s instanceof HTMLInputElement && (s.value = ""), c instanceof HTMLSelectElement) {
      const F = ((k = (A = c.options) == null ? void 0 : A[0]) == null ? void 0 : k.value) ?? "";
      c.value = F;
    }
    u instanceof HTMLInputElement && (u.value = ""), typeof f(this, Ne) == "function" && f(this, Ne).call(this);
    return;
  }
  const d = typeof i.canonical == "string" ? i.canonical : "", g = typeof i.period == "string" ? i.period : "", m = typeof i.hour == "string" ? i.hour : "", b = typeof i.minute == "string" ? i.minute : "";
  let h = "", y = "", T = g, E = d;
  if (d) {
    const F = Ms(d, a);
    h = F.hour ?? "", y = F.minute ?? "", E = F.canonical ?? d, a === "12h" ? T = F.period ?? g : T = "";
  } else
    h = m, y = b, a !== "12h" && (T = "");
  if (o instanceof HTMLInputElement && (o.value = h ?? ""), s instanceof HTMLInputElement && (s.value = y ?? ""), c instanceof HTMLSelectElement)
    if (a === "12h") {
      const F = Array.from(c.options ?? []);
      F.find((H) => H.value === T) ? c.value = T : F.length > 0 ? c.value = F[0].value : c.value = "";
    } else
      c.value = "";
  u instanceof HTMLInputElement && (u.value = E ?? ""), typeof f(this, Ne) == "function" && f(this, Ne).call(this);
}, "#restoreTimeInputs"), Zr = new WeakMap(), yo = /* @__PURE__ */ l(function(t, i) {
  i && i.querySelectorAll("[data-action-config]").forEach((r) => {
    const a = r.dataset.actionConfig === t;
    r.style.display = a ? "" : "none";
  });
}, "#updateActionSections"), ea = new WeakMap(), _l = /* @__PURE__ */ l(function(t) {
  var g, m, b, h;
  if ((g = f(this, Ut)) == null || g.call(this), S(this, Ut, null), S(this, Ne, null), !(t instanceof HTMLFormElement)) return;
  const i = t.querySelector("[data-time-format]"), r = ((m = i == null ? void 0 : i.dataset) == null ? void 0 : m.timeFormat) ?? null;
  if (r !== "12h" && r !== "24h")
    return;
  const a = i.querySelector("[data-time-hidden]"), o = i.querySelector("[data-time-hour]"), s = i.querySelector("[data-time-minute]"), c = r === "12h" ? i.querySelector("[data-time-period]") : null;
  if (!a || !o || !s || r === "12h" && !c) {
    L("Trigger form time inputs missing elements", {
      format: r,
      hasHidden: !!a,
      hasHour: !!o,
      hasMinute: !!s,
      hasPeriod: !!c
    });
    return;
  }
  const u = [o, s, ...c ? [c] : []], d = /* @__PURE__ */ l(() => {
    const { canonical: y, error: T } = ku(
      {
        hour: o.value,
        minute: s.value,
        period: (c == null ? void 0 : c.value) ?? null,
        time: a.value
      },
      r
    );
    a.value = y ?? "";
    const E = T ?? "";
    a.setCustomValidity(E), u.forEach((C) => {
      C.setCustomValidity(E);
    });
  }, "update");
  u.forEach((y) => {
    y.addEventListener("input", d), y.addEventListener("change", d);
  }), d(), S(this, Ut, () => {
    u.forEach((y) => {
      y.removeEventListener("input", d), y.removeEventListener("change", d);
    });
  }), S(this, Ne, d), L("Trigger form configured for time input", {
    format: r,
    sceneId: ((b = this.scene) == null ? void 0 : b.id) ?? null,
    triggerId: ((h = this.trigger) == null ? void 0 : h.id) ?? null
  });
}, "#setupTimeInput"), ta = new WeakMap(), xl = /* @__PURE__ */ l(async function(t) {
  var a, o, s, c, u;
  if (typeof f(this, Ne) == "function" && f(this, Ne).call(this), typeof t.checkValidity == "function" && !t.checkValidity()) {
    typeof t.reportValidity == "function" && t.reportValidity(), L("Trigger form submission blocked by validity check", {
      sceneId: ((a = this.scene) == null ? void 0 : a.id) ?? null,
      triggerId: ((o = this.trigger) == null ? void 0 : o.id) ?? null
    });
    return;
  }
  const i = new FormData(t), r = Object.fromEntries(i.entries());
  delete r.timeHour, delete r.timeMinute, delete r.timePeriod, r.allowReplayOnRewind = ((s = t.querySelector('input[name="allowReplayOnRewind"]')) == null ? void 0 : s.checked) ?? !1, L("Processing trigger form submission", {
    sceneId: ((c = this.scene) == null ? void 0 : c.id) ?? null,
    triggerId: ((u = this.trigger) == null ? void 0 : u.id) ?? null,
    allowReplayOnRewind: r.allowReplayOnRewind
  }), await w(this, ye, Rl).call(this, r), await this.close();
}, "#handleSubmit"), Rl = /* @__PURE__ */ l(async function(t) {
  var a, o, s, c, u, d;
  const i = {
    id: ((a = this.trigger) == null ? void 0 : a.id) ?? fu(),
    time: t.time ?? "",
    action: t.action ?? Xi,
    allowReplayOnRewind: !!t.allowReplayOnRewind,
    data: {}
  };
  L("Persisting trigger from form", {
    sceneId: ((o = this.scene) == null ? void 0 : o.id) ?? null,
    triggerId: i.id,
    existingIndex: this.triggerIndex
  }), Ou(i, t);
  const r = Rn(this.scene);
  this.triggerIndex !== null && r[this.triggerIndex] ? r[this.triggerIndex] = i : r.push(i);
  try {
    await pl(this.scene, r), L("Trigger list saved", {
      sceneId: ((s = this.scene) == null ? void 0 : s.id) ?? null,
      triggerCount: r.length
    });
  } catch (g) {
    throw console.error(`${v} | Failed to save time trigger`, g), (u = (c = ui.notifications) == null ? void 0 : c.error) == null || u.call(
      c,
      p(
        "EIDOLON.TimeTrigger.TriggerSaveError",
        "Failed to save the scene's time triggers."
      )
    ), g;
  }
  if (this.onSave)
    try {
      this.onSave(r);
    } catch (g) {
      console.error(`${v} | Trigger onSave callback failed`, g), L("Trigger onSave callback failed", {
        sceneId: ((d = this.scene) == null ? void 0 : d.id) ?? null,
        message: (g == null ? void 0 : g.message) ?? String(g)
      });
    }
}, "#persistTrigger"), l(Ot, "TriggerFormApplication"), Re(Ot, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  ct(Ot, Ot, "DEFAULT_OPTIONS"),
  {
    id: `${v}-trigger-form`,
    classes: Array.from(
      /* @__PURE__ */ new Set([...((al = ct(Ot, Ot, "DEFAULT_OPTIONS")) == null ? void 0 : al.classes) ?? [], "standard-form", "themed"])
    ),
    window: {
      title: p("EIDOLON.TimeTrigger.TriggerFormTitle", "Configure Time Trigger"),
      resizable: !1
    },
    position: {
      width: 400,
      height: "auto"
    }
  },
  { inplace: !1 }
)), Re(Ot, "PARTS", {
  content: {
    template: `modules/${v}/templates/time-trigger-form.html`
  }
});
let po = Ot;
function Dt(e) {
  return e instanceof HTMLElement ? e : (e == null ? void 0 : e[0]) instanceof HTMLElement ? e[0] : null;
}
l(Dt, "asHTMLElement");
function nr(e) {
  return typeof (e == null ? void 0 : e.changeTab) == "function";
}
l(nr, "isAppV2");
function Pl(e, n, t, i = {}) {
  if (nr(e)) {
    e.changeTab(n, t, i);
    return;
  }
  if (typeof (e == null ? void 0 : e.activateTab) == "function") {
    const r = { ...i };
    t != null && (r.group = t), r.triggerCallback == null && (r.triggerCallback = !0), e.activateTab(n, r);
  }
}
l(Pl, "setActiveTab");
function Fu(e) {
  var t, i;
  if (!(e instanceof HTMLFormElement)) return {};
  const n = ((i = (t = foundry == null ? void 0 : foundry.applications) == null ? void 0 : t.ux) == null ? void 0 : i.FormDataExtended) ?? globalThis.FormDataExtended ?? null;
  if (!n) return {};
  try {
    const r = new n(e), a = typeof r.object == "object" ? r.object : {};
    return foundry.utils.expandObject(a);
  } catch {
    return {};
  }
}
l(Fu, "readFormData");
const $s = Symbol.for("eidolon.sceneConfig.v13PatchedTabs");
function Hl(e = {}) {
  const {
    tabId: n,
    tabLabel: t,
    getScene: i,
    isApplicable: r,
    renderContent: a,
    debugNamespace: o = "SceneConfigTab",
    onButtonCreate: s,
    onTabCreate: c,
    onAfterRender: u,
    logger: d = {},
    moduleId: g = "eidolon-utilities",
    tabIcon: m = "fa-solid fa-puzzle-piece"
  } = e ?? {};
  if (!n)
    throw new Error("createSceneConfigTabFactory requires a tabId.");
  if (typeof a != "function")
    throw new TypeError("createSceneConfigTabFactory requires a renderContent callback.");
  const b = typeof d.log == "function" ? d.log.bind(d) : (..._) => {
    var G;
    return (G = console.debug) == null ? void 0 : G.call(console, `${o}`, ..._);
  }, h = typeof d.group == "function" ? d.group.bind(d) : (..._) => {
    var G;
    return (G = console.groupCollapsed) == null ? void 0 : G.call(console, `${o}`, ..._);
  }, y = typeof d.groupEnd == "function" ? d.groupEnd.bind(d) : () => {
    var _;
    return (_ = console.groupEnd) == null ? void 0 : _.call(console);
  }, T = Symbol(`EIDOLON_SCENE_CONFIG_TAB_CLEANUP_${n}`), E = typeof i == "function" ? i : () => null, C = typeof r == "function" ? r : () => !0, A = typeof t == "function" ? t : () => typeof t == "string" ? t : n;
  function k() {
    var W, j, V, I, M;
    const _ = ((j = (W = foundry == null ? void 0 : foundry.applications) == null ? void 0 : W.sheets) == null ? void 0 : j.SceneConfig) ?? ((V = CONFIG == null ? void 0 : CONFIG.Scene) == null ? void 0 : V.sheetClass);
    if (!_ || !nr({ changeTab: (I = _.prototype) == null ? void 0 : I.changeTab })) return;
    const G = _[$s] ?? /* @__PURE__ */ new Set();
    if (G.has(n)) return;
    G.add(n), _[$s] = G;
    const X = (M = _.TABS) == null ? void 0 : M.sheet;
    if (X && Array.isArray(X.tabs) && !X.tabs.some((x) => x.id === n)) {
      const x = A({ app: null, scene: null }) ?? n;
      X.tabs.push({
        id: n,
        icon: m,
        label: x
      });
    }
    _.PARTS && !_.PARTS[n] && (_.PARTS[n] = {
      template: `modules/${g}/templates/scene-config-tab-mount.hbs`,
      scrollable: [`.tab[data-tab="${n}"]`]
    }), b("Patched v13 SceneConfig TABS/PARTS", { tabId: n });
  }
  l(k, "patchV13SceneConfig");
  function F(_, G) {
    var W, j;
    const X = E(_);
    if (!C(_, X)) {
      b("Skipped render", {
        tabId: n,
        reason: "inapplicable",
        constructor: ((W = _ == null ? void 0 : _.constructor) == null ? void 0 : W.name) ?? null
      });
      return;
    }
    h("render", {
      tabId: n,
      sceneId: (X == null ? void 0 : X.id) ?? null,
      constructor: ((j = _ == null ? void 0 : _.constructor) == null ? void 0 : j.name) ?? null
    });
    try {
      const V = Dt(G) ?? Dt(_.element);
      if (!V) {
        b("Missing root element", { tabId: n });
        return;
      }
      nr(_) ? te(_, V, X) : H(_, V, X);
    } finally {
      y();
    }
  }
  l(F, "handleRender");
  function D(_, G, X) {
    var V;
    if (!m) {
      _.textContent = G;
      return;
    }
    const W = (V = _.querySelector("i")) == null ? void 0 : V.cloneNode(!0);
    _.textContent = "";
    const j = W ?? document.createElement("i");
    if (W || (j.className = m, X && (j.inert = !0)), _.append(j, " "), X) {
      const I = document.createElement("span");
      I.textContent = G, _.append(I);
    } else
      _.append(document.createTextNode(G));
  }
  l(D, "setButtonContent");
  function H(_, G, X) {
    var Ue, vt, _e, Ee, In, Ct, en, Ve, St, R, Pi, J, Xe, Ce, Qn, Hi;
    const j = [
      "nav.sheet-tabs[data-group]",
      "nav.tabs[data-group]",
      "nav.sheet-tabs",
      "nav.tabs"
    ].map((Se) => G.querySelector(Se)).find((Se) => Se instanceof HTMLElement), I = [
      (Ue = G.querySelector(".tab[data-tab]")) == null ? void 0 : Ue.parentElement,
      G.querySelector(".sheet-body"),
      (_e = (vt = j == null ? void 0 : j.parentElement) == null ? void 0 : vt.querySelector) == null ? void 0 : _e.call(vt, ":scope > .sheet-body"),
      j == null ? void 0 : j.parentElement
    ].find((Se) => Se instanceof HTMLElement), M = ((Ee = j == null ? void 0 : j.dataset) == null ? void 0 : Ee.group) ?? ((en = (Ct = (In = j == null ? void 0 : j.querySelector) == null ? void 0 : In.call(j, "a[data-group]")) == null ? void 0 : Ct.dataset) == null ? void 0 : en.group) ?? ((R = (St = (Ve = j == null ? void 0 : j.querySelector) == null ? void 0 : Ve.call(j, "[data-group]")) == null ? void 0 : St.dataset) == null ? void 0 : R.group) ?? ((Xe = (J = (Pi = I == null ? void 0 : I.querySelector) == null ? void 0 : Pi.call(I, ".tab[data-group]")) == null ? void 0 : J.dataset) == null ? void 0 : Xe.group) ?? "main";
    if (!j || !I) {
      b("Missing navigation elements", {
        tabId: n,
        hasNav: !!j,
        hasBody: !!I
      });
      return;
    }
    let x = j.querySelector(`[data-tab="${n}"]`);
    if (!x) {
      x = document.createElement("a"), x.dataset.action = "tab", x.dataset.group = M, x.dataset.tab = n;
      const Se = j.querySelector("a[data-tab]");
      (Ce = Se == null ? void 0 : Se.classList) != null && Ce.contains("item") && x.classList.add("item"), j.appendChild(x), typeof s == "function" && s({ app: _, button: x, nav: j, scene: X }), b("Created tab button", { tabId: n, group: M });
    }
    D(x, A({ app: _, scene: X }) ?? n, nr(_));
    let K = I.querySelector(`.tab[data-tab="${n}"]`);
    if (!K) {
      K = document.createElement("div"), K.classList.add("tab"), K.dataset.tab = n, K.dataset.group = M;
      const Se = _u(I);
      I.insertBefore(K, Se ?? null), typeof c == "function" && c({ app: _, tab: K, body: I, scene: X }), b("Created tab container", { tabId: n, group: M });
    }
    ((Qn = x.classList) == null ? void 0 : Qn.contains("active")) || K.classList.contains("active") ? (x.classList.add("active"), K.classList.add("active"), K.removeAttribute("hidden")) : (x.classList.remove("active"), K.classList.remove("active"), K.setAttribute("hidden", "true"));
    const Be = /* @__PURE__ */ l(() => {
      var tn, Xn;
      ((tn = x.classList) != null && tn.contains("active") || K.classList.contains("active")) && ((Xn = x.classList) == null || Xn.add("active"), K.classList.add("active"), K.removeAttribute("hidden"), K.removeAttribute("aria-hidden"), K.style.display === "none" && (K.style.display = ""));
    }, "ensureTabVisible"), ge = /* @__PURE__ */ l(() => {
      Be(), requestAnimationFrame(Be);
    }, "scheduleEnsureTabVisible");
    x.dataset.eidolonEnsureSceneTabVisibility || (x.addEventListener("click", () => {
      Pl(_, n, M), requestAnimationFrame(Be);
    }), x.dataset.eidolonEnsureSceneTabVisibility = "true"), ka(_, T, b);
    const je = a({
      app: _,
      scene: X,
      tab: K,
      tabButton: x,
      ensureTabVisible: Be,
      scheduleEnsureTabVisible: ge
    });
    typeof je == "function" && Ds(_, T, je), typeof u == "function" && u({
      app: _,
      scene: X,
      tab: K,
      tabButton: x,
      ensureTabVisible: Be,
      scheduleEnsureTabVisible: ge
    }), (Hi = _.setPosition) == null || Hi.call(_, { height: "auto" });
  }
  l(H, "handleRenderV1");
  function te(_, G, X) {
    const W = G.querySelector(`.tab[data-tab="${n}"]`), j = G.querySelector(`nav [data-tab="${n}"]`);
    if (!W || !j) {
      b("v2 mount not found, falling back to v1 injection", { tabId: n }), H(_, G, X);
      return;
    }
    D(j, A({ app: _, scene: X }) ?? n, !0);
    const V = /* @__PURE__ */ l(() => {
      var x;
      !((x = j.classList) != null && x.contains("active")) && !W.classList.contains("active") || (W.classList.add("active"), W.removeAttribute("hidden"), W.removeAttribute("aria-hidden"), W.style.display === "none" && (W.style.display = ""));
    }, "ensureTabVisible"), I = /* @__PURE__ */ l(() => {
      V(), requestAnimationFrame(V);
    }, "scheduleEnsureTabVisible");
    ka(_, T, b);
    const M = a({
      app: _,
      scene: X,
      tab: W,
      tabButton: j,
      ensureTabVisible: V,
      scheduleEnsureTabVisible: I
    });
    typeof M == "function" && Ds(_, T, M), typeof u == "function" && u({
      app: _,
      scene: X,
      tab: W,
      tabButton: j,
      ensureTabVisible: V,
      scheduleEnsureTabVisible: I
    });
  }
  l(te, "handleRenderV2");
  function ne(_) {
    ka(_, T, b);
  }
  l(ne, "handleClose");
  function U() {
    return Hooks.once("init", () => {
      k();
    }), Hooks.on("renderSceneConfig", F), Hooks.on("closeSceneConfig", ne), () => Q();
  }
  l(U, "register");
  function Q() {
    Hooks.off("renderSceneConfig", F), Hooks.off("closeSceneConfig", ne);
  }
  return l(Q, "unregister"), { register: U, unregister: Q };
}
l(Hl, "createSceneConfigTabFactory");
function Ds(e, n, t) {
  if (!e || typeof t != "function") return;
  const i = e == null ? void 0 : e[n];
  Array.isArray(i) || (e[n] = []), e[n].push(t);
}
l(Ds, "registerCleanup");
function ka(e, n, t) {
  if (!e) return;
  const i = e == null ? void 0 : e[n];
  if (Array.isArray(i))
    for (; i.length > 0; ) {
      const r = i.pop();
      if (typeof r == "function")
        try {
          r();
        } catch (a) {
          t("Cleanup failed", { message: (a == null ? void 0 : a.message) ?? String(a) });
        }
    }
}
l(ka, "invokeCleanup");
function _u(e) {
  if (!(e instanceof HTMLElement)) return null;
  const n = [
    ":scope > footer.sheet-footer",
    ":scope > footer.form-footer",
    ":scope > .sheet-footer",
    ":scope > .form-footer",
    ":scope > footer"
  ];
  for (const t of n) {
    const i = e.querySelector(t);
    if (i instanceof HTMLElement) return i;
  }
  return null;
}
l(_u, "findFooterElement$1");
const xu = ga(po), Ru = `modules/${v}/templates/time-trigger-scene-tab.html`, Pu = Hl({
  tabId: "time-triggers",
  tabLabel: /* @__PURE__ */ l(() => p("EIDOLON.TimeTrigger.Tab", "Time Triggers"), "tabLabel"),
  getScene: Tt,
  isApplicable: ju,
  renderContent: /* @__PURE__ */ l(({ app: e, scene: n, tab: t }) => qu(e, t, n), "renderContent"),
  logger: {
    log: L,
    group: Gn,
    groupEnd: Wt
  }
});
function Hu() {
  return L("Registering SceneConfig render hook"), Pu.register();
}
l(Hu, "registerSceneConfigHook");
function qu(e, n, t) {
  if (!(n instanceof HTMLElement)) return;
  const i = Fe(t) ? t : Tt(e);
  Tr(e, n, i);
  const r = Zo(() => {
    Tr(e, n, i);
  });
  return () => {
    if (typeof r == "function")
      try {
        r();
      } catch (a) {
        console.error(
          `${v} | Failed to dispose scene config time format subscription`,
          a
        );
      }
  };
}
l(qu, "renderTimeTriggerTab");
async function Tr(e, n, t) {
  var r, a;
  const i = t ?? Tt(e);
  Gn("renderTimeTriggersTabContent", { sceneId: (i == null ? void 0 : i.id) ?? null });
  try {
    if (!Fe(i)) {
      const W = p(
        "EIDOLON.TimeTrigger.Unavailable",
        "Time triggers are unavailable for this configuration sheet."
      );
      n.innerHTML = `<p class="notes">${W}</p>`, L("Scene lacks document for time triggers", { sceneId: (i == null ? void 0 : i.id) ?? null });
      return;
    }
    const o = `flags.${v}.${hr}`, s = `flags.${v}.${Ba}`, c = `flags.${v}.${ja}`, u = !!i.getFlag(v, hr), d = !!i.getFlag(v, Ba), g = !!i.getFlag(v, ja), m = Rn(i);
    L("Rendering time trigger list", {
      sceneId: i.id,
      isActive: u,
      shouldHideWindow: d,
      shouldShowPlayerWindow: g,
      triggerCount: m.length
    });
    const b = p("EIDOLON.TimeTrigger.Activate", "Activate Time Trigger"), h = p(
      "EIDOLON.TimeTrigger.Description",
      "Enable scene time triggers so scheduled actions can run automatically."
    ), y = p(
      "EIDOLON.TimeTrigger.HideWindowLabel",
      "Hide Floating Time Window"
    ), T = p(
      "EIDOLON.TimeTrigger.HideWindowDescription",
      "Keep the floating time control window hidden while leaving time triggers active."
    ), E = p(
      "EIDOLON.TimeTrigger.ShowPlayerWindowLabel",
      "Share Floating Time Window with Players"
    ), C = p(
      "EIDOLON.TimeTrigger.ShowPlayerWindowDescription",
      "Let non-GM players see the floating time window (without time controls)."
    ), A = p(
      "EIDOLON.TimeTrigger.TriggerListLabel",
      "Scene Time Triggers"
    ), k = p(
      "EIDOLON.TimeTrigger.TriggerListEmpty",
      "No time triggers configured for this scene."
    ), F = p("EIDOLON.TimeTrigger.AddTrigger", "Add Trigger"), D = p("EIDOLON.TimeTrigger.EditTrigger", "Edit"), H = p("EIDOLON.TimeTrigger.DeleteTrigger", "Remove"), te = p("EIDOLON.TimeTrigger.TriggerNow", "Trigger Now"), ne = p("EIDOLON.TimeTrigger.AtLabel", "At"), U = p("EIDOLON.TimeTrigger.DoLabel", "Do"), Q = p("EIDOLON.TimeTrigger.MissingTime", "(No time set)"), _ = m.map((W, j) => {
      const M = (W.time ? Mu(W.time) : "") || W.time || "" || Q, x = Cu(W.action), K = [
        `${ne} ${M}`,
        `${U} ${x}`,
        ...Su(W)
      ];
      return {
        index: j,
        summaryParts: K,
        tooltips: {
          triggerNow: te,
          edit: D,
          delete: H
        }
      };
    }), G = ((a = (r = foundry == null ? void 0 : foundry.applications) == null ? void 0 : r.handlebars) == null ? void 0 : a.renderTemplate) ?? (typeof renderTemplate == "function" ? renderTemplate : globalThis == null ? void 0 : globalThis.renderTemplate);
    if (typeof G != "function") {
      console.error(`${v} | renderTemplate is unavailable; cannot render scene tab.`), n.innerHTML = `<p class="notes">${k}</p>`;
      return;
    }
    let X = "";
    try {
      X = await G(Ru, {
        flags: {
          active: o,
          hideWindow: s,
          showPlayerWindow: c
        },
        states: {
          isActive: u,
          hideWindow: d,
          showPlayerWindow: g
        },
        labels: {
          activate: b,
          hideWindow: y,
          showPlayerWindow: E,
          triggerList: A,
          empty: k,
          add: F
        },
        hints: {
          activate: h,
          hideWindow: T,
          showPlayerWindow: C
        },
        triggers: _,
        hasTriggers: _.length > 0
      });
    } catch (W) {
      console.error(`${v} | Failed to render time trigger scene tab template`, W), n.innerHTML = `<p class="notes">${k}</p>`;
      return;
    }
    n.innerHTML = X, Bu(e, n, i);
  } finally {
    Wt();
  }
}
l(Tr, "renderTimeTriggersTabContent");
function Bu(e, n, t) {
  const i = t ?? Tt(e);
  if (!Fe(i)) return;
  const r = n.querySelector('[data-action="add-trigger"]');
  r && r.addEventListener("click", () => {
    L("Add trigger button clicked", { sceneId: i.id }), Fs(e, { scene: i });
  }), n.querySelectorAll('[data-action="edit-trigger"]').forEach((a) => {
    a.addEventListener("click", () => {
      const o = Number(a.dataset.index);
      if (!Number.isInteger(o)) return;
      const c = Rn(i)[o];
      c && (L("Edit trigger button clicked", { sceneId: i.id, triggerId: c.id, index: o }), Fs(e, { trigger: c, triggerIndex: o, scene: i }));
    });
  }), n.querySelectorAll('[data-action="delete-trigger"]').forEach((a) => {
    a.addEventListener("click", async () => {
      var u, d;
      const o = Number(a.dataset.index);
      if (!Number.isInteger(o)) return;
      const s = Rn(i), c = s[o];
      if (c) {
        s.splice(o, 1);
        try {
          L("Deleting trigger", {
            sceneId: i.id,
            index: o,
            triggerId: (c == null ? void 0 : c.id) ?? null
          }), await pl(i, s), await Tr(e, n, i);
        } catch (g) {
          console.error(`${v} | Failed to delete time trigger`, g), (d = (u = ui.notifications) == null ? void 0 : u.error) == null || d.call(
            u,
            p(
              "EIDOLON.TimeTrigger.TriggerDeleteError",
              "Failed to remove the selected time trigger."
            )
          );
        }
      }
    });
  }), n.querySelectorAll('[data-action="fire-trigger"]').forEach((a) => {
    a.addEventListener("click", async () => {
      var u, d, g, m, b, h, y;
      const o = Number(a.dataset.index);
      if (!Number.isInteger(o)) return;
      const c = Rn(i)[o];
      if (c) {
        if (!((u = game.user) != null && u.isGM)) {
          (g = (d = ui.notifications) == null ? void 0 : d.warn) == null || g.call(
            d,
            p("EIDOLON.TimeTrigger.GMOnly", "Only the GM can adjust time.")
          );
          return;
        }
        try {
          L("Manually firing trigger", { sceneId: i.id, triggerId: c.id, index: o }), await yl(i, c), (b = (m = ui.notifications) == null ? void 0 : m.info) == null || b.call(
            m,
            p(
              "EIDOLON.TimeTrigger.TriggerNowSuccess",
              "Triggered the selected time trigger."
            )
          );
        } catch (T) {
          console.error(`${v} | Failed to execute time trigger manually`, T), (y = (h = ui.notifications) == null ? void 0 : h.error) == null || y.call(
            h,
            p(
              "EIDOLON.TimeTrigger.TriggerNowError",
              "Failed to execute the selected time trigger."
            )
          ), L("Manual trigger execution failed", {
            sceneId: i.id,
            triggerId: c.id,
            index: o,
            message: (T == null ? void 0 : T.message) ?? String(T)
          });
        }
      }
    });
  });
}
l(Bu, "bindTimeTriggerTabEvents");
function Fs(e, n = {}) {
  var o;
  const t = n.scene ?? null, i = t && Fe(t) ? t : Tt(e);
  if (!Fe(i)) {
    console.warn(`${v} | Unable to open trigger form because no scene document is available.`);
    return;
  }
  L("Opening trigger form", {
    sceneId: i.id,
    triggerId: ((o = n.trigger) == null ? void 0 : o.id) ?? null,
    index: Number.isInteger(n.triggerIndex) ? Number(n.triggerIndex) : null
  }), xu({
    scene: i,
    trigger: n.trigger ?? null,
    triggerIndex: n.triggerIndex ?? null,
    onSave: /* @__PURE__ */ l(() => {
      var c, u;
      const s = (u = (c = e.element) == null ? void 0 : c[0]) == null ? void 0 : u.querySelector('.tab[data-tab="time-triggers"]');
      s && Tr(e, s, i);
    }, "onSave")
  }).render({ force: !0 });
}
l(Fs, "openTriggerForm");
function ju(e, n) {
  var a, o, s, c, u;
  if (!e) return !1;
  const t = ((o = (a = foundry == null ? void 0 : foundry.applications) == null ? void 0 : a.sheets) == null ? void 0 : o.SceneConfig) ?? (globalThis == null ? void 0 : globalThis.SceneConfig);
  if (t && e instanceof t) return !0;
  const i = (s = e == null ? void 0 : e.constructor) == null ? void 0 : s.name;
  if (typeof i == "string" && i.includes("SceneConfig")) return !0;
  if (n) {
    const d = globalThis == null ? void 0 : globalThis.Scene;
    if (d && n instanceof d || (n == null ? void 0 : n.documentName) === "Scene" || (n == null ? void 0 : n.documentName) === "scenes" || (n == null ? void 0 : n.collection) === "scenes") return !0;
  }
  const r = ((c = e == null ? void 0 : e.options) == null ? void 0 : c.baseApplication) ?? ((u = e == null ? void 0 : e.options) == null ? void 0 : u.id);
  return !!(typeof r == "string" && r.includes("SceneConfig"));
}
l(ju, "isRecognizedSceneConfig");
const Ui = new so(), _s = new lo();
function Uu() {
  L("Registering time trigger hooks"), Hooks.once("init", () => {
    gu(), wu(), L("Time trigger settings registered during init");
  }), Hu(), L("Scene config hook registered"), _s.registerHooks(), L("Time automation hooks registered"), Hooks.once("ready", () => {
    Tu(), L("Ready hook fired"), Ui.onReady(), _s.initialize();
  }), Hooks.on("canvasReady", (e) => {
    var n;
    L("canvasReady hook received", { scene: ((n = e == null ? void 0 : e.scene) == null ? void 0 : n.id) ?? null }), Ui.onCanvasReady(e);
  }), Hooks.on("updateScene", (e) => {
    L("updateScene hook received", { scene: (e == null ? void 0 : e.id) ?? null }), Ui.onUpdateScene(e);
  }), Hooks.on("updateWorldTime", (e, n) => {
    L("updateWorldTime hook received", { worldTime: e, diff: n }), Ui.onUpdateWorldTime(e, n);
  });
}
l(Uu, "registerTimeTriggerHooks");
Uu();
const we = v, ql = "criteria", ts = "state", Vu = "criteriaVersion", zu = 1, Bl = "enableCriteriaSurfaces";
let xs = !1;
function Gu() {
  var e;
  if (!xs) {
    if (xs = !0, !((e = game == null ? void 0 : game.settings) != null && e.register)) {
      console.warn(`${we} | game.settings.register unavailable; scene criteria setting skipped.`);
      return;
    }
    game.settings.register(we, Bl, {
      name: p("EIDOLON.SceneCriteria.EnableSurfacesSettingName", "Enable Criteria Editor Surfaces"),
      hint: p(
        "EIDOLON.SceneCriteria.EnableSurfacesSettingHint",
        "Show criteria authoring surfaces (Scene > Criteria tab and tile/light editor controls). The Criteria Switcher remains available."
      ),
      scope: "world",
      config: !0,
      type: Boolean,
      default: !0,
      onChange: /* @__PURE__ */ l(() => {
        Ju();
      }, "onChange")
    });
  }
}
l(Gu, "registerSceneCriteriaSettings");
function ma() {
  var e;
  try {
    if ((e = game == null ? void 0 : game.settings) != null && e.get)
      return !!game.settings.get(we, Bl);
  } catch (n) {
    console.error(`${we} | Failed to read criteria surfaces setting`, n);
  }
  return !0;
}
l(ma, "getCriteriaSurfacesEnabled");
function Ju() {
  var a, o, s, c, u;
  const e = p("EIDOLON.SceneCriteria.ReloadPromptTitle", "Reload Required"), n = `<p>${p(
    "EIDOLON.SceneCriteria.ReloadPromptBody",
    "Changes to criteria editor surfaces require a reload. Reload now?"
  )}</p>`, t = typeof ((a = foundry == null ? void 0 : foundry.utils) == null ? void 0 : a.debouncedReload) == "function", i = /* @__PURE__ */ l(() => {
    t ? foundry.utils.debouncedReload() : window.location.reload();
  }, "reload"), r = (s = (o = foundry == null ? void 0 : foundry.applications) == null ? void 0 : o.api) == null ? void 0 : s.DialogV2;
  if (typeof (r == null ? void 0 : r.confirm) == "function") {
    r.confirm({
      window: { title: e },
      content: n
    }).then((d) => {
      d && i();
    });
    return;
  }
  if (typeof (Dialog == null ? void 0 : Dialog.confirm) == "function") {
    Dialog.confirm({
      title: e,
      content: n,
      yes: /* @__PURE__ */ l(() => i(), "yes"),
      no: /* @__PURE__ */ l(() => {
      }, "no")
    });
    return;
  }
  (u = (c = ui.notifications) == null ? void 0 : c.info) == null || u.call(
    c,
    p(
      "EIDOLON.SceneCriteria.ReloadNotice",
      "Please reload the world to apply criteria editor surface changes."
    )
  );
}
l(Ju, "promptReloadForCriteriaSurfaces");
const Er = "Standard";
function Qe(e) {
  var t;
  const n = (t = e == null ? void 0 : e.getFlag) == null ? void 0 : t.call(e, we, ql);
  return n ? jl(n) : [];
}
l(Qe, "getSceneCriteria");
async function ha(e, n) {
  if (!(e != null && e.setFlag)) return;
  const t = jl(n);
  await e.setFlag(we, ql, t), await e.setFlag(we, Vu, zu);
  const i = Fi(e, t);
  await e.setFlag(we, ts, i);
}
l(ha, "setSceneCriteria");
function Fi(e, n = null) {
  var r;
  const t = Array.isArray(n) ? n : Qe(e), i = wt(((r = e == null ? void 0 : e.getFlag) == null ? void 0 : r.call(e, we, ts)) ?? {});
  return is(i, t);
}
l(Fi, "getSceneCriteriaState");
async function Wu(e, n, t = null) {
  if (!(e != null && e.setFlag)) return;
  const i = Array.isArray(t) ? t : Qe(e), r = is(n, i);
  await e.setFlag(we, ts, r);
}
l(Wu, "setSceneCriteriaState");
function ns(e = "") {
  const n = typeof e == "string" ? e.trim() : "", t = Ul(wo(n || "criterion"), /* @__PURE__ */ new Set());
  return {
    id: Vl(),
    key: t,
    label: n,
    values: [Er],
    default: Er,
    order: 0
  };
}
l(ns, "createSceneCriterion");
function jl(e) {
  const n = Array.isArray(e) ? wt(e) : [], t = [], i = /* @__PURE__ */ new Set();
  return n.forEach((r, a) => {
    const o = bo(r, a, i);
    o && (t.push(o), i.add(o.key));
  }), t;
}
l(jl, "sanitizeCriteria$1");
function bo(e, n = 0, t = /* @__PURE__ */ new Set()) {
  if (!e || typeof e != "object") return null;
  const i = typeof e.id == "string" && e.id.trim() ? e.id.trim() : Vl(), a = (typeof e.label == "string" ? e.label : typeof e.name == "string" ? e.name : "").trim(), o = typeof e.key == "string" && e.key.trim() ? wo(e.key) : wo(a || `criterion-${Number(n) + 1}`), s = Ul(o, t), c = Yu(e.values);
  let u = typeof e.default == "string" ? e.default.trim() : "";
  u || (u = c[0] ?? Er), c.includes(u) || c.unshift(u);
  const d = Number.isFinite(e.order) ? Number(e.order) : Number(n);
  return {
    id: i,
    key: s,
    label: a,
    values: c,
    default: u,
    order: d
  };
}
l(bo, "sanitizeCriterion");
function is(e, n = []) {
  const t = e && typeof e == "object" ? wt(e) : {}, i = {};
  for (const r of n) {
    const a = t == null ? void 0 : t[r.key], o = typeof a == "string" ? a.trim() : "";
    o && r.values.includes(o) ? i[r.key] = o : i[r.key] = r.default;
  }
  return i;
}
l(is, "sanitizeSceneCriteriaState");
function Ku(e) {
  return Qe(e).map((t) => ({
    id: t.key,
    key: t.key,
    name: t.label,
    values: [...t.values]
  }));
}
l(Ku, "getSceneCriteriaCategories");
function Yu(e) {
  const n = Array.isArray(e) ? e : [], t = [];
  for (const i of n) {
    if (typeof i != "string") continue;
    const r = i.trim();
    !r || t.includes(r) || t.push(r);
  }
  return t.length || t.push(Er), t;
}
l(Yu, "sanitizeCriterionValues");
function wo(e) {
  return String(e ?? "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "criterion";
}
l(wo, "slugifyCriterionKey");
function Ul(e, n) {
  if (!n.has(e)) return e;
  let t = 2;
  for (; n.has(`${e}-${t}`); )
    t += 1;
  return `${e}-${t}`;
}
l(Ul, "ensureUniqueCriterionKey");
function Vl() {
  var e;
  return (e = foundry == null ? void 0 : foundry.utils) != null && e.randomID ? foundry.utils.randomID() : typeof (crypto == null ? void 0 : crypto.randomUUID) == "function" ? crypto.randomUUID() : Math.random().toString(36).slice(2, 11);
}
l(Vl, "generateCriterionId");
function zl(e) {
  var n, t;
  console.error(`${we} | Failed to persist scene criteria`, e), (t = (n = ui.notifications) == null ? void 0 : n.error) == null || t.call(
    n,
    p(
      "EIDOLON.SceneCriteria.PersistError",
      "Failed to persist the scene criteria."
    )
  );
}
l(zl, "notifyPersistError");
var ol, fe, Mt, Ae, Gl, na, ia, ra, aa, ir, oa, wi, Ti, oi, Jl;
const It = class It extends Kn(Wn) {
  constructor(t = {}) {
    const { scene: i, criterion: r, isNew: a, onSave: o, ...s } = t ?? {};
    super(s);
    O(this, Ae);
    O(this, fe, null);
    O(this, Mt, !1);
    O(this, na, /* @__PURE__ */ l(async (t) => {
      t.preventDefault();
      const i = t.currentTarget;
      if (!(i instanceof HTMLFormElement)) return;
      const r = new FormData(i), a = String(r.get("criterionLabel") ?? "").trim(), o = String(r.get("criterionKey") ?? "").trim(), s = Array.from(i.querySelectorAll('[name="criterionValues"]')).map((g) => g instanceof HTMLInputElement ? g.value.trim() : "").filter((g, m, b) => g && b.indexOf(g) === m), u = String(r.get("criterionDefault") ?? "").trim() || s[0] || "Standard", d = bo(
        {
          id: f(this, fe).id,
          key: o,
          label: a,
          values: s,
          default: u,
          order: Number(f(this, fe).order ?? 0)
        },
        0,
        /* @__PURE__ */ new Set()
      );
      d && (S(this, fe, d), await w(this, Ae, Jl).call(this), this.close());
    }, "#onSubmit"));
    O(this, ia, /* @__PURE__ */ l((t) => {
      var o;
      if (f(this, Mt)) return;
      const i = t.currentTarget, r = (i == null ? void 0 : i.form) ?? ((o = this.element) == null ? void 0 : o.querySelector("form"));
      if (!(r instanceof HTMLFormElement)) return;
      const a = r.querySelector('input[name="criterionKey"]');
      a instanceof HTMLInputElement && (a.value = ni(i.value));
    }, "#onLabelInput"));
    O(this, ra, /* @__PURE__ */ l((t) => {
      var c;
      const i = t.currentTarget, r = (i == null ? void 0 : i.form) ?? ((c = this.element) == null ? void 0 : c.querySelector("form"));
      if (!(r instanceof HTMLFormElement) || !(i instanceof HTMLInputElement)) return;
      const a = r.querySelector('input[name="criterionLabel"]'), o = ni(a instanceof HTMLInputElement ? a.value : ""), s = ni(i.value);
      S(this, Mt, s !== o), i.value = s, w(this, Ae, ir).call(this, r);
    }, "#onKeyInput"));
    O(this, aa, /* @__PURE__ */ l((t) => {
      var o, s;
      t.preventDefault();
      const i = ((o = t.currentTarget) == null ? void 0 : o.form) ?? ((s = this.element) == null ? void 0 : s.querySelector("form"));
      if (!(i instanceof HTMLFormElement)) return;
      const r = i.querySelector('input[name="criterionLabel"]'), a = i.querySelector('input[name="criterionKey"]');
      a instanceof HTMLInputElement && (a.value = ni(r instanceof HTMLInputElement ? r.value : ""), S(this, Mt, !1), w(this, Ae, ir).call(this, i));
    }, "#onResetAutoKey"));
    O(this, oa, /* @__PURE__ */ l((t) => {
      var c, u, d, g, m, b;
      t.preventDefault();
      const i = ((c = t.currentTarget) == null ? void 0 : c.form) ?? ((u = this.element) == null ? void 0 : u.querySelector("form"));
      if (!(i instanceof HTMLFormElement)) return;
      const r = i.querySelector(".scene-criterion-editor__values");
      if (!(r instanceof HTMLElement)) return;
      (d = r.querySelector(".scene-criterion-editor__empty")) == null || d.remove();
      const a = document.createElement("div");
      a.classList.add("scene-criterion-editor__value");
      const o = yt(p("EIDOLON.SceneCriteria.ValuePlaceholder", "Allowed value")), s = yt(p("EIDOLON.SceneCriteria.RemoveValue", "Remove Value"));
      a.innerHTML = `
      <input type="text" name="criterionValues" value="" placeholder="${o}" class="form-control">
      <button type="button" class="icon" data-action="remove-value" aria-label="${s}" title="${s}">
        <i class="fa-solid fa-trash"></i>
      </button>
    `, r.appendChild(a), (g = a.querySelector('[data-action="remove-value"]')) == null || g.addEventListener("click", f(this, wi)), (m = a.querySelector('input[name="criterionValues"]')) == null || m.addEventListener("input", f(this, Ti)), w(this, Ae, oi).call(this, i), (b = a.querySelector('input[name="criterionValues"]')) == null || b.focus();
    }, "#onAddValue"));
    O(this, wi, /* @__PURE__ */ l((t) => {
      var a, o, s, c;
      t.preventDefault(), (o = (a = t.currentTarget) == null ? void 0 : a.closest(".scene-criterion-editor__value")) == null || o.remove();
      const i = ((s = t.currentTarget) == null ? void 0 : s.form) ?? ((c = this.element) == null ? void 0 : c.querySelector("form"));
      if (!(i instanceof HTMLFormElement)) return;
      const r = i.querySelector(".scene-criterion-editor__values");
      if (r instanceof HTMLElement) {
        if (!r.querySelector(".scene-criterion-editor__value")) {
          const u = document.createElement("p");
          u.classList.add("notes", "scene-criterion-editor__empty"), u.textContent = p(
            "EIDOLON.SceneCriteria.ValueListEmpty",
            "No values have been added to this criterion."
          ), r.appendChild(u);
        }
        w(this, Ae, oi).call(this, i);
      }
    }, "#onRemoveValue"));
    O(this, Ti, /* @__PURE__ */ l((t) => {
      var r, a;
      const i = ((r = t.currentTarget) == null ? void 0 : r.form) ?? ((a = this.element) == null ? void 0 : a.querySelector("form"));
      i instanceof HTMLFormElement && w(this, Ae, oi).call(this, i);
    }, "#onValuesChanged"));
    this.scene = i ?? null, this.criterion = r ?? null, this.onSave = typeof o == "function" ? o : null, this.isNew = !!a, S(this, fe, w(this, Ae, Gl).call(this)), S(this, Mt, f(this, fe).key !== ni(f(this, fe).label));
  }
  async _prepareContext() {
    var i, r, a, o;
    const t = Array.isArray((i = f(this, fe)) == null ? void 0 : i.values) ? f(this, fe).values : [];
    return {
      isNew: this.isNew,
      key: ((r = f(this, fe)) == null ? void 0 : r.key) ?? "",
      label: ((a = f(this, fe)) == null ? void 0 : a.label) ?? "",
      defaultValue: ((o = f(this, fe)) == null ? void 0 : o.default) ?? "",
      values: t.map((s, c) => {
        var u;
        return {
          index: c,
          value: s,
          selected: s === ((u = f(this, fe)) == null ? void 0 : u.default)
        };
      }),
      hasValues: t.length > 0,
      labels: {
        label: p("EIDOLON.SceneCriteria.CategoryNameLabel", "Criterion Label"),
        key: p("EIDOLON.SceneCriteria.CriteriaKey", "Key"),
        values: p("EIDOLON.SceneCriteria.ValuesLabel", "Allowed Values"),
        default: p("EIDOLON.SceneCriteria.DefaultValue", "Default Value"),
        empty: p(
          "EIDOLON.SceneCriteria.ValueListEmpty",
          "No values have been added to this criterion."
        ),
        addValue: p("EIDOLON.SceneCriteria.AddValue", "Add Value"),
        removeValue: p("EIDOLON.SceneCriteria.RemoveValue", "Remove Value"),
        valuePlaceholder: p("EIDOLON.SceneCriteria.ValuePlaceholder", "Allowed value"),
        resetAutoKey: p("EIDOLON.SceneCriteria.ResetAutoKey", "Reset to Auto"),
        save: this.isNew ? p("EIDOLON.SceneCriteria.CreateCategory", "Add Criterion") : p("EIDOLON.SceneCriteria.SaveCategory", "Save Criterion"),
        cancel: p("EIDOLON.SceneCriteria.CancelEdit", "Cancel")
      },
      keyIsCustom: f(this, Mt)
    };
  }
  _onRender(t, i) {
    var a, o, s, c, u, d;
    super._onRender(t, i);
    const r = (a = this.element) == null ? void 0 : a.querySelector("form");
    r && (r.addEventListener("submit", f(this, na)), (o = r.querySelector('[data-action="add-value"]')) == null || o.addEventListener("click", f(this, oa)), (s = r.querySelector('input[name="criterionLabel"]')) == null || s.addEventListener("input", f(this, ia)), (c = r.querySelector('input[name="criterionKey"]')) == null || c.addEventListener("input", f(this, ra)), (u = r.querySelector('[data-action="reset-auto-key"]')) == null || u.addEventListener("click", f(this, aa)), r.querySelectorAll('[data-action="remove-value"]').forEach((g) => {
      g.addEventListener("click", f(this, wi));
    }), r.querySelectorAll('input[name="criterionValues"]').forEach((g) => {
      g.addEventListener("input", f(this, Ti));
    }), (d = r.querySelector('[data-action="cancel"]')) == null || d.addEventListener("click", (g) => {
      g.preventDefault(), this.close();
    }), w(this, Ae, ir).call(this, r), w(this, Ae, oi).call(this, r));
  }
};
fe = new WeakMap(), Mt = new WeakMap(), Ae = new WeakSet(), Gl = /* @__PURE__ */ l(function() {
  const t = bo(this.criterion, 0, /* @__PURE__ */ new Set()) ?? ns(p("EIDOLON.SceneCriteria.DefaultCategoryName", "New Criterion"));
  return {
    id: t.id,
    key: t.key,
    label: t.label ?? "",
    values: Array.isArray(t.values) ? [...t.values] : [],
    default: t.default
  };
}, "#initializeState"), na = new WeakMap(), ia = new WeakMap(), ra = new WeakMap(), aa = new WeakMap(), ir = /* @__PURE__ */ l(function(t) {
  const i = t.querySelector('[data-action="reset-auto-key"]');
  i instanceof HTMLButtonElement && (i.disabled = !f(this, Mt));
}, "#syncAutoKeyButton"), oa = new WeakMap(), wi = new WeakMap(), Ti = new WeakMap(), oi = /* @__PURE__ */ l(function(t) {
  var c, u;
  const i = t.querySelector('select[name="criterionDefault"]');
  if (!(i instanceof HTMLSelectElement)) return;
  const r = ((u = (c = i.value) == null ? void 0 : c.trim) == null ? void 0 : u.call(c)) ?? "", a = Array.from(t.querySelectorAll('input[name="criterionValues"]')).map((d) => d instanceof HTMLInputElement ? d.value.trim() : "").filter((d, g, m) => d && m.indexOf(d) === g), o = i.dataset.emptyLabel || p("EIDOLON.SceneCriteria.ValueListEmpty", "No values have been added to this criterion.");
  if (i.innerHTML = "", !a.length) {
    const d = document.createElement("option");
    d.value = "", d.textContent = o, d.selected = !0, i.appendChild(d);
    return;
  }
  const s = a.includes(r) ? r : a[0];
  for (const d of a) {
    const g = document.createElement("option");
    g.value = d, g.textContent = d, g.selected = d === s, i.appendChild(g);
  }
}, "#syncDefaultOptions"), Jl = /* @__PURE__ */ l(async function() {
  if (!this.scene) return;
  const t = Qe(this.scene).sort((r, a) => r.order - a.order), i = t.findIndex((r) => r.id === f(this, fe).id);
  i < 0 ? (f(this, fe).order = t.length, t.push(f(this, fe))) : (f(this, fe).order = t[i].order, t.splice(i, 1, f(this, fe)));
  try {
    await ha(this.scene, t), this.onSave && await this.onSave(f(this, fe));
  } catch (r) {
    zl(r);
  }
}, "#persist"), l(It, "CategoryEditorApplication"), Re(It, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  ct(It, It, "DEFAULT_OPTIONS"),
  {
    id: `${we}-criterion-editor`,
    classes: Array.from(
      /* @__PURE__ */ new Set([...((ol = ct(It, It, "DEFAULT_OPTIONS")) == null ? void 0 : ol.classes) ?? [], "standard-form", "themed"])
    ),
    window: {
      title: p("EIDOLON.SceneCriteria.EditCategory", "Edit Criterion"),
      resizable: !1
    },
    position: {
      width: 460,
      height: "auto"
    }
  },
  { inplace: !1 }
)), Re(It, "PARTS", {
  content: {
    template: `modules/${we}/templates/scene-criteria-editor.html`
  }
});
let To = It;
function ni(e) {
  return String(e ?? "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "criterion";
}
l(ni, "slugifyKey");
const Qu = `modules/${we}/templates/scene-criteria-tab.html`, Eo = {
  log: /* @__PURE__ */ l((...e) => {
    var n;
    return (n = console.debug) == null ? void 0 : n.call(console, `${we} | Criteria`, ...e);
  }, "log"),
  group: /* @__PURE__ */ l((...e) => {
    var n;
    return (n = console.groupCollapsed) == null ? void 0 : n.call(console, `${we} | Criteria`, ...e);
  }, "group"),
  groupEnd: /* @__PURE__ */ l(() => {
    var e;
    return (e = console.groupEnd) == null ? void 0 : e.call(console);
  }, "groupEnd")
}, Xu = ga(To), Zu = Hl({
  tabId: "criteria",
  tabLabel: /* @__PURE__ */ l(() => p("EIDOLON.SceneCriteria.TabLabel", "Criteria"), "tabLabel"),
  getScene: Tt,
  isApplicable: /* @__PURE__ */ l(() => ma(), "isApplicable"),
  renderContent: /* @__PURE__ */ l(({ app: e, tab: n, scene: t }) => td(e, n, t), "renderContent"),
  logger: Eo
});
function ed() {
  return Zu.register();
}
l(ed, "registerSceneCriteriaConfigHook");
function td(e, n, t) {
  if (!(n instanceof HTMLElement)) return;
  const i = Fe(t) ? t : Tt(e);
  kn(e, n, i);
}
l(td, "renderCriteriaTab");
async function kn(e, n, t) {
  var r, a;
  const i = t ?? Tt(e);
  Eo.group("renderCriteriaTabContent", { sceneId: (i == null ? void 0 : i.id) ?? null });
  try {
    if (!Fe(i)) {
      const d = p(
        "EIDOLON.SceneCriteria.Unavailable",
        "Scene criteria are unavailable for this configuration sheet."
      );
      n.innerHTML = `<p class="notes">${d}</p>`;
      return;
    }
    const o = Qe(i).sort((d, g) => d.order - g.order), s = Fi(i, o), c = ((a = (r = foundry == null ? void 0 : foundry.applications) == null ? void 0 : r.handlebars) == null ? void 0 : a.renderTemplate) ?? (typeof renderTemplate == "function" ? renderTemplate : globalThis == null ? void 0 : globalThis.renderTemplate);
    if (typeof c != "function") {
      n.innerHTML = `<p class="notes">${p("EIDOLON.SceneCriteria.CategoryListEmpty", "No criteria configured for this scene.")}</p>`;
      return;
    }
    const u = await c(Qu, {
      description: p(
        "EIDOLON.SceneCriteria.Description",
        "Define scene criteria dimensions and allowed values used by matching rules."
      ),
      labels: {
        list: p("EIDOLON.SceneCriteria.CategoryListLabel", "Scene Criteria"),
        empty: p(
          "EIDOLON.SceneCriteria.CategoryListEmpty",
          "No criteria configured for this scene."
        ),
        add: p("EIDOLON.SceneCriteria.AddCategory", "Add Criterion"),
        edit: p("EIDOLON.SceneCriteria.EditCategory", "Edit Criterion"),
        remove: p("EIDOLON.SceneCriteria.RemoveCategory", "Remove Criterion"),
        moveUp: p("EIDOLON.SceneCriteria.MoveUp", "Move Up"),
        moveDown: p("EIDOLON.SceneCriteria.MoveDown", "Move Down"),
        values: p("EIDOLON.SceneCriteria.ValuesLabel", "Allowed Values"),
        unnamed: p("EIDOLON.SceneCriteria.UnnamedCategory", "Unnamed Criterion")
      },
      summary: {
        criteriaCount: o.length,
        valueCount: o.reduce((d, g) => d + g.values.length, 0)
      },
      criteria: o.map((d, g) => {
        var m, b;
        return {
          id: d.id,
          label: d.label,
          displayName: ((b = (m = d.label) == null ? void 0 : m.trim) == null ? void 0 : b.call(m)) || p("EIDOLON.SceneCriteria.UnnamedCategory", "Unnamed Criterion"),
          hasValues: d.values.length > 0,
          values: d.values.map((h) => ({
            value: h,
            isCurrent: (s[d.key] ?? d.default) === h
          })),
          valueCountLabel: id(d.values.length),
          canMoveUp: g > 0,
          canMoveDown: g < o.length - 1
        };
      }),
      hasCriteria: o.length > 0
    });
    n.innerHTML = u, nd(e, n, i);
  } catch (o) {
    console.error(`${we} | Failed to render criteria tab`, o), n.innerHTML = `<p class="notes">${p("EIDOLON.SceneCriteria.CategoryListEmpty", "No criteria configured for this scene.")}</p>`;
  } finally {
    Eo.groupEnd();
  }
}
l(kn, "renderCriteriaTabContent");
function nd(e, n, t) {
  const i = t ?? Tt(e);
  if (!Fe(i)) return;
  const r = n.querySelector('[data-criteria-action="add"]');
  r && r.addEventListener("click", () => {
    Rs(e, {
      scene: i,
      criterion: ns(
        p("EIDOLON.SceneCriteria.DefaultCategoryName", "New Criterion")
      ),
      isNew: !0,
      onSave: /* @__PURE__ */ l(() => kn(e, n, i), "onSave")
    });
  }), n.querySelectorAll('[data-criteria-action="edit"]').forEach((a) => {
    const o = a.dataset.criterionId;
    o && a.addEventListener("click", () => {
      const s = Qe(i).find((c) => c.id === o);
      s && Rs(e, {
        scene: i,
        criterion: s,
        onSave: /* @__PURE__ */ l(() => kn(e, n, i), "onSave")
      });
    });
  }), n.querySelectorAll('[data-criteria-action="remove"]').forEach((a) => {
    const o = a.dataset.criterionId;
    o && a.addEventListener("click", async () => {
      await $a(i, (c) => {
        const u = c.findIndex((d) => d.id === o);
        return u < 0 ? !1 : (c.splice(u, 1), Da(c), !0);
      }) && await kn(e, n, i);
    });
  }), n.querySelectorAll('[data-criteria-action="move-up"]').forEach((a) => {
    const o = a.dataset.criterionId;
    o && a.addEventListener("click", async () => {
      await $a(i, (c) => {
        const u = c.findIndex((g) => g.id === o);
        if (u <= 0) return !1;
        const [d] = c.splice(u, 1);
        return c.splice(u - 1, 0, d), Da(c), !0;
      }) && await kn(e, n, i);
    });
  }), n.querySelectorAll('[data-criteria-action="move-down"]').forEach((a) => {
    const o = a.dataset.criterionId;
    o && a.addEventListener("click", async () => {
      await $a(i, (c) => {
        const u = c.findIndex((g) => g.id === o);
        if (u < 0 || u >= c.length - 1) return !1;
        const [d] = c.splice(u, 1);
        return c.splice(u + 1, 0, d), Da(c), !0;
      }) && await kn(e, n, i);
    });
  });
}
l(nd, "bindCriteriaTabEvents");
async function $a(e, n) {
  const t = Qe(e).sort((r, a) => r.order - a.order);
  if (n(t) === !1) return !1;
  try {
    return await ha(e, t), !0;
  } catch (r) {
    return zl(r), !1;
  }
}
l($a, "mutateCriteria");
function Rs(e, n = {}) {
  const t = n.scene ?? null, i = t && Fe(t) ? t : Tt(e);
  if (!Fe(i))
    return;
  Xu({
    scene: i,
    criterion: n.criterion ?? null,
    isNew: !!n.isNew,
    onSave: typeof n.onSave == "function" ? n.onSave : null
  }).render({ force: !0 });
}
l(Rs, "openCriterionEditor");
function Da(e) {
  e.forEach((n, t) => {
    n.order = t;
  });
}
l(Da, "reindexCriteriaOrder");
function id(e) {
  var n, t;
  if ((t = (n = game.i18n) == null ? void 0 : n.has) != null && t.call(n, "EIDOLON.SceneCriteria.ValueCountLabel"))
    try {
      return game.i18n.format("EIDOLON.SceneCriteria.ValueCountLabel", { count: e });
    } catch (i) {
      console.error(`${we} | Failed to format value count label`, i);
    }
  return e === 0 ? "No values configured" : e === 1 ? "1 value" : `${e} values`;
}
l(id, "formatValueCount");
let Ps = !1;
function rd() {
  Hooks.once("init", () => {
    Gu();
  }), Hooks.once("ready", () => {
    ma() && (Ps || (ed(), Ps = !0));
  });
}
l(rd, "registerSceneCriteriaHooks");
rd();
const re = v, Wl = "criteriaEngineVersion", wn = "fileIndex", Tn = "tileCriteria", rs = {
  LEGACY: 1,
  CRITERIA: 2
}, Kl = rs.CRITERIA;
function Yl(e) {
  var n;
  return ((n = e == null ? void 0 : e.getFlag) == null ? void 0 : n.call(e, re, Wl)) ?? rs.LEGACY;
}
l(Yl, "getSceneEngineVersion");
function ad(e, n, t, i, r) {
  if (!(e != null && e.length) || !(t != null && t.length)) return -1;
  const a = {};
  for (const s of t)
    a[s] = n[s];
  const o = Hs(e, a, t);
  if (o >= 0) return o;
  if (i != null && i.length && r) {
    const s = { ...a };
    for (const c of i) {
      if (!(c in s)) continue;
      s[c] = r[c] ?? "Standard";
      const u = Hs(e, s, t);
      if (u >= 0) return u;
    }
  }
  return -1;
}
l(ad, "findBestMatch");
function Hs(e, n, t) {
  return e.findIndex((i) => {
    for (const r of t)
      if (i[r] !== n[r]) return !1;
    return !0;
  });
}
l(Hs, "findExactMatch");
function od(e, n) {
  if (!(e != null && e.length)) return -1;
  let t = -1, i = -1;
  for (let r = 0; r < e.length; r += 1) {
    const a = e[r] ?? {}, o = Object.keys(a);
    if (o.length === 0) {
      i < 0 && (t = r, i = 0);
      continue;
    }
    let s = !0;
    for (const c of o)
      if (a[c] !== n[c]) {
        s = !1;
        break;
      }
    s && o.length > i && (t = r, i = o.length);
  }
  return t;
}
l(od, "findFileIndex");
function rr(e) {
  return e && typeof e == "object" && !Array.isArray(e);
}
l(rr, "isPlainObject$2");
function qs(e) {
  return e == null ? e : typeof structuredClone == "function" ? structuredClone(e) : JSON.parse(JSON.stringify(e));
}
l(qs, "deepClone");
function sd(e, n) {
  if (!n) return;
  const t = n.split(".").filter(Boolean);
  if (!t.length) return;
  let i = e;
  for (let r = 0; r < t.length - 1; r += 1) {
    if (!rr(i == null ? void 0 : i[t[r]])) return;
    i = i[t[r]];
  }
  delete i[t.at(-1)];
}
l(sd, "deletePath");
function Ql(e, n) {
  const t = qs(e ?? {});
  if (!rr(n)) return t;
  for (const [i, r] of Object.entries(n)) {
    if (i.startsWith("-=") && r === !0) {
      sd(t, i.slice(2));
      continue;
    }
    rr(r) && rr(t[i]) ? t[i] = Ql(t[i], r) : t[i] = qs(r);
  }
  return t;
}
l(Ql, "fallbackMerge");
function ld(e, n) {
  var t, i;
  return (t = foundry == null ? void 0 : foundry.utils) != null && t.mergeObject && ((i = foundry == null ? void 0 : foundry.utils) != null && i.deepClone) ? foundry.utils.mergeObject(e, foundry.utils.deepClone(n), {
    inplace: !1
  }) : Ql(e, n);
}
l(ld, "defaultMerge");
function cd(e, n) {
  if (!e) return !0;
  for (const t of Object.keys(e))
    if (e[t] !== n[t]) return !1;
  return !0;
}
l(cd, "criteriaMatch");
function Xl(e, n, t, i) {
  const r = i ?? ld;
  let a = r({}, e ?? {});
  if (!(n != null && n.length)) return a;
  const o = [];
  for (let s = 0; s < n.length; s += 1) {
    const c = n[s];
    if (cd(c == null ? void 0 : c.criteria, t)) {
      const u = c != null && c.criteria ? Object.keys(c.criteria).length : 0;
      o.push({ specificity: u, index: s, delta: c == null ? void 0 : c.delta });
    }
  }
  o.sort((s, c) => s.specificity - c.specificity || s.index - c.index);
  for (const s of o)
    s.delta && (a = r(a, s.delta));
  return a;
}
l(Xl, "resolveRules");
function pa(e = null) {
  var i;
  const n = (game == null ? void 0 : game.user) ?? null;
  if (!n) return !1;
  if (n.isGM) return !0;
  const t = e ?? ((i = game == null ? void 0 : game.scenes) == null ? void 0 : i.viewed) ?? null;
  if (!t) return !1;
  if (typeof t.canUserModify == "function")
    try {
      return !!t.canUserModify(n, "update");
    } catch {
    }
  if (typeof t.testUserPermission == "function")
    try {
      return !!t.testUserPermission(n, "OWNER");
    } catch {
    }
  return !!t.isOwner;
}
l(pa, "canManageCriteria");
function ud(e = null) {
  if (!pa(e))
    throw new Error(`${re} | You do not have permission to manage scene criteria.`);
}
l(ud, "requireCriteriaAccess");
const dd = /* @__PURE__ */ l((...e) => console.log(`${re} | criteria tiles:`, ...e), "log$1");
let vr = /* @__PURE__ */ new WeakMap(), Cr = /* @__PURE__ */ new WeakMap();
const Bs = 200;
function fd(e) {
  return e ? Number.isInteger(e.size) ? e.size : Array.isArray(e) || typeof e.length == "number" ? e.length : Array.from(e).length : 0;
}
l(fd, "getCollectionSize$1");
function Vi() {
  return typeof (performance == null ? void 0 : performance.now) == "function" ? performance.now() : Date.now();
}
l(Vi, "nowMs$2");
function gd(e) {
  if (!Array.isArray(e)) return [];
  const n = /* @__PURE__ */ new Set();
  for (const t of e) {
    if (typeof t != "string") continue;
    const i = t.trim();
    i && n.add(i);
  }
  return Array.from(n);
}
l(gd, "uniqueStringKeys$1");
function md(e, n = Bs) {
  if (!Array.isArray(e) || e.length === 0) return [];
  const t = Number.isInteger(n) && n > 0 ? n : Bs, i = [];
  for (let r = 0; r < e.length; r += t)
    i.push(e.slice(r, r + t));
  return i;
}
l(md, "chunkArray$1");
async function hd(e, n, t) {
  const i = md(n, t);
  for (const r of i)
    await e.updateEmbeddedDocuments("Tile", r), i.length > 1 && await Promise.resolve();
  return i.length;
}
l(hd, "updateTilesInChunks");
function pd(e) {
  var i;
  const n = Ln(e, { files: null });
  if (!((i = n == null ? void 0 : n.variants) != null && i.length)) return [];
  const t = /* @__PURE__ */ new Set();
  for (const r of n.variants)
    for (const a of Object.keys(r.criteria ?? {}))
      a && t.add(a);
  return Array.from(t);
}
l(pd, "getTileCriteriaDependencyKeys");
function yd(e, n) {
  const t = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Set();
  for (const r of n) {
    const a = r.getFlag(re, Tn) ?? r.getFlag(re, wn);
    if (a) {
      i.add(r.id);
      for (const o of pd(a))
        t.has(o) || t.set(o, /* @__PURE__ */ new Set()), t.get(o).add(r.id);
    }
  }
  return {
    collection: n,
    keyToTileIds: t,
    allTileIds: i
  };
}
l(yd, "buildTileDependencyIndex");
function bd(e, n) {
  const t = Cr.get(e);
  if ((t == null ? void 0 : t.collection) === n) return t;
  const i = yd(e, n);
  return Cr.set(e, i), i;
}
l(bd, "getTileDependencyIndex");
function wd(e, n, t) {
  const i = gd(t);
  if (!i.length)
    return Array.from(n ?? []);
  const r = bd(e, n), a = /* @__PURE__ */ new Set();
  for (const o of i) {
    const s = r.keyToTileIds.get(o);
    if (s)
      for (const c of s)
        a.add(c);
  }
  return a.size ? typeof (n == null ? void 0 : n.get) == "function" ? Array.from(a).map((o) => n.get(o)).filter(Boolean) : Array.from(n ?? []).filter((o) => a.has(o.id)) : [];
}
l(wd, "getTilesForChangedKeys");
function Zl(e) {
  return typeof (e == null ? void 0 : e.name) == "string" ? e.name : typeof (e == null ? void 0 : e.src) == "string" ? e.src : "";
}
l(Zl, "getFilePath");
function Sr(e) {
  if (typeof e != "string") return "";
  const n = e.trim();
  if (!n) return "";
  const t = n.replace(/\\/g, "/");
  try {
    return decodeURIComponent(t);
  } catch {
    return t;
  }
}
l(Sr, "normalizeFilePath");
function as(e) {
  if (!Array.isArray(e)) return [];
  const n = /* @__PURE__ */ new Map();
  return e.map((t, i) => {
    const r = Sr(Zl(t)), a = r || `__index:${i}`, o = n.get(a) ?? 0;
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
l(as, "buildTileFileEntries");
function Qt(e, n) {
  if (!Number.isInteger(n) || n < 0) return null;
  const i = as(e).find((r) => r.index === n);
  return i ? { ...i.target } : { indexHint: n };
}
l(Qt, "createTileTargetFromIndex");
function ya(e) {
  if (!e || typeof e != "object") return null;
  const n = Sr(e.path), t = Number(e.indexHint ?? e.fileIndex), i = Number(e.occurrence), r = {};
  return n && (r.path = n, r.occurrence = Number.isInteger(i) && i >= 0 ? i : 0), Number.isInteger(t) && t >= 0 && (r.indexHint = t), !r.path && !Number.isInteger(r.indexHint) ? null : r;
}
l(ya, "normalizeTileTarget");
function gi(e, n) {
  const t = ya(e);
  if (!t) return -1;
  const i = as(n);
  if (!i.length) return -1;
  if (t.path) {
    const r = i.filter((a) => a.path === t.path);
    if (r.length > 0) {
      const a = Number.isInteger(t.occurrence) ? t.occurrence : 0;
      if (r[a]) return r[a].index;
      if (Number.isInteger(t.indexHint)) {
        const o = r.find((s) => s.index === t.indexHint);
        if (o) return o.index;
      }
      return r[0].index;
    }
  }
  return Number.isInteger(t.indexHint) && t.indexHint < i.length ? t.indexHint : -1;
}
l(gi, "resolveTileTargetIndex");
function Xt(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return {};
  const n = {};
  for (const [t, i] of Object.entries(e))
    typeof t != "string" || !t || typeof i != "string" || !i.trim() || (n[t] = i.trim());
  return n;
}
l(Xt, "sanitizeCriteria");
function Td(e) {
  return Object.entries(Xt(e)).sort(([t], [i]) => t.localeCompare(i)).map(([t, i]) => `${t}=${i}`).join("");
}
l(Td, "serializeCriteria");
function Ed(e) {
  return Object.keys(Xt(e)).length;
}
l(Ed, "getCriteriaSpecificity");
function vd(e, n) {
  const t = Xt(e), i = Xt(n);
  for (const [r, a] of Object.entries(t))
    if (r in i && i[r] !== a)
      return !1;
  return !0;
}
l(vd, "areCriteriaCompatible");
function Cd(e, n) {
  const t = gi(e, n);
  if (Number.isInteger(t) && t >= 0)
    return `index:${t}`;
  const i = ya(e);
  if (!i) return "";
  if (i.path) {
    const r = Number.isInteger(i.occurrence) ? i.occurrence : 0;
    return `path:${i.path}#${r}`;
  }
  return Number.isInteger(i.indexHint) ? `hint:${i.indexHint}` : "";
}
l(Cd, "getTargetIdentity");
function ec(e, n = {}) {
  var s;
  const t = Array.isArray(n.files) ? n.files : [], i = Ln(e, { files: t });
  if (!((s = i == null ? void 0 : i.variants) != null && s.length))
    return {
      errors: [],
      warnings: []
    };
  const r = i.variants.map((c, u) => ({
    index: u,
    criteria: Xt(c.criteria),
    specificity: Ed(c.criteria),
    criteriaSignature: Td(c.criteria),
    targetIdentity: Cd(c.target, t)
  })), a = [], o = [];
  for (let c = 0; c < r.length; c += 1) {
    const u = r[c];
    for (let d = c + 1; d < r.length; d += 1) {
      const g = r[d];
      if (u.specificity !== g.specificity || !vd(u.criteria, g.criteria)) continue;
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
l(ec, "detectTileCriteriaConflicts");
function Sd(e, n) {
  if (!e || typeof e != "object") return null;
  let t = ya(e.target);
  if (!t) {
    const i = Number(e.fileIndex);
    Number.isInteger(i) && i >= 0 && (t = Qt(n, i));
  }
  return t ? {
    criteria: Xt(e.criteria),
    target: t
  } : null;
}
l(Sd, "normalizeTileVariant");
function tc(e, n = {}) {
  if (!Array.isArray(e) || e.length === 0) return null;
  const t = Array.isArray(n.files) ? n.files : null, i = e.map((c, u) => ({
    criteria: Xt(c),
    target: Qt(t, u)
  })).filter((c) => c.target);
  if (!i.length) return null;
  const r = i.find((c) => Object.keys(c.criteria).length === 0), a = (r == null ? void 0 : r.target) ?? i[0].target;
  let o = null;
  const s = Number(n.defaultFileIndex);
  return Number.isInteger(s) && s >= 0 && (o = Qt(t, s)), o || (o = a), {
    strategy: "select-one",
    variants: i,
    defaultTarget: o
  };
}
l(tc, "buildTileCriteriaFromFileIndex");
function Ln(e, n = {}) {
  const t = Array.isArray(n.files) ? n.files : null;
  if (Array.isArray(e))
    return tc(e, { files: t });
  if (!e || typeof e != "object") return null;
  const i = Array.isArray(e.variants) ? e.variants.map((a) => Sd(a, t)).filter(Boolean) : [];
  if (!i.length) return null;
  let r = ya(e.defaultTarget);
  if (!r) {
    const a = Number(e.defaultFileIndex);
    Number.isInteger(a) && a >= 0 && (r = Qt(t, a));
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
l(Ln, "normalizeTileCriteria");
function Ld(e, n) {
  if (!e) return -1;
  let t = -1, i = -1;
  for (const r of e.variants) {
    const a = r.keys;
    let o = !0;
    for (const s of a)
      if (r.criteria[s] !== (n == null ? void 0 : n[s])) {
        o = !1;
        break;
      }
    o && a.length > i && (i = a.length, t = r.targetIndex);
  }
  return t >= 0 ? t : e.defaultIndex;
}
l(Ld, "selectTileFileIndexFromCompiled");
function Od(e, n) {
  const t = Ln(e, { files: n });
  if (!t) return null;
  const i = t.variants.map((a) => {
    const o = Xt(a.criteria), s = gi(a.target, n);
    return !Number.isInteger(s) || s < 0 ? null : {
      criteria: o,
      keys: Object.keys(o),
      targetIndex: s
    };
  }).filter(Boolean), r = gi(t.defaultTarget, n);
  return !i.length && (!Number.isInteger(r) || r < 0) ? null : {
    variants: i,
    defaultIndex: r
  };
}
l(Od, "compileTileMatcher");
function Id(e, n, t) {
  const i = vr.get(e);
  if (i && i.tileCriteria === n && i.files === t)
    return i.compiled;
  const r = Od(n, t);
  return vr.set(e, {
    tileCriteria: n,
    files: t,
    compiled: r
  }), r;
}
l(Id, "getCompiledTileMatcher");
function Ad(e = null, n = null) {
  e ? Cr.delete(e) : Cr = /* @__PURE__ */ new WeakMap(), n ? vr.delete(n) : e || (vr = /* @__PURE__ */ new WeakMap());
}
l(Ad, "invalidateTileCriteriaCaches");
async function nc(e, n, t = {}) {
  var c, u, d, g;
  const i = Vi(), r = {
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
  if (n = n ?? ((c = game.scenes) == null ? void 0 : c.viewed), !n)
    return r.durationMs = Vi() - i, r;
  const a = n.getEmbeddedCollection("Tile") ?? [];
  r.total = fd(a);
  const o = wd(n, a, t.changedKeys);
  if (r.scanned = o.length, !o.length)
    return r.skipped.unaffected = r.total, r.durationMs = Vi() - i, r;
  const s = [];
  for (const m of o) {
    const b = m.getFlag(re, Tn) ?? m.getFlag(re, wn);
    if (!b) {
      r.skipped.noCriteria += 1;
      continue;
    }
    const h = m.getFlag("monks-active-tiles", "files");
    if (!(h != null && h.length)) {
      r.skipped.noFiles += 1;
      continue;
    }
    const y = Id(m, b, h), T = Ld(y, e);
    if (!Number.isInteger(T) || T < 0 || T >= h.length) {
      console.warn(`${re} | Tile ${m.id} has no valid file match for state`, e), r.skipped.noMatch += 1;
      continue;
    }
    const E = T + 1, A = Number(m.getFlag("monks-active-tiles", "fileindex")) !== E, k = h.some((U, Q) => !!(U != null && U.selected) != (Q === T)), F = Sr(((u = m.texture) == null ? void 0 : u.src) ?? ((g = (d = m._source) == null ? void 0 : d.texture) == null ? void 0 : g.src) ?? ""), D = Zl(h[T]), H = Sr(D), te = !!H && H !== F;
    if (!k && !A && !te) {
      r.skipped.unchanged += 1;
      continue;
    }
    const ne = {
      _id: m._id
    };
    k && (ne["flags.monks-active-tiles.files"] = h.map((U, Q) => ({
      ...U,
      selected: Q === T
    }))), A && (ne["flags.monks-active-tiles.fileindex"] = E), te && (ne.texture = { src: D }), s.push(ne), dd(`Tile ${m.id} -> ${D}`);
  }
  return s.length > 0 && (r.chunks = await hd(n, s, t.chunkSize), r.updated = s.length), r.durationMs = Vi() - i, r;
}
l(nc, "updateTiles");
function Nd() {
  if (!globalThis.Tagger) return [];
  const e = ["Checkbox", "Tile", "Settings", "Toggleable Lights"], n = [
    "Checkbox",
    "Tile",
    "Settings",
    "Toggleable Lights",
    "Checked",
    "Unchecked",
    "Individual"
  ], t = Tagger.getByTag(e) ?? [], i = [];
  for (const r of t) {
    if (r.getFlag("monks-active-tiles", "variables.state") !== "unchecked") continue;
    const a = (Tagger.getTags(r) ?? []).filter((c) => !n.includes(c)), o = (Tagger.getByTag("Disable Automation") ?? []).concat(Tagger.getByTag("Settings") ?? []), s = Tagger.getByTag(a, { ignore: o }) ?? [];
    for (const c of s)
      c != null && c._id && i.push(c._id);
  }
  return i;
}
l(Nd, "buildLightControlsMap");
const En = v, Pn = "lightCriteria", os = Object.freeze({
  base: null,
  mappings: [],
  current: null
});
function Fa(e) {
  return e && typeof e == "object" && !Array.isArray(e);
}
l(Fa, "isPlainObject$1");
function ic(e, n) {
  if (!Fa(n)) return {};
  const t = {};
  for (const [i, r] of Object.entries(n)) {
    const a = e == null ? void 0 : e[i];
    if (Fa(r) && Fa(a)) {
      const o = ic(a, r);
      Object.keys(o).length > 0 && (t[i] = o);
    } else r !== a && (t[i] = wt(r));
  }
  return t;
}
l(ic, "computeDelta");
function rc(e) {
  var t;
  const n = ((t = e == null ? void 0 : e.getFlag) == null ? void 0 : t.call(e, En, Pn)) ?? os;
  return mi(n);
}
l(rc, "getLightCriteriaState");
async function ac(e, n) {
  const t = mi(n);
  if (!(e != null && e.setFlag))
    return t;
  const i = t.base !== null, r = t.mappings.length > 0, a = t.current !== null;
  return !i && !r && !a ? (typeof e.unsetFlag == "function" ? await e.unsetFlag(En, Pn) : await e.setFlag(En, Pn, null), os) : (await e.setFlag(En, Pn, t), t);
}
l(ac, "setLightCriteriaState");
async function _i(e, n) {
  if (typeof n != "function")
    throw new TypeError("updateLightCriteriaState requires an updater function.");
  const t = wt(rc(e)), i = await n(t);
  return ac(e, i);
}
l(_i, "updateLightCriteriaState");
async function js(e, n) {
  const t = On(n);
  if (!t)
    throw new Error("Invalid light configuration payload.");
  return _i(e, (i) => ({
    ...i,
    base: t
  }));
}
l(js, "storeBaseLighting");
async function Us(e, n, t, { label: i } = {}) {
  const r = xi(n);
  if (!r)
    throw new Error("Cannot create a mapping without at least one category selection.");
  const a = On(t);
  if (!a)
    throw new Error("Invalid light configuration payload.");
  return _i(e, (o) => {
    const s = Yn(r), c = Array.isArray(o == null ? void 0 : o.mappings) ? [...o.mappings] : [], u = c.findIndex((b) => (b == null ? void 0 : b.key) === s), d = u >= 0 ? c[u] : null, g = typeof (d == null ? void 0 : d.id) == "string" && d.id.trim() ? d.id.trim() : sc(), m = ba({
      id: g,
      categories: r,
      config: a,
      label: typeof i == "string" ? i : (d == null ? void 0 : d.label) ?? null,
      updatedAt: Date.now()
    });
    if (!m)
      throw new Error("Failed to sanitize criteria mapping entry.");
    return u >= 0 ? c[u] = m : c.push(m), {
      ...o,
      mappings: c
    };
  });
}
l(Us, "upsertLightCriteriaMapping");
async function Md(e, n, t, i, { replaceExisting: r = !1 } = {}) {
  const a = typeof n == "string" ? n.trim() : "";
  if (!a)
    throw new Error("A mapping id is required to retarget criteria.");
  const o = xi(t);
  if (!o)
    throw new Error("Cannot retarget mapping without at least one category selection.");
  const s = On(i);
  if (!s)
    throw new Error("Invalid light configuration payload.");
  return _i(e, (c) => {
    const u = Array.isArray(c == null ? void 0 : c.mappings) ? [...c.mappings] : [], d = u.findIndex((E) => (E == null ? void 0 : E.id) === a);
    if (d < 0)
      throw new Error("The selected mapping no longer exists.");
    const g = Yn(o), m = u.findIndex(
      (E, C) => C !== d && (E == null ? void 0 : E.key) === g
    );
    if (m >= 0 && !r)
      throw new Error("A mapping already exists for the selected criteria.");
    const b = u[d], h = ba({
      ...b,
      id: a,
      categories: o,
      config: s,
      updatedAt: Date.now()
    });
    if (!h)
      throw new Error("Failed to sanitize updated mapping.");
    u[d] = h;
    let y = null;
    if (m >= 0) {
      const [E] = u.splice(m, 1);
      y = (E == null ? void 0 : E.id) ?? null;
    }
    let T = (c == null ? void 0 : c.current) ?? null;
    return T && typeof T == "object" && (T.mappingId === a ? T = {
      ...T,
      mappingId: a,
      categories: o,
      updatedAt: Date.now()
    } : y && T.mappingId === y && (T = {
      ...T,
      mappingId: a,
      categories: o,
      updatedAt: Date.now()
    })), {
      ...c,
      mappings: u,
      current: T
    };
  });
}
l(Md, "retargetLightCriteriaMapping");
async function kd(e, n) {
  const t = typeof n == "string" ? n.trim() : "";
  if (!t)
    throw new Error("A mapping id is required to remove a mapping.");
  return _i(e, (i) => {
    const r = Array.isArray(i == null ? void 0 : i.mappings) ? [...i.mappings] : [], a = r.findIndex((s) => (s == null ? void 0 : s.id) === t);
    if (a < 0) return i;
    r.splice(a, 1);
    let o = (i == null ? void 0 : i.current) ?? null;
    return (o == null ? void 0 : o.mappingId) === t && (o = null), {
      ...i,
      mappings: r,
      current: o
    };
  });
}
l(kd, "removeLightCriteriaMapping");
async function ci(e, n) {
  const t = oc(n);
  return _i(e, (i) => ({
    ...i,
    current: t
  }));
}
l(ci, "storeCurrentCriteriaSelection");
function $d(e) {
  const n = mi(e), t = n.base ?? {}, i = [];
  for (const r of n.mappings) {
    const a = xi(r == null ? void 0 : r.categories);
    if (!a) continue;
    const o = ic(t, (r == null ? void 0 : r.config) ?? {});
    Object.keys(o).length !== 0 && i.push({
      criteria: a,
      delta: o
    });
  }
  return {
    base: t,
    rules: i
  };
}
l($d, "convertLightCriteriaStateToPresets");
function Dd(e, n = []) {
  const t = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Set();
  for (const c of n)
    typeof (c == null ? void 0 : c.key) == "string" && c.key.trim() && i.add(c.key.trim()), typeof (c == null ? void 0 : c.id) == "string" && c.id.trim() && typeof (c == null ? void 0 : c.key) == "string" && t.set(c.id.trim(), c.key.trim());
  const r = mi(e), a = /* @__PURE__ */ l((c) => {
    const u = {};
    for (const [d, g] of Object.entries(c ?? {})) {
      const m = String(d ?? "").trim(), b = typeof g == "string" ? g.trim() : "";
      if (!m || !b) continue;
      if (i.has(m)) {
        u[m] = b;
        continue;
      }
      const h = t.get(m);
      h && (u[h] = b);
    }
    return Object.keys(u).length ? u : null;
  }, "remapCategories"), o = r.mappings.map((c) => {
    const u = a(c.categories);
    return u ? ba({
      ...c,
      categories: u,
      key: Yn(u)
    }) : null;
  }).filter(Boolean);
  let s = r.current;
  if (s != null && s.categories) {
    const c = a(s.categories);
    s = c ? {
      ...s,
      categories: c
    } : null;
  }
  return mi({
    ...r,
    mappings: o,
    current: s
  });
}
l(Dd, "migrateLightCriteriaCategoriesToKeys");
function mi(e) {
  var c;
  const n = wt(e);
  if (!n || typeof n != "object")
    return wt(os);
  const t = On(n.base), i = Array.isArray(n.mappings) ? n.mappings : [], r = /* @__PURE__ */ new Map();
  for (const u of i) {
    const d = ba(u);
    d && r.set(d.key, d);
  }
  const a = Array.from(r.values()), o = new Map(a.map((u) => [u.id, u]));
  let s = oc(n.current);
  if (s) {
    const u = s.categories && Object.keys(s.categories).length > 0;
    if (s.mappingId && !o.has(s.mappingId)) {
      const d = u ? ((c = a.find((g) => g.key === Yn(s.categories))) == null ? void 0 : c.id) ?? null : null;
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
    base: t ?? null,
    mappings: a,
    current: s
  };
}
l(mi, "sanitizeLightCriteriaState");
function On(e) {
  const n = wt(e);
  if (!n || typeof n != "object") return null;
  "_id" in n && delete n._id, "id" in n && delete n.id;
  const t = n.flags;
  if (t && typeof t == "object") {
    const i = t[En];
    i && typeof i == "object" && (delete i[Pn], Object.keys(i).length === 0 && delete t[En]), Object.keys(t).length === 0 && delete n.flags;
  }
  return n;
}
l(On, "sanitizeLightConfigPayload");
function ba(e) {
  if (!e || typeof e != "object") return null;
  const n = xi(e.categories);
  if (!n) return null;
  const t = On(e.config);
  if (!t) return null;
  const i = typeof e.id == "string" && e.id.trim() ? e.id.trim() : sc(), r = Yn(n), a = {
    id: i,
    key: r,
    categories: n,
    config: t,
    updatedAt: Number.isFinite(e.updatedAt) ? Number(e.updatedAt) : Date.now()
  };
  return typeof e.label == "string" && e.label.trim() && (a.label = e.label.trim()), a;
}
l(ba, "sanitizeCriteriaMappingEntry");
function oc(e) {
  if (!e || typeof e != "object") return null;
  const n = typeof e.mappingId == "string" && e.mappingId.trim() ? e.mappingId.trim() : null, t = xi(e.categories);
  return !n && !t ? null : {
    mappingId: n,
    categories: t,
    updatedAt: Number.isFinite(e.updatedAt) ? Number(e.updatedAt) : Date.now()
  };
}
l(oc, "sanitizeCurrentSelection");
function xi(e) {
  const n = {};
  if (Array.isArray(e))
    for (const t of e) {
      const i = Vs((t == null ? void 0 : t.id) ?? (t == null ? void 0 : t.categoryId) ?? (t == null ? void 0 : t.category)), r = zs((t == null ? void 0 : t.value) ?? (t == null ? void 0 : t.selection) ?? (t == null ? void 0 : t.label));
      !i || !r || (n[i] = r);
    }
  else if (e && typeof e == "object")
    for (const [t, i] of Object.entries(e)) {
      const r = Vs(t), a = zs(i);
      !r || !a || (n[r] = a);
    }
  return Object.keys(n).length > 0 ? n : null;
}
l(xi, "sanitizeCriteriaCategories");
function Yn(e) {
  if (!e || typeof e != "object") return "";
  const n = Object.entries(e).filter(([, t]) => typeof t == "string" && t).map(([t, i]) => `${t}:${i}`);
  return n.sort((t, i) => t < i ? -1 : t > i ? 1 : 0), n.join("|");
}
l(Yn, "computeCriteriaMappingKey");
function sc() {
  var e;
  return (e = foundry == null ? void 0 : foundry.utils) != null && e.randomID ? foundry.utils.randomID() : typeof (crypto == null ? void 0 : crypto.randomUUID) == "function" ? crypto.randomUUID() : Math.random().toString(36).slice(2, 10);
}
l(sc, "generateLightMappingId");
function Vs(e) {
  if (typeof e != "string") return null;
  const n = e.trim();
  return n || null;
}
l(Vs, "normalizeCategoryId");
function zs(e) {
  if (typeof e != "string") return null;
  const n = e.trim();
  return n || null;
}
l(zs, "normalizeCategoryValue");
const Lr = ["AmbientLight", "Wall", "AmbientSound"];
let Or = /* @__PURE__ */ new WeakMap(), Ir = /* @__PURE__ */ new WeakMap();
const Gs = 200;
function Fd(e) {
  return e ? Number.isInteger(e.size) ? e.size : Array.isArray(e) || typeof e.length == "number" ? e.length : Array.from(e).length : 0;
}
l(Fd, "getCollectionSize");
function _a() {
  return typeof (performance == null ? void 0 : performance.now) == "function" ? performance.now() : Date.now();
}
l(_a, "nowMs$1");
function _d(e) {
  if (!Array.isArray(e)) return [];
  const n = /* @__PURE__ */ new Set();
  for (const t of e) {
    if (typeof t != "string") continue;
    const i = t.trim();
    i && n.add(i);
  }
  return Array.from(n);
}
l(_d, "uniqueStringKeys");
function xd(e, n = Gs) {
  if (!Array.isArray(e) || e.length === 0) return [];
  const t = Number.isInteger(n) && n > 0 ? n : Gs, i = [];
  for (let r = 0; r < e.length; r += t)
    i.push(e.slice(r, r + t));
  return i;
}
l(xd, "chunkArray");
async function Rd(e, n, t, i) {
  const r = xd(t, i);
  for (const a of r)
    await e.updateEmbeddedDocuments(n, a), r.length > 1 && await Promise.resolve();
  return r.length;
}
l(Rd, "updatePlaceablesInChunks");
function Pd(e) {
  const n = /* @__PURE__ */ new Set();
  for (const t of (e == null ? void 0 : e.rules) ?? [])
    for (const i of Object.keys((t == null ? void 0 : t.criteria) ?? {}))
      i && n.add(i);
  return Array.from(n);
}
l(Pd, "getPresetDependencyKeys");
function Hd(e, n) {
  const t = /* @__PURE__ */ new Map();
  for (const i of Lr) {
    const r = n.get(i) ?? [], a = /* @__PURE__ */ new Set(), o = /* @__PURE__ */ new Map();
    for (const s of r) {
      const c = cc(s, i);
      if (c != null && c.base) {
        a.add(s.id);
        for (const u of Pd(c))
          o.has(u) || o.set(u, /* @__PURE__ */ new Set()), o.get(u).add(s.id);
      }
    }
    t.set(i, {
      allDocIds: a,
      keyToDocIds: o
    });
  }
  return {
    collectionsByType: n,
    byType: t
  };
}
l(Hd, "buildPlaceableDependencyIndex");
function qd(e, n) {
  const t = Ir.get(e);
  if (t && Lr.every((r) => t.collectionsByType.get(r) === n.get(r)))
    return t;
  const i = Hd(e, n);
  return Ir.set(e, i), i;
}
l(qd, "getPlaceableDependencyIndex");
function Bd(e, n, t) {
  if (!n || !e) return [];
  const i = _d(t);
  if (!i.length)
    return typeof e.get == "function" ? Array.from(n.allDocIds).map((a) => e.get(a)).filter(Boolean) : Array.from(e).filter((a) => n.allDocIds.has(a.id));
  const r = /* @__PURE__ */ new Set();
  for (const a of i) {
    const o = n.keyToDocIds.get(a);
    if (o)
      for (const s of o) r.add(s);
  }
  return r.size ? typeof e.get == "function" ? Array.from(r).map((a) => e.get(a)).filter(Boolean) : Array.from(e).filter((a) => r.has(a.id)) : [];
}
l(Bd, "getDocsForChangedKeys");
function $n(e) {
  return !!e && typeof e == "object" && !Array.isArray(e);
}
l($n, "isPlainObject");
function vo(e, n) {
  if (Object.is(e, n)) return !0;
  if (Array.isArray(e) || Array.isArray(n)) {
    if (!Array.isArray(e) || !Array.isArray(n) || e.length !== n.length) return !1;
    for (let t = 0; t < e.length; t += 1)
      if (!vo(e[t], n[t])) return !1;
    return !0;
  }
  if ($n(e) || $n(n)) {
    if (!$n(e) || !$n(n)) return !1;
    const t = Object.keys(n);
    for (const i of t)
      if (!vo(e[i], n[i])) return !1;
    return !0;
  }
  return !1;
}
l(vo, "areValuesEqual");
function lc(e, n) {
  const t = { _id: n._id };
  for (const [r, a] of Object.entries(n)) {
    if (r === "_id") continue;
    const o = e == null ? void 0 : e[r];
    if ($n(a) && $n(o)) {
      const s = lc(o, { _id: n._id, ...a });
      if (!s) continue;
      const c = Object.keys(s).filter((u) => u !== "_id");
      if (c.length > 0) {
        t[r] = {};
        for (const u of c)
          t[r][u] = s[u];
      }
      continue;
    }
    vo(o, a) || (t[r] = a);
  }
  return Object.keys(t).filter((r) => r !== "_id").length > 0 ? t : null;
}
l(lc, "buildChangedPayload");
function cc(e, n) {
  var s;
  const t = ((s = e == null ? void 0 : e.flags) == null ? void 0 : s[re]) ?? {}, i = (t == null ? void 0 : t.presets) ?? null, r = n === "AmbientLight" ? (t == null ? void 0 : t.lightCriteria) ?? null : null, a = Or.get(e);
  if (a && a.type === n && a.rawPresets === i && a.rawLightCriteria === r)
    return a.presets;
  let o = null;
  if (t != null && t.presets) {
    const c = t.presets.base ?? null, u = Array.isArray(t.presets.rules) ? t.presets.rules : [];
    (c && Object.keys(c).length > 0 || u.length > 0) && (o = {
      base: c ?? {},
      rules: u
    });
  }
  if (!o && n === "AmbientLight" && (t != null && t.lightCriteria)) {
    const c = $d(t.lightCriteria);
    (c.base && Object.keys(c.base).length > 0 || c.rules.length > 0) && (o = {
      base: c.base,
      rules: c.rules
    });
  }
  return Or.set(e, {
    type: n,
    rawPresets: i,
    rawLightCriteria: r,
    presets: o
  }), o;
}
l(cc, "getPresetsForDocument");
function jd(e = null, n = null) {
  e ? Ir.delete(e) : Ir = /* @__PURE__ */ new WeakMap(), n ? Or.delete(n) : e || (Or = /* @__PURE__ */ new WeakMap());
}
l(jd, "invalidatePlaceableCriteriaCaches");
async function uc(e, n, t = {}) {
  var c, u;
  const i = _a(), r = {
    total: 0,
    scanned: 0,
    updated: 0,
    chunks: 0,
    byType: {},
    durationMs: 0
  };
  if (n = n ?? ((c = game.scenes) == null ? void 0 : c.viewed), !n)
    return r.durationMs = _a() - i, r;
  const a = new Set(Nd()), o = new Map(
    Lr.map((d) => [d, n.getEmbeddedCollection(d) ?? []])
  ), s = qd(n, o);
  for (const d of Lr) {
    const g = o.get(d) ?? [], m = {
      total: Fd(g),
      scanned: 0,
      updated: 0,
      chunks: 0
    }, b = s.byType.get(d) ?? null, h = Bd(g, b, t.changedKeys);
    if (m.scanned = h.length, r.total += m.total, r.scanned += m.scanned, r.byType[d] = m, !h.length) continue;
    const y = [];
    for (const T of h) {
      const E = cc(T, d);
      if (!(E != null && E.base)) continue;
      const C = Xl(E.base, E.rules ?? [], e);
      C._id = T._id, d === "AmbientLight" && a.has(T._id) && (C.hidden = !0);
      const A = (T == null ? void 0 : T._source) ?? ((u = T == null ? void 0 : T.toObject) == null ? void 0 : u.call(T)) ?? {}, k = lc(A, C);
      k && y.push(k);
    }
    y.length > 0 && (m.chunks = await Rd(n, d, y, t.chunkSize), m.updated = y.length, r.updated += y.length, r.chunks += m.chunks, console.log(`${re} | Updated ${y.length} ${d}(s)`));
  }
  return r.durationMs = _a() - i, r;
}
l(uc, "updatePlaceables");
function Ar() {
  return typeof (performance == null ? void 0 : performance.now) == "function" ? performance.now() : Date.now();
}
l(Ar, "nowMs");
const zi = /* @__PURE__ */ new Map();
function Ud(e) {
  var n;
  return e = e ?? ((n = game.scenes) == null ? void 0 : n.viewed), e ? Fi(e) : null;
}
l(Ud, "getState");
async function Vd(e, n, t = 0) {
  var b;
  const i = Ar();
  if (n = n ?? ((b = game.scenes) == null ? void 0 : b.viewed), !n) return null;
  ud(n);
  const r = Qe(n);
  if (!r.length)
    return console.warn(`${re} | applyState skipped: scene has no criteria.`), null;
  const a = Fi(n, r), o = is({ ...a, ...e ?? {} }, r), s = r.filter((h) => (a == null ? void 0 : a[h.key]) !== (o == null ? void 0 : o[h.key])).map((h) => h.key), c = s.length > 0;
  c && await Wu(n, o, r);
  const u = c ? o : a, [d, g] = await Promise.all([
    nc(u, n, { changedKeys: s }),
    uc(u, n, { changedKeys: s })
  ]), m = Ar() - i;
  return L("Criteria apply telemetry", {
    sceneId: n.id,
    changedKeys: s,
    didChange: c,
    queuedMs: t,
    durationMs: m,
    tiles: d,
    placeables: g
  }), Hooks.callAll("eidolon-utilities.criteriaStateApplied", n, u), u;
}
l(Vd, "applyStateInternal");
async function dc(e, n) {
  var c;
  if (n = n ?? ((c = game.scenes) == null ? void 0 : c.viewed), !n) return null;
  const t = n.id ?? "__viewed__", i = Ar(), r = zi.get(t) ?? Promise.resolve();
  let a = null;
  const o = r.catch(() => null).then(async () => {
    const u = Ar() - i;
    return Vd(e, n, u);
  });
  a = o;
  const s = o.finally(() => {
    zi.get(t) === s && zi.delete(t);
  });
  return zi.set(t, s), a;
}
l(dc, "applyState$1");
function zd(e) {
  var n;
  return e = e ?? ((n = game.scenes) == null ? void 0 : n.viewed), e ? Yl(e) : null;
}
l(zd, "getVersion");
async function fc(e, n) {
  var t;
  n = n ?? ((t = game.scenes) == null ? void 0 : t.viewed), n != null && n.setFlag && await n.setFlag(re, Wl, Number(e));
}
l(fc, "setVersion");
async function Gd(e) {
  return fc(Kl, e);
}
l(Gd, "markCurrentVersion");
const si = "Standard", Jd = /* @__PURE__ */ l((...e) => console.log(`${re} | criteria indexer:`, ...e), "log");
function ss(e) {
  if (typeof e != "string") return null;
  let n = e;
  try {
    n = decodeURIComponent(e);
  } catch {
  }
  const t = n.match(/\[([^\]]+)\]/);
  if (!t) return null;
  const i = t[1].split(",").map((r) => r.trim()).filter(Boolean);
  return i.length ? i : null;
}
l(ss, "parseFileTags");
function Wd(e, n, t = si) {
  return e != null && e.length ? e.map((i) => {
    const r = ss(i == null ? void 0 : i.name);
    if (!r) return {};
    const a = {};
    for (const [o, s] of Object.entries(n)) {
      const c = r[Number(o)];
      c != null && c !== t && (a[s] = c);
    }
    return a;
  }) : [];
}
l(Wd, "buildFileIndex");
function Kd(e, n) {
  return e.map((t, i) => {
    const r = [...n[t] ?? /* @__PURE__ */ new Set()].sort(), o = r.includes(si) ? si : r[0] ?? si, s = ns(t);
    return s.key = t, s.label = t.charAt(0).toUpperCase() + t.slice(1), s.values = r.length ? r : [si], s.default = s.values.includes(o) ? o : s.values[0], s.order = i, s;
  });
}
l(Kd, "buildCriteriaDefinitions");
async function Gi(e, n, t, { dryRun: i = !1 } = {}) {
  const r = e.getFlag("monks-active-tiles", "files");
  if (!(r != null && r.length)) return null;
  const a = Wd(r, n), o = tc(a, { files: r });
  for (const s of r) {
    const c = ss(s == null ? void 0 : s.name);
    if (c)
      for (const [u, d] of Object.entries(n)) {
        const g = c[Number(u)];
        g != null && t[d] && t[d].add(g);
      }
  }
  return i || (await e.setFlag(re, Tn, o), typeof e.unsetFlag == "function" && await e.unsetFlag(re, wn)), { files: r.length };
}
l(Gi, "indexTile");
async function Yd(e, n = {}) {
  var C, A, k, F;
  const {
    dryRun: t = !1,
    force: i = !1
  } = n;
  if (e = e ?? ((C = game.scenes) == null ? void 0 : C.viewed), !e) throw new Error("No scene provided to indexScene.");
  if (!globalThis.Tagger) throw new Error("Tagger is required to index scene criteria.");
  if (!i && Yl(e) >= Kl)
    throw new Error(
      `Scene "${e.name}" is already criteria-indexed. Use force: true to re-index.`
    );
  const r = { sceneId: e.id }, a = Tagger.getByTag("Map", r) ?? [];
  if (!a.length) throw new Error("No Map tile found.");
  if (a.length > 1) throw new Error(`Expected 1 Map tile, found ${a.length}.`);
  const o = a[0], s = o.getFlag("monks-active-tiles", "files");
  if (!(s != null && s.length)) throw new Error("Map tile has no MATT files.");
  const c = ss((A = s[0]) == null ? void 0 : A.name);
  if (!(c != null && c.length))
    throw new Error(`Cannot parse bracket tags from: ${((k = s[0]) == null ? void 0 : k.name) ?? "<unknown>"}`);
  if (c.length < 3)
    throw new Error(`Expected 3+ bracket tags, found ${c.length}.`);
  const u = Tagger.getByTag("Floor", r) ?? [], d = Tagger.getByTag("Roof", r) ?? [], g = Tagger.getByTag("Weather", r) ?? [];
  let m;
  const b = [];
  c.length >= 4 ? (m = { 0: "mood", 1: "stage", 2: "variant", 3: "effect" }, b.push("mood", "stage", "variant", "effect")) : (m = { 0: "mood", 1: "variant", 2: "effect" }, b.push("mood", "variant", "effect"));
  const h = { 1: "effect" }, y = {};
  for (const D of b)
    y[D] = /* @__PURE__ */ new Set();
  const T = {
    map: null,
    floor: [],
    roof: [],
    weather: []
  };
  T.map = await Gi(o, m, y, { dryRun: t });
  for (const D of u) {
    const H = await Gi(D, m, y, { dryRun: t });
    H && T.floor.push(H);
  }
  for (const D of d) {
    const H = await Gi(D, m, y, { dryRun: t });
    H && T.roof.push(H);
  }
  for (const D of g) {
    const H = await Gi(D, h, y, { dryRun: t });
    H && T.weather.push(H);
  }
  const E = Kd(b, y);
  return t || (await ha(e, E), await Gd(e)), Jd(
    t ? "Dry run complete" : "Indexing complete",
    `- ${E.length} criteria,`,
    `${((F = T.map) == null ? void 0 : F.files) ?? 0} map files`
  ), {
    criteria: E,
    state: E.reduce((D, H) => (D[H.key] = H.default, D), {}),
    tiles: T,
    overlayMode: g.length > 0
  };
}
l(Yd, "indexScene");
var sl, Me, We, Ke, hn, He, ht, Vt, sa, le, gc, mc, hc, So, pc, Lo, yc, li, Oo;
const et = class et extends Kn(Wn) {
  constructor(t = {}) {
    var i;
    super(t);
    O(this, le);
    O(this, Me, null);
    O(this, We, []);
    O(this, Ke, {});
    O(this, hn, !1);
    O(this, He, null);
    O(this, ht, null);
    O(this, Vt, null);
    O(this, sa, 120);
    this.setScene(t.scene ?? ((i = game.scenes) == null ? void 0 : i.viewed) ?? null);
  }
  setScene(t) {
    var i;
    S(this, Me, t ?? ((i = game.scenes) == null ? void 0 : i.viewed) ?? null), w(this, le, gc).call(this);
  }
  get scene() {
    return f(this, Me);
  }
  async _prepareContext() {
    var r;
    const t = !!f(this, Me), i = t && f(this, We).length > 0;
    return {
      hasScene: t,
      hasCriteria: i,
      sceneName: ((r = f(this, Me)) == null ? void 0 : r.name) ?? p("EIDOLON.CriteriaSwitcher.NoScene", "No active scene"),
      labels: {
        subtitle: p(
          "EIDOLON.CriteriaSwitcher.Subtitle",
          "Switch criteria live and immediately apply all mapped updates."
        ),
        empty: p(
          "EIDOLON.CriteriaSwitcher.Empty",
          "No criteria found for this scene. Configure criteria first."
        ),
        reset: p("EIDOLON.CriteriaSwitcher.Reset", "Reset Defaults"),
        close: p("EIDOLON.CriteriaSwitcher.Close", "Close"),
        applying: p("EIDOLON.CriteriaSwitcher.Applying", "Applying changes..."),
        ready: p("EIDOLON.CriteriaSwitcher.Ready", "Ready")
      },
      criteria: f(this, We).map((a) => ({
        key: a.key,
        label: a.label || a.key,
        values: a.values.map((o) => {
          var s;
          return {
            value: o,
            selected: ((s = f(this, Ke)) == null ? void 0 : s[a.key]) === o
          };
        }),
        defaultValue: a.default
      })),
      stateSummary: w(this, le, Oo).call(this)
    };
  }
  _onRender(t, i) {
    super._onRender(t, i), w(this, le, mc).call(this), w(this, le, hc).call(this);
  }
  async _onClose(t) {
    return f(this, He) !== null && (clearTimeout(f(this, He)), S(this, He, null)), f(this, Vt) !== null && (Hooks.off("eidolon-utilities.criteriaStateApplied", f(this, Vt)), S(this, Vt, null)), super._onClose(t);
  }
};
Me = new WeakMap(), We = new WeakMap(), Ke = new WeakMap(), hn = new WeakMap(), He = new WeakMap(), ht = new WeakMap(), Vt = new WeakMap(), sa = new WeakMap(), le = new WeakSet(), gc = /* @__PURE__ */ l(function() {
  if (!f(this, Me)) {
    S(this, We, []), S(this, Ke, {});
    return;
  }
  S(this, We, Qe(f(this, Me)).sort((t, i) => t.order - i.order)), S(this, Ke, Fi(f(this, Me), f(this, We)));
}, "#hydrateFromScene"), mc = /* @__PURE__ */ l(function() {
  var i, r;
  const t = this.element;
  t instanceof HTMLElement && (t.querySelectorAll("[data-criteria-key]").forEach((a) => {
    a.addEventListener("change", (o) => {
      const s = o.currentTarget;
      if (!(s instanceof HTMLSelectElement)) return;
      const c = s.dataset.criteriaKey;
      c && (S(this, Ke, {
        ...f(this, Ke),
        [c]: s.value
      }), w(this, le, pc).call(this, { [c]: s.value }));
    });
  }), (i = t.querySelector("[data-action='reset-defaults']")) == null || i.addEventListener("click", () => {
    w(this, le, yc).call(this);
  }), (r = t.querySelector("[data-action='close-switcher']")) == null || r.addEventListener("click", () => {
    this.close();
  }));
}, "#bindEvents"), hc = /* @__PURE__ */ l(function() {
  f(this, Vt) === null && S(this, Vt, Hooks.on("eidolon-utilities.criteriaStateApplied", (t, i) => {
    !f(this, Me) || (t == null ? void 0 : t.id) !== f(this, Me).id || f(this, hn) || (S(this, Ke, { ...i ?? {} }), this.render({ force: !0 }));
  }));
}, "#ensureSyncHook"), So = /* @__PURE__ */ l(async function(t) {
  var i, r;
  if (f(this, Me)) {
    w(this, le, li).call(this, "applying"), S(this, hn, !0);
    try {
      const a = await dc(t, f(this, Me));
      a && S(this, Ke, a), w(this, le, li).call(this, "ready"), this.render({ force: !0 });
    } catch (a) {
      console.error(`${re} | Failed to apply criteria state`, a), (r = (i = ui.notifications) == null ? void 0 : i.error) == null || r.call(
        i,
        p(
          "EIDOLON.CriteriaSwitcher.ApplyError",
          "Failed to apply the selected criteria state."
        )
      ), w(this, le, li).call(this, "error", (a == null ? void 0 : a.message) ?? "Unknown error");
    } finally {
      S(this, hn, !1), f(this, ht) && w(this, le, Lo).call(this);
    }
  }
}, "#applyPartialState"), pc = /* @__PURE__ */ l(function(t) {
  S(this, ht, {
    ...f(this, ht) ?? {},
    ...t ?? {}
  }), f(this, He) !== null && clearTimeout(f(this, He)), w(this, le, li).call(this, "applying"), S(this, He, setTimeout(() => {
    S(this, He, null), w(this, le, Lo).call(this);
  }, f(this, sa)));
}, "#queuePartialState"), Lo = /* @__PURE__ */ l(async function() {
  if (f(this, hn) || !f(this, ht)) return;
  const t = f(this, ht);
  S(this, ht, null), await w(this, le, So).call(this, t);
}, "#flushPendingState"), yc = /* @__PURE__ */ l(async function() {
  if (!f(this, We).length) return;
  const t = f(this, We).reduce((i, r) => (i[r.key] = r.default, i), {});
  S(this, Ke, t), f(this, He) !== null && (clearTimeout(f(this, He)), S(this, He, null)), S(this, ht, null), await w(this, le, So).call(this, t);
}, "#resetToDefaults"), li = /* @__PURE__ */ l(function(t, i = "") {
  const r = this.element;
  if (!(r instanceof HTMLElement)) return;
  const a = r.querySelector("[data-role='status']");
  if (a instanceof HTMLElement)
    switch (a.dataset.mode = t, t) {
      case "applying":
        a.textContent = p("EIDOLON.CriteriaSwitcher.Applying", "Applying changes...");
        break;
      case "error":
        a.textContent = `${p("EIDOLON.CriteriaSwitcher.Error", "Error")}: ${i}`;
        break;
      case "ready":
      default:
        a.textContent = `${p("EIDOLON.CriteriaSwitcher.Ready", "Ready")}: ${w(this, le, Oo).call(this)}`;
        break;
    }
}, "#setStatus"), Oo = /* @__PURE__ */ l(function() {
  return f(this, We).length ? `[${f(this, We).map((t) => {
    var i;
    return ((i = f(this, Ke)) == null ? void 0 : i[t.key]) ?? t.default;
  }).join(" | ")}]` : "-";
}, "#formatStateSummary"), l(et, "CriteriaSwitcherApplication"), Re(et, "APP_ID", `${re}-criteria-switcher`), Re(et, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  ct(et, et, "DEFAULT_OPTIONS"),
  {
    id: et.APP_ID,
    classes: Array.from(
      /* @__PURE__ */ new Set([...((sl = ct(et, et, "DEFAULT_OPTIONS")) == null ? void 0 : sl.classes) ?? [], "eidolon-criteria-switcher-window", "themed"])
    ),
    tag: "section",
    window: {
      title: p("EIDOLON.CriteriaSwitcher.Title", "Criteria Switcher"),
      icon: "fa-solid fa-sliders",
      resizable: !1
    },
    position: {
      width: 420,
      height: "auto"
    }
  },
  { inplace: !1 }
)), Re(et, "PARTS", {
  content: {
    template: `modules/${re}/templates/criteria-switcher.html`
  }
});
let Co = et;
const Qd = ga(Co);
let vn = null;
function Xd(e) {
  var n;
  return e ?? ((n = game.scenes) == null ? void 0 : n.viewed) ?? null;
}
l(Xd, "resolveScene");
function Zd(e) {
  var n;
  return !!(e != null && e.rendered && ((n = e == null ? void 0 : e.element) != null && n.isConnected));
}
l(Zd, "isRendered");
function wa() {
  return Zd(vn) ? vn : (vn = null, null);
}
l(wa, "getCriteriaSwitcher");
function bc(e) {
  var i, r, a, o, s;
  const n = Xd(e);
  if (!n)
    return (r = (i = ui.notifications) == null ? void 0 : i.warn) == null || r.call(i, "No active scene to open the criteria switcher."), null;
  if (!pa(n))
    return (o = (a = ui.notifications) == null ? void 0 : a.warn) == null || o.call(a, "You do not have permission to manage scene criteria."), null;
  const t = wa();
  return t ? (t.setScene(n), t.render({ force: !0 }), (s = t.bringToFront) == null || s.call(t), t) : (vn = Qd({ scene: n }), vn.render({ force: !0 }), vn);
}
l(bc, "openCriteriaSwitcher");
function wc() {
  const e = wa();
  e && (e.close(), vn = null);
}
l(wc, "closeCriteriaSwitcher");
function ls(e) {
  return wa() ? (wc(), null) : bc(e);
}
l(ls, "toggleCriteriaSwitcher");
const ef = {
  SCHEMA_VERSION: rs,
  applyState: dc,
  getState: Ud,
  getVersion: zd,
  setVersion: fc,
  getCriteria(e) {
    var n;
    return Qe(e ?? ((n = game.scenes) == null ? void 0 : n.viewed));
  },
  setCriteria(e, n) {
    var t;
    return ha(n ?? ((t = game.scenes) == null ? void 0 : t.viewed), e);
  },
  updateTiles: nc,
  updatePlaceables: uc,
  indexScene: Yd,
  openCriteriaSwitcher: bc,
  closeCriteriaSwitcher: wc,
  toggleCriteriaSwitcher: ls,
  findBestMatch: ad,
  findFileIndex: od,
  resolveRules: Xl
};
function Tc(e) {
  var n;
  return ((n = e == null ? void 0 : e.getFlag) == null ? void 0 : n.call(e, "monks-active-tiles", "files")) ?? [];
}
l(Tc, "getTileFiles$1");
function tf(e = []) {
  return {
    strategy: "select-one",
    defaultTarget: Qt(e, 0) ?? { indexHint: 0 },
    variants: [
      {
        criteria: {},
        target: Qt(e, 0) ?? { indexHint: 0 }
      }
    ]
  };
}
l(tf, "createDefaultTileCriteria");
function nf(e, n = {}) {
  var o, s;
  const { allowLegacy: t = !0 } = n, i = Tc(e), r = (o = e == null ? void 0 : e.getFlag) == null ? void 0 : o.call(e, re, Tn);
  if (r) return Ln(r, { files: i });
  if (!t) return null;
  const a = (s = e == null ? void 0 : e.getFlag) == null ? void 0 : s.call(e, re, wn);
  return a ? Ln(a, { files: i }) : null;
}
l(nf, "getTileCriteria");
async function Js(e, n, t = {}) {
  if (!(e != null && e.setFlag)) return null;
  const {
    strictValidation: i = !0
  } = t, r = Tc(e), a = Ln(n, { files: r });
  if (!a)
    return typeof e.unsetFlag == "function" ? (await e.unsetFlag(re, Tn), await e.unsetFlag(re, wn)) : (await e.setFlag(re, Tn, null), await e.setFlag(re, wn, null)), null;
  if (i) {
    const o = ec(a, { files: r });
    if (o.errors.length > 0)
      throw new Error(
        `Tile criteria contains ${o.errors.length} conflicting rule pair(s). Resolve clashes before saving.`
      );
  }
  return await e.setFlag(re, Tn, a), typeof e.unsetFlag == "function" && await e.unsetFlag(re, wn), a;
}
l(Js, "setTileCriteria");
const Io = "__eidolon_any__", $t = "eidolon-tile-criteria", rf = "fa-solid fa-sliders", Ec = Symbol.for("eidolon.tileCriteriaUiState"), Ta = ["all", "unmapped", "mapped", "conflicts"];
function af(e) {
  const n = e == null ? void 0 : e[Ec];
  return !n || typeof n != "object" ? {
    filterQuery: "",
    filterMode: "all",
    selectedFileIndex: null
  } : {
    filterQuery: typeof n.filterQuery == "string" ? n.filterQuery : "",
    filterMode: Ta.includes(n.filterMode) ? n.filterMode : "all",
    selectedFileIndex: Number.isInteger(n.selectedFileIndex) ? n.selectedFileIndex : null
  };
}
l(af, "readUiState");
function of(e, n) {
  if (!e || !n) return;
  typeof n.filterQuery == "string" && (e.filterQuery = n.filterQuery), Ta.includes(n.filterMode) && (e.filterMode = n.filterMode), Number.isInteger(n.selectedFileIndex) && e.fileEntries.some((i) => i.index === n.selectedFileIndex) && (e.selectedFileIndex = n.selectedFileIndex);
}
l(of, "applyUiState");
function sf(e) {
  const n = e == null ? void 0 : e.app, t = e == null ? void 0 : e.state;
  !n || !t || (n[Ec] = {
    filterQuery: typeof t.filterQuery == "string" ? t.filterQuery : "",
    filterMode: Ta.includes(t.filterMode) ? t.filterMode : "all",
    selectedFileIndex: Number.isInteger(t.selectedFileIndex) ? t.selectedFileIndex : null
  });
}
l(sf, "persistUiState");
function lf(e) {
  const n = (e == null ? void 0 : e.object) ?? (e == null ? void 0 : e.document) ?? null;
  return !(n != null && n.isEmbedded) || n.documentName !== "Tile" ? null : n;
}
l(lf, "getTileDocument");
function cf(e) {
  var n;
  return ((n = e == null ? void 0 : e.getFlag) == null ? void 0 : n.call(e, "monks-active-tiles", "files")) ?? [];
}
l(cf, "getTileFiles");
function uf(e, n) {
  var s;
  const t = (e == null ? void 0 : e.parent) ?? ((s = game.scenes) == null ? void 0 : s.viewed) ?? null, r = Qe(t).sort((c, u) => c.order - u.order).map((c) => ({
    key: c.key,
    label: c.label || c.key,
    values: [...c.values ?? []]
  })), a = new Set(r.map((c) => c.key)), o = /* @__PURE__ */ new Map();
  for (const c of (n == null ? void 0 : n.variants) ?? [])
    for (const [u, d] of Object.entries((c == null ? void 0 : c.criteria) ?? {}))
      a.has(u) || (o.has(u) || o.set(u, /* @__PURE__ */ new Set()), typeof d == "string" && d.trim() && o.get(u).add(d.trim()));
  for (const [c, u] of o.entries())
    r.push({
      key: c,
      label: c,
      values: [...u]
    });
  return r;
}
l(uf, "getCriteriaDefinitions");
function df(e) {
  const n = {
    folders: /* @__PURE__ */ new Map(),
    files: []
  };
  for (const t of e) {
    const r = (t.path || t.label).split("/").filter(Boolean);
    if (!r.length) {
      n.files.push({ entry: t, name: t.label });
      continue;
    }
    const a = r.pop();
    let o = n;
    for (const s of r)
      o.folders.has(s) || o.folders.set(s, {
        folders: /* @__PURE__ */ new Map(),
        files: []
      }), o = o.folders.get(s);
    o.files.push({ entry: t, name: a || t.label });
  }
  return n;
}
l(df, "buildTree");
function ff(e, n) {
  const t = [e];
  let i = n;
  for (; i.files.length === 0 && i.folders.size === 1; ) {
    const [r, a] = i.folders.entries().next().value;
    t.push(r), i = a;
  }
  return {
    label: t.join("/"),
    node: i
  };
}
l(ff, "collapseFolderBranch");
function gf(e, n) {
  const t = e.rulesByFile.get(n) ?? [], i = [];
  for (const r of t) {
    const a = Object.entries(r.criteria ?? {}).filter(([, s]) => typeof s == "string" && s.trim());
    if (!a.length) {
      i.push("*");
      continue;
    }
    const o = a.map(([s, c]) => `${e.criteriaLabels.get(s) ?? s}: ${c}`).join(" · ");
    i.push(o);
  }
  return i;
}
l(gf, "getRuleSummariesForFile");
function Ao(e) {
  var b, h;
  const n = cf(e), t = as(n), i = nf(e, { allowLegacy: !0 }) ?? tf(n), r = uf(e, i), a = new Map(r.map((y) => [y.key, y.label])), o = new Map(
    t.map((y) => [
      y.index,
      y.path || y.label
    ])
  ), s = gi(i.defaultTarget, n), c = ((b = t[0]) == null ? void 0 : b.index) ?? 0, u = s >= 0 ? s : c, d = new Map(t.map((y) => [y.index, []]));
  let g = 1;
  for (const y of i.variants ?? []) {
    const T = gi(y.target, n);
    T < 0 || (d.has(T) || d.set(T, []), d.get(T).push({
      id: g,
      criteria: { ...y.criteria ?? {} }
    }), g += 1);
  }
  const m = t.some((y) => y.index === u) ? u : ((h = t[0]) == null ? void 0 : h.index) ?? null;
  return {
    files: n,
    fileEntries: t,
    criteriaDefinitions: r,
    criteriaLabels: a,
    relativePaths: o,
    defaultIndex: u,
    selectedFileIndex: m,
    filterQuery: "",
    filterMode: "all",
    nextRuleId: g,
    rulesByFile: d,
    status: {
      mode: "ready",
      message: p("EIDOLON.TileCriteria.Ready", "Ready")
    }
  };
}
l(Ao, "buildEditorState");
function No(e, n) {
  return e.rulesByFile.has(n) || e.rulesByFile.set(n, []), e.rulesByFile.get(n);
}
l(No, "getRulesForFile");
function mf(e) {
  return Object.fromEntries(
    Object.entries(e ?? {}).filter(([n, t]) => typeof n == "string" && n && typeof t == "string" && t.trim()).map(([n, t]) => [n, t.trim()])
  );
}
l(mf, "sanitizeRuleCriteria");
function vc(e) {
  const n = Qt(e.files, e.defaultIndex);
  if (!n) return null;
  const t = [], i = [];
  for (const [a, o] of e.rulesByFile.entries()) {
    const s = Qt(e.files, a);
    if (s)
      for (const [c, u] of o.entries()) {
        const d = mf(u.criteria);
        t.push({
          criteria: d,
          target: { ...s }
        }), i.push({
          fileIndex: a,
          ruleId: u.id,
          rulePosition: c,
          criteria: d
        });
      }
  }
  return t.length || (t.push({
    criteria: {},
    target: { ...n }
  }), i.push({
    fileIndex: e.defaultIndex,
    ruleId: null,
    rulePosition: null,
    criteria: {},
    isFallback: !0
  })), {
    normalized: Ln(
      {
        strategy: "select-one",
        defaultTarget: n,
        variants: t
      },
      { files: e.files }
    ),
    sources: i
  };
}
l(vc, "buildTileCriteriaDraft");
function hf(e) {
  var n;
  return ((n = vc(e)) == null ? void 0 : n.normalized) ?? null;
}
l(hf, "exportTileCriteria");
function Ws(e) {
  const n = vc(e);
  if (!(n != null && n.normalized))
    return {
      errors: [],
      warnings: [],
      errorFileIndexes: [],
      warningFileIndexes: []
    };
  const t = ec(n.normalized, { files: e.files }), i = /* @__PURE__ */ l((s) => {
    const c = n.sources[s.leftIndex] ?? null, u = n.sources[s.rightIndex] ?? null;
    return {
      ...s,
      leftFileIndex: c == null ? void 0 : c.fileIndex,
      rightFileIndex: u == null ? void 0 : u.fileIndex
    };
  }, "mapConflict"), r = t.errors.map((s) => i(s)), a = t.warnings.map((s) => i(s)), o = /* @__PURE__ */ l((s) => {
    const c = /* @__PURE__ */ new Set();
    for (const u of s)
      Number.isInteger(u.leftFileIndex) && c.add(u.leftFileIndex), Number.isInteger(u.rightFileIndex) && c.add(u.rightFileIndex);
    return [...c];
  }, "toFileIndexes");
  return {
    errors: r,
    warnings: a,
    errorFileIndexes: o(r),
    warningFileIndexes: o(a)
  };
}
l(Ws, "analyzeRuleConflicts");
function Ji(e, n = "neutral") {
  const t = document.createElement("span");
  return t.classList.add("eidolon-tile-criteria__badge"), t.dataset.kind = n, t.textContent = e, t;
}
l(Ji, "createBadge");
function pf(e, n = {}) {
  const t = typeof e == "string" ? e : "", {
    maxLength: i = 42,
    headLength: r = 20,
    tailLength: a = 16
  } = n;
  if (!t || t.length <= i) return t;
  const o = t.slice(0, r).trimEnd(), s = t.slice(-a).trimStart();
  return `${o}...${s}`;
}
l(pf, "middleEllipsis");
function yf(e) {
  const n = typeof e == "string" ? e.trim() : "";
  if (!n)
    return {
      error: "",
      matches: /* @__PURE__ */ l(() => !0, "matches")
    };
  let t = n, i = "i";
  if (n.startsWith("/") && n.length > 1) {
    const r = n.lastIndexOf("/");
    r > 0 && (t = n.slice(1, r), i = n.slice(r + 1) || "i");
  }
  i = i.replace(/g/g, "");
  try {
    const r = new RegExp(t, i);
    return {
      error: "",
      matches: /* @__PURE__ */ l((a) => r.test(String(a ?? "")), "matches")
    };
  } catch (r) {
    return {
      error: (r == null ? void 0 : r.message) ?? p("EIDOLON.TileCriteria.InvalidRegex", "Invalid regex."),
      matches: /* @__PURE__ */ l(() => !0, "matches")
    };
  }
}
l(yf, "createRegexFilter");
function bf(e, n) {
  const t = document.createElement("select");
  t.dataset.criteriaKey = e.key;
  const i = document.createElement("option");
  i.value = Io, i.textContent = "*", t.appendChild(i);
  const r = new Set(e.values ?? []);
  n && !r.has(n) && r.add(n);
  for (const a of r) {
    const o = document.createElement("option");
    o.value = a, o.textContent = a, t.appendChild(o);
  }
  return t.value = n ?? Io, t;
}
l(bf, "createCriterionSelect");
function wf(e, n, t, i) {
  var s;
  const r = document.createElement("div");
  r.classList.add("eidolon-tile-criteria__rule-editor");
  const a = document.createElement("div");
  a.classList.add("eidolon-tile-criteria__rule-grid");
  for (const c of n.criteriaDefinitions) {
    const u = document.createElement("label");
    u.classList.add("eidolon-tile-criteria__rule-field");
    const d = document.createElement("span");
    d.classList.add("eidolon-tile-criteria__criterion-label"), d.textContent = c.label, u.appendChild(d);
    const g = bf(c, (s = e.criteria) == null ? void 0 : s[c.key]);
    g.addEventListener("change", () => {
      g.value === Io ? delete e.criteria[c.key] : e.criteria[c.key] = g.value, i();
    }), u.appendChild(g), a.appendChild(u);
  }
  r.appendChild(a);
  const o = document.createElement("button");
  return o.type = "button", o.classList.add("control", "ui-control", "eidolon-tile-criteria__rule-remove"), o.textContent = p("EIDOLON.TileCriteria.RemoveRule", "Remove"), o.addEventListener("click", () => {
    const u = No(n, t).filter((d) => d.id !== e.id);
    n.rulesByFile.set(t, u), i();
  }), r.appendChild(o), r;
}
l(wf, "renderRuleEditor");
const ar = /* @__PURE__ */ new WeakMap();
function Cc(e) {
  return (e == null ? void 0 : e.app) ?? (e == null ? void 0 : e.tile) ?? null;
}
l(Cc, "getDialogOwner");
function Tf(e) {
  for (const n of e) {
    const t = Dt(n);
    if (t) return t;
    const i = Dt(n == null ? void 0 : n.element);
    if (i) return i;
  }
  return null;
}
l(Tf, "findDialogRoot$1");
function Ef(e, n, t) {
  const i = e.state, r = i.fileEntries.find((y) => y.index === n);
  if (!r) return document.createElement("div");
  const a = document.createElement("section");
  a.classList.add("eidolon-tile-criteria__dialog-content");
  const o = document.createElement("header");
  o.classList.add("eidolon-tile-criteria__editor-header");
  const s = document.createElement("h4");
  s.textContent = i.relativePaths.get(r.index) || r.label, o.appendChild(s);
  const c = document.createElement("p");
  c.classList.add("notes"), c.textContent = `#${r.index + 1} · ${r.path || p("EIDOLON.TileCriteria.UnknownPath", "Unknown path")}`, o.appendChild(c), a.appendChild(o);
  const u = document.createElement("div");
  u.classList.add("eidolon-tile-criteria__editor-controls");
  const d = document.createElement("button");
  d.type = "button", d.classList.add("control", "ui-control", "eidolon-tile-criteria__editor-action"), i.defaultIndex === r.index ? (d.textContent = p("EIDOLON.TileCriteria.IsDefault", "Default Target"), d.disabled = !0) : (d.textContent = p("EIDOLON.TileCriteria.SetDefault", "Set As Default"), d.addEventListener("click", () => {
    i.defaultIndex = r.index, De(e), t();
  })), u.appendChild(d);
  const g = document.createElement("button");
  g.type = "button", g.classList.add("control", "ui-control", "eidolon-tile-criteria__editor-action", "secondary"), g.textContent = p("EIDOLON.TileCriteria.ClearFileRules", "Clear File Rules"), g.addEventListener("click", () => {
    i.rulesByFile.set(r.index, []), De(e), t();
  }), u.appendChild(g), a.appendChild(u);
  const m = document.createElement("div");
  m.classList.add("eidolon-tile-criteria__rule-editors");
  const b = No(i, r.index);
  if (b.length)
    for (const y of b)
      m.appendChild(
        wf(y, i, r.index, () => {
          De(e), t();
        })
      );
  else {
    const y = document.createElement("p");
    y.classList.add("notes"), y.textContent = p(
      "EIDOLON.TileCriteria.NoRulesForFile",
      "No rules map to this file yet. Add one to define when this variant should be active."
    ), m.appendChild(y);
  }
  a.appendChild(m);
  const h = document.createElement("button");
  return h.type = "button", h.classList.add("control", "ui-control", "eidolon-tile-criteria__editor-action"), h.textContent = p("EIDOLON.TileCriteria.AddRule", "Add Rule"), h.disabled = !i.criteriaDefinitions.length, h.addEventListener("click", () => {
    No(i, r.index).push({
      id: i.nextRuleId,
      criteria: {}
    }), i.nextRuleId += 1, De(e), t();
  }), a.appendChild(h), a;
}
l(Ef, "buildRuleEditorContent");
function vf(e, n) {
  var g, m, b;
  const t = Cc(e);
  if (!t) return;
  const i = ar.get(t);
  if (i) {
    i.controller = e, i.fileIndex = n, (g = i.refresh) == null || g.call(i);
    return;
  }
  const r = {
    controller: e,
    fileIndex: n,
    host: null,
    refresh: null
  };
  ar.set(t, r);
  const a = /* @__PURE__ */ l(() => {
    ar.delete(t);
  }, "closeDialog"), o = /* @__PURE__ */ l(() => {
    r.host instanceof HTMLElement && r.host.replaceChildren(
      Ef(r.controller, r.fileIndex, o)
    );
  }, "refreshDialog");
  r.refresh = o;
  const s = p("EIDOLON.TileCriteria.EditorTitle", "Edit Tile Criteria Rules"), c = '<div class="eidolon-tile-criteria-editor-host"></div>', u = p("EIDOLON.TileCriteria.CloseEditor", "Close"), d = (b = (m = foundry == null ? void 0 : foundry.applications) == null ? void 0 : m.api) == null ? void 0 : b.DialogV2;
  if (typeof (d == null ? void 0 : d.wait) == "function") {
    d.wait({
      window: { title: s },
      content: c,
      buttons: [{ action: "close", label: u, default: !0 }],
      render: /* @__PURE__ */ l((...h) => {
        var E;
        const y = Tf(h), T = (E = y == null ? void 0 : y.querySelector) == null ? void 0 : E.call(y, ".eidolon-tile-criteria-editor-host");
        T instanceof HTMLElement && (r.host = T, o());
      }, "render"),
      close: a,
      rejectClose: !1
    }).catch((h) => {
      console.warn(`${re} | Rule editor dialog failed`, h), a();
    });
    return;
  }
  a();
}
l(vf, "openRuleEditorDialog");
function Ks(e) {
  var i;
  const n = Cc(e);
  if (!n) return;
  const t = ar.get(n);
  (i = t == null ? void 0 : t.refresh) == null || i.call(t);
}
l(Ks, "refreshOpenRuleEditor");
function Mo(e, n) {
  return (e.rulesByFile.get(n) ?? []).length > 0;
}
l(Mo, "hasRulesForFile");
function Sc(e, n) {
  var t, i;
  return ((t = e == null ? void 0 : e.errorFileIndexes) == null ? void 0 : t.includes(n)) || ((i = e == null ? void 0 : e.warningFileIndexes) == null ? void 0 : i.includes(n));
}
l(Sc, "hasConflictForFile");
function Cf(e, n, t) {
  switch (e.filterMode) {
    case "unmapped":
      return !Mo(e, n.index);
    case "mapped":
      return Mo(e, n.index);
    case "conflicts":
      return Sc(t, n.index);
    case "all":
    default:
      return !0;
  }
}
l(Cf, "matchesFilterMode");
function Sf(e, n) {
  let t = 0, i = 0, r = 0;
  for (const a of e.fileEntries)
    Mo(e, a.index) ? t += 1 : i += 1, Sc(n, a.index) && (r += 1);
  return {
    all: e.fileEntries.length,
    mapped: t,
    unmapped: i,
    conflicts: r
  };
}
l(Sf, "getFilterModeCounts");
function Lf(e) {
  switch (e) {
    case "unmapped":
      return p("EIDOLON.TileCriteria.FilterModeUnmapped", "Unmapped");
    case "mapped":
      return p("EIDOLON.TileCriteria.FilterModeMapped", "Mapped");
    case "conflicts":
      return p("EIDOLON.TileCriteria.FilterModeConflicts", "Clashes");
    case "all":
    default:
      return p("EIDOLON.TileCriteria.FilterModeAll", "All");
  }
}
l(Lf, "getFilterModeLabel");
function Lc(e, n, t, i, r) {
  var u, d;
  const a = [...e.folders.keys()].sort((g, m) => g.localeCompare(m));
  for (const g of a) {
    const m = ff(g, e.folders.get(g)), b = document.createElement("li");
    b.classList.add("eidolon-tile-criteria__tree-branch");
    const h = document.createElement("div");
    h.classList.add("document", "folder", "update", "eidolon-tile-criteria__folder-row");
    const y = document.createElement("i");
    y.classList.add("fa-solid", "fa-folder-open"), h.appendChild(y);
    const T = document.createElement("span");
    T.classList.add("eidolon-tile-criteria__tree-folder-label"), T.textContent = m.label, T.title = m.label, h.appendChild(T), b.appendChild(h);
    const E = document.createElement("ul");
    E.classList.add("eidolon-tile-criteria__tree"), E.dataset.folder = m.label, Lc(m.node, n, t, i, E), E.childElementCount > 0 && b.appendChild(E), r.appendChild(b);
  }
  const o = [...e.files].sort((g, m) => g.name.localeCompare(m.name));
  if (!o.length) return;
  const s = document.createElement("li"), c = document.createElement("ul");
  c.classList.add("document-list", "eidolon-tile-criteria__document-list");
  for (const g of o) {
    const m = g.entry, b = m.index === n.selectedFileIndex, h = m.index === n.defaultIndex, y = gf(n, m.index), T = document.createElement("li");
    T.classList.add("document", "update", "eidolon-tile-criteria__tree-file");
    const E = document.createElement("button");
    E.type = "button", E.classList.add("eidolon-tile-criteria__file-row");
    const C = (u = i == null ? void 0 : i.errorFileIndexes) == null ? void 0 : u.includes(m.index), A = (d = i == null ? void 0 : i.warningFileIndexes) == null ? void 0 : d.includes(m.index);
    C ? E.classList.add("has-conflict") : A && E.classList.add("has-warning");
    const k = n.relativePaths.get(m.index) || m.path || g.name, F = [k];
    C ? F.push(
      p(
        "EIDOLON.TileCriteria.ConflictFileHint",
        "This file participates in one or more conflicting rules."
      )
    ) : A && F.push(
      p(
        "EIDOLON.TileCriteria.WarningFileHint",
        "This file has potentially redundant rules."
      )
    ), y.length || F.push(
      p(
        "EIDOLON.TileCriteria.UnmappedHint",
        "No criteria rules map to this file."
      )
    ), E.title = F.join(`
`), b && E.classList.add("is-selected"), E.addEventListener("click", () => {
      n.selectedFileIndex = m.index, De(t), vf(t, m.index);
    });
    const D = document.createElement("span");
    D.classList.add("eidolon-tile-criteria__indicator"), D.dataset.kind = h ? "default" : y.length ? "mapped" : "unmapped", E.appendChild(D);
    const H = document.createElement("span");
    H.classList.add("eidolon-tile-criteria__file-content");
    const te = document.createElement("span");
    te.classList.add("eidolon-tile-criteria__file-heading");
    const ne = document.createElement("span");
    ne.classList.add("eidolon-tile-criteria__file-title"), ne.textContent = pf(g.name || m.label), ne.title = k, te.appendChild(ne);
    const U = Ji(`#${m.index + 1}`, "meta");
    U.classList.add("eidolon-tile-criteria__index-badge"), te.appendChild(U), H.appendChild(te);
    const Q = document.createElement("span");
    Q.classList.add("eidolon-tile-criteria__badges"), h && Q.appendChild(Ji(p("EIDOLON.TileCriteria.DefaultBadge", "Default"), "default"));
    const _ = y.slice(0, 2);
    for (const G of _)
      Q.appendChild(Ji(G, "rule"));
    if (y.length > _.length && Q.appendChild(Ji(`+${y.length - _.length}`, "meta")), H.appendChild(Q), E.appendChild(H), C || A) {
      const G = document.createElement("span");
      G.classList.add("eidolon-tile-criteria__row-warning"), G.dataset.mode = C ? "error" : "warning", G.innerHTML = '<i class="fa-solid fa-triangle-exclamation" inert=""></i>', E.appendChild(G);
    }
    T.appendChild(E), c.appendChild(T);
  }
  s.appendChild(c), r.appendChild(s);
}
l(Lc, "renderTreeNode");
function Of(e, n, t, i = {}) {
  const r = document.createElement("section");
  r.classList.add("eidolon-tile-criteria__tree-panel");
  const a = yf(e.filterQuery), o = Sf(e, t);
  e.filterMode !== "all" && o[e.filterMode] === 0 && (e.filterMode = "all");
  const s = document.createElement("div");
  s.classList.add("eidolon-tile-criteria__toolbar");
  const c = document.createElement("div");
  c.classList.add("eidolon-tile-criteria__mode-bar");
  for (const C of Ta) {
    const A = document.createElement("button");
    A.type = "button", A.classList.add("control", "ui-control", "eidolon-tile-criteria__mode-button"), A.dataset.mode = C, A.textContent = Lf(C);
    const k = C === "all" || o[C] > 0;
    A.disabled = !k, k || (A.dataset.tooltip = p(
      "EIDOLON.TileCriteria.FilterModeUnavailable",
      "No entries currently match this filter."
    ), A.title = A.dataset.tooltip), e.filterMode === C ? (A.classList.add("is-active"), A.setAttribute("aria-pressed", "true")) : A.setAttribute("aria-pressed", "false"), A.addEventListener("click", () => {
      e.filterMode !== C && (e.filterMode = C, De(n));
    }), c.appendChild(A);
  }
  s.appendChild(c);
  const u = document.createElement("div");
  u.classList.add("eidolon-tile-criteria__filter-row");
  const d = document.createElement("input");
  d.type = "text", d.classList.add("eidolon-tile-criteria__filter-input"), d.placeholder = p("EIDOLON.TileCriteria.FilterPlaceholder", "Regex filter (path)"), d.value = e.filterQuery, d.autocomplete = "off", d.addEventListener("keydown", (C) => {
    C.stopPropagation(), C.key === "Enter" && C.preventDefault();
  }), d.addEventListener("keyup", (C) => {
    C.stopPropagation();
  }), d.addEventListener("change", (C) => {
    C.stopPropagation();
  }), d.addEventListener("input", (C) => {
    C.stopPropagation();
    const A = d.selectionStart ?? d.value.length, k = d.selectionEnd ?? A;
    e.filterQuery = d.value, De(n), requestAnimationFrame(() => {
      const F = n.section.querySelector(".eidolon-tile-criteria__filter-input");
      if (F instanceof HTMLInputElement) {
        F.focus();
        try {
          F.setSelectionRange(A, k);
        } catch {
        }
      }
    });
  }), u.appendChild(d);
  const g = document.createElement("div");
  g.classList.add("eidolon-tile-criteria__toolbar-actions");
  const m = document.createElement("button");
  m.type = "button";
  const b = p("EIDOLON.TileCriteria.Save", "Save Rules");
  m.classList.add("control", "ui-control", "eidolon-tile-criteria__toolbar-action", "icon-only"), m.dataset.tooltip = b, m.setAttribute("aria-label", b), m.title = b, m.innerHTML = '<i class="fa-solid fa-floppy-disk" inert=""></i>', m.disabled = t.errors.length > 0, m.addEventListener("click", () => {
    var C;
    (C = i.onSave) == null || C.call(i);
  }), g.appendChild(m);
  const h = document.createElement("button");
  h.type = "button";
  const y = p("EIDOLON.TileCriteria.Clear", "Clear Rules");
  if (h.classList.add("control", "ui-control", "secondary", "eidolon-tile-criteria__toolbar-action", "icon-only"), h.dataset.tooltip = y, h.setAttribute("aria-label", y), h.title = y, h.innerHTML = '<i class="fa-solid fa-trash" inert=""></i>', h.addEventListener("click", () => {
    var C;
    (C = i.onClear) == null || C.call(i);
  }), g.appendChild(h), u.appendChild(g), s.appendChild(u), r.appendChild(s), a.error) {
    const C = document.createElement("p");
    C.classList.add("notes", "eidolon-tile-criteria__filter-error"), C.textContent = `${p("EIDOLON.TileCriteria.InvalidRegex", "Invalid regex")}: ${a.error}`, r.appendChild(C);
  }
  const T = document.createElement("div");
  T.classList.add("eidolon-tile-criteria__library-tree");
  const E = e.fileEntries.filter((C) => {
    const A = e.relativePaths.get(C.index) || C.path || C.label;
    return Cf(e, C, t) && a.matches(A);
  });
  if (e.fileEntries.length)
    if (E.length) {
      const C = document.createElement("ul");
      C.classList.add("eidolon-tile-criteria__tree"), Lc(df(E), e, n, t, C), T.appendChild(C);
    } else {
      const C = document.createElement("p");
      C.classList.add("notes"), C.textContent = p("EIDOLON.TileCriteria.NoMatches", "No variants match this filter."), T.appendChild(C);
    }
  else {
    const C = document.createElement("p");
    C.classList.add("notes"), C.textContent = p("EIDOLON.TileCriteria.NoVariants", "No MATT variants found"), T.appendChild(C);
  }
  return r.appendChild(T), r;
}
l(Of, "renderTreePanel");
function De(e) {
  const { section: n, state: t } = e, i = Ws(t);
  sf(e), n.replaceChildren();
  const r = /* @__PURE__ */ l(async () => {
    try {
      const o = Ws(t);
      if (o.errors.length) {
        t.status = {
          mode: "error",
          message: p(
            "EIDOLON.TileCriteria.ConflictSaveBlocked",
            `Resolve ${o.errors.length} conflict(s) before saving tile criteria rules.`
          )
        }, De(e);
        return;
      }
      const s = hf(t);
      if (!s) {
        t.status = {
          mode: "error",
          message: p("EIDOLON.TileCriteria.Invalid", "Invalid rules. Select valid target variants.")
        }, De(e);
        return;
      }
      await Js(e.tile, s);
      const c = t.filterQuery, u = t.filterMode, d = t.selectedFileIndex;
      e.state = Ao(e.tile), e.state.filterQuery = c, e.state.filterMode = u, Number.isInteger(d) && (e.state.selectedFileIndex = d), e.state.status = {
        mode: "ready",
        message: p("EIDOLON.TileCriteria.Saved", "Tile criteria rules saved.")
      }, De(e), Ks(e);
    } catch (o) {
      console.error(`${re} | Failed to save tile criteria`, o), t.status = {
        mode: "error",
        message: (o == null ? void 0 : o.message) ?? "Failed to save tile criteria rules."
      }, De(e);
    }
  }, "handleSave"), a = /* @__PURE__ */ l(async () => {
    try {
      await Js(e.tile, null);
      const o = t.filterQuery, s = t.filterMode, c = t.selectedFileIndex;
      e.state = Ao(e.tile), e.state.filterQuery = o, e.state.filterMode = s, Number.isInteger(c) && (e.state.selectedFileIndex = c), e.state.status = {
        mode: "ready",
        message: p("EIDOLON.TileCriteria.Cleared", "Tile criteria rules cleared.")
      }, De(e), Ks(e);
    } catch (o) {
      console.error(`${re} | Failed to clear tile criteria`, o), t.status = {
        mode: "error",
        message: (o == null ? void 0 : o.message) ?? "Failed to clear tile criteria rules."
      }, De(e);
    }
  }, "handleClear");
  if (n.appendChild(Of(t, e, i, {
    onSave: r,
    onClear: a
  })), i.errors.length || i.warnings.length) {
    const o = document.createElement("section");
    o.classList.add("eidolon-tile-criteria__conflicts");
    const s = document.createElement("p");
    s.classList.add("eidolon-tile-criteria__conflict-summary", "notes"), i.errors.length ? (s.dataset.mode = "error", s.textContent = p(
      "EIDOLON.TileCriteria.ConflictSummary",
      `${i.errors.length} conflict(s) must be resolved before saving${i.warnings.length ? ` (${i.warnings.length} warning(s))` : ""}.`
    )) : (s.dataset.mode = "warning", s.textContent = p(
      "EIDOLON.TileCriteria.WarningSummary",
      `${i.warnings.length} potential issue(s) detected.`
    )), o.appendChild(s);
    const c = document.createElement("p");
    c.classList.add("eidolon-tile-criteria__conflict-hint", "notes"), c.textContent = p(
      "EIDOLON.TileCriteria.ConflictHint",
      "Files involved in clashes are marked in red with a warning icon."
    ), o.appendChild(c), n.appendChild(o);
  }
  if (t.status.mode === "error" || t.status.mode === "warning") {
    const o = document.createElement("p");
    o.classList.add("eidolon-tile-criteria__status", "notes"), o.dataset.mode = t.status.mode, o.textContent = t.status.message, n.appendChild(o);
  }
}
l(De, "renderController");
function If(e, n = null) {
  const t = document.createElement("section");
  t.classList.add("eidolon-tile-criteria");
  const i = Ao(e);
  of(i, af(n));
  const r = {
    app: n,
    tile: e,
    section: t,
    state: i
  };
  return De(r), r;
}
l(If, "createController");
function Af(e) {
  if (!(e instanceof HTMLElement)) return null;
  const n = [
    ":scope > footer.sheet-footer",
    ":scope > footer.form-footer",
    ":scope > .sheet-footer",
    ":scope > .form-footer",
    ":scope > footer"
  ];
  for (const t of n) {
    const i = e.querySelector(t);
    if (i instanceof HTMLElement) return i;
  }
  return null;
}
l(Af, "findFooterElement");
function Nf(e) {
  if (!(e instanceof HTMLElement)) return null;
  const n = [
    "nav.sheet-tabs[data-group]",
    "nav.tabs[data-group]",
    "nav.sheet-tabs",
    "nav.tabs"
  ];
  for (const t of n) {
    const i = e.querySelector(t);
    if (i instanceof HTMLElement) return i;
  }
  return null;
}
l(Nf, "findTabNav");
function Mf(e, n) {
  var i, r, a;
  return e instanceof HTMLElement ? [
    (i = e.querySelector(".tab[data-tab]")) == null ? void 0 : i.parentElement,
    e.querySelector(".sheet-body"),
    (a = (r = n == null ? void 0 : n.parentElement) == null ? void 0 : r.querySelector) == null ? void 0 : a.call(r, ":scope > .sheet-body"),
    n == null ? void 0 : n.parentElement
  ].find((o) => o instanceof HTMLElement) ?? null : null;
}
l(Mf, "findTabBody");
function kf(e, n) {
  var t, i, r, a, o, s, c;
  return ((t = e == null ? void 0 : e.dataset) == null ? void 0 : t.group) ?? ((a = (r = (i = e == null ? void 0 : e.querySelector) == null ? void 0 : i.call(e, "[data-group]")) == null ? void 0 : r.dataset) == null ? void 0 : a.group) ?? ((c = (s = (o = n == null ? void 0 : n.querySelector) == null ? void 0 : o.call(n, ".tab[data-group]")) == null ? void 0 : s.dataset) == null ? void 0 : c.group) ?? "main";
}
l(kf, "getTabGroup");
function $f(e, n) {
  if (!(e instanceof HTMLElement)) return;
  e.textContent = "";
  const t = document.createElement("i");
  t.className = rf, t.setAttribute("inert", ""), e.append(t, " ");
  const i = document.createElement("span");
  i.textContent = n, e.append(i);
}
l($f, "setTabButtonContent");
function Df(e, n) {
  const t = e.querySelector("[data-tab]"), i = (t == null ? void 0 : t.tagName) || "A", r = document.createElement(i);
  return t instanceof HTMLElement && (r.className = t.className), r.classList.remove("active"), i === "BUTTON" && (r.type = "button"), r.dataset.action = "tab", r.dataset.tab = $t, r.dataset.group = n, r.setAttribute("aria-selected", "false"), r.setAttribute("aria-pressed", "false"), r;
}
l(Df, "createTabButton");
function Ff(e, n) {
  const t = document.createElement("div");
  t.classList.add("tab"), t.dataset.tab = $t, t.dataset.group = n, t.dataset.applicationPart = $t, t.setAttribute("hidden", "true");
  const i = Af(e);
  return e.insertBefore(t, i ?? null), t;
}
l(Ff, "createTabPanel");
function xa(e, n, t, i) {
  var o;
  if (!(t instanceof HTMLElement) || !(i instanceof HTMLElement)) return;
  const r = (o = e == null ? void 0 : e.tabGroups) == null ? void 0 : o[n];
  if (typeof r == "string" ? r === $t : t.classList.contains("active") || i.classList.contains("active")) {
    t.classList.add("active"), t.setAttribute("aria-selected", "true"), t.setAttribute("aria-pressed", "true"), i.classList.add("active"), i.removeAttribute("hidden"), i.removeAttribute("aria-hidden");
    return;
  }
  t.classList.remove("active"), t.setAttribute("aria-selected", "false"), t.setAttribute("aria-pressed", "false"), i.classList.remove("active"), i.setAttribute("hidden", "true");
}
l(xa, "syncTabVisibility");
function _f(e, n) {
  const t = Nf(n), i = Mf(n, t);
  if (!(t instanceof HTMLElement) || !(i instanceof HTMLElement)) return null;
  const r = kf(t, i);
  let a = t.querySelector(`[data-tab="${$t}"]`);
  a instanceof HTMLElement || (a = Df(t, r), t.appendChild(a)), $f(a, p("EIDOLON.TileCriteria.TabLabel", "Criteria"));
  let o = i.querySelector(`.tab[data-tab="${$t}"]`);
  return o instanceof HTMLElement || (o = Ff(i, r)), a.dataset.eidolonTileCriteriaBound || (a.addEventListener("click", () => {
    Pl(e, $t, r), requestAnimationFrame(() => {
      xa(e, r, a, o);
    });
  }), a.dataset.eidolonTileCriteriaBound = "true"), xa(e, r, a, o), requestAnimationFrame(() => {
    xa(e, r, a, o);
  }), o;
}
l(_f, "ensureTileCriteriaTab");
function xf() {
  Hooks.on("renderTileConfig", (e, n) => {
    var c, u, d, g;
    const t = Dt(n);
    if (!t) return;
    const i = lf(e);
    if (!i) return;
    if ((c = t.querySelector(".eidolon-tile-criteria")) == null || c.remove(), !ma()) {
      (u = t.querySelector(`.item[data-tab='${$t}']`)) == null || u.remove(), (d = t.querySelector(`.tab[data-tab='${$t}']`)) == null || d.remove();
      return;
    }
    const r = If(i, e), a = _f(e, t);
    if (a instanceof HTMLElement) {
      a.replaceChildren(r.section), (g = e.setPosition) == null || g.call(e, { height: "auto" });
      return;
    }
    const o = (e == null ? void 0 : e.form) instanceof HTMLFormElement ? e.form : t instanceof HTMLFormElement ? t : t.querySelector("form");
    if (!(o instanceof HTMLFormElement)) return;
    const s = o.querySelector("button[type='submit']");
    s != null && s.parentElement ? s.parentElement.insertAdjacentElement("beforebegin", r.section) : o.appendChild(r.section);
  });
}
l(xf, "registerTileCriteriaConfigControls");
function Rf(e) {
  if (Array.isArray(e)) return e;
  if (e instanceof Map) return Array.from(e.values());
  if (e && typeof e == "object") {
    if (typeof e.values == "function")
      try {
        const n = Array.from(e.values());
        if (n.length > 0) return n;
      } catch {
      }
    return Object.values(e);
  }
  return [];
}
l(Rf, "toList");
function Pf(e, n) {
  const t = e == null ? void 0 : e.tools;
  return Array.isArray(t) ? t.some((i) => (i == null ? void 0 : i.name) === n) : t instanceof Map ? t.has(n) : t && typeof t == "object" ? n in t ? !0 : Object.values(t).some((i) => (i == null ? void 0 : i.name) === n) : !1;
}
l(Pf, "hasTool");
function Hf(e, n) {
  if (Array.isArray(e.tools)) {
    e.tools.push(n);
    return;
  }
  if (e.tools instanceof Map) {
    e.tools.set(n.name, n);
    return;
  }
  if (e.tools && typeof e.tools == "object") {
    e.tools[n.name] = n;
    return;
  }
  e.tools = [n];
}
l(Hf, "addTool");
function qf() {
  Hooks.on("getSceneControlButtons", (e) => {
    var i;
    const n = Rf(e);
    if (!n.length) return;
    const t = n.find((r) => (r == null ? void 0 : r.name) === "tiles") ?? n.find((r) => (r == null ? void 0 : r.name) === "tokens" || (r == null ? void 0 : r.name) === "token") ?? n[0];
    t && (Pf(t, "eidolonCriteriaSwitcher") || Hf(t, {
      name: "eidolonCriteriaSwitcher",
      title: "Criteria Switcher",
      icon: "fa-solid fa-sliders",
      button: !0,
      toggle: !1,
      visible: pa(((i = game.scenes) == null ? void 0 : i.viewed) ?? null),
      onClick: /* @__PURE__ */ l(() => ls(), "onClick")
    }));
  });
}
l(qf, "registerSceneControlButton");
function Wi(e, n) {
  if (!e || typeof e != "object") return !1;
  const t = String(n).split(".");
  let i = e;
  for (const r of t) {
    if (!i || typeof i != "object" || !Object.prototype.hasOwnProperty.call(i, r)) return !1;
    i = i[r];
  }
  return !0;
}
l(Wi, "hasOwnPath");
function Bf() {
  const e = /* @__PURE__ */ l((i, r = null) => {
    i && Ad(i, r);
  }, "invalidateTileScene"), n = /* @__PURE__ */ l((i, r = null) => {
    i && jd(i, r);
  }, "invalidatePlaceableScene");
  Hooks.on("createTile", (i) => {
    e((i == null ? void 0 : i.parent) ?? null, i ?? null);
  }), Hooks.on("deleteTile", (i) => {
    e((i == null ? void 0 : i.parent) ?? null, i ?? null);
  }), Hooks.on("updateTile", (i, r) => {
    (Wi(r, `flags.${re}.tileCriteria`) || Wi(r, `flags.${re}.fileIndex`)) && e((i == null ? void 0 : i.parent) ?? null, i ?? null);
  });
  const t = /* @__PURE__ */ l((i) => {
    Hooks.on(`create${i}`, (r) => {
      n((r == null ? void 0 : r.parent) ?? null, r ?? null);
    }), Hooks.on(`delete${i}`, (r) => {
      n((r == null ? void 0 : r.parent) ?? null, r ?? null);
    }), Hooks.on(`update${i}`, (r, a) => {
      const o = Wi(a, `flags.${re}.presets`), s = i === "AmbientLight" && Wi(a, `flags.${re}.lightCriteria`);
      !o && !s || n((r == null ? void 0 : r.parent) ?? null, r ?? null);
    });
  }, "registerPlaceableHooks");
  t("AmbientLight"), t("Wall"), t("AmbientSound"), Hooks.on("canvasReady", (i) => {
    const r = (i == null ? void 0 : i.scene) ?? null;
    r && (e(r), n(r));
  });
}
l(Bf, "registerCriteriaCacheInvalidationHooks");
function jf() {
  qf(), xf(), Bf(), Hooks.once("init", () => {
    var e, n;
    (n = (e = game.keybindings) == null ? void 0 : e.register) == null || n.call(e, re, "toggleCriteriaSwitcher", {
      name: "Toggle Criteria Switcher",
      hint: "Open or close the criteria switcher window for live scene state updates.",
      editable: [{ key: "KeyM", modifiers: ["Alt"] }],
      onDown: /* @__PURE__ */ l(() => {
        var t, i, r;
        return pa(((t = game.scenes) == null ? void 0 : t.viewed) ?? null) ? (ls(), !0) : ((r = (i = ui.notifications) == null ? void 0 : i.warn) == null || r.call(i, "You do not have permission to manage scene criteria."), !0);
      }, "onDown"),
      restricted: !0,
      precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL
    });
  }), Hooks.on("canvasReady", (e) => {
    var t;
    const n = wa();
    n && (n.setScene((e == null ? void 0 : e.scene) ?? ((t = game.scenes) == null ? void 0 : t.viewed) ?? null), n.render({ force: !0 }));
  }), Hooks.once("ready", () => {
    var n, t;
    const e = (t = (n = game.modules) == null ? void 0 : n.get) == null ? void 0 : t.call(n, re);
    e && (e.api || (e.api = {}), e.api.criteria = ef, console.log(`${re} | Criteria engine API registered`));
  });
}
l(jf, "registerCriteriaEngineHooks");
jf();
const or = /* @__PURE__ */ new WeakMap(), Ki = /* @__PURE__ */ new WeakMap(), pe = "__eidolon_default__";
function Uf() {
  Hooks.on("renderAmbientLightConfig", Vf), L("LightCriteria | AmbientLightConfig controls registered");
}
l(Uf, "registerAmbientLightCriteriaControls");
function Vf(e, n) {
  var t;
  Gn("LightCriteria | renderAmbientLightConfig", {
    appId: (e == null ? void 0 : e.id) ?? null,
    constructor: ((t = e == null ? void 0 : e.constructor) == null ? void 0 : t.name) ?? null,
    isRendered: (e == null ? void 0 : e.rendered) ?? !1
  });
  try {
    const i = Dt(n);
    if (!i) return;
    if (!ma()) {
      i.querySelectorAll(".eidolon-light-criteria, .eidolon-light-criteria-main-switcher").forEach((r) => r.remove());
      return;
    }
    zf(e, i);
  } catch (i) {
    console.error("eidolon-utilities | Failed to enhance AmbientLightConfig UI", i);
  } finally {
    Wt();
  }
}
l(Vf, "handleAmbientLightConfigRender");
function zf(e, n) {
  var Se, tn, Xn, qi, vs;
  const t = (e == null ? void 0 : e.form) instanceof HTMLFormElement ? e.form : n instanceof HTMLFormElement ? n : (Se = n == null ? void 0 : n.closest) == null ? void 0 : Se.call(n, "form");
  if (!(t instanceof HTMLFormElement)) return;
  const i = t.querySelector(".window-content");
  if (!(i instanceof HTMLElement)) return;
  const r = Ic(e);
  if (!r) return;
  const a = gg(r);
  L("LightCriteria | Resolved ambient light", {
    sheetId: (r == null ? void 0 : r.id) ?? null,
    persistedId: (a == null ? void 0 : a.id) ?? null,
    sameRef: r === a
  });
  const o = (a == null ? void 0 : a.parent) ?? r.parent ?? null, s = o ? Ku(o) : [], c = s.filter(
    (N) => Array.isArray(N == null ? void 0 : N.values) && N.values.length > 0
  ), u = ig(s), d = s.map((N) => typeof (N == null ? void 0 : N.id) == "string" ? N.id : null).filter((N) => !!N), g = a ?? r, m = o ? Qe(o) : [];
  let b = rc(g);
  const h = Dd(b, m);
  JSON.stringify(h) !== JSON.stringify(b) && (b = h, ac(g, h).catch((N) => {
    console.warn("eidolon-utilities | Failed to persist migrated light criteria keys", N);
  })), L("LightCriteria | Loaded mapping state", {
    hasBase: !!(b != null && b.base),
    mappingCount: Array.isArray(b == null ? void 0 : b.mappings) ? b.mappings.length : 0,
    mappings: Array.isArray(b == null ? void 0 : b.mappings) ? b.mappings.map((N) => {
      var B, Y;
      return {
        id: N.id,
        key: N.key,
        hasColor: !!((Y = (B = N.config) == null ? void 0 : B.config) != null && Y.color)
      };
    }) : []
  });
  const y = i.querySelector(".eidolon-light-criteria");
  y && y.remove(), i.querySelectorAll(".eidolon-light-criteria-main-switcher").forEach((N) => N.remove());
  const T = document.createElement("fieldset");
  T.classList.add("eidolon-light-criteria");
  const E = document.createElement("legend");
  E.textContent = p("EIDOLON.LightCriteria.Legend", "Scene Criteria Lighting"), T.appendChild(E);
  const C = document.createElement("p");
  C.classList.add("notes"), C.textContent = p(
    "EIDOLON.LightCriteria.Description",
    "Capture a base lighting state, then map criteria values to lighting configurations."
  ), T.appendChild(C);
  const A = document.createElement("div");
  A.classList.add("eidolon-light-criteria__controls");
  const k = document.createElement("button");
  k.type = "button", k.dataset.action = "make-default", k.classList.add("eidolon-light-criteria__button"), k.textContent = p(
    "EIDOLON.LightCriteria.SetBase",
    "Set Base"
  ), A.appendChild(k);
  const F = document.createElement("button");
  F.type = "button", F.dataset.action = "create-mapping", F.classList.add("eidolon-light-criteria__button"), F.textContent = p(
    "EIDOLON.LightCriteria.CreateMapping",
    "Add Criteria Mapping"
  ), F.setAttribute("aria-expanded", "false"), A.appendChild(F), T.appendChild(A);
  const D = document.createElement("p");
  D.classList.add("notes", "eidolon-light-criteria__status"), T.appendChild(D);
  const H = document.createElement("div");
  H.classList.add("eidolon-light-criteria__switcher");
  const te = document.createElement("label");
  te.classList.add("eidolon-light-criteria__switcher-label");
  const ne = `${(e == null ? void 0 : e.id) ?? (r == null ? void 0 : r.id) ?? "eidolon-light"}-mapping-select`;
  te.htmlFor = ne, te.textContent = p("EIDOLON.LightCriteria.SelectLabel", "Criteria Mapping"), H.appendChild(te);
  const U = document.createElement("details");
  U.classList.add("eidolon-light-criteria__filter-details");
  const Q = document.createElement("summary");
  Q.classList.add("eidolon-light-criteria__filter-summary");
  const _ = document.createElement("span");
  _.classList.add("eidolon-light-criteria__filter-summary-label"), _.textContent = p(
    "EIDOLON.LightCriteria.FilterHeading",
    "Filter mappings"
  ), Q.appendChild(_);
  const G = document.createElement("span");
  G.classList.add("eidolon-light-criteria__filter-meta"), Q.appendChild(G), U.appendChild(Q);
  const X = document.createElement("div");
  X.classList.add("eidolon-light-criteria__filter-panel");
  const W = document.createElement("div");
  W.classList.add("eidolon-light-criteria__filter-grid");
  for (const N of c) {
    const B = document.createElement("label");
    B.classList.add("eidolon-light-criteria__filter");
    const Y = document.createElement("span");
    Y.classList.add("eidolon-light-criteria__filter-name"), Y.textContent = (Xn = (tn = N.name) == null ? void 0 : tn.trim) != null && Xn.call(tn) ? N.name.trim() : p("EIDOLON.LightCriteria.UnnamedCategory", "Unnamed Category"), B.appendChild(Y);
    const Z = document.createElement("select");
    Z.dataset.filterCategoryId = N.id, Z.classList.add("eidolon-light-criteria__filter-select");
    const ie = document.createElement("option");
    ie.value = "", ie.textContent = p("EIDOLON.LightCriteria.FilterAny", "Any"), Z.appendChild(ie);
    for (const ue of N.values) {
      const de = document.createElement("option");
      de.value = ue, de.textContent = ue, Z.appendChild(de);
    }
    B.appendChild(Z), W.appendChild(B);
  }
  X.appendChild(W);
  const j = document.createElement("div");
  j.classList.add("eidolon-light-criteria__filter-actions");
  const V = document.createElement("button");
  V.type = "button", V.dataset.action = "clear-mapping-filters", V.classList.add("eidolon-light-criteria__button", "secondary", "compact"), V.textContent = p("EIDOLON.LightCriteria.ClearFilters", "Clear Filters"), j.appendChild(V), X.appendChild(j), U.appendChild(X), U.hidden = c.length === 0, H.appendChild(U);
  const I = document.createElement("div");
  I.classList.add("eidolon-light-criteria__switcher-controls"), H.appendChild(I);
  const M = document.createElement("select");
  M.id = ne, M.classList.add("eidolon-light-criteria__select"), M.dataset.action = "select-mapping", I.appendChild(M);
  const x = document.createElement("button");
  x.type = "button", x.dataset.action = "apply-selected-mapping", x.classList.add("eidolon-light-criteria__button", "secondary"), x.textContent = p("EIDOLON.LightCriteria.ApplyButton", "Apply"), I.appendChild(x);
  const K = document.createElement("details");
  K.classList.add("eidolon-light-criteria__menu"), K.dataset.action = "mapping-actions-menu";
  const Et = document.createElement("summary");
  Et.classList.add("eidolon-light-criteria__menu-toggle"), Et.innerHTML = '<i class="fa-solid fa-ellipsis-vertical" inert=""></i>', Et.setAttribute(
    "aria-label",
    p("EIDOLON.LightCriteria.MoreActions", "More actions")
  ), Et.dataset.tooltip = p("EIDOLON.LightCriteria.MoreActions", "More actions"), K.appendChild(Et);
  const Be = document.createElement("div");
  Be.classList.add("eidolon-light-criteria__menu-list"), K.appendChild(Be);
  const ge = document.createElement("button");
  ge.type = "button", ge.dataset.action = "update-selected-mapping", ge.classList.add("eidolon-light-criteria__menu-item"), ge.textContent = p(
    "EIDOLON.LightCriteria.UpdateSelected",
    "Save current config to selected"
  ), Be.appendChild(ge);
  const je = document.createElement("button");
  je.type = "button", je.dataset.action = "edit-selected-mapping-criteria", je.classList.add("eidolon-light-criteria__menu-item"), je.textContent = p(
    "EIDOLON.LightCriteria.EditSelectedCriteria",
    "Edit selected mapping criteria"
  ), Be.appendChild(je);
  const Ue = document.createElement("button");
  Ue.type = "button", Ue.dataset.action = "remove-selected-mapping", Ue.classList.add("eidolon-light-criteria__menu-item", "danger"), Ue.textContent = p(
    "EIDOLON.LightCriteria.RemoveSelected",
    "Delete selected mapping"
  ), Be.appendChild(Ue), I.appendChild(K);
  const vt = document.createElement("div");
  vt.classList.add("eidolon-light-criteria-main-switcher"), vt.appendChild(H);
  const _e = document.createElement("p");
  if (_e.classList.add("notes", "eidolon-light-criteria-main-switcher__empty"), _e.textContent = p(
    "EIDOLON.LightCriteria.ActiveRequiresBase",
    "Set Base Lighting to enable mapping selection and actions."
  ), vt.appendChild(_e), s.length === 0) {
    const N = document.createElement("p");
    N.classList.add("notification", "warning", "eidolon-light-criteria__warning"), N.textContent = p(
      "EIDOLON.LightCriteria.NoCategoriesWarning",
      "This scene has no criteria configured. Add criteria under Scene -> Criteria to enable criteria-driven lighting."
    ), T.appendChild(N);
  } else if (c.length === 0) {
    const N = document.createElement("p");
    N.classList.add("notification", "warning", "eidolon-light-criteria__warning"), N.textContent = p(
      "EIDOLON.LightCriteria.NoValuesWarning",
      "Criteria exist, but none define selectable values. Add values in Scene -> Criteria."
    ), T.appendChild(N);
  }
  const Ee = document.createElement("div");
  Ee.classList.add("eidolon-light-criteria__creation"), Ee.dataset.section = "creation", Ee.hidden = !0;
  const In = document.createElement("p");
  In.classList.add("notes"), In.textContent = p(
    "EIDOLON.LightCriteria.CreateDescription",
    "Assign scene criteria values to map the current configuration."
  ), Ee.appendChild(In);
  const Ct = document.createElement("div");
  Ct.classList.add("eidolon-light-criteria__category-list"), Ee.appendChild(Ct);
  for (const N of c) {
    const B = document.createElement("label");
    B.classList.add("eidolon-light-criteria__category");
    const Y = document.createElement("span");
    Y.classList.add("eidolon-light-criteria__category-name"), Y.textContent = (vs = (qi = N.name) == null ? void 0 : qi.trim) != null && vs.call(qi) ? N.name.trim() : p("EIDOLON.LightCriteria.UnnamedCategory", "Unnamed Category"), B.appendChild(Y);
    const Z = document.createElement("select");
    Z.dataset.categoryId = N.id, Z.classList.add("eidolon-light-criteria__category-select");
    const ie = document.createElement("option");
    ie.value = "", ie.textContent = p(
      "EIDOLON.LightCriteria.IgnoreCategory",
      "Ignore"
    ), Z.appendChild(ie);
    for (const ue of N.values) {
      const de = document.createElement("option");
      de.value = ue, de.textContent = ue, Z.appendChild(de);
    }
    B.appendChild(Z), Ct.appendChild(B);
  }
  const en = document.createElement("div");
  en.classList.add("eidolon-light-criteria__creation-actions");
  const Ve = document.createElement("button");
  Ve.type = "button", Ve.dataset.action = "save-mapping", Ve.classList.add("eidolon-light-criteria__button", "primary"), Ve.textContent = p(
    "EIDOLON.LightCriteria.SaveMapping",
    "Save Mapping"
  ), en.appendChild(Ve);
  const St = document.createElement("button");
  St.type = "button", St.dataset.action = "cancel-create", St.classList.add("eidolon-light-criteria__button", "secondary"), St.textContent = p(
    "EIDOLON.LightCriteria.Cancel",
    "Cancel"
  ), en.appendChild(St), Ee.appendChild(en), T.appendChild(Ee), i.prepend(vt), i.appendChild(T), T.hidden = !0, Wf(e, {
    fieldset: T,
    homeContainer: i
  }), requestAnimationFrame(() => {
    var N;
    (N = e.setPosition) == null || N.call(e, { height: "auto" });
  });
  let R = b;
  an({ switcher: H, emptyState: _e, state: R }), rn(D, R), ii(F, {
    state: R,
    hasCategories: c.length > 0
  }), L("LightCriteria | Controls injected", {
    sceneId: (o == null ? void 0 : o.id) ?? null,
    lightId: (r == null ? void 0 : r.id) ?? null,
    hasBase: !!(R != null && R.base),
    mappingCount: Array.isArray(R == null ? void 0 : R.mappings) ? R.mappings.length : 0,
    categories: c.length
  });
  const Pi = cg(R), J = {
    restoreConfig: null,
    app: e,
    selectedMapping: Pi,
    editorMode: "create",
    editingMappingId: null,
    mappingFilters: {}
  };
  or.set(T, J);
  const Xe = /* @__PURE__ */ l(() => {
    K.open = !1;
  }, "closeActionsMenu");
  Et.addEventListener("click", (N) => {
    K.classList.contains("is-disabled") && (N.preventDefault(), Xe());
  });
  const Ce = /* @__PURE__ */ l((N = J.selectedMapping) => {
    const B = rg(W), Y = Array.isArray(R == null ? void 0 : R.mappings) ? R.mappings : [], Z = og(Y, B), ie = Object.keys(B).length;
    J.mappingFilters = B, V.disabled = ie === 0, sg(G, {
      totalCount: Y.length,
      visibleCount: Z.length,
      hasFilters: ie > 0,
      activeFilterCount: ie
    }), U.classList.toggle("has-active-filters", ie > 0), lg(M, R, u, N, {
      mappings: Z,
      categoryOrder: d
    }), J.selectedMapping = M.value ?? "", Ra({
      mappingSelect: M,
      applyMappingButton: x,
      updateMappingButton: ge,
      editCriteriaButton: je,
      removeMappingButton: Ue,
      actionsMenu: K,
      state: R
    }), K.classList.contains("is-disabled") && Xe();
  }, "refreshMappingSelector");
  W.querySelectorAll("select[data-filter-category-id]").forEach((N) => {
    N.addEventListener("change", () => {
      const B = J.selectedMapping;
      Ce(B), J.selectedMapping !== B && Pa(
        a ?? r,
        R,
        J.selectedMapping
      ).then((Y) => {
        Y && (R = Y);
      });
    });
  }), V.addEventListener("click", () => {
    ag(W);
    const N = J.selectedMapping;
    Ce(N), U.open = !1, J.selectedMapping !== N && Pa(
      a ?? r,
      R,
      J.selectedMapping
    ).then((B) => {
      B && (R = B);
    });
  }), M.addEventListener("change", () => {
    J.selectedMapping = M.value ?? "", Ra({
      mappingSelect: M,
      applyMappingButton: x,
      updateMappingButton: ge,
      editCriteriaButton: je,
      removeMappingButton: Ue,
      actionsMenu: K,
      state: R
    }), Pa(
      a ?? r,
      R,
      J.selectedMapping
    ).then((N) => {
      N && (R = N);
    });
  });
  const Qn = /* @__PURE__ */ l(async () => {
    var Z, ie, ue, de, ze, _t, Ge, xt, me, Rt, Pt, lt, nn, Zn;
    const N = M.value ?? "";
    if (!N) {
      (ie = (Z = ui.notifications) == null ? void 0 : Z.warn) == null || ie.call(
        Z,
        p(
          "EIDOLON.LightCriteria.SelectMappingWarning",
          "Choose a criteria mapping before applying."
        )
      ), Ce(J.selectedMapping);
      return;
    }
    if (N === pe) {
      if (!(R != null && R.base)) {
        (de = (ue = ui.notifications) == null ? void 0 : ue.warn) == null || de.call(
          ue,
          p(
            "EIDOLON.LightCriteria.BaseUnavailable",
            "Set a base lighting state before applying it."
          )
        );
        return;
      }
      Yi(T, Ee, F), lr(e, t, R.base), R = await ci(a ?? r, {
        mappingId: pe,
        categories: null,
        updatedAt: Date.now()
      }), J.selectedMapping = pe, Ce(J.selectedMapping), rn(D, R), an({ switcher: H, emptyState: _e, state: R }), ii(F, {
        state: R,
        hasCategories: c.length > 0
      }), Qs(t, {
        mappingId: pe,
        color: ((_t = (ze = R.base) == null ? void 0 : ze.config) == null ? void 0 : _t.color) ?? null
      }), (xt = (Ge = ui.notifications) == null ? void 0 : Ge.info) == null || xt.call(
        Ge,
        p(
          "EIDOLON.LightCriteria.BaseApplied",
          "Applied the base lighting state to the form."
        )
      ), Xe();
      return;
    }
    const B = Array.isArray(R == null ? void 0 : R.mappings) && R.mappings.length ? R.mappings.find((An) => (An == null ? void 0 : An.id) === N) : null;
    if (!B) {
      (Rt = (me = ui.notifications) == null ? void 0 : me.warn) == null || Rt.call(
        me,
        p(
          "EIDOLON.LightCriteria.MappingUnavailable",
          "The selected criteria mapping is no longer available."
        )
      ), J.selectedMapping = "", Ce(J.selectedMapping);
      return;
    }
    Yi(T, Ee, F), lr(e, t, B.config), R = await ci(a ?? r, {
      mappingId: B.id,
      categories: B.categories,
      updatedAt: Date.now()
    }), J.selectedMapping = B.id, Ce(J.selectedMapping), rn(D, R), an({ switcher: H, emptyState: _e, state: R }), ii(F, {
      state: R,
      hasCategories: c.length > 0
    }), Qs(t, {
      mappingId: B.id,
      color: ((lt = (Pt = B.config) == null ? void 0 : Pt.config) == null ? void 0 : lt.color) ?? null
    });
    const Y = Hn(B, u, d);
    (Zn = (nn = ui.notifications) == null ? void 0 : nn.info) == null || Zn.call(
      nn,
      p(
        "EIDOLON.LightCriteria.MappingApplied",
        "Applied mapping: {label}"
      ).replace("{label}", Y)
    ), Xe();
  }, "applySelectedMapping");
  x.addEventListener("click", () => {
    Qn();
  }), M.addEventListener("keydown", (N) => {
    N.key === "Enter" && (N.preventDefault(), Qn());
  });
  const Hi = /* @__PURE__ */ l(async () => {
    var B, Y, Z, ie, ue, de, ze, _t, Ge, xt, me, Rt, Pt, lt, nn, Zn, An, Bi, Cs, ji, Ss;
    const N = J.selectedMapping;
    if (!N) {
      (Y = (B = ui.notifications) == null ? void 0 : B.warn) == null || Y.call(
        B,
        p(
          "EIDOLON.LightCriteria.SelectMappingWarning",
          "Choose a criteria mapping before applying."
        )
      );
      return;
    }
    ge.disabled = !0;
    try {
      const xe = sr(e, a);
      if (N === pe)
        R = await js(a ?? r, xe), L("LightCriteria | Base lighting updated", {
          lightId: ((Z = a ?? r) == null ? void 0 : Z.id) ?? null,
          configColor: ((ie = xe == null ? void 0 : xe.config) == null ? void 0 : ie.color) ?? null
        }), (de = (ue = ui.notifications) == null ? void 0 : ue.info) == null || de.call(
          ue,
          p(
            "EIDOLON.LightCriteria.BaseUpdated",
            "Updated the base lighting state with the current configuration."
          )
        ), J.selectedMapping = pe;
      else {
        const Nn = di(R, N);
        if (!Nn) {
          (_t = (ze = ui.notifications) == null ? void 0 : ze.warn) == null || _t.call(
            ze,
            p(
              "EIDOLON.LightCriteria.MappingUnavailable",
              "The selected criteria mapping is no longer available."
            )
          ), J.selectedMapping = "", Ce(J.selectedMapping);
          return;
        }
        R = await Us(
          a ?? r,
          Nn.categories,
          xe,
          { label: Nn.label ?? null }
        ), L("LightCriteria | Mapping updated", {
          mappingId: N,
          hasColor: !!((Ge = xe == null ? void 0 : xe.config) != null && Ge.color),
          stored: Array.isArray(R == null ? void 0 : R.mappings) ? ((xt = R.mappings.find((Sa) => (Sa == null ? void 0 : Sa.id) === N)) == null ? void 0 : xt.config) ?? null : null,
          persisted: (Rt = (me = a ?? r) == null ? void 0 : me.getFlag) == null ? void 0 : Rt.call(me, En, Pn)
        });
        const ei = di(R, N), su = Hn(ei || Nn, u, d);
        L("LightCriteria | Mapping updated", {
          mappingId: N,
          categories: Nn.categories,
          updatedColor: ((Pt = xe == null ? void 0 : xe.config) == null ? void 0 : Pt.color) ?? null,
          storedColor: ((nn = (lt = ei == null ? void 0 : ei.config) == null ? void 0 : lt.config) == null ? void 0 : nn.color) ?? ((An = (Zn = Nn.config) == null ? void 0 : Zn.config) == null ? void 0 : An.color) ?? null
        }), (Cs = (Bi = ui.notifications) == null ? void 0 : Bi.info) == null || Cs.call(
          Bi,
          p(
            "EIDOLON.LightCriteria.MappingUpdated",
            "Saved changes to mapping: {label}"
          ).replace("{label}", su)
        ), J.selectedMapping = N;
      }
      rn(D, R), an({ switcher: H, emptyState: _e, state: R }), ii(F, {
        state: R,
        hasCategories: c.length > 0
      }), Ce(J.selectedMapping), Xe();
    } catch (xe) {
      console.error("eidolon-utilities | Failed to update light criteria mapping", xe), (Ss = (ji = ui.notifications) == null ? void 0 : ji.error) == null || Ss.call(
        ji,
        p(
          "EIDOLON.LightCriteria.MappingUpdateError",
          "Failed to save the mapping. Check the console for details."
        )
      );
    } finally {
      ge.disabled = !1, Ra({
        mappingSelect: M,
        applyMappingButton: x,
        updateMappingButton: ge,
        editCriteriaButton: je,
        removeMappingButton: Ue,
        actionsMenu: K,
        state: R
      });
    }
  }, "updateSelectedMapping");
  ge.addEventListener("click", () => {
    Hi();
  }), Ce(J.selectedMapping), k.addEventListener("click", async () => {
    var N, B, Y, Z, ie, ue;
    k.disabled = !0;
    try {
      const de = sr(e, a);
      R = await js(a ?? r, de), L("LightCriteria | Base lighting stored", {
        lightId: ((N = a ?? r) == null ? void 0 : N.id) ?? null,
        configColor: ((B = de == null ? void 0 : de.config) == null ? void 0 : B.color) ?? null
      }), (Z = (Y = ui.notifications) == null ? void 0 : Y.info) == null || Z.call(
        Y,
        p(
          "EIDOLON.LightCriteria.BaseStored",
          "Saved the current configuration as the base lighting state."
        )
      ), rn(D, R), an({ switcher: H, emptyState: _e, state: R }), ii(F, {
        state: R,
        hasCategories: c.length > 0
      }), J.selectedMapping = pe, Ce(J.selectedMapping);
    } catch (de) {
      console.error("eidolon-utilities | Failed to store base light criteria state", de), (ue = (ie = ui.notifications) == null ? void 0 : ie.error) == null || ue.call(
        ie,
        p(
          "EIDOLON.LightCriteria.BaseError",
          "Failed to save the base lighting state. Check the console for details."
        )
      );
    } finally {
      k.disabled = !1;
    }
  }), F.addEventListener("click", () => {
    var B, Y, Z, ie;
    if (!(R != null && R.base)) {
      (Y = (B = ui.notifications) == null ? void 0 : B.warn) == null || Y.call(
        B,
        p(
          "EIDOLON.LightCriteria.RequiresBase",
          "Set a base lighting state before adding criteria mappings."
        )
      );
      return;
    }
    if (c.length === 0) {
      (ie = (Z = ui.notifications) == null ? void 0 : Z.warn) == null || ie.call(
        Z,
        p(
          "EIDOLON.LightCriteria.NoCategoriesAvailable",
          "Add scene criteria with values in the Scene configuration before creating mappings."
        )
      );
      return;
    }
    const N = or.get(T);
    Ys({
      app: e,
      fieldset: T,
      createButton: F,
      creationSection: Ee,
      categoryList: Ct,
      form: t,
      persistedLight: a,
      stateEntry: N,
      mode: "create",
      mapping: null,
      preloadConfig: R.base
    });
  }), je.addEventListener("click", () => {
    var Y, Z, ie, ue;
    const N = J.selectedMapping;
    if (!N || N === pe) {
      (Z = (Y = ui.notifications) == null ? void 0 : Y.warn) == null || Z.call(
        Y,
        p(
          "EIDOLON.LightCriteria.SelectMappingForCriteriaEdit",
          "Select a mapping before editing criteria."
        )
      );
      return;
    }
    const B = di(R, N);
    if (!B) {
      (ue = (ie = ui.notifications) == null ? void 0 : ie.warn) == null || ue.call(
        ie,
        p(
          "EIDOLON.LightCriteria.MappingUnavailable",
          "The selected criteria mapping is no longer available."
        )
      );
      return;
    }
    Xe(), Oc(e, { fieldset: T, homeContainer: i }), Ys({
      app: e,
      fieldset: T,
      createButton: F,
      creationSection: Ee,
      categoryList: Ct,
      form: t,
      persistedLight: a,
      stateEntry: J,
      mode: "retarget",
      mapping: B,
      preloadConfig: B.config
    });
  }), Ve.addEventListener("click", async () => {
    var B, Y, Z, ie, ue, de, ze, _t, Ge, xt;
    const N = fg(Ct);
    if (!N) {
      (Y = (B = ui.notifications) == null ? void 0 : B.warn) == null || Y.call(
        B,
        p(
          "EIDOLON.LightCriteria.SelectionRequired",
          "Select at least one criteria value to identify the mapping."
        )
      );
      return;
    }
    Ve.disabled = !0;
    try {
      const me = sr(e, a);
      if (J.editorMode === "retarget" && J.editingMappingId) {
        const Pt = ko(R, N);
        let lt = !1;
        if (Pt && Pt !== J.editingMappingId && (lt = await Gf(), !lt)) {
          Ve.disabled = !1;
          return;
        }
        R = await Md(
          a ?? r,
          J.editingMappingId,
          N,
          me,
          { replaceExisting: lt }
        ), L("LightCriteria | Mapping criteria retargeted", {
          mappingId: J.editingMappingId,
          categories: N,
          replaced: lt,
          configColor: ((Z = me == null ? void 0 : me.config) == null ? void 0 : Z.color) ?? null
        }), (ue = (ie = ui.notifications) == null ? void 0 : ie.info) == null || ue.call(
          ie,
          p(
            "EIDOLON.LightCriteria.MappingCriteriaUpdated",
            "Updated mapping criteria for the selected mapping."
          )
        );
      } else
        R = await Us(
          a ?? r,
          N,
          me,
          {}
        ), L("LightCriteria | Mapping saved from editor", {
          categories: N,
          configColor: ((de = me == null ? void 0 : me.config) == null ? void 0 : de.color) ?? null
        }), (_t = (ze = ui.notifications) == null ? void 0 : ze.info) == null || _t.call(
          ze,
          p(
            "EIDOLON.LightCriteria.MappingSaved",
            "Updated lighting mapping for the selected scene criteria."
          )
        );
      rn(D, R), an({ switcher: H, emptyState: _e, state: R });
      const Rt = ko(R, N);
      Rt && (J.selectedMapping = Rt), Ce(J.selectedMapping), Yi(T, Ee, F), Xe();
    } catch (me) {
      console.error("eidolon-utilities | Failed to persist light criteria mapping", me), (xt = (Ge = ui.notifications) == null ? void 0 : Ge.error) == null || xt.call(
        Ge,
        p(
          "EIDOLON.LightCriteria.MappingError",
          "Failed to save the mapping. Check the console for details."
        )
      );
    } finally {
      Ve.disabled = !1;
    }
  }), St.addEventListener("click", () => {
    const N = or.get(T);
    N != null && N.restoreConfig && lr(e, t, N.restoreConfig), Yi(T, Ee, F);
  }), Ue.addEventListener("click", async () => {
    var Y, Z;
    const N = J.selectedMapping;
    !N || N === pe || !await Jf() || (R = await kd(a ?? r, N), J.selectedMapping = "", rn(D, R), an({ switcher: H, emptyState: _e, state: R }), Ce(J.selectedMapping), Xe(), (Z = (Y = ui.notifications) == null ? void 0 : Y.info) == null || Z.call(
      Y,
      p("EIDOLON.LightCriteria.MappingRemoved", "Removed selected mapping.")
    ));
  });
}
l(zf, "enhanceAmbientLightConfig");
function Ys({
  app: e,
  fieldset: n,
  createButton: t,
  creationSection: i,
  categoryList: r,
  form: a,
  persistedLight: o,
  stateEntry: s,
  mode: c,
  mapping: u,
  preloadConfig: d
}) {
  s && (s.restoreConfig = sr(e, o), s.editorMode = c, s.editingMappingId = c === "retarget" ? (u == null ? void 0 : u.id) ?? null : null), d && lr(e, a, d), c === "retarget" && (u != null && u.categories) ? dg(r, u.categories) : ug(r);
  const g = i.querySelector("p.notes");
  g instanceof HTMLElement && (g.textContent = c === "retarget" ? p(
    "EIDOLON.LightCriteria.EditCriteriaDescription",
    "Adjust criteria values for the selected mapping."
  ) : p(
    "EIDOLON.LightCriteria.CreateDescription",
    "Assign scene criteria values to map the current configuration."
  ));
  const m = i.querySelector('button[data-action="save-mapping"]');
  m instanceof HTMLButtonElement && (m.textContent = c === "retarget" ? p("EIDOLON.LightCriteria.SaveCriteriaChanges", "Save Criteria Changes") : p("EIDOLON.LightCriteria.SaveMapping", "Save Mapping")), i.hidden = !1, t.setAttribute("aria-expanded", "true"), cs(n, i), requestAnimationFrame(() => {
    var b;
    (b = e.setPosition) == null || b.call(e, { height: "auto" });
  });
}
l(Ys, "openMappingEditor");
async function Gf() {
  var t, i;
  const e = (i = (t = foundry == null ? void 0 : foundry.applications) == null ? void 0 : t.api) == null ? void 0 : i.DialogV2;
  if (typeof (e == null ? void 0 : e.confirm) == "function")
    return e.confirm({
      window: { title: p("EIDOLON.LightCriteria.ConflictTitle", "Replace Existing Mapping?") },
      content: `<p>${p(
        "EIDOLON.LightCriteria.ConflictBody",
        "A mapping already exists for this criteria combination. Replace it with the edited mapping?"
      )}</p>`,
      rejectClose: !1
    });
  const n = globalThis.Dialog;
  return typeof (n == null ? void 0 : n.confirm) != "function" ? !1 : n.confirm({
    title: p("EIDOLON.LightCriteria.ConflictTitle", "Replace Existing Mapping?"),
    content: `<p>${p(
      "EIDOLON.LightCriteria.ConflictBody",
      "A mapping already exists for this criteria combination. Replace it with the edited mapping?"
    )}</p>`,
    yes: /* @__PURE__ */ l(() => !0, "yes"),
    no: /* @__PURE__ */ l(() => !1, "no"),
    defaultYes: !1
  });
}
l(Gf, "confirmCriteriaConflict");
async function Jf() {
  var t, i;
  const e = (i = (t = foundry == null ? void 0 : foundry.applications) == null ? void 0 : t.api) == null ? void 0 : i.DialogV2;
  if (typeof (e == null ? void 0 : e.confirm) == "function")
    return e.confirm({
      window: { title: p("EIDOLON.LightCriteria.RemoveTitle", "Remove Mapping?") },
      content: `<p>${p(
        "EIDOLON.LightCriteria.RemoveBody",
        "Remove the currently selected mapping? This cannot be undone."
      )}</p>`,
      rejectClose: !1
    });
  const n = globalThis.Dialog;
  return typeof (n == null ? void 0 : n.confirm) != "function" ? !1 : n.confirm({
    title: p("EIDOLON.LightCriteria.RemoveTitle", "Remove Mapping?"),
    content: `<p>${p(
      "EIDOLON.LightCriteria.RemoveBody",
      "Remove the currently selected mapping? This cannot be undone."
    )}</p>`,
    yes: /* @__PURE__ */ l(() => !0, "yes"),
    no: /* @__PURE__ */ l(() => !1, "no"),
    defaultYes: !1
  });
}
l(Jf, "confirmRemoveMapping");
function Wf(e, { fieldset: n, homeContainer: t }) {
  const i = Qf(e, t);
  if (!(i instanceof HTMLElement)) return;
  const r = i.querySelector(".window-header");
  if (!(r instanceof HTMLElement)) return;
  let a = r.querySelector('[data-eidolon-action="open-light-criteria-manager"]');
  if (!(a instanceof HTMLButtonElement)) {
    a = document.createElement("button"), a.type = "button", a.classList.add("header-control", "icon"), a.dataset.eidolonAction = "open-light-criteria-manager", a.dataset.tooltip = p("EIDOLON.LightCriteria.OpenManager", "Open Scene Criteria Lighting"), a.setAttribute("aria-label", p("EIDOLON.LightCriteria.OpenManager", "Open Scene Criteria Lighting")), a.innerHTML = '<i class="fa-solid fa-sliders" inert=""></i>';
    const o = r.querySelector(".window-controls") ?? r, s = o.querySelector('[data-action="toggleControls"]');
    if ((s == null ? void 0 : s.parentElement) === o)
      o.insertBefore(a, s);
    else {
      const c = o.querySelector('[data-action="close"]');
      (c == null ? void 0 : c.parentElement) === o ? o.insertBefore(a, c) : o.appendChild(a);
    }
  }
  a.onclick = (o) => {
    o.preventDefault(), Oc(e, { fieldset: n, homeContainer: t });
  };
}
l(Wf, "ensureManagerHeaderButton");
function Oc(e, { fieldset: n, homeContainer: t }) {
  var m, b, h;
  const i = Ki.get(e);
  if (i != null && i.rendered) {
    (m = i.bringToTop) == null || m.call(i);
    return;
  }
  const r = /* @__PURE__ */ l((...y) => {
    var C;
    const T = Kf(y), E = (C = T == null ? void 0 : T.querySelector) == null ? void 0 : C.call(T, ".eidolon-light-criteria-manager-host");
    E instanceof HTMLElement && (Yf(n), n.hidden = !1, E.appendChild(n));
  }, "onRender"), a = /* @__PURE__ */ l(() => {
    t instanceof HTMLElement && t.appendChild(n), n.hidden = !0, Ki.delete(e), requestAnimationFrame(() => {
      var y;
      (y = e.setPosition) == null || y.call(e, { height: "auto" });
    });
  }, "onClose"), o = p("EIDOLON.LightCriteria.ManagerTitle", "Scene Criteria Lighting"), s = '<div class="eidolon-light-criteria-manager-host"></div>', c = p("EIDOLON.LightCriteria.Close", "Close"), u = (h = (b = foundry == null ? void 0 : foundry.applications) == null ? void 0 : b.api) == null ? void 0 : h.DialogV2;
  if (typeof (u == null ? void 0 : u.wait) == "function")
    try {
      let y = !1;
      const T = /* @__PURE__ */ l(() => {
        y || (y = !0, a());
      }, "closeOnce");
      Ki.set(e, {
        rendered: !0,
        bringToTop: /* @__PURE__ */ l(() => {
        }, "bringToTop")
      }), u.wait({
        window: { title: o },
        content: s,
        buttons: [{ action: "close", label: c, default: !0 }],
        render: /* @__PURE__ */ l((...E) => r(...E), "render"),
        close: T,
        rejectClose: !1
      }).catch((E) => {
        console.warn("eidolon-utilities | DialogV2 manager failed, falling back to Dialog", E), T();
      });
      return;
    } catch (y) {
      console.warn("eidolon-utilities | DialogV2 manager failed, falling back to Dialog", y), a();
    }
  const d = globalThis.Dialog;
  if (typeof d != "function") return;
  const g = new d(
    {
      title: o,
      content: s,
      buttons: {
        close: {
          label: c
        }
      },
      render: /* @__PURE__ */ l((...y) => r(...y), "render"),
      close: a
    },
    {
      width: 640,
      resizable: !0
    }
  );
  Ki.set(e, g), g.render(!0);
}
l(Oc, "openManagerDialog");
function Kf(e) {
  for (const n of e) {
    const t = Dt(n);
    if (t) return t;
    const i = Dt(n == null ? void 0 : n.element);
    if (i) return i;
  }
  return null;
}
l(Kf, "findDialogRoot");
function Yf(e) {
  if (!(e instanceof HTMLElement) || e.dataset.managerLayout === "true") return;
  e.dataset.managerLayout = "true", e.classList.add("is-manager");
  const n = e.querySelector("legend"), t = e.querySelector("p.notes:not(.eidolon-light-criteria__status)"), i = e.querySelector(".eidolon-light-criteria__controls"), r = e.querySelector(".eidolon-light-criteria__status"), a = e.querySelector(".eidolon-light-criteria__creation"), o = Array.from(e.querySelectorAll(".eidolon-light-criteria__warning")), s = document.createElement("div");
  s.classList.add("eidolon-light-criteria-manager");
  const c = document.createElement("section");
  c.classList.add("eidolon-light-criteria-manager__section", "is-top"), s.appendChild(c);
  const u = document.createElement("section");
  u.classList.add("eidolon-light-criteria-manager__section", "is-bottom"), s.appendChild(u);
  const d = document.createElement("div");
  if (d.classList.add("eidolon-light-criteria-manager__header"), d.textContent = p("EIDOLON.LightCriteria.ManagerHeader", "Base State"), c.appendChild(d), r && c.appendChild(r), i && c.appendChild(i), o.length) {
    const m = document.createElement("div");
    m.classList.add("eidolon-light-criteria-manager__warnings");
    for (const b of o) m.appendChild(b);
    c.appendChild(m);
  }
  const g = document.createElement("div");
  g.classList.add("eidolon-light-criteria-manager__header"), g.textContent = p("EIDOLON.LightCriteria.ManagerAuthoring", "Create or Update Mapping"), u.appendChild(g), a && u.appendChild(a), e.innerHTML = "", n && e.appendChild(n), t && e.appendChild(t), e.appendChild(s), cs(e, a);
}
l(Yf, "applyManagerLayout");
function Qf(e, n) {
  var i;
  const t = Dt(e == null ? void 0 : e.element);
  return t || (((i = n == null ? void 0 : n.closest) == null ? void 0 : i.call(n, ".application")) ?? null);
}
l(Qf, "resolveApplicationRoot");
function Yi(e, n, t) {
  const i = or.get(e);
  i && (i.restoreConfig = null, i.editorMode = "create", i.editingMappingId = null), n.hidden = !0, t.setAttribute("aria-expanded", "false");
  const r = n.querySelector("p.notes");
  r instanceof HTMLElement && (r.textContent = p(
    "EIDOLON.LightCriteria.CreateDescription",
    "Assign scene criteria values to map the current configuration."
  ));
  const a = n.querySelector('button[data-action="save-mapping"]');
  a instanceof HTMLButtonElement && (a.textContent = p("EIDOLON.LightCriteria.SaveMapping", "Save Mapping")), cs(e, n), requestAnimationFrame(() => {
    var o, s;
    (s = (o = i == null ? void 0 : i.app) == null ? void 0 : o.setPosition) == null || s.call(o, { height: "auto" });
  });
}
l(Yi, "hideCreationSection");
function rn(e, n) {
  if (!e) return;
  const t = !!(n != null && n.base), i = Array.isArray(n == null ? void 0 : n.mappings) ? n.mappings.length : 0, r = [];
  r.push(
    t ? p(
      "EIDOLON.LightCriteria.StatusBaseSaved",
      "Base lighting saved."
    ) : p(
      "EIDOLON.LightCriteria.StatusBaseMissing",
      "Base lighting not yet saved."
    )
  ), r.push(
    p(
      "EIDOLON.LightCriteria.StatusMappingCount",
      "Mappings: {count}"
    ).replace("{count}", String(i))
  ), e.textContent = r.join(" ");
}
l(rn, "updateStatusLine");
function ii(e, { state: n, hasCategories: t }) {
  if (!e) return;
  const i = !!(n != null && n.base), r = i && t;
  e.disabled = !r, e.title = r ? "" : i ? p(
    "EIDOLON.LightCriteria.CreateDisabledNoCategories",
    "Add scene criteria with values before creating mappings."
  ) : p(
    "EIDOLON.LightCriteria.CreateDisabledNoBase",
    "Save a base lighting state before creating criteria mappings."
  );
}
l(ii, "updateCreateButtonState");
function sr(e, n) {
  var c, u, d;
  const t = n ?? Ic(e);
  if (!t)
    throw new Error("Ambient light document unavailable.");
  const i = On(((c = t.toObject) == null ? void 0 : c.call(t)) ?? {});
  if (!i)
    throw new Error("Unable to duplicate ambient light data.");
  const r = (e == null ? void 0 : e.form) instanceof HTMLFormElement ? e.form : null, a = r ? Fu(r) : {}, o = foundry.utils.mergeObject(i, a, {
    inplace: !1,
    performDeletions: !0
  });
  r && (r.querySelectorAll("color-picker[name]").forEach((g) => {
    var E, C;
    const m = g.getAttribute("name");
    if (!m) return;
    const b = typeof g.value == "string" ? g.value : "", h = ((E = g.ui) == null ? void 0 : E.input) ?? ((C = g.querySelector) == null ? void 0 : C.call(g, 'input[type="color"]')), y = (h == null ? void 0 : h.value) ?? "", T = b || y;
    typeof T != "string" || !T || (foundry.utils.setProperty(o, m, T), L("LightCriteria | Captured color-picker value", {
      path: m,
      pickerValue: b,
      swatchValue: y,
      chosenValue: T
    }));
  }), r.querySelectorAll("range-picker[name]").forEach((g) => {
    var F, D;
    const m = g.getAttribute("name");
    if (!m) return;
    const b = g.value !== void 0 && g.value !== null ? String(g.value) : "", h = (F = g.querySelector) == null ? void 0 : F.call(g, 'input[type="range"]'), y = (D = g.querySelector) == null ? void 0 : D.call(g, 'input[type="number"]'), T = h instanceof HTMLInputElement ? h.value : "", E = y instanceof HTMLInputElement ? y.value : "", C = b || E || T;
    if (typeof C != "string" || !C.length) return;
    const A = Number(C), k = Number.isFinite(A) ? A : C;
    foundry.utils.setProperty(o, m, k), L("LightCriteria | Captured range-picker value", {
      path: m,
      elementValue: b,
      numberValue: E,
      rangeValue: T,
      chosenValue: k
    });
  }));
  const s = On(o);
  return L("LightCriteria | Captured form config", {
    lightId: (t == null ? void 0 : t.id) ?? null,
    hasColor: !!((u = s == null ? void 0 : s.config) != null && u.color),
    color: ((d = s == null ? void 0 : s.config) == null ? void 0 : d.color) ?? null
  }), s;
}
l(sr, "captureAmbientLightFormConfig");
function lr(e, n, t) {
  if (!t || typeof t != "object") return;
  const i = foundry.utils.flattenObject(t, { safe: !0 });
  for (const [r, a] of Object.entries(i)) {
    const o = n.querySelectorAll(`[name="${r}"]`);
    if (o.length) {
      L("LightCriteria | Applying field", {
        path: r,
        value: a,
        elementCount: o.length
      });
      for (const s of o)
        s instanceof HTMLElement && s.tagName === "COLOR-PICKER" ? Zf(s, a) : s instanceof HTMLElement && s.tagName === "RANGE-PICKER" ? eg(s, a) : s instanceof HTMLInputElement ? Xf(s, a) : s instanceof HTMLSelectElement ? tg(s, a) : s instanceof HTMLTextAreaElement && ng(s, a);
    }
  }
  requestAnimationFrame(() => {
    var r;
    return (r = e._previewChanges) == null ? void 0 : r.call(e);
  });
}
l(lr, "applyConfigToForm");
function Xf(e, n, t) {
  const i = e.type;
  if (i === "checkbox") {
    const o = !!n;
    e.checked !== o && (e.checked = o, st(e));
    return;
  }
  if (i === "radio") {
    const o = n == null ? "" : String(n), s = e.value === o;
    e.checked !== s && (e.checked = s, s && st(e));
    return;
  }
  const r = n == null ? "" : String(n);
  let a = !1;
  e.value !== r && (e.value = r, a = !0), a && st(e);
}
l(Xf, "applyValueToInput");
function Zf(e, n, t) {
  var s, c, u, d, g, m;
  const i = n == null ? "" : String(n);
  let r = !1;
  e.value !== i && (e.value = i, e.setAttribute("value", i), (s = e.ui) != null && s.setValue && e.ui.setValue(i), r = !0);
  const a = ((c = e.ui) == null ? void 0 : c.input) ?? ((u = e.querySelector) == null ? void 0 : u.call(e, 'input[type="color"]'));
  a instanceof HTMLInputElement && a.value !== i && (a.value = i, st(a));
  const o = ((d = e.ui) == null ? void 0 : d.text) ?? ((g = e.querySelector) == null ? void 0 : g.call(e, 'input[type="text"]'));
  o instanceof HTMLInputElement && o.value !== i && (o.value = i, st(o)), (m = e.ui) != null && m.commit ? e.ui.commit() : (e.dispatchEvent(new Event("input", { bubbles: !0, cancelable: !0 })), e.dispatchEvent(new Event("change", { bubbles: !0, cancelable: !0 }))), L("LightCriteria | Color picker applied", {
    value: i,
    pickerValue: e.value ?? null,
    swatchValue: (a == null ? void 0 : a.value) ?? null,
    textValue: (o == null ? void 0 : o.value) ?? null
  }), r && st(e);
}
l(Zf, "applyValueToColorPicker");
function eg(e, n, t) {
  var u, d;
  const i = n == null ? "" : String(n), r = Number(i), a = Number.isFinite(r) ? r : i;
  let o = !1;
  e.value !== void 0 && e.value !== a && (e.value = a, o = !0), e.getAttribute("value") !== i && (e.setAttribute("value", i), o = !0);
  const s = (u = e.querySelector) == null ? void 0 : u.call(e, 'input[type="range"]');
  s instanceof HTMLInputElement && s.value !== i && (s.value = i, st(s));
  const c = (d = e.querySelector) == null ? void 0 : d.call(e, 'input[type="number"]');
  if (c instanceof HTMLInputElement && c.value !== i && (c.value = i, st(c)), typeof e.commit == "function")
    try {
      e.commit();
    } catch (g) {
      console.error("eidolon-utilities | range-picker commit failed", g);
    }
  L("LightCriteria | Range picker applied", {
    value: i,
    resolvedValue: a,
    rangeValue: (s == null ? void 0 : s.value) ?? null,
    numberValue: (c == null ? void 0 : c.value) ?? null
  }), o && st(e);
}
l(eg, "applyValueToRangePicker");
function tg(e, n, t) {
  const i = n == null ? "" : String(n);
  e.value !== i && (e.value = i, st(e));
}
l(tg, "applyValueToSelect");
function ng(e, n, t) {
  const i = n == null ? "" : String(n);
  e.value !== i && (e.value = i, st(e));
}
l(ng, "applyValueToTextarea");
function st(e) {
  e.dispatchEvent(new Event("input", { bubbles: !0, cancelable: !0 })), e.dispatchEvent(new Event("change", { bubbles: !0, cancelable: !0 }));
}
l(st, "triggerInputChange");
function Ra({
  mappingSelect: e,
  applyMappingButton: n,
  updateMappingButton: t,
  editCriteriaButton: i,
  removeMappingButton: r,
  actionsMenu: a,
  state: o
}) {
  const s = (e == null ? void 0 : e.value) ?? "", c = !!(o != null && o.base), u = s && s !== pe ? !!di(o, s) : !1;
  if (n instanceof HTMLButtonElement && (s ? s === pe ? n.disabled = !c : n.disabled = !u : n.disabled = !0), t instanceof HTMLButtonElement && (s ? s === pe ? t.disabled = !1 : t.disabled = !u : t.disabled = !0), i instanceof HTMLButtonElement && (i.disabled = !s || s === pe || !u), r instanceof HTMLButtonElement && (r.disabled = !s || s === pe || !u), a instanceof HTMLElement) {
    const d = t instanceof HTMLButtonElement && !t.disabled || i instanceof HTMLButtonElement && !i.disabled || r instanceof HTMLButtonElement && !r.disabled;
    a.classList.toggle("is-disabled", !d), !d && "open" in a && (a.open = !1);
  }
}
l(Ra, "syncMappingSwitcherState");
function ig(e) {
  const n = /* @__PURE__ */ new Map();
  for (const t of e) {
    if (!t) continue;
    const i = typeof t.id == "string" ? t.id : null;
    if (!i) continue;
    const r = typeof t.name == "string" && t.name.trim() ? t.name.trim() : p("EIDOLON.LightCriteria.UnnamedCategory", "Unnamed Category");
    n.has(i) || n.set(i, r);
  }
  return n;
}
l(ig, "buildCategoryNameLookup");
function rg(e) {
  const n = {};
  return e instanceof HTMLElement && e.querySelectorAll("select[data-filter-category-id]").forEach((t) => {
    var a, o;
    const i = t.dataset.filterCategoryId, r = (o = (a = t.value) == null ? void 0 : a.trim) == null ? void 0 : o.call(a);
    !i || !r || (n[i] = r);
  }), n;
}
l(rg, "readMappingFilterSelections");
function ag(e) {
  e instanceof HTMLElement && e.querySelectorAll("select[data-filter-category-id]").forEach((n) => {
    n.value = "";
  });
}
l(ag, "resetMappingFilterSelections");
function og(e, n) {
  const t = Array.isArray(e) ? e : [], i = Object.entries(n ?? {}).filter(([, r]) => !!r);
  return i.length ? t.filter((r) => {
    if (!r || typeof r != "object") return !1;
    const a = r.categories ?? {};
    for (const [o, s] of i)
      if ((a == null ? void 0 : a[o]) !== s) return !1;
    return !0;
  }) : t.slice();
}
l(og, "filterMappingsByCriteria");
function sg(e, { totalCount: n = 0, visibleCount: t = 0, hasFilters: i = !1, activeFilterCount: r = 0 } = {}) {
  if (!(e instanceof HTMLElement)) return;
  if (!i) {
    e.textContent = p(
      "EIDOLON.LightCriteria.FilterSummaryAll",
      "All ({count})"
    ).replace("{count}", String(n));
    return;
  }
  const a = p(
    "EIDOLON.LightCriteria.FilterSummaryActive",
    "{active} filters · {visible}/{total}"
  ).replace("{active}", String(r)).replace("{visible}", String(t)).replace("{total}", String(n));
  e.textContent = a;
}
l(sg, "updateMappingFilterMeta");
function lg(e, n, t, i, r = {}) {
  if (!(e instanceof HTMLSelectElement)) return;
  const a = typeof i == "string" ? i : "", o = !!(n != null && n.base), s = Array.isArray(r == null ? void 0 : r.categoryOrder) ? r.categoryOrder : [], c = Array.isArray(r == null ? void 0 : r.mappings) ? r.mappings.slice() : Array.isArray(n == null ? void 0 : n.mappings) ? n.mappings.slice() : [], u = e.value;
  e.innerHTML = "";
  const d = document.createElement("option");
  d.value = "", d.textContent = p(
    "EIDOLON.LightCriteria.SelectPlaceholder",
    "Select a mapping"
  ), d.disabled = o, e.appendChild(d);
  const g = document.createElement("option");
  g.value = pe, g.textContent = p(
    "EIDOLON.LightCriteria.BaseOption",
    "Base Lighting"
  ), g.disabled = !o, e.appendChild(g), c.slice().sort((y, T) => {
    var A;
    const E = Hn(y, t, s), C = Hn(T, t, s);
    return E.localeCompare(C, ((A = game.i18n) == null ? void 0 : A.lang) ?? void 0, {
      sensitivity: "base"
    });
  }).forEach((y) => {
    if (!(y != null && y.id)) return;
    const T = document.createElement("option");
    T.value = y.id, T.textContent = Hn(y, t, s), e.appendChild(T);
  });
  const m = new Set(
    Array.from(e.options).filter((y) => !y.disabled).map((y) => y.value)
  ), b = o && u === "" ? "" : u, h = a || (m.has(b) ? b : "");
  h && m.has(h) ? e.value = h : o ? e.value = pe : e.value = "";
}
l(lg, "populateMappingSelector");
function Hn(e, n, t = []) {
  if (!e || typeof e != "object")
    return p("EIDOLON.LightCriteria.UnnamedMapping", "Unnamed Mapping");
  if (typeof e.label == "string" && e.label.trim())
    return e.label.trim();
  const i = e.categories ?? {}, r = [], a = /* @__PURE__ */ new Set();
  for (const s of t)
    !s || a.has(s) || (r.push(s), a.add(s));
  for (const s of Object.keys(i).sort((c, u) => c.localeCompare(u)))
    a.has(s) || (r.push(s), a.add(s));
  const o = r.map((s) => {
    const c = i == null ? void 0 : i[s];
    if (typeof c != "string" || !c.trim()) return null;
    const u = c.trim();
    return `${n.get(s) ?? p("EIDOLON.LightCriteria.UnnamedCategory", "Unnamed Category")}=${u}`;
  }).filter(Boolean);
  return o.length === 0 ? p("EIDOLON.LightCriteria.UnnamedMapping", "Unnamed Mapping") : o.join(" | ");
}
l(Hn, "formatMappingOptionLabel");
function ko(e, n) {
  if (!e || typeof e != "object" || !Array.isArray(e.mappings)) return null;
  const t = Yn(n);
  if (!t) return null;
  const i = e.mappings.find((r) => (r == null ? void 0 : r.key) === t);
  return (i == null ? void 0 : i.id) ?? null;
}
l(ko, "findMappingIdByCategories");
function di(e, n) {
  return !n || !e || typeof e != "object" || !Array.isArray(e.mappings) ? null : e.mappings.find((t) => (t == null ? void 0 : t.id) === n) ?? null;
}
l(di, "getMappingById");
function cg(e) {
  if (!e || typeof e != "object") return "";
  const n = e.current;
  if (n != null && n.mappingId) {
    if (n.mappingId === pe)
      return e != null && e.base ? pe : "";
    if (Array.isArray(e.mappings) && e.mappings.some((t) => t.id === n.mappingId))
      return n.mappingId;
  }
  if (n != null && n.categories) {
    const t = ko(e, n.categories);
    if (t) return t;
  }
  return "";
}
l(cg, "resolveInitialMappingSelection");
function Qs(e, n = {}) {
  var o, s, c, u;
  if (!(e instanceof HTMLFormElement)) return;
  const t = e.querySelector('color-picker[name="config.color"]'), i = (t == null ? void 0 : t.value) ?? null, r = ((o = t == null ? void 0 : t.ui) == null ? void 0 : o.text) ?? ((s = t == null ? void 0 : t.querySelector) == null ? void 0 : s.call(t, 'input[type="text"]')), a = ((c = t == null ? void 0 : t.ui) == null ? void 0 : c.input) ?? ((u = t == null ? void 0 : t.querySelector) == null ? void 0 : u.call(t, 'input[type="color"]'));
  L("LightCriteria | Color state after apply", {
    ...n,
    textValue: (r == null ? void 0 : r.value) ?? null,
    pickerValue: i,
    swatchValue: (a == null ? void 0 : a.value) ?? null
  });
}
l(Qs, "logAppliedColorState");
function ug(e) {
  e.querySelectorAll("select[data-category-id]").forEach((n) => {
    n.value = "";
  });
}
l(ug, "resetCategorySelections");
function dg(e, n) {
  const t = n && typeof n == "object" ? n : {};
  e.querySelectorAll("select[data-category-id]").forEach((i) => {
    const r = i.dataset.categoryId;
    if (!r) return;
    const a = t[r];
    i.value = typeof a == "string" ? a : "";
  });
}
l(dg, "setCategorySelections");
function fg(e) {
  const n = {};
  return e.querySelectorAll("select[data-category-id]").forEach((t) => {
    var a, o;
    const i = t.dataset.categoryId, r = (o = (a = t.value) == null ? void 0 : a.trim) == null ? void 0 : o.call(a);
    !i || !r || (n[i] = r);
  }), Object.keys(n).length > 0 ? n : null;
}
l(fg, "readCategorySelections");
async function Pa(e, n, t) {
  if (!e) return null;
  try {
    if (!t)
      return await ci(e, {});
    if (t === pe)
      return await ci(e, {
        mappingId: pe,
        categories: null,
        updatedAt: Date.now()
      });
    const i = di(n, t);
    return i ? await ci(e, {
      mappingId: i.id,
      categories: i.categories,
      updatedAt: Date.now()
    }) : null;
  } catch (i) {
    return console.warn("eidolon-utilities | Failed to persist mapping selection", i), null;
  }
}
l(Pa, "persistCurrentSelection");
function cs(e, n) {
  if (!(e instanceof HTMLElement)) return;
  const t = e.querySelector(".eidolon-light-criteria-manager__section.is-bottom");
  t instanceof HTMLElement && (t.hidden = !!(n != null && n.hidden));
}
l(cs, "updateManagerSectionVisibility");
function an({ switcher: e, emptyState: n, state: t }) {
  const i = !!(t != null && t.base);
  e instanceof HTMLElement && (e.hidden = !i), n instanceof HTMLElement && (n.hidden = i);
}
l(an, "updateActiveMappingVisibility");
function Ic(e) {
  const n = (e == null ? void 0 : e.object) ?? (e == null ? void 0 : e.document) ?? null;
  return !(n != null && n.isEmbedded) || n.documentName !== "AmbientLight" ? null : n;
}
l(Ic, "getAmbientLightDocument");
function gg(e) {
  if (!(e != null && e.isEmbedded)) return null;
  const n = e.parent ?? null;
  if (!n) return e;
  if (typeof n.getEmbeddedDocument == "function") {
    const i = n.getEmbeddedDocument(e.documentName, e.id);
    if (i) return i;
  }
  const t = n.lights;
  if (t != null && t.get) {
    const i = t.get(e.id);
    if (i) return i;
  }
  return e;
}
l(gg, "getPersistedAmbientLightDocument");
function mg() {
  Uf();
}
l(mg, "registerLightCriteriaHooks");
mg();
const $o = /* @__PURE__ */ new Map();
let Do = !1;
function us(e, n) {
  $o.has(e) && console.warn(`[${v}] Socket handler for type "${e}" already registered, overwriting.`), $o.set(e, n);
}
l(us, "registerSocketHandler");
function cr(e, n) {
  if (!Do) {
    console.error(`[${v}] Socket not initialized. Call initializeSocket() first.`);
    return;
  }
  game.socket.emit(`module.${v}`, { type: e, payload: n });
}
l(cr, "emitSocket");
function hg() {
  Do || (game.socket.on(`module.${v}`, (e) => {
    const { type: n, payload: t } = e ?? {}, i = $o.get(n);
    i ? i(t) : console.warn(`[${v}] No socket handler for type "${n}"`);
  }), Do = !0, console.log(`[${v}] Socket initialized on channel module.${v}`));
}
l(hg, "initializeSocket");
const Ac = "tween", Nc = "tween-sequence", Fo = "tween-sequence-cancel", Te = Object.freeze({
  ABORT: "abort",
  CONTINUE: "continue"
}), Ht = Object.freeze({
  COMPLETED: "completed",
  CANCELLED: "cancelled",
  FAILED: "failed"
}), Ze = Object.freeze({
  BEFORE_ALL: "beforeAll",
  BEFORE_STEP: "before",
  ENTRY: "entry",
  AFTER_STEP: "after",
  RUNTIME: "runtime",
  VALIDATION: "validation",
  AWAIT: "await",
  EMIT: "emit",
  PARALLEL: "parallel"
}), Nr = /* @__PURE__ */ new Map();
function Ft({ type: e, execute: n, validate: t }) {
  Nr.has(e) && console.warn(`[tween-registry] Type "${e}" already registered, overwriting.`), Nr.set(e, { type: e, execute: n, validate: t ?? (() => {
  }) });
}
l(Ft, "registerTweenType");
function Ri(e) {
  return Nr.get(e);
}
l(Ri, "getTweenType");
function pg(e, n = {}) {
  const t = Ri(e);
  if (!t)
    throw new Error(`Unknown tween type: "${e}".`);
  return t.validate(n ?? {}), t;
}
l(pg, "validateTweenEntry");
function _o() {
  return [...Nr.keys()];
}
l(_o, "listTweenTypes");
const qn = {
  easeInQuad: /* @__PURE__ */ l((e) => e * e, "easeInQuad"),
  easeOutQuad: /* @__PURE__ */ l((e) => e * (2 - e), "easeOutQuad"),
  easeInOutQuad: /* @__PURE__ */ l((e) => e < 0.5 ? 2 * e * e : -1 + (4 - 2 * e) * e, "easeInOutQuad"),
  easeInCubic: /* @__PURE__ */ l((e) => e * e * e, "easeInCubic"),
  easeOutCubic: /* @__PURE__ */ l((e) => {
    const n = e - 1;
    return n * n * n + 1;
  }, "easeOutCubic"),
  easeInOutCubic: /* @__PURE__ */ l((e) => e < 0.5 ? 4 * e * e * e : (e - 1) * (2 * e - 2) * (2 * e - 2) + 1, "easeInOutCubic"),
  easeOutBounce: /* @__PURE__ */ l((e) => {
    if (e < 1 / 2.75) return 7.5625 * e * e;
    if (e < 2 / 2.75) {
      const t = e - 0.5454545454545454;
      return 7.5625 * t * t + 0.75;
    }
    if (e < 2.5 / 2.75) {
      const t = e - 0.8181818181818182;
      return 7.5625 * t * t + 0.9375;
    }
    const n = e - 2.625 / 2.75;
    return 7.5625 * n * n + 0.984375;
  }, "easeOutBounce"),
  easeInBounce: /* @__PURE__ */ l((e) => 1 - qn.easeOutBounce(1 - e), "easeInBounce"),
  easeInOutBounce: /* @__PURE__ */ l((e) => e < 0.5 ? (1 - qn.easeOutBounce(1 - 2 * e)) / 2 : (1 + qn.easeOutBounce(2 * e - 1)) / 2, "easeInOutBounce"),
  easeInElastic: /* @__PURE__ */ l((e) => e === 0 || e === 1 ? e : -Math.pow(2, 10 * (e - 1)) * Math.sin((e - 1.1) * 5 * Math.PI), "easeInElastic"),
  easeOutElastic: /* @__PURE__ */ l((e) => e === 0 || e === 1 ? e : Math.pow(2, -10 * e) * Math.sin((e - 0.1) * 5 * Math.PI) + 1, "easeOutElastic")
};
function Ea(e) {
  if (e && qn[e])
    return qn[e];
  const n = foundry.canvas.animation.CanvasAnimation;
  return {
    linear: n.easeLinear,
    easeInOutCosine: n.easeInOutCosine
  }[e] ?? n.easeInOutCosine;
}
l(Ea, "resolveEasing");
function yg() {
  return ["linear", "easeInOutCosine", ...Object.keys(qn)];
}
l(yg, "listEasingNames");
function Mr(e) {
  return e <= 0.04045 ? e / 12.92 : ((e + 0.055) / 1.055) ** 2.4;
}
l(Mr, "srgbToLinear");
function Bn(e) {
  return e <= 31308e-7 ? 12.92 * e : 1.055 * e ** (1 / 2.4) - 0.055;
}
l(Bn, "linearToSrgb");
function Xs(e, n, t) {
  const i = 0.4122214708 * e + 0.5363325363 * n + 0.0514459929 * t, r = 0.2119034982 * e + 0.6806995451 * n + 0.1073969566 * t, a = 0.0883024619 * e + 0.2817188376 * n + 0.6299787005 * t, o = Math.cbrt(i), s = Math.cbrt(r), c = Math.cbrt(a);
  return [
    0.2104542553 * o + 0.793617785 * s - 0.0040720468 * c,
    1.9779984951 * o - 2.428592205 * s + 0.4505937099 * c,
    0.0259040371 * o + 0.7827717662 * s - 0.808675766 * c
  ];
}
l(Xs, "linearRgbToOklab");
function bg(e, n, t) {
  const i = (e + 0.3963377774 * n + 0.2158037573 * t) ** 3, r = (e - 0.1055613458 * n - 0.0638541728 * t) ** 3, a = (e - 0.0894841775 * n - 1.291485548 * t) ** 3;
  return [
    4.0767416621 * i - 3.3077115913 * r + 0.2309699292 * a,
    -1.2684380046 * i + 2.6097574011 * r - 0.3413193965 * a,
    -0.0041960863 * i - 0.7034186147 * r + 1.707614701 * a
  ];
}
l(bg, "oklabToLinearRgb");
function kr(e) {
  return [e.r, e.g, e.b];
}
l(kr, "colorToRgb");
function Mc(e, n, t) {
  const i = /* @__PURE__ */ l((a) => Math.max(0, Math.min(1, a)), "clamp"), r = /* @__PURE__ */ l((a) => Math.round(i(a) * 255).toString(16).padStart(2, "0"), "toHex");
  return `#${r(e)}${r(n)}${r(t)}`;
}
l(Mc, "rgbToHex");
function wg(e, n, t) {
  if (t <= 0) return e.toHTML();
  if (t >= 1) return n.toHTML();
  const i = foundry.utils.Color, [r, a, o] = e.hsl, [s, c, u] = n.hsl, d = (s - r + 0.5) % 1 - 0.5, g = (r + d * t + 1) % 1, m = a + (c - a) * t, b = o + (u - o) * t;
  return i.fromHSL([g, m, b]).toHTML();
}
l(wg, "interpolateHsl");
function Tg(e, n, t) {
  if (t <= 0) return e.toHTML();
  if (t >= 1) return n.toHTML();
  const [i, r, a] = kr(e).map(Mr), [o, s, c] = kr(n).map(Mr), u = Bn(i + (o - i) * t), d = Bn(r + (s - r) * t), g = Bn(a + (c - a) * t);
  return Mc(u, d, g);
}
l(Tg, "interpolateRgb");
function Eg(e, n, t) {
  if (t <= 0) return e.toHTML();
  if (t >= 1) return n.toHTML();
  const [i, r, a] = kr(e).map(Mr), [o, s, c] = kr(n).map(Mr), [u, d, g] = Xs(i, r, a), [m, b, h] = Xs(o, s, c), y = 0.02, T = Math.sqrt(d * d + g * g), E = Math.sqrt(b * b + h * h);
  let C, A, k;
  if (T < y || E < y)
    C = u + (m - u) * t, A = d + (b - d) * t, k = g + (h - g) * t;
  else {
    const te = Math.atan2(g, d);
    let U = Math.atan2(h, b) - te;
    U > Math.PI && (U -= 2 * Math.PI), U < -Math.PI && (U += 2 * Math.PI), C = u + (m - u) * t;
    const Q = T + (E - T) * t, _ = te + U * t;
    A = Q * Math.cos(_), k = Q * Math.sin(_);
  }
  const [F, D, H] = bg(C, A, k);
  return Mc(Bn(F), Bn(D), Bn(H));
}
l(Eg, "interpolateOklch");
const xo = {
  hsl: wg,
  rgb: Tg,
  oklch: Eg
};
function vg(e = "hsl") {
  return xo[e] ?? xo.hsl;
}
l(vg, "getInterpolator");
function Zs() {
  return Object.keys(xo);
}
l(Zs, "listInterpolationModes");
function Cg(e) {
  if ((Array.isArray(e.uuid) ? e.uuid : [e.uuid]).some((t) => !t || typeof t != "string"))
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
  if (e.mode && !Zs().includes(e.mode))
    throw new Error(
      `light-color tween: unknown mode "${e.mode}". Available: ${Zs().join(", ")}`
    );
}
l(Cg, "validate$5");
async function Sg(e, n = {}) {
  const { CanvasAnimation: t } = foundry.canvas.animation, { Color: i } = foundry.utils, { uuid: r, toColor: a, toAlpha: o, mode: s = "oklch" } = e, c = Array.isArray(r) ? r : [r];
  if (c.length === 0)
    return console.warn("light-color tween: empty uuid array, nothing to animate."), !0;
  const {
    durationMS: u = 2e3,
    easing: d = "easeInOutCosine",
    commit: g = !0,
    startEpochMS: m = null,
    signal: b = null
  } = n, h = Ea(d), y = a != null, T = o != null, E = y ? vg(s) : null, C = y ? i.fromString(a) : null;
  if (y && !C.valid) throw new Error(`light-color tween: invalid target color "${a}".`);
  async function A(F) {
    var W, j;
    if (b != null && b.aborted) return !1;
    const D = await fromUuid(F);
    if (!D) return !1;
    const H = D.object;
    if (!H) return !1;
    let te;
    if (y) {
      const V = (W = D.config) == null ? void 0 : W.color;
      V != null && V.valid || console.warn(`light-color tween: source color invalid on ${F}, using white.`), te = V != null && V.valid ? V : i.fromString("#ffffff");
    }
    const ne = T ? ((j = D._source.config) == null ? void 0 : j.alpha) ?? 0.5 : null, U = { t: 0 }, Q = `ambient-hue-tween:${F}`;
    t.terminateAnimation(Q), b && b.addEventListener("abort", () => {
      t.terminateAnimation(Q);
    }, { once: !0 });
    const _ = typeof m == "number" ? Math.max(0, Math.min(u, Date.now() - m)) : 0, G = /* @__PURE__ */ l((V) => {
      const I = {};
      y && (I.color = E(te, C, V)), T && (I.alpha = ne + (o - ne) * V), D.updateSource({ config: I }), H.initializeLightSource();
    }, "applyFrame");
    _ > 0 && (U.t = _ / u, G(U.t));
    const X = await t.animate(
      [{ parent: U, attribute: "t", to: 1 }],
      {
        name: Q,
        duration: u,
        easing: h,
        time: _,
        ontick: /* @__PURE__ */ l(() => G(U.t), "ontick")
      }
    );
    if (X !== !1) {
      if (b != null && b.aborted) return !1;
      const V = {};
      y && (V.color = C.toHTML()), T && (V.alpha = o), D.updateSource({ config: V }), H.initializeLightSource();
    }
    if (g && X !== !1 && D.canUserModify(game.user, "update")) {
      if (b != null && b.aborted) return !1;
      const V = {}, I = {};
      y && (V.color = te.toHTML(), I["config.color"] = C.toHTML()), T && (V.alpha = ne, I["config.alpha"] = o), D.updateSource({ config: V }), await D.update(I);
    }
    return X !== !1;
  }
  return l(A, "animateOne"), (await Promise.all(c.map(A))).every(Boolean);
}
l(Sg, "execute$5");
function Lg() {
  Ft({ type: "light-color", execute: Sg, validate: Cg });
}
l(Lg, "registerLightColorTween");
const qt = /* @__PURE__ */ new WeakMap();
function Og(e) {
  if ((Array.isArray(e.uuid) ? e.uuid : [e.uuid]).some((t) => !t || typeof t != "string"))
    throw new Error("light-state tween: 'uuid' is required (string or array of AmbientLight document UUIDs).");
  if (typeof e.enabled != "boolean")
    throw new Error("light-state tween: 'enabled' (boolean) is required.");
}
l(Og, "validate$4");
async function Ig(e, n = {}) {
  const { CanvasAnimation: t } = foundry.canvas.animation, { uuid: i, enabled: r } = e, a = Array.isArray(i) ? i : [i];
  if (a.length === 0)
    return console.warn("light-state tween: empty uuid array, nothing to animate."), !0;
  const {
    durationMS: o = 2e3,
    easing: s = "easeInOutCosine",
    commit: c = !0,
    startEpochMS: u = null,
    signal: d = null
  } = n, g = Ea(s);
  async function m(h) {
    var D, H, te, ne;
    if (d != null && d.aborted) return !1;
    const y = await fromUuid(h);
    if (!y) return !1;
    const T = y.object;
    if (!T) return !1;
    const E = `ambient-state-tween:${h}`;
    t.terminateAnimation(E), d && d.addEventListener("abort", () => {
      t.terminateAnimation(E);
    }, { once: !0 });
    const C = qt.get(y) ?? {
      hidden: y._source.hidden,
      alpha: ((D = y._source.config) == null ? void 0 : D.alpha) ?? 0.5
    };
    if (qt.set(y, C), L(`light-state START ${r ? "ON" : "OFF"} | snap: ${JSON.stringify(C)} | _source.hidden=${y._source.hidden}, _source.config.alpha=${(H = y._source.config) == null ? void 0 : H.alpha}`), r && !C.hidden || !r && C.hidden)
      return qt.delete(y), !0;
    const A = C.alpha, k = typeof u == "number" ? Math.max(0, Math.min(o, Date.now() - u)) : 0, F = /* @__PURE__ */ l((U) => {
      y.updateSource({ config: { alpha: U } }), T.initializeLightSource();
    }, "applyAlpha");
    if (r) {
      y.updateSource({ hidden: !1, config: { alpha: 0 } }), T.initializeLightSource(), canvas.perception.update({ refreshLighting: !0, refreshVision: !0 });
      const U = { t: 0 };
      k > 0 && (U.t = k / o, F(A * U.t));
      const Q = await t.animate(
        [{ parent: U, attribute: "t", to: 1 }],
        {
          name: E,
          duration: o,
          easing: g,
          time: k,
          ontick: /* @__PURE__ */ l(() => F(A * U.t), "ontick")
        }
      );
      return Q !== !1 && !(d != null && d.aborted) && c && y.canUserModify(game.user, "update") ? (y.updateSource({ hidden: !0, config: { alpha: A } }), await y.update({ hidden: !1 }), L(`light-state FADE-IN committed. _source.hidden=${y._source.hidden}, _source.config.alpha=${(te = y._source.config) == null ? void 0 : te.alpha}`), qt.delete(y)) : Q === !1 || qt.delete(y), Q !== !1;
    } else {
      y.updateSource({ hidden: !1, config: { alpha: C.alpha } }), T.initializeLightSource();
      const U = { t: 0 };
      k > 0 && (U.t = k / o, F(A * (1 - U.t)));
      const Q = await t.animate(
        [{ parent: U, attribute: "t", to: 1 }],
        {
          name: E,
          duration: o,
          easing: g,
          time: k,
          ontick: /* @__PURE__ */ l(() => F(A * (1 - U.t)), "ontick")
        }
      );
      return Q !== !1 && !(d != null && d.aborted) && c && y.canUserModify(game.user, "update") ? (await y.update({ hidden: !0 }), y.updateSource({ config: { alpha: A } }), T.initializeLightSource(), L(`light-state FADE-OUT committed+restored. _source.hidden=${y._source.hidden}, _source.config.alpha=${(ne = y._source.config) == null ? void 0 : ne.alpha}`), qt.delete(y)) : Q === !1 || (y.updateSource({ hidden: !0, config: { alpha: A } }), T.initializeLightSource(), qt.delete(y)), Q !== !1;
    }
  }
  return l(m, "animateOne"), (await Promise.all(a.map(m))).every(Boolean);
}
l(Ig, "execute$4");
function Ag() {
  Ft({ type: "light-state", execute: Ig, validate: Og });
}
l(Ag, "registerLightStateTween");
function va(e) {
  if ((Array.isArray(e.uuid) ? e.uuid : [e.uuid]).some((t) => !t || typeof t != "string"))
    throw new Error("tile-prop tween: 'uuid' is required (string or array of Tile document UUIDs).");
  if (!e.attribute || typeof e.attribute != "string")
    throw new Error("tile-prop tween: 'attribute' (string) is required — dot-path to a numeric property (e.g. 'alpha', 'rotation').");
  if (typeof e.value != "number")
    throw new Error("tile-prop tween: 'value' (number) is required — the target value to animate to.");
}
l(va, "validate$3");
async function Ca(e, n = {}) {
  const { CanvasAnimation: t } = foundry.canvas.animation, { uuid: i, attribute: r, value: a } = e, o = Array.isArray(i) ? i : [i];
  if (o.length === 0)
    return console.warn("tile-prop tween: empty uuid array, nothing to animate."), !0;
  const {
    durationMS: s = 2e3,
    easing: c = "easeInOutCosine",
    commit: u = !0,
    startEpochMS: d = null,
    signal: g = null
  } = n, m = Ea(c);
  async function b(y) {
    if (g != null && g.aborted) return !1;
    const T = await fromUuid(y);
    if (!T) return !1;
    const E = T.object;
    if (!E) return !1;
    const C = foundry.utils.getProperty(T._source, r);
    if (typeof C != "number")
      return console.warn(`tile-prop tween: source value at '${r}' on ${y} is not a number (got ${typeof C}). Skipping.`), !1;
    const A = `tile-prop-tween:${r}:${y}`;
    t.terminateAnimation(A), g && g.addEventListener("abort", () => {
      t.terminateAnimation(A);
    }, { once: !0 });
    const k = typeof d == "number" ? Math.max(0, Math.min(s, Date.now() - d)) : 0, F = /* @__PURE__ */ l((te) => {
      const ne = C + (a - C) * te;
      T.updateSource(foundry.utils.expandObject({ [r]: ne })), E.refresh();
    }, "applyFrame"), D = { t: 0 };
    k > 0 && (D.t = k / s, F(D.t));
    const H = await t.animate(
      [{ parent: D, attribute: "t", to: 1 }],
      {
        name: A,
        duration: s,
        easing: m,
        time: k,
        ontick: /* @__PURE__ */ l(() => F(D.t), "ontick")
      }
    );
    if (H !== !1) {
      if (g != null && g.aborted) return !1;
      T.updateSource(foundry.utils.expandObject({ [r]: a })), E.refresh();
    }
    if (u && H !== !1 && T.canUserModify(game.user, "update")) {
      if (g != null && g.aborted) return !1;
      T.updateSource(foundry.utils.expandObject({ [r]: C })), await T.update({ [r]: a });
    }
    return H !== !1;
  }
  return l(b, "animateOne"), (await Promise.all(o.map(b))).every(Boolean);
}
l(Ca, "execute$3");
function Ng() {
  Ft({ type: "tile-prop", execute: Ca, validate: va });
}
l(Ng, "registerTilePropTween");
function Mg(e) {
  if (!e.attribute || typeof e.attribute != "string")
    throw new Error("particles-prop tween: 'attribute' (string) is required — property name on canvas.particleeffects (e.g. 'alpha').");
  if (typeof e.value != "number")
    throw new Error("particles-prop tween: 'value' (number) is required — the target value to animate to.");
}
l(Mg, "validate$2");
async function kg(e, n = {}) {
  const { CanvasAnimation: t } = foundry.canvas.animation, { attribute: i, value: r } = e, {
    durationMS: a = 2e3,
    easing: o = "easeInOutCosine",
    startEpochMS: s = null,
    signal: c = null
  } = n, u = canvas.particleeffects;
  if (!u)
    return console.warn("particles-prop tween: canvas.particleeffects not available."), !1;
  const d = u[i];
  if (typeof d != "number")
    return console.warn(`particles-prop tween: current value of '${i}' is not a number (got ${typeof d}). Skipping.`), !1;
  const g = Ea(o), m = `particles-prop-tween:${i}`;
  t.terminateAnimation(m), c && c.addEventListener("abort", () => {
    t.terminateAnimation(m);
  }, { once: !0 });
  const b = typeof s == "number" ? Math.max(0, Math.min(a, Date.now() - s)) : 0, h = /* @__PURE__ */ l((E) => {
    u[i] = d + (r - d) * E;
  }, "applyFrame"), y = { t: 0 };
  b > 0 && (y.t = b / a, h(y.t));
  const T = await t.animate(
    [{ parent: y, attribute: "t", to: 1 }],
    {
      name: m,
      duration: a,
      easing: g,
      time: b,
      ontick: /* @__PURE__ */ l(() => h(y.t), "ontick")
    }
  );
  if (T !== !1) {
    if (c != null && c.aborted) return !1;
    u[i] = r;
  }
  return T !== !1;
}
l(kg, "execute$2");
function $g() {
  Ft({ type: "particles-prop", execute: kg, validate: Mg });
}
l($g, "registerParticlesPropTween");
var zt, Ei, vi, Ci, Si, Li, Un;
const ws = class ws {
  /**
   * @param {AbortController} controller
   */
  constructor(n) {
    O(this, zt);
    O(this, Ei);
    O(this, vi);
    O(this, Ci);
    O(this, Si);
    O(this, Li, !1);
    O(this, Un, null);
    S(this, zt, n), S(this, Ci, new Promise((t) => {
      S(this, Ei, t);
    })), S(this, Si, new Promise((t) => {
      S(this, vi, t);
    }));
  }
  /** @returns {Promise<boolean>} Resolves true (completed) or false (cancelled/failed). */
  get finished() {
    return f(this, Ci);
  }
  /** @returns {Promise<{status: string, [k: string]: unknown}>} */
  get result() {
    return f(this, Si);
  }
  /** @returns {boolean} */
  get cancelled() {
    return f(this, zt).signal.aborted;
  }
  /** @returns {AbortSignal} */
  get signal() {
    return f(this, zt).signal;
  }
  /** @returns {string} */
  get status() {
    return f(this, Un) ? f(this, Un).status : this.cancelled ? "cancelled" : "running";
  }
  /** Abort the timeline, triggering onCancel callbacks. */
  cancel(n = "cancelled") {
    f(this, zt).signal.aborted || f(this, zt).abort(n);
  }
  /**
   * Called internally by the execution engine when the timeline finishes.
   * @param {boolean} completed - true if all steps ran, false if cancelled
   */
  _resolve(n) {
    if (f(this, Li)) return;
    S(this, Li, !0);
    const t = typeof n == "boolean" ? { status: n ? "completed" : "cancelled" } : n ?? { status: "cancelled" };
    S(this, Un, t), f(this, Ei).call(this, t.status === "completed"), f(this, vi).call(this, t);
  }
};
zt = new WeakMap(), Ei = new WeakMap(), vi = new WeakMap(), Ci = new WeakMap(), Si = new WeakMap(), Li = new WeakMap(), Un = new WeakMap(), l(ws, "TimelineHandle");
let Ro = ws;
var pn, Vn, yn;
const Ts = class Ts {
  constructor() {
    /** @type {Map<string, Set<Function>>} */
    O(this, pn, /* @__PURE__ */ new Map());
    /** @type {Set<string>} Signals that have been emitted (sticky) */
    O(this, Vn, /* @__PURE__ */ new Set());
    O(this, yn, !1);
  }
  /**
   * Subscribe to a named signal.
   * @param {string} signal
   * @param {Function} listener
   * @returns {() => void} Unsubscribe function
   */
  on(n, t) {
    if (f(this, yn)) return () => {
    };
    let i = f(this, pn).get(n);
    return i || (i = /* @__PURE__ */ new Set(), f(this, pn).set(n, i)), i.add(t), () => i.delete(t);
  }
  /**
   * Fire a named signal synchronously. All registered listeners are invoked.
   * The signal is recorded so that future waitFor() calls resolve immediately.
   * @param {string} signal
   */
  emit(n) {
    if (f(this, yn)) return;
    f(this, Vn).add(n);
    const t = f(this, pn).get(n);
    if (t)
      for (const i of t)
        i();
  }
  /**
   * Returns a promise that resolves when the signal fires, or rejects
   * if the abort signal fires first.
   * @param {string} signal
   * @param {AbortSignal} [abortSignal]
   * @returns {Promise<void>}
   */
  waitFor(n, t) {
    return f(this, yn) ? Promise.reject(new Error("EventBus destroyed")) : f(this, Vn).has(n) ? Promise.resolve() : new Promise((i, r) => {
      if (t != null && t.aborted)
        return r(t.reason ?? "aborted");
      const a = this.on(n, () => {
        a(), o && (t == null || t.removeEventListener("abort", o)), i();
      });
      let o;
      t && (o = /* @__PURE__ */ l(() => {
        a(), r(t.reason ?? "aborted");
      }, "onAbort"), t.addEventListener("abort", o, { once: !0 }));
    });
  }
  /**
   * Tear down the bus, clearing all listeners.
   */
  destroy() {
    S(this, yn, !0), f(this, pn).clear(), f(this, Vn).clear();
  }
};
pn = new WeakMap(), Vn = new WeakMap(), yn = new WeakMap(), l(Ts, "EventBus");
let Po = Ts;
const kc = /* @__PURE__ */ new Map();
function ds(e, n) {
  kc.set(e, n);
}
l(ds, "registerAwaitProvider");
function Dg(e, n) {
  const t = kc.get(e.event);
  return t ? t(e, n) : Promise.reject(new Error(`Unknown await event type: "${e.event}"`));
}
l(Dg, "createAwaitPromise");
ds("signal", (e, n) => e.name ? n.eventBus.waitFor(e.name, n.signal) : Promise.reject(new Error('await signal: "name" is required')));
ds("click", (e, n) => new Promise((t, i) => {
  if (n.signal.aborted) return i(n.signal.reason ?? "aborted");
  const r = /* @__PURE__ */ l(() => {
    o(), t();
  }, "onClick"), a = /* @__PURE__ */ l(() => {
    o(), i(n.signal.reason ?? "aborted");
  }, "onAbort"), o = /* @__PURE__ */ l(() => {
    document.removeEventListener("click", r), n.signal.removeEventListener("abort", a);
  }, "cleanup");
  document.addEventListener("click", r, { once: !0 }), n.signal.addEventListener("abort", a, { once: !0 });
}));
ds("keypress", (e, n) => new Promise((t, i) => {
  if (n.signal.aborted) return i(n.signal.reason ?? "aborted");
  const r = /* @__PURE__ */ l((s) => {
    e.key && s.key !== e.key || (o(), t());
  }, "onKey"), a = /* @__PURE__ */ l(() => {
    o(), i(n.signal.reason ?? "aborted");
  }, "onAbort"), o = /* @__PURE__ */ l(() => {
    document.removeEventListener("keydown", r), n.signal.removeEventListener("abort", a);
  }, "cleanup");
  document.addEventListener("keydown", r), n.signal.addEventListener("abort", a, { once: !0 });
}));
const Dn = /* @__PURE__ */ new Map();
function Fg(e, n) {
  const t = Dn.get(e);
  t && !t.cancelled && t.cancel("replaced-by-name"), Dn.set(e, n), n.finished.then(() => {
    Dn.get(e) === n && Dn.delete(e);
  });
}
l(Fg, "registerTimeline");
function $c(e) {
  const n = Dn.get(e);
  return n && !n.cancelled ? (n.cancel("cancelled-by-name"), !0) : !1;
}
l($c, "cancelTimeline");
function _g(e) {
  return Dn.get(e);
}
l(_g, "getTimeline");
function el(e, n) {
  return e <= 0 ? Promise.resolve() : new Promise((t, i) => {
    if (n.aborted) return i(n.reason);
    const r = setTimeout(t, e);
    n.addEventListener("abort", () => {
      clearTimeout(r), i(n.reason);
    }, { once: !0 });
  });
}
l(el, "cancellableDelay");
var ke, Gt, Oi, Ii;
const Es = class Es {
  constructor(n) {
    /** @type {TweenTimeline} */
    O(this, ke);
    /** @type {Array<{ type: string, params: object, opts?: object, detach: boolean }>} */
    O(this, Gt, []);
    /** @type {Function|null} */
    O(this, Oi, null);
    /** @type {Function|null} */
    O(this, Ii, null);
    S(this, ke, n);
  }
  /**
   * Add a tween entry to this step.
   * @param {string} type  Registered tween type name
   * @param {object} params  Type-specific parameters
   * @param {object} [opts]  Options (durationMS, easing, etc.)
   * @returns {StepBuilder} this
   */
  add(n, t, i) {
    return f(this, Gt).push({ type: n, params: t, opts: i ?? {}, detach: !1 }), this;
  }
  /**
   * Mark the last entry as fire-and-forget (does not block step progression).
   * @returns {StepBuilder} this
   */
  detach() {
    if (f(this, Gt).length === 0)
      throw new Error("StepBuilder.detach(): no entry to detach.");
    return f(this, Gt)[f(this, Gt).length - 1].detach = !0, this;
  }
  /**
   * Callback invoked before this step's tweens start.
   * @param {Function} fn
   * @returns {StepBuilder} this
   */
  before(n) {
    return S(this, Oi, n), this;
  }
  /**
   * Callback invoked after this step's awaited tweens complete.
   * @param {Function} fn
   * @returns {StepBuilder} this
   */
  after(n) {
    return S(this, Ii, n), this;
  }
  // ── Delegation to parent TweenTimeline for fluent chaining ──
  /** Start a new step (finalizes this one). */
  step() {
    return f(this, ke).step();
  }
  /** Insert a delay between steps. */
  delay(n) {
    return f(this, ke).delay(n);
  }
  /** Insert an await segment. */
  await(n) {
    return f(this, ke).await(n);
  }
  /** Insert an emit segment. */
  emit(n) {
    return f(this, ke).emit(n);
  }
  /** Insert a parallel segment. */
  parallel(n, t) {
    return f(this, ke).parallel(n, t);
  }
  /** Register onComplete callback. */
  onComplete(n) {
    return f(this, ke).onComplete(n);
  }
  /** Register onCancel callback. */
  onCancel(n) {
    return f(this, ke).onCancel(n);
  }
  /** Register onError callback. */
  onError(n) {
    return f(this, ke).onError(n);
  }
  /** Execute the timeline. */
  run(n) {
    return f(this, ke).run(n);
  }
  /** Serialize the timeline. */
  toJSON() {
    return f(this, ke).toJSON();
  }
  // ── Internal access ──
  /** @returns {{ entries: Array, before: Function|null, after: Function|null }} */
  _finalize() {
    return {
      entries: f(this, Gt),
      before: f(this, Oi),
      after: f(this, Ii)
    };
  }
};
ke = new WeakMap(), Gt = new WeakMap(), Oi = new WeakMap(), Ii = new WeakMap(), l(Es, "StepBuilder");
let Ho = Es;
var $e, ve, rt, Jt, Ai, Ni, Mi, ki, Zt, qo, z, Lt, Bo, Dc, jo, Fc, _c, ur, Je, dt;
const At = class At {
  constructor() {
    O(this, z);
    /** @type {string|null} */
    O(this, $e, null);
    /** @type {string} */
    O(this, ve, Te.ABORT);
    /** @type {Array<object>} */
    O(this, rt, []);
    /** @type {StepBuilder|null} */
    O(this, Jt, null);
    /** @type {Function|null} */
    O(this, Ai, null);
    /** @type {Function|null} */
    O(this, Ni, null);
    /** @type {Function|null} */
    O(this, Mi, null);
    /** @type {Function|null} */
    O(this, ki, null);
  }
  /**
   * Register this timeline in the named registry. Starting a new
   * timeline with the same name cancels the previous one.
   * @param {string} name
   * @returns {TweenTimeline} this
   */
  name(n) {
    return S(this, $e, n), this;
  }
  /**
   * Set the error policy for step execution.
   * @param {"abort"|"continue"} policy
   * @returns {TweenTimeline} this
   */
  errorPolicy(n) {
    if (n !== Te.ABORT && n !== Te.CONTINUE)
      throw new Error(`Invalid error policy: "${n}". Use "abort" or "continue".`);
    return S(this, ve, n), this;
  }
  /**
   * Start a new step. Finalizes the previous step if one is open.
   * @returns {StepBuilder}
   */
  step() {
    return w(this, z, Lt).call(this), S(this, Jt, new Ho(this)), f(this, Jt);
  }
  /**
   * Insert a delay (in ms) between the previous step and the next.
   * @param {number} ms
   * @returns {TweenTimeline} this
   */
  delay(n) {
    return w(this, z, Lt).call(this), f(this, rt).push({ kind: "delay", ms: n }), this;
  }
  /**
   * Pause execution until an event occurs.
   * @param {object} config  e.g. { event: "click" }, { event: "signal", name: "fog-done" }
   * @returns {TweenTimeline} this
   */
  await(n) {
    return w(this, z, Lt).call(this), f(this, rt).push({ kind: "await", config: n }), this;
  }
  /**
   * Fire a named signal (instant, non-blocking).
   * @param {string} signal  Signal name
   * @returns {TweenTimeline} this
   */
  emit(n) {
    return w(this, z, Lt).call(this), f(this, rt).push({ kind: "emit", signal: n }), this;
  }
  /**
   * Fork N branches with a join strategy.
   * @param {Array<(tl: TweenTimeline) => void>} branchFns  Callbacks that build each branch
   * @param {object} [opts]
   * @param {"all"|"any"|number} [opts.join="all"]  Join strategy
   * @param {"detach"|"cancel"} [opts.overflow="detach"]  What to do with un-joined branches
   * @returns {TweenTimeline} this
   */
  parallel(n, t = {}) {
    w(this, z, Lt).call(this);
    const i = t.join ?? "all", r = t.overflow ?? "detach";
    if (i !== "all" && i !== "any" && (typeof i != "number" || i < 1 || i > n.length))
      throw new Error(`parallel: join must be "all", "any", or 1..${n.length}, got ${JSON.stringify(i)}`);
    if (r !== "detach" && r !== "cancel")
      throw new Error(`parallel: overflow must be "detach" or "cancel", got ${JSON.stringify(r)}`);
    const a = n.map((o) => {
      var c;
      const s = new At();
      return o(s), w(c = s, z, Lt).call(c), f(s, rt);
    });
    return f(this, rt).push({ kind: "parallel", branches: a, join: i, overflow: r }), this;
  }
  /**
   * Callback invoked before the first step runs.
   * @param {Function} fn
   * @returns {TweenTimeline} this
   */
  beforeAll(n) {
    return S(this, Ai, n), this;
  }
  /**
   * Callback invoked on successful completion.
   * @param {Function} fn
   * @returns {TweenTimeline} this
   */
  onComplete(n) {
    return S(this, Ni, n), this;
  }
  /**
   * Callback invoked on cancellation (mutually exclusive with onComplete).
   * @param {Function} fn
   * @returns {TweenTimeline} this
   */
  onCancel(n) {
    return S(this, Mi, n), this;
  }
  /**
   * Callback invoked on runtime failure (mutually exclusive with onComplete/onCancel).
   * @param {(outcome: object) => void} fn
   * @returns {TweenTimeline} this
   */
  onError(n) {
    return S(this, ki, n), this;
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
    w(this, z, Lt).call(this);
    const t = new AbortController();
    n.signal && (n.signal.aborted ? t.abort(n.signal.reason ?? "parent-aborted") : n.signal.addEventListener("abort", () => {
      t.signal.aborted || t.abort(n.signal.reason ?? "parent-aborted");
    }, { once: !0 }));
    const i = new Ro(t);
    f(this, $e) && Fg(f(this, $e), i);
    const r = n.broadcast ?? game.user.isGM, a = n.commit ?? game.user.isGM, o = n.startEpochMS ?? Date.now();
    r && f(this, $e) && cr(Nc, {
      name: f(this, $e),
      data: this.toJSON(),
      startEpochMS: o
    });
    const s = new Po(), c = {
      signal: i.signal,
      commit: a,
      startEpochMS: o,
      eventBus: s,
      errors: [],
      detachedPromises: []
    };
    return w(this, z, Dc).call(this, i, c).then((u) => {
      var d, g, m;
      s.destroy(), i._resolve(u), u.status === Ht.COMPLETED ? (d = f(this, Ni)) == null || d.call(this) : u.status === Ht.CANCELLED ? ((g = f(this, Mi)) == null || g.call(this), r && f(this, $e) && cr(Fo, {
        name: f(this, $e),
        reason: u.reason
      })) : ((m = f(this, ki)) == null || m.call(this, u), r && f(this, $e) && cr(Fo, {
        name: f(this, $e),
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
    w(this, z, Lt).call(this);
    const t = { timeline: w(i = At, Zt, qo).call(i, f(this, rt)) };
    return f(this, $e) && (t.name = f(this, $e)), f(this, ve) !== Te.ABORT && (t.errorPolicy = f(this, ve)), t;
  }
};
$e = new WeakMap(), ve = new WeakMap(), rt = new WeakMap(), Jt = new WeakMap(), Ai = new WeakMap(), Ni = new WeakMap(), Mi = new WeakMap(), ki = new WeakMap(), Zt = new WeakSet(), qo = /* @__PURE__ */ l(function(n) {
  const t = [];
  for (const i of n)
    if (i.kind === "delay")
      t.push({ delay: i.ms });
    else if (i.kind === "await")
      t.push({ await: i.config });
    else if (i.kind === "emit")
      t.push({ emit: i.signal });
    else if (i.kind === "parallel")
      t.push({
        parallel: {
          branches: i.branches.map((r) => {
            var a;
            return w(a = At, Zt, qo).call(a, r);
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
      t.push(r);
    }
  return t;
}, "#serializeSegments"), z = new WeakSet(), // ── Private ─────────────────────────────────────────────────────────
Lt = /* @__PURE__ */ l(function() {
  f(this, Jt) && (f(this, rt).push({ kind: "step", data: f(this, Jt)._finalize() }), S(this, Jt, null));
}, "#finalizeCurrentStep"), Bo = /* @__PURE__ */ l(function(n) {
  n.length !== 0 && Promise.allSettled(n).catch(() => {
  });
}, "#drainDetached"), Dc = /* @__PURE__ */ l(async function(n, t) {
  var i, r;
  try {
    if (t.signal.aborted) return w(this, z, Je).call(this, t.signal.reason);
    const a = await w(this, z, ur).call(this, f(this, Ai), Ze.BEFORE_ALL, null);
    if (a) {
      if (f(this, ve) === Te.ABORT) return a;
      t.errors.push(a);
    }
    const o = await w(this, z, jo).call(this, f(this, rt), t);
    if (o)
      return w(i = At, Zt, Bo).call(i, t.detachedPromises), o;
    if (!t.signal.aborted) {
      const s = await Promise.allSettled(t.detachedPromises);
      for (const c of s)
        if (c.status === "rejected") {
          const u = w(this, z, dt).call(this, c.reason, Ze.ENTRY);
          if (f(this, ve) === Te.ABORT) return u;
          t.errors.push(u);
        }
    }
    return t.signal.aborted ? w(this, z, Je).call(this, t.signal.reason) : {
      status: Ht.COMPLETED,
      ...t.errors.length > 0 ? { errors: t.errors } : {}
    };
  } catch (a) {
    return w(r = At, Zt, Bo).call(r, t.detachedPromises), t.signal.aborted ? w(this, z, Je).call(this, t.signal.reason) : (console.error("TweenTimeline execution error:", a), w(this, z, dt).call(this, a, Ze.RUNTIME));
  }
}, "#execute"), jo = /* @__PURE__ */ l(async function(n, t) {
  let i = -1, r = 0;
  for (const a of n) {
    if (t.signal.aborted) return w(this, z, Je).call(this, t.signal.reason);
    if (a.kind === "delay") {
      try {
        await el(a.ms, t.signal);
      } catch {
        return w(this, z, Je).call(this, t.signal.reason);
      }
      r += a.ms;
      continue;
    }
    if (a.kind === "await") {
      try {
        let h = Dg(a.config, {
          signal: t.signal,
          eventBus: t.eventBus
        });
        const y = a.config.timeout;
        typeof y == "number" && y > 0 && (h = Promise.race([
          h,
          el(y, t.signal)
        ])), await h;
      } catch (h) {
        if (t.signal.aborted) return w(this, z, Je).call(this, t.signal.reason);
        const y = w(this, z, dt).call(this, h, Ze.AWAIT);
        if (f(this, ve) === Te.ABORT) return y;
        t.errors.push(y);
      }
      continue;
    }
    if (a.kind === "emit") {
      try {
        t.eventBus.emit(a.signal);
      } catch (h) {
        const y = w(this, z, dt).call(this, h, Ze.EMIT);
        if (f(this, ve) === Te.ABORT) return y;
        t.errors.push(y);
      }
      continue;
    }
    if (a.kind === "parallel") {
      const h = await w(this, z, Fc).call(this, a, t);
      if (h) return h;
      continue;
    }
    i += 1;
    const { entries: o, before: s, after: c } = a.data, u = await w(this, z, ur).call(this, s, Ze.BEFORE_STEP, i);
    if (u) {
      if (f(this, ve) === Te.ABORT) return u;
      t.errors.push(u);
      continue;
    }
    if (t.signal.aborted) return w(this, z, Je).call(this, t.signal.reason);
    const d = [];
    let g = 0;
    for (const h of o) {
      const y = Ri(h.type);
      if (!y) {
        const A = w(this, z, dt).call(this, new Error(`TweenTimeline: unknown tween type "${h.type}"`), Ze.ENTRY, i, h.type);
        if (f(this, ve) === Te.ABORT) return A;
        t.errors.push(A), console.warn(A.error.message);
        continue;
      }
      const T = {
        ...h.opts,
        commit: t.commit,
        startEpochMS: t.startEpochMS + r,
        signal: t.signal
      }, E = T.durationMS ?? 2e3, C = Promise.resolve().then(() => y.execute(h.params, T)).then((A) => A === !1 ? {
        ok: !1,
        failure: w(this, z, dt).call(this, new Error("Tween entry returned false."), Ze.ENTRY, i, h.type)
      } : { ok: !0 }).catch((A) => ({
        ok: !1,
        failure: w(this, z, dt).call(this, A, Ze.ENTRY, i, h.type)
      }));
      h.detach ? t.detachedPromises.push(C) : (d.push(C), g = Math.max(g, E));
    }
    const m = await w(this, z, _c).call(this, d, t.signal);
    if (m === null) return w(this, z, Je).call(this, t.signal.reason);
    for (const h of m)
      if (!h.ok) {
        if (f(this, ve) === Te.ABORT) return h.failure;
        t.errors.push(h.failure), console.warn("TweenTimeline: entry failed:", h.failure.error);
      }
    const b = await w(this, z, ur).call(this, c, Ze.AFTER_STEP, i);
    if (b) {
      if (f(this, ve) === Te.ABORT) return b;
      t.errors.push(b);
    }
    if (t.signal.aborted) return w(this, z, Je).call(this, t.signal.reason);
    r += g;
  }
  return null;
}, "#executeSegments"), Fc = /* @__PURE__ */ l(async function(n, t) {
  const { branches: i, join: r, overflow: a } = n, o = i.length, s = r === "all" ? o : r === "any" ? 1 : r, c = i.map(() => {
    const b = new AbortController();
    return t.signal.aborted ? b.abort(t.signal.reason ?? "parent-aborted") : t.signal.addEventListener("abort", () => {
      b.signal.aborted || b.abort(t.signal.reason ?? "parent-aborted");
    }, { once: !0 }), b;
  });
  let u = 0, d = 0;
  const g = new Array(o).fill(null);
  let m;
  return new Promise((b) => {
    let h = !1;
    const y = /* @__PURE__ */ l(() => {
      if (h) return;
      if (u >= s) {
        h = !0, T(), b(null);
        return;
      }
      const E = o - u - d;
      if (u + E < s) {
        h = !0, T();
        const C = g.filter((k) => k && k.status === Ht.FAILED).map((k) => k), A = w(this, z, dt).call(this, new Error(`parallel: join target ${s} impossible (${u} completed, ${d} failed)`), Ze.PARALLEL);
        f(this, ve) === Te.ABORT ? b(A) : (t.errors.push(A), t.errors.push(...C), b(null));
      }
    }, "checkJoin"), T = /* @__PURE__ */ l(() => {
      if (a === "cancel")
        for (let E = 0; E < o; E++)
          !g[E] && !c[E].signal.aborted && c[E].abort("overflow-cancel");
      for (let E = 0; E < o; E++)
        g[E] || t.detachedPromises.push(m[E]);
    }, "applyOverflow");
    if (m = i.map((E, C) => {
      const A = {
        signal: c[C].signal,
        commit: t.commit,
        startEpochMS: t.startEpochMS,
        eventBus: t.eventBus,
        // shared
        errors: t.errors,
        // shared
        detachedPromises: t.detachedPromises
        // shared
      };
      return w(this, z, jo).call(this, E, A).then((k) => {
        if (k)
          if (k.status === Ht.CANCELLED) {
            if (c[C].signal.aborted) {
              g[C] = k;
              return;
            }
            g[C] = k, d++;
          } else
            g[C] = k, d++;
        else
          g[C] = { status: Ht.COMPLETED }, u++;
        y();
      });
    }), t.signal.aborted) {
      h = !0, b(w(this, z, Je).call(this, t.signal.reason));
      return;
    }
    t.signal.addEventListener("abort", () => {
      h || (h = !0, b(w(this, z, Je).call(this, t.signal.reason)));
    }, { once: !0 });
  });
}, "#executeParallel"), /**
 * @param {Array<Promise<{ok: boolean, failure?: object}>>} stepPromises
 * @param {AbortSignal} signal
 * @returns {Promise<Array<{ok: boolean, failure?: object}>|null>}
 */
_c = /* @__PURE__ */ l(function(n, t) {
  return n.length === 0 ? Promise.resolve([]) : t.aborted ? Promise.resolve(null) : new Promise((i, r) => {
    const a = /* @__PURE__ */ l(() => i(null), "onAbort");
    t.addEventListener("abort", a, { once: !0 }), Promise.all(n).then((o) => {
      t.removeEventListener("abort", a), i(o);
    }).catch((o) => {
      t.removeEventListener("abort", a), r(o);
    });
  });
}, "#waitForStep"), ur = /* @__PURE__ */ l(async function(n, t, i) {
  if (!n) return null;
  try {
    return await n(), null;
  } catch (r) {
    const a = w(this, z, dt).call(this, r, t, i ?? void 0);
    return f(this, ve) === Te.CONTINUE && console.warn(`TweenTimeline: hook failure in ${t}:`, r), a;
  }
}, "#runHook"), /** @param {unknown} reason */
Je = /* @__PURE__ */ l(function(n) {
  let t;
  return typeof n == "string" ? t = n : n instanceof Error && (t = n.message), {
    status: Ht.CANCELLED,
    ...t ? { reason: t } : {}
  };
}, "#cancelledOutcome"), /**
 * @param {unknown} err
 * @param {string} phase
 * @param {number} [stepIndex]
 * @param {string} [entryType]
 */
dt = /* @__PURE__ */ l(function(n, t, i, r) {
  const a = n instanceof Error ? n : new Error(String(n));
  return {
    status: Ht.FAILED,
    error: a,
    phase: t,
    ...typeof i == "number" ? { stepIndex: i } : {},
    ...r ? { entryType: r } : {}
  };
}, "#failedOutcome"), O(At, Zt), l(At, "TweenTimeline");
let $r = At;
function fs(e) {
  if (!e || typeof e != "object")
    throw new Error("Sequence JSON: data must be an object.");
  if (!Array.isArray(e.timeline))
    throw new Error("Sequence JSON: 'timeline' must be an array.");
  if (e.name != null && typeof e.name != "string")
    throw new Error("Sequence JSON: 'name' must be a string.");
  if (e.errorPolicy != null && e.errorPolicy !== Te.ABORT && e.errorPolicy !== Te.CONTINUE)
    throw new Error(`Sequence JSON: 'errorPolicy' must be "abort" or "continue".`);
  xc(e.timeline, "timeline", 0);
}
l(fs, "validateSequenceJSON");
function xc(e, n, t = 0) {
  for (let i = 0; i < e.length; i++) {
    const r = e[i], a = `${n}[${i}]`;
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
      if (t >= 8)
        throw new Error(`Sequence JSON: ${a} exceeds maximum parallel nesting depth of 8.`);
      const o = r.parallel;
      if (!o || typeof o != "object")
        throw new Error(`Sequence JSON: ${a}.parallel must be an object.`);
      if (!Array.isArray(o.branches) || o.branches.length === 0)
        throw new Error(`Sequence JSON: ${a}.parallel.branches must be a non-empty array.`);
      const s = o.join ?? "all";
      if (s !== "all" && s !== "any" && (typeof s != "number" || !Number.isInteger(s) || s < 1 || s > o.branches.length))
        throw new Error(`Sequence JSON: ${a}.parallel.join must be "all", "any", or 1..${o.branches.length}.`);
      const c = o.overflow ?? "detach";
      if (c !== "detach" && c !== "cancel")
        throw new Error(`Sequence JSON: ${a}.parallel.overflow must be "detach" or "cancel".`);
      for (let u = 0; u < o.branches.length; u++) {
        const d = o.branches[u];
        if (!Array.isArray(d))
          throw new Error(`Sequence JSON: ${a}.parallel.branches[${u}] must be an array.`);
        xc(d, `${a}.parallel.branches[${u}]`, t + 1);
      }
      continue;
    }
    throw new Error(`Sequence JSON: ${a} is not a recognized segment (step array, delay, await, emit, or parallel).`);
  }
}
l(xc, "validateSegmentsJSON");
function Rc(e) {
  fs(e), Pc(e.timeline, "timeline");
}
l(Rc, "validateSequenceSemantics");
function Pc(e, n) {
  for (let t = 0; t < e.length; t++) {
    const i = e[t], r = `${n}[${t}]`;
    if (Array.isArray(i))
      for (let a = 0; a < i.length; a++) {
        const o = i[a];
        try {
          pg(o.type, o.params ?? {});
        } catch (s) {
          throw new Error(`Sequence JSON: ${r}[${a}] failed semantic validation: ${s.message}`);
        }
      }
    else if (i.parallel)
      for (let a = 0; a < i.parallel.branches.length; a++)
        Pc(i.parallel.branches[a], `${r}.parallel.branches[${a}]`);
  }
}
l(Pc, "validateSegmentsSemantics");
function gs(e, n = {}) {
  fs(e), n.validateSemantics && Rc(e);
  const t = new $r();
  return e.name && t.name(e.name), e.errorPolicy && t.errorPolicy(e.errorPolicy), Hc(e.timeline, t), t;
}
l(gs, "compileSequence");
function Hc(e, n) {
  for (const t of e) {
    if (Array.isArray(t)) {
      const i = n.step();
      for (const r of t)
        i.add(r.type, r.params ?? {}, r.opts), r.detach && i.detach();
      continue;
    }
    if (t.delay !== void 0) {
      n.delay(t.delay);
      continue;
    }
    if (t.await !== void 0) {
      n.await(t.await);
      continue;
    }
    if (t.emit !== void 0) {
      n.emit(t.emit);
      continue;
    }
    if (t.parallel !== void 0) {
      const i = t.parallel, r = i.branches.map((a) => (o) => Hc(a, o));
      n.parallel(r, {
        join: i.join ?? "all",
        overflow: i.overflow ?? "detach"
      });
    }
  }
}
l(Hc, "compileSegments");
function xg(e) {
  fs(e), Rc(e);
}
l(xg, "validate$1");
async function Rg(e, n = {}) {
  return gs(e, { validateSemantics: !0 }).run({
    broadcast: !1,
    commit: n.commit,
    startEpochMS: n.startEpochMS,
    signal: n.signal
  }).finished;
}
l(Rg, "execute$1");
function Pg() {
  Ft({ type: "sequence", execute: Rg, validate: xg });
}
l(Pg, "registerSequenceTween");
function Hg(e) {
  if (e.x == null && e.y == null && e.scale == null)
    throw new Error("camera-pan tween: at least one of 'x', 'y', or 'scale' is required.");
  if (e.x != null && typeof e.x != "number")
    throw new Error("camera-pan tween: 'x' must be a number.");
  if (e.y != null && typeof e.y != "number")
    throw new Error("camera-pan tween: 'y' must be a number.");
  if (e.scale != null && (typeof e.scale != "number" || e.scale <= 0))
    throw new Error("camera-pan tween: 'scale' must be a positive number.");
}
l(Hg, "validate");
async function qg(e, n = {}) {
  const {
    durationMS: t = 2e3,
    startEpochMS: i = null,
    signal: r = null
  } = n;
  if (r != null && r.aborted) return !1;
  const a = typeof i == "number" ? Math.max(0, Math.min(t, Date.now() - i)) : 0, o = Math.max(0, t - a), s = { duration: o };
  if (e.x != null && (s.x = e.x), e.y != null && (s.y = e.y), e.scale != null && (s.scale = e.scale), o <= 0)
    return await canvas.animatePan({ ...s, duration: 0 }), !0;
  const c = canvas.animatePan(s);
  return r ? new Promise((u) => {
    const d = /* @__PURE__ */ l(() => {
      u(!1);
    }, "onAbort");
    r.addEventListener("abort", d, { once: !0 }), c.then(() => {
      r.removeEventListener("abort", d), u(!r.aborted);
    }).catch(() => {
      r.removeEventListener("abort", d), u(!1);
    });
  }) : (await c, !0);
}
l(qg, "execute");
function Bg() {
  Ft({ type: "camera-pan", execute: qg, validate: Hg });
}
l(Bg, "registerCameraPanTween");
async function jg(e, n, t = {}) {
  if (!game.user.isGM)
    return ui.notifications.warn("Only the GM can dispatch tweens."), !1;
  const i = Ri(e);
  if (!i)
    throw new Error(`Unknown tween type: "${e}". Registered types: ${_o().join(", ")}`);
  i.validate(n);
  const { durationMS: r = 2e3, easing: a = "easeInOutCosine", commit: o = !0 } = t, s = Date.now();
  return cr(Ac, {
    type: e,
    params: n,
    durationMS: r,
    easing: a,
    startEpochMS: s,
    commit: !1
  }), i.execute(n, { durationMS: r, easing: a, commit: o, startEpochMS: s });
}
l(jg, "dispatchTween");
function Ug(e) {
  const { type: n, params: t, durationMS: i, easing: r, startEpochMS: a, commit: o } = e ?? {}, s = Ri(n);
  if (!s) {
    console.warn(`[${v}] Received unknown tween type over socket: "${n}"`);
    return;
  }
  s.execute(t, {
    durationMS: i,
    easing: r,
    commit: o ?? !1,
    startEpochMS: a
  });
}
l(Ug, "handleTweenSocketMessage");
Lg();
Ag();
Ng();
$g();
Pg();
Bg();
Ft({ type: "token-prop", execute: Ca, validate: va });
Ft({ type: "drawing-prop", execute: Ca, validate: va });
Ft({ type: "sound-prop", execute: Ca, validate: va });
us(Ac, Ug);
us(Nc, Vg);
us(Fo, zg);
function Vg(e) {
  const { data: n, startEpochMS: t } = e ?? {};
  if (!n) {
    console.warn(`[${v}] Received empty tween-sequence socket message.`);
    return;
  }
  try {
    gs(n, { validateSemantics: !0 }).run({ commit: !1, startEpochMS: t, broadcast: !1 });
  } catch (i) {
    console.error(`[${v}] Failed to run received tween sequence:`, i);
  }
}
l(Vg, "handleSequenceSocketMessage");
function zg(e) {
  const { name: n } = e ?? {};
  n && $c(n);
}
l(zg, "handleSequenceCancelMessage");
function Gg() {
  Hooks.once("ready", () => {
    hg();
    const e = game.modules.get(v);
    e.api || (e.api = {}), e.api.tween = {
      dispatch: jg,
      types: _o,
      Timeline: $r,
      ErrorPolicy: Te,
      compileSequence: gs,
      cancelTimeline: $c,
      getTimeline: _g
    }, console.log(`[${v}] Tween API registered. Types: ${_o().join(", ")}`);
  });
}
l(Gg, "registerTweenHooks");
Gg();
function Ha(e) {
  if (!e) return null;
  if (e.documentName || e._source !== void 0) {
    const n = e.object;
    return n ? { placeable: n, doc: e } : null;
  }
  return e.document ? { placeable: e, doc: e.document } : null;
}
l(Ha, "normalizePlaceable");
function Jg(e) {
  var i, r, a;
  if (e === "$particles") {
    if (!((i = game.modules.get("fxmaster")) != null && i.active))
      return console.warn(`[${v}] Cinematic: FXMaster module is not active — cannot resolve "$particles" target. Install and enable the FXMaster module to use particle effects.`), null;
    const o = canvas.particleeffects;
    return o ? { kind: "particles", target: o } : null;
  }
  if (e.startsWith("tag-all:")) {
    const o = e.slice(8), s = window.Tagger ?? ((r = game.modules.get("tagger")) == null ? void 0 : r.api);
    if (!s)
      return console.warn(`[${v}] Cinematic: Tagger module not available, cannot resolve "${e}".`), null;
    const c = s.getByTag(o, { sceneId: canvas.scene.id });
    if (!(c != null && c.length)) return null;
    const u = [];
    for (const d of c) {
      const g = Ha(d);
      g && u.push(g);
    }
    return u.length === 0 ? null : { kind: "multi-placeable", placeables: u };
  }
  if (e.startsWith("tag:")) {
    const o = e.slice(4), s = window.Tagger ?? ((a = game.modules.get("tagger")) == null ? void 0 : a.api);
    if (!s)
      return console.warn(`[${v}] Cinematic: Tagger module not available, cannot resolve "${e}".`), null;
    const c = s.getByTag(o, { sceneId: canvas.scene.id }), u = (c == null ? void 0 : c[0]) ?? null;
    if (!u) return null;
    const d = Ha(u);
    return d ? { kind: "placeable", ...d } : null;
  }
  const n = fromUuidSync(e);
  if (!n) return null;
  const t = Ha(n);
  return t ? { kind: "placeable", ...t } : null;
}
l(Jg, "resolveTarget");
function ms(e) {
  const n = /* @__PURE__ */ new Set();
  if (e.setup)
    for (const r of Object.keys(e.setup)) n.add(r);
  if (e.landing)
    for (const r of Object.keys(e.landing)) n.add(r);
  e.timeline && Bc(e.timeline, n);
  const t = /* @__PURE__ */ new Map(), i = [];
  for (const r of n) {
    const a = Jg(r);
    a ? t.set(r, a) : i.push(r);
  }
  return i.length && console.warn(`[${v}] Cinematic: ${i.length} unresolved target(s): ${i.join(", ")}`), { targets: t, unresolved: i };
}
l(ms, "resolveAllTargets");
function Wg(e, n) {
  if (!e) return {};
  const t = {};
  for (const [i, r] of Object.entries(e)) {
    const a = n.get(i);
    if (a)
      if (a.kind === "particles") {
        if (a.target.destroyed) continue;
        const o = {};
        for (const s of Object.keys(r))
          o[s] = a.target[s];
        t[i] = o;
      } else if (a.kind === "multi-placeable") {
        const o = a.placeables[0];
        if (!(o != null && o.doc)) continue;
        const s = {};
        for (const c of Object.keys(r))
          s[c] = foundry.utils.getProperty(o.doc._source, c);
        t[i] = s;
      } else {
        if (!a.doc) continue;
        const o = {};
        for (const s of Object.keys(r))
          o[s] = foundry.utils.getProperty(a.doc._source, s);
        t[i] = o;
      }
  }
  return t;
}
l(Wg, "captureSnapshot");
function Kg(e) {
  const n = {};
  function t(i) {
    if (i)
      for (const [r, a] of Object.entries(i))
        n[r] || (n[r] = {}), Object.assign(n[r], a);
  }
  return l(t, "mergeMap"), t(e.setup), t(e.landing), e.timeline && qc(e.timeline, n, t), n;
}
l(Kg, "gatherAllStateMaps");
function qc(e, n, t) {
  var i;
  for (const r of e)
    if (!(r.delay != null || r.await != null || r.emit != null)) {
      if ((i = r.parallel) != null && i.branches) {
        for (const a of r.parallel.branches)
          qc(a, n, t);
        continue;
      }
      if (t(r.before), t(r.after), r.tweens)
        for (const a of r.tweens)
          a.target && a.attribute && (n[a.target] || (n[a.target] = {}), n[a.target][a.attribute] = "__snapshot__");
    }
}
l(qc, "gatherFromEntries");
function Bc(e, n) {
  for (const t of e)
    if (t.delay == null && t.await == null && t.emit == null) {
      if (t.parallel) {
        const i = t.parallel;
        if (i.branches)
          for (const r of i.branches)
            Bc(r, n);
        continue;
      }
      if (t.before)
        for (const i of Object.keys(t.before)) n.add(i);
      if (t.after)
        for (const i of Object.keys(t.after)) n.add(i);
      if (t.tweens)
        for (const i of t.tweens)
          i.target && n.add(i.target);
    }
}
l(Bc, "collectSelectorsFromEntries");
const tl = {
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
}, Yg = /* @__PURE__ */ new Set([
  "alpha",
  "visible",
  "x",
  "y",
  "scale",
  "rotation"
]);
function qa(e, n, t) {
  const i = {};
  for (const [r, a] of Object.entries(e))
    n.has(r) ? i[r] = a : console.warn(`[${v}] Cinematic: blocked property "${r}" on ${t}.`);
  return i;
}
l(qa, "filterOverrides");
function Ye(e, n) {
  var i, r;
  if (!e) return;
  const t = [];
  for (const [a, o] of Object.entries(e)) {
    const s = n.get(a);
    if (s)
      if (s.kind === "particles") {
        if (s.target.destroyed) continue;
        const c = qa(o, Yg, "$particles");
        for (const [u, d] of Object.entries(c))
          s.target[u] = d;
      } else if (s.kind === "multi-placeable")
        for (const { placeable: c, doc: u } of s.placeables) {
          if (!(u != null && u.parent) || !(c != null && c.scene)) continue;
          const d = u.documentName, g = tl[d];
          if (!g) {
            console.warn(`[${v}] Cinematic: no allowlist for document type "${d}" on "${a}", skipping.`);
            continue;
          }
          const m = qa(o, g, `${d} "${a}"`);
          u.updateSource(m), t.push(c);
        }
      else {
        if (!((i = s.doc) != null && i.parent) || !((r = s.placeable) != null && r.scene)) continue;
        const c = s.doc.documentName, u = tl[c];
        if (!u) {
          console.warn(`[${v}] Cinematic: no allowlist for document type "${c}" on "${a}", skipping.`);
          continue;
        }
        const d = qa(o, u, `${c} "${a}"`);
        s.doc.updateSource(d), t.push(s.placeable);
      }
  }
  for (const a of t)
    a.refresh();
}
l(Ye, "applyState");
function Fn(e, n) {
  var t;
  if (e)
    for (const i of Object.keys(e)) {
      const r = n.get(i);
      if ((r == null ? void 0 : r.kind) === "placeable" && ((t = r.doc) == null ? void 0 : t.documentName) === "AmbientLight") {
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
l(Fn, "refreshPerceptionIfNeeded");
const Qg = {
  "tile-prop": /* @__PURE__ */ new Set(["uuid", "attribute", "value"]),
  "light-color": /* @__PURE__ */ new Set(["uuid", "toColor", "toAlpha", "mode"]),
  "light-state": /* @__PURE__ */ new Set(["uuid", "enabled"]),
  "particles-prop": /* @__PURE__ */ new Set(["attribute", "value"]),
  "camera-pan": /* @__PURE__ */ new Set(["x", "y", "scale"]),
  "token-prop": /* @__PURE__ */ new Set(["uuid", "attribute", "value"]),
  "drawing-prop": /* @__PURE__ */ new Set(["uuid", "attribute", "value"]),
  "sound-prop": /* @__PURE__ */ new Set(["uuid", "attribute", "value"])
}, Xg = /* @__PURE__ */ new Set(["duration", "easing", "detach"]), Zg = /* @__PURE__ */ new Set(["type", "target"]);
function jc(e, n) {
  const { type: t, target: i, detach: r = !1, ...a } = e;
  if (!t)
    return console.warn(`[${v}] Cinematic: tween entry missing 'type', skipping.`), null;
  const o = {}, s = {}, c = Qg[t];
  if (i === "$particles")
    o.target = "$particles";
  else if (i) {
    const u = n.get(i);
    if (!u) return null;
    u.kind === "multi-placeable" ? o.uuid = u.placeables.map((d) => d.doc.uuid) : o.uuid = u.doc.uuid;
  }
  for (const [u, d] of Object.entries(a))
    Zg.has(u) || (u === "duration" ? s.durationMS = d : Xg.has(u) ? s[u] = d : (c != null && c.has(u), o[u] = d));
  return { type: t, params: o, opts: s, detach: r };
}
l(jc, "compileTween");
function em(e, n, t, i = {}) {
  const r = new t().name(`cinematic-${canvas.scene.id}`), { skipToStep: a, onStepComplete: o } = i;
  return r.beforeAll(() => {
    var s;
    try {
      Ye(e.setup, n), canvas.perception.update({ refreshLighting: !0, refreshVision: !0 });
    } catch (c) {
      throw console.error(`[${v}] Cinematic: error in beforeAll (setup state) on scene ${(s = canvas.scene) == null ? void 0 : s.id}:`, c), c;
    }
  }), Vc(e.timeline, r, n, { skipToStep: a, onStepComplete: o }), r;
}
l(em, "buildTimeline");
function Uc(e, n) {
  var t;
  if (e)
    for (const i of e)
      for (const r of i) {
        if (r.before)
          try {
            Ye(r.before, n), Fn(r.before, n);
          } catch (a) {
            console.warn(`[${v}] Cinematic: error in skipped parallel before:`, a);
          }
        if (r.after)
          try {
            Ye(r.after, n), Fn(r.after, n);
          } catch (a) {
            console.warn(`[${v}] Cinematic: error in skipped parallel after:`, a);
          }
        (t = r.parallel) != null && t.branches && Uc(r.parallel.branches, n);
      }
}
l(Uc, "applyParallelStatesForSkip");
function Vc(e, n, t, i = {}) {
  const { skipToStep: r, onStepComplete: a } = i;
  let o = -1;
  for (const s of e) {
    if (s.delay != null) {
      if (r != null && o < r) continue;
      n.delay(s.delay);
      continue;
    }
    if (s.await != null) {
      if (r != null && o < r) continue;
      n.await(s.await);
      continue;
    }
    if (s.emit != null) {
      if (r != null && o < r) continue;
      n.emit(s.emit);
      continue;
    }
    if (s.parallel) {
      if (r != null && o < r) {
        Uc(s.parallel.branches, t);
        continue;
      }
      const d = s.parallel, g = d.branches.map((m) => (b) => Vc(m, b, t));
      n.parallel(g, {
        join: d.join ?? "all",
        overflow: d.overflow ?? "detach"
      });
      continue;
    }
    if (!s.tweens || !Array.isArray(s.tweens)) {
      console.warn(`[${v}] Cinematic: timeline entry has no tweens array, skipping.`);
      continue;
    }
    if (o++, r != null && o < r) {
      if (s.before)
        try {
          Ye(s.before, t), Fn(s.before, t);
        } catch (d) {
          console.warn(`[${v}] Cinematic: error applying skipped step.before:`, d);
        }
      if (s.after)
        try {
          Ye(s.after, t), Fn(s.after, t);
        } catch (d) {
          console.warn(`[${v}] Cinematic: error applying skipped step.after:`, d);
        }
      continue;
    }
    const c = o, u = n.step();
    s.before && u.before(() => {
      var d;
      try {
        Ye(s.before, t), Fn(s.before, t);
      } catch (g) {
        throw console.error(`[${v}] Cinematic: error in step.before callback on scene ${(d = canvas.scene) == null ? void 0 : d.id}:`, g), g;
      }
    });
    for (const d of s.tweens) {
      const g = jc(d, t);
      g && (u.add(g.type, g.params, g.opts), g.detach && u.detach());
    }
    u.after(() => {
      var d;
      try {
        s.after && (Ye(s.after, t), Fn(s.after, t)), a == null || a(c);
      } catch (g) {
        throw console.error(`[${v}] Cinematic: error in step.after callback on scene ${(d = canvas.scene) == null ? void 0 : d.id}:`, g), g;
      }
    });
  }
}
l(Vc, "compileCinematicEntries");
function Dr(e, n, t) {
  if (e != null) {
    if (typeof e != "object" || Array.isArray(e)) {
      t.push({ path: n, level: "error", message: `Expected object, got ${Array.isArray(e) ? "array" : typeof e}` });
      return;
    }
    for (const [i, r] of Object.entries(e))
      (typeof r != "object" || r === null || Array.isArray(r)) && t.push({ path: `${n}["${i}"]`, level: "error", message: `Expected property overrides object, got ${Array.isArray(r) ? "array" : typeof r}` });
  }
}
l(Dr, "validateStateMap");
function zc(e, n, t, i) {
  var r;
  for (let a = 0; a < e.length; a++) {
    const o = e[a], s = `${n}[${a}]`;
    if (!(o.delay != null || o.await != null || o.emit != null)) {
      if ((r = o.parallel) != null && r.branches) {
        for (let c = 0; c < o.parallel.branches.length; c++)
          zc(o.parallel.branches[c], `${s}.parallel.branches[${c}]`, t, i);
        continue;
      }
      if (Dr(o.before, `${s}.before`, i), Dr(o.after, `${s}.after`, i), o.tweens)
        for (let c = 0; c < o.tweens.length; c++) {
          const u = o.tweens[c], d = `${s}.tweens[${c}]`;
          if (!u.type) {
            i.push({ path: d, level: "error", message: "Missing 'type' field" });
            continue;
          }
          const g = Ri(u.type);
          if (!g) {
            i.push({ path: d, level: "error", message: `Unknown tween type: "${u.type}"` });
            continue;
          }
          if (t)
            try {
              const m = jc(u, t);
              m ? g.validate(m.params) : u.target && i.push({ path: d, level: "warn", message: `Target "${u.target}" could not be resolved for compilation` });
            } catch (m) {
              i.push({ path: d, level: "error", message: m.message });
            }
          t && u.target && !t.has(u.target) && i.push({ path: `${d}.target`, level: "warn", message: `Target "${u.target}" is not resolved` });
        }
    }
  }
}
l(zc, "validateEntries");
function tm(e, n = null) {
  const t = [];
  return !e || typeof e != "object" ? (t.push({ path: "", level: "error", message: "Cinematic data is not an object" }), t) : (Dr(e.setup, "setup", t), Dr(e.landing, "landing", t), e.timeline && Array.isArray(e.timeline) && zc(e.timeline, "timeline", n, t), t);
}
l(tm, "validateCinematicDeep");
const nl = 2;
var ce, bn, la, Gc, se, Le, ft;
const Bt = class Bt {
  constructor(n = null, { loadedHash: t = null } = {}) {
    O(this, se);
    O(this, ce);
    O(this, bn);
    S(this, ce, n ?? Bt.empty()), S(this, bn, t);
  }
  static empty() {
    return { version: nl, trigger: "canvasReady", tracking: !0, setup: {}, landing: {}, timeline: [] };
  }
  static fromScene(n) {
    var a;
    const t = n == null ? void 0 : n.getFlag(v, "cinematic"), i = t ? foundry.utils.deepClone(t) : null, r = t ? w(a = Bt, la, Gc).call(a, t) : null;
    return new Bt(i, { loadedHash: r });
  }
  /**
   * Check if the scene's cinematic flag has been modified since this state was loaded.
   * @param {object} scene  The Foundry scene document
   * @returns {boolean} true if scene data differs from what was loaded
   */
  isStale(n) {
    if (!f(this, bn)) return !1;
    const t = n == null ? void 0 : n.getFlag(v, "cinematic");
    return t ? !foundry.utils.objectsEqual(t, f(this, bn)) : !1;
  }
  // ── Read ──────────────────────────────────────────────────────────────
  get data() {
    return f(this, ce);
  }
  get timeline() {
    return f(this, ce).timeline;
  }
  get trigger() {
    return f(this, ce).trigger;
  }
  get tracking() {
    return f(this, ce).tracking;
  }
  get setup() {
    return f(this, ce).setup;
  }
  get landing() {
    return f(this, ce).landing;
  }
  get isEmpty() {
    var n;
    return !((n = f(this, ce).timeline) != null && n.length);
  }
  get synchronized() {
    return f(this, ce).synchronized ?? !1;
  }
  // ── Top-level mutations ───────────────────────────────────────────────
  setTrigger(n) {
    return w(this, se, Le).call(this, { trigger: n });
  }
  setTracking(n) {
    return w(this, se, Le).call(this, { tracking: n });
  }
  setSynchronized(n) {
    return w(this, se, Le).call(this, { synchronized: n });
  }
  setSetup(n) {
    return w(this, se, Le).call(this, { setup: n });
  }
  setLanding(n) {
    return w(this, se, Le).call(this, { landing: n });
  }
  // ── Timeline entry mutations ──────────────────────────────────────────
  addStep(n = -1) {
    const t = [...f(this, ce).timeline], i = { tweens: [] };
    return n < 0 || n >= t.length ? t.push(i) : t.splice(n, 0, i), w(this, se, Le).call(this, { timeline: t });
  }
  addDelay(n = -1, t = 1e3) {
    const i = [...f(this, ce).timeline], r = { delay: t };
    return n < 0 || n >= i.length ? i.push(r) : i.splice(n, 0, r), w(this, se, Le).call(this, { timeline: i });
  }
  addAwait(n = -1, t = null) {
    const i = [...f(this, ce).timeline], r = { await: t ?? { event: "click" } };
    return n < 0 || n >= i.length ? i.push(r) : i.splice(n, 0, r), w(this, se, Le).call(this, { timeline: i });
  }
  addEmit(n = -1, t = "") {
    const i = [...f(this, ce).timeline], r = { emit: t };
    return n < 0 || n >= i.length ? i.push(r) : i.splice(n, 0, r), w(this, se, Le).call(this, { timeline: i });
  }
  addParallel(n = -1) {
    const t = [...f(this, ce).timeline], i = { parallel: { branches: [[], []], join: "all", overflow: "detach" } };
    return n < 0 || n >= t.length ? t.push(i) : t.splice(n, 0, i), w(this, se, Le).call(this, { timeline: t });
  }
  moveEntry(n, t) {
    if (n === t) return this;
    const i = [...f(this, ce).timeline];
    if (n < 0 || n >= i.length) return this;
    if (t < 0 || t >= i.length) return this;
    const [r] = i.splice(n, 1);
    return i.splice(t, 0, r), w(this, se, Le).call(this, { timeline: i });
  }
  removeEntry(n) {
    const t = [...f(this, ce).timeline];
    return n < 0 || n >= t.length ? this : (t.splice(n, 1), w(this, se, Le).call(this, { timeline: t }));
  }
  updateEntry(n, t) {
    const i = f(this, ce).timeline.map((r, a) => a !== n ? r : { ...foundry.utils.deepClone(r), ...t });
    return w(this, se, Le).call(this, { timeline: i });
  }
  // ── Tween mutations ──────────────────────────────────────────────────
  addTween(n, t = null) {
    const i = { type: "tile-prop", target: "", attribute: "alpha", value: 1, duration: 1e3 };
    return w(this, se, ft).call(this, n, (r) => {
      const a = [...r.tweens ?? [], t ?? i];
      return { ...r, tweens: a };
    });
  }
  updateTween(n, t, i) {
    return w(this, se, ft).call(this, n, (r) => {
      const a = (r.tweens ?? []).map((o, s) => s !== t ? o : { ...o, ...i });
      return { ...r, tweens: a };
    });
  }
  removeTween(n, t) {
    return w(this, se, ft).call(this, n, (i) => {
      const r = (i.tweens ?? []).filter((a, o) => o !== t);
      return { ...i, tweens: r };
    });
  }
  // ── Parallel branch mutations ────────────────────────────────────────
  addBranch(n) {
    return w(this, se, ft).call(this, n, (t) => {
      if (!t.parallel) return t;
      const i = [...t.parallel.branches, []];
      return { ...t, parallel: { ...t.parallel, branches: i } };
    });
  }
  removeBranch(n, t) {
    return w(this, se, ft).call(this, n, (i) => {
      if (!i.parallel) return i;
      const r = i.parallel.branches.filter((a, o) => o !== t);
      return r.length < 1 ? i : { ...i, parallel: { ...i.parallel, branches: r } };
    });
  }
  addBranchEntry(n, t, i = null) {
    const r = { tweens: [] };
    return w(this, se, ft).call(this, n, (a) => {
      if (!a.parallel) return a;
      const o = a.parallel.branches.map((s, c) => c !== t ? s : [...s, i ?? r]);
      return { ...a, parallel: { ...a.parallel, branches: o } };
    });
  }
  removeBranchEntry(n, t, i) {
    return w(this, se, ft).call(this, n, (r) => {
      if (!r.parallel) return r;
      const a = r.parallel.branches.map((o, s) => s !== t ? o : o.filter((c, u) => u !== i));
      return { ...r, parallel: { ...r.parallel, branches: a } };
    });
  }
  updateBranchEntry(n, t, i, r) {
    return w(this, se, ft).call(this, n, (a) => {
      if (!a.parallel) return a;
      const o = a.parallel.branches.map((s, c) => c !== t ? s : s.map((u, d) => d !== i ? u : { ...foundry.utils.deepClone(u), ...r }));
      return { ...a, parallel: { ...a.parallel, branches: o } };
    });
  }
  moveBranchEntry(n, t, i, r) {
    return i === r ? this : w(this, se, ft).call(this, n, (a) => {
      if (!a.parallel) return a;
      const o = a.parallel.branches.map((s, c) => {
        if (c !== t) return s;
        const u = [...s];
        if (i < 0 || i >= u.length || r < 0 || r >= u.length) return s;
        const [d] = u.splice(i, 1);
        return u.splice(r, 0, d), u;
      });
      return { ...a, parallel: { ...a.parallel, branches: o } };
    });
  }
  // ── Persistence ──────────────────────────────────────────────────────
  async save(n) {
    const t = { ...f(this, ce), version: nl };
    await n.setFlag(v, "cinematic", t);
  }
  toJSON() {
    return foundry.utils.deepClone(f(this, ce));
  }
};
ce = new WeakMap(), bn = new WeakMap(), la = new WeakSet(), Gc = /* @__PURE__ */ l(function(n) {
  return foundry.utils.deepClone(n);
}, "#computeHash"), se = new WeakSet(), // ── Internal ─────────────────────────────────────────────────────────
Le = /* @__PURE__ */ l(function(n) {
  return new Bt({ ...foundry.utils.deepClone(f(this, ce)), ...n }, { loadedHash: f(this, bn) });
}, "#clone"), ft = /* @__PURE__ */ l(function(n, t) {
  if (n < 0 || n >= f(this, ce).timeline.length) return this;
  const i = f(this, ce).timeline.map((r, a) => a !== n ? r : t(foundry.utils.deepClone(r)));
  return w(this, se, Le).call(this, { timeline: i });
}, "#mutateEntry"), O(Bt, la), l(Bt, "CinematicState");
let _n = Bt;
function nm(e) {
  var i, r;
  const n = [], t = window.Tagger ?? ((i = game.modules.get("tagger")) == null ? void 0 : i.api);
  if (t) {
    const a = t.getByTag("*", { sceneId: e.id }), o = /* @__PURE__ */ new Set();
    for (const s of a) {
      const c = t.getTags(s);
      for (const u of c) o.add(u);
    }
    for (const s of [...o].sort())
      n.push({ selector: `tag:${s}`, label: `Tag: ${s} (first)`, kind: "tag" }), n.push({ selector: `tag-all:${s}`, label: `Tag: ${s} (all)`, kind: "tag-all" });
  }
  return (r = game.modules.get("fxmaster")) != null && r.active && canvas.particleeffects && n.push({ selector: "$particles", label: "Particle Effects", kind: "special" }), n;
}
l(nm, "discoverTargets");
const im = [
  { value: "tile-prop", label: "Tile Prop" },
  { value: "light-color", label: "Light Color" },
  { value: "light-state", label: "Light State" },
  { value: "particles-prop", label: "Particles Prop" },
  { value: "camera-pan", label: "Camera Pan" },
  { value: "token-prop", label: "Token Prop" },
  { value: "drawing-prop", label: "Drawing Prop" },
  { value: "sound-prop", label: "Sound Prop" }
], rm = [
  { value: "canvasReady", label: "Canvas Ready" },
  { value: "manual", label: "Manual Only" }
];
var ll, Oe, ee, P, zn, at, pt, ot, ca, Ie, qe, ua, kt, $, Jc, oe, Vo, zo, Go, Jo, Wc, dr, Wo, Kc, Yc, Qc, Xc, Zc, Ko, Yo, eu, fr, tu, nu, iu, ru;
const tt = class tt extends Kn(Wn) {
  constructor(t = {}) {
    super(t);
    O(this, $);
    O(this, Oe, null);
    O(this, ee, null);
    O(this, P, null);
    O(this, zn, []);
    O(this, at, !1);
    O(this, pt, null);
    O(this, ot, null);
    O(this, ca, 120);
    O(this, Ie, []);
    O(this, qe, -1);
    O(this, ua, 50);
    O(this, kt, null);
    S(this, Oe, t.scene ?? canvas.scene ?? null), S(this, ee, _n.fromScene(f(this, Oe))), S(this, zn, f(this, Oe) ? nm(f(this, Oe)) : []);
  }
  // ── Context ───────────────────────────────────────────────────────────
  async _prepareContext() {
    var o;
    const t = w(this, $, tu).call(this);
    let i = 0;
    const r = f(this, ee).timeline.map((s, c) => {
      var C, A, k, F;
      const u = s.delay != null, d = s.await != null, g = s.emit != null, m = s.parallel != null, b = !u && !d && !g && !m;
      b && i++;
      let h, y, T, E;
      if (u)
        h = `${s.delay}ms`, y = "delay", T = "cinematic-editor__block--delay", E = s.delay;
      else if (d)
        h = "Await", y = ((C = s.await) == null ? void 0 : C.event) ?? "click", T = "cinematic-editor__block--await", E = 500;
      else if (g)
        h = "Emit", y = s.emit || "(unnamed)", T = "cinematic-editor__block--emit", E = 500;
      else if (m) {
        const D = ((k = (A = s.parallel) == null ? void 0 : A.branches) == null ? void 0 : k.length) ?? 0;
        h = "Parallel", y = `${D} branch${D !== 1 ? "es" : ""}`, T = "cinematic-editor__block--parallel", E = 500;
      } else {
        const D = ((F = s.tweens) == null ? void 0 : F.length) ?? 0;
        h = `Step ${i}`, y = `${D} tween${D !== 1 ? "s" : ""}`, T = "cinematic-editor__block--step", E = w(this, $, fr).call(this, s);
      }
      return {
        index: c,
        isDelay: u,
        isAwait: d,
        isEmit: g,
        isParallel: m,
        isStep: b,
        selected: c === f(this, P),
        duration: E,
        label: h,
        sub: y,
        blockClass: T,
        flexBasis: t > 0 ? `${E / t * 100}%` : "1"
      };
    }), a = f(this, P) != null ? w(this, $, ru).call(this, f(this, P)) : null;
    return {
      sceneName: ((o = f(this, Oe)) == null ? void 0 : o.name) ?? "No scene",
      trigger: f(this, ee).trigger,
      tracking: f(this, ee).tracking,
      synchronized: f(this, ee).synchronized,
      triggerOptions: rm.map((s) => ({
        ...s,
        selected: s.value === f(this, ee).trigger
      })),
      timelineEntries: r,
      detail: a,
      setupCount: Object.keys(f(this, ee).setup ?? {}).length,
      landingCount: Object.keys(f(this, ee).landing ?? {}).length,
      dirty: f(this, at),
      totalDuration: t,
      entryCount: f(this, ee).timeline.length,
      targetCount: w(this, $, iu).call(this),
      canUndo: f(this, $, Vo),
      canRedo: f(this, $, zo)
    };
  }
  // ── Render & Events ───────────────────────────────────────────────────
  _onRender(t, i) {
    super._onRender(t, i), w(this, $, Jc).call(this), f(this, kt) || (S(this, kt, (r) => {
      !r.ctrlKey && !r.metaKey || (r.key === "z" && !r.shiftKey ? (r.preventDefault(), w(this, $, Go).call(this)) : (r.key === "z" && r.shiftKey || r.key === "y") && (r.preventDefault(), w(this, $, Jo).call(this)));
    }), document.addEventListener("keydown", f(this, kt)));
  }
  async close(t = {}) {
    if (f(this, ot) && w(this, $, dr).call(this), f(this, at) && !t.force) {
      const i = await new Promise((r) => {
        new Dialog({
          title: "Unsaved Changes",
          content: "<p>You have unsaved cinematic changes.</p>",
          buttons: {
            save: { label: "Save & Close", icon: '<i class="fas fa-save"></i>', callback: /* @__PURE__ */ l(() => r("save"), "callback") },
            discard: { label: "Discard", icon: '<i class="fas fa-trash"></i>', callback: /* @__PURE__ */ l(() => r("discard"), "callback") },
            cancel: { label: "Cancel", icon: '<i class="fas fa-times"></i>', callback: /* @__PURE__ */ l(() => r("cancel"), "callback") }
          },
          default: "cancel",
          close: /* @__PURE__ */ l(() => r("cancel"), "close")
        }).render(!0);
      });
      if (i === "cancel") return;
      i === "save" && await w(this, $, Wo).call(this);
    }
    return super.close(t);
  }
  async _onClose(t) {
    return f(this, pt) !== null && (clearTimeout(f(this, pt)), S(this, pt, null)), f(this, kt) && (document.removeEventListener("keydown", f(this, kt)), S(this, kt, null)), super._onClose(t);
  }
};
Oe = new WeakMap(), ee = new WeakMap(), P = new WeakMap(), zn = new WeakMap(), at = new WeakMap(), pt = new WeakMap(), ot = new WeakMap(), ca = new WeakMap(), Ie = new WeakMap(), qe = new WeakMap(), ua = new WeakMap(), kt = new WeakMap(), $ = new WeakSet(), Jc = /* @__PURE__ */ l(function() {
  var r, a, o, s, c, u, d, g, m, b, h, y, T, E, C, A, k, F, D, H, te, ne, U, Q, _, G, X, W, j, V;
  const t = this.element;
  if (!(t instanceof HTMLElement)) return;
  t.querySelectorAll("[data-action='select-entry']").forEach((I) => {
    I.addEventListener("click", () => {
      const M = Number(I.dataset.index);
      S(this, P, f(this, P) === M ? null : M), this.render({ force: !0 });
    });
  });
  let i = null;
  t.querySelectorAll("[data-action='select-entry']").forEach((I) => {
    I.addEventListener("dragstart", (M) => {
      i = Number(I.dataset.index), I.classList.add("dragging"), M.dataTransfer.effectAllowed = "move";
    }), I.addEventListener("dragover", (M) => {
      M.preventDefault(), M.dataTransfer.dropEffect = "move";
    }), I.addEventListener("dragenter", (M) => {
      M.preventDefault(), I.classList.add("cinematic-editor__block--drag-over");
    }), I.addEventListener("dragleave", () => {
      I.classList.remove("cinematic-editor__block--drag-over");
    }), I.addEventListener("drop", (M) => {
      M.preventDefault(), I.classList.remove("cinematic-editor__block--drag-over");
      const x = Number(I.dataset.index);
      i != null && i !== x && (f(this, P) === i ? S(this, P, x) : f(this, P) != null && (i < f(this, P) && x >= f(this, P) ? ti(this, P)._-- : i > f(this, P) && x <= f(this, P) && ti(this, P)._++), w(this, $, oe).call(this, (K) => K.moveEntry(i, x))), i = null;
    }), I.addEventListener("dragend", () => {
      I.classList.remove("dragging"), i = null;
    });
  }), (r = t.querySelector("[data-action='save']")) == null || r.addEventListener("click", () => w(this, $, Wo).call(this)), (a = t.querySelector("[data-action='play-preview']")) == null || a.addEventListener("click", () => w(this, $, Kc).call(this)), (o = t.querySelector("[data-action='reset-tracking']")) == null || o.addEventListener("click", () => w(this, $, Yc).call(this)), (s = t.querySelector("[data-action='export-json']")) == null || s.addEventListener("click", () => w(this, $, Qc).call(this)), (c = t.querySelector("[data-action='undo']")) == null || c.addEventListener("click", () => w(this, $, Go).call(this)), (u = t.querySelector("[data-action='redo']")) == null || u.addEventListener("click", () => w(this, $, Jo).call(this)), (d = t.querySelector("[data-action='validate']")) == null || d.addEventListener("click", () => w(this, $, Xc).call(this)), (g = t.querySelector("[data-action='import-json']")) == null || g.addEventListener("click", () => w(this, $, Zc).call(this)), (m = t.querySelector("[data-action='change-trigger']")) == null || m.addEventListener("change", (I) => {
    w(this, $, oe).call(this, (M) => M.setTrigger(I.target.value));
  }), (b = t.querySelector("[data-action='change-tracking']")) == null || b.addEventListener("change", (I) => {
    w(this, $, oe).call(this, (M) => M.setTracking(I.target.checked));
  }), (h = t.querySelector("[data-action='change-synchronized']")) == null || h.addEventListener("change", (I) => {
    w(this, $, oe).call(this, (M) => M.setSynchronized(I.target.checked));
  }), (y = t.querySelector("[data-action='add-step']")) == null || y.addEventListener("click", () => {
    w(this, $, oe).call(this, (I) => I.addStep());
  }), (T = t.querySelector("[data-action='add-delay']")) == null || T.addEventListener("click", () => {
    w(this, $, oe).call(this, (I) => I.addDelay());
  }), (E = t.querySelector("[data-action='add-await']")) == null || E.addEventListener("click", () => {
    w(this, $, oe).call(this, (I) => I.addAwait());
  }), (C = t.querySelector("[data-action='add-emit']")) == null || C.addEventListener("click", () => {
    w(this, $, oe).call(this, (I) => I.addEmit());
  }), (A = t.querySelector("[data-action='add-parallel']")) == null || A.addEventListener("click", () => {
    w(this, $, oe).call(this, (I) => I.addParallel());
  }), (k = t.querySelector("[data-action='delete-entry']")) == null || k.addEventListener("click", () => {
    f(this, P) != null && (w(this, $, oe).call(this, (I) => I.removeEntry(f(this, P))), S(this, P, null));
  }), (F = t.querySelector("[data-action='add-tween']")) == null || F.addEventListener("click", () => {
    f(this, P) != null && w(this, $, oe).call(this, (I) => I.addTween(f(this, P)));
  }), (D = t.querySelector("[data-action='change-delay']")) == null || D.addEventListener("change", (I) => {
    f(this, P) != null && w(this, $, oe).call(this, (M) => M.updateEntry(f(this, P), { delay: Number(I.target.value) || 0 }));
  }), t.querySelectorAll("[data-action='delete-tween']").forEach((I) => {
    I.addEventListener("click", () => {
      const M = Number(I.dataset.tweenIndex);
      f(this, P) == null || Number.isNaN(M) || w(this, $, oe).call(this, (x) => x.removeTween(f(this, P), M));
    });
  }), t.querySelectorAll(".cinematic-editor__tween-row").forEach((I) => {
    const M = Number(I.dataset.tweenIndex);
    I.querySelectorAll("[data-field]").forEach((x) => {
      const K = x.dataset.field, Et = x.tagName === "SELECT" || x.type === "checkbox" ? "change" : "input";
      x.addEventListener(Et, (Be) => {
        let ge;
        x.type === "checkbox" ? ge = x.checked : K === "duration" ? ge = Number(x.value) || 0 : K === "value" && !Number.isNaN(Number(x.value)) && x.value.trim() !== "" ? ge = Number(x.value) : ge = x.value, w(this, $, Wc).call(this, M, { [K]: ge });
      });
    });
  }), (H = t.querySelector("[data-action='edit-setup']")) == null || H.addEventListener("click", () => w(this, $, Ko).call(this, "setup")), (te = t.querySelector("[data-action='edit-landing']")) == null || te.addEventListener("click", () => w(this, $, Ko).call(this, "landing")), (ne = t.querySelector("[data-action='edit-before']")) == null || ne.addEventListener("click", () => w(this, $, Yo).call(this, "before")), (U = t.querySelector("[data-action='edit-after']")) == null || U.addEventListener("click", () => w(this, $, Yo).call(this, "after")), (Q = t.querySelector("[data-action='change-await-event']")) == null || Q.addEventListener("change", (I) => {
    if (f(this, P) == null) return;
    const M = f(this, ee).timeline[f(this, P)];
    M != null && M.await && w(this, $, oe).call(this, (x) => x.updateEntry(f(this, P), { await: { ...M.await, event: I.target.value } }));
  }), (_ = t.querySelector("[data-action='change-await-signal']")) == null || _.addEventListener("change", (I) => {
    if (f(this, P) == null) return;
    const M = f(this, ee).timeline[f(this, P)];
    M != null && M.await && w(this, $, oe).call(this, (x) => x.updateEntry(f(this, P), { await: { ...M.await, signal: I.target.value } }));
  }), (G = t.querySelector("[data-action='change-emit-signal']")) == null || G.addEventListener("change", (I) => {
    f(this, P) != null && w(this, $, oe).call(this, (M) => M.updateEntry(f(this, P), { emit: I.target.value }));
  }), (X = t.querySelector("[data-action='change-parallel-join']")) == null || X.addEventListener("change", (I) => {
    if (f(this, P) == null) return;
    const M = f(this, ee).timeline[f(this, P)];
    M != null && M.parallel && w(this, $, oe).call(this, (x) => x.updateEntry(f(this, P), { parallel: { ...M.parallel, join: I.target.value } }));
  }), (W = t.querySelector("[data-action='change-parallel-overflow']")) == null || W.addEventListener("change", (I) => {
    if (f(this, P) == null) return;
    const M = f(this, ee).timeline[f(this, P)];
    M != null && M.parallel && w(this, $, oe).call(this, (x) => x.updateEntry(f(this, P), { parallel: { ...M.parallel, overflow: I.target.value } }));
  }), (j = t.querySelector("[data-action='edit-parallel-json']")) == null || j.addEventListener("click", () => w(this, $, eu).call(this)), (V = t.querySelector("[data-action='add-branch']")) == null || V.addEventListener("click", () => {
    f(this, P) != null && w(this, $, oe).call(this, (I) => I.addBranch(f(this, P)));
  }), t.querySelectorAll("[data-action='remove-branch']").forEach((I) => {
    I.addEventListener("click", () => {
      const M = Number(I.dataset.branchIndex);
      f(this, P) == null || Number.isNaN(M) || w(this, $, oe).call(this, (x) => x.removeBranch(f(this, P), M));
    });
  }), t.querySelectorAll("[data-action='add-branch-step']").forEach((I) => {
    I.addEventListener("click", () => {
      const M = Number(I.dataset.branchIndex);
      f(this, P) == null || Number.isNaN(M) || w(this, $, oe).call(this, (x) => x.addBranchEntry(f(this, P), M, { tweens: [] }));
    });
  }), t.querySelectorAll("[data-action='add-branch-delay']").forEach((I) => {
    I.addEventListener("click", () => {
      const M = Number(I.dataset.branchIndex);
      f(this, P) == null || Number.isNaN(M) || w(this, $, oe).call(this, (x) => x.addBranchEntry(f(this, P), M, { delay: 1e3 }));
    });
  }), t.querySelectorAll("[data-action='remove-branch-entry']").forEach((I) => {
    I.addEventListener("click", () => {
      const M = Number(I.dataset.branchIndex), x = Number(I.dataset.branchEntryIndex);
      f(this, P) == null || Number.isNaN(M) || Number.isNaN(x) || w(this, $, oe).call(this, (K) => K.removeBranchEntry(f(this, P), M, x));
    });
  });
}, "#bindEvents"), // ── State mutation ────────────────────────────────────────────────────
oe = /* @__PURE__ */ l(function(t) {
  S(this, Ie, f(this, Ie).slice(0, f(this, qe) + 1)), f(this, Ie).push(f(this, ee)), f(this, Ie).length > f(this, ua) && f(this, Ie).shift(), S(this, qe, f(this, Ie).length - 1), S(this, ee, t(f(this, ee))), S(this, at, !0), this.render({ force: !0 });
}, "#mutate"), Vo = /* @__PURE__ */ l(function() {
  return f(this, qe) >= 0;
}, "#canUndo"), zo = /* @__PURE__ */ l(function() {
  return f(this, qe) < f(this, Ie).length - 1;
}, "#canRedo"), Go = /* @__PURE__ */ l(function() {
  f(this, $, Vo) && (f(this, qe) === f(this, Ie).length - 1 && f(this, Ie).push(f(this, ee)), S(this, ee, f(this, Ie)[f(this, qe)]), ti(this, qe)._--, S(this, at, !0), this.render({ force: !0 }));
}, "#undo"), Jo = /* @__PURE__ */ l(function() {
  f(this, $, zo) && (ti(this, qe)._++, S(this, ee, f(this, Ie)[f(this, qe) + 1]), S(this, at, !0), this.render({ force: !0 }));
}, "#redo"), Wc = /* @__PURE__ */ l(function(t, i) {
  var r;
  f(this, P) != null && (S(this, ot, {
    ...f(this, ot) ?? {},
    entryIndex: f(this, P),
    tweenIndex: t,
    patch: { ...((r = f(this, ot)) == null ? void 0 : r.patch) ?? {}, ...i }
  }), f(this, pt) !== null && clearTimeout(f(this, pt)), S(this, pt, setTimeout(() => {
    S(this, pt, null), w(this, $, dr).call(this);
  }, f(this, ca))));
}, "#queueTweenChange"), dr = /* @__PURE__ */ l(function() {
  if (!f(this, ot)) return;
  const { entryIndex: t, tweenIndex: i, patch: r } = f(this, ot);
  S(this, ot, null), S(this, ee, f(this, ee).updateTween(t, i, r)), S(this, at, !0);
}, "#flushTweenChanges"), Wo = /* @__PURE__ */ l(async function() {
  var t, i, r, a, o, s;
  if (f(this, Oe)) {
    if (f(this, ot) && w(this, $, dr).call(this), f(this, ee).isStale(f(this, Oe))) {
      const c = await new Promise((u) => {
        new Dialog({
          title: "External Changes Detected",
          content: "<p>The scene's cinematic data was modified externally. Overwrite with your changes?</p>",
          buttons: {
            overwrite: { label: "Overwrite", icon: '<i class="fas fa-save"></i>', callback: /* @__PURE__ */ l(() => u(!0), "callback") },
            reload: { label: "Reload", icon: '<i class="fas fa-sync"></i>', callback: /* @__PURE__ */ l(() => u("reload"), "callback") },
            cancel: { label: "Cancel", icon: '<i class="fas fa-times"></i>', callback: /* @__PURE__ */ l(() => u(!1), "callback") }
          },
          default: "cancel",
          close: /* @__PURE__ */ l(() => u(!1), "close")
        }).render(!0);
      });
      if (c === "reload") {
        S(this, ee, _n.fromScene(f(this, Oe))), S(this, at, !1), S(this, Ie, []), S(this, qe, -1), this.render({ force: !0 }), (i = (t = ui.notifications) == null ? void 0 : t.info) == null || i.call(t, "Cinematic reloaded from scene.");
        return;
      }
      if (!c) return;
    }
    try {
      await f(this, ee).save(f(this, Oe)), S(this, ee, _n.fromScene(f(this, Oe))), S(this, at, !1), (a = (r = ui.notifications) == null ? void 0 : r.info) == null || a.call(r, "Cinematic saved."), this.render({ force: !0 });
    } catch (c) {
      console.error(`${v} | Cinematic save failed`, c), (s = (o = ui.notifications) == null ? void 0 : o.error) == null || s.call(o, "Failed to save cinematic data.");
    }
  }
}, "#onSave"), Kc = /* @__PURE__ */ l(async function() {
  var i, r, a, o, s;
  const t = (r = (i = game.modules.get(v)) == null ? void 0 : i.api) == null ? void 0 : r.cinematic;
  if (!(t != null && t.play)) {
    (o = (a = ui.notifications) == null ? void 0 : a.warn) == null || o.call(a, "Cinematic API not available.");
    return;
  }
  await t.play((s = f(this, Oe)) == null ? void 0 : s.id);
}, "#onPlay"), Yc = /* @__PURE__ */ l(async function() {
  var i, r, a, o, s;
  const t = (r = (i = game.modules.get(v)) == null ? void 0 : i.api) == null ? void 0 : r.cinematic;
  t != null && t.reset && (await t.reset((a = f(this, Oe)) == null ? void 0 : a.id), (s = (o = ui.notifications) == null ? void 0 : o.info) == null || s.call(o, "Cinematic tracking reset."));
}, "#onResetTracking"), Qc = /* @__PURE__ */ l(async function() {
  var i, r;
  const t = JSON.stringify(f(this, ee).toJSON(), null, 2);
  try {
    await navigator.clipboard.writeText(t), (r = (i = ui.notifications) == null ? void 0 : i.info) == null || r.call(i, "Cinematic JSON copied to clipboard.");
  } catch {
    new Dialog({
      title: "Cinematic JSON",
      content: `<textarea style="width:100%;height:300px;font-family:monospace;font-size:0.8rem">${yt(t)}</textarea>`,
      buttons: { ok: { label: "Close" } }
    }).render(!0);
  }
}, "#onExportJSON"), Xc = /* @__PURE__ */ l(function() {
  var c, u;
  const t = f(this, ee).toJSON(), { targets: i, unresolved: r } = ms(t), a = tm(t, i), o = [
    ...r.map((d) => ({ path: "targets", level: "warn", message: `Unresolved target: "${d}"` })),
    ...a
  ];
  if (o.length === 0) {
    (u = (c = ui.notifications) == null ? void 0 : c.info) == null || u.call(c, "Cinematic validation passed — no issues found.");
    return;
  }
  const s = o.map((d) => {
    const g = d.level === "error" ? "fa-circle-xmark" : "fa-triangle-exclamation", m = d.level === "error" ? "#e74c3c" : "#f39c12";
    return `<li style="margin:0.3rem 0"><i class="fa-solid ${g}" style="color:${m};margin-right:0.3rem"></i><strong>${yt(d.path)}</strong>: ${yt(d.message)}</li>`;
  });
  new Dialog({
    title: "Cinematic Validation",
    content: `<p>${o.length} issue(s) found:</p><ul style="list-style:none;padding:0;max-height:300px;overflow:auto">${s.join("")}</ul>`,
    buttons: { ok: { label: "Close" } }
  }).render(!0);
}, "#onValidate"), Zc = /* @__PURE__ */ l(function() {
  new Dialog({
    title: "Import Cinematic JSON",
    content: `
				<p style="font-size:0.82rem;margin-bottom:0.4rem">Paste cinematic JSON data below. This will replace the current editor state.</p>
				<textarea id="cinematic-import-json" style="width:100%;height:250px;font-family:monospace;font-size:0.8rem" placeholder='{"version":2,"trigger":"canvasReady",...}'></textarea>
			`,
    buttons: {
      import: {
        label: "Import",
        icon: '<i class="fas fa-file-import"></i>',
        callback: /* @__PURE__ */ l((t) => {
          var r, a, o, s;
          const i = t.find("#cinematic-import-json").val();
          try {
            const c = JSON.parse(i);
            if (typeof c != "object" || c === null || Array.isArray(c))
              throw new Error("Expected a JSON object");
            if (c.timeline !== void 0 && !Array.isArray(c.timeline))
              throw new Error("'timeline' must be an array");
            w(this, $, oe).call(this, () => new _n(c)), (a = (r = ui.notifications) == null ? void 0 : r.info) == null || a.call(r, "Cinematic JSON imported.");
          } catch (c) {
            (s = (o = ui.notifications) == null ? void 0 : o.error) == null || s.call(o, `Import failed: ${c.message}`);
          }
        }, "callback")
      },
      cancel: { label: "Cancel" }
    },
    default: "import"
  }).render(!0);
}, "#onImportJSON"), Ko = /* @__PURE__ */ l(async function(t) {
  const i = t === "setup" ? f(this, ee).setup : f(this, ee).landing, r = JSON.stringify(i ?? {}, null, 2);
  new Dialog({
    title: `Edit ${t.charAt(0).toUpperCase() + t.slice(1)}`,
    content: `
				<p style="font-size:0.82rem;margin-bottom:0.4rem">JSON map of target selector → property overrides:</p>
				<textarea id="cinematic-json-edit" style="width:100%;height:200px;font-family:monospace;font-size:0.8rem">${yt(r)}</textarea>
			`,
    buttons: {
      save: {
        label: "Apply",
        callback: /* @__PURE__ */ l((a) => {
          var s, c;
          const o = a.find("#cinematic-json-edit").val();
          try {
            const u = JSON.parse(o);
            t === "setup" ? w(this, $, oe).call(this, (d) => d.setSetup(u)) : w(this, $, oe).call(this, (d) => d.setLanding(u));
          } catch (u) {
            (c = (s = ui.notifications) == null ? void 0 : s.error) == null || c.call(s, `Invalid JSON: ${u.message}`);
          }
        }, "callback")
      },
      cancel: { label: "Cancel" }
    },
    default: "save"
  }).render(!0);
}, "#onEditJSON"), Yo = /* @__PURE__ */ l(async function(t) {
  if (f(this, P) == null) return;
  const i = f(this, ee).timeline[f(this, P)];
  if (!i || i.delay != null) return;
  const r = i[t] ?? {}, a = JSON.stringify(r, null, 2);
  new Dialog({
    title: `Edit Step ${t.charAt(0).toUpperCase() + t.slice(1)}`,
    content: `
				<p style="font-size:0.82rem;margin-bottom:0.4rem">JSON map of target selector → property overrides:</p>
				<textarea id="cinematic-json-edit" style="width:100%;height:200px;font-family:monospace;font-size:0.8rem">${yt(a)}</textarea>
			`,
    buttons: {
      save: {
        label: "Apply",
        callback: /* @__PURE__ */ l((o) => {
          var c, u;
          const s = o.find("#cinematic-json-edit").val();
          try {
            const d = JSON.parse(s);
            w(this, $, oe).call(this, (g) => g.updateEntry(f(this, P), { [t]: d }));
          } catch (d) {
            (u = (c = ui.notifications) == null ? void 0 : c.error) == null || u.call(c, `Invalid JSON: ${d.message}`);
          }
        }, "callback")
      },
      cancel: { label: "Cancel" }
    },
    default: "save"
  }).render(!0);
}, "#onEditStepState"), eu = /* @__PURE__ */ l(async function() {
  if (f(this, P) == null) return;
  const t = f(this, ee).timeline[f(this, P)];
  if (!(t != null && t.parallel)) return;
  const i = JSON.stringify(t.parallel.branches ?? [], null, 2);
  new Dialog({
    title: "Edit Parallel Branches",
    content: `
				<p style="font-size:0.82rem;margin-bottom:0.4rem">JSON array of branch timelines:</p>
				<textarea id="cinematic-json-edit" style="width:100%;height:250px;font-family:monospace;font-size:0.8rem">${yt(i)}</textarea>
			`,
    buttons: {
      save: {
        label: "Apply",
        callback: /* @__PURE__ */ l((r) => {
          var o, s;
          const a = r.find("#cinematic-json-edit").val();
          try {
            const c = JSON.parse(a);
            if (!Array.isArray(c)) throw new Error("Expected an array of branches");
            w(this, $, oe).call(this, (u) => u.updateEntry(f(this, P), {
              parallel: { ...t.parallel, branches: c }
            }));
          } catch (c) {
            (s = (o = ui.notifications) == null ? void 0 : o.error) == null || s.call(o, `Invalid JSON: ${c.message}`);
          }
        }, "callback")
      },
      cancel: { label: "Cancel" }
    },
    default: "save"
  }).render(!0);
}, "#onEditParallelJSON"), // ── Helpers ────────────────────────────────────────────────────────────
fr = /* @__PURE__ */ l(function(t) {
  var i;
  return (i = t.tweens) != null && i.length ? Math.max(500, ...t.tweens.map((r) => r.duration ?? 0)) : 500;
}, "#maxTweenDuration"), tu = /* @__PURE__ */ l(function() {
  return f(this, ee).timeline.reduce((t, i) => i.delay != null ? t + i.delay : i.await != null || i.emit != null || i.parallel != null ? t + 500 : t + w(this, $, fr).call(this, i), 0);
}, "#computeTotalDuration"), nu = /* @__PURE__ */ l(function(t) {
  let i = 0;
  for (let r = 0; r <= t; r++) {
    const a = f(this, ee).timeline[r];
    a && a.delay == null && a.await == null && a.emit == null && a.parallel == null && i++;
  }
  return i;
}, "#stepNumber"), iu = /* @__PURE__ */ l(function() {
  const t = /* @__PURE__ */ new Set(), i = f(this, ee).data;
  if (i.setup) for (const r of Object.keys(i.setup)) t.add(r);
  if (i.landing) for (const r of Object.keys(i.landing)) t.add(r);
  for (const r of i.timeline ?? []) {
    if (r.tweens)
      for (const a of r.tweens)
        a.target && t.add(a.target);
    if (r.before) for (const a of Object.keys(r.before)) t.add(a);
    if (r.after) for (const a of Object.keys(r.after)) t.add(a);
  }
  return t.size;
}, "#countUniqueTargets"), ru = /* @__PURE__ */ l(function(t) {
  var u, d, g;
  const i = f(this, ee).timeline[t];
  if (!i) return null;
  if (i.delay != null)
    return { type: "delay", isDelay: !0, delay: i.delay };
  if (i.await != null) {
    const m = ((u = i.await) == null ? void 0 : u.event) ?? "click";
    return {
      type: "await",
      isAwait: !0,
      event: m,
      signal: ((d = i.await) == null ? void 0 : d.signal) ?? "",
      eventIsClick: m === "click",
      eventIsKeypress: m === "keypress",
      eventIsSignal: m === "signal"
    };
  }
  if (i.emit != null)
    return { type: "emit", isEmit: !0, signal: i.emit };
  if (i.parallel != null) {
    const m = i.parallel, b = m.join ?? "all", h = m.overflow ?? "detach", y = (m.branches ?? []).map((T, E) => ({
      branchIndex: E,
      label: `Branch ${E + 1}`,
      entries: (T ?? []).map((C, A) => {
        var U, Q;
        const k = C.delay != null, F = C.await != null, D = C.emit != null, H = !k && !F && !D;
        let te, ne;
        return k ? (te = `${C.delay}ms`, ne = "delay") : F ? (te = "Await", ne = ((U = C.await) == null ? void 0 : U.event) ?? "click") : D ? (te = "Emit", ne = C.emit || "(unnamed)") : (te = "Step", ne = `${((Q = C.tweens) == null ? void 0 : Q.length) ?? 0} tweens`), { branchEntryIndex: A, isDelay: k, isAwait: F, isEmit: D, isStep: H, label: te, sub: ne };
      })
    }));
    return {
      type: "parallel",
      isParallel: !0,
      branchCount: ((g = m.branches) == null ? void 0 : g.length) ?? 0,
      join: b,
      overflow: h,
      joinIsAll: b === "all",
      joinIsAny: b === "any",
      overflowIsDetach: h === "detach",
      overflowIsCancel: h === "cancel",
      branches: y,
      branchesJSON: JSON.stringify(m.branches ?? [], null, 2)
    };
  }
  const r = yg(), a = (i.tweens ?? []).map((m, b) => ({
    tweenIndex: b,
    type: m.type ?? "tile-prop",
    target: m.target ?? "",
    attribute: m.attribute ?? "",
    value: m.value ?? "",
    duration: m.duration ?? 0,
    easing: m.easing ?? "",
    detach: m.detach ?? !1,
    typeOptions: im.map((h) => ({
      ...h,
      selected: h.value === (m.type ?? "tile-prop")
    })),
    targetOptions: f(this, zn).map((h) => ({
      ...h,
      selected: h.selector === (m.target ?? "")
    })),
    easingOptions: [
      { value: "", label: "(default)", selected: !m.easing },
      ...r.map((h) => ({
        value: h,
        label: h,
        selected: m.easing === h
      }))
    ]
  })), o = w(this, $, fr).call(this, i), s = Object.keys(i.before ?? {}), c = Object.keys(i.after ?? {});
  return {
    type: "step",
    isDelay: !1,
    stepNumber: w(this, $, nu).call(this, t),
    maxDuration: o,
    tweens: a,
    targets: f(this, zn),
    beforeSummary: s.length ? `${s.length} target${s.length !== 1 ? "s" : ""}` : "(none)",
    afterSummary: c.length ? `${c.length} target${c.length !== 1 ? "s" : ""}` : "(none)"
  };
}, "#buildDetail"), l(tt, "CinematicEditorApplication"), Re(tt, "APP_ID", `${v}-cinematic-editor`), Re(tt, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  ct(tt, tt, "DEFAULT_OPTIONS"),
  {
    id: tt.APP_ID,
    classes: Array.from(
      /* @__PURE__ */ new Set([...((ll = ct(tt, tt, "DEFAULT_OPTIONS")) == null ? void 0 : ll.classes) ?? [], "eidolon-cinematic-editor-window", "themed"])
    ),
    tag: "section",
    window: {
      title: "Cinematic Editor",
      icon: "fa-solid fa-film",
      resizable: !0
    },
    position: {
      width: 700,
      height: "auto"
    }
  },
  { inplace: !1 }
)), Re(tt, "PARTS", {
  content: {
    template: `modules/${v}/templates/cinematic-editor.html`
  }
});
let Uo = tt;
const am = "cinematic", il = 2;
let he = null, sn = null, ln = null, ri = 0;
function hs(e) {
  return `cinematic-progress-${e}`;
}
l(hs, "progressFlagKey");
let gr = 0;
function om(e, n) {
  gr++, !(gr < 3) && (gr = 0, game.user.setFlag(v, hs(e), {
    step: n,
    timestamp: Date.now()
  }).catch(() => {
  }));
}
l(om, "saveProgress");
function mr(e) {
  gr = 0, game.user.unsetFlag(v, hs(e)).catch(() => {
  });
}
l(mr, "clearProgress");
function au(e, n = 3e5) {
  const t = game.user.getFlag(v, hs(e));
  return !t || typeof t.step != "number" || typeof t.timestamp != "number" || Date.now() - t.timestamp > n ? null : t;
}
l(au, "getSavedProgress");
function sm(e, n) {
  var t;
  return e == null ? null : typeof e != "object" || Array.isArray(e) ? (console.warn(`[${v}] Cinematic: invalid flag data on scene ${n} (expected object, got ${Array.isArray(e) ? "array" : typeof e}). Ignoring.`), null) : e.version !== void 0 && typeof e.version != "number" ? (console.warn(`[${v}] Cinematic: invalid 'version' on scene ${n} (expected number). Ignoring.`), null) : e.trigger !== void 0 && typeof e.trigger != "string" ? (console.warn(`[${v}] Cinematic: invalid 'trigger' on scene ${n} (expected string). Ignoring.`), null) : e.tracking !== void 0 && typeof e.tracking != "boolean" ? (console.warn(`[${v}] Cinematic: invalid 'tracking' on scene ${n} (expected boolean). Ignoring.`), null) : e.synchronized !== void 0 && typeof e.synchronized != "boolean" ? (console.warn(`[${v}] Cinematic: invalid 'synchronized' on scene ${n} (expected boolean). Ignoring.`), null) : e.setup !== void 0 && (typeof e.setup != "object" || e.setup === null || Array.isArray(e.setup)) ? (console.warn(`[${v}] Cinematic: invalid 'setup' on scene ${n} (expected object). Ignoring.`), null) : e.landing !== void 0 && (typeof e.landing != "object" || e.landing === null || Array.isArray(e.landing)) ? (console.warn(`[${v}] Cinematic: invalid 'landing' on scene ${n} (expected object). Ignoring.`), null) : e.timeline !== void 0 && !Array.isArray(e.timeline) ? (console.warn(`[${v}] Cinematic: invalid 'timeline' on scene ${n} (expected array). Ignoring.`), null) : ((t = e.timeline) != null && t.length && (e.timeline = e.timeline.filter((i, r) => !i || typeof i != "object" || Array.isArray(i) ? (console.warn(`[${v}] Cinematic: timeline[${r}] on scene ${n} is not a valid object, removing.`), !1) : i.delay != null && typeof i.delay != "number" ? (console.warn(`[${v}] Cinematic: timeline[${r}].delay on scene ${n} is not a number, removing entry.`), !1) : i.await != null && (typeof i.await != "object" || i.await === null) ? (console.warn(`[${v}] Cinematic: timeline[${r}].await on scene ${n} is not an object, removing entry.`), !1) : i.emit != null && typeof i.emit != "string" ? (console.warn(`[${v}] Cinematic: timeline[${r}].emit on scene ${n} is not a string, removing entry.`), !1) : i.parallel != null && (!i.parallel.branches || !Array.isArray(i.parallel.branches)) ? (console.warn(`[${v}] Cinematic: timeline[${r}].parallel.branches on scene ${n} is not an array, removing entry.`), !1) : i.tweens != null && !Array.isArray(i.tweens) ? (console.warn(`[${v}] Cinematic: timeline[${r}].tweens on scene ${n} is not an array, removing entry.`), !1) : !0)), e);
}
l(sm, "validateCinematicData");
function hi(e) {
  const n = e ? game.scenes.get(e) : canvas.scene, t = (n == null ? void 0 : n.getFlag(v, am)) ?? null;
  return sm(t, (n == null ? void 0 : n.id) ?? e ?? "unknown");
}
l(hi, "getCinematicData");
function ps(e) {
  return `cinematic-seen-${e}`;
}
l(ps, "seenFlagKey");
function lm(e) {
  return !!game.user.getFlag(v, ps(e));
}
l(lm, "hasSeenCinematic");
function cm() {
  return game.ready ? Promise.resolve() : new Promise((e) => Hooks.once("ready", e));
}
l(cm, "waitForReady");
async function um(e = 1e4) {
  var t, i;
  const n = (i = (t = game.modules.get(v)) == null ? void 0 : t.api) == null ? void 0 : i.tween;
  return n != null && n.Timeline ? n.Timeline : new Promise((r) => {
    const a = Date.now(), o = setTimeout(() => {
      var c, u;
      (u = (c = ui.notifications) == null ? void 0 : c.info) == null || u.call(c, `[${v}] Cinematic: waiting for tween engine...`);
    }, 2e3), s = setInterval(() => {
      var u, d, g, m;
      const c = (d = (u = game.modules.get(v)) == null ? void 0 : u.api) == null ? void 0 : d.tween;
      c != null && c.Timeline ? (clearInterval(s), clearTimeout(o), r(c.Timeline)) : Date.now() - a > e && (clearInterval(s), clearTimeout(o), console.warn(`[${v}] Cinematic: tween API not available after ${e}ms.`), (m = (g = ui.notifications) == null ? void 0 : g.warn) == null || m.call(g, `[${v}] Cinematic: tween engine unavailable — cinematic cannot play.`), r(null));
    }, 200);
  });
}
l(um, "waitForTweenAPI");
async function ou(e = 5e3) {
  var n;
  return window.Tagger ?? ((n = game.modules.get("tagger")) == null ? void 0 : n.api) ? !0 : new Promise((t) => {
    const i = Date.now(), r = setInterval(() => {
      var a;
      window.Tagger ?? ((a = game.modules.get("tagger")) == null ? void 0 : a.api) ? (clearInterval(r), t(!0)) : Date.now() - i > e && (clearInterval(r), console.warn(`[${v}] Cinematic: Tagger API not available after ${e}ms.`), t(!1));
    }, 200);
  });
}
l(ou, "waitForTagger");
async function Fr(e) {
  var g, m, b;
  const n = e ?? ((g = canvas.scene) == null ? void 0 : g.id);
  if (!n) return;
  (he == null ? void 0 : he.status) === "running" && he.cancel("replaced"), he = null;
  const t = hi(n);
  if (!t) {
    console.warn(`[${v}] Cinematic: no cinematic data on scene ${n}.`);
    return;
  }
  const i = await um();
  if (!i || ((m = canvas.scene) == null ? void 0 : m.id) !== n || (await ou(), ((b = canvas.scene) == null ? void 0 : b.id) !== n)) return;
  const { targets: r, unresolved: a } = ms(t);
  if (console.log(`[${v}] Cinematic: resolved ${r.size} targets:`, [...r.entries()].map(([h, y]) => {
    var T, E;
    return `${h} → ${((T = y == null ? void 0 : y.document) == null ? void 0 : T.uuid) ?? ((E = y == null ? void 0 : y.constructor) == null ? void 0 : E.name) ?? "?"}`;
  })), a.length && console.warn(`[${v}] Cinematic: skipping ${a.length} unresolved: ${a.join(", ")}`), r.size === 0) {
    console.warn(`[${v}] Cinematic: no targets could be resolved on scene ${n}.`);
    return;
  }
  const o = Kg(t);
  sn = Wg(o, r), ln = r;
  const s = au(n), c = s ? s.step : void 0;
  c != null && console.log(`[${v}] Cinematic: resuming from step ${c} (saved ${Date.now() - s.timestamp}ms ago)`);
  const u = em(t, r, i, {
    skipToStep: c,
    onStepComplete: /* @__PURE__ */ l((h) => om(n, h), "onStepComplete")
  });
  console.log(`[${v}] Cinematic: timeline built, JSON:`, JSON.stringify(u.toJSON())), u.onComplete(async () => {
    if (he = null, sn = null, ln = null, mr(n), t.landing)
      try {
        Ye(t.landing, r), canvas.perception.update({ refreshLighting: !0, refreshVision: !0 });
      } catch (h) {
        console.error(`[${v}] Cinematic: error applying landing state on complete for scene ${n}:`, h);
      }
    t.tracking !== !1 && await game.user.setFlag(v, ps(n), !0), console.log(`[${v}] Cinematic complete on scene ${n}.`);
  }), u.onCancel(() => {
    if (he = null, sn = null, ln = null, mr(n), console.log(`[${v}] Cinematic cancelled on scene ${n}.`), t.landing)
      try {
        Ye(t.landing, r), canvas.perception.update({ refreshLighting: !0, refreshVision: !0 });
      } catch (h) {
        console.error(`[${v}] Cinematic: error applying landing state after cancel on scene ${n}:`, h);
      }
  }), u.onError((h) => {
    if (he = null, sn = null, ln = null, mr(n), console.error(`[${v}] Cinematic error on scene ${n}:`, h), t.landing)
      try {
        Ye(t.landing, r), canvas.perception.update({ refreshLighting: !0, refreshVision: !0 });
      } catch (y) {
        console.error(`[${v}] Cinematic: error applying landing state after error on scene ${n}:`, y);
      }
  });
  const d = t.synchronized === !0 && game.user.isGM;
  he = u.run({
    broadcast: d,
    commit: d
  }), console.log(`[${v}] Cinematic: timeline started, handle status: ${he.status}`);
}
l(Fr, "playCinematic");
async function dm(e) {
  var t;
  const n = e ?? ((t = canvas.scene) == null ? void 0 : t.id);
  n && (await game.user.unsetFlag(v, ps(n)), console.log(`[${v}] Cinematic: cleared seen flag for scene ${n}.`));
}
l(dm, "resetCinematic");
function fm(e) {
  var n;
  return hi(e ?? ((n = canvas.scene) == null ? void 0 : n.id)) != null;
}
l(fm, "hasCinematic");
function gm() {
  if (!sn || !ln) {
    console.warn(`[${v}] Cinematic: no snapshot available for revert.`);
    return;
  }
  (he == null ? void 0 : he.status) === "running" && he.cancel("reverted"), he = null;
  try {
    Ye(sn, ln), canvas.perception.update({ refreshLighting: !0, refreshVision: !0 }), console.log(`[${v}] Cinematic: reverted to pre-cinematic state.`);
  } catch (e) {
    console.error(`[${v}] Cinematic: error during revert:`, e);
  }
  sn = null, ln = null;
}
l(gm, "revertCinematic");
async function mm() {
  const e = ++ri;
  if (console.log(`[${v}] Cinematic: canvasReady fired, gen=${e}, game.ready=${game.ready}`), await cm(), e !== ri) return;
  console.log(`[${v}] Cinematic: game is ready`);
  const n = canvas.scene;
  if (!n) {
    console.log(`[${v}] Cinematic: no canvas.scene, exiting`);
    return;
  }
  const t = hi(n.id);
  if (!t) {
    console.log(`[${v}] Cinematic: no cinematic flag on scene ${n.id}, exiting`);
    return;
  }
  if (console.log(`[${v}] Cinematic: found flag data on scene ${n.id}`), t.version && t.version > il) {
    console.warn(`[${v}] Cinematic: scene ${n.id} has version ${t.version}, runtime supports up to ${il}. Skipping.`);
    return;
  }
  if (t.trigger && t.trigger !== "canvasReady") {
    console.log(`[${v}] Cinematic: trigger "${t.trigger}" doesn't match, exiting`);
    return;
  }
  const i = au(n.id);
  if (e !== ri) return;
  if (i) {
    console.log(`[${v}] Cinematic: found saved progress at step ${i.step}, resuming...`);
    try {
      await Fr(n.id);
    } catch (a) {
      console.error(`[${v}] Cinematic: unhandled error during resumed playback on scene ${n.id}:`, a);
    }
    return;
  }
  const r = t.tracking !== !1 && lm(n.id);
  if (console.log(`[${v}] Cinematic: tracking=${t.tracking}, seen=${r}`), r) {
    if (mr(n.id), (he == null ? void 0 : he.status) === "running" && he.cancel("already-seen"), he = null, t.landing) {
      if (console.log(`[${v}] Cinematic: applying landing state (already seen)`), await ou(), e !== ri) return;
      try {
        const { targets: a } = ms(t);
        Ye(t.landing, a), canvas.perception.update({ refreshLighting: !0, refreshVision: !0 });
      } catch (a) {
        console.error(`[${v}] Cinematic: error applying landing state (already seen) on scene ${n.id}:`, a);
      }
    }
    return;
  }
  if (e === ri) {
    console.log(`[${v}] Cinematic: playing cinematic...`);
    try {
      await Fr(n.id);
    } catch (a) {
      console.error(`[${v}] Cinematic: unhandled error during playback on scene ${n.id}:`, a);
    }
  }
}
l(mm, "onCanvasReady");
function hm(e = 3e5) {
  var i;
  const n = (i = game.user.flags) == null ? void 0 : i[v];
  if (!n) return;
  const t = Date.now();
  for (const r of Object.keys(n)) {
    if (!r.startsWith("cinematic-progress-")) continue;
    const a = n[r];
    if (!a || typeof a.timestamp != "number") {
      game.user.unsetFlag(v, r).catch(() => {
      });
      continue;
    }
    t - a.timestamp > e && (console.log(`[${v}] Cinematic: cleaning up stale progress flag "${r}" (age: ${t - a.timestamp}ms)`), game.user.unsetFlag(v, r).catch(() => {
    }));
  }
}
l(hm, "cleanupStaleProgressFlags");
function pm() {
  Hooks.on("getSceneControlButtons", (e) => {
    if (!game.user.isGM) return;
    const n = Array.isArray(e) ? e : e instanceof Map ? Array.from(e.values()) : Object.values(e);
    if (!n.length) return;
    const t = n.find((o) => (o == null ? void 0 : o.name) === "tiles") ?? n.find((o) => (o == null ? void 0 : o.name) === "tokens" || (o == null ? void 0 : o.name) === "token") ?? n[0];
    if (!t) return;
    const i = t.tools, r = "eidolonCinematicEditor";
    if (Array.isArray(i) && i.some((o) => (o == null ? void 0 : o.name) === r) || i instanceof Map && i.has(r)) return;
    const a = {
      name: r,
      title: "Cinematic Editor",
      icon: "fa-solid fa-film",
      button: !0,
      toggle: !1,
      visible: !0,
      onClick: /* @__PURE__ */ l(() => {
        new Uo({ scene: canvas.scene }).render(!0);
      }, "onClick")
    };
    Array.isArray(i) ? i.push(a) : i instanceof Map ? i.set(r, a) : i && typeof i == "object" ? i[r] = a : t.tools = [a];
  });
}
l(pm, "registerEditorButton");
function ym() {
  Hooks.on("canvasReady", mm), pm(), Hooks.once("ready", () => {
    hm();
    const e = game.modules.get(v);
    e.api || (e.api = {}), e.api.cinematic = {
      play: Fr,
      reset: dm,
      has: fm,
      get: hi,
      revert: gm,
      trigger: /* @__PURE__ */ l(async (n, t) => {
        var a;
        const i = t ?? ((a = canvas.scene) == null ? void 0 : a.id);
        if (!i) return;
        const r = hi(i);
        r && (r.trigger && r.trigger !== n || await Fr(i));
      }, "trigger")
    }, console.log(`[${v}] Cinematic API registered.`);
  });
}
l(ym, "registerCinematicHooks");
ym();
//# sourceMappingURL=eidolon-utilities.js.map
