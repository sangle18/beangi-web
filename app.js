// Giao diện Bé Ăn Gì (bản web). Mọi chữ hiển thị đều qua textContent, không dùng innerHTML.
import * as M from "./menu.js?v=3";

const STORE_KEY = "beangi.v1";
const AVATARS = ["cartoon", "👶", "🧒", "👦", "👧", "🐣", "🐻", "🐰", "🦁"];
const SIZES = [{ id: "small", title: "Nhỏ" }, { id: "medium", title: "Vừa" }, { id: "large", title: "Lớn" }];
const MAX_NAME = 30;

// ---------- Tiện ích dựng DOM an toàn ----------
function h(tag, attrs = {}, ...kids) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (v == null || v === false) continue;
    if (k === "class") el.className = v;
    else if (k.startsWith("on")) el.addEventListener(k.slice(2), v);
    else el.setAttribute(k, v === true ? "" : v);
  }
  for (const c of kids.flat()) if (c != null && c !== false) el.append(c instanceof Node ? c : document.createTextNode(String(c)));
  return el;
}
const $ = (s) => document.querySelector(s);

// ---------- Lưu trữ trên máy (localStorage) ----------
function cleanBaby(b) {
  if (!b || typeof b !== "object") return null;
  const name = String(b.name || "").trim().slice(0, MAX_NAME);
  const birth = M.parseISO(b.birth);
  if (!name || !birth || birth > new Date()) return null;
  const mg = Number.isInteger(b.manualGroup) && b.manualGroup >= 0 && b.manualGroup <= 5 ? b.manualGroup : null;
  const avatar = AVATARS.includes(b.avatar) ? b.avatar : null;
  const id = /^[a-z0-9-]{4,40}$/i.test(b.id || "") ? b.id : newId();
  return { id, name, birth: M.toISO(birth), manualGroup: mg, avatar };
}
function cleanState(s) {
  const babies = Array.isArray(s?.babies) ? s.babies.map(cleanBaby).filter(Boolean).slice(0, 20) : [];
  const variants = {};
  if (s?.variants && typeof s.variants === "object")
    for (const [k, v] of Object.entries(s.variants))
      if (/^\d{4}-\d{1,2}(-[0-6])?$/.test(k) && Number.isInteger(v) && v > 0 && v < 1e6) variants[k] = v;
  const selectedId = babies.some((b) => b.id === s?.selectedId) ? s.selectedId : babies[0]?.id ?? null;
  const textSize = SIZES.some((x) => x.id === s?.textSize) ? s.textSize : "medium";
  return { babies, selectedId, variants, textSize };
}
function load() {
  try { return cleanState(JSON.parse(localStorage.getItem(STORE_KEY) || "{}")); } catch { return cleanState({}); }
}
function save() {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch { /* chế độ riêng tư: vẫn dùng được trong phiên */ }
}
function newId() {
  return (crypto.randomUUID?.() || Math.random().toString(36).slice(2) + Date.now().toString(36));
}

let state = load();
let db = null, chain = null;
const ui = { tab: "home", weekStart: M.startOfWeek(new Date()), year: new Date().getFullYear(), month: new Date().getMonth() + 1,
  guideGroup: null, scrollToToday: true, fadeDay: null };

const baby = () => state.babies.find((b) => b.id === state.selectedId) || state.babies[0] || null;
const birthOf = (b) => M.parseISO(b.birth);
function groupAt(b, date) {
  if (b.manualGroup != null) return b.manualGroup;
  return M.groupForMonths(M.ageOf(birthOf(b), date).totalMonths);
}
function groupForWeek(ws) {
  const b = baby();
  if (!b) return M.M12;
  if (M.sameDay(M.startOfWeek(new Date()), ws)) return groupAt(b, new Date());
  return groupAt(b, M.addDays(ws, 3));
}
const wkKey = (ws) => { const { year, week } = M.isoWeek(ws); return `${year}-${week}`; };
function makeChain() {
  chain = M.weekChain({ db, groupFor: groupForWeek,
    variantFor: (ws) => state.variants[wkKey(ws)] || 0,
    dayVariantsFor: (ws) => [0, 1, 2, 3, 4, 5, 6].map((d) => state.variants[`${wkKey(ws)}-${d}`] || 0) });
}
const menuOf = (ws) => chain.get(ws);

