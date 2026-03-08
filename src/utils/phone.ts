export const sanitizePhoneNumber = (value: string) => {
  return value.replace(/[^0-9]/g, "");
};

export const validatePhoneNumber = (phone: string) => {
  const phoneRegex = /^01[016789][0-9]{7,8}$/;
  return phoneRegex.test(phone);
};

export const formatPhone = (phone: string) => {
  if (phone.length === 11) {
    return phone.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
  }
  return phone;
};
