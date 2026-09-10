export default function ClassLabelOverlay({ classrooms }) {
  return (
    <g aria-hidden="true" className="class-label-overlay">
      {classrooms.map((classroom) => <text dominantBaseline="middle" key={classroom.classNumber} style={{ fontSize: classroom.label.fontSize ?? 28 }} textAnchor="middle" x={classroom.label.x} y={classroom.label.y}>{classroom.classNumber}</text>)}
    </g>
  )
}
