var twoSum = function (nums, target) {
	for (let i = 0; i < nums.length; i++) {
		let diff = target - nums[i]
		if (nums.includes(diff) && (i !== nums.indexOf(diff))) {
			return [i, nums.indexOf(diff)]
		}
	}
};

console.log(twoSum([3, 2, 4], 6))
