<template>
  <div id="app">
    <h1>API Connection Tester</h1>
    <ApiTester />
  </div>
</template>

<script>
import ApiTester from './components/ApiTester.vue'

export default {
  name: 'App',
  components: {
    ApiTester
  }
}
</script>

<style scoped>
#app {
  font-family: Arial, sans-serif;
  text-align: center;
  margin-top: 60px;
}

h1 {
  color: #2c3e50;
}
</style>