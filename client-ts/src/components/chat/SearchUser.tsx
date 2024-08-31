import { FormEvent, useEffect, useState } from "react";
import { Col, Form, Row } from "react-bootstrap";
import SearchChatModal from "./SearchChatModal";

const SearchUser = () => {
  const [keywords, setKeywords] = useState<string>("");
  const [isShowResultsModal, setIsShowResultsModal] = useState<boolean>(false);

  useEffect(() => {
    if (!isShowResultsModal) {
      setKeywords("");
    }
  }, [isShowResultsModal]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsShowResultsModal(true);
  };
  return (
    <>
      <Form onSubmit={handleSubmit}>
        <Row className="search-box">
          <Col xs="auto" className="search-text ">
            <Form.Control
              type="text"
              placeholder="Search..."
              onChange={(e) => setKeywords(e.target.value)}
              value={keywords}
            />
          </Col>
          <Col className="search-btn">
            <button type="submit">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                className="bi bi-search"
                viewBox="0 0 16 16"
              >
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
              </svg>
            </button>
          </Col>
        </Row>
      </Form>
      <SearchChatModal
        isShowResultsModal={isShowResultsModal}
        setIsShowResultsModal={setIsShowResultsModal}
        searchKeywords={keywords}
      />
    </>
  );
};
export default SearchUser;
