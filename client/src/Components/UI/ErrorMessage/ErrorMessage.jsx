import styles from './ErrorMessage.module.css';
import { AlertCircle } from 'lucide-react';

export default function ErrorMessage({ message }) {
  return (
    <div className={styles.error}>
      <AlertCircle size={48} className={styles.icon} />
      <h2>Oops! Something went wrong</h2>
      <p>{message}</p>
    </div>
  );
}
