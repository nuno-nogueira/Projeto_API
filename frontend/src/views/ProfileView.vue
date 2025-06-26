<template>
  <div style="margin-top: 100px" v-if="user.user_type == 'morador'">
    <v-tabs
      v-model="tab"
      class="custom-tab"
      bg-color="transparent"
      color="black"
      grow
    >
      <v-tab text="Editar Perfil" value="1" color="#09A129"></v-tab>
      <v-tab text="Estatísticas" value="2" color="#09A129"></v-tab>
      <v-tab text="Plano de Recolha" value="3" color="#09A129"></v-tab>
    </v-tabs>

    <v-tabs-window v-model="tab">
      <v-tabs-window-item value="1">
        <v-form ref="form" v-model="form" @submit.prevent="submitChanges">
          <v-card class="px-6 py-8 form-card" max-width="950" elevation="0">
            <v-row justify="space-around">
              <v-col cols="12" md="5">
                <v-text-field
                  v-model="name"
                  :counter="12"
                  :error-messages="v$.name.$errors.map((e) => e.$message)"
                  variant="outlined"
                  class="mb-2 form-input"
                  label="Nome"
                  prepend-inner-icon="mdi-account"
                  clearable
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="5">
                <v-text-field
                  v-model="surname"
                  :counter="12"
                  :error-messages="v$.surname.$errors.map((e) => e.$message)"
                  variant="outlined"
                  class="mb-2 form-input"
                  label="Apelido"
                  prepend-inner-icon="mdi-account"
                  clearable
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row justify="space-around">
              <v-col cols="12" md="5">
                <v-text-field
                  v-model="tin"
                  :counter="12"
                  :error-messages="v$.tin.$errors.map((e) => e.$message)"
                  variant="outlined"
                  class="mb-2 form-input"
                  label="NIF"
                  clearable
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="5">
                <v-text-field
                  v-model="oldPassword"
                  :error-messages="
                    v$.oldPassword.$errors.map((e) => e.$message)
                  "
                  variant="outlined"
                  :append-icon="visible1 ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="visible1 ? 'text' : 'password'"
                  @click:append="visible1 = !visible1"
                  class="mb-2 form-input"
                  label="Insira password para alterar info"
                  clearable
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="5">
                <v-text-field
                  v-model="newPassword"
                  :error-messages="
                    v$.newPassword.$errors.map((e) => e.$message)
                  "
                  variant="outlined"
                  :append-icon="visible2 ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="visible2 ? 'text' : 'password'"
                  class="mb-2 form-input"
                  label="Nova Palavra Passe"
                  @click:append="visible2 = !visible2"
                  clearable
                  loading
                >
                  <!-- <template v-slot:loader>
                                        <v-progress-linear
                                            :color = "color"
                                            :model-value = "progress"
                                            height="5"
                                        ></v-progress-linear>
                                    </template> -->
                </v-text-field>
              </v-col>
            </v-row>
            <v-row justify="space-evenly">
              <v-col cols="8" md="3">
                <v-text-field
                  v-model="postal_code"
                  :error-messages="
                    v$.postal_code.$errors.map((e) => e.$message)
                  "
                  variant="outlined"
                  class="mb-2 form-input"
                  label="Código Postal"
                  clearable
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="address"
                  :error-messages="v$.address.$errors.map((e) => e.$message)"
                  :counter="40"
                  variant="outlined"
                  class="mb-2 form-input"
                  label="Morada"
                  clearable
                ></v-text-field>
              </v-col>
              <v-col cols="4" md="2">
                <v-text-field
                  v-model="door_number"
                  :error-messages="
                    v$.door_number.$errors.map((e) => e.$message)
                  "
                  variant="outlined"
                  class="mb-2 form-input"
                  label="Andar"
                  clearable
                >
                </v-text-field>
              </v-col>
            </v-row>
            <v-row justify="space-around">
              <v-col col="12" md="5">
                <v-text-field
                  v-model="phone_number"
                  :error-messages="
                    v$.phone_number.$errors.map((e) => e.$message)
                  "
                  :counter="9"
                  variant="outlined"
                  class="mb-2 form-input"
                  label="Telefone"
                  prepend-inner-icon="mdi-phone"
                  clearable
                ></v-text-field>
              </v-col>
              <v-col col="12" md="5">
                <v-text-field
                  v-model="email"
                  :error-messages="v$.email.$errors.map((e) => e.$message)"
                  :counter="36"
                  variant="outlined"
                  class="mb-2 form-input"
                  label="Email"
                  prepend-inner-icon="mdi-email"
                  clearable
                >
                </v-text-field>
              </v-col>
            </v-row>
            <v-row justify="space-between">
              <v-col col="12" md="5">
                <v-switch
                  v-model="door_to_door_service"
                  color="success"
                  label="Serviço Porta a Porta"
                  inset
                ></v-switch>
              </v-col>
              <v-col col="12" md="5">
                <v-btn
                  color="success"
                  size="large"
                  @click="submitChanges"
                  variant="elevated"
                  block
                  >Guardar Alterações</v-btn
                >
              </v-col>
            </v-row>
          </v-card>
        </v-form>

        <img
          src="../assets/icons/edit_profile.webp"
          class="edit_profile_icon"
          alt=""
        />
      </v-tabs-window-item>
      <v-tabs-window-item value="2">
        <v-card
          class="mx-auto px-6 py-8"
          max-width="900"
          v-if="!door_to_door_service"
        >
          <v-row justify="center">
            <v-col
              cols="12"
              md="8"
              lg="6"
              class="d-flex flex-column align-center text-center"
            >
              <img
                src="../assets/icons/statistics.webp"
                class="statistics_icon"
                alt="Camião do Lixo"
              />
              <br />
              <span class="font-weight-black mb-4"
                >Ainda não tem dados de recolha</span
              >
              <v-card-text>
                <p>
                  O serviço de recolha porta-a-porta foi criado para facilitar a
                  gestão de resíduos no seu bairro. Ao registar-se pode
                  solicitar a recolha diretamente na sua porta, sem necessidade
                  de deslocamento até um ponto de recolha. 
                </p>
              </v-card-text>
              <v-btn
                color="success"
                size="large"
                @click="activateService"
                variant="elevated"
                class="activate-service"
                block
                >Solicitar Serviço de Recolha</v-btn
              >
            </v-col>
          </v-row>
        </v-card>
        <v-card
          class="mx-auto px-6 py-8"
          max-width="90%"
          v-if="door_to_door_service"
        >
        <!-- Taxa lixo -->
          <v-container>
            <v-row>
              <v-col cols="4" md="12">
                <v-card class="mx-auto px-6 py-8" 
                max-width="90%" 
                v-if="door_to_door_service">
                    <v-container>
                        <v-row>
                            <v-col cols="4" md="4">
                                <v-card elevation="0">
                                    <template v-slot:title>
                                        <span style="margin-left: 15px;" class="font-weight-black">Taxa de lixo mensal</span>
                                        <v-card-text>
                                            <p>Estimativa com base na produção mensal de <br>resíduos indiferenciados.</p>
                                        </v-card-text>
                                        <v-row>
                                            <v-col cols="12" md="4">
                                                <h2 class="tax">13,70€</h2>
                                            </v-col>
                                            <v-col cols="12" md="4">
                                                <img class="trash_icon" src="../assets/icons/trash_icon.webp" alt="">
                                            </v-col>
                                        </v-row>
                                    </template>
                                </v-card>
                            </v-col>
                            <v-col cols="4" md="8" sm="8">
                                <apex-chart
                                type="line"
                                height="300"
                                :options="chartOptions"
                                :series="chartSeries"></apex-chart>
                            </v-col>
                        </v-row>
                    </v-container>
                    <v-container>
                        <h3>Meus Feedbacks</h3>
                        <v-table>
                            <thead>
                                <tr>
                                    <th class="text-left">DESCRIÇÃO</th>
                                    <th class="text-left">TIPO</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="feedback in feedbacks" :key="feedback.feedback_id">
                                    <td>
                                        {{feedback.feedback_date.slice(0, 10).replaceAll("-", "/")}} - {{ feedback.collection_point.street_name }}<br>
                                        {{feedback.description}}
                                    </td>
                                    <td>{{feedback.feedback_type}}</td>
                                </tr>
                            </tbody>
                        </v-table>
                    </v-container>
                </v-card>
                </v-col>
            </v-row>    
        </v-container>
        </v-card>
            </v-tabs-window-item>
            <v-tabs-window-item value="3">
            </v-tabs-window-item>
        </v-tabs-window>
    </div>
  <div style="margin-top: 100px" v-if="user.user_type == 'admin'">
    <v-card class="px-6 py-8 welcome-card" max-width="90%">
      <v-row>
        <v-col cols="4" md="3" class="image-column">
          <img
            src="../assets/icons/robot-icon.webp"
            style="width: 250px; height: 250px"
            alt="Icone de robo"
            srcset=""
          />
        </v-col>
        <v-col cols="12" md="6" class="welcome-column">
          <h1>
            Bem Vindo <br />
            {{ user.name }}
          </h1>
          <h3>
            Gere ecopontos, guias, utilizadores e o nosso plano anual – tudo à
            distância de um clique!
          </h3>
        </v-col>
        <v-col cols="4" md="3" class="image-column">
          <img
            src="../assets/icons/calendar-icon.webp"
            style="width: 250px; height: 200px"
            alt="Icone de robo"
            srcset=""
          />
        </v-col>
      </v-row>

      <v-tabs
        v-model="admin_tab"
        class="rounded-tabs"
        color="black"
        grow
        show-arrows
        justify-center
      >
        <v-tab
          class="admin-custom-tab"
          :prepend-icon="icons.cp_icon"
          text="Pontos de Recolha"
          value="1"
        ></v-tab>
        <v-tab
          class="admin-custom-tab"
          :prepend-icon="icons.user_icon"
          text="Utilizadores"
          value="2"
        ></v-tab>
        <v-tab
          class="admin-custom-tab"
          :prepend-icon="icons.cg_icon"
          text="Guias de Recolha"
          :to="{ name: 'guide-list' }" value="3"
        ></v-tab>
        <v-tab
          class="admin-custom-tab"
          :prepend-icon="icons.annual_plan_icon"
          text="Plano de Recolha"
          value="4"
        ></v-tab>
      </v-tabs>

      <v-tabs-window v-model="admin_tab">
        <v-tabs-window-item value="1" class="admin-tab-window" id="tab-window1">
          <div class="window-header">
            <br /><br />
            <h2>Lista de Pontos de Recolha</h2>

            <div class="d-flex justify-end align-center toolsPointsDiv">
              <v-select
                v-model="orderBy"
                label="Ordenar por nome"
                density="compact"
                :items="['(A-Z)', '(Z-A)']"
                variant="outlined"
              ></v-select>

              <v-btn
                color="white"
                rounded="2"
                style="background-color: #043601"
                @click="showCreatePointForm = !showCreatePointForm"
              >
                <v-icon>mdi-plus</v-icon>
                ADD</v-btn
              >
            </div>
          </div>
          <div>
            <v-form
              v-if="showCreatePointForm"
              ref="createPointForm"
              class="pointForm"
              v-model="form"
              @submit.prevent="createPoint"
            >
              <v-card class="px-6 py-8 form-card pointFormCard" elevation="0">
                <v-row>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="newPoint.street_name"
                      label="Morada"
                      variant="outlined"
                      class="mb-2 form-input"
                      clearable
                      placeholder="Rua Exemplo"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="6" md="3">
                    <v-text-field
                      v-model="newPoint.postal_code"
                      label="Código Postal"
                      variant="outlined"
                      class="mb-2 form-input"
                      clearable
                      placeholder="000-000"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="6" md="3">
                    <v-text-field
                      v-model="newPoint.door_number"
                      label="Nº Porta"
                      variant="outlined"
                      class="mb-2 form-input"
                      clearable
                      placeholder="123"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" md="6">
                    <v-select
                      v-model="newPoint.collection_point_type"
                      :items="['ecoponto', 'ecocentro']"
                      label="Tipo de Ponto"
                      variant="outlined"
                      class="mb-2 form-input"
                      clearable
                    ></v-select>
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-text-field
                      v-model="newPoint.opening_hours"
                      label="Horário de Funcionamento"
                      variant="outlined"
                      class="mb-2 form-input"
                      clearable
                      placeholder="9h - 18h"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-text-field
                      v-model="newPoint.geographical_coordinates"
                      label="Coordenadas geograficas"
                      variant="outlined"
                      class="mb-2 form-input"
                      clearable
                      placeholder="40.7128, -74.0060"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" md="12">
                    <v-btn
                      color="success"
                      size="large"
                      type="submit"
                      variant="elevated"
                      @click="createPoint"
                      block
                    >
                      Criar Ponto de Recolha
                    </v-btn>
                  </v-col>
                </v-row>
              </v-card>
            </v-form>
          </div>
          <div>
            <v-form
              v-if="showupdatePointForm"
              ref="updatePointForm"
              class="pointForm"
              v-model="form"
              @submit.prevent="updatePoint(point)"
            >
              <v-card class="px-6 py-8 form-card pointFormCard" elevation="0">
                <v-row>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="newPoint.street_name"
                      label="Morada"
                      variant="outlined"
                      class="mb-2 form-input"
                      clearable
                    ></v-text-field>
                  </v-col>
                  <v-col cols="6" md="3">
                    <v-text-field
                      v-model="newPoint.postal_code"
                      label="Código Postal"
                      variant="outlined"
                      class="mb-2 form-input"
                      clearable
                    ></v-text-field>
                  </v-col>
                  <v-col cols="6" md="3">
                    <v-text-field
                      v-model="newPoint.door_number"
                      label="Nº Porta"
                      variant="outlined"
                      class="mb-2 form-input"
                      clearable
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" md="6">
                    <v-select
                      v-model="newPoint.collection_point_type"
                      :items="['ecoponto', 'ecocentro']"
                      label="Tipo de Ponto"
                      variant="outlined"
                      class="mb-2 form-input"
                      clearable
                    ></v-select>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="newPoint.opening_hours"
                      label="Horário de Funcionamento"
                      variant="outlined"
                      class="mb-2 form-input"
                      clearable
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row class="formBtnsSubmit">
                  <v-col cols="12" md="12">
                    <v-btn
                      color="success"
                      size="large"
                      type="submit"
                      variant="elevated"
                      block
                    >
                      Submeter Alterações
                    </v-btn>
                    <!-- <v-btn
                        color="white"
                        rounded="2"
                        style="background-color: #ed6868"
                      >
                        cancelar</v-btn
                      > -->
                  </v-col>
                </v-row>
              </v-card>
            </v-form>
          </div>
          <v-row>
            <v-container>
              <v-table>
                <thead>
                  <tr>
                    <th class="text-left">MORADA</th>
                    <th class="text-left">TIPO</th>
                    <th class="text-left">EDITAR</th>
                    <th class="text-left">REMOVER</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="point in collection_points"
                    :key="point.collection_point_id"
                  >
                    <td>
                      {{
                        ` ${point.street_name}, ${point.postal_code}, nº ${point.door_number}`
                      }}
                    </td>
                    <td>{{ point.collection_point_type }}</td>
                    <td>
                      <v-btn
                        @click="showupdatePointForm = !showupdatePointForm"
                        color="white"
                        rounded="2"
                        style="background-color: #ed6868"
                      >
                        Editar Ponto</v-btn
                      >
                    </td>
                    <td>
                      <v-btn
                        color="white"
                        rounded="2"
                        style="background-color: #ed6868"
                        @click="deletePoint(point.collection_point_id)"
                      >
                        Remover Ponto</v-btn
                      >
                    </td>
                  </tr>
                </tbody>
              </v-table>
            </v-container>
          </v-row>
          <v-pagination v-model="page" :length="totalPages" rounded="circle" />
        </v-tabs-window-item>
      </v-tabs-window>

      <v-tabs-window v-model="admin_tab">
        <v-tabs-window-item value="2" class="admin-tab-window" id="tab-window2">
          <div class="window-header">
            <h2>Lista de Utilizadores</h2>

            <v-select
              v-model="orderBy"
              label="Ordenar por nome"
              density="compact"
              :items="['(A-Z)', '(Z-A)']"
              variant="outlined"
            ></v-select>
          </div>
          <v-col>
          <v-row>
            <v-container>
              <v-table>
                <thead>
                  <tr>
                    <th class="text-left">NOME</th>
                    <th class="text-left">MORADA</th>
                    <th class="text-left">AÇÕES</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="user in users" :key="user.user_id">
                    <td>{{ user.name }}</td>
                    <td>{{ user.collection_point.street_name }}</td>
                    <td>
                      <v-btn
                        color="white"
                        rounded="2"
                        style="background-color: #ed6868"
                        @click="deleteUser(user.user_id)"
                      >
                        Remover Utilizador</v-btn
                      >
                    </td>
                  </tr>
                </tbody>
              </v-table>
            </v-container>
          </v-row>
          </v-col>
          <v-pagination v-model="page" :length="totalPages" rounded="circle" />
        </v-tabs-window-item>
      </v-tabs-window>

      <v-tabs-window v-model="admin_tab">
        <v-tabs-window-item value="3" class="admin-tab-window" id="tab-window3">
        </v-tabs-window-item>
      </v-tabs-window>

      <v-tabs-window
        v-model="admin_tab"
        class="admin-tab-window"
        id="tab-window4"
      >
        <v-tabs-window-item value="4">
          <div class="min-h-screen bg-gray-50">
            <Calendar :wasteSchedule="schedule" :wasteTypes="wasteTypes" />
          </div>
        </v-tabs-window-item>
      </v-tabs-window>
    </v-card>
  </div>
