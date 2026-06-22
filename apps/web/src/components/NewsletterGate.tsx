import { NewsletterSignup } from "./NewsletterSignup";

interface NewsletterGateProps {
  isOpen: boolean;
  onClose?: () => void;
  onSuccess?: () => void;
  title?: string;
  subtitle?: string;
}

export function NewsletterGate({
  isOpen,
  onClose,
  onSuccess,
  title = "Get Your Full Report",
  subtitle = "Sign up for our newsletter to download your complete privacy report with deletion links and recommendations.",
}: NewsletterGateProps) {
  if (!isOpen) return null;

  const handleClose = () => {
    if (onClose) onClose();
  };

  const handleSuccess = () => {
    if (onSuccess) {
      onSuccess();
    }
    handleClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-lg max-w-md w-full p-6 relative">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-200 transition"
          aria-label="Close"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-100 mb-2">{title}</h2>
          <p className="text-slate-400 text-sm">{subtitle}</p>
        </div>

        {/* Newsletter form */}
        <NewsletterSignup
          showName={false}
          compact={false}
          onSuccess={handleSuccess}
          className="mb-4"
        />

        {/* Skip option */}
        <button
          onClick={handleClose}
          className="w-full py-2 text-slate-400 hover:text-slate-200 font-medium text-sm transition"
        >
          Skip for now
        </button>
      </div>
    </div>
  );
}
