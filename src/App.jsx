import { useState, useMemo } from 'react'
import { Plus, Download, Search, SlidersHorizontal, Pencil, Trash2, AlertTriangle, Clock, CheckCircle2, ListTodo } from 'lucide-react'
import ActionModal from './components/ActionModal'
import { CritBadge, StatusBadge, EffectBadge, TierBadge, TIER_OPTIONS } from './components/Badges'
import styles from './App.module.css'

const INITIAL_ACTIONS = [
  { id: 1, tier: 'Capacidade', acao: 'Revisar processo de onboarding', crit: 'Alta', kpi: 'Churn 30 dias', dono: 'Produto', data: '2026-05-01', prazo: '2026-06-15', status: 'Em andamento', efeito: '-', obs: '' },
  { id: 2, tier: 'People', acao: 'Campanha de reengajamento email', crit: 'Média', kpi: 'Taxa de abertura', dono: 'Marketing', data: '2026-04-10', prazo: '2026-05-20', status: 'Concluído', efeito: 'Sim', obs: 'Abertura subiu 12%' },
  { id: 3, tier: 'Custo', acao: 'Otimizar checkout mobile', crit: 'Alta', kpi: 'Conversão mobile', dono: 'Tech', data: '2026-04-01', prazo: '2026-05-10', status: 'Atrasado', efeito: 'Não', obs: '' },
  { id: 4, tier: 'Qualidade', acao: 'Atualizar FAQ de suporte', crit: 'Baixa', kpi: 'CSAT', dono: 'CS', data: '2026-05-10', prazo: '2026-07-01', status: 'Pendente', efeito: '-', obs: '' },
]

function fmtDate(d) {
  if (!d) return '—'
  const [y, m, day] = d.split('-')
  return `${day}/${m}/${y.slice(2)}`
}

function prazoInfo(prazo, status) {
  if (!prazo) return { label: '—', cls: '' }
  if (status === 'Concluído') return { label: fmtDate(prazo), cls: '' }
  const hoje = new Date(); hoje.setHours(0, 0, 0, 0)
  const diff = Math.round((new Date(prazo + 'T00:00:00') - hoje) / 86400000)
  if (diff < 0) return { label: fmtDate(prazo) + ' ⚠', cls: styles.prazoLate }
  if (diff <= 7) return { label: `${fmtDate(prazo)} (${diff}d)`, cls: styles.prazoSoon }
  return { label: fmtDate(prazo), cls: styles.prazoOk }
}

let nextId = 100

