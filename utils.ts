export function formatDate(str: string): string {
  if (!str) return "";
  const [y, m, d] = str.split("-");
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return `${months[parseInt(m, 10) - 1]} ${parseInt(d, 10)}, ${y}`;
}

export const userNameStorageKey = "invoiceFormUserName";
export const encryptedFormStorageKey = (userName: string) =>
  `invoiceFormEncrypted_${userName}`;

// export const throttledFunction = <T extends (...args: any[]) => void>(fn: T, delayMs: number): T => {
//   let lastCall = 0;
//   return function(this: any, ...args: any[]) {
//     const now = new Date().getTime();
//     if (now - lastCall < delayMs) {
//       return;
//     }
//     lastCall = now;
//     return fn.apply(this, args);
//   } as T;
// };

export const isCheckboxInput = (
  target: EventTarget | null
): target is HTMLInputElement => {
  return target instanceof HTMLInputElement && target.type === "checkbox";
};

export function initialBlankForm(): InvoiceForm {
  return {
    senderName: "",
    senderAddress: "",
    senderCityStateZip: "",
    senderEmail: "",
    senderPhone: "",
    invoiceNumber: "",
    invoiceDate: new Date().toISOString().split("T")[0],
    dateFrom: "",
    dateTo: "",
    days: "",
    hours: "",
    hourlyRate: "100.00",
    description: "",
    toName: "",
    toEmail: "",
  };
}

export const scrollToTopAndWait = async (): Promise<void> => {
  window.scrollTo(0, 0);
  await new Promise((resolve) => setTimeout(resolve, 100));
};

export const TEMPLATES: Template[] = [
  { id: "classic", label: "Classic", path: "/invoice_template.html" },
  { id: "artemis", label: "Artemis", path: "/invoice_template_artemis.html" },
  { id: "minimal", label: "Minimal", path: "/invoice_template_minimal.html" },
  { id: "elegant", label: "Elegant", path: "/invoice_template_elegant.html" },
  { id: "blue", label: "Blue", path: "/invoice_template_blue.html" },
  { id: "bright", label: "Bright", path: "/invoice_template_bright.html" },
];

export interface Template {
  id: string;
  label: string;
  path: string;
}

export interface InvoiceForm {
  senderName: string;
  senderAddress: string;
  senderCityStateZip: string;
  senderEmail: string;
  senderPhone: string;
  invoiceNumber: string;
  invoiceDate: string;
  dateFrom: string;
  dateTo: string;
  days: string;
  hours: string;
  hourlyRate: string;
  description: string;
  toName: string;
  toEmail: string;
}

export type SetFn = (
  key: keyof InvoiceForm
) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
