<script setup>
import { ref, onMounted } from 'vue'
import Sidebar from './components/Sidebar.vue'
import ClassDetail from './components/ClassDetail.vue'
import { getClasses, getClassWithSpecs } from './db.js'

const classes = ref([])
const activeClass = ref(null)
const loading = ref(true)
const error = ref(null)
const imgLoaded = ref(false)

onMounted(async () => {
  try {
    classes.value = await getClasses()
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
  loading.value = true
  imgLoaded.value = false
  try {
    activeClass.value = await getClassWithSpecs(slug)
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="layout">
    <Sidebar
      :classes="classes"
      :active-slug="activeClass?.slug"
      @select="onSelect"
    />
    <div class="content-area">
      <div class="loader" v-if="loading">Loading…</div>
      <div class="error" v-else-if="error">{{ error }}</div>
      <ClassDetail v-else :cls="activeClass" />
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
</style>
