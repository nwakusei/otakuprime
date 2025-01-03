"use client";

import { useState, useEffect, useContext } from "react";
import { useParams } from "next/navigation";
import api from "@/utils/api";
import Image from "next/image";
import { toast } from "react-toastify";

import "./storeId.css";

// Context
import { Context } from "@/context/UserContext";

// Icons
import { Peoples } from "@icon-park/react";
import {
	BsStar,
	BsBagHeart,
	BsBagCheck,
	BsBox2Heart,
	BsStarHalf,
	BsStarFill,
} from "react-icons/bs";
import { CgBox } from "react-icons/cg";
import { FiInfo } from "react-icons/fi";

// Components
import { ProductAdCard } from "@/components/ProductAdCard";
import { MiniCouponCard } from "@/components/MiniCouponCard";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import { LoadingPage } from "@/components/LoadingPageComponent";

function StorePage() {
	const [products, setProducts] = useState([]);
	const [coupons, setCoupons] = useState([]);
	const { partners } = useContext(Context);
	const [isLoading, setIsLoading] = useState(true);
	const { slug } = useParams();
	const [searchText, setSearchText] = useState("");
	const [searchedText, setSearchedText] = useState("");
	const [returnedProducts, setReturnedProducts] = useState([]);
	const [noResults, setNoResults] = useState(false); // Nova variável de estado

	const [user, setUser] = useState(null); // Inicializa como null
	const [token] = useState(() => localStorage.getItem("token") || "");

	const [buttonLoading, setbuttonLoading] = useState(false);
	const [followedStores, setFollowedStores] = useState([]);

	const [partner, setPartner] = useState({});

	useEffect(() => {
		// Verifica se `slug` já foi definido.
		if (!slug) return;

		const fetchData = async () => {
			try {
				// Faz o lookup para obter o ID correspondente à slug
				const response = await api.get(`/partners/convert/${slug}`);
				const id = response.data.id;

				// Encontra o parceiro com base no slug
				const foundPartner = partners.find((p) => p._id === id);

				if (!foundPartner) {
					console.log("Loja não encontrada!");
					setIsLoading(false);
					return;
				}

				// Atualiza o estado com o parceiro encontrado
				setPartner(foundPartner);

				// Busca os dados do usuário, se o token estiver presente
				const userPromise = token
					? api.get("/otakuprime/check-user", {
							headers: {
								Authorization: `Bearer ${JSON.parse(token)}`,
							},
					  })
					: Promise.resolve({ data: null }); // Se não estiver logado, retorna uma resposta "vazia" para o usuário

				// Busca os produtos e os cupons simultaneamente
				const [productsResponse, couponsResponse, userResponse] =
					await Promise.all([
						api.get(
							`/products/getall-products-store/${foundPartner._id}`
						),
						api.get(`/coupons/store-coupons/${foundPartner._id}`),
						userPromise,
					]);

				// Atualiza os estados com os dados obtidos
				setProducts(productsResponse.data.products);
				setCoupons(couponsResponse.data.coupons);

				// Se o usuário estiver logado, atualiza os dados do usuário
				if (userResponse.data) {
					setUser(userResponse.data);
				}
			} catch (error) {
				console.error("Erro ao buscar dados:", error);
			} finally {
				setIsLoading(false);
			}
		};

		setIsLoading(true); // Ativa o estado de carregamento antes de iniciar a busca
		fetchData();
	}, [slug, partners, token]);
	// Dependências adequadas: `id` e `partners`.

	const rating =
		partner?.rating > 0
			? `${(partner?.rating).toFixed(1)} (XX Notas)`
			: "N/A";
	const followers = partner?.followers;
	const totalProducts = partner?.totalProducts;
	const productsSold = partner?.productsSold;

	const renderPartnerRatingIcons = (partnerRating) => {
		// Convertendo a nota para número
		const rating = parseFloat(partnerRating);

		// Verificando se a nota é válida
		if (isNaN(rating) || rating < 0 || rating > 5) {
			// Retorna estrela vazia para valores inválidos
			return <BsStar size={18} />;
		}

		// Arredondando a nota para uma casa decimal
		const roundedRating = Math.round(rating * 10) / 10;

		// Determinando o tipo de estrela com base na nota
		if (roundedRating === 5.0) {
			return <BsStarFill size={18} />;
		} else if (roundedRating >= 0.5 && roundedRating < 5.0) {
			// Notas intermediárias (>= 0.5 e < 5.0) renderizam meia estrela
			return <BsStarHalf size={18} />;
		} else {
			// Notas menores que 0.5 renderizam estrela vazia
			return <BsStar size={18} />;
		}
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

	const handleSearch = async () => {
		// Verifica se há texto na pesquisa antes de fazer a requisição
		if (!searchText.trim()) {
			return; // Se não houver texto, não faz a requisição
		}

		setIsLoading(true);
		setNoResults(false);

		// Atualiza searchedText imediatamente
		setSearchedText(searchText);

		const fetchReturnedProduct = async () => {
			try {
				const response = await api.post(
					`/searches/search-store/${partner._id}`,
					{
						productTitle: searchText, // Envia o searchText no corpo da requisição
					}
				);
				if (response.data.products.length > 0) {
					setReturnedProducts(response.data.products);
				} else {
					setNoResults(true);
				}
			} catch (error: any) {
				if (error.response && error.response.status === 404) {
					setNoResults(true); // Define como true se o status for 404
				} else {
					console.error("Erro ao buscar o produto:", error);
				}
			} finally {
				setIsLoading(false);
			}
		};

		fetchReturnedProduct();
	};

	// Função para lidar com o pressionamento da tecla Enter
	const handleKeyDown = (e) => {
		if (e.key === "Enter") {
			handleSearch();
		}
	};

	const handleFollow = async () => {
		setbuttonLoading(true);
		try {
			const response = await api.post(
				`/customers/follow-store/${partner._id}`
			);

			setFollowedStores((prevStores) => [
				...prevStores,
				{ storeID: partner?._id },
			]);
			toast.success(response.data.message);
		} catch (error: any) {
			const errorMessage =
				error?.response?.data?.message || "Ocorreu um erro!";
			toast.error(errorMessage);
			console.warn("Erro ao seguir loja:", errorMessage); // Usar warn para mensagens informativas
		} finally {
			setbuttonLoading(false);
		}
	};

	const handleUnfollow = async () => {
		setbuttonLoading(true);
		try {
			await api.post(`/customers/unfollow-store/${partner._id}`);

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

	if (isLoading) {
		return <LoadingPage />;
	}

	return (
		<section className="min-h-screen bg-gray-100 grid grid-cols-6 md:grid-cols-8 grid-rows-1 gap-4">
			<div className="flex flex-col justify-center items-center col-start-2 col-span-4 md:col-start-2 md:col-span-6 mb-16">
				<div className="flex flex-col lg:flex-row gap-2 lg:gap-8 bg-white text-black w-[350px] lg:w-[1100px] min-h-[200px] p-4 mt-8 mb-8 rounded-md shadow-md select-none">
					{/* Card Store Info 1 */}
					<div className="flex flex-col gap-2">
						<div className="w-[300px] h-[150px] bg-pink-200 border border-black border-opacity-20 rounded-md overflow-hidden shadow-md">
							<Image
								className="object-contain w-full h-full pointer-events-none"
								src={`http://localhost:5000/images/partners/${partner?.logoImage}`}
								alt="Logo Shop"
								width={300}
								height={150}
								unoptimized
							/>
						</div>
						{buttonLoading ? (
							<button
								disabled
								className="button bg-[#daa520] hover:bg-[#CD7F32] active:scale-[.95] transition-all ease-in duration-200 px-10 py-1 rounded-md shadow-md flex items-center justify-center">
								<span className="loading loading-spinner loading-md"></span>
							</button>
						) : followedStores?.some(
								(store) => store.storeID === partner?._id
						  ) ? (
							<button
								// Função para deixar de seguir - não implementada ainda
								className="button w-[300px] h-[50px] follow bg-red-500 hover:bg-red-300 border-[1px] border-red-950 active:scale-[.95] transition-all ease-in duration-200 px-10 py-1 rounded-md shadow-md flex items-center justify-center relative">
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
								onClick={handleFollow}
								className="w-[300px] h-[50px] bg-violet-950 transition-all ease-in duration-100 hover:bg-black text-white rounded-md shadow-md flex items-center justify-center">
								Seguir Loja
							</button>
						)}
					</div>

					<div className="flex flex-col w-[230px]">
						{/* Titulo e Selo de verificado */}
						<div className="flex flex-row items-center gap-1 mb-4">
							<div className="text-lg font-semibold">
								{partner?.name}
							</div>
							{partner?.verifiedBadge !== "" && (
								<VerifiedBadge
									partnerVerifiedBadge={
										partner?.verifiedBadge
									}
								/>
							)}
						</div>
						{/* Card Store Info 2 */}
						<div className="flex flex-row items-center gap-2">
							<span>
								<CgBox size={18} />
								{/* <BsBox2Heart size={17} /> */}
							</span>
							<h1>Produtos: {totalProducts}</h1>
						</div>
						<div className="flex flex-row items-center gap-2">
							<span>
								<Peoples size={18} />
								{/* <BsPersonCheckFill size={20} /> */}
							</span>
							<h1>Seguidores: {followers}</h1>
						</div>
						<div className="flex flex-row items-center gap-2 mb-2">
							<span>{renderPartnerRatingIcons(rating)}</span>
							<h1>Avaliações: {rating}</h1>
						</div>
						<div className="flex flex-row items-center gap-2 mb-2">
							<span>
								{/* <BsBox2Heart size={18} /> */}
								<BsBagCheck size={18} />
								{/* <BsBagHeart size={18} /> */}
							</span>
							<h1>Produtos vendidos: {productsSold}</h1>
						</div>
					</div>
					<div className="border-r-[1px] border-r-black"></div>
					<div className="w-[450px]">
						<h1 className="mb-2">Sobre a loja:</h1>
						<p className="whitespace-pre-wrap">
							{partner?.description === ""
								? "Essa loja não possui descrição."
								: partner?.description}
						</p>
					</div>
				</div>

				{coupons && coupons.length > 0 && (
					<div className="flex flex-row justify-center gap-4 bg-white text-black w-[1100px] p-4 mb-8 flex-nowrap rounded-md shadow-md select-none">
						{/* Cupons de Desconto */}
						{coupons.map(
							(coupon: {
								_id: string;
								discountPercentage: number;
								couponCode: string;
							}) => (
								<MiniCouponCard
									key={coupon._id} // Aqui é onde a key é necessária, pois estamos iterando sobre cupons
									couponID={coupon._id}
									couponDiscount={coupon.discountPercentage}
									cupomCode={coupon.couponCode}
								/>
							)
						)}
					</div>
				)}

				<div className="flex felx-row items-center justify-center gap-3 bg-primary w-[300px] sm:w-[400px] md:sm:w-[600px] lg:w-[1100px] text-center text-xl md:text-2xl font-semibold py-2 mb-4 rounded-md shadow-md select-none">
					{!searchedText ? (
						<h1>Produtos da Loja</h1>
					) : (
						<span className="flex flex-row items-center gap-2 px-6 w-full">
							<FiInfo className="mt-[2px]" size={20} />
							<h1 className="truncate flex-1">
								Resultado da pesquisa para {`'${searchedText}'`}
							</h1>
						</span>
					)}
				</div>
				<div>
					<label className="input input-bordered input-primary flex items-center w-[262px] sm:w-[362px] md:sm:w-[562px] lg:w-[1072px] gap-2 mb-8">
						<input
							type="text"
							className="grow bg-base-100"
							placeholder="Pesquisar na Loja"
							value={searchText}
							onChange={(e) => setSearchText(e.target.value)}
							onKeyDown={handleKeyDown}
						/>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 16 16"
							fill="currentColor"
							className="h-4 w-4 opacity-70 cursor-pointer active:scale-[.97]"
							onClick={(e) => handleSearch(e)}>
							<path
								fillRule="evenodd"
								d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
								clipRule="evenodd"
							/>
						</svg>
					</label>
				</div>

				<div className="flex flex-row flex-wrap gap-4 justify-center">
					{noResults ? (
						<div className="min-h-screen">
							<p className="text-black text-center bg-white p-4 w-[500px] rounded-md shadow-md">
								Nenhum produto encontrado!
							</p>
						</div>
					) : returnedProducts.length > 0 ? (
						returnedProducts.map((returnedProduct) => {
							const partner = partners.find(
								(partner) =>
									partner._id === returnedProduct.partnerID
							);
							const cashback = partner ? partner.cashback : 0;

							return (
								<ProductAdCard
									key={`returned-${returnedProduct._id}`}
									viewAdultContent={user?.viewAdultContent}
									product={returnedProduct}
									freeShipping={returnedProduct.freeShipping}
									productImage={`http://localhost:5000/images/products/${returnedProduct.imagesProduct[0]}`}
									title={returnedProduct.productTitle}
									originalPrice={Number(
										returnedProduct.originalPrice
									)}
									promotionalPrice={Number(
										returnedProduct.promotionalPrice
									)}
									price={Number(
										returnedProduct.originalPrice
									)}
									promoPrice={Number(
										returnedProduct.promotionalPrice
									)}
									cashback={cashback}
									rating={returnedProduct.rating}
									quantitySold={
										partner.productsSold > 1
											? `${partner.productsSold} Vendidos`
											: `${partner.productsSold} Vendido`
									}
									linkProductPage={`/otamart/${returnedProduct.slugTitle}`}
								/>
							);
						})
					) : (
						products &&
						products.length > 0 &&
						products.map((product) => {
							const partner = partners.find(
								(partner) => partner._id === product.partnerID
							);
							const cashback = partner ? partner.cashback : 0;

							return (
								<ProductAdCard
									key={`product-${product._id}`}
									viewAdultContent={user?.viewAdultContent}
									product={product}
									freeShipping={product.freeShipping}
									productImage={`http://localhost:5000/images/products/${product.imagesProduct[0]}`}
									title={product.productTitle}
									originalPrice={Number(
										product.originalPrice
									)}
									promotionalPrice={Number(
										product.promotionalPrice
									)}
									price={Number(product.originalPrice)}
									promoPrice={Number(
										product.promotionalPrice
									)}
									cashback={cashback}
									rating={product.rating}
									quantitySold={
										product.productsSold > 1
											? `${product.productsSold} Vendidos`
											: `${product.productsSold} Vendido`
									}
									linkProductPage={`/otamart/${product.slugTitle}`}
								/>
							);
						})
					)}
				</div>
			</div>
		</section>
	);
}

export default StorePage;
