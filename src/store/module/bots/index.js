/**
 * Vuex module for bots related logic
 */

import initialState from "./initialState";
import setter from "../../utils/setter";
import apiError from "@/store/utils/apiError";
import apiWithLoader from "@/store/utils/apiWithLoader";

import { ERROR, createError } from "vue-error-controller";
import Vue from "vue";

export default {
  namespaced: true,
  state: initialState(),
  mutations: {
    setter,
  },
  actions: {
    /**
     * Get all the bots of the business
     * @function getBots
     *
     * @todo Might want to get ID back only then load the bots 1 by 1 if there is alot of bots
     */
    async getBots({ rootState, commit, dispatch }) {
      const response = await apiWithLoader.get(
        `/bot/all/${rootState.user.businessID}`
      );
      if (!response.ok)
        return apiError(
          response,
          () => dispatch("getBots"),
          "Unable to load bot details"
        );

      commit("setter", ["bots", response.bots]);

      // @todo Remove this
      dispatch("setCurrent", response.bots[0].id);
    },
    setCurrent({ state, commit, dispatch }, botID) {
      const current = state.bots.find((bot) => bot.id === botID);
      if (!current)
        return Vue.$error.new(
          createError(ERROR.level.RETRY, ERROR.type.INTERNAL, {
            description: `Invalid botID "${botID}" used to set current bot`,
          })
        );

      commit("setter", ["current", current]);
    },
  },
};
