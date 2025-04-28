
import "./App.css";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
// Removed unused import
import { Outlet } from "react-router-dom";

import Navbar from "./components/Navbar";

function App() {
  return (
    <ApolloProvider client={new ApolloClient({
        uri: process.env.REACT_APP_GRAPHQL_ENDPOINT || "/graphql",
        cache: new InMemoryCache(),
      })}
    >
      <div>
        <Navbar />
        <Outlet />
      </div>
    </ApolloProvider>
  );
}

export default App;
