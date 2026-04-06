import { SetFn } from "../utils";
import type { InvoiceForm as InvoiceFormType } from "../utils";

export const SaveFormDataActions = ({
  onSaveData,
  onRestoreSavedData,
}: {
  onSaveData: () => void;
  onRestoreSavedData: () => void;
}) => {
  return (
    <div className="actions">
      <button className="btn btn-secondary btn-sm" onClick={onSaveData}>
        Save data
      </button>
      <button className="btn btn-secondary btn-sm" onClick={onRestoreSavedData}>
        Restore saved data
      </button>
    </div>
  );
};

export interface InvoiceFormProps {
  form: InvoiceFormType;
  set: SetFn;
  onSaveData: () => void;
  onRestoreSavedData: () => void;
}

export const InvoiceForm = ({
  form,
  set,
  onSaveData,
  onRestoreSavedData,
}: InvoiceFormProps) => {
  return (
    <div>
      <div className="panel">
        <div className="panel-title">
          Invoice Details
          <SaveFormDataActions
            onSaveData={onSaveData}
            onRestoreSavedData={onRestoreSavedData}
          />
        </div>

        <div className="field">
          <label htmlFor="senderName">Sender Name</label>
          <input
            id="senderName"
            name="senderName"
            autoComplete="off"
            type="text"
            value={form.senderName}
            onChange={set("senderName")}
          />
        </div>
        <div className="field">
          <label htmlFor="senderAddress">Sender Address</label>
          <input
            id="senderAddress"
            name="senderAddress"
            autoComplete="off"
            type="text"
            value={form.senderAddress}
            onChange={set("senderAddress")}
          />
        </div>
        <div className="field">
          <label htmlFor="senderCityStateZip">Sender City, State, ZIP</label>
          <input
            id="senderCityStateZip"
            name="senderCityStateZip"
            autoComplete="off"
            type="text"
            value={form.senderCityStateZip}
            onChange={set("senderCityStateZip")}
          />
        </div>

        <div className="row-2">
          <div className="field">
            <label htmlFor="senderEmail">Sender Email</label>
            <input
              id="senderEmail"
              name="senderEmail"
              type="email"
              autoComplete="off"
              value={form.senderEmail}
              onChange={set("senderEmail")}
            />
          </div>
          <div className="field">
            <label htmlFor="senderPhone">Sender Phone</label>
            <input
              id="senderPhone"
              name="senderPhone"
              type="tel"
              autoComplete="off"
              value={form.senderPhone}
              onChange={set("senderPhone")}
            />
          </div>
        </div>

        <div className="field">
          <label htmlFor="invoiceNumber">Invoice Number</label>
          <input
            id="invoiceNumber"
            name="invoiceNumber"
            autoComplete="off"
            placeholder="INV-001"
            value={form.invoiceNumber}
            onChange={set("invoiceNumber")}
          />
        </div>

        <div className="field">
          <label htmlFor="invoiceDate">Invoice Date</label>
          <input
            id="invoiceDate"
            name="invoiceDate"
            type="date"
            autoComplete="off"
            value={form.invoiceDate}
            onChange={set("invoiceDate")}
          />
        </div>

        <div className="row-2">
          <div className="field">
            <label htmlFor="dateFrom">Date From</label>
            <input
              id="dateFrom"
              name="dateFrom"
              type="date"
              autoComplete="off"
              value={form.dateFrom}
              onChange={set("dateFrom")}
            />
          </div>
          <div className="field">
            <label htmlFor="dateTo">Date To</label>
            <input
              id="dateTo"
              name="dateTo"
              autoComplete="off"
              type="date"
              value={form.dateTo}
              onChange={set("dateTo")}
            />
          </div>
        </div>

        <div className="row-2">
          <div className="field">
            <label htmlFor="days">Days Worked</label>
            <input
              id="days"
              name="days"
              autoComplete="off"
              type="number"
              placeholder="10"
              min="0"
              value={form.days}
              onChange={set("days")}
            />
          </div>
          <div className="field">
            <label htmlFor="hours">Hours Worked</label>
            <input
              id="hours"
              name="hours"
              autoComplete="off"
              type="number"
              placeholder="80"
              min="0"
              value={form.hours}
              onChange={set("hours")}
            />
          </div>
        </div>

        <div className="field">
          <label htmlFor="hourlyRate">Hourly Rate</label>
          <input
            id="hourlyRate"
            name="hourlyRate"
            type="number"
            autoComplete="off"
            placeholder="100.00"
            min="0"
            value={form.hourlyRate}
            onChange={set("hourlyRate")}
          />
        </div>

        {/* <div className="field">
                    <label>Amount Due ($)</label>
                    <input type="number" placeholder="0.00" min="0" step="0.01" value={form.amount} onChange={set("amount")} />
                </div> */}

        <div className="field">
          <label htmlFor="description">Work Description</label>
          <textarea
            id="description"
            name="description"
            autoComplete="off"
            placeholder="Describe the work performed…"
            value={form.description}
            onChange={set("description")}
          />
        </div>

        <div className="panel-title" style={{ marginTop: 28 }}>
          Bill To
        </div>

        <div className="field">
          <label htmlFor="toName">Client Name</label>
          <input
            id="toName"
            name="toName"
            placeholder="Acme Corp"
            autoComplete="off"
            value={form.toName}
            onChange={set("toName")}
          />
        </div>

        {/* <div className="field">
                    <label htmlFor="toEmail">Client Email</label>
                    <input id="toEmail" name="toEmail" type="email" placeholder="client@example.com" value={form.toEmail} onChange={set("toEmail")} />
                </div> */}

        {/* ── PDF Actions ── */}
        {/* <PDFActions
              handleOpenPDF={handleOpenPDF}
              handleDownload={handleDownload}
            /> */}
      </div>
    </div>
  );
};
