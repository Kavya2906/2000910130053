import express  from "express"
const app = express();
import testRoutes from "./Routes/testRoutes.js";


app.use("/test", testRoutes);
const PORT = 8008;

app.listen(PORT, () => console.log(`Server running on port: ${PORT}`))