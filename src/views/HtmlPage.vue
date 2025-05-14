<template>
  <div class="html-page">
    <!-- Панель с элементами -->
    <aside class="sidebar">
      <h2>Элементы</h2>
      <PanelElement
        type="h1"
        defaultContent="Заголовок (H1)"
        :defaultStyles="{
          width: 300,
          height: 60,
          padding: 10,
          color: '#000000',
          backgroundColor: '#ffffff',
          fontSize: 24,
          fontWeight: 'bold',
        }"
      >
        Заголовок (H1)
      </PanelElement>
      <PanelElement
        type="p"
        defaultContent="Параграф (P)"
        :defaultStyles="{
          width: 300,
          height: 80,
          padding: 10,
          color: '#000000',
          backgroundColor: '#ffffff',
          fontSize: 16,
          fontWeight: 'normal',
        }"
      >
        Параграф (P)
      </PanelElement>
      <PanelElement
        type="button"
        defaultContent="Кнопка (Button)"
        :defaultStyles="{
          width: 150,
          height: 50,
          padding: 10,
          color: '#ffffff',
          backgroundColor: '#007BFF',
          borderRadius: 5,
          fontWeight: 'bold',
          textAlign: 'center',
          borderWidth: 0,
          borderStyle: 'none',
        }"
      >
        Кнопка (Button)
      </PanelElement>
      <PanelElement
        type="div"
        defaultContent="Контейнер (Div)"
        :defaultStyles="{
          width: 300,
          height: 150,
          padding: 15,
          color: '#000000',
          backgroundColor: '#f2f2f2',
          borderWidth: 1,
          borderStyle: 'solid',
          borderColor: '#dddddd',
          borderRadius: 4,
        }"
      >
        Контейнер (Div)
      </PanelElement>
      <PanelElement
        type="span"
        defaultContent="Метка (Span)"
        :defaultStyles="{
          width: 150,
          height: 40,
          padding: 8,
          color: '#ffffff',
          backgroundColor: '#28a745',
          borderRadius: 20,
          textAlign: 'center',
          fontWeight: 'bold',
          fontSize: 14,
        }"
      >
        Метка (Span)
      </PanelElement>
    </aside>

    <!-- Поле редактора -->
    <HtmlEditor
      class="editor-area"
      :blocks="blocks"
      :selectedIndex="selectedIndex"
      @add-block="addBlock"
      @update-block-position="updateBlockPosition"
      @update-block="updateBlock"
      @update-block-content="updateBlockContent"
      @select-block="selectBlock"
      @delete-block="deleteBlock"
      @duplicate-block="duplicateBlock"
    />

    <!-- Панель свойств -->
    <aside class="properties-panel">
      <h2>Свойства</h2>
      <PropertyElement
        v-if="selectedBlock"
        :block="selectedBlock"
        @update="updateBlockStyles"
        @updateContent="updateBlockContent"
      />

      <!-- Секция экспорта HTML -->
      <div class="export-section">
        <button class="export-btn" @click="exportHTML">Экспорт HTML</button>
      </div>
    </aside>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import PanelElement from '@/components/PanelElement.vue'
