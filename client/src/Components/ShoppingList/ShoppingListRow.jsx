import React from "react";
import { Trash2, Check } from "lucide-react";

export default function ShoppingListRow({ item, onCheck, onDelete }) {
  return (
    <div className={`sl-row ${item.checked ? "sl-row-purchased" : ""}`}>
      {/* Название */}
      <div className="sl-input-wrapper sl-row-name">
        <input 
          className="sl-input-read" 
          value={item.name} 
          readOnly 
          title={item.name}
        />
      </div>

      {/* Количество (Теперь просто текст, без кнопок) */}
      <div className="sl-input-wrapper sl-row-qty" style={{ justifyContent: "center" }}>
        <span className="sl-qty-val">{item.quantity}</span>
      </div>

      {/* Единица измерения */}
      <div className="sl-input-wrapper sl-row-unit">
        <input 
          className="sl-input-read" 
          value={item.unit} 
          readOnly 
          style={{ textAlign: "center" }}
        />
      </div>

      {/* Чекбокс (Работает) */}
      <div 
        className={`sl-checkbox-wrapper ${item.checked ? "checked" : ""}`}
        onClick={() => onCheck(item.id)}
      >
        <div className="sl-check-box">
          {item.checked && <Check size={16} color="#fff" strokeWidth={3} />}
        </div>
      </div>

      {/* Удалить (Работает) */}
      <button className="sl-delete-btn" onClick={() => onDelete(item.id)}>
        <Trash2 size={18} />
      </button>
    </div>
  );
}