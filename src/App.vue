<script setup>
import { ref, onMounted, computed } from 'vue'
import { getDb } from './db.js'

const guides = ref([])
const selectedGuide = ref(null)
const searchQuery = ref('')
const loading = ref(true)
const error = ref(null)

const filteredGuides = computed(() => {
  if (!searchQuery.value.trim()) return guides.value
  const q = searchQuery.value.toLowerCase()
  return guides.value.filter(
    g => g.title.toLowerCase().includes(q) || g.summary.toLowerCase().includes(q)
  )
})

const groupedGuides = computed(() => {
  const groups = {}
  for (const g of filteredGuides.value) {
    if (!groups[g.category]) groups[g.category] = []
    groups[g.category].push(g)
  }
  return groups
})

onMounted(async () => {
  try {
    const { db } = await getDb()
    const rows = await db.query(
      'SELECT id, category, title, summary, content FROM guides ORDER BY category, sort_order'
    )
    guides.value = rows
    if (rows.length > 0) {
      selectedGuide.value = rows[0]
    }
  } catch (err) {
    console.error('DB error:', err)
    error.value = 'Failed to load guides. Check console for details.'
  } finally {
    loading.value = false
  }
})

function selectGuide(guide) {
  selectedGuide.value = guide
}

function renderMarkdown(text) {
  return text
    .split('\n')
    .map(line => {
      if (line.startsWith('## ')) return `<h2>${line.slice(3)}</h2>`
      if (line.startsWith('# ')) return `<h1>${line.slice(2)}</h1>`
      if (line.startsWith('| ')) {
        if (line.includes('---')) return ''
        const cells = line.split('|').filter(Boolean).map(c => c.trim())
        const isHeader = line.includes('---')
        const tag = isHeader ? 'th' : 'td'
        if (!line.includes('---') && !line.startsWith('|-')) {
          return `<tr>${cells.map(c => `<${tag}>${c}</${tag}>`).join('')}</tr>`
        }
        return ''
      }
      if (line.startsWith('- **')) {
        return `<li>${line.slice(2)}</li>`
      }
      if (line.match(/^\d+\./)) {
        return `<li>${line.replace(/^\d+\.\s*/, '')}</li>`
      }
      if (line.trim() === '') return '<br/>'
      return `<p>${line}</p>`
    })
    .join('\n')
}
</script>

<template>
  <div class="app-layout">
    <!-- Sidebar -->
    <aside class="sidebar">
      <div class="sidebar-header">
        <h2>DN SEA Guide</h2>
      </div>

      <div class="search-box">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search guides..."
          class="search-input"
        />
      </div>

      <nav class="guide-list">
        <div v-if="loading" class="status-msg">Loading guides...</div>
        <div v-else-if="error" class="status-msg error">{{ error }}</div>
        <template v-else>
          <div
            v-for="(items, category) in groupedGuides"
            :key="category"
            class="category-group"
          >
            <h3 class="category-title">{{ category }}</h3>
            <ul>
              <li
                v-for="guide in items"
                :key="guide.id"
                :class="{ active: selectedGuide?.id === guide.id }"
                @click="selectGuide(guide)"
              >
                {{ guide.title }}
              </li>
            </ul>
          </div>
        </template>
      </nav>
    </aside>

    <!-- Main content -->
    <main class="content">
      <div v-if="loading" class="status-msg">Loading...</div>
      <div v-else-if="error" class="status-msg error">{{ error }}</div>
      <article v-else-if="selectedGuide" class="guide-content">
        <h1>{{ selectedGuide.title }}</h1>
        <p class="summary">{{ selectedGuide.summary }}</p>
        <div
          class="markdown"
          v-html="renderMarkdown(selectedGuide.content)"
        ></div>
      </article>
      <div v-else class="status-msg">Select a guide from the sidebar.</div>
    </main>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body, #app {
  height: 100%;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: #0f1218;
  color: #e0e0e0;
}

.app-layout {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

/* ── Sidebar ── */
.sidebar {
  width: 280px;
  min-width: 280px;
  background: #161a22;
  border-right: 1px solid #2a2f3a;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.sidebar-header {
  padding: 20px 16px 12px;
  border-bottom: 1px solid #2a2f3a;
}

.sidebar-header h2 {
  font-size: 18px;
  font-weight: 700;
  color: #f0c040;
  letter-spacing: 0.5px;
}

.search-box {
  padding: 12px 16px;
  border-bottom: 1px solid #2a2f3a;
}

.search-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #2a2f3a;
  border-radius: 6px;
  background: #0f1218;
  color: #e0e0e0;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
}

.search-input:focus {
  border-color: #f0c040;
}

.search-input::placeholder {
  color: #6b7280;
}

.guide-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px 0;
}

.guide-list::-webkit-scrollbar {
  width: 6px;
}

.guide-list::-webkit-scrollbar-track {
  background: transparent;
}

.guide-list::-webkit-scrollbar-thumb {
  background: #2a2f3a;
  border-radius: 3px;
}

.category-group {
  margin-bottom: 4px;
}

.category-title {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #6b7280;
  padding: 8px 16px 4px;
}

.guide-list ul {
  list-style: none;
}

.guide-list li {
  padding: 8px 16px 8px 20px;
  font-size: 14px;
  cursor: pointer;
  color: #b0b8c8;
  border-left: 3px solid transparent;
  transition: all 0.15s;
}

.guide-list li:hover {
  background: #1e2330;
  color: #e0e0e0;
}

.guide-list li.active {
  background: #1e2330;
  color: #f0c040;
  border-left-color: #f0c040;
  font-weight: 600;
}

/* ── Content ── */
.content {
  flex: 1;
  overflow-y: auto;
  padding: 32px 48px;
}

.content::-webkit-scrollbar {
  width: 8px;
}

.content::-webkit-scrollbar-track {
  background: transparent;
}

.content::-webkit-scrollbar-thumb {
  background: #2a2f3a;
  border-radius: 4px;
}

.status-msg {
  padding: 40px;
  text-align: center;
  color: #6b7280;
  font-size: 16px;
}

.status-msg.error {
  color: #ef4444;
}

.guide-content h1 {
  font-size: 28px;
  font-weight: 700;
  color: #f0c040;
  margin-bottom: 8px;
}

.guide-content .summary {
  font-size: 16px;
  color: #9ca3af;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #2a2f3a;
}

.guide-content h2 {
  font-size: 20px;
  font-weight: 600;
  color: #e0e0e0;
  margin: 24px 0 12px;
}

.guide-content p {
  font-size: 15px;
  line-height: 1.7;
  color: #c0c8d8;
  margin-bottom: 12px;
}

.guide-content li {
  font-size: 15px;
  line-height: 1.7;
  color: #c0c8d8;
  margin-left: 20px;
  margin-bottom: 4px;
}

.guide-content table {
  width: 100%;
  border-collapse: collapse;
  margin: 16px 0;
  font-size: 14px;
}

.guide-content th {
  background: #1e2330;
  color: #f0c040;
  font-weight: 600;
  text-align: left;
  padding: 8px 12px;
  border: 1px solid #2a2f3a;
}

.guide-content td {
  padding: 8px 12px;
  border: 1px solid #2a2f3a;
  color: #b0b8c8;
}
</style>
