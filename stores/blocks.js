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
                    return item;
                }
            });
        },
        changePositionByIndexId(direction, index) {
            const currentBlock = {...this.blocks[index]};
            let changedBlock = {};

            if (direction === 'top' && index > 0) {
                changedBlock = {...this.blocks[index - 1]};
                this.blocks[index - 1] = currentBlock;
                this.blocks[index] = changedBlock;
            }

            if (direction === 'bottom' && this.blocks.length - 1 > index) {
                changedBlock = {...this.blocks[index + 1]};
                this.blocks[index + 1] = currentBlock;
                this.blocks[index] = changedBlock;
            }
        },
    },
    getters: {
        getBlockByDynamicId(id) {

        },
    },
})
