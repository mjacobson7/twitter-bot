<template>
  <div>
    <div ref="cardNumber"></div>
    <div ref="cardExpiry"></div>
    <div ref="cardCvc"></div>
    <button v-on:click="purchase">Purchase</button>
  </div>
</template>

<script>
let stripe = Stripe("pk_test_LNjJFLPIJXHC0vhQLe5yR6d900GIABJ1vq");
let elements = stripe.elements();

var elementStyles = {
  base: {
    color: "#fff",
    fontWeight: 600,
    fontFamily: "Quicksand, Open Sans, Segoe UI, sans-serif",
    fontSize: "16px",
    fontSmoothing: "antialiased",

    ":focus": {
      color: "#424770"
    },

    "::placeholder": {
      color: "#9BACC8"
    },

    ":focus::placeholder": {
      color: "#CFD7DF"
    }
  },
  invalid: {
    color: "#fff",
    ":focus": {
      color: "#FA755A"
    },
    "::placeholder": {
      color: "#FFCCA5"
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
          this.$emit("paymentFailure", result.error.message)
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