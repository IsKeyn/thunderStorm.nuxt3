<script setup>
import ProfileLine from '@/modules/boardGame/components/user/player/fragments/ProfileLine.vue';

const emit = defineEmits(['onClickFunc']);

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
	/* Действие при нажатии route, emit */
	clickDoType: {
		type: String,
		default: 'route',
	},
});
</script>

<template>
	<Nuxt-link
			v-if="clickDoType === 'route'"
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
	<div
			v-else-if="clickDoType === 'emit'"
			:class="[bgClasses, theme]"
			@click="$emit('onClickFunc', element)"
	>
		<ProfileLine
				:element="element"
				type="list"
				:hideItems="hideItems"
				:hideStatusEffect="hideStatusEffect"
		/>
	</div>
</template>

<style lang="scss" scoped>
a {
	&:hover {
		@apply no-underline;
	}
}
</style>
