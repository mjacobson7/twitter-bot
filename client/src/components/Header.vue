<template>
  <div class="topnav">
    <img class="header-logo" src="../assets/logo.png" />
    <span v-if="user" @click="logout" class="logout">Logout</span>
  </div>
</template>

<script>
export default {
  props: ['user'],
  methods: {
    logout() {
      this.$http.get("/logout").then(() => {
        this.$router.push("/");
      });
    }
  }
};
</script>

<style scoped>
.topnav {
  overflow: hidden;
  background-color: #343a40;
  line-height: 68px;
  margin-bottom: 20px;
}

.header-logo {
  height: 50px;
  margin-left: 20px;
  margin-bottom: 5px;
  vertical-align: middle;
}

@media(max-width: 600px) {
  .header-logo {
    height: 40px;
  }

  .logout {
    padding: 0 30px !important;
  }

 }

.logout {
  float: right;
  padding: 0 50px;
  color: #fff;
  cursor: pointer;
  background-color: #505861;
}

.logout:hover {
  background-color: #191a1b;
}
</style>

