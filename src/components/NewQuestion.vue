<template>
  <v-main>
    <v-card outlined>
      <v-card-text>
        <v-row align="center">
          <v-col cols="5">
            <!-- @todo Maybe prepend with question number -->
            <p class="title text-left font-weight-light" style="color: #455a64">
              Question {{ "1" }}
            </p>
          </v-col>

          <v-col cols="7">
            <!-- :hint="question.type.hint" -->
            <v-select
              v-model="question.type"
              :items="questionTypes"
              label="Question type"
              item-text="type"
              item-value="id"
              filled
              outlined
              dense
              single-line
            />
          </v-col>
        </v-row>

        <div v-if="question.type">
          <v-text-field
            v-model="question.question"
            :rules="[(v) => !!v || 'Question is required']"
            placeholder="Question"
            color="#60696c"
            required
          />

          <!-- Different types of question input -->

          <!-- Show multiple choice -->
          <div v-if="question.types === questionTypes[0].id">
            <!-- Add option button -->

            <!-- All the options -->
          </div>

          <!-- Do nothing for short and long answer texts -->
          <div
            v-if="
              question.types === questionTypes[1].id ||
              question.types === questionTypes[2].id
            "
          />

          <!-- <v-textarea
          label="Description"
          type="text"
          @change="sanitized = false"
          v-model="question.description"
          rows="4"
          outlined
          placeholder="Describe this question (optional)"
          no-resize
          color="#60696c"
          required
        /> -->
        </div>
      </v-card-text>
    </v-card>
  </v-main>
</template>

<script>
// @todo Update the layout to use cards to group items together rather than fixed rows and columns
// @todo Add function to validate the inputs, like start and end date cannot be before today

// import moment from "moment";
// import cloneDeep from "lodash.clonedeep";

export default {
  data() {
    return {
      question: {
        name: null,
        description: null,

        // Create date in local timezone for today in the format of e.g. "2020-05-21"
        // dateStart: moment().format("YYYY-MM-DD"),
        // dateEnd: null,

        // ID of questionTypes
        type: undefined,

        multipleChoice: {
          options: [],
        },
      },

      /**
       * Question types
       *
       * Short answer text
       * Long answer text
       * MCQ (using numbers instead of ABC as it is more universal)
       * Enum types (Yes/No/Maybe or Agree/StrAgree/Disagree  -->  Emulated with MCQ for now)
       *
       * todo:
       * date or time input (like when they bought an item or what not)
       * file upload
       */
      questionTypes: [
        { id: 1, type: "Multiple Choice" },
        { id: 2, type: "Short Answer Text" },
        { id: 3, type: "Long Answer Text" },
      ],
    };
  },
};
</script>
