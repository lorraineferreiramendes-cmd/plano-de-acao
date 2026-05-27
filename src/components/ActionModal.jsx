import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { TIER_OPTIONS } from './Badges'
import styles from './ActionModal.module.css'

const empty = {
  tier: '', acao: '', crit: 'Média', kpi: '', dono: '',
  data: '', prazo: '', status: 'Pendente', efeito: '-', obs: ''
}

export default function ActionModal({ open, onClose, onSave, initial }) {
  const [form, setForm] = useState(empty)

  useEffect(() => {
    setForm(initial ? { ...initial } : { ...empty })
  }, [initial, open])

  if (!open) return null

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handle = () => {
    if (!form.acao.trim()) return
    onSave(form)
    onClose()
  }

  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <span className={styles.title}>{initial ? 'Editar ação' : 'Nova ação'}</span>
          <button className={styles.close} onClick={onClose}><X size={16} /></button>
        </div>

        <div className={styles.body}>
          <div className={styles.grid}>
            <div className={styles.fullRow}>
              <label>Ação *</label>
              <input type="text" value={form.acao} onChange={e => set('acao', e.target.value)} placeholder="Descreva a ação..." className={styles.input} />
            </div>

            <div>
              <label>Tier</label>
              <select value={form.tier} onChange={e => set('tier', e.target.value)} className={styles.input}>
                <option value="">Selecione...</option>
                {TIER_OPTIONS.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>

            <div>
              <label>Criticidade</label>
              <select value={form.crit} onChange={e => set('crit', e.target.value)} className={styles.input}>
                <option>Alta</option>
                <option>Média</option>
                <option>Baixa</option>
              </select>
            </div>

            <div>
              <label>KPI relacionado</label>
              <input type="text" value={form.kpi} onChange={e => set('kpi', e.target.value)} placeholder="Ex: Taxa de conversão" className={styles.input} />
            </div>

            <div>
              <label>Dono da ação</label>
              <input type="text" value={form.dono} onChange={e => set('dono', e.target.value)} placeholder="Nome ou time" className={styles.input} />
            </div>

            <div>
              <label>Status</label>
              <select value={form.status} onChange={e => set('status', e.target.value)} className={styles.input}>
                <option>Pendente</option>
                <option>Em andamento</option>
                <option>Concluído</option>
                <option>Atrasado</option>
              </select>
            </div>

            <div>
              <label>Efeito observado</label>
              <select value={form.efeito} onChange={e => set('efeito', e.target.value)} className={styles.input}>
                <option value="-">Não avaliado</option>
                <option value="Sim">Sim — houve efeito</option>
                <option value="Parcial">Parcial</option>
                <option value="Não">Não — sem efeito</option>
              </select>
            </div>

            <div>
              <label>Data de início</label>
              <input type="date" value={form.data} onChange={e => set('data', e.target.value)} className={styles.input} />
            </div>

            <div>
              <label>Prazo (data limite)</label>
              <input type="date" value={form.prazo} onChange={e => set('prazo', e.target.value)} className={styles.input} />
            </div>

            <div className={styles.fullRow}>
              <label>Observações</label>
              <textarea value={form.obs} onChange={e => set('obs', e.target.value)} placeholder="Notas adicionais..." className={styles.textarea} rows={3} />
            </div>
          </div>
        </div>

        <div className={styles.footer}>
          <button className={styles.btnCancel} onClick={onClose}>Cancelar</button>
          <button className={styles.btnSave} onClick={handle}>Salvar ação</button>
        </div>
      </div>
    </div>
  )
}
