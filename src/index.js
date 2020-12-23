import React from "react";
import ReactDOM from "react-dom";
import { ApolloClient } from "apollo-client";
import { getMainDefinition } from "apollo-utilities";
import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloLink, split } from "apollo-link";
import { HttpLink } from "apollo-link-http";
import { WebSocketLink } from "apollo-link-ws";
import { ApolloProvider } from "@apollo/react-hooks";
import { Container, Row, Col } from "reactstrap";

import { LatestNews } from "./LatestNews";
import { RocketInventoryList } from "./RocketInventoryList";
import { NewRocketForm } from "./NewRocketForm";

const httpLink = new HttpLink({
  uri: "https://4wk2rno9x9.sse.codesandbox.io/graphql"
});

const wsLink = new WebSocketLink({
  uri: "wss://4wk2rno9x9.sse.codesandbox.io/graphql",
  options: {
    reconnect: true
  }
});

const terminatingLink = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === "OperationDefinition" && operation === "subscription";
  },
  wsLink,
  httpLink
);

const link = ApolloLink.from([terminatingLink]);

const client = new ApolloClient({
  link,
  cache: new InMemoryCache()
});

function App() {
  return (
    <Container className="app mt-4 mb-4”">
      <Row>
        <Col sm="12">
          <h1>
            Apollo Dealer Network{" "}
            <span role="img" aria-label="rocket">
              🚀
            </span>
          </h1>
          <h2>Helping people go places - fast.</h2>
          <hr />
        </Col>
      </Row>
      <LatestNews />
      <RocketInventoryList />
      <NewRocketForm />
    </Container>
  );
}

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById("root")
);
