export const PLAN_EXAMPLE_TECH = `### Week 1: Hashing and windows · networking basics · OOP and SOLID · tokens and prompts

**Day 1**

- [ ] **DSA:** Solve [Group Anagrams](https://leetcode.com/problems/group-anagrams/) in 30 min (hashing), then read the [NeetCode walkthrough](https://neetcode.io/problems/anagram-groups) and write a one-line pattern note
- [ ] **HLD:** Study [networking basics](https://github.com/donnemartin/system-design-primer) (DNS, TCP, HTTP, TLS) and explain in one sentence what happens when you type a URL; skim DDIA [chapter 1](https://dataintensive.net/) for vocabulary
- [ ] **LLD:** Read [OOP pillars](https://www.hellointerview.com/learn/low-level-design/in-a-hurry/oop-concepts) and write a small Python class with encapsulation and polymorphism; compare with [Refactoring Guru's intro](https://refactoring.guru/design-patterns/what-is-pattern)
- [ ] **AI:** Open the [OpenAI tokenizer](https://platform.openai.com/tokenizer) and the [Anthropic prompting guide](https://docs.claude.com/en/docs/build-with-claude/prompt-engineering/overview); run the same prompt at temperature 0 and 1 and note the difference

**Day 2 (review)**

- [ ] **DSA:** Redo the problem you failed this week and explain the pattern aloud
- [ ] **HLD:** Redo one design from memory on paper and list its three main trade-offs
- [ ] **LLD:** Code the OOP example again without looking, then add one SOLID fix
- [ ] **AI:** Run 10 test prompts through your extraction script and record which ones fail
`;

export const PLAN_EXAMPLE_UPSC = `### Week 1: Ancient India and Indian Polity basics · Geography fundamentals · Economy basics · Current affairs habit

**Day 1**

- [ ] **GS1:** Read the [NCERT Class 6 History](https://ncert.nic.in/textbook.php) chapters on early humans and the first cities (60 min), then make one page of notes with a timeline
- [ ] **GS2:** Read Laxmikanth, Historical Background of the Constitution (45 min) and list the Acts of 1773 to 1935 with one line each; check the [PRS India primer](https://prsindia.org/) for how Parliament works today
- [ ] **GS3:** Read the opening chapter of Ramesh Singh, Indian Economy (45 min) and define GDP, GVA and inflation in your own words
- [ ] **Current Affairs:** Read the editorial page of [The Hindu](https://www.thehindu.com/) and the day's [PIB releases](https://pib.gov.in/) (30 min); write 5 bullet points on the most exam-relevant item
- [ ] **Answer Writing:** Write one 150-word answer to a [previous year question](https://upsc.gov.in/examinations/previous-question-papers) on the Constitution and self-check it against the structure: intro, body, conclusion

**Day 2 (review)**

- [ ] **GS1:** Revise the notes from this week and recall the timeline without looking
- [ ] **GS2:** Solve 20 MCQs on the Constitution's historical background and log the wrong ones
- [ ] **GS3:** Redo the economy definitions from memory and fix gaps
- [ ] **Current Affairs:** Compile the week's notes into one page
- [ ] **Answer Writing:** Rewrite your weakest answer from this week
`;

export type FieldId = "tech" | "upsc" | "other";
export type Level = "beginner" | "intermediate" | "advanced";
export type TrackMode = "all" | "rotate";

export type FieldPreset = {
  label: string;
  tracks: string[];
  defaultTracks: string[];
  styles: string[];
  sources: string;
  goalHint: string;
};

export const TASK_STYLES = [
  "Reading chapters or articles",
  "Practice problems or questions",
  "Video lectures",
  "Writing notes or summaries",
  "Mock tests",
  "Projects or hands-on work",
] as const;

export const FIELD_PRESETS: Record<FieldId, FieldPreset> = {
  tech: {
    label: "Tech interviews / software",
    tracks: ["DSA", "HLD", "LLD", "AI", "Backend", "Databases", "DevOps", "Behavioural", "Mock Interview"],
    defaultTracks: ["DSA", "HLD", "LLD", "AI"],
    styles: ["Practice problems or questions", "Reading chapters or articles", "Projects or hands-on work"],
    sources:
      "LeetCode or NeetCode problems, System Design Primer, ByteByteGo, Hello Interview, Refactoring Guru, the book Designing Data-Intensive Applications, and official Anthropic, OpenAI and Google docs",
    goalHint: "e.g. Crack senior backend / AI engineer interviews at product companies",
  },
  upsc: {
    label: "UPSC Civil Services",
    tracks: ["GS1", "GS2", "GS3", "GS4", "Optional", "CSAT", "Current Affairs", "Essay", "Answer Writing"],
    defaultTracks: ["GS1", "GS2", "GS3", "Current Affairs", "Answer Writing"],
    styles: ["Reading chapters or articles", "Writing notes or summaries", "Practice problems or questions", "Mock tests"],
    sources:
      "NCERT textbooks (ncert.nic.in), PIB (pib.gov.in), PRS India (prsindia.org), Economic Survey and Budget (indiabudget.gov.in), the UPSC previous year papers page (upsc.gov.in), and The Hindu or Indian Express editorials. Standard books such as Laxmikanth, Spectrum or Ramesh Singh have no URL, so name the book and chapter in the text",
    goalHint: "e.g. Clear UPSC Prelims 2027 and write Mains",
  },
  other: {
    label: "Other exam or skill",
    tracks: [],
    defaultTracks: [],
    styles: ["Reading chapters or articles", "Practice problems or questions"],
    sources: "official syllabus pages, standard textbooks, the exam body's previous papers, and well-known free courses",
    goalHint: "e.g. Score 95 percentile in CAT, or learn Spanish to B1",
  },
};

