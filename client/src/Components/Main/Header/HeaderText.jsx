import './HeaderText.css';

export default function HeaderTitle({ children = 'RecipeHub' }) {
  return <div className="header-title-component">{children}</div>;
}