</template>

<script>
import { useVuelidate } from "@vuelidate/core";
import Calendar from "../components/Calendar.vue";
import {
  required,
  minLength,
  maxLength,
  alpha,
  between,
  email,
  numeric,
} from "@vuelidate/validators";
import Users from "@/api/users";
import collectionPlan from "@/api/collectionPlan";
import CollectionPoints from "@/api/collectionPoints";
import Readings from "@/api/readings";

export default {
  components: {
    Calendar,
  },
  setup() {
    return { v$: useVuelidate() };
  },
  props: ["userId"],
  name: "ProfileView",

  data() {
    return {
      user: null,
      tab: 1,
      admin_tab: 1,
      form: false,
      visible1: false,
      visible2: false,
      id: 0,
      cp_id: 0,
      name: "",
      surname: "",
      tin: "",
      oldPassword: "",
      newPassword: "",
      phone_number: "",
      email: "",
      address: "",
      postal_code: "",
      door_number: "",
      user_type: "",
      door_to_door_service: false,
      feedbacks: [],
      users: [],
      page: 1,
      totalPages: 1,
      orderBy: "(A-Z)",
      icons: {
        user_icon: "mdi-account",
        cg_icon: "mdi-paperclip",
        cp_icon: "mdi-cached",
        annual_plan_icon: "mdi-calendar",
      },
      
        chartSeries: [],
        chartOptions: {
            chart: {
                type: 'line'
            },
            stroke: {
                curve: 'smooth',
                width: 3
            },
            xaxis: {},
            yaxis: {
                text: "Quantidade de lixo (kg)"
            },
            tooltip: {
                x: {
                    format: 'dd/MM/yyyy'
                }
            },
            colors: ["#FFC727",
            "#14AE5C",
            "#446DEB",
            "#37474F",
            "#6F4439"],
            legend: {
                position: 'top'
            }
        },
      // --
      newPoint: {
        street_name: "",
        postal_code: "",
        door_number: "",
        collection_point_type: "".toLowerCase(),
        opening_hours: "",
        geographical_coordinates: "",
      },
      showupdatePointForm: false,
      showCreatePointForm: false,
      collectionPoint: null,
      collection_points: [],
      collection_point_id: null,
      collection_point_type: "",
      collection_point_coordinates: "",
      collection_point_opening_hours: "",
      collection_point_street_name: "",
      collection_point_postal_code: "",
      collection_point_door_number: "",

      // --

      wasteSchedule: [],
      wasteTypes: [],
    };
  },

  async created() {
    const userInfo = await Users.getUserProfile(this.userId);
    const readingsInfo = await Readings.getReadingsByWasteType(this.userId);

    this.user = userInfo.data;
    this.readings = readingsInfo.data;

    this.id = this.user.user_id;
    const nameSplit = this.user.name.split(" ");
    this.name = nameSplit[0];
    this.surname = nameSplit[1];
    this.tin = this.user.tin;
    this.phone_number = this.user.phone_number;
    this.email = this.user.email;
    this.user_type = this.user.user_type;
    if (this.user_type === "morador") {
      this.citizenInfo();
      this.groupByMonth();

      // -------
        this.collectionPoint = this.cp_id;

        const pointInfo = await CollectionPoints.getCollectionPoint(
            this.cp_id
        );

        this.collection_point_id = this.collectionPoint.collection_point_id;
        this.collection_point_type = this.collectionPoint.collection_point_type;
        this.collection_point_coordinates =
        this.collectionPoint.collection_point_coordinates;
        this.collection_point_opening_hours =
        this.collectionPoint.collection_point_opening_hours;
        this.collection_point_street_name = this.collectionPoint.street_name;
        this.collection_point_postal_code = this.collectionPoint.postal_code;
    this.collection_point_door_number = this.collectionPoint.door_number;
    } else if (this.user_type === "admin") {
      this.fetchUsers(this.page);
      this.fetchPoints(this.page);
    }

    // -------

    // try {
    //   const res = await collectionPlan.getPlan();
    //   const planArray = res.data;
    //   this.wasteSchedule = planArray.map((schedule) => {
    //     return {
    //       id: schedule.plan_id,
    //       wasteId: schedule.Waste_id,
    //       weekDays: schedule.Collection_days.split(",").map((day) => {
    //         day.trim();
    //       }),
    //     };
    //   });

    //   const wasteTypeMap = {};
    //   planArray.forEach((plan) => {
    //     const wt = plan.waste_type;
    //     if (wt && !wasteTypeMap[wt.waste_type_id]) {
    //       wasteTypeMap[wt.waste_type_id] = {
    //         id: wt.waste_type_id,
    //         name: wt.name,
    //         icon: wt.icon || "",
    //         color: wt.identifying_color,
    //         }
    //     }
    //     });
            
    //   this.wasteTypes = Object.values(wasteTypeMap);

    //   // console.log(this.wasteSchedule, this.wasteTypes);
    // } catch (error) {
    //   console.error("Erro ao carregar o plano:", error);
    // }
  },

    methods: {
        async submitChanges() {
            //starts the validation for all form inputs            
            if (this.newPassword) {
                this.oldPassword = this.newPassword
            }

            const result = await this.v$.$validate();

            if (result) {
                const userInfo = {
                    id: this.id,
                    name: this.name + " " + this.surname,
                    tin: this.tin,
                    password: this.oldPassword,
                    email: this.email,
                    phone_number: this.phone_number,
                    street_name: this.address,
                    postal_code: this.postal_code,
                    door_number: this.door_number,
                    door_to_door_service: this.door_to_door_service === true ? "sim" : 'não',
                    collection_point_id: this.cp_id
                }
                
                alert('Alterações feitas!')
                try {
                    const res = await Users.editProfile(userInfo)
                } catch (err) {
                    console.error(err.response?.data)
                    alert('Erro ao editar perfil: ' + (err.response?.data.error || error.message))
                }
            }
        },

        async fetchUsers(page) {
            try {
                const res = await Users.allUsers({
                    page, 
                    limit: 6,
                    order: this.checkOrderBy
                });

                this.users = res.data.data  
                this.page = res.data.currentPage
                this.totalPages = res.data.totalPages
                
            } catch (err) {
                console.error("Erro:", err);
                
            }
        },

        async deleteUser(userId) {
            try {
                await Users.deleteUser(userId);
                this.fetchUsers(this.page)
            } catch (err) {
                console.error(err.response?.data)
                    alert('Erro ao editar perfil: ' + (err.response?.data.error || err.message))
            }
        },

        activateService() {
            this.door_to_door_service = true;
            this.submitChanges;
        },

        citizenInfo() {
            this.address = this.user.collection_point.street_name;
            this.postal_code = this.user.collection_point.postal_code;
            this.door_number = this.user.collection_point.door_number;
            this.door_to_door_service = this.user.door_to_door_service === "sim" ? true : false;
            this.cp_id = this.user.collection_point.collection_point_id;
            this.feedbacks = this.user.feedbacks; 
        },

        groupByMonth() {
            const readingValues = {};
            this.chartSeries = [];

            const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
            const monthNames = ['Jan', 'Feb', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
            
            console.log(this.readings.data);
            
            // Separate the data by waste type, and then add the weight collected for each month
            this.readings.data.forEach(reading => {

                // Put the date in the (DD-MM-YYY) format
                const date = reading.reading_date.substring(8, 10) + '/' + reading.reading_date.substring(5, 7) + '/' + reading.reading_date.substring(0, 4)
                const month = date.substring(3, 5);

                // Get the waste type & weight collected
                const waste_type = reading.container.waste_type.name
                const weight = reading.weight_collected || 0;

                if (!readingValues[waste_type]) {
                    readingValues[waste_type] = {};
                } 
                                
                if (!readingValues[waste_type][month]) {
                    readingValues[waste_type][month] = 0;
                }

                readingValues[waste_type][month] += weight;
            })             

            for (const type in readingValues) {
                // Get the values from each month
                const values = readingValues[type]
                
                // Fill the data for each month to render the graph
                const monthlyData = months.map(month => {
                    return values[month] || 0;
                });

                // Add the data into the chartSeries
                this.chartSeries.push({
                    name: type.trim(),
                    data: monthlyData
                })
            }

            // Add the month names into the x axis
            this.chartOptions.xaxis = {
                type: "category",
                categories: monthNames
            }
            console.log(123);
            
            console.log(this.chartOptions.xaxis);
            
        },

    activateService() {
      this.door_to_door_service = true;
      this.submitChanges();
    },

    citizenInfo() {
      this.address = this.user.collection_point.street_name;
      this.postal_code = this.user.collection_point.postal_code;
      this.door_number = this.user.collection_point.door_number;
      this.door_to_door_service =
        this.user.door_to_door_service === "sim" ? true : false;
      this.cp_id = this.user.collection_point.collection_point_id;
      this.feedbacks = this.user.feedbacks;
    },

    async fetchPoints(page) {
      try {
        const res = await CollectionPoints.allCollectionPoints({
          page,
          limit: 6,
          order: this.checkOrderBy,
          route_type: "admin"
        });

        this.collection_points = res.data.data;
        this.page = res.data.currentPage;
        this.totalPages = res.data.totalPages;
      } catch (err) {
        console.error("Erro:", err);
      }
      console.log(this.collection_points);
    },

    async deletePoint(pointId) {
      try {
        await CollectionPoints.deleteCollectionPoint(pointId);
        this.fetchPoints(this.page);
      } catch (err) {
        console.error(err.response?.data);
        alert(
          "Erro ao editar perfil: " + (err.response?.data.error || err.message)
        );
      }
    },

    async updatePoint(pointId) {
      try {
        await CollectionPoints.updateCollectionPoint(pointId);
        this.fetchPoints(this.page);
        alert("Ponto de recolha atualizado com sucesso");
      } catch (err) {
        console.error(err.response?.data);
        alert(
          "Erro ao editar ponto de recolha: " +
            (err.response?.data.error || err.message)
        );
      }
    },

    async createPoint() {
      try {
        await CollectionPoints.createCollectionPoint(this.newPoint);
        this.fetchPoints(this.page);
        alert(`Ponto de recolha ${this.newPoint} criado com sucesso`);

        this.newPoint = {
          street_name: "",
          postal_code: "",
          door_number: "",
          collection_point_type: "",
          opening_hours: "",
          geographical_coordinates: "",
        };

        console.log(this.newPoint);
        this.showCreatePointForm = false;
      } catch (err) {
        console.error(err.response?.data);
        alert(
          "Erro ao criar ponto de recolha: " +
            (err.response?.data.error || err.message)
        );
      }
    },
// numero de leiruras de lixo indiferenciado associadas ao morador X um valor tabelado ex:1.05€
    async wasteTaxes(){

    },
},
  validations() {
    return {
      name: { required, maxLengthValue: maxLength(12), alpha },
      surname: { required, maxLengthValue: maxLength(12), alpha },
      tin: { required, betweenValue: between(100000000, 999999999), numeric },
      oldPassword: {
        required,
        maxLengthValue: maxLength(24),
      },
      newPassword: {
        minLengthValue: minLength(8),
        maxLengthValue: maxLength(24),
      },
      phone_number: {
        required,
        betweenValue: between(900000000, 999999999),
        numeric,
      },
      email: {
        required,
        minLengthValue: minLength(8),
        maxLengthValue: maxLength(36),
        email,
      },
      address: {
        required,
        minLengthValue: minLength(8),
        maxLengthValue: maxLength(40),
      },
      postal_code: {
        required,
        minLengthValue: minLength(8),
        maxLengthValue: maxLength(8),
      },
      door_number: { required, maxLengthValue: maxLength(3), numeric },
      street_name: { required },
      collection_point_type: { required },
      geographical_coordinates: { required },
    };
  },

  computed: {
    progress() {
      return Math.min(100, this.password.length * 10);
    },

    color() {
      return ["error", "warning", "success"][Math.floor(this.progress / 40)];
    },

    checkOrderBy() {
      return this.orderBy === "(A-Z)" ? "asc" : "desc";
    },
  },

  watch: {
    page(newPage, oldPage) {
      // when a new page is selected, it will fetch the user's info or point info from that page
      if (newPage !== oldPage) {
        if (this.admin_tab === 1) {
          this.fetchPoints(newPage);
        } else if (this.admin_tab === 2) {
          this.fetchUsers(newPage);
        }
      }
    },

    orderBy(newOrder, oldOrder) {
      if (newOrder !== oldOrder) {
        //  this.page = 1;
        // when a new order by is selected, it automatically goes to the selected page
        if (this.admin_tab === 1) {
          this.fetchPoints(this.page);
        } else if (this.admin_tab === 2) {
          this.fetchUsers(this.page);
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.custom-tab .v-tab {
  color: #637381;
  font-weight: 500;
}

p {
  color: black;
}

.form-input {
  margin: 20px 0;
  color: #000;
}

.v-label {
  color: #000;
}

.statistics_icon {
  margin: auto;
}

.edit_profile_icon {
  position: absolute;
  margin-left: 75%;
  margin-top: -30%;
}

.tax {
  color: #09a129;
  margin-left: 15px;
  font-weight: 700;
  font-size: 38px;
}

.trash_icon {
  margin-left: 30px;
}

.icon-background {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  border-radius: 15px;
}

#undifferentiated-background {
  background-color: rgba($color: #455a64, $alpha: 0.08);
}

#organic-background {
  background-color: rgba($color: #6f4439, $alpha: 0.08);
}

#paper-background {
  background-color: rgba($color: #446deb, $alpha: 0.08);
}

#glass-background {
  background-color: rgba($color: #09a129, $alpha: 0.08);
}

#plastic-background {
  background-color: rgba($color: #ffc727, $alpha: 0.08);
}

.trash-type-weight {
  display: flex;
  align-content: center;
}

.trash-type-weight-percentage {
  display: flex;
  align-items: center;
}

.trash-type-weight-percentage p {
  color: #22ad5c;
}

.trash-types-container {
  flex-wrap: nowrap;
}

.v-table {
  margin-top: 20px;
}

.welcome-card {
  margin: auto;
}

.welcome-column {
  display: flex;
  flex-direction: column;
  text-align: center;
}

.welcome-column h1 {
  font-weight: 700;
  margin-bottom: 50px;
}

.admin-custom-tab,
.custom-tab {
  margin: 0 8px;
}

.rounded-tabs {
  margin-top: 100px;
}

.rounded-tabs .v-tab,
.custom-tab .v-tab {
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
}

// .window-header {
//   display: flex;
//   align-items: center;
//   justify-content: flex-start;
// }

#tab-window2 .window-header,
#tab-window1 .window-header {
  display: flex;
  justify-content: space-between;
  margin: 20px 30px 50px 30px;
}

#tab-window2 .window-header .v-select,
#tab-window1 .window-header .v-select {
  max-width: 150px;
}

#tab-window2 h2 {
  font-weight: 650;
  font-size: 24px;
}

.toolsPointsDiv {
  width: 600px;
  gap: 10px;
  margin-left: auto;
  align-items: baseline;
}
.toolsPointsDiv .v-btn {
  height: 40px;
  min-height: 40px;
  padding-top: 0;
  padding-bottom: 0;
  margin-top: 0;
  margin-bottom: 25px;
  display: flex;
  align-items: center;
}

@media screen and (max-width: 1220px) {
  .edit_profile_icon {
    display: none;
  }
}

@media screen and (max-width: 960px) {
  .image-column img {
    display: none;
  }
}
</style>
