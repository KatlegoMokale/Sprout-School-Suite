"use client"

import { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  FileUp,
  Upload,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Loader2,
  Trash2,
} from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface ParsedStudent {
  firstName: string
  secondName: string
  surname: string
  dateOfBirth: string
  age: string
  gender: string
  homeLanguage: string
  allergies: string
  address1: string
  p1_relationship: string
  p1_firstName: string
  p1_surname: string
  p1_dateOfBirth: string
  p1_phoneNumber: string
  p1_whatsapp: string
  p1_email: string
  p1_address1: string
  p1_idNumber: string
  p2_relationship: string
  p2_firstName: string
  p2_surname: string
  p2_dateOfBirth: string
  p2_phoneNumber: string
  p2_whatsapp: string
  p2_email: string
  p2_address1: string
  p2_idNumber: string
  emergency_name: string
  emergency_idNumber: string
  emergency_address: string
  emergency_phone: string
}

interface ImportResult {
  student: ParsedStudent
  status: "success" | "error"
  message: string
}

// CSV headers from the spreadsheet mapped to their column index
const CSV_HEADER_MAP: Record<number, keyof ParsedStudent> = {
  0: "firstName",        // Timestamp (we skip this but keep index)
  1: "firstName",        // Type of registration (skip)
  2: "firstName",        // Child's name AND surname
  3: "dateOfBirth",      // Child's Date of birth
  4: "gender",           // Child's gender
  5: "homeLanguage",     // Home language
  6: "firstName",        // Other languages (skip)
  7: "address1",         // Child's Residential Address
  8: "allergies",        // Allergies
  9: "p1_relationship",  // Parent 1: Relationship
  10: "p1_firstName",    // Parent 1: Full name and surname
  11: "p1_dateOfBirth",  // Parent 1: Date of birth
  12: "p1_phoneNumber",  // Parent 1: Contact details
  13: "p1_whatsapp",     // Parent 1: WhatsApp
  14: "p1_email",        // Parent 1: Email
  15: "p1_address1",     // Parent 1: Residential Address
  16: "p2_relationship", // Parent 2: Relationship
  17: "p2_firstName",    // Parent 2: Full name and surname
  18: "p2_dateOfBirth",  // Parent 2: Date of birth
  19: "p2_phoneNumber",  // Parent 2: Contact details
  20: "p2_whatsapp",     // Parent 2: WhatsApp
  21: "p2_email",        // Parent 2: Email
  22: "p2_address1",     // Parent 2: Residential Address
  23: "emergency_name",  // Emergency: Name & Surname
  24: "emergency_idNumber", // Emergency: ID/Passport
  25: "emergency_address",  // Emergency: Residential Address
  26: "emergency_phone",    // Emergency: Contact number
}

function splitNameAndSurname(fullName: string): { firstName: string; secondName: string; surname: string } {
  const parts = fullName.trim().split(/\s+/)
  if (parts.length === 1) {
    return { firstName: parts[0], secondName: "", surname: "" }
  }
  if (parts.length === 2) {
    return { firstName: parts[0], secondName: "", surname: parts[1] }
  }
  return {
    firstName: parts[0],
    secondName: parts.slice(1, -1).join(" "),
    surname: parts[parts.length - 1],
  }
}

function splitParentName(fullName: string): { firstName: string; surname: string } {
  const parts = fullName.trim().split(/\s+/)
  if (parts.length === 1) {
    return { firstName: parts[0], surname: "" }
  }
  return {
    firstName: parts.slice(0, -1).join(" "),
    surname: parts[parts.length - 1],
  }
}

