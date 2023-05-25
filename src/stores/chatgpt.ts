import { originalAPI } from '@/api/openai/original';
import { ImageItem, MessageHistory, MessageItem } from '@/types/gpt.type';
import { defineStore } from 'pinia';

const defaultModel = 'gpt-3.5-turbo'

export const useChatGPTStore = defineStore('chatGPTModel', () => {
    const apiKey = ref("")
    const model = ref(defaultModel)
    const connection = ref(false)
    const currentMessageList = ref([] as Array<MessageItem>)
    const historyMessageList = ref([] as Array<MessageHistory>)

    const setModel = (state: string) => {
        model.value = state
    }

    const setApiKey = (state: string) => {
        apiKey.value = state
    }

    const setConnection = (state: boolean) => {
        connection.value = state
    }

    const setCurrentMessageList = (state: Array<MessageItem>) => {
        currentMessageList.value = state
    }

    const setHistoryMessageList = (state: MessageHistory) => {
        historyMessageList.value.push(state)
    }

    const updateHistoryMessageItem = (state: MessageHistory) => {
        historyMessageList.value = historyMessageList.value.map((item) => {
            if (item.key === state.key) {
                item.title = state.title
            }
            return item
        })
    }

    const deleteHistoryMessageItem = (key: string) => {
        historyMessageList.value = historyMessageList.value.filter(item => {
            return item.key != key
        })
    }

    const clearHistoryMessageList = () => {
        historyMessageList.value = []
    }

    const connectionCheck = () => {
        const conn = {
            state: false,
            stateText: "连接异常"
        }

        if (apiKey.value.trim() === "") {
            conn.stateText = "API Key 未设置"
            return conn
        }

        if (connection.value) {
            conn.state = true
            conn.stateText = "连接成功"
            return conn
        }

        return conn
    }

    return {
        model,
        apiKey,
        connection,
        currentMessageList,
        historyMessageList,
        setModel,
        setApiKey,
        setConnection,
        setCurrentMessageList,
        setHistoryMessageList,
        updateHistoryMessageItem,
        clearHistoryMessageList,
        deleteHistoryMessageItem,
        connectionCheck
    }
});

