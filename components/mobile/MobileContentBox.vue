<script setup>
import Modal from '@/components/modals/Modal.vue';

const boxOpen = ref(false);

const props = defineProps({
	icon: {
		type: Array,
		default: ['fas', 'angle-left'],
	},
	buttonTitle: {
		type: String,
		default: 'Открыть',
	}
});

const openCloseBoxFunc = () => {
	boxOpen.value = !boxOpen.value;
};

defineExpose({
	openCloseBoxFunc,
});
</script>

<template>
	<button
			class="open-mobile-content-box-button"
			:buttonTitle="iconTitle"
			@click="openCloseBoxFunc()"
	>
		<font-awesome-icon :icon="icon" />
	</button>

	<Modal
			:showOpenModal="boxOpen"
			size="full-screen"
			:fullCloseModal="true"
			@toggleModal="openCloseBoxFunc"
	>
		<slot />
	</Modal>
</template>

<style lang="scss" scoped>
.open-mobile-content-box-button {
	@apply
		fixed right-0 z-10
		w-[3rem] h-[3rem]
		bg-[var(--main-bg-color)]
		text-[var(--main-text-color)] text-[1.5rem]
		min-[1400px]:hidden
		shadow
	;

	top: calc(20% - 1.5rem);
}
</style>
