// This file is for declaring global types, especially for libraries loaded via CDN that don't have their own TypeScript types.
// export {} is needed to convert this file into a module, which allows us to use declare global.
export {};

declare global {
  // html2pdf is loaded via CDN script tag in index.html
  interface Window {
    html2pdf: () => {
      set: (opt: unknown) => ReturnType<Window["html2pdf"]>;
      from: (html: string) => ReturnType<Window["html2pdf"]>;
      outputPdf: (type: string) => Promise<string>;
      save: () => Promise<void>;
    };
  }
}
