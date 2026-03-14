import Pasta_1 from "../../../assets/images/Pasta-1.png";
import Pasta_2 from "../../../assets/images/Pasta-2.png";
import Pasta_3 from "../../../assets/images/Pasta-3.png";
import Pasta_4 from "../../../assets/images/Pasta-4.png";

const About = ({ recipeDescription, photos }) => {
  return (
    <div className="mb-5 h-full">
      {" "}
      {photos[0] != null && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-5 mb-10">
          {photos.map((photo, index) => (
            <img
              src={photo.image}
              key={index}
              alt=""
              className="single-recipe-img"
            />
          ))}
        </div>
      )}
      <h1 className="text-[#D9D9D9] text-3xl mb-5">About</h1>
      <div className="">
        <p className="text-[14px] sm:text-[18px] md:text-[18px] lg:text-[18px] p-3 rounded-lg text-[#666666] bg-[#272727] ">
          {recipeDescription}
        </p>
      </div>
    </div>
  );
};

export default About;
