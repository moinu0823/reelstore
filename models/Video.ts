import mongoose, { model, models, Schema } from "mongoose";

export const VIEDO_DIMENSION = {
    with: 1080,
    height: 1920,
}as const;

export interface IVideo {
    _id?: mongoose.Types.ObjectId;
    title: string;
    description: string;
    videoUrl: string;
    thubmnailurl: string;
    controls?: boolean;
    transformation?: {
        height: number;
        width: number;
        quality?: number; 
    }
}

const videoSchema = new Schema<IVideo> (
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        videoUrl: {
            type: String,
            required: true,
        },
        thubmnailurl: {
            type: String,
            required: true,
        },
        controls: {
            type: Boolean,
            default: true,
        },
        transformation: {
            height: {
                type: Number,
                default: VIEDO_DIMENSION.height,
            },
            width: {
                type: Number,
                default: VIEDO_DIMENSION.with,
            },
            quality: {
                type: Number,
                min: 1,
                max: 100,
            },
        },
    }, {timestamps: true}
)

const Video = models?.Video || model<IVideo>("Video",videoSchema);

export default Video;