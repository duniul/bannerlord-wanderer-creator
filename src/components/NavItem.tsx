import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu } from 'semantic-ui-react';

interface NavItem {
  name: any;
  to: string;
}

const NavItem = ({ name, to }: NavItem) => {
  const { pathname } = useLocation();
  return <Menu.Item as={Link} to={to} active={pathname === to}>{name}</Menu.Item>;
};

export default NavItem;
