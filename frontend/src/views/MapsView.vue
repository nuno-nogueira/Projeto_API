<template>
  <GoogleMap
    :center="{ lat: 41.3662, lng: -8.7418871 }"
    :zoom="15"
    :markers="CollectionPoints"
  />
</template>

<script>
import GoogleMap from "../components/Map.vue";
import collectionPoints from "@/api/collectionPoints";

export default {
  name: "MapView",
  components: {
    GoogleMap 
  },
  data() {
    return {

      
      CollectionPoints: [
        {
          position: { lat: 41.3662, lng: -8.7418871  },
          title: "Ponto 1",
          address: "Av. Paulista, 1000",
          description: "Descrição do ponto 1",
          image: "https://via.placeholder.com/300x150"
        },
      ]
    };
  }
};
</script>


<!-- <template>
  <div class="min-h-screen bg-gray-50">
    <Calendar />
  </div>
</template>

<script setup>
import Calendar from '../components/Calendar.vue'
</script> -->
