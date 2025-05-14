<!-- Draggable.vue -->
<template>
  <div
    class="draggable"
    :style="{
      position: 'absolute',
      top: position.y + 'px',
      left: position.x + 'px',
      cursor: dragging ? 'grabbing' : 'grab',
    }"
    @mousedown.prevent="startDrag"
  >
    <slot />
  </div>
</template>

<script lang="ts">
export default {
  name: 'DraggableComp',
  props: {
    // можно передавать стартовую позицию извне
    initX: { type: Number, default: 0 },
    initY: { type: Number, default: 0 },
  },
  data() {
    return {
      position: { x: this.initX, y: this.initY },
      dragging: false,
      offset: { x: 0, y: 0 },
    }
  },
  methods: {
    startDrag(event) {
      this.dragging = true
      // рассчитываем смещение курсора внутри блока
      this.offset.x = event.clientX - this.position.x
      this.offset.y = event.clientY - this.position.y
      window.addEventListener('mousemove', this.onDrag)
      window.addEventListener('mouseup', this.stopDrag)
    },
    onDrag(event) {
      if (!this.dragging) return
      // обновляем позицию согласно движению мыши
      this.position.x = event.clientX - this.offset.x
      this.position.y = event.clientY - this.offset.y
    },
    stopDrag() {
      this.dragging = false
      window.removeEventListener('mousemove', this.onDrag)
      window.removeEventListener('mouseup', this.stopDrag)
    },
  },
}
</script>

<style scoped>
.draggable {
  /* по желанию — рамка/тень, чтобы было видно область */
  user-select: none;
}
</style>
