<template>
  <v-main id="createLinks">
    <v-row>
      <v-col cols="12" sm="6">
        <v-card outlined ref="form" v-model="valid">
          <v-card-text>
            <h2 style="color: #455a64" class="text-left font-weight-light">
              LINK DETAILS
            </h2>
            <br />

            <!-- @todo Show the SGT somewhere on this page -->

            <v-text-field
              v-autofocus
              v-model="link.name"
              :rules="nameRules"
              label="Name"
              placeholder="E.g. Product 'X' feedback"
              color="#60696c"
              required
            />

            <!-- @todo Why single-line attr.? -->
            <v-combobox
              v-model="link.tags"
              :items="tags"
              chips
              color="#60696c"
              clearable
              label="Custom tags for filtering"
              multiple
              single-line
            >
              <template v-slot:selection="{ attrs, item, select, selected }">
                <v-chip
                  v-bind="attrs"
                  :input-value="selected"
                  close
                  small
                  @click="select"
                  @click:close="remove(item)"
                >
                  <strong>{{ item }}</strong>
                </v-chip>
              </template>
            </v-combobox>

            <v-textarea
              label="Description"
              type="text"
              @change="sanitized = false"
              v-model="link.description"
              rows="4"
              outlined
              placeholder="Describe this link"
              no-resize
              color="#60696c"
              required
            />
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6">
        <v-card outlined ref="form" v-model="valid">
          <v-card-text>
            <v-menu
              v-model="showStartDateMenu"
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y
              min-width="290px"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="link.dateStart"
                  label="Start of Link activation"
                  prepend-icon="mdi-calendar-month"
                  color="#60696c"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                />
              </template>
              <v-date-picker
                v-model="link.dateStart"
                color="#60696c"
                header-color="#60696c"
                event-color="#60696c"
                @input="showStartDateMenu = false"
              />
            </v-menu>

            <v-menu
              v-model="showEndDateMenu"
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y
              min-width="290px"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="link.dateEnd"
                  label="Link deactivation date (optional)"
                  prepend-icon="mdi-calendar-month"
                  color="#60696c"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                />
              </template>
              <v-date-picker
                v-model="link.dateEnd"
                header-color="#60696c"
                color="#60696c"
                event-color="#60696c"
                @input="showEndDateMenu = false"
              />
            </v-menu>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <br />

    <!-- Buttons to reset and create -->
    <v-row class="text-center">
      <v-col cols="6">
        <v-btn
          color="#60696c"
          rounded
          width="15em"
          outlined
          depressed
          large
          @click="reset"
        >
          Reset
        </v-btn>
      </v-col>

      <v-col cols="6">
        <v-btn
          color="#60696c"
          class="white--text text-right"
          rounded
          width="15em"
          depressed
          large
          @click="createLink"
        >
          Create link
        </v-btn>
      </v-col>
    </v-row>
  </v-main>
</template>

<script>
// @todo Update the layout to use cards to group items together rather than fixed rows and columns
// @todo Add function to validate the inputs, like start and end date cannot be before today

import moment from "moment";
import cloneDeep from "lodash.clonedeep";

export default {
  data() {
    return {
      showStartDateMenu: false,
      showEndDateMenu: false,

      // @todo Update this to be populated by an API instead
      tags: ["vip", "newUser", "secondPurchase", "christmas-promo"],

      link: {
        name: null,
        description: null,

        // Create date in local timezone for today in the format of e.g. "2020-05-21"
        dateStart: moment().format("YYYY-MM-DD"),
        dateEnd: null,

        tags: [],
      },

      // What is this used for?
      valid: null,

      nameRules: [
        (v) => !!v || "Name is required",
        (v) => (v && v.length <= 20) || "Please fill is the required space",
      ],
    };
  },

  methods: {
    async createLink() {
      const link = cloneDeep(this.link);

      // Convert start date to start of day in UTC timestamp

      /**
       * @note Food for thought
       *
       * When I store it, I convert it to the SGT start of day before converting to UTC
       * 30/5/2020 SGT 12AM ---> 29/5/2020 UTC 4PM
       *
       * When reading in SGT
       * 29/5/2020 UTC 4PM --> 30/5/2020 SGT 12AM
       *
       * However if I read in GMT + 7
       * 29/5/2020 UTC 4PM --> 29/5/2020 SGT 11pm
       *
       * Will this be an issue that needs to be taken care of?
       * Will this affect rrule generation and testing.
       */
      link.dateStart = moment(link.dateStart).startOf("day").utc().unix();

      // Only if dateEnd is given, then do we convert it to timestamp
      if (link.dateEnd)
        link.dateEnd = moment(link.dateEnd).startOf("day").utc().unix();

      const linkID = await this.$store.dispatch("links/newLink", link);

      // @todo Tmp redirect
      this.$router.push({ name: "all-links" });

      // Redirect to show link details
      // if (linkID)
      //   this.$router.push({ name: "linkDetails", params: { linkID } });
    },

    reset() {
      // @todo Make this work
      // this.$refs.form.reset();
    },

    // Remove a tag item
    remove(item) {
      this.link.tags.splice(this.link.tags.indexOf(item), 1);
      this.link.tags = [...this.link.tags];
    },
  },
};
</script>

<style scoped>
#createLinks {
  margin: 4em;
  margin-top: 1em;
  text-align: left;
}
</style>
