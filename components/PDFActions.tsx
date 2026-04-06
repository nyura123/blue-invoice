interface PDFActionsProps {
  handleOpenPDF: () => void;
  handleDownload: () => void;
}

export const PDFActions = ({
  handleOpenPDF,
  handleDownload,
}: PDFActionsProps) => {
  const isOnDesktop = window.innerWidth >= 768; // simple check for desktop vs mobile

  return (
    <div className="actions">
      {isOnDesktop && (
        <button className="btn btn-primary" onClick={handleOpenPDF}>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <polyline points="2,4 12,13 22,4" />
          </svg>
          Open PDF
        </button>
      )}
      <button className="btn btn-secondary" onClick={handleDownload}>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        Download PDF
      </button>
    </div>
  );
};
