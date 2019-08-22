<template>
  <div>
    <SignUpSteps :active-step="activeStep"></SignUpSteps>

    <div
      v-if="activeStep == 1"
      style="display: flex; justify-content: center; align-items: center; margin-top: 20px;"
    >
      <a class="twitter-login" href="/auth/twitter">
        <i class="icon fa fa-twitter"></i>Connect Twitter Account
      </a>
    </div>

    <div class="payment-details-container" v-if="activeStep == 2">
      <!-- <h1 style="text-align: center; margin: 15px 0;">Welcome @{{user.username}}!</h1>
      <h3 style="text-align: center; margin: 15px 0;">You're almost there!</h3>-->
      <Stripe @paymentSuccess="onPaymentSuccess" @paymentFailure="onPaymentFailure"></Stripe>
      <p>{{error}}</p>
    </div>

    <div v-if="activeStep == 3">
      <p>Terms of use</p>
      <router-link to="/dashboard">Agree</router-link>
    </div>
  </div>
</template>

<script>
import Stripe from "./Stripe";
import SignUpSteps from "./SignUpSteps";

export default {
  components: {
    Stripe,
    SignUpSteps
  },
  data() {
    return {
      user: null,
      activeStep: 1,
      error: null
    };
  },
  methods: {
    onPaymentSuccess(tokenId) {
      if (tokenId) {
        this.activeStep = 3;
      }
    },
    onPaymentFailure(message) {
      this.error = message;
    }
  },
  mounted() {
    let that = this;
    this.$http.get("/getAuthenticatedUser").then(data => {
      if (data.body) {
        this.user = data.body;
        this.activeStep = 2;
        // that.$router.push('dashboard');
      } else {
        this.activeStep = 1;
      }
    });
  }
};
</script>

<style scoped>
.twitter-login {
  width: auto;
  display: inline-block;
  padding: 0 18px 0 6px;
  border: 0 none;
  border-radius: 5px;
  text-decoration: none;
  transition: all 250ms linear;
  color: white;
  height: 50px;
  line-height: 50px;
  position: relative;
  text-align: left;
  background-color: #3b94d9;
  border: 1px solid #257abc;
  margin: 20px;
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

.payment-details-container {
  max-width: 50%;
  margin: 0 auto;
}

@media screen and (max-width: 1200px) {
  .payment-details-container {
    max-width: 80%;
  }
}
</style>
