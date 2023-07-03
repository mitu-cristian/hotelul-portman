const Rooms = require("../models/RoomsModel");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");

// @desc    create a room
// @route   POST /api/rooms
// @access  ADMIN
exports.createRoom = asyncHandler( async (req, res, next) => {
    const room = await Rooms.create(req.body);
    res.status(201).json({success: true, data: room})
})

// @desc    get a SINGLE room
// @route   GET /api/rooms/:id
exports.getSingleRoom = asyncHandler (async (req, res, next) => {
    const room = await Rooms.findById(req.params.id)
    if(!room)
        return next(new ErrorResponse(`There is no room with the id of ${req.params.id}`, 400))
    res.status(200).json({success: true, data: room})
})

// @desc    get ALL rooms
// @route   GET /api/rooms
exports.getAllRooms = asyncHandler (async (req, res, next) => {
    const rooms = await Rooms.find()
    res.status(200).json({success: true, count: rooms.length, data: rooms})
})

// @desc    update room
// @route   PUT /api/rooms/:id
// @access  ADMIN
exports.updateRoom = asyncHandler(async(req, res, next) => {
    let room = await Rooms.findById(req.params.id)
    if(!room)
        return next(new ErrorResponse(`There is no room with the id of ${req.params.id}`, 400))
    room = await Rooms.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })
    res.status(200).json({success: true, data: room});
})

// @desc    delete room
// @route   DELETE /api/rooms/:id
// @access  ADMIN
exports.deleteRoom = asyncHandler( async(req, res, next) => {
    let room = await Rooms.findById(req.params.id)
    if(!room)
        return next(new ErrorResponse(`There is no room with the id of ${req.params.id}`, 400))
    await room.deleteOne();
    res.status(200).json({success: true, message: 'The room has been successfuly deleted.'})
})

// @desc    update (add) a room availability
// @route   PUT /api/rooms/availability/:id
// @access  User
exports.updateRoomAvailabilityAdd = asyncHandler( async(req, res, next) => {
    let room = await Rooms.findOne({"roomNumbers._id": req.params.id})
    if (!room)
        return next(new ErrorResponse(`There is no room with the id of ${req.params.id}`, 400));
    room = await Rooms.findOneAndUpdate({"roomNumbers._id": req.params.id}, {
        $push: {"roomNumbers.$.unavailableDates": req.body.dates}
    }, {
        new: true
    })

    res.status(200).json({success: true, data: room})
})

// @desc    update (delete) a room availability
// @route   DELETE /api/rooms/availability/:id
// @access  User
exports.updateRoomAvailabilityDelete = asyncHandler(async (req, res, next) => {
    let room = await Rooms.findOne({ "roomNumbers._id": req.params.id });
    if (!room) 
        return next(new ErrorResponse(`There is no room with the id of ${req.params.id}`, 400));
  
// Remove the dates from the array
    // let datesToRemove = Array.isArray(req.body.dates) ? req.body.dates : [req.body.dates];
    let datesToRemove = req.body.dates;
    room = await Rooms.findOneAndUpdate({ "roomNumbers._id": req.params.id },
      { $pullAll: { "roomNumbers.$.unavailableDates": datesToRemove } }, { new: true }
    );

    res.status(200).json({ success: true, data: room });
  });
