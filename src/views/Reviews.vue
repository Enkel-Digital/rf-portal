<template>
  <v-main style="text-align: left">
    <v-btn icon large @click="refresh">
      <v-icon>mdi-reload</v-icon>
    </v-btn>

    <!-- Filtering menu -->
    <h1>UNTAGS status {{ `${untags}` }}</h1>
    <div v-if="untags.length">
      <h1>UNTAGS</h1>
      <v-chip
        v-for="(tag, i) in untags"
        :key="i"
        class="ma-2"
        :to="{ name: 'reviews' }"
        close
        @click:close="clearTagFromQuery(tag)"
      >
        {{ tag }}
      </v-chip>
    </div>
    <div v-else>No Untags</div>

    <!-- Control panel -->
    <v-slider hint="Im a hint" v-model="columnsPerRow" max="12" min="1" />

    <!-- Actual output -->
    <!-- @todo Optimize this so that we dont load and render all of them, basically use a virtual scroller -->
    <!-- :gutter="{ default: '0.5em', 700: '0.25em' }" -->
    <!-- <masonry :cols="{ default: 5, 1400: 4, 1000: 3, 850: 2, 600: 1, 400: 1 }"> -->
    <!-- @todo The binding is not working -->
    <masonry :cols="columnsPerRow">
      <div v-for="(review, i) in reviews" :key="i" class="pa-3" max-width="450">
        <!-- When card clicked, expand and bring to response page -->
        <!-- This querying and filtering should be done in the logic instead of inside the template -->

        <!-- @todo Tmp hide this as no tags yet -->
        <!-- <v-card v-if="false && review.tags.includes(query.tag)"> -->

        <v-card>
          {{ review.message }}

          <hr />

          <!-- Put details of this review -->
          <!-- product name? -->
          <!-- user tags if any -->
          <br />
          <!-- On click modify the filter menu, by modifying the props and url of this view -->

          <!-- Ideally use this once converted to an object -->
          <!-- v-for="(tag, j) in links[review.linkID].tags" -->
          <!-- Do like a v-else to show user did not have any tag if tags.length == 0 -->
          <v-chip
            v-for="(tag, j) in tmpGetLinkTags(review.linkID)"
            :key="j"
            class="ma-2"
            :to="{ name: 'reviews' }"
            close
            @click:close="setUntag(tag)"
          >
            {{ tag }}
          </v-chip>
        </v-card>
      </div>
    </masonry>
  </v-main>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "reviews",

  // props: [
  //   botID: {
  //     defult: this.$store.state.bots.current.id
  //   }
  // ],

  created() {
    // this.$store.dispatch("reviews/getReviews");
    this.refresh();
  },

  destroyed() {
    // Although this would be unnecessary if we do not store reviews into persistence state
    // This can still help free up memory by removing userReviews.
    // Should we clear? Cos if they come right back in, the data is loaded again
    // this.$store.commit("classes/clearUserReview", this.classID);
  },

  data() {
    return {
      botID: this.$store.state.bots.current.id,

      // Defaults to 5 and can be set by user
      columnsPerRow: 5,

      query: {
        tag: "firstTimeUser",
      },
    };
  },

  computed: {
    // Perhaps all the route should have the botID prepended or have it attached as a URL query?

    ...mapState("reviews", [`bot`]),

    reviews() {
      // Only return the reviews namespaced under this reviews.
      return this.bot[this.botID];
    },

    links() {
      // Only return the reviews namespaced under this reviews.
      return this.$store.state.links.bot[this.botID || 1] || [];
    },

    // @todo Move the filtering logic for the tags, either here or on the backend service itself.
    unionTags() {
      return this.$route.query.unionTags?.split(";") || [];
    },
    joinTags() {
      return this.$route.query.joinTags?.split(";") || [];
    },
    untags() {
      return this.$route.query.untags?.split(";") || [];
    },
  },

  methods: {
    tmpGetLinkTags(linkID) {
      return this.links[this.links.findIndex((link) => link.id === linkID)]
        ?.tags;
    },

    refresh() {
      this.$store.dispatch("reviews/getReviews");
    },

    setUntag(tag) {
      // const untags = this.untags + `${tag};`;
      // console.log("untags", untags);
      // this.$router
      //   .replace({
      //     query: { untags },
      //   })
      //   // This is just prevent dup navigation error
      //   .catch((err) => {});

      console.log(
        "clearing",
        this.untags.join(";"),
        `${tag};`,
        this.untags.join(";") + `${tag};`
      );

      this.$router.replace({
        query: { untags: this.untags.join(";") + `${tag};` },
      });

      console.log("this.untags", this.untags);
      for (const t of this.untags) console.log("an untag", t);
    },
    delUntag(tag) {
      //
    },
  },
};
</script>
