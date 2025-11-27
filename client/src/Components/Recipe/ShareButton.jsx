import React, { useState, useEffect, useRef } from "react";
import { Share2, Link as LinkIcon, Facebook, Twitter, Check } from "lucide-react";
import "./ShareButton.css";

export default function ShareButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const menuRef = useRef(null);

  // Закрываем меню при клике вне его области
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);

  // Логика копирования ссылки
  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopied(true);
    
    // Возвращаем иконку обратно через 2 секунды
    setTimeout(() => setCopied(false), 2000);
  };

  // Логика шеринга
  const shareToSocial = (platform) => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent("Check out this recipe!");
    let shareUrl = "";

    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
        break;
      default:
        return;
    }
    
    window.open(shareUrl, "_blank", "width=600,height=500");
    setIsOpen(false);
  };

  return (
    <div className="share-container" ref={menuRef}>
      {/* Сама кнопка Share */}
      <button className="share-btn" onClick={toggleMenu} title="Share Recipe">
        <Share2 size={18} />
        <span>Share Recipe</span>
      </button>

      {/* Выпадающее меню */}
      {isOpen && (
        <div className="share-menu">
          <button className="share-item" onClick={handleCopyLink}>
            {copied ? <Check size={18} color="#4caf50" /> : <LinkIcon size={18} />}
            <span>{copied ? "Copied!" : "Copy link"}</span>
          </button>
          
          <button className="share-item" onClick={() => shareToSocial("twitter")}>
            <Twitter size={18} color="#1DA1F2" />
            <span>Twitter</span>
          </button>

          <button className="share-item" onClick={() => shareToSocial("facebook")}>
            <Facebook size={18} color="#1877F2" />
            <span>Facebook</span>
          </button>
        </div>
      )}
    </div>
  );
}