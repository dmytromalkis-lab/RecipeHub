import React from 'react';
import styles from "./ModerationRecipeItem.module.css";
import { useNavigate } from 'react-router-dom';

function ModerationRecipeItem(props) {
    const { recipe, onApprove, onReject} = props;
    const { author, category, ingredients, title, description, prep_time, serving, difficulty, image_url } = recipe;
    const navigate = useNavigate();

  return (
    <div className={styles.card} onClick={() => navigate(`/recipe/${recipe.recipe_id}`)} >
      {/* Фото рецепту */}
      <img src={image_url} alt={title} className={styles.image} />

      <div className={styles.content}>
        {/* Заголовок */}
        <h3 className={styles.title}>{title}</h3>

        {/* Автор */}
        <div className={styles.author}>
          <img src={author.avatar} alt={`${author.first_name} ${author.last_name}`} className={styles.avatar} />
          <span>{author.first_name} {author.last_name}</span>
        </div>

        {/* Опис */}
        <p className={styles.description}>{description}</p>

        {/* Інформація про рецепт */}
        <div className={styles.info}>
          <span><strong>Time:</strong> {prep_time} min</span>
          <span><strong>Servings:</strong> {serving}</span>
          <span><strong>Difficulty:</strong> {difficulty}</span>
        </div>

        {/* Інгредієнти */}
        <div className={styles.ingredients}>
          <strong>Ingredients:</strong> {ingredients.map(i => i.name).join(', ')}
        </div>

        {/* Категорія */}
        <div className={styles.category}>
          <strong>Category:</strong> {category.category_name}
        </div>

        {/* Дії */}
        <div className={styles.actions}>
          {/* <button className={styles.approve} onClick={onApprove} >Approve</button>
          <button className={styles.reject} onClick={onReject}>Reject</button> */}
        </div>
      </div>
    </div>
    );
}

export default ModerationRecipeItem;