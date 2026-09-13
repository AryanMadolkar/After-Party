import type { Metadata } from "next";

import { ClientsList } from "@/components/clients/clients-list";
import { listClients } from "@/lib/clients/service";

export const metadata: Metadata = {
  title: "Clients",
};

export default async function ClientsPage({
  searchParams,
}: {
  searchParams: Promise<{ archived?: string }>;
}) {
  const params = await searchParams;
  const includeArchived = params.archived === "1";
  const { clients, activeCount, limit } = await listClients({ includeArchived });

  return (
    <ClientsList
      clients={clients}
      activeCount={activeCount}
      limit={limit}
      includeArchived={includeArchived}
    />
  );
}
