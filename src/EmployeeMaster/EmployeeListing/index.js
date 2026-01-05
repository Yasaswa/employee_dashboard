import { useNavigate } from "react-router-dom";
import { useState, useMemo, useEffect, useRef } from "react";
import Datatable from "components/DataTable";
import { statusOptions, genderOptions } from "mockdata";
import "assets/css/employee_form.css";
import { Form } from "react-bootstrap";
import { UserAuth } from "../../contextAuth/AuthenticationContext";

function FrmEmployeeListing() {
  debugger
  const { user, logout } = UserAuth();
  const navigate = useNavigate();
  const employeeTblRef = useRef();

  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
    }
  }, [user]);


  const [employeeData, setEmployeeData] = useState(() => {
    return JSON.parse(localStorage.getItem("EmployeeData")) ?? [];
  });

  const [employeeStatus, setEmployeeStatus] = useState("All");
  const [gender, setGender] = useState("All");
  const [employeeName, setEmployeeName] = useState("");
  const [debouncedName, setDebouncedName] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedName(employeeName.trim().toUpperCase());
    }, 500);

    return () => clearTimeout(handler);
  }, [employeeName]);

  const memoisedData = useMemo(() => {
    return employeeData.filter(emp => {
      const statusMatch =
        employeeStatus === "All" ||
        emp.employeeStatus === (employeeStatus === "true");

      const genderMatch =
        gender === "All" || emp.gender === gender;

      const nameMatch =
        debouncedName === "" ||
        emp.employeeName?.includes(debouncedName);

      return statusMatch && genderMatch && nameMatch;
    });
  }, [employeeStatus, gender, debouncedName, employeeData]);


  return (
    <div className="erp_top_Form">
      <div className="card p-1">


        <div className="card-header erp-dashboard-header">
          <div className="erp-header-left">
            Welcome {user} !!
          </div>

          <div className="erp-header-center">
            <label className="erp-form-label-lg main_heading">
              Employee&apos;s Dashboard
            </label>
          </div>

          <div className="erp-header-right">
            <button
              type="button"
              className="erp-gb-button"
              onClick={() => {
                logout(); navigate("/login");
              }}
            >
              Logout
            </button>
          </div>
        </div>

        <div className="row pt-2 align-items-center">

          <div className="col-auto">
            <button type="button" className="erp-gb-button"
              onClick={() =>
                navigate("/Employee/EmployeeEntry", {
                  state: { keyForViewUpdate: "Add", employee_id: 0 }
                })
              }
            > Add Employee </button>
          </div>


          <div className="col-2 ms-3">
            <div className="row">
              <div className="col-sm-auto mt-1">
                <Form.Label className="erp-form-label">Status</Form.Label>
              </div>
              <div className="col-sm-7">
                <select className="form-select form-select-sm" value={employeeStatus}
                  onChange={(e) => setEmployeeStatus(e.target.value)}
                >
                  <option value="All">All</option>
                  {statusOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="col-2">
            <div className="row">
              <div className="col-sm-auto mt-1">
                <Form.Label className="erp-form-label">Gender</Form.Label>
              </div>
              <div className="col-sm-7">
                <select
                  className="form-select form-select-sm"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  <option value="All">All</option>
                  {genderOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="col-3"></div>

          <div className="col-3">
            <div className="row">
              <div className="col-sm-auto mt-1">
                <Form.Label className="erp-form-label">Search By Name</Form.Label>
              </div>
              <div className="col-sm-7">
                <Form.Control
                  type="text"
                  className="erp_input_field ps-1"
                  value={employeeName}
                  onChange={(e) => setEmployeeName(e.target.value.toUpperCase())}
                />
              </div>
            </div>
          </div>

          <div className="col-auto">
            <button
              type="button"
              className="erp-gb-button"
              onClick={() => {
                employeeTblRef?.current?.printEmployeeTable();
              }}
            >
              Print
            </button>
          </div>

        </div>

        {/* Table */}
        <div className="row pt-2">
          <Datatable data={memoisedData} ref={employeeTblRef} />
        </div>

      </div>
    </div>
  );
}

export default FrmEmployeeListing;
