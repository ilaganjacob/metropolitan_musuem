import useSWR from "swr";
import Error from "next/error";
import { Button } from "react-bootstrap";
import { Card } from "react-bootstrap";
import Link from "next/link";
import { useState, useEffect } from "react"; // Added useEffect
import { useAtom } from "jotai";
import { favouritesAtom } from "@/store";
import { addToFavourites, removeFromFavourites } from "@/lib/userData"; // Added imports

export default function ArtworkCardDetail(props) {
  const fetcher = (url) => fetch(url).then((res) => res.json());
  const [favouritesList, setFavouritesList] = useAtom(favouritesAtom);
  const [showAdded, setShowAdded] = useState(false); // Changed default to false

  // Added useEffect to update showAdded based on favouritesList
  useEffect(() => {
    setShowAdded(favouritesList?.includes(props.objectID));
  }, [favouritesList]);
  async function favouritesClicked() {
    if (showAdded) {
      // Remove from favourites
      setFavouritesList(await removeFromFavourites(props.objectID));
      setShowAdded(!showAdded);
    } else {
      // Add to favourites
      setFavouritesList(await addToFavourites(props.objectID));
      setShowAdded(true);
    }
  }

  const { data, error } = useSWR(
    props.objectID
      ? `https://collectionapi.metmuseum.org/public/collection/v1/objects/${props.objectID}`
      : null,
    fetcher
  );

  if (error) return <Error statusCode={404} />;
  if (!data) return null;

  // Destructure remains the same
  const {
    primaryImage,
    title = "N/A",
    objectDate = "N/A",
    classification = "N/A",
    medium = "N/A",
    artistDisplayName = "N/A",
    creditLine = "N/A",
    dimensions = "N/A",
    artistWikidata_URL,
  } = data;

  // Modified to be an async function

  return (
    <Card>
      {primaryImage ? (
        <Card.Img
          src={
            primaryImage ||
            "https://via.placeholder.com/375x375.png?text=[+Not+Available+]"
          }
          variant="top"
        />
      ) : null}
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Card.Text>
          <strong>Date: </strong>
          {objectDate} <br></br> <strong>Classification:</strong>{" "}
          {classification}
          <br></br>
          <strong>Medium:</strong> {medium}
          <br></br>
          <br></br>
          <br></br>
          <strong>Artist: </strong>
          {artistDisplayName && (
            <>
              {artistDisplayName}{" "}
              <a href={artistWikidata_URL} target="_blank" rel="noreferrer">
                wiki
              </a>
            </>
          )}
          <br></br>
          <strong>Credit Line: </strong>
          {creditLine} <br></br>
          <strong>Dimensions: </strong>
          {dimensions}
          <br></br>
          <Button
            variant={showAdded ? "primary" : "outline-primary"}
            onClick={favouritesClicked}
          >
            {showAdded ? "+ Favourite added" : "+ Favourite"}
          </Button>
        </Card.Text>
        <Link href={`/artwork/${props.objectID}`} passHref>
          <Button variant="primary">{props.objectID}</Button>
        </Link>
      </Card.Body>
    </Card>
  );
}
