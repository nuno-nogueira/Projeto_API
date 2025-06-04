<template>
        <!-- not logged -->
        <div class="navbar">
            <div class="navbar-left">
      <RouterLink :to="{ name: 'home' }"
        ><img src="@/assets/icons/logo.svg" alt=""
      /></RouterLink>
      <v-menu
        offset="15"
        transition="scale-transition"
        elevation="0"
        max-width="500"
      >
        <template v-slot:activator="{ props }">
          <v-btn
            v-bind="props"
            text
            elevation="0"
            class="pa-0 text-none dropdown"
          >
            Sobre
          </v-btn>
        </template>

        <v-list elevation="0" dense class="pa-0">
          <v-list-item lines=false>
            <v-list-item-title>
              <RouterLink :to="{ name: 'collectService' }">
                Recolha
              </RouterLink>
            </v-list-item-title>
          </v-list-item>
          <v-list-item lines=false  >
            <v-list-item-title>
              <RouterLink :to="{ name: 'collectService' }">
                Contentores
              </RouterLink>
            </v-list-item-title>
          </v-list-item>
          <v-list-item lines=false >
            <v-list-item-title>
              <RouterLink :to="{ name: 'collectService' }">
                Pontos de recolha
              </RouterLink>
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

    <RouterLink :to="{ name: 'maps' }">Mapa</RouterLink>
      <!-- <RouterLink :to="{ name: 'contacts' }">Contactos</RouterLink> -->

    </div>
            <div class="navbar-right">
                <RouterLink :to="{name: 'signup'}">Criar conta</RouterLink>
                <v-btn color="#09A129">
                    <RouterLink :to="{name: 'login'}" class="link-white">Entrar</RouterLink>
                </v-btn>
            </div>
        </div>
        <!-- logged -->
        <!-- <div class="navbar">
            <div class="navbar-left">
                <a href=""><img src="@/assets/icons/logo.svg" alt=""></a>
                <a href="">Serviços</a>
                <a href="">Mapa</a>
                <a href="">Contactos</a>
            </div>
            <div class="navbar-right">
                <v-btn icon color="#fff">
                    <v-icon color="#043601">mdi-account</v-icon>
                </v-btn>
                <v-btn color="#09A129">Sair</v-btn>
            </div>
        </div> -->
</template>
<script setup>
import { RouterLink } from 'vue-router';
</script>
<style scoped>
.navbar {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: 85vw;
  height: 60px;
  background-color: var(--color-White);
  color: var(--color-Pakistan-green);
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 8px;
  z-index: 100;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
.navbar-left,
.navbar-right {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 10px 20px 5px 20px;
}
a,span {
  text-decoration: none;
  color: var(--color-Pakistan-green);
}
.link-white {
  color: var(--color-White);
}

.v-btn--variant-elevated, .v-btn--variant-flat, .v-btn,button, input, optgroup, select, textarea{
    color: var(--color-Pakistan-green);
    
}

.v-list-item{
  gap: 2px;
}
</style>

