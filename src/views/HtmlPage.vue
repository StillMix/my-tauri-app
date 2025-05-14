<template>
  <div class="html-page">
    <PanelElement />

    <HtmlEditor
      :blocks="blocks"
      :selected-index="selectedIndex"
      @add-block="addBlock"
      @select-block="selectBlock"
    />

    <PropertyElement v-if="selectedBlock" :block="selectedBlock" @update="updateBlock" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import PanelElement from '@/components/PanelElement.vue'
import HtmlEditor from '@/components/HtmlEditor.vue'
import PropertyElement from '@/components/PropertyElement.vue'

interface Block {
  id: string
  type: string
  content: string
  styles: Record<string, string>
}

const blocks = ref<Block[]>([])
const selectedIndex = ref<number | null>(null)

const selectedBlock = computed(() =>
  selectedIndex.value !== null ? blocks.value[selectedIndex.value] : null,
)

function addBlock(block: Block) {
  blocks.value.push(block)
}

function selectBlock(index: number) {
  selectedIndex.value = index
}

function updateBlock(updated: Block) {
  if (selectedIndex.value !== null) {
    blocks.value[selectedIndex.value] = { ...updated }
  }
}
</script>

<style scoped lang="scss">
.html-page {
  display: flex;
  height: 100vh;
  overflow: hidden;
}
</style>
