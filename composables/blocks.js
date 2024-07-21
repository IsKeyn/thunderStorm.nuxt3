import Title from '@/components/blocks/Article/Title.vue';
import Paragraph from '@/components/blocks/Article/Paragraph.vue';
import Character from '@/components/blocks/Article/Character.vue';

import { useBlocksStore } from '@/stores/blocks';

export function blocks(
    defaultStructure = {},
    structure = {},
    blockIndex = null,
    editMode = false
) {
    const getBlock = (name) => {
        switch (name) {
            case 'Title': return Title;
            case 'Paragraph': return Paragraph;
            case 'Character': return Character;
        }
    };

    const blockList = [
        {
            name: 'Title',
            componentName: 'Title',
        },
        {
          name: 'Paragraph',
          componentName: 'Paragraph',
        },
        {
            name: 'Character',
            componentName: 'Character',
        },
    ];

    const pageBlocks = useBlocksStore();
    const blockStructure = ref({});

    const addNewFieldsToStructure = () => {
        for (let fieldName in defaultStructure.fields) {
            if (!blockStructure.value.fields[fieldName]) {
                blockStructure.value.fields[fieldName] = defaultStructure.fields[fieldName];
            }
        }

        for (let settingName in defaultStructure.settings) {
            if (!blockStructure.value.settings[settingName]) {
                blockStructure.value.settings[settingName] = defaultStructure.settings[settingName];
            }

            for (let settingField in defaultStructure.settings[settingName]) {
                if (settingField !== 'value') {
                    blockStructure.value.settings[settingName][settingField] = defaultStructure.settings[settingName][settingField];
                }
            }
        }
    };

    const setBlockStructure = () => {
        if (editMode) {
            if (Object.keys(pageBlocks.getBlockByIndex(blockIndex)).length > 0 && pageBlocks.getBlockByIndex(blockIndex).id) {
                if (typeof pageBlocks.getBlockByIndex(blockIndex).structure.length !== "number") {
                    blockStructure.value = pageBlocks.getBlockByIndex(blockIndex).structure;
                    addNewFieldsToStructure();
                } else {
                    blockStructure.value = defaultStructure;
                    pageBlocks.getBlockByIndex(blockIndex).structure = toRaw(blockStructure.value);
                }
            } else {
                blockStructure.value = defaultStructure;
                pageBlocks.getBlockByIndex(blockIndex).structure = blockStructure.value;
            }
        } else {
            if (Object.keys(structure).length > 0) {
                blockStructure.value = toRaw(structure);
                addNewFieldsToStructure();
            } else {
                blockStructure.value = defaultStructure;
            }
        }
    }

    return {
        getBlock,
        blockList,
        blockStructure,
        setBlockStructure,
    };
}
