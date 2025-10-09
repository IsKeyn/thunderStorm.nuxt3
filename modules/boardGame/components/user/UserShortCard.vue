<script setup>
import PublicAvatar from '@/components/user/avatar/PublicAvatar.vue';

import { useBoardGameStore } from '@/stores/boardGame';
const boardGameStore = useBoardGameStore();

const route = useRoute();
const router = useRouter();

const props = defineProps({
	user: {
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
	}
});
</script>

<template>
	<Nuxt-link
			class="user-box"
			:to="openProfile ? `/e/${route.params.slug}/player/${user.name}` : null"
			target="_blank"
	>
		<PublicAvatar
				:user="user"
				:useLightBox="useLightBox"
				classes="w-[50px] h-[50px]"
		/>
		<div class="info">
			<span class="field name">
				{{ user.name }}
			</span>
		</div>
	</Nuxt-link>
</template>

<style lang="scss" scoped>
.user-box {
	@apply
		flex justify-center items-center cursor-pointer rounded-none
		p-2
		bg-[var(--second-bg-color)]
	;

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

