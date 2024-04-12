"use client";

// Imports Essenciais
import { useState, useEffect } from "react";
import Image from "next/image";
import { toast } from "react-toastify";

// Axios
import api from "@/utils/api";

// Contexts
import { Context } from "@/context/UserContext";
import { CheckoutContext } from "@/context/CheckoutContext";

// Icons
import { FiInfo } from "react-icons/fi";
import { Coupon } from "@icon-park/react";

function YourOrderComp({ productsInfo, shippingInfo }) {
	const [totalPedido, setTotalPedido] = useState(0);
	const [applyCupom, setAplyCupom] = useState(0);
	const [cupomCode, setCupomCode] = useState("");

	useEffect(() => {
		const calcularTotalPedido = () => {
			let subtotal = productsInfo.reduce(
				(total, productInCart) =>
					total + productInCart.productPriceTotal,
				0
			);

			let frete = calculateTotalFrete();

			// Calcula o total do pedido (subtotal + frete)
			let total = subtotal + frete - applyCupom;
			setTotalPedido(total < 0 ? 0 : total);
		};

		calcularTotalPedido();
	}, [productsInfo, shippingInfo, applyCupom]);

	const calculateTotalFrete = () => {
		let totalFrete = 0;

		if (shippingInfo) {
			Object.values(shippingInfo).forEach((info) => {
				totalFrete += info.vlrFrete || 0;
			});
		}

		return totalFrete;
	};

	const aplicarCupom = async () => {
		try {
			const cupomResponse = await api.get("/coupons/allcoupons");
			const cupons = cupomResponse.data.coupons;

			const cupomInfo = cupons.find(
				(cupom) => cupom.couponCode === cupomCode
			);

			if (cupomInfo) {
				const produtosComPartnerIDCorreto = productsInfo.map(
					(product) => {
						if (product.partnerID === cupomInfo.partnerID) {
							const descontoPercentual =
								cupomInfo.discountPercentage / 100;
							const desconto =
								product.productPriceTotal * descontoPercentual;
							product.productPriceTotal -= desconto;
							return product;
						}
						return product;
					}
				);

				localStorage.setItem(
					"productsInCart",
					JSON.stringify(produtosComPartnerIDCorreto)
				);

				setAplyCupom(cupomInfo.discountPercentage);

				toast.success("Cupom aplicado com sucesso!");
			} else {
				toast.error("Cupom inválido!");
			}
		} catch (error) {
			toast.error(
				"Erro ao aplicar cupom. Por favor, tente novamente mais tarde."
			);
		}
	};

	return (
		<>
			{productsInfo.length > 0 && (
				<div>
					<div className="flex flex-col w-[400px] min-h-[250px] bg-gray-500 p-4 rounded-md mb-2">
						<div>
							<h1 className="text-lg font-semibold mb-4">
								Seu Pedido
							</h1>
							{productsInfo.map((productInCart) => (
								<div
									key={productInCart.productID}
									className="flex justify-between mb-2">
									<h2>
										{productInCart.quantityThisProduct} x{" "}
										{productInCart.productName}
									</h2>
									<h2>
										{productInCart.productPrice.toLocaleString(
											"pt-BR",
											{
												style: "currency",
												currency: "BRL",
											}
										)}
									</h2>
								</div>
							))}
						</div>

						<div className="divider"></div>
						<div className="">
							<div className="flex justify-between mb-1">
								<h2 className="flex items-center justify-center gap-1">
									Subtotal{" "}
									<div
										className="tooltip cursor-pointer"
										data-tip="Não inclui o valor do frete!">
										<FiInfo
											className="animate-pulse"
											size={16}
										/>
									</div>
								</h2>
								<h2>
									{productsInfo
										.reduce(
											(total, productInCart) =>
												total +
												productInCart.productPriceTotal,
											0
										)
										.toLocaleString("pt-BR", {
											style: "currency",
											currency: "BRL",
										})}
								</h2>
							</div>

							<div className="flex justify-between mb-1">
								<h2>Frete</h2>
								<div>
									<h2>
										{calculateTotalFrete().toLocaleString(
											"pt-BR",
											{
												style: "currency",
												currency: "BRL",
											}
										)}
									</h2>
								</div>
							</div>
							<div className="flex justify-between mb-1">
								<h2>Desconto do cupom</h2>
								<h2>
									{applyCupom.toLocaleString("pt-BR", {
										style: "currency",
										currency: "BRL",
									})}
								</h2>
							</div>
						</div>
						<div className="divider"></div>
						<div className="">
							<div className="flex justify-between mb-2">
								<h2 className="font-semibold">
									Total do Pedido
								</h2>
								<h2>
									{totalPedido.toLocaleString("pt-BR", {
										style: "currency",
										currency: "BRL",
									})}
								</h2>
							</div>
						</div>
					</div>
					<label className="flex flex-row w-[400px] gap-2">
						<div className="flex flex-col w-[260px]">
							<input
								type="text"
								placeholder="Insira o código do Cupom"
								className="input input-bordered w-full mb-2"
								value={cupomCode}
								onChange={(e) => setCupomCode(e.target.value)}
							/>
						</div>
						<button
							className="btn btn-primary w-[130px]"
							onClick={aplicarCupom}>
							Aplicar <Coupon size={20} />
						</button>
					</label>
				</div>
			)}
		</>
	);
}

export { YourOrderComp };
