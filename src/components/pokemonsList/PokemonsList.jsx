import PokemonCard from "../pokemonCard/PokemonCard"
import styles from "./PokemonsList.module.css"

export default function PokemonsList({ pokemon }) {
    if (pokemon.length === 0) {
        return (
            <div className={styles.emptyState} role="status" aria-live="polite">
                <p>No Pokémon found. Try searching or selecting a type.</p>
            </div>
        )
    }

    return (
        <div className={styles.grid} role="region" aria-label="Pokémon list">
            {pokemon.map((poke) => (
                <PokemonCard key={poke.id} pokemon={poke} />
            ))}
        </div>
    )
}
