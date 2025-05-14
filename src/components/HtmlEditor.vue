<template>
  <div class="editor" ref="editorRef" @dragover.prevent @drop="handleDrop">
    <Draggable
      v-for="(block, index) in blocks"
      :key="block.id"
      :initX="block.styles.left"
      :initY="block.styles.top"
      :boundaryRef="editorRef"
      @stopDrag="savePosition(index, $event)"
      ref="draggables"
    >
      <ResizableElement
        :isSelected="index === selectedIndex"
        :width="block.styles.width"
        :height="block.styles.height"
        :minWidth="20"
        :minHeight="20"
        @resize="handleResize(index, $event)"
      >
        <div
          :id="`element-${block.id}`"
          class="editor__block"
          :class="{ selected: index === selectedIndex }"
          @click="selectBlock(index)"
          :style="generateBlockStyles(block)"
        >
          {{ block.content }}
        </div>
      </ResizableElement>
    </Draggable>

    <div class="editor__tools" v-if="selectedIndex !== null">
      <button class="delete-button" @click="deleteSelectedBlock">Удалить</button>
      <button class="duplicate-button" @click="duplicateSelectedBlock">Дублировать</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import type { PropType } from 'vue'
import Draggable from '@/components/Draggable.vue'
import ResizableElement from '@/components/ResizableElement.vue'

interface StyleProps {
  left: number
  top: number
  width: number
  height: number
  padding: number
  color: string
  backgroundColor: string
  borderRadius?: number
  fontSize?: number
  fontWeight?: string | number
  textAlign?: string
  borderWidth?: number
  borderStyle?: string
  borderColor?: string
  transition?: string
  [key: string]: string | number | undefined
}

interface Block {
  id: number
  type: string
  content: string
  styles: StyleProps
  hoverStyles?: {
    [key: string]: string | number | undefined
  }
  transitionTime?: number
}

export default defineComponent({
  name: 'HtmlEditor',
  components: { Draggable, ResizableElement },
  props: {
    blocks: {
      type: Array as PropType<Block[]>,
      required: true,
    },
    selectedIndex: {
      type: Number as PropType<number | null>,
      default: null,
    },
  },
  emits: [
    'add-block',
    'update-block-position',
    'update-block',
    'update-block-content',
    'select-block',
    'delete-block',
    'duplicate-block',
  ],

  setup() {
    const editorRef = ref<HTMLElement | null>(null)

    return {
      editorRef,
    }
  },

  methods: {
    generateBlockStyles(block: Block) {
      const styles: Record<string, string | number | undefined> = {
        padding: `${block.styles.padding}px`,
        color: block.styles.color,
        backgroundColor: block.styles.backgroundColor,
        position: 'relative',
      }

      // Добавляем остальные стили, если они существуют
      Object.entries(block.styles).forEach(([key, value]) => {
        if (
          !['left', 'top', 'width', 'height', 'padding', 'color', 'backgroundColor'].includes(key)
        ) {
          // Конвертируем числовые значения в пиксели, где это уместно
          if (typeof value === 'number' && !['fontWeight', 'opacity', 'zIndex'].includes(key)) {
            styles[key] = `${value}px`
          } else {
            styles[key] = value
          }
        }
      })

      // Добавляем transition, если есть время transition
      if (block.transitionTime) {
        styles.transition = `all ${block.transitionTime}ms ease`
      }

      return styles
    },

    handleDrop(event: DragEvent) {
      const data = event.dataTransfer?.getData('application/json')
      if (!data) return

      let payload
      try {
        payload = JSON.parse(data)
      } catch {
        return
      }

      const width = payload.styles?.width || 100
      const height = payload.styles?.height || 100

      // Вычисляем координаты внутри редактора и ограничиваем границами
      if (!this.editorRef) return
      const rect = this.editorRef.getBoundingClientRect()

      let left = event.clientX - rect.left
      let top = event.clientY - rect.top

      left = Math.min(Math.max(0, left), rect.width - width)
      top = Math.min(Math.max(0, top), rect.height - height)

      const newBlock: Block = {
        id: Date.now(),
        type: payload.type,
        content: payload.content,
        styles: {
          left,
          top,
          width,
          height,
          padding: payload.styles?.padding || 0,
          color: payload.styles?.color || '#000000',
          backgroundColor: payload.styles?.backgroundColor || 'transparent',
          borderRadius: 0,
          fontSize: 16,
          fontWeight: 'normal',
          textAlign: 'left',
          borderWidth: 0,
          borderStyle: 'none',
          borderColor: '#000000',
        },
        hoverStyles: {
          color: payload.styles?.color || '#000000',
          backgroundColor: payload.styles?.backgroundColor || 'transparent',
          borderWidth: 0,
          borderStyle: 'none',
          borderColor: '#000000',
        },
        transitionTime: 200,
      }

      this.$emit('add-block', newBlock)
    },

    savePosition(index: number, position: { x: number; y: number }) {
      // Ограничиваем новые координаты в области редактора
      if (!this.editorRef) return
      const rect = this.editorRef.getBoundingClientRect()

      const block = this.blocks[index]
      const maxX = rect.width - block.styles.width
      const maxY = rect.height - block.styles.height

      const x = Math.min(Math.max(0, position.x), maxX)
      const y = Math.min(Math.max(0, position.y), maxY)

      this.$emit('update-block-position', { index, position: { x, y } })
    },

    handleResize(index: number, { width, height }: { width: number; height: number }) {
      // Обновляем стили блока
      this.$emit('update-block', {
        index,
        updates: {
          styles: {
            ...this.blocks[index].styles,
            width,
            height,
          },
        },
      })
    },

    selectBlock(index: number) {
      this.$emit('select-block', index)
    },

    deleteSelectedBlock() {
      if (this.selectedIndex !== null) {
        this.$emit('delete-block', this.selectedIndex)
      }
    },

    duplicateSelectedBlock() {
      if (this.selectedIndex !== null) {
        this.$emit('duplicate-block', this.selectedIndex)
      }
    },
  },
})
</script>

<style scoped>
.editor {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: #f9f9f9;
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.1);
}

.editor__block {
  cursor: pointer;
  overflow: hidden;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.editor__block.selected {
  outline: 2px solid #42b983;
  z-index: 10;
}

.editor__tools {
  position: absolute;
  bottom: 10px;
  right: 10px;
  display: flex;
  gap: 10px;
  z-index: 100;
}

.delete-button,
.duplicate-button {
  padding: 5px 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  color: white;
  font-weight: bold;
}

.delete-button {
  background-color: #ff4757;
}

.duplicate-button {
  background-color: #1e90ff;
}

.delete-button:hover {
  background-color: #ff6b81;
}

.duplicate-button:hover {
  background-color: #4da6ff;
}
</style>
