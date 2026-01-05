// import { useState, useEffect, useRef, useMemo, useReducer } from "react";
// import $ from 'jquery';
// import MDTypography from "components/MDTypography";
// import MDButton from "components/MDButton";
// import { useLocation, useNavigate } from "react-router-dom";
// import SuccessModal from "components/Modals/SuccessModal";
// import ConfigConstants from "assets/Constants/config-constant";
// import ComboBox from 'Features/ComboBox';
// import ErrorModal from 'components/Modals/ErrorModal';
// import ValidateNumberDateInput from 'FrmGeneric/ValidateNumberDateInput';
// import { CircularProgress } from '@material-ui/core';
// import Select from "react-select";
// import GenerateTAutoNo from "FrmGeneric/GenerateTAutoNo";
// import { Table, Form } from "react-bootstrap";
// import { MdDelete } from "react-icons/md";
// import { IoAddCircleOutline } from 'react-icons/io5';
// import { globalQuery, resetGlobalQuery } from 'assets/Constants/config-constant';


// function FrmSQCBlowroomEntry() {

//     const { state } = useLocation();
//     const configConstants = ConfigConstants();

//     const { COMPANY_ID, UserName, FINANCIAL_SHORT_NAME, COMPANY_BRANCH_ID, UserId, SHORT_COMPANY, COMPANY_NAME, COMPANY_ADDRESS } = configConstants;
//     const { sqc_blowroom_master_id = 0, keyForViewUpdate = 'Add' } = state || {};
//     const [isLoading, setIsLoading] = useState();

//     //Current date
//     const today = () => {
//         const now = new Date();
//         const year = now.getFullYear();
//         const month = String(now.getMonth() + 1).padStart(2, "0");
//         const day = String(now.getDate()).padStart(2, "0");
//         return `${year}-${month}-${day}`;
//     };

//     const actionType = keyForViewUpdate === 'Add' ? '(Create)' : keyForViewUpdate === 'update' ? '(Update)' : keyForViewUpdate === 'Approve' ? '(Approve)' : '(View)';
//     const actionLabel = keyForViewUpdate === 'Add' ? 'Save' : keyForViewUpdate === 'update' ? 'Update' : 'Approve';

//     // Error Msg HANDLING
//     const handleCloseErrModal = () => setShowErrorMsgModal(false);
//     const [showErrorMsgModal, setShowErrorMsgModal] = useState(false);
//     const [errMsg, setErrMsg] = useState('');
//     // Success Msg HANDLING
//     const handleCloseSuccessModal = () => {
//         setShowSuccessMsgModal(false);
//         navigate(`/BlowroomSQC/FrmSQCBlowroomListing`);
//     }
//     const [showSuccessMsgModal, setShowSuccessMsgModal] = useState(false);
//     const [succMsg, setSuccMsg] = useState('');

//     // For navigate
//     const navigate = useNavigate();

//     // useRef Hooks
//     const combobox = useRef();
//     const validateNumberDateInput = useRef();
//     const generateAutoNoAPiCall = useRef();
//     const sqcBlowroomTableRef = useRef([]);
//     const storedvalues = useRef({ 'plant_short_name': '', 'mixing_id': 0, 'newCountGroup': '' })

//     //useState Hooks for Master Data
//     const [sqc_blowroom_code, setSQCBlowroomCode] = useState("");
//     const [sqc_blowroom_date, setSQCBlowroomDate] = useState(today());
//     const [plant_id, setPlantId] = useState(0);
//     const [section_id, setSectionId] = useState(6);
//     const [sub_section_id, setSubSectionId] = useState(6);
//     const [shift_id, setShiftId] = useState(0);
//     const [mixing_chart_no, setMixingChartNo] = useState("");
//     const [sqc_blowroom_status, setBlowroomStatus] = useState('P');
//     const [sqc_blowroom_created_by_id, setCreatedById] = useState(parseInt(UserId));
//     const [sqc_blowroom_approved_by_id, setApprovedById] = useState(parseInt(UserId));
//     const [sqc_blowroom_approved_date, setBlowroomApprovedDate] = useState(today());
//     // state for new input


//     const [plantOptions, setPlantOptions] = useState([]);
//     const [mixingChartOptions, setMixingChartOptions] = useState([]);
//     const [employeeOptions, setEmployeeOpts] = useState([]);
//     const [shiftOptions, setShiftOptions] = useState([]);
//     const [countGroupOpts, setCountGroupOptions] = useState([]);
//     const [sectionOptions, setSectionOptions] = useState([]);
//     const [machineOptions, setMachineOptions] = useState([]);
//     const [subsectionOptions, setSubSectionOptions] = useState([]);

//     const [sqcBlowroomMasterData, setSQCBlowroomMasterData] = useState({});

//     useEffect(() => {
//         const loadComboBoxes = async () => {
//             debugger
//             const fetchComboboxData = await fetch(`${process.env.REACT_APP_BASE_URL}/api/XmSpinningSqcBlowroom/FnFetchComboBoxes/${COMPANY_ID}/${COMPANY_BRANCH_ID}/${6}`);
//             const response = await fetchComboboxData.json();

//             const plantoptions = [
//                 ...response.PlantOptions.map((plant) => ({ ...plant, value: plant.plant_id, label: plant.plant_name }))
//             ]
//             setPlantOptions(plantoptions);

//             const sectionoptions = [
//                 ...response.SectionOptions.map((sec) => ({ ...sec, value: sec.production_section_id, label: sec.production_section_name }))
//             ]
//             setSectionOptions(sectionoptions);

