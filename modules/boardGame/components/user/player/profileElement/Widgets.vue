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
	<div class="grid grid-cols-12 gap-4">
		<div class="col-span-4">
			<Timer
					:userId="element.user_id"
			/>
		</div>
		<div class="col-span-4">
			<PlayerInfoWidget />
		</div>
	</div>
</template>

<style lang="scss" scoped>

</style>
