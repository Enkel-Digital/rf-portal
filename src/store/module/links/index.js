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
    addNewLink(state, { botID, link }) {
      state.bot[botID].splice(state.bot[botID].length, 0, link);
    },
    addNewLinks(state, { botID, links }) {
      Vue.set(state.bot, botID, links);
    },
  },
  actions: {
    /**
     * Get all the links for the current bot
     * @function getLinks
     */
    async getLinks({ rootState, commit, dispatch }) {
      const botID = rootState.bots.current.id;

      // Get all links of the bot.set
      const response = await apiWithLoader.get(`/links/?botID=${botID}`);
      if (!response.ok)
        return apiError(
          response,
          () => dispatch("getLinks"),
          "Failed to get links of the current Bot"
        );

      commit("addNewLinks", { botID, links: response.links });
    },

    /**
     * Create a new link for the current bot
     * @todo Right now users are not allowed to set their custom link tokens, like t.me/bot?start=VIP_customer but we might offer it as a feature in the future
     */
    async newLink({ rootState, commit, dispatch }, link) {
      const botID = rootState.bots.current.id;
      const userID = rootState.user.id;

      const response = await apiWithLoader.post("/links/new", {
        link: { ...link, botID, createdBy: userID },
      });
      if (!response.ok)
        return apiError(
          response,
          () => dispatch("newLink", link),
          "Failed to create new link"
        );

      // Backend will return the new link object
      // Add the newly created link into the list of links too
      commit("addNewLink", { botID, link: response.link });
    },
  },
};