//             setSubSectionOptions(response.SubSectionOptions);

//             const employeeoptions = [
//                 ...response.EmployeeOptions.map((empl) => ({ ...empl, value: empl.employee_id, label: empl.employee_name }))
//             ]
//             setEmployeeOpts(employeeoptions);

//             const countgroupoptions = [
//                 ...response.CountGroups.map((count) => ({ ...count, value: count.property_name, label: count.property_name }))
//             ]
//             setCountGroupOptions(countgroupoptions);

//             const machineoptions = [
//                 ...response.MachineOptions.map((mac) => ({ ...mac, value: mac.machine_id, label: mac.machine_short_name }))
//             ]
//             setMachineOptions(machineoptions);

//             setShiftOptions(response.ShiftOptions);

//         }

//         try {
//             setIsLoading(true);
//             loadComboBoxes();
//             if (sqc_blowroom_master_id !== 0) {
//                 FnfetchSQCBlowroomRecords();
//             }
//         } catch (error) {

//         } finally {
//             setIsLoading(false);
//         }
//     }, []);

//     useEffect(() => {
//         const loadSQCComberCode = async () => {
//             const subSectionShortName = subsectionOptions.find(sub => sub.production_sub_section_id === 6)?.production_sub_section_short_name;
//             const getPINoApiCall = await generateAutoNoAPiCall.current.generateTAutoNo("xm_spinn_sqc_blowroom_master", "sqc_blowroom_code", storedvalues.current.plant_short_name, subSectionShortName, "5", "plant_id", plant_id);
//             setSQCBlowroomCode(getPINoApiCall);
//         }
//         if (sqc_blowroom_master_id === 0) { loadSQCComberCode(); };
//     }, [plant_id]);

//     const FnfetchSQCBlowroomRecords = async () => {
//         const fetchDataAPICall = await fetch(`${process.env.REACT_APP_BASE_URL}/api/XmSpinningSqcBlowroom/FnFetchAllRecord/${sqc_blowroom_master_id}`);
//         const response = await fetchDataAPICall.json();

//         setSQCBlowroomMasterData(response);
//         setPlantId(response.plant_id);
//         setSQCBlowroomCode(response.sqc_blowroom_code);
//         setSQCBlowroomDate(response.sqc_blowroom_date);
//         setShiftId(response.shift_id);
//         setMixingChartNo(response.mixing_chart_no);
//         setCreatedById(response.sqc_blowroom_created_by_id);
//         setBlowroomStatus(response.sqc_blowroom_status);
//         if (response.sqc_blowroom_status === 'A') {
//             setApprovedById(response.sqc_blowroom_approved_by_id);
//             setBlowroomApprovedDate(response.sqc_blowroom_approved_date);
//         }

//         actionOnDetailsTbl({ key: "updateTotalData", updateTotalData: response.details });

//     }

//     const emptyDetailsObj = {
//         count_group: "",
//         line_no: "",
//         machine_id: 0,
//         sample_qty: 0,
//         trash_percent: 0,
//         dropping_percent: 0,
//         waste_percent: 0,
//         moisture_percent: 0,
//         remark: ''
//     }

//     const FnUpdateDetailstbl = (state, action) => {
//         switch (action.key) {
//             case "appendNewRow":
//                 return [...state, emptyDetailsObj];

//             case "removeRow":
//                 return state.filter((_, i) => i !== action.indexToBeRemoved);

//             case 'updateRow':
//                 return state.map((_, i) => i === action.indexDataToUpdate ? { ...action.updateRow } : _);

//             case 'updateTotalData':
//                 return action.updateTotalData;

//             default: break;
//         }
//     }

//     const safeDecimal = (value, decimals = 4) => {
//         if (value === "" || value === "-") return value;

//         // Allow only numbers and one decimal
//         let numStr = value.toString();

//         // Split integer & decimal parts
//         const parts = numStr.split(".");

//         if (parts.length > 1) {
//             // Limit decimal digits
//             parts[1] = parts[1].slice(0, decimals);
//             numStr = parts.join(".");
//         }

//         const num = Number(numStr);

//         if (isNaN(num)) return "";

//         if (num > 100) return "100";
//         if (num < 0) return "0";

//         return numStr;
//     };


//     const [sqc_blowroom_details, actionOnDetailsTbl] = useReducer(FnUpdateDetailstbl, []);

//     const renderSQCBlowroomRbl = useMemo(() => {
//         return <div style={{ minHeight: '300px', maxHeight: '500px', overflow: 'auto' }} >
//             <Table className="erp_table mb-3" id='blowroomsqcdetailstable' responsive bordered striped>
//                 <thead className="erp_table_head">
//                     <tr>
//                         <th className={`erp_table_th ${keyForViewUpdate === "view" || keyForViewUpdate === "Approve" ? 'd-none' : 'display'}`} style={{ width: "10px" }}>Action</th>
//                         <th className="erp_table_th " style={{ width: "20px" }}>Sr. No</th>
//                         <th className="erp_table_th " style={{ width: "200px" }}>Machine Name</th>
//                         <th className="erp_table_th " style={{ width: "150px" }}>Count Group</th>
//                         <th className="erp_table_th " style={{ width: "60px" }}>Line No.</th>
//                         <th className="erp_table_th " style={{ width: "60px" }}>Sample Quantity</th>
//                         <th className="erp_table_th " style={{ width: "60px" }}>Trash %</th>
//                         <th className="erp_table_th " style={{ width: "60px" }}>Dropping %</th>
//                         <th className="erp_table_th " style={{ width: "60px" }}>Waste %</th>
//                         <th className="erp_table_th " style={{ width: "60px" }}>Moisture %</th>
//                         <th className="erp_table_th " style={{ width: "100px" }}>Remark</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {sqc_blowroom_details.length > 0 && (
//                         sqc_blowroom_details?.map((details, indexOfItem) => {

