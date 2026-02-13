import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const menu = [
    { name: '홈', path: '/' },
    { name: '정보', path: '/info' },
    { name: '추천', path: '/recommend' },
    { name: '커뮤니티', path: '/community' },
    { name: '프로필', path: '/profile' },
  ];

  return (
    <div
      style={{
        width: '80px',
        backgroundColor: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        paddingTop: '40px',
        gap: '40px',
      }}
    >
      {menu.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          style={({ isActive }) => ({
            display: 'block',
            width: '100%',   
            padding: '12px 12px 12px 12px',
            color: isActive ? 'orange' : 'black',
            textDecoration: 'none',
            fontWeight: isActive ? 'bold' : 'normal',
            textAlign: 'center',  
            fontSize: '13px',   
          })}
        >
          {item.name}
        </NavLink>
      ))}
    </div>
  );
};

export default Sidebar;
