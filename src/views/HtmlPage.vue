<template>
  <div class="html-page">
    <!-- Панель с элементами -->
    <aside class="sidebar">
      <h2>Элементы</h2>
      <PanelElement
        type="h1"
        defaultContent="Заголовок (H1)"
        :defaultStyles="{
          width: 200,
          height: 40,
          padding: 5,
          color: '#000000',
          backgroundColor: '#ffffff',
        }"
      >
        Заголовок (H1)
      </PanelElement>
      <PanelElement
        type="p"
        defaultContent="Параграф (P)"
        :defaultStyles="{
          width: 300,
          height: 60,
          padding: 5,
          color: '#000000',
          backgroundColor: '#ffffff',
        }"
      >
        Параграф (P)
      </PanelElement>
      <PanelElement
        type="button"
        defaultContent="Кнопка (Button)"
        :defaultStyles="{
          width: 120,
          height: 40,
          padding: 5,
          color: '#ffffff',
          backgroundColor: '#007BFF',
        }"
      >
        Кнопка (Button)
      </PanelElement>
    </aside>

    <!-- Поле редактора -->
    <HtmlEditor
      class="editor-area"
      :blocks="blocks"
      :selectedIndex="selectedIndex"
      @add-block="addBlock"
      @update-block-position="updateBlockPosition"
      @select-block="selectBlock"
    />

    <!-- Панель свойств -->
    <aside class="properties-panel">
      <h2>Свойства</h2>
      <PropertyElement v-if="selectedBlock" :block="selectedBlock" @update="updateBlockStyles" />
    </aside>
  </div>
</template>

<script lang="ts">
import PanelElement from '@/components/PanelElement.vue'
import HtmlEditor from '@/components/HtmlEditor.vue'
import PropertyElement from '@/components/PropertyElement.vue'
import { ref, computed } from 'vue'

export default {
  name: 'HtmlPage',
  components: { PanelElement, HtmlEditor, PropertyElement },
  setup() {
    const blocks = ref([])
    const selectedIndex = ref(null)

    const selectedBlock = computed(() => {
      if (
        selectedIndex.value === null ||
        selectedIndex.value < 0 ||
        selectedIndex.value >= blocks.value.length
      ) {
        return null
      }
      return blocks.value[selectedIndex.value]
    })

    const addBlock = (block) => {
      blocks.value.push(block)
      selectedIndex.value = blocks.value.length - 1
    }

    const updateBlockPosition = ({ index, position }) => {
      blocks.value[index].styles.left = position.x
      blocks.value[index].styles.top = position.y
    }

    const selectBlock = (index) => {
      selectedIndex.value = index
    }

    const updateBlockStyles = (newStyles) => {
      Object.assign(blocks.value[selectedIndex.value].styles, newStyles)
    }

    return {
      blocks,
      selectedIndex,
      selectedBlock,
      addBlock,
      updateBlockPosition,
      selectBlock,
      updateBlockStyles,
    }
  },
}
</script>

<style scoped>
.html-page {
  display: flex;
  height: 100vh;
}

.sidebar {
  width: 200px;
  padding: 10px;
  background: #f5f5f5;
  overflow-y: auto;
}

.editor-area {
  flex: 1;
}

.properties-panel {
  width: 250px;
  padding: 10px;
  background: #f5f5f5;
}
</style>
