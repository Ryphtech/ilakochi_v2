import React from 'react';

interface SectionSkeletonProps {
  height?: string;
  hasCardGrid?: boolean;
}

export const SectionSkeleton: React.FC<SectionSkeletonProps> = ({
  height = 'min-h-[400px]',
  hasCardGrid = true,
}) => {
  return (
    <div
      className={`w-full ${height} py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col justify-center animate-pulse space-y-8`}
      aria-hidden="true"
    >
      {/* Header Skeleton */}
      <div className="flex flex-col items-center space-y-3 max-w-xl mx-auto w-full">
        <div className="w-28 h-6 rounded-full bg-[#123D2A]/60 border border-[#176B45]/30" />
        <div className="w-3/4 sm:w-2/3 h-10 rounded-2xl bg-[#123D2A]/80" />
        <div className="w-5/6 sm:w-1/2 h-4 rounded-lg bg-[#123D2A]/40" />
      </div>

      {/* Optional Card Grid Skeleton */}
      {hasCardGrid && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <div className="h-64 rounded-3xl bg-[#123D2A]/40 border border-[#176B45]/20 p-6 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#0B291E]" />
            <div className="w-1/2 h-6 rounded-lg bg-[#0B291E]" />
            <div className="w-full h-16 rounded-xl bg-[#0B291E]/60" />
          </div>
          <div className="h-64 rounded-3xl bg-[#123D2A]/40 border border-[#176B45]/20 p-6 space-y-4 hidden md:block">
            <div className="w-12 h-12 rounded-2xl bg-[#0B291E]" />
            <div className="w-1/2 h-6 rounded-lg bg-[#0B291E]" />
            <div className="w-full h-16 rounded-xl bg-[#0B291E]/60" />
          </div>
          <div className="h-64 rounded-3xl bg-[#123D2A]/40 border border-[#176B45]/20 p-6 space-y-4 hidden md:block">
            <div className="w-12 h-12 rounded-2xl bg-[#0B291E]" />
            <div className="w-1/2 h-6 rounded-lg bg-[#0B291E]" />
            <div className="w-full h-16 rounded-xl bg-[#0B291E]/60" />
          </div>
        </div>
      )}
    </div>
  );
};
