// import React from "react";
import { PublicKey } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import dynamic from "next/dynamic";

import React, { useEffect, useState } from "react";

import Product from "../components/Products";

const App = () => {
  // Dynamic import `WalletMultiButton` to prevent hydration error
  const WalletMultiButtonDynamic = dynamic(
    async () =>
      (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
    { ssr: false }
  );

  // This will fetch the users' public key (wallet address) from any wallet we support
  const { publicKey } = useWallet();

  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (publicKey) {
      fetch(`/api/fetchProducts`)
        .then((response) => response.json())
        .then((data) => {
          setProducts(data);
          console.log("Products", data);
        });
    }
  }, [publicKey]);

  const renderNotConnectedContainer = () => (
    <div>
      <img
        src="https://media.giphy.com/media/eSwGh3YK54JKU/giphy.gif"
        alt="emoji"
      />

      <div className="button-container">
        <WalletMultiButtonDynamic className="cta-button connect-wallet-button" />
      </div>
    </div>
  );

  const renderItemBuyContainer = () => (
    <div className="products-container">
      {products.map((product) => (
        <Product key={product.id} product={product} />
      ))}
    </div>
  );

  return (
    <div className="App">
      <div className="container">
        <header className="header-container">
          <p className="header">Tick Tick Boom</p>
          <p className="sub-text">Bomb Bomb</p>
        </header>

        <main>
          {/* We only render the connect button if public key doesn't exist */}
          {publicKey ? renderItemBuyContainer() : renderNotConnectedContainer()}
        </main>
      </div>
    </div>
  );
};

export default App;
