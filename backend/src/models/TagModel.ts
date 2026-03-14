import mongoose, { Schema, Model } from 'mongoose';
import { ITagDocument } from '../types';

const tagSchema = new Schema<ITagDocument>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    usageCount: {
      type: Number,
      default: 0,
    },
    isPopular: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Index for faster queries
tagSchema.index({ category: 1, name: 1 });
tagSchema.index({ usageCount: -1 });

const Tag: Model<ITagDocument> = mongoose.model<ITagDocument>('Tag', tagSchema);

export default Tag;
