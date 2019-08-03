<template>
  <div class="wrapper">
    <div class="benefits">
      <h3>What you get</h3>
      <ul>
        <li>Bot will enter up to 400 contests per day</li>
        <li>Twitter insights and performance tracking</li>
        <li>The potential of winning some really cool stuff!</li>
      </ul>
    </div>

    <div class="payment">
      <h2>Monthly Plan</h2>
      <div class="fs100 pad20">$8</div>
      <p class="fs20 mar20b">/month</p>
      <router-link class="sign-up" to="/payment">Start Winning</router-link>
    </div>
  </div>
</template>

<script>
</script>

<style scoped>
.wrapper {
  display: flex;
  justify-content: center;
  margin-top: 100px;
}

.benefits {
  padding: 20px;
}

.benefits ul {
  margin-bottom: 10px;
}

.benefits ul li {
  padding: 10px;
}

.payment {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 20px;
}



.payment h3 {
  margin-bottom: 20px;
}

.sign-up {
  padding: 20px 30px;
  color: #fff;
  background-color: #000;
  border-radius: 4px;
  text-decoration: none;
}

.sign-up:hover {
  background-color: #3C3C3C;
}

</style>


