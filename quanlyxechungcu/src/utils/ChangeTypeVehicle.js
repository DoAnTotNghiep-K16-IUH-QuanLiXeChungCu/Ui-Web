export const changeTypeVehicle = (type) => {
  if (typeof type === "string") {
    if (type === "car") return "Ô tô";
    else if (type === "motor") return "Xe máy";
  }
  return type;
};
