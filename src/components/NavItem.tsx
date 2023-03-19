import { Link, useLocation } from 'react-router-dom';
import { Menu } from 'semantic-ui-react';

interface NavItemProps {
  name: any;
  to: string;
}

const NavItem = ({ name, to }: NavItemProps) => {
  const { pathname } = useLocation();
  return (
    <Menu.Item as={Link} to={to} active={pathname === to}>
      {name}
    </Menu.Item>
  );
};

export default NavItem;
