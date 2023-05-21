// env
import express from "express";

import { config } from "dotenv";
config();
import { initApp } from "./config/app.js"
const app = express();
initApp(app, express);
