import User from "../models/user.model.js";
import { deleteImage, uploadBuffer } from "../services/cloudinary.service.js";

export const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({
      user: {
        user_id: user.user_id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        avatar: user.avatar,
        about_user: user.about_user,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error. Error get user by id" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const { first_name, last_name, about_user } = req.body;

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (
      first_name === undefined &&
      last_name === undefined &&
      about_user === undefined
    ) {
      return res.status(400).json({ message: "No fields to update" });
    }

    if (first_name !== undefined) user.first_name = first_name;
    if (last_name !== undefined) user.last_name = last_name;
    if (about_user !== undefined) user.about_user = about_user;

    await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        first_name: user.first_name,
        last_name: user.last_name,
        about_user: user.about_user,
      },
    });
  } catch (error) {
    console.error(error);
    res.json({ message: "Server error. Error edit user " + error.message });
  }
};

export const updateAvatar = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "File not loaded" });
    }

    const uploadResult = await uploadBuffer(req.file.buffer, {
      folder: "avatars",
      transformation: [
        { width: 512, height: 512, crop: "fill", gravity: "face" },
      ],
    });

    const oldPublicId = user.avatar_public_id;

    user.avatar = uploadResult.secure_url;
    user.avatar_public_id = uploadResult.public_id;
    await user.save();

    if (oldPublicId) await deleteImage(oldPublicId);

    res.status(200).json({
      message: "Avatar updated",
      avatar: user.avatar,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error. Error update avatar" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const existUser = await User.findByPk(userId);

    if (!existUser) {
      return res.status(404).json({ message: "User not found." });
    }

    await existUser.destroy();
    res.status(200).json({ message: "User deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error delete user!" });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const { limit = 30, offset = 0 } = req.query;

    const { rows: users, count: total } = await User.findAndCountAll({
      limit: Number(limit),
      offset: Number(offset),
    });

    res.status(200).json({
      users,
      hasMore: Number(offset) + users.length < total,
      total,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error. Error get users" });
  }
};

export const blockUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    await user.update({ is_blocked: true });

    res.status(200).json({ user, message: "User blocked" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error blocking user" });
  }
};

export const unblockUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    await user.update({ is_blocked: false });

    res.status(200).json({ user, message: "User unblocked" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error unblocking user" });
  }
};