//                             //Creating Ref for each Element
//                             if (!sqcBlowroomTableRef.current[indexOfItem]) {
//                                 sqcBlowroomTableRef.current[indexOfItem] = {}
//                             }
//                             return (

//                                 <tr indexOfItem={indexOfItem}>
//                                     <td className={`erp_table_td ${keyForViewUpdate === "view" || keyForViewUpdate === "Approve" ? 'd-none' : 'display'}`}>
//                                         <IoAddCircleOutline className={`erp_trAdd_icon ${keyForViewUpdate === 'Add' || keyForViewUpdate === 'update' ? 'display' : 'd-none'} `} onClick={() => actionOnDetailsTbl({ key: "appendNewRow" })} />
//                                         <MdDelete className={`erp-delete-btn ${(keyForViewUpdate === 'Add' || keyForViewUpdate === 'update') && indexOfItem !== 0 ? 'display' : 'd-none'} `} onClick={(e) => actionOnDetailsTbl({ key: "removeRow", indexToBeRemoved: indexOfItem })} />
//                                     </td>

//                                     <td className="erp_table_td erp_align-right">{indexOfItem + 1}</td>

//                                     <td className="erp_table_td">
//                                         <Select
//                                             options={[
//                                                 { value: 0, label: 'Select', isDisabled: true },
//                                                 ...machineOptions.filter(mac => mac.plant_id === parseInt(plant_id) && mac.section_id === parseInt(section_id))
//                                             ]}
//                                             ref={(e) => {
//                                                 sqcBlowroomTableRef.current[indexOfItem].machine_id = e;
//                                             }}
//                                             isDisabled={keyForViewUpdate === 'view' || keyForViewUpdate === 'Approve'}
//                                             value={machineOptions.filter(option => details.machine_id === option.value)}
//                                             onChange={(selectedOpt) => updateSQCBlowroomDetailsTbl(details, selectedOpt.value, indexOfItem, "machine_id")}
//                                             placeholder="Search Machine..."
//                                             className="form-search-custom"
//                                             classNamePrefix="custom-select"
//                                             styles={{
//                                                 control: (base) => ({
//                                                     ...base,
//                                                     minWidth: "250px",
//                                                     minHeight: "33px",   // ✅ match default height
//                                                     height: "33px"
//                                                 }),
//                                                 option: (p) => ({ ...p, fontSize: '12px' }),
//                                                 singleValue: (p) => ({ ...p, fontSize: '14px' }),
//                                                 multiValue: (p) => ({ ...p, fontSize: '12px' }),
//                                                 valueContainer: (p) => ({ ...p, flexWrap: "wrap" }),
//                                                 input: (p) => ({ ...p, fontSize: '15px' }),
//                                                 menuPortal: (base) => ({ ...base, zIndex: 9999 })
//                                             }}
//                                             menuPortalTarget={document.body}
//                                         />
//                                     </td>

//                                     <td className="erp_table_td">
//                                         {/* <div style={{ display: "flex", alignItems: "center", gap: "1px" }}> */}

//                                             <Select
//                                                 options={countGroupOpts}
//                                                 isDisabled={keyForViewUpdate === "view" || keyForViewUpdate === "Approve"}
//                                                 ref={(e) => {
//                                                     sqcBlowroomTableRef.current[indexOfItem].count_group = e;
//                                                 }}
//                                                 value={
//                                                     countGroupOpts.find(grp => grp.value === details.count_group) || null
//                                                 }
//                                                 onChange={(selectedOption) => {
//                                                     updateSQCBlowroomDetailsTbl(
//                                                         details,
//                                                         selectedOption?.value,
//                                                         indexOfItem,
//                                                         "count_group"
//                                                     );
//                                                 }}
//                                                 // onInputChange={(inputValue, { action }) => {
//                                                 //     if (action === "input-change") {
//                                                 //         storedvalues.current.newCountGroup = inputValue;
//                                                 //     }
//                                                 // }}
//                                                 placeholder="Search for Count Group..."
//                                                 className="form-search-custom"
//                                                 classNamePrefix="custom-select"
//                                                 menuPosition="fixed"
//                                                 menuPortalTarget={document.body}
//                                                 menuShouldScrollIntoView={false}
//                                                 styles={{
//                                                     control: (base) => ({
//                                                         ...base,
//                                                         minWidth: "230px",
//                                                         minHeight: "33px",   // ✅ match default height
//                                                         height: "33px"
//                                                     }),

//                                                     option: (p) => ({ ...p, fontSize: "12px" }),
//                                                     singleValue: (p) => ({ ...p, fontSize: "14px" }),
//                                                     multiValue: (p) => ({ ...p, fontSize: "12px" }),

//                                                     valueContainer: (p) => ({
//                                                         ...p,
//                                                         flexWrap: "nowrap",
//                                                         padding: "2px 8px"   // ✅ same internal spacing
//                                                     }),

//                                                     input: (p) => ({
//                                                         ...p,
//                                                         fontSize: "15px",
//                                                         margin: 0,          // ✅ prevents height growth
//                                                         padding: 0,
//                                                         minWidth: "120px",
//                                                         flex: "1 1 auto"
//                                                     }),

