export const validationsCases = (
  nameInput,
  value,
  valueDatetimeTask,
  setFilesSizeExceeded
) => {
  let msj, validInput;
  let validIcon = /\w/;

  switch (nameInput) {
    case "datetimeTask":
      msj = "Date is not higher than date now";
      validInput = value.length > 0 && new Date(value).getTime() > Date.now();
      break;
    case "datetimeNotification":
      msj = "Date should be less than datetime task and current datetime ";
      validInput =
        value.length > 0 &&
        new Date(value).getTime() <= new Date(valueDatetimeTask).getTime() &&
        new Date(value).getTime() > Date.now();
      break;
    case "descriptionTask":
      msj = "Complete correctly description field";
      validInput = value.length > 0 && value.length <= 130;
      break;
    case "icon":
      msj = "Invalid icon";
      validInput = !value.match(validIcon) && value.length !== 0;
      break;
    case "filesUploaded":
      msj = "Limit size exceeded";
      let totalSizes = Array.from(value).reduce((ac, file) => {
        return (ac += file.size);
      }, 0);
      //1000*10000=>10millions of bytes=>10MB
      validInput = totalSizes <= 1000 * 10000;
      if (!validInput) setFilesSizeExceeded(true);
      else setFilesSizeExceeded(false);

      break;
  }

  return { msj: msj, validInput: validInput };
};
