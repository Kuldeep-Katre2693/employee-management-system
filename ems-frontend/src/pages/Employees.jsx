import { useEffect, useState } from "react";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  Users,
} from "lucide-react";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function Employees() {
  const { role } = useAuth();

  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);

  const [formData, setFormData] = useState({
    employeeCode: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    department: "",
    designation: "",
    joiningDate: "",
    salary: "",
  });

  const loadEmployees = async () => {
    try {
      const response = await api.get("/employees");
      setEmployees(response.data);
    } catch (error) {
      console.error("Failed to load employees:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  const openCreateModal = () => {
    setEditingEmployee(null);

    setFormData({
      employeeCode: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      department: "",
      designation: "",
      joiningDate: "",
      salary: "",
    });

    setShowModal(true);
  };

  const openEditModal = (employee) => {
    setEditingEmployee(employee);

    setFormData({
      employeeCode: employee.employeeCode || "",
      firstName: employee.firstName || "",
      lastName: employee.lastName || "",
      email: employee.email || "",
      phone: employee.phone || "",
      department: employee.department || "",
      designation: employee.designation || "",
      joiningDate: employee.joiningDate || "",
      salary: employee.salary || "",
    });

    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingEmployee(null);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const payload = {
        ...formData,
        salary: Number(formData.salary),
      };

      if (editingEmployee) {
        await api.put(
          `/employees/${editingEmployee.id}`,
          payload
        );
      } else {
        await api.post("/employees", payload);
      }

      closeModal();
      await loadEmployees();
    } catch (error) {
      console.error("Employee save failed:", error);

      alert(
        error.response?.data?.message ||
          "Unable to save employee."
      );
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this employee?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/employees/${id}`);
      await loadEmployees();
    } catch (error) {
      console.error("Employee deletion failed:", error);

      alert(
        error.response?.data?.message ||
          "Unable to delete employee."
      );
    }
  };

  const filteredEmployees = employees.filter((employee) => {
    const searchValue = search.toLowerCase();

    return (
      employee.employeeCode
        ?.toLowerCase()
        .includes(searchValue) ||
      employee.firstName
        ?.toLowerCase()
        .includes(searchValue) ||
      employee.lastName
        ?.toLowerCase()
        .includes(searchValue) ||
      employee.email
        ?.toLowerCase()
        .includes(searchValue) ||
      employee.department
        ?.toLowerCase()
        .includes(searchValue)
    );
  });

  return (
    <div className="employees-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">WORKFORCE</p>

          <h1>Employees</h1>

          <p className="page-description">
            Manage employee records and organizational information.
          </p>
        </div>

        {role === "ADMIN" && (
          <button
            className="primary-button"
            onClick={openCreateModal}
          >
            <Plus size={18} />
            Add Employee
          </button>
        )}
      </div>

      <div className="employee-toolbar">
        <div className="search-box">
          <Search size={18} />

          <input
            type="text"
            placeholder="Search employees..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />
        </div>

        <div className="employee-count">
          <Users size={17} />
          {filteredEmployees.length} employees
        </div>
      </div>

      <div className="table-card">
        {loading ? (
          <div className="table-message">
            Loading employees...
          </div>
        ) : filteredEmployees.length === 0 ? (
          <div className="table-message">
            No employees found.
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="employee-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Code</th>
                  <th>Department</th>
                  <th>Designation</th>
                  <th>Email</th>
                  <th>Salary</th>

                  {role === "ADMIN" && (
                    <th>Actions</th>
                  )}
                </tr>
              </thead>

              <tbody>
                {filteredEmployees.map((employee) => (
                  <tr key={employee.id}>
                    <td>
                      <div className="employee-name">
                        <div className="avatar">
                          {employee.firstName?.[0]}
                          {employee.lastName?.[0]}
                        </div>

                        <div>
                          <strong>
                            {employee.firstName}{" "}
                            {employee.lastName}
                          </strong>

                          <span>
                            {employee.phone || "No phone"}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className="code-badge">
                        {employee.employeeCode}
                      </span>
                    </td>

                    <td>
                      {employee.department || "—"}
                    </td>

                    <td>
                      {employee.designation || "—"}
                    </td>

                    <td>{employee.email}</td>

                    <td>
                      ₹
                      {Number(employee.salary || 0).toLocaleString(
                        "en-IN"
                      )}
                    </td>

                    {role === "ADMIN" && (
                      <td>
                        <div className="table-actions">
                          <button
                            className="action-button edit"
                            title="Edit employee"
                            onClick={() =>
                              openEditModal(employee)
                            }
                          >
                            <Pencil size={16} />
                          </button>

                          <button
                            className="action-button delete"
                            title="Delete employee"
                            onClick={() =>
                              handleDelete(employee.id)
                            }
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div
          className="modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeModal();
            }
          }}
        >
          <div className="employee-modal">
            <div className="modal-header">
              <div>
                <p className="eyebrow">
                  {editingEmployee ? "UPDATE" : "NEW RECORD"}
                </p>

                <h2>
                  {editingEmployee
                    ? "Edit Employee"
                    : "Add Employee"}
                </h2>
              </div>

              <button
                className="modal-close"
                onClick={closeModal}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Employee Code *</label>

                  <input
                    name="employeeCode"
                    value={formData.employeeCode}
                    onChange={handleChange}
                    placeholder="EMP001"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>First Name *</label>

                  <input
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Last Name *</label>

                  <input
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Email *</label>

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Phone</label>

                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Department</label>

                  <input
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Designation</label>

                  <input
                    name="designation"
                    value={formData.designation}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Joining Date</label>

                  <input
                    type="date"
                    name="joiningDate"
                    value={formData.joiningDate}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group full-width">
                  <label>Salary *</label>

                  <input
                    type="number"
                    name="salary"
                    value={formData.salary}
                    onChange={handleChange}
                    min="1"
                    required
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={closeModal}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="primary-button"
                >
                  {editingEmployee
                    ? "Update Employee"
                    : "Create Employee"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Employees;