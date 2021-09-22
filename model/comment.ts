import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const commentSchema = new Schema({
    __v: { type: Number, select: false },
   commentId: { type: Schema.Types.ObjectId, required: false, select: false},
   content: { type: String, required: true, select: true },
   userId: { type: Schema.Types.ObjectId, required: true, select: true },
   articleId: { type: Schema.Types.ObjectId, ref:'Article', required: true },
   time: { type: String, required: false, default: Date.now() },
   fabulous: { type: [{ type: Schema.Types.ObjectId, ref: 'User'}] },
   stamp: { type: [{ type: Schema.Types.ObjectId, ref: 'User'}] }
});

const commentModel = model('Comment', commentSchema);

export { commentModel };