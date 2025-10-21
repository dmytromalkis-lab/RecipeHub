import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import generateToken from "../utils/generateToken.js";
import { OAuth2Client } from "google-auth-library";

// Створюємо клієнт для верифікації Google ID token
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const register = async (req, res) => {
  try {
    const { first_name, last_name, email, password } = req.body;

    if (!first_name || !last_name || !email || !password) {
      return res.status(422).json({ message: "Filds are required" });
    }

    const existUser = await User.findOne({ where: { email } });
    if (existUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      first_name: first_name,
      last_name: last_name,
      email: email,
      password: hashPassword,
      auth_provider: "local",
    });

    const token = generateToken(newUser.user_id);

    res.status(201).json({
      user: {
        user_id: newUser.user_id,
        first_name: newUser.first_name,
        last_name: newUser.last_name,
        email: newUser.email,
        avatar: newUser.avatar,
        about_user: newUser.about_user,
        role: "user",
      },
      token,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Server error. Error register " + error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(422).json({ message: "Filds are required" });
    }

    const existUser = await User.findOne({ where: { email } });
    if (!existUser) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatchPassword = await bcrypt.compare(password, existUser.password);
    if (!isMatchPassword) {
      return res.status(401).json({ message: "Invalid password!" });
    }

    const token = generateToken(existUser.user_id);

    res.status(200).json({
      user: {
        user_id: existUser.user_id,
        first_name: existUser.first_name,
        last_name: existUser.last_name,
        email: existUser.email,
        avatar: existUser.avatar,
        about_user: existUser.about_user,
        role: "user",
      },
      token,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Server error. Error login " + error.message });
  }
};

// Новий метод для Android Google аутентифікації
export const googleAuthMobile = async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ message: "ID token is required" });
    }

    // Верифікуємо ID token від Google
    const ticket = await client.verifyIdToken({
      idToken: idToken,
      audience: [
        process.env.GOOGLE_CLIENT_ID, // Web client ID
        process.env.ANDROID_CLIENT_ID, // Android client ID
      ],
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, given_name, family_name, picture } = payload;

    if (!email) {
      return res.status(400).json({ message: "Email is required from Google" });
    }

    // Шукаємо користувача за Google ID або email
    let user = await User.findOne({ 
      where: { 
        $or: [
          { google_id: googleId },
          { email: email }
        ]
      } 
    });

    const firstName = given_name || "RecipeName";
    const lastName = family_name || "RecipeHub";

    if (!user) {
      // Створюємо нового користувача
      user = await User.create({
        first_name: firstName,
        last_name: lastName,
        email: email,
        avatar: picture,
        auth_provider: "google",
        google_id: googleId,
        password: null,
      });
    } else {
      // Оновлюємо існуючого користувача
      await user.update({
        google_id: googleId,
        auth_provider: user.auth_provider === "local" ? "local_google" : "google",
        avatar: picture || user.avatar,
      });
    }

    const token = generateToken(user.user_id);

    res.status(200).json({
      user: {
        user_id: user.user_id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        avatar: user.avatar,
        about_user: user.about_user,
        role: "user",
      },
      token,
    });
  } catch (error) {
    console.error("Google Auth Mobile Error:", error);
    res.status(500).json({ 
      message: "Server error. Google authentication failed: " + error.message 
    });
  }
};

export const googleAuth = async (req, res) => {
  try {
    const user = req.user;

    const FRONTEND = (process.env.FRONTEND_URL || '').replace(/\/$/, '');

    if (!user) {
      return res.redirect(`${FRONTEND}/login?error=auth_failed`);
    }

    const token = generateToken(user.user_id);

    const userData = {
      user_id: user.user_id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      avatar: user.avatar,
      about_user: user.about_user,
      role: "user",
    };

    // Кодуємо дані користувача для передачі через URL
    const encodedUserData = encodeURIComponent(JSON.stringify(userData));
    const encodedToken = encodeURIComponent(token);

    res.redirect(`${FRONTEND}/auth/google/callback?token=${encodedToken}&user=${encodedUserData}`);
  } catch (error) {
    console.error(error);
    const FRONTEND = (process.env.FRONTEND_URL || '').replace(/\/$/, '');
    res.redirect(`${FRONTEND}/login?error=server_error`);
  }
};