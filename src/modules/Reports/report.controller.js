import exceljs from 'exceljs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import Reservation from '../../../DB/models/reservation.js'; 
import Order from '../../../DB/models/order.js';
import Inventory from '../../../DB/models/inventory.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const dailyReservations = async (req, res) => {
    const workbook = new exceljs.Workbook();
    const worksheet = workbook.addWorksheet('Daily Reservations');

    worksheet.columns = [
        { header: 'Date', key: 'date', width: 15 },
        { header: 'Time', key: 'time', width: 10 },
        { header: 'User', key: 'user', width: 30 },
        { header: 'Email', key: 'email', width: 30 },
        { header: 'TableID', key: 'tableId', width: 10 },
        { header: 'Guests', key: 'guests', width: 10 }
    ];

    const reservations = await Reservation.find().populate(
        'userId', 'fullname email'
    );

    reservations.forEach(reservation => {
        worksheet.addRow({
            date: reservation.reservationTime.toISOString().split('T')[0],
            time: reservation.reservationTime.toISOString().split('T')[1],
            user: reservation.userId?.fullname || 'Unknown',
            email: reservation.userId?.email || 'Unknown',
            tableId: reservation.tableId.toString(),
            guests: reservation.numberOfGuests,
        });
    });

    const filePath = join(__dirname, '../../../exports', 'daily_reservations.xlsx');
    await workbook.xlsx.writeFile(filePath);

    res.status(200).json({ message: 'Report generated successfully', filePath });
};


export const dailyOrders = async (req, res) => {
    const workbook = new exceljs.Workbook();
    const worksheet = workbook.addWorksheet('Daily Orders');

    worksheet.columns = [
        { header: 'Order ID', key: 'orderId', width: 10 },
        { header: 'Total Amount', key: 'totalAmount', width: 15 },
        { header: 'Payment Method', key: 'paymentMethod', width: 15 },
        { header: 'Date', key: 'date', width: 15 }
    ];

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const orders = await Order.find({
        createdAt: {
            $gte: startOfDay,
            $lte: endOfDay
        }
    });

    const totalDailyAmount = orders.reduce((sum, order) => sum + order.totalAmount, 0);

    orders.forEach(order => {
        worksheet.addRow({
            orderId: order.orderId,
            table: order.table,
            totalAmount: order.totalAmount,
            paymentMethod: order.paymentMethod,
            date: order.createdAt.toISOString().split('T')[0]
        });
    });

    worksheet.addRow({
        orderId: 'Total',
        totalAmount: totalDailyAmount
    });

    // Save the Excel file
    const filePath = join(__dirname, '../../../exports', 'daily_orders.xlsx');
    await workbook.xlsx.writeFile(filePath);

    res.status(200).json({ message: 'Daily orders report generated successfully', filePath });
};


export const monthlyOrders = async (req, res) => {
    const workbook = new exceljs.Workbook();
    const worksheet = workbook.addWorksheet('Monthly Orders Report');

    worksheet.columns = [
        { header: 'Order ID', key: 'orderId', width: 10 },
        { header: 'Date', key: 'date', width: 15 },
        { header: 'Total Amount', key: 'totalAmount', width: 15 },
        { header: 'Items', key: 'items', width: 30 }
    ];

    const currentDate = new Date();
    const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    const orders = await Order.find({
        createdAt: { $gte: startDate, $lt: endDate }
    }).populate('items', 'name');

    let totalRevenue = 0;
    let itemCounts = {};

    orders.forEach(order => {
        totalRevenue += order.totalAmount;
        order.items.forEach(item => {
            itemCounts[item.name] = (itemCounts[item.name] || 0) + 1;
        });
        worksheet.addRow({
            orderId: order.orderId,
            date: order.createdAt.toISOString().split('T')[0],
            totalAmount: order.totalAmount,
            items: order.items.map(i => i.name).join(', ')
        });
    });

    const avgOrderAmount = orders.length ? totalRevenue / orders.length : 0;
    worksheet.addRow({});
    worksheet.addRow({ orderId: 'Summary', totalAmount: totalRevenue });
    worksheet.addRow({ orderId: 'Average Order', totalAmount: avgOrderAmount });
    worksheet.addRow({ orderId: 'Top Items', items: JSON.stringify(itemCounts) });

    const filePath = join(__dirname, '../../../exports', 'monthly_orders_report.xlsx');
    await workbook.xlsx.writeFile(filePath);

    res.status(200).json({ message: 'Monthly Orders Report generated successfully', filePath });
};


export const monthlyInventory = async (req, res) => {
    const workbook = new exceljs.Workbook();
    const worksheet = workbook.addWorksheet('Monthly Inventory Report');

    worksheet.columns = [
        { header: 'Item Name', key: 'name', width: 20 },
        { header: 'Current Quantity', key: 'quantity', width: 15 },
        { header: 'Unit', key: 'unit', width: 10 },
        { header: 'Unit Price', key: 'unitPrice', width: 15 },
        { header: 'Total Price', key: 'totalPrice', width: 15 },
        { header: 'Recommendation', key: 'recommendation', width: 20 }
    ];

    const inventories = await Inventory.find();
    
    let grandTotal = 0;
    inventories.forEach(item => {
        const totalPrice = item.quantity * item.unitPrice;
        grandTotal += totalPrice;
        
        const recommendation = item.quantity <= 10 ? 'Reorder' : 'Sufficient';
        worksheet.addRow({
            name: item.name,
            quantity: item.quantity,
            unit: item.unit,
            unitPrice: item.unitPrice,
            totalPrice: totalPrice,
            recommendation
        });
    });

    const averageCost = inventories.length ? grandTotal / inventories.length : 0;
    worksheet.addRow({});
    worksheet.addRow({ name: 'Summary' });
    worksheet.addRow({ name: 'Total Inventory Cost', totalPrice: grandTotal });
    worksheet.addRow({ name: 'Average Item Cost', totalPrice: averageCost });

    const filePath = join(__dirname, '../../../exports', 'monthly_inventory_report.xlsx');
    await workbook.xlsx.writeFile(filePath);

    res.status(200).json({ message: 'Monthly Inventory Report generated successfully', filePath });
};