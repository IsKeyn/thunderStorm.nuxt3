<script setup>
import { watch } from "vue";

const props = defineProps({
	formClasses: {
		type: String,
		default: '',
	},
	inputClasses: {
		type: String,
		default: '',
	},
	buttonClasses: {
		type: String,
		default: '',
	},
	placeholderText: {
		type: String,
		default: 'Введите текст для поиска',
	},
	buttonText: {
		type: String,
		default: 'Искать',
	},
});

const searchQuery = ref('');

const router = useRouter();
const route = useRoute();

if (route.query.q) {
	searchQuery.value = route.query.q;
}

watch(() => route.query.q,(newValue) => {
	searchQuery.value = newValue;
}, { deep: true });

const submitHandler = () => {
	router.push({
		path: `/search/`,
		query: { q: searchQuery.value },
	});
}

const getFormClasses = computed(() => {
	return props.formClasses;
});

const getInputClasses = computed(() => {
	return props.inputClasses;
});

const getButtonClasses = computed(() => {
	return props.buttonClasses;
});
</script>

<template>
	<div>
		<form
				:class="getFormClasses"
				@submit.prevent="submitHandler"
		>
			<input
					type="text"
					:placeholder="placeholderText"
					:class="getInputClasses"
					v-model="searchQuery"
			/>
			<button
					type="submit"
					class="btn btn-primary"
					:class="getButtonClasses"
			>
				{{ buttonText }}
			</button>
		</form>
	</div>
</template>

<style lang="scss" scoped>
form {
	@apply flex;

	input {
		@apply w-full;
	}

	button {
		@apply mb-[0px] ml-[10px];
	}
}
</style>
