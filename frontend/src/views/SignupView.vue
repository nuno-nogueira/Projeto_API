<template>
  <v-sheet class="form" rounded>
    <v-card class="mx-auto px-6 py-8" max-width="344">
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
          class="mb-2"
          label="Nome"
          clearable
        ></v-text-field>
        <v-text-field
          v-model="apelido"
          :readonly="loading"
          :rules="[required]"
          class="mb-2"
          label="Apelido"
          clearable
        ></v-text-field>
        <v-text-field
          v-model="nif"
          :readonly="loading"
          :rules="[required]"
          class="mb-2"
          label="NIF"
          clearable
        ></v-text-field>

        <v-text-field
          v-model="password"
          :readonly="loading"
          :rules="[required]"
          label="Palavra-Passe"
          placeholder="Enter your password"
          clearable
        ></v-text-field>
        <br>
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
<script setup>
  import { ref } from 'vue'

  const form = ref(false)
  const nome = ref(null)
  const password = ref(null)
  const loading = ref(false)

  function onSubmit () {
    if (!form.value) return
    loading.value = true
    setTimeout(() => (loading.value = false), 2000)
  }
  function required (v) {
    return !!v || 'Field is required'
  }
</script>

<style scoped>
  .form { margin: 150px 0;}
  p {margin: 5px 0 20px;}
</style>