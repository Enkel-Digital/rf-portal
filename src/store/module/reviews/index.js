/**
 * Vuex module for all things classes related including reviews
 */

import Vue from "vue";
import initialState from "./initialState";
import setter from "../../utils/setter";
import apiError from "@/store/utils/apiError";
import apiWithLoader from "@/store/utils/apiWithLoader";

// @todo Create getReviews
// import { getClass, addClass } from "./getClass";

export default {
  namespaced: true,
  state: initialState(),
  mutations: {
    setter,
    /* Or we can just store it entirely as an array? Instead of storing on object then getting back as array */
    addReview(state, { botID, reviews }) {
      // If first time loading reviews for bot, create empty object on the key first
      if (!state.bot[botID]) Vue.set(state.bot, botID, {});

      for (const review of reviews)
        Vue.set(state.bot[botID], review.review.id, review.review);
    },
  },
  actions: {
    /**
     * Get review stats and list of review IDs from API before dispatching getReviews to load all of the reviews 1 by 1
     * @function getReviews
     */
    async getReviews({ rootState, state, commit, dispatch }) {
      const botID = rootState.bots.current.id;

      const response = await apiWithLoader.get(`/reviews/bot/${botID}`);
      if (!response.ok) return apiError(response, () => dispatch("getReviews"));

      commit("setter", ["reviewStats", response.reviewStats]);

      // @todo Dispatch the getReviews module/action. Right now all is loaded and processed at once

      const reviews = await Promise.all(
        response.reviewIDs.map((reviewID) =>
          apiWithLoader.get(`/reviews/details/?reviewID=${reviewID}`)
        )
      );

      commit("addReview", { botID, reviews });
    },
  },
};
