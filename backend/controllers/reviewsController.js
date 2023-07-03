const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Reviews = require("../models/ReviewsModel");
const Users = require("../models/UsersModel");
const Reservations = require("../models/ReservationsModel");

// @desc    See if a user has a reservation in status completed
// @route   GET /api/reviews/check
// @access  User (user + admin)
exports.reviewCheck = asyncHandler(async (req, res, next) => {
    const reservations = await Reservations.find({user: req.user.id})
    let i = 0;
    ok = false;
    while(i < reservations.length && ok === false) {
        if(reservations[i].status === "completed")
            ok = true;
        i = i + 1;
    }

    if(ok === false)
        res.status(200).json({success: true, "addReview" : false })
    else if (ok === true)
        res.status(200).json({success: true, "addReview" : true})
})

// @desc    Get all reviews
// @route   GET /api/reviews/all
// @access  Public
exports.getAllReviews = asyncHandler(async (req, res, next) => {
    let query;

// Copy req.query
    const reqQuery = {...req.query}

// Fields to exclude 
    const removeFields = ["select", "sort", "page", "limit"]

// Loop over removeField and delete them from reqQuery
    removeFields.forEach(param => delete reqQuery[param]);

// Create query string
    let queryStr = JSON.stringify(reqQuery)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`)
    
// Finding the resource
    query = Reviews.find(JSON.parse(queryStr)).populate({
        path: 'user',
        select: 'firstname lastname'
    });

// Select fields
    if(req.query.select) {
        const fields = req.query.select.split( ',' ).join(' ');
        query = query.select(fields)
    }

// Sort
    if(req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
    }
    else {
        query = query.sort('-createdAt')
    }

// Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page-1) * limit;
    const endIndex = page * limit;
    const total = await Reviews.countDocuments();

    query = query.skip(startIndex).limit(limit); 

// Executing query
    const reviews = await query;

// Pagination result
    const pagination = {};
    if(endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit
        }
    }
    if(startIndex > 0) {
        pagination.prev = {
            page: page - 1,
            limit
        }
    }

    res.status(200).json({success: true, count: reviews.length, pagination, data: reviews})
})

// @desc    Get my review
// @route   GET /api/reviews
// @acces   ONLY user
exports.getMyReview = asyncHandler( async(req, res, next) => {
    const review = await Reviews.findOne({user: req.user._id})
    if(!review)
        res.status(200).json({success: false, message: "You do not have any review."})
        // return next(new ErrorResponse("You do not have any review.", 400));
    else 
        res.status(200).json({success: true, data: review})

})

// @desc    Create review
// @route   POST /api/reviews
// @access  ONLY user
exports.addReview = asyncHandler (async (req, res, next) => {
    req.body.user = req.user.id;
    const {title, description, rating, user} = req.body;

// Check if the user has a reservation in status completed
    const reservations = await Reservations.find({user: req.user.id})
    let i = 0;
    ok = false;
    while(i < reservations.length && ok === false) {
        if(reservations[i].status === "completed" )
            ok = true;
        i = i + 1;
    }

    if(ok === false)
        return next(new ErrorResponse('Only a user with a reservation in status completed can add a review.', 403));

    const review = await Reviews.create({title, description, rating, user});
    res.status(201).json({success: true, data: review})
})

// @desc    Update a review
// @route   PUT /api/reviews/
// @access  ONLY user
exports.updateMyReview = asyncHandler (async (req, res, user) => {
    const {title, description, rating} = req.body;
    const review = await Reviews.findOne({user: req.user._id})
    if(!review)
        return next(new ErrorResponse("You do not have any review.", 400));
    const updReview = await Reviews.findByIdAndUpdate(review._id, {title, description, rating}, 
        {
            new: true,
            runValidators: true
        } )
    res.status(200).json({success: true, data: updReview})
})

// @desc    Delete my review
// @route   DELETE /api/reviews
// @access  ONLY user
exports.deleteMyReview = asyncHandler( async(req, res, next) => {
    const review = await Reviews.findOne({user: req.user._id})
    if(!review)
        return next(new ErrorResponse("You do not have any review.", 400))
    review.deleteOne();
    res.status(200).json({success: true, message: "Your review has been sucessfuly deleted."})
})

// @desc    See a user's review
// @route   GET /api/reviews/:userId
// @access  ADMIN
exports.getUserReview = asyncHandler (async (req, res, next) => {
    const user = await Users.findById(req.params.userId)
    if(!user)
        return next(new ErrorResponse(`There is no user with the id of ${req.params.id}`, 401));
    if(user.isAdmin === true)
        return next(new ErrorResponse("An admin doesn't have reviews.", 401));
    if(user.isAdmin === false) {
        const review = await Reviews.findOne({user: req.params.userId})
        if(!review)
            return next(new ErrorResponse("This user has no review.", 400))
        res.status(200).json({success: true, data: review})
    }
})

// @desc    Delete user's review
// @route   DELETE /api/reviews/:userId
// @access  ADMIN
exports.deleteUserReview = asyncHandler( async(req, res, next) => {
    const user = await Users.findById(req.params.userId)
    if(!user)
        return next(new ErrorResponse(`There is no user with the id of ${req.params.id}`, 401));
    if(user.isAdmin === true)
        return next(new ErrorResponse("An admin doen't have reviews.", 401))
    if(user.isAdmin === false) {
        const review = await Reviews.findOne({user: req.params.userId});
        if(!review)
            return next(new ErrorResponse("This user has no review", 400))
        review.deleteOne();
        res.status(200).json({success: true, message: "The review has beeen successfuly deleted."})
    }
})

// @desc    Get average rating
// @route   GET /api/reviews/average
exports.getAverageRating = asyncHandler( async (req, res, next) => {
    const reviews = await Reviews.find();
    
    let i = 0;
    ratingSum = 0;
    while (i < reviews.length) {
        ratingSum = ratingSum + reviews[i].rating;
        i = i + 1;
    }

    ratingAvg = ratingSum / reviews.length.toFixed(2);
    res.status(200).json({success: true, ratingAvg})
})