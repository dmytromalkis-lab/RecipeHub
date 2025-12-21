import ShoppingItem from "../models/shoppingItem.model.js";
import ShoppingList from "../models/shoppingList.model.js";

export const deleteItemFromList = async (req, res) => {
  try {
    const itemId = req.params.id;
    const user_id = req.user.id;

    const item = await ShoppingItem.findOne({
      where: {
        shopping_list_item_id: itemId,
      },
      include: [
        {
          model: ShoppingList,
          where: { user_id },
          attributes: [],
        },
      ],
    });

    if (!item) {
      return res.status(404).json({ message: "Item not found." });
    }

    await item.destroy();

    return res.status(200).json({ message: "Item deleted." });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error. Error delete item from list of ingredients.",
    });
  }
};

export const markItemPurchased = async (req, res) => {
  try {
    const user_id = req.user.id;
    const itemId = req.params.id;

    const item = await ShoppingItem.findOne({
      where: {
        shopping_list_item_id: itemId,
      },
      include: [
        {
          model: ShoppingList,
          where: { user_id },
          attributes: [],
        },
      ],
    });

    if (!item) {
      return res.status(404).json({ message: "Item not found." });
    }

    await item.update({
      is_purchased: true,
    });

    res.status(200).json(item);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Server error. Error mark item purchased." });
  }
};
