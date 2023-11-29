import mongoose from "mongoose";
import {tokensModel} from "../models/tokens-model";

export const authScheme = new mongoose.Schema<tokensModel>({
    token: String
}, {versionKey: false})