<script setup>
import FormGenerator from '@/components/forms/FormGenerator/FormGenerator.vue';

const props = defineProps({
	setting: {
		type: Object,
		default: null,
	}
});

</script>

<template>
	<div v-if="
					setting.type === 'checkbox'
					|| setting.type === 'text'
					|| setting.type === 'number'
				">
		<FormGenerator
				:name="setting.name"
				:element="setting"
				:showTitle="true"
				validateErrorPosition="bottom"
				fieldClasses="w-full"
		/>
	</div>
	<div v-if="setting.type === 'select'">
		<FormGenerator
				:name="setting.name"
				:element="setting"
				:showTitle="true"
				validateErrorPosition="bottom"
				fieldClasses="w-full"
		/>
	</div>
</template>
