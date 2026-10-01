const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/ApiError');

/**
 * Builds standard REST handlers (list, getOne, create, update, remove) for a
 * Mongoose model. Used for the entities that share the same simple CRUD shape:
 * Skill, Project, Experience, Education, Certification, YoutubeVideo.
 *
 * `publicProjection` restricts which fields the public GET endpoints return,
 * in case an entity ever needs to hide internal fields from visitors.
 */
const buildCrudController = (Model, { defaultSort = { order: 1, createdAt: 1 } } = {}) => ({
  list: asyncHandler(async (req, res) => {
    const items = await Model.find().sort(defaultSort);
    res.json({ success: true, count: items.length, data: items });
  }),

  getOne: asyncHandler(async (req, res) => {
    const item = await Model.findById(req.params.id);
    if (!item) throw new ApiError(404, 'Not found');
    res.json({ success: true, data: item });
  }),

  create: asyncHandler(async (req, res) => {
    const item = await Model.create(req.body);
    res.status(201).json({ success: true, data: item });
  }),

  update: asyncHandler(async (req, res) => {
    const item = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!item) throw new ApiError(404, 'Not found');
    res.json({ success: true, data: item });
  }),

  remove: asyncHandler(async (req, res) => {
    const item = await Model.findByIdAndDelete(req.params.id);
    if (!item) throw new ApiError(404, 'Not found');
    res.json({ success: true, data: {} });
  }),
});

module.exports = buildCrudController;
