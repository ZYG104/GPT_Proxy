<script setup lang="ts">
import NavBar from "@/layout/navbar.vue";
</script>

<template>
  <v-app>
    <v-app-bar :elevation="2" :absolute="true">
      <div class="title">ChatGPT Proxy</div>
    </v-app-bar>
    <v-main class="custom-main" :scrollable="true">
      <router-view v-slot="{ Component }">
        <KeepAlive>
          <Transition>
            <component :is="Component" />
          </Transition>
        </KeepAlive>
      </router-view>
    </v-main>
    <NavBar></NavBar>
  </v-app>
</template>

<style scoped lang="scss">
$navbarHeight: 60px;

.custom-main {
  overflow-y: auto;
  overflow-x: hidden;
  background-color: #f5f5f5;
}
.title {
  width: 100%;
  text-align: center;
  font-size: 18px;
  font-weight: 600;
}
</style>
