"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { NewJobApplication, UpdateJobApplication } from "@/lib/types";

// get all jobs for this user
export async function getJobs() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("job_applications")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}

// add a new job
export async function addJob(job: NewJobApplication) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("job_applications")
    .insert({ ...job, user_id: user.id });

  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/tracker");
}

// update any fields on a job
export async function updateJob({ id, ...fields }: UpdateJobApplication) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("job_applications")
    .update(fields)
    .eq("id", id)
    .eq("user_id", user.id); // extra safety: can't update someone else's row

  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/tracker");
}

// ── Delete a job ─────────────────────────────────────────────
export async function deleteJob(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("job_applications")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/tracker");
}

// ── Toggle star ──────────────────────────────────────────────
export async function toggleStar(id: string, current: boolean) {
  return updateJob({ id, is_starred: !current });
}
