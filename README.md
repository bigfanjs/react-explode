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
| size          | string        | undefined | The explosion size                                         |
| delay         | number        | 0         | How much time the explosion would wait before it starts    |
| repeatDelay   | number        | 0         | How much time the explosion would wait before it repeats   |
| repeat        | number        | 0         | How many times the explosion repeats                       |

# License
``react-explode`` is under the MIT license.