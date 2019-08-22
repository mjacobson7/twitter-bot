<template>
  <div class="topnav">
    <a v-if="authenticated" @click="toggleDropdown">
      My Account
      <img
        v-bind:class="{ active: isOpen }"
        class="dropdown-arrow"
        src="../assets/dropdown-arrow.png"
      />
    </a>
  </div>
</template>

<script>
export default {
  props: ['authenticated'],
  data() {
    return {
      isOpen: false
    };
  },
  methods: {
    toggleDropdown() {
      this.isOpen = !this.isOpen;
      this.$emit("dropdown", this.isOpen);
    }
  }
};
</script>

<style scoped>
.dropdown-arrow {
  vertical-align: sub;
  margin-left: 5px;
  transform: rotate(180deg);
}

.active {
  transform: rotate(0deg);
}

.topnav {
  overflow: hidden;
  background-color: #343a40;
  height: 68px;
}

.topnav a {
  float: right;
  color: rgba(255, 255, 255, 0.5);
  text-align: center;
  padding: 22px 30px;
  text-decoration: none;
  font-size: 17px;
  cursor: pointer;
}

.topnav a:hover {
  color: #fff;
}

.topnav a.active {
  background-color: #009ed8;
  color: white;
}
</style>

