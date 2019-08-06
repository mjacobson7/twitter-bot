<template>
  <div>
    <Header></Header>
    <table>
      <thead>
        <tr>
          <th>Date</th>
          <th>Screen Name</th>
          <th>Text</th>
          <th>Favorited</th>
          <th>Retweeted</th>
          <th>Followed</th>
        </tr>
      </thead>
      <tbody v-for="contest in contests" :key="contest">
        <tr>
          <td data-column="date">{{contest.date}}</td>
          <td data-column="Last Name">@{{contest.screenName}}</td>
          <td data-column="Text">{{contest.text}}</td>
          <td data-column="Favorited">{{contest.favorited}}</td>
          <td data-column="Retweeted">{{contest.retweeted}}</td>
          <td data-column="Followed">{{contest.followed}}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import Header from "./Header";

export default {
  components: {
    Header
  },
  data() {
    return {
      contests: null
    };
  },
  mounted() {
    this.$http.get("/contests").then(data => {
      this.contests = data.body;
    });
  }
};
</script>

<style scoped>
table {
  width: 750px;
  border-collapse: collapse;
  margin: 50px auto;
}
/* Zebra striping */
tr:nth-of-type(odd) {
  background: #eee;
}
th {
  background: #3498db;
  color: white;
  font-weight: bold;
}
td,
th {
  padding: 10px;
  border: 1px solid #ccc;
  text-align: left;
  font-size: 18px;
}

/* 
Max width before this PARTICULAR table gets nasty
This query will take effect for any screen smaller than 760px
and also iPads specifically.
*/
@media only screen and (max-width: 760px),
  (min-device-width: 768px) and (max-device-width: 1024px) {
  table {
    width: 100%;
  }
  /* Force table to not be like tables anymore */
  table,
  thead,
  tbody,
  th,
  td,
  tr {
    display: block;
  }

  /* Hide table headers (but not display: none;, for accessibility) */
  thead tr {
    position: absolute;
    top: -9999px;
    left: -9999px;
  }

  tr {
    border: 1px solid #ccc;
  }

  td {
    /* Behave  like a "row" */
    border: none;
    border-bottom: 1px solid #eee;
    position: relative;
    padding-left: 50%;
  }

  td:before {
    /* Now like a table header */
    position: absolute;
    /* Top/left values mimic padding */
    top: 6px;
    left: 6px;
    width: 45%;
    padding-right: 10px;
    white-space: nowrap;
    /* Label the data */
    content: attr(data-column);
    color: #3498db;
  }
}
</style>