function reshuffleWeek(ws) {
  const k = wkKey(ws);
  for (let d = 0; d < 7; d++) delete state.variants[`${k}-${d}`];
  state.variants[k] = (state.variants[k] || 0) + 1;
  save(); chain.reset(ws); render({ keepScroll: true });
}
function reshuffleDay(date) {
  const ws = M.startOfWeek(date), d = Math.round((M.dayStart(date) - ws) / 864e5);
  const k = `${wkKey(ws)}-${d}`;
  state.variants[k] = (state.variants[k] || 0) + 1;
  save(); chain.reset(ws); ui.fadeDay = +M.dayStart(date); render({ keepScroll: true });
  navigator.vibrate?.(10);
}

// ---------- Thành phần dùng chung ----------
const SLOT_BG = (slot) => slot === "Bữa sáng" ? "bg-butter" : slot === "Bữa trưa" ? "bg-peach"
  : slot === "Bữa tối" || slot === "Bữa chiều" ? "bg-lavender" : "bg-mint";
const SLOT_ICON = (slot) => slot === "Bữa sáng" ? "🌤️" : slot === "Bữa trưa" ? "☀️" : slot === "Bữa tối" ? "🌙"
  : slot === "Bữa chiều" ? "🌇" : "🍪";
const seasonEmoji = (m) => [12, 1, 2].includes(m) ? "❄️" : [3, 4].includes(m) ? "🌸" : m >= 5 && m <= 8 ? "☀️" : "🍂";

function avatarEl(key, cls = "bubble") {
  if (key === "cartoon") return h("span", { class: cls }, h("img", { src: "icons/cartoon.png", alt: "" }));
  return h("span", { class: cls, "aria-hidden": "true" }, key);
}
const avatarKey = (b) => b.avatar || (M.ageOf(birthOf(b)).totalMonths < 12 ? "👶" : "🧒");

function mealRow(m) {
  return h("div", { class: "meal" },
    h("span", { class: `bubble ${SLOT_BG(m.slot)}`, "aria-hidden": "true" }, m.emoji),
    h("div", { class: "body" },
      h("span", { class: "slot" }, `${SLOT_ICON(m.slot)} ${m.slot}`),
      h("span", { class: "dish" }, m.dish),
      m.tags?.length ? h("div", { class: "chips" }, m.tags.map((t) => h("span", { class: "chip" }, t))) : null,
      m.detail ? h("span", { class: "muted" }, m.detail) : null,
      m.warning ? h("span", { class: "warn" }, "⚠️ " + m.warning) : null));
}
const suggestBtn = (onclick, title = "Gợi ý món khác", cls = "soft") =>
  h("button", { class: `btn ${cls}`, onclick }, "🔀 " + title);
const title = (emoji, text) => h("h2", { class: "title" }, h("span", { "aria-hidden": "true" }, emoji), text);
const info = (emoji, label, text) => h("div", { class: "info" }, h("span", { class: "bubble sm", "aria-hidden": "true" }, emoji),
  h("div", {}, h("span", { class: "muted small" }, label), h("span", {}, text)));

function groupInfo(g) {
  const G = M.GROUPS[g];
  return [info("⏰", "Số bữa", G.meals), info("🥣", "Lượng mỗi bữa", G.portion), info("🥄", "Độ thô", G.texture)];
}

