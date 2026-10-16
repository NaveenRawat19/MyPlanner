// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
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
    fireEvent.change(screen.getByLabelText(/Note for this day/), { target: { value: "redo it" } });
    cleanup();

    render(<App />);
    expect((screen.getAllByRole("checkbox")[0] as HTMLInputElement).checked).toBe(true);
    expect((screen.getByLabelText(/Note for this day/) as HTMLInputElement).value).toBe("redo it");
    expect(screen.getByText("1 of 4 done")).toBeTruthy();
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
});
