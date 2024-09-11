<script setup>
import MenuEditorGroup from '@/components/admin/MenuEditor/MenuEditorGroup';
import Repeater from '@/components/repeaters/Repeater.vue';

const repeaterComponent1 = ref(null);
const repeaterComponent2 = ref(null);

const props = defineProps({
	entityType: {
		type: String,
		default: null,
	},
	entityId: {
		type: Number,
		default: null,
	},
	menu: {
		type: Object,
		default: {},
	},
});
</script>

<template>
	<Repeater
			ref="repeaterComponent1"
			:repeaterItem="{}"
			#default="{repeaterItems}"
	>
		<div
				v-for="(item, index) in repeaterItems"
				:key="index"
				class="mb-1"
		>
			Типы меню
			<button
					v-if="repeaterItems.length > 1"
					class="btn btn-primary"
					@click="repeaterComponent1.deleteRepeaterItem(index)"
			>
				<font-awesome-icon :icon="['fas', 'xmark']" />
			</button>
		</div>
		<button
				class="btn btn-primary block"
				@click="repeaterComponent1.addRepeaterItem()"
		>
			Добавить
		</button>
	</Repeater>




<!--	<MenuEditorGroup-->
<!--			v-for="(group, key) in menu"-->
<!--			:key="key"-->
<!--			:group="group"-->
<!--	/>-->
</template>
