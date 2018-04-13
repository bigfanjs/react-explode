import React, { Component, Fragment } from "react";
import { TweenLite, Power4 } from "gsap";

class Explosion extends Component {
    size = this.props.size;
    center = this.size / 2;

    componentDidMount() {
        const { delay = 0 } = this.props;
        const ease = Power4.easeOut;

        TweenLite.to(this.circle, 1, { attr: { r: 190 }, ease });
        TweenLite.to(this.circle, 0.8, { attr: { "stroke-width": 0 }, delay: 0.5, ease });
    }

    render() {
        const size = this.size;
        const center = this.center;

        const { style } = this.props;

        return (
            <svg style={style} width={size} height={size}>
                <circle
                    cx={center}
                    cy={center}
                    r={0}
                    strokeWidth="2"
                    stroke="white"
                    fill="none"
                    ref={(el) => this.circle = el}
                />
            </svg>
        );
    }
}

export default Explosion;