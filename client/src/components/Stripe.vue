<template>
  <div>
    <div class="group">
      <label>
        <span>Card number</span>
        <div ref="cardNumber" id="card-number-element" class="field"></div>
      </label>
      <label>
        <span>Expiry date</span>
        <div ref="cardExpiry" id="card-expiry-element" class="field"></div>
      </label>
      <label>
        <span>CVC</span>
        <div ref="cardCvc" id="card-cvc-element" class="field"></div>
      </label>
    </div>
    <button v-on:click="purchase">Pay $5</button>
    <div class="outcome">
      <div class="error"></div>
      <div class="success">
        Success! Your Stripe token is
        <span class="token"></span>
      </div>
    </div>
  </div>
</template>

<script>
let stripe = Stripe("pk_test_LNjJFLPIJXHC0vhQLe5yR6d900GIABJ1vq");
let elements = stripe.elements();

var elementStyles = {
  base: {
    iconColor: "#666EE8",
    color: "#31325F",
    lineHeight: "40px",
    fontWeight: 300,
    fontSize: "15px",

    "::placeholder": {
      color: "#CFD7E0"
    }
  }
};

var elementClasses = {
  focus: "focus",
  empty: "empty",
  invalid: "invalid"
};

export default {
  data() {
    return {};
  },
  methods: {
    purchase() {
      stripe.createToken(this.cardNumber).then(result => {
        if (result.token) {
          this.$emit("paymentSuccess", result.token.id);
        } else {
          this.$emit("paymentFailure", result.error.message);
        }
      });
    }
  },

  mounted() {
    this.cardNumber = elements.create("cardNumber", {
      style: elementStyles,
      classes: elementClasses
    });
    this.cardNumber.mount(this.$refs.cardNumber);

    this.cardExpiry = elements.create("cardExpiry", {
      style: elementStyles,
      classes: elementClasses
    });
    this.cardExpiry.mount(this.$refs.cardExpiry);

    this.cardCvc = elements.create("cardCvc", {
      style: elementStyles,
      classes: elementClasses
    });
    this.cardCvc.mount(this.$refs.cardCvc);
  }
};
</script>


<style scoped>
* {
  font-family: "Helvetica Neue", Helvetica;
  font-size: 15px;
  font-variant: normal;
  padding: 0;
  margin: 0;
}

html {
  height: 100%;
}

body {
  background: #e6ebf1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100%;
}

form {
  width: 480px;
  margin: 20px 0;
}

.group {
  background: white;
  box-shadow: 0 7px 14px 0 rgba(49, 49, 93, 0.1),
    0 3px 6px 0 rgba(0, 0, 0, 0.08);
  border-radius: 4px;
  margin-bottom: 20px;
}

label {
  position: relative;
  color: #8898aa;
  font-weight: 300;
  height: 40px;
  line-height: 40px;
  margin-left: 20px;
  display: flex;
  flex-direction: row;
}

.group label:not(:last-child) {
  border-bottom: 1px solid #f0f5fa;
}

label > span {
  width: 120px;
  text-align: right;
  margin-right: 30px;
}

.field {
  background: transparent;
  font-weight: 300;
  border: 0;
  color: #31325f;
  outline: none;
  flex: 1;
  padding-right: 10px;
  padding-left: 10px;
  cursor: text;
}

.field::-webkit-input-placeholder {
  color: #cfd7e0;
}

.field::-moz-placeholder {
  color: #cfd7e0;
}

button {
  float: left;
  display: block;
  background: #009ed8;
  color: white;
  box-shadow: 0 7px 14px 0 rgba(49, 49, 93, 0.1),
    0 3px 6px 0 rgba(0, 0, 0, 0.08);
  border-radius: 4px;
  border: 0;
  margin-top: 20px;
  font-size: 15px;
  font-weight: 400;
  width: 100%;
  height: 40px;
  line-height: 38px;
  outline: none;
}

button:focus {
  background: #0079a5;
}

button:active {
  background: #0079a5;
}

.outcome {
  float: left;
  width: 100%;
  padding-top: 8px;
  min-height: 24px;
  text-align: center;
}

.success,
.error {
  display: none;
  font-size: 13px;
}

.success.visible,
.error.visible {
  display: inline;
}

.error {
  color: #e4584c;
}

.success {
  color: #666ee8;
}

.success .token {
  font-weight: 500;
  font-size: 13px;
}
</style>
