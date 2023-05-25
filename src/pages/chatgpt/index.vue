<script setup lang="ts"> 
import MessageBox from "./messageBox.vue";
import ModelManage from "./modelManage.vue";
import { useSystemStore } from "@/stores/system";
import { originalAPI } from "@/api/openai/original"; 
import { useChatGPTStore } from "@/stores/chatgpt";
import { useRouter } from "vue-router";
import { HistoryType, MessageItem } from "@/types/gpt.type";
import Icon from "@/assets/icon";

const router = useRouter();

const conn = useChatGPTStore().connectionCheck();

const question = ref("");

const { loading } = storeToRefs(useSystemStore());

const messageList = ref<Array<MessageItem>>([]);

const { model } = storeToRefs(useChatGPTStore());

async function sendMessage() {
  messageList.value.push({
    role: "user",
    content: question.value,
  });

  question.value = " ";

  const res = (await originalAPI.chat({
    messages: messageList.value,
  })) as any;

  messageList.value.push(res.choices[0].message);

  useChatGPTStore().setCurrentMessageList(messageList.value);
}

onMounted(() => {
  const inputBox = document.querySelector("#question") as HTMLElement;
  inputBox?.addEventListener("focus", (e) => {
    question.value = question.value.trim();
  });
  inputBox?.addEventListener("blur", () => {
    if (!question.value) {
      question.value = " ";
    }
  });
});

function saveChat(save: Boolean) {
  if (save) {
    useChatGPTStore().setHistoryMessageList({
      key: new Date().getTime().toString(),
      type: HistoryType.chat,
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
      <model-manage @saveChat="saveChat">
        <div
          class="mx-auto text-center pt-3 border-bottom"
          v-show="messageList.length == 0"
        >
          开始你的对话
        </div>
        <div class="info">
          <div class="model">当前模型：{{ model }}</div>
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
      </model-manage>
      <message-box :message-list="messageList"></message-box>
    </div>
    <v-card
      width="100%"
      class="chat-box pa-2"
      :elevation="2"
      :disabled="loading"
    >
      <v-textarea
        id="question"
        v-model="question"
        :label="
          conn.state ? '在此输入你的问题' : '连接异常，请检查网络或前往设置'
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
            v-show="question.trim() != ''"
            :icon="Icon.send"
            @click="sendMessage"
          ></v-icon>
        </template>
      </v-textarea>
    </v-card>
  </div>
</template>
<style scoped lang="scss">
@import "@/assets/style/chat.scss";
:deep(.v-textarea--auto-grow .v-field__input) {
  overflow-y: auto !important;
}
</style>
