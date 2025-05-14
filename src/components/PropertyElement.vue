<template>
  <div class="property-element">
    <!-- Основные свойства -->
    <div class="section">
      <h3>Основное</h3>

      <!-- Содержимое элемента -->
      <div class="field">
        <label>Содержимое</label>
        <input type="text" v-model="localContent" @input="updateContent" />
      </div>

      <!-- Размеры -->
      <div class="field-row">
        <div class="field">
          <label>Ширина (px)</label>
          <input type="number" v-model.number="localStyles.width" min="10" />
        </div>
        <div class="field">
          <label>Высота (px)</label>
          <input type="number" v-model.number="localStyles.height" min="10" />
        </div>
      </div>

      <!-- Отступы -->
      <div class="field-row">
        <div class="field">
          <label>Отступ (px)</label>
          <input type="number" v-model.number="localStyles.padding" min="0" />
        </div>
        <div class="field">
          <label>Скругление (px)</label>
          <input type="number" v-model.number="localStyles.borderRadius" min="0" />
        </div>
      </div>
    </div>

    <!-- Оформление -->
    <div class="section">
      <h3>Оформление</h3>

      <!-- Цвета -->
      <div class="field">
        <label>Цвет текста</label>
        <div class="color-field">
          <input type="color" v-model="localStyles.color" />
          <input type="text" v-model="localStyles.color" />
        </div>
      </div>

      <div class="field">
        <label>Цвет фона</label>
        <div class="color-field">
          <input type="color" v-model="localStyles.backgroundColor" />
          <input
            type="text"
            v-model="localStyles.backgroundColor"
            placeholder="цвет или transparent"
          />
        </div>
      </div>

      <!-- Шрифт -->
      <div class="field-row">
        <div class="field">
          <label>Размер шрифта (px)</label>
          <input type="number" v-model.number="localStyles.fontSize" min="8" />
        </div>
        <div class="field">
          <label>Жирность</label>
          <select v-model="localStyles.fontWeight">
            <option value="normal">Normal</option>
            <option value="bold">Bold</option>
            <option value="lighter">Lighter</option>
            <option value="bolder">Bolder</option>
            <option value="100">100</option>
            <option value="200">200</option>
            <option value="300">300</option>
            <option value="400">400</option>
            <option value="500">500</option>
            <option value="600">600</option>
            <option value="700">700</option>
            <option value="800">800</option>
            <option value="900">900</option>
          </select>
        </div>
      </div>

      <!-- Выравнивание -->
      <div class="field">
        <label>Выравнивание текста</label>
        <select v-model="localStyles.textAlign">
          <option value="left">По левому краю</option>
          <option value="center">По центру</option>
          <option value="right">По правому краю</option>
          <option value="justify">По ширине</option>
        </select>
      </div>

      <!-- Границы -->
      <div class="field">
        <label>Граница</label>
        <div class="field-row">
          <input
            type="number"
            v-model.number="localStyles.borderWidth"
            min="0"
            placeholder="Ширина"
          />
          <select v-model="localStyles.borderStyle">
            <option value="none">Нет</option>
            <option value="solid">Сплошная</option>
            <option value="dashed">Пунктирная</option>
            <option value="dotted">Точечная</option>
          </select>
          <input type="color" v-model="localStyles.borderColor" />
        </div>
      </div>
    </div>

    <!-- Секция hover-эффектов -->
    <div class="section">
      <h3>
        Эффект при наведении
        <button class="toggle-btn" @click="toggleHoverSection">
          {{ hoverSectionOpen ? '▼' : '►' }}
        </button>
      </h3>

      <div v-if="hoverSectionOpen" class="hover-section">
        <div class="field">
          <label>Цвет текста при наведении</label>
          <div class="color-field">
            <input type="color" v-model="localHoverStyles.color" />
            <input type="text" v-model="localHoverStyles.color" />
          </div>
        </div>

        <div class="field">
          <label>Цвет фона при наведении</label>
          <div class="color-field">
            <input type="color" v-model="localHoverStyles.backgroundColor" />
            <input type="text" v-model="localHoverStyles.backgroundColor" />
          </div>
        </div>

        <div class="field">
          <label>Граница при наведении</label>
          <div class="field-row">
            <input
              type="number"
              v-model.number="localHoverStyles.borderWidth"
              min="0"
              placeholder="Ширина"
            />
            <select v-model="localHoverStyles.borderStyle">
              <option value="none">Нет</option>
              <option value="solid">Сплошная</option>
              <option value="dashed">Пунктирная</option>
              <option value="dotted">Точечная</option>
            </select>
            <input type="color" v-model="localHoverStyles.borderColor" />
          </div>
        </div>

        <div class="field">
          <label>Переход (мс)</label>
          <input
            type="number"
            v-model.number="transitionTime"
            min="0"
            max="1000"
            step="50"
            @input="updateTransition"
          />
        </div>
      </div>
    </div>

    <!-- Кнопка экспорта CSS -->
    <div class="section">
      <button class="export-btn" @click="exportCSS">Экспорт CSS</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue'

