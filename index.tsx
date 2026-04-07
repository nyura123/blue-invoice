import { useState, useRef, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { InvoiceGenerator } from "./components/InvoiceGenerator";
import { PasswordModal, PasswordModalConfig } from "./components/PasswordModal";

import {
  isCheckboxInput,
  scrollToTopAndWait,
  userNameStorageKey,
  encryptedFormStorageKey,
  initialBlankForm,
} from "./utils.js";

import type { InvoiceForm, SetFn } from "./utils.js";
import { encryptData, decryptData } from "./crypto.js";

const appName = import.meta.env.VITE_APP_NAME;

async function saveEncryptedForm(
  form: InvoiceForm,
  username: string,
  password: string
): Promise<void> {
  if (!username || !password)
    throw new Error("Please enter a user name & password.");
  if (!formHasSenderData(form)) {
    if (
      !window.confirm(
        "Your form looks blank. Are you sure you want to save? Make sure to fill in at least the sender information."
      )
    ) {
      return;
    }
  }
  const encrypted = await encryptData(JSON.stringify(form), password);
  localStorage.setItem(encryptedFormStorageKey(username), encrypted);
}

const restoreEncryptedForm = async (password: string, username: string) => {
  if (!username || !password)
    throw new Error("Please enter a user name & password.");
  const encryptedData = localStorage.getItem(encryptedFormStorageKey(username));
  if (!encryptedData)
    throw new Error("No saved data found for this user name.");
  const decrypted = await decryptData(encryptedData, password);
  const restoredForm = JSON.parse(decrypted) as InvoiceForm;
  return restoredForm;
};

function formHasSenderData(form: InvoiceForm) {
  return Object.keys(form).some(
    (k) =>
      k.startsWith("sender") &&
      !!(form as unknown as Record<string, unknown>)[k]
  );
}

function App() {
  const [form, setForm] = useState<InvoiceForm>(() => initialBlankForm());

  const [toast, setToast] = useState("");
  const toastTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  );

  // user name and password modal, to save/restore form data.
  const [passwordModalConfig, setPasswordModalConfig] =
    useState<PasswordModalConfig | null>(null);

  useEffect(() => {
    // on mount,
    // if encrypted data exists, present the user with the option to restore it,
    // instead of loading the blank form.
    const storedUserName = localStorage.getItem(userNameStorageKey) ?? "";
    const hasEncryptedData =
      !!storedUserName &&
      !!localStorage.getItem(encryptedFormStorageKey(storedUserName));
    if (hasEncryptedData) {
      handleRestoreSavedData();
    }
  }, []);

  // beforeunload doesn't work yet on mobile safari; and we need better logic to detect "unsaved changes"
  // vs "has sender data to save".

  // useEffect(() => {
  //   const handler = (e: BeforeUnloadEvent) => {
  //     if (formHasSenderData(form)) e.preventDefault();
  //   };
  //   window.addEventListener("beforeunload", handler);
  //   return () => window.removeEventListener("beforeunload", handler);
  // }, [form]);

  const openPasswordModal = (config: PasswordModalConfig) =>
    setPasswordModalConfig(config);
  const closePasswordModal = () => setPasswordModalConfig(null);

  function handleSaveData() {
    const storedUserName = localStorage.getItem(userNameStorageKey) || "";
    openPasswordModal({
      title: "Enable local save",
      description:
        "Your form data will be encrypted and saved locally with this password.",
      initialUsername: storedUserName,
      onConfirm: async (password, username) => {
        await saveEncryptedForm(form, username, password);
        showToast("Data saved ✓");
        closePasswordModal();
      },
      onCancel: closePasswordModal,
    });
  }

  function handleRestoreSavedData() {
    const storedUserName = localStorage.getItem(userNameStorageKey) || "";
    openPasswordModal({
      title: "Restore data",
      initialUsername: storedUserName,
      onConfirm: async (password, username) => {
        const restoredForm = await restoreEncryptedForm(password, username);
        if (!formHasSenderData(restoredForm) && formHasSenderData(form)) {
          if (
            !window.confirm(
              "The saved form looks blank, but your current form has data. Are you sure you want to restore? This will overwrite your current form."
            )
          ) {
            closePasswordModal();
            return;
          }
        }

        setForm(restoredForm);
        showToast("Data restored ✓");
        closePasswordModal();
      },
      onCancel: closePasswordModal,
    });
  }

  const set: SetFn = (key) => {
    return (e) => {
      // console.log("set", key, e.target.value, e.target.checked, e.target.type);
      setForm((f) => {
        const newForm = {
          ...f,
          [key]: isCheckboxInput(e.target) ? e.target.checked : e.target.value,
        };

        return newForm;
      });
    };
  };

  function showToast(msg: string) {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 3000);
  }

  const handleOpenPDF = async (html: string) => {
    // first scroll to top to ensure the PDF captures the top of the invoice,
    // as html2canvas captures based on the current viewport position
    await scrollToTopAndWait();

    const opt = getPDFOptions(form.invoiceNumber);

    // open PDF in preview via blob URL
    try {
      const url = await window
        .html2pdf()
        .set(opt)
        .from(html)
        .outputPdf("bloburl");

      // clean up the blob URL after 10 seconds to free memory,
      // since we don't need it anymore after the PDF is opened
      setTimeout(() => URL.revokeObjectURL(url), 10000);
      const win = window.open(url, "_blank");
      if (win) {
        win.focus();
        showToast("Invoice PDF opened in new tab ✓");
      } else {
        showToast(
          "Failed to open PDF in new tab. Please allow popups for this site."
        );
      }
    } catch (error) {
      console.error("Error generating PDF:", error);
      showToast("Error generating PDF. See console for details.");
    }
  };

  const handleDownload = async (html: string) => {
    await scrollToTopAndWait();

    const opt = getPDFOptions(form.invoiceNumber);

    // save pdf
    try {
      await window.html2pdf().set(opt).from(html).save();
      showToast("Invoice PDF downloaded ✓");
    } catch (error) {
      console.error("Error generating PDF:", error);
      showToast("Error generating PDF. See console for details.");
    }
  };

  return (
    <>
      <InvoiceGenerator
        form={form}
        set={set}
        handleOpenPDF={handleOpenPDF}
        handleDownload={handleDownload}
        toast={toast}
        appName={appName}
        onSaveData={handleSaveData}
        onRestoreSavedData={handleRestoreSavedData}
      />
      {passwordModalConfig && <PasswordModal config={passwordModalConfig} />}
    </>
  );
}

function getPDFOptions(invoiceNumber?: string) {
  return {
    margin: 0,
    filename: `invoice-${invoiceNumber || "draft"}.pdf`,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      scrollY: -window.scrollY,
      onclone: async (doc: Document) => await doc.fonts.ready,
    },
    jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
  };
}

// Entry point
const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}

createRoot(rootElement).render(<App />);
