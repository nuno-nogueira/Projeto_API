<template>
    <div style="margin-top: 100px;" v-if="user.user_type == 'morador'">
        <v-tabs 
        v-model="tab"
        class="custom-tab"
        bg-color="transparent"
        color="black"
        grow>
            <v-tab text="Editar Perfil" value="1" color="#09A129"></v-tab>
            <v-tab text="Estatísticas" value="2" color="#09A129"></v-tab>
            <v-tab text="Plano de Recolha" value="3" color="#09A129"></v-tab>
        </v-tabs>

        <v-tabs-window v-model="tab">
            <v-tabs-window-item value="1">
                <v-form ref = "form" v-model="form" @submit.prevent="submitChanges">
                    <v-card class="px-6 py-8 form-card" max-width="950" elevation="0">
                        <v-row justify="space-around">
                            <v-col cols="12" md="5">
                                <v-text-field
                                v-model="name"
                                :counter="12"
                                :error-messages="v$.name.$errors.map(e => e.$message)"
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
                                :error-messages="v$.surname.$errors.map(e => e.$message)"
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
                                :error-messages="v$.tin.$errors.map(e => e.$message)"
                                variant="outlined"
                                class="mb-2 form-input"
                                label="NIF"
                                clearable
                                ></v-text-field>
                            </v-col>
                            <v-col cols="12" md="5">
                                <v-text-field
                                v-model="oldPassword"
                                :error-messages="v$.oldPassword.$errors.map(e => e.$message)"
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
                                :error-messages="v$.newPassword.$errors.map(e => e.$message)"
                                variant="outlined"
                                :append-icon="visible2 ? 'mdi-eye' : 'mdi-eye-off'"
                                :type="visible2 ? 'text' : 'password'"
                                class="mb-2 form-input"
                                label="Nova Palavra Passe"
                                @click:append="visible2 = !visible2"
                                clearable loading
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
                                :error-messages="v$.postal_code.$errors.map(e => e.$message)"
                                variant="outlined"
                                class="mb-2 form-input"
                                label="Código Postal"
                                clearable>
                                </v-text-field>
                            </v-col>
                            <v-col cols="12" md="4">
                                <v-text-field
                                v-model="address"
                                :error-messages="v$.address.$errors.map(e => e.$message)"
                                :counter="40"
                                variant="outlined"
                                class="mb-2 form-input"
                                label="Morada"
                                clearable></v-text-field>
                            </v-col>
                            <v-col cols="4" md="2">
                                <v-text-field
                                v-model="door_number"
                                :error-messages="v$.door_number.$errors.map(e => e.$message)"
                                variant="outlined"
                                class="mb-2 form-input"
                                label="Andar"
                                clearable>
                                </v-text-field>
                            </v-col>
                        </v-row>
                        <v-row justify="space-around">
                            <v-col col="12" md="5">
                                <v-text-field
                                v-model="phone_number"
                                :error-messages="v$.phone_number.$errors.map(e => e.$message)"
                                :counter="9"
                                variant="outlined"
                                class="mb-2 form-input"
                                label="Telefone"
                                prepend-inner-icon="mdi-phone"
                                clearable></v-text-field>
                            </v-col>
                            <v-col col="12" md="5">
                                <v-text-field
                                v-model="email"
                                :error-messages="v$.email.$errors.map(e => e.$message)"
                                :counter="36"
                                variant="outlined"
                                class="mb-2 form-input"
                                label="Email"
                                prepend-inner-icon="mdi-email"
                                clearable>
                                </v-text-field>
                            </v-col>
                        </v-row>
                        <v-row justify="space-between">
                            <v-col col="12" md="5">
                                <v-switch
                                v-model="door_to_door_service"
                                color="success"
                                label="Serviço Porta a Porta"
                                inset></v-switch>
                            </v-col>
                            <v-col col="12" md="5">
                                <v-btn
                                color="success"
                                size="large"
                                @click="submitChanges"
                                variant="elevated"
                                block>Guardar Alterações</v-btn>
                            </v-col>
                        </v-row>
                    </v-card>
                </v-form>

                <img src="../assets/icons/edit_profile.webp" class="edit_profile_icon" alt="">
            </v-tabs-window-item>
            <v-tabs-window-item value="2">
                <v-card class="mx-auto px-6 py-8" 
                max-width="900" 
                v-if="!door_to_door_service">
                    <v-row justify="center">
                        <v-col cols="12" md="8" lg="6" class="d-flex flex-column align-center text-center">
                            <img src="../assets/icons/statistics.webp" class="statistics_icon" alt="Camião do Lixo">
                            <br>
                            <span class="font-weight-black  mb-4">Ainda não tem dados de recolha</span>
                            <v-card-text>
                                <p>O serviço de recolha porta-a-porta foi criado para facilitar a gestão de resíduos no seu bairro. Ao registar-se pode solicitar a recolha diretamente na sua porta, sem necessidade de deslocamento até um ponto de recolha. </p>
                            </v-card-text>
                            <v-btn
                            color="success"
                            size="large"
                            @click="activateService"
                            variant="elevated"
                            class="activate-service"
                            block>Solicitar Serviço de Recolha</v-btn>
                        </v-col>
                    </v-row>
                </v-card>
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
                            <!-- <v-col cols="4" md="3">
                                <v-row class="trash-types-container">
                                    <v-col cols="12" md="12">
                                        <v-card elevation="0" class="trash-type">
                                            <v-row class="trash-type-info">
                                                <v-col cols="12" md="3">
                                                    <div class="icon-background" id="undifferentiated-background">
                                                        <img src="../assets/icons/undifferentiated_icon.webp" alt="Icone para o lixo indiferenciado">
                                                    </div>                                        
                                                </v-col>
                                                <v-col cols="10" md="8">
                                                    <h3 class="font-weight-black">Indiferenciado</h3>
                                                    <p>Dados mensais</p>
                                                </v-col>
                                            </v-row>
                                            <v-row class="trash-type-weight">
                                                <v-col cols="12" md="3">
                                                    <h3 class="font-weight-black">0 kg</h3>
                                                </v-col>
                                                <v-col cols="12" md="8" class="trash-type-weight-percentage">
                                                    <p>0.39%</p>
                                                    <img src="../assets/icons/arrow_up.webp" alt="">
                                                </v-col>
                                            </v-row>
                                        </v-card>
                                    </v-col>
                                    <v-col cols="12" md="12">
                                        <v-card elevation="0" class="trash-type">
                                            <v-row class="trash-type-info">
                                                <v-col cols="10" md="3">
                                                    <div class="icon-background" id="organic-background">
                                                        <img src="../assets/icons/organic_icon.webp" alt="Icone para o lixo indiferenciado">
                                                    </div>                                        
                                                </v-col>
                                                <v-col cols="10" md="8">
                                                    <h3 class="font-weight-black">Orgânico</h3>
                                                    <p>Dados mensais</p>
                                                </v-col>
                                            </v-row>
                                            <v-row class="trash-type-weight">
                                                <v-col cols="12" md="3">
                                                    <h3 class="font-weight-black">0 kg</h3>
                                                </v-col>
                                                <v-col cols="12" md="8" class="trash-type-weight-percentage">
                                                    <p>0.39%</p>
                                                    <img src="../assets/icons/arrow_up.webp" alt="">
                                                </v-col>
                                            </v-row>
                                        </v-card>
                                    </v-col>
                                    <v-col cols="12" md="12">
                                        <v-card elevation="0" class="trash-type">
                                            <v-row class="trash-type-info">
                                                <v-col cols="12" md="3">
                                                    <div class="icon-background" id="paper-background">
                                                        <img src="../assets/icons/paper_icon.webp" alt="Icone para o lixo indiferenciado">
                                                    </div>                                        
                                                </v-col>
                                                <v-col cols="10" md="8">
                                                    <h3 class="font-weight-black">Papel / Cartão</h3>
                                                    <p>Dados mensais</p>
                                                </v-col>
                                            </v-row>
                                            <v-row class="trash-type-weight">
                                                <v-col cols="12" md="3">
                                                    <h3 class="font-weight-black">0 kg</h3>
                                                </v-col>
                                                <v-col cols="12" md="8" class="trash-type-weight-percentage">
                                                    <p>0.39%</p>
                                                    <img src="../assets/icons/arrow_up.webp" alt="">
                                                </v-col>
                                            </v-row>
                                        </v-card>
                                    </v-col>
                                </v-row>
                                <v-row class="trash-types-container py-4" >
                                    <v-col cols="12" md="12">
                                        <v-card elevation="0" class="trash-type">
                                            <v-row class="trash-type-info">
                                                <v-col cols="12" md="3">
                                                    <div class="icon-background" id="glass-background">
                                                        <img src="../assets/icons/glass_icon.webp" alt="Icone para o vidro">
                                                    </div>                                        
                                                </v-col>
                                                <v-col cols="10" md="8">
                                                    <h3 class="font-weight-black">Vidro</h3>
                                                    <p>Dados mensais</p>
                                                </v-col>
                                            </v-row>
                                            <v-row class="trash-type-weight">
                                                <v-col cols="12" md="3">
                                                    <h3 class="font-weight-black">0 kg</h3>
                                                </v-col>
                                                <v-col cols="12" md="8" class="trash-type-weight-percentage">
                                                    <p>0.39%</p>
                                                    <img src="../assets/icons/arrow_up.webp" alt="">
                                                </v-col>
                                            </v-row>
                                        </v-card>
                                    </v-col>
                                    <v-col cols="12" md="12">
                                        <v-card elevation="0" class="trash-type">
                                            <v-row class="trash-type-info">
                                                <v-col cols="10" md="3">
                                                    <div class="icon-background" id="plastic-background">
                                                        <img src="../assets/icons/plastic_icon.webp" alt="Icone para o plastico">
                                                    </div>                                        
                                                </v-col>
                                                <v-col cols="10" md="8">
                                                    <h3 class="font-weight-black">Plástico / Metal</h3>
                                                    <p>Dados mensais</p>
                                                </v-col>
                                            </v-row>
                                            <v-row class="trash-type-weight">
                                                <v-col cols="12" md="3">
                                                    <h3 class="font-weight-black">0 kg</h3>
                                                </v-col>
                                                <v-col cols="12" md="8" class="trash-type-weight-percentage">
                                                    <p>0.39%</p>
                                                    <img src="../assets/icons/arrow_up.webp" alt="">
                                                </v-col>
                                            </v-row>
                                        </v-card>
                                    </v-col>
                                </v-row>
                            </v-col> -->
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
            </v-tabs-window-item>
            <v-tabs-window-item value="3">
            </v-tabs-window-item>
        </v-tabs-window>
    </div>
    <div style="margin-top: 100px;" v-if="user.user_type == 'admin'">
        <v-card class="px-6 py-8 welcome-card" max-width="90%">
            <v-row>
                <v-col cols="4" md="3" class="image-column">
                    <img src="../assets/icons/robot-icon.webp" style="width: 250px; height: 250px;" alt="Icone de robo" srcset="">
                </v-col>
                <v-col cols="12" md="6" class="welcome-column">
                    <h1>Bem Vindo <br> {{ user.name }}</h1>
                    <h3>Gere ecopontos, guias, utilizadores e o nosso plano anual – tudo à distância de um clique! </h3>
                </v-col>
                <v-col cols="4" md="3" class="image-column">
                    <img src="../assets/icons/calendar-icon.webp" style="width: 250px; height: 200px;" alt="Icone de robo" srcset="">
                </v-col>

            </v-row>

            <v-tabs
            v-model="admin_tab"
            class="rounded-tabs"
            color="black"
            grow
            show-arrows
            justify-center>
                <v-tab class="admin-custom-tab" :prepend-icon="icons.cp_icon" text="Pontos de Recolha" value="1"></v-tab>
                <v-tab class="admin-custom-tab" :prepend-icon="icons.user_icon" text="Utilizadores" value="2"></v-tab>
                <v-tab class="admin-custom-tab" :prepend-icon="icons.cg_icon" text="Guias de Recolha" :to="{ name: 'guide-list' }" value="3"></v-tab>
                <v-tab class="admin-custom-tab" :prepend-icon="icons.annual_plan_icon" text="Plano de Recolha" value="4"></v-tab>
            </v-tabs>

            <v-tabs-window v-model="admin_tab">
                <v-tabs-window-item value="1" class="admin-tab-window" id="tab-window1">
                    <v-btn @click="fetchMap">Map</v-btn>
                    <v-btn @click="fetchAdmin">Admin</v-btn>
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
                        :items="['(A-Z)','(Z-A)']"
                        variant = "outlined"></v-select>
                    </div>
                    <v-row>
                        <!-- <v-col
                        v-for="user in users"
                        :key="user.user_id"
                        cols="6"
                        md="4">
                            <v-card :variant="outlined"
                            class="mx-auto"
                            background-color="white"
                            max-width="250"
                            :title="user.name"
                            :subtitle="user.collection_point.street_name">
                                <template v-slot:actions>
                                    <div justify-end>
                                        <v-btn color="white" 
                                        rounded="2" 
                                        style="background-color: #ED6868;"
                                        @click="deleteUser(user.user_id)">
                                        Remover Utilizador</v-btn>
                                    </div>
                                </template>
                            </v-card>
                        </v-col> -->
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
                                        <v-btn color="white" 
                                        rounded="2" 
                                        style="background-color: #ED6868;"
                                        @click="deleteUser(user.user_id)">
                                        Remover Utilizador</v-btn>
                                    </td>
                                </tr>
                            </tbody>
                        </v-table>
                        </v-container>
                    </v-row>
                    <v-pagination 
                    v-model="page"
                    :length="totalPages"
                    rounded="circle"/>
                </v-tabs-window-item>
            </v-tabs-window>

            <v-tabs-window v-model="admin_tab">
                <v-tabs-window-item value="3" class="admin-tab-window" id="tab-window3">
                    
                </v-tabs-window-item>
            </v-tabs-window>

            <v-tabs-window v-model="admin_tab" class="admin-tab-window" id="tab-window4">
                <v-tabs-window-item value="4">
                    
                </v-tabs-window-item>
            </v-tabs-window>
        </v-card>
    </div>