// ---------- Tab Nhà mình ----------
function renderHome() {
  const b = baby();
  if (!b) {
    return [h("section", { class: "card hero welcome" },
      h("div", { class: "big", "aria-hidden": "true" }, "👨‍👩‍👧"),
      h("h2", { class: "hero-name" }, "Chào cả nhà!"),
      h("p", { class: "muted" }, "Nhập tên và ngày sinh của bé để nhận gợi ý món ăn hợp tuổi, theo từng tuần và từng mùa."),
      h("div", { class: "row", "aria-hidden": "true" }, "🥣 🍌 🐟 🥕 🥚 🍚"),
      h("button", { class: "btn primary", onclick: () => openEditor(null) }, "＋ Thêm bé"))];
  }
  const birth = birthOf(b), a = M.ageOf(birth), dtb = M.daysToBirthday(birth);
  const hero = h("section", { class: "card hero" },
    h("div", { class: "hero-top" }, avatarEl(avatarKey(b), "bubble big"),
      h("div", {}, h("p", { class: "hero-name" }, b.name), h("span", { class: "muted" }, `🎂 Sinh ngày ${M.fmtDMY(birth)}`))),
    h("div", { class: "tiles" },
      h("div", { class: "tile" }, "🗓️", h("b", {}, a.totalMonths), h("span", {}, "tháng tuổi")),
      h("div", { class: "tile" }, "🎈", h("b", {}, a.years), h("span", {}, a.years > 0 ? `tuổi ${a.months} tháng` : "tuổi")),
      h("div", { class: "tile" }, "☀️", h("b", {}, a.totalDays), h("span", {}, "ngày tuổi"))),
    h("div", { class: "row between" },
      h("span", { class: "muted" }, dtb === 0 ? `🎉 Hôm nay là sinh nhật ${b.name}!` : `🎁 Còn ${dtb} ngày nữa là sinh nhật`),
      h("button", { class: "btn white", onclick: () => openEditor(b) }, "✏️ Sửa tên, ngày sinh")));

  const switcher = h("div", { class: "switcher" },
    state.babies.map((x) => h("button", { class: "pill" + (x.id === b.id ? " on" : ""), "aria-pressed": x.id === b.id ? "true" : "false",
      onclick: () => { state.selectedId = x.id; save(); makeChain(); render(); } }, avatarEl(avatarKey(x)), x.name)),
    h("button", { class: "pill btn outline", onclick: () => openEditor(null) }, "＋ Thêm bé"));

  const ws = M.startOfWeek(new Date()), menu = menuOf(ws);
  const today = menu.days.find((d) => M.sameDay(d.date, new Date()));
  const todayCard = h("section", { class: "card" },
    h("div", { class: "row between" }, title("🍽️", `Hôm nay ${b.name} ăn gì?`), h("span", { class: "muted" }, M.WEEKDAYS[new Date().getDay()])),
    h("div", { class: ui.fadeDay === +M.dayStart(new Date()) ? "fade" : "" }, today.meals.map(mealRow)),
    today.meals.length > 1 ? h("div", { class: "row" }, suggestBtn(() => reshuffleDay(new Date()))) : null,
    h("button", { class: "btn primary block", onclick: () => go("week") }, "Xem thực đơn cả tuần →"));

  const g = groupAt(b, new Date()), G = M.GROUPS[g];
  const sel = h("select", { "aria-label": "Nhóm tuổi gợi ý món", onchange: (e) => {
    b.manualGroup = e.target.value === "auto" ? null : Number(e.target.value); save(); makeChain(); render({ keepScroll: true }); } },
    h("option", { value: "auto" }, "Tự động theo ngày sinh"),
    M.GROUPS.map((x) => h("option", { value: x.id }, `${x.emoji} ${x.title}`)));
  sel.value = b.manualGroup == null ? "auto" : String(b.manualGroup);
  const groupCard = h("section", { class: "card" },
    title(G.emoji, `Bé ${G.title}: ${G.stage.toLocaleLowerCase("vi")}`), ...groupInfo(g),
    h("label", { class: "field" }, h("span", { class: "muted" }, "Nhóm tuổi gợi ý món"), sel));
  return [hero, switcher, todayCard, groupCard];
}

