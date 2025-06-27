<template>

  <GoogleMap
    :key="mapKey"
    :center="{ lat: 41.3662, lng: -8.7418871 }"
    :zoom="15"
    :markers="collectionPointsArray"
  />
  <div class="map-page">
    <GoogleMap
      :center="{ lat: 41.3662, lng: -8.7418871 }"
      :zoom="15"
      :markers="collectionPointsArray"
      @select-marker="openFeedbackOverlay"
    />

   <v-slide-x-reverse-transition>
  <v-card
    v-if="selectedMarkerData"
    class="pa-4 feedback-overlay"
    elevation="12"
    width="400"
    style="position: absolute; right: 0; top: 0; height: 100%; z-index: 999;"
  >
    <v-card-title class="text-h6">
      Reportar Problema
    </v-card-title>

    <v-card-subtitle>
      <v-row>
        <v-col cols="12">
          <strong>Tipo:</strong> {{ selectedMarkerData.type }}
        </v-col>
        <v-col cols="12">
          <strong>Local:</strong> {{ selectedMarkerData.address }}
        </v-col>
      </v-row>
    </v-card-subtitle>

    <v-card-text>
      <v-textarea
        v-model="feedbackText"
        label="Descreva o problema"
        auto-grow
        outlined
        rows="3"
      />
    </v-card-text>

    <v-card-actions class="justify-end">
      <v-btn color="#09A129" @click="submitFeedback">
        Enviar
      </v-btn>
      <v-btn text @click="closeFeedbackOverlay">
        Cancelar
      </v-btn>
    </v-card-actions>
  </v-card>
</v-slide-x-reverse-transition>

  </div>
</template>

<script>
import GoogleMap from "../components/Map.vue";
import collectionPoints from "@/api/collectionPoints";

export default {
  name: "MapView",
  components: {
    GoogleMap,
  },
  data() {
    return {
      collectionPointsArray: [],
      selectedMarker: null,
      feedbackText: "",
      drawer: true,
    };
  },

  computed: {
    mapKey() {
      return this.collectionPointsArray.length;
    }
  },

  async created() {
    try {
      const res = await collectionPoints.allCollectionPoints({
        route_type: "map",
      });
      const points = res.data?.data?.rows ?? [];
      console.log(points);
      this.collectionPointsArray = points.map((point) => {
        const [lat, lng] = point.geographical_coordinates.split(",");
        return {
          position: { lat: parseFloat(lat), lng: parseFloat(lng) },
          title: point.street_name,
          type: point.collection_point_type,
          address: `${point.street_name} nº${point.door_number} ,${point.postal_code} `,
          description: point.opening_hours
            ? `Horário de funcionamento: ${point.opening_hours}`
            : "Sem horário definido",
          id: point.collection_point_id,
        };
      });

      console.log(this.collectionPointsArray, this.selectedMarker);
    } catch (error) {
      console.error("Erro ao carregar os pontos:", error);
    }
  },

  methods: {
    openFeedbackOverlay(markerId) {
      this.selectedMarker = markerId;
      this.drawer = true;
    },

    closeFeedbackOverlay() {
      this.selectedMarker = null;
      this.feedbackText = "";
      this.drawer = true;
    },

    submitFeedback() {
      console.log("Feedback enviado:", {
        id: this.selectedMarker,
        feedback: this.feedbackText,
      });

      this.closeFeedbackOverlay();
    },
  },

  computed: {
    selectedMarkerData() {
      return this.collectionPointsArray.find(
        (point) => point.id === this.selectedMarker
      );
    },
  },
};
</script>

<style scoped>
.map-page {
  position: relative;
}

.feedback-overlay {
  position: absolute;
  right: 0;
  top: 0;
  width: 350px;
  height: 100%;
  background: #fff;
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.2);
  padding: 20px;
  z-index: 999;

}

textarea {
  width: 100%;
  height: 120px;
  margin-top: 10px;
  margin-bottom: 10px;
  resize: none;
}
</style>
