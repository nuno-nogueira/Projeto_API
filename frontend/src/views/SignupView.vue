<template>
  <v-form ref="form" v-model="form" @submit.prevent="onSubmit">
    <v-stepper
      v-model="step"
      :items="items"
      alt-labels
      show-actions
      class="stepper"
    >
      <template v-slot:item.1>
          <v-sheet class="form" rounded>
            <v-card class="mx-auto px-6 py-8 form-card" max-width="450" elevation="0">
              <h1>Criar uma conta</h1>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. </p>
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

              <v-text-field
                v-model="surname"
                :counter="12"
                :error-messages="v$.surname.$errors.map(e => e.$message)"
                variant="outlined"
                class="mb-2  form-input"
                label="Apelido"
                prepend-inner-icon="mdi-account"
                clearable
              ></v-text-field>

              <v-text-field
                v-model="tin"
                :error-messages="v$.tin.$errors.map(e => e.$message)"
                variant="outlined"
                class="mb-2  form-input"
                label="NIF"
                type="number"
                clearable
              ></v-text-field>

              <v-text-field
                v-model="password"
                :append-icon="visible1 ? 'mdi-eye' : 'mdi-eye-off'"
                :type="visible1 ? 'text' : 'password'"
                :error-messages="v$.password.$errors.map(e => e.$message)"
                variant="outlined"
                label="Palavra-Passe"
                placeholder="Insira a sua password"
                type = "password"
                @click:append="visible1 = !visible1"
                class="form-input"
                clearable loading
              >
              <template v-slot:loader>
                  <v-progress-linear
                    :color = "color"
                    :model-value="progress"
                    height="5"
                  ></v-progress-linear>
              </template></v-text-field>

              <v-text-field
                v-model="confirmPassword"
                :append-icon="visible2 ? 'mdi-eye' : 'mdi-eye-off'"
                :type="visible2 ? 'text' : 'password'"
                :error-messages="v$.confirmPassword.$errors.map(e => e.$message)"
                variant="outlined"
                label="Confirme a palavra-Passe"
                placeholder="Confirme a sua password"
                type = "password"
                @click:append="visible2 = !visible2"
                class="form-input"
                clearable
              ></v-text-field>
            </v-card>
          </v-sheet>
      </template>

      <template v-slot:item.2>
        <v-sheet class="form" rounded>
          <v-card class="mx-auto px-6 py-8 form-card" max-width="450" elevation="0">
            <h1>Criar Conta</h1>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. </p>
              <v-text-field
              v-model="phone_number"
              :error-messages="v$.phone_number.$errors.map(e => e.$message)"
              :counter="9"
              variant="outlined"
              class="mb-2 form-input"
              label="Telefone"
              prepend-inner-icon="mdi-phone"
              clearable
              > 
              </v-text-field>
              <v-text-field  
              v-model="email"
              :error-messages="v$.email.$errors.map(e => e.$message)"
              :counter="36"
              variant="outlined"
              class="mb-2 form-input"
              label="Email"
              prepend-inner-icon="mdi-email"
              clearable
              ></v-text-field>
              <v-text-field
              v-model="address"
              :error-messages="v$.address.$errors.map(e => e.$message)"
              :counter="40"
              variant="outlined"
              class="mb-2 form-input"
              label="Morada"
              clearable
              >
              </v-text-field>

              <v-container>
                <v-row>
                  <v-col cols="12" md="6">
                    <v-text-field
                    v-model="postal_code"
                    :error-messages="v$.postal_code.$errors.map(e => e.$message)"
                    variant="outlined"
                    class="mb-2 form-input"
                    label="Código Postal"
                    clearable
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-text-field
                    v-model="apartment_floor"
                    :error-messages="v$.apartment_floor.$errors.map(e => e.$message)"
                    variant="outlined"
                    class="mb-2 form-input"
                    label="Andar"
                    clearable
                    >
                    </v-text-field>
                  </v-col>

                  <v-switch
                  v-model="door_to_door_service"
                  color="success"
                  label="Serviço Porta a Porta"
                  inset></v-switch>
                </v-row>
              </v-container>
          </v-card>
        </v-sheet>
      </template>

      <template v-slot:item.3>
          <v-card class="mx-auto px-6 py-8 form-card" max-width="450" elevation="0">
            <h1>Confirmar dados</h1>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. </p>
  
          </v-card>
          <v-container class="mb-6">
            <v-row>
              <v-col lg="6">
                <v-card class="mx-auto"
                prepend-icon="mdi-account"
                width="450"  elevation="0">
                  <template v-slot:title>
                    <span class="font-weight-black">Dados Pessoais</span>
                  </template>
                
                  <v-card-text>
                    <p><span class="font-weight-black">Nome: </span>{{ this.name }}</p>
                    <p><span class="font-weight-black">Sobrenome: </span>{{ this.surname }}</p>
                    <p><span class="font-weight-black">NIF: </span>{{ this.tin }}</p>
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col lg="6">
                <v-card class="mx-auto"
                prepend-icon="mdi-information"
                width="450"  elevation="0">
                  <template v-slot:title>
                    <span class="font-weight-black">Informações da morada</span>
                  </template>
                
                  <v-card-text>
                    <p><span class="font-weight-black">Telefone: </span>{{ this.phone_number }}</p>
                    <p><span class="font-weight-black">Email: </span>{{ this.email }}</p>
                    <p><span class="font-weight-black">Morada: </span>{{ this.address }}</p>
                    <p><span class="font-weight-black">Código Postal: </span>{{ this.postal_code }}</p>
                    <p><span class="font-weight-black">Andar: </span>{{ this.apartment_floor }}</p>
                    <p v-if="door_to_door_service"><span class="font-weight-black">Serviço Porta a Porta: </span>Sim</p>
                    <p v-else><span class="font-weight-black">Serviço Porta a Porta: </span>Não</p>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-container>

        <v-btn
          color="success"
          size="large"
          @click="onSubmit"
          variant="elevated"
          block>
          Concluir
        </v-btn>
      </template>


    </v-stepper>
  </v-form>
  
  <img 
    class="recyle-icon"
    src="../assets/icons/recycle.webp"
    ></img>
