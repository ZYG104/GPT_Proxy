<script setup lang="ts">
import { useChatGPTStore } from "@/stores/chatgpt";
import MessageBox from "@/pages/chatgpt/messageBox.vue";
import ImageMessageBox from "@/pages/image/messageBox.vue";
import {
  HistoryType,
  MessageItem,
  MessageHistory,
  EditMessageHistory,
  ImageItem,
} from "@/types/gpt.type";
import { rule } from "@/utils/rule";
import Icon from "@/assets/icon";

const { historyMessageList } = storeToRefs(useChatGPTStore());

let editList = transformMessageList(historyMessageList.value);

const currentEdit = ref({} as EditMessageHistory);

const dialog = ref({
  deleteConfirm: false,
});

const editTitle = (item: EditMessageHistory) => {
  currentEdit.value = item;
  item.edit = true;
};

const form = ref<any>(null);

const saveTitle = async (item: EditMessageHistory) => {
  if (!form) {
    return;
  }
  const { valid } = await form.value[0].validate();

  if (valid) {
    useChatGPTStore().updateHistoryMessageItem(item);
  } else {
  }
  item.edit = false;
};

const cancelEdit = (item: EditMessageHistory) => {
  item.edit = false;
};

function transformMessageList(
  messageList: Array<MessageHistory>
): Ref<Array<EditMessageHistory>> {
  return ref(
    messageList.map((item) => {
      return { ...item, edit: false };
    })
  );
}

function deleteConfirm(item: EditMessageHistory) {
  currentEdit.value = item;
  dialog.value.deleteConfirm = true;
}

function deleteChat(item: MessageHistory) {
  useChatGPTStore().deleteHistoryMessageItem(currentEdit.value.key);
  editList = transformMessageList(historyMessageList.value);
  dialog.value.deleteConfirm = false;
}
</script>
<template>
  <div class="note">
    <div
      v-if="!historyMessageList || historyMessageList.length == 0"
      class="text-center"
    >
      暂无记录
    </div>
    <v-card class="message-item" v-for="item in editList" :key="item.key">
      <v-card-title>
        <div>
          <div class="d-flex justify-space-between" v-if="!item.edit">
            <span>{{ item.title }}</span>
            <div>
              <v-btn
                :prepend-icon="Icon.delete"
                variant="text"
                color="error"
                @click="deleteConfirm(item)"
                >删除对话</v-btn
              >
              <v-btn
                :prepend-icon="Icon.bookEdit"
                variant="text"
                color="primary"
                @click="editTitle(item)"
              >
                修改标题
              </v-btn>
            </div>
          </div>
          <div
            class="d-flex align-center justify-space-between"
            v-if="item.edit"
          >
            <v-form
              ref="form"
              :style="{
                flex: 1,
              }"
            >
              <v-text-field
                v-model="currentEdit.title"
                :rules="[rule.required]"
                label="标题"
                variant="underlined"
                clearable
                placeholder="请输入新的标题"
              ></v-text-field>
            </v-form>
            <div>
              <v-btn
                :prepend-icon="Icon.contentSaveAll"
                variant="text"
                color="info"
                @click="saveTitle(item)"
                >保存</v-btn
              >
              <v-btn
                :prepend-icon="Icon.close"
                variant="text"
                color="error"
                @click="cancelEdit(item)"
                >取消</v-btn
              >
            </div>
          </div>
        </div>
      </v-card-title>
      <v-card-text>
        <div class="mb-2">
          <b>保存时间：</b>
          {{ item.saveDate }}
        </div>
        <v-expansion-panels>
          <v-expansion-panel
            title="聊天记录"
            bg-color="rgb(121,85,72)"
            color="#fff"
          >
            <v-expansion-panel-text>
              <message-box
                v-if="item.type == HistoryType.chat"
                :message-list="(item.history as Array<MessageItem>)"
              ></message-box>
              <image-message-box :message-list="item.history" v-else>
              </image-message-box>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-card-text>
    </v-card>
    <v-dialog v-model="dialog.deleteConfirm" width="auto">
      <v-card>
        <v-card-text>
          <p class="text-center">对话删除确认!</p>
          <p class="text-center">{{ currentEdit?.title }}</p>
          <p class="text-center">{{ currentEdit?.key }}</p>
        </v-card-text>
        <v-card-actions>
          <div class="w-100">
            <v-btn
              color="info"
              block
              :prepend-icon="Icon.delete"
              @click="deleteChat"
              >确定删除</v-btn
            >
            <v-btn
              class="delete-chat"
              color="warning"
              block
              :prepend-icon="Icon.close"
              @click="dialog.deleteConfirm = false"
              >取消删除</v-btn
            >
          </div>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<style scoped lang="scss">
.note {
  box-sizing: border-box;
  padding: 10px;
}
.message-item {
  margin-top: 10px;
}
.delete-chat {
  margin: 0 !important;
}
</style>
