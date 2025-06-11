<template>
  <div ref="mapDiv" class="google-map"></div>
</template>

<script>
import { Loader } from "@googlemaps/js-api-loader";

export default {
  name: "GoogleMap",
  props: {
    center: {
      type: Object,
      required: true,
    },
    zoom: {
      type: Number,
      default: 13,
    },
    markers: {
      type: Array,
      default: () => [],
    },
  },
  mounted() {
    this.initializeMap();
    console.log("Markers recebidos:", this.markers);

  },
  methods: {
    async initializeMap() {
      // 1) Usa props.apiKey em vez de uma string fixa
      const loader = new Loader({
        apiKey: "AIzaSyBWDBV60KO4k505pCU0ltRqyDNCG08vu1s",
        version: "weekly",
      });

      // 2) load the Google Maps JavaScript API
      const google = await loader.load();

      // 3) initialize the map
      const map = new google.maps.Map(this.$refs.mapDiv, {
        center: this.center,
        zoom: this.zoom,
      });
      //4) create an info window
      const infoWindow = new google.maps.InfoWindow({ maxWidth: 300 });

      // 5) Adiciona os marcadores
      this.markers.forEach((marker) => {
        console.log("Adicionando marcador:", marker);
        console.log("Todos marcadores recebidos:", this.markers);


        const markerInstance = new google.maps.Marker({
          position: marker.position,
          map,
          title: marker.title,
          icon: {
            url:
              "data:image/svg+xml;charset=UTF-8," +
              encodeURIComponent(`
               <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="73" height="998" viewBox="0 0 73 98">
                    <image xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEkAAABiCAYAAAAcGP4pAAAAAXNSR0IArs4c6QAABkZJREFUeF7tnU9y1TgQxmVWYQOcAi4RUsOKBZVbABeABRRTNVA1VFjABYBbBBas+JdLwCmAzWTFm2qTfrT7SVbL6m7JKd6CmrzIlvXz11+3ZDkzBOfPldt7f0GXmyH8Q7vehDB+Tz9DCB/w580QPsJ/X/gZPnx7fbr93uPyB+tOAAoCiYFY2j8ABHA/Xp4+XnoO6XEmkKzApAZlDUwVEsLRVIz0bm/bDeGJtrrUIF26u/c4bKY+UzxAzQMUYVVDAvX8HMJ7zfFpnQvC8Pur0xu156uCdPnO3vumoSUdfaWqFkHqwnukgLBdBahiSN15TwGspeFXBGnNgH4LqtynxJDOA6CloESQzhOgJaCykHpO8QV2FG0q9agspEt39ja1F9P18YKsNwtpNXVQ5V24sAk35lYWkpCsfejh4d/j0I6O/60cos7hc6CikDx86O29d9vR3XpxU2ekFWeZ86coJGsVwVgopKM3T8PJl08VQ9Q5NKWmHUi1gN7efxf2rx5sr/rZ8dNoSO1fOxhBpX6vM+yys6TUtAupMptxSHiZKRjgTb34ElxrTE0TSLUqgk5QIbF72JNqUhqLqWkCSSvlf3/53yTc4IcHh48CGHQP3pMLQq6mLSQNFWHnEEIABT8nXz+FW8/bZ7AcnNSUxQQSdBYDdXTcRxaTwKJq+g2p0rBjHXNQ0GYtIRfIdGWE5FE8Su5eT22ogY+QNP2odKBQMsx9Tr58blYi/Hh1OvIZ/9HKaqWAYuEYO0erEEVf+qUkAz+SAMNSAeqnz193pyUPDx+N1Xur7IghN7TyI1QRLzChGKW1FIJsoaYtpFZ+hIO/fPfiRHTwPQWHMFupCXxpaAEppSLqURQezgdbTGuaQEqBmKvS6XzQO+zAvAfvzEbNms7+8XsIK1xqoUBQTd5h5w4ppy
                    IEkPKhJiY+hCeuSsqpiHoOB0IBu6rJExL6Ch9gzsSh/bhOdbba6W7enpBgoKlVy7HqZ6UAbw+wcBUBgMPHZW3KCxIOahw4eUqCBZJ0HZwu5rmtKHhAoumbTj9KVcA9CcMvpkDJlEjcxgNSbBJb6iuxrOhVYI4lgGXFzQfHgUkLwxgQqlBLNY2QLCe4sZRPzVs6uFRm9FDTOC2xgpRK7alaKecRCISqz2O6MkKyWE/KVdalnjTWSWdPfHmdZTpdOVvnNlmZjKklBS6nIPp7dzVRSJohl4KxNMwopFzVrj5dsYIUkz+vcWLqoQv+tPjklXVMTdDGYvI7eRCg+TCAm+n1qweTp7lz4YXZbm76gsdz1WgodXJt/LmbJiQ65+ID4QrBi8IFf8xcVI10Gw8HjO1TmbTE73baxiBp+lJpoce9JhVS3J/gZ6pUad0lgYehBm1NdpVQNUnSPVeCBBIOVD3MflGZvDM3gWSlJuojsbvIJ6u0ko49j8NzoIokN0Kinm2bOUhW3iS5QDpQiXHTc2qGGZyXhtpOuMEXmmricFLGzdM8hN/+tesStoHvFcCtz3Dwom2Gkc3v8d23jR57i6hkGvGarHRPFFdRVEnwpeXyiQYIfg7cmQKqgh12ELp0p510SYYbNvaTfCPA+3lcDbzYZlb6/E46XYmpKKkka2+qAZI6NreNJ6ummRdxztULOGjaYPq4ZUfkSZk3lf68yhVJ+VytWUiWJYFF2BWfs/Z9N+xwTSZeBEkAaNa4eWettgwWDbqwcSqbFYcbHnDuwk6ooiIlrbHITAqrAFAxJDhg7f4kfYObAs5mN3431h52Uh+qgrTqsCsMs+zcLZcoVhd2CwEt8iQKbzVlQQWgakhr8aclPlTtSRM19fa33HYrweo/hFec3WJe1a0/VYZZtXFTWF2GnRKgak/qOexqfUjVk3oElfsrNrnyZvEEV3ri5v6kGGaqntSNPxkAUvWk1mG3ZOIqjQ6VEqCHskDTqM09iXbg5k9GYWbmSe7+ZAzIzJPc/MkBkAsk6MQq7Cx9yKyYnMsW2ssq2gXj3LWbZTfeqer8zinMXIybg1LZ0uMMyM2TtMoCy4Kxi3DTAOVl1K7FZOruLPKnBmHWxJMW108NATXxpGJQjQE1h5QrNFsZdReetFMaJLZEtzLqLiHFjNyzos6tK7lV3LkLmRSaHfhQk7lbDhL8fgQFGz0d/p9tkuvBNv8DGu6edxIGXlAAAAAASUVORK5CYII=" x="0" y="0" width="73" height="98"/>
                  </svg>
              `),
            anchor: new google.maps.Point(20, 46),
            scaledSize: new google.maps.Size(60, 60),
          },
        });
        markerInstance.addListener("click", () => {
          const content = `
            <div class="info-window">
              <h1>${marker.type.toUpperCase()}</h1>
              <br>
              <h3>${marker.title}</h3>
              <p class="info-window-address">${marker.address}</p>
              <p>${marker.description}</p>
            </div>
          `;
          infoWindow.setContent(content);
          infoWindow.open(map, markerInstance);
        });
      });
    },
  },
};
</script>

<style scoped>
.google-map {
  width: 100%;
  height: 800px;
}
:deep(.info-window) {
  padding: 12px;
  color: #242f3e;
}

:deep(.info-window-image) {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 12px;
}

:deep(.info-window-address) {
  color: #757575;
  font-size: 14px;
  margin: 4px 0;
}

:deep(.info-window h3) {
  margin: 0 0 8px;
  font-size: 18px;
}

:deep(.info-window p) {
  margin: 0 0 12px;
}
</style>
