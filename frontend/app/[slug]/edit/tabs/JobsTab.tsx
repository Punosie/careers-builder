"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Papa from "papaparse";
import * as XLSX from "xlsx";

type JobRow = {
  title: string;
  is_remote: string;
  location: string;
  department: string;
  employment_type: string;
  experience_level: string;
  job_type: string;
  salary_range: string;
  job_slug: string;
  posted_days_ago: string;
  skills: string;
  last_application_date: string;
};

export default function JobsTab({ companyId }: { companyId: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [parsedCount, setParsedCount] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const normalizeRecords = (rows: JobRow[]) => {
    return rows.map((row) => ({
      title: row.title,
      is_remote: row.is_remote === "true" || row.is_remote === "1",
      location: row.location,
      department: row.department,
      employment_type: row.employment_type,
      experience_level: row.experience_level,
      jobtype: row.job_type,
      salary_range: row.salary_range,
      job_slug: row.job_slug,
      posted_days_ago: Number(row.posted_days_ago || 0),
      skills: (row.skills || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      last_application_date: row.last_application_date || null,
    }));
  };

  const uploadRecords = async (
    records: ReturnType<typeof normalizeRecords>
  ) => {
    setParsedCount(records.length);

    const res = await fetch(`/api/company/${companyId}/jobs/import`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobs: records }),
    });

    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Failed to import jobs");
  };

  const handleParseAndUpload = () => {
    if (!file) return;
    setError(null);
    setSuccess(false);
    setUploading(true);

    const ext = file.name.split(".").pop()?.toLowerCase();

    // CSV
    if (ext === "csv") {
      Papa.parse<JobRow>(file, {
        header: true,
        skipEmptyLines: true,
        complete: async (results) => {
          try {
            const records = normalizeRecords(results.data);
            await uploadRecords(records);
            setSuccess(true);
          } catch (err: any) {
            setError(err.message || "Failed to process file");
          } finally {
            setUploading(false);
          }
        },
        error: (err) => {
          setError(err.message);
          setUploading(false);
        },
      });
      return;
    }

    // XLS / XLSX
    if (ext === "xlsx" || ext === "xls") {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const data = e.target?.result;
          if (!data) throw new Error("Unable to read file");

          const workbook = XLSX.read(data, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          const json = XLSX.utils.sheet_to_json<JobRow>(sheet, { defval: "" });

          const records = normalizeRecords(json);
          await uploadRecords(records);
          setSuccess(true);
        } catch (err: any) {
          setError(err.message || "Failed to process Excel file");
        } finally {
          setUploading(false);
        }
      };
      reader.onerror = () => {
        setError("Failed to read file");
        setUploading(false);
      };
      reader.readAsArrayBuffer(file);
      return;
    }

    // Unsupported extension
    setError("Unsupported file type. Please upload .csv, .xlsx or .xls");
    setUploading(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold mb-1">Jobs</h1>
        <p className="text-sm text-gray-500">
          Upload a CSV or Excel file to bulk import jobs for this company.
        </p>
      </div>

      <div className="space-y-3">
        <Label>Jobs file</Label>
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
          >
            Choose file
          </Button>
          <span className="text-sm text-gray-600">
            {file ? file.name : "No file chosen"}
          </span>
        </div>
        <input
          ref={fileInputRef}
          id="jobs_csv"
          type="file"
          accept=".csv,.xlsx,.xls"
          className="hidden"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
        <p className="text-xs text-gray-500">
          Expected columns: title, is_remote, location, department,
          employment_type, experience_level, job_type, salary_range, job_slug,
          posted_days_ago, skills, last_application_date
        </p>
      </div>

      {parsedCount !== null && (
        <p className="text-sm text-gray-600">
          Parsed {parsedCount} rows from file.
        </p>
      )}

      {error && <p className="text-sm text-red-500">{error}</p>}
      {success && (
        <p className="text-sm text-emerald-600">Jobs imported successfully.</p>
      )}

      <Button
        onClick={handleParseAndUpload}
        disabled={!file || uploading}
        className="bg-blue-700 hover:bg-blue-600"
      >
        {uploading ? "Uploading..." : "Upload & Import"}
      </Button>
    </div>
  );
}
