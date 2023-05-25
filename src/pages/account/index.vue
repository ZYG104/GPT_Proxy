<script setup lang="ts">
import { originalAPI } from "@/api/openai/original";
import { useChatGPTStore } from "@/stores/chatgpt";
import { useSystemStore } from "@/stores/system";
import { rule } from "@/utils/rule";

const disabled = ref(false);
const { apiKey } = storeToRefs(useChatGPTStore());
const { loading } = storeToRefs(useSystemStore());

const form = ref();

const snackbar = ref(false);
const message = ref("");

async function validateKey() {
  const { valid } = await form.value.validate();

  if (!valid) {
    return;
  }

  useChatGPTStore().setApiKey(apiKey.value);

  const res = (await originalAPI.modelList()) as any;

  if (res.data) {
    message.value = "验证成功";
    useChatGPTStore().setConnection(true);
    disabled.value = true;
  } else {
    message.value = res.error.message;
    useChatGPTStore().setConnection(false);
  }

  snackbar.value = true;
}
</script>
<template>
  <div class="account">
    <v-card :loading="loading" title="密钥管理">
      <v-form ref="form">
        <v-card-text>
          <v-text-field
            v-model="apiKey"
            :rules="[rule.required]"
            :disabled="disabled"
            label="API Key"
          ></v-text-field>
        </v-card-text>
      </v-form>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn v-show="disabled" @click="disabled = false">编辑</v-btn>
        <v-btn v-show="!disabled" @click="disabled = true">取消</v-btn>
        <v-btn color="success" v-show="!disabled" @click="validateKey"
          >验证</v-btn
        >
      </v-card-actions>
    </v-card>
    <v-snackbar
      :color="message == '验证成功' ? 'success' : 'error'"
      v-model="snackbar"
      :timeout="2000"
    >
      {{ message }}

      <template v-slot:actions>
        <v-btn variant="text" @click="snackbar = false"> </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>
<style scoped lang="scss">
.account {
  box-sizing: border-box;
  padding: 10px;
}
</style>
