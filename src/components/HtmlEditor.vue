<template>
  <div class="editor" @dragover.prevent @drop="handleDrop">
    <div
      v-for="(block, index) in blocks"
      :key="block.id"
      class="editor__block"
      :class="{ selected: index === selectedIndex }"
      @click="() => $emit('select-block', index)"
    >
      <component :is="block.type" :style="block.styles">{{ block.content }}</component>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

interface Block {
  id: string
  type: string
  content: string
  styles: Record<string, string>
}

defineProps<{
  blocks: Block[]
  selectedIndex: number | null
}>()

const emit = defineEmits(['add-block', 'select-block'])

function handleDrop(e: DragEvent) {
  const type = e.dataTransfer?.getData('type')
  if (!type) return

  const newBlock: Block = {
    id: crypto.randomUUID(),
    type,
    content: type === 'button' ? 'Кнопка' : type === 'h1' ? 'Заголовок' : 'Текст',
    styles: {
      fontSize: '16px',
      color: '#000000',
      backgroundColor: '#ffffff',
      padding: '5px',
    },
  }

  emit('add-block', newBlock)
}
</script>

<style scoped lang="scss">
.editor {
  flex: 1;
  padding: 1rem;
  background: #fff;
  min-height: 100vh;
  overflow-y: auto;
  border-left: 1px solid #ddd;
  border-right: 1px solid #ddd;

  &__block {
    padding: 0.5rem;
    border: 1px dashed transparent;
    margin-bottom: 0.5rem;
    cursor: pointer;

    &.selected {
      border-color: #42b983;
      background: #f0fdf4;
    }
  }
}
</style>
