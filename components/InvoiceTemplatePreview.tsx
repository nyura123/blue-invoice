import { useState, useEffect, useMemo, RefObject } from "react";
import { formatDate, InvoiceForm } from "../utils";

interface InvoiceTemplatePreviewProps {
  form: InvoiceForm;
  filledHtmlRef: RefObject<string>;
  templatePath: string;
}

export const calcFilledHtml = (
  form: InvoiceForm,
  templateHtml: string
): string => {
  if (!templateHtml) return ""; // if template HTML isn't loaded yet, return empty string to avoid errors
  const days = form.days ? parseFloat(form.days) : 0;
  const hours = form.hours ? parseFloat(form.hours) : days * 8;
  const hourly = form.hourlyRate ? parseFloat(form.hourlyRate) : 0;
  const amount = hours * hourly;
  const dueDate = form.invoiceDate
    ? formatDate(
      new Date(
        new Date(form.invoiceDate).getTime() + 30 * 24 * 60 * 60 * 1000
      ).toISOString()
    )
    : "";
  const fromTo = `${form.dateFrom || "—"} to ${form.dateTo || "—"} (${days} days)`;

  const result = templateHtml
    .replace(/{SENDER_NAME}/g, form.senderName || "")
    .replace(/{SENDER_ADDRESS}/g, form.senderAddress || "")
    .replace(/{SENDER_CITY_STATE_ZIP}/g, form.senderCityStateZip || "")
    .replace(/{SENDER_EMAIL}/g, form.senderEmail || "")
    .replace(/{SENDER_PHONE}/g, form.senderPhone || "")
    .replace(/{CLIENT_NAME}/g, form.toName || "Client")
    .replace(/{INVOICE_NO}/g, form.invoiceNumber || "")
    .replace(/{INVOICE_DATE}/g, formatDate(form.invoiceDate))
    .replace(/{DUE_DATE}/g, dueDate)
    .replace(/{DESCRIPTION}/g, form.description)
    .replace(/{DATE_FROM}/g, form.dateFrom || "")
    .replace(/{DATE_TO}/g, form.dateTo || "")
    .replace(/{FROM_TO}/g, fromTo)
    .replace(/{DAYS}/g, String(days))
    .replace(/{HOURS}/g, String(hours))
    .replace(
      /{HOURLY_RATE}/g,
      hourly.toLocaleString("en-US", { style: "currency", currency: "USD" })
    )
    .replace(
      /{AMOUNT}/g,
      amount.toLocaleString("en-US", { style: "currency", currency: "USD" })
    );
  return result;
};

export function InvoiceTemplatePreview({
  form,
  filledHtmlRef,
  templatePath,
}: InvoiceTemplatePreviewProps) {
  const [templateHtml, setTemplateHtml] = useState("");

  // throttle form updates to avoid excessive recalculations of filled HTML while user is typing
  const [throttledForm, setThrottledForm] = useState(form);
  useEffect(() => {
    const handler = setTimeout(() => setThrottledForm(form), 200);
    return () => clearTimeout(handler);
  }, [form]);

  // reload template whenever templatePath changes
  useEffect(() => {
    if (!templatePath) {
      console.error("No template path provided to InvoiceTemplatePreview");
      return;
    }
    setTemplateHtml(""); // clear while loading
    const initializeTemplate = async () => {
      try {
        const res = await fetch(templatePath);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const html = await res.text();

        // side-effect: store the loaded template HTML in state
        // console.log("Invoice template loaded successfully");
        setTemplateHtml(html);
      } catch (err) {
        console.error("Error loading invoice template:", err);
        alert(
          "Failed to load invoice template. Please try refreshing the page."
        );
      }
    };

    initializeTemplate();
  }, [templatePath]);

  // calculate filled HTML whenever form or templateHtml changes.
  // We use useMemo here to avoid unnecessary recalculations on every render,
  // since calcFilledHtml can be a bit expensive.
  const filled = useMemo(
    () => calcFilledHtml(throttledForm, templateHtml),
    [throttledForm, templateHtml]
  );

  // whenever we get a new filled HTML, update the ref so parent component can access it for PDF generation
  useEffect(() => {
    if (filledHtmlRef) {
      // console.log("Updating filled HTML ref with new content");
      filledHtmlRef.current = filled;
    } else {
      console.warn(
        "filledHtmlRef is not defined, cannot update with filled HTML"
      );
    }
  }, [filledHtmlRef, filled]);

  return filled ? (
    <iframe
      id="invoice-preview-frame"
      srcDoc={filled}
      style={{ width: "100%", height: "800px", border: "none" }}
      title="Invoice Preview"
    />
  ) : (
    "Loading..."
  );
}
