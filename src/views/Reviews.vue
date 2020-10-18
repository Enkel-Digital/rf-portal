<template>
  <v-main class="reviews">
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
      <div
        v-for="(feedback, i) in feedbacks"
        :key="i"
        class="pa-3"
        max-width="450"
      >
        <!-- When card clicked, expand and bring to response page -->
        <!-- This querying and filtering should be done in the logic instead of inside the template -->
        <v-card v-if="feedback.tags.includes(query.tag)">
          {{ feedback.text }}

          <hr />

          <!-- Put details of this feedback -->
          <!-- product name? -->
          <!-- user tags if any -->
          <br />
          "{{ feedback.product }}"
          <br />
          <!-- On click modify the filter menu, by modifying the props and url of this view -->
          <v-chip
            v-for="(tag, j) in feedback.tags"
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

  props: [],

  created() {
    // this.$store.dispatch("classes/getUserReview", this.classID);
  },
  destroyed() {
    // Although this would be unnecessary if we do not store reviews into persistence state
    // This can still help free up memory by removing userReviews.
    // Should we clear? Cos if they come right back in, the data is loaded again
    // this.$store.commit("classes/clearUserReview", this.classID);
  },

  data() {
    return {
      // Defaults to 5 and can be set by user
      columnsPerRow: 5,

      query: {
        tag: "firstTimeUser",
      },
      feedbacks: [
        {
          text:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam lacinia risus in magna mattis porttitor nec sit amet neque. Suspendisse ac lorem risus. In egestas nibh lacus, a porttitor mauris pretium non. Vestibulum rhoncus massa sit amet efficitur ultrices. Vestibulum sed elementum lorem. Proin venenatis, arcu et laoreet pretium, augue massa viverra justo",
          product: "PRODUCT_NAME",
          tags: ["firstTimeUser", "onlinePurchase", "ecommerce"],
        },
        {
          text:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam lacinia risus in magna mattis porttitor nec sit amet neque. Suspendisse ac lorem risus. In egestas nibh lacus, a porttitor mauris pretium non. Vestibulum rhoncus massa sit amet efficitur ultrices. Vestibulum sed elementum lorem. Proin venenatis, arcu et laoreet pretium, augue massa viverra justo",
          product: "PRODUCT_NAME",
          tags: ["firstTimeUser", "onlinePurchase", "ecommerce"],
        },
        {
          text:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam lacinia risus in magna mattis porttitor nec sit amet neque. Suspendisse ac lorem risus. In egestas nibh lacus, a porttitor mauris pretium non. Vestibulum rhoncus massa sit amet efficitur ultrices. Vestibulum sed elementum lorem. Proin venenatis, arcu et laoreet pretium, augue massa viverra justo",
          product: "PRODUCT_NAME",
          tags: ["firstTimeUser", "onlinePurchase", "ecommerce"],
        },
        {
          text:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam lacinia risus in magna mattis porttitor nec sit amet neque. Suspendisse ac lorem risus. In egestas nibh lacus, a porttitor mauris pretium non. Vestibulum rhoncus massa sit amet efficitur ultrices. Vestibulum sed elementum lorem. Proin venenatis, arcu et laoreet pretium, augue massa viverra justo",
          product: "PRODUCT_NAME",
          tags: ["firstTimeUser", "onlinePurchase", "ecommerce"],
        },
        {
          text:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam lacinia risus in magna mattis porttitor nec sit amet neque. Suspendisse ac lorem risus. In egestas nibh lacus, a porttitor mauris pretium non. Vestibulum rhoncus massa sit amet efficitur ultrices. Vestibulum sed elementum lorem. Proin venenatis, arcu et laoreet pretium, augue massa viverra justo",
          product: "PRODUCT_NAME",
          tags: ["firstTimeUser", "onlinePurchase", "ecommerce"],
        },
      ],
    };
  },

  computed: {
    // @todo Move the filtering logic for the tags, either here or on the backend service itself.
    // ...mapState("classes", ["review"]),

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

<style scoped>
#class-image {
  max-height: 70vh;
}

#reviews-card {
  text-align: left;
}
</style>
