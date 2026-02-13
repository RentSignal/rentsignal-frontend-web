import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Map from '../components/Map';

const MainLayout = () => {
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      
      {/* 60px 사이드바 */}
      <Sidebar />

      {/* 377px 고정 패널 */}
      <div
        style={{
          width: '377px',
          backgroundColor: '#F5F5F5',
          padding: '24px',
          boxSizing: 'border-box',
        }}
      >
        <Outlet />
      </div>

      {/* 지도 영역 */}
      <div
        style={{
          flex: 1,
          position: 'relative',
          width: '100%',
          height: '100%', 
        }}
      >
        <Map />
      </div>

    </div>
  );
};

export default MainLayout;
