import { Bell, UserCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { username, role } = useAuth();

  return (
    <header className="topbar">
      <div>
        <p className="topbar-subtitle">Welcome back</p>
        <h2>{username}</h2>
      </div>

      <div className="topbar-right">
        <button className="icon-button">
          <Bell size={20} />
        </button>

        <div className="profile">
          <UserCircle size={36} />

          <div>
            <strong>{username}</strong>
            <span>{role}</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;