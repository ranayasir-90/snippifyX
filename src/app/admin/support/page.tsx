"use client";
import { useState, useEffect } from "react";
import AdminRouteGuard from "@/components/AdminRouteGuard";
import AdminLayout from "@/layouts/AdminLayout";
import { supportService, SupportTicket } from "@/lib/firebaseServices";
import { FiSearch, FiMail, FiUser, FiClock, FiCheckCircle, FiXCircle, FiTrash2, FiSend } from "react-icons/fi";

export default function AdminSupport() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<SupportTicket | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [reply, setReply] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const pageSize = 8;

  const fetchTickets = () => {
    setLoading(true);
    supportService.getAll().then((data) => {
      setTickets(data);
      setLoading(false);
    }).catch(() => {
      setTickets([]);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const filtered = tickets.filter(
    t => t.subject.toLowerCase().includes(search.toLowerCase()) ||
      t.user.toLowerCase().includes(search.toLowerCase()) ||
      t.status.toLowerCase().includes(search.toLowerCase()) ||
      (typeof t.date === "object" && "toDate" in t.date ? t.date.toDate().toLocaleString() : "").toLowerCase().includes(search.toLowerCase())
  );
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(filtered.length / pageSize);

  const handleReply = async () => {
    if (!selected) return;
    setActionLoading(true);
    await supportService.reply(selected.id!, { message: reply, user: "Admin" });
    setReply("");
    setActionLoading(false);
    fetchTickets();
  };
  const handleClose = async () => {
    if (!selected) return;
    setActionLoading(true);
    await supportService.close(selected.id!);
    setActionLoading(false);
    fetchTickets();
  };
  const handleDelete = async () => {
    if (!selected) return;
    setActionLoading(true);
    await supportService.delete(selected.id!);
    setSelected(null);
    setActionLoading(false);
    fetchTickets();
  };

  return (
    <AdminRouteGuard>
      <AdminLayout>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h1 className="text-2xl font-bold">Support</h1>
          <div className="relative w-full md:w-72">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 bg-white focus:outline-none"
              placeholder="Search tickets..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
        </div>
        {loading ? (
          <div className="py-12 text-center text-gray-400">Loading tickets...</div>
        ) : filtered.length === 0 ? (
          <div className="py-12 text-center text-gray-400">No tickets found.</div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left font-semibold">Subject</th>
                  <th className="px-4 py-3 text-left font-semibold">User</th>
                  <th className="px-4 py-3 text-left font-semibold">Date</th>
                  <th className="px-4 py-3 text-left font-semibold">Status</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {paginated.map(ticket => (
                  <tr key={ticket.id} className="border-t border-gray-100 hover:bg-blue-50/30">
                    <td className="px-4 py-3 flex items-center gap-2"><FiMail className="text-blue-400" />{ticket.subject}</td>
                    <td className="px-4 py-3 flex items-center gap-2"><FiUser className="text-green-400" />{ticket.user}</td>
                    <td className="px-4 py-3 flex items-center gap-2"><FiClock className="text-gray-400" />{typeof ticket.date === "object" && "toDate" in ticket.date ? ticket.date.toDate().toLocaleString() : ""}</td>
                    <td className="px-4 py-3">
                      {ticket.status === "Open" && <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-green-100 text-green-700 text-xs"><FiCheckCircle />Open</span>}
                      {ticket.status === "Closed" && <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-gray-200 text-gray-500 text-xs"><FiXCircle />Closed</span>}
                      {ticket.status === "Pending" && <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-yellow-100 text-yellow-700 text-xs">Pending</span>}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button className="text-blue-600 hover:underline" onClick={() => setSelected(ticket)}>Details</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Pagination */}
            <div className="flex justify-between items-center px-4 py-3 border-t border-gray-100">
              <span className="text-xs text-gray-400">Page {page} of {totalPages}</span>
              <div className="flex gap-2">
                <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1 rounded bg-gray-100 text-gray-600 disabled:opacity-50">Prev</button>
                <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="px-3 py-1 rounded bg-gray-100 text-gray-600 disabled:opacity-50">Next</button>
              </div>
            </div>
          </div>
        )}
        {/* Ticket Detail Modal */}
        {selected && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md relative">
              <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-600" onClick={() => setSelected(null)}>&times;</button>
              <div className="flex items-center gap-2 mb-4"><FiMail className="text-blue-500" /><span className="font-semibold">Ticket Details</span></div>
              <div className="mb-2"><span className="font-medium">Subject:</span> {selected.subject}</div>
              <div className="mb-2"><span className="font-medium">User:</span> {selected.user}</div>
              <div className="mb-2"><span className="font-medium">Date:</span> {typeof selected.date === "object" && "toDate" in selected.date ? selected.date.toDate().toLocaleString() : ""}</div>
              <div className="mb-2"><span className="font-medium">Status:</span> {selected.status}</div>
              <div className="mb-4"><span className="font-medium">Message:</span> {selected.message}</div>
              {selected.replies && selected.replies.length > 0 && (
                <div className="mb-4">
                  <div className="font-medium mb-1">Replies:</div>
                  <ul className="space-y-1">
                    {selected.replies.map((r, i) => (
                      <li key={i} className="text-xs text-gray-700 border-l-2 border-blue-400 pl-2">
                        <span className="font-semibold">{r.user}:</span> {r.message} <span className="text-gray-400">({typeof r.date === "object" && "toDate" in r.date ? r.date.toDate().toLocaleString() : ""})</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {selected.status !== "Closed" && (
                <div className="mb-4">
                  <textarea
                    className="w-full rounded-xl border border-gray-200 bg-white p-2 mb-2"
                    rows={2}
                    placeholder="Type your reply..."
                    value={reply}
                    onChange={e => setReply(e.target.value)}
                    disabled={actionLoading}
                  />
                  <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold disabled:opacity-50" onClick={handleReply} disabled={actionLoading || !reply}><FiSend />Reply</button>
                </div>
              )}
              <div className="flex gap-2">
                {selected.status !== "Closed" && <button className="flex items-center gap-1 px-3 py-1 rounded bg-gray-100 text-gray-600 disabled:opacity-50" onClick={handleClose} disabled={actionLoading}><FiXCircle />Close</button>}
                <button className="flex items-center gap-1 px-3 py-1 rounded bg-red-100 text-red-700 disabled:opacity-50" onClick={handleDelete} disabled={actionLoading}><FiTrash2 />Delete</button>
              </div>
            </div>
          </div>
        )}
      </AdminLayout>
    </AdminRouteGuard>
  );
} 