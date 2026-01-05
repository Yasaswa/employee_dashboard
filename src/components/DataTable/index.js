import React, { useRef, forwardRef, useReducer, useEffect, useImperativeHandle } from "react";
import { Table } from "react-bootstrap";
import { MdModeEdit, MdDelete } from "react-icons/md";
import { AiFillEye } from "react-icons/ai";
import { getEmployeeImageMock, today } from "commonFunctions";
import { useNavigate } from "react-router-dom";
import { useReactToPrint } from "react-to-print";

const reducer = (state, action) => {
    switch (action.type) {
        case "RESET":
            return action.payload;

        case "REMOVE": {
            const updatedState = state.map(emp =>
                emp.employee_id === action.employee_id
                    ? { ...emp, is_delete: true, updated_at: today }
                    : emp
            );

            localStorage.setItem(
                "EmployeeData",
                JSON.stringify(updatedState)
            );

            return updatedState;
        }

        default:
            return state;
    }
};


const Datatable = forwardRef(({ data }, ref) => {
    debugger
    const tableRef = useRef(null);
    const navigate = useNavigate();

    const handlePrint = useReactToPrint({
        content: () => tableRef.current,
        documentTitle: "Employee_List",

        pageStyle: `
    @page {
      size: A4 landscape;
      margin: 10mm;
    }

    body {
      font-family: "Roboto", Arial, sans-serif;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    /* ================= HEADER ================= */
    body::before {
      content: "Employee Master Report";
      white-space: pre;
      display: block;
      font-size: 14px;
      font-weight: 600;
      text-align: center;
      border-bottom: 2px solid #000;
      padding-bottom: 6px;
      margin-bottom: 10px;
    }

    /* ================= FOOTER ================= */
    body::after {
      content: "Page " counter(page);
      position: fixed;
      bottom: 5mm;
      left: 0;
      right: 0;
      text-align: center;
      font-size: 10px;
      border-top: 1px solid #000;
      padding-top: 4px;
    }

    /* ================= TABLE ================= */
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 11px;
      transform: scale(0.95);
      transform-origin: top left;
    }

    th, td {
      border: 1px solid #000;
      padding: 6px;
    }

    th {
      background-color: #e6e6e6 !important;
      font-weight: 600;
      text-align: center;
    }

    tr {
      page-break-inside: avoid;
    }

    /* ================= CLEAN PRINT ================= */
    @media print {
      body * {
        visibility: hidden;
      }

      table, table * {
        visibility: visible;
      }

      table {
        position: relative;
        top: 0;
        left: 0;
      }
    }
  `
    });

    /* 🔹 expose function to parent */
    useImperativeHandle(ref, () => ({
        printEmployeeTable() {
            document.body.setAttribute(
                "data-print-time",
                new Date().toLocaleString()
            );
            handlePrint();
        }
    }));

    useEffect(() => {
        dispatch({ type: "RESET", payload: data });
    }, [data]);

    const [tableData, dispatch] = useReducer(reducer, data);

    const handleNavigate = (mode, employee_id) => {
        navigate("/Employee/EmployeeEntry", {
            state: { keyForViewUpdate: mode, employee_id }
        });
    };

    return (

        <Table
            ref={tableRef}
            className="erp_table mb-3"
            responsive
            bordered
            striped
        >
            <thead className="erp_table_head">
                <tr>
                    <th className='erp_table_th text-center' style={{ width: "75px" }}>Action</th>
                    <th className='erp_table_th text-center' style={{ width: "75px" }}>Sr. No</th>
                    <th className='erp_table_th text-center' style={{ width: "75px" }}>Employee Id</th>
                    <th className='erp_table_th text-center' style={{ width: "100px" }}>Employee Image</th>
                    <th className='erp_table_th text-center'>Employee Name</th>
                    <th className='erp_table_th text-center'>DOB</th>
                    <th className='erp_table_th text-center'>State</th>
                    <th className='erp_table_th text-center'>Gender</th>
                    <th className='erp_table_th text-center'>Status</th>
                    <th className='erp_table_th text-center' style={{ width: "130px" }}>Address</th>
                </tr>
            </thead>

            <tbody>
                {tableData.filter(e => !e.is_delete).map((emp, index) => (
                    <tr key={emp.employee_id}>
                        <td className='erp_table_td '>
                            <AiFillEye onClick={() => handleNavigate("View", emp.employee_id)} />
                            <MdModeEdit onClick={() => handleNavigate("Update", emp.employee_id)} />
                            <MdDelete onClick={() => dispatch({ type: "REMOVE", employee_id: emp.employee_id })} />
                        </td>

                        <td className='erp_table_td '>{index + 1}</td>
                        <td className='erp_table_td '>{emp.employee_id}</td>
                        <td className="text-center">
                            <img
                                src={getEmployeeImageMock(emp.employee_id)}
                                alt="Employee"
                                className="employee-tbl-profile-img"
                            />
                        </td>

                        <td className='erp_table_td '>{emp.employeeName}</td>
                        <td className='erp_table_td '>{emp.dateOfBirth}</td>
                        <td className='erp_table_td '>{emp.employeeState}</td>
                        <td className='erp_table_td '>{emp.gender}</td>
                        <td className='erp_table_td '>{emp.employeeStatus === true ? "Active" : "In-Active"}</td>
                        <td
                            className="erp_table_td"
                            style={{
                                width: "150px",
                                wordBreak: "break-word",
                                whiteSpace: "normal"
                            }}
                        >
                            {emp.employeeAddress}
                        </td>

                    </tr>
                ))}
            </tbody>
        </Table>
    );
});

export default React.memo(Datatable);
