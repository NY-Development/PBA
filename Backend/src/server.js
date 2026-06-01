import { app } from "./app.js";
import { testDBConnection } from "./configs/db.js";
import { Env } from "./configs/env.js";


app.listen(Env.PORT, () => {
  try {
    console.log(`Server is running on port ${Env.PORT}`);
    testDBConnection();
  }catch(err){
    console.log(`Server error: ${err}`)
  }
});