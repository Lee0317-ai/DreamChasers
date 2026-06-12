function normalizeWhitespace(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

export function buildPdfSummarySource(pagesText: string[], limit = 6000) {
  const normalized = pagesText.map((pageText, index) => {
    const text = normalizeWhitespace(pageText);
    return text ? `第 ${index + 1} 页：${text}` : "";
  });
  const joined = normalized.filter(Boolean).join("\n");

  return joined.length > limit ? `${joined.slice(0, limit - 1)}…` : joined;
}

export function buildPdfSummaryGatewayPayload(input: { fileName: string; sourceText: string }) {
  return {
    capability: "text_generation" as const,
    credentialSource: "platform_pool" as const,
    input: {
      message: input.sourceText,
      prompt: `你是 DreamChasers PDF 工具箱的文档摘要助手。请阅读用户提供的 PDF 文本，输出中文摘要，结构固定为两部分：1）一句话总览；2）3 条要点，每条尽量不超过 28 个字。不要编造不存在的信息；如果内容明显残缺，就按现有文本保守总结。文档名：${input.fileName}`
    },
    modelId: "mock-structured-fast",
    productSlug: "dreamchasers",
    toolSlug: "pdf-toolbox-summary"
  };
}

export function buildPdfSummaryOutput(result: Record<string, unknown>) {
  const text =
    typeof result.text === "string"
      ? result.text.trim()
      : typeof result.summary === "string"
        ? result.summary.trim()
        : "";

  return {
    summary: text || "暂时没有生成可用摘要。"
  };
}
