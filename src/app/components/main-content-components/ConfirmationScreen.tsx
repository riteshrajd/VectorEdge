'use client';

import React from 'react';

interface ConfirmPageProps {
  instrumentName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationScreen: React.FC<ConfirmPageProps> = ({ instrumentName, onConfirm, onCancel }) => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--bg-main)] text-sidebar-foreground">
      <div className="mx-auto max-w-md rounded-[--radius-xl] border-[--color-border] bg-[--color-card] p-6 shadow-[--shadow-lg]">
        <p className="text-center font-mono text-[--color-card-foreground]">
          Are you sure you want to view the analysis report for <span className="font-bold">{instrumentName}</span>? It might take a few minutes to generate.
        </p>
        <div className="mt-6 flex justify-center gap-4">
          <button
            onClick={onCancel}
            className="rounded-[--radius-md] bg-[--color-muted] px-6 py-2 font-mono text-[--color-muted-foreground] hover:bg-[--color-muted]/80 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="rounded-[--radius-md] bg-[--color-primary] px-6 py-2 font-mono text-[--color-primary-foreground] hover:bg-[--color-primary]/90 transition-colors"
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationScreen;