<script setup>
import { useUserStore } from '@/stores/user';
const userStore = useUserStore();
</script>

<template>
	<div class="admin-header">
		Добро пожаловать в админ панель {{ userStore.user.name }}!
		<!--	Вывести текущее время в правой части панели	-->
	</div>
</template>

<style lang="scss" scoped>
.admin-header {
	@apply
		bg-[var(--second-bg-color)]
		pt-[10px] pr-[25px] pb-[10px] pl-[25px]
		mr-[var(--main-without-right-padding)] mb-[1px] ml-[var(--main-without-left-padding)]
	;
}
</style>
