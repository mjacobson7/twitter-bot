<template>
  <div class="landing-container">
    <div class="bg-img"></div>
    <div class="call-to-action">
      <h3 class="title">Win Twitter Contests Automatically</h3>

      <router-link to="/subscribe" class="button">Try it now!</router-link>


    </div>
  </div>
</template>

<script>
export default {};
</script>


<style scoped>
.landing-container {
  height: 681px;
  position: relative;
}
.bg-img {
  width: 100%;
  height: 100%;
  background: url("../assets/laughing-laptop.jpg") center center no-repeat;
  background-size: cover;
}

.bg-img:before {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.6);
}

.call-to-action {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.title {
  font-size: 50px;
  color: #fff;
  margin-bottom: 30px;
}

.button {
  font-size: 18px;
  cursor: pointer;
  display: inline-block;
  position: relative;
  padding: 0.8em 1.4em;
  padding-right: 4.7em;
  background: #009ed8;
  border: none;
  color: white;
  transition: 0.2s;
  min-width: 11em;
  text-decoration: none;
}
.button:before,
.button:after {
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  padding-top: inherit;
  padding-bottom: inherit;
  width: 2.8em;
  content: "\00a0";
  font-family: "FontAwesome", sans-serif;
  font-size: 1.2em;
  text-align: center;

  transition: 0.2s;
  transform-origin: 50% 60%;
  background: rgba(0, 0, 0, 0.1);
}

.button:hover {
  background: #0079a5;
}
.button:active,
.button:focus {
  background: #002e3f;
  outline: none;
}

.button:after {
  content: "\F054";
}

.button:hover:after {
  -webkit-animation: bounceright 0.3s alternate ease infinite;
  animation: bounceright 0.3s alternate ease infinite;
}

@-webkit-keyframes bounceright {
  from {
    -webkit-transform: translateX(0);
  }
  to {
    -webkit-transform: translateX(3px);
  }
}

@-webkit-keyframes wiggle {
  from {
    -webkit-transform: rotate(0deg);
  }
  to {
    -webkit-transform: rotate(30deg);
  }
}

@keyframes bounceright {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(3px);
  }
}

@keyframes wiggle {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(30deg);
  }
}
</style>