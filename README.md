# react-native-sidebar

> A [react-native](https://facebook.github.io/react-native/) Animated based sidebar (aka drawer) solution.

[![Build status][travis-image]][travis-url] [![Test coverage][coveralls-image]][coveralls-url] [![Dependency Status][dependency-image]][dependency-url]

After testing several other sidebar implementation with different pitfalls
we decided to implement a clean, easy-to-use and working sidebar based on the
react-native [Animated](https://facebook.github.io/react-native/docs/animated.html) framework.

## Getting started

```bash
npm install --save react-native-sidebar
```

Usage:

```js
import Sidebar from 'react-native-sidebar';

render() {
	return (
		<Sidebar
				leftSidebar={ this.renderLeftSidebar() }
				rightSidebar={ this.renderRightSidebar() }
				style={{ flex: 1, backgroundColor: 'black' }}>
			{ this.renderContent() }
		</Sidebar>
	)
}
```

Supported properties:

* `open`: bool or string (bool true or string 'left' opens left sidebar, string 'right' opens right sidebar)
* `leftSidebar`: Compontent
* `leftSidebarWidth`: Number (callback `sidebarWidth`: Number, otherwise use default 280)
* `leftThreshold`: Number (callback `threshold`: Number, otherwise use default 30)
* `rightSidebar`: Compontent
* `rightSidebarWidth`: Number (callback `sidebarWidth`: Number, otherwise use default 280)
* `rightThreshold`: Number (callback `threshold`: Number, otherwise use default 30)
* `overlayColor`: Color
* childrens: Compontent[]

## Effects

More effects coming soon! Input / ideas (as issue) or PR are welcome. :+1:

### Default



## Alternatives

* Native but Android-only [DrawerLayoutAndroid](https://facebook.github.io/react-native/docs/drawerlayoutandroid.html)
* [react-native-side-menu](https://github.com/react-native-fellowship/react-native-side-menu)
* [react-native-drawer](https://github.com/root-two/react-native-drawer)

## License

This project is released under the MIT License.
See the LICENSE file for further details.

[travis-image]: https://img.shields.io/travis/bringnow/react-native-autopilot/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/bringnow/react-native-autopilot
[coveralls-image]: https://img.shields.io/coveralls/bringnow/react-native-autopilot/master.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/bringnow/react-native-autopilot
[dependency-image]: http://img.shields.io/david/bringnow/react-native-autopilot.svg?style=flat-square
[dependency-url]: https://david-dm.org/bringnow/react-native-autopilot