// Типы данных
interface StyleProps {
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

// Деструктурируем props и emit
const props = defineProps({
  block: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['update', 'updateContent'])

// Состояние для отображения секции hover-эффектов
const hoverSectionOpen = ref(false)

// Локальное содержимое блока
const localContent = ref(props.block.content || '')

// Копируем block.styles в реактивный объект
const localStyles = reactive<StyleProps>({
  ...props.block.styles,
  borderRadius: props.block.styles.borderRadius || 0,
  fontSize: props.block.styles.fontSize || 16,
  fontWeight: props.block.styles.fontWeight || 'normal',
  textAlign: props.block.styles.textAlign || 'left',
  borderWidth: props.block.styles.borderWidth || 0,
  borderStyle: props.block.styles.borderStyle || 'none',
  borderColor: props.block.styles.borderColor || '#000000',
})

// Стили для hover-эффекта
const localHoverStyles = reactive<Partial<StyleProps>>({
  color: props.block.hoverStyles?.color || localStyles.color,
  backgroundColor: props.block.hoverStyles?.backgroundColor || localStyles.backgroundColor,
  borderWidth: props.block.hoverStyles?.borderWidth || localStyles.borderWidth,
  borderStyle: props.block.hoverStyles?.borderStyle || localStyles.borderStyle,
  borderColor: props.block.hoverStyles?.borderColor || localStyles.borderColor,
})

// Время для transition
const transitionTime = ref(props.block.transitionTime || 200)

// Переключает открытие/закрытие секции hover
function toggleHoverSection() {
  hoverSectionOpen.value = !hoverSectionOpen.value
}

// Обновляет время перехода
function updateTransition() {
  localStyles.transition = `all ${transitionTime.value}ms ease`
  updateStyles()
}

// Обновляет содержимое элемента
function updateContent() {
  emit('updateContent', localContent.value)
}

// Генерирует и экспортирует CSS
function exportCSS() {
  const selector = `#element-${props.block.id}`
  let css = `${selector} {\n`

  // Основные стили
  Object.entries(localStyles).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      // Преобразование camelCase в kebab-case
      const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase()
      // Добавляем px к числовым значениям (кроме fontWeight и opacity)
      const cssValue =
        typeof value === 'number' && !['font-weight', 'opacity', 'z-index'].includes(cssKey)
          ? `${value}px`
          : value
      css += `  ${cssKey}: ${cssValue};\n`
    }
  })
  css += '}\n\n'

  // Hover стили
  if (Object.keys(localHoverStyles).some((key) => localHoverStyles[key] !== localStyles[key])) {
    css += `${selector}:hover {\n`
    Object.entries(localHoverStyles).forEach(([key, value]) => {
      if (value !== undefined && value !== '' && value !== localStyles[key]) {
        const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase()
        const cssValue =
          typeof value === 'number' && !['font-weight', 'opacity', 'z-index'].includes(cssKey)
            ? `${value}px`
            : value
        css += `  ${cssKey}: ${cssValue};\n`
      }
    })
    css += '}\n'
  }

  // Создаем элемент для копирования в буфер обмена
  const textArea = document.createElement('textarea')
  textArea.value = css
  document.body.appendChild(textArea)
  textArea.select()
  document.execCommand('copy')
  document.body.removeChild(textArea)

  alert('CSS скопирован в буфер обмена!')
}

// При любом изменении localStyles шлём событие наверх
function updateStyles() {
  const stylesUpdate = { ...localStyles }
  const hoverStylesUpdate = { ...localHoverStyles }

  emit('update', {
    styles: stylesUpdate,
    hoverStyles: hoverStylesUpdate,
    transitionTime: transitionTime.value,
  })
}

// Наблюдаем за изменениями в стилях
watch(localStyles, () => updateStyles(), { deep: true })

// Наблюдаем за изменениями hover-стилей
watch(localHoverStyles, () => updateStyles(), { deep: true })

// Если props.block.styles вдруг изменится целиком — синхронизируем
watch(
  () => props.block.styles,
  (newStyles) => {
    Object.assign(localStyles, newStyles)
  },
  { deep: true },
)

// Если контент изменился извне - обновляем
watch(
  () => props.block.content,
  (newContent) => {
    localContent.value = newContent || ''
  },
)
</script>

<style scoped>
.property-element {
  padding: 10px;
  overflow-y: auto;
  max-height: 100%;
}

.section {
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}

.section h3 {
  margin-top: 0;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.field {
  margin-bottom: 10px;
}

.field-row {
  display: flex;
  gap: 10px;
}

.field-row .field {
  flex: 1;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  font-size: 0.9em;
}

input,
select {
  width: 100%;
  padding: 6px;
  box-sizing: border-box;
  border: 1px solid #ddd;
  border-radius: 4px;
}

input[type='color'] {
  padding: 2px;
  width: 40px;
  height: 25px;
}

.color-field {
  display: flex;
  gap: 5px;
}

.color-field input[type='text'] {
  flex: 1;
}

.toggle-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1em;
}

.hover-section {
  margin-top: 10px;
  padding: 10px;
  background-color: #f5f5f5;
  border-radius: 4px;
}

.export-btn {
  width: 100%;
  padding: 8px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.export-btn:hover {
  background-color: #3da576;
}
</style>
