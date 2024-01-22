import React, { useState } from 'react';

const ThemeSwitch = ({ onToggle }) => {
  const [isChecked, setChecked] = useState(false);

  const handleToggle = () => {
    setChecked(!isChecked);
    onToggle(!isChecked);
  };

  return (
    <label className="theme-switch">
      <input type="checkbox" checked={isChecked} onChange={handleToggle} />
      <span className="switch"></span>
    </label>
  );
};

export default ThemeSwitch;