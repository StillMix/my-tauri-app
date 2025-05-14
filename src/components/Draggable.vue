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
import { defineComponent, ref } from 'vue'
import type { PropType } from 'vue'
export default defineComponent({
  name: 'DraggableComp',
  props: {
    // можно передавать стартовую позицию извне
    initX: { type: Number, default: 0 },
    initY: { type: Number, default: 0 },
    boundaryRef: {
      type: Object as PropType<HTMLElement | null>,
      default: null,
    },
  },

  setup(props, { emit }) {
    const dragging = ref(false)
    const position = ref({ x: props.initX, y: props.initY })
    const offset = ref({ x: 0, y: 0 })

    const startDrag = (event: MouseEvent) => {
      dragging.value = true
      // рассчитываем смещение курсора внутри блока
      offset.value.x = event.clientX - position.value.x
      offset.value.y = event.clientY - position.value.y

      window.addEventListener('mousemove', onDrag)
      window.addEventListener('mouseup', stopDrag)
    }

    const onDrag = (event: MouseEvent) => {
      if (!dragging.value) return

      // обновляем позицию согласно движению мыши
      position.value.x = event.clientX - offset.value.x
      position.value.y = event.clientY - offset.value.y
    }

    const stopDrag = () => {
      dragging.value = false
      window.removeEventListener('mousemove', onDrag)
      window.removeEventListener('mouseup', stopDrag)

      // сообщаем родителю о завершении перетаскивания
      emit('stopDrag', position.value)
    }

    return {
      dragging,
      position,
      offset,
      startDrag,
      onDrag,
      stopDrag,
    }
  },
})
</script>

<style scoped>
.draggable {
  user-select: none;
}
</style>
