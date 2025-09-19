<script setup>
import { inject } from 'vue';
const layoutMethods = inject('layoutMethods');

import { media } from '@/composables/media.js'
const {
	getResizeImg,
} = media();

const props = defineProps({
	user: {
		type: Object,
		default: {},
	},
	useLightBox: {
		type: Boolean,
		default: false,
	},
});
</script>

<template>
	<div
			v-if="user"
			class="avatar-box"
	>
		<img
				v-if="user.avatar"
				:src="getResizeImg(user.avatar)"
				:alt="user.name"
				:title="user.name"
				@click.prevent="useLightBox ? layoutMethods.setOpenedImage(user.avatar) : false"
		>
		<img v-else src="/images/system/no-avatar.png">
	</div>
</template>

<style lang="scss" scoped>
.avatar-box {
	@apply flex items-center;

	img {
		@apply
			w-[100px] h-[100px]
			object-cover rounded-full cursor-pointer
		;
	}
}
</style>
