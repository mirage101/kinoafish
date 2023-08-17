import { useEffect } from "react";
import { Link } from "react-router-dom";
import PageNotFoundImage from "../assets/images/pagenotfound.png";
import { Button } from "../components/Button";
export const PageNotFound = () => {
  useEffect(() => {
    document.title = "Page Not Found / KinoAfish";
  });

  return (
    <main>
      <section className="flex flex-col justify-center px-2">
        <div className="flex flex-col items-center my-4">
          <p className="my-10 font-bold text-gray-700 text-7xl dark:text-white">
            404, Ooops!
          </p>
          <div className="max-w-lg">
            <img
              className="rounded"
              src={PageNotFoundImage}
              alt="404 Page Not Found"
            />
          </div>
        </div>
        <div className="flex justify-center my-4">
          <Link to="/">
            <Button className="w-64 text-xl text-white rounded-lg bg-gradient-to-r from-indigo-500 px-5 py-2.5 mr-2 mb-2 font-medium hover:bg-gradient-to-br">
              Back to KinoAfish
            </Button>
          </Link>
          {/* <Link to="/">
            <Button>Back</Button>
          </Link> */}
        </div>
      </section>
    </main>
  );
};
