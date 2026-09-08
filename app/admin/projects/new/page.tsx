import AdminShell from "@/components/AdminShell";
import ProjectForm from "@/components/ProjectForm";

export default function NewProjectPage() {
  return (
    <AdminShell>
      <h1 className="font-display text-2xl font-medium mb-8">Add project</h1>
      <ProjectForm />
    </AdminShell>
  );
}
