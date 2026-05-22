<script setup>
import Modal from '@/components/modals/Modal.vue';
import UserNotificationList from '@/components/user/notifications/UserNotificationList.vue';

import { ref } from "vue";

const modalOpen = ref(false);
const modalLoading = ref(false);

const showModal = () => {
	toggleModal();
	modalLoading.value = true;
}

const toggleModal = () => {
	modalOpen.value = !modalOpen.value;
	modalLoading.value = true;
}

const loadingToggle = (value = false) => {
	modalLoading.value = value;
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
			<h3 class="modal-title">Уведомления</h3>
			<div class="link-parent-box">
				<ui-BigPreloader
						v-if="modalLoading"
						class="h-full"
						theme="image"
						:themeType="9"
				/>
				<UserNotificationList
						v-show="!modalLoading"
						@loadingToggle="loadingToggle"
						@toggleModal="toggleModal"
				/>
			</div>
		</div>
	</Modal>
</template>
