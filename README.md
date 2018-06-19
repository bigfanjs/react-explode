# React-explode
React Explode is a collection of explosion animations made in SVG and GSAP.

# Instalation
``npm install`` or ``yarn install``

# Usage
```js
import React, {Component} from "react";
import Explosion from "react-explode/Explosion1";

class ReactExplode extends Component {
    render() {
        return (
            <Explosion size="400" delay={0} repeatDelay={0.1} repeat={5} />
        );
    }
}
```

# Component API
| Name          | Type          | Default   | Description                                                |
| ------------- |:-------------:| ---------:| :---------------------------------------------------------:|
| size          | string        | 400       | The explosion size                                         |
| delay         | number        | 0         | How much time the explosion would wait before it starts    |
| repeatDelay   | number        | 0         | How much time the explosion would wait before it repeats   |
| repeat        | number        | 0         | How many times the explosion repeats                       |
| color         | string        | white     | The explosion color(Explosions: 1, 2, 3, 4, 5, 6, 7, 8)    |
| style         | object        | undefined | The style passed to SVG element                            |
| onComplete    | func          | undefined | Fired when the explosion completes                         |
| onRepeat      | func          | undefined | Fired when the explosion repeats                           |
| onStart       | func          | undefined | Fired when the explosion starts                            |

# License
``react-explode`` is under the MIT license.