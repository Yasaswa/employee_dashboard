import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SuccessModal from "components/Modals/SuccessModal";
import ErrorModal from 'components/Modals/ErrorModal';
import { CircularProgress } from '@material-ui/core';
import Select from "react-select";
import { stateOptions as states, genderOptions } from "mockdata";
import { Form } from "react-bootstrap";
import "assets/css/employee_form.css";
import DefaultEmployeeImage from "assets/images/EmployeeLogo.png";
import { getEmployeeImageMock, today } from "commonFunctions";
import { UserAuth } from "../../contextAuth/AuthenticationContext";

function FrmEmployeeEntry() {
    debugger
    const { user, logout } = UserAuth();
    const { state } = useLocation();
    const { employee_id = 0, keyForViewUpdate = 'Add' } = state || {};
    let employeeData = JSON.parse(localStorage.getItem("EmployeeData"));

    const [isLoading, setIsLoading] = useState(false);
    const actionType = keyForViewUpdate === 'Add' ? '(Create)' : keyForViewUpdate === 'Update' ? '(Update)' : keyForViewUpdate === 'Approve' ? '(Approve)' : '(View)';
    const actionLabel = keyForViewUpdate === 'Add' ? 'Save' : keyForViewUpdate === 'Update' ? 'Update' : 'Approve';

    useEffect(() => {
        if (!user) {
            navigate("/login", { replace: true });
        }
    }, [user]);

    //  Error Msg HANDLING
    const handleCloseErrModal = () => setShowErrorMsgModal(false);
    const [showErrorMsgModal, setShowErrorMsgModal] = useState(false);
    const [errMsg, setErrMsg] = useState('');

    // Success Msg HANDLING
    const handleCloseSuccessModal = () => {
        setShowSuccessMsgModal(false);
        navigate(`/Employee/EmployeeListing`);
    }
    const [showSuccessMsgModal, setShowSuccessMsgModal] = useState(false);
    const [succMsg, setSuccMsg] = useState('');

    // For navigate
    const navigate = useNavigate();

    //useState Hooks for Employee Data
    const [employeeName, setEmployeeName] = useState("");
    const [dateOfBirth, setDateOfBirth] = useState(today);
    const [gender, setGender] = useState("Male");
    const [employeeImage, setEmployeeImage] = useState(DefaultEmployeeImage);
    const [employeeState, setEmployeeState] = useState("0");
    const [employeeStatus, setEmployeeStatus] = useState(true);
    const [employeeAddress, setEmployeeAddress] = useState("");

    // Default option
    const emptyOptionObj = { label: "Select", value: "" };
    const [currentEmployeeData, setCurrentEmployeeData] = useState({});

    // State dropdown options
    const stateOptions = [
        emptyOptionObj,
        ...states.map((state) => ({
            label: state,
            value: state,
        })),
    ];

    useEffect(() => {
        const loadEmployeeData = () => {
            const fetchEMployeeData = employeeData.find(emp => emp.employee_id === employee_id);
            if (fetchEMployeeData) {
                setCurrentEmployeeData(fetchEMployeeData);
                setEmployeeName(fetchEMployeeData.employeeName); setDateOfBirth(fetchEMployeeData.dateOfBirth);
                setGender(fetchEMployeeData.gender); setEmployeeState(fetchEMployeeData.employeeState);
                setEmployeeStatus(fetchEMployeeData.employeeStatus); setEmployeeAddress(fetchEMployeeData.employeeAddress);
            }
        };
        if (employee_id !== 0) {
            loadEmployeeData();
        }

    }, [])

    useEffect(() => {
        if (!employee_id) return;

        const imagePath = getEmployeeImageMock(employee_id);
        setEmployeeImage(imagePath);
    }, [employee_id]);



    const validateForm = () => {
        debugger
        if (employeeName === '') {
            setErrMsg("Enter Employee Name"); setShowErrorMsgModal(true); return false;
        }

        if (employeeState === '') {
            setErrMsg("Select Employee State"); setShowErrorMsgModal(true); return false;
        }

        return true;
    };

    const getNextEmployeeId = (data) => {
        if (!data.length) return 1;
        return Math.max(...data.map(emp => emp.employee_id)) + 1;
    };

    const saveEmployeeData = async () => {
        debugger
        try {
            if (!validateForm()) return;

            const now = new Date().toISOString();
            const isNew = employee_id === 0;

            const employeeObj = {
                employee_id: isNew ? getNextEmployeeId(employeeData) : employee_id,
                employeeName: employeeName.toUpperCase(),
                gender,
                dateOfBirth: dateOfBirth,
                employeeState: employeeState,
                employeeStatus: employeeStatus === true || employeeStatus === "true",
                employeeState: employeeState,
                employeeAddress,
                is_delete: false,
                created_at: isNew ? now : currentEmployeeData.created_at,
                updated_at: isNew ? null : now
            };

            const updatedEmployees = isNew
                ? [...employeeData, employeeObj]
                : employeeData.map(emp =>
                    emp.employee_id === employee_id ? employeeObj : emp
                );

            localStorage.setItem(
                "EmployeeData",
                JSON.stringify(updatedEmployees)
            );

            setSuccMsg(isNew ? "Employee's Data Added Successfully" : "Employees's Data Updated Successfully");
            setShowSuccessMsgModal(true);

        } catch (error) {
            console.error("Save employee failed:", error);
        } finally {
            setIsLoading(false);
        }
    };


    const saveEmployeeImageMock = (employee_id, file) => {
        const reader = new FileReader();

        reader.onload = () => {
            const base64Image = reader.result;
            localStorage.setItem(`EMP_IMG_${employee_id}`, base64Image);
            setEmployeeImage(base64Image);
        };

        reader.readAsDataURL(file);
    };


    return (
        <>
            {isLoading ?
                <div className="spinner-overlay"  >
                    <div className="spinner-container">
                        <CircularProgress color="primary" />
                        <span>Loading...</span>
                    </div>
                </div> :
                ''}

            <div className="erp_top_Form">
                <div className='card p-1'>
                    <div className="card-header erp-dashboard-header">
                        <div className="erp-header-left">
                            Welcome {user} !!
                        </div>

                        <div className="erp-header-center">
                            <label className="erp-form-label-lg main_heading">
                                Employee Entry {actionType}
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
                    <form id="employeeFormID">
                        <div className="row pt-2">
                            {/* first row */}
                            <div className="col-lg-4">

                                <div className='row p-1'>
                                    <div className="col-sm-5">
                                        <Form.Label className="erp-form-label">Employee Name<span className="required">*</span></Form.Label>
                                    </div>
                                    <div className="col-sm-7">
                                        <Form.Control
                                            type="text"
                                            id="employeeName"
                                            className="erp_input_field ps-1"
                                            value={(employeeName || "").toUpperCase()}
                                            onChange={(e) => setEmployeeName(e.target.value)}
                                            disabled={keyForViewUpdate !== "Add"}
                                        />
                                    </div>
                                </div>

                                <div className='row p-1'>
                                    <div className='col-sm-5'>
                                        <Form.Label className="erp-form-label">Employee State </Form.Label>
                                    </div>
                                    <div className="col-sm-7">
                                        <Select
                                            options={stateOptions} isDisabled={keyForViewUpdate === 'View'}
                                            value={stateOptions.find(option => option.value === employeeState)}
                                            onChange={(selectedOpt) => {
                                                setEmployeeState(selectedOpt.value);
                                            }}
                                            placeholder="Search State..."
                                            className="form-search-custom"
                                            classNamePrefix="custom-select"
                                            styles={{
                                                control: (base) => ({
                                                    ...base,
                                                    minHeight: "33px",   // ✅ match default height
                                                    height: "33px"
                                                }),
                                                option: (provided, state) => ({
                                                    ...provided, fontSize: '12px'
                                                }),
                                                singleValue: (provided, state) => ({
                                                    ...provided, fontSize: '12px'
                                                }),
                                                input: (provided, state) => ({
                                                    ...provided, fontSize: '12px'
                                                })
                                            }}
                                        />
                                    </div>
                                </div>

                                <div className='row p-1'>
                                    <div className='col-sm-5'>
                                        <Form.Label className="erp-form-label">Gender<span className="required">*</span> </Form.Label>
                                    </div>
                                    <div className='col-sm-7'>
                                        <select id="gender" className="form-select form-select-sm" disabled={keyForViewUpdate === 'View'} value={gender} onChange={(e) => {
                                            setGender(e.target.value);
                                        }}>
                                            <option value={0} disabled>Select</option>
                                            {genderOptions.map(option => (
                                                <option value={option.value}>{option.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>


                            </div>


                            {/* second row */}
                            <div className="col-lg-4 ">

                                <div className='row p-1'>
                                    <div className='col-sm-5'>
                                        <Form.Label className="erp-form-label">Date Of Birth</Form.Label>
                                    </div>
                                    <div className='col-sm-7'>
                                        <Form.Control type="date" id='dateOfBirth' className="erp_input_field ps-1" value={dateOfBirth} onChange={e => { setDateOfBirth(e.target.value) }} disabled={keyForViewUpdate === 'View'} />
                                    </div>
                                </div>

                                <div className="row p-1">
                                    <div className="col-sm-5">
                                        <Form.Label className="erp-form-label">Is Active : </Form.Label>
                                    </div>

                                    <div className="col-sm-7">
                                        <Form>
                                            <div className="erp_form_radio">
                                                <div className="fCheck">
                                                    <Form.Check
                                                        type="radio"
                                                        label="Active"
                                                        name="isActive"
                                                        className="erp_radio_button"
                                                        disabled={keyForViewUpdate === "View"}
                                                        checked={employeeStatus === true}
                                                        onChange={() => setEmployeeStatus(true)}
                                                    />
                                                </div>

                                                <div className="sCheck">
                                                    <Form.Check
                                                        type="radio"
                                                        label="In-Active"
                                                        name="isActive"
                                                        className="erp_radio_button"
                                                        disabled={keyForViewUpdate === "View"}
                                                        checked={employeeStatus === false}
                                                        onChange={() => setEmployeeStatus(false)}
                                                    />
                                                </div>
                                            </div>
                                        </Form>

                                    </div>
                                </div>

                                <div className='row p-1'>
                                    <div className='col-sm-5'>
                                        <Form.Label className="erp-form-label">Employee Address : </Form.Label>
                                    </div>

                                    <div className='col-sm-7'>
                                        <Form.Control as="textarea" rows={2} className="erp_txt_area" id="employeeAddress" value={employeeAddress} disabled={keyForViewUpdate === 'View'} onChange={e => { setEmployeeAddress(e.target.value); }} maxlength="255" optional='optional' />
                                    </div>
                                </div>





                            </div>

                            <div className="col-lg-4">
                                <div className="employee-image-container text-center">
                                    <img
                                        src={employeeImage}
                                        alt="Employee"
                                        className="employee-profile-img"
                                    />

                                    <Form.Label className={`erp-form-label upload-btn ${keyForViewUpdate === 'View' ? 'd-none' : 'display'}`}>
                                        Change Photo
                                        <input
                                            type="file"
                                            accept="image/*"
                                            hidden
                                            onChange={(e) => {
                                                const file = e.target.files[0];
                                                if (file) {
                                                    saveEmployeeImageMock(employee_id, file);
                                                }
                                            }}
                                        />
                                    </Form.Label>
                                </div>
                            </div>

                        </div>
                    </form>

                    <div className="card-footer mb-3 text-center">
                        <button type="button" className="erp-gb-button" onClick={() => { const path = '/Employee/EmployeeListing'; navigate(path); }} variant="button" fontWeight="regular" >Back</button>
                        <button type="submit" id="saveBtn" className={`erp-gb-button ms-2 ${keyForViewUpdate === 'View' ? 'd-none' : 'display'}`} onClick={() => saveEmployeeData()} variant="button" fontWeight="regular">{actionLabel}</button>
                    </div >
                </div>
            </div>

            {/* Success Msg Popup */}
            <SuccessModal handleCloseSuccessModal={() => handleCloseSuccessModal()} show={[showSuccessMsgModal, succMsg]} />
            {/* Error Msg Popup */}
            <ErrorModal handleCloseErrModal={() => handleCloseErrModal()} show={[showErrorMsgModal, errMsg]} />
            {/* </DashboardLayout> */}
        </>
    )
}

export default FrmEmployeeEntry
