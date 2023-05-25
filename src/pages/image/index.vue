<script setup lang="ts">
import { router } from "@/router/main";
import { useChatGPTStore } from "@/stores/chatgpt";
import ImageConfig from "./imageConfig.vue";
import { originalAPI } from "@/api/openai/original";
import { HistoryType, ImageItem } from "@/types/gpt.type";
import { MessageItem } from "@/types/gpt.type";
import MessageBox from "./messageBox.vue";
import { useSystemStore } from "@/stores/system";
import Icon from "@/assets/icon";

const { loading } = storeToRefs(useSystemStore());

const conn = useChatGPTStore().connectionCheck();

const prompt = ref("");
const size = ref("1024x1024");
const num = ref(1);
const messageList = ref<Array<ImageItem | MessageItem>>([]);

async function generateImage() {
  messageList.value.push({
    role: "user",
    content: prompt.value,
  });

  try {
    const res = await originalAPI.imageGenerate({
      prompt: prompt.value.trim(),
      size: size.value,
      n: num.value,
    });

    messageList.value.push({ role: "image", content: res.data });
  } catch (error: any) { 
    messageList.value.push({ role: "error", content: error.message });
  }

  prompt.value = " "; 
}

function saveChat(save: Boolean) {
  if (save) {
    useChatGPTStore().setHistoryMessageList({
      key: new Date().getTime().toString(),
      type: HistoryType.image,
      title: "未定义",
      saveDate: new Date().toLocaleString(),
      history: messageList.value,
    });
  }
  messageList.value = [];
  useChatGPTStore().setCurrentMessageList([]);
}
</script>
<template>
  <div class="wrapper">
    <div class="visual-box">
      <image-config
        v-model:size="size"
        v-model:num="num"
        :image-message-list="messageList"
        @save-chat="saveChat"
      >
        <div class="info">
          <div class="conn-state">
            <v-icon
              :icon="Icon.circleSmall"
              :color="conn.state ? 'green' : 'red'"
            ></v-icon>
            <span>{{ conn.stateText }}</span>
          </div>
          <v-btn
            v-if="!conn.state"
            :prepend-icon="Icon.cog"
            variant="text"
            @click="router.push('/account')"
            >前往设置</v-btn
          >
        </div>
      </image-config>
      <message-box :message-list="messageList"></message-box>
    </div>
    <v-card
      width="100%"
      class="chat-box pa-2"
      :elevation="2"
      :disabled="loading"
    >
      <v-textarea
        id="prompt"
        v-model="prompt"
        :label="
          conn.state ? '在此输入图片提示词' : '连接异常，请检查网络或前往设置'
        "
        rows="1"
        max-rows="6"
        auto-grow
        clearable
        active
        :disabled="!conn.state"
        :counter="2000"
        :focused="true"
      >
        <template #append-inner>
          <v-icon
            v-show="prompt.trim() != ''"
            :icon="Icon.send"
            @click="generateImage"
          ></v-icon>
        </template>
      </v-textarea>
    </v-card>
  </div>
</template>
<style scoped lang="scss">
@import "@/assets/style/chat.scss";
</style>
