<template>
  <div style="background-color: #F4F6FC;">
    <Header></Header>
    <img class="logo" src="../assets/myGoodBot.png" />
    <div style class="dashboardData">
      <p>User: {{user.username}}</p>
      <p>Days Remaining: {{user.daysRemaining}}</p>
      <p>Contests Entered: {{user.contestsEntered}}</p>
      <div @click="logout()" class="button" style="margin-top: 10px">Log Out</div>

      <div style="margin-top: 40px;">
        <h1>FAQs</h1>

        <div>
          <p class="question">What is myGoodBot?</p>
          <p class="answer">myGoodBot is a program that connects to your twitter account to automatically enter you in twitter contests and giveaways.</p>
        </div>

        <div>
          <p class="question">How does it work?</p>
          <p class="answer">Most of these giveaways require you to simply like, retweet, and follow to be automatically entered.  This program does just that; It is optimized to scrape any contest data from Twitter daily and will automatically execute these tasks for you.</p>
        </div>

        <div>
          <p class="question">Why did you build this?</p>
          <p class="answer">As a software developer, I'm always looking for fun side projects to work on.  What started as a learning experience to further develop my skills, turned into a fun way to win contests automatically. After having told family and friends about it, they all wanted me to set up their twitter accounts the same.  After so many requests, I finally decided to create something that can be used my many people.</p>
        </div>

        <div>
          <p class="question">Can you really win these giveaways?</p>
          <p class="answer">Yes! Generally, I win something noteworthy once or twice per month.  Some of the prizes I've won include: shirts, sweaters, socks, books, signed sports memorabilia, jewlery, DVDs, action figues, games, etc. It's always a surprise to get a message on twitter to find out I won something that I had no idea I even was trying to win.</p>
        </div>

        <div>
          <p class="question">How many contests does the bot enter?</p>
          <p class="answer">The Twitter API has limits on applications that connect with it.  For this reason, the bot will try and search for 1000 contests every day.  However, even if it can find 1000 contests, it goes through a filtering process that eliminates fake giveaways, spam tweets, adult-related tweets, and other blacklisted accounts that I have specifically set to ignore.  This can reduce the amount of contests it enters significantly. Still, I've found that I can count on winning something at least once per month.</p>
        </div>

        <div>
          <p class="question">Is this app safe?</p>
          <p class="answer">This app is registered with Twitter and is in good standing. It is using the standard APIs provided by Twitter.  Many apps utilize this feature provided by Twitter and myGoodBot is no exception.  The only information this app stores about you is your username. To revoke this app from accessing your account, please contact me or navigate to twitter.com and go to Settings and Privacy > Apps and sessions and find for "myGoodBot".  Clicking on that will allow you to revoke all access.</p>
        </div>

        <div>
          <p class="question">How do I get started?</p>
          <p class="answer">If you've found this site, you most likely have my contact information (in which case, send me a message and we can get you started).  At this time, I am limiting sign-ups until I can properly plan for the server power required.</p>
        </div>

        <div>
          <p class="question">Anything else I need to know?</p>
          <p class="answer">
            There is some important information that you need to consider, because it will affect how successful you are
            <ul style="list-style: unset;">
              <br/>
              <li>Twitter will lock your account for the first couple of days of using this bot.  This is a precautionary measure, and it's because they don't want third-party apps (like this one) to abuse your account. If you have the twitter app, you should set all your notifications to 'on' so you can unlock the account ASAP.  Failure to do this can cause the bot to not work at all.  By signing up for this service, you agree to allow this app to like tweets, retweet tweets, and follow people automatically, many times per day. You also assume responsibility to unlock your account if it gets locked. After a few days, the locked account notifications should end and you can just focus on winning.</li>
              <br/>
              <li>If you use twitter for real, consider using a throw-away account.  People who follow you will get spammed by your contest entries (big time), and you may lose friends if done on your primary account.</li>
              <br/>
              <li>Twitter only allows you to follow 5,000 people (unless you have A LOT of followers).  At this point, the twitter bot will stop following people and you may miss out on some contests.  I generally do a purge on who I follow once I follow 5,000 accounts.</li>
            </ul>
          </p>
        </div>

      </div>
    </div>
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
      user: {}
    };
  },
  methods: {
    logout() {
      let that = this;
      this.$http.get("/logout").then(() => {
        that.$router.push("/");
      });
    }
  },
  mounted() {
    var that = this;
    this.$http.get("/getAuthenticatedUser").then(data => {
      if (data.body) {
        that.user = data.body;
      } else {
        this.logout();
      }
    });
  }
};
</script>

<style scoped>
[v-cloak] {
  display: none;
}

.question {
  text-align: left;
}

.answer {
  text-align: left;
  font-weight: 100 !important;
}

.dashboardData {
  padding: 20px;
  text-align: center;
  background-color: #fff;
  margin: 0 auto;
  border-radius: 5px;
  border: 1px solid #dedede;
  max-width: 800px;
}

.dashboardData p {
  font-weight: bold;
  padding: 10px;
  font-size: 20px;
}
</style>