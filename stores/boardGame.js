import { defineStore } from 'pinia'

export const useBoardGameStore = defineStore('board_game', {
    state: () => {
        return {
            playersOnline: {},
        }
    },
})
