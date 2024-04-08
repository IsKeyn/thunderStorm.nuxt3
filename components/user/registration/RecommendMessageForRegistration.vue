<script setup>
import AuthComponent from '@/components/user/AuthComponent.vue';
import Modal from '@/components/modals/Modal.vue';

const activeAuthModal = ref(false);
const reCalc = ref(false);

const props = defineProps({
	modalName: {
		type: String,
		default: 'registration-from-recommend-message',
	},
});

const toggleAuthModal = () => {
	activeAuthModal.value = !activeAuthModal.value;
}

const reCalcHeight = (value = true) => {
	reCalc.value = value;
}
</script>

<template>
	<div class="w-full mb-2">
		<a class="cursor-pointer" @click="toggleAuthModal">Зарегистрируйтесь</a>, чтобы получать уведомления об ответах
	</div>
	<Modal
			:showOpenModal="activeAuthModal"
			size="small"
			:modalId="modalName"
			:re-calc-height="reCalc"
			@setReCalcValue="reCalcHeight"
			@toggleModal="toggleAuthModal"
	>
		<AuthComponent
				title="Регистрация"
				actionType="registration"
				@reCalcHeight="reCalcHeight"
				@closeModal="toggleAuthModal"
		/>
	</Modal>
</template>
