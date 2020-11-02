<template>
  <v-navigation-drawer
    id="side-nav-bar"
    v-model="drawer"
    :mini-variant.sync="mini"
    permanent
    :clipped="true"
    app
  >
    <!-- @todo Make this section clickable and link to account page of settings -->
    <v-list-item class="px-2" two-line>
      <v-list-item-avatar>
        <img
          alt="Avatar"
          :src="'https://avatars2.githubusercontent.com/u/44993072?s=460'"
        />
      </v-list-item-avatar>

      <v-list-item-content>
        <!-- Indicate whether the user is an admin or employee -->
        <p class="overline">{{ user.admin ? "Admin" : "Employee" }}</p>

        <v-list-item-title>{{ user.name }}</v-list-item-title>

        <v-list-item-subtitle>{{ user.email }}</v-list-item-subtitle>
      </v-list-item-content>

      <v-btn icon @click.stop="mini = !mini">
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
    </v-list-item>

    <v-divider />

    <!-- Items in the side nav bar -->
    <v-list dense>
      <v-list-item
        exact
        ripple
        v-for="item in defaultTabs"
        :key="item.title"
        :to="item.link"
      >
        <v-list-item-icon>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{ item.text }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <!-- @todo Convert this to their sub plan page like CE app / billing, where they can upgrade plan and see their usage and limits -->
      <!-- <v-subheader>Billing</v-subheader>
      <v-list-item
        exact
        ripple
        v-for="item in billingTabs"
        :key="item.title"
        :to="item.link"
      >
        <v-list-item-icon>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{ item.text }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item> -->

      <v-subheader>Surveys</v-subheader>
      <v-list-item
        exact
        ripple
        v-for="item in surveyTabs"
        :key="item.title"
        :to="item.link"
      >
        <v-list-item-icon>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{ item.text }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-subheader>Reviews</v-subheader>
      <v-list-item
        exact
        ripple
        v-for="item in reviewTabs"
        :key="item.title"
        :to="item.link"
      >
        <v-list-item-icon>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{ item.text }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-subheader>Tags</v-subheader>
      <v-list-item
        exact
        ripple
        v-for="item in tagTabs"
        :key="item.title"
        :to="item.link"
      >
        <v-list-item-icon>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{ item.text }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-subheader>Linking</v-subheader>
      <v-list-item
        exact
        ripple
        v-for="item in linkTabs"
        :key="item.title"
        :to="item.link"
      >
        <v-list-item-icon>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{ item.text }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-subheader>General</v-subheader>
      <v-list-item
        exact
        ripple
        v-for="item in user.admin
          ? generalTabs
          : generalTabs.filter((tab) => !tab.adminOnly)"
        :key="item.title"
        :to="item.link"
      >
        <v-list-item-icon>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{ item.text }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item ripple hover @click="logout">
        <v-list-item-icon>
          <v-icon>mdi-logout</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>Logout</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
// UI reference link https://github.com/vuetifyjs/vuetify/blob/master/packages/docs/src/layouts/layouts/demos/google-contacts.vue

import { mapState } from "vuex";
import logout from "@/controllers/logout";

export default {
  name: "side-nav-bar",
  data() {
    return {
      drawer: true,
      mini: false,
      defaultTabs: [
        {
          icon: "mdi-monitor-dashboard",
          text: "Dashboard",
          link: { name: "home" },
        },
        // {
        //   icon: "mdi-calendar-month",
        //   text: "Schedule",
        //   link: { name: "view-schedule" },
        // },
      ],
      surveyTabs: [
        {
          icon: "mdi-view-list",
          text: "View all surveys",
          link: { name: "surveys-all" },
        },
        {
          icon: "mdi-plus",
          text: "Create Survey",
          link: { name: "surveys-new" },
        },
      ],
      reviewTabs: [
        {
          icon: "mdi-view-list",
          text: "Reviews",
          link: { name: "reviews" },
        },
        // {
        //   icon: "mdi-plus",
        //   text: "Add New Class",
        //   link: { name: "new-class" },
        // },
        // {
        //   icon: "mdi-calendar-clock",
        //   text: "Bookings",
        //   link: { name: "bookings" },
        // },
        // {
        //   icon: "mdi-message-draw",
        //   text: "Reviews",
        //   link: { name: "all-reviews" },
        // },
      ],
      tagTabs: [
        {
          icon: "mdi-view-list",
          text: "View tags",
          link: { name: "tags" },
        },
        {
          icon: "mdi-plus",
          text: "Add New Tag",
          link: { name: "new-tag" },
        },
      ],
      linkTabs: [
        {
          icon: "mdi-view-list",
          text: "View All links",
          link: { name: "all-links" },
        },
        {
          icon: "mdi-plus",
          text: "Generate new link",
          link: { name: "new-link" },
        },
      ],
      generalTabs: [
        {
          icon: "mdi-account",
          text: "Company Profile",
          link: { name: "partnerProfile" },
          adminOnly: true,
        },
        {
          icon: "mdi-account-group",
          text: "Manage Employee",
          link: { name: "manage-employee" },
          adminOnly: true,
        },
        {
          icon: "mdi-help-circle",
          text: "FAQs",
          link: { name: "faq" },
        },
        {
          icon: "mdi-chat",
          text: "Contact Support",
          link: { name: "contact-support" },
        },
        {
          icon: "mdi-cog",
          text: "Settings",
          link: { name: "settings" },
        },
      ],
    };
  },
  computed: {
    ...mapState(["user"]),
  },
  methods: {
    logout,
  },
};
</script>

<style scoped>
#side-nav-bar {
  text-align: left;
}
body {
  overflow: hidden;
  height: 100vh;
}
</style>
