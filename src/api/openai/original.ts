import { useChatGPTStore } from "@/stores/chatgpt";
import { CommonRequest } from "../request"

const api = {
    chat: '/v1/chat/completions',
    modelList: '/v1/models',
    image: '/v1/images/generations'
}

const { model, apiKey } = storeToRefs(useChatGPTStore());

class OriginalOpenaiAPI {
    private request;

    constructor() {
        this.request = new CommonRequest({
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${apiKey.value}`,
            },
            baseURL: '/original'
        })
    }

    async modelList() {
        return await this.request.get(api.modelList)
    }

    async chat(params: object) {
        return await this.request.post(api.chat, {
            model: model.value,
            ...params
        })
    }

    async imageGenerate(params: object) {
        return await this.request.post(api.image, params)
    }

}

let originalAPI = new OriginalOpenaiAPI()

watch(apiKey, async () => {
    originalAPI = new OriginalOpenaiAPI()
}, { immediate: true })

export { originalAPI }