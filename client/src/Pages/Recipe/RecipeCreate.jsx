import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../Components/Main/Header/Header.jsx';
import Footer from '../../Components/Main/Footer/Footer.jsx';
import BackButton from '../../Components/Profile/ProfileMain/BackButton.jsx';
import RecipeMain from '../../Components/Recipe/RecipeMain.jsx';
import SubmitButton from '../../Components/Recipe/SubmitButton.jsx';
import './RecipeCreate.css';

export default function RecipeCreate() {
  const navigate = useNavigate();
  return (
    <div className="recipe-create-page">
      <Header />
      <div className="recipe-grid">
        <BackButton onClick={() => navigate('/profile')} />
        <main className="recipe-create-main">
          <div className="rc-wrapper">
            <RecipeMain />

            <div className="recipe-submit">
              <SubmitButton />
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
