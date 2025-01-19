import styled from "styled-components";

const MainContent = styled.div`
  display: flex;
  color: white;
  flex-direction: column;
  align-items: center;
  /* justify-content: center; */
  padding: 20px;
  text-align: center;
  background: linear-gradient(34deg, rgba(255, 0, 93, 1) 0%, rgba(0, 212, 255, 1) 100%);
  border-radius: 20px;
  border: 2px solid violet;
  box-shadow: 0 0 10px violet;

  /* Fixed size */
  width: 400px; 
  height: 500px; 

  margin: 0 auto;
  overflow: hidden;

  /* Responsive adjustments */
  @media (max-width: 480px) {
    width: 90%; /* Take up most of the screen width */
    height: auto;
    border-radius: 10px;
    padding: 15px;
  }

  @media (max-width: 480px) {
    width: 100vw; /* Use full screen width */
      height: 100vh; /* Take up full screen height */
      border-radius: 0; /* Remove border radius for seamless layout */
      padding: 0px;
      justify-content: center;
      overflow: hidden;

      h1 {
        font-size: 4rem;
      }
      
      
  }
`;

const ToggleSwitchWrapper = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  margin: 10px 0;

  @media (max-width: 480px) {
    flex-direction: column; /* Stack buttons vertically */
    margin: 5px 0;
  }
`;

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  div {
    display: flex;
    flex-direction: column;
    margin-bottom: 15px;
    width: 100%;
  }

  label {
    margin-bottom: 5px;
    font-weight: bold;
    text-align: left; /* Align labels to the left */
  }

  input {
    outline: none;
    border: 2px solid violet;
    box-shadow: 0 0 10px violet;
    border-radius: 10px;
    padding: 10px 25px;
    background-color: white;
    color: #213547;
    font-size: 16px;
    font-weight: bold;
    font-family: inherit;
    max-width: 100%;
    box-sizing: border-box;

    @media (max-width: 480px) {
      padding: 8px 15px;
    }
  }

  button {
    padding: 10px 20px;
    border: unset;
    border-radius: 15px;
    color: #212121;
    background: #e8e8e8;
    font-weight: 1000;
    font-size: 16px;
    transition: all 250ms;
    position: relative;
    overflow: hidden;
    z-index: 1;

    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: 0;
      border-radius: 15px;
      background-color: rgba(0, 212, 255, 1);
      z-index: -1;
      transition: all 250ms;
    }

    &:hover {
      color: #e8e8e8;
    }

    &:hover::before {
      width: 100%;
    }

    @media (max-width: 480px) {
      font-size: 14px;
      padding: 8px 15px;
    }
  }

  .error-message {
    margin-top: 10px;
    color: #ff4d4d;
    font-size: 14px;
    font-weight: bold;
    text-align: center;

    @media (max-width: 480px) {
      font-size: 12px;
    }
  }
`;

export { MainContent, ToggleSwitchWrapper, FormContainer };
