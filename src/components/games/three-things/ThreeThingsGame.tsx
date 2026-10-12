"use client";

import { useEffect, useMemo, useState } from "react";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isAfter,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PixelHeart } from "@/components/pixel/PixelArt";
import { cn } from "@/lib/cn";
import { generateThreeThingsPdf, type MonthEntries } from "@/lib/threeThingsPdf";

function dateKey(d: Date) {
  return format(d, "yyyy-MM-dd");
}

function monthKey(d: Date) {
  return format(d, "yyyy-MM");
}

export function ThreeThingsGame() {
  const today = useMemo(() => new Date(), []);
  const [visibleMonth, setVisibleMonth] = useState(startOfMonth(today));
  const [selectedDate, setSelectedDate] = useState(dateKey(today));
  const [monthEntries, setMonthEntries] = useState<MonthEntries>({});
  const [slots, setSlots] = useState<[string, string, string]>(["", "", ""]);
  const [loadingDay, setLoadingDay] = useState(false);
  const [newBadges, setNewBadges] = useState<string[]>([]);
  const [exporting, setExporting] = useState(false);
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);

  const nextMonthDisabled = isSameMonth(visibleMonth, today) || isAfter(visibleMonth, today);

  useEffect(() => {
    fetch(`/api/journal/month?month=${monthKey(visibleMonth)}`)
      .then((r) => r.json())
      .then((d) => setMonthEntries(d.entries ?? {}));
  }, [visibleMonth]);

  useEffect(() => {
    let ignore = false;
    Promise.resolve().then(() => {
      if (!ignore) setLoadingDay(true);
    });

    fetch(`/api/journal/day?date=${selectedDate}`)
      .then((r) => r.json())
      .then((d) => {
        if (ignore) return;
        const entries: { slot: number; text: string }[] = d.entries ?? [];
        const next: [string, string, string] = ["", "", ""];
        for (const e of entries) {
          if (e.slot >= 1 && e.slot <= 3) next[e.slot - 1] = e.text;
        }
        setSlots(next);
      })
      .finally(() => {
        if (!ignore) setLoadingDay(false);
      });

    return () => {
      ignore = true;
    };
  }, [selectedDate]);

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(visibleMonth));
    const end = endOfWeek(endOfMonth(visibleMonth));
    return eachDayOfInterval({ start, end });
  }, [visibleMonth]);

  async function saveSlot(slotIndex: number, text: string) {
    setNewBadges([]);
    const res = await fetch("/api/journal/day", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date: selectedDate, slot: slotIndex + 1, text }),
    });
    const data = await res.json();
    if (res.ok) {
      setMonthEntries((prev) => ({ ...prev, [selectedDate]: data.entries }));
      if (data.newBadges?.length) {
        setNewBadges(data.newBadges.map((b: { label: string }) => b.label));
      }
    }
  }

  async function exportPdf() {
    setExporting(true);
    try {
      const res = await fetch(`/api/journal/month?month=${monthKey(visibleMonth)}`);
      const data = await res.json();
      const entries: MonthEntries = data.entries ?? {};

      await generateThreeThingsPdf(format(visibleMonth, "MMMM yyyy"), monthKey(visibleMonth), entries);

      const res2 = await fetch("/api/journal/month-pdf-downloaded", { method: "POST" });
      const data2 = await res2.json();
      if (data2.newBadges?.length) {
        setNewBadges(data2.newBadges.map((b: { label: string }) => b.label));
      }
    } finally {
      setExporting(false);
    }
  }

  const dayPanelContent = (
    <>
      <p className="font-heading font-semibold text-heading">
        {format(new Date(selectedDate), "EEEE, MMMM d, yyyy")}
      </p>
      <p className="mt-1 text-xs text-muted">
        {!loadingDay && slots.every((s) => s.trim() === "")
          ? "Your little page is still empty. Maybe today is the day you write your first thing. ♡"
          : "Up to three small things. None of them are required."}
      </p>
      <div className="mt-4 space-y-3">
        {slots.map((text, i) => (
          <ThingInput
            key={`${selectedDate}-${i}`}
            index={i}
            value={text}
            disabled={loadingDay}
            onSave={(value) => saveSlot(i, value)}
          />
        ))}
      </div>
    </>
  );

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="flex items-center gap-2 font-heading text-3xl font-bold text-heading">
          <PixelHeart size={22} /> 3 Things
        </h1>
        <Button variant="soft" onClick={exportPdf} disabled={exporting}>
          {exporting ? "Preparing…" : "Download month as PDF"}
        </Button>
      </div>
      <p className="mt-1 text-muted">
        A few small things, any day. Nothing is mandatory, and you can always come back and change
        what you wrote.
      </p>

      {newBadges.length > 0 && (
        <div className="mt-4 rounded-xl bg-butter px-4 py-2 text-sm font-semibold text-butter-text">
          New badge{newBadges.length > 1 ? "s" : ""}: {newBadges.join(", ")} 🎉
        </div>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px] lg:items-start">
        <Card>
          <div className="flex items-center justify-between">
            <button
              onClick={() => setVisibleMonth((m) => subMonths(m, 1))}
              className="min-h-11 rounded-full px-3 py-1.5 text-sm font-semibold text-heading hover:bg-lavender/60"
            >
              ← Prev
            </button>
            <p className="font-heading font-semibold text-heading">
              {format(visibleMonth, "MMMM yyyy")}
            </p>
            <button
              onClick={() => setVisibleMonth((m) => addMonths(m, 1))}
              disabled={nextMonthDisabled}
              className="min-h-11 rounded-full px-3 py-1.5 text-sm font-semibold text-heading hover:bg-lavender/60 disabled:opacity-30 disabled:hover:bg-transparent"
            >
              Next →
            </button>
          </div>

          <div className="mt-4 grid grid-cols-7 gap-1 text-center text-xs font-semibold text-muted">
            {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
              <div key={i}>{d}</div>
            ))}
          </div>
          <div className="mt-1 grid grid-cols-7 gap-1">
            {days.map((day) => {
              const key = dateKey(day);
              const inMonth = isSameMonth(day, visibleMonth);
              const isFuture = isAfter(day, today) && !isSameDay(day, today);
              const hasEntries = (monthEntries[key]?.length ?? 0) > 0;
              const isSelected = key === selectedDate;

              return (
                <button
                  key={key}
                  disabled={isFuture}
                  onClick={() => {
                    setSelectedDate(key);
                    setMobileSheetOpen(true);
                  }}
                  className={cn(
                    "relative flex h-11 flex-col items-center justify-center rounded-xl text-sm transition",
                    !inMonth && "text-muted/40",
                    isFuture && "cursor-not-allowed opacity-30",
                    !isFuture && inMonth && "text-heading hover:bg-lavender/50",
                    isSelected && "bg-purple text-white font-bold",
                    isSameDay(day, today) && !isSelected && "ring-1 ring-purple/60",
                  )}
                >
                  {format(day, "d")}
                  {hasEntries && (
                    <PixelHeart
                      size={10}
                      className="absolute bottom-0.5"
                      color={isSelected ? "#FFFFFF" : "#FF9DC2"}
                      shade={isSelected ? "#FFFFFF" : "#E8699D"}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </Card>

        <div className="hidden lg:block">
          <Card>{dayPanelContent}</Card>
        </div>
      </div>

      {mobileSheetOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end lg:hidden">
          <button
            aria-label="Close"
            onClick={() => setMobileSheetOpen(false)}
            className="absolute inset-0 bg-heading/30"
          />
          <div className="relative max-h-[80vh] overflow-y-auto rounded-t-3xl bg-surface p-5 pb-8 shadow-[0_-8px_24px_rgba(0,0,0,0.12)]">
            <div className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-lavender-strong/70" />
            <div className="flex items-center justify-between">
              <p className="sr-only">Day details</p>
              <button
                onClick={() => setMobileSheetOpen(false)}
                className="min-h-11 min-w-11 rounded-full px-3 text-sm font-semibold text-muted hover:bg-lavender/50"
              >
                ✕ Close
              </button>
            </div>
            {dayPanelContent}
          </div>
        </div>
      )}
    </div>
  );
}

function ThingInput({
  index,
  value,
  disabled,
  onSave,
}: {
  index: number;
  value: string;
  disabled: boolean;
  onSave: (value: string) => void;
}) {
  const [local, setLocal] = useState(value);
  const [prevValue, setPrevValue] = useState(value);

  // Keep the input in sync when `value` changes for reasons other than typing
  // here (switching dates, or the initial fetch resolving after mount).
  if (value !== prevValue) {
    setPrevValue(value);
    setLocal(value);
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-semibold text-muted">{index + 1}.</span>
      <input
        value={local}
        disabled={disabled}
        placeholder="One small thing…"
        onChange={(e) => setLocal(e.target.value)}
        onBlur={() => {
          if (local !== value) onSave(local);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") (e.target as HTMLInputElement).blur();
        }}
        maxLength={200}
        className="min-h-11 flex-1 rounded-xl border border-black/5 bg-white/80 px-3 py-2 text-sm text-heading placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-purple/60"
      />
    </div>
  );
}
