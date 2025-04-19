const categoryModel = require("../models/category.Model")

const getTotalcount = async () => {
    try {

        const total = await categoryModel.tostalCategory();
        return total;

    } catch (err) {
        console.log(err, () => console.log("Error in total count"))
    }
}

const getAllCategory = async (page) => {
    try {
        const rows = await categoryModel.getAllCategory(page);
        return rows;
    } catch (error) {
        console.error("Error fetching categories from DB:", error);
        throw error;
    }

};


const postCategory = async (name) => {
    try {

        const result = await categoryModel.postCategory(name)
        if (!result) {
            return "Data is in-valid"
        }
        return result

    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            throw { status: 400, message: 'Category with this name already exists.' };
        }
        throw { status: 500, message: 'Database error while creating category', error };
    }
}


const putCategory = async (id, name) => {
    try {

        const result = await categoryModel.putCategory(id, name);
        if (!result) {
            return "Data is invalid";
        }
        return result

    } catch (error) {
        console.log("edit the category", result);
        throw error;
    }
}



const deleteCategory = async (id) => {
    try {

        const result = await categoryModel.deleteCategory(id);
        if (!result) {
            return "Data is invalid";
        }
        return result

    } catch (error) {
        console.log("edit the category", result);
        throw error;
    }
}



module.exports = {
    getAllCategory,
    postCategory,
    putCategory,
    deleteCategory,
    getTotalcount,
};
