import Reservation from '../../../DB/models/reservation.js'
import Table from '../../../DB/models/table.js'
import User from '../../../DB/models/user.js'

/-------------------------------------User----------------------------------------*/
export const createReservation = async (req, res) => {
    const {authUser} = req;
    const {tableId, date , time , numberOfGuests} = req.body;
    if (!tableId || !date || !time || !numberOfGuests) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    const table = await Table.findById(tableId);
    if (!table) {
        return res.status(404).json({ message: 'Table not found' });
    }
    if (table.status !== 'available') {
        return res.status(400).json({ message: 'Table is not available' });
    }
    const existingReservation = await Reservation.findOne({
        tableId,
        reservationTime: new Date(`${date}T${time}`),
        status: 'confirmed'
    });
    if (existingReservation) {
        return res.status(400).json({ message: 'Table is already reserved for this time' });
    }

    if(numberOfGuests > table.capacity) {
        return res.status(400).json({ message: 'Number of guests exceeds table capacity' });
    }
    if(numberOfGuests < 1) {
        return res.status(400).json({ message: 'Number of guests must be at least 1' });
    }
    if(numberOfGuests < table.capacity/2) { 
        return res.status(400).json({ message: 'Number of guests must be at least half table capacity' });
    }
    if(new Date(`${date}T${time}`) < new Date()) {
        return res.status(400).json({ message: 'Reservation time must be in the future' });
    }

    table.status = 'reserved';
    await table.save();

    const reservation = new Reservation({
        tableId,
        userId: authUser._id,
        reservationTime: new Date(`${date}T${time}`),
        numberOfGuests
    });
    await reservation.save();
    res.status(201).json({ message: 'Reservation created successfully' , reservation });
}

export const updateReservation = async (req, res) => {
    const {authUser} = req;
    const {_id} = req.params;
    const updates = req.body;
    if (!_id || !updates) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    const reservation = await Reservation.findById(_id);
    if (!reservation) {
        return res.status(404).json({ message: 'Reservation not found' });
    }

    if(reservation.userId.toString() !== authUser._id.toString()) {
        return res.status(400).json({ message: 'You are not authorized to update this reservation' });
    }
    if(reservation.status === 'placed') {
        return res.status(400).json({ message: 'Reservation is already placed, cannot be updated' });
    }

    if(updates.tableId) {
        const table = await Table.findById(updates.tableId);
        if (!table) {
            return res.status(404).json({ message: 'Table not found' });
        }
        if (table.status !== 'available') {
            return res.status(400).json({ message: 'Table is not available' });
        }
        table.status = 'reserved';
        await table.save();
    }

    if(updates.numberOfGuests){
        if(updates.numberOfGuests > table.capacity) {
        return res.status(400).json({ message: 'Number of guests exceeds table capacity' });
        }
        if(updates.numberOfGuests < 1) {
            return res.status(400).json({ message: 'Number of guests must be at least 1' });
        }
        if(updates.numberOfGuests < table.capacity/2) {
            return res.status(400).json({ message: 'Number of guests must be at least half table capacity' });
        }
    }

    if(updates.date || updates.time) {
        if(new Date(`${updates.date}T${updates.time}`) < new Date()) {
            return res.status(400).json({ message: 'Reservation time must be in the future' });
        }
        updates.date = new Date(`${updates.date}T${updates.time}`);
    }

    const newReservation =await Reservation.findByIdAndUpdate(_id,
        {
            $set: {
                ...updates,
                updatedAt: new Date()
            }
        }
    );
    res.status(200).json({ message: 'Reservation updated successfully' , newReservation });
}

export const getReservationById = async (req, res) => {
    const {authUser} = req;
    const {_id} = req.params;
    if(!_id) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    const reservation = await Reservation.findById(_id);
    if (!reservation) {
        return res.status(404).json({ message: 'Reservation not found' });
    }
    if(reservation.userId.toString() !== authUser._id.toString()) {
        return res.status(400).json({ message: 'You are not authorized to view this reservation' });
    }
    res.status(200).json({ reservation });
}

export const getReservationsOfUser = async (req, res) => {
    const {authUser} = req;
    const reservations = await Reservation.find({ userId: authUser._id });
    res.status(200).json({ reservations });
}


/-------------------------------------Admin_Staff----------------------------------------*/
export const placeReservation = async (req, res) => {
    const {_id} = req.params;
    
    if(!_id) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    const reservation = await Reservation.findById(_id);
    if (!reservation) {
        return res.status(404).json({ message: 'Reservation not found' });
    }
    if(reservation.status === 'placed') {
        return res.status(400).json({ message: 'Reservation is already placed' });
    }
    reservation.status = 'placed';
    await reservation.save();
    res.status(200).json({ message: 'Reservation placed successfully' });

}

//user of reservation
export const cancelReservation = async (req, res) => {
    const {_id} = req.params;
    const {authUser} = req;
    if (!_id) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    const reservation = await Reservation.findById(_id);
    if (!reservation) {
        return res.status(404).json({ message: 'Reservation not found' });
    }
    if(authUser._id !== reservation.userId && authUser.role !== 'User') {
        return res.status(400).json({ message: 'You are not authorized to cancel this reservation' });
    }
    if(reservation.status === 'placed') {
        return res.status(400).json({ message: 'Reservation is already placed, cannot be cancelled' });
    }
    
    const table = await Table.findById(reservation.tableId);
    if (!table) {
        return res.status(404).json({ message: 'Table not found' });
    }
    table.status = 'available';
    await table.save();
    
    await reservation.deleteOne();

    res.status(200).json({ message: 'Reservation cancelled successfully' });
};

export const getReservationsByUserId = async (req, res) => {
    const {_id} = req.params;
    if(!_id) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    const user = await User.findById(_id);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    const reservations = await Reservation.find({ userId: _id});
    if (!reservations) {
        return res.status(404).json({ message: 'Reservations not found' });
    }
    res.status(200).json({ reservations });
}

export const getReservationsByTableId = async (req, res) => {
    const {_id} = req.params;
    if(!_id) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    const table = await Table.findById({_id , status : 'reserved'});
    if (!table) {
        return res.status(404).json({ message: 'Table not found' });
    }
    const reservations = await Reservation.find({ tableId: _id});
    if (!reservations) {
        return res.status(404).json({ message: 'Reservations not found' });
    }
    res.status(200).json({ reservations });
}


export const getReservationByDate = async (req, res) => {
    const { date } = req.query; //'YYYY-MM-DD' format

    if (!date) {
        return res.status(400).json({ message: 'Date is required' });
    }
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const reservations = await Reservation.find({
        reservationTime: {
            $gte: startOfDay,
            $lte: endOfDay
        }
    });

    res.status(200).json({ reservations });
};
