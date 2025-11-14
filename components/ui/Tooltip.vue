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

const openTooltip = () => {
	init();
}

watch(status, (value) => {
	if (value) {
		tooltip.value.style.opacity = 1;
	} else {
		tooltip.value.style.opacity = 0;
	}
});

const calcTooltipPosition = (useToggle = true) => {
	const parent = tooltip.value.parentElement;
	const parentHeight = parent.offsetHeight;
	const tooltipHeight = tooltip.value.offsetHeight;

	// Расчет вертикальной позиции
	if (tooltipHeight > parentHeight) {
		tooltip.value.style.top = -(parentHeight + tooltipHeight - parentHeight) + 'px';
	} else {
		tooltip.value.style.top = -parentHeight + 'px';
	}

	// Расчет горизонтальной позиции
	switch (props.position) {
		case 'right':
			tooltip.value.style.left = '0px';
			break;
		case 'center':
			const parentWidth = parent.offsetWidth;
			const tooltipWidth = tooltip.value.offsetWidth;
			const centerPosition = Math.max(0, (parentWidth - tooltipWidth) / 2);
			tooltip.value.style.left = centerPosition + 'px';
			break;
		case 'left':
			tooltip.value.style.right = '0px';
			break;
	}

	if (useToggle) {
		toggle();
	}
}

onMounted(() => {
	calcTooltipPosition(false);
	tooltip.value.parentElement.addEventListener("mouseenter", () => { init(); });
	tooltip.value.parentElement.addEventListener("mouseleave", () => { toggle(false); });
})

onUnmounted(() => {
	if (tooltip && tooltip.value) {
		tooltip.value.parentElement.removeEventListener("mouseenter", () => { init(); });
		tooltip.value.parentElement.removeEventListener("mouseleave", () => { toggle(false); });
	}
});

defineExpose({
	openTooltip,
});
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
	@apply block absolute opacity-0 z-[5];
}
</style>
