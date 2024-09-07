import Title from '@/components/blocks/Article/Title.vue';
import Paragraph from '@/components/blocks/Article/Paragraph.vue';
import Character from '@/components/blocks/Article/Character.vue';
import Gallery from '@/components/blocks/Article/Gallery.vue';
import Delimeter from '@/components/blocks/Article/Delimeter.vue';
import RepeaterListWithImage from '@/components/blocks/Article/RepeaterListWithImage.vue';
import RepeaterLists from '@/components/blocks/Article/RepeaterLists/RepeaterLists.vue';

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
            case 'Gallery': return Gallery;
            case 'Delimeter': return Delimeter;
            case 'RepeaterListWithImage': return RepeaterListWithImage;
            case 'RepeaterLists': return RepeaterLists;
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
        {
            name: 'Gallery',
            componentName: 'Gallery',
        },
        {
            name: 'Delimeter',
            componentName: 'Delimeter',
        },
        {
            name: 'RepeaterListWithImage',
            componentName: 'RepeaterListWithImage',
        },
        {
            name: 'RepeaterLists',
            componentName: 'RepeaterLists',
        },
    ];

    const pageBlocks = useBlocksStore();
    const blockStructure = ref({});

    const addNewFieldsToStructure = () => {
        for (let fieldName in defaultStructure.fields) {
            if (typeof blockStructure.value.fields[fieldName] === "undefined") {
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

        if (defaultStructure.settingGroups)
            blockStructure.value.settingGroups = defaultStructure.settingGroups;
    };

    const setBlockStructure = () => {
        if (editMode) {
            if (Object.keys(pageBlocks.getBlockByIndex(blockIndex)).length > 0) {
                /* Проверка на новый или существующий блок */
                if (Object.keys(pageBlocks.getBlockByIndex(blockIndex).structure).length > 0) {
                    blockStructure.value = pageBlocks.getBlockByIndex(blockIndex).structure;
                    addNewFieldsToStructure();
                } else {
                    /* Если блок только создан заполняем его структурой */
                    blockStructure.value = defaultStructure;
                    pageBlocks.getBlockByIndex(blockIndex).structure = toRaw(blockStructure.value);
                }
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
