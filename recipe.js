/** Requirements is a map from resource types to integers (number required)*/
function Recipe(requirements, result) {
	this.requirements = requirements;
	this.result = result;
}

/* given a player's inventory, it determines whether the recipe can be made */
Recipe.prototype.canMake = function(inventory) {
	for (var key in this.requirements) {
		if (this.requirements.hasOwnProperty(key)) {
			if (inventory[key] < this.requirements[key]) {
				return false;
			}
		}
	}
	return true;
}

/* given a player's inventory, removes required resources and adds result */
Recipe.prototype.make = function(inventory) {
	for (var key in this.requirements) {
		if (this.requirements.hasOwnProperty(key)) {
			inventory[key] -= this.requirements[key];
		}
	}
	inventory[this.result.id]++;
}