"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { APP_DISPLAY_NAME } from "@/lib/app-config";

type Analytics = {
  totalUsers: number;
  signupsLast7Days: number;
  signupsLast30Days: number;
  totalCampaigns: number;
  totalLeads: number;
  workspacesWithDomain: number;
  usersVerified?: number;
  usersWithAnthropicKey?: number;
  usersWithInstantlyKey?: number;
  usersWhoCreatedCampaign?: number;
  usersWhoSentCampaign?: number;
  recentUsers: Array<{ id: string; email: string; name: string | null; createdAt: string; emailVerified: boolean }>;
  recentCampaigns: Array<{
    name: string;
    variant: string | null;
    abGroupId: string | null;
    userEmail: string | null;
    domain: string | null;
    createdAt: string;
  }>;
};

type NurturePreview = {
  totalUsers: number;
  byStage: Record<string, number>;
  users: Array<{
    email: string;
    name: string | null;
    stage: string;
    stageLabel: string;
    nextStep: string;
    daysSinceSignup: number;
  }>;
};

type NurtureResult = {
  dryRun: boolean;
  total: number;
  sent: number;
  failed: number;
  results: Array<{
    email: string;
    stage: string;
    subject: string;
    sent: boolean;
    error?: string;
  }>;
};

export default function AdminPage() {
  const { data: session, status } = useSession();
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [forbidden, setForbidden] = useState(false);
  const [verifyingEmail, setVerifyingEmail] = useState<string | null>(null);

  // Nurture state
  const [nurturePreview, setNurturePreview] = useState<NurturePreview | null>(null);
  const [nurtureResult, setNurtureResult] = useState<NurtureResult | null>(null);
  const [nurtureLoading, setNurtureLoading] = useState(false);
  const [nurtureSending, setNurtureSending] = useState(false);
  const [nurtureStep, setNurtureStep] = useState<"idle" | "preview" | "confirm" | "sending" | "done">("idle");
  const [selectedStages, setSelectedStages] = useState<Set<string>>(new Set());

  const refetchAnalytics = () => {
    fetch("/api/admin/analytics")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && !data.error) setAnalytics(data);
      })
      .catch(() => {});
  };

  useEffect(() => {
    if (status === "unauthenticated") { setLoading(false); return; }
    if (status !== "authenticated") return;
    fetch("/api/admin/analytics")
      .then((res) => {
        if (res.status === 403) { setForbidden(true); return null; }
        return res.json();
      })
      .then((data) => {
        if (data && !data.error) setAnalytics(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [status]);

  if (status === "loading" || loading) {
    return <div className="min-h-screen flex items-center justify-center bg-zinc-950"><p className="text-zinc-400">Loading...</p></div>;
  }
  if (status === "unauthenticated") {
    return <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-950 px-4"><p className="text-zinc-400 mb-4">You must be logged in.</p><Link href="/login" className="text-emerald-500 hover:text-emerald-400">Log in</Link></div>;
  }
  if (forbidden) {
    return <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-950 px-4"><p className="text-zinc-400 mb-4">Access denied. Admins only.</p><Link href="/dashboard" className="text-emerald-500 hover:text-emerald-400">Back to Dashboard</Link></div>;
  }

  const handleVerifyUserEmail = async (email: string) => {
    setVerifyingEmail(email);
    try {
      const res = await fetch("/api/admin/verify-user-email", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) refetchAnalytics();
      else alert("Failed to verify");
    } catch { alert("Failed to verify"); }
    finally { setVerifyingEmail(null); }
  };

  // ── Nurture handlers ──────────────────────────────────────────
  const handleNurturePreview = async () => {
    setNurtureLoading(true);
    setNurtureResult(null);
    setNurtureStep("preview");
    try {
      const res = await fetch("/api/admin/nurture");
      const data = await res.json();
      if (res.ok) {
        setNurturePreview(data);
        // Select all stages by default
        const stages = new Set<string>(data.users.map((u: { stage: string }) => u.stage));
        setSelectedStages(stages);
      } else {
        alert(data.error || "Failed to load preview");
        setNurtureStep("idle");
      }
    } catch { alert("Failed to load preview"); setNurtureStep("idle"); }
    finally { setNurtureLoading(false); }
  };

  const handleNurtureSend = async () => {
    setNurtureSending(true);
    setNurtureStep("sending");
    try {
      const res = await fetch("/api/admin/nurture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stages: Array.from(selectedStages) }),
      });
      const data = await res.json();
      if (res.ok) {
        setNurtureResult(data);
        setNurtureStep("done");
      } else {
        alert(data.error || "Failed to send");
        setNurtureStep("preview");
      }
    } catch { alert("Failed to send"); setNurtureStep("preview"); }
    finally { setNurtureSending(false); }
  };

  const toggleStage = (stage: string) => {
    setSelectedStages((prev) => {
      const next = new Set(prev);
      if (next.has(stage)) next.delete(stage);
      else next.add(stage);
      return next;
    });
  };

  if (!analytics) {
    return <div className="min-h-screen flex items-center justify-center bg-zinc-950"><p className="text-zinc-400">Failed to load analytics.</p></div>;
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="border-b border-zinc-800 px-6 py-4">
        <div className="max-w-5xl flex items-center justify-between">
          <Link href="/dashboard" className="text-lg font-semibold text-zinc-100">{APP_DISPLAY_NAME}</Link>
          <span className="text-sm text-zinc-500">Admin</span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-semibold text-zinc-100 mb-2">Analytics</h1>
        <p className="text-sm text-zinc-500 mb-8">Users, signups, campaigns, and nurture tools.</p>

        {/* ── Stat cards ───────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {[
            { label: "Total users", value: analytics.totalUsers },
            { label: "Signups (7 days)", value: analytics.signupsLast7Days },
            { label: "Signups (30 days)", value: analytics.signupsLast30Days },
            { label: "Campaigns sent", value: analytics.totalCampaigns },
            { label: "Total leads", value: analytics.totalLeads },
            { label: "Completed onboarding", value: analytics.workspacesWithDomain },
          ].map((s, i) => (
            <div key={i} className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-5">
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">{s.label}</p>
              <p className="mt-2 text-2xl font-semibold text-zinc-100 tabular-nums">{s.value}</p>
            </div>
          ))}
        </div>

        {/* ── Funnel ───────────────────────────────────────────── */}
        <section className="mb-8">
          <h2 className="text-lg font-medium text-zinc-200 mb-2">User journey funnel</h2>
          <p className="text-sm text-zinc-500 mb-4">Where users get stuck, from signup to first send.</p>
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-5 overflow-x-auto">
            <table className="w-full min-w-[420px] text-sm">
              <thead>
                <tr className="border-b border-zinc-700 text-left text-zinc-500">
                  <th className="pb-3 pr-4">Step</th>
                  <th className="pb-3 pr-4 text-right">Count</th>
                  <th className="pb-3 pr-4 text-right">% of prev</th>
                  <th className="pb-3">Gap</th>
                </tr>
              </thead>
              <tbody className="text-zinc-300">
                {[
                  { label: "1. Signed up", count: analytics.totalUsers, prev: null as number | null, gap: null as string | null },
                  { label: "2. Verified email", count: analytics.usersVerified ?? 0, prev: analytics.totalUsers, gap: `${Math.max(0, analytics.totalUsers - (analytics.usersVerified ?? 0))} not verified` },
                  { label: "3. Completed onboarding", count: analytics.workspacesWithDomain, prev: analytics.usersVerified ?? 0, gap: `${Math.max(0, (analytics.usersVerified ?? 0) - analytics.workspacesWithDomain)} no domain` },
                  { label: "4. Added Anthropic key", count: analytics.usersWithAnthropicKey ?? 0, prev: analytics.workspacesWithDomain, gap: "optional" },
                  { label: "5. Added Instantly key", count: analytics.usersWithInstantlyKey ?? 0, prev: analytics.workspacesWithDomain, gap: `${Math.max(0, analytics.workspacesWithDomain - (analytics.usersWithInstantlyKey ?? 0))} missing` },
                  { label: "6. Created campaign", count: analytics.usersWhoCreatedCampaign ?? 0, prev: analytics.workspacesWithDomain, gap: `${Math.max(0, analytics.workspacesWithDomain - (analytics.usersWhoCreatedCampaign ?? 0))} never started` },
                  { label: "7. Sent campaign", count: analytics.usersWhoSentCampaign ?? 0, prev: analytics.usersWhoCreatedCampaign ?? 0, gap: `${Math.max(0, (analytics.usersWhoCreatedCampaign ?? 0) - (analytics.usersWhoSentCampaign ?? 0))} created but never sent` },
                ].map((row, i) => (
                  <tr key={i} className={i < 6 ? "border-b border-zinc-800" : ""}>
                    <td className="py-2.5 pr-4 font-medium text-zinc-200">{row.label}</td>
                    <td className="py-2.5 pr-4 text-right tabular-nums">{row.count}</td>
                    <td className="py-2.5 pr-4 text-right tabular-nums">{row.prev != null && row.prev > 0 ? `${Math.round((row.count / row.prev) * 100)}%` : "\u2014"}</td>
                    <td className="py-2.5 text-zinc-500">{row.gap ?? "\u2014"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── NURTURE EMAIL SECTION ────────────────────────────── */}
        <section className="mb-8">
          <div className="rounded-2xl border border-emerald-800/50 bg-emerald-950/20 p-6">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-lg font-medium text-zinc-100">Nurture emails</h2>
                <p className="text-sm text-zinc-500 mt-1">
                  Send a hyper-personalized email to every user based on where they are in the funnel, their next best step, and all new features.
                </p>
              </div>
              {nurtureStep === "idle" && (
                <button
                  onClick={handleNurturePreview}
                  disabled={nurtureLoading}
                  className="shrink-0 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-500 disabled:opacity-50"
                >
                  {nurtureLoading ? "Loading..." : "Preview & send nurture emails"}
                </button>
              )}
            </div>

            {/* Preview */}
            {nurtureStep === "preview" && nurturePreview && (
              <div className="mt-4 space-y-4">
                <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-4">
                  <h3 className="text-sm font-medium text-zinc-300 mb-3">
                    {nurturePreview.totalUsers} users across {Object.keys(nurturePreview.byStage).length} stages
                  </h3>
                  <div className="space-y-2">
                    {Object.entries(nurturePreview.byStage).map(([stageLabel, count]) => {
                      const stageKey = nurturePreview.users.find((u) => u.stageLabel === stageLabel)?.stage ?? "";
                      const isSelected = selectedStages.has(stageKey);
                      return (
                        <label key={stageLabel} className="flex items-center gap-3 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleStage(stageKey)}
                            className="rounded border-zinc-600 bg-zinc-800 text-emerald-500 focus:ring-emerald-500"
                          />
                          <span className={`text-sm ${isSelected ? "text-zinc-200" : "text-zinc-500"}`}>
                            {stageLabel}
                          </span>
                          <span className="ml-auto text-xs tabular-nums text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded-full">
                            {count}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* User list */}
                <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-4 max-h-64 overflow-y-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-zinc-700 text-left text-zinc-500">
                        <th className="pb-2 pr-3">Email</th>
                        <th className="pb-2 pr-3">Stage</th>
                        <th className="pb-2 pr-3">Days</th>
                        <th className="pb-2">Next step</th>
                      </tr>
                    </thead>
                    <tbody>
                      {nurturePreview.users
                        .filter((u) => selectedStages.has(u.stage))
                        .map((u, i) => (
                          <tr key={i} className="border-b border-zinc-800/50">
                            <td className="py-1.5 pr-3 text-zinc-200">{u.email}</td>
                            <td className="py-1.5 pr-3 text-zinc-400 text-xs">{u.stageLabel}</td>
                            <td className="py-1.5 pr-3 text-zinc-500 tabular-nums">{u.daysSinceSignup}d</td>
                            <td className="py-1.5 text-zinc-500 text-xs max-w-[200px] truncate">{u.nextStep}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleNurtureSend}
                    disabled={nurtureSending || selectedStages.size === 0}
                    className="rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-500 disabled:opacity-50"
                  >
                    {nurtureSending
                      ? "Generating & sending..."
                      : `Send to ${nurturePreview.users.filter((u) => selectedStages.has(u.stage)).length} users`}
                  </button>
                  <button
                    onClick={() => { setNurtureStep("idle"); setNurturePreview(null); }}
                    className="rounded-lg border border-zinc-700 px-4 py-2.5 text-sm text-zinc-300 hover:bg-zinc-800"
                  >
                    Cancel
                  </button>
                  <p className="text-xs text-zinc-600 ml-2">
                    Each email is AI-generated uniquely per user via Claude Haiku
                  </p>
                </div>
              </div>
            )}

            {/* Sending */}
            {nurtureStep === "sending" && (
              <div className="mt-4 flex items-center gap-3">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
                <p className="text-sm text-zinc-400">Generating personalized emails and sending... this may take a minute.</p>
              </div>
            )}

            {/* Done */}
            {nurtureStep === "done" && nurtureResult && (
              <div className="mt-4 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="rounded-lg bg-emerald-600/20 px-4 py-2">
                    <p className="text-sm text-emerald-400 font-medium">{nurtureResult.sent} sent</p>
                  </div>
                  {nurtureResult.failed > 0 && (
                    <div className="rounded-lg bg-red-600/20 px-4 py-2">
                      <p className="text-sm text-red-400 font-medium">{nurtureResult.failed} failed</p>
                    </div>
                  )}
                </div>

                <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-4 max-h-64 overflow-y-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-zinc-700 text-left text-zinc-500">
                        <th className="pb-2 pr-3">Email</th>
                        <th className="pb-2 pr-3">Subject</th>
                        <th className="pb-2">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {nurtureResult.results.map((r, i) => (
                        <tr key={i} className="border-b border-zinc-800/50">
                          <td className="py-1.5 pr-3 text-zinc-200">{r.email}</td>
                          <td className="py-1.5 pr-3 text-zinc-400 text-xs">{r.subject}</td>
                          <td className="py-1.5">
                            {r.sent ? (
                              <span className="text-emerald-400 text-xs">Sent</span>
                            ) : (
                              <span className="text-red-400 text-xs">{r.error || "Failed"}</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <button
                  onClick={() => { setNurtureStep("idle"); setNurtureResult(null); setNurturePreview(null); }}
                  className="rounded-lg border border-zinc-700 px-4 py-2.5 text-sm text-zinc-300 hover:bg-zinc-800"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </section>

        {/* ── Recent signups & campaigns ───────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-5">
            <h2 className="text-sm font-medium text-zinc-300 mb-4">Recent signups</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-700 text-left text-zinc-500">
                    <th className="pb-2 pr-3">Email</th>
                    <th className="pb-2 pr-3">Name</th>
                    <th className="pb-2 pr-3">Signed up</th>
                    <th className="pb-2 pr-3">Verified</th>
                    <th className="pb-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.recentUsers.map((u) => (
                    <tr key={u.id} className="border-b border-zinc-800">
                      <td className="py-2 pr-3 text-zinc-200">{u.email}</td>
                      <td className="py-2 pr-3 text-zinc-400">{u.name ?? "\u2014"}</td>
                      <td className="py-2 pr-3 text-zinc-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td className="py-2 pr-3 text-zinc-500">{u.emailVerified ? "Yes" : "No"}</td>
                      <td className="py-2">
                        {u.emailVerified ? (
                          <span className="text-zinc-600 text-xs">\u2014</span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleVerifyUserEmail(u.email)}
                            disabled={verifyingEmail === u.email}
                            className="rounded border border-zinc-600 bg-zinc-800 px-2 py-1 text-xs text-zinc-300 hover:bg-zinc-700 disabled:opacity-50"
                          >
                            {verifyingEmail === u.email ? "Verifying..." : "Verify email"}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-5">
            <h2 className="text-sm font-medium text-zinc-300 mb-4">Recent campaigns</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-700 text-left text-zinc-500">
                    <th className="pb-2 pr-3">Campaign</th>
                    <th className="pb-2 pr-3">User / domain</th>
                    <th className="pb-2">Sent</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.recentCampaigns.map((c, i) => (
                    <tr key={`${c.createdAt}-${i}`} className="border-b border-zinc-800">
                      <td className="py-2 pr-3 text-zinc-200">
                        {c.name}
                        {c.variant ? <span className="ml-1 text-zinc-500">({c.variant})</span> : null}
                      </td>
                      <td className="py-2 pr-3 text-zinc-400">
                        {c.userEmail ?? "\u2014"}
                        {c.domain ? ` \u00B7 ${c.domain}` : ""}
                      </td>
                      <td className="py-2 text-zinc-500">{new Date(c.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <p className="mt-8 text-sm text-zinc-500">
          <Link href="/dashboard" className="text-emerald-500 hover:text-emerald-400">Back to Dashboard</Link>
        </p>
      </main>
    </div>
  );
}