//                                                     menuPortal: (base) => ({ ...base, zIndex: 9999 })
//                                                 }}


//                                             />

//                                             {/* {keyForViewUpdate !== "view" &&
//                                                 keyForViewUpdate !== "Approve" && (

//                                                     <Tooltip title="Add Count Group" placement="top">
//                                                         <span style={{ display: "inline-flex" }}>
//                                                             <MdAdd
//                                                                 style={{ color: "black", cursor: "pointer", fontSize: '14px' }}
//                                                                 onClick={() => {
//                                                                     if (!storedvalues.current.newCountGroup?.trim()) return;

//                                                                     if (countGroupOpts.some(opt => opt.value === storedvalues.current.newCountGroup)) {
//                                                                         updateSQCBlowroomDetailsTbl(
//                                                                             details,
//                                                                             storedvalues.current.newCountGroup,
//                                                                             indexOfItem,
//                                                                             "count_group"
//                                                                         );
//                                                                         return;
//                                                                     }

//                                                                     setCountGroupOptions(prev => [
//                                                                         ...prev,
//                                                                         { value: storedvalues.current.newCountGroup, label: storedvalues.current.newCountGroup }
//                                                                     ]);

//                                                                     updateSQCBlowroomDetailsTbl(
//                                                                         details,
//                                                                         storedvalues.current.newCountGroup,
//                                                                         indexOfItem,
//                                                                         "count_group"
//                                                                     );

//                                                                     storedvalues.current.newCountGroup = "";
//                                                                 }}
//                                                             />
//                                                         </span>
//                                                     </Tooltip>
//                                                 )}

//                                         </div> */}
//                                     </td>


//                                     <td className="erp_table_td">
//                                         <input
//                                             ref={(e) => {
//                                                 sqcBlowroomTableRef.current[indexOfItem].line_no = e;
//                                             }}
//                                             type="text" className="erp_input_field_table_txt mb-0 text-end" id={`line_no_${indexOfItem}`} style={{ width: "120px" }}
//                                             disabled={keyForViewUpdate === "view" || keyForViewUpdate === "Approve"} value={details.line_no}
//                                             onChange={(e) => updateSQCBlowroomDetailsTbl(details, e.target.value, indexOfItem, "line_no")}
//                                         />
//                                     </td>

//                                     <td className="erp_table_td">
//                                         <input
//                                             ref={(e) => {
//                                                 sqcBlowroomTableRef.current[indexOfItem].sample_qty = e;
//                                             }}
//                                             type="text" className="erp_input_field_table_txt mb-0 text-end" id={`sample_qty_${indexOfItem}`} style={{ width: "120px" }}
//                                             disabled={keyForViewUpdate === "view" || keyForViewUpdate === "Approve"} value={details.sample_qty}
//                                             onChange={(e) => updateSQCBlowroomDetailsTbl(details, validateNumberDateInput.current.validateNumber(parseInt(e.target.value)), indexOfItem, "sample_qty")}
//                                         />
//                                     </td>

//                                     <td className="erp_table_td">
//                                         <input
//                                             ref={(e) => {
//                                                 sqcBlowroomTableRef.current[indexOfItem].trash_percent = e;
//                                             }}
//                                             type="text" className="erp_input_field_table_txt mb-0 text-end" id={`trash_percent_${indexOfItem}`} style={{ width: "120px" }}
//                                             disabled={keyForViewUpdate === "view" || keyForViewUpdate === "Approve"} value={details.trash_percent}
//                                             onChange={(e) => updateSQCBlowroomDetailsTbl(details, safeDecimal(e.target.value), indexOfItem, "trash_percent")}
//                                         />
//                                     </td>


//                                     <td className="erp_table_td">
//                                         <input
//                                             ref={(e) => {
//                                                 sqcBlowroomTableRef.current[indexOfItem].dropping_percent = e;
//                                             }}
//                                             type="text" className="erp_input_field_table_txt mb-0 text-end" id={`dropping_percent_${indexOfItem}`} style={{ width: "120px" }}
//                                             disabled={keyForViewUpdate === "view" || keyForViewUpdate === "Approve"} value={details.dropping_percent}
//                                             onChange={(e) => updateSQCBlowroomDetailsTbl(details, safeDecimal(e.target.value), indexOfItem, "dropping_percent")}
//                                         />
//                                     </td>

//                                     <td className="erp_table_td">
//                                         <input
//                                             ref={(e) => {
//                                                 sqcBlowroomTableRef.current[indexOfItem].waste_percent = e;
//                                             }}
//                                             type="text" className="erp_input_field_table_txt mb-0 text-end" id={`waste_percent_${indexOfItem}`} style={{ width: "120px" }}
//                                             disabled={keyForViewUpdate === "view" || keyForViewUpdate === "Approve"} value={details.waste_percent}
//                                             onChange={(e) => updateSQCBlowroomDetailsTbl(details, safeDecimal(e.target.value), indexOfItem, "waste_percent")}
//                                         />
//                                     </td>

//                                     <td className="erp_table_td">
//                                         <input
//                                             ref={(e) => {
//                                                 sqcBlowroomTableRef.current[indexOfItem].moisture_percent = e;
//                                             }}
//                                             type="text" className="erp_input_field_table_txt mb-0 text-end" id={`moisture_percent_${indexOfItem}`} style={{ width: "120px" }}
//                                             disabled={keyForViewUpdate === "view" || keyForViewUpdate === "Approve"} value={details.moisture_percent}
//                                             onChange={(e) => updateSQCBlowroomDetailsTbl(details, safeDecimal(e.target.value), indexOfItem, "moisture_percent")}
//                                         />
//                                     </td>

