// mascara de cartao, ocultar os primeiros numeros
 export const maskCardNumber = (cardNumber: string): string => {
  const cleanNumber = cardNumber.replace(/\s/g, '');
  if (cleanNumber.length >= 4) {
    const lastFour = cleanNumber.slice(-4);
    const maskedPart = '*'.repeat(cleanNumber.length - 4);
    return `${maskedPart}${lastFour}`;
  }
  return cleanNumber;
};
