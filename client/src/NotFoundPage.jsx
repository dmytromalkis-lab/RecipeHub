import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div>
      <h1> Not Found Page 404 </h1>
      <Link to={'/main'}>
        <button> Go to Main </button>
      </Link>
    </div>
  );
};
