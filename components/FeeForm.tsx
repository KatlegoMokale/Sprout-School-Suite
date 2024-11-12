// components/FeeForm.js
import { useState } from 'react'

export default function FeeForm() {
  const [studentId, setStudentId] = useState('')
  const [amount, setAmount] = useState('')

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Here you would typically send this data to your backend
    console.log('Fee submitted:', { studentId, amount })
    // Reset form
    setStudentId('')
    setAmount('')
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Submit Fee Payment</h2>
      <div>
        <label htmlFor="studentId">Student ID:</label>
        <input
          type="text"
          id="studentId"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="amount">Amount:</label>
        <input
          type="number"
          id="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
      </div>
      <button type="submit">Submit Payment</button>
    </form>
  )
}