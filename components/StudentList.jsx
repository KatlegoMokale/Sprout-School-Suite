import { useState } from 'react'

export default function StudentList() {
  const [students, setStudents] = useState([
    { id: 1, name: 'Alice', grade: 'KG1' },
    { id: 2, name: 'Bob', grade: 'KG2' },
    { id: 3, name: 'Charlie', grade: 'KG1' },
  ])

  return (
    <div>
      <h2>Student List</h2>
      <ul>
        {students.map((student) => (
          <li key={student.id}>
            {student.name} - {student.grade}
          </li>
        ))}
      </ul>
    </div>
  )
}