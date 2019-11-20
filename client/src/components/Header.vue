<template>
  <div class="topnav">
    <img class="header-logo-image" src="../assets/myGoodBot-image-white.png" />
    <img class="header-logo-text" src="../assets/myGoodBot-text-white.png" />
    <span @click="logout" class="logout">Logout</span>
  </div>
</template>

<script>
export default {
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

.header-logo-image {
  height: 50px;
  margin-left: 20px;
  vertical-align: middle;
}

.header-logo-text {
  height: 35px;
  vertical-align: middle;
}

@media(max-width: 600px) {
  .header-logo-image {
    height: 40px;
  }

  .header-logo-text {
    height: 25px;
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

