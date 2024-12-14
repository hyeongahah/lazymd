export interface FormatProps {
  markdownText: string;
  setMarkdownText: (text: string) => void;
}

export interface FormatOptions {
  prefix: string;
  suffix: string;
  alertMessage?: string;
}
