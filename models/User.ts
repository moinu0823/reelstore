import mongoose, { model, models, Schema } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser {
    email: string,
    password: string;
    _id?: mongoose.Types.ObjectId 
    createdAt?: Date;
    updatedAt?: Date;
    role: "user" | "admin";
}

const uesrSchema = new Schema<IUser>(
    {
        email: {type: String, required: true, unique: true},
        password: {type : String, required: true ,},
        role: { type: String, enum: ["user", "admin"], default: "user" },
    },{timestamps: true}
)

uesrSchema.pre("save", async function (next){
   if(this.isModified("password")){
     this.password = await bcrypt.hash(this.password, 10);
   }  
   next();
});

const User = models?.User || model<IUser>("User",uesrSchema);

export default User

