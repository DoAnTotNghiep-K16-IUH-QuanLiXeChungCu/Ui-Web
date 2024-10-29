import { getAllApartment } from "../useAPI/useApartmentAPI";
import { getAllCard } from "../useAPI/useCardAPI";
import { getAllParkingRate } from "../useAPI/useParkingRateAPI";
import { getAllVehicle } from "../useAPI/useVehicleAPI";
import { filterCustomer, findCustomerByID } from "../useAPI/useCustomerAPI";
import { filterMonthlyTicket } from "../useAPI/useMonthlyTicketAPI";
import {
  filterRecord,
  getALLEntryRecord,
  getALLExitRecord,
} from "../useAPI/useRecordAPI";
import { getAllParkingSlot } from "../useAPI/useParkingSlotAPI";
import { getAllShift } from "../useAPI/useShiftAPI";
import { getAllUser } from "../useAPI/useUserAPI";
import { saveData } from "../context/indexedDB";
import { getAllUserShift } from "./useUserShiftAPI";
import { getAllSetting } from "./useSettingAPI";
export const fetchDataFromAPI = async (
  setProfile,
  setApartments,
  setCustomers,
  setTickets,
  setRecords,
  setParkingSlots,
  setCards,
  setUsers,
  setVehicles,
  setUserShifts,
  setShifts,
  setFees,
  setEntryRecords,
  setExitRecords,
  profile,
  setSetting
) => {
  console.log("fetchDataFromAPI");
  try {
    const apartments = await getAllApartment();
    setApartments(apartments || []);
    const cards = await getAllCard();
    setCards(cards || []);
    const fees = await getAllParkingRate();
    setFees(fees || []);
    const c = await getAllVehicle(1, 1000);
    const vehicles = c.vehicles;
    const vehicleDetail = await Promise.all(
      vehicles.map(async (vehicle) => {
        const customer = await findCustomerByID(vehicle.customerId._id);
        return {
          ...vehicle,
          customerId: customer,
        };
      })
    );
    setVehicles(vehicleDetail || []);
    const customers = await filterCustomer("", "", 1, 10000);
    setCustomers(customers);
    const tickets = await filterMonthlyTicket("", " ", " ", " ", " ", 1, 10000);
    setTickets(tickets);
    const records = await filterRecord(" ", " ", " ", " ", 1, 10000);
    setRecords(records);
    const parkingSlots = await getAllParkingSlot();
    setParkingSlots(parkingSlots || []);
    const shifts = await getAllShift();
    setShifts(shifts);
    const users = await getAllUser();
    setUsers(users);
    const entryRecords = await getALLEntryRecord();
    setEntryRecords(entryRecords);
    const exitRecords = await getALLExitRecord();
    setExitRecords(exitRecords);
    const userShifts = await getAllUserShift();
    setUserShifts(userShifts);
    const settings = await getAllSetting();
    setSetting(settings);
    await saveData({
      id: "userData",
      apartments,
      customers,
      tickets,
      records,
      parkingSlots,
      cards,
      users,
      vehicles,
      shifts,
      fees,
      profile,
      entryRecords,
      exitRecords,
      userShifts,
      settings,
    });
  } catch (error) {
    console.error("Failed to fetch data from API:", error);
  }
};
const syncDataFromAPI = async () => {
  try {
    await fetchDataFromAPI(); // Fetch dữ liệu mới từ API và tự động lưu vào IndexedDB
    console.log("Data synchronized successfully");
  } catch (error) {
    console.error("Error syncing data:", error);
  }
};

// Đồng bộ dữ liệu mỗi 15 phút (900000ms)
setInterval(syncDataFromAPI, 900000);
