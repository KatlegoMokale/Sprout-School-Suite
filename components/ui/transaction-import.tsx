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

interface ImportResult {
  transaction: ParsedTransaction
  studentId?: string
  studentName?: string
  status: "success" | "error" | "warning"
  message: string
}

const CSV_HEADER_MAP: Record<number, keyof ParsedTransaction> = {
  0: "firstName",        // Student First Name
  1: "surname",          // Student Surname
  2: "className",        // Class (optional)
  3: "amount",           // Amount
  4: "paymentMethod",    // Payment Method
  5: "paymentDate",      // Payment Date
  6: "transactionType",  // Transaction Type
}

export default function TransactionImport({ students }: { students: any[] }) {
  const [isOpen, setIsOpen] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [importResults, setImportResults] = useState<ImportResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const parseCSV = (content: string): ParsedTransaction[] => {
    const lines = content.trim().split("\n")
    const transactions: ParsedTransaction[] = []

    // Skip header row
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i]
      if (!line.trim()) continue

      const columns = line.split(",").map(col => col.trim())
      
      const transaction: ParsedTransaction = {
        firstName: columns[0] || "",
        surname: columns[1] || "",
        className: columns[2] || "",
        amount: parseFloat(columns[3]) || 0,
        paymentMethod: columns[4] || "",
        paymentDate: columns[5] || "",
        transactionType: (columns[6] as any) || "school-fees",
      }

      if (transaction.firstName && transaction.surname && transaction.amount > 0) {
        transactions.push(transaction)
      }
    }

    return transactions
  }

  const matchStudent = (transaction: ParsedTransaction) => {
    const match = students.find(student => 
      student.firstName?.toLowerCase() === transaction.firstName.toLowerCase() &&
      student.surname?.toLowerCase() === transaction.surname.toLowerCase() &&
      (!transaction.className || student.studentClass === transaction.className)
    )
    return match
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleImport = async () => {
    if (!file) return

    setIsLoading(true)
    setUploadProgress(0)

    try {
      const content = await file.text()
      const transactions = parseCSV(content)

      if (transactions.length === 0) {
        toast({
          title: "No Valid Transactions",
          description: "No valid transaction records found in the file.",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      const results: ImportResult[] = []

      for (let i = 0; i < transactions.length; i++) {
        const transaction = transactions[i]
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

        setUploadProgress(((i + 1) / transactions.length) * 100)
      }

      setImportResults(results)

      const successCount = results.filter(r => r.status === "success").length
      const warningCount = results.filter(r => r.status === "warning").length
      const errorCount = results.filter(r => r.status === "error").length

      toast({
        title: "Import Complete",
        description: `Success: ${successCount}, Warnings: ${warningCount}, Errors: ${errorCount}`,
        variant: successCount > 0 ? "default" : "destructive",
      })
    } catch (error) {
      toast({
        title: "Import Error",
        description: error instanceof Error ? error.message : "Failed to parse file",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setFile(null)
    setImportResults([])
    setUploadProgress(0)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const successCount = importResults.filter(r => r.status === "success").length
  const totalCount = importResults.length

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <FileUp className="h-4 w-4" />
          Import Transactions
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Import Transaction Records</DialogTitle>
          <DialogDescription>
            Upload a CSV file with student transactions. Match students by first name and surname.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* File Upload Section */}
          {importResults.length === 0 && (
            <div className="space-y-4">
              <div>
                <label htmlFor="file-input" className="text-sm font-medium">
                  Select CSV File
                </label>
                <div className="mt-2 flex gap-2">
                  <input
                    ref={fileInputRef}
                    id="file-input"
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={handleFileSelect}
                    className="flex-1 text-sm"
                  />
                  <Button
                    onClick={handleImport}
                    disabled={!file || isLoading}
                    className="gap-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Importing...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4" />
                        Import
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Instructions */}
              <Alert className="bg-blue-50 border-blue-200">
                <AlertTriangle className="h-4 w-4 text-blue-600" />
                <AlertTitle className="text-blue-900">CSV Format Required</AlertTitle>
                <AlertDescription className="text-blue-800 text-sm mt-1">
                  Your CSV should have columns: First Name, Surname, Class, Amount, Payment Method, Payment Date, Transaction Type
                </AlertDescription>
              </Alert>
            </div>
          )}

          {/* Progress Section */}
          {isLoading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Importing transactions...</span>
                <span>{Math.round(uploadProgress)}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          )}

          {/* Results Section */}
          {importResults.length > 0 && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">
                    Import Results: {successCount} / {totalCount} successful
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleReset}
                  className="gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Clear
                </Button>
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
                      <TableRow key={idx} className={
                        result.status === "success" ? "bg-green-50" :
                        result.status === "warning" ? "bg-yellow-50" :
                        "bg-red-50"
                      }>
                        <TableCell className="font-medium">
                          {result.studentName || `${result.transaction.firstName} ${result.transaction.surname}`}
                        </TableCell>
                        <TableCell>{result.transaction.amount}</TableCell>
                        <TableCell>{result.transaction.paymentDate}</TableCell>
                        <TableCell>{result.transaction.transactionType}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              result.status === "success" ? "default" :
                              result.status === "warning" ? "secondary" :
                              "destructive"
                            }
                            className="gap-1"
                          >
                            {result.status === "success" && <CheckCircle2 className="h-3 w-3" />}
                            {result.status === "warning" && <AlertTriangle className="h-3 w-3" />}
                            {result.status === "error" && <XCircle className="h-3 w-3" />}
                            {result.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {result.message}
                        </TableCell>
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
