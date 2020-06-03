export default {
  getAsYouType: () => {
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
  }
}
