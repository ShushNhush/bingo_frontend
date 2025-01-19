import styled from "styled-components";

export const Page = styled.div`
  display: grid;
  width: 100vw;
  height: 100vh;

  
    grid-template-columns: repeat(3, 1fr);
  

  ${({ isChat }) =>
    isChat &&
    `
      @media (min-width: 900px) and (max-width: 1346px) {
        justify-content: center;
        grid-template-columns: 2fr 1fr;
      }
    `}
`;

export const MainContainer = styled.div`
  align-self: center;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  background: linear-gradient(34deg, rgba(255, 0, 93, 1) 0%, rgba(0, 212, 255, 1) 100%);
  border-radius: 20px;
  border: 2px solid violet;
  box-shadow: 0 0 10px violet;
  width: 90vw;
  max-width: 600px;
  margin: 0 auto;
  height: auto;
  min-height: 70vh;
  padding: 20px;
  box-sizing: border-box;
  overflow: hidden;

  grid-column: 2 / 3;

  ${({isChat}) => isChat && `
    
  
  @media (min-width: 1024px) {
    grid-column: 2 / 3;
  }

  @media (min-width: 900px) and (max-width: 1346px) {
    grid-column: 1 / 2;
    
  }
`}
 

  @media (max-width: 480px) {
    width: 100vw;
    height: 100vh;
    border-radius: 0;
    padding: 15px;
    min-height: 100vh;
  }
`;

export const VideoBackground = styled.video`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  object-fit: cover;
  z-index: -1;

  @media (max-width: 480px) {
    display: none;
  }
`;

export const ButtonContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-evenly;
`;

export const PullButton = styled.button`
  position: relative;
  font-size: 17px;
  text-transform: uppercase;
  text-decoration: none;
  padding: 0.7em 1.5em;
  display: inline-block;
  cursor: pointer;
  border-radius: 6em;
  transition: all 0.2s;
  border: none;
  font-family: inherit;
  font-weight: bold;
  color: rgba(255, 0, 93, 1);
  background-color: white;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: translateY(-1px);
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
  }
`;

export const SubmitButton = styled.button`
  text-transform: uppercase;
  text-decoration: none;
  position: relative;
  border: none;
  font-family: inherit;
  font-size: 17px;
  font-weight: bold;
  cursor: pointer;
  color: #fff;
  width: 9em;
  height: 3em;
  line-height: 2em;
  text-align: center;
  background: linear-gradient(90deg, #03a9f4, #f441a5, #ffeb3b, #03a9f4);
  background-size: 300%;
  border-radius: 30px;
  z-index: 1;

  &:hover {
    animation: ani 8s linear infinite;
    border: none;
  }

  &:before {
    content: "";
    position: absolute;
    top: -5px;
    left: -5px;
    right: -5px;
    bottom: -5px;
    z-index: -1;
    background: linear-gradient(90deg, #03a9f4, #f441a5, #ffeb3b, #03a9f4);
    background-size: 400%;
    border-radius: 35px;
    transition: 1s;
  }

  &:hover:before {
    filter: blur(20px);
  }

  &:active {
    background: linear-gradient(32deg, #03a9f4, #f441a5, #ffeb3b, #03a9f4);
  }
`;

export const HomeButton = styled.button`
  position: absolute;
  top: 10px;
  left: 10px;
  background: transparent;
  border: none;
  cursor: pointer;
  z-index: 10;
  padding: 5px;

  svg {
    width: 30px;
    height: 30px;
    color: white;
    transition: transform 0.2s ease;

    &:hover {
      transform: scale(1.2);
      color: #f0f0f0;
    }
  }
`;


export const ChatButton = styled.button`
  position: absolute;
  bottom: 10px;
  right: 10px;
  background: transparent;
  border: none;
  cursor: pointer;
  z-index: 10;
  padding: 5px;

  svg {
    width: 30px;
    height: 30px;
    color: white;
    transition: transform 0.2s ease;

    &:hover {
      transform: scale(1.2);
      color: #f0f0f0;
    }
  }

  @media (max-width: 899px) {
    display: none;
  }
`;