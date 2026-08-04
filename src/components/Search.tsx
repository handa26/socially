"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search as SearchIcon, X } from "lucide-react";
import Image from "next/image";

const Search = () => {
	const [query, setQuery] = useState("");
	const [isFocused, setIsFocused] = useState(false);
	const router = useRouter();

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		if (query.trim()) {
			router.push(`/search?q=${encodeURIComponent(query)}`);
			setQuery("");
		}
	};

	return (
		<form
			onSubmit={handleSearch}
			className={`relative transition-all duration-200 ${
				isFocused ? "w-full" : "w-full"
			}`}
		>
			<div className="relative">
				<SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-textGray w-5 h-5" />

				<input
					type="text"
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					onFocus={() => setIsFocused(true)}
					onBlur={() => setIsFocused(false)}
					placeholder="Search Socially"
					className="w-full bg-inputGray rounded-full py-3 pl-12 pr-10 text-sm 
                             border border-transparent focus:border-iconBlue 
                             focus:outline-none focus:bg-black transition"
				/>
				{query && (
					<button
						type="button"
						onClick={() => setQuery("")}
						className="absolute right-4 top-1/2 -translate-y-1/2 
                                 text-textGray hover:text-white transition"
					>
						<X className="w-4 h-4" />
					</button>
				)}
			</div>

			{/* Search suggestions - optional */}
			{isFocused && query && (
				<div
					className="absolute mt-2 w-full bg-black border border-borderGray 
                              rounded-xl shadow-lg overflow-hidden z-50"
				>
					<div className="p-4 text-textGray text-sm">
						<p>Search for users, posts, or hashtags</p>
						{/* You could add real search suggestions here */}
					</div>
				</div>
			)}
		</form>
	);
};

export default Search;
