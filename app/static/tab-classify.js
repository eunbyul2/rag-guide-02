// Lab 3: 민원 분류  (= classify() 1건 · python -m eval.run_classify)
C.tab("민원 분류", (p) => {
  const q = C.el("textarea", { rows: 3 }, "결제가 두 번 됐습니다. 카드 명세서 첨부합니다.");
  const out = C.el("div");
  const one = C.el("button", { text: "1건 분류", onclick: () => C.busy(one, out, async () => {
    out.replaceChildren(C.table([await C.dev("/classify", { text: q.value })]));
  }) });
  const all = C.el("button", { text: "정확도 측정 (20건)", onclick: () => C.busy(all, out, async () => {
    out.replaceChildren(...C.runView(await C.dev("/run", { name: "run_classify" })));
  }) });
  p.append(C.el("h3", { text: "민원 분류 (Lab 3)" }), q, C.el("div", { class: "row" }, one, all), out);
});

// Lab 4 · 5 · 12: 규정 질문 · 검색 점수 · 청크 크기 비교
C.tab("규정 질문", (p) => {
  const q = C.el("input", { type: "text", value: "연차는 다음 해로 이월되나요?" });
  const via = C.el("select", {},
    C.el("option", { value: "dev", text: "함수 직접 호출 (Lab 4)" }),
    C.el("option", { value: "api", text: "대상 API 의 /ask (Lab 5~)" }));
  const out = C.el("div");
  const ask = C.el("button", { text: "질문", onclick: () => C.busy(ask, out, async () => {
    if (via.value === "dev") {
      const r = await C.dev("/answer", { text: q.value });
      return out.replaceChildren(C.el("pre", { text: r.answer }), C.el("div", { class: "muted", text: "sources: " + (r.sources || []).join(", ") }));
    }
    const x = await C.api("/ask", { q: q.value });
    const meta = `HTTP ${x.status} · ${x.ms}ms · X-App-Version ${x.app_version || "-"} · X-Prompt-Version ${x.prompt_version || "-"}`;
    if (x.status !== 200) return out.replaceChildren(C.el("div", { class: "bad", text: meta }), C.el("pre", { text: C.json(x.body) }));
    out.replaceChildren(C.el("pre", { text: x.body.answer }),
      C.el("div", { class: "muted", text: "sources: " + (x.body.sources || []).join(", ") }), C.el("div", { class: "muted", text: meta }));
  }) });
  const idx = C.el("select", {}, ...["index", "index_200", "index_500", "index_1000"].map((v) => C.el("option", { value: v, text: v })));
  const hits = C.el("div");
  const find = C.el("button", { text: "검색 점수 보기", onclick: () => C.busy(find, hits, async () => {
    hits.replaceChildren(C.el("div", { class: "muted", text: "score 0.15 미만(min_score)은 실제 답변에서 빠집니다" }),
      C.table(await C.dev("/search", { q: q.value, index: idx.value })));
  }) });
  const cmp = C.el("button", { text: "청크 크기 비교 실행", onclick: () => C.busy(cmp, hits, async () => {
    hits.replaceChildren(...C.runView(await C.dev("/run", { name: "compare_chunks" })));
  }) });
  p.append(C.el("h3", { text: "규정 질문 (Lab 4 · 5 · 12)" }), q, C.el("div", { class: "row" }, via, ask), out,
    C.el("h4", { text: "검색 결과와 점수 (Lab 4)" }), C.el("div", { class: "row" }, idx, find, cmp), hits);
});