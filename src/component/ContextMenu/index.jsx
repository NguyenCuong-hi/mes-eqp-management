import React, { useState, useEffect, useRef } from 'react';
import { Dropdown, Menu } from 'antd';

const ContextMenuWrapper = ({ children, menuItems = [], onMenuClick }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);
  const containerRef = useRef(null);

  const handleRightClick = (e) => {
    e.preventDefault();

    const newPos = { x: e.clientX, y: e.clientY };

    // Nếu bấm chuột phải tại đúng vị trí cũ, ẩn menu
    if (visible && position.x === newPos.x && position.y === newPos.y) {
      setVisible(false);
    } else {
      setPosition(newPos);
      setVisible(true);
    }
  };

  const handleMenuClick = (info) => {
    onMenuClick?.(info);
    setVisible(false);
  };

//   const handleClickOutside = (e) => {
//     if (containerRef.current && !containerRef.current.contains(e.target)) {
//       setVisible(false);
//     }
//   };

//   useEffect(() => {
//     if (visible) {
//       document.addEventListener('mousedown', handleClickOutside);
//     } else {
//       document.removeEventListener('mousedown', handleClickOutside);
//     }

//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, [visible]);

  const menu = (
    <Menu onClick={handleMenuClick}>
      {menuItems.map((item) => (
        <Menu.Item key={item.key} icon={item.icon}>
          {item.label}
        </Menu.Item>
      ))}
    </Menu>
  );

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%' }} onContextMenu={handleRightClick}>
      {children}

      {visible && (
        <div
          style={{
            position: 'fixed',
            top: position.y,
            left: position.x,
            zIndex: 1000
          }}
        >
          <Dropdown overlay={menu} open>
            <div />
          </Dropdown>
        </div>
      )}
    </div>
  );
};

export default ContextMenuWrapper;
