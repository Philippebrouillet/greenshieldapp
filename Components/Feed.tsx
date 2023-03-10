import React, { useContext } from "react";

import styles from "@/styles/Feed.module.css";
import stylesFerme from "@/styles/CardFerme.module.css";
import stylesProduit from "@/styles/CardProduit.module.css";
import CardFerme from "./Cards/CardFerme";
import CardProduit from "./Cards/CardProduit";
import { Context } from "@/Context/dataContext";
import calculateDistance from "./DistanceCalculator";
import MobileFeed from "./MobileFeed";

export interface FeedProps {
  fermes: [
    {
      name: string;
      location: {
        lat: number;
        lng: number;
      };
      contact: {
        tel: string;
        nom: string;
        prenom: string;
        email: string;
      };
      id: string;
      img: string;
    }
  ];
  produits: [
    {
      name: string;
      alias: string;
      id: string;
      location: {
        lat: number;
        lng: number;
      };
      img: string;
    }
  ];
}

const Feed: React.FC<FeedProps> = ({ fermes, produits }) => {
  const { isMobile, rayon } = useContext(Context);

  return !isMobile ? (
    <div className={styles.feedContainer}>
      <ul className={stylesFerme.FermesContainer}>
        <h2 className={styles.titleStyle}>FERMES</h2>

        {fermes
          .sort(
            (a, b) =>
              calculateDistance(a.location.lat, a.location.lng) -
              calculateDistance(b.location.lat, b.location.lng)
          )

          .filter(
            (ferme) =>
              calculateDistance(ferme.location.lat, ferme.location.lng) < rayon
          )

          .map((ferme) => (
            <CardFerme key={ferme.id} ferme={ferme} />
          ))}
      </ul>

      <ul className={stylesProduit.ProduitContainer}>
        <h2 className={styles.titleStyle}>PRODUITS</h2>

        {produits
          .sort(
            (a, b) =>
              calculateDistance(a.location.lat, a.location.lng) -
              calculateDistance(b.location.lat, b.location.lng)
          )
          .filter(
            (produit) =>
              calculateDistance(produit.location.lat, produit.location.lng) <
              rayon
          )
          .map((produit) => (
            <CardProduit key={produit.id} produit={produit} />
          ))}
      </ul>
    </div>
  ) : (
    <MobileFeed fermes={fermes} produits={produits} />
  );
};

export default Feed;
