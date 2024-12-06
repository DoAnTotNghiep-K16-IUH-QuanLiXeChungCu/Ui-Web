export const API = "http://localhost:3001/api/v1";

export const LOGIN = `${API}/users/login`;
export const SIGNUP = `${API}/users/sinup`;
export const UPDATE_USER = `${API}/users/UpdateUser`;
export const ALL_USER = `${API}/users/GetAllUsers`;
export const DELETE_USER = `${API}/users/DeleteUsers`;
export const GET_USER_BY_UUID = `${API}/users/GetUserByRFIDCard`;

export const ALL_APARTMENT = `${API}/apartment/GetAllApartments`;
export const APARTMENT_BY_ID = `${API}/apartment/GetApartmentById`;

export const ALL_SHIFT = `${API}/shift/GetAllShifts`;
export const SHIFT_BY_ID = `${API}/shift/GetShiftById`;
export const UPDATE_SHIFT = `${API}/shift/UpdateShift`;

export const ALL_CUSTOMER = `${API}/customer/GetAllCustomers`;
export const FILTER_CUSTOMER = `${API}/customer/FilterCustomers`;

export const CUSTOMER_BY_ID = `${API}/customer/GetCustomerById`;
export const CREATE_CUSTOMER = `${API}/customer/CreateCustomer`;
export const UPDATE_CUSTOMER = `${API}/customer/UpdateCustomer`;
export const DELETE_CUSTOMER = `${API}/customer/DeleteCustomer`;

export const ALL_PARKING_SLOT = `${API}/parkingSlot/GetAllParkingSlots`;
export const PARKING_SLOT_BY_ID = `${API}/parkingSlot/GetParkingSlotById`;
export const AVAILABE_PARKING_SLOT_BY_TYPE = `${API}/parkingSlot/GetAvailableParkingSlotsByType`;
export const AVAILABE_PARKING_SLOT_BY_TYPE_AND_CODE = `${API}/parkingSlot/GetAvailableParkingSlotsByTypeAndCode`;

export const ALL_PARKING_RATE = `${API}/parkingRate/GetAllParkingRates`;
export const UPDATE_PARKING_RATE = `${API}/parkingRate/UpdateParkingRate`;
export const CREATE_PARKING_RATE = `${API}/parkingRate/CreateParkingRate`;
export const GET_PARKING_RATE_BY_ID = `${API}/parkingRate/GetParkingRateById`;
export const DELETE_PARKING_RATE = `${API}/parkingRate/DeleteParkingRate`;

export const ALL_VEHICLE = `${API}/vehicle/GetAllVehicles`;
export const VEHICLE_BY_ID = `${API}/vehicle/GetVehicleById`;
export const VEHICLE_BY_LICENSEPLATE = `${API}/vehicle/GetVehicleByLicensePlate`;
export const VEHICLE_BY_TYPE = `${API}/vehicle/GetVehiclesByType`;
export const VEHICLE_BY_BRAND = `${API}/vehicle/GetVehiclesByBrand`;
export const CREATE_VEHICLE = `${API}/vehicle/CreateVehicle`;
export const DELETE_VEHICLE = `${API}/vehicle/DeleteVehicle`;
export const UPDATE_VEHICLE = `${API}/vehicle/UpdateVehicle`;

export const ALL_MONTHLY_TICKET = `${API}/residentHistoryMoney/GetAllResidentHistoryMoneys`;
export const CREATE_MONTHLY_TICKET = `${API}/residentHistoryMoney/CreateResidentHistoryMoney`;
export const FILTER_MONTHLY_TICKET = `${API}/residentHistoryMoney/FilterResidentHistoryMoneys`;
export const UPDATE_MONTHLY_TICKET = `${API}/residentHistoryMoney/UpdateResidentHistoryMoney`;
export const MONTHLY_TICKET_BY_ID = `${API}/residentHistoryMoney/GetResidentHistoryMoneyById`;
export const MONTHLY_STATISTIC = `${API}/residentHistoryMoney/GetMonthlyStatistics`;
export const YEAR_STATISTIC = `${API}/residentHistoryMoney/GetYearlyStatistics`;
export const MONTHLY_TICKET_BY_RFIDCARD = `${API}/residentHistoryMoney/GetResidentHistoryMoneysLatesbyRFIDCard`;
export const MONTHLY_TICKET_BY_LICENSEPLATE = `${API}/residentHistoryMoney/GetResidentHistoryMoneysLicensePlate`;
export const GET_TOTAL_FEES_FOR_CURRENT_AND_PREVIOUS_MONTH_ISRESIDENT = `${API}/residentHistoryMoney/GetTotalFeesForCurrentAndPreviousMonth`;
export const GET_TOTAl_FEES_FOR_TODAY_RESIDENT = `${API}/residentHistoryMoney/GetTotalFeesForToday`;

