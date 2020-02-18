<template>
  <div>
    <Header></Header>
    <div>
      <h3>Create Alert</h3>
      <label>
        <input v-model="message" type="text" placeholder="Type a Message" />
      </label>
      <button @click="createAlert">Send</button>
    </div>

    <div>
      <ul>
        <li v-for="alert in alerts" :key="alert._id">
          <span style="font-weight: bold;">{{alert.message}}</span>
          {{alert.createdAt}}
        </li>
      </ul>
    </div>

    <router-link to="/dashboard">Dashboard</router-link>
  </div>
</template>

<script>
import Header from "./Header";

export default {
  components: { Header },
  data() {
    return {
      message: null,
      alerts: []
    };
  },
  methods: {
    getAlerts() {
      this.$http.get("/getAdminAlerts").then(res => {
        this.alerts = res.data;
      });
    },
    createAlert() {
      this.$http.post("/createAlert", { message: this.message }).then(() => {
        this.getAlerts();
      });
    }
  },
  mounted() {
    this.getAlerts();
  }
};
</script>

<style scoped>
</style>