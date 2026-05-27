import styles from './Badges.module.css'

export const TIER_OPTIONS = ['Capacidade', 'People', 'Custo', 'Qualidade', 'Processo', 'Outro']

const tierClass = {
  'Capacidade': styles.tierCapacidade,
  'People':     styles.tierPeople,
  'Custo':      styles.tierCusto,
  'Qualidade':  styles.tierQualidade,
  'Processo':   styles.tierProcesso,
  'Outro':      styles.tierOutro,
}

export function TierBadge({ value }) {
  if (!value) return <span className={styles.muted}>—</span>
  return <span className={`${styles.badge} ${tierClass[value] || styles.tierOutro}`}>{value}</span>
}

export function CritBadge({ value }) {
  const cls = { Alta: styles.alta, Média: styles.media, Baixa: styles.baixa }
  return <span className={`${styles.badge} ${cls[value] || styles.media}`}>{value}</span>
}

export function StatusBadge({ value }) {
  const cls = {
    'Pendente':      styles.pending,
    'Em andamento':  styles.progress,
    'Concluído':     styles.done,
    'Atrasado':      styles.late,
  }
  return <span className={`${styles.badge} ${cls[value] || styles.pending}`}>{value}</span>
}

export function EffectBadge({ value }) {
  if (value === '-') return <span className={styles.muted}>—</span>
  const cls = { Sim: styles.effectYes, Parcial: styles.effectPartial, 'Não': styles.effectNo }
  return <span className={`${styles.effectBase} ${cls[value] || styles.effectNo}`}>{value}</span>
}
