<template>
  <div>
    <h2>API Tester</h2>
    <button @click="testConnection">Test Connection</button>
    <p>{{ connectionStatus }}</p>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      connectionStatus: ''
    }
  },
  methods: {
    async testConnection() {
      try {
        const response = await axios.get('http://localhost:3000/api/test')
        this.connectionStatus = 'Connection successful: ' + response.data.message
      } catch (error) {
        this.connectionStatus = 'Connection failed: ' + error.message
      }
    }
  }
}
</script>