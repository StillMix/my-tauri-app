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
      <div
        class="editor__block"
        :class="{ selected: index === selectedIndex }"
        @click="$emit('select-block', index)"
      >
        <component
          :is="block.type"
          :style="{
            width: block.styles.width + 'px',
            height: block.styles.height + 'px',
            padding: block.styles.padding + 'px',
            color: block.styles.color,
            backgroundColor: block.styles.backgroundColor,
          }"
        >
          {{ block.content }}
        </component>
      </div>
    </Draggable>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue'
import Draggable from '@/components/Draggable.vue'

export default {
  name: 'HtmlEditor',
  components: { Draggable },
  props: {
    blocks: Array,
    selectedIndex: Number,
  },
  setup() {
    const editorRef = ref(null)
    return { editorRef }
  },
  methods: {
    handleDrop(event) {
      const data = event.dataTransfer.getData('application/json')
      if (!data) return
      let payload
      try {
        payload = JSON.parse(data)
      } catch {
        return
      }
      const width = payload.styles?.width || 100
      const height = payload.styles?.height || 100
      // вычисляем координаты внутри редактора и ограничиваем границами
      const rect = this.$refs.editorRef.getBoundingClientRect()
      let left = event.clientX - rect.left
      let top = event.clientY - rect.top
      left = Math.min(Math.max(0, left), rect.width - width)
      top = Math.min(Math.max(0, top), rect.height - height)
      const newBlock = {
        id: Date.now(),
        type: payload.type,
        content: payload.content,
        styles: {
          left,
          top,
          width,
          height,
          padding: payload.styles?.padding || 0,
          color: payload.styles?.color || '#000',
          backgroundColor: payload.styles?.backgroundColor || 'transparent',
        },
      }
      this.$emit('add-block', newBlock)
    },
    savePosition(index, position) {
      // Ограничиваем новые координаты в области редактора
      const rect = this.$refs.editorRef.getBoundingClientRect()
      const block = this.blocks[index]
      const maxX = rect.width - block.styles.width
      const maxY = rect.height - block.styles.height
      const x = Math.min(Math.max(0, position.x), maxX)
      const y = Math.min(Math.max(0, position.y), maxY)
      this.$emit('update-block-position', { index, position: { x, y } })
    },
  },
}
</script>

<style scoped>
.editor {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.editor__block.selected {
  outline: 2px solid #42b983;
}
</style>
