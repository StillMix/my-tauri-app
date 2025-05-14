<template>
  <div
    class="resizable-element"
    :class="{ 'is-selected': isSelected }"
    :style="{
      width: width + 'px',
      height: height + 'px',
    }"
  >
    <div ref="contentRef" class="content">
      <slot></slot>
    </div>

    <!-- Ручки изменения размера (показываются только при выделении) -->
    <template v-if="isSelected">
      <!-- Угловые ручки -->
      <div class="resize-handle top-left" @mousedown.stop="startResize('top-left')"></div>
      <div class="resize-handle top-right" @mousedown.stop="startResize('top-right')"></div>
      <div class="resize-handle bottom-left" @mousedown.stop="startResize('bottom-left')"></div>
      <div class="resize-handle bottom-right" @mousedown.stop="startResize('bottom-right')"></div>

      <!-- Боковые ручки -->
      <div class="resize-handle top" @mousedown.stop="startResize('top')"></div>
      <div class="resize-handle right" @mousedown.stop="startResize('right')"></div>
      <div class="resize-handle bottom" @mousedown.stop="startResize('bottom')"></div>
      <div class="resize-handle left" @mousedown.stop="startResize('left')"></div>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref,  onBeforeUnmount } from 'vue'

export default defineComponent({
  name: 'ResizableElement',
  props: {
    isSelected: {
      type: Boolean,
      default: false,
    },
    width: {
      type: Number,
      required: true,
    },
    height: {
      type: Number,
      required: true,
    },
    minWidth: {
      type: Number,
      default: 20,
    },
    minHeight: {
      type: Number,
      default: 20,
    },
  },

  emits: ['resize'],

  setup(props, { emit }) {
    const contentRef = ref<HTMLElement | null>(null)
    let resizing = false
    let currentHandle = ''
    let startWidth = 0
    let startHeight = 0
    let startX = 0
    let startY = 0

    const startResize = (handle: string) => {
      if (!contentRef.value) return

      resizing = true
      currentHandle = handle

      // Сохраняем начальные размеры
      startWidth = props.width
      startHeight = props.height

      // Сохраняем начальную позицию мыши
      const mouseEvent = window.event as MouseEvent
      startX = mouseEvent.clientX
      startY = mouseEvent.clientY

      // Добавляем обработчики на документ
      document.addEventListener('mousemove', onResize)
      document.addEventListener('mouseup', stopResize)

      // Устанавливаем стиль курсора для всего документа
      document.body.style.cursor = getCursorStyle(handle)
      document.body.style.userSelect = 'none' // Предотвращаем выделение текста при изменении размера
    }

    const onResize = (e: MouseEvent) => {
      if (!resizing) return

      // Рассчитываем дельту перемещения мыши
      const deltaX = e.clientX - startX
      const deltaY = e.clientY - startY

      let newWidth = startWidth
      let newHeight = startHeight

      // Определяем, как изменить размеры в зависимости от используемой ручки
      switch (currentHandle) {
        case 'top-left':
          newWidth = Math.max(props.minWidth, startWidth - deltaX)
          newHeight = Math.max(props.minHeight, startHeight - deltaY)
          break
        case 'top-right':
          newWidth = Math.max(props.minWidth, startWidth + deltaX)
          newHeight = Math.max(props.minHeight, startHeight - deltaY)
          break
        case 'bottom-left':
          newWidth = Math.max(props.minWidth, startWidth - deltaX)
          newHeight = Math.max(props.minHeight, startHeight + deltaY)
          break
        case 'bottom-right':
          newWidth = Math.max(props.minWidth, startWidth + deltaX)
          newHeight = Math.max(props.minHeight, startHeight + deltaY)
          break
        case 'top':
          newHeight = Math.max(props.minHeight, startHeight - deltaY)
          break
        case 'right':
          newWidth = Math.max(props.minWidth, startWidth + deltaX)
          break
        case 'bottom':
          newHeight = Math.max(props.minHeight, startHeight + deltaY)
          break
        case 'left':
          newWidth = Math.max(props.minWidth, startWidth - deltaX)
          break
      }

      // Отправляем событие изменения размеров вверх
      emit('resize', { width: Math.round(newWidth), height: Math.round(newHeight) })
    }

    const stopResize = () => {
      resizing = false
      document.removeEventListener('mousemove', onResize)
      document.removeEventListener('mouseup', stopResize)

      // Восстанавливаем стиль курсора
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }

    const getCursorStyle = (handle: string) => {
      switch (handle) {
        case 'top-left':
        case 'bottom-right':
          return 'nwse-resize'
        case 'top-right':
        case 'bottom-left':
          return 'nesw-resize'
        case 'top':
        case 'bottom':
          return 'ns-resize'
        case 'left':
        case 'right':
          return 'ew-resize'
        default:
          return 'default'
      }
    }

    // Убираем обработчики при размонтировании компонента
    onBeforeUnmount(() => {
      document.removeEventListener('mousemove', onResize)
      document.removeEventListener('mouseup', stopResize)
    })

    return {
      contentRef,
      startResize,
    }
  },
})
</script>

<style scoped>
.resizable-element {
  position: relative;
  box-sizing: border-box;
}

.content {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.resize-handle {
  position: absolute;
  background-color: #42b983;
  border: 1px solid white;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  z-index: 100;
}

/* Угловые ручки */
.resize-handle.top-left {
  top: -4px;
  left: -4px;
  cursor: nwse-resize;
}

.resize-handle.top-right {
  top: -4px;
  right: -4px;
  cursor: nesw-resize;
}

.resize-handle.bottom-left {
  bottom: -4px;
  left: -4px;
  cursor: nesw-resize;
}

.resize-handle.bottom-right {
  bottom: -4px;
  right: -4px;
  cursor: nwse-resize;
}

/* Боковые ручки */
.resize-handle.top {
  top: -4px;
  left: 50%;
  transform: translateX(-50%);
  cursor: ns-resize;
}

.resize-handle.right {
  top: 50%;
  right: -4px;
  transform: translateY(-50%);
  cursor: ew-resize;
}

.resize-handle.bottom {
  bottom: -4px;
  left: 50%;
  transform: translateX(-50%);
  cursor: ns-resize;
}

.resize-handle.left {
  top: 50%;
  left: -4px;
  transform: translateY(-50%);
  cursor: ew-resize;
}
</style>
