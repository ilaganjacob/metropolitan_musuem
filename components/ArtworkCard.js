import useSWR from "swr";
import Error from "next/error";
import { Button } from "react-bootstrap";
import { Card } from "react-bootstrap";
import Link from "next/link";

export default function ArtworkCard({ objectID }) {
  const fetcher = (url) => fetch(url).then((res) => res.json());

  const { data, error } = useSWR(
    `https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectID}`,
    fetcher
  );

  if (error) return <Error statusCode={404} />;
  if (!data) return null;

  //Destructure outside so we can give fallback values, we dont need ternary in the return anymore
  const {
    primaryImageSmall,
    title = "N/A",
    objectDate = "N/A",
    classification = "N/A",
    medium = "N/A",
  } = data;

  return (
    <Card style={{ width: "18rem" }}>
      <Card.Img
        src={
          primaryImageSmall
            ? primaryImageSmall
            : "https://via.placeholder.com/375x375.png?text=[+Not+Available+]"
        }
        variant="top"
      />
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Card.Text>
          <strong>Date: </strong>{objectDate} <br></br>{" "}
          <strong>Classification: </strong>{classification}
          <br></br>
          <strong>Medium: </strong>{medium}
          <br></br>
        </Card.Text>
        <Link href={`/artwork/${objectID}`} passHref>
          <Button variant="primary">
            <strong>ID:</strong> {objectID}
          </Button>
        </Link>
      </Card.Body>
    </Card>
  );
}
