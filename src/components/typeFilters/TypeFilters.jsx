import { Chip } from "@mui/material"
import styles from "./TypeFilter.module.css"
import { COLORS_TYPE } from "../../consts"

export default function TypeFilters({ types, selectedType, onTypeSelect }) {
    return (
        <div className={styles.container} role="region" aria-label="Filter Pokémon by type">
            <div className={styles.filterChips}>
                <Chip
                    label="All"
                    onClick={() => onTypeSelect(null)}
                    variant="filled"
                    sx={{
                        backgroundColor: selectedType === null ? "#2962FF" : "transparent",
                        color: "#fff",
                        borderColor: selectedType === null ? "#2962FF" : "#444444",
                        border:2,
                        cursor: "pointer",
                        "&:hover": {
                            backgroundColor: selectedType === null ? "#1e53e5" : "#1a1a1a",
                        },
                    }}
                    aria-pressed={selectedType === null}
                    aria-label="Show all Pokémon"
                />

                {types.map((type) => (
                    <Chip
                        key={type}
                        label={type.charAt(0).toUpperCase() + type.slice(1)}
                        onClick={() => onTypeSelect(selectedType === type ? null : type)}
                        variant="filled"
                        sx={{
                            backgroundColor: COLORS_TYPE[type],
                            color: "#fff",
                            borderColor: selectedType === type ? COLORS_TYPE[type]: "#fff",
                            cursor: "pointer",
                            "&:hover": {
                                backgroundColor: selectedType === type ? COLORS_TYPE[type] : "#1a1a1a",
                            },
                            border:2
                        }}
                        aria-pressed={selectedType === type}
                        aria-label={`Filter by ${type} type`}
                    />
                ))}
            </div>
        </div>
    )
}
