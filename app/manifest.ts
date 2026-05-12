import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Tota-ly Guiding",
    short_name: "TotaGuiding",
    description: "Your AI-powered career mentor for Pakistani students.",
    start_url: "/?source=pwa",
    scope: "/",
    display: "standalone",
    background_color: "#faf8f4",
    theme_color: "#0d0d0d",
    icons: [
      {
        src: "/logo.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/logo.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
    shortcuts: [
      {
        name: "Take Assessment",
        url: "/assessment",
        description: "Start your career assessment",
      },
      {
        name: "Talk to padhleTota",
        url: "/?chat=true",
        description: "Direct chat with AI mentor",
      },
    ],
    orientation: "portrait",
    categories: ["education", "productivity"],
    prefer_related_applications: false,
    id: "/",
    dir: "ltr",
    lang: "en",
    display_override: ["standalone", "browser"],
  };
}
