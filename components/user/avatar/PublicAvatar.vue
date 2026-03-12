<script setup>
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
	classes: {
		type: String,
		default: 'w-[100px] h-[100px]',
	}
});
</script>

<template>
	<div
			v-if="user"
			class="avatar-box"
	>
		<tempalate v-if="user.avatar">
			<img
					v-if="useLightBox"
					:class="classes"
					:src="getResizeImg(user.avatar)"
					:alt="user.name"
					:title="user.name"
					:media-id="user.avatar.id"
					:not-for-lb-nav="true"
					class="media-obj"
			>
			<img
					v-else
					:class="classes"
					:src="getResizeImg(user.avatar)"
					:alt="user.name"
					:title="user.name"
			>
		</tempalate>
		<img v-else src="/images/system/no-avatar.png" :class="classes">
	</div>
</template>

<style lang="scss" scoped>
.avatar-box {
	@apply flex items-center;

	img {
		@apply object-cover rounded-full cursor-pointer
		;
	}
}
</style>
