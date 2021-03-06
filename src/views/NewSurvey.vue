<template>
  <v-main id="createSurvey">
    <v-row>
      <v-col cols="12" sm="6">
        <v-card outlined ref="form" v-model="valid">
          <v-card-text>
            <h2 style="color: #455a64" class="text-left font-weight-light">
              SURVEY DETAILS
            </h2>
            <br />

            <!-- @todo Show the SGT somewhere on this page -->

            <!-- @todo Tell the biz user that this is what the user first sees when they open up the chat -->

            <v-text-field
              v-autofocus
              v-model="survey.name"
              :rules="nameRules"
              label="Name"
              placeholder="E.g. Product 'X' feedback survey"
              color="#60696c"
              required
            />

            <!-- @todo Why single-line attr.? -->
            <v-combobox
              v-model="survey.tags"
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
              v-model="survey.description"
              rows="4"
              outlined
              placeholder="Describe this survey (optional)"
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
                  v-model="survey.dateStart"
                  label="Survey activation date"
                  prepend-icon="mdi-calendar-month"
                  color="#60696c"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                />
              </template>
              <v-date-picker
                v-model="survey.dateStart"
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
                  v-model="survey.dateEnd"
                  label="Survey deactivation date (optional)"
                  prepend-icon="mdi-calendar-month"
                  color="#60696c"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                />
              </template>
              <v-date-picker
                v-model="survey.dateEnd"
                header-color="#60696c"
                color="#60696c"
                event-color="#60696c"
                @input="showEndDateMenu = false"
              />
            </v-menu>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Show total length of survey validity, e.g. 14 days -->
    </v-row>

    <br />
    <hr />

    <NewQuestion />

    <br />
    <hr />

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
          @click="createSurvey"
        >
          Create survey
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
import NewQuestion from "@/components/NewQuestion.vue";

export default {
  name: "NewSurvey",

  components: {
    NewQuestion,
  },

  data() {
    return {
      showStartDateMenu: false,
      showEndDateMenu: false,

      // @todo Update this to be populated by an API instead
      tags: ["vip", "newUser", "secondPurchase", "christmas-promo"],

      survey: {
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
    async createSurvey() {
      const survey = cloneDeep(this.survey);

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
      survey.dateStart = moment(survey.dateStart).startOf("day").utc().unix();

      // Only if dateEnd is given, then do we convert it to timestamp
      if (survey.dateEnd)
        survey.dateEnd = moment(survey.dateEnd).startOf("day").utc().unix();

      const surveyID = await this.$store.dispatch("surveys/newsurvey", survey);

      // @todo Tmp redirect
      this.$router.push({ name: "all-surveys" });

      // Redirect to show survey details
      // if (surveyID)
      //   this.$router.push({ name: "surveyDetails", params: { surveyID } });
    },

    reset() {
      // @todo Make this work
      // this.$refs.form.reset();
    },

    // Remove a tag item
    remove(item) {
      this.survey.tags.splice(this.survey.tags.indexOf(item), 1);
      this.survey.tags = [...this.survey.tags];
    },
  },
};
</script>

<style scoped>
#createSurvey {
  margin: 4em;
  margin-top: 1em;
  text-align: left;
}
</style>
