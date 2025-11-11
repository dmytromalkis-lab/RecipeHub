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
import useUserStore from "../../stores/userStore.js";

function RecipeMain(
  { initialData = null, readOnly = false, errors = {}, setErrors = () => {} },
  ref
) {
  // title may be provided by initialData when viewing an existing recipe
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [description, setDescription] = useState(
    initialData?.description ?? ""
  );
  const [difficulty, setDifficulty] = useState(
    initialData?.difficulty ?? "Normal"
  );
  // support different shapes: initialData may have `Category: { category_name }` (preferred),
  // or `category` which can be string, number or object. Normalize to a display value (string or id)
  const deriveInitialCategory = (d) => {
    if (!d) return "";
    // prefer nested Category object from API
    if (d.Category && typeof d.Category === "object")
      return d.Category.category_id ?? "";
    // if category is an object, extract its id
    if (d.category && typeof d.category === "object")
      return d.category.category_id ?? "";
    return d?.category_id ?? "";
  };
  const [category, setCategory] = useState(deriveInitialCategory(initialData));
  // pass down photo src, ingredients and steps to children
  // memoize derived initial values so re-renders (e.g. loading state) don't create new array references
  const initialPhoto = useMemo(
    () => initialData?.image_url ?? null,
    [initialData]
  );
  const initialIngredients = useMemo(
    () => initialData?.ingredients ?? [],
    [initialData]
  );
  const initialSteps = useMemo(() => initialData?.steps ?? [], [initialData]);
  const initialTime = useMemo(
    () => initialData?.prep_time ?? "",
    [initialData]
  );
  const initialPortions = useMemo(
    () => initialData?.serving ?? "",
    [initialData]
  );

  useEffect(() => {
    // update when initialData changes (e.g., after fetch)
    setTitle(initialData?.title ?? "");
    setDescription(initialData?.description ?? "");
    setDifficulty(initialData?.difficulty ?? "Normal");
    setCategory(deriveInitialCategory(initialData));
  }, [initialData]);
  // refs to children to collect data on submit
  const ingRef = useRef(null);
  const guideRef = useRef(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoSrc, setPhotoSrc] = useState(initialPhoto ?? null);

  // design-only favorite state (no API attached here)
  const [isFavorited, setIsFavorited] = useState(
    initialData?.is_favorited ?? false
  );
  const [favLoading, setFavLoading] = useState(false);

  useEffect(() => {
    setPhotoSrc(initialPhoto ?? null);
  }, [initialPhoto]);

  useEffect(() => {
    // keep local favorite state in sync when initialData changes (view mode)
    setIsFavorited(initialData?.is_favorited ?? false);
  }, [initialData]);
  // expose a method to gather payload for submission via ref
  useImperativeHandle(ref, () => ({
    getPayload: async () => {
      const ingData = ingRef.current
        ? ingRef.current.getData()
        : { portions: "", ingredients: [] };
      const guideData = guideRef.current
        ? guideRef.current.getData()
        : { time: "", steps: [], stepFiles: [] };

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
  // get current logged user from store to form the author object
  const currentUser = useUserStore((state) => state.user);
  // whether current user is a regular authenticated user
  const isUser = useUserStore((state) => state.isUser());
  const token = useUserStore((state) => state.token);

  // handler extracted from inline onClick: toggle favorite (optimistic UI + API)
  const handleToggleFavorite = async (e) => {
    if (e && typeof e.preventDefault === "function") {
      e.preventDefault();
      e.stopPropagation();
    }

    // require a recipe id to call API
    const recipeId = initialData?.recipe_id ?? initialData?.id;
    if (!recipeId) return;

    // optimistic UI
    const prev = isFavorited;
    setIsFavorited(!prev);
    setFavLoading(true);

    try {
      const config = {};
      if (token) config.headers = { Authorization: `Bearer ${token}` };

      if (!prev) {
        // add to favorites
        await api.post(`/favorites/${recipeId}/add`, {}, config);
      } else {
        // remove from favorites
        await api.delete(`/favorites/${recipeId}/delete`, config);
      }
    } catch (err) {
      // rollback optimistic UI on error
      console.error("Favorite toggle failed:", err);
      setIsFavorited(prev);
    } finally {
      setFavLoading(false);
    }
  };
  // build author object: when viewing an existing recipe prefer the recipe's creator
  // provided by initialData.User (returned by getRecipeById). When creating/editing,
  // fall back to the current logged-in user from the store.
  let author = null;
  // Get the recipe author from the API response
  const apiUser = initialData?.author ?? null;
  if (initialData && apiUser) {
    // use the author object returned by the API
    author = {
      id: apiUser.user_id,
      first_name: apiUser.first_name,
      last_name: apiUser.last_name,
      avatar: apiUser.avatar,
    };
  } else if (currentUser) {
    // Only use currentUser when creating a new recipe
    author = {
      id: currentUser.user_id ?? currentUser._id ?? currentUser.id,
      name:
        currentUser.name ??
        `${currentUser.first_name ?? ""} ${currentUser.last_name ?? ""}`.trim(),
      avatar: currentUser.avatar,
      first_name: currentUser.first_name,
      last_name: currentUser.last_name,
    };
  }
  // debug: log which author object we will pass to RecipeCreator
  // (helps verify we are using recipe author vs current user)
  useEffect(() => {
    try {
      // eslint-disable-next-line no-console
      console.log("[RecipeMain] initialData.user/User ->", apiUser);
      // eslint-disable-next-line no-console
      console.log("[RecipeMain] resolved author ->", author);
    } catch (e) {
      console.error(e);
    }
  }, [initialData, currentUser, readOnly]);

  return (
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
                if (errors?.title)
                  setErrors((prev) => ({ ...prev, title: "" }));
              }}
              readOnly={readOnly}
              error={errors?.title}
            />

            {/* show heart button on view/read-only mode (design-only toggle) */}
            {readOnly && isUser && (
              <button
                type="button"
                className={
                  "rc-fav-button " +
                  (isFavorited ? "rc-fav-button--active" : "")
                }
                onClick={handleToggleFavorite}
                aria-pressed={isFavorited}
                title={isFavorited ? "Улюблене" : "Додати в улюблене"}
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
                  className={
                    errors?.description
                      ? "rc-description error"
                      : "rc-description"
                  }
                  placeholder="Brief description..."
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    if (errors?.description)
                      setErrors((prev) => ({ ...prev, description: "" }));
                  }}
                />
                {errors?.description && (
                  <div className="field-error-message">
                    {errors.description}
                  </div>
                )}
              </div>
            ) : (
              <p className="rc-description rc-description--view">
                {description}
              </p>
            )}
          </RecipeInfo>

          {/* Difficulty and category selectors placed under RecipeInfo, side-by-side */}
          <div className="rc-meta-controls">
            <RecipeDifficulty
              value={difficulty}
              onChange={(v) => {
                setDifficulty(v);
                if (errors?.difficulty)
                  setErrors((prev) => ({ ...prev, difficulty: "" }));
              }}
              readOnly={readOnly}
              error={errors?.difficulty}
              clearError={() =>
                setErrors((prev) => ({ ...prev, difficulty: "" }))
              }
            />
            <RecipeCategory
              value={category}
              onChange={(v) => {
                setCategory(v);
                if (errors?.category)
                  setErrors((prev) => ({ ...prev, category: "" }));
              }}
              readOnly={readOnly}
              error={errors?.category}
              clearError={() =>
                setErrors((prev) => ({ ...prev, category: "" }))
              }
            />
          </div>
        </div>
      </div>

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
  );
}
const forwarded = forwardRef(RecipeMain);
export default forwarded;