//                                     <td className="erp_table_td">
//                                         <input
//                                             ref={(e) => {
//                                                 sqcBlowroomTableRef.current[indexOfItem].remark = e;
//                                             }}
//                                             type="text" className="erp_input_field_table_txt mb-0 text-end"
//                                             id={`remark_${indexOfItem}`} style={{ width: "150px" }}
//                                             disabled={keyForViewUpdate === "view" || keyForViewUpdate === "Approve"} value={details.remark}
//                                             onChange={(e) => updateSQCBlowroomDetailsTbl(details, e.target.value, indexOfItem, "remark")}
//                                         />
//                                     </td>
//                                 </tr>
//                             )
//                         })
//                     )}
//                 </tbody>
//             </Table></div>
//     }, [sqc_blowroom_details, machineOptions, countGroupOpts, plant_id]);


//     const updateSQCBlowroomDetailsTbl = (currentObj, event, rowIndex, columnName) => {
//         debugger
//         let currentElementRef = sqcBlowroomTableRef.current[rowIndex][columnName];
//         let enteredValue = event;

//         const domNode = currentElementRef?.parentElement || currentElementRef?.controlRef?.parentElement;
//         delete domNode?.dataset?.tip;

//         if (columnName === "machine_id") {
//             let sqcBlowroomData = sqc_blowroom_details.filter((i, index) => index !== rowIndex);
//             let matchedMachineId = sqcBlowroomData.find(dt => dt.machine_id === enteredValue);

//             if (matchedMachineId) {
//                 domNode.dataset.tip = "Please Select Another Machine...!"
//                 enteredValue = 0;
//             }
//         }

//         currentObj[columnName] = enteredValue;
//         actionOnDetailsTbl({ key: "updateRow", indexDataToUpdate: rowIndex, updateRow: currentObj })
//     }

//     useEffect(() => {
//         const loadMixingChartNo = async () => {
//             resetGlobalQuery();
//             globalQuery.columns = ['Distinct mixing_chart_no'];
//             globalQuery.table = "pt_mixing_chart_cotton_bales";
//             globalQuery.conditions.push({ field: "plant_id", operator: "=", value: plant_id });
//             globalQuery.conditions.push({ field: "is_delete", operator: "=", value: 0 });
//             globalQuery.conditions.push({ field: "issue_flag", operator: "=", value: 1 });
//             const mixingChartNoAPICall = await combobox.current.fillFiltersCombo(globalQuery);
//             const employeeOpts = [
//                 { value: 0, label: 'Select' },
//                 ...mixingChartNoAPICall.map((chart) => ({ ...chart, value: chart.mixing_chart_no, label: `${chart.mixing_chart_no}` })),
//             ];
//             setMixingChartOptions(employeeOpts);
//         }

//         loadMixingChartNo();
//         actionOnDetailsTbl({ key: "updateTotalData", updateTotalData: [emptyDetailsObj] })
//     }, [plant_id]);

//     const validateForm = () => {

//         if (keyForViewUpdate === "Approve") return true;

//         if (plant_id === 0) {
//             $("#error_plant_id").text("Select Plant...!").show();
//             return false;
//         }

//         if (shift_id === 0) {
//             $("#error_shift_id").text("Select Shift...!").show();
//             return false;
//         }

//         if (!mixing_chart_no) {
//             $("#error_mixing_chart_no").text("Select Mixing Chart No...!").show();
//             return false;
//         }

//         for (let i = 0; i < sqc_blowroom_details.length; i++) {

//             const detailsObj = sqc_blowroom_details[i];
//             const detailsTableObjRef = sqcBlowroomTableRef.current?.[i];

//             for (const key of Object.keys(emptyDetailsObj)) {

//                 const value = detailsObj?.[key];
//                 const ref = detailsTableObjRef?.[key];

//                 if (['machine_id', 'count_group'].includes(key)) {
//                     if (value === 0 || value === "") {
//                         ref?.controlRef?.parentElement?.setAttribute("data-tip", "Please Select...!");
//                         return false;
//                     }
//                 } else {
//                     if (key !== "remark" && (value === 0 || value === "")) {
//                         ref?.parentElement?.setAttribute("data-tip", "Please Enter...!");
//                         return false;
//                     }
//                 }
//             }
//         }

//         return true;
//     };



//     const saveSQCBloomData = async () => {
//         debugger
//         try {
//             if (validateForm() === true) {
//                 setIsLoading(true);
//                 let json = { 'masterData': {}, 'detailsData': [], commonIds: { 'keyForViewUpdate': keyForViewUpdate, 'company_id': COMPANY_ID } };

