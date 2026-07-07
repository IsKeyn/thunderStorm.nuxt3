export function bgItems() {
	const calcShopPrice = (price) => {
		return Math.round(price + (price * 0.35));
	};

	return {
		calcShopPrice,
	};
}
