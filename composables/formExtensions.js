import ReleaseDatesExt from '@/components/forms/formExtensions/ReleaseDatesExt.vue';
import MultiImages from '@/components/forms/formExtensions/MultiImages.vue';
import Genres from '@/components/forms/formExtensions/Genres.vue';
import Companies from '@/components/forms/formExtensions/Companies.vue';
import Links from '@/components/forms/formExtensions/Links.vue';
import Groups from '@/components/forms/formExtensions/Groups.vue';
import AnonsDates from '@/components/forms/formExtensions/AnonsDates.vue';
import Autologin from '@/components/forms/formExtensions/Autologin.vue';
import Logout from '@/components/forms/formExtensions/Logout.vue';
import Series from '@/components/forms/formExtensions/Series.vue';
import Games from '@/components/forms/formExtensions/Games.vue';
import People from '@/components/forms/formExtensions/People.vue';
import Roles from '@/components/forms/formExtensions/Roles.vue';
import Permissions from '@/components/forms/formExtensions/Permissions.vue';
import BoardGameSettings from '@/components/forms/formExtensions/BoardGame/BoardGameSettings.vue';

export function formExtensions() {
    const getFormExt = (name) => {
        switch (name) {
            case 'ReleaseDates': return ReleaseDatesExt;
            case 'MultiImages': return MultiImages;
            case 'Genres': return Genres;
            case 'Companies': return Companies;
            case 'Links': return Links;
            case 'Groups': return Groups;
            case 'AnonsDates': return AnonsDates;
            case 'Autologin': return Autologin;
            case 'Logout': return Logout;
            case 'Series': return Series;
            case 'Games': return Games;
            case 'People': return People;
            case 'Roles': return Roles;
            case 'Permissions': return Permissions;
            case 'BoardGameSettings': return BoardGameSettings;
        }
    };

    return {
        getFormExt,
    };
}
