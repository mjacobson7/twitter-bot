<template>
  <div class="card" :style="{ backgroundColor: color }">
    <div class="card-body">
      <div class="icon-container">
        <img :src="require(`../assets/${icon}`)" />
      </div>
      <div class="content-container">
        <div>{{title}}</div>
        <div class="value">{{value}}</div>
      </div>
    </div>
  </div>
</template>


<script>
export default {
  props: ["color", "title", "value", "icon"],
  data() {
    return {};
  }
};
</script>

<style scoped>
.card {
  border-radius: 0px;
  margin: 7px;
  box-shadow: 0px 1px 15px 1px rgba(69, 65, 78, 0);
  width: 320px;
  height: 100%;
}

.card-body {
  padding: 15px;
  color: #ffffff;
  font-weight: bold;
}

.icon-container {
  display: inline-block;
  padding: 10px;
  vertical-align: middle;
}

.content-container {
  vertical-align: middle;
  display: inline-block;
  padding-left: 15px;
}

.value {
    font-size: 25px;
    margin-top: 10px;
}
</style>