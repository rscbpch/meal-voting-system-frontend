import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import Footer from "../components/Footer";
import ResultBanner from "../components/ResultBanner";
import Navbar from "../components/Navbar";
import Food from "../assets/Food.png"
import LogoWhite from "../assets/LogoWhite.svg"
import { useState } from "react";
import { div } from "motion/react-client";

  const foods = [
  {
    name: "Pizza",
    categoryId: 1,
    description: "Cheesy and delicious!",
    imgURL: Food,
    initialVotes: 5,
  },
   {
    name: "Pizza",
    categoryId: 1,
    description: "Nothing just white",
    imgURL: LogoWhite,
    initialVotes: 5,
  },
   {
    name: "Pizza",
    categoryId: 1,
    description: "Cheesy and delicious! Cheesy and delicious! Cheesy and delicious!",
    imgURL: Food,
    initialVotes: 5,
  },
   {
    name: "Pizza",
    categoryId: 1,
    description: "A savory dip made from fermented fish paste, minced pork, and coconut milk, served with fresh vegetables.",
    imgURL: Food,
    initialVotes: 5,
  },
  {
    name: "Pizza",
    categoryId: 1,
    description: "A savory dip made from fermented fish paste, minced pork, and coconut milk, served with fresh vegetables.",
    imgURL: Food,
    initialVotes: 5,
  },
]
    const items = [
  {
    title: "Canteen's Pick",
    subtitle: "Food 1",
    description:
    "A savory dip made from fermented fish paste, minced pork, and coconut milk, served with fresh vegetables.",
    imgSrc: Food,
    totalVotes: 0,
  },
  {
    title: "Canteen's Pick",
    subtitle: "Food 2",
    description:
      "A classic fried rice dish with egg, vegetables, and a touch of soy sauce.",
    imgSrc: Food,
    totalVotes: 0,
  },
  {
    title: "Canteen's Pick",
    subtitle: "Food 3",
    description: "White white white",
    imgSrc: LogoWhite,
    totalVotes: 0,
  },
   {
    title: "Canteen's Pick",
    subtitle: "Food 3",
    description: "Grilled chicken served with lime and chili dip.",
    imgSrc: Food,
    totalVotes: 0,
  },
  {
    title: "Canteen's Pick",
    subtitle: "Food 3",
    description: "Grilled chicken served with lime and chili dip.",
    imgSrc: Food,
    totalVotes: 0,
  },
  ];
const Menu = () => {
    const [votedCardId, setVotedCardId] = useState<number | null>(null);
    const navigate = useNavigate()
    
    const handleVote = (id: number) => {
        if (votedCardId === null) {
            setVotedCardId(id);

        }
    };
    return (
        <div>
            <div>
                <div className="mb-20">
                    <Navbar/>
                </div>
                <div>
                    <ResultBanner
                        items={items}
                    />
                </div>
                <div>
                    <h1 className="text-[48px] font-bold p-5 mb-10 ml-5">Menu</h1>
                </div>
                <div className="grid grid-cols-4 gap-x-6 gap-y-30 mb-10 p-10">
                    {foods.map((item, index) => (
                        <Card
                            key={index}
                            {...item}
                            initialVotes={0}
                            disabled = {votedCardId !== null}
                            onVote={() => handleVote(index)}
                        />
                    ))}
                </div>
                <Footer/>
            </div>
        </div>

    );
}
export default Menu;