// ---------- Tab Tuần ----------
function renderWeek() {
  const ws = ui.weekStart, end = M.addDays(ws, 6), g = groupForWeek(ws), G = M.GROUPS[g], b = baby();
  const { year, week } = M.isoWeek(ws), current = M.sameDay(M.startOfWeek(new Date()), ws);
  const head = h("section", { class: "card hero" },
    h("div", { class: "nav" },
      h("button", { class: "round", "aria-label": "Tuần trước", onclick: () => { ui.weekStart = M.addDays(ws, -7); render(); } }, "‹"),
      h("div", { class: "mid" }, h("b", {}, `${seasonEmoji(M.monthOfWeek(ws))} Tuần ${week}`),
        h("span", { class: "muted" }, `${M.fmtDM(ws)} – ${M.fmtDM(end)}/${year}`)),
      h("button", { class: "round", "aria-label": "Tuần sau", onclick: () => { ui.weekStart = M.addDays(ws, 7); render(); } }, "›")),
    h("div", { class: "row" },
      b ? h("span", { class: "chip" }, b.name) : null,
      h("span", { class: "chip" }, `${G.emoji} ${G.title}`), h("span", { class: "spacer" }),
      g !== M.UNDER6 ? suggestBtn(() => reshuffleWeek(ws), "Đổi cả tuần", "primary") : null),
    g !== M.UNDER6 ? h("span", { class: "muted" }, "🥄 " + G.texture + (g < M.M12 ? ". Thêm chút dầu ăn dặm, không nêm muối, đường." : ". Nêm nhạt.")) : null,
    !current ? h("button", { class: "btn white", onclick: () => { ui.weekStart = M.startOfWeek(new Date()); ui.scrollToToday = true; render(); } }, "↩︎ Về tuần này") : null);

  if (g === M.UNDER6) {
    const six = b ? new Date(birthOf(b).getFullYear(), birthOf(b).getMonth() + 6, birthOf(b).getDate()) : null;
    return [head, h("section", { class: "card" }, title("🤱", "Bé dưới 6 tháng"),
      h("p", {}, "Bú mẹ hoàn toàn đến tròn 6 tháng (WHO, UNICEF). Chưa cần ăn dặm, không cần uống nước."),
      six ? info("📅", "Bắt đầu ăn dặm từ", M.fmtDMY(six)) : null)];
  }
  const menu = menuOf(ws);
  const days = menu.days.map((d) => {
    const isToday = M.sameDay(d.date, new Date());
    return h("section", { class: "card" + (isToday ? " today" : ""), id: isToday ? "today" : null },
      h("div", { class: "row" }, h("b", {}, M.WEEKDAYS[d.date.getDay()]), h("span", { class: "muted" }, M.fmtDM(d.date)),
        h("span", { class: "spacer" }), isToday ? h("span", { class: "chip bg-peach" }, "⭐️ Hôm nay") : null),
      h("div", { class: ui.fadeDay === +d.date ? "fade" : "" }, d.meals.map(mealRow)),
      h("div", { class: "row" }, h("span", { class: "spacer" }), suggestBtn(() => reshuffleDay(d.date))));
  });
  const shop = (label, items, cls) => h("div", {}, h("span", { class: "muted small" }, label),
    h("div", { class: "chips" }, items.map((t) => h("span", { class: "chip " + cls }, t))));
  const shopping = h("section", { class: "card" }, title("🧺", "Đi chợ tuần này"),
    shop("Đạm", menu.shopping.proteins, "bg-peach"), shop("Rau củ", menu.shopping.vegetables, "bg-mint"),
    shop("Quả", menu.shopping.fruits, "bg-butter"));
  return [head, ...days, shopping];
}

