// Logic thực đơn của Bé Ăn Gì (bản web). Dùng chung cho trình duyệt và kiểm thử Node.

export const GROUPS = [
  { id: 0, title: "0–5 tháng", stage: "Bú mẹ hoàn toàn", emoji: "🍼", months: 0,
    meals: "Chỉ bú mẹ theo nhu cầu, chưa cần ăn dặm, không cần uống nước", portion: "—", texture: "—",
    tips: ["WHO và UNICEF khuyến nghị bú mẹ hoàn toàn đến tròn 6 tháng.",
      "Không cần cho uống nước, nước cháo hay nước quả.",
      "Bú mẹ không được thì dùng sữa công thức theo hướng dẫn của bác sĩ."] },
  { id: 1, title: "6–8 tháng", stage: "Tập ăn dặm", emoji: "🥄", months: 6,
    meals: "2–3 bữa ăn dặm/ngày + bú mẹ theo nhu cầu",
    portion: "Bắt đầu 2–3 thìa/bữa, tăng dần tới ½ bát (bát 250 ml)",
    texture: "Bột/cháo loãng rồi đặc dần, rau thịt rây hoặc nghiền mịn",
    tips: ["Mỗi lần chỉ thêm 1 thực phẩm mới, theo dõi khoảng 3 ngày để phát hiện dị ứng.",
      "Không nêm muối, đường, nước mắm, hạt nêm. Không cho ăn mật ong trước 1 tuổi.",
      "Cháo/bột phải đủ đặc, múc lên không chảy khỏi thìa (UNICEF).",
      "Rửa tay bằng xà phòng trước khi nấu và trước mỗi lần cho bé ăn.",
      "Mỗi bữa nên có đủ: tinh bột + đạm (thịt, cá, trứng, đậu) + rau củ + 1 thìa nhỏ dầu/mỡ.",
      "Cho ăn theo tín hiệu đói/no của bé, không ép ăn."] },
  { id: 2, title: "9–11 tháng", stage: "Ăn đặc dần", emoji: "🥣", months: 9,
    meals: "3 bữa chính + 1–2 bữa phụ, vẫn bú mẹ", portion: "Khoảng ½ bát 250 ml mỗi bữa",
    texture: "Cháo đặc, thức ăn băm nhỏ, nghiền thô; tập cầm thức ăn mềm",
    tips: ["Cho bé ăn thịt, cá hoặc trứng mỗi ngày (WHO 2023).",
      "Vẫn chưa nêm muối, đường; không mật ong trước 1 tuổi.",
      "Băm thịt, cá vào cháo; không chỉ cho ăn nước thịt, nước xương (Viện Dinh dưỡng).",
      "Thêm 1 thìa nhỏ dầu ăn dặm (dầu óc chó, dầu hạt cải…) vào mỗi bữa.",
      "Tập cho bé tự cầm thức ăn mềm cắt que và tập uống bằng cốc.",
      "Gan: tối đa 1 bữa/tuần, lượng nhỏ."] },
  { id: 3, title: "12–23 tháng", stage: "Ăn cùng gia đình", emoji: "🍲", months: 12,
    meals: "3–4 bữa chính + 1–2 bữa phụ", portion: "Khoảng ¾ – 1 bát 250 ml mỗi bữa",
    texture: "Cháo đặc hoặc cơm nát, món của gia đình cắt nhỏ",
    tips: ["Có thể cho uống sữa tươi không đường; WHO không khuyến nghị sữa công thức \"tăng trưởng\" cho nhóm này.",
      "Hạn chế đồ ngọt, nước ngọt, nước ép; tránh đồ ăn vặt mặn.",
      "Cắt nhỏ nho, cà chua bi, xúc xích; không cho ăn hạt nguyên, kẹo cứng, thạch rau câu dạng cốc.",
      "Nêm thật nhạt, nhạt hơn khẩu vị người lớn.",
      "Bé chưa mọc đủ răng thì cho ăn cháo đặc, cơm nát; chưa cho ăn cơm thường.",
      "Không cho bánh kẹo, bim bim, khoai tây chiên trước bữa ăn (dễ đầy bụng, bỏ bữa)."] },
  { id: 4, title: "2–3 tuổi", stage: "Ăn cơm như người lớn", emoji: "🍚", months: 24,
    meals: "3 bữa chính + 2 bữa phụ", portion: "Khoảng 1 bát cơm/bữa, tùy sức ăn của bé",
    texture: "Cơm mềm, thức ăn cắt miếng vừa ăn",
    tips: ["Cho bé ngồi ăn cùng gia đình, tự xúc ăn.",
      "Mỗi ngày có rau và quả; khoảng 2 cốc sữa/ngày (400–500 ml).",
      "Nho, cà chua bi cắt làm 4; không cho ăn hạt nguyên, bỏng ngô, kẹo cứng.",
      "Hạn chế nước ngọt, bánh kẹo, đồ chiên rán."] },
  { id: 5, title: "3 tuổi trở lên", stage: "Ăn cơm như người lớn", emoji: "🍱", months: 36,
    meals: "3 bữa chính + 2 bữa phụ", portion: "1–1,5 bát cơm/bữa, tùy sức ăn của bé",
    texture: "Cơm thường, thức ăn cắt miếng vừa ăn",
    tips: ["Khuyến khích bé tự ăn, ăn trong khoảng 30 phút, không vừa ăn vừa xem TV/điện thoại.",
      "Đa dạng: mỗi ngày đủ tinh bột, đạm, rau, quả, sữa.",
      "Đến 4 tuổi vẫn nên cắt nhỏ nho, cà chua bi; cẩn thận hạt, kẹo cứng.",
      "Hạn chế nước ngọt, bánh kẹo, đồ chiên rán, đồ ăn nhanh."] },
];
export const UNDER6 = 0, M6 = 1, M9 = 2, M12 = 3, Y2 = 4, Y3 = 5;

