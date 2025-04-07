import { Link } from "react-router-dom";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";

const SearchResultsList = ({ results, title, searchFilter, popularTags = [], ...props }) => {
  let arrow = true;
  if (props.arrow == false) arrow = false;
  const isCreator = searchFilter ? searchFilter === "creators" : false;

  return (
    <div className="row-span-1 grid grid-cols-1 justify-start mb-4">
      {title && <h2 className="second-title">{title}</h2>}
      {Array.isArray(results) && results.length > 0 ? (
        <Splide
          options={{
            perPage: 5,
            gap: "1rem",
            pagination: false,
            arrows: arrow,
          }}
        >
          {results.map((item, index) => (
            <SplideSlide key={index}>
              <div className="single-recipe-div">
                <Link
                  to={`/${isCreator ? "creator" : "recipe"}/${item._id}`}
                  className="flex flex-col items-start w-full"
                >
                  <div className="recipe-card w-full">
                    <img
                      src={isCreator ? item.profilePicture : item.image}
                      className={`w-full ${isCreator ? 'h-36 object-cover rounded-full aspect-square object-center' : 'h-36 object-cover'}`}
                      alt={isCreator ? item.name : item.title}
                    />
                  </div>
                  <h1 className="recipe-title text-center w-full">
                    {isCreator ? item.name : item.title}
                  </h1>
                </Link>
              </div>
            </SplideSlide>
          ))}
        </Splide>
      ) : (
        <p className="text-gray-400">No {searchFilter} found</p>
      )}
    </div>
  );
};

export default SearchResultsList;
