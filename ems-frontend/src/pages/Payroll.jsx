import { useEffect, useState } from "react";
import {
  Plus,
  Search,
  X,
  Wallet,
} from "lucide-react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function Payroll() {
  const { role } = useAuth();

  const [payrolls, setPayrolls] = useState([]);
  const [employees, setEmployees] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    employeeId: "",
    payrollMonth: "",
    basicSalary: "",
    allowance: "",
    deduction: "",
  });

  const isEmployee = role === "EMPLOYEE";
  const isAdmin = role === "ADMIN";
  const isManagerOrAdmin =
    role === "MANAGER" || role === "ADMIN";

  const fetchPayrolls = async () => {
    try {
      setLoading(true);
      setError("");

      const endpoint = isEmployee
        ? "/payroll/my"
        : "/payroll";

      const response = await api.get(endpoint);

      setPayrolls(response.data);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to load payroll records."
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    if (!isAdmin) return;

    try {
      const response = await api.get("/employees");
      setEmployees(response.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load employees.");
    }
  };

  useEffect(() => {
    fetchPayrolls();
    fetchEmployees();
  }, [role]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreatePayroll = async (e) => {
    e.preventDefault();

    try {
      setError("");

      const {
        employeeId,
        payrollMonth,
        basicSalary,
        allowance,
        deduction,
      } = formData;

      await api.post(
        `/payroll/employee/${employeeId}`,
        null,
        {
          params: {
            payrollMonth,
            basicSalary: Number(basicSalary),
            allowance: Number(allowance || 0),
            deduction: Number(deduction || 0),
          },
        }
      );

      setFormData({
        employeeId: "",
        payrollMonth: "",
        basicSalary: "",
        allowance: "",
        deduction: "",
      });

      setShowForm(false);

      await fetchPayrolls();
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to create payroll."
      );
    }
  };

  const handleMarkPaid = async (payrollId) => {
    try {
      setError("");

      await api.put(
        `/payroll/${payrollId}/pay`
      );

      await fetchPayrolls();
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to mark payroll as paid."
      );
    }
  };

  const getStatusClass = (status) => {
    return status === "PAID"
      ? "status-approved"
      : "status-pending";
  };

  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined) {
      return "₹0.00";
    }

    return `₹${Number(amount).toLocaleString(
      "en-IN",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    )}`;
  };

  const filteredPayrolls = payrolls.filter(
    (payroll) => {
      const employee = payroll.employee;

      const employeeName = employee
        ? `${employee.firstName || ""} ${
            employee.lastName || ""
          }`
        : "";

      const searchableText = `
        ${employeeName}
        ${employee?.employeeCode || ""}
        ${payroll.payrollMonth || ""}
        ${payroll.paymentStatus || ""}
      `.toLowerCase();

      return searchableText.includes(
        search.toLowerCase()
      );
    }
  );

  const basicSalary = formData.basicSalary || "0";
const allowance = formData.allowance || "0";
const deduction = formData.deduction || "0";

const calculatedNetSalary =
  (parseFloat(basicSalary) +
    parseFloat(allowance) -
    parseFloat(deduction)).toFixed(2);
  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Payroll Management</h1>

          <p>
            {isEmployee
              ? "View your salary and payment records."
              : "Manage employee payroll and payments."}
          </p>
        </div>

        {isAdmin && (
          <button
            className="primary-btn"
            onClick={() => setShowForm(true)}
          >
            <Plus size={18} />
            Create Payroll
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
            placeholder="Search payroll records..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />
        </div>
      </div>

      {loading ? (
        <div className="loading-state">
          Loading payroll records...
        </div>
      ) : filteredPayrolls.length === 0 ? (
        <div className="empty-state">
          <Wallet size={42} />

          <h3>No payroll records found</h3>

          <p>
            There are no payroll records to display.
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

                  <th>Month</th>
                  <th>Basic Salary</th>
                  <th>Allowance</th>
                  <th>Deduction</th>
                  <th>Net Salary</th>
                  <th>Status</th>

                  {isAdmin && (
                    <th>Action</th>
                  )}
                </tr>
              </thead>

              <tbody>
                {filteredPayrolls.map(
                  (payroll) => {
                    const employee =
                      payroll.employee;

                    return (
                      <tr key={payroll.id}>
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
                          {payroll.payrollMonth}
                        </td>

                        <td>
                          {formatCurrency(
                            payroll.basicSalary
                          )}
                        </td>

                        <td>
                          {formatCurrency(
                            payroll.allowance
                          )}
                        </td>

                        <td>
                          {formatCurrency(
                            payroll.deduction
                          )}
                        </td>

                        <td>
                          <strong>
                            {formatCurrency(
                              payroll.netSalary
                            )}
                          </strong>
                        </td>

                        <td>
                          <span
                            className={`status-badge ${getStatusClass(
                              payroll.paymentStatus
                            )}`}
                          >
                            {
                              payroll.paymentStatus
                            }
                          </span>
                        </td>

                        {isAdmin && (
                          <td>
                            {payroll.paymentStatus ===
                            "PENDING" ? (
                              <button
                                className="pay-btn"
                                onClick={() =>
                                  handleMarkPaid(
                                    payroll.id
                                  )
                                }
                              >
                                Mark Paid
                              </button>
                            ) : (
                              <span className="muted-text">
                                Paid
                              </span>
                            )}
                          </td>
                        )}
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showForm && (
        <div
          className="modal-overlay"
          onClick={() =>
            setShowForm(false)
          }
        >
          <div
            className="modal-card"
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            <div className="modal-header">
              <div>
                <h2>Create Payroll</h2>

                <p>
                  Generate a monthly payroll
                  record.
                </p>
              </div>

              <button
                className="modal-close"
                onClick={() =>
                  setShowForm(false)
                }
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={handleCreatePayroll}
            >
              <div className="form-group">
                <label>Employee</label>

                <select
                  name="employeeId"
                  value={formData.employeeId}
                  onChange={handleChange}
                  required
                >
                  <option value="">
                    Select employee
                  </option>

                  {employees.map(
                    (employee) => (
                      <option
                        key={employee.id}
                        value={employee.id}
                      >
                        {employee.firstName}{" "}
                        {employee.lastName} (
                        {
                          employee.employeeCode
                        }
                        )
                      </option>
                    )
                  )}
                </select>
              </div>

              <div className="form-group">
                <label>Payroll Month</label>

                <input
                  type="month"
                  name="payrollMonth"
                  value={formData.payrollMonth}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label>
                    Basic Salary
                  </label>

                  <input
                    type="number"
                    name="basicSalary"
                    min="0"
                    step="0.01"
                    value={
                      formData.basicSalary
                    }
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>
                    Allowance
                  </label>

                  <input
                    type="number"
                    name="allowance"
                    min="0"
                    step="0.01"
                    value={
                      formData.allowance
                    }
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Deduction</label>

                <input
                  type="number"
                  name="deduction"
                  min="0"
                  step="0.01"
                  value={
                    formData.deduction
                  }
                  onChange={handleChange}
                />
              </div>

              <div className="payroll-summary">
                <span>
                  Calculated Net Salary
                </span>

                <strong>
                  {formatCurrency(
                    calculatedNetSalary
                  )}
                </strong>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={() =>
                    setShowForm(false)
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="primary-btn"
                >
                  Create Payroll
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Payroll;