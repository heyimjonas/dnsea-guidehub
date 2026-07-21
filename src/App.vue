<script setup>
import { ref, onMounted } from 'vue'
import Sidebar from './components/Sidebar.vue'
import ClassDetail from './components/ClassDetail.vue'
import EquipmentDetail from './components/EquipmentDetail.vue'
import EquipmentGroupView from './components/EquipmentGroupView.vue'
import { getClasses, getClassWithSpecs, getEquipment, getEquipmentItemBySlug, getEquipmentGroupBySlug } from './db.js'

const classes = ref([])
const equipment = ref([])
const activeClass = ref(null)
const activeEquip = ref(null)
const activeGroup = ref(null)
const externalUrl = ref(null)
const loading = ref(true)
const error = ref(null)
const imgLoaded = ref(false)

onMounted(async () => {
  try {
    classes.value = await getClasses()
    equipment.value = await getEquipment()
    preloadImages()
    if (classes.value.length) {
      activeClass.value = await getClassWithSpecs(classes.value[0].slug)
    }
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
})

function preloadImages() {
  for (const c of classes.value) {
    if (c.classImage) {
      const img = new Image()
      img.src = c.classImage
    }
  }
}

async function onSelect(slug) {
  externalUrl.value = null
  loading.value = true
  imgLoaded.value = false
  activeClass.value = null
  activeEquip.value = null
  activeGroup.value = null
  try {
    const group = await getEquipmentGroupBySlug(slug)
    if (group) {
      activeGroup.value = group
    } else {
      const equipItem = await getEquipmentItemBySlug(slug)
      if (equipItem) {
        activeEquip.value = equipItem
      } else {
        activeClass.value = await getClassWithSpecs(slug)
      }
    }
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}

function onSelectExternal(url) {
  activeClass.value = null
  externalUrl.value = url
}
</script>

<template>
  <div class="layout">
    <Sidebar
      :classes="classes"
      :equipment="equipment"
      :active-slug="activeClass?.slug || activeEquip?.slug || activeGroup?.slug"
      @select="onSelect"
      @select-external="onSelectExternal"
    />
    <div class="content-area">
      <div class="loader" v-if="loading">Loading…</div>
      <div class="error" v-else-if="error">{{ error }}</div>
      <EquipmentGroupView v-else-if="activeGroup" :group="activeGroup" />
      <ClassDetail v-else-if="activeClass" :cls="activeClass" />
      <EquipmentDetail v-else-if="activeEquip" :item="activeEquip" />
      <iframe v-else-if="externalUrl" :src="externalUrl" class="external-frame" />
    </div>
  </div>
</template>

<style scoped>
.layout {
  display: flex;
  height: 100vh;
  overflow: hidden;
}
.content-area {
  flex: 1;
  display: flex;
}
.loader,
.error {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #888;
  font-size: 1.1rem;
}
.error {
  color: #d32f2f;
}
.external-frame {
  flex: 1;
  border: none;
  width: 100%;
  height: 100%;
  background: #fff;
}
</style>
