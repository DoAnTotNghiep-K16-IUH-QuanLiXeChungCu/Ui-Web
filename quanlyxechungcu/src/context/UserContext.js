import React, { createContext, useState, useEffect } from "react";
export const UserContext = createContext();
export const UserProvider = ({ children }) => {
  const [profile, setProfile] = useState({});

  // const [customers, setCustomers] = useState([]);
  // const [tickets, setTickets] = useState([]);
  // const [records, setRecords] = useState([]);
  // const [parkingSlots, setParkingSlots] = useState([]);
  // const [cards, setCards] = useState([]);
  // const [users, setUsers] = useState([]);
  // const [vehicles, setVehicles] = useState([]);
  // const [userShifts, setUserShifts] = useState([]);
  // const [shifts, setShifts] = useState([]);
  // const [fees, setFees] = useState([]);
  // const [entryRecords, setEntryRecords] = useState([]);
  // const [exitRecords, setExitRecords] = useState([]);
  // const [setting, setSetting] = useState([]);

  // const [isLoading, setIsLoading] = useState(true); // Trạng thái loading

  // useEffect(() => {
  //   let isMounted = true;
  //   const loadFromIndexedDB = async () => {
  //     try {
  //       const data = await getAllData();
  //       if (isMounted && data.length > 0) {
  //         const userData = data.find((d) => d.id === "userData");
  //         if (userData) {
  //           setCustomers(userData.customers || []);
  //           setTickets(userData.tickets || []);
  //           setRecords(userData.records || []);
  //           setProfile(userData.profile || {});
  //           setParkingSlots(userData.parkingSlots || []);
  //           setCards(userData.cards || []);
  //           setUsers(userData.users || []);
  //           setVehicles(userData.vehicles || []);
  //           setUserShifts(userData.userShifts || []);
  //           setShifts(userData.shifts || []);
  //           setFees(userData.fees || []);
  //           setEntryRecords(userData.entryRecords || []);
  //           setExitRecords(userData.exitRecords || []);
  //           setSetting(userData.setting || []);
  //         }
  //       }
  //     } catch (error) {
  //       console.error("Failed to load data from IndexedDB:", error);
  //     } finally {
  //       if (isMounted) setIsLoading(false); // Dừng trạng thái loading khi dữ liệu đã load xong
  //     }
  //   };
  //   loadFromIndexedDB();

  //   return () => {
  //     isMounted = false; // Khi unmount, ngăn không cho set state
  //   };
  // }, []);

  // if (isLoading) {
  //   // Hiển thị khi dữ liệu đang được load
  //   return <Loading />;
  // }

  return (
    <UserContext.Provider
      value={{
        profile,
        setProfile,
        // parkingSlots,
        // setParkingSlots,
        // cards,
        // setCards,
        // users,
        // setUsers,
        // vehicles,
        // setVehicles,
        // userShifts,
        // setUserShifts,
        // shifts,
        // setShifts,
        // fees,
        // setFees,
        // entryRecords,
        // setEntryRecords,
        // exitRecords,
        // setExitRecords,
        // setting,
        // setSetting,
        // customers,
        // setCustomers,
        // tickets,
        // setTickets,
        // records,
        // setRecords,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
