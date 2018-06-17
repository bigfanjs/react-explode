import React, { Component } from "react";
import { TimelineMax, Power4 } from "gsap";

class Explosion extends Component {
    constructor(props) {
        super(props);

        const size = this.props.size;

        this.squares = [];
        const sizes = this.sizes = [
            size * 0.58,
            size * 0.3,
            size * 0.3,
            size * 0.1,
            size * 0.1
        ];
        this.halfs = [
            sizes[0] / 2,
            sizes[1] / 2,
            sizes[3] / 2
        ];
    }

    componentDidMount() {
        const ease = Power4.easeOut;
        const { size, delay = 0, repeat = 0, repeatDelay = 0, onStart, onComplete, onRepeat } = this.props;
        const center = size / 2;
        const halfs = this.halfs;
        const front = center - halfs[0];
        const back = center + halfs[0];
        const positions = [
            { x: front, y: front },
            { x: center - halfs[1], y: back - halfs[1] },
            { x: center - halfs[1], y: front - halfs[1] },
            { x: front - halfs[2], y: front - halfs[2] },
            { x: back - halfs[2], y: back - halfs[2] }
        ];
        const delays = [0, 0.3, 0.3, 0.5, 0.5];

        for (let i = 0; i < this.squares.length; i++) {
            const square = this.squares[i];
            const size = this.sizes[i];
            const { x, y } = positions[i];
            const delay2 = delays[i];
            const tl = new TimelineMax({
                delay: delay + delay2, repeat, repeatDelay,
                onStart: i === 0 && onStart,
                onComplete: i === 0 && onComplete,
                onRepeat: i === 0 && onRepeat
            });

            tl.to(square, 1, { attr: { x, y, width: size, height: size }, ease });
            tl.to(square, 1, { attr: { "stroke-width": 0 }, ease }, "-=0.9");
        }
    }

    render() {
        const {size, style} = this.props;
        const center = size / 2;
        const front = center - this.halfs[0];
        const back = center + this.halfs[0];

        const positions = [
            { x: center, y: center },
            { x: center, y: back },
            { x: center, y: front },
            { x: front, y: front },
            { x: back, y: back }
        ];

        return (
            <svg width={size} height={size} style={style}>
                {[...Array(5)].map((square, i) => {
                    const { x, y } = positions[i];

                    return (
                        <rect
                            key={i}
                            x={x}
                            y={y}
                            width={0}
                            height={0}
                            stroke="white"
                            strokeWidth="10"
                            fill="none"
                            ref={(el) => this.squares[i] = el}
                            style={{ transform: "rotate(-50deg)", transformOrigin: `${center}px ${center}px` }}
                        />
                    );
                })}
            </svg>
        );
    }
}

export default Explosion;