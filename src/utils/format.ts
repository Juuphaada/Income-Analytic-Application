export const fmt = (n: number, d = 2) => {
  const [int, dec] = (Math.floor(n * 100)/ 100).toString().split(".")
  const withCommas = int.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  return (n < 0 ? "-" : "") + withCommas + (dec ? "." + dec : "")
}

export const mediumAbbrevFormat = (n : number) => {
    let displayedNumber : string;

    if(Math.abs(n) < 1e+5){
    	//display number in full form
      displayedNumber = (Math.floor(n * 100)/ 100).toString();
    }else if(Math.abs(n) < 1e+6){
    	//display number in Abbreviations K form
      displayedNumber = (Math.floor(n/1e+3 * 100)/ 100).toString() + "K";
    }else if(Math.abs(n) < 1e+9){
    	//display number in Abbreviations M form
      displayedNumber = (Math.floor(n/1e+6 * 100)/ 100).toString() + "M";
    }else if(Math.abs(n) < 1e+12){
    	//display number in Abbreviations B form
      displayedNumber = (Math.floor(n/1e+9 * 100)/ 100).toString() + "B";
    }else if(Math.abs(n) >= 1e+12){
    	//display number in Abbreviations T form
      displayedNumber = (Math.floor(n/1e+12 * 100)/ 100).toString() + "T";
    }else{
      displayedNumber = (Math.floor(n * 100)/ 100).toString();
    }
    
    const [int, dec] = displayedNumber.split(".");
    const withCommas = int.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    return (n < 0 ? "-" : "") + withCommas + (dec ? "." + dec : "")
}

export const compactAbbrevFormat = (n : number) => {
    let displayedNumber : string;

    if(Math.abs(n) < 1e+3){
    	//display number in full form
      displayedNumber = (Math.floor(n * 100)/ 100).toString();
    }else if(Math.abs(n) < 1e+6){
    	//display number in Abbreviations K form
      displayedNumber = (Math.floor(n/1e+3 * 100)/ 100).toString() + "K";
    }else if(Math.abs(n) < 1e+9){
    	//display number in Abbreviations M form
      displayedNumber = (Math.floor(n/1e+6 * 100)/ 100).toString() + "M";
    }else if(Math.abs(n) < 1e+12){
    	//display number in Abbreviations B form
      displayedNumber = (Math.floor(n/1e+9 * 100)/ 100).toString() + "B";
    }else if(Math.abs(n) >= 1e+12){
    	//display number in Abbreviations T form
      displayedNumber = (Math.floor(n/1e+12 * 100)/ 100).toString() + "T";
    }else{
      displayedNumber = (Math.floor(n * 100)/ 100).toString();
    }
    
    const [int, dec] = displayedNumber.split(".");
    const withCommas = int.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    return (n < 0 ? "-" : "") + withCommas + (dec ? "." + dec : "")
}

export const slackenAbbrevFormat = (n : number) => {
    let displayedNumber : string;

    if(Math.abs(n) < 1e+9){
      displayedNumber = (Math.floor(n * 100)/ 100).toString();
    }else if(Math.abs(n) < 1e+12){
    	//display number in Abbreviations B form
      displayedNumber = (Math.floor(n/1e+9 * 100)/ 100).toString() + "B";
    }else if(Math.abs(n) >= 1e+12){
    	//display number in Abbreviations T form
      displayedNumber = (Math.floor(n/1e+12 * 100)/ 100).toString() + "T";
    }else{
      displayedNumber = (Math.floor(n * 100)/ 100).toString();
    }
    
    const [int, dec] = displayedNumber.split(".");
    const withCommas = int.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    return (n < 0 ? "-" : "") + withCommas + (dec ? "." + dec : "")
}