"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

// Icons
import {
	ShoppingCartOne,
	ShoppingBag,
	Coupon,
	PaymentMethod,
	Currency,
} from "@icon-park/react";
import { GrChat } from "react-icons/gr";
import { LuSettings, LuQrCode } from "react-icons/lu";
import {
	RiAccountPinBoxLine,
	RiAuctionLine,
	RiCopperCoinLine,
} from "react-icons/ri";
import { MdOutlineWarehouse } from "react-icons/md";
import { BsShopWindow, BsChatSquareText } from "react-icons/bs";
import { GoArrowUpRight } from "react-icons/go";
import { PiHandHeartDuotone, PiChatCenteredText } from "react-icons/pi";
import { TbDiscount2 } from "react-icons/tb";
import { CgEditUnmask } from "react-icons/cg";
import { GiPulse } from "react-icons/gi";
import { ImMakeGroup } from "react-icons/im";

function Sidebar() {
	return (
		<div className=" bg-purple-900 col-start-1 col-span-2 md:col-start-1 md:col-span-2 border-r-2 border-gray-800">
			<div className="ml-8 mt-8 mb-4">
				<h2 className="flex flex-row items-center gap-2 mb-2">
					<ShoppingBag size={20} />
					Marketplace
				</h2>

				<div className="flex flex-col mb-2">
					<Link
						className="flex flex-row items-center ml-7 gap-2"
						href={"/dashboard/myorders"}>
						<span className="text-xs">○</span>
						<span className="text-black hover:text-sky-500 transition-all ease-in duration-150">
							Vendas
						</span>
					</Link>

					<Link
						className="flex flex-row items-center ml-7 gap-2 "
						href={"/dashboard/myproducts"}>
						<span className="text-xs">○</span>
						<span className="text-black hover:text-sky-500 transition-all ease-in duration-150">
							Meus Produtos
						</span>
					</Link>

					<Link
						className="flex flex-row items-center ml-7 gap-2"
						href={"/dashboard/create-product"}>
						<span className="text-xs">○</span>
						<span className="text-black hover:text-sky-500 transition-all ease-in duration-150">
							Criar Produto
						</span>
					</Link>

					<Link
						className="flex flex-row items-center ml-7 gap-2"
						href={"/dashboard/reviews"}>
						<span className="text-xs">○</span>
						<span className="text-black hover:text-sky-500 transition-all ease-in duration-150">
							Avaliações
						</span>
					</Link>

					{/* <Link
						className="flex flex-row items-center ml-7 gap-2"
						href={""}>
						<span className="text-xs">○</span>
						<span className="text-black hover:text-sky-500 transition-all ease-in duration-150">
							Categorias
						</span>
					</Link> */}
				</div>
			</div>

			<div className="ml-8 mb-4">
				<h2 className="flex flex-row items-center gap-2 mb-2">
					{/* <CgEditUnmask size={20} /> */}
					<ImMakeGroup size={18} />
					OtaClub
				</h2>

				<div className="flex flex-col mb-2">
					<Link
						className="flex flex-row items-center ml-7 gap-2"
						href={"/dashboard/myorders"}>
						<span className="text-xs">○</span>
						<span className="text-black hover:text-sky-500 transition-all ease-in duration-150">
							Vendas
						</span>
					</Link>

					<Link
						className="flex flex-row items-center ml-7 gap-2"
						href={"/dashboard/myproducts"}>
						<span className="text-xs">○</span>
						<span className="text-black hover:text-sky-500 transition-all ease-in duration-150">
							Meus Produtos
						</span>
					</Link>
					<Link
						className="flex flex-row items-center ml-7 gap-2"
						href={"/dashboard/create-product"}>
						<span className="text-xs">○</span>
						<span className="text-black hover:text-sky-500 transition-all ease-in duration-150">
							Criar Produto
						</span>
					</Link>

					{/* <Link
						className="flex flex-row items-center ml-7 gap-2"
						href={""}>
						<span className="text-xs">○</span>
						<span className="text-black hover:text-sky-500 transition-all ease-in duration-150">
							Categorias
						</span>
					</Link> */}
				</div>
			</div>

			<div className="flex flex-col ml-8 mb-4">
				<h2 className="flex flex-row items-center gap-2 mb-2">
					<BsChatSquareText size={18} /> Chats
				</h2>

				<Link
					className="flex flex-row items-center ml-7 gap-2"
					href={"/dashboard/chat"}>
					<span className="text-xs">○</span>
					<span className="text-black hover:text-sky-500 transition-all ease-in duration-150">
						Ver Chats
					</span>
				</Link>
			</div>

			{/* <div className="flex flex-col ml-8 mb-4">
				<h2 className="flex flex-row items-center gap-2 mb-2">
					<Coupon size={20} />
					Eventos
				</h2>

				<Link
					className="flex flex-row items-center ml-7 gap-2"
					href={""}>
					<span className="text-xs">○</span>
					<span className="text-black hover:text-sky-500 transition-all ease-in duration-150">
						Criar Ingresso
					</span>
				</Link>

				<Link
					className="flex flex-row items-center ml-7 gap-2"
					href={""}>
					<span className="text-xs">○</span>
					<span className="text-black hover:text-sky-500 transition-all ease-in duration-150">
						Meus Ingressos
					</span>
				</Link>
			</div> */}

			{/* <div className="flex flex-col ml-8 mb-4">
				<h2 className="flex flex-row items-center gap-2 mb-2">
					<PiHandHeartDuotone size={18} />
					Finaciamento Coletivo
				</h2>

				<Link
					className="flex flex-row items-center ml-7 gap-2"
					href={""}>
					<span className="text-xs">○</span>
					<span className="text-black hover:text-sky-500 transition-all ease-in duration-150">
						Criar Projeto
					</span>
				</Link>
				<Link
					className="flex flex-row items-center ml-7 gap-2"
					href={""}>
					<span className="text-xs">○</span>
					<span className="text-black hover:text-sky-500 transition-all ease-in duration-150">
						Projetos Ativos
					</span>
				</Link>
			</div> */}

			<div className="flex flex-col ml-8 mb-4">
				<h1 className="flex flex-row items-center gap-2 mb-2">
					<PaymentMethod size={18} />
					OtakuPay
				</h1>

				<Link
					className="flex flex-row items-center ml-7 gap-2"
					href={"/dashboard/wallet"}>
					<span className="text-xs">○</span>
					<span className="text-black hover:text-sky-500 transition-all ease-in duration-150">
						Wallet
					</span>
				</Link>
			</div>

			<div className="flex flex-col ml-8 mb-4">
				<h1 className="flex flex-row items-center gap-2 mb-2">
					<TbDiscount2 size={20} />
					Marketing
				</h1>

				<Link
					className="flex flex-row items-center ml-7 gap-2"
					href={"/dashboard/mycoupons"}>
					<span className="text-xs">○</span>
					<span className="text-black hover:text-sky-500 transition-all ease-in duration-150">
						Meus Cupons
					</span>
				</Link>

				<Link
					className="flex flex-row items-center ml-7 gap-2"
					href={"/dashboard/create-coupon"}>
					<span className="text-xs">○</span>
					<span className="text-black hover:text-sky-500 transition-all ease-in duration-150">
						Criar Cupom
					</span>
				</Link>
			</div>

			{/* <div className="flex flex-col ml-8 mb-4">
				<h1 className="flex flex-row items-center gap-2 mb-2">
					<RiAccountPinBoxLine size={18} />
					PROFILE?
				</h1>

				<Link
					className="flex flex-row items-center ml-7 gap-2"
					href={"/dashboard/myprofile"}>
					<span className="text-xs">○</span>
					<span className="text-black hover:text-sky-500 transition-all ease-in duration-150">
						My Profile
					</span>
				</Link>
			</div> */}

			<div className="flex flex-col ml-8 mb-4">
				<h1 className="flex flex-row items-center gap-2 mb-2">
					<LuSettings size={18} />
					Configurações
				</h1>

				<Link
					className="flex flex-row items-center ml-7 gap-2"
					href={"/dashboard/myprofile"}>
					<span className="text-xs">○</span>
					<span className="text-black hover:text-sky-500 transition-all ease-in duration-150">
						Gerais
					</span>
				</Link>
			</div>

			{/* <div className="ml-8 mb-4">
				
				<ul className="mb-2">
					<h2 className="flex flex-row items-center ml-7 gap-2 hover:bg-blue-300 rounded cursor-pointer">
						<Coupon size={20} />
						Envio
					</h2>
					<li className="flex flex-row items-center gap-2 ml-7">
						<MdOutlineWarehouse size={18} />
						Centro de Distribuição
					</li>
					<li className="flex flex-row items-center gap-2 ml-7">
						<BsShopWindow size={16} />
						Loja Física
					</li>
					<li className="ml-7">○ Kangu Credencial</li>
				</ul>
			</div> */}
		</div>
	);
}

export { Sidebar };
