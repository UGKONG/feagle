import _React, { useState, useEffect } from "react";
import { NotionRenderer } from "react-notion";
import styled from "styled-components";
import axios from "axios";

import "react-notion/src/styles.css";
import "prismjs/themes/prism-tomorrow.css";

export default function Docs() {
  const [response, setResponse] = useState({});

  useEffect(() => {
    const NOTION_PAGE_ID = "API-947247dd321944ee8b3ed65c0b00a10e";
    axios
      .get(`https://notion-api.splitbee.io/v1/page/${NOTION_PAGE_ID}`)
      .then(({ data }) => {
        setResponse(data);
      });
  }, []);

  return (
    <Container>
      <NotionRenderer blockMap={response} fullPage={true} />
    </Container>
  );
}

const Container = styled.section`
  width: 100%;
  overflow: auto;
`;
