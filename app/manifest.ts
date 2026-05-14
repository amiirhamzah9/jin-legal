import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "JIN Legal Counsel",
    short_name: "JIN Legal",
    description:
      "A full-service legal consultancy serving corporations, institutions, and individuals across 12 practice areas throughout Indonesia.",
    start_url: "/",
    display: "standalone",
    background_color: "#0a1f17",
    theme_color: "#1a4035",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
