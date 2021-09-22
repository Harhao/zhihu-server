import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const userSchema = new Schema({
    __v: { type: Number, select: false },
    userId: {type: String, default: Schema.Types.ObjectId, select: false },
    name: { type: String, required: true, select: true },
    password: { type: String, required: true, select: false },
    gender: { type: Number, required: false,  default: 0, select: false },
    avatarUrl: { type: String, required: false, select: true },
    education: { type: String, required: false, select: true },
    occupation: { type: String, required: false,select: true },
    introduce: { type: String, required: false, select: true },
    email: { type: String, required: false, select: false },
    phone: { type: String, required: true, select: false },
    isOffLine: { type: Boolean, default: false, select: false },
    followUser: { type: [{ type: Schema.Types.ObjectId, ref: 'User' }], required: false, select: false },
    articleList: { type: [{ type: Schema.Types.ObjectId, ref: 'Article' }], required: false, select: false},
    collections: { type:[{ type: Schema.Types.ObjectId, ref: 'Article'}], required: false, select: false }
});

const userModel = model('User', userSchema);

export { userModel };