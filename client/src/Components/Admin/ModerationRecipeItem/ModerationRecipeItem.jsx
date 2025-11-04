import React, { useState } from 'react';
import styles from "./ModerationRecipeItem.module.css";
import { useNavigate } from 'react-router-dom';
import useUserStore from '../../../stores/userStore';
import api from '../../../api/axios';

function ModerationRecipeItem(props) {
    const token = useUserStore((state) => state.token);
    const { recipe, onAction} = props;
    const { author, category, ingredients, title, description, prep_time, serving, difficulty, image_url } = recipe;
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleApprove = async () => {
      try {
          setLoading(true);

          const config = {};

          if(token) {
            config.headers = { Authorization: `Bearer ${token}` };
          }

          await api.post(`/moderation/recipes/${recipe.recipe_id}/fulfill`, {}, config);

          if (onAction) {
            onAction(recipe.recipe_id, 'approved');
          }
      } catch (error) {
          console.error("Error rejecting recipe:", error);
      } finally {
          setLoading(false);
      }
  }

  const handleReject = async () => {
    try {
      setLoading(true);
  
      const config = {};
      if (token) {
        config.headers = { Authorization: `Bearer ${token}` };
      }
  
      await api.post(`/moderation/recipes/${recipe.recipe_id}/reject`, {}, config);
  
      if (onAction) {
        onAction(recipe.recipe_id, 'rejected');
      }
    } catch (error) {
      console.error("Error rejecting recipe:", error);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className={styles.card} >
      {/* Фото рецепту */}
      <img src={image_url} alt={title} className={styles.image} onClick={() => navigate(`/admin/recipe/${recipe.recipe_id}`)}/>

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
          <button className={styles.approve} onClick={handleApprove} disabled={loading} >Approve</button>
          <button className={styles.reject} onClick={handleReject} disabled={loading}>Reject</button>
        </div>
      </div>
    </div>
    );
}

export default ModerationRecipeItem;