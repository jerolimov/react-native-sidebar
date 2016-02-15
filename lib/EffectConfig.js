
function create(type, options) {
	return {
		contentOffset: {
			inputRange: [
				-1,
				-1,
				0,
				1,
				1
			],
			outputRange: [
				-options.rightSidebarWidth,
				-options.rightSidebarWidth,
				0,
				options.leftSidebarWidth,
				options.leftSidebarWidth
			]
		},
		overlayOpacity: {
			inputRange: [-1, -1, 0, 1, 1],
			outputRange: [0.3, 0.3, 0, 0.3, 0.3]
		},
		leftSidebarOffset: {
			inputRange: [0, 1, 1],
			outputRange: [-50, 0, 0]
		},
		leftSidebarOpacity: {
			inputRange: [0, 1],
			outputRange: [0, 1]
		},
		rightSidebarOffset: {
			inputRange: [-1, -1, 0],
			outputRange: [0, 0, -50]
		},
		rightSidebarOpacity: {
			inputRange: [-1, 0],
			outputRange: [1, 0]
		}
	};
}

module.exports = {
	create
};
