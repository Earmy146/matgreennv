import React from "react";

interface AiMarkdownTextProps {
  content: string;
  className?: string;
}

function renderInline(text: string): React.ReactNode[] {
  // Split on **bold** or `code`
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return parts.map((part, idx) => {
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      return (
        <strong key={idx} className="font-bold text-slate-900">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("`") && part.endsWith("`") && part.length > 2) {
      return (
        <code
          key={idx}
          className="px-1.5 py-0.5 rounded bg-slate-100 text-emerald-800 font-mono text-[11px]"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return <React.Fragment key={idx}>{part}</React.Fragment>;
  });
}

export const AiMarkdownText: React.FC<AiMarkdownTextProps> = ({ content, className = "" }) => {
  const lines = content.replace(/\r\n/g, "\n").split("\n");
  const blocks: React.ReactNode[] = [];
  let listItems: { ordered: boolean; items: string[] } | null = null;

  const flushList = (keyPrefix: number) => {
    if (!listItems) return;
    if (listItems.ordered) {
      blocks.push(
        <ol key={`ol-${keyPrefix}`} className="list-decimal pl-5 space-y-1">
          {listItems.items.map((item, i) => (
            <li key={i}>{renderInline(item)}</li>
          ))}
        </ol>
      );
    } else {
      blocks.push(
        <ul key={`ul-${keyPrefix}`} className="list-disc pl-5 space-y-1">
          {listItems.items.map((item, i) => (
            <li key={i}>{renderInline(item)}</li>
          ))}
        </ul>
      );
    }
    listItems = null;
  };

  lines.forEach((rawLine, idx) => {
    const line = rawLine.trim();
    if (!line) {
      flushList(idx);
      return;
    }

    const bulletMatch = line.match(/^[-*•]\s+(.*)$/);
    if (bulletMatch) {
      if (listItems && listItems.ordered) flushList(idx);
      if (!listItems) listItems = { ordered: false, items: [] };
      listItems.items.push(bulletMatch[1]);
      return;
    }

    const orderedMatch = line.match(/^\d+[.)]\s+(.*)$/);
    if (orderedMatch) {
      if (listItems && !listItems.ordered) flushList(idx);
      if (!listItems) listItems = { ordered: true, items: [] };
      listItems.items.push(orderedMatch[1]);
      return;
    }

    flushList(idx);

    const headingMatch = line.match(/^#{1,3}\s+(.*)$/);
    if (headingMatch) {
      blocks.push(
        <div key={`h-${idx}`} className="font-bold text-slate-900 pt-1">
          {renderInline(headingMatch[1])}
        </div>
      );
      return;
    }

    blocks.push(
      <p key={`p-${idx}`} className="leading-relaxed">
        {renderInline(line)}
      </p>
    );
  });

  flushList(lines.length);

  return <div className={`space-y-1.5 ${className}`}>{blocks}</div>;
};
