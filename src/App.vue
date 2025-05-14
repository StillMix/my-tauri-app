<template>
  <div class="app">
    <h1>{{ message }}</h1>
    <input v-model="name" placeholder="Введите имя" />
    <button @click="callGreet">Поздороваться</button>
  </div>
</template>


<script setup lang="ts">
import { ref } from 'vue'
import { invoke } from '@tauri-apps/api/tauri'


const name = ref('')
const message = ref('Привет из Vue + Tauri!')

const callGreet = async () => {
  if (name.value.trim() === '') {
    message.value = 'Введите имя';
    return;
  }

  try {
    const response = await invoke('greet', { name: name.value });
    message.value = response;
  } catch (err) {
    console.error('Ошибка вызова greet:', err);
    message.value = 'Произошла ошибка';
  }
}

</script>
<style>
.app {
  padding: 2rem;
  font-family: sans-serif;
}
</style>
