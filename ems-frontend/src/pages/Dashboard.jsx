import { useEffect, useState } from "react";
import {
  Users,
  CalendarClock,
  ClipboardCheck,
  WalletCards,
  ArrowUpRight,
} from "lucide-react";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function Dashboard() {
  const { role } = useAuth();

  const [stats, setStats] = useState({
    employees: null,
    leaves: null,
    attendance: null,
    payroll: null,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const employeeRequest = api.get("/employees");

        let leaveRequest;
        let attendanceRequest;
        let payrollRequest;

        if (role === "ADMIN" || role === "MANAGER") {
          leaveRequest = api.get("/leaves");
          attendanceRequest = api.get("/attendance");
          payrollRequest = api.get("/payroll");
        } else {
          attendanceRequest = api.get("/attendance/my");
          payrollRequest = api.get("/payroll/my");
        }

        const results = await Promise.allSettled([
          employeeRequest,
          leaveRequest,
          attendanceRequest,
          payrollRequest,
        ]);

        const employeeResult = results[0];
        const leaveResult = results[1];
        const attendanceResult = results[2];
        const payrollResult = results[3];

        setStats({
          employees:
            employeeResult.status === "fulfilled"
              ? employeeResult.value.data.length
              : 0,

          leaves:
            leaveResult?.status === "fulfilled"
              ? leaveResult.value.data.filter(
                  (leave) => leave.status === "PENDING"
                ).length
              : null,

          attendance:
            attendanceResult?.status === "fulfilled"
              ? attendanceResult.value.data.length
              : 0,

          payroll:
            payrollResult?.status === "fulfilled"
              ? payrollResult.value.data.length
              : 0,
        });
      } catch (error) {
        console.error("Dashboard loading error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [role]);

  const cards = [
    {
      title: "Total Employees",
      value: loading ? "..." : stats.employees ?? "—",
      description: "Registered employees",
      icon: Users,
    },
    {
      title: "Pending Leaves",
      value:
        loading
          ? "..."
          : role === "EMPLOYEE"
            ? "—"
            : stats.leaves ?? "—",
      description:
        role === "EMPLOYEE"
          ? "Managed by HR"
          : "Requests awaiting action",
      icon: CalendarClock,
    },
    {
      title: "Attendance Records",
      value: loading ? "..." : stats.attendance ?? "—",
      description:
        role === "EMPLOYEE"
          ? "Your attendance records"
          : "Recorded attendance",
      icon: ClipboardCheck,
    },
    {
      title: "Payroll Records",
      value: loading ? "..." : stats.payroll ?? "—",
      description:
        role === "EMPLOYEE"
          ? "Your payroll records"
          : "Generated payroll records",
      icon: WalletCards,
    },
  ];

  return (
    <div className="dashboard">
      <div className="page-heading">
        <div>
          <p className="eyebrow">OVERVIEW</p>

          <h1>Dashboard</h1>

          <p className="page-description">
            Monitor your organization's workforce and HR activities.
          </p>
        </div>

        <div className="role-badge">{role}</div>
      </div>

      <section className="stats-grid">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div className="stat-card" key={card.title}>
              <div className="stat-top">
                <div className="stat-icon">
                  <Icon size={21} />
                </div>

                <ArrowUpRight
                  size={18}
                  className="stat-arrow"
                />
              </div>

              <h3>{card.value}</h3>

              <p className="stat-title">
                {card.title}
              </p>

              <span>{card.description}</span>
            </div>
          );
        })}
      </section>

      <section className="dashboard-grid">
        <div className="dashboard-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">SYSTEM</p>
              <h2>WorkSphere Overview</h2>
            </div>
          </div>

          <div className="overview-content">
            <div className="overview-row">
              <span>System Status</span>
              <strong className="status-active">
                Operational
              </strong>
            </div>

            <div className="overview-row">
              <span>Current Role</span>
              <strong>{role}</strong>
            </div>

            <div className="overview-row">
              <span>Authentication</span>
              <strong>JWT Secured</strong>
            </div>

            <div className="overview-row">
              <span>Backend API</span>
              <strong>Connected</strong>
            </div>
          </div>
        </div>

        <div className="dashboard-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">QUICK ACCESS</p>
              <h2>HR Modules</h2>
            </div>
          </div>

          <div className="quick-list">
            <div>
              <Users size={19} />
              <span>Employee Management</span>
            </div>

            <div>
              <CalendarClock size={19} />
              <span>Leave Management</span>
            </div>

            <div>
              <ClipboardCheck size={19} />
              <span>Attendance Tracking</span>
            </div>

            <div>
              <WalletCards size={19} />
              <span>Payroll Management</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Dashboard;