export type PromptAnswers = {
  field: FieldId;
  fieldName: string;
  goal: string;
  durationValue: number;
  durationUnit: "weeks" | "days";
  hoursPerDay: number;
  level: Level;
  tracks: string[];
  trackMode: TrackMode;
  weakAreas: string;
  resources: string;
  freeOnly: boolean;
  taskStyles: string[];
  reviewDays: boolean;
  extra: string;
};

export const MAX_TRACK_LENGTH = 24;
export const MAX_TOTAL_DAYS = 365;

export const defaultAnswers = (field: FieldId = "tech"): PromptAnswers => ({
  field,
  fieldName: "",
  goal: "",
  durationValue: 8,
  durationUnit: "weeks",
  hoursPerDay: 2,
  level: "intermediate",
  tracks: [...FIELD_PRESETS[field].defaultTracks],
  trackMode: "all",
  weakAreas: "",
  resources: "",
  freeOnly: false,
  taskStyles: [...FIELD_PRESETS[field].styles],
  reviewDays: true,
  extra: "",
});

/** Track names go between "**" and ":**" in the plan file, so those characters are removed. */
export function sanitizeTracks(raw: string[]): string[] {
  const out: string[] = [];
  for (const t of raw) {
    const name = t.replace(/[*:\n]/g, " ").replace(/\s+/g, " ").trim().slice(0, MAX_TRACK_LENGTH).trim();
    if (name && !out.some((o) => o.toLowerCase() === name.toLowerCase())) out.push(name);
  }
  return out;
}

export const totalDays = (a: PromptAnswers): number =>
  Math.round(a.durationValue) * (a.durationUnit === "weeks" ? 7 : 1);

export type QuestionGroup = "about" | "time" | "tracks";
export const QUESTION_GROUPS: readonly QuestionGroup[] = ["about", "time", "tracks"];

export function validateGroup(a: PromptAnswers, group: QuestionGroup): string[] {
  const errors: string[] = [];
  if (group === "about") {
    if (a.field === "other" && a.fieldName.trim() === "") errors.push("Name your field or exam.");
    if (a.goal.trim() === "") errors.push("Describe what you want to achieve.");
  } else if (group === "time") {
    const days = totalDays(a);
    if (!Number.isFinite(days) || days < 1 || days > MAX_TOTAL_DAYS) {
      errors.push(`Duration must be between 1 day and ${MAX_TOTAL_DAYS} days.`);
    }
    if (!(a.hoursPerDay >= 0.5 && a.hoursPerDay <= 16)) errors.push("Daily time must be between 0.5 and 16 hours.");
  } else if (sanitizeTracks(a.tracks).length === 0) {
    errors.push("Choose or add at least one track (subject).");
  }
  return errors;
}

export const validateAnswers = (a: PromptAnswers): string[] => QUESTION_GROUPS.flatMap((g) => validateGroup(a, g));

/** A tiny sample in the user's own tracks, used when no field-specific example exists. */
export function buildSkeletonExample(tracks: string[]): string {
  const line = (t: string, text: string) => `- [ ] **${t}:** ${text}`;
  return [
    "### Week 1: short title for the week's focus",
    "",
    "**Day 1**",
    "",
    ...tracks.map((t) => line(t, `Specific topic and action (30 min), using [a named resource](https://example.com/resource)`)),
    "",
    "**Day 2 (review)**",
    "",
    ...tracks.map((t) => line(t, "Revise this week's topic and redo what went wrong")),
    "",
  ].join("\n");
}

const clean = (s: string) => s.trim().replace(/\r\n/g, "\n");

