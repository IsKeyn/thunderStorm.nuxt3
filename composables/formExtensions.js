import ReleaseDatesExt from '@/components/forms/formExtensions/ReleaseDatesExt.vue';

export function formExtensions() {
    const getFormExt = (name) => {
        switch (name) {
            case 'ReleaseDates': return ReleaseDatesExt;
        }
    };

    return {
        getFormExt,
    };
}
