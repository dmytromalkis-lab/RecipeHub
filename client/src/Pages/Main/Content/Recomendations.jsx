import React from 'react';
import './Recomendations.css';
import borzh from '../../../assets/borscht.jfif';
import burger from '../../../assets/burger.jfif';
import pizza from '../../../assets/pizza.jfif';
import salad from '../../../assets/salad.jfif';

const items = [
  { id: 1, title: 'Borscht', image: borzh },
  { id: 2, title: 'Burger', image: burger },
  { id: 3, title: 'Pizza', image: pizza },
  { id: 4, title: 'Salad', image: salad },
];

export default function Recomendations() {
  return (
    <section className="recs">
      <h3 className="recs-title">Popular keywords</h3>
      <div className="recs-list">
        {items.map((it) => (
          <div className="rec-card" key={it.id}>
            <div className="rec-thumb" style={{ backgroundImage: `url(${it.image})` }} />
            <div className="rec-caption">{it.title}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
