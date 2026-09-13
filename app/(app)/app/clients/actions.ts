"use server";

import { isAuthError, isPlanLimitError } from "@/lib/contracts";
import type {
  BrandKit,
  BrandKitCompleteness,
  Client,
  CreateClientInput,
  UpdateBrandKitInput,
  UpdateClientInput,
} from "@/lib/contracts";
import {
  archiveClient,
  createClient,
  getBrandKit,
  getClient,
  listClients,
  updateBrandKit,
  updateClient,
} from "@/lib/clients/service";

export type ActionError = {
  ok: false;
  error: string;
  code?: string;
  status?: number;
};

export type ActionOk<T> = { ok: true } & T;

function toActionError(error: unknown): ActionError {
  if (isPlanLimitError(error)) {
    return { ok: false, error: error.message, code: error.code, status: error.status };
  }
  if (isAuthError(error)) {
    return { ok: false, error: error.message, code: error.code, status: error.status };
  }
  if (error instanceof Error) {
    return { ok: false, error: error.message };
  }
  return { ok: false, error: "Something went wrong." };
}

export async function listClientsAction(opts: { includeArchived?: boolean } = {}) {
  try {
    const result = await listClients(opts);
    return { ok: true as const, ...result };
  } catch (error) {
    return toActionError(error);
  }
}

export async function createClientAction(
  input: CreateClientInput,
): Promise<
  ActionOk<{ client: Client; brandKit: BrandKit; completeness: BrandKitCompleteness }> | ActionError
> {
  try {
    const result = await createClient(input);
    return { ok: true, ...result };
  } catch (error) {
    return toActionError(error);
  }
}

export async function updateClientAction(
  clientId: string,
  input: UpdateClientInput,
): Promise<ActionOk<{ client: Client }> | ActionError> {
  try {
    const client = await updateClient(clientId, input);
    return { ok: true, client };
  } catch (error) {
    return toActionError(error);
  }
}

export async function archiveClientAction(
  clientId: string,
): Promise<ActionOk<{ client: Client }> | ActionError> {
  try {
    const client = await archiveClient(clientId);
    return { ok: true, client };
  } catch (error) {
    return toActionError(error);
  }
}

export async function getClientAction(
  clientId: string,
): Promise<ActionOk<{ client: Client }> | ActionError> {
  try {
    const client = await getClient(clientId);
    return { ok: true, client };
  } catch (error) {
    return toActionError(error);
  }
}

export async function getBrandKitAction(clientId: string) {
  try {
    const result = await getBrandKit(clientId);
    return { ok: true as const, ...result };
  } catch (error) {
    return toActionError(error);
  }
}

export async function updateBrandKitAction(
  clientId: string,
  input: UpdateBrandKitInput,
): Promise<
  ActionOk<{ brandKit: BrandKit; completeness: BrandKitCompleteness }> | ActionError
> {
  try {
    const result = await updateBrandKit(clientId, input);
    return { ok: true, ...result };
  } catch (error) {
    return toActionError(error);
  }
}
