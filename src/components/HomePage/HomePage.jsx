"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { TextField, CircularProgress, Button } from "@mui/material"
import PokemonsList from "../pokemonsList/PokemonsList"
import TypeFilters from "../typeFilters/TypeFilters"
import styles from "./HomePage.module.css"
import { COLORS_TYPE } from "../../consts"

const POKEMON_TYPES=Object.keys(COLORS_TYPE)

export default function HomePage() {
    const [pokemon, setPokemon] = useState([])
    const [search, setSearch] = useState("")
    const [selectedType, setSelectedType] = useState(null)
    const [loading, setLoading] = useState(false)
    const [offset, setOffset] = useState(0)
    const [hasMore, setHasMore] = useState(true)
    const debounceTimerRef = useRef()

    const fetchPokemon = async(newOffset, searchQuery = "") => {
            if (loading || !hasMore) return
            setLoading(true)
        try {
                let url
                if (searchQuery.trim()) {
                    setSelectedType(null)
                    const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=1400`)
                    if (response.ok) {
                        const data = await response.json()
                        const filteredPokemons = data.results.filter(pokemon=>pokemon.name.toLowerCase().includes(searchQuery.toLowerCase()))
                            const filteredData=await Promise.all(filteredPokemons
                            .map(async (p) => {
                            const res = await fetch(p.url)
                            const pokemonData = await res.json()
                            return {
                                id: pokemonData.id,
                                name: pokemonData.name,
                                image: pokemonData.sprites.other["official-artwork"].front_default || pokemonData.sprites.front_default,
                                types: pokemonData.types.map((t) => t.type.name),
                            }
                        }));
                        setPokemon(filteredData)
                        setHasMore(false)
                    } else {
                        setPokemon([])
                        setHasMore(false)
                    }
                } else if (selectedType) {
                    url = `https://pokeapi.co/api/v2/type/${selectedType}`
                    const response = await fetch(url)
                    const data = await response.json()
                    const pokemonList = data.pokemon.slice(0, 20).map((p) => ({
                        id: Number.parseInt(p.pokemon.url.split("/").filter(Boolean).pop()),
                        name: p.pokemon.name,
                        image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${Number.parseInt(p.pokemon.url.split("/").filter(Boolean).pop())}.png`,
                        types: [selectedType],
                    }))
                    setPokemon(pokemonList)
                    setHasMore(false)
                } else {
                    url = `https://pokeapi.co/api/v2/pokemon?limit=20&offset=${newOffset}`
                    const response = await fetch(url)
                    const data = await response.json()

                    const pokemonList = await Promise.all(
                        data.results.map(async (p) => {
                            const res = await fetch(p.url)
                            const pokemonData = await res.json()
                            return {
                                id: pokemonData.id,
                                name: pokemonData.name,
                                image: pokemonData.sprites.other["official-artwork"].front_default || pokemonData.sprites.front_default,
                                types: pokemonData.types.map((t) => t.type.name),
                            }
                        }),
                    )

                    setPokemon((prev) => (newOffset === 0 ? pokemonList : [...prev, ...pokemonList]))
                    setHasMore(data.next !== null)
                }
            } catch (error) {
                console.error("Error fetching Pokemon:", error)
                setHasMore(false)
            } finally {
                setLoading(false)
            }
        }

    const handleSearch = useCallback(
        (value) => {
            setSearch(value)

            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current)
            }

            debounceTimerRef.current = setTimeout(() => {
                setPokemon([])
                setOffset(0)
                setHasMore(true)
                fetchPokemon(0, value)
            }, 500)
        },
        [fetchPokemon],
    )

    const handleLoadMore = useCallback(() => {
        const newOffset = offset + 20
        setOffset(newOffset)
        fetchPokemon(newOffset, search)
    }, [offset, search, fetchPokemon])

    const handleTypeSelect = useCallback((type) => {
        setSelectedType(type)
        setPokemon([])
        setOffset(0)
        setHasMore(true)
        setSearch("")
    }, [])

    useEffect(() => {
        fetchPokemon(0, search)
    }, [hasMore, selectedType,search])

    return (
        <div className={styles.container}>
            <header className={styles.header} role="banner">
                <h1 className={styles.title}>
                    <span className={styles.pokeball}>⚪</span>
                    Pokémon Explorer
                </h1>
            </header>

            <div className={styles.content}>
                <div className={styles.searchContainer}>
                    <TextField
                        fullWidth
                        placeholder="Search Pokémon..."
                        value={search}
                        onChange={(e) => handleSearch(e.target.value)}
                        className={styles.searchInput}
                        inputProps={{
                            "aria-label": "Search Pokémon by name",
                            role: "searchbox",
                        }}
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                color: "#ffffff",
                                backgroundColor: "#1a1a1a",
                                "& fieldset": {
                                    borderColor: "#333333",
                                },
                                "&:hover fieldset": {
                                    borderColor: "#666666",
                                },
                            },
                            "& .MuiOutlinedInput-input::placeholder": {
                                color: "#888888",
                                opacity: 0.7,
                            },
                        }}
                    />
                </div>

                <TypeFilters types={POKEMON_TYPES} selectedType={selectedType} onTypeSelect={handleTypeSelect} />

                <PokemonsList pokemon={pokemon} />

                {!search && hasMore && (
                    <div className={styles.loadMoreContainer}>
                        <Button
                            variant="contained"
                            onClick={handleLoadMore}
                            disabled={loading}
                            sx={{
                                backgroundColor: "#2962FF",
                                color: "#ffffff",
                                padding: "12px 32px",
                                fontSize: "16px",
                                "&:hover": {
                                    backgroundColor: "#1e53e5",
                                },
                                "&:disabled": {
                                    backgroundColor: "#666666",
                                    color: "#cccccc",
                                },
                            }}
                            aria-label="Load more Pokémon"
                        >
                            {loading ? <CircularProgress size={24} /> : "Load More"}
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}