export function groupForMonths(m) {
  if (m < 6) return UNDER6;
  if (m <= 8) return M6;
  if (m <= 11) return M9;
  if (m <= 23) return M12;
  if (m <= 35) return Y2;
  return Y3;
}

export const cap = (s) => s ? s[0].toLocaleUpperCase("vi") + s.slice(1) : s;

// ---------- Ngày tháng (giờ địa phương, tuần bắt đầu thứ Hai theo ISO) ----------
const DAY = 864e5;
export const dayStart = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
export const addDays = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
export const sameDay = (a, b) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
export function startOfWeek(d) {
  const s = dayStart(d);
  return addDays(s, -((s.getDay() + 6) % 7));
}
export function isoWeek(d) {
  const start = startOfWeek(d), thu = addDays(start, 3), year = thu.getFullYear();
  const w1 = startOfWeek(new Date(year, 0, 4));
  return { year, week: 1 + Math.round((start - w1) / (7 * DAY)) };
}
export const monthOfWeek = (start) => addDays(start, 3).getMonth() + 1;
export function weeksInMonth(year, month) {
  let s = startOfWeek(new Date(year, month - 1, 1));
  const out = [];
  for (let i = 0; i < 6; i++) {
    const thu = addDays(s, 3);
    if (thu.getMonth() + 1 === month && thu.getFullYear() === year) out.push(s);
    s = addDays(s, 7);
  }
  return out;
}
export const WEEKDAYS = ["Chủ nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];
const p2 = (n) => String(n).padStart(2, "0");
export const fmtDM = (d) => `${p2(d.getDate())}/${p2(d.getMonth() + 1)}`;
export const fmtDMY = (d) => `${p2(d.getDate())}/${p2(d.getMonth() + 1)}/${d.getFullYear()}`;
export const toISO = (d) => `${d.getFullYear()}-${p2(d.getMonth() + 1)}-${p2(d.getDate())}`;
export function parseISO(s) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s || "");
  if (!m) return null;
  const d = new Date(+m[1], +m[2] - 1, +m[3]);
  return d.getMonth() === +m[2] - 1 ? d : null;
}

