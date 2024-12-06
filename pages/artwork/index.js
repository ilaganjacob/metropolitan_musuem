import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import useSWR from "swr";
import Error from "next/error";
import { Row, Col, Card, Pagination } from "react-bootstrap";
import ArtworkCard from "../../components/ArtworkCard";
import validObjectIDList from "@/public/data/validObjectIDList";

const PER_PAGE = 12;

export default function Artwork() {
  const router = useRouter();
  let finalQuery = router.asPath.split("?")[1];

  const fetcher = (url) => fetch(url).then((res) => res.json());

  const [artworkList, setArtworkList] = useState(null);
  const [page, setPage] = useState(1);

  const { data, error } = useSWR(
    `https://collectionapi.metmuseum.org/public/collection/v1/search?${finalQuery}`,
    fetcher
  );

  useEffect(() => {
    if (data) {
      let filteredResults = validObjectIDList.objectIDs.filter((x) =>
        data.objectIDs?.includes(x)
      );
      const results = [];
      for (let i = 0; i < filteredResults.length; i += PER_PAGE) {
        const chunk = filteredResults.slice(i, i + PER_PAGE);
        results.push(chunk);
      }
      setArtworkList(results);
      setPage(1);
    }
  }, [data]);

  if (error) {
    return <Error statusCode={404} />;
  }

  const previousPage = () => {
    page > 1 ? setPage(page - 1) : null;
  };

  const nextPage = () => {
    page < artworkList.length ? setPage(page + 1) : null;
  };

  return artworkList ? (
    <>
      {artworkList.length > 0 ? (
        <Row className="gy-4">
          {artworkList[page - 1].map((currentObjectID) => (
            <Col lg={3} key={currentObjectID}>
              <ArtworkCard objectID={currentObjectID} />
            </Col>
          ))}
        </Row>
      ) : (
        <Card>
          <h4>Nothing Here</h4>
          <p>Try searching for something else</p>
        </Card>
      )}
      {artworkList.length > 0 ? (
        <Row>
          <Col>
            <Pagination>
              <Pagination.Prev onClick={previousPage}></Pagination.Prev>
              <Pagination.Item>{page}</Pagination.Item>
              <Pagination.Next onClick={nextPage}></Pagination.Next>
            </Pagination>
          </Col>
        </Row>
      ) : null}
    </>
  ) : null;
}
