import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function MarkdownContent({ source }: { source: string }) {
  return (
    <div className="prose-jin">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="font-serif text-[34px] font-light text-forest leading-tight mt-12 mb-4">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="font-serif text-[26px] font-medium text-forest leading-tight mt-10 mb-4">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="font-serif text-[20px] font-medium text-forest leading-tight mt-8 mb-3">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="font-sans text-[15px] font-light text-ink leading-[1.85] mb-5">
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="font-sans text-[15px] font-light text-ink leading-[1.85] mb-5 pl-6 space-y-2 list-disc marker:text-gold">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="font-sans text-[15px] font-light text-ink leading-[1.85] mb-5 pl-6 space-y-2 list-decimal marker:text-gold">
              {children}
            </ol>
          ),
          li: ({ children }) => <li>{children}</li>,
          strong: ({ children }) => (
            <strong className="font-semibold text-forest">{children}</strong>
          ),
          em: ({ children }) => <em className="italic">{children}</em>,
          a: ({ href, children }) => (
            <a
              href={href}
              className="text-gold underline decoration-gold/40 underline-offset-4 hover:decoration-gold transition-colors"
            >
              {children}
            </a>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-gold pl-6 my-6 font-serif italic text-[18px] text-forest">
              {children}
            </blockquote>
          ),
          hr: () => <hr className="border-ivory-dark my-10" />,
          code: ({ children }) => (
            <code className="bg-ivory-dark px-1.5 py-0.5 rounded text-[13px] font-mono text-forest">
              {children}
            </code>
          ),
        }}
      >
        {source}
      </ReactMarkdown>
    </div>
  );
}
