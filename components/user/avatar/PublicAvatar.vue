<script setup>
import { computed } from 'vue';
import { media } from '@/composables/media.js';

const { getResizeImg } = media();

const props = defineProps({
	user: {
		type: Object,
		default: () => ({}),
	},
	useLightBox: {
		type: Boolean,
		default: false,
	},
	classes: {
		type: String,
		default: 'w-[100px] h-[100px]',
	},
	/* Доступные значения:
		'purple', 'gold', 'silver', 'bronze', 'ruby', 'azure', 'emerald', 'amethyst-yellow', 'sapphire', 'obsidian', 'rose-gold'
	*/
	borderType: {
		type: String,
		default: '',
	},
});

const wrapperClasses = computed(() => {
	const cls = ['avatar-box'];
	if (props.borderType) {
		cls.push(`border-${props.borderType}`);
	}
	return cls;
});
</script>

<template>
	<div v-if="user" :class="wrapperClasses">
		<template v-if="user.avatar">
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
		</template>
		<img v-else src="/images/system/no-avatar.png" :class="classes">
	</div>
</template>

<style lang="scss" scoped>
@import url('~/assets/scss/Fragments/avatarStyles.scss');
</style>
