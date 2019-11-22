<template>
  <div style="background-color: #F4F6FC;">
    <Header user="user"></Header>
    <div style class="dashboardData">
      <div>
        <div class="contestData" v-if="user">
          <p>User: {{user.username}}</p>
          <p>Days Remaining: {{user.daysRemaining}}</p>
          <p>Contests Entered Today: {{user.contestsEntered}}</p>
          <div @click="showFaq = true;" class="button" style="margin-top: 10px">FAQ</div>
          <span @click="showPrivacyPolicy = true;" class="privacy-policy">Privacy Policy</span>
        </div>
        <div v-if="loading">
          <img style="height: 186px;" src="../assets/loading.gif" />
        </div>
      </div>

      <Modal
        :show="showPrivacyPolicy"
        @hide="showPrivacyPolicy = false;"
        title="Welcome to our Privacy Policy"
      >
        <h3>Your privacy is critically important to us.</h3>
        <br />

        <p>
          It is MyGoodBot's policy to respect your privacy regarding any information we may collect while operating our website. This Privacy Policy applies to
          <a
            href="https://mygoodbot.maxjacobson.me"
          >https://mygoodbot.maxjacobson.me</a> (hereinafter, "us", "we", or "https://mygoodbot.maxjacobson.me"). We respect your privacy and are committed to protecting personally identifiable information you may provide us through the Website. We have adopted this privacy policy ("Privacy Policy") to explain what information may be collected on our Website, how we use this information, and under what circumstances we may disclose the information to third parties. This Privacy Policy applies only to information we collect through the Website and does not apply to our collection of information from other sources.
        </p>
        <p>This Privacy Policy, together with the Terms and conditions posted on our Website, set forth the general rules and policies governing your use of our Website. Depending on your activities when visiting our Website, you may be required to agree to additional terms and conditions.</p>

        <h2>Website Visitors</h2>
        <p>Like most website operators, MyGoodBot collects non-personally-identifying information of the sort that web browsers and servers typically make available, such as the browser type, language preference, referring site, and the date and time of each visitor request. MyGoodBot's purpose in collecting non-personally identifying information is to better understand how MyGoodBot's visitors use its website. From time to time, MyGoodBot may release non-personally-identifying information in the aggregate, e.g., by publishing a report on trends in the usage of its website.</p>
        <p>MyGoodBot also collects potentially personally-identifying information like Internet Protocol (IP) addresses for logged in users and for users leaving comments on https://mygoodbot.maxjacobson.me blog posts. MyGoodBot only discloses logged in user and commenter IP addresses under the same circumstances that it uses and discloses personally-identifying information as described below.</p>

        <h2>Gathering of Personally-Identifying Information</h2>
        <p>Certain visitors to MyGoodBot's websites choose to interact with MyGoodBot in ways that require MyGoodBot to gather personally-identifying information. The amount and type of information that MyGoodBot gathers depends on the nature of the interaction. For example, we ask visitors who sign up for a blog at https://mygoodbot.maxjacobson.me to provide a username and email address.</p>

        <h2>Security</h2>
        <p>The security of your Personal Information is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Information, we cannot guarantee its absolute security.</p>

        <h2>Advertisements</h2>
        <p>Ads appearing on our website may be delivered to users by advertising partners, who may set cookies. These cookies allow the ad server to recognize your computer each time they send you an online advertisement to compile information about you or others who use your computer. This information allows ad networks to, among other things, deliver targeted advertisements that they believe will be of most interest to you. This Privacy Policy covers the use of cookies by MyGoodBot and does not cover the use of cookies by any advertisers.</p>

        <h2>Links To External Sites</h2>
        <p>Our Service may contain links to external sites that are not operated by us. If you click on a third party link, you will be directed to that third party's site. We strongly advise you to review the Privacy Policy and terms and conditions of every site you visit.</p>
        <p>We have no control over, and assume no responsibility for the content, privacy policies or practices of any third party sites, products or services.</p>

        <h2>Aggregated Statistics</h2>
        <p>MyGoodBot may collect statistics about the behavior of visitors to its website. MyGoodBot may display this information publicly or provide it to others. However, MyGoodBot does not disclose your personally-identifying information.</p>

        <h2>Cookies</h2>
        <p>To enrich and perfect your online experience, MyGoodBot uses "Cookies", similar technologies and services provided by others to display personalized content, appropriate advertising and store your preferences on your computer.</p>
        <p>A cookie is a string of information that a website stores on a visitor's computer, and that the visitor's browser provides to the website each time the visitor returns. MyGoodBot uses cookies to help MyGoodBot identify and track visitors, their usage of https://mygoodbot.maxjacobson.me, and their website access preferences. MyGoodBot visitors who do not wish to have cookies placed on their computers should set their browsers to refuse cookies before using MyGoodBot's websites, with the drawback that certain features of MyGoodBot's websites may not function properly without the aid of cookies.</p>
        <p>By continuing to navigate our website without changing your cookie settings, you hereby acknowledge and agree to MyGoodBot's use of cookies.</p>

        <h2>Privacy Policy Changes</h2>
        <p>Although most changes are likely to be minor, MyGoodBot may change its Privacy Policy from time to time, and in MyGoodBot's sole discretion. MyGoodBot encourages visitors to frequently check this page for any changes to its Privacy Policy. Your continued use of this site after any change in this Privacy Policy will constitute your acceptance of such change.</p>

        <h2></h2>
        <p></p>

        <h2>Credit & Contact Information</h2>
        <p>
          This privacy policy was created at
          <a
            style="color:inherit;text-decoration:none;"
            href="https://termsandconditionstemplate.com/privacy-policy-generator/"
            title="Privacy policy template generator"
            target="_blank"
          >termsandconditionstemplate.com</a>. If you have any questions about this Privacy Policy, please contact us via
          <a
            href="mailto:mjacobson7@gmail.com"
          >email</a>
        </p>
      </Modal>

      <Modal
        :show="user && !user.termsAccepted"
        @hide="termsConditions"
        :disabled="!termsAccepted"
        title="Welcome to myGoodBot"
      >
        <p>These terms and conditions outline the rules and regulations for the use of myGoodBot's Website.</p>
        <br />
        <span style="text-transform: capitalize;">myGoodBot</span> is located at:
        <br />
        <address>
          <br />
        </address>
        <p>
          By accessing this website we assume you accept these terms and conditions in full. Do not continue to use myGoodBot's website
          if you do not accept all of the terms and conditions stated on this page.
        </p>
        <p>
          The following terminology applies to these Terms and Conditions, Privacy Statement and Disclaimer Notice
          and any or all Agreements: "Client", "You" and "Your" refers to you, the person accessing this website
          and accepting the Company's terms and conditions. "The Company", "Ourselves", "We", "Our" and "Us", refers
          to our Company. "Party", "Parties", or "Us", refers to both the Client and ourselves, or either the Client
          or ourselves. All terms refer to the offer, acceptance and consideration of payment necessary to undertake
          the process of our assistance to the Client in the most appropriate manner, whether by formal meetings
          of a fixed duration, or any other means, for the express purpose of meeting the Client's needs in respect
          of provision of the Company's stated services/products, in accordance with and subject to, prevailing law
          of . Any use of the above terminology or other words in the singular, plural,
          capitalisation and/or he/she or they, are taken as interchangeable and therefore as referring to same.
        </p>
        <h2>Cookies</h2>
        <p>
          We employ the use of cookies. By using myGoodBot's website you consent to the use of cookies
          in accordance with myGoodBot's privacy policy.
        </p>
        <p>
          Most of the modern day interactive web sites
          use cookies to enable us to retrieve user details for each visit. Cookies are used in some areas of our site
          to enable the functionality of this area and ease of use for those people visiting. Some of our
          affiliate / advertising partners may also use cookies.
        </p>
        <h2>License</h2>
        <p>
          Unless otherwise stated, myGoodBot and/or it's licensors own the intellectual property rights for
          all material on myGoodBot. All intellectual property rights are reserved. You may view and/or print
          pages from https://mygoodbot.maxjacobson.me for your own personal use subject to restrictions set in these terms and conditions.
        </p>
        <p>You must not:</p>
        <ol>
          <li>Republish material from https://mygoodbot.maxjacobson.me</li>
          <li>Sell, rent or sub-license material from https://mygoodbot.maxjacobson.me</li>
          <li>Reproduce, duplicate or copy material from https://mygoodbot.maxjacobson.me</li>
        </ol>
        <p>Redistribute content from myGoodBot (unless content is specifically made for redistribution).</p>
        <h2>Hyperlinking to our Content</h2>
        <ol>
          <li>
            The following organizations may link to our Web site without prior written approval:
            <ol>
              <li>Government agencies;</li>
              <li>Search engines;</li>
              <li>News organizations;</li>
              <li>
                Online directory distributors when they list us in the directory may link to our Web site in the same
                manner as they hyperlink to the Web sites of other listed businesses; and
              </li>
              <li>
                Systemwide Accredited Businesses except soliciting non-profit organizations, charity shopping malls,
                and charity fundraising groups which may not hyperlink to our Web site.
              </li>
            </ol>
          </li>
        </ol>
        <ol start="2">
          <li>
            These organizations may link to our home page, to publications or to other Web site information so long
            as the link: (a) is not in any way misleading; (b) does not falsely imply sponsorship, endorsement or
            approval of the linking party and its products or services; and (c) fits within the context of the linking
            party's site.
          </li>
          <li>
            We may consider and approve in our sole discretion other link requests from the following types of organizations:
            <ol>
              <li>
                commonly-known consumer and/or business information sources such as Chambers of Commerce, American
                Automobile Association, AARP and Consumers Union;
              </li>
              <li>dot.com community sites;</li>
              <li>associations or other groups representing charities, including charity giving sites,</li>
              <li>online directory distributors;</li>
              <li>internet portals;</li>
              <li>accounting, law and consulting firms whose primary clients are businesses; and</li>
              <li>educational institutions and trade associations.</li>
            </ol>
          </li>
        </ol>
        <p>
          We will approve link requests from these organizations if we determine that: (a) the link would not reflect
          unfavorably on us or our accredited businesses (for example, trade associations or other organizations
          representing inherently suspect types of business, such as work-at-home opportunities, shall not be allowed
          to link); (b)the organization does not have an unsatisfactory record with us; (c) the benefit to us from
          the visibility associated with the hyperlink outweighs the absence of <?=$companyName?>; and (d) where the
          link is in the context of general resource information or is otherwise consistent with editorial content
          in a newsletter or similar product furthering the mission of the organization.
        </p>

        <p>
          These organizations may link to our home page, to publications or to other Web site information so long as
          the link: (a) is not in any way misleading; (b) does not falsely imply sponsorship, endorsement or approval
          of the linking party and it products or services; and (c) fits within the context of the linking party's
          site.
        </p>

        <p>
          If you are among the organizations listed in paragraph 2 above and are interested in linking to our website,
          you must notify us by sending an e-mail to
          <a
            href="mailto:mjacobson7@gmail.com"
            title="send an email to mjacobson7@gmail.com"
          >mjacobson7@gmail.com</a>.
          Please include your name, your organization name, contact information (such as a phone number and/or e-mail
          address) as well as the URL of your site, a list of any URLs from which you intend to link to our Web site,
          and a list of the URL(s) on our site to which you would like to link. Allow 2-3 weeks for a response.
        </p>

        <p>Approved organizations may hyperlink to our Web site as follows:</p>

        <ol>
          <li>By use of our corporate name; or</li>
          <li>By use of the uniform resource locator (Web address) being linked to; or</li>
          <li>
            By use of any other description of our Web site or material being linked to that makes sense within the
            context and format of content on the linking party's site.
          </li>
        </ol>
        <p>
          No use of myGoodBot's logo or other artwork will be allowed for linking absent a trademark license
          agreement.
        </p>
        <h2>Iframes</h2>
        <p>
          Without prior approval and express written permission, you may not create frames around our Web pages or
          use other techniques that alter in any way the visual presentation or appearance of our Web site.
        </p>
        <h2>Reservation of Rights</h2>
        <p>
          We reserve the right at any time and in its sole discretion to request that you remove all links or any particular
          link to our Web site. You agree to immediately remove all links to our Web site upon such request. We also
          reserve the right to amend these terms and conditions and its linking policy at any time. By continuing
          to link to our Web site, you agree to be bound to and abide by these linking terms and conditions.
        </p>
        <h2>Removal of links from our website</h2>
        <p>
          If you find any link on our Web site or any linked web site objectionable for any reason, you may contact
          us about this. We will consider requests to remove links but will have no obligation to do so or to respond
          directly to you.
        </p>
        <p>
          Whilst we endeavour to ensure that the information on this website is correct, we do not warrant its completeness
          or accuracy; nor do we commit to ensuring that the website remains available or that the material on the
          website is kept up to date.
        </p>
        <h2>Content Liability</h2>
        <p>
          We shall have no responsibility or liability for any content appearing on your Web site. You agree to indemnify
          and defend us against all claims arising out of or based upon your Website. No link(s) may appear on any
          page on your Web site or within any context containing content or materials that may be interpreted as
          libelous, obscene or criminal, or which infringes, otherwise violates, or advocates the infringement or
          other violation of, any third party rights.
        </p>
        <h2>Disclaimer</h2>
        <p>To the maximum extent permitted by applicable law, we exclude all representations, warranties and conditions relating to our website and the use of this website (including, without limitation, any warranties implied by law in respect of satisfactory quality, fitness for purpose and/or the use of reasonable care and skill). Nothing in this disclaimer will:</p>
        <ol>
          <li>limit or exclude our or your liability for death or personal injury resulting from negligence;</li>
          <li>limit or exclude our or your liability for fraud or fraudulent misrepresentation;</li>
          <li>limit any of our or your liabilities in any way that is not permitted under applicable law; or</li>
          <li>exclude any of our or your liabilities that may not be excluded under applicable law.</li>
        </ol>
        <p>
          The limitations and exclusions of liability set out in this Section and elsewhere in this disclaimer: (a)
          are subject to the preceding paragraph; and (b) govern all liabilities arising under the disclaimer or
          in relation to the subject matter of this disclaimer, including liabilities arising in contract, in tort
          (including negligence) and for breach of statutory duty.
        </p>
        <p>
          To the extent that the website and the information and services on the website are provided free of charge,
          we will not be liable for any loss or damage of any nature.
        </p>
        <h2>Contest Entries and Winning</h2>
        <p>There is no guarantee of any number of contests will be entered. The twitter bot will attempt to search daily for twitter contests. If any potential contests are found, it will attempt to "like", "retweet", and "follow" the tweet/person in order to satisfy the requirements for the contest. We do not guarantee the contests are legitimate; although the application does attempt to avoid fake contests. Additionally, there is no guarantee that the application will actually "like", "retweet", and "follow the tweet/person as twitter or other unknown reason may prevent the application from doing so. No refunds will be issued for reasons regarding contests entered, amount of contests entered, or amount of times winning said contests. User assumes all risk and responsibility to vet the contests properly and to not respond to spam messages.</p>
        <div style="margin: 20px;">
          <label
            style="font-size: 20px;"
            for="acceptTerms"
          >I agree to the terms and conditions above</label>
          <input v-model="termsAccepted" type="checkbox" />
        </div>
      </Modal>

      <Modal :show="showFaq" @hide="showFaq = false;" title="FAQ">
        <div>
          <p class="question">What is myGoodBot?</p>
          <p
            class="answer"
          >myGoodBot is a program that connects to your twitter account to automatically enter you in twitter contests and giveaways.</p>
        </div>

        <div>
          <p class="question">How does it work?</p>
          <p
            class="answer"
          >Most of these giveaways require you to simply like, retweet, and follow to be automatically entered. This program does just that; It is optimized to scrape any contest data from Twitter daily and will automatically execute these tasks for you.</p>
        </div>

        <div>
          <p class="question">Why did you build this?</p>
          <p
            class="answer"
          >As a software developer, I'm always looking for fun side projects to work on. What started as a learning experience to further develop my skills, turned into a fun way to win contests automatically. After having told family and friends about it, they all wanted me to set up their twitter accounts the same. After so many requests, I finally decided to create something that can be used my many people.</p>
        </div>

        <div>
          <p class="question">Can you really win these giveaways?</p>
          <p
            class="answer"
          >Yes! I've been using this program for the past year and have won dozens of contests. Generally, I win something noteworthy once or twice per month. Some of the prizes I've won include: shirts, sweaters, socks, books, essential oils, signed sports memorabilia, jewlery, DVDs, action figues, games, etc. It's always a surprise to get a message on twitter to find out I won something that I had no idea I even was trying to win.</p>
        </div>

        <div>
          <p class="question">How many contests does the bot enter?</p>
          <p
            class="answer"
          >The Twitter API has limits on applications that connect with it. For this reason, the bot will search for 1000 contests every day. After an extensive filtering process (that eliminates fake giveaways, spam tweets, and other blacklisted accounts), the net contests entered daily can vary quite a bit. I haven't ever kept a record, but you should expect the bot to enter 100-300 contests per day. Still, I've found that I can count on winning something at least once per month.</p>
        </div>

        <div>
          <p class="question">Is this app safe?</p>
          <p
            class="answer"
          >This app is registered with Twitter and is in good standing. It is using the standard APIs provided by Twitter. Many apps utilize this feature provided by Twitter and myGoodBot is no exception. The only information this app stores about you is your twitter handle. To revoke this app from accessing your account, please <a
            href="mailto:mjacobson7@gmail.com"
          >contact Me</a> or navigate to twitter.com and go to Settings and Privacy > Apps and sessions and look for "myGoodBot". Clicking on that will allow you to revoke all access. NOTE: If you revoke access to the app, the bot will stop immediately. No refunds will be issued.</p>
        </div>

        <div>
          <p class="question">How do I get started?</p>
          <p
            class="answer"
          >In order to get started, you must <a href="mailto:mjacobson7@gmail.com">contact Me</a> directly. At this time, I am limiting sign-ups until I can properly plan for the server power required.</p>
        </div>

        <div>
          <p class="question">Anything else I need to know?</p>
          <span class="answer">
            There is some important information that you need to consider, because it will affect how successful you are
            <ul style="list-style: unset;">
              <br />
              <li>Twitter will most likely lock your account the first couple of times the bot runs. This is a precautionary measure, and it's because they don't want third-party apps to abuse and spam your account. If you have the twitter app, you should set all your notifications to 'on' so you can be alerted if this happens and unlock the account ASAP. Failure to do this can cause the bot to not work at all. By signing up for this service, you agree to allow this app to like tweets, retweet tweets, and follow people automatically, many times per day. You also assume responsibility to unlock your account if it gets locked. After a few days, the locked account notifications should end and you can just focus on winning.</li>
              <br />
              <li>If you use twitter for real, consider using a throw-away account. People who follow you will get spammed by your contest entries (big time), and you may lose friends if done on your primary account.</li>
              <br />
              <li>Twitter only allows you to follow 5,000 people (unless you have A LOT of followers). At this point, the twitter bot will stop following people and you may miss out on some contests. I generally do a purge on who I follow once I follow 5,000 accounts.</li>
              <br />
              <li>Download the twitter app and keep notifications on. Most contests will notify you by tagging you in a tweet and/or messaging you. Most of the time they will ask you to message them. If you get a message claiming you won something but the account isn't verified, or they didn't announce it publicly in a tweet, be cautious, as they may be trying to get your personal information. After having used this app in the past year, I've been able to tweak it enough that I can bypass most all fake contests. There's still a chance people can attempt to scam you. Don't click on any links they message you if they seem suspicious. Please report all suspicious accounts so we can blacklist them from the app.</li>
            </ul>
          </span>
        </div>
      </Modal>
    </div>
  </div>
