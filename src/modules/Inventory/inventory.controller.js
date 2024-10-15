import Inventory  from '../../../DB/models/inventory.js';
import Supplier from '../../../DB/models/supplier.js';

export const createInventory = async (req, res) => {
    const { name, quantity, unit, supplierId , unitPrice} = req.body;
    if (!name || !quantity || !unit || !supplierId || !unitPrice) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    const inventoryExists = await Inventory.findOne({ name });
    if (inventoryExists) {
        return res.status(400).json({ message: 'Inventory already exists' });
    }
    if (quantity < 0) {
        return res.status(400).json({ message: 'Quantity cannot be negative' });
    }
    if(unitPrice < 0) {
        return res.status(400).json({ message: 'Unit price cannot be negative' });
    }
    if(!['kg', 'liters', 'grams', 'boxes'].includes(unit)) {
        return res.status(400).json({ message: 'Invalid unit, must be kg, liters, grams or boxes' });
    }
    const supplier = await Supplier.findById(supplierId);
    if (!supplier) {
        return res.status(400).json({ message: 'Invalid supplier' });
    }
    const inventory = new Inventory({ name, quantity, unit, supplierId , unitPrice});
    await inventory.save();
    res.status(201).json({ message: 'Inventory created successfully', inventory });
};

export const updateInventory = async (req, res) => {
    const { _id } = req.params;
    const updates = req.body;
    console.log(_id, updates);
    

    if(!_id || !updates) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    const inventory = await Inventory.findById(_id);
    if (!inventory) {
        return res.status(400).json({ message: 'Invalid inventory' });
    }
    if(updates.quantity) {
        if (updates.quantity < 0) {
            return res.status(400).json({ message: 'Quantity cannot be negative' });
        }
    }
    if(updates.unit) {
        if(!['kg', 'liters', 'grams', 'boxes'].includes(updates.unit)) {
            return res.status(400).json({ message: 'Invalid unit, must be kg, liters, grams or boxes' });
        }
    }
    if(updates.unitPrice) {
        if (updates.unitPrice < 0) {
            return res.status(400).json({ message: 'Unit price cannot be negative' });
        }
    }

    if(updates.supplierId) {
        const supplier = await Supplier.findById(updates.supplierId);
        if (!supplier) {
            return res.status(400).json({ message: 'Invalid supplier' });
        }
    }
    const updatedInventory = await Inventory.findByIdAndUpdate(_id, updates, { new: true });
    res.status(200).json({ message: 'Inventory updated successfully', inventory: updatedInventory });
}

export const deleteInventory = async (req, res) => {
    const { _id } = req.params;
    if (!_id) {
        return res.status(400).json({ message: 'Id is required' });
    }
    const inventory = await Inventory.findById(_id);
    if (!inventory) {
        return res.status(400).json({ message: 'Invalid inventory' });
    }
    await Inventory.findByIdAndDelete(_id);
    res.status(200).json({ message: 'Inventory deleted successfully' });
}

export const getInventoryById = async (req, res) => {
    const { _id } = req.params;
    if (!_id) {
        return res.status(400).json({ message: 'Id is required' });
    }
    const inventory = await Inventory.findById(_id);
    if (!inventory) {
        return res.status(400).json({ message: 'Invalid inventory' });
    }
    res.status(200).json({ inventory });
}

export const getAllInventories = async (req, res) => {
    const inventories = await Inventory.find();
    if (!inventories) {
        return res.status(400).json({ message: 'No inventories found' });
    }
    res.status(200).json({ inventories });
}

export const getInventoryBySupplier = async (req, res) => {
    const { supplierId } = req.params;
    if (!supplierId) {
        return res.status(400).json({ message: 'Supplier id is required' });
    }
    const inventories = await Inventory.find({ supplierId });
    if (!inventories) {
        return res.status(400).json({ message: 'No inventories found' });
    }
    res.status(200).json({ inventories });
}
