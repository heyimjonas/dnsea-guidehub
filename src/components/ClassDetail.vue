<script setup>
defineProps({
  cls: { type: Object, default: null },
})

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
    <div class="content">
      <h1 class="title">{{ cls.name }}</h1>

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

      <div v-if="cls.firstSpecs?.length">
        <h2 class="specs-title">Specializations</h2>
        <div class="tree">
          <div
            v-for="(fs, i) in cls.firstSpecs"
            :key="fs.id"
            class="tree-row"
          >
            <img v-if="fs.logo" :src="fs.logo" :alt="fs.name" class="spec-logo" />
            <div class="tree-label">{{ fs.name }}</div>
            <div class="tree-leaves" v-if="fs.secondSpecs?.length">
              <span v-for="ss in fs.secondSpecs" :key="ss.id" class="tree-leaf">
                <img v-if="ss.logo" :src="ss.logo" :alt="ss.name" class="leaf-logo" />
                {{ ss.name }}
              </span>
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
  overflow-y: auto;
  background-size: cover;
  background-position: 5% top;
  background-repeat: no-repeat;
  background-color: #0a0a0a;
  position: relative;
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
  position: relative;
  z-index: 1;
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
  font-size: 1.1rem;
  letter-spacing: 2px;
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

/* --- tree --- */
.tree {
  position: relative;
  padding-left: 28px;
}
.tree::before {
  content: '';
  position: absolute;
  left: 12px;
  top: 0;
  bottom: 0;
  width: 1px;
  background: rgba(255,255,255,.18);
}
.tree-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 0;
  position: relative;
}
.tree-row::before {
  content: '';
  position: absolute;
  left: -16px;
  top: 50%;
  width: 16px;
  height: 1px;
  background: rgba(255,255,255,.18);
}
.spec-logo {
  width: 28px;
  height: 28px;
  object-fit: contain;
  border-radius: 4px;
  flex-shrink: 0;
}
.tree-label {
  color: #fff;
  font-size: .95rem;
  font-weight: 500;
  min-width: 96px;
  text-shadow: 0 1px 6px rgba(0,0,0,.6);
}
.tree-leaves {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.tree-leaf {
  background: rgba(255,255,255,.08);
  color: #b0b5cc;
  padding: 3px 10px;
  border-radius: 10px;
  font-size: .8rem;
  white-space: nowrap;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}
.leaf-logo {
  width: 16px;
  height: 16px;
  object-fit: contain;
  border-radius: 2px;
  flex-shrink: 0;
}
</style>
