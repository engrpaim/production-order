export default function BrokenLine({color}) {
    return (
        <svg width="200" height="60" xmlns="http://www.w3.org/2000/svg">
            <line
                x1="10" y1="30"
                x2="290" y2="30"
                stroke={color}
                stroke-width="4"
                stroke-dasharray="12 6"
            />
        </svg>
    )
}