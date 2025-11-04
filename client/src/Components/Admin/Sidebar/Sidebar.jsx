import React from 'react';
import { TextAlignJustify } from 'lucide-react';
import { Link } from 'react-router-dom';
import styles from "./Sidebar.module.css";


function Sidebar(props) {
    const { isOpen, setIsOpen, onLogout } = props;

    return (
        <>
            <button className={styles.toggleBtn} onClick={() => setIsOpen(!isOpen)}>
                <TextAlignJustify />
            </button>

            <aside className={`${styles.sidebar} ${!isOpen ? styles.closed : ""}`}>
                <h2 className={styles.title}>Admin Pannel</h2>
                <ul className={styles.navList}>
                    <li><Link className={styles.navListRef} to="/admin/moderation">Moderatin</Link></li>
                    <li><Link className={styles.navListRef} to="/admin/users">Users</Link></li>
                    <li><Link className={styles.navListRef} to="/admin/statistics">Statistics</Link></li>
                </ul>
                <div className={styles.logoutWrapper}>
                    <a className={`${styles.navListRef} ${styles.navListLogOut}`} onClick={onLogout}>LogOut</a>
                </div>
            </aside>
        </>
    );
}

export default Sidebar;