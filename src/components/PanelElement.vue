<template>
  <div class="panel-element" draggable="true" @dragstart="handleDragStart">
    <slot />
  </div>
</template>

<script lang="ts">
export default {
  name: 'PanelElement',
  props: {
    type: { type: String, required: true },
    defaultContent: { type: String, default: '' },
    defaultStyles: {
      type: Object,
      default: () => ({
        width: 100,
        height: 100,
        padding: 0,
        color: '#000',
        backgroundColor: 'transparent',
      }),
    },
  },
  methods: {
    handleDragStart(event) {
      const payload = {
        type: this.type,
        content: this.defaultContent,
        styles: this.defaultStyles,
      }
      event.dataTransfer.setData('application/json', JSON.stringify(payload))
    },
  },
}
</script>

<style scoped lang="scss">
.panel-element {
  cursor: grab;
  width: 200px;
  padding: 1rem;
  background: #f4f4f4;
  border-right: 1px solid #ccc;
  h2 {
    margin-bottom: 1rem;
  }
  &__item {
    padding: 0.5rem;
    margin-bottom: 0.5rem;
    background: #fff;
    border: 1px solid #ddd;
    cursor: grab;
    text-align: center;
    &:hover {
      background: #eaeaea;
    }
  }
}
</style>