// ---------- Tab Tháng ----------
function renderMonth() {
  const { year, month } = ui;
  const step = (d) => { let m = month + d, y = year; if (m < 1) { m = 12; y--; } if (m > 12) { m = 1; y++; } ui.month = m; ui.year = y; render(); };
  const months = h("div", { class: "months" }, Array.from({ length: 12 }, (_, i) => i + 1).map((m) =>
    h("button", { class: m === month ? "on" : "", "aria-pressed": m === month ? "true" : "false", "aria-label": `Tháng ${m}`,
      onclick: () => { ui.month = m; render(); } }, h("span", { "aria-hidden": "true" }, seasonEmoji(m)), `T${m}`)));
  const head = h("section", { class: "card hero" },
    h("div", { class: "nav" },
      h("button", { class: "round", "aria-label": "Tháng trước", onclick: () => step(-1) }, "‹"),
      h("div", { class: "mid" }, h("b", {}, `${seasonEmoji(month)} Tháng ${month} / ${year}`)),
      h("button", { class: "round", "aria-label": "Tháng sau", onclick: () => step(1) }, "›")), months);
  const produce = h("section", { class: "card" }, title("🧺", `Vào mùa tháng ${month}`),
    h("span", { class: "muted small" }, "Rau củ"),
    h("div", { class: "chips" }, M.vegOfMonth(db, month).map((v) => h("span", { class: "chip bg-mint" }, `${v.emoji} ${M.cap(v.name)}`))),
    h("span", { class: "muted small" }, "Quả"),
    h("div", { class: "chips" }, M.fruitOfMonth(db, month).map((f) => h("span", { class: "chip" }, `${f.emoji} ${M.cap(f.name)}`))),
    h("div", { class: "note" }, h("span", { "aria-hidden": "true" }, "💡"), h("span", {}, db.monthNotes[month - 1])));
  const weeks = M.weeksInMonth(year, month).map((ws) => {
    const g = groupForWeek(ws), current = M.sameDay(M.startOfWeek(new Date()), ws), { week } = M.isoWeek(ws);
    const lunches = g === M.UNDER6 ? ["🤱 Bú mẹ hoàn toàn"]
      : menuOf(ws).days.slice(0, 3).map((d) => d.meals.find((m) => m.slot === "Bữa trưa")).filter(Boolean).map((m) => `${m.emoji} ${m.dish}`);
    return h("button", { class: "card weeklink", onclick: () => { ui.weekStart = ws; ui.scrollToToday = current; go("week"); } },
      h("span", { class: "weeknum" + (current ? " on" : "") }, h("span", { class: "small" }, "Tuần"), h("b", {}, week)),
      h("span", { class: "body" }, h("b", {}, `${M.fmtDM(ws)} – ${M.fmtDM(M.addDays(ws, 6))}`, current ? "  · Tuần này" : ""),
        lunches.map((l) => h("span", { class: "muted small" }, l))),
      h("span", { "aria-hidden": "true" }, "›"));
  });
  return [head, produce, title("📅", "Thực đơn các tuần"), ...weeks];
}

