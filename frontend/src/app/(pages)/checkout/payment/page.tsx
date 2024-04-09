"use client";

import { useState, useEffect, useRef, useContext } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

// Axios
import api from "@/utils/api";

// Sweet Alert
import Swal from "sweetalert2";

// imagens estáticas

// Context
import { CheckoutContext } from "@/context/CheckoutContext";

// Icons
import {
	PaymentMethod,
	Coupon,
	IdCardH,
	ShoppingCartOne,
} from "@icon-park/react";
import {
	MdOutlineDeleteOutline,
	MdArrowBackIos,
	MdArrowForwardIos,
	MdOutlineCancel,
	MdOutlinePix,
} from "react-icons/md";
import { GrLocation } from "react-icons/gr";
import { HiOutlineCreditCard } from "react-icons/hi";
import { PiCreditCardBold } from "react-icons/pi";
import { BiIdCard } from "react-icons/Bi";
import { LiaShippingFastSolid } from "react-icons/lia";
import { FiInfo } from "react-icons/fi";
import { CiStickyNote } from "react-icons/ci";
import { PiNoteBold } from "react-icons/pi";
import { RiCopperCoinLine } from "react-icons/ri";
import { IoWalletOutline } from "react-icons/io5";
import { FaCheck } from "react-icons/fa";

// Components
import { YourOrderComp } from "@/components/YourOrderComp";
import { headers } from "next/headers";
import { toast } from "react-toastify";

