import Recipe from "../models/recipe.model.js";
import Step from "../models/step.model.js"; 
import Ingredient from "../models/ingredient.model.js";
import Category from "../models/category.model.js";
import User from "../models/user.model.js";
import sequelize from "../configs/db.js";
import { uploadBuffer } from "../services/cloudinary.service.js";

export const createRecipe = async (req, res) => {
    try {
        let { category_id, title, description, difficulty, prep_time, serving, steps, ingredients, image_url, image_public_id } = req.body;
        
        if (typeof steps === "string") {
            try { steps = JSON.parse(steps); } catch { steps = []; }
        }
        if (typeof ingredients === "string") {
            try { ingredients = JSON.parse(ingredients); } catch { ingredients = []; }
        }

        if (!category_id || !title || !description || !difficulty || !prep_time || !serving) {
            return res.status(422).json({ message: "Required fields are missing" });
        }
        if (!Array.isArray(steps) || steps.length === 0) {
            return res.status(422).json({ message: "Steps must be a non-empty array" });
        }
        if (!Array.isArray(ingredients) || ingredients.length === 0) {
            return res.status(422).json({ message: "Ingredients must be a non-empty array" });
        }
        // Multer provides files via req.files when using fields()
        const mainImageFile = req.files?.image?.[0];
        const stepImageFiles = req.files?.stepImages || [];

        // Ensure we have an image either from upload or direct URL (model requires image_url)
        if (!mainImageFile && !image_url) {
            return res.status(422).json({ message: "Image is required (file upload or image_url)" });
        }

        const result = await sequelize.transaction(async (t) => {
            // If file uploaded, push to Cloudinary
            if (mainImageFile) {
                const uploaded = await uploadBuffer(mainImageFile.buffer, { folder: "recipes" });
                image_url = uploaded.secure_url;
                image_public_id = uploaded.public_id;
            }

            const recipe = await Recipe.create({
                user_id: req.user.id,
                category_id,
                title,
                description,
                difficulty,
                prep_time,
                serving,
                image_url,
                image_public_id: image_public_id || null,
            }, { transaction: t });

            const recipeId = recipe.recipe_id;

            // Prepare steps (validate minimal shape) with optional image uploads per step
            const stepsPayload = [];
            for (let idx = 0; idx < steps.length; idx++) {
                const step = steps[idx];
                if (!step || !step.description) continue;

                let stepImageUrl = step.image_url || null;
                let stepImagePublicId = step.image_public_id || null;

                // If client provided a file for this step, prefer explicit mapping by fileIndex; fallback to positional mapping
                let stepFile = undefined;
                if (typeof step.fileIndex === "number" && step.fileIndex >= 0) {
                    stepFile = stepImageFiles[step.fileIndex];
                } else {
                    stepFile = stepImageFiles[idx];
                }
                if (!stepImageUrl && stepFile) {
                    const uploadedStep = await uploadBuffer(stepFile.buffer, { folder: "recipes/steps" });
                    stepImageUrl = uploadedStep.secure_url;
                    stepImagePublicId = uploadedStep.public_id;
                }

                stepsPayload.push({
                    recipe_id: recipeId,
                    description: step.description,
                    step_number: typeof step.step_number === "number" ? step.step_number : idx + 1,
                    image_url: stepImageUrl,
                    image_public_id: stepImagePublicId,
                });
            }

            if (stepsPayload.length !== steps.length) {
                return res.status(422).json({ message: "Each step must include description" });
            }

            // Prepare ingredients
            const ingredientsPayload = ingredients.map((i) => ({
                recipe_id: recipeId,
                name: i.name,
                quantity: i.quantity,
                unit: i.unit,
            })).filter(i => i.name && i.quantity && i.unit);

            if (ingredientsPayload.length !== ingredients.length) {
                return res.status(422).json({ message: "Each ingredient must include name, quantity and unit" });
            }

            const createdSteps = await Step.bulkCreate(stepsPayload, { transaction: t });
            const createdIngredients = await Ingredient.bulkCreate(ingredientsPayload, { transaction: t });

            return { recipe, createdSteps, createdIngredients };
        });

        return res.status(201).json({
            message: "Recipe created",
            recipe: {
                ...result.recipe.toJSON(),
                steps: result.createdSteps,
                ingredients: result.createdIngredients,
            }
        });
    } catch (error) {
        console.error("Error create Recipe", error);
        return res.status(500).json({ message: "Server error. Error create recipe" });
    }
}

export const getRecipeById  = async (req, res) => {
    try {
        const recipeId = req.params.id;

        const existRecipe = await Recipe.findOne({
            where: {
                recipe_id: recipeId,
            },
            include: [
                { model: Step, attributes: ["description", "image_url", "step_number"] },
                { model: Ingredient, attributes: ["name", "quantity", "unit"] },
                { model: Category, attributes: ["category_id", "category_name"] },
                { model: User, attributes: ["user_id", "first_name", "last_name", "avatar"] },
            ]
        })

        if(!existRecipe) {
            return res.status(404).json({ message: "Recipe not found" });
        }

        res.status(200).json({...existRecipe.toJSON()});
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Server error. Error get recipe by id"})       
    }
}

export const updateRecipe = async (req, res) => {
    try {
        
    } catch (error) {
        
    }
}

export const deleteRecipe = async (req, res) => {
    try {
        
    } catch (error) {
        
    }
}