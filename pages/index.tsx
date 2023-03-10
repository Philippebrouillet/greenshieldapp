import React from "react";
import Head from "next/head";

import Search from "@/Components/Search";
import Feed from "@/Components/Feed";

import Map from "@/Components/GoogleMap/Map";
import styles from "@/styles/Home.module.css";
import LocalisationAuth from "@/Components/LocalisationAuth";

import { collection, getDocs } from "firebase/firestore";

import { db } from "../firebase/clientApp";

interface HomeProps {
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

export interface CombinedData {
  name: string;
  img: string;
  location: {
    lat: number;
    lng: number;
  };
  contact?: {
    tel: string;
    nom: string;
    prenom: string;
    email: string;
  };
  alias?: string;
  id: string;
  key?: number;
}
//récupération des props  fermes et produits grace getServerProps
const Home = ({ fermes, produits }: HomeProps) => {
  //concaténation des data fermes et produits pour les assigners a allData.
  const allData = (fermes as CombinedData[]).concat(produits as CombinedData[]);
  return (
    <>
      <Head>
        <title>GreenShield</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Search allData={allData} />
      <div className={styles.WrapperMapFeed}>
        <Feed fermes={fermes} produits={produits} />
        <Map allData={allData} />
      </div>
      <LocalisationAuth />
    </>
  );
};

export default Home;

//récupération des données fermes et produits pour en faire des SERVERSIDEPROPS
export async function getServerSideProps() {
  const ProduitsCollectionRef = collection(db, "Produits");
  const res = await getDocs(ProduitsCollectionRef);
  const PRODUITS = res.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
    location: {
      lat: doc.data().location.latitude,
      lng: doc.data().location.longitude,
    },
  }));

  const fermesCollectionRef = collection(db, "fermes");
  const res2 = await getDocs(fermesCollectionRef);
  const FERMES = res2.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
    location: {
      lat: doc.data().location.latitude,
      lng: doc.data().location.longitude,
    },
  }));

  return { props: { fermes: FERMES, produits: PRODUITS } };
}
