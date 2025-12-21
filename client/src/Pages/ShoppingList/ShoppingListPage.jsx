import React from "react";
import Header from "../../Components/Main/Header/Header.jsx";
import Footer from "../../Components/Main/Footer/Footer.jsx";
import ShoppingListMain from "../../Components/ShoppingList/ShoppingListMain.jsx";

const ShoppingListPage = () => {
  return (
    <div 
      style={{ 
        minHeight: "100vh", 
        display: "flex", 
        flexDirection: "column", 
        background: "#ffffff",
        /* ВАЖНО: Эти свойства заставляют блок растянуться */
        width: "100%", 
        maxWidth: "100%",
        boxSizing: "border-box" 
      }}
    >
      <Header />
      
      {/* Используем display: block, чтобы этот контейнер занимал всю ширину 
         и не сжимался, даже если внутри мало контента.
      */}
      <div style={{ flex: 1, width: "100%", display: "block" }}>
        <ShoppingListMain />
      </div>
      
      <Footer />
    </div>
  );
};

export default ShoppingListPage;