<template>
  <v-sheet class="form" rounded>
    <v-card class="mx-auto px-6 py-8 form-card" max-width="450">
      <h1>Criar uma conta</h1>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. </p>
      <v-form 
        v-model="form"
        @submit.prevent="onSubmit"
      >
        <v-text-field
          v-model="nome"
          :readonly="loading"
          :rules="[required]"
          variant="outlined"
          class="mb-2 sign-up-input"
          label="Nome"
          prepend-inner-icon="mdi-account"
          clearable
        ></v-text-field>
        <v-text-field
          v-model="apelido"
          :readonly="loading"
          :rules="[required]"
          variant="outlined"
          class="mb-2  sign-up-input"
          label="Apelido"
          prepend-inner-icon="mdi-account"
          clearable
        ></v-text-field>
        <v-text-field
          v-model="nif"
          :readonly="loading"
          :rules="[required]"
          variant="outlined"
          class="mb-2  sign-up-input"
          label="NIF"
          clearable
        ></v-text-field>

        <v-text-field
          v-model="password"
          :readonly="loading"
          :rules="[required]"
          :append-icon="visible ? 'mdi-eye' : 'mdi-eye-off'"
          :type="visible ? 'text' : 'password'"
          variant="outlined"
          label="Palavra-Passe"
          placeholder="Insira a sua password"
          type = "password"
          @click:append="visible = !visible"
          class="sign-up-input"
          clearable loading
        >
        <template v-slot:loader>
            <v-progress-linear
              :color = "color"
              :model-value="progress"
              height="5"
            ></v-progress-linear>
        </template></v-text-field>

        <v-btn
          :disabled="!form"
          :loading="loading"
          color="success"
          size="large"
          type="submit"
          variant="elevated"
          block
        >
          Concluir
        </v-btn>
      </v-form>
    </v-card>
  </v-sheet>
</template>
<script>
  export default {
    data() {
      return {
        form: false,
        nome: '',
        password: '',
        visible: false,
        loading: false,
        }
    },

    methods: {
      onSubmit() {
        if (!form.value) return
        loading.value = true
        setTimeout(() => (loading.value = false), 2000)
      },

      required (v) {
          return !!v || 'Campo obrigatório'
      },
    },

    computed: {
      progress() {
        return Math.min(100, this.password.length * 10)
      },

      color() {
        return ['error', 'warning', 'success'][Math.floor(this.progress / 40)]
      }
    },
  }

  // const form = ref(false)
  // const nome = ref(null)
  // const password = ref(null)
  // const loading = ref(false)

  // function onSubmit () {
  //   if (!form.value) return
  //   loading.value = true
  //   setTimeout(() => (loading.value = false), 2000)
  // }
  // function required (v) {
  //   return !!v || 'Field is required'
  // }
</script>

<style scoped>
  .form { 
    margin: 150px 0;}
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

  .sign-up-input{
    margin: 20px 0;
  }
</style>