<template>
  <div class="faq-container">
    <div>
      <div class="question-container">
        <p>{{question}}</p>
      </div>
    </div>
    <div>
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: ["question"]
};
</script>


<style scoped>
    .faq-container {
        margin: auto;
    }

    .question-container {
        padding: 30px;
        background-color: #EEE;
        margin-top: 20px;
    }
</style>