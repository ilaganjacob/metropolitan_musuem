import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Link from "next/link";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useState } from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import NavDropdown from "react-bootstrap/NavDropdown";
import { searchHistoryAtom } from "@/store";
import { useAtom } from "jotai";
import { addToHistory } from "@/lib/userData";
import { readToken, removeToken } from "@/lib/authenticate";

export default function MainNav() {
  //so the searchField has a default value of nothing
  const [searchField, setSearchField] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);

  const router = useRouter();

  let token = readToken();

  //for updating the searchField value
  const handleChange = (e) => {
    setSearchField(e.target.value);
  };

  const { register, handleSubmit, setValue } = useForm({
    defaultValues: { searchField: "" },
  });

  const logout = () => {
    setIsExpanded(false);
    removeToken();
    router.push("/login");
  };

  //for submitting the form, rerouting and preventing default behaviour
  const submitForm = async (e) => {
    e.preventDefault();
    setIsExpanded(false);
    const trimmedSearchField = searchField.trim();

    setSearchHistory(await addToHistory(`title=true&q=${searchField}`));
    // Only submit the form if there is a valid search term
    if (trimmedSearchField) {
      router.push(`/artwork?title=true&q=${trimmedSearchField}`);
    } else {
      alert("Please enter a search term.");
    }
  };

  return (
    <>
      <Navbar
        expand="lg"
        className="fixed-top navbar-dark bg-primary"
        expanded={isExpanded}
      >
        <Container className="py-2">
          <Navbar.Brand>Jacob Ilagan</Navbar.Brand>
          <Navbar.Toggle
            aria-controls="navbarScroll"
            onClick={(e) => {
              setIsExpanded(!isExpanded);
            }}
          />
          <Navbar.Collapse id="navbarScroll">
            <Nav
              className="me-auto my-2 my-lg-0"
              style={{ maxHeight: "100px" }}
              navbarScroll
            >
              <Link href="/" passHref legacyBehavior>
                <Nav.Link
                  onClick={(e) => {
                    setIsExpanded(false);
                  }}
                >
                  Home
                </Nav.Link>
              </Link>
              {token && (
                <Link href="/search" passHref legacyBehavior>
                  <Nav.Link
                    onClick={(e) => {
                      setIsExpanded(false);
                    }}
                    active={router.pathname === "/search"}
                    className={router.pathname === "/search" && "bg-dark"}
                  >
                    Advanced Search
                  </Nav.Link>
                </Link>
              )}
            </Nav>
            {token && (
              <Form className="d-flex" onSubmit={handleSubmit(submitForm)}>
                <Form.Control
                  type="search"
                  placeholder="Search"
                  className="me-2"
                  aria-label="Search"
                  {...register("searchField")}
                />
                <Button variant="btn btn-success" type="submit">
                  Search
                </Button>
              </Form>
            )}
            {token && (
              <Nav>
                {" "}
                <NavDropdown
                  title={token && token.userName}
                  id="basic-nav-dropdown"
                >
                  <Link href="/favourites" passHref legacyBehavior>
                    <NavDropdown.Item
                      onClick={(e) => {
                        setIsExpanded(false);
                      }}
                      active={router.pathname === "/favourites"}
                      className={router.pathname === "/favourites" && "bg-primary"}
                    >
                      Favourites
                    </NavDropdown.Item>
                  </Link>
                  <Link href="/history" passHref legacyBehavior>
                    <NavDropdown.Item
                      onClick={(e) => {
                        setIsExpanded(false);
                      }}
                      active={router.pathname === "/history"}
                      className={router.pathname === "/history" && "bg-primary"}
                    >
                      Search History
                    </NavDropdown.Item>
                  </Link>
                  <NavDropdown.Item onClick={logout}>Logout</NavDropdown.Item>
                </NavDropdown>
              </Nav>
            )}
            {!token && (
              <Nav>
                <Link href="/login" passHref legacyBehavior>
                  <Nav.Link
                    onClick={(e) => {
                      setIsExpanded(false);
                    }}
                    active={router.pathname === "/login"}
                    className={router.pathname === "/login" && "bg-primary"}
                  >
                    Login
                  </Nav.Link>
                </Link>
              </Nav>
            )}
            {!token && (
              <Nav>
                <Link href="/register" passHref legacyBehavior>
                  <Nav.Link
                    onClick={(e) => {
                      setIsExpanded(false);
                    }}
                    active={router.pathname === "/register"}
                    className={router.pathname === "/register" && "bg-primary"}
                  >
                    Register
                  </Nav.Link>
                </Link>
              </Nav>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <br />
      <br />
      <br></br>
    </>
  );
}
