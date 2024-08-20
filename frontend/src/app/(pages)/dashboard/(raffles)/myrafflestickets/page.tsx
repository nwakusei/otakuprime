"use client";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";

// Components
import { Sidebar } from "@/components/Sidebar";

// Imagens e Logos

// Icons

// Axios
import api from "@/utils/api";

function MyRafflesTicketsPage() {
	const [myTickets, setMyTickets] = useState([]);
	const [token] = useState(localStorage.getItem("token") || "");
	const [deleteLoading, setDeletLoading] = useState(null);

	console.log(myTickets);

	useEffect(() => {
		api.get("/raffles/customer-raffles", {
			headers: {
				Authorization: `Bearer ${JSON.parse(token)}`,
			},
		}).then((response) => {
			setMyTickets(response.data.raffles);
		});
	}, [token]);

	if (!myTickets) {
		return <div>Loading...</div>; // Ou qualquer outro componente de carregamento ou mensagem de erro
	}

	return (
		<section className="bg-gray-300 grid grid-cols-6 md:grid-cols-10 grid-rows-1 gap-4">
			<Sidebar />
			<div className="h-screen col-start-3 col-span-4 md:col-start-3 md:col-span-10 mb-4">
				<div className="flex flex-col gap-4 mb-8">
					{/* Gadget 1 */}
					<div className="bg-white w-[1200px] h-full p-6 rounded-md shadow-md mt-4 mr-4">
						{/* Adicionar Order */}
						<div className="flex flex-col gap-2 ml-6 mb-6">
							<h1 className="text-2xl font-semibold">
								Meus Sorteios
							</h1>

							{/* Lista de Pedidos */}
							<div className="overflow-x-auto">
								<table className="table">
									{/* head */}
									<thead>
										<tr>
											<th className="text-base text-black">
												Prêmio
											</th>
											<th className="text-base text-black">
												Custo da inscrição
											</th>
											<th className="text-base text-black">
												Data de realização
											</th>
											<th className="text-base text-black">
												Tickets
											</th>
											<th></th>
										</tr>
									</thead>
									<tbody>
										{/* row 1 */}
										{myTickets &&
											myTickets.map((myTicket) => (
												<tr key={myTicket?._id}>
													<td>
														<div className="flex items-center gap-3 mb-2">
															{Array.isArray(
																myTicket?.imagesRaffle
															) &&
																myTicket
																	?.imagesRaffle
																	.length >
																	0 &&
																myTicket?.imagesRaffle.map(
																	(
																		item,
																		index
																	) => (
																		<div
																			key={
																				index
																			}
																			className="avatar">
																			<div className="mask mask-squircle w-12 h-12">
																				<Image
																					src={`http://localhost:5000/images/raffles/${item}`}
																					alt={
																						item
																					}
																					width={
																						280
																					}
																					height={
																						280
																					} // Altere a altura conforme necessário
																					unoptimized
																				/>
																			</div>
																		</div>
																	)
																)}

															<div>
																<div className="font-bold text-black">
																	<h2 className="w-[230px] overflow-x-hidden mb-2">
																		<span>
																			{
																				myTicket?.rafflePrize
																			}
																		</span>
																	</h2>
																</div>
															</div>
														</div>
													</td>
													<td className="text-black">
														<div>
															{`${myTicket?.raffleCost.toLocaleString(
																"pt-BR"
															)} OP`}
														</div>
														<span className="badge badge-info badge-sm text-white py-2">
															Otaku Point
														</span>
													</td>
													<td>
														<div className="text-black">
															{myTicket?.raffleDate
																? format(
																		new Date(
																			myTicket?.raffleDate
																		),
																		"dd/MM/yyyy"
																  )
																: ""}
														</div>
													</td>
													<td className="text-xs">
														<div className="text-black">
															{`${myTicket?.registeredTickets?.reduce(
																(acc, ticket) =>
																	acc + 1,
																0
															)} un`}
														</div>
													</td>
													<th>
														<button className="flex flex-row items-center btn btn-primary btn-xs text-white w-[90px] shadow-md">
															<Link
																href={`/dashboard/myrafflestickets/${myTicket._id}`}>
																+ Detalhes
															</Link>
														</button>
													</th>
												</tr>
											))}
									</tbody>

									{/* foot */}
									<tfoot>
										<tr>
											<th></th>
											<th>Name</th>
											<th>Job</th>
											<th>Favorite Color</th>
											<th></th>
										</tr>
									</tfoot>
								</table>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

export default MyRafflesTicketsPage;