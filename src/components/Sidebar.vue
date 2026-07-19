<script setup>
import { ref, reactive, computed } from 'vue'

const props = defineProps({
  classes: { type: Array, default: () => [] },
  activeSlug: { type: String, default: null },
})

const emit = defineEmits(['select', 'selectExternal'])

const search = ref('')

const filtered = computed(() => {
  if (!search.value) return props.classes
  const q = search.value.toLowerCase()
  return props.classes.filter(c => c.name.toLowerCase().includes(q))
})

const catOpen = reactive({ 'News': true, 'Class Introduction': true })

const categories = computed(() => [
  {
    name: 'News',
    open: catOpen['News'],
    items: [
      { id: 'notice', name: 'Notice', url: 'https://sea.dragonnest.com/news/notice' },
      { id: 'patchnotes', name: 'Patch Notes', url: 'https://patchnote.dragonnest.com/sea/' },
    ],
  },
  {
    name: 'Class Introduction',
    open: catOpen['Class Introduction'],
    items: filtered.value,
  },
])

function toggleCategory(cat) {
  catOpen[cat.name] = !catOpen[cat.name]
}
</script>

<template>
  <aside class="sidebar">
    <div class="sidebar-header">
      <span class="logo">DNSEA</span>
      <span class="subtitle">Guide Hub</span>
    </div>
    <div class="search-wrap">
      <input
        v-model="search"
        type="text"
        placeholder="Search categories..."
        class="search-input"
      />
    </div>
    <nav class="nav-list">
      <div
        v-for="cat in categories"
        :key="cat.name"
        class="category"
      >
        <div class="cat-header" @click="toggleCategory(cat)">
          <span class="cat-name">{{ cat.name }}</span>
          <span class="cat-arrow">{{ cat.open ? '▾' : '▸' }}</span>
          <span class="cat-count">{{ cat.items.length }}</span>
        </div>
        <Transition name="collapse">
          <div v-show="cat.open" class="cat-items">
          <template v-for="c in cat.items" :key="c.id">
            <button
              v-if="!c.url"
              :class="['class-item', { active: c.slug === activeSlug }]"
              @click="emit('select', c.slug)"
            >
              <span class="class-dot"></span>
              {{ c.name }}
            </button>
            <button
              v-else
              class="class-item"
              @click="emit('selectExternal', c.url)"
            >
              <span class="class-dot"></span>
              {{ c.name }}
            </button>
          </template>
          <p v-if="!cat.items.length" class="no-results">No classes match.</p>
        </div>
        </Transition>
      </div>
    </nav>
  </aside>
</template>

<style scoped>
.sidebar {
  width: 260px;
  min-width: 260px;
  background: #0f1218;
  border-right: 1px solid #1e2229;
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}
.sidebar-header {
  padding: 20px 16px 4px;
  display: flex;
  flex-direction: column;
  gap: 0;
}
.logo {
  font-size: 1.25rem;
  font-weight: 700;
  color: #e8eaf0;
  letter-spacing: 1.5px;
  text-transform: uppercase;
}
.subtitle {
  font-size: 0.75rem;
  color: #6b7280;
  letter-spacing: 2px;
  text-transform: uppercase;
}
.search-wrap {
  padding: 12px 12px 8px;
}
.search-input {
  width: 100%;
  padding: 7px 10px;
  border: 1px solid #262b33;
  border-radius: 6px;
  font-size: 0.82rem;
  background: #181c23;
  color: #c8ccd4;
  box-sizing: border-box;
  outline: none;
  transition: border-color 0.15s;
}
.search-input::placeholder {
  color: #4b5563;
}
.search-input:focus {
  border-color: #4a6fa5;
}
.nav-list {
  flex: 1;
  overflow-y: auto;
  padding: 0 8px 12px;
}
.category {
  margin-bottom: 4px;
}
.cat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 10px 6px;
  cursor: pointer;
  user-select: none;
}
.cat-arrow {
  font-size: 1rem;
  color: #4b5563;
  transition: transform .15s;
}
.cat-name {
  font-size: 0.72rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 1px;
}
.cat-count {
  font-size: 0.7rem;
  color: #4b5563;
  background: #181c23;
  border-radius: 8px;
  padding: 0 6px;
  line-height: 1.4;
}
.cat-items {
  display: flex;
  flex-direction: column;
}
.class-item {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  text-align: left;
  padding: 7px 10px;
  border: none;
  background: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.85rem;
  color: #9ca3af;
  transition: background 0.12s, color 0.12s;
  text-decoration: none;
  box-sizing: border-box;
}
.class-item:hover {
  background: #191d26;
  color: #e0e3e8;
}
.class-item.active {
  background: #1e2a44;
  color: #a8c7fa;
  font-weight: 500;
}
.class-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #3b4252;
  flex-shrink: 0;
}
.class-item.active .class-dot {
  background: #5b8dee;
}
.no-results {
  padding: 10px 10px;
  color: #4b5563;
  font-size: 0.8rem;
  text-align: center;
}

.collapse-enter-active,
.collapse-leave-active {
  transition: max-height .25s ease, opacity .2s ease;
  overflow: hidden;
}
.collapse-enter-from,
.collapse-leave-to {
  max-height: 0;
  opacity: 0;
}
.collapse-enter-to,
.collapse-leave-from {
  max-height: 800px;
  opacity: 1;
}
</style>
