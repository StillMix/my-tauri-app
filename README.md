# 🦀🌊 My Tauri + Vue App

Кроссплатформенное десктоп-приложение, собранное с помощью **Tauri** (Rust backend) и **Vue 3** (frontend). Минимальный вес, нативная производительность и современный стек.

## 🚀 Быстрый старт

```bash
# Установка rustup (если ещё не установлен)
curl https://sh.rustup.rs -sSf | sh

# Установка CLI для Tauri
cargo install create-tauri-app
cargo install tauri-cli --version "^1"

# Создание Vue приложения
npm create vue@latest my-tauri-app
cd my-tauri-app

# Установка зависимостей
npm install --save-dev @tauri-apps/cli@^1

# Инициализация Tauri
npx tauri init

# Запуск dev-сервера
npm run tauri dev
```
