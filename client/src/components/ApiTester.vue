<template>
  <div class="test-page">
    <h1>System Configuration and API Test Page</h1>
    <div v-if="loading">Loading...</div>
    <div v-else>
      <p><strong>Client:</strong> {{ clientInfo }}</p>
      <p><strong>Server:</strong> {{ serverInfo }}</p>
      <p><strong>Database:</strong> {{ databaseInfo }}</p>
      <p><strong>Database URI:</strong> {{ databaseURI }}</p>
      <p><strong>Counter:</strong> {{ counter }}</p>
      <p><strong>API Connection Status:</strong> {{ connectionStatus }}</p>
      <button @click="incrementCounter">Increment Counter</button>
      <button @click="testConnection">Test API Connection</button>
      <button @click="fetchCounter">Fetch Counter from Database</button>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "TestPage",
  data() {
    return {
      loading: true,
      clientInfo: `Running on ${window.location.origin}`,
      serverInfo: "",
      databaseInfo: "",
      databaseURI: "",
      counter: 0,
      connectionStatus: "",
      apiUrl:
        process.env.VUE_APP_USE_CLOUD === "true"
          ? process.env.VUE_APP_API_URL_CLOUD
          : process.env.VUE_APP_API_URL_LOCAL,
    };
  },
  async mounted() {
    await this.fetchInfo();
    await this.fetchCounter();
  },
  methods: {
    async fetchInfo() {
      try {
        const response = await fetch(`${this.apiUrl}/api/test-page`);
        const data = await response.json();
        this.serverInfo =
          data.serverLocation || "Error: Undefined server location";
        this.databaseInfo = data.databaseLocation || "Unknown";
        this.databaseURI = data.databaseURI || "Unknown";
        this.loading = false;
      } catch (error) {
        console.error("Error fetching configuration:", error);
        this.serverInfo = "Error connecting to server";
        this.databaseInfo = "Unknown";
        this.databaseURI = "Unknown";
        this.loading = false;
      }
    },
    async incrementCounter() {
      try {
        const response = await axios.post(
          `${this.apiUrl}/api/counter/increment`
        );
        this.counter = response.data.value;
      } catch (error) {
        console.error("Error incrementing counter:", error);
      }
    },
    async fetchCounter() {
      try {
        const response = await axios.get(`${this.apiUrl}/api/counter`);
        this.counter = response.data.value;
      } catch (error) {
        console.error("Error fetching counter:", error);
      }
    },
    async testConnection() {
      try {
        const response = await axios.get(`${this.apiUrl}/api/test`);
        this.connectionStatus =
          "Connection successful: " + response.data.message;
      } catch (error) {
        this.connectionStatus = "Connection failed: " + error.message;
      }
    },
  },
};
</script>

<style scoped>
.test-page {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
button {
  padding: 10px 20px;
  margin-top: 20px;
  font-size: 16px;
  cursor: pointer;
}
</style>
