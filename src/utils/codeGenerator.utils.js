import crypto from "crypto";

export const generateReservationCode = () => {
  const randomPart = crypto.randomBytes(2).toString("hex").toUpperCase();
  return `EVT-${randomPart}`;
};
