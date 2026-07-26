<script setup>
import Modal from '@/components/modals/Modal.vue';
import UserMessagesList from '@/components/user/message/UserMessagesList.vue';

import { ref } from "vue";

const modalOpen = ref(false);
const userForMessage = ref(null);

const showModal = (user) => {
	if (user) {
		userForMessage.value = user;
	}

	modalOpen.value = !modalOpen.value;
}

defineExpose({
	showModal,
});
</script>

<template>
	<Modal
			:showOpenModal="modalOpen"
			:fullCloseModal="true"
			size="full-width"
			@toggleModal="showModal"
	>
		<div class="modal-parent">
			<h3 class="modal-title">Личные сообщения</h3>
			<div class="link-parent-box">
				<UserMessagesList :userForMessage="userForMessage" />
			</div>
		</div>
	</Modal>
</template>

<style lang="scss" />