/** Tuổi tính như lịch: năm, tháng, ngày lẻ; tổng tháng; tổng ngày. */
export function ageOf(birth, at = new Date()) {
  const from = dayStart(birth), to = dayStart(at);
  if (from > to) return { years: 0, months: 0, days: 0, totalMonths: 0, totalDays: 0 };
  let y = to.getFullYear() - from.getFullYear(), m = to.getMonth() - from.getMonth(), d = to.getDate() - from.getDate();
  if (d < 0) { m--; d += new Date(to.getFullYear(), to.getMonth(), 0).getDate(); }
  if (m < 0) { y--; m += 12; }
  return { years: y, months: m, days: d, totalMonths: y * 12 + m, totalDays: Math.round((to - from) / DAY) };
}
export function ageText(birth) {
  const a = ageOf(birth);
  if (a.totalMonths < 1) return `${a.totalDays} ngày tuổi`;
  if (a.years === 0) return `${a.months} tháng ${a.days} ngày`;
  return a.months === 0 ? `${a.years} tuổi` : `${a.years} tuổi ${a.months} tháng`;
}
export function daysToBirthday(birth, today = new Date()) {
  const t = dayStart(today);
  let next = new Date(t.getFullYear(), birth.getMonth(), birth.getDate());
  if (next < t) next = new Date(t.getFullYear() + 1, birth.getMonth(), birth.getDate());
  return Math.round((next - t) / DAY);
}

