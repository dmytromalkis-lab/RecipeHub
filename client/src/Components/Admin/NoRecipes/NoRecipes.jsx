import styles from './NoRecipes.module.css';
import { CheckCircle } from 'lucide-react'; 

export default function NoRecipes() {
  return (
    <div className={styles.noRecipes}>
      <CheckCircle size={48} className={styles.icon} />
      <h2>No recipes to moderate</h2>
      <p>All recipes are already reviewed. Come back later!</p>
    </div>
  );
}
