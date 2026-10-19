// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import App from "./App";
import { CORRUPT_KEY, STORAGE_KEY } from "./state/storage";

beforeEach(() => {
  localStorage.clear();
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(new Date(2026, 9, 16, 9, 0));
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

function addNote(track: string, text: string) {
  fireEvent.change(screen.getByLabelText(`Note for ${track} task`), { target: { value: text } });
  const form = screen.getByLabelText(`Note for ${track} task`).closest("form")!;
  fireEvent.click(within(form).getByRole("button", { name: "Submit" }));
}

function start() {
  render(<App />);
  fireEvent.click(screen.getByRole("button", { name: "Start tracking" }));
}

describe("App", () => {
  it("asks for a start date, then shows Day 1 with 4 tasks", () => {
    start();
    expect(screen.getByRole("heading", { name: "Day 1" })).toBeTruthy();
    expect(screen.getAllByRole("checkbox")).toHaveLength(4);
  });

  it("persists ticks, notes and the start date across a reload", () => {
    start();
    fireEvent.click(screen.getAllByRole("checkbox")[0]);
    addNote("DSA", "redo it");
    cleanup();

    render(<App />);
    expect((screen.getAllByRole("checkbox")[0] as HTMLInputElement).checked).toBe(true);
    expect(screen.getByText("redo it")).toBeTruthy();
    expect(screen.getByText("1 of 4 done")).toBeTruthy();
  });

  it("submits notes with a button and shows them below the task they belong to", () => {
    start();
    const submit = screen.getAllByRole("button", { name: "Submit" })[0] as HTMLButtonElement;
    expect(submit.disabled).toBe(true);
    addNote("DSA", "first");
    addNote("DSA", "second");
    addNote("HLD", "hld note");
    const tasks = screen.getAllByRole("listitem").filter((li) => li.classList.contains("task"));
    expect(within(tasks[0]).getAllByText(/first|second/).map((n) => n.textContent)).toEqual(["first", "second"]);
    expect(within(tasks[1]).getByText("hld note")).toBeTruthy();
    expect(within(tasks[0]).queryByText("hld note")).toBeNull();
    expect((screen.getByLabelText("Note for DSA task") as HTMLInputElement).value).toBe("");

    fireEvent.click(within(tasks[0]).getByRole("button", { name: "Delete note: first" }));
    expect(within(tasks[0]).queryByText("first")).toBeNull();
    expect(within(tasks[0]).getByText("second")).toBeTruthy();
  });
  it("navigates days and opens external links safely", () => {
    start();
    fireEvent.click(screen.getByRole("button", { name: "Next day" }));
    expect(screen.getByRole("heading", { name: "Day 2" })).toBeTruthy();
    const link = screen.getAllByRole("link")[0];
    expect(link.getAttribute("target")).toBe("_blank");
    expect(link.getAttribute("rel")).toBe("noopener noreferrer");
    fireEvent.change(screen.getByLabelText("Jump to day"), { target: { value: "28" } });
    expect(screen.getByRole("heading", { name: "Day 28 (review and gate)" })).toBeTruthy();
  });

  it("opens a day from the Plan screen", () => {
    start();
    fireEvent.click(screen.getByRole("button", { name: "Plan" }));
    const row = screen.getByRole("button", { name: /^Day 3(?!\d)/ });
    fireEvent.click(row);
    expect(screen.getByRole("heading", { name: "Day 3" })).toBeTruthy();
  });

  it("marks past incomplete days as missed and shows behind count", () => {
    localStorage.clear();
    vi.setSystemTime(new Date(2026, 9, 10, 9, 0));
    start();
    vi.setSystemTime(new Date(2026, 9, 13, 9, 0)); // day 4
    cleanup();
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: "Plan" }));
    expect(screen.getAllByText("Missed")).toHaveLength(3);
    fireEvent.click(screen.getByRole("button", { name: "Progress" }));
    const behind = screen.getByText("days behind").previousElementSibling!;
    expect(behind.textContent).toBe("3");
  });

  it("shows a recovery message and keeps a copy when stored JSON is corrupt", () => {
    localStorage.setItem(STORAGE_KEY, "{broken");
    render(<App />);
    expect(screen.getByRole("alert").textContent).toMatch(/could not be read/);
    expect(localStorage.getItem(CORRUPT_KEY)).toBe("{broken");
  });

  it("reset requires confirmation", () => {
    start();
    fireEvent.click(screen.getAllByRole("checkbox")[0]);
    fireEvent.click(screen.getByRole("button", { name: "Settings" }));
    const confirm = vi.spyOn(window, "confirm");
    confirm.mockReturnValueOnce(false);
    fireEvent.click(screen.getByRole("button", { name: "Reset all progress" }));
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!).checked).toEqual({ "d1-dsa": true });
    confirm.mockReturnValueOnce(true);
    fireEvent.click(screen.getByRole("button", { name: "Reset all progress" }));
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!).checked).toEqual({});
  });

  it("imports a plan file and rebuilds the checklist, plan and progress from it", async () => {
    start();
    fireEvent.click(screen.getAllByRole("checkbox")[0]);
    fireEvent.click(screen.getByRole("button", { name: "Settings" }));
    vi.spyOn(window, "confirm").mockReturnValue(true);
    const text = `### Week 1: Only week

**Day 1**

- [ ] **Read:** [Book](https://example.com/book) chapter 1
- [ ] **Write:** an essay

**Day 2**

- [ ] **Read:** chapter 2
`;
    const file = new File([text], "my-plan.txt", { type: "text/plain" });
    fireEvent.change(screen.getByLabelText("Import plan file"), { target: { files: [file] } });
    await waitFor(() => expect(screen.getByText(/Plan imported: 2 days, 3 tasks/)).toBeTruthy());
    expect(screen.getByText("my-plan.txt")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "Today" }));
    expect(screen.getAllByRole("checkbox")).toHaveLength(2);
    expect(screen.getByText("Write")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Next day" })).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Next day" }));
    expect(screen.getAllByRole("checkbox")).toHaveLength(1);
    expect((screen.getByRole("button", { name: "Next day" }) as HTMLButtonElement).disabled).toBe(true);

    fireEvent.click(screen.getByRole("button", { name: "Progress" }));
    expect(screen.getByText("Write")).toBeTruthy();
    expect(screen.queryByText("DSA")).toBeNull();
    expect(screen.getAllByText(/^Week \d/)).toHaveLength(1);

    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    expect(stored.checked).toEqual({}); // d1-dsa no longer exists
    cleanup();
    render(<App />); // the imported plan survives a reload
    expect(screen.getAllByRole("checkbox")).toHaveLength(2);
  });

  it("rejects an invalid plan file with a clear message and keeps the current plan", async () => {
    start();
    fireEvent.click(screen.getByRole("button", { name: "Settings" }));
    const file = new File(["### Week 1: t\n**Day 2**\n- [ ] **A:** x"], "bad.txt", { type: "text/plain" });
    fireEvent.change(screen.getByLabelText("Import plan file"), { target: { files: [file] } });
    await waitFor(() => expect(screen.getByText(/Plan rejected\. Line 2: Day numbers/)).toBeTruthy());
    expect(screen.getByText(/8 weeks, 56 days, 224 tasks/)).toBeTruthy();
  });
});