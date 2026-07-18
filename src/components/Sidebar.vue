<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  classes: { type: Array, default: () => [] },
  activeSlug: { type: String, default: null },
})

const emit = defineEmits(['select'])

const search = ref('')

const filtered = computed(() => {
  if (!search.value) return props.classes
  const q = search.value.toLowerCase()
  return props.classes.filter(c => c.name.toLowerCase().includes(q))
})
</script>

<template>
  <aside class="sidebar">
    <div class="sidebar-header">
      <h2>Classes</h2>
    </div>
    <div class="search-wrap">
      <input
        v-model="search"
        type="text"
        placeholder="Search classes..."
        class="search-input"
      />
    </div>
    <nav class="class-list">
      <button
        v-for="c in filtered"
        :key="c.id"
        :class="['class-item', { active: c.slug === activeSlug }]"
        @click="emit('select', c.slug)"
      >
        {{ c.name }}
      </button>
      <p v-if="!filtered.length" class="no-results">No classes match.</p>
    </nav>
  </aside>
</template>

<style scoped>
.sidebar {
  width: 260px;
  min-width: 260px;
  background: #f5f5f5;
  border-right: 1px solid #ddd;
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}
.sidebar-header {
  padding: 16px 16px 8px;
}
.sidebar-header h2 {
  margin: 0;
  font-size: 1.1rem;
  color: #333;
}
.search-wrap {
  padding: 0 16px 12px;
}
.search-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 0.9rem;
  box-sizing: border-box;
  outline: none;
}
.search-input:focus {
  border-color: #4a90d9;
}
.class-list {
  flex: 1;
  overflow-y: auto;
  padding: 0 8px 16px;
}
.class-item {
  display: block;
  width: 100%;
  text-align: left;
  padding: 10px 12px;
  border: none;
  background: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.95rem;
  color: #444;
  transition: background 0.15s;
}
.class-item:hover {
  background: #e0e0e0;
}
.class-item.active {
  background: #4a90d9;
  color: #fff;
  font-weight: 600;
}
.no-results {
  padding: 12px;
  color: #999;
  font-size: 0.85rem;
  text-align: center;
}
</style>
