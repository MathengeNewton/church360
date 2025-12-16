"use client";
import { Suspense } from "react";
import CampaignsPage from "./page";

export default function CampaignsPageWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CampaignsPage />
    </Suspense>
  );
}


