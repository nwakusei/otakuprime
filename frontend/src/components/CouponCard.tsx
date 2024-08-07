"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

// Icons
import { Currency } from "@icon-park/react";
import { GoLinkExternal } from "react-icons/go";

function CouponCard({ partnerLogo, siteLink, discount, cashback, coupon }) {
	const [copied, setCopied] = useState(false);

	const handleCupom = (cupomCode: string) => {
		navigator.clipboard.writeText(cupomCode);
		setCopied(true);
		setTimeout(() => setCopied(false), 5000); // Reset após 5 segundos
	};

	const tipText = copied ? "Código Copiado" : "Clique para copiar o código";

	// Verificar se o siteLink já tem protocolo, se não, adicionar 'https://'
	const formattedSiteLink =
		siteLink.startsWith("http://") || siteLink.startsWith("https://")
			? siteLink
			: `https://${siteLink}`;

	return (
		<div className="bg-white w-[260px] flex flex-col rounded-md relative shadow-md select-none">
			<div className="h-[150px] mx-3 mt-2 -mb-3 flex items-center justify-center">
				<Image
					className="object-contain w-full h-full pointer-events-none"
					src={partnerLogo}
					alt="Logo Partner"
					width={150}
					height={100}
					unoptimized
				/>
			</div>

			<div className="divider before:bg-primary after:bg-primary mx-2">
				<Link
					className="flex flex-row items-center gap-2 text-primary transition-all ease-in duration-200 hover:text-secondary"
					href={formattedSiteLink} // Use a variável formatada
					target="_blank">
					<span>Acessar Site</span>
					<GoLinkExternal size={18} />
				</Link>
			</div>
			<div className="h-[150px] flex flex-col items-center justify-center mx-4 -mt-4">
				<h2 className="text-center font-semibold text-xl text-black">
					{`${discount}% de desconto`}
				</h2>
				<p className="text-center text-sm text-black mb-1">
					em compras na loja +
				</p>
				<p className="flex flex-row gap-2 text-center text-sm text-green-500 mb-2">
					<Currency size={18} /> {`${cashback}% de Cashback`}
				</p>

				<div className="tooltip w-full" data-tip={tipText}>
					<button
						className="btn btn-primary text-xl w-[230px] shadow-md"
						onClick={() => handleCupom(`${coupon}`)}>
						{coupon}
					</button>
				</div>
			</div>
		</div>
	);
}

export { CouponCard };
