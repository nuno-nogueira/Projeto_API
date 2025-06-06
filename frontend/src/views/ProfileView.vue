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
                            <v-col cols="4" md="3">
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
            </v-tabs-window-item>
            <v-tabs-window-item value="3">
            </v-tabs-window-item>
        </v-tabs-window>
    </div>
</template>

<script>
import { useVuelidate } from '@vuelidate/core'
import { required, minLength, maxLength, alpha, between, email, numeric} from '@vuelidate/validators'
import Users from '@/api/users';

export default {
    setup() { return { v$: useVuelidate() }},
    props: ['userId'],
    name: 'ProfileView',

    data() {
        return {
            user: null,
            tab: 1,
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
        }
    },

    async created() {
        const res = await Users.getUserProfile(this.userId);
        this.user = res.data;                

        this.id = this.user.user_id;
        let nameSplit = this.user.name.split(' ');
        this.name = nameSplit[0];
        this.surname = nameSplit[1];
        this.tin = this.user.tin;
        this.phone_number = this.user.phone_number;
        this.email = this.user.email;
        this.address = this.user.collection_point.street_name;
        this.postal_code = this.user.collection_point.postal_code;
        this.door_number = this.user.collection_point.door_number;
        this.user_type = this.user.user_type
        this.door_to_door_service = this.user.door_to_door_service === "sim" ? true : false;
        this.cp_id = this.user.collection_point.collection_point_id;
        this.feedbacks = this.user.feedbacks; 
        
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
                    door_to_door_service: this.door_to_door_service,
                    collection_point_id: this.cp_id
                }

                try {
                    const res = await Users.editProfile(userInfo)
                } catch (error) {
                    console.error(error.response?.data)
                    alert('Erro ao registar: ' + (error.response?.data.error || error.message))
                }
            }
        },

        activateService() {
            this.door_to_door_service = true;
            this.submitChanges()
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
        }
    }
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
  color: #000 !important;        /* força o texto do label a ser preto */
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

@media screen and (max-width: 1220px) {
  .edit_profile_icon{
    display: none;
  }
}
</style>