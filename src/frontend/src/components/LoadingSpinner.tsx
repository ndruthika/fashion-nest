interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizes = { sm: "h-4 w-4", md: "h-8 w-8", lg: "h-12 w-12" };

export default function LoadingSpinner({
  size = "md",
  className = "",
}: LoadingSpinnerProps) {
  return (
    <div
      className={`flex items-center justify-center ${className}`}
      aria-label="Loading"
      aria-busy="true"
    >
      <div
        className={`${sizes[size]} animate-spin rounded-full border-2 border-border border-t-accent`}
      />
    </div>
  );
}
