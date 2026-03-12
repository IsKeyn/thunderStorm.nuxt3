<script setup>
import Simple from '@/components/ui/listData/cards/Simple.vue';
import Date from '@/components/ui/listData/cards/Date.vue';
import Company from '@/components/ui/listData/cards/Company.vue';
import Link from '@/components/ui/listData/cards/Link.vue';

import { date } from '@/composables/date.js';
const {
	getFormattedDate
} = date();

const props = defineProps({
	items: {
		type: Array,
		default: () => [],
		required: true,
	},
	names: {
		type: Object,
		default: {
			single: 'Значение:',
			many: 'Значения:',
		},
	},
	showMoreNames: {
		type: Object,
		default: {
			single: 'Отобразить все:',
			many: 'Скрыть:',
		},
	},
	cardType: {
		type: String,
		default: null,
	}
});

const cardType = () => {
	switch (props.cardType) {
		case 'Simple': return Simple;
		case 'Date': return Date;
		case 'Company': return Company;
		case 'Link': return Link;
		default: return Simple;
	}
};
</script>

<template>
	<div v-if="props.items && props.items.length > 0">
		<div v-if="props.items.length === 1">
			<span class="strong">{{ props.names.single }}</span>
			<span
					v-for="item in props.items"
					:title="item.description ? item.description : ''"
			>
				<component
						:is="cardType()"
						:item="item"
				/>
			</span>
		</div>
		<div v-else>
			<span class="strong mb-1 block">{{ props.names.many }}</span>
			<ui-ShowMoreBlock :names="props.showMoreNames">
				<template #default>
					<ul>
						<template v-for="(item, key) in props.items">
							<li
									v-if="key < 2"
									:title="item.description ? item.description : ''"
							>
								<component
										:is="cardType()"
										:item="item"
								/>
							</li>
						</template>
					</ul>
				</template>
				<template v-if="props.items.length > 2" #hiddenContent >
					<ul>
						<template v-for="(item, key) in props.items">
							<li
									v-if="key >= 2"
									:title="item.description ? item.description : ''"
							>
								<component
										:is="cardType()"
										:item="item"
								/>
							</li>
						</template>
					</ul>
				</template>
			</ui-ShowMoreBlock>
		</div>
	</div>
</template>

<style lang="scss" scoped>
ul {
	li {
		@apply list-[disclosure-closed];
	}
}
</style>
