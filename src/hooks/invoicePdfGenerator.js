// hooks/useGenerateInvoicePDF.js
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";
// import robotoFont from "./Roboto-Regular-normal.js";

const useGenerateInvoicePDF = (invoiceData) => {
  const generatePDF = () => {
    const doc = new jsPDF();

    // Header
    doc.setFont("helvetica", "bold");
    // Load the custom font
    // doc.addFileToVFS("Roboto-Regular.ttf", robotoFont);
    // doc.addFont("Roboto-Regular.ttf", "Roboto", "normal"); 
    // doc.setFont("Roboto"); 
    // doc.addFont("NotoSans-Regular.ttf", "NotoSans", "normal");
    doc.setFont("NotoSans", "normal");
    
    doc.setFontSize(14);
    doc.text("TAX INVOICE", 105, 15, { align: "center" });

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Invoice No: ${invoiceData.invoice_number}`, 14, 30);
    doc.text(
      `Invoice Date: ${format(
        new Date(invoiceData.invoice_date),
        "dd-MMM-yyyy"
      )}`,
      14,
      35
    );
    doc.text(`PO Number: ${invoiceData.po_number || "N/A"}`, 14, 40);

    // Vendor Details (Right-Aligned)
    const vendorInfoX = 196;
    doc.text("BILLED BY:", vendorInfoX, 30, { align: "right" });
    doc.text(`${invoiceData.vendor.name}`, vendorInfoX, 35, { align: "right" });
    doc.text(`${invoiceData.vendor.address}`, vendorInfoX, 40, {
      align: "right",
    });
    doc.text(`GSTIN: ${invoiceData.vendor.gstin}`, vendorInfoX, 45, {
      align: "right",
    });

    // Client Billing Address
    doc.setFont("helvetica", "bold");
    doc.text("Name of Client and Billing Address:", 14, 55);

    doc.setFont("helvetica", "normal");
    doc.text(`${invoiceData.sold_to.name}`, 14, 60);
    doc.text(`${invoiceData.sold_to.address}`, 14, 65);
    doc.text(`GSTIN: ${invoiceData.sold_to.gstin}`, 14, 70);

    // Table Columns & Rows
    const tableColumns = [
      { header: "Description", dataKey: "description" },
      { header: "Quantity", dataKey: "quantity" },
      { header: "Rate", dataKey: "unit_rate" },
      { header: "Base Amount", dataKey: "amount" },
      // { header: "Tax Type", dataKey: "tax_type" },
      // { header: "Tax Rate (%)", dataKey: "tax_rate" },
      // { header: "Tax Amount (₹)", dataKey: "tax_amount" },
      // { header: "Total Amount (₹)", dataKey: "total_amount" }
    ];

    const tableRows = invoiceData.line_items.map((item) => ({
      description: item.description,
      quantity: item.quantity,
      unit_rate: item.unit_rate.toFixed(2),
      amount: item.amount.toFixed(2),
      // tax_type: item.tax_type,
      // tax_rate: item.tax_rate.toFixed(2),
      // tax_amount: item.tax_amount.toFixed(2),
      // total_amount: item.total_amount.toFixed(2),
    }));

    // Generate Table
    autoTable(doc, {
      head: [tableColumns.map((col) => col.header)],
      body: tableRows.map((row) => tableColumns.map((col) => row[col.dataKey])),
      startY: 80,
      theme: "grid",
      headStyles: { fillColor: [66, 66, 66], textColor: [255, 255, 255] },
    });

    // Get final Y position for next section
    const finalY = doc.lastAutoTable.finalY || 150;

    // Tax Summary
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("Subtotal:", 150, finalY + 10, { align: "right" });
    

    // '₹'
    doc.text(`INR. ${invoiceData.subtotal.toFixed(2)}`, 196, finalY + 10, {
      align: "right",
    });

    doc.text("CGST:", 150, finalY + 15, { align: "right" });
    doc.text(`INR. ${invoiceData.taxes.cgst.toFixed(2)}`, 196, finalY + 15, {
      align: "right",
    });

    doc.text("SGST:", 150, finalY + 20, { align: "right" });
    doc.text(`INR. ${invoiceData.taxes.sgst.toFixed(2)}`, 196, finalY + 20, {
      align: "right",
    });

    doc.text("Total Tax:", 150, finalY + 25, { align: "right" });
    doc.text(
      `INR. ${(invoiceData.taxes.cgst + invoiceData.taxes.sgst).toFixed(2)}`,
      196,
      finalY + 25,
      { align: "right" }
    );

    doc.setFont("helvetica", "bold");
    doc.text("Total Amount:", 150, finalY + 30, { align: "right" });
    doc.text(`INR. ${invoiceData.total_amount.toFixed(2)}`, 196, finalY + 30, {
      align: "right",
    });

    // Amount in Words
    doc.setFont("helvetica", "bold");
    doc.text("Amount in Words:", 14, finalY + 45);
    doc.setFont("helvetica", "normal");
    doc.text(invoiceData.amount_in_words, 50, finalY + 45);

    // Notes Section
    doc.setFont("helvetica", "bold");
    doc.text("Notes:", 14, finalY + 55);
    doc.setFont("helvetica", "normal");

    let noteY = finalY + 60;
    const maxWidth = 180; // Set a reasonable width to ensure wrapping

    invoiceData.notes.forEach((note) => {
      const wrappedText = doc.splitTextToSize(`• ${note}`, maxWidth);
      doc.text(wrappedText, 14, noteY);
      noteY += wrappedText.length * 5; // Adjust spacing dynamically
    });

    // Bank Details
    // doc.setFont("helvetica", "bold");
    // doc.text("Remittance Information:", 14, noteY + 10);
    // doc.setFont("helvetica", "normal");
    // doc.text(`Account Holder: ${invoiceData.vendor.name}`, 14, noteY + 15);
    // doc.text(`Bank Account Number: ${invoiceData.vendor.bank_account}`, 14, noteY + 20);
    // doc.text(`IFSC Code: ${invoiceData.vendor.ifsc}`, 14, noteY + 25);
    // doc.text(`Bank Name: ${invoiceData.vendor.bank_name}`, 14, noteY + 30);

    // Footer & Signatures
    const pageHeight = doc.internal.pageSize.height;
    doc.setFontSize(8);
    doc.text("Thank you for your business!", 105, pageHeight - 20, {
      align: "center",
    });

    doc.line(14, pageHeight - 40, 60, pageHeight - 40);
    doc.line(150, pageHeight - 40, 196, pageHeight - 40);
    doc.text("Authorized Signatory", 37, pageHeight - 35, { align: "center" });
    doc.text("Customer Signature", 173, pageHeight - 35, { align: "center" });

    doc.save(`Invoice_${invoiceData.invoice_number}.pdf`);
  };

  return generatePDF;
};

export default useGenerateInvoicePDF;
