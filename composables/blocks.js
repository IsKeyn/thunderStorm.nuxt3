import Title from '@/components/blockEditor/blocks/Title/Title.vue';
import Paragraph from '@/components/blockEditor/blocks/Paragraph/Paragraph.vue';
import Character from '@/components/blockEditor/blocks/Character/Character.vue';
import Gallery from '@/components/blockEditor/blocks/Gallery/Gallery.vue';
import Delimeter from '@/components/blockEditor/blocks/Delimeter/Delimeter.vue';
import RepeaterListWithImage from '@/components/blockEditor/blocks/RepeaterListWithImage/RepeaterListWithImage.vue';
import RepeaterLists from '@/components/blockEditor/blocks/RepeaterLists/RepeaterLists.vue';
import VideoList from '@/components/blockEditor/blocks/VideoList/VideoList.vue';
import RecommendedMaterials from '@/components/blockEditor/blocks/RecommendedMaterials/RecommendedMaterials.vue';

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
            case 'VideoList': return VideoList;
            case 'RecommendedMaterials': return RecommendedMaterials;
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
        {
            name: 'VideoList',
            componentName: 'VideoList',
        },
        {
            name: 'RecommendedMaterials',
            componentName: 'RecommendedMaterials',
        },
    ];

    const pageBlocks = useBlocksStore();
    const blockStructure = ref({});

    const setBlockStructure = () => {
        if (editMode) {
            /* Проверяем, что блок с данным индексом присутствует в store */
            if (Object.keys(pageBlocks.getBlockByIndex(blockIndex)).length > 0) {
                /* Проверка на новый или существующий блок (если структура пуста, значит блок только добавлен и требуется заполнение структуры) */
                if (Object.keys(pageBlocks.getBlockByIndex(blockIndex).structure).length > 0) {
                    blockStructure.value = pageBlocks.getBlockByIndex(blockIndex).structure;

                    /* Добавляем новые поля и настройки, которые появились со времени последнего редактирования блока */
                    addNewFieldsToStructure();
                } else {
                    /* Если блок только создан заполняем его структурой */
                    blockStructure.value = defaultStructure;

                    /* Записываем структуру в store */
                    pageBlocks.getBlockByIndex(blockIndex).structure = toRaw(blockStructure.value);
                }
            }
        } else {
            /*
                Вне режима редактирования работает иная логика, вся структура приходит в блок из свойства,
                который передается в функцию в виде переменной structure
            */
            if (Object.keys(structure).length > 0) {
                blockStructure.value = toRaw(structure);

                /* Добавляем новые поля и настройки, которые появились со времени последнего редактирования блока */
                addNewFieldsToStructure();
            } else {
                blockStructure.value = defaultStructure;
            }
        }
    }

    const addNewFieldsToStructure = () => {
        /* Перебираем поля и добавляем новые, появившиеся в структуре */
        for (let fieldName in defaultStructure.fields) {
            if (typeof blockStructure.value.fields[fieldName] === "undefined") {
                blockStructure.value.fields[fieldName] = defaultStructure.fields[fieldName];
            }
        }

        /* Перебираем настройки и добавляем новые, появившиеся в структуре */
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

        /* Добавляем группы настроек, они не хранятся на беке и добавляются в структуру каждый раз при инициализации блока в editMode */
        if (defaultStructure.settingGroups && editMode) {
            blockStructure.value.settingGroups = defaultStructure.settingGroups;
        }
    };

    return {
        getBlock,
        blockList,
        blockStructure,
        setBlockStructure,
    };
}
