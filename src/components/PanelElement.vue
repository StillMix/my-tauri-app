<template>
  <div class="panel">
    <h2>Элементы</h2>
    <div
      v-for="element in elements"
      :key="element.type"
      class="panel__item"
      draggable="true"
      @dragstart="(e) => onDragStart(e, element.type)"
    >
      {{ element.label }}
    </div>
  </div>
</template>

<script setup lang="ts">
const elements = [
  { type: 'h1', label: 'Заголовок (H1)' },
  { type: 'p', label: 'Параграф (P)' },
  { type: 'button', label: 'Кнопка (Button)' },
]

function onDragStart(event: DragEvent, type: string) {
  event.dataTransfer?.setData('type', type)
}
</script>

<style scoped lang="scss">
.panel {
  width: 200px;
  padding: 1rem;
  background: #f4f4f4;
  border-right: 1px solid #ccc;
  h2 {
    margin-bottom: 1rem;
  }
  &__item {
    padding: 0.5rem;
    margin-bottom: 0.5rem;
    background: #fff;
    border: 1px solid #ddd;
    cursor: grab;
    text-align: center;
    &:hover {
      background: #eaeaea;
    }
  }
}
</style>
