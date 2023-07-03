const Reservations = require("../models/ReservationsModel");
const Rooms = require("../models/RoomsModel");
const Users = require("../models/UsersModel");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const {getDatesInRange} = require("../utils/getDatesInRange")

// @desc    create a reservation
// @route   POST /api/rooms/:roomId/reservations
// @route   POST /api/rooms/:roomId/reservations/:userId
// @access  ONLY users + ADMIN
exports.addReservation = asyncHandler (async (req, res, next) => {

// User    
    if(req.user.isAdmin === false && !req.params.userId)
        req.body.user = req.user.id;
    
// Admin    
else if(req.user.isAdmin === true && req.params.userId) {
        req.body.user = req.params.userId;
// Verify user        
        const user = await Users.findById(req.params.userId)
        if(!user)
            return next(new ErrorResponse(`There is no user with the id of ${req.params.id}`, 400));
    }

    let room = await Rooms.findOne({"roomNumbers._id": req.params.roomId})
    if(!room)
        return next(new ErrorResponse(`There is no room with the id of ${req.params.roomId}`, 400));

    req.body.rooms = room.id;

    const {user, adults, children, start, end, rooms} = req.body;

    
    const startDate = new Date(start);
    const endDate = new Date(end);
    const allDates = getDatesInRange(startDate, endDate);
    const allDatesTransformed = [];
    allDates.forEach(element => {
        allDatesTransformed.push(new Date(element));
    })

    room = await Rooms.findOne({"roomNumbers._id": req.params.roomId})
    const length = room.roomNumbers.length;
    let i = 0;
    let ok = false; // There is no problem with the dates
    while (i < length && ok == false) {
        if(room.roomNumbers[i]._id.toString() === req.params.roomId.toString()) // We have found the room from the params
        {
            let j= 0;
            
            while (j < allDatesTransformed.length) {
                for (let k = 0; k < room.roomNumbers[i].unavailableDates.length; k = k+1)
                        if(allDatesTransformed[j].toString() === room.roomNumbers[i].unavailableDates[k].toString())
                            ok = true; // There is a problem with the dates
                j = j + 1;
            }
        }
            i = i + 1;
    }
    if(ok == true)
        return next(new ErrorResponse("The room is unavailable in the selected period of time.", 403));
    
    room = await Rooms.findOneAndUpdate({"roomNumbers._id": req.params.roomId} , {
        $push: {"roomNumbers.$.unavailableDates": allDates}
    }, {
        new: true
    })

    const roomNumber = room.roomNumbers.find(r => r._id.toString() === req.params.roomId).number;
    const price = room.price * ((endDate-startDate)/1000/60/60/24)
    
    const reservation = await Reservations.create({user, price, adults, children, roomNumber, startDate, endDate, rooms })
    res.status(200).json({success: true, data: reservation})

})

// @desc    see reservations
// @route   GET /api/reservations
// @route   GET /api/reservations/:userId
// @access  ONLY users + ADMIN
exports.getReservations = asyncHandler( async (req, res, next) =>{
    let reservations;
// The route is accessed by a user
    if(req.user.isAdmin === false && !req.params.userId) 
        reservations = await Reservations.find({user: req.user.id}).sort({createdAt: 'desc'})
    
// The route is accessed by an admin
    if(req.user.isAdmin === true && req.params.userId) {
        const user = await Users.findById(req.params.id).sort({createdAt: 'desc'})
        if(!user)
            return next(new ErrorResponse(`There is no user with the id of ${req.params.id}`, 400))
        reservations = await Reservations.find({user: req.params.userId})
    }

    res.status(200).json({success: true, data: reservations})
})

// @desc    delete reservations
// @route   PUT /api/reservations/:reservationId
// @access  User + ADMIN
exports.cancelReservation = asyncHandler( async (req, res, next) => {
     
// Verify reservation
    const reservation = await Reservations.findById(req.params.reservationId) 
    if(!reservation)
        return next(new ErrorResponse(`There is no reservation with the id of ${req.params.reservationId}`, 400));

    if(reservation.status === "canceled")
        res.status(200).json({success: true, message: "The reservation has been already canceled."})        

    else if(( req.user.isAdmin === false && reservation.user.toString() === req.user.id.toString()) || req.user.isAdmin === true ) {
        let start = reservation.startDate;
        let end = reservation.endDate;
        let number = reservation.roomNumber;
        const allDates = getDatesInRange(start, end);
        await Rooms.findOneAndUpdate({"roomNumbers.number": number}, 
        { $pullAll: {"roomNumbers.$.unavailableDates": allDates} }, {new: true})
        
        const updReservation = await Reservations.findByIdAndUpdate(req.params.reservationId, {status: "canceled"}, {
            new: true,
            runValidators: true
        })

        res.status(200).json({success: true, data: req.params.reservationId})
    }
        

// If a user tries to delete other user's reservation 
    else if(req.user.isAdmin === false && reservation.user.toString() !== req.user.id.toString())
        return next(new ErrorResponse("You are not allowed to delete this reservation.", 403));    
    
})

// @desc    See which room is available based on our form
// @route   POST /api/reservations/booking/checkUserCriteria
// @access  Public
exports.checkUserCriteria = asyncHandler( async (req, res, next) => {
    const {user, adults, children, start, end} = req.body;
    const startDate = new Date(start);
    const endDate = new Date(end);
    const allDates = getDatesInRange(startDate, endDate)
    const maxPeople = adults + children;

    const roomsAfterUserSearchCriteria = {};

// Here are the rooms which can fit the number of guests
    let rooms  = await Rooms.find({"maxPeople": maxPeople})

// Check if there is AT LEAST one room that is available in this period of time
    const allDatesTransformed = [];
    allDates.forEach(element => {
        allDatesTransformed.push(new Date(element));
    })

    let q = 0;
    while (q < rooms.length) {
        let i = 0;

        while(i < rooms[q].roomNumbers.length) {
            let ok = true; // There is no problem with the dates
            let j = 0;
            while (j < allDatesTransformed.length) {
                for( let k = 0; k < rooms[q].roomNumbers[i].unavailableDates.length; k = k + 1)
                    if(allDatesTransformed[j].toString() === rooms[q].roomNumbers[i].unavailableDates[k].toString())
                        ok = false;
                j = j + 1;
            }
            // console.log(ok, rooms[q].roomNumbers[i])
            if(ok == true) {
                    roomsAfterUserSearchCriteria.roomId = rooms[q]._id;
                    roomsAfterUserSearchCriteria.name = rooms[q].title;
                    roomsAfterUserSearchCriteria.price = rooms[q].price * ((endDate-startDate)/1000/60/60/24);
                }

                i = i + 1;
            }
            q = q + 1;
        }
        res.status(200).json({success: true, data: roomsAfterUserSearchCriteria})
    })

