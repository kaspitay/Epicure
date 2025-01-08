import React from "react";

const PageHeader = ({HeaderName}) => {
  return (
    <div className="relative w-full  h-[8px] md-[100px] lg:h-[150px] rounded-lg bg-gradient-to-b from-[#768895] mb-5">
      <h1 className="absolute bottom-[20%] left-[10%] sm:left-[4%]  md:left-[4%] lg:left-[4%] text-[32.67px] md:text-[42.67px] lg:text-[42.67px] font-bold text-white">
        {HeaderName}
      </h1>
    </div>
  );
};

export default PageHeader;
