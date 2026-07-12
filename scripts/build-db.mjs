import initSqlJs from 'sql.js';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function main() {
  const SQL = await initSqlJs();
  const db = new SQL.Database();

  db.run('PRAGMA page_size = 1024');

  // --- Tables ---

  db.run(`
    CREATE TABLE guides (
      id INTEGER PRIMARY KEY,
      category TEXT NOT NULL,
      title TEXT NOT NULL,
      summary TEXT,
      content TEXT NOT NULL,
      sort_order INTEGER DEFAULT 0
    );
  `);

  db.run(`CREATE INDEX idx_guides_category ON guides(category);`);
  db.run(`CREATE INDEX idx_guides_title ON guides(title);`);

  // --- Seed data ---

  const insert = db.prepare(`
    INSERT INTO guides (category, title, summary, content, sort_order)
    VALUES (?, ?, ?, ?, ?)
  `);

  const guides = [
    // Classes
    {
      category: 'Classes',
      title: 'Warrior Overview',
      summary: 'The frontline melee class with high HP and defense.',
      content: `# Warrior\n\nWarriors are the masters of close-quarters combat. They wield heavy weapons and wear plate armor, making them the most durable class in Dragon Nest SEA.\n\n## Specializations\n- **Mercenary** — Level 15, focuses on area damage and crowd control\n- **Swordsman** — Level 45, balances offense and defense with sword expertise\n- **Barbarian** — Level 65+ (Mercenary branch), pure damage dealer\n- **Destroyer** — Level 65+ (Mercenary branch), tank with taunts and party shields`,
      sort_order: 1,
    },
    {
      category: 'Classes',
      title: 'Archer Overview',
      summary: 'Ranged DPS with bows and crossbows, high mobility.',
      content: `# Archer\n\nArchers are ranged damage dealers who excel at kiting and positioning. They deal consistent damage from a distance.\n\n## Specializations\n- **Acrobat** — Level 15, mobile archer with evasion skills\n- **Sharpshooter** — Level 45, precision damage with sniper-like abilities\n- **Tempest** — Level 65+ (Acrobat branch), aerial combos and speed\n- **Warden** — Level 65+ (Acrobat branch), trap master and area control\n- **Sniper** — Level 65+ (Sharpshooter), long-range burst\n- **Artillery** — Level 65+ (Sharpshooter), explosive arrow attacks`,
      sort_order: 2,
    },
    {
      category: 'Classes',
      title: 'Cleric Overview',
      summary: 'Support and healing class with holy magic.',
      content: `# Cleric\n\nClerics are the primary support class, capable of healing allies and buffing the party. They also have respectable damage potential.\n\n## Specializations\n- **Paladin** — Level 15, tank with holy protection skills\n- **Priest** — Level 45, dedicated healer and buffer\n- **Guardian** — Level 65+ (Paladin), party shielding specialist\n- **Crusader** — Level 65+ (Paladin), offensive holy knight\n- **Saint** — Level 65+ (Priest), ultimate healer with resurrection\n- **Inquisitor** — Level 65+ (Priest), hybrid healer with lightning damage`,
      sort_order: 3,
    },
    {
      category: 'Classes',
      title: 'Sorceress Overview',
      summary: 'Elemental magic user with high burst damage.',
      content: `# Sorceress\n\nSorceresses wield the power of the elements to unleash devastating magical attacks. They deal the highest burst damage but are fragile.\n\n## Specializations\n- **Elemental Lord** — Level 15, fire and ice elementalist\n- **Mystic** — Level 45, gravity and time manipulation\n- **Ice Witch** — Level 65+ (Elemental Lord), focus on ice spells\n- **Flame Witch** — Level 65+ (Elemental Lord), focus on fire spells\n- **Alchemist** — Level 65+ (Mystic), debuff and support hybrid`,
      sort_order: 4,
    },
    {
      category: 'Classes',
      title: 'Academic Overview',
      summary: 'Engineer class with summons and mechanical gadgets.',
      content: `# Academic\n\nAcademics are engineers who use mechanical gadgets, summons, and chemical weapons. A versatile class with unique playstyles.\n\n## Specializations\n- **Engineer** — Level 15, turrets and mechanical summons\n- **Alchemist** — Level 45, chemical warfare and healing\n- **Gear Master** — Level 65+ (Engineer), advanced summoner\n- **Shooting Star** — Level 65+ (Engineer), explosive ranged DPS`,
      sort_order: 5,
    },
    // Guides
    {
      category: 'Guides',
      title: 'Leveling Guide 1-95',
      summary: 'Fastest way to level your character from 1 to max level.',
      content: `# Leveling Guide 1-95\n\n## 1-24: Tutorial Quests\nFollow the main story questline in Calderock Village. This takes ~30 minutes.\n\n## 24-40: Carderock Pass\n- Main quests + side quests in Carderock and Saint's Haven\n- Run each dungeon on the highest difficulty available\n\n## 40-60: Lotus Marsh\n- Continue main quest chain\n- Recommended dungeons: Dark Lord's Refuge, Phantom Train\n\n## 60-80: Port of Saint's Haven\n- Abandoned City questline\n- Group up for Ancient Ruins runs\n\n## 80-95: Red Lotus & Beyond\n- Daily quests in Red Lotus Territory\n- Nest runs for bonus XP\n- Use XP boost scrolls from Goddess's Blessing`,
      sort_order: 1,
    },
    {
      category: 'Guides',
      title: 'Enhancement System Guide',
      summary: 'Complete guide to enhancing gear from +1 to +20.',
      content: `# Enhancement System Guide\n\nGear enhancement is the primary way to increase your combat power.\n\n## Enhancement Levels\n\n| Level | Success Rate | Material |\n|-------|-------------|----------|\n| +1 to +6 | 100% | Gold + Enhancement Stones |\n| +7 to +10 | Decreasing 90%→50% | Gold + High-grade Stones |\n| +11 to +15 | 30%→10% | Gold + Premium Stones + Jelly |\n| +16 to +20 | 5%→1% | Gold + Legendary Stones + Jelly |\n\n## Tips\n- Always use Jelly (protection item) after +10 to prevent gear destruction\n- Enhancement events (usually monthly) boost success rates by 30-50%\n- Focus on weapon first → sub-weapon → armor → accessories`,
      sort_order: 2,
    },
    {
      category: 'Guides',
      title: 'Gold Farming Methods',
      summary: 'Best ways to earn gold in Dragon Nest SEA.',
      content: `# Gold Farming Methods\n\n## Daily Sources\n1. **Nest Runs** — 100-500g per run depending on nest difficulty\n2. **Daily Quests** — ~50g from all daily quests combined\n3. **Goddess's Blessing** — Weekly reward box contains 100-300g\n\n## Weekly Sources\n1. **Nest of the Ancients** — 500-1000g (once per week per character)\n2. **PvP Season Rewards** — Up to 2000g depending on rank\n\n## Passive Income\n- **Market Trading** — Buy low during events, sell high after\n- **Crafting** — Craft enhancement stones from materials\n- **Farming Nests** — Sell unique drops on auction house`,
      sort_order: 3,
    },
    {
      category: 'Guides',
      title: 'Nest Dungeon Guide',
      summary: 'Overview of all Nest dungeons and their rewards.',
      content: `# Nest Dungeon Guide\n\nNests are endgame dungeons with higher difficulty and better rewards than regular dungeons.\n\n## Nest Tiers\n\n### Beginner (Level 24+)\n- **Lightning Nest** — Entry-level, learn boss patterns\n- **Sea Dragon Nest** — First real challenge, good gold\n\n### Intermediate (Level 60+)\n- **Apocalypse Nest** — Time attack mechanics\n- **Guardian Nest** — Protection mechanics, requires coordination\n\n### Advanced (Level 80+)\n- **Manticore Nest** — High damage output required\n- **Cerberus Nest** — Multiple boss phases\n\n### Endgame (Level 95)\n- **Nest of the Ancients** — Hardest content, best rewards\n- **Despair Nest** — Weekly challenge with leaderboards\n\n## Tips\n- Check party composition before entering\n- Bring HP/DMG potions\n- Learn boss patterns through practice mode`,
      sort_order: 4,
    },
    {
      category: 'Guides',
      title: 'Skill Build Overview',
      summary: 'Recommended skill builds for every class.',
      content: `# Skill Build Overview\n\nYour skill build determines your effectiveness in both PvE and PvP.\n\n## General Tips\n- **Max your main damage skill** — Always max the skill you use most for damage\n- **1 point in passives** — Most class passives are worth at least 1 point\n- **SP Management** — You get 1 SP per level + bonus from quests\n\n## Class-specific priorities\n- **Warrior** — Max Cleave and Stomp for PvE; Rising Set for PvP\n- **Archer** — Max Multishot and Aimed Shot for PvE\n- **Cleric** — Prioritize heals and party buffs in party play\n- **Sorceress** — Max Fireball and Ice Beam for elemental builds\n\n## Respec\n- Free respeccs are occasionally given during major patches\n- Use Reset Scroll (cash shop) for individual respecs\n- Plan your build before spending SP`,
      sort_order: 5,
    },
    {
      category: 'Guides',
      title: 'Equipment Progression Path',
      summary: 'Step-by-step gear progression from leveling to endgame.',
      content: `# Equipment Progression Path\n\n## Leveling Phase (1-60)\n- Use dungeon drops and quest rewards\n- No need to enhance until level cap\n- Focus on weapons (higher = faster leveling)\n\n## Early Endgame (60-80)\n- **Nest gear** — 3-piece set bonus from Sea Dragon/Garden\n- **+6 to +10 enhancement** — Safe range, noticeable boost\n- **Potential** — Unlock potential slots on all gear pieces\n\n## Mid Endgame (80-94)\n- **Technique gear** — Crafted from nest materials\n- **+10 to +15 enhancement** — Riskier, use jellies\n- **Costumes** — Stat bonuses from costume sets\n\n## True Endgame (95)\n- **Legend grade gear** — Best-in-slot from Nest of Ancients\n- **+15 to +20 enhancement** — Endgame goal, very expensive\n- **Dragon gems** — Socket gems for additional stats\n- **Rune system** — Advanced stat customization`,
      sort_order: 6,
    },
  ];

  for (const g of guides) {
    insert.run([g.category, g.title, g.summary, g.content, g.sort_order]);
  }
  insert.free();

  // Export and save
  const data = db.export();
  const buffer = Buffer.from(data);

  const outPath = resolve(__dirname, '..', 'public', 'dnsea-guidehub.db');
  writeFileSync(outPath, buffer);

  const sizeKb = (buffer.length / 1024).toFixed(1);
  console.log(`DB created: ${outPath} (${sizeKb} KB, ${buffer.length} bytes)`);

  db.close();
}

main().catch(err => {
  console.error('Build failed:', err);
  process.exit(1);
});