</template>
<script>
import { useVuelidate } from '@vuelidate/core'
import { required, minLength, maxLength, alpha, between, email, numeric, sameAs } from '@vuelidate/validators'
import Users from '@/api/users'

  export default {
    setup() { return { v$: useVuelidate() }},

    data() {
      return {
        form: false,
        name: '',
        surname: '',
        tin: '',
        password: '',
        confirmPassword: '',
        phone_number: '',
        email:  '',
        address: '',
        postal_code: '',
        apartment_floor: '',
        door_to_door_service: false,
        visible1: false,
        visible2: false,
        step: 1,
        items: [
          "Dados pessoais",
          "Informações da morada",
          "Confirmação de dados"
        ]
        }
    },

    methods: {
      async onSubmit() {
        //starts the validation fotr all form inputs
        const result = await this.v$.$validate()
        
        if (result) {
          const userInfo = {
            name: this.name + " " + this.surname,
            tin: this.tin,
            password: this.password,
            email: this.email,
            phone_number: this.phone_number,
            street_name: this.address,
            postal_code: this.postal_code,
            door_number: this.apartment_floor,
            door_to_door_service: this.door_to_door_service
          }

          try {
            const res = await Users.register(userInfo)
            this.$router.push({name: "login"})
            
          } catch (error) {
            console.error(error.response?.data)
            alert('Erro ao registar: ' + (error.response?.data.error || error.message))
          }
        } else {
          //verifies which input is invalid

          //object with the input's corresponding step
          const fieldSteps = {
            name: 1,
            surname: 1,
            tin: 1,
            password: 1,
            confirmPassword: 1,
            phone_number: 2,
            email: 2,
            address: 2,
            postal_code: 2,
            apartment_floor: 2
          }

          // finds the invalid inputs
          const invalidField = Object.keys(fieldSteps).find(field => 
            this.v$[field].$invalid
          )

          // when found, redirects the user the step where the invalid input is
          if (invalidField) {
            this.step = fieldSteps[invalidField]
          }
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
        password: { required,
          minLengthValue: minLength(10),
          maxLengthValue: maxLength(24)
         },
        confirmPassword: { required,
          sameAsPassword: sameAs(this.password)
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
        apartment_floor: { required,
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
    },

    
  }
</script>

<style scoped>
  .stepper{
    width: 50%;
    height: 50%;
    margin: 100px auto auto auto;
  }

  .form-card h1, .form-card p{
    text-align: center;
  }

  .form-card h1{
    font-size: 32px;
    font-weight: 700;
  }

  .form-card p {
    margin: 5px 0 20px; 
    font-size: 12px;}

  .form-input{
    margin: 20px 0;
  }

  .recyle-icon{
    width: 150px;
    height: 190px;
    margin-left: 30px;
  }
</style>