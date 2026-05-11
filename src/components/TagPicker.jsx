import { MISSION_TAGS } from '../lib/constants'
import styles from './TagPicker.module.css'

export default function TagPicker({ selected = [], onChange }) {
  const toggle = (tag) => {
    onChange(
      selected.includes(tag)
        ? selected.filter(t => t !== tag)
        : [...selected, tag]
    )
  }

  return (
    <div className={styles.grid}>
      {MISSION_TAGS.map(tag => (
        <button
          key={tag}
          type="button"
          onClick={() => toggle(tag)}
          className={selected.includes(tag) ? `${styles.tag} ${styles.active}` : styles.tag}
        >
          {tag}
        </button>
      ))}
    </div>
  )
}