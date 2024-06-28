"use client";

import Image from "next/image";
import Link from "next/link";

// Icons
import { LuCalendarRange } from "react-icons/lu";
import { MdOutlineLocalActivity, MdOutlineStore } from "react-icons/md";

function RaffleCard({
	rafflePrize,
	raffleImage,
	raffleDate,
	raffleCost,
	raffleOrganizer,
	linkRafflePage,
}) {
	return (
		<div className="bg-base-100 w-[254px] flex flex-col rounded-md relative pb-2 shadow-lg">
			<div className="flex flex-col items-center justify-center h-[220px] mx-3 mt-2 -mb-3">
				<Image
					className="object-contain w-full h-full"
					src={raffleImage}
					alt="Raffle Image"
					width={10}
					height={10}
					unoptimized
				/>
			</div>
			<div className="divider text-sm mx-2">Detalhes</div>
			<div className="flex flex-col justify-center mx-4 -mt-2">
				<div>
					<div className="flex flex-row gap-2">
						<div className="font-semibold text-base line-clamp-2 whitespace-normal min-h-[48px] mb-2">
							{rafflePrize}
						</div>
					</div>
				</div>
				<div>
					<div className="flex flex-row items-center text-base gap-2 mb-1">
						<LuCalendarRange size={17} />
						<span>{raffleDate}</span>
					</div>
					<div className="flex flex-row items-center gap-2 mb-1">
						<MdOutlineLocalActivity
							className="mt-[1px]"
							size={18}
						/>
						<div className="text-sm">{raffleCost} OP</div>
					</div>
					<h2 className="flex flex-row items-center text-sm gap-2 mb-4">
						<MdOutlineStore size={18} />
						<div>{raffleOrganizer}</div>
					</h2>
				</div>
				<button className="btn btn-primary w-full mb-2">
					<Link href={linkRafflePage}>+ Detalhes</Link>
				</button>
			</div>
		</div>
	);
}

export { RaffleCard };
