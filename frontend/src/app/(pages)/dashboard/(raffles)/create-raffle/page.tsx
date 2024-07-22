"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";

import Image from "next/image";
import { useRouter } from "next/navigation";
import api from "@/utils/api";

// React Hook Form e Zod
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Toast
import { toast } from "react-toastify";

// TipTap
import Tiptap from "@/components/Tiptap";

// Components
import { Sidebar } from "@/components/Sidebar";

// Imagens e Logos

// Icons
import { Coupon } from "@icon-park/react";
import { GoLinkExternal } from "react-icons/go";
import { CiWarning } from "react-icons/ci";
import { FaPercent } from "react-icons/fa";

const createCouponFormSchema = z.object({
	discountPercentage: z
		.string()
		.min(1, "A porcentagem de desconto é obrigatória!"),
	couponCode: z.string().min(1, "O código do cupom é obrigatório!"),
});

function CreateRafflePage() {
	const [token] = useState(localStorage.getItem("token") || "");
	const [partner, setPartner] = useState({});

	const router = useRouter();
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({ resolver: zodResolver(createCouponFormSchema) });

	useEffect(() => {
		api.get("/otakuprime/check-user", {
			headers: {
				Authorization: `Bearer ${JSON.parse(token)}`,
			},
		}).then((responser) => {
			setPartner(responser.data);
		});
	}, [token]);

	async function handleCreateCoupon(CouponData) {
		try {
			const response = await api.post("/coupons/create", CouponData, {
				headers: {
					Authorization: `Bearer ${JSON.parse(token)}`,
				},
			});

			toast.success(response.data.message);

			router.push("/dashboard/mycoupons");
			return response.data;
		} catch (error) {
			toast.error(error.response.data.message);
			return error.response.data;
		}
	}

	return (
		<section className="grid grid-cols-6 md:grid-cols-10 grid-rows-1 gap-4">
			<Sidebar />
			<div className="bg-gray-500 col-start-3 col-span-4 md:col-start-3 md:col-span-10 mb-4">
				<div className="flex flex-col gap-4 mb-8">
					<form onSubmit={handleSubmit(handleCreateCoupon)}>
						{/* Gadget 1 */}
						<div className="bg-purple-400 w-[1200px] p-6 rounded-md mr-4 mt-4 mb-4">
							{/* Adicionar Porduto */}
							<div className="flex flex-col gap-2 ml-6 mb-6">
								<h1 className="text-2xl font-semibold">
									Criar Sorteio
								</h1>

								<div className="flex flex-row gap-10">
									{/* Nome e Descrição */}
									<label className="form-control w-[991px]">
										<div className="label">
											<span className="label-text">
												Prêmio do Sorteio
											</span>
										</div>
										<input
											type="text"
											placeholder={`Digite o título do prêmio...`}
											className="input input-bordered input-success"
										/>
									</label>
								</div>

								<div className="flex flex-col gap-10">
									<div className="flex flex-row gap-8">
										{/* Cashback Atual */}
										<label className="form-control">
											<div className="label">
												<span className="label-text">
													Data de Realização
												</span>
											</div>
											<div className="join">
												<div>
													<div>
														<input
															className="input input-bordered input-success join-item w-[250px]"
															placeholder={`dd/MM`}
														/>
													</div>
												</div>
												<div className="indicator">
													<button
														type="button"
														className="btn join-item flex flex-row items-center">
														<FaPercent size={14} />
													</button>
												</div>
											</div>
											<div className="label">
												<span className="label-text-alt">
													Não possível alterar por
													aqui
												</span>
											</div>
										</label>

										{/* Desconto a ser oferecido */}
										<label className="form-control">
											<div className="label">
												<span className="label-text">
													Custo para se inscrever
												</span>
											</div>
											<div className="join">
												<div>
													<div>
														<input
															className={`${
																errors.discountPercentage &&
																`input-error`
															} input input-bordered input-success join-item w-[250px]`}
															placeholder="0"
															{...register(
																"discountPercentage"
															)}
														/>
													</div>
												</div>
												<div className="indicator">
													<button
														type="button"
														className="btn join-item flex flex-row items-center">
														OP
													</button>
												</div>
											</div>
											<div className="label">
												{errors.discountPercentage ? (
													<span className="text-red-500 label-text-alt">
														{
															errors
																.discountPercentage
																.message
														}
													</span>
												) : (
													<span className="label-text-alt">
														Ex: 10 Otaku Points
													</span>
												)}
											</div>
										</label>

										{/* Desconto a ser oferecido */}
										<label className="form-control">
											<div className="label">
												<span className="label-text">
													Quantidade mínima de
													participantes
												</span>
											</div>
											<div className="join">
												<div>
													<div>
														<input
															className={`${
																errors.discountPercentage &&
																`input-error`
															} input input-bordered input-success join-item w-[250px]`}
															placeholder="0"
															{...register(
																"discountPercentage"
															)}
														/>
													</div>
												</div>
												<div className="indicator">
													<button
														type="button"
														className="btn join-item flex flex-row items-center">
														nº
													</button>
												</div>
											</div>
											<div className="label">
												{errors.discountPercentage ? (
													<span className="text-red-500 label-text-alt">
														{
															errors
																.discountPercentage
																.message
														}
													</span>
												) : (
													<span className="label-text-alt">
														Ex: Informe o nº mínimo
														de participantes
													</span>
												)}
											</div>
										</label>
									</div>

									{/* Cupom de Desconto a ser criado */}
									<label className="form-control">
										<div className="label">
											<span className="label-text">
												Descrição
											</span>
										</div>
										<textarea
											className="textarea textarea-bordered w-[700px] h-[150px]"
											placeholder="Bio"></textarea>

										<div className="label">
											{errors.couponCode ? (
												<span className="text-red-500 label-text-alt">
													{errors.couponCode.message}
												</span>
											) : (
												<span className="label-text-alt">
													Descreva as informações
												</span>
											)}
										</div>
									</label>

									{/* Cupom de Desconto a ser criado */}
									<label className="form-control">
										<div className="label">
											<span className="label-text">
												Regras
											</span>
										</div>
										<textarea
											className="textarea textarea-bordered w-[700px] h-[150px]"
											placeholder="Bio"></textarea>

										<div className="label">
											{errors.couponCode ? (
												<span className="text-red-500 label-text-alt">
													{errors.couponCode.message}
												</span>
											) : (
												<span className="label-text-alt">
													Informe as regras do Sorteio
												</span>
											)}
										</div>
									</label>
								</div>
							</div>
						</div>

						{/* Gadget 2 */}
						<div className="bg-purple-400 p-6 rounded-md mr-4 mb-4">
							<div className="flex flex-col gap-2 ml-6 mb-6">
								<h1 className="text-2xl font-semibold">
									Importante!
								</h1>

								<div className="flex flex-row border-[1px] border-dashed border-sky-700 rounded p-4 gap-2">
									<span className="flex items-center w-[650px] h-auto justify-center bg-yellow-500 rounded mr-4">
										<CiWarning
											className="text-black"
											size={80}
										/>
									</span>
									<p>
										Atenção: Criar cupons de desconto é uma
										função PAGA. Esse é um serviço de
										marketing que permite criar cupons para
										atrair mais clientes, com a opção de
										direcionar para o seu site caso possua
										um. Também exibimos em uma área
										exclusiva em nosso aumentando a
										visibilidade da sua loja, além de
										divulgação em redes sociais de acordo
										com regras estratégicas. 1. Os cupons
										serão válidos tanto em seu site quanto
										em sua loja no OtaMart. 2. O comprador
										só receberá os cashbacks caso faça o
										pagamento usando OtakuPay.
										<Link
											className="flex flex-row items-center gap-2 text-purple-300 transition-all ease-in duration-200 hover:text-purple-500"
											href="https://www.kangu.com.br/ponto-kangu/"
											target="_blank">
											<span>
												Valor Cobrado por Cupom criado:
												R$ 19,90
											</span>
											<GoLinkExternal size={18} />
										</Link>
									</p>
								</div>
							</div>
						</div>

						{/* Gadget 2 */}
						<div className="bg-purple-400 w-[1200px] p-6 rounded-md mr-4">
							{/* Adicionar Porduto */}
							<div className="flex flex-col gap-2 ml-6 mb-6">
								<h1 className="text-2xl font-semibold mb-4">
									Criar Cupom?
								</h1>
								{/* Nome e Descrição */}

								<div className="flex flex-row gap-4">
									<button
										type="button"
										className="btn btn-outline btn-error">
										Cancelar
									</button>
									<button
										type="submit"
										className="btn btn-success">
										Criar e Publicar
									</button>
								</div>
							</div>
						</div>
					</form>
					<pre></pre>
				</div>
			</div>
		</section>
	);
}

export default CreateRafflePage;