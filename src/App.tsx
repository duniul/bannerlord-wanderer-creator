import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Icon, Menu } from 'semantic-ui-react';
import styled, { createGlobalStyle } from 'styled-components';
import FaqPage from './components/FaqPage';
import MenuRouterItem from './components/NavItem';
import WandererPage from './components/WandererPage';
import { ModOptionsProvider } from './contexts/ModOptionsContext';

const GlobalStyle = createGlobalStyle`
  body {
    height: unset;
  }
`;

const AppWrapper = styled.div`
  margin: 0 auto;
  min-width: 580px;
  max-width: 1200px;
  margin-top: 60px;
  padding: 0 24px 24px;
`;

const AppHeader = styled.header`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  margin-bottom: 64px;

  & > h1 {
    font-size: 4.5rem !important;
  }

  & > * {
    margin: 0 !important;
  }
`;

const PATHS = {
  WANDERERS: '/wanderers',
  FAQ: '/wanderers/faq',
};

const App = () => {
  return (
    <AppWrapper>
      <BrowserRouter>
        <GlobalStyle />
        <ModOptionsProvider>
          <AppHeader>
            <h1>Bannerlord Wanderer Creator</h1>
            <Menu size="massive" text>
              <MenuRouterItem name="Wanderers" to={PATHS.WANDERERS} />
              <MenuRouterItem name="FAQ" to={PATHS.FAQ} />
              <Menu.Item href="https://www.nexusmods.com/mountandblade2bannerlord/mods/691" target="_blank" rel="noopener noreferrer">
                Example mod
              </Menu.Item>
              <Menu.Item href="https://github.com/duniul/butterlord-tools" target="_blank" rel="noopener noreferrer">
                <Icon name="github" /> Github
              </Menu.Item>
            </Menu>
          </AppHeader>

          <Routes>
            <Route path={PATHS.WANDERERS + '/*'} element={<WandererPage />} />
            <Route path={PATHS.FAQ} element={<FaqPage />} />
          </Routes>
        </ModOptionsProvider>
      </BrowserRouter>
    </AppWrapper>
  );
};

export default App;
