<script setup>
import { ref, computed } from 'vue'
import EquipmentDetail from './EquipmentDetail.vue'

const props = defineProps({
  group: { type: Object, required: true },
})

const emit = defineEmits(['back'])

const activeSeries = ref(null)
const activeItem = ref(null)

const selectedItems = computed(() => {
  if (activeItem.value) return null
  if (!activeSeries.value) return []
  return activeSeries.value.items
})

const directItems = computed(() => props.group.directItems || [])

function selectSeries(series) {
  activeSeries.value = series
  activeItem.value = null
}

function selectItem(item) {
  activeItem.value = item
}

function goBack() {
  activeItem.value = null
}
</script>

<template>
  <div class="group-view">
    <!-- header -->
    <div class="group-header">
      <h1 class="group-title">{{ group.name }}</h1>
    </div>

    <div class="group-body">
      <!-- left: series list -->
      <div class="group-nav">
        <div
          v-for="s in group.series"
          :key="s.id"
          :class="['nav-item', { active: activeSeries?.id === s.id }]"
          @click="selectSeries(s)"
        >
          <span class="nav-dot"></span>
          {{ s.name }}
        </div>
        <div
          v-for="item in directItems"
          :key="'d-' + item.id"
          :class="['nav-item', { active: activeItem?.id === item.id }]"
          @click="selectItem(item)"
        >
          <span class="nav-dot"></span>
          {{ item.name }}
        </div>
        <p v-if="!group.series.length && !directItems.length" class="nav-empty">
          No items.
        </p>
      </div>

      <!-- right: content -->
      <div class="group-content">
        <div v-if="activeItem" class="item-detail-wrap">
          <button class="back-btn" @click="goBack">← Back</button>
          <EquipmentDetail :item="activeItem" />
        </div>
        <div v-else-if="selectedItems" class="item-grid">
          <div
            v-for="item in selectedItems"
            :key="item.id"
            class="item-card"
            @click="selectItem(item)"
          >
            <img
              v-if="item.item_image"
              :src="item.item_image"
              :alt="item.name"
              class="card-img"
            />
            <div class="card-body">
              <h3 class="card-title">{{ item.name }}</h3>
              <p v-if="item.description" class="card-desc">{{ item.description }}</p>
            </div>
          </div>
        </div>
        <div v-else class="select-prompt">
          <p>Select a series from the left.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.group-view {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  background: url('https://i.ibb.co/JFjTnXNP/bg4-01.jpg') center / cover no-repeat;
  position: relative;
}
.group-view::before {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(15, 18, 24, 0.82);
  pointer-events: none;
}
.group-header {
  position: relative;
  z-index: 1;
  padding: 24px 32px 16px;
  border-bottom: 1px solid #1e2229;
}
.group-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #e8eaf0;
  margin: 0;
}
.group-body {
  flex: 1;
  display: flex;
  overflow: hidden;
  position: relative;
  z-index: 1;
}
.group-nav {
  width: 220px;
  min-width: 220px;
  padding: 12px 8px;
  overflow-y: auto;
  border-right: 1px solid #1e2229;
}
.nav-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.85rem;
  color: #9ca3af;
  transition: background 0.12s, color 0.12s;
}
.nav-item:hover {
  background: #191d26;
  color: #e0e3e8;
}
.nav-item.active {
  background: #1e2a44;
  color: #a8c7fa;
  font-weight: 500;
}
.nav-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #9ca3af;
  flex-shrink: 0;
}
.nav-item.active .nav-dot {
  background: #5b8dee;
}
.nav-empty {
  padding: 12px;
  color: #4b5563;
  font-size: 0.8rem;
}
.group-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px 24px;
}
.item-card {
  background: #181c23;
  border: 1px solid #262b33;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: border-color 0.15s;
}
.item-card:hover {
  border-color: #3b4252;
}
.card-img {
  width: 100%;
  height: 140px;
  object-fit: cover;
  display: block;
}
.card-body {
  padding: 12px 16px;
}
.card-title {
  font-size: 0.95rem;
  font-weight: 500;
  color: #e0e3e8;
  margin: 0 0 4px;
}
.card-desc {
  font-size: 0.8rem;
  color: #6b7280;
  margin: 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.item-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 16px;
}
.select-prompt {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #4b5563;
  font-size: 1rem;
}
.item-detail-wrap {
  height: 100%;
}
.back-btn {
  background: none;
  border: 1px solid #3b4252;
  color: #9ca3af;
  padding: 4px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.82rem;
  margin-bottom: 12px;
}
.back-btn:hover {
  background: #191d26;
  color: #e0e3e8;
}
</style>
