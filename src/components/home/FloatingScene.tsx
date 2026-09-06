export function FloatingScene() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute left-[8%] top-[18%] h-24 w-24 rounded-full bg-blush/60 blur-xl animate-float-slow" />
      <div className="absolute right-[12%] top-[28%] h-32 w-32 rounded-full bg-sky/70 blur-xl animate-float-slower" />
      <div className="absolute left-[18%] bottom-[20%] h-20 w-20 rounded-full bg-mint/60 blur-xl animate-float-slower" />
      <div className="absolute right-[20%] bottom-[14%] h-16 w-16 rounded-full bg-butter/70 blur-lg animate-float-slow" />

      <span className="absolute left-[15%] top-[15%] text-4xl animate-float-slow select-none">
        ☁️
      </span>
      <span className="absolute right-[18%] top-[22%] text-3xl animate-float-slower select-none">
        🍃
      </span>
      <span className="absolute left-[10%] bottom-[24%] text-3xl animate-float-slower select-none">
        🍃
      </span>
      <span className="absolute right-[10%] bottom-[30%] text-4xl animate-float-slow select-none">
        ☁️
      </span>
    </div>
  );
}
