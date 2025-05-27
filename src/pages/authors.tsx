import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

export default function Authors() {
  return (
    <div className="px-4 py-6 text-xl font-medium">
      <h1> Autori </h1>
      <Button className="uppercase text-white bg-blue flex items-center text-sm font-medium mt-10">
        <AddIcon className="mr-2" /> novi autor
      </Button>
    </div>
  );
}