export const ALL_ENTRY_RECORD = `${API}/entryRecord/GetAllEntryRecords`;
export const ALL_EXIT_RECORD = `${API}/exitRecord/GetAllExitRecords`;
export const EXIT_RECORD_BY_ENTRY_RECORD_ID = `${API}/exitRecord/GetExitRecordByEntryRecordId`;
export const FILTER_RECORD = `${API}/entryRecord/FilterEntryRecords`;
export const CREATE_ENTRY_RECORD = `${API}/entryRecord/CreateEntryRecord`;
export const ENTRY_RECORD_TO_EXIT_RECORD = `${API}/entryRecord/GetEntryRecordByisOutAndLicensePlate`;
export const CREATE_EXIT_RECORD = `${API}/exitRecord/CreateExitRecord`;
export const GET_NUMBER_VEHICLE_IN_MONTH = `${API}/entryRecord/GetNumBerVehicleInMonth`;
export const GET_VEHICLE_STATS_FOR_TODAY = `${API}/entryRecord/GetVehicleStatsForToday`;

export const ALL_CARD = `${API}/RFIDCard/GetAllRFIDCards`;
export const ADD_CARD = `${API}/RFIDCard/CreateRFIDCard`;
export const DELETE_CARD = `${API}/RFIDCard/DeleteRFIDCard`;
export const CARD_BY_UUID = `${API}/RFIDCard/GetRFIDCardByUUID`;

export const COUNT_VEHICLE_ENTRY = `${API}/entryRecord/CountVehicleEntry`;
export const COUNT_VEHICLE_EXIT = `${API}/exitRecord/CountVehicleExitRecord`;
export const COUNT_VEHICLE_NON_EXIT = `${API}/entryRecord/CountVehicleNonExit`;

export const MONEY_BY_DAY = `${API}/visitorHistoryMoney/GetMoneyByDay`;

export const ADD_USER_SHIFT = `${API}/userShift/CreateUserShift`;
export const DELETE_USER_SHIFT = `${API}/userShift/DeleteUserShift`;

export const ALL_USER_SHIFT = `${API}/userShift/GetAllUserShifts`;
export const FILTER_USER_SHIFT = `${API}/userShift/FilterUserShift`;
export const UPDATE_USER_SHIFT = `${API}/userShift/UpdateUserShift`;
export const USER_SHIFT_BY_USER_RANGE_DATE = `${API}/userShift/GetUserShiftsByUserIdAndDateRange`;
export const USER_SHIFT_BY_USER_SHIFT_DATE = `${API}/userShift/GetUserShiftsByUserIdAndShiftIdAndDateTime`;

export const UPLOAD_MEDIA = `${API}/upload/UploadMedia`;
export const LIST_PORT = `${API}/readRFID/ListPort`;

export const READ_RFID_CARD_ENTRY = `${API}/readRFID/ReadRFIDCardEnTry`;
export const READ_RFID_CARD_EXIT = `${API}/readRFID/ReadRFIDCardExit`;
export const SET_UP_SERIAL_PORT_ENTRY = `${API}/readRFID/SetupSerialPortEntry`;
export const SET_UP_SERIAL_PORT_EXIT = `${API}/readRFID/SetupSerialPortExit`;

export const READ_ANOTHER_RFID_CARD_ENTRY = `${API}/readRFID/ReadAnotherRFIDCardEnTry`;
export const READ_ANOTHER_RFID_CARD_EXIT = `${API}/readRFID/ReadAnotherRFIDCardExit`;
export const SET_UP_ANOTHER_SERIAL_PORT_ENTRY = `${API}/readRFID/SetupAnotherSerialPortEntry`;
export const SET_UP_ANOTHER_SERIAL_PORT_EXIT = `${API}/readRFID/SetupAnotherSerialPortExit`;

export const GET_SETTING = `${API}/setting/GetSettings`;
export const UPDATE_SETTING = `${API}/setting/UpdateSetting`;
export const GET_SETTING_BY_ID = `${API}/setting/GetSettingByID`;

export const GET_ALL_LANE = `${API}/lane/GetAllLane`;
export const GET_LANE_BY_ID = `${API}/lane/GetLaneByID`;
export const UPDATE_LANE = `${API}/lane/UpdateLane`;
export const CREATE_LANE = `${API}/lane/CreateLane`;
export const DELETE_LANE = `${API}/lane/DeleteLane`;

export const GET_ALL_CAMERA = `${API}/camera/GetAllCamera`;
export const GET_CAMERA_BY_ID = `${API}/camera/GetCameraByID`;
export const UPDATE_CAMERA = `${API}/camera/UpdateCamera`;
export const CREATE_CAMERA = `${API}/camera/CreateCamera`;
export const DELETE_CAMERA = `${API}/camera/DeleteCamera`;

export const DETECT_LICENSEPLATE = "http://localhost:5000/DetectLicensePlate";

