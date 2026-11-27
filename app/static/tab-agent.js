// Lab 10: 에이전트 루프 메시지 흐름  (= python -m app.agent_demo "..." --show-messages)
C.tab("도구 호출 루프", (p) => {
  const q = C.el("input", { type: "text", value: "연차 며칠 남았어?" });
  const out = C.el("div");
  const go = C.el("button", { text: "실행", onclick: () => C.busy(go, out, async () => {
    out.replaceChildren(...C.runView(await C.dev("/agent", { text: q.value })));
  }) });
  p.append(C.el("h3", { text: "도구 호출 루프 (Lab 10)" }),
    C.el("div", { class: "row" }, ...["연차 며칠 남았어?", "안녕"].map((t) => C.el("button", { text: t, onclick: () => { q.value = t; } }))),
    q, C.el("div", { class: "row" }, go), out);
});