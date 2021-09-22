import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const articleSchema = new Schema({
    __v: { type: Number, select: false },
    type: { type: Number, required: true, default: 0 } , // 0 文章 1 话题 2视频
    articleId: { type: String, default: mongoose.Types.ObjectId() },
    title: { type: String,  required: true },
    collectCount: { type: String, required: false, select: false },
    likeCount: { type: String, default: 0 },
    comment: { type: [{ type: Schema.Types.ObjectId, ref: 'Comment' }], required: false, select: false },
    agreeCount: { type: String, default: 0 },
    content: { type: String, required: true },
    catalog: { type: Number, required: true, default: 0 }, // 0 科学 1 数码 2 体育 3 时尚 4 影视
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, select: false },
    time: { type: Date, default: Date.now() },
    isHot: { type: Boolean, default: false }, // 是否热榜
    readCount: { type: Number, default: 0 },
});

const articleModel = model('Article', articleSchema);

export { articleModel };