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

/** Prompt users can paste into an AI assistant to get a plan file this app can import. */
export const PLAN_PROMPT = `Create a complete day-by-day study plan as a plain text file that I can import into my planner app. Reply with ONLY the file contents inside one code block, no commentary.

MY DETAILS (fill in before sending)
- Field and goal: [e.g. "Tech interviews for a senior backend / AI role" or "UPSC Civil Services (Prelims + Mains)" or any other exam or skill]
- Duration: [e.g. 8 weeks = 56 days]
- Time per day: [e.g. 2 hours, or 6 hours]
- My level, optional subject (if any) and weak areas: [...]
- Tracks (the subjects or topics I study each day): [choose from the suggestions below, or write your own]

TRACK SUGGESTIONS (pick what fits, 2 to 6 tracks, each name at most 24 characters)
- Tech interviews: DSA, HLD (system design), LLD (object-oriented design), AI (LLMs, agents, RAG). Other options: Backend, DevOps, Databases, Behavioural, Mock Interview.
- UPSC CSE: GS1 (history, geography, society), GS2 (polity, governance, international relations), GS3 (economy, environment, science and tech, security), GS4 (ethics), Optional, CSAT, Current Affairs, Essay, Answer Writing.
- Any other field: use the main subjects of its syllabus, plus one practice track (mock tests, problems or projects).

WHAT EACH TASK MUST CONTAIN
Each task is one line that tells me exactly what to do in the time I have, not just a topic name. Include:
1. A specific topic, chapter, problem or question (e.g. "Group Anagrams (hashing)" or "Laxmikanth: Fundamental Rights", not "arrays" or "polity").
2. A concrete action and outcome (e.g. "solve in 30 min, then write a pattern note", "read the chapter and make one page of notes", "write a 150-word answer and self-check it", "solve 20 MCQs and log the wrong ones", "draw the design for a URL shortener").
3. Two or three study links of DIFFERENT kinds where they exist: the exercise or question, a primary explanation (official source, standard book or guide) and optionally a video or deeper reading.
   - Tech: LeetCode or NeetCode problems, System Design Primer, ByteByteGo, Hello Interview, Refactoring Guru, Anthropic, OpenAI and Google docs.
   - UPSC: NCERT textbooks (ncert.nic.in), PIB (pib.gov.in), PRS India (prsindia.org), Economic Survey and Budget (indiabudget.gov.in), the UPSC previous year papers page (upsc.gov.in), The Hindu or Indian Express editorials. Standard books such as Laxmikanth, Spectrum or Ramesh Singh have no URL: name the book and chapter in the text.
   Only use real, well-known URLs, and prefer stable pages (a section, guide index or docs page). If you are not sure a URL exists, leave the link out and say where to find the material in words.

PLAN STRUCTURE
- Build up gradually: fundamentals first, then depth and practice, then full-length mocks or projects, finishing with gaps and revision.
- Every 7th day is a review day: revise the week, redo what I got wrong, and take a short test or mock for each track.
- Where natural, connect tracks within a week (for example Economy basics with the week's current affairs).
- Give each week a title that names its focus.

STRICT FORMAT RULES (the app rejects anything else)
1. Start each week with a line: ### Week N: short title
   Weeks are numbered 1, 2, 3, ... with no gaps.
2. Start each day with a line on its own: **Day N**
   For review days use: **Day N (review)**
   Day numbers run 1, 2, 3, ... continuously across ALL weeks (Week 2 starts at Day 8 if Week 1 has 7 days). Never restart at 1.
3. Under each day write one task per track, one per line, exactly like this:
   - [ ] **TRACK:** task text
   Every day needs at least one task. Always include the "- [ ] " checkbox and the bold TRACK name followed by a colon. Write each track name identically on every day.
4. Links are Markdown: [label](https://full-url). Only http:// or https://. Put the link inside the sentence; the label becomes the button text.
5. Keep every task on a single line. No nested bullets, tables or blank lines between a day's tasks. No other headings or text.

EXAMPLE A, tech (shortened: a real plan has 7 days per week and a review day every 7th day)
${PLAN_EXAMPLE_TECH}
EXAMPLE B, UPSC (same format, different field)
${PLAN_EXAMPLE_UPSC}`;