</template>

<script>
import { useVuelidate } from '@vuelidate/core'
import { required, minLength, maxLength, alpha, between, email, numeric} from '@vuelidate/validators'
import Users from '@/api/users';
import Readings from '@/api/readings';

export default {
    setup() { return { v$: useVuelidate() }},
    props: ['userId'],
    name: 'ProfileView',

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
            name: '',
            surname: '',
            tin: '',
            oldPassword: '',
            newPassword: '',
            phone_number: '',
            email: '',
            address: '',
            postal_code: '',
            door_number: '',
            user_type: '',
            door_to_door_service: false,
            feedbacks: [],
            users: [],
            readings: [],
            page: 1,
            totalPages: 1,
            orderBy: "(A-Z)",
            colors: ["#37474F", "#6F4439", "#446DEB", "#14AE5C", "#FFC727"],
            icons: {
                user_icon: "mdi-account",
                cg_icon: "mdi-paperclip",
                cp_icon: "mdi-cached",
                annual_plan_icon: "mdi-calendar" 
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
            }
        }
    },

    async created() {
        const userInfo = await Users.getUserProfile(this.userId);
        const readingsInfo = await Readings.getReadingsByWasteType(this.userId);
        
        this.user = userInfo.data;
        this.readings = readingsInfo.data;

        this.id = this.user.user_id;
        const nameSplit = this.user.name.split(' ');
        this.name = nameSplit[0];
        this.surname = nameSplit[1];
        this.tin = this.user.tin;
        this.phone_number = this.user.phone_number;
        this.email = this.user.email;
        this.user_type = this.user.user_type;
        if (this.user_type === "morador") {
            this.citizenInfo();
            this.groupByMonth();
        } else if (this.user_type === "admin") {
            this.fetchUsers(this.page);
        }
        
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
        }
    },

    validations() {
        return {
            name: { required, 
            maxLengthValue: maxLength(12),  
            alpha
            },
            surname: { required, 
            maxLengthValue: maxLength(12),
            alpha
            },
            tin: { required, 
            betweenValue: between(100000000, 999999999),
            numeric
            },
            oldPassword: {
            required,
            maxLengthValue: maxLength(24)
            },
            newPassword: {
            minLengthValue: minLength(8),
            maxLengthValue: maxLength(24)
            },
            phone_number: { required,
            betweenValue: between(900000000, 999999999),
            numeric
            },
            email: { required,
            minLengthValue: minLength(8),
            maxLengthValue: maxLength(36),
            email
            },
            address: { required,
            minLengthValue: minLength(8),
            maxLengthValue: maxLength(40)
            },
            postal_code: { required,
            minLengthValue: minLength(8),
            maxLengthValue: maxLength(8)
            },
            door_number: { required,
            maxLengthValue: maxLength(2),
            numeric
            } 
        }
    },

    computed: {
        progress() {
            return Math.min(100, this.password.length * 10)
        },

        color() {
            return ['error', 'warning', 'success'][Math.floor(this.progress / 40)]
        },

        checkOrderBy() {
            return this.orderBy === "(A-Z)" ? "asc" : "desc";
        }
    },

    watch: {
        page(newPage, oldPage) {
            // when a new page is selected, it will fetch the user's info from that page
            if (newPage !== oldPage) {
                this.fetchUsers(newPage);
            }
        },

        orderBy(newOrder, oldOrder) {

            if (newOrder !== oldOrder) {
                // when a new order by is selected, it automatically goes to page 1
                this.page = 1;
                this.fetchUsers(this.page)
            }
        }
    },
}
</script>

