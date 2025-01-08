import { Link } from "react-router-dom";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
const SearchResultsList = ({ results, title, searchFilter, ...props }) => {
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
            gap: "0.5rem",
            pagination: false,
            arrows: arrow,
          }}
        >
          {results.map((item, index) => (
            <SplideSlide key={index}>
              <div className="single-recipe-div ">
                <Link
                  to={`/${isCreator ? "creator" : "recipe"}/${item._id}`}
                  className="flex flex-col items-start mt-4"
                >
                  <img
                    // if creator, use item.profilePic instead of item.image
                    src={isCreator ? item.profilePicture : item.image}
                    className="single-recipe-img"
                    alt={isCreator ? item.name : item.title}
                  />
                </Link>
                <h1 className="text-lg mt-2 w-[103px] text-ellipsis overflow-hidden">
                  {isCreator ? item.name : item.title}
                </h1>
              </div>
            </SplideSlide>
          ))}
        </Splide>
      ) : (
        <p>No {searchFilter} found</p>
      )}
    </div>
  );
};

export default SearchResultsList;
