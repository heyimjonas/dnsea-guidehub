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
