/** Demo rows — Leave Types listing. */

export function createLeaveTypesSeed() {
  return [
    { id: 20, name: "Relocation Leave", code: "RL", description: "Leave for relocating residence", proofRequired: false, status: "Active" },
    { id: 19, name: "Birthday Leave", code: "BDL", description: "Special leave on employee birthday", proofRequired: false, status: "Active" },
    { id: 18, name: "Voting Leave", code: "VL", description: "Leave to exercise voting rights", proofRequired: false, status: "Active" },
    { id: 17, name: "Jury Duty Leave", code: "JDL", description: "Leave for jury service or court appearance", proofRequired: true, status: "Active" },
    { id: 16, name: "Quarantine Leave", code: "QL", description: "Mandatory isolation for infectious diseases", proofRequired: true, status: "Active" },
    { id: 15, name: "Emergency Leave", code: "EML", description: "Urgent unforeseen personal emergency", proofRequired: false, status: "Active" },
    { id: 14, name: "Medical Leave", code: "MDL", description: "Extended leave for medical treatment or surgery", proofRequired: true, status: "Active" },
    { id: 13, name: "Sick Leave", code: "SL", description: "Short-term medical absence", proofRequired: true, status: "Active" },
    { id: 12, name: "Casual Leave", code: "CL", description: "Short discretionary absences subject to quota", proofRequired: false, status: "Active" },
    { id: 11, name: "Bereavement Leave", code: "BL", description: "Compassionate leave following family bereavement", proofRequired: false, status: "Active" },
    { id: 10, name: "Parental Leave", code: "PL", description: "Primary caregiver leave arrangement", proofRequired: true, status: "Active" },
    { id: 9, name: "Maternity Leave", code: "ML", description: "Statutory maternity leave window", proofRequired: true, status: "Active" },
    { id: 8, name: "Paternity Leave", code: "PTL", description: "Statutory paternity leave window", proofRequired: true, status: "Active" },
    { id: 7, name: "Adoption Leave", code: "AL", description: "Support period for statutory adoption phase", proofRequired: true, status: "Active" },
    { id: 6, name: "Wedding Leave", code: "WL", description: "Short leave window for marriage", proofRequired: false, status: "Active" },
    { id: 5, name: "Study Leave", code: "ST", description: "Approved training & certification days", proofRequired: false, status: "Active" },
    { id: 4, name: "Unpaid Leave", code: "UL", description: "Leave without pay (HR validated)", proofRequired: false, status: "Active" },
    { id: 3, name: "Sabbatical", code: "SB", description: "Extended unpaid / partial paid sabbatical", proofRequired: false, status: "Active" },
    { id: 2, name: "Work From Home", code: "WFH", description: "Remote work day coded as leave", proofRequired: false, status: "Active" },
    { id: 1, name: "Compensatory Off", code: "CTO", description: "Time off in lieu of overtime", proofRequired: false, status: "Active" },
  ];
}