function PaymentPage() {
	const [token] = useState(localStorage.getItem("token") || "");
	const { transportadoraInfo, setCart, setTransportadoraInfo } =
		useContext(CheckoutContext);

	const [productsInCart, setProductsInCart] = useState([]);
	// const [transportadoraInfo, setTransportadoraInfo] = useState([]);

	const router = useRouter();

	useEffect(() => {
		const savedProductsInCart = localStorage.getItem("productsInCart");
		if (savedProductsInCart) {
			setProductsInCart(JSON.parse(savedProductsInCart));
		}
	}, []);

	// async function handlePayment() {
	// 	try {
	// 		const groupedProducts = {};
	// 		// Agrupar produtos por partnerID
	// 		productsInCart.forEach((product) => {
	// 			if (!groupedProducts[product.partnerID]) {
	// 				groupedProducts[product.partnerID] = [];
	// 			}
	// 			groupedProducts[product.partnerID].push(product);
	// 		});

	// 		const responses = [];

	// 		// Iterar sobre os grupos de produtos e criar pedidos separados
	// 		for (const partnerID in groupedProducts) {
	// 			const productsData = groupedProducts[partnerID].map(
	// 				(product) => ({
	// 					productID: product.productID,
	// 					productName: product.productName,
	// 					productQuantity: product.quantityThisProduct,
	// 					productsCostTotal: product.productPriceTotal,
	// 					shippingCostTotal: 10,
	// 					paymentMethod: "OtakuPay",
	// 					itemsList: groupedProducts[partnerID].map((item) => ({
	// 						productID: item.productID,
	// 						productName: item.productName,
	// 						productQuantity: item.quantityThisProduct,
	// 					})),
	// 					shippingMethod: "Loggi",
	// 				})
	// 			);

	// 			// Enviar pedido para a API
	// 			const response = await api.post(
	// 				"/otakupay/buy-otamart",
	// 				{
	// 					productID: groupedProducts[partnerID][0].productID,
	// 					productName: groupedProducts[partnerID][0].productName,
	// 					productQuantity:
	// 						groupedProducts[partnerID][0].quantityThisProduct,
	// 					productsCostTotal:
	// 						groupedProducts[partnerID][0].productPriceTotal,
	// 					shippingCostTotal: 10, // Ou o valor real do frete, se aplicável
	// 					paymentMethod: "OtakuPay",
	// 					shippingMethod: "Loggi",
	// 					itemsList: productsData[0].itemsList,
	// 				},
	// 				{
	// 					headers: {
	// 						Authorization: `Bearer ${JSON.parse(token)}`,
	// 					},
	// 				}
	// 			);

	// 			responses.push(response);
	// 		}

	// 		// Limpar o localStorage após o pagamento ser aprovado
	// 		setCart(localStorage.removeItem("productsInCart"));
	// 		setTransportadoraInfo(
	// 			localStorage.removeItem("transportadoraInfo")
	// 		);

	// 		Swal.fire({
	// 			title: "Pagamento Realizado com Sucesso!",
	// 			width: 700,
	// 			text: "Agora é só aguardar o envio o/",
	// 			icon: "success",
	// 		});

	// 		router.push("/otamart");

	// 		// Tratar as respostas da API conforme necessário
	// 		responses.forEach((response) => {
	// 			console.log(response.data);
	// 		});
	// 	} catch (error: any) {
	// 		Swal.fire({
	// 			title: error.response.data.message,
	// 			width: 900,
	// 			text: "....",
	// 			icon: "error",
	// 		});
	// 		return error.response.data;
	// 	}
	// }

	async function handlePayment() {
		try {
			const productsList = productsInCart.map((product) => ({
				productID: product.productID,
				productName: product.productName,
				productQuantity: product.quantityThisProduct,
				partnerID: product.partnerID,
			}));

			const shippingCost = Object.values(transportadoraInfo).map(
				(info) => ({
					partnerID: info.partnerID,
					vlrFrete: info.vlrFrete,
					daysShipping: info.prazoEnt,
				})
			);

			const response = await api.post(
				"/otakupay/buy-otamart",
				{
					products: productsList,
					shippingCost: shippingCost,
				},
				{
					headers: {
						Authorization: `Bearer ${JSON.parse(token)}`,
					},
				}
			);

			// Limpar o localStorage após o pagamento ser aprovado
			localStorage.removeItem("productsInCart");
			localStorage.removeItem("transportadoraInfo");

			Swal.fire({
				title: "Pagamento Realizado com Sucesso!",
				width: 700,
				text: "Agora é só aguardar o envio o/",
				icon: "success",
			});

			router.push("/otamart");

			console.log(response.data);
		} catch (error) {
			console.log(error);
			// Swal.fire({
			// 	title: error.response.data.message,
			// 	width: 900,
			// 	text: "....",
			// 	icon: "error",
			// });
			// return error.response.data;
		}
	}

	return (
		<section className="grid grid-cols-6 md:grid-cols-8 grid-rows-1 gap-4 min-h-screen mx-4">
			<div className="bg-yellow-500 col-start-2 col-span-4 md:col-start-2 md:col-span-6 mt-4">
				<div className="flex flex-col justify-center mb-8">
					<ul className="flex steps steps-vertical lg:steps-horizontal mt-8 mb-8">
						<li className="step step-primary">
							<span className="flex flex-row items-center gap-1 bg-purple-500 py-1 px-2 rounded">
								<p>Carrinho</p> <ShoppingCartOne size={18} />
							</span>
						</li>
						<li className="step step-primary">
							<span className="flex flex-row items-center gap-1 bg-purple-500 py-1 px-2 rounded">
								<p>Entrega</p>
								<LiaShippingFastSolid size={18} />
							</span>
						</li>
						<li className="step step-primary">
							<span className="flex flex-row items-center gap-1 bg-purple-500 py-1 px-2 rounded">
								<p>Revisão</p> <BiIdCard size={20} />
							</span>
						</li>
						<li className="step step-primary">
							<span className="flex flex-row items-center gap-1 bg-purple-500 py-1 px-2 rounded">
								<p>Pagamento</p>
								<PiCreditCardBold size={20} />
							</span>
						</li>
					</ul>
				</div>
				<div className="flex flex-row justify-center gap-6 bg-yellow-500 col-start-2 col-span-4 md:col-start-2 md:col-span-6 mb-8">
					<div className="flex flex-col items-center">
						<div className="flex flex-row justify-between gap-4 bg-purple-500 w-[650px] min-h-[60px] p-4 rounded-md shadow mb-4">
							<div className="flex flex-row gap-4">
								<IoWalletOutline size={25} />
								<div>
									<h1 className="text-lg">OtakuPay</h1>
								</div>
							</div>
						</div>

						<div className="flex flex-col justify-between gap-4 bg-gray-500 w-[650px] min-h-[100px] p-4 rounded-md mb-4">
							<div className="flex flex-row gap-4">
								<div>
									<h1 className="text-lg">
										Escolha a forma de pagamento
									</h1>
								</div>
							</div>
							<div className="flex flex-row items-center gap-4">
								<button className="flex flex-row justify-center items-center gap-2 bg-purple-500 w-[200px] p-3 rounded-lg shadow-md cursor-pointer transition-all ease-linear active:scale-[.96]">
									<PaymentMethod size={20} />
									Saldo em Conta
								</button>
								<button className="flex flex-row justify-center items-center gap-2 bg-purple-500 w-[200px] p-3 rounded-lg shadow-md cursor-pointer transition-all ease-linear active:scale-[.96]">
									<PiCreditCardBold size={20} />
									Cartão de Crédito
								</button>
								<button className="flex flex-row justify-center items-center gap-2 bg-purple-500 w-[200px] p-3 rounded-lg shadow-md cursor-pointer transition-all ease-linear active:scale-[.96]">
									<MdOutlinePix size={20} />
									Pix
								</button>
								{/* <button className="flex flex-row justify-center items-center gap-2 bg-gray-300 w-[200px] p-3 rounded-lg cursor-not-allowed">
									<RiCopperCoinLine size={20} />
									Otaku Point
								</button> */}
							</div>
						</div>
					</div>

					<div className="flex flex-col">
						<YourOrderComp
							productsInfo={productsInCart}
							shippingInfo={transportadoraInfo}
						/>
					</div>
				</div>

				<div className="flex flex-row justify-center items-center gap-4">
					<button className="flex flex-row justify-center items-center gap-2 bg-error w-[120px] p-3 rounded-lg shadow-md cursor-pointer transition-all ease-linear active:scale-[.96]">
						<Link
							className="flex flex-row justify-center items-center gap-2"
							href="/otamart">
							<MdOutlineCancel size={20} />
							Cancelar
						</Link>
					</button>
					<button
						onClick={handlePayment}
						className="flex flex-row justify-center items-center gap-2 bg-green-800 w-[200px] p-3 rounded-lg shadow-md cursor-pointer transition-all ease-linear active:scale-[.96]">
						<FaCheck size={18} />
						Finalizar Pedido
					</button>
				</div>
			</div>
		</section>
	);
}

export default PaymentPage;
