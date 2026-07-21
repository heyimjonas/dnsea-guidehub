<script setup>
defineProps({
  item: { type: Object, required: true },
})
</script>

<template>
  <div class="equip-detail">
    <h1 class="equip-title">{{ item.name }}</h1>
    <img
      v-if="item.item_image"
      :src="item.item_image"
      :alt="item.name"
      class="equip-image"
    />
    <p v-if="item.description" class="equip-description">{{ item.description }}</p>
    <div v-if="item.how_to_obtain" class="equip-section">
      <h3 class="equip-section-title">How to Obtain</h3>
      <p class="equip-section-text">{{ item.how_to_obtain }}</p>
    </div>
  </div>
</template>

<style scoped>
.equip-detail {
  flex: 1;
  padding: 32px 40px;
  overflow-y: auto;
  color: #e0e3e8;
  background: url('https://i.ibb.co/JFjTnXNP/bg4-01.jpg') center / cover no-repeat;
  position: relative;
}
.equip-detail::before {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(15, 18, 24, 0.75);
  pointer-events: none;
}
.equip-title,
.equip-description,
.equip-section {
  position: relative;
  z-index: 1;
}
.equip-image {
  position: relative;
  z-index: 1;
}
.equip-title {
  font-size: 1.6rem;
  font-weight: 600;
  margin: 0 0 20px;
  color: #e8eaf0;
}
.equip-image {
  max-width: 100%;
  border-radius: 8px;
  margin-bottom: 20px;
}
.equip-description {
  font-size: 0.95rem;
  line-height: 1.6;
  color: #b0b8c8;
  margin-bottom: 24px;
}
.equip-section {
  background: #181c23;
  border-radius: 8px;
  padding: 20px;
}
.equip-section-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin: 0 0 12px;
}
.equip-section-text {
  font-size: 0.9rem;
  line-height: 1.6;
  color: #b0b8c8;
  margin: 0;
  white-space: pre-wrap;
}
</style>
