"use client";

import { useState, useEffect, useRef, useContext } from "react";
import Link from "next/link";
import Image from "next/image";

// imagens estáticas
import Lycoris from "../../../../../public/lycoris.jpg";

// Context

// Icons
import { Coupon, IdCardH, ShoppingCartOne } from "@icon-park/react";
import {
	MdOutlineDeleteOutline,
	MdArrowBackIos,
	MdArrowForwardIos,
} from "react-icons/md";
import { GrLocation } from "react-icons/gr";
import { HiOutlineCreditCard } from "react-icons/hi";
import { PiCreditCardBold } from "react-icons/pi";
import { BiIdCard } from "react-icons/Bi";
import { LiaShippingFastSolid } from "react-icons/lia";
import { FiInfo } from "react-icons/fi";

// Components

function DeliveryPage() {
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
						<li className="step">
							<span className="flex flex-row items-center gap-1 bg-black py-1 px-2 rounded">
								<p>Revisão</p> <BiIdCard size={20} />
							</span>
						</li>
						<li className="step">
							<span className="flex flex-row items-center gap-1 bg-black py-1 px-2 rounded">
								<p>Pagamento</p>
								<PiCreditCardBold size={20} />
							</span>
						</li>
					</ul>
				</div>
				<div className="flex flex-row justify-center gap-6 bg-yellow-500 col-start-2 col-span-4 md:col-start-2 md:col-span-6 mb-8">
					<div className="flex flex-col items-center">
						<div className="flex flex-row justify-between gap-4 bg-gray-500 w-[650px] min-h-[100px] p-4 rounded-md mb-4">
							<div className="flex flex-row gap-4">
								<GrLocation size={25} />
								<div>
									<h1 className="text-base font-semibold mb-2">
										Endereço de Entrega:
									</h1>
									<h1 className="text-base">
										Avenida Lourenço Cabreira, 648
									</h1>
									<h2>Apto. 12 A</h2>
									<h2>Jardim Ana Lúcia</h2>
									<h2>São Paulo/SP</h2>
									<h2>04812-010</h2>
								</div>
							</div>

							<div>
								<div className="flex flex-col items-center justify-center border-[1px] border-purple-500 w-10 h-10 transition-all ease-in duration-200 hover:shadow-md hover:bg-purple-500 rounded cursor-pointer">
									<MdOutlineDeleteOutline size={25} />
								</div>
							</div>
						</div>
						<div className="flex flex-row justify-between gap-4 bg-gray-500 w-[650px] min-h-[80px] p-4 rounded-md mb-4">
							<div className="flex flex-row gap-4">
								<LiaShippingFastSolid size={25} />
								<div>
									<h1>Transportadora: Loggi</h1>
									<h2>Custo do Frete: R$ 10,00</h2>
									<h2>Prazo de Envio: 3 dias</h2>
									<h2>Previsão de Entrega: 10 dias</h2>
								</div>
							</div>

							<div>
								<div className="flex flex-col items-center justify-center border-[1px] border-purple-500 w-10 h-10 transition-all ease-in duration-200 hover:shadow-md hover:bg-purple-500 rounded cursor-pointer">
									<MdOutlineDeleteOutline size={25} />
								</div>
							</div>
						</div>
					</div>

					<div className="flex flex-col">
						<div className="flex flex-col w-[400px] min-h-[250px] bg-gray-500 p-4 rounded-md mb-2">
							<div className="">
								<h1 className="text-lg font-semibold mb-4">
									Seu Pedido
								</h1>
								<div className="flex justify-between mb-2">
									<h2>2 x One Piece Vol.1</h2>
									<h2>R$ 420,00</h2>
								</div>
								<div className="flex justify-between">
									<h2>1 x One Piece Vol.2</h2>
									<h2>R$ 210,00</h2>
								</div>
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
									<h2>R$ 630,00</h2>
								</div>
								<div className="flex justify-between mb-1">
									<h2>Frete</h2>
									<h2>R$ 10,00</h2>
								</div>
								<div className="flex justify-between mb-1">
									<h2>Desconto do cupom</h2>
									<h2>—</h2>
								</div>
							</div>
							<div className="divider"></div>
							<div>
								<div className="flex justify-between mb-2">
									<h2 className="font-semibold">
										Total do Pedido
									</h2>
									<h2>R$ 640,00</h2>
								</div>
							</div>
						</div>
						<label className="flex flex-row w-[400px] gap-2">
							<div className="flex flex-col w-[260px]">
								{/* <div className="label">
									<span className="label-text font-semibold">
										Cupom de Desconto
									</span>
								</div> */}
								<input
									type="text"
									placeholder="Insira o código do Cupom"
									className="input input-bordered w-full mb-2"
								/>
							</div>
							<button className="btn btn-primary w-[130px]">
								Aplicar <Coupon size={20} />
							</button>
						</label>
					</div>
				</div>
				<div className="flex flex-row justify-center items-center gap-4">
					<button className="btn">
						<Link
							className="flex flex-row justify-center items-center gap-2"
							href="/checkout/cart">
							<MdArrowBackIos size={20} />
							Voltar
						</Link>
					</button>

					<button className="btn">
						<Link
							className="flex flex-row justify-center items-center gap-2"
							href="/checkout/review">
							Continuar
							<MdArrowForwardIos size={20} />
						</Link>
					</button>
				</div>
			</div>
		</section>
	);
}

export default DeliveryPage;
