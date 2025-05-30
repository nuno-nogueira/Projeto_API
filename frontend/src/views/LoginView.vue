<template>
  <v-sheet class="form" rounded>
    <v-card class="mx-auto px-6 py-8 form-card" max-width="450">
      <h1>Iniciar sessão</h1>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. </p>
      <v-form 
        ref="form"
        v-model="form"
        @submit.prevent="onSubmit"
      >
        <v-text-field
          v-model="tin"
          :error-messages="v$.tin.$errors.map(e => e.$message)"
          variant = "outlined"
          class="mb-2 sign-up-input"
          label="NIF"
          type="number"
          clearable
        ></v-text-field>

        <v-text-field
          v-model="password"
          :error-messages="v$.password.$errors.map(e => e.$message)"
          :append-icon="visible ? 'mdi-eye' : 'mdi-eye-off'"
          :type="visible ? 'text' : 'password'"
          variant = "outlined"
          label="Palavra-Passe"
          placeholder="Insira a sua password"
          type = "password"
          @click:append="visible = !visible"
          class="sign-up-input"
          clearable
        >
          <template v-slot:loader>
            <v-progress-linear
              :color = "color"
              :model-value="progress"
              height="5"
            ></v-progress-linear>
          </template>  
        </v-text-field>

        <br>

        <v-btn
          :disabled="!form"
          color="success"
          size="large"
          @click="onSubmit"
          type="submit"
          variant="elevated"
          block
        >
          Entrar
        </v-btn>
      </v-form>
    </v-card>

    <img 
    class="recyle-icon"
    src="../assets/icons/recycle.webp"
    ></img>
  </v-sheet>
</template>
<script>
  import Users from '@/api/users';
  import { useVuelidate } from '@vuelidate/core'
  import { useAuthStore } from '@/stores/auth'
  import { required, between, numeric} from '@vuelidate/validators'
  
  
  export default {
    setup() { return { v$: useVuelidate() }},

    data() {
      return {
        form: false,
        tin: '',
        password: '',
        visible: false,
        authStore: useAuthStore(),
      }
    },

    methods: {
      async onSubmit() {
        //starts the validation fotr all form inputs
        const result = await this.v$.$validate()
        
        if (result) {
          const userInfo = {
            tin: this.tin,
            password: this.password
          }

          try {
            const res = await Users.login(userInfo)

            const token = res.data.accessToken;
            const userId = res.data.data.user_id;

            localStorage.setItem('token', token);
            localStorage.setItem('userId', userId)

            this.authStore.setToken(token);
            this.authStore.setUser(res.data.data)
            
            this.$router.push({ name: 'profile', params: { userId } });
          } catch (error) {
            alert(error.response?.data.msg || 'Erro no login');
            console.error("Login falhou:", error);
          }
        }
      },
    },
    
    validations() {
      return {
        tin: {required,
          betweenValue: between(100000000, 999999999),
          numeric
        },
        password: {required}
      }
    },

    computed: {
      progress() {
        return Math.min(100, this.password.length * 10)
      },
      
      color() {
        return ['error', 'warning', 'success'][Math.floor(this.progress / 40)]
      }
    },
  };
</script>

<style scoped>
  .form { margin: 150px 0;}
  p {margin: 5px 0 20px;}

  .form-card h1, .form-card p{
    text-align: center;
  }

  .form-card h1{
    font-size: 32px;
    font-weight: 700;
  }

  .form-card p{
    margin: 5px 0 20px;
    font-size: 12px;
  }

  .sign-up-input{
    margin: 20px 0;
  }

  .recyle-icon{
    width: 150px;
    height: 190px;
    margin-left: 30px;
  }
</style>