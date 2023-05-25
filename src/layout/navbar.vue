<script setup lang="ts">
import Icon from "@/assets/icon";
import { useSystemStore } from "@/stores/system";
import { useRouter } from "vue-router";

const { pageIndex } = storeToRefs(useSystemStore());

const color = computed(() => {
  switch (pageIndex.value) {
    case 0:
      useRouter().push("/");
      return "rgba(96,125,139,1)";
    case 1:
      useRouter().push("/image");
      return "rgba(38,164,153,1)";
    case 2:
      useRouter().push("/note");
      return "rgba(121,85,72,1)";
    case 3:
      useRouter().push("/account");
      return "rgba(63,81,181,1)";
    default:
      return "rgba(96,125,139,1)";
  }
});
</script>
<template>
  <v-bottom-navigation
    v-model="pageIndex"
    class="bottom-bar"
    :bg-color="color"
    color="white"
    mode="shift"
    grow
  >
    <v-btn>
      <v-icon>{{ Icon.chatProcessing }}</v-icon>
      <span>Chat</span>
    </v-btn>
    <v-btn>
      <v-icon>{{ Icon.image }}</v-icon>
      <span>图像</span>
    </v-btn>
    <v-btn>
      <v-icon>{{ Icon.book }}</v-icon>
      <span>笔记</span>
    </v-btn>
    <v-btn>
      <v-icon>{{ Icon.accountCircle }}</v-icon>
      <span>我的</span>
    </v-btn>
  </v-bottom-navigation>
  <div class="safe-bottom" :style="{ 'background-color': color }"></div>
</template>

<style scoped lang="scss">
$navbarHeight: 60px;
.bottom-bar {
  height: $navbarHeight !important;
  bottom: 0;
  bottom: constant(safe-area-inset-bottom) !important;
  bottom: env(safe-area-inset-bottom) !important;
}

.safe-bottom {
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 30px;
  /* safe height for ios */
  height: constant(safe-area-inset-bottom);
  height: env(safe-area-inset-bottom);
}
</style>
