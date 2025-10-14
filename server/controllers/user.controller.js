import User from "../models/user.model.js";

export const updateUser = async (req, res) => {
  try {
    const { first_name, last_name, about_user } = req.body;
  } catch (error) {
    console.error(error);
    res.json({ message: "Server error. Error edit user " + error.message });
  }
};
