<script setup>
const props = defineProps({
	item: {
		type: Object,
		default: {},
	},
});

const getButtonFunc = (button) => {
	if (button.func) {
		switch (typeof button.func) {
			case 'function': button.func(); break;
			case 'string': getFuncByKeyword(button.func); break;
		}
	}

	if (button.additionalKeywordFunc) {
		getFuncByKeyword(button.additionalKeywordFunc);
	}
}

const emit = defineEmits(['close']);

const getFuncByKeyword = (keyword) => {
	switch (keyword) {
		case 'close': emit('close'); break;
	}
}
</script>

<template>
	<div>
		<h3
				v-if="item.title"
				class="modal-title"
		>
			{{ item.title }}
		</h3>
		<span v-if="item.message">{{ item.message }}</span>
		<div class="text-center">
			<button
					v-for="button in item.buttons"
					class="mr-[8px]"
					@click="getButtonFunc(button)"
			>
				{{ button.name }}
			</button>
		</div>
	</div>
</template>
