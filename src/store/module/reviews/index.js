/**
 * Vuex module for all things classes related including reviews
 */

import Vue from "vue";
import initialState from "./initialState";
import setter from "../../utils/setter";
import apiError from "@/store/utils/apiError";
import apiWithLoader from "@/store/utils/apiWithLoader";

// @todo Have the alternatives for loading reviews
// import { getClass, addClass } from "./getClass";
// import { getClassSchedule, addClassSchedule } from "./getClassSchedule";

export default {
  namespaced: true,
  state: initialState(),
  mutations: {
    setter,
  },
  actions: {
    /**
     * Get list of partner's classIDs from API before dispatching getClass to load all of the classes
     * @function getPartnerClasses
     */
    // API should return result without userReview
    async getReviews({ state, commit, dispatch }, classID) {
      // If review is already in state, ignore request
      if (state.reviews && classID === state.reviews[classID]) return;

      const response = await apiWithLoader.get(`/reviews/class/${classID}`);
      if (!response.success)
        return apiError(response, () => dispatch("getReview"));

      commit("setter", ["review", response.reviews]);
    },
  },
};
