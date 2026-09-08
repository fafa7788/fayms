import { notFound } from "next/navigation";
import AdminShell from "@/components/AdminShell";
import ProjectForm from "@/components/ProjectForm";
import db, { Project } from "@/lib/db";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: idParam } = await params;
  const id = Number(idParam);
  if (!Number.isInteger(id)) notFound();

  const project = db.prepare("SELECT * FROM projects WHERE id = ?").get(id) as
    | Project
    | undefined;

  if (!project) notFound();

  return (
    <AdminShell>
      <h1 className="font-display text-2xl font-medium mb-8">Edit project</h1>
      <ProjectForm project={project} />
    </AdminShell>
  );
}
