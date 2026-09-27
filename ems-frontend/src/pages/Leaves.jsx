import { useEffect, useState } from "react";
import {
  CalendarDays,
  Check,
  X,
  Plus,
  Search,
} from "lucide-react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import "./Leaves.css";

function Leaves() {
  const { role } = useAuth();

  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");

  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
    reason: "",
  });

  const isEmployee = role === "EMPLOYEE";
  const isManagerOrAdmin = role === "MANAGER" || role === "ADMIN";

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      setError("");

      const endpoint = isEmployee ? "/leaves/my" : "/leaves";

      const response = await api.get(endpoint);

      setLeaves(response.data);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          "Failed to load leave requests."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, [role]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleApplyLeave = async (e) => {
    e.preventDefault();

    try {
      setError("");

      await api.post("/leaves", {
        startDate: formData.startDate,
        endDate: formData.endDate,
        reason: formData.reason,
      });

      setFormData({
        startDate: "",
        endDate: "",
        reason: "",
      });

      setShowForm(false);

      await fetchLeaves();
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to submit leave request."
      );
    }
  };

  const handleApprove = async (leaveId) => {
    try {
      await api.put(`/leaves/${leaveId}/approve`);
      await fetchLeaves();
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to approve leave."
      );
    }
  };

  const handleReject = async (leaveId) => {
    try {
      await api.put(`/leaves/${leaveId}/reject`);
      await fetchLeaves();
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to reject leave."
      );
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "APPROVED":
        return "status-approved";

      case "REJECTED":
        return "status-rejected";

      default:
        return "status-pending";
    }
  };

  const filteredLeaves = leaves.filter((leave) => {
    const employeeName = leave.employeeName || "";
    const searchableText = `
      ${employeeName}
      ${leave.employeeCode || ""}
      ${leave.reason || ""}
      ${leave.status || ""}
    `.toLowerCase();

    return searchableText.includes(search.toLowerCase());
  });

  return (
<div className="page-container leaves-page">      <div className="page-header">
        <div>
          <h1>Leave Management</h1>

          <p>
            {isEmployee
              ? "Apply for leave and track your requests."
              : "Review and manage employee leave requests."}
          </p>
        </div>

        {isEmployee && (
          <button
            className="primary-btn"
            onClick={() => setShowForm(true)}
          >
            <Plus size={18} />
            Apply Leave
          </button>
        )}
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="page-toolbar">
        <div className="search-box">
          <Search size={18} />

          <input
            type="text"
            placeholder="Search leave requests..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="loading-state">
          Loading leave requests...
        </div>
      ) : filteredLeaves.length === 0 ? (
        <div className="empty-state">
          <CalendarDays size={42} />

          <h3>No leave requests found</h3>

          <p>
            {isEmployee
              ? "You have not submitted any leave requests yet."
              : "There are no leave requests to display."}
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

                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Reason</th>
                  <th>Status</th>

                  {isManagerOrAdmin && (
                    <th>Actions</th>
                  )}
                </tr>
              </thead>

              <tbody>
                {filteredLeaves.map((leave) => {
const employeeName = leave.employeeName || "Unknown Employee";
const employeeCode = leave.employeeCode || "—";
                  return (
                    <tr key={leave.id}>
                      {isManagerOrAdmin && (
                        <td>
                         <div className="leave-employee-cell">
  <div className="leave-employee-avatar">
    {employeeName
      .split(" ")
      .map((name) => name[0])
      .join("")
      .slice(0, 2)
      .toUpperCase()}
  </div>

  <div className="leave-employee-info">
    <strong>{employeeName}</strong>
    <span>{employeeCode}</span>
  </div>
</div>
                        </td>
                      )}

                      <td>{leave.startDate}</td>

                      <td>{leave.endDate}</td>

                      <td>{leave.reason}</td>

                      <td>
                        <span
                          className={`status-badge ${getStatusClass(
                            leave.status
                          )}`}
                        >
                          {leave.status}
                        </span>
                      </td>

                      {isManagerOrAdmin && (
                        <td>
                          {leave.status === "PENDING" ? (
                            <div className="action-buttons">
                              <button
                                className="icon-btn approve-btn"
                                title="Approve"
                                onClick={() =>
                                  handleApprove(leave.id)
                                }
                              >
                                <Check size={17} />
                              </button>

                              <button
                                className="icon-btn reject-btn"
                                title="Reject"
                                onClick={() =>
                                  handleReject(leave.id)
                                }
                              >
                                <X size={17} />
                              </button>
                            </div>
                          ) : (
                            <span className="muted-text">
                              No action
                            </span>
                          )}
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showForm && (
        <div
          className="modal-overlay"
          onClick={() => setShowForm(false)}
        >
          <div
            className="modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <h2>Apply for Leave</h2>

                <p>
                  Submit your leave request for approval.
                </p>
              </div>

              <button
                className="modal-close"
                onClick={() => setShowForm(false)}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleApplyLeave}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Start Date</label>

                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>End Date</label>

                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    min={formData.startDate}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Reason</label>

                <textarea
                  name="reason"
                  rows="4"
                  placeholder="Enter the reason for your leave..."
                  value={formData.reason}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="primary-btn"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Leaves;