function parseDate(dateStr: string): string {
  if (!dateStr) return ""
  // Try to parse various date formats and return YYYY-MM-DD
  const cleaned = dateStr.trim()

  // Already in YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(cleaned)) return cleaned

  // DD/MM/YYYY or DD-MM-YYYY
  const dmyMatch = cleaned.match(/^(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{4})$/)
  if (dmyMatch) {
    const [, day, month, year] = dmyMatch
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`
  }

  // MM/DD/YYYY (US format) - try parsing with Date
  const date = new Date(cleaned)
  if (!isNaN(date.getTime())) {
    return date.toISOString().split("T")[0]
  }

  return cleaned
}

function calculateAge(birthDate: string): string {
  if (!birthDate) return ""
  const today = new Date()
  const birth = new Date(birthDate)
  if (isNaN(birth.getTime())) return ""

  let months =
    (today.getFullYear() - birth.getFullYear()) * 12 +
    (today.getMonth() - birth.getMonth())

  if (months < 12) {
    return `${months} month${months !== 1 ? "s" : ""}`
  } else {
    let years = Math.floor(months / 12)
    if (
      today.getMonth() < birth.getMonth() ||
      (today.getMonth() === birth.getMonth() &&
        today.getDate() < birth.getDate())
    ) {
      years += 1
    }
    return `${years} year${years !== 1 ? "s" : ""}`
  }
}

function parseCSVLine(line: string): string[] {
  const result: string[] = []
  let current = ""
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    if (char === '"') {
      if (inQuotes && i + 1 < line.length && line[i + 1] === '"') {
        current += '"'
        i++
      } else {
        inQuotes = !inQuotes
      }
    } else if ((char === ";" || char === "\t") && !inQuotes) {
      result.push(current.trim())
      current = ""
    } else {
      current += char
    }
  }
  result.push(current.trim())
  return result
}

function parseCSV(csvText: string): ParsedStudent[] {
  const lines = csvText.split(/\r?\n/).filter((line) => line.trim() !== "")
  if (lines.length < 2) return []

  const header = parseCSVLine(lines[0]).map((h) => h.toLowerCase())
  const isStatementStyleCsv = header.includes("surname and name")
  const dataLines = lines.slice(1)

  const parseStatementName = (fullName: string) => {
    const parts = fullName.trim().split(/\s+/)
    if (parts.length === 0 || !parts[0]) {
      return { firstName: "", secondName: "", surname: "" }
    }
    if (parts.length === 1) {
      return { firstName: "", secondName: "", surname: parts[0] }
    }
    return {
      surname: parts[0],
      firstName: parts[1],
      secondName: parts.slice(2).join(" "),
    }
  }

  const students = dataLines
    .map((line) => parseCSVLine(line))
    .filter((columns) => columns.some((value) => value.trim() !== ""))
    .map((columns) => {
      if (isStatementStyleCsv) {
        // Format: NO.;SURNAME AND NAME;Email adress;AGE/ CLASS;...;DATE OF BIRTH;...
        const fullName = columns[1] || ""
        const { firstName, secondName, surname } = parseStatementName(fullName)
        const dob = parseDate(columns[6] || "")
        const age = calculateAge(dob)

        return {
          firstName,
          secondName,
          surname,
          dateOfBirth: dob,
          age,
          gender: "Not specified",
          homeLanguage: "Not specified",
          allergies: "",
          address1: "Address not provided",
          p1_relationship: "Guardian",
          p1_firstName: firstName || "Guardian",
          p1_surname: surname || "",
          p1_dateOfBirth: "",
          p1_phoneNumber: "",
          p1_whatsapp: "",
          p1_email: columns[2] || "",
          p1_address1: "Address not provided",
          p1_idNumber: "",
          p2_relationship: "",
          p2_firstName: "",
          p2_surname: "",
          p2_dateOfBirth: "",
          p2_phoneNumber: "",
          p2_whatsapp: "",
          p2_email: "",
          p2_address1: "",
          p2_idNumber: "",
          emergency_name: "",
          emergency_idNumber: "",
          emergency_address: "",
          emergency_phone: "",
        }
      }

      // Original registration-form format
      const childFullName = columns[2] || ""
      const { firstName, secondName, surname } = splitNameAndSurname(childFullName)
      const dob = parseDate(columns[3] || "")
      const age = calculateAge(dob)
      const p1FullName = columns[10] || ""
      const p1Name = splitParentName(p1FullName)
      const p2FullName = columns[17] || ""
      const p2Name = splitParentName(p2FullName)
      const idPassport = columns[24] || ""

      return {
        firstName,
        secondName,
        surname,
        dateOfBirth: dob,
        age,
        gender: columns[4] || "",
        homeLanguage: columns[5] || "",
        allergies: columns[8] || "",
        address1: columns[7] || "",
        p1_relationship: columns[9] || "",
        p1_firstName: p1Name.firstName,
        p1_surname: p1Name.surname,
        p1_dateOfBirth: parseDate(columns[11] || ""),
        p1_phoneNumber: columns[12] || "",
        p1_whatsapp: columns[13] || "",
        p1_email: columns[14] || "",
        p1_address1: columns[15] || "",
        p1_idNumber: idPassport,
        p2_relationship: columns[16] || "",
        p2_firstName: p2Name.firstName,
        p2_surname: p2Name.surname,
        p2_dateOfBirth: parseDate(columns[18] || ""),
        p2_phoneNumber: columns[19] || "",
        p2_whatsapp: columns[20] || "",
        p2_email: columns[21] || "",
        p2_address1: columns[22] || "",
        p2_idNumber: "",
        emergency_name: columns[23] || "",
        emergency_idNumber: idPassport,
        emergency_address: columns[25] || "",
        emergency_phone: columns[26] || "",
      }
    })
    .filter((student) => {
      return (
        student.firstName.trim() !== "" &&
        student.surname.trim() !== "" &&
        student.dateOfBirth.trim() !== ""
      )
    })

  return students
}

interface CsvStudentImportProps {
  onImportComplete?: () => void
}

export default function CsvStudentImport({ onImportComplete }: CsvStudentImportProps) {
  const [open, setOpen] = useState(false)
  const [parsedStudents, setParsedStudents] = useState<ParsedStudent[]>([])
  const [importResults, setImportResults] = useState<ImportResult[]>([])
  const [isImporting, setIsImporting] = useState(false)
  const [importProgress, setImportProgress] = useState(0)
  const [step, setStep] = useState<"upload" | "preview" | "results">("upload")
  const [dragOver, setDragOver] = useState(false)
  const [fileName, setFileName] = useState<string>("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const resetState = () => {
    setParsedStudents([])
    setImportResults([])
    setIsImporting(false)
    setImportProgress(0)
    setStep("upload")
    setFileName("")
    setDragOver(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleFileRead = useCallback((file: File) => {
    setFileName(file.name)
    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      const students = parseCSV(text)
      setParsedStudents(students)
      setStep("preview")
    }
    reader.readAsText(file)
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileRead(file)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file && (file.name.endsWith(".csv") || file.name.endsWith(".tsv") || file.name.endsWith(".txt"))) {
      handleFileRead(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = () => {
    setDragOver(false)
  }

  const removeStudent = (index: number) => {
    setParsedStudents((prev) => prev.filter((_, i) => i !== index))
  }

  const handleImport = async () => {
    setIsImporting(true)
    setImportProgress(0)
    const results: ImportResult[] = []

    for (let i = 0; i < parsedStudents.length; i++) {
      const student = parsedStudents[i]

      try {
        // Map CSV data to API expected format
        const payload = {
          firstName: student.firstName,
          secondName: student.secondName,
          surname: student.surname,
          dateOfBirth: student.dateOfBirth,
          age: student.age,
          gender: student.gender,
          address1: student.address1,
          city: "", // CSV doesn't provide separate city
          province: "", // CSV doesn't provide separate province
          postalCode: "", // CSV doesn't provide separate postal code
          homeLanguage: student.homeLanguage,
          allergies: student.allergies,
          medicalAidNumber: "",
          medicalAidScheme: "",
          studentClass: "Imported",
          autoFeeRegistration: false,
          studentStatus: "active",
          balance: 0,
          lastPaid: "",
          // Parent 1 data
          p1_relationship: student.p1_relationship,
          p1_firstName: student.p1_firstName,
          p1_surname: student.p1_surname,
          p1_email: student.p1_email,
          p1_phoneNumber: student.p1_phoneNumber,
          p1_idNumber: student.p1_idNumber,
          p1_gender: "",
          p1_dateOfBirth: student.p1_dateOfBirth,
          p1_address1: student.p1_address1,
          p1_city: "",
          p1_province: "",
          p1_postalCode: "",
          p1_occupation: "",
          p1_workNumber: "",
          // Parent 2 data (only if provided)
          ...(student.p2_firstName && {
            p2_relationship: student.p2_relationship,
            p2_firstName: student.p2_firstName,
            p2_surname: student.p2_surname,
            p2_email: student.p2_email,
            p2_phoneNumber: student.p2_phoneNumber,
            p2_idNumber: student.p2_idNumber,
            p2_gender: "",
            p2_dateOfBirth: student.p2_dateOfBirth,
            p2_address1: student.p2_address1,
            p2_city: "",
            p2_province: "",
            p2_postalCode: "",
            p2_occupation: "",
            p2_workNumber: "",
          }),
        }

        const response = await fetch("/api/students", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || `Server error: ${response.statusText}`)
        }

        results.push({
          student,
          status: "success",
          message: `${student.firstName} ${student.surname} added successfully`,
        })
      } catch (error) {
        results.push({
          student,
          status: "error",
          message: `Failed to add ${student.firstName} ${student.surname}: ${error instanceof Error ? error.message : "Unknown error"}`,
        })
      }

      setImportProgress(Math.round(((i + 1) / parsedStudents.length) * 100))
    }

    setImportResults(results)
    setIsImporting(false)
    setStep("results")

    if (onImportComplete) {
      onImportComplete()
    }
  }

  const successCount = importResults.filter((r) => r.status === "success").length
  const errorCount = importResults.filter((r) => r.status === "error").length

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        setOpen(newOpen)
        if (!newOpen) resetState()
      }}
    >
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <FileUp className="h-4 w-4 mr-2" />
          Import CSV
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Import Students from CSV</DialogTitle>
          <DialogDescription>
            Upload a CSV file exported from your registration form to bulk-add students.
          </DialogDescription>
        </DialogHeader>

        {/* Step 1: Upload */}
        {step === "upload" && (
          <div className="flex flex-col items-center gap-4 py-8">
            <div
              className={`w-full border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
                dragOver
                  ? "border-primary bg-primary/5"
                  : "border-muted-foreground/25 hover:border-primary/50"
              }`}
              onClick={() => fileInputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") fileInputRef.current?.click()
              }}
            >
              <Upload className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg font-medium">Drop your CSV file here</p>
              <p className="text-sm text-muted-foreground mt-1">
                or click to browse your files
              </p>
              <p className="text-xs text-muted-foreground mt-3">
                Supports .csv and .tsv files
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.tsv,.txt"
              onChange={handleFileChange}
              className="hidden"
              aria-label="Upload CSV file"
            />
          </div>
        )}

        {/* Step 2: Preview */}
        {step === "preview" && (
          <div className="flex flex-col gap-4 flex-1 min-h-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{fileName}</Badge>
                <Badge variant="outline">
                  {parsedStudents.length} student{parsedStudents.length !== 1 ? "s" : ""} found
                </Badge>
              </div>
              <Button variant="ghost" size="sm" onClick={resetState}>
                Choose different file
              </Button>
            </div>

            {parsedStudents.length === 0 ? (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>No students found</AlertTitle>
                <AlertDescription>
                  The CSV file appears to be empty or in an unexpected format. Please check the file and try again.
                </AlertDescription>
              </Alert>
            ) : (
              <ScrollArea className="flex-1 rounded-md border max-h-[400px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-8">#</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Surname</TableHead>
                      <TableHead>DOB</TableHead>
                      <TableHead>Gender</TableHead>
                      <TableHead>Parent 1</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead className="w-10">
                        <span className="sr-only">Remove</span>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {parsedStudents.map((student, index) => (
                      <TableRow key={index}>
                        <TableCell className="text-muted-foreground">{index + 1}</TableCell>
                        <TableCell className="font-medium">
                          {student.firstName} {student.secondName}
                        </TableCell>
                        <TableCell>{student.surname}</TableCell>
                        <TableCell>{student.dateOfBirth}</TableCell>
                        <TableCell>{student.gender}</TableCell>
                        <TableCell>
                          {student.p1_firstName} {student.p1_surname}
                        </TableCell>
                        <TableCell>{student.p1_phoneNumber}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeStudent(index)}
                            aria-label={`Remove ${student.firstName} ${student.surname}`}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            )}

            {isImporting && (
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Importing students...</span>
                  <span>{importProgress}%</span>
                </div>
                <Progress value={importProgress} />
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={resetState} disabled={isImporting}>
                Cancel
              </Button>
              <Button
                onClick={handleImport}
                disabled={isImporting || parsedStudents.length === 0}
              >
                {isImporting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Importing...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Import {parsedStudents.length} Student{parsedStudents.length !== 1 ? "s" : ""}
                  </>
                )}
              </Button>
            </DialogFooter>
          </div>
        )}

        {/* Step 3: Results */}
        {step === "results" && (
          <div className="flex flex-col gap-4 flex-1 min-h-0">
            <div className="flex items-center gap-4">
              {successCount > 0 && (
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <span className="font-medium text-green-600">
                    {successCount} imported successfully
                  </span>
                </div>
              )}
              {errorCount > 0 && (
                <div className="flex items-center gap-2 text-sm">
                  <XCircle className="h-5 w-5 text-destructive" />
                  <span className="font-medium text-destructive">
                    {errorCount} failed
                  </span>
                </div>
              )}
            </div>

            <ScrollArea className="flex-1 rounded-md border max-h-[400px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Message</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {importResults.map((result, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        {result.student.firstName} {result.student.surname}
                      </TableCell>
                      <TableCell>
                        {result.status === "success" ? (
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                            Success
                          </Badge>
                        ) : (
                          <Badge variant="destructive">Failed</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {result.message}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>

            <DialogFooter>
              <Button
                onClick={() => {
                  setOpen(false)
                  resetState()
                }}
              >
                Done
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
