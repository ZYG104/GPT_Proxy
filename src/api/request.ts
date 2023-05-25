import axios, { AxiosInstance, CreateAxiosDefaults } from "axios"
import { useSystemStore } from '@/stores/system';

const base_url = '/api'

class CommonRequest {
    private instance: AxiosInstance;

    constructor(config?: CreateAxiosDefaults<any>) {
        this.instance = axios.create(config || {
            headers: {
                "Content-Type": 'application/json; charset=utf-8'
            },
            baseURL: base_url
        })

        this.instance.interceptors.request.use((config) => {
            useSystemStore().setLoading(true)
            return config
        })

        this.instance.interceptors.response.use(res => {
            useSystemStore().setLoading(false)
            return res.data
        },
            error => {
                useSystemStore().setLoading(false)
                return Promise.reject(error.response.data.error)
            }
        )

    }

    async get(url: string, params?: unknown) {
        return await this.instance.get(url, { params: params })
    }

    async post(url: string, params?: object) {
        return await this.instance.post(url, params)

    }
}

const defaultRequest = new CommonRequest()

export { CommonRequest, defaultRequest }