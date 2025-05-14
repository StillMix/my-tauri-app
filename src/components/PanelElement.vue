<template>
  <div class="panel-element" draggable="true" @dragstart="handleDragStart">
    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'PanelElement',
  props: {
    type: {
      type: String,
      required: true,
    },
    defaultContent: {
      type: String,
      default: '',
    },
    defaultStyles: {
      type: Object,
      default: () => ({
        width: 100,
        height: 100,
        padding: 0,
        color: '#000',
        backgroundColor: 'transparent',
      }),
    },
  },
  methods: {
    handleDragStart(event: DragEvent) {
      if (!event.dataTransfer) return

      const payload = {
        type: this.type,
        content: this.defaultContent,
        styles: this.defaultStyles,
      }

      event.dataTransfer.setData('application/json', JSON.stringify(payload))
      event.dataTransfer.effectAllowed = 'copy'

      // Правильная проверка типа на HTMLElement
      const target = event.target as HTMLElement
      if (target) {
        target.classList.add('dragging')
        // Удаляем класс после завершения перетаскивания
        setTimeout(() => {
          target.classList.remove('dragging')
        }, 0)
      }
    },
  },
})
</script>

<style scoped>
.panel-element {
  cursor: grab;
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

.panel-element:hover {
  background: #f8f8f8;
  transform: translateY(-2px);
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
}

.panel-element.dragging {
  opacity: 0.5;
}
</style>