// ---------- Tab Lưu ý ----------
function renderGuide() {
  if (ui.guideGroup == null) ui.guideGroup = baby() ? groupAt(baby(), new Date()) : M.M12;
  const g = ui.guideGroup, G = M.GROUPS[g];
  const picker = h("div", { class: "switcher" }, M.GROUPS.map((x) =>
    h("button", { class: "pill" + (x.id === g ? " on" : ""), "aria-pressed": x.id === g ? "true" : "false",
      onclick: () => { ui.guideGroup = x.id; render({ keepScroll: true }); } }, `${x.emoji} ${x.title}`)));
  const tips = h("section", { class: "card" }, title(G.emoji, `Bé ${G.title}: ${G.stage.toLocaleLowerCase("vi")}`), ...groupInfo(g),
    G.tips.map((t) => h("div", { class: "tip" }, h("span", { "aria-hidden": "true" }, "💚"), h("span", {}, t))));
  const safety = h("section", { class: "card butter" }, title("🛡️", "An toàn khi cho bé ăn"),
    [["👀", "Luôn ngồi cạnh khi bé ăn; cho bé ngồi thẳng, không vừa ăn vừa chạy chơi."],
      ["🍇", "Dễ hóc: nho, cà chua bi, nhãn, vải cần bỏ hạt, cắt nhỏ. Tránh hạt nguyên, bỏng ngô, kẹo cứng, thạch."],
      ["🍯", "Không cho bé dưới 1 tuổi ăn mật ong."],
      ["🧼", "Rửa tay bằng xà phòng trước khi nấu và trước khi cho bé ăn."],
      ["🩺", "Bé dị ứng, chậm tăng cân hay có bệnh lý: hỏi bác sĩ dinh dưỡng trước khi áp dụng."]]
      .map(([e, t]) => h("div", { class: "tip" }, h("span", { "aria-hidden": "true" }, e), h("span", {}, t))));
  const standalone = matchMedia("(display-mode: standalone)").matches || navigator.standalone;
  const install = standalone ? null : h("section", { class: "card" }, title("📲", "Đưa lên màn hình chính"),
    h("p", {}, "Trên iPhone: mở trang này bằng Safari → bấm nút Chia sẻ ⬆️ → chọn “Thêm vào MH chính”. App sẽ có icon riêng và dùng được cả khi không có mạng."));
  const data = h("section", { class: "card" }, title("💾", "Dữ liệu của bé"),
    h("p", { class: "muted" }, "Tên, ngày sinh của bé chỉ lưu trên điện thoại này, không gửi lên mạng. Xóa dữ liệu Safari sẽ mất, nên thỉnh thoảng sao lưu."),
    h("div", { class: "row" },
      h("button", { class: "btn soft", onclick: exportData }, "⬇️ Sao lưu ra file"),
      h("button", { class: "btn soft", onclick: () => $("#import").click() }, "⬆️ Khôi phục từ file"),
      h("input", { type: "file", id: "import", accept: "application/json,.json", class: "sr", onchange: importData })),
    h("span", { class: "muted small" }, `Dữ liệu món ăn phiên bản ${db.version} · cập nhật ${db.updatedAt} · ${db.proteins.length} loại đạm, ${Object.keys(db.vegetables).length} rau củ, ${Object.keys(db.fruits).length} quả`));
  const sources = h("section", { class: "card" }, title("📚", "Nguồn tham khảo"),
    db.sources.map((s) => { const href = M.safeLink(s.url); return href ? h("a", { href, target: "_blank", rel: "noopener noreferrer", class: "tip" },
      h("span", { "aria-hidden": "true" }, "🔗"), h("span", {}, s.title, h("br"), h("span", { class: "muted small" }, s.org))) : null; }),
    h("span", { class: "muted small" }, "Thực đơn là gợi ý tham khảo dựa trên các khuyến nghị trên, không thay thế tư vấn của bác sĩ."));
  return [picker, tips, safety, install, data, sources];
}

