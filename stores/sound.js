import { defineStore } from 'pinia'

export const useSoundStore = defineStore('sound', {
    state: () => {
        return {
            playSound: false,
            soundUrl: '',
            soundObj: null,
        }
    },
})
