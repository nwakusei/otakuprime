"use client";

// Imports Essenciais
import { useState, useEffect, useContext } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { format } from "date-fns";

import Swal from "sweetalert2";
import { toast } from "react-toastify";

import slugify from "slugify";

import "./otamartId.css";

// Axios
import api from "@/utils/api";

// Contexts
import { Context } from "@/context/UserContext";

// Components
import { MainImageProductAdComponent } from "@/components/MainImageProductAdComponent";
import { ImageCarouselComponent } from "@/components/ImageCarouselComponent";
import { ProductVariation } from "@/components/ProductVariation";
import { SideComponent } from "@/components/SideComponent";
import { LoadingPage } from "@/components/LoadingPageComponent";

// Importe suas imagens e ícones aqui
import Amora from "../../../../../public/amora.jpg";
import imageProfile from "../../../../../public/Kon.jpg";

// Icons
import { Currency } from "@icon-park/react";
import { BsStar, BsStarHalf, BsStarFill } from "react-icons/bs";
import { MdVerified } from "react-icons/md";
import { ProductAdCard } from "@/components/ProductAdCard";

function ProductPage() {
	const { slug } = useParams();
	const [product, setProduct] = useState({});
	const [recommendedProducts, setRecommendedProducts] = useState([]);
	const [maximizedImageProduct, setMaximizedImageProduct] = useState(null);
	const [maximizedImage, setMaximizedImage] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [buttonLoading, setbuttonLoading] = useState(false);

	const [token] = useState(() => localStorage.getItem("token") || "");
	const [followedStores, setFollowedStores] = useState([]);

	const [loadingButtonId, setLoadingButtonId] = useState(null);

	const router = useRouter();

	const [selectedImage, setSelectedImage] = useState({
		type: "product", // 'product' ou 'variation'
		variationIndex: 0, // Índice da variação (por exemplo, cor ou tamanho)
		index: 0, // Índice da opção dentro da variação
	});

	const [selectedVariation, setSelectedVariation] = useState(0);

	// Função para alterar a imagem ao clicar em uma miniatura
	const handleThumbnailClick = (index) => {
		setSelectedImage({ type: "carousel", index });
	};

	const handleVariationClick = (variationIndex, index) => {
		setSelectedImage({ type: "variation", variationIndex, index });

		// Obtém a variação e opção selecionada com todos os dados, incluindo o preço
		const selectedVariation =
			product?.productVariations[variationIndex].options[index];

		// Atualiza o estado com a variação completa
		setSelectedVariation(selectedVariation); // Agora armazena a variação completa
	};

	// Função para buscar a lista de lojas seguidas
	const fetchFollowedStores = async () => {
		if (!token) return;

		try {
			const response = await api.get("/otakuprime/check-user", {
				headers: {
					Authorization: `Bearer ${JSON.parse(token)}`,
				},
			});
			setFollowedStores(response.data.followingStores);
		} catch (error) {
			console.error("Erro ao buscar lojas seguidas:", error);
		}
	};

	// Chama a função para buscar as lojas seguidas quando o componente é montado
	useEffect(() => {
		fetchFollowedStores();
	}, [token]);

	const { partners } = useContext(Context);

	const partner = partners.find(
		(partner) => partner._id === product.partnerID
	);

	// const handleOpenImagesProduct = (image) => {
	// 	setMaximizedImageProduct(image);
	// };

	// const handleCloseImagesProduct = () => {
	// 	setMaximizedImageProduct(null);
	// };

	// const handleOpen = (image) => {
	// 	setMaximizedImage(image);
	// };

	// const handleClose = () => {
	// 	setMaximizedImage(null);
	// };

	// Calcular a porcentagem de desconto
	const calculateDiscountPercentage = () => {
		if (product.originalPrice === 0 || product.promotionalPrice === 0) {
			return 0;
		}
		const discountPercentage =
			((product.originalPrice - product.promotionalPrice) /
				product.originalPrice) *
			100;
		return Math.round(discountPercentage);
	};

	const discountPercentage = calculateDiscountPercentage();

	useEffect(() => {
		if (!slug) return;

		const fetchProduct = async () => {
			try {
				// Faz o lookup para obter o ID correspondente à slug
				const response = await api.get(`/products/convert/${slug}`);

				const id = response.data.id;

				const responseProduct = await api.get(`/products/${id}`);

				setProduct(responseProduct.data.product);
			} catch (error) {
				console.error("Error fetching product:", error);
			} finally {
				setIsLoading(false);
			}
		};

		const fetchRecommendedProducts = async () => {
			try {
				// Faz o lookup para obter o ID correspondente à slug
				const response = await api.get(`/products/convert/${slug}`);

				const id = response.data.id;

				const responseRecommendedProduct = await api.get(
					`/products/recommended-product/${id}`
				);
				setRecommendedProducts(
					responseRecommendedProduct.data.recommendedProducts
				); // Certifique-se de usar a chave correta
			} catch (error) {
				console.error("Error fetching product:", error);
			}
		};

		fetchProduct();

		fetchRecommendedProducts();
	}, [slug]);

	// Função para renderizar os ícones de classificação com base no rating
	const renderRatingIcons = () => {
		// Arredonda o rating para a casa decimal mais próxima
		const roundedRating = Math.round(product.rating * 10) / 10;

		// Verifica se o roundedRating é igual a 0
		if (product.reviews == 0) {
			return (
				<>
					N/A {/* Renderiza "N/A" */}
					{/* Renderiza as 5 estrelas vazias */}
					{[...Array(5)].map((_, i) => (
						<BsStar key={`empty-${i}`} size={12} />
					))}
				</>
			);
		}

		const ratingIcons = [];

		// Adiciona o número correspondente ao rating antes das estrelas
		const formattedRating =
			roundedRating % 1 === 0 ? `${roundedRating}.0` : `${roundedRating}`;
		ratingIcons.push(
			<span key={`number-${formattedRating}`} className="mr-1">
				{formattedRating}
			</span>
		);

		// Adiciona ícones de estrela com base no rating arredondado
		for (let i = 0; i < Math.floor(roundedRating); i++) {
			ratingIcons.push(<BsStarFill key={`star-${i}`} size={12} />);
		}

		// Se houver uma parte decimal maior que 0, adiciona um ícone de estrela metade preenchido
		if (roundedRating % 1 !== 0) {
			ratingIcons.push(<BsStarHalf key="half" size={12} />);
		}

		// Preenche o restante dos ícones com estrelas vazias
		const remainingIcons = 5 - Math.ceil(roundedRating);
		for (let i = 0; i < remainingIcons; i++) {
			ratingIcons.push(<BsStar key={`empty-${i}`} size={12} />);
		}

		return ratingIcons;
	};

	const renderReviewRatingIcons = (reviewRating) => {
		// Convertendo a string da nota para número
		const rating = parseFloat(reviewRating);

		// Verificando se a nota é um número válido entre 0 e 5
		if (!isNaN(rating) && rating >= 0 && rating <= 5) {
			// Arredondando a nota para a casa decimal mais próxima
			const roundedRating = Math.round(rating * 10) / 10;

			// Array para armazenar os ícones de estrelas
			const ratingIcons = [];

			// Verifica se a nota é um número inteiro e adiciona ".0"
			const formattedRating = Number.isInteger(roundedRating)
				? `${roundedRating}.0`
				: `${roundedRating}`;

			// Adicionando o número correspondente à nota antes das estrelas
			ratingIcons.push(
				<span key={`number-${formattedRating}`} className="mr-1">
					{formattedRating}
				</span>
			);

			// Adicionando ícones de estrela com base na nota arredondada
			for (let i = 0; i < Math.floor(roundedRating); i++) {
				ratingIcons.push(<BsStarFill key={`star-${i}`} size={12} />);
			}

			// Se houver uma parte decimal maior que 0, adiciona um ícone de estrela metade preenchido
			if (roundedRating % 1 !== 0) {
				ratingIcons.push(<BsStarHalf key="half" size={12} />);
			}

			// Preenchendo o restante dos ícones com estrelas vazias
			const remainingIcons = 5 - Math.ceil(roundedRating);
			for (let i = 0; i < remainingIcons; i++) {
				ratingIcons.push(<BsStar key={`empty-${i}`} size={12} />);
			}

			return ratingIcons;
		} else {
			// Se a nota for 0, renderiza "0.0" com 5 estrelas vazias
			if (rating === 0) {
				const formattedRating = "0.0";
				const ratingIcons = [];

				ratingIcons.push(
					<span key={`number-${formattedRating}`} className="mr-1">
						{formattedRating}
					</span>
				);

				for (let i = 0; i < 5; i++) {
					ratingIcons.push(<BsStar key={`empty-${i}`} size={12} />);
				}

				return ratingIcons;
			} else {
				return <span>N/A</span>;
			}
		}
	};

	const handleFollow = async () => {
		if (!slug) return;

		setbuttonLoading(true);

		try {
			// Faz o lookup para obter o ID correspondente à slug
			const response = await api.get(`/products/convert/${slug}`);

			const id = response.data.id;

			// Simula a chamada API para seguir a loja
			await api.post(`/customers/follow-store/${id}`);

			// Atualiza o estado local para refletir a nova lista de lojas seguidas
			setFollowedStores((prevStores) => [
				...prevStores,
				{ storeID: partner?._id },
			]);
		} catch (error: any) {
			console.error("Erro ao seguir a loja:", error);
		} finally {
			setbuttonLoading(false);
		}
	};

	const handleUnfollow = async () => {
		if (!slug) return;

		setbuttonLoading(true);

		try {
			// Faz o lookup para obter o ID correspondente à slug
			const response = await api.get(`/products/convert/${slug}`);

			const id = response.data.id;

			await api.post(`/customers/unfollow-store/${id}`);

			// Remove a loja da lista de seguidos
			setFollowedStores(
				(prevStores) =>
					prevStores.filter((store) => store.storeID !== partner?._id) // Remove a loja
			);
		} catch (error) {
			console.error("Erro ao deixaar de seguir a loja:", error);
		} finally {
			setbuttonLoading(false);
		}
	};

	const handleClick = (slug) => {
		setLoadingButtonId(slug); // Define o ID do pedido que está carregando

		if (partner.nickname === slug) {
			setTimeout(() => {
				router.push(`/otamart/store/${slug}`);
			}, 2000); // O tempo pode ser ajustado conforme necessário
		}
	};

	if (isLoading) {
		return <LoadingPage />;
	}

	return (
		<section className="bg-gray-100 grid grid-cols-6 md:grid-cols-8 grid-rows-1 gap-4">
			<div className="flex flex-col bg-white p-4 rounded-md shadow-md col-start-2 col-span-4 md:col-start-2 md:col-span-6 mt-8">
				<div className="flex flex-row justify-between">
					{/* Componente para a imagem principal */}
					<MainImageProductAdComponent
						selectedImage={selectedImage}
						product={product}
					/>

					{/* Componente intermediário */}
					<div className="flex flex-col w-[350px]">
						{/* <span className="text-sm">{product?.condition}</span> */}
						{/* Título */}
						<h1 className="text-xl font-semibold text-black mb-1">
							{product?.productTitle}
						</h1>
						{/* Avaliações e Vendidos */}
						<div className="flex flex-row text-sm text-black mb-4 gap-1">
							<div className="flex items-center gap-1 text-yellow-500">
								{/* Contêiner flexível para os ícones */}
								{renderRatingIcons()}
							</div>
							<span>|</span>
							<div>
								{product?.reviews &&
								Array.isArray(product?.reviews) &&
								product?.reviews.length === 0
									? "Nenhuma Avaliação"
									: product?.reviews &&
									  Array.isArray(product?.reviews) &&
									  product?.reviews.length === 1
									? "1 Avaliação"
									: product?.reviews &&
									  Array.isArray(product?.reviews)
									? `${product?.reviews.length} Avaliações`
									: "0 Avaliações"}
							</div>
							<span>|</span>
							<div>
								{product?.productsSold > 1
									? `${product?.productsSold} Vendidos`
									: `${product?.productsSold} Vendido`}
							</div>
						</div>

						{/* Preço */}
						{product?.productVariations?.length > 0 ? (
							<div>
								{/* Renderiza as variações */}
								{product.productVariations.map(
									(variation, index) => {
										const prices = variation.options.map(
											(option) => ({
												original: option.originalPrice,
												promo: option.promotionalPrice,
											})
										);

										// Calcula valores para exibição e riscado
										const promotionalPrices = prices
											.filter((p) => p.promo > 0)
											.map((p) => p.promo);
										const originalPricesWithPromo = prices
											.filter((p) => p.promo > 0)
											.map((p) => p.original);

										const displayedPrices = prices.map(
											(p) =>
												p.promo > 0
													? p.promo
													: p.original
										);
										const lowestPrice = Math.min(
											...displayedPrices
										);
										const highestPrice = Math.max(
											...displayedPrices
										);

										const lowestOriginalPriceWithPromo =
											Math.min(
												...originalPricesWithPromo
											);
										const highestOriginalPriceWithPromo =
											Math.max(
												...originalPricesWithPromo
											);

										return (
											<div
												key={index}
												className="flex flex-col my-2">
												{/* Exibição de preços */}
												<div>
													{promotionalPrices.length >
													0 ? (
														<h2 className="text-2xl text-primary font-semibold">
															{`${Number(
																lowestPrice
															).toLocaleString(
																"pt-BR",
																{
																	style: "currency",
																	currency:
																		"BRL",
																}
															)} - ${Number(
																highestPrice
															).toLocaleString(
																"pt-BR",
																{
																	style: "currency",
																	currency:
																		"BRL",
																}
															)}`}
														</h2>
													) : (
														<h2 className="text-2xl text-primary font-semibold">
															{`${Number(
																lowestPrice
															).toLocaleString(
																"pt-BR",
																{
																	style: "currency",
																	currency:
																		"BRL",
																}
															)} - ${Number(
																highestPrice
															).toLocaleString(
																"pt-BR",
																{
																	style: "currency",
																	currency:
																		"BRL",
																}
															)}`}
														</h2>
													)}
												</div>
												{/* Exibição de valores riscados, só se houver 2 ou mais promoções */}
												{promotionalPrices.length >
													1 && (
													<div className="flex flex-row items-center mb-2">
														<span className="text-base text-black line-through mr-2">
															{`${Number(
																lowestOriginalPriceWithPromo
															).toLocaleString(
																"pt-BR",
																{
																	style: "currency",
																	currency:
																		"BRL",
																}
															)} - ${Number(
																highestOriginalPriceWithPromo
															).toLocaleString(
																"pt-BR",
																{
																	style: "currency",
																	currency:
																		"BRL",
																}
															)}`}
														</span>
													</div>
												)}
												{/* Exibição de valores riscados, se houver apenas uma promoção */}
												{promotionalPrices.length ===
													1 && (
													<div className="flex flex-row items-center mb-2">
														<span className="text-base text-black line-through mr-2">
															{`${Number(
																originalPricesWithPromo[0]
															).toLocaleString(
																"pt-BR",
																{
																	style: "currency",
																	currency:
																		"BRL",
																}
															)}`}
														</span>
													</div>
												)}
											</div>
										);
									}
								)}
							</div>
						) : (
							<div>
								{/* Renderiza o preço do produto principal caso não existam variações */}
								{product?.promotionalPrice > 0 ? (
									<div>
										<h2 className="text-2xl text-primary font-semibold">
											{Number(
												product?.promotionalPrice
											).toLocaleString("pt-BR", {
												style: "currency",
												currency: "BRL",
											})}
										</h2>
										<div className="flex flex-row items-center mb-2">
											<span className="text-base text-black line-through mr-2">
												{Number(
													product?.originalPrice
												).toLocaleString("pt-BR", {
													style: "currency",
													currency: "BRL",
												})}
											</span>
										</div>
									</div>
								) : (
									<h2 className="text-2xl text-primary font-semibold">
										{Number(
											product?.originalPrice
										).toLocaleString("pt-BR", {
											style: "currency",
											currency: "BRL",
										})}
									</h2>
								)}
							</div>
						)}

						{/* Cashback */}
						{partner && (
							<div className="flex flex-row items-center mb-4">
								<span>
									<p className="flex flex-row items-center gap-2 text-center text-sm text-green-500 mb-2">
										<Currency size={18} />{" "}
										{`${partner?.cashback}% de Cashback`}
									</p>
								</span>
							</div>
						)}

						{/* Variações */}
						<ProductVariation
							variations={product?.productVariations}
							handleVariationClick={handleVariationClick}
							// selectedImage={selectedImage}
						/>
					</div>
					{/* Componente Lateral D. */}
					<SideComponent selectedVariation={selectedVariation} />
				</div>
				{/* Componente para as miniaturas */}
				<ImageCarouselComponent
					product={product}
					handleThumbnailClick={handleThumbnailClick}
					selectedImage={selectedImage}
				/>
			</div>

			{/* Descrição do produto*/}
			<div className="bg-white gap-8 col-start-2 col-span-4 md:col-start-2 md:col-span-6 rounded-md shadow-md">
				{/* Descrição e Detalhes */}
				<div className="flex flex-col justify-center items-center">
					<h1 className="w-full bg-primary text-center text-xl py-2 rounded-t-md select-none">
						Descrição e Detalhes do Produto
					</h1>
					<p className="text-black whitespace-pre-wrap break-words max-w-full py-2 px-4 mb-2">
						{product?.description}
					</p>
				</div>
			</div>

			{/* Informações da Loja */}
			<div className="bg-white flex flex-col gap-8 col-start-2 col-span-4 md:col-start-2 md:col-span-6 rounded-md shadow-md">
				<div className="w-full p-4 select-none">
					{/* Logo da Loja */}
					{partner && (
						<div className="flex flex-row gap-4">
							<div className="w-[260px] h-[130px] bg-pink-200 border-solid border-[1px] border-black border-opacity-20 rounded-md overflow-hidden shadow-md">
								<Image
									className="object-contain w-full h-full pointer-events-none"
									src={`http://localhost:5000/images/partners/${partner?.logoImage}`}
									alt="Logo Shop"
									width={260}
									height={130}
									unoptimized
								/>
							</div>
							<div className="flex flex-col">
								<div className="flex flex-row items-center gap-1 font-semibold text-lg">
									<h1 className="text-black">
										{partner?.name}
									</h1>
									{/* <div className="relative group inline-block">
										<MdVerified
											className="text-blue-500 cursor-pointer"
											size={18}
										/>
										<div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-primary text-white text-sm rounded shadow-lg">
											<div className="flex items-center">
												<svg
													xmlns="http://www.w3.org/2000/svg"
													fill="none"
													viewBox="0 0 24 24"
													stroke="currentColor"
													className="w-5 h-5 mr-2">
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth="2"
														d="M5 13l4 4L19 7"
													/>
												</svg>
												<span>Selo Azul:</span>
											</div>
											<p>
												Conta verificada desde Janeiro
												de 2024.
											</p>
										</div>
									</div> */}

									<div className="relative inline-block mt-[2px]">
										<div className="group">
											{/* Icone Visível no Client Side  */}
											<MdVerified
												className="text-ametista cursor-pointer"
												size={17}
											/>
											{/* Tooltip */}
											<div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 w-64 p-2 opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition duration-300 border-[1px] border-black bg-white text-black text-sm rounded shadow-lg pointer-events-none">
												<div className="flex flex-row items-center gap-2">
													<MdVerified
														className="text-ametista"
														size={18}
													/>
													<span>Selo Ametista</span>
												</div>
												<p className="ml-[25px]">
													Loja com mais de 500 vendas
												</p>
												<p className="ml-[25px]">
													Conta verificada
												</p>
											</div>
										</div>
									</div>

									{/* Bronze */}
									<MdVerified
										className="text-[#CD7F32]"
										size={18}
									/>

									{/* Prata 1 */}
									<MdVerified
										className="text-[#C0C0C0]"
										size={18}
									/>

									{/* Prata 2 */}
									{/* <MdVerified
										className="text-[#9a9a9a]"
										size={18}
									/> */}

									{/* Dourado */}
									<MdVerified
										className="text-[#daa520]"
										size={18}
									/>

									{/* Pérola */}
									<MdVerified
										className="text-[#EAE0C8]"
										size={18}
									/>

									{/* Obsidiana */}
									<MdVerified
										className="text-[#0B0B0B]"
										size={18}
									/>

									{/* Ametista */}
									<MdVerified
										className="text-[#9966CC]"
										size={18}
									/>

									{/* Esmeralda */}
									<MdVerified
										className="text-[#50C878]"
										size={18}
									/>
									{/* Safira */}
									<MdVerified
										className="text-[#0F52BA]"
										size={18}
									/>
									{/* Rubi */}
									<MdVerified
										className="text-[#E0115F]"
										size={18}
									/>
								</div>
								<div className="flex flex-row items-center">
									<BsStarFill
										className="text-yellow-400"
										size={14}
									/>
									<span className="text-black ml-1 mr-2">
										5.0
									</span>{" "}
									<span className="text-black mb-1">|</span>
									<span className="text-black ml-2">
										{`${partner?.followers} Seguidores`}
									</span>
								</div>
								<div className="flex flex-row gap-4">
									<div className="mt-1">
										{buttonLoading ? (
											<button
												disabled
												className="button bg-[#daa520] hover:bg-[#CD7F32] active:scale-[.95] transition-all ease-in duration-200 w-[150px] px-10 py-1 rounded-md shadow-md flex items-center justify-center">
												<span className="loading loading-spinner loading-md"></span>
											</button>
										) : followedStores?.some(
												(store) =>
													store.storeID ===
													partner?._id
										  ) ? (
											<button
												// Função para deixar de seguir - não implementada ainda
												className="button follow bg-red-500 hover:bg-red-300 border-[1px] border-red-950 active:scale-[.95] transition-all ease-in duration-200 w-[150px] px-10 py-1 rounded-md shadow-md flex items-center justify-center relative">
												<span className="text-following">
													Deixar de seguir
												</span>
												<span
													onClick={handleUnfollow}
													className="text-follow">
													Seguindo
												</span>
											</button>
										) : (
											<button
												onClick={handleFollow} // Função para seguir
												className="button follow bg-[#daa520] hover:bg-[#CD7F32] active:scale-[.95] transition-all ease-in duration-200 w-[150px] px-10 py-1 rounded-md shadow-md flex items-center justify-center relative">
												Seguir
											</button>
										)}
									</div>
									<div className="mt-1">
										{/* <button className="text-black hover:text-white border border-solid border-primary hover:bg-primary active:scale-[.95] transition-all ease-in duration-200 h-[36px] px-10 py-1 rounded-md hover:shadow-md">
											<Link
												href={`/otamart/store/${partner._id}`}>
												Ver Loja
											</Link>
										</button> */}

										{loadingButtonId ===
										partner.nickname ? (
											<button className="flex items-center justify-center text-black hover:text-white border border-solid border-primary hover:bg-primary active:scale-[.95] transition-all ease-in duration-200 w-[150px] h-[36px] px-10 py-1 rounded-md hover:shadow-md">
												{/* <span className="loading loading-spinner loading-md"></span> */}
												<span className="loading loading-dots loading-md"></span>
											</button>
										) : (
											<button
												onClick={() =>
													handleClick(
														partner.nickname
													)
												} // Passa o ID do pedido
												className="flex items-center justify-center text-black hover:text-white border border-solid border-primary hover:bg-primary active:scale-[.95] transition-all ease-in duration-200 w-[150px] h-[36px] px-10 py-1 rounded-md hover:shadow-md">
												Ver Loja
											</button>
										)}
									</div>
								</div>
							</div>
							<div className="border border-y-[1px] border-black"></div>
							<div className="flex flex-col justify-center">
								<div>
									<span className="text-black">
										Avaliações: 5.1mil
									</span>
								</div>
								<div>
									<span className="text-black">
										Produtos: 2.3mil
									</span>
								</div>
								<div className="mt-3 opacity-0">
									<button className="text-black hover:text-white border border-solid cursor-default border-primary hover:bg-primary active:scale-[.95] transition-all ease-in duration-200 h-[36px] px-10 py-1 rounded-md hover:shadow-md">
										{/* <Link
											href={`/otamart/store/${partner._id}`}>
											Ver Loja
										</Link> */}
									</button>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>

			{/* Avaliações*/}
			<div className="bg-white flex flex-col gap-8 col-start-2 col-span-4 md:col-start-2 md:col-span-6 rounded-md shadow-md">
				<div className="w-full border-opacity-50">
					<div className="flex flex-col">
						<div className="flex flex-col justify-center items-center mb-6">
							<h1 className="w-full bg-primary text-center text-xl py-2 rounded-t-md shadow-md select-none">
								Avaliações do Produto
							</h1>
						</div>
						{/* Avaliação por Usuário*/}
						{product?.reviews && product?.reviews.length > 0 ? (
							product?.reviews.map((item, index) => (
								<div key={index} className="-mt-2">
									<div className="flex flex-row gap-2 text-black mb-1 ml-4">
										<div className="avatar">
											<div className="w-16 h-16 rounded-full">
												<Image
													src={imageProfile}
													alt="imageProfile"
												/>
											</div>
										</div>

										<div className="flex flex-col">
											<div>
												{/* Avaliações e Vendidos */}
												<h1 className="text-sm">
													{item?.customerName}
												</h1>
												<div className="flex flex-row items-center text-sm">
													<span className="flex flex-row items-center gap-1">
														<p className="flex flex-row items-center gap-1 mr-1 text-sm text-yellow-500">
															{renderReviewRatingIcons(
																item?.reviewRating
															)}
														</p>
													</span>
												</div>
												<h3 className="text-xs mb-2">
													{item?.date
														? format(
																new Date(
																	item?.date
																),
																"dd/MM/yyyy - HH:mm"
														  ) + " hs"
														: ""}
												</h3>
												<p className="text-base mb-2">
													{item?.reviewDescription}
												</p>
											</div>

											{/* Fotos das avaliações */}
											<div className="flex flex-row gap-2 mb-2">
												<div>
													{/* Renderizar imagens em miniatura */}
													<div className="flex flex-row gap-2 mb-2">
														{item?.imagesReview &&
															item?.imagesReview.map(
																(image, id) => (
																	<div
																		key={id}
																		className="bg-base-100 w-[74px] rounded relative shadow-lg">
																		<div className="h-[74px] flex items-center justify-center">
																			<Image
																				className="object-contain h-full cursor-pointer"
																				src={`http://localhost:5000/images/reviews/${image}`}
																				alt="Shoes"
																				width={
																					55
																				}
																				height={
																					55
																				}
																				unoptimized
																				onClick={() =>
																					handleOpen(
																						image
																					)
																				}
																			/>
																		</div>
																	</div>
																)
															)}
													</div>

													{/* Renderizar imagem maximizada se existir */}
													{maximizedImage && (
														<div className="fixed inset-0 z-50 overflow-auto flex items-center justify-center">
															<div className="relative max-w-full max-h-full">
																<Image
																	className="object-contain max-w-full max-h-full rounded-md"
																	src={`http://localhost:5000/images/reviews/${maximizedImage}`}
																	alt="Maximized Image"
																	width={400}
																	height={200}
																	unoptimized
																/>
																<button
																	className="absolute top-4 right-4 bg-error px-3 py-1 rounded shadow-md text-white"
																	onClick={
																		handleClose
																	}>
																	✕
																</button>
															</div>
														</div>
													)}
												</div>
											</div>
										</div>
									</div>
									<hr className="mx-2" /> <br />
								</div>
							))
						) : (
							<div>
								<div className="text-center text-black mb-2">
									Esse produto ainda não possui avaliações!
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
			{/* Produtos Recomendados */}
			<div className="gap-8 col-start-2 col-span-4 md:col-start-2 md:col-span-6 mb-8">
				{/* Descrição e Detalhes*/}
				<div className="flex flex-col justify-center items-center">
					<h1 className="w-full bg-primary text-center text-xl py-2 rounded-md select-none mb-4">
						Produtos Recomendados
					</h1>
					<div className="flex flex-row flex-wrap gap-4 justify-center">
						{recommendedProducts.length > 0 &&
							recommendedProducts.map((recommendedProduct) => {
								// Encontrar o parceiro correspondente com base no partnerID do produto
								const partner = partners.find(
									(partner) =>
										partner._id ===
										recommendedProduct.partnerID
								);

								// Obter o cashback do parceiro, se existir
								const cashback = partner ? partner.cashback : 0;

								return (
									<ProductAdCard
										key={recommendedProduct._id}
										product={recommendedProduct}
										freeShipping={
											recommendedProduct.freeShipping
										}
										productImage={`http://localhost:5000/images/products/${recommendedProduct.imagesProduct[0]}`}
										title={recommendedProduct.productTitle}
										originalPrice={Number(
											recommendedProduct.originalPrice
										)}
										promotionalPrice={Number(
											recommendedProduct.promotionalPrice
										)}
										price={Number(
											recommendedProduct.originalPrice
										)}
										promoPrice={Number(
											recommendedProduct.promotionalPrice
										)}
										cashback={cashback} // Passar o cashback para o componente ProductAdCard
										rating={recommendedProduct.rating}
										quantitySold={
											recommendedProduct.productsSold > 1
												? `${recommendedProduct.productsSold} Vendidos`
												: `${recommendedProduct.productsSold} Vendido`
										}
										linkProductPage={`/otamart/${recommendedProduct.slugTitle}`}
									/>
								);
							})}
					</div>
				</div>
			</div>
		</section>
	);
}

export default ProductPage;
