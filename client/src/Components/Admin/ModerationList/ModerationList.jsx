import React, { useEffect, useState } from 'react';
import api from '../../../api/axios';
import useUserStore from '../../../stores/userStore';
import Loading from '../../UI/Loading/Loading';
import NoRecipes from '../NoRecipes/NoRecipes';
import ErrorMessage from '../../UI/ErrorMessage/ErrorMessage';
import ModerationRecipeItem from '../ModerationRecipeItem/ModerationRecipeItem';
import styles from "./ModerationList.module.css";

function ModerationList(props) {
    const token = useUserStore((state) => state.token);
    const [pendingRecipes, setPendingRecipes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPendingRecipes = async () => {
            setLoading(true);
            setError(null);
            try {
                const config = {};
                if(token) {
                    config.headers = { Authorization: `Bearer ${token}` };
                }
                const responseRecipes = await api.get("/moderation/recipes", config);

                const dataRecipes = Array.isArray(responseRecipes.data?.recipes) ? responseRecipes.data?.recipes : [];
                setPendingRecipes(dataRecipes);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        }
        fetchPendingRecipes();
    }, [])


    if (loading) {
        return <Loading />;
      }
      
    if (error) {
        return <ErrorMessage message={error.message || 'Something went wrong'} />;
    }
      
    if (pendingRecipes.length === 0) {
        return <NoRecipes />;
    }
      
    return (
        <>
            <h2 style={{color: "black"}}>Recipes on pending: {pendingRecipes.length}</h2>
            <div className={styles.grid}>
            {pendingRecipes.map(recipe => (
                <ModerationRecipeItem 
                key={recipe.recipe_id}
                recipe={recipe}
                onAction={(id) =>
                    setPendingRecipes((prev) => prev.filter((r) => r.recipe_id !== id))
                  }
                />
            ))}
            </div>
        </>
      );
      
}

export default ModerationList;