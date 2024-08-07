"use client";

// Imports Essenciais
import { useState, useEffect, useContext } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";

// Axios
import api from "@/utils/api";

// Contexts
import { Context } from "@/context/UserContext";
import { CheckoutContext } from "@/context/CheckoutContext";

// Icons
import { ShoppingCartOne, PaymentMethod } from "@icon-park/react";
import { LiaShippingFastSolid } from "react-icons/lia";
import { GrLocation } from "react-icons/gr";
import { FiInfo } from "react-icons/fi";
import { LuCalendarClock } from "react-icons/lu";
import Link from "next/link";

function SideComponent() {
	const { id } = useParams();
	const [product, setProduct] = useState({});
	const [transportadoras, setTransportadoras] = useState([]);
	const [isCalculating, setIsCalculating] = useState(false);
	const [cepDestino, setCepDestino] = useState(""); // Estado para armazenar o valor do input
	const [selectedTransportadora, setSelectedTransportadora] = useState<{
		[key: string]: boolean;
	}>({});
	const stock = product.stock; // Constante que irá representar a quantidade de estoque que vem do Banco de Dados

	const { partners } = useContext(Context);
	const { setCart, setSubtotal } = useContext(CheckoutContext);

	const partner = partners.find(
		(partner) => partner._id === product.partnerID
	);
	const [token] = useState(localStorage.getItem("token") || "");
	const [user, setUser] = useState({});

	const partnerUFAddress =
		partner && partner.address.length > 0 ? partner.address[0].uf : "";
	const userUFAddress =
		user.address && user.address.length > 0 ? user.address[0].uf : "";

	useEffect(() => {
		api.get("/otakuprime/check-user", {
			headers: {
				Authorization: `Bearer ${JSON.parse(token)}`,
			},
		}).then((responser) => {
			setUser(responser.data);
		});
	}, [token]);

	useEffect(() => {
		const fetchProduct = async () => {
			try {
				const response = await api.get(`/products/${id}`);
				setProduct(response.data.product);
			} catch (error) {
				console.error("Error fetching product:", error);
			}
		};

		fetchProduct();
	}, [id]);

	// Valor a ser Exibido no Anúncio (Preço Original ou Promocional)
	const value =
		Number(product.promocionalPrice) > 0
			? Number(product.promocionalPrice)
			: Number(product.originalPrice);

	// Função para selecionar variações
	function handleSelected(
		transportadoraSimulacao,
		transportadoraId,
		transportadoraNome,
		transportadoraCNPJ,
		transportadoraLogo,
		transportadoraVlrFrete,
		transportadoraPrazoMin,
		transportadoraPrazoEnt,
		transportadoraDtPrevEntMin,
		transportadoraDtPrevEnt
	) {
		setSelectedTransportadora((prevState) => {
			const deselectedItems = Object.keys(prevState).reduce(
				(acc, key) => ({
					...acc,
					[key]:
						key === transportadoraSimulacao
							? !prevState[key]
							: false,
				}),
				{}
			);
			return {
				...deselectedItems,
				[transportadoraSimulacao]: !prevState[transportadoraSimulacao],
				id: transportadoraId,
				nome: transportadoraNome, // Adiciona o nome da transportadora ao estado
				cnpj: transportadoraCNPJ,
				logo: transportadoraLogo,
				vlrFrete: transportadoraVlrFrete,
				prazoMin: transportadoraPrazoMin,
				prazoEnt: transportadoraPrazoEnt,
				dtPrevEntMin: transportadoraDtPrevEntMin,
				dtPrevEnt: transportadoraDtPrevEnt,
			};
		});
	}

	// Lidando com a relação entre Quantidade e Subtotal baseado no valor do produto (Preço Original ou Promocional)
	// Etapa 1: Adicionando a variável de estado para a quantidade
	const [quantity, setQuantity] = useState<number>(1);
	const [isQuantityOneOrLess, setIsQuantityOneOrLess] = useState(true);
	const [isQuantityAtLimit, setIsQuantityAtLimit] = useState(false);
	const [totalOrder, setTotalOrder] = useState(value);

	// Etapa 2: Funções para lidar com incremento e decremento
	const updateTotalOrder = (newQuantity: number) => {
		setTotalOrder(value);

		setQuantity(newQuantity);

		if (newQuantity <= 1) {
			setIsQuantityOneOrLess(true);
		} else {
			setIsQuantityOneOrLess(false);
		}

		if (newQuantity === stock) {
			setIsQuantityAtLimit(true);
		} else {
			setIsQuantityAtLimit(false);
		}

		// Multiplicando o novo valor da quantidade pelo valor do produto
		setTotalOrder(newQuantity * value);
	};

	// Incremento de Quantidade (+1)
	const incrementarQuantidade = () => {
		if (quantity < stock) {
			updateTotalOrder(quantity + 1);
		}
	};

	// Decremento de Quantidade (-1)
	const decrementarQuantidade = () => {
		if (quantity > 1) {
			updateTotalOrder(quantity - 1);
		}
	};

	// Função para calculo do Subtotal dos produtos
	const renderPrice = () => {
		const priceToRender =
			Number(product.promocionalPrice) > 0
				? Number(product.promocionalPrice).toLocaleString("pt-BR", {
						style: "currency",
						currency: "BRL",
				  })
				: Number(product.originalPrice).toLocaleString("pt-BR", {
						style: "currency",
						currency: "BRL",
				  });
		return priceToRender;
	};

	function handleAddProductInCart(quantity, product, selectedTransportadora) {
		// Verifica se alguma transportadora foi selecionada
		const transportadoraSelecionada =
			selectedTransportadora &&
			Object.values(selectedTransportadora).some((value) => value);

		const transpFreeShipping = {
			id: 0,
			nome: "Free Shipping",
			prazoEnt: 3,
			vlrFrete: 0.0,
		};

		if (!transportadoraSelecionada && !product.freeShipping === true) {
			toast.info("Selecione uma opção de frete!");
			return; // Retorna para evitar a adição do produto ao carrinho sem transportadora selecionada
		}

		// Recupera os produtos já existentes no localStorage, se houver
		let productsInCart = localStorage.getItem("productsInCart");

		if (!productsInCart) {
			productsInCart = [];
		} else {
			productsInCart = JSON.parse(productsInCart);
		}

		// Calcula o preço do produto
		let productPrice;

		if (product.promocionalPrice && Number(product.promocionalPrice) > 0) {
			productPrice = Number(product.promocionalPrice);
		} else if (product.originalPrice && Number(product.originalPrice) > 0) {
			productPrice = Number(product.originalPrice);
		} else {
			// Se não houver nenhum preço válido, retorna um erro ou define como 0
			console.error("Preço do produto inválido:", product);
			return;
		}

		// Verifica se o produto já está no carrinho pelo ID
		const existingProduct = productsInCart.find(
			(p) => p.productID === product._id
		);

		if (existingProduct) {
			// Se o produto já estiver no carrinho, apenas atualiza a quantidade, limitando ao estoque disponível
			const totalQuantity =
				existingProduct.quantityThisProduct + quantity;
			existingProduct.quantityThisProduct = Math.min(
				totalQuantity,
				product.stock
			);

			// Verifica se a quantidade ultrapassou o estoque
			if (totalQuantity > product.stock) {
				toast.warning(
					"Você atingiu o limite de estoque para este produto!"
				);
			}

			// Atualiza o preço total do produto no carrinho multiplicando a quantidade pelo preço unitário
			existingProduct.productPriceTotal =
				existingProduct.quantityThisProduct * productPrice;
		} else {
			// Caso contrário, adiciona o novo produto ao array de produtos
			const newProduct = {
				partnerID: product.partnerID,
				productID: product._id,
				productName: product.productName,
				imageProduct: product.imagesProduct[0],
				quantityThisProduct: Math.min(quantity, product.stock),
				productPrice: productPrice,
				productPriceTotal:
					Math.min(quantity, product.stock) * productPrice, // Calcula o preço total do produto
				weight: product.weight,
				length: product.length,
				width: product.width,
				height: product.height,
				cepDestino: cepDestino,
				daysShipping: product.daysShipping,
				freeShipping: product.freeShipping,
				transportadora: transportadoraSelecionada
					? selectedTransportadora
					: transpFreeShipping,
			};
			console.log(newProduct);
			productsInCart.push(newProduct);
		}

		// Tenta armazenar o array de produtos no localStorage
		try {
			localStorage.setItem(
				"productsInCart",
				JSON.stringify(productsInCart)
			);
			// Atualiza o estado do carrinho com o total de produtos
			const totalQuantityProducts = productsInCart.reduce(
				(total, product) => total + product.quantityThisProduct,
				0
			);

			setCart(totalQuantityProducts);
			// Calcula o preço total do carrinho
			const totalCartValue = productsInCart.reduce(
				(total, product) => total + product.productPrice, // Soma os preços totais de cada produto
				0
			);
			// Define o subtotal como 0 se o carrinho estiver vazio
			const subtotal = productsInCart.length > 0 ? totalCartValue : 0;
			setSubtotal(subtotal);
			setTransportadoras([]);
		} catch (error) {
			console.log("Erro ao adicionar o produto ao carrinho!", error);
		}
	}

	// Função para Calcular o Frete
	async function handleSimulateShipping(cep: number) {
		setIsCalculating(true);

		let productPrice;

		if (product.promocionalPrice && Number(product.promocionalPrice) > 0) {
			// Se houver um preço promocional válido, use-o como preço do produto
			productPrice = Number(product.promocionalPrice);
		} else if (product.originalPrice && Number(product.originalPrice) > 0) {
			// Se não houver preço promocional válido, mas houver um preço original válido, use-o como preço do produto
			productPrice = Number(product.originalPrice);
		} else {
			// Se não houver nenhum preço válido, retorne um erro ou defina o preço como 0
			console.error("Preço do produto inválido:", product);
			return;
		}

		console.log(product);

		try {
			const response = await api.post("/products/simulate-shipping", {
				cepDestino: cep,
				weight: product.weight, // Adicione o peso do produto
				height: product.height, // Adicione a altura do produto
				width: product.width, // Adicione a largura do produto
				length: product.length, // Adicione o comprimento do produto
				productPrice: productPrice, // Adicione o preço unitário do produto
				productPriceTotal: productPrice * quantity, // Adicione o preço total do produto
				quantityThisProduct: quantity, // Adicione a quantidade do produto
			}); // Passar cep como parte do corpo da solicitação
			setTransportadoras(response.data);
			setIsCalculating(false);
		} catch (error) {
			console.error("Ocorreu um erro:", error);
		}
	}

	// Função para lidar com o clique no botão de Calculo de Frete
	const handleButtonClick = () => {
		handleSimulateShipping(cepDestino);
	};

	return (
		<div>
			{/* Componente Lateral D. */}
			<div className="flex flex-col w-[300px]">
				<div className="bg-white border-black border-solid border-[1px] border-opacity-20 rounded-lg shadow-md mb-2 mr-2">
					<div className="px-4 mb-2">
						<h1 className="text-black mb-1">Quantidade</h1>
						<div className="flex flex-row justify-between items-center mb-2">
							<div className="border border-black container w-[120px] rounded-md">
								<div className="flex flex-row justify-between items-center h-[36px]">
									<button
										className={`flex flex-row items-center ml-1 px-[10px] bg-primary transition-all ease-in duration-100 text-white hover:opacity-70 hover:bg-secondary active:scale-[.97] rounded-md ${
											isQuantityOneOrLess
												? "cursor-not-allowed"
												: "cursor-pointer"
										}`}
										onClick={decrementarQuantidade}>
										<span className="mb-1">-</span>
									</button>
									<input
										className="w-12 text-center text-black bg-gray-300 appearance-none"
										type="number"
										value={quantity}
										readOnly
									/>
									<button
										className={`flex flex-row items-center mr-1 px-[8px] bg-primary transition-all ease-in duration-100 text-white hover:opacity-70 hover:bg-secondary active:scale-[.97] rounded-md ${
											isQuantityAtLimit
												? "cursor-not-allowed"
												: "cursor-pointer"
										}`}
										onClick={incrementarQuantidade}>
										<span className="mb-1">+</span>
									</button>
								</div>
							</div>
							<div className="text-sm text-black">
								{`${stock} un disponíveis`}
							</div>
						</div>

						<div className="flex flex-row justify-between mb-2">
							<div className="font-semibold text-black">
								Subtotal
							</div>
							<div className="font-semibold text-black">
								{quantity === 1
									? renderPrice()
									: totalOrder.toLocaleString("pt-BR", {
											style: "currency",
											currency: "BRL",
									  })}
							</div>
						</div>

						<button
							className="btn btn-outline btn-primary w-full mb-2"
							onClick={() =>
								handleAddProductInCart(
									quantity,
									product,
									selectedTransportadora
								)
							}>
							<ShoppingCartOne size={18} />
							Adicionar ao Carrinho
						</button>
						<button
							className="btn btn-primary w-full mb-2"
							onClick={() =>
								handleAddProductInCart(
									quantity,
									product,
									selectedTransportadora
								)
							}>
							<Link
								className="flex flex-row items-center gap-2"
								href="/checkout/delivery">
								<PaymentMethod size={18} /> Comprar Agora
							</Link>
						</button>
						{/* Componentes pequenos */}
						{/* <div className="flex flex-row justify-center items-center">
							<div className="flex items-center text-sm hover:bg-slate-300 hover:opacity-20 px-2 py-1 gap-1 rounded cursor-pointer">
								<GrChat size={10} />
								<span>Chat</span>
							</div>
							|
							<div className="text-sm flex flex-row items-center hover:bg-slate-300 hover:opacity-20 px-2 py-1 gap-1 rounded cursor-pointer">
								<BsHeart size={10} />
								<span>Wishlist</span>
							</div>
							|
							<div className="text-sm flex flex-row justify-center items-center hover:bg-slate-300 hover:opacity-20 px-2 py-1 gap-1 rounded cursor-pointer">
								<GoShareAndroid size={13} />
								<span>Share</span>
							</div>
						</div> */}
					</div>
				</div>

				<div className="mr-2">
					{/* Etiqueta de Encomenda */}
					{product.preOrder === true ? (
						<div className="flex flex-row justify-center items-center bg-sky-500 p-2 gap-3 rounded-md shadow-md mb-2">
							<LuCalendarClock size={20} />
							<h1>
								Encomenda (envio em {product.daysShipping} dias)
							</h1>
						</div>
					) : (
						<></>
					)}
				</div>

				{/* Meios de envio/Frete */}
				<div className="bg-white flex flex-col border-black border-solid border-[1px] border-opacity-20 p-2 rounded-md shadow-md mr-2">
					<div>
						<div className="text-black flex flex-row items-center gap-2 mb-2">
							<GrLocation size={18} />
							<span className="text-sm">
								{partner &&
								partner.address &&
								partner.address.length > 0 ? (
									partner.address.map((end) => (
										<div key={end._id}>
											<div>{`Enviado de ${end.cidade}/${end.uf}`}</div>
										</div>
									))
								) : (
									<div>
										<span className="text-black">
											Cidade de origem Indefinida...
										</span>
									</div>
								)}
							</span>
						</div>

						{product.freeShipping === true &&
						partnerUFAddress === userUFAddress ? (
							<div className="flex flex-row justify-between items-center gap-2 mb-1">
								<div className="flex flex-row items-center text-black gap-2">
									<LiaShippingFastSolid size={24} />
									<span>Frete Grátis</span>
								</div>
								<div
									className="tooltip cursor-pointer text-black"
									data-tip="A transportadora será escolhida pela loja, de acordo com o melhor custo benefício!">
									<FiInfo
										className="animate-pulse"
										size={18}
									/>
								</div>
							</div>
						) : (
							<div>
								<h2 className="flex flex-row items-center text-black gap-2 mb-1">
									<LiaShippingFastSolid size={24} />
									<span>Meios de Envio</span>
								</h2>
								<div className="flex flex-row gap-2 mb-2">
									<input
										type="text"
										placeholder="Seu CEP"
										className="input w-full max-w-[180px]"
										value={cepDestino} // Valor do input é controlado pelo estado cepDestino
										onChange={(e) =>
											setCepDestino(e.target.value)
										} // Atualizar o estado cepDestino quando o valor do input mudar
									/>
									<button
										type="button"
										className="btn btn-primary w-[120px]"
										onClick={handleButtonClick}
										disabled={isCalculating} // Desabilitar o botão enquanto o cálculo estiver em andamento
									>
										{isCalculating ? (
											<div className="btn btn-primary w-[120px]">
												<span className="loading loading-spinner loading-xs"></span>
											</div>
										) : (
											"Calcular"
										)}
									</button>
								</div>
							</div>
						)}

						{transportadoras.length > 0 ? (
							transportadoras.map((transportadora) => (
								<div
									key={transportadora.idSimulacao}
									onClick={() =>
										handleSelected(
											transportadora.idSimulacao,
											transportadora.idTransp,
											transportadora.transp_nome,
											transportadora.cnpjTransp,
											transportadora.url_logo,
											transportadora.vlrFrete,
											transportadora.prazoEntMin,
											transportadora.prazoEnt,
											transportadora.dtPrevEntMin,
											transportadora.dtPrevEnt
										)
									}
									className={`${
										selectedTransportadora[
											transportadora.idSimulacao
										]
											? `bg-secondary border-solid text-white shadow-md`
											: "border-dashed"
									} hover:bg-secondary text-black hover:text-white transition-all ease-in duration-150 hover:border-solid border-[1px] border-primary rounded hover:shadow-md cursor-pointer p-2 mb-2`}>
									<div className="flex flex-row justify-between items-center gap-2 mb-1">
										<span>
											{transportadora.transp_nome}
										</span>
										<h2>
											{transportadora.tarifas.map(
												(tarifa, index) => (
													<h2 key={index}>
														{tarifa.valor.toLocaleString(
															"pt-BR",
															{
																style: "currency",
																currency: "BRL",
															}
														)}
													</h2>
												)
											)}
										</h2>
									</div>
									<div className="flex flex-row justify-between">
										<span className="text-sm">
											Prazo de entrega
										</span>
										<h2 className="text-sm">
											{`${
												product.daysShipping +
												transportadora.prazoEnt
											} dias`}
										</h2>
									</div>
								</div>
							))
						) : (
							<></>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}

export { SideComponent };
