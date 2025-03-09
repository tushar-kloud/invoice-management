import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { Upload, FileText, Check, AlertCircle, Loader2, FileCheck } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "../lib/utils"

export default function ReconcilePO() {
  const [poFile, setPoFile] = useState(null)
  const [invoiceFile, setInvoiceFile] = useState(null)
  const [status, setStatus] = useState("idle")
  const [reconcileResults, setReconcileResults] = useState(null)

  const handlePoFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setPoFile(e.target.files[0])
    }
  }

  const handleInvoiceFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setInvoiceFile(e.target.files[0])
    }
  }

  const handleReconcile = () => {
    if (!poFile || !invoiceFile) return

    setStatus("reconciling")

    // Simulate reconciliation process
    setTimeout(() => {
      setStatus("completed")
      setReconcileResults({
        match: false,
        poNumber: "PO-2025-0042",
        invoiceNumber: "INV-2025-0042",
        poTotal: 2970,
        invoiceTotal: 3120,
        discrepancies: [
          {
            type: "price",
            item: "Support Services",
            poValue: "150.00",
            invoiceValue: "165.00",
            severity: "high",
          },
          {
            type: "quantity",
            item: "Software License",
            poValue: "1",
            invoiceValue: "1",
            severity: "none",
          },
        ],
      })
    }, 3000)
  }

  const renderFileUpload = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Upload Purchase Order</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-muted-foreground/25 rounded-lg bg-muted/50">
            <FileText className="h-10 w-10 text-muted-foreground mb-4" />
            <p className="text-sm text-muted-foreground mb-2">Upload your PO file</p>
            <Input
              type="file"
              id="po-file"
              className="hidden"
              onChange={handlePoFileChange}
              accept=".pdf,.docx,.png,.jpg,.jpeg"
            />
            <Label htmlFor="po-file" asChild>
              <Button variant="outline" size="sm" onClick={() => document.getElementById('po-file').click()}>
                <Upload className="mr-2 h-4 w-4" />
                Select File
              </Button>
            </Label>
          </div>

          {poFile && (
            <div className="mt-4 p-3 bg-muted rounded-lg flex items-center">
              <FileText className="h-5 w-5 mr-2 text-muted-foreground" />
              <span className="text-sm font-medium truncate flex-1">{poFile.name}</span>
              <Badge variant="outline" className="ml-2">
                <Check className="h-3 w-3 mr-1" />
                Ready
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Upload Invoice</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-muted-foreground/25 rounded-lg bg-muted/50">
            <FileCheck className="h-10 w-10 text-muted-foreground mb-4" />
            <p className="text-sm text-muted-foreground mb-2">Upload your invoice file</p>
            <Input
              type="file"
              id="invoice-file"
              className="hidden"
              onChange={handleInvoiceFileChange}
              accept=".pdf,.docx,.png,.jpg,.jpeg"
            />
            <Label htmlFor="invoice-file" asChild>
              <Button variant="outline" size="sm" onClick={() => document.getElementById('invoice-file').click()}>
                <Upload className="mr-2 h-4 w-4" />
                Select File
              </Button>
            </Label>
          </div>

          {invoiceFile && (
            <div className="mt-4 p-3 bg-muted rounded-lg flex items-center">
              <FileCheck className="h-5 w-5 mr-2 text-muted-foreground" />
              <span className="text-sm font-medium truncate flex-1">{invoiceFile.name}</span>
              <Badge variant="outline" className="ml-2">
                <Check className="h-3 w-3 mr-1" />
                Ready
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )

  const renderReconcileButton = () => {
    if (!poFile || !invoiceFile) return null

    return (
      <div className="flex justify-center mt-6">
        <Button size="lg" onClick={handleReconcile} disabled={status !== "idle"} className="px-8">
          {status === "idle" ? (
            <>
              <FileCheck className="mr-2 h-5 w-5" />
              Reconcile Documents
            </>
          ) : status == "completed" ? (
            <>
              <FileCheck className="mr-2 h-5 w-5" />
              Reconciliation Complete
            </>
          ) : (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Processing...
            </>
          )}
        </Button>
      </div>
    )
  }

  const renderProcessingStatus = () => {
    if (status !== "reconciling") return null

    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Loader2 className="mr-2 h-5 w-5 text-primary animate-spin" />
            Reconciling Documents
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Progress value={75} className="h-2" />

            <div className="space-y-2">
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <Check className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Documents uploaded successfully</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <Check className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Extracting data from documents</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center animate-pulse">
                  <Loader2 className="h-4 w-4 text-primary-foreground animate-spin" />
                </div>
                <div>
                  <p className="text-sm font-medium">Comparing line items and totals</p>
                  <p className="text-xs text-muted-foreground">This may take a few moments</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const renderReconcileResults = () => {
    if (status !== "completed" || !reconcileResults) return null

    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Reconciliation Results</span>
            <Badge variant={reconcileResults.match ? "success" : "destructive"}>
              {reconcileResults.match ? "Match" : "Discrepancies Found"}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm font-medium">PO Number</p>
              <p className="text-sm">{reconcileResults.poNumber}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Invoice Number</p>
              <p className="text-sm">{reconcileResults.invoiceNumber}</p>
            </div>
            <div>
              <p className="text-sm font-medium">PO Total</p>
              <p className="text-sm">${reconcileResults.poTotal.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Invoice Total</p>
              <p
                className={cn(
                  "text-sm",
                  reconcileResults.poTotal !== reconcileResults.invoiceTotal && "text-destructive font-medium",
                )}
              >
                ${reconcileResults.invoiceTotal.toFixed(2)}
              </p>
            </div>
          </div>

          <div className="mb-4">
            <h3 className="text-sm font-medium mb-2">Discrepancies</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Item</TableHead>
                  <TableHead>PO Value</TableHead>
                  <TableHead>Invoice Value</TableHead>
                  <TableHead>Severity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reconcileResults.discrepancies.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium capitalize">{item.type}</TableCell>
                    <TableCell>{item.item}</TableCell>
                    <TableCell>{item.poValue}</TableCell>
                    <TableCell className={item.severity !== "none" ? "text-destructive font-medium" : ""}>
                      {item.invoiceValue}
                    </TableCell>
                    <TableCell>
                      {item.severity === "high" && <Badge variant="destructive">High</Badge>}
                      {item.severity === "medium" && <Badge variant="warning">Medium</Badge>}
                      {item.severity === "low" && <Badge variant="outline">Low</Badge>}
                      {item.severity === "none" && <Badge variant="success">None</Badge>}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              <AlertCircle className="inline-block mr-2 h-4 w-4" />
              The AI has detected price discrepancies between the PO and invoice. Please review and take appropriate
              action.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
          <Button variant="outline">Export Report</Button>
          <Button variant="destructive">Flag for Review</Button>
          <Button>Approve with Exceptions</Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {renderFileUpload()}
      {renderReconcileButton()}
      {renderProcessingStatus()}
      {renderReconcileResults()}
    </div>
  )
}