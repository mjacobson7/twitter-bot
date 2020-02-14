<template>
  <div style="background-color: #F4F6FC;">
    <Header user="user"></Header>
    <div style class="dashboardData">
      <div>
        <div class="contestData" v-if="user">
          <p>User: {{user.username}}</p>
          <p>Days Remaining: {{user.daysRemaining}}</p>
          <p>Contests Entered Today: {{user.contestsEntered}}</p>
        </div>
        <div v-if="loading">
          <img style="height: 186px;" src="../assets/loading.gif" />
        </div>
      </div>

     
    </div>
  </div>
</template>

<script>
import Header from "./Header";

export default {
  components: {
    Header
  },
  data() {
    return {
      user: null,
      loading: true,
      showFaq: false,
      termsAccepted: false,
      showPrivacyPolicy: false
    };
  },
  methods: {
    logout() {
      let that = this;
      this.$http.get("/logout").then(() => {
        that.$router.push("/");
      });
    },
    getUser() {
      this.$http.get("/getAuthenticatedUser").then(data => {
        if (data.body) {
          this.loading = false;
          this.user = data.body;
        } else {
          this.logout();
        }
      });
    }
  },
  mounted() {
    this.getUser();
  }
};
</script>

<style scoped>
[v-cloak] {
  display: none;
}

.question {
  text-align: left;
}

.answer {
  text-align: left;
  font-weight: 100 !important;
}

.dashboardData {
  padding: 20px;
  text-align: center;
  background-color: #fff;
  margin: 50px auto;
  border-radius: 5px;
  border: 1px solid #dedede;
  max-width: 800px;
}

.dashboardData .contestData p {
  font-weight: bold;
  padding: 10px;
  font-size: 20px;
}

.privacy-policy {
  display: block;
  padding-top: 10px;
  cursor: pointer;
  color: #0c83cc;
}

.privacy-policy:hover {
  color: #10689e;
}
</style>