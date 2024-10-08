"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";

// ToastFy
import { toast } from "react-toastify";

// Axios
import api from "@/utils/api";

// Bliblioteca de Sanitização
import DOMPurify from "dompurify";

// Components
import { Sidebar } from "@/components/Sidebar";
import { AddPicture } from "@icon-park/react";

// Icons

// React Hook Form, Zod e ZodResolver
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const createReviewFormSchema = z.object({
	imagesReview: z
		.instanceof(FileList)
		.transform((list) => {
			const files = [];

			for (let i = 0; i < list.length; i++) {
				files.push(list.item(i));
			}

			return files;
		})
		.refine(
			(files) => {
				return files !== null && files.length > 0;
			},
			{
				message: "※ Insira pelo menos 1 imagem!",
			}
		)
		.refine(
			(files) => {
				return files.every(
					(file) => file === null || file.size <= 2 * 1024 * 1024
				);
			},
			{
				message: "※ Cada arquivo precisa ter no máximo 2Mb!",
			}
		)
		.refine(
			(files) => {
				return files.every(
					(file) =>
						file === null || /\.(jpg|jpeg|png)$/i.test(file.name)
				);
			},
			{
				message:
					"※ Insira apenas imagens com extensão .JPG, .JPEG ou .PNG!",
			}
		),
	reviewRating: z
		.string()
		.min(1, "A nota é obrigatória!")
		.refine(
			(note) => {
				const numberValue = Number(note);

				return numberValue > 0.0;
			},
			{
				message: "Insirá um valor maior do que 0,1",
			}
		),
	reviewDescription: z.string().min(1, "A descrição é obrigatória!"),
});

type TCreateReviewFormSchema = z.infer<typeof createReviewFormSchema>;

