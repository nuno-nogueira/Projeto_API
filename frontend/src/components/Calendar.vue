<template>
  <v-container class="calendar-container">
    <h2 class="text-h5 text-center font-weight-bold mb-6">
      Calendário de Recolha de Resíduos — 2025
    </h2>

    <div class="week-header mb-2">
      <div
        v-for="(day, index) in weekDays"
        :key="index"
        class="weekday-name"
      >
        {{ day }}
      </div>
    </div>

    <!-- Grelha de recolha -->
    <div class="month-grid single-row">
      <div
        v-for="(day, index) in weekDays"
        :key="index"
        class="day-cell"
      >
        <div class="waste-container">
          <v-chip
            v-for="waste in wasteByWeekday[day]"
            :key="waste.id"
            small
            :color="waste.color"
            class="waste-chip "
          >
            <v-icon x-small left>{{ waste.icon }}</v-icon>
            <span>{{ waste.name }}</span>
          </v-chip>
        </div>
      </div>
    </div>
    <br><br><br>
    <!-- Legenda -->
    <v-row justify="left" class="mb-6 legend-row">
      <v-col
        v-for="waste in wasteTypes"
        :key="waste.id"
        cols="auto"
        class="legend-item"
      >
        <v-chip small :color="waste.color" class="ma-1 waste-chip subtitle">
          <v-icon left small>{{ waste.icon }}</v-icon>
          {{ waste.name }}
        </v-chip>
      </v-col>
    </v-row>

    <h5>NOTA:</h5>
    <p>Não se realizam recolhas nos fins de semana e feriados</p>
  </v-container>
</template>

<script>
import { computed } from "vue";

export default {
  name: "WasteCalendar",
  props: {
    wasteSchedule: {
      type: Array,
      default: () => [],
    },
    wasteTypes: {
      type: Array,
      default: () => [],
    },
  },
  setup(props) {
    const weekDays = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SAB"];

    const wasteById = computed(() => {
      return props.wasteTypes.reduce((map, waste) => {
        map[waste.id] = waste;
        return map;
      }, {});
    });

 const wasteByWeekday = computed(() => {
  const map = {};
  weekDays.forEach((day) => {
    map[day] = [];
  });

  props.wasteSchedule.forEach((rule) => {
    rule.weekDays.forEach((day) => {
      const waste = wasteById.value?.[rule.wasteId];
      if (waste && map[day]) {
        map[day].push(waste);
      }
    });
  });

  return map;
});

    console.log("wasteByWeekday", wasteByWeekday.value);

    return {
      weekDays,
      wasteByWeekday,
    };
  },
};
</script>


<style scoped>
.calendar-container {
  margin: 30px auto;
  padding: 20px;
}

.legend-row {
  margin-bottom: 24px;
}

.legend-item {
  padding: 4px !important;
}

.week-header {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  font-weight: 500;
  color: var(--color-Gunmetal);
  border-bottom: 1px solid #e0e0e0;
}

.weekday-name {
  padding: 8px 0;
  font-size: 0.875rem;
}

.month-grid.single-row {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  border-top: 1px solid #e0e0e0;
}

.day-cell {
  height: 100px;
  border-left: 1px solid #e0e0e0;
  border-bottom: 1px solid #e0e0e0;
  background-color: #fff;
  display: flex;
  flex-direction: column;
}

.day-cell:first-child {
  border-left: none;
}

.waste-container {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 8px;
  flex: 1;
  overflow-y: auto;
}

.waste-chip {
  width: 100%;
  justify-content: flex-start;
}

.waste-chip.subtitle span,
.waste-chip.subtitle .v-chip__content {
  color: #000 !important;
}
</style>
