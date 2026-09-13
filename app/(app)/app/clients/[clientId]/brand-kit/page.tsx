import type { Metadata } from "next";
import { Noto_Sans_Devanagari } from "next/font/google";
import { notFound } from "next/navigation";

import { BrandKitEditor } from "@/components/clients/brand-kit-editor";
import { AuthError } from "@/lib/contracts";
import { getBrandKit, getClient } from "@/lib/clients/service";

const notoDevanagari = Noto_Sans_Devanagari({
  subsets: ["devanagari"],
  weight: ["400", "600"],
  variable: "--font-noto-devanagari",
  display: "swap",
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ clientId: string }>;
}): Promise<Metadata> {
  try {
    const { clientId } = await params;
    const client = await getClient(clientId);
    return { title: `${client.name} · Brand kit` };
  } catch {
    return { title: "Brand kit" };
  }
}

export default async function BrandKitPage({
  params,
}: {
  params: Promise<{ clientId: string }>;
}) {
  const { clientId } = await params;

  let client;
  let kit;
  try {
    client = await getClient(clientId);
    kit = await getBrandKit(clientId);
  } catch (error) {
    if (error instanceof AuthError) notFound();
    throw error;
  }

  return (
    <div className={notoDevanagari.variable}>
      <BrandKitEditor
        clientId={client.id}
        clientName={client.name}
        initialKit={kit.brandKit}
        initialCompleteness={kit.completeness}
        canEdit={kit.canEdit}
      />
    </div>
  );
}