export const GET_ALL_TIMEKEEPING_LOG = `${API}/timeKeepingLog/GetAllTimeKeepingLog`;
export const GET_ALL_TIMEKEEPING_LOG_DELETE = `${API}/timeKeepingLog/GetAllTimeKeepingLogDelete`;

export const GET_TIMEKEEPING_LOG_BY_ID = `${API}/timeKeepingLog/GetTimeKeepingLogByID`;
export const CREATE_TIMEKEEPING_LOG = `${API}/timeKeepingLog/CreateTimeKeepingLog`;
export const UPDATE_TIMEKEEPING_LOG = `${API}/timeKeepingLog/UpdateTimeKeepingLog`;
export const DELETE_TIMEKEEPING_LOG = `${API}/timeKeepingLog/DeleteTimeKeepingLog`;
export const GET_TIMEKEEPING_LOG_FROM_DAY_TO_DAY = `${API}/timeKeepingLog/GetTimeKeepingLogFromDayToDay`;
export const GET_TIMEKEEPING_LOG_TODAY = `${API}/timeKeepingLog/GetTimeKeepingLogToday`;
export const GET_TIMEKEEPING_LOG_PER_MONTH = `${API}/timeKeepingLog/GetTimeKeepingLogPerMonth`;
export const GET_TIMEKEEPING_LOG_PER_YEAR = `${API}/timeKeepingLog/GetTimeKeepingLogPerYear`;

export const GET_ALL_PAYROLL_FORMULA = `${API}/payRollFomula/GetAllPayRollFomula`;
export const GET_PAYROLL_FORMULA_BY_ID = `${API}/payRollFomula/GetPayRollFomulaByID`;
export const UPDATE_PAYROLL_FORMULA = `${API}/payRollFomula/UpdatePayRollFomula`;
export const CREATE_PAYROLL_FORMULA = `${API}/payRollFomula/CreatePayRollFomula`;
export const DELETE_PAYROLL_FORMULA = `${API}/payRollFomula/DeletePayRollFomula`;

export const GET_ALL_PAYROLL = `${API}/payRoll/GetAllPayRolls`;
export const GET_PAYROLL_BY_ID = `${API}/payRoll/GetPayRollByID`;
export const UPDATE_PAYROLL = `${API}/payRoll/UpdatePayRoll`;
export const CREATE_PAYROLL = `${API}/payRoll/CreatePayRoll`;
export const DELETE_PAYROLL = `${API}/payRoll/DeletePayRoll`;
export const GET_PAYROLL_BY_PERIOD = `${API}/payRoll/GetPayRollByPeriod`;
export const GET_PAYROLL_BY_YEAR_AND_USER = `${API}/payRoll/GetPayRollByYearAndUserID`;

export const GET_ALL_TIMEKEEPING = `${API}/timeKeeping/GetAllPayRollFomula`;
export const CREATE_TIMEKEEPING = `${API}/timeKeeping/CreateTimeKeeping`;
export const UPDATE_TIMEKEEPING = `${API}/timeKeeping/UpdateTimeKeeping`;
export const DELETE_TIMEKEEPING = `${API}/timeKeeping/DeleteTimeKeeping`;
export const GET_TIMEKEEPING_BY_USERID_AND_DATE_ARRANGE = `${API}/timeKeeping/GetTimeKeepingByUserIdAndDateRange`;
export const FILTER_TIMEKEEPING = `${API}/timeKeeping/FilterTimeKeeping`;
export const GET_TIMEKEEPING_BY_USERID_AND_SHIFTID = `${API}/timeKeeping/GetTimeKeepingByUserIdAndShiftIdAndDateTime`;

export const ESTIMATE_PARKING_TRANSACTION = `${API}/parkingTransaction/EstimateParkingTransaction`;
export const GET_TOTAL_FEES_FOR_CURRENT_AND_PREVIOUS_MONTH = `${API}/parkingTransaction/GetTotalFeesForCurrentAndPreviousMonth`;
export const GET_TOTAl_FEES_FOR_TODAY = `${API}/parkingTransaction/GetTotalFeesForToday`;

// export const UPDATE_TIMEKEEPING = `${API}/timeKeeping/UpdateTimeKeeping`;
// export const DELETE_TIMEKEEPING = `${API}/timeKeeping/DeleteTimeKeeping`;
// export const GET_TIMEKEEPING_BY_USERID_AND_DATE_ARRANGE = `${API}/timeKeeping/GetTimeKeepingByUserIdAndDateRange`;
// export const FILTER_TIMEKEEPING = `${API}/timeKeeping/FilterTimeKeeping`;
// export const GET_TIMEKEEPING_BY_USERID_AND_SHIFTID = `${API}/timeKeeping/GetTimeKeepingByUserIdAndShiftIdAndDateTime`;
