/** A synthetic 8-week, 56-day plan (DSA, HLD, LLD, AI) used only by tests. */
export function buildSamplePlanSource(): string {
  const lines: string[] = ["# Sample plan", "", "## 8-week daily plan", ""];
  for (let week = 1; week <= 8; week++) {
    lines.push(`### Week ${week}: Focus ${week}`, "");
    for (let d = (week - 1) * 7 + 1; d <= week * 7; d++) {
      const label = d === 28 ? " (review and gate)" : d % 7 === 0 ? " (review)" : "";
      lines.push(
        `**Day ${d}${label}**`,
        "",
        `- [ ] **DSA:** [Problem ${d}](https://example.com/dsa/${d}) (pattern ${d})`,
        `- [ ] **HLD:** [Design topic ${d}](https://example.com/hld/${d}): notes`,
        `- [ ] **LLD:** [Pattern ${d}](https://example.com/lld/${d}) and [Guide ${d}](https://example.com/guide/${d})`,
        `- [ ] **AI:** Build step ${d}`,
        "",
      );
    }
  }
  return lines.join("\n");
}
