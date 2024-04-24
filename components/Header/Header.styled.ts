import styled from 'styled-components'

export const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: calc(100% - 48px);
  height: 136px;
  padding: 10px 24px;
`

export const HeaderElement = styled.div`
  display: flex;
  padding: 16px 40px;
  align-items: flex-start;

  align-self: stretch;
  border-radius: 90px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  background: rgba(255, 255, 255, 0.5);
  box-shadow: 0px 0px 36px 0px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(15px);
`
