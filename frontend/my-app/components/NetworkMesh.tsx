export function NetworkMesh() {
    const nodes = [
        { x: 60, y: 80, delay: "0s" },
        { x: 180, y: 140, delay: "0.6s" },
        { x: 320, y: 60, delay: "1.2s" },
        { x: 420, y: 180, delay: "0.3s" },
        { x: 520, y: 90, delay: "1.8s" },
        { x: 240, y: 260, delay: "0.9s" },
        { x: 400, y: 300, delay: "1.5s" },
        { x: 100, y: 220, delay: "2.1s" },
    ];

    const edges = [
        [0, 1], [1, 2], [2, 3], [3, 4], [1, 5], [5, 6], [3, 6], [0, 7], [5, 7],
    ];

    return (
        <svg
            className="mesh-drift absolute inset-0 h-full w-full opacity-40"
            viewBox="0 0 600 400"
            fill="none"
            aria-hidden="true"
        >
            {edges.map(([a, b], i) => (
                <line
                    key={i}
                    x1={nodes[a].x}
                    y1={nodes[a].y}
                    x2={nodes[b].x}
                    y2={nodes[b].y}
                    stroke="#4C8DFF"
                    strokeWidth="0.6"
                    strokeOpacity="0.35"
                />
            ))}
            {nodes.map((n, i) => (
                <circle
                    key={i}
                    cx={n.x}
                    cy={n.y}
                    r="3"
                    fill="#38E1C6"
                    className="node-pulse"
                    style={{ animationDelay: n.delay, transformOrigin: `${n.x}px ${n.y}px` }}
                />
            ))}
        </svg>
    );
}