<script setup>
import Modal from '@/components/modals/Modal.vue';
import ChangeAvatar from '@/components/user/avatar/ChangeAvatar.vue';

import { useUserStore } from '@/stores/user';
const userStore = useUserStore();

import { media } from '@/composables/media.js'
const {
	getResizeImg,
} = media();

const emit = defineEmits(['updateBoardGameInfo']);

import { ref } from "vue";

const boxOpen = ref(false);
const openCloseBoxFunc = () => {
	boxOpen.value = !boxOpen.value;
};
</script>

<template>
	<div
			v-if="userStore.user && Object.keys(userStore.user).length > 0"
			class="wrapper"
	>
		<span class="user-interface-title">{{ userStore.user.name }}</span>
		<div class="avatar">
			<img
					:src="userStore.user.avatar ? getResizeImg(userStore.user.avatar) : '/images/system/no-avatar.png'"
					:alt="userStore.user.name"
					:title="userStore.user.name"
			/>
			<font-awesome-icon :icon="['fas', 'camera']" class="change-avatar" @click="openCloseBoxFunc()" />
		</div>
	</div>
	<Modal
			:showOpenModal="boxOpen"
			size="medium"
			@toggleModal="openCloseBoxFunc"
	>
		<div class="modal-parent">
			<h3 class="modal-title">Изменение аватара</h3>
			<div class="link-parent-box">
				<ChangeAvatar @afterChangeAvatar="emit('updateBoardGameInfo')" />
			</div>
		</div>
	</Modal>
</template>

<style lang="scss" scoped>
.wrapper {
	@apply text-center pl-[1rem] pr-[1rem];

	.avatar {
		@apply
			inline-block
			w-[10rem] h-[10rem]
			rounded-full object-cover
			relative
		;

		img {
			@apply w-[10rem] h-[10rem] rounded-full object-cover;
		}

		.change-avatar {
			@apply absolute text-[4rem] top-[3rem] left-[3rem] hidden cursor-pointer;
		}

		&:hover .change-avatar {
			@apply block;
		}
	}
}
</style>
