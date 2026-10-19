import { LocalStudioService } from "./local";
import { LiveStudioService } from "./live";
import { connectWebStudio } from "../../integration/firebase-bootstrap";
import { studioConfigFromEnv } from "../../integration/studio-config";
import type { StudioService } from "../lib/types";

export const liveMode = import.meta.env.VITE_STUDIO_MODE === "live";
export const service: StudioService = liveMode ? new LiveStudioService(() =>
  connectWebStudio(studioConfigFromEnv(import.meta.env))) : new LocalStudioService();
