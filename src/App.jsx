import React, { useEffect, useState } from "react";
import twitterLogo from "./assets/twitter-logo.svg";
import "./App.css";

// Constants
const TWITTER_HANDLE = "Amarjit_Y";
const TWITTER_LINK = `https://twitter.com/AamjitY`;

const TEST_GIFS = [
	"https://i.giphy.com/media/eIG0HfouRQJQr1wBzz/giphy.webp",
	"https://media3.giphy.com/media/L71a8LW2UrKwPaWNYM/giphy.gif?cid=ecf05e47rr9qizx2msjucl1xyvuu47d7kf25tqt2lvo024uo&rid=giphy.gif&ct=g",
	"https://media4.giphy.com/media/AeFmQjHMtEySooOc8K/giphy.gif?cid=ecf05e47qdzhdma2y3ugn32lkgi972z9mpfzocjj6z1ro4ec&rid=giphy.gif&ct=g",
	"https://i.giphy.com/media/PAqjdPkJLDsmBRSYUp/giphy.webp",
];

const App = () => {
	// defining hooks
	const [walletAddress, setWalletAddress] = useState(null);
	const [inputValue, setInputValue] = useState("");
	const [gifList, setGifList] = useState([]);

	/*
	 * This function holds the logic for deciding if a Phantom Wallet is
	 * connected or not
	 */
	const checkIfWalletIsConnected = async () => {
		try {
			const { solana } = window;
			if (solana) {
				if (solana.isPhantom) console.log("Phantom wallet is found!");
				// console.log(solana)

				// connecting website to wallet
				// const response = await solana.connect({ onlyIftrusted: true });
				// console.log(response.publicKey.toString());
			} else {
				alert("Solana object not found! Get a Phantom Wallet 👻");
			}
		} catch (error) {
			console.log(error.message);
		}
	};

	const connectWallet = async () => {
		const { solana } = window;
		if (solana) {
			const response = await solana.connect();
			if (response) {
				alert("Wallet connected");
				console.log(
					"Conneced to wallet with public key: ",
					response.publicKey.toString()
				);
				// log the objects of images of TEST_GIFS

				setWalletAddress(response.publicKey.toString());
			}
		}
	};

	// handle input change
	const onInputChange = (event) => {
		const { value } = event.target;
		setInputValue(value);
	};

	const sendGif = async () => {
		if (inputValue.length > 0) {
			console.log("Link: ", inputValue);
			setGifList([...gifList, inputValue]);
			setInputValue("");
		} else {
			alert("Please insert a link! 😑");
		}
	};

	const renderNotConnectedContainer = () => {
		return (
			<button
				className="connect-wallet-button cta-button"
				onClick={connectWallet}
				style={{ maxWidth: "30rem", marginInline: "auto" }}
			>
				Connect to Wallet! 🔌
			</button>
		);
	};

	const renderConnectedContainer = () => {
		return (
			<div className="connected-container">
				<form
					className="form-box"
					onSubmit={(event) => {
						event.preventDefault();
						sendGif();
					}}
				>
					<input
						type="text"
						placeholder="Enter GIF link"
						className="input-gif-link"
						value={inputValue}
						onChange={onInputChange}
					/>
					<button
						type="submit"
						className="cta-button submit-gif-button"
					>
						Add New
					</button>
				</form>
				<div className="gif-grid">
					{gifList.map((gif) => (
						// console.log(gif);
						<div className="gif-item" key={gif}>
							<img alt={gif} src={gif} loading="lazy" />
						</div>
					))}
				</div>
			</div>
		);
	};
	/*
	 * When our component first mounts, let's check to see if we have a connected
	 * Phantom Wallet
	 */
	useEffect(() => {
		const onLoad = async () => {
			await checkIfWalletIsConnected();
		};
		window.addEventListener("load", onLoad);
		return () => window.removeEventListener("load", onLoad);
	}, []);

	useEffect(() => {
		if (walletAddress) {
			console.log("Fetching GIF list...");
			// call solanan progs

			// set state
			setGifList(TEST_GIFS);
			console.log("Fetched!");
		}
	}, [walletAddress]);

	return (
		<div className="App">
			<div className={walletAddress ? "authed-container" : "container"}>
				<div className="header-container">
					<p className="header">🖼 GIF Portal</p>
					<p className="sub-text">
						View some of my GIF collection in the metaverse ✨
					</p>
				</div>
				{!walletAddress && renderNotConnectedContainer()}
				{walletAddress && renderConnectedContainer()}
				<div className="footer-container">
					<img
						alt="Twitter Logo"
						className="twitter-logo"
						src={twitterLogo}
					/>
					<a
						className="footer-text"
						href={TWITTER_LINK}
						target="_blank"
						rel="noreferrer"
					>{`Built by ${TWITTER_HANDLE}`}</a>
				</div>
			</div>
		</div>
	);
};

export default App;
