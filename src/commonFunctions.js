import DefaultEmployeeImage from "assets/images/EmployeeLogo.png";

export const getEmployeeImageMock = (employee_id) => {
    return (
        localStorage.getItem(`EMP_IMG_${employee_id}`) ||
        DefaultEmployeeImage
    );
};

//Current Date
export const today = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};