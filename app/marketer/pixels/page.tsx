import type { Metadata } from "next";
import { Radio } from "lucide-react";
import { MarketerHeader } from "@/components/marketer/MarketerHeader";
import { PixelManager } from "@/components/marketer/PixelManager";

export const metadata: Metadata = {
  title: "Pixels de tracking"
};

export default function MarketerPixelsPage() {
  return (
    <>
      <MarketerHeader
        description="Gérez vos pixels Meta (Facebook/Instagram) et TikTok pour suivre les visites et les conversions sur votre site."
        icon={Radio}
        title="Pixels de tracking"
      />

      <div className="max-w-4xl">
        {/* Info banner */}
        <div className="mb-8 rounded-2xl border border-dentova-teal-200 bg-dentova-teal-50/50 p-5">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-dentova-teal-100 text-dentova-teal-600">
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-bold text-dentova-teal-800">
                Comment ça fonctionne ?
              </h3>
              <p className="mt-1 text-sm text-dentova-teal-700">
                Lorsque vous activez un pixel, son code de suivi est
                automatiquement injecté sur toutes les pages publiques de
                votre site. Vous pouvez vérifier son bon fonctionnement
                avec les extensions navigateur officielles :{" "}
                <a
                  className="font-semibold underline underline-offset-2"
                  href="https://chromewebstore.google.com/detail/meta-pixel-helper/fdgfkebogiimcoedlicjlajpkdmockpc"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Meta Pixel Helper
                </a>{" "}
                ou{" "}
                <a
                  className="font-semibold underline underline-offset-2"
                  href="https://chromewebstore.google.com/detail/tiktok-pixel-helper/aelgobmabdmljbenmfnhlgofendjncjf"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  TikTok Pixel Helper
                </a>
                .
              </p>
            </div>
          </div>
        </div>

        <PixelManager />
      </div>
    </>
  );
}
