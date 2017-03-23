
import React, { Component } from 'react';
import { View, Animated, PanResponder, TouchableWithoutFeedback } from 'react-native';

import EffectConfig from './EffectConfig';

/**
 * OpenProgress:
 * - 0: only content is visible
 * - 0..1: left sidebar is visible, over 1 for bounce effects
 * - -1..0: right sidebar is visible, below -1 for bounce effects
 */
export default class SidebarView extends Component {
	constructor(props) {
		super(props);

		this.state = {
			open: props.open,
			leftSidebarWidth: props.leftSidebarWidth || props.sidebarWidth || 280,
			leftThreshold: props.leftThreshold || props.threshold || 30,
			rightSidebarWidth: props.rightSidebarWidth || props.sidebarWidth || 280,
			rightThreshold: props.rightThreshold || props.threshold || 30,
			overlayColor: props.overlayColor || '#000000'
		};

		this.panResponder = PanResponder.create({
			onMoveShouldSetPanResponder: this._handleShouldMove.bind(this),
			onPanResponderMove: this._handleMove.bind(this),
			onPanResponderRelease: this._handleMoveEnd.bind(this),
			onPanResponderTerminate: this._handleMoveEnd.bind(this)
		});

		this.openProgress = new Animated.Value(props.open === 'right' ? -1 : props.open ? 1 : 0);
		this.contentWidth = new Animated.Value(0); // will be changed in onLayout automatically
		this.leftSidebarWidth = new Animated.Value(this.state.leftSidebarWidth);
		this.rightSidebarWidth = new Animated.Value(this.state.rightSidebarWidth);

		this.updateEffectConfig();
	}

	updateEffectConfig() {
		const effectConfig = EffectConfig.create(this.props.effect, this.state);

		this.contentOffset = this.openProgress.interpolate(effectConfig.contentOffset);
		this.overlayOpacity = this.openProgress.interpolate(effectConfig.overlayOpacity);
		this.leftSidebarOffset = this.openProgress.interpolate(effectConfig.leftSidebarOffset);
		this.leftSidebarOpacity = this.openProgress.interpolate(effectConfig.leftSidebarOpacity);
		this.rightSidebarOffset = this.openProgress.interpolate(effectConfig.rightSidebarOffset);
		this.rightSidebarOpacity = this.openProgress.interpolate(effectConfig.rightSidebarOpacity);
	}

	open(side) {
		if (this.props.leftSidebar && side !== 'right') {
			this.openLeftSidebar();
		} else if (this.props.rightSidebar && side === 'right') {
			this.openRightSidebar();
		} else {
			this.close();
		}
	}

	openLeftSidebar() {
		if (this.props.leftSidebar) {
			this.setState({ open: 'left' });
			Animated.spring(this.openProgress, { toValue: 1 }).start();
		}
	}

	openRightSidebar() {
		if (this.props.rightSidebar) {
			this.setState({ open: 'right' });
			Animated.spring(this.openProgress, { toValue: -1 }).start();
		}
	}

	close() {
		this.setState({ open: null });
		Animated.spring(this.openProgress, { toValue: 0 }).start();
	}

	toggle(side) {
		if (this.props.leftSidebar && this.openProgress._value !== 1 && side !== 'right') {
			this.openLeftSidebar();
		} else if (this.props.rightSidebar && this.openProgress._value !== -1 && side === 'right') {
			this.openRightSidebar();
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

		this._progressOffset = this.openProgress._value;
		this._progressFactor = 1 / contentWidth;

		if (this.props.leftSidebar && locationX >= 0 && locationX <= this.state.leftThreshold) {
			this.setState({ open: 'left' });
			return true;
		} else if (this.props.rightSidebar && locationX >= contentWidth - this.state.rightThreshold && locationX <= contentWidth) {
			this.setState({ open: 'right' });
			return true;
		} else if (this.openProgress._value !== 0) {
			return true;
		}

		return false;
	}

	_handleMove(event, gestureState) {
		const currentProgress = this._progressOffset + gestureState.dx * this._progressFactor;

		this.openProgress.setValue(currentProgress);
	}

	_handleMoveEnd(event, gestureState) {
		const currentProgress = this._progressOffset + gestureState.dx * this._progressFactor;
		const velocity = gestureState.vx * this._progressFactor;

		let toValue = 0;
		if (this.props.leftSidebar && currentProgress + gestureState.vx >= 0.5 && this.state.open !== 'right') {
			this.setState({ open: 'left' });
			toValue = 1;
		} else if (this.props.rightSidebar && currentProgress + gestureState.vx < -0.5 && this.state.open !== 'left') {
			this.setState({ open: 'right' });
			toValue = -1;
		}

		Animated.sequence([
			Animated.decay(this.openProgress, { velocity }),
			Animated.spring(this.openProgress, { toValue })
//			Animated.spring(this.openProgress, { toValue, velocity })
		]).start(() => {
			if (this.openProgress._value === 0) {
				this.setState({ open: null });
			}
		});
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
			style: this.props.style
		};

		const contentStyle = this.contentWidth._value ? {
			position: 'absolute',
			top: 0,
			bottom: 0,
			left: this.contentOffset,
			width: this.contentWidth,
			opacity: 1
		} : {
			position: 'absolute',
			top: 0,
			bottom: 0,
			left: this.contentOffset,
			right: 0,
			opacity: 1
		};

		const leftSidebarStyle = {
			position: 'absolute',
			top: 0,
			bottom: 0,
			left: this.leftSidebarOffset,
			width: this.leftSidebarWidth,
			opacity: this.leftSidebarOpacity
		};

		const rightSidebarStyle = {
			position: 'absolute',
			top: 0,
			bottom: 0,
			right: this.rightSidebarOffset,
			width: this.rightSidebarWidth,
			opacity: this.rightSidebarOpacity
		};

		const overlayStyle = {
			position: 'absolute',
			top: 0,
			bottom: 0,
			left: this.contentOffset,
			width: this.state.open ? this.contentWidth : 0,
			opacity: this.state.open ? this.overlayOpacity : 0,
			backgroundColor: this.state.overlayColor
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
				<Animated.View style={ overlayStyle }>
					<TouchableWithoutFeedback onPress={ this.close.bind(this) }>
						<View style={{ flex: 1 }} />
					</TouchableWithoutFeedback>
				</Animated.View>
			</View>
		);
	}
}
