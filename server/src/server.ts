import { app } from "./app";

const PORT = Number(process.env.PORT) || 4000;

app.listen(PORT, () => {
  console.log(`Monitoring API is running on http://localhost:${PORT}`);
});