//                 json.masterData = {
//                     sqc_blowroom_master_id: sqc_blowroom_master_id,
//                     company_id: COMPANY_ID,
//                     company_branch_id: COMPANY_BRANCH_ID,
//                     financial_year: FINANCIAL_SHORT_NAME,
//                     sqc_blowroom_code: sqc_blowroom_code,
//                     sqc_blowroom_date: sqc_blowroom_date,
//                     plant_id: plant_id,
//                     section_id: section_id,
//                     sub_section_id: sub_section_id,
//                     shift_id: shift_id,
//                     shift_name: shiftOptions.find(shf => shf.property_id === parseInt(shift_id))?.property_name,
//                     mixing_chart_no: mixing_chart_no,
//                     mixing_id: storedvalues.current.mixing_id ?? 0,
//                     sqc_blowroom_status: keyForViewUpdate === 'Approve' ? 'A' : 'P',
//                     sqc_blowroom_created_by_id: sqc_blowroom_created_by_id,
//                     sqc_blowroom_approved_by_id: keyForViewUpdate === 'Approve' ? sqc_blowroom_approved_by_id : 0,
//                     sqc_blowroom_approved_date: keyForViewUpdate === 'Approve' ? sqc_blowroom_approved_date : '',
//                     created_by: keyForViewUpdate === "Add" ? UserName : sqcBlowroomMasterData?.created_by,
//                     created_on: keyForViewUpdate === "Add" ? new Date().toISOString() : sqcBlowroomMasterData?.created_on,
//                     modified_by: keyForViewUpdate === "Add" ? '' : UserName,
//                     modified_on: keyForViewUpdate === "Add" ? '' : new Date().toISOString(),
//                 }

//                 for (const detailsData of sqc_blowroom_details) {
//                     let emptyDetailsObj = {
//                         sqc_blowroom_details_id: keyForViewUpdate === "Approve" ? detailsData.sqc_blowroom_details_id : 0,
//                         sqc_blowroom_master_id: sqc_blowroom_master_id,
//                         company_id: COMPANY_ID,
//                         company_branch_id: COMPANY_BRANCH_ID,
//                         financial_year: FINANCIAL_SHORT_NAME,
//                         sqc_blowroom_code: sqc_blowroom_code,
//                         sqc_blowroom_date: sqc_blowroom_date,
//                         plant_id: plant_id,
//                         section_id: section_id,
//                         sub_section_id: sub_section_id,
//                         shift_id: shift_id,
//                         shift_name: shiftOptions.find(shf => shf.property_id === parseInt(shift_id))?.property_name,
//                         count_group: detailsData.count_group,
//                         line_no: detailsData.line_no,
//                         machine_id: detailsData.machine_id,
//                         mixing_chart_no: mixing_chart_no,
//                         mixing_id: storedvalues.current.mixing_id ?? 0,
//                         sample_qty: detailsData.sample_qty,
//                         trash_percent: detailsData.trash_percent,
//                         dropping_percent: detailsData.dropping_percent,
//                         waste_percent: detailsData.waste_percent,
//                         moisture_percent: detailsData.moisture_percent,
//                         sqc_blowroom_status: keyForViewUpdate === 'Approve' ? 'A' : 'P',
//                         remark: detailsData.remark,
//                         sqc_blowroom_created_by_id: sqc_blowroom_created_by_id,
//                         sqc_blowroom_approved_by_id: keyForViewUpdate === 'Approve' ? sqc_blowroom_approved_by_id : 0,
//                         sqc_blowroom_approved_date: keyForViewUpdate === 'Approve' ? sqc_blowroom_approved_date : '',
//                         created_by: keyForViewUpdate === "Add" ? UserName : sqcBlowroomMasterData?.created_by,
//                         created_on: keyForViewUpdate === "Add" ? new Date().toISOString() : sqcBlowroomMasterData?.created_on,
//                         modified_by: keyForViewUpdate === "Add" ? '' : UserName,
//                         modified_on: keyForViewUpdate === "Add" ? '' : new Date().toISOString(),
//                     }

//                     json.detailsData.push(emptyDetailsObj);
//                 }

//                 const saveAPICall = await fetch(`${process.env.REACT_APP_BASE_URL}/api/XmSpinningSqcBlowroom/FnAddUpdateRecord`, {
//                     method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(json)
//                 });
//                 const response = await saveAPICall.json();
//                 if (response.success === 1) {
//                     setSuccMsg(response.message)
//                     setShowSuccessMsgModal(true);
//                 } else {
//                     setErrMsg(response.error)
//                     setShowErrorMsgModal(true)
//                 }
//             }
//         } catch (error) {

//         } finally {
//             setIsLoading(false);
//         }
//     }

//     const resizeObserverErr = window.console.error;
//     window.console.error = (...args) => {
//         if (args[0]?.includes("ResizeObserver loop")) return;
//         resizeObserverErr(...args);
//     };


//     return (
//         <>
//             {/* <DashboardLayout> */}
//             <ComboBox ref={combobox} />
//             <ValidateNumberDateInput ref={validateNumberDateInput} />
//             <GenerateTAutoNo ref={generateAutoNoAPiCall} />

//             {isLoading ?
//                 <div className="spinner-overlay"  >
//                     <div className="spinner-container">
//                         <CircularProgress color="primary" />
//                         <span>Loading...</span>
//                     </div>
//                 </div> :
//                 ''}

//             <div className="erp_top_Form">
//                 <div className='card p-1'>
//                     <div className='card-header text-center py-0'>
//                         <label className='erp-form-label-lg main_heding'>SQC Blowroom Entry {actionType}</label>
//                     </div>
//                     <form id="YarnPackingFormId">
//                         <div className="row pt-2">
//                             {/* first row */}
//                             <div className="col-lg-4">

//                                 <div className='row'>
//                                     <div className="col-sm-4">
//                                         <Form.Label className="erp-form-label">Plant Name<span className="required">*</span></Form.Label>
//                                     </div>
//                                     <div className="col-sm-8">
//                                         <select id="plant_id" className="form-select form-select-sm" disabled={sqc_blowroom_master_id !== 0} value={plant_id} onChange={(e) => {
//                                             const selectedPlant = plantOptions.find(plant => plant.plant_id === parseInt(e.target.value));
//                                             storedvalues.current.plant_short_name = selectedPlant?.plant_short_name
//                                             setPlantId(e.target.value); $("#error_plant_id").hide();

