const pool = require("../config/db");

// Get all employees
const getAllEmployees = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM employees ORDER BY created_at DESC",
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get single employee
const getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM employees WHERE id = $1", [
      id,
    ]);
    if (result.rows.length === 0)
      return res.status(404).json({ error: "Employee not found" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create employee
const createEmployee = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      email,
      phone,
      department,
      position,
      salary,
      hire_date,
    } = req.body;
    const result = await pool.query(
      `INSERT INTO employees (first_name, last_name, email, phone, department, position, salary, hire_date)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [
        first_name,
        last_name,
        email,
        phone,
        department,
        position,
        salary,
        hire_date,
      ],
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get unique departments
const getDepartments = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT DISTINCT department FROM employees WHERE department IS NOT NULL ORDER BY department",
    );
    res.json(result.rows.map((r) => r.department));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update employee
const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      first_name,
      last_name,
      email,
      phone,
      department,
      position,
      salary,
      hire_date,
    } = req.body;
    const result = await pool.query(
      `UPDATE employees SET first_name=$1, last_name=$2, email=$3, phone=$4,
       department=$5, position=$6, salary=$7, hire_date=$8 WHERE id=$9 RETURNING *`,
      [
        first_name,
        last_name,
        email,
        phone,
        department,
        position,
        salary,
        hire_date,
        id,
      ],
    );
    if (result.rows.length === 0)
      return res.status(404).json({ error: "Employee not found" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete employee
const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "DELETE FROM employees WHERE id = $1 RETURNING *",
      [id],
    );
    if (result.rows.length === 0)
      return res.status(404).json({ error: "Employee not found" });
    res.json({ message: "Employee deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  getDepartments ,
  updateEmployee,
  deleteEmployee,
};
