export function AnimatedBlobs() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute -top-32 -left-32 h-[500px] w-[500px] animate-float-slow animate-blob opacity-40"
        style={{
          background: "radial-gradient(circle, oklch(0.6 0.24 295 / 0.6), transparent 70%)",
        }}
      />
      <div
        className="absolute top-1/3 -right-40 h-[600px] w-[600px] animate-float-slow animate-blob opacity-30"
        style={{
          background: "radial-gradient(circle, oklch(0.78 0.14 195 / 0.6), transparent 70%)",
          animationDelay: "-7s",
        }}
      />
      <div
        className="absolute bottom-0 left-1/3 h-[500px] w-[500px] animate-float-slow animate-blob opacity-25"
        style={{
          background: "radial-gradient(circle, oklch(0.72 0.13 175 / 0.6), transparent 70%)",
          animationDelay: "-14s",
        }}
      />
    </div>
  );
}
