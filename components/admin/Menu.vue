<script setup>
import MenuByTypes from '@/components/menu/MenuByTypes.vue';
</script>

<template>
	<MenuByTypes
			:arColumnsTypes="[ 'admin' ]"
			parentClass="admin-menu"
	/>
</template>
