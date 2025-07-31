export const configKeyboard = (refInput, btnValue) => {
  switch (true) {
    case btnValue.value >= 0 && btnValue.value <= 9:
      let cursorBeforeChange = refInput.current.selectionStart;

      if (refInput.current.value.length == refInput.current.selectionStart)
        refInput.current.value += btnValue.value;
      else {
        const newValue = [...refInput.current.value].map((digit, index) => {
          if (index == refInput.current.selectionStart)
            return btnValue.value + digit;
          return digit;
        });

        refInput.current.value = newValue.join("");
        positionCursor("backward", cursorBeforeChange + 1, refInput);
      }

      break;
    case btnValue.value == "clean":
      refInput.current.value = "";
      break;
    case btnValue.value == "next":
      if (refInput.current.value.length > 0) {
        positionCursor(
          "forward",
          refInput.current.selectionStart + 1,
          refInput
        );
      }
      break;
    case btnValue.value == "back":
      if (refInput.current.value.length > 0) {
        positionCursor(
          "backward",
          refInput.current.selectionStart - 1,
          refInput
        );
      }
      break;
    case btnValue.value == "delete":
      if (refInput.current.value.length > 0) {
        let cursorBeforeChange = refInput.current.selectionStart;
        let valueBeforeChange = refInput.current.value;

        let digitToDelete = Array.from(refInput.current.value)[
          refInput.current.selectionStart - 1
        ];

        refInput.current.value = refInput.current.value.replace(
          digitToDelete,
          ""
        );

        if (cursorBeforeChange != valueBeforeChange.length) {
          positionCursor("backward", cursorBeforeChange - 1, refInput);
        }
      }
      break;
  }
};

const positionCursor = (direction, position, refInput) => {
  refInput.current.setSelectionRange(position, position, direction);
};
