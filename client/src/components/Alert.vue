<template>
  <div class="alert-container">
    <div class="content-container">
      <img src="../assets/alert.png" />

      <span class="message">{{alert.message}}</span>
      <span class="date">{{alert.createdAt | moment}}</span>
      <span @click="dismiss(alert._id)" class="close">&#10006;</span>
    </div>
  </div>
</template>

<script>
import moment from "moment";

export default {
  props: ["alert"],
  methods: {
    dismiss(id) {
      this.$emit("dismiss", id);
    }
  },
  filters: {
    moment: date => {
      return moment(date).format("MMMM Do YYYY");
    }
  }
};
</script>

<style scoped>
.alert-container {
  background-color: #cce5ff;
  border: 1px solid #b8daff;
  padding: 0.75rem 1.25rem;
  border-radius: 7px;
  width: 80%;
  margin: 10px auto;
}

.content-container {
  display: flex;
  align-items: center;
  color: #004085;
}

.content-container img {
  height: 30px;
  padding-right: 15px;
}

.content-container .message {
  width: 80%;
  margin-right: 50px;
}

.content-container .date {
  margin-left: auto;
}

.content-container .close {
  color: #004085;
  margin-left: 10px;
  cursor: pointer;
}

.content-container .close:hover {
  color: #0d6ace;
}

@media screen and (max-width: 768px) {
  .content-container {
    flex-direction: column;
  }

  .content-container img {
    margin-bottom: 10px;
  }

  .content-container .message {
    width: 100%;
    margin-right: 0;
  }

  .content-container .date {
    margin-left: unset;
    padding: 10px;
  }
}
</style>