</template>

<script>
import Header from "./Header";
import Modal from "./Modal";

export default {
  components: {
    Header,
    Modal
  },
  data() {
    return {
      user: null,
      loading: true,
      showFaq: false,
      termsAccepted: false,
      showPrivacyPolicy: false
    };
  },
  methods: {
    logout() {
      let that = this;
      this.$http.get("/logout").then(() => {
        that.$router.push("/");
      });
    },
    termsConditions() {
      if (this.termsAccepted) {
        this.$http.get("/acceptTerms").then(data => {
          this.user = data.body;
        });
      } else {
        alert("You must agree to the terms and conditions");
      }
    }
  },
  mounted() {
    this.$http.get("/getAuthenticatedUser").then(data => {
      if (data.body) {
        this.loading = false;
        this.user = data.body;
      } else {
        this.logout();
      }
    });
  },
  computed: {
    preventClose() {
      if (this.user) {
        return this.acceptedTerms;
      }
      return false;
    }
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
  margin: 50px auto;
  border-radius: 5px;
  border: 1px solid #dedede;
  max-width: 800px;
}

.dashboardData .contestData p {
  font-weight: bold;
  padding: 10px;
  font-size: 20px;
}

.privacy-policy {
  display: block;
  padding-top: 10px;
  cursor: pointer;
  color: #0c83cc;
}

.privacy-policy:hover {
  color: #10689e;
}
</style>