// ---------- Số ngẫu nhiên có hạt giống: cùng tuần + cùng lựa chọn luôn ra cùng thực đơn ----------
export function seedFrom(...xs) {
  let h = 2166136261 >>> 0;
  for (const x of xs) {
    h ^= (x >>> 0); h = Math.imul(h, 16777619);
    h ^= h >>> 13; h = Math.imul(h, 0x5bd1e995); h ^= h >>> 15;
  }
  return h >>> 0;
}
export function rng(seed) {
  let a = seed >>> 0;
  const next = () => {
    a = (a + 0x6D2B79F5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  return { next, int: (n) => Math.floor(next() * n), pickOne: (arr) => arr[Math.floor(next() * arr.length)] };
}

// ---------- Dữ liệu theo tháng ----------
export const vegOfMonth = (db, m) => (db.vegetablesByMonth[m - 1] || []).map((k) => db.vegetables[k]).filter(Boolean);
export const fruitOfMonth = (db, m) => (db.fruitsByMonth[m - 1] || []).map((k) => db.fruits[k]).filter(Boolean);

function weekContext(start, group, variant, db) {
  const { year, week } = isoWeek(start);
  const seed = seedFrom(year, week, group, Math.max(variant, 0), db.version);
  const months = GROUPS[group].months, month = monthOfWeek(start);
  let proteins = db.proteins.filter((p) => p.minMonths <= months);
  if (!proteins.length) proteins = db.proteins;
  let fruits = fruitOfMonth(db, month);
  if (months < 12) fruits = fruits.filter((f) => f.soft);
  if (!fruits.length) fruits = Object.values(db.fruits).filter((f) => f.soft);
  const r = rng(seed);
  const liverDay = group >= M9 ? r.int(7) : -1;
  return { start, group, db, seed, proteins, vegetables: vegOfMonth(db, month), fruits, liverDay };
}

/** Tạo thực đơn 1 ngày: tránh trùng ngày kề bên (hard), khác món đang hiện (soft), không lặp trong ngày. */
function buildDay(ctx, day, dayVariant, hard, soft, warned, withLiver) {
  const r = rng(seedFrom(ctx.seed, day + 1, Math.max(dayVariant, 0), 0x9e37));
  const { group, db } = ctx;
  const used = new Set(), shopP = new Set(), shopV = new Set(), shopF = new Set();

  const choose = (items, tiers) => {
    for (const ok of tiers) {
      const pool = items.filter(ok);
      if (pool.length) return r.pickOne(pool);
    }
    return r.pickOne(items);
  };
  const pick = (items, key) => {
    const c = choose(items, [
      (x) => !hard.has(key(x)) && !soft.has(key(x)) && !used.has(key(x)),
      (x) => !hard.has(key(x)) && !used.has(key(x)),
      (x) => !used.has(key(x)),
    ]);
    used.add(key(c));
    return c;
  };
  const nextP = () => { const p = pick(ctx.proteins, (x) => "p:" + x.key); shopP.add(`${p.emoji} ${p.name}`); return p; };
  const nextV = (role = "c") => {
    const rk = (v) => `${role}:${v.name}`, vk = (v) => "v:" + v.name;
    const tiers = [
      (x) => !hard.has(rk(x)) && !soft.has(rk(x)) && !used.has(vk(x)),
      (x) => !hard.has(rk(x)) && !used.has(vk(x)),
      (x) => !hard.has(rk(x)) && !used.has(rk(x)),
      (x) => !used.has(vk(x)),
    ];
    let v;
    if (role === "sd") {
      // Rau ăn kèm: ưu tiên rau đúng mùa; khi rau đúng mùa đã hết lựa chọn thì lấy thêm rau ngoài mùa,
      // để vừa không lặp rau trong canh cùng ngày, vừa không trùng món rau với hôm qua.
      const all = Object.values(db.vegetables);
      v = [ctx.vegetables.filter(tiers[0]), ctx.vegetables.filter(tiers[1]), all.filter(tiers[1]),
        ctx.vegetables.filter((x) => !used.has(vk(x)))].find((p) => p.length);
      v = v ? r.pickOne(v) : choose(ctx.vegetables, tiers);
    } else v = choose(ctx.vegetables, tiers);
    used.add(vk(v)); used.add(rk(v)); shopV.add(`${v.emoji} ${cap(v.name)}`);
    // Canh nấu chung nhiều rau (vd. "canh khoai tây cà rốt"): đánh dấu cả các rau đó để món rau ăn kèm không lặp lại.
    if (role === "c") for (const o of ctx.vegetables) if (v.soup.toLocaleLowerCase("vi").includes(o.name)) used.add(vk(o));
    return v;
  };
  const nextF = () => { const f = pick(ctx.fruits, (x) => "f:" + x.name); shopF.add(`${f.emoji} ${cap(f.name)}`); return f; };
  const liver = () => { used.add("p:liver"); shopP.add(`${db.liver.emoji} ${db.liver.name}`); return db.liver; };

  const allergen = (p) => {
    if (!p.allergen || group > M9 || warned.has(p.key)) return null;
    warned.add(p.key);
    return `Nếu bé chưa ăn ${p.shortName} bao giờ: cho thử ít một, theo dõi dị ứng 3 ngày.`;
  };
  const tags = (p, v) => [`${p.emoji} ${p.shortName}`, `${v.emoji} ${v.name}`];
  const liverWarn = (p) => (p.key === "liver" ? "Gan: tối đa 1 bữa/tuần." : null);

  const puree = (slot, p, v) => {
    const pName = p.key === "egg" ? "lòng đỏ trứng" : p.shortName, dish = `Bột/cháo rây ${pName} ${v.name}`;
    used.add("d:" + dish);
    return { slot, emoji: "🥣", dish, tags: tags(p, v), warning: allergen(p) };
  };
  const porridge = (slot, p, v) => {
    const dish = `Cháo ${p.shortName} ${v.name}`;
    used.add("d:" + dish);
    return { slot, emoji: "🥣", dish, tags: tags(p, v),
      detail: p.key === "liver" ? "Gan chỉ 1 bữa/tuần, lượng nhỏ." : null, warning: allergen(p) };
  };
  const rice = (slot, p, v, side) => {
    const main = p.mainDishes.length ? pick(p.mainDishes, (x) => "d:" + x) : p.shortName;
    const t = tags(p, v);
    if (side) t.push(`${side.emoji} ${side.name}`);
    if (group === M12 && r.int(3) === 0)
      return { slot, emoji: "🥣", dish: `Cháo đặc ${p.shortName} ${v.name}`, tags: t, warning: liverWarn(p) };
    const base = group === M12 ? "Cơm nát" : group === Y2 ? "Cơm mềm" : "Cơm";
    const parts = [base, main, v.soup.toLocaleLowerCase("vi")];
    if (side) parts.push(side.sideDish.toLocaleLowerCase("vi"));
    return { slot, emoji: "🍚", dish: parts.join(" + "), tags: t, warning: liverWarn(p) };
  };
  const fruitItem = (slot, f) => ({
    slot, emoji: f.emoji, dish: cap(f.name),
    detail: group === M6 ? "Nghiền mịn" : group === M9 ? "Nghiền thô hoặc cắt que mềm cho bé tự cầm" : "Cắt miếng nhỏ",
    warning: f.choking ? "Bỏ hạt, cắt nhỏ để tránh hóc." : null,
  });
  const breakfast = () => {
    const d = pick(group === M12 ? db.toddlerBreakfasts : db.kidBreakfasts, (x) => "b:" + x.name);
    return { slot: "Bữa sáng", emoji: d.emoji, dish: d.name };
  };
  const snack = (slot) => {
    const fruitLeft = ctx.fruits.some((f) => !hard.has("f:" + f.name) && !used.has("f:" + f.name));
    if (fruitLeft && r.next() < 0.5) return fruitItem(slot, nextF());
    let pool = db.snacks;
    if (group === M12) pool = pool.filter((s) => !db.toddlerSkipSnacks.includes(s.name));
    if (!pool.length) pool = [{ name: "Sữa chua", emoji: "🥛" }];
    const s = pick(pool, (x) => "s:" + x.name);
    return { slot, emoji: s.emoji, dish: s.name };
  };

  const meals = [];
  if (group === UNDER6) {
    meals.push({ slot: "Cả ngày", emoji: "🤱", dish: "Bú mẹ hoàn toàn theo nhu cầu",
      detail: "Chưa cần ăn dặm, không cần uống nước (WHO, UNICEF)." });
  } else if (group === M6) {
    meals.push(puree("Bữa sáng", nextP(), nextV("pv")));
    meals.push(puree("Bữa chiều", nextP(), nextV("pv")));
    meals.push(fruitItem("Quả", nextF()));
  } else if (group === M9) {
    meals.push(porridge("Bữa sáng", nextP(), nextV("pv")));
    meals.push(porridge("Bữa trưa", withLiver ? liver() : nextP(), nextV("pv")));
    meals.push(fruitItem("Bữa phụ", nextF()));
    meals.push(porridge("Bữa tối", nextP(), nextV("pv")));
  } else if (group === M12) {
    const p1 = withLiver ? liver() : nextP(), p2 = nextP(), c1 = nextV(), c2 = nextV();
    meals.push(breakfast(), snack("Phụ sáng"), rice("Bữa trưa", p1, c1, null), snack("Phụ chiều"), rice("Bữa tối", p2, c2, null));
  } else {
    const p1 = withLiver ? liver() : nextP(), p2 = nextP(), c1 = nextV(), c2 = nextV(), s1 = nextV("sd"), s2 = nextV("sd");
    meals.push(breakfast(), rice("Bữa trưa", p1, c1, s1), snack("Phụ chiều"), rice("Bữa tối", p2, c2, s2));
  }
  return { date: addDays(ctx.start, day), meals, keys: used, shopP, shopV, shopF };
}

/**
 * Thực đơn 1 tuần.
 * variant: số lần "Đổi cả tuần"; dayVariants: số lần "Gợi ý món khác" từng ngày (T2→CN);
 * previousDay: dấu món của Chủ nhật tuần trước để thứ Hai không trùng.
 */
export function buildWeek({ start, group, variant = 0, dayVariants = [], previousDay = new Set(), db }) {
  const ctx = weekContext(start, group, variant, db);
  const warned = new Set(), days = [];
  const liverDay = ctx.liverDay === 0 && previousDay.has("p:liver") ? 3 : ctx.liverDay;
  let prev = previousDay;
  for (let d = 0; d < 7; d++) {
    const day = buildDay(ctx, d, 0, prev, new Set(), warned, d === liverDay);
    days.push(day);
    prev = day.keys;
  }
  for (let d = 0; d < 7; d++) {
    const v = dayVariants[d] || 0;
    if (v <= 0) continue;
    const near = new Set(d > 0 ? days[d - 1].keys : previousDay);
    if (d < 6) for (const k of days[d + 1].keys) near.add(k);
    days[d] = buildDay(ctx, d, v, near, days[d].keys, warned, false); // không thêm gan: giữ tối đa 1 bữa/tuần
  }
  const union = (f) => [...new Set(days.flatMap((x) => [...x[f]]))].sort((a, b) => a.localeCompare(b, "vi"));
  return { start, group, days, shopping: { proteins: union("shopP"), vegetables: union("shopV"), fruits: union("shopF") } };
}

// ---------- Kiểm tra dữ liệu ----------
export const ALLOWED_HOSTS = new Set(["www.ncbi.nlm.nih.gov", "www.who.int", "www.unicef.org", "www.vinmec.com",
  "www.cdph.ca.gov", "viendinhduong.vn", "www.healthychildren.org", "www.cdc.gov"]);
export function safeLink(s) {
  try {
    const u = new URL(s);
    return u.protocol === "https:" && !u.username && !u.password && ALLOWED_HOSTS.has(u.hostname) ? u.href : null;
  } catch { return null; }
}
export function validDb(db) {
  return db && Number.isInteger(db.version) && Array.isArray(db.proteins) && db.proteins.length > 0
    && db.vegetablesByMonth?.length === 12 && db.fruitsByMonth?.length === 12 && db.monthNotes?.length === 12
    && db.liver && db.kidBreakfasts?.length && db.toddlerBreakfasts?.length && db.snacks?.length
    && [...Array(12).keys()].every((i) => vegOfMonth(db, i + 1).length && fruitOfMonth(db, i + 1).length);
}

/**
 * Chuỗi tuần nối liền từ một mốc cố định: tuần nào cũng lấy Chủ nhật tuần trước (đúng như đang hiển thị)
 * để thứ Hai không trùng món. Có bộ nhớ đệm; gọi reset() khi đổi món/đổi bé.
 */
export const EPOCH = new Date(2024, 0, 1); // thứ Hai
export function weekChain({ db, groupFor, variantFor, dayVariantsFor }) {
  const memo = new Map();
  const idxOf = (s) => Math.round((startOfWeek(s) - EPOCH) / (7 * DAY));
  function get(start) {
    const s = startOfWeek(start), i = idxOf(s);
    if (memo.has(i)) return memo.get(i);
    let from = i;
    while (from > 0 && !memo.has(from - 1)) from--;          // tìm tuần gần nhất đã tính
    for (let k = from; k <= i; k++) {
      const ws = addDays(EPOCH, k * 7);
      const prev = k > 0 && memo.has(k - 1) ? memo.get(k - 1).days[6].keys : new Set();
      memo.set(k, buildWeek({ start: ws, group: groupFor(ws), variant: variantFor(ws),
        dayVariants: dayVariantsFor(ws), previousDay: prev, db }));
    }
    return memo.get(i);
  }
  /** Xóa bộ nhớ đệm từ tuần chứa `from` trở đi (không truyền thì xóa hết). */
  const reset = (from) => {
    if (!from) return memo.clear();
    const i = idxOf(from);
    for (const k of [...memo.keys()]) if (k >= i) memo.delete(k);
  };
  return { get, reset };
}
