"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import crypto from "crypto";

const secretKey = "chaveSuperSecretaDe32charsdgklot";

// Components
import { Sidebar } from "@/components/Sidebar";
import { LoadingPage } from "@/components/LoadingPageComponent";

// Axios
import api from "@/utils/api";

// Imagens e Logos
import Otakuyasan from "../../../../../public/otakuyasan.png";

// Icons
import { Currency } from "@icon-park/react";
import { Deposit, Wallet } from "@icon-park/react";
import { AiOutlineMoneyCollect } from "react-icons/ai";
import { RiMoneyCnyCircleLine, RiRotateLockLine } from "react-icons/ri";
import { LiaHandshake, LiaShippingFastSolid } from "react-icons/lia";
import { CiCreditCard2 } from "react-icons/ci";
import { FiInfo } from "react-icons/fi";

function WalletPage() {
	const [user, setUser] = useState({});
	const [userOtakupay, setUserOtakupay] = useState({});
	const [token] = useState(localStorage.getItem("token") || "");
	const [isLoading, setIsLoading] = useState(true);
	const [loadingButtonId, setLoadingButtonId] = useState(false);

	const [transactions, setTransactions] = useState([]);

	const router = useRouter();

	useEffect(() => {
		api.get("/otakuprime/check-user", {
			headers: {
				Authorization: `Bearer ${JSON.parse(token)}`,
			},
		}).then((response) => {
			setUser(response.data);
			setIsLoading(false);
		});

		api.get("/otakupay/get-user-otakupay", {
			headers: {
				Authorization: `Bearer ${JSON.parse(token)}`,
			},
		})
			.then((response) => {
				const newUserOtakupay = response.data; // Ajuste aqui para pegar diretamente a resposta
				setUserOtakupay(newUserOtakupay);
			})
			.catch((error) => {
				console.error("Erro ao obter saldo do OtakuPay:", error);
			});
	}, [token]);

	useEffect(() => {
		if (!token) return;

		console.log("Token usado na requisição:", token);

		const featchTransactions = async () => {
			try {
				const response = await api.get(`/otakupay/transactions`, {
					headers: {
						Authorization: `Bearer ${JSON.parse(token)}`,
					},
				});
				console.log("Dados recebidos:", response.data.transactions);
				setTransactions(response.data.transactions);
			} catch (error: any) {
				console.error(
					"Erro ao obter transações:",
					error.response?.data || error.message
				);
			}
		};

		featchTransactions();
	}, [token]);

	const handleClick = () => {
		setLoadingButtonId(true);
		setTimeout(() => {
			router.push(`/dashboard/wallet/add-balance`);
		}, 2000); // O tempo pode ser ajustado conforme necessário
	};

	// Função para Descriptografar dados sensíveis no Banco de Dados
	function decrypt(encryptedBalance: string): number | null {
		let decrypted = "";

		try {
			// Divide o IV do texto criptografado
			const [ivHex, encryptedData] = encryptedBalance.split(":");
			if (!ivHex || !encryptedData) {
				throw new Error("Formato inválido do texto criptografado.");
			}

			const iv = Buffer.from(ivHex, "hex");

			const decipher = crypto.createDecipheriv(
				"aes-256-cbc",
				Buffer.from(secretKey, "utf-8"),
				iv
			);

			decipher.setAutoPadding(false);

			decrypted = decipher.update(encryptedData, "hex", "utf8");
			decrypted += decipher.final("utf8");

			const balanceNumber = parseFloat(decrypted.trim()); // Remove espaços em branco extras
			if (isNaN(balanceNumber)) {
				return null;
			}
			return parseFloat(balanceNumber.toFixed(2));
		} catch (error) {
			console.error("Erro ao descriptografar o saldo:", error);
			return null;
		}
	}

	if (isLoading) {
		return <LoadingPage />;
	}

	return (
		<section className="bg-gray-300 grid grid-cols-6 md:grid-cols-10 grid-rows-1 gap-4">
			<Sidebar />
			<div className="col-start-3 col-span-4 md:col-start-3 md:col-span-10 mt-4">
				{/* Gadget 1 */}
				<div className="flex flex-row gap-4 mb-4">
					<div className="bg-white w-[1200px] p-6 rounded-md shadow-md">
						{/* Avatar e Boas vindas */}
						<div className="flex flex-row items-center text-lg text-black font-semibold ml-6 mb-6 gap-4">
							<Wallet size={24} />
							<h1 className="text-2xl">OtakuPay Wallet</h1>
						</div>
					</div>
				</div>

				{/* Gadget 2 */}
				<div className="flex flex-row gap-4 mb-4">
					<div className="bg-white w-[520px] p-6 rounded-md shadow-md">
						{/* Saldo Disponivel */}
						<div className="flex flex-col -mb-4">
							<div className="flex flex-row items-center ml-6 gap-5">
								<div>
									<h2 className="text-sm text-black">
										Saldo Disponível
									</h2>
									<h1 className="flex flex-row items-center text-3xl font-semibold text-black">
										{parseFloat(
											userOtakupay?.balanceAvailable || ""
										).toLocaleString("pt-BR", {
											style: "currency",
											currency: "BRL",
										})}
									</h1>
								</div>
								<div className="flex flex-col mx-6 gap-4">
									{loadingButtonId ? (
										<button className="flex flex-row items-center btn btn-primary text-black shadow-md w-[200px]">
											<span className="loading loading-dots loading-md"></span>
										</button>
									) : (
										<button
											onClick={handleClick}
											className="flex flex-row items-center btn btn-outline btn-primary text-black w-[200px] hover:shadow-md">
											<AiOutlineMoneyCollect size={22} />
											Adicionar Crédito
										</button>
									)}
								</div>
							</div>
							{/* <div className="flex flex-row mx-6 gap-4">
								<button className="btn btn-outline btn-success">
									<Deposit size={18} />
									Adicionar Dinheiro
								</button>
								<button className="btn btn-success">
									<Expenses size={18} />
									Sacar
								</button>
							</div> */}
						</div>
					</div>

					{/* Outro Saldos */}
					<div className="bg-white w-[210px] p-6 rounded-md shadow-md">
						{/* Saldo Disponivel */}
						<div className="flex flex-col">
							<div className="flex flex-row pb-2 mb-2">
								<div>
									<h2 className="text-sm text-black">
										Saldo Pendente
									</h2>
									<h1 className="flex flex-row items-center text-xl font-semibold text-black gap-2">
										{parseFloat(
											userOtakupay?.balancePending || ""
										).toLocaleString("pt-BR", {
											style: "currency",
											currency: "BRL",
										})}
									</h1>
								</div>
							</div>
						</div>
					</div>

					<div className="bg-white w-[210px] p-6 rounded-md shadow-md">
						{/* Saldo Disponivel */}
						<div className="flex flex-col">
							<div className="flex flex-row pb-2 mb-2">
								<div>
									<h2 className="text-sm text-black">
										Otaku Point Disponível
									</h2>
									<h1 className="flex flex-row items-center text-xl font-semibold text-black gap-2">
										{parseFloat(
											userOtakupay?.otakuPointsAvailable
										) === 0
											? `0,00 OP`
											: `${parseFloat(
													userOtakupay?.otakuPointsAvailable
											  ).toLocaleString("pt-BR")} OP`}
									</h1>
								</div>
							</div>
						</div>
					</div>

					<div className="bg-white w-[212px] p-6 rounded-md shadow-md mr-4">
						{/* Saldo Disponivel */}
						<div className="flex flex-col">
							<div className="flex flex-row">
								<div>
									<h2 className="text-sm text-black">
										Otaku Point Pendente
									</h2>
									<h1 className="flex flex-row items-center text-xl font-semibold text-black gap-2">
										{userOtakupay?.otakuPointsPending !==
										undefined
											? parseFloat(
													userOtakupay?.otakuPointsPending
											  )
													.toFixed(2)
													.replace(".", ",") + " OP"
											: "0,00 OP"}
									</h1>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Gadget 2 */}
				<div className="h-screen bg-white w-[1200px] p-6 rounded-md shadow-md mr-4 mb-8">
					{/* Tabela de Transações */}
					<div className="divider mb-2 text-lg text-black before:bg-black after:bg-black before:border-t-[1px] after:border-t-[1px]">
						Últimas atividades
					</div>
					<table className="table">
						{/* head */}
						<thead>
							<tr>
								<th className="text-sm text-black">
									{/* {user?.accountType === "partner"
										? `Cliente`
										: `Loja`} */}
								</th>
								<th className="text-sm text-black">
									Transação
								</th>
								<th className="text-sm text-black">
									Valor Total
								</th>
								<th className="text-sm text-black">Data</th>
								<th></th>
							</tr>
						</thead>

						<tbody className="p-10">
							{/* rows */}
							{transactions.length > 0 &&
								transactions.map((transaction) => (
									<tr key={transaction._id}>
										<td>
											<div className="flex items-center gap-3">
												<div className="avatar">
													<div className="mask mask-squircle w-12 h-12">
														<Image
															src={Otakuyasan}
															alt="Avatar Tailwind CSS Component"
														/>
													</div>
												</div>
												<div>
													<div className="font-bold text-black">
														{String(
															user?.otakupayID
														) !==
														String(
															transaction.payerID
														)
															? transaction.payerName
															: transaction.receiverName}
													</div>
													<div className="text-xs text-black opacity-50">
														{
															transaction.plataformName
														}
													</div>
												</div>
											</div>
										</td>
										<td>
											<div className="text-black">
												{transaction.transactionTitle}
											</div>
											<div className="text-gray-600 text-xs">
												{
													transaction.transactionDescription
												}
											</div>
											<span
												className={`badge ${
													transaction.transactionType ===
														"Cancelamento" ||
													transaction.transactionType ===
														"Reembolso"
														? "badge-error"
														: "badge-success"
												} badge-sm text-white py-2`}>
												{transaction.transactionType}
											</span>
										</td>
										<td>
											<div
												className={`font-normal ${
													(String(
														user?.otakupayID
													) ===
														String(
															transaction.payerID
														) &&
														transaction.transactionType ===
															"Cancelamento") ||
													transaction.transactionType ===
														"Reembolso"
														? "text-green-700"
														: "text-red-700"
												} `}>
												{(String(user?.otakupayID) ===
													String(
														transaction.payerID
													) &&
													transaction.transactionType ===
														"Cancelamento") ||
												transaction.transactionType ===
													"Reembolso"
													? `+ ${decrypt(
															transaction.transactionValue
													  )?.toLocaleString(
															"pt-BR",
															{
																style: "currency",
																currency: "BRL",
															}
													  )}`
													: `- ${decrypt(
															transaction.transactionValue
													  )?.toLocaleString(
															"pt-BR",
															{
																style: "currency",
																currency: "BRL",
															}
													  )}`}
											</div>
										</td>
										<td>
											<div className="text-black">
												{transaction.createdAt &&
													format(
														new Date(
															transaction.createdAt
														),
														"dd/MM/yyyy"
													)}
											</div>
										</td>
										<th>
											{/* Modal de Detalhes da Transação */}
											<button
												className="btn btn-primary hover:btn-secondary btn-xs text-white shadow-md"
												onClick={() =>
													document
														.getElementById(
															"my_modal_1"
														)
														.showModal()
												}>
												+ Detalhes
											</button>
											<dialog
												id="my_modal_1"
												className="modal">
												<div className="modal-box bg-secondary">
													<h2 className="font-bold text-lg mb-4">
														Detalhes da Transação{" "}
													</h2>
													<p className="flex flex-row items-center gap-2">
														<RiMoneyCnyCircleLine
															size={16}
														/>
														<span className="mb-[1px]">
															{
																transaction
																	.transactionDetails
																	.detailProductServiceTitle
															}
														</span>
													</p>
													<p className="flex flex-row items-center gap-2">
														<RiMoneyCnyCircleLine
															size={16}
														/>
														<span>
															{`Valor do Produto: ${decrypt(
																transaction
																	.transactionDetails
																	.detailCost
															)?.toLocaleString(
																"pt-BR",
																{
																	style: "currency",
																	currency:
																		"BRL",
																}
															)}`}
														</span>
													</p>
													<p className="flex flex-row items-center gap-2">
														<LiaShippingFastSolid
															size={16}
														/>

														<span>
															{`Custo de Envio: ${decrypt(
																transaction
																	.transactionDetails
																	.detailShippingCost
															)?.toLocaleString(
																"pt-BR",
																{
																	style: "currency",
																	currency:
																		"BRL",
																}
															)}`}
														</span>
													</p>
													<p className="flex flex-row items-center gap-2">
														<LiaHandshake
															size={16}
														/>
														<span>
															{`Tarifa de Venda: ${decrypt(
																transaction
																	.transactionDetails
																	.detailSalesFee
															)?.toLocaleString(
																"pt-BR",
																{
																	style: "currency",
																	currency:
																		"BRL",
																}
															)}`}
														</span>
													</p>
													<p className="flex flex-row items-center gap-2 mb-2">
														<Currency size={16} />
														<span className="mb-[1px]">
															{`Cashback: ${decrypt(
																transaction
																	.transactionDetails
																	.detailCashback
															)?.toLocaleString(
																"pt-BR",
																{
																	style: "currency",
																	currency:
																		"BRL",
																}
															)}`}
														</span>
													</p>

													<p className="flex flex-row items-center gap-2 mb-2">
														<CiCreditCard2
															size={16}
														/>
														<span>
															{`Método de Pagamento: ${transaction.transactionDetails.detailPaymentMethod}`}
														</span>
													</p>

													<p className="flex flex-row items-center gap-2 mb-2">
														<FiInfo size={15} />
														<span className="mb-[1px]">
															Devolvemos o
															dinheiro ao
															comprador.
														</span>
													</p>

													<p className="flex flex-row items-center gap-2 leading-tight">
														<RiRotateLockLine
															size={20}
														/>
														<span className="break-all overflow-hidden text-ellipsis -mb-[16px]">
															{`Hash: ${transaction.transactionHash}`}
														</span>
													</p>

													<div className="modal-action">
														<form method="dialog">
															{/* if there is a button in form, it will close the modal */}
															<button className="btn btn-primary">
																Fechar
															</button>
														</form>
													</div>
												</div>
											</dialog>
										</th>
									</tr>
								))}
						</tbody>

						{/* foot */}
						{/* <tfoot>
							<tr>
								<th></th>
								<th>Name</th>
								<th>Job</th>
								<th>Favorite Color</th>
								<th></th>
							</tr>
						</tfoot> */}
					</table>
				</div>
			</div>
		</section>
	);
}

export default WalletPage;
