<script setup>
import { watch } from "vue";

const emit = defineEmits(['update:modelValue']);

const props = defineProps({
	modelValue: {
		type: Array,
		default: {},
	},
	structure: {
		type: Object,
		default: null,
	},
	editMode: {
		type: Boolean,
		default: false,
	},
});

const editableStructure = ref({
	fields: {
		text: 'Текст параграфа',
	},
	settings: {

	},
});

if (Object.keys(props.modelValue).length > 0) {
	editableStructure.value = toRaw(props.modelValue);
}

const hasFirstLoad = ref(false);

watch(() => props.modelValue, (newValue) => {
	if (!hasFirstLoad.value) {
		editableStructure.value = toRaw(newValue);
	}
}, { deep: true });

watch(() => editableStructure.value, (value) => {
	saveValues();
}, { deep: true });

const saveTimeout = ref(null);

const saveValues = () => {
	clearTimeout(saveTimeout.value);

	saveTimeout.value = setTimeout(() => {
		emit('update:modelValue', editableStructure.value);
	}, 500);
}
</script>

<template>
	<div>
		<p>
			<template v-if="editMode">
				<input v-model="editableStructure.fields.text">
			</template>
			<template v-else>
				{{ structure.fields.text }}
			</template>
		</p>
	</div>
</template>
