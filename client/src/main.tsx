import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { RoadmapProvider } from "@/contexts/RoadmapContext";

createRoot(document.getElementById("root")!).render(
  <RoadmapProvider>
    <App />
  </RoadmapProvider>
);
