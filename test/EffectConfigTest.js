/* global describe, it */

var assert = require('assert');

var EffectConfig = require('../lib/EffectConfig');

describe('EffectConfig', function() {
	it('should be an object with a create function', function() {
		assert.equal('object', typeof EffectConfig);
		assert.equal('function', typeof EffectConfig.create);
	});

	it('should return default effect config', function() {
		var actualEffectConfig = EffectConfig.create('default', {
			leftSidebarWidth: 200,
			rightSidebarWidth: 200
		});
		var expectEffectConfig = {
			contentOffset: {
				inputRange: [-1, -1, 0, 1, 1],
				outputRange: [-200, -200, 0, 200, 200]
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
		assert.deepEqual(actualEffectConfig, expectEffectConfig);
	});

});