export function buildPlanPrompt(a: PromptAnswers): string {
  const preset = FIELD_PRESETS[a.field];
  const field = a.field === "other" ? clean(a.fieldName) : preset.label;
  const tracks = sanitizeTracks(a.tracks);
  const days = totalDays(a);
  const weeks = Math.ceil(days / 7);
  const minutes = Math.round(a.hoursPerDay * 60);
  const resources = clean(a.resources);

  const example =
    a.field === "tech" ? PLAN_EXAMPLE_TECH : a.field === "upsc" ? PLAN_EXAMPLE_UPSC : buildSkeletonExample(tracks);
  const exampleNote =
    a.field === "other"
      ? "EXAMPLE (format skeleton: write real, specific tasks and real links; never use example.com)"
      : "EXAMPLE (format and level of detail only: use MY tracks, topics and duration, not the example's; it is shortened, a real plan has 7 days per week)";

  const lines: string[] = [
    "Create a complete day-by-day study plan as a plain text file that I will import into my planner app. Reply with ONLY the file contents inside one code block, no commentary.",
    "",
    "ABOUT ME",
    `- Field: ${field}`,
    `- Goal: ${clean(a.goal)}`,
    `- Current level: ${a.level}`,
    `- Duration: ${days} days (${weeks} week${weeks === 1 ? "" : "s"}${days % 7 === 0 ? "" : `, the last week has ${days % 7} day${days % 7 === 1 ? "" : "s"}`}). Number the days 1 to ${days}.`,
    `- Time available: ${a.hoursPerDay} hour${a.hoursPerDay === 1 ? "" : "s"} per day (${minutes} minutes). Split this across the tracks and state the minutes in each task, so one day adds up to about ${minutes} minutes.`,
    `- Tracks (subjects): ${tracks.join(", ")}`,
    a.trackMode === "all"
      ? "- Every day has one task for every track."
      : "- Each day covers 2 to 3 tracks, rotating so every track appears at least twice a week.",
  ];
  if (clean(a.weakAreas)) lines.push(`- Weak areas to give extra time: ${clean(a.weakAreas)}`);
  if (a.taskStyles.length) lines.push(`- Preferred ways of studying: ${a.taskStyles.join("; ")}`);
  if (a.freeOnly) lines.push("- Use free resources only.");
  if (clean(a.extra)) lines.push(`- Other instructions: ${clean(a.extra)}`);

  lines.push("", "RESOURCES");
  if (resources) {
    lines.push(
      "Base the plan mainly on these resources I chose (links, books, courses, notes):",
      resources,
      "Use a link exactly as I wrote it. If you cannot open a link, still use it as the main reference and do not invent deeper URLs under it. Spread these resources across the plan in a sensible order.",
      `You may add other well-known sources where my list has gaps, such as ${preset.sources}.`,
    );
  } else {
    lines.push(`Choose reliable sources. Good options for this field: ${preset.sources}.`);
  }
  lines.push(
    "Only use real, well-known URLs and prefer stable pages (a section, guide index, docs page or problem page). If you are not sure a URL exists, leave the link out and say in words where to find the material.",
  );

  lines.push(
    "",
    "WHAT EACH TASK MUST CONTAIN",
    "Each task is one line that tells me exactly what to do in the time I have, not just a topic name. Include:",
    "1. A specific topic, chapter, problem or question (not just a subject name).",
    "2. A concrete action and outcome, with minutes (for example: solve in 30 min and write a pattern note; read the chapter and make one page of notes; write a 150-word answer and self-check it; solve 20 questions and log the wrong ones).",
    "3. Two or three study links of different kinds where they exist: the exercise or question, a primary explanation, and optionally a video or deeper reading.",
    "",
    "PLAN STRUCTURE",
    "- Build up gradually: fundamentals first, then depth and practice, then full-length tests, mocks or projects, finishing with gaps and revision.",
    a.reviewDays
      ? "- Every 7th day (Day 7, 14, 21, ...) is a review day: revise the week, redo what I got wrong, and take a short test or mock for each track. Label it **Day N (review)**."
      : "- No fixed review days, but include revision tasks regularly.",
    "- Where natural, connect tracks within a week.",
    "- Give each week a title that names its focus.",
    "",
    "STRICT FORMAT RULES (the app rejects anything else)",
    "1. Start each week with a line: ### Week N: short title",
    "   Weeks are numbered 1, 2, 3, ... with no gaps.",
    "2. Start each day with a line on its own: **Day N**   (review days: **Day N (review)**)",
    `   Day numbers run 1, 2, 3, ... to ${days} continuously across ALL weeks (Week 2 starts at Day 8 if Week 1 has 7 days). Never restart at 1.`,
    "3. Under each day write one task per line, exactly like this:",
    "   - [ ] **TRACK:** task text",
    `   TRACK must be one of: ${tracks.join(", ")}. Write each name identically on every day. Every day needs at least one task. Always include the "- [ ] " checkbox and the bold TRACK name followed by a colon.`,
    "4. Links are Markdown: [label](https://full-url). Only http:// or https://. Put the link inside the sentence; the label becomes the button text.",
    "5. Keep every task on a single line. No nested bullets, tables or blank lines between a day's tasks. No other headings or text.",
    `6. If the reply gets too long, stop after a complete day. I will answer "continue"; then carry on from the next day number without repeating anything, starting with the next week heading if a new week begins. Finish at Day ${days}.`,
    "",
    exampleNote,
    example,
  );
  return lines.join("\n");
}
