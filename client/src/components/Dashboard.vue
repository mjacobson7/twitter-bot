<template>
  <div>
    <Header></Header>

    <table class="responsive-table">
      <thead>
        <tr>
          <th scope="col">Date</th>
          <th scope="col">Screen Name</th>
          <th scope="col">Tweet Link</th>
          <th scope="col">Favorited</th>
          <th scope="col">Retweeted</th>
          <th scope="col">Followed</th>
        </tr>
      </thead>
      <tbody v-for="contest in contests" :key="contest">
        <tr>
          <th scope="row">{{moment(contest.date).local().format('lll')}}</th>
          <td data-title="Screen Name">@{{contest.screenName}}</td>
          <td data-title="Tweet Link"><a :href="'https://twitter.com/tweet/status/' + contest._id" target="_blank">Link</a></td>
          <td data-title="Favorited">{{contest.favorited}}</td>
          <td data-title="Retweeted">{{contest.retweeted}}</td>
          <td data-title="Followed">{{contest.followed}}</td>
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
.responsive-table {
  width: 100%;
  margin-bottom: 1.5em;
}
.responsive-table thead {
  position: absolute;
  clip: rect(1px 1px 1px 1px);
  /* IE6, IE7 */
  clip: rect(1px, 1px, 1px, 1px);
  padding: 0;
  border: 0;
  height: 1px;
  width: 1px;
  overflow: hidden;
}
.responsive-table thead th {
  background-color: #1d96b2;
  border: 1px solid #1d96b2;
  font-weight: normal;
  text-align: center;
  color: white;
}
.responsive-table thead th:first-of-type {
  text-align: left;
}
.responsive-table tbody,
.responsive-table tr,
.responsive-table th,
.responsive-table td {
  display: block;
  padding: 0;
  text-align: left;
  white-space: normal;
}
.responsive-table th,
.responsive-table td {
  padding: 0.5em;
  vertical-align: middle;
}
.responsive-table caption {
  margin-bottom: 1em;
  font-size: 1em;
  font-weight: bold;
  text-align: center;
}
.responsive-table tfoot {
  font-size: 0.8em;
  font-style: italic;
}
.responsive-table tbody tr {
  margin-bottom: 1em;
  border: 2px solid #1d96b2;
}
.responsive-table tbody tr:last-of-type {
  margin-bottom: 0;
}
.responsive-table tbody th[scope="row"] {
  background-color: #1d96b2;
  color: white;
}
.responsive-table tbody td[data-type="currency"] {
  text-align: right;
}
.responsive-table tbody td[data-title]:before {
  content: attr(data-title);
  float: left;
  font-size: 0.8em;
  color: rgba(94, 93, 82, 0.75);
}
.responsive-table tbody td {
  text-align: right;
  border-bottom: 1px solid #1d96b2;
}

@media (min-width: 52em) {
  .responsive-table {
    font-size: 0.9em;
  }
  .responsive-table thead {
    position: relative;
    clip: auto;
    height: auto;
    width: auto;
    overflow: auto;
  }
  .responsive-table tr {
    display: table-row;
  }
  .responsive-table th,
  .responsive-table td {
    display: table-cell;
    padding: 0.5em;
  }

  .responsive-table caption {
    font-size: 1.5em;
  }
  .responsive-table tbody {
    display: table-row-group;
  }
  .responsive-table tbody tr {
    display: table-row;
    border-width: 1px;
  }
  .responsive-table tbody tr:nth-of-type(even) {
    background-color: rgba(94, 93, 82, 0.1);
  }
  .responsive-table tbody th[scope="row"] {
    background-color: transparent;
    color: #5e5d52;
    text-align: left;
  }
  .responsive-table tbody td {
    text-align: center;
  }
  .responsive-table tbody td[data-title]:before {
    content: none;
  }
}
@media (min-width: 62em) {
  .responsive-table {
    font-size: 1em;
  }
  .responsive-table th,
  .responsive-table td {
    padding: 0.75em 0.5em;
  }
  .responsive-table tfoot {
    font-size: 0.9em;
  }
}

@media (min-width: 75em) {
  .responsive-table th,
  .responsive-table td {
    padding: 0.75em;
  }
}
</style>