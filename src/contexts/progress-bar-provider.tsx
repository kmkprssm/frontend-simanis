"use client";

import { ProgressProvider } from "@bprogress/next/app";

export const NProgressBarProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <ProgressProvider
      height="3px"
      color="#5CB139"
      options={{
        showSpinner: false,
        easing: "ease",
      }}
      shallowRouting
      startPosition={0.08}
    >
      {children}
    </ProgressProvider>
  );
};
