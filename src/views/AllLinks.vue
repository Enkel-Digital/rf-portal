<template>
  <v-main id="AllClasses">
    <!-- Dialog to inform user to verify email before redirecting them to the login page -->
    <v-dialog v-model="showDialog" max-width="60%">
      <v-card>
        <img :src="imageDataURI" alt="QR code" width="100%" height="100%" />

        <v-card-actions>
          <v-spacer />
          <v-btn color="green" fab>
            <a
              :href="imageDataURI"
              :download="`${qrcodeImageName}-qrcode`"
              style="text-decoration: none; color: white"
            >
              <v-icon>mdi-download</v-icon>
            </a>
          </v-btn>
          <v-btn @click="showDialog = false" fab>
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <masonry :cols="2">
      <v-card v-for="link in links" :key="link.id" class="link-card" outlined>
        <v-list-item one-line dense>
          <v-list-item-content>
            <!-- Have another feature where you can scan the code on mobile and it will tell you which code it is -->

            created on: {{ moment.unix(link.createdAt).format("LLLL") }}
            <br />

            name: {{ link.name }}
            <br />

            description: {{ link.description }}
            <br />

            dateStart: {{ moment.unix(link.dateStart).format("L") }}
            <br />

            dateEnd: {{ link.dateEnd || "No ending date specified" }}
            <br />
            <br />
          </v-list-item-content>
        </v-list-item>

        <v-card-actions>
          <!-- Spacer to push all to alight right -->
          <v-spacer />

          <!-- FAB to delete link -->
          <v-btn
            class="mx-2"
            fab
            dark
            small
            color="red darken-1"
            @click="deleteLink(link.id)"
          >
            <v-icon dark>mdi-delete</v-icon>
          </v-btn>

          <!-- FAB to show QR code -->
          <v-btn
            class="mx-2"
            fab
            dark
            small
            color="green darken-1"
            @click="showQRcode(link.link, link.name)"
          >
            <v-icon dark>mdi-qrcode</v-icon>
          </v-btn>

          <!-- BTN to copy link to clipboard -->
          <v-btn class="mx-2" color="primary" @click="copyLink(link.link)" dark>
            copy link
          </v-btn>
        </v-card-actions>
      </v-card>
    </masonry>
  </v-main>
</template>

<script>
import { mapState, mapActions } from "vuex";
import QRCode from "qrcode";

export default {
  name: "AllLinks",

  created() {
    this.$store.dispatch("links/getLinks");
  },

  data() {
    return {
      showDialog: false,
      imageDataURI: undefined,
      qrcodeImageName: "QR Code",
    };
  },

  computed: {
    ...mapState("links", ["bot"]),
    links() {
      // Return links for current bot only
      return this.bot[this.$store.state.bots.current.id];
    },
  },

  methods: {
    copyLink(link) {
      // Show something to indicate copied
      // @todo implement Toastbox component
      navigator.clipboard.writeText(link).then(console.log);
    },

    async showQRcode(link, name) {
      this.imageDataURI = await QRCode.toDataURL(link, {
        // Use high error resistance rate of ~ 30%
        errorCorrectionLevel: "H",
        // 900px is a good big image
        // @todo Allow users to customize this.
        width: 900,
      });
      this.showDialog = true;
      this.qrcodeImageName = name;
    },

    ...mapActions("links", ["deleteLink"]),
  },
};
</script>

<style scoped>
#AllClasses {
  margin: 2em;
  margin-top: 2em;
  text-align: left;
}

.link-card {
  display: inline-block;
  margin-bottom: 0.5em;
}
</style>
