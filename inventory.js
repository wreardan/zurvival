function makeInventory() {
	var inv = new Array(resourceTypes.size());
	for (var c = 0; c < resourceTypes.size(); c++) {
		inv[c] = 0;
	}
	return inv;
}