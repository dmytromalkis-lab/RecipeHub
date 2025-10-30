import React from 'react';
import './LogoContent.css';
import Logo from '../../../assets/Logo.svg';
import HeaderTitle from '../../../Components/Main/Header/HeaderText.jsx';

export default function LogoContent() {
  return (
    <div className="logo-content">
      <div className="logo-row">
        <img src={Logo} alt="RecipeHub logo" className="logo-img" />
        <HeaderTitle>RecipeHub</HeaderTitle>
      </div>
    </div>
  );
}
