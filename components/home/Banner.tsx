/* eslint-disable @next/next/no-img-element */
"use client";
import { getWatchProviders } from "@/actions/movies";
import { Provider } from "@/models/types";
import { useEffect, useState } from "react";
import CardSection from "./CardSections";

export default function HomeBanner() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [providerId, setProviderId] = useState<number | undefined>();

  useEffect(() => {
    const fetchProviders = async () => {
      const data = await getWatchProviders();
      if (!data) {
        console.error("Could not load provider.");
      } else {
        setProviders(data);
        if (data.length) setProviderId(data[0].provider_id);
      }
    };
    fetchProviders();
  }, []);

  return (
    <section>
      <div className="bg-black relative -mt-[90px]">
        {/* Background Image */}
        <div className="absolute inset-0 ">
          <img
            src="https://www.justwatch.com/appassets/img/home/global-home-bg-comp.png"
            alt="Background"
            className="object-cover w-full h-full h-[750px]"
          />
          <div className="absolute " />
        </div>

        {/* Title & Actions */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center bg-gradient-to-b from-transparent to-black pt-[56px]">
          <div className="flex justify-end items-center w-[90%] md:w-[80%] lg:w-[50%] h-[252px]">
            <h1 className="font-[900]  text-white leading-[50px] sm:leading-[60px] lg:leading-[70px] text-[36px] sm:text-[46px] lg:text-[60px] mt-[167px] sm:mt-[220px]">
              Vaš vodič za streaming filmovi, TV serije i sport
            </h1>
          </div>
          <p className="text-[20px] m-[30px] w-[80%] text-[#999C9F] hidden sm:block mt-20 lg:mt-32 xl:mt-20">
            Uz JustWatch pronađite gdje streamati nove, popularne i nadolazeće
            sadržaje.
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 mt-20 sm:mt-[20px] mb-[100px] items-center">
            <button className="cursor-pointer bg-[#FBC500] hover:bg-[#ddad00] text-black font-semibold px-[40px] py-[16px] rounded-lg transition-colors w-[250px] sm:w-auto sm:mr-[20px] text-[16px]">
              Otkrijte filmove i serije
            </button>
            <button className="cursor-pointer bg-transparent border-1 border-[#999C9F] text-[#999C9F] rounded-lg hover:bg-gray-600/20 font-semibold w-[150px] sm:w-auto px-[20px] sm:px-[40px] py-[16px] rounded-md transition-colors text-[16px]">
              Značajke
            </button>
          </div>

          {/* Streaming services */}
          <div className="w-[90%] pt-10">
            <p className="text-[17px] pb-4 w text-[#657182]">
              Streaming servisi na JustWatch
            </p>
            <div className="flex items-center justify-center flex-wrap  gap-[20px]">
              {providers.slice(0, 4).map((i, index) => (
                <img
                  onClick={() => {
                    setProviderId(i.provider_id);
                  }}
                  key={index}
                  src={`https://image.tmdb.org/t/p/w500${i.logo_path}`}
                  alt={i.provider_name}
                  className={`w-12 h-12 bg-blue-600 rounded-[20%] block lg:hidden cursor-pointer`}
                />
              ))}
              {providers.map((i, index) => (
                <img
                  onClick={() => {
                    setProviderId(i.provider_id);
                  }}
                  key={index}
                  src={`https://image.tmdb.org/t/p/w500${i.logo_path}`}
                  alt={i.provider_name}
                  className={`w-12 h-12 bg-blue-600 rounded-[20%] hidden lg:block cursor-pointer`}
                />
              ))}
              <button className="text-white/60 text-sm flex-0 p-[12px] flex-none bg-[#10161d] rounded-[8px] h-[48px] cursor-pointer">
                POGLEDAJTE SVE
              </button>
            </div>
          </div>
        </div>
      </div>
      <CardSection providerId={providerId} />
    </section>
  );
}
