"use client";

import { useContext, useEffect, useState } from "react";
import Image from "next/image";
import Swal from "sweetalert2";

// Zod Hook Form
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Imagens
import Logo from "../../../../public/logo.png";

// Components
import { InputUserForm } from "@/components/InputUserForm";

// Context
import { Context } from "@/context/UserContext";
import { title } from "process";

const createUserFormSchema = z.object({
	email: z
		.string()
		.min(1, "O email é obrigatório!")
		.email("O formato do email é inválido!")
		.toLowerCase(),
	password: z.string().min(1, "A senha é obrigatória!").max(34, {
		message: "A senha precisa ter no máximo 34 caracteres!",
	}),
});

type TCreateUserFormData = z.infer<typeof createUserFormSchema>;

function LoginPage() {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<TCreateUserFormData>({
		resolver: zodResolver(createUserFormSchema),
	});

	const { loginUser } = useContext(Context);

	const [btnLoading, setBtnLoading] = useState(false);

	const signinUser = async (data: TCreateUserFormData) => {
		setBtnLoading(true); // Define o estado como true quando o login é iniciado
		try {
			await loginUser(data); // Chama o método de login
		} catch (error) {
			console.error("Erro no login:", error);
		} finally {
			setBtnLoading(false); // Define o estado como false após o login, independentemente do sucesso ou falha
		}
	};

	return (
		<section className="bg-gray-100 flex min-h-screen flex-col items-center justify-center p-24">
			<div className="flex flex-col items-center justify-center bg-primary w-[500px] h-[550px] rounded-md shadow-md m-4">
				<Image
					className="pointer-events-none select-none"
					src={Logo}
					width={200}
					alt="logo"
					unoptimized
				/>
				<h1 className="text-center text-2xl mt-2 mb-4">Login</h1>
				<form onSubmit={handleSubmit(signinUser)}>
					<InputUserForm
						htmlFor="email"
						labelTitle="Email"
						type="email"
						inputName="email"
						register={register}
						errors={errors}
					/>
					<InputUserForm
						htmlFor="password"
						labelTitle="Senha"
						type="password"
						inputName="password"
						register={register}
						errors={errors}
					/>

					{btnLoading ? (
						<button className="flex flex-row justify-center items-center btn btn-secondary w-[320px] mt-4 select-none shadow-md">
							{/* <span className="loading loading-dots loading-md"></span> */}
							<span className="loading loading-spinner loading-md"></span>
						</button>
					) : (
						<button
							type="submit"
							className="btn btn-secondary w-[320px] mt-4 select-none shadow-md">
							Entrar
						</button>
					)}
				</form>
			</div>
		</section>
	);
}

export default LoginPage;
