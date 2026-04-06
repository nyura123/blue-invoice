import { useState, useRef } from "react";
import { TEMPLATES } from "../utils";
import type { InvoiceForm as InvoiceFormType, Template } from "../utils";
import { PDFActions } from "./PDFActions";
import { InvoiceTemplatePreview } from "./InvoiceTemplatePreview";
import { InvoiceForm } from "./InvoiceForm";

export type SetFn = (
  key: keyof InvoiceFormType
) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;

interface InvoiceGeneratorProps {
  form: InvoiceFormType;
  set: SetFn;
  handleOpenPDF: (html: string) => void;
  handleDownload: (html: string) => void;
  toast: string;
  appName: string;
  onSaveData: () => void;
  onRestoreSavedData: () => void;
}

export function InvoiceGenerator({
  form,
  set,
  handleOpenPDF,
  handleDownload,
  toast,
  appName,
  onSaveData,
  onRestoreSavedData,
}: InvoiceGeneratorProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<Template>(
    TEMPLATES[0]
  );

  const filledHtmlRef = useRef<string>("");

  return (
    <div className="shell">
      <div className="header">
        <h1>{appName}</h1>
        <p>Local-only — nothing leaves your device</p>
      </div>

      <div className="columns">
        {/* ── Form ── */}
        <InvoiceForm
          form={form}
          set={set}
          onSaveData={onSaveData}
          onRestoreSavedData={onRestoreSavedData}
        />

        {/* ── Preview ── */}
        <div className="preview-wrap">
          <div className="panel">
            <div className="panel-title">
              Invoice Preview
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <PDFActions
                  handleOpenPDF={() => handleOpenPDF(filledHtmlRef.current)}
                  handleDownload={() => handleDownload(filledHtmlRef.current)}
                />
                <div className="field" style={{ marginBottom: 0 }}>
                  <select
                    id="templateSelect"
                    name="templateSelect"
                    autoComplete="off"
                    value={selectedTemplate?.id ?? ""}
                    onChange={(e) =>
                      setSelectedTemplate(
                        TEMPLATES.find((t) => t.id === e.target.value) ??
                          TEMPLATES[0]
                      )
                    }
                  >
                    {TEMPLATES.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <InvoiceTemplatePreview
              form={form}
              filledHtmlRef={filledHtmlRef}
              templatePath={selectedTemplate?.path ?? ""}
            />
          </div>
        </div>
      </div>
      {/* Toast */}
      <div className={`toast ${toast ? "show" : ""}`}>{toast}</div>
    </div>
  );
}
