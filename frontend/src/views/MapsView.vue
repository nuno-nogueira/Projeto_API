<template>
  <GoogleMap
    :center="{ lat: 41.3662, lng: -8.7418871 }"
    :zoom="15"
    :markers="collectionPointsArray"
  />
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
    };
  },
  async created() {
    try {
      const res = await collectionPoints.allCollectionPoints({route_type: 'map'})
      const points = res.data?.data?.rows ?? [];
      console.log(points);
      this.collectionPointsArray = points.map((point) => {
        const [lat, lng] = point.geographical_coordinates.split(",");
        return {
          position: { lat: parseFloat(lat), lng: parseFloat(lng) },
          title: point.street_name,
          type: point.collection_point_type,
          address: `${point.street_name}, ${point.postal_code} ${point.door_number}`,
          description: point.opening_hours
            ? `Horário de funcionamento: ${point.opening_hours}`
            : "Sem horário definido",
          id: point.id,
        };
      });

      console.log(this.collectionPointsArray);
    } catch (error) {
      console.error("Erro ao carregar os pontos:", error);
    }
  },
};
</script>

<!-- <template>
  <div class="min-h-screen bg-gray-50">
    <Calendar />
  </div>
</template>

<script >
import Calendar from '../components/Calendar.vue'
import collectionPlan from "@/api/collectionPlan";

export default {
  name: "CalendarView",
  components: {
    Calendar,
  },
  data() {
    return {
      year:null,
      waste_id: null,
      zone_id: null,
      colection_days: null,
    };
  },
  async created() {
    try {
      const res = await collectionPlan.getAllPlans();
      const plans = res.data.data;

      console.log(this.planArray);
    } catch (error) {
      console.error("Erro ao carregar os planos:", error);
    }
  },
};
  
</script> -->
