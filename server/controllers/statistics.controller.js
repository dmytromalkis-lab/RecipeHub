import User from "../models/user.model.js";
import Recipe from "../models/recipe.model.js";

export const getAllUsersCount = async (req, res) => {
  try {
    const count = await User.count();

    res.status(200).json({ count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error. Error get count users." });
  }
};
