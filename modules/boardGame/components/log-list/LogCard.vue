<script setup>
import PublicAvatar from '@/components/user/avatar/PublicAvatar.vue';

import { helper } from '@/composables/helper.js'
const { route } = helper();

import { date } from '@/composables/date.js';
const { getFormattedDate } = date();

const props = defineProps({
	element: {
		type: Object,
		default: {},
	},
	theme: {
		type: String,
		default: 'default',
	},
	useLightBox: {
		type: Boolean,
		default: false,
	},
});
</script>

<template>
	<div class="item-box">
		<PublicAvatar
				v-if="theme === 'default'"
				class="max-w-[100px] my-0 mx-auto mb-2 lg:mb-0"
				:user="element.user"
				:useLightBox="useLightBox"
				classes="w-[100%] aspect-square object-cover"
		/>
		<div class="info">
			<template v-if="theme === 'default'">
				<span v-if="element?.user?.name" class="name">
					<Nuxt-link
							:to="`/e/${route.params.slug}/player/${element.user.name}`"
					>{{ element.user.name }}</Nuxt-link> - {{ getFormattedDate('d ru_mouths_name Y в H:i', element.created_at) }}
				</span>
				<span class="description">{{ element.message }}</span>
			</template>
			<template v-if="theme === 'simple'">
				<span class="description">
					{{ getFormattedDate('d ru_mouths_name Y в H:i', element.created_at) }} : {{ element.message }}
				</span>
			</template>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.item-box {
	@apply p-2 mb-2 bg-[var(--second-bg-color)] block lg:flex rounded-none;

	.info {
		@apply pl-3 pr-3 text-[var(--main-text-color)] w-full;

		.name {
			@apply block mb-1;

			a {
				@apply text-[var(--main-dark-text-color)];
			}
		}

		.description {
			@apply block;
		}
	}
}
</style>

<style lang="scss" scoped>
.street-light-theme {
	.item-box {
		.info {
			@apply text-[var(--main-dark-text-color)];
		}
	}
}
</style>
