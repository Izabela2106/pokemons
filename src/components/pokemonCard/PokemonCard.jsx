import { Card, CardMedia, CardContent, Chip, Box } from "@mui/material"
import styles from "./PokemonCard.module.css"
import { COLORS_TYPE } from "../../consts"

export default function PokemonCard({ pokemon }) {
    const primaryType = pokemon.types[0]
    const primaryColor = COLORS_TYPE[primaryType] || "#A8A77A"
    const secondaryColor = pokemon.types[1] ? COLORS_TYPE[pokemon.types[1]] : primaryColor

    return (
        <Card
            className={styles.card}
            sx={{
                background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
                borderRadius: "16px",
                overflow: "hidden",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                cursor: "pointer",
                "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: "0 12px 24px rgba(0, 0, 0, 0.3)",
                },
            }}
            role="region"
            aria-label={`${pokemon.name} Pokémon card`}
        >
            <CardMedia
                component="img"
                image={pokemon.image || "/placeholder.svg"}
                alt={`${pokemon.name} sprite`}
                sx={{
                    height: 200,
                    objectFit: "contain",
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    padding: "16px",
                }}
            />

            <CardContent
                sx={{
                    padding: "16px",
                    backgroundColor: "rgba(0, 0, 0, 0.2)",
                }}
            >
                <h2 className={styles.name}>{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h2>
                <p className={styles.number}>#{String(pokemon.id).padStart(3, "0")}</p>

                <Box
                    sx={{
                        display: "flex",
                        gap: "8px",
                        flexWrap: "wrap",
                        marginTop: "12px",
                    }}
                    role="list"
                    aria-label="Pokémon types"
                >
                    {pokemon.types.map((type) => (
                        <Chip
                            key={type}
                            label={type.charAt(0).toUpperCase() + type.slice(1)}
                            size="small"
                            sx={{
                                backgroundColor: COLORS_TYPE[type],
                                color: "#ffffff",
                                fontWeight: "600",
                                fontSize: "12px",
                            }}
                            role="listitem"
                            aria-label={`Type: ${type}`}
                        />
                    ))}
                </Box>
            </CardContent>
        </Card>
    )
}
