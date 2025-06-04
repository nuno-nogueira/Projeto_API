<template>
  <v-container class="calendar-container">
    <!-- Título com destaque e margem ajustada -->
    <h2 class="text-h5 text-center font-weight-bold mb-6">
      Calendário de Recolha de Resíduos — Junho 2025
    </h2>

    <!-- Legenda compacta e alinhada -->
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

    <!-- Cabeçalho da semana com estilo mais clean -->
    <div class="week-header mb-2">
      <div v-for="(dia, idx) in diasSemana" :key="idx" class="weekday-name">
        {{ dia }}
      </div>
    </div>

    <!-- Dias do mês com hover effect e melhor espaçamento -->
    <div class="month-grid">
      <div
        v-for="(diaObj, idx) in diasMes"
        :key="idx"
        class="day-cell"
        :class="{ 'empty-cell': !diaObj.dia }"
      >
        <template v-if="diaObj.dia">
          <div class="day-number">{{ diaObj.dia }}</div>
          <div class="waste-container">
            <v-chip
              v-for="rid in diaObj.residuos"
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

// Nomes dos dias da semana (dom → sáb)
const diasSemana = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"];

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
  { residuoId: 1, diasSemana: ["SEG"] },
  { residuoId: 2, diasSemana: ["TER"] },
  { residuoId: 3, diasSemana: ["QUA"] },
  { residuoId: 4, diasSemana: ["TER", "SEX"] },
  { residuoId: 5, diasSemana: ["SEG", "QUI"] },
];

// Converte uma data para o nome do dia da semana
const getDiaSemanaStr = (year, month, day) => {
  return diasSemana[new Date(year, month - 1, day).getDay()];
};

// Retorna array de IDs de resíduos para um dia específico
const residuosParaDia = (dia, mes, ano) => {
  const nomeDia = getDiaSemanaStr(ano, mes, dia);
  return plano
    .filter((regra) => regra.diasSemana.includes(nomeDia))
    .map((regra) => regra.residuoId);
};

// Configuração do calendário
const ano = 2025;
const mes = 6; // Maio
const totalDias = new Date(ano, mes, 0).getDate();
const primeiroDiaSemana = new Date(ano, mes - 1, 1).getDay();

// Prepara array de dias usando ref e função mais limpa
const diasMes = ref([]);

const gerarCalendario = () => {
  // Dias vazios no início
  const emptyDays = Array(primeiroDiaSemana).fill({ dia: null, residuos: [] });

  // Dias do mês
  const monthDays = Array.from({ length: totalDias }, (_, i) => ({
    dia: i + 1,
    residuos: residuosParaDia(i + 1, mes, ano),
  }));

  diasMes.value = [...emptyDays, ...monthDays];
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

/* Grid de dias do mês */
.month-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0;
  border-top: 1px solid #e0e0e0;
}

/* Cada célula de dia com tamanho fixo e bordas uniformes */
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

/* Número do dia no topo */
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
</style>
