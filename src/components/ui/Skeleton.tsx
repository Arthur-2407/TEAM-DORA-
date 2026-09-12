import React from 'react';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  width?: string | number;
  height?: string | number;
  circle?: boolean;
}

export function Skeleton({
  className = '',
  width,
  height,
  circle = false,
  style,
  ...props
}: SkeletonProps) {
  return (
    <div
      className={`skeleton ${circle ? 'rounded-full' : 'rounded-lg'} ${className}`}
      style={{
        width,
        height,
        ...style,
      }}
      aria-hidden="true"
      {...props}
    />
  );
}

export function MissionCardSkeleton() {
  return (
    <div className="glass-card p-5 flex flex-col gap-4 border border-[var(--border-subtle)]">
      <div className="flex items-center justify-between">
        <Skeleton width="120px" height="20px" />
        <Skeleton width="60px" height="20px" />
      </div>
      <Skeleton width="80%" height="24px" />
      <Skeleton width="60%" height="16px" />
      <div className="flex items-center justify-between pt-2 border-t border-[var(--border-subtle)]">
        <Skeleton width="90px" height="20px" />
        <Skeleton width="100px" height="36px" />
      </div>
    </div>
  );
}
