<template>
  <div>
    <Header :authenticated="false"></Header>
    <div class="login-box">
      <a class="twitter-login" href="/auth/twitter">
        <i class="icon fa fa-twitter"></i>Login with Twitter
      </a>
    </div>
  </div>
</template>

<script>
import Header from "./Header";
export default {
  components: {
    Header
  }
};
</script>

<style scoped>
.login-box {
  margin-top: 70px;
  background-color: #fff;
  border-radius: 6px;
  -webkit-box-shadow: 0px 10px 50px -30px rgba(0, 0, 0, 1);
  -moz-box-shadow: 0px 10px 50px -30px rgba(0, 0, 0, 1);
  box-shadow: 0px 10px 50px -30px rgba(0, 0, 0, 1);
  padding-left: 0px;
  padding: 50px 30px;
  position: relative;
  text-align: left;
  max-width: 400px;
  margin: 100px auto;
}

h2 {
  text-align: center;
  padding: 20px;
}

.twitter-login {
  display: block;
  width: 50%;
  margin: 0 auto;
  padding: 0 18px 0 6px;
  border: 0 none;
  border-radius: 5px;
  text-decoration: none;
  transition: all 250ms linear;
  color: white;
  height: 50px;
  line-height: 50px;
  text-align: left;
  background-color: #3b94d9;
  border: 1px solid #257abc;
}

@media(max-width: 600px) {
  .twitter-login {
    width: 60%;
  }
}

.twitter-login:hover {
  text-decoration: none;
}
.twitter-login:hover {
  background-color: #2988d2;
}
.twitter-login .icon {
  margin-right: 12px;
  font-size: 24px;
  line-height: 24px;
  width: 42px;
  height: 24px;
  text-align: center;
  display: inline-block;
  position: relative;
  top: 4px;
  border-right: 1px solid #257abc;
}
.twitter-login .icon:before {
  display: inline-block;
  width: 40px;
}

.twitter-login .icon:after {
  content: "";
  border-right: 1px solid #66abe1;
}
</style>


