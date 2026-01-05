import { Navigate } from "react-router-dom";
import Login from "Authentication/Login";
import FrmEmployeeEntry from "EmployeeMaster/EmployeeEntry";
import FrmEmployeeListing from "EmployeeMaster/EmployeeListing";

const routes = [
  {
    key: "root",
    route: "/",
    component: <Navigate to="/login" replace />,
  },

  {
    key: "login",
    route: "/login",
    component: <Login />,
  },

  {
    key: "emp-list",
    route: "/Employee/EmployeeListing",
    component: <FrmEmployeeListing />,
  },

  {
    key: "emp-entry",
    route: "/Employee/EmployeeEntry",
    component: <FrmEmployeeEntry />,
  },
];

export default routes;
