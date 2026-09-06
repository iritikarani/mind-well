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
import { cn } from "@/lib/cn";

type MonthEntries = Record<string, { slot: number; text: string }[]>;

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
  const [saving, setSaving] = useState(false);
  const [newBadges, setNewBadges] = useState<string[]>([]);
  const [exporting, setExporting] = useState(false);

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
    setSaving(true);
    setNewBadges([]);
    try {
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
    } finally {
      setSaving(false);
    }
  }

  async function exportPdf() {
    setExporting(true);
    try {
      const res = await fetch(`/api/journal/month?month=${monthKey(visibleMonth)}`);
      const data = await res.json();
      const entries: MonthEntries = data.entries ?? {};

      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF();
      const title = `Three Things — ${format(visibleMonth, "MMMM yyyy")}`;
      doc.setFontSize(18);
      doc.text(title, 14, 18);
      doc.setFontSize(11);

      let y = 32;
      const dates = Object.keys(entries).sort();
      if (dates.length === 0) {
        doc.text("No entries this month yet.", 14, y);
      }
      for (const d of dates) {
        if (y > 275) {
          doc.addPage();
          y = 20;
        }
        doc.setFont("helvetica", "bold");
        doc.text(format(new Date(d), "EEEE, MMMM d"), 14, y);
        y += 7;
        doc.setFont("helvetica", "normal");
        for (const entry of entries[d].sort((a, b) => a.slot - b.slot)) {
          const lines = doc.splitTextToSize(`• ${entry.text}`, 180);
          doc.text(lines, 18, y);
          y += 6 * lines.length;
        }
        y += 4;
      }

      doc.save(`mind-well-three-things-${monthKey(visibleMonth)}.pdf`);

      const res2 = await fetch("/api/journal/month-pdf-downloaded", { method: "POST" });
      const data2 = await res2.json();
      if (data2.newBadges?.length) {
        setNewBadges(data2.newBadges.map((b: { label: string }) => b.label));
      }
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-3xl font-bold text-heading">Three Things</h1>
        <Button variant="soft" onClick={exportPdf} disabled={exporting}>
          {exporting ? "Preparing…" : "Download month as PDF"}
        </Button>
      </div>
      <p className="mt-1 text-muted">
        Up to three small things, any day. Nothing is mandatory, and you can always come back and
        change what you wrote.
      </p>

      {newBadges.length > 0 && (
        <div className="mt-4 rounded-xl bg-butter px-4 py-2 text-sm font-semibold text-butter-text">
          New badge{newBadges.length > 1 ? "s" : ""}: {newBadges.join(", ")} 🎉
        </div>
      )}

      <Card className="mt-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setVisibleMonth((m) => subMonths(m, 1))}
            className="rounded-full px-3 py-1.5 text-sm font-semibold text-heading hover:bg-blush/50"
          >
            ← Prev
          </button>
          <p className="font-heading font-semibold text-heading">
            {format(visibleMonth, "MMMM yyyy")}
          </p>
          <button
            onClick={() => setVisibleMonth((m) => addMonths(m, 1))}
            disabled={nextMonthDisabled}
            className="rounded-full px-3 py-1.5 text-sm font-semibold text-heading hover:bg-blush/50 disabled:opacity-30 disabled:hover:bg-transparent"
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
                onClick={() => setSelectedDate(key)}
                className={cn(
                  "relative flex h-11 flex-col items-center justify-center rounded-xl text-sm transition",
                  !inMonth && "text-muted/40",
                  isFuture && "cursor-not-allowed opacity-30",
                  !isFuture && inMonth && "text-heading hover:bg-blush/40",
                  isSelected && "bg-blush-strong text-blush-text font-bold",
                  isSameDay(day, today) && !isSelected && "ring-1 ring-blush-strong/60",
                )}
              >
                {format(day, "d")}
                {hasEntries && (
                  <span
                    className={cn(
                      "absolute bottom-1 h-1 w-1 rounded-full",
                      isSelected ? "bg-blush-text" : "bg-mint-text",
                    )}
                  />
                )}
              </button>
            );
          })}
        </div>
      </Card>

      <Card className="mt-6">
        <p className="font-heading font-semibold text-heading">
          {format(new Date(selectedDate), "EEEE, MMMM d, yyyy")}
        </p>
        <div className="mt-4 space-y-3">
          {slots.map((text, i) => (
            <ThingInput
              key={`${selectedDate}-${i}`}
              index={i}
              value={text}
              disabled={loadingDay || saving}
              onSave={(value) => saveSlot(i, value)}
            />
          ))}
        </div>
      </Card>
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
        className="flex-1 rounded-xl border border-black/5 bg-white/80 px-3 py-2 text-sm text-heading placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-blush-strong/60"
      />
    </div>
  );
}
