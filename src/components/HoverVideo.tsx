'use client';

export default function HoverVideo({
  src,
  className,
}: {
  src: string;
  className?: string;
}) {
  return (
    <div className={`relative overflow-hidden ${className ?? ''}`}>
      <video
        src={src}
        className="w-full h-full object-cover"
        muted
        loop
        autoPlay
        playsInline
        controls={false}
      />
    </div>
  );
}
