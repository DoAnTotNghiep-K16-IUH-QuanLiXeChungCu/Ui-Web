import { getAllApartment } from "../useAPI/useApartmentAPI";
import { getAllCard } from "../useAPI/useCardAPI";
import { getAllParkingRate } from "../useAPI/useParkingRateAPI";
import { getAllVehicle } from "../useAPI/useVehicleAPI";
import { filterCustomer, findCustomerByID } from "../useAPI/useCustomerAPI";
import { filterMonthlyTicket } from "../useAPI/useMonthlyTicketAPI";
import { filterRecord } from "../useAPI/useRecordAPI";
import { getAllParkingSlot } from "../useAPI/useParkingSlotAPI";
import { getAllShift } from "../useAPI/useShiftAPI";
import { getAllUser } from "../useAPI/useUserAPI";
import { saveData } from "../context/indexedDB";
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
  profile
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
    });
  } catch (error) {
    console.error("Failed to fetch data from API:", error);
  }
};
