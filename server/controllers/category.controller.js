import Category from "../models/category.model.js";

export const getAll = async (req, res) => {
    try {
        const categories = await Category.findAll();
        res.status(200).json({categories: categories});
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Server error. Error Get all categories"})
    }
}