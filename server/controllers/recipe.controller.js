import Recipe from "../models/recipe.model.js";
import Step from "../models/step.model.js"; 
import Ingredient from "../models/ingredient.model.js";
import Category from "../models/category.model.js";
import User from "../models/user.model.js";
import sequelize from "../configs/db.js";
import { uploadBuffer, deleteImage } from "../services/cloudinary.service.js";

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
            const hasExplicitStepFileMapping = Array.isArray(steps) && steps.some(s => s && typeof s.fileIndex === "number" && s.fileIndex >= 0);
            for (let idx = 0; idx < steps.length; idx++) {
                const step = steps[idx];
                if (!step || !step.description) continue;

                let stepImageUrl = step.image_url || null;
                let stepImagePublicId = step.image_public_id || null;

                // Determine which file belongs to this step
                // If any step uses fileIndex, use only explicit mapping; else fallback to positional mapping
                let stepFile = undefined;
                if (hasExplicitStepFileMapping) {
                    if (typeof step.fileIndex === "number" && step.fileIndex >= 0 && step.fileIndex < stepImageFiles.length) {
                        stepFile = stepImageFiles[step.fileIndex];
                    }
                } else {
                    if (idx < stepImageFiles.length) {
                        stepFile = stepImageFiles[idx];
                    }
                }
                
                // Upload file if provided and no image_url already set
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
                { model: Step, attributes: ["description", "image_url", "step_number", "image_public_id"] },
                { model: Ingredient, attributes: ["name", "quantity", "unit"] },
                { model: Category, attributes: ["category_id", "category_name"] },
              { association: "author", attributes: ["user_id", "first_name", "last_name", "avatar"] },
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
		const recipeId = req.params.id;
		const userId = req.user.id;

		const recipe = await Recipe.findOne({where: {
			recipe_id: recipeId,
			user_id: userId,
		}});

		if(!recipe) {
			return res.status(404).json({message: "Not found recipe for update"});
		}

		// Allow partial updates; parse arrays if sent as strings
		let { category_id, title, description, difficulty, prep_time, serving, steps, ingredients, image_url, image_public_id } = req.body;

		// Handle main image file upload if provided
		const mainImageFile = req.files?.image?.[0];
		if (mainImageFile) {
			const uploaded = await uploadBuffer(mainImageFile.buffer, { folder: "recipes" });
			image_url = uploaded.secure_url;
			image_public_id = uploaded.public_id;
		}

		if (typeof steps === "string") {
			try { steps = JSON.parse(steps); } catch { steps = undefined; }
		}
		if (typeof ingredients === "string") {
			try { ingredients = JSON.parse(ingredients); } catch { ingredients = undefined; }
		}

		let hasAnyChange = false;
		const oldImagePublicId = recipe.image_public_id;
		const stepImageFiles = req.files?.stepImages || [];

		await sequelize.transaction(async (t) => {
			const updatable = { category_id, title, description, difficulty, prep_time, serving, image_url, image_public_id };
			for (const [key, value] of Object.entries(updatable)) {
				if (value !== undefined) {
					recipe[key] = value;
					hasAnyChange = true;
				}
			}

			const shouldDeleteOldImage = image_public_id !== undefined && oldImagePublicId && image_public_id !== oldImagePublicId;

			if (steps !== undefined) {
				if (!Array.isArray(steps) || steps.length === 0) {
					return res.status(422).json({ message: "Steps must be a non-empty array" });
				}
				// collect old step public ids
				const oldSteps = await Step.findAll({ where: { recipe_id: recipeId }, attributes: ["image_public_id"], transaction: t });
				const oldStepPublicIds = new Set(oldSteps.map(s => s.image_public_id).filter(Boolean));

				await Step.destroy({ where: { recipe_id: recipeId }, transaction: t });
				const stepsPayload = [];
				const hasExplicitStepFileMapping = steps.some(s => s && typeof s.fileIndex === "number" && s.fileIndex >= 0);
				for (let idx = 0; idx < steps.length; idx++) {
					const s = steps[idx];
					if (!s || !s.description) {
						return res.status(422).json({ message: "Each step must include description" });
					}
					let stepImageUrl = s.image_url || null;
					let stepImagePublicId = s.image_public_id || null;
					
					// Determine which file belongs to this step
					// If any step uses fileIndex, use only explicit mapping; else fallback to positional mapping
					let stepFile = undefined;
					if (hasExplicitStepFileMapping) {
						if (typeof s.fileIndex === "number" && s.fileIndex >= 0 && s.fileIndex < stepImageFiles.length) {
							stepFile = stepImageFiles[s.fileIndex];
						}
					} else {
						if (idx < stepImageFiles.length) {
							stepFile = stepImageFiles[idx];
						}
					}
					
					// Upload file if provided and no image_url already set
					if (!stepImageUrl && stepFile) {
						const uploadedStep = await uploadBuffer(stepFile.buffer, { folder: "recipes/steps" });
						stepImageUrl = uploadedStep.secure_url;
						stepImagePublicId = uploadedStep.public_id;
					}

					stepsPayload.push({
						recipe_id: recipeId,
						description: s.description,
						step_number: typeof s.step_number === "number" ? s.step_number : idx + 1,
						image_url: stepImageUrl,
						image_public_id: stepImagePublicId,
					});
				}
				await Step.bulkCreate(stepsPayload, { transaction: t });
				const newPublicIds = new Set(stepsPayload.map(s => s.image_public_id).filter(Boolean));
				const publicIdsToDelete = [...oldStepPublicIds].filter(pid => !newPublicIds.has(pid));
				if (publicIdsToDelete.length) {
					(async () => {
						for (const pid of publicIdsToDelete) { try { await deleteImage(pid); } catch {} }
					})();
				}
				hasAnyChange = true;
			}

			if (ingredients !== undefined) {
				if (!Array.isArray(ingredients) || ingredients.length === 0) {
					return res.status(422).json({ message: "Ingredients must be a non-empty array" });
				}
				await Ingredient.destroy({ where: { recipe_id: recipeId }, transaction: t });
				const ingredientsPayload = ingredients.map((i) => ({
					recipe_id: recipeId,
					name: i.name,
					quantity: i.quantity,
					unit: i.unit,
				})).filter(i => i.name && i.quantity && i.unit);
				if (ingredientsPayload.length !== ingredients.length) {
					return res.status(422).json({ message: "Each ingredient must include name, quantity and unit" });
				}
				await Ingredient.bulkCreate(ingredientsPayload, { transaction: t });
				hasAnyChange = true;
			}

			if (hasAnyChange) {
				recipe.moderation_status = "pending";
			}

			await recipe.save({ transaction: t });

			if (shouldDeleteOldImage) {
				try { await deleteImage(oldImagePublicId); } catch {}
			}
		});

		const updated = await Recipe.findOne({
			where: { recipe_id: recipeId },
			include: [
				{ model: Step, attributes: ["description", "image_url", "step_number", "image_public_id"] },
				{ model: Ingredient, attributes: ["name", "quantity", "unit"] },
				{ model: Category, attributes: ["category_id", "category_name"] },
                { association: "author", attributes: ["user_id", "first_name", "last_name", "avatar"] },
			],
		});

		return res.status(200).json({ message: "Recipe updated", recipe: updated });

	} catch (error) {
		console.error(error);
		res.status(500).json({message: "Server Error. Error update recipe"});
	}
}

export const deleteRecipe = async (req, res) => {
    try {
        const recipeId = req.params.id;
        const userId = req.user.id;

        const recipe = await Recipe.findOne({where: {recipe_id: recipeId, user_id: userId}});

        if(!recipe) {
            return res.status(404).json({message: "Not found recipe for delete"});
        }

        await recipe.destroy();

        res.status(200).json({message: "Recipe deleted successfuly"});
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Server Error. Error delete recipe"});
    }
}

export const getMyRecipes = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      throw new Error("User not authenticated");
    }

    const userId = req.user.id;

    const recipes = await Recipe.findAll({
      where: {
        user_id: userId
      }, 
      include: [
        { model: Step, attributes: ["description", "image_url", "step_number", "image_public_id"] },
        { model: Ingredient, attributes: ["name", "quantity", "unit"] },
        { model: Category, attributes: ["category_id", "category_name"] },
        { association: "author", attributes: ["user_id", "first_name", "last_name", "avatar"] },
    ],
    });

    if(!recipes) {
        return res.status(404).json({message: "Not found recipes for user"})
    }

    return res.status(200).json({ recipes });
  } catch (error) {
    console.error(error);
    res.status(500).json({message: "Server error. Error get recipe all users recipes. " + error }) 
  }
}
