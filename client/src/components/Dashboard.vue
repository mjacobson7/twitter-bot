<template>
  <div style="background-color: #F4F6FC;">
    <Header user="user"></Header>

    <div style class="dashboardData">
      <div>
        <div class="contestData" v-if="user">
          <p>Welcome {{user.username}}!</p>
        </div>
        <div v-if="loading">
          <img style="height: 186px;" src="../assets/loading.gif" />
        </div>
      </div>
    </div>

    <div v-if="!loading" style="display: flex; flex-wrap: wrap; justify-content: center;">
      <Card color="#FBAD4C" title="Days Remaining" :value="user.daysRemaining" icon="calendar.png"></Card>
      <Card
        color="#59D05D"
        title="Contests Entered Today"
        :value="user.contestsEntered"
        icon="trophy.png"
      ></Card>
      <Card
        color="#FF646D"
        title="Total Contests Entered"
        :value="user.totalContestsEntered"
        icon="leaderboard.png"
      ></Card>
      <Card
        color="#1D62F0"
        title="Contests Remaining Today"
        :value="contestsRemaining"
        icon="clock.png"
      ></Card>
    </div>

    <!-- <h2 style="text-align: center; margin-top: 50px;">Frequencly asked questions</h2>
    <div style="display: flex; justify-content: center; flex-direction: column;">
      <Faq question="How do I fix a locked or limited Twitter account?">
        <p>heyo</p>
      </Faq>

      <Faq question="How do I fix a locked or limited Twitter account?">
        <p>heyo</p>
      </Faq>
    </div> -->
  </div>
</template>

<script>
import Header from "./Header";
import Card from "./Card";
import Faq from "./Faq";

export default {
  components: {
    Header,
    Card,
    Faq
  },
  data() {
    return {
      user: null,
      contestsRemaining: null,
      loading: true
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
          this.user = data.body.user;
          this.contestsRemaining = data.body.contestsRemaining;
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
  padding: 10px;
  text-align: center;
}

.dashboardData .contestData p {
  font-weight: bold;
  padding: 10px;
  font-size: 20px;
}
</style>