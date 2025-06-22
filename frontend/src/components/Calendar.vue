<!-- <template>
  <v-container class="calendar-container">

    <h2 class="text-h5 text-center font-weight-bold mb-6">
      Calendário de Recolha de Resíduos — Junho 2025
    </h2>


    <v-row justify="center" class="mb-6 legend-row">
      <v-col
        v-for="res in residuos"
        :key="res.id"
        cols="auto"
        class="legend-item"
      >
        <v-chip small :color="res.cor" text-color="dark" class="ma-1">
          <v-icon left small>{{ res.icon }}</v-icon>
          {{ res.nome }}
        </v-chip>
      </v-col>
    </v-row>

    <div class="week-header mb-2">
      <div v-for="(day, idx) in weekDays" :key="idx" class="weekday-name">
        {{ day }}
      </div>
    </div>


    <div class="month-grid">
      <div
        v-for="(dayObj, idx) in daysMes"
        :key="idx"
        class="day-cell"
        :class="{ 'empty-cell': !dayObj.day }"
      >
        <template v-if="dayObj.day">
          <div class="day-number">{{ dayObj.day }}</div>
          <div class="waste-container">
            <v-chip
              v-for="rid in dayObj.residuos"
              :key="rid"
              small
              :color="residuosPorId[rid].cor"
              text-color="dark"
              class="waste-chip"
            >
              <v-icon x-small left>{{ residuosPorId[rid].icon }}</v-icon>
              <span>{{ residuosPorId[rid].nome }}</span>
            </v-chip>
          </div>
        </template>
      </div>
    </div>
  </v-container>
</template>

<script setup>
import { ref, computed } from "vue";

// Nomes dos days da semana (dom → sáb)
const weekDays = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"];

// Resíduos com cores mais vivas e ícones
const residuos = [
  { id: 1, nome: "Plástico", cor: "yellow accent-2", icon: "mdi-bottle-soda" },
  { id: 2, nome: "Vidro", cor: "green accent-2", icon: "mdi-glass-wine" },
  {
    id: 3,
    nome: "Papel/Cartão",
    cor: "blue accent-2",
    icon: "mdi-file-document",
  },
  {
    id: 4,
    nome: "Indiferenciado",
    cor: "grey lighten-2",
    icon: "mdi-trash-can",
  },
  { id: 5, nome: "Orgânico", cor: "brown lighten-1", icon: "mdi-food-apple" },
];

// Cria um lookup rápido por ID usando computed para melhor performance
const residuosPorId = computed(() => {
  return residuos.reduce((acc, r) => {
    acc[r.id] = r;
    return acc;
  }, {});
});

// Plano de recolha para Maio 2025
const plano = [
  { residuoId: 1, weekDays: ["SEG"] },
  { residuoId: 2, weekDays: ["TER"] },
  { residuoId: 3, weekDays: ["QUA"] },
  { residuoId: 4, weekDays: ["TER", "SEX"] },
  { residuoId: 5, weekDays: ["SEG", "QUI"] },
];

// Converte uma data para o nome do day da semana
const getdaySemanaStr = (year, month, day) => {
  return weekDays[new Date(year, month - 1, day).getDay()];
};

// Retorna array de IDs de resíduos para um day específico
const residuosParaday = (day, mes, ano) => {
  const nomeday = getdaySemanaStr(ano, mes, day);
  return plano
    .filter((regra) => regra.weekDays.includes(nomeday))
    .map((regra) => regra.residuoId);
};

// Configuração do calendário
const ano = 2025;
const mes = 6; // Maio
const totaldays = new Date(ano, mes, 0).getDate();
const primeirodaySemana = new Date(ano, mes - 1, 1).getDay();

// Prepara array de days usando ref e função mais limpa
const daysMes = ref([]);

const gerarCalendario = () => {
  // days vazios no início
  const emptyDays = Array(primeirodaySemana).fill({ day: null, residuos: [] });

  // days do mês
  const monthDays = Array.from({ length: totaldays }, (_, i) => ({
    day: i + 1,
    residuos: residuosParaday(i + 1, mes, ano),
  }));

  daysMes.value = [...emptyDays, ...monthDays];
};

gerarCalendario();
</script>

<style scoped>
.calendar-container {
  /* max-width: 800px; */
  margin: 100px auto;
  padding: 20px;
}

.legend-row {
  margin-bottom: 24px;
}

.legend-item {
  padding: 4px !important;
}

/* Grid de cabeçalho */
.week-header {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  font-weight: 500;
  color: #424242;
  border-bottom: 1px solid #e0e0e0;
}

.weekday-name {
  padding: 8px 0;
  font-size: 0.875rem;
}

/* Grid de days do mês */
.month-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0;
  border-top: 1px solid #e0e0e0;
}

/* Cada célula de day com tamanho fixo e bordas uniformes */
.day-cell {
  width: 100%;
  height: 100px;
  border-left: 1px solid #e0e0e0;
  border-bottom: 1px solid #e0e0e0;
  background-color: #ffff;
  display: flex;
  flex-direction: column;
  transition: all 0.2s ease;
}

.day-cell:first-child,
.day-cell:nth-child(7n + 1) {
  /* Remove borda esquerda da primeira coluna de cada linha */
  border-left: none;
}

.day-cell:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

/* Estilo para célula vazia (mantém as bordas) */
.empty-cell {
  background-color: transparent;
}

/* Número do day no topo */
.day-number {
  text-align: right;
  font-weight: 600;
  padding: 4px 6px;
  font-size: 0.875rem;
}

/* Container que agrupa blocos de resíduos */
.waste-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 0 4px 4px;
  flex: 1;
  overflow-y: auto;
}

/* Cada “chip” de resíduo ocupa toda largura possível, com margens internas */
.waste-chip {
  width: calc(100% - 8px);
  justify-content: flex-start;
}
</style> -->

<template>
  <v-container class="calendar-container">
    <h2 class="text-h5 text-center font-weight-bold mb-6">
      Calendário de Recolha de Resíduos — 2025
      <pre>{{ wasteByWeekday }}</pre>
    </h2>

    <!-- Dias da semana -->
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
  margin: 100px auto;
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
