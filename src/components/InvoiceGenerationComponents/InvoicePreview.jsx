import { CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/components/ui/table";
import { AlertCircle } from "lucide-react";
import react, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const InvoiceForm = () => {
  // const [invoiceInfo, setinvoiceInfo] = useState()

  const invoiceGeneration = useSelector((state) => state.invoiceGeneration)
  const { loading, error, invoiceInfo } = invoiceGeneration

  return (
    invoiceInfo && (
      <CardContent>

        {/* General Information */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <Label className="text-xs text-muted-foreground">Invoice Number</Label>
            <Input value={invoiceInfo?.invoice_number || ""} className="mt-1" readOnly />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Invoice Date</Label>
            <Input value={invoiceInfo?.invoice_date || ""} className="mt-1" readOnly />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">PO Number</Label>
            <Input value={invoiceInfo?.po_number || ""} className="mt-1" readOnly />
          </div>
        </div>

        {/* Sold To and Ship To */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Sold To */}
          <div>
            <Label className="text-xs text-muted-foreground">Sold To</Label>
            <div className="mt-1 space-y-1">
              <Input value={invoiceInfo?.sold_to.name || ""} readOnly />
              <Input value={invoiceInfo?.sold_to.address || ""} readOnly />
              <Input value={`GSTIN: ${invoiceInfo?.sold_to?.gstin || ""}`} readOnly />
            </div>
          </div>
          {/* Ship To */}
          <div>
            <Label className="text-xs text-muted-foreground">Ship To</Label>
            <div className="mt-1 space-y-1">
              <Input value={invoiceInfo?.ship_to.name || ""} readOnly />
              <Input value={invoiceInfo?.ship_to.address || ""} readOnly />
            </div>
          </div>
        </div>
        <div>
          <Label className="text-xs text-muted-foreground">Vendor</Label>
          <div className="mt-1 space-y-1">
            <Input value={invoiceInfo?.vendor?.name || ""} readOnly />
            <Input value={invoiceInfo?.vendor?.address || ""} readOnly />
            <Input value={`GSTIN: ${invoiceInfo?.vendor?.gstin || ""}`} readOnly />
            </div>
        </div>

        {/* Line Items */}
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
            {invoiceInfo?.line_items?.map((item, index) => (
              <TableRow key={`${index}${item.hsn_code}`}>
                <TableCell>{item?.description}</TableCell>
                <TableCell className="text-right">{item?.quantity}</TableCell>
                <TableCell className="text-right">₹{item?.unit_rate?.toFixed(2)}</TableCell>
                <TableCell className="text-right">₹{item?.amount?.toFixed(2)}</TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell colSpan={3} className="text-right font-medium">Subtotal</TableCell>
              <TableCell className="text-right">₹{invoiceInfo?.subtotal?.toFixed(2)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={3} className="text-right font-medium">CGST</TableCell>
              <TableCell className="text-right">₹{invoiceInfo?.taxes?.cgst?.toFixed(2)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={3} className="text-right font-medium">SGST</TableCell>
                <TableCell className="text-right">₹{invoiceInfo?.taxes?.sgst?.toFixed(2)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={3} className="text-right font-medium">Total Tax</TableCell>
                <TableCell className="text-right">₹{(invoiceInfo?.taxes?.cgst + invoiceInfo?.taxes?.sgst)?.toFixed(2)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={3} className="text-right font-medium">Total</TableCell>
              <TableCell className="text-right font-bold">₹{invoiceInfo?.total_amount?.toFixed(2)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>

        {/* Amount in Words */}
        <div className="mt-4">
          <Label className="text-xs text-muted-foreground">Amount in Words</Label>
          <Input value={invoiceInfo?.amount_in_words || ""} className="mt-1" readOnly />
        </div>

        {/* Notes */}
        <div className="mt-4">
          <Label className="text-xs text-muted-foreground">Notes</Label>
          <div className="mt-1 space-y-1">
            {invoiceInfo?.notes?.map((note, index) => (
              <Input key={index} value={note} readOnly className="text-sm" />
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">
            <AlertCircle className="inline-block mr-2 h-4 w-4" />
            Please verify all fields before proceeding. Some fields may require manual adjustment.
          </p>
        </div>
      </CardContent>
    )
  );
};

export default InvoiceForm;
