import Product from "../../../DB/models/product.js";
import Category from "../../../DB/models/category.js";

/------------------------------------------------------Admins---------------------------------------------- */
export  const addProduct = async (req, res) => {
    const { name, price, description, quantity, category } = req.body;
    if (!name || !price || !description || !quantity || !category)
        return res.status(400).json({
            message: "All fields are required",
        });

    const product = await Product.findOne({ name });
    if (product)
        return res.status(400).json({
            message: "Product already exists",
        });

    const categoryIsExist = await Category.findById(category);
    if (!categoryIsExist)
        return res.status(400).json({
            message: "Category not found",
        });

    const inStock = quantity > 0 ? true : false;

    const newProduct = new Product({
        name,
        price,
        description,
        quantity,
        inStock,
        category,
    });
    await newProduct.save();

    return res.status(201).json({
        message: "Product created successfully",
    });
}

export const updateProduct = async (req, res) => {
    const updates = req.body;
    const { _id } = req.params;

    if(!updates || !_id)
        return res.status(400).json({
            message: "All fields are required",
        });
    
    const product = await Product.findById(_id);
    if (!product)
        return res.status(400).json({
            message: "Product not found",
        });
    
    if (updates.name) {
        const product = await Product.findOne({ name: updates.name });
        if (product)
            return res.status(400).json({
                message: "Product already exists",
            });
    }

    if (updates.category) {
        const categoryIsExist = await Category.findById(updates.category);
        if (!categoryIsExist)
            return res.status(400).json({
                message: "Category not found",
            });
    }

    const inStock = updates.quantity > 0 ? true : false;

    await Product.findByIdAndUpdate(_id, {
        $set: {
            ...updates,
            inStock,
        },
    });

    return res.status(200).json({
        message: "Product updated successfully",
    });
}

export const deleteProduct = async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product)
        return res.status(400).json({
            message: "Product not found",
        });
    await Product.findByIdAndDelete(id);

    return res.status(200).json({message: "Product deleted successfully",})
}

/------------------------------------------------------Users---------------------------------------------- */
export const getProducts = async (req, res) => {
    const products = await Product.find().populate({
        path: 'category',
        select: 'name -_id',
    });
    return res.status(200).json({
        products,
    });
}

export const getProductByName = async (req, res) => {
    const { name } = req.query;
    const product = await Product.findOne({name}).populate({
        path: 'category',
        select: 'name -_id',
    });
    if (!product)
        return res.status(400).json({
            message: "Product not found",
        });
    return res.status(200).json({
        product,
    });
}

export const getProductsByCategory = async (req, res) => {
    const { category } = req.query;
    if (!category)
        return res.status(400).json({
            message: "Category is required",
        });

    const selecetedCategory = await Category.findOne({name: category});
    if (!selecetedCategory)
        return res.status(400).json({
            message: "Category not found",
        });

    const products = await Product.find({category : selecetedCategory._id});
    if (!products)
        return res.status(400).json({
            message: "No Products Found",
        });
    return res.status(200).json({
        products,
    });
}

export const getInStockProducts = async (req, res) => {
    const products = await Product.find({inStock: true});
    if (!products || products.length === 0)
        return res.status(400).json({
            message: "No Products Found",
        });
    return res.status(200).json({
        products,
    });
}

export const getOutStockProducts = async (req, res) => {
    const products = await Product.find({inStock: false});
    if (!products || products.length === 0)
        return res.status(400).json({
            message: "No Products Found",
        });
    return res.status(200).json({
        products,
    });
}