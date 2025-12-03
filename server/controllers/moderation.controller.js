import { Op } from 'sequelize';
import Recipe from "../models/recipe.model.js";
import Step from '../models/step.model.js';
import Ingredient from '../models/ingredient.model.js';
import Category from '../models/category.model.js';
import User from '../models/user.model.js';
import ExcelJS from "exceljs";

export const getModerationRecipe = async (req, res) => {
  try {
    const recipes = await Recipe.findAll({
      where: {
        moderation_status: 'pending'
      }, include: [
        { model: Step, attributes: ["description", "image_url", "step_number", "image_public_id"] },
        { model: Ingredient, attributes: ["name", "quantity", "unit"] },
        { model: Category, attributes: ["category_id", "category_name"] },
        { association: "author", attributes: ["user_id", "first_name", "last_name", "avatar"] },]
    });

    return res.status(200).json({ recipes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error. Cannot get recipes from database" });
  }
};

export const fulfill = async (req, res) => {
  try {
    const recipeId = req.params.id;

    const recipe = await Recipe.findByPk(recipeId);

    const [updated] = await Recipe.update(
      { moderation_status: 'fulfill' },
      { where: { recipe_id: recipeId } } 
    );

    if (updated) {
      const updatedRow = await Recipe.findByPk(recipeId);
      return res.status(200).json(updatedRow);
    }

    return res.status(404).json({ message: 'Row not found' });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Server error. Recipe fulfill error" + error.message });
  }
};

export const reject = async (req, res) => {
  try {
    const recipeId = req.params.id;

    const recipe = await Recipe.findByPk(recipeId);

    const [updated] = await Recipe.update(
      { moderation_status: 'reject' },
      { where: { recipe_id: recipeId } } 
    );

    if (updated) {
      const updatedRow = await Recipe.findByPk(recipeId);
      return res.status(200).json(updatedRow);
    }

    return res.status(404).json({ message: 'Row not found' });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Server error. Recipe reject error" + error.message });
  }
};

export const getRegisteredUsersCount = async (req, res) => {
  try {
    const count = await User.count();

    return res.status(200).json({ count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error. Cannot get user count from database: " + error.message });
  }
};

export const getRegisteredUsersReport = async (req, res) => {
  try {
    const year = parseInt(req.params.year);

    if (!year || isNaN(year)) {
      return res.status(400).json({ message: "Year parameter is required" });
    }

    // for naming in xlsx
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December",
    ];

    // prepare statistic
    const monthlyCounts = [];
    for (let month = 0; month < 12; month++) {
      const startDate = new Date(year, month, 1);
      const endDate = new Date(year, month + 1, 1);

      const count = await User.count({
        where: {
          createdAt: {
            [Op.gte]: startDate,
            [Op.lt]: endDate,
          },
        },
      });

      monthlyCounts.push(count);
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(`Users ${year}`);

    // define style of colums
    worksheet.columns = [
      { header: "Month", key: "month", width: 15 },
      { header: "Registered Users", key: "count", width: 20 },
    ];

    worksheet.addTable({
      name: "Users count",
      ref: "A1",
      columns: [
        { name: "Month", filterButton: true },
        { name: "Registered Users", filterButton: true },
      ],
      rows: monthlyCounts.map((count, i) => [monthNames[i], count]),
    });

    // Set headers for download
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=registered_users_report_${year}.xlsx`
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

export const getRecipeStatusCounts = async (req, res) => {
  try {
    const approved = await Recipe.count({ where: { moderation_status: "fulfill" } });
    const pending = await Recipe.count({ where: { moderation_status: "pending" } });
    const rejected = await Recipe.count({ where: { moderation_status: "reject" } });

    const result = {
      fulfill: approved,
      pending: pending,
      reject: rejected
    };

    return res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message:
        "Server error. Cannot get recipe status counts: " + error.message
    });
  }
};

export const getRecipesStats = async (req, res) => {
  try {
    const year = parseInt(req.params.year);

    if (!year || isNaN(year)) {
      return res.status(400).json({ message: "Year parameter is required" });
    }

    const monthlyCounts = [];
    for (let month = 0; month < 12; month++) {
      const startDate = new Date(year, month, 1);
      const endDate = new Date(year, month + 1, 1);

      const count = await Recipe.count({
        where: {
          createdAt: {
            [Op.gte]: startDate,
            [Op.lt]: endDate,
          },
        },
      });

      monthlyCounts.push(count);
    }

    return res.json({ year, monthlyCounts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

export const getRecipesReport = async (req, res) => {
  try {
    const year = parseInt(req.params.year);

    if (!year || isNaN(year)) {
      return res.status(400).json({ message: "Year parameter is required" });
    }

    // for naming in xlsx
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December",
    ];

    // prepare statistic
    const monthlyCounts = [];
    for (let month = 0; month < 12; month++) {
      const startDate = new Date(year, month, 1);
      const endDate = new Date(year, month + 1, 1);

      const count = await Recipe.count({
        where: {
          createdAt: {
            [Op.gte]: startDate,
            [Op.lt]: endDate,
          },
        },
      });

      monthlyCounts.push(count);
    }
    const countPending = await Recipe.count({
      where: { moderation_status: "pending" }
    });
    const countFulfill = await Recipe.count({
      where: { moderation_status: "fulfill" }
    });
    const countReject = await Recipe.count({
      where: { moderation_status: "reject" }
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(`Recipes ${year}`);

    // define look of headers 
    worksheet.columns = [
      { header: "Month", key: "month", width: 15 },
      { header: "Recipes count", key: "count", width: 20 },
      { header: "", key: "spacer", width: 5 },
      { header: "Pending", key: "count", width: 20 },
      { header: "Fulfilled", key: "count", width: 20 },
      { header: "Rejected", key: "count", width: 20 },
    ];
    const headerRow = worksheet.getRow(1);
    headerRow.height = 20;
    headerRow.font = { bold: true, size: 14, name: 'Arial' };
    headerRow.alignment = { horizontal: 'center', vertical: 'middle' };
    const cellPending = worksheet.getCell("D1");
    cellPending.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '00FFFF' }
    };
    const cellFulfill = worksheet.getCell("E1");
    cellFulfill.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '33FF33' }
    };
    const cellReject = worksheet.getCell("F1");
    cellReject.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF3333' }
    };

    // write columns and rows
    worksheet.addTable({
      name: "Recipes report",
      ref: "A1",
      columns: [
        { name: "Month", filterButton: true },
        { name: "Recipe count", filterButton: true },
        { name: " " },
        { name: "Pending" },
        { name: "Fulfilled" },
        { name: "Rejected" },
      ],
      rows: monthlyCounts.map((count, i) => {
        if(i != 0)
          return [monthNames[i], count, "", "", "", ""]
        else
          return [monthNames[i], count, "", countPending, countFulfill, countReject]
      }),
    });

    worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
      if (rowNumber === 1) return;
    
      row.eachCell((cell) => {
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
        cell.font = { size: 12, name: 'Arial' };
      });
    });

    // Set headers for download
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=recipes_report_${year}.xlsx`
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error: " + error.message });
  }
};
