import React from "react";
import katex from "katex";

interface KaTeXProps {
  math: string;
  className?: string;
}

export const KaTeXBlock: React.FC<KaTeXProps> = ({ math, className = "" }) => {
  const html = katex.renderToString(math, {
    displayMode: true,
    throwOnError: false,
  });

  return (
    <div
      className={`my-4 overflow-x-auto py-2 text-center ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export const KaTeXInline: React.FC<KaTeXProps> = ({ math, className = "" }) => {
  const html = katex.renderToString(math, {
    displayMode: false,
    throwOnError: false,
  });

  return (
    <span
      className={`inline-math ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};
