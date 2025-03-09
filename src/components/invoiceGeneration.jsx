import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Upload, FileText, Check, AlertCircle, Loader2 } from "lucide-react";

export default function InvoiceGeneration() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("idle");
  const [progress, setProgress] = useState(0);
  const [invoiceData, setInvoiceData] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setStatus("idle");
    }
  };

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

  const handleUpload = () => {
    if (!file) return;

    setStatus("uploading");
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setStatus("analyzing");
          simulateAnalysis();
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const simulateAnalysis = () => {
    setTimeout(() => {
      setStatus("completed");
      setInvoiceData({
        invoiceDate: "2025-03-09",
        invoiceNumber: "INV-2025-0042",
        poNumber: "PO-2025-0042",
        vendor: "Acme Corp",
        subtotal: 2700,
        tax: 270,
        total: 2970,
      });
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Upload Purchase Order</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <FileText className="h-10 w-10 text-muted-foreground mb-4" />
            <p className="text-sm text-gray-500 mb-2">Drag and drop your PO file, or click to browse</p>
            <Input type="file" className="hidden" onChange={handleFileChange} accept=".pdf,.docx,.png,.jpg,.jpeg" />
            <Label asChild>
              <Button variant="outline" onClick={() => document.querySelector('input[type=file]').click()}>
                <Upload className="mr-2 h-4 w-4" /> Select File
              </Button>
            </Label>
          </div>

          {file && (
            <div className="mt-4 p-3 bg-gray-100 rounded-lg flex items-center justify-between">
              <span className="text-sm font-medium truncate max-w-[200px]">{file.name}</span>
              <Button onClick={handleUpload} disabled={status !== "idle"} size="sm">
                {status === "idle" ? "Process" : status == "completed" ? "Analyzed" : "Processing..."}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {status === "uploading" && (
        <Card>
          <CardContent className="flex flex-col items-center space-y-2">
            <Progress value={progress} className="h-2 w-full" />
            <p className="text-sm text-gray-500">{progress}% uploaded</p>
          </CardContent>
        </Card>
      )}

      {status === "analyzing" && (
        <Card>
          <CardContent className="flex items-center space-x-4">
            <Loader2 className="h-5 w-5 text-primary animate-spin" />
            <p className="text-sm text-gray-600">Analyzing document...</p>
          </CardContent>
        </Card>
      )}

      {status === "completed" && invoiceData && (
        <Card>
          <CardHeader>
            <CardTitle>Invoice Details</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableBody>
                {Object.entries(invoiceData).map(([key, value], index) => (
                  <TableRow key={index}>
                    <TableHead className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</TableHead>
                    <TableCell>
                      {key === "invoiceNumber" || key === "poNumber" || key === "vendor" ? (
                        <Input defaultValue={value} disabled />
                      ) : (
                        <Input defaultValue={value} />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            <Button variant="outline">Edit Invoice</Button>
            <Button>Generate Final Invoice</Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}