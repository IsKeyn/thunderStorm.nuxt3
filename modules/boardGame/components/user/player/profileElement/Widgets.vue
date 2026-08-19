<script setup>
import Timer from '@/modules/boardGame/components/timer/Timer.vue';
import PlayerInfoWidget from '@/modules/boardGame/components/widgets/PlayerInfoWidget.vue';

const props = defineProps({
	element: {
		type: Object,
		default: {},
	},
	userName: {
		type: String,
		default: null,
	},
});
</script>

<template>
	<div class="wrapper">
		<div class="element">
			<Timer
					:userId="element.user_id"
			/>
		</div>
		<div class="element">
			<PlayerInfoWidget />
		</div>
	</div>
</template>

<style lang="scss" scoped>
.wrapper {
	@apply grid grid-cols-12 gap-4;

	.element {
		@apply col-span-12 lg:col-span-6 	min-[1800px]:col-span-4;
	}
}
</style>