function ReviewByIdPage() {
	const { id } = useParams();
	const [token] = useState(localStorage.getItem("token") || "");
	const [myorder, setMyorder] = useState([]);
	const [inputValue, setInputValue] = useState(0);
	const [description, setDescription] = useState("");
	const [images, setImages] = useState([]);
	const [sendReviewLoading, setSendReviewLoading] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<TCreateReviewFormSchema>({
		resolver: zodResolver(createReviewFormSchema),
		mode: "onBlur",
	});

	const [imagemSelecionada, setImagemSelecionada] = useState<
		string | ArrayBuffer | null
	>(null);

	useEffect(() => {
		const fetchOrder = async () => {
			try {
				const response = await api.get(
					`/orders/customer-orders/${id}`,
					{
						headers: {
							Authorization: `Bearer ${JSON.parse(token)}`,
						},
					}
				);
				if (response.data && response.data.order) {
					setMyorder(response.data.order);
				} else {
					console.error("Dados de pedidos inválidos:", response.data);
				}
			} catch (error) {
				console.error("Erro ao obter dados do usuário:", error);
			}
		};
		fetchOrder();
	}, [token, id]);

	const handleImagemSelecionada = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		const file = event.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = () => {
				setImagemSelecionada(reader.result);
			};
			reader.readAsDataURL(file);
		}
	};

	const increment = (event) => {
		event.preventDefault(); // Previne a submissão do formulário
		let newValue = parseFloat(inputValue) + 0.1;
		if (newValue > 5) {
			newValue = 5;
		}
		setInputValue(newValue.toFixed(1));
	};

	const decrement = (event) => {
		event.preventDefault(); // Previne a submissão do formulário
		let newValue = parseFloat(inputValue) - 0.1;
		if (newValue < 0) {
			newValue = 0;
		}
		setInputValue(newValue.toFixed(1));
	};

	///////////////////////////////////////////////////////////////////////////////////////////////////////////
	// Função para enviar a avaliação
	async function handleSubmitReview(data: { [key: string]: any }) {
		console.log("Data: ", data);

		const formData = new FormData();

		Object.entries(data).forEach(([key, value]) => {
			if (key !== "imagesReview") {
				formData.append(key, value);
			}
		});

		if (data.imagesReview) {
			data.imagesReview.forEach((image: File) => {
				formData.append(`imagesReview`, image);
			});
		}

		try {
			const response = await api.patch(
				`/reviews/create-review/${id}`,
				formData,
				{
					headers: {
						Authorization: `Bearer ${JSON.parse(token)}`,
					},
				}
			);

			toast.success(response.data.message);
		} catch (error: any) {
			toast.error(error.response.data.message);
		}
	}

	return (
		<section className="bg-gray-100 grid grid-cols-6 md:grid-cols-10 grid-rows-1 gap-4">
			<Sidebar />
			<div className="col-start-3 col-span-4 md:col-start-3 md:col-span-10">
				<form
					onSubmit={handleSubmit(handleSubmitReview)}
					className="flex flex-col gap-4 mb-8">
					{/* Gadget 1 */}
					<div className="bg-white text-black w-[1200px] p-6 rounded-md shadow-md mt-4">
						{/* Adicionar Porduto */}
						<div className="flex flex-col gap-2 mb-6">
							<h1 className="text-2xl font-semibold">
								Avalie o Pedido
							</h1>
						</div>
						<div className="mb-4">
							<div>ID do Pedido: {myorder.orderID}</div>
							<div>Loja: {myorder.partnerName}</div>
						</div>
						<div className="mb-8">
							<div className="overflow-x-auto">
								<table className="table">
									{/* head */}
									<thead>
										<tr>
											<th className="text-base">
												Produto(s)
											</th>
											<th className="text-base">
												Status
											</th>
											<th className="text-base">
												Favorite Color
											</th>
										</tr>
									</thead>
									<tbody>
										{/* row 1 */}
										{myorder.itemsList &&
											myorder.itemsList.map(
												(item, index) => (
													<tr key={index}>
														<td>
															<div className="flex items-center gap-3">
																<div className="avatar">
																	<div className="mask mask-squircle w-12 h-12">
																		<Image
																			src={`http://localhost:5000/images/products/${item.productImage}`}
																			alt={
																				item.productName
																			}
																			width={
																				10
																			}
																			height={
																				10
																			}
																			unoptimized
																		/>
																	</div>
																</div>
																<div>
																	<div className="font-bold">
																		{
																			item.productName
																		}
																	</div>
																</div>
															</div>
														</td>
														<td>
															{
																myorder.statusShipping
															}
														</td>
														<td>Purple</td>
													</tr>
												)
											)}
									</tbody>
								</table>
							</div>
						</div>

						<div className="flex flex-row gap-16">
							<div>
								<div className="text-base mb-4">
									Dê a sua nota para esse pedido:
								</div>

								<div className="flex flex-col gap-4">
									<div className="flex flex-row items-center text-black gap-2">
										<button
											onClick={decrement}
											className="flex items-center justify-center  w-[30px] h-[30px] select-none font-mono">
											<h1 className="px-3 py-1 shadow-md shadow-gray-500/50 bg-primary text-white rounded cursor-pointer active:scale-[.97]">
												-
											</h1>
										</button>

										<input
											className={`input input-bordered ${
												errors.reviewRating
													? `input-error`
													: `input-success`
											} text-lg text-center bg-gray-300
																w-[60px] h-[32px]
																rounded`}
											type="text"
											min="0"
											max="5"
											step="0.1"
											value={inputValue}
											{...register("reviewRating")}
										/>

										<button
											onClick={increment}
											className="flex items-center justify-center  w-[30px] h-[30px] select-none font-mono">
											<h1 className="px-3 py-1 shadow-md shadow-gray-500/50 bg-primary text-white rounded cursor-pointer active:scale-[.97]">
												+
											</h1>
										</button>
									</div>
									<div className="label">
										{errors.reviewRating ? (
											<span className="label-text-alt text-red-500">
												{errors.reviewRating.message}
											</span>
										) : (
											<span className="label-text-alt text-black">
												Exemplo
											</span>
										)}
									</div>
								</div>
							</div>
							<div>
								<label>
									<div className="mb-4">
										Descreva a avaliação:
									</div>
								</label>
								<textarea
									className={`textarea textarea-bordered ${
										errors.reviewDescription
											? `textarea-error`
											: `textarea-success`
									} text-white w-[600px]`}
									placeholder="Conte como foi a sua experiência..."
									{...register(
										"reviewDescription"
									)}></textarea>
								<div className="label">
									{errors.reviewDescription ? (
										<span className="label-text-alt text-red-500">
											{errors.reviewDescription.message}
										</span>
									) : (
										<span className="label-text-alt text-black">
											Exemplo
										</span>
									)}
								</div>
							</div>
						</div>
					</div>

					{/* Gadget 2 */}
					<div className="bg-white w-[1200px] p-6 rounded-md shadow-md mr-4 mb-4">
						<div className="flex flex-col gap-2 ml-6 mb-6">
							<h1 className="text-2xl font-semibold text-black">
								Fotos
							</h1>
							<label className="form-control w-full max-w-3xl">
								<div className="label">
									<span className="label-text text-black">
										Foto Principal
									</span>
								</div>
								<div
									className={`${
										errors.imagesReview
											? `border-error`
											: `border-success`
									} text-black hover:text-white flex flex-col justify-center items-center w-24 h-24 border-[1px] border-dashed border-[#3e1d88] hover:bg-[#8357e5] transition-all ease-in duration-150 rounded hover:shadow-md ml-1 cursor-pointer relative`}>
									{imagemSelecionada ? (
										<Image
											src={imagemSelecionada}
											alt="Imagem selecionada"
											className="object-contain w-full h-full rounded-sm"
											width={10}
											height={10}
										/>
									) : (
										<div
											className="flex flex-col justify-center items-center "
											onChange={handleImagemSelecionada}>
											<h2 className="text-xs mb-2">
												Add Imagem
											</h2>
											<AddPicture size={20} />
											<input
												className="hidden"
												type="file"
												accept="image/*"
												multiple
												{...register("imagesReview")}
											/>
										</div>
									)}
								</div>
								<div className="label">
									{errors.imagesReview && (
										<span className="label-text-alt text-red-500">
											{errors.imagesReview.message}
										</span>
									)}
								</div>
							</label>
						</div>
					</div>

					{/* Gadget 3 */}
					<div className="flex flex-row justify-between items-center gap-4 bg-white w-[1200px] p-6 rounded-md shadow-md">
						<div className="flex flex-row gap-4">
							{sendReviewLoading ? (
								<button className="btn btn-primary">
									<span className="loading loading-spinner loading-sm"></span>
									<span>Processando...</span>
								</button>
							) : (
								<button
									type="submit"
									className="btn btn-primary shadow-md">
									Enviar Avaliação
								</button>
							)}
						</div>
					</div>
				</form>
			</div>
		</section>
	);
}

export default ReviewByIdPage;
