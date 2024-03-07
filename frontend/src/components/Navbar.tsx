"use client";

import { useContext } from "react";
import Image from "next/image";
import Link from "next/link";

import api from "@/utils/api";

// Icons
import {
	BiTrophy,
	BiMedal,
	BiHomeSmile,
	BiBuildingHouse,
} from "react-icons/Bi";
import { MdOutlineStore } from "react-icons/md";
import { Currency, Dashboard, Blockchain } from "@icon-park/react";
import {
	LuTags,
	LuLayoutDashboard,
	LuSettings,
	LuLogIn,
	LuLogOut,
} from "react-icons/lu";
import { PiGraphBold } from "react-icons/pi";
import {
	RiAccountPinCircleLine,
	RiAccountBoxLine,
	RiAccountPinBoxLine,
} from "react-icons/ri";
import { GiMushroomHouse } from "react-icons/gi";
import { RiAuctionLine, RiCopperCoinLine } from "react-icons/ri";
import { RxHamburgerMenu } from "react-icons/rx";
import { FiUserPlus } from "react-icons/fi";
import { ImMakeGroup } from "react-icons/im";
import { HiOutlineGiftTop } from "react-icons/hi2";
import { MdOutlineLocalActivity, MdCyclone } from "react-icons/md";

// Imagens
import Logo from "../../public/logo.png";
import imageProfile from "../../public/Kon.jpg";

// Context
import { Context } from "@/context/UserContext";

