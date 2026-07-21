import { createDbWorker } from 'sql.js-httpvfs'

let worker = null

function rows(result) {
  if (!result.length) return []
  const { columns, values } = result[0]
  return values.map(row => {
    const obj = {}
    columns.forEach((col, i) => { obj[col] = row[i] })
    return obj
  })
}

export async function initDb() {
  if (worker) return worker.db

  const workerUrl = new URL('sql.js-httpvfs/dist/sqlite.worker.js', import.meta.url)
  const wasmUrl = new URL('sql.js-httpvfs/dist/sql-wasm.wasm', import.meta.url)

  worker = await createDbWorker(
    [{
      from: 'jsonconfig',
      configUrl: `${import.meta.env.BASE_URL}database/config.json`,
    }],
    workerUrl.toString(),
    wasmUrl.toString(),
  )

  return worker.db
}

export async function getClasses() {
  const db = await initDb()
  const r = await db.exec('SELECT id, name, slug, class_image AS classImage, class_logo AS classLogo FROM classes ORDER BY id')
  return rows(r)
}

export async function getClassBySlug(slug) {
  const db = await initDb()
  const r = await db.exec('SELECT id, name, slug, description, quick_profile AS quickProfile, difficulty, class_image AS classImage, class_logo AS classLogo FROM classes WHERE slug = ?', [slug])
  const list = rows(r)
  return list[0] || null
}

export async function getFirstSpecs(classId) {
  const db = await initDb()
  const r = await db.exec(
    'SELECT id, name, description, specialization_logo AS logo, specialization_type AS specType FROM first_specializations WHERE class_id = ? ORDER BY id',
    [classId]
  )
  return rows(r)
}

export async function getSecondSpecs(firstSpecId) {
  const db = await initDb()
  const r = await db.exec(
    'SELECT id, name, description, specialization_logo AS logo FROM second_specializations WHERE first_specialization_id = ? ORDER BY id',
    [firstSpecId]
  )
  return rows(r)
}

export async function getClassWithSpecs(slug) {
  const cls = await getClassBySlug(slug)
  if (!cls) return null

  const firstSpecs = await getFirstSpecs(cls.id)
  for (const fs of firstSpecs) {
    fs.secondSpecs = await getSecondSpecs(fs.id)
  }
  cls.firstSpecs = firstSpecs
  return cls
}

export async function getEquipment() {
  const db = await initDb()
  const groups = rows(await db.exec(
    'SELECT id, name, slug FROM equipment_groups ORDER BY sort_order'
  ))
  const series = rows(await db.exec(
    'SELECT id, group_id, name, slug, subtitle FROM equipment_series ORDER BY sort_order'
  ))
  const items = rows(await db.exec(
    'SELECT id, series_id, group_id, name, slug, description, item_image, how_to_obtain FROM equipment_items ORDER BY sort_order'
  ))
  return groups.map(g => ({
    ...g,
    series: series
      .filter(s => s.group_id === g.id)
      .map(s => ({
        ...s,
        items: items.filter(i => i.series_id === s.id)
      })),
    directItems: items.filter(i => i.group_id === g.id && i.series_id === null)
  }))
}

export async function getEquipmentItemBySlug(slug) {
  const db = await initDb()
  const r = await db.exec(
    'SELECT id, series_id, group_id, name, slug, description, item_image, how_to_obtain FROM equipment_items WHERE slug = ?',
    [slug]
  )
  const list = rows(r)
  return list[0] || null
}

export async function getEquipmentGroupBySlug(slug) {
  const db = await initDb()
  const grp = rows(await db.exec(
    'SELECT id, name, slug FROM equipment_groups WHERE slug = ?', [slug]
  ))
  if (!grp.length) return null
  const g = grp[0]
  const series = rows(await db.exec(
    'SELECT id, group_id, name, slug, subtitle FROM equipment_series WHERE group_id = ? ORDER BY sort_order',
    [g.id]
  ))
  const items = rows(await db.exec(
    'SELECT id, series_id, group_id, name, slug, description, item_image, how_to_obtain FROM equipment_items WHERE group_id = ? ORDER BY sort_order',
    [g.id]
  ))
  g.series = series.map(s => ({
    ...s,
    items: items.filter(i => i.series_id === s.id)
  }))
  g.directItems = items.filter(i => i.series_id === null)
  return g
}
