import Supplier from '../../../DB/models/supplier.js';
import Inventory from '../../../DB/models/inventory.js';

export const createSupplier = async (req, res) => {
    const { name, contactInfo } = req.body;
    if (!name || !contactInfo) {
        return res.status(400).json({ message: 'All fields are required, contactInfo must be an object with phone, email and address' });
    }
    const supplier = await Supplier.findOne({ name });
    if (supplier) {
        return res.status(400).json({ message: 'Supplier already exists' });
    }
    const newSupplier = new Supplier({ name, contactInfo });
    await newSupplier.save();
    res.status(201).json({ message: 'Supplier created successfully', newSupplier });
};

export const updateSupplier = async (req, res) => {
    const { supplierId } = req.params;
    const updates = req.body;
    if(!supplierId || !updates) 
        return res.status(400).json({ message: 'Supplier ID and updates are required' });

    const supplier = await Supplier.findByIdAndUpdate(supplierId, updates, { new: true });
    if (!supplier) 
        return res.status(404).json({ message: 'Supplier not found' });

    res.status(200).json({ message: 'Supplier updated successfully', supplier });
};


export const getAllSuppliers = async (req, res) => {
    const suppliers = await Supplier.find();
    if (!suppliers) {
        return res.status(404).json({ message: 'No suppliers found' });
    }
    res.status(200).json(suppliers);
};

export const getSupplierById = async (req, res) => {
    const { supplierId } = req.params;
    const supplier = await Supplier.findById(supplierId);
    if (!supplier) {
        return res.status(404).json({ message: 'Supplier not found' });
    }
    res.status(200).json(supplier);
};


export const deleteSupplier = async (req, res) => {
    const { _id } = req.params;
    if (!_id) {
        return res.status(400).json({ message: 'Supplier ID is required' });
    }
    const supplier = await Supplier.findById(_id);
    if (!supplier) {
        return res.status(404).json({ message: 'Supplier not found' });
    }
    const inventories = await Inventory.find({ supplierId: _id });
    if (inventories.length > 0) {
        for (const inventory of inventories) {
            inventory.supplierId = null;
            await inventory.save();
        }
    }
    await Supplier.findByIdAndDelete(_id);
    res.status(200).json({ message: 'Supplier deleted successfully' });
};


