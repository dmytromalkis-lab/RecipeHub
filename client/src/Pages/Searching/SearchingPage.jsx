import React from 'react';
import './SearchingPage.css';
import sampleImg from '../../assets/Logo.svg';
import RecipeComponent from '../../Components/Searching/RecipeComponent.jsx';
import SearchingTab from '../../Components/Searching/SearchingTab.jsx';
import SearchingFilters from '../../Components/Searching/SearchingFilters.jsx';

const SAMPLE = [
	{
		recipe_id: 1,
		title: 'Quick dinner',
		image_url: sampleImg,
		ingredients: ['Minced meat','Pasta','Water','Salt','Onion','Garlic','Tomatoes','Oil','Pepper','Basil'],
		prep_time: 25,
		serving: '3-4 servings',
		difficulty: 'Normal',
		category: 'Dinner',
		author: { user_id: 2, first_name: 'Mykhailo', last_name: 'Mykhalov', avatar: sampleImg },
	},
	{
		recipe_id: 2,
		title: 'Test Borscht',
		image_url: sampleImg,
		ingredients: ['Beet','Potato','Carrot'],
		prep_time: 45,
		serving: '4 servings',
		difficulty: 'Normal',
		category: 'Soups',
		author: { user_id: 1, first_name: 'Ivan', last_name: 'Testovyi', avatar: sampleImg },
	},
	{
		recipe_id: 3,
		title: 'Veggie omelette',
		image_url: sampleImg,
		ingredients: ['Eggs','Milk','Pepper'],
		prep_time: 10,
		serving: '1-2 servings',
		difficulty: 'Easy',
		category: 'Breakfasts',
		author: { user_id: 3, first_name: 'Olena', last_name: 'Koval', avatar: sampleImg },
	},
];

export default function SearchingPage() {
	return (
		<div className="main-page">
			<main className="main-content">
				<div className="searching-page-root">

					{/* Search bar on top, then two-column layout where filters align with results */}
					<SearchingTab />
					<div className="search-layout">
						<div className="search-main">
							<div className="search-results">
								{SAMPLE.map((r) => (
									<RecipeComponent key={r.recipe_id} recipe={r} />
								))}
							</div>
						</div>
						<aside className="search-sidebar">
							<SearchingFilters />
						</aside>
					</div>
				</div>
			</main>
		</div>
	);
}