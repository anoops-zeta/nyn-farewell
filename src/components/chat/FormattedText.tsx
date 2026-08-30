const TOKEN =
  /(\*\*[^*]+\*\*|_[^_]+_|https?:\/\/[^\s<]+|@[A-Za-z][\w]*(?:\s[A-Za-z][\w]*)?)/g;

export function FormattedText({ value }: { value: string }) {
  const parts = value.split(TOKEN);
  return (
    <span className="whitespace-pre-wrap break-words">
      {parts.map((part, i) => {
        if (!part) return null;
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={i} className="font-semibold">
              {part.slice(2, -2)}
            </strong>
          );
        }
        if (part.startsWith("_") && part.endsWith("_") && part.length > 2) {
          return (
            <em key={i} className="italic text-text-secondary">
              {part.slice(1, -1)}
            </em>
          );
        }
        if (part.startsWith("http://") || part.startsWith("https://")) {
          return (
            <a
              key={i}
              href={part}
              target="_blank"
              rel="noreferrer"
              className="text-accent underline decoration-accent/40 underline-offset-2"
            >
              {part}
            </a>
          );
        }
        if (part.startsWith("@")) {
          return (
            <span key={i} className="font-semibold text-mention">
              {part}
            </span>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </span>
  );
}
