import React, {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
  useMemo,
} from "react";
import { Heart } from "lucide-react";
import "./RecipeMain.css";
import api from "../../api/axios";
import RecipeName from "./RecipeName.jsx";
import RecipeCreator from "./RecipeCreator.jsx";
import RecipePhoto from "./RecipePhoto.jsx";
import RecipeInfo from "./RecipeInfo.jsx";
import RecipeIngridients from "./RecipeIngridients.jsx";
import RecipeGuide from "./RecipeGuide.jsx";
import RecipeDifficulty from "./RecipeDifficulty.jsx";
import RecipeCategory from "./RecipeCategory.jsx";
import RecipeRating from "./RecipeRating.jsx";
import ShareButton from "./ShareButton.jsx";
import RateButton from "./RateButton.jsx";
import CommentsSection from "./CommentsSection.jsx";
import useUserStore from "../../stores/userStore.js";
import SuccessPopup from "../UI/SuccessPopup.jsx";
import IngredientListAddButton from "./IngredientListAddButton.jsx";

function RecipeMain(
  { initialData = null, readOnly = false, errors = {}, setErrors = () => {} },
  ref
) {
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [difficulty, setDifficulty] = useState(initialData?.difficulty ?? "Normal");
  
  const deriveInitialCategory = (d) => {
    if (!d) return "";
    if (d.Category && typeof d.Category === "object") return d.Category.category_id ?? "";
    if (d.category && typeof d.category === "object") return d.category.category_id ?? "";
    return d?.category_id ?? "";
  };
  const [category, setCategory] = useState(deriveInitialCategory(initialData));

  const initialPhoto = useMemo(() => initialData?.image_url ?? null, [initialData]);
  const initialIngredients = useMemo(() => initialData?.ingredients ?? [], [initialData]);
  const initialSteps = useMemo(() => initialData?.steps ?? [], [initialData]);
  const initialTime = useMemo(() => initialData?.prep_time ?? "", [initialData]);
  const initialPortions = useMemo(() => initialData?.serving ?? "", [initialData]);

  useEffect(() => {
    setTitle(initialData?.title ?? "");
    setDescription(initialData?.description ?? "");
    setDifficulty(initialData?.difficulty ?? "Normal");
    setCategory(deriveInitialCategory(initialData));
  }, [initialData]);

  const ingRef = useRef(null);
  const guideRef = useRef(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoSrc, setPhotoSrc] = useState(initialPhoto ?? null);

  const [isFavorited, setIsFavorited] = useState(initialData?.is_favorited ?? false);
  const [favLoading, setFavLoading] = useState(false);
  
  const [successVisible, setSuccessVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [avgRating, setAvgRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);

  useEffect(() => {
    setPhotoSrc(initialPhoto ?? null);
  }, [initialPhoto]);

  useEffect(() => {
    setIsFavorited(initialData?.is_favorited ?? false);
  }, [initialData]);

  const refreshRating = async () => {
    const recipeId = initialData?.recipe_id ?? initialData?.id;
    if (readOnly && recipeId) {
      try {
        const res = await api.get(`/rating/${recipeId}/average`);
        setAvgRating(res.data.averageRating || 0);
        setTotalRatings(res.data.totalRatings || 0);
      } catch (error) {
        console.error("Failed to fetch rating:", error);
        setAvgRating(0);
      }
    }
  };

  useEffect(() => {
    refreshRating();
  }, [initialData, readOnly]);


  useImperativeHandle(ref, () => ({
    getPayload: async () => {
      const ingData = ingRef.current ? ingRef.current.getData() : { portions: "", ingredients: [] };
      const guideData = guideRef.current ? guideRef.current.getData() : { time: "", steps: [], stepFiles: [] };

      const payload = {
        category_id: category,
        title,
        description,
        difficulty,
        prep_time: guideData.time,
        serving: ingData.portions,
        steps: guideData.steps,
        ingredients: ingData.ingredients,
        photoFile,
        stepFiles: guideData.stepFiles || [],
      };
      return payload;
    },
  }));

  const currentUser = useUserStore((state) => state.user);
  const isUser = useUserStore((state) => state.isUser());
  const token = useUserStore((state) => state.token);

  const handleToggleFavorite = async (e) => {
    if (e && typeof e.preventDefault === "function") {
      e.preventDefault();
      e.stopPropagation();
    }
    const recipeId = initialData?.recipe_id ?? initialData?.id;
    if (!recipeId) return;

    const prev = isFavorited;
    setIsFavorited(!prev);
    setFavLoading(true);

    try {
      const config = {};
      if (token) config.headers = { Authorization: `Bearer ${token}` };

      if (!prev) {
        await api.post(`/favorites/${recipeId}/add`, {}, config);
        setSuccessMessage("Add recipe to favorites");
        setSuccessVisible(true);
      } else {
        await api.delete(`/favorites/${recipeId}/delete`, config);
        setSuccessMessage("Remove recipe from favorites");
        setSuccessVisible(true);
      }
    } catch (err) {
      console.error("Favorite toggle failed:", err);
      setIsFavorited(prev);
    } finally {
      setFavLoading(false);
    }
  };

  // --- ИСПРАВЛЕННАЯ ФУНКЦИЯ ДОБАВЛЕНИЯ ---
  const handleAddToShoppingList = async () => {
    const recipeId = initialData?.recipe_id ?? initialData?.id;
    if (!recipeId) return;

    // 1. Проверяем токен и создаем конфиг (как в функции лайков)
    if (!token) {
      alert("Please log in to add items to shopping list");
      return;
    }

    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };

    try {
      // 2. Передаем config третьим аргументом
      await api.post("/shopingList", { recipe_id: Number(recipeId) }, config);
      
      setSuccessMessage("Ingredients added to Shopping List!");
      setSuccessVisible(true);
    } catch (error) {
      console.error("Failed to add to shopping list:", error);
      // Если токен протух, может прийти 401, тут можно добавить логику разлогина
    }
  };


  let author = null;
  const apiUser = initialData?.author ?? null;
  if (initialData && apiUser) {
    author = {
      id: apiUser.user_id,
      first_name: apiUser.first_name,
      last_name: apiUser.last_name,
      avatar: apiUser.avatar,
    };
  } else if (currentUser) {
    author = {
      id: currentUser.user_id ?? currentUser._id ?? currentUser.id,
      name: currentUser.name ?? `${currentUser.first_name ?? ""} ${currentUser.last_name ?? ""}`.trim(),
      avatar: currentUser.avatar,
      first_name: currentUser.first_name,
      last_name: currentUser.last_name,
    };
  }

  return (
    <>
      <section className="rc-main">
        <div className="rc-top">
          <RecipePhoto
            readOnly={readOnly}
            photoSrc={photoSrc}
            onUpload={(file, dataUrl) => {
              setPhotoFile(file ?? null);
              setPhotoSrc(dataUrl ?? null);
            }}
          />
          <div className="rc-meta">
            <div className="rc-name-row">
              <RecipeName
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (errors?.title) setErrors((prev) => ({ ...prev, title: "" }));
                }}
                readOnly={readOnly}
                error={errors?.title}
              />

              {readOnly && isUser && (
                <button
                  type="button"
                  className={"rc-fav-button " + (isFavorited ? "rc-fav-button--active" : "")}
                  onClick={handleToggleFavorite}
                  aria-pressed={isFavorited}
                  title={isFavorited ? "Favorite" : "Add to favorites"}
                  disabled={favLoading}
                >
                  <Heart size={20} />
                </button>
              )}
            </div>
            <RecipeInfo>
              <RecipeCreator author={author} />
              {!readOnly ? (
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <textarea
                    className={errors?.description ? "rc-description error" : "rc-description"}
                    placeholder="Brief description..."
                    value={description}
                    onChange={(e) => {
                      setDescription(e.target.value);
                      if (errors?.description) setErrors((prev) => ({ ...prev, description: "" }));
                    }}
                  />
                  {errors?.description && (
                    <div className="field-error-message">{errors.description}</div>
                  )}
                </div>
              ) : (
                <p className="rc-description rc-description--view">{description}</p>
              )}
            </RecipeInfo>

            <div className="rc-meta-controls">
              <RecipeDifficulty
                value={difficulty}
                onChange={(v) => {
                  setDifficulty(v);
                  if (errors?.difficulty) setErrors((prev) => ({ ...prev, difficulty: "" }));
                }}
                readOnly={readOnly}
                error={errors?.difficulty}
                clearError={() => setErrors((prev) => ({ ...prev, difficulty: "" }))}
              />
              <RecipeCategory
                value={category}
                onChange={(v) => {
                  setCategory(v);
                  if (errors?.category) setErrors((prev) => ({ ...prev, category: "" }));
                }}
                readOnly={readOnly}
                error={errors?.category}
                clearError={() => setErrors((prev) => ({ ...prev, category: "" }))}
              />
            </div>
          </div>
        </div>

        {readOnly && (
           <RecipeRating 
              rating={Number(avgRating).toFixed(2)}
              count={totalRatings} 
           />
        )}

        <div className="rc-grid">
          <div className="rc-ingredients">
            <RecipeIngridients
              ref={ingRef}
              readOnly={readOnly}
              initialItems={initialIngredients}
              initialPortions={initialPortions}
              errors={errors}
              setErrors={setErrors}
            />
          </div>
          <div className="rc-steps">
            <RecipeGuide
              ref={guideRef}
              readOnly={readOnly}
              initialSteps={initialSteps}
              initialTime={initialTime}
              errors={errors}
              setErrors={setErrors}
            />
          </div>
        </div>
      </section>

      <SuccessPopup
        visible={successVisible}
        message={successMessage}
        onClose={() => setSuccessVisible(false)}
      />
        
      {readOnly && (
        <div className="rc-actions-row">
          <IngredientListAddButton 
             onClick={handleAddToShoppingList} 
          />
          <ShareButton />
          <RateButton 
            recipeId={initialData?.recipe_id ?? initialData?.id} 
            onRatingSuccess={refreshRating} 
          />
        </div>
      )}

      {readOnly && (
        <CommentsSection recipeId={initialData?.recipe_id ?? initialData?.id} />
      )}
    </>
  );
}

const forwarded = forwardRef(RecipeMain);
export default forwarded;