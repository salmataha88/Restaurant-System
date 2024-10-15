import Table from '../../../DB/models/table.js'

export const addTables = async (req, res) => {
    const { tables } = req.body;

    if (!Array.isArray(tables) || tables.length === 0) {
        return res.status(400).json({ message: 'Please provide one or more tables to add' });
    }

    const validTables = tables.every(table => table.capacity);
    if (!validTables) {
        return res.status(400).json({ message: 'Each table must have a capacity' });
    }

    try {
        const addedTables = [];

        for (const tableData of tables) {
            const newTable = new Table({ capacity: tableData.capacity });
            await newTable.save();
            addedTables.push(newTable);
        }

        return res.status(201).json({ message: 'Tables added successfully', Tables: addedTables });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error adding tables', error });
    }
};

export const updateStatus = async (req, res) => {
    const {_id , status} = req.body;

    if (!status || !_id) {
        return res.status(400).json({ message: 'Please provide a valid status and table ID' });
    }

    const table = await Table.findById(_id);
    if (!table) {
        return res.status(404).json({ message: 'Table not found' });
    }

    if (table.status === status) {
        return res.status(400).json({ message: 'No changes occurred' });
    }

    if(!['available', 'occupied', 'reserved'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status, please use available, occupied, or reserved' });
    }
    table.status = status;

    await table.save();
    return res.status(200).json({ message: 'Table status updated successfully' });
};

export const deleteTable = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ message: 'Please provide a table ID' });
    }
    const table = await Table.findOne({_id:id});
    if (!table) {
        return res.status(404).json({ message: 'Table not found' });
    }
    if (table.status === 'reserved') {
        return res.status(400).json({ message: 'Cannot delete a reserved table' });
    }
    await table.deleteOne();
    return res.status(200).json({ message: 'Table deleted successfully' });
};

export const getTables = async (req, res) => {
    try {
        const tables = await Table.find();
        return res.status(200).json({ tables });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error retrieving tables', error });
    }
};

export const getTableById = async (req, res) => {
    const {id } = req.params;
    if (!id) {
        return res.status(400).json({ message: 'Please provide a table ID' });
    }
    const table = await Table.findOne({_id :id});;
    if (!table) {
        return res.status(404).json({ message: 'Table not found' });
    }
    return res.status(200).json({ table });
};

export const getTablesByStatus = async (req, res) => {
    const { status } = req.query;
    if (!status) {
        return res.status(400).json({ message: 'Please provide a status' });
    }
    if (!['available', 'occupied', 'reserved'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status, please use available, occupied, or reserved' });
    }
    const tables = await Table.find({ status });
    if (!tables || tables.length === 0) { 
        return res.status(404).json({ message: 'No tables found with the given status' });
    }
    return res.status(200).json({ tables });
};
 
export const getTablesByCapacity = async (req, res) => {
    const { capacity } = req.query;
    if (!capacity) {
        return res.status(400).json({ message: 'Please provide a capacity' });
    }
    const tables = await Table.find({ capacity });
    if (!tables || tables.length === 0) {
        return res.status(404).json({ message: 'No tables found with the given capacity' });
    }
    return res.status(200).json({ tables });
};

export const getTablesByCapacityAndStatus = async (req, res) => {
    const { capacity, status } = req.body;
    if (!capacity || !status) {
        return res.status(400).json({ message: 'Please provide both capacity and status' });
    }
    if (!['available', 'occupied', 'reserved'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status, please use available, occupied, or reserved' });
    }
    const tables = await Table.find({ capacity, status });
    if (!tables || tables.length === 0) {
        return res.status(404).json({ message: 'No tables found with the given capacity and status' });
    }
    return res.status(200).json({ tables });
};