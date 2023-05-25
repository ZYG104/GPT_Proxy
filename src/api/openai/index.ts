import { useChatGPTStore } from "@/stores/chatgpt";
import { defaultRequest } from "../request"

const api = {
    chat: 'openai/chat',
    modelList: 'openai/modelList'
}

const { model } = storeToRefs(useChatGPTStore());

class OpenaiAPI {
    static async modelList() {
        return await defaultRequest.get(api.modelList)
    }

    static async chat(params: object) {
        return await defaultRequest.post(api.chat, {
            model: model.value,
            ...params
        })
    }

}

export { OpenaiAPI }