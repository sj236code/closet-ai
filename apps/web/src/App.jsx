import { supabase } from "./lib/supabaseClient";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    const testQuery = async () => {
      const { data, error } = await supabase
        .from("clothing_items")
        .select("*");

      console.log("DATA:", data);
      console.log("ERROR:", error);
    };

    testQuery();
  }, []);

  return <div>Supabase Test</div>;
}

export default App;
