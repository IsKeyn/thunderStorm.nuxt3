<script setup>
import UserSettings from '@/modules/boardGame/components/user/settings/UserSettings.vue';

import { useUserStore } from '@/stores/user';
const userStore = useUserStore();
</script>

<template>
	<div class="admin-header">
		<span>
			Добро пожаловать в админ панель {{ userStore.user.name }}!
		</span>
		<div class="flex justify-end w-full">
			<!--	Вывести текущее время в правой части панели	-->
<!--			<UserSettings />-->
		</div>
	</div>
</template>

<style lang="scss" scoped>
.admin-header {
	@apply
		flex
		bg-[var(--second-bg-color)]
		pt-[10px] pr-[25px] pb-[10px] pl-[25px]
		mr-[var(--main-without-right-padding)] mb-[1px] ml-[var(--main-without-left-padding)]
	;
}
</style>
