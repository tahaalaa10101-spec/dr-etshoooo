"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Student {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function AdminStudents() {
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  async function fetchStudents() {
    try {
      const res = await fetch("/api/students");
      if (res.ok) {
        const result = await res.json();
        if (result.success && result.data) {
          setStudents(result.data);
        }
      }
    } catch {
      console.error("Failed to fetch students");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/students?id=${deleteId}`, { method: "DELETE" });
      if (res.ok) {
        setDeleteId(null);
        router.refresh();
      }
    } catch {
      console.error("Failed to delete student");
    }
  }

  const filtered = search
    ? students.filter(
        (s) =>
          s.name.toLowerCase().includes(search.toLowerCase()) ||
          s.email.toLowerCase().includes(search.toLowerCase())
      )
    : students;

  function getRoleBadge(role: string) {
    switch (role) {
      case "admin":
        return "bg-accent/10 text-accent";
      case "instructor":
        return "bg-warning/10 text-warning";
      default:
        return "bg-success/10 text-success";
    }
  }

  function formatDate(d: string) {
    return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1400px] space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-accent mb-1">Users</p>
          <h2 className="text-2xl font-bold text-text-primary">Students</h2>
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email..."
          className="rounded-xl border border-border bg-surface/60 px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted w-full sm:w-72"
        />
      </div>

      <div className="rounded-2xl border border-border bg-surface/40 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wider text-text-muted">Name</th>
                <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wider text-text-muted">Email</th>
                <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wider text-text-muted">Role</th>
                <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wider text-text-muted">Joined</th>
                <th className="text-right px-5 py-3 text-xs font-bold uppercase tracking-wider text-text-muted">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((student) => (
                <tr key={student.id} className="border-b border-border last:border-0 hover:bg-surface/40 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                        <span className="text-accent text-sm font-semibold">{student.name.charAt(0).toUpperCase()}</span>
                      </div>
                      <span className="text-sm text-text-primary font-medium">{student.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-text-secondary">{student.email}</td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadge(student.role)}`}>
                      {student.role}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm text-text-muted">{formatDate(student.createdAt)}</td>
                  <td className="px-5 py-4 text-right">
                    {student.role !== "admin" && (
                      <button onClick={() => setDeleteId(student.id)} className="text-danger hover:text-red-400 text-sm font-medium">
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-text-muted text-sm">No students found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="text-sm text-text-muted">
        Total: {filtered.length} user{filtered.length !== 1 ? "s" : ""}
      </div>

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-surface border border-border rounded-2xl w-full max-w-sm p-6 mx-4">
            <h3 className="text-lg font-semibold text-text-primary mb-2">Confirm Delete</h3>
            <p className="text-sm text-text-secondary mb-6">Are you sure you want to delete this student? This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteId(null)} className="rounded-xl border border-border px-5 py-2.5 text-sm font-medium text-text-secondary">Cancel</button>
              <button onClick={handleDelete} className="rounded-xl bg-danger px-5 py-2.5 text-sm font-semibold text-white">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
