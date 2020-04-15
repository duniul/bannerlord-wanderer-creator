import React from 'react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
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
  padding: 0 24px;
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
  ROOT: '/',
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
            <Menu text>
              <MenuRouterItem name="Wanderers" to={PATHS.WANDERERS} />
              <MenuRouterItem name="FAQ" to={PATHS.FAQ} />
              <Menu.Item href="https://github.com/duniul/butterlord-tools" target="_blank" rel="noopener noreferrer">
                <Icon name="github" />
              </Menu.Item>
            </Menu>
          </AppHeader>

          <Switch>
            <Route exact path={PATHS.FAQ}>
              <FaqPage />
            </Route>
            <Route path={PATHS.WANDERERS}>
              <WandererPage />
            </Route>
            <Redirect to={PATHS.WANDERERS} />
          </Switch>
        </ModOptionsProvider>
      </BrowserRouter>
    </AppWrapper>
  );
};

export default App;
