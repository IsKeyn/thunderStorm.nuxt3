<script setup>
import PublicAvatar from '@/components/user/avatar/PublicAvatar.vue';

import { useBoardGameStore } from '@/stores/boardGame';
const boardGameStore = useBoardGameStore();

import { helper } from '@/composables/helper.js'
const { route, router } = helper();

import { userFunctions } from '@/composables/userFunctions.js'
const { getPublicName } = userFunctions();

import { bgPlayer } from '@/composables/BoardGame/bgPlayer.js'
const { avatarBorder } = bgPlayer();

const props = defineProps({
	user: {
		type: Object,
		default: {},
	},
	player: {
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
	openProfile: {
		type: Boolean,
		default: true,
	},
});
</script>

<template>
	<div v-if="openProfile">
		<PublicAvatar
				:user="user"
				:useLightBox="useLightBox"
				classes="w-[50px] h-[50px]"
				:borderType="avatarBorder(player)"
		/>
		<div class="info">
			<span class="field name">
				{{ getPublicName(user) }}
			</span>
		</div>
	</div>
	<Nuxt-link
			v-else
			:class="['user-box', theme]"
			:to="`/e/${route.params.slug}/player/${user.name}`"
			target="_blank"
	>
		<PublicAvatar
				:user="user"
				:useLightBox="useLightBox"
				classes="w-[50px] h-[50px]"
				:borderType="avatarBorder(player)"
		/>
		<div class="info">
			<span class="field name">
				{{ getPublicName(user) }}
			</span>
		</div>
	</Nuxt-link>
</template>

<style lang="scss" scoped>
.user-box {
	&.default {
		@apply
			flex justify-center items-center cursor-pointer rounded-none
			p-2
			bg-[var(--second-bg-color)]
		;
	}

	&.vertical {
		@apply
			block cursor-pointer rounded-none
			p-2
			bg-none
			text-center
		;
	}

	&:hover {
		@apply no-underline bg-[var(--second-active-color)];
	}

	.info {
		@apply text-[var(--main-text-color)];

		.field {
			@apply block;
		}

		.name {
			@apply font-bold ml-2;
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

