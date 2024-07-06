import Paragraph from '@/components/blocks/Article/Paragraph.vue';
import Character from '@/components/blocks/Article/Character.vue';

export function blocks() {
    const getBlock = (name) => {
        switch (name) {
            case 'Paragraph': return Paragraph;
            case 'Character': return Character;
        }
    };

    const blockList = [
        {
          name: 'Paragraph',
          componentName: 'Paragraph',
        },
        {
            name: 'Character',
            componentName: 'Character',
        },
    ];

    return {
        getBlock,
        blockList,
    };
}