// ---------- Hộp thoại ----------
const dlg = () => $("#dlg");
function openDialog(heading, body, actions = [], { cancel = true } = {}) {
  const d = dlg();
  d.replaceChildren(h("div", { class: "dlg-head" },
    cancel ? h("button", { class: "btn white", onclick: () => d.close() }, "Hủy") : h("span", { class: "btn" }),
    h("h2", {}, heading), ...actions), h("div", { class: "dlg-body" }, body));
  d.showModal();
}
function openEditor(b) {
  const isNew = !b;
  const draft = b ? { ...b } : { id: newId(), name: "", birth: M.toISO(new Date(new Date().getFullYear() - 1, new Date().getMonth(), new Date().getDate())), manualGroup: null, avatar: "cartoon" };
  const nameIn = h("input", { type: "text", maxlength: MAX_NAME, value: draft.name, placeholder: "Ví dụ: Bin, Na, Gạo…", autocomplete: "off", "aria-label": "Tên của bé" });
  const dateIn = h("input", { type: "date", value: draft.birth, max: M.toISO(new Date()), "aria-label": "Ngày sinh" });
  const ageLine = h("span", { class: "muted" });
  const saveBtn = h("button", { class: "btn primary" }, "Lưu");
  const refresh = () => {
    const d = M.parseISO(dateIn.value), ok = nameIn.value.trim() && d && d <= new Date();
    ageLine.textContent = d ? `🎈 Bé được ${M.ageText(d)} (${M.ageOf(d).totalMonths} tháng)` : "Chọn ngày sinh";
    saveBtn.disabled = !ok;
  };
  const avatars = h("div", { class: "avatars" });
  const drawAvatars = () => avatars.replaceChildren(...AVATARS.map((a) => {
    const on = (draft.avatar ?? null) === a;
    const btn = h("button", { class: on ? "on" : "", "aria-label": a === "cartoon" ? "Hình bé hoạt hình" : `Hình ${a}`, "aria-pressed": on ? "true" : "false",
      onclick: () => { draft.avatar = a; drawAvatars(); } });
    btn.append(a === "cartoon" ? h("img", { src: "icons/cartoon.png", alt: "" }) : a);
    return btn;
  }));
  drawAvatars();
  nameIn.addEventListener("input", refresh); dateIn.addEventListener("input", refresh); refresh();
  saveBtn.addEventListener("click", () => {
    const clean = cleanBaby({ ...draft, name: nameIn.value, birth: dateIn.value });
    if (!clean) return;
    const i = state.babies.findIndex((x) => x.id === clean.id);
    if (i >= 0) state.babies[i] = clean; else state.babies.push(clean);
    state.selectedId = clean.id; save(); makeChain(); dlg().close(); render();
  });
  const del = isNew ? null : h("button", { class: "btn danger block", onclick: () => {
    if (!confirm(`Xóa ${b.name}? Không hoàn tác được.`)) return;
    state.babies = state.babies.filter((x) => x.id !== b.id);
    state.selectedId = state.babies[0]?.id ?? null; save(); makeChain(); dlg().close(); render();
  } }, "Xóa bé này");
  openDialog(isNew ? "Thêm bé" : "Sửa thông tin bé", [
    h("span", { class: "muted small" }, "Hình đại diện"), avatars,
    h("label", { class: "field" }, "Tên của bé", nameIn),
    h("label", { class: "field" }, "Ngày sinh", dateIn), ageLine,
    h("span", { class: "muted small" }, "Ngày sinh sai thì sửa ở đây; tuổi và thực đơn sẽ tự cập nhật."), del], [saveBtn]);
}
function openSettings() {
  const body = h("div", { class: "card" }, title("🔤", "Cỡ chữ"));
  const sizes = h("div", { class: "sizes" });
  const draw = () => sizes.replaceChildren(...SIZES.map((s) => h("button", { class: s.id === state.textSize ? "on" : "",
    "aria-pressed": s.id === state.textSize ? "true" : "false",
    onclick: () => { state.textSize = s.id; applySize(); save(); draw(); render({ keepScroll: true }); } },
    h("b", { class: s.id === "small" ? "small" : "" }, "Aa"), s.title)));
  draw();
  body.append(sizes, h("span", { class: "muted small" }, "Xem trước"),
    mealRow({ slot: "Bữa trưa", emoji: "🍚", dish: "Cơm nát + Cá hồi sốt cà chua + canh bí đỏ", tags: ["🍣 cá hồi", "🎃 bí đỏ"] }));
  openDialog("Cài đặt", [body, h("span", { class: "muted small" }, "Cỡ chữ áp dụng cho toàn bộ app. “Vừa” là cỡ mặc định.")],
    [h("button", { class: "btn primary", onclick: () => dlg().close() }, "Xong")], { cancel: false });
}
const applySize = () => { document.documentElement.dataset.size = state.textSize; };

