"use client"

import { useState, useRef } from "react"
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
import { toast } from "@/hooks/use-toast"

interface ParsedTransaction {
  firstName: string
  surname: string
  className?: string
  amount: number
  paymentMethod: string
  paymentDate: string
  transactionType: "registration" | "re-registration" | "school-fees"
}

interface ParsedStatusMarker {
  firstName: string
  surname: string
  message: string
}

interface ImportResult {
  transaction: ParsedTransaction
  studentId?: string
  studentName?: string
  status: "success" | "error" | "warning" | "info"
  message: string
}

type Delimiter = ";" | ","

interface ParseCSVOutput {
  transactions: ParsedTransaction[]
  markers: ParsedStatusMarker[]
}

export default function TransactionImport({ students }: { students: any[] }) {
  const [isOpen, setIsOpen] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [delimiter, setDelimiter] = useState<Delimiter>(";")
  const [importResults, setImportResults] = useState<ImportResult[]>([])
  const [pendingTransactions, setPendingTransactions] = useState<ParsedTransaction[]>([])
  const [pendingMarkers, setPendingMarkers] = useState<ParsedStatusMarker[]>([])
  const [mode, setMode] = useState<"idle" | "preview" | "imported">("idle")
  const [isLoading, setIsLoading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const parseCSVLine = (line: string, selectedDelimiter: Delimiter): string[] => {
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
      } else if (char === selectedDelimiter && !inQuotes) {
        result.push(current.trim())
        current = ""
      } else {
        current += char
      }
    }

    result.push(current.trim())
    return result
  }

  const parseAmount = (raw: string): number => {
    const trimmed = raw.trim()
    if (!trimmed) return 0

    const datePattern = /\d{1,4}[\/-]\d{1,2}[\/-]\d{1,4}/
    const dateMatch = trimmed.match(datePattern)

    // In statement cells like "R1200 27/12/25", only parse the amount part before the date.
    const amountPart = dateMatch
      ? trimmed.slice(0, dateMatch.index).trim()
      : trimmed

    const stripped = amountPart
      .replace(/R/gi, "")
      .replace(/\s+/g, "")
      .replace(/[^0-9,.-]/g, "")

    if (!stripped) return 0

    let normalized = stripped
    if (normalized.includes(",") && normalized.includes(".")) {
      normalized = normalized.replace(/,/g, "")
    } else if (normalized.includes(",")) {
      normalized = normalized.replace(/,/g, ".")
    }

    const parts = normalized.split(".")
    if (parts.length > 2) {
      normalized = `${parts.slice(0, -1).join("")}.${parts[parts.length - 1]}`
    }

    const amount = parseFloat(normalized)
    return Number.isFinite(amount) ? amount : 0
  }

  const normalizeDate = (raw: string): string => {
    const value = raw.trim()
    if (!value) return ""

    const separator = value.includes("/") ? "/" : value.includes("-") ? "-" : ""
    if (!separator) return value

    const parts = value.split(separator).map((item) => item.trim())
    if (parts.length !== 3) return value

    const [a, b, c] = parts
    if (a.length === 4) {
      return `${a}-${b.padStart(2, "0")}-${c.padStart(2, "0")}`
    }

    const year = c.length === 2 ? `20${c}` : c
    return `${year}-${b.padStart(2, "0")}-${a.padStart(2, "0")}`
  }

  const parseCellDate = (cell: string): string => {
    const dateMatch = cell.match(/(\d{1,4}[\/-]\d{1,2}[\/-]\d{1,4})/)
    return dateMatch ? normalizeDate(dateMatch[1]) : ""
  }

  const parseCSV = (content: string, selectedDelimiter: Delimiter): ParseCSVOutput => {
    const lines = content.split(/\r?\n/).filter((line) => line.trim() !== "")
    const transactions: ParsedTransaction[] = []
    const markers: ParsedStatusMarker[] = []
    if (lines.length === 0) return { transactions, markers }

    const parsedLines = lines.map((line) => parseCSVLine(line, selectedDelimiter))
    const firstRow = parsedLines[0].map((value) => value.toLowerCase().trim())
    const isStatementHeader = firstRow.includes("surname") && (firstRow.includes("names") || firstRow.includes("name"))
    const hasHeader = firstRow.some((value) =>
      [
        "first name",
        "firstname",
        "surname",
        "names",
        "name",
        "amount",
        "payment",
        "transaction type",
        "reg- fee",
        "reg-fee",
      ].includes(value)
    )

    const dataRows = hasHeader ? parsedLines.slice(1) : parsedLines

    const headerIndex = (labels: string[]) => {
      if (!hasHeader) return -1
      return firstRow.findIndex((header) => labels.includes(header))
    }

    const firstNameIndex = headerIndex(["first name", "firstname"])
    const surnameIndex = headerIndex(["surname", "last name", "lastname"])
    const classIndex = headerIndex(["class", "class name"])
    const amountIndex = headerIndex(["amount"])
    const methodIndex = headerIndex(["payment method", "method"])
    const dateIndex = headerIndex(["payment date", "date"])
    const typeIndex = headerIndex(["transaction type", "type"])

    for (const columns of dataRows) {
      if (!columns.some((value) => value.trim() !== "")) continue

      const looksLikeSimpleLayout =
        (firstNameIndex >= 0 && surnameIndex >= 0 && amountIndex >= 0) || columns.length <= 8

      if (looksLikeSimpleLayout) {
        const firstName = (firstNameIndex >= 0 ? columns[firstNameIndex] : columns[0] || "").trim()
        const surname = (surnameIndex >= 0 ? columns[surnameIndex] : columns[1] || "").trim()
        const className = (classIndex >= 0 ? columns[classIndex] : columns[2] || "").trim()
        const amount = parseAmount(amountIndex >= 0 ? columns[amountIndex] || "" : columns[3] || "")
        const paymentDate = normalizeDate(dateIndex >= 0 ? columns[dateIndex] || "" : columns[5] || "")
        const paymentMethod = (methodIndex >= 0 ? columns[methodIndex] : columns[4] || "").trim() || "CSV Import"
        const rawType = (typeIndex >= 0 ? columns[typeIndex] : columns[6] || "").toLowerCase().trim()

        if (!firstName || !surname || amount <= 0) continue
        if (!paymentDate) {
          markers.push({
            firstName,
            surname,
            message: "Skipped payment row with missing payment date.",
          })
          continue
        }

        transactions.push({
          firstName,
          surname,
          className,
          amount,
          paymentMethod,
          paymentDate,
          transactionType:
            rawType === "registration"
              ? "registration"
              : rawType === "re-registration"
              ? "re-registration"
              : "school-fees",
        })

        continue
      }

      const hasStudentNumber = /^\d+$/.test((columns[0] || "").trim())
      const firstName = (
        hasStudentNumber
          ? columns[isStatementHeader ? 2 : 1]
          : columns[isStatementHeader ? 1 : 0] || ""
      ).trim()
      const surname = (
        hasStudentNumber
          ? columns[isStatementHeader ? 1 : 2]
          : columns[isStatementHeader ? 0 : 1] || ""
      ).trim()
      const paymentStartIndex = hasStudentNumber ? 6 : 5

      if (!firstName || !surname || columns.length <= paymentStartIndex) continue

      const statusCount: Record<string, number> = {}

      for (let i = paymentStartIndex; i < columns.length; i++) {
        const cell = (columns[i] || "").trim()
        if (!cell) continue

        const upper = cell.toUpperCase()

        if (upper.includes("EXEMPTED 1M")) {
          statusCount["EXEMPTED 1M"] = (statusCount["EXEMPTED 1M"] || 0) + 1
          continue
        }
        if (upper.includes("EXEMPTED")) {
          statusCount["EXEMPTED"] = (statusCount["EXEMPTED"] || 0) + 1
          continue
        }
        if (upper.includes("COMPETITION") || upper.includes("COPMPETITION")) {
          statusCount["COMPETITION"] = (statusCount["COMPETITION"] || 0) + 1
          continue
        }
        if (upper.includes("PAID W/YEAR") || upper.includes("PAID W YEAR")) {
          statusCount["PAID W/YEAR"] = (statusCount["PAID W/YEAR"] || 0) + 1
          continue
        }
        if (upper.startsWith("START")) {
          statusCount["START MONTH NOTE"] = (statusCount["START MONTH NOTE"] || 0) + 1
          continue
        }

        const amount = parseAmount(cell)
        if (amount <= 0) continue
        const paymentDate = parseCellDate(cell)

        if (!paymentDate) {
          markers.push({
            firstName,
            surname,
            message: `Skipped amount "${cell}" because payment date was not detected.`,
          })
          continue
        }

        transactions.push({
          firstName,
          surname,
          className: "",
          amount,
          paymentMethod: "CSV Import",
          paymentDate,
          transactionType: "school-fees",
        })
      }

      Object.entries(statusCount).forEach(([status, count]) => {
        markers.push({
          firstName,
          surname,
          message: `Detected ${status} (${count} cell${count > 1 ? "s" : ""}) - no payment transaction created.`,
        })
      })
    }

    return { transactions, markers }
  }

  const matchStudent = (transaction: { firstName: string; surname: string }) => {
    return students.find(
      (student) =>
        student.firstName?.toLowerCase() === transaction.firstName.toLowerCase() &&
        student.surname?.toLowerCase() === transaction.surname.toLowerCase()
    )
  }

  const mapMarkersToResults = (markers: ParsedStatusMarker[]): ImportResult[] => {
    return markers.map((marker) => {
      const matchedStudent = matchStudent(marker)
      return {
        transaction: {
          firstName: marker.firstName,
          surname: marker.surname,
          className: "",
          amount: 0,
          paymentMethod: "CSV Marker",
          paymentDate: "",
          transactionType: "school-fees",
        },
        studentId: matchedStudent?.$id,
        studentName: matchedStudent ? `${matchedStudent.firstName} ${matchedStudent.surname}` : undefined,
        status: "info",
        message: marker.message,
      }
    })
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0])
      setImportResults([])
      setPendingTransactions([])
      setPendingMarkers([])
      setMode("idle")
    }
  }

  const handlePreview = async () => {
    if (!file) return

    setIsLoading(true)
    setUploadProgress(0)

    try {
      const content = await file.text()
      const { transactions, markers } = parseCSV(content, delimiter)

      if (transactions.length === 0 && markers.length === 0) {
        toast({
          title: "No Preview Records",
          description: "No valid payment rows or status markers were found in the file.",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      const results: ImportResult[] = [...mapMarkersToResults(markers)]
      for (let i = 0; i < transactions.length; i++) {
        const transaction = transactions[i]
        const matchedStudent = matchStudent(transaction)

        if (matchedStudent) {
          results.push({
            transaction,
            studentId: matchedStudent.$id,
            studentName: `${matchedStudent.firstName} ${matchedStudent.surname}`,
            status: "success",
            message: "Ready to import",
          })
        } else {
          results.push({
            transaction,
            status: "warning",
            message: `No student found matching "${transaction.firstName} ${transaction.surname}"`,
          })
        }

        setUploadProgress(((i + 1) / transactions.length) * 100)
      }

      setPendingTransactions(transactions)
      setPendingMarkers(markers)
      setImportResults(results)
      setMode("preview")

      const readyCount = results.filter((result) => result.status === "success").length
      const warningCount = results.filter((result) => result.status === "warning" || result.status === "error").length
      toast({
        title: "Preview Ready",
        description: `Ready: ${readyCount}, Issues: ${warningCount}. Review and confirm import.`,
      })
    } catch (error) {
      toast({
        title: "Preview Error",
        description: error instanceof Error ? error.message : "Failed to parse file",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleImport = async () => {
    if (pendingTransactions.length === 0 && pendingMarkers.length === 0) {
      toast({
        title: "Run Preview First",
        description: "Preview the file before confirming import.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    setUploadProgress(0)

    try {
      const results: ImportResult[] = [...mapMarkersToResults(pendingMarkers)]

      for (let i = 0; i < pendingTransactions.length; i++) {
        const transaction = pendingTransactions[i]
        const matchedStudent = matchStudent(transaction)

        if (matchedStudent) {
          try {
            const response = await fetch("/api/fee-transactions", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                studentId: matchedStudent.$id,
                amount: transaction.amount,
                paymentMethod: transaction.paymentMethod,
                paymentDate: transaction.paymentDate,
                feeType: transaction.transactionType,
              }),
            })

            if (response.ok) {
              results.push({
                transaction,
                studentId: matchedStudent.$id,
                studentName: `${matchedStudent.firstName} ${matchedStudent.surname}`,
                status: "success",
                message: "Transaction created successfully",
              })
            } else {
              results.push({
                transaction,
                status: "error",
                message: "Failed to create transaction",
              })
            }
          } catch (error) {
            results.push({
              transaction,
              status: "error",
              message: `Error creating transaction: ${error instanceof Error ? error.message : "Unknown error"}`,
            })
          }
        } else {
          results.push({
            transaction,
            status: "warning",
            message: `No student found matching "${transaction.firstName} ${transaction.surname}"`,
          })
        }

        setUploadProgress(((i + 1) / pendingTransactions.length) * 100)
      }

      setImportResults(results)
      setMode("imported")

      const successCount = results.filter((result) => result.status === "success").length
      const warningCount = results.filter((result) => result.status === "warning").length
      const infoCount = results.filter((result) => result.status === "info").length
      const errorCount = results.filter((result) => result.status === "error").length

      toast({
        title: "Import Complete",
        description: `Success: ${successCount}, Warnings: ${warningCount}, Info: ${infoCount}, Errors: ${errorCount}`,
        variant: successCount > 0 ? "default" : "destructive",
      })
    } catch (error) {
      toast({
        title: "Import Error",
        description: error instanceof Error ? error.message : "Failed to import",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setFile(null)
    setImportResults([])
    setPendingTransactions([])
    setPendingMarkers([])
    setMode("idle")
    setUploadProgress(0)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const successCount = importResults.filter((result) => result.status === "success").length
  const infoCount = importResults.filter((result) => result.status === "info").length
  const issueCount = importResults.filter((result) => result.status === "warning" || result.status === "error").length
  const totalCount = importResults.length
  const readyToImportCount =
    mode === "preview"
      ? pendingTransactions.filter((transaction) => Boolean(matchStudent(transaction))).length
      : 0

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <FileUp className="h-4 w-4" />
          Import Transactions
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[92vw] min-w-0 max-w-3xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Import Transaction Records</DialogTitle>
          <DialogDescription>
            Upload a CSV file and choose the delimiter. Students are matched by first name and surname.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {importResults.length === 0 && (
            <div className="space-y-4">
              <div>
                <label htmlFor="file-input" className="text-sm font-medium">
                  Select CSV File
                </label>
                <div className="mt-2 grid grid-cols-1 md:grid-cols-[180px_1fr_auto] gap-2">
                  <select
                    value={delimiter}
                    onChange={(e) => setDelimiter(e.target.value as Delimiter)}
                    className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                    disabled={isLoading}
                  >
                    <option value=";">Delimiter: ;</option>
                    <option value=",">Delimiter: ,</option>
                  </select>
                  <input
                    ref={fileInputRef}
                    id="file-input"
                    type="file"
                    accept=".csv,.txt"
                    onChange={handleFileSelect}
                    className="flex-1 text-sm"
                  />
                  <Button onClick={handlePreview} disabled={!file || isLoading} className="gap-2">
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Previewing...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4" />
                        Preview
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <Alert className="bg-blue-50 border-blue-200">
                <AlertTriangle className="h-4 w-4 text-blue-600" />
                <AlertTitle className="text-blue-900">Supported CSV Patterns</AlertTitle>
                <AlertDescription className="text-blue-800 text-sm mt-1">
                  Supports both:
                  1) Simple columns (First Name, Surname, Amount, Payment Date, etc.)
                  2) Monthly statement rows (with payment cells like `R1200 03/01/26`).
                  Special markers `EXEMPTED`, `EXEMPTED 1M`, `COMPETITION`, and `PAID W/YEAR` are detected and logged as warnings (no payment transaction is created from marker-only cells).
                </AlertDescription>
              </Alert>
            </div>
          )}

          {isLoading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{mode === "preview" ? "Importing transactions..." : "Preparing preview..."}</span>
                <span>{Math.round(uploadProgress)}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          )}

          {importResults.length > 0 && (
            <div className="space-y-4">
              {mode === "preview" && (
                <Alert className="bg-amber-50 border-amber-200">
                  <AlertTriangle className="h-4 w-4 text-amber-700" />
                  <AlertTitle className="text-amber-900">Dry Run Preview</AlertTitle>
                  <AlertDescription className="text-amber-800 text-sm mt-1">
                    No transactions have been saved yet. Review the rows below, then click Confirm Import.
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">
                    {mode === "preview"
                      ? `Preview Results: ${readyToImportCount} ready, ${issueCount} issue(s), ${infoCount} info`
                      : `Import Results: ${successCount} / ${totalCount} successful (${issueCount} issues, ${infoCount} info)`}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {mode === "preview" && (
                    <Button
                      size="sm"
                      onClick={handleImport}
                      disabled={isLoading || readyToImportCount === 0}
                      className="gap-2"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Importing...
                        </>
                      ) : (
                        "Confirm Import"
                      )}
                    </Button>
                  )}
                  <Button variant="outline" size="sm" onClick={handleReset} className="gap-2">
                    <Trash2 className="h-4 w-4" />
                    Clear
                  </Button>
                </div>
              </div>

              <ScrollArea className="h-[400px] border rounded-lg p-4">
                <Table className="text-xs">
                  <TableHeader className="sticky top-0 bg-white">
                    <TableRow>
                      <TableHead>Student Name</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Payment Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Message</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {importResults.map((result, idx) => (
                      <TableRow
                        key={idx}
                        className={
                          result.status === "success"
                            ? "bg-green-50"
                            : result.status === "warning"
                            ? "bg-yellow-50"
                            : result.status === "info"
                            ? "bg-slate-50"
                            : "bg-red-50"
                        }
                      >
                        <TableCell className="font-medium">
                          {result.studentName || `${result.transaction.firstName} ${result.transaction.surname}`}
                        </TableCell>
                        <TableCell>{result.transaction.amount > 0 ? result.transaction.amount : "-"}</TableCell>
                        <TableCell>{result.transaction.paymentDate || "-"}</TableCell>
                        <TableCell>{result.transaction.transactionType}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              result.status === "success"
                                ? "default"
                                : result.status === "warning" || result.status === "info"
                                ? "secondary"
                                : "destructive"
                            }
                            className="gap-1"
                          >
                            {result.status === "success" && <CheckCircle2 className="h-3 w-3" />}
                            {result.status === "warning" && <AlertTriangle className="h-3 w-3" />}
                            {result.status === "info" && <AlertTriangle className="h-3 w-3" />}
                            {result.status === "error" && <XCircle className="h-3 w-3" />}
                            {result.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{result.message}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
