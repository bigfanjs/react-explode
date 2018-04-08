import React, { Component } from "react";
import circOut from "eases/expo-out";

class Explosion extends Component {
    center = this.props.size / 2;
    size = this.props.size;

    dest = 47.5;
    amplitude = 1.25;
    waveLength = 6000;
    strokeWidth = 0.5;

    root = {
        start: null,
        end: null,
        duration: 1100,
        step: 0,
        delay: 0,
        finished: false
    };

    edge = {
        start: null,
        end: null,
        duration: 1100,
        step: 0,
        delay: 80,
        finished: false
    };

    componentDidMount() {
        requestAnimationFrame(this.animate);
    }

    update = (side, timestamp) => {
        const { delay, start, end } = side;

        if (!start) side.start = timestamp;
        if (!end) side.end = side.start - side.duration;

        let elapsed = timestamp - side.start;

        if (elapsed >= delay) {
            side.start += delay;
            side.delay = 0;

            elapsed = timestamp - start;

            const percent = elapsed / side.duration;
            const time = circOut(percent);

            if (elapsed < side.duration) side.step = Math.round(this.size * this.dest / 100 * time);
            else side.finished = true;
        }
    };

    updateStart = (timestamp) => {
        this.update(this.root, timestamp);
    }

    updateEnd = (timestamp) => {
        this.update(this.edge, timestamp);
    }

    animate = (timestamp) => {
        if (this.root.finished && this.edge.finished) return;

        this.drawCurves();
        this.updateStart(timestamp);
        this.updateEnd(timestamp);

        requestAnimationFrame(this.animate);
    }

    drawCurves = () => {
        const waveLength = (this.waveLength / this.size) * Math.PI / 180;
        const degree = 45 * Math.PI / 180;
        const path = [];

        const start = this.root.step;
        const end = this.edge.step;

        const amplitude = this.size * this.amplitude / 100;

        for (let i = 0; i < 8; i++) {
            for (let j = end; j < start; j++) {
                const x = this.center + j * Math.cos(degree * i) - amplitude * Math.sin(degree * i) * Math.sin(j * waveLength);
                const y = this.center + j * Math.sin(degree * i) + amplitude * Math.cos(degree * i) * Math.sin(j * waveLength);

                j === end && path.push({ type: "M", values: [x, y] });
                j > end && path.push({ type: "L", values: [x, y] });
            }

            const data = this.createPathData(path);
            this.curve.setAttribute("d", data);
        }
    }

    createPathData = (data) => (
        data.reduce((string, { type, values }) => {
            return string + `${type}${values[0]} ${values[1]} `;
        }, "")
    )

    render() {
        const size = this.size;
        const strokeWidth = Math.ceil(size * this.strokeWidth / 100);

        return (
            <svg width={this.size} height={this.size} version="1.1">
                <path stroke="white" fill="none" strokeWidth={strokeWidth} ref={(el) => this.curve = el} />
            </svg>
        );
    }
}

export default Explosion;