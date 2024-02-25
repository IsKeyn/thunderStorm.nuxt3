<script setup>
import AuthComponent from '@/components/user/AuthComponent.vue';
import Modal from '@/components/modals/Modal.vue';

const activeAuthModal = ref(false);
const reCalc = ref(false);

const toggleAuthModal = () => {
	activeAuthModal.value = !activeAuthModal.value;
}

const reCalcHeight = (value = true) => {
	reCalc.value = value;
}

const { apiUrl, backendUrl, errorHandler } = api();
</script>

<template>
	<div>
		<button class="btn" @click="toggleAuthModal()"><font-awesome-icon :icon="['far', 'user']" /> Авторизоваться</button>

		<Modal
				:showOpenModal="activeAuthModal"
				size="small"
				modal-id="send-bug--form"
				:re-calc-height="reCalc"
				@setReCalcValue="reCalcHeight"
				@toggleModal="toggleAuthModal"
		>
			<AuthComponent
					@reCalcHeight="reCalcHeight"
					@closeModal="toggleAuthModal"
			/>
		</Modal>
	</div>
</template>
