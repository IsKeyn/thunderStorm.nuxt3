<script setup>
import { watch } from 'vue'

const props = defineProps({
	element: {
		type: Object,
		default: {},
	},
	name: {
		type: String,
		required: true,
	},
	showValidateError: {
		type: Boolean,
		default: false,
	},
	showTitle: {
		type: Boolean,
		default: true,
	},
	showChangeTypeButton: {
		type: Boolean,
		default: false,
	},
	labelClasses: {
		type: String,
		default: '',
	},
});

const label = ref(null);

watch(props.element, async (newValue) => {
	// TODO не удается наблидать за props.element.value и props.element.validateResult, наблюдаю за всем объектом, что не совсем корректно
	if (newValue) {
		if (newValue.value && props.name === 'phone') {
			props.element.value = newValue.value.replace(/[^+\(\)\d]/g, '');
		}

		if (newValue.validateResult && newValue.validateResult.length > 0) {
			label.value.scrollIntoView({ block: 'center', inline: 'center', behavior: 'smooth', });
		}
	}
})

const showPassword = () => {
	if (props.element.type === 'password') {
		props.element.type = 'text'
	} else if (props.element.type === 'text') {
		props.element.type = 'password'
	}
};
</script>

<template>
	<label ref="label" :class="labelClasses">
		<span v-if="element.validareResult && showValidateError">
			{{ element.validareResult }}
		</span>
		<span v-if="showTitle && element.name">{{ element.name }}</span>
		<template v-if="element.type === 'text' || element.type === 'number' || element.type === 'password'"">
			<input
					v-model="element.value"
					:type="element.type"
					:name="name"
					:friendly-name="element.name"
					:placeholder="element.placeholder"
			/>
			<span v-if="element.showChangeTypeButton" @click="showPassword">глазик</span>
		</template>
		<template v-else-if="element.type === 'textarea'">
			<textarea
					v-model="element.value"
					:name="name"
					:friendly-name="element.name"
					:placeholder="element.placeholder"
			/>
		</template>
		<template v-else-if="element.type === 'file'">
			<template v-if="element.multiple">
				<input
						type="file"
						multiple="multiple"
						:accept="element.accept"
						:name="name"
						:friendly-name="element.name"
						:placeholder="element.placeholder"
						@change="element.value = $event.target.files"
				/>
			</template>
			<template v-else>
				<input
						type="file"
						:accept="element.accept"
						:name="name"
						:friendly-name="element.name"
						:placeholder="element.placeholder"
						@change="element.value = $event.target.files"
				/>
			</template>
		</template>
	</label>
</template>
