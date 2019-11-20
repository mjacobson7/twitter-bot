<template>
  <div v-if="show" class="modal-overlay">
    <div class="modal-container">
      <div class="modal-content">
        <h1 style="margin-bottom: 10px;">{{title}}</h1>
        <slot></slot>
      </div>
      <div :class="[disabled ? 'disabled button' : 'button' ]" style="float: right; margin-top: 15px;" @click="hideModal">Ok</div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["show", "disabled", "title"],
  methods: {
    hideModal() {
      this.$emit("hide", true);
    }
  }
};
</script>

<style scoped>
.modal-overlay {
  background-color: rgba(0, 0, 0, 0.3);
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
}

.modal-container {
  background-color: #fff;
  border-radius: 4px;
  width: 600px;
  padding: 50px 50px 30px 50px;
  margin: 100px auto;
  overflow-y: scroll;
}

.modal-content {
  height: 400px;
  overflow-y: scroll;
}

@media (max-width: 800px) {
  .modal-container {
    width: auto;
  }
}

.disabled {
    opacity: 0.5;
    pointer-events: none;
}
</style>