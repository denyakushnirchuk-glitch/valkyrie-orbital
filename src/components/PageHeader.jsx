import styles from './PageHeader.module.css'

export default function PageHeader({ eyebrow, title, children }) {
  return (
    <div className={styles.header}>
      {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
      <h1 className={styles.title}>{title}</h1>
      {children}
    </div>
  )
}