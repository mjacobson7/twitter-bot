<template>
  <div style="background-color: #F4F6FC; position: relative;">
    <Header @dropdown="onDropdownToggle"></Header>
    <div
      v-bind:class="{active: headerDropdownOpen}"
      style="width: 177px; background-color: #343a40; position: absolute; top: 68px; right: 0; display: none;"
    >
      <router-link to="/dashboard" class="header-dropdown-item">Dashboard</router-link>
      <router-link to="/my-account" class="header-dropdown-item">My Account</router-link>
      <div @click="logout()" class="header-dropdown-item">Log Out</div>
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
      headerDropdownOpen: false
    };
  },
  methods: {
    onDropdownToggle(value) {
      this.headerDropdownOpen = value;
    },
    logout() {
      let that = this;
      this.$http.get("/logout").then(data => {
        that.$router.push("/login");
      });
    }
  }
};
</script>

<style scoped>
.active {
  display: block !important;
}
.header-dropdown-item {
  color: rgba(255, 255, 255, 0.5);
  width: 100%;
  padding: 20px;
  cursor: pointer;
  text-decoration: none;
  display: block;
}
.header-dropdown-item:hover {
  background-color: rgba(255, 255, 255, 0.5);
  color: #f4f6fc;
}
</style>