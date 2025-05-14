<template>
  <div class="property-element">
    <div class="field">
      <label>Цвет текста</label>
      <!-- используем localStyles, а не localBlock -->
      <input type="color" v-model="localStyles.color" />
    </div>
    <div class="field">
      <label>Цвет фона</label>
      <input
        type="text"
        v-model="localStyles.backgroundColor"
        placeholder="#rrggbb или transparent"
      />
    </div>
    <!-- остальные поля аналогично -->
  </div>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'

// 1) Деструктурируем props и emit
const props = defineProps({
  block: {
    type: Object,
    required: true,
  },
})
const emit = defineEmits(['update'])

// 2) Копируем block.styles в реактивный объект
const localStyles = reactive({ ...props.block.styles })

// 3) При любом изменении localStyles шлём событие наверх
watch(
  localStyles,
  (newStyles) => {
    emit('update', { ...newStyles })
  },
  { deep: true },
)

// 4) Если props.block.styles вдруг изменится целиком — синхронизируем
watch(
  () => props.block.styles,
  (newStyles) => {
    Object.assign(localStyles, newStyles)
  },
  { deep: true },
)
</script>

<style scoped>
.property-element {
  /* ваши стили */
}
.field {
  margin-bottom: 1em;
}
label {
  display: block;
  margin-bottom: 0.25em;
  font-weight: bold;
}
input {
  width: 100%;
  box-sizing: border-box;
}
</style>
