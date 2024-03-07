"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

// Icons
import { Currency } from "@icon-park/react";
import { BsStar, BsStarHalf, BsStarFill } from "react-icons/bs";
import { LiaShippingFastSolid } from "react-icons/lia";

function ProductAdCard({
	freeShipping,
	productImage,
	title,
	originalPrice,
	promocionalPrice,
	price,
	promoPrice,
	cashback,
	quantitySold,
	linkProductPage,
}) {
	// Calcular a porcentagem de desconto
	const calculateDiscountPercentage = () => {
		if (originalPrice === 0 || promocionalPrice === 0) {
			return 0;
		}
		const discountPercentage =
			((originalPrice - promocionalPrice) / originalPrice) * 100;
		return Math.round(discountPercentage);
	};

	const discountPercentage = calculateDiscountPercentage();

	return (
		<div className="bg-base-100 w-[254px] flex flex-col rounded-md relative pb-2 shadow-lg">
			<div className="flex flex-col items-center justify-center h-[220px] mx-3 mt-2 -mb-3">
				{discountPercentage === 0 ? (
					<></>
				) : (
					<span className="flex justify-center items-center bg-primary text-center rounded-tr-md rounded-bl-md absolute -right-0 w-[80px] h-[30px] ml-[144px] md:ml-[174px] -mt-[206px] ">
						{discountPercentage}% Off
					</span>
				)}
				{freeShipping === true ? (
					<div className="flex flex-col object-contain w-full h-full ">
						<Image
							className="object-contain w-full h-full"
							src={productImage}
							alt="Product Image"
							width={10}
							height={10}
							unoptimized
						/>
						<span className="flex flex-row items-center justify-center gap-2 bg-primary -mx-1 text-center rounded relative bottom-5">
							<LiaShippingFastSolid size={18} />
							Frete Grátis
						</span>
					</div>
				) : (
					<div className="flex flex-col object-contain w-full h-full">
						<Image
							className="object-contain w-full h-full"
							src={productImage}
							alt="Product Image"
							width={10}
							height={10}
							unoptimized
						/>
					</div>
				)}
			</div>
			<div className="divider text-sm mx-2">Detalhes</div>
			<div className="flex flex-col justify-center mx-4 -mt-2">
				<div>
					<h1 className="font-semibold text-base line-clamp-2 whitespace-normal min-h-[48px] mb-2">
						{title}
					</h1>
				</div>
				<div>
					<h1 className="text-base">
						{promocionalPrice === 0 ? (
							<span className="text-purple-400">
								{price.toLocaleString("pt-BR", {
									style: "currency",
									currency: "BRL",
								})}
							</span>
						) : (
							<>
								<span className="line-through mr-2">
									{price.toLocaleString("pt-BR", {
										style: "currency",
										currency: "BRL",
									})}
								</span>
								<span className="text-purple-400">
									{promoPrice.toLocaleString("pt-BR", {
										style: "currency",
										currency: "BRL",
									})}
								</span>
							</>
						)}
					</h1>
					<h2 className="flex flex-row items-center gap-2 text-center text-sm text-green-500 mb-2">
						<Currency size={18} /> {cashback}% de Cashback
					</h2>
					<h2 className="text-yellow-500 text-sm flex flex-row items-center gap-2">
						5.0
						<BsStarFill size={12} />
						<BsStarFill size={12} />
						<BsStarFill size={12} />
						<BsStarFill size={12} />
						<BsStarFill size={12} />
					</h2>
					<h3 className="text-sm mb-3">{quantitySold}</h3>
				</div>
				<button className="btn btn-primary w-full mb-2">
					<Link href={linkProductPage}>Ver mais</Link>
				</button>
			</div>
		</div>
	);
}

export { ProductAdCard };