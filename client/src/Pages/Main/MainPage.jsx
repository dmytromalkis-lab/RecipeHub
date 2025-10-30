import './MainPage.css';
import LogoContent from './Content/LogoContent.jsx';
import SearchingZone from './Content/SearchingZone.jsx';
import Recomendations from './Content/Recomendations.jsx';

export default function MainPage() {
	return (
		<div className="main-page">
			<main className="main-content">
				<LogoContent />
				<SearchingZone />
				<Recomendations />
			</main>
		</div>
	);
}
