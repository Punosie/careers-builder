// app/api/jobs/[jobId]/apply/route.ts
import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabaseServer";

type LayoutApplication = {
  name: string;
  email: string;
  cv_url?: string | null;
};

export async function POST(
  req: Request,
  ctx: { params: Promise<{ jobId: string }> }
) {
  try {
    const { jobId } = await ctx.params;
    console.log("Apply API called for job:", jobId);

    const supabase = await createSupabaseServerClient();

    const body = (await req.json()) as LayoutApplication;
    console.log("Apply payload:", body);

    const { name, email, cv_url } = body;

    if (!name || !email) {
      console.error("Missing fields:", { name, email });
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    // Fetch existing applications jsonb[] from jobs
    const { data: job, error: jobError } = await supabase
      .from("jobs")
      .select("applications")
      .eq("id", jobId)
      .single();

    if (jobError || !job) {
      console.error("Job fetch error:", jobError);
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    const existingApplications = (job.applications as any[] | null) ?? [];

    const newApplication = {
      name,
      email,
      cv_url: cv_url ?? null,
      applied_at: new Date().toISOString(),
    };

    const updatedApplications = [...existingApplications, newApplication];

    const { error: updateError } = await supabase
      .from("jobs")
      .update({ applications: updatedApplications })
      .eq("id", jobId);

    if (updateError) {
      console.error("Apply update error:", updateError);
      return NextResponse.json(
        { error: "Failed to save application" },
        { status: 500 }
      );
    }

    console.log("Application saved for job:", jobId);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Apply route unexpected error:", err);
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