//                                         }}>
//                                             <option value={0} disabled>Select</option>
//                                             {plantOptions?.map(plant => (
//                                                 <option value={plant.plant_id}>{plant.plant_name}</option>
//                                             ))}
//                                         </select>
//                                         <MDTypography variant="button" id="error_plant_id" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}></MDTypography>
//                                     </div>
//                                 </div>

//                                 <div className='row'>
//                                     <div className='col-sm-4'>
//                                         <Form.Label className="erp-form-label">Production Section </Form.Label>
//                                     </div>
//                                     <div className="col-sm-8">
//                                         <Select
//                                             options={sectionOptions} isDisabled
//                                             value={sectionOptions.find(option => option.value === section_id)}
//                                             onChange={(selectedOpt) => {
//                                                 setSectionId(selectedOpt.value);
//                                                 $("#error_section_id").hide();
//                                             }}
//                                             placeholder="Search Section..."
//                                             className="form-search-custom"
//                                             classNamePrefix="custom-select" // Add custom prefix for class names
//                                             styles={{
//                                                 option: (provided, state) => ({
//                                                     ...provided, fontSize: '12px' // Adjust the font size as per your requirement
//                                                 }),
//                                                 singleValue: (provided, state) => ({
//                                                     ...provided, fontSize: '12px' // Adjust the font size as per your requirement
//                                                 }),
//                                                 input: (provided, state) => ({
//                                                     ...provided, fontSize: '12px' // Adjust the font size as per your requirement
//                                                 })
//                                             }}
//                                         />
//                                         <MDTypography variant="button" id="error_section_id" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}></MDTypography>
//                                     </div>
//                                 </div>

//                                 <div className='row'>
//                                     <div className='col-sm-4'>
//                                         <Form.Label className="erp-form-label">Sub Section<span className="required">*</span> </Form.Label>
//                                     </div>
//                                     <div className='col-sm-8'>
//                                         <select id="sub_section_id" className="form-select form-select-sm" disabled value={sub_section_id} onChange={(e) => {
//                                             setSubSectionId(parseInt(e.target.value)); $("#error_sub_section_id").hide();
//                                         }}>
//                                             <option value={0} disabled>Select</option>
//                                             {subsectionOptions?.filter(dt => dt.production_section_id === parseInt(section_id))?.map(option => (
//                                                 <option value={option.production_sub_section_id}>{option.production_sub_section_name}</option>
//                                             ))}
//                                         </select>
//                                         <MDTypography variant="button" id="error_sub_section_id" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}></MDTypography>
//                                     </div>
//                                 </div>


//                             </div>


//                             {/* second row */}
//                             <div className="col-lg-4 ">

//                                 <div className='row'>
//                                     <div className='col-sm-4'>
//                                         <Form.Label className="erp-form-label">Blowroom SQC No & Date</Form.Label>
//                                     </div>
//                                     <div className='col-sm-8'>
//                                         <div className="row">
//                                             <div className='col-12 col-md-7 pe-md-0'>
//                                                 <Form.Control type="text" id="sqc_blowroom_code" className="erp_input_field" value={sqc_blowroom_code} readOnly />
//                                             </div>
//                                             <div className="col-12 col-md-5 pt-md-0 pt-2">
//                                                 <Form.Control type="date" id='sqc_blowroom_date' className="erp_input_field" value={sqc_blowroom_date} max={today()} onChange={e => { setSQCBlowroomDate(e.target.value) }} disabled={keyForViewUpdate === 'view' || keyForViewUpdate === 'Approve'} />
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>

//                                 <div className='row'>
//                                     <div className='col-sm-4'>
//                                         <Form.Label className="erp-form-label">Shift<span className="required">*</span> </Form.Label>
//                                     </div>
//                                     <div className='col-sm-8'>
//                                         <select id="shift_id" className="form-select form-select-sm" disabled={keyForViewUpdate === 'view' || keyForViewUpdate === 'Approve'} value={shift_id} onChange={(e) => {
//                                             setShiftId(parseInt(e.target.value)); $("#error_shift_id").hide();
//                                         }}>
//                                             <option value={0} disabled>Select</option>
//                                             {shiftOptions?.map(option => (
//                                                 <option value={option.property_id}>{option.property_name}</option>
//                                             ))}
//                                         </select>
//                                         <MDTypography variant="button" id="error_shift_id" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}></MDTypography>
//                                     </div>
//                                 </div>

//                                 <div className='row'>
//                                     <div className='col-sm-4'>
//                                         <Form.Label className="erp-form-label">Mixing Chart No</Form.Label>
//                                     </div>
//                                     <div className="col-sm-8">
//                                         <Select
//                                             options={mixingChartOptions} isDisabled={keyForViewUpdate === 'view' || keyForViewUpdate === 'Approve'}
//                                             value={mixingChartOptions.find(option => option.value === mixing_chart_no)}
//                                             onChange={(selectedOpt) => {
//                                                 setMixingChartNo(selectedOpt.value); $("#error_mixing_chart_no").hide();
//                                             }}
//                                             placeholder="Search Mixing Chart No..."
//                                             className="form-search-custom"
//                                             classNamePrefix="custom-select" // Add custom prefix for class names
//                                             styles={{
//                                                 option: (provided, state) => ({
//                                                     ...provided, fontSize: '12px' // Adjust the font size as per your requirement
//                                                 }),
//                                                 singleValue: (provided, state) => ({
//                                                     ...provided, fontSize: '12px' // Adjust the font size as per your requirement
//                                                 }),
//                                                 input: (provided, state) => ({
//                                                     ...provided, fontSize: '12px' // Adjust the font size as per your requirement
//                                                 })
//                                             }}
//                                         />
//                                         <MDTypography variant="button" id="error_mixing_chart_no" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}></MDTypography>

