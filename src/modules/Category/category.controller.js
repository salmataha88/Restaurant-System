import Category from '../../../DB/models/category.js'
import Product from '../../../DB/models/product.js'

/-----------------------------------------------------Admins---------------------------------------------- */
export const addCategory = async (req, res) => {
    const { name , description } = req.body
    if(!name || !description) 
        return res.status(400).json({
            message: 'All fields are required'
        })

    const category = await Category.findOne({name})
    if(category)
        return res.status(400).json({
                message: 'Category already exists'
        })

    const newCategory = new Category({
            name,
            description
    })
    await newCategory.save()

    return res.status(201).json({
            message: 'Category created successfully'
    })
}

export const updateCategory = async (req, res) => {
    const {updates} = req.body
    const { _id } = req.params
    
    if(!updates|| !_id) 
        return res.status(400).json({
            message: 'All fields are required'
        })

    const category = await Category.findById(_id)
    if(!category)
        return res.status(400).json({
    message: 'Category not found'
    })

    if(updates.name){
        const categoryName = await Category.findOne({name: updates.name})
        if(categoryName)
            return res.status(400).json({
                    message: 'Category already exists'
            })
    }

    await Category.findByIdAndUpdate(_id, {
        $set: {
            ...updates
        },
    });

    return res.status(200).json({
        message: 'Category updated successfully'
    })
}

export const deleteCategory = async (req, res) => {
    const { name } = req.params
    const category = await Category.findOne({name})
    if(!category)
        return res.status(400).json({
    message: 'Category not found'
    })
    const products = await Product.find({category: category._id})
    if(products.length > 0)
        return res.status(400).json({
            message: 'Category has products, cannot delete'
        })

    await category.deleteOne()
    return res.status(200).json({
        message: 'Category deleted successfully'
    })
}

/----------------------------------------------------Users------------------------------------------------- */
export const getCategories = async (req, res) => {
        const categories = await Category.find()
        return res.status(200).json({
                categories
        })
}

export const getCategoryByName = async (req, res) => {
        const { name } = req.query
        const category = await Category.findOne({name})
        if(!category)
            return res.status(400).json({
                message: 'Category not found'
        })
        return res.status(200).json({
                category
        })
}