<template>
  <div class="props" v-if="props.block">
    <h2>Свойства</h2>

    <label>
      Текст:
      <input v-model="local.content" type="text" />
    </label>

    <label>
      Размер шрифта:
      <input v-model="local.styles.fontSize" type="text" />
    </label>

    <label>
      Цвет текста:
      <input v-model="local.styles.color" type="color" />
    </label>

    <label>
      Цвет фона:
      <input v-model="local.styles.backgroundColor" type="color" />
    </label>

    <label>
      Отступ:
      <input v-model="local.styles.padding" type="text" />
    </label>
  </div>
</template>

<script setup lang="ts">
import { watch, reactive, defineProps, defineEmits } from 'vue'

interface Block {
  id: string
  type: string
  content: string
  styles: Record<string, string>
}

const props = defineProps<{ block: Block | null }>()
const emit = defineEmits(['update'])

const local = reactive<Block>({
  id: '',
  type: '',
  content: '',
  styles: {},
})

watch(
  () => props.block,
  (val) => {
    if (val) {
      local.id = val.id
      local.type = val.type
      local.content = val.content
      local.styles = { ...val.styles }
    }
  },
  { immediate: true },
)

// Используем watch только по нужным полям, а не всему объекту
watch(
  () => ({
    content: local.content,
    styles: { ...local.styles },
  }),
  () => {
    emit('update', {
      id: local.id,
      type: local.type,
      content: local.content,
      styles: { ...local.styles },
    })
  },
  { deep: true },
)
</script>

<style scoped lang="scss">
.props {
  width: 250px;
  padding: 1rem;
  background: #f9f9f9;
  border-left: 1px solid #ccc;

  label {
    display: block;
    margin-bottom: 1rem;

    input {
      width: 100%;
      padding: 0.25rem;
      margin-top: 0.25rem;
      border: 1px solid #ccc;
      border-radius: 4px;
    }
  }
}
</style>
