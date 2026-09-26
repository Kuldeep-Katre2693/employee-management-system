import { useEffect, useState } from "react";
import {
  Clock,
  LogIn,
  LogOut,
  Search,
  CalendarDays,
} from "lucide-react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function Attendance() {
  const { role } = useAuth();

  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [marking, setMarking] = useState(false);

  const isEmployee = role === "EMPLOYEE";
  const isManagerOrAdmin =
    role === "MANAGER" || role === "ADMIN";

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      setError("");

      const endpoint = isEmployee
        ? "/attendance/my"
        : "/attendance";

      const response = await api.get(endpoint);

      setAttendance(response.data);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to load attendance records."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [role]);

  const handleMarkAttendance = async (status) => {
    try {
      setMarking(true);
      setError("");

      await api.post(
        `/attendance/mark?status=${status}`
      );

      await fetchAttendance();
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to mark attendance."
      );
    } finally {
      setMarking(false);
    }
  };

  const handleCheckout = async () => {
    try {
      setMarking(true);
      setError("");

      await api.put("/attendance/checkout");

      await fetchAttendance();
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to check out."
      );
    } finally {
      setMarking(false);
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "PRESENT":
        return "status-approved";

      case "ABSENT":
        return "status-rejected";

      case "HALF_DAY":
        return "status-pending";

      default:
        return "";
    }
  };

  const formatTime = (time) => {
    if (!time) return "-";

    return time.substring(0, 5);
  };

  const filteredAttendance = attendance.filter((record) => {
    const employee = record.employee;

    const employeeName = employee
      ? `${employee.firstName || ""} ${
          employee.lastName || ""
        }`
      : "";

    const searchableText = `
      ${employeeName}
      ${employee?.employeeCode || ""}
      ${record.attendanceDate || ""}
      ${record.status || ""}
    `.toLowerCase();

    return searchableText.includes(
      search.toLowerCase()
    );
  });

  const today = new Date()
    .toISOString()
    .split("T")[0];

  const todayRecord = attendance.find(
    (record) => record.attendanceDate === today
  );

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Attendance Management</h1>

          <p>
            {isEmployee
              ? "Track your daily attendance and working hours."
              : "Monitor employee attendance records."}
          </p>
        </div>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {isEmployee && (
        <div className="attendance-actions">
          <div className="attendance-action-card">
            <div className="attendance-action-icon">
              <LogIn size={22} />
            </div>

            <div>
              <h3>Mark Attendance</h3>

              <p>
                Record your attendance for today.
              </p>
            </div>

            <div className="attendance-buttons">
              <button
                className="attendance-btn present-btn"
                disabled={marking || !!todayRecord}
                onClick={() =>
                  handleMarkAttendance("PRESENT")
                }
              >
                Present
              </button>

              <button
                className="attendance-btn half-day-btn"
                disabled={marking || !!todayRecord}
                onClick={() =>
                  handleMarkAttendance("HALF_DAY")
                }
              >
                Half Day
              </button>

              <button
                className="attendance-btn absent-btn"
                disabled={marking || !!todayRecord}
                onClick={() =>
                  handleMarkAttendance("ABSENT")
                }
              >
                Absent
              </button>
            </div>
          </div>

          <div className="attendance-action-card">
            <div className="attendance-action-icon checkout-icon">
              <LogOut size={22} />
            </div>

            <div>
              <h3>Check Out</h3>

              <p>
                Record your checkout time for today.
              </p>
            </div>

            <button
              className="primary-btn"
              disabled={
                marking ||
                !todayRecord ||
                !!todayRecord?.checkOut
              }
              onClick={handleCheckout}
            >
              <LogOut size={17} />
              Check Out
            </button>
          </div>
        </div>
      )}

      {isEmployee && todayRecord && (
        <div className="today-attendance-card">
          <div>
            <span>Today's Attendance</span>

            <strong>
              {todayRecord.status}
            </strong>
          </div>

          <div className="today-time">
            <div>
              <small>Check In</small>
              <strong>
                {formatTime(todayRecord.checkIn)}
              </strong>
            </div>

            <div>
              <small>Check Out</small>
              <strong>
                {formatTime(todayRecord.checkOut)}
              </strong>
            </div>
          </div>
        </div>
      )}

      <div className="page-toolbar">
        <div className="search-box">
          <Search size={18} />

          <input
            type="text"
            placeholder="Search attendance records..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />
        </div>
      </div>

      {loading ? (
        <div className="loading-state">
          Loading attendance records...
        </div>
      ) : filteredAttendance.length === 0 ? (
        <div className="empty-state">
          <CalendarDays size={42} />

          <h3>No attendance records found</h3>

          <p>
            There are no attendance records to display.
          </p>
        </div>
      ) : (
        <div className="table-card">
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  {isManagerOrAdmin && (
                    <th>Employee</th>
                  )}

                  <th>Date</th>
                  <th>Check In</th>
                  <th>Check Out</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {filteredAttendance.map((record) => {
                  const employee = record.employee;

                  return (
                    <tr key={record.id}>
                      {isManagerOrAdmin && (
                        <td>
                          <div className="employee-cell">
                            <strong>
                              {employee?.firstName}{" "}
                              {employee?.lastName}
                            </strong>

                            <span>
                              {employee?.employeeCode}
                            </span>
                          </div>
                        </td>
                      )}

                      <td>
                        {record.attendanceDate}
                      </td>

                      <td>
                        <div className="time-cell">
                          <Clock size={15} />
                          {formatTime(
                            record.checkIn
                          )}
                        </div>
                      </td>

                      <td>
                        <div className="time-cell">
                          <Clock size={15} />
                          {formatTime(
                            record.checkOut
                          )}
                        </div>
                      </td>

                      <td>
                        <span
                          className={`status-badge ${getStatusClass(
                            record.status
                          )}`}
                        >
                          {record.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default Attendance;