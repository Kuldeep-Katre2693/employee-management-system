import {
  LayoutDashboard,
  Users,
  CalendarDays,
  ClipboardCheck,
  WalletCards,
  LogOut,
  Building2,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Sidebar() {
  const { role, logout } = useAuth();

  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Employees",
      path: "/employees",
      icon: Users,
      roles: ["ADMIN", "MANAGER", "EMPLOYEE"],
    },
    {
      name: "Leave Management",
      path: "/leaves",
      icon: CalendarDays,
      roles: ["ADMIN", "MANAGER", "EMPLOYEE"],
    },
    {
      name: "Attendance",
      path: "/attendance",
      icon: ClipboardCheck,
      roles: ["ADMIN", "MANAGER", "EMPLOYEE"],
    },
    {
      name: "Payroll",
      path: "/payroll",
      icon: WalletCards,
      roles: ["ADMIN", "MANAGER", "EMPLOYEE"],
    },
  ];

  const visibleItems = menuItems.filter(
    (item) => !item.roles || item.roles.includes(role)
  );

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-icon">
          <Building2 size={22} />
        </div>

        <div>
          <h2>WorkSphere</h2>
          <span>HR Management</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <p className="nav-label">MAIN MENU</p>

        {visibleItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `nav-item ${isActive ? "active" : ""}`
              }
            >
              <Icon size={19} />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      <button className="logout-button" onClick={logout}>
        <LogOut size={18} />
        <span>Logout</span>
      </button>
    </aside>
  );
}

export default Sidebar;