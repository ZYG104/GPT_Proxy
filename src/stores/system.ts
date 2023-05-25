import { defineStore } from 'pinia';

interface SystemState {
    loading: boolean;
}

export const useSystemStore = defineStore('system', () => {
    const loading = ref(false)
    const pageIndex = ref(0)

    const setLoading = (state: boolean) => {
        loading.value = state
    }

    const setPageIndex = (index: number) => {
        pageIndex.value = index
    }

    return {
        loading,
        setLoading,
        pageIndex,
        setPageIndex
    }
}); 
