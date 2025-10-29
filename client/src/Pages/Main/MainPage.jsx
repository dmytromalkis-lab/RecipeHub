import './MainPage.css';
import RecipeComponent from './Filler/RecipeComponent.jsx';
import sampleImg from '../../assets/Logo.svg';

const SAMPLE = [
	{
		recipe_id: 1,
		title: 'Швидка вечеря',
		image_url: sampleImg,
		ingredients: ['Фарш','Паста','Вода','Сіль','Цибуля','Часник','Помідори','Олія','Перець','Базилік'],
		prep_time: 25,
		serving: '3-4 порції',
		author: { user_id: 2, first_name: 'Михайло', last_name: 'Михалов', avatar: sampleImg },
	},
	{
		recipe_id: 2,
		title: 'Тестовий борщ',
		image_url: sampleImg,
		ingredients: ['Буряк','Картопля','Морква'],
		prep_time: 45,
		serving: '4 порції',
		author: { user_id: 1, first_name: 'Іван', last_name: 'Тестовий', avatar: sampleImg },
	},
	{
		recipe_id: 3,
		title: 'Омлет з овочами',
		image_url: sampleImg,
		ingredients: ['Яйця','Молоко','Перець'],
		prep_time: 10,
		serving: '1-2 порції',
		author: { user_id: 3, first_name: 'Олена', last_name: 'Коваль', avatar: sampleImg },
	},
];

export default function MainPage() {
	return (
		<div className="main-page">
			<main className="main-content">
				<div style={{ display: 'grid', gap: 18 }}>
					{SAMPLE.map((r) => (
						<RecipeComponent key={r.recipe_id} recipe={r} />
					))}
				</div>
			</main>
		</div>
	);
}
