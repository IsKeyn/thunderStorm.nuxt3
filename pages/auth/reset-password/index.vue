<script setup>
import AuthComponent from '@/components/user/AuthComponent.vue';
import Modal from '@/components/modals/Modal.vue';

const activeAuthModal = ref(true);
const reCalc = ref(false);

const toggleAuthModal = () => {
	activeAuthModal.value = !activeAuthModal.value;
}

const reCalcHeight = (value = true) => {
	reCalc.value = value;
}
</script>

<template>
	<Modal
			:showOpenModal="activeAuthModal"
			:canClose="false"
			size="small"
			modal-id="send-bug--form"
			:re-calc-height="reCalc"
			@setReCalcValue="reCalcHeight"
			@toggleModal="toggleAuthModal"
	>
		<AuthComponent
				title="Восстановление пароля"
				actionType="reset_password"
				@reCalcHeight="reCalcHeight"
				@closeModal="toggleAuthModal"
		/>
	</Modal>
</template>
