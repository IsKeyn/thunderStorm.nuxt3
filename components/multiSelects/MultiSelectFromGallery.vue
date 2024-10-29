<script setup>
import MultiSelect from "@/components/multiSelects/core/MultiSelect.vue";
import GalleryType1Component from '@/components/media/GalleryType1Component.vue';

const emit = defineEmits(['update:modelValue']);

const props = defineProps({
	modelValue: {
		type: Array,
		default: [],
	},
});

const multiSelectComponent = ref(null);

const selectedData = ref([]);
selectedData.value = props.modelValue;

watch(() => selectedData.value, () => {
	emit('update:modelValue', selectedData.value);
}, { deep: true });
</script>

<template>
	<div>
		<MultiSelect
				ref="multiSelectComponent"
				:alreadySelected="alreadySelected"
				v-model="selectedData"
				#default="{selected}"
		>
			<GalleryType1Component
					:selectButton="true"
					:hideBodyScrollLine="false"
					:setViewsLog="false"
					galleryType="simple"
					:selected="selected"
					@selectThisElement="multiSelectComponent.addElement($event)"
					@unselectThisElement="multiSelectComponent.deleteElement($event)"
			/>
		</MultiSelect>
	</div>
</template>