function Navbar() {
	const { userAuthenticated, logout } = useContext(Context);

	return (
		<header className="w-full">
			{userAuthenticated ? (
				<nav>
					<div className="navbar bg-base-200">
						<div className="flex-1 ml-10">
							<Image
								src={Logo}
								width={50}
								alt=""
								unoptimized
								priority
							/>
						</div>
						<div className="flex-auto hidden md:flex">
							{/* Mostrar em tamanhos md e maiores */}
							<ul className="flex flex-row gap-4">
								<li>
									<Link
										href="/"
										className="btn btn-ghost normal-case flex flex-row items-center text-white">
										<BiHomeSmile size={18} />
										Home
									</Link>
								</li>

								<li>
									<Link
										href="/otamart"
										className="btn btn-ghost normal-case flex flex-row items-center justify-center text-white">
										<MdOutlineStore size={18} />
										OtaMart
									</Link>
								</li>

								<li>
									<Link
										href="/cashback"
										className="btn btn-ghost normal-case flex flex-row items-center text-white">
										<Currency size={18} />
										Cashback
									</Link>
								</li>

								<li>
									<Link
										href="/otaclub"
										className="btn btn-ghost normal-case flex flex-row items-center justify-center text-white">
										<ImMakeGroup size={15} />
										OtaClub
									</Link>
								</li>

								{/* <li>
									<Link
										href="/auction"
										className="btn btn-ghost normal-case flex flex-row items-center justify-center text-white">
										<RiAuctionLine size={18} />
										Auction
									</Link>
								</li> */}

								{/* <li className="indicator">
									<Link
										href="/otakrowdfunding"
										className="btn btn-ghost normal-case flex flex-row items-center text-white">
										<PiGraphBold size={18} />
										<span className="indicator-item badge badge-error">
											new
										</span>
										Otakrowdfunding
									</Link>
								</li> */}

								<li>
									<Link
										href="/cupons"
										className="btn btn-ghost normal-case flex flex-row items-center text-white">
										<LuTags size={18} />
										Cupons
									</Link>
								</li>

								{/* <li>
									<Link
										href="/cupons"
										className="btn btn-ghost normal-case flex flex-row items-center text-white">
										<BiBuildingHouse size={18} />
										OtaHome
									</Link>
								</li> */}

								<li>
									<Link
										href="/dashboard"
										className="btn btn-ghost normal-case flex flex-row items-center text-white">
										<LuLayoutDashboard size={18} />
										Dashboard
									</Link>
								</li>

								<div className="mr-8">
									<div className="dropdown">
										<div
											tabIndex={0}
											role="button"
											className="btn btn-ghost btn-circle">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="h-5 w-5"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor">
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth="2"
													d="M4 6h16M4 12h16M4 18h7"
												/>
											</svg>
										</div>
										<ul
											tabIndex={0}
											className="menu menu-sm dropdown-content mt-4 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
											<li>
												<a className="flex flex-row items-center justify-between text-white">
													<span className="flex flex-row items-center gap-2">
														<RiCopperCoinLine
															size={18}
														/>
														OtaClub
													</span>

													<span className="badge border border-white">
														New
													</span>
												</a>
											</li>
											<li>
												<a className="flex flex-row items-center justify-between text-white">
													<span className="flex flex-row items-center gap-2">
														<Blockchain size={18} />
														Blockchain
													</span>

													<span className="badge border border-white">
														New
													</span>
												</a>
											</li>
											<li>
												<a className="flex flex-row items-center justify-between text-white">
													<span className="flex flex-row items-center gap-2">
														<ImMakeGroup
															size={16}
														/>
														OtaClub 2
													</span>

													<span className="badge border border-white">
														New
													</span>
												</a>
											</li>
											<li>
												<a className="flex flex-row items-center justify-between text-white">
													<span className="flex flex-row items-center gap-2">
														<HiOutlineGiftTop
															size={20}
														/>
														Gift Card
													</span>

													<span className="badge border border-white">
														New
													</span>
												</a>
											</li>
											<li>
												<a className="flex flex-row items-center justify-between text-white">
													<span className="flex flex-row items-center gap-2">
														<MdCyclone size={20} />
														Sorteios
													</span>

													<span className="badge border border-white">
														New
													</span>
												</a>
											</li>
											<li>
												<a className="flex flex-row items-center justify-between text-white">
													<span className="flex flex-row items-center gap-2">
														<MdOutlineLocalActivity
															size={20}
														/>
														Sorteios
													</span>

													<span className="badge border border-white">
														New
													</span>
												</a>
											</li>
										</ul>
									</div>
								</div>
							</ul>
						</div>
						{/* <div className="md:hidden">
						<div className="flex-none">
							<button className="btn btn-square btn-ghost">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									className="inline-block w-5 h-5 stroke-current">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M4 6h16M4 12h16M4 18h16"></path>
								</svg>
							</button>
						</div>
					</div> */}
						<div className="flex-none gap-2 mr-10">
							<div className="dropdown dropdown-end mt-2">
								<label
									tabIndex={0}
									className="btn btn-ghost btn-circle avatar ring ring-success ring-offset-base-100">
									<div className="w-10 rounded-full">
										<Image src={imageProfile} alt="" />
									</div>
								</label>
								<ul
									tabIndex={0}
									className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
									{/* <li>
										<Link
											className="flex flex-row items-center justify-between text-white"
											href="/dashboard/myprofile">
											<span className="flex flex-row items-center gap-2">
												<RiAccountPinBoxLine
													size={18}
												/>
												Perfil
											</span>

											<span className="badge border border-white">
												New
											</span>
										</Link>
									</li> */}

									<li>
										<Link
											className="flex flex-row items-center justify-between text-white"
											href="/dashboard/myprofile">
											<span className="flex flex-row items-center gap-2">
												<LuSettings size={18} />
												Configurações
											</span>

											<span className="badge border border-white">
												New
											</span>
										</Link>
									</li>

									<li>
										<a className="flex flex-row items-center justify-between text-white">
											<span
												className="flex flex-row items-center gap-2"
												onClick={logout}>
												<LuLogOut size={18} />
												Logout
											</span>
										</a>
									</li>
								</ul>
							</div>
						</div>
					</div>
				</nav>
			) : (
				<nav>
					<div className="navbar bg-base-200">
						<div className="flex-1 ml-10">
							<Image
								src={Logo}
								width={50}
								alt=""
								unoptimized
								priority
							/>
						</div>
						<div className="flex-auto hidden md:flex">
							{/* Mostrar em tamanhos md e maiores */}
							<ul className="flex flex-row gap-4">
								<li>
									<Link
										href="/"
										className="btn btn-ghost normal-case flex flex-row items-center text-white">
										<BiHomeSmile size={18} />
										Home
									</Link>
								</li>

								<li>
									<Link
										href="/otamart"
										className="btn btn-ghost normal-case flex flex-row items-center justify-center text-white">
										<MdOutlineStore size={18} />
										OtaMart
									</Link>
								</li>

								<li>
									<Link
										href="/cashback"
										className="btn btn-ghost normal-case flex flex-row items-center text-white">
										<Currency size={18} />
										Cashback
									</Link>
								</li>

								{/* <li>
									<Link
										href="/auction"
										className="btn btn-ghost normal-case flex flex-row items-center justify-center text-white">
										<RiAuctionLine size={18} />
										Auction
									</Link>
								</li> */}

								{/* <li className="indicator">
									<Link
										href="/otakrowdfunding"
										className="btn btn-ghost normal-case flex flex-row items-center text-white">
										<PiGraphBold size={18} />
										<span className="indicator-item badge badge-error">
											new
										</span>
										Otakrowdfunding
									</Link>
								</li> */}

								<li>
									<Link
										href="/cupons"
										className="btn btn-ghost normal-case flex flex-row items-center text-white">
										<LuTags size={18} />
										Cupons
									</Link>
								</li>

								<div className="mr-8">
									<div className="dropdown">
										<div
											tabIndex={0}
											role="button"
											className="btn btn-ghost btn-circle">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="h-5 w-5"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor">
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth="2"
													d="M4 6h16M4 12h16M4 18h7"
												/>
											</svg>
										</div>
										<ul
											tabIndex={0}
											className="menu menu-sm dropdown-content mt-4 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
											<li>
												<a className="flex flex-row items-center justify-between text-white">
													<span className="flex flex-row items-center gap-2">
														<RiCopperCoinLine
															size={18}
														/>
														OtaClub
													</span>

													<span className="badge border border-white">
														New
													</span>
												</a>
											</li>
											<li>
												<a className="flex flex-row items-center justify-between text-white">
													<span className="flex flex-row items-center gap-2">
														<Blockchain size={18} />
														Blockchain
													</span>

													<span className="badge border border-white">
														New
													</span>
												</a>
											</li>
										</ul>
									</div>
								</div>

								{/* <li>
									<Link
										href="/cupons"
										className="btn btn-ghost normal-case flex flex-row items-center text-white">
										<BiBuildingHouse size={18} />
										OtaHome
									</Link>
								</li> */}

								<li>
									<Link
										href="/login"
										className="btn btn-ghost normal-case flex flex-row items-center text-white">
										<LuLogIn size={18} />
										Login
									</Link>
								</li>
								<li>
									<Link
										href="/register"
										className="btn btn-ghost normal-case flex flex-row items-center text-white">
										<FiUserPlus size={18} />
										Cadastre-se
									</Link>
								</li>
							</ul>
						</div>
						{/* <div className="md:hidden">
						<div className="flex-none">
							<button className="btn btn-square btn-ghost">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									className="inline-block w-5 h-5 stroke-current">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M4 6h16M4 12h16M4 18h16"></path>
								</svg>
							</button>
						</div>
					</div> */}
					</div>
				</nav>
			)}
		</header>
	);
}

export { Navbar };