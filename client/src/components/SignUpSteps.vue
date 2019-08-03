<template>
  <div class="container">
    <div class="header-text">
      <strong>You are almost done!</strong> Complete the steps below to start winning!
    </div>

    <div class="steps-wrapper">
      <div class="step-wrapper">
        <div class="step-number" :class="{ 'active': activeStep === 1}">1</div>
        <span class="step-description">Connect Twitter Account</span>
      </div>

      <div class="step-wrapper">
        <div class="step-number" :class="{ 'active': activeStep === 2}">2</div>
        <span class="step-description">Payment Info</span>
      </div>

      <div class="step-wrapper">
        <div class="step-number" :class="{ 'active': activeStep === 3}">3</div>
        <span class="step-description">User Agreement</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["activeStep"]
};
</script>

<style scoped>
.container {
  width: 100%;
  padding: 50px 0px;
  text-align: center;
  background-color: #f4f6fc;
}

.header-text {
  font-size: 20px;
}

.steps-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
}

.step-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.step-number {
  background-color: darkgray;
  border: 4px solid transparent;
  border-radius: 50%;
  color: #fff;
  margin: 20px;
  height: 70px;
  width: 70px;
  line-height: 70px;
}

.step-description {
  color: #204060;
}

.active {
  background-color: #2988d2;
  border: 4px solid lightblue;
}
</style>

