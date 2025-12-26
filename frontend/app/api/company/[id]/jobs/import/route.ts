// app/api/company/[id]/jobs/import/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabaseServer";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createSupabaseServerClient();
    const { id: companyId } = await params;

    const body = await req.json();
    const jobs = body.jobs as Array<{
      title: string;
      is_remote: boolean;
      location: string;
      department: string;
      employment_type: string;
      experience_level: string;
      salary_range: string;
      job_slug: string;
      posted_days_ago: number;
      skills: string[];
      last_application_date: string | null;
    }>;

    const rows = jobs.map((j) => ({
      title: j.title,
      description: "",
      location: j.location,
      employment_type: j.employment_type,
      experience_level: j.experience_level,
      is_remote: j.is_remote,
      department: j.department,
      skills: j.skills,
      last_application_date: j.last_application_date,
      assignment_url: null,
      application: null,
      company: companyId,
      salary_range: j.salary_range,
      job_slug: j.job_slug,
    }));

    console.log("jobs/import first row:", rows[0]);

    const { error: insertError } = await supabase
      .from("jobs")
      .insert(rows, { returning: "minimal" });

    if (insertError) {
      console.error("jobs/import insertError:", insertError);
      return NextResponse.json({ error: insertError.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("jobs/import fatal error:", err);
    return NextResponse.json(
      { error: err.message || "Unexpected error" },
      { status: 500 }
    );
  }
}