//                                     </div>
//                                 </div>


//                             </div>

//                             <div className="col-lg-4 ">

//                                 <div className='row'>
//                                     <div className='col-sm-4'>
//                                         <Form.Label className="erp-form-label">Created By <span className="required">*</span></Form.Label>
//                                     </div>
//                                     <div className="col-sm-8">
//                                         <Select
//                                             options={employeeOptions} isDisabled
//                                             value={employeeOptions.find(option => option.value === sqc_blowroom_created_by_id) || null}
//                                             onChange={(selectedOpt) => {
//                                                 setCreatedById(selectedOpt.value);
//                                                 $("#error_sqc_blowroom_created_by_id").hide();
//                                             }}
//                                             placeholder="Search Employee Here..."
//                                             className="form-search-custom"
//                                             classNamePrefix="custom-select" // Add custom prefix for class names
//                                             styles={{
//                                                 option: (provided, state) => ({
//                                                     ...provided, fontSize: '12px' // Adjust the font size as per your requirement
//                                                 }),
//                                                 singleValue: (provided, state) => ({
//                                                     ...provided, fontSize: '12px' // Adjust the font size as per your requirement
//                                                 }),
//                                                 input: (provided, state) => ({
//                                                     ...provided, fontSize: '12px' // Adjust the font size as per your requirement
//                                                 })
//                                             }}
//                                         />
//                                         <MDTypography variant="button" id="error_sqc_blowroom_created_by_id" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
//                                         </MDTypography>
//                                     </div>
//                                 </div>

//                                 <>
//                                     {(keyForViewUpdate === 'Approve' || (sqc_blowroom_status === "A" && keyForViewUpdate === "view")) && (
//                                         <>
//                                             <div className="row">
//                                                 <div className="col-sm-4">
//                                                     <Form.Label className="erp-form-label">
//                                                         Approved By
//                                                     </Form.Label>
//                                                 </div>
//                                                 <div className="col-sm-5">
//                                                     <Select isDisabled
//                                                         options={employeeOptions}
//                                                         value={employeeOptions.find(option => option.value === sqc_blowroom_approved_by_id) || null}
//                                                         onChange={(selectedOpt) => {
//                                                             setApprovedById(selectedOpt.value);
//                                                             $("#error_sqc_blowroom_approved_by_id").hide();
//                                                         }}
//                                                         placeholder="Search Employee Here..."
//                                                         className="form-search-custom"
//                                                         classNamePrefix="custom-select" // Add custom prefix for class names
//                                                         styles={{
//                                                             option: (provided, state) => ({
//                                                                 ...provided, fontSize: '12px' // Adjust the font size as per your requirement
//                                                             }),
//                                                             singleValue: (provided, state) => ({
//                                                                 ...provided, fontSize: '12px' // Adjust the font size as per your requirement
//                                                             }),
//                                                             input: (provided, state) => ({
//                                                                 ...provided, fontSize: '12px' // Adjust the font size as per your requirement
//                                                             })
//                                                         }}
//                                                     />
//                                                     <MDTypography variant="button" id="error_sqc_blowroom_approved_by_id" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
//                                                     </MDTypography>
//                                                 </div>
//                                                 <div className="col-sm-3">
//                                                     <Form.Control type="date" id="sqc_blowroom_approved_date" className="erp_input_field" value={sqc_blowroom_approved_date} disabled />
//                                                 </div>
//                                             </div>

//                                         </>
//                                     )}
//                                 </>

//                             </div>
//                         </div>
//                     </form>

//                     <div className='row p-1'>
//                         <div className="card-header p-1 main_heding mb-0">
//                             <label className="erp-form-label-md-lg">SQC Blowroom Details</label>
//                         </div>
//                         <div className='col-12 mt-2'>
//                             {sqc_blowroom_details.length > 0 ?
//                                 renderSQCBlowroomRbl
//                                 : ""}
//                         </div>
//                     </div>

//                     <div className="card-footer mb-3 text-center">
//                         <MDButton type="button" className="erp-gb-button" onClick={() => { const path = '/BlowroomSQC/FrmSQCBlowroomListing'; navigate(path); }} variant="button" fontWeight="regular" >Back</MDButton>
//                         <MDButton type="submit" id="saveBtn" className={`erp-gb-button ms-2 ${keyForViewUpdate === 'view' ? 'd-none' : 'display'}`} onClick={() => saveSQCBloomData()} variant="button" fontWeight="regular">{actionLabel}</MDButton>
//                     </div >
//                 </div>
//             </div>

//             {/* Success Msg Popup */}
//             <SuccessModal handleCloseSuccessModal={() => handleCloseSuccessModal()} show={[showSuccessMsgModal, succMsg]} />
//             {/* Error Msg Popup */}
//             <ErrorModal handleCloseErrModal={() => handleCloseErrModal()} show={[showErrorMsgModal, errMsg]} />
//             {/* </DashboardLayout> */}
//         </>
//     )
// }

// export default FrmSQCBlowroomEntry