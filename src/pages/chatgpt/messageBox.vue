<script setup lang="ts">
import { useSystemStore } from "@/stores/system";
import MarkdownFormat from "@/components/MarkdownFormat/index.vue";
import { MessageItem } from "@/types/gpt.type";

const { loading } = storeToRefs(useSystemStore());

const { messageList } = defineProps({
  messageList: Array<MessageItem>,
});
</script>
<template>
  <div class="message-box">
    <!-- chat message list -->
    <div
      class="message-item"
      v-for="(item, index) in messageList"
      :class="item.role == 'user' ? 'flex-row-reverse' : ''"
    >
      <v-avatar class="pa-2 mx-2" size="40" color="rgb(96,125,139)" rounded>
        <div v-if="item.role == 'user'">
          <b>U</b>
        </div>
        <v-img
          v-else
          :width="30"
          aspect-ratio="1/1"
          cover
          src="/openai.svg"
          class="avatat-bg"
        ></v-img>
      </v-avatar>
      <v-card
        class="pa-2"
        label
        elevation="0"
        :class="item.role == 'user' ? 'ml-2' : 'mr-2'"
      >
        <markdown-format :content="item.content"></markdown-format>
      </v-card>
    </div>
    <!-- loading box -->
    <div v-show="loading" class="message-item">
      <v-avatar class="pa-2 mx-2" size="40" color="rgb(96,125,139)" rounded>
        <v-btn variant="text">
          <v-img :width="30" aspect-ratio="1/1" cover src="/openai.svg"></v-img>
        </v-btn>
      </v-avatar>
      <v-card class="pa-2" label elevation="0">
        <div class="chat-loading-animation">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <template slot="loader">
          <v-progress-linear
            absolute
            class="bottom-0"
            indeterminate
            :active="loading"
          ></v-progress-linear>
        </template>
      </v-card>
    </div>
  </div>
</template>
<style scoped lang="scss">
.message-box {
  padding-bottom: 300px;
}

.message-item {
  display: flex;
  box-sizing: border-box;
  padding: 12px 0;
}

.chat-loading-animation {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 24px;

  > span {
    width: 10px;
    height: 10px;
    margin: 0 5px;
    background-color: #6f6f6f;
    border-radius: 50%;
    display: inline-block;
    animation: loading 1.5s ease-in-out infinite;

    &:nth-child(2) {
      animation-delay: 0.2s;
    }
    &:nth-child(3) {
      animation-delay: 0.4s;
    }
  }

  @keyframes loading {
    0% {
      transform: scale(0);
    }
    50% {
      transform: scale(1);
    }
    100% {
      transform: scale(0);
    }
  }
}
</style>
