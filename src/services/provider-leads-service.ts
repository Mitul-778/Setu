export type ProviderLead = {
  id: string;
  customerName: string;
  serviceTitle: string;
  area: string | null;
  preferredLanguage: string | null;
  budgetInr: number | null;
  budgetLabel: string;
  note: string;
  status: string;
  statusLabel: string;
  urgent: boolean;
  whenLabel: string;
};

export async function loadProviderLeads() {
  const response = await fetch("/api/provider/leads", { method: "GET", cache: "no-store" });
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(data?.error ?? "Could not load leads.");
  }
  return data as { ok: true; leads: ProviderLead[] };
}

export type LeadDecisionResult = {
  ok: true;
  status: string;
  nextPath: string;
  conversationId?: string;
};

export async function submitLeadDecision(leadId: string, action: "accept" | "decline" | "quote") {
  const response = await fetch("/api/provider/leads/decision", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ leadId, action }),
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const detail = data?.detail ? ` ${data.detail}` : "";
    throw new Error(`${data?.error ?? "Could not update the lead."}${detail}`);
  }
  return data as LeadDecisionResult;
}

export async function loadProviderLead(leadId: string) {
  const response = await fetch(`/api/provider/leads?leadId=${encodeURIComponent(leadId)}`, {
    method: "GET",
    cache: "no-store",
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(data?.error ?? "Could not load this lead.");
  }
  return data as { ok: true; lead: ProviderLead };
}
