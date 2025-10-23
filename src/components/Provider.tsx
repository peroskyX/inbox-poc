"use client";

import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import React from "react";

// Use direct Convex URL
const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || "https://different-reindeer-498.convex.cloud";
const convex = new ConvexReactClient(convexUrl);

export default function ConvexClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        {children as any}
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}
