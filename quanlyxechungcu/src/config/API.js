export const API = "http://localhost:3001/api/v1";

export const LOGIN = `${API}/users/login`;
export const SIGNUP = `${API}/users/sinup`;
export const UPDATE_USER = `${API}/users/UpdateUser`;
export const ALL_USER = `${API}/users/GetAllUsers`;

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

export const ALL_ENTRY_RECORD = `${API}/entryRecord/GetAllEntryRecords`;
export const ALL_EXIT_RECORD = `${API}/exitRecord/GetAllExitRecords`;
export const EXIT_RECORD_BY_ENTRY_RECORD_ID = `${API}/exitRecord/GetExitRecordByEntryRecordId`;
export const FILTER_RECORD = `${API}/entryRecord/FilterEntryRecords`;
export const CREATE_ENTRY_RECORD = `${API}/entryRecord/CreateEntryRecord`;

// export const ALL_RECORD = `${API}/exitRecord/GetAllExitRecords`;

export const ALL_CARD = `${API}/RFIDCard/GetAllRFIDCards`;
export const ADD_CARD = `${API}/RFIDCard/CreateRFIDCard`;
export const DELETE_CARD = `${API}/RFIDCard/DeleteRFIDCard`;

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

export const UPLOAD_MEDIA = `${API}/upload/UploadMedia`;
export const LIST_PORT = `${API}/readRFID/ListPort`;

export const READ_RFID_CARD_ENTRY = `${API}/readRFID/ReadRFIDCardEnTry`;
export const READ_RFID_CARD_EXIT = `${API}/readRFID/ReadRFIDCardExit`;
export const SET_UP_SERIAL_PORT_ENTRY = `${API}/readRFID/SetupSerialPortEntry`;
export const SET_UP_SERIAL_PORT_EXIT = `${API}/readRFID/SetupSerialPortExit`;

export const GET_SETTING = `${API}/setting/GetSetting`;
export const UPDATE_SETTING = `${API}/setting/UpdateSetting`;
