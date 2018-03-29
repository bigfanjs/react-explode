import React, { Component } from 'react';

import Explosion1 from "./Explosion1";
import Explosion2 from "./Explosion2";

const defaultStyle = {
    child: {
        position: "absolute"
    },
    parent: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    }
}

class Explosion extends Component {
    render() {
        const {child, parent} = defaultStyle;
        const style = Object.assign({}, parent, this.props.style);

        return (
            <div style={style}>
                <Explosion1 style={child} radius={150} duration={0.4} delay={0} count={16} />
                <Explosion2 style={child} radius={60} duration={1} delay={0.3} width={3} />
                <Explosion1 style={child} radius={150} duration={0.4} delay={0.5} count={16} />
            </div>
        );
    }
}

export default Explosion;