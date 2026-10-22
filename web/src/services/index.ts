import { LocalStudioService } from "./local";
import { LiveStudioService } from "./live";
import { studioConfigFromEnv } from "../../integration/studio-config";
import type { StudioService } from "../lib/types";

export const liveMode = import.meta.env.VITE_STUDIO_MODE === "live";
export const service: StudioService = liveMode ? new LiveStudioService(async () => {
  const { connectWebStudio } = await import("../../integration/firebase-bootstrap");
  return connectWebStudio(studioConfigFromEnv(import.meta.env));
}) : new LocalStudioService();
