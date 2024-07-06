import ReleaseDatesExt from '@/components/forms/formExtensions/ReleaseDatesExt.vue';
import MultiImages from '@/components/forms/formExtensions/MultiImages.vue';
import Genres from '@/components/forms/formExtensions/Genres.vue';
import Companies from '@/components/forms/formExtensions/Companies.vue';
import Links from '@/components/forms/formExtensions/Links.vue';

export function formExtensions() {
    const getFormExt = (name) => {
        switch (name) {
            case 'ReleaseDates': return ReleaseDatesExt;
            case 'MultiImages': return MultiImages;
            case 'Genres': return Genres;
            case 'Companies': return Companies;
            case 'Links': return Links;
        }
    };

    return {
        getFormExt,
    };
}