// ---------- Sao lưu ----------
function exportData() {
  const blob = new Blob([JSON.stringify({ app: "be-an-gi", version: 1, ...state }, null, 1)], { type: "application/json" });
  const a = h("a", { href: URL.createObjectURL(blob), download: `be-an-gi-sao-luu-${M.toISO(new Date())}.json` });
  document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}
async function importData(e) {
  const f = e.target.files?.[0]; e.target.value = "";
  if (!f) return;
  if (f.size > 200_000) return alert("File quá lớn, không phải file sao lưu của Bé Ăn Gì.");
  try {
    const raw = JSON.parse(await f.text());
    if (raw?.app !== "be-an-gi") throw new Error();
    const next = cleanState(raw);
    if (!next.babies.length) throw new Error();
    if (!confirm(`Khôi phục ${next.babies.length} bé từ file? Dữ liệu hiện tại trên máy sẽ được thay thế.`)) return;
    state = next; applySize(); save(); makeChain(); render();
  } catch { alert("File không đúng định dạng sao lưu của Bé Ăn Gì."); }
}

// ---------- Điều hướng ----------
function go(tab) {
  ui.tab = tab;
  if (tab === "week") ui.scrollToToday = true;   // chỉ cuộn khi tuần đang xem có "hôm nay"
  render();
}
function render({ keepScroll = false } = {}) {
  const y = window.scrollY, b = baby();
  $("#title").textContent = { home: b ? `Nhà bé ${b.name}` : "Bé Ăn Gì", week: "Thực đơn tuần", month: "Theo mùa", guide: "Lưu ý cho bố mẹ" }[ui.tab];
  $("#btn-edit").hidden = !(ui.tab === "home" && b);
  document.querySelectorAll(".tabbar button").forEach((x) => {
    if (x.dataset.tab === ui.tab) x.setAttribute("aria-current", "page"); else x.removeAttribute("aria-current");
  });
  const content = !b && ui.tab !== "guide" && ui.tab !== "month" ? renderHome()
    : { home: renderHome, week: renderWeek, month: renderMonth, guide: renderGuide }[ui.tab]();
  $("#main").replaceChildren(...content.filter(Boolean));
  ui.fadeDay = null;
  document.querySelector(".months .on")?.scrollIntoView({ inline: "center", block: "nearest" });
  if (keepScroll) window.scrollTo(0, y);
  else if (ui.tab === "week" && ui.scrollToToday && document.getElementById("today")) {
    document.getElementById("today").scrollIntoView({ block: "start" }); window.scrollBy(0, -70);
  } else window.scrollTo(0, 0);
  ui.scrollToToday = false;
}

async function start() {
  applySize();
  document.querySelectorAll(".tabbar button").forEach((b) => b.addEventListener("click", () => go(b.dataset.tab)));
  $("#btn-settings").addEventListener("click", openSettings);
  $("#btn-edit").addEventListener("click", () => baby() && openEditor(baby()));
  try {
    const res = await fetch("foods.json", { cache: "no-cache" });
    const data = await res.json();
    if (!M.validDb(data)) throw new Error("bad db");
    db = data;
  } catch {
    $("#main").replaceChildren(h("p", { class: "loading" }, "Không tải được dữ liệu món ăn. Kiểm tra mạng rồi mở lại."));
    return;
  }
  makeChain(); render();
  navigator.storage?.persist?.().catch(() => {});
  if ("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").catch(() => {});
  // Qua nửa đêm thì vẽ lại cho đúng "hôm nay".
  let day = M.toISO(new Date());
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible" && M.toISO(new Date()) !== day) { day = M.toISO(new Date()); makeChain(); render(); }
  });
}
start();
