// Chạy: node tests/menu.test.mjs [số-lần-chạy]
import { readFileSync } from "node:fs";
import { buildWeek, startOfWeek, addDays, GROUPS, UNDER6, rng, seedFrom, ageOf, isoWeek, weeksInMonth,
  safeLink, validDb, fmtDM, weekChain } from "../menu.js";

const db = JSON.parse(readFileSync(new URL("../foods.json", import.meta.url), "utf8"));
let failed = 0;
const check = (ok, name) => { if (!ok) { failed++; console.log("❌ " + name); } else if (!quiet) console.log("✅ " + name); };
const runs = Number(process.argv[2] || 1);
let quiet = false;
const dishes = (m, d) => m.days[d].meals.map((x) => x.dish).join("|");
const liverMeals = (m) => m.days.flatMap((d) => d.meals).filter((x) => x.dish.toLowerCase().includes("gan gà")).length;
const KEY = ["b:", "s:", "f:", "p:", "d:", "c:", "sd:"];
const dishKeys = (d) => new Set([...d.keys].filter((k) => KEY.some((p) => k.startsWith(p))));

check(validDb(db), "Dữ liệu foods.json hợp lệ");
const a = ageOf(new Date(2023, 4, 18), new Date(2026, 10, 14));
check(a.years === 3 && a.months === 5 && a.days === 27 && a.totalMonths === 41, "Tính tuổi đúng (3 tuổi 5 tháng 27 ngày)");
check(isoWeek(new Date(2026, 10, 14)).week === 46 && isoWeek(new Date(2027, 0, 1)).week === 53, "Số tuần ISO đúng");
check(weeksInMonth(2026, 11).length === 4, "Tháng 11/2026 có 4 tuần");
check(safeLink("https://www.unicef.org/x") && !safeLink("http://www.unicef.org/") && !safeLink("javascript:alert(1)")
  && !safeLink("https://www.unicef.org@evil.com/") && !safeLink("https://unicef.org.evil.com/"), "Chặn link lạ / http / javascript");

const start = startOfWeek(new Date());
for (const g of GROUPS) {
  if (g.id === UNDER6) continue;
  const base = buildWeek({ start, group: g.id, db });
  let changed = 0, othersSame = true, liverOK = liverMeals(base) <= 1;
  for (let day = 0; day < 7; day++) for (let t = 1; t <= 3; t++) {
    const dv = Array(7).fill(0); dv[day] = t;
    const m = buildWeek({ start, group: g.id, dayVariants: dv, db });
    if (dishes(m, day) !== dishes(base, day)) changed++;
    for (let o = 0; o < 7; o++) if (o !== day && dishes(m, o) !== dishes(base, o)) othersSame = false;
    if (liverMeals(m) > 1) liverOK = false;
  }
  check(changed === 21, `${g.title}: Gợi ý món khác đổi món ngày đó (${changed}/21)`);
  check(othersSame, `${g.title}: các ngày khác giữ nguyên`);
  check(liverOK, `${g.title}: gan tối đa 1 bữa/tuần`);
}
// Món rau ăn kèm không trùng loại rau đã có trong canh cùng bữa.
let sideClash = 0;
for (let w = 0; w < 52; w++) for (const gid of [4, 5]) for (const d of buildWeek({ start: addDays(start, w * 7), group: gid, db }).days)
  for (const m of d.meals) if (m.emoji === "🍚") {
    const parts = m.dish.split(" + "); if (parts.length < 4) continue;
    const soup = parts[2], side = parts[3];
    const vegs = Object.values(db.vegetables).filter((v) => side.startsWith(v.name) || side.startsWith(v.sideDish.toLocaleLowerCase("vi")));
    if (vegs.some((v) => soup.includes(v.name))) sideClash++;
  }
check(sideClash === 0, `Rau ăn kèm không lặp rau trong canh (52 tuần × 2 nhóm tuổi, lặp ${sideClash})`);
const w1 = buildWeek({ start, group: 5, variant: 0, db }), w2 = buildWeek({ start, group: 5, variant: 1, db });
check([0, 1, 2, 3, 4, 5, 6].some((d) => dishes(w1, d) !== dishes(w2, d)), "Đổi cả tuần ra thực đơn khác");

// Không trùng món ngày liền nhau: 12 tuần liên tiếp × 4 mùa, có bấm đổi món ngẫu nhiên.
const storeWeek = (s, g, dv) => weekChain({ db, groupFor: () => g, variantFor: () => 0,
  dayVariantsFor: (ws) => dv.get(+ws) || [] }).get(s);
let totalClash = 0;
for (let run = 1; run <= runs; run++) {
  const r = rng(seedFrom(run, 77));
  for (const g of GROUPS) {
    if (g.id === UNDER6) continue;
    let clashes = [], pairs = 0;
    for (let off = 0; off < 52; off += 13) {
      const first = addDays(start, off * 7), dv = new Map();
      for (let w = 0; w < 12; w++) dv.set(+addDays(first, w * 7), Array.from({ length: 7 }, () => (r.int(4) === 0 ? 1 + r.int(5) : 0)));
      const days = [];
      // Mỗi tuần lấy từ một chuỗi mới (như mở app ở tuần đó), rồi ghép lại để soát chỗ nối.
      for (let w = 0; w < 12; w++) days.push(...storeWeek(addDays(first, w * 7), g.id, dv).days);
      for (let i = 1; i < days.length; i++) {
        pairs++;
        const prev = dishKeys(days[i - 1]);
        const same = [...dishKeys(days[i])].filter((k) => prev.has(k));
        if (same.length) clashes.push(`${fmtDM(days[i].date)}: ${same.join(", ")}`);
      }
    }
    totalClash += clashes.length;
    if (runs === 1) check(!clashes.length, `${g.title}: ${pairs} cặp ngày liền nhau, trùng ${clashes.length} ${clashes.slice(0, 3).join(" | ")}`);
    else if (clashes.length) { failed++; console.log(`❌ lần ${run} ${g.title}: ${clashes.slice(0, 3).join(" | ")}`); }
  }
}
if (runs > 1) console.log(`${runs} lần chạy, tổng số chỗ trùng: ${totalClash}`);
console.log(failed ? `\n${failed} kiểm thử KHÔNG đạt.` : "\nTất cả đều đạt.");
process.exit(failed ? 1 : 0);