import HtmlEditor from '@/components/HtmlEditor.vue'
import PropertyElement from '@/components/PropertyElement.vue'

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
  name: 'HtmlPage',
  components: { PanelElement, HtmlEditor, PropertyElement },
  data() {
    return {
      blocks: [] as Block[],
      selectedIndex: null as number | null,
    }
  },
  computed: {
    selectedBlock(): Block | null {
      if (
        this.selectedIndex === null ||
        this.selectedIndex < 0 ||
        this.selectedIndex >= this.blocks.length
      ) {
        return null
      }
      return this.blocks[this.selectedIndex]
    },
  },
  methods: {
    addBlock(block: Block) {
      this.blocks.push(block)
      this.selectedIndex = this.blocks.length - 1
    },

    updateBlockPosition({
      index,
      position,
    }: {
      index: number
      position: { x: number; y: number }
    }) {
      this.blocks[index].styles.left = position.x
      this.blocks[index].styles.top = position.y
    },

    updateBlock({ index, updates }: { index: number; updates: Partial<Block> }) {
      Object.assign(this.blocks[index], updates)
    },

    selectBlock(index: number) {
      this.selectedIndex = index
    },

    updateBlockStyles(updates: {
      styles: Record<string, any>
      hoverStyles: Record<string, any>
      transitionTime: number
    }) {
      if (this.selectedIndex !== null) {
        const block = { ...this.blocks[this.selectedIndex] }

        // Создаем новый объект стилей с обновлениями
        const updatedStyles = {
          ...block.styles,
          ...updates.styles,
        }

        // Создаем обновленный блок
        const updatedBlock = {
          ...block,
          styles: updatedStyles,
          hoverStyles: { ...updates.hoverStyles },
          transitionTime: updates.transitionTime,
        }

        // Отправляем обновление
        this.updateBlock({
          index: this.selectedIndex,
          updates: updatedBlock,
        })
      }
    },

    updateBlockContent(content: string) {
      if (this.selectedIndex !== null) {
        this.blocks[this.selectedIndex].content = content
      }
    },

    deleteBlock(index: number) {
      this.blocks.splice(index, 1)
      if (this.selectedIndex === index) {
        this.selectedIndex = this.blocks.length > 0 ? 0 : null
      } else if (this.selectedIndex !== null && this.selectedIndex > index) {
        this.selectedIndex--
      }
    },

    duplicateBlock(index: number) {
      const originalBlock = this.blocks[index]
      const newBlock = JSON.parse(JSON.stringify(originalBlock)) as Block

      // Создаем новый ID и смещаем позицию
      newBlock.id = Date.now()
      newBlock.styles.left += 20
      newBlock.styles.top += 20

      this.blocks.push(newBlock)
      this.selectedIndex = this.blocks.length - 1
    },

    exportHTML() {
      // Создаем временный div для построения HTML
      const container = document.createElement('div')

      // Собираем CSS для всех элементов
      let cssContent = ''
      this.blocks.forEach((block) => {
        const selector = `#element-${block.id}`

        // Основные стили
        cssContent += `${selector} {\n`
        Object.entries(block.styles).forEach(([key, value]) => {
          if (value !== undefined && value !== '' && !['left', 'top'].includes(key)) {
            // Преобразование camelCase в kebab-case
            const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase()
            // Добавляем px к числовым значениям (кроме fontWeight и opacity)
            const cssValue =
              typeof value === 'number' && !['font-weight', 'opacity', 'z-index'].includes(cssKey)
                ? `${value}px`
                : value
            cssContent += `  ${cssKey}: ${cssValue};\n`
          }
        })
        cssContent += '}\n\n'

        // Hover стили, если они отличаются от основных
        if (block.hoverStyles && Object.keys(block.hoverStyles).length > 0) {
          cssContent += `${selector}:hover {\n`
          Object.entries(block.hoverStyles).forEach(([key, value]) => {
            if (value !== undefined && value !== '' && value !== block.styles[key]) {
              const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase()
              const cssValue =
                typeof value === 'number' && !['font-weight', 'opacity', 'z-index'].includes(cssKey)
                  ? `${value}px`
                  : value
              cssContent += `  ${cssKey}: ${cssValue};\n`
            }
          })
          cssContent += '}\n\n'
        }
      })

      // Добавляем стили в head документа
      const styleElement = document.createElement('style')
      styleElement.textContent = cssContent

      // Добавляем элементы на страницу (без абсолютного позиционирования)
      this.blocks.forEach((block) => {
        const element = document.createElement(block.type)
        element.id = `element-${block.id}`
        element.textContent = block.content

        // Добавляем transition, если указано
        if (block.transitionTime) {
          element.style.transition = `all ${block.transitionTime}ms ease`
        }

        container.appendChild(element)
      })

      // Создаем полный HTML документ
      const html = `
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Экспортированная HTML страница</title>
  <style>
${cssContent}
  </style>
</head>
<body>
${container.innerHTML}
</body>
</html>
      `.trim()

      // Создаем элемент для копирования в буфер обмена
      const textArea = document.createElement('textarea')
      textArea.value = html
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)

      alert('HTML-страница скопирована в буфер обмена!')
    },
  },
})
</script>

<style scoped>
.html-page {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

.sidebar {
  width: 250px;
  padding: 15px;
  background: #f5f5f5;
  overflow-y: auto;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
}

.sidebar h2 {
  margin-top: 0;
  padding-bottom: 10px;
  border-bottom: 1px solid #ddd;
}

.editor-area {
  flex: 1;
  position: relative;
  overflow: hidden;
}

.properties-panel {
  width: 300px;
  padding: 15px;
  background: #f5f5f5;
  overflow-y: auto;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
}

.properties-panel h2 {
  margin-top: 0;
  padding-bottom: 10px;
  border-bottom: 1px solid #ddd;
}

.export-section {
  margin-top: auto;
  padding-top: 20px;
}

.export-btn {
  width: 100%;
  padding: 10px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  font-size: 16px;
}

.export-btn:hover {
  background-color: #45a049;
}
</style>
