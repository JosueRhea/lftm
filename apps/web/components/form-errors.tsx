import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

interface Props {
  errors: string[];
}

export function FormErrors({ errors }: Props) {
  if (errors.length <= 0) return null;
  return (
    <Alert variant="destructive" className="my-2">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <ul>
        {errors.map((error) => (
          <li className="list-disc" key={error}>
            <AlertDescription>{error}</AlertDescription>
          </li>
        ))}
      </ul>
    </Alert>
  );
}
