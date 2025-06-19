import styled from "styled-components";
export const Wrapper = styled.div`
  .fc {
    height: 84vh;
  }

  .fc .fc-daygrid-day.fc-day-today {
    background-color: rgba(71, 194, 216, 0.15);
  }
  .fc-toolbar-title {
    font-size: 25px;
  }

  .fc-button-group button {
    box-shadow: 2px 2px 2px gray;
  }
  tbody td .fc-event {
    overflow: hidden;
    width: 10rem;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  @media only screen and (max-width: 699px) {
    .fc {
      width: 84vw;
      height: 71vh;
    }
    .fc-header-toolbar {
      displex: flex;
      align-items: center;
    }

    .fc-toolbar-chunk {
      display: flex;
    }

    .fc-toolbar-title {
      font-size: 18px;
      position: absolute;
      left: 1rem;
      margin-top: -2rem;
      width: 90%;
      display: flex;
      justify-content: center;
    }
    .fc-button-group button,
    .fc-today-button {
      width: 3rem;
      margin-top: 2rem;
      color: white;
      height: 2rem;
      font-size: 14px;
      display: flex;
      justify-content: center;
    }

    .fc-button-group .fc-prev-button,
    .fc-button-group .fc-next-button {
      width: 2rem;
      height: 2rem;
      font-size: 11px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    tbody td {
      overflow: hidden;
    }
  }
  @media only screen and (min-width: 700px) and (max-width: 1024px) {
    tbody td .fc-event {
      overflow: hidden;
      width: 5rem;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
`;
