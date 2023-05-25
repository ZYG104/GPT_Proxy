<script setup lang="ts">
import Icon from "@/assets/icon";
import { useChatGPTStore } from "@/stores/chatgpt";

const emit = defineEmits(["saveChat"]);

const dialog = ref({
  menu: false,
  model: false,
  clear: false,
});

const { model } = storeToRefs(useChatGPTStore());

const modelList = ref(["gpt-3.5-turbo", "gpt-3.5-turbo-0301", "gpt-4-0314"]);

const { currentMessageList } = storeToRefs(useChatGPTStore());

function changeModel(model: string) {
  useChatGPTStore().setModel(model);
}

function clearChat(save: Boolean) {
  emit("saveChat", save);

  dialog.value.clear = false;
}
</script>
<template>
  <div class="operate-group">
    <div class="info">
      <slot></slot>
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
          v-show="currentMessageList && currentMessageList.length > 0"
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
      <v-toolbar title="模型切换" color="rgb(96,125,139)" style="color: white">
        <v-btn :icon="Icon.close" @click="dialog.model = false"> </v-btn>
      </v-toolbar>
      <v-list lines="three" select-strategy="classic">
        <v-list-subheader>可用模型</v-list-subheader>
        <v-radio-group v-model="model" @update:modelValue="changeModel">
          <v-list-item v-for="(item, index) in modelList" :key="index">
            <v-radio :label="item" :value="item"></v-radio>
          </v-list-item>
        </v-radio-group>
      </v-list>
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
