import { createFileRoute, useNavigate, Link, useRouterState } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import { LogOut, Search, Sparkles, Users } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Card } from "../components/ui/card";
import { toast } from "sonner";
import { Toaster } from "../components/ui/sonner";
import { supabase } from "../lib/supabase";
import { useDebounce } from "../hooks/useDebounce";

// Server-side route protection: validate session before rendering
const protectAdminRoute = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  
  if (!session) {
    throw new Error("Unauthorized");
  }
  
  return { session };
};

export const Route = createFileRoute("/admin")({
  beforeLoad: protectAdminRoute,
  head: () => ({
    meta: [
      { title: "Admin Dashboard — LeadDesk Mini" },
      { name: "description", content: "Manage and triage incoming leads in real time." },
      { property: "og:title", content: "Admin Dashboard — LeadDesk Mini" },
      { property: "og:description", content: "Manage leads from one clean dashboard." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AdminPage,
  errorComponent: () => <AdminErrorPage />,
});

type Status = "New" | "Contacted" | "Closed";
type Lead = {
  id: string;
  name: string;
  email: string;
  budget: string;
  message: string;
  created_at: string;
  status: Status;
};

const statusStyles: Record<Status, string> = {
  New: "bg-blue-500/15 text-blue-600 border-blue-500/30 dark:text-blue-400",
  Contacted:
    "bg-yellow-500/15 text-yellow-700 border-yellow-500/30 dark:text-yellow-400",
  Closed:
    "bg-green-500/15 text-green-700 border-green-500/30 dark:text-green-400",
};

function AdminErrorPage() {
  const navigate = useNavigate();
  
  useEffect(() => {
    navigate({ to: "/login" });
  }, [navigate]);
  
  return null;
}

function AdminPage() {
  const navigate = useNavigate();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [queryInput, setQueryInput] = useState("");
  const debouncedQuery = useDebounce(queryInput, 300);
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string>();

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        navigate({ to: "/login" });
        return;
      }
      setUserEmail(session.user.email);
      await fetchLeads();
    };
    checkAuth();
  }, [navigate]);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setLeads(data || []);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to load leads";
      toast.error(msg);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    return leads.filter((l) => {
      const q = debouncedQuery.toLowerCase();
      const matchQ =
        !q ||
        l.name.toLowerCase().includes(q) ||
        l.email.toLowerCase().includes(q);
      const matchS = statusFilter === "All" || l.status === statusFilter;
      return matchQ && matchS;
    });
  }, [leads, debouncedQuery, statusFilter]);

  const updateStatus = async (id: string, status: Status) => {
    try {
      const { error } = await supabase
        .from("leads")
        .update({ status })
        .eq("id", id);

      if (error) throw error;

      setLeads((prev) =>
        prev.map((l) => (l.id === id ? { ...l, status } : l))
      );
      toast.success("Lead status updated");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to update status";
      toast.error(msg);
      console.error(err);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate({ to: "/login" });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Logout failed";
      toast.error(msg);
    }
  };

  const counts = useMemo(
    () => ({
      total: leads.length,
      new: leads.filter((l) => l.status === "New").length,
      contacted: leads.filter((l) => l.status === "Contacted").length,
      closed: leads.filter((l) => l.status === "Closed").length,
    }),
    [leads],
  );

  return (
    <div className="min-h-screen bg-muted/30">
      <Toaster />
      {/* Top nav */}
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
          <Link to="/admin" className="flex items-center gap-2 font-semibold">
            <div className="grid h-8 w-8 place-items-center rounded-md bg-primary text-primary-foreground">
              <Sparkles className="h-4 w-4" />
            </div>
            LeadDesk Mini
          </Link>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-sm">
              <Avatar className="h-8 w-8">
                <AvatarFallback>
                  {userEmail?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-muted-foreground">{userEmail}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="gap-2"
            >
              <LogOut className="h-4 w-4" /> Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8 space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Leads</h1>
            <p className="text-sm text-muted-foreground">
              Manage and triage incoming inquiries.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Total leads", value: counts.total, icon: Users },
            { label: "New", value: counts.new, tone: "text-blue-600 dark:text-blue-400" },
            { label: "Contacted", value: counts.contacted, tone: "text-yellow-700 dark:text-yellow-400" },
            { label: "Closed", value: counts.closed, tone: "text-green-700 dark:text-green-400" },
          ].map((s) => (
            <Card key={s.label} className="p-4">
              <div className="text-xs text-muted-foreground">{s.label}</div>
              <div className={`mt-1 text-2xl font-semibold ${s.tone ?? ""}`}>
                {s.value}
              </div>
            </Card>
          ))}
        </div>

        {/* Controls */}
        <Card className="p-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={queryInput}
                onChange={(e) => setQueryInput(e.target.value)}
                placeholder="Search by name or email..."
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All statuses</SelectItem>
                <SelectItem value="New">New</SelectItem>
                <SelectItem value="Contacted">Contacted</SelectItem>
                <SelectItem value="Closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Table */}
        <Card className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Budget</TableHead>
                <TableHead className="max-w-xs">Message</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center text-sm text-muted-foreground py-12"
                  >
                    Loading leads...
                  </TableCell>
                </TableRow>
              ) : filtered.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center text-sm text-muted-foreground py-12"
                  >
                    No leads match your filters.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((l) => (
                  <TableRow key={l.id}>
                    <TableCell className="font-medium">{l.name}</TableCell>
                    <TableCell className="text-muted-foreground">{l.email}</TableCell>
                    <TableCell>{l.budget}</TableCell>
                    <TableCell className="max-w-xs truncate text-muted-foreground">
                      {l.message}
                    </TableCell>
                    <TableCell className="text-muted-foreground whitespace-nowrap">
                      {new Date(l.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Select
                        value={l.status}
                        onValueChange={(v) => updateStatus(l.id, v as Status)}
                      >
                        <SelectTrigger className="h-8 w-[140px] border-0 bg-transparent p-0 shadow-none focus:ring-0">
                          <Badge
                            variant="outline"
                            className={`${statusStyles[l.status]} border`}
                          >
                            {l.status}
                          </Badge>
                        </SelectTrigger>
                        <SelectContent align="end">
                          <SelectItem value="New">New</SelectItem>
                          <SelectItem value="Contacted">Contacted</SelectItem>
                          <SelectItem value="Closed">Closed</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      </main>
    </div>
  );
}
