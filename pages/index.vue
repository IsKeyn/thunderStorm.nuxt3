<script setup>
import AuthForm from '@/components/forms/AuthForm.vue';
import Modal from '@/components/modals/Modal.vue';

const activeSendBugModal = ref(false);

const toggleSendBugModal = () => {
	activeSendBugModal.value = !activeSendBugModal.value;
}
</script>

<template>
	<div>
		<button class="btn"  @click="toggleSendBugModal()"><font-awesome-icon :icon="['far', 'user']" /> Авторизоваться</button>

		<Modal
				:showOpenModal="activeSendBugModal"
				size="small"
				modal-id="send-bug--form"
				@toggleModal="toggleSendBugModal"
		>
			<h3 class="auth-title">Авторизация</h3>
			<AuthForm />
		</Modal>

	</div>
</template>

<style lang="scss" scoped>
h3.auth-title {
	@apply
		bg-gradient-to-r from-[var(--main-href-color)] to-[var(--second-href-color)]
		text-[18px]
		mt-[-8px] mr-[-35px] mb-[16px] ml-[-35px]
		pt-[10px] pb-[10px] pl-[34px]
	;

	width: calc(100% + 35px + 35px);
}
</style>
