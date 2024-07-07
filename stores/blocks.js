import { defineStore } from 'pinia'

export const useBlocksStore = defineStore('blocks', {
    state: () => {
        return {
            blocks: [],
        }
    },
    actions: {
        setBlocks(value) {
            this.blocks = value;
        },
        addBlock(value) {
            this.blocks.push(value);
        },
        changeBlock(data) {
            const { key, value } = data;

            if (this.blocks[key]) {
                this.blocks[key] = value;
            }
        },
        getBlockByIndex(index) {
            return this.blocks[index];
        },
        deleteBlockByIndex(index) {
            this.blocks = this.blocks.filter((item, inx) => {
                if (index !== inx) {
                    console.log(111, item, inx);
                    return item;
                }
            });
        },
    },
    getters: {
        getBlockByDynamicId(id) {

        },
    },
})
