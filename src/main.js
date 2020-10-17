/* Import for side effects only */
import setupOutcome from "./setup"; // Returns either true or false
import "./registerServiceWorker";
import "./plugins/vue-masonry";
import "./plugins/vue-sanitize";

import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";

import firebase from "firebase/app";
import "firebase/auth";

// Setup the error controller plugin
import errorController from "vue-error-controller";
import errorDialog from "./components/ErrorDialog.vue";
import postToErrorService from "./utils/postToErrorService";
Vue.use(errorController, { router, errorDialog, postToErrorService });

import loader from "vue-loader-controller";
import customLoader from "./components/Loader.vue";
Vue.use(loader, { customLoader });

import moment from "moment";
Vue.prototype.moment = moment;

Vue.config.productionTip = false;

// Register global custom directive called `v-autofocus`
import autofocus from "./directives/autofocus";
Vue.directive("autofocus", autofocus);

// firebaseConfig auto generated in project settings
firebase.initializeApp({
  apiKey: "AIzaSyDLXpxnA8e-Br7uCms9mF_TzvMuv2QCzzU",
  authDomain: "ekd-rf-portal.firebaseapp.com",
  projectId: "ekd-rf-portal",
  appId: "1:212806725039:web:f0459ce5f2d629bbd9935a",
});

// Wait for firebase to finish initialization before creating the app.
// So that the router navigation wont break due to invalid auth
firebase.auth().onAuthStateChanged(() => {
  new Vue({
    router,
    store,
    vuetify,
    render: (h) => h(App),
  }).$mount("#app");
});
