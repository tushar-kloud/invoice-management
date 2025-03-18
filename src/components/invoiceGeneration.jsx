// import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { Upload, FileText, Check, AlertCircle, Loader2 } from "lucide-react"
import { generateInvoiceAPI } from "../apis/generateInvoice"

// type ProcessingStatus = "idle" | "uploading" | "analyzing" | "completed" | "error"

export default function InvoiceGeneration() {
  const [file, setFile] = useState(null)
  const [status, setStatus] = useState("idle")
  const [progress, setProgress] = useState(0)
  const [invoiceData, setInvoiceData] = useState(null)

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleUpload = () => {
    if (!file) return

    setStatus("uploading")
    setProgress(0)

    // Simulate upload progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setStatus("analyzing")
          simulateAnalysis()
          return 100
        }
        return prev + 10
      })
    }, 300)
  }

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setStatus("idle");
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const simulateAnalysis = () => {
    // Simulate AI analyzing the document
    setTimeout(() => {
      setStatus("completed")
      setInvoiceData({
        invoiceDate: "2025-03-09",
        invoiceNumber: "INV-2025-0042",
        poNumber: "PO-2025-0042",
        items: [
          { description: "Software License", quantity: 1, unitPrice: 1200, total: 1200 },
          { description: "Support Services", quantity: 10, unitPrice: 150, total: 1500 },
        ],
        subtotal: 2700,
        tax: 270,
        total: 2970,
      })
    }, 2000)
  }

  useEffect(()=>{
    generateInvoiceAPI()
  },[])

  const renderUploadSection = () => (
    <Card>
      <CardHeader>
        <CardTitle>Upload Purchase Order</CardTitle>
      </CardHeader>
      <CardContent
      // onDrag={(e)=>(document.querySelector('input[type=file]').click())}
      >
        <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-muted-foreground/25 rounded-lg bg-muted/50"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <FileText className="h-10 w-10 text-muted-foreground mb-4" />
          <p className="text-sm text-muted-foreground mb-2">Drag and drop your PO file, or click to browse</p>
          <p className="text-xs text-muted-foreground mb-4">Supports PDF, DOCX, and image files</p>
          <Input
            type="file"
            id="po-file"
            className="hidden"
            onChange={handleFileChange}
            accept=".pdf,.docx,.png,.jpg,.jpeg"
          />
          <Label htmlFor="po-file" asChild>
            <Button variant="outline" onClick={() => document.querySelector('input[type=file]').click()}>
              <Upload className="mr-2 h-4 w-4" />
              Select File
            </Button>
          </Label>
        </div>

        {file && (
          <div className="mt-4 p-3 bg-muted rounded-lg flex items-center justify-between">
            <div className="flex items-center">
              <FileText className="h-5 w-5 mr-2 text-muted-foreground" />
              <span className="text-sm font-medium truncate max-w-[200px]">{file.name}</span>
            </div>
            <Button onClick={handleUpload} disabled={status !== "idle"} size="sm">
              {status === "idle" ? "Process" : status == "completed" ? "Analyzed" : "Processing..."}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )

  const renderProcessingStatus = () => {
    if (status === "idle") return null

    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            {status === "uploading" && (
              <>
                <Upload className="mr-2 h-5 w-5 text-muted-foreground" />
                Uploading Document
              </>
            )}
            {status === "analyzing" && (
              <>
                <Loader2 className="mr-2 h-5 w-5 text-primary animate-spin" />
                Analyzing Document
              </>
            )}
            {status === "completed" && (
              <>
                <Check className="mr-2 h-5 w-5 text-green-500" />
                Analysis Complete
              </>
            )}
            {status === "error" && (
              <>
                <AlertCircle className="mr-2 h-5 w-5 text-destructive" />
                Error Processing Document
              </>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {status === "uploading" && (
            <div className="space-y-2">
              <Progress value={progress} className="h-2" />
              <p className="text-sm text-muted-foreground text-center">{progress}% uploaded</p>
            </div>
          )}

          {status === "analyzing" && (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <Check className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Document uploaded successfully</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center animate-pulse">
                  <Loader2 className="h-4 w-4 text-primary-foreground animate-spin" />
                </div>
                <div>
                  <p className="text-sm font-medium">Extracting data from document</p>
                  <p className="text-xs text-muted-foreground">This may take a few moments</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  const renderInvoicePreview = () => {
    if (status !== "completed" || !invoiceData) return null

    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Invoice Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <Label className="text-xs text-muted-foreground">Invoice Date</Label>
              <Input value={invoiceData.invoiceDate} className="mt-1" />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Invoice Number</Label>
              <Input value={invoiceData.invoiceNumber} className="mt-1" />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">PO Number</Label>
              <Input value={invoiceData.poNumber} className="mt-1" />
            </div>
          </div>

          <Label className="text-xs text-muted-foreground mb-2 block">Line Items</Label>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Qty</TableHead>
                <TableHead className="text-right">Unit Price</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoiceData.items.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.description}</TableCell>
                  <TableCell className="text-right">{item.quantity}</TableCell>
                  <TableCell className="text-right">${item.unitPrice.toFixed(2)}</TableCell>
                  <TableCell className="text-right">${item.total.toFixed(2)}</TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={3} className="text-right font-medium">
                  Subtotal
                </TableCell>
                <TableCell className="text-right">${invoiceData.subtotal.toFixed(2)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={3} className="text-right font-medium">
                  Tax (10%)
                </TableCell>
                <TableCell className="text-right">${invoiceData.tax.toFixed(2)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={3} className="text-right font-medium">
                  Total
                </TableCell>
                <TableCell className="text-right font-bold">${invoiceData.total.toFixed(2)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <div className="mt-4 p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              <AlertCircle className="inline-block mr-2 h-4 w-4" />
              Please verify all fields before proceeding. Some fields may require manual adjustment.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
          <Button variant="outline">Edit Invoice</Button>
          <Button>Generate Final Invoice</Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {renderUploadSection()}
      {renderProcessingStatus()}
      {renderInvoicePreview()}
    </div>
  )
}

