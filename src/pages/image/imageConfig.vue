<script setup lang="ts">
import Icon from "@/assets/icon";

const props = defineProps(["size", "num", "imageMessageList"]);
const emit = defineEmits(["update:size", "update:num", "saveChat"]);

const size = computed({
  get: () => props.size,
  set: (val) => emit("update:size", val),
});

const num = computed({
  get: () => props.num,
  set: (val) => emit("update:num", val),
});

const dialog = ref({
  menu: false,
  model: false,
  clear: false,
});

function clearChat(save: boolean) {
  emit("saveChat", save);
  dialog.value.clear = false;
}
</script>
<template>
  <div class="operate-group">
    <div class="info">
      <slot></slot>
      <div class="image-config mt-2">
        <div>图像像素：{{ size }}</div>
        <div>生成数量：{{ num }}</div>
      </div>
    </div>
  </div>
  <div class="menu-group">
    <v-btn
      class="menu-btn"
      icon=""
      color="blue"
      @click="dialog.menu = !dialog.menu"
    >
      <template #default>
        <v-icon
          :style="{
            transform: dialog.menu ? 'rotate(0deg)' : 'rotate(45deg)',
          }"
          :icon="Icon.close"
        ></v-icon>
      </template>
    </v-btn>
    <v-expand-transition>
      <div v-show="dialog.menu" class="hide-wrapper">
        <v-btn :icon="Icon.menu" @click="dialog.model = true"></v-btn>
        <v-btn
          v-show="props.imageMessageList && props.imageMessageList.length > 0"
          class="clear rounded-circle"
          @click="dialog.clear = true"
        >
          <template #default>
            <v-img width="24" height="24" src="/clear.png"></v-img>
          </template>
        </v-btn>
      </div>
    </v-expand-transition>
  </div>
  <!-- model select -->
  <v-dialog
    v-model="dialog.model"
    fullscreen
    :scrim="false"
    transition="dialog-bottom-transition"
  >
    <v-card>
      <v-toolbar
        title="图像生成设置"
        color="rgb(96,125,139)"
        style="color: white"
      >
        <v-btn :icon="Icon.close" @click="dialog.model = false"> </v-btn>
      </v-toolbar>
      <div>
        <v-radio-group v-model="size" label="图像大小设置" inline>
          <v-radio label="256x256" value="256x256"></v-radio>
          <v-radio label="512x512" value="512x512"></v-radio>
          <v-radio label="1024x1024" value="1024x1024"></v-radio>
        </v-radio-group>
        <v-divider></v-divider>
        <div class="ma-2">
          <div class="v-label">生成数量 {{ num }}</div>
          <v-slider v-model="num" step="1" max="10" min="1"></v-slider>
        </div>
      </div>
    </v-card>
  </v-dialog>
  <!-- chat manage -->
  <v-dialog v-model="dialog.clear" width="auto">
    <v-card>
      <v-card-text>
        <p class="text-center">即将开始新的聊天</p>
      </v-card-text>
      <v-card-actions>
        <div class="w-100">
          <v-btn
            color="info"
            block
            :prepend-icon="Icon.contentSave"
            @click="clearChat(true)"
            >保存当前对话</v-btn
          >
          <v-btn
            class="delete-chat"
            color="warning"
            block
            :prepend-icon="Icon.delete"
            @click="clearChat(false)"
            >删除当前对话</v-btn
          >
        </div>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<style scoped lang="scss">
.image-config {
  font-size: 14px;
  text-align: center;
}

.menu-group {
  position: fixed;
  top: 70px;
  right: 0;
  z-index: 999;
}

.hide-wrapper {
  position: absolute;
  top: 60px;
  right: 0;
  width: 50px;
  padding: 0 0 0 2px;

  .clear {
    width: 48px;
    min-width: 48px;
    height: 48px;
    margin-top: 10px;
  }
}

.box {
  position: absolute;
  left: 0;
  bottom: $navbarHeight;
  width: 100%;
}

.delete-chat {
  margin: 0 !important;
}
</style>
