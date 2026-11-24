import React, { useMemo } from "react";

interface SafeHtmlContentProps {
  html?: string | null;
  fallback?: string;
  className?: string;
}

export function sanitizeHtml(raw: string): string {
  // Remove dangerous tags and inline event handlers
  return raw
    .replace(/<(script|iframe|object|embed|style|form|meta|link)[^>]*>[\s\S]*?<\/\1>/gi, "")
    .replace(/<(script|iframe|object|embed|style|form|meta|link)[^>]*\/?>/gi, "")
    .replace(/\son[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/(href|src)\s*=\s*(['"])\s*javascript:[^'"]*\2/gi, '$1="#"');
}

export const SafeHtmlContent: React.FC<SafeHtmlContentProps> = ({
  html,
  fallback = "Chưa có mô tả chi tiết.",
  className = "",
}) => {
  const sanitized = useMemo(() => {
    if (!html || !html.trim()) return "";
    const hasTags = /<\/?[a-z][\s\S]*>/i.test(html);
    if (!hasTags) {
      return "";
    }
    return sanitizeHtml(html);
  }, [html]);

  if (!html || !html.trim()) {
    return <p className={`text-sm text-slate-500 ${className}`}>{fallback}</p>;
  }

  if (!sanitized) {
    return (
      <p className={`text-sm text-slate-600 leading-relaxed whitespace-pre-line ${className}`}>
        {html}
      </p>
    );
  }

  return (
    <div
      className={`text-sm text-slate-700 leading-relaxed space-y-2 [&_p]:my-1.5 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:my-0.5 [&_strong]:font-bold [&_strong]:text-slate-900 [&_h1]:text-lg [&_h1]:font-extrabold [&_h2]:text-base [&_h2]:font-bold [&_h3]:text-sm [&_h3]:font-bold [&_a]:text-emerald-700 [&_a]:underline [&_img]:rounded-xl [&_img]:max-h-80 [&_img]:my-2 ${className}`}
      dangerouslySetInnerHTML={{ __html: sanitized }}
    />
  );
};