<style lang="scss" scoped>
.custom-tab .v-tab{
    color: #637381;
    font-weight: 500;
}

p{
    color: black;
}

.form-input{
    margin: 20px 0;
    color: #000;
  }

.v-label {
  color: #000;
}

.statistics_icon{
    margin: auto;
}


.edit_profile_icon{
    position: absolute;
    margin-left: 75%;
    margin-top: -30%;
}

.tax{
    color: #09A129; margin-left: 15px; font-weight: 700; font-size: 38px;
}

.trash_icon{
    margin-left: 30px;
}

.icon-background{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 50px;
    height: 50px;
    border-radius: 15px;
}

#undifferentiated-background{
    background-color: rgba($color: #455A64, $alpha: 0.08);
}

#organic-background{
    background-color: rgba($color: #6F4439, $alpha: 0.08);
}

#paper-background{
    background-color: rgba($color: #446DEB, $alpha: 0.08);
}

#glass-background{
    background-color: rgba($color: #09A129, $alpha: 0.08);
}

#plastic-background{
    background-color: rgba($color: #FFC727, $alpha: 0.08);
}

.trash-type-weight{
    display: flex;
    align-content: center;
}

.trash-type-weight-percentage{
    display: flex;
    align-items: center;
}

.trash-type-weight-percentage p{
    color: #22AD5C;
}

.trash-types-container{
    flex-wrap: nowrap;
}

.v-table{
    margin-top: 20px;
}

.welcome-card{
    margin: auto;
}

.welcome-column{
    display: flex;
    flex-direction: column;
    text-align: center;
}

.welcome-column h1{
    font-weight: 700;
    margin-bottom: 50px;
}

.admin-custom-tab, .custom-tab{
    margin: 0 8px;
}

.rounded-tabs {
  margin-top: 100px;
}

.rounded-tabs .v-tab, .custom-tab .v-tab{
    border-top-left-radius: 15px;
    border-top-right-radius: 15px;
}


#tab-window2 .window-header{
    display: flex;
    justify-content: space-between;
    margin: 20px 30px 50px 30px;
}

#tab-window2 .window-header .v-select{
    max-width: 150px;
}

#tab-window2 h2{
    font-weight: 650;
    font-size: 24px;
}

@media screen and (max-width: 1220px) {
  .edit_profile_icon{
    display: none;
  }
}

@media screen and (max-width: 960px) {
  .image-column img{
    display: none;
  }
}
</style>