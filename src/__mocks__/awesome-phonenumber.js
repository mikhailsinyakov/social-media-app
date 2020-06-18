class PhoneNumber {
  constructor(number) {
    this.number = number;
  }
  
  getNumber(type) {
    if (type === "international") {
      const n = this.number;
      return `${n.slice(0,2)} ${n.slice(2,5)} ${n.slice(5,8)}-${n.slice(8,10)}-${n.slice(10)}}`;
    }
  }
}

PhoneNumber.getAsYouType = () => {
  let num = "";
  
  return {
    addChar: char => {
      num += char;
    },
    number: () => num,
    getPhoneNumber: () => ({
      isValid: () => num.length === 12,
      getNumber: () => num
    })
  };
};

export default PhoneNumber;
