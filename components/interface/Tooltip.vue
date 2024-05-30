<script setup>
import {onMounted, onUnmounted, watch} from 'vue'

const tooltip = ref(null);
const status = ref(false);
const wasCalced = ref(false);

const props = defineProps({
	position: { // left, center, right
		type: String,
		default: 'center',
	},
});

const init = () => {
	if (!wasCalced.value) {
		calcTooltipPosition();
	} else {
		toggle();
	}
}

const toggle = (newStatus) => {
	if (newStatus === undefined || newStatus === null) {
		status.value = !status.value;
	} else {
		status.value = newStatus;
	}
}

watch(status, (value) => {
	if (value) {
		tooltip.value.style.opacity = 1;
	} else {
		tooltip.value.style.opacity = 0;
	}
});

const calcTooltipPosition = () => {
	if (tooltip.value.offsetHeight > tooltip.value.parentElement.offsetHeight) {
		tooltip.value.style.top = -(tooltip.value.parentElement.offsetHeight + tooltip.value.offsetHeight - tooltip.value.parentElement.offsetHeight) + 'px';
	} else {
		tooltip.value.style.top = -(tooltip.value.parentElement.offsetHeight) + 'px';
	}

	switch (props.position) {
		case 'right':
			tooltip.value.style.left = '0px';
			break;
		case 'center':
			break;
		case 'left':
			tooltip.value.style.right = '0px';
			break;
	}

	toggle();
}

onMounted(() => {
	tooltip.value.parentElement.addEventListener("mouseenter", () => { init(); });
	tooltip.value.parentElement.addEventListener("mouseleave", () => { toggle(false); });
})

// TODO в onUnmounted	tooltip.value is undefine, выяснить причину и удалять слушателя
// onUnmounted(() => {
// 	tooltip.value.parentElement.removeEventListener("mouseenter", () => { init(); });
// 	tooltip.value.parentElement.removeEventListener("mouseleave", () => { toggle(false); });
// });
</script>

<template>
	<div
			class="tooltip"
			ref="tooltip"
	>
		<slot />
	</div>
</template>

<style lang="scss" scoped>
.tooltip {
	@apply absolute opacity-0 z-[5];
}
</style>
