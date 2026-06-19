<script setup>
import ProfileLine from '@/modules/boardGame/components/user/player/fragments/ProfileLine.vue';

import { helper } from '@/composables/helper.js'
const { route } = helper();

const props = defineProps({
	element: {
		type: Object,
		default: {},
	},
	theme: {
		type: String,
		default: 'default',
	},
	openProfile: {
		type: Boolean,
		default: true,
	},
	hideItems: {
		type: Boolean,
		default: false,
	},
	hideStatusEffect: {
		type: Boolean,
		default: false,
	},
	bgClasses: {
		type: String,
		default: '',
	},
});
</script>

<template>
	<Nuxt-link
			:class="[bgClasses, theme]"
			:to="openProfile ? `/e/${route.params.slug}/player/${element.user.name}` : null"
	>
		<ProfileLine
				:element="element"
				type="list"
				:hideItems="hideItems"
				:hideStatusEffect="hideStatusEffect"
		/>
	</Nuxt-link>
</template>

<style lang="scss" scoped>
a {
	&:hover {
		@apply no-underline;
	}
}
</style>
