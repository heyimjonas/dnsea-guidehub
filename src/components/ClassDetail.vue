<script setup>
import { computed } from 'vue'

const props = defineProps({
  cls: { type: Object, default: null },
})

const normalSpecs = computed(() => props.cls?.firstSpecs?.filter(fs => fs.specType !== 'SPINOFF') ?? [])
const spinoffSpecs = computed(() => props.cls?.firstSpecs?.filter(fs => fs.specType === 'SPINOFF') ?? [])

function diffStars(n) {
  return n ? '★'.repeat(n) + '☆'.repeat(5 - n) : ''
}
</script>

<template>
  <main
    v-if="cls"
    class="detail"
    :style="{
      backgroundImage: `url(${cls.classImage})`,
    }"
  >
    <div class="scroll-area">
      <div class="content">
      <h1 class="title">
        <img v-if="cls.classLogo" :src="cls.classLogo" :alt="cls.name" class="class-logo" />
        {{ cls.name }}
      </h1>

      <div class="meta" v-if="cls.difficulty">
        <span class="label">Difficulty</span>
        <span class="stars">{{ diffStars(cls.difficulty) }}</span>
      </div>

      <div class="text-box" v-if="cls.quickProfile">
        <h2>Profile</h2>
        <p>{{ cls.quickProfile }}</p>
      </div>

      <div class="text-box" v-if="cls.description">
        <h2>Description</h2>
        <p class="desc">{{ cls.description }}</p>
      </div>

      <div v-if="normalSpecs.length" class="spec-section">
        <h2 class="specs-title">Specializations</h2>
        <div class="spec-grid">
          <div
            v-for="(fs) in normalSpecs"
            :key="fs.id"
            class="spec-card"
          >
            <div class="spec-card-head">
              <img v-if="fs.logo" :src="fs.logo" :alt="fs.name" class="spec-logo" />
              <div class="spec-card-name">{{ fs.name }}</div>
            </div>
            <div class="spec-chips" v-if="fs.secondSpecs?.length">
              <div v-for="ss in fs.secondSpecs" :key="ss.id" class="spec-box">
                <img v-if="ss.logo" :src="ss.logo" :alt="ss.name" class="box-logo" />
                <span class="box-name">{{ ss.name }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="spinoffSpecs.length" class="spec-section">
        <h2 class="specs-title">Spinoff</h2>
        <div class="spec-grid">
          <div
            v-for="(fs) in spinoffSpecs"
            :key="fs.id"
            class="spec-card"
          >
            <div class="spec-card-head">
              <img v-if="fs.logo" :src="fs.logo" :alt="fs.name" class="spec-logo" />
              <div class="spec-card-name">{{ fs.name }}</div>
            </div>
            <div class="spec-chips" v-if="fs.secondSpecs?.length">
              <div v-for="ss in fs.secondSpecs" :key="ss.id" class="spec-box">
                <img v-if="ss.logo" :src="ss.logo" :alt="ss.name" class="box-logo" />
                <span class="box-name">{{ ss.name }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  </main>

  <main class="detail empty" v-else>
    <p>Select a class from the sidebar.</p>
  </main>
</template>

<style scoped>
.detail {
  flex: 1;
  overflow: hidden;
  background-size: cover;
  background-position: 5% top;
  background-repeat: no-repeat;
  background-color: #0a0a0a;
  position: relative;
}
.scroll-area {
  height: 100%;
  overflow-y: auto;
  position: relative;
  z-index: 1;
}
.detail.empty {
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  color: #aaa;
  font-size: 1.1rem;
  position: static;
}
.content {
  min-height: 100vh;
  padding: 36px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 580px;
}

.detail::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(to right, rgba(10,10,10,.92) 0%, rgba(10,10,10,.7) 25%, rgba(10,10,10,.1) 50%, transparent 65%);
  pointer-events: none;
}
.title {
  font-size: 2.4rem;
  margin: 0;
  color: #fff;
  text-shadow: 0 2px 12px rgba(0,0,0,.9), 0 0 40px rgba(0,0,0,.6);
  display: flex;
  align-items: center;
  gap: 12px;
}
.class-logo {
  width: 48px;
  height: 48px;
  object-fit: contain;
  flex-shrink: 0;
}
.meta {
  display: flex;
  align-items: center;
  gap: 8px;
}
.label {
  font-size: .85rem;
  color: #b0b5cc;
  text-transform: uppercase;
  letter-spacing: .5px;
}
.stars {
  color: #f5a623;
  font-size: 1.5rem;
  letter-spacing: 3px;
  text-shadow: 0 1px 8px rgba(0,0,0,.8);
}
.text-box {
  border-radius: 10px;
  padding: 16px 20px;
}
.text-box h2 {
  font-size: 1.1rem;
  color: #fff;
  margin: 0 0 8px;
  text-shadow: 0 1px 8px rgba(0,0,0,.8);
}
.text-box p {
  color: #b0b5cc;
  line-height: 1.7;
  margin: 0;
}
.desc {
  white-space: pre-line;
}
.spec-section {
  width: min(calc(100% + 200px), calc(100vw - 72px));
}
.specs-title {
  font-size: 1.1rem;
  color: #fff;
  margin: 0 0 10px;
  text-shadow: 0 1px 8px rgba(0,0,0,.8);
}
.text-box h3 {
  font-size: 1.05rem;
  margin: 0 0 4px;
  color: #fff;
  text-shadow: 0 1px 6px rgba(0,0,0,.7);
}
.spec-desc {
  font-size: .9rem;
  color: #b0b5cc !important;
  margin: 0 0 8px !important;
}

/* --- spec grid --- */
.spec-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.spec-card {
  flex: 0 0 auto;
  min-width: 100px;
  background: rgba(255,255,255,.05);
  border: 1px solid rgba(255,255,255,.08);
  border-radius: 10px;
  padding: 14px 10px;
  transition: background .15s;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.spec-card-head {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  text-align: center;
}
.spec-logo {
  width: 48px;
  height: 48px;
  object-fit: contain;
  border-radius: 8px;
  flex-shrink: 0;
}
.spec-card-name {
  font-size: .85rem;
  font-weight: 600;
  color: #fff;
  text-shadow: 0 1px 6px rgba(0,0,0,.6);
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}
.spec-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 10px;
  padding-top: 8px;
  border-top: 1px solid rgba(255,255,255,.06);
  justify-content: center;
  width: 100%;
}
.spec-box {
  background: rgba(255,255,255,.06);
  border: 1px solid rgba(255,255,255,.08);
  border-radius: 8px;
  padding: 6px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  flex: 0 0 auto;
  transition: background .12s;
}
.spec-box:hover {
  background: rgba(255,255,255,.1);
}
.box-logo {
  width: 48px;
  height: 48px;
  object-fit: contain;
  border-radius: 8px;
  flex-shrink: 0;
}
.box-name {
  color: #c8ccd6;
  font-size: .85rem;
  font-weight: 500;
  text-align: center;
  line-height: 1.2;
  white-space: nowrap;
}
</style>
