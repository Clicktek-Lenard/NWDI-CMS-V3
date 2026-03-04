"use client";

import { useState, useCallback, useEffect } from "react";
import {
  UserPlus,
  Search,
  Eye,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  ShieldCheck,
  Users,
} from "lucide-react";
import { UserModal, PERMISSION_GROUPS } from "./user-modal";
import type { UserRecord } from "./user-modal";
import { ViewUserModal } from "./view-user-modal";
import { DeleteUserDialog } from "./delete-user-dialog";

// ── Helpers ───────────────────────────────────────────────────
function parsePermCount(role: string | null): number {
  if (!role) return 0;
  try {
    const arr = JSON.parse(role);
    return Array.isArray(arr) ? arr.length : 0;
  } catch {
    return 0;
  }
}

function getPermLabels(role: string | null): string[] {
  if (!role) return [];
  try {
    const arr = JSON.parse(role) as { module: string; tab: string }[];
    const labels: string[] = [];
    for (const r of arr) {
      for (const group of PERMISSION_GROUPS) {
        const match = group.permissions.find(
          (p) => p.module === r.module && p.tab === r.tab
        );
        if (match) labels.push(match.label);
      }
    }
    return labels;
  } catch {
    return [];
  }
}

interface ApiResponse {
  success: boolean;
  data: UserRecord[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ── Component ─────────────────────────────────────────────────
export function UserManagementClient() {
  // Data state
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Filter state
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"" | "active" | "inactive">("");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;

  // Modal state
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserRecord | null>(null);

  // ── Fetch ─────────────────────────────────────────────────
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError("");

    const params = new URLSearchParams({
      page: String(page),
      pageSize: String(PAGE_SIZE),
    });
    if (search) params.set("search", search);
    if (statusFilter) params.set("status", statusFilter);

    try {
      const res = await fetch(`/api/users?${params.toString()}`);
      const json: ApiResponse = await res.json();

      if (!res.ok || !json.success) {
        setError("Failed to load users");
        return;
      }

      setUsers(json.data);
      setTotal(json.total);
      setTotalPages(json.totalPages);
    } catch {
      setError("Network error — unable to load users");
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Debounce search → reset to page 1
  useEffect(() => {
    setPage(1);
  }, [search, statusFilter]);

  // ── Actions ───────────────────────────────────────────────
  function openView(user: UserRecord) {
    setSelectedUser(user);
    setViewOpen(true);
  }

  function openEdit(user: UserRecord) {
    setSelectedUser(user);
    setViewOpen(false);
    setEditOpen(true);
  }

  function openDelete(user: UserRecord) {
    setSelectedUser(user);
    setDeleteOpen(true);
  }

  const handleSaved = useCallback(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleDeleted = useCallback(() => {
    fetchUsers();
  }, [fetchUsers]);

  // ── Render ────────────────────────────────────────────────
  const startIdx = (page - 1) * PAGE_SIZE + 1;
  const endIdx = Math.min(page * PAGE_SIZE, total);

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Left: search + filter */}
        <div className="flex flex-1 items-center gap-2">
          {/* Search */}
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search users…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="block w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-4 text-sm text-slate-800 shadow-sm placeholder:text-slate-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as "" | "active" | "inactive")}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          {/* Refresh */}
          <button
            onClick={fetchUsers}
            disabled={loading}
            className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-500 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-700 disabled:opacity-50"
            title="Refresh"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>

        {/* Right: add button */}
        <button
          onClick={() => setAddOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-700 active:scale-[0.98]"
        >
          <UserPlus className="h-4 w-4" />
          Add User
        </button>
      </div>

      {/* Table card */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* Error */}
        {error && (
          <div className="border-b border-red-100 bg-red-50 px-6 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70">
                <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  User
                </th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Username
                </th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Department
                </th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Permissions
                </th>
                <th className="px-4 py-3.5 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Status
                </th>
                <th className="px-4 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading && users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center">
                    <RefreshCw className="mx-auto h-6 w-6 animate-spin text-slate-300" />
                    <p className="mt-2 text-sm text-slate-400">Loading users…</p>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center">
                    <Users className="mx-auto h-8 w-8 text-slate-200" />
                    <p className="mt-2 text-sm font-medium text-slate-400">No users found</p>
                    {search && (
                      <p className="text-xs text-slate-300">
                        Try adjusting your search
                      </p>
                    )}
                  </td>
                </tr>
              ) : (
                users.map((user) => {
                  const fullName =
                    [user.first_name, user.last_name].filter(Boolean).join(" ") || user.username || "Unknown";
                  const initials =
                    [user.first_name?.[0], user.last_name?.[0]]
                      .filter(Boolean)
                      .join("")
                      .toUpperCase() || (user.username?.[0] ?? "?").toUpperCase();
                  const permCount = parsePermCount(user.role);
                  const permLabels = getPermLabels(user.role);

                  return (
                    <tr
                      key={user.id}
                      className="group transition-colors hover:bg-slate-50/60"
                    >
                      {/* User */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-blue-500 to-indigo-600 text-sm font-bold text-white">
                            {initials}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-slate-800 truncate">{fullName}</p>
                            <p className="text-xs text-slate-400 truncate">{user.email || "No email"}</p>
                          </div>
                        </div>
                      </td>

                      {/* Username */}
                      <td className="px-4 py-4">
                        <span className="font-mono text-xs font-medium text-slate-600">
                          @{user.username}
                        </span>
                        {user.ldap_import === 1 && (
                          <span className="ml-1.5 rounded-full bg-purple-100 px-1.5 py-0.5 text-[10px] font-medium text-purple-600">
                            LDAP
                          </span>
                        )}
                      </td>

                      {/* Department */}
                      <td className="px-4 py-4 text-slate-600">
                        {user.department || <span className="text-slate-300">—</span>}
                      </td>

                      {/* Permissions */}
                      <td className="px-4 py-4">
                        {permCount === 0 ? (
                          <span className="text-xs text-slate-300">No permissions</span>
                        ) : (
                          <div className="flex items-center gap-1.5">
                            <ShieldCheck className="h-3.5 w-3.5 text-blue-400" />
                            <span className="text-xs font-medium text-slate-600">
                              {permCount} module{permCount !== 1 ? "s" : ""}
                            </span>
                            {/* Hover tooltip preview */}
                            <div className="relative group/perm">
                              <span className="cursor-default text-[10px] text-slate-400 underline underline-offset-2 decoration-dotted">
                                view
                              </span>
                              <div className="pointer-events-none absolute bottom-full left-0 z-10 mb-1.5 hidden w-max max-w-55 rounded-xl border border-slate-200 bg-white p-3 shadow-xl group-hover/perm:block">
                                <div className="flex flex-wrap gap-1">
                                  {permLabels.map((label) => (
                                    <span
                                      key={label}
                                      className="rounded bg-blue-50 px-1.5 py-0.5 text-[10px] font-medium text-blue-700"
                                    >
                                      {label}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-4 text-center">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            user.activated === 1
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-red-100 text-red-600"
                          }`}
                        >
                          {user.activated === 1 ? "Active" : "Inactive"}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-4 text-right">
                        <div className="inline-flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                          <button
                            onClick={() => openView(user)}
                            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                            title="View"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => openEdit(user)}
                            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-amber-50 hover:text-amber-600"
                            title="Edit"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => openDelete(user)}
                            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {total > 0 && (
          <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4">
            <p className="text-xs text-slate-400">
              Showing{" "}
              <span className="font-medium text-slate-600">{startIdx}–{endIdx}</span>{" "}
              of{" "}
              <span className="font-medium text-slate-600">{total}</span> users
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1 || loading}
                className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              {/* Page numbers */}
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let pageNum: number;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (page <= 3) {
                  pageNum = i + 1;
                } else if (page >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = page - 2 + i;
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`min-w-8 rounded-lg px-2 py-1.5 text-xs font-medium transition-colors ${
                      pageNum === page
                        ? "bg-blue-600 text-white"
                        : "text-slate-500 hover:bg-slate-100"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages || loading}
                className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <UserModal
        open={addOpen}
        mode="add"
        onClose={() => setAddOpen(false)}
        onSaved={handleSaved}
      />

      <UserModal
        open={editOpen}
        mode="edit"
        user={selectedUser ?? undefined}
        onClose={() => setEditOpen(false)}
        onSaved={handleSaved}
      />

      <ViewUserModal
        open={viewOpen}
        user={selectedUser}
        onClose={() => setViewOpen(false)}
        onEdit={() => openEdit(selectedUser!)}
      />

      <DeleteUserDialog
        open={deleteOpen}
        user={selectedUser}
        onClose={() => setDeleteOpen(false)}
        onDeleted={handleDeleted}
      />
    </div>
  );
}
