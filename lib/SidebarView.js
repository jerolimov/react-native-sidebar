
import React, { Component, View, Animated, PanResponder } from 'react-native';

/**
 * OpenProgress:
 * - 0: only content is visible
 * - 0..1: left sidebar is visible, over 1 for bounce effects
 * - -1..0: right sidebar is visible, below -1 for bounce effects
 */
export default class SidebarView extends Component {
	constructor(props) {
		super(props);

		const open = props.open || false;

		this.openProgress = new Animated.Value(open === 'right' ? -1 : open ? 1 : 0);
		this.panResponder = PanResponder.create({
			onMoveShouldSetPanResponder: this._handleShouldMove.bind(this),
			onPanResponderMove: this._handleMove.bind(this),
			onPanResponderRelease: this._handleMoveEnd.bind(this),
			onPanResponderTerminate: this._handleMoveEnd.bind(this)
		});
		this.threshold = this.props.threshold || 50;

		this.contentWidth = new Animated.Value(320); // will be changed in onLayout automatically
		this.leftSidebarWidth = new Animated.Value(this.props.leftSidebarWidth || 150);
		this.rightSidebarWidth = new Animated.Value(this.props.rightSidebarWidth || 150);

		this.contentOffset = this.openProgress.interpolate({
			inputRange: [-1, 0, 1],
			outputRange: [-150, 0, 150]
		});
		this.leftSidebarOffset = this.openProgress.interpolate({
			inputRange: [0, 1],
			outputRange: [-50, 0]
		});
		this.rightSidebarOffset = this.openProgress.interpolate({
			inputRange: [-1, 0],
			outputRange: [0, -50]
		});
		this.leftSidebarOpacity = this.openProgress.interpolate({
			inputRange: [0, 1],
			outputRange: [0, 1]
		});
		this.rightSidebarOpacity = this.openProgress.interpolate({
			inputRange: [-1, 0],
			outputRange: [1, 0]
		});
	}

	open(side) {
		Animated.spring(this.openProgress, { toValue: side === 'right' ? -1 : 1 }).start();
	}

	close() {
		Animated.spring(this.openProgress, { toValue: 0 }).start();
	}

	toggle(side) {
		if (this.openProgress._value !== -1 && side === 'right') {
			this.open('right');
		} else if (this.openProgress._value !== 1 && side !== 'right') {
			this.open();
		} else {
			this.close();
		}
	}

	onLayout(event) {
		this.contentWidth.setValue(event.nativeEvent.layout.width);
	}

	_handleShouldMove(event, gestureState) {
		const locationX = event.nativeEvent.locationX;
		const contentWidth = this.contentWidth._value;

		this.progressOffset = this.openProgress._value;
		this.progressFactor = 1 / contentWidth;

		return this.openProgress._value !== 0 ||
				this.props.leftSidebar && locationX >= 0 && locationX <= this.threshold ||
				this.props.rightSidebar && locationX >= contentWidth - this.threshold && locationX <= contentWidth;
	}

	_handleMove(event, gestureState) {
		const progress = this.progressOffset + gestureState.dx * this.progressFactor;

		this.openProgress.setValue(progress);
	}

	_handleMoveEnd(event, gestureState) {
		const progress = this.progressOffset + gestureState.dx * this.progressFactor;
		const velocity = gestureState.vx * this.progressFactor;
		const toValue = progress + gestureState.vx < -0.5 ? -1 : progress + gestureState.vx >= 0.5 ? 1 : 0;

		Animated.sequence([
			Animated.decay(this.openProgress, { velocity }),
			Animated.spring(this.openProgress, { toValue })
		]).start();
	}

	_componentWillReceiveProps(nextProps) {
		if (this.openProgress._value === -1 || this.openProgress._value === 0 || this.openProgress._value === 1) {
			// FIXME use new open state!
		}
	}

	render() {
		const props = {
			onLayout: this.onLayout.bind(this),
			...this.panResponder.panHandlers,
			borderWidth: 10,
			borderColor: 'lightgreen',
			style: this.props.style
		};

		const contentStyle = {
			position: 'absolute',
			top: 0,
			bottom: 0,
			left: this.contentOffset,
			width: this.contentWidth,
			backgroundColor: 'red'
		};

		const leftSidebarStyle = {
			position: 'absolute',
			top: 0,
			bottom: 0,
			left: this.leftSidebarOffset,
			width: this.leftSidebarWidth,
			backgroundColor: 'blue',
			opacity: this.leftSidebarOpacity
		};

		const rightSidebarStyle = {
			position: 'absolute',
			top: 0,
			bottom: 0,
			right: this.rightSidebarOffset,
			width: this.rightSidebarWidth,
			backgroundColor: 'green',
			opacity: this.rightSidebarOpacity
		};

		return (
			<View { ...props }>
				<Animated.View key='leftSidebar' style={ leftSidebarStyle }>
					{ this.props.leftSidebar }
				</Animated.View>
				<Animated.View key='rightSidebar' style={ rightSidebarStyle }>
					{ this.props.rightSidebar }
				</Animated.View>
				<Animated.View key='content' style={ contentStyle }>
					{ this.props.children }
				</Animated.View>
			</View>
		);
	}
}
