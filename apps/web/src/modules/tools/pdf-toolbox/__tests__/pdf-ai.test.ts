import { describe, expect, it } from "vitest";
import {
  buildPdfSummaryGatewayPayload,
  buildPdfSummaryOutput,
  buildPdfSummarySource
} from "../lib/pdf-ai";

describe("pdf-ai", () => {
  it("builds a bounded summary source from extracted pages", () => {
    expect(buildPdfSummarySource(["  First page text  ", "", "Second page notes"])).toBe(
      "第 1 页：First page text\n第 3 页：Second page notes"
    );
  });

  it("builds a stable AI Gateway payload for pdf summary", () => {
    expect(
      buildPdfSummaryGatewayPayload({
        fileName: "notes.pdf",
        sourceText: "第 1 页：Meeting notes"
      })
    ).toEqual({
      capability: "text_generation",
      credentialSource: "platform_pool",
      input: {
        message: "第 1 页：Meeting notes",
        prompt:
          "你是 DreamChasers PDF 工具箱的文档摘要助手。请阅读用户提供的 PDF 文本，输出中文摘要，结构固定为两部分：1）一句话总览；2）3 条要点，每条尽量不超过 28 个字。不要编造不存在的信息；如果内容明显残缺，就按现有文本保守总结。文档名：notes.pdf"
      },
      modelId: "mock-structured-fast",
      productSlug: "dreamchasers",
      toolSlug: "pdf-toolbox-summary"
    });
  });

  it("normalizes gateway output to a summary string", () => {
    expect(
      buildPdfSummaryOutput({
        text: "一句话总览\n- 要点一\n- 要点二"
      })
    ).toEqual({
      summary: "一句话总览\n- 要点一\n- 要点二"
    });
  });
});