export default function App() {
  const [actions, setActions] = useState(INITIAL_ACTIONS)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [search, setSearch] = useState('')
  const [filterTier, setFilterTier] = useState('')
  const [filterCrit, setFilterCrit] = useState('')
  const [filterStatus, setFilterStatus] = useState('')

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return actions.filter(a =>
      (!q || a.acao.toLowerCase().includes(q) || a.dono.toLowerCase().includes(q)) &&
      (!filterTier || a.tier === filterTier) &&
      (!filterCrit || a.crit === filterCrit) &&
      (!filterStatus || a.status === filterStatus)
    )
  }, [actions, search, filterTier, filterCrit, filterStatus])

  const summary = useMemo(() => {
    const hoje = new Date(); hoje.setHours(0, 0, 0, 0)
    return {
      total: actions.length,
      alta: actions.filter(a => a.crit === 'Alta').length,
      atrasadas: actions.filter(a => a.status === 'Atrasado').length,
      vence7: actions.filter(a => {
        if (!a.prazo || a.status === 'Concluído') return false
        const diff = Math.round((new Date(a.prazo + 'T00:00:00') - hoje) / 86400000)
        return diff >= 0 && diff <= 7
      }).length,
      concluidas: actions.filter(a => a.status === 'Concluído').length,
    }
  }, [actions])

  const openNew = () => { setEditing(null); setModalOpen(true) }
  const openEdit = (a) => { setEditing(a); setModalOpen(true) }

  const handleSave = (form) => {
    if (editing) {
      setActions(prev => prev.map(a => a.id === editing.id ? { ...form, id: editing.id } : a))
    } else {
      setActions(prev => [...prev, { ...form, id: nextId++ }])
    }
  }

  const handleDelete = (id) => setActions(prev => prev.filter(a => a.id !== id))

  const exportCSV = () => {
    const header = ['Tier', 'Ação', 'Criticidade', 'KPI', 'Dono', 'Data de início', 'Prazo', 'Status', 'Efeito observado', 'Observações']
    const rows = actions.map(a => [a.tier, a.acao, a.crit, a.kpi, a.dono, a.data, a.prazo, a.status, a.efeito === '-' ? 'Não avaliado' : a.efeito, a.obs])
    const csv = [header, ...rows].map(r => r.map(v => `"${(v || '').replace(/"/g, '""')}"`).join(',')).join('\n')
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = 'plano-de-acao-campinas.csv'; a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className={styles.app}>
      <div className={styles.container}>

        <header className={styles.header}>
          <div>
            <h1 className={styles.title}>Plano de Ação — Campinas</h1>
            <p className={styles.subtitle}>Gerencie ações, prazos e resultados por Tier</p>
          </div>
          <div className={styles.headerActions}>
            <button className={styles.btnExport} onClick={exportCSV}>
              <Download size={14} /> Exportar CSV
            </button>
            <button className={styles.btnNew} onClick={openNew}>
              <Plus size={14} /> Nova ação
            </button>
          </div>
        </header>

        <div className={styles.metrics}>
          <div className={styles.metric}>
            <ListTodo size={16} className={styles.metricIcon} />
            <div>
              <div className={styles.metricVal}>{summary.total}</div>
              <div className={styles.metricLabel}>Total</div>
            </div>
          </div>
          <div className={`${styles.metric} ${styles.metricRed}`}>
            <AlertTriangle size={16} className={styles.metricIcon} />
            <div>
              <div className={styles.metricVal}>{summary.alta}</div>
              <div className={styles.metricLabel}>Alta criticidade</div>
            </div>
          </div>
          <div className={`${styles.metric} ${styles.metricAmber}`}>
            <Clock size={16} className={styles.metricIcon} />
            <div>
              <div className={styles.metricVal}>{summary.vence7}</div>
              <div className={styles.metricLabel}>Vencem em 7 dias</div>
            </div>
          </div>
          <div className={`${styles.metric} ${styles.metricRed}`}>
            <AlertTriangle size={16} className={styles.metricIcon} />
            <div>
              <div className={styles.metricVal}>{summary.atrasadas}</div>
              <div className={styles.metricLabel}>Atrasadas</div>
            </div>
          </div>
          <div className={`${styles.metric} ${styles.metricGreen}`}>
            <CheckCircle2 size={16} className={styles.metricIcon} />
            <div>
              <div className={styles.metricVal}>{summary.concluidas}</div>
              <div className={styles.metricLabel}>Concluídas</div>
            </div>
          </div>
        </div>

        <div className={styles.toolbar}>
          <div className={styles.searchWrap}>
            <Search size={14} className={styles.searchIcon} />
            <input
              className={styles.searchInput}
              type="text"
              placeholder="Buscar por ação ou dono..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className={styles.filters}>
            <SlidersHorizontal size={13} className={styles.filterIcon} />
            <select className={styles.select} value={filterTier} onChange={e => setFilterTier(e.target.value)}>
              <option value="">Tier</option>
              {TIER_OPTIONS.map(t => <option key={t}>{t}</option>)}
            </select>
            <select className={styles.select} value={filterCrit} onChange={e => setFilterCrit(e.target.value)}>
              <option value="">Criticidade</option>
              <option>Alta</option><option>Média</option><option>Baixa</option>
            </select>
            <select className={styles.select} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
              <option value="">Status</option>
              <option>Pendente</option><option>Em andamento</option><option>Concluído</option><option>Atrasado</option>
            </select>
          </div>
        </div>

        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Tier</th>
                <th>Ação</th>
                <th>Criticidade</th>
                <th>KPI</th>
                <th>Dono</th>
                <th>Início</th>
                <th>Prazo</th>
                <th>Status</th>
                <th>Efeito</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={10} className={styles.empty}>
                    <ListTodo size={24} />
                    <span>Nenhuma ação encontrada</span>
                  </td>
                </tr>
              ) : filtered.map(a => {
                const p = prazoInfo(a.prazo, a.status)
                return (
                  <tr key={a.id} className={styles.row} onClick={() => openEdit(a)}>
                    <td><TierBadge value={a.tier} /></td>
                    <td className={styles.tdAcao}>
                      <span className={styles.acaoText}>{a.acao}</span>
                      {a.obs && <span className={styles.obs}>{a.obs}</span>}
                    </td>
                    <td><CritBadge value={a.crit} /></td>
                    <td className={styles.tdMuted}>{a.kpi || '—'}</td>
                    <td className={styles.tdMuted}>{a.dono || '—'}</td>
                    <td className={styles.tdMuted}>{fmtDate(a.data)}</td>
                    <td className={p.cls}>{p.label}</td>
                    <td><StatusBadge value={a.status} /></td>
                    <td><EffectBadge value={a.efeito} /></td>
                    <td className={styles.tdActions} onClick={e => e.stopPropagation()}>
                      <button className={styles.btnIcon} onClick={() => openEdit(a)} title="Editar"><Pencil size={13} /></button>
                      <button className={`${styles.btnIcon} ${styles.btnDel}`} onClick={() => handleDelete(a.id)} title="Remover"><Trash2 size={13} /></button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <div className={styles.footer}>
          {filtered.length} de {actions.length} ações
        </div>
      </div>

      <ActionModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        initial={editing}
      />
    </div>
  )
}
