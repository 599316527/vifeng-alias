<template>
  <div class="error-page">
    <h1 v-if="error.statusCode === 404">404 页面不存在</h1>
    <h1 v-else>应用发生错误异常</h1>
  </div>
</template>

<script>
export default {
  props: ['error'],
  layout: 'default'
}
</script>

<style>
.error-page {
  min-height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
